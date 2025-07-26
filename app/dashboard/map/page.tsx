
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '../_components/dashboard-layout'
import { FloodMap } from './_components/flood-map'

export default async function MapPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Interactive Flood Map</h1>
          <p className="text-gray-600">Real-time gauge stations and flood risk zones across monitored areas</p>
        </div>
        <FloodMap />
      </div>
    </DashboardLayout>
  )
}
