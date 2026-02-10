import { useMemo, useState } from "react"
import { parseCurrency } from "../lib/utils"

export function useTreeData(
  rawData,
  { sort, dir, active, page },
  pageSize = 10
) {
  const [expandedIds, setExpandedIds] = useState(new Set())

  // 1. Filtering (Parent -> Children)
  const { nodesByParent, rootIds } = useMemo(() => {
    const groups = {}
    const allIds = new Set()

    const filtered = rawData.filter(item => {
      if (active === "all") return true
      return String(item.isActive) === active
    })

    filtered.forEach(item => {
      if (!groups[item.parentId]) groups[item.parentId] = []
      groups[item.parentId].push(item)
      allIds.add(item.id)
    })

    const roots = filtered.filter(
      item => item.parentId === 0 || !allIds.has(item.parentId)
    )

    return { nodesByParent: groups, rootIds: roots }
  }, [rawData, active])

  // 2. Recursive Sorting
  const sortNodes = nodes => {
    if (!sort || !nodes) return nodes
    return [...nodes].sort((a, b) => {
      let aVal = a[sort]
      let bVal = b[sort]

      if (sort === "balance") {
        aVal = parseCurrency(aVal)
        bVal = parseCurrency(bVal)
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return dir === "asc" ? -1 : 1
      if (aVal > bVal) return dir === "asc" ? 1 : -1
      return 0
    })
  }

  // 3. Pagination
  const sortedRoots = useMemo(() => sortNodes(rootIds), [rootIds, sort, dir])
  const totalPages = Math.ceil(sortedRoots.length / pageSize)
  const safePage = Math.max(1, Math.min(page, totalPages || 1))

  const paginatedRoots = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return sortedRoots.slice(start, start + pageSize)
  }, [sortedRoots, safePage, pageSize])

  // 4. Flattening
  const flattenData = useMemo(() => {
    const result = []

    const traverse = (nodes, level = 0) => {
      if (!nodes) return

      const sorted = sortNodes(nodes)

      sorted.forEach(node => {
        result.push({ ...node, level, hasChildren: !!nodesByParent[node.id] })

        if (expandedIds.has(node.id) && nodesByParent[node.id]) {
          traverse(nodesByParent[node.id], level + 1)
        }
      })
    }

    traverse(paginatedRoots)
    return result
  }, [paginatedRoots, expandedIds, nodesByParent, sort, dir])

  // Toggle handlers
  const toggleRow = id => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return {
    data: flattenData,
    totalPages,
    currentPage: safePage,
    toggleRow,
    expandedIds
  }
}
