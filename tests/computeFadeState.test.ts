import { describe, expect, it } from 'vitest'
import { computeFadeState } from '../src/computeFadeState'

describe('computeFadeState', () => {
  describe('vertical scroll functionality', () => {
    it('should show no top fade at the top of list', () => {
      const result = computeFadeState(0, 1000, 200, 0, 300, 300, 8)
      expect(result).toEqual({ showTop: false, showBottom: true, showLeft: false, showRight: false })
    })

    it('should show both vertical fades in middle of list', () => {
      const result = computeFadeState(400, 1000, 200, 0, 300, 300, 8)
      expect(result).toEqual({ showTop: true, showBottom: true, showLeft: false, showRight: false })
    })

    it('should show only top fade at bottom of list', () => {
      const result = computeFadeState(800, 1000, 200, 0, 300, 300, 8)
      expect(result).toEqual({ showTop: true, showBottom: false, showLeft: false, showRight: false })
    })
  })

  describe('horizontal scroll functionality', () => {
    it('should show no left fade at the left edge', () => {
      const result = computeFadeState(0, 200, 200, 0, 1000, 300, 8)
      expect(result).toEqual({ showTop: false, showBottom: false, showLeft: false, showRight: true })
    })

    it('should show both horizontal fades in middle of content', () => {
      const result = computeFadeState(0, 200, 200, 400, 1000, 300, 8)
      expect(result).toEqual({ showTop: false, showBottom: false, showLeft: true, showRight: true })
    })

    it('should show only left fade at right edge', () => {
      const result = computeFadeState(0, 200, 200, 700, 1000, 300, 8)
      expect(result).toEqual({ showTop: false, showBottom: false, showLeft: true, showRight: false })
    })
  })

  describe('combined vertical and horizontal scrolling', () => {
    it('should handle both directions simultaneously', () => {
      const result = computeFadeState(400, 1000, 200, 400, 1000, 300, 8)
      expect(result).toEqual({ showTop: true, showBottom: true, showLeft: true, showRight: true })
    })

    it('should handle mixed positions correctly', () => {
      const result = computeFadeState(0, 1000, 200, 700, 1000, 300, 8)
      expect(result).toEqual({ showTop: false, showBottom: true, showLeft: true, showRight: false })
    })
  })

  describe('threshold behavior', () => {
    it('should respect custom threshold for vertical scroll', () => {
      // With threshold 20, scrollTop 15 should still be considered "at top"
      const result = computeFadeState(15, 1000, 200, 0, 300, 300, 20)
      expect(result.showTop).toBe(false)
      
      // But scrollTop 25 should show top fade
      const result2 = computeFadeState(25, 1000, 200, 0, 300, 300, 20)
      expect(result2.showTop).toBe(true)
    })

    it('should respect custom threshold for horizontal scroll', () => {
      // With threshold 20, scrollLeft 15 should still be considered "at left"
      const result = computeFadeState(0, 200, 200, 15, 1000, 300, 20)
      expect(result.showLeft).toBe(false)
      
      // But scrollLeft 25 should show left fade
      const result2 = computeFadeState(0, 200, 200, 25, 1000, 300, 20)
      expect(result2.showLeft).toBe(true)
    })

    it('should use default threshold of 8 when not provided', () => {
      const result = computeFadeState(5, 1000, 200, 0, 300, 300)
      expect(result.showTop).toBe(false)
      
      const result2 = computeFadeState(10, 1000, 200, 0, 300, 300)
      expect(result2.showTop).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle content shorter than container', () => {
      // Content height (100) is less than container height (200)
      const result = computeFadeState(0, 100, 200, 0, 100, 200, 8)
      expect(result).toEqual({ showTop: false, showBottom: false, showLeft: false, showRight: false })
    })

    it('should handle exact scroll positions', () => {
      // Exactly at threshold
      const result = computeFadeState(8, 1000, 200, 0, 300, 300, 8)
      expect(result.showTop).toBe(false)
      
      // Just past threshold
      const result2 = computeFadeState(9, 1000, 200, 0, 300, 300, 8)
      expect(result2.showTop).toBe(true)
    })

    it('should handle zero dimensions', () => {
      const result = computeFadeState(0, 0, 0, 0, 0, 0, 8)
      expect(result).toEqual({ showTop: false, showBottom: false, showLeft: false, showRight: false })
    })

    it('should handle large threshold values', () => {
      // Threshold larger than scroll area
      const result = computeFadeState(50, 200, 100, 50, 200, 100, 200)
      expect(result).toEqual({ showTop: false, showBottom: false, showLeft: false, showRight: false })
    })
  })

  describe('mathematical precision', () => {
    it('should handle floating point scroll values', () => {
      const result = computeFadeState(7.5, 1000, 200, 0, 300, 300, 8)
      expect(result.showTop).toBe(false)
      
      const result2 = computeFadeState(8.5, 1000, 200, 0, 300, 300, 8)
      expect(result2.showTop).toBe(true)
    })

    it('should be consistent with boundary calculations', () => {
      const scrollHeight = 1000
      const clientHeight = 200
      const scrollWidth = 800
      const clientWidth = 300
      const threshold = 8
      const scrollTop = scrollHeight - clientHeight - threshold // Should be exactly at bottom threshold
      const scrollLeft = scrollWidth - clientWidth - threshold // Should be exactly at right threshold
      
      const result = computeFadeState(scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth, threshold)
      expect(result.showBottom).toBe(false)
      expect(result.showRight).toBe(false)
      
      const result2 = computeFadeState(scrollTop - 1, scrollHeight, clientHeight, scrollLeft - 1, scrollWidth, clientWidth, threshold)
      expect(result2.showBottom).toBe(true)
      expect(result2.showRight).toBe(true)
    })
  })
})