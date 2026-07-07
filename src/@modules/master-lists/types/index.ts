// ** TypeScript definitions for the Master Clients list module

export interface MasterClientType {
  id: number
  cep: string | null
  cliente: string
  ruta: string | null
  company_route_id: number | null
  company_route_name: string | null
  company_route_db: string | null
  cus_name: string | null
  cus_business_name: string | null
  cus_tax_id1: string | null
  tp1_code: string | null
  tp2_code: string | null
  cit_code: string | null
  cus_phone: string | null
  cus_email: string | null
  registered_at_tenant: string | null
  created_at: string | null
  updated_at: string | null
  direccion?: string | null
  latitud?: string | null
  longitud?: string | null
  zona_venta?: string | null
  oficina?: string | null
  territorio?: string | null
  grupo_vendedor?: string | null
  codigo_fq?: string | null
  cedula_coordinador?: string | null
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: PaginationMeta
}

export interface FilterOption {
  code: string
  name: string
}

export interface FilterOptionsResponse {
  success: boolean
  message: string
  data: {
    tp1_codes: FilterOption[]
    tp2_codes: FilterOption[]
    cit_codes: FilterOption[]
    fq_codes: FilterOption[]
    vendor_groups: FilterOption[]
    offices: FilterOption[]
    territories: FilterOption[]
  }
}
