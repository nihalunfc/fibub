// Class 12 Wave Optics: the three-polaroid puzzle. Unpolarised light I0 -> first polaroid (axis 0 deg): I0/2 -> middle polaroid at angle phi:
// (I0/2) cos^2(phi) -> last polaroid crossed at 90 deg to the first: times cos^2(90 - phi) = sin^2(phi). Total (I0/8) sin^2(2 phi).
// Without the middle sheet two crossed polaroids give 0; slipping a sheet between them lets light through, most at 45 deg (I0/8).
import { canvas, text, title, row, slider, choice, readout, line } from '../../kit.js';
import { rad } from '../c12p-optlib.js';

export default function (host) {
  let phi = 45, mid = true;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'Three polaroids: a middle sheet lets light through crossed polaroids' });
  const ctl = row(host);
  choice(ctl, 'Middle sheet', [[true, 'In'], [false, 'Out']], mid, (v) => { mid = v; cv.redraw(); });
  slider(ctl, { label: 'Middle axis φ', min: 0, max: 90, step: 1, value: phi, fmt: (v) => `${v}°`, oninput: (v) => { phi = v; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Unpolarised light, three sheets', col) + 8, cy = top + (h - top) * 0.45, H = (h - top) * 0.42;
    const I1 = 0.5, I2 = mid ? 0.5 * Math.cos(rad(phi)) ** 2 : 0.5, I3 = mid ? I2 * Math.sin(rad(phi)) ** 2 : 0;
    const xs = [w * 0.06, w * 0.26, w * 0.5, w * 0.74, w * 0.94], lv = [1, I1, I2, I3];
    const sheets = [{ x: w * 0.26, ang: 0, on: true, lab: 'P₁ 0°' }, { x: w * 0.5, ang: phi, on: mid, lab: `P₂ ${phi}°` }, { x: w * 0.74, ang: 90, on: true, lab: 'P₃ 90°' }];
    const seg = [[xs[0], sheets[0].x, lv[0]], [sheets[0].x, sheets[1].x, lv[1]], [sheets[1].x, sheets[2].x, lv[2]], [sheets[2].x, xs[4], lv[3]]];
    seg.forEach(([a, b, v], k) => { ctx.fillStyle = col.s[k === 0 ? 7 : 2]; ctx.globalAlpha = 0.25 + 0.6 * Math.sqrt(v); const hh = Math.max(1.5, H * v); ctx.fillRect(a, cy - hh / 2, b - a, hh); ctx.globalAlpha = 1; });
    sheets.forEach((s) => {
      if (!s.on) { text(ctx, 'removed', s.x, cy - H / 2 - 16, { color: col.muted, size: 10.5, align: 'center' }); return; }
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(s.x - 5, cy - H / 2 - 8, 10, H + 16);
      const a = rad(s.ang), L = 14;
      line(ctx, [[s.x - Math.sin(a) * L * 0 - 0, cy - H / 2 - 10 + 0], [s.x, cy - H / 2 - 10]], col.ink, 0.1);
      line(ctx, [[s.x - Math.cos(a) * L, cy + Math.sin(a) * L + H / 2 + 28], [s.x + Math.cos(a) * L, cy - Math.sin(a) * L + H / 2 + 28]], col.s[1], 3);
      text(ctx, s.lab, s.x, cy - H / 2 - 16, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    });
    const lab = ['I₀', 'I₀/2', mid ? (I2 / 0.5).toFixed(2) + ' × I₀/2' : 'I₀/2', mid ? (I3 * 8).toFixed(2) + ' × I₀/8' : '0'];
    seg.forEach(([a, b], k) => text(ctx, lab[k], (a + b) / 2, h - 12 - (k % 2) * 0, { color: col.ink, size: 10.5, weight: 700, align: 'center' }));
    out.innerHTML = mid ? `Final intensity = (I₀/2) cos²φ sin²φ = <b>(I₀/8) sin²2φ = ${(I3).toFixed(3)} I₀</b>. ` + (phi === 45 ? 'At 45° it is the most: I₀/8.' : phi === 0 || phi === 90 ? 'At 0° or 90° the middle sheet matches one of the others, so the other pair is still crossed: zero.' : 'Try 45°.') : 'Without the middle sheet P₁ and P₃ are crossed: <b>no light gets through</b>. Slide the middle sheet in and a dark screen lights up.';
  };
  cv.redraw();
}
