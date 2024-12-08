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

import express from "express"
import {dirname} from "path"
import { fileURLToPath } from "url";



const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express();
const PORT = 3000;

app.use("/", express.static('public'))


// OR use res.sendFile for a specific file

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "\\public\\index.html");
});






/*

const { Server } = require("socket.io");


const io = new Server({});
let count2 = 0
io.on("connection", (socket) => {
  socket.emit("hello", 1, "2", { 3: "4", 5: Buffer.from([6]) });
});

io.listen(3000);

*/ 

