import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useCursor } from '../../context/CursorContext'
import styles from './HexSphere.module.scss'

const SKILLS = [
    { name: 'React', ring: 0, color: '#C084FC' },
    { name: 'Node.js', ring: 0, color: '#A855F7' },
    { name: 'TypeScript', ring: 0, color: '#D8B4FE' },
    { name: 'MongoDB', ring: 0, color: '#9333EA' },
    { name: 'Express.js', ring: 1, color: '#A855F7' },
    { name: 'MySQL', ring: 1, color: '#C084FC' },
    { name: 'Prisma', ring: 1, color: '#7C3AED' },
    { name: 'REST APIs', ring: 1, color: '#8B5CF6' },
    { name: 'Git', ring: 1, color: '#A78BFA' },
    { name: 'SCSS/CSS', ring: 1, color: '#C084FC' },
    { name: 'HTML', ring: 2, color: '#DDD6FE' },
    { name: 'JavaScript', ring: 2, color: '#C084FC' },
    { name: 'Vite', ring: 2, color: '#A855F7' },
    { name: 'Tailwind', ring: 2, color: '#8B5CF6' },
    { name: 'Figma', ring: 2, color: '#A78BFA' },
    { name: 'Bootstrap', ring: 2, color: '#7C3AED' },
    { name: 'WordPress', ring: 2, color: '#9333EA' },
    { name: 'JWT', ring: 2, color: '#D8B4FE' },
]

const RINGS = [
    { radius: 1.8, tilt: 0.4, speed: 0.35, color: '#9333EA' },
    { radius: 2.9, tilt: -0.6, speed: 0.22, color: '#7B2FBE' },
    { radius: 4.1, tilt: 0.2, speed: 0.13, color: '#6D28D9' },
]

// ── DUST PARTICLES ────────────────────────────────────
const DustParticles = () => {
    const ref = useRef()
    const COUNT = 1200

    const { positions, colors, sizes } = useMemo(() => {
        const pos = new Float32Array(COUNT * 3)
        const col = new Float32Array(COUNT * 3)
        const sz = new Float32Array(COUNT)
        const purples = [
            new THREE.Color('#A855F7'),
            new THREE.Color('#7B2FBE'),
            new THREE.Color('#1a0a2e'),
            new THREE.Color('#4c1d95'),
            new THREE.Color('#2e1065'),
        ]
        for (let i = 0; i < COUNT; i++) {
            const r = 1.5 + Math.random() * 7
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5  // flatten like a galaxy disc
            pos[i * 3 + 2] = r * Math.cos(phi)
            const c = purples[Math.floor(Math.random() * purples.length)]
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
            sz[i] = Math.random() * 0.04 + 0.01
        }
        return { positions: pos, colors: col, sizes: sz }
    }, [])

    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * 0.02
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    )
}

// ── ORBIT RING ────────────────────────────────────────
const OrbitRing = ({ radius, tilt, color }) => {
    const geo = useMemo(() => {
        const pts = []
        for (let i = 0; i <= 256; i++) {
            const a = (i / 256) * Math.PI * 2
            pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
        }
        return new THREE.BufferGeometry().setFromPoints(pts)
    }, [radius])

    return (
        <group rotation={[tilt, 0, 0]}>
            <line geometry={geo}>
                <lineBasicMaterial color={color} transparent opacity={0.25} />
            </line>
        </group>
    )
}

// ── SKILL NODE ────────────────────────────────────────
const SkillNode = ({ skill, ring, angleOffset }) => {
    const groupRef = useRef()
    const dotRef = useRef()
    const textRef = useRef()
    const angleRef = useRef(angleOffset)
    const cfg = RINGS[ring]
    const [hovered, setHovered] = useState(false)

    // trail positions
    const trailRef = useRef([])
    const trailGeoRef = useRef()
    const TRAIL_LEN = 24

    useFrame(({ camera }, delta) => {
        if (!groupRef.current) return

        angleRef.current += delta * cfg.speed

        const a = angleRef.current
        const rx = Math.cos(a) * cfg.radius
        const rz = Math.sin(a) * cfg.radius
        const ry = Math.sin(a) * Math.sin(cfg.tilt) * cfg.radius * 0.45

        groupRef.current.position.set(rx, ry, rz)
        groupRef.current.lookAt(camera.position)

        // depth-based opacity
        const depth = (rz + cfg.radius) / (cfg.radius * 2)  // 0..1
        const fade = 0.25 + depth * 0.75
        if (textRef.current) {
            textRef.current.fillOpacity = hovered ? 1 : fade * 0.85
            textRef.current.fontSize = hovered ? 0.22 : 0.16
        }

        // dot pulse
        if (dotRef.current) {
            const pulse = 1 + Math.sin(Date.now() * 0.003 + angleOffset) * 0.3
            dotRef.current.scale.setScalar(hovered ? 2 : pulse)
            dotRef.current.material.opacity = fade
        }

        // trail update
        trailRef.current.unshift({ x: rx, y: ry, z: rz })
        if (trailRef.current.length > TRAIL_LEN) trailRef.current.pop()

        if (trailGeoRef.current && trailRef.current.length > 2) {
            const pts = trailRef.current.map(p => new THREE.Vector3(p.x, p.y, p.z))
            trailGeoRef.current.setFromPoints(pts)
        }
    })

    const trailGeo = useMemo(() => new THREE.BufferGeometry(), [])
    trailGeoRef.current = trailGeo

    return (
        <group>
            {/* glow trail */}
            <line geometry={trailGeo}>
                <lineBasicMaterial
                    color={skill.color}
                    transparent
                    opacity={0.18}
                />
            </line>

            {/* node group */}
            <group
                ref={groupRef}
                onPointerOver={e => { e.stopPropagation(); setHovered(true) }}
                onPointerOut={() => setHovered(false)}
            >
                {/* outer glow halo */}
                <mesh>
                    <sphereGeometry args={[hovered ? 0.18 : 0.1, 12, 12]} />
                    <meshBasicMaterial
                        color={skill.color}
                        transparent
                        opacity={0.08}
                    />
                </mesh>

                {/* dot */}
                <mesh ref={dotRef}>
                    <sphereGeometry args={[0.055, 10, 10]} />
                    <meshBasicMaterial
                        color={skill.color}
                        transparent
                        opacity={1}
                    />
                </mesh>

                {/* label */}
                <Text
                    ref={textRef}
                    position={[0.15, 0, 0]}
                    fontSize={0.16}
                    color={skill.color}
                    anchorX="left"
                    anchorY="middle"
                    fillOpacity={1}
                    fontWeight={hovered ? 700 : 400}
                >
                    {skill.name}
                </Text>
            </group>
        </group>
    )
}

// ── NUCLEUS ───────────────────────────────────────────
const Nucleus = () => {
    const coreRef = useRef()
    const wire1Ref = useRef()
    const wire2Ref = useRef()
    const haloRef = useRef()

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (coreRef.current) { coreRef.current.rotation.y += 0.01; coreRef.current.rotation.x += 0.006 }
        if (wire1Ref.current) { wire1Ref.current.rotation.y -= 0.007; wire1Ref.current.rotation.z += 0.004 }
        if (wire2Ref.current) { wire2Ref.current.rotation.x += 0.005; wire2Ref.current.rotation.z -= 0.006 }
        if (haloRef.current) {
            const s = 1 + Math.sin(t * 1.8) * 0.12
            haloRef.current.scale.setScalar(s)
        }
    })

    return (
        <group>
            {/* solid core */}
            <mesh ref={coreRef}>
                <icosahedronGeometry args={[0.28, 1]} />
                <meshStandardMaterial
                    color="#A855F7"
                    emissive="#7B2FBE"
                    emissiveIntensity={1.5}
                    metalness={1}
                    roughness={0}
                />
            </mesh>

            {/* wireframe shell 1 */}
            <mesh ref={wire1Ref}>
                <icosahedronGeometry args={[0.42, 1]} />
                <meshBasicMaterial color="#C084FC" wireframe transparent opacity={0.35} />
            </mesh>

            {/* wireframe shell 2 — counter rotating */}
            <mesh ref={wire2Ref}>
                <icosahedronGeometry args={[0.56, 2]} />
                <meshBasicMaterial color="#7B2FBE" wireframe transparent opacity={0.18} />
            </mesh>

            {/* breathing halo */}
            <mesh ref={haloRef}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshBasicMaterial color="#A855F7" transparent opacity={0.04} side={THREE.BackSide} />
            </mesh>

            {/* drei sparkles around nucleus */}
            <Sparkles
                count={30}
                scale={2}
                size={1.5}
                speed={0.4}
                color="#C084FC"
                opacity={0.7}
            />
        </group>
    )
}

// ── SCENE ─────────────────────────────────────────────
const GalaxyScene = () => {
    const ringSkills = SKILLS.reduce((acc, skill) => {
        if (!acc[skill.ring]) acc[skill.ring] = []
        acc[skill.ring].push(skill)
        return acc
    }, {})

    return (
        <>
            <DustParticles />
            <Nucleus />
            {RINGS.map((ring, i) => (
                <OrbitRing key={i} radius={ring.radius} tilt={ring.tilt} color={ring.color} />
            ))}
            {Object.entries(ringSkills).map(([ringIdx, skills]) =>
                skills.map((skill, i) => (
                    <SkillNode
                        key={skill.name}
                        skill={skill}
                        ring={parseInt(ringIdx)}
                        angleOffset={(i / skills.length) * Math.PI * 2}
                    />
                ))
            )}
        </>
    )
}

// ── MAIN EXPORT ───────────────────────────────────────
const SkillGalaxy = () => {
    const { setCursorType } = useCursor()

    return (
        <div
            className={styles.wrap}
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
        >
            <Canvas
                camera={{ position: [0, 3, 8.5], fov: 48 }}
                style={{ width: '100%', height: '580px' }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.15} />
                <pointLight position={[0, 0, 0]} intensity={3} color="#A855F7" />
                <pointLight position={[5, 5, 5]} intensity={0.8} color="#7B2FBE" />
                <pointLight position={[-5, -3, 3]} intensity={0.5} color="#C084FC" />

                <GalaxyScene />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    rotateSpeed={0.35}
                    dampingFactor={0.06}
                    enableDamping
                    autoRotate
                    autoRotateSpeed={0.3}
                />
            </Canvas>

            <p className={styles.hint}>// drag to explore · hover a skill</p>
        </div>
    )
}

export default SkillGalaxy