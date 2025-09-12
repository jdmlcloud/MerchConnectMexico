import { DashboardLayout } from "../../src/components/dashboard/layout"
import { StatsCards } from "../../src/components/dashboard/stats-cards"
import { RecentActivity } from "../../src/components/dashboard/recent-activity"
import { QuickActions } from "../../src/components/dashboard/quick-actions"

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
        </div>
        
        <StatsCards />
        
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  )
}