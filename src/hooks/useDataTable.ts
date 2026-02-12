import { useState, useEffect, useCallback, ChangeEvent } from 'react'

interface FetchDataParams {
  page: number
  per_page: number
  query?: string
  [key: string]: any
}

interface Meta {
  total: number
}

interface PaginatedResponse<T> {
  data: T[]
  meta: Meta
}

interface UseDataTableProps<T> {
  fetchData: (params: FetchDataParams) => Promise<PaginatedResponse<T>>
  initialRowsPerPage?: number
}

export const useDataTable = <T,>({ fetchData, initialRowsPerPage = 10 }: UseDataTableProps<T>) => {
  // ** State
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  const fetchItems = useCallback(
    async (currentPage: number, perPage: number, query: string, currentFilters: Record<string, any>) => {
      setLoading(true)
      try {
        console.log('Fetching with params:', {
          page: currentPage + 1,
          per_page: perPage,
          query: query || undefined,
          ...currentFilters
        })
        const response = await fetchData({
          page: currentPage + 1, // API is 1-indexed
          per_page: perPage,
          query: query || undefined,
          ...currentFilters
        })
        setData(response.data)
        setTotal(response.meta.total)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    },
    [fetchData]
  )

  // Initial load + refetch on page/perPage changes
  useEffect(() => {
    fetchItems(page, rowsPerPage, searchQuery, filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, fetchItems])

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)

    if (searchTimeout) clearTimeout(searchTimeout)

    const timeout = setTimeout(() => {
      setPage(0)
      fetchItems(0, rowsPerPage, value, filters)
    }, 400)
    setSearchTimeout(timeout)
  }

  const handleFilterChange = (newFilters: Record<string, any>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    setPage(0)
    fetchItems(0, rowsPerPage, searchQuery, updatedFilters)
  }

  const refresh = () => fetchItems(page, rowsPerPage, searchQuery, filters)

  return {
    // State
    data,
    total,
    loading,
    page,
    rowsPerPage,
    searchQuery,
    filters,

    // Handlers
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleFilterChange,
    refresh,

    // Helper for Tables
    paginationProps: {
      count: total,
      page: page,
      rowsPerPage: rowsPerPage,
      onPageChange: handleChangePage,
      onRowsPerPageChange: handleChangeRowsPerPage
    }
  }
}
