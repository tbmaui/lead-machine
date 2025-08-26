# Complete Controller Design System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Brand Colors](#brand-colors)
3. [Shadow System](#shadow-system)
4. [Typography](#typography)
5. [Theme System](#theme-system)
6. [Components](#components)
7. [Implementation Guidelines](#implementation-guidelines)
8. [Code Examples](#code-examples)

---

## Overview

The Complete Controller Design System is a neomorphic UI library built for the Lead Machine project. It emphasizes soft, tactile interfaces with subtle shadows and brand-consistent colors. The system supports both light and dark themes with automatic adaptation.

### Design Philosophy
- **Neomorphic Design**: Soft, raised elements that appear to emerge from the background
- **Brand Consistency**: Strategic use of tomato orange and sea green accent colors
- **Accessibility**: High contrast ratios and keyboard navigation support
- **Responsive**: Mobile-first approach with flexible layouts

---

## Brand Colors

### Primary Palette
```css
--cc-tomato: #f36334;  /* Primary accent - warm orange */
--cc-sea: #91bfa5;     /* Secondary accent - soft green */
--cc-dim1: #566e67;    /* Cooler dim gray */
--cc-dim2: #5d5d5f;    /* Warmer dim gray */
--cc-gray: #7c797c;    /* Neutral gray */
```

### Usage Guidelines
- **Tomato Orange**: Use for primary actions, pressed states (light mode), and error states
- **Sea Green**: Use for secondary actions, pressed states (dark mode), and success states
- **Dim Colors**: Use for muted text, secondary information, and subtle accents
- **Gray**: Use for borders, dividers, and neutral elements

---

## Shadow System

The shadow system creates the signature neomorphic effect with raised and inset variations.

### Light Theme Shadows
```css
--raise: 8px 8px 16px #7b7b79, -8px -8px 16px #ffffff;
--inset: inset 8px 8px 16px #7b7b79, inset -8px -8px 16px #ffffff;
```

### Dark Theme Shadows
```css
--raise: 8px 8px 16px #323638;  /* Removed light shadow */
--inset: inset 8px 8px 16px #323638, inset -8px -8px 16px #949ea4;
```

### Shadow Usage
- **Raised (`--raise`)**: Use for buttons, cards, and interactive elements that should appear elevated
- **Inset (`--inset`)**: Use for input fields, pressed buttons, and recessed elements
- **Dark Mode**: Only dark shadows are used to prevent the "glowing" effect

---

## Typography

### Font Stack
```css
/* Headings */
font-family: "Montserrat", system-ui, sans-serif;

/* Body Text */
font-family: "Source Sans 3", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
```

### Hierarchy
- **H1**: 32px, Montserrat, Bold
- **H2**: 24px, Montserrat, Bold  
- **H3**: 18px, Montserrat, Bold
- **Body**: 16px, Source Sans 3, Regular
- **Small**: 14px, Source Sans 3, Regular

### Text Colors
```css
--text: #2b2c2e;      /* Primary text (light) / #f1f1f2 (dark) */
--muted: #67666b;     /* Secondary text (light) / #b5b5b8 (dark) */
```

---

## Theme System

### Light Theme
```css
--bg: #E7EEF7;        /* Background */
--surface: #f2f1ee;   /* Card/component surface */
--stroke: #ffffff;    /* Borders and outlines */
--text: #2b2c2e;      /* Primary text */
--muted: #67666b;     /* Secondary text */
```

### Dark Theme
```css
--bg: #1e1e20;        /* Background */
--surface: #636a6e;   /* Card/component surface */
--stroke: #8a8a8c;    /* Borders and outlines (light gray for contrast) */
--text: #f1f1f2;      /* Primary text */
--muted: #b5b5b8;     /* Secondary text */
```

### Theme Implementation
- Use `data-theme="light"` or `data-theme="dark"` on the `<body>` element
- All components automatically adapt using CSS custom properties
- Theme preference should be stored in localStorage

---

## Components

### 1. Buttons

#### Default State
- **Background**: Light gradient (`linear-gradient(145deg, #ffffff, #dad9d6)`)
- **Shadow**: Raised effect
- **Border**: 1px solid stroke color
- **Padding**: `0 16px`
- **Height**: `40px`
- **Border Radius**: `50px` (fully rounded)

#### Pressed State
- **Light Mode**: Text color changes to tomato, border becomes tomato
- **Dark Mode**: Text color changes to sea green, border becomes sea green
- **Shadow**: Inset effect
- **Background**: Remains surface color (no gradient)

#### Code Example
```html
<button class="btn" data-pressable>Generate Leads</button>
```

### 2. Input Fields

#### Styling
- **Background**: Surface color
- **Shadow**: Inset effect (appears recessed)
- **Border**: 1px solid stroke color
- **Border Radius**: `12px`
- **Padding**: `10px 12px`
- **Height**: `40px`

#### Focus State
- **Shadow**: Changes to raised effect
- **No outline**: Custom focus styling only

#### Placeholder Text
- **Light Mode**: Muted color with 70% opacity
- **Dark Mode**: `#d1d1d3` with 80% opacity for better visibility

#### Code Example
```html
<input class="input" placeholder="e.g., Montana">
<select class="select">
  <option>Healthcare</option>
  <option>Construction</option>
</select>
<textarea class="textarea" placeholder="Optional…"></textarea>
```

### 3. Cards

#### Styling
- **Background**: Surface color
- **Shadow**: Raised effect
- **Border**: 1px solid stroke color
- **Border Radius**: `20px` (large radius)
- **Padding**: `16px`

#### Dark Mode Considerations
- No light shadow (only dark shadow for clean appearance)
- Stroke color is light gray for proper contrast

#### Code Example
```html
<div class="card">
  <h2>Card Title</h2>
  <p>Card content goes here...</p>
</div>
```

### 4. Segmented Controls

#### Structure
- **Container**: Surface background with raised shadow
- **Thumb**: Animated element with inset shadow
- **Labels**: Grid-centered, color changes on selection

#### Active State
- **Text Color**: Tomato orange
- **Thumb Position**: Animates with cubic-bezier easing

#### Code Example
```html
<div class="segmented" style="width:328px">
  <input id="seg-1" type="radio" name="seg" checked>
  <label for="seg-1">Overview</label>
  <input id="seg-2" type="radio" name="seg">
  <label for="seg-2">Use Cases</label>
  <input id="seg-3" type="radio" name="seg">
  <label for="seg-3">Export</label>
  <div class="thumb" id="segThumb"></div>
</div>
```

### 5. Range Slider

#### Track Styling
- **Background**: Bright gradient from sea green to tomato
- **Shadow**: Combined raised and inset effects
- **Border Radius**: `999px` (fully rounded)
- **Height**: `20px`

#### Thumb Styling
- **Size**: `28px` diameter
- **Background**: White
- **Shadow**: Raised effect
- **Active State**: Scales to 96%

#### Gradient Colors
```css
background: linear-gradient(90deg, #91bfa5 0%, #c4a76a 35%, #f36334 100%)
```

#### Code Example
```html
<div class="slider">
  <input type="range" class="range" min="0" max="1000" value="250">
</div>
```

### 6. Loaders

#### Ripple Loader
- **Size**: 84px diameter
- **Animation**: Two expanding rings with brand colors
- **Timing**: 1600ms duration, 300ms delay between rings

#### Breath Loader
- **Size**: 84px diameter
- **Effect**: Pulsing tomato glow
- **Timing**: 1800ms breathing cycle

#### Dot Spinner
- **Size**: 84px container, 56px spinner
- **Colors**: Sea green inner dots, tomato outer dots
- **Animation**: 1s rotation

#### Spinning Drop Loader
- **Size**: 160px × 200px
- **Effect**: Tomato balls moving through neomorphic tracks
- **Timing**: 3.6s cycle with staggered delays

---

## Implementation Guidelines

### 1. CSS Custom Properties
Always use CSS custom properties for colors, shadows, and spacing:
```css
background: var(--surface);
box-shadow: var(--raise);
border: 1px solid var(--stroke);
```

### 2. Border Radius Standards
- **Small**: `10px` (--r-sm)
- **Medium**: `14px` (--r-md)  
- **Large**: `20px` (--r-lg)
- **Full**: `50px` or `999px` for pills/circles

### 3. Spacing System
- **Base unit**: `4px`
- **Common values**: `8px`, `12px`, `16px`, `24px`, `32px`
- **Use consistent gaps**: `gap: 12px` for most layouts

### 4. Animation Timing
- **Fast interactions**: `180ms` (--speed)
- **Smooth transitions**: `300ms`
- **Complex animations**: `1s+` for loaders

### 5. Accessibility
- **Focus indicators**: 3px solid tomato outline with 2px offset
- **Keyboard navigation**: All interactive elements must be keyboard accessible
- **Color contrast**: Ensure WCAG AA compliance
- **Screen readers**: Use proper ARIA labels and semantic HTML

### 6. Responsive Design
- **Mobile-first**: Start with mobile styles, enhance for larger screens
- **Flexible layouts**: Use flexbox and grid
- **Container width**: `min(1120px, 92vw)` for main content areas

---

## Code Examples

### Basic Page Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lead Machine</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
</head>
<body data-theme="light">
  <div class="container">
    <div class="card">
      <!-- Content -->
    </div>
  </div>
</body>
</html>
```

### Theme Toggle Implementation
```javascript
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('cc-theme');

if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
  themeToggle.checked = (savedTheme === 'dark');
}

themeToggle?.addEventListener('change', () => {
  const mode = themeToggle.checked ? 'dark' : 'light';
  document.body.setAttribute('data-theme', mode);
  localStorage.setItem('cc-theme', mode);
});
```

### Pressable Button Implementation
```javascript
function attachPressable(el) {
  const press = () => el.classList.toggle('is-pressed');
  el.addEventListener('click', press);
  el.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      press();
    }
  });
}

document.querySelectorAll('[data-pressable]').forEach(attachPressable);
```

### Form Field Structure
```html
<label class="field">
  <span class="label">Field Label</span>
  <input class="input" placeholder="Placeholder text">
</label>
```

---

## Design Tokens Reference

### Colors
```css
:root {
  /* Brand */
  --cc-tomato: #f36334;
  --cc-sea: #91bfa5;
  --cc-dim1: #566e67;
  --cc-dim2: #5d5d5f;
  --cc-gray: #7c797c;

  /* Light theme */
  --bg: #E7EEF7;
  --surface: #f2f1ee;
  --stroke: #ffffff;
  --text: #2b2c2e;
  --muted: #67666b;

  /* Shadows */
  --raise: 8px 8px 16px #7b7b79, -8px -8px 16px #ffffff;
  --inset: inset 8px 8px 16px #7b7b79, inset -8px -8px 16px #ffffff;

  /* Sizing */
  --r-sm: 10px;
  --r-md: 14px;
  --r-lg: 20px;
  --speed: 180ms;
}
```

---

## Best Practices

### Do's
✅ Use CSS custom properties for all colors and shadows  
✅ Maintain consistent border radius values  
✅ Test in both light and dark themes  
✅ Ensure keyboard accessibility  
✅ Use semantic HTML elements  
✅ Follow the established spacing system  
✅ Test on mobile devices  

### Don'ts
❌ Hard-code color values  
❌ Use different shadow patterns  
❌ Mix border radius values arbitrarily  
❌ Forget focus states  
❌ Use non-semantic HTML  
❌ Create custom spacing values  
❌ Ignore responsive design  

---

## Maintenance Notes

### Adding New Components
1. Follow the established shadow system
2. Use existing CSS custom properties
3. Ensure dark mode compatibility
4. Add proper focus states
5. Test keyboard navigation
6. Document the component

### Updating Colors
1. Update CSS custom properties in `:root`
2. Test all components in both themes
3. Verify accessibility compliance
4. Update documentation

### Version Control
- Keep design tokens in a separate CSS file
- Document all changes in component library
- Maintain backwards compatibility when possible
- Use semantic versioning for major changes

---

*This documentation should be updated whenever new components are added or existing ones are modified. For questions or clarifications, refer to the live style guide at `complete_controller_style_guide.html`.*