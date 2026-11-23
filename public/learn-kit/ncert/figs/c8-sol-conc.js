// Class 8 Solutions: concentration as particles per cup. Concentration = how much solute is mixed into a given amount of
// solution. More spoons in the same water makes it stronger; more water with the same spoons dilutes it. Mass percent =
// mass of solute / mass of solution x 100 (here 1 spoon = 5 g and 1 cup of water = 200 g).
import { canvas, text, title, dot, row, slider, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let sp = 3, cups = 2, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A glass of squash: more spoons or less water makes it stronger' });
  const ctl = row(host);
  slider(ctl, { label: 'Squash powder', min: 0, max: 10, step: 1, value: sp, fmt: (v) => `${v} spoons`, oninput: (v) => { sp = v; say(); } });
  slider(ctl, { label: 'Water', min: 1, max: 5, step: 1, value: cups, fmt: (v) => (v === 1 ? '1 cup' : `${v} cups`), oninput: (v) => { cups = v; say(); } });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const R = rng(9), P = []; for (let i = 0; i < 100; i++) P.push([R(), R(), R() * 6.3, R() * 6.3]);
  const mass = () => { const s = sp * 5, wt = cups * 200; return { s, pc: s / (s + wt) * 100, per: sp / cups }; };
  const word = (per) => (per === 0 ? 'plain water' : per < 1 ? 'dilute' : per < 2.5 ? 'medium' : 'concentrated');
  function say() { const m = mass(); out.innerHTML = `${sp} spoons in ${cups} cups = <b>${m.per.toFixed(2)} spoons per cup</b>. Mass percent = ${m.s} g ÷ ${m.s + cups * 200} g × 100 = <b>${m.pc.toFixed(1)}%</b>: a ${word(m.per)} solution.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Strength of a solution', col);
    const m = mass(), bx = w * 0.1, bw = w * 0.52, by = 48, bh = h - 70, full = bh - 14, lvl = full * (0.28 + 0.14 * (cups - 1));
    const top = by + bh - lvl;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, top, bw, lvl);
    ctx.save(); ctx.globalAlpha = Math.min(0.75, m.per * 0.28); ctx.fillStyle = col.s[1]; ctx.fillRect(bx, top, bw, lvl); ctx.restore();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    const n = Math.round(sp * 10);
    for (let i = 0; i < n; i++) { const p = P[i]; dot(ctx, bx + 8 + (bw - 16) * p[0] + 4 * Math.sin(p[2] + t * 1.1), top + 8 + (lvl - 16) * p[1] + 4 * Math.sin(p[3] + t * 0.9), 2.6, col.s[1]); }
    for (let k = 1; k < cups; k++) { const y = by + bh - lvl * k / cups; ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx + bw, y); ctx.stroke(); ctx.setLineDash([]); }
    // meter
    const gx = w * 0.72, gw = 24, gy = by, gh = bh - 8;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(gx, gy, gw, gh);
    const fill = Math.min(1, m.per / 10); ctx.fillStyle = col.s[1]; ctx.fillRect(gx, gy + gh * (1 - fill), gw, gh * fill);
    text(ctx, 'per cup', gx + gw / 2, gy - 8, { color: col.muted, size: 10, align: 'center' });
    text(ctx, m.per.toFixed(1), gx + gw / 2, gy + gh + 12, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, word(m.per), bx + bw / 2, by + 16, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
  };
  say();
}
