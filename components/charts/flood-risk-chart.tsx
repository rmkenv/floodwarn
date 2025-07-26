
'use client'

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import type { FloodPrediction } from '@/lib/types'

interface FloodRiskChartProps {
  predictions: FloodPrediction[]
}

export function FloodRiskChart({ predictions }: FloodRiskChartProps) {
  if (!predictions?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-lg font-medium">No prediction data available</div>
          <div className="text-sm">Check back later for updated forecasts</div>
        </div>
      </div>
    )
  }

  // Group predictions by time horizon and calculate average risk
  const chartData = [1, 3, 6, 12, 24].map(horizon => {
    const horizonPredictions = predictions.filter(p => p.timeHorizon === horizon)
    const avgRisk = horizonPredictions.length > 0 
      ? horizonPredictions.reduce((sum, p) => sum + p.floodRisk, 0) / horizonPredictions.length 
      : 0
    
    const avgConfidence = horizonPredictions.length > 0 
      ? horizonPredictions.reduce((sum, p) => sum + p.confidence, 0) / horizonPredictions.length 
      : 0

    return {
      timeHorizon: `${horizon}h`,
      floodRisk: Math.round(avgRisk * 100), // Convert to percentage
      confidence: Math.round(avgConfidence * 100),
      count: horizonPredictions.length
    }
  })

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="floodRiskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6363" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FF6363" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60B5FF" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#60B5FF" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="timeHorizon" 
            tickLine={false}
            tick={{ fontSize: 10 }}
            label={{ value: 'Time Horizon', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10 }}
            label={{ value: 'Risk (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px',
              fontSize: 11
            }}
            formatter={(value: any, name: string) => [
              `${value}%`, 
              name === 'floodRisk' ? 'Flood Risk' : 'Confidence'
            ]}
          />
          <Legend 
            verticalAlign="top" 
            wrapperStyle={{ fontSize: 11 }}
          />
          <Area
            type="monotone"
            dataKey="floodRisk"
            stroke="#FF6363"
            fill="url(#floodRiskGradient)"
            strokeWidth={2}
            name="Flood Risk"
          />
          <Area
            type="monotone"
            dataKey="confidence"
            stroke="#60B5FF"
            fill="url(#confidenceGradient)"
            strokeWidth={2}
            name="Confidence"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
