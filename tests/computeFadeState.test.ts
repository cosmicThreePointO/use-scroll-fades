import { describe, expect, it } from 'vitest'
import { computeFadeState } from '../src/computeFadeState'

describe('computeFadeState', () => {
  describe('basic functionality', () => {
    it('should show no fades at the top of list', () => {
      const result = computeFadeState(0, 1000, 200, 8)
      expect(result).toEqual({ showTop: false, showBottom: true })
    })

    it('should show both fades in middle of list', () => {
      const result = computeFadeState(400, 1000, 200, 8)
      expect(result).toEqual({ showTop: true, showBottom: true })
    })

    it('should show only top fade at bottom of list', () => {
      const result = computeFadeState(800, 1000, 200, 8)
      expect(result).toEqual({ showTop: true, showBottom: false })
    })
  })

  describe('threshold behavior', () => {
    it('should respect custom threshold at top', () => {
      // With threshold 20, scrollTop 15 should still be considered "at top"
      const result = computeFadeState(15, 1000, 200, 20)
      expect(result.showTop).toBe(false)
      
      // But scrollTop 25 should show top fade
      const result2 = computeFadeState(25, 1000, 200, 20)
      expect(result2.showTop).toBe(true)
    })

    it('should respect custom threshold at bottom', () => {
      // scrollTop + clientHeight = 990, scrollHeight = 1000
      // With threshold 20: 990 >= 1000 - 20 (980), so at bottom
      const result = computeFadeState(790, 1000, 200, 20)
      expect(result.showBottom).toBe(false)
      
      // With threshold 20: 970 < 980, so not at bottom
      const result2 = computeFadeState(770, 1000, 200, 20)
      expect(result2.showBottom).toBe(true)
    })

    it('should use default threshold of 8 when not provided', () => {
      const result = computeFadeState(5, 1000, 200)
      expect(result.showTop).toBe(false)
      
      const result2 = computeFadeState(10, 1000, 200)
      expect(result2.showTop).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle content shorter than container', () => {
      // Content height (100) is less than container height (200)
      const result = computeFadeState(0, 100, 200, 8)
      expect(result).toEqual({ showTop: false, showBottom: false })
    })

    it('should handle exact scroll positions', () => {
      // Exactly at threshold
      const result = computeFadeState(8, 1000, 200, 8)
      expect(result.showTop).toBe(false)
      
      // Just past threshold
      const result2 = computeFadeState(9, 1000, 200, 8)
      expect(result2.showTop).toBe(true)
    })

    it('should handle zero dimensions', () => {
      const result = computeFadeState(0, 0, 0, 8)
      expect(result).toEqual({ showTop: false, showBottom: false })
    })

    it('should handle large threshold values', () => {
      // Threshold larger than scroll area
      const result = computeFadeState(50, 200, 100, 200)
      expect(result).toEqual({ showTop: false, showBottom: false })
    })
  })

  describe('mathematical precision', () => {
    it('should handle floating point scroll values', () => {
      const result = computeFadeState(7.5, 1000, 200, 8)
      expect(result.showTop).toBe(false)
      
      const result2 = computeFadeState(8.5, 1000, 200, 8)
      expect(result2.showTop).toBe(true)
    })

    it('should be consistent with boundary calculations', () => {
      const scrollHeight = 1000
      const clientHeight = 200
      const threshold = 8
      const scrollTop = scrollHeight - clientHeight - threshold // Should be exactly at bottom threshold
      
      const result = computeFadeState(scrollTop, scrollHeight, clientHeight, threshold)
      expect(result.showBottom).toBe(false)
      
      const result2 = computeFadeState(scrollTop - 1, scrollHeight, clientHeight, threshold)
      expect(result2.showBottom).toBe(true)
    })
  })
})