import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Loader2, Brain, TrendingUp, AlertCircle } from 'lucide-react'
import { User, Prediction } from '../App'
import { blink } from '../blink/client'
import { Alert, AlertDescription } from './ui/alert'

interface PredictionFormProps {
  sport: string
  onPredictionComplete: (prediction: Prediction) => void
  user: User | null
}

export function PredictionForm({ sport, onPredictionComplete, user }: PredictionFormProps) {
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !homeTeam.trim() || !awayTeam.trim()) return

    setLoading(true)
    setError('')

    try {
      // Get real sports data and generate AI prediction
      const prediction = await generateAdvancedPrediction(sport, homeTeam.trim(), awayTeam.trim())
      
      // Save to database
      const savedPrediction = await blink.db.predictions.create({
        user_id: user.id,
        sport,
        home_team: homeTeam.trim(),
        away_team: awayTeam.trim(),
        predicted_home_score: prediction.predicted_home_score,
        predicted_away_score: prediction.predicted_away_score,
        confidence_percentage: prediction.confidence_percentage,
        prediction_factors: JSON.stringify(prediction.factors),
        status: 'pending'
      })

      onPredictionComplete(savedPrediction as Prediction)
      
      // Reset form
      setHomeTeam('')
      setAwayTeam('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate prediction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="home-team" className="text-sm font-medium text-gray-700">
            Home Team
          </Label>
          <Input
            id="home-team"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            placeholder={getPlaceholder(sport, 'home')}
            className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="away-team" className="text-sm font-medium text-gray-700">
            Away Team
          </Label>
          <Input
            id="away-team"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            placeholder={getPlaceholder(sport, 'away')}
            className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">AI Analysis Engine</span>
        </div>
        <p className="text-sm text-gray-600">
          Our advanced AI will analyze team performance, recent form, head-to-head records, 
          player statistics, and current market data to generate highly accurate predictions.
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading || !homeTeam.trim() || !awayTeam.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Teams & Generating Prediction...
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4 mr-2" />
            Generate AI Prediction
          </>
        )}
      </Button>
    </form>
  )
}

function getPlaceholder(sport: string, type: 'home' | 'away'): string {
  const examples = {
    soccer: type === 'home' ? 'e.g., Manchester United' : 'e.g., Liverpool',
    tennis: type === 'home' ? 'e.g., Novak Djokovic' : 'e.g., Rafael Nadal',
    basketball: type === 'home' ? 'e.g., Lakers' : 'e.g., Warriors',
    hockey: type === 'home' ? 'e.g., Rangers' : 'e.g., Bruins',
    table_tennis: type === 'home' ? 'e.g., Ma Long' : 'e.g., Fan Zhendong'
  }
  return examples[sport as keyof typeof examples] || `Enter ${type} team`
}

async function generateAdvancedPrediction(sport: string, homeTeam: string, awayTeam: string) {
  try {
    // Use Blink's secure API proxy to fetch real sports data
    const sportsData = await fetchRealSportsData(sport, homeTeam, awayTeam)
    
    // Generate AI-powered prediction using real data
    const predictionPrompt = `
      Analyze this ${sport} match and provide a detailed prediction:
      
      Home Team: ${homeTeam}
      Away Team: ${awayTeam}
      Sport: ${sport}
      
      Real Data Context: ${JSON.stringify(sportsData)}
      
      Please provide:
      1. Predicted final score for both teams
      2. Confidence percentage (0-100)
      3. Key factors influencing the prediction
      4. Risk assessment
      
      Consider: recent form, head-to-head records, player injuries, home advantage, 
      current league position, and any other relevant factors.
      
      Return as JSON with: predicted_home_score, predicted_away_score, confidence_percentage, factors (array of strings)
    `

    const { object: prediction } = await blink.ai.generateObject({
      prompt: predictionPrompt,
      schema: {
        type: 'object',
        properties: {
          predicted_home_score: { type: 'number' },
          predicted_away_score: { type: 'number' },
          confidence_percentage: { type: 'number', minimum: 0, maximum: 100 },
          factors: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['predicted_home_score', 'predicted_away_score', 'confidence_percentage', 'factors']
      }
    })

    return prediction
  } catch (error) {
    console.error('Prediction generation failed:', error)
    throw new Error('Failed to generate prediction. Please try again.')
  }
}

async function fetchRealSportsData(sport: string, homeTeam: string, awayTeam: string) {
  try {
    // Use web search to get real-time sports data
    const searchQuery = `${homeTeam} vs ${awayTeam} ${sport} latest news stats performance`
    
    const searchResults = await blink.data.search(searchQuery, {
      type: 'news',
      limit: 10
    })

    // Also search for team statistics
    const homeTeamStats = await blink.data.search(`${homeTeam} ${sport} recent form statistics`, {
      limit: 5
    })

    const awayTeamStats = await blink.data.search(`${awayTeam} ${sport} recent form statistics`, {
      limit: 5
    })

    return {
      matchNews: searchResults.news_results?.slice(0, 5) || [],
      homeTeamData: homeTeamStats.organic_results?.slice(0, 3) || [],
      awayTeamData: awayTeamStats.organic_results?.slice(0, 3) || [],
      relatedSearches: searchResults.related_searches || []
    }
  } catch (error) {
    console.error('Failed to fetch real sports data:', error)
    // Return fallback data structure
    return {
      matchNews: [],
      homeTeamData: [],
      awayTeamData: [],
      relatedSearches: []
    }
  }
}