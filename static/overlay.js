import { state } from "./state.js";

export function showOverlay() {
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
  overlay.style.zIndex = "9999";

  const statsBox = document.createElement("div");
  statsBox.style.background = "var(--panel, #151a21)";
  statsBox.style.padding = "1em 2em";
  statsBox.style.borderRadius = "12px";
  statsBox.style.maxWidth = "90%";
  statsBox.style.maxHeight = "80%";
  statsBox.style.overflowY = "auto";
  statsBox.style.border = "1px solid var(--border, #2a313c)";

  const title = document.createElement("h2");
  title.textContent = "Game History";
  title.style.marginBottom = "0.5em";
  statsBox.appendChild(title);

  // Only show per-game summaries (entries with correct/wrong/net). Legacy per-round entries are ignored.
  const perGame = (state.gameHistory || []).filter(e => typeof e === 'object' && 'correct' in e && 'wrong' in e && 'net' in e);

  if (perGame.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No game summaries yet. Start a game, then start a new one to record a summary.";
    statsBox.appendChild(empty);
  } else {
    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    perGame.forEach(entry => {
      const li = document.createElement("li");
      const when = (entry.time || "").replace(/T/, " ").slice(0, 19);
      li.textContent = `${when} — ✅ ${entry.correct}  ❌ ${entry.wrong}  🎯 ${entry.net}`;
      li.style.padding = "4px 0";
      list.appendChild(li);
    });
    statsBox.appendChild(list);
  }

  // Close overlay when clicking anywhere (backdrop or content)
  overlay.addEventListener("click", () => {
    try { document.body.removeChild(overlay); } catch (_) {}
  });
  statsBox.addEventListener("click", () => {
    try { document.body.removeChild(overlay); } catch (_) {}
  });

  overlay.appendChild(statsBox);
  document.body.appendChild(overlay);
}

