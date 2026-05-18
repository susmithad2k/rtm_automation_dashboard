import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

function TraceabilityGraph({ graphData }) {
  const graphRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef();

  useEffect(() => {
    // Resize graph to fit container
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: width, height: 600 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    // Center the graph on mount
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  }, [graphData]);

  // Default sample data if none provided
  const defaultData = {
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

  const data = graphData || defaultData;

  // Node color based on group type
  const getNodeColor = (node) => {
    const colors = {
      requirement: '#3b82f6', // blue
      test: '#10b981', // green
      defect: '#ef4444', // red
      default: '#6b7280', // gray
    };
    return colors[node.group] || colors.default;
  };

  // Node label
  const getNodeLabel = (node) => {
    return `${node.id}: ${node.name || ''}`;
  };

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
      
      <div className="border border-gray-300 rounded-lg bg-white">
        <ForceGraph2D
          ref={graphRef}
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}
          nodeLabel={getNodeLabel}
          nodeColor={getNodeColor}
          nodeRelSize={6}
          nodeVal={(node) => node.val || 10}
          linkColor={() => '#94a3b8'}
          linkWidth={2}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.005}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          cooldownTicks={100}
          onNodeClick={(node) => {
            console.log('Clicked node:', node);
          }}
          onNodeHover={(node) => {
            document.body.style.cursor = node ? 'pointer' : 'default';
          }}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Interactions:</strong> Drag nodes to reposition • Scroll to zoom • 
          Click and drag to pan • Click nodes for details
        </p>
        <p className="mt-1">
          <strong>Stats:</strong> {data.nodes.length} nodes, {data.links.length} connections
        </p>
      </div>
    </div>
  );
}

export default TraceabilityGraph;
