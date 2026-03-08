import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Linkedin, Instagram, Mail, Send, CheckCircle } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton/MagneticButton'
import { useCursor } from '../../context/CursorContext'
import styles from './Contact.module.scss'

const socials = [
    { label: 'GitHub', href: 'https://github.com/Viren-Kevat', icon: Github },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/viren-kevat', icon: Linkedin },
    { label: 'Instagram', href: 'https://instagram.com/_http.viren', icon: Instagram },
    { label: 'Email', href: 'mailto:viren0210@gmail.com', icon: Mail },
]

const Contact = () => {
    const { setCursorType } = useCursor()
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    const [fields, setFields] = useState({ name: '', email: '', message: '' })
    const [errors, setErrors] = useState({})
    const [sent, setSent] = useState(false)
    const [sending, setSending] = useState(false)

    const handleChange = (key, val) => {
        setFields(p => ({ ...p, [key]: val }))
        if (errors[key]) setErrors(p => ({ ...p, [key]: '' }))
    }

    const validate = () => {
        const e = {}
        if (!fields.name.trim()) e.name = 'Required'
        if (!fields.email.trim()) e.email = 'Required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Invalid email'
        if (!fields.message.trim()) e.message = 'Required'
        return e
    }

    const handleSubmit = async () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }

        setSending(true)
        try {
            // console.log("API URL:", import.meta.env.VITE_API_URL)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fields)
            })
            if (!res.ok) throw new Error()
            setSent(true)
        } catch {
            setErrors({ message: 'Something went wrong. Email me directly at viren0210@gmail.com' })
        } finally {
            setSending(false)
        }
    }

    return (
        <section className={styles.contact} id="contact" ref={ref}>

            <div className={styles.bgOrb} />

            <div className={styles.inner}>

                {/* heading */}
                <motion.div
                    className={styles.headingWrap}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <span className={styles.label}>// let's connect</span>
                    <h2 className={styles.heading}>
                        GOT AN IDEA?<br />
                        <span className={styles.accent}>LET'S TALK.</span>
                    </h2>
                </motion.div>

                {/* compact card */}
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.15 }}
                >
                    {sent ? (
                        <div className={styles.success}>
                            <CheckCircle size={36} className={styles.successIcon} />
                            <p className={styles.successTitle}>Message sent!</p>
                            <p className={styles.successSub}>I'll reply within 24h.</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <input
                                        className={`${styles.input} ${errors.name ? styles.err : ''}`}
                                        placeholder="Your name"
                                        value={fields.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                        onFocus={() => setCursorType('text')}
                                        onBlur={() => setCursorType('default')}
                                    />
                                    {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                                </div>
                                <div className={styles.field}>
                                    <input
                                        className={`${styles.input} ${errors.email ? styles.err : ''}`}
                                        placeholder="Email address"
                                        value={fields.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                        onFocus={() => setCursorType('text')}
                                        onBlur={() => setCursorType('default')}
                                    />
                                    {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
                                </div>
                            </div>

                            <div className={styles.field}>
                                <textarea
                                    className={`${styles.textarea} ${errors.message ? styles.err : ''}`}
                                    placeholder="Your message..."
                                    rows={4}
                                    value={fields.message}
                                    onChange={e => handleChange('message', e.target.value)}
                                    onFocus={() => setCursorType('text')}
                                    onBlur={() => setCursorType('default')}
                                />
                                {errors.message && <span className={styles.errMsg}>{errors.message}</span>}
                            </div>

                            <MagneticButton strength={0.25}>
                                <button
                                    className={styles.submitBtn}
                                    onClick={handleSubmit}
                                    disabled={sending}
                                    onMouseEnter={() => setCursorType('magnetic')}
                                    onMouseLeave={() => setCursorType('default')}
                                >
                                    {sending ? (
                                        <span className={styles.dots}><span /><span /><span /></span>
                                    ) : (
                                        <><Send size={13} /> Send Message</>
                                    )}
                                </button>
                            </MagneticButton>
                        </>
                    )}
                </motion.div>

                {/* socials + footer */}
                <motion.div
                    className={styles.bottom}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.35 }}
                >
                    <div className={styles.socials}>
                        {socials.map(({ label, href, icon: Icon }) => (
                            <MagneticButton key={label} strength={0.3}>
                                <a
                                    href={href}
                                    target={href.startsWith('mailto') ? undefined : '_blank'}
                                    rel="noopener noreferrer"
                                    className={styles.socialBtn}
                                    onMouseEnter={() => setCursorType('magnetic')}
                                    onMouseLeave={() => setCursorType('default')}
                                    aria-label={label}
                                >
                                    <Icon size={16} />
                                </a>
                            </MagneticButton>
                        ))}
                    </div>

                    <div className={styles.footer}>
                        <span className={styles.copy}>© 2025 Viren Kevat</span>
                        <button
                            className={styles.backTop}
                            onClick={() => window.lenis?.scrollTo(0)}
                            onMouseEnter={() => setCursorType('hover')}
                            onMouseLeave={() => setCursorType('default')}
                        >
                            Back to top ↑
                        </button>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}

export default Contact