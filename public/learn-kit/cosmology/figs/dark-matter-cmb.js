// 8.4 How a small lump grows, with and without dark matter (a simplified linear model, numbers rounded).
// Dark matter feels no pressure from light, so once its lump is inside the horizon it grows: slowly (about
// logarithmically) while radiation rules, then in step with the size of the universe a after matter-radiation
// equality (a_eq = 1/3400; Meszaros growth 1 + 1.5 a/a_eq), slowed at the end by dark energy (growth suppression
// factor of Carroll, Press and Turner 1992). Atoms are tied to light until recombination (a = 1/1090): their lump
// only oscillates, about 1 part in 10,000. After that they fall into the dark matter's wells and catch up,
// δ_b = δ_c (1 − a_rec/a) (the classic catch-up solution). Without dark matter, the atoms' lump starts growing only
// at recombination, from 10⁻⁴, and with only 5% of the critical density in matter it grows even more slowly.
import { canvas, axes, text, title, line, row, choice, readout } from '../../kit.js';

const AEQ = 1 / 3400, AREC = 1 / 1090, AIN = 1e-5;
const supp = (a, Om) => { // growth suppression by dark energy, normalised to 1 early on
  const om = (Om / a ** 3) / (Om / a ** 3 + (1 - Om)), ol = 1 - om;
  return (2.5 * om) / (om ** (4 / 7) - ol + (1 + om / 2) * (1 + ol / 70));
};
const raw = (a) => (1 + 1.5 * a / AEQ) * (1 + 0.6 * Math.log(Math.min(a, AEQ) / AIN)) * supp(a, 0.31);
const dc = (a) => 3e-3 * raw(a) / raw(AREC); // dark matter lump: 3 × 10⁻³ at recombination
const osc = (a) => 1e-4 * (0.25 + 0.75 * Math.abs(Math.cos(2 * Math.PI * 3.5 * Math.sqrt(a / AREC))));
const dbWith = (a) => (a < AREC ? osc(a) : dc(a) * (1 - AREC / a) + osc(AREC));
const dbWithout = (a) => (a < AREC ? osc(a) : osc(AREC) * (a / AREC) * supp(a, 0.05));

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 300, label: 'How lumpy dark matter and atoms become as the universe grows, with and without dark matter' });
  let dm = true;
  const ctl = row(host);
  choice(ctl, 'Universe', [[true, 'With dark matter'], [false, 'Atoms only']], true, (v) => { dm = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    out.innerHTML = dm
      ? `Dark matter's lump has been growing since early on and is already about <b>30 times</b> lumpier than the atoms at recombination. The atoms then fall into its wells and catch up. Today the lump reaches about <b>${dc(1).toFixed(1)}</b>: past 1, so it has collapsed into a galaxy (in reality, long ago).`
      : `With atoms alone, the lump can only start growing when light lets go at recombination, from about 1 part in 10,000. By today it reaches only about <b>${dbWithout(1).toFixed(2)}</b>: no galaxies, no stars, no us.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [1e-5, 1], y: [1e-6, 10], xlog: true, ylog: true, t: 62, xlabel: 'Size of the universe, a (today = 1)', ylabel: 'Lumpiness, δ' });
    const mark = (a, label, al) => { line(ctx, [[A.X(a), A.T - 4], [A.X(a), A.B]], col.muted, 1, [3, 3]); text(ctx, label, A.X(a) + (al === 'right' ? -3 : 3), A.T - 9, { color: col.muted, size: 10.5, align: al, halo: col.panel }); };
    mark(AEQ, 'matter takes over', 'right'); mark(AREC, 'recombination', 'left');
    line(ctx, [[A.L, A.Y(1)], [A.R, A.Y(1)]], col.s[3], 1.5, [6, 3]);
    text(ctx, 'lumps collapse into galaxies', A.L + 6, A.Y(1) - 9, { color: col.s[3], size: 10.5, weight: 600, halo: col.panel });
    ctx.save(); A.clip();
    const pts = (f) => { const p = []; for (let i = 0; i <= 400; i++) { const a = 10 ** (-5 + (i / 400) * 5); p.push([A.X(a), A.Y(Math.max(1e-7, f(a)))]); } return p; };
    if (dm) line(ctx, pts(dc), col.s[6], 3);
    line(ctx, pts(dm ? dbWith : dbWithout), col.s[1], 2.5);
    ctx.restore();
    const ly = A.B - 12;
    if (dm) text(ctx, '— dark matter', A.R - 6, ly - 15, { color: col.s[6], size: 11, weight: 700, align: 'right', halo: col.panel });
    text(ctx, '— atoms (ordinary matter)', A.R - 6, ly, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel });
    title(ctx, dm ? 'A lump grows: with dark matter' : 'A lump grows: atoms only', col);
  };
  cv.redraw(); show();
}
