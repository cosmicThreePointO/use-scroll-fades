# use-scroll-fades

[![npm version](https://img.shields.io/npm/v/@gboue/use-scroll-fades)](https://www.npmjs.com/package/@gboue/use-scroll-fades)
[![npm downloads](https://img.shields.io/npm/dm/@gboue/use-scroll-fades)](https://www.npmjs.com/package/@gboue/use-scroll-fades)

Library-agnostic React hook that adds **scroll-fade indicators** to any scrollable container. Supports both vertical and horizontal scrolling with smooth animations. No CSS frameworks, no runtime dependencies. Works with plain CSS-in-JS, inline styles, or your existing styling solution.

* **Vertical scrolling**: Top/bottom fades for vertical content
* **Horizontal scrolling**: Left/right fades for horizontal content  
* **Smart hiding**: Fades automatically hide at scroll edges
* **Smooth animations**: Built-in CSS transitions with cross-browser support
* Zero external deps, React only
* Ships with TypeScript definitions

---

## Installation

```bash
# npm
npm i @gboue/use-scroll-fades
# or
yarn add @gboue/use-scroll-fades
# or
pnpm add @gboue/use-scroll-fades
```

Types are included. If you use JavaScript only, no extra step is required. If you prefer separate type installs in some setups, the package already contains `*.d.ts` files.

---

## Quick Start (TS or JS)

```tsx
import React from 'react'
import { useScrollFades } from '@gboue/use-scroll-fades'

export default function MessagesList({ items }) {
  const { containerRef, state, getOverlayStyle } = useScrollFades({
    threshold: 12, // px tolerance near edges (optional)
    topGradient: 'linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0))',
    bottomGradient: 'linear-gradient(to top, rgba(0,0,0,0.18), rgba(0,0,0,0))',
  })

  return (
    <div style={{ position: 'relative', maxWidth: 640 }}>
      <div
        ref={containerRef}
        style={{
          overflow: 'auto',
          height: 360,
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          background: '#fff'
        }}
        role='list'
        aria-label='Scrollable list with fade indicators'
      >
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {items.map((node, i) => (
            <li key={i} role='listitem' style={{ padding: 16, borderBottom: '1px solid #f1f5f9' }}>
              {node}
            </li>
          ))}
        </ul>
      </div>

      {/* Fades (non-interactive overlays) */}
      <div aria-hidden style={{
        pointerEvents: 'none',
        position: 'absolute', left: 0, right: 0, top: 0, height: 32,
        borderTopLeftRadius: 12, borderTopRightRadius: 12,
        ...getOverlayStyle('top', state)
      }} />

      <div aria-hidden style={{
        pointerEvents: 'none',
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 32,
        borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
        ...getOverlayStyle('bottom', state)
      }} />
    </div>
  )
}
```

**Result:**

* At top: top fade hidden, bottom fade visible
* At bottom: bottom fade hidden, top fade visible
* Middle: both visible
* **Smooth animations** when fades appear/disappear

---

## Horizontal Scrolling Example

```tsx
import React from 'react'
import { useScrollFades } from '@gboue/use-scroll-fades'

export default function HorizontalCarousel({ slides }) {
  const { containerRef, state, getOverlayStyle } = useScrollFades({
    threshold: 16,
    leftGradient: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0))',
    rightGradient: 'linear-gradient(to left, rgba(255,255,255,0.9), rgba(255,255,255,0))',
    transitionDuration: 250,
  })

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          gap: 16,
          padding: 16,
          borderRadius: 12,
          background: '#f8f9fa'
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} style={{
            minWidth: 200,
            height: 150,
            background: 'white',
            borderRadius: 8,
            padding: 16,
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {slide}
          </div>
        ))}
      </div>

      {/* Left fade overlay */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: 40,
        pointerEvents: 'none',
        ...getOverlayStyle('left', state)
      }} />

      {/* Right fade overlay */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, right: 0, width: 40,
        pointerEvents: 'none',
        ...getOverlayStyle('right', state)
      }} />
    </div>
  )
}
```

**Result:**

* At left edge: left fade hidden, right fade visible
* At right edge: right fade hidden, left fade visible  
* Middle: both visible
* **Supports both horizontal and vertical** scrolling simultaneously

---

## API

```ts
export type FadeState = { 
  showTop: boolean,    // Vertical scroll: top fade visibility
  showBottom: boolean, // Vertical scroll: bottom fade visibility  
  showLeft: boolean,   // Horizontal scroll: left fade visibility
  showRight: boolean   // Horizontal scroll: right fade visibility
}

export type UseScrollFadesOptions = {
  threshold?: number // px edge tolerance, default 8
  // Vertical scroll gradients
  topGradient?: string // CSS gradient for the top overlay
  bottomGradient?: string // CSS gradient for the bottom overlay
  // Horizontal scroll gradients (NEW!)
  leftGradient?: string // CSS gradient for the left overlay
  rightGradient?: string // CSS gradient for the right overlay
  // Animation options
  transitionDuration?: number // Fade transition duration in ms, default 200
  transitionTimingFunction?: string // CSS timing function, default 'ease-out'
  disableTransitions?: boolean // Disable animations, default false
}

export function useScrollFades<T extends HTMLElement = HTMLElement>(
  options?: UseScrollFadesOptions
): {
  containerRef: React.RefObject<T>
  state: FadeState
  /**
   * Helper to get inline styles for overlays without any styling library.
   * You can ignore it and style however you like – it's optional.
   * NEW: Now supports 'left' and 'right' for horizontal scrolling!
   */
  getOverlayStyle: (
    position: 'top' | 'bottom' | 'left' | 'right',
    state?: FadeState
  ) => React.CSSProperties
}
```

### Notes

* **Agnostic**: The hook returns state and a small helper. You are free to style overlays with CSS classes, CSS modules, styled components, etc. The gradients are plain CSS strings you can override.
* **Accessibility**: Overlays are `aria-hidden` and `pointer-events: none` in the example so they never block interaction.
* **Performance**: Uses `requestAnimationFrame`, `ResizeObserver`, and `MutationObserver` to stay accurate during resizes and dynamic content changes without jank.
* **Smooth Animations**: Built-in CSS transitions provide smooth fade in/out effects with cross-browser support.

---

## Animation Options

The hook includes smooth fade animations by default. You can customize or disable them:

```tsx
import { useScrollFades } from '@gboue/use-scroll-fades'

// Default smooth animations (200ms ease-out)
const { containerRef, state, getOverlayStyle } = useScrollFades()

// Custom animation timing
const customAnimated = useScrollFades({
  transitionDuration: 300, // 300ms duration
  transitionTimingFunction: 'ease-in-out' // Custom easing
})

// Faster animations
const quickFades = useScrollFades({
  transitionDuration: 100, // Snappy 100ms
  transitionTimingFunction: 'ease-out'
})

// Disable animations entirely
const noAnimations = useScrollFades({
  disableTransitions: true // Instant show/hide
})

// Custom CSS transitions (for advanced users)
const advancedAnimations = useScrollFades({
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' // Material Design easing
})
```

### Supported CSS Timing Functions

All standard CSS timing functions are supported across modern browsers:
- `ease`, `ease-in`, `ease-out`, `ease-in-out` 
- `linear`
- `cubic-bezier(n,n,n,n)` for custom curves
- `steps(n, start|end)` for stepped animations

---

## Advanced Usage

### Custom Styling with CSS Classes

```tsx
import React from 'react'
import { useScrollFades } from '@gboue/use-scroll-fades'
import './ScrollFades.css' // Your custom CSS

export default function CustomStyledList({ items }) {
  const { containerRef, state } = useScrollFades({ threshold: 16 })

  return (
    <div className="scroll-container">
      <div ref={containerRef} className="scrollable-content">
        {items.map((item, i) => (
          <div key={i} className="list-item">{item}</div>
        ))}
      </div>
      
      {/* Custom CSS classes instead of inline styles */}
      <div className={`fade-overlay fade-top ${state.showTop ? 'visible' : 'hidden'}`} />
      <div className={`fade-overlay fade-bottom ${state.showBottom ? 'visible' : 'hidden'}`} />
    </div>
  )
}
```

### With Styled Components

```tsx
import React from 'react'
import styled from 'styled-components'
import { useScrollFades } from '@gboue/use-scroll-fades'

const Container = styled.div`
  position: relative;
  max-width: 640px;
`

const ScrollableArea = styled.div`
  overflow: auto;
  height: 300px;
  background: white;
  border-radius: 8px;
`

const FadeOverlay = styled.div<{ $visible: boolean; $position: 'top' | 'bottom' }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 40px;
  pointer-events: none;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.2s ease;
  
  ${props => props.$position === 'top' ? `
    top: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.9), transparent);
  ` : `
    bottom: 0;
    background: linear-gradient(to top, rgba(255,255,255,0.9), transparent);
  `}
`

export default function StyledList({ items }) {
  // Note: Hook provides built-in smooth transitions
  // But you can also use styled-components transitions as shown above
  const { containerRef, state, getOverlayStyle } = useScrollFades({ 
    threshold: 10,
    transitionDuration: 250 // Slightly slower for demo
  })

  return (
    <Container>
      <ScrollableArea ref={containerRef}>
        {items.map((item, i) => <div key={i}>{item}</div>)}
      </ScrollableArea>
      
      {/* Option 1: Use hook's built-in animations */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: 40,
        pointerEvents: 'none',
        ...getOverlayStyle('top')
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 40,
        pointerEvents: 'none', 
        ...getOverlayStyle('bottom')
      }} />
      
      {/* Option 2: Or use styled-components animations */}
      {/* <FadeOverlay $visible={state.showTop} $position="top" />
      <FadeOverlay $visible={state.showBottom} $position="bottom" /> */}
    </Container>
  )
}
```

### Virtualized Lists (React Window)

```tsx
import React from 'react'
import { FixedSizeList as List } from 'react-window'
import { useScrollFades } from '@gboue/use-scroll-fades'

export default function VirtualizedList({ items }) {
  const { containerRef, state, getOverlayStyle } = useScrollFades()

  return (
    <div style={{ position: 'relative', height: 400, width: 300 }}>
      <List
        ref={containerRef}
        height={400}
        itemCount={items.length}
        itemSize={50}
      >
        {({ index, style }) => (
          <div style={style}>
            {items[index]}
          </div>
        )}
      </List>
      
      <div aria-hidden style={{
        ...getOverlayStyle('top', state),
        position: 'absolute', top: 0, left: 0, right: 0, height: 30
      }} />
      <div aria-hidden style={{
        ...getOverlayStyle('bottom', state),
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 30
      }} />
    </div>
  )
}
```

---

## Accessibility Tips

* Keep overlays `aria-hidden` so screen readers ignore them
* Avoid placing tabbable elements inside fade overlays
* Consider adding `aria-live` status text like "More content below" if your UX requires it
* Test with keyboard navigation to ensure overlays don't interfere

---

## Performance Tips

* The hook automatically throttles scroll events using `requestAnimationFrame`
* `ResizeObserver` and `MutationObserver` ensure fades update when content changes
* State updates are optimized to prevent unnecessary re-renders
* No external dependencies means smaller bundle size

---

## Browser Compatibility

The package works in all modern browsers with full animation support:

### ✅ Fully Supported
- **Chrome 26+** (2013+)
- **Firefox 16+** (2012+) 
- **Safari 9+** (2015+)
- **Edge 12+** (2015+)
- **iOS Safari 9+** (2015+)
- **Android Chrome 26+** (2013+)

### 🔧 Core Features (without animations)
- **Internet Explorer 11** - Fade effects work, but no smooth transitions
- **Older browsers** - Falls back to instant show/hide

### Technical Details

The animations use CSS `opacity` transitions with vendor prefixes for maximum compatibility:
```css
transition: opacity 200ms ease-out;
-webkit-transition: opacity 200ms ease-out; /* Safari */
-moz-transition: opacity 200ms ease-out;    /* Firefox */
-ms-transition: opacity 200ms ease-out;     /* IE/Edge */
```

**Performance optimized:**
- Uses `opacity` (GPU-accelerated) instead of `display` changes
- `pointer-events: none` prevents interaction overhead  
- `requestAnimationFrame` for smooth scroll handling
- `ResizeObserver` and `MutationObserver` for efficient updates

**Accessibility features:**
- `aria-hidden="true"` on overlay elements
- Respects `prefers-reduced-motion` when you disable transitions
- No interference with keyboard navigation or screen readers

---

## FAQ

**Does it work without any CSS library?**  
Yes. The hook returns state plus `getOverlayStyle`. You can replace those inline styles with your own classes if you prefer.

**Can I use it in virtualized lists (e.g., React Window)?**  
Yes. Attach `containerRef` to the scrollable viewport element and it will work the same.

**Is SSR supported?**  
Yes. The hook only touches DOM APIs inside `useEffect`, so it's safe on the server; fades initialize on the client.

**How do I theme the gradients?**  
Override `topGradient` and `bottomGradient` with any valid CSS gradient or image.

**Does it support horizontal scrolling?**  
Yes! Version 2.0+ supports both vertical and horizontal scrolling. Use `leftGradient`/`rightGradient` options and `getOverlayStyle('left'|'right')` for horizontal fades.

**What React versions are supported?**  
React 16.8+ (hooks support). Tested with React 17, 18, and 19.

**Can I use it with CSS-in-JS libraries?**  
Absolutely. The hook is styling-agnostic - use it with styled-components, emotion, or any CSS solution.

---

## Contributing

Issues and pull requests are welcome! Please ensure tests pass before submitting.

```bash
# Development setup
npm install
npm run test
npm run build
```

---

## License

MIT