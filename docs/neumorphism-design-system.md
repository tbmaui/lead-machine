# Neumorphism Design System Documentation

## Overview

This document describes the Neumorphism design system implemented for the Lead Machine project. The system provides a cohesive visual style with soft shadows and subtle depth effects that work in both light and dark themes.

## Design Principles

### Visual Style
- **Soft Shadows**: Uses dual shadows (positive and negative) to create depth
- **Subtle Colors**: Minimal contrast with the background for gentle appearance
- **Rounded Corners**: Consistent use of rounded borders (0.75rem default)
- **Progressive Depth**: Multiple shadow levels for different UI elements

### Theme Support
- **Light Theme**: Soft grays with white highlights
- **Dark Theme**: Deep blues/grays with subtle highlights
- **System Detection**: Automatic theme detection based on user preferences
- **Manual Toggle**: Theme switcher component for user control

## CSS Variables

### Base Colors (Light Theme)
```css
--background: 220 14% 96%;
--foreground: 220 20% 25%;
--card: 220 15% 97%;
--primary: 217 91% 60%;
```

### Base Colors (Dark Theme)
```css
--background: 220 15% 18%;
--foreground: 220 10% 88%;
--card: 220 15% 20%;
--primary: 217 91% 60%;
```

### Neumorphism Variables
```css
/* Light Theme */
--neu-base: 220 14% 96%;
--neu-highlight: 0 0% 100%;
--neu-shadow: 220 20% 85%;
--neu-shadow-dark: 220 25% 80%;

/* Dark Theme */
--neu-base: 220 15% 18%;
--neu-highlight: 220 12% 25%;
--neu-shadow: 220 20% 12%;
--neu-shadow-dark: 220 25% 8%;
```

### Shadow Combinations
```css
--neu-shadow-light: 5px 5px 10px hsl(var(--neu-shadow)), -5px -5px 10px hsl(var(--neu-highlight));
--neu-shadow-medium: 8px 8px 16px hsl(var(--neu-shadow)), -8px -8px 16px hsl(var(--neu-highlight));
--neu-shadow-strong: 12px 12px 24px hsl(var(--neu-shadow-dark)), -12px -12px 24px hsl(var(--neu-highlight));
--neu-shadow-inset: inset 4px 4px 8px hsl(var(--neu-inset-shadow)), inset -4px -4px 8px hsl(var(--neu-inset-highlight));
--neu-shadow-pressed: inset 6px 6px 12px hsl(var(--neu-shadow)), inset -6px -6px 12px hsl(var(--neu-highlight));
```

## Utility Classes

### Basic Neumorphism Classes
- `.neu-flat` - Light shadow effect for subtle depth
- `.neu-raised` - Medium shadow effect for standard elements
- `.neu-elevated` - Strong shadow effect for prominent elements
- `.neu-inset` - Inset shadow for input fields and pressed states
- `.neu-pressed` - Deep inset shadow for active/pressed states

### Component-Specific Classes
- `.neu-button` - Interactive button styling with hover/active states
- `.neu-card` - Card component styling with raised appearance
- `.neu-input` - Input field styling with inset appearance

## Component Updates

### Card Component
- Removed standard border styling
- Applied `.neu-card` class for raised appearance
- Maintains existing shadcn-ui API

### Button Component
- Applied `.neu-button` base class
- Removed hover color changes in favor of shadow transitions
- Maintains all existing variants (default, outline, secondary, etc.)

### Input Component
- Applied `.neu-input` class for inset appearance
- Removed standard border styling
- Maintains focus states and accessibility

## Theme Implementation

### ThemeProvider Setup
```tsx
import { ThemeProvider } from "next-themes";

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange>
  {children}
</ThemeProvider>
```

### Theme Toggle Component
- Uses lucide-react icons (Sun/Moon)
- Smooth transitions between themes
- Maintains Neumorphism styling
- Handles hydration properly

## Usage Guidelines

### Do's
- Use provided utility classes for consistent styling
- Maintain the established shadow hierarchy
- Test both light and dark themes
- Keep shadow effects subtle and tasteful

### Don'ts
- Don't mix standard flat shadows with Neumorphism
- Don't use excessive contrast that breaks the soft aesthetic
- Don't override shadow effects without understanding the system
- Don't forget to test theme transitions

## Browser Support

- Modern browsers with CSS custom properties support
- CSS Grid and Flexbox support required
- No IE11 support due to CSS custom properties

## Performance Considerations

- Shadows are applied via CSS custom properties for efficient theming
- Transitions are optimized to prevent layout thrashing
- Theme switching uses `disableTransitionOnChange` to prevent flash

## Future Enhancements

- Additional shadow depth levels
- Animation variants for interactive elements
- Extended color palette for different contexts
- Component-specific shadow customizations
