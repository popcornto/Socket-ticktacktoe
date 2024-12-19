export default class Game {
  playerIds = {
    p1: "",
    p2: "",
  };

  turn = true;

  score = {
    p1: 0,
    p2: 0,
    tie: 0,
  };

  gameobj = {
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
  // p = "";



  // getPlayer(id) {
  //   if (id === this.playerIds.p1) {
  //     p = "p1";
  //   } else if(id === this.playerIds.p2) {
  //     p = "p2";
  //   }
  // }

  playersStates = {
    p1: "start",
    p2: "stop"
  }

  switchStates(){
    if(this.playersStates.p1 === "start"){
      this.playersStates.p1 = "stop"
      this.playersStates.p2 = "start"
    }else {
      this.playersStates.p1 = "start"
      this.playersStates.p2 = "stop"
    }
  }

  constructor(p1Id) {
    this.playerIds.p1 = p1Id;
  }

  toJson() {
    return JSON.stringify({
      gameobj: this.gameobj,
      score: this.score,
      playerIds: this.playerIds,
      turn: this.turn,
    });
  }

  getLobbySize() {
    return Object.keys(this.playerIds).length;
  }

  getP1Id() {
    return this.playerIds.p1;
  }

  getP2Id() {
    return this.playerIds.p2;
  }

  getOppositeId(pId) {
    if (pId === this.playerIds.p1) {
      return this.playerIds.p2;
    } else if (pId === this.playerIds.p2) {
      return this.playerIds.p1;
    }
  }

  resetScore() {
    this.score = {
      p1: 0,
      p2: 0,
      tie: 0,
    };
  }

  joinMatch(p2Id) {
    this.playerIds.p2 = p2Id;
  }

  addP1() {
    this.score.p1++;
  }
  addP2() {
    this.score.p2++;
  }
  addTie() {
    this.score.tie++;
  }

  setGameState(newgameobj) {
    this.gameobj = newgameobj;
  }

  getGameState() {
    return this.gameobj;
  }

  resetGameState() {
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
  setScore(score) {
    this.score = score;
  }
  setTurn(turn) {
    this.turn = turn;
  }
  changeTurn() {
    this.turn = !this.turn;
  }

  getTurn() {
    return this.turn;
  }
}
