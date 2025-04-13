import { SHAPES } from "./emoji.js";

export function generateRandomTiles(gridSize = 4, shapePoolSize = 4, numberPoolSize = 5) {
  const totalTiles = gridSize * gridSize;
  const shapes = SHAPES.sort(() => 0.5 - Math.random()).slice(0, shapePoolSize);
  const numbers = Array.from({ length: numberPoolSize }, (_, i) => i + 1);

  const positions = getGridPositions(gridSize);
  const tiles = Array.from({ length: totalTiles }, (_, i) => ({
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    number: numbers[Math.floor(Math.random() * numbers.length)],
    position: positions[i]
  }));

  return tiles;
}

export function createModifiedTiles(originalTiles, changes = 2) {
  const newTiles = originalTiles.map(t => ({ ...t }));
  const changeIndices = new Set();

  while (changeIndices.size < changes) {
    changeIndices.add(Math.floor(Math.random() * newTiles.length));
  }

  for (const index of changeIndices) {
    let newShape;
    do {
      newShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    } while (newShape === newTiles[index].shape);

    newTiles[index].shape = newShape;
  }

  return { modifiedTiles: newTiles, changedIndices: [...changeIndices] };
}

export function getGridPositions(gridSize) {
  const positions = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      positions.push([row, col]);
    }
  }
  return positions;
}

export function getTileFeedback(index, selected, changed) {
  if (selected.includes(index) && changed.includes(index)) return "correct";
  if (selected.includes(index) && !changed.includes(index)) return "wrong";
  if (!selected.includes(index) && changed.includes(index)) return "missed";
  return null;
}

export function calculateScore(selected, correct) {
  const correctSet = new Set(correct);
  const selectedSet = new Set(selected);
  const correctGuesses = selected.filter(i => correctSet.has(i));
  const wrongGuesses = selected.filter(i => !correctSet.has(i));
  const missed = correct.filter(i => !selectedSet.has(i));

  return {
    correctGuesses,
    wrongGuesses,
    missed,
    score: correctGuesses.length - wrongGuesses.length
  };
}

