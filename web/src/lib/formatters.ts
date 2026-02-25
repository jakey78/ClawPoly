import { POLYGONSCAN_BASE_URL } from "./constants";

/**
 * Format a wei value to a human-readable POL amount.
 */
export function formatPOL(wei: bigint | string, decimals = 4): string {
  const value = typeof wei === "string" ? BigInt(wei) : wei;
  const whole = value / 10n ** 18n;
  const frac = value % 10n ** 18n;
  const fracStr = frac.toString().padStart(18, "0").slice(0, decimals);
  return `${whole}.${fracStr}`;
}

/**
 * Format a USDC micro-unit value to human-readable.
 */
export function formatUSDC(microUnits: bigint | string | number): string {
  const n = Number(microUnits) / 1e6;
  return `$${n.toFixed(n < 0.01 ? 6 : 4)}`;
}

/**
 * Shorten an address: 0x1234...abcd
 */
export function shortenAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 4) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Shorten a tx hash: 0x1234567890...abcdef
 */
export function shortenHash(hash: string, chars = 6): string {
  if (hash.length <= chars * 2 + 4) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Format a block number with commas.
 */
export function formatBlockNumber(block: number | bigint | string): string {
  return Number(block).toLocaleString();
}

/**
 * Format a timestamp (seconds) to ISO string.
 */
export function formatTimestamp(ts: number | string): string {
  return new Date(Number(ts) * 1000).toISOString();
}

/**
 * Format a timestamp to relative time: "2m ago", "3h ago", "5d ago"
 */
export function timeAgo(ts: number): string {
  const diff = Date.now() - ts * 1000;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/**
 * PolygonScan link for an address.
 */
export function polygonscanAddress(address: string): string {
  return `${POLYGONSCAN_BASE_URL}/address/${address}`;
}

/**
 * PolygonScan link for a transaction.
 */
export function polygonscanTx(hash: string): string {
  return `${POLYGONSCAN_BASE_URL}/tx/${hash}`;
}

/**
 * PolygonScan link for a block.
 */
export function polygonscanBlock(block: number | string): string {
  return `${POLYGONSCAN_BASE_URL}/block/${block}`;
}

/**
 * Format gas value.
 */
export function formatGas(gas: bigint | string | number): string {
  return Number(gas).toLocaleString();
}

/**
 * Format a hex string to a number.
 */
export function hexToNumber(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * Check if an input is a valid Ethereum address.
 */
export function isAddress(input: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(input);
}

/**
 * Check if an input is a valid tx hash.
 */
export function isTxHash(input: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(input);
}
