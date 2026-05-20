import { useState } from 'react';

function CoverageChart({ coverageData }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  if (!coverageData) {
    return (
      <div className="text-center py-8 text-gray-500">
        No coverage data available
      </div>
    );
  }

  const {
    totalRequirements = 0,
    coveredRequirements = 0,
    uncoveredRequirements = 0,
    partiallyCovered = 0,
    percentage = 0
  } = coverageData;

  const segments = [
    {
      label: 'Covered',
      value: coveredRequirements,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      textColor: 'text-green-600'
    },
    {
      label: 'Partially Covered',
      value: partiallyCovered,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Uncovered',
      value: uncoveredRequirements,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      textColor: 'text-red-600'
    }
  ];

  const getPercentage = (value) => {
    return totalRequirements > 0 ? ((value / totalRequirements) * 100).toFixed(1) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Main Coverage Indicator */}
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-40 h-40">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#3b82f6"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={`${((percentage || 0) / 100) * (2 * Math.PI * 70)} ${2 * Math.PI * 70}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute text-center">
            <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
            <div className="text-xs text-gray-600">Coverage</div>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Coverage Breakdown</h3>
        <div className="flex h-8 rounded-lg overflow-hidden shadow-sm">
          {segments.map((segment, index) => {
            const segmentPercentage = getPercentage(segment.value);
            return segmentPercentage > 0 ? (
              <div
                key={index}
                className={`${segment.color} ${segment.hoverColor} transition-all cursor-pointer relative group`}
                style={{ width: `${segmentPercentage}%` }}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                title={`${segment.label}: ${segment.value} (${segmentPercentage}%)`}
              >
                {hoveredSegment === index && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                    {segment.label}: {segment.value} ({segmentPercentage}%)
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-3">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`text-center p-3 rounded-lg border-2 ${
              hoveredSegment === index ? 'border-gray-400 bg-gray-50' : 'border-gray-200'
            } transition-all cursor-pointer`}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className={`text-2xl font-bold ${segment.textColor}`}>
              {segment.value}
            </div>
            <div className="text-xs text-gray-600 mt-1">{segment.label}</div>
            <div className="text-xs text-gray-500 mt-1">
              {getPercentage(segment.value)}%
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="border-t pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Requirements:</span>
            <span className="ml-2 font-semibold text-gray-800">{totalRequirements}</span>
          </div>
          <div>
            <span className="text-gray-600">Coverage Rate:</span>
            <span className="ml-2 font-semibold text-blue-600">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoverageChart;
