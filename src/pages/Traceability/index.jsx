import { useState, useEffect } from 'react';
import traceService from '../../services/traceService';
import { Spinner } from '../../components/ui';

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
      // Simulate API call - in production, uncomment the line below
      // const response = await traceService.getTraceabilityMatrix();
      await new Promise(resolve => setTimeout(resolve, 800));
      setData(placeholderMatrix);
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
    setViewMode('requirements');
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setData(placeholderMatrix);
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
    setViewMode('testcases');
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      setData(placeholderMatrix);
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
    setViewMode('coverage');
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      setData(placeholderMatrix);
      setMessage('Coverage report generated successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 font-semibold';
      case 'Medium': return 'text-yellow-600 font-semibold';
      case 'Low': return 'text-green-600 font-semibold';
      default: return 'text-gray-600';
    }
  };

  const getCoverageColor = (coverage) => {
    const value = parseInt(coverage);
    if (value >= 80) return 'text-green-600 font-semibold';
    if (value >= 50) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Req ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requirement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No traceability data found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.requirement}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.testCases.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.testCases.map((tc, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {tc}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No test cases</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getCoverageColor(item.coverage)}>
                        {item.coverage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer with Stats */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-700">
            <div>
              Showing <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{data.length}</span> requirements
            </div>
            <div className="flex gap-6">
              <span>
                Verified: <span className="font-semibold text-green-600">{data.filter(d => d.status === 'Verified').length}</span>
              </span>
              <span>
                In Progress: <span className="font-semibold text-yellow-600">{data.filter(d => d.status === 'In Progress').length}</span>
              </span>
              <span>
                Not Started: <span className="font-semibold text-gray-600">{data.filter(d => d.status === 'Not Started').length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Traceability;