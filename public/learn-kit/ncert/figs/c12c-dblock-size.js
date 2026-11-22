// Class 12 Chemistry, d- and f-block: metallic radii across the 3d, 4d and 5d series (groups 3 to 12).
// Across a series the radius falls then rises a little: added d electrons shield each other poorly. From 4d to 5d the radius hardly grows because the 4f electrons of the
// lanthanoids shield very poorly (lanthanoid contraction): Zr and Hf, Nb and Ta, Mo and W are almost the same size.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

const R = { '3d': [162, 147, 134, 128, 127, 126, 125, 124, 128, 134], '4d': [180, 160, 146, 139, 136, 134, 134, 137, 144, 151], '5d': [174, 159, 146, 139, 137, 135, 136, 139, 144, 151] };
const SYM = { '3d': ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'], '4d': ['Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd'], '5d': ['Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg'] };

export default function (host) {
  let g = 1, show = 'all';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Metallic radii of the 3d, 4d and 5d transition series against group number' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'group', min: 3, max: 12, step: 1, value: 4, fmt: (v) => v, oninput: (v) => { g = v - 3; go(); } });
  choice(ctl, 'series', [['all', 'all'], ['3d', '3d'], ['4d', '4d'], ['5d', '5d']], 'all', (v) => { show = v; go(); });
  const go = () => {
    ro.textContent = `Group ${g + 3}: ${SYM['3d'][g]} ${R['3d'][g]} pm, ${SYM['4d'][g]} ${R['4d'][g]} pm, ${SYM['5d'][g]} ${R['5d'][g]} pm. 5d minus 4d = ${R['5d'][g] - R['4d'][g]} pm` + (g >= 1 && g <= 8 ? ' (almost no gain: lanthanoid contraction).' : '.');
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Metallic radius (pm) across the series', col);
    const A = axes(ctx, w, h, col, { x: [2.5, 12.5], y: [115, 190], xt: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], xlabel: 'group number', ylabel: 'radius (pm)', l: 48, t: 32, b: 40 });
    ctx.fillStyle = col.soft; ctx.globalAlpha = 0.8; ctx.fillRect(A.X(g + 2.5), A.T, A.X(g + 3.5) - A.X(g + 2.5), A.B - A.T); ctx.globalAlpha = 1;
    ['3d', '4d', '5d'].forEach((s, si) => {
      if (show !== 'all' && show !== s) return;
      const pts = R[s].map((v, i) => [A.X(i + 3), A.Y(v)]);
      line(ctx, pts, col.s[[0, 2, 3][si]], 2.5); pts.forEach((p) => dot(ctx, p[0], p[1], 3.5, col.s[[0, 2, 3][si]], col.panel));
      text(ctx, s, A.X(12) - 4, A.Y(R[s][9]) + (si === 2 ? 11 : -9) , { color: col.s[[0, 2, 3][si]], size: 11.5, weight: 700, align: 'right' });
    });
  };
  go();
}
