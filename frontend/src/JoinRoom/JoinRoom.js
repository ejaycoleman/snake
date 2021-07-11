import React, {useState, useContext, useEffect} from 'react'

import { SocketContext } from '../socketContext'

import { RoomContext } from '../RoomContext'
import { RoomIDContext } from '../RoomIDContext'

const JoinRoom = () => {
    const [room, setRoom] = useState(0)

    const [joinRoom, setJoinRoom] = useState(0)

    const [waiting, setWaiting] = useState(true)

    const socket = useContext(SocketContext)

    const admin = useContext(RoomContext)
    const theRoom = useContext(RoomIDContext)

    useEffect(() => {
        socket.on("newRoom", data => {
            setRoom(data)
            theRoom.setRoom(data)

            admin.setAdmin(true)

        });

        socket.on('userJoined', data => {
            setWaiting(false)
        })
    }, [])


    const joinNewRoom = () => {
        socket.emit('joinRoom', joinRoom, (response) => {
            setRoom(response.room)
            theRoom.setRoom(response.room)
            admin.setAdmin(false)
        })
        
    }

    return (
        <div>
            <h1>Welcome!</h1>
            <h2>You are currently hosting a game in room: {room}</h2>
            {waiting && <h3>Waiting for second player</h3>}
            Join another room?

            <input type="number" name="roomID" value={joinRoom} onChange={e => setJoinRoom(parseInt(e.target.value))} />
            <button onClick={joinNewRoom}>Join</button>
        </div>
    )
}



export default JoinRoom