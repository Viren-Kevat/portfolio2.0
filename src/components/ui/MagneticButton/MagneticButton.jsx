import useMagnet from '../../../hooks/useMagnet'
import { useCursor } from '../../../context/CursorContext'
import styles from './MagneticButton.module.scss'

const MagneticButton = ({ children, strength = 0.4, className = '' }) => {
    const { ref, handleMouseMove, handleMouseLeave } = useMagnet(strength)
    const { setCursorType } = useCursor()

    return (
        <div
            ref={ref}
            className={`${styles.magnetic} ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setCursorType('magnetic')}
        >
            {children}
        </div>
    )
}

export default MagneticButton