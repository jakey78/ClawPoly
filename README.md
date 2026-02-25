# ClawPoly — Pay-Per-Query Polygon Search Engine for AI Agents

**Search → Verify → Pay** with x402 paywall, proof-carrying answers, and onchain SearchReceipt attestations.

## Architecture

```
/contracts   – Solidity smart contracts (Hardhat, Polygon mainnet)
/web         – Frontend (Vite + React) + API routes (Vercel Serverless)
/scripts     – Build tooling (docs-index generator)
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
# Copy env examples
cp contracts/.env.example contracts/.env
cp web/.env.example web/.env

# Fill in your values (see Environment Variables below)
```

### 3. Compile & test contracts

```bash
npm run build:contracts
npm run test:contracts
```

### 4. Deploy contracts to Polygon mainnet

```bash
npm run deploy:polygon
```

This deploys all contracts, writes addresses to `contracts/deployments/polygon.json`, and copies them to `web/src/config/deployments/polygon.json`.

### 5. Verify contracts on PolygonScan

```bash
npm run verify:polygon
```

### 6. Run development server

```bash
npm run dev
```

### 7. Build for production

```bash
npm run build
```

## Environment Variables

### Contracts (`contracts/.env`)

| Variable | Required | Description |
|---|---|---|
| `POLYGON_RPC_URL` | Yes | Polygon mainnet RPC (e.g. Alchemy, Infura) |
| `POLYGONSCAN_API_KEY` | Yes | PolygonScan API key for verification |
| `DEPLOYER_PRIVATE_KEY` | Yes | Private key for contract deployment (never commit) |

### Web (`web/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_POLYGON_RPC_URL` | Yes | Polygon RPC URL (client-side, public) |
| `VITE_WALLETCONNECT_PROJECT_ID` | Yes | Reown/WalletConnect project ID |
| `POLYGON_RPC_URL` | Yes | Polygon RPC URL (server-side, secret) |
| `POLYGONSCAN_API_KEY` | Yes | PolygonScan API key (server-side) |
| `ENABLE_ONCHAIN_RECEIPTS` | No | Set `true` to auto-record receipts onchain |
| `RECEIPT_SIGNER_PRIVATE_KEY` | No | Key for onchain receipt writer (minimal funds) |
| `RECEIPT_CONTRACT_ADDRESS` | No | SearchReceipt contract address (from deploy) |
| `X402_PAY_TO_ADDRESS` | Yes | Address receiving x402 USDC payments |

## Vercel Deployment

1. Connect repo to Vercel
2. Set root directory to `web`
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add all `web/.env` variables in Vercel dashboard (Settings → Environment Variables)
7. Deploy

The `/api` directory is automatically deployed as Vercel Serverless Functions.

## Smart Contracts

| Contract | Purpose |
|---|---|
| `ClawPolyAccessController` | Roles (admin/operator) via OpenZeppelin AccessControl |
| `ClawPolyEndpointRegistry` | Registers search endpoint IDs with metadata |
| `ClawPolyPricingRegistry` | Stores USDC price per endpoint |
| `ClawPolySearchReceipt` | Records queryHash → responseHash attestations |
| `ClawPolyFeeVault` | Receives and distributes fees |

## x402 Payment Flow

1. Client calls `/api/search/*` without payment
2. Server returns **HTTP 402** with `PAYMENT-REQUIRED` header
3. Client parses payment requirements (amount, token, payTo)
4. Client signs EIP-712 `transferWithAuthorization` via wallet
5. Client retries with `PAYMENT-SIGNATURE` header
6. Server verifies signature and settles USDC transfer
7. Server returns **HTTP 200** with data + proof bundle + `PAYMENT-RESPONSE` header

## License

MIT
