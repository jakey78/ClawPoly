// Shared frontend types

export interface Evidence {
  chainId: number;
  blockNumber: number;
  txHash?: string;
  address?: string;
  topic0?: string;
}

export interface ProofBundle {
  queryHash: string;
  responseHash: string;
  evidenceRoot: string;
  evidence: Evidence[];
  timestamp: number;
}

export interface SearchResponse<T = unknown> {
  data: T;
  proof: ProofBundle;
  receipt?: OffchainReceipt;
}

export interface OffchainReceipt {
  queryHash: string;
  responseHash: string;
  evidenceRoot: string;
  timestamp: number;
  onchain: boolean;
  txHash?: string;
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
  input: string;
  nonce: string;
  contractAddress: string;
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

export interface AddressSearchResult {
  address: string;
  balance: string;
  transactions: PolygonScanTx[];
  tokenTransfers: PolygonScanTokenTx[];
  approvals: Array<{
    spender: string;
    token: string;
    value: string;
  }>;
  counterparties: string[];
}

export interface TransactionSearchResult {
  transaction: {
    hash: string;
    from: string;
    to: string | null;
    value: string;
    blockNumber: number;
    nonce: number;
    gasPrice: string;
    gas: string;
    input: string;
  };
  receipt: {
    status: number;
    gasUsed: string;
    logs: Array<{
      address: string;
      topics: string[];
      data: string;
      logIndex: number;
    }>;
    contractAddress: string | null;
  };
}

export interface ContractSearchResult {
  address: string;
  bytecodeSize: number;
  verified: boolean;
  contractName?: string;
  compilerVersion?: string;
  sourceCode?: string;
  abi?: unknown[];
  isProxy: boolean;
  implementationAddress?: string;
}

export interface LogSearchResult {
  logs: Array<{
    address: string;
    topics: string[];
    data: string;
    blockNumber: number;
    transactionHash: string;
    logIndex: number;
  }>;
  count: number;
}
