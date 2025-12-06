# BNB Phunks (Phunks.ai)

> An experimental self-learning AI agent launchpad on Binance Smart Chain (BSC) that creates immutable, decentralized AI agents as Non-Fungible Agents (NFAs).

## 🎯 Overview

BNB Phunks is a decentralized AI agent launchpad where each agent is designed as a [Non-Fungible Agent (NFA)](https://github.com/ChatAndBuild/non-fungible-agents-BAP-578) that stores immutable information about the AI agent and its decision-making logic. The platform allows the public to create, curate, and financially benefit from outstanding AI agents.

### Key Features

- **Immutable AI Agents**: Each agent stores goals (unchanging) and memory (expanding over time)
- **Fully Onchain**: 100% decentralized and autonomous AI agents on BSC
- **Public Curation**: Community-driven launchpad for agent creation and curation
- **Financial Incentives**: Creators are rewarded for developing exceptional AI agents
- **Self-Learning**: Agents continuously update their memory and decision-making capabilities

## 🏗️ Architecture

The project consists of three main components:

```
phunks/
├── contracts/     # Smart contracts (Foundry/Solidity)
├── backend/       # Node.js/TypeScript API server
└── frontend/      # React/TypeScript web application
```

### Smart Contracts (`/contracts`)

Solidity smart contracts deployed on BSC using Foundry:

- **Agent.sol** - Core agent contract
- **AgentLaunchpad.sol** - Launchpad functionality
- **AgentNFT.sol** - NFA token standard implementation

**Tech Stack**: Foundry, Solidity, OpenZeppelin

📖 [View Contracts Documentation](./contracts/README.md)

### Backend API (`/backend`)

Node.js/TypeScript backend providing:

- Token creation and management
- AI agent lifecycle management
- AI-powered decision making (OpenAI, Ollama)
- Blockchain event listening
- Real-time WebSocket communication
- File storage (AWS S3)

**Tech Stack**: Node.js, TypeScript, Express.js, MongoDB, Redis, Socket.IO, Ethers.js

📖 [View Backend Documentation](./backend/README.md)

### Frontend (`/frontend`)

React-based web application featuring:

- AI agent launchpad interface
- Agent trading and marketplace
- Genome visualization
- Evolution tracking
- Agent arena and competition
- Zero-knowledge verification

**Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Wagmi, Viem

📖 [View Frontend Documentation](./frontend/README.md)

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **Yarn** package manager
- **MongoDB** (local or cloud)
- **Redis** (optional, for caching)
- **Foundry** (for smart contracts)
- **AWS Account** (for S3 file storage)
- **BSC RPC Endpoint** (Infura, Alchemy, or custom)

### Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd phunks
```

2. **Install dependencies for each component**:

```bash
# Backend
cd backend
yarn install
cd ..

# Frontend
cd frontend
yarn install
cd ..

# Contracts (if needed)
cd contracts
forge install
cd ..
```

3. **Configure environment**:

   - **Backend**: Copy and update `backend/config.json` with your configuration
   - **Frontend**: Update `frontend/src/lib/config.ts` with your settings
   - **Contracts**: Configure `contracts/foundry.toml` for your network

4. **Build projects**:

```bash
# Backend
cd backend
yarn build

# Frontend
cd frontend
yarn build
```

### Running the Application

#### Development Mode

**Backend** (runs on port 5005 by default):

```bash
cd backend
yarn dev
```

**Frontend** (runs on port 5173 by default):

```bash
cd frontend
yarn dev
```

**Smart Contracts** (testing):

```bash
cd contracts
forge test
```

#### Production Mode

**Backend**:

```bash
cd backend
yarn build
yarn start
```

**Frontend**:

```bash
cd frontend
yarn build
yarn preview
```

## 📋 Project Structure

```
phunks/
├── contracts/              # Smart contracts
│   ├── src/               # Solidity source files
│   ├── script/            # Deployment scripts
│   └── foundry.toml       # Foundry configuration
│
├── backend/               # Backend API server
│   ├── src/               # TypeScript source files
│   │   ├── controllers/   # Route controllers
│   │   ├── database/      # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── scripts/       # Utility scripts
│   ├── config.json        # Configuration file
│   └── package.json
│
└── frontend/              # Frontend web application
    ├── src/               # React source files
    │   ├── components/    # React components
    │   ├── pages/         # Route pages
    │   ├── lib/           # Utilities and providers
    │   └── locales/       # i18n translations
    └── package.json
```

## 🔧 Configuration

### Backend Configuration

Update `backend/config.json` with:

- MongoDB connection string
- BSC RPC endpoint
- Wallet private key
- AWS credentials (for S3)
- OpenAI API key
- Contract addresses

See [Backend README](./backend/README.md#configuration) for details.

### Frontend Configuration

Update `frontend/src/lib/config.ts` with:

- Backend API URL
- Blockchain network configuration
- Contract addresses

### Smart Contract Configuration

Configure `contracts/foundry.toml` for:

- Network settings
- Compiler version
- Optimizer settings

## 🧪 Development

### Code Quality

**Backend**:

```bash
cd backend
yarn format      # Format code
yarn lint        # Lint code
yarn test        # Run tests
```

**Frontend**:

```bash
cd frontend
yarn lint        # Lint code
```

**Contracts**:

```bash
cd contracts
forge fmt        # Format code
forge test       # Run tests
forge snapshot   # Gas snapshots
```

## 🔌 API Endpoints

The backend provides REST APIs for:

- **Token Management**: Create, validate, and manage tokens
- **Agent Operations**: Get agent details and decisions
- **AI Decisions**: AI-powered decision making
- **File Uploads**: Image and asset storage

See [Backend API Documentation](./backend/README.md#api-endpoints) for complete endpoint list.

## 🔐 Security Considerations

⚠️ **Important Security Notes**:

- Never commit sensitive credentials to version control
- Use environment variables for production deployments
- Rotate API keys and private keys regularly
- Keep `.gitignore` updated to exclude config files
- Review smart contract code before deployment

## 🚢 Deployment

### Smart Contracts

```bash
cd contracts
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url <your_rpc_url> \
  --private-key <your_private_key> \
  --broadcast
```

### Backend

1. Build the project: `yarn build`
2. Set environment variables
3. Start with process manager: `pm2 start dist/index.js`

### Frontend

1. Build: `yarn build`
2. Deploy `dist/` folder to your hosting service

## 🤝 Contributing

1. Follow existing code style (enforced by ESLint/Prettier)
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## 📄 License

ISC

## 🔗 Resources

- [Non-Fungible Agents (BAP-578)](https://github.com/ChatAndBuild/non-fungible-agents-BAP-578)
- [Foundry Documentation](https://book.getfoundry.sh/)
- [BNB Chain Documentation](https://docs.bnbchain.org/)

## 📞 Support

For issues and questions:

- Check individual component READMEs for specific documentation
- Open an issue in the repository
- Refer to the main project documentation

---

**Built with ❤️ for the decentralized AI future**
