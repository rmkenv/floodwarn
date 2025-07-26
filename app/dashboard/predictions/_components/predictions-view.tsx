
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Brain,
  MapPin,
  RefreshCw,
  Calendar
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts'
import type { FloodPrediction } from '@/lib/types'

export function PredictionsView() {
  const [predictions, setPredictions] = useState<FloodPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<string>('all')
  const [selectedZone, setSelectedZone] = useState<string>('all')

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/predictions')
      const data = await response.json()
      
      if (data.success) {
        setPredictions(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPredictions = predictions.filter(pred => {
    const timeMatch = selectedTimeHorizon === 'all' || pred.timeHorizon.toString() === selectedTimeHorizon
    const zoneMatch = selectedZone === 'all' || pred.floodZoneId === selectedZone
    return timeMatch && zoneMatch
  })

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'EXTREME': return 'bg-red-100 text-red-800 border-red-300'
      case 'SEVERE': return 'bg-red-100 text-red-700 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-green-100 text-green-800 border-green-300'
    }
  }

  const getRiskChartData = () => {
    const timeHorizons = [1, 3, 6, 12, 24]
    return timeHorizons.map(horizon => {
      const horizonPreds = predictions.filter(p => p.timeHorizon === horizon)
      const avgRisk = horizonPreds.length > 0 
        ? horizonPreds.reduce((sum, p) => sum + p.floodRisk, 0) / horizonPreds.length 
        : 0
      const maxRisk = horizonPreds.length > 0 
        ? Math.max(...horizonPreds.map(p => p.floodRisk))
        : 0
      
      return {
        horizon: `${horizon}h`,
        avgRisk: Math.round(avgRisk * 100),
        maxRisk: Math.round(maxRisk * 100),
        count: horizonPreds.length
      }
    })
  }

  const getConfidenceData = () => {
    return predictions.reduce((acc: any[], pred) => {
      const existing = acc.find(item => item.zone === pred.floodZone.name)
      if (existing) {
        existing.predictions.push(pred)
        existing.avgConfidence = existing.predictions.reduce((sum: number, p: any) => sum + p.confidence, 0) / existing.predictions.length
      } else {
        acc.push({
          zone: pred.floodZone.name.split(' ')[0], // Shortened name
          predictions: [pred],
          avgConfidence: pred.confidence
        })
      }
      return acc
    }, []).slice(0, 10).map(item => ({
      zone: item.zone,
      confidence: Math.round(item.avgConfidence * 100)
    }))
  }

  const uniqueZones = Array.from(new Set(predictions.map(p => ({ id: p.floodZoneId, name: p.floodZone.name }))))

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ML Flood Predictions</h1>
          <p className="text-gray-600">Machine learning-powered flood forecasts across multiple time horizons</p>
        </div>
        <Button onClick={fetchPredictions} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Predictions
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Time Horizon</label>
              <Select value={selectedTimeHorizon} onValueChange={setSelectedTimeHorizon}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time Horizons</SelectItem>
                  <SelectItem value="1">1 Hour</SelectItem>
                  <SelectItem value="3">3 Hours</SelectItem>
                  <SelectItem value="6">6 Hours</SelectItem>
                  <SelectItem value="12">12 Hours</SelectItem>
                  <SelectItem value="24">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Flood Zone</label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select flood zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  {uniqueZones.map(zone => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk by Time Horizon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getRiskChartData()}>
                  <XAxis 
                    dataKey="horizon" 
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Risk (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: 11 }}
                    formatter={(value: any, name: string) => [`${value}%`, name === 'avgRisk' ? 'Average Risk' : 'Maximum Risk']}
                  />
                  <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="avgRisk" fill="#60B5FF" name="avgRisk" />
                  <Bar dataKey="maxRisk" fill="#FF6363" name="maxRisk" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getConfidenceData()}>
                  <XAxis 
                    dataKey="zone" 
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: 11 }}
                    formatter={(value: any) => [`${value}%`, 'Confidence']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#80D8C3" 
                    strokeWidth={2}
                    dot={{ fill: '#80D8C3', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictions List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPredictions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No predictions available for the selected filters</p>
              </div>
            ) : (
              filteredPredictions.slice(0, 20).map((prediction) => (
                <div key={prediction.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <h3 className="font-medium text-gray-900">{prediction.floodZone.name}</h3>
                        <Badge className={`text-xs border ${getSeverityColor(prediction.severity)}`}>
                          {prediction.severity}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Time Horizon</span>
                          </div>
                          <div className="font-medium">{prediction.timeHorizon} hours</div>
                        </div>
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>Flood Risk</span>
                          </div>
                          <div className="font-medium text-orange-600">
                            {Math.round(prediction.floodRisk * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <Brain className="h-3 w-3 mr-1" />
                            <span>Confidence</span>
                          </div>
                          <div className="font-medium text-blue-600">
                            {Math.round(prediction.confidence * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Valid For</span>
                          </div>
                          <div className="font-medium text-xs">
                            {new Date(prediction.validFor).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {prediction.metadata && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Model: {prediction.metadata.algorithm} | 
                        Features: {prediction.metadata.features?.join(', ')} |
                        Version: {prediction.modelVersion}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Model Information */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>ML Model Note:</strong> These predictions are generated using simulated machine learning models 
          for demonstration purposes. In production, these would be powered by real ML algorithms trained on 
          historical flood data, weather patterns, and hydrological models.
        </AlertDescription>
      </Alert>
    </div>
  )
}
