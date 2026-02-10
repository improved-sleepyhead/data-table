import React from "react"
import Table from "./custom-uikit/table"
import { cn } from "../lib/utils"
import { rawData } from "./constants/raw-data"
import { useTableParams } from "../hooks/use-table-params"
import { useTreeData } from "../hooks/use-tree-data"


export const DataTable = () => {
  // 1. URL State Management (Single Source of Truth)
  const [params, setParams] = useTableParams()

  // 2. Data Processing Hook
  // Handles complex logic: Filtering -> Tree building -> Recursive Sorting -> Pagination -> Flattening.
  const { data, totalPages, currentPage, toggleRow, expandedIds } = useTreeData(
    rawData,
    params,
    5
  )

  // Handlers for URL updates
  const handleSort = (key, dir) => setParams({ sort: key, dir })
  const handleFilter = (key, val) => setParams({ [key]: val, page: 1 }) // Reset to page 1 on filter change
  const handlePage = page => setParams({ page })

  return (
    <Table.Root
      data={data}
      sortConfig={{ key: params.sort, dir: params.dir }}
      filters={{ active: params.active }}
      pagination={{ page: currentPage, totalPages }}
      expandedIds={expandedIds}
      onSort={handleSort}
      onFilterChange={handleFilter}
      onPageChange={handlePage}
      onToggleRow={toggleRow}
      className="mx-auto max-w-6xl p-6"
    >
      <Table.Filters />

      <Table.Content>
        <Table.Header>
          <Table.Row>
            {/* Columns definition. Widths should sum up to reasonable values or 100% */}
            <Table.Head className="w-25">ID</Table.Head>
            <Table.Head className="w-[25%]">Name</Table.Head>
            <Table.Head sortKey="email" className="w-[30%]">
              Email
            </Table.Head>
            <Table.Head sortKey="balance" className="w-[20%] text-right">
              Balance
            </Table.Head>
            <Table.Head className="w-25 text-center">Status</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {/* Render Prop Pattern usage: We define how each row looks based on the 'item' */}
          {item => (
            <Table.Row key={item.id} item={item}>
              {/* Receiving 'isExpanded' and 'onToggle' from the Row component */}
              {({ isExpanded, onToggle }) => (
                <>
                  <Table.Cell>
                    <div
                      className="flex items-center"
                      style={{ paddingLeft: `${item.level * 20}px` }}
                    >
                      {item.hasChildren ? (
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            onToggle()
                          }}
                          className="mr-2 flex h-5 w-5 items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-white"
                        >
                          <span className="text-[10px] leading-none">
                            {isExpanded ? "▼" : "▶"}
                          </span>
                        </button>
                      ) : (
                        <span className="mr-2 inline-block h-5 w-5" />
                      )}
                      <span className="font-medium text-gray-600">
                        {item.id}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell className="font-medium text-gray-900">
                    {item.name}
                  </Table.Cell>

                  <Table.Cell className="truncate text-gray-500">
                    {item.email}
                  </Table.Cell>

                  <Table.Cell className="text-right font-mono text-gray-900 tabular-nums">
                    {item.balance}
                  </Table.Cell>

                  <Table.Cell className="text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                        item.isActive
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : "bg-red-50 text-red-700 ring-red-600/10"
                      )}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </Table.Cell>
                </>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table.Content>

      <Table.Pagination />
    </Table.Root>
  )
}
