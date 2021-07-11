import React, { useState, useEffect, useContext } from 'react'
import './App.css';

import Grid from './Grid/Grid'
import JoinRoom from './JoinRoom/JoinRoom'

import { SocketContext } from './socketContext'
import { RoomContext } from './RoomContext'
import { RoomIDContext } from './RoomIDContext'

const gridArray = []
const gridSize = 35;

for (let i = 0; i <= gridSize; i++) {
  gridArray.push(i);
}

const randCoord = () => ({
  x: Math.floor((Math.random() * (gridSize - 1)) + 1),
  y: Math.floor((Math.random() * (gridSize - 1)) + 1),
})

const KEY_CODES_MAPPER = {
  38: 'UP',
  39: 'RIGHT',
  37: 'LEFT',
  40: 'DOWN',
};

const direction = {
  UP: (x, y) => ({x, y: y - 1}),
  DOWN: (x, y) => ({x, y: y + 1}),
  LEFT: (x, y) => ({x: x - 1, y}),
  RIGHT: (x, y) => ({x: x + 1, y})
}

let currDirection = "DOWN"

const checkCollision = (snake)  => {
  return new Set(snake.map(s => s.x + "|" + s.y)).size < snake.length
}

const App = () => {
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState({x: 10, y: 10})
  const [score, setScore] = useState(0)


  const admin = useContext(RoomContext)
  const socket = useContext(SocketContext)
  const theRoom = useContext(RoomIDContext)


  useEffect(() => {
    const onTick = () => {
      const tempSnake = [...snake]
      

      if(tempSnake.length !== 0) {
        tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
        tempSnake.pop()
        if (tempSnake[0].x === food.x && tempSnake[0].y === food.y) {
          setFood(randCoord())
          tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
          setScore(score + 1)
        } 
  
        setSnake(tempSnake)

        if (tempSnake[0].x === 0 || tempSnake[0].y === 0 || tempSnake[0].x === gridSize || tempSnake[0].y === gridSize || checkCollision(snake)) {
          if (admin.admin && tempSnake[0].x === gridSize) {
            // socket.emit('moveToNonAdmin', tempSnake[0].y, theRoom.room, () => {
            //   tempSnake.shift()
            // })
            socket.emit('moveToNonAdmin', tempSnake[0].y, tempSnake.length, theRoom.room) 
  
          } else if (!admin.admin && tempSnake[0].x === 0) {
            socket.emit('moveToAdmin', tempSnake[0].y, tempSnake.length, theRoom.room) 
  
          } else {
            setSnake([{x: 7, y: 16}, {x: 7, y: 15}, {x: 7, y: 14}])
            currDirection = "DOWN"
          }
        }
      }

      // }
      

      
    };

    const interval = setInterval(onTick, 100);

    return () => clearInterval(interval);
  }, [snake]);

  
  const onChangeDirection = (event) => {
    if (KEY_CODES_MAPPER[event.keyCode]) {
      if (
        (currDirection === "DOWN" && KEY_CODES_MAPPER[event.keyCode] === "UP") || 
        (currDirection === "UP" && KEY_CODES_MAPPER[event.keyCode] === "DOWN") || 
        (currDirection === "LEFT" && KEY_CODES_MAPPER[event.keyCode] === "RIGHT") ||
        (currDirection === "RIGHT" && KEY_CODES_MAPPER[event.keyCode] === "LEFT")) {
        return
      }
      currDirection = KEY_CODES_MAPPER[event.keyCode]
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', onChangeDirection, false);

    setSnake([{x: 10, y: 16}, {x: 10, y: 15}])


    
    socket.on('addToNonAdmin', (y, length) => {
      currDirection = 'RIGHT'
      const tempSnake = []
      // if (tempSnake[0]?.x === 1 && tempSnake[0]?.y === y) {
      //   tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
      // }

      // if (tempSnake[])

      // tempSnake.unshift({x: 1, y})
      // tempSnake.push*

      for (let i = 0; i < length; i++) {
        tempSnake.push({x: (1 - i), y})
      }

      setSnake(tempSnake)
    })
  
    socket.on('addToAdmin', (y, length) => {
      currDirection = 'LEFT'

      const tempSnake = []
      
      // if (tempSnake[0] && tempSnake[0].x === (gridSize - 1)) {
      //   tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
      // } else {

      for (let i = 0; i < length; i++) {
        tempSnake.push({x: (gridSize + i), y})
      }
      

      
      // setTimeout(function(){ tempSnake.unshift({x: (gridSize - 1), y}) }, 900);
      // tempSnake.push({x: (gridSize), y})
      // }

      // NOTES
      // I think the best way to do this is to only send the socket when the head collides

      setSnake(tempSnake)
    })

    



    return () =>
      window.removeEventListener('keyup', onChangeDirection, false);
  }, []);

  return (
    <div className="App">
        <JoinRoom></JoinRoom>
        <h1>YOUR SCORE IS {score}</h1>
        {snake?.length && <Grid snake={snake} food={food} gridArray={gridArray} />}
    </div>
  );
}




export default App;
