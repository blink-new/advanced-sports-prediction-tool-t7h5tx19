import { useState } from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, Trophy, Target, Calendar, RefreshCw } from 'lucide-react'

interface LiveMatchTrackerProps {
  sport: string
}

export function LiveMatchTracker({ sport }: LiveMatchTrackerProps) {
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [loading, setLoading] = useState(false)
  const [matchData, setMatchData] = useState<any>(null)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMatchData(null)
    try {
      // Use Blink web search to fetch live match info
      const query = `${homeTeam} vs ${awayTeam} ${sport} live score`;
      const result = await window.blink.data.search(query, { type: 'news', limit: 5 })
      setMatchData(result.news_results?.[0] || null)
    } catch (err) {
      setError('Could not fetch live match data.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Live Match Tracker</h2>
      <form onSubmit={handleTrack} className="grid md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Home Team"
          value={homeTeam}
          onChange={e => setHomeTeam(e.target.value)}
          required
        />
        <Input
          placeholder="Away Team"
          value={awayTeam}
          onChange={e => setAwayTeam(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span className="ml-2">Track Live</span>
        </Button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {matchData && (
        <div className="animate-fade-in-up">
          <div className="flex items-center space-x-4 mb-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">{homeTeam}</span>
            <span className="text-xl font-bold text-gray-700">vs</span>
            <Target className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-lg">{awayTeam}</span>
          </div>
          <div className="text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            {matchData.date || 'Today'}
          </div>
          <div className="text-blue-700 font-bold text-2xl mb-2">
            {matchData.title || 'Live score not available'}
          </div>
          <div className="text-gray-600 text-sm">
            {matchData.snippet || 'No live commentary found.'}
          </div>
          {matchData.link && (
            <a href={matchData.link} target="_blank" rel="noopener" className="text-blue-500 underline mt-2 inline-block">View Details</a>
          )}
        </div>
      )}
    </Card>
  )
}
