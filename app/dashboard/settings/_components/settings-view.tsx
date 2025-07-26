
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Key,
  Save,
  Building,
  Phone,
  Mail
} from 'lucide-react'

export function SettingsView() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'EMERGENCY_RESPONDER': return 'bg-red-100 text-red-800 border-red-300'
      case 'GOVERNMENT_AGENCY': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'RESEARCHER': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'ADMIN': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'EMERGENCY_RESPONDER': return 'Emergency Responder'
      case 'GOVERNMENT_AGENCY': return 'Government Agency'
      case 'RESEARCHER': return 'Researcher'
      case 'ADMIN': return 'Administrator'
      default: return 'General Public'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your account preferences and notification settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback className="text-lg">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {session?.user?.name || 'User Name'}
                  </h3>
                  <p className="text-gray-600">{session?.user?.email}</p>
                  <div className="mt-2">
                    <Badge className={`text-xs border ${getRoleBadgeColor(session?.user?.role || 'PUBLIC')}`}>
                      {getRoleDisplayName(session?.user?.role || 'PUBLIC')}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      defaultValue={session?.user?.name || ''}
                      className="pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue={session?.user?.email || ''}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="organization"
                      defaultValue={session?.user?.organization || ''}
                      className="pl-10"
                      placeholder="Enter your organization"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <div className="font-medium">Flood Alerts</div>
                    <div className="text-sm text-gray-600">Critical flood warnings and emergency alerts</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <div className="font-medium">Water Level Changes</div>
                    <div className="text-sm text-gray-600">Notifications when water levels exceed thresholds</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <div className="font-medium">Prediction Updates</div>
                    <div className="text-sm text-gray-600">ML model predictions and forecast updates</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <div className="font-medium">Daily Summary</div>
                    <div className="text-sm text-gray-600">Daily digest of flood conditions in your areas</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <div className="font-medium">Weekly Reports</div>
                    <div className="text-sm text-gray-600">Weekly summary and trend analysis</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">System Maintenance</div>
                    <div className="text-sm text-gray-600">Scheduled maintenance and system updates</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="email-delivery" defaultChecked className="rounded" />
                    <label htmlFor="email-delivery" className="text-sm">Email notifications</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="sms-delivery" className="rounded" />
                    <label htmlFor="sms-delivery" className="text-sm">SMS notifications (requires phone number)</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="push-delivery" defaultChecked className="rounded" />
                    <label htmlFor="push-delivery" className="text-sm">Browser push notifications</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Application Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select defaultValue="america/new_york">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/new_york">Eastern Time (EDT)</SelectItem>
                      <SelectItem value="america/chicago">Central Time (CDT)</SelectItem>
                      <SelectItem value="america/denver">Mountain Time (MDT)</SelectItem>
                      <SelectItem value="america/los_angeles">Pacific Time (PDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Units</Label>
                  <Select defaultValue="imperial">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imperial">Imperial (ft, °F)</SelectItem>
                      <SelectItem value="metric">Metric (m, °C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Dashboard View</Label>
                  <Select defaultValue="overview">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="map">Flood Map</SelectItem>
                      <SelectItem value="predictions">Predictions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data Refresh Rate</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-gray-600">Switch to dark theme</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-refresh Data</div>
                    <div className="text-sm text-gray-600">Automatically update gauge readings</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Sound Alerts</div>
                    <div className="text-sm text-gray-600">Play sound for critical alerts</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </h4>
                  <div className="space-y-3 max-w-md">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-medium mb-3">Session Management</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <div className="font-medium text-sm">Current Session</div>
                        <div className="text-xs text-gray-600">
                          Last activity: {new Date().toLocaleString()}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-medium mb-3 text-red-600">Danger Zone</h4>
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="mb-3">
                      <div className="font-medium text-red-800">Delete Account</div>
                      <div className="text-sm text-red-700">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
