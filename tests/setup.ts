import '@testing-library/jest-dom'

// Suppress expected deprecation warnings during tests
const originalConsoleWarn = console.warn
console.warn = (...args) => {
  // Suppress known deprecation warnings during tests
  if (typeof args[0] === 'string' && args[0].includes('getOverlayStyle is deprecated')) {
    return
  }
  // Allow other warnings through
  originalConsoleWarn.apply(console, args)
}

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(callback, 16) // ~60fps
}

global.cancelAnimationFrame = (id: number): void => {
  clearTimeout(id)
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {}
  
  observe() {
    // Mock implementation
  }
  
  unobserve() {
    // Mock implementation
  }
  
  disconnect() {
    // Mock implementation
  }
}

// Mock MutationObserver
global.MutationObserver = class MutationObserver {
  constructor(_callback: MutationCallback) {}
  
  observe() {
    // Mock implementation
  }
  
  disconnect() {
    // Mock implementation
  }
  
  takeRecords(): MutationRecord[] {
    return []
  }
}