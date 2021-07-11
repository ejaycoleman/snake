import React from 'react'

const isBorder = (x, y, gridSize) => 
  x === 0 || y === 0 || x === (gridSize - 1) || y === (gridSize - 1)

const Grid = ({snake, food, gridArray}) => <div>
  {gridArray.map(y => 
    <Row
      y={y}
      snake={snake}
      food={food}
      key={y}
      gridArray={gridArray}
    />  
  )}
</div>

const Row = ({y, snake, food, gridArray}) => 
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

const Cell = ({x, y, snake, food, gridSize}) => 
  <div className={
      isBorder(x, y, gridSize) ? 'border cell ' : 'cell ' + 
      (snake.filter(cell => cell.x === x && cell.y === y).length > 0 ? 'snake ' : ' ') + 
      (food.x === x && food.y === y ? 'food ' : ' ')}/>

export default Grid