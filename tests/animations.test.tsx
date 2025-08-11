import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useScrollFades } from '../src/useScrollFades'

// Mock CSS.supports to return true for testing
Object.defineProperty(window, 'CSS', {
  value: {
    supports: vi.fn().mockReturnValue(true)
  },
  writable: true
})

// Mock matchMedia to return false for reduced motion (allow effects)
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  })),
  writable: true
})

function AnimationTestComponent({ options = {} }: { options?: any }) {
  const { containerRef, state, getContainerStyle } = useScrollFades(options)
  
  return (
    <div>
      <div 
        ref={containerRef as any}
        data-testid="scrollable-container"
        style={{
          height: '200px',
          overflow: 'auto',
          ...getContainerStyle()
        }}
      >
        <div style={{ height: '500px' }}>Long content for scrolling</div>
      </div>
      <div data-testid="state">{JSON.stringify(state)}</div>
    </div>
  )
}

describe('useScrollFades Animations', () => {
  describe('mask-image transitions', () => {
    it('should include mask transition properties by default', () => {
      render(<AnimationTestComponent />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Check that mask transitions are applied
      expect(container.style.transition).toContain('mask 200ms ease-out')
      expect(container.style.transition).toContain('-webkit-mask 200ms ease-out')
      
      // Check vendor prefixes for cross-browser support
      const computedStyles = (container as any).style
      expect(computedStyles.WebkitTransition).toBeDefined()
      expect(computedStyles.MozTransition).toBeDefined()
      expect(computedStyles.msTransition).toBeDefined()
    })

    it('should set mask-image properties for fade effects', () => {
      render(<AnimationTestComponent />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Should have mask properties
      expect(container.style.maskImage).toBeDefined()
      expect((container as any).style.WebkitMaskImage).toBeDefined()
      expect(container.style.maskComposite).toBe('intersect')
      expect((container as any).style.WebkitMaskComposite).toBe('source-in')
      expect(container.style.maskRepeat).toBe('no-repeat')
      expect(container.style.maskSize).toBe('100% 100%, 100% 100%')
    })

    it('should use linear gradients in mask-image for transparency', () => {
      render(<AnimationTestComponent />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Should contain linear gradient masks
      expect(container.style.maskImage).toContain('linear-gradient(to bottom')
      expect(container.style.maskImage).toContain('linear-gradient(to right')
      expect(container.style.maskImage).toContain('transparent')
      expect(container.style.maskImage).toContain('black')
    })
  })

  describe('custom transition timing', () => {
    it('should respect custom transition duration', () => {
      const options = { transitionDuration: 500 }
      render(<AnimationTestComponent options={options} />)
      
      const container = screen.getByTestId('scrollable-container')
      
      expect(container.style.transition).toContain('mask 500ms ease-out')
    })

    it('should respect custom timing function', () => {
      const options = { transitionTimingFunction: 'steps(4, end)' }
      render(<AnimationTestComponent options={options} />)
      
      const container = screen.getByTestId('scrollable-container')

      expect(container.style.transition).toContain('mask 200ms steps(4, end)')
    })
  })

  describe('disabled animations', () => {
    it('should not include transition properties when disabled', () => {
      const options = { disableTransitions: true }
      render(<AnimationTestComponent options={options} />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Should not have transition properties
      expect(container.style.transition).toBe('')
      expect((container as any).style.WebkitTransition).toBeUndefined()
      expect((container as any).style.MozTransition).toBeUndefined()
      expect((container as any).style.msTransition).toBeUndefined()
    })

    it('should still apply mask properties when transitions are disabled', () => {
      const options = { disableTransitions: true }
      render(<AnimationTestComponent options={options} />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Should still have mask properties
      expect(container.style.maskImage).toBeDefined()
      expect(container.style.maskComposite).toBe('intersect')
    })
  })

  describe('cross-browser vendor prefixes', () => {
    it('should include all major vendor prefixes for masks', () => {
      render(<AnimationTestComponent />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Standard mask properties
      expect(container.style.maskImage).toBeDefined()
      expect(container.style.maskComposite).toBe('intersect')
      
      // Check that vendor prefixes are set as React style properties
      const computedStyles = (container as any).style
      
      // Webkit (Safari, Chrome, newer Edge)
      expect(computedStyles.WebkitMaskImage).toBeDefined()
      expect(computedStyles.WebkitMaskComposite).toBe('source-in')
      expect(computedStyles.WebkitMaskRepeat).toBe('no-repeat')
      
      // Transition prefixes
      expect(computedStyles.WebkitTransition).toBeDefined()
      expect(computedStyles.MozTransition).toBeDefined()
      expect(computedStyles.msTransition).toBeDefined()
    })
  })

  describe('fadeSize configuration', () => {
    it('should use custom fade size when fades are active', () => {
      function CustomFadeSizeComponent() {
        const { containerRef, getContainerStyle } = useScrollFades({ fadeSize: 32 })
        // Force all fades to be visible by passing custom state
        const customState = { showTop: true, showBottom: true, showLeft: true, showRight: true }
        
        return (
          <div 
            ref={containerRef as any}
            data-testid="scrollable-container"
            style={{
              height: '200px',
              overflow: 'auto',
              ...getContainerStyle(customState)
            }}
          >
            <div style={{ height: '500px' }}>Long content</div>
          </div>
        )
      }
      
      render(<CustomFadeSizeComponent />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Should contain the custom fade size in mask gradients when fades are active
      expect(container.style.maskImage).toContain('32px')
      expect(container.style.maskImage).toContain('calc(100% - 32px)')
    })

    it('should default to 20px fade size when fades are active', () => {
      function DefaultFadeSizeComponent() {
        const { containerRef, getContainerStyle } = useScrollFades()
        // Force fades to be visible by passing custom state
        const customState = { showTop: true, showBottom: true, showLeft: false, showRight: false }
        
        return (
          <div 
            ref={containerRef as any}
            data-testid="scrollable-container"
            style={{
              height: '200px',
              overflow: 'auto',
              ...getContainerStyle(customState)
            }}
          >
            <div style={{ height: '500px' }}>Long content</div>
          </div>
        )
      }
      
      render(<DefaultFadeSizeComponent />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Should contain default 20px fade size when fades are active
      expect(container.style.maskImage).toContain('20px')
      expect(container.style.maskImage).toContain('calc(100% - 20px)')
    })
  })

  describe('backward compatibility', () => {
    it('should warn when using deprecated getOverlayStyle', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      function LegacyComponent() {
        const { getOverlayStyle } = useScrollFades()
        const overlayStyle = getOverlayStyle('top')
        return <div data-testid="legacy" style={overlayStyle}>Legacy</div>
      }
      
      render(<LegacyComponent />)
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('getOverlayStyle is deprecated')
      )
      
      consoleSpy.mockRestore()
    })

    it('should return empty styles from deprecated getOverlayStyle', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      function LegacyComponent() {
        const { getOverlayStyle } = useScrollFades()
        const overlayStyle = getOverlayStyle('top')
        return <div data-testid="legacy" style={overlayStyle}>Legacy</div>
      }
      
      render(<LegacyComponent />)
      
      const legacy = screen.getByTestId('legacy')
      // Should have no meaningful styles applied
      expect(Object.keys(legacy.style)).toHaveLength(0)
      
      consoleSpy.mockRestore()
    })
  })
})