import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton/MagneticButton'
import { useCursor } from '../../context/CursorContext'
import { projects } from '../../data/projects'
import styles from './Projects.module.scss'

gsap.registerPlugin(ScrollTrigger)

// ─── PROJECT CARD ───────────────────────────────────────
const ProjectCard = ({ project, index }) => {
    const { setCursorType } = useCursor()
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <motion.article
            ref={ref}
            className={styles.card}
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
            style={{
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',

            }}
        >
            {/* card glow overlay */}
            <div
                className={styles.cardGlow}
                style={{ background: `radial-gradient(circle at top left, ${project.color}20, transparent 60%)` }}
            />

            {/* project number */}
            <span className={styles.projectNum}>{project.id}</span>

            {/* top row */}
            <div className={styles.cardTop}>
                <span className={styles.year}>{project.year}</span>
                <div className={styles.cardActions}>
                    {project.github && (
                        <MagneticButton strength={0.3}>
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.iconBtn}
                                onMouseEnter={() => setCursorType('magnetic')}
                                onMouseLeave={() => setCursorType('default')}
                                aria-label="GitHub"
                                style={{
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                }}
                            >
                                <Github size={18} />
                            </a>
                        </MagneticButton>
                    )}
                    {project.live && (
                        <MagneticButton strength={0.3}>
                            <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.iconBtn}
                                onMouseEnter={() => setCursorType('magnetic')}
                                onMouseLeave={() => setCursorType('default')}
                                aria-label="Live Demo"
                                style={{
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                }}
                            >
                                <ExternalLink size={18} />
                            </a>
                        </MagneticButton>
                    )}
                </div>
            </div >

            {/* content */}
            < div className={styles.cardContent} >
                <p className={styles.subtitle}>{project.subtitle}</p>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>
            </div >

            {/* tags */}
            < div className={styles.tags} >
                {
                    project.tags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                    ))
                }
            </div >

            {/* bottom CTA */}
            < motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardCta}
                whileHover={{ x: 6 }}
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
            >
                View Project < ArrowRight size={16} />
            </motion.a >
        </motion.article >
    )
}

// ─── MAIN COMPONENT ─────────────────────────────────────
const Projects = () => {
    const { setCursorType } = useCursor()
    const sectionRef = useRef(null)
    const trackRef = useRef(null)
    const headingRef = useRef(null)
    const headingInView = useInView(headingRef, { once: true, margin: '-100px' })

    useEffect(() => {
        if (window.innerWidth < 576) return

        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        let ctx

        const init = setTimeout(() => {
            ctx = gsap.context(() => {
                const totalWidth = track.scrollWidth - window.innerWidth + 280

                ScrollTrigger.scrollerProxy(document.body, {
                    scrollTop(value) {
                        if (arguments.length) window.lenis?.scrollTo(value)
                        return window.lenis?.scroll || window.scrollY
                    },
                    getBoundingClientRect() {
                        return {
                            top: 0, left: 0,
                            width: window.innerWidth,
                            height: window.innerHeight
                        }
                    }
                })

                gsap.to(track, {
                    x: -totalWidth,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        scroller: document.body,
                        start: 'top top',
                        end: () => `+=${totalWidth}`,
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    }
                })

                ScrollTrigger.refresh()
            }, section)
        }, 500)

        return () => {
            clearTimeout(init)
            ctx?.revert()
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    }, [])

    return (
        <section className={styles.projects} id="projects" ref={sectionRef}>

            {/* ── HEADING ─────────────────────────────── */}
            <div
                className={styles.headingWrap}
                ref={headingRef}
                style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',

                }}
            >
                <motion.span
                    className={styles.label}
                    initial={{ opacity: 0 }}
                    animate={headingInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    // selected work
                </motion.span>

                <motion.h2
                    className={styles.heading}
                    initial={{ opacity: 0, y: 40 }}
                    animate={headingInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    WHAT I'VE<br />
                    <span className={styles.headingAccent}>BUILT</span>
                </motion.h2>

                <motion.p
                    className={styles.headingSubtext}
                    initial={{ opacity: 0, y: 20 }}
                    animate={headingInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Scroll to explore →
                </motion.p>
            </div>

            {/* ── HORIZONTAL TRACK ────────────────────── */}
            <div className={styles.track} ref={trackRef}>

                {projects.map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} />
                ))}

                {/* end card */}
                <motion.div
                    className={styles.endCard}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',

                    }}
                >
                    <span className={styles.endLabel}>// more on the way</span>
                    <h3 className={styles.endTitle}>See All<br />Projects</h3>
                    <MagneticButton>
                        <a
                            href="https://github.com/Viren-Kevat"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.endBtn}
                            onMouseEnter={() => setCursorType('magnetic')}
                            onMouseLeave={() => setCursorType('default')}
                        >
                            <Github size={20} />
                            GitHub Profile
                        </a>
                    </MagneticButton>
                </motion.div>

            </div>

        </section >
    )
}

export default Projects