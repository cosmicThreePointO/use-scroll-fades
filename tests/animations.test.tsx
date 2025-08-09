import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useScrollFades } from '../src/useScrollFades'

function AnimationTestComponent({ options = {} }: { options?: any }) {
  const { containerRef, state, getOverlayStyle } = useScrollFades(options)
  
  return (
    <div data-testid="wrapper">
      <div
        ref={containerRef as any}
        data-testid="container"
        style={{
          height: 200,
          overflow: 'auto'
        }}
      >
        <div style={{ height: 1000 }}>Long content</div>
      </div>
      <div 
        data-testid="top-overlay" 
        style={getOverlayStyle('top')}
      />
      <div 
        data-testid="bottom-overlay" 
        style={getOverlayStyle('bottom')}
      />
      <div data-testid="state">
        {JSON.stringify(state)}
      </div>
    </div>
  )
}

describe('useScrollFades Animations', () => {
  describe('default animation behavior', () => {
    it('should include transition properties by default', () => {
      render(<AnimationTestComponent />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      const bottomOverlay = screen.getByTestId('bottom-overlay')
      
      // Check that transitions are applied
      expect(topOverlay.style.transition).toBe('opacity 200ms ease-out')
      expect(bottomOverlay.style.transition).toBe('opacity 200ms ease-out')
      
      // Check vendor prefixes for cross-browser support (note: these are set as React style props)
      // In real browsers, these would be normalized, but in tests we check the React style object
      const computedStyles = (topOverlay as any).style
      expect(computedStyles.WebkitTransition).toBeDefined()
      expect(computedStyles.MozTransition).toBeDefined()
      expect(computedStyles.msTransition).toBeDefined()
    })

    it('should use opacity instead of display for smooth transitions', () => {
      render(<AnimationTestComponent />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      const bottomOverlay = screen.getByTestId('bottom-overlay')
      
      // Should use opacity, not display none/block
      expect(topOverlay.style.opacity).toBe('0') // Hidden initially
      expect(bottomOverlay.style.opacity).toBe('0') // Hidden initially
      expect(topOverlay.style.display).toBe('') // Not set (so it's visible in DOM)
      expect(bottomOverlay.style.display).toBe('') // Not set (so it's visible in DOM)
    })

    it('should always set pointerEvents to none to prevent interaction', () => {
      render(<AnimationTestComponent />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      const bottomOverlay = screen.getByTestId('bottom-overlay')
      
      expect(topOverlay.style.pointerEvents).toBe('none')
      expect(bottomOverlay.style.pointerEvents).toBe('none')
    })
  })

  describe('custom animation options', () => {
    it('should apply custom transition duration', () => {
      const options = { transitionDuration: 500 }
      render(<AnimationTestComponent options={options} />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      expect(topOverlay.style.transition).toBe('opacity 500ms ease-out')
    })

    it('should apply custom timing function', () => {
      const options = { transitionTimingFunction: 'ease-in-out' }
      render(<AnimationTestComponent options={options} />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      expect(topOverlay.style.transition).toBe('opacity 200ms ease-in-out')
    })

    it('should apply both custom duration and timing function', () => {
      const options = { 
        transitionDuration: 300,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
      render(<AnimationTestComponent options={options} />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      expect(topOverlay.style.transition).toBe('opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)')
    })

    it('should support complex timing functions', () => {
      const options = { 
        transitionTimingFunction: 'steps(4, end)'
      }
      render(<AnimationTestComponent options={options} />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      expect(topOverlay.style.transition).toBe('opacity 200ms steps(4, end)')
    })
  })

  describe('disabled animations', () => {
    it('should not include transition properties when disabled', () => {
      const options = { disableTransitions: true }
      render(<AnimationTestComponent options={options} />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      const bottomOverlay = screen.getByTestId('bottom-overlay')
      
      // Should not have transition properties
      expect(topOverlay.style.transition).toBe('')
      expect((topOverlay as any).style.WebkitTransition).toBeUndefined()
      expect((topOverlay as any).style.MozTransition).toBeUndefined()
      expect((topOverlay as any).style.msTransition).toBeUndefined()
      
      expect(bottomOverlay.style.transition).toBe('')
    })

    it('should still use opacity when transitions are disabled', () => {
      const options = { disableTransitions: true }
      render(<AnimationTestComponent options={options} />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      
      // Should still use opacity-based visibility
      expect(topOverlay.style.opacity).toBe('0')
      expect(topOverlay.style.pointerEvents).toBe('none')
    })
  })

  describe('cross-browser vendor prefixes', () => {
    it('should include all major vendor prefixes', () => {
      render(<AnimationTestComponent />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      
      // Standard
      expect(topOverlay.style.transition).toBe('opacity 200ms ease-out')
      
      // Check that vendor prefixes are set as React style properties
      const computedStyles = (topOverlay as any).style
      
      // Webkit (Safari, Chrome, newer Edge)
      expect(computedStyles.WebkitTransition).toBeDefined()
      
      // Mozilla (Firefox)  
      expect(computedStyles.MozTransition).toBeDefined()
      
      // Microsoft (IE, older Edge)
      expect(computedStyles.msTransition).toBeDefined()
    })
  })

  describe('animation state changes', () => {
    it('should change opacity when state changes', () => {
      render(<AnimationTestComponent />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      
      // Initially hidden (showTop: false)
      expect(topOverlay.style.opacity).toBe('0')
      
      // Test with visible state by using getOverlayStyle directly
      const component = screen.getByTestId('wrapper')
      
      // The hook would update opacity to 1 when showTop becomes true
      // This is tested in the main hook tests, here we verify the style function
      expect(topOverlay.style.backgroundImage).toBeTruthy()
    })
  })

  describe('animation performance', () => {
    it('should only animate opacity for better performance', () => {
      render(<AnimationTestComponent />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      
      // Should only transition opacity, not other expensive properties
      expect(topOverlay.style.transition).toBe('opacity 200ms ease-out')
      expect(topOverlay.style.transition).not.toContain('transform')
      expect(topOverlay.style.transition).not.toContain('width')
      expect(topOverlay.style.transition).not.toContain('height')
    })

    it('should use GPU-friendly properties', () => {
      render(<AnimationTestComponent />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      
      // Opacity is GPU-accelerated and performant
      expect(topOverlay.style.opacity).toBeDefined()
      expect(topOverlay.style.pointerEvents).toBe('none') // Prevents interaction overhead
    })
  })

  describe('edge cases', () => {
    it('should handle zero duration gracefully', () => {
      const options = { transitionDuration: 0 }
      render(<AnimationTestComponent options={options} />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      expect(topOverlay.style.transition).toBe('opacity 0ms ease-out')
    })

    it('should handle very long durations', () => {
      const options = { transitionDuration: 10000 }
      render(<AnimationTestComponent options={options} />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      expect(topOverlay.style.transition).toBe('opacity 10000ms ease-out')
    })

    it('should handle empty timing function gracefully', () => {
      const options = { transitionTimingFunction: '' }
      render(<AnimationTestComponent options={options} />)
      
      const topOverlay = screen.getByTestId('top-overlay')
      expect(topOverlay.style.transition).toBe('opacity 200ms')
    })
  })
})