import React from 'react'

// export const admin = true


// export const adminState = {admin, setAdmin}
export const RoomContext = React.createContext();


export const RoomProvider = ({ children }) => {
    const [admin, setAdmin] = React.useState(true)

    return (
      <RoomContext.Provider value={{admin,setAdmin}}>
        {children}
      </RoomContext.Provider>
    );
  };