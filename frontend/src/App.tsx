import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import './App.css'
import type { HealthResponse } from 'shared'

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const { data: queryData } = useQuery('health', () => 
    fetch('http://localhost:3001/api/health').then(res => res.json())
  )

  useEffect(() => {
    if (queryData) setHealth(queryData)
  }, [queryData])

  return (
    <>
      <h1>Frontend with Query</h1>
      <div>
        <h2>Backend Status:</h2>
        {health ? (
          <div>
            <p>Status: {health.status}</p>
            <p>Time: {health.lastUpdated}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  )
}

export default App
