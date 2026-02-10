import React, { createContext, useContext } from "react"
import { cn } from "../../lib/utils"

// Context API
// Used to share state (sorting, pagination, expansion) between the Root and child components
// without prop drilling.
const TableContext = createContext(null)

const useTable = () => {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error("useTable must be used within a Table.Root")
  }
  return context
}

// --- Compound Component: Root ---
// Acts as a controlled component. It doesn't hold internal state logic (sorting/filtering),
// but receives it via props from hooks (Separation of Concerns).
export const Root = ({ 
  data, 
  children, 
  className,
  sortConfig, 
  onSort, 
  filters, 
  onFilterChange,
  pagination, 
  onPageChange,
  expandedIds,
  onToggleRow
}) => {
  return (
    <TableContext.Provider value={{
      data,
      sortConfig,
      onSort,
      filters,
      onFilterChange,
      pagination,
      onPageChange,
      expandedIds,
      onToggleRow
    }}>
      <div className={cn("w-full space-y-4", className)}>
        {children}
      </div>
    </TableContext.Provider>
  )
}

// --- Component: Filters ---
export const Filters = () => {
  const { filters, onFilterChange } = useTable()

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-3">
        <label
          htmlFor="filter-active"
          className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Filter by Status:
        </label>
        
        <div className="relative">
          <select
            id="filter-active"
            className="h-9 w-40 appearance-none rounded-md border border-gray-300 bg-white pl-3 pr-8 text-sm text-gray-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 hover:border-gray-400"
            value={filters?.active || "all"}
            onChange={e => onFilterChange("active", e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          {/*Custom arrow icon*/}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Component: Pagination ---
export const Pagination = () => {
  const { pagination, onPageChange } = useTable()
  
  if (!pagination || pagination.totalPages <= 1) return null

  const { page, totalPages } = pagination

  return (
    <div className="flex items-center justify-between py-2 px-1">
      <div className="text-sm text-gray-500">
        Page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-8 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-8 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// --- Presentation Components ---
export const Content = ({ className, children, ...props }) => (
  <div className="relative w-full overflow-x-auto rounded-md border border-gray-200 bg-white shadow-sm">
    <table
      className={cn(
        "w-full table-fixed border-collapse text-left text-sm",
        className
      )}
      {...props}
    >
      {children}
    </table>
  </div>
)

export const Header = ({ className, children, ...props }) => (
  <thead className={cn("bg-gray-50/75 [&_tr]:border-b", className)} {...props}>
    {children}
  </thead>
)

export const Body = ({ className, children, ...props }) => {
  const { data } = useTable()

  if (!data || data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="100%" className="h-24 text-center text-gray-500">
            No results found.
          </td>
        </tr>
      </tbody>
    )
  }

  // Render Prop Pattern:
  // Instead of hardcoding Row structure, we map data and call 'children' as a function.
  // This allows the parent component to define exactly how each row looks.
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
      {typeof children === "function" ? data.map(children) : children}
    </tbody>
  )
}

export const Row = ({ className, children, item, ...props }) => {
  const { onToggleRow, expandedIds } = useTable()
  
  // Calculate state based on Context
  const isExpanded = item ? expandedIds?.has(item.id) : false
  const handleToggle = () => item && onToggleRow && onToggleRow(item.id)

  return (
    <tr
      className={cn(
        "border-b border-gray-200 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100",
        className
      )}
      {...props}
    >
       {/* 
          Function as Child Pattern (Nested):
          Passes internal state (isExpanded, onToggle) back to the consumer
          so they can render the expand button anywhere inside the row.
       */}
       {typeof children === "function" 
        ? children({ item, isExpanded, onToggle: handleToggle }) 
        : children
      }
    </tr>
  )
}

export const Head = ({ className, sortKey, children, ...props }) => {
  const { sortConfig, onSort } = useTable()

  const handleSort = () => {
    if (!sortKey || !onSort) return
    const isCurrentKey = sortConfig?.key === sortKey
    const direction = isCurrentKey && sortConfig.dir === 'asc' ? 'desc' : 'asc'
    onSort(sortKey, direction)
  }

  const isSorted = sortConfig?.key === sortKey
  const Icon = isSorted ? (sortConfig.dir === "asc" ? "▲" : "▼") : null

  return (
    <th
      className={cn(
        "h-11 px-4 align-middle font-medium whitespace-nowrap text-gray-500",
        sortKey && "cursor-pointer select-none hover:text-gray-900 transition-colors",
        className
      )}
      onClick={handleSort}
      {...props}
    >
      <div className={cn("flex items-center gap-1", className?.includes("text-right") && "justify-end", className?.includes("text-center") && "justify-center")}>
        {children}
        <span className={cn("inline-block w-3 text-[10px] leading-none text-center", isSorted ? "opacity-100" : "opacity-0")}>
          {Icon || "•"}
        </span>
      </div>
    </th>
  )
}

export const Cell = ({ className, children, ...props }) => (
  <td
    className={cn(
      "overflow-hidden px-4 py-3 align-middle text-gray-700 text-ellipsis whitespace-nowrap",
      className
    )}
    {...props}
  >
    {children}
  </td>
)

const Table = {
  Root,
  Filters,
  Pagination,
  Content,
  Header,
  Body,
  Row,
  Head,
  Cell
}

export default Table