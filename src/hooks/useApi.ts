import { useState } from 'react'
import toast from 'react-hot-toast'
import axiosIns from 'src/configs/axios'
import { AxiosRequestConfig, AxiosError } from 'axios'

// ** Utility: Convert Object to FormData recursively
const serializeKeys = (obj: any, formData: FormData, parentKey = '') => {
  if (obj === null || obj === undefined) return

  if (typeof obj === 'object' && !(obj instanceof File) && !(obj instanceof Date)) {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      const formKey = parentKey ? `${parentKey}[${key}]` : key
      serializeKeys(value, formData, formKey)
    })
  } else {
    const value = obj instanceof Date ? obj.toISOString() : obj
    formData.append(parentKey, value)
  }
}

const objectToFormData = (obj: any): FormData => {
  const formData = new FormData()
  serializeKeys(obj, formData)

return formData
}

// ** Hook Definition
export const useApi = () => {
  const [loading, setLoading] = useState(false)

  // ** Helper to handle requests
  const request = async (
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data: any = null,
    config: AxiosRequestConfig = {},
    showToast = true
  ) => {
    setLoading(true)
    try {
      const response = await axiosIns({
        method,
        url,
        data,
        ...config
      })

      if (showToast && method !== 'get') {
        toast.success(response.data.message || 'Operation successful')
      }

      return response.data
    } catch (error: any) {
      if (showToast) {
        const err = error as AxiosError<any>

        // Handle Laravel Validation Errors (422)
        if (err.response?.status === 422) {
          const errors = err.response.data.errors
          if (errors) {
            Object.values(errors).flat().forEach((msg: any) => {
              toast.error(msg)
            })
          } else {
            toast.error(err.response.data.message || 'Validation error')
          }
        }


        // Handle other specific errors if needed (401/403/500 are handled globally)
        else if (err.response?.data?.message) {
            // Avoid double toasting if the interceptor already handled it (e.g., 500)
            // But sometimes backend sends specific messages we want to show
            if (err.response.status < 500 && err.response.status !== 401 && err.response.status !== 403) {
                 toast.error(err.response.data.message)
            }
        }
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    get: (url: string, params: any = {}, showToast = true) =>
      request('get', url, null, { params }, showToast),

    post: (url: string, data: any, hasFiles = false, showToast = true) =>
      request('post', url, hasFiles ? objectToFormData(data) : data, hasFiles ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}, showToast),

    put: (url: string, data: any, hasFiles = false, showToast = true) =>
      request('put', url, hasFiles ? objectToFormData(data) : data, hasFiles ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}, showToast),

    del: (url: string, showToast = true) =>
      request('delete', url, null, {}, showToast)
  }
}
