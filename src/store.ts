import { proxy, subscribe } from 'valtio';
import { io as ioClient, Socket } from 'socket.io-client';

interface SensorData {
  temperature: number;
  pressure: number;
}

interface SensorStore {
  sensorData: SensorData | null;
  status: 'connecting' | 'connected' | 'error';
  error: string | null;
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
}

export const sensorStore = proxy<SensorStore>({
  sensorData: null,
  status: 'connecting',
  error: null,
  socket: null,

  connect() {
    if (this.socket) {
      this.socket.disconnect();
    }

    const socket = ioClient("http://192.168.1.2:8080", {
      transports: ['websocket'],
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on("connect", () => {
      console.log("Connected to sensor server");
      this.status = 'connected';
      this.error = null;
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from sensor server");
      this.status = 'error';
      this.error = "Disconnected from server";
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      this.status = 'error';
      this.error = `Connection error: ${err.message}`;
    });

    socket.on("sensor_data", (data: SensorData) => {
      this.sensorData = data;
    });

    this.socket = socket;
  },

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
});
