import React, {useEffect} from 'react'
import io, {Socket} from "socket.io-client";
import DefaultEventsMap from 'socket.io-client'

const SocketContext = React.createContext()

const SocketProvider = ({ children }) => {
    const ENDPOINT = "http://localhost:4000";
    let socket = null;

    useEffect(() => {
        socket = io(ENDPOINT, { transports: ['websocket', 'polling'] })
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext, SocketProvider }