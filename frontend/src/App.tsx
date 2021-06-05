import React, { useState, useEffect } from 'react'
import './App.css';

interface snakeInt {
  snake: CellInt
}

interface RowInt {
  y: number,
  snake: CellInt
}

interface CellInt {
  x: number
  y: number
}

interface CellIntWithInfo {
  x: number
  y: number
  snake: CellInt
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
  <div className={isBorder(x, y) ? 'border cell ' : 'cell ' + (JSON.stringify(snake) === JSON.stringify({x, y}) ? 'snake' : '')}/>

const isBorder = (x: number, y: number) => 
      x === 0 || y === 0 || x === gridSize || y === gridSize

const randCoord = (): CellInt => ({
  x: Math.floor(Math.random() * (gridSize) + 1),
  y: Math.floor(Math.random() * (gridSize) + 1),
})

const direction = {
  UP: (x: number, y: number) => ({x, y: y - 1}),
  DOWN: (x: number, y: number) => ({x, y: y + 1}),
  LEFT: (x: number, y: number) => ({x: x - 1, y}),
  RIGHT: (x: number, y: number) => ({x: x + 1, y})
}

const currDirection = "UP"

const App = (): JSX.Element => {
  const [snake, setSnake] = useState<CellInt>({x: 0, y: 0});

  useEffect(() => 
    setSnake(randCoord)
  , [])

  useEffect(() => {
    const onTick = () => {
      setSnake(direction[currDirection](snake.x, snake.y))
    };

    const interval = setInterval(onTick, 400);

    return () => clearInterval(interval);
  }, [snake]);

  return (
    <div className="App">
        <Grid snake={snake} />
    </div>
  );
}




export default App;
