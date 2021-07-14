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

let currDirection
let currentScreen

const checkCollision = (snake)  => {
  return new Set(snake.map(s => s.x + "|" + s.y)).size < snake.length
}

const App = () => {
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState({x: 10, y: 10})
  const [score, setScore] = useState(0)

  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)


  const admin = useContext(RoomContext)
  const socket = useContext(SocketContext)
  const theRoom = useContext(RoomIDContext)

  useEffect(() => {
    if (admin.admin) {
      setSnake([{x: 7, y: 16}, {x: 7, y: 15}, {x: 7, y: 14}])
      currDirection = "DOWN"
      currentScreen = true
    } else {
      currentScreen = false
    }
  }, [currentlyPlaying])


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

        if ((tempSnake[0].x === 0 || tempSnake[0].y === 0 || tempSnake[0].x === gridSize || tempSnake[0].y === gridSize || checkCollision(snake))) {
          if (admin.admin && tempSnake[0].x === gridSize) {
            socket.emit('moveToNonAdmin', tempSnake[0].y, tempSnake.length, theRoom.room)
            currentScreen = false 
          } else if (!admin.admin && tempSnake[0].x === 0) {
            socket.emit('moveToAdmin', tempSnake[0].y, tempSnake.length, theRoom.room) 
            currentScreen = false
          } else if (admin.admin && currentScreen) {
            setSnake([{x: 7, y: 16}, {x: 7, y: 15}, {x: 7, y: 14}])
            currDirection = "DOWN"
          }
        }
      } else {
        setSnake([])
      }
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

    socket.on('addToNonAdmin', (y, length) => {
      currDirection = 'RIGHT'
      currentScreen = true
      const tempSnake = []

      for (let i = 0; i < length; i++) {
        tempSnake.push({x: (1 - i), y})
      }

      setSnake(tempSnake)
    })
  
    socket.on('addToAdmin', (y, length) => {
      currDirection = 'LEFT'
      currentScreen = true
      const tempSnake = []
      
      for (let i = 0; i < length; i++) {
        tempSnake.push({x: (gridSize + i), y})
      }
    
      setSnake(tempSnake)
    })


    return () =>
      window.removeEventListener('keyup', onChangeDirection, false);
  }, []);

  return (
    <div className="App">
      {currentlyPlaying ? (
        <div><Grid snake={snake} food={food} gridArray={gridArray} /><h1>YOUR SCORE IS {score}</h1></div>)
        :    
        <JoinRoom startGame={setCurrentlyPlaying}></JoinRoom>
    }   
    </div>
  );
}


export default App;
