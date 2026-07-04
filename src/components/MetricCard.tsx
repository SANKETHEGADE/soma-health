import type { ReactNode } from 'react'

type Props = {
  label: string
  value: string | number
  unit: string
  icon: ReactNode
  color: string
  goal?: number
  current?: number
}

export default function MetricCard({ label, value, unit, icon, color, goal, current }: Props) {
  const percent = goal && current ? Math.min((current / goal) * 100, 100) : null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '20px',
      transition: 'all 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: `${color}22`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: color
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {label}
        </span>
      </div>

      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {value}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{unit}</span>
      </div>

      {/* Progress bar */}
      {percent !== null && (
        <div>
          <div style={{
            height: '4px', background: 'var(--border)',
            borderRadius: '2px', overflow: 'hidden'
          }}>
            <div style={{
              height: '100%', width: `${percent}%`,
              background: color, borderRadius: '2px',
              transition: 'width 0.6s ease'
            }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {Math.round(percent)}% of goal
          </div>
        </div>
      )}
    </div>
  )
}