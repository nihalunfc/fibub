// Round 4 extras for conductors-images: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round, C } from '../_util.js';
const R = String.raw;
const k = 1 / (4 * Math.PI * C.eps0);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const frac = (a, b) => { const g = gcd(a, b); return b / g === 1 ? `$${a / g}$` : `$\\dfrac{${a / g}}{${b / g}}$`; };

export default {
  items: [
    { id: 'cim-r4-01', type: 'nat', level: 2, exams: ['jam'], sub: 'spherical conductors',
      q: R`A thin metal shell of radius $5$ cm carries $+2$ nC. It is surrounded by a concentric earthed metal shell of radius $10$ cm. Taking $1/(4\pi\varepsilon_0) = 9\times10^9$ SI units, the potential of the inner shell is ______ V.`,
      answer: 180, tol: 0.5, unit: 'V', calc: () => 9e9 * 2e-9 * (1 / 0.05 - 1 / 0.1),
      sol: R`The outer shell is at $V = 0$. Between the shells the field is that of the inner charge alone, $E = kQ/r^2$, so the potential difference is $kQ\left(\frac1a - \frac1b\right) = 9\times10^9\times2\times10^{-9}\times(20 - 10) = 180$ V. (The earthed shell carries $-2$ nC on its inner surface and nothing outside.)`,
      trap: R`Using $kQ/a = 360$ V, the value for an isolated shell; the earthed outer shell lowers it.` },
    { id: 'cim-r4-02', type: 'mcq', level: 3, exams: ['jam'], sub: 'charge sharing',
      q: R`A charged metal sphere is joined by a long thin wire to an identical uncharged sphere far away. When the charges settle, the fraction of the original electrostatic energy that has been lost (as heat and radiation in the wire) is`,
      options: [R`zero`, R`$\tfrac14$`, R`$\tfrac12$`, R`$\tfrac34$`], answer: 2,
      sol: R`Identical spheres reach the same potential with equal charges, $Q/2$ each. The energy of a sphere is $\frac{q^2}{2C}$. Before: $\frac{Q^2}{2C}$. After: $2\times\frac{(Q/2)^2}{2C} = \frac{Q^2}{4C}$, half the original. The other half is dissipated while the charge flows, whatever the wire's resistance.`,
      trap: R`Thinking charge conservation also conserves energy; charge flowing through a wire always loses energy.` },
    { id: 'cim-r4-03', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'shielding', format: 'statements',
      q: R`A closed hollow metal box has an empty cavity inside. Which statements are true (electrostatics)?`,
      options: [R`Charges outside the box produce no field anywhere in the empty cavity`, R`If the box is neutral and not earthed, a charge placed in the cavity still produces a field outside the box`, R`If the box is earthed (and there are no outside charges), a charge in the cavity produces no field outside`, R`For a neutral, unearthed box, moving the charge around inside the cavity changes the field outside`],
      answer: [0, 1, 2],
      sol: R`The empty cavity is bounded by one conductor, an equipotential; by uniqueness its potential is constant, so outside charges give no field there. A charge $q$ in the cavity induces $-q$ on the cavity wall and, on a neutral box, $+q$ on the outer surface, which spreads there exactly as if the cavity were empty: it depends only on the outer shape, so moving $q$ inside changes nothing outside. Earthing lets that outer $+q$ drain away, and with no outside charges the outside field vanishes.`,
      trap: R`Shielding works both ways only when the box is earthed.` },
    { id: 'cim-r4-04', type: 'nat', level: 1, exams: ['jam'], sub: 'capacitance',
      q: R`The capacitance of an isolated metal sphere of radius $9.0$ cm in air is ______ pF.`,
      answer: 10, tol: 0.1, unit: 'pF', calc: () => 4 * Math.PI * C.eps0 * 0.09 * 1e12,
      sol: R`For an isolated sphere $V = \frac{Q}{4\pi\varepsilon_0R}$, so $C = 4\pi\varepsilon_0R = \frac{0.090}{9\times10^9} = 1.0\times10^{-11}$ F $= 10$ pF.`,
      trap: R`Using the radius in centimetres.` },
    { id: 'cim-r4-05', type: 'mcq', level: 2, exams: ['jam'], sub: 'induction',
      q: R`A positive charge is held near a neutral metal sphere on an insulating stand. The sphere is touched to earth for a moment, the earth link is removed, and then the positive charge is taken far away. The sphere is now`,
      options: [R`neutral`, R`positively charged, uniformly over its surface`, R`negatively charged, uniformly over its surface`, R`negatively charged, with the charge on the side that faced the positive charge`], answer: 2,
      sol: R`While earthed, the sphere sits at $V = 0$; the nearby positive charge would raise its potential, so electrons flow up from earth and the sphere gains negative charge. Breaking the link traps that charge. Once the outside charge is gone, nothing holds the charge to one side, so it spreads uniformly over the sphere.`,
      trap: R`Thinking earthing always leaves a conductor neutral; with a charge nearby it leaves it charged.` },
    { id: 'cim-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'capacitance',
      q: R`A parallel-plate capacitor has a gap of $4.0$ mm. A flat metal sheet $1.0$ mm thick, the same size as the plates, is slid into the gap parallel to them without touching either. The capacitance becomes ______ times its original value (two decimal places).`,
      answer: 1.33, tol: 0.01, calc: () => 4 / 3,
      sol: R`Inside the metal the field is zero, so the voltage only builds up across the two remaining air gaps, total $d - t = 3.0$ mm, whatever the sheet's position. Thus $C' = \frac{\varepsilon_0A}{d - t}$ and $\frac{C'}{C} = \frac{d}{d - t} = \frac43 = 1.33$.`,
      trap: R`Thinking the answer depends on where the sheet sits; only the total air gap matters.` },
    { id: 'cim-r4-07', type: 'nat', level: 4, exams: ['jam'], sub: 'spherical conductors',
      q: R`A metal sphere of radius $2$ cm carries $1$ nC. It sits at the centre of a thick, uncharged, isolated metal shell with inner radius $4$ cm and outer radius $5$ cm. With $1/(4\pi\varepsilon_0) = 9\times10^9$ SI units, the potential of the inner sphere is ______ V.`,
      answer: 405, tol: 1, unit: 'V', calc: () => 9e9 * 1e-9 * (1 / 0.02 - 1 / 0.04 + 1 / 0.05),
      sol: R`The shell carries $-1$ nC on its inner surface and $+1$ nC on its outer surface. Outside ($r > 5$ cm) the field is $kQ/r^2$, inside the shell's metal it is zero, and in the gap it is $kQ/r^2$ again. Integrating in from infinity: $V = kQ\left(\frac1c + \frac1a - \frac1b\right) = 9\times(20 + 50 - 25) = 405$ V.`,
      trap: R`Dropping the $1/c$ term, as if the shell were earthed (that gives 225 V).` },
    { id: 'cim-r4-08', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'electrostatic pressure',
      q: R`A metal sphere of radius $10$ cm carries $1.0\ \mu$C. Imagine it cut into two hemispheres along a diameter. The electrostatic force pushing the halves apart is ______ N (three decimal places).`,
      answer: 0.112, tol: 0.002, unit: 'N', calc: () => (1e-6) ** 2 / (32 * Math.PI * C.eps0 * 0.01),
      sol: R`Each surface element feels an outward pressure $\frac{\sigma^2}{2\varepsilon_0}$ with $\sigma = \frac{Q}{4\pi R^2}$. Summing the components along the axis of one hemisphere gives pressure times the projected area $\pi R^2$: $F = \frac{\sigma^2}{2\varepsilon_0}\pi R^2 = \frac{Q^2}{32\pi\varepsilon_0R^2}$. With $\frac{1}{4\pi\varepsilon_0} = 8.99\times10^9$: $F = \frac{8.99\times10^9\times10^{-12}}{8\times0.01} = 0.112$ N.`,
      trap: R`Multiplying the pressure by the curved area $2\pi R^2$; only the axial components add up.` },
    { id: 'cim-r4-09', type: 'msq', level: 3, exams: ['jam'], sub: 'earthing', format: 'statements',
      q: R`A metal sphere is connected to earth by a wire while a charged rod is held near it. Which statements are true?`,
      options: [R`The sphere's net charge can be non-zero`, R`The sphere's potential is the same as that of the earth (zero)`, R`The electric field inside the metal of the sphere is zero`, R`All the sphere's charge sits on the side facing away from the rod`],
      answer: [0, 1, 2],
      sol: R`"Earthed" fixes the potential, not the charge: the sphere takes from earth whatever charge makes its potential zero, which is non-zero (opposite to the rod's) when the rod is near. As in any conductor in equilibrium, the field inside the metal is zero. The induced charge gathers mostly on the side facing the rod, attracted by it.`,
      trap: R`Confusing "earthed" with "neutral".` },
    { id: 'cim-r4-10', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'images',
      q: R`A point charge $q$ is held at distance $d$ from a large earthed metal plane. The work needed to pull it slowly out to distance $2d$ is ($k = 1/4\pi\varepsilon_0$)`,
      options: [R`$\dfrac{kq^2}{4d}$`, R`$\dfrac{kq^2}{2d}$`, R`$\dfrac{kq^2}{16d}$`, R`$\dfrac{kq^2}{8d}$`], answer: 3,
      sol: R`The force is the attraction of the image $-q$ at distance $2x$: $F = \frac{kq^2}{4x^2}$. The work against it from $d$ to $2d$ is $\int_d^{2d}\frac{kq^2}{4x^2}dx = \frac{kq^2}{4}\left(\frac1d - \frac1{2d}\right) = \frac{kq^2}{8d}$. Equivalently the system energy is $U(x) = -\frac{kq^2}{4x}$, half the energy of a real pair, because the field exists only on one side of the plane.`,
      trap: R`Using the energy of two real charges, $-kq^2/(2x)$, which doubles the answer.` },
    { id: 'cim-r4-11', type: 'mcq', level: 3, exams: ['jam'], sub: 'capacitance',
      q: R`A spherical capacitor has inner radius $a$ and outer radius $b$, with $C = \dfrac{4\pi\varepsilon_0ab}{b - a}$. Which limiting statement is correct?`,
      options: [R`As $b\to\infty$, $C\to4\pi\varepsilon_0b$`, R`As $b\to a$, $C\to0$`, R`When $b - a = d\ll a$, $C\to\dfrac{\varepsilon_0(4\pi a^2)}{d}$, the parallel-plate result`, R`As $b\to\infty$, $C\to\infty$`], answer: 2,
      sol: R`For $b\to\infty$, $\frac{ab}{b - a}\to a$, so $C\to4\pi\varepsilon_0a$, the isolated sphere. For $b = a + d$ with $d\ll a$, $ab\approx a^2$ and $C\approx\frac{4\pi\varepsilon_0a^2}{d} = \frac{\varepsilon_0A}{d}$ with $A = 4\pi a^2$, the parallel-plate formula. As the gap closes the capacitance grows without bound, not to zero.`,
      trap: R`Thinking a bigger outer shell always means more capacitance; it tends to the finite isolated-sphere value.` },
    { id: 'cim-r4-12', type: 'mcq', level: 2, exams: ['jam'], sub: 'charge distribution',
      q: R`A lightning rod is pointed rather than rounded. At the same potential, a sharp point sends charge into the air more easily than a smooth ball because`,
      options: [R`the potential at the tip is higher than elsewhere on the rod`, R`the surface charge density, and so the field just outside, is largest where the surface curves most sharply`, R`the field inside the metal is not zero at the tip`, R`a point holds less total charge, so it repels the charge into the air`], answer: 1,
      sol: R`The whole conductor is one equipotential. For two joined spheres of radii $r_1$, $r_2$ at the same potential, $\frac{q}{r}$ is the same for each, so $\sigma\propto\frac1r$: the smaller the radius of curvature, the larger $\sigma$ and the field $E = \sigma/\varepsilon_0$. At a sharp tip the field can exceed the breakdown field of air and ionise it (corona discharge).`,
      trap: R`Saying the tip is at a higher potential; the potential is the same everywhere on the conductor, only the field differs.` },
  ],
  gens: [
    { id: 'cim-r4g1', type: 'nat', level: 4, exams: ['jam'], sub: 'spherical conductors',
      make(r) {
        const a = int(r, 1, 4), b = a + int(r, 1, 4), c = b + int(r, 1, 3), Q = int(r, 1, 9), earthed = r() < 0.5;
        const V = 9 * Q * (100 / a - 100 / b + (earthed ? 0 : 100 / c));
        return { q: `A metal sphere of radius $${a}$ cm carries $${Q}$ nC at the centre of a thick concentric metal shell (inner radius $${b}$ cm, outer radius $${c}$ cm) that is ${earthed ? 'earthed' : 'uncharged and isolated'}. With $1/(4\\pi\\varepsilon_0) = 9\\times10^9$ SI units, the potential of the sphere is ______ V (one decimal place).`,
          answer: round(V, 1), tol: Math.max(0.1, round(V * 0.002, 1)), unit: 'V', a, b, c, Q, earthed,
          sol: `The shell's inner surface carries $-${Q}$ nC. ${earthed ? 'Earthed, its outer surface carries nothing and the shell is at $V = 0$, so' : `Isolated and neutral, its outer surface carries $+${Q}$ nC, which puts the shell at $kQ/c$, so`} $V = kQ\\left(\\frac1a - \\frac1b${earthed ? '' : ' + \\frac1c'}\\right) = 9\\times${Q}\\times\\left(${round(100 / a, 3)} - ${round(100 / b, 3)}${earthed ? '' : ` + ${round(100 / c, 3)}`}\\right) = ${round(V, 1)}$ V.`,
          trap: earthed ? 'The earthed shell is at zero: no $1/c$ term.' : 'An isolated shell adds $kQ/c$; only earthing removes it.' };
      },
      verify: (p) => 9 * p.Q * (100 / p.a - 100 / p.b + (p.earthed ? 0 : 100 / p.c)) },
    { id: 'cim-r4g2', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'electrostatic pressure',
      make(r) {
        const byV = r() < 0.5, Rcm = int(r, 5, 30);
        if (byV) {
          const kV = int(r, 5, 60), F = Math.PI * C.eps0 * (kV * 1e3) ** 2 / 2;
          return { q: `A metal sphere of radius $${Rcm}$ cm is held at $${kV}$ kV (relative to infinity). The electrostatic force pushing its two hemispheres apart is ______ mN (three significant figures).`,
            answer: +(F * 1e3).toPrecision(3), tol: +(F * 1e3 * 0.006).toPrecision(2), unit: 'mN', kV, byV,
            sol: `The force between the halves is $F = \\frac{\\sigma^2}{2\\varepsilon_0}\\pi R^2 = \\frac{Q^2}{32\\pi\\varepsilon_0R^2}$. With $Q = 4\\pi\\varepsilon_0RV$ this becomes $F = \\frac{\\pi\\varepsilon_0V^2}{2}$, independent of $R$: $F = \\frac{\\pi\\times8.854\\times10^{-12}\\times(${kV}\\times10^3)^2}{2} = ${+(F * 1e3).toPrecision(3)}$ mN.`,
            trap: 'At fixed potential the radius cancels out.' };
        }
        const Q = int(r, 1, 20) / 10, F = (Q * 1e-6) ** 2 / (32 * Math.PI * C.eps0 * (Rcm / 100) ** 2);
        return { q: `A metal sphere of radius $${Rcm}$ cm carries $${Q}\\ \\mu$C. The electrostatic force pushing its two hemispheres apart is ______ mN (three significant figures).`,
          answer: +(F * 1e3).toPrecision(3), tol: +(F * 1e3 * 0.006).toPrecision(2), unit: 'mN', Q, Rcm, byV,
          sol: `Pressure $\\frac{\\sigma^2}{2\\varepsilon_0}$ times the projected area $\\pi R^2$: $F = \\frac{Q^2}{32\\pi\\varepsilon_0R^2} = \\frac{kQ^2}{8R^2} = \\frac{8.99\\times10^9\\times(${Q}\\times10^{-6})^2}{8\\times${Rcm / 100}^2} = ${+(F * 1e3).toPrecision(3)}$ mN.`,
          trap: 'Use the projected area $\\pi R^2$, not the curved area.' };
      },
      verify: (p) => (p.byV ? Math.PI * C.eps0 * (p.kV * 1e3) ** 2 / 2 : (p.Q * 1e-6) ** 2 / (32 * Math.PI * C.eps0 * (p.Rcm / 100) ** 2)) * 1e3 },
    { id: 'cim-r4g3', type: 'mcq', level: 4, exams: ['jam'], sub: 'charge sharing',
      make(r) {
        const R1 = int(r, 1, 6), R2 = int(r, 1, 6);
        const right = frac(R2, R1 + R2);
        const wrongs = [frac(R1, R1 + R2), frac(R2 * R2, R1 * R1 + R2 * R2), frac(R1 * R1, (R1 + R2) * (R1 + R2)), '$0$', frac(1, 4), frac(1, 2), frac(3, 4)];
        const o = mcqOptions(r, right, wrongs, (s) => s);
        return { q: `A metal sphere of radius $${R1}$ cm carries charge $Q$. It is joined by a thin wire to an uncharged metal sphere of radius $${R2}$ cm far away. The fraction of the original electrostatic energy lost while the charge flows is`, ...o,
          sol: `Capacitances are proportional to the radii ($C = 4\\pi\\varepsilon_0R$). Energy before: $\\frac{Q^2}{2C_1}$. After, the spheres share one potential, so they act as one capacitor $C_1 + C_2$: energy $\\frac{Q^2}{2(C_1 + C_2)}$. The fraction lost is $1 - \\frac{C_1}{C_1 + C_2} = \\frac{C_2}{C_1 + C_2} = \\frac{${R2}}{${R1 + R2}}$, i.e. ${right}.`,
          trap: 'Energy is not conserved when charge flows through a wire; the loss is the share of the capacitance that was empty.' };
      } },
  ],
};
