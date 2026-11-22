// Class 10 Acids, Bases and Salts: acids only show their acid properties in water, and strong acids split completely
// while weak acids split only a little. Equal 0.1 mol/L solutions: HCl is almost fully ionised (pH 1, bright bulb);
// ethanoic acid only about 1% (pH 2.9, dim bulb); glucose has hydrogen but gives no H+ (no acid, bulb off); dry HCl gas
// has no water to ionise into, so it does not turn dry blue litmus red.
import { canvas, text, title, line, dot, row, choice, readout, loop, rng, clamp } from '../../kit.js';

const D = {
  hcl: { n: 'HCl in water', frac: 1, ph: '1', glow: 1, note: 'HCl + H₂O → H₃O⁺ + Cl⁻ goes all the way: every molecule splits, so there are many ions, the bulb is bright and the pH is about 1. A <b>strong acid</b>.' },
  ch3: { n: 'Ethanoic acid in water', frac: 0.12, ph: '2.9', glow: 0.25, note: 'Only about 1 molecule in 100 splits into H⁺ and CH₃COO⁻ (drawn bigger here so you can see it). Few ions, a dim bulb, pH about 2.9. A <b>weak acid</b>. Vinegar is a dilute solution of it.' },
  glu: { n: 'Glucose in water', frac: 0, ph: '7', glow: 0, note: 'Glucose (C₆H₁₂O₆) contains hydrogen, but it does not give H⁺ ions in water. No ions, no current: the bulb stays off, so it is not an acid. Alcohol is the same.' },
  dry: { n: 'Dry HCl gas', frac: 0, ph: '–', glow: 0, note: 'Without water the HCl molecules stay whole. Dry HCl gas does not change dry blue litmus paper; the H⁺ ions appear only when water is there. This is why acids show acidic behaviour only in aqueous solutions.' },
};
export default function (host) {
  let k = 'hcl', t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'Molecules in water splitting into ions, and a bulb lit by the solution' });
  const ctl = row(host);
  choice(ctl, 'Substance', Object.entries(D).map(([v, o]) => [v, o.n]), k, (v) => { k = v; say(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  function say() { out.innerHTML = D[k].note; cv.redraw(); }
  const R = rng(21), P = Array.from({ length: 22 }, () => [R(), R(), R() * 6.28, 0.4 + R()]);
  cv.draw = (ctx, w, h, col) => {
    const d = D[k], top = title(ctx, `${d.n}: pH ${d.ph}`, col) + 8;
    // bulb
    const bx = w - 66, by = top + 26, glow = d.glow;
    ctx.save(); ctx.globalAlpha = 0.15 + 0.7 * glow; ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(bx, by, 26, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx, by, 26, 0, 7); ctx.stroke();
    text(ctx, glow > 0.7 ? 'bright' : glow > 0 ? 'dim' : 'off', bx, by + 40, { color: col.ink, size: 11, weight: 700, align: 'center' });
    // beaker
    const x0 = 14, bw = w * 0.62, bt = top + 34, bh = h - bt - 22;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = k === 'dry' ? 0.04 : 0.18; ctx.fillRect(x0, bt + bh * 0.18, bw, bh * 0.82); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, bt); ctx.lineTo(x0, bt + bh); ctx.lineTo(x0 + bw, bt + bh); ctx.lineTo(x0 + bw, bt); ctx.stroke();
    // electrodes
    line(ctx, [[x0 + bw * 0.2, bt - 6], [x0 + bw * 0.2, bt + bh * 0.8]], col.ink, 3); line(ctx, [[x0 + bw * 0.8, bt - 6], [x0 + bw * 0.8, bt + bh * 0.8]], col.ink, 3);
    P.forEach(([a, b, ph, s], i) => {
      const split = i / P.length < d.frac * (k === 'ch3' ? 1 : 1);
      const X = x0 + 12 + a * (bw - 24) + Math.sin(t * s * 1.5 + ph) * 6, Y = bt + bh * 0.25 + b * (bh * 0.68) + Math.cos(t * s * 1.3 + ph) * 5;
      if (d.frac === 0 && k === 'glu') { ctx.fillStyle = col.s[4]; ctx.fillRect(X - 5, Y - 5, 10, 10); return; }
      if (k === 'dry') { dot(ctx, X, Y - 10, 5, col.s[7]); dot(ctx, X + 7, Y - 10, 5, col.s[2]); line(ctx, [[X, Y - 10], [X + 7, Y - 10]], col.ink, 1.5); return; }
      if (split) { dot(ctx, X, Y, 4.5, col.s[7]); text(ctx, '+', X, Y, { color: '#fff', size: 8, weight: 700, align: 'center', fit: false }); dot(ctx, X + 12 + Math.sin(t + ph) * 2, Y + 4, 5.5, col.s[2]); text(ctx, '−', X + 12, Y + 4, { color: '#fff', size: 9, weight: 700, align: 'center', fit: false }); }
      else { dot(ctx, X, Y, 5, col.s[7]); dot(ctx, X + 8, Y, 5.5, col.s[2]); line(ctx, [[X, Y], [X + 8, Y]], col.ink, 1.5); }
    });
    const legend = { hcl: 'red H, green Cl: all split', ch3: 'few pairs split, most stay whole', glu: 'pink squares: glucose molecules', dry: 'no water: molecules stay whole' }[k];
    text(ctx, legend, x0 + bw / 2, bt + bh + 13, { color: col.muted, size: 10, align: 'center' });
    // current wires
    line(ctx, [[x0 + bw * 0.2, bt - 6], [x0 + bw * 0.2, by - 26 - 0], [bx - 26, by]], col.line, 1.5);
    line(ctx, [[x0 + bw * 0.8, bt - 6], [x0 + bw * 0.8, bt - 16], [bx + 26, by + 6]], col.line, 1.5);
  };
  say();
}
