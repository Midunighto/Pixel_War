const express = require("express");

const app = express();

app.use(express.static("public"));

/* ************************************************************************* */

const cors = require("cors");

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

/* ************************************************************************* */

app.use(express.json());

/* ************************************************************************* */
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const router = require("./router");

app.use("/api", router);

/* ************************************************************************* */
const port = process.env.SOCKET_PORT;
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/* gérer la connexion */
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("client-message", (data) => {
    console.log(data);
    io.emit("server-message", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
server.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});

module.exports = app;
