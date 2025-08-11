export { useScrollFades } from './useScrollFades'
export { computeFadeState } from './computeFadeState'
export type { FadeState, UseScrollFadesOptions } from './types'

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