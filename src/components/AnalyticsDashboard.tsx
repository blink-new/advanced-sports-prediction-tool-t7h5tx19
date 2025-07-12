import { Card } from './ui/card'
import { BarChart3, TrendingUp, Trophy, CheckCircle } from 'lucide-react'

// Dummy data for now; real stats can be wired in next
const stats = [
  { label: 'Total Predictions', value: 42, icon: Trophy, color: 'bg-blue-600' },
  { label: 'Accuracy', value: '78%', icon: CheckCircle, color: 'bg-green-600' },
  { label: 'Best Streak', value: 7, icon: TrendingUp, color: 'bg-purple-600' },
  { label: 'Most Predicted Sport', value: 'Soccer', icon: BarChart3, color: 'bg-orange-600' },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-6 flex items-center space-x-4 animate-fade-in-up">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            </Card>
          )
        })}
      </div>
      <Card className="p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Performance Insights</h3>
        <p className="text-gray-600 mb-4">
          Track your prediction accuracy, streaks, and most successful sports. More advanced analytics coming soon!
        </p>
        <div className="flex justify-center">
          <BarChart3 className="w-16 h-16 text-blue-400" />
        </div>
      </Card>
    </div>
  )
}
