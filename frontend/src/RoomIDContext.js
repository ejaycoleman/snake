import React from 'react'

export const RoomIDContext = React.createContext();

export const RoomIDProvider = ({ children }) => {
    const [room, setRoom] = React.useState(0)

    return (
        <RoomIDContext.Provider value={{room, setRoom}}>
            {children}
        </RoomIDContext.Provider>
    );
};