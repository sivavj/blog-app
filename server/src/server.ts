import http from "http";
import app from "./app";
import { Server as SocketServer } from "socket.io";
import { initSocket } from "./socket";

const PORT = process.env.PORT || 3000;

// create Http server
const server = http.createServer(app);

// initialize websocker server
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
