---
name: Nocturnal Urban
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e4bebc'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ab8987'
  outline-variant: '#5b403f'
  surface-tint: '#ffb3b1'
  primary: '#ffb3b1'
  on-primary: '#680011'
  primary-container: '#ff535b'
  on-primary-container: '#5b000e'
  inverse-primary: '#bb152c'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#909191'
  on-tertiary-container: '#282a2a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#410007'
  on-primary-fixed-variant: '#92001c'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  gutter: 16px
  margin: 20px
---

## Brand & Style

The design system is engineered to evoke the high-energy, tech-forward atmosphere of a premium urban resto-bar. It targets a youthful, "always-on" demographic that values speed, aesthetic precision, and a high-end digital experience. 

The aesthetic is a fusion of **Minimalism** and **Glassmorphism**, set against a deep, nocturnal backdrop. It prioritizes high-contrast visuals where content is hero, supported by a "Cyber-Premium" feel—utilizing dark surfaces, sharp accents of vibrant red, and atmospheric glow effects that mimic city neon. The interface should feel like an extension of the nightlife experience: sleek, immersive, and effortless.

## Colors

This design system utilizes a high-contrast, dark-mode-first palette to establish its nocturnal identity.

- **Primary (Vibrant Red):** Used exclusively for high-priority actions, critical highlights, and brand signals. It is the pulse of the UI.
- **Neutral (Deep Black):** The foundation of the interface. This provides the "infinite depth" required for food photography to pop.
- **Secondary (Surface Grey):** A slightly elevated grey (#1a1a1a) used for cards, input fields, and containers to create depth against the pure black background.
- **Tertiary (Crisp White):** Reserved for primary text and icons to ensure maximum legibility and a clean, premium finish.

Gradients should be used sparingly, primarily as subtle top-to-bottom fades from #1a1a1a to #0a0a0a on large surfaces to prevent visual flatness.

## Typography

The typography strategy balances technical precision with high-end editorial clarity. 

**Space Grotesk** is used for headlines and labels to provide a geometric, tech-focused edge that feels modern and urban. Its unique letterforms act as a brand identifier. **Inter** is the workhorse for all body copy and transactional data, chosen for its exceptional legibility on dark screens and its neutral, systematic feel. 

Large headings should use tight leading and slight negative letter-spacing to feel "packed" and impactful, while body text requires generous line height to ensure comfortable scanning of menu descriptions.

## Layout & Spacing

This design system employs a **Fluid Grid** model built on a 4px baseline. The standard layout uses a 12-column grid for desktop and a 4-column grid for mobile devices.

Spacing is designed to be generous to maintain a "Premium" feel; avoid cluttering menu items. Use `xl` (40px) and `xxl` (64px) spacing for section verticality to give the high-quality food photography room to breathe. Components should use the `md` (16px) spacing unit for internal padding as a standard.

## Elevation & Depth

Hierarchy in this design system is created through **Glassmorphism** and **Atmospheric Glows** rather than traditional shadows.

1.  **Base:** The primary background is #0a0a0a.
2.  **Surface:** Cards and containers use a semi-transparent #1a1a1a (approx. 80% opacity) with a `backdrop-filter: blur(12px)`.
3.  **Neon Accents:** Key interactive elements like "Order Now" buttons or active states feature a `box-shadow` that mimics a red neon glow (e.g., `0 0 20px rgba(230, 57, 70, 0.4)`).
4.  **Borders:** Use subtle, 1px low-contrast borders (#ffffff1a) to define edges of glass containers without breaking the dark aesthetic.

## Shapes

The shape language is defined by large, friendly radii that contrast against the "tech" nature of the typography. This softens the urban edge and makes the app feel more accessible and modern.

- **Standard Elements (Buttons, Inputs):** Use `rounded-lg` (1rem).
- **Large Containers (Cards, Modals):** Use `rounded-xl` (1.5rem).
- **Selection Chips:** Use pill-shaped (100px) radii for a distinct tactile feel.

All food photography must follow the container's corner radius to maintain visual harmony.

## Components

### Buttons
Primary buttons are solid Vibrant Red (#e63946) with white text, featuring a subtle red outer glow on hover. Secondary buttons should be "Ghost" style with a white 1px border and high-blur glass background.

### Cards (Menu Items)
Cards must feature full-bleed imagery at the top. The bottom section of the card uses the Glassmorphism style (blurred #1a1a1a). Price points should be highlighted in Space Grotesk Bold.

### Input Fields
Inputs are dark, using a subtle #ffffff1a border. Upon focus, the border transitions to Vibrant Red with a soft glow effect. Label text should use the `label-caps` typography style.

### Navigation Bar
A fixed bottom navigation (for mobile) or a top-integrated glass bar (for desktop). Use high-contrast white icons with a red "dot" indicator for active states or notifications (e.g., items in cart).

### Chips & Filters
Small, pill-shaped elements used for dietary tags (e.g., "Vegan," "Spicy"). Active filters use the primary red background; inactive filters use a dark grey with white text.

### Interactive "Glow" Elements
For "Live Tracking" or "Special Offers," use a pulsing red glow animation to draw the user's eye without being intrusive.