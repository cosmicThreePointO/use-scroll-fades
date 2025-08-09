import '@testing-library/jest-dom'

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