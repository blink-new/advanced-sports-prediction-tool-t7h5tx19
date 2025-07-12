import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Brain,
  DollarSign,
  MapPin,
  Cloud,
  Users,
  Zap,
  Timer,
  Activity,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { Prediction } from '../App'

interface AdvancedPredictionResultsProps {
  prediction: Prediction | null
  sport: string
}

interface EnhancedPredictionData {
  factors: string[]
  win_probability: {
    home: number
    away: number
    draw: number
  }
  key_insights: string[]
  risk_assessment: string
  recommended_bet: string
  market_analysis: {
    value_rating: number
    expected_odds: string
    market_sentiment: string
  }
}

export function AdvancedPredictionResults({ prediction, sport }: AdvancedPredictionResultsProps) {
  const [enhancedData, setEnhancedData] = useState<EnhancedPredictionData | null>(null)

  useEffect(() => {
    if (prediction?.prediction_factors) {
      try {
        const parsed = JSON.parse(prediction.prediction_factors)
        setEnhancedData(parsed)
      } catch {
        setEnhancedData(null)
      }
    }
  }, [prediction])

  if (!prediction) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center">
          <Brain className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Prediction Generated</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Use the advanced prediction engine to generate comprehensive analysis and results.
        </p>
      </div>
    )
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600'
    if (confidence >= 70) return 'text-blue-600'
    if (confidence >= 55) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 85) return CheckCircle
    if (confidence >= 70) return TrendingUp
    return AlertTriangle
  }

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-50 border-green-200'
    if (confidence >= 70) return 'bg-blue-50 border-blue-200'
    if (confidence >= 55) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const ConfidenceIcon = getConfidenceIcon(prediction.confidence_percentage)

  const getSportIcon = (sportType: string) => {
    const icons = {
      soccer: Zap,
      tennis: Target,
      basketball: Trophy,
      hockey: Timer,
      table_tennis: Activity
    }
    return icons[sportType as keyof typeof icons] || Trophy
  }

  const SportIcon = getSportIcon(sport)

  const getWinnerIndicator = () => {
    if (prediction.predicted_home_score > prediction.predicted_away_score) {
      return { winner: 'home', icon: ArrowUp }
    } else if (prediction.predicted_away_score > prediction.predicted_home_score) {
      return { winner: 'away', icon: ArrowUp }
    }
    return { winner: 'draw', icon: Minus }
  }

  const { winner, icon: WinnerIcon } = getWinnerIndicator()

  return (
    <div className="space-y-6">
      {/* Main Prediction Display */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <SportIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Match Prediction</h2>
                <p className="text-blue-100">{sport.charAt(0).toUpperCase() + sport.slice(1)}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-white/10 text-white border-white/30">
              AI Generated
            </Badge>
          </div>

          <div className="grid md:grid-cols-5 gap-4 items-center">
            {/* Home Team */}
            <div className="md:col-span-2 text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1">{prediction.home_team}</h3>
              <div className="text-4xl font-bold text-blue-200 mb-2">
                {prediction.predicted_home_score}
              </div>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-sm text-blue-100">Home</span>
                {winner === 'home' && <WinnerIcon className="w-4 h-4 text-green-400" />}
              </div>
            </div>

            {/* VS Section */}
            <div className="text-center">
              <div className="text-3xl font-bold text-white/60 mb-2">VS</div>
              <div className="text-xs text-blue-100">
                {new Date(prediction.created_at).toLocaleDateString()}
              </div>
              {prediction.venue && (
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <MapPin className="w-3 h-3 text-blue-200" />
                  <span className="text-xs text-blue-200">{prediction.venue}</span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="md:col-span-2 text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-3xl flex items-center justify-center">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1">{prediction.away_team}</h3>
              <div className="text-4xl font-bold text-indigo-200 mb-2">
                {prediction.predicted_away_score}
              </div>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-sm text-indigo-100">Away</span>
                {winner === 'away' && <WinnerIcon className="w-4 h-4 text-green-400" />}
              </div>
            </div>
          </div>

          {enhancedData?.win_probability && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-200">
                  {enhancedData.win_probability.home.toFixed(1)}%
                </div>
                <div className="text-xs text-blue-100">Home Win</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-200">
                  {enhancedData.win_probability.draw.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-100">Draw</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-200">
                  {enhancedData.win_probability.away.toFixed(1)}%
                </div>
                <div className="text-xs text-indigo-100">Away Win</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Analysis Tabs */}
      <Tabs defaultValue="confidence" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="confidence">Confidence</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        <TabsContent value="confidence" className="space-y-4">
          <Card className={`p-6 ${getConfidenceBg(prediction.confidence_percentage)}`}>
            <div className="flex items-center space-x-3 mb-4">
              <ConfidenceIcon className={`w-6 h-6 ${getConfidenceColor(prediction.confidence_percentage)}`} />
              <h3 className="text-lg font-semibold text-gray-900">Prediction Confidence</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Accuracy Score</span>
                  <span className={`text-xl font-bold ${getConfidenceColor(prediction.confidence_percentage)}`}>
                    {prediction.confidence_percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={prediction.confidence_percentage} 
                  className="h-3 bg-gray-200"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Risk Level:</span>
                  <Badge 
                    variant={prediction.confidence_percentage >= 70 ? 'default' : 'destructive'}
                    className={prediction.confidence_percentage >= 70 ? 'bg-green-500' : ''}
                  >
                    {enhancedData?.risk_assessment || (prediction.confidence_percentage >= 70 ? 'Low Risk' : 'High Risk')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Model Version:</span>
                  <span className="font-medium">AI-2024.1</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {enhancedData?.factors && (
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Key Analysis Factors</h3>
              </div>
              
              <div className="grid gap-3">
                {enhancedData.factors.map((factor, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{factor}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {enhancedData?.key_insights && (
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Key Insights</h3>
              </div>
              
              <div className="space-y-4">
                {enhancedData.key_insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-3 h-3 text-purple-600" />
                    </div>
                    <p className="text-sm text-purple-800 font-medium">{insight}</p>
                  </div>
                ))}
              </div>

              {enhancedData.recommended_bet && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Recommended Strategy</span>
                  </div>
                  <p className="text-sm text-green-800">{enhancedData.recommended_bet}</p>
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          {enhancedData?.market_analysis && (
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Market Analysis</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {enhancedData.market_analysis.value_rating}/10
                  </div>
                  <div className="text-sm text-orange-800">Value Rating</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600 mb-1">
                    {enhancedData.market_analysis.expected_odds}
                  </div>
                  <div className="text-sm text-blue-800">Expected Odds</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm font-bold text-purple-600 mb-1">
                    {enhancedData.market_analysis.market_sentiment}
                  </div>
                  <div className="text-sm text-purple-800">Market Sentiment</div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Prediction Status</h3>
            <p className="text-sm text-gray-500">
              Awaiting match completion for accuracy verification and model improvement.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Update Data</span>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Track Match
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}