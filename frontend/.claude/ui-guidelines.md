# Phunks UI Guidelines

## 🎯 Design Philosophy
Phunks follows a **minimal, professional, hackathon-ready** design approach with BSC branding integration.

## Color System Usage

### When to Use BSC Gold (#f0b90b)
- ✅ Primary call-to-action buttons
- ✅ Brand logo diamond shape
- ✅ Active navigation states
- ✅ Important metrics/stats
- ✅ Hover states for interactive elements
- ❌ Large background areas
- ❌ Body text (poor readability)

### Gray Scale Usage
```css
gray-50:  Card backgrounds, subtle sections
gray-100: Input backgrounds, disabled states
gray-200: Borders, dividers
gray-300: Disabled text
gray-400: Icons, placeholder text
gray-500: Secondary text, labels
gray-600: Body text (primary)
gray-700: Subheadings
gray-900: Main headings, primary text
```

## Typography Rules

### Font Selection
- **Orbitron**: Use for brand name and main headings only
- **Exo 2**: Use for everything else (body text, buttons, labels, navigation)

### Font Weight Guidelines
```css
font-black (900):  Hero titles only (with Orbitron)
font-bold (700):   Section headings
font-semibold (600): Card titles, important labels
font-medium (500):  Buttons, navigation, UI elements
font-normal (400):  Body text, descriptions
```

## Component Specifications

### Buttons
```tsx
// Primary (BSC Gold)
className="px-6 py-3 bsc-gradient hover:opacity-90 rounded-lg font-exo font-medium text-white"

// Secondary
className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-exo font-medium text-gray-700 hover:bg-gray-50"

// Text Button
className="font-exo font-medium text-bsc-600 hover:text-bsc-700"
```

### Cards
```tsx
// Standard Card
className="bg-white card-shadow rounded-lg p-6 hover:shadow-lg transition-all"

// Feature Card (with icon)
<div className="bg-white card-shadow rounded-lg p-6">
  <div className="w-12 h-12 rounded-lg bg-bsc-100 flex items-center justify-center">
    <Icon className="w-6 h-6 text-bsc-600" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900">Title</h3>
  <p className="text-gray-600 text-sm font-exo">Description</p>
</div>
```

### Spacing System (8px Grid)
```css
space-y-2:  8px   /* Tight spacing within components */
space-y-4:  16px  /* Standard component spacing */
space-y-6:  24px  /* Section element spacing */
space-y-8:  32px  /* Large component spacing */
space-y-12: 48px  /* Section spacing */
space-y-16: 64px  /* Major section spacing */
```

## Icon Guidelines

### Icon Sizes
- **Small UI elements**: `w-4 h-4` (16px)
- **Buttons**: `w-5 h-5` (20px)
- **Feature cards**: `w-6 h-6` (24px)
- **Headers**: `w-8 h-8` (32px)

### Icon Colors
- **Active/Primary**: `text-bsc-600`
- **Secondary**: `text-gray-400`
- **Labels**: `text-gray-500`

## Layout Patterns

### Container Structure
```tsx
<div className="container mx-auto px-6 py-8">
  {/* Content */}
</div>
```

### Grid Systems
- **Mobile**: Single column
- **Tablet (md:)**: 2 columns for cards
- **Desktop (lg:)**: 4 columns for feature cards
- **Stats**: Always 3 columns

### Section Spacing
```tsx
<div className="space-y-16"> {/* 64px between major sections */}
  <section className="space-y-8"> {/* 32px within section */}
    <div className="space-y-4"> {/* 16px for related elements */}
```

## BSC Branding Elements

### Diamond Logo Implementation
```tsx
<div className="w-8 h-8 bg-bsc-500 diamond-shape"></div>
```

### BSC Network Badge
```tsx
<div className="flex items-center gap-2 text-xs text-bsc-600">
  <div className="w-3 h-3 bg-bsc-500 diamond-shape"></div>
  <span className="font-exo">BSC Network</span>
</div>
```

### AI Pattern Background
```tsx
<div className="ai-pattern"> {/* Subtle dot pattern */}
  {/* Content */}
</div>
```

## Responsive Design

### Mobile-First Approach
- Always design for mobile first
- Use `md:` prefix for tablet breakpoint (768px)
- Use `lg:` prefix for desktop breakpoint (1024px)

### Text Scaling
```tsx
// Hero titles
className="text-4xl md:text-5xl"

// Section titles
className="text-2xl md:text-3xl"

// Body text
className="text-base md:text-lg"
```

## Animation & Transitions

### Hover Effects
```css
hover:opacity-90      /* For buttons with gradients */
hover:shadow-lg       /* For cards */
hover:bg-gray-50      /* For secondary buttons */
transition-opacity    /* For gradient buttons */
transition-colors     /* For text/bg color changes */
transition-all        /* For cards with multiple properties */
```

### Performance Guidelines
- Use `transform` and `opacity` for animations
- Avoid animating `width`, `height`, or layout properties
- Keep animations under 300ms for snappy feel

## Accessibility

### Color Contrast
- Body text: Minimum gray-600 on white backgrounds
- Headings: gray-900 for maximum contrast
- Interactive elements: Clear hover/focus states

### Focus States
```css
focus:ring-2 focus:ring-bsc-400 focus:ring-offset-2
```

### Typography Accessibility
- Minimum 16px for body text
- Line height 1.5+ for readability
- Sufficient spacing between clickable elements (44px minimum)

## Do's and Don'ts

### ✅ Do's
- Use BSC gold sparingly for maximum impact
- Maintain consistent spacing with 8px grid
- Use Exo 2 for all body text and UI elements
- Keep designs clean with plenty of whitespace
- Use subtle shadows instead of borders

### ❌ Don'ts
- Don't use BSC gold for large background areas
- Don't mix font families within the same text block
- Don't use heavy animations or flashy effects
- Don't overcomplicate layouts
- Don't ignore mobile responsiveness

## Component Checklist

When creating new components:
- [ ] Uses appropriate typography (Orbitron vs Exo 2)
- [ ] Follows color guidelines (BSC gold for primary actions)
- [ ] Implements proper spacing (8px grid)
- [ ] Includes hover/focus states
- [ ] Responsive design implemented
- [ ] Accessibility considerations met
- [ ] BSC branding elements included where appropriate