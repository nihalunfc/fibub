// Class 9 Mixtures: what is a mixture? Particle pictures of an element (one kind of atom), a compound (one kind of
// molecule made of different atoms, fixed ratio), a homogeneous mixture (different particles evenly mixed, e.g. salt
// solution, air) and a heterogeneous mixture (visibly different parts, e.g. sand in water, salad). Pure substances
// have a fixed composition and fixed melting and boiling points; mixtures can have any proportion and melt or boil
// over a range. The checklist ticks the key tests for each type.
import { canvas, text, title, dot, line, row, choice, loop, rng } from '../../kit.js';

const K = {
  el: ['Element (pure)', 'Only one kind of atom: copper, oxygen, gold.', [1, 1, 0]],
  co: ['Compound (pure)', 'Different atoms joined in a fixed ratio: water H₂O, CO₂, salt.', [1, 1, 0]],
  ho: ['Homogeneous mixture', 'Different substances evenly mixed: you cannot see the parts (salt water, air, brass).', [0, 0, 1]],
  he: ['Heterogeneous mixture', 'You can see or separate the parts: sand and water, oil and water, salad.', [0, 0, 1]],
};
export default function (host) {
  let k = 'el', t = 0, R = rng(4), P = [];
  for (let i = 0; i < 40; i++) P.push({ x: R(), y: R(), a: R() * 6.28, r: R() });
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'Particle pictures of an element, a compound, a homogeneous mixture and a heterogeneous mixture' });
  const ctl = row(host);
  choice(ctl, 'Material', [['el', 'Element'], ['co', 'Compound'], ['ho', 'Solution'], ['he', 'Sand + water']], k, (v) => { k = v; cv.redraw(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const wrap = (ctx, s, w) => { ctx.font = '11px system-ui'; const L = []; let c = ''; s.split(' ').forEach((x) => { if (ctx.measureText((c + ' ' + x).trim()).width > w && c) { L.push(c); c = x; } else c = (c + ' ' + x).trim(); }); L.push(c); return L; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, K[k][0], col);
    const X = 12, Y = 40, W = w - 24, H = h * 0.42;
    ctx.fillStyle = k === 'ho' || k === 'he' ? col.soft : col.panel; ctx.fillRect(X, Y, W, H); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(X, Y, W, H);
    const px = (p, j) => [X + 10 + ((p.x + Math.sin(t * 1.3 + p.a + j) * 0.03 + 1) % 1) * (W - 20), Y + 10 + ((p.y + Math.cos(t * 1.1 + p.a) * 0.03 + 1) % 1) * (H - 20)];
    P.forEach((p, i) => {
      let [x, y] = px(p, 0);
      if (k === 'el') dot(ctx, x, y, 6, col.s[0]);
      else if (k === 'co') { dot(ctx, x, y, 6, col.s[0]); dot(ctx, x + 8, y + 5, 4, col.s[1]); dot(ctx, x - 7, y + 5, 4, col.s[1]); }
      else if (k === 'ho') { if (i % 3 === 0) { dot(ctx, x, y, 6, col.s[0]); dot(ctx, x + 8, y + 4, 4, col.s[1]); } else if (i % 3 === 1) dot(ctx, x, y, 5, col.s[3]); else dot(ctx, x, y, 3.2, col.s[4]); }
      else { if (i < 16) { x = X + 10 + (p.x * 0.9) * (W - 20); y = Y + H - 12 - p.y * H * 0.28; dot(ctx, x, y, 7, col.s[2], col.ink); } else { dot(ctx, x, Y + 10 + p.y * (H - 40) * 0.8 + 6, 3, col.s[4]); } }
    });
    if (k === 'he') text(ctx, 'sand settles', X + 8, Y + H - 8, { color: col.ink, size: 10, weight: 700, halo: col.soft });
    let y = Y + H + 20; wrap(ctx, K[k][1], W).forEach((l) => { text(ctx, l, X, y, { color: col.ink, size: 11 }); y += 15; });
    y += 4; const tests = [['Fixed composition and fixed melting / boiling point', 0], ['Cannot be split by physical methods', 1], ['Composition can vary; parts keep their own properties', 2]];
    tests.forEach(([s, i]) => { const yes = K[k][2][i]; text(ctx, (yes ? '✓ ' : '✗ ') + s, X, y, { color: yes ? col.good : col.muted, size: 10.5, weight: yes ? 700 : 400 }); y += 16; });
  };
  cv.redraw();
}
