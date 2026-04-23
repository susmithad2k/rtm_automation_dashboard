import { useState } from 'react';
import ingestionService from '../../services/ingestionService';

function Ingestion() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoadTestCases = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await ingestionService.loadTestCases();
      setMessage('Test cases loaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Ingestion</h1>
      
      <div className="mb-4">
        <button 
          onClick={handleLoadTestCases}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load Test Cases'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Ingestion;