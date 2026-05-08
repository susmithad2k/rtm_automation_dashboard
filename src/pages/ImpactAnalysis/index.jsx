import { useState, useEffect } from 'react';
import impactService from '../../services/impactService';
import { DataTable, Badge, LoadingOverlay, Spinner } from '../../components/ui';

function ImpactAnalysis() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Analyze Impact State
  const [itemId, setItemId] = useState('');
  const [itemType, setItemType] = useState('requirement');
  const [impactResults, setImpactResults] = useState(null);
  
  // Impacted Items State
  const [impactedItems, setImpactedItems] = useState([]);
  
  // Summary State
  const [summary, setSummary] = useState(null);
  
  // History State
  const [historyItemId, setHistoryItemId] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (activeTab === 'summary') {
      loadImpactSummary();
    }
  }, [activeTab]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleAnalyzeImpact = async () => {
    if (!itemId.trim()) {
      showMessage('Please enter an item ID', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await impactService.analyzeImpact(itemId, itemType);
      setImpactResults(response);
      showMessage('Impact analysis completed successfully!', 'success');
    } catch (error) {
      showMessage(`Error: ${error.message}`, 'error');
      setImpactResults(null);
    } finally {
      setLoading(false);
    }
  };

  const loadImpactedItems = async () => {
    setLoading(true);
    try {
      const response = await impactService.getImpactedItems();
      setImpactedItems(Array.isArray(response) ? response : response.items || []);
      showMessage('Impacted items loaded successfully!', 'success');
    } catch (error) {
      showMessage(`Error: ${error.message}`, 'error');
      setImpactedItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadImpactSummary = async () => {
    setLoading(true);
    try {
      const response = await impactService.getImpactSummary();
      setSummary(response);
    } catch (error) {
      showMessage(`Error: ${error.message}`, 'error');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!historyItemId.trim()) {
      showMessage('Please enter an item ID', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await impactService.getImpactHistory(historyItemId);
      setHistory(Array.isArray(response) ? response : response.history || []);
      showMessage('History loaded successfully!', 'success');
    } catch (error) {
      showMessage(`Error: ${error.message}`, 'error');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const impactedItemsColumns = [
    {
      header: 'Item ID',
      accessor: 'itemId',
      sortable: true,
    },
    {
      header: 'Type',
      accessor: 'itemType',
      sortable: true,
      render: (row) => (
        <Badge variant={row.itemType === 'requirement' ? 'info' : 'purple'} size="sm">
          {row.itemType}
        </Badge>
      ),
    },
    {
      header: 'Impact Level',
      accessor: 'impactLevel',
      sortable: true,
      render: (row) => {
        const variants = {
          high: 'error',
          medium: 'warning',
          low: 'success',
        };
        return (
          <Badge variant={variants[row.impactLevel?.toLowerCase()] || 'default'} size="sm">
            {row.impactLevel || 'N/A'}
          </Badge>
        );
      },
    },
    {
      header: 'Affected Items',
      accessor: 'affectedCount',
      sortable: true,
      render: (row) => <span className="font-semibold">{row.affectedCount || 0}</span>,
    },
    {
      header: 'Last Updated',
      accessor: 'lastUpdated',
      sortable: true,
      render: (row) => (
        <span className="text-gray-600 text-sm">
          {row.lastUpdated ? new Date(row.lastUpdated).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ];

  const historyColumns = [
    {
      header: 'Date',
      accessor: 'date',
      sortable: true,
      render: (row) => (
        <span className="text-sm">
          {row.date ? new Date(row.date).toLocaleString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Change Type',
      accessor: 'changeType',
      sortable: true,
      render: (row) => <Badge variant="info" size="sm">{row.changeType}</Badge>,
    },
    {
      header: 'Impact Level',
      accessor: 'impactLevel',
      sortable: true,
      render: (row) => {
        const variants = {
          high: 'error',
          medium: 'warning',
          low: 'success',
        };
        return (
          <Badge variant={variants[row.impactLevel?.toLowerCase()] || 'default'} size="sm">
            {row.impactLevel || 'N/A'}
          </Badge>
        );
      },
    },
    {
      header: 'Affected Items',
      accessor: 'affectedItemsCount',
      sortable: true,
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.description || 'No description'}</span>
      ),
    },
  ];

  const tabs = [
    { id: 'analyze', label: 'Analyze Impact', icon: '🔍' },
    { id: 'items', label: 'Impacted Items', icon: '📊' },
    { id: 'summary', label: 'Impact Summary', icon: '📈' },
    { id: 'history', label: 'Change History', icon: '📜' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {loading && <LoadingOverlay />}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Impact Analysis</h1>
        <p className="text-gray-600 mt-2">
          Analyze the impact of changes across requirements, test cases, and related artifacts
        </p>
      </div>

      {/* Message Banner */}
      {message.text && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{message.type === 'error' ? '❌' : '✅'}</span>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Analyze Impact Tab */}
        {activeTab === 'analyze' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Analyze Item Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item ID
                  </label>
                  <input
                    type="text"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeImpact()}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="REQ-001"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Type
                  </label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="requirement">Requirement</option>
                    <option value="testcase">Test Case</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAnalyzeImpact}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Impact'}
                  </button>
                </div>
              </div>
            </div>

            {/* Impact Results */}
            {impactResults && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Impact Analysis Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Total Affected Items</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {impactResults.totalAffected || impactResults.affectedItems?.length || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Impact Level</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          impactResults.impactLevel === 'high'
                            ? 'error'
                            : impactResults.impactLevel === 'medium'
                            ? 'warning'
                            : 'success'
                        }
                        size="lg"
                      >
                        {impactResults.impactLevel || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Confidence Score</p>
                    <p className="text-3xl font-bold text-green-600">
                      {impactResults.confidence || impactResults.confidenceScore || 'N/A'}
                    </p>
                  </div>
                </div>

                {impactResults.affectedItems && impactResults.affectedItems.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">Affected Items</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <DataTable
                        data={impactResults.affectedItems}
                        columns={[
                          { header: 'ID', accessor: 'id', sortable: true },
                          { 
                            header: 'Type', 
                            accessor: 'type', 
                            sortable: true,
                            render: (row) => (
                              <Badge variant="info" size="sm">{row.type}</Badge>
                            ),
                          },
                          { header: 'Name', accessor: 'name', sortable: true },
                          { 
                            header: 'Status', 
                            accessor: 'status', 
                            sortable: true,
                            render: (row) => (
                              <Badge 
                                variant={row.status === 'active' ? 'success' : 'default'} 
                                size="sm"
                              >
                                {row.status}
                              </Badge>
                            ),
                          },
                        ]}
                        itemsPerPage={5}
                      />
                    </div>
                  </div>
                )}

                {impactResults.recommendations && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">Recommendations</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-2">
                        {Array.isArray(impactResults.recommendations) ? (
                          impactResults.recommendations.map((rec, index) => (
                            <li key={index} className="text-gray-700">{rec}</li>
                          ))
                        ) : (
                          <li className="text-gray-700">{impactResults.recommendations}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Impacted Items Tab */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">All Impacted Items</h2>
                <button
                  onClick={loadImpactedItems}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Loading...' : 'Refresh Items'}
                </button>
              </div>

              {impactedItems.length > 0 ? (
                <DataTable
                  data={impactedItems}
                  columns={impactedItemsColumns}
                  itemsPerPage={10}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No impacted items found</p>
                  <p className="text-sm mt-2">Click "Refresh Items" to load data</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {summary ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-2">Total Changes</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {summary.totalChanges || 0}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-2">High Impact</p>
                    <p className="text-3xl font-bold text-red-600">
                      {summary.highImpact || summary.highImpactCount || 0}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-2">Medium Impact</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {summary.mediumImpact || summary.mediumImpactCount || 0}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-2">Low Impact</p>
                    <p className="text-3xl font-bold text-green-600">
                      {summary.lowImpact || summary.lowImpactCount || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Impact Distribution</h3>
                  <div className="space-y-4">
                    {['high', 'medium', 'low'].map((level) => {
                      const count = summary[`${level}Impact`] || summary[`${level}ImpactCount`] || 0;
                      const total = summary.totalChanges || 1;
                      const percentage = ((count / total) * 100).toFixed(1);
                      const colors = {
                        high: 'bg-red-500',
                        medium: 'bg-yellow-500',
                        low: 'bg-green-500',
                      };

                      return (
                        <div key={level}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium capitalize">{level} Impact</span>
                            <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${colors[level]} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {summary.recentChanges && summary.recentChanges.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Recent Changes</h3>
                    <div className="space-y-3">
                      {summary.recentChanges.map((change, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{change.itemId || change.id}</span>
                            <Badge
                              variant={
                                change.impactLevel === 'high'
                                  ? 'error'
                                  : change.impactLevel === 'medium'
                                  ? 'warning'
                                  : 'success'
                              }
                              size="sm"
                            >
                              {change.impactLevel}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {change.description || 'No description available'}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {change.date ? new Date(change.date).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : loading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner />
              </div>
            ) : (
              <div className="bg-white p-12 rounded-lg shadow text-center">
                <p className="text-gray-500 text-lg">Loading impact summary...</p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Change History</h2>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item ID
                  </label>
                  <input
                    type="text"
                    value={historyItemId}
                    onChange={(e) => setHistoryItemId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && loadHistory()}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter item ID to view history"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={loadHistory}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load History'}
                  </button>
                </div>
              </div>
            </div>

            {history.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">History Records</h3>
                <DataTable
                  data={history}
                  columns={historyColumns}
                  itemsPerPage={10}
                />
              </div>
            )}

            {!loading && history.length === 0 && historyItemId && (
              <div className="bg-white p-12 rounded-lg shadow text-center">
                <p className="text-gray-500 text-lg">No history found for this item</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImpactAnalysis;