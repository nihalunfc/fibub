// Figures for src/blog/discoveries/jason-2-laser-time-transfer-gravitational-redshift-clock-rate.md, made with the
// maths of the GPS relativity explainer (src/lib/sci/phgps.ts: shift, satellite, ground, eccAmp, balanceRadius, exactRatio).
// Run: node scripts/blog-figures/jason-2-laser-time-transfer-gravitational-redshift-clock-rate.mjs
import fs from 'node:fs';
import { shift, satellite, ground, eccAmp, balanceRadius, exactRatio, GM, C, DAY } from '../../src/lib/sci/phgps.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/jason-2-laser-time-transfer-gravitational-redshift-clock-rate.md', import.meta.url);

// From the paper: Ruby et al. (2026), Eur. Phys. J. C 86: 682 (CC BY 4.0).
// Jason-2: altitude about 1335 km, geocentric perigee/apogee about 7715/7718 km, eccentricity about 0.001,
// inclination 66 deg, mean speed about 7.2 km/s. Test result: alpha = (-0.77 +/- 3.54) x 10^-3 from 47 passes (~12 h).
// T2L2 timing accuracy better than 100 ps. Master station: Grasse MeO, France.
const A = 7716.5e3;            // semi-major axis (m), the mean of the quoted perigee and apogee
const ECC = 0.001;
const LAT = 43.75, H = 1320;   // Grasse, France: latitude and height above sea level (our values, from the station's publicly known site)
const ALPHA_SE = 3.54e-3;      // the paper's precision on the redshift parameter
const T2L2_PS = 100;           // the paper's stated overall timing accuracy

const s = shift(A, LAT, H), sat = satellite(A), grd = ground(LAT, H);
const rb = balanceRadius(LAT, H);
const exact = exactRatio(A, LAT, H);
const amp = eccAmp(A, ECC);
// What clock-rate precision the paper's alpha uncertainty corresponds to, and the time error it allows per pass.
const gravFrac = s.grav;                       // the gravitational part alone: the quantity the redshift test weighs
const rateNeeded = ALPHA_SE * Math.abs(gravFrac);
const perPass = (pass) => rateNeeded * pass * 1e12; // ps of accumulated clock error over a pass of `pass` seconds

const km = Array.from({ length: 201 }, (_, i) => 6600e3 + i * ((30000e3 - 6600e3) / 200));
const rows = km.map((a) => shift(a, LAT, H));
const fig1 = chart({
  title: 'Satellite clock rate against orbit radius',
  xLabel: 'Orbit radius from Earth’s centre (1000 km)', yLabel: 'Clock gain (µs/day)',
  series: [
    { name: 'Gravity (runs fast)', kind: 'line', x: km.map((a) => a / 1e6), y: rows.map((r) => +r.usPerDay.grav.toFixed(3)) },
    { name: 'Speed (runs slow)', kind: 'line', x: km.map((a) => a / 1e6), y: rows.map((r) => +r.usPerDay.vel.toFixed(3)) },
    { name: 'Net', kind: 'line', x: km.map((a) => a / 1e6), y: rows.map((r) => +r.usPerDay.net.toFixed(3)), colour: 'var(--ink)' },
  ],
  xDomain: [6.6, 30], yDomain: [-25, 50],
  hlines: [{ y: 0, text: '' }],
  vlines: [{ x: A / 1e6, text: 'Jason-2', left: true }, { x: rb / 1e6, text: 'break-even' }],
  desc: 'How much faster a satellite clock runs than one at Grasse, against orbit radius: the gravitational gain, the speed loss and the net. The net crosses zero at the break-even radius of about 9545 km, well above Jason-2.',
  height: 300,
});

const Edeg = Array.from({ length: 181 }, (_, i) => i * 2);
const fig2 = chart({
  title: 'The eccentricity term over one Jason-2 orbit',
  xLabel: 'Eccentric anomaly E (degrees)', yLabel: 'Clock offset (ns)',
  series: [{ name: 'e = 0.001', kind: 'line', x: Edeg, y: Edeg.map((d) => +(amp * Math.sin((d * Math.PI) / 180) * 1e9).toFixed(4)) }],
  xDomain: [0, 360], yDomain: [-1.6, 1.6],
  hlines: [{ y: T2L2_PS / 1000, text: '±100 ps: the laser link’s accuracy' }, { y: -T2L2_PS / 1000, text: '' }, { y: 0, text: '' }],
  desc: `The periodic eccentricity correction for Jason-2's almost circular orbit, amplitude ${(amp * 1e9).toFixed(2)} nanoseconds, against the laser time transfer accuracy of about 100 picoseconds.`,
  height: 270,
});

console.log(JSON.stringify({
  v_kms: +(sat.v / 1000).toFixed(3), period_min: +(sat.period / 60).toFixed(2),
  grav_fraction: gravFrac, grav_usday: +s.usPerDay.grav.toFixed(4),
  vel_usday: +s.usPerDay.vel.toFixed(4), net_usday: +s.usPerDay.net.toFixed(4), net_fraction: s.net,
  ground_v_ms: +grd.v.toFixed(1),
  km_per_day: +s.kmPerDay.toFixed(3),
  balance_km: +(rb / 1000).toFixed(1), balance_alt_km: +(rb / 1000 - 6371).toFixed(1),
  alt_km: +(A / 1000 - 6371).toFixed(1),
  exact_vs_first_order: { exact, first: s.net, diff_ns_per_day: +((exact - s.net) * DAY * 1e9).toFixed(3) },
  ecc_amp_ns: +(amp * 1e9).toFixed(3), ecc_amp_range_m: +(amp * C).toFixed(3),
  rate_needed: rateNeeded, rate_needed_ns_day: +(rateNeeded * DAY * 1e9).toFixed(2),
  ps_over_1000s: +perPass(1000).toFixed(1), ps_over_12h: +perPass(12 * 3600).toFixed(0),
  gps_net_usday: +shift(26560e3, LAT, H).usPerDay.net.toFixed(2),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rate', figure(fig1, 'Figure 1. The two relativistic clock effects against orbit radius, worked out with the GPS relativity explainer’s maths for a receiver at Grasse (43.75° N, 1320 m). Jason-2 sits well below the break-even radius, so its clock loses time; GPS, off the right of the chart, gains 38 µs a day.'));
  md = inject(md, 'ecc', figure(fig2, 'Figure 2. The periodic eccentricity term for an orbit as round as Jason-2’s (e = 0.001) is still about ±1.2 ns, more than ten times the laser link’s timing accuracy, so it has to be modelled rather than ignored.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
