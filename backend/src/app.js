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

module.exports = app;
