// Class 9 Diversity: a dichotomous key for eight common Indian leaves. A dichotomous key asks a series of yes/no
// questions about a visible feature; each answer sends you to the next question or to a name. Here the features are the
// vein pattern (parallel in monocots such as banana, coconut and grass; a net in most dicots), whether the leaf is simple or
// compound, thorns, shape and smell. Use Identify to answer the questions for a leaf you imagine, or Trace to pick a leaf
// and watch the path the key takes to it.
import { canvas, text, title, dot, line, row, choice, button, readout } from '../../kit.js';

const Q = {
  1: ['Do the veins run side by side, in parallel?', 2, 4],
  2: ['Is the leaf divided into many narrow leaflets along a long central stalk?', 'coconut', 3],
  3: ['Is the blade very large and broad, like a long plate?', 'banana', 'grass'],
  4: ['Is the leaf made of separate leaflets on a common stalk (compound)?', 5, 6],
  5: ['Does the stem carry thorns (prickles)?', 'rose', 'neem'],
  6: ['Is the leaf heart-shaped with a long thin tip?', 'peepal', 7],
  7: ['Is the leaf small (under 6 cm) and strongly scented when crushed?', 'tulsi', 'mango'],
};
const LEAF = { coconut: 'Coconut', banana: 'Banana', grass: 'Grass', rose: 'Rose', neem: 'Neem', peepal: 'Peepal', tulsi: 'Tulsi', mango: 'Mango' };
const WHY = { coconut: 'Parallel veins and a compound (pinnate) leaf with long narrow leaflets.', banana: 'Parallel veins and one huge, undivided blade.', grass: 'Parallel veins, a narrow undivided blade.', rose: 'Net veins, a compound leaf of a few leaflets, and thorns on the stem.', neem: 'Net veins and a compound leaf of many toothed leaflets, no thorns.', peepal: 'Net veins, a simple leaf shaped like a heart with a long tip.', tulsi: 'Net veins, a small simple leaf that smells strongly when crushed.', mango: 'Net veins, a simple long, leathery blade, not strongly scented.' };
const pathTo = (leaf) => { const dfs = (n, p) => { const [, y, no] = Q[n]; for (const [a, ans] of [[y, 'yes'], [no, 'no']]) { const np = [...p, [n, ans]]; if (a === leaf) return np; if (typeof a === 'number') { const r = dfs(a, np); if (r) return r; } } return null; }; return dfs(1, []); };

export default function (host) {
  let mode = 'id', node = 1, hist = [], res = null, pick = 'peepal';
  const cv = canvas(host, { aspect: 1.05, max: 470, min: 360, label: 'A dichotomous key leading to the name of an Indian leaf' });
  const mrow = row(host);
  choice(mrow, 'Mode', [['id', 'Identify'], ['trace', 'Trace a leaf']], mode, (v) => { mode = v; reset(); });
  const arow = row(host);
  const yes = button(arow, 'Yes', () => ans('yes')), no = button(arow, 'No', () => ans('no')), rs = button(arow, '↺ Start again', () => reset());
  const prow = row(host);
  choice(prow, 'Leaf', Object.entries(LEAF).map(([k, v]) => [k, v]), pick, (v) => { pick = v; reset(); });
  const out = readout(host);
  function ans(a) { if (res) return; const nxt = Q[node][a === 'yes' ? 1 : 2]; hist.push([node, a]); if (typeof nxt === 'number') node = nxt; else res = nxt; upd(); }
  function reset() { node = 1; hist = []; res = null; if (mode === 'trace') { hist = pathTo(pick); res = pick; } upd(); }
  function upd() {
    arow.style.display = mode === 'id' ? '' : 'none'; prow.style.display = mode === 'trace' ? '' : 'none';
    out.textContent = res ? `${LEAF[res]}: ${WHY[res]}` : 'Look at the leaf you have in mind and answer the question.'; cv.redraw();
  }
  const leaf = (ctx, k, cx, cy, s, col) => {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); const g = col.s[2], d = col.panel; ctx.fillStyle = g; ctx.strokeStyle = d; ctx.lineWidth = 1.3; ctx.lineCap = 'round';
    const L = (a, b, c2, e) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c2, e); ctx.stroke(); };
    if (k === 'banana') { ctx.beginPath(); ctx.ellipse(0, 0, 54, 24, -0.15, 0, 7); ctx.fill(); L(-52, 8, 52, -8); for (let i = -4; i <= 4; i++) { L(i * 11, i * -1.2 + 2, i * 11 + 8, -20 + i * -1.2); L(i * 11, i * -1.2 + 2, i * 11 + 8, 22 + i * -1.2); } }
    if (k === 'coconut') { ctx.strokeStyle = col.s[4]; ctx.lineWidth = 3; L(-60, 10, 60, -10); ctx.strokeStyle = g; ctx.lineWidth = 3; for (let i = 0; i < 11; i++) { const x = -52 + i * 10, y = 8 - i * 1.6; L(x, y, x + 8, y - 24); L(x, y, x + 8, y + 22); } }
    if (k === 'grass') { ctx.beginPath(); ctx.moveTo(-64, 12); ctx.quadraticCurveTo(0, -30, 64, -22); ctx.quadraticCurveTo(0, -14, -64, 14); ctx.fill(); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(-60, 13 + i); ctx.quadraticCurveTo(0, -22 + i * 3, 60, -21 + i); ctx.stroke(); } }
    if (k === 'rose') { ctx.strokeStyle = col.s[4]; ctx.lineWidth = 3; L(-58, 12, 56, -10); line(ctx, [[-30, 7], [-36, 20]], col.bad, 3); line(ctx, [[10, 0], [4, 12]], col.bad, 3); [[-30, 14], [-6, 8], [24, -2], [56, -14]].forEach(([x, y], i) => { ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y - 14, 10, 15, 0.5, 0, 7); ctx.fill(); if (i < 3) { ctx.beginPath(); ctx.ellipse(x, y + 14, 10, 15, -0.5, 0, 7); ctx.fill(); } }); }
    if (k === 'neem') { ctx.strokeStyle = col.s[4]; ctx.lineWidth = 3; L(-62, 12, 60, -10); for (let i = 0; i < 6; i++) { const x = -44 + i * 18, y = 8 - i * 3.4; ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x + 4, y - 15, 7, 15, 0.4, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(x - 4, y + 15, 7, 15, -0.4, 0, 7); ctx.fill(); } }
    if (k === 'peepal') { ctx.beginPath(); ctx.moveTo(0, -34); ctx.bezierCurveTo(-58, -50, -52, 28, 0, 20); ctx.bezierCurveTo(52, 28, 58, -50, 0, -34); ctx.fill(); ctx.beginPath(); ctx.moveTo(0, 18); ctx.quadraticCurveTo(-6, 50, 2, 72); ctx.quadraticCurveTo(8, 50, 0, 18); ctx.fill(); L(0, -30, 0, 60); for (let i = 0; i < 4; i++) { L(0, -22 + i * 11, -30 + i * 5, -26 + i * 12); L(0, -22 + i * 11, 30 - i * 5, -26 + i * 12); } }
    if (k === 'tulsi') { ctx.beginPath(); ctx.ellipse(0, 0, 28, 20, 0, 0, 7); ctx.fill(); L(-26, 0, 26, 0); for (let i = -2; i <= 2; i++) { L(i * 9, 0, i * 9 + 5, -15); L(i * 9, 0, i * 9 + 5, 15); } ctx.fillStyle = col.s[3]; [-20, 0, 20].forEach((x, i) => dot(ctx, x, -34 - (i % 2) * 6, 2, col.s[3])); }
    if (k === 'mango') { ctx.beginPath(); ctx.moveTo(-60, 4); ctx.quadraticCurveTo(0, -34, 62, -2); ctx.quadraticCurveTo(0, 34, -60, 4); ctx.fill(); L(-58, 4, 60, -1); for (let i = -4; i <= 4; i++) { L(i * 12, 1, i * 12 + 8, -13 + Math.abs(i)); L(i * 12, 1, i * 12 + 8, 13 - Math.abs(i)); } }
    ctx.restore();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'id' ? 'Key to eight Indian leaves' : `Path of the key to: ${LEAF[pick]}`, col);
    // history rows
    let y = 44; ctx.font = '10.5px system-ui';
    const wrap = (s, max) => { const out2 = []; let cur = ''; s.split(' ').forEach((wd) => { const t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > max) { out2.push(cur); cur = wd; } else cur = t; }); out2.push(cur); return out2; };
    hist.forEach(([n, a], i) => { const ls = wrap(`${i + 1}. ${Q[n][0]}`, w - 90); ls.forEach((l, k) => text(ctx, l, 12, y + k * 13, { color: col.ink, size: 10.5 })); const mid = y + (ls.length - 1) * 6.5; ctx.beginPath(); ctx.roundRect(w - 64, mid - 9, 52, 18, 9); ctx.fillStyle = a === 'yes' ? col.good : col.bad; ctx.fill(); text(ctx, a.toUpperCase(), w - 38, mid, { color: '#fff', size: 10.5, weight: 700, align: 'center' }); y += ls.length * 13 + 8; });
    if (!res) {
      ctx.beginPath(); ctx.roundRect(8, y - 2, w - 16, 62, 10); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, `Question ${hist.length + 1}`, 18, y + 10, { color: col.s[1], size: 10.5, weight: 700 });
      wrap(Q[node][0], w - 40).forEach((l, k) => text(ctx, l, 18, y + 28 + k * 15, { color: col.ink, size: 12.5, weight: 700 }));
    } else {
      const sc = Math.min(1.1, (w - 40) / 160); leaf(ctx, res, w / 2, Math.min(h - 70, y + 70), sc, col);
      text(ctx, LEAF[res], w / 2, Math.min(h - 70, y + 70) + 80 * sc + 2, { color: col.s[1], size: 15, weight: 700, align: 'center' });
    }
  };
  reset();
}
