import { createContext, useContext, useState } from 'react'

// Context lets ANY component in the tree know cursor state
// without prop drilling through every parent
const CursorContext = createContext({
    cursorType: 'default',
    setCursorType: () => { },
})

export const CursorProvider = ({ children }) => {
    const [cursorType, setCursorType] = useState('default')

    return (
        <CursorContext.Provider value={{ cursorType, setCursorType }}>
            {children}
        </CursorContext.Provider>
    )
}

// custom hook — cleaner than importing useContext everywhere
export const useCursor = () => useContext(CursorContext)