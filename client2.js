
const io = require("socket.io-client");

let socket = io.connect("http://localhost:3000")

socket.on("hello", (data) => {
    console.log("Message: ", data);
 });