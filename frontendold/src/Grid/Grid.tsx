import React, {useContext, useEffect} from 'react'

import { SocketContext } from '../socketContext'


interface snakeInt {
  snake: CellInt[]
  food: CellInt
  gridArray: number[]
}

interface RowInt {
  y: number,
  snake: CellInt[],
  food: CellInt,
  gridArray: number[]
}

export interface CellInt {
    x: number
    y: number
}
  
interface CellIntWithInfo {
x: number
y: number
snake: CellInt[]
food: CellInt
gridSize: number
}


const isBorder = (x: number, y: number, gridSize: number) => 
  x === 0 || y === 0 || x === (gridSize - 1) || y === (gridSize - 1)

const Grid = ({snake, food, gridArray}: snakeInt): JSX.Element => 
{
    const socket = useContext(SocketContext)
    useEffect(() => {
        socket.on("FromAPI", data => {
          console.log(data);
        });
    }, [])


    return (<div>
  {gridArray.map(y => 
    <Row
      y={y}
      snake={snake}
      food={food}
      key={y}
      gridArray={gridArray}
    />  
  )}
</div>)}

const Row = ({y, snake, food, gridArray}: RowInt) => 
  <div className='grid-row'>
    {gridArray.map(x => 
      <Cell
        x={x}
        y={y}
        snake={snake}
        food={food}
        key={x}
        gridSize={gridArray.length}
      />
    
    )}
  </div>

const Cell = ({x, y, snake, food, gridSize}: CellIntWithInfo): JSX.Element => 
  <div className={
      isBorder(x, y, gridSize) ? 'border cell ' : 'cell ' + 
      (snake.filter(cell => cell.x === x && cell.y === y).length > 0 ? 'snake ' : ' ') + 
      (food.x === x && food.y === y ? 'food ' : ' ')}/>

export default Grid