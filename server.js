import express, { urlencoded } from "express";
import { dirname } from "path";
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
let playerTurn = true;
let players = [];

let gridObj = {
  10: "",
  11: "",
  12: "",
  20: "",
  21: "",
  22: "",
  "00": "",
  "01": "",
  "02": "",
};

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

app.get("/resetPlayerTurn", (res, req) => {
  playerTurn = true;
});

app.get("/playerTurn", (req, res) => {
  res.send(playerTurn);
  playerTurn = !playerTurn;
});

app.post("/reset", (req, res) => {
  p1 = p2 = tie = 0;
  res.redirect("/");
});
app.get("/grid", (req, res) => {
  let json = JSON.stringify(gridObj);

  res.send(json);
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
  console.log(wss.clients);
  playerNumber++;
  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
  /*
  ws.on("message", (data) => {
    try {
      let message = JSON.parse(data);
      gridObj = message;
      //console.log(gridObj);
      ws.emit(data);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  });*/
  ws.on("close", () => {
    console.log("Connection closed");
    playerNumber--;
    console.log(playerNumber);
  });
});

wss.on("message", (ws, req) => {
  ws.on("error", onSocketPostError);
});

class Game {

  playerIds = {
    p1: "",
    p2: "",
  }

  turn = true

  score = {
    p1: 0,
    p2: 0,
    tie: 0,
  };

  gameobj

  constructor(p1Id, p2Id) {
    this.playerIds.p1 = p1Id
    this.playerIds.p2 = p2Id
  }

  getP1Id(){
    return this.playerIds.p1
  }

  getP2Id(){
    return this.playerIds.p2
  }

  resetScore() {
    this.score = {
      p1: 0,
      p2: 0,
      tie: 0,
    };
  }

  addP1() {
    this.score.p1++
  }
  addP2(){
    this.score.p2++
  }
  addTie(){
    this.score.tie++
  }

  setGameState(newgameobj){
    this.gameobj = newgameobj
  }

  getGameState(){
    return this.gameobj
  }

  resetGameState(){
    this.gameobj = {
      10: "",
      11: "",
      12: "",
      20: "",
      21: "",
      22: "",
      "00": "",
      "01": "",
      "02": "",
    };
  }

  changeTurn(){
    this.turn = !this.turn
  }

  getTurn(){
    return this.turn
  }
}
