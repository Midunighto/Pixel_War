const express = require("express");

const app = express();

app.use(express.static("public"));

/* ************************************************************************* */

const cors = require("cors");

app.use(cors());
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
const { allow } = require("joi");
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
const users = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("setUsername", (username) => {
    users[socket.id] = username;
    io.emit("userConnected", { username });
  });

  socket.on("add-pixel", (newPixel) => {
    console.log("Received new pixel:", newPixel);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    const username = users[socket.id];
    if (username) {
      delete users[socket.id];
      io.emit("userDisconnected", { username });
    }
  });
});

server.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
module.exports = app;
