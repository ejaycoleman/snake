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

// let interval;

let rooms = 0

io.on("connection", (socket) => {
  console.log("New client connected");
  // if (interval) {
  //   clearInterval(interval);
  // }
  // interval = setInterval(() => getApiAndEmit(socket), 1000);



  
  socket.emit('newRoom', ++rooms)
  socket.join(rooms);


  socket.on('joinRoom', (room, callback) => {
    socket.join(room);
    callback({
      room
    });
  })



  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // clearInterval(interval);
  });
});

// const getApiAndEmit = socket => {
//   socket.emit("FromAPI", "MSG");
// };

server.listen(port, () => console.log(`Listening on port ${port}`));