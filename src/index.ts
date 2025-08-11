export { useScrollFades } from './useScrollFades'
export { computeFadeState } from './computeFadeState'
export type { FadeState, UseScrollFadesOptions, GradientColors } from './types'

// Export accessibility utilities for advanced use cases
export { 
  prefersReducedMotion, 
  prefersHighContrast, 
  supportsMaskImage, 
  supportsTransitions,
  getMotionPreference,
  watchMotionPreference,
  getBrowserCapabilities
} from './utils/accessibility'

// Export gradient styling utilities for colored fades
export {
  DEFAULT_GRADIENT_COLORS,
  createColoredFadeGradient,
  generateFadeGradientProperties,
  generateColoredFadeCSS,
  COLORED_FADE_CLASS
} from './utils/gradientStyles'