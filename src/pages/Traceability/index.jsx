import { useState, useEffect, useMemo } from 'react';
import traceService from '../../services/traceService';
import { Spinner, DataTable, TableStats, Badge } from '../../components/ui';

// Placeholder data for traceability matrix
const placeholderMatrix = [
  {
    id: 'REQ-001',
    requirement: 'User Authentication',
    description: 'System shall support user login with email and password',
    priority: 'High',
    testCases: ['TC-001', 'TC-002', 'TC-003'],
    coverage: '100%',
    status: 'Verified',
  },
  {
    id: 'REQ-002',
    requirement: 'Data Validation',
    description: 'System shall validate all input fields before submission',
    priority: 'High',
    testCases: ['TC-004', 'TC-005'],
    coverage: '100%',
    status: 'Verified',
  },
  {
    id: 'REQ-003',
    requirement: 'Report Generation',
    description: 'Users shall be able to export reports in PDF and Excel formats',
    priority: 'Medium',
    testCases: ['TC-006', 'TC-007', 'TC-008', 'TC-009'],
    coverage: '100%',
    status: 'Verified',
  },
  {
    id: 'REQ-004',
    requirement: 'Dashboard Analytics',
    description: 'Dashboard shall display real-time analytics and metrics',
    priority: 'Medium',
    testCases: ['TC-010', 'TC-011'],
    coverage: '67%',
    status: 'In Progress',
  },
  {
    id: 'REQ-005',
    requirement: 'API Integration',
    description: 'System shall integrate with external APIs for data sync',
    priority: 'Low',
    testCases: ['TC-012'],
    coverage: '50%',
    status: 'Pending',
  },
  {
    id: 'REQ-006',
    requirement: 'Email Notifications',
    description: 'System shall send email notifications for important events',
    priority: 'Medium',
    testCases: ['TC-013', 'TC-014', 'TC-015'],
    coverage: '100%',
    status: 'Verified',
  },
  {
    id: 'REQ-007',
    requirement: 'Role-based Access',
    description: 'System shall implement role-based access control (RBAC)',
    priority: 'High',
    testCases: ['TC-016', 'TC-017'],
    coverage: '100%',
    status: 'Verified',
  },
  {
    id: 'REQ-008',
    requirement: 'Data Backup',
    description: 'System shall perform automated daily backups',
    priority: 'High',
    testCases: [],
    coverage: '0%',
    status: 'Not Started',
  },
];

function Traceability() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(placeholderMatrix);
  const [viewMode, setViewMode] = useState('matrix'); // matrix, requirements, testcases, coverage
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load initial data from API
  useEffect(() => {
    const loadTraceData = async () => {
      setLoading(true);
      try {
        const response = await traceService.getTrace();
        // API returns { success, data, total, timestamp }
        if (response?.data && Array.isArray(response.data)) {
          setData(response.data);
          setMessage('Traceability data loaded successfully!');
        } else {
          console.warn('Unexpected API response structure:', response);
          setData(placeholderMatrix);
        }
      } catch (error) {
        console.log('Using placeholder data:', error.message);
        setData(placeholderMatrix);
      } finally {
        setLoading(false);
      }
    };

    loadTraceData();
  }, []);

  // Filter data based on search and filters
  const filteredData = data.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleGetMatrix = async () => {
    setLoading(true);
    setMessage('');
    setViewMode('matrix');
    try {
      const response = await traceService.getTraceabilityMatrix();
      // API returns { success, data, total, timestamp }
      if (response?.data && Array.isArray(response.data)) {
        setData(response.data);
        setMessage(`Traceability matrix loaded successfully! (${response.data.length} requirements)`);
      } else {
        console.warn('Unexpected API response structure:', response);
        setData(placeholderMatrix);
        setMessage('Loaded placeholder data - API response was unexpected');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.log('Using placeholder data');
      setData(placeholderMatrix);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRequirements = async () => {
    setLoading(true);
    setMessage('');
    setViewMode('requirements');
    try {
      const response = await traceService.getRequirements();
      // API returns { success, data, requirements, total, timestamp }
      if (response?.data && Array.isArray(response.data)) {
        setData(response.data);
        setMessage(`Requirements loaded successfully! (${response.data.length} items)`);
      } else {
        console.warn('Unexpected API response structure:', response);
        setData(placeholderMatrix);
        setMessage('Loaded placeholder data - API response was unexpected');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.log('Using placeholder data');
      setData(placeholderMatrix);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTestCases = async () => {
    setLoading(true);
    setMessage('');
    setViewMode('testcases');
    try {
      const response = await traceService.getTestCases();
      // API returns { success, data, total, timestamp }
      if (response?.data && Array.isArray(response.data)) {
        setData(response.data);
        setMessage(`Test cases loaded successfully! (${response.data.length} items)`);
      } else {
        console.warn('Unexpected API response structure:', response);
        setData(placeholderMatrix);
        setMessage('Loaded placeholder data - API response was unexpected');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.log('Using placeholder data');
      setData(placeholderMatrix);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCoverage = async () => {
    setLoading(true);
    setMessage('');
    setViewMode('coverage');
    try {
      const response = await traceService.getCoverageReport();
      // API returns { success, data, summary, timestamp }
      if (response?.data && Array.isArray(response.data)) {
        setData(response.data);
        const summaryMsg = response.summary 
          ? `Coverage: ${response.summary.overallCoverage} (${response.summary.verifiedRequirements}/${response.summary.totalRequirements} verified)`
          : `${response.data.length} items`;
        setMessage(`Coverage report generated successfully! ${summaryMsg}`);
      } else {
        console.warn('Unexpected API response structure:', response);
        setData(placeholderMatrix);
        setMessage('Loaded placeholder data - API response was unexpected');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.log('Using placeholder data');
      setData(placeholderMatrix);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'orange';
      case 'Not Started': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getCoverageColor = (coverage) => {
    const value = parseInt(coverage);
    if (value >= 80) return 'text-green-600 font-semibold';
    if (value >= 50) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  // Define table columns
  const columns = useMemo(() => [
    {
      header: 'Req ID',
      accessor: 'id',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-blue-600">{value}</span>
      ),
    },
    {
      header: 'Requirement',
      accessor: 'requirement',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      sortable: true,
      cellClassName: 'max-w-md',
      render: (value) => (
        <span className="text-gray-600">{value}</span>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority',
      sortable: true,
      render: (value) => (
        <Badge variant={getPriorityColor(value)} size="sm">
          {value}
        </Badge>
      ),
    },
    {
      header: 'Test Cases',
      accessor: 'testCases',
      sortable: false,
      render: (testCases) => (
        testCases && testCases.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {testCases.map((tc, idx) => (
              <Badge key={idx} variant="info" size="sm">
                {tc}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 italic text-xs">No test cases</span>
        )
      ),
    },
    {
      header: 'Coverage',
      accessor: 'coverage',
      sortable: true,
      render: (value) => (
        <span className={getCoverageColor(value)}>{value}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <Badge variant={getStatusColor(value)} size="sm" pill>
          {value}
        </Badge>
      ),
    },
  ], []);

  // Calculate statistics
  const tableStats = useMemo(() => [
    {
      label: 'Total',
      value: data.length,
      color: 'gray',
    },
    {
      label: 'Verified',
      value: data.filter(d => d.status === 'Verified').length,
      color: 'green',
    },
    {
      label: 'In Progress',
      value: data.filter(d => d.status === 'In Progress').length,
      color: 'yellow',
    },
    {
      label: 'Pending',
      value: data.filter(d => d.status === 'Pending').length,
      color: 'orange',
    },
    {
      label: 'Not Started',
      value: data.filter(d => d.status === 'Not Started').length,
      color: 'gray',
    },
  ], [data]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterPriority('all');
    setFilterStatus('all');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || filterPriority !== 'all' || filterStatus !== 'all';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Traceability Management</h1>
      
      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button 
          onClick={handleGetMatrix}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loading && viewMode === 'matrix' && <Spinner size="sm" color="white" />}
          Get Traceability Matrix
        </button>
        
        <button 
          onClick={handleGetRequirements}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loading && viewMode === 'requirements' && <Spinner size="sm" color="white" />}
          Get Requirements
        </button>
        
        <button 
          onClick={handleGetTestCases}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loading && viewMode === 'testcases' && <Spinner size="sm" color="white" />}
          Get Test Cases
        </button>

        <button 
          onClick={handleGetCoverage}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {loading && viewMode === 'coverage' && <Spinner size="sm" color="white" />}
          Get Coverage Report
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Filters Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filteredData.length}</span> of <span className="font-semibold">{data.length}</span> requirements
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by ID, requirement, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
        </div>
      </div>

      {/* Traceability Matrix Table */}
      <DataTable
        data={filteredData}
        columns={columns}
        itemsPerPage={10}
        showPagination={true}
        emptyMessage="No traceability data found. Try adjusting your filters."
        hoverable={true}
        striped={true}
      />

      {/* Table Stats */}
      {data.length > 0 && <TableStats stats={tableStats} />}
    </div>
  );
}