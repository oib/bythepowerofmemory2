import { generateRandomTile, mutateTile, getGridSize, level } from "./logic.js";
import { renderTiles } from "./render.js";
import { state, resetGuessButtons, clearRoundTimers } from "./state.js";
import { enableButtons } from "./button.js";
import { DEBUG } from "./config.js";

// Start a chained sequence of comparisons: 1→2, then 2→3, etc.
export function startRound() {
  // Prepare timing: cancel any previous timers and mark active
  clearRoundTimers();
  state.roundActive = true;
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";
  // Visible status while preparing
  const status = document.createElement("div");
  status.style.color = "var(--muted-text, #9aa4b2)";
  status.style.margin = "0.5rem auto";
  status.style.fontSize = "0.95rem";
  status.textContent = "Preparing pattern…";
  try { gameArea.appendChild(status); } catch (_) {}
  // Reset guess button labels (do not force-disable here; guesses will be guarded in guess())
  resetGuessButtons(true); // keep disabled until pattern #2 is visible
  if (DEBUG) console.log("startRound (chain) called");
  console.log("[round] startRound invoked");

  const size = getGridSize();
  const { revealDelay, windowMs } = getLevelTimings();
  updateLevelLabel();
  try {
    // Always start a fresh comparison chain
    let initial = generateRandomTile();
    if (!initial || !initial.position) {
      console.warn("round.js: generateRandomTile returned invalid tile, falling back");
      initial = { shape: "circle", color: "blue", number: 0, position: [0,0] };
    }
    state.previousTile = initial;
    if (DEBUG) console.log("🆕 pattern #1:", state.previousTile);
    console.log("[round] pattern #1 ready", state.previousTile);
    try {
      renderTiles([state.previousTile], [], [], false, size);
    } catch (e) {
      console.error("round.js: renderTiles failed for pattern #1", e);
    }

    // Show the second pattern after the per-level reveal delay to start the first comparison (1→2)
    state.mutationTimeoutId = setTimeout(() => {
      try {
        const next = mutateTile(state.previousTile);
        if (DEBUG) console.log("🔀 pattern #2:", next);
        console.log("[round] pattern #2 ready", next);
        state.currentTile = next;
        try {
          renderTiles([state.currentTile], [], [], false, size);
        } catch (e) {
          console.error("round.js: renderTiles failed for pattern #2", e);
        }
        state.guessedThisRound = [];
        resetGuessButtons(false); // enable guessing now
        enableButtons();
        ["position","color","shape","number"].forEach(name => {
          const b = document.getElementById(`${name}-btn`);
          if (b) { b.disabled = false; b.removeAttribute("disabled"); }
        });
        try { status.remove(); } catch (_) {}
        startRoundTimer(windowMs);
        scheduleAutoAdvance(windowMs);
      } catch (e) {
        console.error("round.js: failed during mutation/show second pattern", e);
      }
    }, revealDelay);
  } catch (e) {
    console.error("round.js: failed to start round", e);
  }
}

// Proceed to the next comparison in the chain: shift current→previous, compute a new current, render and enable guessing.
export function nextChainStep() {
  if (!state.roundActive) state.roundActive = true;
  const size = getGridSize();
  const { windowMs } = getLevelTimings();

  // Shift tiles: previous becomes the last shown pattern; generate the next one from it
  if (state.currentTile && state.currentTile.shape) {
    state.previousTile = { ...state.currentTile };
  }
  const next = mutateTile(state.previousTile);
  if (DEBUG) console.log("➡️ next pattern:", next, "(compare with)", state.previousTile);
  state.currentTile = next;

  renderTiles([state.currentTile], [], [], false, size);
  state.guessedThisRound = [];
  resetGuessButtons(false);
  enableButtons();
  ["position","color","shape","number"].forEach(name => {
    const b = document.getElementById(`${name}-btn`);
    if (b) { b.disabled = false; b.removeAttribute("disabled"); }
  });

  // Reset any timers and schedule auto-advance again
  if (state.roundTimeoutId) clearTimeout(state.roundTimeoutId);
  startRoundTimer(windowMs);
  scheduleAutoAdvance(windowMs);
}

function scheduleAutoAdvance(windowMs) {
  state.roundTimeoutId = setTimeout(() => {
    if (!state.roundActive) return;
    nextChainStep();
  }, windowMs);
}

// Update a simple level indicator if present in the DOM
function updateLevelLabel() {
  const el = document.getElementById("level-label");
  if (el) el.textContent = String(level);
}

// Per-level timings: reveal delay before showing pattern #2 and window length for guesses
function getLevelTimings() {
  // Defaults (Level 1)
  let revealDelay = 1200;
  let windowMs = 4500;
  if (level === 2) {
    revealDelay = 700;
    windowMs = 3000;
  } else if (level >= 3) {
    revealDelay = 600;
    windowMs = 2000;
  }
  return { revealDelay, windowMs };
}


// ----- Round timer UI (top-level so all functions can use it) -----
function ensureTimerContainer() {
  const gameArea = document.getElementById("game-area");
  if (!gameArea) return null;
  let bar = document.getElementById("round-timer");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "round-timer";
    const fill = document.createElement("div");
    fill.className = "fill";
    bar.appendChild(fill);
    gameArea.appendChild(bar);
  }
  return bar;
}

function startRoundTimer(windowMs) {
  const bar = ensureTimerContainer();
  if (!bar) return;
  const fill = bar.querySelector('.fill');
  if (!fill) return;
  // Reset transition to restart animation
  fill.style.transition = 'none';
  // Force reflow to apply removal of transition
  // eslint-disable-next-line no-unused-expressions
  fill.offsetHeight;
  fill.style.width = '100%';
  // Next frame: set transition and animate to 0%
  requestAnimationFrame(() => {
    fill.style.transition = `width ${windowMs}ms linear`;
    fill.style.width = '0%';
  });
}

