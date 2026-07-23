import React, { useState, useEffect, useCallback } from 'react'
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import reportesCargaService from 'src/@modules/reportes-carga/services/reportesCargaService'
import { IBulkImportLog } from 'src/@modules/reportes-carga/types/reportesCarga.types'
import ReportesCargasFilters from 'src/@modules/reportes-carga/components/ReportesCargasFilters'
import ReportesCargasTable from 'src/@modules/reportes-carga/components/ReportesCargasTable'
import ReportSummaryModal from 'src/@modules/reportes-carga/components/ReportSummaryModal'
import ReportErrorModal from 'src/@modules/reportes-carga/components/ReportErrorModal'
import toast from 'react-hot-toast'

const ReportesCargasPage = () => {
  // States
  const [data, setData] = useState<IBulkImportLog[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  // Filters & Pagination
  const [page, setPage] = useState<number>(0) // 0-indexed for MUI TablePagination
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  // Modals state
  const [selectedSummaryRecord, setSelectedSummaryRecord] = useState<IBulkImportLog | null>(null)
  const [selectedErrorRecord, setSelectedErrorRecord] = useState<IBulkImportLog | null>(null)
  const [retryRecord, setRetryRecord] = useState<IBulkImportLog | null>(null)
  const [retryLoading, setRetryLoading] = useState<boolean>(false)

  // Fetch Data Function
  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await reportesCargaService.getLogs({
        page: page + 1, // API is 1-indexed
        per_page: rowsPerPage,
        types: selectedTypes,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        search: search || undefined
      })

      if (response.success) {
        setData(response.data || [])
        setTotal(response.meta?.total || 0)
      } else {
        toast.error('Error al cargar historial de cargas')
      }
    } catch (error: any) {
      console.error('Error fetching bulk import logs:', error)
      toast.error(error.response?.data?.message || 'Error de conexión al obtener reportes')
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, selectedTypes, startDate, endDate, search])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Pagination Handlers
  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Filter Handlers
  const handleTypesChange = (types: string[]) => {
    setSelectedTypes(types)
    setPage(0)
  }

  const handleStartDateChange = (date: string) => {
    setStartDate(date)
    setPage(0)
  }

  const handleEndDateChange = (date: string) => {
    setEndDate(date)
    setPage(0)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  const handleResetFilters = () => {
    setSelectedTypes([])
    setStartDate('')
    setEndDate('')
    setSearch('')
    setPage(0)
  }

  // Retry Procedures Handler
  const handleConfirmRetry = async () => {
    if (!retryRecord) return
    setRetryLoading(true)
    try {
      const result = await reportesCargaService.retryProcedures(retryRecord.id)
      if (result.success) {
        toast.success(result.message || 'Procedimientos de inventario re-ejecutados correctamente')
        fetchLogs()
      } else {
        toast.error(result.message || 'No se pudieron re-ejecutar los procedimientos')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al solicitar re-ejecución')
    } finally {
      setRetryLoading(false)
      setRetryRecord(null)
    }
  }

  return (
    <Box>
      <PageHeader
        title={<Typography variant='h4'>Reporte de Cargas Masivas</Typography>}
        subtitle={
          <Typography sx={{ color: 'text.secondary' }}>
            Monitoreo en tiempo real del historial de importaciones y sincronizaciones de la plataforma
          </Typography>
        }
      />

      <Box sx={{ mt: 6 }}>
        {/* Componente Modular de Filtros */}
        <ReportesCargasFilters
          selectedTypes={selectedTypes}
          startDate={startDate}
          endDate={endDate}
          search={search}
          onTypesChange={handleTypesChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onSearchChange={handleSearchChange}
          onReset={handleResetFilters}
        />

        {/* Componente Modular de Tabla */}
        <ReportesCargasTable
          data={data}
          total={total}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          searchQuery={search}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onSearchChange={handleSearchChange}
          onViewSummary={record => setSelectedSummaryRecord(record)}
          onViewError={record => setSelectedErrorRecord(record)}
          onRetryProcedures={record => setRetryRecord(record)}
        />
      </Box>

      {/* Modal Resumen de Carga */}
      <ReportSummaryModal
        open={Boolean(selectedSummaryRecord)}
        record={selectedSummaryRecord}
        onClose={() => setSelectedSummaryRecord(null)}
      />

      {/* Modal Detalle de Error */}
      <ReportErrorModal
        open={Boolean(selectedErrorRecord)}
        record={selectedErrorRecord}
        onClose={() => setSelectedErrorRecord(null)}
      />

      {/* Confirmación Re-ejecutar Procedures */}
      <Dialog open={Boolean(retryRecord)} onClose={() => setRetryRecord(null)}>
        <DialogTitle>Re-ejecutar Procedimientos de Inventario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas re-ejecutar la sincronización y Stored Procedures de inventario en los tenants para la carga #{retryRecord?.id} ({retryRecord?.filename})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetryRecord(null)} color='secondary'>
            Cancelar
          </Button>
          <Button onClick={handleConfirmRetry} variant='contained' color='warning' disabled={retryLoading}>
            {retryLoading ? 'Ejecutando...' : 'Confirmar Re-ejecución'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

ReportesCargasPage.acl = {
  action: 'read',
  subject: 'analytics'
}

export default ReportesCargasPage
