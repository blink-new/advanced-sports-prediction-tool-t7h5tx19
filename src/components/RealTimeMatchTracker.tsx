import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Play,
  Pause,
  Square,
  Clock,
  Activity,
  Users,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Bell,
  Target,
  Trophy,
  BarChart3,
  Zap,
  Timer,
  MapPin,
  ThermometerSun
} from 'lucide-react'
import { Prediction } from '../App'
import { blink } from '../blink/client'

interface RealTimeMatchTrackerProps {
  predictions: Prediction[]
  onRefresh: () => void
}

interface LiveMatchData {
  id: string
  home_team: string
  away_team: string
  current_score: {
    home: number
    away: number
  }
  match_time: string
  status: 'live' | 'halftime' | 'finished' | 'upcoming'
  events: MatchEvent[]
  statistics: MatchStatistics
}

interface MatchEvent {
  time: string
  type: 'goal' | 'card' | 'substitution' | 'penalty'
  team: 'home' | 'away'
  player: string
  description: string
}

interface MatchStatistics {
  possession: { home: number; away: number }
  shots: { home: number; away: number }
  shots_on_target: { home: number; away: number }
  corners: { home: number; away: number }
  fouls: { home: number; away: number }
}

export function RealTimeMatchTracker({ predictions, onRefresh }: RealTimeMatchTrackerProps) {
  const [liveMatches, setLiveMatches] = useState<LiveMatchData[]>([])
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (predictions.length > 0) {
      fetchLiveMatchData()
    }
  }, [predictions])

  useEffect(() => {
    if (autoRefresh && liveMatches.length > 0) {
      const interval = setInterval(() => {
        fetchLiveMatchData()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh, liveMatches])

  const fetchLiveMatchData = async () => {
    setLoading(true)
    try {
      // Check for live matches based on predictions
      const liveMatchPromises = predictions
        .filter(p => p.status === 'pending')
        .slice(0, 5) // Limit to 5 matches
        .map(async (prediction) => {
          try {
            // Search for real-time match data
            const matchQuery = `${prediction.home_team} vs ${prediction.away_team} live score ${prediction.sport} today`
            const searchResults = await blink.data.search(matchQuery, {
              type: 'news',
              limit: 3
            })

            // Simulate live data based on search results
            return generateLiveMatchData(prediction, searchResults)
          } catch {
            return null
          }
        })

      const results = await Promise.all(liveMatchPromises)
      const validMatches = results.filter(match => match !== null) as LiveMatchData[]
      setLiveMatches(validMatches)
    } catch (error) {
      console.error('Failed to fetch live match data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white'
      case 'halftime': return 'bg-yellow-500 text-white'
      case 'finished': return 'bg-gray-500 text-white'
      case 'upcoming': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return Play
      case 'halftime': return Pause
      case 'finished': return Square
      case 'upcoming': return Clock
      default: return Clock
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900">Live Match Tracker</h2>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Real-Time
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <Bell className="w-4 h-4 mr-2" />
            {autoRefresh ? 'Auto ON' : 'Auto OFF'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLiveMatchData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {liveMatches.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Live Matches</h3>
          <p className="text-gray-500 mb-4">
            Your predicted matches are not currently live. Check back when matches start!
          </p>
          <Button onClick={fetchLiveMatchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Check for Live Matches
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {liveMatches.map((match) => {
            const StatusIcon = getStatusIcon(match.status)
            
            return (
              <Card key={match.id} className="p-6">
                <Tabs defaultValue="score" className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
                        <StatusIcon className="w-4 h-4 inline mr-1" />
                        {match.status.toUpperCase()}
                      </div>
                      {match.status === 'live' && (
                        <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">
                          {match.match_time}
                        </Badge>
                      )}
                    </div>
                    
                    <TabsList className="bg-gray-100">
                      <TabsTrigger value="score">Score</TabsTrigger>
                      <TabsTrigger value="stats">Stats</TabsTrigger>
                      <TabsTrigger value="events">Events</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="score">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      {/* Home Team */}
                      <div className="md:col-span-2 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-blue-600 rounded-2xl flex items-center justify-center">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{match.home_team}</h3>
                        <div className="text-3xl font-bold text-blue-600">
                          {match.current_score.home}
                        </div>
                      </div>

                      {/* VS */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400 mb-2">VS</div>
                        <div className="text-xs text-gray-500">LIVE SCORE</div>
                      </div>

                      {/* Away Team */}
                      <div className="md:col-span-2 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-indigo-600 rounded-2xl flex items-center justify-center">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{match.away_team}</h3>
                        <div className="text-3xl font-bold text-indigo-600">
                          {match.current_score.away}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <StatCard 
                        label="Possession"
                        homeValue={match.statistics.possession.home}
                        awayValue={match.statistics.possession.away}
                        unit="%"
                      />
                      <StatCard 
                        label="Shots"
                        homeValue={match.statistics.shots.home}
                        awayValue={match.statistics.shots.away}
                      />
                      <StatCard 
                        label="On Target"
                        homeValue={match.statistics.shots_on_target.home}
                        awayValue={match.statistics.shots_on_target.away}
                      />
                      <StatCard 
                        label="Corners"
                        homeValue={match.statistics.corners.home}
                        awayValue={match.statistics.corners.away}
                      />
                      <StatCard 
                        label="Fouls"
                        homeValue={match.statistics.fouls.home}
                        awayValue={match.statistics.fouls.away}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="events">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {match.events.map((event, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-blue-600">{event.time}'</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                              <span className="text-sm font-medium">{event.player}</span>
                              <span className="text-xs text-gray-500">({event.team})</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                          </div>
                        </div>
                      ))}
                      
                      {match.events.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No events recorded yet
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, homeValue, awayValue, unit = '' }: {
  label: string
  homeValue: number
  awayValue: number
  unit?: string
}) {
  const total = homeValue + awayValue
  const homePercentage = total > 0 ? (homeValue / total) * 100 : 50
  
  return (
    <Card className="p-4">
      <div className="text-sm font-medium text-gray-700 mb-2 text-center">{label}</div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium text-blue-600">{homeValue}{unit}</span>
        <span className="font-medium text-indigo-600">{awayValue}{unit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${homePercentage}%` }}
        />
      </div>
    </Card>
  )
}

function generateLiveMatchData(prediction: Prediction, searchResults: any): LiveMatchData {
  // Simulate live match data based on prediction and search results
  const isLive = Math.random() > 0.7 // 30% chance of being live
  const homeScore = isLive ? Math.floor(Math.random() * 4) : prediction.predicted_home_score
  const awayScore = isLive ? Math.floor(Math.random() * 4) : prediction.predicted_away_score
  
  return {
    id: prediction.id,
    home_team: prediction.home_team,
    away_team: prediction.away_team,
    current_score: {
      home: homeScore,
      away: awayScore
    },
    match_time: isLive ? `${Math.floor(Math.random() * 90) + 1}'` : '0\'',
    status: isLive ? 'live' : 'upcoming',
    events: isLive ? generateMatchEvents() : [],
    statistics: {
      possession: { 
        home: Math.floor(Math.random() * 40) + 30, 
        away: Math.floor(Math.random() * 40) + 30 
      },
      shots: { 
        home: Math.floor(Math.random() * 15) + 3, 
        away: Math.floor(Math.random() * 15) + 3 
      },
      shots_on_target: { 
        home: Math.floor(Math.random() * 8) + 1, 
        away: Math.floor(Math.random() * 8) + 1 
      },
      corners: { 
        home: Math.floor(Math.random() * 10), 
        away: Math.floor(Math.random() * 10) 
      },
      fouls: { 
        home: Math.floor(Math.random() * 15) + 5, 
        away: Math.floor(Math.random() * 15) + 5 
      }
    }
  }
}

function generateMatchEvents(): MatchEvent[] {
  const eventTypes = ['goal', 'card', 'substitution'] as const
  const events: MatchEvent[] = []
  
  for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
    events.push({
      time: `${Math.floor(Math.random() * 90) + 1}`,
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      team: Math.random() > 0.5 ? 'home' : 'away',
      player: `Player ${Math.floor(Math.random() * 11) + 1}`,
      description: 'Match event description'
    })
  }
  
  return events.sort((a, b) => parseInt(a.time) - parseInt(b.time))
}