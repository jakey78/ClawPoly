import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

const USDC_POLYGON = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC");

  const startBlock = await ethers.provider.getBlockNumber();
  console.log("Start block:", startBlock);

  // 1. Deploy AccessController
  console.log("\n--- Deploying ClawPolyAccessController ---");
  const ACFactory = await ethers.getContractFactory("ClawPolyAccessController");
  const accessController = await ACFactory.deploy();
  await accessController.waitForDeployment();
  const acAddress = await accessController.getAddress();
  console.log("ClawPolyAccessController deployed to:", acAddress);

  // 2. Deploy EndpointRegistry
  console.log("\n--- Deploying ClawPolyEndpointRegistry ---");
  const ERFactory = await ethers.getContractFactory("ClawPolyEndpointRegistry");
  const endpointRegistry = await ERFactory.deploy(acAddress);
  await endpointRegistry.waitForDeployment();
  const erAddress = await endpointRegistry.getAddress();
  console.log("ClawPolyEndpointRegistry deployed to:", erAddress);

  // 3. Deploy PricingRegistry
  console.log("\n--- Deploying ClawPolyPricingRegistry ---");
  const PRFactory = await ethers.getContractFactory("ClawPolyPricingRegistry");
  const pricingRegistry = await PRFactory.deploy(acAddress, USDC_POLYGON);
  await pricingRegistry.waitForDeployment();
  const prAddress = await pricingRegistry.getAddress();
  console.log("ClawPolyPricingRegistry deployed to:", prAddress);

  // 4. Deploy SearchReceipt
  console.log("\n--- Deploying ClawPolySearchReceipt ---");
  const SRFactory = await ethers.getContractFactory("ClawPolySearchReceipt");
  const searchReceipt = await SRFactory.deploy();
  await searchReceipt.waitForDeployment();
  const srAddress = await searchReceipt.getAddress();
  console.log("ClawPolySearchReceipt deployed to:", srAddress);

  // 5. Deploy FeeVault
  console.log("\n--- Deploying ClawPolyFeeVault ---");
  const FVFactory = await ethers.getContractFactory("ClawPolyFeeVault");
  const feeVault = await FVFactory.deploy(deployer.address);
  await feeVault.waitForDeployment();
  const fvAddress = await feeVault.getAddress();
  console.log("ClawPolyFeeVault deployed to:", fvAddress);

  // 6. Register default endpoints and set prices
  console.log("\n--- Registering default endpoints ---");
  const endpoints = [
    { id: ethers.keccak256(ethers.toUtf8Bytes("search/tx")), name: "Transaction Search", desc: "Search transaction by hash", tags: "search,transaction,tx", price: 1000n },
    { id: ethers.keccak256(ethers.toUtf8Bytes("search/address")), name: "Address Search", desc: "Search address details and activity", tags: "search,address,balance", price: 2000n },
    { id: ethers.keccak256(ethers.toUtf8Bytes("search/contract")), name: "Contract Search", desc: "Search contract details and ABI", tags: "search,contract,abi", price: 1500n },
    { id: ethers.keccak256(ethers.toUtf8Bytes("search/logs")), name: "Log Search", desc: "Search event logs by filters", tags: "search,logs,events", price: 1000n },
  ];

  for (const ep of endpoints) {
    const tx = await endpointRegistry.registerEndpoint(ep.id, ep.name, ep.desc, ep.tags);
    await tx.wait();
    console.log(`Registered endpoint: ${ep.name} (${ep.id})`);

    const ptx = await pricingRegistry.setPrice(ep.id, ep.price);
    await ptx.wait();
    console.log(`Set price: ${ep.name} = ${ep.price} USDC micro-units`);
  }

  // Write deployment info
  const deployment = {
    network: "polygon",
    chainId: 137,
    startBlock,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      ClawPolyAccessController: {
        address: acAddress,
        constructorArgs: [],
      },
      ClawPolyEndpointRegistry: {
        address: erAddress,
        constructorArgs: [acAddress],
      },
      ClawPolyPricingRegistry: {
        address: prAddress,
        constructorArgs: [acAddress, USDC_POLYGON],
      },
      ClawPolySearchReceipt: {
        address: srAddress,
        constructorArgs: [],
      },
      ClawPolyFeeVault: {
        address: fvAddress,
        constructorArgs: [deployer.address],
      },
    },
    tokens: {
      USDC: USDC_POLYGON,
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  const outputPath = path.join(deploymentsDir, "polygon.json");
  fs.writeFileSync(outputPath, JSON.stringify(deployment, null, 2));
  console.log("\nDeployment info written to:", outputPath);

  // Also copy to web
  const webDeploymentsDir = path.join(__dirname, "..", "..", "web", "src", "config", "deployments");
  if (!fs.existsSync(webDeploymentsDir)) {
    fs.mkdirSync(webDeploymentsDir, { recursive: true });
  }
  const webOutputPath = path.join(webDeploymentsDir, "polygon.json");
  fs.writeFileSync(webOutputPath, JSON.stringify(deployment, null, 2));
  console.log("Deployment info copied to:", webOutputPath);

  console.log("\n=== Deployment Complete ===");
  console.log("AccessController:", acAddress);
  console.log("EndpointRegistry:", erAddress);
  console.log("PricingRegistry: ", prAddress);
  console.log("SearchReceipt:   ", srAddress);
  console.log("FeeVault:        ", fvAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
