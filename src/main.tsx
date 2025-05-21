
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/scrollbar-hide.css'

// Create root outside of any function to avoid hook-related errors
const root = ReactDOM.createRoot(document.getElementById('root')!)

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
