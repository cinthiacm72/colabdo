import { io } from "socket.io-client";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export function createSocket(token) {
  return io(BACKEND, {
    auth: { token },
    autoConnect: false,
  });
}

export default createSocket;
