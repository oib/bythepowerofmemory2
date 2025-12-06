export const COLOR_MAP = {
  red: "#e53935",
  blue: "#1e88e5",
  green: "#43a047",
  yellow: "#ffeb3b",
  orange: "#fb8c00",
  purple: "#8e24aa",
  pink: "#ec407a",
  cyan: "#26c6da",
  black: "#212121"
};

export const COLORS = Object.keys(COLOR_MAP);

export function colorToClass(color) {
  return `color-${color}`;
}

export function applyColor(element, color) {
  // Add class for CSS-based theming
  element.classList.add(colorToClass(color));
  // Also set inline styles to guarantee visibility regardless of CSS overrides
  try {
    const hex = COLOR_MAP[color] || color;
    element.style.setProperty("background-color", hex, "important");
    element.style.setProperty("background", hex, "important");
  } catch (_) {
    // noop
  }
  const darkTextColors = new Set(["yellow", "orange", "cyan"]);
  element.style.color = darkTextColors.has(color) ? "#222" : "#fff";
  // Subtle border color to match background for better visual weight
  try {
    element.style.setProperty("border-color", darkTextColors.has(color) ? "#999" : "rgba(0,0,0,0.35)");
  } catch (_) {}
}

