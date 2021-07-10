import React, {useState, useContext, useEffect} from 'react'

import { SocketContext } from '../socketContext'

const JoinRoom = () => {
    const [room, setRoom] = useState(0)

    const [joinRoom, setJoinRoom] = useState(0)

    const socket = useContext(SocketContext)
    useEffect(() => {
        socket.on("newRoom", data => {
            setRoom(data)
        });
    }, [])


    const joinNewRoom = () => {
        socket.emit('joinRoom', joinRoom, (response) => {
            setRoom(response.room)
        })
        
    }

    return (
        <div>
            <h1>You are in room: {room}</h1>
            <h3>Join another room?</h3>

            <input type="number" name="roomID" value={joinRoom} onChange={e => setJoinRoom(parseInt(e.target.value))} />
            <button onClick={joinNewRoom}>Join</button>
        </div>
    )
}



export default JoinRoom