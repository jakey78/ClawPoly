import { run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const deploymentPath = path.join(__dirname, "..", "deployments", "polygon.json");

  if (!fs.existsSync(deploymentPath)) {
    console.error("No deployment file found at", deploymentPath);
    console.error("Run 'npm run deploy' first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  const { contracts } = deployment;

  console.log("Verifying contracts on PolygonScan...\n");

  for (const [name, info] of Object.entries(contracts) as [string, any][]) {
    console.log(`--- Verifying ${name} at ${info.address} ---`);
    try {
      await run("verify:verify", {
        address: info.address,
        constructorArguments: info.constructorArgs,
      });
      console.log(`${name} verified successfully!\n`);
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log(`${name} is already verified.\n`);
      } else {
        console.error(`Failed to verify ${name}:`, error.message, "\n");
      }
    }
  }

  console.log("=== Verification Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
