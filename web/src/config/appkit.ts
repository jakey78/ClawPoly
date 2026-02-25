import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { polygon } from "@reown/appkit/networks";
import { QueryClient } from "@tanstack/react-query";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
});

export const wagmiAdapter = new WagmiAdapter({
  networks: [polygon],
  projectId,
  ssr: false,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [polygon],
  projectId,
  metadata: {
    name: "ClawPoly",
    description: "Pay-Per-Query Polygon Search Engine for AI Agents",
    url: typeof window !== "undefined" ? window.location.origin : "https://clawpoly.xyz",
    icons: ["/logo.svg"],
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#0d9488",
    "--w3m-border-radius-master": "2px",
  },
  features: {
    analytics: false,
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
