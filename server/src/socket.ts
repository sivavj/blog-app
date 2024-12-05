import { Server } from "socket.io";

export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
  });
  io.on("disconnect", (socket) => {
    console.log("A user disconnected", socket.id);
  });
};
