import { DEBUG } from "./config.js";

export function showHelp() {
  if (DEBUG) console.log("❔ showHelp() opened");

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0, 0, 0, 0.6)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.color = "var(--text, #e6edf3)";
  overlay.style.zIndex = "10000";

  const panel = document.createElement("div");
  panel.style.background = "var(--panel, #151a21)";
  panel.style.padding = "1em 2em";
  panel.style.borderRadius = "12px";
  panel.style.maxWidth = "min(90%, 720px)";
  panel.style.maxHeight = "80%";
  panel.style.overflowY = "auto";
  panel.style.border = "1px solid var(--border, #2a313c)";
  // body text left-aligned by default
  panel.style.textAlign = "left";

  panel.innerHTML = `
    <h2 style="text-align:center">🧠 How to Play</h2>
    <p>This is a memory game with 4 dimensions:</p>
    <ul>
      <li><b>Position</b> – where the tile appears</li>
      <li><b>Color</b> – the color of the emoji</li>
      <li><b>Shape</b> – the emoji symbol</li>
      <li><b>Number</b> – the digit inside</li>
    </ul>
    <h3 style="text-align:center">🔗 Chained Rounds</h3>
    <p>You see a sequence of patterns. First pattern 1 appears, then pattern 2. Your task is to compare the <b>last two patterns</b> (1→2, then 2→3, then 3→4, ...).</p>
    <p>Each round has a <b>5 second window</b>. During that time, you can make <b>multiple guesses</b> (e.g., Color and Position) — but only one guess per dimension.</p>
    <p>After 5 seconds, the game automatically advances to the next comparison.</p>

    <h3 style="text-align:center">⌨️ Keyboard Shortcuts (Desktop)</h3>
    <ul>
      <li><b>A</b> → Position</li>
      <li><b>S</b> → Color</li>
      <li><b>D</b> → Shape</li>
      <li><b>F</b> → Number</li>
    </ul>
    <p>Tips: Make sure the page has focus. Shortcuts work even if the mouse isn’t on the buttons.</p>

    <h3 style="text-align:center">🏆 Scoring & Levels</h3>
    <p>Correct guesses increase your score, wrong guesses decrease it. Your <b>Net</b> score drives difficulty: Level up at Net 41 and Net 82 (up to Level 3).</p>
  `;

  // Ensure lists render with bullets and proper indentation on dark theme
  panel.querySelectorAll("ul").forEach((ul) => {
    ul.style.listStyle = "disc";
    ul.style.margin = "0.5em 0 0.75em 1.25em";
    ul.style.paddingLeft = "1.0em";
  });
  panel.querySelectorAll("li").forEach((li) => {
    li.style.margin = "0.25em 0";
  });

  // Close on click anywhere (backdrop or panel)
  const doClose = () => {
    if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
    if (DEBUG) console.log("❌ showHelp() closed");
  };
  overlay.addEventListener("click", doClose, { once: true });
  panel.addEventListener("click", doClose, { once: true });
  // Close on ESC
  const onKey = (e) => { if (e.key === "Escape") doClose(); };
  document.addEventListener("keydown", onKey, { once: true });

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

