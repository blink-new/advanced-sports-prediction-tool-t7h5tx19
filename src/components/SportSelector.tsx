import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Zap, 
  Trophy, 
  Target, 
  Timer,
  Dumbbell
} from 'lucide-react'

interface SportSelectorProps {
  selectedSport: string
  onSportChange: (sport: string) => void
}

const sports = [
  {
    id: 'soccer',
    name: 'Soccer',
    icon: Zap,
    description: 'FIFA leagues worldwide',
    color: 'bg-green-500',
    popularity: 95
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: Target,
    description: 'ATP & WTA tournaments',
    color: 'bg-yellow-500',
    popularity: 85
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: Trophy,
    description: 'NBA, EuroLeague & more',
    color: 'bg-orange-500',
    popularity: 90
  },
  {
    id: 'hockey',
    name: 'Hockey',
    icon: Timer,
    description: 'NHL & international',
    color: 'bg-blue-500',
    popularity: 75
  },
  {
    id: 'table_tennis',
    name: 'Table Tennis',
    icon: Dumbbell,
    description: 'ITTF competitions',
    color: 'bg-purple-500',
    popularity: 70
  }
]

export function SportSelector({ selectedSport, onSportChange }: SportSelectorProps) {
  return (
    <div className="space-y-4">
      {sports.map((sport) => {
        const Icon = sport.icon
        const isSelected = selectedSport === sport.id
        
        return (
          <Button
            key={sport.id}
            variant={isSelected ? 'default' : 'outline'}
            className={`w-full p-4 h-auto flex items-start space-x-3 text-left ${
              isSelected 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white' 
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => onSportChange(sport.id)}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isSelected ? 'bg-white/20' : sport.color
            }`}>
              <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-white'}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{sport.name}</span>
                <Badge 
                  variant={isSelected ? 'secondary' : 'outline'}
                  className={`text-xs ${isSelected ? 'bg-white/20 text-white border-white/30' : ''}`}
                >
                  {sport.popularity}% Popular
                </Badge>
              </div>
              <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                {sport.description}
              </p>
            </div>
          </Button>
        )
      })}
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-gray-900 mb-2">AI Analysis Features</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Real-time team performance data</li>
          <li>• Historical head-to-head analysis</li>
          <li>• Player injury and form tracking</li>
          <li>• Advanced statistical modeling</li>
        </ul>
      </div>
    </div>
  )
}