import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import LoadingOverlay from '../components/ui/LoadingOverlay';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalMessage, setGlobalMessage] = useState('Loading...');

  const startLoading = useCallback((key = 'global', message = 'Loading...') => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
    if (key === 'global' || Object.keys(loadingStates).length === 0) {
      setGlobalMessage(message);
    }
  }, [loadingStates]);

  const stopLoading = useCallback((key = 'global') => {
    setLoadingStates((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const stopAllLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  const isLoading = useCallback((key) => {
    if (key) {
      return !!loadingStates[key];
    }
    return Object.keys(loadingStates).length > 0;
  }, [loadingStates]);

  const value = useMemo(
    () => ({
      startLoading,
      stopLoading,
      stopAllLoading,
      isLoading,
      setMessage: setGlobalMessage,
    }),
    [startLoading, stopLoading, stopAllLoading, isLoading]
  );

  const showGlobalLoader = Object.keys(loadingStates).length > 0;

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {showGlobalLoader && <LoadingOverlay message={globalMessage} />}
    </LoadingContext.Provider>
  );
};
