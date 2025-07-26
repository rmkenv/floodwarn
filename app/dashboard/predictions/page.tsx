
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '../_components/dashboard-layout'
import { PredictionsView } from './_components/predictions-view'

export default async function PredictionsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <DashboardLayout>
      <PredictionsView />
    </DashboardLayout>
  )
}
