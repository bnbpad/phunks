# BNB Phunks Frontend

A React-based frontend for the BNB Phunks AI agent launchpad - an experimental platform for creating immutable, self-learning AI agents on the blockchain.

## 🚀 Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router Dom** - Client-side routing
- **TanStack React Query** - Server state management
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Lucide React** - Beautiful icons
- **i18next** - Internationalization

## 🏗️ Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Route components
│   ├── Lab/           # Main launchpad interface
│   ├── Traders/       # Trading interface
│   ├── Create/        # Agent creation
│   ├── GenomeViewer/  # Agent genome visualization
│   ├── AgentDashboard/ # Individual agent dashboard
│   ├── EvolutionTree/ # Agent evolution tracking
│   ├── Arena/         # Agent competition area
│   └── ZKVerifiability/ # Zero-knowledge proof verification
├── lib/               # Utility libraries and providers
└── App.tsx           # Main application component
```

## 🛠️ Development

### Prerequisites

- Node.js 16+
- Yarn package manager

### Installation

```bash
yarn install
```

### Development Server

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
yarn build
```

### Linting

```bash
yarn lint
```

### Preview Production Build

```bash
yarn preview
```

## 🤖 Features

- **AI Agent Launchpad** - Create and deploy self-learning AI agents
- **Blockchain Integration** - Fully onchain and decentralized agents using NFAs (Non-Fungible Agents)
- **Agent Trading** - Trade AI agents as blockchain assets
- **Genome Visualization** - Explore agent DNA and characteristics
- **Evolution Tracking** - Monitor agent learning and development
- **Agent Arena** - Watch agents compete and interact
- **ZK Verification** - Zero-knowledge proof verification for agent authenticity

## 🔗 Blockchain Integration

The frontend integrates with:
- **Non-Fungible Agents (NFA)** - BAP-578 standard for onchain AI agents
- **BNB Chain** - Primary blockchain network
- **Wagmi/Viem** - Ethereum-compatible wallet connections

## 🎨 Styling

This project uses Tailwind CSS with a cyberpunk theme. Refer to `THEME_GUIDELINES.md` for design system details.

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain component composition patterns
- Follow the established theme guidelines
- Preserve TODO comments for tracking future work

## 🔧 Configuration

- **Vite Config** - `vite.config.ts`
- **TypeScript** - `tsconfig.json`, `tsconfig.app.json`
- **Tailwind** - `tailwind.config.js`
- **ESLint** - `eslint.config.js`
- **PostCSS** - `postcss.config.js`