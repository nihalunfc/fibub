// 12.4 The Lyman break "dropout" trick. A young galaxy's light is roughly flat in f_ν redward of Lyman α
// (121.6 nm); neutral hydrogen in front removes almost everything bluer. Redshift moves that edge to
// 0.1216 × (1 + z) µm. Bars show how much light each JWST NIRCam wide filter catches (filter edges approximate,
// from the JWST user documentation). Toy spectrum: flat f_ν, sharp break, no emission lines or dust.
import { canvas, axes, text, title, line, row, slider, readout } from '../../kit.js';

const F = [['F090W', 0.795, 1.005], ['F115W', 1.013, 1.282], ['F150W', 1.331, 1.668], ['F200W', 1.755, 2.226], ['F277W', 2.423, 3.132], ['F356W', 3.135, 3.981], ['F444W', 3.881, 4.982]];

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 340, label: 'A galaxy spectrum with the Lyman break moving through JWST filters as redshift changes' });
  let z = 14.3;
  const ctl = row(host);
  slider(ctl, { label: 'Redshift z', min: 3, max: 18, step: 0.05, value: z, fmt: (v) => v.toFixed(2), oninput: (v) => { z = v; upd(); } });
  const out = readout(host);
  const brk = () => 0.121567 * (1 + z);
  const frac = ([, a, b]) => Math.max(0, Math.min(1, (b - Math.max(a, brk())) / (b - a)));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Lyman break dropout', col) + 4;
    const mid = top + (h - top) * 0.44;
    // top: spectrum
    const A = axes(ctx, w, h, col, { x: [0.7, 5.1], y: [0, 1.3], t: top + 8, b: h - mid, l: 36, r: 12, yt: [], xt: [1, 2, 3, 4, 5], ylabel: 'Light' });
    ctx.save(); A.clip();
    F.forEach(([n, a, b], i) => { ctx.fillStyle = col.s[(i % 2) ? 1 : 0]; ctx.globalAlpha = 0.12; ctx.fillRect(A.X(a), A.T, A.X(b) - A.X(a), A.B - A.T); });
    ctx.globalAlpha = 1;
    const x0 = Math.max(0.7, Math.min(5.1, brk()));
    line(ctx, [[A.X(0.7), A.Y(0.02)], [A.X(x0), A.Y(0.02)], [A.X(x0), A.Y(1)], [A.X(5.1), A.Y(1)]], col.s[3], 3);
    ctx.restore();
    text(ctx, `break at ${brk().toFixed(2)} µm`, Math.min(A.R - 4, Math.max(A.L + 4, A.X(x0) + 6)), A.Y(1.15), { color: col.s[3], size: 11.5, weight: 700, align: A.X(x0) > w * 0.6 ? 'right' : 'left', halo: col.panel });
    // bottom: what each filter sees
    const B = axes(ctx, w, h, col, { x: [0.7, 5.1], y: [0, 1.5], t: mid + 30, l: 36, r: 12, b: 38, xlabel: 'Wavelength reaching JWST (µm)', ylabel: 'Seen', yt: [0, 1], xt: [1, 2, 3, 4, 5], fy: (v) => (v ? 'all' : '0') });
    F.forEach((f, i) => {
      const [n, a, b] = f, v = frac(f), xm = (B.X(a) + B.X(b)) / 2;
      ctx.fillStyle = v > 0.05 ? col.s[0] : col.line;
      ctx.fillRect(B.X(a) + 1, B.Y(Math.max(v, 0.02)), B.X(b) - B.X(a) - 2, B.B - B.Y(Math.max(v, 0.02)));
      text(ctx, n, xm, B.Y(w > 520 ? 1.15 : [1.1, 1.27, 1.44][i % 3]), { color: v > 0.05 ? col.ink : col.muted, size: w > 520 ? 10.5 : 9, weight: 700, align: 'center' });
    });
  };
  const upd = () => {
    const gone = F.filter((f) => frac(f) < 0.05).map((f) => f[0]), seen = F.filter((f) => frac(f) >= 0.05).map((f) => f[0]);
    out.innerHTML = `At z = ${z.toFixed(2)} the break sits at 0.1216 × ${(1 + z).toFixed(2)} = <b>${brk().toFixed(2)} µm</b>. ${gone.length ? `Dark in ${gone.join(', ')}; ` : 'Seen in every filter; '}${seen.length ? `bright in ${seen.join(', ')}.` : 'invisible to NIRCam altogether.'} A galaxy that vanishes in the bluer filters is a high-redshift <i>candidate</i>. Only a spectrum makes it sure: dusty galaxies with bright emission lines at z ≈ 5 can fake the same pattern.`;
    cv.redraw();
  };
  upd();
}
