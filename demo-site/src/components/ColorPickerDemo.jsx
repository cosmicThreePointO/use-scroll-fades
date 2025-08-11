import React, { useState } from 'react';
import { useScrollFades, generateColoredFadeCSS } from '@gboue/use-scroll-fades';

// Inject CSS for colored fades
const injectColoredFadeCSS = () => {
  if (typeof document === 'undefined') return;
  
  const existingStyle = document.getElementById('scroll-fades-colored-css');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'scroll-fades-colored-css';
  style.textContent = generateColoredFadeCSS();
  document.head.appendChild(style);
};

// Inject CSS when component mounts
if (typeof document !== 'undefined') {
  injectColoredFadeCSS();
}

function ColorPickerDemo() {
  const [fadeColor, setFadeColor] = useState('#000000');
  const [opacity, setOpacity] = useState(0.15);

  // Convert hex color to rgba with opacity
  const getRgbaColor = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const currentFadeColor = getRgbaColor(fadeColor, opacity);

  const { 
    containerRef, 
    getContainerStyle, 
    getGradientProperties, 
    getColoredFadeClass,
    state
  } = useScrollFades({
    fadeColor: currentFadeColor,
    threshold: 8,
    fadeSize: 20,
    transitionDuration: 300
  });

  // Sample content for scrolling
  const sampleItems = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is sample content item ${i + 1}. It demonstrates how the colored fade effects work with different colors and opacity levels.`
  }));

  const containerStyle = {
    height: '300px',
    overflow: 'auto',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    padding: '20px',
    ...getContainerStyle()
  };

  const gradientProps = getGradientProperties();
  const coloredFadeClass = getColoredFadeClass();

  return (
    <div className="color-picker-demo">
      <div className="demo-header">
        <h2 className="demo-title">🎨 Interactive Gradient Color Demo</h2>
        <p className="demo-description">
          Customize the fade colors in real-time using the controls below. 
          The fade effects will update instantly as you change the color and opacity.
        </p>
      </div>

      <div className="demo-controls">
        <div className="control-group">
          <label htmlFor="color-picker">
            <span className="control-label">Fade Color</span>
            <input
              id="color-picker"
              type="color"
              value={fadeColor}
              onChange={(e) => setFadeColor(e.target.value)}
              className="color-input"
            />
          </label>
        </div>

        <div className="control-group">
          <label htmlFor="opacity-slider">
            <span className="control-label">Opacity: {opacity.toFixed(2)}</span>
            <input
              id="opacity-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="opacity-slider"
            />
          </label>
        </div>

        <div className="color-preview">
          <span className="preview-label">Preview:</span>
          <div 
            className="color-swatch"
            style={{ backgroundColor: currentFadeColor }}
          />
          <code className="color-code">{currentFadeColor}</code>
        </div>
      </div>

      <div className="demo-container">
        <div 
          ref={containerRef}
          className={`scroll-content ${coloredFadeClass}`}
          style={{ ...containerStyle, ...gradientProps }}
        >
          {sampleItems.map((item) => (
            <div key={item.id} className="content-item">
              <div className="item-header">
                <div className="item-number">{item.id}</div>
                <h4 className="item-title">{item.title}</h4>
              </div>
              <p className="item-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="demo-info">
        <div className="info-section">
          <h4>Current State</h4>
          <div className="state-indicators">
            <span className={`indicator ${state.showTop ? 'active' : ''}`}>
              Top Fade {state.showTop ? '✅' : '❌'}
            </span>
            <span className={`indicator ${state.showBottom ? 'active' : ''}`}>
              Bottom Fade {state.showBottom ? '✅' : '❌'}
            </span>
          </div>
        </div>

        <div className="info-section">
          <h4>Usage Example</h4>
          <pre className="code-example">
{`const { 
  containerRef, 
  getContainerStyle, 
  getGradientProperties, 
  getColoredFadeClass 
} = useScrollFades({
  fadeColor: '${currentFadeColor}'
})

// Apply styles to your container
<div 
  ref={containerRef}
  className={getColoredFadeClass()}
  style={{
    height: '300px',
    overflow: 'auto',
    ...getContainerStyle(),
    ...getGradientProperties()
  }}
>
  {/* Your scrollable content */}
</div>`}
          </pre>
        </div>
      </div>

      <style jsx>{`
        .color-picker-demo {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 0;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .demo-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .demo-description {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .demo-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--surface-subtle);
          border-radius: 16px;
          border: 1px solid var(--border-subtle);
        }

        .control-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .control-label {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .color-input {
          width: 60px;
          height: 40px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .opacity-slider {
          width: 150px;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(to right, transparent, var(--text-primary));
          outline: none;
          cursor: pointer;
        }

        .color-preview {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .preview-label {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .color-swatch {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 2px solid var(--border);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .color-code {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.85rem;
          background: var(--surface-subtle);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          color: var(--text-primary);
          border: 1px solid var(--border);
        }

        .demo-container {
          margin-bottom: 2rem;
        }

        .scroll-content {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }

        .scroll-content::-webkit-scrollbar {
          width: 8px;
        }

        .scroll-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .scroll-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        .content-item {
          background: rgba(255, 255, 255, 0.95);
          margin-bottom: 1rem;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .item-number {
          background: var(--primary);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .item-title {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .item-description {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .demo-info {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .info-section {
          background: var(--surface);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .info-section h4 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .state-indicators {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .indicator {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          background: var(--surface-subtle);
          border: 1px solid var(--border);
          transition: all 200ms ease;
        }

        .indicator.active {
          background: var(--success-subtle);
          border-color: var(--success);
          color: var(--success);
        }

        .code-example {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.8rem;
          line-height: 1.5;
          background: var(--surface-subtle);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          color: var(--text-primary);
          overflow-x: auto;
          white-space: pre;
        }

        @media (max-width: 768px) {
          .demo-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .color-preview {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .demo-info {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default ColorPickerDemo;