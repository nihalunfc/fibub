// A hydraulic lift (Pascal's law). Pressure pushed into a closed liquid appears everywhere equally, so a small force
// on a small piston can balance a large force on a large piston. Push the small piston down (slider or Play): the
// big piston rises only a little, by d2 = d1 A1/A2, so force x distance (work) stays equal. Change the area ratio and the load.
import { canvas, text, title, arrow, row, slider, readout, loop, button } from '../kit.js';

export default function (host) {
  let ratio = 20, mass = 500, f1 = 300, d1 = 0, dir = 1; // A2/A1, kg, N
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 300, label: 'A hydraulic lift: a small piston pushing a large piston through liquid' });
  const ctl = row(host);
  slider(ctl, { label: 'Area ratio A₂/A₁', min: 2, max: 50, step: 1, value: ratio, fmt: (v) => `${v}`, oninput: (v) => { ratio = v; upd(); } });
  slider(ctl, { label: 'Load', min: 100, max: 3000, step: 50, value: mass, fmt: (v) => `${v} kg`, oninput: (v) => { mass = v; upd(); } });
  slider(ctl, { label: 'Push F₁', min: 50, max: 600, step: 10, value: f1, fmt: (v) => `${v} N`, oninput: (v) => { f1 = v; upd(); } });
  const c2 = row(host);
  slider(c2, { label: 'Small piston down', min: 0, max: 40, step: 0.5, value: d1, fmt: (v) => `${v} cm`, oninput: (v) => { d1 = v; upd(); } });
  const sl = c2.querySelector('input');
  const lp = loop(host, (dt) => { d1 += dir * 14 * dt; if (d1 > 40) { d1 = 40; dir = -1; } if (d1 < 0) { d1 = 0; dir = 1; } sl.value = d1; sl.dispatchEvent(new Event('input')); }, { autoplay: false });
  lp.button(c2);
  const out = readout(host);
  const A1 = 0.002; // m², small piston 20 cm²
  const state = () => { const P = f1 / A1, F2 = P * A1 * ratio, W = mass * 9.8, lifts = F2 >= W; return { P, F2, W, lifts, d2: d1 / ratio }; };
  function upd() {
    const { P, F2, W, lifts, d2 } = state();
    out.innerHTML = `Pressure everywhere: P = F₁/A₁ = <b>${(P / 1000).toFixed(0)} kPa</b>. Output force F₂ = P·A₂ = F₁·(A₂/A₁) = <b>${F2.toFixed(0)} N</b> against the load's weight ${W.toFixed(0)} N: ${lifts ? 'it <b>lifts</b>' : '<b>too small to lift</b>'}. Small piston down ${d1.toFixed(1)} cm, big piston up ${d2.toFixed(2)} cm. Work in = ${(f1 * d1 / 100).toFixed(1)} J, work out = ${lifts ? (F2 * d2 / 100).toFixed(1) : '0 (not moving)'} J.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const { lifts, d2, F2, W } = state();
    title(ctx, 'Pascal hydraulic lift', col);
    const wS = Math.max(26, Math.min(48, w * 0.12)), wB = Math.min(w * 0.4, wS * Math.sqrt(ratio) * 1.15 + 14), base = h - 36, lvl = base - 74;
    const x1 = w * 0.12, x2 = w - 12 - wB, pix = 2.2;
    const y1 = lvl - 26 + d1 * pix * 0.5, y2 = lvl - 26 - (lifts ? d2 : 0) * pix * 6;
    ctx.fillStyle = col.soft; // liquid
    ctx.fillRect(x1, y1 + 10, wS, base - y1 - 10); ctx.fillRect(x1, base - 34, x2 + wB - x1, 34); ctx.fillRect(x2, y2 + 10, wB, base - y2 - 10);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.strokeRect(x1, lvl - 60, wS, base - lvl + 60); ctx.strokeRect(x2, lvl - 60, wB, base - lvl + 60); ctx.beginPath(); ctx.rect(x1, base - 34, x2 + wB - x1, 34); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.fillRect(x1 + 1, y1, wS - 2, 10); ctx.fillRect(x2 + 1, y2, wB - 2, 10);
    ctx.fillStyle = lifts ? col.s[2] : col.bad; const bw = Math.min(wB * 0.8, 20 + mass / 60), bh = 14 + mass / 200; ctx.fillRect(x2 + (wB - bw) / 2, y2 - bh, bw, bh);
    text(ctx, `${mass} kg`, x2 + wB / 2, y2 - bh / 2, { color: col.bg, size: 10, weight: 700, align: 'center', fit: false });
    arrow(ctx, x1 + wS / 2, y1 - 30, x1 + wS / 2, y1 - 2, col.s[1], 3);
    text(ctx, `F₁ = ${f1} N`, x1 + wS + 6, y1 - 18, { color: col.s[1], size: 11, weight: 600 });
    text(ctx, `A₁`, x1 + wS / 2, base - 17, { color: col.ink, size: 11, align: 'center', weight: 600 });
    text(ctx, `A₂ = ${ratio} A₁`, x2 + wB / 2, base - 17, { color: col.ink, size: 11, align: 'center', weight: 600 });
    text(ctx, `F₂ = ${F2.toFixed(0)} N`, x2 + wB / 2, lvl - 74 > 30 ? lvl - 70 : 36, { color: col.s[2], size: 11, align: 'center', weight: 600 });
    text(ctx, 'same pressure P in the liquid', (x1 + wS + x2) / 2, base - 17, { color: col.muted, size: 10, align: 'center' });
  };
  upd();
}
