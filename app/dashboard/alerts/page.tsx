
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '../_components/dashboard-layout'
import { AlertsManager } from './_components/alerts-manager'

export default async function AlertsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <DashboardLayout>
      <AlertsManager />
    </DashboardLayout>
  )
}
