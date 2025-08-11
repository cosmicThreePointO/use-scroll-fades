import React from 'react';

function CodeExample() {
  const copyToClipboard = () => {
    const codeText = `import { useScrollFades } from '@gboue/use-scroll-fades';

function MyComponent() {
  const { containerRef, getContainerStyle } = useScrollFades({
    threshold: 8,
    fadeSize: 20,
    transitionDuration: 300
  });

  return (
    <div 
      ref={containerRef}
      style={{
        height: '400px',
        width: '800px', // Much wider to display all code comfortably
        overflow: 'auto',
        ...getContainerStyle()
      }}
    >
      {/* Your scrollable content */}
      <div>Content that scrolls...</div>
      <div>More content...</div>
      <div>Even more content...</div>
    </div>
  );
}`;
    
    navigator.clipboard.writeText(codeText).then(() => {
      // Could add a toast notification here
      console.log('Code copied to clipboard');
    });
  };

  const codeSnippet = `import { useScrollFades } from '@gboue/use-scroll-fades';

function MyComponent() {
  const { containerRef, getContainerStyle } = useScrollFades({
    threshold: 8,
    fadeSize: 20,
    transitionDuration: 300
  });

  return (
    <div 
      ref={containerRef}
      style={{
        height: '400px',
        width: '800px', // Much wider to display all code comfortably
        overflow: 'auto',
        ...getContainerStyle()
      }}
    >
      {/* Your scrollable content */}
      <div>Content that scrolls...</div>
      <div>More content...</div>
      <div>Even more content...</div>
    </div>
  );
}`;

  return (
    <section className="code-section">
      <div className="container">
        <div className="code-content">
          <div className="code-info">
            <h2>Simple Implementation</h2>
            <p>Add scroll fade effects to any container in just a few lines of code</p>
            <div className="code-features">
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <strong>Instant Setup</strong>
                  <span>No configuration required</span>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🎨</div>
                <div className="feature-text">
                  <strong>Customizable</strong>
                  <span>Fully style with CSS</span>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">📱</div>
                <div className="feature-text">
                  <strong>Responsive</strong>
                  <span>Works on all devices</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="code-block">
            <div className="code-header">
              <div className="code-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="code-title">App.jsx</span>
              <button className="copy-button" onClick={copyToClipboard} title="Copy to clipboard">
                📋
              </button>
            </div>
            <pre className="code">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CodeExample;