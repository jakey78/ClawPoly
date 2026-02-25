<p align="center">
  <img src="https://img.shields.io/badge/Network-Polygon%20Mainnet-8247E5?style=for-the-badge&logo=polygon" />
  <img src="https://img.shields.io/badge/Payment-x402%20USDC-2775CA?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Live-00C48C?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

# 🔍 ClawPoly — Pay-Per-Query Polygon Search Engine for AI Agents

> **Search → Pay → Verify** — The first blockchain search API where every answer carries a cryptographic proof and every query is settled with USDC micropayments via the x402 protocol.

**🌐 Live:** [clawpoly.netlify.app](https://clawpoly.netlify.app) &nbsp;|&nbsp; **📦 GitHub:** [github.com/jakey78/ClawPoly](https://github.com/jakey78/ClawPoly)

---

## 🧠 The Problem

Blockchain data APIs today are either:
- **Free but unverifiable** — you trust the provider blindly
- **Subscription-based** — expensive for sporadic AI agent usage
- **Centralized** — no onchain proof that data is authentic

## ✅ The Solution

ClawPoly combines three innovations into one protocol:

| Innovation | How It Works |
|---|---|
| **x402 Pay-Per-Query** | No API keys, no subscriptions. Each query costs $0.001–$0.002 in USDC, paid via EIP-3009 `transferWithAuthorization` signature |
| **Proof-Carrying Answers** | Every API response includes a SHA-256 proof bundle with evidence chain (block numbers, tx hashes, addresses) |
| **Onchain Receipts** | Query→Response attestations are recorded in the `SearchReceipt` smart contract, independently verifiable by anyone |

---

## 🏗️ Architecture

```
ClawPoly/
├── contracts/              # 5 Solidity smart contracts (Hardhat, Polygon mainnet)
│   ├── ClawPolyAccessController.sol    # Role management (admin/operator)
│   ├── ClawPolyEndpointRegistry.sol    # Search endpoint metadata registry
│   ├── ClawPolyPricingRegistry.sol     # Per-endpoint USDC pricing
│   ├── ClawPolySearchReceipt.sol       # Onchain search attestations
│   └── ClawPolyFeeVault.sol            # Fee collection & distribution
│
├── web/                    # Frontend + API
│   ├── src/                # React 18 + Vite 5 + Tailwind v4
│   │   ├── pages/          # 9 pages (Home, Search, Docs, Pricing, Receipts, Admin...)
│   │   ├── components/     # UI, Search, Evidence, Layout components
│   │   ├── hooks/          # useSearch, useReceipts, useDocsSearch, useRecentSearches
│   │   ├── lib/            # x402Client, formatters, constants
│   │   └── config/         # Reown AppKit, wagmi, contract configs
│   │
│   ├── api/                # Serverless API routes
│   │   ├── search/         # tx, address, contract, logs, docs
│   │   ├── x402/           # endpoints listing
│   │   └── _lib/           # x402 enforcement, proof builder, PolygonScan, RPC, rate limiting
│   │
│   └── netlify/functions/  # Netlify function wrappers (7 endpoints)
│
└── netlify.toml            # Build config + API redirect rules
```

---

## 📜 Smart Contracts — Polygon Mainnet

All 5 contracts are deployed and verified on Polygon mainnet (Block #83440318, Feb 25 2026):

| Contract | Address | Purpose |
|---|---|---|
| **AccessController** | [`0x8961c1E0490C9480e043a6d65a86c8495d1aF25f`](https://polygonscan.com/address/0x8961c1E0490C9480e043a6d65a86c8495d1aF25f) | Central RBAC — `ADMIN_ROLE` and `OPERATOR_ROLE` via OpenZeppelin AccessControl |
| **EndpointRegistry** | [`0x23D692A67bE966dcff33773AC4f27898ae55855F`](https://polygonscan.com/address/0x23D692A67bE966dcff33773AC4f27898ae55855F) | Registers search endpoints with name, description, tags, enable/disable |
| **PricingRegistry** | [`0x0b76D141422FbD9594D36e38b78f3303cc10b0Aa`](https://polygonscan.com/address/0x0b76D141422FbD9594D36e38b78f3303cc10b0Aa) | Stores per-endpoint pricing in USDC micro-units (6 decimals). Supports batch updates |
| **SearchReceipt** | [`0x2009C3040fA9E5E432170900A3b426cC966Aa6CB`](https://polygonscan.com/address/0x2009C3040fA9E5E432170900A3b426cC966Aa6CB) | Permissionless attestation: records `queryHash → responseHash → evidenceRoot` onchain |
| **FeeVault** | [`0x240cEbC44F2bc91B4d1AA69c82b12DC2f1Bf678B`](https://polygonscan.com/address/0x240cEbC44F2bc91B4d1AA69c82b12DC2f1Bf678B) | Collects USDC/MATIC fees and distributes to recipients by basis-point splits |

**Payment Token:** USDC on Polygon — [`0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`](https://polygonscan.com/token/0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359)

---

## ⚡ x402 Payment Flow

```
┌─────────┐         ┌─────────────┐         ┌──────────┐
│  Client  │───GET──▶│  ClawPoly   │         │  Polygon │
│ (Wallet) │         │   API       │         │  Mainnet │
│          │◀──402───│             │         │          │
│          │         │ payTo,amt,  │         │          │
│          │         │ token info  │         │          │
│          │         │             │         │          │
│ Sign EIP-│         │             │         │          │
│ 712 typed│         │             │         │          │
│ data     │         │             │         │          │
│          │───GET───│             │         │          │
│          │ +header │ Verify sig  │────tx──▶│ USDC     │
│          │◀──200───│ Return data │         │ transfer │
│          │ +proof  │ +proof      │         │          │
└─────────┘         └─────────────┘         └──────────┘
```

1. **Client** sends `GET /api/search/tx?hash=0x...` — no auth header
2. **Server** returns `HTTP 402` with `PAYMENT-REQUIRED` header containing amount, token, `payTo` address
3. **Client** parses the 402 body, generates a nonce, signs an **EIP-712** `TransferWithAuthorization` (EIP-3009) message via MetaMask/wallet
4. **Client** retries the request with `X-PAYMENT-SIGNATURE` header (base64-encoded signed payload)
5. **Server** verifies the signature, checks nonce (replay protection), validates amount ≥ required
6. **Server** returns `HTTP 200` with:
   - **Search data** (transaction details, address info, etc.)
   - **Proof bundle** (SHA-256 response hash, evidence items with block/tx/address references)
   - **`PAYMENT-RESPONSE`** header confirming settlement

---

## 🔐 Proof Bundle

Every paid API response includes a cryptographic proof:

```json
{
  "responseHash": "0xe23c8ac8...72861db1",
  "evidence": [
    {
      "chainId": 137,
      "blockNumber": 82792310,
      "txHash": "0x21eb56...73553b",
      "address": "0x0de94b9...e1339f"
    }
  ],
  "dataPointers": [
    { "method": "eth_getTransactionByHash", "params": { "hash": "0x..." } }
  ],
  "timestamp": "2026-02-25T23:02:49.421Z"
}
```

- **responseHash** — SHA-256 of the canonical JSON response (independently recomputable)
- **evidence** — every onchain data point that contributed to the answer
- **dataPointers** — the exact RPC/API methods used to fetch data
- **timestamp** — server-side ISO timestamp

---

## 🖥️ Frontend Pages

| Page | Route | Description |
|---|---|---|
| **Home** | `/` | Hero section, search bar, feature cards, how-it-works |
| **Transaction** | `/tx/:hash` | Full tx details + proof bundle with evidence cards |
| **Address** | `/address/:address` | Balance, tx count, token overview |
| **Contract** | `/contract/:address` | Contract details, ABI, source code |
| **Docs** | `/docs` | Free — search curated Polygon knowledge base (MiniSearch) |
| **Pricing** | `/pricing` | Live endpoint prices fetched from onchain PricingRegistry |
| **Receipts** | `/receipts` | View onchain SearchReceipt attestations for connected wallet |
| **Admin** | `/admin` | Role-gated admin panel (AccessController checks) |
| **404** | `/*` | Animated not-found page |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS v4, Framer Motion |
| **Wallet** | Reown AppKit + wagmi v2 + viem v2 |
| **API** | Netlify Functions (serverless), esbuild bundled |
| **Contracts** | Solidity 0.8.24, Hardhat, OpenZeppelin |
| **Blockchain** | Polygon PoS Mainnet (Chain ID 137) |
| **Payment** | USDC (native, not bridged) via EIP-3009 |
| **Hosting** | Netlify (frontend + functions) |
| **Data Sources** | PolygonScan API + direct JSON-RPC |

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- npm
- MetaMask or any WalletConnect-compatible wallet
- USDC on Polygon (for search queries)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp contracts/.env.example contracts/.env
cp web/.env.example web/.env
```

### 3. Compile & test contracts

```bash
npm run build:contracts
npm run test:contracts    # 5 test suites, all contracts covered
```

### 4. Deploy to Polygon mainnet

```bash
npm run deploy:polygon    # Deploys all 5 contracts + registers endpoints + sets prices
npm run verify:polygon    # Verifies on PolygonScan
```

### 5. Run dev server

```bash
npm run dev
```

### 6. Build for production

```bash
npm run build
```

---

## 🌐 Environment Variables

### Contracts (`contracts/.env`)

| Variable | Required | Description |
|---|---|---|
| `POLYGON_RPC_URL` | Yes | Polygon mainnet RPC (Alchemy, Infura, etc.) |
| `POLYGONSCAN_API_KEY` | Yes | PolygonScan API key for verification |
| `DEPLOYER_PRIVATE_KEY` | Yes | Deployer private key (never commit!) |

### Web (`web/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_POLYGON_RPC_URL` | Yes | Polygon RPC URL (client-side, public) |
| `VITE_WALLETCONNECT_PROJECT_ID` | Yes | Reown/WalletConnect project ID |
| `POLYGON_RPC_URL` | Yes | Polygon RPC URL (server-side) |
| `POLYGONSCAN_API_KEY` | Yes | PolygonScan API key (server-side) |
| `X402_PAY_TO_ADDRESS` | Yes | Address receiving USDC payments |
| `ENABLE_ONCHAIN_RECEIPTS` | No | Set `true` to auto-record receipts onchain |
| `RECEIPT_SIGNER_PRIVATE_KEY` | No | Key for onchain receipt writer |
| `RECEIPT_CONTRACT_ADDRESS` | No | SearchReceipt contract address |

---

## 🔌 API Endpoints

| Method | Path | Payment | Description |
|---|---|---|---|
| `GET` | `/api/health` | Free | Health check |
| `GET` | `/api/search/tx?hash=0x...` | $0.001 | Transaction details by hash |
| `GET` | `/api/search/address?address=0x...` | $0.002 | Address balance, tx count, code |
| `GET` | `/api/search/contract?address=0x...` | $0.0015 | Contract ABI, source, details |
| `GET` | `/api/search/logs?address=0x...` | $0.001 | Event logs by address/topic |
| `GET` | `/api/search/docs?q=...` | Free | Polygon documentation search |
| `GET` | `/api/x402/endpoints` | Free | List all endpoints with prices |

---

## 📂 Netlify Deployment

The project deploys to Netlify with:

- **Build command:** `npm --workspace clawpoly-web run build`
- **Publish directory:** `web/dist`
- **Functions directory:** `web/netlify/functions` (7 flat function files)
- **Redirects:** `/api/*` routes map to `/.netlify/functions/*` via `netlify.toml`
- **SPA fallback:** `/*` → `/index.html`

---

## 🧪 Testing

```bash
# Smart contract tests (Hardhat)
npm run test:contracts

# Type checking
npm run typecheck --workspace=web
```

Test coverage includes:
- `AccessController.test.ts` — role granting, revoking, permission checks
- `EndpointRegistry.test.ts` — register, update, toggle, query endpoints
- `PricingRegistry.test.ts` — set prices, batch updates, payment token management
- `SearchReceipt.test.ts` — record, verify, check existence of receipts
- `FeeVault.test.ts` — fee distribution, recipient management, reentrancy protection

---

## 🎯 For AI Agent Developers

ClawPoly is designed as an **MCP-ready** search backend:

```bash
# Example: AI agent queries a transaction
curl "https://clawpoly.netlify.app/api/search/tx?hash=0x21eb56d614217cd35bd40be3aa4f9574b4dcf86335b926025d1bc424fc73553b" \
  -H "X-PAYMENT-SIGNATURE: <base64-encoded-signed-payload>"
```

- Standard HTTP + JSON — works with any HTTP client
- Deterministic proof bundles for response verification
- Micropayments remove the need for API key management
- Onchain receipts provide audit trail for agent actions

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built on Polygon 💜 Powered by x402</strong><br/>
  <sub>Pay-per-query blockchain data with cryptographic proof</sub>
</p>
