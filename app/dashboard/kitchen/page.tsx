export const dynamic = 'force-dynamic'

import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar';

export default function KitchenPage() {
  return (
    <DashboardLayoutWithSidebar>
      <div className="flex items-center justify-center min-h-[60vh] text-lg text-gray-600">
        Página de cozinha removida.
      </div>
    </DashboardLayoutWithSidebar>
  );
}