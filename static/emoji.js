export const SHAPES = [
  // Safe, widely supported symbols
  "circle",
  "square",
  "triangle_up",
  "triangle_down",
  "triangle_left",
  "triangle_right",
  "cross",
  "star",
  "heart",
  "diamond",
  "arrow_up",
  "arrow_down",
  "arrow_left",
  "arrow_right",
  "asterisk",
  "double_excl",
  "question_double",
  "question_excl",
  "excl_question"
];

export function shapeToEmoji(shape) {
  const map = {
    circle: "●",
    square: "■",
    triangle_up: "▲",
    triangle_down: "▼",
    triangle_left: "◀",
    triangle_right: "▶",
    cross: "✖",
    star: "★",
    heart: "♥",
    diamond: "◆",
    arrow_up: "↑",
    arrow_down: "↓",
    arrow_left: "←",
    arrow_right: "→",
    asterisk: "※",
    double_excl: "‼",
    question_double: "⁇",
    question_excl: "⁈",
    excl_question: "⁉",
  };
  const emoji = map[shape] || "■"; // solid fallback
  return emoji;
}

