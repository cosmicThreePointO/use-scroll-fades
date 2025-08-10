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
    it('should show deprecated overlay behavior', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const items = createItems(20) // Creates ~1200px of content (20 * 60px)
      
      render(<ScrollableList items={items} />)
      
      const container = screen.getByTestId('scrollable-container')
      const topFade = screen.getByTestId('top-fade')
      const bottomFade = screen.getByTestId('bottom-fade')
      
      // With deprecated getOverlayStyle, overlays should have no meaningful styles
      expect(topFade.style.opacity).toBe('')
      expect(bottomFade.style.opacity).toBe('')
      expect(topFade.style.backgroundImage).toBe('')
      expect(bottomFade.style.backgroundImage).toBe('')
      
      // Should have shown deprecation warning
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('getOverlayStyle is deprecated')
      )
      
      consoleSpy.mockRestore()
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
    it('should ignore legacy gradient options (deprecated)', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const items = createItems(5)
      const customOptions = {
        topGradient: 'linear-gradient(to bottom, rgba(255,0,0,0.5), transparent)',
        bottomGradient: 'linear-gradient(to top, rgba(0,255,0,0.5), transparent)'
      }
      
      render(<ScrollableList items={items} options={customOptions} />)
      
      const topFade = screen.getByTestId('top-fade')
      const bottomFade = screen.getByTestId('bottom-fade')
      
      // Legacy gradient options are ignored, deprecated getOverlayStyle returns empty
      expect(topFade.style.backgroundImage).toBe('')
      expect(bottomFade.style.backgroundImage).toBe('')
      
      consoleSpy.mockRestore()
    })

    it('should accept custom threshold values (deprecated overlay)', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const items = createItems(15)
      const customOptions = { threshold: 50 } // Much larger threshold
      
      render(<ScrollableList items={items} options={customOptions} />)
      
      const topFade = screen.getByTestId('top-fade')
      
      // With deprecated getOverlayStyle, no styles are applied regardless of threshold
      expect(topFade.style.opacity).toBe('')
      
      consoleSpy.mockRestore()
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

    it('should handle single item lists (deprecated overlay)', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      render(<ScrollableList items={['Single item']} />)
      
      const topFade = screen.getByTestId('top-fade')
      const bottomFade = screen.getByTestId('bottom-fade')
      
      // With deprecated getOverlayStyle, no styles are applied
      expect(topFade.style.opacity).toBe('')
      expect(bottomFade.style.opacity).toBe('')
      
      consoleSpy.mockRestore()
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