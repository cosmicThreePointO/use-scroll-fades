import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FadeState, UseScrollFadesOptions } from './types'
import { computeFadeState } from './computeFadeState'

/**
 * Creates transition CSS value with vendor prefixes for cross-browser compatibility
 * @param duration - Transition duration in milliseconds
 * @param timingFunction - CSS timing function
 * @returns CSS transition value string
 */
const createTransitionValue = (duration: number, timingFunction: string): string => {
  return `mask ${duration}ms ${timingFunction}, -webkit-mask ${duration}ms ${timingFunction}`.trim()
}

/**
 * Applies vendor-prefixed transition properties to a style object
 * @param styles - Base styles object to modify
 * @param transitionValue - CSS transition value to apply
 */
const applyVendorPrefixedTransitions = (
  styles: React.CSSProperties, 
  transitionValue: string
): void => {
  styles.transition = transitionValue
  ;(styles as any).WebkitTransition = transitionValue // Safari support
  ;(styles as any).MozTransition = transitionValue // Firefox support  
  ;(styles as any).msTransition = transitionValue // IE support (fallback)
}

/**
 * Creates mask-image CSS value for fade effects
 * @param showTop - Whether top fade is visible
 * @param showBottom - Whether bottom fade is visible  
 * @param showLeft - Whether left fade is visible
 * @param showRight - Whether right fade is visible
 * @param fadeSize - Size of fade effect in pixels
 * @returns CSS mask-image value string
 */
const createMaskImage = (
  showTop: boolean,
  showBottom: boolean, 
  showLeft: boolean,
  showRight: boolean,
  fadeSize: number = 20
): string => {
  // Create base mask (fully opaque center)
  let topStop = showTop ? `${fadeSize}px` : '0px'
  let bottomStop = showBottom ? `calc(100% - ${fadeSize}px)` : '100%'
  let leftStop = showLeft ? `${fadeSize}px` : '0px' 
  let rightStop = showRight ? `calc(100% - ${fadeSize}px)` : '100%'
  
  // Vertical gradient (handles top/bottom fades)
  const verticalGradient = `linear-gradient(to bottom, transparent 0px, black ${topStop}, black ${bottomStop}, transparent 100%)`
  
  // Horizontal gradient (handles left/right fades)  
  const horizontalGradient = `linear-gradient(to right, transparent 0px, black ${leftStop}, black ${rightStop}, transparent 100%)`
  
  return `${verticalGradient}, ${horizontalGradient}`
}

/**
 * Computes container styles with mask-based fade effects
 * @param params - Style computation parameters
 * @returns React CSS properties object
 */
const computeContainerStyles = (params: {
  showTop: boolean
  showBottom: boolean
  showLeft: boolean
  showRight: boolean
  fadeSize: number
  disableTransitions: boolean
  transitionDuration: number
  transitionTimingFunction: string
}): React.CSSProperties => {
  const { 
    showTop, 
    showBottom, 
    showLeft, 
    showRight, 
    fadeSize,
    disableTransitions, 
    transitionDuration, 
    transitionTimingFunction 
  } = params
  
  const maskImage = createMaskImage(showTop, showBottom, showLeft, showRight, fadeSize)
  
  const baseStyles: React.CSSProperties = {
    maskImage,
    WebkitMaskImage: maskImage, // Safari support
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in', // Safari uses different syntax
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskSize: '100% 100%, 100% 100%',
    WebkitMaskSize: '100% 100%, 100% 100%',
    maskPosition: '0 0, 0 0',
    WebkitMaskPosition: '0 0, 0 0'
  } as React.CSSProperties
  
  if (!disableTransitions) {
    const transitionValue = createTransitionValue(transitionDuration, transitionTimingFunction)
    applyVendorPrefixedTransitions(baseStyles, transitionValue)
  }
  
  return baseStyles
}

/**
 * Custom hook for managing scroll-based fade effects on scrollable containers.
 * 
 * Uses CSS mask-image to create true transparency fade effects that work with any background.
 * Unlike overlay approaches, this creates actual transparency that doesn't interfere with 
 * complex backgrounds like images, gradients, or patterns.
 * 
 * @example
 * ```tsx
 * function ScrollableList({ items }) {
 *   const { containerRef, getContainerStyle } = useScrollFades({
 *     threshold: 16,
 *     fadeSize: 20,
 *     transitionDuration: 300
 *   })
 * 
 *   return (
 *     <div 
 *       ref={containerRef}
 *       style={{
 *         height: '300px', 
 *         overflow: 'auto',
 *         ...getContainerStyle()
 *       }}
 *     >
 *       {items.map(item => <div key={item.id}>{item.name}</div>)}
 *     </div>
 *   )
 * }
 * ```
 * 
 * @template T - HTMLElement type for the container (defaults to HTMLElement)
 * @param options - Configuration options for the hook
 * @returns Object containing containerRef, current state, and style generator function
 */
export function useScrollFades<T extends HTMLElement = HTMLElement>(
  options: UseScrollFadesOptions = {}
) {
  const {
    threshold = 8,
    fadeSize = 20,
    transitionDuration = 200,
    transitionTimingFunction = 'ease-out',
    disableTransitions = false
    // Legacy overlay options are ignored in mask-image implementation
  } = options

  const containerRef = useRef<T | null>(null)
  const [state, setState] = useState<FadeState>({ 
    showTop: false, 
    showBottom: false, 
    showLeft: false, 
    showRight: false 
  })
  const frame = useRef<number | null>(null)

  /**
   * Measures current scroll position and updates fade state accordingly
   */
  const measure = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    
    const next = computeFadeState(
      el.scrollTop, 
      el.scrollHeight, 
      el.clientHeight,
      el.scrollLeft,
      el.scrollWidth,
      el.clientWidth,
      threshold
    )
    setState(prev => 
      prev.showTop === next.showTop && 
      prev.showBottom === next.showBottom &&
      prev.showLeft === next.showLeft &&
      prev.showRight === next.showRight
        ? prev 
        : next
    )
  }, [threshold])

  /**
   * Handles scroll events with requestAnimationFrame throttling for performance
   */
  const handleScroll = useCallback(() => {
    if (frame.current !== null) return
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      measure()
    })
  }, [measure])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Initial measurement
    measure()

    // Set up event listeners
    el.addEventListener('scroll', handleScroll, { passive: true })

    // Set up observers for dynamic content changes
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(el)

    const mutationObserver = new MutationObserver(measure)
    mutationObserver.observe(el, { childList: true, subtree: true })

    // Cleanup function
    return () => {
      el.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current)
      }
    }
  }, [handleScroll, measure])

  /**
   * Generates CSS styles for the scrollable container with mask-based fade effects
   * 
   * @param s - Optional fade state to use (defaults to current state)
   * @returns CSS properties object with mask styles
   */
  const getContainerStyle = useMemo(() => {
    return (s: FadeState = state) => {
      return computeContainerStyles({
        showTop: s.showTop,
        showBottom: s.showBottom,
        showLeft: s.showLeft,
        showRight: s.showRight,
        fadeSize,
        disableTransitions,
        transitionDuration,
        transitionTimingFunction
      })
    }
  }, [state, fadeSize, transitionDuration, transitionTimingFunction, disableTransitions])

  /**
   * Legacy overlay style function - kept for backward compatibility
   * @deprecated Use getContainerStyle() instead for mask-based fades
   */
  const getOverlayStyle = useMemo(() => {
    return (_position: 'top' | 'bottom' | 'left' | 'right', _s: FadeState = state) => {
      // For backward compatibility, return empty styles and warn
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'getOverlayStyle is deprecated. Use getContainerStyle() directly on your scrollable container instead. ' +
          'The new mask-image approach provides better performance and works with any background.'
        )
      }
      return {}
    }
  }, [state])

  return { 
    containerRef, 
    state, 
    getContainerStyle,
    getOverlayStyle // Legacy support
  }
}