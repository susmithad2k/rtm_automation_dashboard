import { useState, useEffect } from 'react';
import reportService from '../../services/reportService';

function Reports() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [reportType, setReportType] = useState('traceability');
  const [reportData, setReportData] = useState(null);

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

  const handleFetchReportData = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await reportService.fetchReportData();
      setReportData(response);
      setMessage('Report data fetched successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch report data on component mount
  useEffect(() => {
    handleFetchReportData();
  }, []);

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
          onClick={handleFetchReportData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Report Data'}
        </button>

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

      {/* Report Data Display */}
      {reportData && (
        <div className="mb-6 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Report API Data</h2>
          
          {/* Display summary statistics if available */}
          {reportData.summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {reportData.summary.totalRequirements && (
                <div className="border rounded p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Requirements</div>
                  <div className="text-2xl font-bold text-blue-600">{reportData.summary.totalRequirements}</div>
                </div>
              )}
              {reportData.summary.totalTests && (
                <div className="border rounded p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Tests</div>
                  <div className="text-2xl font-bold text-green-600">{reportData.summary.totalTests}</div>
                </div>
              )}
              {reportData.summary.coverage !== undefined && (
                <div className="border rounded p-4">
                  <div className="text-sm text-gray-600 mb-1">Coverage</div>
                  <div className="text-2xl font-bold text-purple-600">{reportData.summary.coverage}%</div>
                </div>
              )}
              {reportData.summary.passRate !== undefined && (
                <div className="border rounded p-4">
                  <div className="text-sm text-gray-600 mb-1">Pass Rate</div>
                  <div className="text-2xl font-bold text-green-600">{reportData.summary.passRate}%</div>
                </div>
              )}
            </div>
          )}

          {/* Display report items in a table if available */}
          {reportData.reports && Array.isArray(reportData.reports) && reportData.reports.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.reports.map((report, index) => (
                    <tr key={report.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.type || report.reportType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date || report.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Fallback to JSON display */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Raw Data:</h3>
            <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-96">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Risk Summary Section */}
      <div className="mb-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Risk Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <div className="text-sm text-gray-600 mb-1">High Risk</div>
            <div className="text-2xl font-bold text-red-600">{reportData?.risks?.high || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Critical issues requiring immediate attention</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm text-gray-600 mb-1">Medium Risk</div>
            <div className="text-2xl font-bold text-yellow-600">{reportData?.risks?.medium || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Issues requiring attention soon</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm text-gray-600 mb-1">Low Risk</div>
            <div className="text-2xl font-bold text-green-600">{reportData?.risks?.low || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Minor issues for future consideration</div>
          </div>
        </div>
      </div>

      {data && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Generated Report Data:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Reports;