// Class 12 Nuclei: binding energy per nucleon (BE/A) against mass number. It climbs steeply to about 8 MeV by A ~ 20, peaks near iron-56 / nickel-62 (about 8.8 MeV) and then
// falls slowly to 7.6 MeV for uranium. Light nuclei release energy by fusion (moving up the left slope), heavy nuclei by fission (moving up the right slope).
// Values: AME2020 binding energies (IAEA Nuclear Data Services). Hover, tap or use the slider to read any nuclide.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

const D = [['H-2', 2, 1.112], ['H-3', 3, 2.827], ['He-3', 3, 2.573], ['He-4', 4, 7.074], ['Li-6', 6, 5.332], ['Li-7', 7, 5.606], ['Be-9', 9, 6.463], ['C-12', 12, 7.680], ['N-14', 14, 7.476], ['O-16', 16, 7.976],
  ['Ne-20', 20, 8.032], ['Mg-24', 24, 8.261], ['Si-28', 28, 8.448], ['Ca-40', 40, 8.551], ['Fe-56', 56, 8.790], ['Ni-62', 62, 8.795], ['Zn-64', 64, 8.736], ['Kr-84', 84, 8.717], ['Sn-120', 120, 8.505], ['Ba-138', 138, 8.393], ['Pb-208', 208, 7.867], ['U-235', 235, 7.591], ['U-238', 238, 7.570]];
const LINE = D.filter((d) => d[0] !== 'H-3' && d[0] !== 'He-3').sort((a, b) => a[1] - b[1]);

export default function (host) {
  let k = 14, zones = true;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Binding energy per nucleon against mass number with a peak near iron' });
  const ctl = row(host), ro = readout(host);
  const sl = slider(ctl, { label: 'nuclide', min: 0, max: D.length - 1, step: 1, value: k, fmt: (v) => D[Math.round(v)][0], oninput: (v) => { k = Math.round(v); go(); } });
  choice(ctl, 'Regions', [[true, 'Show'], [false, 'Hide']], zones, (v) => { zones = v; cv.redraw(); });
  let G = {};
  const go = () => { const [n, a, e] = D[k]; ro.textContent = `${n}: BE/A = ${e.toFixed(2)} MeV, total binding energy = ${(e * a).toFixed(1)} MeV.  ${a < 56 ? 'Joining with another light nucleus (fusion) would move it up the curve and release energy.' : a > 62 ? 'Splitting (fission) would give more tightly bound pieces and release energy.' : 'Most tightly bound region: neither fusion nor fission releases energy.'}`; cv.redraw(); };
  const pick = (e) => { const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left; let best = 0, bd = 1e9; D.forEach((d, i) => { const dx = Math.abs(G.X(d[1]) - x); if (dx < bd) { bd = dx; best = i; } }); k = best; sl.set(k); go(); };
  cv.c.addEventListener('pointermove', (e) => e.pointerType === 'mouse' && G.X && pick(e)); cv.c.addEventListener('pointerdown', (e) => G.X && pick(e));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Binding energy per nucleon', col);
    const A = axes(ctx, w, h, col, { x: [0, 250], y: [0, 10], xlabel: 'mass number A', ylabel: 'BE per nucleon (MeV)', l: 40, t: top + 10, b: 38 }); G = A;
    if (zones) {
      ctx.save(); A.clip(); ctx.globalAlpha = 0.13; ctx.fillStyle = col.s[2]; ctx.fillRect(A.L, A.T, A.X(56) - A.L, A.B - A.T); ctx.fillStyle = col.s[3]; ctx.fillRect(A.X(62), A.T, A.R - A.X(62), A.B - A.T); ctx.globalAlpha = 1; ctx.restore();
      text(ctx, 'fusion', A.X(28), A.B - 14, { color: col.s[2], size: 11.5, weight: 700, align: 'center' }); text(ctx, 'fission', A.X(160), A.B - 14, { color: col.s[3], size: 11.5, weight: 700, align: 'center' });
    }
    ctx.save(); A.clip(); line(ctx, LINE.map((d) => [A.X(d[1]), A.Y(d[2])]), col.s[0], 2.5); ctx.restore();
    D.forEach((d) => dot(ctx, A.X(d[1]), A.Y(d[2]), 3, col.s[0]));
    const [n, a, e] = D[k]; dot(ctx, A.X(a), A.Y(e), 6.5, col.s[3], col.panel);
    text(ctx, `${n}: ${e.toFixed(2)}`, Math.min(A.R - 40, Math.max(A.L + 36, A.X(a))), A.Y(e) - 14, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'Fe-56', A.X(56), A.Y(8.79) - 26, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
