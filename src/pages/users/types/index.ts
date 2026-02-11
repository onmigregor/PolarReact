export interface RoleType {
  id: number
  name: string
  label?: string
}

export interface UserType {
  id: number
  name: string
  email: string
  active: boolean
  roles: RoleType[]
  created_at: string
  updated_at: string
}

export interface UserFormData {
  name: string
  email: string
  password?: string
  password_confirmation?: string
  roles: number[] // Array of role IDs
  active: boolean
}
