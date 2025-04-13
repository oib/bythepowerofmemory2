import { state } from "./state.js";

export function showOverlay() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0, 0, 0, 0.7)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.color = "white";
  overlay.style.zIndex = "9999";

  const statsBox = document.createElement("div");
  statsBox.style.background = "#222";
  statsBox.style.padding = "1em 2em";
  statsBox.style.borderRadius = "12px";
  statsBox.style.maxWidth = "90%";
  statsBox.style.maxHeight = "80%";
  statsBox.style.overflowY = "auto";

  const title = document.createElement("h2");
  title.textContent = "Spielverlauf";
  title.style.marginBottom = "0.5em";
  statsBox.appendChild(title);

  if (state.gameHistory.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Noch keine Daten vorhanden.";
    statsBox.appendChild(empty);
  } else {
    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    state.gameHistory.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.time.replace(/T/, " ").slice(0, 19)} — ${entry.result}`;
      list.appendChild(li);
    });
    statsBox.appendChild(list);
  }

  const close = document.createElement("button");
  close.textContent = "Schließen";
  close.style.marginTop = "1em";
  close.style.padding = "0.5em 1em";
  close.style.border = "none";
  close.style.borderRadius = "6px";
  close.style.cursor = "pointer";
  close.onclick = () => document.body.removeChild(overlay);

  statsBox.appendChild(close);
  overlay.appendChild(statsBox);
  document.body.appendChild(overlay);
}

