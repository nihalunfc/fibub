// Class 11 Maths, Trigonometric Functions (step player): why cos(A − B) = cos A cos B + sin A sin B. Two points on the unit circle at angles A and B are a
// certain distance apart. Turn both by −B and the distance cannot change; computing it two ways gives the formula.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Two points on the unit circle rotated so that one lies on the x axis, to prove the cosine of a difference formula' });
  const A = (70 * Math.PI) / 180, B = (25 * Math.PI) / 180;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'cos(A − B): a distance, computed two ways', col), R = Math.min(w * 0.3, 100), cx = w / 2, cy = top + 10 + R, P = (a) => [cx + R * Math.cos(a), cy - R * Math.sin(a)];
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(cx - R - 8, cy); ctx.lineTo(cx + R + 8, cy); ctx.moveTo(cx, cy - R - 8); ctx.lineTo(cx, cy + R + 8); ctx.stroke();
    const pt = (a, c, name, alpha = 1) => { const [x, y] = P(a); ctx.globalAlpha = alpha; ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); text(ctx, name, x + (Math.cos(a) >= 0 ? 8 : -8), y - 8, { color: c, size: 12, weight: 800, align: Math.cos(a) >= 0 ? 'left' : 'right' }); ctx.globalAlpha = 1; };
    const chord = (a, b, c) => { const [x1, y1] = P(a), [x2, y2] = P(b); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
    if (s <= 1) { pt(A, col.s[0], 'P (A)'); pt(B, col.s[2], 'Q (B)'); chord(A, B, col.s[3]); }
    else { pt(A, col.s[0], 'P', 0.25); pt(B, col.s[2], 'Q', 0.25); pt(A - B, col.s[0], 'P′ (A−B)'); pt(0, col.s[2], 'Q′ (0)'); chord(A - B, 0, col.s[3]); }
    ctx.lineWidth = 1.4; const [ax, ay] = P(A);
    const y = cy + R + 28, say = (t, k, c = col.ink, z = 12.5) => text(ctx, t, 10, y + k * 21, { color: c, size: z, weight: 700 });
    const lines = [
      ['P = (cos A, sin A) and Q = (cos B, sin B).', 'Their distance PQ is the orange chord.'],
      ['PQ² = (cos A − cos B)² + (sin A − sin B)²', '= 2 − 2(cos A cos B + sin A sin B).'],
      ['Turn the whole picture by −B: Q goes to Q′ = (1, 0),', 'P goes to P′ = (cos(A−B), sin(A−B)). The chord keeps its length.'],
      ['P′Q′² = (cos(A−B) − 1)² + sin²(A−B)', '= 2 − 2 cos(A − B).'],
      ['Same chord, so 2 − 2cos(A−B) = 2 − 2(cos A cos B + sin A sin B).', 'Cancel: cos(A − B) = cos A cos B + sin A sin B.'],
      ['Put −B for B: cos(A + B) = cos A cos B − sin A sin B.', 'Then sin(A+B) = cos(90° − A − B) gives sin A cos B + cos A sin B.'],
    ];
    lines[Math.min(s, 5)].forEach((t, k) => say(t, k, k === 1 && s >= 4 ? col.s[3] : col.ink));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
