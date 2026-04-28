import { useState } from 'react';
import impactService from '../../services/impactService';

function ImpactAnalysis() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [itemId, setItemId] = useState('');
  const [itemType, setItemType] = useState('requirement');

  const handleAnalyzeImpact = async () => {
    if (!itemId) {
      setMessage('Error: Please enter an item ID');
      return;
    }
    
    setLoading(true);
    setMessage('');
    try {
      const response = await impactService.analyzeImpact(itemId, itemType);
      setData(response);
      setMessage('Impact analysis completed successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetImpactedItems = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await impactService.getImpactedItems();
      setData(response);
      setMessage('Impacted items loaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSummary = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await impactService.getImpactSummary();
      setData(response);
      setMessage('Impact summary loaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Impact Analysis</h1>
      
      <div className="mb-4 bg-white p-4 rounded shadow">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Item ID:</label>
            <input
              type="text"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter requirement or test case ID"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Item Type:</label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="requirement">Requirement</option>
              <option value="testcase">Test Case</option>
            </select>
          </div>
          <button 
            onClick={handleAnalyzeImpact}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Impact'}
          </button>
        </div>
      </div>

      <div className="mb-4 space-x-4">
        <button 
          onClick={handleGetImpactedItems}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Impacted Items'}
        </button>
        
        <button 
          onClick={handleGetSummary}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Impact Summary'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {data && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Analysis Results:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ImpactAnalysis;