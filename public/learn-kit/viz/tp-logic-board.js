// Ordering board for seating and logic games. Five people go in five seats in a row. Tap a person, then a seat. The rules
// tick green or red as you place people, and the counter shows how many of all possible orders still obey every rule and
// every placement so far; when it reaches 1 the rest of the board is forced. Try puzzle 2 once you can finish puzzle 1.
import { canvas, row, choice, button, readout, text, title } from '../kit.js';

const PZ = [
  { name: 'Puzzle 1', p: ['P', 'Q', 'R', 'S', 'T'], rules: [['P is not in either end seat', (s) => s.P !== 1 && s.P !== 5], ['Q sits right next to R', (s) => Math.abs(s.Q - s.R) === 1], ['S sits somewhere to the left of T', (s) => s.S < s.T], ['R is not in seat 1', (s) => s.R !== 1]] },
  { name: 'Puzzle 2', p: ['A', 'B', 'C', 'D', 'E'], rules: [['A is left of B', (s) => s.A < s.B], ['C and D are not neighbours', (s) => Math.abs(s.C - s.D) !== 1], ['E is in seat 2 or seat 4', (s) => s.E === 2 || s.E === 4], ['B is next to E', (s) => Math.abs(s.B - s.E) === 1]] },
];
const perms = (a) => (a.length < 2 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((r) => [x, ...r])));
export default function (host) {
  let z = 0, seat = [0, 0, 0, 0, 0].map(() => null), sel = null;
  const cv = canvas(host, { aspect: 0.8, max: 340, min: 300, label: 'Five seats in a row, five people and the rules' });
  const c0 = row(host); choice(c0, 'Game', PZ.map((x, i) => [i, x.name]), 0, (v) => { z = v; seat = seat.map(() => null); sel = null; cv.redraw(); show(); });
  const c = row(host); button(c, 'Clear board', () => { seat = seat.map(() => null); sel = null; cv.redraw(); show(); });
  const out = readout(host), hits = [];
  const all = () => perms(PZ[z].p).map((o) => Object.fromEntries(o.map((x, i) => [x, i + 1])));
  const pos = () => { const o = {}; seat.forEach((x, i) => { if (x) o[x] = i + 1; }); return o; };
  const left = () => { const q = pos(); return all().filter((s) => Object.entries(q).every(([k, v]) => s[k] === v) && PZ[z].rules.every((r) => r[1](s))); };
  const show = () => { const n = left().length, placed = seat.filter((x) => x).length; out.innerHTML = n === 0 ? '<b>0 orders left.</b> Something you placed breaks a rule; tap a placed person to take them back.' : `<b>${n}</b> of 120 possible orders still obey all rules and your placements. ${n === 1 ? 'Only one is left: the board is forced.' : placed === 5 ? '' : 'Place a person that cuts this number the most.'}`; };
  cv.c.addEventListener('click', (e) => { const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; const hh = hits.find((r) => x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3]); if (!hh) return;
    if (hh[4] === 'p') sel = sel === hh[5] ? null : hh[5]; else { if (seat[hh[5]]) { seat[hh[5]] = null; } else if (sel) { seat = seat.map((v) => (v === sel ? null : v)); seat[hh[5]] = sel; sel = null; } }
    cv.redraw(); show(); });
  cv.draw = (ctx, w, h, col) => {
    hits.length = 0; title(ctx, PZ[z].name + ': seats 1 to 5, left to right', col);
    const bw = (w - 24) / 5, y = 46, P = pos(), rules = PZ[z].rules;
    for (let i = 0; i < 5; i++) { const x = 12 + i * bw; ctx.fillStyle = col.soft; ctx.fillRect(x + 2, y, bw - 4, 50); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x + 2, y, bw - 4, 50); text(ctx, 'seat ' + (i + 1), x + bw / 2, y + 10, { color: col.muted, size: 10, align: 'center' }); if (seat[i]) text(ctx, seat[i], x + bw / 2, y + 32, { color: col.s[0], size: 20, weight: 800, align: 'center' }); hits.push([x, y, bw, 50, 's', i]); }
    text(ctx, 'People (tap one, then a seat):', 12, y + 72, { color: col.muted, size: 11 });
    PZ[z].p.forEach((p, i) => { const x = 12 + i * bw, placed = seat.includes(p); ctx.fillStyle = sel === p ? col.s[1] : col.panel; ctx.fillRect(x + 4, y + 82, bw - 8, 34); ctx.strokeStyle = placed ? col.line : col.s[0]; ctx.lineWidth = 2; ctx.strokeRect(x + 4, y + 82, bw - 8, 34); text(ctx, p, x + bw / 2, y + 99, { color: placed ? col.line : col.ink, size: 17, weight: 800, align: 'center' }); hits.push([x, y + 82, bw, 34, 'p', p]); });
    const full = Object.keys(P).length === 5;
    rules.forEach(([t, fn], i) => { const ys = y + 146 + i * 20; const ps = Object.keys(P); let st = '·', k = col.muted;
      const probe = (() => { const o = left(); return o.length; })();
      if (full) { st = fn(P) ? '✓' : '✗'; k = fn(P) ? col.good : col.bad; } else if (probe === 0) { st = '?'; k = col.warn; } text(ctx, `${st} ${t}`, 12, ys, { color: k, size: 11.5, weight: full ? 700 : 400 }); });
  };
  show();
}
