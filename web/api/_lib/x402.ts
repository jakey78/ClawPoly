import type { VercelRequest } from "@vercel/node";
import type { PaymentRequiredInfo, PaymentPayload } from "./types";

const USDC_POLYGON = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

// In-memory nonce set to prevent replay attacks
const usedNonces = new Set<string>();

// Endpoint price map (loaded from env or defaults)
const ENDPOINT_PRICES: Record<string, bigint> = {
  "search/tx": 1000n,       // $0.001
  "search/address": 2000n,  // $0.002
  "search/contract": 1500n, // $0.0015
  "search/logs": 1000n,     // $0.001
};

export function getPayToAddress(): string {
  return process.env.X402_PAY_TO_ADDRESS || "0x0000000000000000000000000000000000000000";
}

export function createPaymentRequired(endpointId: string, customPrice?: bigint): PaymentRequiredInfo {
  const price = customPrice ?? ENDPOINT_PRICES[endpointId] ?? 1000n;

  return {
    version: "x402-v1",
    network: "eip155:137",
    chainId: 137,
    payTo: getPayToAddress(),
    token: USDC_POLYGON,
    tokenSymbol: "USDC",
    tokenDecimals: 6,
    amount: price.toString(),
    endpointId,
    description: `ClawPoly API access: ${endpointId}`,
  };
}

export function send402Response(res: any, endpointId: string, customPrice?: bigint) {
  const paymentInfo = createPaymentRequired(endpointId, customPrice);
  const encoded = Buffer.from(JSON.stringify(paymentInfo)).toString("base64");

  res.setHeader("PAYMENT-REQUIRED", encoded);
  res.setHeader("Content-Type", "application/json");
  return res.status(402).json({
    error: "Payment Required",
    message: `This endpoint requires payment. Amount: ${paymentInfo.amount} USDC micro-units ($${(Number(paymentInfo.amount) / 1_000_000).toFixed(6)})`,
    paymentInfo,
  });
}

export function extractPayment(req: VercelRequest): PaymentPayload | null {
  const header = req.headers["payment-signature"] || req.headers["x-payment-signature"];
  if (!header || typeof header !== "string") return null;

  try {
    const decoded = Buffer.from(header, "base64").toString("utf-8");
    return JSON.parse(decoded) as PaymentPayload;
  } catch {
    return null;
  }
}

export function verifyPayment(
  payment: PaymentPayload,
  endpointId: string
): { valid: boolean; reason?: string } {
  // Check nonce hasn't been used (replay protection)
  if (usedNonces.has(payment.nonce)) {
    return { valid: false, reason: "Nonce already used" };
  }

  // Check payment recipient matches
  const expectedPayTo = getPayToAddress().toLowerCase();
  if (payment.to.toLowerCase() !== expectedPayTo) {
    return { valid: false, reason: "Invalid payment recipient" };
  }

  // Check amount meets minimum
  const requiredAmount = ENDPOINT_PRICES[endpointId] ?? 1000n;
  if (BigInt(payment.value) < requiredAmount) {
    return { valid: false, reason: `Insufficient payment. Required: ${requiredAmount}, received: ${payment.value}` };
  }

  // Check timing
  const now = Math.floor(Date.now() / 1000);
  if (payment.validBefore && Number(payment.validBefore) < now) {
    return { valid: false, reason: "Payment authorization expired" };
  }
  if (payment.validAfter && Number(payment.validAfter) > now) {
    return { valid: false, reason: "Payment authorization not yet valid" };
  }

  // Mark nonce as used
  usedNonces.add(payment.nonce);

  // Periodically clean old nonces (keep last 10000)
  if (usedNonces.size > 10000) {
    const toRemove = Array.from(usedNonces).slice(0, 5000);
    toRemove.forEach((n) => usedNonces.delete(n));
  }

  return { valid: true };
}

/**
 * Middleware-like function to enforce x402 payment.
 * Returns true if paid, false if 402 was sent.
 */
export function enforceX402(
  req: VercelRequest,
  res: any,
  endpointId: string,
  customPrice?: bigint
): boolean {
  const payment = extractPayment(req);

  if (!payment) {
    send402Response(res, endpointId, customPrice);
    return false;
  }

  const verification = verifyPayment(payment, endpointId);
  if (!verification.valid) {
    res.status(402).json({
      error: "Payment Invalid",
      message: verification.reason,
    });
    return false;
  }

  // Payment verified — add settlement receipt header
  const receiptData = {
    settled: true,
    from: payment.from,
    amount: payment.value,
    endpointId,
    timestamp: new Date().toISOString(),
  };
  res.setHeader(
    "PAYMENT-RESPONSE",
    Buffer.from(JSON.stringify(receiptData)).toString("base64")
  );

  return true;
}
