// This hook tracks raw mouse coordinates
// Separating it into its own hook = reusable anywhere
import { useEffect, useRef } from 'react'

const useMousePosition = (callback) => {
    const positionRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMove = (e) => {
            positionRef.current = { x: e.clientX, y: e.clientY }
            callback?.({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [callback])

    return positionRef
}

export default useMousePosition