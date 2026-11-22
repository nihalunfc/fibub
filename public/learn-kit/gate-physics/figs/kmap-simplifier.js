// 9.5 K-map simplifier. A 4-variable Karnaugh map (rows AB, columns CD, both in Gray order). Tap a cell to cycle
// 0 → 1 → X (don't care) → 0. The figure lists every prime implicant, marks the essential ones, and shades the groups of
// a minimal sum of products (fewest terms, then fewest literals), found by checking every cube.
import { canvas, row, button, choice, readout, text, title, rng } from '../../kit.js';

const GRAY = [0, 1, 3, 2];
function minimise(ones, dc) {
  const on = new Set(ones), care = new Set([...ones, ...dc]), cubes = [];
  for (let mask = 0; mask < 16; mask++) for (let v = 0; v < 16; v++) {
    if ((v & ~mask) !== 0) continue;
    let all = true; const cov = [];
    for (let m = 0; m < 16; m++) if ((m & mask) === v) { if (!care.has(m)) { all = false; break; } cov.push(m); }
    if (all && cov.some((m) => on.has(m))) cubes.push({ mask, v, cov });
  }
  const primes = cubes.filter((c) => !cubes.some((d) => d !== c && d.cov.length > c.cov.length && c.cov.every((m) => d.cov.includes(m))));
  const ess = primes.filter((p) => p.cov.some((m) => on.has(m) && primes.filter((q) => q.cov.includes(m)).length === 1));
  const lits = (c) => [0, 1, 2, 3].filter((i) => (c.mask >> i) & 1).length;
  let best = null;
  for (let k = 0; k <= primes.length && !best; k++) {
    const rec = (s, ch) => {
      if (ch.length === k) { const cov = new Set(ch.flatMap((c) => c.cov)); if (ones.every((m) => cov.has(m))) { const L = ch.reduce((a, c) => a + lits(c), 0); if (!best || L < best.L) best = { t: ch.slice(), L }; } return; }
      for (let i = s; i < primes.length; i++) { ch.push(primes[i]); rec(i + 1, ch); ch.pop(); }
    };
    rec(0, []);
  }
  return { primes, ess, min: best ? best.t : [] };
}
const name = (c) => { let s = ''; for (let i = 0; i < 4; i++) { const b = 3 - i; if ((c.mask >> b) & 1) s += 'ABCD'[i] + (((c.v >> b) & 1) ? '' : '′'); } return s || '1'; };

export default function (host) {
  const cv = canvas(host, { aspect: 0.82, max: 470, min: 320, label: 'A four-variable Karnaugh map; tap cells to set ones and don\'t-cares and see the minimal sum of products' });
  const cell = new Array(16).fill(0); // 0, 1, 2 = don't care
  [0, 2, 5, 7, 8, 10, 13, 15].forEach((m) => { cell[m] = 1; });
  let show = 'min', geo = null;
  const ctl = row(host), out = readout(host);
  const r = rng(7);
  const re = () => { cv.redraw(); report(); };
  choice(ctl, 'Show', [['min', 'Minimal cover'], ['primes', 'All prime implicants']], show, (v) => { show = v; re(); });
  button(ctl, 'Clear', () => { cell.fill(0); re(); });
  button(ctl, 'Random', () => { for (let m = 0; m < 16; m++) { const x = r(); cell[m] = x < 0.42 ? 1 : x < 0.52 ? 2 : 0; } re(); });
  const solve = () => minimise([...Array(16).keys()].filter((m) => cell[m] === 1), [...Array(16).keys()].filter((m) => cell[m] === 2));
  const report = () => {
    const ones = [...Array(16).keys()].filter((m) => cell[m] === 1), dc = [...Array(16).keys()].filter((m) => cell[m] === 2);
    if (!ones.length) { out.innerHTML = 'F = 0. Tap cells to add ones (tap again for a don\'t-care).'; return; }
    const s = solve(), essN = new Set(s.ess.map(name));
    out.innerHTML = `F = Σm(${ones.join(', ')})${dc.length ? ` + d(${dc.join(', ')})` : ''}.<br>Minimal SOP: <b>F = ${s.min.map(name).join(' + ')}</b> (${s.min.length} term${s.min.length > 1 ? 's' : ''}).<br>Prime implicants (${s.primes.length}): ${s.primes.map((p) => (essN.has(name(p)) ? `<b>${name(p)}</b>` : name(p))).join(', ')}${s.ess.length ? ' (essential in bold)' : '; none is essential (a cyclic map)'}.`;
  };
  // cell m sits at row GRAY.indexOf(m >> 2) (AB), column GRAY.indexOf(m & 3) (CD)
  const pos = (m) => [GRAY.indexOf(m & 3), GRAY.indexOf(m >> 2)];
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Tap a cell: 0 → 1 → X → 0', col);
    const size = Math.min((W - 70) / 4, (H - 70) / 4), x0 = (W - 4 * size) / 2 + 14, y0 = 46;
    geo = { x0, y0, size };
    text(ctx, 'CD →', x0 - 34, y0 - 14, { color: col.muted, size: 11 });
    text(ctx, 'AB ↓', x0 - 40, y0 + 6, { color: col.muted, size: 11 });
    GRAY.forEach((g, i) => {
      text(ctx, g.toString(2).padStart(2, '0'), x0 + i * size + size / 2, y0 - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, g.toString(2).padStart(2, '0'), x0 - 16, y0 + i * size + size / 2, { color: col.ink, size: 12, weight: 700, align: 'center' });
    });
    const s = cell.some((v) => v === 1) ? solve() : { min: [], primes: [] };
    const groups = show === 'min' ? s.min : s.primes;
    groups.forEach((g, gi) => {
      const c = col.s[gi % 8], inset = 3 + (gi % 5) * 3;
      ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = c;
      g.cov.forEach((m) => { const [cx, cy] = pos(m); ctx.fillRect(x0 + cx * size, y0 + cy * size, size, size); });
      ctx.restore();
      ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2.2;
      g.cov.forEach((m) => {
        const [cx, cy] = pos(m), X = x0 + cx * size, Y = y0 + cy * size;
        const has = (dx, dy) => g.cov.some((n) => { const [a, b] = pos(n); return a === cx + dx && b === cy + dy; });
        ctx.beginPath();
        if (!has(0, -1)) { ctx.moveTo(X + inset, Y + inset); ctx.lineTo(X + size - inset, Y + inset); }
        if (!has(0, 1)) { ctx.moveTo(X + inset, Y + size - inset); ctx.lineTo(X + size - inset, Y + size - inset); }
        if (!has(-1, 0)) { ctx.moveTo(X + inset, Y + inset); ctx.lineTo(X + inset, Y + size - inset); }
        if (!has(1, 0)) { ctx.moveTo(X + size - inset, Y + inset); ctx.lineTo(X + size - inset, Y + size - inset); }
        ctx.stroke();
      });
      ctx.restore();
    });
    ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(x0, y0 + i * size); ctx.lineTo(x0 + 4 * size, y0 + i * size); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x0 + i * size, y0); ctx.lineTo(x0 + i * size, y0 + 4 * size); ctx.stroke(); }
    ctx.restore();
    for (let m = 0; m < 16; m++) {
      const [cx, cy] = pos(m), X = x0 + cx * size + size / 2, Y = y0 + cy * size + size / 2;
      text(ctx, cell[m] === 1 ? '1' : cell[m] === 2 ? 'X' : '0', X, Y, { color: cell[m] ? col.ink : col.muted, size: Math.max(14, size * 0.3), weight: cell[m] ? 700 : 400, align: 'center' });
      text(ctx, String(m), X + size / 2 - 5, Y + size / 2 - 8, { color: col.muted, size: 9.5, align: 'right' });
    }
  };
  cv.c.addEventListener('click', (e) => {
    if (!geo) return;
    const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    const cx = Math.floor((x - geo.x0) / geo.size), cy = Math.floor((y - geo.y0) / geo.size);
    if (cx < 0 || cx > 3 || cy < 0 || cy > 3) return;
    const m = (GRAY[cy] << 2) | GRAY[cx];
    cell[m] = (cell[m] + 1) % 3; re();
  });
  cv.c.style.cursor = 'pointer';
  re();
}
