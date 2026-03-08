// framer-motion handles our animations
// useScroll + useMotionValueEvent let us track scroll position reactively
import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'
import styles from './Navbar.module.scss'

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
]

const Navbar = () => {
    // tracks if user scrolled down — changes navbar style
    const [scrolled, setScrolled] = useState(false)
    // tracks mobile menu open/close
    const [menuOpen, setMenuOpen] = useState(false)
    // tracks which section is active
    const [active, setActive] = useState('home')

    // useScroll is a framer-motion hook — gives us scroll progress as a MotionValue
    // MotionValues are like state but don't trigger re-renders on every pixel
    // that's why they're more performant for scroll-based effects
    const { scrollY } = useScroll()

    // useMotionValueEvent subscribes to a MotionValue change
    // much better than useEffect + window.addEventListener for scroll
    useMotionValueEvent(scrollY, 'change', (latest) => {
        setScrolled(latest > 50)
    })

    // Close mobile menu when screen resizes to desktop
    // This is a classic useEffect cleanup example
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setMenuOpen(false)
        }
        window.addEventListener('resize', handleResize)
        // cleanup — removes listener when component unmounts
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Track active section using IntersectionObserver
    // This is a powerful Web API — fires when elements enter/leave viewport
    useEffect(() => {
        const sections = navLinks.map(l => l.href.replace('#', ''))
        const observers = []

        sections.forEach(id => {
            const el = document.getElementById(id)
            if (!el) return

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActive(id)
                },
                { threshold: 0.5 } // fires when 50% of section is visible
            )

            observer.observe(el)
            observers.push(observer)
        })

        // cleanup all observers
        return () => observers.forEach(o => o.disconnect())
    }, [])

    // framer-motion animation variants
    // variants are reusable animation states — cleaner than inline props
    const navVariants = {
        hidden: { y: -80, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
        }
    }

    const mobileMenuVariants = {
        closed: { opacity: 0, height: 0 },
        open: {
            opacity: 1,
            height: 'auto',
            transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
        }
    }

    const linkVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            // staggered delay — each link animates slightly after the previous
            // this is the 'i' custom prop passed below
            transition: { delay: 0.1 + i * 0.07, duration: 0.4 }
        })
    }

    return (
        // motion.nav is just a <nav> with animation superpowers
        <motion.nav
            className={clsx(styles.navbar, { [styles.scrolled]: scrolled })}
            variants={navVariants}
            initial="hidden"
            animate="visible"
            style={{
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)', // React camelCase for -webkit-
            }}
        >
            <div className={styles.inner}>

                {/* LOGO */}
                <motion.a
                    href="#home"
                    className={styles.logo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <span className={styles.logoAccent}>V</span>iren
                    <span className={styles.logoDot}>.</span>
                </motion.a>

                {/* DESKTOP LINKS */}
                <ul className={styles.links}>
                    {navLinks.map((link, i) => (
                        <motion.li
                            key={link.href}
                            custom={i}
                            variants={linkVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <a
                                href={link.href}
                                className={clsx(styles.link, {
                                    [styles.active]: active === link.href.replace('#', '')
                                })}
                            >
                                {link.label}
                            </a>
                        </motion.li>
                    ))}
                </ul>

                {/* CTA BUTTON */}
                <motion.a
                    href="mailto:viren0210@gmail.com"
                    className={styles.cta}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                >
                    Hire Me
                </motion.a>

                {/* MOBILE HAMBURGER */}
                <button
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    {/* conditional render — show X when open, Menu when closed */}
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

            </div>

            {/* MOBILE MENU */}
            <motion.div
                className={styles.mobileMenu}
                variants={mobileMenuVariants}
                initial="closed"
                animate={menuOpen ? 'open' : 'closed'}
            >
                {navLinks.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className={clsx(styles.mobileLink, {
                            [styles.active]: active === link.href.replace('#', '')
                        })}
                        onClick={() => setMenuOpen(false)}
                    >
                        {link.label}
                    </a>
                ))}
            </motion.div >

        </motion.nav >
    )
}

export default Navbar