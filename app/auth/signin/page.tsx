
import { Metadata } from 'next'
import Link from 'next/link'
import { SignInForm } from './_components/signin-form'
import { Waves, Shield, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In - FloodWatch Pro',
  description: 'Sign in to access real-time flood monitoring and alerts',
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="flex min-h-screen">
        {/* Left side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-12 flex-col justify-center">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <Waves className="h-8 w-8" />
              <h1 className="text-2xl font-bold">FloodWatch Pro</h1>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">
              Real-time Flood Monitoring & Alerts
            </h2>
            
            <p className="text-blue-100 mb-8 leading-relaxed">
              Access comprehensive flood warning data from USGS gauge stations across the top flood-prone areas in the United States. Get ML-powered predictions and personalized alerts.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-300" />
                <span className="text-blue-100">Role-based access for emergency responders</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-300" />
                <span className="text-blue-100">Real-time alerts and notifications</span>
              </div>
              <div className="flex items-center space-x-3">
                <Waves className="h-5 w-5 text-blue-300" />
                <span className="text-blue-100">Interactive maps and data visualization</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign In Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4 lg:hidden">
                <Waves className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">FloodWatch Pro</h1>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-600 mt-2">Sign in to access your flood monitoring dashboard</p>
            </div>

            <SignInForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/auth/signup" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
