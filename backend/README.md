# Backend - BNB Phunks (Phunks.ai)

Backend API server for BNB Phunks, an experimental self-learning AI agent launchpad on Binance Smart Chain (BSC). This backend handles token management, AI agent operations, blockchain interactions, and real-time communication.

## 🎯 Overview

BNB Phunks is a decentralized AI agent launchpad where each agent is designed as a Non-Fungible Agent (NFA) that stores immutable information about the AI agent and its decision-making logic. The backend provides APIs for:

- Token creation and management
- AI agent lifecycle management
- AI-powered decision making (OpenAI, Ollama)
- Blockchain event listening and contract interactions
- Real-time updates via WebSocket
- File uploads and storage (AWS S3)

## 🚀 Features

- **Token Management**: Create, validate, and manage tokens on BSC
- **AI Decision Engine**: Integration with OpenAI and Ollama for agent decision-making
- **Blockchain Integration**: Direct interaction with BSC smart contracts
- **Real-time Communication**: Socket.IO for live updates
- **File Storage**: AWS S3 integration for image and asset storage
- **Database**: MongoDB for persistent data storage
- **Caching**: Redis and in-memory caching for performance
- **API Documentation**: Swagger/OpenAPI support

## 🛠️ Tech Stack

### Core

- **Node.js** with **TypeScript**
- **Express.js** (v5.0.0-beta.1) - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** with **Mongoose** - Database
- **Redis** - Caching layer

### Blockchain

- **Ethers.js** (v6.13.4) - Ethereum/BSC interaction
- **@openzeppelin/contracts** - Smart contract utilities
- **@solana/web3.js** - Solana integration (optional)

### AI & External Services

- **OpenAI API** - AI decision engine
- **Moralis** - Blockchain data provider
- **CoinGecko API** - Price data
- **AWS SDK** - S3 file storage

### Development Tools

- **TypeScript** - Type safety
- **Jest** - Testing framework
- **ESLint** + **Prettier** - Code quality
- **Swagger** - API documentation
- **Nodemon** - Development hot-reload

## 📋 Prerequisites

- **Node.js** >= 18.x
- **MongoDB** (local or cloud instance)
- **Redis** (optional, for caching)
- **Yarn** or **npm** package manager
- **AWS Account** (for S3 file storage)
- **BSC RPC Endpoint** (Infura, Alchemy, or custom)

## 🔧 Installation

1. **Clone the repository** (if not already done):

```bash
cd backend
```

2. **Install dependencies**:

```bash
yarn install
# or
npm install
```

3. **Configure environment**:

   - Copy `config.json` and update with your values
   - Set required environment variables (see Configuration section)

4. **Build the project**:

```bash
yarn build
# or
npm run build
```

## ⚙️ Configuration

The application uses `nconf` for configuration management. Configuration is loaded from:

1. Command-line arguments (highest priority)
2. Environment variables
3. `config.json` file (default)

### Required Configuration

Update `config.json` with your values:

```json
{
  "NODE_ENV": "development",
  "PORT": "5005",
  "DATABASE_URI": "mongodb://localhost:27017/bnbpadai-v2",
  "SECRET_KEY": "your-secret-key",
  "BSC_RPC": "https://bsc-mainnet.infura.io/v3/YOUR_KEY",
  "WALLET_PRIVATE_KEY": "0x...",
  "AWS_ACCESS_KEY_ID": "your-aws-key",
  "AWS_SECRET_ACCESS_KEY": "your-aws-secret",
  "AWS_REGION": "us-east-1",
  "AWS_BUCKET_NAME": "your-bucket",
  "OPENAI_API_KEY": "sk-...",
  "TOKEN_MANAGER_V2_ADDRESS_BSC": "0x...",
  "LAUNCHPAD_ADDRESS_BSC": "0x...",
  "FRONTEND_URL": "http://localhost:3000"
}
```

### Key Configuration Variables

| Variable                       | Description                           |
| ------------------------------ | ------------------------------------- |
| `PORT`                         | Server port (default: 5005)           |
| `DATABASE_URI`                 | MongoDB connection string             |
| `BSC_RPC`                      | BSC RPC endpoint URL                  |
| `WALLET_PRIVATE_KEY`           | Private key for contract interactions |
| `AWS_*`                        | AWS S3 configuration                  |
| `OPENAI_API_KEY`               | OpenAI API key for AI decisions       |
| `TOKEN_MANAGER_V2_ADDRESS_BSC` | Token Manager contract address        |
| `LAUNCHPAD_ADDRESS_BSC`        | Launchpad contract address            |

## 🏃 Running the Application

### Development Mode

```bash
# Using nodemon (auto-reload)
yarn dev:nodemon

# Using ts-node directly
yarn dev
```

### Production Mode

```bash
# Build first
yarn build

# Start server
yarn start
```

The server will start on the port specified in `config.json` (default: 5005).

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── index.ts               # Entry point
│   ├── config/
│   │   ├── nconf.ts          # Configuration management
│   │   └── swagger.ts        # API documentation
│   ├── controllers/
│   │   ├── Agent/            # Agent management
│   │   ├── ai-models/        # AI decision engines
│   │   ├── runner/           # Event listeners & responders
│   │   └── token/            # Token operations
│   ├── database/
│   │   ├── Agent/            # Agent models
│   │   ├── AIDecison/        # AI decision models
│   │   ├── Trades/           # Trade models
│   │   └── token/            # Token models
│   ├── errors/               # Custom error classes
│   ├── middlewares/          # Express middlewares
│   ├── routes/               # API routes
│   ├── scripts/              # Utility scripts
│   └── utils/                # Helper utilities
├── dist/                     # Compiled JavaScript
├── config.json               # Configuration file
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Health Check

- `GET /` - Server health and uptime

### Token Routes (`/token`)

- `GET /token/getToken` - Get token by address and chain
- `GET /token/getTokensBySymbol` - Get tokens by symbol
- `GET /token/search` - Search tokens
- `POST /token/create` - Create new token
- `POST /token/validate-create` - Validate token creation
- `POST /token/uploadImage` - Upload token image
- `GET /token/getTokenDetails` - Get detailed token information
- `GET /token/getAiThesis` - Download AI thesis for token
- `POST /token/uploadTokenImageFourMeme` - Upload FourMeme token image
- `POST /token/createFourMemeToken` - Create FourMeme token
- `POST /token/saveFourMemeToken` - Save FourMeme token

### Agent Routes (`/agents`)

- `GET /agents` - Get all agents
- `GET /agents/:id` - Get agent details by ID

## 🧪 Development

### Code Quality

```bash
# Format code
yarn format

# Check formatting
yarn format:check

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix
```

### Testing

```bash
# Run tests
yarn test
```

### API Documentation

```bash
# Generate Swagger documentation
yarn swagger
```

## 📝 Scripts

The project includes several utility scripts in `src/scripts/`:

- `apro.ts` - Approval operations
- `listenContractEvents.ts` - Contract event listener
- `sampleData.ts` - Sample data generation
- `testPortfolioDecision.ts` - Test AI decision making

## 🔐 Security Considerations

⚠️ **Important**: The `config.json` file contains sensitive information:

- Never commit `config.json` with real credentials to version control
- Use environment variables for production
- Rotate API keys and private keys regularly
- Use a `.gitignore` to exclude config files

## 🚢 Deployment

1. **Build the project**:

```bash
yarn build
```

2. **Set environment variables** in your deployment platform

3. **Start the server**:

```bash
yarn start
```

4. **Use a process manager** (PM2, systemd, etc.) for production:

```bash
pm2 start dist/index.js --name phunks-backend
```

## 🤝 Contributing

1. Follow the existing code style (enforced by ESLint/Prettier)
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## 📄 License

ISC

## 🔗 Related Projects

- **Frontend**: See `/frontend` directory
- **Smart Contracts**: See `/contracts` directory

## 📞 Support

For issues and questions, please refer to the main project README or open an issue in the repository.
