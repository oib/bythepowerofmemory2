import { DEBUG } from "./config.js";
import { nextLevel, resetLevel, level } from "./logic.js";

export const state = {
  previousTile: null,
  currentTile: null,
  scoreCorrect: 0,
  scoreWrong: 0,
  netScore: 0,
  gameHistory: [],
  // timers
  roundTimeoutId: null,
  mutationTimeoutId: null,
  roundActive: false,
  inputLocked: false,
  guessedThisRound: []
};

export function resetScore() {
  if (DEBUG) console.log("🔄 resetScore() called");
  state.scoreCorrect = 0;
  state.scoreWrong = 0;
  state.netScore = 0;
  localStorage.setItem("correct", "0");
  localStorage.setItem("wrong", "0");
  localStorage.setItem("net", "0");
  document.getElementById("score-correct").textContent = "0";
  document.getElementById("score-wrong").textContent = "0";
  const netEl = document.getElementById("score-net");
  if (netEl) netEl.textContent = "0";
}

function updateRatioBar() {
  const total = state.scoreCorrect + state.scoreWrong;
  const bar = document.getElementById("ratio-bar");
  if (!bar) return;
  const ok = bar.querySelector('.correct');
  const bad = bar.querySelector('.wrong');
  if (!ok || !bad) return;
  if (total === 0) {
    ok.style.width = '50%';
    bad.style.width = '50%';
    return;
  }
  const correctPct = Math.max(0, Math.min(100, Math.round((state.scoreCorrect / total) * 100)));
  ok.style.width = `${correctPct}%`;
  bad.style.width = `${100 - correctPct}%`;
}

export function clearRoundTimers() {
  if (state.roundTimeoutId) {
    clearTimeout(state.roundTimeoutId);
    state.roundTimeoutId = null;
  }
  if (state.mutationTimeoutId) {
    clearTimeout(state.mutationTimeoutId);
    state.mutationTimeoutId = null;
  }
  state.roundActive = false;
}

export function updateScore(isCorrect) {
  if (DEBUG) console.log("🎯 updateScore() called", { isCorrect });
  if (isCorrect) {
    state.scoreCorrect++;
    state.netScore++;
    localStorage.setItem("correct", state.scoreCorrect);
    localStorage.setItem("net", state.netScore);
    document.getElementById("score-correct").textContent = state.scoreCorrect;
  } else {
    state.scoreWrong++;
    state.netScore--;
    localStorage.setItem("wrong", state.scoreWrong);
    localStorage.setItem("net", state.netScore);
    document.getElementById("score-wrong").textContent = state.scoreWrong;
  }
  const netEl = document.getElementById("score-net");
  if (netEl) netEl.textContent = state.netScore;

  // Update ratio bar visualization
  updateRatioBar();

  // Automatic level progression when ∑ Net reaches thresholds (>= with level guard)
  const shouldLevelTo2 = level === 1 && state.netScore >= 41;
  const shouldLevelTo3 = level === 2 && state.netScore >= 82;
  if (shouldLevelTo2 || shouldLevelTo3) {
    try {
      nextLevel();
      if (DEBUG) console.log(`🏆 Level up triggered at ∑ Net = ${state.netScore}`);
      // Optional: brief UI feedback
      const area = document.getElementById("game-area");
      if (area) {
        area.classList.add("flash");
        setTimeout(() => area.classList.remove("flash"), 400);
      }
      // Notify listeners (round.js) to refresh rendering to new grid size
      try {
        const evt = new CustomEvent("levelup", { detail: { net: state.netScore } });
        window.dispatchEvent(evt);
      } catch (_) {}
    } catch (e) {
      if (DEBUG) console.warn("Level up failed:", e);
    }
  }
}

export function loadScore() {
  const savedCorrect = parseInt(localStorage.getItem("correct")) || 0;
  const savedWrong = parseInt(localStorage.getItem("wrong")) || 0;
  const savedNet = parseInt(localStorage.getItem("net")) || 0;
  const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
  state.scoreCorrect = savedCorrect;
  state.scoreWrong = savedWrong;
  state.netScore = savedNet;
  state.gameHistory = savedHistory;
  document.getElementById("score-correct").textContent = savedCorrect;
  document.getElementById("score-wrong").textContent = savedWrong;
  const netEl = document.getElementById("score-net");
  if (netEl) netEl.textContent = savedNet;
  updateRatioBar();
}

// Persist a summary of the just-finished game (per-game stats, not per-round)
export function finalizeGame() {
  // Only record if any interaction happened
  if (state.scoreCorrect > 0 || state.scoreWrong > 0) {
    const entry = {
      time: new Date().toISOString(),
      correct: state.scoreCorrect,
      wrong: state.scoreWrong,
      net: state.netScore
    };
    state.gameHistory.push(entry);
    localStorage.setItem("history", JSON.stringify(state.gameHistory));
    if (DEBUG) console.log("📝 finalizeGame() recorded:", entry);
  } else if (DEBUG) {
    console.log("📝 finalizeGame() skipped (no rounds played)");
  }
}

export function restart() {
  // Do not start a new round automatically. Return to blank screen.
  resetScore();
  clearRoundTimers();
  // Clear game area
  const area = document.getElementById("game-area");
  if (area) area.innerHTML = "";
  // Reset button labels
  const labels = {
    "position-btn": "Position",
    "color-btn": "Color",
    "shape-btn": "Shape",
    "number-btn": "Number"
  };
  Object.entries(labels).forEach(([id, text]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.textContent = text;
      btn.disabled = true; // disabled until a round starts
    }
  });
  if (DEBUG) console.log("restart() triggered -> blank screen and controls disabled");
}

export function startGame() {
  // Before starting a new game, record a summary of the previous one
  finalizeGame();
  // Then reset and reload UI counters
  resetScore();
  loadScore();
  // Always start from Level 1 for a new game
  try { resetLevel(); if (DEBUG) console.log("🔁 Level reset to 1 for new game"); } catch (_) {}
  // Do not directly start a round here to avoid circular imports with round.js.
  // index.html will call startRound() after startGame().
  // Re-enable guess buttons will happen when round starts.
  if (DEBUG) console.log("startGame() triggered");
}

export function initializeUI() {
  // Ensure buttons are reset and disabled on first load
  resetGuessButtons(true);
}

export function resetGuessButtons(disabled = false) {
  const labels = {
    "position-btn": "Position",
    "color-btn": "Color",
    "shape-btn": "Symbol",
    "number-btn": "Number"
  };
  Object.entries(labels).forEach(([id, text]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.textContent = text;
      btn.disabled = !!disabled;
    }
  });
}

