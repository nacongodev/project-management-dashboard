export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  socketOptions: {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  }
}; 