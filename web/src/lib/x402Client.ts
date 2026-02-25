/**
 * Client-side x402 payment flow.
 *
 * 1. Caller sends a search request.
 * 2. If the API responds 402, the body contains payment info.
 * 3. The client signs an EIP-712 `transferWithAuthorization` permit.
 * 4. The client retries the request with the X-PAYMENT header.
 */

import { type WalletClient, encodeFunctionData, parseAbi } from "viem";

export interface PaymentRequiredInfo {
  payTo: string;           // recipient address
  amount: string;          // USDC micro-units as string
  token: string;           // USDC contract address
  network: string;         // "eip155:137"
  endpointId: string;
  nonce: string;
  validAfter: string;
  validBefore: string;
  extra?: Record<string, unknown>;
}

// EIP-3009 transferWithAuthorization types
const TRANSFER_WITH_AUTH_TYPES = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const;

// USDC on Polygon (EIP-3009 domain)
const USDC_DOMAIN = {
  name: "USD Coin",
  version: "2",
  chainId: 137,
  verifyingContract: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" as `0x${string}`,
} as const;

export interface PaymentPayload {
  signature: string;
  from: string;
  to: string;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: string;
}

/**
 * Parse a 402 response body into PaymentRequiredInfo.
 */
export function parsePaymentRequired(body: unknown): PaymentRequiredInfo {
  const b = body as Record<string, unknown>;
  // Server sends { error, message, paymentInfo: { payTo, amount, token, ... } }
  const info = (b.paymentInfo as Record<string, unknown>) || b;
  if (!info.payTo || !info.amount || !info.token) {
    throw new Error("Invalid 402 response body");
  }
  const nonce = (info.nonce as string) ||
    `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, "0")).join("")}`;
  return {
    payTo: info.payTo as string,
    amount: String(info.amount),
    token: info.token as string,
    network: (info.network as string) || "eip155:137",
    endpointId: (info.endpointId as string) || "",
    nonce,
    validAfter: (info.validAfter as string) || "0",
    validBefore: (info.validBefore as string) || String(Math.floor(Date.now() / 1000) + 3600),
  };
}

/**
 * Sign an EIP-712 transferWithAuthorization for USDC payment.
 */
export async function signPayment(
  walletClient: WalletClient,
  info: PaymentRequiredInfo,
): Promise<PaymentPayload> {
  const from = walletClient.account?.address;
  if (!from) throw new Error("No wallet account connected");

  const message = {
    from: from as `0x${string}`,
    to: info.payTo as `0x${string}`,
    value: BigInt(info.amount),
    validAfter: BigInt(info.validAfter),
    validBefore: BigInt(info.validBefore),
    nonce: info.nonce as `0x${string}`,
  };

  const signature = await walletClient.signTypedData({
    account: walletClient.account!,
    domain: USDC_DOMAIN,
    types: TRANSFER_WITH_AUTH_TYPES,
    primaryType: "TransferWithAuthorization",
    message,
  });

  return {
    signature,
    from,
    to: info.payTo,
    value: info.amount,
    validAfter: info.validAfter,
    validBefore: info.validBefore,
    nonce: info.nonce,
  };
}

/**
 * Encode a transferWithAuthorization calldata (useful for submitting tx).
 */
export function encodeTransferWithAuth(payload: PaymentPayload): `0x${string}` {
  const abi = parseAbi([
    "function transferWithAuthorization(address from, address to, uint256 value, uint256 validAfter, uint256 validBefore, bytes32 nonce, uint8 v, bytes32 r, bytes32 s)",
  ]);

  // Split signature into v, r, s
  const sig = payload.signature as `0x${string}`;
  const r = `0x${sig.slice(2, 66)}` as `0x${string}`;
  const s = `0x${sig.slice(66, 130)}` as `0x${string}`;
  const v = parseInt(sig.slice(130, 132), 16);

  return encodeFunctionData({
    abi,
    functionName: "transferWithAuthorization",
    args: [
      payload.from as `0x${string}`,
      payload.to as `0x${string}`,
      BigInt(payload.value),
      BigInt(payload.validAfter),
      BigInt(payload.validBefore),
      payload.nonce as `0x${string}`,
      v,
      r,
      s,
    ],
  });
}

/**
 * High-level: fetch a paid endpoint. Handles 402 → sign → retry.
 */
export async function fetchWithPayment(
  url: string,
  params: Record<string, string>,
  walletClient: WalletClient | null,
): Promise<{ data: unknown; paymentPayload?: PaymentPayload }> {
  const qs = new URLSearchParams(params).toString();
  const fullUrl = `${url}?${qs}`;

  // First attempt
  const res1 = await fetch(fullUrl);
  if (res1.ok) {
    return { data: await res1.json() };
  }

  if (res1.status !== 402) {
    const err = await res1.json().catch(() => ({ error: res1.statusText }));
    throw new Error((err as { error: string }).error || `HTTP ${res1.status}`);
  }

  // 402 → need payment
  if (!walletClient) {
    throw new Error("Wallet not connected. Connect your wallet to pay for this query.");
  }

  const paymentInfo = parsePaymentRequired(await res1.json());
  const paymentPayload = await signPayment(walletClient, paymentInfo);

  // Retry with payment header (base64-encoded JSON, matching server's extractPayment)
  const paymentEncoded = btoa(JSON.stringify(paymentPayload));
  const res2 = await fetch(fullUrl, {
    headers: {
      "x-payment-signature": paymentEncoded,
    },
  });

  if (!res2.ok) {
    const err = await res2.json().catch(() => ({ error: res2.statusText }));
    throw new Error((err as { error: string }).error || `HTTP ${res2.status}`);
  }

  return { data: await res2.json(), paymentPayload };
}
