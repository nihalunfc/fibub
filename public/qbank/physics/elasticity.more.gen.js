// Extra question shapes for elasticity (templates ela-t21..t26). Imported by elasticity.js.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import { msqOf, simpson } from './_more.js';

const n3 = (x) => String(+x.toPrecision(3));

export default [
  { id: 'ela-t21', type: 'msq', level: 2, exams: ['jam'], sub: 'stress-strain curve', format: 'graph in words',
    make(r) {
      const s1 = int(r, 10, 30) * 10, e1 = pick(r, 0.1, 0.3, 0.05), ductile = r() < 0.5;
      const e2 = round(ductile ? e1 * int(r, 15, 40) : e1 * 1.2, 3), s2 = ductile ? s1 + int(r, 5, 20) * 10 : s1 + 10;
      const Y = s1 / (e1 * 10), U = 0.5 * s1 * 1e6 * (e1 / 100) / 1000, not = r() < 0.35;
      const res = msqOf(r, [
        [`Young's modulus of the material is $${n3(Y)}$ GPa`, true, `Slope of the straight part: $${s1}$ MPa $/\\,${e1}\\% = ${s1}\\times10^6/${round(e1 / 100, 5)} = ${n3(Y)}$ GPa.`],
        [`Young's modulus of the material is $${n3(s2 / (e2 * 10))}$ GPa`, false, `That divides the breaking stress by the breaking strain; the modulus is the slope of the straight part, $${n3(Y)}$ GPa.`],
        [`The elastic energy stored per unit volume at the end of the straight part is $${n3(U)}$ kJ/m³`, true, `Area of the triangle: $\\tfrac12\\sigma\\varepsilon = \\tfrac12\\times${s1}\\times10^6\\times${round(e1 / 100, 5)} = ${n3(U * 1000)}$ J/m³.`],
        ['The total area under the curve up to fracture is the work per unit volume needed to break the specimen', true, 'Work per volume is $\\int\\sigma\\,d\\varepsilon$.'],
        ['The material is ductile', ductile, ductile ? `It stretches to ${e2}% before breaking, far beyond its elastic strain of ${e1}%.` : `It breaks at ${e2}%, barely past the elastic strain of ${e1}%: brittle.`],
        ['Unloading anywhere on the straight part returns the specimen to its original length', true, 'Below the proportional (and elastic) limit the deformation is reversible.'],
        [`Hooke's law holds right up to the breaking stress of ${s2} MPa`, false, `It holds only up to ${s1} MPa, the end of the straight part.`],
      ], { not });
      return { q: `A metal specimen's stress-strain curve is a straight line from the origin to ${s1} MPa at ${e1}% strain. ${ductile ? `It then bends over, yields and keeps stretching, finally breaking at ${s2} MPa and ${e2}% strain.` : `It then curves slightly and breaks at ${s2} MPa and ${e2}% strain.`} Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'Strain given in per cent must be divided by 100 before use.' };
    } },
  { id: 'ela-t22', type: 'nat', level: 3, exams: ['jam'], sub: 'poisson ratio', unit: '%',
    make(r) {
      const e = pick(r, 0.001, 0.005, 0.0005), s = pick(r, 0.2, 0.45, 0.01), v = 100 * e * (1 - 2 * s);
      return { q: `A wire with Poisson's ratio ${s} is stretched elastically to a longitudinal strain of ${e}. Its volume increases by ______ % (three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.01, 4)), unit: '%', e, s,
        sol: `Length grows by the factor $(1 + \\varepsilon)$ and each width shrinks by $(1 - \\sigma\\varepsilon)$, so $V'/V = (1 + \\varepsilon)(1 - \\sigma\\varepsilon)^2\\approx 1 + \\varepsilon(1 - 2\\sigma)$. With $\\varepsilon = ${e}$ and $\\sigma = ${s}$: $\\Delta V/V = ${e}\\times${round(1 - 2 * s, 2)} = ${round(v / 100, 6)}$, that is $${round(v, 3)}\\%$.`,
        trap: 'Two lateral directions shrink, so the factor is $1 - 2\\sigma$; with $\\sigma = 0.5$ the volume would not change.' };
    },
    verify: (p) => 100 * ((1 + p.e) * (1 - p.s * p.e) ** 2 - 1) },
  { id: 'ela-t23', type: 'mcq', level: 2, exams: ['jam'], sub: 'relations',
    make(r) {
      const Y = choose(r, [70, 100, 120, 200, 210]), s = choose(r, [0.25, 0.28, 0.3, 0.33, 0.35]);
      const K = Y / (3 * (1 - 2 * s)), G = (x) => `$${n3(x)}$ GPa`;
      const o = mcqOptions(r, G(K), [G(Y / (2 * (1 + s))), G(Y / (3 * (1 + 2 * s))), G(3 * Y * (1 - 2 * s)), G(Y / (1 - 2 * s))]);
      return { q: `A metal has Young's modulus ${Y} GPa and Poisson's ratio ${s}. Its bulk modulus is`, ...o,
        sol: `$Y = 3K(1 - 2\\sigma)$, so $K = \\dfrac{Y}{3(1 - 2\\sigma)} = \\dfrac{${Y}}{3\\times${round(1 - 2 * s, 2)}} = ${n3(K)}$ GPa. (The value $Y/(2(1 + \\sigma)) = ${n3(Y / (2 * (1 + s)))}$ GPa is the shear modulus.)`,
        trap: 'Mixing up $Y = 3K(1 - 2\\sigma)$ with $Y = 2G(1 + \\sigma)$.' };
    } },
  { id: 'ela-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'hooke law', unit: 'mm',
    make(r) {
      const mats = [['steel', 200], ['copper', 120], ['aluminium', 70], ['brass', 100]];
      const i = int(r, 0, 3); let j = int(r, 0, 2); if (j >= i) j += 1;
      const [n1, Y1] = mats[i], [n2, Y2] = mats[j], A = int(r, 2, 20), L1 = pick(r, 0.5, 2, 0.5), L2 = pick(r, 0.5, 2, 0.5), F = A * int(r, 2, 10) * 10;
      const x = (F / (A * 1e-6)) * (L1 / (Y1 * 1e9) + L2 / (Y2 * 1e9)) * 1000;
      return { q: `Two rods, one of ${n1} (${L1} m, $Y = ${Y1}$ GPa) and one of ${n2} (${L2} m, $Y = ${Y2}$ GPa), both of cross-section ${A} mm², are joined end to end and pulled by a force of ${F} N. The total extension is ______ mm (three decimal places).`,
        answer: round(x, 3), tol: Math.max(0.002, round(x * 0.002, 3)), unit: 'mm', A, L1, L2, Y1, Y2, F,
        sol: `Both rods carry the full force, so each stretches by $FL/(AY)$. Stress $F/A = ${F}\\text{ N}/${A}\\text{ mm}^2 = ${n3(F / A)}$ MPa. Extensions: $${n3(((F / (A * 1e-6)) * L1) / (Y1 * 1e9) * 1000)}$ mm and $${n3(((F / (A * 1e-6)) * L2) / (Y2 * 1e9) * 1000)}$ mm, total $${round(x, 3)}$ mm.`,
        trap: 'In series the force is the same in both rods; it is the extensions that add.' };
    },
    verify: (p) => { const k1 = (p.A * 1e-6 * p.Y1 * 1e9) / p.L1, k2 = (p.A * 1e-6 * p.Y2 * 1e9) / p.L2; return (p.F / ((k1 * k2) / (k1 + k2))) * 1000; } },
  { id: 'ela-t25', type: 'msq', level: 2, exams: ['jam'], sub: 'bulk modulus',
    make(r) {
      const P = int(r, 1, 5), not = r() < 0.5;
      const res = msqOf(r, [
        [`An ideal gas at ${P}$\\times10^5$ Pa has isothermal bulk modulus ${P}$\\times10^5$ Pa`, true, 'For $PV = $ const, $K = -V\\,dP/dV = P$.'],
        [`Air ($\\gamma = 1.4$) at ${P}$\\times10^5$ Pa has adiabatic bulk modulus ${round(1.4 * P, 1)}$\\times10^5$ Pa`, true, 'For $PV^\\gamma = $ const, $K = \\gamma P$.'],
        ['Compressibility is the reciprocal of the bulk modulus', true, 'By definition, $\\kappa = 1/K$.'],
        ["Young's modulus has the same unit as strain", false, 'Strain has no unit; Young\'s modulus is a stress, in pascals.'],
        ['The shear modulus describes a change of shape at constant volume', true, 'Shear changes angles, not volume.'],
        ['A liquid at rest resists compression but has no shear modulus', true, 'A fluid at rest cannot hold a steady shear stress.'],
        ['The bulk modulus of an ideal gas does not depend on its pressure', false, 'It equals $P$ (isothermal) or $\\gamma P$ (adiabatic), so it grows with pressure.'],
      ], { not });
      return { q: `Which statements about elastic moduli are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'A gas has a bulk modulus too: it equals its pressure (times $\\gamma$ for fast changes).' };
    } },
  { id: 'ela-t26', type: 'nat', level: 4, exams: ['jam'], sub: 'torsion', unit: '°',
    make(r) {
      const G = choose(r, [26, 40, 45, 80]), r2 = int(r, 10, 30), r1 = Math.round(r2 * pick(r, 0.4, 0.8, 0.1)), L = pick(r, 0.5, 2, 0.5), S = int(r, 2, 8) * 10e6;
      const tau = Math.max(1, Math.round((S * Math.PI * ((r2 * 1e-3) ** 4 - (r1 * 1e-3) ** 4)) / (2 * r2 * 1e-3)));
      const th = ((2 * tau * L) / (Math.PI * G * 1e9 * ((r2 * 1e-3) ** 4 - (r1 * 1e-3) ** 4))) * (180 / Math.PI);
      return { q: `A hollow shaft ${L} m long has outer radius ${r2} mm, inner radius ${r1} mm and shear modulus ${G} GPa. One end is fixed and a torque of ${tau} N m is applied to the other. The angle of twist is ______ degrees (three decimal places).`,
        answer: round(th, 3), tol: Math.max(0.002, round(th * 0.002, 3)), unit: '°', G, r1, r2, L, tau,
        sol: `A thin tube of radius $s$ and thickness $ds$ needs torque $d\\tau = \\dfrac{2\\pi G\\phi}{L}s^3ds$ to twist by $\\phi$. Integrating from $r_1$ to $r_2$: $\\tau = \\dfrac{\\pi G\\phi}{2L}(r_2^4 - r_1^4)$. So $\\phi = \\dfrac{2\\tau L}{\\pi G(r_2^4 - r_1^4)} = ${round((th * Math.PI) / 180, 6)}$ rad $= ${round(th, 3)}^\\circ$.`,
        trap: 'The fourth powers make the outer layers dominate; and the result comes out in radians first.' };
    },
    verify: (p) => { const c = simpson((s) => 2 * Math.PI * p.G * 1e9 * s ** 3 / p.L, p.r1 * 1e-3, p.r2 * 1e-3); return (p.tau / c) * (180 / Math.PI); } },
];
