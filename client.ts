import { io } from "socket.io-client";

// Define interface for sensor data
interface SensorData {
  temperature: number;
  pressure: number;
}

// Create Socket.IO client
const socket = io("http://localhost:8080");

// Connection event
socket.on("connect", () => {
  console.log("Connected to server");
});

// Disconnection event
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// Listen for sensor data
socket.on('sensor_data', (data: SensorData) => {
  console.log('Temperature:', data.temperature, '°C');
  console.log('Pressure:', data.pressure, 'hPa');
});

// Error event
socket.on("connect_error", (error) => {
  console.log("Connection error:", error);
});
