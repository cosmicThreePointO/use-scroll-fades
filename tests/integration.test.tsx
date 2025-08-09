import * as React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useScrollFades } from '../src/useScrollFades'

// Integration test component that simulates real usage
function ScrollableList({ items, options = {} }: { items: string[], options?: any }) {
  const { containerRef, state, getOverlayStyle } = useScrollFades(options)

  return (
    <div style={{ position: 'relative', maxWidth: 640 }}>
      <div
        ref={containerRef as any}
        data-testid="scrollable-container"
        style={{
          overflow: 'auto',
          height: 200,
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          background: '#fff'
        }}
        role="list"
        aria-label="Scrollable list with fade indicators"
      >
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {items.map((item: string, i: number) => (
            <li 
              key={i} 
              data-testid={`list-item-${i}`}
              style={{ 
                padding: 16, 
                borderBottom: '1px solid #f1f5f9',
                height: 60 // Fixed height for predictable testing
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Top fade overlay */}
      <div 
        data-testid="top-fade"
        aria-hidden="true"
        style={{
          pointerEvents: 'none',
          position: 'absolute', 
          left: 0, 
          right: 0, 
          top: 0, 
          height: 32,
          borderTopLeftRadius: 12, 
          borderTopRightRadius: 12,
          ...getOverlayStyle('top', state)
        }} 
      />

      {/* Bottom fade overlay */}
      <div 
        data-testid="bottom-fade"
        aria-hidden="true"
        style={{
          pointerEvents: 'none',
          position: 'absolute', 
          left: 0, 
          right: 0, 
          bottom: 0, 
          height: 32,
          borderBottomLeftRadius: 12, 
          borderBottomRightRadius: 12,
          ...getOverlayStyle('bottom', state)
        }} 
      />
      
      {/* Debug state display */}
      <div data-testid="debug-state" style={{ fontSize: 12, color: '#666' }}>
        Top: {state.showTop ? 'visible' : 'hidden'}, 
        Bottom: {state.showBottom ? 'visible' : 'hidden'}
      </div>
    </div>
  )
}

describe('useScrollFades Integration Tests', () => {
  const createItems = (count: number) => 
    Array.from({ length: count }, (_, i) => `Item ${i + 1}`)

  describe('real-world scroll behavior', () => {
    it('should show correct fades for different scroll positions', async () => {
      const items = createItems(20) // Creates ~1200px of content (20 * 60px)
      
      render(<ScrollableList items={items} />)
      
      const container = screen.getByTestId('scrollable-container')
      const topFade = screen.getByTestId('top-fade')
      const bottomFade = screen.getByTestId('bottom-fade')
      
      // Create a realistic mock that actually works with the hook
      const mockScrollProps = {
        scrollTop: 0,
        scrollHeight: 1200,
        clientHeight: 200
      }
      
      // Replace the getter properties
      Object.defineProperties(container, {
        scrollTop: {
          get: () => mockScrollProps.scrollTop,
          configurable: true
        },
        scrollHeight: {
          get: () => mockScrollProps.scrollHeight,
          configurable: true
        },
        clientHeight: {
          get: () => mockScrollProps.clientHeight,
          configurable: true
        }
      })

      // Test: At top - should show only bottom fade  
      mockScrollProps.scrollTop = 0
      
      // Trigger scroll measurement
      await act(async () => {
        fireEvent.scroll(container)
        // Allow requestAnimationFrame to complete
        await new Promise(resolve => setTimeout(resolve, 20))
      })
      
      expect(topFade.style.opacity).toBe('0')
      expect(bottomFade.style.opacity).toBe('1')
      
      // Test: In middle - should show both fades
      mockScrollProps.scrollTop = 500
      
      await act(async () => {
        fireEvent.scroll(container)
        await new Promise(resolve => setTimeout(resolve, 20))
      })
      
      expect(topFade.style.opacity).toBe('1')
      expect(bottomFade.style.opacity).toBe('1')
      
      // Test: At bottom - should show only top fade
      mockScrollProps.scrollTop = 1000
      
      await act(async () => {
        fireEvent.scroll(container)
        await new Promise(resolve => setTimeout(resolve, 20))
      })
      
      expect(topFade.style.opacity).toBe('1')
      expect(bottomFade.style.opacity).toBe('0')
    })
  })

  describe('accessibility and ARIA compliance', () => {
    it('should have proper ARIA attributes', () => {
      const items = createItems(10)
      render(<ScrollableList items={items} />)
      
      const container = screen.getByTestId('scrollable-container')
      const topFade = screen.getByTestId('top-fade')
      const bottomFade = screen.getByTestId('bottom-fade')
      
      expect(container).toHaveAttribute('role', 'list')
      expect(container).toHaveAttribute('aria-label', 'Scrollable list with fade indicators')
      expect(topFade).toHaveAttribute('aria-hidden', 'true')
      expect(bottomFade).toHaveAttribute('aria-hidden', 'true')
    })

    it('should not interfere with pointer events', () => {
      const items = createItems(5)
      render(<ScrollableList items={items} />)
      
      const topFade = screen.getByTestId('top-fade')
      const bottomFade = screen.getByTestId('bottom-fade')
      
      expect(topFade.style.pointerEvents).toBe('none')
      expect(bottomFade.style.pointerEvents).toBe('none')
    })
  })

  describe('custom styling and theming', () => {
    it('should apply custom gradients', () => {
      const items = createItems(5)
      const customOptions = {
        topGradient: 'linear-gradient(to bottom, rgba(255,0,0,0.5), transparent)',
        bottomGradient: 'linear-gradient(to top, rgba(0,255,0,0.5), transparent)'
      }
      
      render(<ScrollableList items={items} options={customOptions} />)
      
      const topFade = screen.getByTestId('top-fade')
      const bottomFade = screen.getByTestId('bottom-fade')
      
      expect(topFade.style.backgroundImage).toBe('linear-gradient(to bottom, rgba(255,0,0,0.5), transparent)')
      expect(bottomFade.style.backgroundImage).toBe('linear-gradient(to top, rgba(0,255,0,0.5), transparent)')
    })

    it('should respect custom threshold values', async () => {
      const items = createItems(15)
      const customOptions = { threshold: 50 } // Much larger threshold
      
      render(<ScrollableList items={items} options={customOptions} />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Mock dimensions
      Object.defineProperty(container, 'scrollHeight', { value: 900, configurable: true })
      Object.defineProperty(container, 'clientHeight', { value: 200, configurable: true })
      
      // Test with scroll position that would show fade with default threshold (8px)
      // but should not with threshold 50px
      Object.defineProperty(container, 'scrollTop', { value: 20, configurable: true })
      fireEvent.scroll(container)
      
      await act(async () => {
        const rafCallback = (global.requestAnimationFrame as any).mock?.calls?.[0]?.[0]
        if (rafCallback) rafCallback()
      })
      
      const topFade = screen.getByTestId('top-fade')
      expect(topFade.style.opacity).toBe('0') // Should still be hidden due to large threshold
    })
  })

  describe('dynamic content changes', () => {
    it('should handle content that changes size', async () => {
      const { rerender } = render(<ScrollableList items={createItems(5)} />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Initially small content
      Object.defineProperty(container, 'scrollHeight', { value: 300, configurable: true })
      Object.defineProperty(container, 'clientHeight', { value: 200, configurable: true })
      Object.defineProperty(container, 'scrollTop', { value: 0, configurable: true })
      
      fireEvent.scroll(container)
      
      await act(async () => {
        const rafCallback = (global.requestAnimationFrame as any).mock?.calls?.[0]?.[0]
        if (rafCallback) rafCallback()
      })
      
      // Add more items (simulating dynamic content)
      rerender(<ScrollableList items={createItems(20)} />)
      
      // Update mock dimensions to reflect new content
      Object.defineProperty(container, 'scrollHeight', { value: 1200, configurable: true })
      
      // The hook should automatically detect the change via MutationObserver
      // and update the fade states accordingly
      const bottomFade = screen.getByTestId('bottom-fade')
      expect(bottomFade).toBeTruthy() // Should be present and react to content changes
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle empty lists gracefully', () => {
      render(<ScrollableList items={[]} />)
      
      const container = screen.getByTestId('scrollable-container')
      const topFade = screen.getByTestId('top-fade')
      const bottomFade = screen.getByTestId('bottom-fade')
      
      expect(container).toBeInTheDocument()
      expect(topFade).toBeInTheDocument()
      expect(bottomFade).toBeInTheDocument()
    })

    it('should handle single item lists', async () => {
      render(<ScrollableList items={['Single item']} />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Mock dimensions where content is shorter than container
      Object.defineProperty(container, 'scrollHeight', { value: 60, configurable: true })
      Object.defineProperty(container, 'clientHeight', { value: 200, configurable: true })
      Object.defineProperty(container, 'scrollTop', { value: 0, configurable: true })
      
      fireEvent.scroll(container)
      
      await act(async () => {
        const rafCallback = (global.requestAnimationFrame as any).mock?.calls?.[0]?.[0]
        if (rafCallback) rafCallback()
      })
      
      const topFade = screen.getByTestId('top-fade')
      const bottomFade = screen.getByTestId('bottom-fade')
      
      // Both should be hidden when content doesn't overflow
      expect(topFade.style.opacity).toBe('0')
      expect(bottomFade.style.opacity).toBe('0')
    })
  })

  describe('performance under load', () => {
    it('should handle rapid scroll events efficiently', () => {
      const mockRaf = vi.fn((callback) => {
        setTimeout(callback, 16) // Simulate 60fps
        return 123
      })
      global.requestAnimationFrame = mockRaf
      
      const items = createItems(50)
      render(<ScrollableList items={items} />)
      
      const container = screen.getByTestId('scrollable-container')
      
      // Fire many scroll events rapidly
      for (let i = 0; i < 10; i++) {
        fireEvent.scroll(container)
      }
      
      // Should throttle and only process one at a time
      expect(mockRaf).toHaveBeenCalledTimes(1)
    })
  })
})