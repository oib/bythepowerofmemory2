import { state, updateScore } from "./state.js";
import { DEBUG } from "./config.js";
import { startRound } from "./round.js";
import { playSound } from "./sound.js";

export function guess(dimension) {
  if (DEBUG) console.log("🧠 guess() triggered", { dimension });
  if (DEBUG) console.log("previousTile:", state.previousTile);
  if (DEBUG) console.log("currentTile:", state.currentTile);
  const result = state.previousTile[dimension] === state.currentTile[dimension];
  const btn = document.getElementById(`${dimension}-btn`);
  btn.textContent = result ? "✅" : "❌";
  btn.disabled = true;
  playSound(result ? "correct" : "wrong");
  updateScore(result);

  const scoreCorrect = parseInt(localStorage.getItem("correct")) || 0;
  const scoreWrong = parseInt(localStorage.getItem("wrong")) || 0;
  const total = scoreCorrect + scoreWrong;
  if (total === 4) {
    setTimeout(() => startRound(), 1000);
  }
}

export function calculateScore(selected, correct) {
  const correctSet = new Set(correct);
  const selectedSet = new Set(selected);
  const correctGuesses = selected.filter(i => correctSet.has(i));
  const wrongGuesses = selected.filter(i => !correctSet.has(i));
  const missed = correct.filter(i => !selectedSet.has(i));

  correctGuesses.forEach(i => tiles[i].feedback = "correct");
  wrongGuesses.forEach(i => tiles[i].feedback = "wrong");
  missed.forEach(i => tiles[i].feedback = "missed");

  return {
    correctGuesses,
    wrongGuesses,
    missed,
    score: correctGuesses.length - wrongGuesses.length
  };
}

