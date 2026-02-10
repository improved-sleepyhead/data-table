import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback
} from "react"
import { cn, parseCurrency } from "../../lib/utils"

// Context
const TableContext = createContext(null)

const useTable = () => {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error("useTable must be used within a Table.Root")
  }
  return context
}

// Root Component
export const Root = ({ data, children, className }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [filters, setFilters] = useState({ isActive: null })

  // Sorting and filters block
  const processedData = useMemo(() => {
    let result = [...data]

    // Filters
    if (filters.isActive !== null) {
      result = result.filter(item => item.isActive === filters.isActive)
    }

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        // Balance parsing
        if (sortConfig.key === "balance") {
          aValue = parseCurrency(aValue)
          bValue = parseCurrency(bValue)
        }

        // Email check
        if (typeof aValue === "string") aValue = aValue.toLowerCase()
        if (typeof bValue === "string") bValue = bValue.toLowerCase()

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }
    return result
  }, [data, sortConfig, filters])

  const contextValue = useMemo(
    () => ({
      data: processedData,
      sortConfig,
      setSortConfig,
      filters,
      setFilters
    }),
    [processedData, sortConfig, filters]
  )

  return (
    <TableContext.Provider value={contextValue}>
      <div className={cn("w-full overflow-hidden", className)}>{children}</div>
    </TableContext.Provider>
  )
}

// Filter Components
export const Filters = () => {
  const { filters, setFilters } = useTable()

  return (
    <div className="flex items-center space-x-4 py-4">
      <div className="flex items-center space-x-2">
        <label
          htmlFor="filter-active"
          className="leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Status:
        </label>
        <select
          id="filter-active"
          className="h-9 w-38 rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 focus-visible:outline-none"
          value={filters.isActive === null ? "all" : filters.isActive}
          onChange={e => {
            const val = e.target.value
            setFilters(prev => ({
              ...prev,
              isActive: val === "all" ? null : val === "true"
            }))
          }}
        >
          <option value="all">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </div>
  )
}

// Presentation Components (Styling)
export const Content = ({ className, children, ...props }) => (
  <div className="relative w-full overflow-x-auto rounded-md border border-gray-200 bg-white">
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
  <thead className={cn("bg-gray-50/50 [&_tr]:border-b", className)} {...props}>
    {children}
  </thead>
)

export const Body = ({ className, children, ...props }) => {
  const { data } = useTable()

  if (data.length === 0) {
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

  // Render Prop реализация
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
      {typeof children === "function" ? data.map(children) : children}
    </tbody>
  )
}

export const Row = ({ className, children, ...props }) => (
  <tr
    className={cn(
      "border-b border-gray-200 transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100",
      className
    )}
    {...props}
  >
    {children}
  </tr>
)

export const Head = ({ className, sortKey, children, ...props }) => {
  const { sortConfig, setSortConfig } = useTable()

  const handleSort = useCallback(() => {
    if (!sortKey) return
    setSortConfig(current => {
      if (current.key === sortKey) {
        return {
          key: sortKey,
          direction: current.direction === "asc" ? "desc" : "asc"
        }
      }
      return { key: sortKey, direction: "asc" }
    })
  }, [sortKey, setSortConfig])

  const isSorted = sortConfig.key === sortKey
  const Icon = isSorted ? (sortConfig.direction === "asc" ? "▲" : "▼") : null

  return (
    <th
      className={cn(
        "px-4 py-3 align-middle font-medium whitespace-nowrap text-gray-500",
        sortKey && "cursor-pointer select-none hover:text-gray-900",
        className
      )}
      onClick={handleSort}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {Icon && <span className="text-[10px] leading-none">{Icon}</span>}
      </span>
    </th>
  )
}

export const Cell = ({ className, children, ...props }) => (
  <td
    className={cn(
      "overflow-hidden px-4 py-3 align-middle text-ellipsis whitespace-nowrap",
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
  Content,
  Header,
  Body,
  Row,
  Head,
  Cell
}

export default Table
