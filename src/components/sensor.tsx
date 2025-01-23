"use client";

import { useEffect } from "react";
import { useSnapshot } from 'valtio';
import { sensorStore } from '../store';

export default function SensorDisplay() {
  const { sensorData, status, error } = useSnapshot(sensorStore);

  useEffect(() => {
    sensorStore.connect();
    return () => sensorStore.disconnect();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">BMP280 Sensor Data</h1>

      {/* Connection Status */}
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm
          ${status === 'connected' ? 'bg-green-100 text-green-800' :
            status === 'error' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'}`}>
          <div className={`w-2 h-2 rounded-full
            ${status === 'connected' ? 'bg-green-500' :
              status === 'error' ? 'bg-red-500' :
                'bg-yellow-500'}`}></div>
          {status === 'connected' ? 'Connected' :
            status === 'error' ? 'Error' :
              'Connecting...'}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Sensor Data */}
      {sensorData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Temperature</h2>
            <p className="text-3xl font-bold text-blue-600">
              {sensorData.temperature}°C
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Pressure</h2>
            <p className="text-3xl font-bold text-purple-600">
              {sensorData.pressure} hPa
            </p>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">
          {status === 'connected' ? 'Waiting for sensor data...' : 'Connecting to sensor...'}
        </div>
      )}
    </div>
  );
}
