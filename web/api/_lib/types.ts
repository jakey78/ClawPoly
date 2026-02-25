export interface Evidence {
  chainId: number;
  blockNumber: number;
  txHash?: string;
  address?: string;
  topic0?: string;
}

export interface DataPointer {
  method: string;
  params: Record<string, unknown>;
}

export interface ProofBundle {
  responseHash: string;
  evidence: Evidence[];
  dataPointers: DataPointer[];
  timestamp: string;
}

export interface SearchResponse<T = unknown> {
  success: boolean;
  data: T;
  proof: ProofBundle;
  receipt?: OffchainReceipt;
}

export interface OffchainReceipt {
  queryHash: string;
  responseHash: string;
  evidenceRoot: string;
  timestamp: string;
  onchain: boolean;
  txHash?: string;
}

export interface PaymentRequiredInfo {
  version: "x402-v1";
  network: string;
  chainId: number;
  payTo: string;
  token: string;
  tokenSymbol: string;
  tokenDecimals: number;
  amount: string;
  endpointId: string;
  description: string;
}

export interface PaymentPayload {
  from: string;
  to: string;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: string;
  signature: string;
}

export interface EndpointInfo {
  id: string;
  name: string;
  description: string;
  tags: string;
  enabled: boolean;
  price: string;
  priceFormatted: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface PolygonScanTx {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: string;
  timeStamp: string;
  gasUsed: string;
  gasPrice: string;
  isError: string;
  functionName: string;
  methodId: string;
}

export interface PolygonScanTokenTx {
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  contractAddress: string;
  blockNumber: string;
  timeStamp: string;
}
