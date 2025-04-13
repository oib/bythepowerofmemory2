import { showHelp } from "./help.js";
import { DEBUG } from "./config.js";

export function setupButtons({ onStart, onSubmit, onRestart, onColor, onPosition, onShape, onNumber }) {
  const startBtn = document.getElementById("start-btn");
  const submitBtn = document.getElementById("submit-btn");
  const restartBtn = document.getElementById("restart-btn");
  const colorBtn = document.getElementById("color-btn");
  const positionBtn = document.getElementById("position-btn");
  const shapeBtn = document.getElementById("shape-btn");
  const numberBtn = document.getElementById("number-btn");
  const helpBtn = document.getElementById("help-btn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (DEBUG) console.log("▶️ Start clicked");
      onStart?.();
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      if (DEBUG) console.log("📨 Submit clicked");
      onSubmit?.();
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      if (DEBUG) console.log("🔁 Restart clicked");
      onRestart?.();
    });
  }

  if (colorBtn) {
    colorBtn.addEventListener("click", () => {
      if (DEBUG) console.log("🎨 Color clicked");
      onColor?.();
    });
  }

  if (positionBtn) {
    positionBtn.addEventListener("click", () => {
      if (DEBUG) console.log("📍 Position clicked");
      onPosition?.();
    });
  }

  if (shapeBtn) {
    shapeBtn.addEventListener("click", () => {
      if (DEBUG) console.log("🔷 Shape clicked");
      onShape?.();
    });
  }

  if (numberBtn) {
    numberBtn.addEventListener("click", () => {
      if (DEBUG) console.log("🔢 Number clicked");
      onNumber?.();
    });
  }

  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      if (DEBUG) console.log("❓ Help clicked");
      showHelp();
    });
  }
}

export function enableButtons() {
  document.querySelectorAll("button").forEach(btn => {
    btn.disabled = false;
  });
}

