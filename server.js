import express, { urlencoded } from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import Game from "./public/Game.js";

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
let lobby = [];
let queue = [];

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

function matchMaker(player) {
  if (queue.length === 0) {
    //if there are no players waiting

    /* //if there are games in the lobby
      for (let i = 0; i < lobby.length; i++) {
        //try to find a Game that contains 1 player
        const element = lobby[i];
        if (element.getLobbySize() === 1) {
          element.joinMatch(player);
          return;
        }
      }*/

    //if there are no games in the lobby create a new one and make the player join it
    queue.push(player);
  } else {
    const game = new Game(player); //if the queue isnt empty make a new game with the joining player and let the player waiting in queue join the game
    game.joinMatch(queue[0]);
    lobby.push(game);
    queue.pop(); //remove said player from queue
  }
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
  ws.id = uuidv4();
  ws.on("error", onSocketPostError);
  console.log("Client connected");
  playerNumber = wss.clients.size;
  players.push(ws.id);
  console.log("players: " + players);
  //console.log(ws);
  //console.log(wss.clients);
  matchMaker(ws.id);
  console.log(lobby);
  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      /*
      if (client.readyState === WebSocket.OPEN) {
        if (players.includes(ws.id)) {
          client.send(data, { binary: isBinary });
        }
      }
      */
    });
  });

  ws.on("message", (data) => {
    try {
      let message = JSON.parse(data);
      gridObj = message;
      //console.log(gridObj);
      ws.emit(data);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  });

  ws.on("close", () => {
    let opposite;
    
    for (let i = 0; i < lobby.length; i++) {
      const element = lobby[i];
      opposite = element.getOppositeId(ws.id);
    }

    console.log(ws.id);
    console.log(opposite);
    console.log(players);
    wss.clients.forEach((client) => {
      if (client.id == opposite) {
        client.close();
      }
    });
    players = players.filter((element) => {
      return element != opposite
    });
    players = players.filter((elm)=>{
      return elm != ws.id
    })
    lobby = lobby.filter((element) => {
      return element.getOppositeId() === opposite;
    });
    console.log(players);
    console.log("Connection closed");
  });
});

wss.on("message", (ws, req) => {
  ws.on("error", onSocketPostError);
});
/*
function test() {
  console.log(lobby);
  const pid1 = 123;
  const pid2 = 121;
  matchMaker(pid1);
  matchMaker(pid2);
  console.log("queue: " + queue);
  matchMaker(332);
  console.log("queue: " + queue);

  matchMaker(323);
  console.log(lobby);
}
test();*/
