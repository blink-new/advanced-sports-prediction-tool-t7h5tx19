import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { Prediction } from '../App'

interface PredictionResultsProps {
  prediction: Prediction | null
  sport: string
}

export function PredictionResults({ prediction, sport }: PredictionResultsProps) {
  const [factors, setFactors] = useState<string[]>([])

  useEffect(() => {
    if (prediction?.prediction_factors) {
      try {
        const parsed = JSON.parse(prediction.prediction_factors)
        setFactors(parsed)
      } catch {
        setFactors([])
      }
    }
  }, [prediction])

  if (!prediction) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Prediction Yet</h3>
        <p className="text-gray-500">
          Generate a prediction using the form to see detailed analysis and results here.
        </p>
      </div>
    )
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return CheckCircle
    if (confidence >= 60) return AlertTriangle
    return AlertTriangle
  }

  const ConfidenceIcon = getConfidenceIcon(prediction.confidence_percentage)

  return (
    <div className="space-y-6">
      {/* Main Prediction */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Match Prediction</h2>
          <Badge variant="outline" className="bg-white">
            {sport.charAt(0).toUpperCase() + sport.slice(1)}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Home Team */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{prediction.home_team}</h3>
            <div className="text-3xl font-bold text-blue-600">
              {prediction.predicted_home_score}
            </div>
            <p className="text-sm text-gray-500">Home</p>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-gray-400 mb-2">VS</div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(prediction.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{prediction.away_team}</h3>
            <div className="text-3xl font-bold text-indigo-600">
              {prediction.predicted_away_score}
            </div>
            <p className="text-sm text-gray-500">Away</p>
          </div>
        </div>
      </Card>

      {/* Confidence Score */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <ConfidenceIcon className={`w-6 h-6 ${getConfidenceColor(Number(prediction.confidence_percentage))}`} />
          <h3 className="text-lg font-semibold text-gray-900">Confidence Analysis</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Prediction Confidence</span>
              <span className={`text-lg font-bold ${getConfidenceColor(Number(prediction.confidence_percentage))}`}>
                {typeof prediction.confidence_percentage === 'number' && !isNaN(prediction.confidence_percentage)
                  ? prediction.confidence_percentage.toFixed(1) + '%'
                  : 'N/A'}
              </span>
            </div>
            <Progress 
              value={typeof prediction.confidence_percentage === 'number' && !isNaN(prediction.confidence_percentage) ? prediction.confidence_percentage : 0} 
              className="h-3 bg-gray-200"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Risk Level</span>
            <Badge 
              variant={Number(prediction.confidence_percentage) >= 70 ? 'default' : 'destructive'}
              className={Number(prediction.confidence_percentage) >= 70 ? 'bg-green-500' : ''}
            >
              {Number(prediction.confidence_percentage) >= 70 ? 'Low Risk' : 'High Risk'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Key Factors */}
      {factors.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Key Analysis Factors</h3>
          </div>
          
          <div className="grid gap-3">
            {factors.map((factor, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700">{factor}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Prediction Status</h3>
            <p className="text-sm text-gray-500">
              This prediction is pending match completion for accuracy verification.
            </p>
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Check for Updates</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}