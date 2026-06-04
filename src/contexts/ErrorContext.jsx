import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import ToastContainer from '../components/ui/ToastContainer';

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

let toastId = 0;

export const ErrorProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'error', duration = 5000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showError = useCallback((error) => {
    const message = error?.message || error?.toString() || 'An unexpected error occurred';
    addToast(message, 'error');
  }, [addToast]);

  const showSuccess = useCallback((message) => {
    addToast(message, 'success');
  }, [addToast]);

  const showWarning = useCallback((message) => {
    addToast(message, 'warning');
  }, [addToast]);

  const showInfo = useCallback((message) => {
    addToast(message, 'info');
  }, [addToast]);

  const value = useMemo(() => ({
    showError,
    showSuccess,
    showWarning,
    showInfo,
  }), [showError, showSuccess, showWarning, showInfo]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ErrorContext.Provider>
  );
};
