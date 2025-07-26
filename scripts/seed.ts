
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌊 Starting flood warning app seed...')

  // Create test user with admin privileges
  const hashedPassword = await bcrypt.hash('johndoe123', 12)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'ADMIN',
      organization: 'Test Organization'
    }
  })

  console.log('✅ Created test user:', testUser.email)

  // Top 10 flood-prone metropolitan areas
  const floodZones = [
    {
      name: 'New York Metropolitan Area',
      description: 'Coastal surge and urban flooding zone',
      state: 'NY',
      county: 'New York County',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060,
      population: 19200000,
      riskLevel: 'HIGH' as const,
      bounds: {
        type: 'Polygon',
        coordinates: [[
          [-74.25, 40.48], [-73.7, 40.48], [-73.7, 40.92], [-74.25, 40.92], [-74.25, 40.48]
        ]]
      }
    },
    {
      name: 'Los Angeles Basin',
      description: 'Urban river flooding and atmospheric river zone',
      state: 'CA',
      county: 'Los Angeles County',
      city: 'Los Angeles',
      latitude: 34.0522,
      longitude: -118.2437,
      population: 13200000,
      riskLevel: 'HIGH' as const
    },
    {
      name: 'Chicago Metropolitan Area',
      description: 'Great Lakes and river flooding zone',
      state: 'IL',
      county: 'Cook County',
      city: 'Chicago',
      latitude: 41.8781,
      longitude: -87.6298,
      population: 9500000,
      riskLevel: 'MODERATE' as const
    },
    {
      name: 'Houston-Galveston Area',
      description: 'Extreme rainfall and coastal surge zone',
      state: 'TX',
      county: 'Harris County',
      city: 'Houston',
      latitude: 29.7604,
      longitude: -95.3698,
      population: 7100000,
      riskLevel: 'EXTREME' as const
    },
    {
      name: 'Miami-Dade Area',
      description: 'Sea level rise and hurricane surge zone',
      state: 'FL',
      county: 'Miami-Dade County',
      city: 'Miami',
      latitude: 25.7617,
      longitude: -80.1918,
      population: 6300000,
      riskLevel: 'EXTREME' as const
    },
    {
      name: 'Washington DC Metro',
      description: 'Potomac River and urban flooding zone',
      state: 'DC',
      county: 'District of Columbia',
      city: 'Washington',
      latitude: 38.9072,
      longitude: -77.0369,
      population: 6500000,
      riskLevel: 'MODERATE' as const
    },
    {
      name: 'Philadelphia Metropolitan',
      description: 'Delaware River and urban flooding zone',
      state: 'PA',
      county: 'Philadelphia County',
      city: 'Philadelphia',
      latitude: 39.9526,
      longitude: -75.1652,
      population: 6100000,
      riskLevel: 'MODERATE' as const
    },
    {
      name: 'Boston Metropolitan',
      description: 'Coastal surge and historic flood zone',
      state: 'MA',
      county: 'Suffolk County',
      city: 'Boston',
      latitude: 42.3601,
      longitude: -71.0589,
      population: 4900000,
      riskLevel: 'HIGH' as const
    },
    {
      name: 'San Francisco Bay Area',
      description: 'Sea level rise and atmospheric river zone',
      state: 'CA',
      county: 'San Francisco County',
      city: 'San Francisco',
      latitude: 37.7749,
      longitude: -122.4194,
      population: 4700000,
      riskLevel: 'HIGH' as const
    },
    {
      name: 'New Orleans Metropolitan',
      description: 'Below sea level hurricane vulnerability zone',
      state: 'LA',
      county: 'Orleans Parish',
      city: 'New Orleans',
      latitude: 29.9511,
      longitude: -90.0715,
      population: 1300000,
      riskLevel: 'EXTREME' as const
    }
  ]

  console.log('🗺️  Creating flood zones...')
  const createdZones = []
  
  for (const zone of floodZones) {
    // Check if zone already exists
    const existingZone = await prisma.floodZone.findFirst({
      where: { name: zone.name }
    })
    
    let createdZone
    if (existingZone) {
      createdZone = await prisma.floodZone.update({
        where: { id: existingZone.id },
        data: zone
      })
    } else {
      createdZone = await prisma.floodZone.create({
        data: zone
      })
    }
    createdZones.push(createdZone)
  }

  console.log(`✅ Created ${createdZones.length} flood zones`)

  // Create gauge stations for each zone
  console.log('📊 Creating gauge stations...')
  
  const stationTemplates = [
    {
      nameTemplate: 'Main River Station',
      stationType: 'RIVER' as const,
      offsetLat: 0.01,
      offsetLng: 0.01,
      usgsIdPrefix: '01'
    },
    {
      nameTemplate: 'Coastal Monitoring Station',
      stationType: 'TIDAL' as const,
      offsetLat: -0.02,
      offsetLng: 0.02,
      usgsIdPrefix: '02'
    },
    {
      nameTemplate: 'Urban Stream Gauge',
      stationType: 'STREAM' as const,
      offsetLat: 0.015,
      offsetLng: -0.015,
      usgsIdPrefix: '03'
    }
  ]

  let stationCount = 0
  
  for (const zone of createdZones) {
    for (let i = 0; i < stationTemplates.length; i++) {
      const template = stationTemplates[i]
      
      const station = await prisma.gaugeStation.create({
        data: {
          usgsId: `${template.usgsIdPrefix}${String(stationCount).padStart(6, '0')}`,
          name: `${zone.name} - ${template.nameTemplate}`,
          description: `${template.stationType.toLowerCase()} monitoring station for ${zone.name}`,
          latitude: zone.latitude + template.offsetLat,
          longitude: zone.longitude + template.offsetLng,
          stationType: template.stationType,
          floodZoneId: zone.id,
          elevation: 10 + Math.random() * 50,
          drainageArea: 100 + Math.random() * 5000,
          isActive: true,
          lastUpdated: new Date()
        }
      })

      // Create flood stages for each station
      const floodStages = [
        { stageType: 'ACTION' as const, level: 8 + Math.random() * 2, description: 'Action stage - monitor conditions' },
        { stageType: 'MINOR' as const, level: 12 + Math.random() * 2, description: 'Minor flooding of low areas' },
        { stageType: 'MODERATE' as const, level: 16 + Math.random() * 2, description: 'Moderate flooding affects structures' },
        { stageType: 'MAJOR' as const, level: 20 + Math.random() * 3, description: 'Major flooding - evacuations needed' }
      ]

      for (const stage of floodStages) {
        await prisma.floodStage.create({
          data: {
            stationId: station.id,
            ...stage
          }
        })
      }

      // Create sample readings for the last 48 hours
      const now = new Date()
      for (let h = 48; h >= 0; h--) {
        const timestamp = new Date(now.getTime() - h * 60 * 60 * 1000)
        const baseLevel = 6 + Math.sin(h * 0.1) * 2 + Math.random() * 1.5
        
        await prisma.gaugeReading.create({
          data: {
            stationId: station.id,
            timestamp,
            waterLevel: Math.max(0, baseLevel),
            discharge: 500 + Math.random() * 1000,
            temperature: 15 + Math.random() * 10,
            ph: 7 + Math.random() * 1,
            dissolvedO2: 8 + Math.random() * 2,
            turbidity: Math.random() * 50,
            velocity: 1 + Math.random() * 3,
            gageHeight: Math.max(0, baseLevel - 1)
          }
        })
      }

      stationCount++
    }
  }

  console.log(`✅ Created ${stationCount} gauge stations with readings`)

  // Generate sample predictions
  console.log('🔮 Generating ML predictions...')
  
  const timeHorizons = [1, 3, 6, 12, 24]
  let predictionCount = 0

  for (const zone of createdZones) {
    for (const horizon of timeHorizons) {
      const baseRisk = zone.riskLevel === 'EXTREME' ? 0.7 : 
                      zone.riskLevel === 'HIGH' ? 0.4 : 
                      zone.riskLevel === 'MODERATE' ? 0.2 : 0.1
      
      const floodRisk = Math.min(baseRisk + Math.random() * 0.3, 1.0)
      const confidence = Math.max(0.9 - horizon * 0.05, 0.6)
      
      let severity = 'LOW'
      if (floodRisk > 0.7) severity = 'EXTREME'
      else if (floodRisk > 0.5) severity = 'SEVERE'
      else if (floodRisk > 0.3) severity = 'HIGH'
      else if (floodRisk > 0.15) severity = 'MODERATE'

      await prisma.floodPrediction.create({
        data: {
          floodZoneId: zone.id,
          timeHorizon: horizon,
          predictedAt: new Date(),
          validFor: new Date(Date.now() + horizon * 60 * 60 * 1000),
          floodRisk: Math.round(floodRisk * 100) / 100,
          severity: severity as any,
          confidence: Math.round(confidence * 100) / 100,
          waterLevel: 8 + Math.random() * 12,
          modelVersion: 'v1.0',
          metadata: {
            algorithm: 'RandomForest',
            features: ['water_level', 'discharge', 'precipitation', 'season'],
            weatherFactors: {
              precipitation: Math.random() * 3,
              temperature: 15 + Math.random() * 20,
              windSpeed: Math.random() * 25
            }
          }
        }
      })
      
      predictionCount++
    }
  }

  console.log(`✅ Generated ${predictionCount} ML predictions`)

  // Create sample alerts for test user
  console.log('🚨 Creating sample alerts...')
  
  const sampleZones = createdZones.slice(0, 3) // First 3 zones
  
  for (const zone of sampleZones) {
    await prisma.alert.create({
      data: {
        userId: testUser.id,
        floodZoneId: zone.id,
        alertType: 'WATER_LEVEL',
        severity: 'MODERATE',
        threshold: 12.0,
        emailEnabled: true,
        smsEnabled: false
      }
    })
  }

  console.log(`✅ Created alerts for test user`)

  // Create system status entries
  await prisma.systemStatus.upsert({
    where: { service: 'USGS_API' },
    update: {
      status: 'operational',
      lastChecked: new Date(),
      responseTime: 150 + Math.floor(Math.random() * 100)
    },
    create: {
      service: 'USGS_API',
      status: 'operational',
      lastChecked: new Date(),
      responseTime: 150 + Math.floor(Math.random() * 100)
    }
  })

  await prisma.systemStatus.upsert({
    where: { service: 'ML_PREDICTIONS' },
    update: {
      status: 'operational',
      lastChecked: new Date(),
      responseTime: 300 + Math.floor(Math.random() * 200)
    },
    create: {
      service: 'ML_PREDICTIONS',
      status: 'operational',
      lastChecked: new Date(),
      responseTime: 300 + Math.floor(Math.random() * 200)
    }
  })

  console.log('✅ Created system status entries')

  console.log('🎉 Seed completed successfully!')
  console.log(`
📊 Summary:
- Flood zones: ${createdZones.length}
- Gauge stations: ${stationCount}
- ML predictions: ${predictionCount}
- Test user: john@doe.com (password: johndoe123)
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
