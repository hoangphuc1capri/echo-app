# Design System: ECHO

## 1. Overview

### Creative Direction: "Echo Chamber"

ECHO là nền tảng web giúp học sinh THPT tự đánh giá mức độ phụ thuộc vào AI, nhận diện hiện tượng "Thành tựu rỗng" (Hollow Achievement), và cung cấp lộ trình cá nhân hóa để phục hồi năng lực tư duy độc lập.

**Visual Identity: "Ancient Wisdom meets Modern Clarity"**

ECHO mang cảm giác như đang đọc một cuốn sách cổ điển trong thư viện - ấm áp, riêng tư, và sâu sắc. Website kết hợp giữa vẻ đẹp của thiên nhiên (cây, lá, gỗ) với sự rõ ràng và tinh tế của thiết kế hiện đại.

---

## 2. Color System: Nature's Palette

### Primary Colors

```css
:root {
  /* Primary - Warm Wood */
  --echo-wood: #5C4033;           /* Nâu gỗ - authority, stability */
  --echo-wood-light: #7A5C45;      /* Nâu gỗ nhạt - hover states */
  --echo-wood-dark: #3D2B22;       /* Nâu gỗ đậm - pressed states */

  /* Secondary - Golden Amber */
  --echo-amber: #C9A227;           /* Vàng mật ong - warmth, hope */
  --echo-amber-light: #E5C44A;     /* Vàng mật ong nhạt - highlights */
  --echo-amber-dark: #A68520;      /* Vàng mật ong đậm - active states */

  /* Accent - Forest Green */
  --echo-forest: #2D5016;          /* Xanh rừng - growth, renewal */
  --echo-forest-light: #4A7C23;    /* Xanh rừng nhạt - success states */
  --echo-forest-pale: #E8F0E0;     /* Xanh rừng nhạt - subtle bg */

  /* Surface Colors */
  --echo-paper: #FAF6F0;           /* Giấy cũ - primary background */
  --echo-cream: #F5EDE0;           /* Kem nhạt - card backgrounds */
  --echo-parchment: #EDE4D3;       /* Giấy da - borders, dividers */

  /* Text Colors */
  --echo-ink: #2C1810;             /* Mực đen - primary text */
  --echo-ink-light: #4A3728;       /* Mực nhạt - secondary text */
  --echo-ink-muted: #6B5B4F;       /* Mực mờ - muted text */

  /* Semantic Colors */
  --echo-danger: #8B2635;          /* Đỏ rượu vang - errors, alerts */
  --echo-warning: #C9A227;          /* Vàng - warnings */
  --echo-success: #4A7C23;          /* Xanh lá - success */

  /* Dark Mode */
  --echo-night: #1A1412;            /* Đêm tối - dark background */
  --echo-night-surface: #2A2220;    /* Bề mặt đêm - dark cards */
  --echo-night-elevated: #3A322E;  /* Nổi bật đêm - dark elevated */
  --echo-night-text: #F5EDE0;       /* Văn bản đêm - dark text */
  --echo-night-muted: #9A8A7E;     /* Mờ đêm - dark muted */
}
```

### Color Usage Rules

**The Nature Gradient Rule**: Sử dụng màu sắc từ thiên nhiên: nâu gỗ (authority) → vàng mật ong (warmth) → xanh rừng (growth). Không sử dụng màu nhân tạo hoặc neon.

**The Paper Ground Rule**: Nền chính là giấy cũ (`--echo-paper`), không phải trắng thuần hay đen thuần. Điều này tạo cảm giác ấm áp và gần gũi như một cuốn sách.

**The Text Contrast Rule**: Văn bản phải đủ tương phản để đọc dễ dàng. Sử dụng `--echo-ink` cho văn bản chính, `--echo-ink-muted` cho văn bản phụ.

**The Semantic Consistency Rule**: Các màu semantic (success, warning, danger) được sử dụng nhất quán trong toàn bộ ứng dụng.

---

## 3. Typography System: Two Voices

### Font Stack

```css
/* Display & Headings - Classic Elegance */
--font-display: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;

/* Body & UI - Modern Readability */
--font-body: 'Source Serif 4', 'Source Serif Pro', Georgia, serif;

/* UI Elements - Clean Interface */
--font-ui: 'Inter', 'SF Pro Display', system-ui, sans-serif;

/* Mono - Code & Technical */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

```css
/* Display - Hero & Major Statements */
--type-display-size: clamp(3rem, 6vw, 4.5rem);
--type-display-weight: 600;
--type-display-line: 1.1;
--type-display-tracking: -0.02em;

/* Headline - Section Titles */
--type-headline-size: clamp(2rem, 4vw, 3rem);
--type-headline-weight: 600;
--type-headline-line: 1.2;
--type-headline-tracking: 0;

/* Title - Component Headers */
--type-title-size: 1.5rem;
--type-title-weight: 500;
--type-title-line: 1.35;
--type-title-tracking: 0;

/* Body - Long Form Content */
--type-body-size: 1.125rem;
--type-body-weight: 400;
--type-body-line: 1.75;
--type-body-tracking: 0;

/* Small - Secondary Content */
--type-small-size: 0.875rem;
--type-small-weight: 400;
--type-small-line: 1.5;
--type-small-tracking: 0;

/* Caption - Labels & Metadata */
--type-caption-size: 0.75rem;
--type-caption-weight: 500;
--type-caption-line: 1.4;
--type-caption-tracking: 0.05em;
```

### Typography Rules

**The Serif Display Rule**: Headlines và display text sử dụng serif font (Cormorant Garamond) để tạo cảm giác cổ điển và uy tín.

**The Sans UI Rule**: Buttons, inputs, navigation, và labels sử dụng sans-serif (Inter) để đảm bảo readability và clarity.

**The Line Height Rule**: Body text cần line-height 1.75-1.8 để đọc thoải mái. Display text có thể có line-height 1.1-1.2.

**The Readable Width Rule**: Nội dung dài không được vượt quá 70ch (khoảng 680px) để đọc thoải mái.

---

## 4. Spacing & Layout System

### Base Unit

```css
--space-1: 4px;    /* 0.25rem - micro spacing */
--space-2: 8px;    /* 0.5rem - tight spacing */
--space-3: 12px;   /* 0.75rem - compact spacing */
--space-4: 16px;   /* 1rem - base spacing */
--space-5: 20px;   /* 1.25rem - comfortable spacing */
--space-6: 24px;   /* 1.5rem - standard spacing */
--space-8: 32px;   /* 2rem - section spacing */
--space-10: 40px;  /* 2.5rem - large spacing */
--space-12: 48px;  /* 3rem - major spacing */
--space-16: 64px;  /* 4rem - section gaps */
--space-20: 80px;  /* 5rem - page sections */
--space-24: 96px;  /* 6rem - major divisions */
```

### Layout Tokens

```css
/* Container */
--container-max: 1200px;
--container-padding: 24px;

/* Card */
--card-padding-sm: 16px;
--card-padding-md: 24px;
--card-padding-lg: 32px;

/* Border Radius */
--radius-sm: 4px;     /* Subtle - inputs, small elements */
--radius-md: 8px;     /* Standard - cards, buttons */
--radius-lg: 12px;    /* Large - modals, major cards */
--radius-xl: 16px;    /* Extra large - hero elements */
--radius-full: 9999px; /* Pill - buttons, badges */
```

### Layout Rules

**The Container Rule**: Sử dụng container 1200px max-width với padding 24px cho desktop, 16px cho mobile.

**The Reading Width Rule**: Nội dung văn bản dài (letter, quiz content) giới hạn ở 70ch để tối ưu readability.

**The Visual Rhythm Rule**: Section spacing sử dụng multiples của 8px (8, 16, 24, 32, 48, 64px).

---

## 5. Component Kit

### Buttons

**Primary Button**
```css
.echo-btn-primary {
  background: var(--echo-wood);
  color: white;
  font-family: var(--font-ui);
  font-weight: 500;
  font-size: 1rem;
  padding: 12px 32px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.echo-btn-primary:hover {
  background: var(--echo-wood-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(92, 64, 51, 0.2);
}
.echo-btn-primary:active {
  background: var(--echo-wood-dark);
  transform: translateY(0);
}
```

**Secondary Button**
```css
.echo-btn-secondary {
  background: transparent;
  color: var(--echo-wood);
  font-family: var(--font-ui);
  font-weight: 500;
  border: 2px solid var(--echo-wood);
  padding: 10px 30px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}
.echo-btn-secondary:hover {
  background: var(--echo-wood);
  color: white;
}
```

**Ghost Button**
```css
.echo-btn-ghost {
  background: transparent;
  color: var(--echo-ink);
  font-family: var(--font-ui);
  font-weight: 500;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.echo-btn-ghost:hover {
  color: var(--echo-wood);
  background: rgba(92, 64, 51, 0.08);
}
```

**Button Sizes**
```css
--btn-height-sm: 36px;   /* Small - inline actions */
--btn-height-md: 44px;   /* Medium - standard buttons */
--btn-height-lg: 52px;   /* Large - CTAs */
```

### Cards

**Standard Card**
```css
.echo-card {
  background: var(--echo-cream);
  border: 1px solid var(--echo-parchment);
  border-radius: var(--radius-lg);
  padding: var(--card-padding-md);
  transition: all 0.3s ease;
}
.echo-card:hover {
  border-color: var(--echo-wood);
  box-shadow: 0 12px 32px rgba(92, 64, 51, 0.1);
  transform: translateY(-4px);
}
```

**Elevated Card**
```css
.echo-card-elevated {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--card-padding-lg);
  box-shadow: 0 4px 24px rgba(44, 24, 16, 0.08);
}
```

### Inputs

**Text Input**
```css
.echo-input {
  background: white;
  border: 1px solid var(--echo-parchment);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  font-family: var(--font-ui);
  font-size: 1rem;
  color: var(--echo-ink);
  transition: all 0.2s ease;
  width: 100%;
}
.echo-input:focus {
  outline: none;
  border-color: var(--echo-wood);
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
}
.echo-input::placeholder {
  color: var(--echo-ink-muted);
}
.echo-input.error {
  border-color: var(--echo-danger);
}
.echo-input.error:focus {
  box-shadow: 0 0 0 3px rgba(139, 38, 53, 0.1);
}
```

### Badges

**Category Badge**
```css
.echo-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.echo-badge-seed {
  background: var(--echo-forest-pale);
  color: var(--echo-forest);
}
.echo-badge-walker {
  background: #FEF3C7;
  color: #92400E;
}
.echo-badge-supported {
  background: #DBEAFE;
  color: #1E40AF;
}
.echo-badge-borrowed {
  background: #FEE2E2;
  color: #991B1B;
}
.echo-badge-prisoner {
  background: #F3E8FF;
  color: #6B21A8;
}
```

---

## 6. Motion System

### Animation Tokens

```css
/* Duration */
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 800ms;

/* Easing */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Delays */
--delay-1: 100ms;
--delay-2: 200ms;
--delay-3: 300ms;
--delay-4: 400ms;
--delay-5: 500ms;
```

### Animation Patterns

**Fade In Up (Entrance)**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in-up {
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
}
```

**Staggered Entrance**
```css
.stagger-children > * {
  opacity: 0;
  animation: fadeInUp var(--duration-normal) var(--ease-out) forwards;
}
.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 100ms; }
.stagger-children > *:nth-child(3) { animation-delay: 200ms; }
.stagger-children > *:nth-child(4) { animation-delay: 300ms; }
.stagger-children > *:nth-child(5) { animation-delay: 400ms; }
```

**Tree Growth (Spring)**
```css
@keyframes treeGrow {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.tree-grow {
  animation: treeGrow var(--duration-slower) var(--ease-spring) forwards;
}
```

**Page Flip**
```css
@keyframes pageFlip {
  0% { transform: rotateY(0deg); opacity: 1; }
  50% { transform: rotateY(-90deg); opacity: 0; }
  51% { transform: rotateY(90deg); opacity: 0; }
  100% { transform: rotateY(0deg); opacity: 1; }
}
.page-flip {
  animation: pageFlip var(--duration-slow) var(--ease-in-out);
}
```

**Hover Lift**
```css
.echo-lift {
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}
.echo-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(92, 64, 51, 0.12);
}
```

### Motion Rules

**The Purposeful Motion Rule**: Mọi animation phải có mục đích rõ ràng: entrance (thông báo sự xuất hiện), feedback (thông báo tương tác), hoặc continuity (duy trì context).

**The Reduced Motion Rule**: Luôn hỗ trợ `prefers-reduced-motion` để người dùng có thể tắt animation nếu cần.

**The No Bounce Rule**: Không sử dụng bounce/elastic easing trừ khi animation đó mô phỏng vật lý tự nhiên (ví dụ: tree grow).

---

## 7. Visual Assets

### Icon Library

**Lucide React** - Icons được sử dụng trong ECHO:
- Consistent stroke width (2px)
- Rounded line caps
- Minimal, clean aesthetic

### Decorative Elements

**Tree Visualization**
- SVG-based tree growing animation
- Color changes based on score (healthy green → struggling yellow → unhealthy red)
- Branch and leaf count reflects quiz progress

**Paper Texture**
```css
.paper-texture {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
}
```

**Leaf Decorations**
- Subtle botanical SVG elements
- Used sparingly as section dividers or background accents
- Green tones matching the forest accent color

---

## 8. Anti-Patterns (What NOT To Do)

### Colors
- ❌ Do not use pure black (`#000000`) or pure white (`#FFFFFF`) as primary backgrounds
- ❌ Do not use neon or electric colors
- ❌ Do not use purple/blue gradients as primary backgrounds
- ❌ Do not use gray text on colored backgrounds

### Typography
- ❌ Do not use Inter for display/headlines (use serif fonts)
- ❌ Do not use Arial or system defaults for body
- ❌ Do not use all caps for body text
- ❌ Do not use more than 3 font weights on one page

### Components
- ❌ Do not nest cards inside cards
- ❌ Do not use rounded corners larger than 16px
- ❌ Do not use decorative shadows on everything
- ❌ Do not use overly complex animations

### Layout
- ❌ Do not use fixed widths that break responsive
- ❌ Do not have line lengths exceeding 80ch
- ❌ Do not center-align body text (only short phrases)
- ❌ Do not use excessive white space

---

## 9. Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --echo-paper: var(--echo-night);
    --echo-cream: var(--echo-night-surface);
    --echo-parchment: var(--echo-night-elevated);
    --echo-ink: var(--echo-night-text);
    --echo-ink-light: var(--echo-night-text);
    --echo-ink-muted: var(--echo-night-muted);
  }
}
```

### Dark Mode Rules
- Maintain the same color relationships
- Wood colors become slightly muted
- Paper becomes dark brown/charcoal
- Text remains light cream/amber

---

## 10. Accessibility

### Contrast Ratios
- Body text: minimum 4.5:1
- Large text (18px+): minimum 3:1
- UI components: minimum 3:1
- Focus indicators: minimum 3:1

### Focus States
```css
:focus-visible {
  outline: 2px solid var(--echo-wood);
  outline-offset: 2px;
}
```

### Motion Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Component Inventory

### Core Components

| Component | States | Variants |
|-----------|--------|----------|
| Button | default, hover, active, disabled, loading | primary, secondary, ghost, danger |
| Input | default, focus, error, disabled | text, email, password, textarea |
| Card | default, hover, elevated | standard, interactive |
| Badge | - | seed, walker, supported, borrowed, prisoner |
| Progress | - | linear, circular |
| Modal | - | confirmation, form, alert |
| Toast | - | success, warning, error, info |
| Tooltip | - | top, bottom, left, right |
| Avatar | - | sm, md, lg |
| Skeleton | - | text, circle, card |

### Layout Components

| Component | Description |
|-----------|-------------|
| Container | Max-width wrapper with responsive padding |
| Section | Full-width section with vertical rhythm |
| Grid | Responsive grid system (12 columns) |
| Flex | Flexbox utilities |
| Stack | Vertical stacking with consistent gaps |

### Quiz Components

| Component | Description |
|-----------|-------------|
| QuizCard | Question display with answer options |
| TreeVisualization | Growing tree SVG animation |
| ProgressBar | Quiz progress indicator |
| Timer | Countdown display |
| AnswerOption | Individual answer choice |

### Letter Components

| Component | Description |
|-----------|-------------|
| Envelope | Animated envelope opening |
| Letter | Paper-style letter content |
| WaxSeal | Decorative wax seal |
| Typewriter | Text reveal animation |

---

## 12. Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Responsive Rules
- Mobile: Single column, larger touch targets (min 44px)
- Tablet: 2-column grids where appropriate
- Desktop: Full layout with sidebars

---

## 13. Implementation

### File Structure
```
echo-app/
├── app/
│   ├── globals.css          # Design tokens & global styles
│   ├── layout.tsx           # Root layout with fonts
│   └── (routes)/
├── components/
│   ├── ui/                  # Base components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── ...
│   ├── quiz/                # Quiz-specific components
│   ├── letter/              # Letter components
│   └── layout/              # Layout components
├── styles/
│   └── components.css       # Component-specific styles
└── lib/
    └── constants.ts         # Design tokens as constants
```

### Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:wght@400;500;600&display=swap" rel="stylesheet">
```
