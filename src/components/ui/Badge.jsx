/**
 * Badge - Reusable badge component for status, tags, and labels
 * @param {Object} props
 * @param {string} props.variant - Color variant (default, success, warning, error, info)
 * @param {string} props.size - Size (sm, md, lg)
 * @param {React.ReactNode} props.children - Badge content
 */
function Badge({ 
  variant = 'default', 
  size = 'md', 
  children, 
  className = '',
  pill = false 
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${pill ? 'rounded-full' : 'rounded'}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
