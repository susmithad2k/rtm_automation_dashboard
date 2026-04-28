import { useState } from 'react';
import traceService from '../../services/traceService';

function Traceability() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleGetMatrix = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await traceService.getTraceabilityMatrix();
      setData(response);
      setMessage('Traceability matrix loaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRequirements = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await traceService.getRequirements();
      setData(response);
      setMessage('Requirements loaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTestCases = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await traceService.getTestCases();
      setData(response);
      setMessage('Test cases loaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCoverage = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await traceService.getCoverageReport();
      setData(response);
      setMessage('Coverage report generated successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Traceability Management</h1>
      
      <div className="mb-4 space-x-4 flex flex-wrap gap-2">
        <button 
          onClick={handleGetMatrix}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Traceability Matrix'}
        </button>
        
        <button 
          onClick={handleGetRequirements}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Requirements'}
        </button>
        
        <button 
          onClick={handleGetTestCases}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Test Cases'}
        </button>

        <button 
          onClick={handleGetCoverage}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Coverage Report'}
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

export default Traceability;