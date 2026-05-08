# DataTable Component

A modern, reusable DataTable component with sorting, pagination, and custom rendering capabilities.

## Features

✨ **Sorting** - Click column headers to sort data  
📄 **Pagination** - Built-in pagination with customizable items per page  
🎨 **Custom Rendering** - Define custom cell renderers for any column  
📱 **Responsive** - Mobile-friendly with horizontal scrolling  
🎯 **Flexible** - Highly customizable through props  
⚡ **Performance** - Optimized with useMemo for large datasets  

## Basic Usage

```jsx
import { DataTable } from '../components/ui';

const columns = [
  {
    header: 'Name',
    accessor: 'name',
    sortable: true,
  },
  {
    header: 'Email',
    accessor: 'email',
    sortable: true,
  },
  {
    header: 'Status',
    accessor: 'status',
    sortable: true,
    render: (value) => (
      <Badge variant={value === 'Active' ? 'success' : 'error'}>
        {value}
      </Badge>
    ),
  },
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
];

function MyComponent() {
  return (
    <DataTable
      data={data}
      columns={columns}
      itemsPerPage={10}
      showPagination={true}
    />
  );
}
```

## Column Configuration

Each column object can have the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `header` | string | Yes | Column header text |
| `accessor` | string | Yes* | Key to access data in row object |
| `sortable` | boolean | No | Enable sorting (default: true) |
| `render` | function | No | Custom render function |
| `className` | string | No | CSS classes for header cell |
| `cellClassName` | string | No | CSS classes for body cells |

*Not required if using custom render without data accessor

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | array | `[]` | Array of data objects |
| `columns` | array | `[]` | Column configuration array |
| `itemsPerPage` | number | `10` | Items per page |
| `showPagination` | boolean | `true` | Show pagination controls |
| `emptyMessage` | string | `"No data available"` | Message when no data |
| `striped` | boolean | `true` | Alternating row colors |
| `hoverable` | boolean | `true` | Highlight rows on hover |
| `onRowClick` | function | `null` | Callback when row is clicked |
| `className` | string | `""` | Additional CSS classes |

## Custom Cell Rendering

The `render` function receives three parameters:

```jsx
render: (value, row, rowIndex) => {
  // value: The cell value
  // row: The entire row object
  // rowIndex: The index of the row
  return <CustomComponent value={value} />;
}
```

Example:

```jsx
{
  header: 'Actions',
  accessor: 'id',
  sortable: false,
  render: (id, row) => (
    <div className="flex gap-2">
      <button onClick={() => handleEdit(id)}>Edit</button>
      <button onClick={() => handleDelete(id)}>Delete</button>
    </div>
  ),
}
```

## Advanced Example

```jsx
import { useMemo } from 'react';
import { DataTable, Badge, TableStats } from '../components/ui';

function AdvancedTable() {
  const columns = useMemo(() => [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      className: 'w-20',
    },
    {
      header: 'User',
      accessor: 'name',
      sortable: true,
      render: (name, row) => (
        <div className="flex items-center gap-2">
          <img src={row.avatar} className="w-8 h-8 rounded-full" />
          <span className="font-medium">{name}</span>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      sortable: true,
      render: (role) => (
        <Badge variant={role === 'Admin' ? 'purple' : 'default'}>
          {role}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      sortable: false,
      render: (_, row) => (
        <button onClick={() => viewDetails(row)}>
          View Details
        </button>
      ),
    },
  ], []);

  const stats = useMemo(() => [
    { label: 'Total Users', value: data.length, color: 'blue' },
    { label: 'Active', value: data.filter(u => u.active).length, color: 'green' },
  ], [data]);

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        itemsPerPage={15}
        onRowClick={(row) => console.log('Clicked:', row)}
      />
      <TableStats stats={stats} />
    </div>
  );
}
```

## Companion Components

### Badge

Display status badges and labels:

```jsx
<Badge variant="success" size="sm" pill>Verified</Badge>
```

Variants: `default`, `success`, `warning`, `error`, `info`, `purple`, `orange`, `indigo`

### TableStats

Display statistics below the table:

```jsx
<TableStats
  stats={[
    { label: 'Total', value: 100, color: 'gray' },
    { label: 'Active', value: 75, color: 'green' },
    { label: 'Pending', value: 25, color: 'yellow' },
  ]}
/>
```

## Styling

The DataTable uses Tailwind CSS classes. You can customize the appearance by:

1. Adding custom `className` to the table
2. Using `className` and `cellClassName` in column definitions
3. Customizing through the `render` function
4. Overriding default Tailwind classes

## Performance Tips

1. Use `useMemo` for column definitions to prevent re-renders
2. Use `useMemo` for data transformations
3. Keep `render` functions pure and lightweight
4. Enable pagination for large datasets (>50 rows)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
