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
const io = socketIO(server)

server.listen(port, () => console.log(`Listening on port ${port}`));