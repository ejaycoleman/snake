import React, { useState, useEffect } from 'react'
import './App.css';

interface snakeInt {
  snake: CellInt[]
  food: CellInt
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

const Cell = ({x, y, snake, food}: CellIntWithInfo): JSX.Element => 
  <div className={isBorder(x, y) ? 'border cell ' : 'cell ' + (snake.filter(cell => cell.x === x && cell.y === y).length > 0 ? 'snake ' : ' ') + (food.x === x && food.y === y ? 'food ' : ' ')}/>

const isBorder = (x: number, y: number) => 
      x === 0 || y === 0 || x === gridSize || y === gridSize

const randCoord = (): CellInt => ({
  x: Math.floor(Math.random() * (gridSize) + 1),
  y: Math.floor(Math.random() * (gridSize) + 1),
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

const App = (): JSX.Element => {
  const [snake, setSnake] = useState<CellInt[]>([]);
  const [food, setFood] = useState<CellInt>({x: 10, y: 10})

  useEffect(() => {
    const tempSnake = [randCoord()]
    tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
    tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
    setSnake(tempSnake)
  }
  , [])

  useEffect(() => {
    const onTick = () => {
      const tempSnake = [...snake]
      tempSnake.pop()
      tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
      if (tempSnake[0].x === food.x && tempSnake[0].y === food.y) {
        setFood(randCoord())
        tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
      } 
      setSnake(tempSnake)
    };

    const interval = setInterval(onTick, 100);

    return () => clearInterval(interval);
  }, [snake]);

  const onChangeDirection = (event: {keyCode: number}) => {
    if (KEY_CODES_MAPPER[event.keyCode]) {
      currDirection = KEY_CODES_MAPPER[event.keyCode]
    }
  };

  React.useEffect(() => {
    window.addEventListener('keyup', onChangeDirection, false);

    return () =>
      window.removeEventListener('keyup', onChangeDirection, false);
  }, []);

  return (
    <div className="App">
        <Grid snake={snake} food={food}/>
    </div>
  );
}




export default App;
