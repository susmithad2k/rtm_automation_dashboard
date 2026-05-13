import { useState } from 'react';

/**
 * Placeholder Test Status Chart Component
 * Displays a donut chart showing test execution status breakdown
 */
function TestStatusChart({ testData }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Placeholder data if none provided
  const defaultData = {
    passed: 145,
    failed: 23,
    blocked: 12,
    notRun: 45,
    inProgress: 8,
  };

  const data = testData || defaultData;
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  const segments = [
    {
      key: 'passed',
      label: 'Passed',
      value: data.passed,
      color: '#10b981',
      lightColor: '#d1fae5',
    },
    {
      key: 'failed',
      label: 'Failed',
      value: data.failed,
      color: '#ef4444',
      lightColor: '#fee2e2',
    },
    {
      key: 'blocked',
      label: 'Blocked',
      value: data.blocked,
      color: '#f59e0b',
      lightColor: '#fef3c7',
    },
    {
      key: 'notRun',
      label: 'Not Run',
      value: data.notRun,
      color: '#6b7280',
      lightColor: '#f3f4f6',
    },
    {
      key: 'inProgress',
      label: 'In Progress',
      value: data.inProgress,
      color: '#3b82f6',
      lightColor: '#dbeafe',
    },
  ];

  // Calculate SVG arc paths for donut chart
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const innerRadius = 50;

  const getArcPath = (startAngle, endAngle, outerR, innerR) => {
    const startX = center + outerR * Math.cos((startAngle - 90) * (Math.PI / 180));
    const startY = center + outerR * Math.sin((startAngle - 90) * (Math.PI / 180));
    const endX = center + outerR * Math.cos((endAngle - 90) * (Math.PI / 180));
    const endY = center + outerR * Math.sin((endAngle - 90) * (Math.PI / 180));

    const innerStartX = center + innerR * Math.cos((endAngle - 90) * (Math.PI / 180));
    const innerStartY = center + innerR * Math.sin((endAngle - 90) * (Math.PI / 180));
    const innerEndX = center + innerR * Math.cos((startAngle - 90) * (Math.PI / 180));
    const innerEndY = center + innerR * Math.sin((startAngle - 90) * (Math.PI / 180));

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${startX} ${startY}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${endX} ${endY}
      L ${innerStartX} ${innerStartY}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEndX} ${innerEndY}
      Z
    `;
  };

  let currentAngle = 0;
  const arcs = segments.map((segment) => {
    const percentage = (segment.value / total) * 100;
    const angle = (segment.value / total) * 360;
    const arc = {
      ...segment,
      percentage: percentage.toFixed(1),
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return arc;
  });

  const passRate = ((data.passed / total) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Test Execution Status</h3>
        <div className="text-sm">
          <span className="text-gray-600">Pass Rate: </span>
          <span className="font-bold text-green-600">{passRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width={size} height={size} className="overflow-visible">
              {arcs.map((arc, index) => (
                <g key={arc.key}>
                  <path
                    d={getArcPath(arc.startAngle, arc.endAngle, radius, innerRadius)}
                    fill={arc.color}
                    className="cursor-pointer transition-all hover:opacity-80"
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    opacity={hoveredSegment !== null && hoveredSegment !== index ? 0.5 : 1}
                  />
                </g>
              ))}

              {/* Center circle with total */}
              <circle cx={center} cy={center} r={innerRadius} fill="white" />
              <text
                x={center}
                y={center - 10}
                textAnchor="middle"
                className="text-3xl font-bold fill-gray-800"
              >
                {total}
              </text>
              <text
                x={center}
                y={center + 10}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                Total Tests
              </text>
            </svg>

            {/* Hover Tooltip */}
            {hoveredSegment !== null && (
              <div className="absolute top-1/2 left-full ml-4 transform -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
                <div className="font-semibold">{arcs[hoveredSegment].label}</div>
                <div className="text-sm">
                  {arcs[hoveredSegment].value} tests ({arcs[hoveredSegment].percentage}%)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend and Details */}
        <div className="space-y-2">
          {segments.map((segment, index) => (
            <div
              key={segment.key}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                hoveredSegment === index
                  ? 'border-gray-400 bg-gray-50 shadow-md'
                  : 'border-gray-200'
              }`}
              style={{
                backgroundColor:
                  hoveredSegment === index ? segment.lightColor : 'transparent',
              }}
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{segment.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-800">{segment.value}</span>
                <span className="text-xs text-gray-500">
                  ({((segment.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600 mb-1">Success Rate</p>
          <p className="text-xl font-bold text-green-600">{passRate}%</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600 mb-1">Failure Rate</p>
          <p className="text-xl font-bold text-red-600">
            {((data.failed / total) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600 mb-1">Completion</p>
          <p className="text-xl font-bold text-blue-600">
            {(((data.passed + data.failed) / total) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestStatusChart;
