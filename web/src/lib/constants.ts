// Polygon chain constants
export const POLYGON_CHAIN_ID = 137;
export const POLYGON_BLOCK_TIME_MS = 2000;

// USDC (native, Circle-issued)
export const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" as const;
export const USDC_DECIMALS = 6;

// PolygonScan
export const POLYGONSCAN_BASE_URL = "https://polygonscan.com";
export const POLYGONSCAN_API_URL = "https://api.polygonscan.com/api";

// Multicall3 (same on all EVM chains)
export const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11" as const;

// EIP-1967 proxy storage slots
export const IMPLEMENTATION_SLOT =
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc" as const;
export const ADMIN_SLOT =
  "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103" as const;

// Common event signatures (topic0)
export const EVENT_SIGNATURES = {
  Transfer: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  Approval: "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
  TransferSingle: "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
  TransferBatch: "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb",
} as const;

// App metadata
export const APP_NAME = "ClawPoly";
export const APP_DESCRIPTION = "Pay-Per-Query Polygon Search Engine for AI Agents";
export const APP_URL = "https://clawpoly.vercel.app";
