
'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import type { GaugeStation } from '@/lib/types'

interface WaterLevelChartProps {
  gaugeStations: GaugeStation[]
}

export function WaterLevelChart({ gaugeStations }: WaterLevelChartProps) {
  if (!gaugeStations?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-lg font-medium">No gauge data available</div>
          <div className="text-sm">Check back later for updated readings</div>
        </div>
      </div>
    )
  }

  // Create sample time series data for visualization
  const timePoints = Array.from({ length: 24 }, (_, i) => {
    const date = new Date()
    date.setHours(date.getHours() - (23 - i))
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  })

  const chartData = timePoints.map((time, index) => {
    const dataPoint: any = { time }
    
    gaugeStations.forEach((station, stationIndex) => {
      // Generate realistic water level variations
      const baseLevel = station.latestReading?.waterLevel || 8
      const variation = Math.sin((index + stationIndex * 2) * 0.2) * 1.5 + Math.random() * 0.5 - 0.25
      const stationKey = `station_${stationIndex}`
      dataPoint[stationKey] = Math.max(0, baseLevel + variation)
    })
    
    return dataPoint
  })

  const colors = ['#60B5FF', '#FF9149', '#FF9898', '#80D8C3', '#A19AD3']

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <XAxis 
            dataKey="time" 
            tickLine={false}
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={60}
            label={{ value: 'Time', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10 }}
            label={{ value: 'Water Level (ft)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px',
              fontSize: 11
            }}
            formatter={(value: any, name: string) => {
              const stationIndex = parseInt(name.split('_')[1])
              const stationName = gaugeStations[stationIndex]?.name || `Station ${stationIndex + 1}`
              return [`${Number(value).toFixed(1)} ft`, stationName]
            }}
          />
          <Legend 
            verticalAlign="top" 
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value: string) => {
              const stationIndex = parseInt(value.split('_')[1])
              return gaugeStations[stationIndex]?.floodZone?.city || `Station ${stationIndex + 1}`
            }}
          />
          {gaugeStations.map((station, index) => (
            <Line
              key={station.id}
              type="monotone"
              dataKey={`station_${index}`}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              name={`station_${index}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
