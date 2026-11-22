// Class 12 Wave Optics: Malus's law. Unpolarised light has its electric field E in every direction across the beam. A polariser lets through only the
// component along its axis, leaving plane-polarised light of intensity I0 (half the original). A second polariser (the analyser) turned by an angle theta
// passes only the component E0 cos(theta), so the intensity is I = I0 cos^2(theta). Rotate the analyser and watch the dot move along the cos^2 curve.
import { canvas, text, title, row, slider, readout, line, dot, arrow, loop, axes } from '../../kit.js';
import { rad } from '../c12p-optlib.js';

export default function (host) {
  let th = 30;
  const cv = canvas(host, { aspect: 0.98, max: 440, min: 320, label: 'Polarised light through an analyser turned by an angle' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Analyser angle θ', min: 0, max: 180, step: 1, value: th, fmt: (v) => `${v}°`, oninput: (v) => { th = v; cv.redraw(); } });
  const anim = loop(host, (dt) => { th = (th + dt * 40) % 180; sl.set(th); cv.redraw(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Light through two polaroids', col) + 4, t = rad(th), c = Math.cos(t);
    // end-on view
    const R = Math.min(w * 0.22, (h - top) * 0.2), cx = w * 0.27, cy = top + R + 14;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R + 8, 0, 7); ctx.stroke();
    line(ctx, [[cx - Math.cos(t) * (R + 8), cy + Math.sin(t) * (R + 8)], [cx + Math.cos(t) * (R + 8), cy - Math.sin(t) * (R + 8)]], col.s[1], 3);
    arrow(ctx, cx, cy, cx, cy - R, col.s[0], 3, 9); text(ctx, 'E₀', cx + 6, cy - R - 2, { color: col.s[0], size: 12, weight: 700 });
    const px = cx + Math.cos(t) * R * c, py = cy - Math.sin(t) * R * c;
    line(ctx, [[cx, cy - R], [px, py]], col.muted, 1, [3, 3]);
    arrow(ctx, cx, cy, px, py, col.s[2], 3.5, 9);
    dot(ctx, cx, cy, 3, col.ink);
    text(ctx, 'blue: E₀ (polariser axis, vertical)', cx - R - 8, cy + R + 22, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'orange: analyser axis', cx - R - 8, cy + R + 36, { color: col.s[1], size: 10.5, weight: 700 });
    // right-hand readouts
    const bx = w * 0.62, bw = w * 0.3;
    text(ctx, 'E passed = E₀ cos θ', bx, top + 18, { color: col.s[2], size: 11.5, weight: 700 }); text(ctx, `= ${c.toFixed(2)} E₀`, bx, top + 36, { color: col.s[2], size: 11.5 });
    text(ctx, 'I = I₀ cos²θ', bx, top + 62, { color: col.ink, size: 12, weight: 700 }); text(ctx, `= ${(c * c).toFixed(2)} I₀`, bx, top + 80, { color: col.ink, size: 12 });
    ctx.fillStyle = col.s[2]; ctx.fillRect(bx, top + 92, bw * c * c, 12); ctx.strokeStyle = col.line; ctx.strokeRect(bx, top + 92, bw, 12);
    // graph
    const gy0 = cy + R + 56, gh = h - gy0 - 18, gx0 = 40, gx1 = w - 16, X = (d) => gx0 + (d / 180) * (gx1 - gx0), Y = (v) => gy0 + gh - v * gh;
    line(ctx, [[gx0, gy0 + gh], [gx1, gy0 + gh]], col.line, 1); line(ctx, [[gx0, gy0], [gx0, gy0 + gh]], col.line, 1);
    const pts = []; for (let d = 0; d <= 180; d += 3) pts.push([X(d), Y(Math.cos(rad(d)) ** 2)]);
    line(ctx, pts, col.ink, 2);
    line(ctx, [[X(th), gy0 + gh], [X(th), Y(c * c)]], col.s[3], 1.2, [3, 3]); dot(ctx, X(th), Y(c * c), 5, col.s[3], col.ink);
    for (const d of [0, 45, 90, 135, 180]) text(ctx, `${d}°`, X(d), h - 6, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'I/I₀', gx0 + 4, gy0 - 8, { color: col.muted, size: 10 }); text(ctx, '1', gx0 - 6, Y(1) + 6, { color: col.muted, size: 10, align: 'right' }); text(ctx, '0', gx0 - 6, Y(0), { color: col.muted, size: 10, align: 'right' });
    out.innerHTML = th === 0 || th === 180 ? 'Axes parallel: all of the polarised light gets through, I = I₀.' : th === 90 ? 'Axes crossed at 90°: the analyser blocks all of it. I = 0.' : `At θ = ${th.toFixed(0)}° only the part of E along the analyser axis passes: E₀ cos θ, so the intensity is <b>cos²θ = ${(c * c).toFixed(2)}</b> of I₀.`;
  };
  cv.redraw();
}
