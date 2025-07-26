
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ensemblePredictor } from '@/ml/models/ensemble-predictor'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const floodZoneId = searchParams.get('floodZoneId')
    const timeHorizon = searchParams.get('timeHorizon')
    const realTime = searchParams.get('realTime') === 'true'

    // If realTime is requested, generate fresh ML predictions
    if (realTime && floodZoneId) {
      console.log(`Generating real-time ML predictions for zone ${floodZoneId}`)
      
      try {
        const ensemblePrediction = await ensemblePredictor.predict(floodZoneId)
        
        // Save predictions to database
        const savedPredictions = []
        
        for (const prediction of ensemblePrediction.predictions) {
          const savedPrediction = await prisma.floodPrediction.create({
            data: {
              floodZoneId: ensemblePrediction.floodZoneId,
              timeHorizon: prediction.timeHorizon,
              predictedAt: ensemblePrediction.metadata.predictedAt,
              validFor: new Date(Date.now() + prediction.timeHorizon * 60 * 60 * 1000),
              floodRisk: prediction.floodRisk,
              severity: prediction.severity,
              confidence: prediction.confidence,
              waterLevel: prediction.waterLevel,
              modelVersion: ensemblePrediction.metadata.modelVersion,
              metadata: {
                ensembleWeights: ensemblePrediction.ensembleWeights as any,
                dataQuality: ensemblePrediction.metadata.dataQuality,
                weatherFactors: ensemblePrediction.metadata.weatherFactors,
                modelContributions: Object.keys(ensemblePrediction.modelContributions)
              }
            },
            include: {
              floodZone: true
            }
          })
          
          savedPredictions.push(savedPrediction)
        }

        return NextResponse.json({
          success: true,
          data: savedPredictions,
          count: savedPredictions.length,
          lastUpdated: ensemblePrediction.metadata.predictedAt.toISOString(),
          realTimePrediction: true,
          modelInfo: {
            version: ensemblePrediction.metadata.modelVersion,
            dataQuality: ensemblePrediction.metadata.dataQuality,
            ensembleWeights: ensemblePrediction.ensembleWeights,
            availableModels: Object.keys(ensemblePrediction.modelContributions)
          }
        })
        
      } catch (mlError) {
        console.error('ML prediction failed, falling back to database:', mlError)
        // Fall through to database query
      }
    }

    // Standard database query for cached predictions
    let predictions
    const whereClause: any = {
      validFor: {
        gte: new Date()
      }
    }

    if (floodZoneId) {
      whereClause.floodZoneId = floodZoneId
    }

    if (timeHorizon) {
      whereClause.timeHorizon = parseInt(timeHorizon)
    }

    predictions = await prisma.floodPrediction.findMany({
      where: whereClause,
      include: {
        floodZone: true
      },
      orderBy: [
        { floodZoneId: 'asc' },
        { timeHorizon: 'asc' },
        { predictedAt: 'desc' }
      ],
      take: 100
    })

    return NextResponse.json({
      success: true,
      data: predictions,
      count: predictions.length,
      lastUpdated: new Date().toISOString(),
      realTimePrediction: false
    })

  } catch (error) {
    console.error('Predictions API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch predictions' },
      { status: 500 }
    )
  }
}

// Generate new ML predictions using ensemble models
export async function POST(request: Request) {
  try {
    const { floodZoneId, forceRetrain } = await request.json()

    if (!floodZoneId) {
      return NextResponse.json(
        { success: false, error: 'floodZoneId is required' },
        { status: 400 }
      )
    }

    const floodZone = await prisma.floodZone.findUnique({
      where: { id: floodZoneId },
      include: {
        gaugeStations: {
          where: { isActive: true },
          include: {
            readings: {
              orderBy: { timestamp: 'desc' },
              take: 48 // Last 48 hours for ML input
            }
          }
        }
      }
    })

    if (!floodZone) {
      return NextResponse.json(
        { success: false, error: 'Flood zone not found' },
        { status: 404 }
      )
    }

    if (floodZone.gaugeStations.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active gauge stations found for this zone' },
        { status: 400 }
      )
    }

    // Check if we have sufficient recent data
    const recentReadings = floodZone.gaugeStations.flatMap(s => s.readings)
    if (recentReadings.length < 24) {
      return NextResponse.json(
        { success: false, error: 'Insufficient recent data for ML prediction. Need at least 24 hours of readings.' },
        { status: 400 }
      )
    }

    // Force model retraining if requested
    if (forceRetrain) {
      console.log(`Force retraining models for zone ${floodZoneId}`)
      const retrainResult = await ensemblePredictor.updateModels(floodZoneId)
      if (!retrainResult) {
        console.warn('Model retraining failed, using existing models')
      }
    }

    // Generate ensemble predictions
    console.log(`Generating ML predictions for zone ${floodZoneId}`)
    const ensemblePrediction = await ensemblePredictor.predict(floodZoneId)

    // Validate prediction quality
    if (!ensemblePredictor.validatePrediction(ensemblePrediction)) {
      return NextResponse.json(
        { success: false, error: 'Generated prediction failed quality validation' },
        { status: 500 }
      )
    }

    // Save predictions to database
    const savedPredictions = []
    
    // Clear old predictions for this zone first
    await prisma.floodPrediction.deleteMany({
      where: {
        floodZoneId: floodZoneId,
        validFor: {
          lte: new Date()
        }
      }
    })

    for (const prediction of ensemblePrediction.predictions) {
      const validFor = new Date(Date.now() + prediction.timeHorizon * 60 * 60 * 1000)
      
      const savedPrediction = await prisma.floodPrediction.create({
        data: {
          floodZoneId: ensemblePrediction.floodZoneId,
          timeHorizon: prediction.timeHorizon,
          predictedAt: ensemblePrediction.metadata.predictedAt,
          validFor: validFor,
          floodRisk: prediction.floodRisk,
          severity: prediction.severity,
          confidence: prediction.confidence,
          waterLevel: prediction.waterLevel,
          modelVersion: ensemblePrediction.metadata.modelVersion,
          metadata: {
            ensembleWeights: ensemblePrediction.ensembleWeights as any,
            dataQuality: ensemblePrediction.metadata.dataQuality,
            weatherFactors: ensemblePrediction.metadata.weatherFactors,
            modelContributions: Object.keys(ensemblePrediction.modelContributions),
            inputFeatures: ensemblePrediction.metadata.inputFeatures
          }
        },
        include: {
          floodZone: true
        }
      })
      
      savedPredictions.push(savedPrediction)
    }

    console.log(`✅ Generated and saved ${savedPredictions.length} ML predictions for zone ${floodZoneId}`)

    return NextResponse.json({
      success: true,
      data: savedPredictions,
      count: savedPredictions.length,
      modelInfo: {
        version: ensemblePrediction.metadata.modelVersion,
        dataQuality: ensemblePrediction.metadata.dataQuality,
        predictedAt: ensemblePrediction.metadata.predictedAt,
        ensembleWeights: ensemblePrediction.ensembleWeights,
        availableModels: Object.keys(ensemblePrediction.modelContributions),
        weatherFactors: ensemblePrediction.metadata.weatherFactors
      }
    })

  } catch (error) {
    console.error('ML prediction generation error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate predictions' },
      { status: 500 }
    )
  }
}
