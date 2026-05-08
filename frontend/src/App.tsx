import { useState, useEffect } from 'react'
import './App.css'
import type { HealthResponse } from 'shared'
import { resolveWorkspaceLabel } from 'shared'

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)

  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(console.error)
  }, [])

  return (
    <>
      <h1>Frontend</h1>
      <div>
        <h2>Backend Status:</h2>
        {health ? (
          <div>
            <p>Status: {health.status}</p>
            <p>Time: {health.lastUpdated}</p>
            <p>Workspace: {resolveWorkspaceLabel('frontend')}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  )
}

export default App
