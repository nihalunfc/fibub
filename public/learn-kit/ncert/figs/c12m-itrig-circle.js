// Class 12 Maths, Inverse trigonometric functions: on the unit circle the inverse picks the ONE angle with the given sine, cosine or
// tangent that lies in the principal half of the circle (shaded). Other angles with the same value are shown faded and are not chosen.
import { canvas, text, title, row, slider, choice, dot, readout } from '../../kit.js';

const P = Math.PI, r2 = (v) => (+v.toFixed(3)).toString().replace('-', '−');
export default function (host) {
  let fn = 'sin', v = 0.5;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'The unit circle with the principal angle for a chosen sine, cosine or tangent value' });
  const out = readout(host);
  const ang = () => (fn === 'sin' ? Math.asin(v) : fn === 'cos' ? Math.acos(v) : Math.atan(v));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `y = ${fn}⁻¹(${r2(v)}): which angle?`, col), R = Math.min(w / 2 - 20, (h - top - 50) / 2), cx = w / 2, cy = top + 12 + R;
    const th = ang(), alt = fn === 'sin' ? P - th : fn === 'cos' ? -th : th + P;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.1; ctx.beginPath();
    if (fn === 'cos') ctx.arc(cx, cy, R, -P, 0, false); else ctx.arc(cx, cy, R, -P / 2, P / 2, false);
    ctx.lineTo(cx, cy); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * P); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(cx - R - 8, cy); ctx.lineTo(cx + R + 8, cy); ctx.moveTo(cx, cy - R - 8); ctx.lineTo(cx, cy + R + 8); ctx.stroke();
    const pt = (a) => [cx + R * Math.cos(a), cy - R * Math.sin(a)];
    if (fn !== 'tan') { // guide line for the value
      ctx.strokeStyle = col.s[2]; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.4; ctx.beginPath();
      if (fn === 'sin') { ctx.moveTo(cx - R - 8, cy - R * v); ctx.lineTo(cx + R + 8, cy - R * v); } else { ctx.moveTo(cx + R * v, cy - R - 8); ctx.lineTo(cx + R * v, cy + R + 8); }
      ctx.stroke(); ctx.setLineDash([]);
    }
    const [ax, ay] = pt(alt), [px, py] = pt(th);
    if (fn !== 'tan' || true) { ctx.strokeStyle = col.muted; ctx.globalAlpha = 0.5; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ax, ay); ctx.stroke(); ctx.globalAlpha = 1; dot(ctx, ax, ay, 6, col.panel, col.muted); }
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.3, 0, -th, th > 0); ctx.stroke(); dot(ctx, px, py, 7, col.s[0], col.panel);
    text(ctx, fn === 'sin' ? 'principal: right half' : fn === 'cos' ? 'principal: upper half' : 'principal: right half', cx, cy + R + 12, { color: col.s[0], size: 10.5, weight: 600, align: 'center' });
    out.innerHTML = `${fn}⁻¹(${r2(v)}) = <b>${r2(th)} rad</b> = ${r2((th * 180) / P)}°. The faded point at ${r2(alt)} rad (${r2(alt * 180 / P)}°) also has ${fn} = ${r2(v)}, but it is outside the principal range, so it is not the answer.`;
  };
  const r = row(host), sl = slider(r, { label: 'Value', min: -1, max: 1, step: 0.01, value: v, fmt: r2, oninput: (x) => { v = x; cv.redraw(); } });
  choice(r, 'Function', [['sin', 'sin⁻¹'], ['cos', 'cos⁻¹'], ['tan', 'tan⁻¹']], fn, (f) => { fn = f; cv.redraw(); });
  cv.redraw();
}
