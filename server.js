/*

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ /*});



app.get("", function (req, res) {
  res.sendFile(__dirname,"/", "mark.html");
});




io.on("hello", (socket) => {
  socket.emit("BOIIIII!!!")
  socket.on("howdy", (arg)=>{
    console.log(arg);
  })
});

httpServer.listen(5000, ()=>{
  console.log("listning to Port: 5000");
});

*/

import express, { urlencoded } from "express";
import { dirname } from "path";
import { Socket } from "socket.io-client";
import { fileURLToPath } from "url";
import { WebSocket, WebSocketServer } from "ws";

let app = express();

let __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);

const PORT = 5000;
let playerNumber = 0;
let p1 = 0;
let p2 = 0;
let tie = 0;

function onSocketPreError(e) {
  console.log(e);
}

function onSocketPostError(e) {
  console.log(e);
}

app.use(express.json());
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "\\public\\index.html");
});

app.post("/reset", (req, res) => {
  p1 = p2 = tie = 0;
  res.redirect("/");
});

app.get("/score", (req, res) => {
  res.send({ p1: p1, p2: p2, tie: tie });
});
app.get("/addp1", (req, res) => {
  p1++;
  res.send({ p1: p1, p2: p2, tie: tie });
});
app.get("/addp2", (req, res) => {
  p2++;
  res.send({ p1: p1, p2: p2, tie: tie });
});
app.get("/addtie", (req, res) => {
  tie++;
  res.send({ p1: p1, p2: p2, tie: tie });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);
  //auth

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws, req) => {
  ws.on("error", onSocketPostError);
  console.log("Client connected");
  playerNumber++;
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      console.log(message);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  });
  ws.on("close", () => {
    console.log("Connection closed");
    playerNumber--;
    console.log(playerNumber);
  });
});

wss.on("message", (ws, req) => {
  ws.on("error", onSocketPostError);
});
