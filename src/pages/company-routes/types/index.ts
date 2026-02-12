import { RegionType } from 'src/pages/regions/types'

export interface CompanyRouteType {
  id: number
  code: string
  name: string
  route_name: string | null
  rif: string
  description: string | null
  fiscal_address: string
  region_id: number
  db_name: string
  is_active: boolean
  region?: RegionType
  created_at: string
  updated_at: string
}

export interface CompanyRouteFormData {
  code: string
  name: string
  route_name?: string | null
  rif: string
  description?: string | null
  fiscal_address: string
  region_id: number | string
  db_name: string
}
