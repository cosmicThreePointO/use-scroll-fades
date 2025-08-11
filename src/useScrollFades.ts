import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FadeState, UseScrollFadesOptions, GradientColors } from './types'
import { computeFadeState } from './computeFadeState'
import { prefersReducedMotion, watchMotionPreference, getBrowserCapabilities } from './utils/accessibility'
import { generateFadeGradientProperties, COLORED_FADE_CLASS } from './utils/gradientStyles'

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
 * Default gradient colors for fade effects
 */
const DEFAULT_GRADIENT_COLORS: GradientColors = {
  from: 'rgba(0,0,0,0.15)',
  to: 'transparent'
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
 * Creates colored gradient backgrounds for fade effects
 * @param colors - Gradient color configuration
 * @param direction - CSS gradient direction
 * @returns CSS gradient string
 */
const createColoredGradient = (colors: GradientColors, direction: string): string => {
  return `linear-gradient(${direction}, ${colors.from}, ${colors.to})`
}

/**
 * Resolves gradient colors with fallbacks and fadeColor override
 * @param colors - Specific direction colors
 * @param fadeColor - Global fade color override
 * @returns Resolved gradient colors
 */
const resolveGradientColors = (colors?: GradientColors, fadeColor?: string): GradientColors => {
  if (fadeColor) {
    return { from: fadeColor, to: 'transparent' }
  }
  return colors || DEFAULT_GRADIENT_COLORS
}

/**
 * Computes container styles with mask-based fade effects and colored gradients
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
  shouldApplyEffects: boolean
  maskImageSupported: boolean
  maskImageFallback: 'disable' | 'ignore'
  topColors: GradientColors
  bottomColors: GradientColors
  leftColors: GradientColors
  rightColors: GradientColors
}): React.CSSProperties => {
  const { 
    showTop, 
    showBottom, 
    showLeft, 
    showRight, 
    fadeSize,
    disableTransitions, 
    transitionDuration, 
    transitionTimingFunction,
    shouldApplyEffects,
    maskImageSupported,
    maskImageFallback,
    topColors,
    bottomColors,
    leftColors,
    rightColors
  } = params
  
  // If effects should be disabled, return empty styles
  if (!shouldApplyEffects) {
    return {}
  }

  // Handle mask-image fallback
  if (!maskImageSupported) {
    if (maskImageFallback === 'disable') {
      // Log warning for developers
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'use-scroll-fades: mask-image is not supported in this browser. ' +
          'Fade effects are disabled. Set maskImageFallback="ignore" to apply styles anyway.'
        )
      }
      return {}
    }
    // If fallback is 'ignore', continue with mask styles (developer choice)
  }
  
  const maskImage = createMaskImage(showTop, showBottom, showLeft, showRight, fadeSize)
  
  // Create colored background gradients for visible fades
  const gradientLayers: string[] = []
  if (showTop) gradientLayers.push(createColoredGradient(topColors, 'to bottom'))
  if (showBottom) gradientLayers.push(createColoredGradient(bottomColors, 'to top'))
  if (showLeft) gradientLayers.push(createColoredGradient(leftColors, 'to right'))
  if (showRight) gradientLayers.push(createColoredGradient(rightColors, 'to left'))
  
  const baseStyles: React.CSSProperties = {
    // Mask properties for transparency
    maskImage,
    WebkitMaskImage: maskImage,
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskSize: '100% 100%, 100% 100%',
    WebkitMaskSize: '100% 100%, 100% 100%',
    maskPosition: '0 0, 0 0',
    WebkitMaskPosition: '0 0, 0 0',
    // Position relative for pseudo-elements
    position: 'relative'
  } as React.CSSProperties
  
  // Add gradient backgrounds as CSS custom properties for pseudo-elements
  if (gradientLayers.length > 0) {
    ;(baseStyles as any)['--fade-gradients'] = gradientLayers.join(', ')
    ;(baseStyles as any)['--fade-gradient-count'] = gradientLayers.length.toString()
  }
  
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
    disableTransitions = false,
    respectReducedMotion = true,
    respectBrowserSupport = true,
    maskImageFallback = 'disable',
    topColors,
    bottomColors,
    leftColors,
    rightColors,
    fadeColor,
    // Legacy options (deprecated)
    topGradient,
    bottomGradient,
    leftGradient,
    rightGradient
  } = options
  
  // Resolve gradient colors with fallbacks
  const resolvedTopColors = resolveGradientColors(topColors, fadeColor)
  const resolvedBottomColors = resolveGradientColors(bottomColors, fadeColor)
  const resolvedLeftColors = resolveGradientColors(leftColors, fadeColor)
  const resolvedRightColors = resolveGradientColors(rightColors, fadeColor)
  
  // Warn about deprecated options
  if (process.env.NODE_ENV !== 'production') {
    if (topGradient || bottomGradient || leftGradient || rightGradient) {
      console.warn(
        'use-scroll-fades: topGradient, bottomGradient, leftGradient, and rightGradient are deprecated. ' +
        'Use topColors, bottomColors, leftColors, rightColors, or fadeColor instead.'
      )
    }
  }

  const containerRef = useRef<T | null>(null)
  const [state, setState] = useState<FadeState>({ 
    showTop: false, 
    showBottom: false, 
    showLeft: false, 
    showRight: false 
  })
  const [reducedMotionPreferred, setReducedMotionPreferred] = useState(false)
  const frame = useRef<number | null>(null)
  
  // Check browser capabilities once
  const browserCapabilities = useMemo(() => getBrowserCapabilities(), [])
  
  // Check if we should apply effects based on accessibility and browser support
  const shouldApplyEffects = useMemo(() => {
    // Respect reduced motion preference
    if (respectReducedMotion && (reducedMotionPreferred || browserCapabilities.prefersReducedMotion)) {
      return false
    }
    
    // Respect browser support (if enabled)
    if (respectBrowserSupport && !browserCapabilities.supportsMaskImage && maskImageFallback === 'disable') {
      return false
    }
    
    return true
  }, [respectReducedMotion, reducedMotionPreferred, respectBrowserSupport, browserCapabilities, maskImageFallback])
  
  // Determine if transitions should be disabled
  const shouldDisableTransitions = useMemo(() => {
    if (disableTransitions) return true
    if (respectReducedMotion && (reducedMotionPreferred || browserCapabilities.prefersReducedMotion)) return true
    if (!browserCapabilities.supportsTransitions) return true
    return false
  }, [disableTransitions, respectReducedMotion, reducedMotionPreferred, browserCapabilities])

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

  // Watch for changes to motion preferences
  useEffect(() => {
    if (!respectReducedMotion) return

    // Set initial state
    setReducedMotionPreferred(prefersReducedMotion())

    // Watch for changes
    const cleanup = watchMotionPreference((prefersReduced) => {
      setReducedMotionPreferred(prefersReduced)
    })

    return cleanup
  }, [respectReducedMotion])

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
   * @returns CSS properties object with mask styles and gradient colors
   */
  const getContainerStyle = useMemo(() => {
    return (s: FadeState = state) => {
      return computeContainerStyles({
        showTop: s.showTop,
        showBottom: s.showBottom,
        showLeft: s.showLeft,
        showRight: s.showRight,
        fadeSize,
        disableTransitions: shouldDisableTransitions,
        transitionDuration,
        transitionTimingFunction,
        shouldApplyEffects,
        maskImageSupported: browserCapabilities.supportsMaskImage,
        maskImageFallback,
        topColors: resolvedTopColors,
        bottomColors: resolvedBottomColors,
        leftColors: resolvedLeftColors,
        rightColors: resolvedRightColors
      })
    }
  }, [state, fadeSize, shouldDisableTransitions, transitionDuration, transitionTimingFunction, shouldApplyEffects, browserCapabilities.supportsMaskImage, maskImageFallback, resolvedTopColors, resolvedBottomColors, resolvedLeftColors, resolvedRightColors])

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

  /**
   * Gets CSS custom properties for colored gradient fades
   * Use this with getColoredFadeClass() for colored fade effects
   * 
   * @param s - Optional fade state to use (defaults to current state)
   * @returns Object with CSS custom properties
   */
  const getGradientProperties = useMemo(() => {
    return (s: FadeState = state) => {
      if (!shouldApplyEffects) return {}
      
      return generateFadeGradientProperties({
        topColors: resolvedTopColors,
        bottomColors: resolvedBottomColors,
        leftColors: resolvedLeftColors,
        rightColors: resolvedRightColors,
        fadeColor,
        showTop: s.showTop,
        showBottom: s.showBottom,
        showLeft: s.showLeft,
        showRight: s.showRight
      })
    }
  }, [state, shouldApplyEffects, resolvedTopColors, resolvedBottomColors, resolvedLeftColors, resolvedRightColors, fadeColor])

  /**
   * Gets the CSS class name for colored fades
   * Add this class to your container along with the mask styles
   * 
   * @returns CSS class name for colored fade effects
   */
  const getColoredFadeClass = useCallback(() => COLORED_FADE_CLASS, [])

  return { 
    containerRef, 
    state, 
    getContainerStyle,
    getOverlayStyle, // Legacy support
    
    // New gradient color API
    getGradientProperties,
    getColoredFadeClass,
    
    // Accessibility and browser info
    accessibility: {
      shouldApplyEffects,
      reducedMotionPreferred,
      browserCapabilities,
      shouldDisableTransitions
    }
  }
}