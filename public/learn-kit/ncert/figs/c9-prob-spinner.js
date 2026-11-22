// Class 9 Probability: a spinner with 8 equal sectors, some orange and the rest blue. Theoretical probability of orange =
// (orange sectors) / 8. Spin it and keep a tally: the experimental probability (orange spins / all spins) approaches it.
import { canvas, text, title, row, slider, button, readout, loop, ease } from '../../kit.js';

export default function (host) {
  let red = 3, spins = 0, hits = 0, ang = 0, from = 0, to = 0, t = 1, pend = false, lastRed = null;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A spinner with orange and blue sectors and a tally of spins' });
  const ctl = row(host);
  slider(ctl, { label: 'Orange sectors (out of 8)', min: 0, max: 8, step: 1, value: red, fmt: (v) => String(v), oninput: (v) => { red = v; spins = hits = 0; lastRed = null; sync(); } });
  const c2 = row(host);
  button(c2, 'Spin', () => spin());
  button(c2, 'Spin 100 times', () => { for (let i = 0; i < 100; i++) tally(Math.random() * 8); sync(); });
  button(c2, 'Reset', () => { spins = hits = 0; lastRed = null; sync(); });
  const out = readout(host);
  const isRed = (sec) => Math.floor(sec) < red;
  function tally(sec) { spins++; if (isRed(sec)) hits++; lastRed = isRed(sec); }
  function spin() { if (t < 1) return; const sec = Math.random() * 8, th = sec * 45 - 22.5; from = ang; to = ang + 1440 + ((((th - ang) % 360) + 360) % 360); t = 0; pend = sec; }
  loop(host, (dt) => { if (t < 1) { t = Math.min(1, t + dt / 1.6); ang = from + (to - from) * ease(t); if (t >= 1) { tally(pend); sync(); } cv.redraw(); } });
  function sync() {
    out.innerHTML = `Theoretical P(orange) = ${red}/8 = <b>${(red / 8).toFixed(3)}</b>. ` + (spins ? `Spins: ${spins}, orange ${hits} times, so experimental P(orange) = ${hits}/${spins} = <b>${(hits / spins).toFixed(3)}</b>.` : 'Press Spin, then try 100 spins.') + ` P(blue) = ${(8 - red)}/8 = ${((8 - red) / 8).toFixed(3)}, and the two add up to 1.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Spinner: ' + red + ' orange, ' + (8 - red) + ' blue sectors', col), cx = w / 2, cy = top + (h - top) / 2 - 4, R = Math.min(w / 2 - 20, (h - top) / 2 - 22);
    for (let i = 0; i < 8; i++) { ctx.fillStyle = i < red ? col.s[1] : col.s[0]; ctx.globalAlpha = 0.75; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, -Math.PI / 2 + (i * Math.PI) / 4 - Math.PI / 8, -Math.PI / 2 + ((i + 1) * Math.PI) / 4 - Math.PI / 8); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.save(); ctx.translate(cx, cy); ctx.rotate((ang * Math.PI) / 180);
    ctx.strokeStyle = col.ink; ctx.fillStyle = col.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -R * 0.85); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-8, -R * 0.85); ctx.lineTo(8, -R * 0.85); ctx.lineTo(0, -R * 0.98); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 7); ctx.fill();
    text(ctx, lastRed === null ? 'spin it' : lastRed ? 'Orange!' : 'Blue!', cx, h - 12, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  sync();
}
