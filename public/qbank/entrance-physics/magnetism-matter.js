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
const nid = () => `mm-${String(++k).padStart(3, '0')}`;
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
// index of the correct option text in a generated mcq, for verify
const vo = (p, val, unit, sig = 3) => p.options.indexOf(`${fmt(val, sig)}${unit ? ' ' + unit : ''}`);
const K = 1e-7; // mu0/4pi
const MUB = 9.274e-24; const HBAR = 1.0546e-34; const ECH = 1.602e-19; const MEL = 9.109e-31;
const items = [
  // ---------- Level 1 ----------
  mcq(1, 'magnetic moment', r`The SI unit of the magnetic moment of a bar magnet is`, r`$\mathrm{A\,m^2}$`, [r`$\mathrm{A\,m^{-1}}$`, r`$\mathrm{T\,m}$`, r`$\mathrm{Wb\,m^{-2}}$`],
    r`A current loop has $M = IA$, so the unit is ampere $\times$ metre$^2$. It is the same as $\mathrm{J\,T^{-1}}$ (from $U = -MB\cos\theta$). $\mathrm{A\,m^{-1}}$ is the unit of $H$ and of magnetisation, not of moment.`),
  mcq(1, 'field lines', r`Magnetic field lines of a bar magnet`, 'form closed loops, running from the N pole to the S pole outside and from S to N inside', ['start at the N pole and end at infinity', 'start at the S pole and end at the N pole outside the magnet', 'can cross each other near the poles'],
    r`There are no magnetic monopoles, so field lines never start or stop. Outside the magnet they go N to S; inside they continue S to N and close. Lines never cross because the field has one direction at a point.`),
  mcq(1, 'dia-, para-, ferro-', r`A diamagnetic substance, placed in a magnetic field, is`, 'weakly repelled', ['weakly attracted', 'strongly attracted', 'not affected at all'],
    r`Diamagnetic atoms get a small induced moment opposite to the applied field, so the sample is pushed (weakly) towards the weaker field region. Every material has this effect, but it is only visible when no stronger effect is present.`),
  nat(1, 'solenoid equivalent', r`A coil of 100 turns, each of area $0.01\ \mathrm{m^2}$, carries 2 A. Find its magnetic moment (in $\mathrm{A\,m^2}$).`, 100 * 2 * 0.01, 0.01, 2,
    r`$M = NIA = 100\times2\times0.01 = 2\ \mathrm{A\,m^2}$.`, { unit: 'A m^2' }),
  nat(1, 'torque on a magnet', r`A bar magnet of moment $0.5\ \mathrm{A\,m^2}$ is at right angles to a field of 0.2 T. Find the torque on it (in N m, 2 decimals).`, 0.5 * 0.2, 0.005, 2,
    r`$\tau = MB\sin\theta = 0.5\times0.2\times\sin90^\circ = 0.10$ N m.`, { unit: 'N m' }),
  mcq(1, 'ferromagnetism', r`The magnetic susceptibility of a ferromagnetic material is`, 'large and positive', ['small and positive', 'small and negative', 'exactly zero'],
    r`Domains in iron, cobalt and nickel line up in a field, so $\chi$ is very large (hundreds to thousands) and positive. Small positive values belong to paramagnets and small negative values to diamagnets.`),
  mcq(1, "Earth's magnetism", r`At the magnetic equator the angle of dip is`, r`$0^\circ$`, [r`$90^\circ$`, r`$45^\circ$`, r`$180^\circ$`],
    r`At the magnetic equator the Earth's field is horizontal, so the dip needle is level: $\delta = 0$. At the magnetic poles the field is vertical and $\delta = 90^\circ$.`),
  mcq(1, 'Curie temperature', r`Above its Curie temperature a ferromagnetic substance behaves as a`, 'paramagnetic substance', ['diamagnetic substance', 'stronger ferromagnet', 'superconductor'],
    r`Thermal motion destroys the domain alignment, so only a weak paramagnetism is left. Iron has a Curie temperature of about 1043 K.`),
  mcq(1, 'dipole field', r`At a point on the equatorial line of a short bar magnet, the magnetic field is directed`, 'parallel to the axis, from the N pole side to the S pole side (opposite to the moment)', ['along the line joining the point to the centre', 'perpendicular to the axis, away from the magnet', 'parallel to the moment $\\vec M$'],
    r`On the equatorial line $\vec B = -\dfrac{\mu_0}{4\pi}\dfrac{\vec M}{r^3}$. The moment points from S to N inside the magnet, so the field here points opposite to it (N towards S). On the axial line the field is along $\vec M$.`),
  mcq(1, 'hysteresis', r`The area of the hysteresis loop of a material gives`, 'the energy lost as heat per unit volume in one cycle of magnetisation', ['the susceptibility of the material', 'the Curie temperature', 'the retentivity of the material'],
    r`Area of the $B$-$H$ loop has units $\mathrm{T\times A\,m^{-1}} = \mathrm{J\,m^{-3}}$. It is the energy per unit volume turned into heat in one cycle.`),
  mcq(1, 'magnetic monopole', r`Gauss's law for magnetism says that the net magnetic flux through any closed surface is`, 'zero', ['equal to $\\mu_0$ times the current inside', 'equal to the charge inside divided by $\\epsilon_0$', 'equal to the pole strength inside'],
    r`$\oint\vec B\cdot d\vec A = 0$ because isolated magnetic poles do not exist. Cutting a magnet only gives smaller magnets, each with both poles.`),
  mcq(1, 'relative permeability', r`The relative permeability $\mu_r$ and the susceptibility $\chi$ of a material are related by`, r`$\mu_r = 1 + \chi$`, [r`$\mu_r = 1 - \chi$`, r`$\mu_r = \chi$`, r`$\mu_r = \chi/(1+\chi)$`],
    r`From $B = \mu_0(H+M)$ and $M = \chi H$ we get $B = \mu_0(1+\chi)H = \mu_r\mu_0H$, so $\mu_r = 1+\chi$.`),
  // ---------- Level 2 ----------
  nat(2, 'dipole field on axis', r`A short bar magnet has moment $1.2\ \mathrm{A\,m^2}$. Find its field at a point on its axis 20 cm from its centre (in $\mu$T).`, K * 2 * 1.2 / 0.2 ** 3 * 1e6, 0.5, 0,
    r`$B_{axial} = \dfrac{\mu_0}{4\pi}\dfrac{2M}{r^3} = 10^{-7}\times\dfrac{2\times1.2}{(0.2)^3} = 10^{-7}\times300 = 3\times10^{-5}$ T $= 30\ \mu$T.`, { unit: 'µT' }),
  nat(2, 'dipole field on equator', r`A short bar magnet of moment $2\ \mathrm{A\,m^2}$ lies with its centre 10 cm from point P on its equatorial line. Find the field at P (in $\mu$T).`, K * 2 / 0.1 ** 3 * 1e6, 1, 0,
    r`$B_{eq} = \dfrac{\mu_0}{4\pi}\dfrac{M}{r^3} = 10^{-7}\times\dfrac{2}{10^{-3}} = 2\times10^{-4}$ T $= 200\ \mu$T.`, { unit: 'µT' }),
  mcq(2, 'dipole field', r`For a short magnet, the ratio of the axial field to the equatorial field at the same distance from its centre is`, '2', ['1', '1/2', '4'],
    r`$B_{ax} = \dfrac{\mu_0}{4\pi}\dfrac{2M}{r^3}$ and $B_{eq} = \dfrac{\mu_0}{4\pi}\dfrac{M}{r^3}$, so the ratio is 2.`),
  mcq(2, 'dipole field', r`The distance of a point on the axis of a short magnet from it is doubled. The magnetic field there becomes`, r`$\dfrac18$ of its value`, [r`$\dfrac14$ of its value`, r`$\dfrac12$ of its value`, r`$\dfrac1{16}$ of its value`],
    r`A dipole field falls as $1/r^3$. With $r\to2r$ the field is $1/2^3 = 1/8$. The $1/r^2$ rule belongs to a single pole, which does not exist.`),
  nat(2, 'potential energy', r`A magnet of moment $0.4\ \mathrm{A\,m^2}$ makes $60^\circ$ with a field of 0.5 T. Find its potential energy $U = -\vec M\cdot\vec B$ (in J, 2 decimals, with sign).`, -0.4 * 0.5 * Math.cos(Math.PI / 3), 0.005, 2,
    r`$U = -MB\cos\theta = -0.4\times0.5\times\cos60^\circ = -0.4\times0.5\times0.5 = -0.10$ J.`, { unit: 'J' }),
  nat(2, 'work done in rotation', r`How much work is needed to turn a magnet of moment $0.3\ \mathrm{A\,m^2}$ from the direction of a 0.2 T field to a position at right angles to it (in J, 2 decimals)?`, 0.3 * 0.2, 0.005, 2,
    r`$W = U_f - U_i = (-MB\cos90^\circ) - (-MB\cos0^\circ) = MB = 0.3\times0.2 = 0.06$ J.`, { unit: 'J' }),
  nat(2, "Earth's magnetism", r`At a place the horizontal component of the Earth's field is $3\times10^{-5}$ T and the angle of dip is $60^\circ$. Find the total field (in $\mu$T).`, 30 / Math.cos(Math.PI / 3), 0.5, 0,
    r`$B_h = B_e\cos\delta$, so $B_e = \dfrac{B_h}{\cos\delta} = \dfrac{30\ \mu T}{0.5} = 60\ \mu$T.`, { unit: 'µT' }),
  mcq(2, "Earth's magnetism", r`At a place, the vertical and horizontal components of the Earth's field are equal. The angle of dip there is`, r`$45^\circ$`, [r`$30^\circ$`, r`$60^\circ$`, r`$90^\circ$`],
    r`$\tan\delta = B_v/B_h = 1$, so $\delta = 45^\circ$.`),
  mcq(2, 'bar magnet cut', r`A bar magnet of moment $M$ is cut into two equal halves by a plane perpendicular to its length. The moment of each half is`, r`$M/2$`, [r`$M$`, r`$M/4$`, r`$2M$`],
    r`Pole strength $m$ stays the same (each piece has its own N and S poles of strength $m$) but the length halves, so $M' = m(L/2) = M/2$.`, { trap: 'If you cut it along its length instead, the pole strength halves and the moment is again M/2.' }),
  mcq(2, 'susceptibility', r`The susceptibility of a paramagnetic material is $2.4\times10^{-5}$ at 300 K. By Curie's law its susceptibility at 200 K is`, r`$3.6\times10^{-5}$`, [r`$1.6\times10^{-5}$`, r`$5.4\times10^{-5}$`, r`$2.4\times10^{-5}$`],
    r`Curie's law: $\chi = C/T$, so $\chi\propto1/T$. $\chi_2 = 2.4\times10^{-5}\times\dfrac{300}{200} = 3.6\times10^{-5}$. Cooling makes a paramagnet more susceptible.`),
  mcq(2, 'hysteresis', r`The best material for the core of a transformer is one with`, 'low retentivity, low coercivity and high permeability', ['high retentivity and high coercivity', 'high retentivity and low coercivity', 'low permeability and high coercivity'],
    r`A transformer core is magnetised and demagnetised 50 or 60 times a second, so we want a thin $B$-$H$ loop (small area, small loss) and a large $\mu$ (soft iron). High retentivity and coercivity are what we want in a permanent magnet.`),
  mcq(2, 'permanent magnets', r`Steel is preferred to soft iron for making permanent magnets because steel has a`, 'high coercivity (and high retentivity)', ['high permeability', 'low retentivity', 'low coercivity'],
    r`Coercivity measures how hard it is to demagnetise a sample. Steel keeps its magnetism against stray fields and knocks; soft iron loses it easily even though its permeability is higher.`),
  nat(2, 'magnetising field', r`A solenoid has 800 turns per metre and carries 2.5 A. Find the magnetising field $H$ inside it (in $\mathrm{A\,m^{-1}}$).`, 800 * 2.5, 0, 0,
    r`$H = nI = 800\times2.5 = 2000\ \mathrm{A\,m^{-1}}$. $H$ depends only on the free current, not on the core material.`, { unit: 'A/m' }),
  nat(2, 'magnetisation', r`A rod of volume $20\ \mathrm{cm^3}$ has a total magnetic moment of $8\ \mathrm{A\,m^2}$. Find its magnetisation (in $10^5\ \mathrm{A\,m^{-1}}$, 1 decimal).`, 8 / 20e-6 / 1e5, 0.05, 1,
    r`Magnetisation $=$ moment per unit volume $= \dfrac{8}{20\times10^{-6}} = 4\times10^{5}\ \mathrm{A\,m^{-1}}$, which is 4.0 in the units asked.`, { unit: '10^5 A/m' }),
  nat(2, 'relative permeability', r`The magnetic flux density in an iron core is 0.6 T when $H = 300\ \mathrm{A\,m^{-1}}$. Find $\mu_r$ (nearest integer).`, 0.6 / (4 * Math.PI * 1e-7 * 300), 5, 0,
    r`$\mu_r = \dfrac{B}{\mu_0H} = \dfrac{0.6}{4\pi\times10^{-7}\times300} = \dfrac{0.6}{3.77\times10^{-4}} \approx 1592$.`, { unit: '' }),
  mcq(2, 'orientation in a field', r`A thin rod of a paramagnetic material is suspended in a uniform magnetic field. It will align itself`, 'parallel to the field', ['perpendicular to the field', 'at $45^\\circ$ to the field', 'in any direction, because the force is zero'],
    r`The rod gets a magnetisation along $\vec B$ and tries to lower its energy by lengthening along the field. A diamagnetic rod, in a strong field, aligns perpendicular to it.`),
  mcq(2, 'superconductors', r`The susceptibility of a superconductor below its critical temperature is`, r`$-1$`, [r`$0$`, r`$+1$`, r`very large and positive`],
    r`A superconductor expels the field completely (Meissner effect): $B = 0$ inside, so $\mu_r = 1+\chi = 0$ and $\chi = -1$. It is a perfect diamagnet.`),
  mcq(2, 'stable equilibrium', r`A small magnet is free to turn in a uniform field $\vec B$. Its position of stable equilibrium is the one in which the angle between $\vec M$ and $\vec B$ is`, r`$0^\circ$`, [r`$90^\circ$`, r`$180^\circ$`, r`$45^\circ$`],
    r`$U = -MB\cos\theta$ is least at $\theta = 0$ (stable). At $180^\circ$ the torque is also zero but $U$ is a maximum, so any small turn grows (unstable).`),
  nat(2, 'solenoid equivalent', r`A bar magnet is equivalent to a solenoid of 400 turns and radius 1.5 cm carrying 1.2 A. Find its magnetic moment (in $\mathrm{A\,m^2}$, 2 decimals).`, 400 * 1.2 * Math.PI * 0.015 ** 2, 0.01, 2,
    r`$M = NIA = 400\times1.2\times\pi(0.015)^2 = 480\times7.07\times10^{-4} = 0.34\ \mathrm{A\,m^2}$.`, { unit: 'A m^2' }),
  // ---------- Level 3 ----------
  nat(3, 'oscillation of a magnet', r`A bar magnet of moment $2\ \mathrm{A\,m^2}$ and moment of inertia $5\times10^{-4}\ \mathrm{kg\,m^2}$ oscillates in a horizontal field of 0.25 T with small amplitude. Find its time period (in s, 3 decimals).`, 2 * Math.PI * Math.sqrt(5e-4 / (2 * 0.25)), 0.003, 3,
    r`Small oscillations are SHM with $T = 2\pi\sqrt{\dfrac{I}{MB}} = 2\pi\sqrt{\dfrac{5\times10^{-4}}{2\times0.25}} = 2\pi\sqrt{10^{-3}} = 0.199$ s.`, { unit: 's' }),
  mcq(3, 'oscillation of a magnet', r`The time period of a magnet in a uniform field is $T$. If the field is made four times as strong, the period becomes`, r`$T/2$`, [r`$T/4$`, r`$2T$`, r`$4T$`],
    r`$T = 2\pi\sqrt{I/MB}\propto B^{-1/2}$. With $B\to4B$, $T\to T/2$.`),
  mcq(3, 'combination of magnets', r`Two identical magnets of moment $M$ and moment of inertia $I$ each are fixed together with their like poles side by side (parallel moments), and oscillate in a field $B$. Compared with one magnet alone, the time period is`, 'the same', ['half', r`double`, r`$\sqrt2$ times larger`],
    r`Together: moment $2M$ and inertia $2I$. $T' = 2\pi\sqrt{2I/(2MB)} = 2\pi\sqrt{I/MB}$, unchanged.`, { trap: 'Both M and I double, so they cancel.' }),
  nat(3, 'neutral point', r`A short magnet of moment $0.8\ \mathrm{A\,m^2}$ lies with its axis along the magnetic meridian and its N pole pointing north. The horizontal Earth field is $4\times10^{-5}$ T. Find the distance of the neutral points from the magnet's centre (in cm, nearest integer).`, 100 * Math.cbrt(K * 0.8 / 4e-5), 1, 0,
    r`With the N pole pointing north the magnet's field on its equatorial line points south and cancels the Earth's northward field. $\dfrac{\mu_0}{4\pi}\dfrac{M}{r^3} = B_h\Rightarrow r^3 = \dfrac{10^{-7}\times0.8}{4\times10^{-5}} = 2\times10^{-3}$, so $r = 0.126$ m $\approx 13$ cm.`, { unit: 'cm', trap: 'Neutral points lie on the equatorial line when the N pole points north, and on the axis when it points south.' }),
  mcq(3, 'neutral point', r`A bar magnet is placed on a table with its N pole pointing towards the geographic south. The neutral points (where the net horizontal field is zero) lie`, 'on the axial line of the magnet', ['on the equatorial line of the magnet', 'only at the poles of the magnet', 'nowhere'],
    r`Earth's horizontal field points north. On the axis the magnet's field is along $\vec M$, which points from its S pole to its N pole, i.e. towards the south. So the two can cancel on the axial line. (With N pointing north the cancellation is on the equatorial line.)`),
  nat(3, "Earth's magnetism", r`At a place the Earth's total field is 50 $\mu$T and the dip is $37^\circ$ ($\sin37^\circ = 0.6$). Find the vertical component (in $\mu$T).`, 50 * 0.6, 0.5, 0,
    r`$B_v = B_e\sin\delta = 50\times0.6 = 30\ \mu$T. (And $B_h = 50\times0.8 = 40\ \mu$T.)`, { unit: 'µT' }),
  mcq(3, 'orbital moment', r`An electron moves in a circular orbit with orbital angular momentum $L$. Its magnetic moment is`, r`$\dfrac{e}{2m}L$ and opposite to $\vec L$`, [r`$\dfrac{e}{m}L$ and along $\vec L$`, r`$\dfrac{e}{2m}L$ and along $\vec L$`, r`$\dfrac{2e}{m}L$ and opposite to $\vec L$`],
    r`$M = IA = \dfrac{e}{T}\pi r^2 = \dfrac{e\omega r^2}{2} = \dfrac{e}{2m}(m\omega r^2) = \dfrac{e}{2m}L$. The electron is negative, so the current is opposite to the motion and $\vec M$ is opposite to $\vec L$.`),
  nat(3, 'Bohr magneton', r`Using the Bohr model, the orbital angular momentum of an electron in the first orbit is $\hbar = 1.055\times10^{-34}$ J s. Find its magnetic moment (in units of $10^{-24}\ \mathrm{A\,m^2}$, 2 decimals). Take $e = 1.6\times10^{-19}$ C, $m = 9.1\times10^{-31}$ kg.`, 1.6e-19 * 1.055e-34 / (2 * 9.1e-31) * 1e24, 0.05, 2,
    r`$\mu = \dfrac{e\hbar}{2m} = \dfrac{1.6\times10^{-19}\times1.055\times10^{-34}}{2\times9.1\times10^{-31}} = 9.27\times10^{-24}\ \mathrm{A\,m^2}$. This is the Bohr magneton.`, { unit: '1e-24 A m^2' }),
  nat(3, 'hysteresis loss', r`The $B$-$H$ loop of a transformer core encloses an energy of $120\ \mathrm{J\,m^{-3}}$ per cycle. The core has a volume of $2\times10^{-3}\ \mathrm{m^3}$ and the supply is 50 Hz. Find the power lost as heat (in W).`, 120 * 2e-3 * 50, 0.05, 1,
    r`Energy per cycle $= 120\times2\times10^{-3} = 0.24$ J. Cycles per second $= 50$. Power $= 0.24\times50 = 12$ W.`, { unit: 'W' }),
  nat(3, 'Curie law', r`A paramagnetic sample has magnetisation $0.6\ \mathrm{A\,m^{-1}}$ in a field of 0.2 T at 300 K. If the field is 0.5 T and the temperature 250 K (far from saturation), find the new magnetisation (in $\mathrm{A\,m^{-1}}$, 2 decimals).`, 0.6 * (0.5 / 0.2) * (300 / 250), 0.01, 2,
    r`Curie's law: $M = C\dfrac{B}{T}$. $M_2 = 0.6\times\dfrac{0.5}{0.2}\times\dfrac{300}{250} = 0.6\times2.5\times1.2 = 1.80\ \mathrm{A\,m^{-1}}$.`, { unit: 'A/m', trap: 'M is proportional to B and inversely proportional to T. The law fails near saturation (low T, strong B).' }),
  mcq(3, 'bar magnet bent', r`A thin magnet of pole strength $m$ and length $L$ is bent into a semicircle. Its new magnetic moment (pole strength times the distance between the poles) is`, r`$\dfrac{2}{\pi}mL$`, [r`$mL$`, r`$\dfrac{\pi}{2}mL$`, r`$\dfrac{1}{2}mL$`],
    r`Arc length $L = \pi R$, so $R = L/\pi$. The poles now sit at the ends of a diameter, a distance $2R = 2L/\pi$ apart. $M' = m\times\dfrac{2L}{\pi} = \dfrac{2}{\pi}M$.`),
  mcq(3, 'bar magnet cut', r`A magnet of moment $M$ and length $L$ is cut along its length into two identical thin magnets. The moment of each piece is`, r`$M/2$`, [r`$M$`, r`$M/4$`, r`$2M$`],
    r`The pole strength is (area $\times$ intensity of magnetisation), so halving the cross-section halves $m$ while $L$ is unchanged. $M' = (m/2)L = M/2$.`),
  nat(3, 'magnetic dipole in a field', r`A magnet of moment $0.6\ \mathrm{A\,m^2}$ is held at $30^\circ$ to a 0.4 T field. Find the torque on it (in N m, 2 decimals).`, 0.6 * 0.4 * 0.5, 0.005, 2,
    r`$\tau = MB\sin30^\circ = 0.6\times0.4\times0.5 = 0.12$ N m, trying to bring the magnet into line with the field.`, { unit: 'N m' }),
  nat(3, 'solenoid with core', r`A long solenoid has 500 turns per metre and carries 0.4 A. It is filled with a material of relative permeability 900. Find the magnetic field inside (in mT, 1 decimal). Use $\mu_0 = 4\pi\times10^{-7}$ SI.`, 4 * Math.PI * 1e-7 * 900 * 500 * 0.4 * 1e3, 0.2, 1,
    r`$B = \mu_0\mu_rnI = 4\pi\times10^{-7}\times900\times500\times0.4 = 0.226$ T $= 226$ mT.`, { unit: 'mT' }),
  mcq(3, 'susceptibility and percentage change', r`A paramagnetic substance of susceptibility $\chi = 2\times10^{-5}$ fills a solenoid. The field inside, compared with the empty solenoid, is`, r`larger by 0.002 %`, [r`larger by 2 %`, r`smaller by 0.002 %`, r`unchanged exactly`],
    r`$B = \mu_0(1+\chi)nI$, so $B/B_0 = 1+\chi = 1.00002$: an increase of $2\times10^{-5}$ i.e. $0.002\ \%$. For a diamagnet it would be a decrease of the same kind.`),
  mcq(3, 'domains', r`When a ferromagnetic rod is heated above its Curie temperature, its susceptibility $\chi$ follows (Curie-Weiss law, $T_c$ = Curie temperature)`, r`$\chi = \dfrac{C}{T-T_c}$`, [r`$\chi = \dfrac{C}{T}$`, r`$\chi = C(T-T_c)$`, r`$\chi = CT$`],
    r`Just above $T_c$ the material is paramagnetic, but with a correction for the interaction between neighbouring moments: $\chi = C/(T-T_c)$. A pure paramagnet has $\chi = C/T$ (Curie's law).`),
  mcq(3, 'dia/para/ferro', r`Which of the following pairs is correctly matched?`, 'Copper: diamagnetic; aluminium: paramagnetic', ['Copper: paramagnetic; aluminium: diamagnetic', 'Bismuth: ferromagnetic; nickel: paramagnetic', 'Oxygen (liquid): diamagnetic; nitrogen: paramagnetic'],
    r`Cu, Bi, Au, Ag, water, NaCl, nitrogen are diamagnetic. Al, Na, Ca, platinum, liquid oxygen are paramagnetic. Fe, Co, Ni and gadolinium are ferromagnetic.`),
  // ---------- Level 4 ----------
  nat(4, 'combination of magnets', r`Two identical magnets, each of moment of inertia $I$ and moment $M$, are placed with their axes perpendicular and joined at their centres (a cross). The combination oscillates in a horizontal field. Find $T_{cross}/T_{single}$ (3 decimals).`, Math.pow(2, 0.25), 0.003, 3,
    r`Net moment $=\sqrt{M^2+M^2} = \sqrt2M$. Moment of inertia (about the same axis through the centre, perpendicular to the plane) $= I+I = 2I$. $\dfrac{T'}{T} = \sqrt{\dfrac{2I/(\sqrt2MB)}{I/(MB)}} = \sqrt{\sqrt2} = 2^{1/4} = 1.189$.`, { trap: 'The moments add as vectors, but the moments of inertia add as numbers.' }),
  nat(4, 'combination of magnets', r`Two magnets are fixed together at their centres with parallel axes. In one arrangement their moments are in the same direction, giving a period of 3 s in a field; reversing one magnet (opposite moments) gives 4 s. If the magnets have equal inertia, find $M_1/M_2$ for the stronger over the weaker (2 decimals).`, (4 * 4 + 3 * 3) / (4 * 4 - 3 * 3), 0.01, 2,
    r`$T = 2\pi\sqrt{I'/(M_{net}B)}$, same $I'$, so $T^2\propto1/M_{net}$. Sum: $T_s=3$; difference: $T_d = 4$. $\dfrac{M_1+M_2}{M_1-M_2} = \dfrac{T_d^2}{T_s^2} = \dfrac{16}{9}$. Cross-multiplying: $9M_1+9M_2 = 16M_1-16M_2$, so $25M_2 = 7M_1$ and $M_1/M_2 = 25/7 = 3.57$.`, { trap: 'The period is longer when the net moment is smaller, so the 4 s arrangement is the difference.' }),
  nat(4, "Earth's magnetism", r`At a place the horizontal component is 0.3 G and the total field is 0.6 G. A magnet oscillating in the vertical plane (a dip circle) there has period $T_v$ and in the horizontal plane $T_h$. Find $T_v/T_h$ (3 decimals).`, Math.sqrt(0.3 / 0.6), 0.003, 3,
    r`A horizontal-plane oscillation feels only $B_h$; a vertical-plane oscillation (in the meridian plane) feels the full $B_e$. $T\propto B^{-1/2}$, so $\dfrac{T_v}{T_h} = \sqrt{\dfrac{B_h}{B_e}} = \sqrt{0.5} = 0.707$.`, { unit: '' }),
  nat(4, 'tangent law', r`A short magnet placed east-west at 20 cm east of a compass needle, with its axis pointing along the east-west line (end-on position), deflects the needle by $45^\circ$. The Earth's horizontal field is $3.5\times10^{-5}$ T. Find the magnet's moment (in $\mathrm{A\,m^2}$, 2 decimals).`, 3.5e-5 * Math.tan(Math.PI / 4) * 0.2 ** 3 / (2 * K), 0.02, 2,
    r`End-on, the magnet's field at the needle is axial: $B = \dfrac{\mu_0}{4\pi}\dfrac{2M}{r^3}$. It is at right angles to $B_h$, so $\tan\theta = B/B_h$. $B = B_h\tan45^\circ = 3.5\times10^{-5}$ T. $M = \dfrac{Br^3}{2\times10^{-7}} = \dfrac{3.5\times10^{-5}\times0.008}{2\times10^{-7}} = 1.40\ \mathrm{A\,m^2}$.`, { unit: 'A m^2' }),
  nat(4, 'apparent dip', r`A dip circle is set in a vertical plane making $60^\circ$ with the magnetic meridian. It reads an apparent dip of $45^\circ$. Find the true dip, $\tan\delta$ (2 decimals). Use $\tan\delta' = \tan\delta/\cos\alpha$ where $\alpha$ is the angle of the plane with the meridian.`, Math.tan(Math.PI / 4) * Math.cos(Math.PI / 3), 0.005, 2,
    r`In a plane at angle $\alpha$ to the meridian only the component $B_h\cos\alpha$ of the horizontal field lies in the plane, while $B_v$ is unchanged. So $\tan\delta' = \dfrac{B_v}{B_h\cos\alpha}= \dfrac{\tan\delta}{\cos\alpha}$. $\tan\delta = \tan45^\circ\times\cos60^\circ = 0.50$ (true dip $\approx26.6^\circ$, less than the apparent dip).`),
  nat(4, 'saturation magnetisation', r`Iron has density $7870\ \mathrm{kg\,m^{-3}}$, molar mass 55.85 g, and each atom has a moment of $2.2\ \mu_B$ with $\mu_B = 9.27\times10^{-24}\ \mathrm{A\,m^2}$. If all moments are aligned, find the saturation magnetisation (in $10^6\ \mathrm{A\,m^{-1}}$, 2 decimals). $N_A = 6.02\times10^{23}$.`, 7870 / 0.05585 * 6.02e23 * 2.2 * 9.27e-24 / 1e6, 0.02, 2,
    r`Atoms per m$^3$: $n = \dfrac{\rho N_A}{M_{mol}} = \dfrac{7870\times6.02\times10^{23}}{0.05585} = 8.48\times10^{28}$. $M_s = n\mu = 8.48\times10^{28}\times2.2\times9.27\times10^{-24} = 1.73\times10^6\ \mathrm{A\,m^{-1}}$.`, { unit: '1e6 A/m' }),
  mcq(4, 'tangent law', r`In the end-on (tan A) position a short magnet of moment $M$ is at distance $r$ from a compass needle and causes a deflection $\theta$. In the broadside (tan B) position at the same distance the deflection is $\theta'$. Then $\tan\theta/\tan\theta'$ is`, '2', ['1', '1/2', '$\\sqrt2$'],
    r`The field at the end-on point is twice that at the broadside point for the same $r$. Both are perpendicular to $B_h$, so $\tan\theta = B/B_h$ and the ratio is 2.`),
  mcq(4, 'Curie temperature', r`The graph of $1/\chi$ against absolute temperature $T$ for a paramagnetic substance following Curie's law is`, 'a straight line through the origin', ['a straight line with a negative slope', 'a rectangular hyperbola', 'a straight line parallel to the T axis'],
    r`$\chi = C/T\Rightarrow1/\chi = T/C$, a straight line through the origin with slope $1/C$. The graph of $\chi$ against $T$ is the hyperbola.`),
  mcq(4, 'magnetic potential energy', r`A magnet of moment $M$ in a field $B$ is turned from $\theta = 0$ to $\theta = 180^\circ$ (its first position stable). Which of the following is true?`, r`The work done by the external agent is $2MB$`, [r`The work done by the external agent is $MB$`, r`The torque of the field is greatest at the end positions`, r`The potential energy changes from $-MB$ to zero`],
    r`$U(0) = -MB$ and $U(180^\circ) = +MB$, so the work done by us is $2MB$. The torque $MB\sin\theta$ is zero at both ends and greatest at $90^\circ$.`),
  mcq(4, 'force on a magnet', r`A small paramagnetic sphere hangs near the pole of a strong bar magnet. The force on it is`, 'attractive, because the sphere is pulled towards the stronger field', ['repulsive, because the induced pole is like the nearer pole', 'zero, because the sphere is neutral', 'attractive only if the sphere is ferromagnetic'],
    r`The sphere acquires a small moment along $\vec B$ so $U = -\vec M\cdot\vec B$ is lower where $B$ is larger; it is drawn into the stronger field. A diamagnetic sphere (moment opposite to $\vec B$) would be pushed away.`),
  mcq(4, 'hysteresis', r`In the hysteresis loop of a ferromagnet, the value of the reverse field $H$ needed to make $B$ zero (starting from the saturated state) is called`, 'coercivity', ['retentivity', 'saturation field', 'permeability'],
    r`Retentivity is the $B$ left when $H = 0$ (intercept on the $B$ axis); coercivity is the reverse $H$ needed to reduce $B$ to zero (intercept on the $H$ axis).`),
  mcq(4, 'internal field', r`Inside a long uniformly magnetised rod (magnetisation $M$ along its axis), the relations between $B$, $H$ and $M$ are $B = \mu_0(H+M)$. If no current flows in the rod's winding, then in the middle of a very long rod $H$ is approximately`, r`zero, with $B = \mu_0M$`, [r`$M$, with $B = 2\mu_0M$`, r`$-M$, with $B = 0$`, r`$\mu_0M$, with $B = 0$`],
    r`$H$ is produced by free currents (none here) and the demagnetising effect of the poles, which is tiny at the middle of a long rod. So $H\approx0$ and $B\approx\mu_0M$.`),
  nat(4, 'oscillation and field', r`A magnet oscillates 20 times in 10 s in the Earth's horizontal field of $B_h = 0.32$ G. A second field is added parallel to $B_h$ and the magnet now oscillates 20 times in 8 s. Find the added field (in G, 2 decimals).`, 0.32 * ((10 / 8) ** 2 - 1), 0.01, 2,
    r`$T\propto(B)^{-1/2}$, so $B\propto1/T^2$. $\dfrac{B_h+B'}{B_h} = \dfrac{T_1^2}{T_2^2} = \dfrac{(0.5)^2}{(0.4)^2} = 1.5625$. $B' = 0.5625\times0.32 = 0.18$ G.`, { unit: 'G' }),
  nat(4, 'gyromagnetic ratio', r`The ratio of magnetic moment to angular momentum for an orbiting electron is $e/2m$. Find it (in $10^{10}\ \mathrm{C\,kg^{-1}}$, 2 decimals). $e = 1.6\times10^{-19}$ C, $m = 9.1\times10^{-31}$ kg.`, 1.6e-19 / (2 * 9.1e-31) / 1e10, 0.02, 2,
    r`$\dfrac{e}{2m} = \dfrac{1.6\times10^{-19}}{2\times9.1\times10^{-31}} = 8.79\times10^{10}\ \mathrm{C\,kg^{-1}}$, which is 8.79 in the units asked.`, { unit: '1e10 C/kg' }),
  // ---------- Level 5 ----------
  nat(5, 'torque and SHM', r`A magnet of moment $M$ and moment of inertia $I$ is displaced by a large angle $\theta_0 = 90^\circ$ from a field $B$ and released. Using energy conservation, find its angular speed as it passes the equilibrium position, in units of $\sqrt{MB/I}$ (3 decimals).`, Math.sqrt(2), 0.003, 3,
    r`Energy: $-MB\cos\theta_0 = -MB + \tfrac12I\omega^2$ (at $\theta = 0$). With $\theta_0 = 90^\circ$: $0 = -MB+\tfrac12I\omega^2\Rightarrow\omega = \sqrt{2MB/I} = \sqrt2\sqrt{MB/I}=1.414\sqrt{MB/I}$.`),
  nat(5, 'dipole field', r`Two short magnets, each of moment $1.0\ \mathrm{A\,m^2}$, are at the same point with their moments at $90^\circ$ to each other. At a point 0.5 m from them on the line bisecting the two axes (axes at $45^\circ$ to this line), find the magnitude of the magnetic field (in $\mu$T, 2 decimals). Treat as a single dipole of the vector-summed moment, with the point on the axis of the resultant.`, K * 2 * Math.SQRT2 / 0.125 * 1e6, 0.1, 2,
    r`The resultant moment is $\sqrt{1^2+1^2} = \sqrt2\ \mathrm{A\,m^2}$, along the bisector. The point lies on that axis: $B = 10^{-7}\times\dfrac{2\sqrt2}{0.5^3} = 10^{-7}\times22.63 = 2.26\times10^{-6}$ T $= 2.26\ \mu$T.`, { unit: 'µT' }),
  msq(5, 'magnetic materials', r`Which of the following statements are correct?`, [
    r`The magnetic susceptibility of a diamagnetic substance is almost independent of temperature.`,
    r`The susceptibility of a paramagnetic substance is inversely proportional to the absolute temperature.`,
    r`A ferromagnetic substance changes to a paramagnetic one above its Curie temperature.`,
    r`The permeability of a diamagnetic substance is greater than that of vacuum.`], [0, 1, 2],
    r`(A) True: diamagnetism is a property of every atom's orbital response, not thermal alignment. (B) Curie's law. (C) True. (D) False: $\mu_r = 1+\chi<1$ for $\chi<0$.`),
  msq(5, 'Earth magnetism', r`At a place in the northern hemisphere the dip is $\delta$ and the horizontal component is $B_h$. Which of the following are correct?`, [
    r`The total field is $B_h\sec\delta$.`,
    r`The vertical component is $B_h\tan\delta$.`,
    r`A freely suspended magnet at the magnetic equator is horizontal.`,
    r`At the magnetic poles the horizontal component is largest.`], [0, 1, 2],
    r`$B_e = B_h/\cos\delta$ and $B_v = B_h\tan\delta$ are standard. At the equator $\delta = 0$. At the poles the field is vertical, so $B_h = 0$.`),
  msq(5, 'hysteresis', r`A ferromagnetic material is taken through a complete magnetising cycle. Which of the following statements are correct?`, [
    r`The energy lost per cycle per unit volume equals the area of the $B$-$H$ loop.`,
    r`Soft iron has a narrower loop than steel.`,
    r`At $H = 0$ the field in the material is zero.`,
    r`The magnetisation $M$ depends on the history of the sample.`], [0, 1, 3],
    r`(A) and (B) are standard. (C) is false: retentivity means $B\ne0$ at $H=0$. (D) is true: for ferromagnets $B$ is not a single-valued function of $H$.`),
  msq(5, 'dipole in a field', r`A magnet of moment $M$ is in a uniform field $B$ at an angle $\theta$ between $0$ and $180^\circ$. Which statements are correct?`, [
    r`The net force on it is zero.`,
    r`The torque is $MB\sin\theta$.`,
    r`The magnet's potential energy is $-MB\cos\theta$.`,
    r`The net force depends on $\theta$.`], [0, 1, 2],
    r`In a uniform field the forces on the two poles are equal and opposite, so the net force is zero, but they form a couple. Net force on a dipole needs a non-uniform field: $F = \nabla(\vec M\cdot\vec B)$.`),
  msq(5, 'dipole field', r`For a short bar magnet, which of the following hold?`, [
    r`The field on the axis at distance $r$ falls as $1/r^3$.`,
    r`The field on the equatorial line is half the field on the axial line at the same distance.`,
    r`At points on the equatorial line the field points opposite to $\vec M$.`,
    r`At points on the axial line far from the magnet the field is opposite to $\vec M$.`], [0, 1, 2],
    r`Axial field: $\dfrac{\mu_0}{4\pi}\dfrac{2M}{r^3}$ along $\vec M$. Equatorial: $\dfrac{\mu_0}{4\pi}\dfrac{M}{r^3}$ opposite to $\vec M$. So (D) is false.`),
  msq(5, 'orientation of rods', r`A small rod of material is placed between the pole pieces of a strong magnet and swings round and comes to rest with its length along the field lines. Which of the following could be the material?`, [
    r`Aluminium`, r`Soft iron`, r`Bismuth`, r`Liquid oxygen (in a glass tube)`], [0, 1, 3],
    r`A rod that lines up with the field has a positive susceptibility: aluminium and liquid oxygen (paramagnetic) and soft iron (ferromagnetic). Bismuth is diamagnetic and sets perpendicular to the field.`),
  asrt(2, 'diamagnetism', r`Every material shows diamagnetism, but it is observed only in materials that are not para- or ferromagnetic.`, r`Diamagnetism is much weaker than paramagnetism and ferromagnetism.`, 0,
    r`Both true; the second is the reason: when another effect is present it swamps the tiny negative susceptibility ($\sim10^{-5}$), so only in diamagnets is it observed.`),
  asrt(3, 'Curie temperature', r`A ferromagnet becomes paramagnetic above the Curie temperature.`, r`Thermal agitation destroys the alignment of domains above the Curie temperature.`, 0,
    r`Both true and R explains A: domains exist because neighbouring atomic moments are locked in parallel. Above $T_c$ thermal energy overcomes that coupling.`),
  asrt(3, 'dipole field', r`A magnet on its equatorial line produces a field half that at the same distance on its axis.`, r`The magnetic field of a dipole falls as $1/r^3$ in all directions.`, 1,
    r`Both are true but R does not explain the factor of 2. The 2 comes from the angular dependence of the dipole field ($2\cos\theta$ along the axis, $\sin\theta$ at the equator), not from the power of $r$.`),
  asrt(3, 'bar magnet', r`Cutting a bar magnet into two pieces gives an isolated N pole and an isolated S pole.`, r`Magnetic monopoles have not been found.`, 3,
    r`A is false: each piece is a complete magnet with both poles. R is true: no isolated monopole has ever been observed.`),
  asrt(2, 'permanent magnets', r`Soft iron is used in the cores of electromagnets.`, r`Soft iron has high permeability and low retentivity.`, 0,
    r`Both true and R explains A: the field switches on strongly with a small current and nearly vanishes when the current is off.`),
  asrt(3, "Earth's field", r`A freely suspended bar magnet at the Earth's magnetic pole stays vertical.`, r`At the poles the angle of dip is $90^\circ$.`, 0,
    r`A suspended magnet lines up with the total field. At a pole the total field is vertical ($\delta = 90^\circ$), so it hangs vertically. R explains A.`),
  asrt(4, 'susceptibility', r`For a paramagnetic material the magnetic susceptibility decreases when the temperature is increased.`, r`Magnetic moments of atoms in a paramagnet are all aligned by the field at any temperature.`, 2,
    r`A is true ($\chi = C/T$). R is false: thermal motion keeps the moments mostly random; only a small fraction aligns (full alignment is saturation).`),
  asrt(4, 'diamagnetic', r`A diamagnetic rod suspended in a very strong, non-uniform magnetic field tends to set itself perpendicular to the field.`, r`A diamagnetic material develops a magnetisation opposite to the field.`, 0,
    r`The rod is pushed from the strong-field region; being long, it takes the position in which it spans the weaker field, at right angles to the strong field. Both true, and R explains A.`),
  stm(2, 'susceptibility', r`The susceptibility of a diamagnetic material is negative.`, r`For diamagnetic materials $\mu_r<1$.`, 0,
    r`$\mu_r = 1+\chi$. If $\chi<0$ then $\mu_r<1$. Both true.`),
  stm(3, 'ferromagnets', r`A ferromagnetic substance can lose its magnetisation if it is hammered or heated.`, r`Hammering and heating disturb the alignment of its domains.`, 0,
    r`Both true. The ordered domains are scrambled by shocks and heat; this is why magnets are stored carefully.`),
  stm(3, 'Earth', r`The magnetic south pole of the Earth is close to the geographic north.`, r`The N pole of a compass needle points towards the geographic north.`, 0,
    r`The N pole of a magnet is attracted towards the geographic north, so a magnetic S pole lies there. Both statements are true.`),
  stm(3, 'magnetisation', r`The magnetic field inside a long solenoid increases when a soft iron rod is inserted.`, r`The magnetising field $H$ in the solenoid (for a given current) also increases when the iron rod is inserted.`, 2,
    r`$B = \mu_0\mu_rnI$ increases, so I is true. But $H = nI$ depends only on the winding current, so it is unchanged. II is false.`, { trap: 'B changes with the material; H does not.' }),
  stm(4, 'Curie law', r`A paramagnetic material obeys Curie's law at all temperatures and fields.`, r`Curie's law is valid for fields that are not too strong and temperatures that are not too low.`, 3,
    r`Statement I is false: near saturation, $M$ stops rising in proportion to $B/T$. Statement II states the correct conditions.`),
  stm(3, 'hysteresis', r`Hysteresis loss is greater in steel than in soft iron.`, r`The hysteresis loop of steel encloses a larger area.`, 0,
    r`Both true; the larger loop area (the energy lost per cycle) is the reason for the greater loss.`),
  stm(4, 'magnetic dipole', r`A magnetic needle in a non-uniform field experiences a net force as well as a torque.`, r`The forces on its two poles are equal in magnitude in a non-uniform field.`, 2,
    r`I is true (the two poles feel different fields, so there is a net force). II is false: the unequal forces are why there is a net force.`),
  cnt(3, 'dia-, para-, ferro-', r`Consider the following about magnetic materials. How many are correct?`, [
    r`A ferromagnet at its Curie temperature becomes a paramagnet.`,
    r`$\chi$ of a diamagnet is of order $10^{-5}$ in magnitude.`,
    r`The susceptibility of aluminium is positive.`,
    r`Magnetic permeability of a superconductor is 1.`], 3,
    r`(1), (2), (3) true. (4) is false: $\chi = -1$ so $\mu_r = 0$.`),
  cnt(4, 'magnetic materials', r`Consider the following statements about magnetic materials and fields. How many are correct?`, [
    r`Field lines of $\vec B$ are always closed loops.`,
    r`$\vec H$ field lines can start and end on poles.`,
    r`$\mu_r$ of iron changes with $H$.`,
    r`The area of a hysteresis loop is the work done per unit volume per cycle.`], 4,
    r`$\nabla\cdot\vec B=0$ so (1) true. In the pole model $\vec H$ lines begin on N poles and end on S poles (2). $\mu_r$ depends on $H$ for iron (3). The loop area is the energy loss per volume per cycle (4). All four are correct.`),
  mat(2, 'dia-, para-, ferro-', 'm1', r`Match the type of material (List I) with its susceptibility behaviour (List II).`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    r`Diamagnets: small negative $\chi$; paramagnets: small positive; ferromagnets: large positive and non-linear; superconductor: exactly $-1$.`,
    {}),
  mat(2, 'units', 'm2', r`Match each quantity with its SI unit.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-r, C-q, D-s', 'A-p, B-q, C-s, D-r'],
    r`Moment: A m$^2$; magnetisation: A m$^{-1}$; permeability $\mu$: T m A$^{-1}$; flux density $B$: T.`),
  mat(3, "Earth's magnetism", 'm3', r`Match each term for the Earth's field with its meaning.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-s, C-p, D-q'],
    r`Declination is the angle between the geographic and the magnetic meridians. Dip is the angle of the total field with the horizontal. $B_h = B_e\cos\delta$ and $B_e = \sqrt{B_h^2+B_v^2}$.`),
  mat(3, 'hysteresis', 'm4', r`Match each item with its description.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-q, B-p, C-s, D-r'],
    r`Retentivity is $B$ at $H=0$; coercivity is the reverse $H$ for $B=0$; soft iron has a narrow loop; steel and alnico have wide loops.`),
  pas(3, 'neutral point', 'p1', r`Find the distance of each neutral point from the centre of the magnet (in cm, nearest integer).`, 100 * Math.cbrt(K * 1.6 / 3.2e-5), 1, 0,
    r`Equatorial line (N pole north): $\dfrac{\mu_0}{4\pi}\dfrac{M}{r^3} = B_h\Rightarrow r^3 = \dfrac{10^{-7}\times1.6}{3.2\times10^{-5}} = 5\times10^{-3}$, $r = 0.171$ m $\approx 17$ cm.`, { unit: 'cm' }),
  pasm(3, 'neutral point', 'p1', r`If the magnet were turned round so that its N pole points south, where would the neutral points be, and at what distance?`, r`On the axis, at 21.5 cm from the centre`, [r`On the equatorial line, at 17.1 cm`, r`On the axis, at 17.1 cm`, r`On the equatorial line, at 21.5 cm`],
    r`Now the axial field is directed south and opposes the Earth's northward $B_h$. $\dfrac{\mu_0}{4\pi}\dfrac{2M}{r^3} = B_h\Rightarrow r^3 = 2\times5\times10^{-3} = 10^{-2}$, $r = 0.2154$ m: the axial neutral points are $2^{1/3} = 1.26$ times farther.`),
  pas(4, 'torque', 'p1', r`The magnet (moment $1.6\ \mathrm{A\,m^2}$) is now placed in a horizontal plane with its axis at $30^\circ$ to the meridian, far from any other magnet, in the same Earth's field $3.2\times10^{-5}$ T. Find the torque on it (in $10^{-5}$ N m, 1 decimal).`, 1.6 * 3.2 * 0.5, 0.05, 1,
    r`$\tau = MB_h\sin30^\circ = 1.6\times3.2\times10^{-5}\times0.5 = 2.56\times10^{-5}$ N m, i.e. 2.6 in the units asked.`, { unit: '1e-5 N m' }),
  pas(3, 'solenoid with core', 'p2', r`Find the magnetic field inside the core (in T, 2 decimals). Use $\mu_0 = 4\pi\times10^{-7}$.`, 4 * Math.PI * 1e-7 * 800 * 500, 0.005, 2,
    r`$B = \mu_0\mu_rnI = 4\pi\times10^{-7}\times800\times1000\times0.5 = 0.50$ T.`, { unit: 'T' }),
  pas(4, 'magnetisation', 'p2', r`Find the magnetisation of the core (in $10^5\ \mathrm{A\,m^{-1}}$, 2 decimals).`, 799 * 500 / 1e5, 0.01, 2,
    r`$H = nI = 1000\times0.5 = 500\ \mathrm{A\,m^{-1}}$. $M = \chi H = (\mu_r-1)H = 799\times500 = 3.995\times10^5\ \mathrm{A\,m^{-1}}$.`, { unit: '1e5 A/m' }),
  pasm(4, 'solenoid with core', 'p2', r`The current is now doubled. Which statement is correct if the core does not saturate?`, r`$H$ and $B$ both double`, [r`$H$ doubles but $B$ stays the same`, r`$B$ doubles but $H$ stays the same`, r`Neither changes`],
    r`$H = nI$ doubles, and $B = \mu_0\mu_rH$ doubles if $\mu_r$ is constant (no saturation).`),
  pas(3, 'hysteresis loss', 'p3', r`Find the energy dissipated per unit volume in one cycle (in $\mathrm{J\,m^{-3}}$).`, 12 * 100 * 0.2, 0.5, 0,
    r`Each cm$^2$ of the plot represents $100\ \mathrm{A\,m^{-1}}\times0.2\ \mathrm{T} = 20\ \mathrm{J\,m^{-3}}$. Area $= 12\ \mathrm{cm^2}$, so energy $= 12\times20 = 240\ \mathrm{J\,m^{-3}}$.`, { unit: 'J/m^3' }),
  pas(3, 'hysteresis loss', 'p3', r`If the core has volume $2.5\times10^{-3}\ \mathrm{m^3}$ and the current has frequency 50 Hz, find the power lost (in W).`, 240 * 2.5e-3 * 50, 0.2, 1,
    r`Energy per cycle $= 240\times2.5\times10^{-3} = 0.6$ J. Power $= 0.6\times50 = 30$ W.`, { unit: 'W' }),
  pas(4, 'hysteresis loss', 'p3', r`By how many degrees would the core (mass 20 kg, specific heat $450\ \mathrm{J\,kg^{-1}K^{-1}}$) warm up in 10 minutes if all the loss stays as heat (1 decimal)?`, 30 * 600 / (20 * 450), 0.05, 1,
    r`Heat $= 30\times600 = 18000$ J. $\Delta T = \dfrac{Q}{mc} = \dfrac{18000}{20\times450} = 2.0\ ^\circ$C.`, { unit: '°C' }),
];
const groups = {
  m1: { title: 'Types of magnetic material',
    list1: ['A. Diamagnetic', 'B. Paramagnetic', 'C. Ferromagnetic', 'D. Superconductor'],
    list2: [r`p. $\chi$ small and negative`, r`q. $\chi$ small and positive`, r`r. $\chi$ large, positive and depends on $H$`, r`s. $\chi = -1$`] },
  m2: { title: 'Quantities and units',
    list1: ['A. Magnetic moment', 'B. Magnetisation', 'C. Permeability $\\mu$', 'D. Magnetic flux density'],
    list2: [r`p. $\mathrm{A\,m^2}$`, r`q. $\mathrm{A\,m^{-1}}$`, r`r. $\mathrm{T\,m\,A^{-1}}$`, r`s. $\mathrm{T}$`] },
  m3: { title: "Earth's magnetic field",
    list1: ['A. Declination', 'B. Angle of dip', 'C. Horizontal component', 'D. Total field'],
    list2: ['p. Angle between the magnetic and geographic meridians', 'q. Angle of the total field with the horizontal', r`r. $B_e\cos\delta$`, r`s. $\sqrt{B_h^2+B_v^2}$`] },
  m4: { title: 'Hysteresis',
    list1: ['A. Retentivity', 'B. Coercivity', 'C. Soft iron', 'D. Steel or alnico'],
    list2: [r`p. $B$ left when $H = 0$`, r`q. Reverse $H$ needed to make $B = 0$`, 'r. Narrow loop, small loss', 's. Wide loop, keeps its magnetism'] },
  p1: { title: 'A magnet in the Earth\'s field',
    passage: r`<p>A short bar magnet of moment $1.6\ \mathrm{A\,m^2}$ is placed on a wooden table with its axis along the magnetic meridian and its N pole pointing towards the north. At the place the horizontal component of the Earth's field is $3.2\times10^{-5}$ T. Use $\mu_0/4\pi = 10^{-7}$ SI.</p>` },
  p2: { title: 'A solenoid with an iron core',
    passage: r`<p>A long solenoid has 1000 turns per metre and carries a current of 0.5 A. Its core is iron of relative permeability 800 (assume it does not saturate). Use $\mu_0 = 4\pi\times10^{-7}\ \mathrm{T\,m\,A^{-1}}$.</p>` },
  p3: { title: 'Energy loss in a core',
    passage: r`<p>The $B$-$H$ loop of a transformer core is drawn on graph paper on which 1 cm along $H$ represents $100\ \mathrm{A\,m^{-1}}$ and 1 cm along $B$ represents 0.2 T. The loop encloses an area of $12\ \mathrm{cm^2}$. The core has volume $2.5\times10^{-3}\ \mathrm{m^3}$ and is run at 50 Hz.</p>` },
};
const poleAx = (M, r) => { const l = r * 1e-3; const m = M / (2 * l); return K * m * (1 / ((r - l) ** 2) - 1 / ((r + l) ** 2)); };
const poleEq = (M, r) => { const l = r * 1e-3; const m = M / (2 * l); return K * m * 2 * l / Math.pow(r * r + l * l, 1.5); };
const bisect = (f, lo, hi) => { for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; } return (lo + hi) / 2; };
const D = Math.PI / 180;
const gens = [
  { id: 'mm-g01', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'dipole field',
    make(rng) {
      const M = choose(rng, [0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 4]); const r = choose(rng, [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]); const v = int(rng, 0, 2);
      const ax = K * 2 * M / r ** 3; const eq = K * M / r ** 3;
      if (v === 0) return { M, r, v, q: `A short bar magnet has a moment of ${M} $\\mathrm{A\\,m^2}$. Find the field it produces at a point on its axis ${S(r * 100)} cm from its centre (in $\\mu$T, 2 decimals).`, answer: N(ax * 1e6, 2), tol: 0.01 * ax * 1e6 + 0.01, unit: 'µT',
        sol: `On the axis $B = \\dfrac{\\mu_0}{4\\pi}\\dfrac{2M}{r^3} = 10^{-7}\\times\\dfrac{2\\times${M}}{(${r})^3} = ${tx(ax)}$ T $= ${S(ax * 1e6, 4)}\\ \\mu$T.`, trap: 'The axial formula has the factor 2; the equatorial one does not.' };
      if (v === 1) return { M, r, v, q: `A short bar magnet has a moment of ${M} $\\mathrm{A\\,m^2}$. Find the field at a point on its equatorial line ${S(r * 100)} cm from its centre (in $\\mu$T, 2 decimals).`, answer: N(eq * 1e6, 2), tol: 0.01 * eq * 1e6 + 0.01, unit: 'µT',
        sol: `On the equatorial line $B = \\dfrac{\\mu_0}{4\\pi}\\dfrac{M}{r^3} = 10^{-7}\\times\\dfrac{${M}}{(${r})^3} = ${tx(eq)}$ T $= ${S(eq * 1e6, 4)}\\ \\mu$T, directed opposite to the moment.` };
      const Bs = +(ax * 1e6).toPrecision(3);
      return { M, r, v, Bs, q: `A short magnet of moment ${M} $\\mathrm{A\\,m^2}$ produces a field of ${Bs} $\\mu$T at a point on its axis. How far from the centre is that point (in cm, 1 decimal)?`, answer: N(r * 100, 1), tol: 0.01 * r * 100 + 0.05, unit: 'cm',
        sol: `$B = 10^{-7}\\dfrac{2M}{r^3}\\Rightarrow r^3 = \\dfrac{2\\times10^{-7}\\times${M}}{${Bs}\\times10^{-6}} = ${tx(2e-7 * M / (Bs * 1e-6))}$, so $r = ${S(r, 3)}$ m $= ${S(r * 100, 3)}$ cm.` };
    },
    verify: (p) => { if (p.v === 0) return poleAx(p.M, p.r) * 1e6; if (p.v === 1) return poleEq(p.M, p.r) * 1e6; return bisect((x) => poleAx(p.M, x) - p.Bs * 1e-6, 0.01, 5) * 100; } },
  { id: 'mm-g02', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'torque and energy',
    make(rng) {
      const M = choose(rng, [0.2, 0.5, 1, 2]); const B = choose(rng, [0.1, 0.2, 0.4, 0.5]); const th = choose(rng, [30, 37, 45, 53, 60, 90, 120, 150]); const v = int(rng, 0, 2);
      const t1 = choose(rng, [0, 30, 60]); const t2 = choose(rng, [90, 120, 150, 180]);
      if (v === 0) { const t = M * B * Math.sin(th * D); return { M, B, th, v, q: `A magnet of moment ${M} $\\mathrm{A\\,m^2}$ makes $${th}^\\circ$ with a uniform field of ${B} T. Find the torque on it (in N m, 3 decimals).`, answer: N(t, 3), tol: 0.003, unit: 'N m', sol: `$\\tau = MB\\sin\\theta = ${M}\\times${B}\\times\\sin${th}^\\circ = ${S(t, 4)}$ N m.` }; }
      if (v === 1) { const u = -M * B * Math.cos(th * D); return { M, B, th, v, q: `A magnet of moment ${M} $\\mathrm{A\\,m^2}$ makes $${th}^\\circ$ with a uniform field of ${B} T. Find its potential energy $-\\vec M\\cdot\\vec B$ (in J, 3 decimals, with sign).`, answer: N(u, 3), tol: 0.003, unit: 'J', sol: `$U = -MB\\cos\\theta = -${M}\\times${B}\\times\\cos${th}^\\circ = ${S(u, 4)}$ J.`, trap: 'Keep the sign: U is negative for angles below 90 degrees.' }; }
      const w = M * B * (Math.cos(t1 * D) - Math.cos(t2 * D));
      return { M, B, t1, t2, v, q: `A magnet of moment ${M} $\\mathrm{A\\,m^2}$ is in a uniform field of ${B} T. How much work is done in turning it slowly from $${t1}^\\circ$ to $${t2}^\\circ$ with the field (in J, 3 decimals)?`, answer: N(w, 3), tol: 0.003, unit: 'J',
        sol: `$W = U_2 - U_1 = -MB\\cos${t2}^\\circ + MB\\cos${t1}^\\circ = ${M}\\times${B}\\times(${S(Math.cos(t1 * D), 4)} - (${S(Math.cos(t2 * D), 4)})) = ${S(w, 4)}$ J.` };
    },
    verify: (p) => {
      if (p.v === 0) { const Mv = [p.M, 0]; const Bv = [p.B * Math.cos(p.th * D), p.B * Math.sin(p.th * D)]; return Math.abs(Mv[0] * Bv[1] - Mv[1] * Bv[0]); }
      if (p.v === 1) return -(p.M * p.B * Math.cos(p.th * D));
      let w = 0; const n = 20000; const a = p.t1 * D; const b = p.t2 * D; for (let i = 0; i < n; i++) { const t = a + (i + 0.5) / n * (b - a); w += p.M * p.B * Math.sin(t) * (b - a) / n; } return w; } },
  { id: 'mm-g03', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'oscillation of a magnet',
    make(rng) {
      const I = choose(rng, [2e-5, 5e-5, 1e-4, 2e-4, 5e-4]); const M = choose(rng, [0.5, 1, 2, 4]); const B = choose(rng, [0.1, 0.2, 0.25, 0.5]); const v = int(rng, 0, 2);
      const T = 2 * Math.PI * Math.sqrt(I / (M * B));
      if (v === 0) return { I, M, B, v, q: `A magnet of moment ${M} $\\mathrm{A\\,m^2}$ and moment of inertia $${tx(I, 2)}\\ \\mathrm{kg\\,m^2}$ oscillates through a small angle in a field of ${B} T. Find its time period (in ms, 1 decimal).`, answer: N(T * 1e3, 1), tol: 0.01 * T * 1e3 + 0.05, unit: 'ms', sol: `$T = 2\\pi\\sqrt{\\dfrac{I}{MB}} = 2\\pi\\sqrt{\\dfrac{${tx(I, 2)}}{${M}\\times${B}}} = ${S(T, 4)}$ s $= ${S(T * 1e3, 4)}$ ms.` };
      if (v === 1) { const n = choose(rng, [10, 20, 30]); const t = n * T; return { I, M, n, t, v, q: `A magnet of moment ${M} $\\mathrm{A\\,m^2}$ and moment of inertia $${tx(I, 2)}\\ \\mathrm{kg\\,m^2}$ makes ${n} small oscillations in ${S(t, 4)} s. Find the field it is in (in mT, 1 decimal).`, answer: N(B * 1e3, 1), tol: 0.01 * B * 1e3 + 0.05, unit: 'mT', sol: `Period $T = ${S(t, 4)}/${n} = ${S(T, 4)}$ s. $B = \\dfrac{4\\pi^2I}{MT^2} = \\dfrac{4\\pi^2\\times${tx(I, 2)}}{${M}\\times(${S(T, 4)})^2} = ${S(B, 4)}$ T $= ${S(B * 1e3, 4)}$ mT.`, trap: 'T is the time for ONE oscillation; divide the total time by the number.' }; }
      const f = choose(rng, [2, 3, 4, 9, 16]); const T2 = T / Math.sqrt(f);
      return { I, M, B, f, v, q: `A magnet has a period of ${S(T * 1e3, 4)} ms in a field. The field is made ${f} times as strong. Find the new period (in ms, 1 decimal).`, answer: N(T2 * 1e3, 1), tol: 0.01 * T2 * 1e3 + 0.05, unit: 'ms', sol: `$T\\propto B^{-1/2}$. $T' = T/\\sqrt{${f}} = ${S(T * 1e3, 4)}/${S(Math.sqrt(f), 4)} = ${S(T2 * 1e3, 4)}$ ms.` };
    },
    verify: (p) => {
      const w0 = Math.sqrt(p.M * p.B / p.I);
      if (p.v === 0) { let th = 0.01, om = 0; const dt = (2 * Math.PI / w0) / 4000; let t = 0, prev = th; while (true) { om -= w0 * w0 * Math.sin(th) * dt; th += om * dt; t += dt; if (prev > 0 && th <= 0) { return (t * 4 - 0) * 1e3 * 1; } prev = th; if (t > 1) return 0; } }
      if (p.v === 1) { const T = p.t / p.n; return p.I * (2 * Math.PI / T) ** 2 / p.M * 1e3; }
      return 2 * Math.PI / (w0 * Math.sqrt(p.f)) * 1e3; } },
  { id: 'mm-g04', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: "Earth's magnetism",
    make(rng) {
      const Bh = choose(rng, [0.2, 0.3, 0.34, 0.4]); const dl = choose(rng, [30, 37, 53, 60]); const v = int(rng, 0, 3);
      const d = dl * D;
      if (v === 0) { const val = Bh / Math.cos(d); const o = numOpts(rng, val, [Bh * Math.cos(d), Bh / Math.sin(d), Bh * Math.tan(d)], 'G'); return { Bh, dl, v, val, ...o, q: `At a place the horizontal component of the Earth's field is ${Bh} G and the dip is $${dl}^\\circ$. The total field there is`, sol: `$B_h = B_e\\cos\\delta\\Rightarrow B_e = \\dfrac{${Bh}}{\\cos${dl}^\\circ} = ${S(val, 3)}$ G.`, trap: 'Bh is the cosine part of the total field, so the total is larger than Bh.' }; }
      if (v === 1) { const val = Bh * Math.tan(d); const o = numOpts(rng, val, [Bh / Math.tan(d), Bh * Math.sin(d), Bh * Math.cos(d)], 'G'); return { Bh, dl, v, val, ...o, q: `The horizontal component of the Earth's field is ${Bh} G and the dip is $${dl}^\\circ$. The vertical component is`, sol: `$\\tan\\delta = B_v/B_h\\Rightarrow B_v = ${Bh}\\tan${dl}^\\circ = ${S(val, 3)}$ G.` }; }
      if (v === 2) { const Be = choose(rng, [0.4, 0.5, 0.6]); const val = Be * Math.cos(d); const o = numOpts(rng, val, [Be * Math.sin(d), Be / Math.cos(d), Be * Math.tan(d)], 'G'); return { Bh, Be, dl, v, val, ...o, q: `The Earth's total field at a place is ${Be} G and the dip is $${dl}^\\circ$. The horizontal component is`, sol: `$B_h = B_e\\cos\\delta = ${Be}\\times\\cos${dl}^\\circ = ${S(val, 3)}$ G.` }; }
      const ratio = choose(rng, [0.4, 0.5, 0.6, 0.75, 0.8]); const val = Math.atan(ratio) / D; const o = numOpts(rng, val, [Math.atan(1 / ratio) / D, Math.asin(ratio) / D, Math.acos(ratio) / D], '°');
      return { Bh, ratio, v, val, ...o, q: `At a place the vertical component of the Earth's field is ${ratio} times its horizontal component. The angle of dip (nearest 0.1 degree, given to 3 significant figures) is`, sol: `$\\tan\\delta = B_v/B_h = ${ratio}$, so $\\delta = \\tan^{-1}${ratio} = ${S(val, 3)}^\\circ$.`, trap: 'Dip comes from the tangent (vertical over horizontal), not the sine or cosine.' };
    },
    verify: (p) => { if (p.v === 0) { const Bv = p.Bh * Math.tan(p.dl * D); return vo(p, Math.hypot(p.Bh, Bv), 'G'); } if (p.v === 1) return vo(p, Math.sqrt((p.Bh / Math.cos(p.dl * D)) ** 2 - p.Bh ** 2), 'G'); if (p.v === 2) return vo(p, Math.sqrt(p.Be ** 2 - (p.Be * Math.sin(p.dl * D)) ** 2), 'G'); return vo(p, Math.atan2(p.ratio, 1) / D, '°'); } },
  { id: 'mm-g05', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'neutral point',
    make(rng) {
      const M = choose(rng, [0.5, 0.8, 1, 1.5, 2, 2.4]); const Bh = choose(rng, [2, 3, 3.2, 3.5, 4]) * 1e-5; const v = int(rng, 0, 2);
      if (v === 0) { const r = Math.cbrt(K * M / Bh); return { M, Bh, v, q: `A short magnet of moment ${M} $\\mathrm{A\\,m^2}$ lies in the magnetic meridian with its N pole pointing north. The Earth's horizontal field is ${S(Bh * 1e5)}$\\times10^{-5}$ T. Find the distance of the neutral points from its centre (in cm, 1 decimal).`, answer: N(r * 100, 1), tol: 0.01 * r * 100 + 0.1, unit: 'cm', sol: `Neutral points lie on the equatorial line: $10^{-7}\\dfrac{M}{r^3} = B_h\\Rightarrow r^3 = \\dfrac{10^{-7}\\times${M}}{${tx(Bh)}} = ${tx(K * M / Bh)}$, $r = ${S(r, 3)}$ m $= ${S(r * 100, 3)}$ cm.` }; }
      if (v === 1) { const r = Math.cbrt(2 * K * M / Bh); return { M, Bh, v, q: `A short magnet of moment ${M} $\\mathrm{A\\,m^2}$ lies in the magnetic meridian with its N pole pointing south. The Earth's horizontal field is ${S(Bh * 1e5)}$\\times10^{-5}$ T. Find the distance of the neutral points from its centre (in cm, 1 decimal).`, answer: N(r * 100, 1), tol: 0.01 * r * 100 + 0.1, unit: 'cm', sol: `Now the neutral points are on the axis: $10^{-7}\\dfrac{2M}{r^3} = B_h\\Rightarrow r^3 = \\dfrac{2\\times10^{-7}\\times${M}}{${tx(Bh)}} = ${tx(2 * K * M / Bh)}$, $r = ${S(r, 3)}$ m $= ${S(r * 100, 3)}$ cm.` }; }
      const d = choose(rng, [10, 12, 15, 20, 25]); const Mx = Bh * (d / 100) ** 3 / K;
      return { Bh, d, v, q: `The neutral points of a short magnet lying with its N pole pointing north are on the equatorial line, ${d} cm from its centre. The Earth's horizontal field is ${S(Bh * 1e5)}$\\times10^{-5}$ T. Find the magnet's moment (in $\\mathrm{A\\,m^2}$, 3 decimals).`, answer: N(Mx, 3), tol: 0.01 * Mx + 0.002, unit: 'A m^2', sol: `$M = \\dfrac{B_hr^3}{10^{-7}} = \\dfrac{${tx(Bh)}\\times(${d / 100})^3}{10^{-7}} = ${S(Mx, 4)}\\ \\mathrm{A\\,m^2}$.` };
    },
    verify: (p) => { if (p.v === 0) return bisect((x) => poleEq(p.M, x) - p.Bh, 0.02, 3) * 100; if (p.v === 1) return bisect((x) => poleAx(p.M, x) - p.Bh, 0.02, 3) * 100; return p.Bh * (p.d / 100) ** 3 / (poleEq(1, p.d / 100) * (p.d / 100) ** 3); } },
  { id: 'mm-g06', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'solenoid equivalent',
    make(rng) {
      const Nt = choose(rng, [100, 200, 300, 500, 1000]); const I = choose(rng, [0.5, 1, 1.5, 2, 3]); const rc = choose(rng, [1, 1.5, 2, 2.5, 3]); const v = int(rng, 0, 2);
      const A = Math.PI * (rc / 100) ** 2; const M = Nt * I * A;
      if (v === 0) return { Nt, I, rc, v, q: `A bar magnet is modelled as a solenoid of ${Nt} turns and radius ${rc} cm carrying ${I} A. Find its magnetic moment (in $\\mathrm{A\\,m^2}$, 3 decimals).`, answer: N(M, 3), tol: 0.01 * M + 0.001, unit: 'A m^2', sol: `$M = NIA = ${Nt}\\times${I}\\times\\pi(${rc / 100})^2 = ${S(M, 4)}\\ \\mathrm{A\\,m^2}$.` };
      if (v === 1) return { Nt, I, rc, v, q: `A coil of ${Nt} turns and radius ${rc} cm has a magnetic moment of ${S(M, 4)} $\\mathrm{A\\,m^2}$. Find the current in it (in A, 2 decimals).`, answer: N(I, 2), tol: 0.01 * I + 0.005, unit: 'A', sol: `$I = \\dfrac{M}{NA} = \\dfrac{${S(M, 4)}}{${Nt}\\times\\pi(${rc / 100})^2} = ${S(I, 3)}$ A.` };
      return { Nt, I, rc, v, q: `A magnet equivalent to a solenoid carrying ${I} A of radius ${rc} cm has a moment of ${S(M, 4)} $\\mathrm{A\\,m^2}$. Find the number of turns (nearest integer).`, answer: Nt, tol: 0.01 * Nt + 1, unit: '', sol: `$N = \\dfrac{M}{IA} = \\dfrac{${S(M, 4)}}{${I}\\times\\pi(${rc / 100})^2} = ${S(M / (I * A), 4)}\\approx${Nt}$.` };
    },
    verify: (p) => { const d = 2 * p.rc / 100; const M = p.Nt * p.I * Math.PI * d * d / 4; if (p.v === 0) return M; if (p.v === 1) return M / (p.Nt * Math.PI * d * d / 4); return M / (p.I * Math.PI * d * d / 4); } },
  { id: 'mm-g07', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'B, H, M and susceptibility',
    make(rng) {
      const n = choose(rng, [200, 400, 500, 800, 1000]); const I = choose(rng, [0.2, 0.5, 1, 2]); const mur = choose(rng, [200, 400, 500, 800, 1500]); const v = int(rng, 0, 2);
      const MU0 = 4 * Math.PI * 1e-7; const H = n * I;
      if (v === 0) { const val = MU0 * mur * H * 1e3; const o = numOpts(rng, val, [MU0 * H * 1e3, mur * H * 1e-3, MU0 * mur * H * 1e3 / 2], 'mT'); return { n, I, mur, v, val, ...o, q: `A long solenoid of ${n} turns per metre carries ${I} A and is filled with iron of $\\mu_r = ${mur}$. The field inside is (take $\\mu_0 = 4\\pi\\times10^{-7}$)`, sol: `$H = nI = ${H}\\ \\mathrm{A\\,m^{-1}}$. $B = \\mu_0\\mu_rH = 4\\pi\\times10^{-7}\\times${mur}\\times${H} = ${S(val, 3)}$ mT.`, trap: 'Without the core the field would be mu_r times smaller.' }; }
      if (v === 1) { const val = (mur - 1) * H; const o = numOpts(rng, val, [mur * H, (mur + 1) * H, H / (mur - 1)], 'A/m', 4); return { n, I, mur, v, val, ...o, q: `The iron core of a solenoid ($\\mu_r = ${mur}$) is in a magnetising field $H = ${H}\\ \\mathrm{A\\,m^{-1}}$. Its magnetisation $M$ is`, sol: `$\\chi = \\mu_r - 1 = ${mur - 1}$, so $M = \\chi H = ${mur - 1}\\times${H} = ${S(val, 3)}\\ \\mathrm{A\\,m^{-1}}$.`, trap: 'Susceptibility is mu_r minus 1, not mu_r.' }; }
      const B = choose(rng, [0.5, 0.8, 1, 1.2]); const Hh = choose(rng, [200, 400, 500, 800]); const chi = B / (MU0 * Hh) - 1; const o = numOpts(rng, chi, [chi + 1, B / Hh, MU0 * B / Hh], '', 4);
      return { B, Hh, v, val: chi, ...o, q: `In a ferromagnetic core, $B = ${B}$ T when $H = ${Hh}\\ \\mathrm{A\\,m^{-1}}$. Its susceptibility is about`, sol: `$\\mu_r = \\dfrac{B}{\\mu_0H} = \\dfrac{${B}}{4\\pi\\times10^{-7}\\times${Hh}} = ${S(chi + 1, 4)}$, so $\\chi = \\mu_r-1 = ${S(chi, 3)}$.` };
    },
    verify: (p) => { const MU0 = 4e-7 * Math.PI; if (p.v === 0) return vo(p, MU0 * p.mur * p.n * p.I * 1e3, 'mT'); if (p.v === 1) return vo(p, p.mur * p.n * p.I - p.n * p.I, 'A/m', 4); return vo(p, p.B / (MU0 * p.Hh) - 1, '', 4); } },
  { id: 'mm-g08', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: "Curie's law",
    make(rng) {
      const v = int(rng, 0, 2); const T1 = choose(rng, [250, 300, 350, 400]); const T2 = choose(rng, [100, 150, 200, 500, 600]);
      const c1 = choose(rng, [1.2, 1.8, 2.4, 3, 3.6]);
      if (v === 0) { const c2 = c1 * T1 / T2; return { T1, T2, c1, v, q: `A paramagnetic sample has $\\chi = ${c1}\\times10^{-5}$ at ${T1} K. Find $\\chi$ at ${T2} K (in units of $10^{-5}$, 2 decimals).`, answer: N(c2, 2), tol: 0.01 * c2 + 0.01, unit: '1e-5', sol: `Curie's law: $\\chi\\propto1/T$. $\\chi_2 = ${c1}\\times\\dfrac{${T1}}{${T2}} = ${S(c2, 4)}\\times10^{-5}$.` }; }
      if (v === 1) { const f = choose(rng, [1.5, 2, 2.5, 3]); const Tn = T1 / f; return { T1, c1, f, v, q: `A paramagnetic sample has $\\chi = ${c1}\\times10^{-5}$ at ${T1} K. At what temperature (in K, 1 decimal) will its susceptibility be ${f} times as large?`, answer: N(Tn, 1), tol: 0.01 * Tn + 0.1, unit: 'K', sol: `$\\chi\\propto1/T$, so $T' = T/${f} = ${T1}/${f} = ${S(Tn, 4)}$ K.` }; }
      const B1 = choose(rng, [0.1, 0.2, 0.5]); const B2 = choose(rng, [0.3, 0.6, 1]); const M1 = choose(rng, [0.3, 0.5, 0.8]); const M2 = M1 * (B2 / B1) * (T1 / T2);
      return { T1, T2, B1, B2, M1, v, q: `A paramagnetic sample has magnetisation $${M1}\\ \\mathrm{A\\,m^{-1}}$ in a field of ${B1} T at ${T1} K. Find the magnetisation in a field of ${B2} T at ${T2} K (in $\\mathrm{A\\,m^{-1}}$, 2 decimals; far from saturation).`, answer: N(M2, 2), tol: 0.01 * M2 + 0.01, unit: 'A/m', sol: `$M\\propto B/T$. $M_2 = ${M1}\\times\\dfrac{${B2}}{${B1}}\\times\\dfrac{${T1}}{${T2}} = ${S(M2, 4)}\\ \\mathrm{A\\,m^{-1}}$.`, trap: 'Field raises M; temperature lowers it.' };
    },
    verify: (p) => { if (p.v === 0) { const C = p.c1 * p.T1; return C / p.T2; } if (p.v === 1) { const C = p.c1 * p.T1; return C / (p.c1 * p.f); } const C = p.M1 * p.T1 / p.B1; return C * p.B2 / p.T2; } },
  { id: 'mm-g09', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'hysteresis loss',
    make(rng) {
      const A = choose(rng, [6, 8, 10, 12, 15, 20]); const a = choose(rng, [50, 100, 200]); const b = choose(rng, [0.1, 0.2, 0.25, 0.5]); const V = choose(rng, [1e-3, 2e-3, 4e-3, 5e-3]); const f = choose(rng, [50, 60]); const v = int(rng, 0, 2);
      const w = A * a * b;
      if (v === 0) return { A, a, b, v, q: `The $B$-$H$ loop of a core is plotted with 1 cm = ${a} $\\mathrm{A\\,m^{-1}}$ along $H$ and 1 cm = ${b} T along $B$. The loop has an area of ${A} $\\mathrm{cm^2}$. Find the energy lost per unit volume per cycle (in $\\mathrm{J\\,m^{-3}}$).`, answer: N(w, 1), tol: 0.5, unit: 'J/m^3', sol: `One cm$^2$ stands for ${a}$\\times$${b} $= ${S(a * b)}\\ \\mathrm{J\\,m^{-3}}$. Energy $= ${A}\\times${S(a * b)} = ${S(w, 4)}\\ \\mathrm{J\\,m^{-3}}$.` };
      if (v === 1) { const P = w * V * f; return { A, a, b, V, f, v, q: `A core of volume $${tx(V, 2)}\\ \\mathrm{m^3}$ has a loop energy of ${S(w, 4)} $\\mathrm{J\\,m^{-3}}$ per cycle and runs on a ${f} Hz supply. Find the power lost as heat (in W, 2 decimals).`, answer: N(P, 2), tol: 0.01 * P + 0.01, unit: 'W', sol: `Energy per cycle $= ${S(w, 4)}\\times${tx(V, 2)} = ${S(w * V, 4)}$ J. Power $= ${S(w * V, 4)}\\times${f} = ${S(P, 4)}$ W.` }; }
      const t = choose(rng, [300, 600, 900]); const dT = w * f * t / (7800 * 450);
      return { A, a, b, f, t, v, q: `Iron of density $7800\\ \\mathrm{kg\\,m^{-3}}$ and specific heat $450\\ \\mathrm{J\\,kg^{-1}K^{-1}}$ goes through a cycle with a loop energy of ${S(w, 4)} $\\mathrm{J\\,m^{-3}}$ ${f} times a second. If all the loss warms it, find the temperature rise in ${t} s (in K, 2 decimals).`, answer: N(dT, 2), tol: 0.01 * dT + 0.01, unit: 'K', sol: `Heat per volume $= ${S(w, 4)}\\times${f}\\times${t} = ${S(w * f * t, 4)}\\ \\mathrm{J\\,m^{-3}}$. $\\Delta T = \\dfrac{Q/V}{\\rho c} = \\dfrac{${S(w * f * t, 4)}}{7800\\times450} = ${S(dT, 4)}$ K.`, trap: 'The volume cancels: both heat and mass are proportional to it.' };
    },
    verify: (p) => { const w = p.A * p.a * p.b; if (p.v === 0) return w; if (p.v === 1) return p.A * p.a * p.b * p.V * p.f; const rho = 7800, c = 450; const Vv = 1; return (w * Vv * p.f * p.t) / (rho * Vv * c); } },
  { id: 'mm-g10', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'combination of magnets',
    make(rng) {
      const v = int(rng, 0, 2); const [m1, m2] = choose(rng, [[3, 1], [5, 3], [2, 1], [5, 1], [4, 3]]);
      if (v === 0) { const Td = 2, Ts = Td * Math.sqrt((m1 - m2) / (m1 + m2)); return { m1, m2, v, q: `Two magnets with equal moments of inertia and moments in the ratio ${m1} : ${m2} are fixed together at their centres with parallel axes. The period is $T_s$ when the moments are in the same direction and $T_d$ when opposite. Find $T_d/T_s$ (3 decimals).`, answer: N(Td / Ts, 3), tol: 0.004, unit: '', sol: `$T\\propto\\sqrt{I'/M_{net}}$ with the same $I'$. $\\dfrac{T_d}{T_s} = \\sqrt{\\dfrac{M_1+M_2}{M_1-M_2}} = \\sqrt{\\dfrac{${m1}+${m2}}{${m1}-${m2}}} = ${S(Td / Ts, 4)}$.`, trap: 'The difference arrangement has the smaller net moment, so it swings more slowly.' }; }
      const I1 = choose(rng, [1, 2, 3]) * 1e-5; const I2 = choose(rng, [1, 2, 4]) * 1e-5; const B = choose(rng, [0.1, 0.2, 0.25]); const M1 = m1 * 0.5; const M2 = m2 * 0.5;
      if (v === 1) { const T = 2 * Math.PI * Math.sqrt((I1 + I2) / ((M1 + M2) * B)); return { I1, I2, B, M1, M2, v, q: `Two magnets with moments ${M1} and ${M2} $\\mathrm{A\\,m^2}$ and moments of inertia $${tx(I1, 2)}$ and $${tx(I2, 2)}\\ \\mathrm{kg\\,m^2}$ are fixed together with their moments parallel and oscillate in a field of ${B} T. Find the period (in ms, 1 decimal).`, answer: N(T * 1e3, 1), tol: 0.01 * T * 1e3 + 0.05, unit: 'ms', sol: `$M = ${M1}+${M2} = ${M1 + M2}$ and $I = ${tx(I1, 2)}+${tx(I2, 2)} = ${tx(I1 + I2, 3)}$. $T = 2\\pi\\sqrt{\\dfrac{I}{MB}} = 2\\pi\\sqrt{\\dfrac{${tx(I1 + I2, 3)}}{${M1 + M2}\\times${B}}} = ${S(T * 1e3, 4)}$ ms.` }; }
      const Mn = Math.hypot(M1, M2); const T = 2 * Math.PI * Math.sqrt((I1 + I2) / (Mn * B));
      return { I1, I2, B, M1, M2, v, q: `Two magnets with moments ${M1} and ${M2} $\\mathrm{A\\,m^2}$ and moments of inertia $${tx(I1, 2)}$ and $${tx(I2, 2)}\\ \\mathrm{kg\\,m^2}$ (each about the common centre) are fixed with their axes at right angles. Find the period in a field of ${B} T (in ms, 1 decimal).`, answer: N(T * 1e3, 1), tol: 0.01 * T * 1e3 + 0.05, unit: 'ms', sol: `Moments add as vectors: $M = \\sqrt{${M1}^2+${M2}^2} = ${S(Mn, 4)}$. Inertias add: $I = ${tx(I1 + I2, 3)}$. $T = 2\\pi\\sqrt{I/MB} = ${S(T * 1e3, 4)}$ ms.`, trap: 'Add moments of crossed magnets as vectors.' };
    },
    verify: (p) => { if (p.v === 0) { const w = (th) => Math.hypot(p.m1 + p.m2 * Math.cos(th), p.m2 * Math.sin(th)); return Math.sqrt(w(0) / w(Math.PI)); } const w = (th) => Math.hypot(p.M1 + p.M2 * Math.cos(th), p.M2 * Math.sin(th)); const Mn = p.v === 1 ? w(0) : w(Math.PI / 2); return 2 * Math.PI * Math.sqrt((p.I1 + p.I2) / (Mn * p.B)) * 1e3; } },
  { id: 'mm-g11', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'cutting and bending a magnet',
    make(rng) {
      const M = choose(rng, [1.2, 2.4, 3.6, 6]); const n = choose(rng, [2, 3, 4]); const v = int(rng, 0, 2); const ph = choose(rng, [90, 120, 180, 270]);
      if (v === 0) { const x = M / n; return { M, n, v, q: `A bar magnet of moment ${M} $\\mathrm{A\\,m^2}$ is cut into ${n} equal pieces by planes perpendicular to its length. Find the moment of each piece (in $\\mathrm{A\\,m^2}$, 3 decimals).`, answer: N(x, 3), tol: 0.003, unit: 'A m^2', sol: `Pole strength is unchanged and the length becomes $L/${n}$, so $M' = M/${n} = ${S(x, 4)}\\ \\mathrm{A\\,m^2}$.` }; }
      if (v === 1) { const x = M / n; return { M, n, v, q: `A bar magnet of moment ${M} $\\mathrm{A\\,m^2}$ is cut lengthwise into ${n} identical thin magnets. Find the moment of each (in $\\mathrm{A\\,m^2}$, 3 decimals).`, answer: N(x, 3), tol: 0.003, unit: 'A m^2', sol: `The length is unchanged but the cross-section, and so the pole strength, becomes $1/${n}$. $M' = M/${n} = ${S(x, 4)}\\ \\mathrm{A\\,m^2}$.`, trap: 'Cutting across or along both divide M by the same number, but for different reasons.' }; }
      const f = 2 * Math.sin(ph * D / 2) / (ph * D); const x = M * f;
      return { M, ph, v, q: `A thin bar magnet of moment ${M} $\\mathrm{A\\,m^2}$ is bent into a circular arc that subtends $${ph}^\\circ$ at its centre. Take the moment as pole strength times the distance between the poles. Find the new moment (in $\\mathrm{A\\,m^2}$, 3 decimals).`, answer: N(x, 3), tol: 0.004, unit: 'A m^2', sol: `Length $L = R\\phi$ with $\\phi = ${ph}^\\circ = ${S(ph * D, 4)}$ rad. The poles are a chord $2R\\sin(\\phi/2)$ apart. $M' = M\\dfrac{2R\\sin(\\phi/2)}{R\\phi} = ${M}\\times${S(f, 4)} = ${S(x, 4)}\\ \\mathrm{A\\,m^2}$.` };
    },
    verify: (p) => { if (p.v < 2) return p.M / p.n; const L = 1; const R = L / (p.ph * D); const ax = R, ay = 0; const bx = R * Math.cos(p.ph * D), by = R * Math.sin(p.ph * D); return p.M * Math.hypot(ax - bx, ay - by) / L; } },
  { id: 'mm-g12', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'atomic magnetic moment',
    make(rng) {
      const v = int(rng, 0, 2); const e = 1.6e-19, hb = 1.055e-34, m = 9.1e-31;
      if (v === 0) { const n = choose(rng, [1, 2, 3, 4]); const mu = n * e * hb / (2 * m); return { n, v, q: `In the Bohr model the orbital angular momentum of the electron in the $n = ${n}$ orbit is $n\\hbar$ with $\\hbar = 1.055\\times10^{-34}$ J s. Find its orbital magnetic moment (in units of $10^{-24}\\ \\mathrm{A\\,m^2}$, 2 decimals). Take $e = 1.6\\times10^{-19}$ C and $m = 9.1\\times10^{-31}$ kg.`, answer: N(mu * 1e24, 2), tol: 0.02 * n, unit: '1e-24 A m^2', sol: `$\\mu = \\dfrac{e}{2m}L = \\dfrac{1.6\\times10^{-19}}{2\\times9.1\\times10^{-31}}\\times${n}\\times1.055\\times10^{-34} = ${S(mu * 1e24, 4)}\\times10^{-24}\\ \\mathrm{A\\,m^2}$.` }; }
      if (v === 1) { const r = choose(rng, [0.5, 1, 2]) * 1e-10; const sp = choose(rng, [1, 2, 3]) * 1e6; const mu = e * sp * r / 2; return { r, sp, v, q: `An electron moves in a circle of radius ${S(r * 1e10)}$\\times10^{-10}$ m at a speed of ${sp / 1e6}$\\times10^{6}\\ \\mathrm{m\\,s^{-1}}$. Find the magnetic moment of this orbit (in units of $10^{-24}\\ \\mathrm{A\\,m^2}$, 3 decimals). Take $e = 1.6\\times10^{-19}$ C.`, answer: N(mu * 1e24, 3), tol: 0.01 * mu * 1e24 + 0.002, unit: '1e-24 A m^2', sol: `Current $I = ev/2\\pi r$ and area $\\pi r^2$, so $\\mu = IA = \\dfrac{evr}{2} = \\dfrac{1.6\\times10^{-19}\\times${tx(sp, 2)}\\times${tx(r, 2)}}{2} = ${S(mu * 1e24, 4)}\\times10^{-24}\\ \\mathrm{A\\,m^2}$.` }; }
      const r = choose(rng, [0.5, 0.53, 1]) * 1e-10; const fq = choose(rng, [2, 4, 6.6]) * 1e15; const mu = e * fq * Math.PI * r * r;
      return { r, fq, v, q: `An electron circulates ${S(fq / 1e15)}$\\times10^{15}$ times a second in an orbit of radius ${S(r * 1e10)}$\\times10^{-10}$ m. Find the orbital magnetic moment (in units of $10^{-24}\\ \\mathrm{A\\,m^2}$, 3 decimals). Take $e = 1.6\\times10^{-19}$ C.`, answer: N(mu * 1e24, 3), tol: 0.01 * mu * 1e24 + 0.002, unit: '1e-24 A m^2', sol: `$I = ef = 1.6\\times10^{-19}\\times${tx(fq, 2)} = ${tx(e * fq)}$ A. $\\mu = I\\pi r^2 = ${tx(e * fq)}\\times\\pi\\times(${tx(r, 2)})^2 = ${S(mu * 1e24, 4)}\\times10^{-24}\\ \\mathrm{A\\,m^2}$.` };
    },
    verify: (p) => { const e = 1.6e-19, hb = 1.055e-34, m = 9.1e-31; if (p.v === 0) { const L = p.n * hb; return (e / (2 * m)) * L * 1e24; } if (p.v === 1) { const T = 2 * Math.PI * p.r / p.sp; return e / T * Math.PI * p.r * p.r * 1e24; } const T = 1 / p.fq; return e / T * Math.PI * p.r * p.r * 1e24; } },
  { id: 'mm-g13', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'saturation magnetisation',
    make(rng) {
      const [nm, rho, Mm, mb] = choose(rng, [['iron', 7870, 55.85, 2.2], ['nickel', 8900, 58.69, 0.6], ['cobalt', 8900, 58.93, 1.7]]); const v = int(rng, 0, 1);
      const NA = 6.02e23, uB = 9.27e-24; const Ms = rho * NA / (Mm * 1e-3) * mb * uB;
      if (v === 0) return { nm, rho, Mm, mb, v, q: `${nm[0].toUpperCase() + nm.slice(1)} has density ${rho} $\\mathrm{kg\\,m^{-3}}$ and molar mass ${Mm} g. Each atom carries a moment of ${mb} $\\mu_B$ ($\\mu_B = 9.27\\times10^{-24}\\ \\mathrm{A\\,m^2}$). If all moments are lined up, find the saturation magnetisation (in $10^5\\ \\mathrm{A\\,m^{-1}}$, 1 decimal). $N_A = 6.02\\times10^{23}$.`, answer: N(Ms / 1e5, 1), tol: 0.01 * Ms / 1e5 + 0.05, unit: '1e5 A/m', sol: `Atoms per m$^3$: $n = \\dfrac{\\rho N_A}{M_{mol}} = \\dfrac{${rho}\\times6.02\\times10^{23}}{${Mm}\\times10^{-3}} = ${tx(rho * NA / (Mm * 1e-3))}$. $M_s = n\\mu = ${tx(rho * NA / (Mm * 1e-3))}\\times${mb}\\times9.27\\times10^{-24} = ${S(Ms / 1e5, 4)}\\times10^{5}\\ \\mathrm{A\\,m^{-1}}$.` };
      const Msr = +(Ms / 1e5).toPrecision(4);
      return { nm, rho, Mm, mb, Msr, v, q: `A ferromagnet of density ${rho} $\\mathrm{kg\\,m^{-3}}$ and molar mass ${Mm} g saturates at ${Msr}$\\times10^{5}\\ \\mathrm{A\\,m^{-1}}$. Find the moment per atom in units of $\\mu_B$ (2 decimals). $\\mu_B = 9.27\\times10^{-24}\\ \\mathrm{A\\,m^2}$, $N_A = 6.02\\times10^{23}$.`, answer: N(mb, 2), tol: 0.02, unit: 'muB', sol: `$n = \\dfrac{\\rho N_A}{M_{mol}} = ${tx(rho * NA / (Mm * 1e-3))}\\ \\mathrm{m^{-3}}$. Moment per atom $= M_s/n = ${tx(Msr * 1e5)}/${tx(rho * NA / (Mm * 1e-3))} = ${tx(Ms / (rho * NA / (Mm * 1e-3)))}\\ \\mathrm{A\\,m^2} = ${S(mb, 3)}\\ \\mu_B$.` };
    },
    verify: (p) => { const NA = 6.02e23, uB = 9.27e-24; const mol = p.rho / (p.Mm * 1e-3); const n = mol * NA; if (p.v === 0) return n * p.mb * uB / 1e5; return (p.Msr * 1e5 / n) / uB; } },
  { id: 'mm-g14', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: "Earth's magnetism and torque",
    make(rng) {
      const M = choose(rng, [0.5, 1, 2, 3]); const Be = choose(rng, [40, 50, 60]); const dl = choose(rng, [37, 53, 60]); const al = choose(rng, [30, 37, 53, 60]); const v = int(rng, 0, 1);
      const Bh = Be * Math.cos(dl * D), Bv = Be * Math.sin(dl * D); const s = Math.sin(al * D);
      if (v === 0) { const val = M * Bh * s; const o = numOpts(rng, val, [M * Be * s, M * Bv * s, M * Bh / s], 'µN m'); return { M, Be, dl, al, v, val, ...o, q: `At a place the Earth's total field is ${Be} $\\mu$T with a dip of $${dl}^\\circ$. A magnet of moment ${M} $\\mathrm{A\\,m^2}$ rests on a table with its axis at $${al}^\\circ$ to the magnetic meridian. The torque on it is`, sol: `On a horizontal table only the horizontal component acts on a magnet free to turn about a vertical axis: $B_h = ${Be}\\cos${dl}^\\circ = ${S(Bh, 4)}\\ \\mu$T. $\\tau = MB_h\\sin${al}^\\circ = ${S(val, 3)}\\ \\mu$N m.`, trap: 'A horizontal magnet on a table feels only B_h; the vertical part is balanced by the support.' }; }
      const val = M * Be * s; const o = numOpts(rng, val, [M * Bh * s, M * Bv * s, M * Be / s], 'µN m');
      return { M, Be, dl, al, v, val, ...o, q: `A magnet of moment ${M} $\\mathrm{A\\,m^2}$ is free to turn in the vertical plane of the magnetic meridian (like a dip circle needle) at a place where the Earth's total field is ${Be} $\\mu$T. It makes an angle of $${al}^\\circ$ with the total field. The torque on it is`, sol: `In the plane of the meridian the whole field $B_e$ acts. $\\tau = MB_e\\sin${al}^\\circ = ${M}\\times${Be}\\times${S(s, 4)} = ${S(val, 3)}\\ \\mu$N m.` };
    },
    verify: (p) => { const Bh = p.Be * Math.cos(p.dl * D); const Bv = p.Be * Math.sin(p.dl * D); if (p.v === 0) return vo(p, p.M * Bh * Math.sin(p.al * D), 'µN m'); return vo(p, p.M * Math.hypot(Bh, Bv) * Math.sin(p.al * D), 'µN m'); } },
  { id: 'mm-g15', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'deflection magnetometer',
    make(rng) {
      const v = int(rng, 0, 3); const Bh = choose(rng, [3, 3.5, 4]) * 1e-5; const M = choose(rng, [0.5, 1, 1.5, 2]); const r = choose(rng, [0.15, 0.2, 0.25, 0.3]); const th = choose(rng, [30, 37, 45, 53, 60]);
      if (v === 0) { const t = Math.atan(2 * K * M / (r ** 3 * Bh)) / D; return { Bh, M, r, v, q: `A short magnet of moment ${M} $\\mathrm{A\\,m^2}$ is placed ${S(r * 100)} cm from a compass needle with its axis pointing at the needle (end-on). The Earth's horizontal field is ${S(Bh * 1e5)}$\\times10^{-5}$ T. Find the deflection of the needle (in degrees, 1 decimal).`, answer: N(t, 1), tol: 0.3, unit: 'deg', sol: `End-on, the magnet's field at the needle is $B = 10^{-7}\\dfrac{2M}{r^3} = ${tx(2 * K * M / r ** 3)}$ T, at right angles to $B_h$. $\\tan\\theta = B/B_h = ${S(2 * K * M / (r ** 3 * Bh), 4)}$, so $\\theta = ${S(t, 3)}^\\circ$.` }; }
      if (v === 1) { const t = Math.atan(K * M / (r ** 3 * Bh)) / D; return { Bh, M, r, v, q: `A short magnet of moment ${M} $\\mathrm{A\\,m^2}$ is placed ${S(r * 100)} cm from a compass needle so that the needle lies on the magnet's equatorial line (broadside position). The Earth's horizontal field is ${S(Bh * 1e5)}$\\times10^{-5}$ T. Find the deflection of the needle (in degrees, 1 decimal).`, answer: N(t, 1), tol: 0.3, unit: 'deg', sol: `Broadside, $B = 10^{-7}\\dfrac{M}{r^3} = ${tx(K * M / r ** 3)}$ T, perpendicular to $B_h$. $\\tan\\theta = ${S(K * M / (r ** 3 * Bh), 4)}$, so $\\theta = ${S(t, 3)}^\\circ$.` }; }
      if (v === 2) { const Mx = Bh * Math.tan(th * D) * r ** 3 / (2 * K); return { Bh, th, r, v, q: `In the end-on position a short magnet at ${S(r * 100)} cm from a compass needle deflects it by $${th}^\\circ$. The Earth's horizontal field is ${S(Bh * 1e5)}$\\times10^{-5}$ T. Find the magnet's moment (in $\\mathrm{A\\,m^2}$, 3 decimals).`, answer: N(Mx, 3), tol: 0.01 * Mx + 0.002, unit: 'A m^2', sol: `$\\tan\\theta = \\dfrac{2\\times10^{-7}M}{r^3B_h}\\Rightarrow M = \\dfrac{B_hr^3\\tan${th}^\\circ}{2\\times10^{-7}} = \\dfrac{${tx(Bh)}\\times${S(r ** 3, 4)}\\times${S(Math.tan(th * D), 4)}}{2\\times10^{-7}} = ${S(Mx, 4)}\\ \\mathrm{A\\,m^2}$.` }; }
      const t2 = choose(rng, [20, 25, 30]); const ratio = Math.tan(th * D) / Math.tan(t2 * D);
      return { th, t2, v, q: `Two short magnets are placed one after the other at the same distance from a compass needle in the end-on position. They deflect it by $${th}^\\circ$ and $${t2}^\\circ$. Find the ratio of their moments $M_1/M_2$ (3 decimals).`, answer: N(ratio, 3), tol: 0.01 * ratio + 0.003, unit: '', sol: `$\\tan\\theta\\propto M$ at fixed distance. $\\dfrac{M_1}{M_2} = \\dfrac{\\tan${th}^\\circ}{\\tan${t2}^\\circ} = \\dfrac{${S(Math.tan(th * D), 4)}}{${S(Math.tan(t2 * D), 4)}} = ${S(ratio, 4)}$.`, trap: 'Use the ratio of tangents, not the ratio of the angles.' };
    },
    verify: (p) => { if (p.v === 0) return Math.atan2(poleAx(p.M, p.r), p.Bh) / D; if (p.v === 1) return Math.atan2(poleEq(p.M, p.r), p.Bh) / D; if (p.v === 2) return p.Bh * Math.tan(p.th * D) / poleAx(1, p.r); return Math.sin(p.th * D) * Math.cos(p.t2 * D) / (Math.cos(p.th * D) * Math.sin(p.t2 * D)); } },
  { id: 'mm-g16', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'susceptibility and permeability',
    make(rng) {
      const v = int(rng, 0, 1); const chi = choose(rng, [1.2e-5, 2.2e-5, 2.3e-5, -1.5e-5, -2e-5, -9e-6]);
      if (v === 0) { const val = chi * 100; const o = numOpts(rng, val, [chi * 1e4, -val, chi], '%'); return { chi, v, val, ...o, q: `A solenoid is filled with a material of susceptibility $\\chi = ${S(chi * 1e5)}\\times10^{-5}$. The percentage change in the field inside it (compared with the empty solenoid; a plus sign means an increase) is`, sol: `$B/B_0 = \\mu_r = 1+\\chi$, so the change is $\\chi\\times100\\% = ${S(chi * 100)}\\ \\%$.`, trap: 'Susceptibilities of para- and diamagnets are so tiny that B changes by only a few thousandths of a percent.' }; }
      const val = 1 + chi; const o = numOpts(rng, val, [1 - chi, chi, 1 + 10 * chi], '', 7);
      return { chi, v, val, ...o, q: `The susceptibility of a material is $${S(chi * 1e5)}\\times10^{-5}$. Its relative permeability is`, sol: `$\\mu_r = 1+\\chi = 1 + (${S(chi)}) = ${fmt(val, 7)}$.` };
    },
    verify: (p) => { if (p.v === 0) return vo(p, (1 + p.chi - 1) * 100, '%'); return vo(p, 1 + p.chi, '', 7); } },
  { id: 'mm-g17', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'moment of rotating charge',
    make(rng) {
      const Q = choose(rng, [1, 2, 4, 5]); const R = choose(rng, [0.1, 0.2, 0.3]); const f = choose(rng, [20, 50, 100]); const v = int(rng, 0, 2);
      const w = 2 * Math.PI * f; const name = ['a thin ring', 'a flat disc with the charge spread uniformly over it', 'a thin spherical shell with the charge spread uniformly over it'][v];
      const Mv = [Q * w * R * R / 2, Q * w * R * R / 4, Q * w * R * R / 3][v];
      return { Q, R, f, v, Mv, q: `A charge of ${Q} $\\mu$C is on ${name}, of radius ${R} m, spinning about its axis ${f} times per second. Find its magnetic moment (in units of $10^{-6}\\ \\mathrm{A\\,m^2}$, 3 decimals).`, answer: N(Mv, 3), tol: 0.01 * Mv + 0.002, unit: '1e-6 A m^2',
        sol: [`Ring: $I = qf$, $M = I\\pi R^2 = q\\omega R^2/2 = ${Q}\\times${S(w, 4)}\\times${R * R}/2 = ${S(Mv, 4)}$.`, `Disc: add up rings, $dM = \\tfrac12\\omega r^2\\,dq$ with $dq = q\\,2r\\,dr/R^2$. $M = q\\omega R^2/4 = ${S(Mv, 4)}$.`, `Shell: $M = \\int\\tfrac12\\omega r_\\perp^2dq = q\\omega R^2/3 = ${S(Mv, 4)}$.`][v] + ` (units of $10^{-6}\\ \\mathrm{A\\,m^2}$, since q is in $\\mu$C.)`, trap: 'The factor is 1/2, 1/4 or 1/3 depending on how the charge is spread.' };
    },
    verify: (p) => { const w = 2 * Math.PI * p.f; let M = 0; const n = 20000; if (p.v === 0) return p.Q * p.f * Math.PI * p.R * p.R; if (p.v === 1) { for (let i = 0; i < n; i++) { const r = (i + 0.5) / n * p.R; const dq = p.Q * 2 * r * (p.R / n) / (p.R * p.R); M += 0.5 * w * r * r * dq; } return M; } for (let i = 0; i < n; i++) { const t = (i + 0.5) / n * Math.PI; const dq = p.Q * Math.sin(t) * (Math.PI / n) / 2; const rp = p.R * Math.sin(t); M += 0.5 * w * rp * rp * dq; } return M; } },
];
export default { topic: 'magnetism-matter', groups, items, gens };
