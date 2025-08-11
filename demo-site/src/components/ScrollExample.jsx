import React from 'react';
import { useScrollFades } from '@gboue/use-scroll-fades';
import { useScrollHijack } from '../hooks/useScrollHijack';

function ScrollExample({ example, reverse }) {
  const { containerRef: fadeRef, getContainerStyle } = useScrollFades({
    threshold: 8,
    fadeSize: 20,
    transitionDuration: 300,
    transitionTimingFunction: 'ease-out'
  });

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
    return {
      height: example.height,
      ...getContainerStyle()
    };
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
          className={`scroll-container ${example.type}-scroll ${isHijacked ? 'active-hijack' : ''}`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default ScrollExample;