export interface IBulkImportLogUser {
  id: number
  email?: string
  name?: string
}

export interface ITenantProcedureLog {
  success: boolean
  logs: string[]
}

export type TenantProceduresMap = Record<string, ITenantProcedureLog>

export interface IBulkImportLog {
  id: number
  type: string
  filename: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  summary?: Record<string, any>
  error_log?: string
  user_id?: number
  user?: IBulkImportLogUser
  started_at?: string
  finished_at?: string
  created_at?: string
  updated_at?: string
  sync_status?: 'syncing' | 'synced' | 'sync_failed' | string
  sync_log?: Record<string, any> | string
  procedures_status?: 'completado' | 'fallido' | 'pendiente' | string
  procedures_log?: TenantProceduresMap | string
}

export interface IBulkImportLogFilter {
  types?: string[]
  start_date?: string
  end_date?: string
  search?: string
  page?: number
  per_page?: number
}

export interface IPaginatedMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number
  to?: number
}

export interface IPaginatedBulkImportLogResponse {
  success: boolean
  data: IBulkImportLog[]
  meta: IPaginatedMeta
}
