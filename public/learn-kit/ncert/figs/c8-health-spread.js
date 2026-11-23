// Class 8 Science, Health: how an infectious disease spreads through a crowd and how handwashing and vaccination slow it.
// 100 people stand in a 10 x 10 grid; each day an infected person can pass the germ to each neighbour with a chance that
// falls as handwashing rises, and vaccinated people (a fixed random set, seeded) cannot catch it. Infected people
// recover after 4 days. A simple model for the picture, not a forecast. Same seed each time, so the same picture appears.
import { canvas, text, title, row, slider, button, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let wash = 20, vac = 0, day = 0, grid, play = false;
  const cv = canvas(host, { aspect: 1, max: 440, min: 310, label: 'A 10 by 10 grid of people showing healthy, infected, recovered and vaccinated' });
  const ctl = row(host);
  const sw = slider(ctl, { label: 'People who wash hands', min: 0, max: 90, step: 10, value: wash, fmt: (v) => `${v}%`, oninput: (v) => { wash = v; reset(); } });
  slider(ctl, { label: 'Vaccinated', min: 0, max: 90, step: 10, value: vac, fmt: (v) => `${v}%`, oninput: (v) => { vac = v; reset(); } });
  const bt = button(ctl, '▶ Run', () => { play = !play; bt.textContent = play ? '❚❚ Pause' : '▶ Run'; });
  button(ctl, 'Reset', () => reset());
  const out = readout(host);
  let R = rng(21), acc = 0;
  function reset() {
    R = rng(21); day = 0; acc = 0;
    const order = Array.from({ length: 100 }, (_, i) => [R(), i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    grid = Array.from({ length: 100 }, () => ({ s: 0, t: 0 })); // 0 healthy, 1 infected, 2 recovered, 3 vaccinated
    order.slice(0, Math.round(vac)).forEach((i) => { grid[i].s = 3; });
    const start = order.slice(90).find((i) => grid[i].s === 0) ?? 55; grid[start].s = 1; show();
  }
  function stepDay() {
    const p = 0.45 * (1 - wash / 100 * 0.8), nxt = grid.map((c) => ({ ...c }));
    grid.forEach((c, i) => {
      if (c.s === 1) { nxt[i].t++; if (nxt[i].t >= 4) nxt[i].s = 2;
        const x = i % 10, y = Math.floor(i / 10);
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const X = x + dx, Y = y + dy; if (X < 0 || X > 9 || Y < 0 || Y > 9) return; const j = Y * 10 + X; if (grid[j].s === 0 && nxt[j].s === 0 && R() < p) nxt[j].s = 1; }); }
    });
    grid = nxt; day++; show();
  }
  function counts() { const c = [0, 0, 0, 0]; grid.forEach((g) => c[g.s]++); return c; }
  function show() { const c = counts(); out.innerHTML = `Day <b>${day}</b>: infected ${c[1]}, recovered ${c[2]}, never ill ${c[0] + c[3]}. ${c[1] === 0 && day > 0 ? '<b>The outbreak is over:</b> ' + (c[2]) + ' people caught it in all.' : 'Raise handwashing or vaccination and run again.'}`; cv.redraw(); }
  loop(host, (dt) => { if (!play) return; acc += dt; if (acc > 0.5) { acc = 0; if (counts()[1] > 0) stepDay(); else { play = false; bt.textContent = '▶ Run'; } } });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Spread of an infection', col);
    const s = Math.min((w - 20) / 10, (h - 76) / 10), x0 = (w - s * 10) / 2, y0 = 36;
    const C = [col.line, col.bad, col.s[2], col.s[3]];
    grid.forEach((c, i) => { const x = x0 + (i % 10) * s + s / 2, y = y0 + Math.floor(i / 10) * s + s / 2; ctx.beginPath(); ctx.arc(x, y, s * 0.36, 0, 7); ctx.fillStyle = C[c.s]; ctx.fill(); });
    const ly = y0 + s * 10 + 14;
    [['healthy', 0], ['infected', 1], ['recovered', 2], ['vaccinated', 3]].forEach(([n, k], i) => { const x = 14 + i * (w - 20) / 4; ctx.beginPath(); ctx.arc(x, ly, 5, 0, 7); ctx.fillStyle = C[k]; ctx.fill(); text(ctx, n, x + 9, ly, { color: col.ink, size: 10 }); });
  };
  reset();
}
