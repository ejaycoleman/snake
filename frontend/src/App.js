// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react'
import './App.css';

import Grid from './Grid/Grid'




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
  const [snake, setSnake] = useState([{x: 7, y: 16}, {x: 7, y: 15}, {x: 7, y: 14}]);
  const [food, setFood] = useState({x: 10, y: 10})
  const [score, setScore] = useState(0)

  useEffect(() => {
    const onTick = () => {
      const tempSnake = [...snake]
      tempSnake.pop()
      tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
      if (tempSnake[0].x === food.x && tempSnake[0].y === food.y) {
        setFood(randCoord())
        tempSnake.unshift(direction[currDirection](tempSnake[0].x, tempSnake[0].y))
        setScore(score + 1)
      } 

      setSnake(tempSnake)

      if (tempSnake[0].x === 0 || tempSnake[0].y === 0 || tempSnake[0].x === gridSize || tempSnake[0].y === gridSize || checkCollision(snake)) {
        setSnake([{x: 7, y: 16}, {x: 7, y: 15}, {x: 7, y: 14}])
        currDirection = "DOWN"
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

    return () =>
      window.removeEventListener('keyup', onChangeDirection, false);
  }, []);

  return (
    <div className="App">
        <h1 style={{color: "black"}}>YOUR SCORE IS {score}</h1>
        <Grid snake={snake} food={food} gridArray={gridArray} />
    </div>
  );
}




export default App;
