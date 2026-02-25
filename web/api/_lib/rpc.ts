import { createPublicClient, http, type PublicClient } from "viem";
import { polygon } from "viem/chains";

let _client: PublicClient | null = null;

export function getRpcClient(): PublicClient {
  if (_client) return _client;

  const rpcUrl = process.env.POLYGON_RPC_URL || "https://polygon-bor-rpc.publicnode.com";

  _client = createPublicClient({
    chain: polygon,
    transport: http(rpcUrl, {
      retryCount: 3,
      retryDelay: 1000,
      timeout: 30_000,
    }),
  });

  return _client;
}

export async function getTransaction(hash: `0x${string}`) {
  const client = getRpcClient();
  return client.getTransaction({ hash });
}

export async function getTransactionReceipt(hash: `0x${string}`) {
  const client = getRpcClient();
  return client.getTransactionReceipt({ hash });
}

export async function getBalance(address: `0x${string}`) {
  const client = getRpcClient();
  return client.getBalance({ address });
}

export async function getLogs(params: {
  address?: `0x${string}`;
  topics?: (`0x${string}` | null)[];
  fromBlock?: bigint;
  toBlock?: bigint;
}) {
  const client = getRpcClient();
  return client.getLogs({
    address: params.address,
    topics: params.topics as any,
    fromBlock: params.fromBlock,
    toBlock: params.toBlock || "latest",
  });
}

export async function getCode(address: `0x${string}`) {
  const client = getRpcClient();
  return client.getCode({ address });
}

export async function getBlock(blockNumber?: bigint) {
  const client = getRpcClient();
  if (blockNumber !== undefined) {
    return client.getBlock({ blockNumber });
  }
  return client.getBlock();
}

export async function getBlockNumber() {
  const client = getRpcClient();
  return client.getBlockNumber();
}

export async function getStorageAt(address: `0x${string}`, slot: `0x${string}`) {
  const client = getRpcClient();
  return client.getStorageAt({ address, slot });
}
