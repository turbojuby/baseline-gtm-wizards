# GTM Wizards Design System

Single source of truth for all generated HTML output. Every teaser deck, discovery deck, business case, and ROI calculator must follow this spec exactly.

---

## Color System

All colors are defined as CSS custom properties in `:root`. Reference them via `var(--name)` only — never hardcode hex values.

```css
:root {
  --bg: #01395d;           /* Primary background — Baseline navy */
  --bg-dark: #012d4a;      /* Darker variant for gradients */
  --bg-darker: #01243c;    /* Darkest variant for deep sections */
  --surface: rgba(255,255,255,0.06);       /* Glass card background */
  --surface-hover: rgba(255,255,255,0.10); /* Glass card hover state */
  --border: rgba(255,255,255,0.10);        /* Default card/element borders */
  --border-hover: rgba(255,255,255,0.18);  /* Hover border state */
  --text: #ffffff;                         /* Primary text */
  --text-mid: rgba(255,255,255,0.75);      /* Secondary text (subtitles, descriptions) */
  --text-dim: rgba(255,255,255,0.50);      /* Tertiary text (labels, meta) */
  --coral: #e85d56;        /* Attention/urgency accent */
  --coral-light: #f08a85;  /* Coral for text on dark */
  --teal: #7ecac1;         /* Primary positive accent */
  --teal-light: #a8ddd7;   /* Teal for text on dark */
  --green: #10b981;        /* Success/growth accent */
  --green-light: #34d399;  /* Green for text on dark */
  --amber: #f59e0b;        /* Warning/highlight accent */
  --amber-light: #fbbf24;  /* Amber for text on dark */
  --esker-red: #e4042a;    /* Esker brand red — use sparingly */
}
```

### When to Use Each Color

| Color | Use For |
|-------|---------|
| `--bg` / `--bg-dark` / `--bg-darker` | Section backgrounds via `linear-gradient()`. Alternate gradient directions per section. |
| `--surface` / `--surface-hover` | Glass card backgrounds. Default and hover states. |
| `--border` / `--border-hover` | Card borders, dividers, subtle separators. |
| `--text` | Headlines, strong emphasis, card bold text. |
| `--text-mid` | Subtitles, body copy, card descriptions. |
| `--text-dim` | Section labels, meta text, stat labels. Use `text-transform: uppercase` and `letter-spacing: 2-3px`. |
| `--coral` / `--coral-light` | Urgency, pain points, cost metrics, section labels. Coral for borders/accents, coral-light for text. |
| `--teal` / `--teal-light` | Positive outcomes, CTA dots, shimmer gradient anchors, active nav dots, credibility bars. Teal for borders/accents, teal-light for text. |
| `--green` / `--green-light` | Growth, savings, ROI metrics. Green for borders/accents, green-light for stat values. |
| `--amber` / `--amber-light` | Warnings, attention metrics, SG&A or risk data. Amber for borders/accents, amber-light for stat values. |
| `--esker-red` | Esker brand mark, "Why Esker" section labels only. Never use as a general accent. |

---

## Typography

**Font:** Plus Jakarta Sans via Google Fonts.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Type Scale

| Element | Size | Weight | Letter Spacing | Line Height | Notes |
|---------|------|--------|---------------|-------------|-------|
| Hero title | `clamp(48px, 6vw, 80px)` | 800 | `-3px` | `1.05` | Always `.shimmer-text` |
| Section title | `clamp(40px, 5vw, 64px)` | 800 | `-2.5px` | `1.1` | |
| CTA title | `clamp(40px, 5vw, 64px)` | 800 | `-2.5px` | `1.1` | Contains `<span class="shimmer-text">` |
| Hero subtitle | `clamp(18px, 1.6vw, 24px)` | 400 | `0.5px` | default | Color: `--text-mid` |
| Section subtitle | `17px` | default | default | default | Color: `--text-mid`, `max-width: 650px` |
| CTA subtitle | `18px` | default | default | default | Color: `--text-mid`, `max-width: 520px` |
| Section label | `13px` | 700 | `3px` | default | `text-transform: uppercase`, color: `--coral` or `--esker-red` |
| Hero meta | `13px` | 600 | `2px` | default | `text-transform: uppercase`, color: `--text-dim` |
| Stat value | `clamp(36px, 3.5vw, 48px)` | 800 | `-2px` | `1` | `font-variant-numeric: tabular-nums` |
| Stat label | `12px` | 700 | `2px` | `1.4` | `text-transform: uppercase`, color: `--text-dim` |
| Card accent number | `clamp(32px, 3vw, 44px)` | 800 | `-1.5px` | `1` | |
| Card title | `15px` | 700 | `1.5px` | default | `text-transform: uppercase`, color: `--text-mid` |
| Card description | `16px` | default | default | `1.5` | Color: `--text-mid`, `<strong>` uses `--text` |
| Body text | `16-17px` | 500 | default | `1.5` | Color: `--text-mid` |
| CTA list item | `17px` | default | default | `1.5` | Color: `--text-mid`, `<strong>` uses `--text` |
| Contact name | `20px` | 700 | default | default | |
| Contact details | `16px` | default | default | default | Color: `--text-mid`, links use `--teal` |

---

## Layout

### Global

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

html {
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  font-size: 18px;
}

body {
  color: var(--text);
  background: var(--bg);
  overflow-x: hidden;
}
```

### Sections

Every section is a full-viewport scroll-snap target:

```css
section {
  min-height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: clamp(40px, 6vh, 80px) clamp(24px, 5vw, 120px);
}
```

### Section Inner Container

All content lives inside `.section-inner`:

```css
.section-inner {
  width: 100%;
  max-width: 1100px;
  position: relative;
  z-index: 2;
}
```

### Grid Patterns

**Stat Grid** (4 columns, used for key metrics):

```css
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
```

**Value Grid** (3 columns, used for value proposition cards):

```css
.value-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}
```

### Responsive Breakpoints

**900px** — Tablet:
```css
@media (max-width: 900px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .value-grid { grid-template-columns: 1fr; }
  .dpo-label { width: 80px; font-size: 11px; }
  .nav-dots { display: none; }
}
```

**600px** — Mobile:
```css
@media (max-width: 600px) {
  section { padding: 40px 20px; }
  .stat-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .logo-row { gap: 16px; }
  .logo-row svg { height: 40px; }
  .hero-title { letter-spacing: -2px; }
  .cta-card { padding: 24px 20px; }
}
```

---

## Components

### Glass Cards

The primary content container. Uses frosted glass effect with hover lift.

```css
.glass {
  background: var(--surface);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px 32px;
  transition: background 0.3s, border-color 0.3s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.glass:hover {
  background: var(--surface-hover);
  border-color: var(--border-hover);
  transform: translateY(-3px);
}
```

### Stat Cards

Glass cards for key metrics. Colored top border indicates the metric's category.

```html
<div class="glass stat-card coral reveal-scale reveal-delay-3">
  <div class="stat-value" data-target="23" data-suffix=" days">0</div>
  <div class="stat-label">Metric Name</div>
</div>
```

```css
.stat-card { text-align: center; padding: 24px 16px; }
.stat-value {
  font-size: clamp(36px, 3.5vw, 48px);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1;
  margin-bottom: 8px;
  font-variant-numeric: tabular-nums;
}
.stat-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-dim);
  line-height: 1.4;
}
```

Color variants (apply via class on `.stat-card`):

| Class | Value Color | Top Border |
|-------|------------|------------|
| `.coral` | `--coral` | `3px solid var(--coral)` |
| `.teal` | `--teal` | `3px solid var(--teal)` |
| `.amber` | `--amber` | `3px solid var(--amber)` |
| `.green` | `--green-light` | `3px solid var(--green)` |

### Value Cards

Larger cards for value propositions. Each has an accent number, title, and description.

```html
<div class="glass value-card green-accent reveal-scale reveal-delay-3">
  <div class="card-accent" data-target="1.75" data-prefix="$" data-suffix="M" data-decimals="2">$0</div>
  <div class="card-title">Feature Name</div>
  <div class="card-desc"><strong>Bold lead</strong> — supporting detail text.</div>
</div>
```

```css
.value-card { padding: 32px 28px; display: flex; flex-direction: column; }
.value-card .card-accent {
  font-size: clamp(32px, 3vw, 44px);
  font-weight: 800;
  letter-spacing: -1.5px;
  line-height: 1;
  margin-bottom: 6px;
}
.value-card .card-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-mid);
  margin-bottom: 16px;
}
.value-card .card-desc {
  font-size: 16px;
  color: var(--text-mid);
  line-height: 1.5;
  flex: 1;
}
.value-card .card-desc strong { color: var(--text); }
```

Color variants (apply via class on `.value-card`):

| Class | Accent Color | Top Border |
|-------|-------------|------------|
| `.green-accent` | `--green-light` | `3px solid var(--green)` |
| `.teal-accent` | `--teal-light` | `3px solid var(--teal)` |
| `.coral-accent` | `--coral-light` | `3px solid var(--coral)` |

### DPO Comparison Bars

Horizontal animated bars for comparing metrics across companies.

```html
<div class="dpo-comparison reveal reveal-delay-3">
  <div class="dpo-row">
    <span class="dpo-label" style="color:var(--coral-light);">Company A</span>
    <div class="dpo-bar-track">
      <div class="dpo-bar" style="background:linear-gradient(90deg, var(--coral), rgba(232,93,86,0.6)); width:30%;">23 days</div>
    </div>
  </div>
</div>
```

```css
.dpo-comparison { display: flex; flex-direction: column; gap: 14px; margin-bottom: 44px; }
.dpo-row { display: flex; align-items: center; gap: 16px; }
.dpo-label { width: 130px; font-size: 15px; font-weight: 600; text-align: right; flex-shrink: 0; }
.dpo-bar-track {
  flex: 1;
  height: 40px;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
.dpo-bar {
  height: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding-left: 14px;
  font-size: 16px;
  font-weight: 700;
  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}
```

Bar colors use gradients: solid accent on left fading to 50% opacity on right.

### Credibility Bar

Centered bordered card for social proof statements.

```html
<div class="credibility-bar glass reveal reveal-delay-6">
  <p><strong>Key credibility statement</strong> — supporting context.</p>
</div>
```

```css
.credibility-bar {
  text-align: center;
  padding: 20px 32px;
  border: 1px solid rgba(126,202,193,0.2);
  border-radius: 12px;
  background: rgba(126,202,193,0.04);
}
.credibility-bar p { font-size: 16px; color: var(--text-mid); font-weight: 500; }
.credibility-bar strong { color: var(--teal-light); }
```

### CTA Card with Dot List

```html
<div class="glass cta-card reveal reveal-delay-2">
  <ul class="cta-list">
    <li>
      <div class="cta-dot"></div>
      <span><strong>Bold point</strong> — supporting text</span>
    </li>
  </ul>
</div>
```

```css
.cta-card { max-width: 600px; margin: 0 auto 48px; text-align: left; padding: 32px 36px; }
.cta-list { list-style: none; display: flex; flex-direction: column; gap: 18px; }
.cta-list li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 17px;
  color: var(--text-mid);
  line-height: 1.5;
}
.cta-list li strong { color: var(--text); }
.cta-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--teal);
  box-shadow: 0 0 12px rgba(126,202,193,0.5);
  flex-shrink: 0;
  margin-top: 6px;
}
```

### Logo Row with Divider

Used in hero section and footer.

```html
<div class="logo-row reveal">
  <svg viewBox="0 0 213 93" ...><!-- Baseline logo (inline from assets/logos/baseline-logo.svg) --></svg>
  <div class="logo-divider"></div>
  <svg viewBox="0 0 1555 725" ...><!-- Esker logo --></svg>
</div>
```

**Hero:** `svg { height: 80px }`, gap `28px`, divider height `56px`

**Footer:** `svg { height: 60px }`, gap `24px`, divider height `42px`, container `opacity: 0.5`

```css
.logo-divider { width: 1px; height: 56px; background: rgba(255,255,255,0.2); }
.footer-divider { width: 1px; height: 42px; background: rgba(255,255,255,0.15); }
```

### Navigation Dots

Fixed right-side dot navigation for sections.

```css
.nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 1.5px solid rgba(255,255,255,0.35);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.nav-dot.active {
  background: var(--teal);
  border-color: var(--teal);
  transform: scale(1.4);
  box-shadow: 0 0 12px rgba(126,202,193,0.5);
}
```

Each dot has a tooltip on hover:

```css
.nav-dot .tooltip {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-dark);
  color: var(--text);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  border: 1px solid var(--border);
}
.nav-dot:hover .tooltip { opacity: 1; }
```

Hidden below 900px viewport width.

### Progress Bar

Fixed top bar showing scroll progress.

```css
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--teal), var(--coral));
  z-index: 200;
  transition: width 0.15s ease-out;
  box-shadow: 0 0 12px rgba(126,202,193,0.4);
}
```

---

## Animations

### Reveal Animations

All content elements must have a reveal class. Elements start invisible and animate in when scrolled into view.

**Fade up** (default):
```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.visible { opacity: 1; transform: translateY(0); }
```

**Scale in** (for cards):
```css
.reveal-scale {
  opacity: 0;
  transform: scale(0.88);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-scale.visible { opacity: 1; transform: scale(1); }
```

**Slide from left:**
```css
.reveal-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-left.visible { opacity: 1; transform: translateX(0); }
```

**Slide from right:**
```css
.reveal-right {
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-right.visible { opacity: 1; transform: translateX(0); }
```

**Delay classes** (stagger child elements):
```css
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }
.reveal-delay-5 { transition-delay: 0.5s; }
.reveal-delay-6 { transition-delay: 0.6s; }
.reveal-delay-7 { transition-delay: 0.7s; }
```

**JavaScript observer** (required in every deck):
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
```

### Shimmer Text

Animated gradient text effect for hero titles and CTA emphasis.

```css
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.shimmer-text {
  background: linear-gradient(90deg, var(--teal-light) 0%, #fff 30%, var(--coral-light) 60%, var(--teal-light) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 6s linear infinite;
}
```

Usage: Apply to full hero `<h1>`, or wrap a `<span class="shimmer-text">` inside CTA titles for partial shimmer.

### Ambient Glow Orbs

Soft pulsing background elements that create depth.

```css
@keyframes pulse {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.28; transform: scale(1.05); }
}
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  animation: pulse 8s ease-in-out infinite;
  z-index: 0;
}
```

Place 2-3 per section with inline styles:
```html
<div class="glow-orb" style="width:500px; height:500px; background:rgba(126,202,193,0.12); top:-15%; right:-10%; animation-delay:0s;"></div>
<div class="glow-orb" style="width:400px; height:400px; background:rgba(232,93,86,0.08); bottom:-20%; left:-8%; animation-delay:3s;"></div>
```

Color guidelines:
- Teal orbs: `rgba(126,202,193, 0.06-0.12)`
- Coral orbs: `rgba(232,93,86, 0.06-0.10)`
- Esker red orbs: `rgba(228,4,42, 0.04-0.06)` — use sparingly

### Floating Particles

Tiny dots that float upward across the viewport.

```css
@keyframes float-up {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
}
.particle {
  position: fixed;
  width: 2px;
  height: 2px;
  background: var(--teal);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  animation: float-up var(--duration) var(--delay) linear infinite;
}
```

Place 6-8 particles with varied positions, durations (17-24s), and delays (0-8s):
```html
<div class="particle" style="left:8%; --duration:18s; --delay:0s;"></div>
<div class="particle" style="left:22%; --duration:22s; --delay:3s;"></div>
<div class="particle" style="left:45%; --duration:20s; --delay:6s;"></div>
<div class="particle" style="left:67%; --duration:24s; --delay:2s;"></div>
<div class="particle" style="left:85%; --duration:19s; --delay:5s;"></div>
<div class="particle" style="left:35%; --duration:21s; --delay:8s;"></div>
<div class="particle" style="left:55%; --duration:17s; --delay:1s;"></div>
<div class="particle" style="left:92%; --duration:23s; --delay:4s;"></div>
```

### Animated Number Counters

Stats and accent numbers animate from 0 to target value on scroll.

Data attributes:
- `data-target` — target number (required)
- `data-prefix` — text before number (e.g., `$`)
- `data-suffix` — text after number (e.g., `M`, ` days`, `%`)
- `data-decimals` — decimal places (default: 0)

```html
<div class="stat-value" data-target="260" data-prefix="$" data-suffix="M+">0</div>
```

**JavaScript** (required in every deck):
```js
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting || e.target.dataset.counted) return;
    e.target.dataset.counted = 'true';
    const target = parseFloat(e.target.dataset.target);
    const decimals = parseInt(e.target.dataset.decimals) || 0;
    const prefix = e.target.dataset.prefix || '';
    const suffix = e.target.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (target * eased).toFixed(decimals);
      e.target.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}, { threshold: 0.3 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));
```

Easing: cubic ease-out (`1 - Math.pow(1 - progress, 3)`), duration 1800ms.

### DPO Bar Animation

Bars animate from 0% to their target width when scrolled into view.

```js
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = 'true';
      const bars = e.target.querySelectorAll('.dpo-bar');
      bars.forEach(bar => {
        const targetWidth = bar.dataset.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bar.style.width = targetWidth;
          });
        });
      });
    }
  });
}, { threshold: 0.3 });

const dpoComp = document.querySelector('.dpo-comparison');
if (dpoComp) barObserver.observe(dpoComp);
```

### Progress Bar (JavaScript)

```js
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
});
```

### Nav Dots (JavaScript)

```js
const sections = document.querySelectorAll('section');
const dots = document.querySelectorAll('.nav-dot');

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.getElementById(dot.dataset.section);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      dots.forEach(d => d.classList.remove('active'));
      const dot = document.querySelector(`.nav-dot[data-section="${e.target.id}"]`);
      if (dot) dot.classList.add('active');
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));
```

---

## Section Patterns

Every deck follows a 4-section structure. Each section uses a different gradient direction for visual variety.

### Section 1: Hero

**Background:** `linear-gradient(160deg, var(--bg-darker) 0%, var(--bg) 40%, var(--bg-dark) 100%)`
**Alignment:** `text-align: center`

Structure:
1. Logo row (Baseline + divider + Esker) — `.reveal`
2. Title with `.shimmer-text` — `.reveal .reveal-delay-1`
3. Subtitle — `.reveal .reveal-delay-2`
4. Meta line (Confidential + Prepared for + Date) — `.reveal .reveal-delay-3`

Glow orbs: teal top-right, coral bottom-left.

### Section 2: The Hook

**Background:** `linear-gradient(170deg, var(--bg) 0%, var(--bg-dark) 100%)`

Structure:
1. Section label (uppercase, coral) — `.reveal`
2. Section title (provocative question or statement) — `.reveal .reveal-delay-1`
3. Section subtitle — `.reveal .reveal-delay-2`
4. Visual (DPO bars, chart, or comparison) — `.reveal .reveal-delay-3`
5. Stat grid (4 cards) — `.reveal-scale .reveal-delay-3` through `.reveal-delay-6`
6. Hook footer (closing provocation) — `.reveal .reveal-delay-7`

Glow orbs: coral top-left, teal bottom-right.

### Section 3: Value

**Background:** `linear-gradient(180deg, var(--bg-dark) 0%, var(--bg) 100%)`

Structure:
1. Section label (uppercase, typically `--esker-red`) — `.reveal`
2. Section title — `.reveal .reveal-delay-1`
3. Subhead (optional, e.g., "8 Consecutive Years") — `.reveal .reveal-delay-2`
4. Section subtitle — `.reveal .reveal-delay-2`
5. Value grid (3 cards) — `.reveal-scale .reveal-delay-3` through `.reveal-delay-5`
6. Credibility bar — `.reveal .reveal-delay-6`

Glow orbs: esker-red top-right, teal bottom-left.

### Section 4: CTA

**Background:** `linear-gradient(160deg, var(--bg) 0%, var(--bg-darker) 100%)`
**Alignment:** `text-align: center`

Structure:
1. CTA title with `<span class="shimmer-text">` on key word — `.reveal`
2. CTA subtitle — `.reveal .reveal-delay-1`
3. CTA card with dot-list (3 items) — `.reveal .reveal-delay-2`
4. Contact block (name + company + email) — `.reveal .reveal-delay-3`
5. Footer logos (dimmed, smaller) — `.reveal .reveal-delay-4`

Glow orb: single large teal orb, centered top.

---

## Rules

1. **Self-contained.** All CSS and JS must be inline in a single HTML file. No external dependencies except Google Fonts.
2. **CSS custom properties only.** Never hardcode color values. Always reference `var(--name)`.
3. **Reveal classes required.** Every visible content element must have a `.reveal`, `.reveal-scale`, `.reveal-left`, or `.reveal-right` class.
4. **Real data only.** Stats and metrics must come from real sources. Include source attribution (e.g., "Source: 10-K FY2024" in a hook footer or credibility bar).
5. **Logos from assets.** Inline the Baseline SVG from `assets/logos/baseline-logo.svg`. Inline the Esker SVG from `assets/logos/esker-logo.svg`. Both logos are pasted as inline `<svg>` markup.
6. **Confidential header.** Every deck must include a hero meta line: `Confidential · Prepared for [Company] Finance Leadership · [Month Year]`.
7. **No paragraphs.** Copy must be ruthlessly concise. Bold key phrase + dim supporting text. Each section = one glanceable screen.
