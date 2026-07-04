import type { HealthEntry } from '../App.tsx'
import MetricCard from './MetricCard.tsx'
import { Footprints, Heart, Moon, Droplets, Flame } from 'lucide-react'

export default function Dashboard({ data }: { data: HealthEntry[] }) {
  const today = data[data.length - 1]

  const avg = (key: keyof HealthEntry) =>
    Math.round((data.reduce((s, e) => s + (e[key] as number), 0) / data.length) * 10) / 10

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
        Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      {/* Today's metrics */}
      <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Today
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        <MetricCard label="Steps" value={today.steps.toLocaleString()} unit="steps" icon={<Footprints size={20} />} color="var(--purple)" goal={10000} current={today.steps} />
        <MetricCard label="Heart Rate" value={today.heartRate} unit="bpm" icon={<Heart size={20} />} color="var(--red)" goal={80} current={today.heartRate} />
        <MetricCard label="Sleep" value={today.sleep} unit="hrs" icon={<Moon size={20} />} color="var(--cyan)" goal={8} current={today.sleep} />
        <MetricCard label="Water" value={today.water} unit="L" icon={<Droplets size={20} />} color="var(--blue ?? '#3b82f6')" goal={3} current={today.water} />
        <MetricCard label="Calories" value={today.calories.toLocaleString()} unit="kcal" icon={<Flame size={20} />} color="var(--amber)" goal={2200} current={today.calories} />
      </div>

      {/* Weekly averages */}
      <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        7-Day Averages
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        <MetricCard label="Avg Steps" value={avg('steps').toLocaleString()} unit="steps" icon={<Footprints size={20} />} color="var(--purple)" />
        <MetricCard label="Avg Heart Rate" value={avg('heartRate')} unit="bpm" icon={<Heart size={20} />} color="var(--red)" />
        <MetricCard label="Avg Sleep" value={avg('sleep')} unit="hrs" icon={<Moon size={20} />} color="var(--cyan)" />
        <MetricCard label="Avg Water" value={avg('water')} unit="L" icon={<Droplets size={20} />} color="#3b82f6" />
        <MetricCard label="Avg Calories" value={avg('calories').toLocaleString()} unit="kcal" icon={<Flame size={20} />} color="var(--amber)" />
      </div>
    </div>
  )
}