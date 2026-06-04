import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';

// Default sample data moved outside component
const DEFAULT_DATA = {
  nodes: [
    { id: 'REQ-001', name: 'User Authentication', group: 'requirement', val: 20 },
    { id: 'REQ-002', name: 'Data Validation', group: 'requirement', val: 20 },
    { id: 'REQ-003', name: 'Report Generation', group: 'requirement', val: 20 },
    { id: 'TC-001', name: 'Test Login Flow', group: 'test', val: 15 },
    { id: 'TC-002', name: 'Test Invalid Data', group: 'test', val: 15 },
    { id: 'TC-003', name: 'Test Report Export', group: 'test', val: 15 },
    { id: 'TC-004', name: 'Test PDF Generation', group: 'test', val: 15 },
    { id: 'DEF-001', name: 'Login Bug', group: 'defect', val: 10 },
    { id: 'DEF-002', name: 'Report Format Issue', group: 'defect', val: 10 },
  ],
  links: [
    { source: 'REQ-001', target: 'TC-001', value: 1 },
    { source: 'REQ-002', target: 'TC-002', value: 1 },
    { source: 'REQ-003', target: 'TC-003', value: 1 },
    { source: 'REQ-003', target: 'TC-004', value: 1 },
    { source: 'TC-001', target: 'DEF-001', value: 1 },
    { source: 'TC-003', target: 'DEF-002', value: 1 },
    { source: 'TC-004', target: 'DEF-002', value: 1 },
  ],
};

// Node color mapping
const NODE_COLORS = {
  requirement: '#3b82f6', // blue
  test: '#10b981', // green
  defect: '#ef4444', // red
  default: '#6b7280', // gray
};

const TraceabilityGraph = memo(function TraceabilityGraph({ graphData }) {
  const graphRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef();

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setDimensions({ width: width, height: 600 });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    // Center the graph on mount
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  }, [graphData]);

  const data = graphData || DEFAULT_DATA;

  // Node color based on group type - memoized
  const getNodeColor = useCallback((node) => {
    return NODE_COLORS[node.group] || NODE_COLORS.default;
  }, []);

  // Memoize metrics calculations
  const metrics = useMemo(() => ({
    totalNodes: data.nodes.length,
    totalConnections: data.links.length,
    requirements: data.nodes.filter(n => n.group === 'requirement').length,
    testCases: data.nodes.filter(n => n.group === 'test').length,
    defects: data.nodes.filter(n => n.group === 'defect').length,
  }), [data]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Traceability Graph</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Requirements</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Tests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Defects</span>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-300 rounded-lg bg-white p-8">
        {/* Simple Network Visualization */}
        <svg width={dimensions.width} height={dimensions.height} className="bg-gray-50">
          {/* Draw links */}
          {data.links.map((link, idx) => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            const sourceNode = data.nodes.find(n => n.id === sourceId);
            const targetNode = data.nodes.find(n => n.id === targetId);
            if (!sourceNode || !targetNode) return null;
            
            const sourceIndex = data.nodes.indexOf(sourceNode);
            const targetIndex = data.nodes.indexOf(targetNode);
            const sourceX = 100 + (sourceIndex % 5) * 150;
            const sourceY = 100 + Math.floor(sourceIndex / 5) * 120;
            const targetX = 100 + (targetIndex % 5) * 150;
            const targetY = 100 + Math.floor(targetIndex / 5) * 120;
            
            return (
              <line
                key={idx}
                x1={sourceX}
                y1={sourceY}
                x2={targetX}
                y2={targetY}
                stroke="#94a3b8"
                strokeWidth="2"
                opacity="0.6"
              />
            );
          })}
          
          {/* Draw nodes */}
          {data.nodes.map((node, idx) => {
            const x = 100 + (idx % 5) * 150;
            const y = 100 + Math.floor(idx / 5) * 120;
            const color = getNodeColor(node);
            
            return (
              <g key={node.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={25}
                  fill={color}
                  stroke="white"
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-semibold fill-white pointer-events-none"
                >
                  {node.id.split('-')[1]}
                </text>
                <text
                  x={x}
                  y={y + 40}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 pointer-events-none"
                  style={{ maxWidth: '100px' }}
                >
                  {node.name && node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Visualization:</strong> Simple network diagram showing relationships between requirements, tests, and defects
        </p>
      </div>

      {/* Detailed Metrics Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Traceability Metrics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Nodes */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Total Nodes</p>
            <p className="text-2xl font-bold text-gray-800">{metrics.totalNodes}</p>
          </div>

          {/* Total Connections */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Connections</p>
            <p className="text-2xl font-bold text-gray-800">{metrics.totalConnections}</p>
          </div>

          {/* Requirements */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Requirements</p>
            <p className="text-2xl font-bold text-blue-600">{metrics.requirements}</p>
          </div>

          {/* Test Cases */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600 mb-1">Test Cases</p>
            <p className="text-2xl font-bold text-green-600">{metrics.testCases}</p>
          </div>

          {/* Defects */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-xs text-gray-600 mb-1">Defects</p>
            <p className="text-2xl font-bold text-red-600">{metrics.defects}</p>
          </div>

          {/* Coverage Ratio */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Test/Req Ratio</p>
            <p className="text-2xl font-bold text-purple-600">
              {metrics.requirements > 0
                ? (metrics.testCases / metrics.requirements).toFixed(2)
                : '0.00'}
            </p>
          </div>

          {/* Defect Rate */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-xs text-gray-600 mb-1">Defect Rate</p>
            <p className="text-2xl font-bold text-orange-600">
              {metrics.testCases > 0
                ? ((metrics.defects / metrics.testCases) * 100).toFixed(1)
                : '0.0'}%
            </p>
          </div>

          {/* Avg Connections */}
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <p className="text-xs text-gray-600 mb-1">Avg Connections</p>
            <p className="text-2xl font-bold text-indigo-600">
              {metrics.totalNodes > 0
                ? ((metrics.totalConnections * 2) / metrics.totalNodes).toFixed(2)
                : '0.00'}
            </p>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Traceability Completeness</span>
              <span className="text-sm font-bold text-blue-600">
                {metrics.requirements > 0
                  ? ((metrics.totalConnections / (metrics.requirements * 2)) * 100).toFixed(0)
                  : '0'}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${metrics.requirements > 0
                    ? Math.min(100, (metrics.totalConnections / (metrics.requirements * 2)) * 100)
                    : 0}%` 
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Test Coverage</span>
              <span className="text-sm font-bold text-green-600">
                {metrics.requirements > 0
                  ? ((metrics.testCases / metrics.requirements) * 100).toFixed(0)
                  : '0'}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${metrics.requirements > 0
                    ? Math.min(100, (metrics.testCases / metrics.requirements) * 100)
                    : 0}%` 
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Quality Score</span>
              <span className="text-sm font-bold text-purple-600">
                {(() => {
                  if (metrics.requirements === 0) return '0';
                  const testCoverage = (metrics.testCases / metrics.requirements) * 40;
                  const traceability = (metrics.totalConnections / (metrics.requirements * 2)) * 40;
                  const qualityPenalty = metrics.testCases > 0 ? (metrics.defects / metrics.testCases) * 20 : 0;
                  return Math.max(0, Math.min(100, testCoverage + traceability - qualityPenalty)).toFixed(0);
                })()}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(() => {
                    if (metrics.requirements === 0) return 0;
                    const testCoverage = (metrics.testCases / metrics.requirements) * 40;
                    const traceability = (metrics.totalConnections / (metrics.requirements * 2)) * 40;
                    const qualityPenalty = metrics.testCases > 0 ? (metrics.defects / metrics.testCases) * 20 : 0;
                    return Math.max(0, Math.min(100, testCoverage + traceability - qualityPenalty));
                  })()}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TraceabilityGraph;
