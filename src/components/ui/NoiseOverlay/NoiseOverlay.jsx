import { useEffect, useRef } from 'react'

// Generates real pixel-level noise on a canvas
// Use inside any section with position: relative
// position: absolute — contained to parent section only
const NoiseOverlay = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        const W = 256
        const H = 256
        canvas.width = W
        canvas.height = H

        const imageData = ctx.createImageData(W, H)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
            const val = Math.random() * 255
            data[i] = val  // R
            data[i + 1] = val  // G
            data[i + 2] = val  // B
            data[i + 3] = 255  // A
        }

        ctx.putImageData(imageData, 0, 0)
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                pointerEvents: 'none',
                width: '100%',
                height: '100%',
                opacity: 0.02,
                mixBlendMode: 'screen',
            }}
        />
    )
}

export default NoiseOverlay