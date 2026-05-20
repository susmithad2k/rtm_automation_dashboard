import { useState } from 'react';

/**
 * Placeholder Trend Chart Component
 * Displays a line chart showing coverage trends over time
 */
function TrendChart({ trendData }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Placeholder data if none provided
  const defaultData = [
    { date: '2024-01', coverage: 45, tests: 120 },
    { date: '2024-02', coverage: 52, tests: 145 },
    { date: '2024-03', coverage: 58, tests: 168 },
    { date: '2024-04', coverage: 65, tests: 189 },
    { date: '2024-05', coverage: 72, tests: 215 },
    { date: '2024-06', coverage: 78, tests: 234 },
  ];

  const data = trendData || defaultData;
  const maxCoverage = Math.max(...data.map(d => d.coverage), 100);
  const maxTests = Math.max(...data.map(d => d.tests));

  // Calculate SVG points for line graph
  const width = 600;
  const height = 200;
  const padding = 40;

  const xScale = (index) => padding + (index / (data.length - 1)) * (width - 2 * padding);
  const yScale = (value) => height - padding - ((value / maxCoverage) * (height - 2 * padding));

  const linePoints = data
    .map((point, index) => `${xScale(index)},${yScale(point.coverage)}`)
    .join(' ');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Coverage Trend</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Coverage %</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Total Tests</span>
          </div>
        </div>
      </div>

      {/* Placeholder Graph */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-200 p-4">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => (
            <g key={value}>
              <line
                x1={padding}
                y1={yScale(value)}
                x2={width - padding}
                y2={yScale(value)}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 10}
                y={yScale(value) + 4}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {value}%
              </text>
            </g>
          ))}

          {/* Area under line */}
          <path
            d={`M ${padding},${height - padding} L ${linePoints} L ${width - padding},${height - padding} Z`}
            fill="url(#gradient)"
            opacity="0.2"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Main line */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, index) => (
            <g key={index}>
              <circle
                cx={xScale(index)}
                cy={yScale(point.coverage)}
                r={hoveredPoint === index ? 6 : 4}
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {hoveredPoint === index && (
                <g>
                  <rect
                    x={xScale(index) - 60}
                    y={yScale(point.coverage) - 50}
                    width="120"
                    height="40"
                    fill="#1f2937"
                    rx="4"
                    opacity="0.95"
                  />
                  <text
                    x={xScale(index)}
                    y={yScale(point.coverage) - 32}
                    textAnchor="middle"
                    className="text-xs fill-white font-semibold"
                  >
                    {point.date}
                  </text>
                  <text
                    x={xScale(index)}
                    y={yScale(point.coverage) - 18}
                    textAnchor="middle"
                    className="text-xs fill-white"
                  >
                    Coverage: {point.coverage}%
                  </text>
                </g>
              )}

              {/* X-axis labels */}
              <text
                x={xScale(index)}
                y={height - padding + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {point.date.split('-')[1]}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Current</p>
          <p className="text-2xl font-bold text-blue-600">
            {data && data.length > 0 ? data[data.length - 1]?.coverage : 0}%
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Trend</p>
          <p className="text-2xl font-bold text-green-600">
            {data && data.length > 0 && data[0]?.coverage !== undefined && data[data.length - 1]?.coverage !== undefined
              ? `+${(data[data.length - 1].coverage - data[0].coverage).toFixed(1)}%`
              : '0.0%'}
          </p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Total Tests</p>
          <p className="text-2xl font-bold text-purple-600">
            {data && data.length > 0 ? data[data.length - 1]?.tests : 0}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrendChart;
