import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useCursor } from '../../../context/CursorContext'
import styles from './CustomCursor.module.scss'

const CustomCursor = () => {
    const cursorDotRef = useRef(null)  // small fast dot
    const cursorRingRef = useRef(null)  // large lagging ring
    const { cursorType } = useCursor()

    useEffect(() => {
        const dot = cursorDotRef.current
        const ring = cursorRingRef.current

        // dot follows cursor instantly
        // ring follows with lag — creates depth
        const handleMove = (e) => {
            gsap.to(dot, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out',
            })

            gsap.to(ring, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.45,  // intentional lag
                ease: 'power2.out',
            })
        }

        // hide cursor when leaving window
        const handleLeave = () => {
            gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
        }

        const handleEnter = () => {
            gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
        }

        window.addEventListener('mousemove', handleMove)
        document.addEventListener('mouseleave', handleLeave)
        document.addEventListener('mouseenter', handleEnter)

        return () => {
            window.removeEventListener('mousemove', handleMove)
            document.removeEventListener('mouseleave', handleLeave)
            document.removeEventListener('mouseenter', handleEnter)
        }
    }, [])

    // react to cursor type changes
    useEffect(() => {
        const dot = cursorDotRef.current
        const ring = cursorRingRef.current

        const states = {
            default: { scale: 1, opacity: 1, ringScale: 1 },
            hover: { scale: 0.4, opacity: 0.8, ringScale: 2.2 },
            magnetic: { scale: 0.3, opacity: 0.6, ringScale: 3 },
            text: { scale: 3, opacity: 0.15, ringScale: 0 },
            hidden: { scale: 0, opacity: 0, ringScale: 0 },
        }

        const s = states[cursorType] || states.default

        gsap.to(dot, { scale: s.scale, duration: 0.35, ease: 'power2.out' })
        gsap.to(ring, { scale: s.ringScale, duration: 0.45, ease: 'power2.out', opacity: s.opacity })
    }, [cursorType])

    return (
        <>
            <div ref={cursorDotRef} className={styles.dot} />
            <div ref={cursorRingRef} className={styles.ring} />
        </>
    )
}

export default CustomCursor