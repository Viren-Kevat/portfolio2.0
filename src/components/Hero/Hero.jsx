import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Instagram, Mail } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton/MagneticButton'
import Scene from '../../canvas/Scene'
import { useCursor } from '../../context/CursorContext'
import styles from './Hero.module.scss'

const socials = [
    { icon: Github, href: 'https://github.com/Viren-Kevat', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/viren-kevat', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/_http.viren', label: 'Instagram' },
    { icon: Mail, href: 'mailto:viren0210@gmail.com', label: 'Email' },
]

const roles = [
    'a Full Stack Developer',
    'a Problem Solver',
    'a UI Enthusiast',
    'an Engineering Student',
]

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }
    })
}

const Hero = () => {
    const [roleIndex, setRoleIndex] = useState(0)
    const [displayRole, setDisplayRole] = useState(roles[0])
    const [isDeleting, setIsDeleting] = useState(false)
    const [charIndex, setCharIndex] = useState(roles[0].length)
    const timeoutRef = useRef(null)
    const { setCursorType } = useCursor()

    useEffect(() => {
        const currentRole = roles[roleIndex]
        const tick = () => {
            if (!isDeleting) {
                if (charIndex < currentRole.length) {
                    setDisplayRole(currentRole.slice(0, charIndex + 1))
                    setCharIndex(i => i + 1)
                    timeoutRef.current = setTimeout(tick, 80)
                } else {
                    timeoutRef.current = setTimeout(() => setIsDeleting(true), 2000)
                }
            } else {
                if (charIndex > 0) {
                    setDisplayRole(currentRole.slice(0, charIndex - 1))
                    setCharIndex(i => i - 1)
                    timeoutRef.current = setTimeout(tick, 45)
                } else {
                    setIsDeleting(false)
                    setRoleIndex(i => (i + 1) % roles.length)
                    timeoutRef.current = setTimeout(tick, 300)
                }
            }
        }
        timeoutRef.current = setTimeout(tick, 100)
        return () => clearTimeout(timeoutRef.current)
    }, [charIndex, isDeleting, roleIndex])

    const { scrollY } = useScroll()
    const heroY = useTransform(scrollY, [0, 600], [0, -120])
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

    return (
        <section className={styles.hero} id="home">

            {/* 3D Scene replaces static background */}
            <Scene />

            {/* keep the orbs on top of canvas for extra depth */}
            <div className={styles.bgOrb1} aria-hidden="true" />
            <div className={styles.bgOrb2} aria-hidden="true" />

            <motion.div
                className={styles.content}
                style={{ y: heroY, opacity: heroOpacity }}
            >
                {/* <motion.span
                    className={styles.label}
                    variants={fadeUp} custom={0.1}
                    initial="hidden" animate="visible"
                >
                    // available for work
                </motion.span> */}

                <motion.div
                    className={styles.headingWrap}
                    variants={fadeUp} custom={0.2}
                    initial="hidden" animate="visible"
                >
                    <h1 className={styles.heading}>
                        <span className={styles.headingLine}>I BUILD</span>
                        <span className={styles.headingAccent}>WEB</span>
                        <span className={styles.headingLine}>EXPERIENCES</span>
                    </h1>
                </motion.div>

                <motion.div
                    className={styles.roleWrap}
                    variants={fadeUp} custom={0.35}
                    initial="hidden" animate="visible"
                >
                    <span className={styles.rolePrefix}>I'm  </span>
                    <span className={styles.role}>
                        {displayRole}
                        <span className={styles.cursor}>|</span>
                    </span>
                </motion.div>

                <motion.p
                    className={styles.bio}
                    variants={fadeUp} custom={0.45}
                    initial="hidden" animate="visible"
                    onMouseEnter={() => setCursorType('text')}
                    onMouseLeave={() => setCursorType('default')}
                >
                    I believe great software
                    needs both technical depth and creative vision — and I'm building both.
                </motion.p>

                <motion.div
                    className={styles.ctas}
                    variants={fadeUp} custom={0.55}
                    initial="hidden" animate="visible"
                >
                    {/* MagneticButton wraps our CTAs */}
                    <MagneticButton>
                        <motion.a
                            href="#projects"
                            className={styles.btnPrimary}
                            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(123,47,190,0.5)' }}
                            whileTap={{ scale: 0.97 }}
                            onMouseEnter={() => setCursorType('magnetic')}
                            onMouseLeave={() => setCursorType('default')}
                        >
                            View My Work
                        </motion.a>
                    </MagneticButton>

                    <MagneticButton>
                        <motion.a
                            href="#contact"
                            className={styles.btnOutline}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onMouseEnter={() => setCursorType('magnetic')}
                            onMouseLeave={() => setCursorType('default')}
                        >
                            Let's Talk
                        </motion.a>
                    </MagneticButton>
                </motion.div>

                <motion.div
                    className={styles.socials}
                    variants={fadeUp} custom={0.65}
                    initial="hidden" animate="visible"
                >
                    {socials.map(({ icon: Icon, href, label }) => (
                        <MagneticButton key={label} strength={0.3}>
                            <motion.a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label={label}
                                whileHover={{ scale: 1.2, y: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onMouseEnter={() => setCursorType('hover')}
                                onMouseLeave={() => setCursorType('default')}
                            >
                                <Icon size={20} />
                            </motion.a>
                        </MagneticButton>
                    ))}
                </motion.div>
            </motion.div>

            <motion.div
                className={styles.scrollIndicator}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                    <ArrowDown size={20} />
                </motion.div>
                <span>scroll down</span>
            </motion.div>

        </section>
    )
}

export default Hero