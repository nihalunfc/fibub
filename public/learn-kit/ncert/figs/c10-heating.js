// Class 10 Electricity: the heating effect (H = I²Rt) and a fuse. Raise the current through a thin wire and it
// warms, glows red, then white; the heat per second grows with the square of the current. With "Fuse" on, the
// thin fuse wire melts at its rated current and the circuit opens before the wiring overheats.
import { canvas, text, title, row, slider, readout, choice, loop, line } from '../../kit.js';

export default function (host) {
  let I = 2, R = 4, mode = 'wire', melted = false, temp = 30, t = 0;
  const RATED = 5;
  const cv = canvas(host, { aspect: 0.58, max: 440, min: 270, label: 'A wire heating up as current rises, and a fuse melting' });
  const ctl = row(host);
  slider(ctl, { label: 'Current I', min: 0, max: 8, step: 0.5, value: I, fmt: (v) => `${v} A`, oninput: (v) => { I = v; if (I < RATED) melted = false; } });
  choice(ctl, 'Show', [['wire', 'Heating wire'], ['fuse', `Fuse (${RATED} A)`]], mode, (v) => { mode = v; melted = false; });
  const out = readout(host);
  loop(host, (dt) => {
    t += dt;
    const P = melted ? 0 : I * I * R;
    temp += (30 + P * 9 - temp) * Math.min(1, dt * 1.5);
    if (mode === 'fuse' && I > RATED && temp > 30 + RATED * RATED * R * 9 * 1.02) melted = true;
    cv.redraw();
    out.innerHTML = melted ? `The fuse wire melted: the circuit is open, so I = 0 and nothing downstream can overheat. Lower the current to below ${RATED} A to fit a new fuse.`
      : `Heat produced each second P = I²R = ${I}² × ${R} = <b>${(I * I * R).toFixed(0)} W</b>. In 1 minute: H = I²Rt = <b>${(I * I * R * 60).toFixed(0)} J</b>. Double the current → four times the heat.`;
  });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'fuse' ? 'A fuse melts before the wiring can overheat' : 'Heat grows with the square of the current', col) + 10;
    const glow = Math.max(0, Math.min(1, (temp - 300) / 900));
    const c = glow < 0.01 ? '#777' : `rgb(${150 + 105 * glow},${60 + 190 * Math.max(0, glow - 0.4) / 0.6},${40 + 200 * Math.max(0, glow - 0.75) / 0.25})`;
    const x0 = 30, x1 = w - 30, y = top + 40;
    if (mode === 'fuse' && melted) { line(ctx, [[x0, y], [w / 2 - 14, y]], c, 4); line(ctx, [[w / 2 + 14, y], [x1, y]], c, 4); ctx.fillStyle = col.muted; ctx.beginPath(); ctx.arc(w / 2 - 14, y + 3, 4, 0, 7); ctx.arc(w / 2 + 14, y + 3, 4, 0, 7); ctx.fill(); }
    else {
      if (glow > 0.05) { ctx.save(); ctx.globalAlpha = glow * 0.5; ctx.fillStyle = c; ctx.fillRect(x0, y - 12, x1 - x0, 24); ctx.restore(); }
      line(ctx, [[x0, y], [x1, y]], c, mode === 'fuse' ? 3 : 5);
    }
    text(ctx, `about ${Math.round(temp)} °C`, w / 2, y + 26, { color: col.ink, size: 13, weight: 700, align: 'center' });
    // bar chart of P = I²R for I = 1..8 with current marked
    const bx = 40, bw = w - 70, by = h - 30, bh = h - y - 80;
    for (let k = 1; k <= 8; k++) {
      const p = k * k * R, hgt = (p / (64 * R)) * bh, x = bx + ((k - 0.5) / 8) * bw;
      ctx.fillStyle = k === Math.round(I) ? col.s[1] : col.soft; ctx.fillRect(x - bw / 20, by - hgt, bw / 10, hgt);
      text(ctx, `${k} A`, x, by + 10, { color: col.muted, size: 10, align: 'center' });
    }
    text(ctx, 'heat per second at each current (R = 4 Ω)', bx, by - bh - 8, { color: col.muted, size: 10.5 });
  };
}
