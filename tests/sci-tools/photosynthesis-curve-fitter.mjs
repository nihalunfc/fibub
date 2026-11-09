// #325 Photosynthesis curve fitter. References from SciPy 1.18 (Python, scratch script): scipy.optimize.curve_fit for
// the non-rectangular hyperbola (4 parameters, and θ fixed at 0.7) with standard errors from pcov; brentq for the
// light compensation and 90 % saturation points; least_squares (method 'lm', 16 starts) on the min(Ac, Aj) − Rd
// FvCB model for A/Ci, with curve_fit standard errors, brentq for the transition Ci and for Jmax. Made-up data.
import { fitLight, fitAci, jmaxFromJ, BERNACCHI_25, nrhGross } from '../../src/lib/sci/photosynth.ts';
const rel = (a, b, tol) => Math.abs(a / b - 1) < tol;
const I = [0, 25, 50, 100, 150, 200, 400, 600, 800, 1200, 1600, 2000], A = [-1.6, -0.17, 0.99, 3.29, 5.62, 7.45, 13.08, 16.0, 16.87, 18.11, 18.97, 19.28];
const Ci = [60, 100, 150, 200, 250, 300, 400, 600, 800, 1000, 1200, 1500], B = [0.4, 3.47, 7.52, 11.1, 13.5, 16.49, 20.75, 24.83, 26.04, 27.39, 27.68, 28.75];
export default async (check) => {
  const f = fitLight(I, A);
  check('photosynthesis: NRH Amax, φ, θ, Rd match scipy curve_fit', rel(f.amax, 21.81200227911964, 1e-6) && rel(f.phi, 0.052225822278522335, 1e-6) && rel(f.theta, 0.7891762015461435, 1e-6) && rel(f.rd, 1.5534484368459354, 1e-6));
  check('photosynthesis: NRH standard errors match scipy', [0.24739164678567974, 0.0016577956507801007, 0.024082044530284112, 0.11287477671003969].every((v, i) => rel(f.se[i], v, 1e-4)));
  check('photosynthesis: light compensation 30.23 and 90 % saturation 1159 µmol m⁻² s⁻¹ match brentq', rel(f.lcp, 30.22569547468905, 1e-6) && rel(f.isat, 1158.954111099369, 1e-5));
  const g = fitLight(I, A, 0.7);
  check('photosynthesis: NRH with θ fixed at 0.7 matches scipy', rel(g.amax, 22.514982164598102, 1e-6) && rel(g.phi, 0.05680037056381585, 1e-6) && rel(g.rd, 1.7064531818120334, 1e-6) && rel(g.se[3], 0.1460477480304074, 1e-4) && g.thetaFixed);
  check('photosynthesis: θ = 0 is the rectangular hyperbola', Math.abs(nrhGross(500, 20, 0.05, 0) - (25 * 20) / 45) < 1e-12);
  const a = fitAci(Ci, B);
  check('photosynthesis: A/Ci Vcmax, J, Rd match scipy least_squares on the min() model', rel(a.vcmax, 68.65285423145303, 1e-7) && rel(a.j, 128.56586544827022, 1e-7) && rel(a.rd, 1.142193664797026, 1e-6) && Math.abs(a.sse - 0.5941988993725253) < 1e-9);
  check('photosynthesis: A/Ci standard errors match scipy curve_fit', [0.9982158690579434, 1.03203957251206, 0.1943928237793052].every((v, i) => rel(a.se[i], v, 1e-5)));
  check('photosynthesis: transition Ci 464.5 and 7 Rubisco-limited points', rel(a.ciTransition, 464.5376867797563, 1e-8) && a.nRubisco === 7 && a.consistent);
  check('photosynthesis: Jmax from J (PPFD 1500, α 0.3, θ 0.7) matches brentq', rel(jmaxFromJ(a.j, 1500, 0.3, 0.7), 143.99283475398582, 1e-8) && Number.isNaN(jmaxFromJ(500, 1000, 0.3, 0.7)));
  const b = fitAci(Ci, B, { ...BERNACCHI_25, jA: 4.5, jB: 10.5 });
  check('photosynthesis: A/Ci with 4.5/10.5 electron requirement matches scipy', rel(b.vcmax, 68.59549591727425, 1e-7) && rel(b.j, 146.54551072155434, 1e-7) && rel(b.rd, 1.129301947330444, 1e-6));
  check('photosynthesis: a split set by Ci gives the same fit here', fitAci(Ci, B, BERNACCHI_25, 500).nRubisco === 7);
};
