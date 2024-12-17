
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
  
    constructor(p1Id) {
      this.playerIds.p1 = p1Id;
    }
  
    toJson(){
        return {
            gameobj: this.gameobj,
            score: this.score,
            turn: this.turn,
            playerIds: this.playerIds,
        }
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
  
    getOppositeId(pId){
        if(pId === this.playerIds.p1){
            return this.playerIds.p2
        }else if(pId === this.playerIds.p2){
            return this.playerIds.p1
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
  
    changeTurn() {
      this.turn = !this.turn;
    }
  
    getTurn() {
      return this.turn;
    }
  }