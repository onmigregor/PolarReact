import axios from 'src/configs/axios'
import { IBulkImportLogFilter, IPaginatedBulkImportLogResponse } from '../types/reportesCarga.types'

const reportesCargaService = {
  /**
   * Obtener listado paginado y filtrado de reportes de carga masiva desde PolarAPI
   */
  getLogs: async (params: IBulkImportLogFilter = {}): Promise<IPaginatedBulkImportLogResponse> => {
    const formattedParams: Record<string, any> = {
      page: params.page || 1,
      per_page: params.per_page || 10
    }

    if (params.types && params.types.length > 0) {
      formattedParams['types'] = params.types
    }
    if (params.start_date) {
      formattedParams.start_date = params.start_date
    }
    if (params.end_date) {
      formattedParams.end_date = params.end_date
    }
    if (params.search && params.search.trim() !== '') {
      formattedParams.search = params.search.trim()
    }

    const response = await axios.get('/reports/bulk-import-logs', { params: formattedParams })

    return response.data
  },

  /**
   * Re-ejecutar procedimientos de inventario para un log de carga específico
   */
  retryProcedures: async (id: number): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await axios.post(`/reports/bulk-import-logs/${id}/retry-procedures`)

    return response.data
  }
}

export default reportesCargaService
