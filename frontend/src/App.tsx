import { useState, useEffect } from 'react'
import './App.css'
import type { HealthResponse } from 'shared'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)

  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(console.error)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <h1>Frontend</h1>
            <div>
              <h2>Backend Status:</h2>
              {health ? (
                <div>
                  <p>Status: {health.status}</p>
                  <p>Time: {health.timestamp}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
