// ** Analytics Module Types

// === Filter Types ===
export interface ReportFilters {
  start_date: string
  end_date: string
  client_ids?: string[]
  region_ids?: number[]
  product_skus?: string[]
  routes?: number[]
  cl1_codes?: string[]
  cl2_codes?: string[]
  brand_codes?: string[]
  cl3_codes?: string[]
  fq_codes?: string[]
  vendor_groups?: string[]
  offices?: string[]
  territories?: string[]
}

export interface ClientOption {
  id: string
  name: string
  company_route_id: number
}

export interface RouteOption {
  id: number
  name: string
  db_name: string
  region_id: number | null
}

export interface RegionOption {
  id: number
  name: string
  code?: string
}

export interface FamilyOption {
  id: string
  name: string
}

export interface CategoryOption {
  id: string
  name: string
  cl1_code: string
}

export interface BrandOption {
  id: string
  name: string
}

export interface SegmentOption {
  id: string
  name: string
}

export interface ProductOption {
  id: number
  sku: string
  name: string
  category: string | null
  brand: string | null
  cl1_code: string | null
  cl2_code: string | null
  brand_code: string | null
  segment_code: string | null
}

export interface GenericOption {
  id: string
  name: string
}

export interface AvailableFilters {
  routes: RouteOption[]
  regions: RegionOption[]
  products: ProductOption[]
  families: FamilyOption[]
  categories: CategoryOption[]
  brands: BrandOption[]
  segments: SegmentOption[]
  fq_codes: GenericOption[]
  vendor_groups: GenericOption[]
  offices: GenericOption[]
  territories: GenericOption[]
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
