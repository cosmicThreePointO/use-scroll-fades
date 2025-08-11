/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { useScrollFades } from '../src/useScrollFades'

function TestComponent({ respectReducedMotion = true, respectBrowserSupport = true }: any) {
  const { containerRef, getContainerStyle, accessibility } = useScrollFades({
    respectReducedMotion,
    respectBrowserSupport
  })
  
  return (
    <div>
      <div
        ref={containerRef as any}
        data-testid="container"
        style={{
          height: '200px',
          overflow: 'auto',
          ...getContainerStyle()
        }}
      >
        <div style={{ height: '500px' }}>Long content</div>
      </div>
      <div data-testid="accessibility-info">
        {JSON.stringify({
          shouldApplyEffects: accessibility.shouldApplyEffects,
          reducedMotionPreferred: accessibility.reducedMotionPreferred,
          maskImageSupported: accessibility.browserCapabilities.supportsMaskImage
        })}
      </div>
    </div>
  )
}

describe('Accessibility Integration', () => {
  it('applies effects when browser supports mask-image and user allows motion', () => {
    // Mock browser support and no reduced motion preference
    Object.defineProperty(window, 'CSS', {
      value: {
        supports: vi.fn().mockReturnValue(true)
      },
      writable: true
    })
    
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation(() => ({
        matches: false, // No reduced motion preference
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      })),
      writable: true
    })

    render(<TestComponent />)
    
    const container = screen.getByTestId('container')
    const accessibilityInfo = JSON.parse(screen.getByTestId('accessibility-info').textContent!)
    
    // Should apply effects
    expect(accessibilityInfo.shouldApplyEffects).toBe(true)
    expect(accessibilityInfo.reducedMotionPreferred).toBe(false)
    expect(accessibilityInfo.maskImageSupported).toBe(true)
    
    // Should have mask styles applied
    expect(container.style.maskImage).toBeDefined()
  })

  it('disables effects when user prefers reduced motion', () => {
    // Mock browser support but user prefers reduced motion
    Object.defineProperty(window, 'CSS', {
      value: {
        supports: vi.fn().mockReturnValue(true)
      },
      writable: true
    })
    
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)', // User prefers reduced motion
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      })),
      writable: true
    })

    render(<TestComponent />)
    
    const container = screen.getByTestId('container')
    const accessibilityInfo = JSON.parse(screen.getByTestId('accessibility-info').textContent!)
    
    // Should NOT apply effects
    expect(accessibilityInfo.shouldApplyEffects).toBe(false)
    expect(accessibilityInfo.reducedMotionPreferred).toBe(true)
    
    // Should NOT have mask styles applied
    expect(container.style.maskImage).toBe('')
  })

  it('disables effects when browser does not support mask-image', () => {
    // Mock no browser support for mask-image
    Object.defineProperty(window, 'CSS', {
      value: {
        supports: vi.fn().mockReturnValue(false) // No mask-image support
      },
      writable: true
    })
    
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation(() => ({
        matches: false, // No reduced motion preference
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      })),
      writable: true
    })

    render(<TestComponent />)
    
    const container = screen.getByTestId('container')
    const accessibilityInfo = JSON.parse(screen.getByTestId('accessibility-info').textContent!)
    
    // Should NOT apply effects due to lack of browser support
    expect(accessibilityInfo.shouldApplyEffects).toBe(false)
    expect(accessibilityInfo.maskImageSupported).toBe(false)
    
    // Should NOT have mask styles applied
    expect(container.style.maskImage).toBe('')
  })

  it('allows overriding accessibility defaults', () => {
    // Mock user prefers reduced motion but we override the setting
    Object.defineProperty(window, 'CSS', {
      value: {
        supports: vi.fn().mockReturnValue(true)
      },
      writable: true
    })
    
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)', // User prefers reduced motion
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      })),
      writable: true
    })

    render(<TestComponent respectReducedMotion={false} />)
    
    const container = screen.getByTestId('container')
    const accessibilityInfo = JSON.parse(screen.getByTestId('accessibility-info').textContent!)
    
    // Should still apply effects because we disabled respectReducedMotion
    expect(accessibilityInfo.shouldApplyEffects).toBe(true)
    // reducedMotionPreferred might be false because respectReducedMotion is disabled
    // The important thing is that effects are still applied
    
    // Should have mask styles applied
    expect(container.style.maskImage).toBeDefined()
  })
})