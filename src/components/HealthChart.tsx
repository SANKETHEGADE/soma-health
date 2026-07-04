import { useState } from 'react'
import type { HealthEntry } from '../App.tsx'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts'

type Metric = {
  key: keyof HealthEntry
  label: string
  color: string
  unit: string
}

const metrics: Metric[] = [
  { key: 'steps',     label: 'Steps',      color: '#a855f7', unit: 'steps' },
  { key: 'heartRate', label: 'Heart Rate', color: '#ef4444', unit: 'bpm'   },
  { key: 'sleep',     label: 'Sleep',      color: '#06b6d4', unit: 'hrs'   },
  { key: 'water',     label: 'Water',      color: '#3b82f6', unit: 'L'     },
  { key: 'calories',  label: 'Calories',   color: '#f59e0b', unit: 'kcal'  },
]

export default function HealthChart({ data }: { data: HealthEntry[] }) {
  const [active, setActive] = useState<keyof HealthEntry>('steps')

  const metric = metrics.find(m => m.key === active)!

  const chartData = data.map(e => ({
    date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: e[active]
  }))

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Charts</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
        Your health trends over the last 7 days
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {metrics.map(m => (
          <button key={m.key} onClick={() => setActive(m.key)}
            style={{
              padding: '8px 18px', borderRadius: '20px', border: '1px solid',
              borderColor: active === m.key ? m.color : 'var(--border)',
              background: active === m.key ? `${m.color}22` : 'transparent',
              color: active === m.key ? m.color : 'var(--text-secondary)',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
            }}>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '24px'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px', color: metric.color }}>
          {metric.label} ({metric.unit})
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={metric.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={metric.color} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
            <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 12 }} />
            <YAxis stroke="#555" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#e2e2e2' }}
              formatter={(val: unknown) => [`${String(val)} ${metric.unit}`, metric.label]}
            />
            <Area
              type="monotone" dataKey="value"
              stroke={metric.color} strokeWidth={2.5}
              fill="url(#colorGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', margin: '32px 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        All Metrics
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {metrics.filter(m => m.key !== active).map(m => (
          <div key={m.key}
            onClick={() => setActive(m.key)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = m.color)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <p style={{ fontSize: '13px', color: m.color, fontWeight: 600, marginBottom: '12px' }}>{m.label}</p>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={data.map(e => ({ value: e[m.key] }))}>
                <Line type="monotone" dataKey="value" stroke={m.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}