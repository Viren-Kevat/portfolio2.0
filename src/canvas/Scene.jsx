import { useRef, useMemo, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import styles from './Scene.module.scss'

// ─── INTERACTIVE PARTICLE FIELD ─────────────────────────
const ParticleField = () => {
    const pointsRef = useRef(null)
    const originalPos = useRef(null)
    const initialized = useRef(false)
    const mouse3D = useRef({ x: 0, y: 0 })
    const hoverTimer = useRef(0)
    const lastMousePos = useRef({ x: 0, y: 0 })
    const supernovaPhase = useRef(0)
    const supernovaCenter = useRef({ x: 0, y: 0 })
    const { viewport } = useThree()

    // ← ADD THIS — dispose old geometry before creating new one
    useEffect(() => {
        return () => {
            if (pointsRef.current) {
                pointsRef.current.geometry.dispose()
                pointsRef.current.material.dispose()
            }
        }
    }, [])

    const count = 3000 // ← reduce from 5000 to 3000 for production

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)

        // initialize originalPos HERE — not conditionally
        originalPos.current = new Float32Array(count * 3)

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const radius = Math.random() * 10 + 2

            const fx = radius * Math.sin(phi) * Math.cos(theta)
            const fy = radius * Math.sin(phi) * Math.sin(theta)
            const fz = radius * Math.cos(phi)

            // start at origin
            positions[i * 3] = 0
            positions[i * 3 + 1] = 0
            positions[i * 3 + 2] = 0

            // store final positions
            originalPos.current[i * 3] = fx
            originalPos.current[i * 3 + 1] = fy
            originalPos.current[i * 3 + 2] = fz

            colors[i * 3] = 0.66
            colors[i * 3 + 1] = 0.33
            colors[i * 3 + 2] = 0.97
        }

        return { positions, colors }
    }, []) // ← empty deps = only runs ONCE, never regenerates

    // single stable event listener — never recreated
    useEffect(() => {
        const handleMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = -(e.clientY / window.innerHeight) * 2 + 1

            // check if mouse is still
            const dx = Math.abs(e.clientX - lastMousePos.current.x)
            const dy = Math.abs(e.clientY - lastMousePos.current.y)

            if (dx < 3 && dy < 3) {
                hoverTimer.current += 0.05
            } else {
                hoverTimer.current = 0
                if (supernovaPhase.current === 1) {
                    supernovaPhase.current = 0
                }
            }

            lastMousePos.current = { x: e.clientX, y: e.clientY }

            // store in ref — no re-render triggered
            mouse3D.current.x = x * viewport.width / 2
            mouse3D.current.y = y * viewport.height / 2

            // trigger charge
            if (hoverTimer.current > 30 && supernovaPhase.current === 0) {
                supernovaPhase.current = 1
                supernovaCenter.current.x = mouse3D.current.x
                supernovaCenter.current.y = mouse3D.current.y
            }

            // trigger explosion
            if (hoverTimer.current > 80 && supernovaPhase.current === 1) {
                supernovaPhase.current = 2
                hoverTimer.current = 0
                setTimeout(() => {
                    supernovaPhase.current = 3
                }, 800)
            }
        }

        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [viewport]) // only re-runs if viewport changes

    useFrame((_, delta) => {
        if (!pointsRef.current) return

        const geo = pointsRef.current.geometry
        const pos = geo.attributes.position.array
        const cols = geo.attributes.color.array
        const orig = originalPos.current

        // ── INITIAL BIG BANG EXPAND ──────────────────────
        if (!initialized.current) {
            let allSettled = true

            for (let i = 0; i < count; i++) {
                const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2
                pos[ix] += (orig[ix] - pos[ix]) * 0.035
                pos[iy] += (orig[iy] - pos[iy]) * 0.035
                pos[iz] += (orig[iz] - pos[iz]) * 0.035

                const dx = Math.abs(pos[ix] - orig[ix])
                if (dx > 0.05) allSettled = false
            }

            geo.attributes.position.needsUpdate = true
            if (allSettled) initialized.current = true
            return // cursor interaction waits until settled
        }

        const mouse = mouse3D.current
        const phase = supernovaPhase.current
        const center = supernovaCenter.current

        // slow base rotation
        pointsRef.current.rotation.y -= delta * 0.04
        pointsRef.current.rotation.x -= delta * 0.02

        for (let i = 0; i < count; i++) {
            const ix = i * 3
            const iy = i * 3 + 1
            const iz = i * 3 + 2

            const px = pos[ix]
            const py = pos[iy]
            const pz = pos[iz]

            // cursor repulsion
            const dx = px - mouse.x
            const dy = py - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (phase === 0 || phase === 3) {
                if (dist < 2.0) {
                    const force = (2.0 - dist) / 2.0
                    const angle = Math.atan2(dy, dx)
                    pos[ix] += Math.cos(angle) * force * 0.05
                    pos[iy] += Math.sin(angle) * force * 0.05

                    // glow white near cursor
                    cols[ix] = 0.9 + force * 0.1
                    cols[iy] = 0.7 + force * 0.3
                    cols[iz] = 1.0
                } else {
                    // return to original
                    pos[ix] += (orig[ix] - px) * 0.02
                    pos[iy] += (orig[iy] - py) * 0.02
                    pos[iz] += (orig[iz] - pz) * 0.02

                    // restore color
                    cols[ix] += (0.66 - cols[ix]) * 0.05
                    cols[iy] += (0.33 - cols[iy]) * 0.05
                    cols[iz] += (0.97 - cols[iz]) * 0.05
                }
            }

            // charging — spiral inward
            if (phase === 1) {
                const cx = px - center.x
                const cy = py - center.y
                const cdist = Math.sqrt(cx * cx + cy * cy) + 0.001
                const pull = Math.min(hoverTimer.current * 0.0008, 0.06)

                pos[ix] -= (cx / cdist) * pull
                pos[iy] -= (cy / cdist) * pull

                const heat = Math.min(hoverTimer.current / 80, 1)
                cols[ix] = 0.66 + heat * 0.34
                cols[iy] = 0.33 + heat * 0.4
                cols[iz] = 0.97 - heat * 0.6
            }

            // exploding — blast outward
            if (phase === 2) {
                const cx = px - center.x
                const cy = py - center.y
                const cdist = Math.sqrt(cx * cx + cy * cy) + 0.001

                pos[ix] += (cx / cdist) * 0.3
                pos[iy] += (cy / cdist) * 0.3
                pos[iz] += (Math.random() - 0.5) * 0.3

                cols[ix] = 1.0
                cols[iy] = 0.85
                cols[iz] = 0.5
            }

            // collapsing back
            if (phase === 3) {
                pos[ix] += (orig[ix] - px) * 0.04
                pos[iy] += (orig[iy] - py) * 0.04
                pos[iz] += (orig[iz] - pz) * 0.04

                cols[ix] += (0.66 - cols[ix]) * 0.04
                cols[iy] += (0.33 - cols[iy]) * 0.04
                cols[iz] += (0.97 - cols[iz]) * 0.04
            }
        }

        geo.attributes.position.needsUpdate = true
        geo.attributes.color.needsUpdate = true
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                    usage={35048} // THREE.DynamicDrawUsage — tells GPU buffer changes frequently
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[particles.colors, 3]}
                    usage={35048}
                />
            </bufferGeometry>
            <pointsMaterial
                transparent
                vertexColors
                size={0.018}
                sizeAttenuation
                depthWrite={false}
                opacity={0.75}
                blending={2}
            />
        </points>
    )
}

// ─── FLOATING TORUS ─────────────────────────────────────
const FloatingTorus = () => {
    const meshRef = useRef(null)
    const mouse3D = useRef(new THREE.Vector3())

    useMemo(() => {
        const handler = (e) => {
            mouse3D.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse3D.current.y = -(e.clientY / window.innerHeight) * 2 + 1
        }
        window.addEventListener('mousemove', handler)
        return () => window.removeEventListener('mousemove', handler)
    }, [])

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
        meshRef.current.rotation.y += 0.004
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3

        // subtle mouse parallax on torus
        meshRef.current.position.x += (mouse3D.current.x * 0.5 - meshRef.current.position.x + 3) * 0.02
    })

    return (
        <mesh ref={meshRef} position={[3, 0, -2]}>
            <torusGeometry args={[1.2, 0.3, 16, 60]} />
            <meshStandardMaterial color="#7B2FBE" wireframe transparent opacity={0.15} />
        </mesh>
    )
}

// ─── FLOATING ICO ───────────────────────────────────────
const FloatingIco = () => {
    const meshRef = useRef(null)
    const mouse3D = useRef(new THREE.Vector3())

    useMemo(() => {
        const handler = (e) => {
            mouse3D.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse3D.current.y = -(e.clientY / window.innerHeight) * 2 + 1
        }
        window.addEventListener('mousemove', handler)
        return () => window.removeEventListener('mousemove', handler)
    }, [])

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.rotation.x += 0.003
        meshRef.current.rotation.z += 0.002
        meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.4) * 0.4

        // subtle mouse parallax on ico
        meshRef.current.position.x += (mouse3D.current.x * -0.4 - meshRef.current.position.x - 3.5) * 0.02
    })

    return (
        <mesh ref={meshRef} position={[-3.5, 1, -3]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#A855F7" wireframe transparent opacity={0.12} />
        </mesh>
    )
}

// ─── SCENE ──────────────────────────────────────────────
const Scene = () => (
    <div className={styles.canvasWrap}>
        <Canvas
            camera={{ position: [0, 0, 6], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
        >
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#A855F7" />
            <pointLight position={[-5, -5, 5]} intensity={0.4} color="#7B2FBE" />
            <ParticleField />
            <FloatingTorus />
            <FloatingIco />
        </Canvas>
    </div>
)

export default Scene