import { state, updateScore } from "./state.js";
import { nextChainStep } from "./round.js";
import { DEBUG } from "./config.js";
import { playSound } from "./sound.js";

export function guess(dimension) {
  if (DEBUG) console.log("🧠 guess() triggered", { dimension });
  if (DEBUG) console.log("previousTile:", state.previousTile);
  if (DEBUG) console.log("currentTile:", state.currentTile);

  // Guard: only allow a guess if both tiles are present and valid
  const prev = state.previousTile;
  const curr = state.currentTile;
  if (!prev || !curr || !prev.shape || !curr.shape) {
    if (DEBUG) console.log("⛔ Guess ignored: comparison not ready yet");
    return;
  }

  // Ignore repeated guesses on the same dimension within the same round
  if (state.guessedThisRound?.includes(dimension)) {
    if (DEBUG) console.log("↩️ Duplicate guess ignored:", dimension);
    return;
  }

  const result = prev[dimension] === curr[dimension];
  const btn = document.getElementById(`${dimension}-btn`);
  btn.textContent = result ? "✅" : "❌";
  btn.disabled = true; // disable only this dimension; other dimensions remain enabled
  state.guessedThisRound = Array.isArray(state.guessedThisRound) ? state.guessedThisRound : [];
  state.guessedThisRound.push(dimension);
  playSound(result ? "correct" : "wrong");
  updateScore(result);

  // Do not advance here: allow multiple guesses within the 5s window.
  // The chain advances via the auto-advance timer scheduled in round.js.
}

// calculateScore function moved to tile.js to avoid duplication

