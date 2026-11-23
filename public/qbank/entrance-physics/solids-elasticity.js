// Solids and elasticity: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

const r = String.raw;
const EX = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const PI = Math.PI; const G = 9.8;
let k = 0; let c = 0;
const nid = () => `se-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: EX[level], sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const nat = (level, sub, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  if (tol === 0 && !Number.isInteger(answer)) throw new Error('integer answer expected: ' + q.slice(0, 50) + ' ' + answer);
  return base(level, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol: typeof sol === 'function' ? sol(answer) : sol, ...o });
};
const nx = (fn) => { const [l, s, q, a, t, d, sol, o] = fn(); return nat(l, s, q, () => a, t, d, sol, o); };
const mn = (level, sub, q, val, wrongs, unit, sig, sol, o = {}) => {
  const F = (v) => fmt(v, sig) + (unit ? ' ' + unit : '');
  const cor = F(val); const ws = [...new Set(wrongs.map(F))].filter((x) => x !== cor);
  if (ws.length < 3) throw new Error('mn options: ' + q.slice(0, 50) + ' ' + ws);
  return mcq(level, sub, q, cor, ws.slice(0, 3), sol, o);
};
const mx = (fn) => mn(...fn());
const msq = (level, sub, q, options, answer, sol, o = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const asrt = (level, sub, A, R, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AOPT, answer, sol, ...o });
const SOPT = [
  'Both Statement I and Statement II are true',
  'Both Statement I and Statement II are false',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
];
const stm = (level, sub, I, II, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SOPT, answer, sol, ...o });
const fT = (x, sig = 3) => {
  const a = Math.abs(x);
  if (!isFinite(x) || a === 0 || (a < 1e5 && a >= 1e-3)) return fmt(x, sig);
  const e = Math.floor(Math.log10(a)); let m = +(x / 10 ** e).toPrecision(sig);
  if (Math.abs(m) >= 10) { m = +(m / 10).toPrecision(sig); return `${m}\\times10^{${e + 1}}`; }
  return `${m}\\times10^{${e}}`;
};
const f = (x) => fT(x, 3);
const R = (x, dp) => +x.toFixed(dp);

const items = [
  // ---------- Level 1 ----------
  nx(() => { const F = 500, A = 2e-4; return [1, 'stress', r`A force of 500 N pulls along the length of a rod whose cross-section is $2\times10^{-4}\ \mathrm{m^2}$. Find the stress in the rod (in kPa).`, F / A / 1e3, 0, 0, r`Stress $=F/A = 500/(2\times10^{-4}) = 2.5\times10^{6}$ Pa $= 2500$ kPa.`, { unit: 'kPa' }]; }),
  mcq(1, 'strain', r`Longitudinal strain is defined as`, 'change in length divided by original length', ['force per unit area', 'original length divided by change in length', 'change in volume divided by pressure'],
    r`Strain $=\Delta L/L$: a ratio of two lengths. It has no unit and no dimensions. The other options describe stress, an inverted ratio and the inverse of the bulk modulus.`),
  mcq(1, 'units', r`The SI unit of Young's modulus is`, r`$\mathrm{N\,m^{-2}}$ (pascal)`, [r`$\mathrm{N\,m^{-1}}$`, r`$\mathrm{N\,m}$`, 'no unit'],
    r`$Y = \text{stress}/\text{strain}$. Strain has no unit, so $Y$ has the unit of stress, $\mathrm{N\,m^{-2}}$ = Pa.`),
  mcq(1, "Hooke's law", r`Hooke's law says that, within the elastic limit,`, 'stress is directly proportional to strain', ['strain is inversely proportional to stress', 'stress is proportional to the square of strain', 'stress is independent of strain'],
    r`The straight part of the stress-strain graph from the origin is Hooke's law. The slope is the modulus of elasticity.`),
  nx(() => { const dL = 2e-3, L = 2; return [1, 'strain', r`A wire 2 m long stretches by 2 mm under a load. Find the strain in units of $10^{-3}$.`, dL / L / 1e-3, 0, 0, r`Strain $=\Delta L/L = 2\times10^{-3}/2 = 1\times10^{-3}$. In units of $10^{-3}$ the answer is 1.`, {}]; }),
  mcq(1, "Young's modulus", r`Which of these has the largest Young's modulus?`, 'steel', ['rubber', 'lead', 'human bone'],
    r`Steel is about $2\times10^{11}$ Pa, bone about $10^{10}$ Pa, lead about $1.6\times10^{10}$ Pa and rubber only about $10^{6}$ to $10^{7}$ Pa. A material with larger $Y$ is stiffer.`),
  mcq(1, 'moduli', r`Which modulus of elasticity is meaningful for a liquid?`, 'bulk modulus', ["Young's modulus", 'modulus of rigidity', "Poisson's ratio"],
    r`A liquid takes the shape of its container, so it has no shear modulus. It resists a change of volume, so it has a bulk modulus. A liquid in a container is not stretched along a line, so $Y$ does not apply either.`),
  mcq(1, 'dimensions', r`The dimensional formula of Young's modulus is`, r`$\mathrm{ML^{-1}T^{-2}}$`, [r`$\mathrm{MLT^{-2}}$`, r`$\mathrm{ML^{2}T^{-2}}$`, r`$\mathrm{M^{0}L^{0}T^{0}}$`],
    r`Same as stress or pressure: force over area $=\mathrm{MLT^{-2}/L^2} = \mathrm{ML^{-1}T^{-2}}$.`),
  mcq(1, 'elasticity', r`A body is perfectly elastic if it`, 'regains its original size and shape completely when the deforming force is removed', ['never changes its shape', 'breaks when a force is applied', 'keeps the new shape after the force is removed'],
    r`That is the definition. Quartz and phosphor bronze are close to perfectly elastic. A body that keeps the new shape is called plastic (putty is an example).`),
  nx(() => { const s = 4e8, e = 2e-3; return [1, "Young's modulus", r`A wire carries a stress of $4\times10^{8}\ \mathrm{N\,m^{-2}}$ and shows a strain of $2\times10^{-3}$. Find its Young's modulus (in units of $10^{11}\ \mathrm{N\,m^{-2}}$).`, s / e / 1e11, 0, 0, r`$Y = \sigma/\varepsilon = 4\times10^{8}/(2\times10^{-3}) = 2\times10^{11}$ Pa, so the answer is 2.`, {}]; }),
  mcq(1, 'bulk modulus', r`The bulk modulus is the ratio of`, 'the pressure change to the fractional change in volume (with a minus sign)', ['tangential force to area', 'longitudinal stress to longitudinal strain', 'lateral strain to longitudinal strain'],
    r`$B = -\Delta P/(\Delta V/V)$. The minus sign makes $B$ positive, because volume falls when pressure rises. Longitudinal stress over strain is $Y$, lateral over longitudinal strain is Poisson's ratio, and tangential force over area is a shear stress.`),
  mcq(1, 'moduli', r`Twisting a metal rod about its length is mainly opposed by its`, 'modulus of rigidity (shear modulus)', ['bulk modulus', "Young's modulus", 'compressibility'],
    r`Twisting slides each layer over the next one. This is a shear, so the shear (rigidity) modulus matters.`),
  mcq(1, 'compressibility', r`The compressibility of a material is`, 'the reciprocal of its bulk modulus', ['equal to its bulk modulus', "equal to its Young's modulus", 'the reciprocal of its density'],
    r`$k = 1/B = -\dfrac{1}{V}\dfrac{\mathrm{d}V}{\mathrm{d}P}$. A highly compressible material has a small bulk modulus. Gases are far more compressible than liquids.`),
  nx(() => { const Y = 2e11, A = 1e-6, e = 1e-3; return [1, "Hooke's law", r`A steel wire of cross-section $1\ \mathrm{mm^2}$ has $Y = 2\times10^{11}\ \mathrm{N\,m^{-2}}$. What load (in N) produces a strain of $10^{-3}$?`, Y * A * e, 0, 0, r`$F = YA\varepsilon = 2\times10^{11}\times10^{-6}\times10^{-3} = 200$ N. Remember $1\ \mathrm{mm^2} = 10^{-6}\ \mathrm{m^2}$.`, { unit: 'N' }]; }),
  mcq(1, 'elastic limit', r`The elastic limit of a wire is the stress beyond which`, 'the wire does not return to its original length when the load is removed', ['the wire breaks at once', 'stress becomes proportional to strain', 'the wire becomes perfectly elastic'],
    r`Beyond the elastic limit some permanent set remains (plastic deformation). The wire does not have to break there; breaking happens at a much larger stress.`),
  mcq(1, 'elasticity', r`Steel is more elastic than rubber because, for the same stress,`, 'steel shows a smaller strain', ['steel shows a larger strain', 'steel shows no strain at all', 'rubber has a larger Young\'s modulus'],
    r`In physics, "more elastic" means a larger modulus (a bigger restoring stress for the same strain). Steel has $Y\sim2\times10^{11}$ Pa and so a much smaller strain than rubber.`),
  mcq(1, "Poisson's ratio", r`Poisson's ratio of a material is`, 'a pure number', [r`measured in $\mathrm{N\,m^{-2}}$`, r`measured in $\mathrm{N\,m^{-1}}$`, 'measured in metre'],
    r`It is lateral strain divided by longitudinal strain: a ratio of two strains, so it has no unit. For most materials it lies between 0 and 0.5.`),
  mcq(1, 'elastic energy', r`The elastic energy stored per unit volume in a stretched wire is`, r`$\tfrac12\times\text{stress}\times\text{strain}$`, [r`stress $\times$ strain`, r`$\tfrac12\times\text{stress}/\text{strain}$`, r`stress$^2\times$strain`],
    r`Work done $=\tfrac12 F\Delta L$ (the area under the force-extension line). Dividing by volume $AL$ gives $\tfrac12\,\dfrac{F}{A}\,\dfrac{\Delta L}{L}$.`),
  mcq(1, 'extension', r`A wire stretches by 1 mm under a load of 2 kg. Within the elastic limit, a load of 6 kg (same wire) will stretch it by`, '3 mm', ['2 mm', '6 mm', '9 mm'],
    r`Extension is proportional to load: $\Delta L\propto F$. Tripling the load triples the extension: $3\times1 = 3$ mm.`),
  mcq(1, 'stress', r`Stress produced in a wire depends on`, 'the load and the area of cross-section, but not on the length', ['the load and the length only', 'the length and the material only', 'the material only'],
    r`Stress is $F/A$. The length of the wire does not enter. (Extension does depend on the length, strain does not.)`),

  // ---------- Level 2 ----------
  nx(() => { const F = 20 * G, L = 2, d = 1e-3, Y = 2e11; const A = PI * d * d / 4; const x = F * L / (A * Y) * 1e3; return [2, 'extension of a wire', r`A steel wire of length 2 m and diameter 1 mm carries a 20 kg load. Find its extension (in mm, 2 decimals). $Y = 2\times10^{11}\ \mathrm{N\,m^{-2}}$, $g = 9.8\ \mathrm{m\,s^{-2}}$.`, x, 0.02, 2, r`$F = 20\times9.8 = 196$ N. $A=\pi d^2/4 = 7.854\times10^{-7}\ \mathrm{m^2}$. $\Delta L = \dfrac{FL}{AY} = \dfrac{196\times2}{7.854\times10^{-7}\times2\times10^{11}} = ${f(x)}$ mm.`, { unit: 'mm', trap: 'Use the area from the diameter: radius is half of 1 mm.' }]; }),
  mx(() => { const F = 150, d = 2e-3; const s = F / (PI * d * d / 4); return [2, 'stress', r`A wire of diameter 2 mm supports a load of 150 N. The stress in it is`, s / 1e6, [s / 1e6 * 4, s / 1e6 / 2, s / 1e6 * 2], 'MPa', 3, r`$A = \pi d^2/4 = \pi\times(2\times10^{-3})^2/4 = 3.14\times10^{-6}\ \mathrm{m^2}$. $\sigma = 150/3.14\times10^{-6} = ${f(s / 1e6)}$ MPa. Using the diameter as the radius would give a quarter of this, and using $\pi d^2$ gives a quarter too.`, { trap: 'Radius, not diameter, in $\\pi r^2$.' }]; }),
  nx(() => { const F = 100, x = 2e-3; return [2, 'elastic energy', r`A wire is stretched by 2 mm by a load of 100 N applied slowly within the elastic limit. How much elastic energy (in J) is stored in it?`, 0.5 * F * x, 0.001, 3, r`$U = \tfrac12F\Delta L = 0.5\times100\times2\times10^{-3} = 0.1$ J. Using $F\Delta L$ would give 0.2 J, which is the work done by a load that drops freely and falls through 2 mm. Half of that is lost as heat and sound.`, { unit: 'J', trap: 'The factor $\\tfrac12$ (the force grows from zero).' }]; }),
  mx(() => { const Y = 2e11, e = 1e-3; const u = 0.5 * Y * e * e; return [2, 'energy density', r`A wire of $Y = 2\times10^{11}$ Pa is stretched to a strain of $10^{-3}$. The elastic energy stored per unit volume is`, u, [Y * e * e, 0.5 * Y * e, u / 2], r`J m<sup>-3</sup>`, 3, r`$u = \tfrac12Y\varepsilon^2 = 0.5\times2\times10^{11}\times10^{-6} = 1\times10^{5}\ \mathrm{J\,m^{-3}}$.`]; }),
  nx(() => { const F = 100, A = 1e-6, Y = 2e11, L1 = 1.5, L2 = 0.5; const x = F * (L1 + L2) / (A * Y) * 1e3; return [2, 'wires in series', r`Two steel wires of lengths 1.5 m and 0.5 m, both of cross-section $1\ \mathrm{mm^2}$, are joined end to end and a 100 N load is hung from the free end. Find the total extension (in mm). $Y = 2\times10^{11}$ Pa.`, x, 0.005, 3, r`In series, both wires carry the same force (100 N). Total extension $=\dfrac{F(L_1+L_2)}{AY} = \dfrac{100\times2}{10^{-6}\times2\times10^{11}} = 10^{-3}$ m $= ${f(x)}$ mm.`, { unit: 'mm' }]; }),
  mx(() => { const W = 300; const F1 = W * 2 / 3; return [2, 'wires in parallel', r`A steel wire and a brass wire have the same length and area. They hang side by side and together carry a 300 N load, both stretching equally. If $Y_\text{steel} = 2\times10^{11}$ Pa and $Y_\text{brass} = 1\times10^{11}$ Pa, the steel wire carries`, F1, [100, 150, 250], 'N', 3, r`Equal extension means $F/(AY)\cdot L$ is the same, so $F\propto Y$. Shares: steel : brass = 2 : 1. Steel carries $\tfrac23\times300 = 200$ N.`, { trap: 'The stiffer wire takes the larger share.' }]; }),
  nx(() => { const Y = 2e11, a = 1.2e-5, t = 50; return [2, 'thermal stress', r`A steel rod is clamped rigidly at both ends at 20 °C and then heated to 70 °C. Find the thermal stress in it (in MPa). $Y = 2\times10^{11}$ Pa, $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$.`, Y * a * t / 1e6, 0, 0, r`The rod tries to expand by a strain $\alpha\Delta T$ but cannot. Stress $=Y\alpha\Delta T = 2\times10^{11}\times1.2\times10^{-5}\times50 = 1.2\times10^{8}$ Pa $= 120$ MPa.`, { unit: 'MPa' }]; }),
  mx(() => { const B = 2.2e9, dP = 2e7; const e = dP / B * 100; return [2, 'bulk modulus', r`The bulk modulus of water is $2.2\times10^{9}$ Pa. When the pressure on it rises by $2\times10^{7}$ Pa, its volume decreases by (in percent)`, e, [e / 100, e * 10, 2.2 / 2 * 10], '%', 3, r`$\dfrac{\Delta V}{V} = \dfrac{\Delta P}{B} = \dfrac{2\times10^{7}}{2.2\times10^{9}} = 9.09\times10^{-3} = 0.909\%$.`, {}]; }),
  nx(() => { const rho = 7800, L = 100, Y = 2e11; return [2, 'wire under its own weight', r`A uniform steel wire 100 m long hangs from a support. Find its extension due to its own weight alone (in mm, 2 decimals). $\rho = 7800\ \mathrm{kg\,m^{-3}}$, $Y = 2\times10^{11}$ Pa, $g = 9.8\ \mathrm{m\,s^{-2}}$.`, rho * G * L * L / (2 * Y) * 1e3, 0.02, 2, r`The stress at distance $x$ from the free end is $\rho g x$, so $\Delta L = \displaystyle\int_0^L\frac{\rho g x}{Y}\mathrm{d}x = \dfrac{\rho gL^2}{2Y} = \dfrac{7800\times9.8\times10^4}{2\times2\times10^{11}} = ${f(rho * G * L * L / (2 * Y) * 1e3)}$ mm.`, { unit: 'mm', trap: 'The factor 2: the weight acts like a load of half of the wire at the end.' }]; }),
  nx(() => { const s = 0.3, e = 2e-3; return [2, "Poisson's ratio", r`A rod with Poisson's ratio 0.3 is stretched to a longitudinal strain of $2\times10^{-3}$. Find the lateral (sideways) contraction strain, in units of $10^{-4}$.`, s * e / 1e-4, 0, 0, r`Lateral strain $=\sigma\times$ longitudinal strain $= 0.3\times2\times10^{-3} = 6\times10^{-4}$.`, {}]; }),
  nx(() => { const F = 8e3, A = 0.01, eta = 4e10; return [2, 'shear', r`A tangential force of 8000 N acts on the top face (area $0.01\ \mathrm{m^2}$) of a metal block whose modulus of rigidity is $4\times10^{10}$ Pa. Find the shear angle in units of $10^{-5}$ rad.`, F / A / eta / 1e-5, 0, 0, r`Shear stress $=F/A = 8\times10^{5}$ Pa. $\theta = \text{stress}/\eta = 8\times10^{5}/(4\times10^{10}) = 2\times10^{-5}$ rad. In units of $10^{-5}$ rad: 2.`, {}]; }),
];
items.push(
  nx(() => { const Y = 2e11, A = 1e-6, L = 2; return [2, 'spring constant of a wire', r`A steel wire has $Y = 2\times10^{11}$ Pa, cross-section $1\ \mathrm{mm^2}$ and length 2 m. Treating it as a spring, find its force constant (in $10^{4}\ \mathrm{N\,m^{-1}}$).`, Y * A / L / 1e4, 0, 0, r`From $\Delta L = FL/AY$, $F = (AY/L)\Delta L$, so $k = AY/L = 10^{-6}\times2\times10^{11}/2 = 10^{5}\ \mathrm{N\,m^{-1}}$ $= 10\times10^{4}$.`, {}]; }),
  mcq(2, 'ratios', r`The radius of a wire is doubled while its length, material and load stay the same. Its extension becomes`, 'one-fourth', ['one-half', 'double', 'four times'],
    r`$\Delta L = FL/(\pi r^2Y)\propto1/r^2$. Doubling $r$ divides the extension by 4.`),
  mcq(2, 'ratios', r`Wire 1 has length $L$ and radius $r$; wire 2 of the same material has length $2L$ and radius $2r$. For the same load, the ratio of extensions $\Delta L_1 : \Delta L_2$ is`, '2 : 1', ['1 : 2', '1 : 1', '4 : 1'],
    r`$\Delta L\propto L/r^2$. Wire 1: $L/r^2$. Wire 2: $2L/4r^2 = L/2r^2$. Ratio $=1 : \tfrac12 = 2:1$.`),
  nx(() => { const F = 10 * G, L = 2, d = 0.8e-3, dl = 2e-3; const Y = F * L / (PI * d * d / 4 * dl); return [2, "Young's modulus", r`In an experiment a 10 kg load stretches a wire of length 2 m and diameter 0.8 mm by 2.0 mm. Find the Young's modulus of the wire (in units of $10^{11}$ Pa, 2 decimals).`, Y / 1e11, 0.02, 2, r`$Y = \dfrac{FL}{A\Delta L} = \dfrac{98\times2}{(\pi\times0.16\times10^{-6})\times2\times10^{-3}}$. Here $A=\pi(0.4\times10^{-3})^2 = 5.03\times10^{-7}\ \mathrm{m^2}$. $Y = 196/(1.005\times10^{-9}) = ${f(Y / 1e11)}\times10^{11}$ Pa.`, { trap: 'Diameter 0.8 mm means radius 0.4 mm.' }]; }),
  nx(() => { const Y = 2e11, A = 4e-4, a = 1.2e-5, t = 40; return [2, 'thermal stress', r`A steel rod of cross-section $4\ \mathrm{cm^2}$ is held between two rigid walls and its temperature rises by 40 °C. Find the force it exerts on each wall (in kN). $Y = 2\times10^{11}$ Pa, $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$.`, Y * A * a * t / 1e3, 0.5, 1, r`$F = YA\alpha\Delta T = 2\times10^{11}\times4\times10^{-4}\times1.2\times10^{-5}\times40 = 3.84\times10^{4}$ N $=38.4$ kN. Convert $4\ \mathrm{cm^2}$ to $4\times10^{-4}\ \mathrm{m^2}$.`, { unit: 'kN' }]; }),
  mx(() => { const B = 2.2e9, dP = 1.1e7, V = 1000; const dV = dP / B * V; return [2, 'bulk modulus', r`One litre of water ($B = 2.2\times10^{9}$ Pa) is squeezed by raising the pressure by $1.1\times10^{7}$ Pa. Its volume decreases by`, dV, [dV * 10, dV / 10, dV * 2], 'mL', 3, r`$\Delta V = V\Delta P/B = 1000\ \mathrm{mL}\times1.1\times10^{7}/2.2\times10^{9} = 5$ mL.`, {}]; }),
  mx(() => { const B = 2.2e9; const kk = 1 / B; return [2, 'compressibility', r`The compressibility of water is (bulk modulus $2.2\times10^{9}$ Pa)`, kk, [B, 1 / (B * 1e3), 1 / B * 1e3], r`Pa<sup>-1</sup>`, 3, r`$k = 1/B = 1/(2.2\times10^{9}) = 4.5\times10^{-10}\ \mathrm{Pa^{-1}}$.`, {}]; }),
  nx(() => { const s = 7.6e8, d = 1e-3; return [2, 'breaking stress', r`The breaking stress of a steel wire is $7.6\times10^{8}$ Pa. What largest load (in N, nearest whole) can a wire of diameter 1 mm carry before it breaks?`, s * PI * d * d / 4, 1, 0, r`$F_\text{max} = \sigma A = 7.6\times10^{8}\times\pi(0.5\times10^{-3})^2 = 7.6\times10^{8}\times7.854\times10^{-7} = ${f(s * PI * d * d / 4)}$ N.`, { unit: 'N' }]; }),
  mcq(2, 'force-extension graph', r`A graph of load (y-axis) against extension (x-axis) is a straight line through the origin for a wire. The slope of the line gives`, 'the force constant $k = YA/L$ of the wire', [r`the Young's modulus $Y$`, 'the elastic energy stored', 'the breaking stress'],
    r`$F = k\,\Delta L$, so the slope is $k = AY/L$. It depends on the size of the wire, so it is not $Y$ itself. The area under the graph is the energy.`, { trap: 'Slope of force-extension is not Young\'s modulus; slope of stress-strain is.' }),
  mcq(2, "Young's modulus", r`A wire is cut to half its length. Its Young's modulus`, 'stays the same', ['becomes half', 'becomes double', 'becomes four times'],
    r`$Y$ is a property of the material, not of the size or shape. Its stiffness $k = AY/L$ doubles, but $Y$ does not change.`),
  mcq(2, 'ratios', r`Two wires of the same material and equal length have radii in the ratio 1 : 2. The same load hangs from each. The ratio of stresses in them is`, '4 : 1', ['1 : 4', '2 : 1', '1 : 1'],
    r`Stress $=F/\pi r^2\propto1/r^2$. For $r_1:r_2 = 1:2$ the stresses are $\sigma_1:\sigma_2 = 4:1$.`),
  mcq(2, 'ratios', r`For the same load, a wire of length $L$ stores elastic energy $U$. A wire of the same material and area but length $2L$ stores`, '$2U$', ['$U$', '$U/2$', '$4U$'],
    r`$U = \tfrac12F\Delta L = \dfrac{F^2L}{2AY}\propto L$ at a given load. Doubling the length doubles the energy.`),
  mcq(2, 'moduli', r`The shear modulus of a liquid is`, 'zero', ['infinite', 'equal to its bulk modulus', 'equal to its Young\'s modulus'],
    r`A liquid cannot hold a tangential stress. It flows under the smallest shear force, so the shear (rigidity) modulus is zero.`),
  nx(() => { const L0 = 20, L1 = 25; return [2, 'strain', r`A rubber cord of length 20 cm is stretched to 25 cm. Find the strain in percent.`, (L1 - L0) / L0 * 100, 0, 0, r`Strain $=\Delta L/L = (25-20)/20 = 0.25 = 25\%$. The original length goes in the denominator.`, { unit: '%' }]; }),
  mx(() => { const s = 1e8, L = 1, dl = 0.5e-3; const Y = s / (dl / L); return [2, "Young's modulus", r`A wire 1 m long stretches by 0.5 mm when the stress in it is $10^{8}$ Pa. Its Young's modulus is`, Y, [s * dl, Y / 10, Y * 4], 'Pa', 3, r`Strain $=0.5\times10^{-3}/1 = 5\times10^{-4}$. $Y = 10^{8}/(5\times10^{-4}) = 2\times10^{11}$ Pa.`, {}]; }),
  nx(() => { const m1 = 2, d1 = 0.4, m2 = 5; return [2, "Hooke's law", r`A wire stretches by 0.4 mm when a 2 kg mass hangs from it. By how much (in mm) will it stretch with a 5 kg mass? (Within the elastic limit.)`, d1 * m2 / m1, 0.005, 2, r`$\Delta L\propto F$. $\Delta L = 0.4\times5/2 = 1.0$ mm.`, { unit: 'mm' }]; }),
  mcq(2, 'stress and strain', r`A cube of a solid is acted on by equal pressure on all faces. The strain produced is`, 'volume strain', ['longitudinal strain', 'shear strain', 'lateral strain'],
    r`Equal pressure from all sides changes only the volume (not the shape). Its volume strain is $\Delta V/V$, with $B = -\Delta P/(\Delta V/V)$.`),
  mx(() => { const k1 = 6e4, k2 = 3e4; const ks = k1 * k2 / (k1 + k2); return [2, 'wires in series', r`Two wires have force constants $6\times10^{4}$ and $3\times10^{4}\ \mathrm{N\,m^{-1}}$. Joined end to end, the combination behaves like a spring of force constant`, ks / 1e4, [4.5, 9, 1], r`$\times10^{4}\ \mathrm{N\,m^{-1}}$`, 3, r`Springs in series: $1/k = 1/k_1 + 1/k_2$. $k = \dfrac{k_1k_2}{k_1+k_2} = \dfrac{6\times3}{9}\times10^{4} = 2\times10^{4}\ \mathrm{N\,m^{-1}}$.`, {}]; }),
  mcq(2, 'stress-strain curve', r`A material that shows a large plastic region between the elastic limit and the fracture point is called`, 'ductile', ['brittle', 'perfectly elastic', 'rigid'],
    r`Ductile materials (copper, mild steel, gold) stretch a lot before they break, so they can be drawn into wires. Brittle materials (glass, cast iron) fracture soon after the elastic limit.`),
  mcq(2, 'elasticity', r`Which of the following has the greatest bulk modulus?`, 'water', ['air', 'rubber foam', 'a gas at low pressure'],
    r`Liquids are hard to compress ($B\sim10^{9}$ Pa), while gases are easy to compress ($B\sim10^{5}$ Pa for air). So water is the largest among these choices.`),
  nx(() => { const rho = 7800, g = G, L = 10; return [2, 'stress due to own weight', r`A uniform steel wire 10 m long hangs vertically. Find the stress at its top end due to its own weight (in kPa, nearest whole). $\rho = 7800\ \mathrm{kg\,m^{-3}}$.`, rho * g * L / 1e3, 1, 0, r`The top section supports the whole wire: $\sigma = \dfrac{mg}{A} = \dfrac{\rho ALg}{A} = \rho gL = 7800\times9.8\times10 = 7.64\times10^{5}$ Pa $=764$ kPa.`, { unit: 'kPa' }]; }),
  mcq(2, 'stress-strain curve', r`In a stress-strain graph for a metal wire, the area under the straight (elastic) portion up to a strain $\varepsilon$ gives`, 'the elastic energy stored per unit volume', ['the Young\'s modulus', 'the elastic limit', 'the breaking force'],
    r`Area under stress-strain $=\int\sigma\,\mathrm{d}\varepsilon$, which has units of $\mathrm{N\,m^{-2}} = \mathrm{J\,m^{-3}}$: energy per unit volume. The slope is $Y$.`),
  mcq(2, 'thermal stress', r`A rod fixed between rigid walls is heated. The thermal stress in it does NOT depend on`, 'the length of the rod', ["Young's modulus", 'the temperature rise', 'the coefficient of linear expansion'],
    r`$\sigma = Y\alpha\Delta T$. The length cancels: strain is $\alpha\Delta T$ whatever the length.`),
  mx(() => { const eta = 8e10, th = 1e-4; const s = eta * th; return [2, 'shear', r`A shear strain (angle) of $10^{-4}$ rad is produced in a metal of modulus of rigidity $8\times10^{10}$ Pa. The shear stress is`, s / 1e6, [s / 1e3, s * 1e-9, s / 1e7], 'MPa', 3, r`$\text{shear stress} = \eta\theta = 8\times10^{10}\times10^{-4} = 8\times10^{6}$ Pa $=8$ MPa.`, {}]; }),
  mcq(2, 'stress-strain curve', r`The point on a stress-strain curve at which the material starts to stretch with little or no further rise in stress (a mild-steel wire) is called the`, 'yield point', ['fracture point', 'proportional limit only', 'breaking stress'],
    r`After the yield point (elastic limit) the strain rises quickly with almost constant stress. Fracture is where the wire finally breaks, much later.`),
);

// ---------- Level 3 ----------
items.push(
  nx(() => { const M = 2, L = 10, A = 1e-6, Y = 2e11; return [3, 'wire under its own weight', r`A uniform wire of mass 2 kg, length 10 m and cross-section $1\ \mathrm{mm^2}$ hangs from a ceiling. Find its extension due to its own weight (in mm, 2 decimals). $Y = 2\times10^{11}$ Pa, $g=9.8\ \mathrm{m\,s^{-2}}$.`, M * G * L / (2 * A * Y) * 1e3, 0.02, 2, r`Effective load $=Mg/2$ (the weight acts like a load at the end of half its size). $\Delta L = \dfrac{(Mg/2)L}{AY} = \dfrac{2\times9.8\times10}{2\times10^{-6}\times2\times10^{11}} = ${f(M * G * L / (2 * A * Y) * 1e3)}$ mm.`, { unit: 'mm', trap: 'Not $MgL/AY$: the stress varies along the wire.' }]; }),
  mcq(3, 'wire under its own weight', r`A uniform wire of length $L$ hangs from the ceiling and stretches under its own weight. The stress at the middle of the wire, compared with the stress at the top, is`, 'half', ['equal', 'double', 'one-fourth'],
    r`At the middle, the part below supports half the weight over the same area. Stress there is $\rho g(L/2)$, which is half of the top value $\rho gL$.`),
  nx(() => { const k1 = 2e11 * 1e-6 / 1.5, k2 = 1e11 * 2e-6 / 1; const F = 400; return [3, 'wires in parallel', r`A load of 400 N hangs from a rigid bar joined to two vertical wires side by side. Wire 1: steel, $Y = 2\times10^{11}$ Pa, area $1\ \mathrm{mm^2}$, length 1.5 m. Wire 2: brass, $Y = 1\times10^{11}$ Pa, area $2\ \mathrm{mm^2}$, length 1 m. Both stretch by the same amount. Find the force in the steel wire (in N, nearest whole).`, F * k1 / (k1 + k2), 1, 0, r`Equal extension, so $F\propto k = AY/L$. $k_1 = 2\times10^{11}\times10^{-6}/1.5 = 1.333\times10^{5}$ and $k_2 = 1\times10^{11}\times2\times10^{-6}/1 = 2\times10^{5}$ N/m. Steel share $=400\times\dfrac{1.333}{3.333} = 160$ N.`, { unit: 'N', trap: 'Share the load by stiffness $AY/L$, not by $Y$ alone.' }]; }),
  nx(() => { const d = 0.9; const x = d / 3; return [3, 'wires in parallel', r`A light rigid rod 0.9 m long hangs horizontally from two vertical wires of equal length and area, a steel wire ($Y = 2\times10^{11}$ Pa) at the left end and a brass wire ($Y=1\times10^{11}$ Pa) at the right end. A load is hung from a point on the rod so that the rod stays horizontal. How far (in m, 2 decimals) from the steel wire is the load?`, x, 0.005, 2, r`The rod stays horizontal if both wires stretch equally, so $F\propto Y$: $F_\text{steel} = 2F_\text{brass}$. Taking torques about the load: $F_s x = F_b(0.9 - x)$, so $2x = 0.9 - x$ and $x = 0.3$ m.`, { unit: 'm', trap: 'The load must sit nearer the stiffer wire.' }]; }),
  mx(() => { const Bm = 1.4 * 1.0e5; return [3, 'bulk modulus of a gas', r`An ideal gas at pressure $P$ is compressed adiabatically. For air ($\gamma = 1.4$) at $1.0\times10^{5}$ Pa the adiabatic bulk modulus is`, Bm, [1.0e5, 1.0e5 / 1.4, 1.4e5 * 1.4], 'Pa', 3, r`$PV^\gamma=$ constant gives $\mathrm{d}P/P = -\gamma\,\mathrm{d}V/V$, so $B = \gamma P = 1.4\times10^{5}$ Pa. (For an isothermal process $B = P$.)`, { trap: 'Isothermal: $B=P$. Adiabatic: $B=\\gamma P$.' }]; }),
  mx(() => { const Y = 2e11, s = 0.3, e = 1e-3; const dv = e * (1 - 2 * s); return [3, "Poisson's ratio", r`A wire of Poisson's ratio 0.3 is stretched to a longitudinal strain of $10^{-3}$. The fractional change in its volume is`, dv, [e, e * (1 + 2 * s), e * (1 - s)], '', 3, r`Volume $V=\pi r^2L$: $\dfrac{\Delta V}{V} = \dfrac{\Delta L}{L} + 2\dfrac{\Delta r}{r} = \varepsilon - 2\sigma\varepsilon = \varepsilon(1 - 2\sigma) = 10^{-3}\times0.4 = 4\times10^{-4}$.`, { trap: 'The lateral contraction reduces the volume gain.' }]; }),
  nx(() => { const Y = 2e11, s = 0.25; return [3, 'relations of moduli', r`For a material with $Y=2\times10^{11}$ Pa and Poisson's ratio 0.25, find the modulus of rigidity in units of $10^{10}$ Pa, using $Y = 2\eta(1+\sigma)$.`, Y / (2 * (1 + s)) / 1e10, 0, 0, r`$\eta = \dfrac{Y}{2(1+\sigma)} = \dfrac{2\times10^{11}}{2\times1.25} = 8\times10^{10}$ Pa.`, {}]; }),
  nx(() => { const Y = 2e11, s = 0.25; return [3, 'relations of moduli', r`For the same material ($Y = 2\times10^{11}$ Pa, Poisson's ratio 0.25), find the bulk modulus in units of $10^{10}$ Pa (nearest whole) using $Y = 3B(1-2\sigma)$.`, Y / (3 * (1 - 2 * s)) / 1e10, 0.5, 0, r`$B = \dfrac{Y}{3(1-2\sigma)} = \dfrac{2\times10^{11}}{3\times0.5} = 1.33\times10^{11}$ Pa $=13.3\times10^{10}$. Nearest whole: 13.`, {}]; }),
  nx(() => { const sb = 7.8e8, rho = 7800; return [3, 'breaking length', r`A steel wire breaks when its stress reaches $7.8\times10^{8}$ Pa. What is the longest uniform wire (in km, 1 decimal) that can hang from its top end without breaking under its own weight? $\rho = 7800\ \mathrm{kg\,m^{-3}}$, $g=9.8\ \mathrm{m\,s^{-2}}$.`, sb / (rho * G) / 1e3, 0.1, 1, r`Largest stress is at the top: $\rho gL = \sigma_b$. $L = \dfrac{7.8\times10^{8}}{7800\times9.8} = 1.02\times10^{4}$ m $=10.2$ km.`, { unit: 'km' }]; }),
  nx(() => { const m = 50, br = 735; const a = br / m - G; return [3, 'wire in a lift', r`A cable with a breaking force of 735 N carries a 50 kg load in a lift. What is the largest upward acceleration (in $\mathrm{m\,s^{-2}}$, 1 decimal) the lift can have without the cable breaking? $g = 9.8\ \mathrm{m\,s^{-2}}$.`, a, 0.05, 1, r`Tension $T = m(g+a)\le735$. $g + a\le735/50 = 14.7$, so $a\le14.7-9.8 = 4.9\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', trap: 'Add $a$ to $g$ for upward acceleration.' }]; }),
  mx(() => { const A = 1.2e-5, t = 40, Y = 2e11, A1 = 4e-4; return [3, 'thermal stress', r`A steel rod and a copper rod, each fixed rigidly between walls, are heated by the same amount. $Y$: steel $2\times10^{11}$, copper $1.1\times10^{11}$ Pa; $\alpha$: steel $1.2\times10^{-5}$, copper $1.7\times10^{-5}\ \mathrm{K^{-1}}$. The ratio of thermal stress in steel to that in copper is`, (2e11 * 1.2e-5) / (1.1e11 * 1.7e-5), [2 / 1.1, 1.2 / 1.7, 1.7 / 1.2], '', 3, r`$\sigma = Y\alpha\Delta T$, so $\sigma_s/\sigma_c = \dfrac{2\times1.2}{1.1\times1.7} = \dfrac{2.4}{1.87} = 1.28$.`, { trap: 'Both $Y$ and $\\alpha$ matter.' }]; }),
  mcq(3, 'stress-strain curve', r`The stress-strain curves of materials P and Q (drawn on the same scale) are straight lines up to their breaking points. P has a steeper slope and breaks at a small strain. Q has a lower slope and breaks at a large strain. Which statement is correct?`, 'P is stiffer and brittle; Q is less stiff and more ductile', ['P is less stiff and ductile; Q is stiffer and brittle', 'Both have the same Young\'s modulus', 'P is ductile and Q is brittle'],
    r`Slope $=Y$: steeper means stiffer. Breaking at small strain after the elastic region means little plastic stretch: brittle. Q stretches much more before breaking.`),
  mcq(3, 'hysteresis', r`When a rubber band is stretched and then released, the loading and unloading curves of the stress-strain graph do not coincide. The area between them stands for`, 'the energy lost as heat per unit volume in one cycle', ['the elastic limit', 'the energy stored in the band', 'the modulus of elasticity'],
    r`This is elastic hysteresis. The loop area is the net work done on the rubber in the cycle per unit volume, which turns into heat. That is why rubber is used as a shock absorber.`),
  mcq(3, 'stress', r`Which statement about stress is correct?`, 'Stress is a tensor quantity, although it is the ratio of a force to an area', ['Stress is a vector because force is a vector', 'Stress is a scalar because pressure is a scalar', 'Stress has the same unit as strain'],
    r`Force is a vector and area (with its normal) is also a vector, so the ratio needs a nine-component quantity: a tensor. Pressure is a special case where the stress is the same in every direction.`, { trap: 'Pressure being a scalar does not make stress a scalar.' }),
  mcq(3, 'elastic energy', r`A wire is stretched by a force $F$ within the elastic limit and then the force is removed. The elastic potential energy stored while stretched is $U$. If the force is doubled (same wire, still within the limit), the stored energy becomes`, '$4U$', ['$2U$', '$U$', '$U/2$'],
    r`$U = \dfrac{F^2L}{2AY}\propto F^2$. Doubling $F$ quadruples $U$. (Extension doubles and force doubles, so the product $\tfrac12F\Delta L$ gets four times bigger.)`),
  nx(() => { const m = 2, L = 2, A = 1e-6, Y = 2e11; const k = A * Y / L; const T = 2 * PI * Math.sqrt(m / k); return [3, 'wire as a spring', r`A 2 kg mass hangs from a steel wire of length 2 m and cross-section $1\ \mathrm{mm^2}$ and is pulled down slightly and released. Find the period of the vertical oscillations (in ms, 1 decimal). $Y = 2\times10^{11}$ Pa.`, T * 1000, 0.2, 1, r`The wire behaves as a spring: $k = AY/L = 10^{5}\ \mathrm{N\,m^{-1}}$. $T = 2\pi\sqrt{m/k} = 2\pi\sqrt{2/10^{5}} = 2\pi\times4.47\times10^{-3} = ${f(T * 1000)}$ ms.`, { unit: 'ms' }]; }),
  nx(() => { const rho = 1000, g = G, h = 4000, B = 2.2e9; const e = rho * g * h / B * 100; return [3, 'compression at depth', r`Find the percentage decrease in the volume of sea water at a depth of 4 km (assume uniform density $1000\ \mathrm{kg\,m^{-3}}$, ignore atmospheric pressure, $B = 2.2\times10^{9}$ Pa, $g = 9.8\ \mathrm{m\,s^{-2}}$). Give 2 decimals.`, e, 0.02, 2, r`$\Delta P = \rho gh = 1000\times9.8\times4000 = 3.92\times10^{7}$ Pa. $\Delta V/V = \Delta P/B = 3.92\times10^{7}/2.2\times10^{9} = 1.78\times10^{-2}$, i.e. ${f(e)}\%.`, { unit: '%' }]; }),
  mx(() => { const B = 2.2e9, rho = 1000; const v = Math.sqrt(B / rho); return [3, 'bulk modulus and sound', r`The speed of sound in water is $v = \sqrt{B/\rho}$. For $B = 2.2\times10^{9}$ Pa and $\rho = 1000\ \mathrm{kg\,m^{-3}}$ it is`, v, [B / rho, Math.sqrt(B / rho / 10), Math.sqrt(B * rho)], 'm/s', 3, r`$v = \sqrt{2.2\times10^{9}/10^{3}} = \sqrt{2.2\times10^{6}} = 1483\ \mathrm{m\,s^{-1}}$.`, {}]; }),
  nx(() => { const dF = 1, dd = 1, dL = 1; return [3, 'error analysis', r`In Searle's experiment, $Y = \dfrac{4FL}{\pi d^2\,\Delta L}$. The diameter is measured as $d = 0.80\pm0.01$ mm. $F$ and $L$ are exact, and $\Delta L = 2.00\pm0.02$ mm. Find the maximum percentage error in $Y$ (1 decimal).`, 2 * 0.01 / 0.8 * 100 + 0.02 / 2 * 100, 0.1, 1, r`$\dfrac{\Delta Y}{Y} = 2\dfrac{\Delta d}{d} + \dfrac{\Delta(\Delta L)}{\Delta L} = 2\times\dfrac{0.01}{0.80} + \dfrac{0.02}{2.00} = 0.025+0.01 = 0.035$, i.e. 3.5%.`, { trap: 'The diameter appears squared, so its error counts twice.' }]; }),
  mcq(3, 'rotating wire', r`A block of mass $m$ is tied to a wire and whirled on a smooth horizontal table in a circle of radius $L$ (wire length $L$) at angular speed $\omega$. The extension of the wire, for cross-section $A$ and modulus $Y$, is (neglect the mass of the wire)`, r`$\dfrac{m\omega^2L^2}{AY}$`, [r`$\dfrac{m\omega^2L}{AY}$`, r`$\dfrac{m\omega L^2}{AY}$`, r`$\dfrac{m\omega^2L^2}{2AY}$`],
    r`Tension supplies the centripetal force: $T = m\omega^2L$. Extension $=\dfrac{TL}{AY} = \dfrac{m\omega^2L^2}{AY}$.`),
  mcq(3, 'elastic limit', r`Which statement about a wire loaded beyond its elastic limit and then unloaded is correct?`, 'it returns along a line parallel to the loading line and keeps a permanent strain', ['it returns along the same loading curve to zero strain', 'it has zero strain because Hooke\'s law holds', 'it breaks at once'],
    r`Beyond the yield point the unloading path is roughly parallel to the elastic line, so at zero stress some strain remains: the permanent set.`),
  mcq(3, 'modulus values', r`A student claims that "a steel wire and a rubber band of the same size, loaded equally, will stretch in the ratio of their Young's moduli". The correct statement is`, "the one with the larger Young's modulus stretches less; the ratio of extensions is the inverse ratio of the moduli", ["the one with the larger Young's modulus stretches more", 'both stretch equally because the load is equal', 'extension depends only on the load'],
    r`$\Delta L = FL/(AY)\propto1/Y$ for equal $F$, $L$, $A$. So steel ($Y\sim10^{11}$) stretches far less than rubber ($Y\sim10^{7}$): by a factor of about $10^{4}$.`),
  mcq(3, 'shear', r`A cube of side $a$ and rigidity modulus $\eta$ has its top face displaced sideways by a small amount $x$ with a tangential force $F$. The force is`, r`$F = \eta a x$`, [r`$F = \eta x/a$`, r`$F = \eta a^2x$`, r`$F = \eta x a^{2}/ a^{3}$`],
    r`Shear stress $=F/a^2$ and shear strain $=x/a$. $\eta = (F/a^2)/(x/a) = F/(ax)$, so $F=\eta ax$.`),
  nx(() => { const T = 5; const s = 3; return [3, 'elastic energy', r`A wire of length 2 m, cross-section $1\ \mathrm{mm^2}$ and $Y=2\times10^{11}$ Pa is stretched by a 20 N load. Find the elastic energy stored (in mJ, 1 decimal).`, 20 * 20 * 2 / (2 * 1e-6 * 2e11) * 1000, 0.1, 1, r`$U = \dfrac{F^2L}{2AY} = \dfrac{400\times2}{2\times10^{-6}\times2\times10^{11}} = \dfrac{800}{4\times10^{5}} = 2\times10^{-3}$ J $=2.0$ mJ.`, { unit: 'mJ' }]; }),
  mcq(3, 'wires in series', r`Two wires, one of steel and one of copper, have the same length and cross-section. They are joined end to end and loaded. Which statement is correct?`, 'the force in both is the same, but the copper wire has the larger extension', ['the extensions are equal and the forces differ', 'the force in steel is larger', 'the stress in copper is larger'],
    r`In series each wire carries the full load, and with equal area the stresses are equal. $\Delta L = \text{stress}\times L/Y$, so the wire with smaller $Y$ (copper, $1.1\times10^{11}$) extends more.`),
  nx(() => { const rho = 7800, w = 100, L = 1; const e = rho * w * w * L ** 3 / (3 * 2e11) * 1000; return [4, 'rotating rod', r`A uniform steel rod of length 1 m is rotated about an axis through one end, perpendicular to its length, at 100 rad/s (in a horizontal plane, gravity ignored). Find the extension of the rod (in mm, 3 decimals). $\rho = 7800\ \mathrm{kg\,m^{-3}}$, $Y = 2\times10^{11}$ Pa.`, e, 0.002, 3, r`Tension at distance $r$ from the axis: $T = \dfrac{\rho A\omega^2}{2}(L^2 - r^2)$. $\Delta L = \displaystyle\int_0^L\frac{T}{AY}\mathrm{d}r = \dfrac{\rho\omega^2}{2Y}\left(L^3 - \dfrac{L^3}{3}\right) = \dfrac{\rho\omega^2L^3}{3Y} = \dfrac{7800\times10^{4}}{6\times10^{11}} = ${f(e)}\times10^{-3}$ m, i.e. ${f(e)} mm.`, { unit: 'mm', trap: 'Tension is not constant along the rod: the integral gives the factor 3.' }]; }),
);

// ---------- Level 4 ----------
items.push(
  nx(() => { const m = 2, k = 1e5; return [4, 'sudden loading', r`A 2 kg mass is attached to the lower end of an unstretched steel wire (force constant $1.0\times10^{5}\ \mathrm{N\,m^{-1}}$) and released suddenly from rest. Find the largest extension of the wire during the oscillation that follows (in mm, 3 decimals). Take $g=9.8\ \mathrm{m\,s^{-2}}$ and stay within the elastic limit.`, 2 * m * G / k * 1000, 0.002, 3, r`Energy: the mass falls by $x$ and the wire stores $\tfrac12kx^2$, so $mgx = \tfrac12kx^2$ at the lowest point, giving $x = 2mg/k = 2\times19.6/10^{5} = 3.92\times10^{-4}$ m $=${f(2 * m * G / k * 1000)}$ mm. This is twice the static extension $mg/k$.`, { unit: 'mm', trap: 'A suddenly applied load stretches the wire twice as much as the same load applied slowly.' }]; }),
  nx(() => { const m = 1, h = 0.5, k = 1e5; const x = (m * G + Math.sqrt((m * G) ** 2 + 2 * k * m * G * h)) / k; return [4, 'falling mass on a wire', r`A 1 kg ball is dropped from 0.5 m above a light pan fixed to the lower end of a vertical steel wire (force constant $1.0\times10^{5}\ \mathrm{N\,m^{-1}}$) and sticks to it. Find the largest extension of the wire (in mm, 2 decimals). $g = 9.8\ \mathrm{m\,s^{-2}}$.`, x * 1000, 0.02, 2, r`Energy conservation from the release to the lowest point: $mg(h + x) = \tfrac12kx^2$. So $\tfrac12kx^2 - mgx - mgh = 0$ and $x = \dfrac{mg + \sqrt{(mg)^2 + 2kmgh}}{k}$. With $mg = 9.8$ and $2kmgh = 2\times10^{5}\times9.8\times0.5 = 9.8\times10^{5}$: $x = \dfrac{9.8 + \sqrt{96 + 980000}}{10^{5}} = \dfrac{9.8 + 990.0}{10^{5}} = ${f(x * 1000)}\times10^{-3}$ m.`, { unit: 'mm', trap: 'Do not forget that the ball also falls through the extension $x$.' }]; }),
  nx(() => { const Y = 2e11, a = 1.2e-5, dT = 100, L = 1, gap = 0.5e-3; const s = (a * L * dT - gap) / L * Y; return [4, 'thermal stress with a gap', r`A steel rod 1 m long is fixed at one end. At the other end there is a gap of 0.5 mm to a rigid wall. The rod is heated by 100 °C. Find the stress in it (in MPa, nearest whole). $Y = 2\times10^{11}$ Pa, $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$.`, s / 1e6, 0.5, 0, r`Free expansion $=\alpha L\Delta T = 1.2\times10^{-5}\times1\times100 = 1.2$ mm. The gap takes up 0.5 mm. The rod is compressed by $0.7$ mm, a strain of $7\times10^{-4}$. Stress $=Y\varepsilon = 2\times10^{11}\times7\times10^{-4} = 1.4\times10^{8}$ Pa $=140$ MPa.`, { unit: 'MPa', trap: 'Only the extra expansion beyond the gap produces stress.' }]; }),
  nx(() => { const L = 0.5, A = 2e-4, Y1 = 2e11, Y2 = 1.1e11, a1 = 1.2e-5, a2 = 1.7e-5, dT = 50; const F = (a1 * L + a2 * L) * dT / (L / (A * Y1) + L / (A * Y2)); return [4, 'composite rod', r`A steel rod and a copper rod, each 0.5 m long and $2\ \mathrm{cm^2}$ in cross-section, are joined end to end and placed between two rigid walls. The temperature rises by 50 °C. Find the force between the rods (in kN, 1 decimal). $Y$: steel $2\times10^{11}$, copper $1.1\times10^{11}$ Pa; $\alpha$: steel $1.2\times10^{-5}$, copper $1.7\times10^{-5}\ \mathrm{K^{-1}}$.`, F / 1e3, 0.2, 1, r`Total free expansion $=(\alpha_1L_1 + \alpha_2L_2)\Delta T = (1.2+1.7)\times10^{-5}\times0.5\times50 = 7.25\times10^{-4}$ m. This is cancelled by compression: $F\left(\dfrac{L}{AY_1}+\dfrac{L}{AY_2}\right) = 7.25\times10^{-4}$. The bracket is $\dfrac{0.5}{2\times10^{-4}}\left(\dfrac{1}{2\times10^{11}} + \dfrac{1}{1.1\times10^{11}}\right) = 2500\times1.409\times10^{-11} = 3.523\times10^{-8}$. So $F = 7.25\times10^{-4}/3.523\times10^{-8} = ${f(F / 1e3)}$ kN.`, { unit: 'kN', trap: 'Both rods carry the same force; the compressions add up.' }]; }),
  nx(() => { const m = 10, L = 1, A = 1e-6, Y = 2e11; const T = m * G / (2 * Math.cos(60 * PI / 180)); return [4, 'wires at an angle', r`A 10 kg mass is hung from two identical steel wires, each 1 m long and $1\ \mathrm{mm^2}$ in area, which make 60° with the vertical and are fixed to a horizontal ceiling. Find the extension of each wire (in mm, 2 decimals), taking $Y = 2\times10^{11}$ Pa and $g = 9.8\ \mathrm{m\,s^{-2}}$.`, T * L / (A * Y) * 1000, 0.01, 2, r`Vertical balance: $2T\cos60° = mg$, so $T = mg = 98$ N. Extension $=\dfrac{TL}{AY} = \dfrac{98\times1}{10^{-6}\times2\times10^{11}} = 4.9\times10^{-4}$ m $=${f(T * L / (A * Y) * 1000)}$ mm.`, { unit: 'mm', trap: 'Each wire carries more than half the weight when they are slanted.' }]; }),
  nx(() => { const rho = 7800, s = 1e8; return [4, 'rotating ring', r`A thin steel ring rotates about its axis. Its material can bear a tensile stress of at most $10^{8}$ Pa. Find the largest speed of a point on its rim (in $\mathrm{m\,s^{-1}}$, nearest whole). $\rho = 7800\ \mathrm{kg\,m^{-3}}$.`, Math.sqrt(s / rho), 1, 0, r`For a thin ring of radius $R$ and area $A$ the tension is $T = \rho A\omega^2R^2$ (a half-ring needs $2T = \int\ldots$, which gives this). Stress $=T/A = \rho\omega^2R^2 = \rho v^2$. So $v = \sqrt{\sigma/\rho} = \sqrt{10^{8}/7800} = ${f(Math.sqrt(s / rho))}$ m/s. The radius does not matter.`, { unit: 'm/s', trap: 'The answer is independent of the radius.' }]; }),
  mx(() => { const B = 7e10, h = 5000, dP = 1000 * G * h; const e = dP / (3 * B); return [4, 'bulk modulus', r`A solid aluminium sphere ($B = 7\times10^{10}$ Pa) is lowered to a depth of 5 km in the sea (density $1000\ \mathrm{kg\,m^{-3}}$, ignore the atmosphere, $g=9.8\ \mathrm{m\,s^{-2}}$). The fractional decrease in its radius is`, e, [dP / B, dP / (2 * B), dP / (3 * B) * 2], '', 3, r`$\Delta P = \rho gh = 4.9\times10^{7}$ Pa. $\dfrac{\Delta V}{V} = \dfrac{\Delta P}{B} = 7\times10^{-4}$. Since $V\propto r^3$, $\dfrac{\Delta V}{V} = 3\dfrac{\Delta r}{r}$, so $\dfrac{\Delta r}{r} = 2.33\times10^{-4}$.`, { trap: 'Radius changes by one-third of the volume strain.' }]; }),
  mcq(4, "Poisson's ratio", r`The Poisson's ratio of a material is 0.5. Which statement is correct?`, 'the volume of the material does not change under a longitudinal stretch', ['its volume increases by the full longitudinal strain', 'it has zero Young\'s modulus', 'its bulk modulus is zero'],
    r`$\Delta V/V = \varepsilon(1 - 2\sigma) = 0$ for $\sigma = 0.5$. From $Y = 3B(1-2\sigma)$ the bulk modulus becomes infinite, so the material is incompressible (a rubber-like solid comes close). The other options are false.`),
  mcq(4, 'torsion', r`Two solid cylinders of the same material and length have radii $r$ and $2r$. For the same angle of twist the torques needed are in the ratio (torque $\propto r^4\theta/L$)`, '1 : 16', ['1 : 4', '1 : 8', '1 : 2'],
    r`The twisting couple $\tau = \dfrac{\pi\eta r^4}{2L}\theta$. For equal $\theta$ and $L$, $\tau\propto r^4$: $r^4:(2r)^4 = 1:16$.`),
  mcq(4, 'stress-strain graphs', r`The stress-strain graphs of two wires P and Q of the same size are straight lines making 30° and 60° with the strain axis. The ratio of their Young's moduli $Y_P : Y_Q$ is`, r`$1 : 3$`, [r`$1:\sqrt3$`, r`$\sqrt3:1$`, r`$3:1$`],
    r`$Y = \tan\theta$ (slope), with equal scales. $\tan30° : \tan60° = \dfrac{1}{\sqrt3} : \sqrt3 = 1 : 3$.`, { trap: 'The slope is $\\tan\\theta$ with the strain axis, not $\\sin\\theta$.' }),
  nx(() => { const m = 1, L = 2, th = 60 * PI / 180, A = 1e-6, Y = 2e11; const T = m * G * (3 - 2 * Math.cos(th)); return [4, 'pendulum on a wire', r`A 1 kg bob hangs from a steel wire of length 2 m and area $1\ \mathrm{mm^2}$ and is released from rest at 60° to the vertical. Find the extension of the wire at the lowest point (in mm, 3 decimals; $Y = 2\times10^{11}$ Pa, $g = 9.8\ \mathrm{m\,s^{-2}}$, take the length as 2 m in the formula).`, T * L / (A * Y) * 1000, 0.002, 3, r`At the lowest point $v^2 = 2gL(1-\cos60°) = gL$. Tension $T = mg + mv^2/L = 2mg = 19.6$ N. Extension $=\dfrac{TL}{AY} = \dfrac{19.6\times2}{2\times10^{5}} = 1.96\times10^{-4}$ m $=${f(T * L / (A * Y) * 1000)}$ mm.`, { unit: 'mm', trap: 'The wire carries more than the weight at the bottom of the swing.' }]; }),
  nx(() => { const F1 = 300, F2 = 100, L = 2, A = 4e-4, Y = 2e11; return [4, 'accelerating rod', r`A uniform rod (length 2 m, area $4\ \mathrm{cm^2}$, $Y=2\times10^{11}$ Pa) lies on a smooth table. Forces of 300 N and 100 N are applied at its ends, pointing away from each other along its length. Find the total extension in units of $10^{-6}$ m.`, (F1 + F2) * L / (2 * A * Y) * 1e6, 0.05, 1, r`The rod accelerates, so the tension varies from 300 N at one end to 100 N at the other: $T(x) = F_1 - (F_1 - F_2)x/L$. Extension $=\displaystyle\int_0^L\frac{T}{AY}\mathrm{d}x = \dfrac{(F_1+F_2)L}{2AY}$. This uses the average tension: $\dfrac{400\times2}{2\times4\times10^{-4}\times2\times10^{11}} = 5\times10^{-6}$ m.`, { trap: 'Use the average of the two end tensions, not either one.' }]; }),
  mcq(4, 'rod pulled on a table', r`A uniform rod of length $L$, area $A$ and modulus $Y$ lies on a smooth horizontal table. A force $F$ pulls it at one end along its length (the other end is free). The extension of the rod is`, r`$\dfrac{FL}{2AY}$`, [r`$\dfrac{FL}{AY}$`, r`$\dfrac{FL}{4AY}$`, r`$\dfrac{2FL}{AY}$`],
    r`The rod accelerates with $a = F/M$. Tension at distance $x$ from the free end is $Fx/L$ (it must accelerate the part of mass $Mx/L$). $\Delta L = \int_0^L\dfrac{Fx/L}{AY}\mathrm{d}x = \dfrac{FL}{2AY}$.`),
  nx(() => { const Ys = 2e11, Yb = 1e11; return [4, 'unequal wires', r`A heavy uniform bar hangs horizontally from two vertical wires of equal length, one of steel ($Y=2\times10^{11}$ Pa) and one of brass ($Y=1\times10^{11}$ Pa), fixed at its two ends. The bar stays horizontal. Find the ratio (area of steel wire) : (area of brass wire), given that the bar's weight is shared equally, as a number.`, Yb / Ys, 0.005, 2, r`The bar stays horizontal, so both wires stretch equally. With equal $L$, equal $F$ (the weight is shared equally for a uniform bar) means $\dfrac{F}{AY}$ equal, so $A_sY_s = A_bY_b$ and $A_s/A_b = Y_b/Y_s = 0.5$.`, { trap: 'The steel wire can be thinner because it is stiffer.' }]; }),
  mcq(4, 'heating', r`A metal rod is heated, then fixed rigidly between two supports, and allowed to cool back to its first temperature. During cooling, the rod is`, 'under tension, with stress $Y\\alpha\\Delta T$ where $\\Delta T$ is the fall of temperature from the fixing', ['under compression', 'stress-free', 'under a stress that depends on its length'],
    r`When fixed hot, it is stress-free. On cooling it tries to shrink by a strain $\alpha\Delta T$, but the supports hold it: tension $Y\alpha\Delta T$.`),
  nx(() => { const Y = 2e11, a = 1.2e-5, dT = 10, rho = 7800; return [5, 'tension and wave speed', r`A steel wire is stretched taut between two rigid supports at 30 °C with no tension. It is then cooled by 10 °C. Find the speed of transverse waves on it (in $\mathrm{m\,s^{-1}}$, 1 decimal). $Y=2\times10^{11}$ Pa, $\alpha=1.2\times10^{-5}\ \mathrm{K^{-1}}$, $\rho = 7800\ \mathrm{kg\,m^{-3}}$.`, Math.sqrt(Y * a * dT / rho), 0.2, 1, r`Thermal stress $\sigma = Y\alpha\Delta T = 2.4\times10^{7}$ Pa. Wave speed $v=\sqrt{T/\mu} = \sqrt{\sigma A/(\rho A)} = \sqrt{\sigma/\rho} = \sqrt{2.4\times10^{7}/7800} = ${f(Math.sqrt(Y * a * dT / rho))}\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'The area cancels in $T/\\mu$.' }]; }),
);

// ---------- Level 5 ----------
items.push(
  nx(() => { const m = 10, Y = 2e11, A = 1e-6; const th = Math.cbrt(m * G / (Y * A)); return [5, 'sagging wire', r`A steel wire of length 2 m and area $1\ \mathrm{mm^2}$ ($Y = 2\times10^{11}$ Pa) is stretched between two points at the same height with no tension, and a 10 kg mass is hung from its middle. In equilibrium each half makes a small angle $\theta$ with the horizontal. Find $\theta$ (in radians, 3 decimals). $g = 9.8\ \mathrm{m\,s^{-2}}$.`, th, 0.002, 3, r`Each half has length $L/2/\cos\theta$ instead of $L/2$, so the strain is $\dfrac{1}{\cos\theta} - 1\approx\dfrac{\theta^2}{2}$. Tension $T = YA\theta^2/2$. Vertical balance: $2T\sin\theta\approx2T\theta = mg$. So $YA\theta^3 = mg$ and $\theta = \left(\dfrac{mg}{YA}\right)^{1/3} = \left(\dfrac{98}{2\times10^{5}}\right)^{1/3} = (4.9\times10^{-4})^{1/3} = ${f(th)}$ rad.`, { trap: 'Strain is $\\theta^2/2$, not $\\theta$; the answer has a cube root.' }]; }),
  mcq(5, 'cone under own weight', r`A solid cone of height $L$, density $\rho$ and Young's modulus $Y$ hangs from its base with its apex down. The extension of its height due to its own weight is`, r`$\dfrac{\rho gL^2}{6Y}$`, [r`$\dfrac{\rho gL^2}{2Y}$`, r`$\dfrac{\rho gL^2}{3Y}$`, r`$\dfrac{\rho gL^2}{4Y}$`],
    r`At distance $x$ from the apex, the cone below has volume $\tfrac13A(x)x$, weight $\tfrac13\rho gA(x)x$, so the stress is $\tfrac13\rho gx$. A thin slice of height $\mathrm{d}x$ stretches by $\dfrac{\rho gx}{3Y}\mathrm{d}x$. Sum: $\dfrac{\rho g}{3Y}\cdot\dfrac{L^2}{2} = \dfrac{\rho gL^2}{6Y}$. A uniform wire gives $\rho gL^2/2Y$, three times more.`, { trap: 'Stress in the cone grows as $x/3$ because the area also grows.' }),
  nx(() => { const F = 1000, L = 1, r1 = 1e-3, r2 = 2e-3, Y = 2e11; return [5, 'tapered rod', r`A rod 1 m long tapers uniformly from radius 1 mm at one end to 2 mm at the other. A pull of 1000 N acts along its axis. Find the extension (in mm, 3 decimals). $Y = 2\times10^{11}$ Pa.`, F * L / (PI * Y * r1 * r2) * 1000, 0.003, 3, r`At distance $x$ from the thin end the radius is $r = r_1 + (r_2 - r_1)x/L$. $\Delta L = \int_0^L\dfrac{F\,\mathrm{d}x}{\pi r^2Y}$. With $\mathrm{d}r = \dfrac{r_2-r_1}{L}\mathrm{d}x$: $\Delta L = \dfrac{FL}{\pi Y(r_2 - r_1)}\left(\dfrac{1}{r_1} - \dfrac{1}{r_2}\right) = \dfrac{FL}{\pi Yr_1r_2}$. Numerically $\dfrac{1000}{\pi\times2\times10^{11}\times2\times10^{-6}} = 7.96\times10^{-4}$ m $=${f(F * L / (PI * Y * r1 * r2) * 1000)}$ mm.`, { unit: 'mm', trap: 'Not the average radius: the result involves the product $r_1r_2$.' }]; }),
  nx(() => { const M = 4, L = 10, A = 1e-6, Y = 2e11; const U = (M * G) ** 2 * L / (6 * A * Y); return [5, 'energy in a hanging wire', r`A uniform steel wire of mass 4 kg, length 10 m and area $1\ \mathrm{mm^2}$ hangs from a ceiling. Find the elastic energy stored in it because of its own weight (in mJ, 2 decimals). $Y=2\times10^{11}$ Pa, $g = 9.8\ \mathrm{m\,s^{-2}}$.`, U * 1000, 0.02, 2, r`The stress at distance $x$ from the free end is $\rho gx$. Energy density $=\sigma^2/2Y$. $U = \displaystyle\int_0^L\frac{(\rho gx)^2}{2Y}A\,\mathrm{d}x = \dfrac{A\rho^2g^2L^3}{6Y} = \dfrac{(Mg)^2L}{6AY}$ using $M = \rho AL$. $U = \dfrac{(39.2)^2\times10}{6\times2\times10^{5}} = ${f(U * 1000)}\times10^{-3}$ J.`, { unit: 'mJ', trap: 'Energy density changes along the wire; do not use $\\tfrac12F\\Delta L$ with the full weight.' }]; }),
  nx(() => { const mu = 7800, Y = 2e11, L = 1, w = 200; const D = 0; return [5, 'rotating rod', r`A steel rod 1 m long rotates in a horizontal plane about a vertical axis through its centre at 200 rad/s. Find the increase in the length of the rod (in mm, 3 decimals). $\rho = 7800\ \mathrm{kg\,m^{-3}}$, $Y = 2\times10^{11}$ Pa.`, mu * w * w * (L / 2) ** 3 / (3 * Y) * 2 * 1000, 0.003, 3, r`Each half is a rod of length $L/2$ rotating about its end: extension $\dfrac{\rho\omega^2(L/2)^3}{3Y}$. Two halves: $\Delta L = \dfrac{2\rho\omega^2(L/2)^3}{3Y} = \dfrac{\rho\omega^2L^3}{12Y} = \dfrac{7800\times4\times10^{4}}{12\times2\times10^{11}} = ${f(mu * w * w * (L / 2) ** 3 / (3 * Y) * 2 * 1000)}\times10^{-3}$ m.`, { unit: 'mm', trap: 'Treat each half as a rod rotating about its own end, with length $L/2$.' }]; }),
  mcq(5, 'moduli relations', r`For an isotropic solid, which set of relations between $Y$, $B$, $\eta$ and Poisson's ratio $\sigma$ is correct?`, r`$Y = 3B(1-2\sigma)$ and $Y = 2\eta(1+\sigma)$`, [r`$Y = 3B(1+2\sigma)$ and $Y = 2\eta(1-\sigma)$`, r`$Y = 3B(1-2\sigma)$ and $Y = 2\eta(1-\sigma)$`, r`$Y = 3B(1+2\sigma)$ and $Y = 2\eta(1+\sigma)$`],
    r`These are standard results. Check with $\sigma = 0.5$: $B\to\infty$ (incompressible), consistent with $1-2\sigma = 0$ in the first. Then $Y = 3\eta$, a known property of incompressible solids. The wrong options fail this test.`),
  mcq(5, 'moduli bounds', r`Because $B$ and $\eta$ must both be positive for a stable solid, Poisson's ratio $\sigma$ must lie in the range`, r`$-1 < \sigma < 0.5$`, [r`$0 < \sigma < 1$`, r`$-0.5 < \sigma < 1$`, r`$-1 < \sigma < 1$`],
    r`$\eta = Y/2(1+\sigma)>0$ needs $\sigma>-1$. $B = Y/3(1-2\sigma)>0$ needs $\sigma<0.5$. Almost all common materials lie between 0 and 0.5; some foams have negative $\sigma$.`),
);

// ---------- Assertion and Reason ----------
items.push(
  asrt(2, 'elasticity', r`Steel is more elastic than rubber.`, r`For the same deforming force, the strain produced in steel is smaller than that in rubber.`, 0,
    r`Elasticity in physics means the power to resist deformation and recover: a larger modulus. Steel has $Y\sim2\times10^{11}$ Pa and rubber $\sim10^{7}$ Pa, so the same stress gives much smaller strain in steel. A and R are true, and R is the reason.`, { trap: 'In daily life "elastic" means "stretches easily", the opposite.' }),
  asrt(2, "Young's modulus", r`The Young's modulus of a wire does not change when its length is doubled.`, r`Young's modulus is a property of the material only.`, 0,
    r`Doubling $L$ doubles the extension for a given load, but also strain is $\Delta L/L$, so $Y = \dfrac{F/A}{\Delta L/L}$ stays the same. $Y$ depends on the material (and temperature), not the size or shape.`),
  asrt(3, 'stress', r`Stress is not a vector quantity, although force is.`, r`The stress at a point has different values on planes of different orientation.`, 0,
    r`A vector has one direction at a point; stress needs a force and a plane (a tensor). Because the value depends on the plane chosen, R explains A.`),
  asrt(2, 'bulk modulus', r`The bulk modulus of a gas is much smaller than that of a solid.`, r`A gas is much more compressible than a solid.`, 0,
    r`$B = -\Delta P/(\Delta V/V)$; a small $B$ means a large volume change for a given pressure change. Air has $B\sim10^{5}$ Pa and steel $\sim10^{11}$ Pa.`),
  asrt(3, "Young's modulus", r`A thick wire has a larger Young's modulus than a thin wire of the same material.`, r`A thick wire stretches less than a thin wire for the same load and length.`, 3,
    r`A is false: $Y$ is a material property and is the same. R is true ($\Delta L\propto1/A$): the thick wire stretches less because its stiffness $AY/L$ is greater, not because $Y$ is greater.`, { trap: 'Do not mix stiffness $k=AY/L$ with the modulus $Y$.' }),
  asrt(3, 'thermal stress', r`A rod clamped between rigid walls develops stress when heated, though its length does not change.`, r`The walls prevent the thermal expansion, so a compressive elastic strain equal to $\alpha\Delta T$ is produced.`, 0,
    r`The free expansion $\alpha L\Delta T$ is cancelled by an elastic compression of the same size. The stress is $Y\alpha\Delta T$. R explains A.`),
  asrt(4, 'wire under its own weight', r`A uniform wire hanging from a ceiling extends by half as much under its own weight as it would if the same weight were hung from its lower end.`, r`The stress in a hanging uniform wire is $\rho g x$ at distance $x$ from the free end: it increases linearly from zero at the bottom.`, 0,
    r`$\Delta L = \rho gL^2/2Y$ for its own weight, but $\dfrac{(\rho AL g)L}{AY} = \rho gL^2/Y$ for the same weight at the end. The average stress is half the maximum, which is what R says.`),
  asrt(4, "Poisson's ratio", r`The Poisson's ratio of any ordinary solid cannot exceed 0.5.`, r`If it exceeded 0.5, the bulk modulus (from $Y = 3B(1-2\sigma)$) would be negative.`, 0,
    r`A negative $B$ would mean a solid expands when squeezed, which is unstable. So $\sigma<0.5$, and R is the reason.`),
  asrt(3, 'elastic limit', r`A wire loaded beyond its elastic limit breaks at once.`, r`Beyond the elastic limit the stress-strain relation is no longer linear.`, 3,
    r`A is false: between the elastic limit and the fracture point there is a plastic region (ductile materials stretch a lot there). R is true but it does not mean breaking.`),
  asrt(4, 'sudden loading', r`A suddenly applied load stretches a wire to twice the extension that the same load produces when applied slowly.`, r`In sudden loading, the work done by the load $mgx$ equals the energy stored $\tfrac12kx^2$.`, 0,
    r`$mgx = \tfrac12kx^2\Rightarrow x = 2mg/k$, twice the static value $mg/k$. R gives the equation that leads to A.`),
);

// ---------- Statement I / Statement II ----------
items.push(
  stm(2, 'shear modulus', r`The modulus of rigidity of a liquid is zero.`, r`A liquid flows under a tangential force, however small.`, 0, r`Both are true, and II explains I: a fluid has no resistance to shear, so it has no shear modulus.`),
  stm(2, "Young's modulus", r`Two wires of the same material but different diameters have the same Young's modulus.`, r`Young's modulus of a wire depends on its dimensions.`, 2, r`I is true: $Y$ belongs to the material. II is false: it does not depend on size or shape.`),
  stm(4, 'sudden loading', r`A mass released suddenly from the end of an unstretched wire stretches it by twice its equilibrium extension.`, r`At the lowest point, the speed of the mass is zero.`, 0, r`Both true. The energy argument is $mgx=\tfrac12kx^2$, so $x = 2mg/k$ at the lowest point, where the mass is momentarily at rest.`),
  stm(3, 'bulk modulus of a gas', r`The isothermal bulk modulus of an ideal gas equals its pressure.`, r`The adiabatic bulk modulus of an ideal gas is $\gamma$ times its isothermal bulk modulus.`, 0, r`Isothermal $PV=$ constant gives $B=P$; adiabatic $PV^{\gamma}=$ constant gives $B=\gamma P$. Both true.`),
  stm(3, 'wire under its own weight', r`In a uniform wire hanging from a ceiling, the stress at the middle equals the stress at the free lower end.`, r`The stress at the free lower end of a hanging wire is zero.`, 3, r`I is false: the stress at the middle is $\rho gL/2$ but at the lower end it is zero. II is true.`),
  stm(3, 'elastic energy', r`The energy stored per unit volume in a stretched wire is $\tfrac12\times$ stress $\times$ strain.`, r`The energy stored in a wire is equal to the area under its load-extension graph.`, 0, r`Both true. Area under force-extension is $\tfrac12F\Delta L$; dividing by volume $AL$ gives $\tfrac12\sigma\varepsilon$.`),
  stm(3, 'hysteresis', r`In stretching and releasing a rubber band, the loading and unloading stress-strain curves differ.`, r`The Young's modulus of rubber is much larger than that of steel.`, 2, r`I is true (elastic hysteresis). II is false: rubber's $Y\sim10^{7}$ Pa is about $10^{4}$ times smaller than steel's.`),
);
items.push(
  mcq(3, 'counting statements', r`Four statements: (a) Stress and pressure have the same dimensions. (b) A wire's Young's modulus doubles when its length doubles. (c) The bulk modulus of a perfectly incompressible material is infinite. (d) Strain is measured in $\mathrm{N\,m^{-2}}$. How many are correct?`, 'two', ['one', 'three', 'four'],
    r`(a) true. (b) false: $Y$ is independent of length. (c) true: $B = -\Delta P/(\Delta V/V)$ and $\Delta V=0$. (d) false: strain has no unit. Two are correct.`, { format: 'statements' }),
  mcq(3, 'counting statements', r`Four statements: (a) Poisson's ratio is dimensionless. (b) The energy stored per unit volume of a stretched wire is $\tfrac12\times$ stress $\times$ strain. (c) The thermal stress in a clamped rod grows with its length. (d) The rigidity modulus of a gas is zero. How many are correct?`, 'three', ['two', 'four', 'one'],
    r`(a) true. (b) true. (c) false: $\sigma = Y\alpha\Delta T$ has no $L$. (d) true: a gas cannot support shear. Three are correct.`, { format: 'statements' }),
);

// ---------- Match the following ----------
const M = (level, sub, group, q, sol) => ({ id: nid(), type: 'mcq', level, format: 'match', exams: EX[level], sub, group, q,
  options: ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'], answer: 0, sol });
items.push(
  M(2, 'moduli', 'm1', r`Match each modulus in List I with the stress and strain it connects in List II.`, r`Young's modulus: longitudinal stress and strain (p). Bulk modulus: pressure and volume strain (q). Rigidity modulus: tangential stress and shear angle (r). Poisson's ratio is the ratio of two strains, lateral to longitudinal (s).`),
  M(3, 'formulae', 'm2', r`Match each quantity in List I with its expression in List II (symbols as usual; $\rho$ is density of the wire material).`, r`Energy density $=\tfrac12Y\varepsilon^2$ (p). Thermal stress $=Y\alpha\Delta T$ (q). Extension under own weight $=\rho gL^2/2Y$ (r). Force constant $=AY/L$ (s).`),
  M(3, 'stress-strain curve', 'm3', r`Match each feature of the stress-strain curve of a ductile metal (List I) with its meaning (List II).`, r`The straight part from the origin obeys Hooke's law (p). The elastic limit is where permanent set begins (q). At the yield point strain grows with little rise of stress (r). The highest stress on the curve is the ultimate tensile strength (s).`),
  M(2, 'ratios', 'm4', r`A wire stretches by $x$ under a load. Match each change in List I (all else the same) with the new extension in List II.`, r`$\Delta L = FL/(\pi r^2Y)$. Doubling the radius gives $x/4$ (p). Doubling the length gives $2x$ (q). Doubling the Young's modulus (another material) gives $x/2$ (r). Tripling the load gives $3x$ (s).`),
);
const swap = (it, pos) => { const a = it.answer; [it.options[a], it.options[pos]] = [it.options[pos], it.options[a]]; it.answer = pos; };
items.filter((x) => x.format === 'match').forEach((it, i) => swap(it, [1, 3, 0, 2][i]));

items.push(
  asrt(2, 'moduli', r`A steel wire and a brass wire of the same dimensions, loaded equally, stretch by different amounts.`, r`Steel and brass have different densities.`, 1,
    r`A is true: the Young's moduli differ ($2\times10^{11}$ and about $0.9\times10^{11}$ Pa), so $\Delta L = FL/AY$ differs. R is also true, but density plays no part in the extension. So R is not the explanation.`),
  asrt(3, 'stress-strain curve', r`The stress-strain curve of a brittle material ends soon after the elastic limit.`, r`Glass is a brittle material.`, 1,
    r`A is true: a brittle material fractures with almost no plastic stretch. R is true (glass is brittle), but it only names an example and does not explain the shape of the curve.`),
  asrt(2, 'dimensions', r`Young's modulus and pressure have the same dimensions.`, r`Both are the ratio of a force to an area.`, 0,
    r`Both have the dimensional formula $\mathrm{ML^{-1}T^{-2}}$ because strain is dimensionless, so $Y$ has the dimensions of stress, which are the dimensions of force over area. R explains A.`),
  asrt(3, 'hysteresis', r`Rubber is used in shock absorbers and tyres.`, r`Stretched rubber, when released, has a loading and unloading curve that do not coincide, so energy is absorbed as heat.`, 0,
    r`The area of the hysteresis loop is energy lost per unit volume per cycle, so vibrations get damped. R explains A.`),
  stm(2, "Young's modulus", r`The Young's modulus of a wire doubles when its length is doubled.`, r`Strain is measured in $\mathrm{N\,m^{-2}}$.`, 1,
    r`Both false. $Y$ is a material property and does not depend on length. Strain is a ratio of two lengths and has no unit.`),
  stm(4, "Poisson's ratio", r`The Poisson's ratio of an ordinary solid can be 0.8.`, r`The bulk modulus of a perfectly incompressible solid is zero.`, 1,
    r`Both false. $\sigma<0.5$ (otherwise $B = Y/3(1-2\sigma)$ is negative). A perfectly incompressible solid has $\Delta V=0$ for any pressure, so $B = -\Delta P/(\Delta V/V)$ is infinite, not zero.`),
);

items.push(
  nx(() => { const A1 = PI * 1e-6, A2 = PI * (4e-6 - 1e-6), Y1 = 2e11, Y2 = 1.1e11, F = 1000; const x = F * Y1 * A1 / (Y1 * A1 + Y2 * A2); return [5, 'composite wire', r`A composite rod has a steel core of radius 1 mm ($Y = 2\times10^{11}$ Pa) inside a tightly fitting copper sleeve of outer radius 2 mm ($Y = 1.1\times10^{11}$ Pa). A pull of 1000 N acts along its length and both materials stretch equally. Find the force carried by the steel core (in N, nearest whole).`, x, 1, 0, r`Equal strain in both, so each carries a force $\propto YA$. Steel: $Y_1A_1 = 2\times10^{11}\times\pi(10^{-3})^2 = 6.283\times10^{5}$ N. Copper: $A_2 = \pi(4-1)\times10^{-6} = 9.425\times10^{-6}\ \mathrm{m^2}$ and $Y_2A_2 = 1.037\times10^{6}$ N. Steel share $=\dfrac{6.283}{6.283 + 10.367}\times1000 = ${f(x)}$ N.`, { unit: 'N', trap: 'The sleeve area is the ring $\\pi(R^2 - r^2)$, not $\\pi R^2$.' }]; }),
  nx(() => [5, 'elastic energy', r`Two identical wires of force constant $k$ carry the same load $F$. In one arrangement they are joined end to end; in the other they hang side by side and share the load equally. Find the ratio (energy stored in the series arrangement) : (energy stored in the parallel arrangement).`, 4, 0, 0, r`Series: $k_s = k/2$, so $U_s = F^2/2k_s = F^2/k$. Parallel: $k_p = 2k$, so $U_p = F^2/2k_p = F^2/4k$. Ratio $=4$.`, { trap: 'Same load, not same extension.' }]),
  nx(() => { const m = 5, M = 2, L = 4, A = 1e-6, Y = 2e11; const x = (m + M / 2) * G * L / (A * Y) * 1000; return [4, 'wire with load and own weight', r`A uniform steel wire of mass 2 kg, length 4 m and area $1\ \mathrm{mm^2}$ carries a 5 kg load at its lower end. Find its total extension (in mm, 2 decimals). $Y = 2\times10^{11}$ Pa, $g=9.8\ \mathrm{m\,s^{-2}}$.`, x, 0.02, 2, r`The extension from the load is $\dfrac{mgL}{AY}$ and from the wire's own weight $\dfrac{MgL}{2AY}$. Together $\dfrac{(m + M/2)gL}{AY} = \dfrac{6\times9.8\times4}{2\times10^{5}} = ${f(x / 1000)}$ m $=${f(x)}$ mm.`, { unit: 'mm', trap: 'Only half of the wire\'s own weight counts.' }]; }),
  nx(() => { const eta = 8e10, r0 = 5e-3, L = 1, th = 0.1; const t = PI * eta * r0 ** 4 * th / (2 * L); return [5, 'torsion', r`A solid steel rod of radius 5 mm and length 1 m has modulus of rigidity $8\times10^{10}$ Pa. The torque needed to twist one end through an angle $\theta$ relative to the other is $\tau = \dfrac{\pi\eta r^4}{2L}\theta$. Find the torque for $\theta = 0.1$ rad (in N m, 2 decimals).`, t, 0.02, 2, r`$\tau = \dfrac{\pi\times8\times10^{10}\times(5\times10^{-3})^4}{2\times1}\times0.1 = \dfrac{\pi\times8\times10^{10}\times6.25\times10^{-10}}{2}\times0.1 = 78.54\times0.1 = ${f(t)}$ N m.`, { unit: 'N m', trap: 'The fourth power of the radius: use metres, not millimetres.' }]; }),
  mx(() => { const B = 1.6e11, h = 6000, e = 1000 * G * h / B; return [4, 'mixed: solids and fluids', r`A steel ball ($B = 1.6\times10^{11}$ Pa) sinks to the bottom of a 6 km deep sea (take $\rho = 1000\ \mathrm{kg\,m^{-3}}$ throughout, $g = 9.8\ \mathrm{m\,s^{-2}}$, ignore the atmosphere). The fractional decrease in its volume is`, e, [e * 3, e / 3, e * 100], '', 3, r`The extra pressure is $\rho gh = 1000\times9.8\times6000 = 5.88\times10^{7}$ Pa. $\Delta V/V = \Delta P/B = 5.88\times10^{7}/1.6\times10^{11} = 3.68\times10^{-4}$.`, {}]; }),
);

// ---------- Multiple correct (JEE Advanced style) ----------
items.push(
  msq(4, 'stress-strain curve', r`Which of the following are correct for a ductile metal wire loaded up to fracture?`,
    ['The slope of the straight initial part is the Young\'s modulus', 'Beyond the elastic limit the wire returns to its original length when unloaded', 'The area under the elastic part is the energy stored per unit volume', 'The wire cannot stretch at all after the yield point'], [0, 2],
    r`(A) true. (B) false: permanent set remains. (C) true: area $=\int\sigma\,\mathrm{d}\varepsilon = \tfrac12\sigma\varepsilon$ in J/m³. (D) false: that is exactly where plastic stretch happens.`, { trap: 'The yield point is not the end of stretching.' }),
  msq(3, 'moduli', r`Which of these quantities have the same dimensions as Young's modulus?`,
    ['Pressure', 'Energy per unit volume', 'Force per unit length', 'Stress'], [0, 1, 3],
    r`$Y\sim\mathrm{ML^{-1}T^{-2}}$. Pressure (N/m²), energy density (J/m³ = N/m²) and stress all match. Force per unit length (surface tension) is $\mathrm{MT^{-2}}$.`),
  msq(3, 'thermal stress', r`A rod of length $L$, area $A$, modulus $Y$ and expansion coefficient $\alpha$ is clamped rigidly at both ends and heated by $\Delta T$. Which of the following are correct?`,
    [r`The stress is $Y\alpha\Delta T$`, r`The force on each wall is $YA\alpha\Delta T$`, r`The stress is proportional to $L$`, r`The compressive strain in the rod is $\alpha\Delta T$`], [0, 1, 3],
    r`Free expansion strain $\alpha\Delta T$ is cancelled by an equal compression. Stress $=Y\alpha\Delta T$, force $=$ stress $\times A$. The length $L$ cancels, so (C) is false.`),
  msq(4, 'wires in series and parallel', r`Two wires P and Q of the same length and area, with $Y_P>Y_Q$, are joined first end to end (series), then side by side with a rigid bar (parallel), and loaded. Which statements are correct?`,
    ['In series, Q stretches more than P', 'In series, the force in P is larger than in Q', 'In parallel, P carries more of the load than Q', 'In parallel, Q stretches more than P'], [0, 2],
    r`Series: same force and area, so same stress; $\Delta L = \sigma L/Y$ is larger for the smaller $Y$ (Q). Parallel: equal extension (rigid bar), so force $\propto Y$: P carries more. (B) and (D) are false.`),
  msq(5, 'rod on a smooth table', r`A uniform rod of mass $M$, length $L$, area $A$ and modulus $Y$ lies on a smooth table and is pulled by a force $F$ at one end along its length. Which statements are correct?`,
    [r`The tension at the free end is zero`, r`The tension in the middle of the rod is $F/2$`, r`The extension is $FL/AY$`, r`The extension is $FL/2AY$`], [0, 1, 3],
    r`Acceleration $a = F/M$. The part beyond a point at distance $x$ from the free end has mass $Mx/L$, so tension $=Fx/L$: zero at the free end, $F/2$ in the middle, $F$ at the pulled end. $\Delta L = \int T/AY\,\mathrm{d}x = FL/2AY$.`),
  msq(4, 'elastic constants', r`Which statements about an isotropic solid are correct?`,
    [r`Poisson's ratio can be negative for some materials`, r`$B$ is infinite if $\sigma = 0.5$`, r`$\eta$ is always greater than $Y$`, r`The bulk modulus of a liquid is finite`], [0, 1, 3],
    r`$Y=3B(1-2\sigma)$: if $\sigma=0.5$ then $B\to\infty$. $\sigma$ can be negative (auxetic foams), as the limits are $-1<\sigma<0.5$. $\eta = Y/2(1+\sigma)$ is smaller than $Y$ for $\sigma>-0.5$, so (C) is false.`),
  msq(3, 'elastic energy', r`A wire is stretched slowly within the elastic limit by a load $F$ to an extension $x$. Which statements are correct?`,
    [r`The elastic energy stored is $\tfrac12Fx$`, r`The energy stored per unit volume is $\tfrac12\sigma\varepsilon$`, r`If $F$ is doubled, the stored energy becomes four times`, r`If the extension is doubled, the stored energy doubles`], [0, 1, 2],
    r`$U=\tfrac12Fx = \tfrac12kx^2$, so $U\propto x^2\propto F^2$. (A), (B), (C) are true. (D) is false: doubling $x$ quadruples $U$.`),
  msq(4, 'wire under its own weight', r`A uniform wire of length $L$ and density $\rho$ hangs from a ceiling. Which statements are correct?`,
    [r`The stress is largest at the point of suspension`, r`The stress at the midpoint is $\rho gL/2$`, r`The total extension is $\rho gL^2/2Y$`, r`The stress is the same at every point`], [0, 1, 2],
    r`At distance $x$ from the free end the stress is $\rho gx$ (weight of the part below, over area). So largest at the top, $\rho gL/2$ at the middle, zero at the bottom. $\Delta L = \int\rho gx/Y\,\mathrm{d}x = \rho gL^2/2Y$.`),
  msq(5, 'elastic energy', r`The wire of a force-constant $k$ carries a mass $m$ hung at its end. The mass is released from the unstretched position. Which statements are correct?`,
    [r`The maximum extension is $2mg/k$`, r`The equilibrium extension is $mg/k$`, r`At maximum extension, the net force on the mass is $mg$ upward`, r`Energy stored at maximum extension is $2m^2g^2/k$`], [0, 1, 2, 3],
    r`Static extension $mg/k$. Max extension $2mg/k$. There the spring force is $2mg$ upwards and weight $mg$ downwards, so net $mg$ up. Energy $=\tfrac12k(2mg/k)^2 = 2m^2g^2/k$. All four are true.`),
);

const groups = {
  m1: { title: 'Moduli of elasticity',
    list1: ["A. Young's modulus", 'B. Bulk modulus', 'C. Modulus of rigidity', "D. Poisson's ratio"],
    list2: ['p. longitudinal stress to longitudinal strain', 'q. pressure change to volume strain', 'r. tangential stress to shear angle', 's. lateral strain to longitudinal strain'] },
  m2: { title: 'Elasticity formulae',
    list1: ['A. Elastic energy per unit volume', 'B. Thermal stress in a clamped rod', 'C. Extension of a wire under its own weight', 'D. Force constant of a wire'],
    list2: [r`p. $\tfrac12Y\varepsilon^2$`, r`q. $Y\alpha\Delta T$`, r`r. $\rho gL^2/2Y$`, r`s. $AY/L$`] },
  m3: { title: 'Stress-strain curve of a ductile metal',
    list1: ['A. Straight line from the origin', 'B. Elastic limit', 'C. Yield point', 'D. Highest point of the curve'],
    list2: ["p. Hooke's law holds", 'q. permanent set begins', 'r. strain grows with little rise in stress', 's. ultimate tensile strength'] },
  m4: { title: 'Changing a wire',
    list1: ['A. Radius doubled', 'B. Length doubled', 'C. Material changed to one with twice the Young\'s modulus', 'D. Load tripled'],
    list2: [r`p. extension becomes $x/4$`, r`q. extension becomes $2x$`, r`r. extension becomes $x/2$`, r`s. extension becomes $3x$`] },
  p1: { title: 'A hanging steel wire',
    passage: r`<p>A steel wire of length 2 m and diameter 1 mm hangs from a rigid support. A 20 kg mass is hung from its lower end and the wire remains within its elastic limit. Take $Y = 2\times10^{11}\ \mathrm{N\,m^{-2}}$ and $g = 9.8\ \mathrm{m\,s^{-2}}$, and ignore the weight of the wire.</p>` },
  p2: { title: 'A tensile test',
    passage: r`<p>A tensile test on a metal bar gives these readings (strain has no unit).</p><table><tr><th>Strain</th><td>0</td><td>0.0005</td><td>0.0010</td><td>0.0015</td><td>0.004</td><td>0.10</td><td>0.20</td></tr><tr><th>Stress (MPa)</th><td>0</td><td>100</td><td>200</td><td>300</td><td>320</td><td>450</td><td>400</td></tr></table><p>The points up to a strain of 0.0015 lie on a straight line. The bar breaks at the last point.</p>` },
  p3: { title: 'Two wires in series',
    passage: r`<p>A steel wire (length 1.0 m, $Y = 2\times10^{11}$ Pa) is joined end to end to a copper wire (length 1.5 m, $Y = 1.1\times10^{11}$ Pa). Both have diameter 1 mm. The free end of the steel wire is fixed to the ceiling and a 15 kg mass hangs from the copper wire. Ignore the weights of the wires; $g = 9.8\ \mathrm{m\,s^{-2}}$.</p>` },
  p4: { title: 'Water at depth',
    passage: r`<p>A flexible sealed bag holding $2.0\ \mathrm{m^3}$ of fresh water is lowered 2000 m below the sea surface. Take the density of sea water as $1000\ \mathrm{kg\,m^{-3}}$, $g = 9.8\ \mathrm{m\,s^{-2}}$ and the bulk modulus of water $2.2\times10^{9}$ Pa. Ignore atmospheric pressure. The bag transmits the sea pressure to the water inside.</p>` },
};
const pas = (level, sub, group, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: EX[level], sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
const A1 = PI * 1e-6 / 4;
items.push(
  pas(2, 'stress', 'p1', r`Find the stress in the wire (in MPa, nearest whole).`, () => 20 * G / A1 / 1e6, 1, 0, r`$F = 20\times9.8 = 196$ N. $A = \pi(0.5\times10^{-3})^2 = 7.854\times10^{-7}\ \mathrm{m^2}$. $\sigma = 196/7.854\times10^{-7} = 2.50\times10^{8}$ Pa $=250$ MPa.`, { unit: 'MPa' }),
  pas(2, 'extension of a wire', 'p1', r`Find the extension of the wire (in mm, 2 decimals).`, () => 20 * G * 2 / (A1 * 2e11) * 1000, 0.02, 2, r`$\Delta L = \dfrac{\sigma L}{Y} = \dfrac{2.495\times10^{8}\times2}{2\times10^{11}} = 2.495\times10^{-3}$ m $=2.50$ mm.`, { unit: 'mm' }),
  pas(3, 'elastic energy', 'p1', r`Find the elastic energy stored in the wire (in mJ, nearest whole).`, () => 0.5 * 20 * G * (20 * G * 2 / (A1 * 2e11)) * 1000, 1, 0, r`$U = \tfrac12F\Delta L = 0.5\times196\times2.495\times10^{-3} = 0.2445$ J $=245$ mJ (about 244.5 mJ).`, { unit: 'mJ', trap: 'Not $F\\Delta L$.' }),
  pas(2, "Young's modulus", 'p2', r`Find the Young's modulus of the bar (in units of $10^{11}$ Pa).`, () => 100e6 / 0.0005 / 1e11, 0, 0, r`Slope of the straight part: $Y = 100\times10^{6}/0.0005 = 2\times10^{11}$ Pa. So 2.`),
  pas(3, 'elastic energy', 'p2', r`Find the elastic energy stored per unit volume at the end of the straight part (in $\mathrm{kJ\,m^{-3}}$).`, () => 0.5 * 300e6 * 0.0015 / 1e3, 0, 0, r`Area of the triangle under the straight part: $\tfrac12\sigma\varepsilon = 0.5\times300\times10^{6}\times1.5\times10^{-3} = 2.25\times10^{5}\ \mathrm{J\,m^{-3}} = 225\ \mathrm{kJ\,m^{-3}}$.`, { unit: 'kJ/m³' }),
  pas(4, 'stress-strain curve', 'p2', r`The bar is 2 m long. By how much does it extend (in mm) when the stress is 250 MPa? (It is on the straight part.)`, () => 250e6 / 2e11 * 2 * 1000, 0.005, 2, r`Strain $=250\times10^{6}/2\times10^{11} = 1.25\times10^{-3}$. $\Delta L = 1.25\times10^{-3}\times2 = 2.5\times10^{-3}$ m $=2.50$ mm.`, { unit: 'mm' }),
  pas(3, 'wires in series', 'p3', r`Find the stress in either wire (in MPa, 1 decimal).`, () => 15 * G / A1 / 1e6, 0.1, 1, r`Both wires carry the same force 147 N and have the same area: $\sigma = 147/7.854\times10^{-7} = 1.872\times10^{8}$ Pa $=187.2$ MPa.`, { unit: 'MPa' }),
  pas(3, 'wires in series', 'p3', r`Find the extension of the copper wire (in mm, 2 decimals).`, () => 15 * G / A1 * 1.5 / 1.1e11 * 1000, 0.02, 2, r`$\Delta L = \dfrac{\sigma L}{Y} = \dfrac{1.872\times10^{8}\times1.5}{1.1\times10^{11}} = 2.553\times10^{-3}$ m $=2.55$ mm.`, { unit: 'mm' }),
  pas(4, 'wires in series', 'p3', r`Find the total extension of the combination (in mm, 2 decimals).`, () => (15 * G / A1 / 2e11 * 1 + 15 * G / A1 * 1.5 / 1.1e11) * 1000, 0.03, 2, r`Steel: $1.872\times10^{8}\times1/2\times10^{11} = 0.936$ mm. Copper: 2.553 mm. Total $=3.49$ mm.`, { unit: 'mm' }),
  pas(2, 'pressure and depth', 'p4', r`Find the pressure at the chamber's depth (in MPa, 1 decimal).`, () => 1000 * G * 2000 / 1e6, 0.1, 1, r`$P = \rho gh = 1000\times9.8\times2000 = 1.96\times10^{7}$ Pa $=19.6$ MPa.`, { unit: 'MPa' }),
  pas(3, 'bulk modulus', 'p4', r`By how much does the volume of water decrease (in litres, nearest whole)?`, () => 1.96e7 / 2.2e9 * 2.0 * 1000, 0.5, 0, r`$\Delta V = V\Delta P/B = 2.0\times1.96\times10^{7}/2.2\times10^{9} = 0.01782\ \mathrm{m^3} = 17.8$ L. Nearest whole: 18.`, { unit: 'L' }),
);

// ---------- Number templates ----------
const MAT = [['steel', 2.0e11, 1.2e-5, 7800], ['copper', 1.1e11, 1.7e-5, 8900], ['brass', 0.9e11, 1.9e-5, 8500], ['aluminium', 0.7e11, 2.3e-5, 2700]];
const txtR = (x) => String(+x.toFixed(3));
const T = (x, rel = 0.011) => ({ answer: +x.toPrecision(3), tol: +(Math.abs(x) * rel).toPrecision(2) });
const gens = [
  { id: 'se-g01', type: 'nat', level: 2, exams: EX[2], sub: 'extension of a wire',
    make(rng) {
      const m = choose(rng, MAT); const L = pick(rng, 1, 4, 0.5); const d = pick(rng, 0.5, 2, 0.25); const M = pick(rng, 5, 50, 5); const v = int(rng, 0, 3);
      const A = PI * (d * 1e-3) ** 2 / 4; const F = M * G; const x = F * L / (A * m[1]);
      const head = `A ${m[0]} wire ($Y = ${fT(m[1] / 1e11, 2)}\\times10^{11}$ Pa), `;
      if (v === 0) return { v, m, L, d, M, ...T(x * 1000), unit: 'mm', q: r`${head}length ${L} m and diameter ${d} mm, carries a ${M} kg load. Find its extension (in mm). Take $g=9.8\ \mathrm{m\,s^{-2}}$.`, sol: r`$F = ${M}\times9.8 = ${f(F)}$ N, $A = \pi(${R(d / 2, 8)}\times10^{-3})^2 = ${fT(A, 3)}\ \mathrm{m^2}$. $\Delta L = FL/AY = ${f(x * 1000)}$ mm.`, trap: 'Radius is half the diameter.' };
      if (v === 1) { const x2 = x; return { v, m, L, d, x2, M, ...T(F), unit: 'N', q: r`${head}length ${L} m and diameter ${d} mm, extends by ${f(x2 * 1000)} mm. Find the load on it (in N).`, sol: r`$F = AY\Delta L/L = ${fT(A, 3)}\times${fT(m[1], 2)}\times${f(x2)}/${L} = ${f(F)}$ N.` }; }
      if (v === 2) return { v, m, L, d, F, x2: x, ...T(m[1] / 1e11, 0.011), unit: '10¹¹ Pa', q: r`A wire of length ${L} m and diameter ${d} mm extends by ${f(x * 1000)} mm under a load of ${f(F)} N. Find its Young's modulus (in units of $10^{11}$ Pa).`, sol: r`$Y = \dfrac{FL}{A\Delta L} = \dfrac{${f(F)}\times${L}}{${fT(A, 3)}\times${f(x)}} = ${fT(m[1] / 1e11, 3)}\times10^{11}$ Pa.` };
      const dd = Math.sqrt(4 * F * L / (PI * m[1] * x)) * 1000;
      return { v, m, L, d, F, x2: x, ...T(dd), unit: 'mm', q: r`A ${m[0]} wire ($Y = ${fT(m[1] / 1e11, 2)}\times10^{11}$ Pa) of length ${L} m extends by ${f(x * 1000)} mm under a load of ${f(F)} N. Find its diameter (in mm).`, sol: r`$A = FL/Y\Delta L$ and $d = \sqrt{4A/\pi} = ${f(dd)}$ mm.` };
    },
    verify: (p) => (p.v === 0 ? p.M * G * p.L / (PI * (p.d * 1e-3) ** 2 / 4 * p.m[1]) * 1000 : p.v === 1 ? p.M * G : p.v === 2 ? p.F * p.L / (PI * (p.d * 1e-3) ** 2 / 4 * p.x2) / 1e11 : p.d) },
  { id: 'se-g02', type: 'nat', level: 1, exams: EX[1], sub: 'stress and strain',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const F = pick(rng, 100, 900, 100); const A = pick(rng, 1, 5, 0.5); const s = F / (A * 1e-6); return { v, F, A, ...T(s / 1e6), unit: 'MPa', q: r`A pull of ${F} N acts on a wire of cross-section ${A} $\mathrm{mm^2}$. Find the stress (in MPa).`, sol: r`$\sigma = F/A = ${F}/(${A}\times10^{-6}) = ${f(s)}$ Pa $=${f(s / 1e6)}$ MPa.` }; }
      if (v === 1) { const L = pick(rng, 1, 5); const dl = pick(rng, 1, 5, 0.5); return { v, L, dl, ...T(dl / (L * 1000) * 100, 0.011), unit: '%', q: r`A wire ${L} m long stretches by ${dl} mm. Find the strain in percent.`, sol: r`Strain $=\Delta L/L = ${dl}\times10^{-3}/${L} = ${f(dl / (L * 1000))}$, which is ${f(dl / (L * 1000) * 100)}%.` }; }
      const s = pick(rng, 100, 400, 50); const e = pick(rng, 0.5, 2, 0.25) * 1e-3; return { v, s, e, ...T(s * 1e6 / e / 1e11), unit: '10¹¹ Pa', q: r`A wire shows a stress of ${s} MPa with a strain of $${fT(e * 1e3, 3)}\times10^{-3}$. Find $Y$ (in units of $10^{11}$ Pa).`, sol: r`$Y = \sigma/\varepsilon = ${s}\times10^{6}/${fT(e, 3)} = ${f(s * 1e6 / e / 1e11)}\times10^{11}$ Pa.` };
    },
    verify: (p) => (p.v === 0 ? p.F / (p.A * 1e-6) / 1e6 : p.v === 1 ? p.dl * 1e-3 / p.L * 100 : p.s * 1e6 / p.e / 1e11) },
  { id: 'se-g03', type: 'nat', level: 2, exams: EX[2], sub: 'elastic energy',
    make(rng) {
      const v = int(rng, 0, 2); const m = choose(rng, MAT);
      if (v === 0) { const F = pick(rng, 50, 500, 50); const x = pick(rng, 0.5, 4, 0.5); return { v, F, x, ...T(0.5 * F * x * 1e-3 * 1000), unit: 'mJ', q: r`A wire is stretched slowly by ${x} mm under a force that rises to ${F} N. Find the elastic energy stored (in mJ).`, sol: r`$U=\tfrac12F\Delta L = 0.5\times${F}\ \mathrm{N}\times${x}\ \mathrm{mm} = ${f(0.5 * F * x)}$ mJ (newton times millimetre is millijoule).`, trap: 'Half of $F\\Delta L$.' }; }
      if (v === 1) { const e = pick(rng, 0.5, 2, 0.25) * 1e-3; const u = 0.5 * m[1] * e * e; return { v, m, e, ...T(u / 1e3), unit: 'kJ/m³', q: r`A ${m[0]} wire ($Y=${fT(m[1] / 1e11, 2)}\times10^{11}$ Pa) is strained to $${fT(e * 1e3, 3)}\times10^{-3}$. Find the energy stored per unit volume (in $\mathrm{kJ\,m^{-3}}$).`, sol: r`$u=\tfrac12Y\varepsilon^2 = 0.5\times${fT(m[1], 2)}\times(${fT(e, 3)})^2 = ${f(u)}\ \mathrm{J\,m^{-3}} = ${f(u / 1e3)}$ kJ/m³.` }; }
      const F = pick(rng, 20, 100, 10); const L = pick(rng, 1, 3); const A = pick(rng, 1, 3) * 1e-6; const U = F * F * L / (2 * A * m[1]); return { v, m, F, L, A, ...T(U * 1000), unit: 'mJ', q: r`A ${m[0]} wire ($Y=${fT(m[1] / 1e11, 2)}\times10^{11}$ Pa) of length ${L} m and area ${R(A * 1e6, 8)} $\mathrm{mm^2}$ carries a steady load of ${F} N. Find the elastic energy stored (in mJ).`, sol: r`$U = \dfrac{F^2L}{2AY} = \dfrac{${R(F * F, 8)}\times${L}}{2\times${fT(A, 2)}\times${fT(m[1], 2)}} = ${f(U)}$ J $=${f(U * 1000)}$ mJ.` };
    },
    verify: (p) => (p.v === 0 ? 0.5 * p.F * p.x : p.v === 1 ? 0.5 * p.m[1] * p.e * p.e / 1e3 : p.F * p.F * p.L / (2 * p.A * p.m[1]) * 1000) },
  { id: 'se-g04', type: 'nat', level: 3, exams: EX[3], sub: 'wires in series',
    make(rng) {
      const a = choose(rng, MAT.slice(0, 2)); const b = choose(rng, MAT.slice(2)); const L1 = pick(rng, 0.5, 2, 0.5); const L2 = pick(rng, 0.5, 2, 0.5); const d = pick(rng, 0.5, 1.5, 0.25); const M = pick(rng, 5, 30, 5); const v = int(rng, 0, 1);
      const A = PI * (d * 1e-3) ** 2 / 4; const F = M * G; const x1 = F * L1 / (A * a[1]); const x2 = F * L2 / (A * b[1]);
      if (v === 0) return { v, a, b, L1, L2, d, M, ...T((x1 + x2) * 1000), unit: 'mm', q: r`A ${a[0]} wire (${L1} m, $Y=${fT(a[1] / 1e11, 2)}\times10^{11}$ Pa) is joined to a ${b[0]} wire (${L2} m, $Y=${fT(b[1] / 1e11, 2)}\times10^{11}$ Pa), both of diameter ${d} mm. A ${M} kg mass hangs from the lower end. Find the total extension (in mm). $g=9.8\ \mathrm{m\,s^{-2}}$.`, sol: r`Both wires carry ${f(F)} N. $A = ${fT(A, 3)}\ \mathrm{m^2}$. ${a[0]}: $FL/AY = ${f(x1 * 1000)}$ mm. ${b[0]}: ${f(x2 * 1000)} mm. Total $=${f((x1 + x2) * 1000)}$ mm.` };
      return { v, a, b, L1, L2, ...T(x1 / x2, 0.011), unit: '', q: r`A ${a[0]} wire (${L1} m, $Y=${fT(a[1] / 1e11, 2)}\times10^{11}$ Pa) and a ${b[0]} wire (${L2} m, $Y=${fT(b[1] / 1e11, 2)}\times10^{11}$ Pa) of equal area are joined end to end and loaded. Find the ratio (extension of the ${a[0]} wire) : (extension of the ${b[0]} wire) as a number.`, sol: r`Same force and area. $\Delta L\propto L/Y$. Ratio $=\dfrac{${L1}/${fT(a[1] / 1e11, 2)}}{${L2}/${fT(b[1] / 1e11, 2)}} = ${f(x1 / x2)}$.` };
    },
    verify: (p) => { const A = PI * ((p.d ?? 1) * 1e-3) ** 2 / 4; return p.v === 0 ? p.M * G * (p.L1 / p.a[1] + p.L2 / p.b[1]) / A * 1000 : (p.L1 / p.a[1]) / (p.L2 / p.b[1]); } },
  { id: 'se-g05', type: 'nat', level: 3, exams: EX[3], sub: 'wires in parallel',
    make(rng) {
      const a = choose(rng, MAT.slice(0, 2)); const b = choose(rng, MAT.slice(2)); const L1 = pick(rng, 1, 2, 0.5); const L2 = pick(rng, 1, 2, 0.5); const A1 = pick(rng, 1, 3); const A2 = pick(rng, 1, 3); const W = pick(rng, 100, 500, 100);
      const k1 = A1 * a[1] / L1; const k2 = A2 * b[1] / L2; const F1 = W * k1 / (k1 + k2);
      return { a, b, L1, L2, A1, A2, W, ...T(F1), unit: 'N', q: r`A ${W} N load is carried by two vertical wires joined to a rigid horizontal bar, so both extend equally. Wire 1 is ${a[0]} ($Y=${fT(a[1] / 1e11, 2)}\times10^{11}$ Pa, ${A1} $\mathrm{mm^2}$, ${L1} m); wire 2 is ${b[0]} ($Y=${fT(b[1] / 1e11, 2)}\times10^{11}$ Pa, ${A2} $\mathrm{mm^2}$, ${L2} m). Find the force carried by wire 1 (in N).`, sol: r`Equal extension means the force is shared as $k = AY/L$. $k_1\propto${A1}\times${fT(a[1] / 1e11, 2)}/${L1} = ${f(A1 * a[1] / 1e11 / L1)}$ and $k_2\propto${A2}\times${fT(b[1] / 1e11, 2)}/${L2} = ${f(A2 * b[1] / 1e11 / L2)}$. $F_1 = ${W}\times\dfrac{k_1}{k_1+k_2} = ${f(F1)}$ N.`, trap: 'Share by stiffness $AY/L$, not equally.' };
    },
    verify: (p) => p.W * (p.A1 * p.a[1] / p.L1) / (p.A1 * p.a[1] / p.L1 + p.A2 * p.b[1] / p.L2) },
  { id: 'se-g06', type: 'nat', level: 3, exams: EX[3], sub: 'thermal stress',
    make(rng) {
      const m = choose(rng, MAT); const dT = pick(rng, 20, 100, 10); const v = int(rng, 0, 2);
      if (v === 0) return { v, m, dT, ...T(m[1] * m[2] * dT / 1e6), unit: 'MPa', q: r`A ${m[0]} rod ($Y=${fT(m[1] / 1e11, 2)}\times10^{11}$ Pa, $\alpha=${fT(m[2] * 1e5, 3)}\times10^{-5}\ \mathrm{K^{-1}}$) is clamped rigidly at both ends and heated by ${dT} °C. Find the thermal stress (in MPa).`, sol: r`$\sigma = Y\alpha\Delta T = ${fT(m[1], 2)}\times${fT(m[2], 3)}\times${dT} = ${f(m[1] * m[2] * dT)}$ Pa $=${f(m[1] * m[2] * dT / 1e6)}$ MPa.` };
      if (v === 1) { const A = pick(rng, 1, 6) * 1e-4; return { v, m, dT, A, ...T(m[1] * m[2] * dT * A / 1e3), unit: 'kN', q: r`A ${m[0]} bar of cross-section ${R(A * 1e4, 8)} $\mathrm{cm^2}$ ($Y=${fT(m[1] / 1e11, 2)}\times10^{11}$ Pa, $\alpha=${fT(m[2] * 1e5, 3)}\times10^{-5}\ \mathrm{K^{-1}}$) is held between rigid walls and heated by ${dT} °C. Find the force on each wall (in kN).`, sol: r`$F = YA\alpha\Delta T = ${fT(m[1], 2)}\times${fT(A, 2)}\times${fT(m[2], 3)}\times${dT} = ${f(m[1] * m[2] * dT * A)}$ N $=${f(m[1] * m[2] * dT * A / 1e3)}$ kN.`, trap: 'Convert cm² to m².' }; }
      const gap = pick(rng, 0.2, 0.8, 0.2); const dT2 = pick(rng, 60, 120, 20); const L = pick(rng, 1, 2); const ex = m[2] * L * dT2 * 1000; const st = (ex - gap) / (L * 1000) * m[1] / 1e6; return { v, m, gap, dT2, L, ex, ...T(st), unit: 'MPa', q: r`A ${m[0]} rod of length ${L} m ($Y=${fT(m[1] / 1e11, 2)}\times10^{11}$ Pa, $\alpha=${fT(m[2] * 1e5, 3)}\times10^{-5}\ \mathrm{K^{-1}}$) has a ${gap} mm gap between its end and a rigid wall. It is heated by ${dT2} °C. Find the stress that develops (in MPa).`, sol: r`Free expansion $=\alpha L\Delta T = ${f(ex)}$ mm. After the ${gap} mm gap, the compression is ${f(ex - gap)} mm, a strain of ${fT((ex - gap) / (L * 1000), 3)}. $\sigma = Y\varepsilon = ${f(st)}$ MPa.`, trap: 'Only the expansion beyond the gap is blocked.' };
    },
    verify: (p) => (p.v === 0 ? p.m[1] * p.m[2] * p.dT / 1e6 : p.v === 1 ? p.m[1] * p.m[2] * p.dT * p.A / 1e3 : ((p.m[2] * p.L * p.dT2 - p.gap * 1e-3) / p.L) * p.m[1] / 1e6) },
  { id: 'se-g07', type: 'nat', level: 2, exams: EX[2], sub: 'bulk modulus',
    make(rng) {
      const B = choose(rng, [[2.2e9, 'water'], [1.4e9, 'ethyl alcohol'], [2.6e10, 'glass'], [1.4e11, 'steel']]); const v = int(rng, 0, 2);
      if (v === 0) { const dP = pick(rng, 10, 100, 10) * 1e6; const e = dP / B[0] * 100; return { v, B, dP, ...T(e), unit: '%', q: r`The bulk modulus of ${B[1]} is $${fT(B[0], 3)}$ Pa. By what percentage does its volume decrease when the pressure rises by ${R(dP / 1e6, 8)} MPa?`, sol: r`$\dfrac{\Delta V}{V} = \dfrac{\Delta P}{B} = \dfrac{${fT(dP, 3)}}{${fT(B[0], 3)}} = ${fT(dP / B[0], 3)}$, i.e. ${f(e)}%.` }; }
      if (v === 1) { const V = pick(rng, 100, 1000, 100); const dP = pick(rng, 10, 50, 10) * 1e6; const dV = V * dP / B[0]; return { v, B, V, dP, ...T(dV), unit: 'cm³', q: r`${V} $\mathrm{cm^3}$ of ${B[1]} ($B = ${fT(B[0], 3)}$ Pa) is compressed by raising the pressure by ${R(dP / 1e6, 8)} MPa. Find the decrease of its volume (in $\mathrm{cm^3}$).`, sol: r`$\Delta V = V\Delta P/B = ${V}\times${fT(dP, 3)}/${fT(B[0], 3)} = ${f(dV)}\ \mathrm{cm^3}$.` }; }
      const frac = pick(rng, 1, 5) * 1e-3; const dP = B[0] * frac; return { v, B, frac, ...T(dP / 1e6), unit: 'MPa', q: r`A sample of ${B[1]} ($B = ${fT(B[0], 3)}$ Pa) shrinks by a fraction ${fT(frac, 2)} of its volume. Find the pressure increase that did it (in MPa).`, sol: r`$\Delta P = B\times(\Delta V/V) = ${fT(B[0], 3)}\times${fT(frac, 2)} = ${f(dP)}$ Pa $=${f(dP / 1e6)}$ MPa.` };
    },
    verify: (p) => (p.v === 0 ? p.dP / p.B[0] * 100 : p.v === 1 ? p.V * p.dP / p.B[0] : p.B[0] * p.frac / 1e6) },
  { id: 'se-g08', type: 'nat', level: 3, exams: EX[3], sub: 'wire under its own weight',
    make(rng) {
      const m = choose(rng, MAT); const L = pick(rng, 10, 200, 10); const v = int(rng, 0, 2);
      if (v === 0) { const x = m[3] * G * L * L / (2 * m[1]) * 1000; return { v, m, L, ...T(x), unit: 'mm', q: r`A uniform ${m[0]} wire ($\rho=${m[3]}\ \mathrm{kg\,m^{-3}}$, $Y=${fT(m[1] / 1e11, 2)}\times10^{11}$ Pa) of length ${L} m hangs from a support. Find its extension under its own weight (in mm). $g=9.8\ \mathrm{m\,s^{-2}}$.`, sol: r`$\Delta L = \rho gL^2/2Y = ${m[3]}\times9.8\times${R(L * L, 8)}/(2\times${fT(m[1], 2)}) = ${f(x)}$ mm.`, trap: 'There is a factor 2.' }; }
      if (v === 1) { const s = m[3] * G * L / 1e6; return { v, m, L, ...T(s), unit: 'MPa', q: r`A uniform ${m[0]} wire ($\rho=${m[3]}\ \mathrm{kg\,m^{-3}}$) of length ${L} m hangs from its upper end. Find the stress at the top (in MPa). $g=9.8\ \mathrm{m\,s^{-2}}$.`, sol: r`The top supports the whole wire: $\sigma = \rho gL = ${m[3]}\times9.8\times${L} = ${f(m[3] * G * L)}$ Pa $=${f(s)}$ MPa.` }; }
      const sb = pick(rng, 4, 8) * 1e8; const Lm = sb / (m[3] * G); return { v, m, sb, ...T(Lm / 1e3), unit: 'km', q: r`The breaking stress of a ${m[0]} wire ($\rho=${m[3]}\ \mathrm{kg\,m^{-3}}$) is $${R(sb / 1e8, 8)}\times10^{8}$ Pa. What is the longest uniform wire that can hang from its top without breaking (in km)? $g=9.8\ \mathrm{m\,s^{-2}}$.`, sol: r`$\rho gL = \sigma_b$, so $L = \sigma_b/\rho g = ${fT(sb, 3)}/(${m[3]}\times9.8) = ${f(Lm)}$ m $=${f(Lm / 1e3)}$ km.` };
    },
    verify: (p) => (p.v === 0 ? p.m[3] * G * p.L * p.L / (2 * p.m[1]) * 1000 : p.v === 1 ? p.m[3] * G * p.L / 1e6 : p.sb / (p.m[3] * G) / 1e3) },
  { id: 'se-g09', type: 'nat', level: 3, exams: EX[3], sub: "Poisson's ratio",
    make(rng) {
      const s = pick(rng, 0.2, 0.45, 0.05); const e = pick(rng, 1, 5) * 1e-3; const v = int(rng, 0, 2);
      if (v === 0) return { v, s, e, ...T(s * e * 1e4), unit: '10⁻⁴', q: r`A rod with Poisson's ratio ${s} is stretched to a longitudinal strain of $${fT(e * 1e3, 2)}\times10^{-3}$. Find its lateral strain in units of $10^{-4}$ (magnitude).`, sol: r`Lateral strain $=\sigma\varepsilon = ${s}\times${fT(e, 2)} = ${fT(s * e, 3)}$, which is $${f(s * e * 1e4)}$ in units of $10^{-4}$.` };
      if (v === 1) return { v, s, e, ...T(e * (1 - 2 * s) * 1e4), unit: '10⁻⁴', q: r`A wire with Poisson's ratio ${s} is stretched to a longitudinal strain of $${fT(e * 1e3, 2)}\times10^{-3}$. Find the fractional increase in its volume, in units of $10^{-4}$.`, sol: r`$\Delta V/V = \varepsilon(1-2\sigma) = ${fT(e, 2)}\times${f(1 - 2 * s)} = ${fT(e * (1 - 2 * s), 3)}$, or ${f(e * (1 - 2 * s) * 1e4)} in units of $10^{-4}$.`, trap: 'Lateral shrinkage lowers the volume gain.' };
      const d = pick(rng, 2, 10); return { v, s, e, d, ...T(d * 1e3 * s * e), unit: 'µm', q: r`A rod of diameter ${d} mm with Poisson's ratio ${s} is stretched to a longitudinal strain of $${fT(e * 1e3, 2)}\times10^{-3}$. By how much does its diameter decrease (in micrometres)?`, sol: r`Lateral strain $=${f(s * e)}$. $\Delta d = ${d}\ \mathrm{mm}\times${f(s * e)} = ${f(d * 1e3 * s * e)}\ \mu\mathrm{m}$.` };
    },
    verify: (p) => (p.v === 0 ? p.s * p.e * 1e4 : p.v === 1 ? p.e * (1 - 2 * p.s) * 1e4 : p.d * 1e3 * p.s * p.e) },
  { id: 'se-g10', type: 'nat', level: 2, exams: EX[2], sub: 'shear',
    make(rng) {
      const eta = choose(rng, [[8e10, 'steel'], [4.2e10, 'copper'], [2.6e10, 'aluminium'], [3.5e10, 'brass']]); const A = pick(rng, 1, 5) * 1e-3; const F = pick(rng, 1, 9) * 1e3; const h = pick(rng, 2, 10) * 1e-2; const v = int(rng, 0, 1);
      const th = F / A / eta[0];
      if (v === 0) return { v, eta, A, F, ...T(th * 1e5), unit: '10⁻⁵ rad', q: r`A ${F} N tangential force acts on the top face (${R(A * 1e4, 8)} $\mathrm{cm^2}$) of a ${eta[1]} block (modulus of rigidity $${fT(eta[0], 2)}$ Pa). Find the shear angle in units of $10^{-5}$ rad.`, sol: r`$\theta = \dfrac{F/A}{\eta} = \dfrac{${f(F / A)}}{${fT(eta[0], 2)}} = ${fT(th, 3)}$ rad $= ${f(th * 1e5)}\times10^{-5}$.` };
      return { v, eta, A, F, h, ...T(th * h * 1e6), unit: 'µm', q: r`A ${F} N tangential force acts on the top face (${R(A * 1e4, 8)} $\mathrm{cm^2}$) of a ${eta[1]} block of height ${R(h * 100, 8)} cm (modulus of rigidity $${fT(eta[0], 2)}$ Pa). By how much does the top face shift sideways (in micrometres)?`, sol: r`Shear angle $\theta = ${fT(th, 3)}$. Displacement $=\theta h = ${fT(th, 3)}\times${h} = ${f(th * h * 1e6)}\ \mu\mathrm{m}$.` };
    },
    verify: (p) => (p.v === 0 ? p.F / p.A / p.eta[0] * 1e5 : p.F / p.A / p.eta[0] * p.h * 1e6) },
  { id: 'se-g11', type: 'mcq', level: 2, exams: EX[2], sub: 'ratios',
    make(rng) {
      const a = choose(rng, [1, 2, 3]); const b = choose(rng, [1, 2, 3, 4]); const y = choose(rng, [1, 2]);
      const ratio = a / (b * b * y); const cor = txtR(ratio);
      const opts = shuffleOpts(rng, cor, [txtR(ratio * 2), txtR(ratio / 2), txtR(1 / ratio), txtR(ratio * b), '0.1', '7']);
      return { a, b, y, cor, q: r`Wire 2 is made from a material with ${y} times the Young's modulus of wire 1's material (so $Y_2 = ${y}Y_1$), is ${a} times as long and ${b} times as wide in radius. For the same load, the ratio $\Delta L_2/\Delta L_1$ is`, options: opts.options, answer: opts.answer, sol: r`$\Delta L\propto L/(r^2Y)$. Ratio $=\dfrac{${a}}{${b}^2\times${y}} = ${cor}$.`, trap: 'Radius enters squared.' };
    },
    verify: (p) => p.options.indexOf(txtR(p.a / (p.b * p.b * p.y))) },
  { id: 'se-g12', type: 'nat', level: 3, exams: EX[3], sub: 'wire as a spring',
    make(rng) {
      const m = choose(rng, MAT.slice(0, 3)); const L = pick(rng, 1, 3); const A = pick(rng, 1, 4) * 1e-6; const M = pick(rng, 1, 5); const v = int(rng, 0, 1);
      const k = A * m[1] / L; const Tm = 2 * PI * Math.sqrt(M / k);
      if (v === 0) return { v, m, L, A, ...T(k / 1e4), unit: '10⁴ N/m', q: r`Find the force constant of a ${m[0]} wire ($Y=${fT(m[1] / 1e11, 2)}\times10^{11}$ Pa) of length ${L} m and area ${R(A * 1e6, 8)} $\mathrm{mm^2}$ (in units of $10^{4}\ \mathrm{N\,m^{-1}}$).`, sol: r`$k = AY/L = ${fT(A, 2)}\times${fT(m[1], 2)}/${L} = ${f(k)}\ \mathrm{N\,m^{-1}}$.` };
      return { v, m, L, A, M, ...T(Tm * 1000), unit: 'ms', q: r`A ${M} kg mass hangs from a ${m[0]} wire ($Y=${fT(m[1] / 1e11, 2)}\times10^{11}$ Pa), length ${L} m, area ${R(A * 1e6, 8)} $\mathrm{mm^2}$. It is displaced slightly and vibrates vertically. Find the period (in ms).`, sol: r`$k = AY/L = ${f(k)}\ \mathrm{N\,m^{-1}}$. $T = 2\pi\sqrt{m/k} = 2\pi\sqrt{\dfrac{${M}}{${f(k)}}} = ${f(Tm * 1000)}$ ms.` };
    },
    verify: (p) => (p.v === 0 ? p.A * p.m[1] / p.L / 1e4 : 2 * PI * Math.sqrt(p.M / (p.A * p.m[1] / p.L)) * 1000) },
  { id: 'se-g13', type: 'nat', level: 3, exams: EX[3], sub: 'wire in a lift',
    make(rng) {
      const M = pick(rng, 40, 120, 10); const a = pick(rng, 1, 4, 0.5); const up = rng() < 0.5; const Fb = pick(rng, 14, 20, 2) * 100; const v = int(rng, 0, 1);
      const Tt = M * (up ? G + a : G - a);
      if (v === 0) return { v, M, a, up, ...T(Tt), unit: 'N', q: r`A ${M} kg load hangs from a cable in a lift that is accelerating ${up ? 'upward' : 'downward'} at ${a} $\mathrm{m\,s^{-2}}$. Find the tension in the cable (in N). $g=9.8\ \mathrm{m\,s^{-2}}$.`, sol: r`$T = m(g${up ? '+' : '-'}a) = ${M}\times(9.8${up ? '+' : '-'}${a}) = ${f(Tt)}$ N.`, trap: 'Upward acceleration adds to $g$; downward subtracts.' };
      const amax = Fb / M - G; return { v, M, Fb, ...T(amax, 0.015), unit: 'm/s²', q: r`A cable can bear at most ${Fb} N. It carries a ${M} kg load in a lift. What is the largest upward acceleration of the lift that is safe (in $\mathrm{m\,s^{-2}}$)? $g=9.8\ \mathrm{m\,s^{-2}}$.`, sol: r`$M(g+a)\le${Fb}$, so $a\le${Fb}/${M}-9.8 = ${f(amax)}\ \mathrm{m\,s^{-2}}$.` };
    },
    verify: (p) => (p.v === 0 ? p.M * (p.up ? G + p.a : G - p.a) : p.Fb / p.M - G) },
  { id: 'se-g14', type: 'nat', level: 4, exams: EX[4], sub: 'rotating body',
    make(rng) {
      const v = int(rng, 0, 1);
      if (v === 0) { const m = pick(rng, 1, 5) / 2; const L = pick(rng, 0.5, 2, 0.5); const w = pick(rng, 5, 20, 5); const A = pick(rng, 1, 3) * 1e-6; const x = m * w * w * L * L / (A * 2e11); return { v, m, L, w, A, ...T(x * 1000), unit: 'mm', q: r`A ${m} kg block on a smooth horizontal table is tied to a steel wire (length ${L} m, area ${R(A * 1e6, 8)} $\mathrm{mm^2}$, $Y=2\times10^{11}$ Pa) fixed to a peg and whirled at ${w} rad/s. Neglect the wire's mass and its stretch in the radius. Find the extension of the wire (in mm).`, sol: r`$T = m\omega^2L = ${m}\times${R(w * w, 8)}\times${L} = ${f(m * w * w * L)}$ N. $\Delta L = TL/AY = ${f(x * 1000)}$ mm.` }; }
      const rho = 7800; const L = pick(rng, 0.5, 2, 0.5); const w = pick(rng, 100, 400, 50); const x = rho * w * w * L ** 3 / (3 * 2e11); return { v, rho, L, w, ...T(x * 1000, 0.012), unit: 'mm', q: r`A steel rod of length ${L} m ($\rho=7800\ \mathrm{kg\,m^{-3}}$, $Y=2\times10^{11}$ Pa) rotates about a vertical axis through one end at ${w} rad/s, in a horizontal plane. Find the elongation of the rod (in mm).`, sol: r`$\Delta L = \dfrac{\rho\omega^2L^3}{3Y} = \dfrac{7800\times${R(w * w, 8)}\times${f(L ** 3)}}{3\times2\times10^{11}} = ${f(x * 1000)}$ mm.`, trap: 'Tension falls from the axis outwards; the factor 3 comes from the integral.' };
    },
    verify: (p) => (p.v === 0 ? p.m * p.w * p.w * p.L * p.L / (p.A * 2e11) * 1000 : 7800 * p.w * p.w * p.L ** 3 / (3 * 2e11) * 1000) },
  { id: 'se-g15', type: 'nat', level: 3, exams: EX[3], sub: 'relations of moduli',
    make(rng) {
      const s = choose(rng, [0.2, 0.25, 0.3, 0.35]); const Y = pick(rng, 5, 20) * 1e10; const v = int(rng, 0, 1);
      if (v === 0) { const eta = Y / (2 * (1 + s)); return { v, s, Y, ...T(eta / 1e10), unit: '10¹⁰ Pa', q: r`A material has $Y=${R(Y / 1e10, 8)}\times10^{10}$ Pa and Poisson's ratio ${s}. Find its modulus of rigidity (in units of $10^{10}$ Pa).`, sol: r`$\eta = \dfrac{Y}{2(1+\sigma)} = \dfrac{${R(Y / 1e10, 8)}}{2\times${1 + s}} = ${f(eta / 1e10)}$ (in units of $10^{10}$ Pa).` }; }
      const B = Y / (3 * (1 - 2 * s)); return { v, s, Y, ...T(B / 1e10), unit: '10¹⁰ Pa', q: r`A material has $Y=${R(Y / 1e10, 8)}\times10^{10}$ Pa and Poisson's ratio ${s}. Find its bulk modulus (in units of $10^{10}$ Pa).`, sol: r`$B = \dfrac{Y}{3(1-2\sigma)} = \dfrac{${R(Y / 1e10, 8)}}{3\times${f(1 - 2 * s)}} = ${f(B / 1e10)}$ (in units of $10^{10}$ Pa).` };
    },
    verify: (p) => (p.v === 0 ? p.Y / (2 * (1 + p.s)) / 1e10 : p.Y / (3 * (1 - 2 * p.s)) / 1e10) },
  { id: 'se-g16', type: 'nat', level: 4, exams: EX[4], sub: 'sudden loading',
    make(rng) {
      const k = pick(rng, 1, 5) * 1e4; const m = pick(rng, 1, 5); const v = int(rng, 0, 1);
      if (v === 0) { const x = 2 * m * G / k * 1000; return { v, k, m, ...T(x), unit: 'mm', q: r`A ${m} kg mass is attached to an unstretched vertical wire of force constant ${fT(k, 2)} $\mathrm{N\,m^{-1}}$ and released from rest. Find the greatest extension of the wire (in mm). $g=9.8\ \mathrm{m\,s^{-2}}$.`, sol: r`$mgx = \tfrac12kx^2$ gives $x = 2mg/k = ${f(2 * m * G / k * 1000)}$ mm, twice the static extension.`, trap: 'Sudden loading gives twice the static extension.' }; }
      const h = pick(rng, 0.2, 1, 0.2); const x = (m * G + Math.sqrt((m * G) ** 2 + 2 * k * m * G * h)) / k * 1000; return { v, k, m, h, ...T(x), unit: 'mm', q: r`A ${m} kg ball is dropped from ${h} m above a light pan on a vertical wire of force constant ${fT(k, 2)} $\mathrm{N\,m^{-1}}$ and sticks to it. Find the greatest extension of the wire (in mm). $g=9.8\ \mathrm{m\,s^{-2}}$.`, sol: r`$mg(h+x) = \tfrac12kx^2$, so $x = \dfrac{mg+\sqrt{(mg)^2+2kmgh}}{k} = ${f(x)}$ mm.`, trap: 'The fall includes the extension itself.' };
    },
    verify: (p) => (p.v === 0 ? 2 * p.m * G / p.k * 1000 : (p.m * G + Math.sqrt((p.m * G) ** 2 + 2 * p.k * p.m * G * p.h)) / p.k * 1000) },
  { id: 'se-g17', type: 'mcq', level: 3, exams: EX[3], sub: 'comparing wires',
    make(rng) {
      let ws; let ext; let bi; let tries = 0;
      do {
        ws = []; for (let i = 0; i < 4; i++) ws.push({ m: choose(rng, MAT), L: pick(rng, 1, 4), r: pick(rng, 0.5, 2, 0.5) });
        ext = ws.map((w) => w.L / (w.r * w.r * w.m[1])); bi = ext.indexOf(Math.max(...ext));
        const sorted = [...ext].sort((x, y) => y - x); if (sorted[0] > sorted[1] * 1.05) break;
      } while (++tries < 50);
      if (tries >= 50) { ws[0] = { m: MAT[3], L: 4, r: 0.5 }; ext = ws.map((w) => w.L / (w.r * w.r * w.m[1])); bi = 0; }
      const lines = ws.map((w, i) => `Wire ${'ABCD'[i]}: ${w.m[0]} (${fT(w.m[1] / 1e11, 2)}×10<sup>11</sup> Pa), length ${w.L} m, radius ${w.r} mm`);
      return { ws, bi, q: `Four wires carry the same load. Which stretches the most?<br>${lines.join('<br>')}`, options: ['Wire A', 'Wire B', 'Wire C', 'Wire D'], answer: bi, sol: `$\\Delta L\\propto L/(r^2Y)$. Values in arbitrary units: ${ext.map((e, i) => `${'ABCD'[i]}: ${fT(e * 1e11, 3)}`).join(', ')}. The largest is wire ${'ABCD'[bi]}.`, trap: 'Compare $L/(r^2Y)$, not just one factor.' };
    },
    verify: (p) => { const e = p.ws.map((w) => w.L / (w.r * w.r * w.m[1])); return e.indexOf(Math.max(...e)); } },
];
gens.push(
  { id: 'se-g18', type: 'nat', level: 4, exams: EX[4], sub: 'rod hung by two wires',
    make(rng) {
      const Ys = 2e11; const Yb = choose(rng, [1e11, 0.9e11, 0.7e11]); const d = pick(rng, 0.6, 1.5, 0.3); const v = int(rng, 0, 1);
      const x = d / (1 + Ys / Yb);
      const intro = r`A light rigid rod ${d} m long hangs horizontally from a steel wire ($Y=2\times10^{11}$ Pa) at one end and a brass wire ($Y=${fT(Yb / 1e11, 2)}\times10^{11}$ Pa) at the other. The wires have equal length and area, and a load hung from the rod keeps both wires stretching equally.`;
      if (v === 0) return { v, Yb, d, ...T(x * 100), unit: 'cm', q: r`${intro} How far from the steel wire (in cm) is the load?`, sol: r`Equal extension with equal $L$ and $A$ needs $F\propto Y$: $F_s/F_b = ${f(Ys / Yb)}$. If the load is at distance $x$ from the steel wire, $F_s = W(d-x)/d$ and $F_b = Wx/d$. So $(d-x)/x = ${f(Ys / Yb)}$ and $x = d/(1+${f(Ys / Yb)}) = ${f(x * 100)}$ cm.`, trap: 'The load sits close to the stiffer wire, which takes more of the force.' };
      return { v, Yb, d, ...T(Ys / Yb, 0.011), unit: '', q: r`${intro} Find the ratio of the force in the steel wire to the force in the brass wire.`, sol: r`Equal extension: $\dfrac{F_sL}{AY_s} = \dfrac{F_bL}{AY_b}$, so $F_s/F_b = Y_s/Y_b = ${f(Ys / Yb)}$.` };
    },
    verify: (p) => (p.v === 0 ? p.d / (1 + 2e11 / p.Yb) * 100 : 2e11 / p.Yb) },
  { id: 'se-g19', type: 'nat', level: 3, exams: EX[3], sub: 'bulk modulus of a gas',
    make(rng) {
      const gam = choose(rng, [[1.4, 'air or a diatomic gas'], [1.67, 'a monatomic gas']]); const P = pick(rng, 1, 5) * 1e5; const v = int(rng, 0, 2);
      if (v === 0) return { v, gam, P, ...T(P / 1e5), unit: '10⁵ Pa', q: r`Find the isothermal bulk modulus of an ideal gas at a pressure of $${R(P / 1e5, 8)}\times10^{5}$ Pa (in units of $10^{5}$ Pa).`, sol: r`$PV=$ constant gives $B_T = P = ${R(P / 1e5, 8)}\times10^{5}$ Pa.` };
      if (v === 1) return { v, gam, P, ...T(gam[0] * P / 1e5), unit: '10⁵ Pa', q: r`Find the adiabatic bulk modulus of ${gam[1]} ($\gamma=${gam[0]}$) at a pressure of $${R(P / 1e5, 8)}\times10^{5}$ Pa (in units of $10^{5}$ Pa).`, sol: r`$PV^\gamma=$ constant gives $B_S = \gamma P = ${gam[0]}\times${R(P / 1e5, 8)}\times10^{5} = ${f(gam[0] * P / 1e5)}\times10^{5}$ Pa.` };
      const rho = pick(rng, 0.8, 2, 0.4); return { v, gam, P, rho, ...T(Math.sqrt(gam[0] * P / rho)), unit: 'm/s', q: r`A gas of density ${rho} $\mathrm{kg\,m^{-3}}$ ($\gamma = ${gam[0]}$) is at $${R(P / 1e5, 8)}\times10^{5}$ Pa. Find the speed of sound in it (in $\mathrm{m\,s^{-1}}$), using $v=\sqrt{B/\rho}$ with the adiabatic bulk modulus.`, sol: r`$B=\gamma P = ${f(gam[0] * P)}$ Pa. $v = \sqrt{B/\rho} = \sqrt{${f(gam[0] * P)}/${rho}} = ${f(Math.sqrt(gam[0] * P / rho))}\ \mathrm{m\,s^{-1}}$.` };
    },
    verify: (p) => (p.v === 0 ? p.P / 1e5 : p.v === 1 ? p.gam[0] * p.P / 1e5 : Math.sqrt(p.gam[0] * p.P / p.rho)) },
  { id: 'se-g20', type: 'nat', level: 3, exams: EX[3], sub: 'error analysis',
    make(rng) {
      const d = pick(rng, 0.4, 1.2, 0.2); const dd = choose(rng, [0.01, 0.02]); const x = pick(rng, 1, 4, 0.5); const dx = choose(rng, [0.01, 0.02, 0.05]);
      const e = 2 * dd / d * 100 + dx / x * 100;
      return { d, dd, x, dx, ...T(e, 0.011), unit: '%', q: r`In Searle's method $Y = \dfrac{4FL}{\pi d^2\,\Delta L}$. The diameter is measured as ${d}$\pm$${dd} mm and the extension as ${x}$\pm$${dx} mm. $F$ and $L$ are exact. Find the maximum percentage error in $Y$.`, sol: r`$\dfrac{\Delta Y}{Y} = 2\dfrac{\Delta d}{d} + \dfrac{\Delta(\Delta L)}{\Delta L} = 2\times\dfrac{${dd}}{${d}} + \dfrac{${dx}}{${x}} = ${fT(e / 100, 3)}$, i.e. ${f(e)}%.`, trap: 'The diameter appears squared, so its relative error is doubled.' };
    },
    verify: (p) => 2 * p.dd / p.d * 100 + p.dx / p.x * 100 },
  { id: 'se-g21', type: 'nat', level: 3, exams: EX[3], sub: 'compression at depth',
    make(rng) {
      const h = pick(rng, 1, 6) * 1000; const B = 2.2e9; const v = int(rng, 0, 1); const dP = 1000 * G * h; const e = dP / B;
      if (v === 0) return { v, h, ...T(e * 100), unit: '%', q: r`By what percentage does the volume of water decrease at a depth of ${R(h / 1000, 8)} km in the sea? Take $\rho=1000\ \mathrm{kg\,m^{-3}}$, $B=2.2\times10^{9}$ Pa, $g=9.8\ \mathrm{m\,s^{-2}}$ and ignore the atmosphere and the change of density with depth.`, sol: r`$\Delta P=\rho gh = ${fT(dP, 3)}$ Pa. $\Delta V/V = \Delta P/B = ${fT(e, 3)}$, i.e. ${f(e * 100)}%.` };
      return { v, h, ...T(e * 1000 * 100, 0.011), unit: 'kg/m³', q: r`Find the increase of density of sea water at a depth of ${R(h / 1000, 8)} km (in $\mathrm{kg\,m^{-3}}$, from a surface density of $1000\ \mathrm{kg\,m^{-3}}$). Take $B=2.2\times10^{9}$ Pa, $g=9.8\ \mathrm{m\,s^{-2}}$, ignore the atmosphere and small second-order terms.`, sol: r`$\Delta\rho/\rho \approx \Delta V/V\ (\text{magnitude}) = \rho gh/B = ${fT(e, 3)}$. $\Delta\rho = 1000\times${fT(e, 3)} = ${f(e * 1000)}$.`, answer: +(e * 1000).toPrecision(3), tol: +(e * 1000 * 0.011).toPrecision(2) };
    },
    verify: (p) => (p.v === 0 ? 1000 * G * p.h / 2.2e9 * 100 : 1000 * G * p.h / 2.2e9 * 1000) },
  { id: 'se-g22', type: 'nat', level: 2, exams: EX[2], sub: 'stress-strain graph',
    make(rng) {
      const Y = pick(rng, 1, 2, 0.5) * 1e11; const e = pick(rng, 1, 5) * 1e-3; const s = Y * e; const v = int(rng, 0, 1);
      if (v === 0) return { v, Y, e, ...T(0.5 * s * e / 1e3), unit: 'kJ/m³', q: r`The stress-strain graph of a wire is a straight line of slope $${fT(Y, 2)}$ Pa up to a strain of $${fT(e * 1e3, 2)}\times10^{-3}$. Find the energy stored per unit volume at that strain (in $\mathrm{kJ\,m^{-3}}$).`, sol: r`Stress at the end $=Y\varepsilon = ${fT(s, 3)}$ Pa. Area of the triangle $=\tfrac12\sigma\varepsilon = ${f(0.5 * s * e)}\ \mathrm{J\,m^{-3}} = ${f(0.5 * s * e / 1e3)}$ kJ/m³.` };
      const V = pick(rng, 1, 5) * 1e-6; return { v, Y, e, V, ...T(0.5 * s * e * V * 1e6, 0.011), unit: 'µJ', q: r`A wire of volume ${R(V * 1e6, 8)} $\mathrm{cm^3}$ and $Y=${fT(Y, 2)}$ Pa is stretched to a strain of $${fT(e * 1e3, 2)}\times10^{-3}$. Find the elastic energy stored in it (in microjoules, µJ).`, sol: r`Energy density $=\tfrac12Y\varepsilon^2 = ${f(0.5 * s * e)}\ \mathrm{J\,m^{-3}}$. Volume $=${R(V * 1e6, 8)}\times10^{-6}\ \mathrm{m^3}$. $U = ${f(0.5 * s * e * V * 1e6)}\ \mu\mathrm{J}$.` };
    },
    verify: (p) => (p.v === 0 ? 0.5 * p.Y * p.e * p.e / 1e3 : 0.5 * p.Y * p.e * p.e * p.V * 1e6) },
);


// ---------- Expansion (2026-11-22): more hard items, matches, passages and templates ----------
const xs = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const XCUET = false;
const xex = (l, t) => (l <= 2 ? ['keam', 'cusat', 'comedk', 'jee-main', 'neet'] : l === 3 ? ['jee-main', 'neet', 'keam', 'comedk'] : l === 4 ? ['jee-main', 'jee-adv'] : ['jee-adv']).concat(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : []);
let xk = 0; let xc = 0;
const xid = () => `se-x${String(++xk).padStart(3, '0')}`;
const xb = (level, sub, o) => ({ id: xid(), level, exams: xex(level, o.type), sub, ...o });
const xpos = () => [2, 0, 3, 1][xc++ % 4];
const xmcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  if (new Set([correct, ...wrongs]).size !== 4) throw new Error('options not distinct: ' + q.slice(0, 60));
  const pos = xpos(); const options = [...wrongs]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const xnat = (level, sub, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  if (tol === 0 && !Number.isInteger(answer)) throw new Error('integer expected: ' + q.slice(0, 60) + ' ' + answer);
  return xb(level, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol: typeof sol === 'function' ? sol(answer) : sol, ...o });
};
const xmsq = (level, sub, q, options, answer, sol, o = {}) => xb(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const XAOPT = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const xasrt = (level, sub, A, R, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: XAOPT, answer, sol, ...o });
const XSOPT = ['Both Statement I and Statement II are true', 'Both Statement I and Statement II are false', 'Statement I is true but Statement II is false', 'Statement I is false but Statement II is true'];
const xstm = (level, sub, I, II, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: XSOPT, answer, sol, ...o });
const xcnt = (level, sub, q, list, n, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `${q}<br>${list.map((s, i) => `(${i + 1}) ${s}`).join('<br>')}`, options: ['Only one', 'Only two', 'Only three', 'All four'], answer: n - 1, sol, ...o });
// match: correct code and three wrong codes
const xmt = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  if (new Set([correct, ...wrongs]).size !== 4) throw new Error('match options not distinct: ' + group);
  const pos = xpos(); const options = [...wrongs]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'match', group, q, options, answer: pos, sol, ...o });
};
const xpas = (level, sub, group, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  if (tol === 0 && !Number.isInteger(answer)) throw new Error('integer expected: ' + q.slice(0, 60) + ' ' + answer);
  return { id: xid(), type: 'nat', level, format: 'passage', exams: xex(level, 'nat'), sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
const xpasm = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = xpos(); const options = [...wrongs]; options.splice(pos, 0, correct);
  return { id: xid(), type: 'mcq', level, format: 'passage', exams: xex(level, 'mcq'), sub, group, q, options, answer: pos, sol, ...o };
};
// template: exams from level and type
const xg = (id, level, type, sub, make, verify) => ({ id, type, level, exams: xex(level, type), sub, make, verify });
const XG = 9.8; const XPI = Math.PI;

const xgroups = {
  ms1: { title: 'Quantities and their units',
    list1: ['A. Stress', 'B. Strain', 'C. Elastic energy per unit volume', 'D. Compressibility'],
    list2: [r`p. $\mathrm{Pa}$ ($\mathrm{N\,m^{-2}}$)`, 'q. no unit', r`r. $\mathrm{J\,m^{-3}}$`, r`s. $\mathrm{Pa^{-1}}$`, r`t. $\mathrm{N}$`] },
  ms2: { title: 'Constants of elasticity',
    list1: ["A. Young's modulus", 'B. Bulk modulus', 'C. Shear (rigidity) modulus', "D. Poisson's ratio"],
    list2: ['p. connects stress with longitudinal strain', 'q. connects pressure with volume strain', 'r. connects tangential stress with the angle of shear', 's. ratio of lateral strain to longitudinal strain'] },
  ms3: { title: 'Changing a loaded wire (same material and load)',
    list1: ['A. The length is doubled: the extension', 'B. The radius is doubled: the extension', 'C. Length and radius are both doubled: the extension', 'D. The length is made 3 times and the radius $\\sqrt3$ times: the extension'],
    list2: ['p. becomes 2 times', 'q. becomes $\\tfrac14$ times', 'r. becomes $\\tfrac12$ times', 's. is unchanged', 't. becomes 4 times'] },
  ms4: { title: 'Energy stored in a loaded wire (same load $F$)',
    list1: ['A. The length is doubled: the energy stored', 'B. The radius is doubled: the energy stored', 'C. Young\'s modulus is doubled: the energy stored', 'D. The load is doubled: the energy stored'],
    list2: ['p. becomes 2 times', 'q. becomes $\\tfrac14$ times', 'r. becomes $\\tfrac12$ times', 's. becomes 4 times', 't. is unchanged'] },
  ms5: { title: 'Points on a stress-strain curve of a ductile metal',
    list1: ['A. Proportional limit', 'B. Yield point (elastic limit)', 'C. Ultimate tensile strength', 'D. Fracture point'],
    list2: ['p. stress stops being proportional to strain', 'q. permanent deformation begins', 'r. greatest stress on the curve', 's. the wire breaks'] },
  ms6: { title: 'A material with $Y = 2\\times10^{11}\\ \\mathrm{Pa}$ and $\\sigma = 0.25$',
    list1: ['A. Shear modulus', 'B. Bulk modulus', 'C. Lateral strain when the longitudinal strain is $2\\times10^{-3}$ (magnitude)', 'D. Volume strain when the longitudinal strain is $2\\times10^{-3}$'],
    list2: ['p. 80 GPa', 'q. 133 GPa', r`r. $5\times10^{-4}$`, r`s. $1\times10^{-3}$`, 't. 200 GPa'] },
  ms7: { title: 'A steel rod and temperature change ($Y\\alpha = 2.4\\times10^{6}\\ \\mathrm{Pa\\,K^{-1}}$)',
    list1: ['A. Held between rigid walls, heated by 10 K', 'B. Held between rigid walls, cooled by 10 K', 'C. Held between rigid walls, heated by 20 K', 'D. Free to expand and contract, heated by 10 K'],
    list2: ['p. compressive stress 24 MPa', 'q. tensile stress 24 MPa', 'r. compressive stress 48 MPa', 's. no thermal stress'] },
  ms8: { title: 'A uniform vertical rod hanging under its own weight (length $L$, density $\\rho$, area $A$)',
    list1: ['A. Stress at the top', 'B. Stress at the middle', 'C. Total elongation', 'D. Elastic energy stored in the rod'],
    list2: [r`p. $\rho gL$`, r`q. $\dfrac{\rho gL}{2}$`, r`r. $\dfrac{\rho gL^2}{2Y}$`, r`s. $\dfrac{\rho^2g^2AL^3}{6Y}$`, r`t. $\dfrac{\rho gL^2}{Y}$`] },
  ps1: { title: 'A steel wire carrying a block',
    passage: r`<p>A steel wire of length 2.0 m and diameter 1.0 mm hangs from a ceiling and carries a 10 kg block. For steel $Y = 2.0\times10^{11}\ \mathrm{N\,m^{-2}}$ and the breaking stress is $7.5\times10^{8}\ \mathrm{N\,m^{-2}}$. Take $g = 9.8\ \mathrm{m\,s^{-2}}$ and ignore the weight of the wire.</p>` },
  ps2: { title: 'A rod heated between walls',
    passage: r`<p>A steel rod 1.0 m long and of cross-section $4\ \mathrm{cm^2}$ is fitted exactly between two walls at 20 °C. For steel $Y = 2.0\times10^{11}\ \mathrm{N\,m^{-2}}$ and $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$. The rod is heated to 70 °C.</p>` },
};

const xitems = [
  // ---------- Level 2 ----------
  xnat(2, 'extension of a wire', r`A steel wire of length 2 m and cross-section $1\ \mathrm{mm^2}$ carries a load of 98 N. Find its extension (in mm, 2 decimals; $Y = 2\times10^{11}\ \mathrm{N\,m^{-2}}$).`, 98 * 2 / (1e-6 * 2e11) * 1e3, 0.01, 2,
    r`$\Delta L = \dfrac{FL}{AY} = \dfrac{98\times2}{10^{-6}\times2\times10^{11}} = 9.8\times10^{-4}$ m $= 0.98$ mm.`, { unit: 'mm' }),
  xmcq(2, "Poisson's ratio", r`Poisson's ratio of a material is`, 'a pure number, with no unit', [r`measured in $\mathrm{N\,m^{-2}}$`, 'the ratio of stress to strain', 'always greater than 1'],
    r`It is lateral strain divided by longitudinal strain: both are ratios of lengths, so it has no unit. For ordinary materials it lies between 0 and 0.5.`),
  xnat(2, 'bulk modulus', r`A pressure increase of $2\times10^{7}\ \mathrm{Pa}$ reduces the volume of a liquid by 0.1 %. Find its bulk modulus (in GPa).`, 2e7 / 1e-3 / 1e9, 0, 0,
    r`$B = \dfrac{\Delta P}{-\Delta V/V} = \dfrac{2\times10^{7}}{10^{-3}} = 2\times10^{10}$ Pa $= 20$ GPa.`, { unit: 'GPa' }),
  xmcq(2, 'elasticity', r`Steel is more elastic than rubber because`, 'for the same strain steel develops a larger restoring stress', ['steel stretches more under the same load', 'rubber has a larger Young\'s modulus', 'steel can be stretched to a larger fraction of its length'],
    r`Elasticity means the ability to resist deformation and regain shape: it is measured by $Y = \text{stress}/\text{strain}$. For the same strain steel needs far more stress, so $Y_{steel}\gg Y_{rubber}$.`, { trap: 'Rubber stretches more, but that makes it less stiff, not more elastic.' }),
  xnat(2, 'elastic energy', r`A wire carries a stress of $2\times10^{8}\ \mathrm{N\,m^{-2}}$ and has a strain of $10^{-3}$. Find the elastic energy stored per unit volume (in $\mathrm{kJ\,m^{-3}}$).`, 0.5 * 2e8 * 1e-3 / 1e3, 0, 0,
    r`$u = \tfrac12\times\text{stress}\times\text{strain} = \tfrac12\times2\times10^{8}\times10^{-3} = 10^{5}\ \mathrm{J\,m^{-3}} = 100\ \mathrm{kJ\,m^{-3}}$.`, { unit: 'kJ/m³' }),
  xmcq(2, 'moduli', r`Which of these materials has a shear modulus of zero?`, 'A liquid', ['Steel', 'Rubber', 'Glass'],
    r`Liquids and gases cannot resist a change of shape (they flow), so their modulus of rigidity is zero. They do have a bulk modulus.`),

  // ---------- Level 3 ----------
  xnat(3, "Poisson's ratio", r`A wire 2.0 mm in diameter is stretched so that its longitudinal strain is 0.002. Its Poisson's ratio is 0.3. Find the decrease in diameter (in $\mu$m, 1 decimal).`, 2e-3 * 0.3 * 0.002 * 1e6, 0.05, 1,
    r`Lateral strain $= \sigma\times$ longitudinal strain $= 0.3\times0.002 = 6\times10^{-4}$. $\Delta d = 6\times10^{-4}\times2.0\ \mathrm{mm} = 1.2\times10^{-3}$ mm $= 1.2\ \mu$m.`, { unit: 'µm' }),
  xnat(3, "Poisson's ratio", r`A wire is stretched by a strain of $10^{-3}$. Its Poisson's ratio is 0.25. Find the fractional increase in its volume (in units of $10^{-4}$).`, 1e-3 * (1 - 2 * 0.25) * 1e4, 0.01, 2,
    r`$\dfrac{\Delta V}{V} = \varepsilon(1 - 2\sigma) = 10^{-3}\times(1 - 0.5) = 5\times10^{-4}$. A volume increase, since $\sigma < 0.5$.`, { trap: 'Both the length and the cross-section change.' }),
  xnat(3, 'elastic energy', r`A wire is stretched by 2 mm by a load of 100 N, within the elastic limit. Find the energy stored in it (in J, 2 decimals).`, 0.5 * 100 * 2e-3, 0.005, 2,
    r`$U = \tfrac12Fx = \tfrac12\times100\times2\times10^{-3} = 0.10$ J.`, { unit: 'J' }),
  xnat(3, 'thermal stress', r`A steel rod is held between two rigid walls and heated by 50 K. Find the stress in it (in MPa). $Y = 2\times10^{11}\ \mathrm{Pa}$, $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$.`, 2e11 * 1.2e-5 * 50 / 1e6, 0, 0,
    r`The rod is not allowed to expand, so the strain is $\alpha\theta = 6\times10^{-4}$. $\sigma = Y\alpha\theta = 2\times10^{11}\times6\times10^{-4} = 1.2\times10^{8}$ Pa $= 120$ MPa (compressive).`, { unit: 'MPa', trap: 'The length does not matter.' }),
  xnat(3, 'wires in parallel', r`A steel wire and a brass wire of equal length and cross-section carry a load together (they stretch equally). $Y_{steel} = 2\times10^{11}$, $Y_{brass} = 1\times10^{11}\ \mathrm{N\,m^{-2}}$. Find the ratio of the load on steel to that on brass.`, 2, 0, 0,
    r`Equal extension $\Rightarrow$ equal strain, so stress $\propto Y$. Same area: $F\propto Y$. Ratio $= 2:1$.`),
  xnat(3, 'breaking load', r`A wire of diameter 1.0 mm has a breaking stress of $7.5\times10^{8}\ \mathrm{N\,m^{-2}}$. Find the largest load it can carry (in N, nearest integer).`, XPI * (0.5e-3) ** 2 * 7.5e8, 1, 0,
    r`$A = \pi r^2 = \pi\times(0.5\times10^{-3})^2 = 7.85\times10^{-7}\ \mathrm{m^2}$. $F_{max} = 7.5\times10^{8}\times7.85\times10^{-7} = 589$ N.`, { unit: 'N' }),
  xnat(3, 'force constant of a wire', r`A steel wire 2 m long has cross-section $1\ \mathrm{mm^2}$ ($Y = 2\times10^{11}\ \mathrm{N\,m^{-2}}$). Find its force constant (in $\mathrm{N\,m^{-1}}$).`, 2e11 * 1e-6 / 2, 0, 0,
    r`$F = \dfrac{YA}{L}\Delta L = k\,\Delta L$, so $k = \dfrac{YA}{L} = \dfrac{2\times10^{11}\times10^{-6}}{2} = 10^{5}\ \mathrm{N\,m^{-1}}$.`, { unit: 'N/m' }),
  xnat(3, 'moduli relations', r`A material has $Y = 2\times10^{11}\ \mathrm{Pa}$ and Poisson's ratio 0.25. Find its shear modulus (in GPa).`, 2e11 / (2 * 1.25) / 1e9, 0, 0,
    r`$Y = 2G(1 + \sigma)$, so $G = \dfrac{Y}{2(1 + \sigma)} = \dfrac{2\times10^{11}}{2.5} = 8\times10^{10}$ Pa $= 80$ GPa.`, { unit: 'GPa' }),
  xnat(3, 'elastic energy', r`A wire is stretched 1 mm by a load. It is then stretched a further 1 mm (to 2 mm in all). Its force constant is $10^{5}\ \mathrm{N\,m^{-1}}$. Find the work done in the second stretch (in J, 2 decimals).`, 0.5 * 1e5 * (4e-6 - 1e-6), 0.005, 2,
    r`$W = \tfrac12k(x_2^2 - x_1^2) = \tfrac12\times10^{5}\times(4 - 1)\times10^{-6} = 0.15$ J, three times the work of the first millimetre.`, { unit: 'J', trap: 'The second equal stretch costs more, not the same.' }),
  xnat(3, 'wire under its own weight', r`Find the greatest length of a steel wire that can hang vertically without breaking under its own weight (in km, 2 decimals). Breaking stress $7.5\times10^{8}\ \mathrm{Pa}$, density $7800\ \mathrm{kg\,m^{-3}}$.`, 7.5e8 / (7800 * XG) / 1000, 0.02, 2,
    r`At the top, the stress is $\rho gL$. Breaking: $L = \dfrac{\sigma_b}{\rho g} = \dfrac{7.5\times10^{8}}{7800\times9.8} = 9810$ m $= 9.81$ km.`, { unit: 'km' }),
  xnat(3, 'bulk modulus', r`A solid steel sphere ($B = 1.6\times10^{11}\ \mathrm{Pa}$) sinks to the floor of an ocean 4.0 km deep (water density $1000\ \mathrm{kg\,m^{-3}}$). Find the fractional decrease in its volume (in units of $10^{-4}$, 2 decimals).`, 1000 * XG * 4000 / 1.6e11 * 1e4, 0.02, 2,
    r`$P = \rho gh = 1000\times9.8\times4000 = 3.92\times10^{7}$ Pa. $\dfrac{\Delta V}{V} = \dfrac PB = \dfrac{3.92\times10^{7}}{1.6\times10^{11}} = 2.45\times10^{-4}$.`),
  xnat(3, 'stress', r`A lift cable carries a lift of 500 kg that is accelerating upwards at $2\ \mathrm{m\,s^{-2}}$. The cable has a cross-section of $5\ \mathrm{cm^2}$. Find the stress in the cable (in MPa, 2 decimals). $g = 9.8\ \mathrm{m\,s^{-2}}$.`, 500 * (9.8 + 2) / 5e-4 / 1e6, 0.02, 2,
    r`$T - mg = ma$, so $T = 500\times11.8 = 5900$ N. Stress $= \dfrac{5900}{5\times10^{-4}} = 1.18\times10^{7}$ Pa $= 11.80$ MPa.`, { unit: 'MPa' }),
  xnat(3, 'shear', r`A tangential force of 1000 N is applied to the top face of a cube of side 10 cm, whose bottom face is fixed. The shear modulus is $4\times10^{10}\ \mathrm{Pa}$. Find the sideways displacement of the top face (in $\mu$m, 3 decimals).`, 1000 / (0.01 * 4e10) * 0.1 * 1e6, 0.002, 3,
    r`Shear stress $= \dfrac{F}{A} = \dfrac{1000}{0.01} = 10^{5}$ Pa. Shear strain $= \dfrac{10^{5}}{4\times10^{10}} = 2.5\times10^{-6}$ rad. Displacement $= \text{strain}\times h = 2.5\times10^{-6}\times0.1 = 2.5\times10^{-7}$ m $= 0.250\ \mu$m.`, { unit: 'µm' }),
  xnat(3, 'energy density', r`A wire is under a stress of $1.5\times10^{8}\ \mathrm{N\,m^{-2}}$ ($Y = 2\times10^{11}$). Find the elastic energy stored per unit volume (in $\mathrm{kJ\,m^{-3}}$, 2 decimals).`, (1.5e8) ** 2 / (2 * 2e11) / 1e3, 0.05, 2,
    r`$u = \dfrac{\sigma^2}{2Y} = \dfrac{(1.5\times10^{8})^2}{2\times2\times10^{11}} = 5.625\times10^{4}\ \mathrm{J\,m^{-3}} = 56.25\ \mathrm{kJ\,m^{-3}}$.`, { unit: 'kJ/m³' }),
  xnat(3, 'liquid compression', r`A liquid with $B = 2\times10^{9}\ \mathrm{Pa}$ fills a cylinder closed by a piston of area $10^{-3}\ \mathrm{m^2}$. Find the extra force on the piston needed to compress the liquid by 0.5 % (in N).`, 2e9 * 0.005 * 1e-3, 0, 0,
    r`$\Delta P = B\dfrac{\Delta V}{V} = 2\times10^{9}\times0.005 = 10^{7}$ Pa. $F = \Delta P\times A = 10^{7}\times10^{-3} = 10^{4}$ N.`, { unit: 'N' }),
  xmt(3, 'units', 'ms1', r`Match each quantity with its SI unit.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-t, B-q, C-r, D-s'],
    r`Stress is force per area, Pa (p). Strain is a ratio, no unit (q). Energy per volume, $\mathrm{J\,m^{-3}}$, equals Pa dimensionally but is listed as (r). Compressibility is $1/B$: $\mathrm{Pa^{-1}}$ (s).`),
  xmt(3, 'moduli', 'ms2', r`Match each constant with what it connects.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$Y$: stress vs longitudinal strain (p). $B$: pressure vs volume strain (q). $G$: tangential stress vs shear angle (r). $\sigma$: lateral to longitudinal strain (s).`),
  xasrt(3, 'elasticity', r`The Young's modulus of a wire does not depend on its length or its thickness.`, r`Young's modulus is a property of the material, being the ratio of stress to strain.`, 0,
    r`Both stress and strain are defined per unit area and per unit length, so geometry cancels. $Y$ is characteristic of the material. R explains A.`),
  xstm(3, 'moduli', r`The bulk modulus of a gas is much smaller than that of a solid.`, r`Gases are easy to compress, so a given pressure change causes a large fractional change in volume.`, 0,
    r`$B = \dfrac{\Delta P}{-\Delta V/V}$: a large $\Delta V/V$ means a small $B$. Both statements are true and II explains I.`),
  xmcq(3, 'stress-strain curve', r`In the stress-strain curve of a ductile metal, the material is plastic between`, 'the elastic limit and the fracture point', ['the origin and the elastic limit', 'the proportional limit and the elastic limit only', 'the origin and the proportional limit'],
    r`Up to the elastic limit the body regains its original shape. Beyond it, the deformation is permanent (plastic) until fracture.`),

  // ---------- Level 4 ----------
  xnat(4, 'thermal stress', r`A steel rod of cross-section $2\ \mathrm{cm^2}$ is held between rigid walls and heated by 40 K. Find the force it exerts on each wall (in N). $Y = 2\times10^{11}\ \mathrm{Pa}$, $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$.`, 2e11 * 2e-4 * 1.2e-5 * 40, 0, 0,
    r`$F = YA\alpha\theta = 2\times10^{11}\times2\times10^{-4}\times1.2\times10^{-5}\times40 = 19\,200$ N.`, { unit: 'N' }),
  xnat(4, 'moduli relations', r`A material has $Y = 2\times10^{11}\ \mathrm{Pa}$ and Poisson's ratio 0.25. Find its bulk modulus (in GPa, 1 decimal).`, 2e11 / (3 * (1 - 0.5)) / 1e9, 0.1, 1,
    r`$B = \dfrac{Y}{3(1 - 2\sigma)} = \dfrac{2\times10^{11}}{3\times0.5} = 1.333\times10^{11}$ Pa $= 133.3$ GPa.`, { unit: 'GPa' }),
  xnat(4, 'oscillation of a load on a wire', r`A 2 kg mass hangs from a steel wire ($L = 1$ m, $A = 1\ \mathrm{mm^2}$, $Y = 2\times10^{11}$). It is pulled down slightly and released. Find the period of the vertical oscillation (in ms, 1 decimal).`, 2 * XPI * Math.sqrt(2 * 1 / (1e-6 * 2e11)) * 1e3, 0.2, 1,
    r`The wire acts as a spring of constant $k = \dfrac{YA}{L} = 2\times10^{5}\ \mathrm{N\,m^{-1}}$. $T = 2\pi\sqrt{\dfrac mk} = 2\pi\sqrt{\dfrac{2}{2\times10^{5}}} = 2\pi\times3.16\times10^{-3} = 19.9$ ms.`, { unit: 'ms' }),
  xnat(4, 'wire and buoyancy', r`A wire ($L = 2$ m, $A = 2\ \mathrm{mm^2}$, $Y = 2\times10^{11}\ \mathrm{Pa}$) holds a metal block of volume $10^{-3}\ \mathrm{m^3}$ and density $8000\ \mathrm{kg\,m^{-3}}$ completely under water. Find the extension of the wire (in mm, 3 decimals).`, (8000 * 1e-3 * XG - 1000 * 1e-3 * XG) * 2 / (2e-6 * 2e11) * 1e3, 0.003, 3,
    r`Weight $= 8\times9.8 = 78.4$ N. Buoyancy $= 1000\times10^{-3}\times9.8 = 9.8$ N. Tension $= 68.6$ N. $\Delta L = \dfrac{TL}{AY} = \dfrac{68.6\times2}{2\times10^{-6}\times2\times10^{11}} = 3.43\times10^{-4}$ m $= 0.343$ mm.`, { unit: 'mm' }),
  xnat(4, 'rotating rod', r`A steel rod 1.0 m long ($\rho = 7800\ \mathrm{kg\,m^{-3}}$) rotates in a horizontal plane about one end at $100\ \mathrm{rad\,s^{-1}}$. Find the largest tensile stress in it (in MPa).`, 7800 * 100 ** 2 * 1 / 2 / 1e6, 0.5, 0,
    r`At distance $r$ from the axis the tension supplies the centripetal force for the part beyond it, giving $\sigma(r) = \dfrac{\rho\omega^2(L^2 - r^2)}{2}$. The greatest value is at the axis: $\dfrac{\rho\omega^2L^2}{2} = \dfrac{7800\times10^{4}\times1}{2} = 3.9\times10^{7}$ Pa $= 39$ MPa.`, { unit: 'MPa', trap: 'The stress varies along the rod; it is greatest at the pivot.' }),
  xnat(4, 'cooling a stretched wire', r`A steel wire of cross-section $1\ \mathrm{mm^2}$ is just taut between two rigid supports at 40 °C. It is cooled to 10 °C. Find the tension in it (in N). $Y = 2\times10^{11}$, $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$.`, 2e11 * 1e-6 * 1.2e-5 * 30, 0, 0,
    r`The supports stop it from shortening: strain $= \alpha\theta = 1.2\times10^{-5}\times30 = 3.6\times10^{-4}$. $T = YA\times\text{strain} = 2\times10^{11}\times10^{-6}\times3.6\times10^{-4} = 72$ N.`, { unit: 'N' }),
  xnat(4, 'torsion', r`A steel shaft 1.0 m long and 2.0 cm in radius carries a torque of 100 N m. Find the angle of twist (in milliradians, 2 decimals). $G = 8\times10^{10}\ \mathrm{Pa}$.`, 2 * 100 * 1 / (XPI * 8e10 * 0.02 ** 4) * 1e3, 0.03, 2,
    r`The torque to twist a cylinder through $\theta$ is $\tau = \dfrac{\pi Gr^4}{2L}\theta$. $\theta = \dfrac{2\tau L}{\pi Gr^4} = \dfrac{2\times100\times1}{\pi\times8\times10^{10}\times(0.02)^4} = \dfrac{200}{4.02\times10^{4}} = 4.97\times10^{-3}$ rad $= 4.97$ mrad.`, { unit: 'mrad' }),
  xnat(4, 'stress-strain graph', r`The stress-strain graph of a metal is a straight line from the origin to $(\varepsilon, \sigma) = (0.002, 2\times10^{8}\ \mathrm{Pa})$, after which the stress stays constant at $2\times10^{8}$ Pa until the strain reaches 0.1, where the wire breaks. Find the energy absorbed per unit volume up to breaking (in $\mathrm{MJ\,m^{-3}}$, 1 decimal).`, (0.5 * 2e8 * 0.002 + 2e8 * (0.1 - 0.002)) / 1e6, 0.1, 1,
    r`Energy per volume is the area under the graph. Triangle: $\tfrac12\times0.002\times2\times10^{8} = 2\times10^{5}$ J/m³. Rectangle: $(0.1 - 0.002)\times2\times10^{8} = 1.96\times10^{7}$. Total $= 1.98\times10^{7}\ \mathrm{J\,m^{-3}} = 19.8\ \mathrm{MJ\,m^{-3}}$.`, { unit: 'MJ/m³' }),
  xnat(4, 'wires in parallel', r`A load of 600 N hangs from two wires, both fixed at the ceiling and at the load, so that they stretch equally. Wire A: $Y = 2\times10^{11}$, $A = 1\ \mathrm{mm^2}$, $L = 1$ m. Wire B: $Y = 7\times10^{10}$, $A = 2\ \mathrm{mm^2}$, $L = 1.4$ m. Find the load carried by A (in N).`, 600 * (2e11 * 1e-6 / 1) / ((2e11 * 1e-6 / 1) + (7e10 * 2e-6 / 1.4)), 0, 0,
    r`Equal extension means each carries $F = k\,x$ with $k = YA/L$. $k_A = \dfrac{2\times10^{11}\times10^{-6}}{1} = 2\times10^{5}$, $k_B = \dfrac{7\times10^{10}\times2\times10^{-6}}{1.4} = 10^{5}$. A takes $\dfrac{2}{3}$ of 600 N $= 400$ N.`, { unit: 'N' }),
  xnat(4, 'thermal stress', r`A steel rod 1.0 m long is placed with a gap of 0.50 mm between its end and a rigid wall at 20 °C. It is heated by 100 K. Find the compressive stress that develops (in MPa; $\alpha = 1.2\times10^{-5}$, $Y = 2\times10^{11}$ SI).`, (1.2e-5 * 100 * 1 - 0.5e-3) / 1 * 2e11 / 1e6, 1, 0,
    r`Free expansion $= 1.2\times10^{-5}\times100\times1.0 = 1.2$ mm. The gap takes 0.5 mm, so 0.7 mm must be absorbed by compression: strain $= 7\times10^{-4}$. $\sigma = Y\varepsilon = 2\times10^{11}\times7\times10^{-4} = 1.4\times10^{8}$ Pa $= 140$ MPa.`, { unit: 'MPa', trap: 'Only the expansion beyond the gap is resisted.' }),
  xnat(4, 'rod fixed at both ends', r`A rod of length 1.0 m, cross-section $1\ \mathrm{cm^2}$ and $Y = 2\times10^{11}\ \mathrm{Pa}$ is fixed at both ends. A force of 1000 N is applied along its axis at its midpoint. Find the displacement of the midpoint (in $\mu$m, 2 decimals).`, 1000 / 2 * 0.5 / (1e-4 * 2e11) * 1e6, 0.02, 2,
    r`The applied force splits equally into reactions of 500 N from each end (by symmetry). Each half (0.5 m) carries 500 N: $x = \dfrac{FL}{AY} = \dfrac{500\times0.5}{10^{-4}\times2\times10^{11}} = 1.25\times10^{-5}$ m $= 12.50\ \mu$m.`, { unit: 'µm', trap: 'Only half of the force acts on each half of the rod.' }),
  xnat(4, 'elastic constants', r`The bulk modulus of a material is $1.2\times10^{11}\ \mathrm{Pa}$ and its shear modulus is $6\times10^{10}\ \mathrm{Pa}$. Using $Y = \dfrac{9BG}{3B + G}$, find its Young's modulus (in GPa, 1 decimal).`, 9 * 1.2e11 * 6e10 / (3 * 1.2e11 + 6e10) / 1e9, 0.2, 1,
    r`$Y = \dfrac{9\times1.2\times10^{11}\times6\times10^{10}}{3.6\times10^{11} + 6\times10^{10}} = \dfrac{6.48\times10^{22}}{4.2\times10^{11}} = 1.543\times10^{11}$ Pa $= 154.3$ GPa.`, { unit: 'GPa' }),
  xmsq(4, 'stress-strain curve', r`For a ductile metal, which are correct about its stress-strain curve?`, [r`Stress is proportional to strain up to the proportional limit.`, r`Beyond the elastic limit the wire does not fully regain its length when unloaded.`, r`The fracture stress can be less than the ultimate tensile stress.`, r`The slope of the straight part equals the bulk modulus.`], [0, 1, 2],
    r`Hooke's law holds up to the proportional limit (A). Beyond the elastic limit the deformation is permanent (B). After necking the engineering stress falls before the wire breaks, so the breaking stress may be less than the ultimate one (C). The slope is Young's modulus, not the bulk modulus (D false).`),
  xmsq(4, 'wire under its own weight', r`A uniform steel wire hangs from a ceiling under its own weight. Which are correct?`, [r`The stress is greatest at the top.`, r`The stress is zero at the free end.`, r`The extension of a small element is the same all along the wire.`, r`The total extension is $\dfrac{\rho gL^2}{2Y}$.`], [0, 1, 3],
    r`At a distance $x$ from the bottom the stress is $\rho gx$: zero at the free end, greatest at the top (A, B). An element $dx$ stretches by $\dfrac{\rho gx}{Y}dx$, which grows with $x$ (C false). Total $= \int_0^L\dfrac{\rho gx}{Y}dx = \dfrac{\rho gL^2}{2Y}$ (D).`),
  xmsq(4, 'thermal stress', r`A steel rod is clamped between two rigid walls at the same temperature and then heated. Which are correct?`, [r`A compressive stress develops in the rod.`, r`The stress does not depend on the length of the rod.`, r`The force on each wall is proportional to the cross-sectional area.`, r`The rod does not exert any force if its coefficient of expansion is small.`], [0, 1, 2],
    r`$\sigma = Y\alpha\theta$ (A, B: no $L$). $F = \sigma A$ (C). However small $\alpha$ is, a non-zero $\alpha\theta$ gives a non-zero stress (D false).`),
  xmsq(4, "Poisson's ratio", r`A wire is stretched within its elastic limit. Which are correct?`, [r`Its volume increases if Poisson's ratio is less than 0.5.`, r`Its volume stays constant if Poisson's ratio is 0.5.`, r`Its diameter increases.`, r`Its density decreases if Poisson's ratio is less than 0.5.`], [0, 1, 3],
    r`$\dfrac{\Delta V}{V} = \varepsilon(1 - 2\sigma)$: positive for $\sigma < 0.5$ (A), zero at 0.5 (B). The diameter decreases (C false). Mass is the same and volume grows, so the density falls (D).`),
  xmsq(4, 'elastic energy', r`Two wires of the same material, and the same load $F$: the first has length $L$ and radius $r$, the second $2L$ and $2r$. Which are correct?`, [r`The second wire's extension is half the first's.`, r`The energy stored in the second is $\tfrac12$ that of the first.`, r`The stress in the second is $\tfrac14$ that of the first.`, r`The energy stored per unit volume in the second is $\tfrac18$ that of the first.`], [0, 1, 2],
    r`$x = \dfrac{FL}{\pi r^2Y}$: factor $\dfrac{2}{4} = \tfrac12$ (A). $U = \tfrac12Fx$: $\tfrac12$ (B). Stress $F/\pi r^2$: $\tfrac14$ (C). $u = \dfrac{\sigma^2}{2Y}$ falls as $\left(\tfrac14\right)^2 = \tfrac1{16}$, not $\tfrac18$ (D false).`),
  xasrt(4, 'hysteresis', r`The energy lost as heat in one cycle of loading and unloading of a rubber band equals the area enclosed by its stress-strain loop.`, r`The unloading curve of rubber lies below the loading curve.`, 0,
    r`Work done on loading is the area under the loading curve; work recovered on unloading is the smaller area under the unloading curve. The difference, the loop area, is dissipated as heat. R describes why the loop has area. Both true, R explains A.`),
  xasrt(4, 'wire under its own weight', r`A long vertical wire is more likely to break near its upper end.`, r`The tension at the top of the wire is greater than anywhere else, while the cross-section is uniform.`, 0,
    r`At a distance $x$ above the free end the stress is $\rho gx$, which is largest at the top, where the whole weight is held. R explains A.`),
  xstm(4, 'thermal stress', r`For the same rise in temperature, a clamped steel rod ($Y = 2.0\times10^{11}$ Pa, $\alpha = 1.2\times10^{-5}\ \mathrm{K^{-1}}$) develops a greater stress than a clamped copper rod ($Y = 1.2\times10^{11}$ Pa, $\alpha = 1.7\times10^{-5}\ \mathrm{K^{-1}}$).`, r`The thermal stress of a clamped rod is $Y\alpha\theta$.`, 0,
    r`II is the formula. Per kelvin, steel gives $2.0\times10^{11}\times1.2\times10^{-5} = 2.4\times10^{6}$ Pa and copper $1.2\times10^{11}\times1.7\times10^{-5} = 2.04\times10^{6}$ Pa. Steel is larger, so I is true too. Both are true.`),
  xcnt(4, 'counting statements', r`How many of the following are correct?`, [r`The unit of Young's modulus is the same as that of pressure.`, r`The bulk modulus of a perfect gas under isothermal change equals its pressure.`, r`The shear modulus of a liquid is zero.`, r`The elastic energy per unit volume is $\tfrac12\times$ stress $\times$ strain.`], 4,
    r`(1) both are $\mathrm{N\,m^{-2}}$. (2) $PV = $ const gives $B = P$. (3) liquids cannot sustain shear. (4) area under the stress-strain line. All four.`),
  xmt(4, 'changing a wire', 'ms3', r`A wire of length $L$ and radius $r$ carries a load $F$. Match each change (other things fixed) with the effect on the extension.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$x = \dfrac{FL}{\pi r^2Y}\propto\dfrac{L}{r^2}$. (A) $2$ (p). (B) $\tfrac14$ (q). (C) $\dfrac{2}{4} = \tfrac12$ (r). (D) $\dfrac{3}{(\sqrt3)^2} = 1$ (s).`),
  xmt(4, 'energy in a wire', 'ms4', r`A wire carries a load $F$; $U = \dfrac{F^2L}{2AY}$. Match each change with the effect on the stored energy.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`(A) $U\propto L$: 2 (p). (B) $U\propto1/A\propto1/r^2$: $\tfrac14$ (q). (C) $U\propto1/Y$: $\tfrac12$ (r). (D) $U\propto F^2$: 4 (s).`),
  xmt(4, 'stress-strain curve', 'ms5', r`Match each point on the stress-strain graph of a ductile metal with its description.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`The proportional limit is where Hooke's law ends (p). The yield (elastic limit) is where permanent deformation begins (q). The ultimate tensile strength is the maximum stress (r). Fracture is where the wire breaks (s).`),
  xmt(4, 'thermal stress', 'ms7', r`A steel rod with $Y\alpha = 2.4\times10^{6}\ \mathrm{Pa\,K^{-1}}$ is subjected to the following. Match each with the stress.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    r`Clamped and heated: compressive $Y\alpha\theta = 2.4\times10^{6}\times10 = 24$ MPa (p). Clamped and cooled: tensile 24 MPa (q). Clamped, heated 20 K: compressive 48 MPa (r). Free: no stress (s).`),
  xpas(3, 'stress', 'ps1', r`Find the stress in the wire (in MPa, 1 decimal).`, 10 * XG / (XPI * 0.5e-3 ** 2) / 1e6 * 1, 0.5, 1,
    r`$A = \pi r^2 = \pi(0.5\times10^{-3})^2 = 7.85\times10^{-7}\ \mathrm{m^2}$. $F = mg = 98$ N. $\sigma = \dfrac{98}{7.85\times10^{-7}} = 1.248\times10^{8}$ Pa $= 124.8$ MPa.`, { unit: 'MPa' }),
  xpas(3, 'extension', 'ps1', r`Find the extension of the wire (in mm, 2 decimals).`, 98 / (XPI * (0.5e-3) ** 2) * 2 / 2e11 * 1e3, 0.02, 2,
    r`$\Delta L = \dfrac{\sigma L}{Y} = \dfrac{1.248\times10^{8}\times2}{2\times10^{11}} = 1.248\times10^{-3}$ m $= 1.25$ mm.`, { unit: 'mm' }),
  xpas(5, 'lifting at the limit', 'ps1', r`The block is now pulled upwards with a constant acceleration so that the wire is just at the point of breaking. Find the acceleration (in $\mathrm{m\,s^{-2}}$, 1 decimal).`, 7.5e8 * XPI * (0.5e-3) ** 2 / 10 - XG, 0.3, 1,
    r`Maximum tension $= 7.5\times10^{8}\times7.854\times10^{-7} = 589.0$ N. $T - mg = ma$, so $a = \dfrac{589.0}{10} - 9.8 = 49.1\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  xpas(3, 'thermal stress', 'ps2', r`Find the stress developed in the rod, assuming the walls do not move (in MPa).`, 2e11 * 1.2e-5 * 50 / 1e6, 0, 0,
    r`Strain $= \alpha\theta = 1.2\times10^{-5}\times50 = 6\times10^{-4}$. $\sigma = Y\times\varepsilon = 1.2\times10^{8}$ Pa $= 120$ MPa.`, { unit: 'MPa' }),
  xpas(4, 'force on the walls', 'ps2', r`Find the force the rod exerts on each wall (in kN).`, 1.2e8 * 4e-4 / 1e3, 0, 0,
    r`$F = \sigma A = 1.2\times10^{8}\times4\times10^{-4} = 4.8\times10^{4}$ N $= 48$ kN.`, { unit: 'kN' }),
  xpas(5, 'yielding walls', 'ps2', r`One of the walls moves back by 0.20 mm as the rod pushes on it. Find the new stress in the rod (in MPa).`, (1.2e-5 * 50 * 1 - 0.2e-3) / 1 * 2e11 / 1e6, 0, 0,
    r`Free expansion $= \alpha\theta L = 6\times10^{-4}$ m $= 0.60$ mm. The wall yields 0.20 mm, leaving 0.40 mm to be absorbed: strain $= 4\times10^{-4}$. $\sigma = 2\times10^{11}\times4\times10^{-4} = 80$ MPa.`, { unit: 'MPa', trap: 'The wall is not rigid: only the leftover expansion is resisted.' }),

  // ---------- Level 5 ----------
  xnat(5, 'composite rod', r`A steel rod and a copper rod, each 0.50 m long and $1\ \mathrm{cm^2}$ in cross-section, are joined end to end and fitted between two rigid walls. The temperature rises by 50 K. Find the stress in the rods (in MPa, 1 decimal). Steel: $Y = 2.0\times10^{11}$, $\alpha = 1.2\times10^{-5}$. Copper: $Y = 1.2\times10^{11}$, $\alpha = 1.7\times10^{-5}$.`, (1.2e-5 + 1.7e-5) * 50 / (1 / 2e11 + 1 / 1.2e11) / 1e6, 0.2, 1,
    r`Both carry the same force (they are in series), hence the same stress $\sigma$. Total free expansion $= (\alpha_sL + \alpha_cL)\theta$; compression $= \sigma L\left(\dfrac1{Y_s} + \dfrac1{Y_c}\right)$. These are equal: $\sigma = \dfrac{(\alpha_s + \alpha_c)\theta}{1/Y_s + 1/Y_c} = \dfrac{2.9\times10^{-5}\times50}{5\times10^{-12} + 8.33\times10^{-12}} = 1.0875\times10^{8}$ Pa $= 108.8$ MPa.`, { unit: 'MPa', trap: 'The walls fix the total length, not each rod separately.' }),
  xnat(5, 'rotating ring', r`A thin steel ring of radius 0.50 m ($\rho = 7800\ \mathrm{kg\,m^{-3}}$) rotates in its own plane about its centre at $100\ \mathrm{rad\,s^{-1}}$. Find the tensile stress in the ring (in MPa, 1 decimal).`, 7800 * (100 * 0.5) ** 2 / 1e6, 0.1, 1,
    r`Take a small piece of the ring subtending angle $d\theta$. Its mass is $\lambda R\,d\theta$ and it needs a centripetal force $\lambda R\,d\theta\,\omega^2R$. The two tensions $T$ at its ends supply a resultant $2T\sin\dfrac{d\theta}{2}\approx T\,d\theta$ towards the centre. So $T = \lambda\omega^2R^2 = \lambda v^2$ and the stress is $\dfrac{T}{A} = \rho v^2 = 7800\times(100\times0.5)^2 = 1.95\times10^{7}$ Pa $= 19.5$ MPa.`, { unit: 'MPa' }),
  xnat(5, 'rotating rod', r`A steel rod of length 2.0 m rotates in a horizontal plane about one end at $300\ \mathrm{rad\,s^{-1}}$. Find the total elongation of the rod (in mm, 2 decimals). $\rho = 7800\ \mathrm{kg\,m^{-3}}$, $Y = 2\times10^{11}\ \mathrm{Pa}$.`, 7800 * 300 ** 2 * 8 / (3 * 2e11) * 1e3, 0.05, 2,
    r`Tension at distance $r$: $T(r) = \dfrac{A\rho\omega^2(L^2 - r^2)}{2}$. Extension $= \int_0^L\dfrac{T}{AY}dr = \dfrac{\rho\omega^2}{2Y}\left(L^3 - \dfrac{L^3}{3}\right) = \dfrac{\rho\omega^2L^3}{3Y} = \dfrac{7800\times9\times10^{4}\times8}{6\times10^{11}} = 9.36\times10^{-3}$ m $= 9.36$ mm.`, { unit: 'mm' }),
  xnat(5, 'tapered wire', r`A wire of length 2.0 m has a circular cross-section whose radius grows linearly from 1.0 mm at one end to 2.0 mm at the other. A load of 100 N pulls on it. Find its extension (in mm, 3 decimals). $Y = 2\times10^{11}\ \mathrm{Pa}$.`, 100 * 2 / (2e11 * XPI * 1e-6 * 2) * 1e3, 0.003, 3,
    r`An element $dx$ at position $x$ stretches by $\dfrac{F\,dx}{\pi r(x)^2Y}$ with $r = r_0(1 + x/L)$ and $r_0 = 1$ mm. $\Delta L = \dfrac{F}{\pi Yr_0^2}\int_0^L\dfrac{dx}{(1 + x/L)^2} = \dfrac{FL}{\pi Yr_0^2}\left[1 - \dfrac12\right] = \dfrac{100\times2}{2\pi\times2\times10^{11}\times10^{-6}} = 1.59\times10^{-4}$ m $= 0.159$ mm.`, { unit: 'mm', trap: 'Using the average radius gives a different (wrong) answer.' }),
  xnat(5, 'non-uniform modulus', r`A wire of length 2.0 m and cross-section $1\ \mathrm{mm^2}$ has a Young's modulus that increases linearly along its length: $Y = Y_0(1 + x/L)$ with $Y_0 = 1\times10^{11}\ \mathrm{Pa}$. A load of 100 N hangs from it (ignore its weight). Find the extension (in mm, 3 decimals).`, 100 * 2 / (1e-6 * 1e11) * Math.LN2 * 1e3, 0.003, 3,
    r`$d(\Delta L) = \dfrac{F\,dx}{AY(x)}$. $\Delta L = \dfrac{F}{AY_0}\int_0^L\dfrac{dx}{1 + x/L} = \dfrac{FL}{AY_0}\ln2 = \dfrac{100\times2}{10^{-6}\times10^{11}}\times0.693 = 1.386\times10^{-3}$ m $= 1.386$ mm.`, { unit: 'mm' }),
  xnat(5, 'energy in a hanging rod', r`A uniform steel rod 10 m long and $1\ \mathrm{mm^2}$ in cross-section hangs from its upper end. Find the elastic energy stored in it by its own weight (in $\mu$J, 2 decimals). $\rho = 7800$, $Y = 2\times10^{11}$ SI.`, 1e-6 * 7800 ** 2 * XG ** 2 * 1000 / (6 * 2e11) * 1e6, 0.03, 2,
    r`At a distance $x$ from the free end, stress $= \rho gx$ and the energy density is $\dfrac{(\rho gx)^2}{2Y}$. $U = \int_0^LA\dfrac{\rho^2g^2x^2}{2Y}dx = \dfrac{A\rho^2g^2L^3}{6Y} = \dfrac{10^{-6}\times(7800)^2\times(9.8)^2\times1000}{1.2\times10^{12}} = 4.87\times10^{-6}$ J $= 4.87\ \mu$J.`, { unit: 'µJ' }),
  xmsq(5, 'moduli', r`Which of these are correct for an isotropic solid, with $Y = 2G(1 + \sigma) = 3B(1 - 2\sigma)$?`, [r`$\sigma$ cannot exceed $0.5$ for a material with positive bulk modulus.`, r`If $\sigma = 0.5$ the material is incompressible.`, r`$G > Y/2$ whenever $\sigma > 0$.`, r`$B > Y/3$ whenever $\sigma > 0$.`], [0, 1, 3],
    r`$B > 0$ requires $1 - 2\sigma > 0$, so $\sigma < 0.5$ (A). At 0.5, $B\to\infty$: incompressible (B). $G = \dfrac{Y}{2(1 + \sigma)}$ is less than $\dfrac Y2$ for $\sigma > 0$, so C is false. $B = \dfrac{Y}{3(1 - 2\sigma)} > \dfrac Y3$ for $\sigma > 0$ (D).`),
  xmsq(5, 'sudden loading', r`A load $W$ is attached to a wire of force constant $k$ and released from rest when the wire is just taut (unstretched). Which are correct?`, [r`The maximum extension is $\dfrac{2W}{k}$.`, r`The equilibrium extension is $\dfrac Wk$.`, r`The maximum tension is $W$.`, r`The work done by gravity up to the maximum extension equals the elastic energy stored then.`], [0, 1, 3],
    r`Energy: $Wx = \tfrac12kx^2$ gives $x = 2W/k$ (A, D), twice the equilibrium extension $W/k$ (B). The maximum tension is $kx = 2W$, not $W$ (C false). (Beyond the elastic limit the wire would be permanently stretched or break.)`),
  xmsq(5, 'hysteresis', r`A rubber band is loaded and then unloaded. Which are correct?`, [r`The loading and unloading curves differ.`, r`The area of the loop equals the energy dissipated per unit volume per cycle.`, r`Rubber returns exactly to its original length immediately after unloading from a large strain.`, r`Rubber obeys Hooke's law up to large strains.`], [0, 1],
    r`Hysteresis means the curves differ, with the loop area as dissipated energy density (A, B). The elastic after-effect means the original length is recovered only after some time (C false). Rubber is not linear; its stress-strain curve is a curve (D false).`),
  xmt(5, 'moduli of a material', 'ms6', r`A solid has $Y = 2\times10^{11}$ Pa and Poisson's ratio 0.25. Match each quantity with its value.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-t, B-q, C-r, D-s'],
    r`$G = \dfrac{Y}{2(1 + \sigma)} = 80$ GPa (p). $B = \dfrac{Y}{3(1 - 2\sigma)} = 133$ GPa (q). Lateral strain $= \sigma\varepsilon = 0.25\times2\times10^{-3} = 5\times10^{-4}$ (r). Volume strain $= \varepsilon(1 - 2\sigma) = 1\times10^{-3}$ (s).`),
  xmt(5, 'a rod hanging under its weight', 'ms8', r`Match each item for a uniform rod hanging from its upper end.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-q, C-t, D-s'],
    r`At a distance $x$ from the free end the stress is $\rho gx$: at the top $\rho gL$ (p), at the middle $\dfrac{\rho gL}{2}$ (q). Extension $\int\dfrac{\rho gx}{Y}dx = \dfrac{\rho gL^2}{2Y}$ (r). Energy $\int\dfrac{(\rho gx)^2}{2Y}A\,dx = \dfrac{\rho^2g^2AL^3}{6Y}$ (s). Option t is twice the correct elongation.`),

];

xitems.push(
  xmsq(5, 'wires in series', r`Two wires of the same material are joined end to end and carry a load $F$. Wire A has twice the radius of wire B. Which are correct?`, [r`Both wires carry the same force $F$.`, r`Both wires have the same stress.`, r`The total extension is the sum of the two extensions.`, r`The effective force constant satisfies $\dfrac1k = \dfrac1{k_A} + \dfrac1{k_B}$.`], [0, 2, 3],
    r`In series the same tension runs through both (A). The stress is $F/A$, so wire B (thinner) has 4 times the stress of A (B false). Extensions add (C), and the springs combine like capacitors in series (D).`),
  xmsq(5, 'torsion', r`A solid cylindrical rod of length $L$, radius $r$ and shear modulus $G$ is twisted through angle $\theta$ about its axis. Which are correct?`, [r`The restoring torque is proportional to $\theta$.`, r`The torsional constant is proportional to $r^4$.`, r`The torsional constant is proportional to $1/L$.`, r`The torsional constant is proportional to $r^2$.`], [0, 1, 2],
    r`$\tau = \dfrac{\pi Gr^4}{2L}\theta$: linear in $\theta$ (A), $\propto r^4$ (B), $\propto1/L$ (C), not $r^2$ (D false).`),
);

const xgens = [
  xg('se-g23', 3, 'nat', 'extension of a wire', function make(rng) {
    const L = pick(rng, 1, 4, 0.5); const d = pick(rng, 0.5, 2, 0.25); const m = pick(rng, 5, 40, 5); const Y = choose(rng, [2, 1.1, 0.7]);
    const x = 4 * m * 9.8 * L / (XPI * (d * 1e-3) ** 2 * Y * 1e11) * 1e3;
    return { L, d, m, Y, q: `A wire ${L} m long and ${d} mm in diameter ($Y = ${Y}\\times10^{11}\\ \\mathrm{N\\,m^{-2}}$) carries a ${m} kg load. Find its extension (in mm, 3 decimals; $g = 9.8$).`, answer: +x.toFixed(3), tol: Math.max(0.003, x * 0.005), unit: 'mm',
      sol: `$A = \\pi d^2/4 = ${xs(XPI * (d * 1e-3) ** 2 / 4)}\\ \\mathrm{m^2}$, $F = ${m}\\times9.8 = ${xs(m * 9.8)}$ N. $\\Delta L = \\dfrac{FL}{AY} = ${xs(x)}$ mm.`, trap: 'Use the diameter to find the area: A = πd²/4, not πd².' };
  }, (p) => { const A = XPI * (p.d * 1e-3) ** 2 / 4; return (p.m * 9.8 / A) / (p.Y * 1e11) * p.L * 1e3; }),
  xg('se-g24', 3, 'mcq', 'changing a wire', function make(rng) {
    const a = choose(rng, [2, 3, 4]); const b = choose(rng, [1, 2, 3]);
    const ratio = a / (b * b);
    const o = numOpts(rng, ratio, [a * b * b, a / b, a * b], '', 3);
    return { a, b, q: `A wire carries a load. Its length is multiplied by ${a} and its radius by ${b} (same material, same load). The extension is multiplied by`, options: o.options, answer: o.answer,
      sol: `$x = \\dfrac{FL}{\\pi r^2Y}\\propto\\dfrac{L}{r^2}$, so the factor is $\\dfrac{${a}}{${b}^2} = ${xs(ratio, 4)}$. Options with $r$ instead of $r^2$, or $r^2$ in the numerator, are the common slips.` };
  }, (p) => p.options.findIndex((o) => o === fmt(p.a / (p.b * p.b), 3))),
  xg('se-g25', 4, 'nat', 'thermal stress', function make(rng) {
    const al = choose(rng, [1.2, 1.7, 2.3]); const Yv = choose(rng, [2.0, 1.2, 0.7]); const th = pick(rng, 20, 80, 10);
    const s = Yv * 1e11 * al * 1e-5 * th / 1e6;
    return { al, Yv, th, q: `A rod ($Y = ${Yv}\\times10^{11}$ Pa, $\\alpha = ${al}\\times10^{-5}\\ \\mathrm{K^{-1}}$) is clamped between rigid walls and its temperature rises by ${th} K. Find the compressive stress (in MPa, 1 decimal).`, answer: +s.toFixed(1), tol: 0.2, unit: 'MPa',
      sol: `The strain that is prevented is $\\alpha\\theta = ${xs(al * 1e-5 * th, 4)}$. $\\sigma = Y\\alpha\\theta = ${Yv}\\times10^{11}\\times${xs(al * 1e-5 * th, 4)} = ${xs(s)}$ MPa.`, trap: 'The length of the rod does not enter.' };
  }, (p) => { const L = 1; const free = p.al * 1e-5 * p.th * L; return (free / L) * p.Yv * 1e5; }),
  xg('se-g26', 4, 'nat', 'wires in parallel', function make(rng) {
    const F = pick(rng, 200, 800, 100); const kA = choose(rng, [1, 2, 3]); const kB = choose(rng, [1, 2, 4]);
    const LA = 1; const AA = kA; const LB = choose(rng, [1, 2]); const AB = kB * LB;
    const sh = F * (AA / LA) / (AA / LA + AB / LB);
    return { F, AA, AB, LA, LB, q: `A load of ${F} N hangs from two wires of the same material that stretch equally. Wire A has length ${LA} m and cross-section ${AA} $\\mathrm{mm^2}$; wire B has length ${LB} m and cross-section ${AB} $\\mathrm{mm^2}$. Find the load on A (in N, 1 decimal).`, answer: +sh.toFixed(1), tol: 0.2, unit: 'N',
      sol: `Equal extension: $F = k\\,x$ with $k\\propto A/L$. $k_A\\propto${xs(AA / LA, 4)}$, $k_B\\propto${xs(AB / LB, 4)}$. A takes $\\dfrac{${xs(AA / LA, 4)}}{${xs(AA / LA + AB / LB, 4)}}\\times${F} = ${xs(sh)}$ N.`, trap: 'The load divides in proportion to A/L (the stiffness), not equally.' };
  }, (p) => { const x = p.F / (p.AA / p.LA + p.AB / p.LB); return x * p.AA / p.LA; }),
  xg('se-g27', 4, 'nat', 'elastic energy', function make(rng) {
    const F = pick(rng, 50, 300, 50); const L = pick(rng, 1, 3, 0.5); const A = pick(rng, 1, 4, 1); const Y = choose(rng, [2, 1]);
    const U = F * F * L / (2 * A * 1e-6 * Y * 1e11) * 1e3;
    return { F, L, A, Y, q: `A wire ${L} m long, cross-section ${A} $\\mathrm{mm^2}$ ($Y = ${Y}\\times10^{11}\\ \\mathrm{Pa}$), carries a load ${F} N within its elastic limit. Find the energy stored (in mJ, 2 decimals).`, answer: +U.toFixed(2), tol: Math.max(0.02, U * 0.01), unit: 'mJ',
      sol: `$x = \\dfrac{FL}{AY} = ${xs(F * L / (A * 1e-6 * Y * 1e11) * 1e3)}$ mm. $U = \\tfrac12Fx = \\tfrac12\\times${F}\\times${xs(F * L / (A * 1e-6 * Y * 1e11), 4)} = ${xs(U)}$ mJ.`, trap: 'Half of F times x, not F times x.' };
  }, (p) => { const A = p.A * 1e-6; const vol = A * p.L; const sig = p.F / A; return sig * sig / (2 * p.Y * 1e11) * vol * 1e3; }),
  xg('se-g28', 5, 'nat', 'rotating rod', function make(rng) {
    const L = pick(rng, 0.5, 2, 0.5); const w = pick(rng, 100, 400, 50); const rho = choose(rng, [7800, 2700, 8900]); const Y = choose(rng, [2.0, 0.7, 1.2]);
    const e = rho * w * w * L ** 3 / (3 * Y * 1e11) * 1e3;
    return { L, w, rho, Y, q: `A uniform rod ${L} m long ($\\rho = ${rho}\\ \\mathrm{kg\\,m^{-3}}$, $Y = ${Y}\\times10^{11}$ Pa) rotates in a horizontal plane about one end at ${w} $\\mathrm{rad\\,s^{-1}}$. Find its total elongation (in mm, 4 decimals).`, answer: +e.toFixed(4), tol: Math.max(0.0005, e * 0.005), unit: 'mm',
      sol: `$T(r)/A = \\dfrac{\\rho\\omega^2(L^2 - r^2)}{2}$. Elongation $= \\int_0^L\\dfrac{\\rho\\omega^2(L^2 - r^2)}{2Y}dr = \\dfrac{\\rho\\omega^2L^3}{3Y} = ${xs(e)}$ mm.`, trap: 'The factor is 1/3, from integrating (L² − r²)/2.' };
  }, (p) => { let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const r = (i + 0.5) * p.L / n; s += p.rho * p.w ** 2 * (p.L ** 2 - r ** 2) / 2 / (p.Y * 1e11) * p.L / n; } return s * 1e3; }),
  xg('se-g29', 4, 'nat', 'bulk modulus', function make(rng) {
    const h = pick(rng, 1, 8, 1); const B = choose(rng, [2.2e9, 1.6e11, 1.4e11]); const Bs = B === 2.2e9 ? '2.2\\times10^{9}' : B === 1.6e11 ? '1.6\\times10^{11}' : '1.4\\times10^{11}';
    const dv = 1025 * 9.8 * h * 1e3 / B * 100;
    return { h, B, q: `A body of bulk modulus $${Bs}$ Pa is lowered ${h} km into the sea (density 1025 $\\mathrm{kg\\,m^{-3}}$; ignore the atmosphere). Find the percentage decrease in its volume (3 decimals).`, answer: +dv.toFixed(3), tol: Math.max(0.002, dv * 0.005),
      sol: `$P = \\rho gh = 1025\\times9.8\\times${h * 1000} = ${xs(1025 * 9.8 * h * 1000)}$ Pa. $\\dfrac{\\Delta V}{V} = \\dfrac PB = ${xs(dv / 100, 4)}$, i.e. ${xs(dv)} %.`, trap: 'Convert km to m before using ρgh.' };
  }, (p) => 100 * (1025 * 9.8 * p.h * 1000) / p.B),
  xg('se-g30', 5, 'nat', 'tapered wire', function make(rng) {
    const kk = choose(rng, [2, 3, 4]); const F = pick(rng, 50, 300, 50); const L = pick(rng, 1, 3, 1); const r0 = choose(rng, [0.5, 1.0]);
    const ex = F * L / (2e11 * XPI * (r0 * 1e-3) ** 2 * kk) * 1e3;
    return { kk, F, L, r0, q: `A wire of length ${L} m has a circular cross-section whose radius grows linearly from ${r0} mm at one end to ${xs(r0 * kk)} mm at the other. A load of ${F} N pulls on it ($Y = 2\\times10^{11}$ Pa). Find its extension (in mm, 4 decimals).`, answer: +ex.toFixed(4), tol: Math.max(0.0004, ex * 0.005), unit: 'mm',
      sol: `$\\Delta L = \\int_0^L\\dfrac{F\\,dx}{\\pi Y r(x)^2}$ with $r = r_0\\left(1 + (${kk} - 1)\\dfrac xL\\right)$. The integral of $\\dfrac{dx}{r^2}$ is $\\dfrac{L}{r_0^2\\times${kk}}$, so $\\Delta L = \\dfrac{FL}{\\pi Yr_0^2\\times${kk}} = ${xs(ex)}$ mm.`, trap: 'Do not use the mean radius.' };
  }, (p) => { let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const x = (i + 0.5) / n; const r = p.r0 * 1e-3 * (1 + (p.kk - 1) * x); s += p.F * (p.L / n) / (XPI * r * r * 2e11); } return s * 1e3; }),
  xg('se-g31', 3, 'mcq', 'wire under its own weight', function make(rng) {
    const rho = choose(rng, [2700, 7800, 8900]); const sb = choose(rng, [1.0, 2.5, 4.0, 7.5]) * 1e8;
    const Lm = sb / (rho * 9.8);
    const o = numOpts(rng, Lm / 1000, [Lm / 2000, Lm / 500, Lm / 98], 'km', 3);
    return { rho, sb, q: `A uniform wire of density ${rho} $\\mathrm{kg\\,m^{-3}}$ and breaking stress $${xs(sb / 1e8)}\\times10^{8}$ Pa hangs from its upper end. The greatest length that does not break under its own weight is (take $g = 9.8$)`, options: o.options, answer: o.answer,
      sol: `At the top the stress is $\\rho gL$. $L = \\dfrac{\\sigma_b}{\\rho g} = \\dfrac{${xs(sb / 1e8)}\\times10^{8}}{${rho}\\times9.8} = ${xs(Lm / 1000)}$ km. Half of this comes from wrongly averaging the stress over the length.` };
  }, (p) => p.options.findIndex((o) => o === `${fmt(p.sb / (p.rho * 9.8) / 1000, 3)} km`)),
];

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'solids-elasticity', groups: { ...groups, ...xgroups }, items: [...items, ...xitems], gens: [...gens, ...xgens] }, ['se-g11'], [], ['se-g11']);
