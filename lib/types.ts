
export interface GaugeStation {
  id: string
  usgsId: string
  name: string
  description?: string
  latitude: number
  longitude: number
  stationType: 'RIVER' | 'STREAM' | 'TIDAL' | 'COASTAL' | 'RESERVOIR'
  floodZoneId: string
  elevation?: number
  drainageArea?: number
  isActive: boolean
  lastUpdated?: Date
  floodZone: FloodZone
  readings: GaugeReading[]
  floodStages: FloodStage[]
  currentStage?: string
  riskLevel?: string
  latestReading?: GaugeReading
  trend?: 'rising' | 'falling' | 'stable'
}

export interface FloodZone {
  id: string
  name: string
  description?: string
  state: string
  county?: string
  city?: string
  latitude: number
  longitude: number
  population?: number
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME'
  bounds?: any // GeoJSON
}

export interface GaugeReading {
  id: string
  stationId: string
  timestamp: Date
  waterLevel: number
  discharge?: number
  temperature?: number
  ph?: number
  dissolvedO2?: number
  turbidity?: number
  velocity?: number
  gageHeight?: number
}

export interface FloodStage {
  id: string
  stationId: string
  stageType: 'ACTION' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'RECORD'
  level: number
  description?: string
  isActive: boolean
}

export interface FloodPrediction {
  id: string
  floodZoneId: string
  timeHorizon: number
  predictedAt: Date
  validFor: Date
  floodRisk: number
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'EXTREME'
  confidence: number
  affectedArea?: any
  waterLevel?: number
  modelVersion: string
  metadata?: any
  floodZone: FloodZone
}

export interface Alert {
  id: string
  userId: string
  floodZoneId: string
  alertType: 'WATER_LEVEL' | 'FLOOD_PREDICTION' | 'WEATHER_WARNING' | 'SYSTEM_STATUS'
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'EXTREME'
  threshold: number
  isActive: boolean
  emailEnabled: boolean
  smsEnabled: boolean
  lastTriggered?: Date
  triggerCount: number
  floodZone: FloodZone
  notifications: Notification[]
}

export interface Notification {
  id: string
  userId: string
  alertId?: string
  title: string
  message: string
  type: 'FLOOD_WARNING' | 'ALERT_TRIGGERED' | 'SYSTEM_UPDATE' | 'WEATHER_UPDATE'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL'
  isRead: boolean
  emailSent: boolean
  smsSent: boolean
  metadata?: any
  createdAt: Date
}

export interface User {
  id: string
  name?: string
  email: string
  role: 'PUBLIC' | 'EMERGENCY_RESPONDER' | 'GOVERNMENT_AGENCY' | 'RESEARCHER' | 'ADMIN'
  organization?: string
  phoneNumber?: string
}
