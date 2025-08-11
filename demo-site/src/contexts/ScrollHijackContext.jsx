import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ScrollHijackContext = createContext();

export function ScrollHijackProvider({ children }) {
  const [activeContainer, setActiveContainer] = useState(null);
  const containersRef = useRef(new Map());

  const registerContainer = useCallback((id, element, priority) => {
    containersRef.current.set(id, { element, priority });
  }, []);

  const unregisterContainer = useCallback((id) => {
    containersRef.current.delete(id);
    setActiveContainer(prev => prev === id ? null : prev);
  }, []);

  const requestActivation = useCallback((id) => {
    // Only activate if no container is currently active, or if this one has higher priority
    setActiveContainer(prev => {
      if (!prev) return id;
      
      const currentContainer = containersRef.current.get(prev);
      const requestingContainer = containersRef.current.get(id);
      
      if (!currentContainer || !requestingContainer) return id;
      
      // Lower priority value = higher priority (topmost on page)
      return requestingContainer.priority < currentContainer.priority ? id : prev;
    });
  }, []);

  const releaseActivation = useCallback((id) => {
    setActiveContainer(prev => prev === id ? null : prev);
  }, []);

  const isActive = useCallback((id) => {
    return activeContainer === id;
  }, [activeContainer]);

  return (
    <ScrollHijackContext.Provider value={{
      registerContainer,
      unregisterContainer,
      requestActivation,
      releaseActivation,
      isActive
    }}>
      {children}
    </ScrollHijackContext.Provider>
  );
}

export function useScrollHijackContext() {
  const context = useContext(ScrollHijackContext);
  if (!context) {
    throw new Error('useScrollHijackContext must be used within a ScrollHijackProvider');
  }
  return context;
}