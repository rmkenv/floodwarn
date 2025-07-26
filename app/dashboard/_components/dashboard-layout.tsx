
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { 
  Waves, 
  Home, 
  Map, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  Menu,
  X,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Flood Map', href: '/dashboard/map', icon: Map },
    { name: 'Predictions', href: '/dashboard/predictions', icon: BarChart3 },
    { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'EMERGENCY_RESPONDER': return 'bg-red-100 text-red-800'
      case 'GOVERNMENT_AGENCY': return 'bg-blue-100 text-blue-800'
      case 'RESEARCHER': return 'bg-purple-100 text-purple-800'
      case 'ADMIN': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'EMERGENCY_RESPONDER': return 'Emergency Responder'
      case 'GOVERNMENT_AGENCY': return 'Government Agency'
      case 'RESEARCHER': return 'Researcher'
      case 'ADMIN': return 'Admin'
      default: return 'Public'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Waves className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">FloodWatch Pro</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          
          <div className="mb-3">
            <Badge className={`text-xs px-2 py-1 ${getRoleBadgeColor(session?.user?.role || 'PUBLIC')}`}>
              {getRoleDisplayName(session?.user?.role || 'PUBLIC')}
            </Badge>
          </div>

          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top header for mobile */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Waves className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">FloodWatch Pro</span>
            </div>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
