import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CursorProvider } from './context/CursorContext.jsx'
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CursorProvider>
      <App />
    </CursorProvider>
  </React.StrictMode>,
)