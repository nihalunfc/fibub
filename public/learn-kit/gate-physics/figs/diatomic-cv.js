// 5.3 Heat capacity of a diatomic gas from the partition function: translation (3/2), rotation (quantum sum over J with
// the chosen θ_r) and vibration (Einstein function with θ_v). Log temperature axis; the classical equipartition plateaus
// at 3/2, 5/2 and 7/2 are marked. Rotation uses the heteronuclear sum (no ortho/para complication).
import { canvas, axes, line, row, choice, readout, title, text } from '../../kit.js';

const GASES = { HD: ['HD', 64.3, 5500], HCl: ['HCl', 15.2, 4300], CO: ['CO', 2.77, 3100], NO: ['NO', 2.45, 2720], ICl: ['ICl', 0.16, 550] };

function cRot(T, th) {
  // C/R = d/dT (T^2 d lnZ/dT) via numerical second derivative of ln Z in beta
  const lnZ = (b) => { let z = 0; for (let J = 0; J < 20000; J++) { const w = (2 * J + 1) * Math.exp(-J * (J + 1) * th * b); z += w; if (J > 5 && w < 1e-14 * z) break; } return Math.log(z); };
  const b = 1 / T, d = b * 1e-3;
  return b * b * (lnZ(b + d) - 2 * lnZ(b) + lnZ(b - d)) / (d * d);
}
const cVib = (T, th) => { const x = th / T; if (x > 200) return 0; return (x * x * Math.exp(x)) / (Math.exp(x) - 1) ** 2; };

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 250, label: 'Molar heat capacity of a diatomic gas against temperature, showing rotation and vibration switching on' });
  let gas = 'HCl';
  const ctl = row(host);
  choice(ctl, 'Molecule', Object.entries(GASES).map(([k, v]) => [k, `${v[0]} (θr = ${v[1]} K, θv = ${v[2]} K)`]), gas, (v) => { gas = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const [n, tr, tv] = GASES[gas];
    out.innerHTML = `${n}: rotation switches on near θ<sub>r</sub> = ${tr} K and vibration near θ<sub>v</sub>/3 ≈ ${Math.round(tv / 3)} K. At room temperature C<sub>V</sub>/R = <b>${(1.5 + cRot(300, tr) + cVib(300, tv)).toFixed(2)}</b>. Classical equipartition would give 7/2 at every temperature; the steps are quantum freezing of modes whose level spacing exceeds kT. (Real gases liquefy before the lowest step; this is the ideal-gas curve.)`;
  };
  cv.draw = (ctx, w, h, col) => {
    const [n, tr, tv] = GASES[gas];
    const ax = axes(ctx, w, h, col, { x: [0.01, 1e4], y: [0, 4], xlog: true, xlabel: 'temperature T (K, log scale)', ylabel: 'C_V / R', yt: [0, 1.5, 2.5, 3.5], t: 34 });
    title(ctx, `${n}: C_V/R = 3/2 + rotation + vibration`, col);
    ctx.save(); ax.clip();
    for (const v of [1.5, 2.5, 3.5]) line(ctx, [[ax.L, ax.Y(v)], [ax.R, ax.Y(v)]], col.muted, 1, [4, 4]);
    const pts = [];
    for (let i = 0; i <= 360; i++) { const T = 10 ** (-2 + (6 * i) / 360); pts.push([ax.X(T), ax.Y(1.5 + cRot(T, tr) + cVib(T, tv))]); }
    line(ctx, pts, col.s[0], 2.5);
    ctx.restore();
    text(ctx, 'translation only', ax.L + 6, ax.Y(1.5) - 9, { color: col.muted, size: 11, halo: col.panel });
    text(ctx, '+ rotation', ax.L + 6, ax.Y(2.5) - 9, { color: col.muted, size: 11, halo: col.panel });
    text(ctx, '+ vibration', ax.L + 6, ax.Y(3.5) - 9, { color: col.muted, size: 11, halo: col.panel });
  };
  cv.redraw(); show();
}
