import { useState, useCallback, useEffect } from "react"

export function useTableParams() {
  const getInitialParams = () => {
    if (typeof window === "undefined")
      return { page: 1, sort: null, dir: "asc", active: "all" }
    const params = new URLSearchParams(window.location.search)
    return {
      page: parseInt(params.get("page") || "1", 10),
      sort: params.get("sort") || null,
      dir: params.get("dir") || "asc",
      active: params.get("active") || "all"
    }
  }

  const [params, setParams] = useState(getInitialParams)

  const updateParams = useCallback(newParams => {
    setParams(prev => {
      const updated = { ...prev, ...newParams }

      const url = new URL(window.location)
      if (updated.page > 1) url.searchParams.set("page", updated.page)
      else url.searchParams.delete("page")

      if (updated.sort) {
        url.searchParams.set("sort", updated.sort)
        url.searchParams.set("dir", updated.dir)
      } else {
        url.searchParams.delete("sort")
        url.searchParams.delete("dir")
      }

      if (updated.active !== "all")
        url.searchParams.set("active", updated.active)
      else url.searchParams.delete("active")

      window.history.pushState({}, "", url)
      return updated
    })
  }, [])

  useEffect(() => {
    const handlePopState = () => setParams(getInitialParams())
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  return [params, updateParams]
}
