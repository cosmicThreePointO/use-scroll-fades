import React, { useState, useRef, useEffect } from 'react';
import { useScrollFades } from '@gboue/use-scroll-fades';

// Color palette with high-contrast, visible colors for fade effects
const colorPalette = {
  warm: [
    { name: 'Bright Orange', color: '#FF4500', hex: '#FF4500' },
    { name: 'Fire Red', color: '#DC143C', hex: '#DC143C' },
    { name: 'Gold', color: '#FFD700', hex: '#FFD700' },
    { name: 'Hot Pink', color: '#FF1493', hex: '#FF1493' },
    { name: 'Coral', color: '#FF7F50', hex: '#FF7F50' },
    { name: 'Orange Red', color: '#FF4500', hex: '#FF6347' },
  ],
  cool: [
    { name: 'Electric Blue', color: '#0080FF', hex: '#0080FF' },
    { name: 'Royal Purple', color: '#6A0DAD', hex: '#6A0DAD' },
    { name: 'Cyan', color: '#00BFFF', hex: '#00BFFF' },
    { name: 'Lime Green', color: '#32CD32', hex: '#32CD32' },
    { name: 'Magenta', color: '#FF00FF', hex: '#FF00FF' },
    { name: 'Turquoise', color: '#40E0D0', hex: '#40E0D0' },
  ],
  neutral: [
    { name: 'Charcoal', color: '#36454F', hex: '#36454F' },
    { name: 'Steel Blue', color: '#4682B4', hex: '#4682B4' },
    { name: 'Olive', color: '#808000', hex: '#808000' },
    { name: 'Maroon', color: '#800000', hex: '#800000' },
    { name: 'Navy', color: '#000080', hex: '#000080' },
    { name: 'Dark Green', color: '#006400', hex: '#006400' },
  ]
};

function InteractivePaletteDemo() {
  const [topColor, setTopColor] = useState('#FF4500'); // Bright orange
  const [bottomColor, setBottomColor] = useState('#0080FF'); // Electric blue
  const [opacity, setOpacity] = useState(0.15); // Start with lower opacity for better visibility
  const [activeSection, setActiveSection] = useState('top');



  // Create gradient colors with current opacity
  const getRgbaColor = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const { 
    containerRef, 
    state
  } = useScrollFades({
    threshold: 8,
    fadeSize: 50,
    transitionDuration: 300
  });

  const topFadeRef = useRef(null);
  const bottomFadeRef = useRef(null);

  const topColorRgba = getRgbaColor(topColor, opacity);
  const bottomColorRgba = getRgbaColor(bottomColor, opacity);

  // Position the fade overlays relative to the container viewport
  useEffect(() => {
    const updateFadePositions = () => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerStyle = window.getComputedStyle(containerRef.current);
      
      // Get border radius for perfect container matching
      const borderRadius = containerStyle.borderRadius;
      
      // Position top fade (covering the entire container area)
      if (topFadeRef.current) {
        // Use container's full dimensions (including borders for perfect coverage)
        topFadeRef.current.style.top = `${containerRect.top}px`;
        topFadeRef.current.style.left = `${containerRect.left}px`;
        topFadeRef.current.style.width = `${containerRect.width}px`;
        topFadeRef.current.style.right = 'auto';
        
        // Match container's border radius exactly
        topFadeRef.current.style.borderRadius = borderRadius || '0';
      }
      
      // Position bottom fade (covering the entire container area)
      if (bottomFadeRef.current) {
        // Use container's full dimensions (including borders for perfect coverage)
        bottomFadeRef.current.style.bottom = `${window.innerHeight - containerRect.bottom}px`;
        bottomFadeRef.current.style.left = `${containerRect.left}px`;
        bottomFadeRef.current.style.width = `${containerRect.width}px`;
        bottomFadeRef.current.style.right = 'auto';
        
        // Match container's border radius exactly
        bottomFadeRef.current.style.borderRadius = borderRadius || '0';
      }
    };

    // Update positions initially and on scroll/resize
    updateFadePositions();
    
    // Use a more frequent update interval for better positioning
    const intervalId = setInterval(updateFadePositions, 100);
    
    const handleScroll = () => updateFadePositions();
    const handleResize = () => updateFadePositions();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sample scrollable content
  const sampleContent = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Design Element ${i + 1}`,
    description: `This demonstrates how ${activeSection === 'top' ? 'top' : 'bottom'} fade colors affect the visual hierarchy and user experience in scrollable interfaces.`,
    type: i % 4 === 0 ? 'header' : i % 4 === 1 ? 'content' : i % 4 === 2 ? 'media' : 'action'
  }));

  const containerStyle = {
    height: '400px',
    overflow: 'auto',
    // White background to make colored fades more visible
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    position: 'relative'
  };

  const ColorPaletteSection = ({ title, colors, isActive, onColorSelect }) => (
    <div className={`palette-section ${isActive ? 'active' : ''}`}>
      <h4 className="palette-title">{title}</h4>
      <div className="color-grid">
        {colors.map((colorInfo) => (
          <button
            key={colorInfo.hex}
            className={`color-swatch ${
              (activeSection === 'top' ? topColor : bottomColor) === colorInfo.hex ? 'selected' : ''
            }`}
            style={{ backgroundColor: colorInfo.hex }}
            onClick={() => onColorSelect(colorInfo.hex)}
            title={colorInfo.name}
          >
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="interactive-palette-demo">
      <div className="demo-header">
        <h3>🎨 Interactive Color Palette Demo</h3>
        <p>Select colors for top and bottom fades and see them in action! Perfect for matching your brand colors.</p>
        
        {/* Opacity Control */}
        <div className="opacity-control">
          <label>
            <span>Opacity: {opacity.toFixed(2)}</span>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.025"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="opacity-slider"
            />
          </label>
        </div>
      </div>

      <div className="controls-section">
        {/* Fade Selection Tabs */}
        <div className="fade-selector">
          <button 
            className={`fade-tab ${activeSection === 'top' ? 'active' : ''}`}
            onClick={() => setActiveSection('top')}
          >
            <span className="tab-icon">⬆️</span>
            Top Fade
            <div className="color-preview" style={{ backgroundColor: topColor }} />
          </button>
          <button 
            className={`fade-tab ${activeSection === 'bottom' ? 'active' : ''}`}
            onClick={() => setActiveSection('bottom')}
          >
            <span className="tab-icon">⬇️</span>
            Bottom Fade
            <div className="color-preview" style={{ backgroundColor: bottomColor }} />
          </button>
        </div>
      </div>

      {/* Color Palettes */}
      <div className="color-palettes">
        <ColorPaletteSection
          title="🔥 Warm Colors"
          colors={colorPalette.warm}
          isActive={activeSection === 'top' || activeSection === 'bottom'}
          onColorSelect={(color) => {
            if (activeSection === 'top') {
              setTopColor(color);
            } else {
              setBottomColor(color);
            }
          }}
        />
        <ColorPaletteSection
          title="❄️ Cool Colors"
          colors={colorPalette.cool}
          isActive={activeSection === 'top' || activeSection === 'bottom'}
          onColorSelect={(color) => {
            if (activeSection === 'top') {
              setTopColor(color);
            } else {
              setBottomColor(color);
            }
          }}
        />
        <ColorPaletteSection
          title="🎭 Neutral Colors"
          colors={colorPalette.neutral}
          isActive={activeSection === 'top' || activeSection === 'bottom'}
          onColorSelect={(color) => {
            if (activeSection === 'top') {
              setTopColor(color);
            } else {
              setBottomColor(color);
            }
          }}
        />
      </div>

      {/* Live Preview */}
      <div className="demo-preview">
        <h4>Live Preview</h4>
        <div
          ref={containerRef}
          className="scroll-content colored-fade-container"
          style={containerStyle}
        >
          {/* Colored fade overlays */}
          <div 
            className="fade-overlay fade-top"
            ref={topFadeRef}
            style={{
              background: `linear-gradient(to bottom, ${topColorRgba}, transparent)`,
              display: state.showTop ? 'block' : 'none'
            }}
          />
          <div 
            className="fade-overlay fade-bottom"
            ref={bottomFadeRef}
            style={{
              background: `linear-gradient(to top, ${bottomColorRgba}, transparent)`,
              display: state.showBottom ? 'block' : 'none'
            }}
          />

          <div className="content-inner">
            {sampleContent.map((item) => (
              <div key={item.id} className={`content-item ${item.type}`}>
                <div className="item-header">
                  <div className="item-number">{item.id}</div>
                  <h5>{item.title}</h5>
                </div>
                <p>{item.description}</p>
                <div className="item-meta">
                  Current fade: {activeSection === 'top' ? `Top (${topColor})` : `Bottom (${bottomColor})`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current State Debug Info */}
      <div className="state-debug">
        <h4>📊 Current Fade State</h4>
        <div className="state-indicators">
          <span className={`indicator ${state.showTop ? 'active' : ''}`}>
            Top Fade {state.showTop ? '✅' : '❌'}
          </span>
          <span className={`indicator ${state.showBottom ? 'active' : ''}`}>
            Bottom Fade {state.showBottom ? '✅' : '❌'}
          </span>
          <span className="indicator">
            Current Colors: Top({topColor}) / Bottom({bottomColor})
          </span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="preset-section">
        <h4>🚀 Quick Presets</h4>
        <div className="preset-buttons">
          <button
            className="preset-btn"
            onClick={() => {
              setTopColor('#FF4500'); // Bright Orange
              setBottomColor('#6A0DAD'); // Royal Purple
              setOpacity(0.2);
            }}
          >
            🌅 Sunset
          </button>
          <button
            className="preset-btn"
            onClick={() => {
              setTopColor('#0080FF'); // Electric Blue
              setBottomColor('#40E0D0'); // Turquoise
              setOpacity(0.18);
            }}
          >
            🌊 Ocean
          </button>
          <button
            className="preset-btn"
            onClick={() => {
              setTopColor('#FF00FF'); // Magenta
              setBottomColor('#FF1493'); // Hot Pink
              setOpacity(0.15);
            }}
          >
            🌸 Bloom
          </button>
          <button
            className="preset-btn"
            onClick={() => {
              setTopColor('#006400'); // Dark Green
              setBottomColor('#808000'); // Olive
              setOpacity(0.25);
            }}
          >
            🌲 Forest
          </button>
          <button
            className="preset-btn"
            onClick={() => {
              setTopColor('#DC143C'); // Fire Red
              setBottomColor('#FFD700'); // Gold
              setOpacity(0.12);
            }}
          >
            🔥 Fire
          </button>
          <button
            className="preset-btn"
            onClick={() => {
              setTopColor('#000080'); // Navy
              setBottomColor('#32CD32'); // Lime Green
              setOpacity(0.22);
            }}
          >
            🌌 Electric
          </button>
        </div>
      </div>

      <style jsx>{`
        .interactive-palette-demo {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .demo-header h3 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #FF6B35, #5856D6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .demo-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .controls-section {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--surface);
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .fade-selector {
          display: flex;
          gap: 1rem;
        }

        .fade-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid transparent;
          border-radius: 12px;
          background: var(--surface-subtle);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 200ms ease;
          font-weight: 600;
        }

        .fade-tab.active {
          border-color: var(--primary);
          background: rgba(0, 122, 255, 0.1);
          color: var(--primary);
        }

        .fade-tab:hover {
          transform: translateY(-2px);
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        .color-preview {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        .opacity-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding: 1rem;
          background: var(--surface-subtle);
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
        }

        .opacity-control label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .opacity-slider {
          width: 120px;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(to right, transparent, var(--text-primary));
          outline: none;
          cursor: pointer;
        }

        .color-palettes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .palette-section {
          background: var(--surface);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid var(--border);
          transition: all 200ms ease;
        }

        .palette-section:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .palette-title {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 0.5rem;
        }

        .color-swatch {
          aspect-ratio: 1;
          border: 3px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 200ms ease;
          position: relative;
          overflow: hidden;
          font-size: 0;
        }

        .color-swatch:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .color-swatch.selected {
          border-color: var(--text-primary);
          transform: scale(1.05);
          box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--primary);
        }

        .demo-preview {
          margin-bottom: 2rem;
        }

        .demo-preview h4 {
          margin-bottom: 1rem;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .scroll-content {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }

        .scroll-content::-webkit-scrollbar {
          width: 8px;
        }

        .scroll-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .scroll-content::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .colored-fade-container {
          position: relative;
        }

        .content-inner {
          padding: 1.5rem;
        }

        .fade-overlay {
          position: fixed;
          height: 50px;
          pointer-events: none;
          z-index: 10;
          transition: opacity 300ms ease-out;
          overflow: hidden;
        }

        .fade-top {
          /* Border radius set dynamically to match container */
        }

        .fade-bottom {
          /* Border radius set dynamically to match container */
        }

        .content-item {
          margin-bottom: 1rem;
          padding: 1.5rem;
          background: rgba(248, 249, 250, 0.95);
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: transform 200ms ease;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .content-item:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .content-item.header {
          background: rgba(248, 249, 250, 0.9);
          border-left: 4px solid var(--primary);
        }

        .content-item.media {
          background: rgba(255, 243, 224, 0.9);
        }

        .content-item.action {
          background: rgba(243, 229, 245, 0.9);
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .item-number {
          width: 32px;
          height: 32px;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .item-header h5 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .content-item p {
          margin: 0 0 0.5rem 0;
          color: #4a5568;
          line-height: 1.6;
        }

        .item-meta {
          font-size: 0.8rem;
          color: #718096;
          font-style: italic;
        }

        .state-debug {
          background: var(--surface);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border);
        }

        .state-debug h4 {
          margin-bottom: 1rem;
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

        .preset-section {
          text-align: center;
        }

        .preset-section h4 {
          margin-bottom: 1rem;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .preset-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .preset-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          color: var(--text-primary);
          font-weight: 600;
          cursor: pointer;
          transition: all 200ms ease;
        }

        .preset-btn:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          background: rgba(0, 122, 255, 0.1);
          color: var(--primary);
        }

        @media (max-width: 768px) {
          .controls-section {
            flex-direction: column;
            gap: 1rem;
          }

          .fade-selector {
            width: 100%;
            justify-content: center;
          }

          .color-palettes {
            grid-template-columns: 1fr;
          }

          .preset-buttons {
            flex-direction: column;
            align-items: center;
          }

          .preset-btn {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
}

export default InteractivePaletteDemo;