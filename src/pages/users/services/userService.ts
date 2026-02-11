import axiosIns from 'src/configs/axios'
import { UserFormData } from '../types'

const userService = {
  getUsers: async (params: any) => {
    const response = await axiosIns.get('/users', { params })

    return response.data
  },

  getRoles: async () => {
    const response = await axiosIns.get('/users/roles')

    return response.data.data
  },

  createUser: async (data: UserFormData) => {
    const response = await axiosIns.post('/users', data)

    return response.data.data
  },

  updateUser: async (id: number, data: UserFormData) => {
    const response = await axiosIns.put(`/users/${id}`, data)

    return response.data.data
  },

  deleteUser: async (id: number) => {
    const response = await axiosIns.delete(`/users/${id}`)

    return response.data.data
  },

  toggleStatus: async (id: number) => {
    const response = await axiosIns.patch(`/users/${id}/toggle-status`)

    return response.data.data
  }
}

export default userService
