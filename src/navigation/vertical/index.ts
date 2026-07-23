// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      badgeContent: 'new',
      badgeColor: 'error',
      children: [
        {
          title: 'Analytics',
          path: '/dashboards/analytics'
        }
      ]
    },
    {
      title: 'Listados Maestros',
      icon: 'tabler:database',
      children: [
        {
          title: 'Clientes',
          path: '/master-lists/clients'
        }
      ]
    },
    {
      title: 'Reporte de Cargas',
      icon: 'tabler:file-import',
      path: '/reportes-carga'
    }
  ]
}

export default navigation
