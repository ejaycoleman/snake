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

let rooms = 0

io.on("connection", (socket) => {
  socket.emit('newRoom', ++rooms)
  socket.join(rooms);


  socket.on('joinRoom', (room, callback) => {
    socket.join(room);
    callback({
      room
    });
  })




  socket.on('moveToNonAdmin', (y, socketsRoom, removeTheSnake) => {
    removeTheSnake()
    socket.to(socketsRoom).emit('addToNonAdmin', y)

    console.log('move')
  })

  socket.on('moveToAdmin', (y, socketsRoom, removeTheSnake) => {
    removeTheSnake()
    socket.to(socketsRoom).emit('addToAdmin', y)

    console.log('move2')
  })


  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));