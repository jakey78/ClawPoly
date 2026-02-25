import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { enforceRateLimit } from "../_lib/rateLimit";

// Import ABIs inline (minimal)
const endpointRegistryABI = [
  {
    inputs: [],
    name: "getEndpointCount",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "index", type: "uint256" }],
    name: "getEndpointIdByIndex",
    outputs: [{ type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "endpointId", type: "bytes32" }],
    name: "getEndpoint",
    outputs: [
      {
        components: [
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "tags", type: "string" },
          { name: "enabled", type: "bool" },
          { name: "creator", type: "address" },
          { name: "createdAt", type: "uint256" },
          { name: "updatedAt", type: "uint256" },
        ],
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const pricingRegistryABI = [
  {
    inputs: [{ name: "endpointId", type: "bytes32" }],
    name: "getPrice",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

function getDeployment() {
  try {
    // Read deployment from environment or fallback
    const contractAddresses = {
      endpointRegistry: process.env.ENDPOINT_REGISTRY_ADDRESS || "",
      pricingRegistry: process.env.PRICING_REGISTRY_ADDRESS || "",
    };
    return contractAddresses;
  } catch {
    return { endpointRegistry: "", pricingRegistry: "" };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Free endpoint
  if (!enforceRateLimit(req, res, 60, 60_000)) return;

  try {
    const deployment = getDeployment();

    if (!deployment.endpointRegistry || !deployment.pricingRegistry) {
      // Return default pricing if contracts not deployed yet
      return res.status(200).json({
        success: true,
        source: "defaults",
        endpoints: [
          {
            id: "search/tx",
            name: "Transaction Search",
            description: "Search transaction by hash",
            tags: "search,transaction,tx",
            enabled: true,
            price: "1000",
            priceFormatted: "$0.001000",
          },
          {
            id: "search/address",
            name: "Address Search",
            description: "Search address details and activity",
            tags: "search,address,balance",
            enabled: true,
            price: "2000",
            priceFormatted: "$0.002000",
          },
          {
            id: "search/contract",
            name: "Contract Search",
            description: "Search contract details and ABI",
            tags: "search,contract,abi",
            enabled: true,
            price: "1500",
            priceFormatted: "$0.001500",
          },
          {
            id: "search/logs",
            name: "Log Search",
            description: "Search event logs by filters",
            tags: "search,logs,events",
            enabled: true,
            price: "1000",
            priceFormatted: "$0.001000",
          },
        ],
      });
    }

    // Read from onchain
    const client = createPublicClient({
      chain: polygon,
      transport: http(process.env.POLYGON_RPC_URL || "https://polygon-bor-rpc.publicnode.com"),
    });

    const count = await client.readContract({
      address: deployment.endpointRegistry as `0x${string}`,
      abi: endpointRegistryABI,
      functionName: "getEndpointCount",
    });

    const endpoints = [];
    for (let i = 0; i < Number(count); i++) {
      const endpointId = await client.readContract({
        address: deployment.endpointRegistry as `0x${string}`,
        abi: endpointRegistryABI,
        functionName: "getEndpointIdByIndex",
        args: [BigInt(i)],
      });

      const [endpoint, price] = await Promise.all([
        client.readContract({
          address: deployment.endpointRegistry as `0x${string}`,
          abi: endpointRegistryABI,
          functionName: "getEndpoint",
          args: [endpointId],
        }),
        client.readContract({
          address: deployment.pricingRegistry as `0x${string}`,
          abi: pricingRegistryABI,
          functionName: "getPrice",
          args: [endpointId],
        }),
      ]);

      endpoints.push({
        id: endpointId,
        name: endpoint.name,
        description: endpoint.description,
        tags: endpoint.tags,
        enabled: endpoint.enabled,
        price: price.toString(),
        priceFormatted: `$${(Number(price) / 1_000_000).toFixed(6)}`,
      });
    }

    return res.status(200).json({
      success: true,
      source: "onchain",
      endpoints,
    });
  } catch (error: any) {
    console.error("x402 endpoints error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Failed to fetch endpoints",
    });
  }
}
