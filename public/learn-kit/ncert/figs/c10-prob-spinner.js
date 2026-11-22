// Class 10 Probability: a spinner. For a spinner whose sectors are fair slices, P(landing on a colour) = (angle of its
// sectors) ÷ 360°. Spin it, tally the landings and compare the experimental fractions with the theoretical ones.
// Three designs: eight equal numbered sectors, a half/quarter/quarter spinner, and an unfair spinner with a thin sector.
import { canvas, text, title, row, button, choice, readout, loop, ease } from '../../kit.js';

const SP = {
  eight: { name: 'Eight equal sectors', sec: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ a: 45, c: n % 2 ? 0 : 1, t: String(n) })), groups: [['odd', 'an odd number', (s) => s.c === 0], ['even', 'an even number', (s) => s.c === 1], ['gt6', 'more than 6', (s) => +s.t > 6]] },
  colours: { name: 'Half, quarter, quarter', sec: [{ a: 180, c: 1, t: 'red' }, { a: 90, c: 0, t: 'blue' }, { a: 90, c: 2, t: 'green' }], groups: [['red', 'red', (s) => s.t === 'red'], ['blue', 'blue', (s) => s.t === 'blue'], ['green', 'green', (s) => s.t === 'green']] },
  thin: { name: 'An unfair spinner', sec: [{ a: 36, c: 1, t: 'red' }, { a: 144, c: 0, t: 'blue' }, { a: 180, c: 2, t: 'green' }], groups: [['red', 'red', (s) => s.t === 'red'], ['blue', 'blue', (s) => s.t === 'blue'], ['green', 'green', (s) => s.t === 'green']] },
};
export default function (host) {
  let key = 'eight', gk = 0, rot = 0, from = 0, to = 0, t = 1, tally = [], N = 0, pending = -1;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 290, label: 'A spinner with coloured sectors, spun to compare experimental and theoretical probability' });
  const ctl = row(host);
  const reset = () => { tally = SP[key].sec.map(() => 0); N = 0; rot = 0; t = 1; gk = 0; say(); cv.redraw(); };
  choice(ctl, 'Spinner', [['eight', '8 equal'], ['colours', '½ ¼ ¼'], ['thin', 'Unfair']], key, (v) => { key = v; reset(); });
  button(ctl, 'Spin', () => spin(1));
  button(ctl, 'Spin 100 times', () => { for (let i = 0; i < 100; i++) tallyOne(Math.random() * 360); say(); cv.redraw(); });
  button(ctl, 'Reset', reset);
  loop(host, (dt) => { if (t < 1) { t = Math.min(1, t + dt / 1.6); rot = from + (to - from) * (1 - Math.pow(1 - t, 3)); if (t >= 1) { tallyOne(((360 - (rot % 360)) % 360)); } cv.redraw(); } });
  const out = readout(host);
  const which = (ang) => { let c = 0; const S = SP[key].sec; for (let i = 0; i < S.length; i++) { c += S[i].a; if (ang < c) return i; } return S.length - 1; };
  function tallyOne(ang) { tally[which(ang)]++; N++; say(); }
  function spin() { if (t < 1) return; from = rot; to = rot + 720 + Math.random() * 360; t = 0; }
  function say() {
    const S = SP[key], sel = S.groups;
    out.innerHTML = `${N} spins. ` + sel.map(([, nm, f]) => { const ang = S.sec.filter(f).reduce((s, x) => s + x.a, 0), k = S.sec.reduce((s, x, i) => s + (f(x) ? tally[i] : 0), 0); return `P(${nm}) = ${ang}°/360° = <b>${(ang / 360).toFixed(3)}</b> ${N ? `(experiment ${(k / N).toFixed(3)})` : ''}`; }).join('; ') + '.';
  }
  cv.draw = (ctx, w, h, col) => {
    const S = SP[key], top = title(ctx, S.name + ': spin and tally', col), r = Math.min(w / 2 - 18, (h - top - 34) / 2), cx = w / 2, cy = top + 16 + r;
    let a0 = rot * Math.PI / 180 - Math.PI / 2;
    S.sec.forEach((s, i) => {
      const a1 = a0 + s.a * Math.PI / 180;
      ctx.fillStyle = col.s[s.c === 1 ? 1 : s.c === 2 ? 2 : 0]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke();
      const m = (a0 + a1) / 2;
      if (s.a >= 30) text(ctx, s.t, cx + Math.cos(m) * r * 0.65, cy + Math.sin(m) * r * 0.65, { color: col.panel, size: 13, weight: 700, align: 'center' });
      a0 = a1;
    });
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.moveTo(cx, cy - r + 2); ctx.lineTo(cx - 9, cy - r - 12); ctx.lineTo(cx + 9, cy - r - 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 7); ctx.fill(); ctx.stroke();
    const ty = cy + r + 18;
    text(ctx, N ? 'landed: ' + S.sec.map((s, i) => `${s.t} ${tally[i]}`).join('  ') : 'no spins yet', w / 2, Math.min(h - 8, ty), { color: col.muted, size: 10.5, align: 'center' });
  };
  reset();
}
