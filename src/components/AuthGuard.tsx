import { ReactNode } from 'react'
import { User } from '../App'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Trophy, TrendingUp, Target, Zap } from 'lucide-react'
import { blink } from '../blink/client'

interface AuthGuardProps {
  user: User | null
  children: ReactNode
}

export function AuthGuard({ user, children }: AuthGuardProps) {
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sports Prediction Engine
            </h1>
            <p className="text-gray-600">
              Advanced AI-powered predictions for professional sports
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">Real-time data analysis</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Multi-sport predictions</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700">AI-powered insights</span>
            </div>
          </div>

          <Button 
            onClick={() => blink.auth.login()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3"
          >
            Sign In to Continue
          </Button>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}