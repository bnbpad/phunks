# Phunks Theme Guidelines

## 🎨 Color Palette

### Primary Colors (BSC Gold)
```css
bsc-50: #fefce8   /* Light backgrounds */
bsc-100: #fef9c3  /* Subtle accents */
bsc-200: #fef08a  /* Borders */
bsc-300: #fde047  /* Hover states */
bsc-400: #facc15  /* Secondary actions */
bsc-500: #f0b90b  /* PRIMARY - Main BSC Gold */
bsc-600: #d97706  /* Active states */
bsc-700: #a16207  /* Dark accents */
bsc-800: #854d0e  /* Text on light */
bsc-900: #713f12  /* Darkest */
```

### Supporting Colors
```css
Gray Scale:
gray-50: #f9fafb   /* Card backgrounds */
gray-100: #f3f4f6  /* Subtle backgrounds */
gray-200: #e5e7eb  /* Borders */
gray-300: #d1d5db  /* Disabled states */
gray-400: #9ca3af  /* Placeholders */
gray-500: #6b7280  /* Secondary text */
gray-600: #4b5563  /* Body text */
gray-700: #374151  /* Headings */
gray-800: #1f2937  /* Dark backgrounds */
gray-900: #111827  /* Darkest text */

Surface Colors:
surface-light: #ffffff  /* Main background */
surface-card: #f9fafb   /* Card background */
surface-dark: #1f2937   /* Dark sections */
surface-darker: #111827 /* Darkest sections */

AI Theme:
ai-light: #fef3c7  /* AI accent light */
ai-main: #f59e0b   /* AI accent main */
ai-dark: #92400e   /* AI accent dark */
```

### Semantic Colors
```css
Success: #10b981 (green-500)
Warning: #f59e0b (amber-500)
Error: #ef4444 (red-500)
Info: #3b82f6 (blue-500)
```

## 📝 Typography

### Font Stack
```css
Primary Font (Headings): 'Orbitron', sans-serif
Secondary Font (Body): 'Exo 2', sans-serif
```

### Font Scale
```css
text-xs: 12px     /* Badges, labels */
text-sm: 14px     /* Secondary text */
text-base: 16px   /* Body text */
text-lg: 18px     /* Large body text */
text-xl: 20px     /* Subheadings */
text-2xl: 24px    /* Section titles */
text-3xl: 30px    /* Page titles */
text-4xl: 36px    /* Hero titles */
text-5xl: 48px    /* Main hero */
```

### Font Weights
```css
font-medium: 500  /* UI elements */
font-semibold: 600 /* Important text */
font-bold: 700    /* Section headings */
font-black: 900   /* Hero titles (Orbitron only) */
```

## 🎯 Usage Guidelines

### Headings
- **Hero Titles**: `font-orbitron font-black text-4xl/5xl`
- **Section Titles**: `font-orbitron font-bold text-2xl/3xl`
- **Card Titles**: `font-semibold text-lg`

### Body Text
- **Main Content**: `font-exo text-base/lg`
- **Secondary Info**: `font-exo text-sm`
- **Labels**: `font-exo font-medium text-xs/sm`

### Buttons
- **Primary**: `bsc-gradient font-exo font-medium`
- **Secondary**: `bg-white border font-exo font-medium`
- **Text**: `text-bsc-600 font-exo font-medium`

### Cards
- **Background**: `bg-white card-shadow`
- **Hover**: `hover:shadow-lg`
- **Border**: Minimal, use shadows instead

## 🔧 Components

### BSC Diamond Element
```tsx
<div className="w-8 h-8 bg-bsc-500 diamond-shape"></div>
```

### Glass Effect
```tsx
<div className="glass-effect">
  <!-- Content -->
</div>
```

### Card Shadow
```tsx
<div className="bg-white card-shadow rounded-lg">
  <!-- Content -->
</div>
```

### BSC Gradient
```tsx
<button className="bsc-gradient">
  <!-- Button content -->
</button>
```

### AI Pattern Background
```tsx
<div className="ai-pattern">
  <!-- Content with subtle dot pattern -->
</div>
```

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Small tablets */
md: 768px   /* Large tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

### Grid System
- **Mobile**: Single column
- **Tablet**: 2 columns for cards
- **Desktop**: 4 columns for feature cards
- **Container**: `container mx-auto px-6`

## ♿ Accessibility

### Color Contrast
- Text on white: Use gray-600+ for sufficient contrast
- Text on BSC gold: Use white or gray-900
- Interactive elements: Minimum 3:1 contrast ratio

### Focus States
- All interactive elements should have visible focus states
- Use `focus:ring-2 focus:ring-bsc-400`

### Typography
- Minimum 16px for body text
- Line height 1.5+ for readability
- Sufficient spacing between elements

## 🎨 Design Principles

### 1. Minimal & Clean
- Prefer whitespace over visual clutter
- Use subtle shadows instead of borders
- Consistent spacing (8px grid system)

### 2. Professional
- Hackathon-ready aesthetic
- Subtle animations and transitions
- Clean, readable typography

### 3. BSC-Focused
- Gold accents for primary actions
- Diamond shapes for BSC branding
- Emphasis on efficiency and low fees

### 4. AI-Forward
- Brain icons for AI features
- Subtle tech patterns
- Intelligent, data-driven messaging