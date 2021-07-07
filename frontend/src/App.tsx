import React, { useState, useEffect } from 'react'
import './App.css';

interface snakeInt {
  snake: CellInt[]
  food: CellInt
}

interface AppInt {
  socket: any
}

interface RowInt {
  y: number,
  snake: CellInt[],
  food: CellInt
}

interface CellInt {
  x: number
  y: number
}

interface CellIntWithInfo {
  x: number
  y: number
  snake: CellInt[]
  food: CellInt
}

interface DirectionInt {
  [key: string]: (x: number, y: number) => {
    x: number;
    y: number;
  }
}

type Keycodes = {
  [key: number]: string
}

const screen = 1

const gridArray: number[] = []
const gridSize = 35;

for (let i = 0; i <= gridSize; i++) {
  gridArray.push(i);
}

const Grid = ({snake, food}: snakeInt): JSX.Element => 
<div>
  {gridArray.map(y => 
    <Row
      y={y}
      snake={snake}
      food={food}
      key={y}
    />  
  )}
</div>

const Row = ({y, snake, food}: RowInt) => 
  <div className='grid-row'>
    {gridArray.map(x => 
      <Cell
        x={x}
        y={y}
        snake={snake}
        food={food}
        key={x}
      />
    
    )}
  </div>

const Cell = ({x, y, snake, food}: CellIntWithInfo): JSX.Element => {
  // console.log(snake)
  // return <div></div>
  return <div className={isBorder(x, y) ? 'border cell ' : 'cell ' + (snake.filter(cell => cell.x === x && cell.y === y).length > 0 ? 'snake ' : ' ') + (food.x === x && food.y === y ? 'food ' : ' ')}/>
}
  

const isBorder = (x: number, y: number) => 
      x === 0 || y === 0 || x === gridSize || y === gridSize

const randCoord = (): CellInt => ({
  x: Math.floor((Math.random() * (gridSize - 1)) + 1),
  y: Math.floor((Math.random() * (gridSize - 1)) + 1),
})

const KEY_CODES_MAPPER: Keycodes = {
  38: 'UP',
  39: 'RIGHT',
  37: 'LEFT',
  40: 'DOWN',
};

const direction: DirectionInt = {
  UP: (x: number, y: number) => ({x, y: y - 1}),
  DOWN: (x: number, y: number) => ({x, y: y + 1}),
  LEFT: (x: number, y: number) => ({x: x - 1, y}),
  RIGHT: (x: number, y: number) => ({x: x + 1, y})
}

let currDirection = "DOWN"

const checkCollision = (snake: CellInt[])  => {
  return new Set(snake.map(s => s.x + "|" + s.y)).size < snake.length
}

const App = ({socket}: AppInt): JSX.Element => {
  const [snake, setSnake] = useState<CellInt[]>([{x: 7, y: 16}, {x: 7, y: 15}, {x: 7, y: 14}]);
  const [food, setFood] = useState<CellInt>({x: 10, y: 10})
  const [score, setScore] = useState<number>(0)

  const [host, setHost] = useState<Boolean>(true)

  useEffect(() => {
    const onTick = () => {
      let tempSnake = [...snake]
      tempSnake.pop()

      tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
      if (tempSnake[0].x === food.x && tempSnake[0].y === food.y) {
        setFood(randCoord())
        tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
        setScore(score + 1)
        socket.emit('foodEat', screen)
      } 

      if (tempSnake[0].x === 0 || tempSnake[0].y === 0 || tempSnake[0].y === gridSize || checkCollision(snake)) {
        tempSnake = [{x: 7, y: 16}, {x: 7, y: 15}, {x: 7, y: 14}]
        currDirection = "DOWN"
      }

      if (tempSnake[0].x === gridSize) {
        socket.emit("changeSnake", screen, tempSnake[0].y)
        // console.log(tempSnake)
        tempSnake.shift()
        // console.log(tempSnake)
        
      }


      setSnake(tempSnake)

      

      
      
    };

    const interval = setInterval(onTick, 100);

    return () => clearInterval(interval);
  }, [snake]);

  const onChangeDirection = (event: {keyCode: number}) => {
    if (KEY_CODES_MAPPER[event.keyCode]) {
      if (
        (currDirection === "DOWN" && KEY_CODES_MAPPER[event.keyCode] === "UP") || 
        (currDirection === "UP" && KEY_CODES_MAPPER[event.keyCode] === "DOWN") || 
        (currDirection === "LEFT" && KEY_CODES_MAPPER[event.keyCode] === "RIGHT") ||
        (currDirection === "RIGHT" && KEY_CODES_MAPPER[event.keyCode] === "LEFT")) {
        return
      }
      currDirection = KEY_CODES_MAPPER[event.keyCode]
      // socket.emit("change", KEY_CODES_MAPPER[event.keyCode])
    }
  };

  React.useEffect(() => {
    window.addEventListener('keyup', onChangeDirection, false);

    return () =>
      window.removeEventListener('keyup', onChangeDirection, false);
  }, []);

  return (
    <div className="App">
        <h1 style={{color: "black"}}>YOUR SCORE IS {score}</h1>
        <button onClick={() => setHost(!host)}>You're a {host ? 'host' : 'client'}</button>
        <Grid snake={snake} food={food}/>
    </div>
  );
}




export default App;
