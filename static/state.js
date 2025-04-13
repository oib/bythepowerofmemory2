import { DEBUG } from "./config.js";

export const state = {
  previousTile: null,
  currentTile: null,
  scoreCorrect: 0,
  scoreWrong: 0,
  gameHistory: []
};

export function resetScore() {
  if (DEBUG) console.log("🔄 resetScore() called");
  state.scoreCorrect = 0;
  state.scoreWrong = 0;
  localStorage.setItem("correct", "0");
  localStorage.setItem("wrong", "0");
  localStorage.setItem("history", JSON.stringify([]));
  document.getElementById("score-correct").textContent = "0";
  document.getElementById("score-wrong").textContent = "0";
}

export function updateScore(isCorrect) {
  if (DEBUG) console.log("🎯 updateScore() called", { isCorrect });
  if (isCorrect) {
    state.scoreCorrect++;
    localStorage.setItem("correct", state.scoreCorrect);
    document.getElementById("score-correct").textContent = state.scoreCorrect;
  } else {
    state.scoreWrong++;
    localStorage.setItem("wrong", state.scoreWrong);
    document.getElementById("score-wrong").textContent = state.scoreWrong;
  }
  logGuess(isCorrect);
}

export function loadScore() {
  const savedCorrect = parseInt(localStorage.getItem("correct")) || 0;
  const savedWrong = parseInt(localStorage.getItem("wrong")) || 0;
  const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
  state.scoreCorrect = savedCorrect;
  state.scoreWrong = savedWrong;
  state.gameHistory = savedHistory;
  document.getElementById("score-correct").textContent = savedCorrect;
  document.getElementById("score-wrong").textContent = savedWrong;
}

export function logGuess(isCorrect) {
  const timestamp = new Date().toISOString();
  const entry = { time: timestamp, result: isCorrect ? "✅" : "❌" };
  state.gameHistory.push(entry);
  localStorage.setItem("history", JSON.stringify(state.gameHistory));
  if (DEBUG) console.log("🕓 Logged round: ", entry);
}

export function submit() {
  if (DEBUG) console.log("submit() triggered");
}

export function restart() {
  resetScore();
  if (DEBUG) console.log("restart() triggered");
}

export function startGame() {
  resetScore();
  loadScore();
  if (DEBUG) console.log("startGame() triggered");
}

