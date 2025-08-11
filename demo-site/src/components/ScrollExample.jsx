import React, { useEffect } from 'react';
import { useScrollFades, generateColoredFadeCSS } from '@gboue/use-scroll-fades';
import { useScrollHijack } from '../hooks/useScrollHijack';

// Inject CSS for colored fades once
let cssInjected = false;
const injectColoredFadeCSS = () => {
  if (cssInjected || typeof document === 'undefined') return;
  
  const existingStyle = document.getElementById('scroll-fades-colored-css');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'scroll-fades-colored-css';
  style.textContent = generateColoredFadeCSS();
  document.head.appendChild(style);
  cssInjected = true;
};

function ScrollExample({ example, reverse }) {
  // Inject CSS for colored fades if needed
  useEffect(() => {
    if (example.fadeColor) {
      injectColoredFadeCSS();
    }
  }, [example.fadeColor]);

  const { 
    containerRef: fadeRef, 
    getContainerStyle, 
    getGradientProperties, 
    getColoredFadeClass, 
    accessibility 
  } = useScrollFades({
    threshold: 8,
    fadeSize: 20,
    transitionDuration: 300,
    transitionTimingFunction: 'ease-out',
    fadeColor: example.fadeColor // Use custom fade color if provided
  });

  // Log accessibility information (for development/demo purposes)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${example.title}] Accessibility:`, {
      shouldApplyEffects: accessibility.shouldApplyEffects,
      reducedMotionPreferred: accessibility.reducedMotionPreferred,
      maskImageSupported: accessibility.browserCapabilities.supportsMaskImage
    });
  }

  // Disable scroll hijacking for combined scroll type
  const shouldEnableHijack = example.type !== 'combined';
  const { containerRef: hijackRef, isHijacked, scrollProgress } = useScrollHijack(shouldEnableHijack);

  // Combine refs
  const combineRefs = (element) => {
    fadeRef.current = element;
    hijackRef.current = element;
  };

  const renderContent = () => {
    switch (example.type) {
      case 'colored':
        return (
          <div className="colored-content">
            {example.content.map((item, index) => (
              <div key={index} className="colored-item">
                <div className="item-badge">
                  <span className={`category-${item.category.toLowerCase()}`}>
                    {item.category}
                  </span>
                </div>
                <h4 className="colored-title">{item.title}</h4>
                <p className="colored-description">{item.description}</p>
              </div>
            ))}
          </div>
        );

      case 'slideshow':
        return (
          <div className="slideshow-content">
            {example.content.map((slide, index) => (
              <div key={index} className="slide-item">
                <div className="slide-image">
                  <div className="image-placeholder">
                    📸
                  </div>
                </div>
                <div className="slide-info">
                  <h4>{slide.title}</h4>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'horizontal':
        return (
          <div className="horizontal-content">
            {example.content.map((item, index) => (
              <div key={index} className="horizontal-item">
                <div className="item-number">{item.id}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        );

      case 'combined':
        return (
          <div className="grid-content">
            {example.content.map((cell, index) => (
              <div key={index} className="grid-cell">
                <div className="cell-header">
                  {cell.title}
                </div>
                <div className="cell-body">
                  Row {cell.row}<br />
                  Col {cell.col}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="scroll-content">
            {example.content.map((item, index) => (
              <div key={index} className="scroll-item">
                {typeof item === 'string' ? item : JSON.stringify(item)}
              </div>
            ))}
          </div>
        );
    }
  };

  const getScrollStyle = () => {
    const baseStyles = {
      height: example.height,
      ...getContainerStyle()
    };
    
    // Add gradient properties and class for colored examples
    if (example.fadeColor) {
      return {
        ...baseStyles,
        ...getGradientProperties()
      };
    }
    
    return baseStyles;
  };

  return (
    <div className={`scroll-example ${reverse ? 'reverse' : ''} ${isHijacked ? 'hijacked' : ''}`}>
      <div className="example-info">
        <h3 className="example-title">{example.title}</h3>
        <p className="example-description">{example.description}</p>
      </div>
      
      <div className="example-demo">
        <div 
          ref={combineRefs}
          style={getScrollStyle()}
          className={`scroll-container ${example.type}-scroll ${isHijacked ? 'active-hijack' : ''} ${example.fadeColor ? getColoredFadeClass() : ''}`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default ScrollExample;