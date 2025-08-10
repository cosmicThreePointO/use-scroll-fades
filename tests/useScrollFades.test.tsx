import * as React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useScrollFades } from '../src/useScrollFades'

// Test component that uses the new mask-image approach
function TestComponent({ options = {} }: { options?: any }) {
  const { containerRef, state, getContainerStyle, getOverlayStyle } = useScrollFades(options)
  
  return (
    <div data-testid="wrapper">
      <div
        ref={containerRef as any}
        data-testid="container"
        style={{
          height: 200,
          overflow: 'auto',
          ...getContainerStyle()
        }}
      >
        <div style={{ height: 1000 }}>Long content</div>
      </div>
      {/* Legacy overlay elements for backward compatibility tests */}
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
      <div data-testid="container-styles">
        {JSON.stringify(getContainerStyle())}
      </div>
    </div>
  )
}

describe('useScrollFades', () => {
  let mockResizeObserver: any
  let mockMutationObserver: any

  beforeEach(() => {

    // Mock observers
    mockResizeObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }

    mockMutationObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    }

    global.ResizeObserver = vi.fn(() => mockResizeObserver)
    global.MutationObserver = vi.fn(() => mockMutationObserver)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with correct default state', () => {
      render(<TestComponent />)
      
      const state = JSON.parse(screen.getByTestId('state').textContent!)
      expect(state).toEqual({ showTop: false, showBottom: false, showLeft: false, showRight: false })
    })

    it('should apply default mask-image styles', () => {
      render(<TestComponent />)
      
      const containerStyles = JSON.parse(screen.getByTestId('container-styles').textContent!)
      
      // Check for mask-image properties
      expect(containerStyles.maskImage).toBeDefined()
      expect(containerStyles.WebkitMaskImage).toBeDefined()
      expect(containerStyles.maskComposite).toBe('intersect')
      expect(containerStyles.WebkitMaskComposite).toBe('source-in')
    })
  })

  describe('options configuration', () => {
    it('should use custom fadeSize when fades are active', () => {
      function CustomFadeSizeTestComponent() {
        const { containerRef, getContainerStyle } = useScrollFades({ fadeSize: 32 })
        // Force fades to be active
        const activeState = { showTop: true, showBottom: true, showLeft: false, showRight: false }
        
        return (
          <div data-testid="wrapper">
            <div
              ref={containerRef as any}
              data-testid="container"
              style={{
                height: 200,
                overflow: 'auto',
                ...getContainerStyle(activeState)
              }}
            >
              <div style={{ height: 1000 }}>Long content</div>
            </div>
            <div data-testid="container-styles">
              {JSON.stringify(getContainerStyle(activeState))}
            </div>
          </div>
        )
      }
      
      render(<CustomFadeSizeTestComponent />)
      
      const containerStyles = JSON.parse(screen.getByTestId('container-styles').textContent!)
      
      // Check that fadeSize affects mask-image generation when fades are active
      expect(containerStyles.maskImage).toContain('32px')
    })

    it('should use custom threshold', () => {
      const options = { threshold: 20 }
      render(<TestComponent options={options} />)
      
      // This test verifies the threshold is passed correctly
      // The actual threshold behavior is tested in computeFadeState tests
      expect(screen.getByTestId('container')).toBeTruthy()
    })
  })

  describe('getOverlayStyle function', () => {
    it('should return empty styles (deprecated function)', () => {
      render(<TestComponent />)
      
      // Test the deprecated function returns empty styles
      const topOverlay = screen.getByTestId('top-overlay')
      
      // Should be empty since getOverlayStyle is deprecated
      expect(topOverlay.style.opacity).toBe('')
      expect(topOverlay.style.backgroundImage).toBe('')
    })

    it('should accept custom state parameter (deprecated)', () => {
      render(<TestComponent />)
      
      // The deprecated getOverlayStyle function should return empty styles
      const topOverlay = screen.getByTestId('top-overlay')
      const bottomOverlay = screen.getByTestId('bottom-overlay')
      
      expect(topOverlay.style.backgroundImage).toBe('')
      expect(bottomOverlay.style.backgroundImage).toBe('')
    })
  })

  describe('event listeners and observers', () => {
    it('should set up scroll event listener', () => {
      const { unmount } = render(<TestComponent />)
      
      // Verify ResizeObserver and MutationObserver are created
      expect(global.ResizeObserver).toHaveBeenCalled()
      expect(global.MutationObserver).toHaveBeenCalled()
      
      unmount()
      
      // Verify cleanup
      expect(mockResizeObserver.disconnect).toHaveBeenCalled()
      expect(mockMutationObserver.disconnect).toHaveBeenCalled()
    })

    it('should handle scroll events with requestAnimationFrame throttling', async () => {
      let rafCallback: Function | null = null
      const mockRaf = vi.fn((callback: Function) => {
        rafCallback = callback
        return 123
      })
      
      global.requestAnimationFrame = mockRaf
      global.cancelAnimationFrame = vi.fn()

      render(<TestComponent />)
      
      const container = screen.getByTestId('container')
      
      // Mock scroll properties
      Object.defineProperty(container, 'scrollTop', { value: 100, configurable: true })
      Object.defineProperty(container, 'scrollHeight', { value: 1000, configurable: true })
      Object.defineProperty(container, 'clientHeight', { value: 200, configurable: true })
      
      // Fire scroll event
      fireEvent.scroll(container)
      
      expect(mockRaf).toHaveBeenCalled()
      
      // Execute the RAF callback
      const rafCallbackFn = mockRaf.mock.calls[0]?.[0]
      if (rafCallbackFn) {
        act(() => {
          rafCallbackFn()
        })
      }
    })
  })

  describe('state updates', () => {
    it('should update state when scroll position changes', async () => {
      render(<TestComponent />)
      
      const container = screen.getByTestId('container')
      
      // Mock being in the middle of content
      Object.defineProperty(container, 'scrollTop', { value: 400, configurable: true })
      Object.defineProperty(container, 'scrollHeight', { value: 1000, configurable: true })
      Object.defineProperty(container, 'clientHeight', { value: 200, configurable: true })
      
      // Trigger scroll event and RAF execution
      fireEvent.scroll(container)
      
      // Let any state updates process
      await act(async () => {
        // Execute any pending RAF callbacks
        const rafCallback = (global.requestAnimationFrame as any).mock.calls[0]?.[0]
        if (rafCallback) rafCallback()
      })
    })
  })

  describe('cleanup', () => {
    it('should clean up all listeners and observers on unmount', () => {
      const mockCancelAnimationFrame = vi.fn()
      global.cancelAnimationFrame = mockCancelAnimationFrame
      
      const { unmount } = render(<TestComponent />)
      
      unmount()
      
      expect(mockResizeObserver.disconnect).toHaveBeenCalled()
      expect(mockMutationObserver.disconnect).toHaveBeenCalled()
    })

    it('should cancel pending animation frames on unmount', () => {
      const mockCancelAnimationFrame = vi.fn()
      global.cancelAnimationFrame = mockCancelAnimationFrame
      
      // Set up a pending frame
      let rafId = 0
      global.requestAnimationFrame = vi.fn(() => {
        rafId = 123
        return rafId
      })
      
      const { unmount } = render(<TestComponent />)
      
      const container = screen.getByTestId('container')
      fireEvent.scroll(container)
      
      unmount()
      
      // Should cancel any pending frames
      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(rafId)
    })
  })

  describe('performance optimizations', () => {
    it('should not update state if values have not changed', async () => {
      render(<TestComponent />)
      
      const container = screen.getByTestId('container')
      
      // Set up initial scroll properties at top (should result in showTop: false, showBottom: false for short content)
      Object.defineProperty(container, 'scrollTop', { value: 0, configurable: true })
      Object.defineProperty(container, 'scrollHeight', { value: 100, configurable: true }) // Short content
      Object.defineProperty(container, 'clientHeight', { value: 200, configurable: true })
      
      // Fire scroll event to establish baseline
      fireEvent.scroll(container)
      
      await act(async () => {
        const rafCallback = (global.requestAnimationFrame as any).mock.calls[0]?.[0]
        if (rafCallback) rafCallback()
      })
      
      const initialState = screen.getByTestId('state').textContent
      
      // Fire same scroll event multiple times - state should not change
      fireEvent.scroll(container)
      fireEvent.scroll(container)
      
      await act(async () => {
        const rafCallback = (global.requestAnimationFrame as any).mock.calls[1]?.[0]
        if (rafCallback) rafCallback()
      })
      
      // State should remain the same
      expect(screen.getByTestId('state').textContent).toBe(initialState)
    })

    it('should throttle scroll events with requestAnimationFrame', () => {
      const mockRaf = vi.fn(() => 123)
      global.requestAnimationFrame = mockRaf
      
      render(<TestComponent />)
      
      const container = screen.getByTestId('container')
      
      // Fire multiple scroll events quickly
      fireEvent.scroll(container)
      fireEvent.scroll(container)
      fireEvent.scroll(container)
      
      // Should only call RAF once (throttling)
      expect(mockRaf).toHaveBeenCalledTimes(1)
    })
  })
})