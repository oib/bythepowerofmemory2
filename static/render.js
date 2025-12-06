import { shapeToEmoji } from "./emoji.js";
import { DEBUG } from "./config.js";
import { getTileFeedback } from "./tile.js";
import { getGridPositions } from "./logic.js";
import { applyColor } from "./color.js";

export function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.id = "game-canvas";
  canvas.width = 600;
  canvas.height = 600;
  return canvas;
}

export function renderTiles(tiles, selectedIndices, changedIndices, showFeedback, gridSize) {
  if (DEBUG) console.log("🔄 renderTiles called", {
    tiles,
    selectedIndices,
    changedIndices,
    showFeedback,
    gridSize
  });
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "grid";
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  const validPositions = getGridPositions(gridSize).map(pos => pos.toString());

  tiles.forEach((tile, idx) => {
    if (!tile.position || tile.position.length !== 2 || !validPositions.includes(tile.position.toString())) {
      if (DEBUG) console.warn("❗ Ungültige tile.position", tile);
      return;
    }
    const [row, col] = tile.position;
    const div = document.createElement("div");
    div.className = "tile";
    div.style.gridRowStart = row + 1;
    div.style.gridColumnStart = col + 1;
    if (tile.color) {
      applyColor(div, tile.color);
      div.dataset.color = tile.color;
      if (DEBUG) console.log("🎨 applied color", tile.color, div.style.backgroundColor);
    } else if (DEBUG) {
      console.warn("No tile.color present for tile", tile);
    }

    let feedbackIcon = "";
    if (showFeedback) {
      const fb = getTileFeedback(idx, selectedIndices, changedIndices);
      if (fb === "correct") feedbackIcon = "✅";
      if (fb === "wrong") feedbackIcon = "❌";
      if (fb === "missed") feedbackIcon = "⚠️";
    }

    div.innerHTML = `
      <div class="emoji">${shapeToEmoji(tile.shape)}</div>
      <div>${tile.number}</div>
      ${feedbackIcon}
    `;

    if (!showFeedback) {
      div.onclick = () => {
        if (selectedIndices.includes(idx)) {
          selectedIndices.splice(selectedIndices.indexOf(idx), 1);
        } else {
          selectedIndices.push(idx);
        }
        renderTiles(tiles, selectedIndices, changedIndices, false, gridSize);
      };
    }

    grid.appendChild(div);
  });

  gameArea.appendChild(grid);
}

