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


// ---------- Expansion (2026-11-22): more hard items, matches, passages and templates ----------
const xs = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const XCUET = true;
const xex = (l, t) => (l <= 2 ? ['keam', 'cusat', 'comedk', 'jee-main', 'neet'] : l === 3 ? ['jee-main', 'neet', 'keam', 'comedk'] : l === 4 ? ['jee-main', 'jee-adv'] : ['jee-adv']).concat(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : []);
let xk = 0; let xc = 0;
const xid = () => `ep-x${String(++xk).padStart(3, '0')}`;
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
const XK = 9e9; const XE0 = 8.85e-12; const XQE = 1.6e-19; const XME = 9.1e-31;
const XKC = r`$\dfrac{1}{4\pi\varepsilon_0} = 9\times10^{9}$ SI`;
const XCONST = r`Take $\varepsilon_0 = 8.85\times10^{-12}\ \mathrm{F\,m^{-1}}$.`;

const xgroups = {
  mx1: { title: 'Three equal capacitors',
    list1: ['A. All three in series', 'B. All three in parallel', 'C. Two in series, and that pair in parallel with the third', 'D. Two in parallel, and that pair in series with the third'],
    list2: [r`p. $\dfrac{C}{3}$`, r`q. $3C$`, r`r. $\dfrac{3C}{2}$`, r`s. $\dfrac{2C}{3}$`, r`t. $\dfrac{C}{2}$`] },
  mx2: { title: 'A slab in a parallel plate capacitor',
    list1: ['A. A thin metal slab of thickness $d/2$ is inserted (gap $d$)', 'B. A slab of $K = 2$ and thickness $d/2$ is inserted', 'C. A slab of $K = 3$ fills the whole gap', 'D. The plate area is doubled and the gap is doubled'],
    list2: [r`p. $C/C_0 = 1$`, r`q. $C/C_0 = \dfrac43$`, r`r. $C/C_0 = 2$`, r`s. $C/C_0 = 3$`, r`t. $C/C_0 = \dfrac32$`] },
  mx3: { title: 'Dipole in a uniform field',
    list1: ['A. Dipole along the field ($\\theta = 0^\\circ$)', 'B. Dipole at $\\theta = 60^\\circ$ to the field', 'C. Dipole at $\\theta = 90^\\circ$ to the field', 'D. Dipole opposite to the field ($\\theta = 180^\\circ$)'],
    list2: [r`p. $U = -pE$`, r`q. $U = -\dfrac{pE}{2}$`, r`r. $U = 0$`, r`s. $U = +pE$`, r`t. $U = +\dfrac{pE}{2}$`] },
  mx4: { title: 'Potential at the centre',
    list1: ['A. A conducting sphere of radius $R$ with charge $Q$, at its surface', 'B. A uniformly charged solid insulating sphere (radius $R$, charge $Q$), at its centre', 'C. A thin ring (radius $R$, charge $Q$), at the point of its axis at distance $R$ from the centre', 'D. A shell of radius $R$ with $+Q$ inside a shell of radius $2R$ with $-Q$, at their common centre'],
    list2: [r`p. $\dfrac{kQ}{R}$`, r`q. $\dfrac{3kQ}{2R}$`, r`r. $\dfrac{kQ}{\sqrt2\,R}$`, r`s. $\dfrac{kQ}{2R}$`] },
  mx5: { title: 'Charging through a resistor',
    list1: ['A. Time at which the charge is half its final value', 'B. Time at which the current is a quarter of its initial value', 'C. Time at which the stored energy is half its final value', 'D. Time at which the capacitor voltage is 90 % of the battery voltage'],
    list2: [r`p. $0.69\,RC$`, r`q. $1.39\,RC$`, r`r. $1.23\,RC$`, r`s. $2.30\,RC$`, r`t. $1.00\,RC$`] },
  mx6: { title: 'A sphere inside a shell',
    list1: ['A. Inner sphere of radius $a$ carries $+Q$; the thin shell of radius $2a$ is uncharged', 'B. Inner sphere $+Q$; the shell carries $-Q$', 'C. Inner sphere $+Q$; the shell carries $+Q$', 'D. Inner sphere $+Q$; the shell carries $+2Q$'],
    list2: [r`p. $V_{\text{inner}} = \dfrac{kQ}{a}$`, r`q. $V_{\text{inner}} = \dfrac{kQ}{2a}$`, r`r. $V_{\text{inner}} = \dfrac{3kQ}{2a}$`, r`s. $V_{\text{inner}} = \dfrac{2kQ}{a}$`, r`t. $V_{\text{inner}} = 0$`] },
  mx7: { title: 'Force between the plates',
    list1: ['A. Isolated capacitor, gap $d\\to2d$: the force between the plates', 'B. Battery connected, gap $d\\to2d$: the force between the plates', 'C. Isolated capacitor, area $A\\to2A$ (same gap): the force', 'D. Battery connected, area $A\\to2A$ (same gap): the force'],
    list2: ['p. becomes $1$ times', 'q. becomes $\\tfrac14$ times', 'r. becomes $2$ times', 's. becomes $\\tfrac12$ times'] },
  mx8: { title: 'Field on the axis of a ring',
    list1: ['A. At the centre of the ring ($x = 0$)', 'B. At $x = R/\\sqrt2$', 'C. At $x = R$', 'D. At $x = 2R$'],
    list2: [r`p. $0$`, r`q. $\dfrac{2}{3\sqrt3}\,\dfrac{kQ}{R^2}$`, r`r. $\dfrac{1}{2\sqrt2}\,\dfrac{kQ}{R^2}$`, r`s. $\dfrac{2}{5\sqrt5}\,\dfrac{kQ}{R^2}$`] },
  px1: { title: 'An electron between deflecting plates',
    passage: r`<p>Two long horizontal plates of length 5.0 cm are 2.0 cm apart with 200 V between them (upper plate positive). An electron enters midway between them, moving parallel to the plates at $3.0\times10^{7}\ \mathrm{m\,s^{-1}}$. Take $e = 1.6\times10^{-19}$ C and $m = 9.1\times10^{-31}$ kg; ignore gravity and edge effects.</p>` },
  px2: { title: 'Sharing charge, then a slab',
    passage: r`<p>A $6\ \mu$F capacitor is charged to 50 V and then joined, with like plates together, to an uncharged $3\ \mu$F capacitor. After they settle, a dielectric slab of $K = 2$ is pushed completely into the $6\ \mu$F capacitor while the two stay connected to each other and to nothing else.</p>` },
};

const xitems = [
  // ---------- Level 2 ----------
  xnat(2, 'series combination', r`A $3\ \mu$F and a $6\ \mu$F capacitor are in series across an 18 V battery. Find the charge on each capacitor (in $\mu$C).`, 36, 0, 0,
    r`Equivalent: $\dfrac{3\times6}{9} = 2\ \mu$F. $Q = CV = 2\times18 = 36\ \mu$C, the same on both in series.`, { unit: 'µC' }),
  xmcq(2, 'units', r`The SI unit of the permittivity of free space, $\varepsilon_0$, can be written as`, r`$\mathrm{F\,m^{-1}}$`, [r`$\mathrm{F\,m}$`, r`$\mathrm{N\,m^{2}\,C^{-2}}$`, r`$\mathrm{C\,V\,m^{-1}}$`],
    r`$C = \varepsilon_0A/d$ gives $\varepsilon_0 = Cd/A$: farad $\times$ metre / metre$^2$ = F/m. The unit $\mathrm{N\,m^2\,C^{-2}}$ belongs to $1/4\pi\varepsilon_0$, not to $\varepsilon_0$.`, { trap: 'k and ε0 have inverse units.' }),
  xnat(2, 'force on a charge', r`The plates of a capacitor are 3.0 cm apart with 120 V across them. Find the force on an electron between them (in units of $10^{-16}$ N, 1 decimal; $e = 1.6\times10^{-19}$ C).`, XQE * (120 / 0.03) * 1e16, 0.05, 1,
    r`$E = V/d = 120/0.03 = 4000\ \mathrm{V\,m^{-1}}$. $F = eE = 1.6\times10^{-19}\times4000 = 6.4\times10^{-16}$ N.`, { unit: '×10⁻¹⁶ N' }),
  xmcq(2, 'equipotential surfaces', r`In a uniform electric field the equipotential surfaces are`, 'planes perpendicular to the field, equally spaced for equal potential steps', ['spheres centred on a point', 'planes parallel to the field', 'planes perpendicular to the field, closer together where the field is weaker'],
    r`$E = -dV/dx$ is constant, so equal steps of $V$ need equal steps of distance along the field, and each surface is normal to the field. Spheres belong to a point charge.`),
  xnat(2, 'combination of capacitors', r`Three $6\ \mu$F capacitors: two are in parallel and this pair is in series with the third. Find the equivalent capacitance (in $\mu$F).`, 12 * 6 / 18, 0, 0,
    r`Pair: $12\ \mu$F. In series with $6\ \mu$F: $\dfrac{12\times6}{18} = 4\ \mu$F.`, { unit: 'µF' }),
  xmcq(2, 'work and potential', r`A $5\ \mu$C charge moves from a point at 30 V to a point at 10 V. The work done by the electric field is`, r`$+100\ \mu\mathrm{J}$`, [r`$-100\ \mu\mathrm{J}$`, r`$+250\ \mu\mathrm{J}$`, r`$+25\ \mu\mathrm{J}$`],
    r`$W_{\text{field}} = q(V_i - V_f) = 5\times(30 - 10) = +100\ \mu$J. A positive charge going to lower potential is helped by the field. The sign would flip if it went the other way.`),

  // ---------- Level 3 ----------
  xnat(3, 'two dielectrics', r`The gap of a parallel plate capacitor is filled by two slabs, one behind the other, each covering the full area: $K_1 = 2$ takes the first half of the gap and $K_2 = 4$ the second half. Find $C/C_0$ (2 decimals).`, 1 / (0.5 / 2 + 0.5 / 4), 0.01, 2,
    r`The slabs are two capacitors in series: $\dfrac{d}{C} \to \dfrac{d/2}{K_1} + \dfrac{d/2}{K_2} = d\left(\dfrac14 + \dfrac18\right) = \dfrac{3d}{8}$. So $C/C_0 = \dfrac{d}{3d/8} = \dfrac83 = 2.67$. (Equal to $\dfrac{2K_1K_2}{K_1+K_2}$.)`, { trap: 'One behind the other: series, not the average of K.' }),
  xnat(3, 'two dielectrics', r`One quarter of the plate area is covered by a dielectric of $K = 2$ and the other three quarters by one of $K = 4$; both fill the full gap, side by side. Find $C/C_0$ (1 decimal).`, 0.25 * 2 + 0.75 * 4, 0.01, 1,
    r`Side by side is parallel, so each part contributes in proportion to its area: $\dfrac{C}{C_0} = \tfrac14\times2 + \tfrac34\times4 = 0.5 + 3 = 3.5$.`),
  xnat(3, 'reversing the battery', r`A $10\ \mu$F capacitor is charged to 100 V by a battery. The battery is then reconnected with its polarity reversed. Find the charge that flows through the battery (in $\mu$C).`, 2 * 10 * 100, 0, 0,
    r`The plate that held $+1000\ \mu$C must now hold $-1000\ \mu$C: the charge that moves is $1000 - (-1000) = 2000\ \mu$C.`, { unit: 'µC', trap: 'The change is 2CV, not CV.' }),
  xnat(3, 'ring on the axis', r`A ring has radius 10 cm. At what distance from its centre, on the axis, is the potential half its value at the centre (in cm, 2 decimals)?`, 10 * Math.sqrt(3), 0.02, 2,
    r`$V(x) = \dfrac{kQ}{\sqrt{R^2+x^2}}$ is half of $\dfrac{kQ}{R}$ when $\sqrt{R^2+x^2} = 2R$, so $x = \sqrt3R = 17.32$ cm.`, { unit: 'cm' }),
  xnat(3, 'deflection', r`An electron enters, parallel to the plates, a region of uniform vertical field $2000\ \mathrm{V\,m^{-1}}$ with speed $1.0\times10^{7}\ \mathrm{m\,s^{-1}}$. The region is 5.0 cm long. Find the sideways deflection on leaving it (in mm, 2 decimals; $e = 1.6\times10^{-19}$ C, $m = 9.1\times10^{-31}$ kg).`, 0.5 * (XQE * 2000 / XME) * (0.05 / 1e7) ** 2 * 1e3, 0.05, 2,
    r`$a = \dfrac{eE}{m} = \dfrac{1.6\times10^{-19}\times2000}{9.1\times10^{-31}} = 3.52\times10^{14}\ \mathrm{m\,s^{-2}}$. Time $t = \dfrac{0.05}{10^{7}} = 5\times10^{-9}$ s. $y = \tfrac12at^2 = 0.5\times3.52\times10^{14}\times25\times10^{-18} = 4.40\times10^{-3}$ m $= 4.40$ mm.`, { unit: 'mm' }),
  xnat(3, 'dipole in a field', r`A dipole of moment $3\times10^{-9}$ C m is lying along a uniform field of $5\times10^{4}\ \mathrm{N\,C^{-1}}$. Find the work needed to turn it through $90^\circ$ (in $\mu$J).`, 3e-9 * 5e4 * 1e6, 0, 0,
    r`$W = U_{90} - U_0 = 0 - (-pE) = pE = 3\times10^{-9}\times5\times10^{4} = 1.5\times10^{-4}$ J $= 150\ \mu$J.`, { unit: 'µJ' }),
  xnat(3, 'working voltage', r`A $2\ \mu$F capacitor (safe up to 400 V) and a $4\ \mu$F capacitor (safe up to 600 V) are joined in series. Find the largest total voltage that can be applied safely (in V).`, 800 / 2 + 800 / 4, 0, 0,
    r`The same charge is on both. The $2\ \mu$F can hold at most $2\times400 = 800\ \mu$C; the $4\ \mu$F could hold $4\times600 = 2400\ \mu$C. So $Q_{max} = 800\ \mu$C. Then $V = \dfrac{800}{2} + \dfrac{800}{4} = 400 + 200 = 600$ V.`, { unit: 'V', trap: 'The voltages add, but the charge is the common limit.' }),
  xnat(3, 'merging drops', r`Sixty-four identical small spherical drops, each at a potential of 3 V, merge into one large drop. Find the potential of the large drop (in V).`, 3 * 16, 0, 0,
    r`Volume is conserved: $R = 4r$. Charge: $Q = 64q$. $V = \dfrac{kQ}{R} = \dfrac{k\,64q}{4r} = 16\dfrac{kq}{r} = 16\times3 = 48$ V.`, { unit: 'V' }),
  xnat(3, 'potential zero on a line', r`Charges $+4\ \mu$C and $-1\ \mu$C are 30 cm apart. On the line through them, outside the segment and near the smaller charge, there is a point where the potential is zero. Find its distance from the $-1\ \mu$C charge (in cm).`, 10, 0, 0,
    r`Let the point be $y$ beyond the $-1\ \mu$C charge. $\dfrac{4}{0.3 + y} = \dfrac{1}{y}$ gives $4y = 0.3 + y$, $y = 0.1$ m $= 10$ cm. (The other zero is 24 cm from the $+4\ \mu$C charge, between them.)`, { unit: 'cm' }),
  xnat(3, 'field from potential', r`In a region $V = 4x^2y$ volts ($x$, $y$ in metres). Find the magnitude of the field at $(1, 2)$ (in $\mathrm{V\,m^{-1}}$, 1 decimal).`, Math.hypot(8 * 1 * 2, 4), 0.05, 1,
    r`$E_x = -\dfrac{\partial V}{\partial x} = -8xy = -16$, $E_y = -\dfrac{\partial V}{\partial y} = -4x^2 = -4$. $|E| = \sqrt{256 + 16} = 16.5\ \mathrm{V\,m^{-1}}$.`, { unit: 'V/m' }),
  xnat(3, 'power in an RC circuit', r`A $2\ \mu$F capacitor charges from a 10 V battery through $50\ \mathrm{k\Omega}$. Find the power dissipated in the resistor at $t = RC$ (in mW, 3 decimals).`, (100 / 50e3) * Math.exp(-2) * 1e3, 0.003, 3,
    r`$I = \dfrac{V}{R}e^{-t/\tau}$, so $P = I^2R = \dfrac{V^2}{R}e^{-2t/\tau}$. At $t = \tau$: $\dfrac{100}{50000}\times e^{-2} = 2\ \mathrm{mW}\times0.1353 = 0.271$ mW.`, { unit: 'mW', trap: 'The power falls as e to the minus 2t/τ, not e to the minus t/τ.' }),
  xmt(3, 'capacitor networks', 'mx1', r`Match each arrangement of three equal capacitors $C$ with its equivalent capacitance.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`(A) series: $C/3$ (p). (B) parallel: $3C$ (q). (C) two in series give $C/2$; parallel with $C$: $\tfrac32C$ (r). (D) two in parallel give $2C$; in series with $C$: $\dfrac{2C\times C}{3C} = \dfrac{2C}{3}$ (s). Option t is not used.`),
  xmt(3, 'slab in a capacitor', 'mx2', r`Match each change with the new capacitance compared with the original air capacitor $C_0$.`, 'A-r, B-q, C-s, D-p', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-s, B-q, C-r, D-p'],
    r`(A) A metal slab of thickness $d/2$ leaves an air gap $d/2$: $C = 2C_0$ (r). (B) Effective gap $\dfrac d2 + \dfrac{d/2}{2} = \dfrac{3d}{4}$: $C = \dfrac43C_0$ (q). (C) $C = 3C_0$ (s). (D) $C\propto A/d$, so doubling both leaves $C_0$ (p).`),
  xmt(3, 'dipole energy', 'mx3', r`A dipole of moment $p$ is in a uniform field $E$ at angle $\theta$ to it. Match each orientation with its potential energy $U = -pE\cos\theta$.`, 'A-p, B-q, C-r, D-s', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-s, B-q, C-r, D-p'],
    r`$\cos0^\circ = 1$ gives $-pE$ (p); $\cos60^\circ = \tfrac12$ gives $-\tfrac{pE}{2}$ (q); $\cos90^\circ = 0$ gives 0 (r); $\cos180^\circ = -1$ gives $+pE$ (s).`),
  xasrt(3, 'capacitance', r`The capacitance of a capacitor does not change when the charge on it is doubled.`, r`The potential difference across a capacitor is directly proportional to the charge on it.`, 0,
    r`$C = Q/V$ is a ratio. If $Q$ doubles, $V$ doubles in the same proportion, so $C$ stays the same (it depends only on shape and medium). R is true and is exactly why A holds.`),
  xstm(3, 'potential and field', r`The potential at a point on the equatorial line of an electric dipole is zero, so the field there is also zero.`, r`The electric field is the negative gradient of the potential.`, 3,
    r`Statement I is false: on the equatorial line the field is $\dfrac{kp}{r^3}$, directed opposite to $\vec p$. The potential is zero only along that line, and the field depends on how $V$ changes in the direction away from it, which is not zero. Statement II is true, which is exactly why a zero value of $V$ at a point does not mean $E = 0$.`),
  xmcq(3, 'conductors', r`Which of these is NOT correct for a charged conductor in electrostatic equilibrium?`, 'The charge on a cavity wall is zero if the cavity has a charge inside it', ['The potential is the same at all points of the conductor', 'The field just outside the surface is perpendicular to it', 'Any excess charge lies on the outer surface if the cavity is empty'],
    r`If a charge $+q$ sits inside a cavity, the cavity wall carries $-q$ to cancel its field in the metal, so the first option is the false one. The other three statements are standard properties.`, { trap: 'Read the NOT: three true statements and one false.' }),

  // ---------- Level 4 ----------
  xnat(4, 'earthed shell', r`A thin shell of radius 0.2 m carries $+8$ nC. Inside it, concentric, is a small conducting sphere of radius 0.1 m which is earthed. Find the charge induced on the small sphere (in nC, with sign).`, -8 * 0.1 / 0.2, 0, 0,
    r`Earthed, so its potential is zero: $k\left(\dfrac{q}{0.1} + \dfrac{8}{0.2}\right) = 0$, $q = -8\times\dfrac{0.1}{0.2} = -4$ nC.`, { unit: 'nC' }),
  xnat(4, 'escape of a charge', r`A conducting sphere of radius 0.1 m carries $+10\ \mu$C. A particle of mass 2 g and charge $+1\ \mu$C is released at its surface. Find its speed very far away (in $\mathrm{m\,s^{-1}}$). ${XKC}.`, Math.sqrt(2 * XK * 1e-5 * 1e-6 / 0.1 / 2e-3), 0, 0,
    r`Energy: $\tfrac12mv^2 = \dfrac{kQq}{R} = \dfrac{9\times10^{9}\times10^{-5}\times10^{-6}}{0.1} = 0.9$ J. $v = \sqrt{\dfrac{2\times0.9}{0.002}} = \sqrt{900} = 30\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  xnat(4, 'closest approach', r`An alpha particle (charge $+2e$) of kinetic energy 5.0 MeV is fired straight at a gold nucleus ($Z = 79$), which is fixed. Find the distance of closest approach (in fm, 1 decimal). ${XKC}, $e = 1.6\times10^{-19}$ C, 1 MeV $= 1.6\times10^{-13}$ J.`, XK * 2 * 79 * XQE ** 2 / (5 * 1.6e-13) * 1e15, 0.5, 1,
    r`At closest approach all the kinetic energy has become electrostatic energy: $\dfrac{k(2e)(79e)}{d} = 5$ MeV. $d = \dfrac{9\times10^{9}\times158\times(1.6\times10^{-19})^2}{8\times10^{-13}} = 4.55\times10^{-14}$ m $= 45.5$ fm.`, { unit: 'fm' }),
  xnat(4, 'zero field, non-zero potential', r`Charges $+9\ \mu$C and $+4\ \mu$C are 0.5 m apart. At the point on the line between them where the field is zero, find the potential (in kV). ${XKC}.`, XK * (9e-6 / 0.3 + 4e-6 / 0.2) / 1e3, 0, 0,
    r`Zero field: $\dfrac{9}{x^2} = \dfrac{4}{(0.5-x)^2}$ gives $3(0.5 - x) = 2x$, $x = 0.3$ m from the $9\ \mu$C charge (0.2 m from the other). $V = 9\times10^{9}\left(\dfrac{9\times10^{-6}}{0.3} + \dfrac{4\times10^{-6}}{0.2}\right) = 9\times10^{9}\times5\times10^{-5} = 4.5\times10^{5}$ V $= 450$ kV.`, { unit: 'kV', trap: 'Zero field does not mean zero potential.' }),
  xnat(4, 'potential energy of charges', r`Charges $+q, -q, +q, -q$ are placed in order at the corners of a square of side 0.2 m, $q = 2\ \mu$C. Find the electric potential energy of the system (in J, 2 decimals). ${XKC}.`, XK * 4e-12 / 0.2 * (-4 + 2 / Math.SQRT2), 0.005, 2,
    r`Four adjacent (unlike) pairs at $a$: $-4\dfrac{kq^2}{a}$. Two diagonal (like) pairs at $a\sqrt2$: $+\dfrac{2kq^2}{a\sqrt2} = +\sqrt2\dfrac{kq^2}{a}$. $\dfrac{kq^2}{a} = \dfrac{9\times10^{9}\times4\times10^{-12}}{0.2} = 0.18$ J. $U = 0.18\times(-4 + 1.414) = -0.47$ J.`, { unit: 'J' }),
  xnat(4, 'infinite ladder', r`An infinite ladder repeats one section: a $4\ \mu$F capacitor in the upper rail, then a shunt capacitor of $8\ \mu$F across the two rails. Find the equivalent capacitance of the whole ladder (in $\mu$F, 2 decimals).`, 4 * (Math.sqrt(3) - 1), 0.02, 2,
    r`With $C = 4$ and shunt $2C$: the ladder $x$ equals $C$ in series with ($2C$ in parallel with $x$). $x = \dfrac{C(2C + x)}{3C + x}$, so $x^2 + 2Cx - 2C^2 = 0$ and $x = C(\sqrt3 - 1) = 4\times0.732 = 2.93\ \mu$F.`, { unit: 'µF' }),
  xnat(4, 'ring axis', r`A ring of radius 10 cm carries a uniform charge. At what distance from the centre, on the axis, is the field largest (in cm, 2 decimals)?`, 10 / Math.SQRT2, 0.02, 2,
    r`$E = \dfrac{kQx}{(R^2 + x^2)^{3/2}}$. Setting $\dfrac{dE}{dx} = 0$: $(R^2 + x^2) - 3x^2 = 0$, so $x = \dfrac{R}{\sqrt2} = 7.07$ cm.`, { unit: 'cm' }),
  xnat(4, 'potential inside a cavity', r`A point charge $+2$ nC sits at the centre of an uncharged thick metal shell of inner radius 0.10 m and outer radius 0.20 m. Find the potential at 0.05 m from the charge (in V). ${XKC}.`, XK * 2e-9 * (1 / 0.05 - 1 / 0.10 + 1 / 0.20), 0, 0,
    r`Charges: $+2$ nC at the centre, $-2$ nC on the inner face (0.10 m), $+2$ nC on the outer face (0.20 m). $V = kq\left(\dfrac1{0.05} - \dfrac1{0.10} + \dfrac1{0.20}\right) = 18\times(20 - 10 + 5) = 270$ V.`, { unit: 'V' }),
  xnat(4, 'work in a changing potential', r`In a region $V = 3x^2 - 2x$ volts ($x$ in m). Find the work done by the field in moving $+5\ \mu$C from $x = 1$ m to $x = 3$ m (in $\mu$J, with sign).`, 5 * ((3 - 2) - (27 - 6)), 0, 0,
    r`$V(1) = 1$ V, $V(3) = 27 - 6 = 21$ V. $W_{\text{field}} = q(V_i - V_f) = 5\times(1 - 21) = -100\ \mu$J. The charge moves to higher potential, against the field.`, { unit: 'µJ' }),
  xnat(4, 'repeated sharing', r`A $2\ \mu$F capacitor charged to 60 V is connected across an uncharged $4\ \mu$F capacitor. The $4\ \mu$F is then fully discharged and the $2\ \mu$F is connected across it again, and this is done once more (three connections in all). Find the charge left on the $2\ \mu$F capacitor (in $\mu$C, 2 decimals).`, 120 / 27, 0.02, 2,
    r`Each connection shares the charge in the ratio $C_1:(C_1+C_2) = 2:6$, so the $2\ \mu$F keeps $\tfrac13$ of its charge each time. After three: $120\times\left(\tfrac13\right)^3 = 4.44\ \mu$C.`, { unit: 'µC' }),
  xnat(4, 'RC power balance', r`A capacitor charges through a resistor with time constant 3.0 s. At what time is the power dissipated in the resistor equal to the rate at which energy is being stored in the capacitor (in s, 2 decimals)?`, 3 * Math.LN2, 0.02, 2,
    r`Resistor: $I^2R$. Capacitor: $\dfrac{d}{dt}\dfrac{q^2}{2C} = \dfrac{qI}{C}$. Equal when $IR = \dfrac qC$, i.e. $V_R = V_C = \dfrac V2$, so $q = \tfrac12CV$ and $t = \tau\ln2 = 2.08$ s.`, { unit: 's' }),
  xnat(4, 'common potential', r`Two conducting spheres of radii 5 cm and 10 cm carry $+6$ nC and $-3$ nC and are far apart. They are joined by a thin wire. Find the final charge on the smaller sphere (in nC). `, (6 - 3) * 5 / 15, 0, 0,
    r`Total charge $+3$ nC is shared in the ratio of radii, $5:10$. The small sphere gets $3\times\dfrac{5}{15} = 1$ nC (and the large one 2 nC).`, { unit: 'nC' }),
  xnat(4, 'charged sphere in a medium', r`A conducting sphere of radius 0.2 m carries $+2\ \mu$C and sits in a liquid of dielectric constant 4. Find the energy of its electric field (in J, 3 decimals). ${XKC} for vacuum.`, XK * 4e-12 / (2 * 0.2 * 4), 0.0005, 4,
    r`In a medium of constant $K$ all fields fall by $K$ for the same free charge, so $U = \dfrac{Q^2}{8\pi\varepsilon_0KR} = \dfrac{kQ^2}{2KR} = \dfrac{9\times10^{9}\times4\times10^{-12}}{2\times0.2\times4} = 0.0225$ J. (The vacuum value is 0.09 J.)`, { unit: 'J' }),
  xnat(4, 'slab pulled into an isolated capacitor', r`An isolated capacitor with air has $C = 20$ pF and charge 100 nC. A slab of $K = 5$ fills it. Find the energy released as the slab is pulled in (in $\mu$J).`, (1e-14 / (2 * 20e-12)) * (1 - 1 / 5) * 1e6, 0, 0,
    r`$Q = 100$ nC. Before: $U_0 = \dfrac{Q^2}{2C} = \dfrac{10^{-14}}{2\times20\times10^{-12}} = 2.5\times10^{-4}$ J $= 250\ \mu$J. After: $U_0/K = 50\ \mu$J. Released: $200\ \mu$J.`, { unit: 'µJ' }),
  xmt(4, 'potential at the centre', 'mx4', r`Match each situation with the potential at the stated point (zero at infinity).`, 'A-p, B-q, C-r, D-s', ['A-p, B-r, C-q, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r'],
    r`(A) $\dfrac{kQ}{R}$ (p). (B) Solid insulating sphere, centre: $\dfrac{3kQ}{2R}$ (q). (C) Ring, $x = R$: $\dfrac{kQ}{\sqrt{R^2+R^2}} = \dfrac{kQ}{\sqrt2R}$ (r). (D) $\dfrac{kQ}{R} - \dfrac{kQ}{2R} = \dfrac{kQ}{2R}$ (s).`),
  xmt(4, 'RC circuit', 'mx5', r`An uncharged capacitor is charged from a battery through a resistor. Match each event with the time at which it happens.`, 'A-p, B-q, C-r, D-s', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-p, B-r, C-q, D-s'],
    r`(A) $1 - e^{-t/\tau} = 0.5$: $t = \ln2\,\tau = 0.69\tau$ (p). (B) $e^{-t/\tau} = \tfrac14$: $t = \ln4\,\tau = 1.39\tau$ (q). (C) Energy $\propto q^2$: $1 - e^{-t/\tau} = \tfrac1{\sqrt2}$ gives $e^{-t/\tau} = 0.293$, $t = 1.23\tau$ (r). (D) $e^{-t/\tau} = 0.1$: $t = \ln10\,\tau = 2.30\tau$ (s). Option t ($1.00\tau$) is the 63 % charge point, not used here.`),
  xmt(4, 'sphere inside a shell', 'mx6', r`A conducting sphere of radius $a$ with $+Q$ is at the centre of a thin shell of radius $2a$. Match each shell charge with the potential of the inner sphere.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$V_{\text{in}} = \dfrac{kQ}{a} + \dfrac{kQ_{\text{shell}}}{2a}$. (A) $Q_{sh} = 0$: $\dfrac{kQ}{a}$ (p). (B) $-Q$: $\dfrac{kQ}{a} - \dfrac{kQ}{2a} = \dfrac{kQ}{2a}$ (q). (C) $+Q$: $\dfrac{3kQ}{2a}$ (r). (D) $+2Q$: $\dfrac{kQ}{a} + \dfrac{kQ}{a} = \dfrac{2kQ}{a}$ (s).`),
  xmsq(4, 'electric dipole', r`A dipole is placed in a uniform electric field at some angle to it. Which statements are correct?`, [r`The net force on the dipole is zero.`, r`The torque is greatest when the dipole is perpendicular to the field.`, r`The orientation opposite to the field is a position of stable equilibrium.`, r`The potential energy is greatest when the dipole is opposite to the field.`], [0, 1, 3],
    r`Equal and opposite forces: net force zero (A). $\tau = pE\sin\theta$ is greatest at $90^\circ$ (B). At $180^\circ$ the torque is zero but the equilibrium is unstable: a small turn is pushed further (C is wrong). $U = -pE\cos\theta$ is maximum, $+pE$, at $180^\circ$ (D).`),
  xmsq(4, 'series combination', r`Two capacitors, $C_1 = 2\ \mu$F and $C_2 = 6\ \mu$F, are in series across a battery of 16 V. Which are correct?`, [r`Each has charge $24\ \mu$C.`, r`The voltage across $C_1$ is 12 V.`, r`The energy in $C_2$ is three times that in $C_1$.`, r`The equivalent capacitance is $8\ \mu$F.`], [0, 1],
    r`$C_{eq} = \dfrac{12}{8} = 1.5\ \mu$F (D is wrong), $Q = 1.5\times16 = 24\ \mu$C (A). $V_1 = 24/2 = 12$ V (B), $V_2 = 4$ V. Energy $\dfrac{Q^2}{2C}$ with the same $Q$ is larger for the smaller $C$: $C_1$ stores three times as much as $C_2$, so C is wrong.`),
  xmsq(4, 'capacitor with a battery', r`A battery stays connected to a parallel plate capacitor while a dielectric slab ($K > 1$) is slowly pushed in to fill the gap. Which are correct?`, [r`The charge on the plates increases.`, r`The electric field between the plates in the filled region decreases.`, r`The energy stored increases.`, r`The potential difference across the capacitor stays the same.`], [0, 2, 3],
    r`$V$ fixed (D). $C\to KC$, so $Q = CV$ rises (A) and $U = \tfrac12CV^2$ rises (C). The field in the slab: $E = V/d$ is unchanged (it is $E_0$ in the dielectric too, since $V$ and $d$ do not change), so B is false. (The free-charge density rises to $K\sigma$, but the polarisation charge cancels the extra field.)`),
  xmsq(4, 'equipotential surfaces', r`For the electrostatic field of a single positive point charge, which are correct?`, [r`Equipotential surfaces are spheres centred on the charge.`, r`Work done in moving a test charge along an equipotential is zero.`, r`The potential difference between two equipotentials is the same however the test charge is moved between them.`, r`Equipotential surfaces are equally spaced for equal steps of potential.`], [0, 1, 2],
    r`$V = kq/r$ is constant on spheres (A); no force component along the surface (B); the field is conservative (C). Equal steps in $V$ need $\Delta r = kq\left(\dfrac1{V_1} - \dfrac1{V_2}\right)$, which is not equal spacing (D is false); they crowd together near the charge.`),
  xmsq(4, 'parallel combination', r`Three capacitors of $1\ \mu$F, $2\ \mu$F and $3\ \mu$F are in parallel across a 6 V battery. Which are correct?`, [r`The equivalent capacitance is $6\ \mu$F.`, r`The $3\ \mu$F capacitor holds the largest charge.`, r`Each has the same charge.`, r`The total energy stored is $108\ \mu$J.`], [0, 1, 3],
    r`Parallel: $C = 6\ \mu$F (A). The same $V$, so $Q = CV$ is largest for $3\ \mu$F (B); charges are $6, 12, 18\ \mu$C, not equal (C false). $U = \tfrac12\times6\times10^{-6}\times36 = 108\ \mu$J (D).`),
  xmsq(5, 'potential and field', r`The potential in a region is $V = ax^2$ with $a > 0$ (SI units), $x$ along the $x$-axis. Which are correct?`, [r`The field is $E_x = -2ax$.`, r`For $x > 0$ the field points away from the origin.`, r`Work done by the field in moving a positive charge from $x = 1$ to $x = 2$ is negative.`, r`The potential difference between $x = 1$ and $x = 3$ is $8a$.`], [0, 2, 3],
    r`$E_x = -dV/dx = -2ax$ (A): at $x > 0$ it points along $-x$ (towards the origin), so B, which says it points away, is false. Moving from $x = 1$ to $2$ means going to higher potential ($a$ to $4a$), so the field does negative work (C). $V(3) - V(1) = 9a - a = 8a$ (D).`),
  xasrt(4, 'conducting slab', r`Inserting a thick metal slab, parallel to the plates and not touching them, in an isolated charged parallel plate capacitor decreases the potential difference.`, r`The field inside the metal is zero, so the slab removes a length equal to its thickness from the region where the field exists.`, 0,
    r`With the charge fixed, the field in the air gaps stays $\sigma/\varepsilon_0$, and no potential drop occurs inside the metal. $V = E(d - t)$ is smaller than $Ed$. R is true and explains A.`),
  xasrt(4, 'charge sharing', r`When a charged capacitor is joined to an identical uncharged one, the total energy falls by half.`, r`The charge is conserved while the capacitance doubles, so the potential difference halves.`, 0,
    r`$Q$ spreads over $2C$: $V\to V/2$, $U_f = \tfrac12(2C)\left(\dfrac V2\right)^2 = \tfrac14CV^2$, half of $U_i = \tfrac12CV^2$. The lost half becomes heat and radiation in the connection. R is true and explains the halving.`),
  xstm(4, 'energy stored', r`A capacitor connected to a battery stores energy $\tfrac12CV^2$ and the battery supplies $CV^2$ in charging it.`, r`Half of the energy supplied by the battery is dissipated as heat in the resistance of the circuit, whatever its value.`, 0,
    r`Both are true, and II explains the missing half in I: the battery moves charge $Q = CV$ through potential $V$, giving $CV^2$; $\tfrac12CV^2$ is stored, the other $\tfrac12CV^2$ is heat for any $R$.`),
  xcnt(4, 'conductors and shells', r`How many of the following are correct for a thin conducting shell carrying charge $Q$ (radius $R$)?`, [r`The potential at the centre is $kQ/R$.`, r`The field at distance $2R$ is $\dfrac{kQ}{4R^2}$.`, r`The field just outside the surface is $\dfrac{kQ}{R^2}$.`, r`The potential at distance $2R$ is $\dfrac{kQ}{R}$.`], 3,
    r`(1) true: inside, $V = $ surface value. (2) true: outside it acts as a point charge, $\dfrac{kQ}{(2R)^2}$. (3) true. (4) false: $V = \dfrac{kQ}{2R}$. Three are correct.`),
  xpas(3, 'field between plates', 'px1', r`Find the field between the plates (in $\mathrm{kV\,m^{-1}}$).`, 200 / 0.02 / 1e3, 0, 0,
    r`$E = V/d = \dfrac{200}{0.02} = 10^{4}\ \mathrm{V\,m^{-1}} = 10$ kV/m.`, { unit: 'kV/m' }),
  xpas(4, 'deflection', 'px1', r`Find the sideways deflection of the electron on leaving the plates (in mm, 2 decimals).`, 0.5 * (XQE * 1e4 / XME) * (0.05 / 3e7) ** 2 * 1e3, 0.03, 2,
    r`$a = \dfrac{eE}{m} = \dfrac{1.6\times10^{-19}\times10^{4}}{9.1\times10^{-31}} = 1.76\times10^{15}\ \mathrm{m\,s^{-2}}$. $t = \dfrac{0.05}{3\times10^{7}} = 1.67\times10^{-9}$ s. $y = \tfrac12at^2 = 2.44\times10^{-3}$ m $= 2.44$ mm. (It deflects towards the positive plate; the electron does not hit it, since the half-gap is 10 mm.)`, { unit: 'mm' }),
  xpas(5, 'direction of motion', 'px1', r`Find the angle that the velocity of the electron makes with its original direction as it leaves the plates (in degrees, 1 decimal).`, Math.atan((XQE * 1e4 / XME) * (0.05 / 3e7) / 3e7) * 180 / Math.PI, 0.2, 1,
    r`$v_y = at = 1.76\times10^{15}\times1.67\times10^{-9} = 2.93\times10^{6}\ \mathrm{m\,s^{-1}}$. $\tan\theta = \dfrac{v_y}{v_x} = \dfrac{2.93\times10^{6}}{3\times10^{7}} = 0.0977$, so $\theta = 5.6^\circ$.`, { unit: '°' }),
  xpas(3, 'charge sharing', 'px2', r`Find the common potential difference after the two capacitors are joined (in V, 1 decimal).`, 300 / 9, 0.1, 1,
    r`$Q = 6\times50 = 300\ \mu$C is shared over $9\ \mu$F: $V = 33.3$ V.`, { unit: 'V' }),
  xpas(4, 'energy loss', 'px2', r`Find the energy lost when they are joined (in mJ, 2 decimals).`, (0.5 * 6e-6 * 2500 - 0.5 * 9e-6 * (300 / 9) ** 2) * 1e3, 0.02, 2,
    r`$U_i = \tfrac12\times6\times50^2 = 7500\ \mu$J. $U_f = \tfrac12\times9\times33.3^2 = 5000\ \mu$J. Loss $= 2500\ \mu$J $= 2.50$ mJ. (Check: $\tfrac12\dfrac{6\times3}{9}\times50^2 = 2500$.)`, { unit: 'mJ' }),
  xpas(5, 'slab pulled in', 'px2', r`Find the work done by the electric field on the slab as it enters (in mJ, 2 decimals).`, (0.5 * 9e-6 * (300 / 9) ** 2 - 0.5 * 15e-6 * 20 ** 2) * 1e3, 0.02, 2,
    r`The pair is isolated, so the total charge stays $300\ \mu$C. Before the slab: $9\ \mu$F, $U = 5.0$ mJ. After: $6\to12\ \mu$F, total $15\ \mu$F, $V = 300/15 = 20$ V, $U = \tfrac12\times15\times20^2 = 3000\ \mu$J $= 3.0$ mJ. The stored energy drops by $2.0$ mJ, which is the work done by the field on the slab.`, { unit: 'mJ', trap: 'Charge, not voltage, is conserved in the isolated pair.' }),

  // ---------- Level 5 ----------
  xnat(5, 'earthed shell', r`A charge $+3$ nC is at the centre of a thin conducting spherical shell of radius 0.15 m, and the shell is earthed. Find the potential at a point 0.075 m from the centre (in V). ${XKC}.`, XK * 3e-9 * (1 / 0.075 - 1 / 0.15), 0, 0,
    r`Earthing holds the shell at 0 V, and the induced charge is $-3$ nC on its inner face and none outside. Inside, the potential is that of the point charge plus the constant due to the shell: $V = kq\left(\dfrac1r - \dfrac1R\right) = 27\times(13.33 - 6.67) = 180$ V. Outside the shell the potential and the field are both zero.`, { unit: 'V', trap: 'The shell contributes a constant -kq/R inside, not zero.' }),
  xnat(5, 'wedge capacitor', r`The plates of a capacitor are 10 cm $\times$ 10 cm, and the gap increases linearly from 1 mm at one edge to 3 mm at the opposite edge (plates inclined to each other, air between). Find its capacitance (in pF, 1 decimal). ${XCONST}`, XE0 * 0.1 * 0.1 / 0.002 * Math.log(3) * 1e12, 0.3, 1,
    r`Cut the plate into strips of width $dx$ parallel to the edge where the gap is constant; each strip is a small capacitor $dC = \dfrac{\varepsilon_0\,w\,dx}{d(x)}$ with $d(x) = d_1 + \dfrac{(d_2-d_1)}{L}x$, all in parallel. $C = \dfrac{\varepsilon_0wL}{d_2 - d_1}\ln\dfrac{d_2}{d_1} = \dfrac{8.85\times10^{-12}\times0.01}{0.002}\ln3 = 4.425\times10^{-11}\times1.0986 = 48.6$ pF.`, { unit: 'pF' }),
  xnat(5, 'graded dielectric', r`The gap $d$ of a parallel plate capacitor is filled with a dielectric whose constant varies with the distance $x$ from one plate as $K = 2\left(1 + \dfrac xd\right)$. Find $C/C_0$ (where $C_0$ is the capacitance with air) (3 decimals).`, 2 / Math.LN2, 0.01, 3,
    r`Layers perpendicular to the field are in series: $\dfrac1C = \int_0^d\dfrac{dx}{\varepsilon_0AK} = \dfrac{d}{2\varepsilon_0A}\int_0^1\dfrac{du}{1+u} = \dfrac{d\ln2}{2\varepsilon_0A}$. So $C = \dfrac{2\varepsilon_0A}{d\ln2}$ and $\dfrac{C}{C_0} = \dfrac{2}{\ln2} = 2.885$.`),
  xnat(5, 'non-uniform charge', r`A solid insulating sphere of radius 0.3 m has a charge density $\rho = \rho_0\dfrac{r}{R}$ with $\rho_0 = 2\ \mu\mathrm{C\,m^{-3}}$. Find the potential at its centre (in V, nearest 10). ${XCONST}`, 2e-6 * 0.09 / (3 * XE0), 10, 0,
    r`Charge inside radius $r$: $q(r) = \int_0^r4\pi r'^2\rho_0\dfrac{r'}{R}dr' = \dfrac{\pi\rho_0r^4}{R}$, so $Q = \pi\rho_0R^3$. Inside, $E = \dfrac{q(r)}{4\pi\varepsilon_0r^2} = \dfrac{\rho_0r^2}{4\varepsilon_0R}$; outside $E = \dfrac{kQ}{r^2}$. $V(0) = \int_0^RE\,dr + \dfrac{kQ}{R} = \dfrac{\rho_0R^2}{12\varepsilon_0} + \dfrac{\rho_0R^2}{4\varepsilon_0} = \dfrac{\rho_0R^2}{3\varepsilon_0} = \dfrac{2\times10^{-6}\times0.09}{3\times8.85\times10^{-12}} = 6780$ V.`, { unit: 'V' }),
  xnat(5, 'dipole oscillations', r`A dipole is made of two small masses of 1.0 g each, carrying $+1\ \mu$C and $-1\ \mu$C, joined by a light rod 2.0 cm long. It is placed in a uniform field of $1000\ \mathrm{V\,m^{-1}}$ and displaced slightly from its equilibrium. Find the period of the small oscillations (in s, 2 decimals).`, 2 * Math.PI * Math.sqrt((2 * 1e-3 * 0.01 ** 2) / (1e-6 * 0.02 * 1000)), 0.01, 2,
    r`$p = ql = 10^{-6}\times0.02 = 2\times10^{-8}$ C m. For small $\theta$ the torque is $-pE\theta$. The moment of inertia about the centre is $I = 2m\left(\dfrac l2\right)^2 = 2\times10^{-3}\times10^{-4} = 2\times10^{-7}\ \mathrm{kg\,m^2}$. $\omega^2 = \dfrac{pE}{I} = \dfrac{2\times10^{-5}}{2\times10^{-7}} = 100$, $\omega = 10\ \mathrm{s^{-1}}$, $T = \dfrac{2\pi}{10} = 0.63$ s.`, { unit: 's' }),
  xnat(5, 'heat while charging', r`A $4\ \mu$F capacitor is charged by a 100 V battery through a resistor. Find the heat produced in the resistor by the time the capacitor holds 80 % of its final charge (in mJ, 1 decimal).`, 0.8 * 4e-6 * 100 * 100 * 1e3 - (0.8 * 4e-6 * 100) ** 2 / (2 * 4e-6) * 1e3, 0.05, 1,
    r`Charge moved $q = 0.8\times4\times100 = 320\ \mu$C. Battery energy $= qV = 320\times10^{-6}\times100 = 32.0$ mJ. Stored: $\dfrac{q^2}{2C} = \dfrac{(320\times10^{-6})^2}{8\times10^{-6}} = 12.8$ mJ. Heat $= 32.0 - 12.8 = 19.2$ mJ. (At full charge the heat would be 20 mJ, equal to the stored 20 mJ.)`, { unit: 'mJ', trap: 'The battery gives qV, not the stored energy.' }),
  xnat(5, 'moving the plates with a battery', r`A parallel plate capacitor of area $0.02\ \mathrm{m^2}$ is connected to a 500 V battery with a gap of 2 mm. The gap is slowly doubled with the battery still connected. Find the work done by the external agent (in $\mu$J, 2 decimals). ${XCONST}`, XE0 * 0.02 * 250000 / (4 * 0.002) * 1e6, 0.05, 2,
    r`At gap $x$ the attraction is $F = \dfrac{\varepsilon_0AV^2}{2x^2}$, and the agent must balance it. $W = \int_{d}^{2d}\dfrac{\varepsilon_0AV^2}{2x^2}dx = \dfrac{\varepsilon_0AV^2}{2}\left(\dfrac1d - \dfrac1{2d}\right) = \dfrac{\varepsilon_0AV^2}{4d} = \dfrac{8.85\times10^{-12}\times0.02\times250000}{4\times0.002} = 5.53\times10^{-6}$ J. Check by energy: stored energy falls by $5.53\ \mu$J, the battery takes in $\Delta Q\,V = -11.06\ \mu$J, so the agent supplies $-5.53 + 11.06 = 5.53\ \mu$J.`, { unit: 'µJ', trap: 'With a battery, the agent does more work than the change in stored energy suggests.' }),
  xmt(5, 'force between the plates', 'mx7', r`A parallel plate capacitor (area $A$, gap $d$) is either isolated or kept connected to a battery of voltage $V$. Match each operation with the change of the attractive force between the plates.`, 'A-p, B-q, C-s, D-r', ['A-q, B-p, C-s, D-r', 'A-p, B-q, C-r, D-s', 'A-p, B-s, C-q, D-r'],
    r`Force $F = \dfrac{Q^2}{2\varepsilon_0A} = \dfrac{\varepsilon_0AV^2}{2d^2}$. (A) isolated, $d$ changes: $Q$, $A$ fixed, so unchanged (p). (B) battery, $d\to2d$: $F\propto1/d^2$, so $\tfrac14$ (q). (C) isolated, $A\to2A$: $F\propto1/A$, so $\tfrac12$ (s). (D) battery, $A\to2A$: $F\propto A$, so 2 (r).`, { trap: 'Isolated: use Q-form. Connected: use V-form.' }),
  xmt(5, 'field on a ring axis', 'mx8', r`A ring of radius $R$ and charge $Q$ has its centre at the origin. Match each point on the axis with the field there.`, 'A-p, B-q, C-r, D-s', ['A-p, B-r, C-q, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r'],
    r`$E = \dfrac{kQx}{(R^2 + x^2)^{3/2}}$. $x = 0$: 0 (p). $x = R/\sqrt2$: $\dfrac{0.7071}{1.5^{1.5}} = \dfrac{2}{3\sqrt3}$ (q), the maximum. $x = R$: $\dfrac{1}{2^{1.5}} = \dfrac1{2\sqrt2}$ (r). $x = 2R$: $\dfrac{2}{5^{1.5}} = \dfrac{2}{5\sqrt5}$ (s).`),
  xmsq(5, 'two connected spheres', r`Two conducting spheres of radii $R_1 < R_2$ are connected by a long thin wire and given a total charge. Which are correct?`, [r`The two spheres are at the same potential.`, r`The surface charge density is larger on the smaller sphere.`, r`The larger sphere carries more charge.`, r`The field just outside the larger sphere is greater.`], [0, 1, 2],
    r`Same potential: $\dfrac{kQ_1}{R_1} = \dfrac{kQ_2}{R_2}$, so $Q\propto R$ (C true). $\sigma = \dfrac{Q}{4\pi R^2}\propto\dfrac1R$, larger on the smaller sphere (B true). Surface field $\sigma/\varepsilon_0\propto1/R$ is larger for the smaller sphere (D false).`),
  xmsq(5, 'RC circuit', r`A capacitor $C$ charges through a resistor $R$ from a battery of emf $\mathcal{E}$. Which are correct?`, [r`At $t = RC\ln2$ the voltage across the resistor equals that across the capacitor.`, r`The total heat produced is $\tfrac12C\mathcal{E}^2$, whatever the value of $R$.`, r`The current falls to $1/e$ of its initial value after $t = RC$.`, r`The energy stored in the capacitor reaches half of its final value at $t = RC\ln2$.`], [0, 1, 2],
    r`$V_R = \mathcal{E}e^{-t/\tau}$ and $V_C = \mathcal{E}(1 - e^{-t/\tau})$ are equal when $e^{-t/\tau} = \tfrac12$ (A). Heat $= \mathcal{E}Q - \tfrac12C\mathcal{E}^2 = \tfrac12C\mathcal{E}^2$ (B). $I = I_0e^{-1}$ at $t = \tau$ (C). Energy $\propto q^2$: half of the final value needs $q = Q/\sqrt2$, which is at $1.23\tau$, not $0.69\tau$ (D false).`),
  xmsq(5, 'concentric shells', r`A thin shell A (radius $a$, charge $+Q$) is surrounded by a concentric thin shell B (radius $b>a$, charge $-2Q$). Which are correct?`, [r`The potential of A is $kQ\left(\dfrac1a - \dfrac2b\right)$.`, r`The field outside both shells is zero.`, r`The potential difference $V_A - V_B$ is $kQ\left(\dfrac1a - \dfrac1b\right)$.`, r`If B is earthed, the charge on B's outer surface becomes zero.`], [0, 2, 3],
    r`$V_A = \dfrac{kQ}{a} + \dfrac{k(-2Q)}{b}$ (A true). Outside, the net charge is $-Q$, so the field is $kQ/r^2$ inwards, not zero (B false). $V_A - V_B = kQ\left(\dfrac1a - \dfrac1b\right)$, independent of B's charge (C true). Earthing B sets its potential to zero, which needs zero net charge outside it: the outer surface charge is zero (D true).`),
  xmsq(5, 'dielectric slab', r`A parallel plate capacitor with air has plates of length $L$ and is connected to a battery $V$. A dielectric slab ($K>1$), filling the gap, is inserted a distance $x$ between the plates. Which are correct?`, [r`$C$ increases linearly with $x$.`, r`The force on the slab is independent of $x$ (edge effects ignored).`, r`The charge drawn from the battery increases linearly with $x$.`, r`The force on the slab is directed so as to push it out.`], [0, 1, 2],
    r`$C(x) = C_0\left[1 + (K-1)\dfrac xL\right]$ (A). $F = \tfrac12V^2\dfrac{dC}{dx} = \text{constant}$ (B). $Q = CV$ grows linearly (C). The force is positive: it pulls the slab in (D false).`),
  xmsq(5, 'potential energy of charges', r`Four identical positive charges are at the corners of a square. Which are correct?`, [r`The potential at the centre is not zero.`, r`The field at the centre is zero.`, r`Removing one charge makes the field at the centre zero.`, r`The potential energy of the system is positive.`], [0, 1, 3],
    r`Potentials add and are positive (A). Opposite pairs cancel the field (B). With one removed, the other three leave the field of the opposite charge uncancelled (C false). All pair energies are positive (D).`),
  xasrt(5, 'electrostatic pressure', r`A charged soap bubble tends to expand.`, r`The outward electrostatic pressure on a charged conducting surface is $\dfrac{\sigma^2}{2\varepsilon_0}$.`, 0,
    r`Each element of surface charge feels the field of all the other charges, which is half the field just outside, $\dfrac{\sigma}{2\varepsilon_0}$, directed outwards. The force per unit area is $\sigma\times\dfrac{\sigma}{2\varepsilon_0}$. This outward pressure is what makes a charged bubble expand. R explains A.`),
  xstm(5, 'charged shell', r`The electric field just outside a charged conducting surface is twice the average of the fields just outside and just inside.`, r`The field inside the conductor is zero, and the force on a surface charge element is calculated using the average field.`, 0,
    r`Just outside $E = \sigma/\varepsilon_0$ and just inside 0, average $\sigma/2\varepsilon_0$; so I is true. II is true and explains why the force per area is $\sigma\times\dfrac{\sigma}{2\varepsilon_0}$: the element does not push on itself, the average field is the field of the rest of the charge.`),
  xcnt(5, 'capacitor operations', r`A parallel plate capacitor is charged by a battery and then the battery is disconnected. The plates are then moved slowly apart. How many of these are correct?`, [r`The charge on the plates stays the same.`, r`The electric field between the plates stays the same.`, r`The potential difference increases.`, r`The energy stored increases.`], 4,
    r`Isolated: $Q$ fixed (1). $E = \sigma/\varepsilon_0$ is fixed (2). $V = Ed$ grows with $d$ (3). $U = \tfrac12QV$ grows; the work done by the agent is stored (4). All four are correct.`),
];

const xgens = [
  xg('__P__-g25', 3, 'nat', 'two dielectrics in series', function make(rng) {
    const K1 = choose(rng, [2, 3, 4]); const K2 = choose(rng, [5, 6, 8]); const f = choose(rng, [0.25, 0.4, 0.5, 0.6]);
    const ratio = 1 / (f / K1 + (1 - f) / K2);
    return { K1, K2, f, q: `The gap of a parallel plate capacitor is filled by two full-area slabs one behind the other: $K_1 = ${K1}$ takes a fraction ${f} of the gap and $K_2 = ${K2}$ the rest. Find $C/C_0$ (2 decimals).`, answer: +ratio.toFixed(2), tol: 0.02,
      sol: `Two capacitors in series: the effective gap is $d\\left(\\dfrac{${f}}{${K1}} + \\dfrac{${+(1 - f).toFixed(2)}}{${K2}}\\right) = ${xs(1 / ratio, 4)}\\,d$, so $C/C_0 = ${xs(ratio, 4)}$.`, trap: 'One behind the other is series: add d/K, not K.' };
  }, (p) => 1 / (p.f / p.K1 + (1 - p.f) / p.K2)),
  xg('__P__-g26', 3, 'mcq', 'charge sharing between spheres', function make(rng) {
    const R1 = choose(rng, [2, 3, 4, 5]); const R2 = choose(rng, [6, 8, 9, 10]); const Q = choose(rng, [8, 12, 16, 20]);
    const q2 = Q * R2 / (R1 + R2); const o = numOpts(rng, q2, [Q * R1 / (R1 + R2), Q / 2, Q * R2 / R1], 'nC', 3);
    return { R1, R2, Q, q: `A conducting sphere of radius ${R1} cm carries ${Q} nC. It is joined by a thin wire to a far-away uncharged sphere of radius ${R2} cm. The charge on the larger sphere becomes`, options: o.options, answer: o.answer,
      sol: `Equal potentials: $Q\\propto R$. The larger sphere gets $\\dfrac{${R2}}{${R1 + R2}}\\times${Q} = ${xs(q2)}$ nC. ${xs(Q * R1 / (R1 + R2))} nC is the smaller sphere's share; equal sharing would need equal radii.` };
  }, (p) => p.options.findIndex((o) => o === `${fmt(p.Q * p.R2 / (p.R1 + p.R2), 3)} nC`)),
  xg('__P__-g27', 4, 'nat', 'energy lost in sharing', function make(rng) {
    const C1 = pick(rng, 2, 10, 2); const C2 = pick(rng, 2, 10, 2); const V = pick(rng, 40, 200, 20);
    const loss = 0.5 * C1 * C2 / (C1 + C2) * V * V * 1e-3;
    return { C1, C2, V, q: `A $${C1}\\ \\mu$F capacitor charged to ${V} V is joined, like plates together, to an uncharged $${C2}\\ \\mu$F capacitor. Find the energy lost (in mJ, 2 decimals).`, answer: +loss.toFixed(2), tol: 0.02, unit: 'mJ',
      sol: `$V' = \\dfrac{${C1}\\times${V}}{${C1 + C2}} = ${xs(C1 * V / (C1 + C2))}$ V. $U_i = \\tfrac12\\times${C1}\\times${V}^2\\times10^{-3} = ${xs(0.5 * C1 * V * V * 1e-3)}$ mJ, $U_f = \\tfrac12\\times${C1 + C2}\\times(${xs(C1 * V / (C1 + C2))})^2\\times10^{-3} = ${xs(0.5 * (C1 + C2) * (C1 * V / (C1 + C2)) ** 2 * 1e-3)}$ mJ. Loss $= ${xs(loss)}$ mJ.`, trap: 'Energy is not conserved: charge is.' };
  }, (p) => { const Vf = p.C1 * p.V / (p.C1 + p.C2); return (0.5 * p.C1 * p.V ** 2 - 0.5 * (p.C1 + p.C2) * Vf ** 2) * 1e-3; }),
  xg('__P__-g28', 4, 'nat', 'charge moving to a ring', function make(rng) {
    const Q = pick(rng, 2, 8, 2); const R = choose(rng, [0.1, 0.2, 0.3]); const x = choose(rng, [0.1, 0.2, 0.3, 0.4]); const qq = pick(rng, 1, 4, 1); const m = choose(rng, [1, 2, 5]);
    const D = Math.hypot(R, x); const v = Math.sqrt(2 * 9e9 * Q * 1e-6 * qq * 1e-6 * (1 / R - 1 / D) / (m * 1e-3));
    return { Q, R, x, qq, m, q: `A thin ring of radius ${R} m carries $+${Q}\\ \\mu$C. A particle of mass ${m} g and charge $-${qq}\\ \\mu$C is released from rest on the axis ${x} m from the centre. Find its speed at the centre of the ring (in $\\mathrm{m\\,s^{-1}}$, 2 decimals; $\\dfrac{1}{4\\pi\\varepsilon_0} = 9\\times10^{9}$ SI).`, answer: +v.toFixed(2), tol: 0.03, unit: 'm/s',
      sol: `Distance from the start to every part of the ring: $\\sqrt{${R}^2 + ${x}^2} = ${xs(D, 4)}$ m. Gain in energy: $kQq\\left(\\dfrac1{${R}} - \\dfrac1{${xs(D, 4)}}\\right) = ${xs(0.5 * m * 1e-3 * v * v, 4)}$ J. $v = \\sqrt{2K/m} = ${xs(v)}\\ \\mathrm{m\\,s^{-1}}$.`, trap: 'Use the slant distance to the ring, not x.' };
  }, (p) => { const D = Math.sqrt(p.R ** 2 + p.x ** 2); return Math.sqrt(2 * 9e9 * p.Q * p.qq * 1e-12 * (1 / p.R - 1 / D) / (p.m * 1e-3)); }),
  xg('__P__-g29', 4, 'nat', 'infinite ladder', function make(rng) {
    const C = choose(rng, [2, 3, 4, 5, 6]); const m = choose(rng, [1, 2, 3]);
    const x = C * (-m + Math.sqrt(m * m + 4 * m)) / 2;
    return { C, m, q: `An infinite ladder repeats this section: a $${C}\\ \\mu$F capacitor in the upper rail, then a shunt capacitor of $${m * C}\\ \\mu$F across the two rails, then the rest of the ladder. Find the equivalent capacitance between the input terminals (in $\\mu$F, 2 decimals).`, answer: +x.toFixed(2), tol: 0.02, unit: 'µF',
      sol: `The rest of the ladder is again $x$. The shunt is in parallel with it: $${m}C + x$. In series with the first $C$: $x = \\dfrac{C(${m}C + x)}{C + ${m}C + x}$, so $x^2 + ${m}Cx - ${m}C^2 = 0$ and $x = \\dfrac{C(-${m} + \\sqrt{${m * m + 4 * m}})}{2} = ${xs(x)}\\ \\mu$F.` };
  }, (p) => { let x = p.C; for (let i = 0; i < 200; i++) { const par = p.m * p.C + x; x = p.C * par / (p.C + par); } return x; }),
  xg('__P__-g30', 5, 'nat', 'energy in charging', function make(rng) {
    const f = choose(rng, [0.25, 0.5, 0.75]); const tau = pick(rng, 1, 6, 1);
    const t = -tau * Math.log(1 - Math.sqrt(f));
    return { f, tau, q: `A capacitor charges through a resistor from a battery with time constant ${tau} s. After how many seconds does the stored energy reach ${f} of its final value (2 decimals)?`, answer: +t.toFixed(2), tol: 0.03, unit: 's',
      sol: `$U\\propto q^2$, so $q/q_{max} = \\sqrt{${f}} = ${xs(Math.sqrt(f), 4)}$. $1 - e^{-t/\\tau} = ${xs(Math.sqrt(f), 4)}$ gives $t = ${tau}\\ln\\dfrac{1}{${xs(1 - Math.sqrt(f), 4)}} = ${xs(t)}$ s.`, trap: 'Energy goes as charge squared, so the charge fraction is the square root of the energy fraction.' };
  }, (p) => { let lo = 0; let hi = 100 * p.tau; for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; const qf = 1 - Math.exp(-mid / p.tau); if (qf * qf < p.f) lo = mid; else hi = mid; } return lo; }),
  xg('__P__-g31', 4, 'mcq', 'conducting or dielectric slab', function make(rng) {
    const d = choose(rng, [4, 6, 8]); const t = choose(rng, [1, 2, 3]); const cond = rng() < 0.5; const Kk = choose(rng, [2, 4]);
    const ratio = cond ? d / (d - t) : d / (d - t + t / Kk);
    const o = numOpts(rng, ratio, [cond ? d / (d - t + t / Kk) : d / (d - t), d / (d + t), (d - t) / d], '', 3);
    return { d, t, cond, Kk, q: `A parallel plate capacitor has a gap of ${d} mm. A ${cond ? 'metal' : `dielectric ($K = ${Kk}$)`} slab ${t} mm thick is placed parallel to the plates, not touching them. The ratio $C/C_0$ is`, options: o.options, answer: o.answer,
      sol: cond ? `Inside the metal the field is zero: effective gap $d - t = ${d - t}$ mm, ratio $\\dfrac{${d}}{${d - t}} = ${xs(ratio)}$.` : `Effective gap $d - t + t/K = ${d} - ${t} + ${xs(t / Kk)} = ${xs(d - t + t / Kk)}$ mm, ratio $${xs(ratio)}$. Treating it as a conductor ($d - t$) overstates the effect.` };
  }, (p) => p.options.findIndex((o) => o === fmt(p.cond ? p.d / (p.d - p.t) : p.d / (p.d - p.t + p.t / p.Kk), 3))),
  xg('__P__-g32', 5, 'nat', 'wedge capacitor', function make(rng) {
    const w = choose(rng, [5, 10, 20]); const L = choose(rng, [5, 10, 20]); const d1 = choose(rng, [1, 2]); const d2 = d1 + choose(rng, [1, 2, 3]);
    const C = 8.85e-12 * (w / 100) * (L / 100) / ((d2 - d1) * 1e-3) * Math.log(d2 / d1) * 1e12;
    return { w, L, d1, d2, q: `A capacitor has rectangular plates ${w} cm wide and ${L} cm long, inclined so the gap grows linearly from ${d1} mm at one edge to ${d2} mm at the other (the gap is constant along the width). Find the capacitance (in pF, 2 decimals; $\\varepsilon_0 = 8.85\\times10^{-12}$ F/m).`, answer: +C.toFixed(2), tol: Math.max(0.02, C * 0.005), unit: 'pF',
      sol: `Thin strips across the length are capacitors in parallel: $C = \\dfrac{\\varepsilon_0wL}{d_2 - d_1}\\ln\\dfrac{d_2}{d_1} = \\dfrac{8.85\\times10^{-12}\\times${w / 100}\\times${L / 100}}{${(d2 - d1) * 1e-3}}\\ln${xs(d2 / d1, 4)} = ${xs(C)}$ pF.`, trap: 'The mean gap gives a slightly wrong answer; integrate.' };
  }, (p) => { let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const d = (p.d1 + (p.d2 - p.d1) * (i + 0.5) / n) * 1e-3; s += 8.85e-12 * (p.w / 100) * (p.L / 100 / n) / d; } return s * 1e12; }),
];

export default { topic: 'potential-capacitance', groups: { ...groups, ...xgroups }, items: [...items, ...xitems], gens: [...gens, ...xgens] };
