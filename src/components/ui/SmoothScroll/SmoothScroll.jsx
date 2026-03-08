import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SmoothScroll = ({ children }) => {
    const lenisRef = useRef(null)
    // wake up Render backend on page load
    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL)
            .catch(() => { }) // silent — just waking it up
    }, [])
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.8,
        })

        lenisRef.current = lenis
        window.lenis = lenis  // expose globally for ScrollTrigger proxy

        // sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', () => ScrollTrigger.update())

        const tickerFn = (time) => lenis.raf(time * 1000)
        gsap.ticker.add(tickerFn)
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(tickerFn)
            lenis.destroy()
            window.lenis = null
        }
    }, [])

    return <>{children}</>
}

export default SmoothScroll