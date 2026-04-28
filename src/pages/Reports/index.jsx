import { useState } from 'react';
import reportService from '../../services/reportService';

function Reports() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [reportType, setReportType] = useState('traceability');

  const handleGenerateReport = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await reportService.generateReport(reportType);
      setData(response);
      setMessage('Report generated successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetReportList = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await reportService.getReportList();
      setData(response);
      setMessage('Report list loaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    if (!data?.reportId) {
      setMessage('Error: Please generate a report first');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await reportService.exportReport(data.reportId, 'pdf');
      setMessage('Report exported successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTemplates = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await reportService.getReportTemplates();
      setData(response);
      setMessage('Report templates loaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      
      <div className="mb-4 bg-white p-4 rounded shadow">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Report Type:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="traceability">Traceability Report</option>
              <option value="coverage">Coverage Report</option>
              <option value="impact">Impact Analysis Report</option>
              <option value="summary">Summary Report</option>
            </select>
          </div>
          <button 
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      <div className="mb-4 space-x-4">
        <button 
          onClick={handleGetReportList}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Report List'}
        </button>
        
        <button 
          onClick={handleExportReport}
          disabled={loading || !data?.reportId}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Exporting...' : 'Export to PDF'}
        </button>

        <button 
          onClick={handleGetTemplates}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Templates'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {data && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Report Data:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Reports;