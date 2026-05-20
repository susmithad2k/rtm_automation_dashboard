import { useState } from 'react';

/**
 * Placeholder Impact Analysis Chart Component
 * Displays a horizontal bar chart showing impact across different categories
 */
function ImpactChart({ impactData }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Placeholder data if none provided
  const defaultData = [
    { category: 'Requirements', high: 12, medium: 23, low: 45, total: 80 },
    { category: 'Test Cases', high: 8, medium: 34, low: 58, total: 100 },
    { category: 'Defects', high: 15, medium: 18, low: 12, total: 45 },
    { category: 'Use Cases', high: 6, medium: 14, low: 30, total: 50 },
    { category: 'Documentation', high: 3, medium: 10, low: 22, total: 35 },
  ];

  const data = impactData || defaultData;
  const maxTotal = Math.max(...data.map(d => d.total), 1); // Ensure minimum of 1 to avoid division by zero

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' };
      case 'medium':
        return { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200' };
      case 'low':
        return { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Impact Analysis by Category</h3>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Low</span>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="space-y-3">
        {data.map((item, index) => {
          const highPercent = (item.high / maxTotal) * 100;
          const mediumPercent = (item.medium / maxTotal) * 100;
          const lowPercent = (item.low / maxTotal) * 100;
          const isHovered = hoveredBar === index;

          return (
            <div
              key={index}
              className={`transition-all ${isHovered ? 'scale-102' : ''}`}
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div className="flex items-center gap-3">
                {/* Category Label */}
                <div className="w-32 text-sm font-medium text-gray-700">
                  {item.category}
                </div>

                {/* Stacked Bar Container */}
                <div className="flex-1 relative">
                  <div className="flex h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    {/* High Impact */}
                    {item.high > 0 && (
                      <div
                        className="bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center text-white text-xs font-semibold"
                        style={{ width: `${highPercent}%` }}
                        title={`High: ${item.high}`}
                      >
                        {highPercent > 8 && item.high}
                      </div>
                    )}
                    {/* Medium Impact */}
                    {item.medium > 0 && (
                      <div
                        className="bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center text-white text-xs font-semibold"
                        style={{ width: `${mediumPercent}%` }}
                        title={`Medium: ${item.medium}`}
                      >
                        {mediumPercent > 8 && item.medium}
                      </div>
                    )}
                    {/* Low Impact */}
                    {item.low > 0 && (
                      <div
                        className="bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center text-white text-xs font-semibold"
                        style={{ width: `${lowPercent}%` }}
                        title={`Low: ${item.low}`}
                      >
                        {lowPercent > 8 && item.low}
                      </div>
                    )}
                  </div>

                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute top-12 left-0 bg-gray-900 text-white text-xs rounded-lg p-3 z-10 shadow-lg min-w-max">
                      <div className="font-semibold mb-2">{item.category}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-red-400">High:</span>
                          <span className="font-semibold">{item.high}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-yellow-400">Medium:</span>
                          <span className="font-semibold">{item.medium}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-green-400">Low:</span>
                          <span className="font-semibold">{item.low}</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1 border-t border-gray-600">
                          <span>Total:</span>
                          <span className="font-bold">{item.total}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total Count */}
                <div className="w-16 text-right">
                  <span className="text-sm font-bold text-gray-800">{item.total}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-200">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Total Items</p>
          <p className="text-xl font-bold text-gray-800">
            {data.reduce((sum, item) => sum + item.total, 0)}
          </p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">High Priority</p>
          <p className="text-xl font-bold text-red-600">
            {data.reduce((sum, item) => sum + item.high, 0)}
          </p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Medium Priority</p>
          <p className="text-xl font-bold text-yellow-600">
            {data.reduce((sum, item) => sum + item.medium, 0)}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Low Priority</p>
          <p className="text-xl font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.low, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImpactChart;
