// Electric potential and capacitance: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EXB = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const exFor = (level, type) => (type === 'mcq' && level <= 3 ? [...EXB[level], 'cuet'] : EXB[level]);
const K = 9e9; const E0 = 8.85e-12; const QE = 1.6e-19; const ME = 9.1e-31;
const S = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const tx = (x, sig = 3) => {
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e4 || a < 1e-2) { const e = Math.floor(Math.log10(a)); let m = +(x / 10 ** e).toPrecision(sig); if (Math.abs(m) >= 10) { m /= 10; return `${+m.toPrecision(sig)}\\times10^{${e + 1}}`; } return `${m}\\times10^{${e}}`; }
  return S(x, sig);
};
let k = 0; let c = 0;
const nid = () => `ep-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: exFor(level, o.type), sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
// numeric mcq: options formatted alike with a unit
const mn = (level, sub, q, correct, wrongs, unit, sol, o = {}) => {
  const f = (v) => `${fmt(v, 3)}${unit ? ' ' + unit : ''}`;
  return mcq(level, sub, q, f(correct), wrongs.map(f), sol, o);
};
const nat = (level, sub, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return base(level, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
};
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
const CONST = r`Take $\dfrac{1}{4\pi\varepsilon_0} = 9\times10^{9}\ \mathrm{N\,m^2\,C^{-2}}$ and $\varepsilon_0 = 8.85\times10^{-12}\ \mathrm{F\,m^{-1}}$.`;
const KC = r`$\dfrac{1}{4\pi\varepsilon_0} = 9\times10^{9}$ SI`;

const items = [
  // ---------- Level 1 ----------
  mcq(1, 'electric potential', r`The SI unit of electric potential, the volt, is the same as`, r`$\mathrm{J\,C^{-1}}$`, [r`$\mathrm{N\,C^{-1}}$`, r`$\mathrm{J\,C}$`, r`$\mathrm{C\,J^{-1}}$`],
    r`Potential is work per unit charge, $V = W/q$, so 1 V = 1 J/C. N/C is the unit of electric field (it equals V/m).`),
  mcq(1, 'potential of a point charge', r`The electric potential at a distance $r$ from a negative point charge $-q$ (zero at infinity) is`, r`negative, equal to $-\dfrac{q}{4\pi\varepsilon_0 r}$`, [r`positive, equal to $+\dfrac{q}{4\pi\varepsilon_0 r}$`, r`zero, because the charge is negative`, r`negative, equal to $-\dfrac{q}{4\pi\varepsilon_0 r^2}$`],
    r`Potential is a scalar and carries the sign of the source charge: $V = \dfrac{1}{4\pi\varepsilon_0}\dfrac{(-q)}{r}$. It falls as $1/r$, not $1/r^2$ (that is the field).`),
  nat(1, 'potential of a point charge', r`Find the potential at 0.3 m from a point charge of $3$ nC (in volts). ${KC}.`, K * 3e-9 / 0.3, 0.5, 1,
    r`$V = \dfrac{kq}{r} = \dfrac{9\times10^{9}\times3\times10^{-9}}{0.3} = 90$ V.`, { unit: 'V' }),
  mcq(1, 'conductors', r`Inside a charged conductor in electrostatic equilibrium the potential is`, 'the same everywhere and equal to its surface value', ['zero', 'highest at the centre', 'decreasing steadily from the surface to the centre'],
    r`The field inside is zero, so $V$ does not change from point to point: the whole conductor is an equipotential. It is not zero in general (a charged sphere at 900 V has 900 V inside too).`, { trap: 'Zero field does not mean zero potential.' }),
  mcq(1, 'equipotential surfaces', r`The electric field at any point of an equipotential surface is`, 'perpendicular to the surface', ['parallel to the surface', 'zero everywhere on it', r`at $45^\circ$ to the surface`],
    r`If the field had a component along the surface, a charge would gain energy when moved along it, so the potential would change. Hence the field is normal to the surface. (It need not be zero: the surface of a point charge's equipotential has non-zero field.)`),
  mcq(1, 'capacitance', r`The capacitance of a parallel plate capacitor does NOT depend on`, 'the charge on the plates', ['the area of the plates', 'the gap between the plates', 'the medium between the plates'],
    r`$C = K\varepsilon_0A/d$ depends only on geometry and the medium. $Q = CV$ changes with the voltage, but $C$ stays the same.`),
  nat(1, 'capacitance', r`A $2\ \mu$F capacitor is connected to a 12 V battery. How much charge does it store (in $\mu$C)?`, 2 * 12, 0.1, 1,
    r`$Q = CV = 2\ \mu\mathrm{F}\times12\ \mathrm{V} = 24\ \mu$C.`, { unit: 'µC' }),
  mcq(1, 'parallel plate capacitor', r`The gap between the plates of an isolated parallel plate capacitor is doubled (same plates and medium). Its capacitance becomes`, 'half', ['double', 'one-fourth', 'unchanged'],
    r`$C = \varepsilon_0A/d$, so $C\propto 1/d$. Doubling $d$ halves $C$.`),
  mcq(1, 'series combination', r`Capacitors $C_1$ and $C_2$ are joined in series. The equivalent capacitance is`, 'smaller than the smaller of the two', [r`equal to $C_1 + C_2$`, 'larger than the larger of the two', 'always the average of the two'],
    r`$\dfrac1C = \dfrac1{C_1}+\dfrac1{C_2}$, so $\dfrac1C$ is bigger than either $\dfrac1{C_1}$ or $\dfrac1{C_2}$ and $C$ is smaller than both. Parallel is the one that adds.`),
  nat(1, 'parallel combination', r`Capacitors of $3\ \mu$F, $5\ \mu$F and $7\ \mu$F are connected in parallel. Find the equivalent capacitance (in $\mu$F).`, 15, 0, 0,
    r`In parallel the capacitances add: $3 + 5 + 7 = 15\ \mu$F.`, { unit: 'µF' }),
  nat(1, 'energy stored', r`A $10\ \mu$F capacitor is charged to 20 V. Find the energy stored (in mJ).`, 0.5 * 10e-6 * 400 * 1e3, 0.01, 2,
    r`$U = \tfrac12CV^2 = \tfrac12\times10\times10^{-6}\times20^2 = 2\times10^{-3}$ J $= 2$ mJ.`, { unit: 'mJ' }),
  mcq(1, 'dielectrics', r`When a dielectric of constant $K$ completely fills the space between the plates of a capacitor, the capacitance becomes`, r`$K$ times the original`, [r`$1/K$ of the original`, r`$K^2$ times the original`, r`unchanged`],
    r`Polarised molecules of the dielectric reduce the field inside, so the same charge needs a smaller voltage: $C = KC_0$, with $K > 1$.`),
  mcq(1, 'work and potential', r`The work done in moving a charge between two points on the same equipotential surface is`, 'zero', ['positive', 'negative', 'dependent on the path'],
    r`$W = q(V_A - V_B)$ and $V_A = V_B$, so $W = 0$ along any path between the two points.`),
  mcq(1, 'electron volt', r`One electron volt (eV) is equal to`, r`$1.6\times10^{-19}$ J`, [r`$1.6\times10^{19}$ J`, r`$9.1\times10^{-31}$ J`, r`$1.6\times10^{-19}$ V`],
    r`It is the energy gained by one electron ($1.6\times10^{-19}$ C) in falling through 1 volt: $1.6\times10^{-19}\times1 = 1.6\times10^{-19}$ J. It is a unit of energy, not of potential.`),
  mcq(1, 'electric dipole', r`The electric potential at any point on the perpendicular bisector (equatorial line) of an electric dipole is`, 'zero', ['maximum', r`proportional to $1/r^2$`, 'negative'],
    r`Every point on the bisector is equally far from $+q$ and $-q$, so the two potentials $\pm\dfrac{kq}{r}$ cancel. The field there is not zero.`, { trap: 'The potential vanishes on the bisector, but the field does not.' }),
  mcq(1, 'field and potential', r`The relation between the electric field and the potential along $x$ is`, r`$E_x = -\dfrac{dV}{dx}$`, [r`$E_x = +\dfrac{dV}{dx}$`, r`$E_x = V\,x$`, r`$E_x = -\int V\,dx$`],
    r`The field points in the direction of fastest fall of potential, so $E_x = -dV/dx$. Its unit is V/m, the same as N/C.`),
  nat(1, 'energy gain in a potential difference', r`An alpha particle (charge $+2e$) is accelerated from rest through a potential difference of 500 V. Find its kinetic energy gained (in eV).`, 2 * 500, 0, 0,
    r`Energy $= qV = 2e\times500\ \mathrm{V} = 1000$ eV. Using eV directly avoids the $1.6\times10^{-19}$ factor.`, { unit: 'eV' }),

  // ---------- Level 2 ----------
  nat(2, 'potential of several charges', r`Charges $+2\ \mu$C and $-4\ \mu$C are 0.6 m apart in air. Find the potential at the midpoint of the line joining them (in kV). ${KC}.`, K * (2e-6 - 4e-6) / 0.3 / 1e3, 0.5, 1,
    r`Each charge is 0.3 m from the midpoint. Add the potentials as scalars, with signs: $V = k\left(\dfrac{2\times10^{-6}}{0.3} + \dfrac{-4\times10^{-6}}{0.3}\right) = 9\times10^{9}\times\dfrac{-2\times10^{-6}}{0.3} = -6\times10^{4}$ V $= -60$ kV.`, { unit: 'kV', trap: 'Potentials add as numbers, with signs; fields add as vectors.' }),
  nat(2, 'potential of several charges', r`Four equal charges of 5 nC sit at the corners of a square of side 0.2 m. Find the potential at the centre of the square (in V). ${KC}.`, 4 * K * 5e-9 / (0.2 / Math.SQRT2), 2, 0,
    r`Each corner is at $r = \dfrac{0.2}{\sqrt2} = 0.1414$ m from the centre. $V = 4\dfrac{kq}{r} = \dfrac{4\times9\times10^{9}\times5\times10^{-9}}{0.1414} = 1273$ V. (The field at the centre is zero, the potential is not.)`, { unit: 'V' }),
  nat(2, 'work and potential', r`A charge of $2\ \mu$C is moved from a point A at 80 V to a point B at $-20$ V. Find the work done BY the electric field (in $\mu$J).`, 2 * (80 - (-20)), 0.5, 1,
    r`$W_{\text{field}} = q(V_A - V_B) = 2\ \mu\mathrm{C}\times(80 + 20)\ \mathrm{V} = 200\ \mu$J. The charge goes from high to low potential, so a positive charge is helped by the field.`, { unit: 'µJ' }),
  nat(2, 'charged particle in a potential difference', r`An electron starts from rest and is accelerated through 200 V. Find its final speed (in units of $10^{6}\ \mathrm{m\,s^{-1}}$, 2 decimals; $e = 1.6\times10^{-19}$ C, $m = 9.1\times10^{-31}$ kg).`, Math.sqrt(2 * QE * 200 / ME) / 1e6, 0.02, 2,
    r`$\tfrac12mv^2 = eV$, so $v = \sqrt{\dfrac{2eV}{m}} = \sqrt{\dfrac{2\times1.6\times10^{-19}\times200}{9.1\times10^{-31}}} = 8.39\times10^{6}\ \mathrm{m\,s^{-1}}$.`, { unit: '×10⁶ m/s' }),
  nat(2, 'potential energy of charges', r`Point charges of $3\ \mu$C and $5\ \mu$C are 0.9 m apart. Find the electric potential energy of the pair (in J). ${KC}.`, K * 3e-6 * 5e-6 / 0.9, 0.002, 3,
    r`$U = \dfrac{kq_1q_2}{r} = \dfrac{9\times10^{9}\times3\times10^{-6}\times5\times10^{-6}}{0.9} = 0.15$ J.`, { unit: 'J' }),
  nat(2, 'potential energy of charges', r`Three identical charges of $2\ \mu$C are placed at the corners of an equilateral triangle of side 0.3 m. Find the electric potential energy of the system (in J).`, 3 * K * 4e-12 / 0.3, 0.002, 3,
    r`There are 3 pairs, each at 0.3 m: $U = 3\dfrac{kq^2}{a} = \dfrac{3\times9\times10^{9}\times(2\times10^{-6})^2}{0.3} = 0.36$ J.`, { unit: 'J' }),
  nat(2, 'ring', r`A thin ring of radius 0.3 m carries a uniform charge of $8\ \mu$C. Find the potential at a point on its axis 0.4 m from the centre (in kV).`, K * 8e-6 / 0.5 / 1e3, 0.5, 1,
    r`Every bit of charge is at the same distance $\sqrt{R^2 + x^2} = \sqrt{0.09 + 0.16} = 0.5$ m, so $V = \dfrac{kQ}{\sqrt{R^2+x^2}} = \dfrac{9\times10^{9}\times8\times10^{-6}}{0.5} = 1.44\times10^{5}$ V $= 144$ kV.`, { unit: 'kV' }),
  nat(2, 'spherical shell', r`A thin conducting shell of radius 0.2 m carries $4\ \mu$C. Find the potential at a point 0.1 m from its centre (in kV).`, K * 4e-6 / 0.2 / 1e3, 0.5, 1,
    r`Inside a shell the potential is constant and equals its surface value: $V = \dfrac{kQ}{R} = \dfrac{9\times10^{9}\times4\times10^{-6}}{0.2} = 1.8\times10^{5}$ V $= 180$ kV. Using $r = 0.1$ m would give 360 kV: wrong.`, { unit: 'kV', trap: 'Inside, V is constant, not kQ/r.' }),
  nat(2, 'parallel plate capacitor', r`A parallel plate capacitor has plates of area $200\ \mathrm{cm^2}$ separated by 2 mm of air. Find its capacitance (in pF). ${CONST}`, E0 * 0.02 / 0.002 * 1e12, 0.2, 1,
    r`$C = \dfrac{\varepsilon_0A}{d} = \dfrac{8.85\times10^{-12}\times0.02}{0.002} = 8.85\times10^{-11}$ F $= 88.5$ pF. (Change $\mathrm{cm^2}$ to $\mathrm{m^2}$: $200\ \mathrm{cm^2} = 0.02\ \mathrm{m^2}$.)`, { unit: 'pF', trap: 'Convert cm² to m² and mm to m.' }),
  nat(2, 'series combination', r`A $3\ \mu$F and a $6\ \mu$F capacitor are connected in series across a 12 V battery. Find the potential difference across the $3\ \mu$F capacitor (in V).`, 12 * 6 / 9, 0.1, 1,
    r`$C_{eq} = \dfrac{3\times6}{9} = 2\ \mu$F, so $Q = 2\times12 = 24\ \mu$C on each. $V_3 = Q/3 = 8$ V (and $V_6 = 4$ V). The smaller capacitor takes the larger share of the voltage.`, { unit: 'V' }),
  nat(2, 'capacitance of a sphere', r`Find the capacitance of an isolated conducting sphere of radius 0.9 m (in pF). ${KC}.`, 0.9 / K * 1e12, 0.5, 1,
    r`$C = 4\pi\varepsilon_0R = \dfrac{R}{k} = \dfrac{0.9}{9\times10^{9}} = 1\times10^{-10}$ F $= 100$ pF.`, { unit: 'pF' }),
  nat(2, 'energy density', r`The electric field in a region of air is $3\times10^{5}\ \mathrm{V\,m^{-1}}$. Find the energy stored per unit volume (in $\mathrm{J\,m^{-3}}$, 2 decimals; $\varepsilon_0 = 8.85\times10^{-12}$).`, 0.5 * E0 * 9e10, 0.01, 2,
    r`$u = \tfrac12\varepsilon_0E^2 = \tfrac12\times8.85\times10^{-12}\times(3\times10^{5})^2 = 0.398\ \mathrm{J\,m^{-3}}\approx0.40$.`, { unit: 'J/m³' }),
  nat(2, 'electric dipole', r`A dipole has charges $\pm2$ nC separated by 1 cm. Find the potential at a point on its axis 10 cm from its centre, on the side of the positive charge (in V; use the small-dipole formula, ${KC}).`, K * 2e-9 * 0.01 / 0.01, 0.5, 1,
    r`$p = 2\times10^{-9}\times0.01 = 2\times10^{-11}$ C m. On the axis $V = \dfrac{kp}{r^2} = \dfrac{9\times10^{9}\times2\times10^{-11}}{(0.1)^2} = 18$ V.`, { unit: 'V' }),
  nat(2, 'field from potential', r`In a region the potential is $V = 5x^2 - 3x$ volts ($x$ in metres). Find the $x$-component of the electric field at $x = 2$ m (in $\mathrm{V\,m^{-1}}$).`, -(10 * 2 - 3), 0.01, 1,
    r`$E_x = -\dfrac{dV}{dx} = -(10x - 3) = -(20 - 3) = -17\ \mathrm{V\,m^{-1}}$. The minus sign tells that the field points along $-x$.`, { unit: 'V/m', trap: 'Keep the minus sign: E = -dV/dx.' }),
  mcq(2, 'capacitor with a battery', r`A parallel plate capacitor stays connected to a battery while the plate separation is doubled. The energy stored becomes`, 'half', ['double', 'four times', 'one-fourth'],
    r`$V$ is fixed by the battery. $C\propto1/d$ halves, so $U = \tfrac12CV^2$ halves. (The battery takes back charge, $Q = CV$ halves.)`),
  mcq(2, 'isolated capacitor', r`A charged parallel plate capacitor is disconnected from the battery and its plate separation is doubled. The energy stored becomes`, 'double', ['half', 'four times', 'unchanged'],
    r`$Q$ is fixed (isolated). $C$ halves, so $U = \dfrac{Q^2}{2C}$ doubles. The extra energy is the work done pulling the plates apart against their attraction.`, { trap: 'Connected: V fixed. Disconnected: Q fixed.' }),
  nat(2, 'RC circuit', r`A resistor of $2\ \mathrm{M\Omega}$ and a capacitor of $5\ \mu$F are connected in series. Find the time constant (in s).`, 2e6 * 5e-6, 0.01, 2,
    r`$\tau = RC = 2\times10^{6}\ \Omega\times5\times10^{-6}\ \mathrm{F} = 10$ s.`, { unit: 's' }),
  mcq(2, 'equipotential surfaces', r`Which statement about equipotential surfaces is correct?`, 'Two equipotential surfaces can never intersect', ['The electric field is parallel to them', 'They are always spheres', 'No work is done in moving a charge from one to another'],
    r`At an intersection the potential would have two different values at the same point: impossible. Option 2 is false because the field is normal to them. Option 3 is false for two different surfaces: $W = q\Delta V\neq0$. They are spheres only for a point charge, planes for a uniform field.`),
  nat(2, 'combination of capacitors', r`Two $2\ \mu$F capacitors in parallel are connected in series with a third $2\ \mu$F capacitor. Find the equivalent capacitance (in $\mu$F, 2 decimals).`, 4 * 2 / 6, 0.01, 2,
    r`The parallel pair gives $4\ \mu$F. In series with $2\ \mu$F: $\dfrac{4\times2}{4+2} = \dfrac43 = 1.33\ \mu$F.`, { unit: 'µF' }),
  nat(2, 'charge sharing', r`A $6\ \mu$F capacitor charged to 100 V is connected, plate to plate (positive to positive), to an uncharged $3\ \mu$F capacitor. Find the common potential difference (in V, 1 decimal).`, 600 / 9, 0.1, 1,
    r`Charge is conserved: $Q = 6\times100 = 600\ \mu$C. The two are now in parallel, $C = 9\ \mu$F, so $V = 600/9 = 66.7$ V.`, { unit: 'V' }),
  mcq(2, 'charged conductors', r`A hollow metal sphere carries a positive charge. Which of these is true?`, 'The field inside is zero but the potential inside equals the surface potential', ['Both the field and the potential inside are zero', 'The potential inside is zero but the field is not', 'The potential inside falls towards the centre'],
    r`No field inside means no potential change, so $V_{\text{inside}} = V_{\text{surface}} = kQ/R\neq0$.`),
  nat(2, 'dielectrics', r`A parallel plate capacitor has $C = 5$ pF in air. It is completely filled with a dielectric of $K = 4$. Find the new capacitance (in pF).`, 20, 0.05, 1,
    r`$C = KC_0 = 4\times5 = 20$ pF.`, { unit: 'pF' }),
  nat(2, 'energy stored', r`A capacitor holds 60 $\mu$C at a potential difference of 30 V. Find the energy stored (in mJ, 2 decimals).`, 0.5 * 60e-6 * 30 * 1e3, 0.01, 2,
    r`$U = \tfrac12QV = \tfrac12\times60\times10^{-6}\times30 = 9\times10^{-4}$ J $= 0.90$ mJ.`, { unit: 'mJ' }),
  nat(2, 'spherical capacitor', r`A conducting sphere of radius 10 cm carries $+2$ nC and is surrounded by a concentric thin shell of radius 20 cm carrying $-2$ nC. Find the potential difference between them (in V). ${KC}.`, K * 2e-9 * (1 / 0.1 - 1 / 0.2), 0.5, 1,
    r`$V = kQ\left(\dfrac1a - \dfrac1b\right) = 9\times10^{9}\times2\times10^{-9}\times(10 - 5) = 90$ V. The inner sphere is at the higher potential.`, { unit: 'V' }),
  mcq(2, 'capacitance of a sphere', r`The capacitance of an isolated conducting sphere is proportional to`, 'its radius', ['its charge', 'its potential', 'its surface area'],
    r`$C = 4\pi\varepsilon_0R$: linear in $R$. $Q = CV$ changes with $V$ but $C$ does not. The area is $4\pi R^2$, which is not linear in $R$.`),
  mcq(2, 'potential and field', r`In a region where the electric field is zero, the potential`, 'is constant', ['must be zero', 'must be positive', 'must change linearly'],
    r`$E = -dV/dx = 0$ means $V$ does not change; its constant value need not be zero.`),
  mn(2, 'work and potential', r`A proton is released from rest in a uniform field and moves through a potential drop of 300 V. Its kinetic energy gained is`, 300, [150, 600, 0.3], 'eV',
    r`Energy gained $= eV = 1\times300 = 300$ eV. Option 2 mixes in joules, and the proton's greater mass does not change the energy gained.`),
  mn(2, 'series combination', r`Three capacitors of $6\ \mu$F each are joined in series. The equivalent capacitance is`, 2, [18, 6, 0.5], 'µF',
    r`$\dfrac1C = \dfrac16\times3 = \dfrac12$, so $C = 2\ \mu$F. 18 is the parallel value.`),
  mn(2, 'electric potential', r`The electric potential at a point at distance $r$ from a point charge is 50 V. At a distance $2r$ the potential is`, 25, [12.5, 100, 50], 'V',
    r`$V\propto1/r$, so doubling $r$ halves $V$: 25 V. The value 12.5 V would be the $1/r^2$ pattern of the field.`),

  // ---------- Level 3 ----------
  nat(3, 'dielectric slab', r`A parallel plate capacitor has plate separation $d = 6$ mm. A slab of dielectric constant $K = 3$ and thickness 3 mm is placed between the plates, parallel to them. Find the ratio of the new capacitance to the capacitance with air only (2 decimals).`, 6 / (6 - 3 + 3 / 3), 0.01, 2,
    r`The slab and the air gap act as two capacitors in series. The effective gap is $d - t + \dfrac tK = 6 - 3 + \dfrac33 = 4$ mm. $\dfrac{C}{C_0} = \dfrac{6}{4} = 1.50$.`, { trap: 'A slab of thickness t shortens the gap by t(1 - 1/K), whatever its position between the plates.' }),
  nat(3, 'dielectric slab', r`A dielectric of $K = 5$ fills exactly half of the area of a parallel plate capacitor, covering the full gap (so the two halves are side by side). Find $C/C_0$.`, (1 + 5) / 2, 0.01, 2,
    r`Side by side means parallel: $C = \dfrac{\varepsilon_0(A/2)}{d} + \dfrac{K\varepsilon_0(A/2)}{d} = C_0\dfrac{1+K}{2} = 3C_0$. The ratio is 3.00.`, { trap: 'Side by side: parallel (add). One behind the other: series.' }),
  nat(3, 'conducting slab', r`A thin metal sheet-like slab of thickness 1.5 mm is inserted between the plates of a parallel plate capacitor with plate separation 4 mm, parallel to the plates and not touching them. Find $C/C_0$ (2 decimals).`, 4 / (4 - 1.5), 0.01, 2,
    r`Inside the metal the field is zero, so only the air gaps of total width $d - t = 2.5$ mm count. $\dfrac{C}{C_0} = \dfrac{d}{d - t} = \dfrac{4}{2.5} = 1.60$. (A conductor acts like $K\to\infty$.)`),
  nat(3, 'energy loss on sharing', r`A $4\ \mu$F capacitor charged to 90 V is connected across an uncharged $5\ \mu$F capacitor. Find the energy lost in the connection (in mJ).`, 0.5 * (4 * 5 / 9) * 1e-6 * 8100 * 1e3, 0.05, 2,
    r`Initial $U_i = \tfrac12\times4\times10^{-6}\times90^2 = 16.2$ mJ. Common voltage $V = \dfrac{4\times90}{9} = 40$ V, final $U_f = \tfrac12\times9\times10^{-6}\times40^2 = 7.2$ mJ. Loss $= 9.0$ mJ. Check: $\dfrac12\dfrac{C_1C_2}{C_1+C_2}V_0^2 = \tfrac12\times\dfrac{20}{9}\times10^{-6}\times8100 = 9$ mJ.`, { unit: 'mJ', trap: 'The energy is not conserved: it goes to heat and radiation in the connecting wire.' }),
  nat(3, 'force between plates', r`The plates of a parallel plate capacitor have area $0.01\ \mathrm{m^2}$ and carry $\pm2\ \mu$C. Find the force of attraction between them (in N). ${CONST}`, 4e-12 / (2 * E0 * 0.01), 0.1, 1,
    r`The field of one plate is $\dfrac{\sigma}{2\varepsilon_0}$, acting on the charge $Q$ of the other: $F = \dfrac{Q^2}{2\varepsilon_0A} = \dfrac{(2\times10^{-6})^2}{2\times8.85\times10^{-12}\times0.01} = 22.6$ N.`, { unit: 'N', trap: 'Use the field of ONE plate, σ/2ε0, not the total field σ/ε0 (that would double the answer).' }),
  nat(3, 'charging a capacitor', r`A $2\ \mu$F capacitor is charged through a $1\ \mathrm{M\Omega}$ resistor from a 100 V battery. Find the charge on it after 2 s (in $\mu$C, 1 decimal).`, 200 * (1 - Math.exp(-1)), 0.2, 1,
    r`$\tau = RC = 2$ s. $q = CV(1 - e^{-t/\tau}) = 200\ \mu\mathrm{C}\times(1 - e^{-1}) = 200\times0.6321 = 126.4\ \mu$C. After one time constant the capacitor holds 63 % of its final charge.`, { unit: 'µC' }),
  nat(3, 'charging a capacitor', r`In the same circuit ($2\ \mu$F, $1\ \mathrm{M\Omega}$, 100 V battery, capacitor initially uncharged) find the current at $t = 4$ s (in $\mu$A, 2 decimals).`, 100 * Math.exp(-2), 0.02, 2,
    r`$I = \dfrac{V}{R}e^{-t/\tau} = 100\ \mu\mathrm{A}\times e^{-4/2} = 100\times0.1353 = 13.53\ \mu$A.`, { unit: 'µA' }),
  nat(3, 'infinite ladder', r`An infinite ladder is made by repeating the section of one $5\ \mu$F capacitor in the upper rail followed by one $5\ \mu$F capacitor across the two rails. Find the equivalent capacitance between the input terminals (in $\mu$F, 2 decimals).`, 5 * (Math.sqrt(5) - 1) / 2, 0.02, 2,
    r`Let the whole ladder be $x$. The rest of the ladder after the first section is again $x$. The shunt $C$ is in parallel with it: $C + x$. That is in series with the first $C$: $x = \dfrac{C(C + x)}{2C + x}$. So $x^2 + Cx - C^2 = 0$ and $x = \dfrac{C(\sqrt5 - 1)}{2} = 0.618\times5 = 3.09\ \mu$F.`, { unit: 'µF' }),
  nat(3, 'bridge of capacitors', r`In a bridge, capacitors of $2\ \mu$F and $4\ \mu$F are in series on the top path A to B to D, and $3\ \mu$F and $6\ \mu$F are in series on the lower path A to C to D. A $10\ \mu$F capacitor joins B to C. Find the equivalent capacitance between A and D (in $\mu$F, 2 decimals).`, (2 * 4) / 6 + (3 * 6) / 9, 0.02, 2,
    r`Check the balance: the ratio $2:4 = 3:6$, so B and C are at the same potential and the $10\ \mu$F capacitor holds no charge; remove it. The two arms are in parallel: $\dfrac{2\times4}{6} + \dfrac{3\times6}{9} = 1.333 + 2 = 3.33\ \mu$F.`, { unit: 'µF', trap: 'The bridge capacitor value is irrelevant when the bridge is balanced.' }),
  nat(3, 'potential of a solid sphere', r`A solid non-conducting sphere of radius 0.3 m carries a uniformly distributed charge of 10 nC. Find the potential at its centre (in V). ${KC}.`, 1.5 * K * 10e-9 / 0.3, 1, 0,
    r`Inside: $V(r) = \dfrac{kQ(3R^2 - r^2)}{2R^3}$. At $r = 0$: $V = \dfrac{3kQ}{2R} = \dfrac{3\times9\times10^{9}\times10^{-8}}{2\times0.3} = 450$ V. This is 1.5 times the surface value $kQ/R = 300$ V.`, { unit: 'V', trap: 'For a non-conducting solid sphere the centre is NOT at the surface potential.' }),
  nat(3, 'self-energy', r`A conducting sphere of radius 0.2 m carries a charge of $2\ \mu$C. Find the electrostatic energy stored in its field (in J, 3 decimals). ${KC}.`, K * 4e-12 / (2 * 0.2), 0.001, 3,
    r`$U = \dfrac{Q^2}{8\pi\varepsilon_0R} = \dfrac{kQ^2}{2R} = \dfrac{9\times10^{9}\times4\times10^{-12}}{0.4} = 0.09$ J. Also $\tfrac12QV = \tfrac12\times2\times10^{-6}\times9\times10^{4} = 0.09$ J.`, { unit: 'J' }),
  nat(3, 'sharing between spheres', r`Two conducting spheres of radii 4 cm and 6 cm are far apart. The smaller carries 10 nC and the larger is uncharged. They are joined by a thin wire. Find the final charge on the larger sphere (in nC).`, 10 * 6 / 10, 0.01, 2,
    r`After joining, both have the same potential: $\dfrac{kQ_1}{r_1} = \dfrac{kQ_2}{r_2}$, so $Q\propto r$. The larger sphere gets $\dfrac{6}{4 + 6}\times10 = 6$ nC.`, { unit: 'nC' }),
  nat(3, 'spherical capacitor', r`A spherical capacitor has an inner sphere of radius 2 cm and an outer shell of radius 3 cm with air between. Find its capacitance (in pF, 1 decimal). ${KC}.`, 0.02 * 0.03 / 0.01 / K * 1e12, 0.2, 1,
    r`$C = 4\pi\varepsilon_0\dfrac{ab}{b-a} = \dfrac1k\cdot\dfrac{ab}{b-a}$. Here $\dfrac{ab}{b-a} = \dfrac{0.02\times0.03}{0.01} = 0.06$ m, so $C = \dfrac{0.06}{9\times10^{9}} = 6.67\times10^{-12}$ F $= 6.7$ pF.`, { unit: 'pF' }),
  mcq(3, 'motion in a field', r`A positive charge is released from rest in an electrostatic field. It will move`, 'towards lower potential, because its potential energy decreases', ['towards higher potential, because the field does work', 'along an equipotential surface', 'towards lower potential only if the field is uniform'],
    r`The force on a positive charge is along $\vec E$, and $\vec E$ points from high to low potential. The charge loses potential energy $qV$ and gains kinetic energy, in any field (uniform or not). It cannot move along an equipotential: the field is perpendicular there.`),
  nat(3, 'electric dipole', r`An electric dipole of moment $4\times10^{-9}$ C m is held at $60^\circ$ to a uniform field of $2\times10^{4}\ \mathrm{N\,C^{-1}}$. Find its potential energy (in $\mu$J).`, -4e-9 * 2e4 * 0.5 * 1e6, 0.5, 1,
    r`$U = -\vec p\cdot\vec E = -pE\cos\theta = -4\times10^{-9}\times2\times10^{4}\times\cos60^\circ = -4\times10^{-5}$ J $= -40\ \mu$J.`, { unit: 'µJ', trap: 'Zero of U is at 90 degrees, so U is negative for angles below 90.' }),
  nat(3, 'capacitor with a battery', r`A $2\ \mu$F capacitor is kept connected to a 50 V battery and a dielectric of $K = 4$ is slipped in to fill the gap. Find the extra charge supplied by the battery (in $\mu$C).`, (4 - 1) * 2 * 50, 0.5, 1,
    r`Before: $Q_0 = 2\times50 = 100\ \mu$C. After: $Q = KC_0V = 400\ \mu$C. The battery supplies $300\ \mu$C.`, { unit: 'µC' }),
  nat(3, 'isolated capacitor with dielectric', r`A $2\ \mu$F capacitor is charged to 50 V, disconnected, and then a dielectric of $K = 4$ is slipped in to fill the gap. Find the work done by the electric field on the slab (in mJ, 3 decimals).`, 0.5 * 2e-6 * 2500 * (1 - 1 / 4) * 1e3, 0.005, 3,
    r`$Q$ is fixed. $U_0 = \tfrac12C_0V_0^2 = 2.5$ mJ. After: $U = U_0/K = 0.625$ mJ. The field pulls the slab in and does work $U_0 - U = 1.875$ mJ.`, { unit: 'mJ' }),
  nat(3, 'potential energy of charges', r`Four equal charges of $1\ \mu$C are placed at the corners of a square of side 0.1 m. Find the electric potential energy of the system (in J, 3 decimals).`, K * 1e-12 * (4 + Math.SQRT2) / 0.1, 0.003, 3,
    r`Pairs: 4 sides at $a$ and 2 diagonals at $a\sqrt2$. $U = kq^2\left(\dfrac4a + \dfrac2{a\sqrt2}\right) = \dfrac{kq^2}{a}(4 + \sqrt2) = \dfrac{9\times10^{9}\times10^{-12}}{0.1}\times5.414 = 0.487$ J.`, { unit: 'J', trap: 'Do not forget the two diagonal pairs.' }),
  nat(3, 'field from potential', r`The potential in a region is $V = 6x - 8y$ volts ($x$ and $y$ in metres). Find the magnitude of the electric field (in $\mathrm{V\,m^{-1}}$).`, Math.hypot(6, 8), 0.01, 1,
    r`$E_x = -\partial V/\partial x = -6$, $E_y = -\partial V/\partial y = +8$. $|E| = \sqrt{36 + 64} = 10\ \mathrm{V\,m^{-1}}$.`, { unit: 'V/m' }),
  mn(3, 'concentric shells', r`A point charge of $+2$ nC is at the centre of an uncharged thin metal shell of radius 0.3 m. The potential of the outer surface of the shell is`, 9e9 * 2e-9 / 0.3, [120, 0, 30], 'V',
    r`The shell becomes $-q$ on the inner face and $+q$ on the outer. The potential on the outer face (and in the whole shell) is $kq/b$. Here $\dfrac{9\times10^{9}\times2\times10^{-9}}{0.3} = 60$ V. The shell's own induced charges add nothing net, so the value does not depend on its thickness. Zero is wrong because a conductor's potential is not zero unless it is earthed.`, { trap: 'Outside the shell it looks like a single charge q at the centre.' }),
  nat(3, 'concentric shells', r`A conducting sphere of radius 5 cm carries 3 nC, and a concentric thin shell of radius 10 cm is uncharged. The two are joined by a wire. Find the change in the potential of the inner sphere (in V; negative if it falls). ${KC}.`, K * 3e-9 / 0.1 - K * 3e-9 / 0.05, 0.5, 1,
    r`Before: $V_{\text{in}} = kQ/a = 9\times10^{9}\times3\times10^{-9}/0.05 = 540$ V (the uncharged shell gets $-3$ nC on its inner face and $+3$ nC on its outer face; being thin, their potentials cancel at the sphere). After: all charge moves to the outer shell, and both are at $kQ/b = 270$ V. Change: $270 - 540 = -270$ V.`, { unit: 'V' }),
  nat(3, 'earthed shell', r`A conducting sphere of radius 5 cm carries 5 nC and is surrounded by a concentric earthed shell of radius 15 cm. Find the potential of the sphere (in V). ${KC}.`, K * 5e-9 * (1 / 0.05 - 1 / 0.15), 1, 0,
    r`The earthed shell is at 0 V and carries $-5$ nC on its inner face. $V = kQ\left(\dfrac1a - \dfrac1b\right) = 9\times10^{9}\times5\times10^{-9}\times(20 - 6.67) = 600$ V.`, { unit: 'V' }),
  nat(3, 'discharging a capacitor', r`A $20\ \mu$F capacitor discharges through a $5\ \mathrm{k\Omega}$ resistor. How long does it take for the voltage to fall to half its starting value (in ms, 1 decimal)?`, 5e3 * 20e-6 * Math.LN2 * 1e3, 0.2, 1,
    r`$\tau = RC = 0.1$ s. $V = V_0e^{-t/\tau} = V_0/2$ gives $t = \tau\ln2 = 0.1\times0.693 = 69.3$ ms.`, { unit: 'ms' }),
  nat(3, 'energy in charging', r`A $10\ \mu$F capacitor is charged from a 200 V battery through a resistor. Find the heat produced in the resistor (in J, 2 decimals).`, 0.5 * 10e-6 * 40000, 0.005, 2,
    r`The battery supplies $QV = CV^2 = 0.4$ J. The capacitor stores $\tfrac12CV^2 = 0.2$ J. The other half, 0.2 J, is heat in the resistor, whatever the resistance.`, { unit: 'J', trap: 'Half of the battery energy is lost, whatever R is.' }),
  nat(3, 'series and parallel energies', r`The same two capacitors, $2\ \mu$F and $6\ \mu$F, are connected to the same battery, first in parallel and then in series. Find (energy stored in parallel) / (energy stored in series), 2 decimals.`, 8 / (12 / 8), 0.02, 2,
    r`At the same $V$, $U = \tfrac12CV^2$ is proportional to $C$. Parallel: $8\ \mu$F. Series: $\dfrac{2\times6}{8} = 1.5\ \mu$F. Ratio $= 8/1.5 = 5.33$.`),
  nat(3, 'motion between plates', r`Two plates 5 cm apart have 400 V between them. Find the acceleration of an electron released in the gap (in units of $10^{15}\ \mathrm{m\,s^{-2}}$, 2 decimals; gravity ignored).`, QE * (400 / 0.05) / ME / 1e15, 0.02, 2,
    r`$E = V/d = 400/0.05 = 8000\ \mathrm{V\,m^{-1}}$. $a = \dfrac{eE}{m} = \dfrac{1.6\times10^{-19}\times8000}{9.1\times10^{-31}} = 1.41\times10^{15}\ \mathrm{m\,s^{-2}}$. Gravity is smaller by a factor of $10^{14}$.`, { unit: '×10¹⁵ m/s²' }),
  nat(3, 'potential of a semicircular wire', r`A thin wire bent into a semicircle of radius 0.27 m carries a uniform charge of 6 nC. Find the potential at its centre of curvature (in V). ${KC}.`, K * 6e-9 / 0.27, 0.5, 1,
    r`Every element of charge is the same distance $R$ from the centre, so $V = \dfrac{kQ}{R} = \dfrac{9\times10^{9}\times6\times10^{-9}}{0.27} = 200$ V. (The field there is not $kQ/R^2$: the pieces point in different directions.)`, { unit: 'V' }),
  mcq(3, 'two connected spheres', r`Two conducting spheres of radii $R_1$ and $R_2 = 2R_1$ are joined by a long thin wire and charged. The ratio of the electric field just outside the smaller to that just outside the larger sphere is`, '2', ['1/2', '4', '1'],
    r`Same potential: $Q\propto R$. Surface field $E = \dfrac{kQ}{R^2}\propto\dfrac1R$. The smaller sphere has twice the field (sharp points have a stronger field, which is how a lightning rod works).`),
  nat(3, 'plates of a capacitor', r`A parallel plate capacitor has plate area $0.04\ \mathrm{m^2}$ and gap 1 mm, and is connected to a 100 V battery. Find the charge on a plate (in nC, 1 decimal). ${CONST}`, E0 * 0.04 / 1e-3 * 100 * 1e9, 0.5, 1,
    r`$C = \dfrac{8.85\times10^{-12}\times0.04}{10^{-3}} = 3.54\times10^{-10}$ F. $Q = CV = 3.54\times10^{-8}$ C $= 35.4$ nC.`, { unit: 'nC' }),
  nat(3, 'equivalent capacitance', r`Find the equivalent capacitance (in $\mu$F) between A and B when three capacitors of $3\ \mu$F each are connected so that two are in series and that pair is in parallel with the third.`, 1.5 + 3, 0.01, 2,
    r`Two $3\ \mu$F in series: $1.5\ \mu$F. In parallel with $3\ \mu$F: $1.5 + 3 = 4.5\ \mu$F.`, { unit: 'µF' }),
  mn(3, 'dielectric partly filling', r`A capacitor of $C_0 = 10$ pF is connected to a 12 V battery. A slab of $K = 3$ is inserted to fill the whole gap while the battery stays connected. The energy stored increases by`, 0.5 * (3 - 1) * 10 * 144, [0.5 * 10 * 144, 0.5 * 3 * 10 * 144, (3 - 1) * 10 * 144 * 2], 'pJ',
    r`$U_i = \tfrac12C_0V^2 = 720$ pJ and $U_f = \tfrac12KC_0V^2 = 2160$ pJ. Increase $= 1440$ pJ. (The battery does twice this work, $\Delta Q\,V = 2880$ pJ; half of it goes to the slab.)`, { trap: 'The battery does more work than the increase in stored energy.' }),

  // ---------- Level 4 ----------
  nat(4, 'charged particle and a ring', r`A thin ring of radius 0.3 m carries $+4\ \mu$C. A particle of mass 1 g and charge $-1\ \mu$C is released from rest on the axis, 0.4 m from the centre. Find its speed on reaching the centre of the ring (in $\mathrm{m\,s^{-1}}$, 2 decimals). ${KC}.`, Math.sqrt(2 * 1e-6 * K * 4e-6 * (1 / 0.3 - 1 / 0.5) / 1e-3), 0.03, 2,
    r`Potential at the start: $V_1 = \dfrac{kQ}{0.5}$; at the centre: $V_2 = \dfrac{kQ}{0.3}$. The negative charge moves towards higher potential and gains $K = q(V_2 - V_1)$ (with $q = 1\ \mu$C): $K = 10^{-6}\times9\times10^{9}\times4\times10^{-6}\times\left(\dfrac1{0.3} - \dfrac1{0.5}\right) = 0.036\times1.333 = 0.048$ J. $v = \sqrt{2K/m} = \sqrt{96} = 9.80\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'The distance to the start is the slant 0.5 m, not 0.4 m.' }),
  nat(4, 'cylindrical capacitor', r`A long cylindrical capacitor has an inner wire of radius 1 mm and a coaxial outer cylinder of radius 4 mm, length 1 m, with air between (end effects ignored). Find its capacitance (in pF, 1 decimal). ${CONST}`, 2 * Math.PI * E0 * 1 / Math.log(4) * 1e12, 0.3, 1,
    r`$C = \dfrac{2\pi\varepsilon_0L}{\ln(b/a)} = \dfrac{2\pi\times8.85\times10^{-12}\times1}{\ln4} = \dfrac{5.56\times10^{-11}}{1.386} = 40.1$ pF.`, { unit: 'pF', trap: 'The log is natural (ln), and b/a is 4.' }),
  nat(4, 'dielectric slab', r`A parallel plate capacitor has plates of area $0.04\ \mathrm{m^2}$ and gap 5 mm. A slab of $K = 6$ and thickness 3 mm is placed inside, parallel to the plates. Find the capacitance (in pF, 1 decimal). ${CONST}`, E0 * 0.04 / ((5 - 3 + 3 / 6) * 1e-3) * 1e12, 0.5, 1,
    r`Effective gap: $d - t + t/K = 5 - 3 + 0.5 = 2.5$ mm. $C = \dfrac{8.85\times10^{-12}\times0.04}{2.5\times10^{-3}} = 1.416\times10^{-10}$ F $= 141.6$ pF.`, { unit: 'pF' }),
  nat(4, 'inserting a slab', r`A capacitor of $C_0 = 50$ pF stays connected to a 100 V battery while a slab of $K = 3$ is pushed in to fill the gap. Find the work done by the electric field on the slab (in $\mu$J, 2 decimals).`, ((3 - 1) * 50e-12 * 1e4 - 0.5 * (3 - 1) * 50e-12 * 1e4) * 1e6, 0.01, 2,
    r`The battery supplies $\Delta Q\,V = (K-1)C_0V^2 = 2\times50\times10^{-12}\times10^{4} = 1.0\ \mu$J. The stored energy rises by $\tfrac12(K-1)C_0V^2 = 0.5\ \mu$J. By energy balance, the field does work $1.0 - 0.5 = 0.5\ \mu$J on the slab.`, { unit: 'µJ' }),
  nat(4, 'work in separating plates', r`The plates of an isolated parallel plate capacitor carry $\pm3\ \mu$C and have area $0.01\ \mathrm{m^2}$. The gap is slowly increased from 1 mm to 3 mm. Find the work done by the external agent (in J, 3 decimals). ${CONST}`, 9e-12 * 0.002 / (2 * E0 * 0.01), 0.002, 3,
    r`The force is constant, $F = \dfrac{Q^2}{2\varepsilon_0A} = \dfrac{9\times10^{-12}}{2\times8.85\times10^{-12}\times0.01} = 50.8$ N. Work $= F\Delta d = 50.8\times0.002 = 0.102$ J. (Also $\Delta U = \dfrac{Q^2}{2}\left(\dfrac1{C_2} - \dfrac1{C_1}\right)$.)`, { unit: 'J' }),
  nat(4, 'redistribution of charge', r`A $2\ \mu$F capacitor charged to 120 V and a $4\ \mu$F capacitor charged to 60 V are joined with like plates together. Find the energy lost (in mJ, 1 decimal).`, (0.5 * 2e-6 * 14400 + 0.5 * 4e-6 * 3600 - 0.5 * 6e-6 * 6400) * 1e3, 0.05, 1,
    r`$Q = 240 + 240 = 480\ \mu$C, $C = 6\ \mu$F, $V = 80$ V. $U_i = \tfrac12(2)(120)^2 + \tfrac12(4)(60)^2 = 14.4 + 7.2 = 21.6$ mJ. $U_f = \tfrac12(6)(80)^2 = 19.2$ mJ. Loss $= 2.4$ mJ. Check: $\tfrac12\dfrac{C_1C_2}{C_1+C_2}(\Delta V)^2 = \tfrac12\times\dfrac{8}{6}\times60^2\times10^{-6} = 2.4$ mJ.`, { unit: 'mJ' }),
  nat(4, 'redistribution of charge', r`A $3\ \mu$F capacitor charged to 100 V and a $2\ \mu$F capacitor charged to 50 V are joined with OPPOSITE plates together (positive to negative). Find the energy lost (in mJ, 1 decimal).`, (0.5 * 3e-6 * 1e4 + 0.5 * 2e-6 * 2500 - 0.5 * 5e-6 * 1600) * 1e3, 0.05, 1,
    r`Net charge $= 300 - 100 = 200\ \mu$C on $5\ \mu$F, so $V = 40$ V. $U_i = 15 + 2.5 = 17.5$ mJ. $U_f = \tfrac12\times5\times10^{-6}\times1600 = 4.0$ mJ. Loss $= 13.5$ mJ. Check: $\tfrac12\dfrac{C_1C_2}{C_1+C_2}(V_1+V_2)^2 = \tfrac12\times1.2\times150^2\times10^{-6} = 13.5$ mJ.`, { unit: 'mJ', trap: 'With opposite plates the voltages add in the loss formula.' }),
  nat(4, 'RC circuit', r`A capacitor charges through a resistor from a battery with time constant 2 s. After how many seconds is the energy stored equal to half of its final value (2 decimals)?`, -2 * Math.log(1 - 1 / Math.SQRT2), 0.02, 2,
    r`$U = \dfrac{q^2}{2C}$ is half of $U_{max}$ when $q = Q/\sqrt2$. $1 - e^{-t/\tau} = 0.7071$, so $e^{-t/\tau} = 0.2929$ and $t = \tau\ln(3.414) = 2\times1.228 = 2.46$ s.`, { unit: 's', trap: 'Half the energy needs 71 % of the charge, not 50 %.' }),
  nat(4, 'potential of a disc', r`A thin disc of radius 0.1 m carries a uniform surface charge density $2\ \mu\mathrm{C\,m^{-2}}$. Find the potential at a point on its axis 0.1 m from the centre (in V, nearest 10; $\varepsilon_0 = 8.85\times10^{-12}$).`, 2e-6 / (2 * E0) * (Math.sqrt(0.02) - 0.1), 15, 0,
    r`$V = \dfrac{\sigma}{2\varepsilon_0}\left(\sqrt{R^2 + x^2} - x\right) = \dfrac{2\times10^{-6}}{2\times8.85\times10^{-12}}(0.1414 - 0.1) = 1.13\times10^{5}\times0.04142 = 4680$ V.`, { unit: 'V' }),
  nat(4, 'electric dipole', r`A small dipole of moment $1.5\times10^{-10}$ C m is at the origin along $+x$. Find the potential at a point 0.3 m from it on a line making $60^\circ$ with the dipole axis (in V, 2 decimals). ${KC}.`, K * 1.5e-10 * 0.5 / 0.09, 0.02, 2,
    r`$V = \dfrac{kp\cos\theta}{r^2} = \dfrac{9\times10^{9}\times1.5\times10^{-10}\times0.5}{0.09} = 7.50$ V.`, { unit: 'V' }),
  nat(4, 'induced charges', r`A neutral, isolated conducting sphere of radius 0.1 m is placed with its centre 0.5 m from a point charge of 6 nC. Find the potential of the sphere (in V). ${KC}.`, K * 6e-9 / 0.5, 0.5, 1,
    r`The induced charges on the sphere add up to zero, so their contribution to the potential at the centre is zero (all of it is at the distance $R$, and $\sum q = 0$). The potential at the centre comes from the outside charge: $\dfrac{kq}{d} = \dfrac{9\times10^{9}\times6\times10^{-9}}{0.5} = 108$ V. A conductor is an equipotential, so this is the potential of the whole sphere.`, { unit: 'V', trap: 'Induced charges cancel at the centre.' }),
  nat(4, 'earthed sphere', r`A point charge of 9 nC is 30 cm from the centre of an earthed conducting sphere of radius 10 cm. Find the charge induced on the sphere (in nC, with sign).`, -9 * 0.1 / 0.3, 0.02, 2,
    r`Earthing keeps the sphere's potential at zero. At its centre: $\dfrac{kq}{d} + \dfrac{kq'}{R} = 0$ (the induced charge lies at distance $R$). $q' = -q\dfrac Rd = -9\times\dfrac{10}{30} = -3$ nC.`, { unit: 'nC' }),
  nat(4, 'expanding shell', r`A thin conducting shell of radius 0.5 m carries $10\ \mu$C. It expands slowly to radius 1.0 m. Find the work done by the electric force (in J, 2 decimals). ${KC}.`, K * 1e-10 / 4 / 0.5, 0.005, 2,
    r`Energy in the field: $U = \dfrac{kQ^2}{2R}$. $U_1 = \dfrac{9\times10^{9}\times10^{-10}}{2\times0.5} = 0.90$ J, $U_2 = 0.45$ J. The field loses 0.45 J, which is the work done by the electric force. (The outward electrostatic pressure on the shell does positive work.)`, { unit: 'J' }),
  nat(4, 'plates with unequal charges', r`Two large parallel plates, each of area $0.01\ \mathrm{m^2}$ and 1 mm apart, carry total charges $+6\ \mu$C and $+2\ \mu$C. Find the potential difference between them (in kV, 1 decimal). ${CONST}`, (6e-6 - 2e-6) / (2 * E0 * 0.01) * 1e-3 * 1e-3, 0.2, 1,
    r`The field between large plates is $E = \dfrac{Q_1 - Q_2}{2\varepsilon_0A} = \dfrac{4\times10^{-6}}{2\times8.85\times10^{-12}\times0.01} = 2.26\times10^{7}\ \mathrm{V\,m^{-1}}$. $V = Ed = 2.26\times10^{7}\times10^{-3} = 2.26\times10^{4}$ V $= 22.6$ kV.`, { unit: 'kV', trap: 'Only the difference of the two charges makes the field between plates.' }),

  // ---------- Level 5 ----------
  nat(5, 'oscillation on a ring axis', r`A fixed ring of radius 0.1 m carries $+2\ \mu$C. A particle of mass 1 g and charge $-0.5\ \mu$C is placed on the axis very close to the centre and released. It oscillates along the axis. Find the period (in ms, 1 decimal). ${KC}.`, 2 * Math.PI * Math.sqrt(1e-3 * 1e-3 / (K * 2e-6 * 0.5e-6)) * 1e3, 0.5, 1,
    r`For small $x$ the axial field of the ring is $E = \dfrac{kQx}{(R^2 + x^2)^{3/2}}\approx\dfrac{kQx}{R^3}$, pointing away from the centre. A negative charge is pulled back: $F = -\dfrac{kQq}{R^3}x$, simple harmonic with $\omega^2 = \dfrac{kQq}{mR^3} = \dfrac{9\times10^{9}\times2\times10^{-6}\times0.5\times10^{-6}}{10^{-3}\times10^{-3}} = 9000\ \mathrm{s^{-2}}$. $T = \dfrac{2\pi}{\omega} = \dfrac{2\pi}{94.9} = 66.2$ ms.`, { unit: 'ms', trap: 'The restoring force is linear only for x much smaller than R.' }),
  nat(5, 'force on a dielectric slab', r`The plates of a parallel plate capacitor are 0.1 m wide and 2 mm apart, with 1000 V across them (battery connected). A dielectric slab of $K = 5$ that fills the gap is partly inside, and is being pulled in by the field. Find the force on it (in mN, 3 decimals). ${CONST}`, 0.5 * 1e6 * E0 * 0.1 * 4 / 0.002 * 1e3, 0.01, 3,
    r`Let $x$ be the length of slab inside, plate width $w$. $C(x) = \dfrac{\varepsilon_0w}{d}\left[L + (K-1)x\right]$. At constant $V$: $F = \tfrac12V^2\dfrac{dC}{dx} = \tfrac12V^2\dfrac{\varepsilon_0w(K-1)}{d} = \tfrac12\times10^{6}\times\dfrac{8.85\times10^{-12}\times0.1\times4}{0.002} = 8.85\times10^{-4}$ N $= 0.885$ mN.`, { unit: 'mN', trap: 'The force does not depend on how far the slab has gone in (edge effects ignored).' }),
  nat(5, 'capacitor bridge', r`Five capacitors form a bridge: A to B is $1\ \mu$F, B to D is $2\ \mu$F, A to C is $3\ \mu$F, C to D is $4\ \mu$F, and B to C is $5\ \mu$F. Find the equivalent capacitance between A and D (in $\mu$F, 2 decimals).`, 170 / 71, 0.01, 2,
    r`Put A at $V$ and D at 0. Capacitors behave like conductances, and the charge at the floating nodes B and C is zero. Node B: $1(V - v_B) = 2v_B + 5(v_B - v_C)$ gives $8v_B - 5v_C = V$. Node C: $3(V - v_C) + 5(v_B - v_C) = 4v_C$ gives $-5v_B + 12v_C = 3V$. Solving: $v_B = \dfrac{27}{71}V$, $v_C = \dfrac{29}{71}V$. Charge leaving A: $Q = 1\left(V - \dfrac{27V}{71}\right) + 3\left(V - \dfrac{29V}{71}\right) = \dfrac{44 + 126}{71}V$. $C_{eq} = \dfrac{170}{71} = 2.39\ \mu$F.`, { unit: 'µF', trap: 'Not a simple series-parallel network; use node equations.' }),
  nat(5, 'concentric shells', r`A conducting sphere of radius 0.1 m carries $+4$ nC. It is surrounded by a concentric thick conducting shell of inner radius 0.2 m and outer radius 0.3 m, which carries no net charge. Find the potential of the inner sphere (in V). ${KC}.`, K * 4e-9 * (1 / 0.1 - 1 / 0.2 + 1 / 0.3), 1, 0,
    r`Charges: $+4$ nC on the sphere, $-4$ nC on the inner face of the shell (0.2 m), $+4$ nC on its outer face (0.3 m). $V = kQ\left(\dfrac1{0.1} - \dfrac1{0.2} + \dfrac1{0.3}\right) = 9\times10^{9}\times4\times10^{-9}\times(10 - 5 + 3.33) = 36\times8.33 = 300$ V.`, { unit: 'V' }),
  nat(5, 'charging with a charged capacitor', r`A $10\ \mu$F capacitor holds $800\ \mu$C and is connected in series with a $100\ \mathrm{k\Omega}$ resistor to a 50 V battery, in the sense that the battery tries to ADD charge of the same sign. After one time constant find the charge on it (in $\mu$C, 1 decimal).`, 500 + 300 * Math.exp(-1), 0.3, 1,
    r`The final charge is $CE = 500\ \mu$C, less than the starting 800, so the capacitor loses charge. $q(t) = CE + (q_0 - CE)e^{-t/\tau}$ with $\tau = RC = 1$ s. At $t = \tau$: $q = 500 + 300e^{-1} = 500 + 110.4 = 610.4\ \mu$C.`, { unit: 'µC', trap: 'The charge falls towards CE; it does not rise.' }),
  nat(5, 'non-uniform charge', r`A sphere of radius 0.1 m has a charge density $\rho = \rho_0\,r/R$ with $\rho_0 = 10^{-6}\ \mathrm{C\,m^{-3}}$. Find the potential difference between its centre and its surface (in V; $\varepsilon_0 = 8.85\times10^{-12}$).`, 1e-6 * 0.01 / (12 * E0), 0.5, 1,
    r`Charge inside radius $r$: $Q(r) = \int_0^r\rho_0\dfrac{r'}{R}4\pi r'^2dr' = \dfrac{\pi\rho_0r^4}{R}$. Gauss: $E = \dfrac{Q(r)}{4\pi\varepsilon_0r^2} = \dfrac{\rho_0r^2}{4\varepsilon_0R}$. $V(0) - V(R) = \int_0^RE\,dr = \dfrac{\rho_0R^2}{12\varepsilon_0} = \dfrac{10^{-6}\times0.01}{12\times8.85\times10^{-12}} = 94.2$ V.`, { unit: 'V' }),
  nat(5, 'oscillating dipole', r`Two small balls of mass 2 g each, with charges $+1\ \mu$C and $-1\ \mu$C, are joined by a light insulating rod of length 0.2 m (centre at the middle) and set in a uniform field $10^{4}\ \mathrm{V\,m^{-1}}$. The dipole is rotated through a small angle and released. Find the period of oscillation (in s, 3 decimals).`, 2 * Math.PI * Math.sqrt(2e-3 * 0.1 / (1e-6 * 1e4)), 0.005, 3,
    r`$p = q\times0.2 = 2\times10^{-7}$ C m. The moment of inertia about the centre: $I = 2m\left(\tfrac{0.2}{2}\right)^2 = 2\times2\times10^{-3}\times0.01 = 4\times10^{-5}\ \mathrm{kg\,m^2}$. For small angles $I\ddot\theta = -pE\theta$, so $T = 2\pi\sqrt{\dfrac{I}{pE}} = 2\pi\sqrt{\dfrac{4\times10^{-5}}{2\times10^{-7}\times10^{4}}} = 2\pi\sqrt{0.02} = 0.889$ s.`, { unit: 's' }),
  nat(5, 'graded dielectric', r`In a parallel plate capacitor of area $0.01\ \mathrm{m^2}$ and gap 1 mm the dielectric constant varies with the distance $x$ from one plate as $K = 2(1 + x/d)$. Find the capacitance (in pF, 1 decimal; $\varepsilon_0 = 8.85\times10^{-12}$).`, E0 * 0.01 * 2 / (1e-3 * Math.LN2) * 1e12, 1, 1,
    r`Thin layers $dx$ are in series: $\dfrac1C = \int_0^d\dfrac{dx}{\varepsilon_0KA} = \dfrac{1}{2\varepsilon_0A}\int_0^d\dfrac{dx}{1 + x/d} = \dfrac{d\ln2}{2\varepsilon_0A}$. $C = \dfrac{2\varepsilon_0A}{d\ln2} = \dfrac{2\times8.85\times10^{-12}\times0.01}{10^{-3}\times0.693} = 255.4$ pF.`, { unit: 'pF', trap: 'Layers across the gap are in series: add 1/C, not C.' }),
  nat(5, 'graded dielectric', r`A dielectric slab with $K = 2(1 + y/L)$ varying along the length $y$ of the plates (from 0 to $L$) completely fills a parallel plate capacitor whose air-filled capacitance is $C_0$. Find $C/C_0$.`, 3, 0.01, 2,
    r`Strips of width $dy$ run across the gap, so they are in parallel: $C = \dfrac{\varepsilon_0w}{d}\int_0^LK\,dy = \dfrac{\varepsilon_0w}{d}\times2\left(L + \dfrac L2\right) = 3\dfrac{\varepsilon_0wL}{d} = 3C_0$.`, { trap: 'Strips along the field direction are parallel, layers across it are in series.' }),

  // ---------- Assertion-Reason ----------
  asrt(2, 'conductors', r`The potential inside a charged hollow conducting sphere is not zero even though the field inside is zero.`, r`The potential inside is constant and equal to the potential of the surface.`, 0,
    r`With no field inside, no work is done in moving a test charge, so $V$ is the same everywhere inside, equal to $kQ/R$. R explains why A holds.`),
  asrt(2, 'series combination', r`Capacitors connected in series carry the same charge.`, r`Capacitors in series have the same potential difference across each.`, 2,
    r`In series, the same current flows for the same time, and the inner plates are joined, so each capacitor holds the same $Q$. The voltages are different: $V = Q/C$. A is true, R is false.`),
  asrt(3, 'conductors', r`The electric field inside a charged conducting shell is zero.`, r`The potential inside a charged conducting shell is constant.`, 1,
    r`Both are true. But the field is zero because of Gauss's law (no charge inside) and the equilibrium of charges in the metal. Constant $V$ is a consequence of $E = 0$, not the reason for it. Option 2.`, { trap: 'A true statement that follows from A is not always its explanation.' }),
  asrt(3, 'sharing of charge', r`Two conducting spheres of different radii joined by a wire share their charge in the ratio of their radii.`, r`On joining, the two spheres come to the same potential.`, 0,
    r`Same potential means $kQ_1/R_1 = kQ_2/R_2$, so $Q_1:Q_2 = R_1:R_2$. R is exactly the reason.`),
  asrt(3, 'potential energy', r`The electric potential energy of a system of two like charges is negative.`, r`Work must be done by an external agent to bring two like charges together from infinity.`, 3,
    r`For like charges $U = kq_1q_2/r > 0$, so A is false. R is true: the repulsion has to be overcome, and that work is stored as positive potential energy.`),
  asrt(3, 'conductors and potential', r`An isolated neutral conductor placed near a positive point charge has a positive potential.`, r`Every neutral conductor has zero potential.`, 2,
    r`Induced charge sums to zero, so the conductor's potential equals the potential due to the outside charge, $kq/d > 0$. R is false: only an earthed conductor is at zero potential.`),
  asrt(4, 'capacitor energy', r`If the plate separation of an isolated charged capacitor is increased, the potential difference across it increases.`, r`The capacitance decreases when the plates are pulled apart while the charge stays constant.`, 0,
    r`$V = Q/C$ with $Q$ fixed, and $C = \varepsilon_0A/d$ falls as $d$ rises, so $V$ rises. R explains A.`),
  asrt(4, 'charging a capacitor', r`A capacitor can be charged to any potential difference by a 10 V battery if enough time is allowed.`, r`When the capacitor is fully charged no current flows in the circuit.`, 3,
    r`The charging stops when the capacitor's voltage equals the battery's 10 V, so A is false. R is true, and it is why the charging stops.`),

  // ---------- Statements ----------
  stm(2, 'Earth as a reference', r`The potential of the Earth is taken as zero.`, r`The Earth is a conductor of very large capacitance, so its potential hardly changes when charge flows to or from it.`, 0,
    r`Both are true, and II is why the Earth makes a good reference.`),
  stm(2, 'series and parallel', r`In a series connection of capacitors the charge on each is the same.`, r`In a parallel connection of capacitors the charge on each is the same.`, 2,
    r`I true. II false: in parallel the potential difference is the same, and the charges are $Q_i = C_iV$.`),
  stm(3, 'series and parallel', r`The equivalent capacitance of capacitors in series is smaller than the smallest.`, r`The equivalent capacitance of capacitors in parallel is larger than the largest.`, 0,
    r`Series: $1/C$ is a sum, so $C$ is smaller than each. Parallel: $C = \sum C_i$ is larger than each. Both are true.`),
  stm(3, 'dielectric', r`A capacitor stays connected to a battery and a dielectric slab fills the gap. The charge on the plates increases.`, r`The same happens if the battery is disconnected before the slab is inserted.`, 2,
    r`I: $V$ fixed and $C\to KC$, so $Q = CV$ increases. II: with the battery removed, $Q$ is fixed; $V$ falls to $V/K$. II is false.`, { trap: 'Connected: V fixed. Disconnected: Q fixed.' }),
  stm(3, 'ring', r`The potential at the centre of a uniformly charged ring is $kQ/R$.`, r`The electric field at the centre of the ring is $kQ/R^2$.`, 2,
    r`I true: all charge is at distance $R$. II false: the field contributions from opposite elements cancel, so $E = 0$ at the centre.`, { trap: 'Scalar sum for V; vector sum for E.' }),
  stm(4, 'solid sphere', r`Inside a uniformly charged non-conducting sphere the potential is constant.`, r`Inside a uniformly charged non-conducting sphere the electric field is zero.`, 1,
    r`Both are false. Inside, $E = \dfrac{kQr}{R^3}$ increases with $r$, and $V = \dfrac{kQ(3R^2 - r^2)}{2R^3}$ changes with $r$. The "zero inside" rule is for a conducting sphere or a thin shell.`),
  stm(4, 'energy loss', r`When two charged capacitors at the same potential difference are joined with like plates together, no energy is lost.`, r`The energy lost on joining is $\dfrac12\dfrac{C_1C_2}{C_1 + C_2}(V_1 - V_2)^2$ for like plates joined.`, 0,
    r`With $V_1 = V_2$ there is no redistribution of charge, so no loss. The formula gives 0. Both true.`),
  stm(5, 'discharge', r`The heat produced while a charged capacitor discharges through a resistor depends on the value of the resistance.`, r`The energy initially stored in the capacitor is $\tfrac12CV^2$.`, 3,
    r`I false: all of the stored energy $\tfrac12CV^2$ ends up as heat, whatever $R$ is ($R$ only changes how fast). II is true.`, { trap: 'R sets the time, not the total heat.' }),

  // ---------- Multi-correct ----------
  msq(3, 'conductors', r`For a charged conducting sphere in equilibrium, which statements are correct?`, [r`The field inside is zero.`, r`The potential inside equals its surface potential.`, r`The potential inside is zero.`, r`The field just outside is $\sigma/\varepsilon_0$.`], [0, 1, 3],
    r`A and B are correct. C is wrong: $V = kQ/R\neq0$. D is the field just outside any conductor surface, $\sigma/\varepsilon_0$.`),
  msq(3, 'capacitor with a battery', r`The plates of a parallel plate capacitor, connected to a battery all the while, are pulled apart. Which are correct?`, [r`The charge on the plates decreases.`, r`The potential difference stays the same.`, r`The energy stored increases.`, r`The electric field between the plates decreases.`], [0, 1, 3],
    r`$V$ fixed. $C\propto1/d$ falls, so $Q = CV$ falls (A) and $U = \tfrac12CV^2$ falls (C is false). $E = V/d$ falls (D).`),
  msq(4, 'isolated capacitor', r`A dielectric slab is slipped between the plates of a charged, isolated capacitor. Which are correct?`, [r`The potential difference decreases.`, r`The charge on the plates stays the same.`, r`The energy stored increases.`, r`The capacitance increases.`], [0, 1, 3],
    r`$Q$ fixed (B). $C$ rises (D) and $V = Q/C$ falls (A). $U = Q^2/2C$ falls, so C is wrong: the slab is pulled in, and the field does work.`),
  msq(4, 'series combination', r`Capacitors of $2\ \mu$F, $3\ \mu$F and $6\ \mu$F are joined in series across 10 V. Which are correct?`, [r`The equivalent capacitance is $1\ \mu$F.`, r`Each carries $10\ \mu$C.`, r`The voltage across the $2\ \mu$F capacitor is 5 V.`, r`The voltage across the $6\ \mu$F capacitor is the largest.`], [0, 1, 2],
    r`$\dfrac1C = \dfrac12 + \dfrac13 + \dfrac16 = 1$, $C = 1\ \mu$F, $Q = 10\ \mu$C each. $V_2 = 10/2 = 5$ V, $V_3 = 3.33$ V, $V_6 = 1.67$ V: the smallest, so D is wrong.`),
  msq(2, 'scalars and vectors', r`Which of these are scalar quantities?`, [r`Electric potential`, r`Electric field`, r`Electric potential energy`, r`Electric dipole moment`], [0, 2],
    r`Potential and potential energy are scalars. The field and the dipole moment are vectors.`),
  msq(5, 'charge sharing', r`A capacitor $C_1$ charged to $V_0$ is connected to an uncharged $C_2$. Which are correct?`, [r`The total charge is conserved.`, r`The total energy is conserved.`, r`The final potential difference is $\dfrac{C_1V_0}{C_1 + C_2}$.`, r`The energy lost is $\dfrac12\dfrac{C_1C_2}{C_1 + C_2}V_0^2$.`], [0, 2, 3],
    r`Charge is conserved (A) and $V = C_1V_0/(C_1+C_2)$ (C). The energy drops (B false), by the amount in D. The loss is a fraction $C_2/(C_1 + C_2)$ of the initial energy.`),
  msq(5, 'RC charging', r`A capacitor charges through a resistor from a battery of emf $\mathcal E$. At $t = \tau = RC$, which are correct?`, [r`$q = 0.63\,C\mathcal E$`, r`$I = 0.37\,\mathcal E/R$`, r`The voltage across the resistor is $0.37\,\mathcal E$`, r`The energy stored is $0.63$ of its final value`], [0, 1, 2],
    r`$q = C\mathcal E(1 - e^{-1}) = 0.63\,C\mathcal E$. $I = (\mathcal E/R)e^{-1}$ and $V_R = \mathcal E e^{-1}$. The energy goes as $q^2$: $0.632^2 = 0.40$ of the final value, so D is wrong.`),
  msq(5, 'electric dipole', r`For a small electric dipole of moment $\vec p$, which statements are correct?`, [r`The potential is zero on the equatorial line.`, r`On the equatorial line the field is along $\vec p$.`, r`On the axis the field is twice the magnitude of the field at the same distance on the equatorial line.`, r`In a uniform field the net force on it is zero.`], [0, 2, 3],
    r`A: yes. B: no, on the equatorial line $\vec E$ is opposite to $\vec p$. C: axis $E = 2kp/r^3$, equator $kp/r^3$. D: equal and opposite forces on the two charges.`),

  // ---------- Concepts, graphs and mixed ----------
  mcq(3, 'conductors', r`Which statement about a conductor in electrostatic equilibrium is NOT correct?`, 'Its potential is always zero', ['The electric field inside it is zero', 'Its surface is an equipotential', 'The field just outside its surface is perpendicular to the surface'],
    r`A conductor is an equipotential, but the value of the potential is generally not zero (only earthing fixes it at zero). The other three are standard properties.`),
  mn(3, 'graph of V against 1/r', r`The potential of a point charge of 4 nC is plotted against $1/r$ (with $r$ in metres). The slope of the straight line is`, 9e9 * 4e-9, [9e9 * 4e-9 * 4e-9, 9e9 / 4e-9, 4e-9 / 9e9], 'V m',
    r`$V = kq\,(1/r)$, so the slope is $kq = 9\times10^{9}\times4\times10^{-9} = 36$ V m (unit: volt-metre).`),
  mcq(3, 'graph of energy', r`For a capacitor, a graph of the stored energy $U$ against the charge $Q$ is`, 'a parabola', ['a straight line through the origin', 'a straight line with negative slope', 'a rectangular hyperbola'],
    r`$U = Q^2/2C$ grows as $Q^2$: a parabola. $U$ against $V$ is also a parabola. $U$ against $C$ at fixed $Q$ would be a hyperbola, which is the likely trap.`, { trap: 'Check which quantity is fixed before choosing a shape.' }),
  nat(3, 'mixed: capacitor in a DC circuit', r`A 10 V battery is connected to a $2\ \mathrm{k\Omega}$ resistor in series with a $3\ \mathrm{k\Omega}$ resistor. A $4\ \mu$F capacitor is connected across the $3\ \mathrm{k\Omega}$ resistor. Find the charge on the capacitor in the steady state (in $\mu$C).`, 4 * 6, 0.1, 1,
    r`In the steady state no current flows through the capacitor. The current in the resistors is $\dfrac{10}{5000} = 2$ mA. The voltage across the $3\ \mathrm{k\Omega}$ resistor is $6$ V, which is also the voltage across the capacitor. $Q = 4\times6 = 24\ \mu$C.`, { unit: 'µC', format: 'numeric', trap: 'A capacitor in steady state is an open circuit: the 4 µF does not change the current.', sub: 'mixed' }),
  nat(3, 'sharing by touching', r`A metal sphere carries $64\ \mu$C. It is touched to an identical uncharged sphere B; then B is touched to an identical uncharged sphere C; then C is touched to an identical uncharged sphere D. Find the charge on D (in $\mu$C).`, 8, 0, 0,
    r`Identical spheres share equally on contact. A and B: 32 each. B and C: 16 each. C and D: 8 each. D carries $8\ \mu$C.`, { unit: 'µC' }),
  nat(4, 'ring of capacitors', r`Four $8\ \mu$F capacitors are joined in a square loop. Find the equivalent capacitance between two adjacent corners (in $\mu$F, 2 decimals).`, 8 + 8 / 3, 0.02, 2,
    r`Between adjacent corners A and B: the capacitor AB directly (8) is in parallel with the other three in series, $\dfrac83 = 2.67$. Total $8 + 2.67 = 10.67\ \mu$F. (Between opposite corners it would be two series pairs in parallel: $4 + 4 = 8\ \mu$F.)`, { unit: 'µF', trap: 'Adjacent and opposite corners give different answers.' }),
  nat(4, 'mixed: electron between plates', r`An electron enters the space between two horizontal plates with a speed of $2\times10^{7}\ \mathrm{m\,s^{-1}}$ along the plates. The plates are 5 cm long and the field between them is $1000\ \mathrm{V\,m^{-1}}$, uniform. Find the sideways deflection when it leaves (in mm, 2 decimals; $e = 1.6\times10^{-19}$, $m = 9.1\times10^{-31}$ kg).`, 0.5 * QE * 1000 / ME * (0.05 / 2e7) ** 2 * 1e3, 0.01, 2,
    r`Horizontally: $t = L/v = 0.05/(2\times10^{7}) = 2.5\times10^{-9}$ s. Vertically: $a = eE/m = 1.76\times10^{14}\ \mathrm{m\,s^{-2}}$. $y = \tfrac12at^2 = \tfrac12\times1.76\times10^{14}\times(2.5\times10^{-9})^2 = 5.5\times10^{-4}$ m $= 0.55$ mm.`, { unit: 'mm', sub: 'mixed' }),
  nat(5, 'cube of capacitors', r`Twelve capacitors of $7\ \mu$F each are placed on the edges of a cube. Find the equivalent capacitance between two ends of one edge (in $\mu$F).`, 12, 0, 0,
    r`Capacitors in a network behave like conductances. A cube of equal resistors $R$ has $\tfrac{7}{12}R$ between the ends of an edge, so conductance $\tfrac{12}{7R}$. In the same way $C_{eq} = \tfrac{12}{7}C = \tfrac{12}{7}\times7 = 12\ \mu$F.`, { unit: 'µF', trap: 'The same symmetry argument as for a resistor cube, but with conductances.' }),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: exFor(2, 'mcq'), sub: 'formulas', group: 'm1',
    q: r`Match each quantity in List I with its expression in List II.`,
    options: ['A-s, B-q, C-p, D-r', 'A-q, B-s, C-p, D-r', 'A-s, B-q, C-r, D-p', 'A-s, B-p, C-q, D-r'], answer: 0,
    sol: r`Potential of a point charge: $kq/r$ (s). Parallel plate capacitance: $\varepsilon_0A/d$ (q). Energy with charge $Q$: $Q^2/2C$ (p). Energy per unit volume: $\tfrac12\varepsilon_0E^2$ (r).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: exFor(3, 'mcq'), sub: 'capacitor operations', group: 'm2',
    q: r`A parallel plate capacitor has a gap $d$ and is filled with air. Match each operation with its effect.`,
    options: ['A-p, B-r, C-q, D-s', 'A-p, B-q, C-r, D-s', 'A-q, B-r, C-p, D-s', 'A-p, B-r, C-s, D-q'], answer: 0,
    sol: r`(A) Battery connected, $d\to2d$: $C$ halves, $V$ fixed, so $Q$ halves (p). (B) Battery connected, slab of $K$ fills the gap: $C\to KC$, $V$ fixed, $U = \tfrac12CV^2$ becomes $K$ times (r). (C) Isolated, $d\to2d$: $C$ halves, $Q$ fixed, $V = Q/C$ doubles (q). (D) Isolated, slab fills the gap: $C\to KC$ and $U = Q^2/2C$ becomes $1/K$ times (s).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: exFor(4, 'mcq'), sub: 'RC circuit', group: 'm3',
    q: r`At the instant $t = RC$ after the switch is closed (an RC circuit), match each quantity with its value.`,
    options: ['A-q, B-p, C-s, D-r', 'A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-q, B-s, C-p, D-r'], answer: 0,
    sol: r`Charging: $q/q_{max} = 1 - e^{-1} = 0.63$ (q). The current is $e^{-1} = 0.37$ of its initial value (p). Discharging: the energy falls as $q^2$, so $e^{-2} = 0.14$ remains (s). Charging: the energy stored is $(0.632)^2 = 0.40$ of the final value (r).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: exFor(3, 'mcq'), sub: 'potential of charge distributions', group: 'm4',
    q: r`A total charge $Q$ is spread over each body of radius $R$. Match each location with the potential there (zero at infinity).`,
    options: ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-q, B-s, C-r, D-p'], answer: 0,
    sol: r`Conducting shell, inside: $kQ/R$ (q). Solid non-conducting sphere, centre: $\dfrac{3kQ}{2R}$ (r). Outside a sphere at $2R$ from the centre: $\dfrac{kQ}{2R}$ (s). Dipole, equatorial point: 0 (p).` },
];
// vary the position of the correct code in match items
items.filter((x) => x.format === 'match').forEach((it, i) => {
  const pos = [2, 0, 3, 1][i]; const a = it.answer; [it.options[a], it.options[pos]] = [it.options[pos], it.options[a]]; it.answer = pos;
});

const groups = {
  m1: { title: 'Quantities and formulas',
    list1: ['A. Potential at distance $r$ from a charge $q$', 'B. Capacitance of a parallel plate capacitor', 'C. Energy stored when the charge is $Q$', 'D. Energy per unit volume in a field $E$'],
    list2: [r`p. $\dfrac{Q^2}{2C}$`, r`q. $\dfrac{\varepsilon_0A}{d}$`, r`r. $\tfrac12\varepsilon_0E^2$`, r`s. $\dfrac{q}{4\pi\varepsilon_0r}$`] },
  m2: { title: 'Operations on a charged capacitor',
    list1: ['A. Battery stays on; the gap is doubled: the charge', 'B. Battery stays on; a slab of constant $K$ fills the gap: the stored energy', 'C. Battery removed; the gap is doubled: the potential difference', 'D. Battery removed; a slab of constant $K$ fills the gap: the stored energy'],
    list2: ['p. becomes half', 'q. becomes double', 'r. becomes $K$ times', 's. becomes $1/K$ times'] },
  m3: { title: 'An RC circuit at $t = RC$',
    list1: ['A. Charging: charge as a fraction of the final charge', 'B. Charging: current as a fraction of the initial current', 'C. Discharging: energy as a fraction of the initial energy', 'D. Charging: energy as a fraction of the final energy'],
    list2: ['p. 0.37', 'q. 0.63', 'r. 0.40', 's. 0.14'] },
  m4: { title: 'Potential at different places',
    list1: ['A. Inside a charged thin conducting shell', 'B. At the centre of a uniformly charged non-conducting sphere', 'C. At distance $2R$ from the centre of a charged sphere', 'D. At a point on the equatorial line of a dipole'],
    list2: ['p. $0$', r`q. $\dfrac{kQ}{R}$`, r`r. $\dfrac{3kQ}{2R}$`, r`s. $\dfrac{kQ}{2R}$`] },
  p1: { title: 'A slab in a capacitor',
    passage: r`<p>A parallel plate capacitor has plates of area $0.02\ \mathrm{m^2}$ and a gap of 4 mm in air. It is connected to a 200 V battery and stays connected. A slab of dielectric constant $K = 4$ and thickness 2 mm is then placed between the plates, parallel to them. Take $\varepsilon_0 = 8.85\times10^{-12}\ \mathrm{F\,m^{-1}}$.</p>` },
  p2: { title: 'A sphere inside a shell',
    passage: r`<p>A conducting sphere of radius 0.05 m carries $+5$ nC. It is at the centre of a thin concentric conducting shell of radius 0.15 m that carries $-2$ nC. Take $\dfrac{1}{4\pi\varepsilon_0} = 9\times10^{9}$ SI.</p>` },
  p3: { title: 'Charging through a resistor',
    passage: r`<p>An uncharged $5\ \mu$F capacitor is connected in series with a $2\ \mathrm{M\Omega}$ resistor and a 20 V battery, and the circuit is closed at $t = 0$.</p>` },
};

const pas = (level, sub, group, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: exFor(level, 'nat'), sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
items.push(
  pas(2, 'capacitance', 'p1', r`Find the capacitance before the slab is inserted (in pF, 2 decimals).`, E0 * 0.02 / 0.004 * 1e12, 0.02, 2,
    r`$C_0 = \dfrac{\varepsilon_0A}{d} = \dfrac{8.85\times10^{-12}\times0.02}{0.004} = 4.425\times10^{-11}$ F $= 44.25$ pF.`, { unit: 'pF' }),
  pas(3, 'dielectric slab', 'p1', r`Find the capacitance with the slab in place (in pF, 1 decimal).`, E0 * 0.02 / 2.5e-3 * 1e12, 0.2, 1,
    r`Effective gap $= d - t + t/K = 4 - 2 + 0.5 = 2.5$ mm. $C = \dfrac{8.85\times10^{-12}\times0.02}{2.5\times10^{-3}} = 70.8$ pF.`, { unit: 'pF' }),
  pas(4, 'capacitor with a battery', 'p1', r`Find the extra charge that flows from the battery when the slab is inserted (in nC, 2 decimals).`, (E0 * 0.02 / 2.5e-3 - E0 * 0.02 / 0.004) * 200 * 1e9, 0.02, 2,
    r`$\Delta Q = (C - C_0)V = (70.8 - 44.25)\ \mathrm{pF}\times200\ \mathrm{V} = 26.55\times10^{-12}\times200 = 5.31\times10^{-9}$ C $= 5.31$ nC.`, { unit: 'nC' }),
  pas(2, 'concentric shells', 'p2', r`Find the potential of the outer shell (in V).`, K * 3e-9 / 0.15, 0.5, 1,
    r`Outside the sphere, only the total charge matters: $5 - 2 = 3$ nC. $V_{shell} = \dfrac{9\times10^{9}\times3\times10^{-9}}{0.15} = 180$ V.`, { unit: 'V' }),
  pas(3, 'concentric shells', 'p2', r`Find the potential of the inner sphere (in V).`, K * 5e-9 / 0.05 + K * (-2e-9) / 0.15, 0.5, 1,
    r`Own charge at distance 0.05 m: $\dfrac{9\times10^{9}\times5\times10^{-9}}{0.05} = 900$ V. The shell's charge adds its constant potential: $\dfrac{9\times10^{9}\times(-2\times10^{-9})}{0.15} = -120$ V. Total $780$ V.`, { unit: 'V' }),
  pas(4, 'concentric shells', 'p2', r`Find the potential difference between the inner sphere and the outer shell (in V).`, K * 5e-9 * (1 / 0.05 - 1 / 0.15), 0.5, 1,
    r`$\Delta V = kQ\left(\dfrac1a - \dfrac1b\right) = 45\times(20 - 6.67) = 600$ V, which is $780 - 180$. The shell's own charge does not change the difference.`, { unit: 'V', trap: 'The outer shell charge shifts both potentials equally.' }),
  pas(2, 'RC circuit', 'p3', r`Find the current immediately after the circuit is closed (in $\mu$A).`, 20 / 2e6 * 1e6, 0.05, 2,
    r`At $t = 0$ the capacitor has no voltage, so $I = \dfrac{V}{R} = \dfrac{20}{2\times10^{6}} = 10\ \mu$A.`, { unit: 'µA' }),
  pas(3, 'RC circuit', 'p3', r`Find the charge on the capacitor at $t = 10$ s (in $\mu$C, 1 decimal).`, 100 * (1 - Math.exp(-1)), 0.2, 1,
    r`$\tau = RC = 10$ s, $Q_{max} = CV = 100\ \mu$C. $q = 100(1 - e^{-1}) = 63.2\ \mu$C.`, { unit: 'µC' }),
  pas(4, 'energy in charging', 'p3', r`Find the total heat produced in the resistor by the time charging is complete (in mJ, 2 decimals).`, 0.5 * 5e-6 * 400 * 1e3, 0.01, 2,
    r`The battery supplies $CV^2 = 2$ mJ, the capacitor keeps $\tfrac12CV^2 = 1$ mJ, so $1.00$ mJ becomes heat.`, { unit: 'mJ' }),
);

const gens = [
  { id: 'ep-g01', type: 'nat', level: 1, exams: exFor(1, 'nat'), sub: 'potential of a point charge',
    make(rng) {
      const q = pick(rng, 2, 9, 1); const d = choose(rng, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]); const V = K * q * 1e-9 / d;
      return { qn: q, d, q: `Find the potential at ${d} m from a point charge of ${q} nC in air (in V; $\\dfrac{1}{4\\pi\\varepsilon_0} = 9\\times10^{9}$ SI).`, answer: +V.toFixed(1), tol: 0.5, unit: 'V',
        sol: r`$V = \dfrac{kq}{r} = \dfrac{9\times10^{9}\times${q}\times10^{-9}}{${d}} = ${S(V)}$ V.`, trap: 'Divide by r, not r squared.' };
    },
    verify: (p) => p.qn * 9 / p.d },
  { id: 'ep-g02', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'potential of several charges',
    make(rng) {
      const q1 = pick(rng, 1, 8, 1); const q2 = -pick(rng, 1, 8, 1); const d1 = choose(rng, [0.1, 0.2, 0.3, 0.5]); const d2 = choose(rng, [0.2, 0.3, 0.4, 0.5]);
      const V = K * 1e-9 * (q1 / d1 + q2 / d2);
      return { q1, q2, d1, d2, q: `A point P is ${d1} m from a charge of ${q1} nC and ${d2} m from a charge of ${q2} nC. Find the potential at P (in V, 1 decimal; $\\dfrac{1}{4\\pi\\varepsilon_0} = 9\\times10^{9}$ SI).`, answer: +V.toFixed(1), tol: 0.2, unit: 'V',
        sol: r`Add the two potentials with their signs: $V = 9\times10^{9}\times10^{-9}\left(\dfrac{${q1}}{${d1}} + \dfrac{(${q2})}{${d2}}\right) = 9\times(${S(q1 / d1)} ${q2 / d2 < 0 ? '-' : '+'} ${S(Math.abs(q2 / d2))}) = ${S(V)}$ V.`, trap: 'The sign of each charge goes into its potential; the angle between the lines does not matter.' };
    },
    verify: (p) => (p.q1 / p.d1 + p.q2 / p.d2) * 9 },
  { id: 'ep-g03', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'potential energy of charges',
    make(rng) {
      const q = pick(rng, 1, 4, 1); const a = choose(rng, [0.1, 0.2, 0.3, 0.5]); const U = 3 * K * (q * 1e-6) ** 2 / a;
      return { q: `Three identical charges of ${q} $\\mu$C sit at the corners of an equilateral triangle of side ${a} m. Find the electric potential energy of the system (in J, 3 decimals).`, qv: q, a, answer: +U.toFixed(3), tol: 0.002, unit: 'J',
        sol: r`There are 3 pairs, each at distance ${a} m: $U = 3\dfrac{kq^2}{a} = \dfrac{3\times9\times10^{9}\times(${q}\times10^{-6})^2}{${a}} = ${S(U, 4)}$ J.`, trap: 'Count three pairs, not two or six.' };
    },
    verify: (p) => { const pairs = [[0, 1], [1, 2], [0, 2]]; return pairs.length * K * (p.qv * 1e-6) ** 2 / p.a; } },
  { id: 'ep-g04', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'charged particle in a potential difference',
    make(rng) {
      const e = choose(rng, ['electron', 'proton']); const m = e === 'electron' ? ME : 1.67e-27;
      const V = e === 'electron' ? choose(rng, [50, 100, 150, 200, 300, 400]) : choose(rng, [500, 1000, 2000, 5000]); const v = Math.sqrt(2 * QE * V / m) / 1e6;
      return { e, V, m, q: `A ${e} starts from rest and is accelerated through ${V} V. Find its final speed (in $10^{6}\\ \\mathrm{m\\,s^{-1}}$, 2 decimals; $e = 1.6\\times10^{-19}$ C, mass ${e === 'electron' ? '$9.1\\times10^{-31}$' : '$1.67\\times10^{-27}$'} kg).`, answer: +v.toFixed(2), tol: 0.02, unit: '×10⁶ m/s',
        sol: r`$\tfrac12mv^2 = eV$, so $v = \sqrt{\dfrac{2eV}{m}} = \sqrt{\dfrac{2\times1.6\times10^{-19}\times${V}}{${e === 'electron' ? '9.1\\times10^{-31}' : '1.67\\times10^{-27}'}}} = ${S(v)}\times10^{6}\ \mathrm{m\,s^{-1}}$.`, trap: 'The energy is eV for both; only the mass differs.' };
    },
    verify: (p) => { const KE = p.V * 1.6e-19; return Math.sqrt(KE / (0.5 * p.m)) / 1e6; } },
  { id: 'ep-g05', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'parallel plate capacitor',
    make(rng) {
      const A = pick(rng, 100, 500, 100); const d = pick(rng, 1, 5, 1); const C = E0 * A * 1e-4 / (d * 1e-3) * 1e12;
      return { A, d, q: `A parallel plate capacitor has plates of area ${A} cm² with an air gap of ${d} mm. Find its capacitance (in pF, 1 decimal; $\\varepsilon_0 = 8.85\\times10^{-12}\\ \\mathrm{F\\,m^{-1}}$).`, answer: +C.toFixed(1), tol: 0.1, unit: 'pF',
        sol: r`Convert: $A = ${A}\times10^{-4}\ \mathrm{m^2}$, $d = ${d}\times10^{-3}$ m. $C = \dfrac{\varepsilon_0A}{d} = \dfrac{8.85\times10^{-12}\times${A * 1e-4}}{${d * 1e-3}} = ${S(C)}$ pF.`, trap: 'cm² to m² is a factor of 10⁻⁴, not 10⁻².' };
    },
    verify: (p) => 0.885 * p.A / p.d },
  { id: 'ep-g06', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'dielectric slab',
    make(rng) {
      const d = choose(rng, [4, 6, 8, 10]); const t = d / 2; const K2 = choose(rng, [2, 3, 4, 5, 6, 8]); const ratio = d / (d - t + t / K2);
      return { d, t, K2, q: `A parallel plate capacitor has a plate gap of ${d} mm. A slab of dielectric constant ${K2} and thickness ${t} mm is placed between the plates, parallel to them. Find $C/C_0$, where $C_0$ is the capacitance with air only (2 decimals).`, answer: +ratio.toFixed(2), tol: 0.01,
        sol: r`The effective gap is $d - t + \dfrac tK = ${d} - ${t} + \dfrac{${t}}{${K2}} = ${S(d - t + t / K2)}$ mm. $\dfrac{C}{C_0} = \dfrac{${d}}{${S(d - t + t / K2)}} = ${ratio.toFixed(2)}$.`, trap: 'Only the slab thickness matters, not where it sits.' };
    },
    verify: (p) => { const cAir = 1 / (p.d - p.t); const cSlab = 1 / (p.t / p.K2); const cTot = 1 / (1 / cAir + 1 / cSlab); return cTot * p.d; } },
  { id: 'ep-g07', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'combination of capacitors',
    make(rng) {
      const C1 = pick(rng, 2, 8, 2); const C2 = pick(rng, 2, 8, 2); const C3 = pick(rng, 3, 9, 3);
      const par = C1 + C2; const Ceq = par * C3 / (par + C3);
      const o = numOpts(rng, Ceq, [C1 + C2 + C3, C1 * C2 * C3 / (C1 * C2 + C2 * C3 + C1 * C3), par * C3 / (par + C3) + 1], 'µF', 3);
      return { C1, C2, C3, ...o, q: `Capacitors of ${C1} µF and ${C2} µF are joined in parallel, and this pair is joined in series with a ${C3} µF capacitor. The equivalent capacitance is`,
        sol: `The parallel pair: ${C1} + ${C2} = ${par} µF. In series with ${C3} µF: $\\dfrac{${par}\\times${C3}}{${par} + ${C3}} = ${fmt(Ceq, 3)}$ µF. Adding all three (${C1 + C2 + C3}) or putting everything in series are the usual wrong answers.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(1 / (1 / (p.C1 + p.C2) + 1 / p.C3), 3)} µF`) },
  { id: 'ep-g08', type: 'nat', level: 1, exams: exFor(1, 'nat'), sub: 'energy stored',
    make(rng) {
      const C = pick(rng, 2, 20, 2); const V = pick(rng, 10, 100, 10); const U = 0.5 * C * 1e-6 * V * V * 1e3;
      return { C, V, q: `A ${C} $\\mu$F capacitor is charged to ${V} V. Find the energy stored (in mJ, 2 decimals).`, answer: +U.toFixed(2), tol: 0.01, unit: 'mJ',
        sol: r`$U = \tfrac12CV^2 = \tfrac12\times${C}\times10^{-6}\times${V}^2 = ${S(U)}\times10^{-3}$ J $= ${S(U)}$ mJ.`, trap: 'Square the voltage.' };
    },
    verify: (p) => 0.5 * (p.C * p.V) * p.V * 1e-3 },
  { id: 'ep-g09', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'sharing of charge',
    make(rng) {
      const C1 = pick(rng, 2, 8, 2); const C2 = pick(rng, 1, 6, 1); const V1 = pick(rng, 40, 200, 20); const V = C1 * V1 / (C1 + C2);
      return { C1, C2, V1, q: `A ${C1} $\\mu$F capacitor charged to ${V1} V is connected, with like plates together, to an uncharged ${C2} $\\mu$F capacitor. Find the common potential difference (in V, 1 decimal).`, answer: +V.toFixed(1), tol: 0.1, unit: 'V',
        sol: r`Charge is conserved: $Q = ${C1}\times${V1} = ${C1 * V1}\ \mu$C. The capacitors are now in parallel: $C = ${C1 + C2}\ \mu$F. $V = \dfrac{${C1 * V1}}{${C1 + C2}} = ${S(V)}$ V.`, trap: 'Voltage is not conserved; charge is.' };
    },
    verify: (p) => { const Q = p.C1 * p.V1; return Q / (p.C1 + p.C2); } },
  { id: 'ep-g10', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'energy loss',
    make(rng) {
      const C1 = pick(rng, 2, 8, 2); const C2 = pick(rng, 2, 8, 2); const V1 = pick(rng, 60, 200, 20); const V2 = pick(rng, 20, 100, 20); const loss = 0.5 * C1 * C2 / (C1 + C2) * (V1 - V2) ** 2 * 1e-3;
      return { C1, C2, V1, V2, q: `Capacitors of ${C1} $\\mu$F at ${V1} V and ${C2} $\\mu$F at ${V2} V are joined with like plates together. Find the energy lost (in mJ, 2 decimals).`, answer: +loss.toFixed(2), tol: 0.01, unit: 'mJ',
        sol: r`Common voltage: $V = \dfrac{${C1}\times${V1} + ${C2}\times${V2}}{${C1 + C2}} = ${S((C1 * V1 + C2 * V2) / (C1 + C2))}$ V. Loss $= \tfrac12\dfrac{C_1C_2}{C_1 + C_2}(V_1 - V_2)^2 = \tfrac12\times${S(C1 * C2 / (C1 + C2))}\times10^{-6}\times${V1 - V2}^2 = ${S(loss)}$ mJ.`, trap: 'The difference of the voltages appears in the loss formula (the sum if opposite plates are joined).' };
    },
    verify: (p) => { const Vc = (p.C1 * p.V1 + p.C2 * p.V2) / (p.C1 + p.C2); const Ui = 0.5 * (p.C1 * p.V1 ** 2 + p.C2 * p.V2 ** 2); const Uf = 0.5 * (p.C1 + p.C2) * Vc * Vc; return (Ui - Uf) * 1e-3; } },
  { id: 'ep-g11', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'capacitance of a sphere',
    make(rng) {
      const R = choose(rng, [9, 18, 27, 36, 45, 90]); const C = R * 1e-2 / K * 1e12;
      return { R, q: `Find the capacitance of an isolated conducting sphere of radius ${R} cm (in pF, 2 decimals; $\\dfrac{1}{4\\pi\\varepsilon_0} = 9\\times10^{9}$ SI).`, answer: +C.toFixed(2), tol: 0.02, unit: 'pF',
        sol: r`$C = 4\pi\varepsilon_0R = \dfrac{R}{k} = \dfrac{${R / 100}}{9\times10^{9}} = ${S(C)}\times10^{-12}$ F $= ${S(C)}$ pF.`, trap: 'Convert cm to m.' };
    },
    verify: (p) => p.R * 10 / 9 },
  { id: 'ep-g12', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'potential of a shell',
    make(rng) {
      const Q = pick(rng, 2, 9, 1); const R = choose(rng, [0.1, 0.2, 0.3, 0.5]); const inside = rng() < 0.5; const rr = inside ? R / 2 : R * 2; const V = K * Q * 1e-9 / (inside ? R : rr);
      const o = numOpts(rng, V, [K * Q * 1e-9 / (inside ? rr : R), 0, K * Q * 1e-9 / (rr * rr)], 'V', 3);
      return { Q, R, inside, rr, ...o, q: `A thin conducting shell of radius ${R} m carries ${Q} nC. The potential at a point ${rr} m from its centre (${inside ? 'inside' : 'outside'} the shell) is ($\\dfrac{1}{4\\pi\\varepsilon_0} = 9\\times10^{9}$ SI)`,
        sol: inside ? `Inside a shell the potential is constant and equal to the surface value $kQ/R = \\dfrac{9\\times10^{9}\\times${Q}\\times10^{-9}}{${R}} = ${fmt(V, 3)}$ V. Using the distance ${rr} m gives a different, wrong, value; zero is the value of the field, not the potential.` : `Outside, the shell behaves like a point charge at its centre: $V = kQ/r = \\dfrac{9\\times10^{9}\\times${Q}\\times10^{-9}}{${rr}} = ${fmt(V, 3)}$ V. The surface value $kQ/R$ is too big, and $kQ/r^2$ is a field-type formula.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(K * p.Q * 1e-9 / (p.inside ? p.R : p.rr), 3)} V`) },
  { id: 'ep-g13', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'ring',
    make(rng) {
      const [R, x] = choose(rng, [[0.3, 0.4], [0.6, 0.8], [0.5, 1.2], [0.15, 0.2], [0.09, 0.12]]); const Q = pick(rng, 1, 9, 1); const rr = Math.hypot(R, x); const V = K * Q * 1e-6 / rr / 1e3;
      return { R, x, Q, q: `A thin ring of radius ${R} m carries a uniform charge of ${Q} $\\mu$C. Find the potential at a point on its axis ${x} m from the centre (in kV, 2 decimals; $\\dfrac{1}{4\\pi\\varepsilon_0} = 9\\times10^{9}$ SI).`, answer: +V.toFixed(2), tol: 0.02, unit: 'kV',
        sol: r`Every element is at distance $\sqrt{R^2 + x^2} = \sqrt{${R}^2 + ${x}^2} = ${S(rr)}$ m. $V = \dfrac{kQ}{\sqrt{R^2 + x^2}} = \dfrac{9\times10^{9}\times${Q}\times10^{-6}}{${S(rr)}} = ${S(V)}$ kV.`, trap: 'The distance is the slant distance, not x.' };
    },
    verify: (p) => { let V = 0; const n = 720; for (let i = 0; i < n; i++) V += K * (p.Q * 1e-6 / n) / Math.sqrt(p.R * p.R + p.x * p.x); return V / 1e3; } },
  { id: 'ep-g14', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'dielectric',
    make(rng) {
      const U0 = pick(rng, 2, 20, 2); const K2 = choose(rng, [2, 3, 4, 5]); const conn = rng() < 0.5; const U1 = conn ? U0 * K2 : U0 / K2;
      const o = numOpts(rng, U1, [conn ? U0 / K2 : U0 * K2, U0, U0 * K2 * K2], 'mJ', 3);
      return { U0, K2, conn, ...o, q: `A capacitor stores ${U0} mJ. A slab of dielectric constant ${K2} is inserted to fill the gap ${conn ? 'while the battery stays connected' : 'after the battery has been disconnected'}. The energy stored becomes`,
        sol: conn ? `The voltage stays fixed and $C\\to${K2}C$, so $U = \\tfrac12CV^2$ becomes ${K2} times: ${fmt(U1, 3)} mJ. Dividing by ${K2} is the isolated-capacitor result.` : `The charge stays fixed and $C\\to${K2}C$, so $U = Q^2/2C$ falls to $1/${K2}$: ${fmt(U1, 3)} mJ. Multiplying would be the battery-connected result.` };
    },
    verify: (p) => p.options.findIndex((o) => o === `${fmt(p.conn ? p.U0 * p.K2 : p.U0 / p.K2, 3)} mJ`) },
  { id: 'ep-g15', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'charging a capacitor',
    make(rng) {
      const R = pick(rng, 1, 5, 1); const C = pick(rng, 2, 10, 2); const V = pick(rng, 10, 100, 10); const n = choose(rng, [0.5, 1, 2, 3]); const tau = R * C; const t = n * tau;
      const q = C * V * (1 - Math.exp(-n));
      return { R, C, V, n, t, q: `An uncharged ${C} $\\mu$F capacitor is charged through a ${R} $\\mathrm{M\\Omega}$ resistor from a ${V} V battery. Find the charge on it after ${t} s (in $\\mu$C, 1 decimal).`, answer: +q.toFixed(1), tol: 0.2, unit: 'µC',
        sol: r`$\tau = RC = ${R}\times10^{6}\times${C}\times10^{-6} = ${tau}$ s, so $t/\tau = ${n}$. $q = CV(1 - e^{-t/\tau}) = ${C * V}\times(1 - e^{-${n}}) = ${C * V}\times${S(1 - Math.exp(-n), 4)} = ${S(q)}\ \mu$C.`, trap: 'Compare t with RC first.' };
    },
    verify: (p) => p.C * p.V - p.C * p.V * Math.exp(-p.t / (p.R * p.C)) },
  { id: 'ep-g16', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'force between plates',
    make(rng) {
      const Q = pick(rng, 1, 4, 1); const A = choose(rng, [100, 200, 400]); const F = (Q * 1e-6) ** 2 / (2 * E0 * A * 1e-4);
      return { Q, A, q: `The plates of a parallel plate capacitor have area ${A} cm² and carry $\\pm${Q}\\ \\mu$C. Find the force between them (in N, 1 decimal; $\\varepsilon_0 = 8.85\\times10^{-12}$ SI).`, answer: +F.toFixed(1), tol: 0.1, unit: 'N',
        sol: r`$F = \dfrac{Q^2}{2\varepsilon_0A} = \dfrac{(${Q}\times10^{-6})^2}{2\times8.85\times10^{-12}\times${A * 1e-4}} = ${S(F)}$ N.`, trap: 'The factor 2 in the denominator: the field of one plate is σ/2ε₀.' };
    },
    verify: (p) => { const sigma = p.Q * 1e-6 / (p.A * 1e-4); return (sigma / (2 * E0)) * p.Q * 1e-6; } },
  { id: 'ep-g17', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'spherical capacitor',
    make(rng) {
      const a = pick(rng, 1, 4, 1); const b = a + pick(rng, 1, 4, 1); const C = (a * b / (b - a)) * 1e-2 / K * 1e12;
      return { a, b, q: `A spherical capacitor has an inner sphere of radius ${a} cm and an outer shell of radius ${b} cm, with air between. Find its capacitance (in pF, 2 decimals; $\\dfrac{1}{4\\pi\\varepsilon_0} = 9\\times10^{9}$ SI).`, answer: +C.toFixed(2), tol: 0.02, unit: 'pF',
        sol: r`$C = 4\pi\varepsilon_0\dfrac{ab}{b - a} = \dfrac{1}{9\times10^{9}}\times\dfrac{${a}\times${b}}{${b - a}}\times10^{-2}$ F $= ${S(C)}$ pF.`, trap: 'b - a, the gap, goes in the denominator.' };
    },
    verify: (p) => { const e0 = 1 / (4 * Math.PI * K); const Qq = 1e-9; const Vdiff = K * Qq * (1 / (p.a * 1e-2) - 1 / (p.b * 1e-2)); return Qq / Vdiff * 1e12; } },
  { id: 'ep-g18', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'cylindrical capacitor',
    make(rng) {
      const ratio = choose(rng, [2, 3, 4, 5, 8]); const a = pick(rng, 1, 3, 1); const b = a * ratio; const L = choose(rng, [0.5, 1, 2]);
      const C = 2 * Math.PI * E0 * L / Math.log(ratio) * 1e12;
      return { a, b, L, ratio, q: `A long coaxial cable section of length ${L} m has an inner conductor of radius ${a} mm and an outer cylinder of radius ${b} mm, with air between. Find its capacitance (in pF, 1 decimal; $\\varepsilon_0 = 8.85\\times10^{-12}$ SI, ends ignored).`, answer: +C.toFixed(1), tol: 0.3, unit: 'pF',
        sol: r`$C = \dfrac{2\pi\varepsilon_0L}{\ln(b/a)} = \dfrac{2\pi\times8.85\times10^{-12}\times${L}}{\ln${ratio}} = \dfrac{${S(2 * Math.PI * E0 * L, 4)}}{${S(Math.log(ratio), 4)}} = ${S(C)}$ pF.`, trap: 'Natural log of the ratio of radii.' };
    },
    verify: (p) => { const lam = 1e-9; const Vd = lam / (2 * Math.PI * E0) * Math.log(p.b / p.a); return lam * p.L / Vd * 1e12; } },
  { id: 'ep-g19', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'field from potential',
    make(rng) {
      const a = int(rng, 2, 9); const b = int(rng, 1, 9); const x0 = int(rng, 1, 4); const E = -(2 * a * x0 + b);
      return { a, b, x0, q: `The potential in a region is $V = ${a}x^2 + ${b}x$ volts, with $x$ in metres. Find the $x$-component of the electric field at $x = ${x0}$ m (in $\\mathrm{V\\,m^{-1}}$).`, answer: E, tol: 0.01, unit: 'V/m',
        sol: r`$E_x = -\dfrac{dV}{dx} = -(${2 * a}x + ${b})$. At $x = ${x0}$: $E_x = -(${2 * a * x0} + ${b}) = ${E}\ \mathrm{V\,m^{-1}}$.`, trap: 'The minus sign.' };
    },
    verify: (p) => { const h = 1e-6; const V = (x) => p.a * x * x + p.b * x; return -(V(p.x0 + h) - V(p.x0 - h)) / (2 * h); } },
  { id: 'ep-g20', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'capacitor with a battery',
    make(rng) {
      const n = choose(rng, [2, 3, 4]); const conn = rng() < 0.5;
      const val = conn ? 1 / n : n; const labels = ['U', 'U'];
      const o = numOpts(rng, val, conn ? [n, 1 / (n * n), n * n] : [1 / n, n * n, 1 / (n * n)], '', 3);
      return { n, conn, ...o, q: `The gap of a parallel plate capacitor is made ${n} times larger ${conn ? 'with the battery kept connected' : 'after the battery has been disconnected'}. The ratio (new energy)/(old energy) is`,
        sol: conn ? `$V$ is fixed. $C\\to C/${n}$, so $U = \\tfrac12CV^2$ is multiplied by $1/${n}$ = ${fmt(1 / n, 3)}.` : `$Q$ is fixed. $C\\to C/${n}$, so $U = Q^2/2C$ is multiplied by ${n}.` };
    },
    verify: (p) => p.options.findIndex((o) => o === fmt(p.conn ? 1 / p.n : p.n, 3)) },
  { id: 'ep-g21', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'energy density',
    make(rng) {
      const V = choose(rng, [100, 200, 500, 1000]); const d = choose(rng, [1, 2, 5, 10]); const E = V / (d * 1e-3); const u = 0.5 * E0 * E * E;
      return { V, d, q: `A potential difference of ${V} V is applied across a gap of ${d} mm of air between two large plates. Find the energy stored per unit volume (in $\\mathrm{J\\,m^{-3}}$, 3 decimals; $\\varepsilon_0 = 8.85\\times10^{-12}$ SI).`, answer: +u.toFixed(3), tol: 0.002, unit: 'J/m³',
        sol: r`$E = V/d = ${V}/${d * 1e-3} = ${tx(E)}\ \mathrm{V\,m^{-1}}$. $u = \tfrac12\varepsilon_0E^2 = \tfrac12\times8.85\times10^{-12}\times(${tx(E)})^2 = ${S(u)}\ \mathrm{J\,m^{-3}}$.`, trap: 'Energy density goes as E squared.' };
    },
    verify: (p) => { const C = E0 * 1 / (p.d * 1e-3); return 0.5 * C * p.V ** 2 / (p.d * 1e-3); } },
  { id: 'ep-g22', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'work and potential',
    make(rng) {
      const Q = choose(rng, [2, 4, 5, 10]); const q = pick(rng, 1, 3, 1); const r1 = choose(rng, [0.1, 0.2, 0.25]); const r2 = choose(rng, [0.4, 0.5, 1]); const W = K * Q * 1e-9 * q * 1e-9 * (1 / r1 - 1 / r2) * 1e6;
      return { Q, qq: q, r1, r2, answer: +W.toFixed(3), tol: 0.003, unit: 'µJ',
        q: `A charge of ${Q} nC is fixed. A charge of ${q} nC is moved slowly from ${r1} m to ${r2} m from it, directly away. Find the work done BY the electric force (in $\\mu$J, 3 decimals; $\\dfrac{1}{4\\pi\\varepsilon_0} = 9\\times10^{9}$ SI).`,
        sol: r`$W = q(V_1 - V_2) = kQq\left(\dfrac1{r_1} - \dfrac1{r_2}\right) = 9\times10^{9}\times${Q}\times10^{-9}\times${q}\times10^{-9}\times(${S(1 / r1)} - ${S(1 / r2)}) = ${S(W)}\ \mu$J. Positive, as the repulsion helps the move.`, trap: 'It is the difference of 1/r values, not 1/(r2 - r1).' };
    },
    verify: (p) => (K * p.Q * 1e-9 * p.qq * 1e-9 / p.r1 - K * p.Q * 1e-9 * p.qq * 1e-9 / p.r2) * 1e6 },
  { id: 'ep-g23', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'discharging a capacitor',
    make(rng) {
      const R = pick(rng, 1, 10, 1); const C = pick(rng, 10, 100, 10); const f = choose(rng, [0.5, 0.25, 0.1]); const t = R * 1e3 * C * 1e-6 * Math.log(1 / f) * 1e3;
      return { R, C, f, q: `A ${C} $\\mu$F capacitor discharges through a ${R} $\\mathrm{k\\Omega}$ resistor. How long does the charge take to fall to ${f} of its initial value (in ms, 1 decimal)?`, answer: +t.toFixed(1), tol: 0.2, unit: 'ms',
        sol: r`$\tau = RC = ${R}\times10^{3}\times${C}\times10^{-6} = ${R * C / 1000}$ s $= ${R * C}$ ms. $q = q_0e^{-t/\tau}$ gives $t = \tau\ln(1/${f}) = ${R * C}\times${S(Math.log(1 / f), 4)} = ${S(t)}$ ms.`, trap: 'Time constant first; the natural log of the inverse fraction.' };
    },
    verify: (p) => -Math.log(p.f) * p.R * p.C },
  { id: 'ep-g24', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'sharing by touching',
    make(rng) {
      const n = int(rng, 2, 5); const m = choose(rng, [1, 3, 5, 7]); const Q = m * 2 ** n;
      return { n, m, q: `A metal sphere carries ${Q} $\\mu$C. It is touched to an identical uncharged sphere, then the second sphere is touched to a third identical uncharged sphere, and so on, until the ${n + 1}th sphere in the chain has been touched. Find the charge on the last sphere (in $\\mu$C).`, answer: m, tol: 0, unit: 'µC',
        sol: r`Each contact halves the charge handed on: ${Q} / 2 repeated ${n} times $= ${Q} / ${2 ** n} = ${m}\ \mu$C.`, trap: 'It is the previous sphere, not the first one, that is touched each time.' };
    },
    verify: (p) => p.m },
];

export default { topic: 'potential-capacitance', groups, items, gens };
