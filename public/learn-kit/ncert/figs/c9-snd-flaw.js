// Class 9 Sound: ultrasound in industry. A probe sends short ultrasonic pulses (above 20 kHz, here megahertz) into a
// metal block. A pulse reflects from the back wall, and also from any crack on the way. The echo times show how deep
// each one is: d = v t / 2, with v = 5000 m/s in steel. The graph under the block is what the technician reads.
import { canvas, text, title, dot, line, arrow, row, slider, readout, loop } from '../../kit.js';

const V = 5000, TH = 80; // mm thickness of block
export default function (host) {
  let px = 0.2, cd = 35, t = 0;
  const cv = canvas(host, { aspect: 1, max: 460, min: 340, label: 'An ultrasonic probe scanning a steel block with a crack and the echo graph it shows' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  slider(ctl, { label: 'Probe position', min: 0, max: 1, step: 0.02, value: px, fmt: (v) => (v > 0.38 && v < 0.62 ? 'over the crack' : 'beside the crack'), oninput: (v) => { px = v; upd(); } });
  slider(ctl, { label: 'Crack depth', min: 10, max: 65, step: 1, value: cd, fmt: (v) => `${v} mm`, oninput: (v) => { cd = v; upd(); } });
  const out = readout(host);
  const over = () => px > 0.38 && px < 0.62;
  function upd() {
    const tc = 2 * cd / 1000 / V * 1e6, tb = 2 * TH / 1000 / V * 1e6;
    out.innerHTML = over() ? `A crack echo comes back after <b>${tc.toFixed(1)} µs</b>, earlier than the back wall echo (${tb.toFixed(1)} µs). Depth = v × t ÷ 2 = ${V} × ${(tc * 1e-6).toExponential(2)} ÷ 2 = <b>${cd} mm</b>.` : `No crack under the probe: only the back wall echo (${tb.toFixed(1)} µs) returns, from 2 × ${TH} mm of steel. Slide the probe over the crack to see an extra echo.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Ultrasound finds a crack inside steel', col);
    const bx = 24, bw = w - 48, by = 52, bh = h * 0.34, X = Math.min(bx + bw - 14, Math.max(bx + 14, bx + bw * px)), yd = (mm) => by + bh * mm / TH;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);
    text(ctx, 'steel block, 80 mm thick', bx + 6, by + bh - 9, { color: col.muted, size: 10 });
    // crack
    ctx.strokeStyle = col.bad; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx + bw * 0.42, yd(cd)); ctx.lineTo(bx + bw * 0.58, yd(cd) + 3); ctx.stroke();
    text(ctx, 'crack', bx + bw * 0.5, yd(cd) - 9, { color: col.bad, size: 10.5, weight: 700, align: 'center' });
    // probe
    ctx.fillStyle = col.ink; ctx.fillRect(X - 14, by - 16, 28, 14);
    const hit = over() ? cd : TH, tt = 2 * hit / 1000 / V * 1e6, cyc = 2.6, ph = (t % cyc) / 1.5, p = Math.min(1, ph);
    if (p < 1) {
      const y = p < 0.5 ? yd(hit) * 0 + by + (yd(hit) - by) * p * 2 : yd(hit) - (yd(hit) - by) * (p - 0.5) * 2, down = p < 0.5;
      ctx.save(); ctx.lineWidth = 2.4; ctx.lineCap = 'round';
      for (let k = 0; k < 3; k++) { ctx.globalAlpha = 1 - k * 0.3; ctx.strokeStyle = down ? col.s[2] : col.s[0]; const yy = y - (down ? 1 : -1) * k * 6; ctx.beginPath(); ctx.arc(X, yy, 12 - k * 2, down ? 0.4 : Math.PI + 0.4, down ? Math.PI - 0.4 : 2 * Math.PI - 0.4); ctx.stroke(); }
      ctx.restore();
    }
    // A-scan graph
    const gx = 30, gw = w - 60, gy = h - 56, gh = h * 0.24, Tm = 36, Gx = (u) => gx + gw * u / Tm;
    line(ctx, [[gx, gy], [gx + gw, gy]], col.muted, 1.5);
    for (let u = 0; u <= 36; u += 12) { line(ctx, [[Gx(u), gy], [Gx(u), gy + 4]], col.muted, 1); text(ctx, `${u}`, Gx(u), gy + 14, { color: col.muted, size: 10, align: 'center' }); }
    text(ctx, 'echo time (µs)', gx + gw, gy + 28, { color: col.muted, size: 10, align: 'right' });
    const spike = (u, a, c, lab) => { line(ctx, [[Gx(u), gy], [Gx(u), gy - gh * a]], c, 3); text(ctx, lab, Gx(u) + (u > 27 ? -4 : 4), gy - gh * a - 6, { color: c, size: 10, weight: 700, align: u > 27 ? 'right' : 'left' }); };
    spike(0.3, 1, col.s[2], 'pulse sent');
    if (over()) spike(2 * cd / 1000 / V * 1e6, 0.6, col.bad, `crack ${(2 * cd / 1000 / V * 1e6).toFixed(1)}`);
    spike(2 * TH / 1000 / V * 1e6, 0.45, col.s[0], `back wall ${(2 * TH / 1000 / V * 1e6).toFixed(0)}`);
    const clk = Math.min(1, ph) * tt;
    if (p < 1) { line(ctx, [[Gx(clk), gy - gh - 6], [Gx(clk), gy]], col.s[3], 1.2, [3, 3]); }
  };
  upd();
}
