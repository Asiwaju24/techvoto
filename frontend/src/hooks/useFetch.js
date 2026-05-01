import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../utils/api'

/**
 * Generic data-fetching hook backed by the Django API.
 *
 * @param {string}  url       – API path relative to /api prefix
 * @param {object}  params    – query-string params e.g. { level: 'beginner' }
 * @param {boolean} immediate – fetch on mount (default true)
 */
export function useFetch(url, params = {}, immediate = true) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState(null)

  // Keep a stable ref to params so the effect doesn't re-run on every render
  const paramsRef = useRef(params)
  paramsRef.current = params

  const fetchData = useCallback(async (overrideParams) => {
    if (!url) return
    setLoading(true)
    setError(null)
    try {
      const queryParams = overrideParams ?? paramsRef.current
      const res  = await api.get(url, { params: queryParams })
      // Handle both paginated { count, results } and plain responses
      const body = res.data
      setData(body?.results !== undefined ? body.results : body)
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.response?.data?.message
        || 'Failed to load data. Is the backend running?'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    if (immediate) fetchData()
  }, [fetchData, immediate])

  return { data, loading, error, refetch: fetchData }
}
