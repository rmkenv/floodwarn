
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

  // Create gauge stations for each zone using real USGS IDs
  console.log('📊 Creating gauge stations with real USGS IDs...')
  
  // Real USGS gauge station IDs for major flood-prone areas
  const realStations = [
    // New York Metropolitan Area
    { zoneIndex: 0, usgsId: '01305500', name: 'Nissequogue River Near Smithtown, NY', type: 'RIVER', lat: 40.8375, lng: -73.2042 },
    { zoneIndex: 0, usgsId: '01303500', name: 'Peconic River at Riverhead, NY', type: 'RIVER', lat: 40.9167, lng: -72.6625 },
    { zoneIndex: 0, usgsId: '01302020', name: 'Carmans River at Yaphank, NY', type: 'STREAM', lat: 40.8375, lng: -72.9542 },
    
    // Los Angeles Basin
    { zoneIndex: 1, usgsId: '11103010', name: 'Los Angeles River at Long Beach, CA', type: 'RIVER', lat: 33.8008, lng: -118.1653 },
    { zoneIndex: 1, usgsId: '11108500', name: 'Santa Clara River at Montalvo, CA', type: 'RIVER', lat: 34.2544, lng: -119.1431 },
    { zoneIndex: 1, usgsId: '11074000', name: 'Santa Ana River at Santa Ana, CA', type: 'RIVER', lat: 33.7508, lng: -117.9114 },
    
    // Chicago Metropolitan Area
    { zoneIndex: 2, usgsId: '05536995', name: 'Chicago Sanitary And Ship Canal at Romeoville, IL', type: 'RIVER', lat: 41.6447, lng: -88.0895 },
    { zoneIndex: 2, usgsId: '05528000', name: 'Fox River at Dayton, IL', type: 'RIVER', lat: 41.3892, lng: -88.7940 },
    { zoneIndex: 2, usgsId: '05532500', name: 'Des Plaines River at Riverside, IL', type: 'RIVER', lat: 41.8247, lng: -87.8289 },
    
    // Houston-Galveston Area
    { zoneIndex: 3, usgsId: '08074500', name: 'Buffalo Bayou at Houston, TX', type: 'RIVER', lat: 29.7604, lng: -95.3698 },
    { zoneIndex: 3, usgsId: '08068500', name: 'Spring Creek near Spring, TX', type: 'STREAM', lat: 30.0799, lng: -95.4166 },
    { zoneIndex: 3, usgsId: '08070200', name: 'East Fork San Jacinto River near New Caney, TX', type: 'RIVER', lat: 30.1880, lng: -95.1855 },
    
    // Miami-Dade Area
    { zoneIndex: 4, usgsId: '02288800', name: 'Miami Canal at NW 36th Street, Miami, FL', type: 'RIVER', lat: 25.8067, lng: -80.3167 },
    { zoneIndex: 4, usgsId: '02289040', name: 'Little River Canal at NW 27th Avenue, Miami, FL', type: 'STREAM', lat: 25.8500, lng: -80.2833 },
    { zoneIndex: 4, usgsId: '02288900', name: 'Miami Canal at Palmetto Bypass, Miami, FL', type: 'RIVER', lat: 25.8433, lng: -80.3367 },
    
    // Washington DC Metro
    { zoneIndex: 5, usgsId: '01646500', name: 'Potomac River near Washington, DC', type: 'RIVER', lat: 38.9495, lng: -77.1200 },
    { zoneIndex: 5, usgsId: '01651000', name: 'Rock Creek at Sherrill Drive, Washington, DC', type: 'STREAM', lat: 38.9581, lng: -77.0489 },
    { zoneIndex: 5, usgsId: '01648000', name: 'Anacostia River at Hyattsville, MD', type: 'RIVER', lat: 38.9564, lng: -76.9569 },
    
    // Philadelphia Metropolitan
    { zoneIndex: 6, usgsId: '01467200', name: 'Delaware River at Benjamin Franklin Bridge, Philadelphia, PA', type: 'RIVER', lat: 39.9528, lng: -75.1347 },
    { zoneIndex: 6, usgsId: '01467150', name: 'Schuylkill River at Philadelphia, PA', type: 'RIVER', lat: 39.9625, lng: -75.1889 },
    { zoneIndex: 6, usgsId: '01463500', name: 'Delaware River at Trenton, NJ', type: 'RIVER', lat: 40.2203, lng: -74.7556 },
    
    // Boston Metropolitan
    { zoneIndex: 7, usgsId: '01104500', name: 'Charles River at Wellesley, MA', type: 'RIVER', lat: 42.3042, lng: -71.2661 },
    { zoneIndex: 7, usgsId: '01103500', name: 'Charles River near Dover, MA', type: 'RIVER', lat: 42.2453, lng: -71.2828 },
    { zoneIndex: 7, usgsId: '01105600', name: 'Neponset River at Norwood, MA', type: 'STREAM', lat: 42.1667, lng: -71.1833 },
    
    // San Francisco Bay Area
    { zoneIndex: 8, usgsId: '11181008', name: 'Alameda Creek at Union City, CA', type: 'STREAM', lat: 37.5933, lng: -122.0436 },
    { zoneIndex: 8, usgsId: '11460000', name: 'Russian River near Guerneville, CA', type: 'RIVER', lat: 38.5019, lng: -122.9956 },
    { zoneIndex: 8, usgsId: '11169000', name: 'Coyote Creek near Madrone, CA', type: 'STREAM', lat: 37.1553, lng: -121.7608 },
    
    // New Orleans Metropolitan
    { zoneIndex: 9, usgsId: '07374000', name: 'Mississippi River at New Orleans, LA', type: 'RIVER', lat: 29.9511, lng: -90.0715 },
    { zoneIndex: 9, usgsId: '073802330', name: 'Amite River near Denham Springs, LA', type: 'RIVER', lat: 30.4858, lng: -90.9534 },
    { zoneIndex: 9, usgsId: '07380120', name: 'Tickfaw River at Holden, LA', type: 'RIVER', lat: 30.5019, lng: -90.7695 }
  ]

  let stationCount = 0
  
  for (const stationData of realStations) {
    const zone = createdZones[stationData.zoneIndex]
    if (!zone) continue
    
    // Check if station already exists
    const existingStation = await prisma.gaugeStation.findFirst({
      where: { usgsId: stationData.usgsId }
    })
    
    if (existingStation) {
      console.log(`Station ${stationData.usgsId} already exists, skipping...`)
      continue
    }
    
    const station = await prisma.gaugeStation.create({
      data: {
        usgsId: stationData.usgsId,
        name: stationData.name,
        description: `Real USGS gauge station: ${stationData.name}`,
        latitude: stationData.lat,
        longitude: stationData.lng,
        stationType: stationData.type as any,
        floodZoneId: zone.id,
        elevation: 10 + Math.random() * 50,
        drainageArea: 100 + Math.random() * 5000,
        isActive: true,
        lastUpdated: new Date()
      }
    })

    // Create realistic flood stages for each station
    const baseLevel = 5 + Math.random() * 3 // Vary base levels
    const floodStages = [
      { 
        stageType: 'ACTION' as const, 
        level: baseLevel + 3 + Math.random() * 2, 
        description: 'Action stage - begin monitoring' 
      },
      { 
        stageType: 'MINOR' as const, 
        level: baseLevel + 6 + Math.random() * 2, 
        description: 'Minor flooding of low-lying areas' 
      },
      { 
        stageType: 'MODERATE' as const, 
        level: baseLevel + 10 + Math.random() * 2, 
        description: 'Moderate flooding affects some structures' 
      },
      { 
        stageType: 'MAJOR' as const, 
        level: baseLevel + 15 + Math.random() * 3, 
        description: 'Major flooding - evacuations may be needed' 
      }
    ]

    for (const stage of floodStages) {
      await prisma.floodStage.create({
        data: {
          stationId: station.id,
          ...stage
        }
      })
    }

    // Create realistic sample readings for the last 48 hours (reduced from mock data)
    const now = new Date()
    for (let h = 48; h >= 0; h -= 2) { // Every 2 hours instead of hourly to reduce data volume
      const timestamp = new Date(now.getTime() - h * 60 * 60 * 1000)
      
      // More realistic water level patterns
      const seasonalFactor = Math.sin((new Date().getMonth() - 3) * Math.PI / 6) * 0.5
      const dailyFactor = Math.sin(h * Math.PI / 12) * 0.3
      const randomFactor = (Math.random() - 0.5) * 0.5
      
      const baseLevel = 4 + seasonalFactor + dailyFactor + randomFactor
      
      await prisma.gaugeReading.create({
        data: {
          stationId: station.id,
          timestamp,
          waterLevel: Math.max(0.5, baseLevel),
          discharge: Math.max(10, 200 + seasonalFactor * 100 + Math.random() * 200),
          temperature: 10 + Math.sin((new Date().getMonth() - 1) * Math.PI / 6) * 15 + Math.random() * 5,
          ph: 6.5 + Math.random() * 1.5,
          dissolvedO2: 7 + Math.random() * 3,
          turbidity: Math.random() * 30,
          velocity: 0.5 + Math.random() * 2,
          gageHeight: Math.max(0, baseLevel - 0.5)
        }
      })
    }

    stationCount++
    
    // Brief pause to avoid overwhelming the database
    if (stationCount % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  console.log(`✅ Created ${stationCount} gauge stations with real USGS IDs and sample readings`)

  // Note: Real ML predictions are now generated by the ensemble predictor system
  // Use the ML training pipeline to train models and generate predictions
  console.log('🔮 Real ML predictions will be generated by the ensemble predictor system')
  console.log('   To start ML training: POST /api/ml/train with action: "start_pipeline"')
  console.log('   To generate predictions: POST /api/predictions with { floodZoneId: "zone_id" }')

  // Create sample alerts for test user
  console.log('🚨 Creating sample alerts...')
  
  const sampleZones = createdZones.slice(0, 3) // First 3 zones
  
  for (const zone of sampleZones) {
    await prisma.alert.upsert({
      where: {
        userId_floodZoneId_alertType: {
          userId: testUser.id,
          floodZoneId: zone.id,
          alertType: 'WATER_LEVEL'
        }
      },
      update: {
        severity: 'MODERATE',
        threshold: 12.0,
        emailEnabled: true,
        smsEnabled: false
      },
      create: {
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
  console.log(`\n📊 Summary:\n- Flood zones: ${createdZones.length}\n- Real USGS gauge stations: ${stationCount}\n- Test user: john@doe.com (password: johndoe123)\n- Ready for ML training and real predictions!\n\n🚀 Next Steps:\n1. Start the ML training pipeline: POST /api/ml/train { "action": "start_pipeline" }\n2. Test real USGS data collection: POST /api/usgs/gauges { "action": "update_all" }\n3. Generate real ML predictions: POST /api/predictions { "floodZoneId": "zone_id" }\n4. View the application: http://localhost:3000\n  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
