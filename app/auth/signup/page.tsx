
import { Metadata } from 'next'
import Link from 'next/link'
import { SignUpForm } from './_components/signup-form'
import { Waves, Users, Building, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign Up - FloodWatch Pro',
  description: 'Create your account for comprehensive flood monitoring access',
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="flex min-h-screen">
        {/* Left side - User Types Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white p-12 flex-col justify-center">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <Waves className="h-8 w-8" />
              <h1 className="text-2xl font-bold">FloodWatch Pro</h1>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">
              Join Our Community
            </h2>
            
            <p className="text-green-100 mb-8 leading-relaxed">
              Choose your role and get access to tailored flood monitoring tools designed for your specific needs.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-green-300 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-100">General Public</h3>
                  <p className="text-sm text-green-200">Basic flood alerts and monitoring for your area</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Building className="h-6 w-6 text-green-300 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-100">Emergency Responders</h3>
                  <p className="text-sm text-green-200">Advanced tools and priority alerts for emergency response</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Search className="h-6 w-6 text-green-300 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-100">Researchers & Agencies</h3>
                  <p className="text-sm text-green-200">Full data access and analysis capabilities</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4 lg:hidden">
                <Waves className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">FloodWatch Pro</h1>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="text-gray-600 mt-2">Start monitoring flood conditions in your area</p>
            </div>

            <SignUpForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/auth/signin" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
