/**
 * State object representing which fade overlays should be visible
 */
export type FadeState = {
  /** Whether the top fade overlay should be shown */
  showTop: boolean
  /** Whether the bottom fade overlay should be shown */
  showBottom: boolean
}

/**
 * Configuration options for the useScrollFades hook
 */
export type UseScrollFadesOptions = {
  /** Distance in pixels from edge before fades appear/disappear. Default: 8 */
  threshold?: number
  /** CSS gradient for top fade overlay. Default: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0))' */
  topGradient?: string
  /** CSS gradient for bottom fade overlay. Default: 'linear-gradient(to top, rgba(0,0,0,0.25), rgba(0,0,0,0))' */
  bottomGradient?: string
  /** Duration of fade transition in milliseconds. Default: 200 */
  transitionDuration?: number
  /** CSS timing function for transitions. Default: 'ease-out' */
  transitionTimingFunction?: string
  /** Disable CSS transitions entirely. Default: false */
  disableTransitions?: boolean
}