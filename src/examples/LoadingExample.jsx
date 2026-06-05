import React from 'react';
import { useLoading } from '../contexts/LoadingContext';
import { useApi } from '../hooks/useApi';

/**
 * Example component demonstrating global loading indicator usage
 */

// Example 1: Using the loading context directly
export const ManualLoadingExample = () => {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleManualLoading = async () => {
    try {
      // Start global loading with a custom message
      startLoading('manual-task', 'Processing your request...');
      
      // Simulate an async operation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Stop the loading indicator
      stopLoading('manual-task');
      
      alert('Task completed!');
    } catch (error) {
      stopLoading('manual-task');
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manual Loading Control</h2>
      <button
        onClick={handleManualLoading}
        disabled={isLoading('manual-task')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading('manual-task') ? 'Loading...' : 'Start Manual Loading'}
      </button>
    </div>
  );
};

// Example 2: Using useApi with global loading
const mockApiCall = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data });
    }, 2000);
  });
};

export const ApiLoadingExample = () => {
  const { execute, loading } = useApi(mockApiCall, {
    useGlobalLoading: true, // Enable global loading overlay
    loadingMessage: 'Saving your data...', // Custom loading message
    showErrorToast: true,
  });

  const handleSaveData = async () => {
    try {
      await execute({ name: 'Test Data', value: 123 });
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API with Global Loading</h2>
      <button
        onClick={handleSaveData}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Data'}
      </button>
    </div>
  );
};

// Example 3: Multiple concurrent loading states
export const MultipleLoadingExample = () => {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleTask = async (taskName, duration) => {
    const key = `task-${taskName}`;
    try {
      startLoading(key, `Processing ${taskName}...`);
      await new Promise((resolve) => setTimeout(resolve, duration));
      stopLoading(key);
    } catch (error) {
      stopLoading(key);
      console.error(`Error in ${taskName}:`, error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Multiple Loading States</h2>
      <div className="space-x-2">
        <button
          onClick={() => handleTask('Task A', 2000)}
          disabled={isLoading('task-Task A')}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Start Task A
        </button>
        <button
          onClick={() => handleTask('Task B', 3000)}
          disabled={isLoading('task-Task B')}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          Start Task B
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        {isLoading() && <p>Global loading is active</p>}
      </div>
    </div>
  );
};

// Example 4: Page-level loading (useful for data fetching on mount)
export const PageLoadingExample = () => {
  const { execute } = useApi(
    async () => {
      // Simulate fetching page data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ pageData: 'Loaded!' });
        }, 1500);
      });
    },
    {
      useGlobalLoading: true,
      loadingMessage: 'Loading page data...',
    }
  );

  React.useEffect(() => {
    execute();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Page Loading Example</h2>
      <p>This page shows a loading overlay on mount while fetching data.</p>
    </div>
  );
};

export default {
  ManualLoadingExample,
  ApiLoadingExample,
  MultipleLoadingExample,
  PageLoadingExample,
};
