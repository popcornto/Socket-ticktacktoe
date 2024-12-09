let maxTurns = 9;
let playerTurn = true; // false for player 1 / true for player 2
let matchPoint = false;
let match = -1;

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

fetch("http://localhost:3000/score")
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

function reloadPage() {
  location.reload();
}

function checkBoxes(box1, box2, box3, value) {
  return (
    box1.innerText === value &&
    box2.innerText === value &&
    box3.innerText === value
  );
}
function updateScore(p1, p2, tie) {
  p1Score.innerHTML = p1;
  p2Score.innerHTML = p2;
  tieScore.innerHTML = tie;
}

tickables.forEach(function (tickable) {
  tickable.addEventListener("click", function handleClick() {
    if (!tickable.classList.contains("clicked")) {
      //var audio = new Audio("shar.mp3");
      //audio.play();
      if (playerTurn) {
        turnIndicator.textContent = "Player 2";
        tickable.innerText = "X";
        playerTurn = false;
        checkWin();
        maxTurns--;
      } else {
        turnIndicator.textContent = "Player 1";
        tickable.style.backgroundColor = "blanchedalmond";
        tickable.innerText = "O";
        playerTurn = true;
        checkWin();
        maxTurns--;
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
        fetch("http://localhost:3000/addp2")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            updateScore(data.p1, data.p2, data.tie);
            turnIndicator.innerText = "Player 2 Won!";
            reset.style.visibility = "visible";
            reset.style.opacity = 1;
            reset.onclick = reloadPage;
          })
          .catch((error) => console.error("Fetch error:", error));
      } else if (match === 2) {
        fetch("http://localhost:3000/addp1")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            updateScore(data.p1, data.p2, data.tie);
            turnIndicator.textContent = "Player 1 Won!";
            reset.style.visibility = "visible";
            reset.style.opacity = 1;
            reset.onclick = reloadPage;
          })
          .catch((error) => console.error("Fetch error:", error));
      }
    } else if (maxTurns === 0) {
      fetch("http://localhost:3000/addtie")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          updateScore(data.p1, data.p2, data.tie);
          turnIndicator.textContent = "Its a Tie!";
          reset.style.visibility = "visible";
          reset.style.opacity = 1;
          reset.onclick = reloadPage;
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  });
});

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
    match = 2;
  } else if (checkBoxes(box01, box11, box21, "X")) {
    const cross = document.getElementById("cross1");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 2;
  } else if (checkBoxes(box02, box12, box22, "X")) {
    const cross = document.getElementById("cross2");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 2;
  } else if (checkBoxes(box00, box01, box02, "X")) {
    const cross = document.getElementById("cross3");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 2;
  } else if (checkBoxes(box10, box11, box12, "X")) {
    const cross = document.getElementById("cross4");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 2;
  } else if (checkBoxes(box20, box21, box22, "X")) {
    const cross = document.getElementById("cross5");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 2;
  } else if (checkBoxes(box00, box11, box22, "X")) {
    const cross = document.getElementById("cross7");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 1s";
    cross.classList.add("anime2");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 2;
  } else if (checkBoxes(box02, box11, box20, "X")) {
    const cross = document.getElementById("cross6");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 1s";
    cross.classList.add("anime2");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 2;
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
    match = 1;
  } else if (checkBoxes(box01, box11, box21, "O")) {
    const cross = document.getElementById("cross1");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 1;
  } else if (checkBoxes(box02, box12, box22, "O")) {
    const cross = document.getElementById("cross2");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 1;
  } else if (checkBoxes(box00, box01, box02, "O")) {
    const cross = document.getElementById("cross3");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 1;
  } else if (checkBoxes(box10, box11, box12, "O")) {
    const cross = document.getElementById("cross4");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 1;
  } else if (checkBoxes(box20, box21, box22, "O")) {
    const cross = document.getElementById("cross5");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime1");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 1;
  } else if (checkBoxes(box00, box11, box22, "O")) {
    const cross = document.getElementById("cross7");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime2");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
    match = 1;
  } else if (checkBoxes(box02, box11, box20, "O")) {
    const cross = document.getElementById("cross6");
    cross.style.visibility = "visible";
    cross.style.transition = "transform 2s";
    cross.classList.add("anime2");
    const arr = document.getElementsByClassName("tickable");
    for (let i = 0; i < 9; i++) {
      arr[i].style.cssText = "";
    }
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
