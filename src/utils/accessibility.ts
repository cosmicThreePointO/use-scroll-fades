/**
 * Utility functions for accessibility and browser compatibility checks
 */

/**
 * Checks if user prefers reduced motion
 * @returns true if user has prefers-reduced-motion: reduce set
 */
export function prefersReducedMotion(): boolean {
  // Server-side rendering safety check
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch (error) {
    // Fallback for browsers that don't support matchMedia
    return false
  }
}

/**
 * Checks if user prefers high contrast
 * @returns true if user has high contrast mode enabled
 */
export function prefersHighContrast(): boolean {
  // Server-side rendering safety check
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  try {
    // Check for various high contrast media queries
    return window.matchMedia('(prefers-contrast: high)').matches ||
           window.matchMedia('(-ms-high-contrast: active)').matches ||
           window.matchMedia('(-ms-high-contrast: white-on-black)').matches ||
           window.matchMedia('(-ms-high-contrast: black-on-white)').matches
  } catch (error) {
    return false
  }
}

/**
 * Checks if CSS mask-image property is supported
 * @returns true if mask-image is supported
 */
export function supportsMaskImage(): boolean {
  // Server-side rendering safety check
  if (typeof window === 'undefined' || !window.CSS || !window.CSS.supports) {
    return false
  }

  try {
    // Check for standard and webkit-prefixed mask-image support
    return window.CSS.supports('mask-image', 'linear-gradient(black, transparent)') ||
           window.CSS.supports('-webkit-mask-image', 'linear-gradient(black, transparent)')
  } catch (error) {
    return false
  }
}

/**
 * Checks if CSS transitions are supported
 * @returns true if transitions are supported
 */
export function supportsTransitions(): boolean {
  // Server-side rendering safety check
  if (typeof window === 'undefined' || !window.CSS || !window.CSS.supports) {
    return false
  }

  try {
    return window.CSS.supports('transition', 'opacity 0.3s ease')
  } catch (error) {
    return false
  }
}

/**
 * Gets the user's motion preference with fallback options
 * @returns 'reduce' | 'no-preference' | 'unknown'
 */
export function getMotionPreference(): 'reduce' | 'no-preference' | 'unknown' {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'unknown'
  }

  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'reduce'
    }
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      return 'no-preference'
    }
    return 'unknown'
  } catch (error) {
    return 'unknown'
  }
}

/**
 * Creates a media query listener for prefers-reduced-motion changes
 * @param callback Function to call when preference changes
 * @returns Cleanup function
 */
export function watchMotionPreference(callback: (prefersReduced: boolean) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {}
  }

  try {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      callback(e.matches)
    }

    // Add listener (with fallback for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else if (mediaQuery.addListener) {
      // Legacy support for older browsers
      mediaQuery.addListener(handleChange as any)
    }

    // Return cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else if (mediaQuery.removeListener) {
        // Legacy support
        mediaQuery.removeListener(handleChange as any)
      }
    }
  } catch (error) {
    return () => {}
  }
}

/**
 * Comprehensive browser and accessibility capabilities check
 * @returns Object with all capability flags
 */
export function getBrowserCapabilities() {
  return {
    // Accessibility preferences
    prefersReducedMotion: prefersReducedMotion(),
    prefersHighContrast: prefersHighContrast(),
    motionPreference: getMotionPreference(),
    
    // CSS feature support
    supportsMaskImage: supportsMaskImage(),
    supportsTransitions: supportsTransitions(),
    
    // Browser environment
    isSSR: typeof window === 'undefined',
    hasMatchMedia: typeof window !== 'undefined' && !!window.matchMedia,
    hasCSSSupports: typeof window !== 'undefined' && !!window.CSS?.supports,
  }
}