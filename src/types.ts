/**
 * State object representing which fade overlays should be visible
 */
export type FadeState = {
  /** Whether the top fade overlay should be shown (vertical scroll) */
  showTop: boolean
  /** Whether the bottom fade overlay should be shown (vertical scroll) */
  showBottom: boolean
  /** Whether the left fade overlay should be shown (horizontal scroll) */
  showLeft: boolean
  /** Whether the right fade overlay should be shown (horizontal scroll) */
  showRight: boolean
}

/**
 * Gradient color configuration for fade effects
 */
export type GradientColors = {
  /** Start color of the gradient (solid edge). Default: 'rgba(0,0,0,0.15)' */
  from: string
  /** End color of the gradient (fade to transparent). Default: 'transparent' */
  to: string
}

/**
 * Configuration options for the useScrollFades hook
 */
export type UseScrollFadesOptions = {
  /** Distance in pixels from edge before fades appear/disappear. Default: 8 */
  threshold?: number
  /** Size of fade effect in pixels for mask-image approach. Default: 20 */
  fadeSize?: number
  /** Gradient colors for top fade. Default: { from: 'rgba(0,0,0,0.15)', to: 'transparent' } */
  topColors?: GradientColors
  /** Gradient colors for bottom fade. Default: { from: 'rgba(0,0,0,0.15)', to: 'transparent' } */
  bottomColors?: GradientColors
  /** Gradient colors for left fade. Default: { from: 'rgba(0,0,0,0.15)', to: 'transparent' } */
  leftColors?: GradientColors
  /** Gradient colors for right fade. Default: { from: 'rgba(0,0,0,0.15)', to: 'transparent' } */
  rightColors?: GradientColors
  /** Single color applied to all fade directions. Overrides individual direction colors. */
  fadeColor?: string
  /** @deprecated Use topColors instead. CSS gradient for top fade overlay. */
  topGradient?: string
  /** @deprecated Use bottomColors instead. CSS gradient for bottom fade overlay. */
  bottomGradient?: string
  /** @deprecated Use leftColors instead. CSS gradient for left fade overlay. */
  leftGradient?: string
  /** @deprecated Use rightColors instead. CSS gradient for right fade overlay. */
  rightGradient?: string
  /** Duration of fade transition in milliseconds. Default: 200 */
  transitionDuration?: number
  /** CSS timing function for transitions. Default: 'ease-out' */
  transitionTimingFunction?: string
  /** Disable CSS transitions entirely. Default: false */
  disableTransitions?: boolean
  /** Automatically respect user's prefers-reduced-motion setting. Default: true */
  respectReducedMotion?: boolean
  /** Force disable all effects if browser doesn't support mask-image. Default: true */
  respectBrowserSupport?: boolean
  /** Fallback behavior when mask-image is not supported. Default: 'disable' */
  maskImageFallback?: 'disable' | 'ignore'
}