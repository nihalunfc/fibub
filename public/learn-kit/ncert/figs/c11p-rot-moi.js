// Class 11 Rotational Motion: moment of inertia explorer. I = sum m r^2, so mass far from the axis counts most. Pick a shape; I_cm = c M R^2 (ring 1, disc 1/2, solid sphere 2/5, hollow sphere 2/3, rod M L^2/12).
// Slide the axis a distance d from the centre of mass: the parallel-axis theorem gives I = I_cm + M d^2. Press Spin to apply the same torque (5 N m) and see how fast each I lets it turn: alpha = torque / I.
import { canvas, line, text, title, dot, row, slider, choice, button, readout, loop, touchGuard, ease } from '../../kit.js';

const SHAPES = {
  ring: { name: 'ring', c: 1, f: 'M R²', kind: 'circ', hollow: true, len: false, axis: 'through the centre, ⊥ plane' },
  disc: { name: 'disc', c: 1 / 2, f: '½ M R²', kind: 'circ', hollow: false, len: false, axis: 'through the centre, ⊥ plane' },
  rod: { name: 'rod', c: 1 / 12, f: 'M L²/12', kind: 'rod', len: true, axis: 'through the middle, ⊥ rod' },
  ssph: { name: 'solid sphere', c: 2 / 5, f: '⅖ M R²', kind: 'sph', hollow: false, len: false, axis: 'along a diameter' },
  hsph: { name: 'hollow sphere', c: 2 / 3, f: '⅔ M R²', kind: 'sph', hollow: true, len: false, axis: 'along a diameter' },
  scyl: { name: 'solid cylinder', c: 1 / 2, f: '½ M R²', kind: 'cyl', hollow: false, len: false, axis: 'along its length' },
  hcyl: { name: 'hollow cylinder', c: 1, f: 'M R²', kind: 'cyl', hollow: true, len: false, axis: 'along its length' },
};

export default function (host) {
  let key = 'disc', M = 2, S = 0.5, d = 0, spinT = -1;
  const TAU = 5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A shape that can spin about an axis you can move, with its moment of inertia' });
  const ctl = row(host);
  choice(ctl, 'Shape', Object.keys(SHAPES).map((k) => [k, SHAPES[k].name]), 'disc', (v) => { key = v; if (v === 'rod' && S < 0.4) S = 0.5; spinT = -1; cv.redraw(); });
  const sM = slider(ctl, { label: 'Mass M', min: 0.5, max: 10, step: 0.5, value: 2, fmt: (v) => v + ' kg', oninput: (v) => { M = v; cv.redraw(); } });
  const sS = slider(ctl, { label: 'Size (R, or half-length of the rod)', min: 0.2, max: 1, step: 0.05, value: 0.5, fmt: (v) => v.toFixed(2) + ' m', oninput: (v) => { S = v; cv.redraw(); } });
  const sD = slider(ctl, { label: 'Axis moved d from the centre', min: 0, max: 1.2, step: 0.05, value: 0, fmt: (v) => v.toFixed(2) + ' m', oninput: (v) => { d = v; spinT = -1; cv.redraw(); } });
  const b2 = row(host); button(b2, 'Spin it (torque 5 N m)', () => { spinT = 0; });
  const ro = readout(host);
  const I = () => { const sh = SHAPES[key], Lr = sh.len ? 2 * S : S; return { cm: sh.c * M * Lr * Lr, tot: sh.c * M * Lr * Lr + M * d * d }; };
  loop(host, (dt) => { if (spinT >= 0) { spinT += dt; if (spinT > 3.2) spinT = -1; cv.redraw(); } });
  const px = () => (cv.w / 2 - 20) / 2.2;
  cv.draw = (ctx, w, h, col) => {
    const sh = SHAPES[key], top = title(ctx, `${sh.name}: axis ${sh.axis}`, col), cx = w / 2, cy = top + (h - top - 96) / 2 + 6, sc = px();
    const { cm, tot } = I(), alpha = TAU / tot, th = spinT >= 0 ? 0.5 * alpha * spinT * spinT : 0;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(th);
    const ox = d * sc, r = S * sc;
    ctx.lineWidth = 2.5;
    if (sh.kind === 'rod') { ctx.fillStyle = col.s[0]; ctx.fillRect(ox - r, -5, 2 * r, 10); [-0.5, 0, 0.5].forEach((q) => dot(ctx, ox + q * 2 * r, 0, 2, col.panel)); }
    else if (sh.hollow) { ctx.strokeStyle = col.s[0]; ctx.lineWidth = sh.kind === 'sph' ? 7 : 4; ctx.beginPath(); ctx.arc(ox, 0, r - 2, 0, 6.2832); ctx.stroke(); }
    else { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(ox, 0, r, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1; }
    if (sh.kind !== 'rod') { ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox + r - 3, 0); ctx.stroke(); }
    ctx.restore();
    dot(ctx, cx + Math.cos(th) * d * sc, cy + Math.sin(th) * d * sc, 4, col.ink);
    text(ctx, 'CM', cx + Math.cos(th) * d * sc, cy + Math.sin(th) * d * sc + (sh.kind === 'rod' ? -14 : 14), { color: col.ink, size: 10, align: 'center', weight: 700 });
    dot(ctx, cx, cy, 8, col.s[2], col.panel); text(ctx, 'axis', cx, cy - 16, { color: col.s[2], size: 11, weight: 700, align: 'center', halo: col.panel });
    if (d === 0 && spinT < 0) text(ctx, 'drag the shape sideways to move the axis', cx, cy + 2.2 * sc + 14 > h - 100 ? h - 104 : cy + 2.2 * sc + 14, { color: col.muted, size: 11, align: 'center' });
    const by = h - 70, bw = w - 40, S2 = bw / Math.max(tot, 0.0001);
    ctx.fillStyle = col.s[0]; ctx.fillRect(20, by, cm * S2, 16); ctx.fillStyle = col.s[3]; ctx.fillRect(20 + cm * S2, by, (tot - cm) * S2, 16);
    text(ctx, `I about the axis = ${tot.toFixed(3)} kg m²`, 20, by - 10, { color: col.ink, size: 12, weight: 700 });
    ctx.fillStyle = col.s[0]; ctx.fillRect(20, by + 26, 10, 10); text(ctx, 'I of the shape itself', 34, by + 31, { color: col.ink, size: 10.5 });
    ctx.fillStyle = col.s[3]; ctx.fillRect(w / 2 + 6, by + 26, 10, 10); text(ctx, 'M d² (axis moved)', w / 2 + 20, by + 31, { color: col.ink, size: 10.5 });
    const Lr = sh.len ? 2 * S : S;
    ro.textContent = `I_cm = ${sh.f} = ${cm.toFixed(3)} kg m². Parallel axis: I = I_cm + M d² = ${cm.toFixed(3)} + ${(M * d * d).toFixed(3)} = ${tot.toFixed(3)} kg m². Radius of gyration k = √(I/M) = ${Math.sqrt(tot / M).toFixed(2)} m. A 5 N m torque gives α = ${alpha.toFixed(2)} rad/s².${spinT >= 0 ? ' Spinning: ω = ' + (alpha * spinT).toFixed(1) + ' rad/s.' : ''}`;
  };
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  let dr = false;
  touchGuard(cv.c, () => spinT < 0);
  cv.c.style.cursor = 'ew-resize';
  cv.c.addEventListener('pointerdown', (e) => { if (spinT < 0) { dr = true; cv.c.setPointerCapture(e.pointerId); } });
  cv.c.addEventListener('pointermove', (e) => { if (!dr) return; const [x] = pos(e); d = Math.min(1.2, Math.max(0, Math.round(Math.abs(x - cv.w / 2) / px() / 0.05) * 0.05)); sD.set(d); cv.redraw(); });
  const up = () => { dr = false; }; cv.c.addEventListener('pointerup', up); cv.c.addEventListener('pointercancel', up);
  cv.redraw();
}
