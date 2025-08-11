import { useEffect, useRef, useState, useCallback, useId } from 'react';
import { useScrollHijackContext } from '../contexts/ScrollHijackContext';

export function useScrollHijack(enabled = true) {
  const containerRef = useRef(null);
  const [isHijacked, setIsHijacked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerId = useId();
  const { registerContainer, unregisterContainer, requestActivation, releaseActivation, isActive } = useScrollHijackContext();

  const checkScrollLimits = useCallback((container) => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = container;
    
    // For vertical scrolling
    const atTop = scrollTop <= 1;
    const atBottom = scrollTop >= scrollHeight - clientHeight - 1;
    
    // For horizontal scrolling
    const atLeft = scrollLeft <= 1;
    const atRight = scrollLeft >= scrollWidth - clientWidth - 1;
    
    return { atTop, atBottom, atLeft, atRight };
  }, []);

  const isContainerInViewport = useCallback((container) => {
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Container is considered "in focus" when it's significantly visible
    const containerTop = rect.top;
    const containerBottom = rect.bottom;
    const containerHeight = rect.height;
    
    // Container should be at least 30% visible and not completely above or below viewport
    const visibleHeight = Math.min(containerBottom, viewportHeight) - Math.max(containerTop, 0);
    const visibilityRatio = visibleHeight / containerHeight;
    
    return visibilityRatio >= 0.3 && containerTop < viewportHeight * 0.8 && containerBottom > viewportHeight * 0.2;
  }, []);

  const handleWheel = useCallback((event) => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const inViewport = isContainerInViewport(container);
    
    if (!inViewport) {
      setIsHijacked(false);
      releaseActivation(containerId);
      return;
    }

    const { atTop, atBottom, atLeft, atRight } = checkScrollLimits(container);
    const { deltaY, deltaX } = event;
    
    // Determine if we should hijack the scroll
    let canScrollInContainer = false;

    // Determine container type
    const containerClasses = container.className;
    const isHorizontalContainer = containerClasses.includes('horizontal-scroll');

    if (isHorizontalContainer) {
      // For horizontal containers, vertical wheel should control horizontal scrolling
      if (deltaY > 0 && !atRight) {
        // Scrolling down (wheel) should scroll right and not at right edge
        canScrollInContainer = true;
      } else if (deltaY < 0 && !atLeft) {
        // Scrolling up (wheel) should scroll left and not at left edge
        canScrollInContainer = true;
      }
    } else {
      // Normal vertical scrolling
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 0 && !atBottom) {
          // Scrolling down and not at bottom
          canScrollInContainer = true;
        } else if (deltaY < 0 && !atTop) {
          // Scrolling up and not at top
          canScrollInContainer = true;
        }
      } 
      // Check horizontal scrolling for non-horizontal containers
      else if (Math.abs(deltaX) > 0) {
        if (deltaX > 0 && !atRight) {
          // Scrolling right and not at right edge
          canScrollInContainer = true;
        } else if (deltaX < 0 && !atLeft) {
          // Scrolling left and not at left edge
          canScrollInContainer = true;
        }
      }
    }

    if (canScrollInContainer) {
      // Request activation from context
      requestActivation(containerId);
      
      // Only hijack if this container is the active one
      if (isActive(containerId)) {
        // Prevent main page scrolling completely
        event.preventDefault();
        event.stopPropagation();
        
        setIsHijacked(true);
        
        // Direct scroll without smooth behavior to avoid jumpiness
        if (isHorizontalContainer) {
          // Translate vertical scroll wheel to horizontal scrolling
          container.scrollLeft += deltaY;
          // Update scroll progress for horizontal
          const newProgress = container.scrollLeft / (container.scrollWidth - container.clientWidth);
          setScrollProgress(Math.max(0, Math.min(1, newProgress)));
        } else {
          // Normal vertical scrolling
          const scrollAmount = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
          const isHorizontalScroll = Math.abs(deltaX) > Math.abs(deltaY);
          
          if (isHorizontalScroll) {
            container.scrollLeft += scrollAmount;
          } else {
            container.scrollTop += scrollAmount;
          }
          
          // Update scroll progress
          const newProgress = isHorizontalScroll 
            ? (container.scrollLeft / (container.scrollWidth - container.clientWidth))
            : (container.scrollTop / (container.scrollHeight - container.clientHeight));
          
          setScrollProgress(Math.max(0, Math.min(1, newProgress)));
        }
      }
    } else {
      setIsHijacked(false);
      releaseActivation(containerId);
    }
  }, [enabled, isContainerInViewport, checkScrollLimits, containerId, requestActivation, releaseActivation, isActive]);

  // Register container with priority based on its position
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Calculate priority based on container's top position (lower value = higher priority)
    const rect = container.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const priority = rect.top + scrollTop;

    registerContainer(containerId, container, priority);

    return () => {
      unregisterContainer(containerId);
    };
  }, [enabled, containerId, registerContainer, unregisterContainer]);

  useEffect(() => {
    if (!enabled) return;

    const handleWheelCapture = (event) => handleWheel(event);
    
    // Use capture phase to intercept before other handlers
    document.addEventListener('wheel', handleWheelCapture, { passive: false, capture: true });
    
    return () => {
      document.removeEventListener('wheel', handleWheelCapture, { capture: true });
    };
  }, [enabled, handleWheel]);

  // Monitor container scroll to update progress
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = container;
      
      const verticalProgress = scrollHeight > clientHeight 
        ? scrollTop / (scrollHeight - clientHeight)
        : 0;
      const horizontalProgress = scrollWidth > clientWidth 
        ? scrollLeft / (scrollWidth - clientWidth) 
        : 0;
      
      const progress = Math.max(verticalProgress, horizontalProgress);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    containerRef,
    isHijacked,
    scrollProgress
  };
}