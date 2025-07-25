export const dynamic = 'force-dynamic'

import { DashboardFinanceiro } from '@/components/dashboard-financeiro'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'

export default function FinanceiroPage() {
  return (
    <DashboardLayoutWithSidebar>
      <DashboardFinanceiro />
    </DashboardLayoutWithSidebar>
  )
}
