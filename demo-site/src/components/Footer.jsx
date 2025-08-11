import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <h3>use-scroll-fades</h3>
            <p>Beautiful scroll fade indicators for React applications</p>
            <a href="https://www.buymeacoffee.com/m8fzKI3" target="_blank" rel="noopener noreferrer">
              <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=m8fzKI3&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" alt="Buy me a coffee" />
            </a>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Resources</h4>
              <a href="https://github.com/cosmicThreePointO/use-scroll-fades" target="_blank" rel="noopener noreferrer">Documentation</a>
              <a href="https://github.com/cosmicThreePointO/use-scroll-fades?tab=readme-ov-file#real-world-examples" target="_blank" rel="noopener noreferrer">Examples</a>
              <a href="https://www.npmjs.com/package/@gboue/use-scroll-fades?activeTab=readme" target="_blank" rel="noopener noreferrer">API Reference</a>
            </div>
            
            <div className="link-group">
              <h4>Community</h4>
              <a href="https://github.com/cosmicThreePointO/use-scroll-fades" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://github.com/cosmicThreePointO/use-scroll-fades/issues" target="_blank" rel="noopener noreferrer">Issues</a>
              <a href="https://www.linkedin.com/in/germainboue/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 use-scroll-fades. MIT License.</p>
          <div className="footer-badge">
            Made with ❤️ for the React community
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;