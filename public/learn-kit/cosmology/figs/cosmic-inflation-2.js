// 11.2 The flatness magnifier. A balloon's surface (a closed, curved 2D space) inflates by e^N. Left: the whole
// balloon with the patch we can see marked on it (the patch keeps a fixed size, the horizon). Right: the patch
// itself, drawn at fixed size, with the balloon's surface running through it. During inflation H is nearly
// constant, so the curvature term |Ω − 1| = |k|c²/(aH)² falls as e^(−2N): 60 e-folds flatten it by e^(−120) ≈ 10⁻⁵².
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

const sup = (e) => String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'A curved balloon surface inflating until the visible patch looks flat' });
  let N = 0;
  const ctl = row(host);
  slider(ctl, { label: 'e-folds of inflation (N)', min: 0, max: 60, step: 1, value: N, fmt: (v) => String(v), oninput: (v) => { N = v; cv.redraw(); show(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Inflate a balloon and any patch looks flat', col);
    const gap = 14, lw = Math.round((w - 3 * gap) * 0.42), rw = w - 3 * gap - lw;
    const ph = h - top - 40;
    // left: whole balloon, scaled to fit; the patch is a fixed physical size, so it shrinks in angle as e^-N
    const cxL = gap + lw / 2, cyL = top + 12 + ph / 2, R = Math.min(lw, ph) / 2 - 6;
    ctx.beginPath(); ctx.arc(cxL, cyL, R, 0, Math.PI * 2); ctx.fillStyle = col.soft; ctx.fill();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    const half = Math.min(Math.PI * 0.9, 1.2 * Math.exp(-N)); // half-angle of the patch
    ctx.beginPath(); ctx.arc(cxL, cyL, R, -Math.PI / 2 - half, -Math.PI / 2 + half); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.arc(cxL, cyL - R, 3.5, 0, Math.PI * 2); ctx.fillStyle = col.s[0]; ctx.fill();
    text(ctx, 'whole balloon', cxL, h - 22, { color: col.muted, size: 11, align: 'center' });
    text(ctx, N ? `(shrunk e${sup(N)} times to fit)` : '(to scale)', cxL, h - 8, { color: col.muted, size: 10.5, align: 'center' });
    // right: the patch at fixed size; the surface is an arc of radius (patch half-width / sin(half))
    const x0 = 2 * gap + lw, W = rw, mid = x0 + W / 2, yTop = top + 26;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, top + 12.5, W - 1, ph);
    const rpx = (W * 0.42) / Math.sin(half), pts = [];
    for (let i = 0; i <= 80; i++) {
      const th = -half + (2 * half * i) / 80;
      pts.push([mid + rpx * Math.sin(th), yTop + rpx * (1 - Math.cos(th))]);
    }
    ctx.save(); ctx.beginPath(); ctx.rect(x0, top + 12, W, ph); ctx.clip();
    line(ctx, pts, col.s[0], 3);
    // a triangle drawn on the surface: its corners and the "flat" reference line
    line(ctx, [[mid - W * 0.42, yTop], [mid + W * 0.42, yTop]], col.muted, 1, [4, 4]);
    ctx.restore();
    const sag = rpx * (1 - Math.cos(half));
    text(ctx, 'the patch we can see', mid, h - 22, { color: col.muted, size: 11, align: 'center' });
    text(ctx, sag < 0.5 ? 'flat to the eye' : `bulge ${sag.toFixed(0)} px`, mid, h - 8, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
  };
  const show = () => {
    const d = (2 * N) / Math.LN10;
    out.innerHTML = N === 0
      ? 'Before inflation: the patch we will one day see covers a big part of a curved balloon.'
      : `The balloon has grown e${sup(N)} ≈ 10${sup(Math.floor(N / Math.LN10))} times across. The curvature you can detect in the patch, |Ω − 1|, has fallen by e${sup(2 * N)} ≈ <b>10${sup(-Math.round(d))}</b>.${N >= 55 ? ' That is enough to explain why space looks flat today.' : ''}`;
  };
  cv.redraw(); show();
}
