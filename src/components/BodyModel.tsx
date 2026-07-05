import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type BodyPart = {
  name: string
  label: string
  emoji: string
  color: string
  metric: string
  unit: string
  placeholder: string
  min: number
  max: number
  step: number
}

const bodyParts: BodyPart[] = [
  { name: 'head',    label: 'Head',    emoji: '🧠', color: '#06b6d4', metric: 'Sleep',      unit: 'hrs',   placeholder: '7.5', min: 0,  max: 24,    step: 0.5 },
  { name: 'chest',   label: 'Chest',   emoji: '❤️', color: '#ef4444', metric: 'Heart Rate', unit: 'bpm',   placeholder: '72',  min: 40, max: 200,   step: 1   },
  { name: 'stomach', label: 'Stomach', emoji: '💧', color: '#3b82f6', metric: 'Water',      unit: 'L',     placeholder: '2.5', min: 0,  max: 10,    step: 0.1 },
  { name: 'leftLeg', label: 'Legs',    emoji: '🦵', color: '#a855f7', metric: 'Steps',      unit: 'steps', placeholder: '8000',min: 0,  max: 50000, step: 100 },
  { name: 'arms',    label: 'Arms',    emoji: '🔥', color: '#f59e0b', metric: 'Calories',   unit: 'kcal',  placeholder: '2000',min: 0,  max: 10000, step: 50  },
]

type Props = {
  onLog: (metric: string, value: number, unit: string) => void
}

export default function BodyModel({ onLog }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const meshesRef = useRef<{ [key: string]: THREE.Mesh }>({})
  const frameRef = useRef<number | null>(null)
  const isDragging = useRef(false)
  const previousMouse = useRef({ x: 0, y: 0 })

  const [selected, setSelected] = useState<BodyPart | null>(null)
  const [value, setValue] = useState('')
  const [saved, setSaved] = useState(false)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const w = mountRef.current.clientWidth
    const h = mountRef.current.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.set(0, 1, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dirLight = new THREE.DirectionalLight(0xa855f7, 1.2)
    dirLight.position.set(3, 5, 3)
    scene.add(dirLight)
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 0.8)
    rimLight.position.set(-3, 2, -3)
    scene.add(rimLight)

    const group = new THREE.Group()
    scene.add(group)
    groupRef.current = group

    const createPart = (
      name: string,
      geo: THREE.BufferGeometry,
      color: number,
      x: number, y: number, z: number
    ) => {
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.6,
        transparent: true,
        opacity: 0.85,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.1,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      mesh.name = name
      group.add(mesh)
      meshesRef.current[name] = mesh
      return mesh
    }

    // HEAD
    createPart('head', new THREE.SphereGeometry(0.38, 32, 32), 0x06b6d4, 0, 2.6, 0)
    // NECK
    createPart('neck', new THREE.CylinderGeometry(0.14, 0.16, 0.3, 16), 0x888888, 0, 2.2, 0)
    // CHEST
    createPart('chest', new THREE.CylinderGeometry(0.42, 0.38, 0.7, 16), 0xef4444, 0, 1.55, 0)
    // STOMACH
    createPart('stomach', new THREE.CylinderGeometry(0.38, 0.4, 0.5, 16), 0x3b82f6, 0, 0.75, 0)
    // HIPS
    createPart('hips', new THREE.CylinderGeometry(0.4, 0.38, 0.3, 16), 0x888888, 0, 0.22, 0)
    // ARMS
    createPart('arms',  new THREE.CylinderGeometry(0.13, 0.11, 0.7, 12), 0xf59e0b, -0.72, 1.4, 0)
    createPart('arms2', new THREE.CylinderGeometry(0.13, 0.11, 0.7, 12), 0xf59e0b,  0.72, 1.4, 0)
    // FOREARMS
    createPart('leftForearm',  new THREE.CylinderGeometry(0.1, 0.09, 0.6, 12), 0x666666, -0.85, 0.7, 0)
    createPart('rightForearm', new THREE.CylinderGeometry(0.1, 0.09, 0.6, 12), 0x666666,  0.85, 0.7, 0)
    // LEGS
    createPart('leftLeg',  new THREE.CylinderGeometry(0.17, 0.15, 0.8, 12), 0xa855f7, -0.28, -0.65, 0)
    createPart('rightLeg', new THREE.CylinderGeometry(0.17, 0.15, 0.8, 12), 0xa855f7,  0.28, -0.65, 0)
    // SHINS
    createPart('leftShin',  new THREE.CylinderGeometry(0.13, 0.1, 0.75, 12), 0x7c3aed, -0.28, -1.6, 0)
    createPart('rightShin', new THREE.CylinderGeometry(0.13, 0.1, 0.75, 12), 0x7c3aed,  0.28, -1.6, 0)

    // Scan ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.015, 8, 64),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 1 })
    )
    ring.rotation.x = Math.PI / 2
    ring.position.y = 2.6
    ring.name = 'ring'
    group.add(ring)

    // Grid
    scene.add(new THREE.GridHelper(6, 12, 0x2a2a3a, 0x1a1a2e))

    // Animate
    let t = 0
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      t += 0.02
      if (meshesRef.current['chest']) {
        meshesRef.current['chest'].scale.x = 1 + Math.sin(t) * 0.015
        meshesRef.current['chest'].scale.z = 1 + Math.sin(t) * 0.015
      }
      const ringMesh = group.getObjectByName('ring') as THREE.Mesh
      if (ringMesh) {
        ringMesh.position.y = Math.sin(t * 0.5) * 2.2
        ;(ringMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.3
      }
      renderer.render(scene, camera)
    }
    animate()

    // Drag rotation
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      previousMouse.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !groupRef.current) return
      const dx = e.clientX - previousMouse.current.x
      groupRef.current.rotation.y += dx * 0.01
      previousMouse.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseUp = () => { isDragging.current = false }

    renderer.domElement.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    // Click + hover
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const getPartFromName = (name: string) =>
      bodyParts.find(p =>
        p.name === name ||
        (name === 'arms2' && p.name === 'arms') ||
        (name === 'rightLeg' && p.name === 'leftLeg') ||
        (name === 'leftShin' && p.name === 'leftLeg') ||
        (name === 'rightShin' && p.name === 'leftLeg') ||
        (name === 'leftForearm' && p.name === 'arms') ||
        (name === 'rightForearm' && p.name === 'arms')
      )

    const onClick = (e: MouseEvent) => {
      if (!mountRef.current) return
      const rect = mountRef.current.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(group.children)
      if (hits.length > 0) {
        const part = getPartFromName(hits[0].object.name)
        if (part) { setSelected(part); setValue(''); setSaved(false) }
      }
    }

    const onHover = (e: MouseEvent) => {
      if (!mountRef.current) return
      const rect = mountRef.current.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(group.children)
      if (hits.length > 0) {
        mountRef.current.style.cursor = 'pointer'
        setHoveredPart(hits[0].object.name)
      } else {
        mountRef.current.style.cursor = 'grab'
        setHoveredPart(null)
      }
    }

    renderer.domElement.addEventListener('click', onClick)
    renderer.domElement.addEventListener('mousemove', onHover)

    const currentMount = mountRef.current

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      renderer.domElement.removeEventListener('click', onClick)
      renderer.domElement.removeEventListener('mousemove', onHover)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    Object.entries(meshesRef.current).forEach(([name, mesh]) => {
      const mat = mesh.material as THREE.MeshStandardMaterial
      const isHovered = name === hoveredPart ||
        (hoveredPart === 'arms2' && name === 'arms') ||
        (hoveredPart === 'rightLeg' && name === 'leftLeg') ||
        (hoveredPart === 'leftShin' && name === 'leftLeg') ||
        (hoveredPart === 'rightShin' && name === 'leftLeg') ||
        (hoveredPart === 'leftForearm' && name === 'arms') ||
        (hoveredPart === 'rightForearm' && name === 'arms')
      mat.emissiveIntensity = isHovered ? 0.6 : 0.1
      mat.opacity = isHovered ? 1 : 0.85
    })
  }, [hoveredPart])

  const handleSave = () => {
    if (!selected || !value) return
    onLog(selected.metric, Number(value), selected.unit)
    setSaved(true)
    setTimeout(() => { setSaved(false); setSelected(null) }, 2000)
  }

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', padding: '8px'
        }}>
          {bodyParts.map(p => (
            <div key={p.name} style={{
              fontSize: '11px', padding: '4px 10px', borderRadius: '20px',
              background: `${p.color}22`, border: `1px solid ${p.color}44`, color: p.color, fontWeight: 600
            }}>
              {p.emoji} {p.label}
            </div>
          ))}
        </div>
        <div ref={mountRef} style={{
          width: '100%', height: '500px', borderRadius: '20px',
          background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a14 100%)',
          border: '1px solid var(--border)', overflow: 'hidden', cursor: 'grab'
        }} />
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#444', marginTop: '8px' }}>
          🖱️ Drag to rotate • Click a body part to log data
        </p>
      </div>

      <div style={{ width: '280px', minWidth: '260px' }}>
        {selected ? (
          <div style={{
            background: 'var(--bg-card)', border: `1px solid ${selected.color}44`,
            borderRadius: '20px', padding: '28px', boxShadow: `0 0 30px ${selected.color}22`
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{selected.emoji}</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: selected.color, marginBottom: '4px' }}>
              {selected.label}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Log your {selected.metric.toLowerCase()}
            </p>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
              {selected.metric} ({selected.unit})
            </label>
            <input type="number" placeholder={selected.placeholder}
              min={selected.min} max={selected.max} step={selected.step}
              value={value} onChange={e => setValue(e.target.value)} autoFocus
              style={{
                width: '100%', padding: '12px 16px', background: '#0f0f13',
                border: `1px solid ${selected.color}44`, borderRadius: '10px',
                color: 'var(--text-primary)', fontSize: '16px', outline: 'none',
                fontFamily: 'Inter, sans-serif', marginBottom: '16px'
              }}
            />
            <button onClick={handleSave} style={{
              width: '100%', padding: '13px',
              background: saved ? '#22c55e' : `linear-gradient(135deg, ${selected.color}, #06b6d4)`,
              border: 'none', borderRadius: '10px', color: 'white',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'
            }}>
              {saved ? '✅ Saved!' : `Save ${selected.metric}`}
            </button>
            <button onClick={() => setSelected(null)} style={{
              width: '100%', padding: '10px', marginTop: '10px',
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: '10px', color: '#666', fontSize: '13px', cursor: 'pointer'
            }}>
              Cancel
            </button>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '28px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👆</div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Click a body part</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Tap any part of the 3D body to log your health data
            </p>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {bodyParts.map(p => (
                <div key={p.name} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: '8px',
                  background: `${p.color}11`, fontSize: '13px'
                }}>
                  <span>{p.emoji}</span>
                  <span style={{ color: p.color, fontWeight: 600 }}>{p.label}</span>
                  <span style={{ color: '#555', marginLeft: 'auto' }}>{p.metric}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}