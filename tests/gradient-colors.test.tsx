import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useScrollFades } from '../src/useScrollFades'
import type { GradientColors } from '../src/types'

// Mock CSS.supports for consistent testing
Object.defineProperty(window, 'CSS', {
  value: {
    supports: () => true
  }
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} })
})

// Test component that uses the hook with gradient colors
function TestComponent({ 
  fadeColor, 
  topColors, 
  bottomColors, 
  leftColors, 
  rightColors 
}: {
  fadeColor?: string
  topColors?: GradientColors
  bottomColors?: GradientColors
  leftColors?: GradientColors
  rightColors?: GradientColors
}) {
  const { 
    containerRef, 
    getGradientProperties, 
    getColoredFadeClass,
    state 
  } = useScrollFades({
    fadeColor,
    topColors,
    bottomColors,
    leftColors,
    rightColors
  })

  // Force some fade states for testing
  const testState = {
    showTop: true,
    showBottom: true,
    showLeft: false,
    showRight: false
  }

  const gradientProps = getGradientProperties(testState)
  const className = getColoredFadeClass()

  return (
    <div
      ref={containerRef}
      data-testid="container"
      className={className}
      style={gradientProps}
    >
      <div>Content</div>
    </div>
  )
}

describe('Gradient Colors API', () => {
  beforeEach(() => {
    // Reset any console warnings
    console.warn = () => {}
  })

  it('should apply fadeColor to all directions', () => {
    render(<TestComponent fadeColor="rgba(255, 0, 0, 0.3)" />)
    
    const container = screen.getByTestId('container')
    const styles = window.getComputedStyle(container)
    
    // Should have the colored fade class
    expect(container.className).toContain('scroll-fades-colored')
    
    // Should have gradient properties with red color
    expect(container.style.getPropertyValue('--fade-top-gradient')).toContain('rgba(255, 0, 0, 0.3)')
    expect(container.style.getPropertyValue('--fade-bottom-gradient')).toContain('rgba(255, 0, 0, 0.3)')
  })

  it('should apply individual gradient colors', () => {
    const topColors: GradientColors = { from: 'rgba(255, 0, 0, 0.5)', to: 'transparent' }
    const bottomColors: GradientColors = { from: 'rgba(0, 255, 0, 0.5)', to: 'transparent' }
    
    render(
      <TestComponent 
        topColors={topColors}
        bottomColors={bottomColors}
      />
    )
    
    const container = screen.getByTestId('container')
    
    // Should have different colors for top and bottom
    expect(container.style.getPropertyValue('--fade-top-gradient')).toContain('rgba(255, 0, 0, 0.5)')
    expect(container.style.getPropertyValue('--fade-bottom-gradient')).toContain('rgba(0, 255, 0, 0.5)')
  })

  it('should prioritize fadeColor over individual colors', () => {
    const topColors: GradientColors = { from: 'rgba(0, 0, 255, 0.5)', to: 'transparent' }
    
    render(
      <TestComponent 
        fadeColor="rgba(255, 0, 0, 0.3)"
        topColors={topColors}
      />
    )
    
    const container = screen.getByTestId('container')
    
    // Should use fadeColor instead of topColors
    expect(container.style.getPropertyValue('--fade-top-gradient')).toContain('rgba(255, 0, 0, 0.3)')
    expect(container.style.getPropertyValue('--fade-top-gradient')).not.toContain('rgba(0, 0, 255, 0.5)')
  })

  it('should only generate gradients for visible fades', () => {
    render(<TestComponent fadeColor="rgba(255, 0, 0, 0.3)" />)
    
    const container = screen.getByTestId('container')
    
    // Should have gradients for visible fades (top, bottom)
    expect(container.style.getPropertyValue('--fade-top-gradient')).toBeTruthy()
    expect(container.style.getPropertyValue('--fade-bottom-gradient')).toBeTruthy()
    
    // Should not have gradients for invisible fades (left, right)
    expect(container.style.getPropertyValue('--fade-left-gradient')).toBeFalsy()
    expect(container.style.getPropertyValue('--fade-right-gradient')).toBeFalsy()
  })

  it('should use default colors when no custom colors provided', () => {
    render(<TestComponent />)
    
    const container = screen.getByTestId('container')
    
    // Should have default gradient colors (rgba(0,0,0,0.15))
    expect(container.style.getPropertyValue('--fade-top-gradient')).toContain('rgba(0,0,0,0.15)')
    expect(container.style.getPropertyValue('--fade-bottom-gradient')).toContain('rgba(0,0,0,0.15)')
  })

  it('should return correct CSS class name', () => {
    render(<TestComponent />)
    
    const container = screen.getByTestId('container')
    expect(container.className).toBe('scroll-fades-colored')
  })

  it('should handle custom gradient directions correctly', () => {
    const topColors: GradientColors = { from: 'red', to: 'blue' }
    const rightColors: GradientColors = { from: 'green', to: 'yellow' }
    
    // Test component with right fade visible
    function TestRightFade() {
      const { containerRef, getGradientProperties, getColoredFadeClass } = useScrollFades({
        topColors,
        rightColors
      })

      const testState = { showTop: true, showBottom: false, showLeft: false, showRight: true }
      const gradientProps = getGradientProperties(testState)
      const className = getColoredFadeClass()

      return (
        <div
          ref={containerRef}
          data-testid="container"
          className={className}
          style={gradientProps}
        >
          Content
        </div>
      )
    }

    render(<TestRightFade />)
    
    const container = screen.getByTestId('container')
    
    // Should have correct gradient directions
    expect(container.style.getPropertyValue('--fade-top-gradient')).toContain('to bottom')
    expect(container.style.getPropertyValue('--fade-right-gradient')).toContain('to left')
  })

  it('should not generate gradients when effects are disabled', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} })
    })

    function TestDisabledEffects() {
      const { containerRef, getGradientProperties, getColoredFadeClass } = useScrollFades({
        fadeColor: 'red',
        respectReducedMotion: true
      })

      const testState = { showTop: true, showBottom: true, showLeft: false, showRight: false }
      const gradientProps = getGradientProperties(testState)
      const className = getColoredFadeClass()

      return (
        <div
          ref={containerRef}
          data-testid="container"
          className={className}
          style={gradientProps}
        >
          Content
        </div>
      )
    }

    render(<TestDisabledEffects />)
    
    const container = screen.getByTestId('container')
    
    // Should not have gradient properties when effects are disabled
    expect(Object.keys(container.style).length).toBe(0)
    
    // Reset matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} })
    })
  })
})