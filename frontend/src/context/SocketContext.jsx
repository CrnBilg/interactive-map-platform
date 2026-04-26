import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [liveEvents, setLiveEvents] = useState([])

  useEffect(() => {
    socketRef.current = io('/', { transports: ['websocket'] })

    socketRef.current.on('connect', () => setIsConnected(true))
    socketRef.current.on('disconnect', () => setIsConnected(false))

    socketRef.current.on('event_added', (event) => {
      setLiveEvents(prev => [event, ...prev.slice(0, 49)])
    })

    socketRef.current.on('event_removed', ({ eventId }) => {
      setLiveEvents(prev => prev.filter(e => e._id !== eventId))
    })

    socketRef.current.on('event_liked', ({ eventId, likes }) => {
      setLiveEvents(prev => prev.map(e => e._id === eventId ? { ...e, likes: Array(likes).fill(null) } : e))
    })

    return () => socketRef.current?.disconnect()
  }, [])

  const joinCity = (cityId) => socketRef.current?.emit('join_city', cityId)
  const leaveCity = (cityId) => socketRef.current?.emit('leave_city', cityId)

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, liveEvents, setLiveEvents, joinCity, leaveCity }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
