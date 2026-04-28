import { useState } from 'react';
import ingestionService from '../../services/ingestionService';

function Ingestion() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleLoadTestCases = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await ingestionService.loadTestCases();
      setData(response);
      setMessage('Test cases loaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestJira = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await ingestionService.ingestJira();
      setData(response);
      setMessage('Jira data ingested successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestConfluence = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await ingestionService.ingestConfluence();
      setData(response);
      setMessage('Confluence data ingested successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStatus = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await ingestionService.getIngestionStatus();
      setData(response);
      setMessage('Ingestion status retrieved successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetHistory = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await ingestionService.getIngestionHistory();
      setData(response);
      setMessage('Ingestion history retrieved successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Ingestion</h1>
      
      <div className="mb-4 space-x-4 flex flex-wrap gap-2">
        <button 
          onClick={handleLoadTestCases}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load Test Cases'}
        </button>
        
        <button 
          onClick={handleIngestJira}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Ingest Jira'}
        </button>
        
        <button 
          onClick={handleIngestConfluence}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Ingest Confluence'}
        </button>

        <button 
          onClick={handleGetStatus}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Status'}
        </button>

        <button 
          onClick={handleGetHistory}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get History'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

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