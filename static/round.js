import { generateRandomTile, mutateTile, getGridSize } from "./logic.js";
import { renderTiles, createCanvas } from "./render.js";
import { resetScore, state } from "./state.js";
import { enableButtons } from "./button.js";
import { DEBUG } from "./config.js";

export function startRound() {
  const canvas = createCanvas();
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";
  gameArea.appendChild(canvas);

  const ctx = canvas?.getContext("2d");
  if (DEBUG) console.log("startRound called");
  if (DEBUG) console.log("canvas element:", canvas);

  if (!canvas || !ctx) {
    if (DEBUG) console.warn("game-canvas or context not available");
    if (DEBUG) {
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Canvas or 2D context not available at round start",
          timestamp: new Date().toISOString()
        })
      });
    }
    return;
  }

  resetScore();
  const size = getGridSize();

  if (!state.previousTile) {
    state.previousTile = {};
  }
  if (!state.currentTile) {
    state.currentTile = {};
  }

  state.previousTile.shape = null;
  state.previousTile.color = null;
  state.previousTile.number = null;
  state.previousTile.position = null;

  const generated = generateRandomTile();
  if (DEBUG) console.log("🆕 generated tile:", generated);
  Object.assign(state.previousTile, generated);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderTiles([state.previousTile], [], [], false, size);

  setTimeout(() => {
    const mutated = mutateTile(state.previousTile);
    if (!mutated || !mutated.position) {
      if (DEBUG) {
        fetch("/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Mutation failed or position missing",
            timestamp: new Date().toISOString()
          })
        });
      }
      return;
    }
    if (DEBUG) console.log("🔀 mutated tile:", mutated);
    Object.assign(state.currentTile, mutated);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderTiles([state.currentTile], [], [], false, size);
    enableButtons();
    if (DEBUG) {
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Round started: dimensions mutated",
          timestamp: new Date().toISOString()
        })
      });
    }
  }, 2000);
}

