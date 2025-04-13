export async function drawLineChart() {
  const res = await fetch("/api/stats");
  const data = await res.json();

  const canvas = document.getElementById("scoreChart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const allDays = Array.from(new Set(
    Object.values(data).flat().map(d => d.day)
  )).sort();

  const maxScore = Math.max(
    ...Object.values(data).flat().map(d => d.avg_score)
  );

  const padding = 50;
  const chartW = canvas.width - padding * 2;
  const chartH = canvas.height - padding * 2;

  // Axes
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  const colors = ["#007bff", "#28a745", "#dc3545", "#ffc107", "#6f42c1"];
  let playerIndex = 0;

  for (const [player, entries] of Object.entries(data)) {
    ctx.strokeStyle = colors[playerIndex % colors.length];
    ctx.beginPath();

    entries.forEach((entry, i) => {
      const x = padding + (i * (chartW / (allDays.length - 1)));
      const y = canvas.height - padding - ((entry.avg_score / maxScore) * chartH);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      // draw point
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    });

    ctx.stroke();

    // Legend
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillText(player, canvas.width - 100, padding + playerIndex * 20);
    playerIndex++;
  }

  // X axis labels
  ctx.fillStyle = "#000";
  allDays.forEach((day, i) => {
    const x = padding + (i * (chartW / (allDays.length - 1)));
    ctx.fillText(day.slice(5), x - 10, canvas.height - padding + 15);
  });
}

