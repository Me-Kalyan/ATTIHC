# ATTIHC Design System Style Guide (Enterprise Edition)

## 1. Design Philosophy
The ATTIHC Enterprise design system focuses on professionalism, clarity, and efficiency. It utilizes a high-contrast Zinc/Indigo palette to convey trust and reliability, adhering to strict WCAG AA standards. The interface prioritizes content density without sacrificing readability, suitable for high-performance productivity.

## 2. Color Palette
All colors are defined as CSS variables in `src/app/globals.css`.

### Light Mode
- **Background**: `#ffffff` (White)
- **Foreground (Text)**: `#09090b` (Zinc 950)
- **Primary (Brand)**: `#4f46e5` (Indigo 600)
- **Muted Foreground**: `#71717a` (Zinc 500)
- **Border**: `#e4e4e7` (Zinc 200)

### Dark Mode
- **Background**: `#09090b` (Zinc 950)
- **Foreground (Text)**: `#fafafa` (Zinc 50)
- **Primary (Brand)**: `#6366f1` (Indigo 500)
- **Card Background**: `#18181b` (Zinc 900)
- **Border**: `#27272a` (Zinc 800)

## 3. Typography
- **Primary Font**: `Inter` (sans-serif) - Clean, modern, highly legible at all sizes.
- **Accent Font**: `Playfair Display` (serif) - Used sparingly for headings to add sophistication.
- **Monospace**: `JetBrains Mono` - For data, dates, and code.
- **Base Size**: 16px (1rem).

## 4. Component Styles

### Cards
- **Radius**: `0.5rem` (Rounded-lg)
- **Border**: 1px solid `border/60`
- **Shadow**: `shadow-sm` on rest, `shadow-md` on hover.
- **Background**: `bg-card` (White / Zinc 900)

### Buttons
- **Primary**: Indigo 600 background, white text, subtle shadow.
- **Outline**: White/Transparent background, input border, hover to Zinc 100.
- **Interaction**: Active scale (0.95), smooth transitions (200ms).

### Grid System
- **Responsive**: 1 column (mobile) -> 2 columns (tablet) -> 3 columns (desktop).
- **Gap**: `gap-6` (1.5rem) standard.
- **Max Width**: `max-w-7xl` (1280px) for main content.

## 5. Animations
- **Transitions**: Global 200ms `ease-in-out` for all interactive elements.
- **Micro-interactions**: Hover lifts, active scales, focus rings.
- **Reduced Motion**: Respects system preferences.

## 6. Accessibility
- **Contrast**: All text meets WCAG AA (4.5:1).
- **Focus**: Visible focus rings on all interactive elements.
- **Semantics**: Proper HTML5 structure (header, main, nav).
