import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Header } from './components/Header'
import { SportSelector } from './components/SportSelector'
import { PredictionForm } from './components/PredictionForm'
import { PredictionResults } from './components/PredictionResults'
import { PredictionHistory } from './components/PredictionHistory'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { LiveMatchTracker } from './components/LiveMatchTracker'
import { AuthGuard } from './components/AuthGuard'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Card } from './components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Badge } from './components/ui/badge'
import { Activity, BarChart3, Brain, History, Play, Target, TrendingUp, Trophy } from 'lucide-react'

export interface User {
  id: string
  email: string
  displayName?: string
}

export interface Prediction {
  id: string
  sport: string
  home_team: string
  away_team: string
  predicted_home_score: number
  predicted_away_score: number
  confidence_percentage: number
  prediction_factors: string
  status: string
  created_at: string
  actual_home_score?: number
  actual_away_score?: number
  league_name?: string
  venue?: string
  match_date?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSport, setSelectedSport] = useState<string>('soccer')
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [activeTab, setActiveTab] = useState('predict')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user as User | null)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (user) {
      loadPredictions()
    }
  }, [user])

  const loadPredictions = async () => {
    if (!user) return
    
    try {
      const data = await blink.db.predictions.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' },
        limit: 50
      })
      setPredictions(data)
    } catch (error) {
      console.error('Failed to load predictions:', error)
    }
  }

  const handlePredictionComplete = (prediction: Prediction) => {
    setCurrentPrediction(prediction)
    setActiveTab('results')
    loadPredictions()
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'predict': return Brain
      case 'results': return TrendingUp
      case 'live': return Play
      case 'analytics': return BarChart3
      case 'history': return History
      default: return Brain
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AuthGuard user={user}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header user={user} />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900">
                  Advanced Sports Prediction Engine
                </h1>
                <p className="text-lg text-gray-600">
                  The world's most sophisticated AI-powered sports analysis platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-6">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Real-Time AI Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">85%+ Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Live Match Tracking</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="predict" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="predict" className="text-sm font-medium flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>Predict</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="text-sm font-medium flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Results</span>
              </TabsTrigger>
              <TabsTrigger value="live" className="text-sm font-medium flex items-center space-x-1">
                <Play className="w-4 h-4" />
                <span>Live Tracker</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm font-medium flex items-center space-x-1">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="text-sm font-medium flex items-center space-x-1">
                <Activity className="w-4 h-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="predict" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">
                      Select Sport
                    </h2>
                    <SportSelector 
                      selectedSport={selectedSport}
                      onSportChange={setSelectedSport}
                    />
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">
                      Match Prediction
                    </h2>
                    <PredictionForm 
                      sport={selectedSport}
                      onPredictionComplete={handlePredictionComplete}
                      user={user}
                    />
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <PredictionResults 
                  prediction={currentPrediction}
                  sport={selectedSport}
                />
              </Card>
            </TabsContent>

            <TabsContent value="live">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <LiveMatchTracker 
                  sport={selectedSport}
                  predictions={predictions}
                  onPredictionUpdate={loadPredictions}
                  user={user}
                />
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <AnalyticsDashboard 
                  predictions={predictions}
                  user={user}
                />
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <PredictionHistory 
                  predictions={predictions}
                  onRefresh={loadPredictions}
                />
              </Card>
            </TabsContent>
          </Tabs>

          {/* Stats Footer */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <Brain className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <div className="text-2xl font-bold text-blue-900 mb-1">AI-Powered</div>
              <div className="text-sm text-blue-700">Advanced Machine Learning</div>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <BarChart3 className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <div className="text-2xl font-bold text-green-900 mb-1">85%+</div>
              <div className="text-sm text-green-700">Prediction Accuracy</div>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <Activity className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <div className="text-2xl font-bold text-purple-900 mb-1">Real-Time</div>
              <div className="text-sm text-purple-700">Live Match Data</div>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <Trophy className="w-8 h-8 mx-auto mb-3 text-orange-600" />
              <div className="text-2xl font-bold text-orange-900 mb-1">5 Sports</div>
              <div className="text-sm text-orange-700">Multi-Sport Coverage</div>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

export default App