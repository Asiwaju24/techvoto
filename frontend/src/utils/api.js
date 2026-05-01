import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT Bearer token to every outgoing request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('tv-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401 → silently refresh the access token and retry
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // 1. Check if error is 401 and not already a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('tv-refresh')

      if (refreshToken) {
        try {
          // 2. Use a clean axios instance (not 'api') for the refresh call
          // to avoid recursive interceptor loops
          const refreshUrl = `${import.meta.env.VITE_API_URL || '/api'}/auth/token/refresh/`
          const { data } = await axios.post(refreshUrl, { refresh: refreshToken })

          // 3. Save the new access token
          localStorage.setItem('tv-token', data.access)

          // 4. Update the header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${data.access}`
          return api(originalRequest)

        } catch (refreshError) {
          // 5. IF REFRESH FAILS: The refresh token is expired or invalid
          localStorage.removeItem('tv-token')
          localStorage.removeItem('tv-refresh')
          
          // FORCE LOGOUT: This stops the infinite loop
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        }
      }
    }

    // If it's not a 401 or no refresh token exists, just reject
    return Promise.reject(error)
  }
)

export default api