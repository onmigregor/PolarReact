import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'

// ** Create Axios Instance
const axiosIns = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// ** Request Interceptor
axiosIns.interceptors.request.use(
  config => {
    // Get token from localStorage
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    // If token exists, add it to headers
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`
    }

    return config
  },
  error => {
    console.error('Axios Request Error:', error)

return Promise.reject(error)
  }
)

// ** Response Interceptor
axiosIns.interceptors.response.use(
  response => {
    return response
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized (Logout)
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem('userData')
      window.localStorage.removeItem(authConfig.storageTokenKeyName)

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }

      toast.error('Session expired. Please login again.')
    }

    // Handle 403 Forbidden
    if (error.response && error.response.status === 403) {
      toast.error('You do not have permission to perform this action.')
    }

    // Handle 500 Server Error
    if (error.response && error.response.status >= 500) {
      toast.error('Internal Server Error. Please try again later.')
    }

    return Promise.reject(error)
  }
)

export default axiosIns
