// Class 8 Area: Pick's theorem. For a polygon whose corners are dots on a square grid, area = I + B/2 - 1, where I is the number
// of dots inside and B the number of dots on the edge. Drag the corners; the shoelace formula gives the same area.
import { canvas, text, title, row, readout, touchGuard, clamp } from '../../kit.js';

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
const segX = (p, q, r, s) => cross(p, q, r) * cross(p, q, s) < 0 && cross(r, s, p) * cross(r, s, q) < 0;
export default function (host) {
  const GX = 10, GY = 7, P = [[1, 1], [7, 1], [8, 4], [3, 5]];
  let drag = -1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A polygon on a dot grid with draggable corners and a count of inside and edge dots' });
  const out = readout(host);
  const g = () => { const s = Math.min((cv.w - 20) / GX, (cv.h - 58) / GY); return { s, ox: (cv.w - s * GX) / 2, oy: cv.h - 14 }; };
  const inside = (x, y) => { let c = false; for (let i = 0, j = 3; i < 4; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
  const onEdge = (x, y) => { for (let i = 0; i < 4; i++) { const a = P[i], b = P[(i + 1) % 4]; if (cross(a, b, [x, y]) === 0 && Math.min(a[0], b[0]) <= x && x <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= y && y <= Math.max(a[1], b[1])) return true; } return false; };
  const simple = () => !segX(P[0], P[1], P[2], P[3]) && !segX(P[1], P[2], P[3], P[0]);
  const calc = () => { let I = 0, B = 0; for (let x = 0; x <= GX; x++) for (let y = 0; y <= GY; y++) onEdge(x, y) ? B++ : inside(x, y) && I++; let a2 = 0; for (let i = 0; i < 4; i++) { const a = P[i], b = P[(i + 1) % 4]; a2 += a[0] * b[1] - b[0] * a[1]; } return { I, B, A: Math.abs(a2) / 2 }; };
  function sync() { if (!simple()) { out.innerHTML = 'The sides cross each other, so this is not a simple shape. Pick’s rule needs sides that do not cross. Drag a corner back.'; } else { const { I, B, A } = calc(); out.innerHTML = `Blue inside dots I = <b>${I}</b>, orange edge dots B = <b>${B}</b>. Pick: area = I + B/2 − 1 = ${I} + ${B / 2} − 1 = <b>${I + B / 2 - 1}</b> square units. Shoelace check: <b>${A}</b>.`; } cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Pick’s theorem: count the dots', col); const { s, ox, oy } = g(), X = (x) => ox + x * s, Y = (y) => oy - y * s, ok = simple();
    ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.closePath(); ctx.fillStyle = ok ? col.s[0] : col.s[3]; ctx.globalAlpha = 0.2; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = ok ? col.s[0] : col.s[3]; ctx.lineWidth = 2.5; ctx.stroke();
    for (let x = 0; x <= GX; x++) for (let y = 0; y <= GY; y++) { const e = ok && onEdge(x, y), i = ok && !e && inside(x, y); ctx.fillStyle = e ? col.s[3] : i ? col.s[0] : col.muted; ctx.beginPath(); ctx.arc(X(x), Y(y), e || i ? 4 : 2, 0, 7); ctx.fill(); }
    P.forEach(([x, y]) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(x), Y(y), 8, 0, 7); ctx.stroke(); });
  };
  const pos = (e) => { const b = cv.c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const near = (x, y) => { const { s, ox, oy } = g(); return P.findIndex(([px, py]) => Math.hypot(ox + px * s - x, oy - py * s - y) < 16); };
  cv.c.addEventListener('pointerdown', (e) => { drag = near(...pos(e)); if (drag >= 0) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (drag < 0) return; const [x, y] = pos(e), { s, ox, oy } = g(); P[drag] = [clamp(Math.round((x - ox) / s), 0, GX), clamp(Math.round((oy - y) / s), 0, GY)]; sync(); });
  cv.c.addEventListener('pointerup', () => { drag = -1; });
  touchGuard(cv.c, (x, y) => near(x, y) >= 0);
  sync();
}
