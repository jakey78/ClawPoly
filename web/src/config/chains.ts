import { defineChain } from "viem";

export const polygon = defineChain({
  id: 137,
  name: "Polygon",
  nativeCurrency: {
    decimals: 18,
    name: "POL",
    symbol: "POL",
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_POLYGON_RPC_URL || "https://polygon-bor-rpc.publicnode.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "PolygonScan",
      url: "https://polygonscan.com",
      apiUrl: "https://api.polygonscan.com/api",
    },
  },
});

export const CHAIN_ID = 137;
