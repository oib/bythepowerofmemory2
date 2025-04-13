import { setupButtons } from "./button.js";
import { drawLineChart } from "./chart.js";
import { shapeToEmoji } from "./emoji.js";
import { playSound } from "./sound.js";
import { guess } from "./score.js";
import { startRound } from "./round.js";
import { previousTile, currentTile } from "./state.js";
import { generateRandomTiles } from "./tile.js";
import { renderTiles } from "./render.js";

let selectedIndices = [];
let correctChangedTiles = [];
let showFeedback = false;

let tiles = [];

function startGame() {
  tiles.forEach(tile => delete tile.feedback);
  document.getElementById("game-area").classList.add("flash");
  setTimeout(() => {
    document.getElementById("game-area").classList.remove("flash");
  }, 250);
  const beforeTiles = generateRandomTiles();
  const { modifiedTiles, changedIndices } = createModifiedTiles(beforeTiles);

  tiles = modifiedTiles;
  correctChangedTiles = changedIndices;
  selectedIndices = [];
  showFeedback = false;

  renderTiles();
  document.getElementById("submit-btn").disabled = false;
}

function handleSubmit() {
  showFeedback = true;
  renderTiles();

  const result = calculateScore(selectedIndices, correctChangedTiles);
  playSound(result.score > 0 ? "correct" : "wrong");

  document.getElementById("submit-btn").disabled = true;

  setTimeout(() => {
    startGame();
  }, 2500);
}

function resetGame() {
  selectedIndices = [];
  correctChangedTiles = [];
  showFeedback = false;
  tiles = [];
  renderTiles();
}

window.addEventListener("load", () => {
  startRound();
});

