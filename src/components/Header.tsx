import { User } from '../App'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Trophy, LogOut } from 'lucide-react'
import { blink } from '../blink/client'

interface HeaderProps {
  user: User | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SportsPredict Pro</h1>
            <p className="text-xs text-gray-500">Advanced AI Predictions</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
              <p className="text-xs text-gray-500">Premium Predictor</p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm">
                {(user.displayName || user.email)[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => blink.auth.logout()}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}