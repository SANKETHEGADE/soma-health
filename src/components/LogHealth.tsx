import { useState } from 'react'
import type { HealthEntry } from '../App.tsx'
import { Save, CheckCircle } from 'lucide-react'

export default function LogHealth({ onSave }: { onSave: (e: HealthEntry) => void }) {
  const today = new Date().toISOString().split('T')[0]
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    steps: '', heartRate: '', sleep: '', water: '', calories: ''
  })

  const handleChange = (key: string, val: string) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    if (!form.steps || !form.heartRate || !form.sleep || !form.water || !form.calories) return
    onSave({
      date: today,
      steps: Number(form.steps),
      heartRate: Number(form.heartRate),
      sleep: Number(form.sleep),
      water: Number(form.water),
      calories: Number(form.calories),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const fields = [
    { key: 'steps',     label: 'Steps',      unit: 'steps', placeholder: 'e.g. 8000',  min: 0,    max: 50000, step: 100,  color: '#a855f7' },
    { key: 'heartRate', label: 'Heart Rate', unit: 'bpm',   placeholder: 'e.g. 72',    min: 40,   max: 200,   step: 1,    color: '#ef4444' },
    { key: 'sleep',     label: 'Sleep',      unit: 'hours', placeholder: 'e.g. 7.5',   min: 0,    max: 24,    step: 0.5,  color: '#06b6d4' },
    { key: 'water',     label: 'Water',      unit: 'litres',placeholder: 'e.g. 2.5',   min: 0,    max: 10,    step: 0.1,  color: '#3b82f6' },
    { key: 'calories',  label: 'Calories',   unit: 'kcal',  placeholder: 'e.g. 2000',  min: 0,    max: 10000, step: 50,   color: '#f59e0b' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Log Today</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '32px', maxWidth: '560px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {fields.map(f => (
            <div key={f.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: f.color }}>
                  {f.label}
                </label>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{f.unit}</span>
              </div>
              <input
                type="number"
                placeholder={f.placeholder}
                min={f.min} max={f.max} step={f.step}
                value={form[f.key as keyof typeof form]}
                onChange={e => handleChange(f.key, e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px',
                  background: '#0f0f13', border: '1px solid var(--border)',
                  borderRadius: '10px', color: 'var(--text-primary)',
                  fontSize: '15px', outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={e => (e.target.style.borderColor = f.color)}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          ))}
        </div>

        <button onClick={handleSave}
          style={{
            marginTop: '32px', width: '100%', padding: '14px',
            background: saved ? '#22c55e' : 'linear-gradient(135deg, #a855f7, #06b6d4)',
            border: 'none', borderRadius: '12px', color: 'white',
            fontSize: '15px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', transition: 'all 0.3s'
          }}>
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Today's Data</>}
        </button>
      </div>
    </div>
  )
}