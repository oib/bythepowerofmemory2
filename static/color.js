export const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "cyan",
  "red",
  "black"
];

export function colorToClass(color) {
  return `color-${color}`;
}

export function applyColor(element, color) {
  element.classList.add(colorToClass(color));
}

