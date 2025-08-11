import React, { useState, useEffect } from 'react';

function Hero() {
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Handle scroll arrow visibility
      const scrollArrow = document.querySelector('.scroll-indicator-arrow');
      if (scrollArrow) {
        const arrowRect = scrollArrow.getBoundingClientRect();
        const arrowBottom = arrowRect.bottom;
        setShowScrollArrow(arrowBottom > 0);
      }

      // Handle title gradient based on scroll
      const scrollTop = window.pageYOffset;
      const maxScroll = 800; // Scroll distance to complete the effect
      const scrollProgress = Math.min(scrollTop / maxScroll, 1);
      
      // Update CSS custom property
      document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
      
      console.log(`Scroll progress: ${scrollProgress.toFixed(3)}`);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial call
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToExamples = () => {
    const examplesSection = document.querySelector('.examples-section');
    if (examplesSection) {
      examplesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  const openGitHub = () => {
    window.open('https://github.com/cosmicThreePointO/use-scroll-fades', '_blank');
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge animate-fade-up">
          <span>React Hook</span>
        </div>
        <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
          use-scroll-fades
        </h1>
        <p className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Library-agnostic React hook that adds beautiful scroll-fade indicators to any scrollable container
        </p>
        <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <button className="btn-primary" onClick={scrollToExamples}>
            View Examples
          </button>
          <button className="btn-secondary" onClick={openGitHub}>
            <span className="github-icon">⭐</span>
            Star on GitHub
          </button>
        </div>
        <div className="hero-stats animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="stat">
            <span className="stat-value">2KB</span>
            <span className="stat-label">Bundle size</span>
          </div>
          <div className="stat">
            <span className="stat-value">Zero</span>
            <span className="stat-label">Dependencies</span>
          </div>
          <div className="stat">
            <span className="stat-value">TypeScript</span>
            <span className="stat-label">Native support</span>
          </div>
        </div>
        
        <div 
          className={`scroll-indicator-arrow animate-fade-up ${showScrollArrow ? 'visible' : 'hidden'}`} 
          style={{ animationDelay: '0.6s' }}
          onClick={scrollToExamples}
        >
          <div className="scroll-text">Scroll Down</div>
          <div className="futuristic-arrow">
            <div className="arrow-line"></div>
            <div className="arrow-head"></div>
            <div className="arrow-glow"></div>
          </div>
        </div>
      </div>
      
    </section>
  );
}

export default Hero;