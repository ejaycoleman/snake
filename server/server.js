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

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  let snake = [{x: 1, y: 1}]
  interval = setInterval(() => {
        snake = [{x: snake[0].x + 1, y: snake[0].y}]
        socket.emit("moveSnake", snake);
    }, 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));