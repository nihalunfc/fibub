// Class 11 Maths, Sets: three sets A, B, C cut a universal set into 8 regions. Pick a combination and the regions that belong to it light up;
// adding the counts in those regions gives n(...). 3 + 4 + 2 + 5 + 6 + 7 + 8 + 5 = 40 people.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { shade } from '../c11m-lib.js';

const CNT = { '111': 3, '110': 4, '101': 2, '011': 5, '100': 6, '010': 7, '001': 8, '000': 5 };
const OPS = { u: ['A ∪ B ∪ C', (a, b, c) => a || b || c], i: ['A ∩ B ∩ C', (a, b, c) => a && b && c], a: ['A − (B ∪ C)', (a, b, c) => a && !b && !c], d: ['(A ∩ B) − C', (a, b, c) => a && b && !c], p: ['(A ∩ B) ∪ (A ∩ C)', (a, b, c) => (a && b) || (a && c)], e: ['exactly two', (a, b, c) => a + b + c === 2], n: ["(A ∪ B ∪ C)′", (a, b, c) => !(a || b || c)] };
export default function (host) {
  let op = 'u';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Venn diagram of three sets with the chosen combination shaded and counts in every region' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Shaded: ${OPS[op][0]}`, col), R = Math.min(w * 0.23, (h - top) * 0.25), cx = w / 2, cy = top + (h - top) * 0.46;
    const C = [[cx - R * 0.6, cy - R * 0.45], [cx + R * 0.6, cy - R * 0.45], [cx, cy + R * 0.6]], f = OPS[op][1], g = [cx, (C[0][1] + C[1][1] + C[2][1]) / 3];
    const mem = (x, y) => C.map(([a, b]) => (Math.hypot(x - a, y - b) < R ? 1 : 0));
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.3; ctx.strokeRect(6, top + 4, w - 12, h - top - 10);
    shade(ctx, 6, top + 4, w - 6, h - 6, (x, y) => f(...mem(x, y)), col.s[0], 0.34);
    C.forEach(([a, b], i) => { ctx.strokeStyle = col.s[[0, 2, 3][i]]; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(a, b, R, 0, 7); ctx.stroke(); });
    text(ctx, 'A', C[0][0] - R * 0.85, C[0][1] - R * 0.75, { color: col.s[0], size: 15, weight: 800 }); text(ctx, 'B', C[1][0] + R * 0.75, C[1][1] - R * 0.75, { color: col.s[2], size: 15, weight: 800 }); text(ctx, 'C', C[2][0] + R * 0.7, C[2][1] + R * 0.75, { color: col.s[3], size: 15, weight: 800 });
    const u = (a, b, k) => { const dx = a - g[0], dy = b - g[1], d = Math.hypot(dx, dy) || 1; return [g[0] + (dx / d) * k, g[1] + (dy / d) * k]; };
    const mid = (i, j) => [(C[i][0] + C[j][0]) / 2, (C[i][1] + C[j][1]) / 2];
    const lab = { '111': g, '100': u(C[0][0], C[0][1], R * 1.0), '010': u(C[1][0], C[1][1], R * 1.0), '001': u(C[2][0], C[2][1], R * 1.0), '110': u(...mid(0, 1), R * 0.62), '101': u(...mid(0, 2), R * 0.62), '011': u(...mid(1, 2), R * 0.62) };
    lab['110'] = [cx, C[0][1] - R * 0.35]; lab['101'] = [(C[0][0] + g[0]) / 2 - R * 0.28, (C[0][1] + C[2][1]) / 2 + R * 0.15]; lab['011'] = [(C[1][0] + g[0]) / 2 + R * 0.28, (C[1][1] + C[2][1]) / 2 + R * 0.15]; lab['111'] = [cx, cy + R * 0.02];
    let tot = 0;
    Object.entries(CNT).forEach(([k, v]) => { const on = f(...k.split('').map(Number)); if (on) tot += v; const p = lab[k] || [w - 24, h - 22]; text(ctx, String(v), p[0], p[1], { color: on ? col.ink : col.muted, size: on ? 16 : 13, weight: on ? 800 : 500, align: 'center' }); });
    out.innerHTML = `Counts: only A 6, only B 7, only C 8, A∩B only 4, A∩C only 2, B∩C only 5, all three 3, none 5 (total 40). <b>n = ${tot}</b> for ${OPS[op][0]}.`;
  };
  choice(row(host), 'Combination', Object.entries(OPS).map(([k, v]) => [k, v[0]]), op, (v) => { op = v; cv.redraw(); });
  cv.redraw();
}
