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
const MU = 4e-7 * Math.PI; const QE = 1.6e-19; const ME = 9.1e-31; const MP = 1.67e-27;
const S = (x, sig = 3) => String(+Number(x).toPrecision(sig));
let k = 0; let c = 0;
const nid = () => `mc-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: exFor(level, o.type), sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
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
// "how many are correct" statements item: options 0..3 or 1..4 as text
const cnt = (level, sub, q, list, n, sol, o = {}) => {
  const opts = ['Only one', 'Only two', 'Only three', 'All four'];
  return base(level, sub, { type: 'mcq', format: 'statements', q: `${q}<br>${list.map((s, i) => `(${i + 1}) ${s}`).join('<br>')}`, options: opts, answer: n - 1, sol, ...o });
};
// match: correct code placed at a rotating position
const mat = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 2) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return { id: nid(), type: 'mcq', level, format: 'match', exams: exFor(level, 'mcq'), sub, group, q, options, answer: pos, sol, ...o };
};
const pas = (level, sub, group, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: exFor(level, 'nat'), sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
const pasm = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return { id: nid(), type: 'mcq', level, format: 'passage', exams: exFor(level, 'mcq'), sub, group, q, options, answer: pos, sol, ...o };
};
const tx = (x, sig = 3) => {
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e4 || a < 1e-2) { const e = Math.floor(Math.log10(a)); let m = +(x / 10 ** e).toPrecision(sig); if (Math.abs(m) >= 10) { m /= 10; return `${+m.toPrecision(sig)}\\times10^{${e + 1}}`; } return `${m}\\times10^{${e}}`; }
  return S(x, sig);
};
const N = (x, dp) => +x.toFixed(dp);
const items = [
  // ---------- Level 1 ----------
  mcq(1, 'magnetic force on a charge', r`A charge moves in a magnetic field. The magnetic force on it is zero when the velocity is`, 'parallel or antiparallel to the field', ['perpendicular to the field', 'at $45^\\circ$ to the field', 'at $60^\\circ$ to the field'],
    r`$F = qvB\sin\theta$. The force vanishes only when $\sin\theta = 0$, that is $\theta = 0^\circ$ or $180^\circ$. It is largest at $90^\circ$.`),
  mcq(1, 'units of B', r`The SI unit of magnetic field, the tesla, is equal to`, r`$\mathrm{N\,A^{-1}\,m^{-1}}$`, [r`$\mathrm{N\,A\,m^{-1}}$`, r`$\mathrm{N\,A^{-1}\,m}$`, r`$\mathrm{N\,A^{-2}\,m^{-1}}$`],
    r`From $F = BIL$ we get $B = F/(IL)$, so 1 T $= 1\ \mathrm{N\,A^{-1}\,m^{-1}}$. It is also $1\ \mathrm{Wb\,m^{-2}}$.`),
  nat(1, 'magnetic force on a charge', r`A charge of $5\ \mu\mathrm{C}$ moves at $2\times10^{3}\ \mathrm{m\,s^{-1}}$ at right angles to a field of 0.4 T. Find the magnetic force (in mN).`, 5e-6 * 2e3 * 0.4 * 1e3, 0.01, 1,
    r`$F = qvB = 5\times10^{-6}\times2\times10^{3}\times0.4 = 4\times10^{-3}$ N $= 4$ mN.`, { unit: 'mN', trap: 'Convert microcoulombs to coulombs first.' }),
  mcq(1, 'work done by magnetic force', r`The work done by a magnetic force on a moving charge is`, 'always zero', ['positive when the charge speeds up', 'negative when the charge is deflected', 'equal to $qvB$ per second'],
    r`The force $q\vec v\times\vec B$ is always perpendicular to $\vec v$, so $\vec F\cdot\vec v = 0$. The force changes the direction of the velocity, never the speed or the kinetic energy.`),
  mcq(1, 'field of a straight wire', r`The magnetic field lines around a long straight wire carrying current are`, 'concentric circles in a plane perpendicular to the wire', ['straight lines parallel to the wire', 'straight lines radiating out from the wire', 'parabolas'],
    r`By the right-hand thumb rule the field curls around the wire. The lines are closed circles centred on the wire, in planes perpendicular to it.`),
  nat(1, 'field of a straight wire', r`Find the field at 5 cm from a long straight wire carrying 10 A (in $\mu$T). Use $\mu_0/4\pi = 10^{-7}\ \mathrm{T\,m\,A^{-1}}$.`, 2e-7 * 10 / 0.05 * 1e6, 0.5, 0,
    r`$B = \dfrac{\mu_0I}{2\pi r} = \dfrac{2\times10^{-7}\times10}{0.05} = 4\times10^{-5}$ T $= 40\ \mu$T.`, { unit: 'μT' }),
  nat(1, 'field at the centre of a loop', r`A coil of 100 turns and radius 10 cm carries 2 A. Find the field at its centre (in mT, 2 decimals).`, MU * 100 * 2 / (2 * 0.1) * 1e3, 0.01, 2,
    r`$B = \dfrac{\mu_0NI}{2R} = \dfrac{4\pi\times10^{-7}\times100\times2}{0.2} = 1.257\times10^{-3}$ T $= 1.26$ mT.`, { unit: 'mT' }),
  mcq(1, 'solenoid', r`The magnetic field at the middle of a long air-core solenoid with $n$ turns per metre carrying current $I$ is`, r`$\mu_0nI$`, [r`$\mu_0nI/2$`, r`$\mu_0I/n$`, r`$2\mu_0nI$`],
    r`Ampère's law on a thin rectangular loop gives $B = \mu_0nI$ inside. The factor $\tfrac12$ appears only at the ends of the solenoid.`),
  nat(1, 'force on a current-carrying wire', r`A straight wire of length 0.5 m carries 4 A at right angles to a field of 0.2 T. Find the force on it (in N, 2 decimals).`, 4 * 0.5 * 0.2, 0.005, 2,
    r`$F = BIL\sin90^\circ = 0.2\times4\times0.5 = 0.40$ N.`, { unit: 'N' }),
  mcq(1, 'magnetic moment', r`The SI unit of the magnetic moment of a current loop is`, r`$\mathrm{A\,m^2}$`, [r`$\mathrm{A\,m^{-2}}$`, r`$\mathrm{N\,A^{-1}\,m^{-1}}$`, r`$\mathrm{A\,m^{-1}}$`],
    r`$m = NIA$, so the unit is ampere times metre squared (equal to joule per tesla).`),
  mcq(1, 'forces between wires', r`Two long parallel wires carry currents in the same direction. They will`, 'attract each other', ['repel each other', 'exert no force on each other', 'rotate about each other'],
    r`The field of wire 1 at wire 2 points so that $\vec I_2\times\vec B_1$ is directed towards wire 1. Like currents attract, unlike currents repel (the opposite of like charges).`),
  nat(1, 'magnetic moment', r`A coil of 50 turns and area $0.02\ \mathrm{m^2}$ carries 3 A. Find its magnetic moment (in $\mathrm{A\,m^2}$).`, 50 * 0.02 * 3, 0.01, 1,
    r`$m = NIA = 50\times3\times0.02 = 3\ \mathrm{A\,m^2}$.`, { unit: 'A m²' }),
  mcq(1, 'ammeter', r`A moving coil galvanometer is converted into an ammeter by connecting`, 'a low resistance in parallel with it', ['a high resistance in series with it', 'a low resistance in series with it', 'a high resistance in parallel with it'],
    r`The shunt carries most of the current, so it must be small and in parallel. A good ammeter has a very small resistance and is placed in series with the circuit.`),
  mcq(1, 'voltmeter', r`A moving coil galvanometer is converted into a voltmeter by connecting`, 'a high resistance in series with it', ['a low resistance in parallel with it', 'a low resistance in series with it', 'a high resistance in parallel with it'],
    r`The series resistance takes most of the voltage and keeps the current through the coil within its full-scale value. The voltmeter is then placed in parallel with the part measured.`),
  mcq(1, 'charge at rest', r`A charged particle at rest in a uniform magnetic field experiences`, 'no magnetic force', ['a force along the field', 'a force perpendicular to the field', 'a torque about the field'],
    r`$\vec F = q\vec v\times\vec B$ and $\vec v = 0$. A magnetic field acts only on moving charges.`),
  mcq(1, 'solenoid field', r`The magnetic field outside an ideal very long solenoid is`, 'almost zero', [r`equal to $\mu_0nI$`, r`equal to $\mu_0nI/2$`, r`infinite`],
    r`For an ideal long solenoid the field lines closing outside are spread over a very large region, so the outside field is negligible compared with $\mu_0nI$ inside.`),
  mcq(1, "Ampère's law", r`Ampère's circuital law states that $\oint\vec B\cdot d\vec l$ around a closed path equals`, r`$\mu_0$ times the current enclosed by the path`, [r`$\mu_0$ times the total current in the whole circuit`, r`the magnetic flux through the path`, r`$\mu_0$ times the charge enclosed`],
    r`Only the current threading the loop counts (with the right-hand rule fixing its sign). Currents outside the loop do not appear in the line integral.`),
  mcq(1, 'dimensions', r`The dimensional formula of magnetic field $B$ is`, r`$\mathrm{[MT^{-2}A^{-1}]}$`, [r`$\mathrm{[MLT^{-2}A^{-1}]}$`, r`$\mathrm{[MT^{-1}A^{-1}]}$`, r`$\mathrm{[ML^{-1}T^{-2}A]}$`],
    r`$B = F/(qv)$, with $[F] = \mathrm{MLT^{-2}}$ and $[qv] = \mathrm{A\,T\cdot LT^{-1}} = \mathrm{ALT^{0}}$ (charge is $\mathrm{AT}$). So $[B] = \mathrm{MLT^{-2}/(AL)} = \mathrm{MT^{-2}A^{-1}}$.`),
  mcq(1, 'field of a loop', r`The magnetic field at the centre of a circular current loop is directed`, 'along the axis, perpendicular to the plane of the loop', ['in the plane of the loop, along a radius', 'in the plane of the loop, along a tangent', 'in no definite direction'],
    r`Each element of the loop gives a field along the axis at the centre by the right-hand rule, and the in-plane parts cancel. Curl the fingers along the current and the thumb gives the field direction.`),
  mcq(1, 'galvanometer', r`The coil of a moving coil galvanometer is wound on a soft iron core in a radial field so that`, 'the deflection is proportional to the current', ['the sensitivity becomes zero', 'the torque depends on the angle', 'the resistance of the coil falls'],
    r`In the radial field the plane of the coil is always parallel to $B$, so the deflecting torque $NIAB$ is the same at all angles. It balances the restoring torque $k\phi$, giving $\phi\propto I$ and a uniform scale.`),

  // ---------- Level 2 ----------
  mcq(2, 'direction of force', r`An electron moves towards the east in a horizontal magnetic field pointing north. The magnetic force on the electron is directed`, 'downward', ['upward', 'towards the north', 'towards the west'],
    r`Take east $= \hat x$, north $= \hat y$, up $= \hat z$. $\vec v\times\vec B = \hat x\times\hat y = +\hat z$ (up). For a positive charge the force would be up, but the electron is negative, so the force is down.`, { trap: 'The charge is negative, so reverse the direction of $\\vec v\\times\\vec B$.' }),
  nat(2, 'circular motion', r`A proton moving at $2\times10^{6}\ \mathrm{m\,s^{-1}}$ enters a uniform field of 0.5 T at right angles. Find the radius of its path (in cm, 2 decimals). Take $m_p = 1.67\times10^{-27}$ kg.`, MP * 2e6 / (QE * 0.5) * 100, 0.02, 2,
    r`$qvB = mv^2/r$, so $r = \dfrac{mv}{qB} = \dfrac{1.67\times10^{-27}\times2\times10^{6}}{1.6\times10^{-19}\times0.5} = 4.175\times10^{-2}$ m $= 4.18$ cm.`, { unit: 'cm' }),
  nat(2, 'velocity selector', r`A velocity selector has an electric field of $3\times10^{4}\ \mathrm{V\,m^{-1}}$ crossed with a magnetic field of 0.1 T. Find the speed of the particles that pass undeflected (in units of $10^{5}\ \mathrm{m\,s^{-1}}$).`, 3e4 / 0.1 / 1e5, 0.01, 1,
    r`The undeflected particles have $qE = qvB$, so $v = E/B = \dfrac{3\times10^{4}}{0.1} = 3\times10^{5}\ \mathrm{m\,s^{-1}}$. The charge and mass do not matter.`, { unit: '×10⁵ m/s' }),
  nat(2, 'force on a wire at an angle', r`A wire of length 0.4 m carrying 5 A is placed in a field of 0.6 T at $30^\circ$ to the wire. Find the force on it (in N, 2 decimals).`, 5 * 0.4 * 0.6 * 0.5, 0.01, 2,
    r`$F = BIL\sin\theta = 0.6\times5\times0.4\times\sin30^\circ = 1.2\times0.5 = 0.60$ N.`, { unit: 'N', trap: 'The angle is between the wire and the field.' }),
  nat(2, 'force between wires', r`Two long parallel wires 10 cm apart carry 10 A and 20 A in opposite directions. Find the force per unit length (in $\mathrm{mN\,m^{-1}}$, 2 decimals).`, 2e-7 * 10 * 20 / 0.1 * 1e3, 0.01, 2,
    r`$\dfrac Fl = \dfrac{\mu_0I_1I_2}{2\pi d} = \dfrac{2\times10^{-7}\times10\times20}{0.1} = 4\times10^{-4}\ \mathrm{N\,m^{-1}} = 0.40\ \mathrm{mN\,m^{-1}}$. The wires repel, since the currents are opposite.`, { unit: 'mN/m' }),
  nat(2, 'solenoid', r`A solenoid of 500 turns and length 0.25 m carries 2 A. Find the field inside it near the middle (in mT, 2 decimals).`, MU * (500 / 0.25) * 2 * 1e3, 0.01, 2,
    r`$n = 500/0.25 = 2000\ \mathrm{m^{-1}}$. $B = \mu_0nI = 4\pi\times10^{-7}\times2000\times2 = 5.03\times10^{-3}$ T $= 5.03$ mT.`, { unit: 'mT' }),
  nat(2, 'torque on a loop', r`A rectangular coil of $10\ \mathrm{cm}\times5\ \mathrm{cm}$ with 20 turns carries 2 A in a field of 0.5 T. Find the maximum torque on it (in N m, 2 decimals).`, 20 * 2 * 0.005 * 0.5, 0.005, 2,
    r`$\tau_{max} = NIAB = 20\times2\times(0.1\times0.05)\times0.5 = 0.10$ N m, when the plane of the coil is parallel to the field.`, { unit: 'N m' }),
  nat(2, 'ammeter conversion', r`A galvanometer of resistance $50\ \Omega$ gives full-scale deflection for 2 mA. Find the shunt needed to make it a 0 to 1 A ammeter (in $\Omega$, 3 decimals).`, 50 * 0.002 / (1 - 0.002), 0.001, 3,
    r`The shunt carries $1 - 0.002 = 0.998$ A at the same voltage as the galvanometer: $S = \dfrac{I_gG}{I - I_g} = \dfrac{0.002\times50}{0.998} = 0.100\ \Omega$.`, { unit: 'Ω' }),
  nat(2, 'voltmeter conversion', r`The same galvanometer ($50\ \Omega$, 2 mA full-scale) is to be made into a 0 to 10 V voltmeter. Find the series resistance (in $\Omega$).`, 10 / 0.002 - 50, 0.5, 0,
    r`Total resistance $= V/I_g = 10/0.002 = 5000\ \Omega$. Series resistance $= 5000 - 50 = 4950\ \Omega$.`, { unit: 'Ω', trap: 'Subtract the galvanometer resistance.' }),
  nat(2, 'cyclotron period', r`An electron moves in a circle in a field of $10^{-3}$ T. Find the time for one revolution (in ns, 1 decimal).`, 2 * Math.PI * ME / (QE * 1e-3) * 1e9, 0.1, 1,
    r`$T = \dfrac{2\pi m}{qB} = \dfrac{2\pi\times9.1\times10^{-31}}{1.6\times10^{-19}\times10^{-3}} = 3.57\times10^{-8}$ s $= 35.7$ ns. It does not depend on the speed.`, { unit: 'ns' }),
  mcq(2, 'circular motion', r`A charged particle moves in a circle in a uniform field. If its speed is doubled, then its radius $r$ and its period $T$ become`, r`$2r$ and $T$`, [r`$2r$ and $2T$`, r`$r$ and $2T$`, r`$4r$ and $T$`],
    r`$r = mv/qB\propto v$, so $r\to2r$. $T = 2\pi m/qB$ has no $v$ in it, so $T$ is unchanged.`),
  mcq(2, 'kinetic energy', r`A particle enters a uniform magnetic field perpendicular to it. Inside the field, its`, 'kinetic energy and momentum magnitude stay constant, but the momentum direction changes', ['kinetic energy increases', 'speed decreases', 'momentum stays constant'],
    r`The force is always at right angles to the velocity, so the speed and kinetic energy are constant. The momentum is a vector and its direction keeps changing.`),
  mcq(2, 'field of a straight wire', r`The field at distance $r$ from a long wire carrying $I$ is $B$. If both $I$ and $r$ are doubled, the field becomes`, r`$B$`, [r`$2B$`, r`$B/2$`, r`$4B$`],
    r`$B\propto I/r$. Doubling both leaves the ratio unchanged.`),
  mcq(2, 'forces between wires', r`Two long parallel wires carry currents in opposite directions. The force between them is`, 'repulsive, and inversely proportional to their separation', ['attractive, and inversely proportional to their separation', 'repulsive, and inversely proportional to the square of their separation', 'attractive, and independent of their separation'],
    r`Unlike currents repel. The force per unit length is $\mu_0I_1I_2/2\pi d\propto1/d$, not $1/d^2$.`),
  mcq(2, 'definition of the ampere', r`One ampere is that steady current which, flowing in each of two long parallel wires 1 m apart in vacuum, produces a force per metre of`, r`$2\times10^{-7}$ N`, [r`$4\pi\times10^{-7}$ N`, r`$10^{-7}$ N`, r`$2\pi\times10^{-7}$ N`],
    r`Put $I_1 = I_2 = 1$ A and $d = 1$ m in $\dfrac{\mu_0I_1I_2}{2\pi d} = \dfrac{4\pi\times10^{-7}}{2\pi} = 2\times10^{-7}\ \mathrm{N\,m^{-1}}$.`),
  nat(2, 'magnetic moment of an orbit', r`In a simple model, an electron moves in a circular orbit of radius $5.3\times10^{-11}$ m at $2.2\times10^{6}\ \mathrm{m\,s^{-1}}$. Find the magnetic moment of the orbit (in units of $10^{-24}\ \mathrm{A\,m^2}$, 2 decimals).`, QE * 2.2e6 * 5.3e-11 / 2 / 1e-24, 0.05, 2,
    r`The current is $I = e/T = ev/2\pi r$ and the area is $\pi r^2$, so $m = IA = \tfrac12evr = \tfrac12\times1.6\times10^{-19}\times2.2\times10^{6}\times5.3\times10^{-11} = 9.33\times10^{-24}\ \mathrm{A\,m^2}$.`, { unit: '×10⁻²⁴ A m²' }),
  mcq(2, 'torque on a loop', r`A current loop in a uniform magnetic field experiences zero torque when the plane of the loop is`, 'perpendicular to the field', ['parallel to the field', 'at $45^\\circ$ to the field', 'at $30^\\circ$ to the field'],
    r`$\vec\tau = \vec m\times\vec B$. The moment $\vec m$ is along the normal to the plane, so $\tau = 0$ when $\vec m\parallel\vec B$, which means the plane is perpendicular to $\vec B$. This is the stable equilibrium.`),
  nat(2, 'toroid', r`A toroid has 1500 turns and a mean radius of 0.15 m and carries 2 A. Find the field inside its core (in mT).`, MU * 1500 * 2 / (2 * Math.PI * 0.15) * 1e3, 0.01, 2,
    r`$B = \dfrac{\mu_0NI}{2\pi r} = \dfrac{2\times10^{-7}\times1500\times2}{0.15} = 4\times10^{-3}$ T $= 4.00$ mT.`, { unit: 'mT' }),
  mcq(2, 'toroid', r`The magnetic field outside the windings of an ideal toroid (in the space around it and in the hole) is`, 'zero', [r`$\mu_0nI$`, r`$\mu_0NI/2\pi r$`, r`non-zero but small`],
    r`A circular Amperian loop outside the toroid encloses no net current (the current passes in once and out once for every turn). So $B\cdot2\pi r = 0$.`),
  nat(2, 'radius after acceleration', r`An electron is accelerated from rest through 400 V and enters a field of $10^{-3}$ T at right angles. Find the radius of its circle (in cm, 2 decimals).`, Math.sqrt(2 * ME * 400 / QE) / 1e-3 * 100, 0.05, 2,
    r`$\tfrac12mv^2 = eV$ gives $v = \sqrt{2eV/m} = \sqrt{\dfrac{2\times1.6\times10^{-19}\times400}{9.1\times10^{-31}}} = 1.186\times10^{7}\ \mathrm{m\,s^{-1}}$. $r = \dfrac{mv}{eB} = \dfrac{9.1\times10^{-31}\times1.186\times10^{7}}{1.6\times10^{-19}\times10^{-3}} = 6.75\times10^{-2}$ m $= 6.75$ cm. (Or $r = \dfrac1B\sqrt{2mV/e}$.)`, { unit: 'cm' }),
  nat(2, 'force between wires', r`Two long parallel wires 5 cm apart each carry 15 A in the same direction. Find the force on a 2 m length of one of them (in mN, 2 decimals).`, 2e-7 * 15 * 15 / 0.05 * 2 * 1e3, 0.01, 2,
    r`$\dfrac Fl = \dfrac{2\times10^{-7}\times15\times15}{0.05} = 9\times10^{-4}\ \mathrm{N\,m^{-1}}$. For 2 m: $1.8\times10^{-3}$ N $= 1.80$ mN (attractive).`, { unit: 'mN' }),
  nat(2, 'field of a semicircle', r`A wire is bent into a semicircle of radius 10 cm and carries 5 A. Find the field at its centre (in $\mu$T, 1 decimal).`, MU * 5 / (4 * 0.1) * 1e6, 0.1, 1,
    r`A full circle gives $\mu_0I/2R$ at the centre; a semicircle gives half of it: $B = \dfrac{\mu_0I}{4R} = \dfrac{4\pi\times10^{-7}\times5}{0.4} = 1.571\times10^{-5}$ T $= 15.7\ \mu$T.`, { unit: 'μT' }),
  nat(2, 'field on the axis', r`A single circular loop of radius 10 cm carries 4 A. Find the field on its axis at 10 cm from the centre (in $\mu$T, 2 decimals).`, MU * 4 * 0.01 / (2 * Math.pow(0.02, 1.5)) * 1e6, 0.03, 2,
    r`$B = \dfrac{\mu_0IR^2}{2(R^2 + x^2)^{3/2}} = \dfrac{4\pi\times10^{-7}\times4\times0.01}{2(0.02)^{3/2}}$. $(0.02)^{3/2} = 2.828\times10^{-3}$. $B = \dfrac{5.027\times10^{-8}}{5.657\times10^{-3}} = 8.89\times10^{-6}$ T $= 8.89\ \mu$T. (At the centre it would be $12.6\ \mu$T.)`, { unit: 'μT' }),
  mcq(2, 'proton and deuteron', r`A proton and a deuteron (twice the mass, same charge) enter the same uniform field at right angles with the same speed. The ratio of the radii $r_p : r_d$ is`, '1 : 2', ['2 : 1', '1 : 1', '1 : 4'],
    r`$r = mv/qB$ with the same $v$, $q$ and $B$ gives $r\propto m$. So $r_p : r_d = 1 : 2$.`),
  mcq(2, 'same kinetic energy', r`A proton and an alpha particle (mass 4 times, charge 2 times) have the same kinetic energy and enter a uniform field at right angles. The ratio of their radii $r_p : r_\alpha$ is`, '1 : 1', ['1 : 2', '2 : 1', '1 : 4'],
    r`$r = \dfrac{p}{qB} = \dfrac{\sqrt{2mK}}{qB}$. For the same $K$, $r\propto\sqrt m/q$. For the alpha particle: $\dfrac{\sqrt4}{2} = 1$. So the ratio is 1 : 1.`, { trap: 'Same energy, not same speed or same potential difference.' }),
  mcq(2, 'moving coil galvanometer', r`The current sensitivity of a moving coil galvanometer can be increased by`, 'increasing the number of turns of the coil', ['decreasing the area of the coil', 'using a spring of larger torsion constant', 'using a weaker magnet'],
    r`$\phi/I = NAB/k$. A larger $N$, $A$ or $B$ and a smaller $k$ raise the sensitivity. Note that adding turns also raises the resistance, so the voltage sensitivity $\phi/V = NAB/kR$ may not rise in the same proportion.`),
  mcq(2, 'force between a charge and a wire', r`A positive charge moves parallel to a long straight wire in the same direction as the current. The charge is`, 'attracted towards the wire', ['repelled from the wire', 'not affected by the wire', 'moved along the wire with increasing speed'],
    r`The charge is equivalent to a current element parallel to the wire current. Parallel currents attract. (By the formula: $\vec F = q\vec v\times\vec B$ points towards the wire.)`),
  mcq(2, 'moving charge and field', r`A charged particle moves with constant velocity along a straight line in a region where both $\vec E$ and $\vec B$ are present. Which is a possible explanation?`, r`$\vec E\perp\vec B$, with $qE = qvB$ and $\vec v$ perpendicular to both`, [r`$\vec E\perp\vec B$ with $E = 2vB$`, r`$\vec E\parallel\vec B$ with $\vec v$ perpendicular to both`, r`$\vec B = 0$ with $\vec E\neq0$`],
    r`Constant velocity needs zero net force, so $q\vec E + q\vec v\times\vec B = 0$. That means $E = vB$ with the force directions opposite: the velocity-selector condition. Parallel fields with the velocity perpendicular to both leave the electric force with nothing to cancel it. With $\vec B = 0$ the electric force is unbalanced. And $E = 2vB$ does not balance either.`, { trap: 'Zero net force needs equal and opposite electric and magnetic forces.' }),
  mcq(2, 'Earth field', r`The field of the Earth near its surface is of the order of`, r`$10^{-5}$ T to $10^{-4}$ T`, [r`$10^{-9}$ T`, r`$10^{-1}$ T`, r`1 T`],
    r`About 0.3 to 0.6 gauss, which is $3\times10^{-5}$ to $6\times10^{-5}$ T (1 gauss $= 10^{-4}$ T). A fridge magnet is about $5\times10^{-3}$ T and an MRI machine 1.5 T to 3 T.`),
  mcq(2, 'Ampère loop', r`A long straight wire carries 5 A. The value of $\oint\vec B\cdot d\vec l$ around a circle of radius 2 cm centred on it, and around a circle of radius 4 cm, are in the ratio`, '1 : 1', ['1 : 2', '2 : 1', '1 : 4'],
    r`Both circles enclose the same current, 5 A. So both integrals equal $\mu_0\times5$, whatever the radius. (The field itself is smaller on the bigger circle, but the path is longer by the same factor.)`),
  nat(2, 'torque at an angle', r`A coil of magnetic moment $0.8\ \mathrm{A\,m^2}$ is in a field of 0.5 T, with its axis at $30^\circ$ to the field. Find the torque on it (in N m, 2 decimals).`, 0.8 * 0.5 * 0.5, 0.005, 2,
    r`$\tau = mB\sin\theta$, where $\theta$ is the angle between $\vec m$ (the axis) and $\vec B$: $0.8\times0.5\times\sin30^\circ = 0.20$ N m.`, { unit: 'N m', trap: 'The angle is between the axis of the coil and B, not the plane and B.' }),
];
items.push(
  // ---------- Level 3 ----------
  nat(3, 'helical motion', r`A proton moves at $10^{6}\ \mathrm{m\,s^{-1}}$ at $60^\circ$ to a uniform field of 0.1 T. Find the pitch of its helical path (in cm, 1 decimal). Take $m_p = 1.67\times10^{-27}$ kg.`, 2 * Math.PI * MP * 1e6 * Math.cos(Math.PI / 3) / (QE * 0.1) * 100, 0.2, 1,
    r`Split $\vec v$ into $v_\parallel = v\cos60^\circ = 5\times10^{5}$ and $v_\perp = v\sin60^\circ$ (this gives the circle). The pitch is $v_\parallel T$ with $T = \dfrac{2\pi m}{qB} = \dfrac{2\pi\times1.67\times10^{-27}}{1.6\times10^{-19}\times0.1} = 6.56\times10^{-7}$ s. Pitch $= 5\times10^{5}\times6.56\times10^{-7} = 0.328$ m $= 32.8$ cm. (The radius would be $9.04$ cm.)`, { unit: 'cm', trap: 'Use the component along B for the pitch, not the full speed.' }),
  nat(3, 'cyclotron', r`The dees of a cyclotron have radius 0.5 m and the magnetic field is 1.2 T. Find the maximum kinetic energy of the protons (in MeV, 1 decimal).`, (QE * 1.2 * 0.5) ** 2 / (2 * MP) / 1.6e-13, 0.1, 1,
    r`At the exit radius $R$: $v = qBR/m$, so $K = \dfrac12mv^2 = \dfrac{q^2B^2R^2}{2m} = \dfrac{(1.6\times10^{-19}\times1.2\times0.5)^2}{2\times1.67\times10^{-27}} = 2.76\times10^{-12}$ J. In MeV (divide by $1.6\times10^{-13}$): $17.2$ MeV.`, { unit: 'MeV', trap: 'The final energy depends on B and R, not on the accelerating voltage.' }),
  nat(3, 'cyclotron', r`Deuterons (mass $3.34\times10^{-27}$ kg, charge $e$) are accelerated in a cyclotron with a field of 1.5 T. Find the frequency the oscillator must have (in MHz, 1 decimal).`, QE * 1.5 / (2 * Math.PI * 3.34e-27) / 1e6, 0.1, 1,
    r`The oscillator frequency must equal the cyclotron frequency: $f = \dfrac{qB}{2\pi m} = \dfrac{1.6\times10^{-19}\times1.5}{2\pi\times3.34\times10^{-27}} = 1.144\times10^{7}$ Hz $= 11.4$ MHz.`, { unit: 'MHz' }),
  nat(3, 'deflection in a field region', r`A charged particle enters a field region of width 5 cm, perpendicular to its boundary, and moves on a circle of radius 10 cm. Through what angle is its velocity turned when it leaves the opposite boundary (in degrees)?`, 30, 0.5, 0,
    r`The particle enters along the normal, so the centre of its circle lies on the entry boundary. At exit, the horizontal distance travelled is $d = r\sin\theta$. So $\sin\theta = 5/10 = 0.5$ and $\theta = 30^\circ$.`, { unit: '°' }),
  nat(3, 'time in a magnetic field', r`A proton moving perpendicular to a 0.5 T field is turned through $90^\circ$. How long does that take (in ns, 1 decimal)?`, (Math.PI / 2) * MP / (QE * 0.5) * 1e9, 0.2, 1,
    r`A quarter of a revolution: $t = \dfrac T4 = \dfrac{\pi m}{2qB} = \dfrac{\pi\times1.67\times10^{-27}}{2\times1.6\times10^{-19}\times0.5} = 3.28\times10^{-8}$ s $= 32.8$ ns.`, { unit: 'ns' }),
  mcq(3, 'closed loop in a uniform field', r`A closed current-carrying loop of any shape is placed in a uniform magnetic field. The net force on the loop is`, 'zero, whatever the shape and orientation', [r`$NIAB$ for a loop of area $A$`, 'zero only when the plane is parallel to the field', 'zero only when the plane is perpendicular to the field'],
    r`The net force is $I\left(\oint d\vec l\right)\times\vec B$. For a closed loop $\oint d\vec l = 0$. A torque may still exist; the force is zero for every orientation.`),
  nat(3, 'force on a curved wire', r`A semicircular wire of radius 10 cm carries 5 A and lies in a plane perpendicular to a uniform field of 0.3 T. Find the net force on it (in N, 2 decimals).`, 2 * 0.3 * 5 * 0.1, 0.005, 2,
    r`The force on a curved wire equals the force on a straight wire joining its ends (same current, same endpoints). The length is the diameter, $0.2$ m: $F = BIl = 0.3\times5\times0.2 = 0.30$ N.`, { unit: 'N', trap: 'Use the straight-line distance between the ends, not the arc length.' }),
  nat(3, 'field at the centre of a square', r`A square loop of side 20 cm carries 4 A. Find the field at its centre (in $\mu$T, 1 decimal).`, 2 * Math.SQRT2 * MU * 4 / (Math.PI * 0.2) * 1e6, 0.1, 1,
    r`Each side is a finite wire at perpendicular distance $d = a/2 = 0.1$ m, subtending $\pm45^\circ$: $B_1 = \dfrac{\mu_0I}{4\pi d}(\sin45^\circ + \sin45^\circ) = \dfrac{10^{-7}\times4}{0.1}\times\sqrt2 = 5.657\times10^{-6}$ T. Four sides, all in the same direction: $B = 4B_1 = 2.26\times10^{-5}$ T $= 22.6\ \mu$T.`, { unit: 'μT' }),
  nat(3, 'finite straight wire', r`A straight wire of length 20 cm carries 5 A. Find the field at a point 5 cm from its midpoint, on the perpendicular bisector (in $\mu$T, 1 decimal).`, 1e-7 * 5 / 0.05 * 2 * (0.1 / Math.sqrt(0.0125)) * 1e6, 0.1, 1,
    r`$B = \dfrac{\mu_0I}{4\pi d}(\sin\alpha_1 + \sin\alpha_2)$ with $\sin\alpha = \dfrac{0.1}{\sqrt{0.1^2 + 0.05^2}} = 0.894$. $B = \dfrac{10^{-7}\times5}{0.05}\times2\times0.894 = 1.79\times10^{-5}$ T $= 17.9\ \mu$T. (An infinite wire would give $20\ \mu$T.)`, { unit: 'μT' }),
  nat(3, 'Biot-Savart for an arc', r`An arc of $60^\circ$ and radius 20 cm carries 3 A. Find the field at its centre of curvature (in $\mu$T, 2 decimals).`, 1e-7 * 3 * (Math.PI / 3) / 0.2 * 1e6, 0.01, 2,
    r`$B = \dfrac{\mu_0I}{4\pi R}\theta = \dfrac{10^{-7}\times3}{0.2}\times\dfrac\pi3 = 1.57\times10^{-6}$ T $= 1.57\ \mu$T, with $\theta$ in radians.`, { unit: 'μT', trap: 'Use radians for the angle.' }),
  nat(3, 'neutral point', r`Two long parallel wires 30 cm apart carry 10 A and 20 A in the same direction. How far from the 10 A wire, on the line between them, is the field zero (in cm)?`, 10, 0.2, 1,
    r`Between the wires the two fields are opposite. Zero when $\dfrac{\mu_0\times10}{2\pi x} = \dfrac{\mu_0\times20}{2\pi(30 - x)}$, so $10(30 - x) = 20x$ and $x = 10$ cm.`, { unit: 'cm' }),
  nat(3, 'neutral point, opposite currents', r`Two long parallel wires 30 cm apart carry 10 A and 20 A in opposite directions. Where, on the line joining them, is the field zero? Give the distance from the 10 A wire (in cm).`, 30, 0.5, 0,
    r`For opposite currents the fields cancel only outside the wires, nearer the smaller current. At distance $x$ from the 10 A wire (on the side away from the 20 A wire): $\dfrac{10}{x} = \dfrac{20}{x + 30}$, so $10x + 300 = 20x$ and $x = 30$ cm.`, { unit: 'cm', trap: 'Between opposite currents the fields add, so no zero there.' }),
  nat(3, "Ampère's law for a thick wire", r`A long straight wire of radius 2 cm carries 10 A uniformly over its cross-section. Find the field inside it at 1.5 cm from the axis (in $\mu$T).`, MU * 10 * 0.015 / (2 * Math.PI * 0.02 ** 2) * 1e6, 0.5, 1,
    r`The enclosed current is $I\dfrac{r^2}{R^2}$, so $B\cdot2\pi r = \mu_0I\dfrac{r^2}{R^2}$ and $B = \dfrac{\mu_0Ir}{2\pi R^2} = \dfrac{2\times10^{-7}\times10\times0.015}{(0.02)^2} = 7.5\times10^{-5}$ T $= 75\ \mu$T.`, { unit: 'μT', trap: 'Inside, only the current within radius r counts.' }),
  mcq(3, "Ampère's law for a hollow conductor", r`A long hollow cylindrical conductor carries a uniform current along its length. The field in the hollow space (inside the inner surface) is`, 'zero', [r`$\mu_0I/2\pi r$`, 'uniform and non-zero', r`maximum at the axis`],
    r`A circular Amperian loop in the hollow region encloses no current, so $B\cdot2\pi r = 0$. By symmetry $B$ has the same value all round the loop, so $B = 0$.`),
  nat(3, 'energy of a dipole', r`A magnetic dipole of moment $0.5\ \mathrm{A\,m^2}$ lies along a field of 0.4 T. How much work is needed to turn it end for end (in J, 2 decimals)?`, 2 * 0.5 * 0.4, 0.005, 2,
    r`$U = -mB\cos\theta$. From $\theta = 0$ ($U = -mB$) to $\theta = 180^\circ$ ($U = +mB$): $W = 2mB = 2\times0.5\times0.4 = 0.40$ J.`, { unit: 'J' }),
  mcq(3, 'galvanometer shunt', r`A galvanometer of resistance $G$ is shunted with a resistance $G/9$. The fraction of the total current that flows through the galvanometer is`, '1/10', ['1/9', '9/10', '1/8'],
    r`The currents divide in inverse proportion to the resistances: $\dfrac{I_g}{I_s} = \dfrac{S}{G} = \dfrac19$. So $I_g = \dfrac{I}{1 + 9} = \dfrac I{10}$. The range of the ammeter is 10 times the original full-scale current.`),
  nat(3, 'voltmeter range', r`A voltmeter reading 0 to 3 V has a resistance of $1000\ \Omega$. What extra series resistance converts it to a 0 to 15 V voltmeter (in $\Omega$)?`, 4000, 1, 0,
    r`Full-scale current $= 3/1000 = 3$ mA. For 15 V the total resistance must be $15/0.003 = 5000\ \Omega$. Extra $= 5000 - 1000 = 4000\ \Omega$. In general $R = (n - 1)\times$ original resistance for a range $n$ times larger.`, { unit: 'Ω' }),
  nat(3, 'mass spectrometer', r`Ions pass through a velocity selector with $E = 2\times10^{4}\ \mathrm{V\,m^{-1}}$ and $B = 0.1$ T and then enter a field of 0.2 T, where they move on a circle of radius 10 cm. Find the mass of a singly charged ion (in units of $10^{-26}$ kg, 1 decimal).`, QE * 0.2 * 0.1 / 2e5 / 1e-26, 0.05, 1,
    r`The selected speed is $v = E/B = 2\times10^{5}\ \mathrm{m\,s^{-1}}$. In the second field $r = \dfrac{mv}{qB'}$, so $m = \dfrac{qB'r}{v} = \dfrac{1.6\times10^{-19}\times0.2\times0.1}{2\times10^{5}} = 1.6\times10^{-26}$ kg.`, { unit: '×10⁻²⁶ kg' }),
  mcq(3, 'crossed wires', r`Two long insulated wires lie in the same plane, one along the x-axis with current in the $+x$ direction and one along the y-axis with the same current in the $+y$ direction. The net field is zero along the line`, r`$y = x$`, [r`$y = -x$`, r`the x-axis`, r`the y-axis`],
    r`At a point $(a, a)$, the x-wire gives $\mu_0I/2\pi a$ out of the page and the y-wire gives the same magnitude into the page, so they cancel. The same happens at $(-a, -a)$. At $(-a, a)$ and $(a, -a)$ the two fields point the same way and add. On an axis, only one wire contributes there, and its field is not zero.`, { trap: 'Work out the direction of each wire\'s field in each quadrant before adding.' }),
  nat(3, 'field of a moving charge', r`A proton moves at $2\times10^{6}\ \mathrm{m\,s^{-1}}$. Find the magnetic field it produces at a point 1 mm away, on a line perpendicular to its velocity (in units of $10^{-14}$ T, 1 decimal).`, 1e-7 * QE * 2e6 / 1e-6 / 1e-14, 0.05, 1,
    r`$B = \dfrac{\mu_0}{4\pi}\dfrac{qv\sin\theta}{r^2} = \dfrac{10^{-7}\times1.6\times10^{-19}\times2\times10^{6}}{(10^{-3})^2} = 3.2\times10^{-14}$ T.`, { unit: '×10⁻¹⁴ T' }),
  nat(3, 'cyclotron', r`In a cyclotron the potential difference between the dees is 50 kV at the instant a proton crosses the gap. How many complete revolutions does a proton make to reach 10 MeV?`, 100, 0, 0,
    r`It gains $qV = 50$ keV at each crossing of the gap, and crosses twice per revolution: 100 keV per revolution. Revolutions $= \dfrac{10\ \mathrm{MeV}}{100\ \mathrm{keV}} = 100$.`, { trap: 'Two gap crossings per revolution.' }),
  nat(3, 'torque on a circular coil', r`A circular coil of 10 turns and radius 5 cm carries 2 A. Its axis makes $60^\circ$ with a field of 0.4 T. Find the torque on it (in N m, 3 decimals).`, 10 * 2 * Math.PI * 0.05 ** 2 * 0.4 * Math.sin(Math.PI / 3), 0.001, 3,
    r`$m = NIA = 10\times2\times\pi(0.05)^2 = 0.157\ \mathrm{A\,m^2}$. $\tau = mB\sin60^\circ = 0.157\times0.4\times0.866 = 0.0544$ N m.`, { unit: 'N m' }),
  nat(3, 'galvanometer deflection', r`A coil of 200 turns and area $2\times10^{-4}\ \mathrm{m^2}$ is in a radial field of 0.1 T. The spring constant is $4\times10^{-8}\ \mathrm{N\,m\,rad^{-1}}$. Find the deflection for a current of $10\ \mu$A (in degrees, 1 decimal).`, 200 * 2e-4 * 0.1 * 1e-5 / 4e-8 * 180 / Math.PI, 0.2, 1,
    r`$NIAB = k\phi$, so $\phi = \dfrac{200\times10^{-5}\times2\times10^{-4}\times0.1}{4\times10^{-8}} = 1.00$ rad $= 57.3^\circ$.`, { unit: '°' }),

  // assertion-reason, statements and multi at level 3
  asrt(3, 'motion in a field', r`A charged particle can move in a straight line through a region of uniform magnetic field.`, r`The magnetic force on a charge is zero when its velocity is parallel to the field.`, 0,
    r`If the velocity is along $\vec B$, then $\vec v\times\vec B = 0$ and the particle keeps going straight. R is true and is the reason for A.`),
  asrt(3, 'work done', r`A charged particle moving in a magnetic field does not gain kinetic energy from the field.`, r`The magnetic force is always perpendicular to the velocity of the particle.`, 0,
    r`With $\vec F\perp\vec v$ the power $\vec F\cdot\vec v$ is zero, so the kinetic energy cannot change. R explains A.`),
  asrt(3, 'forces between wires', r`Two parallel wires carrying currents in the same direction attract each other.`, r`Like electric charges repel each other.`, 1,
    r`A is true, and R is also a true statement, but it has nothing to do with the cause. The attraction is magnetic: the field of one wire acts on the moving charges in the other. So R is not the explanation.`),
  asrt(3, 'radius of a path', r`A proton and an electron moving at the same speed, perpendicular to the same uniform field, move in circles of the same radius.`, r`The magnitude of the magnetic force on both is $evB$.`, 3,
    r`A is false: $r = mv/eB$ and the proton is about 1836 times heavier, so its circle is much bigger. R is true (equal charge magnitude, same $v$ and $B$), but it only shows the forces are equal. The same force on a heavier mass gives a larger radius.`, { trap: 'Equal force does not mean equal radius.' }),
  stm(3, 'solenoid', r`The field inside a long solenoid does not depend on its radius.`, r`The field at either end of a long solenoid is half the field at its middle.`, 0,
    r`$B = \mu_0nI$ has no radius in it. At an end, only half of the turns contribute, so $B = \mu_0nI/2$. Both are true.`),
  stm(3, 'moving coil galvanometer', r`A radial magnetic field is used so that the deflection is proportional to the current.`, r`A galvanometer is more sensitive when the torsion constant of its suspension is larger.`, 2,
    r`I is true. II is false: $\phi/I = NAB/k$, so a larger $k$ makes the galvanometer less sensitive.`),
  stm(3, 'Ampère circuital law', r`$\oint\vec B\cdot d\vec l$ around a closed path depends on the shape of the path.`, r`$\oint\vec B\cdot d\vec l$ around a closed path depends only on the current enclosed.`, 3,
    r`I is false. The value is $\mu_0I_{enc}$ however the path is shaped (provided it encloses the same current). II is true.`),
  msq(3, 'motion in a field', r`A charged particle enters a uniform magnetic field at some angle. Which statements are correct?`, [r`Its speed stays constant.`, r`Its kinetic energy stays constant.`, r`Its velocity component along the field stays constant.`, r`Its path is always a circle.`], [0, 1, 2],
    r`The force is perpendicular to $\vec v$, so the speed and kinetic energy stay constant. There is no force along $\vec B$, so $v_\parallel$ is constant. The path is a circle only if $v_\parallel = 0$; otherwise it is a helix.`),
  msq(3, 'solenoid', r`A long solenoid has $n$ turns per metre and carries current $I$. Which of the following are correct?`, [r`The field inside is almost uniform.`, r`The field inside is $\mu_0nI$.`, r`The field outside is almost zero.`, r`The field inside is greater near the walls than at the axis.`], [0, 1, 2],
    r`These are the standard properties of an ideal long solenoid. The field is uniform across the cross-section, so it is not greater near the walls.`),
  msq(3, 'converting a galvanometer', r`A galvanometer ($G = 100\ \Omega$, full-scale current 1 mA) is converted into an instrument. Which are correct?`, [r`A $0.1\ \Omega$ shunt gives a range of about 1 A.`, r`A $9900\ \Omega$ series resistor gives a 10 V voltmeter.`, r`A $900\ \Omega$ series resistor gives a 1 V voltmeter.`, r`A $0.1\ \Omega$ resistor in series gives an ammeter.`], [0, 1, 2],
    r`Shunt: $I = I_g(1 + G/S) = 1\ \mathrm{mA}\times(1 + 1000) = 1.001$ A. Voltmeter: $V = I_g(G + R)$, so $10$ V needs $R = 9900\ \Omega$ and $1$ V needs $R = 900\ \Omega$. A low resistance in series does not make an ammeter: the shunt must be in parallel.`),
  msq(3, 'moving charge in crossed fields', r`A particle passes undeflected through crossed electric and magnetic fields. Which are correct?`, [r`Its speed is $E/B$.`, r`The speed depends on the charge of the particle.`, r`A particle of a different mass but the same speed also passes undeflected.`, r`Particles with speed greater than $E/B$ are deflected.`], [0, 2, 3],
    r`$qE = qvB$ gives $v = E/B$, independent of charge and mass. Faster particles feel a bigger magnetic force and are deflected; slower ones are deflected the other way.`),
);
items.push(
  // ---------- Level 4 ----------
  nat(3, 'force on a bent wire', r`A wire bent into an L shape has arms of 30 cm and 40 cm and carries 3 A. It lies in a plane perpendicular to a uniform field of 0.2 T. Find the net force on the whole wire (in N, 2 decimals).`, 0.2 * 3 * 0.5, 0.005, 2,
    r`The force on any shaped wire between two points in a uniform field equals the force on the straight chord joining them. The chord is $\sqrt{0.3^2 + 0.4^2} = 0.5$ m. $F = BIl = 0.2\times3\times0.5 = 0.30$ N.`, { unit: 'N' }),
  nat(4, 'loop near a wire', r`A long wire carries 10 A. A rectangular loop of sides 20 cm (parallel to the wire) and 10 cm (perpendicular to it) carries 5 A. The near side is 5 cm from the wire. Find the net force on the loop (in $\mu$N, 1 decimal).`, 2e-7 * 50 * 0.2 * (1 / 0.05 - 1 / 0.15) * 1e6, 0.2, 1,
    r`The forces on the two sides perpendicular to the wire cancel. The near side (5 cm away) and far side (15 cm away) carry currents in opposite directions: $F = \dfrac{\mu_0I_1I_2l}{2\pi}\left(\dfrac1{d_1} - \dfrac1{d_2}\right) = 2\times10^{-7}\times50\times0.2\times(20 - 6.67) = 2.67\times10^{-5}$ N $= 26.7\ \mu$N. The net force is towards the wire if the near side has the same direction of current as the wire.`, { unit: 'μN', trap: 'The two long sides feel different forces because the field is not uniform.' }),
  nat(4, "Ampère's law with a cavity", r`A long straight conductor of radius 5 cm has a cylindrical hole of radius 1 cm, whose axis is parallel to the conductor's axis and 2 cm from it. The conductor carries 50 A uniformly spread over its cross-section (the hole has no current). Find the field inside the hole (in $\mu$T, 1 decimal).`, MU * 50 / (Math.PI * (0.0025 - 0.0001)) * 0.02 / 2 * 1e6, 0.3, 1,
    r`Treat it as a full cylinder of current density $J$ plus a smaller cylinder of density $-J$ in the hole. Inside a solid cylinder, $\vec B = \dfrac{\mu_0}{2}\vec J\times\vec r$. The difference is $B = \dfrac{\mu_0Jd}{2}$, uniform in the hole, with $d$ the distance between the axes. $J = \dfrac{50}{\pi(0.05^2 - 0.01^2)} = 6631\ \mathrm{A\,m^{-2}}$. $B = \dfrac{4\pi\times10^{-7}\times6631\times0.02}{2} = 8.33\times10^{-5}$ T $= 83.3\ \mu$T.`, { unit: 'μT', trap: 'It does not depend on the radius of the hole, only on the distance d and on J.' }),
  nat(4, 'composite wire', r`A long wire is bent into a hairpin: two parallel straight semi-infinite pieces joined by a semicircle of radius 10 cm. It carries 6 A. Find the field at the centre of the semicircle (in $\mu$T, 1 decimal).`, MU * 6 / (4 * 0.1) * (1 + 2 / Math.PI) * 1e6, 0.2, 1,
    r`The centre lies on a perpendicular to each straight piece, at its end. Each semi-infinite wire gives $\dfrac{\mu_0I}{4\pi R}$, and the semicircle gives $\dfrac{\mu_0I}{4R}$, all in the same direction. $B = \dfrac{\mu_0I}{4R}\left(1 + \dfrac2\pi\right) = \dfrac{4\pi\times10^{-7}\times6}{0.4}\times1.637 = 3.08\times10^{-5}$ T $= 30.8\ \mu$T.`, { unit: 'μT', trap: 'A semi-infinite wire gives half of an infinite wire, not zero.' }),
  nat(4, 'equilateral triangle', r`A loop in the shape of an equilateral triangle of side 30 cm carries 3 A. Find the field at its centroid (in $\mu$T, 1 decimal).`, 9 * MU * 3 / (2 * Math.PI * 0.3) * 1e6, 0.1, 1,
    r`The centroid is at distance $d = \dfrac{a}{2\sqrt3}$ from each side, and each side subtends $60^\circ$ at each end: $B_1 = \dfrac{\mu_0I}{4\pi d}\times2\sin60^\circ = \dfrac{3\mu_0I}{2\pi a}$. Three sides: $B = \dfrac{9\mu_0I}{2\pi a} = \dfrac{9\times2\times10^{-7}\times3}{0.3} = 1.8\times10^{-5}$ T $= 18.0\ \mu$T.`, { unit: 'μT' }),
  nat(4, 'mass spectrometer', r`Ions of chlorine-35 and chlorine-37 (masses $35\,u$ and $37\,u$, with $1\,u = 1.66\times10^{-27}$ kg, charge $+e$) are accelerated through 1000 V and enter a field of 0.5 T at right angles. Find the distance between the points where they land after a half circle (in mm, 2 decimals).`, (() => { const rr = (A) => Math.sqrt(2 * A * 1.66e-27 * 1000 / QE) / 0.5; return 2 * (rr(37) - rr(35)) * 1e3; })(), 0.03, 2,
    r`$r = \dfrac{1}{B}\sqrt{\dfrac{2mV}{q}}$. For $m = 35u$: $\sqrt{\dfrac{2\times5.81\times10^{-26}\times1000}{1.6\times10^{-19}}} = 0.02695$, so $r = 0.0539$ m. For $37u$: $r = 0.0554$ m. They land $2r$ from the slit, so the separation is $2(0.055416 - 0.053898) = 3.04\times10^{-3}$ m $= 3.04$ mm.`, { unit: 'mm' }),
  nat(4, 'oscillation of a dipole', r`A small coil of magnetic moment $0.5\ \mathrm{A\,m^2}$ and moment of inertia $2\times10^{-4}\ \mathrm{kg\,m^2}$ is free to turn in a uniform field of 0.4 T. Find the period of its small oscillations about the field direction (in s, 3 decimals).`, 2 * Math.PI * Math.sqrt(2e-4 / (0.5 * 0.4)), 0.002, 3,
    r`For small angles the torque is $-mB\theta$, so $I\ddot\theta = -mB\theta$ and $T = 2\pi\sqrt{\dfrac{I}{mB}} = 2\pi\sqrt{\dfrac{2\times10^{-4}}{0.2}} = 2\pi\times0.03162 = 0.199$ s.`, { unit: 's' }),
  nat(4, 'Helmholtz coils', r`Two identical coaxial coils, each of 100 turns and radius 10 cm, are placed 10 cm apart (one radius) and carry 1.5 A in the same direction. Find the field at the midpoint of the axis (in mT, 2 decimals).`, Math.pow(0.8, 1.5) * MU * 100 * 1.5 / 0.1 * 1e3, 0.01, 2,
    r`Each coil is $R/2 = 5$ cm from the midpoint. One coil gives $\dfrac{\mu_0NIR^2}{2(R^2 + x^2)^{3/2}}$ with $x = R/2$: $\dfrac{\mu_0NI}{2R}\times\dfrac{1}{(1.25)^{3/2}}$. Two coils: $B = \dfrac{\mu_0NI}{R}\times0.7155 = \dfrac{4\pi\times10^{-7}\times150}{0.1}\times0.7155 = 1.35\times10^{-3}$ T $= 1.35$ mT.`, { unit: 'mT' }),
  nat(4, 'levitation of a wire', r`A long horizontal wire carries 100 A. A parallel wire of mass 0.1 kg per metre carrying 50 A in the opposite direction floats above it in equilibrium. Find the separation (in mm, 2 decimals; $g = 9.8\ \mathrm{m\,s^{-2}}$).`, 2e-7 * 100 * 50 / (0.1 * 9.8) * 1e3, 0.02, 2,
    r`The wires repel: the force per metre $\dfrac{\mu_0I_1I_2}{2\pi d}$ balances the weight per metre $\lambda g$. $d = \dfrac{2\times10^{-7}\times100\times50}{0.1\times9.8} = 1.02\times10^{-3}$ m $= 1.02$ mm.`, { unit: 'mm' }),
  nat(4, 'rotating charged ring', r`A thin ring of radius 10 cm carries a charge of $2\ \mu$C spread uniformly and rotates at $100\ \mathrm{rad\,s^{-1}}$ about its axis. Find its magnetic moment (in $\mu\mathrm{A\,m^2}$, 1 decimal).`, 0.5 * 2e-6 * 100 * 0.01 / 1e-6, 0.05, 1,
    r`The equivalent current is $I = Q/T = \dfrac{Q\omega}{2\pi}$. $m = IA = \dfrac{Q\omega}{2\pi}\times\pi R^2 = \dfrac12Q\omega R^2 = \dfrac12\times2\times10^{-6}\times100\times0.01 = 1.0\times10^{-6}\ \mathrm{A\,m^2}$.`, { unit: 'μA m²' }),
  nat(4, 'minimum speed to cross a field', r`A proton moving at right angles to a field region's boundary has to cross a region of width 2 cm in which there is a field of 0.5 T. What is the minimum speed needed (in units of $10^{5}\ \mathrm{m\,s^{-1}}$, 1 decimal)? Take $m_p = 1.67\times10^{-27}$ kg.`, QE * 0.5 * 0.02 / MP / 1e5, 0.2, 1,
    r`The proton just crosses when the radius equals the width: $r = d$. $v = \dfrac{qBd}{m} = \dfrac{1.6\times10^{-19}\times0.5\times0.02}{1.67\times10^{-27}} = 9.58\times10^{5}\ \mathrm{m\,s^{-1}}$.`, { unit: '×10⁵ m/s' }),
  nat(4, 'concentric loops', r`Two concentric coplanar circular loops of radii 5 cm and 10 cm carry 2 A each, in opposite senses. Find the net field at the centre (in $\mu$T, 1 decimal).`, MU * 2 / (4 * 0.05) * 1e6, 0.1, 1,
    r`Inner loop: $\dfrac{\mu_0I}{2r_1} = \dfrac{\mu_0\times2}{0.1}$. Outer: $\dfrac{\mu_0\times2}{0.2}$, which is half as big. They oppose: $B = \mu_0\times2\times(10 - 5) = 4\pi\times10^{-7}\times10 = 1.26\times10^{-5}$ T $= 12.6\ \mu$T, in the direction of the inner loop's field.`, { unit: 'μT' }),
  mcq(4, 'ring with two paths', r`A uniform circular ring is connected to a battery through two long straight wires, along radii, joined at points A and B. The ring is made of two arcs, between A and B. The field at the centre of the ring due to the ring alone is`, 'zero', [r`$\mu_0I/2R$`, r`$\mu_0I/4R$`, 'in the plane of the ring'],
    r`The current divides in inverse proportion to the arc lengths, so $I_1l_1 = I_2l_2$. Field of an arc is $\dfrac{\mu_0I\theta}{4\pi R}\propto Il$. The two arcs give equal and opposite fields at the centre. (The long straight leads, if they run along radii, add nothing at the centre.) So the net field is zero.`, { trap: 'Do not forget the current divides unequally.' }),
  mcq(4, 'concentric loops', r`Two concentric coplanar circular loops have radii 10 cm and 20 cm. The net field at the centre is zero when the currents in the inner and outer loops are in the ratio and sense`, '1 : 2, opposite senses', ['1 : 2, same sense', '2 : 1, opposite senses', '1 : 1, opposite senses'],
    r`The fields are $\dfrac{\mu_0I_1}{2r_1}$ and $\dfrac{\mu_0I_2}{2r_2}$. For zero net field they must be equal and opposite: $\dfrac{I_1}{0.1} = \dfrac{I_2}{0.2}$, so $I_2 = 2I_1$. That is $I_1 : I_2 = 1 : 2$, with opposite senses.`),
  nat(4, 'tangent wire', r`A circular loop of radius 10 cm carries 1 A. A long straight insulated wire carrying 1 A lies along a tangent to the loop, in the plane of the loop, and its field at the centre is in the same direction as that of the loop. Find the field at the centre (in $\mu$T, 2 decimals).`, MU * 1 / (2 * 0.1) * (1 + 1 / Math.PI) * 1e6, 0.03, 2,
    r`The wire is a distance $R$ from the centre: $B_w = \dfrac{\mu_0I}{2\pi R}$. Loop: $B_l = \dfrac{\mu_0I}{2R}$. Sum $= \dfrac{\mu_0I}{2R}\left(1 + \dfrac1\pi\right) = \dfrac{4\pi\times10^{-7}}{0.2}\times1.318 = 8.28\times10^{-6}$ T $= 8.28\ \mu$T.`, { unit: 'μT' }),
  mcq(4, 'crossed fields', r`A proton released from rest in uniform crossed fields $\vec E = E\hat y$ and $\vec B = B\hat z$ moves along a cycloid. The average drift speed along $x$ is`, r`$E/B$`, [r`$2E/B$`, r`$E/2B$`, r`$B/E$`],
    r`In the frame moving at $v_d = E/B$ along $+x$ the electric force is cancelled by the magnetic force, and the particle only circles. In the lab frame the circular motion rides on top of a steady drift at $E/B$. The maximum speed (at the bottom of the cycloid) is $2E/B$, and the average (drift) speed is $E/B$.`, { trap: 'Do not confuse the maximum speed 2E/B with the drift speed E/B.' }),
  mcq(4, 'parallel E and B', r`A charged particle is released from rest in a region with parallel uniform fields $\vec E$ and $\vec B$. Its path is`, 'a straight line along the fields, with increasing speed', ['a circle', 'a helix of constant pitch', 'a cycloid'],
    r`It starts at rest, so the magnetic force is zero at first, and the electric force accelerates it along $\vec E$. The velocity stays parallel to $\vec B$, so the magnetic force remains zero. A straight line with constant acceleration.`),
  mcq(4, 'time in a field region', r`A charged particle enters a region of uniform magnetic field (bounded by a plane) with its velocity at $30^\circ$ to the boundary. It spends a time $t_1$ in the field for one direction of $\vec B$, and a longer time $t_2$ when $\vec B$ is reversed. The ratio $t_2/t_1$ is`, '2', ['1', '3', '5/3'],
    r`The particle moves on an arc of a circle until it meets the boundary again. For an entry angle $\alpha$ with the boundary, the angle turned is $180^\circ - 2\alpha = 120^\circ$ for one direction of the field and $180^\circ + 2\alpha = 240^\circ$ for the other. Both arcs have the same chord, $2r\sin\alpha$. The times are proportional to the angles, so $t_2/t_1 = 240/120 = 2$.`, { trap: 'The angle given is with the boundary, not with the normal.' }),
  asrt(4, 'Ampère law', r`In a long solenoid, the line integral $\oint\vec B\cdot d\vec l$ over a rectangular loop of length $l$ along the axis, with one side inside the winding and the opposite side far outside, is $\mu_0nIl$.`, r`The field outside an ideal long solenoid is zero.`, 1,
    r`The loop encloses $nl$ turns, so $\oint\vec B\cdot d\vec l = \mu_0nlI$: that is Ampère's law and A is true. R is also true, and it is what lets us get $B = \mu_0nI$ inside from this integral, but it is not the reason the integral equals $\mu_0nIl$.`),
  asrt(4, 'ring with two paths', r`In a ring supplied through two points A and B, the field at the centre due to the ring is always zero, whatever the positions of A and B.`, r`In a ring, the current in each arc is inversely proportional to its length.`, 0,
    r`Since $I_1l_1 = I_2l_2$ and an arc's field is proportional to $Il$, the two arcs produce equal and opposite fields at the centre. R is the reason for A.`),
  stm(4, 'torque on a loop', r`The torque on a planar current loop in a uniform field depends on the shape of the loop.`, r`The torque on a planar current loop in a uniform field depends on the area, the current, the number of turns and the orientation.`, 3,
    r`I is false: the torque is $\vec m\times\vec B$, with $m = NIA$, so only the area matters, not whether the loop is round, square or irregular. II is true.`, { trap: 'Only area, not shape.' }),
  stm(4, 'cyclotron', r`The period of revolution of a particle in a cyclotron depends on the speed of the particle.`, r`The frequency of the oscillator in a cyclotron is fixed for a given particle and field.`, 3,
    r`I is false: $T = 2\pi m/qB$ has no speed in it (as long as the speed is much less than $c$). II is true: this independence is what makes the fixed-frequency cyclotron work.`),
  stm(4, 'magnetic moment', r`An electron in a circular orbit has its magnetic moment antiparallel to its angular momentum.`, r`The ratio of the magnetic moment to the orbital angular momentum of an orbiting electron is $e/2m$.`, 0,
    r`For a negative charge the current is opposite to the motion, so $\vec\mu = -\dfrac{e}{2m}\vec L$: antiparallel, with magnitude ratio $e/2m$. Both statements are true.`),
  msq(4, 'crossed wires and fields', r`A charged particle moves in a plane perpendicular to a uniform magnetic field. Which statements are correct?`, [r`Its angular speed is $qB/m$ whatever its speed.`, r`Its radius is proportional to its momentum.`, r`The magnetic force does work on it.`, r`Its kinetic energy is constant.`], [0, 1, 3],
    r`$\omega = qB/m$ and $r = p/qB$. The force is perpendicular to $\vec v$, so it does no work and the kinetic energy is constant.`),
  msq(4, 'parallel wires', r`Three long parallel wires carry equal currents in the same direction and are placed at the corners of an equilateral triangle. Which statements about the force on one wire are correct?`, [r`The net force on a wire points towards the centroid of the triangle.`, r`The net force on each wire is zero.`, r`The magnitude of the net force on a wire is $\sqrt3$ times the force between two of them.`, r`The wires attract each other pairwise.`], [0, 2, 3],
    r`Like currents attract, so each pair attracts. On one wire, the two forces are equal in magnitude $F$ and $60^\circ$ apart, so the net is $2F\cos30^\circ = \sqrt3F$, along the bisector, towards the centroid.`),
  msq(4, 'torque and energy of a dipole', r`A magnetic dipole in a uniform field is displaced by a small angle from its stable equilibrium. Which statements are correct?`, [r`The net force on it is zero.`, r`It oscillates with $T = 2\pi\sqrt{I/mB}$.`, r`The potential energy is maximum at equilibrium.`, r`The torque tries to bring $\vec m$ parallel to $\vec B$.`], [0, 1, 3],
    r`The force on a dipole in a uniform field is zero. The restoring torque is $mB\sin\theta\approx mB\theta$. The potential energy $-mB\cos\theta$ is minimum, not maximum, at equilibrium.`),
  msq(4, 'galvanometer and meters', r`Which of the following are correct?`, [r`An ideal ammeter has zero resistance.`, r`An ideal voltmeter has infinite resistance.`, r`A voltmeter has a higher resistance than the galvanometer it is made from.`, r`An ammeter has a higher resistance than the galvanometer it is made from.`], [0, 1, 2],
    r`A shunt in parallel makes the ammeter resistance less than $G$; a series resistor makes the voltmeter resistance more than $G$.`),
  mat(4, 'instruments', 'm3', r`Match each quantity for a moving coil galvanometer with its expression (shunt $S$ to make a larger range, series $R$ for a voltmeter, field $B$, spring constant $k$, coil resistance $G$, full-scale current $I_g$).`, 'A-q, B-r, C-p, D-s', ['A-p, B-r, C-q, D-s', 'A-q, B-p, C-r, D-s', 'A-r, B-q, C-s, D-p'],
    r`The shunt for a range $I$ is $S = \dfrac{I_gG}{I - I_g}$ (q). The series resistance for a range $V$ is $R = \dfrac V{I_g} - G$ (r). The current sensitivity is $\phi/I = \dfrac{NAB}k$ (p). The voltage sensitivity is $\phi/V = \dfrac{NAB}{kG}$ for the coil alone (s).`),

  // ---------- Level 5 ----------
  nat(5, 'cycloid', r`A proton is released from rest in crossed fields $E = 1000\ \mathrm{V\,m^{-1}}$ along $y$ and $B = 0.1$ T along $z$. Find the greatest distance it gets from the starting line (in mm, 2 decimals). Take $m_p = 1.67\times10^{-27}$ kg.`, 2 * MP * 1e3 / (QE * 0.01) * 1e3, 0.02, 2,
    r`In the frame moving at $E/B$ the proton goes round a circle of radius $\dfrac{m(E/B)}{qB}$ (its speed in that frame is $E/B$). The greatest displacement along $\vec E$ is the diameter: $y_{max} = \dfrac{2mE}{qB^2} = \dfrac{2\times1.67\times10^{-27}\times1000}{1.6\times10^{-19}\times0.01} = 2.09\times10^{-3}$ m $= 2.09$ mm.`, { unit: 'mm', trap: 'The distance is a diameter, not a radius.' }),
  nat(5, 'charged rotating disc', r`A thin disc of radius 0.2 m carries a uniform surface charge of $2\ \mu\mathrm{C\,m^{-2}}$ and rotates at $50\ \mathrm{rad\,s^{-1}}$ about its axis. Find its magnetic moment (in units of $10^{-7}\ \mathrm{A\,m^2}$, 2 decimals).`, Math.PI * 2e-6 * 50 * 0.2 ** 4 / 4 / 1e-7, 0.02, 2,
    r`A ring of radius $r$ and width $dr$ carries $dq = \sigma2\pi r\,dr$, giving $dm = \dfrac{\omega}{2\pi}dq\,\pi r^2 = \pi\sigma\omega r^3dr$. Integrating, $m = \dfrac{\pi\sigma\omega R^4}{4} = \dfrac{\pi\times2\times10^{-6}\times50\times(0.2)^4}{4} = 1.257\times10^{-7}\ \mathrm{A\,m^2}$.`, { unit: '×10⁻⁷ A m²', trap: 'Integrate over rings: the moment grows as r³, not r².' }),
  nat(5, 'finite solenoid', r`A solenoid of length 0.4 m and radius 5 cm has 2000 turns per metre and carries 1 A. Find the field at its centre (in mT, 2 decimals). Use $B = \tfrac12\mu_0nI(\cos\theta_1 + \cos\theta_2)$.`, MU * 2000 * 0.2 / Math.sqrt(0.04 + 0.0025) * 1e3, 0.01, 2,
    r`At the centre $\cos\theta_1 = \cos\theta_2 = \dfrac{L/2}{\sqrt{(L/2)^2 + R^2}} = \dfrac{0.2}{\sqrt{0.04 + 0.0025}} = 0.970$. $B = \mu_0nI\cos\theta = 4\pi\times10^{-7}\times2000\times0.970 = 2.44\times10^{-3}$ T $= 2.44$ mT, a little below the ideal $\mu_0nI = 2.51$ mT.`, { unit: 'mT' }),
  nat(5, 'radial field on a ring', r`A circular ring of radius 5 cm carrying 3 A lies with its axis along a magnetic field that spreads out, so that at the ring the field has magnitude 0.2 T and makes $30^\circ$ with the axis. Find the net force on the ring (in N, 3 decimals).`, 2 * Math.PI * 0.05 * 3 * 0.2 * 0.5, 0.002, 3,
    r`Resolve $\vec B$ into an axial part $B\cos30^\circ$ and a radial part $B\sin30^\circ$. The axial part gives forces in the plane of the ring that cancel in pairs. The radial part is perpendicular to every element, giving forces along the axis, all in the same direction: $F = I(2\pi a)B\sin30^\circ = 3\times2\pi\times0.05\times0.2\times0.5 = 0.0942$ N.`, { unit: 'N', trap: 'Only the radial component of B contributes.' }),
  nat(5, 'non-uniform current density', r`A long cylindrical wire of radius 1 cm carries a current whose density increases linearly from the axis: $J = J_0r/R$, with $J_0 = 2\times10^{6}\ \mathrm{A\,m^{-2}}$. Find the field at $r = R/2$ (in mT, 2 decimals).`, MU * 2e6 * 0.01 / 12 * 1e3, 0.02, 2,
    r`Enclosed current at radius $r$: $I_{enc} = \int_0^r J_0\dfrac{r'}R\,2\pi r'dr' = \dfrac{2\pi J_0r^3}{3R}$. Then $B = \dfrac{\mu_0I_{enc}}{2\pi r} = \dfrac{\mu_0J_0r^2}{3R}$. At $r = R/2$: $B = \dfrac{\mu_0J_0R}{12} = \dfrac{4\pi\times10^{-7}\times2\times10^{6}\times0.01}{12} = 2.09\times10^{-3}$ T $= 2.09$ mT.`, { unit: 'mT' }),
  nat(5, 'Bohr magneton', r`Using $\mu = \dfrac{e}{2m}L$ with $L = \hbar = 1.055\times10^{-34}$ J s, find the magnetic moment of an electron with this angular momentum (in units of $10^{-24}\ \mathrm{A\,m^2}$, 2 decimals).`, QE * 1.055e-34 / (2 * ME) / 1e-24, 0.03, 2,
    r`$\mu = \dfrac{eL}{2m} = \dfrac{1.6\times10^{-19}\times1.055\times10^{-34}}{2\times9.1\times10^{-31}} = 9.27\times10^{-24}\ \mathrm{A\,m^2}$. This is the Bohr magneton.`, { unit: '×10⁻²⁴ A m²' }),
  asrt(5, 'cycloid', r`A charged particle released from rest in crossed uniform electric and magnetic fields moves in a straight line.`, r`The net force on a particle at rest is only electric, so it starts along the field.`, 3,
    r`A is false: the particle starts along $\vec E$, picks up speed, the magnetic force then bends it, and the path is a cycloid (it does not go straight; it drifts along $\vec E\times\vec B$). R is true, as the magnetic force is zero at the start.`),
  asrt(5, 'magnetic dipole', r`The net force on a current loop in a non-uniform magnetic field can be non-zero.`, r`The forces on the different elements of the loop are different when the field changes from place to place.`, 0,
    r`In a uniform field, $\oint d\vec l = 0$ gives zero net force. In a non-uniform field the element forces $Id\vec l\times\vec B(\vec r)$ do not sum to zero; this is why a magnet attracts a small coil. R explains A.`),
  stm(5, 'magnetic moment', r`A charged particle moving on a circle in a magnetic field has an orbital magnetic moment that is directed opposite to the field.`, r`The magnitude of this moment is $K/B$, where $K$ is the kinetic energy of the particle.`, 0,
    r`Take speed $v$: $r = \dfrac{mv}{qB}$, $\omega = \dfrac{qB}{m}$. The equivalent current has magnitude $\dfrac{|q|\omega}{2\pi}$ and the area is $\pi r^2$, so $\mu = \tfrac12|q|\omega r^2 = \dfrac{mv^2}{2B} = \dfrac KB$. The sense of circulation is such that the loop's own field inside opposes the applied field, for either sign of charge (a negative charge circulates the other way, but its current is reversed again). Both statements are true.`, { trap: 'Both signs of charge give a moment opposing B.' }),
  stm(5, 'motion in a magnetic field', r`If an electric field is also present along the field direction, a charged particle moves on a helix with a pitch that increases with time.`, r`The radius of the helix stays constant.`, 0,
    r`The component along $\vec B$ is accelerated by $\vec E$, so the pitch grows. The perpendicular component $v_\perp$ is unaffected, so the radius $mv_\perp/qB$ stays constant. Both are true.`),
  msq(5, 'crossed fields', r`A proton is released from rest in crossed fields $\vec E = E\hat y$, $\vec B = B\hat z$. Which are correct?`, [r`The path is a cycloid.`, r`The greatest speed reached is $2E/B$.`, r`The average drift velocity is $E/B$ along $+\hat x$.`, r`The proton moves in a circle.`], [0, 1, 2],
    r`In the frame moving at $E/B$ along $\hat x$ the proton goes round a circle at speed $E/B$. Adding the drift gives a cycloid (not a circle) whose average velocity is $E/B$ along $\hat x = \hat y\times\hat z$. The speed varies from 0 (at the cusps, where the particle is at rest again) to $2E/B$ (at the point farthest from the starting line).`),
  msq(5, 'cavity in a conductor', r`A long cylindrical conductor of radius $R$ carries a uniform current density $J$ along its length. It has a cylindrical cavity of radius $a$ whose axis is displaced by $\vec d$ from the axis of the conductor. Which are correct?`, [r`The field in the cavity is uniform.`, r`The field in the cavity has magnitude $\mu_0Jd/2$.`, r`The field in the cavity depends on $a$.`, r`The field in the cavity is zero.`], [0, 1],
    r`Superposition of a solid cylinder (density $J$) and a cylinder in the hole (density $-J$): the result inside the hole is $\dfrac{\mu_0}2\vec J\times\vec d$, uniform and independent of $a$.`),
  msq(5, 'helical motion', r`A charged particle moves on a helix in a uniform magnetic field. Which are correct?`, [r`The pitch is proportional to $v\cos\theta$, with $\theta$ the angle between $\vec v$ and $\vec B$.`, r`The radius is proportional to $v\sin\theta$.`, r`The period depends on $\theta$.`, r`The projection of the motion perpendicular to $\vec B$ is a circle traced at constant speed.`], [0, 1, 3],
    r`Pitch $= v\cos\theta\times\dfrac{2\pi m}{qB}$, radius $= \dfrac{mv\sin\theta}{qB}$. The period $\dfrac{2\pi m}{qB}$ has no $\theta$ in it. The perpendicular projection is a uniform circular motion.`),
);
const groups = {
  m1: { title: 'Fields of current distributions',
    list1: ['A. Long straight wire, at distance $r$', 'B. Centre of a circular loop of radius $R$', 'C. Inside a long solenoid ($n$ turns per metre)', 'D. Inside a toroid ($N$ turns, mean radius $r$)'],
    list2: [r`p. $\dfrac{\mu_0I}{2\pi r}$`, r`q. $\dfrac{\mu_0I}{2R}$`, r`r. $\mu_0nI$`, r`s. $\dfrac{\mu_0NI}{2\pi r}$`] },
  m2: { title: 'Motion of a charge in a uniform magnetic field',
    list1: ['A. Velocity parallel to $\\vec B$', 'B. Velocity perpendicular to $\\vec B$', 'C. Velocity at an angle (not $0^\\circ$ or $90^\\circ$) to $\\vec B$', 'D. Particle at rest'],
    list2: ['p. Circle', 'q. Straight line at constant speed', 'r. Helix', 's. Stays at rest'] },
  m3: { title: 'Meter conversions and sensitivity',
    list1: ['A. Shunt to extend the range to $I$ (coil resistance $G$, full-scale current $I_g$)', 'B. Series resistance to make a voltmeter of range $V$', 'C. Current sensitivity $\\phi/I$ of a coil', 'D. Voltage sensitivity $\\phi/V$ of a coil'],
    list2: [r`p. $\dfrac{NAB}{k}$`, r`q. $\dfrac{I_gG}{I - I_g}$`, r`r. $\dfrac{V}{I_g} - G$`, r`s. $\dfrac{NAB}{kG}$`] },
  m4: { title: 'Formulas of devices',
    list1: ['A. Frequency of a cyclotron', 'B. Final kinetic energy of a cyclotron (dee radius $R$)', 'C. Speed selected by a velocity selector', 'D. Radius in a mass spectrometer'],
    list2: [r`p. $\dfrac{q^2B^2R^2}{2m}$`, r`q. $\dfrac{qB}{2\pi m}$`, r`r. $\dfrac EB$`, r`s. $\dfrac{mv}{qB}$`] },
  p1: { title: 'Two parallel wires',
    passage: r`<p>Two long straight parallel wires, 20 cm apart, carry 6 A and 9 A in the same direction. Use $\mu_0/2\pi = 2\times10^{-7}\ \mathrm{T\,m\,A^{-1}}$.</p>` },
  p2: { title: 'A moving coil galvanometer',
    passage: r`<p>A galvanometer has a coil of 100 turns and area $6\times10^{-4}\ \mathrm{m^2}$ in a radial field of 0.2 T. The torsion constant of the spring is $2.4\times10^{-5}\ \mathrm{N\,m\,rad^{-1}}$. The coil resistance is $40\ \Omega$ and it gives full-scale deflection for a current of 1 mA.</p>` },
  p3: { title: 'A proton crossing a field region',
    passage: r`<p>A proton ($m = 1.67\times10^{-27}$ kg) moving at $4\times10^{6}\ \mathrm{m\,s^{-1}}$ enters, at right angles to its boundary, a region of width 0.1 m in which there is a uniform field of 0.2 T perpendicular to the velocity.</p>` },
};

items.push(
  mat(2, 'fields of current distributions', 'm1', r`Match each situation in List I with the field in List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-s, B-q, C-r, D-p'],
    r`A long wire gives $\mu_0I/2\pi r$ (p). The centre of a single loop gives $\mu_0I/2R$ (q). A long solenoid gives $\mu_0nI$ (r). A toroid gives $\mu_0NI/2\pi r$ (s); note the solenoid result is the same formula with $n = N/2\pi r$.`),
  mat(3, 'motion in a field', 'm2', r`A charged particle enters a uniform magnetic field. Match the initial velocity with the path.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-r, C-p, D-s', 'A-s, B-p, C-r, D-q'],
    r`Parallel: no force, a straight line at constant speed (q). Perpendicular: a circle (p). Any other angle: a helix (r). At rest: no force, so it stays at rest (s).`),
  mat(4, 'devices', 'm4', r`Match each device quantity with its formula.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'],
    r`$f = qB/2\pi m$ (q). $K_{max} = q^2B^2R^2/2m$ (p). $v = E/B$ (r). $r = mv/qB$ (s).`),

  // passages
  pas(2, 'force between wires', 'p1', r`Find the force per unit length between the wires (in $\mu\mathrm{N\,m^{-1}}$).`, 2e-7 * 54 / 0.2 * 1e6, 0.5, 1,
    r`$\dfrac Fl = \dfrac{\mu_0I_1I_2}{2\pi d} = \dfrac{2\times10^{-7}\times6\times9}{0.2} = 5.4\times10^{-5}\ \mathrm{N\,m^{-1}} = 54\ \mu\mathrm{N\,m^{-1}}$ (attractive).`, { unit: 'μN/m' }),
  pas(3, 'field of two wires', 'p1', r`Find the field at the midpoint between the wires (in $\mu$T).`, 6, 0.1, 1,
    r`Each wire is 10 cm away. Between the wires, the two fields point in opposite directions. $B = 2\times10^{-7}\left(\dfrac{9}{0.1} - \dfrac{6}{0.1}\right) = 6\times10^{-6}$ T $= 6\ \mu$T.`, { unit: 'μT', trap: 'The fields subtract between like currents.' }),
  pas(4, 'neutral point', 'p1', r`At what distance from the 6 A wire, between them, is the field zero (in cm, 1 decimal)?`, 8, 0.1, 1,
    r`$\dfrac{6}{x} = \dfrac{9}{20 - x}$ gives $6(20 - x) = 9x$, so $120 = 15x$ and $x = 8$ cm.`, { unit: 'cm' }),
  pas(3, 'moving coil galvanometer', 'p2', r`Find the deflection of the coil for a current of 1 mA (in degrees, 1 decimal).`, 0.012 * 1e-3 / 2.4e-5 * 180 / Math.PI, 0.2, 1,
    r`$\phi = \dfrac{NABI}{k} = \dfrac{100\times6\times10^{-4}\times0.2\times10^{-3}}{2.4\times10^{-5}} = 0.50$ rad $= 28.6^\circ$.`, { unit: '°' }),
  pas(3, 'converting to an ammeter', 'p2', r`Find the shunt needed to make a 0 to 0.5 A ammeter (in $\Omega$, 4 decimals).`, 40 * 0.001 / 0.499, 0.0005, 4,
    r`$S = \dfrac{I_gG}{I - I_g} = \dfrac{0.001\times40}{0.499} = 0.0802\ \Omega$.`, { unit: 'Ω' }),
  pas(2, 'converting to a voltmeter', 'p2', r`Find the series resistance needed to make a 0 to 5 V voltmeter (in $\Omega$).`, 4960, 1, 0,
    r`Total $= 5/0.001 = 5000\ \Omega$. Series $= 5000 - 40 = 4960\ \Omega$.`, { unit: 'Ω' }),
  pas(3, 'circular motion', 'p3', r`Find the radius of the proton's circle in the field (in cm, 1 decimal).`, MP * 4e6 / (QE * 0.2) * 100, 0.2, 1,
    r`$r = \dfrac{mv}{qB} = \dfrac{1.67\times10^{-27}\times4\times10^{6}}{1.6\times10^{-19}\times0.2} = 0.2088$ m $= 20.9$ cm.`, { unit: 'cm' }),
  pas(4, 'deflection in a field region', 'p3', r`Find the angle through which the proton is deviated when it leaves the region (in degrees, 1 decimal).`, Math.asin(0.1 / (MP * 4e6 / (QE * 0.2))) * 180 / Math.PI, 0.2, 1,
    r`$\sin\theta = \dfrac dr = \dfrac{0.1}{0.2088} = 0.479$, so $\theta = 28.6^\circ$.`, { unit: '°' }),
  pas(4, 'time in a field', 'p3', r`Find the time the proton spends in the field (in ns, 1 decimal).`, (() => { const rr = MP * 4e6 / (QE * 0.2); return Math.asin(0.1 / rr) * rr / 4e6 * 1e9; })(), 0.3, 1,
    r`The arc turns through $\theta = 0.4996$ rad at constant speed: $t = \dfrac{r\theta}{v} = \dfrac{0.2088\times0.4996}{4\times10^{6}} = 2.61\times10^{-8}$ s $= 26.1$ ns.`, { unit: 'ns' }),
  pas(5, 'minimum speed to cross', 'p3', r`What is the minimum speed with which this proton could still cross the whole region (in units of $10^{6}\ \mathrm{m\,s^{-1}}$, 2 decimals)?`, QE * 0.2 * 0.1 / MP / 1e6, 0.02, 2,
    r`The limiting path just touches the far boundary: $r = d = 0.1$ m. $v = \dfrac{qBd}{m} = \dfrac{1.6\times10^{-19}\times0.2\times0.1}{1.67\times10^{-27}} = 1.92\times10^{6}\ \mathrm{m\,s^{-1}}$.`, { unit: '×10⁶ m/s' }),

  // level 2 assertion / statements
  asrt(2, 'magnetic force', r`A magnetic field can change the direction of motion of a charged particle but not its speed.`, r`The magnetic force on a moving charge is always perpendicular to its velocity.`, 0,
    r`A force perpendicular to $\vec v$ does no work, so the speed stays constant while the direction changes. R is the reason.`),
  asrt(2, 'forces between wires', r`Two parallel wires carrying currents in opposite directions repel each other.`, r`The magnetic field of one wire at the position of the other wire is perpendicular to the plane of the two wires.`, 1,
    r`Both true. The second is a true fact (the field circles the wire, so at the neighbouring wire it is perpendicular to the plane containing both wires), but the direction of the force needs $\vec I\times\vec B$: R alone does not explain repulsion.`),
  stm(2, 'solenoid', r`The magnetic field inside a long solenoid does not depend on the distance from the axis.`, r`The magnetic field inside a long solenoid is $\mu_0nI$.`, 0,
    r`Ampère's law gives the same $B = \mu_0nI$ at every point inside a long solenoid. Both are true.`),
  stm(2, 'galvanometer', r`A galvanometer is converted into an ammeter by connecting a shunt in series with it.`, r`A galvanometer is converted into a voltmeter by connecting a high resistance in series with it.`, 3,
    r`I is false: the shunt is in parallel. II is true.`),

  // mixed and extras
  nat(3, 'mixed: accelerating voltage then field', r`A proton is accelerated from rest through 2 kV and then enters a uniform field of 0.2 T at right angles. How long does it take to complete half a circle (in ns, 1 decimal)?`, Math.PI * MP / (QE * 0.2) * 1e9, 0.3, 1,
    r`The half-period is $\dfrac{T}2 = \dfrac{\pi m}{qB} = \dfrac{\pi\times1.67\times10^{-27}}{1.6\times10^{-19}\times0.2} = 1.64\times10^{-7}$ s $= 164$ ns. The accelerating voltage only changes the radius, not the time.`, { unit: 'ns', sub: 'mixed', trap: 'The time for half a circle does not depend on the speed.' }),
  nat(3, 'mixed: wire suspended by magnetic force', r`A straight wire of mass 20 g and length 0.5 m is hung horizontally by two light threads in a horizontal field of 0.4 T, perpendicular to the wire. What current makes the tension in the threads zero (in A, 2 decimals; $g = 9.8\ \mathrm{m\,s^{-2}}$)?`, 0.02 * 9.8 / (0.4 * 0.5), 0.01, 2,
    r`The magnetic force $BIL$ must point upward and balance the weight: $BIL = mg$. $I = \dfrac{0.02\times9.8}{0.4\times0.5} = 0.98$ A.`, { unit: 'A', sub: 'mixed' }),
  nat(4, 'mixed: rod on an incline', r`A metal rod of mass 0.1 kg and length 0.5 m rests on two smooth rails inclined at $30^\circ$ and carries 2 A. A vertical field keeps it in equilibrium. Find the field (in T, 3 decimals; $g = 9.8\ \mathrm{m\,s^{-2}}$).`, 0.1 * 9.8 * Math.tan(Math.PI / 6) / (2 * 0.5), 0.004, 3,
    r`With a vertical field, the magnetic force $BIL$ is horizontal. Along the incline: $BIL\cos30^\circ = mg\sin30^\circ$, so $B = \dfrac{mg\tan30^\circ}{IL} = \dfrac{0.1\times9.8\times0.5774}{1} = 0.566$ T.`, { unit: 'T', sub: 'mixed', trap: 'The force is horizontal, so only its component along the slope balances the weight component.' }),
  nat(3, 'mixed: galvanometer as an ohmmeter', r`A galvanometer of resistance $50\ \Omega$ and full-scale current 1 mA is connected to a 1.5 V cell (negligible internal resistance) with a series resistor chosen so that the deflection is full when the terminals are shorted. An unknown resistor connected across the terminals then gives half the full-scale deflection. Find its value (in $\Omega$).`, 1500, 1, 0,
    r`For full scale, total resistance $= 1.5/0.001 = 1500\ \Omega$ (the series resistor is $1450\ \Omega$). Half deflection means half the current: the total resistance is $3000\ \Omega$, so the unknown is $1500\ \Omega$.`, { unit: 'Ω', sub: 'mixed' }),
  mcq(2, 'mixed: speed of light', r`Using $\mu_0 = 4\pi\times10^{-7}\ \mathrm{T\,m\,A^{-1}}$ and $\varepsilon_0 = 8.85\times10^{-12}\ \mathrm{C^2\,N^{-1}m^{-2}}$, the quantity $1/\sqrt{\mu_0\varepsilon_0}$ is about`, r`$3\times10^{8}\ \mathrm{m\,s^{-1}}$`, [r`$3\times10^{5}\ \mathrm{m\,s^{-1}}$`, r`$9\times10^{16}\ \mathrm{m\,s^{-1}}$`, r`$1.1\times10^{-17}\ \mathrm{m\,s^{-1}}$`],
    r`$\mu_0\varepsilon_0 = 4\pi\times10^{-7}\times8.85\times10^{-12} = 1.112\times10^{-17}$, and $1/\sqrt{1.112\times10^{-17}} = 3.0\times10^{8}\ \mathrm{m\,s^{-1}}$. It is the speed of light in vacuum.`, { sub: 'mixed' }),
  mcq(3, 'graph of B against r', r`A long cylindrical wire of radius $R$ carries a current uniformly spread over its cross-section. The graph of $B$ against distance $r$ from the axis is`, r`a straight line from the origin up to $r = R$, then a curve falling as $1/r$`, [r`a curve falling as $1/r$ for all $r$, including inside`, r`zero up to $r = R$, then falling as $1/r$`, r`a straight line from the origin that keeps rising`],
    r`Inside, $B = \dfrac{\mu_0Ir}{2\pi R^2}\propto r$. Outside, $B = \dfrac{\mu_0I}{2\pi r}\propto1/r$. The two agree at $r = R$, where $B$ is greatest. (Zero inside is true for a hollow tube, not for a solid wire.)`, { trap: 'A solid wire has a field inside; a hollow tube does not.' }),
  mcq(3, 'NOT correct', r`Which statement about the Biot-Savart law is NOT correct?`, r`The field of a current element is along the current element`, [r`The field of an element is proportional to $Idl\sin\theta/r^2$`, r`The field of an element is perpendicular to the plane containing $d\vec l$ and $\vec r$`, r`The field of an element is zero along the line of the element`],
    r`$d\vec B = \dfrac{\mu_0}{4\pi}\dfrac{I\,d\vec l\times\hat r}{r^2}$. The field is perpendicular to both $d\vec l$ and $\vec r$, never along $d\vec l$. It is zero at points on the line of the element (where $\theta = 0$).`, { trap: 'The question asks for the statement that is wrong.' }),
  mcq(3, 'unit of mu_0', r`Which is a correct unit of the permeability of free space $\mu_0$?`, r`$\mathrm{T\,m\,A^{-1}}$`, [r`$\mathrm{T\,m^{-1}\,A}$`, r`$\mathrm{T\,A\,m^{-2}}$`, r`$\mathrm{N\,A^{2}\,m}$`],
    r`From $B = \dfrac{\mu_0I}{2\pi r}$: $\mu_0 = \dfrac{2\pi rB}{I}$, so the unit is $\mathrm{T\,m\,A^{-1}}$. It is also $\mathrm{N\,A^{-2}}$ and $\mathrm{H\,m^{-1}}$.`),
  mcq(3, 'sign and direction', r`A long straight wire carries current to the right. A positive charge moves to the right just above the wire (in the plane of the page, a field above the wire points out of the page). The force on the charge is`, 'towards the wire', ['away from the wire', 'out of the page', 'into the page'],
    r`The field above the wire points out of the page ($\vec I\times\hat r$: right $\times$ up $= +$ out). $\vec F = q\vec v\times\vec B = $ right $\times$ out $= $ down (towards the wire). Parallel currents attract, which agrees.`),
  mcq(3, 'force on a wire near a magnet', r`The current in a wire placed in a field is doubled and the length of the wire in the field is also doubled. The force becomes`, '4 times', ['2 times', '8 times', '16 times'],
    r`$F = BIL$, so $F\propto I\times L$: $2\times2 = 4$.`),
  mcq(3, 'electron in crossed fields', r`An electron moving at $2\times10^{6}\ \mathrm{m\,s^{-1}}$ passes undeflected through crossed fields with $B = 0.05$ T. The electric field is`, r`$1\times10^{5}\ \mathrm{V\,m^{-1}}$`, [r`$4\times10^{7}\ \mathrm{V\,m^{-1}}$`, r`$2.5\times10^{-8}\ \mathrm{V\,m^{-1}}$`, r`$1\times10^{-1}\ \mathrm{V\,m^{-1}}$`],
    r`$E = vB = 2\times10^{6}\times0.05 = 1\times10^{5}\ \mathrm{V\,m^{-1}}$. The charge cancels, so the electron and a proton at the same speed behave alike.`),
  mcq(4, 'inverse-square trap', r`The field on the axis of a circular loop at a distance $x\gg R$ varies as`, r`$1/x^3$`, [r`$1/x$`, r`$1/x^2$`, r`$1/x^4$`],
    r`$B = \dfrac{\mu_0IR^2}{2(R^2 + x^2)^{3/2}}\to\dfrac{\mu_0IR^2}{2x^3}$. The loop is a magnetic dipole: $B = \dfrac{\mu_0}{4\pi}\dfrac{2m}{x^3}$.`, { trap: 'A dipole field falls as 1/x³, not 1/x² (that is for a monopole).' }),
  mcq(4, 'torque on loops of different shapes', r`A circular loop and a square loop of the same perimeter carry the same current in the same field with the same orientation. The torque is greater on`, 'the circular loop', ['the square loop', 'neither: they are equal', 'the loop with the larger number of sides'],
    r`$\tau = IAB\sin\theta$. For a fixed perimeter, the circle has the largest area ($\pi r^2$ with $2\pi r = P$ gives $P^2/4\pi$, against $P^2/16$ for the square). So the circle has more torque.`, { trap: 'The torque depends on the area, and for the same perimeter the areas differ.' }),
);
const gens = [
  { id: 'mc-g01', type: 'nat', level: 1, exams: exFor(1, 'nat'), sub: 'magnetic force on a charge',
    make(rng) {
      const q = choose(rng, [2, 3, 5, 8]); const v = choose(rng, [1, 2, 4, 5]) * 1e3; const B = choose(rng, [0.2, 0.4, 0.5, 0.8]); const th = choose(rng, [30, 90, 90, 45, 60]);
      const F = q * 1e-6 * v * B * Math.sin(th * Math.PI / 180) * 1e3;
      return { q0: q, v, B, th, q: `A charge of ${q} $\\mu$C moves at ${tx(v)} $\\mathrm{m\\,s^{-1}}$ at ${th}$^\\circ$ to a field of ${B} T. Find the magnetic force on it (in mN, 3 decimals).`, answer: N(F, 3), tol: 0.002, unit: 'mN',
        sol: `$F = qvB\\sin\\theta = ${q}\\times10^{-6}\\times${tx(v)}\\times${B}\\times\\sin${th}^\\circ = ${S(F, 4)}\\times10^{-3}$ N $= ${S(F, 3)}$ mN.`, trap: 'Use the angle between velocity and field, and convert microcoulombs.' };
    },
    verify: (p) => (p.q0 * 1e-6) * p.v * p.B * Math.sin(p.th * Math.PI / 180) * 1e3 },
  { id: 'mc-g02', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'circular motion',
    make(rng) {
      const v = choose(rng, [1, 2, 3, 4, 5]) * 1e6; const B = choose(rng, [0.1, 0.2, 0.25, 0.5, 1]);
      const rcm = MP * v / (QE * B) * 100;
      return { v, B, q: `A proton enters a uniform field of ${B} T at right angles with a speed of ${tx(v)} $\\mathrm{m\\,s^{-1}}$. Find the radius of its circular path (in cm, 2 decimals). Take $m_p = 1.67\\times10^{-27}$ kg.`, answer: N(rcm, 2), tol: 0.02, unit: 'cm',
        sol: `$r = \\dfrac{mv}{qB} = \\dfrac{1.67\\times10^{-27}\\times${tx(v)}}{1.6\\times10^{-19}\\times${B}} = ${S(rcm / 100, 4)}$ m $= ${S(rcm)}$ cm.` };
    },
    verify: (p) => { const w = QE * p.B / MP; return p.v / w * 100; } },
  { id: 'mc-g03', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'cyclotron frequency',
    make(rng) {
      const part = choose(rng, [['proton', 1.67e-27, 1], ['deuteron', 3.34e-27, 1], ['alpha particle', 6.68e-27, 2]]); const B = choose(rng, [0.5, 1, 1.2, 1.5, 2]);
      const f = part[2] * QE * B / (2 * Math.PI * part[1]) / 1e6;
      return { B, m: part[1], z: part[2], q: `Find the cyclotron frequency of a ${part[0]} (mass $${tx(part[1])}$ kg, charge $${part[2]}e$) in a field of ${B} T (in MHz, 2 decimals).`, answer: N(f, 2), tol: 0.03, unit: 'MHz',
        sol: `$f = \\dfrac{qB}{2\\pi m} = \\dfrac{${part[2]}\\times1.6\\times10^{-19}\\times${B}}{2\\pi\\times${tx(part[1])}} = ${S(f * 1e6, 4)}$ Hz $= ${S(f)}$ MHz.`, trap: 'The frequency does not depend on the speed.' };
    },
    verify: (p) => 1 / (2 * Math.PI * p.m / (p.z * QE * p.B)) / 1e6 },
  { id: 'mc-g04', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'motion after acceleration',
    make(rng) {
      const V = choose(rng, [100, 200, 400, 800, 1000]); const B = choose(rng, [1, 2, 5]) * 1e-3;
      const rcm = Math.sqrt(2 * ME * V / QE) / B * 100;
      return { V, B, q: `An electron is accelerated from rest through ${V} V and enters a field of ${S(B * 1e3)} mT at right angles. Find the radius of its path (in cm, 2 decimals).`, answer: N(rcm, 2), tol: 0.03, unit: 'cm',
        sol: `$v = \\sqrt{2eV/m} = \\sqrt{\\dfrac{2\\times1.6\\times10^{-19}\\times${V}}{9.1\\times10^{-31}}} = ${tx(Math.sqrt(2 * QE * V / ME))}\\ \\mathrm{m\\,s^{-1}}$. $r = \\dfrac{mv}{eB} = ${S(rcm)}$ cm.` };
    },
    verify: (p) => { const v = Math.sqrt(2 * QE * p.V / ME); return ME * v / (QE * p.B) * 100; } },
  { id: 'mc-g05', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'velocity selector',
    make(rng) {
      const E = choose(rng, [2, 4, 5, 6]) * 1e4; const B = choose(rng, [0.1, 0.2, 0.25, 0.5]); const v = E / B;
      const o = numOpts(rng, v, [E * B, B / E, v * 2], 'm/s', 3);
      return { E, B, ...o, q: `In a velocity selector, the electric field is ${tx(E)} V/m and the magnetic field is ${B} T. The speed of the particles that pass undeflected is`,
        sol: `$qE = qvB$, so $v = E/B = ${tx(E)}/${B} = ${tx(v)}\\ \\mathrm{m\\,s^{-1}}$. The wrong choices come from multiplying $E$ and $B$, inverting the ratio, or doubling.` };
    },
    verify: (p) => p.options.indexOf(`${fmt(p.E / p.B, 3)} m/s`) },
  { id: 'mc-g06', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'force on a wire',
    make(rng) {
      const I = choose(rng, [2, 3, 5, 8]); const L = choose(rng, [0.2, 0.3, 0.5, 0.8]); const B = choose(rng, [0.1, 0.25, 0.4, 0.6]); const th = choose(rng, [30, 90, 90, 37, 53]);
      const sin = { 30: 0.5, 90: 1, 37: 0.6, 53: 0.8 }[th]; const F = B * I * L * sin;
      return { I, L, B, sin, q: `A wire of length ${L} m carrying ${I} A lies in a uniform field of ${B} T, making ${th}$^\\circ$ with the field. Find the force on it (in N, 3 decimals). Use $\\sin37^\\circ = 0.6$ and $\\sin53^\\circ = 0.8$ if needed.`, answer: N(F, 3), tol: 0.002, unit: 'N',
        sol: `$F = BIL\\sin\\theta = ${B}\\times${I}\\times${L}\\times${sin} = ${S(F, 3)}$ N.`, trap: 'The angle is between the wire and the field.' };
    },
    verify: (p) => p.I * p.L * p.B * p.sin },
  { id: 'mc-g07', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'Biot-Savart for an arc',
    make(rng) {
      const I = choose(rng, [2, 3, 4, 5, 6]); const R = choose(rng, [0.05, 0.1, 0.2, 0.25]); const th = choose(rng, [30, 45, 60, 90, 120, 180, 270]);
      const B = 1e-7 * I * (th * Math.PI / 180) / R * 1e6;
      return { I, R, th, q: `An arc subtending ${th}$^\\circ$ at its centre, of radius ${S(R * 100)} cm, carries ${I} A. Find the field at the centre (in $\\mu$T, 2 decimals).`, answer: N(B, 2), tol: 0.02, unit: 'μT',
        sol: `$B = \\dfrac{\\mu_0I}{4\\pi R}\\theta = \\dfrac{10^{-7}\\times${I}}{${R}}\\times${S(th * Math.PI / 180, 4)} = ${S(B, 4)}\\times10^{-6}$ T $= ${S(B)}\\ \\mu$T.`, trap: 'The angle goes in radians.' };
    },
    verify: (p) => (MU * p.I / (2 * p.R)) * (p.th / 360) * 1e6 },
  { id: 'mc-g08', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'field on the axis of a loop',
    make(rng) {
      const N0 = choose(rng, [1, 10, 20, 50]); const I = choose(rng, [1, 2, 3]); const R = choose(rng, [0.1, 0.12, 0.2]); const x = choose(rng, [0.05, 0.09, 0.16, 0.15]);
      const B = MU * N0 * I * R * R / (2 * Math.pow(R * R + x * x, 1.5)) * 1e6;
      return { N0, I, R, x, q: `A coil of ${N0} turn${N0 > 1 ? 's' : ''} and radius ${S(R * 100)} cm carries ${I} A. Find the field on its axis at ${S(x * 100)} cm from the centre (in $\\mu$T, 2 decimals).`, answer: N(B, 2), tol: 0.03 + B * 0.002, unit: 'μT',
        sol: `$B = \\dfrac{\\mu_0NIR^2}{2(R^2 + x^2)^{3/2}}$ with $R^2 + x^2 = ${S(R * R + x * x, 4)}$, so $(R^2 + x^2)^{3/2} = ${tx(Math.pow(R * R + x * x, 1.5), 4)}$. $B = ${S(B, 4)}\\ \\mu$T.` };
    },
    verify: (p) => { const cos = p.R / Math.hypot(p.R, p.x); return MU * p.N0 * p.I / (2 * p.R) * cos ** 3 * 1e6; } },
  { id: 'mc-g09', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'solenoid',
    make(rng) {
      const Nt = choose(rng, [200, 400, 500, 800, 1000]); const L = choose(rng, [0.2, 0.25, 0.4, 0.5]); const I = choose(rng, [0.5, 1, 2, 3]);
      const B = MU * Nt / L * I * 1e3;
      return { Nt, L, I, q: `A solenoid with ${Nt} turns and length ${L} m carries ${I} A. Find the field near its middle (in mT, 2 decimals).`, answer: N(B, 2), tol: 0.02, unit: 'mT',
        sol: `$n = ${Nt}/${L} = ${S(Nt / L)}\\ \\mathrm{m^{-1}}$. $B = \\mu_0nI = 4\\pi\\times10^{-7}\\times${S(Nt / L)}\\times${I} = ${S(B, 4)}$ mT.` };
    },
    verify: (p) => 4e-7 * Math.PI * (p.Nt / p.L) * p.I * 1e3 },
  { id: 'mc-g10', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'toroid',
    make(rng) {
      const Nt = choose(rng, [500, 1000, 1200, 2000]); const r = choose(rng, [0.1, 0.15, 0.2, 0.25]); const I = choose(rng, [0.5, 1, 2, 4]);
      const B = 2e-7 * Nt * I / r * 1e3;
      return { Nt, r, I, q: `A toroid of ${Nt} turns has a mean radius of ${S(r * 100)} cm and carries ${I} A. Find the field in its core (in mT, 2 decimals).`, answer: N(B, 2), tol: 0.02, unit: 'mT',
        sol: `$B = \\dfrac{\\mu_0NI}{2\\pi r} = \\dfrac{2\\times10^{-7}\\times${Nt}\\times${I}}{${r}} = ${S(B, 4)}\\times10^{-3}$ T $= ${S(B)}$ mT.` };
    },
    verify: (p) => MU * (p.Nt / (2 * Math.PI * p.r)) * p.I * 1e3 },
  { id: 'mc-g11', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'force between wires',
    make(rng) {
      const I1 = choose(rng, [5, 10, 15, 20]); const I2 = choose(rng, [4, 8, 12, 30]); const d = choose(rng, [0.05, 0.1, 0.2, 0.25]);
      const F = 2e-7 * I1 * I2 / d * 1e6;
      return { I1, I2, d, q: `Two long parallel wires ${S(d * 100)} cm apart carry ${I1} A and ${I2} A. Find the force per metre between them (in $\\mu\\mathrm{N\\,m^{-1}}$).`, answer: N(F, 1), tol: 0.2, unit: 'μN/m',
        sol: `$\\dfrac Fl = \\dfrac{\\mu_0I_1I_2}{2\\pi d} = \\dfrac{2\\times10^{-7}\\times${I1}\\times${I2}}{${d}} = ${S(F, 4)}\\times10^{-6}\\ \\mathrm{N\\,m^{-1}}$.` };
    },
    verify: (p) => MU * p.I1 * p.I2 / (2 * Math.PI * p.d) * 1e6 },
  { id: 'mc-g12', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'torque on a loop',
    make(rng) {
      const Nt = choose(rng, [10, 20, 50, 100]); const a = choose(rng, [0.05, 0.1, 0.2]); const b = choose(rng, [0.04, 0.08, 0.1]); const I = choose(rng, [0.5, 1, 2]); const B = choose(rng, [0.2, 0.5, 0.8]); const th = choose(rng, [30, 45, 60, 90]);
      const tau = Nt * I * a * b * B * Math.cos(th * Math.PI / 180);
      return { Nt, a, b, I, B, th, q: `A rectangular coil of ${Nt} turns and size ${S(a * 100)} cm $\\times$ ${S(b * 100)} cm carries ${I} A. The plane of the coil makes ${th}$^\\circ$ with a field of ${B} T. Find the torque (in N m, 4 decimals).`, answer: N(tau, 4), tol: 0.0003 + tau * 0.002, unit: 'N m',
        sol: `The angle between the normal and the field is $90^\\circ - ${th}^\\circ$, so $\\tau = NIAB\\sin(90^\\circ - ${th}^\\circ) = NIAB\\cos${th}^\\circ$. $\\tau = ${Nt}\\times${I}\\times${S(a * b, 3)}\\times${B}\\times${S(Math.cos(th * Math.PI / 180), 4)} = ${S(tau, 3)}$ N m.`, trap: 'The angle given is between the plane and the field, not the normal.' };
    },
    verify: (p) => p.Nt * p.I * p.a * p.b * p.B * Math.sin((90 - p.th) * Math.PI / 180) },
  { id: 'mc-g13', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'ammeter conversion',
    make(rng) {
      const G = choose(rng, [20, 40, 50, 100]); const Ig = choose(rng, [1, 2, 5, 10]) * 1e-3; const I = choose(rng, [0.5, 1, 2, 5]);
      const S0 = Ig * G / (I - Ig);
      return { G, Ig, I, q: `A galvanometer of resistance ${G} $\\Omega$ shows full-scale deflection for ${S(Ig * 1e3)} mA. What shunt makes it read up to ${I} A (in $\\Omega$, 4 decimals)?`, answer: N(S0, 4), tol: 0.0005 + S0 * 0.002, unit: 'Ω',
        sol: `$S = \\dfrac{I_gG}{I - I_g} = \\dfrac{${S(Ig, 3)}\\times${G}}{${S(I - Ig, 4)}} = ${S(S0, 4)}\\ \\Omega$.` };
    },
    verify: (p) => p.G / (p.I / p.Ig - 1) },
  { id: 'mc-g14', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'voltmeter conversion',
    make(rng) {
      const G = choose(rng, [20, 40, 50, 100, 200]); const Ig = choose(rng, [0.5, 1, 2, 5]) * 1e-3; const V = choose(rng, [3, 5, 10, 15]);
      const R = V / Ig - G;
      return { G, Ig, V, q: `A galvanometer of resistance ${G} $\\Omega$ gives full scale for ${S(Ig * 1e3)} mA. What series resistance converts it to a ${V} V voltmeter (in $\\Omega$)?`, answer: N(R, 1), tol: 0.5, unit: 'Ω',
        sol: `Total resistance $= V/I_g = ${V}/${S(Ig, 3)} = ${S(V / Ig)}\\ \\Omega$. Series resistance $= ${S(V / Ig)} - ${G} = ${S(R)}\\ \\Omega$.`, trap: 'Subtract the coil resistance.' };
    },
    verify: (p) => p.V / p.Ig - p.G },
  { id: 'mc-g15', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'helical motion',
    make(rng) {
      const v = choose(rng, [1, 2, 4]) * 1e6; const th = choose(rng, [30, 37, 45, 53, 60]); const B = choose(rng, [0.05, 0.1, 0.2]);
      const pitch = 2 * Math.PI * MP * v * Math.cos(th * Math.PI / 180) / (QE * B) * 100;
      return { v, th, B, q: `A proton with speed ${tx(v)} $\\mathrm{m\\,s^{-1}}$ enters a uniform field of ${B} T at ${th}$^\\circ$ to the field. Find the pitch of its helix (in cm, 1 decimal). Take $m_p = 1.67\\times10^{-27}$ kg.`, answer: N(pitch, 1), tol: 0.1 + pitch * 0.002, unit: 'cm',
        sol: `$T = \\dfrac{2\\pi m}{qB} = ${tx(2 * Math.PI * MP / (QE * B))}$ s. $v_\\parallel = v\\cos${th}^\\circ = ${tx(v * Math.cos(th * Math.PI / 180))}\\ \\mathrm{m\\,s^{-1}}$. Pitch $= v_\\parallel T = ${S(pitch / 100, 4)}$ m $= ${S(pitch)}$ cm.`, trap: 'Pitch uses the parallel component of velocity.' };
    },
    verify: (p) => { const T = 2 * Math.PI * MP / (QE * p.B); return p.v * Math.cos(p.th * Math.PI / 180) * T * 100; } },
  { id: 'mc-g16', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'cyclotron energy',
    make(rng) {
      const R = choose(rng, [0.3, 0.4, 0.5, 0.6]); const B = choose(rng, [1, 1.2, 1.5, 2]);
      const K = (QE * B * R) ** 2 / (2 * MP) / 1.6e-13;
      const o = numOpts(rng, K, [K * 2, K / 2, K * 4], 'MeV', 3);
      return { R, B, ...o, q: `The dees of a cyclotron have radius ${R} m and the field is ${B} T. The maximum kinetic energy of protons is`,
        sol: `$K = \\dfrac{q^2B^2R^2}{2m} = \\dfrac{(1.6\\times10^{-19}\\times${B}\\times${R})^2}{2\\times1.67\\times10^{-27}} = ${tx(K * 1.6e-13)}$ J $= ${fmt(K, 3)}$ MeV. The wrong values are off by factors of 2 or 4 (the common slips are $mv^2$ instead of $\\tfrac12mv^2$, and forgetting the square).`, trap: 'The final energy is independent of the accelerating voltage.' };
    },
    verify: (p) => { const v = QE * p.B * p.R / MP; return p.options.indexOf(`${fmt(0.5 * MP * v * v / 1.6e-13, 3)} MeV`); } },
  { id: 'mc-g17', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'ratio of radii',
    make(rng) {
      const sc = choose(rng, [['same speed', 'p', 1], ['same kinetic energy', 'k', 2], ['same momentum', 'm', 3], ['same accelerating voltage', 'v', 4]]);
      const pt = choose(rng, [['proton', 'an alpha particle', 4, 2], ['proton', 'a deuteron', 2, 1], ['an alpha particle', 'a deuteron', 0.5, 2]]);
      // m2/m1 = mr, q2/q1 = qr  -> particle 1 and 2
      const m1 = pt[0] === 'proton' ? 1 : pt[0] === 'an alpha particle' ? 4 : 2; const q1 = pt[0] === 'an alpha particle' ? 2 : 1;
      const m2 = pt[1].includes('alpha') ? 4 : 2; const q2 = pt[1].includes('alpha') ? 2 : 1;
      let ratio; // r1 / r2
      if (sc[1] === 'p') ratio = (m1 / q1) / (m2 / q2);
      else if (sc[1] === 'k') ratio = (Math.sqrt(m1) / q1) / (Math.sqrt(m2) / q2);
      else if (sc[1] === 'm') ratio = (1 / q1) / (1 / q2);
      else ratio = (Math.sqrt(m1 / q1)) / (Math.sqrt(m2 / q2));
      const show = (x) => { const cands = [[1, 1], [1, 2], [2, 1], [1, 4], [4, 1], [1, 3], [3, 1]]; for (const [a, b] of cands) if (Math.abs(a / b - x) < 1e-9) return `${a} : ${b}`; for (const [a, b] of [[1, 8], [8, 1], [1, 1.414], [1.414, 1]]) if (Math.abs(a / b - x) < 1e-3) return `${a} : ${b}`; return `${S(x, 3)} : 1`; };
      const correct = show(ratio);
      const o = shuffleOpts(rng, correct, [show(1 / ratio), show(ratio * 2), show(ratio / 2), show(ratio * 4)]);
      return { sc: sc[1], m1, q1, m2, q2, correctText: correct, ...o, q: `${pt[0][0].toUpperCase() + pt[0].slice(1)} and ${pt[1]} (mass and charge in units of the proton's: ${m1}, ${q1} and ${m2}, ${q2}) enter a uniform field at right angles with the ${sc[0]}. The ratio of the radii $r_1 : r_2$ is`,
        sol: `$r = \\dfrac{mv}{qB} = \\dfrac{p}{qB}$. ${sc[1] === 'p' ? 'For the same speed, $r\\propto m/q$.' : sc[1] === 'k' ? 'For the same kinetic energy, $p = \\sqrt{2mK}$, so $r\\propto\\sqrt m/q$.' : sc[1] === 'm' ? 'For the same momentum, $r\\propto1/q$.' : 'For the same accelerating voltage, $\\tfrac12mv^2 = qV$ gives $p = \\sqrt{2mqV}$, so $r\\propto\\sqrt{m/q}$.'} With the values given, $r_1/r_2 = ${S(ratio, 3)}$, which is the ratio ${correct}.` };
    },
    verify: (p) => { const f = { p: (m, q) => m / q, k: (m, q) => Math.sqrt(m) / q, m: (m, q) => 1 / q, v: (m, q) => Math.sqrt(m / q) }[p.sc]; const rt = f(p.m1, p.q1) / f(p.m2, p.q2); const [a, b] = p.correctText.split(' : ').map(parseFloat); return Math.abs(a / b - rt) < 1e-2 * rt ? p.options.indexOf(p.correctText) : -1; } },
  { id: 'mc-g18', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'two parallel wires',
    make(rng) {
      const I = choose(rng, [2, 4, 5, 10]); const d = choose(rng, [0.1, 0.2, 0.3, 0.4]); const same = rng() < 0.5;
      const B = same ? 0 : 2e-7 * I / (d / 2) * 2 * 1e6;
      return { I, d, same, q: `Two long parallel wires ${S(d * 100)} cm apart each carry ${I} A, ${same ? 'in the same direction' : 'in opposite directions'}. Find the field at the midpoint between them (in $\\mu$T, 1 decimal).`, answer: N(B, 1), tol: 0.1, unit: 'μT',
        sol: same ? `Each wire gives $\\dfrac{\\mu_0I}{2\\pi(d/2)}$ at the midpoint, in opposite directions for like currents. They cancel: $B = 0$.` : `Each wire gives $\\dfrac{\\mu_0I}{2\\pi(d/2)} = \\dfrac{2\\times10^{-7}\\times${I}}{${d / 2}} = ${S(2e-7 * I / (d / 2) * 1e6, 4)}\\ \\mu$T, and for opposite currents the fields add: $B = ${S(B, 4)}\\ \\mu$T.`, trap: 'Like currents cancel between the wires; opposite currents add.' };
    },
    verify: (p) => (p.same ? 0 : 2 * MU * p.I / (Math.PI * p.d) * 1e6) },
  { id: 'mc-g19', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'composite wire',
    make(rng) {
      const I = choose(rng, [2, 3, 5, 6]); const R = choose(rng, [0.05, 0.1, 0.2]);
      const B = MU * I / (4 * R) * (1 + 2 / Math.PI) * 1e6;
      return { I, R, q: `A long wire carrying ${I} A is bent into a hairpin: two parallel semi-infinite straight pieces joined by a semicircle of radius ${S(R * 100)} cm. Find the field at the centre of the semicircle (in $\\mu$T, 1 decimal).`, answer: N(B, 1), tol: 0.1 + B * 0.002, unit: 'μT',
        sol: `Semicircle: $\\dfrac{\\mu_0I}{4R}$. Each straight piece: $\\dfrac{\\mu_0I}{4\\pi R}$, in the same direction. $B = \\dfrac{\\mu_0I}{4R}\\left(1 + \\dfrac2\\pi\\right) = \\dfrac{4\\pi\\times10^{-7}\\times${I}}{${4 * R}}\\times1.637 = ${S(B, 4)}\\ \\mu$T.` };
    },
    verify: (p) => (MU * p.I / (4 * p.R) + 2 * 1e-7 * p.I / p.R) * 1e6 },
  { id: 'mc-g20', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'dipole energy',
    make(rng) {
      const m = choose(rng, [0.2, 0.5, 0.8, 1.2]); const B = choose(rng, [0.1, 0.25, 0.4, 0.5]); const t1 = choose(rng, [0, 30, 60]); const t2 = choose(rng, [90, 120, 150, 180]);
      const W = m * B * (Math.cos(t1 * Math.PI / 180) - Math.cos(t2 * Math.PI / 180));
      return { m, B, t1, t2, q: `A dipole of moment ${m} $\\mathrm{A\\,m^2}$ in a field of ${B} T is turned from ${t1}$^\\circ$ to ${t2}$^\\circ$ with the field. How much work is done against the field (in J, 3 decimals)?`, answer: N(W, 3), tol: 0.002, unit: 'J',
        sol: `$W = U_2 - U_1 = -mB\\cos${t2}^\\circ + mB\\cos${t1}^\\circ = ${m}\\times${B}\\times(${S(Math.cos(t1 * Math.PI / 180), 3)} - (${S(Math.cos(t2 * Math.PI / 180), 3)})) = ${S(W, 3)}$ J.` };
    },
    verify: (p) => -p.m * p.B * Math.cos(p.t2 * Math.PI / 180) - (-p.m * p.B * Math.cos(p.t1 * Math.PI / 180)) },
  { id: 'mc-g21', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: "Ampère's law for a thick wire",
    make(rng) {
      const I = choose(rng, [5, 10, 20, 40]); const R = choose(rng, [0.01, 0.02, 0.04]); const f = choose(rng, [0.25, 0.5, 0.75, 1.5, 2, 3]);
      const r = R * f; const B = f <= 1 ? 2e-7 * I * r / (R * R) : 2e-7 * I / r;
      return { I, R, f, q: `A long straight wire of radius ${S(R * 100)} cm carries ${I} A uniformly over its cross-section. Find the field at ${S(r * 100)} cm from the axis (in $\\mu$T, 1 decimal).`, answer: N(B * 1e6, 1), tol: 0.1 + B * 1e6 * 0.002, unit: 'μT',
        sol: f <= 1 ? `Inside, $B = \\dfrac{\\mu_0Ir}{2\\pi R^2} = \\dfrac{2\\times10^{-7}\\times${I}\\times${S(r)}}{${S(R * R, 3)}} = ${S(B * 1e6, 4)}\\ \\mu$T.` : `Outside, all the current is enclosed: $B = \\dfrac{\\mu_0I}{2\\pi r} = \\dfrac{2\\times10^{-7}\\times${I}}{${S(r)}} = ${S(B * 1e6, 4)}\\ \\mu$T.`, trap: 'Inside, only the current within the Amperian loop counts.' };
    },
    verify: (p) => { const r = p.R * p.f; const Ienc = r < p.R ? p.I * r * r / (p.R * p.R) : p.I; return MU * Ienc / (2 * Math.PI * r) * 1e6; } },
  { id: 'mc-g22', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'mass spectrometer',
    make(rng) {
      const V = choose(rng, [500, 1000, 2000]); const B = choose(rng, [0.2, 0.4, 0.5]); const r = choose(rng, [0.05, 0.1, 0.15]);
      const m = QE * B * B * r * r / (2 * V);
      const u = m / 1.66e-27;
      return { V, B, r, q: `Singly charged ions accelerated through ${V} V move on a circle of radius ${S(r * 100)} cm in a field of ${B} T. Find their mass in atomic mass units (1 u $= 1.66\\times10^{-27}$ kg; 1 decimal).`, answer: N(u, 1), tol: 0.1 + u * 0.002, unit: 'u',
        sol: `From $qV = \\tfrac12mv^2$ and $r = \\dfrac{mv}{qB}$: $m = \\dfrac{qB^2r^2}{2V} = \\dfrac{1.6\\times10^{-19}\\times${B * B}\\times${S(r * r, 3)}}{2\\times${V}} = ${tx(m)}$ kg $= ${S(u)}$ u.` };
    },
    verify: (p) => { const v = 2 * p.V / (p.B * p.r); return (QE * p.B * p.r / v) / 1.66e-27; } },
  { id: 'mc-g23', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'deflection in a field region',
    make(rng) {
      const v = choose(rng, [1, 2, 3, 4]) * 1e6; const B = choose(rng, [0.2, 0.25, 0.5]);
      const r = MP * v / (QE * B); const dcm = Math.max(0.5, Math.round(r * 100 * choose(rng, [0.25, 0.4, 0.5, 0.6, 0.8]) * 2) / 2); const d = dcm / 100;
      const th = Math.asin(d / r) * 180 / Math.PI;
      return { v, B, d, q: `A proton with speed ${tx(v)} $\\mathrm{m\\,s^{-1}}$ enters, perpendicular to its boundary, a region of width ${dcm} cm with a field of ${B} T. Through what angle is its velocity turned on leaving (in degrees, 1 decimal)? Take $m_p = 1.67\\times10^{-27}$ kg.`, answer: N(th, 1), tol: 0.2, unit: '°',
        sol: `$r = \\dfrac{mv}{qB} = ${S(r * 100, 4)}$ cm. The centre of the circle is on the entry boundary, so $\\sin\\theta = d/r = ${S(d / r, 4)}$ and $\\theta = ${S(th)}^\\circ$.`, trap: 'Needs r larger than the width, otherwise it turns back.' };
    },
    verify: (p) => Math.asin(p.d * QE * p.B / (MP * p.v)) * 180 / Math.PI },
  { id: 'mc-g24', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'galvanometer deflection',
    make(rng) {
      const Nt = choose(rng, [50, 100, 200]); const A = choose(rng, [2, 4, 6]) * 1e-4; const B = choose(rng, [0.1, 0.2, 0.5]); const k = choose(rng, [1, 2, 4]) * 1e-6; const I = choose(rng, [1, 2, 5]) * 1e-5;
      const phi = Nt * A * B * I / k * 180 / Math.PI;
      return { Nt, A, B, k, I, q: `A galvanometer coil has ${Nt} turns of area ${S(A * 1e4)} $\\mathrm{cm^2}$ in a radial field of ${B} T. The torsion constant is $${tx(k)}\\ \\mathrm{N\\,m\\,rad^{-1}}$. Find the deflection for a current of ${S(I * 1e6)} $\\mu$A (in degrees, 2 decimals).`, answer: N(phi, 2), tol: 0.05 + phi * 0.002, unit: '°',
        sol: `$\\phi = \\dfrac{NABI}{k} = \\dfrac{${Nt}\\times${tx(A)}\\times${B}\\times${tx(I)}}{${tx(k)}} = ${S(phi / 180 * Math.PI, 4)}$ rad $= ${S(phi, 4)}^\\circ$.` };
    },
    verify: (p) => (p.Nt * p.I * p.A * p.B) / p.k * 180 / Math.PI },
  { id: 'mc-g25', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'force on a curved wire',
    make(rng) {
      const R = choose(rng, [0.05, 0.1, 0.2]); const I = choose(rng, [2, 3, 5]); const B = choose(rng, [0.2, 0.3, 0.5]); const shape = choose(rng, ['semicircular', 'semicircular', 'quarter-circle']);
      const chord = shape === 'semicircular' ? 2 * R : Math.SQRT2 * R; const F = B * I * chord;
      return { R, I, B, shape, q: `A ${shape} wire of radius ${S(R * 100)} cm carries ${I} A in a plane perpendicular to a uniform field of ${B} T. Find the net force on it (in N, 3 decimals).`, answer: N(F, 3), tol: 0.002, unit: 'N',
        sol: `The net force equals the force on the straight chord joining the ends. The chord is ${shape === 'semicircular' ? `the diameter, $2R = ${2 * R}$ m` : `$\\sqrt2R = ${S(chord, 4)}$ m`}. $F = BIl = ${B}\\times${I}\\times${S(chord, 4)} = ${S(F, 3)}$ N.`, trap: 'Use the chord, not the arc length.' };
    },
    verify: (p) => p.B * p.I * (p.shape === 'semicircular' ? 2 * p.R : Math.hypot(p.R, p.R)) },
  { id: 'mc-g26', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'loop near a wire',
    make(rng) {
      const I1 = choose(rng, [10, 20, 30]); const I2 = choose(rng, [2, 4, 5]); const l = choose(rng, [0.1, 0.2, 0.3]); const d1 = choose(rng, [0.02, 0.05, 0.1]); const w = choose(rng, [0.05, 0.1, 0.2]);
      const F = 2e-7 * I1 * I2 * l * (1 / d1 - 1 / (d1 + w)) * 1e6;
      return { I1, I2, l, d1, w, q: `A long wire carries ${I1} A. A rectangular loop carrying ${I2} A has two sides of length ${S(l * 100)} cm parallel to the wire, the nearer one ${S(d1 * 100)} cm from it, and the width of the loop is ${S(w * 100)} cm. Find the net force on the loop (in $\\mu$N, 1 decimal).`, answer: N(F, 1), tol: 0.2 + F * 0.002, unit: 'μN',
        sol: `The forces on the sides perpendicular to the wire cancel. The parallel sides: $F = \\dfrac{\\mu_0I_1I_2l}{2\\pi}\\left(\\dfrac1{${d1}} - \\dfrac1{${S(d1 + w)}}\\right) = 2\\times10^{-7}\\times${I1}\\times${I2}\\times${l}\\times${S(1 / d1 - 1 / (d1 + w), 4)} = ${S(F, 4)}\\ \\mu$N.`, trap: 'The two long sides are at different distances.' };
    },
    verify: (p) => { const f = (d) => MU * p.I1 * p.I2 * p.l / (2 * Math.PI * d); return (f(p.d1) - f(p.d1 + p.w)) * 1e6; } },
];
// ---------- expansion block: more hard items, matches, multi-correct, passages and templates ----------
{
const XR = String.raw;
const XEXB = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv', 'neet'], 5: ['jee-adv'] };
let xk = 156; let xc = 0;
const xid = () => `mc-${String(++xk).padStart(3, '0')}`;
const XPOS = [2, 0, 3, 1, 1, 3, 0, 2];
const xex = (level, type, sub) => (type === 'mcq' && level <= 3 && ((s)=>true)(sub) ? [...XEXB[level], 'cuet'] : XEXB[level]);
const xb = (level, sub, o) => ({ id: xid(), level, exams: xex(level, o.type, sub), sub, ...o });
const xm = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = XPOS[xc++ % 8]; const options = [...wrongs]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const xi = (level, sub, q, value, sol, o = {}) => {
  const answer = Math.round(value); if (Math.abs(value - answer) > 1e-6) throw new Error('not an integer: ' + value + ' ' + q.slice(0, 60));
  return xb(level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, calc: () => answer, sol, ...o });
};
const xn = (level, sub, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return xb(level, sub, { type: 'nat', format: 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
};
const xs = (level, sub, q, options, answer, sol, o = {}) => xb(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const XA = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const xa = (level, sub, A, R, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: XA, answer, sol, ...o });
const XS = ['Both Statement I and Statement II are true', 'Both Statement I and Statement II are false', 'Statement I is true but Statement II is false', 'Statement I is false but Statement II is true'];
const xt = (level, sub, I, II, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: XS, answer, sol, ...o });
const xmatch = (level, sub, group, q, correct, sol, o = {}) => {
  const L = correct.split(', ').map((s) => s.split('-')); const rs = L.map((x) => x[1]);
  const mk = (p) => L.map((x, i) => `${x[0]}-${p[i]}`).join(', ');
  const swaps = [[0, 1], [2, 3], [1, 2], [0, 3], [0, 2], [1, 3]]; const wr = [];
  for (let t = 0; t < 6 && wr.length < 3; t++) { const [i, j] = swaps[(t + xc) % 6]; const p = [...rs]; [p[i], p[j]] = [p[j], p[i]]; const s = mk(p); if (s !== correct && !wr.includes(s)) wr.push(s); }
  if (wr.length < 3) throw new Error('match options');
  const pos = XPOS[xc++ % 8]; const options = [...wr]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'match', group, q, options, answer: pos, sol, ...o });
};
const xp = (extra) => (level, sub, group, q, ...rest) => extra(level, sub, q, ...rest);
const XG = (n, level, type, sub, make, verify) => ({ id: `mc-g${n}`, type, level, exams: xex(level, type, sub), sub, make, verify });
const f3 = (v) => fmt(v, 3);
const sg = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const XPY = (o) => ({ format: 'passage', ...o });
const XMU = 4e-7 * Math.PI; const XQE = 1.6e-19; const XMP = 1.67e-27; const XU = 1.66e-27; const XPI = Math.PI;
Object.assign(groups, {
  xm1: { title: 'Fields of current distributions (current I)',
    list1: ['A. Long straight wire, at distance $d$', 'B. Centre of a single circular loop of radius $R$', 'C. Inside a long solenoid with $n$ turns per metre', 'D. Inside a toroid of $N$ turns at radius $r$'],
    list2: [r`p. $\dfrac{\mu_0I}{2\pi d}$`, r`q. $\dfrac{\mu_0I}{2R}$`, r`r. $\mu_0nI$`, r`s. $\dfrac{\mu_0NI}{2\pi r}$`] },
  xm2: { title: 'A particle of charge q, mass m and speed v moving perpendicular to a uniform field B',
    list1: ['A. Radius of the circle', 'B. Time for one revolution', 'C. Frequency of revolution', 'D. Magnitude of its angular momentum about the centre'],
    list2: [r`p. $\dfrac{mv}{qB}$`, r`q. $\dfrac{2\pi m}{qB}$`, r`r. $\dfrac{qB}{2\pi m}$`, r`s. $\dfrac{m^2v^2}{qB}$`] },
  xm3: { title: 'Torque on a coil (N turns, area A, current I) in a field B; theta is the angle between B and the normal to the coil',
    list1: ['A. $\\theta = 0^\\circ$', 'B. $\\theta = 90^\\circ$', 'C. $\\theta = 60^\\circ$', 'D. $\\theta = 30^\\circ$'],
    list2: [r`p. $0$`, r`q. $NIAB$`, r`r. $\dfrac{\sqrt3}{2}NIAB$`, r`s. $\dfrac12NIAB$`] },
  xm4: { title: 'Two long parallel wires, 1 and 2, carry currents; the field is zero at some line parallel to them',
    list1: ['A. Equal currents, same direction', 'B. Currents $2I$ and $I$, same direction: zero field at distance from the $2I$ wire', 'C. Equal currents, opposite directions', 'D. Currents $2I$ and $I$, opposite directions: zero field outside, near the $I$ wire'],
    list2: [r`p. midway between them`, r`q. nowhere`, r`r. $\dfrac{2d}{3}$ (with $d$ the separation)`, r`s. at distance $d$ from the $I$ wire, on the side away from the $2I$ wire`] },
  xm5: { title: 'Loops with the same current I (centre fields)',
    list1: ['A. One full circle of radius $R$', 'B. Semicircle of radius $R$', 'C. Quarter circle of radius $R$', 'D. Full circle of radius $R/2$'],
    list2: [r`p. $\dfrac{\mu_0I}{R}$`, r`q. $\dfrac{\mu_0I}{4R}$`, r`r. $\dfrac{\mu_0I}{2R}$`, r`s. $\dfrac{\mu_0I}{8R}$`] },
  xm6: { title: 'Magnetic meters (galvanometer: resistance G, full-scale current Ig)',
    list1: ['A. Converting to an ammeter of range $I$', 'B. Converting to a voltmeter of range $V$', 'C. Effect of the shunt on the ammeter\'s resistance', 'D. Effect of the series resistor on the voltmeter\'s resistance'],
    list2: [r`p. a low resistance in parallel`, r`q. a high resistance in series`, r`r. total resistance is less than $G$`, r`s. total resistance is more than $G$`] },
  xm7: { title: 'Motion of a charged particle in uniform fields',
    list1: ['A. $\\vec v\\parallel\\vec B$, no $\\vec E$', 'B. $\\vec v\\perp\\vec B$, no $\\vec E$', 'C. $\\vec v$ at $60^\\circ$ to $\\vec B$, no $\\vec E$', 'D. $\\vec E\\perp\\vec B$ with $v=E/B$, $\\vec v\\perp$ both'],
    list2: [r`p. circle`, r`q. straight line: no force acts at all`, r`r. helix`, r`s. straight line: electric and magnetic forces cancel`] },
  xm8: { title: 'Long straight cylinder of radius R carrying a uniform current I',
    list1: ['A. $B$ at $r=R/2$', 'B. $B$ at $r=R$', 'C. $B$ at $r=4R$', 'D. $B$ on the axis'],
    list2: [r`p. $\dfrac{\mu_0I}{2\pi R}$`, r`q. $\dfrac{\mu_0I}{4\pi R}$`, r`r. $0$`, r`s. $\dfrac{\mu_0I}{8\pi R}$`] },
  xp1: { title: 'Ions in a mass analyser',
    passage: r`<p>Singly charged ions ($q = 1.6\times10^{-19}$ C) of mass 40 u pass through a velocity selector in which the electric field is $5.0\times10^{4}$ V/m and the magnetic field is 0.25 T. They then enter a region with a second uniform magnetic field of 0.50 T perpendicular to their velocity. Take $1\ \mathrm{u} = 1.66\times10^{-27}$ kg.</p>` },
  xp2: { title: 'A coil in a field',
    passage: r`<p>A coil has 50 turns, each a circle of radius 0.10 m, and carries 2.0 A. It is in a uniform field of 0.40 T. Initially the plane of the coil is parallel to the field.</p>` },
});

// ---------- L2 ----------
items.push(
  xm(2, 'circular motion', XR`A proton and an electron enter the same uniform magnetic field with equal speeds, perpendicular to it. Which has the larger circular path, and by about what factor?`,
    'The proton, about 1800 times', ['The electron, about 1800 times', 'They are equal', 'The proton, about 42 times'],
    XR`$r = \dfrac{mv}{qB}$. Same $q$, $v$ and $B$, so $r\propto m$. $m_p/m_e\approx1836$. The proton's circle is larger by that factor. The factor 42 is $\sqrt{1836}$, which would apply for equal kinetic energies.`),
  xm(2, 'force on a wire', XR`A straight wire 0.20 m long carries 5.0 A at $30^\circ$ to a uniform field of 0.40 T. The force on the wire is`,
    '0.20 N', ['0.40 N', '0.35 N', '0.10 N'],
    XR`$F = BIL\sin\theta = 0.40\times5.0\times0.20\times\sin30^\circ = 0.20$ N. (With $\sin\theta$ forgotten you would get 0.40 N.)`),
  xm(2, 'direction of force', XR`An electron moving towards the east enters a region where the magnetic field points towards the north. The magnetic force on it is directed`,
    'vertically downward', ['vertically upward', 'towards the south', 'towards the west'],
    XR`Take east $=\hat x$, north $=\hat y$, up $=\hat z$. For a positive charge $\vec F\propto\vec v\times\vec B = \hat x\times\hat y = +\hat z$ (up). The electron is negative, so the force reverses: downward.`,
    { trap: 'The direction rule is for positive charges; reverse it for electrons.' }),
  xi(2, 'field of a loop', XR`A circular coil of 100 turns and radius 0.10 m carries 0.50 A. The field at its centre is $n\pi\times10^{-4}$ T. Find $n$.`, XMU * 100 * 0.5 / (2 * 0.1) / (XPI * 1e-4),
    XR`$B = \dfrac{\mu_0NI}{2R} = \dfrac{4\pi\times10^{-7}\times100\times0.5}{2\times0.1} = \pi\times10^{-4}$ T, so $n=1$.`),
  xa(2, 'work done by magnetic force', XR`A magnetic field cannot change the kinetic energy of a moving charged particle.`, XR`The magnetic force on a moving charge is always perpendicular to its velocity.`, 0,
    XR`Work done $=\vec F\cdot\vec v\,dt = 0$ when $\vec F\perp\vec v$, so the kinetic energy does not change. A is true and R is the reason.`),
  xt(2, 'forces between wires', XR`Two long parallel wires carrying currents in the same direction attract each other.`, XR`The force per unit length between two long parallel wires is $\dfrac{\mu_0I_1I_2}{2\pi d}$.`, 0,
    XR`Both statements are true: wire 1 makes a field at wire 2 which, by $\vec F = I\vec L\times\vec B$, pulls it toward wire 1 when the currents are parallel, and the magnitude is $\dfrac{\mu_0I_1I_2}{2\pi d}$ per unit length.`),
  xmatch(2, 'fields of current distributions', 'xm1', XR`Match each source in List I with its field in List II.`, 'A-p, B-q, C-r, D-s',
    XR`Straight wire: $\dfrac{\mu_0I}{2\pi d}$ (p). Centre of a loop: $\dfrac{\mu_0I}{2R}$ (q). Inside a long solenoid: $\mu_0nI$ (r). Toroid: $\dfrac{\mu_0NI}{2\pi r}$ (s).`),
);

// ---------- L3 ----------
items.push(
  xi(3, 'field of a loop', XR`A wire of fixed length carrying a current is wound first into one circular turn and then into 3 turns (a smaller coil). The field at the centre is how many times larger for the 3-turn coil?`, 9,
    XR`Length $L = N\cdot2\pi R$, so $R = \dfrac{L}{2\pi N}$. Field at the centre $B = \dfrac{\mu_0NI}{2R} = \dfrac{\mu_0N^2I\pi}{L}\propto N^2$. For $N=3$ against $N=1$: $9$ times.`,
    { trap: 'Both the number of turns and the radius change.' }),
  xn(3, 'solenoid', XR`A solenoid has 200 turns on a length of 0.25 m and carries 2.0 A. Find the field inside near its middle, in mT.`, XMU * (200 / 0.25) * 2 * 1e3, 0.02, 2,
    XR`$n = \dfrac{200}{0.25} = 800\ \mathrm{m^{-1}}$. $B = \mu_0nI = 4\pi\times10^{-7}\times800\times2.0 = 2.01\times10^{-3}$ T $= 2.01$ mT.`, { unit: 'mT' }),
  xm(3, 'cyclotron', XR`A cyclotron uses a field of 1.0 T for protons. The frequency of the alternating voltage must be about ($m_p = 1.67\times10^{-27}$ kg)`,
    '15.2 MHz', ['30.4 MHz', '7.6 MHz', '95.5 MHz'],
    XR`$f = \dfrac{qB}{2\pi m} = \dfrac{1.6\times10^{-19}\times1.0}{2\pi\times1.67\times10^{-27}} = 1.52\times10^{7}$ Hz. The factor $2\pi$ matters: $qB/m$ alone would be the angular frequency, $9.6\times10^{7}$ rad/s.`),
  xi(3, 'conversion of a galvanometer', XR`A galvanometer of resistance 50 $\Omega$ gives full-scale deflection for 2.0 mA. The series resistance needed to make it a voltmeter of range 0 to 10 V is, in $\Omega$,`, 10 / 2e-3 - 50,
    XR`Total resistance for 10 V at 2 mA: $\dfrac{10}{0.002} = 5000\ \Omega$. Series resistor $R = 5000 - 50 = 4950\ \Omega$.`, { unit: 'Ω' }),
  xa(3, 'velocity selector', XR`In a velocity selector with perpendicular $\vec E$ and $\vec B$, the particles that pass undeflected can have any charge and any mass.`, XR`Both the electric and magnetic forces are proportional to the charge, so the condition for balance is $v = E/B$.`, 0,
    XR`Balance: $qE = qvB$, so $v = E/B$ with $q$ cancelling. Mass never appears. R explains A.`),
  xt(3, 'helical motion', XR`A charged particle projected parallel to a uniform magnetic field moves in a straight line at constant speed.`, XR`The magnetic force on a moving charge is $qvB$, independent of the angle between $\vec v$ and $\vec B$.`, 2,
    XR`Statement I is true: $\vec F = q\vec v\times\vec B = 0$ for $\vec v\parallel\vec B$. Statement II is false: the force is $qvB\sin\theta$ and depends on the angle.`),
  xmatch(3, 'circular motion', 'xm2', XR`Match each quantity in List I with its value in List II.`, 'A-p, B-q, C-r, D-s',
    XR`$r = \dfrac{mv}{qB}$ (p). $T = \dfrac{2\pi r}{v} = \dfrac{2\pi m}{qB}$ (q). $f = \dfrac1T = \dfrac{qB}{2\pi m}$ (r). $L = mvr = \dfrac{m^2v^2}{qB}$ (s).`),
  xmatch(3, 'torque on a loop', 'xm3', XR`Match each case in List I with the torque in List II.`, 'A-p, B-q, C-r, D-s',
    XR`$\tau = NIAB\sin\theta$ where $\theta$ is the angle between $\vec B$ and the normal (the moment). $0^\circ$: 0 (p). $90^\circ$: $NIAB$ (q). $60^\circ$: $\dfrac{\sqrt3}{2}NIAB$ (r). $30^\circ$: $\dfrac12NIAB$ (s).`,
    { trap: 'The angle is measured from the normal to the coil, not from its plane.' }),
  xi(3, 'forces between wires', XR`Two long parallel wires 0.20 m apart carry 10 A and 20 A in the same direction. The force per unit length is $n\times10^{-5}$ N/m. Find $n$.`, 2e-7 * 10 * 20 / 0.2 / 1e-5,
    XR`$\dfrac{F}{l} = \dfrac{\mu_0I_1I_2}{2\pi d} = \dfrac{2\times10^{-7}\times10\times20}{0.20} = 2\times10^{-4} = 20\times10^{-5}$ N/m, attractive.`),
  xn(3, 'helical motion', XR`A proton moves at $2.0\times10^{6}$ m/s at $60^\circ$ to a uniform field of 0.20 T. Find the pitch of its helical path, in m ($m_p = 1.67\times10^{-27}$ kg).`, 2e6 * Math.cos(XPI / 3) * 2 * XPI * XMP / (XQE * 0.2), 0.003, 3,
    XR`Pitch $=v_\parallel T$, with $v_\parallel = v\cos60^\circ = 1.0\times10^{6}$ m/s and $T = \dfrac{2\pi m}{qB} = \dfrac{2\pi\times1.67\times10^{-27}}{1.6\times10^{-19}\times0.2} = 3.28\times10^{-7}$ s. Pitch $= 0.328$ m.`, { unit: 'm', trap: 'The period depends only on the perpendicular motion; the pitch uses the parallel component.' }),
  xm(3, "Ampère's law", XR`A long straight cylinder of radius $R$ carries a current uniformly over its cross-section. The ratio of the field at $r = R/2$ to the field at $r = 2R$ is`,
    '1', ['4', '2', '1/2'],
    XR`Inside, $B = \dfrac{\mu_0Ir}{2\pi R^2}$; at $R/2$: $\dfrac{\mu_0I}{4\pi R}$. Outside, $B = \dfrac{\mu_0I}{2\pi r}$; at $2R$: $\dfrac{\mu_0I}{4\pi R}$. The two are equal, ratio 1.`, { trap: 'Inside the field rises with $r$; outside it falls.' }),
  xa(3, 'ammeter conversion', XR`A galvanometer is converted into an ammeter by connecting a high resistance in series with it.`, XR`An ammeter must have a very low resistance.`, 3,
    XR`A is false: a <i>low</i> resistance (shunt) is connected in <i>parallel</i> to a galvanometer to make an ammeter; a high series resistance makes a voltmeter. R is true: an ammeter is placed in series and must not disturb the current.`),
  xt(3, 'instruments', XR`An ideal ammeter has zero resistance.`, XR`An ideal voltmeter has infinite resistance.`, 0,
    XR`An ammeter is put in series; any resistance would reduce the current it measures. A voltmeter is put in parallel; any current it draws would disturb the circuit. So both statements are true.`),
  xmatch(3, 'field of a loop', 'xm5', XR`Match each arrangement carrying current $I$ in List I with the field at its centre in List II.`, 'A-r, B-q, C-s, D-p',
    XR`Full circle: $\dfrac{\mu_0I}{2R}$ (r). Semicircle: half of that, $\dfrac{\mu_0I}{4R}$ (q). Quarter circle: a quarter, $\dfrac{\mu_0I}{8R}$ (s). Full circle of radius $R/2$: $\dfrac{\mu_0I}{2(R/2)} = \dfrac{\mu_0I}{R}$ (p).`),
);

// ---------- L4 ----------
items.push(
  xi(4, 'neutral point', XR`Two long parallel wires 40 cm apart carry 2 A and 6 A in the same direction. The field is zero on the line between them at a distance of $x$ cm from the 2 A wire. Find $x$.`, 10,
    XR`Zero where $\dfrac{\mu_0\cdot2}{2\pi x} = \dfrac{\mu_0\cdot6}{2\pi(40-x)}$, i.e. $2(40-x) = 6x$, $80 = 8x$, $x = 10$ cm.`),
  xi(4, 'cyclotron', XR`A cyclotron's dees have a potential difference of 50 kV across the gap. A proton is accelerated until it has 20 MeV. How many complete revolutions does it make?`, 20e6 / (2 * 50e3),
    XR`It crosses the gap twice per revolution and gains $50$ keV each time, i.e. $100$ keV per revolution. Revolutions $=\dfrac{20\ \mathrm{MeV}}{0.1\ \mathrm{MeV}} = 200$.`),
  xi(4, 'time in a field region', XR`A proton enters a magnetic field region of width $d$ perpendicular to its boundary. Its path radius is $r = 2d$. By how many degrees is it deviated when it leaves on the other side?`, Math.asin(0.5) * 180 / XPI,
    XR`It leaves when its horizontal travel equals $d$: $r\sin\theta = d$, so $\sin\theta = \dfrac{d}{r} = \dfrac12$ and $\theta = 30^\circ$.`),
  xn(4, 'Biot-Savart for a straight wire', XR`A straight wire 0.40 m long carries 10 A. Find the field at a point 0.15 m from its midpoint on the perpendicular bisector, in $\mu$T.`, 1e-7 * 10 / 0.15 * 2 * 0.8 * 1e6, 0.15, 2,
    XR`$B = \dfrac{\mu_0I}{4\pi d}(\sin\phi_1+\sin\phi_2)$ with $\sin\phi = \dfrac{0.2}{\sqrt{0.15^2+0.2^2}} = \dfrac{0.2}{0.25} = 0.8$. $B = \dfrac{10^{-7}\times10}{0.15}\times1.6 = 1.07\times10^{-5}$ T $= 10.7\ \mu$T.`, { unit: 'µT' }),
  xn(4, 'forces between wires', XR`Three long parallel wires pass through the corners of an equilateral triangle of side 0.10 m, each carrying 10 A in the same direction. Find the force per unit length on one wire, in units of $10^{-4}$ N/m.`, Math.sqrt(3) * 2e-7 * 100 / 0.1 / 1e-4, 0.02, 2,
    XR`Each of the other two attracts with $F_0 = \dfrac{\mu_0I^2}{2\pi d} = \dfrac{2\times10^{-7}\times100}{0.10} = 2\times10^{-4}$ N/m, towards that wire. The two forces are $60^\circ$ apart: resultant $2F_0\cos30^\circ = \sqrt3F_0 = 3.46\times10^{-4}$ N/m, pointing towards the centre of the triangle.`, { unit: '×10⁻⁴ N/m' }),
  xn(4, 'field of a moving charge', XR`An electron in the first Bohr orbit (radius $0.53\times10^{-10}$ m) goes round $6.6\times10^{15}$ times per second. Find the field at the nucleus, in tesla.`, XMU * XQE * 6.6e15 / (2 * 0.53e-10), 0.15, 2,
    XR`Current $I = ef = 1.6\times10^{-19}\times6.6\times10^{15} = 1.056\times10^{-3}$ A. $B = \dfrac{\mu_0I}{2r} = \dfrac{4\pi\times10^{-7}\times1.056\times10^{-3}}{2\times0.53\times10^{-10}} = 12.5$ T.`, { unit: 'T' }),
  xn(4, 'crossed fields', XR`Protons pass undeflected through crossed fields $E = 5.0\times10^{4}$ V/m and $B = 0.10$ T. The electric field is then switched off. Find the radius of their circular path in the magnetic field alone, in cm ($m_p = 1.67\times10^{-27}$ kg).`, XMP * (5e4 / 0.1) / (XQE * 0.1) * 100, 0.1, 2,
    XR`Speed $v = E/B = 5\times10^{5}$ m/s. $r = \dfrac{mv}{qB} = \dfrac{1.67\times10^{-27}\times5\times10^{5}}{1.6\times10^{-19}\times0.10} = 0.0522$ m $= 5.22$ cm.`, { unit: 'cm' }),
  xs(4, 'magnetic force on a charge', XR`A charged particle moves in a uniform magnetic field. Choose the correct statements.`,
    [XR`Its speed stays constant.`, XR`If its velocity has a component along $\vec B$, the path is a helix.`, XR`Its kinetic energy increases steadily.`, XR`Its momentum changes.`],
    [0, 1, 3],
    XR`The force is perpendicular to $\vec v$, so it does no work: speed and kinetic energy are constant (A true, C false). With a component of $\vec v$ along $\vec B$, that component stays constant while the perpendicular part circles: helix (B true). The direction of $\vec v$ keeps changing, so momentum (a vector) changes (D true).`),
  xs(4, 'torque on a loop', XR`A current loop is in a uniform magnetic field. Choose the correct statements.`,
    [XR`The net force on the loop is zero.`, XR`The torque is zero when the plane of the loop is perpendicular to the field.`, XR`The torque is greatest when the magnetic moment is parallel to the field.`, XR`The force on a curved part of the loop between two points equals the force on a straight wire joining them with the same current.`],
    [0, 1, 3],
    XR`In a uniform field $\sum I\,d\vec l\times\vec B = I(\oint d\vec l)\times\vec B = 0$ (A). Plane perpendicular to $\vec B$ means moment parallel to $\vec B$: $\tau = mB\sin0 = 0$ (B). Torque is greatest when the moment is perpendicular to $\vec B$ (C false). For an open curve, $\vec F = I\vec L_{\mathrm{net}}\times\vec B$ with $\vec L_{\mathrm{net}}$ the straight displacement between its ends (D).`),
  xs(4, "Ampère's law", XR`A long straight wire of radius $R$ carries a uniform current. Choose the correct statements about its magnetic field.`,
    [XR`Inside, $B$ is proportional to the distance from the axis.`, XR`Outside, $B$ is inversely proportional to the distance from the axis.`, XR`$B$ is continuous at the surface.`, XR`$B$ is largest on the axis.`],
    [0, 1, 2],
    XR`Inside: $B = \dfrac{\mu_0Ir}{2\pi R^2}\propto r$. Outside: $B = \dfrac{\mu_0I}{2\pi r}\propto\dfrac1r$. At $r=R$ both give $\dfrac{\mu_0I}{2\pi R}$. On the axis $B=0$.`),
  xs(4, 'cyclotron', XR`Choose the correct statements about a cyclotron (non-relativistic).`,
    [XR`The ion's frequency of revolution does not depend on its speed.`, XR`The frequency does not depend on the radius of its path.`, XR`The final kinetic energy is proportional to the square of the dee radius.`, XR`The final kinetic energy does not depend on the magnetic field.`],
    [0, 1, 2],
    XR`$f = \dfrac{qB}{2\pi m}$ is independent of $v$ and $r$. $K = \dfrac{q^2B^2R^2}{2m}\propto R^2$ and $\propto B^2$, so D is false.`),
  xs(4, 'toroid', XR`Choose the correct statements about solenoids and toroids.`,
    [XR`Inside a toroid the field varies with the distance from its axis.`, XR`The field inside a long ideal solenoid is uniform.`, XR`The field outside an ideal toroid is zero.`, XR`Doubling the length of a solenoid, with the same turns and current, doubles the field inside.`],
    [0, 1, 2],
    XR`Toroid: $B = \dfrac{\mu_0NI}{2\pi r}$ varies with $r$ (A) and is zero outside (C). Ideal long solenoid: uniform (B). For the solenoid, $B = \mu_0nI$ and doubling the length halves $n$, so $B$ halves (D false).`),
  xa(4, 'circular motion', XR`The time taken by a non-relativistic charged particle to complete a circle in a uniform magnetic field does not depend on its speed.`, XR`When the speed is increased, the radius increases in the same proportion, so the particle covers a proportionally longer circle in the same time.`, 0,
    XR`$T = \dfrac{2\pi r}{v} = \dfrac{2\pi m}{qB}$ since $r = \dfrac{mv}{qB}$. Radius and speed scale together, so $T$ is unchanged. R gives the reason.`),
  xa(4, 'forces between wires', XR`Two long parallel wires carrying currents in opposite directions repel each other.`, XR`Two long parallel wires carrying currents in the same direction attract each other.`, 1,
    XR`Both statements are true. But R does not explain A: reversing one current reverses the force, and R is the fact for the other case. The explanation of A is that the field of one wire at the other, and the force $I\vec l\times\vec B$, both reverse direction when one current reverses.`),
  xt(4, 'galvanometer', XR`Increasing the number of turns of a moving coil galvanometer increases its current sensitivity.`, XR`Increasing the number of turns also increases its voltage sensitivity.`, 2,
    XR`Current sensitivity $\dfrac{\theta}{I} = \dfrac{NAB}{k}\propto N$ (true). Voltage sensitivity $\dfrac{\theta}{V} = \dfrac{NAB}{kR}$, and the coil's resistance $R$ also grows with $N$, so it does not necessarily rise: for a doubled $N$, both $N$ and $R$ double and it stays the same. Statement II is false.`),
  xt(4, 'field of a loop', XR`On the axis of a circular current loop the field is largest at the centre.`, XR`On the axis, $B = \dfrac{\mu_0IR^2}{2(R^2+x^2)^{3/2}}$.`, 0,
    XR`The expression decreases as $|x|$ increases, so it is greatest at $x=0$, where it becomes $\dfrac{\mu_0I}{2R}$. Both statements are true (unlike a charged ring's electric field, which is zero at the centre).`),
  xm(4, 'circular motion', XR`Protons, deuterons and alpha particles are accelerated through the same potential difference and enter the same perpendicular magnetic field. The radii $r_p : r_d : r_\alpha$ are in the ratio`,
    XR`$1:\sqrt2:\sqrt2$`, [XR`$1:2:2$`, XR`$1:\sqrt2:1$`, XR`$1:2:\sqrt2$`],
    XR`$r = \dfrac{\sqrt{2mqV}}{qB} = \dfrac{1}{B}\sqrt{\dfrac{2mV}{q}}\propto\sqrt{m/q}$. Proton: 1. Deuteron ($m=2,q=1$): $\sqrt2$. Alpha ($m=4,q=2$): $\sqrt2$.`),
);

// ---------- L5 ----------
items.push(
  xi(5, 'magnetic moment', XR`A uniformly charged disc of radius $R$ and total charge $Q$ rotates about its axis at angular speed $\omega$. Its magnetic moment is $\dfrac{Q\omega R^2}{n}$. Find $n$.`, 4,
    XR`A ring of radius $r$ and width $dr$ carries charge $dq = \dfrac{Q}{\pi R^2}2\pi r\,dr$, current $dI = \dfrac{\omega}{2\pi}dq$ and moment $dm = \pi r^2\,dI = \dfrac{Q\omega}{R^2}r^3\,dr$. Integrating from 0 to $R$: $m = \dfrac{Q\omega R^2}{4}$. So $n=4$.`,
    { trap: 'A ring would give $\\tfrac12Q\\omega R^2$; the disc has a smaller moment because inner charge counts less.' }),
  xi(5, 'force on a curved wire', XR`A semicircular wire of radius 0.20 m carries 10 A. Its ends lie on a line, and it is in a uniform field of 0.50 T perpendicular to its plane. The force on it, in newton, is`, 2 * 0.5 * 10 * 0.2,
    XR`The force on the curved wire equals the force on the straight chord between its ends: $F = BI(2R) = 0.50\times10\times0.40 = 2$ N.`, { unit: 'N', trap: 'It is not $\\pi RIB$.' }),
  xi(5, 'torque on a coil', XR`A coil of 50 turns and area $2\times10^{-3}$ m$^2$ carries 0.40 A. It is in a field of 0.50 T, with its plane parallel to the field. The torque is $n\times10^{-2}$ N m. Find $n$.`, 50 * 0.4 * 2e-3 * 0.5 / 1e-2,
    XR`Plane parallel to the field means the normal is perpendicular to it: $\tau = NIAB = 50\times0.40\times2\times10^{-3}\times0.50 = 0.02 = 2\times10^{-2}$ N m.`),
  xn(5, 'solenoid', XR`A flat spiral coil of 100 turns has inner radius 5.0 cm and outer radius 10.0 cm and carries 2.0 A. Treat the turns as spread uniformly in radius. Find the field at its centre, in mT.`, XMU * 100 * 2 / (2 * 0.05) * Math.log(2) * 1e3, 0.02, 2,
    XR`A thin annulus of radius $r$ and width $dr$ contains $dN = \dfrac{N}{b-a}dr$ turns and gives $dB = \dfrac{\mu_0I\,dN}{2r}$. Integrate: $B = \dfrac{\mu_0NI}{2(b-a)}\ln\dfrac ba = \dfrac{4\pi\times10^{-7}\times100\times2}{2\times0.05}\times0.693 = 1.74\times10^{-3}$ T.`, { unit: 'mT' }),
  xn(5, 'mass spectrometer', XR`Singly charged chlorine ions of mass 35 u and 37 u are accelerated through 2.0 kV and bent in a field of 0.50 T. They strike a plate after a half circle. Find the separation between the two landing spots, in mm ($1\ \mathrm{u} = 1.66\times10^{-27}$ kg).`, 2 * (Math.sqrt(2 * 37 * XU * 2000 / XQE) - Math.sqrt(2 * 35 * XU * 2000 / XQE)) / 0.5 * 1e3, 0.05, 2,
    XR`$r = \dfrac{1}{B}\sqrt{\dfrac{2mV}{q}}$. For 35 u: $r_1 = \dfrac{1}{0.5}\sqrt{\dfrac{2\times35\times1.66\times10^{-27}\times2000}{1.6\times10^{-19}}} = 0.0762$ m. For 37 u: $r_2 = 0.0784$ m. Spots are at diameters: separation $= 2(r_2-r_1) = 4.3$ mm.`, { unit: 'mm', trap: 'The landing spots are a <i>diameter</i> away, so the separation is twice the difference in radii.' }),
  xs(5, 'crossed fields', XR`Charged particles move through uniform crossed fields $\vec E\perp\vec B$ with $v = E/B$ undeflected. Choose the correct statements.`,
    [XR`The undeflected speed does not depend on the particle's charge or sign.`, XR`The undeflected speed does not depend on its mass.`, XR`A neutral particle is undeflected at any speed.`, XR`A particle with $v<E/B$ is deflected in the direction of the magnetic force.`],
    [0, 1, 2],
    XR`$qE = qvB$ gives $v = E/B$: no $q$ or $m$ (A, B). A neutral particle feels neither force (C). If $v<E/B$ then $qvB<qE$ and the electric force dominates: it bends along the electric force, not the magnetic one (D false).`),
  xs(5, 'field of a moving charge', XR`A point charge $q$ moves with constant velocity $\vec v$ (speed far below $c$). Choose the correct statements about its magnetic field at a point P.`,
    [XR`The field is zero at P if P is on the line of motion.`, XR`The field at perpendicular distance $r$ has magnitude $\dfrac{\mu_0qv}{4\pi r^2}$.`, XR`The field is perpendicular to both $\vec v$ and the line from the charge to P.`, XR`The field depends only on $v$, not on the position of P.`],
    [0, 1, 2],
    XR`$\vec B = \dfrac{\mu_0}{4\pi}\dfrac{q\vec v\times\hat r}{r^2}$. On the line of motion $\sin\theta = 0$ (A). At $\theta = 90^\circ$ the magnitude is $\dfrac{\mu_0qv}{4\pi r^2}$ (B). Direction is $\vec v\times\hat r$: perpendicular to both (C). It depends on distance and angle (D false).`),
  xs(5, 'moving coil galvanometer', XR`Choose the correct statements about a moving coil galvanometer with a radial field.`,
    [XR`The torque on the coil does not depend on the angle of deflection.`, XR`The deflection is proportional to the current.`, XR`The current sensitivity increases if the number of turns increases.`, XR`The current sensitivity increases if the torsion constant of the spring increases.`],
    [0, 1, 2],
    XR`The radial field keeps the plane parallel to $\vec B$, so $\tau = NIAB$ at all angles (A). It balances $k\phi$: $\phi = \dfrac{NAB}{k}I$ (B). Sensitivity $\propto N$ (C) and $\propto1/k$, so a stiffer spring lowers it (D false).`),
  xs(5, 'neutral point', XR`Two long parallel wires, 1 and 2, carry currents $I_1\ne0$ and $I_2\ne0$. Choose the correct statements.`,
    [XR`If the currents are equal and in the same direction, the field is zero midway between them.`, XR`If the currents are opposite, the field is zero nowhere between them.`, XR`If the currents are unequal and opposite, a zero of the field exists outside the wires, nearer the wire with the smaller current.`, XR`If the currents are equal and opposite, the field is zero somewhere outside the wires.`],
    [0, 1, 2],
    XR`Same direction: fields oppose between the wires and are equal at the midpoint (A). Opposite: fields add between them (B). Outside, the fields oppose; equality needs $\dfrac{I_1}{x_1} = \dfrac{I_2}{x_2}$ with the larger distance for the larger current, so the point is nearer the smaller current (C). For equal currents $x_1=x_2$ cannot hold outside, so no zero (D false).`),
  xs(5, 'magnetic moment', XR`A ring of charge $Q$, mass $m$ and radius $R$ rotates about its axis at angular speed $\omega$. Choose the correct statements.`,
    [XR`The equivalent current is $\dfrac{Q\omega}{2\pi}$.`, XR`The field at the centre is $\dfrac{\mu_0Q\omega}{4\pi R}$.`, XR`The magnetic moment is $\dfrac12Q\omega R^2$.`, XR`The ratio of magnetic moment to angular momentum depends on $R$.`],
    [0, 1, 2],
    XR`$I = Q/T = \dfrac{Q\omega}{2\pi}$. $B = \dfrac{\mu_0I}{2R} = \dfrac{\mu_0Q\omega}{4\pi R}$. $\mu = I\pi R^2 = \tfrac12Q\omega R^2$. Angular momentum $L = mR^2\omega$, so $\mu/L = \dfrac{Q}{2m}$, independent of $R$ (D false).`),
  xmatch(5, 'neutral point', 'xm4', XR`Match each case in List I with the position of zero field in List II ($d$ = separation of the wires).`, 'A-p, B-r, C-q, D-s',
    XR`Equal parallel currents: zero midway (p). Currents $2I$ and $I$ in the same direction: from $\dfrac{2I}{x} = \dfrac{I}{d-x}$, $x = \dfrac{2d}{3}$ from the $2I$ wire (r). Equal opposite currents: the fields add between and are unequal in size outside, so there is no zero (q). Currents $2I$ and $I$ opposite: outside, nearer $I$: $\dfrac{2I}{d+y} = \dfrac{I}{y}$ gives $y = d$ from the $I$ wire (s).`),
  xmatch(5, 'meters', 'xm6', XR`Match each item in List I with the matching item in List II.`, 'A-p, B-q, C-r, D-s',
    XR`Ammeter: low resistance shunt in parallel (p). Voltmeter: high resistance in series (q). A shunt in parallel makes total resistance less than $G$ (r). A series resistor makes it more than $G$ (s).`),
  xmatch(5, 'motion in a field', 'xm7', XR`Match each situation in List I with the path in List II.`, 'A-q, B-p, C-r, D-s',
    XR`$\vec v\parallel\vec B$: no force, straight line (q). $\vec v\perp\vec B$: circle (p). $60^\circ$: circle plus drift along $\vec B$, a helix (r). Crossed fields with $v=E/B$: the two forces cancel, a straight line (s).`),
  xmatch(5, "Ampère's law", 'xm8', XR`Match each position in List I with the field in List II.`, 'A-q, B-p, C-s, D-r',
    XR`Inside, $B = \dfrac{\mu_0Ir}{2\pi R^2}$: at $r=R/2$ this is $\dfrac{\mu_0I}{4\pi R}$ (q). At the surface $r=R$: $\dfrac{\mu_0I}{2\pi R}$ (p). Outside, $B = \dfrac{\mu_0I}{2\pi r}$: at $r=4R$ it is $\dfrac{\mu_0I}{8\pi R}$ (s). On the axis $r=0$ gives 0 (r).`),
);


items.push(
  xn(4, 'finite solenoid', XR`A long solenoid has 1000 turns per metre and carries 4.0 A. Find the field on its axis at one open end, in mT.`, XMU * 1000 * 4 / 2 * 1e3, 0.03, 2,
    XR`Deep inside, $B = \mu_0nI = 4\pi\times10^{-7}\times1000\times4 = 5.03$ mT. At an open end of a long solenoid the field is half of that: $2.51$ mT.`, { unit: 'mT', trap: 'The end value is half the central value, not equal to it.' }),
  xi(4, 'concentric loops', XR`A 2-turn coil of radius 0.10 m and a single turn of radius 0.20 m share a centre and lie in one plane. Each carries 10 A, in opposite senses. The field at the centre is $n\pi\times10^{-5}$ T. Find $n$.`, XMU * 10 / 2 * (2 / 0.1 - 1 / 0.2) / (XPI * 1e-5),
    XR`$B = \dfrac{\mu_0I}{2}\left(\dfrac{N_1}{r_1}-\dfrac{N_2}{r_2}\right) = 2\pi\times10^{-6}\left(20-5\right) = 30\pi\times10^{-6} = 3\pi\times10^{-5}$ T. So $n=3$.`, { trap: 'Opposite senses subtract.' }),
  xm(4, 'time in a field region', XR`A particle of charge $q$ and mass $m$ enters a field region of width $d$ and strength $B$, moving perpendicular to the boundary and to $B$. The least speed with which it can cross the region is`,
    XR`$\dfrac{qBd}{m}$`, [XR`$\dfrac{qBd}{2m}$`, XR`$\dfrac{2qBd}{m}$`, XR`$\dfrac{qB}{md}$`],
    XR`It just grazes the far edge when the radius equals the width: $r = \dfrac{mv}{qB} = d$, so $v = \dfrac{qBd}{m}$. For a larger speed it crosses the region.`),
  xt(5, 'crossed fields', XR`A charged particle can move in a straight line through a region having both an electric and a magnetic field.`, XR`This happens when the net force $q\vec E+q\vec v\times\vec B$ on it is zero.`, 0,
    XR`Example: crossed fields with $v=E/B$. A straight line at constant velocity requires zero net force, which is exactly Statement II. Both true.`),
);

// ---------- passages ----------
items.push(
  xn(3, 'velocity selector', XR`Find the speed of the ions that leave the velocity selector undeflected, in $10^{5}$ m/s.`, 5e4 / 0.25 / 1e5, 0.01, 2,
    XR`$v = \dfrac{E}{B_1} = \dfrac{5.0\times10^{4}}{0.25} = 2.0\times10^{5}$ m/s.`, XPY({ group: 'xp1', unit: '×10⁵ m/s' })),
  xn(4, 'mass spectrometer', XR`Find the radius of their circular path in the second field, in cm.`, 40 * XU * 2e5 / (XQE * 0.5) * 100, 0.15, 2,
    XR`$r = \dfrac{mv}{qB_2} = \dfrac{40\times1.66\times10^{-27}\times2.0\times10^{5}}{1.6\times10^{-19}\times0.50} = 0.166$ m $= 16.6$ cm.`, XPY({ group: 'xp1', unit: 'cm' })),
  xm(5, 'mass spectrometer', XR`Ions of mass 36 u (same charge and same speed) are also present in the beam. They go through the selector undeflected. In the second field the ratio of their radius to that of the 40 u ions is`,
    '0.9', ['1.11', '0.81', '1'],
    XR`The selector passes both, since $v = E/B_1$ is independent of mass. Then $r\propto m$ at fixed $q$, $v$, $B_2$: $\dfrac{36}{40} = 0.9$.`, XPY({ group: 'xp1', trap: 'The selector does not separate masses; the second field does.' })),
  xn(3, 'magnetic moment', XR`Find the magnetic moment of the coil, in A m$^2$.`, 50 * 2 * XPI * 0.01, 0.01, 2,
    XR`$m = NIA = 50\times2.0\times\pi\times(0.10)^2 = 3.14\ \mathrm{A\,m^2}$.`, XPY({ group: 'xp2', unit: 'A m²' })),
  xn(4, 'torque on a loop', XR`Find the torque on the coil at the start, in N m.`, 50 * 2 * XPI * 0.01 * 0.4, 0.01, 2,
    XR`Plane parallel to $\vec B$ means moment perpendicular to $\vec B$: $\tau = mB = 3.14\times0.40 = 1.26$ N m.`, XPY({ group: 'xp2', unit: 'N m' })),
  xn(5, 'energy of a dipole', XR`The coil is free to turn about a diameter and has moment of inertia $0.050\ \mathrm{kg\,m^2}$. It is released from the starting position and turns until its moment lines up with the field. Find its angular speed then, in rad/s (ignore damping).`, Math.sqrt(2 * 50 * 2 * XPI * 0.01 * 0.4 / 0.05), 0.07, 2,
    XR`Energy: $U = -mB\cos\theta$ with $\theta$ from the moment to $\vec B$. At the start $\theta = 90^\circ$, $U=0$; at alignment $U = -mB$. So $\tfrac12I\omega^2 = mB = 1.257$ J and $\omega = \sqrt{\dfrac{2\times1.257}{0.050}} = 7.09$ rad/s.`, XPY({ group: 'xp2', unit: 'rad/s', trap: 'The kinetic energy gained is $mB$, not $2mB$.' })),
);

// ---------- templates ----------
gens.push(
  XG(27, 3, 'mcq', 'circular motion', (rng) => {
    const v = int(rng, 0, 3); const w = choose(rng, [{ n: 'deuteron', m: 2, q: 1 }, { n: 'alpha particle', m: 4, q: 2 }]);
    const cond = ['the same speed', 'the same kinetic energy', 'the same accelerating potential difference', 'the same momentum'][v];
    const ratio = [w.m / w.q, Math.sqrt(w.m) / w.q, Math.sqrt(w.m / w.q), 1 / w.q][v];
    const why = [XR`$r = \dfrac{mv}{qB}\propto\dfrac mq$`, XR`$r = \dfrac{\sqrt{2mK}}{qB}\propto\dfrac{\sqrt m}{q}$`, XR`$r = \dfrac1B\sqrt{\dfrac{2mV}{q}}\propto\sqrt{\dfrac mq}$`, XR`$r = \dfrac{p}{qB}\propto\dfrac1q$`][v];
    const pool = [w.m / w.q, Math.sqrt(w.m) / w.q, Math.sqrt(w.m / w.q), 1 / w.q, w.m, w.q, 1 / w.m];
    const wr = []; for (const x of pool) { if (Math.abs(x - ratio) > 1e-9 && !wr.some((y) => Math.abs(y - x) < 1e-9)) wr.push(x); if (wr.length === 3) break; }
    const o = numOpts(rng, ratio, wr, '', 3);
    return { v, wm: w.m, wq: w.q, rt: f3(ratio), q: XR`A proton and a ${w.n} enter the same uniform magnetic field perpendicular to it with ${cond}. The radius of the ${w.n}'s path is how many times the proton's radius?`, options: o.options, answer: o.answer,
      sol: XR`${why}. For the ${w.n} ($m = ${w.m}m_p$, $q = ${w.q}q_p$) the ratio is $${f3(ratio)}$.`, trap: 'Decide which quantity is held equal, then see how $r$ depends on $m$ and $q$.' };
  }, (p) => { const ratio = [p.wm / p.wq, Math.sqrt(p.wm) / p.wq, Math.sqrt(p.wm / p.wq), 1 / p.wq][p.v]; return p.options.findIndex((o) => o === f3(ratio)); }),
  XG(28, 4, 'nat', 'Biot-Savart for a straight wire', (rng) => {
    const a = choose(rng, [0.2, 0.3, 0.4]); const d = choose(rng, [0.1, 0.15, 0.2, 0.3]); const I = pick(rng, 5, 20, 5);
    const s = a / Math.sqrt(a * a + d * d); const B = 1e-7 * I / d * 2 * s * 1e6;
    return { a, d, I, q: XR`A straight wire ${2 * a} m long carries ${I} A. Find the field at a point ${d} m from its midpoint on the perpendicular bisector, in $\mu$T.`, answer: +B.toFixed(3), tol: Math.max(0.02, B * 0.01), unit: 'µT',
      sol: XR`$B = \dfrac{\mu_0I}{4\pi d}(\sin\phi_1+\sin\phi_2)$ with $\sin\phi = \dfrac{${a}}{\sqrt{${a}^2+${d}^2}} = ${f3(s)}$. $B = \dfrac{10^{-7}\times${I}}{${d}}\times${f3(2 * s)} = ${f3(B)}\ \mu$T.` };
  }, (p) => { let sum = 0; const N = 20000; for (let i = 0; i < N; i++) { const y = -p.a + (i + 0.5) / N * 2 * p.a; const dl = 2 * p.a / N; sum += 1e-7 * p.I * dl * p.d / Math.pow(y * y + p.d * p.d, 1.5); } return sum * 1e6; }),
  XG(29, 4, 'nat', 'field of a spiral coil', (rng) => {
    const a = choose(rng, [0.02, 0.04, 0.05]); const b = choose(rng, [0.08, 0.1, 0.12]); const N = choose(rng, [50, 100, 200]); const I = pick(rng, 1, 4);
    const B = XMU * N * I / (2 * (b - a)) * Math.log(b / a) * 1e3;
    return { a, b, N, I, q: XR`A flat spiral coil of ${N} turns has inner radius ${a * 100} cm and outer radius ${b * 100} cm, carrying ${I} A with the turns spread uniformly in radius. Find the field at its centre, in mT.`, answer: +B.toFixed(3), tol: Math.max(0.01, B * 0.01), unit: 'mT',
      sol: XR`$B = \dfrac{\mu_0NI}{2(b-a)}\ln\dfrac ba = \dfrac{4\pi\times10^{-7}\times${N}\times${I}}{2\times${f3(b - a)}}\times${f3(Math.log(b / a))} = ${f3(B)}$ mT.` };
  }, (p) => { let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const r = p.a + (i + 0.5) / n * (p.b - p.a); s += XMU * p.I * (p.N / (p.b - p.a)) * ((p.b - p.a) / n) / (2 * r); } return s * 1e3; }),
  XG(30, 4, 'nat', 'forces between wires', (rng) => {
    const I = pick(rng, 5, 20, 5); const d = choose(rng, [0.05, 0.1, 0.2]);
    const F = Math.sqrt(3) * 2e-7 * I * I / d;
    return { I, d, q: XR`Three long parallel wires pass through the corners of an equilateral triangle of side ${d} m, each carrying ${I} A in the same direction. Find the force per unit length on one of them, in $10^{-4}$ N/m.`, answer: +(F / 1e-4).toFixed(3), tol: Math.max(0.01, F / 1e-4 * 0.01), unit: '×10⁻⁴ N/m',
      sol: XR`Each other wire attracts with $F_0 = \dfrac{\mu_0I^2}{2\pi d} = ${f3(2e-7 * I * I / d / 1e-4)}\times10^{-4}$ N/m. The two forces are $60^\circ$ apart, so the resultant is $\sqrt3F_0 = ${f3(F / 1e-4)}\times10^{-4}$ N/m.` };
  }, (p) => { const F0 = 2e-7 * p.I * p.I / p.d; const u1 = [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)]; const u2 = [1, 0]; return Math.hypot(F0 * (u1[0] + u2[0]), F0 * (u1[1] + u2[1])) / 1e-4; }),
  XG(31, 5, 'nat', 'mass spectrometer', (rng) => {
    const m1 = choose(rng, [20, 35, 63]); const dm = choose(rng, [1, 2]); const V = choose(rng, [1000, 2000, 4000]); const B = choose(rng, [0.4, 0.5, 0.8]);
    const rr = (m) => Math.sqrt(2 * m * XU * V / XQE) / B; const sep = 2 * (rr(m1 + dm) - rr(m1)) * 1e3;
    return { m1, dm, V, B, q: XR`Singly charged ions of mass ${m1} u and ${m1 + dm} u are accelerated through ${V} V and bent through a half circle in a field of ${B} T. Find the distance between the two landing spots, in mm ($1\ \mathrm{u}=1.66\times10^{-27}$ kg).`, answer: +sep.toFixed(3), tol: Math.max(0.05, sep * 0.01), unit: 'mm',
      sol: XR`$r = \dfrac1B\sqrt{\dfrac{2mV}{q}}$ gives $r_1 = ${f3(rr(m1) * 100)}$ cm and $r_2 = ${f3(rr(m1 + dm) * 100)}$ cm. The spots are a diameter from the entry point, so the separation is $2(r_2-r_1) = ${f3(sep)}$ mm.` };
  }, (p) => { const k = (m) => Math.sqrt(2 * m * 1.66e-27 * p.V / 1.6e-19) / p.B; return 2 * (k(p.m1 + p.dm) - k(p.m1)) * 1e3; }),
  XG(32, 3, 'mcq', 'conversion of a galvanometer', (rng) => {
    const v = int(rng, 0, 1); const G = choose(rng, [40, 50, 100, 200]); const Ig = choose(rng, [1, 2, 5]) * 1e-3;
    if (v === 0) { const I = choose(rng, [0.5, 1, 2, 5]); const S = Ig * G / (I - Ig); const o = numOpts(rng, S, [Ig * G / I, I * G, G * (I - Ig)], 'Ω', 3);
      return { v, G, Ig, I, q: XR`A galvanometer of resistance ${G} $\Omega$ shows full scale for ${Ig * 1e3} mA. The shunt needed to make it an ammeter of range 0 to ${I} A is`, options: o.options, answer: o.answer, sol: XR`$S = \dfrac{I_gG}{I-I_g} = \dfrac{${sg(Ig)}\times${G}}{${I}-${sg(Ig)}} = ${f3(S)}\ \Omega$ in parallel.`, trap: 'The shunt carries $I - I_g$, not $I$.' }; }
    const V = choose(rng, [3, 5, 10, 15]); const R = V / Ig - G; const o = numOpts(rng, R, [V / Ig, V / Ig + G, Ig * G / V], 'Ω', 3);
    return { v, G, Ig, V, q: XR`A galvanometer of resistance ${G} $\Omega$ shows full scale for ${Ig * 1e3} mA. The series resistance needed to make it a voltmeter of range 0 to ${V} V is`, options: o.options, answer: o.answer, sol: XR`$R = \dfrac{V}{I_g} - G = \dfrac{${V}}{${sg(Ig)}} - ${G} = ${f3(R)}\ \Omega$ in series.`, trap: 'Subtract the galvanometer\'s own resistance.' };
  }, (p) => { const val = p.v === 0 ? p.Ig * p.G / (p.I - p.Ig) : p.V / p.Ig - p.G; return p.options.findIndex((o) => o === `${f3(val)} Ω`); }),
  XG(33, 4, 'nat', 'helical motion', (rng) => {
    const part = choose(rng, [{ n: 'proton', m: XMP }, { n: 'electron', m: 9.11e-31 }]); const th = choose(rng, [30, 45, 60]); const B = choose(rng, [0.1, 0.2, 0.5]); const v = pick(rng, 1, 5) * 1e6;
    const T = 2 * XPI * part.m / (XQE * B); const pitch = v * Math.cos(th * XPI / 180) * T; const r = part.m * v * Math.sin(th * XPI / 180) / (XQE * B);
    return { n: part.n, m: part.m, th, B, v, q: XR`A ${part.n} moves at $${v / 1e6}\times10^{6}$ m/s at $${th}^\circ$ to a uniform field of ${B} T. Find the pitch of its helix, in cm.`, answer: +(pitch * 100).toFixed(4), tol: Math.max(0.0005, pitch * 100 * 0.01), unit: 'cm',
      sol: XR`$T = \dfrac{2\pi m}{qB} = ${f3(T)}$ s and $v_\parallel = v\cos${th}^\circ = ${f3(v * Math.cos(th * XPI / 180))}$ m/s. Pitch $= v_\parallel T = ${f3(pitch * 100)}$ cm. (The radius of the helix is $${f3(r * 100)}$ cm.)` };
  }, (p) => { const r = p.m * p.v * Math.sin(p.th * XPI / 180) / (XQE * p.B); const vperp = p.v * Math.sin(p.th * XPI / 180); const t = 2 * XPI * r / vperp; return p.v * Math.cos(p.th * XPI / 180) * t * 100; }),
  XG(34, 5, 'nat', 'magnetic moment', (rng) => {
    const v = int(rng, 0, 1); const Q = pick(rng, 1, 9) * 1e-6; const w = pick(rng, 50, 300, 50); const R = choose(rng, [0.1, 0.2, 0.3]);
    const mu = v === 0 ? 0.5 * Q * w * R * R : 0.25 * Q * w * R * R;
    return { v, Q, w, R, q: XR`A ${v === 0 ? 'thin ring' : 'uniformly charged disc'} of radius ${R} m carries $${Q * 1e6}\ \mu$C ${v === 0 ? 'spread uniformly on it' : 'spread uniformly over its face'} and rotates about its axis at ${w} rad/s. Find its magnetic moment, in $10^{-6}$ A m$^2$.`, answer: +(mu / 1e-6).toFixed(3), tol: Math.max(0.01, mu / 1e-6 * 0.01), unit: '×10⁻⁶ A m²',
      sol: v === 0 ? XR`$I = \dfrac{Q\omega}{2\pi}$ and $\mu = I\pi R^2 = \tfrac12Q\omega R^2 = ${f3(mu / 1e-6)}\times10^{-6}$ A m$^2$.` : XR`Summing ring by ring, $\mu = \tfrac14Q\omega R^2 = ${f3(mu / 1e-6)}\times10^{-6}$ A m$^2$.` };
  }, (p) => { if (p.v === 0) return (p.Q * p.w / (2 * XPI)) * XPI * p.R * p.R / 1e-6; let m = 0; const n = 20000; for (let i = 0; i < n; i++) { const r = (i + 0.5) / n * p.R; const dq = p.Q / (XPI * p.R * p.R) * 2 * XPI * r * (p.R / n); m += (dq * p.w / (2 * XPI)) * XPI * r * r; } return m / 1e-6; }),
  XG(35, 5, 'nat', 'neutral point', (rng) => {
    const same = int(rng, 0, 1); const I1 = pick(rng, 1, 4); const k = choose(rng, [2, 3, 4]); const I2 = I1 * k; const d = choose(rng, [0.2, 0.3, 0.4, 0.6]);
    const x = same ? d * I1 / (I1 + I2) : d * I1 / (I2 - I1);
    return { same, I1, I2, d, q: XR`Two long parallel wires ${d * 100} cm apart carry ${I1} A and ${I2} A ${same ? 'in the same direction' : 'in opposite directions'}. Find the distance of the point of zero field from the ${I1} A wire, in cm${same ? ' (on the line between them)' : ' (outside the wires)'}.`, answer: +(x * 100).toFixed(3), tol: Math.max(0.01, x * 100 * 0.01), unit: 'cm',
      sol: same ? XR`Between the wires, $\dfrac{${I1}}{x} = \dfrac{${I2}}{${d * 100}-x}$ (in cm), so $x = \dfrac{${d * 100}\times${I1}}{${I1}+${I2}} = ${f3(x * 100)}$ cm.` : XR`Outside, nearer the smaller current: $\dfrac{${I1}}{x} = \dfrac{${I2}}{x+${d * 100}}$, so $x = \dfrac{${d * 100}\times${I1}}{${I2}-${I1}} = ${f3(x * 100)}$ cm, on the side away from the ${I2} A wire.` };
  }, (p) => { let lo = 1e-6, hi = 10; const B = (x) => p.same ? 1 / x - p.I2 / p.I1 / (p.d - x) : 1 / x - p.I2 / p.I1 / (x + p.d); const a = p.same ? 1e-6 : 1e-6; let A = a, Bb = p.same ? p.d - 1e-6 : 100; for (let i = 0; i < 200; i++) { const m = (A + Bb) / 2; if (B(A) * B(m) <= 0) Bb = m; else A = m; } return A * 100; }),
);

}

export default { topic: 'moving-charges-magnetism', groups, items, gens };
