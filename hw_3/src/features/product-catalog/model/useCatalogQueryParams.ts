import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

interface CatalogQueryState {
  query: string
  page: number
  limit: number
  skip: number
  setQuery: (nextQuery: string) => void
  setPage: (nextPage: number) => void
}

const parsePositiveInteger = (value: string | null, fallbackValue: number): number => {
  if (!value) {
    return fallbackValue
  }

  const parsedValue = Number.parseInt(value, 10)

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallbackValue
  }

  return parsedValue
}

export const useCatalogQueryParams = (defaultLimit: number): CatalogQueryState => {
  const [searchParams, setSearchParams] = useSearchParams()

  const serializedSearchParams = searchParams.toString()

  const { query, page, limit } = useMemo(() => {
    const parsedParams = new URLSearchParams(serializedSearchParams)
    const nextQuery = parsedParams.get('q') ?? ''
    const nextPage = parsePositiveInteger(parsedParams.get('page'), 1)
    const nextLimit = parsePositiveInteger(parsedParams.get('limit'), defaultLimit)

    return {
      query: nextQuery,
      page: nextPage,
      limit: nextLimit,
    }
  }, [defaultLimit, serializedSearchParams])

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams)

    if (nextParams.get('limit') !== String(defaultLimit)) {
      nextParams.set('limit', String(defaultLimit))
      nextParams.set('page', '1')
      setSearchParams(nextParams, { replace: true })
    }
  }, [defaultLimit, searchParams, setSearchParams])

  const updateParams = useCallback(
    (values: { q?: string | null; page?: number | null; limit?: number | null }) => {
      const nextParams = new URLSearchParams(searchParams)

      if (values.q === null || values.q === undefined || values.q.length === 0) {
        nextParams.delete('q')
      } else {
        nextParams.set('q', values.q)
      }

      if (values.page === null || values.page === undefined || values.page <= 1) {
        nextParams.delete('page')
      } else {
        nextParams.set('page', String(values.page))
      }

      if (values.limit !== null && values.limit !== undefined) {
        nextParams.set('limit', String(values.limit))
      }

      setSearchParams(nextParams)
    },
    [searchParams, setSearchParams],
  )

  const setQuery = useCallback(
    (nextQuery: string) => {
      updateParams({
        q: nextQuery,
        page: 1,
        limit,
      })
    },
    [limit, updateParams],
  )

  const setPage = useCallback(
    (nextPage: number) => {
      updateParams({
        q: query,
        page: nextPage,
        limit,
      })
    },
    [limit, query, updateParams],
  )

  return {
    query,
    page,
    limit,
    skip: (page - 1) * limit,
    setQuery,
    setPage,
  }
}
