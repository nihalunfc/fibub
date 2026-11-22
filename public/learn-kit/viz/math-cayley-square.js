// The symmetries of a square form a group of 8 moves (D₄): four turns (r⁰ = e, r, r², r³) and four flips. Press the
// buttons to apply r (turn 90°) or s (flip) to the labelled square. The name of the move you have made (the group
// element) appears, and the Cayley table lights up the product you just did. Notice r·s ≠ s·r: the group is not
// commutative, and every row and column of the table contains each element exactly once.
import { canvas, row, button, readout, loop, text, line, ease } from '../kit.js';

// a move is a permutation of the corner positions; corners 0..3 at TL, TR, BR, BL; p[i] = where the corner at position i goes
const comp = (a, b) => a.map((_, i) => b[a[i]]); // a then b
const R = [1, 2, 3, 0], S = [1, 0, 3, 2]; // r: turn 90° clockwise; s: flip left-right
const E = [0, 1, 2, 3];
const pw = (p, n) => { let q = E; for (let i = 0; i < n; i++) q = comp(q, p); return q; };
const ELS = [['e', E], ['r', pw(R, 1)], ['r²', pw(R, 2)], ['r³', pw(R, 3)], ['s', S], ['sr', comp(S, R)], ['sr²', comp(S, pw(R, 2))], ['sr³', comp(S, pw(R, 3))]];
const same = (a, b) => a.every((v, i) => v === b[i]);
const nameOf = (p) => ELS.find(([, q]) => same(p, q))[0];
export default function (host) {
  let cur = E, last = null, anim = null;
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 250, label: 'A labelled square, moves applied to it, and the Cayley table of D4' });
  const c = row(host);
  const apply = (nm, mv) => { const before = cur; cur = comp(cur, mv); last = [nameOf(before), nm]; anim = { from: before, to: cur, t: 0 }; re(); };
  button(c, 'Turn r (90°)', () => apply('r', R)); button(c, 'Flip s', () => apply('s', S)); button(c, 'Reset', () => { cur = E; last = null; anim = null; re(); });
  loop(host, (dt) => { if (!anim) return; anim.t += dt / 0.5; if (anim.t >= 1) anim = null; cv.redraw(); });
  const out = readout(host);
  function re() { cv.redraw(); out.innerHTML = last ? `You were at <b>${last[0]}</b>, applied <b>${last[1]}</b>: now the square is in position <b>${nameOf(cur)}</b>. Table: row "${last[1]} after" × column "${last[0]}" gives ${nameOf(cur)}. Try r then s, and s then r: you get different results (r s ≠ s r), so D₄ is non-abelian. Applying r four times returns to e.` : 'The square starts as the identity e. Apply moves with the buttons.'; }
  cv.draw = (ctx, w, h, col) => {
    const half = Math.min(w * 0.36, h * 0.3), cx = Math.min(w * 0.25, 110), cy = h / 2 + 4, q = anim ? anim.t : 1, e = ease(q);
    const pos = [[-1, -1], [1, -1], [1, 1], [-1, 1]]; // TL TR BR BL (screen y down)
    // corner labels follow the permutation: label i sits at position cur[i]; during animation interpolate
    const from = anim ? anim.from : cur, to = cur;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - half * 0.7, cy - half * 0.7, half * 1.4, half * 1.4);
    ['1', '2', '3', '4'].forEach((lab, i) => { const a = pos[from[i]], b = pos[to[i]], x = a[0] + (b[0] - a[0]) * e, y = a[1] + (b[1] - a[1]) * e; text(ctx, lab, cx + x * half * 0.55, cy + y * half * 0.55, { color: col.s[i], size: 18, weight: 700, align: 'center' }); });
    text(ctx, 'position: ' + nameOf(cur), cx, cy + half * 0.7 + 18, { color: col.ink, size: 12, weight: 700, align: 'center' });
    // Cayley table: entry (row b, col a) = a then b
    const tx = cx + half * 0.7 + 22, ty = 30, cell = Math.min((w - tx - 8) / 9, (h - ty - 8) / 9);
    ELS.forEach(([n], i) => { text(ctx, n, tx + (i + 1.5) * cell, ty + cell * 0.5, { color: col.muted, size: 9, align: 'center', fit: false }); text(ctx, n, tx + cell * 0.5, ty + (i + 1.5) * cell, { color: col.muted, size: 9, align: 'center', fit: false }); });
    ELS.forEach(([nb, pb], r) => ELS.forEach(([na, pa], k) => { const res = nameOf(comp(pa, pb)), hit = last && last[0] === na && last[1] === nb; if (hit) { ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.35; ctx.fillRect(tx + (k + 1) * cell, ty + (r + 1) * cell, cell, cell); ctx.globalAlpha = 1; } text(ctx, res, tx + (k + 1.5) * cell, ty + (r + 1.5) * cell, { color: res === 'e' ? col.s[2] : col.ink, size: 9, weight: res === 'e' ? 700 : 400, align: 'center', fit: false }); }));
    text(ctx, 'column a, then row b', tx, 14, { color: col.muted, size: 9.5 });
  };
  re();
}
