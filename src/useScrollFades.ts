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
  return `opacity ${duration}ms ${timingFunction}`.trim()
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
  ;(styles as any).msTransition = transitionValue // IE support
}

/**
 * Computes base styles for fade overlay elements
 * @param params - Style computation parameters
 * @returns React CSS properties object
 */
const computeOverlayStyles = (params: {
  visible: boolean
  backgroundImage: string
  disableTransitions: boolean
  transitionDuration: number
  transitionTimingFunction: string
}): React.CSSProperties => {
  const { visible, backgroundImage, disableTransitions, transitionDuration, transitionTimingFunction } = params
  
  const baseStyles: React.CSSProperties = {
    backgroundImage,
    opacity: visible ? 1 : 0,
    pointerEvents: 'none' as const, // Always none to prevent interaction
  }
  
  if (!disableTransitions) {
    const transitionValue = createTransitionValue(transitionDuration, transitionTimingFunction)
    applyVendorPrefixedTransitions(baseStyles, transitionValue)
  }
  
  return baseStyles
}

/**
 * Custom hook for managing scroll-based fade overlays on scrollable containers.
 * 
 * Provides automatic fade-in/fade-out overlays at the top and bottom of scrollable content
 * to indicate when there is more content to scroll. The hook handles scroll events,
 * content changes, and resize events automatically.
 * 
 * @example
 * ```tsx
 * function ScrollableList({ items }) {
 *   const { containerRef, state, getOverlayStyle } = useScrollFades({
 *     threshold: 16,
 *     transitionDuration: 300
 *   })
 * 
 *   return (
 *     <div style={{ position: 'relative' }}>
 *       <div 
 *         ref={containerRef}
 *         style={{ height: '300px', overflow: 'auto' }}
 *       >
 *         {items.map(item => <div key={item.id}>{item.name}</div>)}
 *       </div>
 *       
 *       <div 
 *         style={{
 *           position: 'absolute',
 *           top: 0,
 *           left: 0,
 *           right: 0,
 *           height: '20px',
 *           ...getOverlayStyle('top')
 *         }}
 *       />
 *       
 *       <div 
 *         style={{
 *           position: 'absolute',
 *           bottom: 0,
 *           left: 0,
 *           right: 0,
 *           height: '20px',
 *           ...getOverlayStyle('bottom')
 *         }}
 *       />
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
    topGradient = 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0))',
    bottomGradient = 'linear-gradient(to top, rgba(0,0,0,0.25), rgba(0,0,0,0))',
    transitionDuration = 200,
    transitionTimingFunction = 'ease-out',
    disableTransitions = false
  } = options

  const containerRef = useRef<T | null>(null)
  const [state, setState] = useState<FadeState>({ showTop: false, showBottom: false })
  const frame = useRef<number | null>(null)

  /**
   * Measures current scroll position and updates fade state accordingly
   */
  const measure = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    
    const next = computeFadeState(el.scrollTop, el.scrollHeight, el.clientHeight, threshold)
    setState(prev => 
      prev.showTop === next.showTop && prev.showBottom === next.showBottom 
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
   * Generates CSS styles for fade overlay elements
   * 
   * @param position - Whether this is the 'top' or 'bottom' overlay
   * @param s - Optional fade state to use (defaults to current state)
   * @returns CSS properties object for the overlay
   */
  const getOverlayStyle = useMemo(() => {
    return (position: 'top' | 'bottom', s: FadeState = state) => {
      const visible = position === 'top' ? s.showTop : s.showBottom
      const backgroundImage = position === 'top' ? topGradient : bottomGradient
      
      return computeOverlayStyles({
        visible,
        backgroundImage,
        disableTransitions,
        transitionDuration,
        transitionTimingFunction
      })
    }
  }, [state, topGradient, bottomGradient, transitionDuration, transitionTimingFunction, disableTransitions])

  return { containerRef, state, getOverlayStyle }
}