# RTM Automation Dashboard

A comprehensive Requirements Traceability Matrix (RTM) automation dashboard built with React and Vite.

## Features

- 📊 Real-time dashboard with coverage metrics
- 🔍 Traceability analysis and visualization
- 📈 Impact analysis reporting
- 📝 Automated test reporting
- 🔄 Data ingestion management
- ⚠️ Comprehensive error handling with user-friendly notifications

## Error Handling System

The application includes a robust error handling system with multiple UI components for displaying API failures and other errors.

### Components

#### Toast Notifications
Toast notifications appear in the top-right corner and automatically dismiss after 5 seconds.

```jsx
import { useError } from './contexts/ErrorContext';

function MyComponent() {
  const { showError, showSuccess, showWarning, showInfo } = useError();
  
  const handleAction = () => {
    showError('An error occurred');
    showSuccess('Action completed successfully');
    showWarning('Please review this warning');
    showInfo('Here is some information');
  };
}
```

#### Alert Component
Inline alerts for contextual error messages in forms or sections.

```jsx
import { Alert } from './components/ui';

function MyForm() {
  const [error, setError] = useState(null);
  
  return (
    <div>
      {error && (
        <Alert 
          message={error} 
          type="error" 
          onClose={() => setError(null)} 
        />
      )}
    </div>
  );
}
```

#### useApi Hook
Custom hook for API calls with automatic error handling.

```jsx
import { useApi } from './hooks/useApi';
import reportService from './services/reportService';

function ReportsPage() {
  const { data, loading, error, execute } = useApi(reportService.getReportList, {
    showErrorToast: true,  // Show toast on error (default: true)
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error),
  });
  
  return (
    <button onClick={execute} disabled={loading}>
      {loading ? 'Loading...' : 'Load Reports'}
    </button>
  );
}
```

### Usage Patterns

#### Pattern 1: Automatic Error Handling (Recommended)
```jsx
const { execute, loading, error } = useApi(apiFunction);

// Errors automatically shown as toasts
await execute();
```

#### Pattern 2: Manual Error Handling
```jsx
const { showError, showSuccess } = useError();

try {
  const data = await apiService.getData();
  showSuccess('Data loaded successfully');
} catch (error) {
  showError(error);
}
```

#### Pattern 3: Mixed Approach
```jsx
const { execute } = useApi(apiFunction, {
  showErrorToast: true,      // Show toast
  onError: (err) => {         // Also handle locally
    setLocalError(err.message);
  }
});
```

### Alert Types

All components support four alert types:
- `error` (red) - For errors and failures
- `success` (green) - For successful operations
- `warning` (yellow) - For warnings
- `info` (blue) - For informational messages

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Alert.jsx
│   │   ├── Toast.jsx
│   │   ├── ToastContainer.jsx
│   │   └── ...
│   └── charts/          # Chart components
├── contexts/
│   └── ErrorContext.jsx # Global error state management
├── hooks/
│   └── useApi.js        # API hook with error handling
├── pages/               # Page components
├── services/            # API service layer
└── utils/               # Utility functions
```

## Technologies

- React 18
- Vite
- Tailwind CSS
- React Router
- D3.js (for charts)

## Contributing

Please ensure all API calls use the error handling patterns described above to maintain consistent user experience.

## License

MIT
