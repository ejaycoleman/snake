import React, { useState, useEffect } from 'react'
import './App.css';

interface snakeInt {
  snake: CellInt[]
}

interface RowInt {
  y: number,
  snake: CellInt[]
}

interface CellInt {
  x: number
  y: number
}

interface CellIntWithInfo {
  x: number
  y: number
  snake: CellInt[]
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

const Grid = ({snake}: snakeInt): JSX.Element => 
<div>
  {gridArray.map(y => 
    <Row
      y={y}
      snake={snake}
      key={y}
    />  
  )}
</div>

const Row = ({y, snake}: RowInt) => 
  <div className='grid-row'>
    {gridArray.map(x => 
      <Cell
        x={x}
        y={y}
        snake={snake}
        key={x}
      />
    
    )}
  </div>

const Cell = ({x, y, snake}: CellIntWithInfo): JSX.Element => 
  <div className={isBorder(x, y) ? 'border cell ' : 'cell ' + (snake.filter(cell => cell.x === x && cell.y === y).length > 0 ? 'snake' : '')}/>

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
  const [snake, setSnake] = useState<CellInt[]>([{x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}]);

  // useEffect(() => 
  //   setSnake(randCoord)
  // , [])

  useEffect(() => {
    const onTick = () => {
      const tempSnake = [...snake]
      tempSnake.pop()
      tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
      setSnake(tempSnake)
    };

    const interval = setInterval(onTick, 400);

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
        <Grid snake={snake} />
    </div>
  );
}




export default App;
