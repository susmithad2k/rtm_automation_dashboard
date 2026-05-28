import { useState, useEffect, useMemo } from 'react';
import reportService from '../../services/reportService';
import DataTable from '../../components/ui/DataTable';
import TableStats from '../../components/ui/TableStats';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import Badge from '../../components/ui/Badge';

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
      // Refresh report list so UI shows the newly generated report
      await handleGetReportList();
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
      // If response contains reports, sync to reportData so DataTable displays them
      if (response && response.reports) {
        setReportData(prev => ({ ...(prev || {}), reports: response.reports }));
      }
      setMessage('Report list loaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    const reportId = data?.reportId || data?.report?.id || data?.id;
    if (!reportId) {
      setMessage('Error: Please generate a report first');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await reportService.exportReport(reportId, 'pdf');
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

  const handleDownloadReport = () => {
    const dataToDownload = reportData || data;
    
    if (!dataToDownload) {
      setMessage('Error: No report data available to download');
      return;
    }

    try {
      // Create a blob with the JSON data
      const jsonString = JSON.stringify(dataToDownload, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `report-${reportType}-${timestamp}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setMessage('Report downloaded successfully!');
    } catch (error) {
      setMessage(`Error downloading report: ${error.message}`);
    }
  };

  // Auto-fetch report data on component mount
  useEffect(() => {
    handleFetchReportData();
  }, []);

  const columns = useMemo(() => [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Type', accessor: 'type', sortable: true },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => {
        const variant = value === 'completed' ? 'success' : value === 'pending' ? 'warning' : 'default';
        return <Badge variant={variant} pill size="sm">{value}</Badge>;
      }
    },
    { header: 'Date', accessor: 'date', sortable: true },
  ], []);

  const stats = reportData?.summary ? [
    { label: 'Requirements', value: reportData.summary.totalRequirements || 0, color: 'blue' },
    { label: 'Tests', value: reportData.summary.totalTests || 0, color: 'green' },
    { label: 'Coverage', value: `${reportData.summary.coverage ?? 0}%`, color: 'purple' },
    { label: 'Pass Rate', value: `${reportData.summary.passRate ?? 0}%`, color: 'green' },
  ] : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {loading && <LoadingOverlay message="Working on report data..." />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <aside className="lg:col-span-1 bg-white p-4 rounded shadow sticky top-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Report Type</label>
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

          <div className="flex flex-col gap-3">
            <button onClick={handleGenerateReport} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-3 rounded disabled:opacity-50">{loading ? 'Generating...' : 'Generate'}</button>
            <button onClick={handleFetchReportData} disabled={loading} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-3 rounded">Refresh Data</button>
            <button onClick={handleGetReportList} disabled={loading} className="w-full bg-green-600 hover:bg-green-800 text-white py-2 px-3 rounded">Report List</button>
            <button onClick={handleExportReport} disabled={loading || !data?.reportId} className="w-full bg-purple-600 hover:bg-purple-800 text-white py-2 px-3 rounded">Export PDF</button>
            <button onClick={handleGetTemplates} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-3 rounded">Templates</button>
            <button onClick={handleDownloadReport} disabled={!reportData && !data} className="w-full bg-orange-600 hover:bg-orange-800 text-white py-2 px-3 rounded">Download</button>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}
        </aside>

        {/* Content area */}
        <main className="lg:col-span-3">
          {/* Summary stats */}
          {stats.length > 0 && (
            <div className="mb-4">
              <TableStats stats={stats} />
            </div>
          )}

          {/* Reports table */}
          <div className="mb-6">
            {reportData?.reports && Array.isArray(reportData.reports) && reportData.reports.length > 0 ? (
              <DataTable data={reportData.reports} columns={columns} itemsPerPage={10} />
            ) : (
              <div className="bg-white p-6 rounded shadow text-center text-gray-500">No reports available</div>
            )}
          </div>

          {/* Risk summary */}
          <div className="bg-white p-6 rounded shadow">
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

          {/* Generated report data fallback */}
          {data && (
            <div className="mt-6 bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Generated Report Data</h2>
              <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-64">{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Reports;