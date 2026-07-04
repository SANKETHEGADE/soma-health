import { useState } from 'react'
import Dashboard from './components/Dashboard.tsx'
import LogHealth from './components/LogHealth.tsx'
import HealthChart from './components/HealthChart.tsx'
import AIInsights from './components/AIInsights.tsx'
import { Heart, LayoutDashboard, PlusCircle, BarChart2, Sparkles } from 'lucide-react'

export type HealthEntry = {
  date: string
  steps: number
  heartRate: number
  sleep: number
  water: number
  calories: number
}

const defaultData: HealthEntry[] = [
  { date: '2026-06-27', steps: 7200, heartRate: 72, sleep: 7.5, water: 2.1, calories: 1950 },
  { date: '2026-06-28', steps: 9100, heartRate: 68, sleep: 8.0, water: 2.5, calories: 2100 },
  { date: '2026-06-29', steps: 5400, heartRate: 75, sleep: 6.5, water: 1.8, calories: 1800 },
  { date: '2026-06-30', steps: 11200, heartRate: 70, sleep: 7.0, water: 3.0, calories: 2200 },
  { date: '2026-07-01', steps: 8300, heartRate: 73, sleep: 7.5, water: 2.3, calories: 2050 },
  { date: '2026-07-02', steps: 6700, heartRate: 71, sleep: 6.0, water: 2.0, calories: 1900 },
  { date: '2026-07-03', steps: 9800, heartRate: 69, sleep: 8.5, water: 2.8, calories: 2150 },
]

type Page = 'dashboard' | 'log' | 'charts' | 'insights'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [healthData, setHealthData] = useState<HealthEntry[]>(() => {
    const saved = localStorage.getItem('soma-health-data')
    return saved ? JSON.parse(saved) : defaultData
  })

  const saveEntry = (entry: HealthEntry) => {
    const updated = [...healthData.filter(e => e.date !== entry.date), entry]
      .sort((a, b) => a.date.localeCompare(b.date))
    setHealthData(updated)
    localStorage.setItem('soma-health-data', JSON.stringify(updated))
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'log',       label: 'Log Today', icon: PlusCircle },
    { id: 'charts',    label: 'Charts',    icon: BarChart2 },
    { id: 'insights',  label: 'AI Insights', icon: Sparkles },
  ] as const

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px', background: '#13131a', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px', position: 'fixed',
        top: 0, left: 0, height: '100vh', zIndex: 10
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', paddingLeft: '8px' }}>
          <Heart size={24} color="#ef4444" fill="#ef4444" />
          <span style={{ fontSize: '18px', fontWeight: 700, background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Soma Health
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPage(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                background: page === id ? 'rgba(168,85,247,0.15)' : 'transparent',
                color: page === id ? '#a855f7' : '#666',
                transition: 'all 0.2s', textAlign: 'left', width: '100%'
              }}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom tag */}
        <div style={{ marginTop: 'auto', fontSize: '11px', color: '#333', paddingLeft: '8px' }}>
          Powered by Gemini AI
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', maxWidth: '1100px' }}>
        {page === 'dashboard' && <Dashboard data={healthData} />}
        {page === 'log'       && <LogHealth onSave={saveEntry} />}
        {page === 'charts'    && <HealthChart data={healthData} />}
        {page === 'insights'  && <AIInsights data={healthData} />}
      </main>
    </div>
  )
}