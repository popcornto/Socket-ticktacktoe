let ws = WebSocket;
let maxTurns = 9;
let playerTurn; // false for player 1 / true for player 2
let matchPoint = false;
let match = -1;
let isWaiting = true;
let game;
let score;
let Status;
ws = new WebSocket("ws://localhost:5000");
const newgrid = {
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

const turnIndicator = document.getElementById("turn-indicator");
const tickables = document.querySelectorAll(".tickable");
const reset = document.getElementById("reset");
const p1Score = document.getElementById("p1");
const p2Score = document.getElementById("p2");
const tieScore = document.getElementById("tie");

const box00 = document.getElementById("00");
const box10 = document.getElementById("10");
const box20 = document.getElementById("20");
const box01 = document.getElementById("01");
const box11 = document.getElementById("11");
const box21 = document.getElementById("21");
const box02 = document.getElementById("02");
const box12 = document.getElementById("12");
const box22 = document.getElementById("22");

/*
fetch("http://localhost:5000/grid")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    gridobj = data;
    //console.log(JSON.stringify(data));
  });*/
/*
fetch("http://localhost:5000/score")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    updateScore(data.p1, data.p2, data.tie);
  })
  .catch((error) => console.error("Fetch error:", error));
*/

document.getElementById("wait").classList.add("wait-for-join");
function ToggleWaitingScreen() {
  const wait = document.getElementById("wait");

  wait.classList.remove("wait-for-join");
  while (wait.firstChild) {
    wait.removeChild(wait.firstChild);
  }
}
ws.addEventListener("message", (data) => {
  EnablePlayerMoves();
  console.log(ws);
  isWaiting = false;
  let fetchedGame = JSON.parse(data.data);
  game = fetchedGame;
  console.log(fetchedGame);
  //console.log(game);
  // console.log(game);
  // console.log(game.gameobj);
  hasReset();
  let grid = game.gameobj;
  playerTurn = game.turn;
  score = game.score;
  // console.log("gameobj: " + grid);
  // console.log("playerTurn: " + game.turn);
  // console.log("score: " + score);
  updateScoreV2(score);
  displayMap(grid);
  match = checkWin();
  if (match > -1) {
    displayReset(score);
  } else {
    if (isWaiting === false) {
      ToggleWaitingScreen();
    } else {
      console.log(match);
      if (match === -1) {
        EnablePlayerMoves();
      } else {
        disableAllButtons();
        displayReset(score);
      }
    }
  }
});

tickables.forEach(function (tickable) {
  tickable.addEventListener("click", function handleClick() {
    if (!tickable.classList.contains("clicked")) {
      // var audio = new Audio("shar.mp3");
      // audio.play();
      /*
      await fetch("http://localhost:5000/playerTurn")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          playerTurn = data;
        })
        .catch((error) => console.error("Fetch error:", error));
        */

      playerTurn = !playerTurn;
      turnIndicator.textContent = playerTurn ? "Player 2" : "Player 1";
      tickable.innerText = playerTurn ? "O" : "X";
      tickable.classList.add("clicked");

      match = checkWin();
      if (match != -1) {
        disableAllButtons();
        displayReset(score);
      }

      let map = mapPlayerMoves();
      game.gameobj = map;
      updateGameTurn(playerTurn);
      ws.send(JSON.stringify(game));
      disableAllButtons();
    }
  });
});

/*
let newGrid = data.data;
console.log(JSON.parse(newGrid.gameobj)); //parsing a string to an obj

match = checkWin();
fetch("http://localhost:5000/score")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    updateScore(data.p1, data.p2, data.tie);
  })
  .catch((error) => console.error("Fetch error:", error));
displayReset();
*/

function resetScore() {
  const newScore = {
    p1: 0,
    p2: 0,
    tie: 0,
  };
  updateGameScore(newScore);
  updateScoreV2(newScore);
  console.log(game.score);
  ws.send(JSON.stringify(game));
}

function WaitTurn() {
  Status = "Enable";
  disableAllButtons();
}

function hasReset() {
  if (game.reset) {
    reload();
  }
}

function reload() {
  updateGameGrid(newgrid);
  clearGrid();
  EnablePlayerMoves(); //this is the key to my problems
  reverseCheckWin();
  removeReset();
  match = checkWin();
  reset.style.visibility = "invisible";
  reset.style.opacity = 0;
  reset.style.cursor = "default";
  reset.onclick = "";
}
function removeReset() {
  reset.style.visibility = "invisible";
  reset.style.opacity = 0;
  reset.onclick = "";
  reset.style.cursor = "default";
  game.isPlayer1 = true;
  delete game.reset;
}
function addreset() {
  game = { ...game, reset: true };
}
function reloadPage() {
  playerTurn = true
  updateGameGrid(newgrid);
  clearGrid();
  EnablePlayerMoves();
  addreset(game);
  reverseCheckWin();
  match = checkWin();
  reset.style.visibility = "invisible";
  reset.style.opacity = 0;
  reset.onclick = "";
  reset.style.cursor = "default";
  ws.send(JSON.stringify(game));
  removeReset();
}
function updateGameScore(score) {
  game.score = score;
}
function updateGameTurn(turn) {
  game.turn = turn;
}
function updateGameGrid(grid) {
  game.gameobj = grid;
}
function updateGameState(turn, grid, score) {
  game.turn = turn;
  game.gameobj = grid;
  game.score = score;
}
function reverseCheckWin() {
  const crosses = document.querySelectorAll("[id^='cross']");
  crosses.forEach((cross) => {
    cross.style.visibility = "hidden";
    cross.classList.remove("anime1", "anime2");
  });
  const arr = document.getElementsByClassName("tickable");
  for (let i = 0; i < 9; i++) {
    arr[i].style.cssText = "pointer-events: auto;"; // Enable all buttons
  }
}
function checkWin() {
  if (checkBoxes(box00, box10, box20, "X")) {
    const cross = document.getElementById("cross0");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 2;
  } else if (checkBoxes(box01, box11, box21, "X")) {
    const cross = document.getElementById("cross1");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 2;
  } else if (checkBoxes(box02, box12, box22, "X")) {
    const cross = document.getElementById("cross2");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 2;
  } else if (checkBoxes(box00, box01, box02, "X")) {
    const cross = document.getElementById("cross3");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 2;
  } else if (checkBoxes(box10, box11, box12, "X")) {
    const cross = document.getElementById("cross4");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 2;
  } else if (checkBoxes(box20, box21, box22, "X")) {
    const cross = document.getElementById("cross5");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 2;
  } else if (checkBoxes(box00, box11, box22, "X")) {
    const cross = document.getElementById("cross7");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 1s";
    cross.classList.add("anime2");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 2;
  } else if (checkBoxes(box02, box11, box20, "X")) {
    const cross = document.getElementById("cross6");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 1s";
    cross.classList.add("anime2");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 2;
  }
  if (checkBoxes(box00, box10, box20, "O")) {
    const cross = document.getElementById("cross0");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 1;
  } else if (checkBoxes(box01, box11, box21, "O")) {
    const cross = document.getElementById("cross1");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 1;
  } else if (checkBoxes(box02, box12, box22, "O")) {
    const cross = document.getElementById("cross2");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 1;
  } else if (checkBoxes(box00, box01, box02, "O")) {
    const cross = document.getElementById("cross3");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 1;
  } else if (checkBoxes(box10, box11, box12, "O")) {
    const cross = document.getElementById("cross4");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 1;
  } else if (checkBoxes(box20, box21, box22, "O")) {
    const cross = document.getElementById("cross5");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 1;
  } else if (checkBoxes(box00, box11, box22, "O")) {
    const cross = document.getElementById("cross7");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime2");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 1;
  } else if (checkBoxes(box02, box11, box20, "O")) {
    const cross = document.getElementById("cross6");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime2");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    disableAllButtons();
    return 1;
  } else if (checkIfTie() === 9) {
    disableAllButtons();
    return 0;
  } else {
    return -1;
  }
}
function checkIfTie() {
  let count = 0;
  tickables.forEach((tickable) => {
    if (tickable.classList.contains("clicked")) {
      count++;
      //console.log(count);
    }
  });
  return count;
}

function displayReset(score) {
  if (match === 1) {
    score.p2++;
    updateGameScore(score);
    updateScoreV2(score);
    turnIndicator.innerText = "Player 2 Won!";
    reset.style.visibility = "visible";
    reset.style.opacity = 1;
    reset.style.cursor = "pointer";
    reset.onclick = reloadPage;
    match = -1;
    // fetch("http://localhost:5000/addp2")
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     updateScore(data.p1, data.p2, data.tie);
    //     turnIndicator.innerText = "Player 2 Won!";
    //     reset.style.visibility = "visible";
    //     reset.style.opacity = 1;
    //     reset.onclick = reloadPage;
    //   })
    //   .catch((error) => console.error("Fetch error:", error));
  } else if (match === 2) {
    score.p1++;
    updateGameScore(score);
    updateScoreV2(score);

    turnIndicator.innerText = "Player 1 Won!";
    reset.style.visibility = "visible";
    reset.style.opacity = 1;
    reset.onclick = reloadPage;
    match = -1;
    // fetch("http://localhost:5000/addp1")
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     updateScore(data.p1, data.p2, data.tie);
    //     turnIndicator.textContent = "Player 1 Won!";
    //     reset.style.visibility = "visible";
    //     reset.style.opacity = 1;
    //     reset.onclick = reloadPage;
    //   })
    //   .catch((error) => console.error("Fetch error:", error));
  } else if (match === 0) {
    score.tie++;
    updateGameScore(score);
    updateScoreV2(score);
    turnIndicator.innerText = "It's a Tie!";
    reset.style.visibility = "visible";
    reset.style.opacity = 1;
    reset.onclick = reloadPage;
    match = -1;
    // fetch("http://localhost:5000/addtie")
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     updateScore(data.p1, data.p2, data.tie);
    //     turnIndicator.textContent = "Its a Tie!";
    //     reset.style.visibility = "visible";
    //     reset.style.opacity = 1;
    //     reset.onclick = reloadPage;
    //   })
    //   .catch((error) => console.error("Fetch error:", error));
  } else {
    EnablePlayerMoves();
    ws.send(JSON.stringify(game));
  }
}

function checkBoxes(box1, box2, box3, value) {
  return (
    box1.innerText === value &&
    box2.innerText === value &&
    box3.innerText === value
  );
}
function updateScoreV2(scoreobj) {
  const { p1, p2, tie } = scoreobj;
  p1Score.innerHTML = p1;
  p2Score.innerHTML = p2;
  tieScore.innerHTML = tie;
}
function updateScore(p1, p2, tie) {
  p1Score.innerHTML = p1;
  p2Score.innerHTML = p2;
  tieScore.innerHTML = tie;
}

function displayMap(map) {
  for (let i = 0; i < Object.keys(map).length; i++) {
    const element = Object.keys(map)[i];
    let key = document.getElementById(`${element}`);
    key.innerText = Object.values(map)[i];
    if (key.innerText != "") {
      maxTurns--;
      key.classList.add("clicked");
    }
  }
}

function mapPlayerMoves() {
  const list = document.getElementsByClassName("tickable");
  let gridMap = {};
  let i = 0;
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    gridMap[element.id] = element.innerText;
  }
  return gridMap;
}
function disableAllButtons() {
  tickables.forEach((tickable) => {
    tickable.classList.add("clicked");
    tickable.style.pointerEvents = "none";
  });
}
function EnablePlayerMoves() {
  tickables.forEach((tickable) => {
    tickable.classList.remove("clicked");
    tickable.style.pointerEvents = "auto";
  });
}
function clearGrid() {
  tickables.forEach((tickable) => {
    tickable.innerText = "";
    tickable.classList.remove("clicked");
  });
}

/*displayMap(game);
match = checkWin();
displayReset();
*/
