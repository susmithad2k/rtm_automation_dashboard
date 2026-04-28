import { useState, useEffect } from 'react';
import traceService from '../../services/traceService';
import impactService from '../../services/impactService';
import ingestionService from '../../services/ingestionService';

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    coverage: null,
    impactSummary: null,
    ingestionStatus: null,
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [coverage, impactSummary, ingestionStatus] = await Promise.all([
        traceService.getCoverageReport().catch(() => null),
        impactService.getImpactSummary().catch(() => null),
        ingestionService.getIngestionStatus().catch(() => null),
      ]);

      setDashboardData({
        coverage,
        impactSummary,
        ingestionStatus,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    loadDashboardData();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">RTM Automation Dashboard</h1>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Dashboard'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coverage Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Coverage Status</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : dashboardData.coverage ? (
            <div className="space-y-2">
              <p className="text-3xl font-bold text-blue-600">
                {dashboardData.coverage.percentage || 'N/A'}%
              </p>
              <p className="text-sm text-gray-600">Requirements Coverage</p>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Impact Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Impact Analysis</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : dashboardData.impactSummary ? (
            <div className="space-y-2">
              <p className="text-3xl font-bold text-orange-600">
                {dashboardData.impactSummary.totalImpacted || 0}
              </p>
              <p className="text-sm text-gray-600">Impacted Items</p>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Ingestion Status Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Ingestion Status</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : dashboardData.ingestionStatus ? (
            <div className="space-y-2">
              <p className="text-3xl font-bold text-green-600">
                {dashboardData.ingestionStatus.status || 'Unknown'}
              </p>
              <p className="text-sm text-gray-600">
                Last Updated: {dashboardData.ingestionStatus.lastUpdated || 'N/A'}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Traceability Matrix
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Run Impact Analysis
          </button>
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Generate Report
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Ingest Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;