// Magnetic effect — element gets pulled toward cursor
// This is the hook that powers magnetic buttons
import { useRef, useCallback } from 'react'
import { gsap } from 'gsap'

const useMagnet = (strength = 0.4) => {
    const ref = useRef(null)

    const handleMouseMove = useCallback((e) => {
        const el = ref.current
        if (!el) return

        const rect = el.getBoundingClientRect()

        // center of the element
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // distance from cursor to center
        const deltaX = (e.clientX - centerX) * strength
        const deltaY = (e.clientY - centerY) * strength

        // GSAP moves the element toward cursor
        gsap.to(el, {
            x: deltaX,
            y: deltaY,
            duration: 0.4,
            ease: 'power2.out',
        })
    }, [strength])

    const handleMouseLeave = useCallback(() => {
        // snap back to original position
        gsap.to(ref.current, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)',
        })
    }, [])

    return { ref, handleMouseMove, handleMouseLeave }
}

export default useMagnet