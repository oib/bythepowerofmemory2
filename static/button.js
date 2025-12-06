import { showHelp } from "./help.js";
import { DEBUG } from "./config.js";

export function setupButtons({ onStart, onColor, onPosition, onShape, onNumber }) {
  const startBtn = document.getElementById("start-btn");
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

  // Submit button removed (legacy)

  // Restart button removed, Start handles both start and restart

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

  // Ensure the app receives keyboard focus
  const focusTarget = document.querySelector('.container') || document.body;
  if (focusTarget && !focusTarget.hasAttribute('tabindex')) {
    focusTarget.setAttribute('tabindex', '-1');
  }
  const ensureFocus = () => {
    try { focusTarget?.focus({ preventScroll: true }); } catch (_) {}
  };
  // Try focusing immediately and when user interacts
  ensureFocus();
  window.addEventListener('pointerdown', ensureFocus, { capture: true });
  window.addEventListener('pointerup', ensureFocus, { capture: true });
  window.addEventListener('focus', ensureFocus);

  // Keyboard shortcuts: a=position, s=color, d=shape, f=number
  const keyMap = {
    a: { btn: () => document.getElementById("position-btn"), cb: onPosition, name: "Position" },
    s: { btn: () => document.getElementById("color-btn"), cb: onColor, name: "Color" },
    d: { btn: () => document.getElementById("shape-btn"), cb: onShape, name: "Shape" },
    f: { btn: () => document.getElementById("number-btn"), cb: onNumber, name: "Number" }
  };

  function handleKey(e) {
    if (DEBUG) console.log("⌨️ key event", { type: e.type, key: e.key, code: e.code, repeat: e.repeat, target: e.target && e.target.tagName });
    // Ignore when typing in inputs/textareas/contenteditable
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

    const key = e.key?.toLowerCase();
    const code = e.code; // e.g., 'KeyA'
    const codeToKey = { KeyA: "a", KeyS: "s", KeyD: "d", KeyF: "f" };
    const effective = keyMap[key] ? key : codeToKey[code];
    if (!effective || !(effective in keyMap)) return;
    // Avoid holding the key triggering multiple times rapidly
    if (e.repeat) return;
    const entry = keyMap[effective];
    const btn = entry.btn?.();
    if (!btn || btn.disabled) {
      if (DEBUG) console.log(`⌨️ '${effective}' pressed but ${entry.name} is disabled`);
      return;
    }
    // Trigger the same flow as clicking the button to keep behavior consistent
    if (DEBUG) console.log(`⌨️ Shortcut '${effective}' -> ${entry.name}`);
    btn.click();
    e.preventDefault();
  }

  // Attach to both document and window to maximize capture in different browsers/embeds
  if (!window.__btpom_keys_registered) {
    window.__btpom_keys_registered = true;
    document.addEventListener("keydown", handleKey, { capture: false });
    window.addEventListener("keydown", handleKey, { capture: true });
    document.addEventListener("keypress", handleKey, { capture: false });
    window.addEventListener("keypress", handleKey, { capture: true });
    // Raw logger to verify events reach the page regardless of DEBUG
    window.addEventListener(
      "keydown",
      (e) => {
        const k = e.key?.toLowerCase();
        if (["KeyA", "KeyS", "KeyD", "KeyF"].includes(e.code) || ["a", "s", "d", "f"].includes(k)) {
          // Unconditional log to aid debugging when DEBUG filtering hides logs
          console.log("⌨️ raw keydown", { key: e.key, code: e.code, repeat: e.repeat });
        }
      },
      { capture: true }
    );
    window.addEventListener(
      "keypress",
      (e) => {
        const k = e.key?.toLowerCase();
        if (["KeyA", "KeyS", "KeyD", "KeyF"].includes(e.code) || ["a", "s", "d", "f"].includes(k)) {
          console.log("⌨️ raw keypress", { key: e.key, code: e.code, repeat: e.repeat });
        }
      },
      { capture: true }
    );
  }

  document.addEventListener("keyup", (e) => {
    // prevent stuck key repeat on some browsers
    if (["KeyA","KeyS","KeyD","KeyF"].includes(e.code)) e.preventDefault();
    if (DEBUG) console.log("⌨️ keyup", { key: e.key, code: e.code });
  });
  window.addEventListener("keyup", (e) => {
    if (["KeyA","KeyS","KeyD","KeyF"].includes(e.code)) e.preventDefault();
    if (DEBUG) console.log("⌨️ keyup(win)", { key: e.key, code: e.code });
  });
}

export function enableButtons() {
  document.querySelectorAll("button").forEach(btn => {
    btn.disabled = false;
  });
}

