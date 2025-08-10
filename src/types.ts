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
 * Configuration options for the useScrollFades hook
 */
export type UseScrollFadesOptions = {
  /** Distance in pixels from edge before fades appear/disappear. Default: 8 */
  threshold?: number
  /** Size of fade effect in pixels for mask-image approach. Default: 20 */
  fadeSize?: number
  /** CSS gradient for top fade overlay. Default: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0))' */
  topGradient?: string
  /** CSS gradient for bottom fade overlay. Default: 'linear-gradient(to top, rgba(0,0,0,0.25), rgba(0,0,0,0))' */
  bottomGradient?: string
  /** CSS gradient for left fade overlay. Default: 'linear-gradient(to right, rgba(0,0,0,0.25), rgba(0,0,0,0))' */
  leftGradient?: string
  /** CSS gradient for right fade overlay. Default: 'linear-gradient(to left, rgba(0,0,0,0.25), rgba(0,0,0,0))' */
  rightGradient?: string
  /** Duration of fade transition in milliseconds. Default: 200 */
  transitionDuration?: number
  /** CSS timing function for transitions. Default: 'ease-out' */
  transitionTimingFunction?: string
  /** Disable CSS transitions entirely. Default: false */
  disableTransitions?: boolean
}