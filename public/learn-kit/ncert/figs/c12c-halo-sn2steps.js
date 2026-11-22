// Class 12 Chemistry, Haloalkanes (step player): the SN2 mechanism with Walden inversion, for (R)-2-bromobutane + OH- -> (S)-butan-2-ol.
// One step: the nucleophile attacks from the side opposite the leaving group (back-side attack). In the transition state the carbon is five-coordinate and its three other groups lie in one plane
// like an umbrella blown flat. The groups then flip over to the other side: configuration is inverted. Energy profile: one hump, no intermediate.
import { canvas, text, title, line, loop, lerp } from '../../kit.js';

// state per step: [nucleophile distance, leaving-group distance, umbrella angle from +x axis in degrees, hump marker 0..1]
const S = [[150, 40, 109, 0], [80, 40, 109, 0.15], [52, 52, 90, 0.5], [40, 100, 76, 0.8], [40, 150, 70, 1]];
const TT = ['Reactants', 'Back-side attack begins', 'Transition state: groups flat', 'Br⁻ leaves, groups flip', 'Product: inverted'];
export default function (host) {
  let step = 0, cur = S[0].slice();
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 300, label: 'The SN2 mechanism with back-side attack and inversion of configuration' });
  loop(host, (dt) => { const s = S[step]; let moving = false; for (let i = 0; i < 4; i++) { const d = s[i] - cur[i]; if (Math.abs(d) > 0.01) { cur[i] += d * Math.min(1, dt * 4); moving = true; } } if (moving) cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cx = w * 0.5, cy = top + (h - top) * 0.3, k = Math.min(1, w / 330), [nu, lg, ang, hump] = cur;
    const node = (x, y, s, f, r = 14) => { ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); text(ctx, s, x, y, { color: col.panel, size: 10.5, weight: 700, align: 'center' }); };
    const a = (ang * Math.PI) / 180, L = 52 * k, g = [[cx + L * Math.cos(Math.PI - a + Math.PI), cy - L * Math.sin(a)], [cx + L * Math.cos(Math.PI - a + Math.PI), cy + L * Math.sin(a)], [cx + L * 0.9 * Math.cos(Math.PI - a + Math.PI) * 0.6, cy]];
    // left of C means x decreases when ang>90 ; use direction (cos a, +-sin a) with a measured from +x axis
    const dx = L * Math.cos(a), dy = L * Math.sin(a), P = [[cx + dx, cy - dy], [cx + dx, cy + dy]];
    const dashed = (p) => { ctx.setLineDash([4, 3]); line(ctx, [[cx, cy], p], col.ink, 2.5); ctx.setLineDash([]); };
    // nucleophile on the left, leaving group on the right
    const nuX = cx - nu * k * 0.8 - 10, lgX = cx + lg * k * 0.8 + 10;
    if (step >= 3 || nu < 60) line(ctx, [[cx, cy], [nuX + 14, cy]], col.ink, 2.5); else { ctx.setLineDash([3, 4]); line(ctx, [[cx, cy], [nuX + 14, cy]], col.muted, 1.5); ctx.setLineDash([]); }
    if (step < 3 || lg < 70) line(ctx, [[cx, cy], [lgX - 14, cy]], col.ink, 2.5); else { ctx.setLineDash([3, 4]); line(ctx, [[cx, cy], [lgX - 14, cy]], col.muted, 1.5); ctx.setLineDash([]); }
    line(ctx, [[cx, cy], P[0]], col.ink, 2.5); dashed(P[1]);
    // wedge group (toward viewer) drawn as a short bold line to the left-or-right according to angle
    const wx = cx + L * 0.55 * Math.cos(a) * 0.4, wy = cy - 2; ctx.fillStyle = col.ink; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(wx - 5, wy - 18 * 0 + 14); ctx.lineTo(wx + 5, wy + 14); ctx.closePath(); ctx.fill();
    node(P[0][0], P[0][1], 'CH₃', col.s[3], 15); node(P[1][0], P[1][1], 'C₂H₅', col.s[3], 15); node(wx, wy + 30, 'H', col.muted, 11);
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, 11, 0, 7); ctx.fill(); text(ctx, 'C', cx, cy, { color: col.panel, size: 11, weight: 700, align: 'center' });
    node(nuX, cy, 'OH⁻', col.s[0], 16);
    node(lgX, cy, 'Br', col.s[2], 16);
    if (step === 2) text(ctx, '[HO···C···Br]⁻  ‡', cx, cy - L - 28, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
    text(ctx, step < 3 ? '(R)-2-bromobutane' : '(S)-butan-2-ol', cx, cy + L + 52, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, step === 4 ? 'all three groups have flipped like an umbrella in the wind' : step === 0 ? 'OH⁻ comes in opposite to Br' : '', cx, cy + L + 70, { color: col.muted, size: 10.5, align: 'center' });
    // energy profile
    const px0 = 28, px1 = w - 20, py1 = h - 22, py0 = h - 22 - (h - top) * 0.16, X = (f) => px0 + f * (px1 - px0);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px0, py0 - 8); ctx.lineTo(px0, py1); ctx.lineTo(px1, py1); ctx.stroke();
    const E = (f) => py1 - 8 - (py1 - py0) * (0.85 * Math.exp(-Math.pow((f - 0.5) / 0.17, 2)) + 0.15 - 0.3 * f);
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const f = i / 60; i ? ctx.lineTo(X(f), E(f)) : ctx.moveTo(X(f), E(f)); } ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(X(hump), E(hump), 5.5, 0, 7); ctx.fill();
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
