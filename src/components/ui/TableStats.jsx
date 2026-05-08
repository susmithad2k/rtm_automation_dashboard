/**
 * TableStats - Display statistics and summary information for tables
 * @param {Object} props
 * @param {Array} props.stats - Array of stat objects with label, value, and optional color
 */
function TableStats({ stats = [], className = '' }) {
  if (!stats || stats.length === 0) return null;

  const getColorClass = (color) => {
    const colorMap = {
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      blue: 'text-blue-600',
      gray: 'text-gray-600',
      orange: 'text-orange-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
    };
    return colorMap[color] || 'text-gray-700';
  };

  return (
    <div className={`bg-gray-50 px-6 py-4 border-t border-gray-200 ${className}`}>
      <div className="flex flex-wrap gap-6 items-center text-sm text-gray-700">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-gray-600">{stat.label}:</span>
            <span className={`font-semibold ${stat.color ? getColorClass(stat.color) : 'text-gray-900'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableStats;
