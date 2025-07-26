
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '../_components/dashboard-layout'
import { SettingsView } from './_components/settings-view'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <DashboardLayout>
      <SettingsView />
    </DashboardLayout>
  )
}
