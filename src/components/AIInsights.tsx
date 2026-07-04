import { useState } from 'react'
import type { HealthEntry } from '../App.tsx'
import { Sparkles, Loader2, AlertCircle } from 'lucide-react'

export default function AIInsights({ data }: { data: HealthEntry[] }) {
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getInsights = async () => {
    setLoading(true)
    setError('')
    setInsights('')

    const latest = data[data.length - 1]
    const avg = (key: keyof HealthEntry) =>
      (data.reduce((s, e) => s + (e[key] as number), 0) / data.length).toFixed(1)

    const prompt = `You are a friendly personal health coach. Analyze this health data and give warm, specific, actionable advice.

TODAY'S DATA:
- Steps: ${latest.steps}
- Heart Rate: ${latest.heartRate} bpm
- Sleep: ${latest.sleep} hours
- Water: ${latest.water} L
- Calories: ${latest.calories} kcal

7-DAY AVERAGES:
- Avg Steps: ${avg('steps')}
- Avg Heart Rate: ${avg('heartRate')} bpm
- Avg Sleep: ${avg('sleep')} hours
- Avg Water: ${avg('water')} L
- Avg Calories: ${avg('calories')} kcal

Please provide:
1. Overall health score (out of 10) with brief explanation
2. Top 3 things going well
3. Top 3 areas to improve with specific tips
4. One personalized challenge for this week

Keep it encouraging, specific, and under 400 words.`

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) throw new Error('No API key found')

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      )

      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'API error')
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text
      setInsights(text ?? 'No response received')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get insights. Check your API key.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>AI Insights</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
        Get personalised health advice powered by Gemini AI
      </p>

      <button onClick={getInsights} disabled={loading}
        style={{
          padding: '14px 28px', borderRadius: '12px', border: 'none',
          background: loading ? '#2a2a3a' : 'linear-gradient(135deg, #a855f7, #06b6d4)',
          color: 'white', fontSize: '15px', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '32px', transition: 'all 0.2s'
        }}>
        {loading
          ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analysing your health...</>
          : <><Sparkles size={18} /> Generate Health Insights</>}
      </button>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '12px', padding: '16px', display: 'flex',
          alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '24px'
        }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: '14px' }}>{error}</span>
        </div>
      )}

      {insights && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '32px', maxWidth: '720px'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '24px', paddingBottom: '16px',
            borderBottom: '1px solid var(--border)'
          }}>
            <Sparkles size={20} color="#a855f7" />
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#a855f7' }}>
              Your Health Report
            </span>
          </div>
          <div style={{
            fontSize: '14px', lineHeight: '1.9',
            color: 'var(--text-primary)', whiteSpace: 'pre-wrap'
          }}>
            {insights}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}