// 4.5 Angular momentum. Two views of the states |l, m>: the vector model (L of length sqrt(l(l+1)) hbar on a cone
// at height m hbar, never along the axis) and a polar plot of |Y_lm(theta)|² in the xz-plane (symmetric about z).
import { canvas, line, text, row, choice, readout, fmt } from '../../kit.js';

// Associated Legendre P_l^m(x) for m >= 0 (sign irrelevant here: only its square is drawn).
function plm(l, m, x) {
  let pmm = 1;
  const s = Math.sqrt(Math.max(0, 1 - x * x));
  for (let i = 1; i <= m; i++) pmm *= (2 * i - 1) * s;
  if (l === m) return pmm;
  let p1 = x * (2 * m + 1) * pmm;
  if (l === m + 1) return p1;
  let p0 = pmm;
  for (let k = m + 2; k <= l; k++) { const p2 = ((2 * k - 1) * x * p1 - (k + m - 1) * p0) / (k - m); p0 = p1; p1 = p2; }
  return p1;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 460, min: 300, label: 'Vector model of orbital angular momentum, or polar plot of the spherical harmonic density' });
  let l = 2, m = 1, mode = 'cone';
  const ctl = row(host);
  const mrow = document.createElement('div');
  const out = readout(host);
  const show = () => {
    const L = Math.sqrt(l * (l + 1)), th = Math.acos(m / L) * 180 / Math.PI;
    out.innerHTML = `l = ${l}, m = ${m}: |L| = √${l * (l + 1)} ħ = <b>${fmt(L, 3)} ħ</b>, L<sub>z</sub> = ${m}ħ, angle to the z-axis ${fmt(th, 3)}°. ` +
      `⟨L<sub>x</sub>⟩ = ⟨L<sub>y</sub>⟩ = 0 but ⟨L<sub>x</sub>²⟩ = ⟨L<sub>y</sub>²⟩ = ½[l(l+1) − m²]ħ² = ${fmt((l * (l + 1) - m * m) / 2, 3)} ħ².`;
  };
  const buildM = () => {
    mrow.innerHTML = '';
    const opts = []; for (let k = l; k >= -l; k--) opts.push([k, String(k)]);
    choice(mrow, 'm', opts, m, (v) => { m = v; cv.redraw(); show(); });
  };
  choice(ctl, 'l', [[1, '1'], [2, '2'], [3, '3'], [4, '4']], l, (v) => { l = v; if (Math.abs(m) > l) m = Math.sign(m) * l; buildM(); cv.redraw(); show(); });
  ctl.appendChild(mrow);
  choice(ctl, 'View', [['cone', 'vector model'], ['polar', '|Y|² polar plot']], mode, (v) => { mode = v; cv.redraw(); });
  buildM();

  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 6, R = Math.min(w, h) * 0.4;
    line(ctx, [[cx, cy + R * 1.08], [cx, cy - R * 1.08]], col.muted, 1.2);
    text(ctx, 'z', cx + 6, cy - R * 1.05, { color: col.muted, size: 12, weight: 700 });
    if (mode === 'cone') {
      const L = Math.sqrt(l * (l + 1)), s = R / Math.sqrt(20); // scale fixed by l = 4 so sizes compare
      ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.arc(cx, cy, L * s, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      for (let k = -l; k <= l; k++) {
        const y = cy - k * s, half = Math.sqrt(Math.max(0, L * L - k * k)) * s;
        line(ctx, [[cx - half, y], [cx + half, y]], k === m ? col.ink : col.line, k === m ? 1.2 : 1, [3, 3]);
        text(ctx, `m = ${k}`, cx + L * s + 8, y, { color: k === m ? col.ink : col.muted, size: 11, weight: k === m ? 700 : 400 });
      }
      const rx = Math.sqrt(Math.max(0, L * L - m * m)) * s, y = cy - m * s;
      ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(cx, y, rx, Math.max(2, rx * 0.22), 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      line(ctx, [[cx, cy], [cx - rx, y]], col.s[1], 1.4, [5, 4]);
      line(ctx, [[cx, cy], [cx + rx, y]], col.s[0], 3);
      text(ctx, 'L', cx + rx / 2 + 8, (cy + y) / 2, { color: col.s[0], size: 13, weight: 700 });
      text(ctx, 'L precesses on the cone: Lx, Ly undetermined', 10, h - 14, { color: col.muted, size: 11 });
    } else {
      line(ctx, [[cx - R * 1.08, cy], [cx + R * 1.08, cy]], col.muted, 1.2);
      text(ctx, 'x', cx + R * 1.04, cy - 10, { color: col.muted, size: 12, weight: 700 });
      const am = Math.abs(m), N = 360;
      let mx = 0; const vals = [];
      for (let i = 0; i <= N; i++) { const th = Math.PI * i / N, v = plm(l, am, Math.cos(th)) ** 2; vals.push(v); mx = Math.max(mx, v); }
      const pts = [];
      for (let i = 0; i <= N; i++) { const th = Math.PI * i / N, r = R * vals[i] / mx; pts.push([cx + r * Math.sin(th), cy - r * Math.cos(th)]); }
      for (let i = N; i >= 0; i--) { const th = Math.PI * i / N, r = R * vals[i] / mx; pts.push([cx - r * Math.sin(th), cy - r * Math.cos(th)]); }
      ctx.save(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.restore();
      line(ctx, pts, col.s[0], 2.2);
      text(ctx, `|Y${l},${m}|² in the xz-plane (same for every φ)`, 10, h - 14, { color: col.muted, size: 11 });
    }
  };
  cv.redraw(); show();
}
