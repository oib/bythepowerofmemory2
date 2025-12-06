import { SHAPES, shapeToEmoji } from "./emoji.js";
import { COLORS } from "./color.js";
import { numberToEmoji } from "./number.js";

export let level = 1;

export function nextLevel() {
  level = Math.min(level + 1, 3);
}

// Symbol pool by level (highly distinct first)
export function getSymbolPool(lvl = level) {
  const ordered = [
    "circle",
    "square",
    "triangle_up",
    "star",
    "heart",
    "arrow_right",
    "cross",
    "diamond",
    // expand set for higher levels
    "triangle_down",
    "triangle_left",
    "triangle_right",
    "arrow_left",
    "arrow_up",
    "arrow_down",
    "asterisk",
    "double_excl",
    "question_double",
    "question_excl",
    "excl_question"
  ].filter(s => SHAPES.includes(s));

  if (lvl <= 1) return ordered.slice(0, 8);   // small, high-contrast set
  if (lvl === 2) return ordered.slice(0, 14); // medium set
  return ordered;                              // full set for L3+
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
  const colorPool = getColorPool(lvl);
  const symbolPool = getSymbolPool(lvl);

  return {
    shape: symbolPool[Math.floor(Math.random() * symbolPool.length)],
    color: colorPool[Math.floor(Math.random() * colorPool.length)],
    number: Math.floor(Math.random() * 10),
    position
  };
}

export function mutateTile(tile, lvl = level) {
  const dimensions = ["shape", "color", "number", "position"];
  const POSITIONS = getGridPositions(getGridSize(lvl));
  const colorPool = getColorPool(lvl);
  const symbolPool = getSymbolPool(lvl);

  // Try several times to get at least 1 changed dimension
  for (let attempt = 0; attempt < 20; attempt++) {
    const changes = dimensions.filter(() => Math.random() < 0.5);
    if (changes.length === 0) {
      // ensure at least one dimension is selected
      changes.push(dimensions[Math.floor(Math.random() * dimensions.length)]);
    }

    const candidate = { ...tile };
    for (const dim of changes) {
      switch (dim) {
        case "shape":
          candidate.shape = pickOther(symbolPool, tile.shape);
          break;
        case "color":
          candidate.color = pickOther(colorPool, tile.color);
          break;
        case "number":
          candidate.number = pickOther([...Array(10).keys()], tile.number);
          break;
        case "position":
          candidate.position = pickOther(POSITIONS, tile.position);
          break;
      }
    }

    if (getChangedDimensions(tile, candidate).length >= 1) {
      return candidate;
    }
  }

  // Fallback: force exactly one random dimension to change
  const forced = { ...tile };
  const dim = dimensions[Math.floor(Math.random() * dimensions.length)];
  switch (dim) {
    case "shape":
      forced.shape = pickOther(symbolPool, tile.shape);
      break;
    case "color":
      forced.color = pickOther(colorPool, tile.color);
      break;
    case "number":
      forced.number = pickOther([...Array(10).keys()], tile.number);
      break;
    case "position":
      forced.position = pickOther(POSITIONS, tile.position);
      break;
  }
  return forced;
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

// Color pool by level: L1=5, L2=7, L3=9 (or max available)
export function getColorPool(lvl = level) {
  // Intentional order: start with high-contrast, then expand
  const ordered = [
    "red",    // high contrast
    "green",  // high contrast
    "blue",   // high contrast
    "yellow", // RGB+
    "purple",
    "orange",
    "cyan",
    "pink",
    "black"
  ].filter(c => COLORS.includes(c));

  if (lvl <= 1) return ordered.slice(0, 4);      // RGB + Yellow (4 colors)
  if (lvl === 2) return ordered.slice(0, 7);     // expand to 7
  return ordered;                                 // Level 3+: full set
}

