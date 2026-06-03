import { useState } from 'react';
import { useError } from '../contexts/ErrorContext';
import { Alert } from '../components/ui';
import { useApi } from '../hooks/useApi';
import reportService from '../services/reportService';

/**
 * Example component demonstrating different error handling approaches
 */
function ErrorHandlingExample() {
  const { showError, showSuccess, showWarning, showInfo } = useError();
  const [localError, setLocalError] = useState(null);

  // Example 1: Using useApi hook with automatic error handling
  const {
    data: reports,
    loading: loadingReports,
    error: reportsError,
    execute: fetchReports,
  } = useApi(reportService.getReportList);

  // Example 2: Using useApi with custom callbacks
  const {
    loading: generatingReport,
    execute: generateReport,
  } = useApi(reportService.generateReport, {
    showErrorToast: true, // Show error toast (default)
    onSuccess: (data) => {
      showSuccess('Report generated successfully!');
      console.log('Report data:', data);
    },
    onError: (error) => {
      console.error('Report generation failed:', error);
    },
  });

  // Example 3: Manual error handling with toast
  const handleManualApiCall = async () => {
    try {
      const data = await reportService.getReportTemplates();
      showSuccess('Templates loaded successfully!');
      console.log(data);
    } catch (error) {
      showError(error);
    }
  };

  // Example 4: Using different toast types
  const demonstrateToasts = () => {
    showError('This is an error message');
    setTimeout(() => showWarning('This is a warning message'), 500);
    setTimeout(() => showInfo('This is an info message'), 1000);
    setTimeout(() => showSuccess('This is a success message'), 1500);
  };

  // Example 5: Setting local error state for inline alerts
  const handleLocalError = async () => {
    setLocalError(null);
    try {
      // Simulate API call that fails
      throw new Error('Failed to process data. Please check your input and try again.');
    } catch (error) {
      setLocalError(error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Error Handling Examples</h1>

      {/* Local Error Alert */}
      {localError && (
        <Alert
          message={localError}
          type="error"
          onClose={() => setLocalError(null)}
          className="mb-6"
        />
      )}

      {/* Example 1: useApi with automatic error handling */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Example 1: useApi Hook with Auto Error Toast</h2>
        <p className="text-gray-600 mb-4">
          Errors are automatically shown as toast notifications. The error state is also available locally.
        </p>
        <button
          onClick={fetchReports}
          disabled={loadingReports}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loadingReports ? 'Loading...' : 'Fetch Reports'}
        </button>
        {reportsError && (
          <Alert message={reportsError} type="error" className="mt-4" />
        )}
      </div>

      {/* Example 2: useApi with custom callbacks */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Example 2: useApi with Custom Callbacks</h2>
        <p className="text-gray-600 mb-4">
          Custom success and error handlers while still showing toast notifications.
        </p>
        <button
          onClick={() => generateReport('monthly', { startDate: '2026-05-01' })}
          disabled={generatingReport}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {generatingReport ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Example 3: Manual error handling */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Example 3: Manual Error Handling</h2>
        <p className="text-gray-600 mb-4">
          Use the error context directly for manual API calls.
        </p>
        <button
          onClick={handleManualApiCall}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Load Templates
        </button>
      </div>

      {/* Example 4: Different toast types */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Example 4: Toast Notification Types</h2>
        <p className="text-gray-600 mb-4">
          Demonstrate different toast notification types.
        </p>
        <button
          onClick={demonstrateToasts}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Show All Toast Types
        </button>
      </div>

      {/* Example 5: Inline error alerts */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Example 5: Inline Error Alerts</h2>
        <p className="text-gray-600 mb-4">
          Use inline alerts for form validation or contextual errors.
        </p>
        <button
          onClick={handleLocalError}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Trigger Local Error
        </button>
      </div>

      {/* Alert Component Showcase */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Alert Component Examples</h2>
        <div className="space-y-4">
          <Alert message="This is an error alert" type="error" />
          <Alert message="This is a success alert" type="success" />
          <Alert message="This is a warning alert" type="warning" />
          <Alert message="This is an info alert" type="info" />
        </div>
      </div>
    </div>
  );
}

export default ErrorHandlingExample;
