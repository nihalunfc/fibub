// 12.2 Why "shrink the sound horizon" is the favourite kind of fix. The CMB measures an ANGLE (θ*, known to
// 0.03%). Angle = ruler size ÷ distance. If new physics before recombination made the ruler (the sound horizon)
// smaller, the same angle means the CMB is closer, which means faster expansion: a higher H0. Toy scaling used
// here: H0 × r_d is held fixed at the Planck values (67.4 km/s/Mpc × 147.1 Mpc), roughly what CMB + BAO data do.
import { canvas, axes, text, title, line, dot, row, slider, readout } from '../../kit.js';

const RD = 147.1, H0P = 67.4;

export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 340, label: 'A smaller sound horizon seen at the same angle means a closer CMB and a higher Hubble constant' });
  let shrink = 0;
  const ctl = row(host);
  slider(ctl, { label: 'Shrink the ruler by', min: 0, max: 12, step: 0.1, value: 0, fmt: (v) => v.toFixed(1) + '%', oninput: (v) => { shrink = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Same angle, smaller ruler, closer CMB', col) + 6;
    const rd = RD * (1 - shrink / 100), H = (H0P * RD) / rd;
    // top panel: the triangle
    const y0 = top + 14, y1 = h * 0.56, ym = (y0 + y1) / 2;
    const xu = 26, xFar = w - 40, dist = (xFar - xu) * (rd / RD);
    const half = (y1 - y0) / 2 - 6;
    const x = xu + dist, hh = half * (rd / RD);
    line(ctx, [[xu, ym], [xFar, ym - half]], col.line, 1, [4, 4]);
    line(ctx, [[xu, ym], [xFar, ym + half]], col.line, 1, [4, 4]);
    line(ctx, [[xu, ym], [x, ym - hh]], col.s[0], 2);
    line(ctx, [[xu, ym], [x, ym + hh]], col.s[0], 2);
    line(ctx, [[x, ym - hh], [x, ym + hh]], col.s[3], 5);
    if (shrink > 0.3) line(ctx, [[xFar, ym - half], [xFar, ym + half]], col.muted, 2, [3, 4]);
    dot(ctx, xu, ym, 6, col.ink);
    text(ctx, 'us', xu - 6, ym + 16, { color: col.ink, size: 11.5, weight: 700 });
    text(ctx, 'ruler: sound horizon', x - 8, ym - hh - 10, { color: col.s[3], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, `${rd.toFixed(1)} Mpc`, x - 8, ym + hh + 10, { color: col.s[3], size: 11.5, align: 'right', halo: col.panel });
    text(ctx, 'θ* (measured)', xu + 18, ym - 12, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
    // bottom panel: where H0 lands
    const A = axes(ctx, w, h, col, { x: [64, 78], y: [0, 1], t: y1 + 30, b: 38, l: 18, r: 18, xlabel: 'H₀ (km/s/Mpc)', yt: [], xt: [64, 66, 68, 70, 72, 74, 76, 78] });
    ctx.save(); A.clip();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = col.s[0]; ctx.fillRect(A.X(66.9), A.T, A.X(67.9) - A.X(66.9), A.B - A.T);
    ctx.fillStyle = col.s[1]; ctx.fillRect(A.X(72.0), A.T, A.X(74.08) - A.X(72.0), A.B - A.T);
    ctx.globalAlpha = 1;
    ctx.restore();
    text(ctx, 'Planck', A.X(67.4), A.T + 10, { color: col.s[0], size: 11, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'SH0ES', A.X(73.04), A.T + 10, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel });
    const hx = A.X(Math.min(78, H));
    dot(ctx, hx, (A.T + A.B) / 2 + 6, 7, col.ink, col.panel);
    text(ctx, `${H.toFixed(1)}`, hx, (A.T + A.B) / 2 + 22, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
  };
  const upd = () => {
    const rd = RD * (1 - shrink / 100), H = (H0P * RD) / rd;
    out.innerHTML = `Ruler ${rd.toFixed(1)} Mpc → CMB ${shrink.toFixed(1)}% closer → <b>H₀ ≈ ${H.toFixed(1)}</b> km/s/Mpc. ${H >= 72 ? 'Now it matches the local ladder. The catch: the extra physics must not spoil the CMB peaks, galaxy clustering or the lensing data, and so far every model that does this pays somewhere.' : 'To reach about 73 the ruler must shrink by 7 to 8%.'}<br><small>Toy model: keeps H₀ × r<sub>d</sub> fixed, as CMB and BAO data roughly do.</small>`;
    cv.redraw();
  };
  upd();
}
