// A beating heart, seen from the front: watch the atria fill and squeeze, then the ventricles, with the valves
// opening and shutting ("lub" when the AV valves close, "dub" when the semilunar valves close). Slide the heart rate
// to see that fast beats shorten the filling time (diastole) much more than the squeezing (systole).
import { canvas, loop, row, slider, readout, text, title } from '../kit.js';

// phase from 0 to 1 within one beat; systole fixed near 0.3 s, atrial systole 0.1 s
export default function (host) {
  let bpm = 72, ph = 0;
  const cv = canvas(host, { aspect: 1.0, max: 430, min: 340, label: 'An animated heart with four chambers and four valves' });
  const ctl = row(host);
  const anim = loop(host, (dt) => { ph = (ph + dt * bpm / 60) % 1; cv.redraw(); show(); });
  anim.button(ctl);
  slider(ctl, { label: 'Heart rate', min: 40, max: 180, step: 1, value: bpm, fmt: (v) => `${v} beats/min`, oninput: (v) => { bpm = v; show(); } });
  const out = readout(host);
  const T = () => 60 / bpm, aS = () => 0.1 / T(), vS = () => 0.3 / T();
  const state = () => {
    const a = 1 - aS(), v = a - 0; // atrial systole at the end of the cycle, ventricular systole right after
    if (ph >= 1 - aS()) return 'atrial';
    if (ph < vS()) return 'vent';
    return 'diast';
  };
  function show() {
    const s = state(), t = T();
    out.innerHTML = `${bpm} beats/min: one beat = <b>${t.toFixed(2)} s</b>. Ventricular systole 0.30 s, so diastole is about <b>${(t - 0.3).toFixed(2)} s</b>. Now: <b>${{ atrial: 'atrial systole (atria squeeze the last blood into the ventricles)', vent: 'ventricular systole (AV valves shut, semilunar valves open, blood leaves)', diast: 'diastole (everything relaxed, blood flows in)' }[s]}</b>.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const s = state(), cx = w / 2, T0 = 40, ww = Math.min(w * 0.36, 130);
    title(ctx, 'Heart in action', col);
    const aSq = s === 'atrial' ? 0.78 : 1, vSq = s === 'vent' ? 0.7 : s === 'atrial' ? 1.05 : 1;
    const ch = (x, y, rw, rh, f, c, lab) => { ctx.beginPath(); ctx.ellipse(x, y, rw * f, rh * f, 0, 0, 7); ctx.fillStyle = c; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.stroke(); text(ctx, lab, x, y, { color: col.ink, size: 11, weight: 700, align: 'center', fit: false }); };
    const ay = T0 + 50, vy = T0 + 148;
    ch(cx - ww * 0.55, ay, ww * 0.42, 32, aSq, col.s[0], 'RA');
    ch(cx + ww * 0.55, ay, ww * 0.42, 32, aSq, col.s[5], 'LA');
    ch(cx - ww * 0.5, vy, ww * 0.46, 50, vSq, col.s[0], 'RV');
    ch(cx + ww * 0.5, vy, ww * 0.52, 58, vSq, col.s[5], 'LV');
    // valves: AV between atrium and ventricle (open when not in ventricular systole), semilunar on the exits (open in vent systole)
    const av = s !== 'vent', sl = s === 'vent', my = (ay + vy) / 2 - 12;
    const valve = (x, y, open, lab, dx) => { ctx.strokeStyle = open ? col.good : col.bad; ctx.lineWidth = 3; ctx.beginPath(); if (open) { ctx.moveTo(x - 10, y - 5); ctx.lineTo(x - 5, y + 9); ctx.moveTo(x + 10, y - 5); ctx.lineTo(x + 5, y + 9); } else { ctx.moveTo(x - 11, y); ctx.lineTo(x + 11, y); } ctx.stroke(); text(ctx, lab, x + dx, y, { color: open ? col.good : col.bad, size: 9.5, weight: 700, align: dx < 0 ? 'right' : 'left', fit: false }); };
    valve(cx - ww * 0.55, my, av, 'AV', -16); valve(cx + ww * 0.55, my, av, 'AV', 16);
    valve(cx - ww * 0.22, T0 + 82, sl, 'SL', -12); valve(cx + ww * 0.22, T0 + 82, sl, 'SL', 12);
    text(ctx, 'to lungs', cx - ww * 0.5, T0 + 8, { color: col.s[0], size: 10, align: 'center' });
    text(ctx, 'to body', cx + ww * 0.5, T0 + 8, { color: col.s[5], size: 10, align: 'center' });
    if (s === 'vent') { ctx.fillStyle = col.s[5]; ctx.beginPath(); ctx.moveTo(cx + ww * 0.22, T0 + 52); ctx.lineTo(cx + ww * 0.22 - 7, T0 + 42); ctx.lineTo(cx + ww * 0.22 + 7, T0 + 42); ctx.fill(); }
    // pressure strip
    const py = h - 62, pw = w - 40, p = (x) => { const u = x; const tt = u * T(); return tt < 0.3 ? 12 + 108 * Math.sin(Math.PI * tt / 0.3) ** 1.0 : 8; };
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(20, py + 50); ctx.lineTo(20 + pw, py + 50); ctx.stroke();
    ctx.strokeStyle = col.s[5]; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 60; i++) { const u = i / 60, x = 20 + u * pw, y = py + 50 - p(u) * 0.35; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    const cxp = 20 + ph * pw; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cxp, py); ctx.lineTo(cxp, py + 52); ctx.stroke();
    text(ctx, 'left ventricle pressure (peak about 120 mmHg) over one beat', 20, py - 6, { color: col.muted, size: 10.5 });
    text(ctx, 'Valves: green = open, red = shut. Right side: low oxygen, left side: high.', w / 2, h - 8, { color: col.muted, size: 10, align: 'center' });
  };
  show();
}
