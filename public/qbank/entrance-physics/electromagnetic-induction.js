import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

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
const nid = () => `ei-${String(++k).padStart(3, '0')}`;
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
  mcq(1, 'magnetic flux', r`The SI unit of magnetic flux, the weber, is equal to`, r`$\mathrm{T\,m^2}$`, [r`$\mathrm{T\,m^{-2}}$`, r`$\mathrm{T\,m}$`, r`$\mathrm{T\,A^{-1}}$`],
    r`$\Phi = BA\cos\theta$, so 1 Wb $= 1\ \mathrm{T\,m^2}$. It is also 1 V s.`),
  nat(1, 'magnetic flux', r`A coil of area $0.02\ \mathrm{m^2}$ is placed with its plane perpendicular to a field of 0.5 T. Find the flux through it (in mWb).`, 0.5 * 0.02 * 1e3, 0.01, 1,
    r`The normal is parallel to $\vec B$, so $\Phi = BA = 0.5\times0.02 = 0.01$ Wb $= 10$ mWb.`, { unit: 'mWb' }),
  mcq(1, "Faraday's law", r`According to Faraday's law, the emf induced in a coil is proportional to`, 'the rate of change of magnetic flux through it', ['the magnetic flux through it', 'the magnetic field at its centre', 'the resistance of the coil'],
    r`$\mathcal E = -N\,d\Phi/dt$. A large steady flux induces nothing; it is the change that matters. The resistance affects the current, not the emf.`),
  mcq(1, "Lenz's law", r`Lenz's law is a consequence of the law of conservation of`, 'energy', ['charge', 'momentum', 'mass'],
    r`If the induced current helped the change that produces it, the effect would feed itself and energy would be created from nothing. So the induced current must oppose the change, and the work done against it appears as electrical energy.`),
  nat(1, 'motional emf', r`A conducting rod of length 0.5 m moves at $4\ \mathrm{m\,s^{-1}}$ perpendicular to a field of 0.2 T, with $\vec v\perp\vec B\perp$ rod. Find the emf between its ends (in V, 2 decimals).`, 0.2 * 0.5 * 4, 0.005, 2,
    r`$\mathcal E = Blv = 0.2\times0.5\times4 = 0.40$ V.`, { unit: 'V' }),
  mcq(1, 'unit of inductance', r`One henry is equal to`, r`one volt second per ampere`, [r`one volt per ampere`, r`one ampere second per volt`, r`one weber per metre squared`],
    r`$\mathcal E = L\,dI/dt$ gives $L = \dfrac{\mathcal E}{dI/dt}$, so 1 H $= 1\ \mathrm{V\,s\,A^{-1}}$. Also $L = \Phi/I$ gives 1 H $= 1\ \mathrm{Wb\,A^{-1}}$.`),
  nat(1, 'self-induction', r`The current in a coil of self-inductance 2 H changes at $3\ \mathrm{A\,s^{-1}}$. Find the magnitude of the induced emf (in V).`, 2 * 3, 0.01, 1,
    r`$|\mathcal E| = L\left|\dfrac{dI}{dt}\right| = 2\times3 = 6$ V.`, { unit: 'V' }),
  nat(1, 'energy in an inductor', r`An inductor of 0.5 H carries a steady current of 4 A. How much energy is stored in it (in J)?`, 0.5 * 0.5 * 16, 0.01, 1,
    r`$U = \tfrac12LI^2 = \tfrac12\times0.5\times4^2 = 4$ J.`, { unit: 'J' }),
  mcq(1, 'Faraday and Lenz', r`The negative sign in $\mathcal E = -d\Phi/dt$ shows that`, 'the induced emf opposes the change in flux', ['the emf is always negative', 'flux cannot increase', 'the induced current is zero'],
    r`The sign records Lenz's law: the induced current sets up a field that opposes the change in the flux, whether the flux rises or falls.`),
  mcq(1, 'steady field', r`A closed coil is kept at rest in a uniform magnetic field that does not change with time. The induced emf in it is`, 'zero', ['maximum', 'equal to $BA$', 'equal to $B/A$'],
    r`$d\Phi/dt = 0$ when nothing changes, so there is no induced emf, however large the flux.`),
  mcq(1, 'motional emf', r`A straight conductor moves in a uniform magnetic field with its velocity parallel to the field. The emf induced across its ends is`, 'zero', [r`$Blv$`, r`$\tfrac12Blv$`, r`$Bl/v$`],
    r`$\vec v\times\vec B = 0$ when they are parallel, so there is no force on the free charges and no emf.`),
  mcq(1, 'direction of induced current', r`The north pole of a bar magnet is pushed towards a coil. Seen from the magnet's side, the induced current in the coil is`, 'anticlockwise', ['clockwise', 'zero', 'first clockwise and then anticlockwise'],
    r`The flux through the coil (towards the coil, away from the N pole) is increasing. The coil opposes this by making its near face a north pole too, so that it repels the magnet. A face that looks like a north pole has an anticlockwise current.`),
  mcq(1, 'eddy currents', r`Eddy currents are`, 'currents induced in a solid piece of metal by a changing magnetic flux', ['currents flowing in a vacuum tube', 'currents flowing only in insulators', 'currents in a superconductor at rest'],
    r`When the flux through a block of metal changes, circulating currents are induced inside it. They heat the metal and exert a braking force.`),
  mcq(1, 'AC generator', r`An AC generator converts`, 'mechanical energy into electrical energy', ['electrical energy into mechanical energy', 'chemical energy into mechanical energy', 'electrical energy into heat only'],
    r`A coil is turned in a magnetic field by an engine or a turbine. The changing flux induces an emf: mechanical work becomes electrical energy. The reverse process is an electric motor.`),
  nat(1, "Faraday's law", r`The flux through a coil of 10 turns changes by 0.04 Wb in 0.2 s. Find the average induced emf (in V).`, 10 * 0.04 / 0.2, 0.01, 1,
    r`$|\mathcal E| = N\dfrac{\Delta\Phi}{\Delta t} = 10\times\dfrac{0.04}{0.2} = 2$ V.`, { unit: 'V' }),
  nat(1, 'LR circuit', r`An inductor of 0.5 H is connected in series with a $10\ \Omega$ resistor. Find the time constant of the circuit (in ms).`, 0.5 / 10 * 1e3, 0.1, 1,
    r`$\tau = L/R = \dfrac{0.5}{10} = 0.05$ s $= 50$ ms.`, { unit: 'ms' }),
  mcq(1, 'dimensions', r`The dimensional formula of self-inductance $L$ is`, r`$\mathrm{[ML^2T^{-2}A^{-2}]}$`, [r`$\mathrm{[ML^2T^{-2}A^{-1}]}$`, r`$\mathrm{[ML^2T^{-3}A^{-1}]}$`, r`$\mathrm{[MLT^{-2}A^{-2}]}$`],
    r`$U = \tfrac12LI^2$, so $L = 2U/I^2$ and $[L] = \dfrac{\mathrm{ML^2T^{-2}}}{\mathrm{A^2}} = \mathrm{ML^2T^{-2}A^{-2}}$.`),
  mcq(1, 'mutual induction', r`When the current in one coil changes, an emf is induced in a neighbouring coil. This is called`, 'mutual induction', ['self-induction', 'eddy current heating', 'the Hall effect'],
    r`Mutual induction is the induction of an emf in one coil by a changing current in another. Self-induction is the effect of a coil's own changing current on itself.`),
  mcq(1, 'self induction', r`Self-inductance of a coil plays the same role in a circuit as ... in mechanics.`, 'mass (inertia)', ['force', 'friction', 'velocity'],
    r`A coil opposes any change of current, just as mass opposes any change of velocity. The energy $\tfrac12LI^2$ matches $\tfrac12mv^2$.`),
  mcq(1, 'transformer principle', r`The working of a transformer is based on`, 'mutual induction', ['self-induction only', 'eddy currents', 'the heating effect of current'],
    r`A changing current in the primary produces a changing flux through the secondary, which induces an emf in it: mutual induction. It needs AC.`),

  // ---------- Level 2 ----------
  nat(2, 'magnetic flux', r`A square coil of side 10 cm is in a field of 0.4 T. The normal to the coil makes $60^\circ$ with the field. Find the flux through it (in mWb).`, 0.4 * 0.01 * 0.5 * 1e3, 0.02, 2,
    r`$\Phi = BA\cos\theta = 0.4\times0.01\times\cos60^\circ = 2\times10^{-3}$ Wb $= 2.00$ mWb.`, { unit: 'mWb', trap: 'The angle is between the normal and the field.' }),
  nat(2, "Faraday's law", r`A coil of 50 turns and area $0.01\ \mathrm{m^2}$ lies with its plane perpendicular to a field that increases uniformly from 0.2 T to 0.6 T in 0.1 s. Find the induced emf (in V).`, 50 * 0.01 * 0.4 / 0.1, 0.01, 2,
    r`$\Delta\Phi = A\Delta B = 0.01\times0.4 = 4\times10^{-3}$ Wb. $|\mathcal E| = N\dfrac{\Delta\Phi}{\Delta t} = 50\times\dfrac{4\times10^{-3}}{0.1} = 2.0$ V.`, { unit: 'V' }),
  nat(2, 'motional emf on rails', r`A rod of length 0.3 m slides at $5\ \mathrm{m\,s^{-1}}$ on rails in a perpendicular field of 0.4 T. The rails are connected through a $2\ \Omega$ resistor (the rod and rails have negligible resistance). Find the current (in A, 2 decimals).`, 0.4 * 0.3 * 5 / 2, 0.005, 2,
    r`$\mathcal E = Blv = 0.4\times0.3\times5 = 0.6$ V. $I = \mathcal E/R = 0.6/2 = 0.30$ A.`, { unit: 'A' }),
  nat(2, 'force on a sliding rod', r`For the rod in the previous set-up (0.3 m, $5\ \mathrm{m\,s^{-1}}$, 0.4 T, circuit resistance $2\ \Omega$), find the force needed to keep it moving at constant speed (in mN).`, 0.4 * 0.3 * 0.3 * 1e3, 0.5, 1,
    r`The current is $0.30$ A, and the magnetic force on the rod is $BIl = 0.4\times0.3\times0.3 = 0.036$ N $= 36$ mN, opposing the motion. An equal applied force keeps it moving at constant speed. (Power check: $Fv = 0.036\times5 = 0.18$ W $= I^2R = 0.09\times2$.)`, { unit: 'mN' }),
  nat(2, 'rotating rod', r`A metal rod of length 0.5 m rotates at $40\ \mathrm{rad\,s^{-1}}$ about one end in a uniform perpendicular field of 0.2 T. Find the emf between its ends (in V, 2 decimals).`, 0.5 * 0.2 * 40 * 0.25, 0.01, 2,
    r`The speed of an element at distance $x$ is $\omega x$. $\mathcal E = \int_0^lB\omega x\,dx = \tfrac12B\omega l^2 = \tfrac12\times0.2\times40\times0.25 = 1.00$ V.`, { unit: 'V' }),
  nat(2, 'rotating disc', r`A metal disc of radius 20 cm rotates at 10 revolutions per second about its axis in a field of 0.1 T parallel to the axis. Find the emf between the centre and the rim (in V, 3 decimals).`, 0.5 * 0.1 * 2 * Math.PI * 10 * 0.04, 0.003, 3,
    r`$\omega = 2\pi\times10 = 62.83\ \mathrm{rad\,s^{-1}}$. A disc is a set of radial rods all in parallel: $\mathcal E = \tfrac12B\omega R^2 = \tfrac12\times0.1\times62.83\times0.04 = 0.126$ V.`, { unit: 'V' }),
  nat(2, 'aeroplane wing', r`An aeroplane with a wingspan of 40 m flies horizontally at $250\ \mathrm{m\,s^{-1}}$. The vertical component of the Earth's field is $4\times10^{-5}$ T. Find the emf between its wing tips (in V, 2 decimals).`, 4e-5 * 40 * 250, 0.005, 2,
    r`$\mathcal E = B_vlv = 4\times10^{-5}\times40\times250 = 0.40$ V. Only the component of the field perpendicular to both the wing and the velocity counts.`, { unit: 'V', trap: 'Use the vertical component of the Earth\'s field.' }),
  nat(2, 'self-induction', r`The current in a coil of 0.4 H rises from 0 to 2 A in 0.1 s at a steady rate. Find the induced emf (in V).`, 0.4 * 2 / 0.1, 0.05, 1,
    r`$|\mathcal E| = L\dfrac{\Delta I}{\Delta t} = 0.4\times\dfrac{2}{0.1} = 8$ V, opposing the rise.`, { unit: 'V' }),
  nat(2, 'AC generator', r`A coil of 100 turns and area $0.05\ \mathrm{m^2}$ rotates at 50 Hz in a field of 0.2 T. Find the peak emf (in V, nearest whole number).`, 100 * 0.2 * 0.05 * 2 * Math.PI * 50, 1, 0,
    r`$\mathcal E_0 = NBA\omega = 100\times0.2\times0.05\times(2\pi\times50) = 314$ V.`, { unit: 'V' }),
  nat(2, 'time constant', r`A $2\ \mathrm H$ inductor and a $4\ \Omega$ resistor are joined to a 12 V battery. Find the final steady current (in A).`, 3, 0.01, 1,
    r`After a long time the current is steady, the inductor drops no voltage, and $I = \mathcal E/R = 12/4 = 3$ A. (It is reached after a few time constants of $\tau = L/R = 0.5$ s.)`, { unit: 'A' }),
  mcq(2, 'direction of induced current', r`A conducting loop lies in the plane of the page in a uniform field pointing out of the page. The field decreases in magnitude. The induced current in the loop is`, 'anticlockwise', ['clockwise', 'zero', 'alternating'],
    r`The outward flux is decreasing, so the induced current sets up a field that adds to it, also out of the page. An anticlockwise current gives a field out of the page inside the loop.`),
  mcq(2, 'direction of induced current', r`A loop in the plane of the page is partly pulled out of a region of uniform field directed into the page. The induced current is`, 'clockwise', ['anticlockwise', 'zero', 'alternating'],
    r`The flux into the page is decreasing. To oppose this the induced current must produce a field into the page inside the loop, which means a clockwise current.`),
  mcq(2, 'induced emf', r`The emf induced in a coil rotating in a uniform field is maximum when the plane of the coil is`, 'parallel to the field', ['perpendicular to the field', 'at $45^\\circ$ to the field', 'at $30^\\circ$ to the field'],
    r`$\Phi = BA\cos\omega t$ and $\mathcal E = NBA\omega\sin\omega t$. The emf is greatest when $\sin\omega t = 1$: the flux is zero at that moment (plane parallel to $\vec B$) but changing fastest.`, { trap: 'Maximum emf is at zero flux.' }),
  mcq(2, 'eddy currents', r`Laminating the iron core of a transformer reduces`, 'eddy current losses', ['the number of turns needed', 'the magnetic field', 'the primary current to zero'],
    r`Thin insulated sheets break up the paths in which eddy currents can flow, so far less energy is lost as heat in the core.`),
  mcq(2, 'eddy currents', r`A magnet is dropped through a long copper tube and through a plastic tube of the same size. It falls more slowly in the copper tube because`, 'eddy currents in the copper oppose its motion', ['copper is heavier than plastic', 'copper is attracted to magnets', 'copper has no air in it'],
    r`The moving magnet changes the flux through each ring of the tube and induces eddy currents there. By Lenz's law these oppose the motion, so the magnet falls slowly (and the lost energy heats the tube). Plastic is an insulator: no currents, no braking.`),
  mcq(2, 'mutual induction', r`The mutual inductance of two coils depends on`, 'their geometry, their separation and the medium between them', ['the current in the primary only', 'the emf of the battery', 'the resistance of the secondary'],
    r`$M = \Phi_2/I_1$ is a property of the pair of coils: number of turns, areas, relative position and orientation, and the core material. It does not depend on the current or on resistances.`),
  mcq(2, 'induced emf', r`Which of the following, for a coil in a magnetic field, produces NO induced emf?`, 'Keeping the field, area and orientation constant', ['Increasing the area of the coil', 'Rotating the coil about a diameter', 'Switching the field off'],
    r`An emf needs a changing flux $\Phi = BA\cos\theta$. Changing the area, the angle or the field changes it. If all three stay fixed, there is no emf.`),
  nat(2, 'induced charge', r`A coil of 100 turns, area $0.01\ \mathrm{m^2}$ and resistance $20\ \Omega$ is turned through $180^\circ$ in a field of 0.5 T, starting with its plane perpendicular to the field. Find the charge that flows through the coil (in mC).`, 2 * 100 * 0.5 * 0.01 / 20 * 1e3, 0.5, 1,
    r`The flux changes from $+BA$ to $-BA$, so $|\Delta\Phi| = 2BA$ for each turn. $Q = \dfrac{N|\Delta\Phi|}{R} = \dfrac{100\times2\times0.5\times0.01}{20} = 0.05$ C $= 50$ mC, however fast it is turned.`, { unit: 'mC', trap: 'A reversal changes the flux by 2BA, not BA.' }),
  nat(2, 'energy in an inductor', r`A coil of 0.2 H carries 3 A. Find the energy stored (in J, 2 decimals).`, 0.5 * 0.2 * 9, 0.005, 2,
    r`$U = \tfrac12LI^2 = \tfrac12\times0.2\times9 = 0.90$ J.`, { unit: 'J' }),
  nat(2, 'self-inductance of a solenoid', r`A solenoid of 1000 turns, length 0.5 m and cross-sectional area $2\times10^{-4}\ \mathrm{m^2}$ has an air core. Find its self-inductance (in mH, 3 decimals).`, MU * 1000 * 1000 * 2e-4 / 0.5 * 1e3, 0.005, 3,
    r`$L = \dfrac{\mu_0N^2A}{l} = \dfrac{4\pi\times10^{-7}\times10^{6}\times2\times10^{-4}}{0.5} = 5.03\times10^{-4}$ H $= 0.503$ mH.`, { unit: 'mH' }),
  nat(2, 'mutual inductance', r`A long solenoid of 500 turns, length 0.4 m and area $5\times10^{-4}\ \mathrm{m^2}$ has a second coil of 800 turns wound tightly over its middle. Find the mutual inductance (in mH, 3 decimals).`, MU * 500 * 800 * 5e-4 / 0.4 * 1e3, 0.005, 3,
    r`Field of the inner solenoid per amp: $B = \mu_0\dfrac{500}{0.4}I$. The flux linked with the outer coil is $800BA$. $M = \dfrac{\mu_0N_1N_2A}{l} = \dfrac{4\pi\times10^{-7}\times500\times800\times5\times10^{-4}}{0.4} = 6.28\times10^{-4}$ H $= 0.628$ mH.`, { unit: 'mH' }),
  nat(2, 'LR circuit', r`A 12 V battery drives a series circuit of an inductor of 3 H and a resistor of $6\ \Omega$, switched on at $t = 0$. Find the current at $t = 0.5$ s (in A, 2 decimals).`, 2 * (1 - Math.exp(-1)), 0.01, 2,
    r`$I_0 = 12/6 = 2$ A, $\tau = L/R = 0.5$ s. $I = I_0(1 - e^{-t/\tau}) = 2(1 - e^{-1}) = 2\times0.632 = 1.26$ A.`, { unit: 'A' }),
  mcq(2, 'LR circuit', r`In an LR circuit connected to a battery, at the instant of closing the switch the inductor behaves like`, 'an open circuit', ['a short circuit', 'a battery of emf $\\mathcal E$', 'a capacitor'],
    r`The current cannot jump from zero, so at $t = 0$ it is zero and the whole battery emf appears across the inductor: like a break in the wire. After a long time the inductor acts like a plain wire (a short circuit, for steady current).`),
  mcq(2, 'LR circuit', r`In an LR circuit connected to a battery, after a long time the inductor behaves like`, 'a short circuit (a plain conductor)', ['an open circuit', 'a battery of emf $\\mathcal E$', 'a very large resistor'],
    r`When the current has become steady, $dI/dt = 0$ so the inductor has no induced emf across it; only its resistance (zero for an ideal coil) remains.`),
  mcq(2, 'energy in a magnetic field', r`The energy stored per unit volume in a magnetic field $B$ in vacuum is`, r`$\dfrac{B^2}{2\mu_0}$`, [r`$\dfrac{\mu_0B^2}{2}$`, r`$\dfrac{B}{2\mu_0}$`, r`$\dfrac{B^2}{\mu_0}$`],
    r`For a solenoid, $L = \mu_0n^2Al$ and $B = \mu_0nI$, so $U = \tfrac12LI^2 = \tfrac12\mu_0n^2I^2Al$. Divide by the volume $Al$: $u = \tfrac12\mu_0n^2I^2 = \dfrac{B^2}{2\mu_0}$. It parallels $\tfrac12\varepsilon_0E^2$ for electric fields.`),
  mcq(2, 'induced emf and speed', r`A rod moves at constant speed in a uniform field. If both its speed and its length are doubled, the motional emf becomes`, '4 times', ['2 times', '8 times', 'unchanged'],
    r`$\mathcal E = Blv$ is proportional to $l\times v$: $2\times2 = 4$.`),
  mcq(2, 'direction in a moving rod', r`A rod moves to the right on conducting rails in a uniform field directed into the page. The conventional current in the rod is directed`, 'up the page', ['down the page', 'to the right', 'into the page'],
    r`The force on a positive charge is $q\vec v\times\vec B = (\hat x)\times(-\hat z) = +\hat y$, up the page. Check with Lenz's law: the loop area is growing, flux into the page is growing, so the induced current is anticlockwise, which is up through the rod on the right side.`),
  mcq(2, 'induced electric field', r`The electric field induced by a changing magnetic flux has field lines that are`, 'closed loops', ['straight lines from positive to negative charge', 'always radial', 'absent'],
    r`This induced field is not due to charges. $\oint\vec E\cdot d\vec l = -d\Phi/dt\neq0$, so it is a non-conservative field whose lines close on themselves.`),
  mcq(2, 'mutual inductance', r`The unit of mutual inductance is`, 'the henry', ['the weber', 'the tesla', 'the farad'],
    r`$M = \Phi_2/I_1$ is measured in Wb/A, which is the henry, the same unit as self-inductance.`),
  mcq(2, 'flux graph', r`The flux through a coil increases linearly with time from 0 to 0.06 Wb in 0.03 s, then stays constant. The induced emf in a single turn is`, '2 V for 0.03 s, then zero', ['2 V for all times', 'zero first, then 2 V', '0.06 V for 0.03 s, then zero'],
    r`$\mathcal E = -d\Phi/dt$ is the slope of the graph: $0.06/0.03 = 2$ V while it rises, then zero when it is flat. A constant flux, however large, gives no emf.`, { trap: 'The emf follows the slope of the flux graph, not its height.' }),
  mcq(2, 'sliding rod', r`A rod is pulled at constant speed on rails with a resistor. The mechanical power supplied equals`, 'the electrical power dissipated in the resistor', ['zero', 'twice the power dissipated', 'the rate of change of the magnetic field'],
    r`At constant speed the applied force equals the magnetic braking force $BIl$. The power supplied $Fv = BIlv = I\mathcal E = I^2R$ is all converted to heat in the circuit.`),
];
items.push(
  // ---------- Level 3 ----------
  nat(3, 'rod with internal resistance', r`A rod of length 0.4 m and resistance $1\ \Omega$ slides at $6\ \mathrm{m\,s^{-1}}$ on frictionless rails in a perpendicular field of 0.5 T. The rails (no resistance) are joined by a $3\ \Omega$ resistor. Find the potential difference across the $3\ \Omega$ resistor (in V, 2 decimals).`, 0.5 * 0.4 * 6 / 4 * 3, 0.01, 2,
    r`$\mathcal E = Blv = 0.5\times0.4\times6 = 1.2$ V. Total resistance $= 1 + 3 = 4\ \Omega$, so $I = 0.3$ A. The voltage across the resistor $= IR = 0.3\times3 = 0.90$ V. (The rod acts as a battery with internal resistance $1\ \Omega$.)`, { unit: 'V', trap: 'The emf is shared between the rod and the resistor.' }),
  nat(3, 'power in a sliding rod', r`For the same arrangement (0.4 m, $6\ \mathrm{m\,s^{-1}}$, 0.5 T, total circuit resistance $4\ \Omega$), find the mechanical power needed to keep the rod moving at constant speed (in W, 2 decimals).`, (0.5 * 0.4 * 6) ** 2 / 4, 0.005, 2,
    r`$P = \dfrac{\mathcal E^2}{R} = \dfrac{1.2^2}{4} = 0.36$ W. Check: $F = BIl = 0.5\times0.3\times0.4 = 0.06$ N and $Fv = 0.06\times6 = 0.36$ W.`, { unit: 'W' }),
  nat(3, 'terminal velocity', r`A rod of mass 50 g and length 0.5 m slides down smooth vertical rails in a horizontal field of 0.4 T. The total resistance of the circuit is $0.5\ \Omega$. Find the terminal speed (in $\mathrm{m\,s^{-1}}$, 2 decimals; $g = 9.8\ \mathrm{m\,s^{-2}}$).`, 0.05 * 9.8 * 0.5 / (0.4 ** 2 * 0.5 ** 2), 0.01, 3,
    r`At terminal speed the magnetic force balances the weight: $\dfrac{B^2l^2v}{R} = mg$. $v = \dfrac{mgR}{B^2l^2} = \dfrac{0.05\times9.8\times0.5}{0.16\times0.25} = 6.125\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'sliding on an incline', r`A rod of mass 0.2 kg and length 0.5 m slides on smooth rails inclined at $30^\circ$ to the horizontal, with a field of 1 T perpendicular to the incline. The circuit resistance is $2\ \Omega$. Find the terminal speed (in $\mathrm{m\,s^{-1}}$, 2 decimals; $g = 9.8$).`, 0.2 * 9.8 * 2 * 0.5 / (1 * 0.25), 0.02, 2,
    r`Along the incline: $mg\sin30^\circ = \dfrac{B^2l^2v}{R}$ (the field is perpendicular to the incline, so the force on the rod is up the slope with the full $BIl$). $v = \dfrac{mgR\sin30^\circ}{B^2l^2} = \dfrac{0.2\times9.8\times2\times0.5}{1\times0.25} = 7.84\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'With a vertical field, a cos² would appear. Here B is perpendicular to the plane.' }),
  nat(3, 'loop entering a field', r`A square loop of side 10 cm and resistance $0.5\ \Omega$ is pulled at $2\ \mathrm{m\,s^{-1}}$ into a region of uniform field 0.5 T perpendicular to its plane. While it is entering, find the force needed (in mN).`, 0.5 * (0.5 * 0.1 * 2) / 0.5 * 0.1 * 1e3, 0.2, 1,
    r`Only the leading side cuts field lines: $\mathcal E = Blv = 0.5\times0.1\times2 = 0.1$ V and $I = 0.1/0.5 = 0.2$ A. Force on that side $= BIl = 0.5\times0.2\times0.1 = 0.01$ N $= 10$ mN. (The forces on the other two sides cancel.)`, { unit: 'mN' }),
  nat(3, 'rotating coil', r`A coil of 50 turns and area $0.04\ \mathrm{m^2}$ rotates at 50 Hz in a uniform field of 0.5 T. The emf is zero at $t = 0$. Find the emf at $t = 1/600$ s (in V, nearest whole number).`, 50 * 0.5 * 0.04 * 2 * Math.PI * 50 * Math.sin(2 * Math.PI * 50 / 600), 1, 0,
    r`$\mathcal E_0 = NBA\omega = 50\times0.5\times0.04\times100\pi = 314$ V. The angle is $\omega t = 100\pi/600 = \pi/6 = 30^\circ$. $\mathcal E = \mathcal E_0\sin30^\circ = 157$ V.`, { unit: 'V' }),
  nat(3, 'average emf of a generator', r`A generator has a peak emf of 100 V. Find the average emf over a half cycle (in V, 1 decimal).`, 100 * 2 / Math.PI, 0.2, 1,
    r`$\bar{\mathcal E} = \dfrac{1}{\pi}\int_0^\pi\mathcal E_0\sin\theta\,d\theta = \dfrac{2\mathcal E_0}{\pi} = 63.7$ V. (Over a full cycle the average is zero, and the rms value is $\mathcal E_0/\sqrt2 = 70.7$ V.)`, { unit: 'V', trap: 'Average over a half cycle, not the rms value.' }),
  nat(3, 'induced electric field', r`A long solenoid of radius 10 cm has a field along its axis that increases at $0.02\ \mathrm{T\,s^{-1}}$. Find the magnitude of the induced electric field at 5 cm from the axis (in $\mathrm{mV\,m^{-1}}$, 2 decimals).`, 0.05 / 2 * 0.02 * 1e3, 0.005, 2,
    r`Apply $\oint\vec E\cdot d\vec l = -d\Phi/dt$ to a circle of radius $r < R$: $E\cdot2\pi r = \pi r^2\dfrac{dB}{dt}$, so $E = \dfrac r2\dfrac{dB}{dt} = \dfrac{0.05}{2}\times0.02 = 5\times10^{-4}\ \mathrm{V\,m^{-1}} = 0.50\ \mathrm{mV\,m^{-1}}$.`, { unit: 'mV/m' }),
  nat(3, 'induced electric field outside', r`A long solenoid of radius 10 cm has a field along its axis that increases at $0.03\ \mathrm{T\,s^{-1}}$. Find the induced electric field at 20 cm from the axis (in $\mathrm{mV\,m^{-1}}$, 2 decimals).`, 0.01 / (2 * 0.2) * 0.03 * 1e3, 0.005, 2,
    r`Outside, the flux is only $\pi R^2B$: $E\cdot2\pi r = \pi R^2\dfrac{dB}{dt}$, so $E = \dfrac{R^2}{2r}\dfrac{dB}{dt} = \dfrac{0.01}{0.4}\times0.03 = 7.5\times10^{-4}\ \mathrm{V\,m^{-1}} = 0.75\ \mathrm{mV\,m^{-1}}$. There is an electric field outside even though there is no magnetic field there.`, { unit: 'mV/m', trap: 'Outside, the flux stops at the solenoid radius.' }),
  nat(3, 'loop in a changing field', r`A circular loop of radius 5 cm is in a field $B = 2\sin(100t)$ (in tesla, $t$ in s) perpendicular to its plane. Find the magnitude of the emf at $t = 0$ (in V, 2 decimals).`, Math.PI * 0.0025 * 200, 0.01, 2,
    r`$\Phi = \pi r^2B = \pi(0.05)^2\times2\sin(100t)$. $\mathcal E = \left|\dfrac{d\Phi}{dt}\right| = \pi\times0.0025\times200\cos(100t)$. At $t = 0$: $\mathcal E = 1.57$ V (the flux is zero then, and the emf is at its peak).`, { unit: 'V' }),
  nat(3, 'mutual inductance of loops', r`A small loop of radius 1 cm is placed at the centre of a large loop of radius 20 cm, coplanar and concentric. Find the mutual inductance (in nH, 3 decimals).`, MU * Math.PI * 1e-4 / (2 * 0.2) * 1e9, 0.01, 3,
    r`The field at the centre of the large loop is $B = \dfrac{\mu_0I}{2R}$, nearly uniform over the small loop. Flux $= B\pi r^2$. $M = \dfrac{\mu_0\pi r^2}{2R} = \dfrac{4\pi\times10^{-7}\times\pi\times10^{-4}}{0.4} = 9.87\times10^{-10}$ H $= 0.987$ nH.`, { unit: 'nH' }),
  nat(3, 'mutual induction emf', r`The mutual inductance of two coils is 0.2 H. The current in the primary changes at $10\ \mathrm{A\,s^{-1}}$. Find the emf induced in the secondary (in V).`, 0.2 * 10, 0.01, 1,
    r`$|\mathcal E_2| = M\left|\dfrac{dI_1}{dt}\right| = 0.2\times10 = 2$ V.`, { unit: 'V' }),
  nat(3, 'coupled inductors', r`Two coils of self-inductance 2 H and 3 H have a mutual inductance of 1 H. They are connected in series so that their fluxes add. Find the equivalent inductance (in H).`, 2 + 3 + 2 * 1, 0.01, 1,
    r`$L_{eq} = L_1 + L_2 + 2M = 2 + 3 + 2 = 7$ H. With the fluxes opposing, it would be $L_1 + L_2 - 2M = 3$ H.`, { unit: 'H' }),
  nat(3, 'energy density', r`Find the energy density of a magnetic field of 0.5 T in vacuum (in $\mathrm{kJ\,m^{-3}}$, 1 decimal).`, 0.25 / (2 * MU) / 1e3, 0.2, 1,
    r`$u = \dfrac{B^2}{2\mu_0} = \dfrac{0.25}{2\times4\pi\times10^{-7}} = 9.95\times10^{4}\ \mathrm{J\,m^{-3}} = 99.5\ \mathrm{kJ\,m^{-3}}$.`, { unit: 'kJ/m³' }),
  nat(3, 'LR decay', r`A current of 2 A flows in a coil of $L = 1$ H and $R = 5\ \Omega$ when the battery is removed and the coil is short-circuited. Find the current after 0.2 s (in A, 3 decimals).`, 2 * Math.exp(-1), 0.003, 3,
    r`$\tau = L/R = 0.2$ s. $I = I_0e^{-t/\tau} = 2e^{-1} = 0.736$ A.`, { unit: 'A' }),
  nat(3, 'voltage across an inductor', r`A 10 V battery, a $5\ \Omega$ resistor and a 1 H inductor are in series, switched on at $t = 0$. Find the voltage across the inductor at $t = 0.2$ s (in V, 2 decimals).`, 10 * Math.exp(-1), 0.01, 2,
    r`$\tau = 0.2$ s. At time $t$ the inductor voltage is $\mathcal E e^{-t/\tau}$ (since $V_L = \mathcal E - IR$). At $t = \tau$: $10e^{-1} = 3.68$ V.`, { unit: 'V' }),
  nat(3, 'time to reach half the final current', r`In an LR circuit with $L = 0.5$ H and $R = 5\ \Omega$, how long does the current take to reach half of its final value (in ms, 1 decimal)?`, 0.1 * Math.LN2 * 1e3, 0.2, 1,
    r`$\tau = 0.1$ s. $\tfrac12 = 1 - e^{-t/\tau}$ gives $e^{-t/\tau} = \tfrac12$ and $t = \tau\ln2 = 0.0693$ s $= 69.3$ ms.`, { unit: 'ms' }),
  nat(3, 'initial rate of rise', r`A 12 V battery is connected across a coil of $L = 3$ H and $R = 6\ \Omega$ at $t = 0$. Find $dI/dt$ at that instant (in $\mathrm{A\,s^{-1}}$).`, 12 / 3, 0.01, 1,
    r`At $t = 0$ the current is zero, so the whole emf is across the inductor: $L\dfrac{dI}{dt} = 12$ and $\dfrac{dI}{dt} = 4\ \mathrm{A\,s^{-1}}$.`, { unit: 'A/s' }),
  nat(3, 'heat in a decaying current', r`A coil of 0.4 H carries 5 A. The battery is removed and the coil discharges through its own resistance. How much heat is produced in total (in J)?`, 0.5 * 0.4 * 25, 0.01, 1,
    r`All the stored magnetic energy $\tfrac12LI^2 = \tfrac12\times0.4\times25 = 5$ J becomes heat in the resistance.`, { unit: 'J' }),
  nat(3, 'induced emf when a switch opens', r`A coil of 2 H carrying 3 A is opened in 1 ms (the current falls to zero at a steady rate). Find the average induced emf (in V).`, 2 * 3 / 1e-3, 1, 0,
    r`$|\mathcal E| = L\dfrac{\Delta I}{\Delta t} = 2\times\dfrac{3}{10^{-3}} = 6000$ V. This large emf is why sparks appear at a switch that breaks an inductive circuit.`, { unit: 'V' }),
  nat(3, 'inclined rod', r`A rod of length 0.5 m moves at $10\ \mathrm{m\,s^{-1}}$ in a field of 0.4 T perpendicular to the plane containing the rod and the velocity. The rod makes $30^\circ$ with the direction of its velocity. Find the emf between its ends (in V, 2 decimals).`, 0.4 * 10 * 0.5 * 0.5, 0.01, 2,
    r`Only the component of the length perpendicular to the velocity counts: $l_\perp = l\sin30^\circ = 0.25$ m. $\mathcal E = Bvl_\perp = 0.4\times10\times0.25 = 1.00$ V.`, { unit: 'V', trap: 'Use the length perpendicular to the velocity.' }),
  nat(3, 'shrinking loop', r`A circular loop of radius 10 cm shrinks at $2\ \mathrm{cm\,s^{-1}}$ in a field of 0.5 T perpendicular to its plane. Find the induced emf at that instant (in mV, 2 decimals).`, 0.5 * 2 * Math.PI * 0.1 * 0.02 * 1e3, 0.02, 2,
    r`$\Phi = B\pi r^2$, so $\mathcal E = B\cdot2\pi r\dfrac{dr}{dt} = 0.5\times2\pi\times0.1\times0.02 = 6.28\times10^{-3}$ V $= 6.28$ mV.`, { unit: 'mV' }),
  nat(3, 'induced charge', r`A coil of area $0.05\ \mathrm{m^2}$ and resistance $4\ \Omega$ (single turn) is in a field of 0.8 T perpendicular to it. The field is switched off. Find the charge that flows (in mC).`, 0.8 * 0.05 / 4 * 1e3, 0.1, 1,
    r`$Q = \dfrac{\Delta\Phi}{R} = \dfrac{0.8\times0.05}{4} = 0.010$ C $= 10$ mC. It does not depend on how quickly the field is switched off.`, { unit: 'mC' }),
  nat(3, 'energy of a solenoid', r`A solenoid of 500 turns, length 0.25 m and area $4\times10^{-4}\ \mathrm{m^2}$ carries 2 A. Find the energy stored (in mJ, 2 decimals).`, 0.5 * (MU * 250000 * 4e-4 / 0.25) * 4 * 1e3, 0.01, 2,
    r`$L = \dfrac{\mu_0N^2A}{l} = \dfrac{4\pi\times10^{-7}\times250000\times4\times10^{-4}}{0.25} = 5.03\times10^{-4}$ H. $U = \tfrac12LI^2 = \tfrac12\times5.03\times10^{-4}\times4 = 1.01\times10^{-3}$ J $= 1.01$ mJ.`, { unit: 'mJ' }),
  mcq(3, 'rod rotating about its midpoint', r`A rod of length $l$ rotates at angular speed $\omega$ about its midpoint in a field $B$ perpendicular to its plane. The potential difference between one end and the other is`, 'zero', [r`$\tfrac12B\omega l^2$`, r`$B\omega l^2$`, r`$\tfrac18B\omega l^2$`],
    r`Between the midpoint and either end the emf is $\tfrac12B\omega(l/2)^2 = \tfrac18B\omega l^2$, and both ends rise to the same potential relative to the centre. So the two ends are at the same potential.`, { trap: 'Each half has an emf; between the ends they cancel.' }),
  mcq(3, 'emf graph', r`A square loop moves at constant speed through a region of uniform field wider than the loop. The emf as a function of time (taking the entry as positive) is`, 'a constant while entering, zero while wholly inside, and the same size but reversed while leaving', ['a constant for the whole motion', 'zero while entering, and constant while leaving', 'increasing linearly all the time'],
    r`While entering, the area in the field grows steadily, so $\mathcal E = Blv$. When wholly inside, the flux is constant: $\mathcal E = 0$ (though the sides still have motional emfs, they cancel round the loop). While leaving, the area falls steadily, giving $-Blv$.`, { trap: 'The sides still have emfs inside the field, but the loop as a whole has none.' }),
  mcq(3, 'two coils', r`Two coils are placed close together. A battery is connected to coil 1 through a switch. At the moment the switch is closed, the induced current in coil 2 flows`, 'opposite in sense to the current in coil 1', ['in the same sense as the current in coil 1', 'only after the current in coil 1 is steady', 'nowhere, since coil 2 has no battery'],
    r`Closing the switch makes the flux of coil 1 grow. Coil 2 opposes the growth by creating a flux the other way: its current is in the opposite sense. When the switch is opened, the sense is the same as coil 1's (to oppose the fall).`),
  mcq(3, 'conserved charge', r`When a magnet is moved at different speeds towards a closed coil, the total charge that flows through the coil in the whole process`, 'does not depend on the speed', ['is larger for a faster motion', 'is smaller for a faster motion', 'is zero'],
    r`$Q = \int I\,dt = \dfrac{1}{R}\int|d\Phi| = \dfrac{\Delta\Phi}{R}$. The total charge depends only on the change of flux and the resistance. Faster motion gives a larger peak current for a shorter time, the same charge.`),
  mcq(3, 'bulb and inductor', r`A bulb is in parallel with a coil of large inductance. They are joined through a switch to a battery, and the coil's resistance is much smaller than the bulb's. After the switch has been closed for a long time it is opened. The bulb then`, 'flashes brightly before fading', ['goes out at once', 'stays at the same brightness for a long time', 'does not change at all'],
    r`In steady state most of the current flows through the low-resistance coil. When the supply is cut, the coil's current cannot stop at once; it continues through the bulb in the opposite direction. This is much larger than the bulb's earlier current, so the bulb flashes before the energy is used up.`, { trap: 'It flashes only if the coil carried more current than the bulb did before.' }),
  asrt(3, "Lenz's law", r`The direction of an induced current is always such as to oppose the change that produces it.`, r`This is a consequence of the law of conservation of energy.`, 0,
    r`If the induced current aided the change, the effect would grow without any outside work, creating energy. So it must oppose. R explains A.`),
  asrt(3, 'induced emf', r`An emf can be induced in an open coil.`, r`The induced emf depends on the rate of change of flux through the coil, whether or not the circuit is closed.`, 0,
    r`With a changing flux the emf exists; only the current needs a closed path. So an open coil develops an emf across its ends. R is the reason.`),
  asrt(3, 'self-induction', r`A coil with a large number of turns has a large self-inductance.`, r`The self-inductance of a coil is directly proportional to its number of turns.`, 2,
    r`A is true, but R is false: $L = \dfrac{\mu_0N^2A}{l}$, so $L\propto N^2$. The field grows with $N$ and so does the number of turns that link it.`, { trap: 'It is N squared, not N.' }),
  stm(3, 'eddy currents', r`Eddy currents can be used to heat a metal.`, r`Eddy currents in a solid metal piece moving in a magnetic field oppose its motion.`, 0,
    r`Both are true: induction furnaces heat metal by eddy currents from high-frequency fields, and magnetic braking uses the opposing force.`),
  stm(3, 'self-induction', r`The induced emf in an inductor is proportional to the current through it.`, r`The induced emf in an inductor is proportional to the rate of change of current through it.`, 3,
    r`$\mathcal E = -L\,dI/dt$. A steady current of any size gives no emf, so I is false and II is true.`),
  stm(3, 'induced electric field', r`The electric field induced by a changing magnetic field is conservative.`, r`The line integral of the induced electric field round a closed loop is not zero.`, 3,
    r`$\oint\vec E\cdot d\vec l = -d\Phi/dt\neq0$: this field is non-conservative, so I is false and II is true.`),
  msq(3, 'sliding rod', r`A rod slides at constant speed on rails with a resistor in a perpendicular field. Which are correct?`, [r`The induced current is proportional to the speed.`, r`The magnetic force on the rod is proportional to the speed.`, r`The power dissipated is proportional to the speed.`, r`The applied force is proportional to the speed.`], [0, 1, 3],
    r`$I = Blv/R\propto v$, $F = BIl = B^2l^2v/R\propto v$, and the applied force equals the magnetic force. The power $P = Fv\propto v^2$, not $v$.`),
  msq(3, 'induced emf in a coil', r`In which cases is an emf induced in a flat coil (area $A$, normal at angle $\theta$ to a field $B$)?`, [r`$B$ changes with time.`, r`The area is changed.`, r`The coil rotates about a diameter, perpendicular to the field.`, r`The coil moves in a uniform field without turning or changing shape.`], [0, 1, 2],
    r`$\Phi = BA\cos\theta$ changes in the first three. In the last, nothing changes: no emf (the sides have motional emfs that cancel round the loop).`),
  msq(3, 'inductors', r`Which are correct for an ideal inductor $L$ carrying current $I$?`, [r`The energy stored is $\tfrac12LI^2$.`, r`The current cannot change instantly.`, r`The emf across it is $L\,dI/dt$ in magnitude.`, r`It dissipates energy as heat.`], [0, 1, 2],
    r`An ideal inductor has no resistance and stores energy in its field; it does not dissipate any.`),
  msq(3, 'eddy currents', r`Which are applications or effects of eddy currents?`, [r`Electromagnetic damping in a galvanometer`, r`Induction furnace`, r`Heating of transformer cores`, r`Working of a battery`], [0, 1, 2],
    r`All the first three are due to eddy currents. A battery works by chemical energy.`),
);
items.push(
  // ---------- Level 4 ----------
  nat(4, 'decay of speed', r`A rod of mass 0.1 kg and length 0.4 m moves at $3\ \mathrm{m\,s^{-1}}$ on frictionless horizontal rails in a field of 0.5 T. The rails are joined by a $0.4\ \Omega$ resistor (all else negligible) and no force is applied. Find its speed after 1 s (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, 3 * Math.exp(-1), 0.01, 2,
    r`$m\dfrac{dv}{dt} = -\dfrac{B^2l^2}{R}v$. The constant is $\dfrac{B^2l^2}{mR} = \dfrac{0.25\times0.16}{0.1\times0.4} = 1\ \mathrm{s^{-1}}$. So $v = v_0e^{-t} = 3e^{-1} = 1.10\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(4, 'stopping distance', r`For the rod in the previous question (0.1 kg, 0.4 m, 0.5 T, $0.4\ \Omega$, initial speed $3\ \mathrm{m\,s^{-1}}$, no applied force), find the total distance it travels before coming to rest (in m, 2 decimals).`, 0.1 * 0.4 * 3 / (0.25 * 0.16), 0.02, 2,
    r`Use $m\dfrac{dv}{dt} = m v\dfrac{dv}{dx} = -\dfrac{B^2l^2}{R}v$, so $m\,dv = -\dfrac{B^2l^2}{R}dx$. Integrating from $v_0$ to 0: $x = \dfrac{mRv_0}{B^2l^2} = \dfrac{0.1\times0.4\times3}{0.04} = 3.00$ m. (It takes forever in time but covers a finite distance.)`, { unit: 'm', trap: 'The exponential never reaches zero in time, but the distance is finite.' }),
  nat(4, 'rod on an incline with a vertical field', r`A rod of mass 0.1 kg and length 0.4 m slides down smooth rails inclined at $45^\circ$ in a vertical field of 0.5 T. The circuit resistance is $0.2\ \Omega$. Find the terminal speed along the rails (in $\mathrm{m\,s^{-1}}$, 2 decimals; $g = 9.8$).`, 0.1 * 9.8 * 0.2 * Math.sin(Math.PI / 4) / (0.25 * 0.16 * 0.5), 0.03, 2,
    r`The rod moves along the slope with speed $v$; its velocity component perpendicular to the vertical field is $v\cos45^\circ$, so $\mathcal E = Blv\cos45^\circ$ and $I = \mathcal E/R$. The force on the rod is horizontal, $BIl$, and its component along the slope is $BIl\cos45^\circ$. Balance along the slope: $mg\sin45^\circ = \dfrac{B^2l^2v\cos^2\theta}{R}$. $v = \dfrac{mgR\sin\theta}{B^2l^2\cos^2\theta} = \dfrac{0.1\times9.8\times0.2\times0.7071}{0.25\times0.16\times0.5} = 6.93\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'A vertical field gives a cos² in the denominator.' }),
  nat(4, 'heat in a loop entering a field', r`A square loop of side 10 cm and resistance $0.5\ \Omega$ is pulled at $2\ \mathrm{m\,s^{-1}}$ into a region of field 0.5 T. Find the heat produced while it moves in completely (in mJ, 2 decimals).`, 0.01 * 0.1 * 1e3, 0.02, 2,
    r`Force $= \dfrac{B^2l^2v}{R} = \dfrac{0.25\times0.01\times2}{0.5} = 0.01$ N over a distance of 0.1 m: $W = 1.0\times10^{-3}$ J $= 1.00$ mJ. Check: $I = 0.2$ A, time $= 0.05$ s, $I^2Rt = 0.04\times0.5\times0.05 = 1$ mJ.`, { unit: 'mJ' }),
  nat(4, 'LR circuit with a parallel resistor', r`A 12 V battery (no internal resistance) is connected to a $6\ \Omega$ resistor in series with a parallel combination of a 1 H inductor and a $3\ \Omega$ resistor. Find the battery current just after the switch is closed (in A, 2 decimals).`, 12 / 9, 0.01, 2,
    r`At $t = 0$ the inductor carries no current and acts like a break in its branch. All the current goes through the $3\ \Omega$ resistor: $I = \dfrac{12}{6 + 3} = 1.33$ A. (After a long time the inductor acts as a wire and shorts the $3\ \Omega$ resistor: $I = 12/6 = 2$ A.)`, { unit: 'A' }),
  nat(4, 'mutual inductance of a coil around a solenoid', r`A long solenoid of radius 2 cm has 1000 turns per metre. A coil of 200 turns and radius 5 cm is wound round it near its middle. Find the mutual inductance (in mH, 3 decimals).`, MU * 1000 * 200 * Math.PI * 4e-4 * 1e3, 0.003, 3,
    r`The flux of the solenoid is confined to its own cross-section, $\pi(0.02)^2$, not the larger area of the coil. $M = \mu_0nN_2A_{sol} = 4\pi\times10^{-7}\times1000\times200\times\pi\times4\times10^{-4} = 3.16\times10^{-4}$ H $= 0.316$ mH.`, { unit: 'mH', trap: 'Use the area of the solenoid, where the field is, not the area of the outer coil.' }),
  nat(4, 'inductance of a toroid', r`A toroid of 1000 turns has a mean radius of 10 cm and a core cross-section of $4\ \mathrm{cm^2}$. Find its self-inductance (in mH, 2 decimals).`, 2e-7 * 1e6 * 4e-4 / 0.1 * 1e3, 0.01, 2,
    r`$B = \dfrac{\mu_0NI}{2\pi r}$, so $L = \dfrac{N\Phi}{I} = \dfrac{\mu_0N^2A}{2\pi r} = \dfrac{2\times10^{-7}\times10^{6}\times4\times10^{-4}}{0.1} = 8\times10^{-4}$ H $= 0.80$ mH.`, { unit: 'mH' }),
  nat(4, 'rotating rod with a load', r`A rod of length 0.5 m rotates at $20\ \mathrm{rad\,s^{-1}}$ about one end, with its other end sliding on a conducting ring, in a perpendicular field of 0.5 T. A $0.5\ \Omega$ resistor joins the pivot and the ring. Find the torque needed to keep it turning at constant speed (in mN m, nearest whole number).`, (0.5 * 0.5 * 20 * 0.25) ** 2 / 0.5 / 20 * 1e3, 1, 0,
    r`$\mathcal E = \tfrac12B\omega l^2 = \tfrac12\times0.5\times20\times0.25 = 1.25$ V. Power $= \mathcal E^2/R = 3.125$ W. Torque $= P/\omega = 3.125/20 = 0.156$ N m $= 156$ mN m.`, { unit: 'mN m' }),
  nat(4, 'rate of energy storage', r`A 10 V battery drives a series circuit of a $5\ \Omega$ resistor and a 1 H inductor, switched on at $t = 0$. At $t = 0.2$ s ($= L/R$), find the rate at which energy is being stored in the inductor (in W, 2 decimals).`, 10 * Math.exp(-1) * 2 * (1 - Math.exp(-1)), 0.02, 2,
    r`$I = 2(1 - e^{-1}) = 1.264$ A and $V_L = 10e^{-1} = 3.679$ V. Power into the field $= V_LI = 3.679\times1.264 = 4.65$ W. (Heat in $R$: $I^2R = 7.99$ W. Sum $= 12.64$ W $= \mathcal EI$, the battery power.)`, { unit: 'W' }),
  nat(4, 'coupling coefficient', r`Two coils have $L_1 = 4$ H, $L_2 = 9$ H and a mutual inductance of 3 H. Find the coefficient of coupling $k = M/\sqrt{L_1L_2}$.`, 3 / 6, 0.005, 2,
    r`$k = \dfrac{M}{\sqrt{L_1L_2}} = \dfrac{3}{\sqrt{36}} = 0.50$. It can never exceed 1; 1 means all the flux of one coil links the other.`, { unit: '' }),
  nat(4, 'falling loop', r`A square loop of side 10 cm, mass 20 g and resistance $0.01\ \Omega$ falls with its horizontal lower side inside a large region of horizontal field 0.5 T, the upper side being above the region. Find the speed at which it falls at constant speed (in $\mathrm{m\,s^{-1}}$, 3 decimals; $g = 9.8$).`, 0.02 * 9.8 * 0.01 / (0.25 * 0.01), 0.005, 3,
    r`Only the lower side cuts the field: $\mathcal E = Bav$. Force $= \dfrac{B^2a^2v}{R} = mg$. $v = \dfrac{mgR}{B^2a^2} = \dfrac{0.02\times9.8\times0.01}{0.25\times0.01} = 0.784\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(4, 'loop passing through a field', r`A square loop of side 10 cm and resistance $0.5\ \Omega$ crosses completely a region of field 0.5 T that is wider than the loop, at a steady $2\ \mathrm{m\,s^{-1}}$. Find the total heat produced (in mJ, 2 decimals).`, 2 * 0.01 * 0.1 * 1e3, 0.02, 2,
    r`Heat is produced only while the loop is entering and leaving, each over a distance of 0.1 m with force 0.01 N: $2\times0.01\times0.1 = 2.0\times10^{-3}$ J $= 2.00$ mJ. While fully inside the field there is no current.`, { unit: 'mJ' }),
  mcq(4, 'heat and speed', r`A loop is pulled out of a field through the same distance, first at speed $v$ and then at $2v$. The heat produced is in the ratio (slower : faster)`, '1 : 2', ['1 : 1', '1 : 4', '2 : 1'],
    r`$F = \dfrac{B^2l^2v}{R}\propto v$, and the work $Fx\propto v$ for the same distance. Equivalently, the power goes as $v^2$ but the time goes as $1/v$. So the faster pull gives twice the heat.`, { trap: 'Power is four times larger but acts for half the time.' }),
  mcq(4, 'tendency of a loop', r`A loop of wire free to change shape lies in a magnetic field perpendicular to its plane. The field is increasing. The loop tends to`, 'shrink in area', ['expand in area', 'stay unchanged in shape', 'rotate about its diameter in the plane'],
    r`By Lenz's law the loop opposes the increase of flux, and one way to do so is to reduce its area. The forces on the induced current in the field act inward on the loop.`),
  mcq(4, 'jumping ring', r`An aluminium ring is placed on the top of a vertical iron core of a solenoid carrying a rapidly increasing current. The ring jumps up because`, 'the induced current in the ring is opposite to that in the coil, so they repel', ['the ring is magnetised by the core', 'the current in the ring is in the same direction as in the coil', 'the ring is heated'],
    r`The flux through the ring increases, so the induced current opposes the coil's current. Opposite currents repel, so the ring is thrown upward. (If the ring has a cut, there is no current and no jump.)`),
  mcq(4, 'induced electric field', r`A uniform field is increasing in a circular region of radius $R$. The induced electric field at distance $r$ from the centre, for $r > R$, varies as`, r`$1/r$`, [r`$r$`, r`$1/r^2$`, r`it is zero`],
    r`Outside: $E\cdot2\pi r = \pi R^2\dfrac{dB}{dt}$, so $E = \dfrac{R^2}{2r}\dfrac{dB}{dt}\propto1/r$. Inside it grows linearly, $\propto r$. The maximum is at $r = R$.`),
  mcq(4, 'graph of an LR circuit', r`In an LR circuit switched on at $t = 0$, the graph of the voltage across the inductor against time is`, 'an exponential decay from $\\mathcal E$ to zero', ['an exponential rise from zero to $\\mathcal E$', 'a straight line from $\\mathcal E$ to zero', 'constant at $\\mathcal E$'],
    r`$V_L = \mathcal E e^{-t/\tau}$: it begins at $\mathcal E$ (the inductor opposes the sudden change) and falls to zero as the current becomes steady. The voltage across the resistor rises as $\mathcal E(1 - e^{-t/\tau})$.`),
  mat(3, 'directions of induced current', 'm4', r`A conducting loop lies in the plane of the page. Match each change of the uniform field perpendicular to the page with the sense of the induced current.`, 'A-q, B-p, C-p, D-q', ['A-p, B-q, C-q, D-p', 'A-q, B-p, C-q, D-p', 'A-p, B-p, C-q, D-q'],
    r`The induced current opposes the change. Into the page, increasing: it must make a field out of the page, so anticlockwise (q). Into the page, decreasing: it keeps the flux going, field into the page, clockwise (p). Out of the page, increasing: the induced field is into the page, clockwise (p). Out of the page, decreasing: the induced field is out of the page, anticlockwise (q).`),
  mat(2, 'quantities and units', 'm1', r`Match each quantity with its unit.`, 'A-q, B-r, C-p, D-s', ['A-p, B-r, C-q, D-s', 'A-q, B-p, C-r, D-s', 'A-q, B-r, C-s, D-p'],
    r`Magnetic flux: weber (q). Self-inductance: henry (r). Emf: volt (p). Magnetic field: tesla (s). Note 1 H = 1 V s/A and 1 Wb = 1 V s.`),
  mat(3, 'emf formulas', 'm2', r`Match each situation with the emf induced.`, 'A-r, B-p, C-s, D-q', ['A-p, B-r, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-s, B-p, C-r, D-q'],
    r`A straight rod moving across a field: $Blv$ (r). A rod rotating about one end: $\tfrac12B\omega l^2$ (p). A coil of $N$ turns rotating in a field: peak $NBA\omega$ (s). An inductor: $L\,dI/dt$ in magnitude (q).`),
  mat(4, 'LR circuit values', 'm3', r`A battery of emf $\mathcal E$ is switched on to a series LR circuit. Match each quantity with its value.`, 'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s', 'A-s, B-p, C-q, D-r'],
    r`At $t = 0$ the current is zero (r). At $t = 0$ the whole emf is across the inductor, so $V_L = \mathcal E$ (p). After a long time the current is $\mathcal E/R$ (q). At $t = \tau$ the current is $0.63\mathcal E/R$ (s).`),

  // passages
  pas(2, 'motional emf', 'p1', r`Find the emf induced in the rod (in V, 2 decimals).`, 0.4 * 0.5 * 5, 0.01, 2,
    r`$\mathcal E = Blv = 0.4\times0.5\times5 = 1.00$ V.`, { unit: 'V' }),
  pas(3, 'power in a sliding rod', 'p1', r`Find the mechanical power the agent supplies to keep the speed steady (in W, 2 decimals).`, 1 / 2, 0.005, 2,
    r`$I = 1/2 = 0.5$ A. The force on the rod is $BIl = 0.4\times0.5\times0.5 = 0.1$ N, so $P = Fv = 0.1\times5 = 0.50$ W. This equals $\mathcal E^2/R = 1/2 = 0.5$ W.`, { unit: 'W' }),
  pas(4, 'decay of speed', 'p1', r`The agent lets go. Find the rod's initial deceleration (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, 0.1 / 0.2, 0.01, 2,
    r`The braking force is still $0.1$ N, so $a = F/m = 0.1/0.2 = 0.50\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  pas(4, 'stopping distance', 'p1', r`Find the distance the rod travels before it stops (in m).`, 0.2 * 2 * 5 / (0.16 * 0.25), 0.5, 1,
    r`$x = \dfrac{mRv_0}{B^2l^2} = \dfrac{0.2\times2\times5}{0.16\times0.25} = 50$ m.`, { unit: 'm' }),
  pas(3, 'mutual inductance', 'p2', r`Find the mutual inductance of the two coils (in $\mu$H, 1 decimal).`, MU * 400 * 100 * Math.PI * 4e-4 * 1e6, 0.2, 1,
    r`$M = \mu_0nN_2A = 4\pi\times10^{-7}\times400\times100\times\pi\times4\times10^{-4} = 6.32\times10^{-5}$ H $= 63.2\ \mu$H.`, { unit: 'μH' }),
  pas(3, 'induced emf', 'p2', r`The solenoid current changes at $5\ \mathrm{A\,s^{-1}}$. Find the emf induced in the outer coil (in mV, 3 decimals).`, MU * 400 * 100 * Math.PI * 4e-4 * 5 * 1e3, 0.003, 3,
    r`$\mathcal E = M\dfrac{dI}{dt} = 6.32\times10^{-5}\times5 = 3.16\times10^{-4}$ V $= 0.316$ mV.`, { unit: 'mV' }),
  pas(4, 'self-inductance', 'p2', r`Find the energy stored in the solenoid when it carries 2 A (in $\mu$J, 1 decimal).`, 0.5 * (MU * 200 * 200 * Math.PI * 4e-4 / 0.5) * 4 * 1e6, 0.4, 1,
    r`$L = \dfrac{\mu_0N^2A}{l} = \dfrac{4\pi\times10^{-7}\times40000\times1.257\times10^{-3}}{0.5} = 1.263\times10^{-4}$ H. $U = \tfrac12LI^2 = \tfrac12\times1.263\times10^{-4}\times4 = 2.53\times10^{-4}$ J $= 252.7\ \mu$J.`, { unit: 'μJ' }),
  pas(2, 'time constant', 'p3', r`Find the time constant of the circuit (in s, 2 decimals).`, 0.5, 0.005, 2,
    r`$\tau = L/R = 2/4 = 0.50$ s.`, { unit: 's' }),
  pas(3, 'growth of current', 'p3', r`Find the current at $t = 0.5$ s (in A, 2 decimals).`, 3 * (1 - Math.exp(-1)), 0.01, 2,
    r`$I_\infty = 12/4 = 3$ A. At $t = \tau$: $I = 3(1 - e^{-1}) = 1.90$ A.`, { unit: 'A' }),
  pas(3, 'energy in the inductor', 'p3', r`Find the energy stored in the inductor when the current is steady (in J).`, 9, 0.05, 1,
    r`$U = \tfrac12LI^2 = \tfrac12\times2\times3^2 = 9$ J.`, { unit: 'J' }),
  pas(4, 'rate of change of current', 'p3', r`Find $dI/dt$ at $t = 0.5$ s (in $\mathrm{A\,s^{-1}}$, 2 decimals).`, 6 * Math.exp(-1), 0.01, 2,
    r`$\dfrac{dI}{dt} = \dfrac{\mathcal E}{L}e^{-t/\tau} = 6e^{-1} = 2.21\ \mathrm{A\,s^{-1}}$.`, { unit: 'A/s' }),
  pas(4, 'time to reach 90 percent', 'p3', r`How long does the current take to reach 90 % of its final value (in s, 2 decimals)?`, 0.5 * Math.log(10), 0.01, 2,
    r`$1 - e^{-t/\tau} = 0.9$ gives $e^{-t/\tau} = 0.1$ and $t = \tau\ln10 = 0.5\times2.303 = 1.15$ s.`, { unit: 's' }),

  // assertion / statements / multi at L4
  asrt(4, 'self-induction', r`In an LR circuit connected to a battery, the current does not reach its final value instantly.`, r`The induced emf in the inductor opposes the growth of the current.`, 0,
    r`The back emf $L\,dI/dt$ opposes the battery while the current rises, so it takes a few time constants. R is the reason for A.`),
  asrt(4, 'motional emf', r`The potential difference between the ends of a rod rotating about its midpoint in a field perpendicular to the plane of rotation is zero.`, r`Each half of the rod develops an emf of $\tfrac18B\omega l^2$, and they act in opposite directions between the ends.`, 0,
    r`The ends are at the same potential, each at $\tfrac18B\omega l^2$ relative to the centre. R states this and explains A.`),
  asrt(4, 'eddy currents', r`Eddy currents are induced in a metal block moving into a magnetic field region, and they exert a force opposing its motion.`, r`The heat produced in the block comes from the kinetic energy of the block (or the work done by whatever pushes it).`, 1,
    r`Both statements are true. But R describes where the energy goes, not why the force exists. The force comes from Lenz's law: the induced currents oppose the change of flux.`),
  stm(4, 'emf of a loop', r`A square loop pulled through a uniform field region has an emf only while entering or leaving.`, r`When the loop is wholly inside the uniform field, none of its sides has a motional emf.`, 2,
    r`I is true. II is false: the two sides that move across the field lines each have a motional emf $Blv$, but they are equal and opposite round the loop, so the net emf is zero. The sides do have emfs.`, { trap: 'No current is not the same as no motional emf in a side.' }),
  stm(4, 'inductor and energy', r`The energy stored in an inductor is $\tfrac12LI^2$ and it is stored in its magnetic field.`, r`The energy density of the magnetic field is $B^2/2\mu_0$ in vacuum.`, 0,
    r`Both true. For example, a solenoid's $\tfrac12LI^2$ equals $\dfrac{B^2}{2\mu_0}\times$ volume.`),
  stm(4, 'mutual inductance', r`The mutual inductance of two coils depends on the current in them.`, r`$M_{12} = M_{21}$ for two coils in a linear medium.`, 3,
    r`I is false: $M$ is purely geometric (and material), independent of the currents. II is the reciprocity theorem and is true.`),
  msq(4, 'rod on rails', r`A rod of mass $m$ starts from rest on horizontal rails with a battery $\mathcal E$ and a resistor $R$ in series, in a perpendicular field $B$. Which are correct?`, [r`The initial force on the rod is $B\mathcal El/R$.`, r`The rod accelerates until $v = \mathcal E/Bl$.`, r`At the final speed the current is zero.`, r`At the final speed the current is $\mathcal E/R$.`], [0, 1, 2],
    r`Initially $I = \mathcal E/R$ and $F = BIl$. As the speed rises, the back emf $Blv$ cuts the net emf: $I = (\mathcal E - Blv)/R$. The speed saturates when the back emf equals $\mathcal E$: $v = \mathcal E/Bl$, and the current is zero. This is how a simple motor behaves.`),
  msq(4, 'LR circuit', r`In the series LR circuit with a battery, switched on at $t = 0$, which are correct?`, [r`The current at $t = \tau$ is about 63 % of the final value.`, r`The voltage across $L$ at $t = 0$ equals $\mathcal E$.`, r`The time constant is $L/R$.`, r`The final energy stored is $\mathcal E^2L/R$.`], [0, 1, 2],
    r`The final energy is $\tfrac12L(\mathcal E/R)^2 = \dfrac{L\mathcal E^2}{2R^2}$, not $\mathcal E^2L/R$.`),
  msq(4, 'Lenz law', r`A bar magnet falls vertically, along the axis of a horizontal copper ring, passing right through it. Which are correct?`, [r`While the magnet approaches the ring, the ring repels it.`, r`While the magnet is leaving, the ring attracts it.`, r`At some moment, the magnet's acceleration is greater than $g$.`, r`At the instant the middle of the magnet is in the plane of the ring, the induced current is zero.`], [0, 1, 3],
    r`The induced current always opposes the motion: it repels the approaching magnet and attracts the receding one, so the acceleration is below $g$ (never above). The flux through the ring is greatest when the magnet is centred in its plane, so $d\Phi/dt = 0$ there: no emf and no current, and at that instant the acceleration is exactly $g$.`, { trap: 'The emf is zero at the middle of the pass, where the flux is a maximum.' }),
  msq(4, 'generator', r`A coil rotates in a uniform field with constant angular speed. Which are correct?`, [r`The emf is maximum when the plane of the coil is parallel to the field.`, r`The emf is zero when the flux is maximum.`, r`The flux is maximum when the emf is maximum.`, r`The frequency of the emf is the same as the frequency of rotation.`], [0, 1, 3],
    r`$\Phi = \Phi_0\cos\omega t$ and $\mathcal E = \Phi_0\omega\sin\omega t$: the emf is maximum when the flux is zero, and vice versa. The emf has the frequency of rotation.`),
);
const groups = {
  m1: { title: 'Quantities and units',
    list1: ['A. Magnetic flux', 'B. Self-inductance', 'C. Emf', 'D. Magnetic field'],
    list2: ['p. volt', 'q. weber', 'r. henry', 's. tesla'] },
  m2: { title: 'Induced emf in different set-ups',
    list1: ['A. Straight rod of length $l$ moving at speed $v$ across a field $B$', 'B. Rod of length $l$ rotating at $\\omega$ about one end', 'C. Coil of $N$ turns, area $A$ rotating at $\\omega$ (peak value)', 'D. Inductor $L$ with current changing at rate $dI/dt$'],
    list2: [r`p. $\tfrac12B\omega l^2$`, r`q. $L\,dI/dt$`, r`r. $Blv$`, r`s. $NBA\omega$`] },
  m3: { title: 'An LR circuit on a battery',
    list1: ['A. Current at $t = 0$', 'B. Voltage across the inductor at $t = 0$', 'C. Current after a very long time', 'D. Current at $t = L/R$'],
    list2: [r`p. $\mathcal E$`, r`q. $\mathcal E/R$`, r`r. $0$`, r`s. $0.63\,\mathcal E/R$`] },
  m4: { title: 'Directions of induced current',
    list1: ['A. Field into the page, increasing', 'B. Field into the page, decreasing', 'C. Field out of the page, increasing', 'D. Field out of the page, decreasing'],
    list2: ['p. Clockwise', 'q. Anticlockwise'] },
  p1: { title: 'A sliding rod',
    passage: r`<p>A conducting rod of length 0.5 m and mass 0.2 kg slides without friction on horizontal rails joined by a $2\ \Omega$ resistor (the rod and rails have negligible resistance). A uniform vertical field of 0.4 T acts on the circuit. The rod is pulled at a steady $5\ \mathrm{m\,s^{-1}}$.</p>` },
  p2: { title: 'A coil wound on a solenoid',
    passage: r`<p>A long solenoid of length 0.5 m, radius 2 cm and 200 turns has a coil of 100 turns wound tightly around its middle. Use $\mu_0 = 4\pi\times10^{-7}\ \mathrm{T\,m\,A^{-1}}$.</p>` },
  p3: { title: 'An inductor on a battery',
    passage: r`<p>A battery of 12 V (no internal resistance), a $4\ \Omega$ resistor and a 2 H inductor of negligible resistance are connected in series and the switch is closed at $t = 0$.</p>` },
};

items.push(
  // ---------- Level 5 ----------
  nat(5, 'rod and capacitor', r`A rod of mass 0.1 kg and length 0.5 m slides on frictionless horizontal rails in a field of 0.4 T, with a 2 F capacitor connected across the rails (no resistance). A constant force of 2 N pulls the rod from rest. Find its constant acceleration (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, 2 / (0.1 + 0.16 * 0.25 * 2), 0.03, 2,
    r`The capacitor voltage equals the emf: $q = CBlv$. The current is $I = \dfrac{dq}{dt} = CBl\,a$. The magnetic force opposing the motion is $BIl = B^2l^2Ca$. Newton: $F - B^2l^2Ca = ma$, so $a = \dfrac{F}{m + B^2l^2C} = \dfrac{2}{0.1 + 0.04\times2} = 11.1\ \mathrm{m\,s^{-2}}$. The acceleration is constant: the capacitor behaves like extra mass.`, { unit: 'm/s²', trap: 'With a capacitor there is no terminal speed: the acceleration is constant.' }),
  nat(5, 'mutual inductance with a wire', r`A square loop of side 10 cm lies in the plane of a long straight wire, with two sides parallel to the wire and the nearer one 10 cm from it. Find the mutual inductance (in nH, 2 decimals).`, 2e-7 * 0.1 * Math.log(2) * 1e9, 0.02, 2,
    r`Take a strip of width $dx$ at distance $x$: $d\Phi = \dfrac{\mu_0I}{2\pi x}a\,dx$. $\Phi = \dfrac{\mu_0Ia}{2\pi}\ln\dfrac{d + a}{d}$. $M = \dfrac\Phi I = 2\times10^{-7}\times0.1\times\ln2 = 1.386\times10^{-8}$ H $= 13.86$ nH.`, { unit: 'nH' }),
  nat(5, 'rod with an inductor', r`A rod of mass 0.1 kg and length 0.8 m slides without friction on horizontal rails connected through an ideal inductor of 0.4 H (no resistance) in a vertical field of 0.5 T. The rod is given a speed of $2\ \mathrm{m\,s^{-1}}$ from the position where the current is zero. Find the largest current in the inductor (in A, 2 decimals).`, 2 * Math.sqrt(0.1 / 0.4), 0.01, 2,
    r`There is no resistance, so the kinetic energy of the rod turns into magnetic energy in the inductor, and back. At the largest current the rod is momentarily at rest: $\tfrac12mv_0^2 = \tfrac12LI_{max}^2$. $I_{max} = v_0\sqrt{m/L} = 2\times\sqrt{0.25} = 1.00$ A.`, { unit: 'A' }),
  nat(5, 'oscillation of a rod with an inductor', r`For the same rod, inductor and field (0.1 kg, 0.8 m, 0.4 H, 0.5 T), find the period of the oscillation of the rod (in s, 2 decimals).`, 2 * Math.PI * Math.sqrt(0.1 * 0.4) / (0.5 * 0.8), 0.02, 2,
    r`$Bl\,v = L\,dI/dt$ (the emf drives the inductor) so $I = \dfrac{Bl}{L}x$. The force is $m\ddot x = -BlI = -\dfrac{B^2l^2}{L}x$. So $\omega^2 = \dfrac{B^2l^2}{mL}$ and $T = \dfrac{2\pi\sqrt{mL}}{Bl} = \dfrac{2\pi\times0.2}{0.4} = 3.14$ s.`, { unit: 's' }),
  nat(5, 'time-varying field', r`A field $B = 0.5e^{-t/0.2}$ (T, $t$ in s) is perpendicular to a circular loop of radius 10 cm. Find the magnitude of the induced emf at $t = 0.2$ s (in mV, 1 decimal).`, Math.PI * 0.01 * 0.5 / 0.2 * Math.exp(-1) * 1e3, 0.1, 1,
    r`$\Phi = \pi r^2B_0e^{-t/\tau}$ and $\left|\dfrac{d\Phi}{dt}\right| = \dfrac{\pi r^2B_0}{\tau}e^{-t/\tau} = \dfrac{\pi\times0.01\times0.5}{0.2}e^{-1} = 28.9\times10^{-3}$ V $= 28.9$ mV.`, { unit: 'mV' }),
  nat(5, 'eddy current heating', r`A thin copper disc (conductivity $6\times10^{7}\ \mathrm{S\,m^{-1}}$, thickness 1 mm, radius 5 cm) lies perpendicular to a uniform field $B = 0.1\sin(2\pi\times50\,t)$ T. Find the average power dissipated by the eddy currents (in W, 1 decimal). Use $\langle P\rangle = \dfrac{\pi\sigma dB_0^2\omega^2a^4}{16}$.`, Math.PI * 6e7 * 1e-3 * 0.01 * (2 * Math.PI * 50) ** 2 * 6.25e-6 / 16, 0.5, 1,
    r`For a ring of radius $r$ the induced field is $E = \dfrac r2\dfrac{dB}{dt}$, and the power in the ring is $\sigma E^2\,(2\pi r\,dr\,d)$. Integrating from 0 to $a$ gives the peak-form $\dfrac{\pi\sigma d\,\omega^2B_0^2a^4}{8}\cos^2\omega t$, whose time average (factor $\tfrac12$) is the formula. $\langle P\rangle = \dfrac{\pi\times6\times10^7\times10^{-3}\times0.01\times(314.2)^2\times6.25\times10^{-6}}{16} = 72.7$ W.`, { unit: 'W', trap: 'Careful with the average: cos² averages to 1/2.' }),
  nat(5, 'inductance of a coaxial cable', r`A long coaxial cable has an inner conductor of radius 1 mm and an outer sheath of radius 4 mm. Find its self-inductance per unit length, counting only the field between the conductors (in $\mu\mathrm{H\,m^{-1}}$, 3 decimals).`, 2e-7 * Math.log(4) * 1e6, 0.002, 3,
    r`Between the conductors $B = \dfrac{\mu_0I}{2\pi r}$. The flux per unit length is $\int_a^b\dfrac{\mu_0I}{2\pi r}dr = \dfrac{\mu_0I}{2\pi}\ln\dfrac ba$. $\dfrac Ll = \dfrac{\mu_0}{2\pi}\ln4 = 2\times10^{-7}\times1.386 = 2.77\times10^{-7}\ \mathrm{H\,m^{-1}} = 0.277\ \mu\mathrm{H\,m^{-1}}$.`, { unit: 'μH/m' }),
  nat(5, 'charge through a coil', r`A coil of 200 turns, area $0.01\ \mathrm{m^2}$ and total resistance $10\ \Omega$ is connected to a ballistic galvanometer. The coil, initially with its plane perpendicular to a field, is pulled out of the field. A charge of 2 mC flows. Find the field (in mT).`, 2e-3 * 10 / (200 * 0.01) * 1e3, 0.1, 1,
    r`$Q = \dfrac{N\Delta\Phi}{R} = \dfrac{NBA}{R}$. $B = \dfrac{QR}{NA} = \dfrac{2\times10^{-3}\times10}{200\times0.01} = 0.010$ T $= 10$ mT.`, { unit: 'mT' }),
  nat(5, 'rod falling in a field with a resistor and battery', r`A rod of mass 0.05 kg and length 0.5 m falls on vertical smooth rails in a horizontal field of 0.4 T. The rails are joined at the top by a resistor of $0.5\ \Omega$. Find the speed when the current is half of its final value (in $\mathrm{m\,s^{-1}}$, 3 decimals; $g = 9.8$).`, 0.5 * 0.05 * 9.8 * 0.5 / (0.16 * 0.25), 0.01, 3,
    r`Current $= Blv/R\propto v$. At half the current the speed is half the terminal speed. $v_t = \dfrac{mgR}{B^2l^2} = \dfrac{0.05\times9.8\times0.5}{0.04} = 6.125$, so $v = 3.06\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  asrt(5, 'induced electric field', r`A changing magnetic flux inside a long solenoid induces an electric field outside the solenoid, where there is no magnetic field.`, r`The induced emf in a loop depends on the rate of change of flux through the area enclosed by the loop.`, 0,
    r`The line integral of $\vec E$ round a loop outside is $-d\Phi/dt$ with $\Phi$ the flux through the loop's area, which includes the solenoid. So $E\neq0$ outside although $B = 0$ there. R is the reason (the area matters, not where the field is at the loop).`),
  asrt(5, 'rod and capacitor', r`A rod pulled by a constant force on rails joined by a capacitor (no resistance) reaches a terminal speed.`, r`The current in this circuit is proportional to the acceleration of the rod.`, 3,
    r`A is false: $q = CBlv$, so $I = CBl\,a$, and the magnetic force is $B^2l^2Ca$, which acts like an extra mass. The rod then accelerates uniformly, with no terminal speed. R is true.`),
  stm(5, 'inductor circuits', r`If the current in an ideal inductor is zero at some instant, the voltage across it is also zero at that instant.`, r`If the voltage across an ideal inductor is zero at some instant, its current is at a maximum or minimum then.`, 3,
    r`I is false: at $t = 0$ in an LR circuit the current is zero but the inductor voltage is $\mathcal E$. II is true: $V = L\,dI/dt = 0$ means $dI/dt = 0$, a stationary point of $I(t)$.`),
  stm(5, 'induced emf', r`A loop moving in a non-uniform static magnetic field can have an emf induced.`, r`A rod moving in a uniform static field can have an emf between its ends although no current flows.`, 0,
    r`I: if the flux through the loop changes as it moves, there is an emf. II: the motional emf $Blv$ exists across the rod's ends, and for an open circuit no current flows. Both true.`),
  msq(5, 'induced field', r`A uniform field is increasing at a constant rate $k$ in a circular region of radius $R$. Which are correct?`, [r`Inside, at radius $r$, $E = kr/2$.`, r`Outside, at radius $r$, $E = kR^2/2r$.`, r`$E$ is maximum at $r = R$.`, r`$E$ is zero outside because $B = 0$ there.`], [0, 1, 2],
    r`Inside: $E\cdot2\pi r = \pi r^2k$. Outside: $E\cdot2\pi r = \pi R^2k$. At $r = R$ both equal $kR/2$, the maximum. The statement that it vanishes outside is wrong: the loop encloses changing flux.`),
  msq(5, 'LR circuit', r`A battery $\mathcal E$ is connected to an inductor $L$ in series with $R$ at $t = 0$. At time $t = \tau\ln2$, which are correct?`, [r`The current is half its final value.`, r`The voltage across the inductor is $\mathcal E/2$.`, r`The voltage across the resistor is $\mathcal E/2$.`, r`The energy stored is half of its final value.`], [0, 1, 2],
    r`$I = I_\infty(1 - e^{-t/\tau}) = I_\infty/2$ at $t = \tau\ln2$, so $V_R = \mathcal E/2$ and $V_L = \mathcal E/2$. The energy $\tfrac12LI^2$ is a quarter of its final value.`),
  msq(5, 'conservation of energy', r`A rod is pulled at constant speed on rails joined by a resistor, in a perpendicular field. Which are correct?`, [r`The work done by the agent equals the heat in the resistor.`, r`The magnetic force does negative work on the rod.`, r`The magnetic force does no net work on the system of moving charges and rod together.`, r`The rod's kinetic energy changes.`], [0, 1, 2],
    r`At constant speed the kinetic energy is constant, and all the agent's work becomes heat. The magnetic force does negative work on the rod (the force along the rod's motion from the current), and equal positive work on the charges carrying the current; in total, the magnetic force does no work.`),
  mcq(5, 'rod with a resistor and an inductor', r`In the rod-and-inductor circuit with no resistance, after the rod is given a speed, its motion is`, 'simple harmonic', ['uniform', 'exponentially decaying', 'uniformly accelerated'],
    r`The energy shuttles between the rod's kinetic energy and the inductor's magnetic energy. The force is proportional to the displacement: $m\ddot x = -\dfrac{B^2l^2}{L}x$. No energy is lost, so the oscillation does not die out.`),
  nat(5, 'induced charge and time', r`The flux through a coil of resistance $5\ \Omega$ changes from 0.04 Wb to 0.01 Wb. Find the charge that flows (in mC).`, (0.04 - 0.01) / 5 * 1e3, 0.1, 1,
    r`$Q = \dfrac{|\Delta\Phi|}{R} = \dfrac{0.03}{5} = 6\times10^{-3}$ C $= 6$ mC.`, { unit: 'mC' }),
);
items.push(
  nat(3, 'mixed: generator and a lamp', r`A coil of 100 turns and area $0.05\ \mathrm{m^2}$ rotates at 50 Hz in a field of 0.2 T and is connected to a $100\ \Omega$ lamp (the coil's own resistance is negligible). Find the rms current (in A, 2 decimals).`, 100 * 0.2 * 0.05 * 100 * Math.PI / Math.SQRT2 / 100, 0.02, 2,
    r`$\mathcal E_0 = NBA\omega = 100\times0.2\times0.05\times100\pi = 314$ V. $\mathcal E_{rms} = \mathcal E_0/\sqrt2 = 222$ V. $I_{rms} = \dfrac{222}{100} = 2.22$ A.`, { unit: 'A', sub: 'mixed' }),
  nat(2, 'mixed: magnet in a copper tube', r`A magnet of mass 50 g falls 2 m through a long copper tube and reaches a steady speed early on. How much heat is produced in the tube while it falls those 2 m at constant speed (in J, 2 decimals; $g = 9.8$)?`, 0.05 * 9.8 * 2, 0.02, 2,
    r`At constant speed the kinetic energy does not change, so the loss of gravitational potential energy goes into heat (eddy currents): $mgh = 0.05\times9.8\times2 = 0.98$ J.`, { unit: 'J', sub: 'mixed' }),
  nat(3, 'mixed: bicycle spoke', r`A bicycle wheel with spokes of length 0.5 m turns at 2 revolutions per second in a place where the vertical component of the Earth's field is $4\times10^{-5}$ T, with the wheel's plane horizontal. Find the emf between the hub and the rim (in $\mu$V, 1 decimal).`, 0.5 * 4e-5 * 2 * 2 * Math.PI * 0.25 * 1e6, 0.2, 1,
    r`$\omega = 2\pi\times2 = 12.57\ \mathrm{rad\,s^{-1}}$. $\mathcal E = \tfrac12B\omega l^2 = \tfrac12\times4\times10^{-5}\times12.57\times0.25 = 6.28\times10^{-5}$ V $= 62.8\ \mu$V.`, { unit: 'μV', sub: 'mixed' }),
  nat(4, 'mixed: electric field in a rotating rod', r`A metal rod rotates at $20\ \mathrm{rad\,s^{-1}}$ about one end in a perpendicular field of 0.5 T. In the steady state, find the electrostatic field inside the rod at 0.3 m from the pivot (in $\mathrm{V\,m^{-1}}$).`, 0.5 * 20 * 0.3, 0.05, 1,
    r`The free electrons are carried round at speed $\omega x$ and feel the magnetic force $e\omega xB$. They pile up at one end until an electric field balances it: $E = B\omega x = 0.5\times20\times0.3 = 3\ \mathrm{V\,m^{-1}}$. Integrating $E\,dx$ along the rod gives $\tfrac12B\omega l^2$.`, { unit: 'V/m', sub: 'mixed' }),
  mcq(3, 'phase of the emf', r`The flux through a rotating coil varies as $\Phi = \Phi_0\cos\omega t$. The induced emf varies as`, r`$\Phi_0\omega\sin\omega t$: a sine curve, a quarter period ahead of the flux`, [r`$\Phi_0\omega\cos\omega t$, in phase with the flux`, r`$-\Phi_0\omega\cos\omega t$, opposite to the flux`, r`a constant`],
    r`$\mathcal E = -\dfrac{d\Phi}{dt} = \Phi_0\omega\sin\omega t$. The emf is maximum when the flux is zero (and changing fastest), and zero when the flux is maximum.`, { trap: 'Maximum flux means zero emf.' }),
  mcq(3, 'unit trap', r`Which of the following is equal to one volt?`, r`one weber per second`, [r`one weber per metre`, r`one tesla per second`, r`one henry per second`],
    r`$\mathcal E = d\Phi/dt$, so 1 V $= 1$ Wb/s. A henry per second is a volt per ampere, a tesla per second is a volt per square metre.`),
  mcq(3, 'NOT correct', r`Which statement about an inductor is NOT correct?`, 'It opposes the presence of a steady current', ['It opposes a change in the current through it', 'The energy in it is stored in its magnetic field', 'Its self-induced emf is proportional to the rate of change of current'],
    r`An ideal inductor does not oppose a steady current; it only opposes changes (its voltage is $L\,dI/dt$, which is zero when $dI/dt = 0$). The other statements are correct.`, { trap: 'It is a change-opposer, not a current-opposer.' }),
  mcq(2, 'induced emf', r`A coil of $N$ turns has a flux $\Phi$ through each turn. The induced emf is proportional to`, r`$N\,d\Phi/dt$`, [r`$\Phi/N$`, r`$N\Phi$`, r`$d\Phi/(N\,dt)$`],
    r`Each turn gets an emf $d\Phi/dt$ and the turns are in series, so $\mathcal E = N\,d\Phi/dt$.`),
  mcq(3, 'coupled coils', r`Two coils are wound on the same iron core. The mutual inductance is $M$. The emf induced in coil 2 when the current in coil 1 changes at rate $dI_1/dt$ is`, r`$M\,dI_1/dt$ in magnitude, whatever the self-inductance of coil 2`, [r`$L_2\,dI_1/dt$`, r`$M\,dI_2/dt$ always`, r`independent of $dI_1/dt$`],
    r`$\mathcal E_2 = -M\,dI_1/dt$. The self-inductance of coil 2 matters only for the emf produced by its own current changing.`),
  mcq(4, 'inductors in series', r`Two inductors of 2 H and 3 H are joined in series, far apart so that $M\approx0$. The equivalent inductance is`, '5 H', ['1.2 H', '6 H', '2.5 H'],
    r`With no coupling, $L = L_1 + L_2 = 5$ H (series), just like resistors. In parallel (again with $M = 0$) it would be $\dfrac{L_1L_2}{L_1 + L_2} = 1.2$ H.`),
  mcq(4, 'inductors in parallel', r`Two inductors of 2 H and 3 H are joined in parallel, far apart so that $M\approx0$. The equivalent inductance is`, '1.2 H', ['5 H', '6 H', '2.5 H'],
    r`The same voltage is across both, and $\dfrac1L = \dfrac1{L_1} + \dfrac1{L_2} = \dfrac56$, so $L = 1.2$ H.`),
  mcq(4, 'energy transfer', r`A conducting rod is pulled at constant speed on rails with a resistor. The agent doubles the force, and the rod settles at a new constant speed. The power supplied is then`, '4 times as much', ['2 times as much', '8 times as much', 'the same'],
    r`At steady speed $F = \dfrac{B^2l^2v}{R}\propto v$. Doubling $F$ doubles $v$, so $P = Fv$ goes up by $2\times2 = 4$.`),
  mcq(4, 'flux linkage', r`A coil of $N$ turns carrying current $I$ has a flux $\Phi$ through each turn. Its self-inductance is`, r`$N\Phi/I$`, [r`$\Phi/I$`, r`$\Phi/NI$`, r`$N^2\Phi/I$`],
    r`The flux linkage is $N\Phi$ and $L = N\Phi/I$ (with $\Phi\propto NI$ this gives $L\propto N^2$).`, { trap: 'Flux linkage, not the flux per turn.' }),
  mcq(2, 'motional emf', r`The motional emf in a rod moving in a uniform field is due to`, 'the magnetic force on the free charges in the rod', ['an electric field produced by the magnet', 'the heating of the rod', 'the rod being a magnet'],
    r`The free electrons move with the rod, and the magnetic force $q\vec v\times\vec B$ pushes them along it until an electric field builds up. This charge separation is the emf.`),
  mcq(1, 'Faraday', r`Faraday's experiments showed that a current can be produced by`, 'a changing magnetic field', ['a steady magnetic field', 'a stationary charge', 'a steady electric field'],
    r`A steady field does nothing to a stationary coil. It is the change (a moving magnet, or a changing current in another coil) that induces the current.`),
  mcq(2, 'Lenz', r`A south pole is pushed towards a coil. The face of the coil nearer the magnet behaves as`, 'a south pole', ['a north pole', 'a neutral face', 'first south, then north'],
    r`The coil opposes the approach by repelling the magnet, so its near face becomes a south pole, like the approaching one. (A clockwise current as seen from the magnet's side.)`),
);
const gens = [
  { id: 'ei-g01', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: "Faraday's law",
    make(rng) {
      const Nt = choose(rng, [10, 20, 50, 100, 200]); const A = choose(rng, [0.01, 0.02, 0.05]); const B1 = choose(rng, [0, 0.1, 0.2]); const B2 = choose(rng, [0.5, 0.6, 0.8, 1]); const dt = choose(rng, [0.05, 0.1, 0.2, 0.5]);
      const E = Nt * A * (B2 - B1) / dt;
      return { Nt, A, B1, B2, dt, q: `A coil of ${Nt} turns and area ${A} $\\mathrm{m^2}$ is perpendicular to a field that changes uniformly from ${B1} T to ${B2} T in ${dt} s. Find the induced emf (in V, 2 decimals).`, answer: N(E, 2), tol: 0.01, unit: 'V',
        sol: `$|\\mathcal E| = N A\\dfrac{\\Delta B}{\\Delta t} = ${Nt}\\times${A}\\times\\dfrac{${S(B2 - B1)}}{${dt}} = ${S(E, 4)}$ V.` };
    },
    verify: (p) => p.Nt * (p.A * p.B2 - p.A * p.B1) / p.dt },
  { id: 'ei-g02', type: 'nat', level: 1, exams: exFor(1, 'nat'), sub: 'motional emf',
    make(rng) {
      const B = choose(rng, [0.1, 0.2, 0.4, 0.5, 0.8]); const l = choose(rng, [0.2, 0.3, 0.5, 1]); const v = choose(rng, [2, 3, 5, 10]);
      const E = B * l * v;
      return { B, l, v, q: `A rod of length ${l} m moves at ${v} $\\mathrm{m\\,s^{-1}}$ at right angles to a field of ${B} T (and to its own length). Find the emf across its ends (in V, 3 decimals).`, answer: N(E, 3), tol: 0.005, unit: 'V',
        sol: `$\\mathcal E = Blv = ${B}\\times${l}\\times${v} = ${S(E, 3)}$ V.` };
    },
    verify: (p) => p.v * p.l * p.B },
  { id: 'ei-g03', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'rotating rod',
    make(rng) {
      const B = choose(rng, [0.1, 0.2, 0.5]); const l = choose(rng, [0.2, 0.4, 0.5, 1]); const f = choose(rng, [5, 10, 20, 50]);
      const w = 2 * Math.PI * f; const E = 0.5 * B * w * l * l;
      return { B, l, f, q: `A metal rod of length ${l} m rotates about one end, ${f} times per second, in a field of ${B} T perpendicular to its plane. Find the emf between its ends (in V, 3 decimals).`, answer: N(E, 3), tol: 0.003 + E * 0.002, unit: 'V',
        sol: `$\\omega = 2\\pi\\times${f} = ${S(w, 4)}\\ \\mathrm{rad\\,s^{-1}}$. $\\mathcal E = \\tfrac12B\\omega l^2 = \\tfrac12\\times${B}\\times${S(w, 4)}\\times${S(l * l, 3)} = ${S(E, 4)}$ V.`, trap: 'Use the angular speed in rad/s, not the frequency.' };
    },
    verify: (p) => { const w = 2 * Math.PI * p.f; let e = 0; const n = 20000; for (let i = 0; i < n; i++) { const x = (i + 0.5) / n * p.l; e += p.B * w * x * (p.l / n); } return e; } },
  { id: 'ei-g04', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'sliding rod',
    make(rng) {
      const B = choose(rng, [0.2, 0.4, 0.5]); const l = choose(rng, [0.2, 0.4, 0.5]); const v = choose(rng, [2, 4, 5, 10]); const R = choose(rng, [1, 2, 4]); const part = choose(rng, ['current', 'force', 'power']);
      const E = B * l * v; const I = E / R; const F = B * I * l; const P = E * I;
      const ans = part === 'current' ? I : part === 'force' ? F : P; const un = part === 'current' ? 'A' : part === 'force' ? 'N' : 'W';
      return { B, l, v, R, part, q: `A rod of length ${l} m slides at ${v} $\\mathrm{m\\,s^{-1}}$ on rails joined by a ${R} $\\Omega$ resistor in a perpendicular field of ${B} T. Find the ${part === 'current' ? 'current' : part === 'force' ? 'force needed to keep it moving at constant speed' : 'power dissipated in the resistor'} (in ${un}, 4 decimals).`, answer: N(ans, 4), tol: 0.0003 + ans * 0.002, unit: un,
        sol: `$\\mathcal E = Blv = ${S(E)}$ V, $I = \\mathcal E/R = ${S(I, 4)}$ A. ${part === 'current' ? '' : part === 'force' ? `$F = BIl = ${B}\\times${S(I, 4)}\\times${l} = ${S(F, 4)}$ N.` : `$P = \\mathcal EI = ${S(E)}\\times${S(I, 4)} = ${S(P, 4)}$ W (also $I^2R$).`}` };
    },
    verify: (p) => p.part === 'current' ? p.B * p.l * p.v / p.R : p.part === 'force' ? (p.B * p.l) ** 2 * p.v / p.R : (p.B * p.l * p.v) ** 2 / p.R },
  { id: 'ei-g05', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'terminal velocity',
    make(rng) {
      const m = choose(rng, [0.05, 0.1]); const l = choose(rng, [0.4, 0.5, 1]); const B = choose(rng, [0.5, 1]); const R = choose(rng, [0.2, 0.5, 1]);
      const v = m * 9.8 * R / (B * B * l * l);
      return { m, l, B, R, q: `A rod of mass ${m * 1000} g and length ${l} m falls on smooth vertical rails in a horizontal field of ${B} T. The circuit resistance is ${R} $\\Omega$. Find its terminal speed (in $\\mathrm{m\\,s^{-1}}$, 3 decimals; $g = 9.8$).`, answer: N(v, 3), tol: 0.003 + v * 0.002, unit: 'm/s',
        sol: `At terminal speed $\\dfrac{B^2l^2v}{R} = mg$, so $v = \\dfrac{mgR}{B^2l^2} = \\dfrac{${m}\\times9.8\\times${R}}{${S(B * B)}\\times${S(l * l)}} = ${S(v, 4)}\\ \\mathrm{m\\,s^{-1}}$.` };
    },
    verify: (p) => { let v = 0; const dt = 1e-3; for (let i = 0; i < 400000; i++) { const a = 9.8 - (p.B * p.l) ** 2 * v / (p.R * p.m); v += a * dt; } return v; } },
  { id: 'ei-g06', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'self-inductance of a solenoid',
    make(rng) {
      const Nt = choose(rng, [200, 500, 800, 1000, 2000]); const A = choose(rng, [1, 2, 4, 5]) * 1e-4; const l = choose(rng, [0.2, 0.25, 0.5, 1]);
      const L = MU * Nt * Nt * A / l * 1e3;
      return { Nt, A, l, q: `An air-core solenoid of ${Nt} turns, length ${l} m and cross-section ${S(A * 1e4)} $\\mathrm{cm^2}$ has what self-inductance (in mH, 3 decimals)?`, answer: N(L, 3), tol: 0.004 + L * 0.002, unit: 'mH',
        sol: `$L = \\dfrac{\\mu_0N^2A}{l} = \\dfrac{4\\pi\\times10^{-7}\\times${Nt}^2\\times${tx(A)}}{${l}} = ${S(L, 4)}$ mH.` };
    },
    verify: (p) => { const n = p.Nt / p.l; return MU * n * p.Nt * p.A * 1e3; } },
  { id: 'ei-g07', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'mutual inductance',
    make(rng) {
      const N1 = choose(rng, [200, 500, 1000]); const N2 = choose(rng, [50, 100, 400]); const A = choose(rng, [2, 4, 5]) * 1e-4; const l = choose(rng, [0.2, 0.4, 0.5]);
      const M = MU * N1 * N2 * A / l * 1e3;
      return { N1, N2, A, l, q: `A long solenoid of ${N1} turns, length ${l} m and cross-section ${S(A * 1e4)} $\\mathrm{cm^2}$ has a coil of ${N2} turns wound tightly over it. Find the mutual inductance (in mH, 3 decimals).`, answer: N(M, 3), tol: 0.004 + M * 0.002, unit: 'mH',
        sol: `$M = \\dfrac{\\mu_0N_1N_2A}{l} = \\dfrac{4\\pi\\times10^{-7}\\times${N1}\\times${N2}\\times${tx(A)}}{${l}} = ${S(M, 4)}$ mH.` };
    },
    verify: (p) => (p.N2 * MU * (p.N1 / p.l) * p.A) * 1e3 },
  { id: 'ei-g08', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'energy in an inductor',
    make(rng) {
      const L = choose(rng, [0.1, 0.2, 0.5, 2, 5]); const I = choose(rng, [1, 2, 3, 4, 6]);
      const U = 0.5 * L * I * I;
      return { L, I, q: `An inductor of ${L} H carries ${I} A. How much energy is stored in it (in J, 2 decimals)?`, answer: N(U, 2), tol: 0.01, unit: 'J',
        sol: `$U = \\tfrac12LI^2 = \\tfrac12\\times${L}\\times${I}^2 = ${S(U, 4)}$ J.`, trap: 'The current is squared.' };
    },
    verify: (p) => (p.L * p.I) * p.I / 2 },
  { id: 'ei-g09', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'LR growth',
    make(rng) {
      const E = choose(rng, [6, 10, 12, 24]); const R = choose(rng, [2, 4, 5, 10]); const L = choose(rng, [0.5, 1, 2, 4]); const k = choose(rng, [0.5, 1, 2, 3]);
      const tau = L / R; const t = k * tau; const I = E / R * (1 - Math.exp(-k));
      return { E, R, L, k, q: `A ${E} V battery, a ${R} $\\Omega$ resistor and a ${L} H inductor are in series and the switch is closed at $t = 0$. Find the current at $t = ${S(t, 3)}$ s (in A, 3 decimals).`, answer: N(I, 3), tol: 0.003, unit: 'A',
        sol: `$\\tau = L/R = ${S(tau, 3)}$ s, so $t = ${k}\\tau$. $I = \\dfrac{\\mathcal E}{R}(1 - e^{-t/\\tau}) = ${S(E / R)}\\times(1 - e^{-${k}}) = ${S(I, 4)}$ A.` };
    },
    verify: (p) => { // integrate dI/dt = (E - IR)/L numerically
      let I = 0; const T = p.k * p.L / p.R; const n = 200000; const dt = T / n; for (let i = 0; i < n; i++) I += (p.E - I * p.R) / p.L * dt; return I; } },
  { id: 'ei-g10', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'LR time',
    make(rng) {
      const R = choose(rng, [2, 4, 5, 10]); const L = choose(rng, [0.5, 1, 2, 4]); const f = choose(rng, [0.5, 0.75, 0.9, 0.95, 0.99]);
      const tau = L / R; const t = -tau * Math.log(1 - f);
      return { R, L, f, q: `A series LR circuit has $R = ${R}\\ \\Omega$ and $L = ${L}$ H. After switching on a battery, how long does the current take to reach ${f * 100} % of its final value (in s, 3 decimals)?`, answer: N(t, 3), tol: 0.004, unit: 's',
        sol: `$\\tau = L/R = ${S(tau, 3)}$ s. $1 - e^{-t/\\tau} = ${f}$ gives $t = \\tau\\ln\\dfrac1{${S(1 - f, 3)}} = ${S(tau, 3)}\\times${S(Math.log(1 / (1 - f)), 4)} = ${S(t, 4)}$ s.` };
    },
    verify: (p) => { let I = 0; const dt = 1e-5; let t = 0; while (I < p.f) { I += (1 - I) * (p.R / p.L) * dt; t += dt; } return t; } },
  { id: 'ei-g11', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'self-induction',
    make(rng) {
      const L = choose(rng, [0.1, 0.2, 0.5, 2]); const dI = choose(rng, [1, 2, 3, 5]); const dt = choose(rng, [0.01, 0.02, 0.05, 0.1]);
      const E = L * dI / dt;
      return { L, dI, dt, q: `The current in a coil of ${L} H falls uniformly by ${dI} A in ${dt} s. Find the magnitude of the induced emf (in V, 2 decimals).`, answer: N(E, 2), tol: 0.02, unit: 'V',
        sol: `$|\\mathcal E| = L\\dfrac{|\\Delta I|}{\\Delta t} = ${L}\\times\\dfrac{${dI}}{${dt}} = ${S(E, 4)}$ V.` };
    },
    verify: (p) => p.dI / (p.dt / p.L) },
  { id: 'ei-g12', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'AC generator',
    make(rng) {
      const Nt = choose(rng, [50, 100, 200, 500]); const B = choose(rng, [0.1, 0.2, 0.5]); const A = choose(rng, [0.01, 0.02, 0.05]); const f = choose(rng, [25, 50, 60]); const th = choose(rng, [30, 45, 60, 90]);
      const E0 = Nt * B * A * 2 * Math.PI * f; const E = E0 * Math.sin(th * Math.PI / 180);
      return { Nt, B, A, f, th, q: `A coil of ${Nt} turns and area ${A} $\\mathrm{m^2}$ rotates at ${f} Hz in a field of ${B} T. The emf is zero when the plane is perpendicular to the field. Find the emf when the plane has turned through ${th}$^\\circ$ from that position (in V, 1 decimal).`, answer: N(E, 1), tol: 0.2 + E * 0.002, unit: 'V',
        sol: `$\\mathcal E_0 = NBA\\omega = ${Nt}\\times${B}\\times${A}\\times${S(2 * Math.PI * f, 4)} = ${S(E0, 4)}$ V. $\\mathcal E = \\mathcal E_0\\sin${th}^\\circ = ${S(E, 4)}$ V.`, trap: 'Starting at zero emf, the emf goes as sine.' };
    },
    verify: (p) => { const w = 2 * Math.PI * p.f; return p.Nt * p.B * p.A * w * Math.sin(w * (p.th / 360 / p.f)); } },
  { id: 'ei-g13', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'magnetic flux',
    make(rng) {
      const B = choose(rng, [0.2, 0.4, 0.5, 0.8]); const A = choose(rng, [0.01, 0.02, 0.05, 0.1]); const th = choose(rng, [0, 30, 45, 60, 90]); const refPlane = rng() < 0.5;
      const ang = refPlane ? 90 - th : th; const Phi = B * A * Math.cos(ang * Math.PI / 180) * 1e3;
      return { B, A, th, refPlane, q: `A coil of area ${A} $\\mathrm{m^2}$ is in a uniform field of ${B} T. The ${refPlane ? 'plane of the coil' : 'normal to the coil'} makes ${th}$^\\circ$ with the field. Find the flux through it (in mWb, 2 decimals).`, answer: N(Phi, 2), tol: 0.02, unit: 'mWb',
        sol: `${refPlane ? `The angle between the normal and the field is $90^\\circ - ${th}^\\circ = ${90 - th}^\\circ$. ` : ''}$\\Phi = BA\\cos\\theta = ${B}\\times${A}\\times\\cos${ang}^\\circ = ${S(Phi, 4)}$ mWb.`, trap: 'The angle in the formula is with the normal.' };
    },
    verify: (p) => (p.refPlane ? p.B * p.A * Math.sin(p.th * Math.PI / 180) : p.B * p.A * Math.cos(p.th * Math.PI / 180)) * 1e3 },
  { id: 'ei-g14', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'induced charge',
    make(rng) {
      const Nt = choose(rng, [20, 50, 100, 200]); const A = choose(rng, [0.005, 0.01, 0.02]); const B = choose(rng, [0.2, 0.5, 0.8]); const R = choose(rng, [5, 10, 20]); const flip = rng() < 0.5;
      const Q = Nt * B * A * (flip ? 2 : 1) / R * 1e3;
      return { Nt, A, B, R, flip, q: `A coil of ${Nt} turns, area ${A} $\\mathrm{m^2}$ and resistance ${R} $\\Omega$ is ${flip ? 'turned over through $180^\\circ$' : 'pulled out'}, starting with its plane perpendicular to a field of ${B} T${flip ? '' : ' (the field is then zero at the coil)'}. Find the charge that flows (in mC, 2 decimals).`, answer: N(Q, 2), tol: 0.02 + Q * 0.002, unit: 'mC',
        sol: `${flip ? `The flux changes from $+BA$ to $-BA$: $|\\Delta\\Phi| = 2BA$ per turn.` : `The flux falls from $BA$ to 0.`} $Q = \\dfrac{N|\\Delta\\Phi|}{R} = \\dfrac{${Nt}\\times${flip ? '2\\times' : ''}${B}\\times${A}}{${R}} = ${S(Q, 4)}$ mC. It does not depend on the time taken.`, trap: 'A flip changes the flux by 2BA.' };
    },
    verify: (p) => (p.flip ? p.Nt * (p.B * p.A - (-p.B * p.A)) : p.Nt * (p.B * p.A - 0)) / p.R * 1e3 },
  { id: 'ei-g15', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'rotating disc',
    make(rng) {
      const B = choose(rng, [0.1, 0.2, 0.5]); const R = choose(rng, [0.1, 0.2, 0.3]); const f = choose(rng, [5, 10, 25, 50]);
      const E = 0.5 * B * 2 * Math.PI * f * R * R * 1e3;
      return { B, R, f, q: `A metal disc of radius ${S(R * 100)} cm rotates about its axis at ${f} revolutions per second in a field of ${B} T parallel to the axis. Find the emf between the centre and the rim (in mV, 2 decimals).`, answer: N(E, 2), tol: 0.02 + E * 0.002, unit: 'mV',
        sol: `$\\mathcal E = \\tfrac12B\\omega R^2 = \\tfrac12\\times${B}\\times${S(2 * Math.PI * f, 4)}\\times${S(R * R, 3)} = ${S(E / 1e3, 4)}$ V $= ${S(E, 4)}$ mV.` };
    },
    verify: (p) => Math.PI * p.f * p.B * p.R * p.R * 1e3 },
  { id: 'ei-g16', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'direction of induced current',
    make(rng) {
      const sc = choose(rng, [['into the page and increasing', 1], ['into the page and decreasing', -1], ['out of the page and increasing', -1], ['out of the page and decreasing', 1]]);
      const ans = sc[1] === 1 ? 'anticlockwise' : 'clockwise';
      const o = shuffleOpts(rng, ans, ['clockwise', 'anticlockwise', 'no current', 'alternating']);
      const into = sc[0].startsWith('into'); const inc = sc[0].endsWith('increasing');
      return { into, inc, ...o, q: `A loop lies in the plane of the page in a uniform field directed ${sc[0]}. The induced current in the loop is`,
        sol: `The induced current opposes the change in flux. ${inc ? 'The flux is growing, so it makes a field opposite to $\\vec B$' : 'The flux is falling, so it makes a field in the same direction as $\\vec B$'}: ${(into === inc) ? 'out of the page, which needs an anticlockwise current' : 'into the page, which needs a clockwise current'}. Answer: ${ans}.` };
    },
    verify: (p) => { const induceOut = p.into === p.inc; const a = induceOut ? 'anticlockwise' : 'clockwise'; return p.options.indexOf(a); } },
  { id: 'ei-g17', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'induced electric field',
    make(rng) {
      const R = choose(rng, [0.05, 0.1, 0.2]); const k = choose(rng, [0.01, 0.02, 0.05, 0.1]); const f = choose(rng, [0.25, 0.5, 0.8, 1.5, 2, 3]);
      const r = R * f; const E = f <= 1 ? r / 2 * k : R * R / (2 * r) * k;
      return { R, k, f, q: `A uniform field in a circular region of radius ${S(R * 100)} cm increases at ${k} $\\mathrm{T\\,s^{-1}}$. Find the induced electric field at ${S(r * 100)} cm from the centre (in $\\mathrm{mV\\,m^{-1}}$, 3 decimals).`, answer: N(E * 1e3, 3), tol: 0.003 + E * 1e3 * 0.002, unit: 'mV/m',
        sol: f <= 1 ? `Inside: $E\\cdot2\\pi r = \\pi r^2k$ gives $E = \\dfrac{rk}{2} = \\dfrac{${S(r, 3)}\\times${k}}{2} = ${S(E * 1e3, 4)}\\ \\mathrm{mV\\,m^{-1}}$.` : `Outside the region the flux is $\\pi R^2B$: $E = \\dfrac{R^2k}{2r} = \\dfrac{${S(R * R, 3)}\\times${k}}{2\\times${S(r, 3)}} = ${S(E * 1e3, 4)}\\ \\mathrm{mV\\,m^{-1}}$.`, trap: 'Outside, the flux stops at the radius of the field region.' };
    },
    verify: (p) => { const r = p.R * p.f; const area = Math.min(r, p.R) ** 2 * Math.PI; return area * p.k / (2 * Math.PI * r) * 1e3; } },
  { id: 'ei-g18', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'coupled inductors',
    make(rng) {
      const L1 = choose(rng, [1, 2, 4]); const L2 = choose(rng, [2, 3, 9]); const kc = choose(rng, [0.25, 0.5, 0.8]); const aid = rng() < 0.5;
      const M = kc * Math.sqrt(L1 * L2); const Leq = L1 + L2 + (aid ? 2 : -2) * M;
      return { L1, L2, kc, aid, q: `Two coils of ${L1} H and ${L2} H have a coupling coefficient of ${kc}. They are joined in series so that their fluxes ${aid ? 'add' : 'oppose'}. Find the equivalent inductance (in H, 3 decimals).`, answer: N(Leq, 3), tol: 0.004, unit: 'H',
        sol: `$M = k\\sqrt{L_1L_2} = ${kc}\\times\\sqrt{${L1 * L2}} = ${S(M, 4)}$ H. $L_{eq} = L_1 + L_2 ${aid ? '+' : '-'} 2M = ${L1} + ${L2} ${aid ? '+' : '-'} ${S(2 * M, 4)} = ${S(Leq, 4)}$ H.` };
    },
    verify: (p) => p.L1 + p.L2 + (p.aid ? 1 : -1) * 2 * p.kc * Math.sqrt(p.L1 * p.L2) },
  { id: 'ei-g19', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'energy density',
    make(rng) {
      const B = choose(rng, [0.1, 0.2, 0.5, 1, 1.5, 2]);
      const u = B * B / (2 * MU);
      return { B, q: `Find the energy stored per cubic metre in a magnetic field of ${B} T in air (in $\\mathrm{kJ\\,m^{-3}}$, 1 decimal).`, answer: N(u / 1e3, 1), tol: 0.2 + u / 1e3 * 0.002, unit: 'kJ/m³',
        sol: `$u = \\dfrac{B^2}{2\\mu_0} = \\dfrac{${S(B * B)}}{2\\times4\\pi\\times10^{-7}} = ${tx(u)}\\ \\mathrm{J\\,m^{-3}} = ${S(u / 1e3, 4)}\\ \\mathrm{kJ\\,m^{-3}}$.` };
    },
    verify: (p) => 0.5 * p.B * (p.B / MU) / 1e3 },
  { id: 'ei-g20', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'LR decay',
    make(rng) {
      const I0 = choose(rng, [1, 2, 3, 5]); const L = choose(rng, [0.5, 1, 2, 4]); const R = choose(rng, [2, 4, 5, 10]); const k = choose(rng, [0.5, 1, 2, 3]);
      const tau = L / R; const t = k * tau; const I = I0 * Math.exp(-k);
      return { I0, L, R, k, q: `A coil of $L = ${L}$ H and $R = ${R}\\ \\Omega$ carries ${I0} A when the battery is removed and the ends are joined. Find the current ${S(t, 3)} s later (in A, 3 decimals).`, answer: N(I, 3), tol: 0.003, unit: 'A',
        sol: `$\\tau = L/R = ${S(tau, 3)}$ s, so $t = ${k}\\tau$. $I = I_0e^{-t/\\tau} = ${I0}e^{-${k}} = ${S(I, 4)}$ A.` };
    },
    verify: (p) => { let I = p.I0; const T = p.k * p.L / p.R; const n = 200000; const dt = T / n; for (let i = 0; i < n; i++) I -= I * p.R / p.L * dt; return I; } },
  { id: 'ei-g21', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'emf of an inclined rod',
    make(rng) {
      const B = choose(rng, [0.2, 0.4, 0.5]); const l = choose(rng, [0.4, 0.5, 1]); const v = choose(rng, [2, 5, 10]); const th = choose(rng, [30, 37, 45, 53, 60, 90]);
      const E = B * v * l * Math.sin(th * Math.PI / 180);
      return { B, l, v, th, q: `A rod of length ${l} m moves at ${v} $\\mathrm{m\\,s^{-1}}$ in a field of ${B} T perpendicular to the plane of the rod and its velocity. The rod makes ${th}$^\\circ$ with its velocity. Find the emf across it (in V, 3 decimals).`, answer: N(E, 3), tol: 0.004, unit: 'V',
        sol: `Only the part of the length perpendicular to the velocity counts: $l\\sin${th}^\\circ$. $\\mathcal E = Bvl\\sin\\theta = ${B}\\times${v}\\times${l}\\times${S(Math.sin(th * Math.PI / 180), 4)} = ${S(E, 4)}$ V.` };
    },
    verify: (p) => p.B * Math.abs(p.v * p.l * Math.sin(p.th * Math.PI / 180)) },
  { id: 'ei-g22', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'decay of speed',
    make(rng) {
      const m = choose(rng, [0.05, 0.1, 0.2]); const l = choose(rng, [0.4, 0.5, 1]); const B = choose(rng, [0.5, 1]); const R = choose(rng, [0.2, 0.5, 1]); const v0 = choose(rng, [2, 3, 5]);
      const x = m * R * v0 / (B * B * l * l);
      return { m, l, B, R, v0, q: `A rod of mass ${m} kg and length ${l} m is given a speed of ${v0} $\\mathrm{m\\,s^{-1}}$ on frictionless horizontal rails in a field of ${B} T. The rails are joined by a ${R} $\\Omega$ resistor. Find the distance it travels before stopping (in m, 3 decimals).`, answer: N(x, 3), tol: 0.004 + x * 0.002, unit: 'm',
        sol: `$m\\,dv = -\\dfrac{B^2l^2}{R}dx$, so $x = \\dfrac{mRv_0}{B^2l^2} = \\dfrac{${m}\\times${R}\\times${v0}}{${S(B * B)}\\times${S(l * l)}} = ${S(x, 4)}$ m.`, trap: 'The speed decays exponentially but the distance is finite.' };
    },
    verify: (p) => { let v = p.v0; let x = 0; const dt = 1e-4; const k = p.B * p.B * p.l * p.l / (p.R * p.m); for (let i = 0; i < 2000000 && v > 1e-6; i++) { x += v * dt; v -= k * v * dt; } return x; } },
  { id: 'ei-g23', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'induced emf scaling',
    make(rng) {
      const sc = choose(rng, [['the speed of a rod is doubled', 2, 'motional emf'], ['the length of a rod is tripled', 3, 'motional emf'], ['the angular speed of a rotating rod is doubled', 2, 'rotating rod'], ['the length of a rotating rod is doubled', 4, 'rotating rod'], ['the number of turns of a rotating coil is tripled', 3, 'coil'], ['the field is halved for a rotating coil', 0.5, 'coil']]);
      const f = sc[1];
      const o = shuffleOpts(rng, `${f} times`, [`${f * 2} times`, `${f / 2} times`, `${f * f} times`, 'unchanged']);
      return { f, ...o, q: `The emf induced changes by what factor when ${sc[0]} (all else the same)?`,
        sol: `${sc[2] === 'motional emf' ? '$\\mathcal E = Blv$ is proportional to $l$ and to $v$.' : sc[2] === 'rotating rod' ? '$\\mathcal E = \\tfrac12B\\omega l^2$ is proportional to $\\omega$ and to $l^2$.' : '$\\mathcal E = NBA\\omega\\sin\\omega t$ is proportional to $N$, $B$, $A$ and $\\omega$.'} So the emf is multiplied by ${f}.` };
    },
    verify: (p) => p.options.indexOf(`${p.f} times`) },
  { id: 'ei-g24', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'heat in a loop',
    make(rng) {
      const a = choose(rng, [0.05, 0.1, 0.2]); const B = choose(rng, [0.2, 0.5, 1]); const v = choose(rng, [1, 2, 4]); const R = choose(rng, [0.1, 0.5, 1]);
      const Q = B * B * a * a * a * v / R * 1e3;
      return { a, B, v, R, q: `A square loop of side ${S(a * 100)} cm and resistance ${R} $\\Omega$ is pulled at ${v} $\\mathrm{m\\,s^{-1}}$ into a region of field ${B} T perpendicular to the loop. Find the heat produced while it moves completely in (in mJ, 3 decimals).`, answer: N(Q, 3), tol: 0.004 + Q * 0.002, unit: 'mJ',
        sol: `The emf is $Bav = ${S(B * a * v, 4)}$ V and the current is $${S(B * a * v / R, 4)}$ A for a time $a/v = ${S(a / v, 4)}$ s. Heat $= I^2Rt = \\dfrac{(Bav)^2}{R}\\cdot\\dfrac av = \\dfrac{B^2a^3v}{R} = ${S(Q, 4)}$ mJ.` };
    },
    verify: (p) => { const I = p.B * p.a * p.v / p.R; return I * I * p.R * (p.a / p.v) * 1e3; } },
  { id: 'ei-g25', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'inductance of a toroid',
    make(rng) {
      const Nt = choose(rng, [200, 500, 1000, 2000]); const r = choose(rng, [0.05, 0.1, 0.2]); const A = choose(rng, [2, 4, 5]) * 1e-4;
      const L = MU * Nt * Nt * A / (2 * Math.PI * r) * 1e3;
      return { Nt, r, A, q: `A toroid of ${Nt} turns, mean radius ${S(r * 100)} cm and core cross-section ${S(A * 1e4)} $\\mathrm{cm^2}$ has what self-inductance (in mH, 3 decimals)?`, answer: N(L, 3), tol: 0.004 + L * 0.002, unit: 'mH',
        sol: `$L = \\dfrac{\\mu_0N^2A}{2\\pi r} = \\dfrac{2\\times10^{-7}\\times${Nt}^2\\times${tx(A)}}{${r}} = ${S(L, 4)}$ mH.` };
    },
    verify: (p) => { const B1 = MU * p.Nt / (2 * Math.PI * p.r); return p.Nt * B1 * p.A * 1e3; } },
  { id: 'ei-g26', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'rate of change of current',
    make(rng) {
      const E = choose(rng, [6, 12, 24]); const R = choose(rng, [2, 4, 6]); const L = choose(rng, [1, 2, 3]); const k = choose(rng, [0, 0.5, 1, 2]);
      const d = E / L * Math.exp(-k);
      return { E, R, L, k, q: `A ${E} V battery is connected at $t = 0$ to a ${R} $\\Omega$ resistor in series with a ${L} H inductor. Find $dI/dt$ at $t = ${S(k * L / R, 3)}$ s (in $\\mathrm{A\\,s^{-1}}$, 3 decimals).`, answer: N(d, 3), tol: 0.004, unit: 'A/s',
        sol: `$\\tau = L/R = ${S(L / R, 3)}$ s, so $t = ${k}\\tau$. $\\dfrac{dI}{dt} = \\dfrac{\\mathcal E}{L}e^{-t/\\tau} = ${S(E / L)}e^{-${k}} = ${S(d, 4)}\\ \\mathrm{A\\,s^{-1}}$.` };
    },
    verify: (p) => { const tau = p.L / p.R; const t = p.k * tau; const I = p.E / p.R * (1 - Math.exp(-t / tau)); return (p.E - I * p.R) / p.L; } },
];
{ // ===== extension block (added 2026-11-22): harder items, new formats and templates =====
const r = String.raw;
const CUET = true; const PFX = 'ei'; const GN = 26;
const F = (x, s = 3) => String(+Number(x).toPrecision(s));
const XEB = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const xe = (l, type) => (CUET && type === 'mcq' && l <= 3 ? [...XEB[l], 'cuet'] : XEB[l]);
let xk = 0; let xc = 0;
const xb = (l, sub, o) => ({ id: `${PFX}-x${String(++xk).padStart(3, '0')}`, level: l, sub, ...o, exams: xe(l, o.type) });
const m = (l, sub, q, correct, wrongs, sol, o = {}) => { const pos = (xc++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct); return xb(l, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o }); };
const n = (l, sub, q, fn, tol, dp, sol, o = {}) => { const answer = +fn().toFixed(dp); return xb(l, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o }); };
const s = (l, sub, q, options, answer, sol, o = {}) => xb(l, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AO = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const a = (l, sub, A, R, answer, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AO, answer, sol, ...o });
const SO = ['Both Statement I and Statement II are true', 'Both Statement I and Statement II are false', 'Statement I is true but Statement II is false', 'Statement I is false but Statement II is true'];
const t = (l, sub, I, II, answer, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SO, answer, sol, ...o });
// "how many of these are correct": list = 4 statements, k = how many are correct (1-4)
const cn = (l, sub, q, list, k, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'statements', q: `${q}<br>${list.map((x, i) => `(${['i', 'ii', 'iii', 'iv'][i]}) ${x}`).join('<br>')}`, options: ['Only one', 'Only two', 'Only three', 'All four'], answer: k - 1, sol, ...o });
// match item: letters = correct List II letter for A, B, C, D, e.g. ['q','r','p','s']
const mt = (l, sub, group, letters, sol, o = {}) => {
  const code = (L) => L.map((x, i) => `${'ABCD'[i]}-${x}`).join(', ');
  const right = code(letters); const wr = [];
  for (const [i, j] of [[0, 1], [1, 2], [2, 3], [0, 3], [0, 2], [1, 3]]) { const L = [...letters]; [L[i], L[j]] = [L[j], L[i]]; const c = code(L); if (c !== right && !wr.includes(c)) wr.push(c); }
  const pos = (xc++ * 3 + 2) % 4; const options = wr.slice(0, 3); options.splice(pos, 0, right);
  return xb(l, sub, { type: 'mcq', format: 'match', q: 'Match the entries of List I with List II and choose the correct code.', group, options, answer: pos, sol, ...o });
};
const pn = (l, sub, group, q, fn, tol, dp, sol, o = {}) => { const answer = +fn().toFixed(dp); return xb(l, sub, { type: 'nat', format: 'passage', group, q, answer, tol, calc: () => answer, sol, ...o }); };
const pm = (l, sub, group, q, correct, wrongs, sol, o = {}) => { const pos = (xc++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct); return xb(l, sub, { type: 'mcq', format: 'passage', group, q, options, answer: pos, sol, ...o }); };
let xg = GN;
const gx = (l, type, sub, make, verify) => ({ id: `${PFX}-g${String(++xg).padStart(2, '0')}`, type, level: l, exams: xe(l, type), sub, make, verify });
const NG = {};
const MU0 = 4e-7 * Math.PI;
Object.assign(groups, {
  xi1: { title: 'Induced emf in different set-ups',
    list1: ['A. A loop at rest in a steady uniform magnetic field', 'B. A coil of $N$ turns and area $A$ rotating at $\\omega$ in a uniform field $B$', 'C. A rod of length $l$ moving at speed $v$ perpendicular to $B$ and to its own length', 'D. A rod of length $l$ rotating at $\\omega$ about one end in a uniform field $B$ perpendicular to its plane'],
    list2: [r`p. $Blv$`, r`q. $\tfrac12B\omega l^2$`, r`r. $0$`, r`s. $NBA\omega\sin\omega t$`] },
  xi2: { title: 'An LR circuit: $\\varepsilon = 12$ V, $R = 4\\ \\Omega$, $L = 2$ H, switch just closed',
    list1: ['A. Final steady current', 'B. Initial rate of rise of current', 'C. Time constant', 'D. Final energy stored in the inductor'],
    list2: ['p. 0.5 s', 'q. 9 J', r`r. $6\ \mathrm{A\,s^{-1}}$`, 's. 3 A'] },
  xi3: { title: 'An LR circuit connected to a battery of emf $\\varepsilon$ at $t=0$',
    list1: ['A. Current at $t = 0$', 'B. Voltage across the inductor at $t = 0$', 'C. Fraction of the final current at $t = \\tau$', 'D. Fraction of the final current at $t = 3\\tau$'],
    list2: ['p. 0', r`q. $\varepsilon$`, 'r. 0.63', 's. 0.95'] },
  xi4: { title: 'A long solenoid ($n$ turns per metre, area $A$, length $l$, current $I$)',
    list1: ['A. Field inside', 'B. Self-inductance', 'C. Energy stored', 'D. Energy density'],
    list2: [r`p. $\tfrac12\mu_0n^2I^2$`, r`q. $\mu_0nI$`, r`r. $\tfrac12\mu_0n^2AlI^2$`, r`s. $\mu_0n^2Al$`] },
  xi5: { title: 'A rod of mass $m$, length $l$ and a circuit of resistance $R$, with field $B$ perpendicular to the plane of the frictionless rails',
    list1: ['A. Terminal speed when a constant force $F$ pulls it along horizontal rails', 'B. Terminal speed of the rod falling under gravity on vertical rails', 'C. Distance travelled by the rod, given a speed $v_0$ and then left alone', 'D. Extra effective mass when the rails are joined by a capacitor $C$ instead of a resistor'],
    list2: [r`p. $\dfrac{FR}{B^2l^2}$`, r`q. $\dfrac{mgR}{B^2l^2}$`, r`r. $\dfrac{mv_0R}{B^2l^2}$`, r`s. $CB^2l^2$`] },
  xi6: { title: 'A loop of area $A$ in a field $B = B_0\\sin\\omega t$ perpendicular to it',
    list1: ['A. Induced emf at $t = 0$', r`B. Induced emf at $\omega t = \pi/2$`, 'C. Peak flux through the loop', 'D. Phase difference between the flux and the emf'],
    list2: [r`p. $B_0A$`, 'q. 0', r`r. $\omega B_0A$`, r`s. $\pi/2$`] },
  xi7: { title: 'A uniform field in a circular region of radius $R$ changes at a rate $k = dB/dt$; induced electric field at distance $r$ from the centre',
    list1: ['A. Field at a point inside ($r<R$)', 'B. Field at a point outside ($r>R$)', 'C. Field at the boundary ($r=R$)', 'D. $\\oint\\vec E\\cdot d\\vec l$ round a circle of radius $r>R$'],
    list2: [r`p. $kR/2$`, r`q. $kr/2$`, r`r. $k\pi R^2$`, r`s. $\dfrac{kR^2}{2r}$`] },
  xi8: { title: 'Two coils of self-inductance $L_1$, $L_2$ and mutual inductance $M$',
    list1: ['A. Total inductance in series, fluxes aiding', 'B. Total inductance in series, fluxes opposing', 'C. Coupling coefficient', 'D. Greatest possible $M$'],
    list2: [r`p. $\sqrt{L_1L_2}$`, r`q. $L_1+L_2+2M$`, r`r. $L_1+L_2-2M$`, r`s. $\dfrac{M}{\sqrt{L_1L_2}}$`] },
  xip1: { title: 'A square loop entering a magnetic field',
    passage: r`<p>A square loop of side 0.2 m and resistance 0.1 $\Omega$ is pulled at a steady $2\ \mathrm{m\,s^{-1}}$ into a region of uniform field 0.5 T perpendicular to the loop. The field region is wide, and the loop is entering it with one side parallel to the boundary.</p>` },
  xip2: { title: 'A rod pulled across rails joined by a capacitor',
    passage: r`<p>A rod of mass 0.5 kg and length 0.5 m slides without friction on horizontal rails joined by a capacitor of 2 F (the rails have no resistance), in a vertical field of 1 T. A constant horizontal force of 2 N pulls the rod from rest.</p>` },
});

items.push(
  // ---------- Level 2 ----------
  n(2, 'magnetic flux', r`A coil of area $0.2\ \mathrm{m^2}$ is in a field of 0.5 T, with the normal at $60^\circ$ to the field. Find the flux (in Wb, 3 decimals).`, () => 0.5 * 0.2 * Math.cos(60 * Math.PI / 180), 0.001, 3,
    r`$\Phi = BA\cos\theta = 0.5\times0.2\times\cos60^\circ = 0.05$ Wb.`, { unit: 'Wb' }),
  n(2, 'motional emf', r`A rod 0.5 m long moves at $4\ \mathrm{m\,s^{-1}}$ at right angles to a field of 0.2 T (and to its own length). Find the emf across it (in V, 2 decimals).`, () => 0.2 * 0.5 * 4, 0.01, 2,
    r`$\varepsilon = Blv = 0.2\times0.5\times4 = 0.40$ V.`, { unit: 'V' }),
  m(2, 'Lenz\'s law', r`Lenz's law is a consequence of the conservation of`, 'energy', ['charge', 'linear momentum', 'mass'],
    r`The induced current opposes the change that causes it. If it helped the change, energy would be created from nothing, so Lenz's law expresses energy conservation.`),
  n(2, 'Faraday\'s law', r`A coil of 100 turns has the flux through each turn change by 0.02 Wb in 0.1 s. Find the induced emf (in V).`, () => 100 * 0.02 / 0.1, 0, 0,
    r`$\varepsilon = N\dfrac{\Delta\Phi}{\Delta t} = 100\times\dfrac{0.02}{0.1} = 20$ V.`, { unit: 'V' }),
  m(2, 'unit of inductance', r`The henry is equal to`, r`$\mathrm{V\,s\,A^{-1}}$`, [r`$\mathrm{V\,A\,s^{-1}}$`, r`$\mathrm{V\,s}$`, r`$\mathrm{A\,s\,V^{-1}}$`],
    r`$\varepsilon = L\,dI/dt$, so $L = \dfrac{\varepsilon\,\Delta t}{\Delta I}$ has the unit volt second per ampere (also $\mathrm{Wb\,A^{-1}}$ or $\Omega$ s).`),
  m(2, 'eddy currents', r`An induction furnace melts metals by using`, 'eddy currents induced in the metal by a rapidly changing field', ['the heating of the coil by the battery', 'electrostatic discharge', 'the magnetic force on the metal'],
    r`A rapidly alternating field induces large eddy currents in the metal, and the $I^2R$ heating melts it, without any contact.`),
  n(2, 'energy in an inductor', r`Find the energy stored in a 2 H inductor carrying 3 A (in J).`, () => 0.5 * 2 * 9, 0, 0,
    r`$U = \tfrac12LI^2 = \tfrac12\times2\times9 = 9$ J.`, { unit: 'J' }),
  // ---------- Level 3 ----------
  n(3, 'self-induction', r`A current in a 0.5 H coil falls from 4 A to zero in 0.02 s. Find the average induced emf (in V).`, () => 0.5 * 4 / 0.02, 0, 0,
    r`$|\varepsilon| = L\left|\dfrac{\Delta I}{\Delta t}\right| = 0.5\times\dfrac{4}{0.02} = 100$ V.`, { unit: 'V' }),
  n(3, 'mutual induction', r`Two coils have a mutual inductance of 0.2 H. The current in the first changes at $5\ \mathrm{A\,s^{-1}}$. Find the emf induced in the second (in V).`, () => 0.2 * 5, 0, 0,
    r`$\varepsilon_2 = M\dfrac{dI_1}{dt} = 0.2\times5 = 1$ V.`, { unit: 'V' }),
  n(3, 'rotating rod', r`A rod of length 1 m rotates at $20\ \mathrm{rad\,s^{-1}}$ about one end in a field of 0.5 T perpendicular to its plane of rotation. Find the emf between its ends (in V).`, () => 0.5 * 0.5 * 20 * 1, 0, 0,
    r`$\varepsilon = \tfrac12B\omega l^2 = \tfrac12\times0.5\times20\times1 = 5$ V.`, { unit: 'V' }),
  n(3, 'AC generator', r`A generator coil has 100 turns, area $0.05\ \mathrm{m^2}$ and turns at $100\ \mathrm{rad\,s^{-1}}$ in a field of 0.2 T. Find the peak emf (in V).`, () => 100 * 0.2 * 0.05 * 100, 0, 0,
    r`$\varepsilon_0 = NBA\omega = 100\times0.2\times0.05\times100 = 100$ V.`, { unit: 'V' }),
  n(3, 'induced charge', r`A coil of 10 turns and resistance 5 $\Omega$ has the flux through each turn change by 0.05 Wb. How much charge (in C) flows through it?`, () => 10 * 0.05 / 5, 0.005, 3,
    r`$Q = \dfrac{N\,\Delta\Phi}{R} = \dfrac{10\times0.05}{5} = 0.10$ C. The charge does not depend on how fast the flux changes.`, { unit: 'C' }),
  n(3, 'LR circuit', r`An inductor of 0.4 H is in series with a 20 $\Omega$ resistor. Find the time constant (in ms).`, () => 0.4 / 20 * 1000, 0, 0,
    r`$\tau = L/R = 0.4/20 = 0.02$ s $= 20$ ms.`, { unit: 'ms' }),
  n(3, 'LR circuit', r`A 10 V battery is connected to a 5 $\Omega$ resistor in series with a 1 H inductor. Find the current (in A, 2 decimals) 0.2 s after closing the switch.`, () => 2 * (1 - Math.exp(-1)), 0.01, 2,
    r`$\tau = L/R = 0.2$ s. $I = \dfrac\varepsilon R(1 - e^{-t/\tau}) = 2\times(1 - e^{-1}) = 2\times0.632 = 1.26$ A.`, { unit: 'A' }),
  n(3, 'self-inductance of a solenoid', r`A solenoid has 1000 turns, area $2\times10^{-4}\ \mathrm{m^2}$ and length 0.5 m. Find its self-inductance (in mH, 3 decimals).`, () => MU0 * 1000 ** 2 * 2e-4 / 0.5 * 1000, 0.002, 3,
    r`$L = \dfrac{\mu_0N^2A}{l} = \dfrac{4\pi\times10^{-7}\times10^6\times2\times10^{-4}}{0.5} = 5.03\times10^{-4}$ H $= 0.503$ mH.`, { unit: 'mH' }),
  n(3, 'sliding rod', r`A rod of length 0.4 m slides at $5\ \mathrm{m\,s^{-1}}$ on rails joined by a 2 $\Omega$ resistor in a field of 0.5 T. Find the mechanical power (in W) needed to keep it at constant speed.`, () => (0.5 * 0.4 * 5) ** 2 / 2, 0.005, 3,
    r`$\varepsilon = Blv = 1$ V, $I = 0.5$ A. $P = I^2R = 0.5$ W $= Fv$ with $F = BIl = 0.1$ N.`, { unit: 'W' }),
  n(3, 'induced electric field', r`A uniform field in a circular region of radius 0.1 m grows at $0.2\ \mathrm{T\,s^{-1}}$. Find the induced electric field at 0.05 m from the centre (in V/m, 3 decimals).`, () => 0.05 / 2 * 0.2, 0.0005, 3,
    r`$E\cdot2\pi r = \pi r^2\dfrac{dB}{dt}$, so $E = \dfrac r2\dfrac{dB}{dt} = \dfrac{0.05}{2}\times0.2 = 0.005\ \mathrm{V\,m^{-1}}$.`, { unit: 'V/m' }),
  n(3, 'sliding rod', r`A rod is pulled on smooth horizontal rails by a constant force of 0.2 N. The rails are joined by a 2 $\Omega$ resistor, the field is 0.5 T and the rod's length is 0.4 m. Find its terminal speed (in $\mathrm{m\,s^{-1}}$).`, () => 0.2 * 2 / (0.5 * 0.4) ** 2, 0, 0,
    r`At terminal speed $F = BIl = \dfrac{B^2l^2v}{R}$. $v = \dfrac{FR}{B^2l^2} = \dfrac{0.2\times2}{0.04} = 10\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  n(3, 'rotating disc', r`A metal disc of radius 0.2 m turns at $50\ \mathrm{rad\,s^{-1}}$ in a field of 0.4 T perpendicular to it. Find the emf between its centre and rim (in V, 2 decimals).`, () => 0.5 * 0.4 * 50 * 0.04, 0.01, 2,
    r`$\varepsilon = \tfrac12B\omega r^2 = \tfrac12\times0.4\times50\times0.04 = 0.40$ V.`, { unit: 'V' }),
  n(3, 'energy in an inductor', r`A 2 H inductor carrying 3 A is suddenly opened and the current falls to zero in 1 ms. Find the average emf induced (in V).`, () => 2 * 3 / 1e-3, 0, 0,
    r`$|\varepsilon| = L\dfrac{\Delta I}{\Delta t} = \dfrac{2\times3}{10^{-3}} = 6000$ V. This is why a spark appears at a switch that breaks an inductive circuit.`, { unit: 'V' }),
  n(3, 'AC generator', r`A coil of 50 turns and area $0.01\ \mathrm{m^2}$ is in a field $B = 0.2\sin(100t)$ T (perpendicular to the coil). Find the peak emf (in V).`, () => 50 * 0.01 * 0.2 * 100, 0, 0,
    r`$\varepsilon = -NA\dfrac{dB}{dt} = -50\times0.01\times20\cos(100t)$. The peak is $10$ V.`, { unit: 'V' }),
  m(3, 'direction of induced current', r`The north pole of a bar magnet is pushed towards a coil. Seen from the magnet's side, the induced current in the coil is`, 'anticlockwise, and the coil repels the magnet', ['clockwise, and the coil repels the magnet', 'anticlockwise, and the coil attracts the magnet', 'clockwise, and the coil attracts the magnet'],
    r`The flux (towards the coil) is increasing, so the coil opposes it by presenting a north face to the magnet. An anticlockwise current seen from that side gives a north face. A north face repels the approaching north pole (as Lenz's law requires).`),
  m(3, 'eddy currents', r`A strong magnet dropped down a thick copper tube falls very slowly because`, 'eddy currents in the tube exert an upward force that opposes the magnet\'s motion', ['copper is magnetic and attracts the magnet', 'air in the tube slows it', 'the magnet loses its magnetism'],
    r`The changing flux induces circulating currents in the copper. By Lenz's law they oppose the motion, so the magnet reaches a small terminal speed. Copper is not attracted to a magnet.`),
  a(3, 'eddy currents', 'A magnet takes much longer to fall through a copper tube than through a plastic tube of the same size.', 'Eddy currents are induced in the copper and, by Lenz\'s law, oppose the magnet\'s fall.', 0,
    r`No emf is induced in the plastic (a non-conductor shows no currents). In copper the currents' force opposes the motion. Both true, R explains A.`),
  t(3, 'Faraday\'s law', 'A steady current in a solenoid induces no emf in a nearby coil.', 'An emf is induced only when the flux through the coil changes.', 0,
    r`A steady current gives a steady field, and a constant flux means $d\Phi/dt = 0$. Both true, and II explains I.`),
  cn(3, 'concepts', 'How many of the following are correct?', ['Eddy currents can be used to heat metals.', 'The induced emf is proportional to the rate of change of flux.', 'An inductor opposes a change of current through it.', 'An inductor stores energy in an electric field.'], 3,
    r`(i) True (induction furnace). (ii) True: Faraday's law. (iii) True. (iv) False: an inductor stores energy in its magnetic field, $\tfrac12LI^2$. Three are correct.`),
  mt(3, 'induced emf', 'xi1', ['r', 's', 'p', 'q'], r`A: constant flux, so 0 (r). B: $\Phi = NBA\cos\omega t$, $\varepsilon = NBA\omega\sin\omega t$ (s). C: $Blv$ (p). D: $\int_0^lB\omega r\,dr = \tfrac12B\omega l^2$ (q).`),
  mt(3, 'LR circuit', 'xi2', ['s', 'r', 'p', 'q'], r`A: $I_{\infty} = \varepsilon/R = 3$ A (s). B: $\dfrac{dI}{dt} = \dfrac\varepsilon L = 6\ \mathrm{A\,s^{-1}}$ (r). C: $\tau = L/R = 0.5$ s (p). D: $\tfrac12LI^2 = \tfrac12\times2\times9 = 9$ J (q).`),
  mt(3, 'LR circuit', 'xi3', ['p', 'q', 'r', 's'], r`The inductor opposes the change: at $t=0$ the current is zero (p) and the whole emf appears across the inductor (q). At $t=\tau$: $1-e^{-1} = 0.63$ (r). At $t = 3\tau$: $1-e^{-3} = 0.95$ (s).`),
  mt(3, 'solenoid', 'xi4', ['q', 's', 'r', 'p'], r`$B = \mu_0nI$ (q). $L = \dfrac{N\Phi}{I} = \mu_0n^2Al$ (s). $U = \tfrac12LI^2 = \tfrac12\mu_0n^2AlI^2$ (r). Divide by the volume $Al$: $\tfrac12\mu_0n^2I^2 = \dfrac{B^2}{2\mu_0}$ (p).`),
  mt(3, 'AC generator', 'xi6', ['r', 'q', 'p', 's'], r`$\Phi = B_0A\sin\omega t$ and $\varepsilon = -\omega B_0A\cos\omega t$. At $t=0$: $|\varepsilon| = \omega B_0A$ (r). At $\omega t = \pi/2$: 0 (q). Peak flux $B_0A$ (p). The emf is a quarter-cycle ($\pi/2$) out of phase with the flux (s).`),
  // ---------- Level 4 ----------
  n(4, 'sliding on an incline', r`A rod of mass 0.05 kg and length 0.4 m falls under gravity along vertical rails joined at the bottom by a 1 $\Omega$ resistor, in a horizontal field of 0.5 T. Find its terminal speed (in $\mathrm{m\,s^{-1}}$, 1 decimal; $g=10$).`, () => 0.05 * 10 * 1 / (0.5 * 0.4) ** 2, 0.05, 1,
    r`At terminal speed $mg = BIl = \dfrac{B^2l^2v}{R}$. $v = \dfrac{mgR}{B^2l^2} = \dfrac{0.05\times10\times1}{0.04} = 12.5\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  n(4, 'stopping distance', r`A rod of mass 0.2 kg and length 0.4 m is given a speed of $5\ \mathrm{m\,s^{-1}}$ on smooth horizontal rails joined by a 2 $\Omega$ resistor in a field of 0.5 T. Find the distance it travels before stopping (in m).`, () => 0.2 * 5 * 2 / (0.5 * 0.4) ** 2, 0, 0,
    r`$m\dfrac{dv}{dt} = -\dfrac{B^2l^2v}{R}$ gives $m\,dv = -\dfrac{B^2l^2}{R}\,dx$, so $x = \dfrac{mv_0R}{B^2l^2} = \dfrac{0.2\times5\times2}{0.04} = 50$ m. (The heat produced is its initial kinetic energy, 2.5 J.)`, { unit: 'm' }),
  n(4, 'loop entering a field', r`A square loop of side 0.2 m and resistance 0.1 $\Omega$ is pulled at $2\ \mathrm{m\,s^{-1}}$ into a region of uniform field 0.5 T. Find the force needed to hold its speed while it is entering (in N, 2 decimals).`, () => (0.5 * 0.2 * 2) ** 2 / 0.1 * 0.2 / (0.5 * 0.2 * 2) * 1 * 0 + 0.5 * 0.2 * (0.5 * 0.2 * 2 / 0.1), 0.01, 2,
    r`$\varepsilon = Blv = 0.2$ V, $I = 2$ A. $F = BIl = 0.5\times2\times0.2 = 0.2$ N.`, { unit: 'N' }),
  n(4, 'induced charge', r`A square loop of side 0.2 m and resistance 0.1 $\Omega$ enters a field of 0.5 T completely. Find the total charge (in C) that flows through it.`, () => 0.5 * 0.04 / 0.1, 0.005, 3,
    r`$Q = \dfrac{\Delta\Phi}{R} = \dfrac{BA}{R} = \dfrac{0.5\times0.04}{0.1} = 0.2$ C.`, { unit: 'C' }),
  n(4, 'mutual inductance', r`A coil of 50 turns and area $4\times10^{-4}\ \mathrm{m^2}$ is wound closely round the middle of a long solenoid with 2000 turns per metre. Find the mutual inductance (in $\mu$H, 1 decimal).`, () => MU0 * 2000 * 50 * 4e-4 * 1e6, 0.2, 1,
    r`The solenoid's field is $B = \mu_0nI$, so the flux through each of the 50 turns is $\mu_0nIA$. $M = \dfrac{N_2\Phi}{I} = \mu_0nN_2A = 4\pi\times10^{-7}\times2000\times50\times4\times10^{-4} = 50.3\ \mu$H.`, { unit: 'μH' }),
  n(4, 'coupled inductors', r`Two coils of 0.2 H and 0.3 H have a mutual inductance of 0.1 H. Find the difference (in H) between their total inductance when connected in series with the fluxes aiding and with the fluxes opposing.`, () => 4 * 0.1, 0, 1,
    r`Aiding: $L_1+L_2+2M = 0.7$ H. Opposing: $L_1+L_2-2M = 0.3$ H. The difference is $4M = 0.4$ H.`, { unit: 'H' }),
  n(4, 'coupling coefficient', r`Two coils of 0.2 H and 0.3 H have $M = 0.1$ H. Find the coefficient of coupling $k = M/\sqrt{L_1L_2}$ (2 decimals).`, () => 0.1 / Math.sqrt(0.06), 0.01, 2,
    r`$k = \dfrac{0.1}{\sqrt{0.2\times0.3}} = \dfrac{0.1}{0.245} = 0.41$. It cannot exceed 1.`),
  n(4, 'LR circuit', r`A 10 $\Omega$ resistor and a 0.5 H inductor are connected in series to a battery. How long (in s, 3 decimals) after closing the switch does the current reach 90% of its final value?`, () => 0.05 * Math.log(10), 0.001, 3,
    r`$1 - e^{-t/\tau} = 0.9\Rightarrow t = \tau\ln10 = 0.05\times2.303 = 0.115$ s.`, { unit: 's' }),
  n(4, 'induced electric field', r`A uniform field in a circular region of radius 0.1 m grows at $0.2\ \mathrm{T\,s^{-1}}$. Find the induced electric field at 0.2 m from the centre (in V/m, 3 decimals).`, () => 0.1 ** 2 / (2 * 0.2) * 0.2, 0.0005, 3,
    r`Outside, the whole flux $\pi R^2B$ is enclosed: $E\cdot2\pi r = \pi R^2\dfrac{dB}{dt}$, so $E = \dfrac{R^2}{2r}\dfrac{dB}{dt} = \dfrac{0.01}{0.4}\times0.2 = 0.005\ \mathrm{V\,m^{-1}}$.`, { unit: 'V/m', trap: 'Outside the region the field falls as $1/r$.' }),
  n(4, 'motional emf', r`A straight wire carries 10 A. A rod of length 0.5 m is parallel to the wire, 0.1 m from it, and moves directly away from it at $2\ \mathrm{m\,s^{-1}}$. Find the emf (in $\mu$V, 1 decimal) across the rod at that moment.`, () => MU0 * 10 / (2 * Math.PI * 0.1) * 0.5 * 2 * 1e6, 0.1, 1,
    r`The field at 0.1 m is $B = \dfrac{\mu_0I}{2\pi r} = \dfrac{4\pi\times10^{-7}\times10}{2\pi\times0.1} = 2\times10^{-5}$ T. The rod moves at right angles to $B$ and to its own length: $\varepsilon = Blv = 2\times10^{-5}\times0.5\times2 = 2\times10^{-5}$ V $= 20\ \mu$V.`, { unit: 'μV' }),
  n(4, 'AC generator', r`A generator has a peak emf of 100 V. Find the average emf (in V, 1 decimal) over one half-cycle, taken as the magnitude of its mean.`, () => 2 * 100 / Math.PI, 0.1, 1,
    r`$\bar\varepsilon = \dfrac{2\varepsilon_0}{\pi} = 63.7$ V over a half-cycle (it is 0 over a whole cycle).`, { unit: 'V' }),
  n(4, 'heat in a loop', r`A square loop of side 0.2 m and resistance 0.1 $\Omega$ is pulled at $2\ \mathrm{m\,s^{-1}}$ completely into a field of 0.5 T. How much heat (in J, 3 decimals) is produced?`, () => (0.5 * 0.2) ** 2 * 0.2 * 2 / 0.1, 0.002, 3,
    r`While entering (0.1 s), the force is 0.2 N over a distance of 0.2 m: $W = Fl = 0.2\times0.2 = 0.04$ J, all of which appears as heat $\left(I^2Rt = 4\times0.1\times0.1\right)$.`, { unit: 'J' }),
  n(4, 'energy in the inductor', r`In a circuit with a 12 V battery, 4 $\Omega$ resistor and 2 H inductor in series, find at $t = \tau$ the rate (in W, 2 decimals) at which energy is stored in the inductor.`, () => { const I = 3 * (1 - Math.exp(-1)); const dI = 6 * Math.exp(-1); return 2 * I * dI; }, 0.02, 2,
    r`$\tau = 0.5$ s. $I = 3(1-e^{-1}) = 1.896$ A and $\dfrac{dI}{dt} = \dfrac\varepsilon Le^{-1} = 6\times0.368 = 2.207\ \mathrm{A\,s^{-1}}$. $\dfrac{dU}{dt} = LI\dfrac{dI}{dt} = 2\times1.896\times2.207 = 8.37$ W.`, { unit: 'W' }),
  m(4, 'rotating rod', r`A conducting rod of length $l$ rotates at $\omega$ about its midpoint in a uniform field $B$ perpendicular to its plane. The emf between its two ends is`, 'zero', [r`$\tfrac12B\omega l^2$`, r`$\tfrac14B\omega l^2$`, r`$\tfrac18B\omega l^2$`],
    r`Each half has an emf $\tfrac12B\omega\left(\dfrac l2\right)^2 = \tfrac18B\omega l^2$ between the centre and its end, with the same sign relative to the centre. Both ends are at the same potential, so the emf between the ends is zero (each is $\tfrac18B\omega l^2$ from the centre).`, { trap: 'The two ends are at the same potential; the centre is at a different one.' }),
  s(4, 'Lenz\'s law', r`Which statements are correct?`,
    ['The induced current opposes the change in flux.', 'The induced current always opposes the applied magnetic field.', 'Lenz\'s law follows from conservation of energy.', 'No emf is induced in a loop through which the flux is constant.'], [0, 2, 3],
    r`It opposes the change of flux, not the field itself (if the flux is decreasing the induced field adds to the applied one: B false). The other three are correct.`),
  s(5, 'sliding rod', r`A rod is pulled by a constant force $F$ from rest on frictionless horizontal rails joined by a resistor $R$, in a uniform vertical field. Which statements are correct?`,
    [r`The emf is proportional to its speed.`, 'The magnetic force on the rod opposes its motion.', r`At terminal speed, the power supplied by $F$ equals $I^2R$.`, 'The speed increases without limit.'], [0, 1, 2],
    r`$\varepsilon = Blv$ (A). By Lenz's law the force is backward (B). At terminal speed there is no acceleration, so $Fv = I^2R$ (C). The speed approaches $FR/B^2l^2$ (D false).`),
  s(4, 'self-induction', r`Which statements about self-inductance are correct?`,
    ['It depends on the geometry of the coil and its core.', r`$L = \Phi/I$ (flux linkage per unit current).`, 'Its SI unit is the henry.', 'A steady current through the coil induces a steady emf in it.'], [0, 1, 2],
    r`$L$ is fixed by the number of turns, area, length and core (A, B). Henry = V s/A (C). A steady current gives no change of flux, so no emf (D false).`),
  s(5, 'LR circuit', r`A battery is connected to a resistor and inductor in series at $t=0$. Which statements are correct?`,
    ['The current rises linearly with time.', 'At $t=0$ the inductor behaves like an open circuit.', 'After a long time it behaves like a plain wire.', r`The time constant is $L/R$.`], [1, 2, 3],
    r`The current rises exponentially, not linearly (A false). At $t=0$ no current flows because the inductor opposes the change (B). In the steady state $dI/dt = 0$, so no voltage across it (C). $\tau = L/R$ (D).`),
  s(4, 'eddy currents', r`Which statements about eddy currents are correct?`,
    ['They are used in induction furnaces.', 'They are used in magnetic braking of trains.', 'They are negligible in a solid iron transformer core.', 'They are reduced by laminating the core.'], [0, 1, 3],
    r`A and B are applications. In a solid core they are large and waste energy (C false). Thin insulated laminations break their paths and raise the resistance (D).`),
  s(5, 'induced electric field', r`The electric field induced by a changing magnetic field has which of these properties?`,
    ['It is non-conservative.', 'It can exist even where there is no conductor.', 'Its field lines form closed loops.', 'It is the same as an electrostatic field.'], [0, 1, 2],
    r`$\oint\vec E\cdot d\vec l = -\dfrac{d\Phi}{dt}\ne0$, so it is non-conservative (A), with closed loops (C), and exists in empty space (B). An electrostatic field starts and ends on charges and has $\oint\vec E\cdot d\vec l = 0$ (D false).`),
  s(4, 'AC generator', r`A coil of $N$ turns rotates in a uniform field. Which statements are correct?`,
    [r`The peak emf is $NBA\omega$.`, r`The frequency of the emf is $\omega/2\pi$.`, 'The emf is greatest when the plane of the coil is parallel to the field.', 'The emf is greatest when the flux through the coil is greatest.'], [0, 1, 2],
    r`$\Phi = NBA\cos\omega t$, $\varepsilon = NBA\omega\sin\omega t$: peak $NBA\omega$ (A), frequency $\omega/2\pi$ (B). The emf peaks when $d\Phi/dt$ is largest, which is when the flux is zero (coil parallel to the field), not when it is maximum (C true, D false).`),
  s(5, 'mutual inductance', r`Which statements about two coils with mutual inductance $M$ are correct?`,
    [r`$M_{12} = M_{21}$.`, 'It depends on their relative position and orientation.', r`$M\le\sqrt{L_1L_2}$.`, r`$M$ can exceed $\sqrt{L_1L_2}$ for tightly coupled coils.`], [0, 1, 2],
    r`Reciprocity gives $M_{12} = M_{21}$ (A). Less flux links when they are apart or at right angles (B). The coupling coefficient $k = M/\sqrt{L_1L_2}\le1$ (C true, D false).`),
  s(5, 'rotating rod', r`A rod of length $l$ rotates at $\omega$ about its midpoint in a uniform field $B$ perpendicular to its plane. Which statements are correct?`,
    [r`The emf between the centre and an end is $\tfrac18B\omega l^2$.`, 'The emf between the two ends is zero.', r`The emf between the two ends is $\tfrac12B\omega l^2$.`, 'The centre is at a different potential from both ends.'], [0, 1, 3],
    r`Each half is a rod of length $l/2$ rotating about an end: $\tfrac12B\omega(l/2)^2 = \tfrac18B\omega l^2$ (A). Both ends are at the same potential, so the end-to-end emf is 0 (B true, C false), and the centre differs from both (D).`),
  s(4, 'energy in a magnetic field', r`Which statements about energy and inductors are correct?`,
    [r`The energy stored is $\tfrac12LI^2$.`, 'The energy is stored in the magnetic field.', r`The energy density is $B^2/2\mu_0$.`, 'At fixed $n$ and $I$, the energy of a solenoid does not depend on its length.'], [0, 1, 2],
    r`$U = \tfrac12LI^2$ with $L = \mu_0n^2Al$ is proportional to the length $l$ (D false), in line with the density $B^2/2\mu_0$ times the volume.`),
  mt(4, 'rod on rails', 'xi5', ['p', 'q', 'r', 's'], r`A constant force: $F = \dfrac{B^2l^2v}{R}$, $v = \dfrac{FR}{B^2l^2}$ (p). Falling: $mg$ replaces $F$ (q). Stopping distance $\dfrac{mv_0R}{B^2l^2}$ (r). With a capacitor $F - BIl = ma$ and $I = CBl\,a$, so $a = \dfrac{F}{m+CB^2l^2}$: the capacitor adds mass $CB^2l^2$ (s).`),
  mt(4, 'induced electric field', 'xi7', ['q', 's', 'p', 'r'], r`Inside: $E\,2\pi r = \pi r^2k\Rightarrow E = kr/2$ (q). Outside: $E = \dfrac{kR^2}{2r}$ (s). At $r = R$: $kR/2$ (p). The line integral round a circle outside is the emf $k\pi R^2$ (r).`),
  mt(4, 'coupled inductors', 'xi8', ['q', 'r', 's', 'p'], r`Aiding: $L_1+L_2+2M$ (q). Opposing: $L_1+L_2-2M$ (r). $k = M/\sqrt{L_1L_2}$ (s). The greatest $M$ occurs at $k=1$: $\sqrt{L_1L_2}$ (p).`),
  a(4, 'motional emf', 'An emf can be induced across a metal rod moving in a magnetic field even if the rod is not part of any closed circuit.', 'The magnetic force on the free electrons in the moving rod separates charges, setting up a potential difference.', 0,
    r`Both are true. The force $q\vec v\times\vec B$ pushes electrons to one end until an electric field balances it. No current flows, but the emf exists. R explains A.`),
  a(4, 'AC generator', 'The induced emf in a rotating coil is zero when the flux through it is maximum.', 'The emf equals $-d\Phi/dt$, which is zero where the flux is at its maximum.', 0,
    r`At the maximum of $\Phi(t)$ the slope is zero, so $\varepsilon = 0$. Both true, R explains A.`),
  a(4, 'eddy currents', 'The core of a transformer is made of thin insulated laminations rather than a solid block.', 'The laminations raise the resistance of the paths for eddy currents, which reduces the heating.', 0,
    r`Eddy currents need closed loops across the core. Insulated layers cut the loops, so the currents and the heat are much smaller. Both true, R explains A.`),
  a(5, 'self-inductance', 'The self-inductance of a coil rises when an iron core is put inside it.', 'Iron increases the magnetic flux produced by a given current.', 0,
    r`$L = \dfrac{N\Phi}{I}$ and $\Phi$ rises by the relative permeability $\mu_r$ (hundreds for iron). Both true, R explains A.`),
  t(4, 'induced electric field', 'The electric field induced by a changing magnetic flux is conservative.', 'It is produced by a time-varying magnetic field.', 3,
    r`I is false: $\oint\vec E\cdot d\vec l\ne0$, so it is non-conservative. II is true.`),
  t(4, 'Faraday\'s law', 'The induced emf in a coil is proportional to the flux through it.', 'The induced emf is proportional to the rate of change of flux.', 3,
    r`I is false: a large steady flux gives no emf. II is true: $\varepsilon = -d\Phi/dt$.`),
  t(4, 'mutual inductance', 'The mutual inductance of two coils depends on their relative orientation.', 'The flux linking one coil due to a current in the other depends on how they are placed.', 0,
    r`Both true, and II explains I.`),
  cn(4, 'concepts', 'How many of the following are correct?', ['Magnetic flux is a vector.', 'Lenz\'s law follows from the conservation of energy.', 'If the number of turns of a long solenoid is doubled (same length and area), its inductance becomes four times as large.', 'The induced current in a closed loop does not depend on its resistance.'], 2,
    r`(i) False: flux is a scalar. (ii) True. (iii) True: $L\propto N^2$. (iv) False: $I = \varepsilon/R$. Two are correct.`),
  // ---------- Level 5 ----------
  n(5, 'rod and capacitor', r`A rod of mass 0.5 kg and length 0.5 m slides on frictionless horizontal rails joined by a capacitor of 2 F, in a vertical field of 1 T, pulled by a constant force of 2 N from rest. Find its acceleration (in $\mathrm{m\,s^{-2}}$).`, () => 2 / (0.5 + 2 * 1 * 0.25), 0, 0,
    r`The emf $Blv$ charges the capacitor: $q = CBlv$ and $I = CBl\,a$. Newton: $F - BIl = ma$, so $F = (m + CB^2l^2)a$. $a = \dfrac{2}{0.5+2\times1\times0.25} = \dfrac{2}{1} = 2\ \mathrm{m\,s^{-2}}$, constant.`, { unit: 'm/s²', trap: 'The acceleration is uniform even though the speed grows.' }),
  n(5, 'mutual inductance of a loop and a wire', r`A square loop of side 0.2 m lies in the plane of a long straight wire, with its near side parallel to the wire and 0.2 m from it. Find the mutual inductance (in nH, 1 decimal).`, () => MU0 * 0.2 / (2 * Math.PI) * Math.log(2) * 1e9, 0.1, 1,
    r`At distance $x$ the field is $\dfrac{\mu_0I}{2\pi x}$. The flux through the loop is $\int_{0.2}^{0.4}\dfrac{\mu_0I}{2\pi x}(0.2)\,dx = \dfrac{\mu_0I(0.2)}{2\pi}\ln2$. $M = \dfrac{\Phi}{I} = 2\times10^{-7}\times0.2\times0.693 = 2.77\times10^{-8}$ H $= 27.7$ nH.`, { unit: 'nH' }),
  n(5, 'sliding on an incline', r`A rod of mass 0.1 kg and length 0.5 m slides without friction down rails inclined at $30^\circ$, joined by a 0.5 $\Omega$ resistor, in a vertical field of 1 T. Find its terminal speed (in $\mathrm{m\,s^{-1}}$, 2 decimals; $g=10$).`, () => 0.1 * 10 * 0.5 * 0.5 / (1 * 0.25 * 0.75), 0.02, 2,
    r`With the rod moving along the incline at $v$, the component of its velocity perpendicular to the vertical field is $v\cos\theta$: $\varepsilon = Blv\cos\theta$, $I = \varepsilon/R$. The force $BIl$ is horizontal, and its component along the incline is $BIl\cos\theta$. At terminal speed $mg\sin\theta = \dfrac{B^2l^2v\cos^2\theta}{R}$. $v = \dfrac{0.1\times10\times0.5\times0.5}{0.25\times0.75} = 1.33\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'The field is vertical, so $\\cos\\theta$ appears twice.' }),
  n(5, 'induced charge and time', r`A circular coil of radius 0.1 m and 20 turns, resistance 2 $\Omega$, is turned through $180^\circ$ about a diameter in a uniform field of 0.5 T that was perpendicular to its plane. Find the charge (in C, 3 decimals) that flows.`, () => 20 * 2 * 0.5 * Math.PI * 0.01 / 2, 0.002, 3,
    r`The flux changes from $+BA$ to $-BA$: $\Delta\Phi = 2BA$ per turn. $Q = \dfrac{N\Delta\Phi}{R} = \dfrac{20\times2\times0.5\times\pi\times0.01}{2} = 0.314$ C.`, { unit: 'C' }),
  n(5, 'rod with an inductor', r`A rod of length 0.5 m slides on frictionless rails in a field of 1 T and starts with speed $4\ \mathrm{m\,s^{-1}}$. The rails are joined by a resistor of 0.5 $\Omega$. How much heat (in J) is produced by the time the rod has stopped, if its mass is 0.5 kg?`, () => 0.5 * 0.5 * 16, 0, 0,
    r`All the initial kinetic energy ends as heat: $\tfrac12mv_0^2 = \tfrac12\times0.5\times16 = 4$ J (the rod stops after travelling $mv_0R/B^2l^2 = 4$ m).`, { unit: 'J' }),
  n(5, 'energy transfer', r`A 12 V battery drives a 4 $\Omega$ resistor in series with a 2 H inductor. When the current has reached its final value, the switch is opened and a 4 $\Omega$ resistor is left in a closed loop with the inductor. Find the total heat (in J) produced in the resistor afterwards.`, () => 0.5 * 2 * 9, 0, 0,
    r`The final current is $12/4 = 3$ A. The stored energy $\tfrac12LI^2 = \tfrac12\times2\times9 = 9$ J is all dissipated as heat in the loop's resistance.`, { unit: 'J' }),
  s(5, 'rod and capacitor', r`A rod is pulled by a constant force from rest on frictionless rails joined by a capacitor, in a uniform field perpendicular to the plane. Which statements are correct?`,
    ['The acceleration of the rod is constant.', 'The current in the circuit is constant.', 'The speed of the rod grows without limit (no terminal speed).', 'The energy stored in the capacitor always equals the kinetic energy of the rod, whatever the mass, capacitance, field and rod length.'], [0, 1, 2],
    r`$a = \dfrac F{m+CB^2l^2}$ is constant (A), so $v = at$, $q = CBlat$ and $I = CBla$ is constant (B). There is no terminal speed (C). The capacitor's energy is $\dfrac{q^2}{2C} = \tfrac12CB^2l^2v^2$, and the work done by $F$ is shared between it and the rod's $\tfrac12mv^2$ in the ratio $CB^2l^2:m$. The two are equal only when $CB^2l^2 = m$, so D is false in general. (No energy is lost: with no resistance the work done by $F$ goes into these two stores.)`),
  s(5, 'loop entering a field', r`A square loop is pulled at constant speed into a region of uniform field (perpendicular to it) and then moves entirely inside. Which statements are correct?`,
    ['A current flows while the loop is entering.', 'No current flows once it is completely inside.', 'A force is needed to keep it moving at constant speed only while it is entering.', 'The total charge that flows while entering depends on the speed.'], [0, 1, 2],
    r`Current flows while the flux changes (entering) and stops when the whole loop is in the uniform field (A, B). The magnetic force exists only during entering (C). The charge $Q = \Delta\Phi/R$ does not depend on the speed (D false).`),
  mt(5, 'AC generator', 'xi6', ['r', 'q', 'p', 's'], r`The same as the earlier set: $\varepsilon(0)$ maximal $\omega B_0A$ (r); 0 at the flux maximum (q); peak flux $B_0A$ (p); a quarter cycle phase difference (s).`),
);
items.pop();
items.push(
  a(5, 'rotating rod', 'The emf between the two ends of a rod rotating about its midpoint in a uniform field perpendicular to its plane is zero.', 'Each half of the rod has the same emf between the centre and its own end, with the centre at a different potential.', 0,
    r`Each half has emf $\tfrac18B\omega l^2$ in the same sense with respect to the centre. The two ends are at the same potential, so the net end-to-end emf is zero. Both true, and R explains A.`),
  t(5, 'energy transfer', 'The energy stored in an inductor is released as heat in the resistor when the battery is removed from an LR circuit.', 'The current decays through the closed loop, with $I^2R$ heating.', 0,
    r`Both true. The total heat equals $\tfrac12LI_0^2$, and II explains how.`),
  cn(5, 'concepts', 'How many of the following are correct?', ['The induced emf in a rod moving in a field exists even in an open circuit.', 'The mutual inductance of two coils cannot exceed $\\sqrt{L_1L_2}$.', 'In an LR circuit the current at $t=\\tau$ is 63% of its final value.', 'A capacitor in series with a moving rod on rails makes the rod stop at a terminal speed.'], 3,
    r`(i) True. (ii) True. (iii) True. (iv) False: with a capacitor the rod has a constant acceleration, no terminal speed. Three are correct.`),
);

items.push(
  pn(3, 'loop entering a field', 'xip1', r`Find the emf induced while it enters (in V, 2 decimals).`, () => 0.5 * 0.2 * 2, 0.01, 2,
    r`Only the side that is moving through the field produces emf: $\varepsilon = Blv = 0.5\times0.2\times2 = 0.20$ V.`, { unit: 'V' }),
  pn(4, 'loop entering a field', 'xip1', r`Find the force (in N, 2 decimals) needed to keep the speed constant while it enters.`, () => 0.5 * (0.2 / 0.1) * 0.2, 0.01, 2,
    r`$I = \varepsilon/R = 0.2/0.1 = 2$ A. $F = BIl = 0.5\times2\times0.2 = 0.20$ N, opposing the motion.`, { unit: 'N' }),
  pn(4, 'loop entering a field', 'xip1', r`Find the total heat (in J, 3 decimals) produced while the loop enters completely.`, () => 0.2 * 0.2, 0.002, 3,
    r`The loop takes $0.2/2 = 0.1$ s. $Q = I^2Rt = 4\times0.1\times0.1 = 0.04$ J, which equals $F\times0.2$ m.`, { unit: 'J' }),
  pn(4, 'rod and capacitor', 'xip2', r`Find the acceleration of the rod (in $\mathrm{m\,s^{-2}}$).`, () => 2 / (0.5 + 2 * 0.25), 0, 0,
    r`With $I = CBl\,a$ and $F - BIl = ma$: $a = \dfrac F{m+CB^2l^2} = \dfrac{2}{0.5+2\times1\times0.25} = 2\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  pn(5, 'rod and capacitor', 'xip2', r`Find the charge on the capacitor 3 s after the start (in C).`, () => 2 * 1 * 0.5 * (2 * 3), 0, 0,
    r`$v = at = 6\ \mathrm{m\,s^{-1}}$. The capacitor voltage equals the emf $Blv = 1\times0.5\times6 = 3$ V. $q = CV = 2\times3 = 6$ C.`, { unit: 'C' }),
  pn(5, 'rod and capacitor', 'xip2', r`Find the energy stored in the capacitor at that time (in J).`, () => 0.5 * 2 * 3 ** 2, 0, 0,
    r`$U = \tfrac12CV^2 = \tfrac12\times2\times9 = 9$ J. (The rod's kinetic energy is $\tfrac12\times0.5\times36 = 9$ J, and the force has done $2\times9 = 18$ J of work over the 9 m travelled.)`, { unit: 'J' }),
);

gens.push(
  gx(3, 'nat', 'Faraday\'s law', (rng) => {
    const N = pick(rng, 20, 200, 10); const A = pick(rng, 0.01, 0.1, 0.01); const dB = pick(rng, 0.2, 2, 0.2); const dt = pick(rng, 0.05, 0.5, 0.05);
    const e = N * A * dB / dt;
    return { N, A, dB, dt, q: `A coil of ${N} turns and area ${A} m² has the field through it (along its normal) raised uniformly by ${dB} T in ${dt} s. Find the induced emf (in V, 2 decimals).`, answer: +e.toFixed(2), tol: 0.01, unit: 'V',
      sol: `$|\\varepsilon| = NA\\dfrac{\\Delta B}{\\Delta t} = ${N}\\times${A}\\times\\dfrac{${dB}}{${dt}} = ${e.toFixed(2)}$ V.` };
  }, (p) => { const phi1 = 0; const phi2 = p.A * p.dB; return Math.abs(p.N * (phi2 - phi1) / p.dt); }),
  gx(3, 'nat', 'sliding rod', (rng) => {
    const B = pick(rng, 0.2, 1, 0.1); const l = pick(rng, 0.2, 1, 0.1); const v = pick(rng, 2, 10, 1); const R = pick(rng, 1, 5, 1);
    const P = (B * l * v) ** 2 / R;
    return { B, l, v, R, q: `A rod of length ${l} m moves at ${v} m/s on rails joined by a ${R} Ω resistor, in a field of ${B} T perpendicular to the plane. Find the power (in W, 3 decimals) needed to keep it at constant speed.`, answer: +P.toFixed(3), tol: 0.002, unit: 'W',
      sol: `$\\varepsilon = Blv = ${+(B * l * v).toFixed(3)}$ V. $I = \\varepsilon/R$. $P = \\varepsilon^2/R = ${P.toFixed(3)}$ W (equal to $Fv$ with $F = BIl$).` };
  }, (p) => { const I = p.B * p.l * p.v / p.R; const F = p.B * I * p.l; return F * p.v; }),
  gx(4, 'nat', 'LR growth', (rng) => {
    const E = pick(rng, 6, 24, 2); const R = pick(rng, 2, 10, 1); const L = pick(rng, 0.5, 4, 0.5); const k = pick(rng, 0.5, 3, 0.5);
    const tau = L / R; const t0 = k * tau; const I = E / R * (1 - Math.exp(-k));
    return { E, R, L, k, q: `A ${E} V battery is joined to a ${R} Ω resistor and a ${L} H inductor in series. Find the current (in A, 3 decimals) at $t = ${k}\\tau$ after the switch is closed.`, answer: +I.toFixed(3), tol: 0.003, unit: 'A',
      sol: `$\\tau = L/R = ${tau.toFixed(3)}$ s. $I = \\dfrac ER(1 - e^{-t/\\tau}) = ${+(E / R).toFixed(3)}\\times(1 - e^{-${k}}) = ${I.toFixed(3)}$ A.` };
  }, (p) => { const tau = p.L / p.R; const T = p.k * tau; const steps = 200000; const dt = T / steps; let i = 0; for (let s = 0; s < steps; s++) { i += dt * (p.E - i * p.R) / p.L; } return i; }),
  gx(4, 'nat', 'stopping distance', (rng) => {
    const m1 = pick(rng, 0.1, 1, 0.1); const v0 = pick(rng, 2, 10, 1); const R = pick(rng, 1, 5, 1); const B = pick(rng, 0.2, 1, 0.1); const l = pick(rng, 0.2, 1, 0.1);
    const x = m1 * v0 * R / (B * l) ** 2;
    return { m1, v0, R, B, l, q: `A ${m1} kg rod of length ${l} m is given ${v0} m/s on smooth rails joined by a ${R} Ω resistor in a field of ${B} T. Find the distance (in m, 2 decimals) it travels before stopping.`, answer: +x.toFixed(2), tol: 0.02, unit: 'm',
      sol: `$x = \\dfrac{mv_0R}{B^2l^2} = \\dfrac{${m1}\\times${v0}\\times${R}}{(${B}\\times${l})^2} = ${x.toFixed(2)}$ m.` };
  }, (p) => { const k = (p.B * p.l) ** 2 / (p.R * p.m1); return p.v0 / k; }),
  gx(4, 'nat', 'rotating rod', (rng) => {
    const B = pick(rng, 0.1, 1, 0.1); const w = pick(rng, 5, 60, 5); const l = pick(rng, 0.2, 1.5, 0.1);
    const e = 0.5 * B * w * l * l;
    return { B, w, l, q: `A rod of length ${l} m rotates at ${w} rad/s about one end in a field of ${B} T perpendicular to its plane. Find the emf between its ends (in V, 3 decimals).`, answer: +e.toFixed(3), tol: 0.002, unit: 'V',
      sol: `$\\varepsilon = \\tfrac12B\\omega l^2 = \\tfrac12\\times${B}\\times${w}\\times${l}^2 = ${e.toFixed(3)}$ V.` };
  }, (p) => { let sum = 0; const n2 = 100000; const dr = p.l / n2; for (let i = 0; i < n2; i++) { const r2 = (i + 0.5) * dr; sum += p.B * p.w * r2 * dr; } return sum; }),
  gx(3, 'nat', 'self-inductance of a solenoid', (rng) => {
    const N = pick(rng, 200, 2000, 100); const A = pick(rng, 1, 10, 1) * 1e-4; const l = pick(rng, 0.2, 1, 0.1);
    const L = MU0 * N * N * A / l * 1000;
    return { N, A, l, q: `A long solenoid has ${N} turns, area ${A * 1e4} cm² and length ${l} m. Find its self-inductance (in mH, 3 decimals).`, answer: +L.toFixed(3), tol: 0.003, unit: 'mH',
      sol: `$L = \\dfrac{\\mu_0N^2A}{l} = \\dfrac{4\\pi\\times10^{-7}\\times${N}^2\\times${+(A * 1e4).toFixed(1)}\\times10^{-4}}{${l}} = ${L.toFixed(3)}$ mH.` };
  }, (p) => { const n1 = p.N / p.l; const B1 = MU0 * n1; const phi = B1 * p.A; return p.N * phi * 1000; }),
  gx(4, 'nat', 'rod and capacitor', (rng) => {
    const F = pick(rng, 1, 5, 1); const m1 = pick(rng, 0.2, 1, 0.1); const C = pick(rng, 0.5, 3, 0.5); const B = pick(rng, 0.5, 2, 0.5); const l = pick(rng, 0.2, 1, 0.1);
    const a = F / (m1 + C * B * B * l * l);
    return { F, m1, C, B, l, q: `A ${m1} kg rod of length ${l} m is pulled by a constant force of ${F} N on smooth rails joined by a ${C} F capacitor, in a field of ${B} T perpendicular to the plane. Find its acceleration (in m/s², 3 decimals).`, answer: +a.toFixed(3), tol: 0.003, unit: 'm/s²',
      sol: `$I = CBl\\,a$ and $F - BIl = ma$, so $a = \\dfrac{F}{m + CB^2l^2} = \\dfrac{${F}}{${m1}+${C}\\times${B}^2\\times${l}^2} = ${a.toFixed(3)}$ m/s².` };
  }, (p) => { let lo = 0; let hi = 1e3; for (let i = 0; i < 200; i++) { const aa = (lo + hi) / 2; const net = p.F - p.B * (p.C * p.B * p.l * aa) * p.l - p.m1 * aa; if (net > 0) lo = aa; else hi = aa; } return (lo + hi) / 2; }),
  gx(4, 'nat', 'heat in a loop', (rng) => {
    const B = pick(rng, 0.2, 1, 0.1); const s = pick(rng, 0.1, 0.5, 0.1); const v = pick(rng, 1, 5, 1); const R = pick(rng, 0.1, 1, 0.1);
    const Q = (B * s * v) ** 2 / R * (s / v);
    return { B, s, v, R, q: `A square loop of side ${s} m and resistance ${R} Ω is pulled at ${v} m/s completely into a field of ${B} T. Find the heat produced (in mJ, 3 decimals).`, answer: +(Q * 1000).toFixed(3), tol: 0.003, unit: 'mJ',
      sol: `$\\varepsilon = Bsv$, $I = \\varepsilon/R$, time $= s/v$. $Q = I^2R\\,t = \\dfrac{B^2s^3v}{R} = ${(Q * 1000).toFixed(3)}$ mJ.` };
  }, (p) => { const F = p.B * (p.B * p.s * p.v / p.R) * p.s; return F * p.s * 1000; }),
  gx(3, 'mcq', 'direction of induced current', (rng) => {
    const pole = choose(rng, ['north', 'south']); const toward = rng() < 0.5;
    const nearN = (pole === 'north') === toward; // near face is north if (N towards) or (S away)
    const dir = nearN ? 'anticlockwise' : 'clockwise'; const force = toward ? 'repels' : 'attracts';
    const ans = `${dir}, and the coil ${force} the magnet`;
    const o = shuffleOpts(rng, ans, [`${nearN ? 'clockwise' : 'anticlockwise'}, and the coil ${force} the magnet`, `${dir}, and the coil ${toward ? 'attracts' : 'repels'} the magnet`, `${nearN ? 'clockwise' : 'anticlockwise'}, and the coil ${toward ? 'attracts' : 'repels'} the magnet`]);
    return { pole, toward, opts: o.options, ans, q: `The ${pole} pole of a bar magnet is moved ${toward ? 'towards' : 'away from'} a coil. Seen from the magnet's side, the induced current in the coil is`, options: o.options, answer: o.answer,
      sol: `The coil opposes the change in flux. ${toward ? 'Approaching' : 'Receding'}: it ${toward ? 'repels' : 'attracts'} the magnet, so its near face is ${nearN ? 'a north face' : 'a south face'}. A north face is an anticlockwise current seen from that side, and a south face is clockwise. So ${dir}, and it ${force} the magnet.`, trap: 'Oppose the change, not the flux itself.' };
  }, (p) => { const nearN = (p.pole === 'north') === p.toward; const want = `${nearN ? 'anticlockwise' : 'clockwise'}, and the coil ${p.toward ? 'repels' : 'attracts'} the magnet`; return p.opts.indexOf(want); }),
  gx(4, 'mcq', 'LR circuit', (rng) => {
    const k = choose(rng, [2, 3, 4]); const what = choose(rng, ['R', 'L']);
    const tauF = what === 'R' ? `1/${k}` : `${k}`; const IF = what === 'R' ? `1/${k}` : 'unchanged';
    const ans = `the time constant becomes ${tauF} of its value and the final current becomes ${what === 'R' ? '1/' + k + ' of its value' : 'unchanged'}`;
    const wr = what === 'R' ? [`the time constant becomes ${k} times its value and the final current becomes 1/${k} of its value`, `the time constant becomes 1/${k} of its value and the final current is unchanged`, `the time constant is unchanged and the final current becomes 1/${k} of its value`] : [`the time constant becomes ${k} times its value and the final current becomes ${k} times its value`, `the time constant is unchanged and the final current becomes ${k} times its value`, `the time constant becomes 1/${k} of its value and the final current is unchanged`];
    const o = shuffleOpts(rng, ans, wr);
    return { k, what, opts: o.options, ans, q: `In an LR circuit on a steady battery, ${what === 'R' ? 'the resistance' : 'the inductance'} is multiplied by ${k} (everything else unchanged). Then`, options: o.options, answer: o.answer,
      sol: what === 'R' ? `$\\tau = L/R$ falls to $1/${k}$ and $I_\\infty = \\varepsilon/R$ falls to $1/${k}$.` : `$\\tau = L/R$ becomes ${k} times larger, but $I_\\infty = \\varepsilon/R$ does not involve $L$.`, trap: 'The final current depends only on $R$.' };
  }, (p) => p.opts.indexOf(p.ans)),
  gx(5, 'nat', 'mutual inductance of a loop and a wire', (rng) => {
    const a = pick(rng, 0.1, 0.5, 0.1); const d = pick(rng, 0.1, 0.5, 0.1);
    const M = MU0 * a / (2 * Math.PI) * Math.log((d + a) / d) * 1e9;
    return { a, d, q: `A square loop of side ${a} m lies in the plane of a long straight wire, with its near side parallel to the wire at a distance of ${d} m. Find the mutual inductance (in nH, 2 decimals).`, answer: +M.toFixed(2), tol: 0.02, unit: 'nH',
      sol: `$\\Phi = \\int_d^{d+a}\\dfrac{\\mu_0I}{2\\pi x}a\\,dx = \\dfrac{\\mu_0Ia}{2\\pi}\\ln\\dfrac{d+a}{d}$. $M = \\Phi/I = ${M.toFixed(2)}$ nH.` };
  }, (p) => { let s = 0; const n3 = 200000; const dx = p.a / n3; for (let i = 0; i < n3; i++) { const x = p.d + (i + 0.5) * dx; s += MU0 / (2 * Math.PI * x) * p.a * dx; } return s * 1e9; }),
);

}

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'electromagnetic-induction', groups, items, gens }, ['ei-g20']);
