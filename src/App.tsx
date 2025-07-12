import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Header } from './components/Header'
import { SportSelector } from './components/SportSelector'
import { PredictionForm } from './components/PredictionForm'
import { PredictionResults } from './components/PredictionResults'
import { PredictionHistory } from './components/PredictionHistory'
import { AuthGuard } from './components/AuthGuard'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Card } from './components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'

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
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSport, setSelectedSport] = useState<string>('soccer')
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])

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
    loadPredictions()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <AuthGuard user={user}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header user={user} />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Advanced Sports Prediction Engine
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Harness the power of real-time data and AI to predict match outcomes across multiple sports with unprecedented accuracy.
            </p>
          </div>

          <Tabs defaultValue="predict" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="predict" className="text-sm font-medium">
                New Prediction
              </TabsTrigger>
              <TabsTrigger value="results" className="text-sm font-medium">
                Results
              </TabsTrigger>
              <TabsTrigger value="history" className="text-sm font-medium">
                History
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

            <TabsContent value="history">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <PredictionHistory 
                  predictions={predictions}
                  onRefresh={loadPredictions}
                />
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  )
}

export default App