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
      title: 'ESTADISTICAS Y GRAFICAS',
      icon: 'tabler:chart-bar',
      path: '/analytics',
      action: 'read',
      subject: 'analytics'
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
    }
  ]
}

export default navigation
