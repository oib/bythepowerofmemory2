import { SHAPES, shapeToEmoji } from "./emoji.js";
import { COLORS } from "./color.js";
import { numberToEmoji } from "./number.js";

export let level = 1;

export function nextLevel() {
  level = Math.min(level + 1, 3);
}

export function resetLevel() {
  level = 1;
}

export function getGridSize(lvl = level) {
  if (lvl <= 1) return 2;
  if (lvl === 2) return 3;
  return 4;
}

export function getGridPositions(size) {
  const positions = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      positions.push([y, x]);
    }
  }
  return positions;
}

export function generateRandomTile(lvl = level) {
  const gridSize = getGridSize(lvl);
  const POSITIONS = getGridPositions(gridSize);
  const index = Math.floor(Math.random() * POSITIONS.length);
  const position = POSITIONS[index];

  return {
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    number: Math.floor(Math.random() * 10),
    position
  };
}

export function mutateTile(tile, lvl = level) {
  const dimensions = ["shape", "color", "number", "position"];
  const changes = dimensions.filter(() => Math.random() < 0.5);

  const newTile = { ...tile };
  const POSITIONS = getGridPositions(getGridSize(lvl));

  for (const dim of changes) {
    switch (dim) {
      case "shape":
        newTile.shape = pickOther(SHAPES, tile.shape);
        break;
      case "color":
        newTile.color = pickOther(COLORS, tile.color);
        break;
      case "number":
        newTile.number = pickOther([...Array(10).keys()], tile.number);
        break;
      case "position":
        newTile.position = pickOther(POSITIONS, tile.position);
        break;
    }
  }
  return newTile;
}

function pickOther(arr, exclude) {
  const options = arr.filter(x => JSON.stringify(x) !== JSON.stringify(exclude));
  return options[Math.floor(Math.random() * options.length)];
}

export function getChangedDimensions(a, b) {
  return ["shape", "color", "number", "position"].filter(dim => {
    return JSON.stringify(a[dim]) !== JSON.stringify(b[dim]);
  });
}

