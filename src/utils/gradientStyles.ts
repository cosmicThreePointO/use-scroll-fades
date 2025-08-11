/**
 * CSS utility functions for creating colored gradient fade effects
 * These work in conjunction with the mask-image approach to provide colored fades
 */

import type { GradientColors } from '../types'

/**
 * Default gradient colors
 */
export const DEFAULT_GRADIENT_COLORS: GradientColors = {
  from: 'rgba(0,0,0,0.15)',
  to: 'transparent'
}

/**
 * Creates CSS for colored fade overlays using pseudo-elements
 * This approach combines mask-image transparency with colored gradients
 * @param colors - Gradient color configuration
 * @param direction - CSS gradient direction (e.g., 'to bottom', 'to top')
 * @param position - Positioning for the pseudo-element
 * @returns CSS gradient string
 */
export const createColoredFadeGradient = (
  colors: GradientColors, 
  direction: string
): string => {
  return `linear-gradient(${direction}, ${colors.from}, ${colors.to})`
}

/**
 * Generates CSS custom properties for fade gradients
 * These can be used in stylesheets to create colored fade effects
 * @param options - Gradient configuration options
 * @returns Object with CSS custom properties
 */
export const generateFadeGradientProperties = (options: {
  topColors?: GradientColors
  bottomColors?: GradientColors
  leftColors?: GradientColors
  rightColors?: GradientColors
  fadeColor?: string
  showTop: boolean
  showBottom: boolean
  showLeft: boolean
  showRight: boolean
}): Record<string, string> => {
  const {
    topColors = DEFAULT_GRADIENT_COLORS,
    bottomColors = DEFAULT_GRADIENT_COLORS,
    leftColors = DEFAULT_GRADIENT_COLORS,
    rightColors = DEFAULT_GRADIENT_COLORS,
    fadeColor,
    showTop,
    showBottom,
    showLeft,
    showRight
  } = options

  const resolveColors = (colors: GradientColors): GradientColors => {
    if (fadeColor) {
      return { from: fadeColor, to: 'transparent' }
    }
    return colors
  }

  const properties: Record<string, string> = {}

  if (showTop) {
    const colors = resolveColors(topColors)
    properties['--fade-top-gradient'] = createColoredFadeGradient(colors, 'to bottom')
  }

  if (showBottom) {
    const colors = resolveColors(bottomColors)
    properties['--fade-bottom-gradient'] = createColoredFadeGradient(colors, 'to top')
  }

  if (showLeft) {
    const colors = resolveColors(leftColors)
    properties['--fade-left-gradient'] = createColoredFadeGradient(colors, 'to right')
  }

  if (showRight) {
    const colors = resolveColors(rightColors)
    properties['--fade-right-gradient'] = createColoredFadeGradient(colors, 'to left')
  }

  return properties
}

/**
 * CSS helper class name for containers with colored fades
 * This should be used alongside the mask-image styles
 */
export const COLORED_FADE_CLASS = 'scroll-fades-colored'

/**
 * Generates CSS string for colored fade effects
 * This creates the stylesheet rules needed for colored fades
 * @param className - Base class name (defaults to COLORED_FADE_CLASS)
 * @returns CSS string that can be injected into a style tag
 */
export const generateColoredFadeCSS = (className: string = COLORED_FADE_CLASS): string => {
  return `
.${className} {
  position: relative;
}

.${className}::before,
.${className}::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

.${className}::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--fade-top-gradient, transparent), 
              var(--fade-bottom-gradient, transparent);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.${className}::after {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--fade-left-gradient, transparent), 
              var(--fade-right-gradient, transparent);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
`
}