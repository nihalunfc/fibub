// Class 10 Acids, Bases and Salts: diluting an acid or a base. Adding water does not remove H+ (or OH-); it spreads
// the same ions through more water, so the concentration falls and pH moves toward 7 but never crosses it.
// Strong acid 0.1 mol/L (pH 1): pH = -log10(c + 1e-7) so water's own H+ stops it going past 7.
import { canvas, text, title, row, slider, choice, readout, rng, lerp } from '../../kit.js';

export default function (host) {
  let kind = 'acid', k = 0; // k = log10 of the dilution factor
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'A beaker where water is added to an acid or base and the ions spread out' });
  const ctl = row(host);
  choice(ctl, 'Start with', [['acid', '0.1 M HCl (pH 1)'], ['base', '0.1 M NaOH (pH 13)']], kind, (v) => { kind = v; say(); });
  slider(ctl, { label: 'Dilute by', min: 0, max: 8, step: 0.1, value: 0, fmt: (v) => `${Math.round(Math.pow(10, v)).toLocaleString('en-IN')} ×`, oninput: (v) => { k = v; say(); } });
  const out = readout(host);
  const pHnow = () => { const c = 0.1 / Math.pow(10, k); const hp = kind === 'acid' ? c + 1e-7 : 1e-14 / (c + 1e-7) + 0; return kind === 'acid' ? -Math.log10(hp) : 14 + Math.log10(c + 1e-7); };
  function say() {
    const p = pHnow();
    out.innerHTML = `Diluted ${Math.round(Math.pow(10, k)).toLocaleString('en-IN')} times: concentration ${(0.1 / Math.pow(10, k)).toExponential(1).replace('e-', ' × 10<sup>−') + '</sup>'} mol/L, so <b>pH = ${p.toFixed(2)}</b>. ${k >= 7 ? 'At extreme dilution you only have water: pH 7. An acid never becomes a base by dilution.' : 'Each 10× dilution moves the pH one step toward 7.'} <br><i>Safety: always add acid to water slowly, never water to concentrated acid: dissolving makes a lot of heat.</i>`;
    cv.redraw();
  }
  const R = rng(5), pts = Array.from({ length: 30 }, () => [R(), R()]);
  const STOPS = [[0, [214, 34, 40]], [2, [238, 90, 40]], [4, [244, 170, 50]], [5.5, [236, 220, 70]], [7, [80, 180, 90]], [8.5, [40, 160, 150]], [10, [50, 110, 190]], [12, [80, 60, 170]], [14, [100, 30, 130]]];
  const INK = (p) => { for (let i = 1; i < STOPS.length; i++) if (p <= STOPS[i][0]) { const [a, A] = STOPS[i - 1], [b, B] = STOPS[i], f = (p - a) / (b - a); return `rgb(${A.map((v, q) => Math.round(v + (B[q] - v) * f)).join(',')})`; } return 'rgb(100,30,130)'; };
  cv.draw = (ctx, w, h, col) => {
    const p = pHnow(), top = title(ctx, `pH ${p.toFixed(2)}`, col) + 10;
    const area = 1 + Math.min(k, 4) * 0.9, bw = Math.min(w * 0.55, 70 + 40 * Math.min(k, 3)), bx = w * 0.3 - bw / 2 + 10, bt = top + 14, bh = h - bt - 26;
    const lvl = lerp(0.55, 0.12, Math.min(k, 4) / 4);
    ctx.fillStyle = INK(p); ctx.globalAlpha = 0.35; ctx.fillRect(bx, bt + bh * lvl, bw, bh * (1 - lvl)); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, bt); ctx.lineTo(bx, bt + bh); ctx.lineTo(bx + bw, bt + bh); ctx.lineTo(bx + bw, bt); ctx.stroke();
    pts.forEach(([a, b]) => { const x = bx + 8 + a * (bw - 16), y = bt + bh * lvl + 8 + b * (bh * (1 - lvl) - 16); const c = kind === 'acid' ? col.s[7] : col.s[0]; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); text(ctx, kind === 'acid' ? '+' : '−', x, y, { color: '#fff', size: 8, weight: 700, align: 'center', fit: false }); });
    text(ctx, `same ${pts.length} ${kind === 'acid' ? 'H⁺' : 'OH⁻'} in more water`, bx + bw / 2, bt + bh + 13, { color: col.muted, size: 10, align: 'center' });
    // pH number line on the right
    const lx = w - 44, ly0 = bt, ly1 = bt + bh;
    for (let i = 0; i < ly1 - ly0; i++) { ctx.fillStyle = INK(14 - (i / (ly1 - ly0)) * 14); ctx.fillRect(lx - 7, ly0 + i, 14, 1.4); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(lx - 7, ly0, 14, ly1 - ly0);
    [0, 7, 14].forEach((v) => text(ctx, String(v), lx + 12, ly1 - (v / 14) * (ly1 - ly0), { color: col.muted, size: 10 }));
    const my = ly1 - (p / 14) * (ly1 - ly0); ctx.beginPath(); ctx.moveTo(lx - 9, my); ctx.lineTo(lx - 19, my - 5); ctx.lineTo(lx - 19, my + 5); ctx.fillStyle = col.ink; ctx.fill();
  };
  say();
}
