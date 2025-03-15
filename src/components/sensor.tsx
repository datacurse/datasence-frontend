"use client"
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { cn } from "@udecode/cn";

interface SensorData {
  temperature: number;
  pressure: number;
}

export default function SensorDisplay() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io("http://192.168.1.2:8080", {
      transports: ['polling', 'websocket'],
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on("connect", () => {
      console.log("Connected to sensor server");
      setStatus('connected');
      setError(null);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from sensor server");
      setStatus('error');
      setError("Disconnected from server");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setStatus('error');
      setError(`Connection error: ${err.message}`);
    });

    socket.on("sensor_data", (data: SensorData) => {
      setSensorData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const statusClasses = {
    connected: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    connecting: 'bg-yellow-100 text-yellow-800'
  };

  const dotClasses = {
    connected: 'bg-green-500',
    error: 'bg-red-500',
    connecting: 'bg-yellow-500'
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">BMP280 Sensor Data</h1>

      {/* Connection Status */}
      <div className="mb-4">
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm",
          statusClasses[status]
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full",
            dotClasses[status]
          )}></div>
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
          <div className={cn(
            "bg-white shadow rounded-lg p-6",
            "transition-all duration-200 hover:shadow-lg"
          )}>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Temperature</h2>
            <p className="text-3xl font-bold text-blue-600">
              {sensorData.temperature}°C
            </p>
          </div>
          <div className={cn(
            "bg-white shadow rounded-lg p-6",
            "transition-all duration-200 hover:shadow-lg"
          )}>
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
