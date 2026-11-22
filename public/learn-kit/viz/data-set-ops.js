// UNION, UNION ALL, INTERSECT and EXCEPT on two lists of customer ids (from two stores). Duplicates are the whole point:
// UNION removes them, UNION ALL keeps every row. Try: add a customer to either list by tapping a number, and compare.
import { canvas, text, row, choice, readout, title } from '../kit.js';

export default function (host) {
  let op = 'UNION', A = [1, 2, 2, 3], B = [2, 3, 3, 4];
  const cv = canvas(host, { aspect: 0.8, max: 420, min: 300, label: 'Two id lists and the result of a set operation' });
  const c1 = row(host); choice(c1, 'Operation', ['UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT'].map((v) => [v, v]), op, (v) => { op = v; draw(); });
  const c2 = row(host); choice(c2, 'Add id to', [['A', 'A (store 1)'], ['B', 'B (store 2)']], 'A', (v) => { tgt = v; });
  let tgt = 'A';
  [1, 2, 3, 4, 5].forEach((n) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'lk-btn'; b.textContent = '+' + n; b.onclick = () => { (tgt === 'A' ? A : B).push(n); draw(); }; c2.appendChild(b); });
  const rs = document.createElement('button'); rs.type = 'button'; rs.className = 'lk-btn'; rs.textContent = 'Reset'; rs.onclick = () => { A = [1, 2, 2, 3]; B = [2, 3, 3, 4]; draw(); }; c2.appendChild(rs);
  const out = readout(host);
  const uniq = (x) => [...new Set(x)];
  const calc = () => ({ UNION: uniq([...A, ...B]), 'UNION ALL': [...A, ...B], INTERSECT: uniq(A).filter((x) => B.includes(x)), EXCEPT: uniq(A).filter((x) => !B.includes(x)) }[op]);
  function draw() { const r = calc(); out.innerHTML = `<b>A ${op} B</b> returns <b>${r.length}</b> row(s): ${r.join(', ') || 'none'}. ${{ UNION: 'Rows from both, duplicates removed.', 'UNION ALL': 'Every row from both, nothing removed (faster).', INTERSECT: 'Only values present in both.', EXCEPT: 'Values in A that are not in B (order matters).' }[op]}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `A ${op} B`, col);
    const chips = (list, y, c, nm, inRes) => { text(ctx, nm, 10, y - 4, { color: col.muted, size: 11 }); list.forEach((v, i) => { const x = 10 + (i % 12) * 28, yy = y + 6 + Math.floor(i / 12) * 26; const keep = inRes ? inRes(v, i) : true; ctx.globalAlpha = keep ? 1 : 0.35; ctx.fillStyle = c; ctx.fillRect(x, yy, 24, 20); text(ctx, String(v), x + 12, yy + 10, { color: '#fff', size: 12, weight: 700, align: 'center', fit: false }); }); ctx.globalAlpha = 1; };
    chips(A, 52, col.s[0], 'A (store 1)'); chips(B, 124, col.s[1], 'B (store 2)');
    const r = calc(); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(10, 190); ctx.lineTo(w - 10, 190); ctx.stroke();
    chips(r, 212, col.s[2], `result: ${r.length} row(s)`);
  };
  draw();
}
