import { DEBUG } from "./config.js";

export function showHelp() {
  if (DEBUG) console.log("❔ showHelp() opened");
  const helpOverlay = document.createElement("div");
  helpOverlay.id = "help-overlay";
  helpOverlay.innerHTML = `
    <div class="help-content">
      <h2>🧠 How to Play</h2>
      <p>This is a memory game with 4 dimensions:</p>
      <ul>
        <li><b>Position</b> – where the tile appears</li>
        <li><b>Color</b> – the color of the emoji</li>
        <li><b>Shape</b> – the emoji symbol</li>
        <li><b>Number</b> – the digit inside</li>
      </ul>
      <p>You see one tile – then after a short pause the board changes. Your task: guess which <b>dimension stayed the same</b>.</p>
      <p>Use the buttons to select the unchanged dimension. You can only pick once per round.</p>
      <button id="close-help">Close</button>
    </div>
  `;

  document.body.appendChild(helpOverlay);

  document.getElementById("close-help").onclick = () => {
    helpOverlay.remove();
    if (DEBUG) console.log("❌ showHelp() closed");
  };
}

