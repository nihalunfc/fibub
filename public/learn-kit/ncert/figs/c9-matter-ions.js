// Class 9 Atomic Foundations of Matter: ions and ionic bonding. Play: a sodium atom (2, 8, 1) gives its outer electron to a chlorine
// atom (2, 8, 7). Sodium becomes Na+ (2, 8) and chlorine becomes Cl- (2, 8, 8), both with a full outer shell. Opposite
// charges attract and hold the ions together. A solid is a crystal lattice of many Na+ and Cl-, in a 1 : 1 ratio,
// so NaCl is a formula unit, not a molecule.
import { canvas, text, title, dot, row, button, choice, readout, loop, ease } from '../../kit.js';

export default function (host) {
  let f = 0, go = false, view = 'atoms';
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 300, label: 'A sodium atom giving an electron to a chlorine atom to make Na plus and Cl minus and then a crystal' });
  const ctl = row(host);
  choice(ctl, 'View', [['atoms', 'Electron transfer'], ['lattice', 'Crystal']], view, (v) => { view = v; upd(); });
  button(ctl, '▶ Transfer', () => { view = 'atoms'; f = 0; go = true; upd(); });
  const out = readout(host);
  function upd() { out.innerHTML = view === 'lattice' ? 'In solid salt each Na⁺ is surrounded by Cl⁻ and each Cl⁻ by Na⁺. Ratio 1 : 1, so the formula is NaCl, the smallest repeating ratio (the “formula unit”).' : (f >= 1 ? 'Na⁺ (2, 8) and Cl⁻ (2, 8, 8): full outer shells, opposite charges, so they attract. Total charge +1 − 1 = 0.' : 'Na has 1 outer electron, Cl has 7. Na gives its one electron to Cl.'); cv.redraw(); }
  loop(host, (dt) => { if (go) { f += dt * 0.4; if (f >= 1) { f = 1; go = false; upd(); } cv.redraw(); } });
  const atom = (ctx, col, x, y, r, sh, nm, c, chg, moved) => {
    sh.forEach((n, i) => { const rr = r * (0.36 + i * 0.32); ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke(); for (let k = 0; k < n; k++) { if (moved && i === sh.length - 1 && k === 0 && nm === 'Na') continue; const a = (k / n) * 6.283 + i; dot(ctx, x + Math.cos(a) * rr, y + Math.sin(a) * rr, 2.6, col.s[2]); } });
    dot(ctx, x, y, r * 0.2, c); text(ctx, nm + chg, x, y + r + 14, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  cv.draw = (ctx, w, h, col) => {
    if (view === 'lattice') {
      title(ctx, 'Sodium chloride crystal (a slice)', col);
      const n = 5, s = Math.min(46, (w - 40) / n); const x0 = (w - s * (n - 1)) / 2, y0 = 62;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const pos = (i + j) % 2 === 0; dot(ctx, x0 + i * s, y0 + j * s, pos ? s * 0.22 : s * 0.34, pos ? col.s[1] : col.s[0]); text(ctx, pos ? '+' : '−', x0 + i * s, y0 + j * s, { color: col.panel, size: 12, weight: 700, align: 'center', fit: false }); }
      text(ctx, 'small = Na⁺ · large = Cl⁻', w / 2, y0 + (n - 1) * s + 30, { color: col.muted, size: 11, align: 'center' });
      text(ctx, 'ratio 1 : 1, so NaCl', w / 2, h - 12, { color: col.s[2], size: 13, weight: 700, align: 'center' });
      return;
    }
    title(ctx, f >= 1 ? 'Na⁺ and Cl⁻: ions with full shells' : 'Sodium gives an electron to chlorine', col);
    const e = ease(f), cy = h * 0.46, xa = w * 0.27 + e * 14, xb = w * 0.73 - e * 14, R = Math.min(w * 0.2, 80);
    atom(ctx, col, xa, cy, R, [2, 8, f >= 1 ? 0 : 1], 'Na', col.s[3], f >= 1 ? '⁺' : '', true);
    atom(ctx, col, xb, cy, R, [2, 8, f >= 1 ? 8 : 7], 'Cl', col.s[6], f >= 1 ? '⁻' : '', false);
    if (f < 1) dot(ctx, xa + R * 0.68 + (xb - R * 0.97 - xa - R * 0.68) * e, cy - 6 * Math.sin(e * 3.14) * 3 + 0, 3.2, col.s[4]);
    text(ctx, f >= 1 ? 'transferred: Na⁺ 2,8 · Cl⁻ 2,8,8' : 'Na: 2, 8, 1 · Cl: 2, 8, 7', w / 2, h - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  upd();
}
