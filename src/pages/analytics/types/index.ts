// ** Analytics Module Types

// === Filter Types ===
export interface ReportFilters {
  start_date: string
  end_date: string
  client_ids?: number[]
  product_skus?: string[]
  routes?: string[]
}

export interface ClientOption {
  id: number
  name: string
  region_id: number | null
}

export interface RegionOption {
  id: number
  name: string
}

export interface ProductOption {
  id: number
  sku: string
  name: string
  category: string | null
  brand: string | null
}

export interface AvailableFilters {
  clients: ClientOption[]
  regions: RegionOption[]
  products: ProductOption[]
}

// === Report Response Types ===
export interface ReportMeta {
  clients_queried: number
  errors: Array<{ client: string; error: string }>
}

export interface ReportResponse<T> {
  success: boolean
  data: T[]
  meta: ReportMeta
}

// === Individual Report Types ===
export interface SalesTrendItem {
  year: number
  month: number
  total_transactions: number
  total_billed_bs: number
  total_billed_usd: number
  total_pending: number
}

export interface TopProductItem {
  product_id: number
  product_name: string
  total_quantity: number
  total_amount_usd: number
  total_amount_bs: number
}

export interface SalesByProductItem {
  product_id: number
  product_name: string
  year: number
  month: number
  total_quantity: number
  total_amount_usd: number
  total_amount_bs: number
}

export interface SalesByRouteItem {
  client_name: string
  route: string
  total_transactions: number
  total_billed_bs: number
  total_billed_usd: number
}
