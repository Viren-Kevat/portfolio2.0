import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    Download, Code2, Layers, Globe, Database,
    GitBranch, Palette, Server, Layout
} from 'lucide-react'
import MagneticButton from '../ui/MagneticButton/MagneticButton'
import { useCursor } from '../../context/CursorContext'
import HexSphere from './HexSphere'
import styles from './About.module.scss'

// ─── DATA ───────────────────────────────────────────────
const skills = [
    { name: 'React', icon: Layers, level: 75 },
    { name: 'Node.js', icon: Server, level: 80 },
    { name: 'WordPress', icon: Globe, level: 85 },
    { name: 'Express.js', icon: Server, level: 80 },
    { name: 'TypeScript', icon: Code2, level: 60 },
    { name: 'MongoDB', icon: Database, level: 80 },
    { name: 'MySQL', icon: Database, level: 70 },
    { name: 'Prisma', icon: Database, level: 60 },
    { name: 'REST APIs', icon: Globe, level: 85 },
    { name: 'Git & GitHub', icon: GitBranch, level: 85 },
    { name: 'SCSS/CSS', icon: Palette, level: 90 },
    { name: 'HTML', icon: Layout, level: 95 },
    { name: 'Bootstrap', icon: Palette, level: 80 },
]

const stats = [
    // { value: '2+', label: 'Years Coding' },
    { value: '4+', label: 'Projects Built' },
    { value: '10+', label: 'Tech & Tools' },
    { value: '∞', label: 'Still Compiling' },
]

// ─── ANIMATION VARIANTS ─────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: (delay = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }
    })
}

const fadeLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1, x: 0,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    }
}

const fadeRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1, x: 0,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    }
}

// ─── SKILL CARD ─────────────────────────────────────────
// extracted as its own component — good React pattern
// keeps About clean and makes SkillCard reusable
const SkillCard = ({ skill, index }) => {
    const { setCursorType } = useCursor()
    const ref = useRef(null)
    // useInView from framer-motion — triggers when element enters viewport
    const inView = useInView(ref, { once: true, margin: '-50px' })

    return (
        <motion.div
            ref={ref}
            className={styles.skillCard}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
        >
            <div className={styles.skillIcon}>
                <skill.icon size={18} />
            </div>
            <span className={styles.skillName}>{skill.name}</span>
            <div className={styles.skillBar}>
                <motion.div
                    className={styles.skillFill}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1, delay: index * 0.06 + 0.3, ease: 'easeOut' }}
                />
            </div>
        </motion.div>
    )
}

// ─── MAIN COMPONENT ─────────────────────────────────────
const About = () => {
    const { setCursorType } = useCursor()

    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const photoRef = useRef(null)

    // useInView — animates when section scrolls into view
    const headingInView = useInView(headingRef, { once: true, margin: '-100px' })
    const photoInView = useInView(photoRef, { once: true, margin: '-100px' })

    return (
        <section className={styles.about} id="about" ref={sectionRef}>

            {/* ── BACKGROUND ──────────────────────────────── */}
            <div className={styles.bgAccent} aria-hidden="true" />

            <div className={styles.container}>

                {/* ── SECTION LABEL ───────────────────────── */}
                <motion.div
                    ref={headingRef}
                    className={styles.labelWrap}
                    variants={fadeUp}
                    custom={0}
                    initial="hidden"
                    animate={headingInView ? 'visible' : 'hidden'}
                >
                    <span className={styles.label}>// about me</span>
                    <h2 className={styles.heading}>
                        THE PERSON<br />
                        <span className={styles.headingAccent}>BEHIND THE CODE</span>
                    </h2>
                </motion.div>

                {/* ── MAIN GRID ───────────────────────────── */}
                <div className={styles.grid}>

                    {/* LEFT — Photo */}
                    <motion.div
                        ref={photoRef}
                        className={styles.photoWrap}
                        variants={fadeLeft}
                        initial="hidden"
                        animate={photoInView ? 'visible' : 'hidden'}
                    >
                        <div className={styles.photoFrame}>
                            {/* swap src to your actual image path once ready */}
                            <img
                                src="/assets/images/viren.jpg"
                                alt="Viren Kevat"
                                className={styles.photo}
                                onError={(e) => {
                                    // fallback if image not found
                                    e.target.style.display = 'none'
                                }}
                            />
                            {/* placeholder shown if no image */}
                            <div className={styles.photoPlaceholder}>
                                <span>VK</span>
                            </div>
                            <div className={styles.photoGlow} aria-hidden="true" />
                            <div className={styles.photoCorner} aria-hidden="true" />
                        </div>

                        {/* floating badge */}
                        <motion.div
                            className={styles.badge}
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        >
                            <span className={styles.badgeDot} />
                            Available for Work
                        </motion.div>
                    </motion.div>

                    {/* RIGHT — Bio + Stats */}
                    <motion.div
                        className={styles.bioWrap}
                        variants={fadeRight}
                        initial="hidden"
                        animate={photoInView ? 'visible' : 'hidden'}
                    >
                        <p
                            className={styles.bio}
                            onMouseEnter={() => setCursorType('text')}
                            onMouseLeave={() => setCursorType('default')}
                        >
                            My journey in IT started with a simple question and zero setup.
                            At the end of my freshman year, I began teaching myself the foundations
                            of the web, driven by the belief that code is a canvas for creativity.
                            Today, whether I'm fine-tuning a WordPress interface or building MERN
                            applications, I focus on creating work that is ready for the world stage.
                            For me, web development is more than a career — it's the most powerful
                            medium to share innovation with everyone.
                        </p>

                        {/* Stats */}
                        <div className={styles.stats}>
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    className={styles.stat}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={photoInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                                    onMouseEnter={() => setCursorType('hover')}
                                    onMouseLeave={() => setCursorType('default')}
                                >
                                    <span className={styles.statValue}>{stat.value}</span>
                                    <span className={styles.statLabel}>{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Resume Button */}
                        <MagneticButton>
                            <a
                                href="https://drive.google.com/uc?export=download&id=1chCR6E3cOeYzt8acD9wMR88Y8LKtvxMs"
                                download
                                className={styles.resumeBtn}
                                onMouseEnter={() => setCursorType('magnetic')}
                                onMouseLeave={() => setCursorType('default')}
                            >
                                <Download size={18} />
                                Download Resume
                            </a>
                        </MagneticButton>
                    </motion.div>

                </div>

                {/* ── SKILLS GRID ─────────────────────────── */}
                <div className={styles.skillsSection}>
                    <motion.span
                        className={styles.label}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
            // tech stack
                    </motion.span>
                    <HexSphere />
                    {/* <HexSkills /> */}
                    {/* <SkillSphere /> */}

                </div>

            </div>
        </section >
    )
}

export default About