// Class 10 Acids, Bases and Salts: neutralisation as a titration. 20 mL of 0.10 mol/L HCl in a flask, 0.10 mol/L NaOH
// added from a burette. H+ + OH- -> H2O. The pH barely moves, then jumps at 20 mL (equivalence point, pH 7).
// Colours use phenolphthalein (colourless to pink above about pH 8.2) or methyl orange (red to yellow, 3.1 to 4.4).
import { canvas, text, title, line, dot, row, slider, choice, readout, rng, clamp, loop } from '../../kit.js';

const Va = 20, C = 0.1;
const pHat = (v) => { const nH = Va * C, nOH = v * C, tot = Va + v; const net = (nH - nOH) / tot / 1000 * 1000; /* mol/L * 1000 mL/L cancels; keep in mol/L */ const c = (nH - nOH) / tot; if (Math.abs(c) < 1e-9) return 7; return c > 0 ? -Math.log10(c + 0) : 14 + Math.log10(-c); };
export default function (host) {
  let v = 0, ind = 'php';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Titration of hydrochloric acid with sodium hydroxide: pH curve, flask colour and ions' });
  const ctl = row(host);
  slider(ctl, { label: 'NaOH added', min: 0, max: 40, step: 0.5, value: 0, fmt: (x) => `${x} mL`, oninput: (x) => { v = x; say(); } });
  choice(ctl, 'Indicator', [['php', 'Phenolphthalein'], ['mo', 'Methyl orange']], ind, (x) => { ind = x; say(); });
  const out = readout(host);
  loop(host, () => cv.redraw());
  const R = rng(9), pts = Array.from({ length: 40 }, () => [R(), R()]);
  function say() {
    const p = pHat(v);
    out.innerHTML = `${v} mL of NaOH added, pH <b>${p.toFixed(2)}</b>. ${v < 19.5 ? 'Acid left over: H⁺ ions are being used up by OH⁻ → H₂O.' : v < 20.5 ? '<b>Equivalence point:</b> exactly enough base to neutralise the acid. The solution is just NaCl in water, pH 7.' : 'Base in excess: the flask is now basic.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const p = pHat(v), top = title(ctx, 'HCl + NaOH → NaCl + H₂O', col) + 10;
    // graph
    const gx = 34, gy = top + 16, gw = w * 0.5, gh = h - gy - 40;
    line(ctx, [[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], col.line, 1.5);
    text(ctx, 'pH', gx + 6, gy - 8, { color: col.muted, size: 10 }); text(ctx, 'mL of NaOH added', gx + gw / 2, gy + gh + 24, { color: col.muted, size: 10, align: 'center' });
    [0, 7, 14].forEach((q) => text(ctx, String(q), gx - 6, gy + gh - (q / 14) * gh, { color: col.muted, size: 9.5, align: 'right' }));
    [0, 20, 40].forEach((q) => text(ctx, String(q), gx + (q / 40) * gw, gy + gh + 11, { color: col.muted, size: 9.5, align: 'center' }));
    const curve = []; for (let i = 0; i <= 160; i++) { const x = i / 4; if (x > v) break; curve.push([gx + (x / 40) * gw, gy + gh - (pHat(x) / 14) * gh]); }
    line(ctx, [[gx, gy + gh - (7 / 14) * gh], [gx + gw, gy + gh - (7 / 14) * gh]], col.line, 1, [3, 3]);
    line(ctx, curve, col.s[0], 2.5);
    dot(ctx, gx + (v / 40) * gw, gy + gh - (p / 14) * gh, 5, col.s[1]);
    // flask
    const fx = gx + gw + 24, fw = w - fx - 12, fy = gy + 20, fh = gh - 20;
    const colr = ind === 'php' ? `rgba(214,39,122,${clamp((p - 8.2) / 1.6, 0, 1) * 0.85})` : p < 3.1 ? 'rgba(216,53,42,0.8)' : p < 4.4 ? 'rgba(235,130,40,0.8)' : 'rgba(242,194,48,0.8)';
    ctx.fillStyle = col.soft; ctx.fillRect(fx, fy + fh * 0.35, fw, fh * 0.65); ctx.fillStyle = colr; ctx.fillRect(fx, fy + fh * 0.35, fw, fh * 0.65);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy + fh); ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(fx + fw, fy); ctx.stroke();
    // burette drip
    line(ctx, [[fx + fw / 2, gy - 2], [fx + fw / 2, fy - 6]], col.ink, 4);
    text(ctx, 'NaOH', fx + fw / 2, gy - 8, { color: col.muted, size: 9.5, align: 'center' });
    const nH = Math.max(0, (Va * C - v * C) / (Va + v) * 1), nO = Math.max(0, (v * C - Va * C) / (Va + v));
    const sH = Math.round(18 * clamp(nH / 0.1, 0, 1)), sO = Math.round(18 * clamp(nO / 0.0333, 0, 1));
    pts.forEach(([a, b], i) => { const x = fx + 6 + a * (fw - 12), y = fy + fh * 0.4 + b * (fh * 0.52); const j = Math.sin(performance.now() / 400 + i) * 1.5;
      if (i < sH) dot(ctx, x + j, y, 3.5, col.s[7]); else if (i >= 40 - sO) dot(ctx, x + j, y, 3.5, col.s[0]); else if (i < 28) dot(ctx, x + j, y, 3, col.s[2]); });
    text(ctx, 'red H⁺ · blue OH⁻', fx + fw / 2, fy + fh + 12, { color: col.muted, size: 9, align: 'center' });
    text(ctx, `flask: 20 mL 0.1 M HCl`, fx + fw / 2, fy + fh + 24, { color: col.muted, size: 9.5, align: 'center' });
  };
  say();
}
