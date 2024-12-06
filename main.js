let maxTurns = 9;
let playerTurn = true; // false for player 1 / true for player 2
let matchPoint = false;
let match = -1;
player1Score = 0;
player2Score = 0;
tieScore = 0;

const turnIndicator = document.getElementById("turn-indicator");
const tickables = document.querySelectorAll(".tickable");
const reset = document.getElementById("reset");

const box00 = document.getElementById("00");
const box10 = document.getElementById("10");
const box20 = document.getElementById("20");
const box01 = document.getElementById("01");
const box11 = document.getElementById("11");
const box21 = document.getElementById("21");
const box02 = document.getElementById("02");
const box12 = document.getElementById("12");
const box22 = document.getElementById("22");

function reloadPage() {
  location.reload();
}

function checkBoxes(box1, box2, box3, value) {
  return (
    box1.innerHTML === value &&
    box2.innerHTML === value &&
    box3.innerHTML === value
  );
}

tickables.forEach(function (tickable) {
  tickable.addEventListener("click", function handleClick() {
    //var audio = new Audio('snore-aughhhh.mp3');
    //audio.play();
    if (!tickable.classList.contains("clicked")) {
      if (playerTurn) {
        turnIndicator.textContent = "Player 2";
        tickable.innerHTML = "X";
        playerTurn = false;
        checkWin();
        maxTurns--;
        console.log(maxTurns);
      } else {
        turnIndicator.textContent = "Player 1";
        tickable.style.backgroundColor = "blanchedalmond";
        tickable.innerHTML = "O";
        playerTurn = true;
        checkWin();
        maxTurns--;
        console.log(maxTurns);
        console.log(match + " :match");
      }

      tickable.classList.add("clicked");
      tickable.style.pointerEvents = "none"; // Disable further clicks
    }
    if (match > -1) {
      tickables.forEach(function (tickable) {
        tickable.classList.add("clicked");
        tickable.style.pointerEvents = "none";
      });
      if (match === 1) {
        player2Score++;
        turnIndicator.innerText = "Player 2 Won!";
        reset.style.visibility = "visible";
        reset.style.opacity = 1;
        reset.onclick = reloadPage;
      } else if (match === 2) {
        player1Score++;
        turnIndicator.textContent = "Player 1 Won!";
        reset.style.visibility = "visible";
        reset.style.opacity = 1;
        reset.onclick = reloadPage;
      }
    } else if (maxTurns === 0) {
      tieScore++;
      turnIndicator.textContent = "Its a Tie!";
      reset.style.visibility = "visible";
      reset.style.opacity = 1;
      reset.onclick = reloadPage;
    }
    console.log(match);
  });
});

function checkWin() {
  if (checkBoxes(box00, box10, box20, "X")) {
    match = 2;
  } else if (checkBoxes(box01, box11, box21, "X")) {
    match = 2;
  } else if (checkBoxes(box02, box12, box22, "X")) {
    match = 2;
  } else if (checkBoxes(box00, box01, box02, "X")) {
    match = 2;
  } else if (checkBoxes(box10, box11, box12, "X")) {
    match = 2;
  } else if (checkBoxes(box20, box21, box22, "X")) {
    match = 2;
  } else if (checkBoxes(box00, box11, box22, "X")) {
    match = 2;
  } else if (checkBoxes(box02, box11, box20, "X")) {
    match = 2;
  }
  if (checkBoxes(box00, box10, box20, "O")) {
    match = 1;
  } else if (checkBoxes(box01, box11, box21, "O")) {
    match = 1;
  } else if (checkBoxes(box02, box12, box22, "O")) {
    match = 1;
  } else if (checkBoxes(box00, box01, box02, "O")) {
    match = 1;
  } else if (checkBoxes(box10, box11, box12, "O")) {
    match = 1;
  } else if (checkBoxes(box20, box21, box22, "O")) {
    match = 1;
  } else if (checkBoxes(box00, box11, box22, "O")) {
    match = 1;
  } else if (checkBoxes(box02, box11, box20, "O")) {
    match = 1;
  }
}
/*
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("hello", (arg) => {
  console.log(arg);
});
*/