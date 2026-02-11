// ** Types for the Regions module

export interface RegionType {
  id: number
  citCode: string
  citName: string
  staCode: string
  created_at: string
  updated_at: string
}

export interface RegionFormData {
  citCode: string
  citName: string
  staCode: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface PaginatedResponse<T> {
  status: string
  message: string
  data: T[]
  meta: PaginationMeta
  links: Record<string, string | null>
}

export interface SingleResponse<T> {
  status: string
  message: string
  data: T
}
