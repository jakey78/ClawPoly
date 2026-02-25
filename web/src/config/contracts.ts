import deployment from "./deployments/polygon.json";

import AccessControllerABI from "@/abi/ClawPolyAccessController.json";
import EndpointRegistryABI from "@/abi/ClawPolyEndpointRegistry.json";
import PricingRegistryABI from "@/abi/ClawPolyPricingRegistry.json";
import SearchReceiptABI from "@/abi/ClawPolySearchReceipt.json";
import FeeVaultABI from "@/abi/ClawPolyFeeVault.json";

type Address = `0x${string}`;

function getAddress(contractName: string): Address {
  const c = (deployment.contracts as Record<string, { address: string }>)[contractName];
  return (c?.address || "0x0000000000000000000000000000000000000000") as Address;
}

export const accessControllerContract = {
  address: getAddress("ClawPolyAccessController"),
  abi: AccessControllerABI,
} as const;

export const endpointRegistryContract = {
  address: getAddress("ClawPolyEndpointRegistry"),
  abi: EndpointRegistryABI,
} as const;

export const pricingRegistryContract = {
  address: getAddress("ClawPolyPricingRegistry"),
  abi: PricingRegistryABI,
} as const;

export const searchReceiptContract = {
  address: getAddress("ClawPolySearchReceipt"),
  abi: SearchReceiptABI,
} as const;

export const feeVaultContract = {
  address: getAddress("ClawPolyFeeVault"),
  abi: FeeVaultABI,
} as const;

export const CHAIN_ID = deployment.chainId;
export const USDC_ADDRESS = deployment.tokens.USDC as Address;
export const START_BLOCK = deployment.startBlock;
