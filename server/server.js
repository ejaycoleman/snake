const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const router = express.Router();

const port = process.env.PORT || 4000

const route = router.get("/", (req, res) => {
    res.send({ response: "ALIVE" }).status(200);
});
  
const app = express();
app.use(route)
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
      origin: '*',
    }
});

let interval;

// let directionIndicator = 'DOWN'

let snakeOnLeft = 0
let snakeOnRight = 0

// const direction = {
//   UP: (x, y) => ({x, y: y - 1}),
//   DOWN: (x, y) => ({x, y: y + 1}),
//   LEFT: (x, y) => ({x: x - 1, y}),
//   RIGHT: (x, y) => ({x: x + 1, y})
// }

io.on("connection", (socket) => {
  snakeOnLeft = 1


  console.log("New client connected");
  // if (interval) {
  //   clearInterval(interval);
  // }
  // let snake = [{x: 1, y: 1}]
  // interval = setInterval(() => {
  //       // snake = [{x: snake[0].x + 1, y: snake[0].y}]
  //       // snake = [direction[directionIndicator](snake[0].x, snake[0].y)]

      
  //       // socket.emit("moveSnake", snake);
  //   }, 1000);

  socket.on('foodEat', screen => {
    if (screen === 1) {snakeOnLeft++} else if (screen === 2) {snakeOnRight++}
  })

  socket.on("changeSnake", (screen, y) => {
    if (screen === 0) {
      snakeOnLeft--
      snakeOnRight++

      socket.emit('addNewSnake', {screen, y})
    } else if (screen === 2) {
      snakeOnLeft++
      snakeOnRight--
    }
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));