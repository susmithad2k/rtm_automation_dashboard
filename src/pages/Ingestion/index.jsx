import { useState } from 'react';
import ingestionService from '../../services/ingestionService';
import { Spinner, Alert } from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { useError } from '../../contexts/ErrorContext';

function Ingestion() {
  const [data, setData] = useState(null);
  const { showSuccess } = useError();

  // Using useApi hook for automatic error handling
  const { 
    loading: loadingTestCases, 
    error: testCasesError,
    execute: loadTestCases 
  } = useApi(ingestionService.loadTestCases, {
    onSuccess: (response) => {
      setData(response);
      showSuccess('Test cases loaded successfully!');
    }
  });

  const { 
    loading: loadingJira, 
    error: jiraError,
    execute: ingestJira 
  } = useApi(ingestionService.ingestJira, {
    onSuccess: (response) => {
      setData(response);
      showSuccess('Jira data ingested successfully!');
    }
  });

  const { 
    loading: loadingConfluence, 
    error: confluenceError,
    execute: ingestConfluence 
  } = useApi(ingestionService.ingestConfluence, {
    onSuccess: (response) => {
      setData(response);
      showSuccess('Confluence data ingested successfully!');
    }
  });

  const { 
    loading: loadingStatus, 
    error: statusError,
    execute: getStatus 
  } = useApi(ingestionService.getIngestionStatus, {
    onSuccess: (response) => {
      setData(response);
      showSuccess('Ingestion status retrieved successfully!');
    }
  });

  const { 
    loading: loadingHistory, 
    error: historyError,
    execute: getHistory 
  } = useApi(ingestionService.getIngestionHistory, {
    onSuccess: (response) => {
      setData(response);
      showSuccess('Ingestion history retrieved successfully!');
    }
  });

  const loading = loadingTestCases || loadingJira || loadingConfluence || loadingStatus || loadingHistory;
  const error = testCasesError || jiraError || confluenceError || statusError || historyError;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Ingestion</h1>
      
      {/* Inline error alert */}
      {error && (
        <Alert 
          message={error} 
          type="error" 
          className="mb-4"
        />
      )}
      
      <div className="mb-4 space-x-4 flex flex-wrap gap-2">
        <button 
          onClick={loadTestCases}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loadingTestCases && <Spinner size="sm" color="white" />}
          {loadingTestCases ? 'Loading...' : 'Load Test Cases'}
        </button>
        
        <button 
          onClick={ingestJira}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loadingJira && <Spinner size="sm" color="white" />}
          {loadingJira ? 'Loading...' : 'Ingest Jira'}
        </button>
        
        <button 
          onClick={ingestConfluence}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loadingConfluence && <Spinner size="sm" color="white" />}
          {loadingConfluence ? 'Loading...' : 'Ingest Confluence'}
        </button>

        <button 
          onClick={getStatus}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loadingStatus && <Spinner size="sm" color="white" />}
          {loadingStatus ? 'Loading...' : 'Get Status'}
        </button>

        <button 
          onClick={getHistory}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loadingHistory && <Spinner size="sm" color="white" />}
          {loadingHistory ? 'Loading...' : 'Get History'}
        </button>
      </div>

      {data && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Ingestion;