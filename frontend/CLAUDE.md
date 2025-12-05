# Phunks - AI Agent Platform on BSC

## Project Overview
Phunks is a hackathon-quality AI agent platform built for Binance Smart Chain (BSC). It provides users with unstoppable, self-learning AI agents powered by machine learning for autonomous operations on BSC.

## 🎨 Design System

### Colors
- **Primary**: BSC Gold (#f0b90b) - Main brand color from Binance Smart Chain
- **Secondary**: Clean grays for professional appearance
- **Background**: White with subtle gray cards
- **Semantic**: Green/red for P&L, standard semantic colors

### Typography
- **Headings**: Orbitron (tech/futuristic font, same as Arena page)
- **Body Text**: Exo 2 (clean, readable sans-serif)
- **Hierarchy**: Clear distinction between headings and body text

### Components
- **Cards**: White background with subtle shadows (`card-shadow`)
- **Buttons**: BSC gradient for primary, white with borders for secondary
- **BSC Elements**: Diamond shapes using `diamond-shape` class
- **Glass Effects**: Subtle backdrop blur for modern feel

## 🏗️ Architecture

### Pages
- **Lab (/)**: Main landing page with hero, features, and top performing agents
- **Arena (/arena)**: AI agent leaderboard and performance metrics
- **Agents (/traders)**: Browse and discover AI agents
- **Create (/create)**: AI agent creation and configuration
- **Agent Dashboard (/agent/:id)**: Individual agent performance and details

### Components
- **Layout**: Main navigation and footer with BSC branding
- **AgentCard**: AI agent display card with performance metrics and avatars
- **LanguageSwitcher**: Dropdown for English/Chinese language selection
- **Navigation**: Clean, minimal navigation with BSC gold accents

## 🎯 Brand Identity

### Name: Phunks
- Professional AI agent platform
- Focus on unstoppable, self-learning AI agents
- BSC efficiency and low fees
- Hackathon-ready presentation quality

### Messaging
- "Build Unstoppable & Self-learning AI Agents"
- Emphasis on autonomous agents and BSC benefits
- Professional, accessible tone

### Visual Elements
- BSC diamond logo elements
- AI brain icons for intelligence features
- Custom avatar system with 8 unique agent images
- Clean, minimal patterns (ai-pattern for subtle backgrounds)

## 📝 Content Strategy

### Hero Section
- Clear value proposition: "Build Unstoppable & Self-learning AI Agents"
- Focus on autonomous agents and machine learning
- Professional statistics (Active Agents, Volume, Win Rate)

### Features
- Smart AI Models
- Lightning Fast Execution (BSC benefits)
- Secure & Audited
- Real-time Analytics

### AI Agents
- Neural Nexus, Alpha Predator, Quantum Trader, Sigma Sentinel
- Focus on proven performance and autonomous operation
- Custom avatar system for visual identification

## 🔧 Technical Details

### Styling Classes
```css
/* BSC Branding */
.bsc-gradient       /* BSC gold gradient for primary buttons */
.diamond-shape      /* BSC-inspired diamond logo shape */

/* Cards & Layout */
.card-shadow        /* Subtle card shadows */
.glass-effect       /* Backdrop blur for modern feel */
.ai-pattern         /* Subtle dot pattern background */

/* Typography */
.font-orbitron      /* Headings and brand name */
.font-exo          /* Body text and UI elements */
```

### Color Usage
- Use `bsc-500` for primary actions and accents
- Use `gray-600` for body text on white backgrounds
- Use `gray-900` for headings
- Use semantic colors (green/red) for P&L indicators

### Component Patterns
- All cards use white background with shadow
- Buttons use BSC gradient for primary actions
- Icons are 16px (w-4 h-4) for small elements, 20px (w-5 h-5) for buttons
- Consistent spacing using 8px grid (space-y-4, space-y-8, etc.)

## 🚀 Development Guidelines

### When Creating New Components
1. Follow established color patterns (BSC gold for primary elements)
2. Use consistent typography (Orbitron for headings, Exo 2 for body)
3. Maintain clean, minimal aesthetic with subtle shadows
4. Include BSC branding elements where appropriate
5. Ensure hackathon-ready professional appearance

### When Adding Content
1. Keep messaging professional and AI agent-focused
2. Emphasize autonomous, self-learning capabilities
3. Highlight BSC benefits (speed, low fees)
4. Use proven, realistic metrics
5. Maintain accessible, clear language
6. Support both English and Chinese languages

### Performance Considerations
- Images are served locally from custom avatar system
- Fonts are efficiently loaded through Tailwind config
- Animations are subtle and performance-friendly
- Internationalization with react-i18next for English/Chinese support

This is a hackathon-quality AI agent platform that emphasizes professionalism, BSC integration, and clean design aesthetics.

## 🔄 Development Workflow

### Git Commit Guidelines
- When committing code changes, use clean, descriptive commit messages
- Focus on what was changed and why
- Do not include co-author attributions unless specifically requested
- Keep commits focused and atomic

### Commit Message Format
```bash
git commit -m "Brief description of changes

Optional longer description if needed for complex changes"
```

## 🌐 Internationalization

### Languages Supported
- **English**: Default language with comprehensive coverage
- **Chinese**: Complete translation with cultural adaptation

### Implementation
- Using `react-i18next` for robust i18n infrastructure
- Language persistence with localStorage
- Dropdown language switcher with flag icons
- Organized translation keys by feature areas

### Translation Structure
```json
{
  "homePage": {
    "hero": {
      "title": "Build",
      "titleHighlight": "Unstoppable & Self-learning",
      "titleSuffix": "AI Agents"
    }
  }
}
```

## 🎨 Avatar System

### Custom Agent Avatars
- 8 unique, branded avatar images stored in `/public/avatars/`
- Consistent visual identity across all agent cards
- Optimized for performance with local hosting
- Used across Arena, Lab, and Agents pages

### Avatar Distribution
- **Arena (Leaderboard)**: Sequential avatars 1-8
- **Lab (Home)**: Mixed selection for variety
- **Agents Page**: Balanced distribution across all cards

## 🎨 UI Components Reference

### Button Styles
```tsx
// Primary Button (BSC Gold)
<button className="flex items-center gap-2 px-6 py-3 bsc-gradient hover:opacity-90 rounded-lg font-exo font-medium text-white transition-opacity">
  <Icon className="w-5 h-5" />
  Button Text
</button>

// Secondary Button
<button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-exo font-medium text-gray-700 hover:bg-gray-50 transition-colors">
  Button Text
</button>
```

### Card Components
```tsx
// Basic Card
<div className="bg-white card-shadow rounded-lg p-6 hover:shadow-lg transition-all">
  {/* Card content */}
</div>

// Feature Card
<div className="bg-white card-shadow rounded-lg p-6 hover:shadow-lg transition-all">
  <div className="space-y-4">
    <div className="w-12 h-12 rounded-lg bg-bsc-100 flex items-center justify-center">
      <Icon className="w-6 h-6 text-bsc-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">Title</h3>
    <p className="text-gray-600 text-sm leading-relaxed font-exo">Description</p>
  </div>
</div>
```

### Navigation Elements
```tsx
// Navigation Link
<Link className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
  isActive
    ? 'bg-bsc-50 text-bsc-700 border border-bsc-200'
    : 'text-gray-600 hover:text-bsc-700 hover:bg-bsc-50'
}`}>
  <Icon className="w-4 h-4" />
  <span className="text-sm font-exo font-medium">Label</span>
</Link>
```

### Typography Examples
```tsx
// Main Hero Title
<h1 className="text-4xl md:text-5xl font-orbitron font-black leading-tight text-gray-900">
  Hero Title
</h1>

// Section Title
<h2 className="text-3xl font-orbitron font-bold text-gray-900">
  Section Title
</h2>

// Body Text
<p className="text-lg text-gray-600 leading-relaxed font-exo">
  Body text content
</p>

// Small Label
<span className="text-xs font-exo font-medium text-gray-500">
  Label
</span>
```

### BSC Branding Elements
```tsx
// BSC Diamond Logo
<div className="w-8 h-8 bg-bsc-500 diamond-shape"></div>

// BSC Badge
<div className="flex items-center gap-2 text-xs text-bsc-600">
  <div className="w-3 h-3 bg-bsc-500 diamond-shape"></div>
  <span className="font-exo">BSC Network</span>
</div>
```