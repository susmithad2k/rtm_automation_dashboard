import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { ErrorProvider } from './contexts/ErrorContext';

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <AppRoutes />
          </div>
        </Router>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;