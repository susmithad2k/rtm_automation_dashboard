import { useState, useEffect } from 'react';
import traceService from '../../services/traceService';
import impactService from '../../services/impactService';
import ingestionService from '../../services/ingestionService';
import { 
  CoverageChart, 
  TrendChart, 
  ImpactChart, 
  TestStatusChart,
  TraceabilityGraph 
} from '../../components/charts';

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    coverage: null,
    impactSummary: null,
    ingestionStatus: null,
  });

  // Sample graph data with nodes and edges
  const [graphData, setGraphData] = useState({
    nodes: [
      { id: 'REQ-001', name: 'User Authentication', group: 'requirement', val: 25 },
      { id: 'REQ-002', name: 'Data Validation', group: 'requirement', val: 25 },
      { id: 'REQ-003', name: 'Report Generation', group: 'requirement', val: 25 },
      { id: 'REQ-004', name: 'Dashboard Display', group: 'requirement', val: 25 },
      { id: 'TC-001', name: 'Test Login Flow', group: 'test', val: 18 },
      { id: 'TC-002', name: 'Test Invalid Credentials', group: 'test', val: 18 },
      { id: 'TC-003', name: 'Test Data Format', group: 'test', val: 18 },
      { id: 'TC-004', name: 'Test Report Export', group: 'test', val: 18 },
      { id: 'TC-005', name: 'Test PDF Generation', group: 'test', val: 18 },
      { id: 'TC-006', name: 'Test Chart Rendering', group: 'test', val: 18 },
      { id: 'DEF-001', name: 'Login Bug', group: 'defect', val: 12 },
      { id: 'DEF-002', name: 'Report Format Issue', group: 'defect', val: 12 },
      { id: 'DEF-003', name: 'Chart Alignment', group: 'defect', val: 12 },
    ],
    links: [
      { source: 'REQ-001', target: 'TC-001', value: 1 },
      { source: 'REQ-001', target: 'TC-002', value: 1 },
      { source: 'REQ-002', target: 'TC-003', value: 1 },
      { source: 'REQ-003', target: 'TC-004', value: 1 },
      { source: 'REQ-003', target: 'TC-005', value: 1 },
      { source: 'REQ-004', target: 'TC-006', value: 1 },
      { source: 'TC-001', target: 'DEF-001', value: 1 },
      { source: 'TC-004', target: 'DEF-002', value: 1 },
      { source: 'TC-005', target: 'DEF-002', value: 1 },
      { source: 'TC-006', target: 'DEF-003', value: 1 },
    ],
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
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-blue-600">
                  {dashboardData.coverage.percentage || 'N/A'}%
                </p>
                <p className="text-sm text-gray-600">Coverage</p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${dashboardData.coverage.percentage || 0}%` }}
                ></div>
              </div>

              {/* Coverage Details */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Total Requirements</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {dashboardData.coverage.totalRequirements || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Covered</p>
                  <p className="text-lg font-semibold text-green-600">
                    {dashboardData.coverage.coveredRequirements || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uncovered</p>
                  <p className="text-lg font-semibold text-red-600">
                    {dashboardData.coverage.uncoveredRequirements || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Partially Covered</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {dashboardData.coverage.partiallyCovered || 0}
                  </p>
                </div>
              </div>
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

      {/* Detailed Coverage Visualization */}
      {dashboardData.coverage && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Requirements Coverage Analysis</h2>
          <CoverageChart coverageData={dashboardData.coverage} />
        </div>
      )}

      {/* Traceability Graph Visualization */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <TraceabilityGraph graphData={graphData} />
      </div>

      {/* Additional Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Coverage Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <TrendChart />
        </div>

        {/* Test Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <TestStatusChart />
        </div>

        {/* Impact Analysis Chart - Full Width */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <ImpactChart />
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