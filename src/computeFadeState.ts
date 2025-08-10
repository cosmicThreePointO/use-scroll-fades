import { FadeState } from './types'

/**
 * Computes whether fade overlays should be visible based on scroll position.
 * 
 * Determines if fade overlays should be shown by comparing the current scroll position
 * against the threshold distance from the edges. Supports both vertical and horizontal scrolling.
 * 
 * @example
 * ```ts
 * // Vertical scroll: Element scrolled 50px from top, with 1000px total height and 300px visible
 * const state = computeFadeState(50, 1000, 300, 0, 500, 300, 8)
 * // Returns { showTop: true, showBottom: true, showLeft: false, showRight: true }
 * 
 * // Horizontal scroll: Element scrolled 100px from left, with 800px total width and 400px visible
 * const state = computeFadeState(0, 200, 200, 100, 800, 400, 8)
 * // Returns { showTop: false, showBottom: false, showLeft: true, showRight: true }
 * ```
 * 
 * @param scrollTop - Current vertical scroll position in pixels
 * @param scrollHeight - Total scrollable height of the content in pixels  
 * @param clientHeight - Visible height of the scrollable area in pixels
 * @param scrollLeft - Current horizontal scroll position in pixels
 * @param scrollWidth - Total scrollable width of the content in pixels
 * @param clientWidth - Visible width of the scrollable area in pixels
 * @param threshold - Distance in pixels from edge before fades appear/disappear (default: 8)
 * @returns Object indicating which fade overlays should be visible
 */
export const computeFadeState = (
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  threshold = 8
): FadeState => {
  // Vertical scroll calculations
  const atTop = scrollTop <= threshold
  const atBottom = scrollTop + clientHeight >= scrollHeight - threshold
  
  // Horizontal scroll calculations  
  const atLeft = scrollLeft <= threshold
  const atRight = scrollLeft + clientWidth >= scrollWidth - threshold
  
  return { 
    showTop: !atTop, 
    showBottom: !atBottom,
    showLeft: !atLeft,
    showRight: !atRight
  }
}