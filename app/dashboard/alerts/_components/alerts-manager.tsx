
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Bell, 
  Plus, 
  Mail, 
  MessageSquare, 
  MapPin,
  Trash2,
  Settings,
  AlertTriangle,
  Check
} from 'lucide-react'
import type { Alert as AlertType, FloodZone } from '@/lib/types'

export function AlertsManager() {
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [floodZones, setFloodZones] = useState<FloodZone[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAlert, setNewAlert] = useState({
    floodZoneId: '',
    alertType: 'WATER_LEVEL',
    severity: 'MODERATE',
    threshold: 12.0,
    emailEnabled: true,
    smsEnabled: false
  })

  useEffect(() => {
    fetchAlerts()
    fetchFloodZones()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts')
      const data = await response.json()
      
      if (data.success) {
        setAlerts(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }

  const fetchFloodZones = async () => {
    try {
      const response = await fetch('/api/usgs/gauges?limit=50')
      const data = await response.json()
      
      if (data.success) {
        // Extract unique flood zones from gauge stations
        const uniqueZones = Array.from(
          new Map(data.data.map((station: any) => [station.floodZone.id, station.floodZone])).values()
        )
        setFloodZones(uniqueZones as FloodZone[])
      }
    } catch (error) {
      console.error('Failed to fetch flood zones:', error)
    } finally {
      setLoading(false)
    }
  }

  const createAlert = async () => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlert),
      })

      const data = await response.json()
      
      if (data.success) {
        setAlerts([...alerts, data.data])
        setShowCreateForm(false)
        setNewAlert({
          floodZoneId: '',
          alertType: 'WATER_LEVEL',
          severity: 'MODERATE',
          threshold: 12.0,
          emailEnabled: true,
          smsEnabled: false
        })
      }
    } catch (error) {
      console.error('Failed to create alert:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'EXTREME': return 'bg-red-100 text-red-800 border-red-300'
      case 'SEVERE': return 'bg-red-100 text-red-700 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-green-100 text-green-800 border-green-300'
    }
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'WATER_LEVEL': return <Bell className="h-4 w-4" />
      case 'FLOOD_PREDICTION': return <AlertTriangle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Alert Management</h1>
          <p className="text-gray-600">Configure personalized flood alerts and notifications</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="notifications">Recent Notifications</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Create Alert Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Alert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Flood Zone</Label>
                    <Select 
                      value={newAlert.floodZoneId} 
                      onValueChange={(value) => setNewAlert({...newAlert, floodZoneId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select flood zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {floodZones.map(zone => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Alert Type</Label>
                    <Select 
                      value={newAlert.alertType} 
                      onValueChange={(value) => setNewAlert({...newAlert, alertType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WATER_LEVEL">Water Level</SelectItem>
                        <SelectItem value="FLOOD_PREDICTION">Flood Prediction</SelectItem>
                        <SelectItem value="WEATHER_WARNING">Weather Warning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Severity Level</Label>
                    <Select 
                      value={newAlert.severity} 
                      onValueChange={(value) => setNewAlert({...newAlert, severity: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MODERATE">Moderate</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="SEVERE">Severe</SelectItem>
                        <SelectItem value="EXTREME">Extreme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Threshold (ft)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAlert.threshold}
                      onChange={(e) => setNewAlert({...newAlert, threshold: parseFloat(e.target.value)})}
                      placeholder="12.0"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newAlert.emailEnabled}
                      onCheckedChange={(checked) => setNewAlert({...newAlert, emailEnabled: checked})}
                    />
                    <Label className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email Notifications
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newAlert.smsEnabled}
                      onCheckedChange={(checked) => setNewAlert({...newAlert, smsEnabled: checked})}
                    />
                    <Label className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      SMS Notifications
                    </Label>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={createAlert} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Alerts List */}
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first alert to start monitoring flood conditions in your area
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </CardContent>
              </Card>
            ) : (
              alerts.map((alert) => (
                <Card key={alert.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getAlertTypeIcon(alert.alertType)}
                          <h3 className="font-medium text-gray-900">{alert.floodZone.name}</h3>
                          <Badge className={`text-xs border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </Badge>
                          {alert.isActive ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300 text-xs border">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-xs border">
                              Inactive
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <div className="text-gray-500 mb-1">Type</div>
                            <div className="font-medium capitalize">
                              {alert.alertType.replace('_', ' ').toLowerCase()}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Threshold</div>
                            <div className="font-medium">{alert.threshold} ft</div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Triggered</div>
                            <div className="font-medium">{alert.triggerCount} times</div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Last Triggered</div>
                            <div className="font-medium text-xs">
                              {alert.lastTriggered 
                                ? new Date(alert.lastTriggered).toLocaleDateString()
                                : 'Never'
                              }
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            <span className={alert.emailEnabled ? 'text-green-600' : 'text-gray-400'}>
                              Email {alert.emailEnabled ? 'enabled' : 'disabled'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span className={alert.smsEnabled ? 'text-green-600' : 'text-gray-400'}>
                              SMS {alert.smsEnabled ? 'enabled' : 'disabled'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent notifications</p>
                <p className="text-sm">Notifications will appear here when alerts are triggered</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive flood alerts via email</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-gray-600">Receive urgent alerts via SMS</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Daily Summary</div>
                    <div className="text-sm text-gray-600">Daily report of flood conditions</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly Forecast</div>
                    <div className="text-sm text-gray-600">Weekly flood risk forecast</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email Alert Info */}
      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          <strong>Email Alerts:</strong> Email notifications are managed through the UI. 
          In a production environment, this would integrate with email services like SendGrid, 
          AWS SES, or similar providers for actual email delivery.
        </AlertDescription>
      </Alert>
    </div>
  )
}
