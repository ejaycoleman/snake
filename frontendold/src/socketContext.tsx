import React, {useEffect} from 'react'
import io, {Socket} from "socket.io-client";
import DefaultEventsMap from 'socket.io-client'

const SocketContext = React.createContext()

interface Props {
    // any other props that come into the component, you don't have to explicitly define children.
}

const SocketProvider: React.FC<Props> = ({ children }) => {
    const ENDPOINT = "http://localhost:4000";
    // const socket = socketIOClient(ENDPOINT);

    // useEffect(() => {
    const socket = io(ENDPOINT, { transports: ['websocket', 'polling'] })
    // }, [])

    
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext, SocketProvider }