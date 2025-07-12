import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Loader2, Brain, TrendingUp, AlertCircle, Calendar, MapPin, Trophy } from 'lucide-react'
import { User, Prediction } from '../App'
import { blink } from '../blink/client'
import { Alert, AlertDescription } from './ui/alert'

interface PredictionFormProps {
  sport: string
  onPredictionComplete: (prediction: Prediction) => void
  user: User | null
}

const sportLeagues = {
  soccer: [
    'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 
    'Champions League', 'Europa League', 'World Cup', 'Euro Championship'
  ],
  tennis: [
    'ATP Tour', 'WTA Tour', 'Grand Slam', 'Wimbledon', 'US Open', 
    'French Open', 'Australian Open', 'ATP Masters', 'WTA Premier'
  ],
  basketball: [
    'NBA', 'EuroLeague', 'FIBA World Cup', 'NCAA', 'G League',
    'ACB Liga', 'VTB League', 'Basketball Champions League'
  ],
  hockey: [
    'NHL', 'KHL', 'IIHF World Championship', 'Olympics', 'AHL',
    'SHL', 'Liiga', 'DEL', 'Champions Hockey League'
  ],
  table_tennis: [
    'ITTF World Tour', 'World Championships', 'Olympics', 'World Cup',
    'European Championships', 'Asian Championships', 'WTT Series'
  ]
}

const commonVenues = {
  soccer: [
    'Old Trafford', 'Camp Nou', 'Santiago Bernabéu', 'Allianz Arena', 'Anfield',
    'Emirates Stadium', 'San Siro', 'Wembley Stadium', 'Signal Iduna Park'
  ],
  tennis: [
    'Centre Court (Wimbledon)', 'Arthur Ashe Stadium', 'Philippe Chatrier Court',
    'Rod Laver Arena', 'Indian Wells Tennis Garden', 'O2 Arena'
  ],
  basketball: [
    'Madison Square Garden', 'Staples Center', 'United Center', 'TD Garden',
    'American Airlines Center', 'Chase Center', 'Barclays Center'
  ],
  hockey: [
    'Madison Square Garden', 'Bell Centre', 'United Center', 'TD Garden',
    'Scotiabank Arena', 'Rogers Place', 'T-Mobile Arena'
  ],
  table_tennis: [
    'Tokyo Metropolitan Gymnasium', 'Düsseldorf Arena', 'Singapore Sports Hub',
    'Olympic Sports Centre', 'Copper Box Arena', 'Mercedes-Benz Arena'
  ]
}

export function PredictionForm({ sport, onPredictionComplete, user }: PredictionFormProps) {
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [selectedLeague, setSelectedLeague] = useState('')
  const [selectedVenue, setSelectedVenue] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !homeTeam.trim() || !awayTeam.trim()) return

    setLoading(true)
    setError('')

    try {
      // Get real sports data and generate AI prediction
      const prediction = await generateAdvancedPrediction(
        sport, 
        homeTeam.trim(), 
        awayTeam.trim(),
        selectedLeague,
        selectedVenue,
        matchDate
      )
      
      // Save to database
      const savedPrediction = await blink.db.predictions.create({
        user_id: user.id,
        sport,
        home_team: homeTeam.trim(),
        away_team: awayTeam.trim(),
        league_name: selectedLeague,
        venue: selectedVenue,
        match_date: matchDate || new Date().toISOString(),
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
      setSelectedLeague('')
      setSelectedVenue('')
      setMatchDate('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate prediction')
    } finally {
      setLoading(false)
    }
  }

  const getPlaceholder = (sport: string, type: 'home' | 'away'): string => {
    const examples = {
      soccer: type === 'home' ? 'e.g., Manchester United' : 'e.g., Liverpool',
      tennis: type === 'home' ? 'e.g., Novak Djokovic' : 'e.g., Rafael Nadal',
      basketball: type === 'home' ? 'e.g., Lakers' : 'e.g., Warriors',
      hockey: type === 'home' ? 'e.g., Rangers' : 'e.g., Bruins',
      table_tennis: type === 'home' ? 'e.g., Ma Long' : 'e.g., Fan Zhendong'
    }
    return examples[sport as keyof typeof examples] || `Enter ${type} team`
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

        <div className="space-y-2">
          <Label htmlFor="league" className="text-sm font-medium text-gray-700">
            League/Tournament
          </Label>
          <Select value={selectedLeague} onValueChange={setSelectedLeague}>
            <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select league/tournament" />
            </SelectTrigger>
            <SelectContent>
              {(sportLeagues[sport as keyof typeof sportLeagues] || []).map((league) => (
                <SelectItem key={league} value={league}>
                  {league}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue" className="text-sm font-medium text-gray-700">
            Venue
          </Label>
          <Select value={selectedVenue} onValueChange={setSelectedVenue}>
            <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select venue" />
            </SelectTrigger>
            <SelectContent>
              {(commonVenues[sport as keyof typeof commonVenues] || []).map((venue) => (
                <SelectItem key={venue} value={venue}>
                  {venue}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="match-date" className="text-sm font-medium text-gray-700">
            Match Date
          </Label>
          <Input
            id="match-date"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
            type="date"
            className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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

async function generateAdvancedPrediction(sport: string, homeTeam: string, awayTeam: string, selectedLeague: string, selectedVenue: string, matchDate: string) {
  try {
    // Use Blink's secure API proxy to fetch real sports data
    const sportsData = await fetchRealSportsData(sport, homeTeam, awayTeam, selectedLeague, selectedVenue, matchDate)
    
    // Generate AI-powered prediction using real data
    const predictionPrompt = `
      Analyze this ${sport} match and provide a detailed prediction:
      
      Home Team: ${homeTeam}
      Away Team: ${awayTeam}
      Sport: ${sport}
      League: ${selectedLeague}
      Venue: ${selectedVenue}
      Match Date: ${matchDate}
      
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

async function fetchRealSportsData(sport: string, homeTeam: string, awayTeam: string, selectedLeague: string, selectedVenue: string, matchDate: string) {
  try {
    // Use web search to get real-time sports data
    const searchQuery = `${homeTeam} vs ${awayTeam} ${sport} ${selectedLeague} ${selectedVenue} ${matchDate} latest news stats performance`
    
    const searchResults = await blink.data.search(searchQuery, {
      type: 'news',
      limit: 10
    })

    // Also search for team statistics
    const homeTeamStats = await blink.data.search(`${homeTeam} ${sport} ${selectedLeague} recent form statistics`, {
      limit: 5
    })

    const awayTeamStats = await blink.data.search(`${awayTeam} ${sport} ${selectedLeague} recent form statistics`, {
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