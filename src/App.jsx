import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { ErrorProvider } from './contexts/ErrorContext';
import { LoadingProvider } from './contexts/LoadingContext';

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <LoadingProvider>
          <Router>
            <div className="min-h-screen bg-gray-100">
              <AppRoutes />
            </div>
          </Router>
        </LoadingProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;