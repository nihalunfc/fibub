// Class 8 Proportional Reasoning 2: direct and inverse proportion on a graph. Direct: y = kx, a straight line through the origin,
// y/x never changes. Inverse: x y = k, a curve that falls but never touches the axes, x times y never changes.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let mode = 'direct', x = 4;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A direct proportion line and an inverse proportion curve' });
  const ctl = row(host);
  choice(ctl, 'Kind', [['direct', 'Direct'], ['inverse', 'Inverse']], mode, (v) => { mode = v; sync(); });
  slider(ctl, { label: 'x', min: 1, max: 12, step: 1, value: x, fmt: (v) => v, oninput: (v) => { x = v; sync(); } });
  const out = readout(host);
  const y = () => (mode === 'direct' ? 2 * x : 24 / x);
  function sync() {
    out.innerHTML = mode === 'direct'
      ? `Direct: y = 2x. For x = ${x}, y = <b>${y()}</b>. The ratio y ÷ x = <b>${y() / x}</b>, always the same. Double x and y doubles.`
      : `Inverse: x × y = 24. For x = ${x}, y = <b>${+y().toFixed(2)}</b>. The product x × y = <b>${+(x * y()).toFixed(2)}</b>, always the same. Double x and y halves.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'direct' ? 'Direct: a straight line from the origin' : 'Inverse: a curve that never touches the axes', col);
    const L = 36, B = h - 34, W = w - L - 16, H = B - top - 20, sx = W / 12.5, sy = H / 25;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let v = 0; v <= 12; v += 2) { ctx.beginPath(); ctx.moveTo(L + v * sx, B); ctx.lineTo(L + v * sx, B - H); ctx.stroke(); text(ctx, String(v), L + v * sx, B + 12, { color: col.muted, size: 10, align: 'center' }); }
    for (let v = 0; v <= 24; v += 4) { ctx.beginPath(); ctx.moveTo(L, B - v * sy); ctx.lineTo(L + W, B - v * sy); ctx.stroke(); text(ctx, String(v), L - 5, B - v * sy, { color: col.muted, size: 10, align: 'right' }); }
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(L + W, B); ctx.moveTo(L, B); ctx.lineTo(L, B - H); ctx.stroke();
    ctx.strokeStyle = mode === 'direct' ? col.s[0] : col.s[2]; ctx.lineWidth = 2.5; ctx.beginPath();
    if (mode === 'direct') { ctx.moveTo(L, B); ctx.lineTo(L + 12 * sx, B - 24 * sy); } else { for (let i = 1; i <= 12; i += 0.1) { const px = L + i * sx, py = B - (24 / i) * sy; i === 1 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); } }
    ctx.stroke();
    const px = L + x * sx, py = B - y() * sy;
    ctx.setLineDash([4, 3]); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, B); ctx.lineTo(px, py); ctx.lineTo(L, py); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill();
    text(ctx, 'y', 10, top + 10, { color: col.muted, size: 10.5 }); text(ctx, 'x', L + W, B + 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  sync();
}
