import React from 'react';
import Hero from './components/Hero';
import ScrollExample from './components/ScrollExample';
import CodeExample from './components/CodeExample';
import Footer from './components/Footer';
import ScrollIndicator from './components/ScrollIndicator';
import BackToTop from './components/BackToTop';
import { ScrollHijackProvider } from './contexts/ScrollHijackContext';
import './App.css';

const examples = [
  {
    id: 'basic',
    title: 'Basic Scroll Fade',
    description: 'Simple implementation with default fade effects on top and bottom edges',
    content: Array.from({ length: 50 }, (_, i) => `Item ${i + 1}: This is a scrollable item with fade effects`),
    height: '400px',
    type: 'vertical'
  },
  {
    id: 'palette',
    title: 'Interactive Color Palette',
    description: 'Choose from beautiful color combinations for top and bottom fades. Perfect for matching your brand colors with real-time preview.',
    content: [], // This will use the InteractivePaletteDemo component
    height: 'auto',
    type: 'palette'
  },
  {
    id: 'slideshow',
    title: 'Vertical Slideshow',
    description: 'Image slideshow with vertical scrolling and fade indicators showing more slides above/below',
    content: [
      { type: 'image', title: 'Mountain Landscape', description: 'Beautiful mountain scenery with snow-capped peaks' },
      { type: 'image', title: 'Ocean Sunset', description: 'Stunning sunset over calm ocean waters' },
      { type: 'image', title: 'Forest Trail', description: 'Peaceful hiking trail through dense forest' },
      { type: 'image', title: 'Desert Dunes', description: 'Golden sand dunes in the morning light' },
      { type: 'image', title: 'City Skyline', description: 'Modern city skyline at twilight' },
      { type: 'image', title: 'Waterfall', description: 'Majestic waterfall cascading down rocky cliffs' },
      { type: 'image', title: 'Snow Mountains', description: 'Alpine peaks covered in fresh snow' },
      { type: 'image', title: 'Tropical Beach', description: 'Paradise beach with crystal clear waters' }
    ],
    height: '500px',
    type: 'slideshow'
  },
  {
    id: 'content',
    title: 'Rich Content',
    description: 'Fade effects with diverse content types including text, headings, and structured data',
    content: [
      'Heading: Beautiful Typography',
      'Paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'List Item: • Feature one with detailed description',
      'List Item: • Feature two with extended functionality',
      'Quote: "Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs',
      'Data: Performance metrics show 98% user satisfaction',
      'Conclusion: Seamless integration with any React application'
    ].concat(Array.from({ length: 30 }, (_, i) => `Additional content line ${i + 1}`)),
    height: '500px',
    type: 'vertical'
  },
  {
    id: 'horizontal',
    title: 'Horizontal Gallery',
    description: 'Horizontal scrolling gallery with left/right fade indicators',
    content: Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Gallery Item ${i + 1}`,
      description: `This is gallery item number ${i + 1} with horizontal scrolling`
    })),
    height: '300px',
    type: 'horizontal'
  },
  {
    id: 'combined',
    title: 'Combined Scroll Grid',
    description: 'Both vertical and horizontal scrolling with fade indicators on all four edges',
    content: Array.from({ length: 150 }, (_, i) => ({
      id: i + 1,
      row: Math.floor(i / 15) + 1,
      col: (i % 15) + 1,
      title: `Cell ${Math.floor(i / 15) + 1}-${(i % 15) + 1}`
    })),
    height: '400px',
    type: 'combined'
  },
  {
    id: 'compact',
    title: 'Compact View',
    description: 'Subtle fade effects in smaller containers for dashboard-style layouts',
    content: Array.from({ length: 25 }, (_, i) => `Compact item ${i + 1}`),
    height: '300px',
    type: 'vertical'
  }
];

function App() {
  return (
    <ScrollHijackProvider>
      <div className="app">
        <ScrollIndicator />
        <Hero />
        
        <section className="examples-section">
          <div className="container">
            <header className="section-header">
              <h2>Experience the Magic</h2>
              <p>Scroll through these examples to see use-scroll-fades in action</p>
            </header>
            
            {examples.map((example, index) => (
              <ScrollExample 
                key={example.id}
                example={example}
                reverse={index % 2 === 1}
              />
            ))}
          </div>
        </section>

        <CodeExample />
        <Footer />
        <BackToTop />
      </div>
    </ScrollHijackProvider>
  );
}

export default App;
