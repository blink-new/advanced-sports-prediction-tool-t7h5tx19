import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { 
  History, 
  Search, 
  Filter,
  Trophy,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react'
import { Prediction } from '../App'

interface PredictionHistoryProps {
  predictions: Prediction[]
  onRefresh: () => void
}

export function PredictionHistory({ predictions, onRefresh }: PredictionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState<string>('all')

  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = searchTerm === '' || 
      prediction.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.away_team.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSport = selectedSport === 'all' || prediction.sport === selectedSport
    
    return matchesSearch && matchesSport
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'cancelled':
        return XCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  const calculateAccuracy = () => {
    const completedPredictions = predictions.filter(p => p.status === 'completed' && 
      p.actual_home_score !== undefined && p.actual_away_score !== undefined)
    
    if (completedPredictions.length === 0) return 0
    
    const correct = completedPredictions.filter(p => 
      p.predicted_home_score === p.actual_home_score && 
      p.predicted_away_score === p.actual_away_score
    ).length
    
    return Math.round((correct / completedPredictions.length) * 100)
  }

  const sports = [...new Set(predictions.map(p => p.sport))]

  if (predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
          <History className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Predictions Yet</h3>
        <p className="text-gray-500">
          Your prediction history will appear here once you start making predictions.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Predictions</p>
              <p className="text-2xl font-bold text-blue-900">{predictions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-900">
                {predictions.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                {predictions.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Accuracy</p>
              <p className="text-2xl font-bold text-purple-900">{calculateAccuracy()}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Sports</option>
              {sports.map(sport => (
                <option key={sport} value={sport}>
                  {sport.charAt(0).toUpperCase() + sport.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <Button variant="outline" onClick={onRefresh} className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </Card>

      {/* Predictions List */}
      <div className="space-y-4">
        {filteredPredictions.map((prediction) => {
          const StatusIcon = getStatusIcon(prediction.status)
          
          return (
            <Card key={prediction.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {prediction.sport.charAt(0).toUpperCase() + prediction.sport.slice(1).replace('_', ' ')}
                  </Badge>
                  <div className={`p-1 rounded-full ${getStatusColor(prediction.status)}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(prediction.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Teams and Scores */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-1">{prediction.home_team}</h3>
                      <div className="text-2xl font-bold text-blue-600">
                        {prediction.predicted_home_score}
                        {prediction.actual_home_score !== undefined && (
                          <span className="text-sm text-gray-500 ml-2">
                            (Actual: {prediction.actual_home_score})
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-gray-400 font-bold">VS</div>
                    
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-1">{prediction.away_team}</h3>
                      <div className="text-2xl font-bold text-indigo-600">
                        {prediction.predicted_away_score}
                        {prediction.actual_away_score !== undefined && (
                          <span className="text-sm text-gray-500 ml-2">
                            (Actual: {prediction.actual_away_score})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex flex-col justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Confidence</p>
                    <div className="text-xl font-bold text-gray-900">
                      {typeof prediction.confidence_percentage === 'number' && !isNaN(prediction.confidence_percentage)
                        ? prediction.confidence_percentage.toFixed(1) + '%'
                        : 'N/A'}
                    </div>
                    <Badge 
                      variant={prediction.confidence_percentage >= 70 ? 'default' : 'secondary'}
                      className={`text-xs ${
                        prediction.confidence_percentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {prediction.confidence_percentage >= 70 ? 'High' : 'Medium'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredPredictions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No predictions match your search criteria.</p>
        </div>
      )}
    </div>
  )
}