import { FadeState } from './types'

/**
 * Computes whether fade overlays should be visible based on scroll position.
 * 
 * Determines if the top and bottom fade overlays should be shown by comparing
 * the current scroll position against the threshold distance from the edges.
 * The top fade appears when scrolled away from the top, and the bottom fade
 * appears when there's more content below.
 * 
 * @example
 * ```ts
 * // Element scrolled 50px from top, with 1000px total height and 300px visible
 * const state = computeFadeState(50, 1000, 300, 8)
 * // Returns { showTop: true, showBottom: true }
 * 
 * // Element at the very top
 * const state = computeFadeState(0, 1000, 300, 8)
 * // Returns { showTop: false, showBottom: true }
 * 
 * // Element scrolled to bottom
 * const state = computeFadeState(700, 1000, 300, 8)
 * // Returns { showTop: true, showBottom: false }
 * ```
 * 
 * @param scrollTop - Current vertical scroll position in pixels
 * @param scrollHeight - Total scrollable height of the content in pixels
 * @param clientHeight - Visible height of the scrollable area in pixels
 * @param threshold - Distance in pixels from edge before fades appear/disappear (default: 8)
 * @returns Object indicating which fade overlays should be visible
 */
export const computeFadeState = (
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
  threshold = 8
): FadeState => {
  const atTop = scrollTop <= threshold
  const atBottom = scrollTop + clientHeight >= scrollHeight - threshold
  
  return { 
    showTop: !atTop, 
    showBottom: !atBottom 
  }
}