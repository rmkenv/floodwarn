
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MapPin, 
  Search, 
  Layers, 
  Waves, 
  AlertTriangle,
  TrendingUp,
  Info
} from 'lucide-react'
import type { GaugeStation } from '@/lib/types'

export function FloodMap() {
  const [gaugeStations, setGaugeStations] = useState<GaugeStation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStation, setSelectedStation] = useState<GaugeStation | null>(null)

  useEffect(() => {
    fetchGaugeStations()
  }, [])

  const fetchGaugeStations = async () => {
    try {
      const response = await fetch('/api/usgs/gauges?limit=30')
      const data = await response.json()
      
      if (data.success) {
        setGaugeStations(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch gauge stations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStations = gaugeStations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.floodZone?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.floodZone?.state?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (riskLevel: string) => {
    switch (riskLevel?.toUpperCase()) {
      case 'EXTREME': return 'bg-red-100 text-red-800 border-red-300'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-green-100 text-green-800 border-green-300'
    }
  }

  const getMarkerColor = (riskLevel: string) => {
    switch (riskLevel?.toUpperCase()) {
      case 'EXTREME': return 'bg-red-500'
      case 'HIGH': return 'bg-orange-500'
      case 'MODERATE': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by location, city, or station name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Layers className="h-4 w-4 mr-2" />
                Layers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Flood Monitoring Stations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-8 text-center h-96 flex flex-col items-center justify-center">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-6">
                  {filteredStations.slice(0, 24).map((station, index) => (
                    <button
                      key={station.id}
                      onClick={() => setSelectedStation(station)}
                      className={`relative p-2 rounded-full transition-all duration-200 hover:scale-110 ${getMarkerColor(station.riskLevel || 'LOW')}`}
                      style={{
                        left: `${(index % 6) * 5}px`,
                        top: `${Math.floor(index / 6) * 5}px`
                      }}
                      title={station.name}
                    >
                      <Waves className="h-3 w-3 text-white" />
                    </button>
                  ))}
                </div>
                
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Interactive Map View</h3>
                  <p className="text-blue-700 text-sm max-w-md">
                    This is a simplified map representation. Each dot represents a monitoring station. 
                    Click on stations to view detailed information.
                  </p>
                  <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span>Normal</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                      <span>Moderate</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                      <span>High</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                      <span>Extreme</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Station Details Panel */}
        <div className="space-y-6">
          {selectedStation ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Station Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{selectedStation.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedStation.floodZone?.city}, {selectedStation.floodZone?.state}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    USGS ID: {selectedStation.usgsId}
                  </p>
                </div>

                <div>
                  <Badge className={`${getStatusColor(selectedStation.riskLevel || 'LOW')} border`}>
                    {selectedStation.riskLevel || 'LOW'} RISK
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Water Level</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedStation.latestReading?.waterLevel?.toFixed(1) || 'N/A'} ft
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Trend</div>
                    <div className="flex items-center">
                      {selectedStation.trend === 'rising' && <TrendingUp className="h-4 w-4 text-red-500 mr-1" />}
                      {selectedStation.trend === 'falling' && <TrendingUp className="h-4 w-4 text-green-500 mr-1 rotate-180" />}
                      <span className="capitalize">{selectedStation.trend || 'Stable'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Discharge</div>
                    <div className="text-sm">
                      {selectedStation.latestReading?.discharge?.toFixed(0) || 'N/A'} cfs
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Temperature</div>
                    <div className="text-sm">
                      {selectedStation.latestReading?.temperature?.toFixed(1) || 'N/A'}°C
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-xs text-gray-500 mb-2">Last Updated</div>
                  <div className="text-sm">
                    {selectedStation.lastUpdated 
                      ? new Date(selectedStation.lastUpdated).toLocaleString()
                      : 'Unknown'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Info className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Select a Station</h3>
                <p className="text-sm text-gray-600">
                  Click on any station marker on the map to view detailed information
                </p>
              </CardContent>
            </Card>
          )}

          {/* Station List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredStations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => setSelectedStation(station)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-gray-50 ${
                      selectedStation?.id === station.id ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {station.floodZone?.city}, {station.floodZone?.state}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {station.name}
                        </div>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(station.riskLevel || 'LOW')}`}>
                        {station.riskLevel || 'LOW'}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legend and Info */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Map Note:</strong> This is a simplified visualization of monitoring stations. 
          In a production environment, this would integrate with mapping libraries like Mapbox or Google Maps 
          to show actual geographic locations and real-time overlays.
        </AlertDescription>
      </Alert>
    </div>
  )
}
