import * as fs from "fs";
import * as path from "path";

function main() {
  const source = path.join(__dirname, "..", "deployments", "polygon.json");
  const destDir = path.join(__dirname, "..", "..", "web", "src", "config", "deployments");
  const dest = path.join(destDir, "polygon.json");

  if (!fs.existsSync(source)) {
    console.error("Source file not found:", source);
    console.error("Run 'npm run deploy' in the contracts workspace first.");
    process.exit(1);
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(source, dest);
  console.log("Copied deployment addresses:");
  console.log(`  From: ${source}`);
  console.log(`  To:   ${dest}`);
}

main();
