/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  prefersReducedMotion,
  prefersHighContrast,
  supportsMaskImage,
  supportsTransitions,
  getMotionPreference,
  watchMotionPreference,
  getBrowserCapabilities
} from '../src/utils/accessibility'

// Mock window.matchMedia for testing
const mockMatchMedia = (matches: boolean = false, addEventListener?: Function, removeEventListener?: Function) => {
  return {
    matches,
    media: '',
    onchange: null,
    addEventListener: addEventListener || vi.fn(),
    removeEventListener: removeEventListener || vi.fn(),
    addListener: vi.fn(), // Legacy support
    removeListener: vi.fn(), // Legacy support
    dispatchEvent: vi.fn()
  }
}

// Mock window.CSS.supports for testing
const mockCSSSupports = (supports: boolean = false) => {
  return vi.fn().mockReturnValue(supports)
}

describe('Accessibility Utilities', () => {
  const originalMatchMedia = window.matchMedia
  const originalCSS = window.CSS

  beforeEach(() => {
    // Reset window.matchMedia and CSS before each test
    window.matchMedia = undefined as any
    window.CSS = undefined as any
  })

  afterEach(() => {
    // Restore original implementations
    window.matchMedia = originalMatchMedia
    window.CSS = originalCSS
  })

  describe('prefersReducedMotion', () => {
    it('returns true when user prefers reduced motion', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => {
          if (query === '(prefers-reduced-motion: reduce)') {
            return mockMatchMedia(true)
          }
          return mockMatchMedia(false)
        })
      })

      expect(prefersReducedMotion()).toBe(true)
    })

    it('returns false when user does not prefer reduced motion', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => mockMatchMedia(false))
      })

      expect(prefersReducedMotion()).toBe(false)
    })

    it('returns false when matchMedia is not available', () => {
      delete (window as any).matchMedia

      expect(prefersReducedMotion()).toBe(false)
    })

    it('returns false when matchMedia throws an error', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => {
          throw new Error('matchMedia not supported')
        })
      })

      expect(prefersReducedMotion()).toBe(false)
    })
  })

  describe('prefersHighContrast', () => {
    it('returns true when user prefers high contrast', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => {
          if (query === '(prefers-contrast: high)') {
            return mockMatchMedia(true)
          }
          return mockMatchMedia(false)
        })
      })

      expect(prefersHighContrast()).toBe(true)
    })

    it('returns true for MS high contrast queries', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => {
          if (query === '(-ms-high-contrast: active)') {
            return mockMatchMedia(true)
          }
          return mockMatchMedia(false)
        })
      })

      expect(prefersHighContrast()).toBe(true)
    })

    it('returns false when user does not prefer high contrast', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => mockMatchMedia(false))
      })

      expect(prefersHighContrast()).toBe(false)
    })
  })

  describe('supportsMaskImage', () => {
    it('returns true when mask-image is supported', () => {
      Object.defineProperty(window, 'CSS', {
        writable: true,
        value: {
          supports: mockCSSSupports(true)
        }
      })

      expect(supportsMaskImage()).toBe(true)
    })

    it('returns true when webkit mask-image is supported', () => {
      Object.defineProperty(window, 'CSS', {
        writable: true,
        value: {
          supports: vi.fn().mockImplementation((property) => {
            return property === '-webkit-mask-image'
          })
        }
      })

      expect(supportsMaskImage()).toBe(true)
    })

    it('returns false when mask-image is not supported', () => {
      Object.defineProperty(window, 'CSS', {
        writable: true,
        value: {
          supports: mockCSSSupports(false)
        }
      })

      expect(supportsMaskImage()).toBe(false)
    })

    it('returns false when CSS.supports is not available', () => {
      delete (window as any).CSS

      expect(supportsMaskImage()).toBe(false)
    })
  })

  describe('supportsTransitions', () => {
    it('returns true when transitions are supported', () => {
      Object.defineProperty(window, 'CSS', {
        writable: true,
        value: {
          supports: mockCSSSupports(true)
        }
      })

      expect(supportsTransitions()).toBe(true)
    })

    it('returns false when transitions are not supported', () => {
      Object.defineProperty(window, 'CSS', {
        writable: true,
        value: {
          supports: mockCSSSupports(false)
        }
      })

      expect(supportsTransitions()).toBe(false)
    })
  })

  describe('getMotionPreference', () => {
    it('returns "reduce" when user prefers reduced motion', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => {
          if (query === '(prefers-reduced-motion: reduce)') {
            return mockMatchMedia(true)
          }
          return mockMatchMedia(false)
        })
      })

      expect(getMotionPreference()).toBe('reduce')
    })

    it('returns "no-preference" when user has no motion preference', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => {
          if (query === '(prefers-reduced-motion: no-preference)') {
            return mockMatchMedia(true)
          }
          return mockMatchMedia(false)
        })
      })

      expect(getMotionPreference()).toBe('no-preference')
    })

    it('returns "unknown" when matchMedia is not available', () => {
      delete (window as any).matchMedia

      expect(getMotionPreference()).toBe('unknown')
    })
  })

  describe('watchMotionPreference', () => {
    it('sets up media query listener and returns cleanup function', () => {
      const mockAddEventListener = vi.fn()
      const mockRemoveEventListener = vi.fn()

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => 
          mockMatchMedia(false, mockAddEventListener, mockRemoveEventListener)
        )
      })

      const callback = vi.fn()
      const cleanup = watchMotionPreference(callback)

      expect(mockAddEventListener).toHaveBeenCalled()

      // Test cleanup
      cleanup()
      expect(mockRemoveEventListener).toHaveBeenCalled()
    })

    it('uses legacy addListener/removeListener for older browsers', () => {
      const mockAddListener = vi.fn()
      const mockRemoveListener = vi.fn()

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: mockAddListener,
          removeListener: mockRemoveListener,
          dispatchEvent: vi.fn()
        }))
      })

      const callback = vi.fn()
      const cleanup = watchMotionPreference(callback)

      expect(mockAddListener).toHaveBeenCalled()

      cleanup()
      expect(mockRemoveListener).toHaveBeenCalled()
    })

    it('returns no-op cleanup when matchMedia is not available', () => {
      delete (window as any).matchMedia

      const callback = vi.fn()
      const cleanup = watchMotionPreference(callback)

      expect(typeof cleanup).toBe('function')
      expect(() => cleanup()).not.toThrow()
    })
  })

  describe('getBrowserCapabilities', () => {
    it('returns comprehensive browser capability information', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => {
          if (query === '(prefers-reduced-motion: reduce)') return mockMatchMedia(true)
          if (query === '(prefers-contrast: high)') return mockMatchMedia(false)
          return mockMatchMedia(false)
        })
      })

      Object.defineProperty(window, 'CSS', {
        writable: true,
        value: {
          supports: vi.fn().mockImplementation((property) => {
            if (property === 'mask-image') return true
            if (property === 'transition') return true
            return false
          })
        }
      })

      const capabilities = getBrowserCapabilities()

      expect(capabilities).toEqual({
        prefersReducedMotion: true,
        prefersHighContrast: false,
        motionPreference: 'reduce',
        supportsMaskImage: true,
        supportsTransitions: true,
        isSSR: false,
        hasMatchMedia: true,
        hasCSSSupports: true
      })
    })

    it('handles server-side rendering environment', () => {
      // Simulate SSR environment by setting window to undefined temporarily  
      const originalWindow = (global as any).window
      Object.defineProperty(global, 'window', {
        value: undefined,
        configurable: true
      })

      const capabilities = getBrowserCapabilities()

      expect(capabilities.isSSR).toBe(true)
      expect(capabilities.hasMatchMedia).toBe(false)
      expect(capabilities.hasCSSSupports).toBe(false)

      // Restore window
      Object.defineProperty(global, 'window', {
        value: originalWindow,
        configurable: true
      })
    })
  })
})