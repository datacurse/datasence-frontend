import React from 'react'
import SensorMonitor from '../components/sensor'

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Waku</h1>
      <p>Your content here</p>
      <SensorMonitor />
    </div>
  )
}
