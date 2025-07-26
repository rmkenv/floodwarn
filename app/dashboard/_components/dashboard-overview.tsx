
'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Waves, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Activity,
  Droplets,
  Timer,
  Eye
} from 'lucide-react'
import { FloodRiskChart } from '@/components/charts/flood-risk-chart'
import { WaterLevelChart } from '@/components/charts/water-level-chart'
import type { GaugeStation, FloodPrediction } from '@/lib/types'

export function DashboardOverview() {
  const [gaugeStations, setGaugeStations] = useState<GaugeStation[]>([])
  const [predictions, setPredictions] = useState<FloodPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch gauge stations
      const gaugesResponse = await fetch('/api/usgs/gauges?limit=8')
      const gaugesData = await gaugesResponse.json()
      
      // Fetch predictions
      const predictionsResponse = await fetch('/api/predictions')
      const predictionsData = await predictionsResponse.json()
      
      if (gaugesData.success) {
        setGaugeStations(gaugesData.data)
      }
      
      if (predictionsData.success) {
        setPredictions(predictionsData.data)
      }
      
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (riskLevel: string) => {
    switch (riskLevel?.toUpperCase()) {
      case 'EXTREME': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'falling': return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
      default: return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const criticalGauges = gaugeStations.filter(g => g.riskLevel === 'HIGH' || g.riskLevel === 'EXTREME')
  const highRiskPredictions = predictions.filter(p => p.floodRisk > 0.3)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Flood Monitoring Dashboard</h1>
        <p className="text-gray-600">Real-time flood conditions and predictions across monitored areas</p>
      </div>

      {/* Critical Alerts */}
      {(criticalGauges.length > 0 || highRiskPredictions.length > 0) && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical Conditions Detected:</strong> {criticalGauges.length} gauge station(s) showing high risk levels and {highRiskPredictions.length} area(s) with elevated flood predictions.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
            <Waves className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gaugeStations.length}</div>
            <p className="text-xs text-gray-600">Monitoring flood conditions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Areas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{criticalGauges.length}</div>
            <p className="text-xs text-gray-600">Require close monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ML Predictions</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictions.length}</div>
            <p className="text-xs text-gray-600">Active forecasts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Elevated Risk</CardTitle>
            <Timer className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highRiskPredictions.length}</div>
            <p className="text-xs text-gray-600">Flood predictions &gt;30%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Flood Risk Overview</CardTitle>
            <CardDescription>Current flood risk levels across monitored areas</CardDescription>
          </CardHeader>
          <CardContent>
            <FloodRiskChart predictions={predictions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Water Level Trends</CardTitle>
            <CardDescription>Recent water level changes at key monitoring stations</CardDescription>
          </CardHeader>
          <CardContent>
            <WaterLevelChart gaugeStations={gaugeStations.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>

      {/* Active Monitoring Stations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Monitoring Stations</CardTitle>
          <CardDescription>Real-time status of gauge stations across flood-prone areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gaugeStations.slice(0, 8).map((station) => (
              <div
                key={station.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{station.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {station.floodZone?.city}, {station.floodZone?.state}
                    </div>
                  </div>
                  <Badge className={`text-xs px-2 py-1 ${getStatusColor(station.riskLevel || 'LOW')}`}>
                    {station.riskLevel || 'LOW'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                    <div>
                      <div className="font-medium">{station.latestReading?.waterLevel?.toFixed(1) || 'N/A'} ft</div>
                      <div className="text-gray-500 text-xs">Water Level</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {getTrendIcon(station.trend || 'stable')}
                    <div className="ml-2">
                      <div className="font-medium capitalize">{station.trend || 'Stable'}</div>
                      <div className="text-gray-500 text-xs">Trend</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
