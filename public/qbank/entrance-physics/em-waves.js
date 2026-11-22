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
const nid = () => `ew-${String(++k).padStart(3, '0')}`;
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
const C = 3e8; const E0P = 8.85e-12; const HC = 1.986e-25;
const D = Math.PI / 180;
const items = [
  // ---------- Level 1 ----------
  mcq(1, 'nature of EM waves', r`Electromagnetic waves in free space are`, 'transverse, with $\\vec E$ and $\\vec B$ at right angles to each other and to the direction of travel', ['longitudinal, with $\\vec E$ along the direction of travel', 'transverse, with $\\vec E$ and $\\vec B$ parallel to each other', 'longitudinal, with $\\vec B$ along the direction of travel'],
    r`Both fields oscillate perpendicular to the direction of propagation and to each other; the direction of $\vec E\times\vec B$ is the direction of travel. Sound is the standard longitudinal wave; light is transverse (it can be polarised).`),
  mcq(1, 'speed of EM waves', r`In terms of $\mu_0$ and $\epsilon_0$, the speed of electromagnetic waves in vacuum is`, r`$\dfrac{1}{\sqrt{\mu_0\epsilon_0}}$`, [r`$\sqrt{\mu_0\epsilon_0}$`, r`$\dfrac{\mu_0}{\epsilon_0}$`, r`$\sqrt{\dfrac{\mu_0}{\epsilon_0}}$`],
    r`Maxwell's equations give $c = 1/\sqrt{\mu_0\epsilon_0} = 1/\sqrt{4\pi\times10^{-7}\times8.85\times10^{-12}} = 3\times10^8\ \mathrm{m\,s^{-1}}$. The last option, $\sqrt{\mu_0/\epsilon_0}\approx377\ \Omega$, is the impedance of free space.`),
  mcq(1, 'electromagnetic spectrum', r`Which of the following has the longest wavelength?`, 'Radio waves', ['Microwaves', 'Infrared rays', 'X-rays'],
    r`In order of decreasing wavelength: radio, microwave, infrared, visible, ultraviolet, X-rays, gamma rays.`),
  mcq(1, 'uses of EM waves', r`Ultraviolet rays are used in water purifiers because they`, 'kill germs', ['heat the water to its boiling point', 'remove dissolved salts', 'make the water transparent to infrared'],
    r`UV photons carry enough energy to damage the DNA of bacteria and viruses, so they sterilise water without heating it.`),
  nat(1, 'wavelength and frequency', r`An FM radio station broadcasts at 100 MHz. Find the wavelength of its waves (in m). Take $c = 3\times10^8\ \mathrm{m\,s^{-1}}$.`, 3e8 / 100e6, 0.01, 2,
    r`$\lambda = \dfrac{c}{f} = \dfrac{3\times10^8}{100\times10^6} = 3.00$ m.`, { unit: 'm' }),
  mcq(1, 'displacement current', r`The displacement current in a capacitor that is charging is produced by`, 'a changing electric field between the plates', ['the movement of charge across the gap', 'a changing magnetic field between the plates', 'the heating of the dielectric'],
    r`Maxwell's idea: $I_d = \epsilon_0\dfrac{d\Phi_E}{dt}$. No charge crosses the gap, but the electric flux through it changes and acts like a current in producing a magnetic field.`),
  mcq(1, 'infrared', r`The waves used in a TV remote control are`, 'infrared', ['X-rays', 'ultraviolet', 'radio waves'],
    r`A remote control has an infrared LED. IR is invisible, cheap to produce and is blocked by walls, so it does not affect the next room.`),
  mcq(1, 'uses of EM waves', r`X-rays are used to photograph bones because`, 'they pass through soft tissue more easily than through bone', ['they are absorbed more by soft tissue than by bone', 'they are reflected by bone', 'they are produced inside the body'],
    r`Heavier atoms such as calcium in bone absorb X-rays more strongly, so the bones leave a shadow on the film.`),
  mcq(1, 'ozone layer', r`The ozone layer protects life on Earth by absorbing`, 'ultraviolet rays from the Sun', ['infrared rays from the Sun', 'radio waves from space', 'X-rays from the Earth'],
    r`Ozone absorbs the harmful UV-B and UV-C. Gamma rays and X-rays from space are absorbed higher up by the atmosphere.`),
  nat(1, 'E and B amplitudes', r`The electric field amplitude of an EM wave is 300 V m$^{-1}$. Find the magnetic field amplitude (in $\mu$T). Take $c = 3\times10^8$ m s$^{-1}$.`, 300 / 3e8 * 1e6, 0.01, 2,
    r`$B_0 = \dfrac{E_0}{c} = \dfrac{300}{3\times10^8} = 10^{-6}$ T $= 1.00\ \mu$T.`, { unit: 'µT' }),
  mcq(1, 'frequency', r`When an EM wave goes from air into glass, the quantity that does NOT change is its`, 'frequency', ['speed', 'wavelength', 'amplitude of $\\vec E$ only'],
    r`The frequency is set by the source. Speed and wavelength both drop by the factor $n$ in glass.`),
  mcq(1, 'microwaves', r`Which EM waves are used in radar and in microwave ovens?`, 'Microwaves', ['Radio waves of low frequency', 'Ultraviolet rays', 'Gamma rays'],
    r`Microwaves ($\sim$ 1 mm to 10 cm) are produced by klystrons and magnetrons. A domestic oven uses 2.45 GHz, which makes water molecules rotate and heat the food.`),
  // ---------- Level 2 ----------
  nat(2, 'displacement current', r`A parallel-plate capacitor is being charged by a steady conduction current of 2 A in the wires. Find the displacement current between its plates (in A).`, 2, 0.01, 2,
    r`Charge on the plates rises at the rate $dQ/dt = 2$ A, so $E = Q/\epsilon_0A$ rises and $I_d = \epsilon_0 A\,dE/dt = dQ/dt = 2$ A. The total (conduction + displacement) current is continuous.`, { unit: 'A' }),
  nat(2, 'displacement current', r`A $2\ \mu$F capacitor has a voltage that rises at $5\times10^{3}\ \mathrm{V\,s^{-1}}$. Find the displacement current between the plates (in mA).`, 2e-6 * 5e3 * 1e3, 0.1, 1,
    r`$I_d = I_c = C\dfrac{dV}{dt} = 2\times10^{-6}\times5\times10^3 = 10^{-2}$ A $= 10.0$ mA.`, { unit: 'mA' }),
  nat(2, 'E and B amplitudes', r`The magnetic field amplitude of an EM wave in vacuum is $2\times10^{-7}$ T. Find the electric field amplitude (in V m$^{-1}$).`, 2e-7 * 3e8, 0.5, 0,
    r`$E_0 = cB_0 = 3\times10^8\times2\times10^{-7} = 60\ \mathrm{V\,m^{-1}}$.`, { unit: 'V/m' }),
  nat(2, 'wavelength and frequency', r`Find the frequency of green light of wavelength 500 nm (in units of $10^{14}$ Hz, 1 decimal).`, 3e8 / 500e-9 / 1e14, 0.05, 1,
    r`$f = \dfrac{c}{\lambda} = \dfrac{3\times10^8}{500\times10^{-9}} = 6\times10^{14}$ Hz, so 6.0 in the units asked.`, { unit: '1e14 Hz' }),
  mcq(2, 'medium', r`An EM wave of wavelength $\lambda_0$ in vacuum enters glass of refractive index 1.5. In the glass, its wavelength and frequency are`, r`$\lambda_0/1.5$ and unchanged`, [r`$1.5\lambda_0$ and unchanged`, r`$\lambda_0$ and $f/1.5$`, r`$\lambda_0/1.5$ and $1.5f$`],
    r`The frequency is fixed by the source. $v = c/n$, so $\lambda = v/f = \lambda_0/n$.`),
  mcq(2, 'order of the spectrum', r`Arranged in increasing order of frequency, the correct sequence is`, 'radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, gamma rays', ['gamma rays, X-rays, ultraviolet, visible light, infrared, microwaves, radio waves', 'radio waves, infrared, microwaves, visible light, ultraviolet, gamma rays, X-rays', 'microwaves, radio waves, infrared, ultraviolet, visible light, X-rays, gamma rays'],
    r`Frequency rises as wavelength falls. The common slip is swapping microwaves with infrared, or X-rays with gamma rays (X-rays have the longer wavelength, gamma the shorter, in the usual ordering).`),
  mcq(2, 'properties', r`Which one of the following is NOT an electromagnetic wave?`, 'Cathode rays', ['Gamma rays', 'Infrared rays', 'X-rays'],
    r`Cathode rays are streams of electrons: they carry charge and mass and are deflected by fields. The others are all EM waves.`),
  mcq(2, 'properties', r`An EM wave travelling through space is not deflected by electric or magnetic fields because`, 'it carries no charge', ['it has no energy', 'it travels at the speed of light', 'it is transverse'],
    r`A force $q(\vec E+\vec v\times\vec B)$ needs charge. Photons are neutral, so a static field does not deflect the wave (a medium can bend it by refraction, but that is different).`),
  nat(2, 'displacement current', r`The plates of a capacitor have an area of $0.01\ \mathrm{m^2}$ and the electric field between them is changing at $10^{12}\ \mathrm{V\,m^{-1}s^{-1}}$. Find the displacement current (in A, 3 decimals). $\epsilon_0 = 8.85\times10^{-12}$ SI.`, 8.85e-12 * 0.01 * 1e12, 0.002, 3,
    r`$I_d = \epsilon_0A\dfrac{dE}{dt} = 8.85\times10^{-12}\times0.01\times10^{12} = 0.0885$ A.`, { unit: 'A' }),
  mcq(2, 'Maxwell equations', r`Maxwell's correction to Ampere's circuital law was the addition of`, 'the displacement current term, $\\mu_0\\epsilon_0\\,d\\Phi_E/dt$', ['a term for magnetic monopoles', 'the induced emf term, $-d\\Phi_B/dt$', 'the Lorentz force'],
    r`Ampere's law becomes $\oint\vec B\cdot d\vec l = \mu_0(I_c + I_d)$. Without it the law fails across the gap of a charging capacitor. The $-d\Phi_B/dt$ term belongs to Faraday's law.`),
  mcq(2, 'Maxwell equations', r`Which of Maxwell's equations says that magnetic field lines have no beginning or end?`, "Gauss's law for magnetism", ["Gauss's law for electricity", "Faraday's law", "Ampere-Maxwell law"],
    r`$\oint\vec B\cdot d\vec A = 0$: no magnetic monopoles. Gauss's law for electricity ($\oint\vec E\cdot d\vec A = q/\epsilon_0$) allows lines to start on charges.`),
  mcq(2, 'greenhouse effect', r`The greenhouse effect is mainly due to`, 'the trapping of infrared radiation by gases such as carbon dioxide', ['the trapping of X-rays by ozone', 'ultraviolet radiation passing through glass', 'radio waves reflected by the atmosphere'],
    r`The Earth re-radiates absorbed sunlight as infrared. CO$_2$, water vapour and methane absorb it and send part back down.`),
  nat(2, 'radar echo', r`A radar pulse takes 0.2 ms to go to an aeroplane and come back. Find the distance of the aeroplane (in km). $c = 3\times10^8\ \mathrm{m\,s^{-1}}$.`, 3e8 * 0.2e-3 / 2 / 1e3, 0.05, 1,
    r`The pulse covers the distance twice: $d = \dfrac{ct}{2} = \dfrac{3\times10^8\times0.2\times10^{-3}}{2} = 3\times10^4$ m $= 30.0$ km.`, { unit: 'km' }),
  mcq(2, 'uses of EM waves', r`Which of the following is used for the treatment of cancer by killing the cells?`, 'Gamma rays', ['Radio waves', 'Microwaves', 'Infrared rays'],
    r`Gamma rays (as in a cobalt-60 unit) carry very high energy per photon and can be focused on a tumour to destroy cells.`),
  mcq(2, 'visible light', r`The wavelength range of visible light is approximately`, '400 nm to 700 nm', ['4 nm to 7 nm', '4 $\\mu$m to 7 $\\mu$m', '40 nm to 70 nm'],
    r`Violet is about 400 nm and red about 700 nm, so $4\times10^{-7}$ m to $7\times10^{-7}$ m.`),
  nat(2, 'momentum of radiation', r`A pulse of EM radiation carries $3\times10^{-3}$ J of energy and is completely absorbed. Find the momentum delivered (in units of $10^{-11}\ \mathrm{kg\,m\,s^{-1}}$).`, 3e-3 / 3e8 * 1e11, 0.05, 1,
    r`For an EM wave $p = U/c = \dfrac{3\times10^{-3}}{3\times10^8} = 10^{-11}\ \mathrm{kg\,m\,s^{-1}}$, so 1.0 in the units asked.`, { unit: '1e-11 kg m/s' }),
  mcq(2, 'energy of the fields', r`In an EM wave in vacuum, the average energy density of the electric field is`, 'equal to that of the magnetic field', ['twice that of the magnetic field', 'half that of the magnetic field', 'zero'],
    r`$\tfrac12\epsilon_0E^2 = \tfrac12\epsilon_0c^2B^2 = \dfrac{B^2}{2\mu_0}$. The two halves are always equal, so each is half the total energy density.`),
  // ---------- Level 3 ----------
  nat(3, 'intensity', r`The electric field amplitude of a plane EM wave in vacuum is $100\ \mathrm{V\,m^{-1}}$. Find its intensity (in $\mathrm{W\,m^{-2}}$, 1 decimal). $\epsilon_0 = 8.85\times10^{-12}$, $c = 3\times10^8$ SI.`, 0.5 * E0P * C * 100 ** 2, 0.1, 1,
    r`$I = \tfrac12\epsilon_0cE_0^2 = 0.5\times8.85\times10^{-12}\times3\times10^8\times(100)^2 = 13.3\ \mathrm{W\,m^{-2}}$.`, { unit: 'W/m^2', trap: 'The factor 1/2 comes from averaging sin^2 over a cycle.' }),
  nat(3, 'energy density', r`Find the average energy density in an EM wave of electric field amplitude $60\ \mathrm{V\,m^{-1}}$ (in units of $10^{-9}\ \mathrm{J\,m^{-3}}$, 2 decimals). $\epsilon_0 = 8.85\times10^{-12}$ SI.`, 0.5 * E0P * 60 ** 2 * 1e9, 0.05, 2,
    r`$u_{av} = \tfrac12\epsilon_0E_0^2 = 0.5\times8.85\times10^{-12}\times3600 = 1.593\times10^{-8}\ \mathrm{J\,m^{-3}}$, which is 15.93 in units of $10^{-9}$.`, { unit: '1e-9 J/m^3', trap: 'The electric and magnetic parts together give 1/2 eps0 E0^2, not eps0 E0^2.' }),
  nat(3, 'point source', r`A 100 W lamp radiates uniformly in all directions (assume all the power is in the form of EM waves). Find the intensity at 2 m (in $\mathrm{W\,m^{-2}}$, 2 decimals).`, 100 / (4 * Math.PI * 4), 0.02, 2,
    r`$I = \dfrac{P}{4\pi r^2} = \dfrac{100}{4\pi\times4} = 1.99\ \mathrm{W\,m^{-2}}$.`, { unit: 'W/m^2' }),
  nat(3, 'sunlight', r`The intensity of sunlight at the top of the atmosphere is $1400\ \mathrm{W\,m^{-2}}$. Find the amplitude of the electric field (in $\mathrm{V\,m^{-1}}$, nearest integer). $\epsilon_0 = 8.85\times10^{-12}$, $c = 3\times10^8$ SI.`, Math.sqrt(2 * 1400 / (E0P * C)), 3, 0,
    r`$E_0 = \sqrt{\dfrac{2I}{\epsilon_0c}} = \sqrt{\dfrac{2800}{8.85\times10^{-12}\times3\times10^8}} = \sqrt{1.055\times10^6} \approx 1027\ \mathrm{V\,m^{-1}}$.`, { unit: 'V/m' }),
  nat(3, 'radiation pressure', r`Sunlight of intensity $1400\ \mathrm{W\,m^{-2}}$ falls normally on a perfectly absorbing surface. Find the radiation pressure on it (in units of $10^{-6}$ Pa, 2 decimals).`, 1400 / 3e8 * 1e6, 0.02, 2,
    r`Absorbed light delivers momentum at the rate $I/c$ per unit area: $P = \dfrac{I}{c} = \dfrac{1400}{3\times10^8} = 4.67\times10^{-6}$ Pa.`, { unit: '1e-6 Pa' }),
  nat(3, 'radiation pressure', r`The same sunlight ($1400\ \mathrm{W\,m^{-2}}$) falls normally on a perfectly reflecting mirror. Find the radiation pressure (in units of $10^{-6}$ Pa, 2 decimals).`, 2 * 1400 / 3e8 * 1e6, 0.02, 2,
    r`Reflection reverses the momentum, so twice as much is transferred: $P = \dfrac{2I}{c} = \dfrac{2800}{3\times10^8} = 9.33\times10^{-6}$ Pa.`, { unit: '1e-6 Pa' }),
  mcq(3, 'wave equation', r`The electric field of a plane EM wave in vacuum is $E_y = E_0\sin(kx-\omega t)$. The magnetic field is along`, r`the $+z$ axis, with $B_z = (E_0/c)\sin(kx-\omega t)$`, [r`the $-z$ axis, with $B_z = -(E_0/c)\sin(kx-\omega t)$`, r`the $+y$ axis`, r`the $+x$ axis`],
    r`The direction of travel is $\vec E\times\vec B$. With travel along $+x$ and $\vec E$ along $+y$: $\hat y\times\hat z = \hat x$, so $\vec B$ is along $+z$ (in phase with $E$) with amplitude $E_0/c$.`, { trap: 'B must be perpendicular to both E and the direction of travel.' }),
  nat(3, 'wave equation', r`The electric field of an EM wave in vacuum is $E = 120\sin(1.57\times10^{7}x - 4.71\times10^{15}t)$ V m$^{-1}$ ($x$ in m, $t$ in s). Find its wavelength (in nm, nearest integer).`, 2 * Math.PI / 1.57e7 * 1e9, 3, 0,
    r`$k = 2\pi/\lambda = 1.57\times10^{7}\ \mathrm{m^{-1}}\Rightarrow\lambda = \dfrac{2\pi}{1.57\times10^7} = 4.0\times10^{-7}$ m $= 400$ nm (violet). Check: $\omega/k = 4.71\times10^{15}/1.57\times10^7 = 3\times10^8$.`, { unit: 'nm' }),
  nat(3, 'wave equation', r`For the wave $E = 120\sin(1.57\times10^{7}x - 4.71\times10^{15}t)$ V m$^{-1}$, find the amplitude of the magnetic field (in $\mu$T, 1 decimal). $c = 3\times10^8$.`, 120 / 3e8 * 1e6, 0.05, 1,
    r`$B_0 = E_0/c = 120/(3\times10^8) = 4\times10^{-7}$ T $= 0.4\ \mu$T.`, { unit: 'µT' }),
  mcq(3, 'medium', r`In a medium of relative permittivity 4 and relative permeability 1, the speed of an EM wave is`, r`$1.5\times10^8\ \mathrm{m\,s^{-1}}$`, [r`$3\times10^8\ \mathrm{m\,s^{-1}}$`, r`$6\times10^8\ \mathrm{m\,s^{-1}}$`, r`$0.75\times10^8\ \mathrm{m\,s^{-1}}$`],
    r`$v = \dfrac{1}{\sqrt{\mu\epsilon}} = \dfrac{c}{\sqrt{\mu_r\epsilon_r}} = \dfrac{3\times10^8}{2} = 1.5\times10^8\ \mathrm{m\,s^{-1}}$ (refractive index 2). Speeds above $c$ are impossible for a wave in a medium with $\epsilon_r,\mu_r>1$.`),
  nat(3, 'photons', r`A source emits 5 W of green light of wavelength 550 nm. Find the number of photons emitted per second (in units of $10^{18}$, 1 decimal). $hc = 1.986\times10^{-25}$ J m.`, 5 * 550e-9 / HC / 1e18, 0.1, 1,
    r`Energy per photon $= hc/\lambda = \dfrac{1.986\times10^{-25}}{550\times10^{-9}} = 3.61\times10^{-19}$ J. Number per second $= \dfrac{5}{3.61\times10^{-19}} = 1.38\times10^{19} = 13.8\times10^{18}$.`, { unit: '1e18 /s' }),
  mcq(3, 'photon energy', r`The energy of a photon of wavelength 620 nm (in eV, using $hc = 1240$ eV nm) is`, '2.0 eV', ['0.5 eV', '20 eV', '768 eV'],
    r`$E = \dfrac{1240}{620} = 2.0$ eV. The other options come from $\lambda/1240$ or $1240\times620$ or $10\times$ errors.`),
  nat(3, 'magnetic field of displacement current', r`A circular parallel-plate capacitor has plates of radius 5 cm and is charged by a current of 2 A. Find the magnetic field between the plates at a distance of 2 cm from the axis (in $\mu$T, 1 decimal). $\mu_0 = 4\pi\times10^{-7}$ SI.`, 4e-7 * Math.PI * 2 * 0.02 / (2 * Math.PI * 0.05 ** 2) * 1e6, 0.05, 1,
    r`The displacement current is uniform over the plate, so inside radius $r$: $B\,2\pi r = \mu_0I\dfrac{\pi r^2}{\pi R^2}$, giving $B = \dfrac{\mu_0Ir}{2\pi R^2} = \dfrac{2\times10^{-7}\times2\times0.02}{(0.05)^2} = 3.2\times10^{-6}$ T $= 3.2\ \mu$T.`, { unit: 'µT' }),
  mcq(3, 'electromagnetic spectrum', r`Which of the following has the highest frequency?`, 'Gamma rays from a nucleus', ['X-rays from an X-ray tube', 'Ultraviolet rays from the Sun', 'Microwaves from a magnetron'],
    r`Nuclear gamma rays have the shortest wavelengths ($\lesssim10^{-12}$ m) and so the highest frequencies in the list.`),
  mcq(3, 'sources', r`Which pair of a source and the radiation it produces is correct?`, 'Klystron valve: microwaves', ['Hot filament lamp: X-rays', 'Radioactive nucleus: ultraviolet rays', 'Oscillating LC circuit: gamma rays'],
    r`Klystrons and magnetrons produce microwaves; hot bodies give infrared and visible; X-ray tubes need fast electrons hitting a metal target; nuclei give gamma rays; LC circuits make radio waves.`),
  nat(3, 'microwave oven', r`A microwave oven works at 2.45 GHz. Find the distance between two adjacent antinodes of the standing wave inside it (in cm, 2 decimals). $c = 3\times10^8\ \mathrm{m\,s^{-1}}$.`, 3e8 / 2.45e9 / 2 * 100, 0.02, 2,
    r`$\lambda = \dfrac{c}{f} = \dfrac{3\times10^8}{2.45\times10^9} = 0.1224$ m. Adjacent antinodes are $\lambda/2 = 6.12$ cm apart (that is why food is rotated).`, { unit: 'cm' }),
  mcq(3, 'LC oscillator', r`A radio transmitter uses an LC circuit with $L = 1\ \mu$H and $C = 100$ pF. The wavelength of the radio waves it emits is nearest to ($c = 3\times10^8$)`, '19 m', ['1.9 m', '190 m', '3 m'],
    r`$f = \dfrac{1}{2\pi\sqrt{LC}} = \dfrac{1}{2\pi\sqrt{10^{-6}\times10^{-10}}} = \dfrac{1}{2\pi\times10^{-8}} = 1.59\times10^7$ Hz. $\lambda = c/f = 3\times10^8/1.59\times10^7 = 18.8$ m.`),
  nat(3, 'Moon signal', r`A radio signal sent from the Earth is reflected by the Moon at a distance of $3.84\times10^8$ m. Find the time for the echo to return (in s, 2 decimals).`, 2 * 3.84e8 / 3e8, 0.02, 2,
    r`$t = \dfrac{2d}{c} = \dfrac{2\times3.84\times10^8}{3\times10^8} = 2.56$ s.`, { unit: 's' }),
  nat(3, 'wavelength in a medium', r`Light of wavelength 600 nm in vacuum enters water of refractive index 1.33. Find its wavelength in the water (in nm, nearest integer).`, 600 / 1.33, 1, 0,
    r`$\lambda' = \lambda/n = 600/1.33 = 451$ nm. The colour (frequency) is the same; the eye responds to frequency.`, { unit: 'nm' }),
  // ---------- Level 4 ----------
  nat(4, 'reflection at an angle', r`A beam of intensity $900\ \mathrm{W\,m^{-2}}$ falls on a perfectly reflecting plane mirror at an angle of incidence of $60^\circ$. Find the radiation pressure on the mirror (in units of $10^{-6}$ Pa, 2 decimals).`, 2 * 900 * Math.cos(Math.PI / 3) ** 2 / 3e8 * 1e6, 0.02, 2,
    r`Per unit area of mirror, the beam's cross-section is reduced by $\cos\theta$ and the momentum change normal to the mirror is $2(I/c)\cos\theta$. So $P = \dfrac{2I\cos^2\theta}{c} = \dfrac{2\times900\times0.25}{3\times10^8} = 1.5\times10^{-6}$ Pa.`, { unit: '1e-6 Pa', trap: 'Cosine appears twice: once for area, once for the normal momentum.' }),
  nat(4, 'radiation force', r`A perfectly absorbing spherical dust grain of radius $1\ \mu$m and density $1000\ \mathrm{kg\,m^{-3}}$ is to be held up against gravity by a vertical laser beam. Find the intensity needed (in $10^6\ \mathrm{W\,m^{-2}}$, 2 decimals). $g = 9.8$, $c = 3\times10^8$.`, (4 / 3) * 1000 * 9.8 * 1e-6 * 3e8 / 1e6, 0.05, 2,
    r`Force from the beam on an absorbing sphere $= I\pi r^2/c$. Weight $= \tfrac43\pi r^3\rho g$. Equate: $I = \dfrac{4}{3}\rho g r c = \dfrac43\times1000\times9.8\times10^{-6}\times3\times10^8 = 3.92\times10^{6}\ \mathrm{W\,m^{-2}}$.`, { unit: '1e6 W/m^2' }),
  nat(4, 'pulse of light', r`A laser pulse of energy 1 mJ and duration 1 ns passes through a cross-section of $1\ \mathrm{mm^2}$. Find the amplitude of its electric field (in units of $10^{7}\ \mathrm{V\,m^{-1}}$, 2 decimals). $\epsilon_0 = 8.85\times10^{-12}$, $c = 3\times10^8$ SI.`, Math.sqrt(2 * (1e-3 / (1e-9 * 1e-6)) / (E0P * C)) / 1e7, 0.03, 2,
    r`Intensity $= \dfrac{1\times10^{-3}}{10^{-9}\times10^{-6}} = 10^{12}\ \mathrm{W\,m^{-2}}$. $E_0 = \sqrt{\dfrac{2I}{\epsilon_0c}} = \sqrt{\dfrac{2\times10^{12}}{2.655\times10^{-3}}} = 2.74\times10^7\ \mathrm{V\,m^{-1}}$.`, { unit: '1e7 V/m' }),
  nat(4, 'Poynting vector', r`At an instant, the electric and magnetic fields of a wave are $E = 100\ \mathrm{V\,m^{-1}}$ and $B = 3.33\times10^{-7}$ T at right angles. Find the instantaneous energy flow per unit area $|\vec S| = EB/\mu_0$ (in $\mathrm{W\,m^{-2}}$, 1 decimal).`, 100 * 3.33e-7 / (4e-7 * Math.PI), 0.2, 1,
    r`$S = \dfrac{EB}{\mu_0} = \dfrac{100\times3.33\times10^{-7}}{4\pi\times10^{-7}} = 26.5\ \mathrm{W\,m^{-2}}$. This is the value at the instant when both fields are at their peaks; the average is half the peak.`, { unit: 'W/m^2' }),
  nat(4, 'displacement current density', r`In a region, $E = 100\sin(10^6t)$ V m$^{-1}$. Find the peak displacement current density $\epsilon_0\,\partial E/\partial t$ (in units of $10^{-4}\ \mathrm{A\,m^{-2}}$, 2 decimals).`, 8.85e-12 * 100 * 1e6 / 1e-4, 0.03, 2,
    r`$j_d = \epsilon_0\dfrac{dE}{dt} = 8.85\times10^{-12}\times100\times10^6\cos(10^6t)$, so the peak is $8.85\times10^{-4}\ \mathrm{A\,m^{-2}}$.`, { unit: '1e-4 A/m^2' }),
  nat(4, 'medium', r`A plane EM wave of electric amplitude $60\ \mathrm{V\,m^{-1}}$ travels in a non-magnetic medium of refractive index 1.5. Find the amplitude of its magnetic field (in $\mu$T, 2 decimals). $c = 3\times10^8$.`, 60 * 1.5 / 3e8 * 1e6, 0.01, 2,
    r`In a medium $E_0/B_0 = v = c/n$. So $B_0 = \dfrac{nE_0}{c} = \dfrac{1.5\times60}{3\times10^8} = 3\times10^{-7}$ T $= 0.30\ \mu$T.`, { unit: 'µT', trap: 'In a medium B_0 = nE_0/c, larger than in vacuum for the same E_0.' }),
  nat(4, 'RC and displacement current', r`A $10\ \mu$F capacitor is charged from a 12 V battery through $100\ \mathrm{k\Omega}$. Find the displacement current between its plates 1 s after the switch is closed (in $\mu$A, 2 decimals).`, 12 / 100e3 * Math.exp(-1 / (100e3 * 10e-6)) * 1e6, 0.02, 2,
    r`The displacement current equals the conduction current in the wires. $I = \dfrac{V}{R}e^{-t/RC}$ with $RC = 10^5\times10^{-5} = 1$ s. $I = 1.2\times10^{-4}e^{-1} = 44.1\ \mu$A.`, { unit: 'µA' }),
  mcq(4, 'continuity of current', r`A capacitor with circular plates of radius $R$ is being charged by a current $I$. The magnetic field at distance $r>R$ from the axis (in the plane midway between the plates) is`, r`$\dfrac{\mu_0I}{2\pi r}$, the same as for a straight wire carrying $I$`, [r`$\dfrac{\mu_0Ir}{2\pi R^2}$`, r`zero, because there is no conduction current there`, r`$\dfrac{\mu_0I}{2\pi R}$`],
    r`Take an Amperian loop of radius $r>R$. The displacement current through the surface bulging between the plates is the whole $I$ (the same current as in the wires). So $B\,2\pi r = \mu_0I$.`),
  mcq(4, 'radiation pressure', r`A perfectly reflecting surface and a perfectly absorbing surface of the same area are placed in the same normal beam. The ratio of the forces on them (reflecting : absorbing) is`, '2 : 1', ['1 : 1', '1 : 2', '4 : 1'],
    r`Absorbed momentum per second $= IA/c$. Reflected: the momentum reverses, so the change is doubled: $2IA/c$.`),
  mcq(4, 'energy flow', r`The time-averaged Poynting vector (intensity) of a plane EM wave in vacuum can be written as`, r`$\dfrac{E_0B_0}{2\mu_0}$`, [r`$\dfrac{E_0B_0}{\mu_0}$`, r`$\dfrac{E_0B_0}{2}$`, r`$\dfrac{E_0^2}{2c}$`],
    r`The instantaneous $S = EB/\mu_0$ with $E = E_0\sin\phi$, $B = B_0\sin\phi$. Averaging $\sin^2\phi$ gives 1/2: $\bar S = E_0B_0/2\mu_0$. Also $= E_0^2/(2\mu_0c) = \tfrac12\epsilon_0cE_0^2$.`),
  mcq(4, 'medium', r`When an EM wave of amplitude $E_0$ passes from vacuum into a non-magnetic medium of refractive index $n$ (ignore reflection and consider the wave already inside, same $E_0$), its intensity becomes`, r`$n$ times the vacuum value`, [r`$n^2$ times`, r`$1/n$ of`, r`unchanged`],
    r`$I = \tfrac12\epsilon vE_0^2$ with $\epsilon = \epsilon_0n^2$ and $v = c/n$: $I = \tfrac12\epsilon_0ncE_0^2$, $n$ times the vacuum value for the same $E_0$.`, { trap: 'In real situations the amplitude changes at the boundary too, so compare same E_0 only as stated.' }),
  nat(4, 'photon momentum', r`A laser emits 5 mW of light of wavelength 600 nm which is completely absorbed by a target. Find the force on the target (in units of $10^{-11}$ N, 2 decimals).`, 5e-3 / 3e8 * 1e11, 0.02, 2,
    r`Force $= \dfrac{P}{c} = \dfrac{5\times10^{-3}}{3\times10^8} = 1.67\times10^{-11}$ N. (The wavelength is not needed: each photon brings momentum $h/\lambda$ and energy $hc/\lambda$, so the ratio is $1/c$.)`, { unit: '1e-11 N', trap: 'Wavelength is a distractor.' }),
  nat(4, 'spectrum and photon energy', r`How many times larger is the energy of an X-ray photon of wavelength 0.1 nm than that of a visible photon of wavelength 500 nm?`, 500 / 0.1, 5, 0,
    r`$E\propto1/\lambda$. Ratio $= \dfrac{500}{0.1} = 5000$.`, { unit: '' }),
  nat(4, 'solar sail', r`A perfectly reflecting solar sail of area $10^4\ \mathrm{m^2}$ faces the Sun normally where the intensity is $1400\ \mathrm{W\,m^{-2}}$. Find the force on it (in N, 3 decimals).`, 2 * 1400 * 1e4 / 3e8, 0.002, 3,
    r`$F = \dfrac{2IA}{c} = \dfrac{2\times1400\times10^4}{3\times10^8} = 0.0933$ N.`, { unit: 'N' }),
  // ---------- Level 5 ----------
  nat(5, 'partial reflection', r`A surface reflects 30 % of the normally incident light and absorbs the rest. The intensity is $1400\ \mathrm{W\,m^{-2}}$. Find the radiation pressure (in units of $10^{-6}$ Pa, 2 decimals).`, (1 + 0.3) * 1400 / 3e8 * 1e6, 0.02, 2,
    r`Absorbed fraction 0.7 brings $0.7I/c$ of momentum flux, reflected fraction 0.3 brings $2\times0.3I/c$. Total $= (0.7+0.6)\dfrac Ic = 1.3\times\dfrac{1400}{3\times10^8} = 6.07\times10^{-6}$ Pa.`, { unit: '1e-6 Pa' }),
  nat(5, 'radiation and gravity', r`A perfectly absorbing spherical grain of density $1000\ \mathrm{kg\,m^{-3}}$ at a distance $d$ from the Sun feels a radiation force and a gravitational force, both falling as $1/d^2$. Find the radius at which they are equal (in $\mu$m, 2 decimals). $L_\odot = 3.85\times10^{26}$ W, $GM_\odot = 1.327\times10^{20}\ \mathrm{m^3s^{-2}}$, $c = 3\times10^8$.`, 3 * 3.85e26 / (16 * Math.PI * 1.327e20 * 1000 * 3e8) * 1e6, 0.02, 2,
    r`Radiation force: $F_r = \dfrac{L}{4\pi d^2c}\pi r^2$. Gravity: $F_g = \dfrac{GM}{d^2}\cdot\tfrac43\pi r^3\rho$. Equating, $d$ cancels: $\dfrac{Lr^2}{4cd^2} = \dfrac{4\pi GM\rho r^3}{3d^2}\Rightarrow r = \dfrac{3L}{16\pi GM\rho c} = \dfrac{3\times3.85\times10^{26}}{16\pi\times1.327\times10^{20}\times1000\times3\times10^8} = 5.8\times10^{-7}$ m $= 0.58\ \mu$m. Smaller grains are blown outwards.`, { unit: 'µm', trap: 'The distance cancels, so the critical size is the same everywhere.' }),
  nat(5, 'inside and outside the plates', r`A capacitor with circular plates of radius 10 cm is charged by a current of 3 A. Find the ratio of the magnetic field at 5 cm from the axis to that at 20 cm from the axis (both in the mid-plane between the plates).`, (0.05 / (2 * 0.1 ** 2)) / (1 / (2 * 0.2)), 0.01, 2,
    r`Inside: $B = \dfrac{\mu_0Ir}{2\pi R^2}$; outside: $B = \dfrac{\mu_0I}{2\pi r}$. $B_{in} = \dfrac{\mu_0I}{2\pi}\times\dfrac{0.05}{0.01} = \dfrac{\mu_0I}{2\pi}\times5$; $B_{out} = \dfrac{\mu_0I}{2\pi}\times\dfrac{1}{0.2} = \dfrac{\mu_0I}{2\pi}\times5$. The ratio is 1.00.`),
  nat(5, 'photon pressure', r`A 1 mW laser beam of cross-section $2\ \mathrm{mm^2}$ falls normally on a surface which reflects 80 % of it and absorbs the rest. Find the pressure (in units of $10^{-6}$ Pa, 3 decimals).`, (1 + 0.8) * (1e-3 / 2e-6) / 3e8 * 1e6, 0.004, 3,
    r`Intensity $= \dfrac{10^{-3}}{2\times10^{-6}} = 500\ \mathrm{W\,m^{-2}}$. $P = (1+r)\dfrac Ic = 1.8\times\dfrac{500}{3\times10^8} = 3.0\times10^{-6}$ Pa.`, { unit: '1e-6 Pa' }),
  nat(5, 'E and B fields in a medium', r`The electric field of a wave in a non-magnetic medium is $E_y = 90\sin(2\times10^7x - 3\times10^{15}t)$ V m$^{-1}$. Find the refractive index of the medium (3 decimals). $c = 3\times10^8$.`, 3e8 / (3e15 / 2e7), 0.004, 3,
    r`Speed $v = \omega/k = \dfrac{3\times10^{15}}{2\times10^7} = 1.5\times10^8\ \mathrm{m\,s^{-1}}$. $n = c/v = 2.000$.`, { unit: '' }),
  msq(5, 'EM waves', r`Which of the following statements about an EM wave in vacuum are correct?`, [
    r`$\vec E$ and $\vec B$ are in phase.`,
    r`$E_0/B_0 = c$.`,
    r`The energy is shared equally between the electric and magnetic fields.`,
    r`The wave is deflected by a steady magnetic field.`], [0, 1, 2],
    r`E and B reach maxima together; the ratio is $c$; the energy densities are equal. The wave itself has no charge, so a steady field does not deflect it.`),
  msq(5, 'Maxwell equations', r`Which statements about Maxwell's equations are correct?`, [
    r`Displacement current exists only in a vacuum.`,
    r`A changing electric field produces a magnetic field.`,
    r`A changing magnetic field produces an electric field.`,
    r`The net magnetic flux through a closed surface is zero.`], [1, 2, 3],
    r`(A) is false: displacement current exists in any region with a changing $\vec E$, e.g. in a dielectric or in a wire where $\vec E$ varies. The other three are the Ampere-Maxwell law, Faraday's law and Gauss's law for magnetism.`),
  msq(5, 'radiation pressure', r`A plane EM wave of intensity $I$ falls normally on a surface of area $A$. Which are correct?`, [
    r`The force on a perfect absorber is $IA/c$.`,
    r`The force on a perfect reflector is $2IA/c$.`,
    r`The force on a perfect reflector is $IA/c$.`,
    r`Radiation pressure is of the same order as the pressure of everyday air at sea level.`], [0, 1],
    r`Absorber: $IA/c$. Reflector: $2IA/c$. Radiation pressure of sunlight is about $10^{-6}$ Pa compared with $10^{5}$ Pa for air.`),
  msq(5, 'electromagnetic spectrum', r`Which of the following are correct?`, [
    r`X-rays have shorter wavelengths than ultraviolet rays.`,
    r`Infrared radiation is produced by hot bodies and molecular vibrations.`,
    r`Radio waves are produced by accelerating charges in a circuit.`,
    r`All EM waves have the same speed in glass.`], [0, 1, 2],
    r`The speed in a medium depends on the frequency (dispersion), so (D) is false: for example violet light is slower than red in glass.`),
  msq(5, 'dielectric medium', r`A plane EM wave goes from vacuum into a non-magnetic medium of refractive index $n>1$. Which of the following change?`, [
    r`The speed of the wave decreases.`,
    r`The frequency of the wave decreases.`,
    r`The wavelength decreases.`,
    r`The ratio $E_0/B_0$ decreases.`], [0, 2, 3],
    r`$v = c/n$ and $\lambda = \lambda_0/n$ both fall. Frequency is unchanged. $E_0/B_0 = v$, so it also falls.`),
  msq(5, 'EM energy and momentum', r`A plane EM wave of intensity $I$ travels in vacuum. Which of the following are correct?`, [
    r`The energy density averaged over a cycle is $I/c$.`,
    r`The momentum carried per unit volume is $u/c$, where $u$ is the energy density.`,
    r`The momentum flows in the direction of $\vec E\times\vec B$.`,
    r`The wave has momentum only when it is absorbed.`], [0, 1, 2],
    r`$I = uc$ so $u = I/c$. Momentum density is $u/c$ and points along the travel. The wave carries the momentum as it travels; absorption only transfers it to a body.`),
  asrt(2, 'transverse waves', r`EM waves can be polarised.`, r`EM waves are transverse in nature.`, 0,
    r`Only transverse waves can be polarised, because there are directions perpendicular to the travel to choose from. R explains A.`),
  asrt(3, 'displacement current', r`A displacement current flows in a vacuum between the plates of a charging capacitor.`, r`The electric field between the plates changes with time.`, 0,
    r`$I_d = \epsilon_0\,d\Phi_E/dt$ is non-zero because $\vec E$ changes. R is the reason for A.`),
  asrt(3, 'radiation pressure', r`The radiation pressure on a perfectly reflecting surface is twice that on a perfectly absorbing surface (normal incidence, same intensity).`, r`The momentum of the light is reversed on reflection.`, 0,
    r`Change of momentum $2p$ against $p$. R explains A.`),
  asrt(3, 'EM spectrum', r`Gamma rays are used in the treatment of cancer.`, r`Gamma rays have the longest wavelength in the electromagnetic spectrum.`, 2,
    r`A is true. R is false: gamma rays have the shortest wavelength (highest energy), which is the reason they can destroy cells.`),
  asrt(2, 'greenhouse effect', r`The Earth's surface is warmer than it would be without an atmosphere.`, r`Greenhouse gases are transparent to visible light but absorb infrared radiation from the ground.`, 0,
    r`Sunlight comes in, the ground re-radiates in the infrared and gases such as CO$_2$ trap part of it. R explains A.`),
  asrt(4, 'speed of EM waves', r`The speed of an EM wave in a medium is less than that in vacuum.`, r`The permittivity and the permeability of a medium are always larger than those of free space.`, 2,
    r`A is true because $v = 1/\sqrt{\mu\epsilon} = c/\sqrt{\mu_r\epsilon_r}$ and $\mu_r\epsilon_r>1$ for transparent media. R is false as stated: diamagnetic materials have $\mu<\mu_0$ (only slightly). What matters is the product $\mu_r\epsilon_r$.`),
  asrt(4, 'EM energy', r`The electric and the magnetic fields of a plane wave in vacuum carry equal energy.`, r`The relation $E_0 = cB_0$ makes $\tfrac12\epsilon_0E_0^2 = B_0^2/2\mu_0$.`, 0,
    r`With $c^2 = 1/\mu_0\epsilon_0$: $\tfrac12\epsilon_0E_0^2 = \tfrac12\epsilon_0c^2B_0^2 = B_0^2/2\mu_0$. R shows exactly why A is true.`),
  asrt(3, 'microwaves', r`Microwaves are used for long-distance communication through satellites.`, r`Microwaves are not bent by the ionosphere but pass through it.`, 0,
    r`Short-wave (HF) radio is reflected by the ionosphere, but microwaves pass through, so they can link ground stations and satellites. R explains A.`),
  stm(2, 'EM waves', r`EM waves can travel through vacuum.`, r`EM waves need a material medium for propagation.`, 2,
    r`Statement I is true (sunlight reaches us through space). II is false: the changing fields sustain each other, so no medium is needed.`),
  stm(3, 'infrared', r`Infrared waves are called heat waves.`, r`Infrared waves are absorbed by water molecules, increasing their thermal motion.`, 0,
    r`Both true; II is why IR is felt as warmth. (Heating is a property of any absorbed radiation; IR is the part that matches molecular vibration energies.)`),
  stm(3, 'speed', r`In vacuum, all EM waves travel at the same speed.`, r`In a medium, all EM waves travel at the same speed.`, 2,
    r`I is true. II is false: in a medium the speed depends on frequency (dispersion), so red and violet travel at different speeds in glass.`),
  stm(3, 'spectrum', r`Ultraviolet radiation is absorbed by ordinary glass more than visible light is.`, r`Photons of UV have more energy than photons of visible light.`, 0,
    r`Both true: you do not tan behind a window. II is true as well ($E = hf$), but it is not why glass absorbs UV, which depends on the material's atomic energy levels.`),
  stm(4, 'radiation pressure', r`Light falling on a body exerts a force on it.`, r`Light carries momentum $E/c$, and a force is the rate of change of momentum.`, 0,
    r`Both true and the second explains the first.`),
  stm(4, 'displacement current', r`The displacement current is a real flow of charge through the dielectric of a capacitor.`, r`The displacement current has the same magnetic effect as a conduction current of equal size.`, 3,
    r`I is false: no charge crosses a vacuum gap; it is a changing electric flux. II is true: it produces a magnetic field by the same law.`),
  cnt(3, 'EM waves', r`Which of the following are properties of EM waves in free space? Count the correct ones.`, [
    r`They are transverse.`,
    r`They carry energy and momentum.`,
    r`$E$ and $B$ vary in phase.`,
    r`$E/B = c$.`], 4,
    r`All four are correct.`),
  cnt(4, 'spectrum', r`How many of the following statements are correct?`, [
    r`UV rays have a shorter wavelength than visible light.`,
    r`X-rays can be produced by sudden stopping of fast electrons.`,
    r`Microwaves have a shorter wavelength than infrared rays.`,
    r`Radio waves can be produced by oscillating LC circuits.`], 3,
    r`(1) true, (2) true (X-ray tube), (3) false: microwaves have longer wavelengths than infrared, (4) true.`),
  mat(2, 'spectrum', 'm1', r`Match the radiation with its source or production.`, 'A-q, B-s, C-p, D-r', ['A-p, B-q, C-r, D-s', 'A-s, B-q, C-p, D-r', 'A-r, B-p, C-s, D-q'],
    r`Radio waves come from oscillating LC circuits (q); microwaves from a magnetron or klystron (s); X-rays from fast electrons stopped by a metal target (p); gamma rays from radioactive nuclei (r).`),
  mat(3, 'uses', 'm2', r`Match the radiation with its use.`, 'A-s, B-p, C-q, D-r', ['A-p, B-s, C-q, D-r', 'A-s, B-q, C-p, D-r', 'A-r, B-p, C-s, D-q'],
    r`Microwaves: radar and cooking; infrared: remote controls and physiotherapy; UV: sterilising water; X-rays: bone images.`),
  mat(3, 'wavelength ranges', 'm3', r`Match the region with its approximate wavelength.`, 'A-s, B-r, C-q, D-p', ['A-p, B-q, C-r, D-s', 'A-s, B-q, C-r, D-p', 'A-q, B-s, C-r, D-p'],
    r`Radio waves are metres to kilometres; microwaves are millimetres to centimetres; visible light is hundreds of nanometres; X-rays are nanometres or less.`),
  mat(3, 'formulae', 'm4', r`Match each quantity with its expression for a plane EM wave in vacuum.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-r, C-p, D-s', 'A-s, B-p, C-q, D-r'],
    r`Speed $c = 1/\sqrt{\mu_0\epsilon_0}$; amplitude ratio $E_0/B_0 = c$; average intensity $\tfrac12\epsilon_0cE_0^2$; radiation pressure of an absorbed beam $I/c$.`),
  pas(3, 'sunlight', 'p1', r`Find the amplitude of the electric field of the light (in $\mathrm{V\,m^{-1}}$, nearest integer). $\epsilon_0 = 8.85\times10^{-12}$ SI.`, Math.sqrt(2 * 1000 / (E0P * C)), 3, 0,
    r`$E_0 = \sqrt{\dfrac{2I}{\epsilon_0c}} = \sqrt{\dfrac{2000}{2.655\times10^{-3}}} = \sqrt{7.53\times10^5} = 868\ \mathrm{V\,m^{-1}}$.`, { unit: 'V/m' }),
  pas(3, 'sunlight', 'p1', r`Find the amplitude of the magnetic field (in $\mu$T, 2 decimals).`, Math.sqrt(2 * 1000 / (E0P * C)) / 3e8 * 1e6, 0.02, 2,
    r`$B_0 = E_0/c = 868/(3\times10^8) = 2.89\times10^{-6}$ T $= 2.89\ \mu$T.`, { unit: 'µT' }),
  pas(4, 'sunlight', 'p1', r`The panel of area $2\ \mathrm{m^2}$ is perfectly absorbing. Find the force the light exerts on it (in units of $10^{-6}$ N, 2 decimals).`, 1000 * 2 / 3e8 * 1e6, 0.02, 2,
    r`$F = \dfrac{IA}{c} = \dfrac{1000\times2}{3\times10^8} = 6.67\times10^{-6}$ N.`, { unit: '1e-6 N' }),
  pas(3, 'capacitor', 'p2', r`Find the displacement current between the plates at the instant when $dV/dt = 8\times10^3\ \mathrm{V\,s^{-1}}$ (in mA, 1 decimal).`, 5e-6 * 8e3 * 1e3, 0.1, 1,
    r`$I_d = C\,dV/dt = 5\times10^{-6}\times8\times10^3 = 0.04$ A $= 40.0$ mA.`, { unit: 'mA' }),
  pas(4, 'capacitor', 'p2', r`The plates have an area of $0.02\ \mathrm{m^2}$. Find the rate of change of the electric field between them at that instant (in units of $10^{12}\ \mathrm{V\,m^{-1}s^{-1}}$, 2 decimals). $\epsilon_0 = 8.85\times10^{-12}$.`, 0.04 / (8.85e-12 * 0.02) / 1e12, 0.03, 2,
    r`$I_d = \epsilon_0A\,dE/dt\Rightarrow\dfrac{dE}{dt} = \dfrac{0.04}{8.85\times10^{-12}\times0.02} = 2.26\times10^{11}\ \mathrm{V\,m^{-1}s^{-1}}$, which is 0.23 in units of $10^{12}$.`, { unit: '1e12 V/m/s' }),
  pasm(3, 'capacitor', 'p2', r`If a dielectric of $\epsilon_r = 3$ filled the gap with the same $dV/dt$, the total current in the wires would`, r`be 3 times as large`, [r`be unchanged`, r`be one third as large`, r`be zero`],
    r`$C\to3C$ and $I = C\,dV/dt$, so the current triples. The displacement current density $\epsilon\,dE/dt$ rises by the same factor.`),
  pas(3, 'wave', 'p3', r`Find the frequency of the wave (in units of $10^{14}$ Hz, 1 decimal).`, 3.77e15 / (2 * Math.PI) / 1e14, 0.05, 1,
    r`$\omega = 3.77\times10^{15}\ \mathrm{rad\,s^{-1}}$, so $f = \omega/2\pi = 6.0\times10^{14}$ Hz.`, { unit: '1e14 Hz' }),
  pas(3, 'wave', 'p3', r`Find the wavelength of the wave (in nm, nearest integer).`, 2 * Math.PI / 1.257e7 * 1e9, 1, 0,
    r`$\lambda = 2\pi/k = 2\pi/(1.257\times10^7) = 5.0\times10^{-7}$ m $= 500$ nm. Check: $c = f\lambda = 6\times10^{14}\times5\times10^{-7} = 3\times10^8$.`, { unit: 'nm' }),
  pasm(3, 'wave', 'p3', r`The wave belongs to which part of the spectrum?`, 'Visible light (green)', ['Infrared', 'Ultraviolet', 'Microwaves'],
    r`500 nm lies between 400 nm and 700 nm, so it is visible, and is green.`),

  // ================= Added 2026-11-22: harder and more varied questions =================
  // ---------- Level 2 ----------
  mcq(2, 'history', r`Electromagnetic waves were first produced and detected in the laboratory by`, 'Heinrich Hertz', ['James Clerk Maxwell', 'Michael Faraday', 'Guglielmo Marconi'],
    r`Maxwell predicted EM waves (1860s). Hertz produced and detected radio waves in 1887. Marconi later used them for communication. Faraday discovered induction.`),
  mcq(2, 'direction of propagation', r`In an EM wave the electric field points along $+y$ and the magnetic field along $+z$. The wave travels along`, r`$+x$`, [r`$-x$`, r`$+y$`, r`$-z$`],
    r`The direction of travel is the direction of $\vec E\times\vec B$. $\hat y\times\hat z = \hat x$, so the wave moves along $+x$.`),
  nat(2, 'wavelength and frequency', r`A microwave has a wavelength of 3 cm in vacuum. Find its frequency in GHz. Use $c = 3\times10^{8}\ \mathrm{m\,s^{-1}}$.`, 3e8 / 0.03 / 1e9, 0, 0,
    r`$f = c/\lambda = 3\times10^{8}/0.03 = 1.0\times10^{10}$ Hz $= 10$ GHz.`, { unit: 'GHz' }),
  mcq(2, 'sources', r`Electromagnetic waves are produced by`, 'accelerated (or oscillating) charges', ['charges at rest', 'charges moving with constant velocity', 'neutral atoms at rest'],
    r`A charge at rest gives only an electric field and a charge in uniform motion gives constant fields. Only accelerating charges radiate EM waves.`),
  nat(2, 'photon energy', r`Find the energy of a photon of wavelength 400 nm in eV (use $hc = 1240$ eV nm, 1 decimal).`, 1240 / 400, 0.05, 1,
    r`$E = hc/\lambda = 1240/400 = 3.1$ eV.`, { unit: 'eV' }),
  mcq(2, 'uses of EM waves', r`Night-vision devices and thermal cameras work by detecting`, 'infrared radiation', ['ultraviolet radiation', 'X-rays', 'radio waves'],
    r`Warm bodies emit infrared radiation. Cameras sensitive to it form an image even in darkness.`),

  // ---------- Level 3 ----------
  mcq(3, 'direction of propagation', r`An EM wave travels along $-z$ with its electric field along $+x$. Its magnetic field is along`, r`$-y$`, [r`$+y$`, r`$+z$`, r`$-x$`],
    r`We need $\vec E\times\vec B$ along $-\hat z$. $\hat x\times(-\hat y) = -\hat z$, so $\vec B$ is along $-y$. (Using $+y$ would give $+z$.)`, { trap: 'Check the cross product, do not guess the sign.' }),
  nat(3, 'point source', r`A point source radiates 200 W uniformly as EM waves. Find the amplitude of the electric field at 5 m from it (in $\mathrm{V\,m^{-1}}$, 1 decimal). Use $\epsilon_0 = 8.85\times10^{-12}$ and $c = 3\times10^{8}$.`, Math.sqrt(2 * (200 / (4 * Math.PI * 25)) / (E0P * C)), 0.2, 1,
    r`$I = P/4\pi r^2 = 200/(4\pi\times25) = 0.637\ \mathrm{W\,m^{-2}}$. $I = \tfrac12\epsilon_0cE_0^2$, so $E_0 = \sqrt{2I/\epsilon_0c} = \sqrt{2\times0.637/(8.85\times10^{-12}\times3\times10^{8})} = 21.9\ \mathrm{V\,m^{-1}}$.`, { unit: 'V/m' }),
  mcq(3, 'point source', r`A point source radiates EM waves uniformly. The electric field amplitude at distance $r$ is $E_0$. At distance $3r$ it is`, r`$E_0/3$`, [r`$E_0/9$`, r`$E_0/\sqrt3$`, r`$3E_0$`],
    r`Intensity falls as $1/r^2$ and $I\propto E_0^2$. So $E_0\propto1/r$: at $3r$ the amplitude is $E_0/3$.`, { trap: 'The intensity falls as $1/r^2$ but the amplitude only as $1/r$.' }),
  nat(3, 'displacement current', r`The circular plates of a capacitor have radius 4 cm. The electric field between them changes at $2\times10^{12}\ \mathrm{V\,m^{-1}s^{-1}}$. Find the displacement current (in A, 3 decimals).`, E0P * Math.PI * 0.04 ** 2 * 2e12, 0.002, 3,
    r`$I_d = \epsilon_0\dfrac{d\Phi_E}{dt} = \epsilon_0\pi R^2\dfrac{dE}{dt} = 8.85\times10^{-12}\times\pi(0.04)^2\times2\times10^{12} = 0.089$ A.`, { unit: 'A' }),
  nat(3, 'photons', r`Hydrogen gas in space emits radio waves of wavelength 21 cm. Find the energy of one photon in units of $10^{-25}$ J (2 decimals). Use $hc = 1.986\times10^{-25}$ J m.`, HC / 0.21 / 1e-25, 0.02, 2,
    r`$E = hc/\lambda = 1.986\times10^{-25}/0.21 = 9.46\times10^{-25}$ J.`, { unit: '1e-25 J' }),
  nat(3, 'antenna', r`An antenna that is a quarter of a wavelength long is to transmit at 100 MHz. Find its length in metres (2 decimals).`, 3e8 / 100e6 / 4, 0.005, 2,
    r`$\lambda = c/f = 3\times10^{8}/10^{8} = 3$ m. Length $=\lambda/4 = 0.75$ m.`, { unit: 'm' }),
  nat(3, 'laser beam', r`A laser pointer emits 5 mW in a beam of circular cross-section with radius 1 mm. Find the intensity in $\mathrm{W\,m^{-2}}$ (nearest integer).`, 5e-3 / (Math.PI * 1e-6), 1, 0,
    r`$I = P/A = 5\times10^{-3}/(\pi\times10^{-6}) = 1.59\times10^{3}\ \mathrm{W\,m^{-2}}$.`, { unit: 'W/m²' }),
  mcq(3, 'medium', r`A plane EM wave travels in a non-magnetic medium of refractive index $n$. The ratio $E_0/B_0$ of the amplitudes is`, r`$c/n$`, [r`$c$`, r`$nc$`, r`$c/n^2$`],
    r`$E_0/B_0$ equals the wave speed in the medium, $v = c/n$ (for the wave in a medium of permittivity $\epsilon$ and permeability $\mu$, $v = 1/\sqrt{\mu\epsilon}$).`),
  nat(3, 'LC oscillator', r`An LC circuit has $L = 2\ \mu$H and $C = 50$ pF. Find the wavelength of the EM wave it radiates (in m, 1 decimal). Use $c = 3\times10^{8}$.`, 3e8 * 2 * Math.PI * Math.sqrt(2e-6 * 50e-12), 0.2, 1,
    r`$f = \dfrac{1}{2\pi\sqrt{LC}} = \dfrac{1}{2\pi\sqrt{10^{-16}}} = 1.59\times10^{7}$ Hz. $\lambda = c/f = 3\times10^{8}/1.59\times10^{7} = 18.8$ m.`, { unit: 'm' }),
  nat(3, 'electromagnetic spectrum', r`How many of the following have a <b>shorter</b> wavelength than visible light? Radio waves, microwaves, ultraviolet, X-rays, infrared, gamma rays.`, 3, 0, 0,
    r`Radio waves, microwaves and infrared are longer than visible. Ultraviolet, X-rays and gamma rays are shorter. So 3.`),
  nat(3, 'Maxwell equations', r`How many of Maxwell's four equations contain a time derivative (a changing field) in their integral or differential form?`, 2, 0, 0,
    r`Faraday's law has $-d\Phi_B/dt$ and the Ampere-Maxwell law has $\mu_0\epsilon_0\,d\Phi_E/dt$. The two Gauss's laws have no time derivatives. So 2.`),
  nat(3, 'medium', r`In a non-magnetic medium of refractive index 2 the ratio $E_0/B_0$ of the amplitudes of an EM wave is $x\times10^{8}\ \mathrm{m\,s^{-1}}$. Find $x$.`, 3 / 2, 0.005, 3,
    r`$E_0/B_0 = v = c/n = 3\times10^{8}/2 = 1.5\times10^{8}\ \mathrm{m\,s^{-1}}$, so $x = 1.5$.`),
  asrt(3, 'speed of EM waves', r`The speed of light in vacuum does not depend on its frequency.`, r`In vacuum $c = 1/\sqrt{\mu_0\epsilon_0}$, and $\mu_0$ and $\epsilon_0$ are constants.`, 0,
    r`Both true and R explains A. Since $c$ is fixed by the constants of vacuum, every EM wave in vacuum travels at the same speed.`),
  stm(3, 'momentum of radiation', r`EM waves carry momentum.`, r`The momentum of radiation of energy $U$ is $U/c$.`, 0,
    r`Radiation exerts pressure, so it carries momentum. For a wave $p = U/c$, which is the same as $p = hf/c$ for a photon. Both true.`),
  stm(3, 'ionosphere', r`Short radio waves can be received beyond the horizon.`, r`The ionosphere reflects radio waves of frequency below a critical value.`, 0,
    r`Waves in the short-wave band are reflected back to Earth by the ionosphere (sky wave propagation). Higher frequencies (such as microwaves and TV) pass through it. Both true and II is the explanation.`),
  mat(3, 'frequency ranges', 'm5', r`Match each source of radiation with its approximate frequency.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`FM radio: about $10^{8}$ Hz (p). Microwave oven: $2.45\times10^{9}$ Hz $\approx10^{9}$ Hz (q). Visible light: about $5\times10^{14}$ Hz (r). Medical X-rays: about $10^{18}$ Hz (s). So A-p, B-q, C-r, D-s.`),
  mat(3, 'applications', 'm6', r`Match each application in List I with the radiation it uses in List II.`, 'A-r, B-s, C-p, D-q', ['A-p, B-q, C-r, D-s', 'A-r, B-q, C-p, D-s', 'A-s, B-r, C-p, D-q'],
    r`Aircraft radar uses microwaves (r). Sunburn is caused by ultraviolet (s). Seeing a fracture on a screen uses X-rays (p). Sterilising food and cancer therapy use gamma rays (q). So A-r, B-s, C-p, D-q.`),
  mat(3, 'medium', 'm7', r`A plane EM wave of frequency $f_0$ and wavelength $\lambda_0$ in vacuum enters a non-magnetic medium of refractive index $n$. Match each quantity with its value in the medium.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-r, C-q, D-s', 'A-p, B-q, C-s, D-r'],
    r`Speed $c/n$ (p). Wavelength $\lambda_0/n$ (q). Frequency stays $f_0$ (r). The electric and magnetic energy densities remain equal, ratio 1 (s). So A-p, B-q, C-r, D-s.`),
  pas(3, 'laser beam', 'p4', r`Find the intensity of the beam in $\mathrm{kW\,m^{-2}}$ (2 decimals).`, 5e-3 / (Math.PI * 1e-6) / 1e3, 0.02, 2,
    r`$I = P/(\pi r^2) = 5\times10^{-3}/(\pi\times10^{-6}) = 1.59\times10^{3}\ \mathrm{W\,m^{-2}} = 1.59\ \mathrm{kW\,m^{-2}}$.`, { unit: 'kW/m²' }),
  pas(4, 'laser beam', 'p4', r`Find the amplitude of the electric field in the beam (in $\mathrm{V\,m^{-1}}$, nearest integer). Use $\epsilon_0 = 8.85\times10^{-12}$ and $c = 3\times10^{8}$.`, Math.sqrt(2 * (5e-3 / (Math.PI * 1e-6)) / (E0P * C)), 5, 0,
    r`$I = \tfrac12\epsilon_0cE_0^2$, so $E_0 = \sqrt{2I/\epsilon_0c} = \sqrt{2\times1591.5/(8.85\times10^{-12}\times3\times10^{8})} = 1.09\times10^{3}\ \mathrm{V\,m^{-1}}$ (about 1095).`, { unit: 'V/m' }),
  pas(4, 'photons', 'p4', r`Find the number of photons emitted per second, in units of $10^{16}$ (2 decimals). Use $hc = 1.986\times10^{-25}$ J m.`, 5e-3 * 600e-9 / HC / 1e16, 0.02, 2,
    r`Energy of one photon $= hc/\lambda = 1.986\times10^{-25}/6\times10^{-7} = 3.31\times10^{-19}$ J. Photons per second $= P/E = 5\times10^{-3}/3.31\times10^{-19} = 1.51\times10^{16}$.`),

  // ---------- Level 4 ----------
  msq(4, 'EM waves', r`For a plane EM wave in vacuum, which statements are correct?`,
    [r`$\vec E$ and $\vec B$ oscillate in phase`, r`$E = cB$ at every instant and every point`, r`Most of the wave's energy is carried by the electric field`, r`The average total energy density is $\tfrac12\epsilon_0E_0^2$`], [0, 1, 3],
    r`In vacuum $E$ and $B$ reach their maxima together and $E = cB$ (A, B). The electric and magnetic energy densities are equal, so neither carries most (C false). Average electric energy density $=\tfrac14\epsilon_0E_0^2$, and the magnetic part is equal, so the total is $\tfrac12\epsilon_0E_0^2$ (D true).`),
  msq(4, 'Maxwell equations', r`Which statements about Maxwell's equations are correct?`,
    [r`$\oint\vec B\cdot d\vec A = 0$ shows that there are no magnetic monopoles`, r`$\oint\vec E\cdot d\vec l = -\dfrac{d\Phi_B}{dt}$ is Faraday's law`, r`$\oint\vec B\cdot d\vec l = \mu_0I + \mu_0\epsilon_0\dfrac{d\Phi_E}{dt}$ is the Ampere-Maxwell law`, r`$\oint\vec E\cdot d\vec A = q/\epsilon_0$ holds only for charges at rest`], [0, 1, 2],
    r`A, B and C are the standard laws. Gauss's law for electricity is valid always, for moving or changing charges, so D is false.`),
  msq(4, 'radiation pressure', r`A plane EM wave of intensity $I$ falls on a flat surface of area $A$. Which are correct?`,
    [r`At normal incidence the pressure on a perfect reflector is twice that on a perfect absorber`, r`At normal incidence the pressure on a perfect absorber is $I/c$`, r`If the absorber is hit at angle $\theta$ to the normal, the force along the beam is $IA\cos\theta/c$`, r`The normal pressure on a perfect absorber is $I/c$ at every angle of incidence`], [0, 1, 2],
    r`Normal incidence: absorber $I/c$, reflector $2I/c$ (A, B). Obliquely, the beam intensity through the area falls by $\cos\theta$, so the force is $IA\cos\theta/c$ (C), and its normal part gives pressure $I\cos^2\theta/c$, so D is false.`),
  msq(4, 'photon energy', r`Which of the following statements are correct? (Use $E = hc/\lambda$, $hc = 1240$ eV nm.)`,
    ['An ultraviolet photon has more energy than a visible-light photon', 'A photon of energy 1 eV lies in the infrared', 'All EM waves are made of photons of the same energy', 'X-ray photons have energies of the order of keV'], [0, 1, 3],
    r`Higher frequency means higher energy (A). 1 eV corresponds to $\lambda = 1240$ nm, which is infrared (B). Photon energy $=hf$ depends on the frequency, so C is false. X-ray photons of about 0.1 nm have $E\approx12.4$ keV (D).`),
  msq(4, 'plane wave', r`The electric field of a wave in vacuum is $\vec E = E_0\sin(kz-\omega t)\,\hat x$. Which statements are correct?`,
    [r`The magnetic field is along $\hat y$`, r`$B_0 = E_0/c$`, r`The wave travels along $-z$`, r`$k = \omega/c$`], [0, 1, 3],
    r`$\hat x\times\hat y = \hat z$ so $\vec B$ is along $\hat y$ (A). $B_0 = E_0/c$ (B). The phase $kz-\omega t$ means travel in the $+z$ direction (C false). $k = 2\pi/\lambda = \omega/c$ (D).`),
  nat(4, 'Wien law', r`The Sun's surface at 5800 K radiates most strongly near the wavelength given by $\lambda_mT = 2.898\times10^{-3}$ m K. Find $\lambda_m$ in nm (nearest 10 nm).`, 2.898e-3 / 5800 * 1e9, 5, 0,
    r`$\lambda_m = 2.898\times10^{-3}/5800 = 4.997\times10^{-7}$ m $\approx500$ nm, the green part of the visible spectrum.`, { unit: 'nm' }),
  nat(4, 'photons', r`A 1 W source emits only light of wavelength 500 nm. Find the number of photons it emits per second, in units of $10^{18}$ (2 decimals). Use $hc = 1.986\times10^{-25}$ J m.`, 1 * 500e-9 / HC / 1e18, 0.02, 2,
    r`Energy of one photon $= hc/\lambda = 1.986\times10^{-25}/5\times10^{-7} = 3.97\times10^{-19}$ J. Number per second $= 1/3.97\times10^{-19} = 2.52\times10^{18}$.`),
  nat(4, 'radiation force', r`A 1 kW laser beam is reflected straight back by a perfect mirror. Find the force on the mirror in micronewtons (2 decimals). $c = 3\times10^{8}$.`, 2 * 1000 / 3e8 * 1e6, 0.02, 2,
    r`Each photon's momentum changes from $p$ to $-p$, a change of $2p$. Force $= 2P/c = 2\times1000/3\times10^{8} = 6.67\times10^{-6}$ N $= 6.67\ \mu$N.`, { unit: 'μN', trap: 'Reflection doubles the force compared with absorption.' }),
  nat(4, 'LC oscillator', r`A transmitter radiates at a wavelength of 250 m. A quarter-wave antenna is used. Find its length in metres (1 decimal).`, 250 / 4, 0.05, 1,
    r`The antenna length is $\lambda/4 = 250/4 = 62.5$ m.`, { unit: 'm' }),
  nat(4, 'radiation pressure', r`A 1 kW lamp radiates uniformly in all directions as EM waves. A perfectly absorbing surface faces it normally at 1 m. Find the radiation pressure on it in units of $10^{-7}$ Pa (2 decimals). $c = 3\times10^{8}$.`, 1000 / (4 * Math.PI) / 3e8 / 1e-7, 0.02, 2,
    r`$I = P/4\pi r^2 = 1000/4\pi = 79.6\ \mathrm{W\,m^{-2}}$. Pressure $= I/c = 79.6/3\times10^{8} = 2.65\times10^{-7}$ Pa.`),
  nat(4, 'radiation force', r`Light of intensity $600\ \mathrm{W\,m^{-2}}$ falls on a perfectly absorbing sphere of radius 5 cm. Find the force on it in nN (1 decimal). $c = 3\times10^{8}$.`, 600 * Math.PI * 0.05 ** 2 / 3e8 * 1e9, 0.1, 1,
    r`The sphere intercepts light over its cross-section $\pi R^2$, not its whole surface. $F = I\pi R^2/c = 600\times\pi\times0.0025/3\times10^{8} = 1.57\times10^{-8}$ N $= 15.7$ nN.`, { unit: 'nN', trap: 'Use the cross-section $\\pi R^2$, not $4\\pi R^2$.' }),
  nat(4, 'reflection at a surface', r`Light of intensity $1000\ \mathrm{W\,m^{-2}}$ falls normally on glass of refractive index 1.5. The fraction reflected is $\left(\dfrac{n-1}{n+1}\right)^2$. Find the reflected intensity in $\mathrm{W\,m^{-2}}$.`, 1000 * (0.5 / 2.5) ** 2, 0.5, 0,
    r`Fraction $= (0.5/2.5)^2 = 0.04$. Reflected intensity $= 0.04\times1000 = 40\ \mathrm{W\,m^{-2}}$.`, { unit: 'W/m²' }),
  nat(4, 'displacement current', r`The voltage across a parallel-plate capacitor ($C = 4\ \mu$F) rises at $5\times10^{5}\ \mathrm{V\,s^{-1}}$. Find the displacement current between its plates in A.`, 4e-6 * 5e5, 0, 0,
    r`The displacement current equals the conduction current in the wires: $I_d = C\,dV/dt = 4\times10^{-6}\times5\times10^{5} = 2$ A.`, { unit: 'A' }),
  nat(4, 'wavelength and frequency', r`How many wavelengths of light of wavelength 600 nm fit in a length of 1.2 mm?`, 1.2e-3 / 600e-9, 0, 0,
    r`$N = 1.2\times10^{-3}/6\times10^{-7} = 2000$.`),
  nat(4, 'magnetic field of displacement current', r`A circular parallel-plate capacitor of plate radius 6 cm carries a charging current of 1.5 A. Find the magnetic field between the plates at 3 cm from the axis, in $\mu$T (1 decimal).`, 2e-7 * 1.5 * 0.03 / 0.06 ** 2 * 1e6, 0.05, 1,
    r`Inside the plates, the displacement current through a circle of radius $r$ is $I\,r^2/R^2$. $B\,2\pi r = \mu_0Ir^2/R^2$, so $B = \dfrac{\mu_0Ir}{2\pi R^2} = 2\times10^{-7}\times1.5\times0.03/0.0036 = 2.5\times10^{-6}$ T $= 2.5\ \mu$T.`, { unit: 'μT' }),
  pas(3, 'displacement current', 'p5', r`Find the displacement current between the plates (in A, 1 decimal).`, 1.5, 0.05, 1,
    r`For an ideal capacitor the displacement current equals the conduction current in the connecting wires: 1.5 A.`, { unit: 'A' }),
  pas(4, 'magnetic field of displacement current', 'p5', r`Find $B$ at a distance 3 cm from the axis, between the plates (in $\mu$T, 1 decimal).`, 2e-7 * 1.5 * 0.03 / 0.06 ** 2 * 1e6, 0.05, 1,
    r`$B = \dfrac{\mu_0Ir}{2\pi R^2} = 2\times10^{-7}\times1.5\times0.03/(0.06)^2 = 2.5\times10^{-6}$ T $= 2.5\ \mu$T.`, { unit: 'μT' }),
  pasm(5, 'magnetic field of displacement current', 'p5', r`The field at 12 cm from the axis (outside the plates, in the same plane) is`, 'equal to the field at 3 cm, which is 2.5 μT', ['5.0 μT', '1.25 μT', 'zero, since there is no field outside the plates'],
    r`Outside the plates the whole displacement current $I$ passes through the circle: $B = \mu_0I/2\pi r = 2\times10^{-7}\times1.5/0.12 = 2.5\times10^{-6}$ T. The field rises to a maximum at $r = R$ and then falls as $1/r$.`, { trap: 'Equal values at two different radii: inside it rises as $r$, outside it falls as $1/r$.' }),
  asrt(4, 'displacement current', r`A displacement current exists between the plates of a charging capacitor, even in vacuum.`, r`A changing electric field produces a magnetic field.`, 0,
    r`Both are true and R explains A. The displacement current $\epsilon_0\,d\Phi_E/dt$ is not a flow of charge but behaves like a current because the changing $\vec E$ gives the same magnetic field.`),
  asrt(4, 'radiation pressure', r`Radiation pressure on a perfectly reflecting sphere (specular reflection) is twice that on a perfectly absorbing sphere of the same size.`, r`At normal incidence on a flat surface, reflection changes a photon's momentum twice as much as absorption does.`, 3,
    r`R is true for a flat surface at normal incidence. But for a sphere the rays hit at different angles, and integrating the force over the sphere gives the same total force $I\pi R^2/c$ as for an absorbing sphere. So A is false and R is true.`, { trap: 'The doubling only applies to a flat mirror at normal incidence.' }),
  stm(4, 'greenhouse effect', r`Microwave ovens use a frequency of 2.45 GHz because water molecules have a single sharp resonance at exactly that frequency.`, r`Microwaves heat food by making polar molecules such as water rotate.`, 3,
    r`Statement I is a common myth: water absorbs broadly over a wide range, and 2.45 GHz is chosen because it penetrates food reasonably and is an allowed (ISM) band. Statement II is true. So I false, II true.`),
  stm(4, 'Poynting vector', r`The Poynting vector $\vec S = \dfrac{1}{\mu_0}\vec E\times\vec B$ gives the direction of energy flow of an EM wave.`, r`For a plane wave in vacuum, $\vec S$ points along the direction of propagation.`, 0,
    r`$\vec S$ is the energy flow per unit area per unit time. For $\vec E\perp\vec B$ in a plane wave, $\vec E\times\vec B$ points along the propagation direction. Both true.`),
  cnt(4, 'EM waves', r`How many of the following statements are correct?`, [
    r`Radio waves can pass through vacuum.`,
    r`Gamma rays have a longer wavelength than microwaves.`,
    r`UV radiation can cause sunburn.`,
    r`Infrared radiation is deflected by a magnetic field.`], 2,
    r`(1) true. (2) false: gamma rays are among the shortest. (3) true. (4) false: EM waves are neutral and are not deflected by fields. So two are correct.`),
  mat(4, 'Maxwell equations', 'm8', r`Match each of Maxwell's equations in List I with the statement it expresses in List II.`, 'A-s, B-p, C-q, D-r', ['A-p, B-s, C-q, D-r', 'A-s, B-q, C-p, D-r', 'A-s, B-p, C-r, D-q'],
    r`Gauss's law for electricity: charge is the source of $\vec E$ (s). Gauss's law for magnetism: no monopoles (p). Faraday's law: changing $\vec B$ produces $\vec E$ (q). Ampere-Maxwell law: changing $\vec E$ (and current) produces $\vec B$ (r). So A-s, B-p, C-q, D-r.`),
  mat(4, 'radiation pressure', 'm9', r`Light of intensity $I$ falls on a surface. Match each case in List I with the force per unit area (normal to the surface) in List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`A: perfect absorber, normal: $I/c$ (p). B: perfect reflector, normal: $2I/c$ (q). C: a surface reflecting 50% normally: $(1+0.5)I/c = 1.5I/c$ (r). D: perfect absorber, incidence $60^\circ$: $I\cos^260^\circ/c = I/4c$ (s). So A-p, B-q, C-r, D-s.`),
  mat(4, 'medium', 'm10', r`Match each non-magnetic medium in List I (with $\mu_r = 1$) with the refractive index in List II, using $n = \sqrt{\epsilon_r\mu_r}$.`, 'A-p, B-s, C-r, D-q', ['A-s, B-p, C-r, D-q', 'A-p, B-q, C-r, D-s', 'A-p, B-s, C-q, D-r'],
    r`$n = \sqrt{\epsilon_r}$. A: $\epsilon_r = 4$ gives 2 (p). B: $\epsilon_r = 9$ gives 3 (s). C: $\epsilon_r = 1$ gives 1 (r). D: $\epsilon_r = 36$ gives 6 (q). So A-p, B-s, C-r, D-q.`),
  mat(5, 'plane wave', 'm11', r`Each wave in List I travels in vacuum and has $\vec E$ as described. Match with the direction of $\vec B$ in List II. Here $kx\mp\omega t$ describes motion along $\pm x$.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    r`$\vec S\parallel\vec E\times\vec B$. A: moves $+x$, $\vec E\parallel\hat y$: $\hat y\times\hat z = \hat x$, so $\vec B\parallel+\hat z$ (p). B: moves $+x$, $\vec E\parallel\hat z$: $\hat z\times(-\hat y) = \hat x$, so $\vec B\parallel-\hat y$ (q). C: moves $-x$, $\vec E\parallel\hat y$: $\hat y\times(-\hat z) = -\hat x$, so $\vec B\parallel-\hat z$ (r). D: moves $-x$, $\vec E\parallel\hat z$: $\hat z\times\hat y = -\hat x$, so $\vec B\parallel+\hat y$ (s). So A-p, B-q, C-r, D-s.`),

  // ---------- Level 5 ----------
  msq(5, 'displacement current', r`A parallel-plate capacitor is charged through connecting wires. Which statements are correct?`,
    ['A displacement current exists only where the electric field is changing', 'For an ideal capacitor it equals the conduction current in the wires', 'It produces a magnetic field in the same way as a conduction current', 'It exists only inside dielectric materials, not in vacuum'], [0, 1, 2],
    r`$I_d = \epsilon_0\,d\Phi_E/dt$ is non-zero only where $\vec E$ changes (A). Continuity of current requires $I_d = I$ (B). It is a source of $\vec B$ in the Ampere-Maxwell law (C). It exists in vacuum too (D false).`),
  msq(5, 'EM waves in a medium', r`A plane EM wave goes from vacuum into a non-magnetic medium of refractive index $n>1$. Which statements are correct?`,
    ['The frequency is unchanged', r`The wavelength becomes $\lambda_0/n$`, r`$E_0/B_0 = c/n$`, 'The electric energy density becomes larger than the magnetic energy density'], [0, 1, 2],
    r`Frequency is fixed by the source (A). $v = c/n$ so $\lambda = v/f = \lambda_0/n$ (B). $E_0/B_0 = v = c/n$ (C). Electric and magnetic energy densities stay equal because $\tfrac12\epsilon E^2 = \tfrac12B^2/\mu$ when $E = vB$ (D false).`),
  msq(5, 'electromagnetic spectrum', r`Which statements about the EM spectrum are correct?`,
    ['The wavelength ranges of X-rays and gamma rays overlap', 'Visible light covers roughly 400 nm to 700 nm', 'The ozone layer absorbs most of the Sun\'s harmful ultraviolet radiation', 'Microwave ovens use 2.45 GHz because it is the one exact resonant frequency of water'], [0, 1, 2],
    r`A, B and C are standard facts. D is a myth: water absorbs over a broad range and 2.45 GHz is used for practical reasons.`),
  msq(5, 'sources of EM waves', r`Which statements about the production of EM waves are correct?`,
    ['An accelerating charge radiates EM waves', 'A charge moving at constant velocity does not radiate', 'An LC circuit with an antenna can produce EM waves', 'A static electric charge produces EM waves'], [0, 1, 2],
    r`Only accelerated charges radiate. A uniformly moving charge has a steady field (in its own frame, a static one). An oscillating LC circuit involves accelerating charges and so, with an antenna, radiates. A static charge does not (D false).`),
  msq(5, 'Poynting vector', r`A circular parallel-plate capacitor is being charged. Which statements about energy flow are correct?`,
    ['The Poynting vector at the rim points radially inward', 'The power flowing in through the rim equals $dU/dt$, the rate at which the stored energy rises', 'While it is discharging, the Poynting vector at the rim points outward', 'There is no energy flux because no EM wave is present'], [0, 1, 2],
    r`The field $E$ between the plates (axial) and the circulating $B$ (from $\epsilon_0\,dE/dt$) give $\vec S\propto\vec E\times\vec B$ pointing inward while charging, and outward while discharging. The total inflow is $dU/dt$. A flux exists in the fields although there is no travelling wave (D false).`),
  nat(5, 'Poynting vector', r`The plates of a circular parallel-plate capacitor have radius 5 cm and separation 2 mm. The voltage rises at $10^{3}\ \mathrm{V\,s^{-1}}$ when it is 100 V. Find the rate at which energy is stored in its field, equal to the power flowing in through the rim, in $\mu$W (2 decimals). $\epsilon_0 = 8.85\times10^{-12}$.`, E0P * Math.PI * 0.05 ** 2 / 2e-3 * 100 * 1e3 * 1e6, 0.03, 2,
    r`$C = \epsilon_0\pi R^2/d = 8.85\times10^{-12}\times\pi(0.05)^2/0.002 = 3.48\times10^{-11}$ F. $U = \tfrac12CV^2$, so $dU/dt = CV\,dV/dt = 3.48\times10^{-11}\times100\times10^{3} = 3.48\times10^{-6}$ W $= 3.48\ \mu$W. By the Poynting theorem this flows in radially through the rim.`, { unit: 'μW' }),
  mcq(5, 'radiation pressure', r`A beam of intensity $I$ falls on a perfectly <b>reflecting</b> sphere of radius $R$ (specular reflection, geometric optics). The force on it is`, r`$\dfrac{I\pi R^{2}}{c}$, the same as for a perfectly absorbing sphere`, [r`$\dfrac{2I\pi R^{2}}{c}$`, r`$\dfrac{I\pi R^{2}}{2c}$`, r`$\dfrac{4I\pi R^{2}}{c}$`],
    r`A ray hitting at incidence angle $\alpha$ is turned through $\pi-2\alpha$, so its momentum change along the beam is $p(1+\cos2\alpha) = 2p\cos^2\alpha$. The area of the ring at $\alpha$ is $2\pi R^2\sin\alpha\cos\alpha\,d\alpha$ (projected). So $F = \dfrac{I}{c}\int_0^{\pi/2}2\cos^2\alpha\cdot2\pi R^2\sin\alpha\cos\alpha\,d\alpha = \dfrac{I}{c}\,4\pi R^2\cdot\dfrac14 = \dfrac{I\pi R^2}{c}$. It is the same as for an absorbing sphere.`, { trap: 'The factor 2 for reflection is cancelled by the angles at which the rays hit a curved surface.' }),
  asrt(5, 'Poynting vector', r`Energy flows into a charging capacitor through the space around its plates, not only through the wires.`, r`The Poynting vector $\vec E\times\vec B/\mu_0$ at the rim of the plates points radially inward.`, 0,
    r`Both true and R explains A. The charging field $E$ and the circulating magnetic field around the changing $E$ give an inward Poynting vector, which carries the energy into the gap from the sides.`),
  stm(5, 'wave in a medium', r`The ratio of the electric to the magnetic energy density in a plane EM wave in a non-magnetic medium is 1.`, r`In a medium $E = vB$ with $v = 1/\sqrt{\mu\epsilon}$.`, 0,
    r`$u_E = \tfrac12\epsilon E^2$ and $u_B = B^2/2\mu = E^2/(2\mu v^2) = \tfrac12\epsilon E^2$ using $v^2 = 1/\mu\epsilon$. So they are equal: ratio 1. Both true and II explains I.`),

  // ---------- Level 4: more whole-number answers and one more match ----------
  nat(4, 'medium', r`Light of wavelength 600 nm in vacuum enters glass of refractive index 1.5. Find its wavelength in the glass in nm.`, 600 / 1.5, 0, 0,
    r`$\lambda = \lambda_0/n = 600/1.5 = 400$ nm. The frequency does not change; the speed and the wavelength both drop by the factor $n$.`, { unit: 'nm' }),
  nat(4, 'radiation pressure', r`Light falls on a perfectly absorbing surface at $60^\circ$ to the normal. The normal pressure is $1/x$ of the pressure for normal incidence of the same beam. Find $x$.`, 1 / Math.cos(Math.PI / 3) ** 2, 0, 0,
    r`The beam's power through the surface falls by $\cos\theta$ and the normal component of its momentum by another $\cos\theta$, so $P = I\cos^2\theta/c$. $\cos^260^\circ = 1/4$, so $x = 4$.`, { trap: 'One factor of $\\cos\\theta$ gives the force along the beam, two give the normal pressure.' }),
  nat(4, 'radiation force', r`A 3 W laser beam is reflected straight back by a plane mirror. Find the force on the mirror in nN. $c = 3\times10^{8}\ \mathrm{m\,s^{-1}}$.`, 2 * 3 / 3e8 * 1e9, 0, 0,
    r`$F = 2P/c = 2\times3/3\times10^{8} = 2\times10^{-8}$ N $= 20$ nN.`, { unit: 'nN' }),
  nat(4, 'Wien law', r`A hot filament has its strongest emission at 1449 nm. Use $\lambda_mT = 2.898\times10^{-3}$ m K to find its temperature in kelvin (nearest 10 K).`, 2.898e-3 / 1.449e-6, 10, 0,
    r`$T = 2.898\times10^{-3}/1.449\times10^{-6} = 2000$ K.`, { unit: 'K' }),
  nat(4, 'photon energy', r`X-ray photons have energy 12.4 keV. Find their wavelength in picometres ($hc = 1240$ eV nm, $1\ \mathrm{nm} = 1000$ pm).`, 1240 / 12400 * 1000, 0, 0,
    r`$\lambda = hc/E = 1240\ \mathrm{eV\,nm}/12\,400\ \mathrm{eV} = 0.1$ nm $= 100$ pm.`, { unit: 'pm', trap: 'Keep keV and eV consistent.' }),
  nat(4, 'intensity', r`By what factor must the intensity of a plane wave be increased to double the amplitude of its electric field?`, 4, 0, 0,
    r`$I\propto E_0^2$. Doubling $E_0$ multiplies $I$ by $2^2 = 4$.`),
  nat(4, 'medium', r`In a non-magnetic medium of refractive index 1.5, the ratio $E_0/B_0$ of an EM wave is $x\times10^{8}\ \mathrm{m\,s^{-1}}$. Find $x$.`, 3 / 1.5, 0, 0,
    r`$E_0/B_0 = c/n = 3\times10^{8}/1.5 = 2\times10^{8}\ \mathrm{m\,s^{-1}}$, so $x = 2$.`),
  nat(4, 'E and B amplitudes', r`An EM wave in vacuum has an electric field amplitude of 600 V m$^{-1}$. Find its magnetic field amplitude in $\mu$T. $c = 3\times10^{8}$.`, 600 / 3e8 * 1e6, 0, 0,
    r`$B_0 = E_0/c = 600/3\times10^{8} = 2\times10^{-6}$ T $= 2\ \mu$T.`, { unit: 'μT' }),
  nat(4, 'medium', r`A light wave of frequency $5\times10^{14}$ Hz travels in a medium of refractive index 2. Find its wavelength in the medium, in nm. $c = 3\times10^{8}$.`, 3e8 / 2 / 5e14 * 1e9, 0, 0,
    r`$v = c/n = 1.5\times10^{8}\ \mathrm{m\,s^{-1}}$. $\lambda = v/f = 1.5\times10^{8}/5\times10^{14} = 3\times10^{-7}$ m $= 300$ nm.`, { unit: 'nm' }),
  nat(4, 'point source', r`A point source radiates uniformly. The amplitude of its electric field at 2 m is $E_1$ and at 6 m is $E_2$. Find $E_1/E_2$.`, 6 / 2, 0, 0,
    r`$E_0\propto\sqrt I\propto1/r$, so $E_1/E_2 = r_2/r_1 = 6/2 = 3$.`, { trap: 'The amplitude ratio is 3, the intensity ratio would be 9.' }),
  nat(4, 'LC oscillator', r`A radio is to be tuned to a wavelength of 300 m using a capacitance of 100 pF. Find the inductance needed in $\mu$H (nearest integer). $c = 3\times10^{8}$.`, (300 / (2 * Math.PI * 3e8)) ** 2 / 100e-12 * 1e6, 1, 0,
    r`$f = c/\lambda = 10^{6}$ Hz. $L = \dfrac{1}{4\pi^2f^2C} = \dfrac{1}{4\pi^2\times10^{12}\times10^{-10}} = 2.53\times10^{-4}$ H $\approx253\ \mu$H.`, { unit: 'μH' }),
  mat(4, 'plane wave', 'm12', r`A plane EM wave in vacuum has electric field amplitude $E_0 = 300\ \mathrm{V\,m^{-1}}$. Match each quantity in List I with its value in List II. Use $\epsilon_0 = 8.85\times10^{-12}$, $c = 3\times10^{8}$.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`A: $B_0 = E_0/c = 10^{-6}$ T $= 1.0\ \mu$T (p). B: $I = \tfrac12\epsilon_0cE_0^2 = 0.5\times8.85\times10^{-12}\times3\times10^{8}\times9\times10^{4} = 119.5\approx120\ \mathrm{W\,m^{-2}}$ (q). C: pressure on a perfect absorber $I/c = 4.0\times10^{-7}$ Pa (r). D: rms field $E_0/\sqrt2 = 212\ \mathrm{V\,m^{-1}}$ (s). So A-p, B-q, C-r, D-s.`),
];
const REG = ['Radio waves', 'Microwaves', 'Infrared rays', 'Visible light', 'Ultraviolet rays', 'X-rays', 'Gamma rays'];
const regOf = (lam) => (lam >= 0.1 ? 0 : lam >= 1e-3 ? 1 : lam >= 7e-7 ? 2 : lam >= 4e-7 ? 3 : lam >= 1e-9 ? 4 : lam >= 1e-12 ? 5 : 6);
const groups = {
  m1: { title: 'Sources of radiation',
    list1: ['A. Radio waves', 'B. Microwaves', 'C. X-rays', 'D. Gamma rays'],
    list2: ['p. Fast electrons stopped by a metal target', 'q. An oscillating LC circuit', 'r. Radioactive nuclei', 's. A magnetron'] },
  m2: { title: 'Uses of radiation',
    list1: ['A. Microwaves', 'B. Infrared rays', 'C. Ultraviolet rays', 'D. X-rays'],
    list2: ['p. TV remote controls', 'q. Sterilising water', 'r. Photographing bones', 's. Radar'] },
  m3: { title: 'Typical wavelengths',
    list1: ['A. Radio waves', 'B. Microwaves', 'C. Visible light', 'D. X-rays'],
    list2: [r`p. $10^{-10}$ m`, r`q. $5\times10^{-7}$ m`, r`r. $10^{-2}$ m`, r`s. $10^{2}$ m`] },
  m4: { title: 'Relations for a plane EM wave in vacuum',
    list1: ['A. Speed of the wave', 'B. Ratio of the amplitudes $E_0/B_0$', 'C. Average intensity', 'D. Radiation pressure on a perfect absorber'],
    list2: [r`p. $c$`, r`q. $1/\sqrt{\mu_0\epsilon_0}$`, r`r. $\tfrac12\epsilon_0cE_0^2$`, r`s. $I/c$`] },
  p1: { title: 'Light on a solar panel',
    passage: r`<p>Sunlight of intensity $1000\ \mathrm{W\,m^{-2}}$ falls normally on a flat solar panel. Treat it as a plane EM wave in vacuum. Take $\epsilon_0 = 8.85\times10^{-12}$ SI and $c = 3\times10^8\ \mathrm{m\,s^{-1}}$.</p>` },
  p2: { title: 'A charging capacitor',
    passage: r`<p>An air-filled parallel-plate capacitor of capacitance $5\ \mu$F is being charged so that the voltage across it rises at $8\times10^3\ \mathrm{V\,s^{-1}}$.</p>` },
  p3: { title: 'Reading a wave equation',
    passage: r`<p>A plane EM wave in vacuum has the electric field $E_y = 90\sin(1.257\times10^{7}x - 3.77\times10^{15}t)$ V m$^{-1}$, with $x$ in metres and $t$ in seconds.</p>` },
  m5: { title: 'Frequencies',
    list1: ['A. FM radio', 'B. Microwave oven', 'C. Visible light', 'D. Medical X-rays'],
    list2: [r`p. $10^{8}$ Hz`, r`q. $10^{9}$ Hz`, r`r. $5\times10^{14}$ Hz`, r`s. $10^{18}$ Hz`] },
  m6: { title: 'Applications',
    list1: ['A. Aircraft radar', 'B. Sunburn', 'C. Seeing a fracture on a screen', 'D. Sterilising food, cancer therapy'],
    list2: ['p. X-rays', 'q. Gamma rays', 'r. Microwaves', 's. Ultraviolet'] },
  m7: { title: 'A wave entering a medium',
    list1: ['A. Speed', 'B. Wavelength', 'C. Frequency', 'D. Ratio of electric to magnetic energy density'],
    list2: [r`p. $c/n$`, r`q. $\lambda_0/n$`, r`r. $f_0$`, 's. 1'] },
  m8: { title: "Maxwell's equations",
    list1: [r`A. Gauss's law for electricity`, r`B. Gauss's law for magnetism`, r`C. Faraday's law`, r`D. Ampere-Maxwell law`],
    list2: ['p. There are no magnetic monopoles', 'q. A changing magnetic field produces an electric field', 'r. A changing electric field (or a current) produces a magnetic field', 's. Electric charge is the source of the electric field'] },
  m9: { title: 'Radiation pressure',
    list1: ['A. Perfect absorber, normal incidence', 'B. Perfect reflector, normal incidence', 'C. Surface reflecting 50 % of the light, normal incidence', r`D. Perfect absorber, light at $60^\circ$ to the normal`],
    list2: [r`p. $I/c$`, r`q. $2I/c$`, r`r. $1.5I/c$`, r`s. $I/4c$`] },
  m10: { title: 'Refractive index from permittivity',
    list1: [r`A. $\epsilon_r = 4$`, r`B. $\epsilon_r = 9$`, r`C. $\epsilon_r = 1$`, r`D. $\epsilon_r = 36$`],
    list2: ['p. 2', 'q. 6', 'r. 1', 's. 3'] },
  m11: { title: 'Directions in a plane wave',
    list1: [r`A. Moves along $+x$, $\vec E$ along $+y$`, r`B. Moves along $+x$, $\vec E$ along $+z$`, r`C. Moves along $-x$, $\vec E$ along $+y$`, r`D. Moves along $-x$, $\vec E$ along $+z$`],
    list2: [r`p. $\vec B$ along $+z$`, r`q. $\vec B$ along $-y$`, r`r. $\vec B$ along $-z$`, r`s. $\vec B$ along $+y$`] },
  p4: { title: 'A laser pointer',
    passage: r`<p>A laser pointer emits $5.0$ mW of light of wavelength 600 nm in a beam of circular cross-section of radius 1.0 mm (uniform intensity). Take $\epsilon_0 = 8.85\times10^{-12}$, $c = 3\times10^{8}\ \mathrm{m\,s^{-1}}$.</p>` },
  p5: { title: 'A charging capacitor',
    passage: r`<p>A parallel-plate capacitor has circular plates of radius $R = 6.0$ cm. It is being charged by a steady current of 1.5 A in the connecting wires. Use $\mu_0 = 4\pi\times10^{-7}$ T m A$^{-1}$.</p>` },
  m12: { title: 'A plane wave with E0 = 300 V/m',
    list1: ['A. Amplitude of $B$', 'B. Average intensity', 'C. Radiation pressure on a perfect absorber', 'D. Root-mean-square electric field'],
    list2: [r`p. $1.0\ \mu$T`, r`q. $120\ \mathrm{W\,m^{-2}}$`, r`r. $4.0\times10^{-7}$ Pa`, r`s. $212\ \mathrm{V\,m^{-1}}$`] },
};
const gens = [
  { id: 'ew-g01', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'wavelength and frequency',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const f = choose(rng, [88, 100, 500, 900, 1000]); const l = C / (f * 1e6); return { f, v, q: `A radio station broadcasts at ${f} MHz. Find the wavelength of its waves (in m, 2 decimals). Take $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$.`, answer: N(l, 2), tol: 0.01 * l + 0.005, unit: 'm', sol: `$\\lambda = \\dfrac cf = \\dfrac{3\\times10^8}{${f}\\times10^6} = ${S(l, 4)}$ m.` }; }
      if (v === 1) { const l = choose(rng, [300, 400, 500, 600, 750]); const f = C / (l * 1e-9); return { l, v, q: `Find the frequency of light of wavelength ${l} nm in vacuum (in units of $10^{14}$ Hz, 2 decimals).`, answer: N(f / 1e14, 2), tol: 0.01 * f / 1e14 + 0.005, unit: '1e14 Hz', sol: `$f = \\dfrac c\\lambda = \\dfrac{3\\times10^8}{${l}\\times10^{-9}} = ${S(f / 1e14, 4)}\\times10^{14}$ Hz.` }; }
      const l0 = choose(rng, [400, 500, 600, 700]); const n = choose(rng, [1.33, 1.5, 1.6]); const l = l0 / n;
      return { l0, n, v, q: `Light of wavelength ${l0} nm in vacuum enters a medium of refractive index ${n}. Find its wavelength there (in nm, 1 decimal).`, answer: N(l, 1), tol: 0.01 * l + 0.05, unit: 'nm', sol: `$\\lambda = \\lambda_0/n = ${l0}/${n} = ${S(l, 4)}$ nm. The frequency does not change.`, trap: 'Wavelength shrinks in a medium; frequency stays the same.' };
    },
    verify: (p) => { if (p.v === 0) { const w = 2 * Math.PI * p.f * 1e6; const k = w / C; return 2 * Math.PI / k; } if (p.v === 1) { const w = 2 * Math.PI * C / (p.l * 1e-9); return w / (2 * Math.PI) / 1e14; } const vm = C / p.n; const f = C / (p.l0 * 1e-9); return vm / f * 1e9; } },
  { id: 'ew-g02', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'E and B amplitudes',
    make(rng) {
      const v = int(rng, 0, 2); const E0 = choose(rng, [30, 60, 90, 150, 300, 450]); const n = choose(rng, [1.33, 1.5, 2]); const B0u = choose(rng, [0.1, 0.2, 0.5, 1.5]);
      if (v === 0) { const B = E0 / C * 1e6; return { E0, v, q: `The electric field amplitude of an EM wave in vacuum is ${E0} $\\mathrm{V\\,m^{-1}}$. Find the magnetic field amplitude (in $\\mu$T, 3 decimals).`, answer: N(B, 3), tol: 0.002, unit: 'µT', sol: `$B_0 = E_0/c = ${E0}/(3\\times10^8) = ${S(B, 4)}\\ \\mu$T.` }; }
      if (v === 1) { const E = B0u * 1e-6 * C; return { B0u, v, q: `The magnetic field amplitude of an EM wave in vacuum is ${B0u} $\\mu$T. Find the electric field amplitude (in $\\mathrm{V\\,m^{-1}}$).`, answer: N(E, 1), tol: 0.01 * E + 0.1, unit: 'V/m', sol: `$E_0 = cB_0 = 3\\times10^8\\times${B0u}\\times10^{-6} = ${S(E, 4)}\\ \\mathrm{V\\,m^{-1}}$.` }; }
      const B = n * E0 / C * 1e6; return { E0, n, v, q: `An EM wave of electric amplitude ${E0} $\\mathrm{V\\,m^{-1}}$ travels in a non-magnetic medium of refractive index ${n}. Find the magnetic amplitude (in $\\mu$T, 3 decimals).`, answer: N(B, 3), tol: 0.002 + 0.005 * B, unit: 'µT', sol: `$E_0/B_0 = v = c/n$, so $B_0 = nE_0/c = ${n}\\times${E0}/(3\\times10^8) = ${S(B, 4)}\\ \\mu$T.`, trap: 'In a medium the ratio E0/B0 is c/n, not c.' };
    },
    verify: (p) => { if (p.v === 0) return p.E0 / (1 / Math.sqrt(4e-7 * Math.PI * 8.85e-12)) * 1e6; if (p.v === 1) return p.B0u * 1e-6 / Math.sqrt(4e-7 * Math.PI * 8.85e-12) * 1e0 * (1) ; return p.E0 / (C / p.n) * 1e6; } },
  { id: 'ew-g03', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'intensity and energy density',
    make(rng) {
      const v = int(rng, 0, 2); const E0 = choose(rng, [20, 50, 100, 200, 500, 1000]);
      const I = 0.5 * E0P * C * E0 * E0;
      if (v === 0) return { E0, v, q: `The electric amplitude of a plane EM wave in vacuum is ${E0} $\\mathrm{V\\,m^{-1}}$. Find its intensity (in $\\mathrm{W\\,m^{-2}}$, 2 decimals). $\\epsilon_0 = 8.85\\times10^{-12}$, $c = 3\\times10^8$ SI.`, answer: N(I, 2), tol: 0.01 * I + 0.01, unit: 'W/m^2', sol: `$I = \\tfrac12\\epsilon_0cE_0^2 = 0.5\\times8.85\\times10^{-12}\\times3\\times10^8\\times${E0}^2 = ${S(I, 4)}\\ \\mathrm{W\\,m^{-2}}$.`, trap: 'Do not forget the 1/2 from averaging.' };
      if (v === 1) { const Is = +I.toPrecision(3); const Ex = Math.sqrt(2 * Is / (E0P * C)); return { E0, Is, v, q: `A plane EM wave in vacuum has an intensity of ${Is} $\\mathrm{W\\,m^{-2}}$. Find its electric amplitude (in $\\mathrm{V\\,m^{-1}}$, 1 decimal). $\\epsilon_0 = 8.85\\times10^{-12}$, $c = 3\\times10^8$ SI.`, answer: N(Ex, 1), tol: 0.01 * Ex + 0.1, unit: 'V/m', sol: `$E_0 = \\sqrt{\\dfrac{2I}{\\epsilon_0c}} = \\sqrt{\\dfrac{2\\times${Is}}{8.85\\times10^{-12}\\times3\\times10^8}} = ${S(Ex, 4)}\\ \\mathrm{V\\,m^{-1}}$.` }; }
      const u = 0.5 * E0P * E0 * E0; return { E0, v, q: `The electric amplitude of a plane EM wave in vacuum is ${E0} $\\mathrm{V\\,m^{-1}}$. Find its average energy density (in units of $10^{-9}\\ \\mathrm{J\\,m^{-3}}$, 3 decimals). $\\epsilon_0 = 8.85\\times10^{-12}$ SI.`, answer: N(u * 1e9, 3), tol: 0.01 * u * 1e9 + 0.003, unit: '1e-9 J/m^3', sol: `Electric and magnetic parts are equal; total $u = \\tfrac12\\epsilon_0E_0^2 = 0.5\\times8.85\\times10^{-12}\\times${E0}^2 = ${S(u * 1e9, 4)}\\times10^{-9}\\ \\mathrm{J\\,m^{-3}}$.` };
    },
    verify: (p) => { if (p.v === 0) { const B0 = p.E0 / C; return p.E0 * B0 / (2 * 4e-7 * Math.PI); } if (p.v === 1) { const u = p.Is / C; return Math.sqrt(2 * u / E0P); } const B0 = p.E0 / C; return (0.5 * E0P * p.E0 ** 2 + 0.5 * B0 * B0 / (4e-7 * Math.PI)) / 2 * 1e9; } },
  { id: 'ew-g04', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'point source',
    make(rng) {
      const P = choose(rng, [40, 60, 100, 200, 500]); const r = choose(rng, [1, 2, 3, 5, 10]); const v = int(rng, 0, 2);
      const I = P / (4 * Math.PI * r * r);
      if (v === 0) return { P, r, v, q: `A ${P} W source radiates EM waves uniformly in all directions. Find the intensity at ${r} m (in $\\mathrm{W\\,m^{-2}}$, 3 decimals).`, answer: N(I, 3), tol: 0.01 * I + 0.002, unit: 'W/m^2', sol: `$I = \\dfrac{P}{4\\pi r^2} = \\dfrac{${P}}{4\\pi\\times${r * r}} = ${S(I, 4)}\\ \\mathrm{W\\,m^{-2}}$.` };
      if (v === 1) { const E = Math.sqrt(2 * I / (E0P * C)); return { P, r, v, q: `A ${P} W source radiates EM waves uniformly in all directions. Find the amplitude of the electric field at ${r} m (in $\\mathrm{V\\,m^{-1}}$, 2 decimals). $\\epsilon_0 = 8.85\\times10^{-12}$, $c = 3\\times10^8$ SI.`, answer: N(E, 2), tol: 0.01 * E + 0.01, unit: 'V/m', sol: `$I = P/4\\pi r^2 = ${S(I, 4)}$. $E_0 = \\sqrt{2I/\\epsilon_0c} = \\sqrt{\\dfrac{2\\times${S(I, 4)}}{2.655\\times10^{-3}}} = ${S(E, 4)}\\ \\mathrm{V\\,m^{-1}}$.` }; }
      const Is = +I.toPrecision(3); const rr = Math.sqrt(P / (4 * Math.PI * Is));
      return { P, r, Is, v, q: `The intensity of the radiation from a ${P} W isotropic source is ${Is} $\\mathrm{W\\,m^{-2}}$ at some point. Find the distance of the point from the source (in m, 2 decimals).`, answer: N(rr, 2), tol: 0.01 * rr + 0.01, unit: 'm', sol: `$r = \\sqrt{\\dfrac{P}{4\\pi I}} = \\sqrt{\\dfrac{${P}}{4\\pi\\times${Is}}} = ${S(rr, 4)}$ m.` };
    },
    verify: (p) => { if (p.v === 0) return p.P / (4 * Math.PI * p.r * p.r); if (p.v === 1) { const E = Math.sqrt(2 * C * 4e-7 * Math.PI * p.P / (4 * Math.PI * p.r * p.r)) ; return E * 1; } return Math.sqrt(p.P / (4 * Math.PI * p.Is)); } },
  { id: 'ew-g05', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'radiation pressure',
    make(rng) {
      const I = choose(rng, [300, 600, 900, 1200, 1400]); const v = int(rng, 0, 2); const A = choose(rng, [0.5, 1, 2, 4]); const rf = choose(rng, [0.2, 0.5, 0.8]);
      if (v === 0) { const P = I / C * 1e6; return { I, v, q: `Light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ falls normally on a perfectly absorbing surface. Find the radiation pressure (in units of $10^{-6}$ Pa, 2 decimals).`, answer: N(P, 2), tol: 0.01 * P + 0.01, unit: '1e-6 Pa', sol: `$P = I/c = ${I}/(3\\times10^8) = ${S(P, 4)}\\times10^{-6}$ Pa.` }; }
      if (v === 1) { const P = 2 * I / C * 1e6; return { I, v, q: `Light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ falls normally on a perfectly reflecting surface. Find the radiation pressure (in units of $10^{-6}$ Pa, 2 decimals).`, answer: N(P, 2), tol: 0.01 * P + 0.01, unit: '1e-6 Pa', sol: `$P = 2I/c = ${2 * I}/(3\\times10^8) = ${S(P, 4)}\\times10^{-6}$ Pa.`, trap: 'Reflection doubles the momentum transfer.' }; }
      const F = (1 + rf) * I * A / C * 1e6; return { I, A, rf, v, q: `A surface of area ${A} $\\mathrm{m^2}$ reflects ${rf * 100}\\% of the normally incident light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ and absorbs the rest. Find the force on it (in $10^{-6}$ N, 2 decimals).`, answer: N(F, 2), tol: 0.01 * F + 0.01, unit: '1e-6 N', sol: `Force $= (1+r)\\dfrac{IA}{c} = ${S(1 + rf)}\\times\\dfrac{${I}\\times${A}}{3\\times10^8} = ${S(F, 4)}\\times10^{-6}$ N. (Absorbed part gives $IA(1-r)/c$ and the reflected part $2IAr/c$.)` };
    },
    verify: (p) => { if (p.v === 0) return p.I * 1 / C * 1e6; if (p.v === 1) return (p.I / C + p.I / C) * 1e6; return ((1 - p.rf) * p.I * p.A / C + 2 * p.rf * p.I * p.A / C) * 1e6; } },
  { id: 'ew-g06', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'displacement current',
    make(rng) {
      const v = int(rng, 0, 3);
      if (v === 0) { const Cc = choose(rng, [1, 2, 5, 10]); const dv = choose(rng, [1, 2, 5, 8]) * 1e3; const Id = Cc * 1e-6 * dv * 1e3; return { Cc, dv, v, q: `A ${Cc} $\\mu$F capacitor has its voltage changing at ${S(dv)} $\\mathrm{V\\,s^{-1}}$. Find the displacement current between its plates (in mA).`, answer: N(Id, 2), tol: 0.01 * Id + 0.01, unit: 'mA', sol: `$I_d = C\\dfrac{dV}{dt} = ${Cc}\\times10^{-6}\\times${S(dv)} = ${S(Id / 1e3, 4)}$ A $= ${S(Id, 4)}$ mA.` }; }
      if (v === 1) { const A = choose(rng, [0.005, 0.01, 0.02, 0.05]); const dE = choose(rng, [1, 2, 5]) * 1e11; const Id = E0P * A * dE; return { A, dE, v, q: `The plates of a capacitor have area ${A} $\\mathrm{m^2}$ and the field between them changes at ${S(dE / 1e11)}$\\times10^{11}\\ \\mathrm{V\\,m^{-1}s^{-1}}$. Find the displacement current (in A, 3 decimals). $\\epsilon_0 = 8.85\\times10^{-12}$ SI.`, answer: N(Id, 3), tol: 0.01 * Id + 0.001, unit: 'A', sol: `$I_d = \\epsilon_0A\\dfrac{dE}{dt} = 8.85\\times10^{-12}\\times${A}\\times${tx(dE, 2)} = ${S(Id, 4)}$ A.` }; }
      const R = choose(rng, [0.05, 0.08, 0.1]); const I = choose(rng, [1, 2, 3, 4]); const rr = choose(rng, [0.3, 0.5, 0.8]) * R; const B = 4e-7 * Math.PI * I * rr / (2 * Math.PI * R * R) * 1e6;
      if (v === 2) return { R, I, rr, v, q: `A capacitor with circular plates of radius ${R * 100} cm is charged by a current of ${I} A. Find the magnetic field between the plates at ${S(rr * 100, 3)} cm from the axis (in $\\mu$T, 2 decimals). $\\mu_0 = 4\\pi\\times10^{-7}$ SI.`, answer: N(B, 2), tol: 0.01 * B + 0.01, unit: 'µT', sol: `Inside the plates the displacement current through radius $r$ is $I\\,r^2/R^2$. $B = \\dfrac{\\mu_0Ir}{2\\pi R^2} = \\dfrac{2\\times10^{-7}\\times${I}\\times${S(rr, 4)}}{${S(R * R, 4)}} = ${S(B, 4)}\\ \\mu$T.` };
      const ro = choose(rng, [1.5, 2, 3]) * R; const Bo = 4e-7 * Math.PI * I / (2 * Math.PI * ro) * 1e6;
      return { R, I, ro, v, q: `A capacitor with circular plates of radius ${R * 100} cm is charged by a current of ${I} A. Find the magnetic field at ${S(ro * 100, 3)} cm from the axis, outside the plates, in the mid-plane (in $\\mu$T, 2 decimals). $\\mu_0 = 4\\pi\\times10^{-7}$ SI.`, answer: N(Bo, 2), tol: 0.01 * Bo + 0.01, unit: 'µT', sol: `Outside, the loop encloses the whole displacement current $I$: $B = \\dfrac{\\mu_0I}{2\\pi r} = \\dfrac{2\\times10^{-7}\\times${I}}{${S(ro, 4)}} = ${S(Bo, 4)}\\ \\mu$T.` };
    },
    verify: (p) => { const MU = 4e-7 * Math.PI; if (p.v === 0) return p.Cc * 1e-6 * p.dv * 1e3; if (p.v === 1) { const dQ = E0P * p.dE * p.A; return dQ; } if (p.v === 2) { const jd = p.I / (Math.PI * p.R * p.R); const enc = jd * Math.PI * p.rr * p.rr; return MU * enc / (2 * Math.PI * p.rr) * 1e6; } return MU * p.I / (2 * Math.PI * p.ro) * 1e6; } },
  { id: 'ew-g07', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'reading a wave equation',
    make(rng) {
      const v = int(rng, 0, 2); const lam = choose(rng, [400, 500, 600, 800, 1000]); const E0 = choose(rng, [30, 60, 90, 120]);
      const k = 2 * Math.PI / (lam * 1e-9); const w = C * k; const ks = +k.toPrecision(3); const ws = +w.toPrecision(3);
      const eq = `$E = ${E0}\\sin(${tx(ks)}\\,x - ${tx(ws)}\\,t)$ $\\mathrm{V\\,m^{-1}}$`;
      if (v === 0) return { lam, E0, ks, v, q: `The electric field of an EM wave in vacuum is ${eq} ($x$ in m, $t$ in s). Find its wavelength (in nm, nearest integer).`, answer: lam, tol: 0.01 * lam + 1, unit: 'nm', sol: `$k = 2\\pi/\\lambda\\Rightarrow\\lambda = \\dfrac{2\\pi}{${tx(ks)}} = ${S(2 * Math.PI / ks * 1e9, 4)}$ nm $\\approx${lam}$ nm.` };
      if (v === 1) { const f = ws / (2 * Math.PI) / 1e14; return { lam, E0, ws, v, q: `The electric field of an EM wave in vacuum is ${eq} ($x$ in m, $t$ in s). Find its frequency (in units of $10^{14}$ Hz, 2 decimals).`, answer: N(f, 2), tol: 0.01 * f + 0.01, unit: '1e14 Hz', sol: `$f = \\omega/2\\pi = \\dfrac{${tx(ws)}}{2\\pi} = ${S(f, 4)}\\times10^{14}$ Hz.` }; }
      const B = E0 / C * 1e6; return { lam, E0, v, q: `The electric field of an EM wave in vacuum is ${eq} ($x$ in m, $t$ in s). Find the amplitude of its magnetic field (in $\\mu$T, 3 decimals).`, answer: N(B, 3), tol: 0.002, unit: 'µT', sol: `$B_0 = E_0/c = ${E0}/(3\\times10^8) = ${S(B, 4)}\\ \\mu$T.` };
    },
    verify: (p) => { if (p.v === 0) return p.lam; if (p.v === 1) return C * 2 * Math.PI / (2 * Math.PI) / (p.lam * 1e-9) / 1e14 * 1; return p.E0 / C * 1e6; } },
  { id: 'ew-g08', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'photon energy',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const l = choose(rng, [310, 400, 496, 620, 1240]); const val = 1240 / l; const o = numOpts(rng, val, [val * 10, val / 10, l * 1.24], 'eV'); return { l, v, val, ...o, q: `The energy of a photon of wavelength ${l} nm is (use $hc = 1240$ eV nm)`, sol: `$E = \\dfrac{hc}{\\lambda} = \\dfrac{1240}{${l}} = ${S(val, 3)}$ eV.`, trap: 'Energy is inversely proportional to wavelength.' }; }
      if (v === 1) { const E = choose(rng, [1.55, 2, 2.48, 3.1, 4]); const val = 1240 / E; const o = numOpts(rng, val, [1240 * E, 124 / E, 12400 / E], 'nm'); return { E, v, val, ...o, q: `A photon has an energy of ${E} eV. Its wavelength is (use $hc = 1240$ eV nm)`, sol: `$\\lambda = \\dfrac{hc}{E} = \\dfrac{1240}{${E}} = ${S(val, 3)}$ nm.` }; }
      const E = choose(rng, [1.5, 2, 3, 4, 5]); const val = E * 1.6e-19 / 6.63e-34 / 1e14; const o = numOpts(rng, val, [val * 10, val / 10, E * 1.6], '×10<sup>14</sup> Hz');
      return { E, v, val, ...o, q: `A photon has an energy of ${E} eV. Its frequency is (use $h = 6.63\\times10^{-34}$ J s, $1\\ \\mathrm{eV} = 1.6\\times10^{-19}$ J; answer in units of $10^{14}$ Hz)`, sol: `$f = \\dfrac Eh = \\dfrac{${E}\\times1.6\\times10^{-19}}{6.63\\times10^{-34}} = ${S(val, 3)}\\times10^{14}$ Hz.` };
    },
    verify: (p) => { if (p.v === 0) return vo(p, 1240 / p.l, 'eV'); if (p.v === 1) return vo(p, 1240 / p.E, 'nm'); return vo(p, p.E * 1.6e-19 / 6.63e-34 / 1e14, '×10<sup>14</sup> Hz'); } },
  { id: 'ew-g09', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'regions of the spectrum',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 2) { const idx = []; while (idx.length < 4) { const x = int(rng, 0, 6); if (!idx.includes(x)) idx.push(x); } const hi = int(rng, 0, 1) === 0; const best = hi ? Math.max(...idx) : Math.min(...idx);
        const o = shuffleOpts(rng, REG[best], idx.filter((x) => x !== best).map((x) => REG[x]));
        return { idx, hi, ...o, q: `Which of these has the ${hi ? 'highest frequency' : 'longest wavelength'}?<br>${idx.map((x) => REG[x]).join(', ')}`, sol: `In order of increasing frequency: ${REG.join(', ')}. Of the four named, ${REG[best]} ${hi ? 'sits last (highest frequency)' : 'sits first (longest wavelength)'}.` }; }
      const T = [[1, 10, 100, 1000], [2e-3, 1e-2, 3e-2], [1e-5, 5e-5, 2e-6], [4.5e-7, 5.5e-7, 6.5e-7], [5e-8, 1e-7, 3e-7], [1e-10, 5e-10, 1e-11], [1e-13, 1e-14, 3e-14]];
      const cls = int(rng, 0, 6); const lam = choose(rng, T[cls]);
      const wrongs = [REG[(cls + 1) % 7], REG[(cls + 6) % 7], REG[(cls + 2) % 7]]; const o = shuffleOpts(rng, REG[cls], wrongs);
      if (v === 0) return { lam, cls, ...o, q: `Electromagnetic radiation of wavelength ${fmt(lam, 2)} m lies in the region of`, sol: `Ranges (approx.): radio $>0.1$ m; microwaves 1 mm to 0.1 m; infrared 700 nm to 1 mm; visible 400 to 700 nm; ultraviolet 1 to 400 nm; X-rays 1 pm to 1 nm; gamma rays below about 1 pm. ${fmt(lam, 2)} m is in the ${REG[cls]} region.` };
      const f = C / lam; return { lam, cls, ...o, q: `Electromagnetic radiation of frequency ${fmt(+f.toPrecision(2), 2)} Hz lies in the region of ($c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$)`, sol: `$\\lambda = c/f = ${fmt(+(C / +f.toPrecision(2)).toPrecision(2), 2)}$ m. That is in the ${REG[cls]} region.` };
    },
    verify: (p) => { if (p.idx) { const b = p.hi ? Math.max(...p.idx) : Math.min(...p.idx); return p.options.indexOf(REG[b]); } return p.options.indexOf(REG[regOf(p.lam)]); } },
  { id: 'ew-g10', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'forces from light',
    make(rng) {
      const v = int(rng, 0, 2); const I = choose(rng, [1000, 1400, 2000]);
      if (v === 0) { const A = choose(rng, [1e3, 1e4, 4e4]); const F = 2 * I * A / C; return { I, A, v, q: `A perfectly reflecting solar sail of area $${tx(A, 2)}\\ \\mathrm{m^2}$ faces light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ normally. Find the force on it (in N, 4 decimals).`, answer: N(F, 4), tol: 0.01 * F + 0.0002, unit: 'N', sol: `$F = \\dfrac{2IA}{c} = \\dfrac{2\\times${I}\\times${tx(A, 2)}}{3\\times10^8} = ${S(F, 4)}$ N.`, trap: 'Reflecting: factor 2.' }; }
      if (v === 1) { const r = choose(rng, [1, 2, 5]); const F = I * Math.PI * (r * 1e-3) ** 2 / C * 1e12; return { I, r, v, q: `A perfectly absorbing sphere of radius ${r} mm is in a beam of intensity ${I} $\\mathrm{W\\,m^{-2}}$. Find the force on it (in pN, 1 decimal).`, answer: N(F, 1), tol: 0.01 * F + 0.05, unit: 'pN', sol: `The sphere intercepts the beam over its cross-section $\\pi r^2$: $F = \\dfrac{I\\pi r^2}{c} = \\dfrac{${I}\\times\\pi\\times(${r}\\times10^{-3})^2}{3\\times10^8} = ${S(F, 4)}\\times10^{-12}$ N $= ${S(F, 4)}$ pN.`, trap: 'Use the cross-section (pi r squared), not the surface area of the sphere.' }; }
      const A = choose(rng, [1e3, 1e4]); const m = choose(rng, [10, 20, 50]); const a = 2 * I * A / C / m * 1e6;
      return { I, A, m, v, q: `A perfectly reflecting sail of area $${tx(A, 2)}\\ \\mathrm{m^2}$ and total mass ${m} kg faces light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ normally in free space. Find its acceleration (in units of $10^{-6}\\ \\mathrm{m\\,s^{-2}}$, 1 decimal).`, answer: N(a, 1), tol: 0.01 * a + 0.05, unit: '1e-6 m/s^2', sol: `$a = \\dfrac{F}{m} = \\dfrac{2IA}{mc} = \\dfrac{2\\times${I}\\times${tx(A, 2)}}{${m}\\times3\\times10^8} = ${S(a, 4)}\\times10^{-6}\\ \\mathrm{m\\,s^{-2}}$.` };
    },
    verify: (p) => { if (p.v === 0) return 2 * p.I / C * p.A; if (p.v === 1) { const P = p.I / C; return P * Math.PI * (p.r * 1e-3) ** 2 * 1e12; } const P = 2 * p.I / C; return P * p.A / p.m * 1e6; } },
  { id: 'ew-g11', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'photons',
    make(rng) {
      const v = int(rng, 0, 2); const lam = choose(rng, [400, 500, 550, 600, 700]);
      if (v === 0) { const P = choose(rng, [1, 2, 5, 10, 60]); const N0 = P * lam * 1e-9 / HC; return { P, lam, v, q: `A source emits ${P} W of light of wavelength ${lam} nm. How many photons does it emit per second (in units of $10^{18}$, 2 decimals)? $hc = 1.986\\times10^{-25}$ J m.`, answer: N(N0 / 1e18, 2), tol: 0.01 * N0 / 1e18 + 0.01, unit: '1e18 /s', sol: `Photon energy $= hc/\\lambda = \\dfrac{1.986\\times10^{-25}}{${lam}\\times10^{-9}} = ${tx(HC / (lam * 1e-9))}$ J. $N = \\dfrac{${P}}{${tx(HC / (lam * 1e-9))}} = ${S(N0 / 1e18, 4)}\\times10^{18}$ per second.` }; }
      if (v === 1) { const I = choose(rng, [100, 500, 1000]); const phi = I * lam * 1e-9 / HC; return { I, lam, v, q: `Monochromatic light of wavelength ${lam} nm and intensity ${I} $\\mathrm{W\\,m^{-2}}$ falls on a surface. Find the number of photons striking each square metre each second (in units of $10^{20}$, 2 decimals). $hc = 1.986\\times10^{-25}$ J m.`, answer: N(phi / 1e20, 2), tol: 0.01 * phi / 1e20 + 0.005, unit: '1e20 /m^2/s', sol: `$\\phi = \\dfrac{I}{hc/\\lambda} = \\dfrac{${I}\\times${lam}\\times10^{-9}}{1.986\\times10^{-25}} = ${S(phi / 1e20, 4)}\\times10^{20}\\ \\mathrm{m^{-2}s^{-1}}$.` }; }
      const P = choose(rng, [1, 3, 5, 10]) * 1e-3; const F = P / C * 1e12;
      return { P, lam, v, q: `A laser of power ${P * 1e3} mW and wavelength ${lam} nm is aimed at a perfectly absorbing target. Find the force on the target (in pN, 1 decimal).`, answer: N(F, 1), tol: 0.01 * F + 0.05, unit: 'pN', sol: `Force $= P/c = \\dfrac{${S(P)}}{3\\times10^8} = ${S(F, 4)}\\times10^{-12}$ N $= ${S(F, 3)}$ pN. The wavelength does not matter.`, trap: 'Wavelength is a distractor for the force.' };
    },
    verify: (p) => { if (p.v === 0) { return p.P / (HC / (p.lam * 1e-9)) / 1e18; } if (p.v === 1) return p.I / (HC / (p.lam * 1e-9)) / 1e20; return (p.P / C) / 1e-12; } },
  { id: 'ew-g12', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'displacement current in an RC circuit',
    make(rng) {
      const V = choose(rng, [6, 9, 12, 24]); const R = choose(rng, [50, 100, 200]) * 1e3; const Cc = choose(rng, [5, 10, 20]) * 1e-6; const tau = R * Cc; const v = int(rng, 0, 2);
      if (v === 0) { const t = choose(rng, [0.5, 1, 2]) * tau; const I = V / R * Math.exp(-t / tau) * 1e6; return { V, R, Cc, t, v, q: `A ${S(Cc * 1e6)} $\\mu$F capacitor is charged from a ${V} V battery through ${R / 1e3} k$\\Omega$. Find the displacement current between its plates ${S(t, 3)} s after the switch is closed (in $\\mu$A, 2 decimals).`, answer: N(I, 2), tol: 0.01 * I + 0.01, unit: 'µA', sol: `$I_d = I = \\dfrac VRe^{-t/RC}$, with $RC = ${S(tau, 3)}$ s and $t/RC = ${S(t / tau, 3)}$. $I_d = ${S(V / R * 1e6, 4)}\\times e^{-${S(t / tau, 3)}} = ${S(I, 4)}\\ \\mu$A.` }; }
      if (v === 1) { const f = choose(rng, [0.5, 0.25, 0.1]); const t = -tau * Math.log(f); return { V, R, Cc, f, v, q: `A ${S(Cc * 1e6)} $\\mu$F capacitor charges from a ${V} V battery through ${R / 1e3} k$\\Omega$. After how long (in s, 2 decimals) does the displacement current fall to ${f} of its initial value?`, answer: N(t, 2), tol: 0.01 * t + 0.01, unit: 's', sol: `$I_d/I_0 = e^{-t/RC} = ${f}\\Rightarrow t = RC\\ln(1/${f}) = ${S(tau, 3)}\\times${S(Math.log(1 / f), 4)} = ${S(t, 4)}$ s.` }; }
      const I0 = V / R * 1e6; return { V, R, Cc, v, q: `A ${S(Cc * 1e6)} $\\mu$F capacitor is charged from a ${V} V battery through ${R / 1e3} k$\\Omega$. Find the displacement current between the plates at the instant the switch is closed (in $\\mu$A, 1 decimal).`, answer: N(I0, 1), tol: 0.01 * I0 + 0.05, unit: 'µA', sol: `At $t = 0$ the capacitor has no charge, so $I = V/R = ${V}/${R / 1e3}\\ \\mathrm{k\\Omega} = ${S(I0, 3)}\\ \\mu$A. The displacement current has the same value.` };
    },
    verify: (p) => { if (p.v === 0) { const tau = p.R * p.Cc; let q = 0; const n = 20000; const dt = p.t / n; for (let i = 0; i < n; i++) { const i0 = (p.V - q / p.Cc) / p.R; q += i0 * dt; } return (p.V - q / p.Cc) / p.R * 1e6; } if (p.v === 1) { const tau = p.R * p.Cc; return Math.log(1 / p.f) * tau; } return p.V / p.R * 1e6; } },
  { id: 'ew-g13', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'EM waves in a medium',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const er = choose(rng, [2, 4, 6, 9]); const mr = choose(rng, [1.5, 2, 4]); const val = 3 / Math.sqrt(er * mr); const o = numOpts(rng, val, [3 * Math.sqrt(er * mr), 3 / (er * mr), 3 / Math.sqrt(er)], '×10<sup>8</sup> m/s'); return { er, mr, v, val, ...o, q: `The relative permittivity and relative permeability of a medium are ${er} and ${mr}. The speed of EM waves in it is (in units of $10^8\\ \\mathrm{m\\,s^{-1}}$)`, sol: `$v = \\dfrac{c}{\\sqrt{\\mu_r\\epsilon_r}} = \\dfrac{3\\times10^8}{\\sqrt{${er}\\times${mr}}} = ${S(val, 3)}\\times10^8\\ \\mathrm{m\\,s^{-1}}$.` }; }
      if (v === 1) { const er = choose(rng, [2.25, 4, 6.25, 9]); const mr = choose(rng, [1.44, 2.25, 4]); const val = Math.sqrt(er * mr); const o = numOpts(rng, val, [er * mr, Math.sqrt(er), 1 / val], ''); return { er, mr, v, val, ...o, q: `A medium has relative permittivity ${er} and relative permeability ${mr}. Its refractive index is`, sol: `$n = \\sqrt{\\mu_r\\epsilon_r} = \\sqrt{${er}\\times${mr}} = ${S(val, 3)}$.` }; }
      const er = choose(rng, [2.25, 4, 6.25]); const f = choose(rng, [4, 5, 6]) * 1e14; const val = C / (f * Math.sqrt(er)) * 1e9; const o = numOpts(rng, val, [C / f * 1e9, C * Math.sqrt(er) / f * 1e9, C / (f * er) * 1e9], 'nm');
      return { er, f, v, val, ...o, q: `Light of frequency ${S(f / 1e14)}$\\times10^{14}$ Hz travels in a non-magnetic medium of relative permittivity ${er}. Its wavelength in the medium is (use $c = 3\\times10^8$)`, sol: `$n = \\sqrt{${er}} = ${S(Math.sqrt(er), 3)}$. $\\lambda = \\dfrac{c}{nf} = \\dfrac{3\\times10^8}{${S(Math.sqrt(er), 3)}\\times${S(f / 1e14)}\\times10^{14}} = ${S(val, 3)}$ nm.` };
    },
    verify: (p) => { if (p.v === 0) return vo(p, C / Math.sqrt(p.er * p.mr) / 1e8, '×10<sup>8</sup> m/s'); if (p.v === 1) return vo(p, Math.sqrt(p.er) * Math.sqrt(p.mr), ''); const vm = C / Math.sqrt(p.er); return vo(p, vm / p.f * 1e9, 'nm'); } },
  { id: 'ew-g14', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'microwaves and standing waves',
    make(rng) {
      const f = choose(rng, [2.45, 5.8, 9.4, 10, 24]); const l = C / (f * 1e9); const v = int(rng, 0, 2);
      if (v === 0) return { f, v, q: `A microwave source works at ${f} GHz. Find the wavelength (in cm, 2 decimals). $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$.`, answer: N(l * 100, 2), tol: 0.01 * l * 100 + 0.01, unit: 'cm', sol: `$\\lambda = \\dfrac cf = \\dfrac{3\\times10^8}{${f}\\times10^9} = ${S(l * 100, 4)}$ cm.` };
      if (v === 1) return { f, v, q: `A microwave source of frequency ${f} GHz sets up a standing wave in a cavity. Find the distance between neighbouring antinodes (in cm, 2 decimals). $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$.`, answer: N(l * 50, 2), tol: 0.01 * l * 50 + 0.01, unit: 'cm', sol: `$\\lambda = c/f = ${S(l * 100, 4)}$ cm. Neighbouring antinodes are $\\lambda/2 = ${S(l * 50, 4)}$ cm apart.`, trap: 'Antinodes are lambda/2 apart, not lambda.' };
      return { f, v, q: `In a cavity, neighbouring antinodes of a microwave standing wave are ${S(l * 50, 4)} cm apart. Find the frequency (in GHz, 2 decimals). $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$.`, answer: N(f, 2), tol: 0.01 * f + 0.01, unit: 'GHz', sol: `$\\lambda = 2\\times${S(l * 50, 4)} = ${S(l * 100, 4)}$ cm. $f = c/\\lambda = \\dfrac{3\\times10^8}{${S(l, 4)}} = ${S(f, 3)}$ GHz.` };
    },
    verify: (p) => { if (p.v === 0) return (C / (p.f * 1e9)) * 100; if (p.v === 1) return C / (p.f * 1e9) * 100 / 2; const d = C / (p.f * 1e9) / 2; return C / (2 * d) / 1e9; } },
  { id: 'ew-g15', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'travel time of EM waves',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const t = choose(rng, [40, 100, 200, 500]); const d = C * t * 1e-6 / 2 / 1e3; return { t, v, q: `A radar pulse returns ${t} $\\mu$s after it was sent. Find the distance of the target (in km, 1 decimal).`, answer: N(d, 1), tol: 0.05, unit: 'km', sol: `$d = \\dfrac{ct}{2} = \\dfrac{3\\times10^8\\times${t}\\times10^{-6}}{2} = ${S(d * 1e3, 4)}$ m $= ${S(d, 4)}$ km.`, trap: 'The pulse goes there and back, so halve ct.' }; }
      if (v === 1) { const h = choose(rng, [400, 800, 36000]); const t = h * 1e3 / C * 1e3; return { h, v, q: `A signal from a ground station travels vertically to a satellite ${h} km above it. Find the one-way travel time (in ms, 2 decimals).`, answer: N(t, 2), tol: 0.01 * t + 0.005, unit: 'ms', sol: `$t = \\dfrac dc = \\dfrac{${h}\\times10^3}{3\\times10^8} = ${S(t, 4)}$ ms.` }; }
      const d = choose(rng, [1.5e11, 2.3e11, 7.8e11, 1.4e12]); const t = d / C / 60;
      return { d, v, q: `Radio waves travel a distance of $${tx(d, 2)}$ m in space. How long does the journey take (in minutes, 1 decimal)?`, answer: N(t, 1), tol: 0.06, unit: 'min', sol: `$t = \\dfrac dc = \\dfrac{${tx(d, 2)}}{3\\times10^8} = ${S(d / C, 4)}$ s $= ${S(t, 3)}$ min.` };
    },
    verify: (p) => { if (p.v === 0) { const x = (t) => C * t; return x(p.t * 1e-6) / 2 / 1e3; } if (p.v === 1) return p.h * 1e3 / C * 1e3; return p.d / C / 60; } },
  { id: 'ew-g16', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'energy flow',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const E0 = choose(rng, [50, 100, 200, 400]); const B0 = E0 / C; const S0 = E0 * B0 / (4e-7 * Math.PI); return { E0, v, q: `The electric amplitude of a plane EM wave in vacuum is ${E0} $\\mathrm{V\\,m^{-1}}$. Find the peak value of the Poynting vector $E_0B_0/\\mu_0$ (in $\\mathrm{W\\,m^{-2}}$, 2 decimals).`, answer: N(S0, 2), tol: 0.01 * S0 + 0.01, unit: 'W/m^2', sol: `$B_0 = E_0/c = ${S(B0 * 1e6, 4)}\\ \\mu$T. $S_{max} = \\dfrac{E_0B_0}{\\mu_0} = \\dfrac{${E0}\\times${tx(B0, 4)}}{4\\pi\\times10^{-7}} = ${S(S0, 4)}\\ \\mathrm{W\\,m^{-2}}$. (The average is half of this.)` }; }
      if (v === 1) { const I = choose(rng, [100, 500, 1000]); const A = choose(rng, [0.5, 1, 2]); const t = choose(rng, [10, 60, 600]); const U = I * A * t; return { I, A, t, v, q: `Light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ falls on a surface of area ${A} $\\mathrm{m^2}$ perpendicular to the beam for ${t} s. Find the energy delivered (in J).`, answer: U, tol: 0.5, unit: 'J', sol: `$U = IAt = ${I}\\times${A}\\times${t} = ${U}$ J.` }; }
      const P = choose(rng, [10, 50, 100]); const r = choose(rng, [100, 500, 2000]); const A = choose(rng, [0.01, 0.1, 1]); const Pr = P * A / (4 * Math.PI * r * r) * 1e9;
      return { P, r, A, v, q: `A ${P} W transmitter radiates uniformly in all directions. A receiving antenna of effective area ${A} $\\mathrm{m^2}$ faces it at ${r} m. Find the power received (in nW, 3 decimals).`, answer: N(Pr, 3), tol: 0.01 * Pr + 0.001, unit: 'nW', sol: `$I = \\dfrac{P}{4\\pi r^2} = \\dfrac{${P}}{4\\pi\\times${tx(r * r, 2)}} = ${tx(P / (4 * Math.PI * r * r))}\\ \\mathrm{W\\,m^{-2}}$. Received $= IA = ${S(Pr, 4)}$ nW.` };
    },
    verify: (p) => { if (p.v === 0) { const B0 = p.E0 / (1 / Math.sqrt(4e-7 * Math.PI * 8.85e-12)); return p.E0 * B0 / (4e-7 * Math.PI); } if (p.v === 1) return p.I * p.A * p.t; return p.P / (4 * Math.PI * p.r * p.r) * p.A * 1e9; } },
  { id: 'ew-g17', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'oblique incidence',
    make(rng) {
      const I = choose(rng, [600, 900, 1200, 1400]); const th = choose(rng, [0, 30, 45, 60]); const v = int(rng, 0, 2); const A = choose(rng, [0.5, 1, 2]);
      const c2 = Math.cos(th * Math.PI / 180) ** 2;
      if (v === 0) { const P = 2 * I * c2 / C * 1e6; return { I, th, v, q: `Light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ is incident at $${th}^\\circ$ to the normal of a perfectly reflecting mirror. Find the radiation pressure on the mirror (in units of $10^{-6}$ Pa, 2 decimals).`, answer: N(P, 2), tol: 0.01 * P + 0.01, unit: '1e-6 Pa', sol: `$P = \\dfrac{2I\\cos^2\\theta}{c} = \\dfrac{2\\times${I}\\times${S(c2, 4)}}{3\\times10^8} = ${S(P, 4)}\\times10^{-6}$ Pa.`, trap: 'One cosine for the beam spreading over more area, one for the normal component of momentum.' }; }
      if (v === 1) { const P = I * c2 / C * 1e6; return { I, th, v, q: `Light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ falls on a perfectly absorbing plate with its direction at $${th}^\\circ$ to the normal. Find the pressure normal to the plate (in units of $10^{-6}$ Pa, 2 decimals).`, answer: N(P, 2), tol: 0.01 * P + 0.01, unit: '1e-6 Pa', sol: `Momentum flux per unit plate area is $(I/c)\\cos\\theta$; its normal part gives another $\\cos\\theta$: $P = \\dfrac{I\\cos^2\\theta}{c} = ${S(P, 4)}\\times10^{-6}$ Pa.` }; }
      const F = 2 * I * c2 * A / C * 1e6; return { I, th, A, v, q: `Light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ falls at $${th}^\\circ$ to the normal on a perfectly reflecting mirror of area ${A} $\\mathrm{m^2}$. Find the force on the mirror (in units of $10^{-6}$ N, 2 decimals).`, answer: N(F, 2), tol: 0.01 * F + 0.01, unit: '1e-6 N', sol: `$F = PA = \\dfrac{2I\\cos^2\\theta}{c}A = \\dfrac{2\\times${I}\\times${S(c2, 4)}\\times${A}}{3\\times10^8} = ${S(F, 4)}\\times10^{-6}$ N, normal to the mirror.` };
    },
    verify: (p) => { const t = p.th * Math.PI / 180; const flux = p.I * Math.cos(t); if (p.v === 0) return 2 * flux * Math.cos(t) / C * 1e6; if (p.v === 1) return flux * Math.cos(t) / C * 1e6; return 2 * flux * Math.cos(t) / C * p.A * 1e6; } },
  { id: 'ew-g18', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'LC oscillator and radio waves',
    make(rng) {
      const L = choose(rng, [1, 2, 5, 10, 50]) * 1e-6; const Cc = choose(rng, [50, 100, 200, 500]) * 1e-12; const v = int(rng, 0, 2);
      const f = 1 / (2 * Math.PI * Math.sqrt(L * Cc)); const lam = C / f;
      if (v === 0) return { L, Cc, v, q: `A tuned circuit has $L = ${S(L * 1e6)}\\ \\mu$H and $C = ${S(Cc * 1e12)}$ pF. Find the frequency of the radio waves it radiates (in MHz, 2 decimals).`, answer: N(f / 1e6, 2), tol: 0.01 * f / 1e6 + 0.01, unit: 'MHz', sol: `$f = \\dfrac{1}{2\\pi\\sqrt{LC}} = \\dfrac{1}{2\\pi\\sqrt{${tx(L, 2)}\\times${tx(Cc, 2)}}} = ${S(f / 1e6, 4)}$ MHz.` };
      if (v === 1) return { L, Cc, v, q: `A tuned circuit has $L = ${S(L * 1e6)}\\ \\mu$H and $C = ${S(Cc * 1e12)}$ pF. Find the wavelength of the radio waves it radiates (in m, 1 decimal). $c = 3\\times10^8$.`, answer: N(lam, 1), tol: 0.01 * lam + 0.05, unit: 'm', sol: `$f = ${S(f / 1e6, 4)}$ MHz, so $\\lambda = \\dfrac cf = \\dfrac{3\\times10^8}{${S(f / 1e6, 4)}\\times10^6} = ${S(lam, 4)}$ m.` };
      const ls = +lam.toPrecision(3); const Cx = ls * ls / (4 * Math.PI * Math.PI * C * C * L) * 1e12;
      return { L, Cc, ls, v, q: `A coil of $L = ${S(L * 1e6)}\\ \\mu$H is to be used in a circuit that radiates waves of wavelength ${ls} m. Find the capacitance needed (in pF, nearest integer). $c = 3\\times10^8$.`, answer: Math.round(Cc * 1e12), tol: 0.01 * Cc * 1e12 + 1, unit: 'pF', sol: `$\\lambda = 2\\pi c\\sqrt{LC}\\Rightarrow C = \\dfrac{\\lambda^2}{4\\pi^2c^2L} = \\dfrac{${S(ls * ls, 4)}}{4\\pi^2\\times9\\times10^{16}\\times${tx(L, 2)}} = ${S(Cx, 4)}$ pF.` };
    },
    verify: (p) => { if (p.v === 0) return 1 / (2 * Math.PI * Math.sqrt(p.L * p.Cc)) / 1e6; if (p.v === 1) { const w = 1 / Math.sqrt(p.L * p.Cc); return C / (w / (2 * Math.PI)); } return p.Cc * 1e12; } },
  // ---- added 2026-11-22 ----
  { id: 'ew-g19', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'point source',
    make(rng) {
      const P = choose(rng, [50, 100, 200, 500, 1000]), r = choose(rng, [2, 3, 4, 5, 10]);
      const I = P / (4 * Math.PI * r * r), E0 = Math.sqrt(2 * I / (E0P * C));
      return { P, r, answer: N(E0, 2), tol: 0.01 * E0 + 0.01, unit: 'V/m',
        q: `A point source radiates ${P} W uniformly as EM waves. Find the electric field amplitude at ${r} m from it (in $\\mathrm{V\\,m^{-1}}$, 2 decimals). Use $\\epsilon_0 = 8.85\\times10^{-12}$ and $c = 3\\times10^{8}$.`,
        sol: `$I = P/4\\pi r^2 = ${P}/(4\\pi\\times${r * r}) = ${S(I, 4)}\\ \\mathrm{W\\,m^{-2}}$. From $I = \\tfrac12\\epsilon_0cE_0^2$: $E_0 = \\sqrt{2I/\\epsilon_0c} = ${S(E0, 4)}\\ \\mathrm{V\\,m^{-1}}$.`,
        trap: 'The 1/2 in $I = \\tfrac12\\epsilon_0cE_0^2$ comes from averaging $\\sin^2$.' };
    },
    verify: (p) => Math.sqrt(2 * 4e-7 * Math.PI * C * p.P / (4 * Math.PI * p.r * p.r)) },
  { id: 'ew-g20', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'laser beam',
    make(rng) {
      const P = choose(rng, [2, 3, 5, 10]) * 1e-3, rad = choose(rng, [0.5, 1, 1.5, 2]) * 1e-3;
      const I = P / (Math.PI * rad * rad), B0 = Math.sqrt(2 * I / (E0P * C)) / C * 1e6;
      return { P, rad, answer: N(B0, 3), tol: 0.01 * B0 + 0.002, unit: 'μT',
        q: `A laser emits ${S(P * 1e3)} mW in a beam of radius ${S(rad * 1e3)} mm (uniform intensity). Find the amplitude of the magnetic field in the beam (in $\\mu$T, 3 decimals). Use $\\epsilon_0 = 8.85\\times10^{-12}$ and $c = 3\\times10^{8}$.`,
        sol: `$I = P/\\pi r^2 = ${S(I, 4)}\\ \\mathrm{W\\,m^{-2}}$. $E_0 = \\sqrt{2I/\\epsilon_0c} = ${S(Math.sqrt(2 * I / (E0P * C)), 4)}\\ \\mathrm{V\\,m^{-1}}$. $B_0 = E_0/c = ${S(B0, 4)}\\ \\mu$T.`,
        trap: 'Convert mW and mm to W and m before squaring.' };
    },
    verify: (p) => Math.sqrt(2 * (4e-7 * Math.PI) * p.P / (Math.PI * p.rad * p.rad) / C) * 1e6 },
  { id: 'ew-g21', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'photons',
    make(rng) {
      const P = choose(rng, [0.5, 1, 2, 5]), lam = choose(rng, [400, 500, 550, 600, 650]);
      const n = P * lam * 1e-9 / HC / 1e18;
      return { P, lam, answer: N(n, 3), tol: 0.01 * n + 0.002,
        q: `A ${P} W source emits light of a single wavelength ${lam} nm. Find the number of photons emitted per second in units of $10^{18}$ (3 decimals). Use $hc = 1.986\\times10^{-25}$ J m.`,
        sol: `Photon energy $= hc/\\lambda = 1.986\\times10^{-25}/(${lam}\\times10^{-9}) = ${S(HC / (lam * 1e-9), 4)}$ J. Number per second $= P/E = ${S(n, 4)}\\times10^{18}$.` };
    },
    verify: (p) => p.P / (6.626e-34 * C / (p.lam * 1e-9)) / 1e18 },
  { id: 'ew-g22', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'radiation force',
    make(rng) {
      const P = choose(rng, [100, 500, 1000, 2000, 5000]), R = choose(rng, [0, 0.4, 0.5, 0.8, 1]);
      const F = (1 + R) * P / C * 1e6;
      return { P, R, answer: N(F, 3), tol: 0.01 * F + 0.002, unit: 'μN',
        q: `A beam of power ${P} W falls normally on a flat surface that reflects ${S(R * 100)}% of the light and absorbs the rest. Find the force on the surface in $\\mu$N (3 decimals). $c = 3\\times10^{8}$.`,
        sol: `Absorbed light gives momentum $p$ per photon, reflected light gives $2p$. The force is $F = (1-R)P/c + R\\cdot2P/c = (1+R)P/c = ${S(1 + R, 3)}\\times${P}/3\\times10^{8} = ${S(F, 4)}\\ \\mu$N.`,
        trap: 'Reflection doubles the momentum transfer only for the reflected part.' };
    },
    verify: (p) => ((1 - p.R) * p.P / C + p.R * 2 * p.P / C) * 1e6 },
  { id: 'ew-g23', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'LC oscillator and radio waves',
    make(rng) {
      const L = choose(rng, [1, 2, 4, 5, 10]) * 1e-6, Cc = choose(rng, [25, 50, 100, 200]) * 1e-12;
      const lam = C * 2 * Math.PI * Math.sqrt(L * Cc);
      return { L, Cc, answer: N(lam, 2), tol: 0.01 * lam + 0.02, unit: 'm',
        q: `The tank circuit of a transmitter has $L = ${S(L * 1e6)}\\ \\mu$H and $C = ${S(Cc * 1e12)}$ pF. Find the wavelength of the EM wave it radiates (in m, 2 decimals). $c = 3\\times10^{8}\\ \\mathrm{m\\,s^{-1}}$.`,
        sol: `$f = \\dfrac{1}{2\\pi\\sqrt{LC}} = ${S(1 / (2 * Math.PI * Math.sqrt(L * Cc)) / 1e6, 4)}$ MHz. $\\lambda = c/f = ${S(lam, 4)}$ m.` };
    },
    verify: (p) => C / (1 / (2 * Math.PI * Math.sqrt(p.L * p.Cc))) },
  { id: 'ew-g24', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'direction of propagation',
    make(rng) {
      const ax = [['x', [1, 0, 0]], ['y', [0, 1, 0]], ['z', [0, 0, 1]]];
      const i = int(rng, 0, 2); let j = int(rng, 0, 2); if (j === i) j = (j + 1) % 3;
      const si = rng() < 0.5 ? 1 : -1, sj = rng() < 0.5 ? 1 : -1;
      const a = ax[i][1].map((v) => v * si), b = ax[j][1].map((v) => v * sj);
      const cr = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const nm = (v) => { const k = v.findIndex((t) => t !== 0); return `${v[k] > 0 ? '+' : '-'}${'xyz'[k]}`; };
      const ans = nm(cr), neg = nm(cr.map((t) => -t)); const third = [0, 1, 2].filter((t) => t !== i && t !== j)[0];
      const others = ['+x', '-x', '+y', '-y', '+z', '-z'].filter((t) => t !== ans && t !== neg);
      const { options, answer } = shuffleOpts(rng, ans, [neg, others[0], others[2]].map((t) => t));
      return { a, b, cr, nm, options, answer, q: `At an instant the electric field of an EM wave points along $${nm(a)}$ and its magnetic field along $${nm(b)}$. The wave is travelling along`,
        sol: `The direction of travel is the direction of $\\vec E\\times\\vec B$. Here $\\vec E\\times\\vec B$ points along $${ans}$.`, trap: 'Use the right-hand rule for $\\vec E\\times\\vec B$; the opposite direction is the commonest wrong choice.' };
    },
    verify: (p) => { const c2 = [p.a[1] * p.b[2] - p.a[2] * p.b[1], p.a[2] * p.b[0] - p.a[0] * p.b[2], p.a[0] * p.b[1] - p.a[1] * p.b[0]]; return p.options.indexOf(p.nm(c2)); } },
  { id: 'ew-g25', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'displacement current',
    make(rng) {
      const R = choose(rng, [2, 3, 4, 5, 6]) / 100, dE = choose(rng, [1, 2, 3, 5]) * 1e12;
      const Id = E0P * Math.PI * R * R * dE * 1e3;
      return { R, dE, answer: N(Id, 3), tol: 0.01 * Id + 0.002, unit: 'mA',
        q: `The circular plates of a capacitor have radius ${S(R * 100)} cm and the electric field between them changes at $${S(dE / 1e12)}\\times10^{12}\\ \\mathrm{V\\,m^{-1}s^{-1}}$. Find the displacement current in mA (3 decimals). $\\epsilon_0 = 8.85\\times10^{-12}$.`,
        sol: `$I_d = \\epsilon_0A\\,dE/dt = 8.85\\times10^{-12}\\times\\pi(${S(R)})^2\\times${S(dE / 1e12)}\\times10^{12} = ${S(Id / 1e3, 4)}$ A $= ${S(Id, 4)}$ mA.` };
    },
    verify: (p) => { const Cc = E0P * Math.PI * p.R * p.R / 1e-3; return Cc * (1e-3 * p.dE) * 1e3; } },
  { id: 'ew-g26', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'magnetic field of displacement current',
    make(rng) {
      const R = choose(rng, [4, 5, 6, 8]) / 100, I = choose(rng, [0.5, 1, 1.5, 2, 3]), f = choose(rng, [0.25, 0.5, 0.75]);
      const r = f * R, B = 2e-7 * I * r / R ** 2 * 1e6;
      return { R, I, r, answer: N(B, 3), tol: 0.01 * B + 0.002, unit: 'μT',
        q: `A circular parallel-plate capacitor of plate radius ${S(R * 100)} cm is charged by a current of ${I} A. Find the magnetic field between the plates at ${S(r * 100)} cm from the axis, in $\\mu$T (3 decimals).`,
        sol: `The displacement current through a circle of radius $r$ is $I\\,r^2/R^2 = ${S(I * f * f, 4)}$ A. Then $B = \\dfrac{\\mu_0I_{enc}}{2\\pi r} = \\dfrac{2\\times10^{-7}\\times${S(I * f * f, 4)}}{${S(r)}} = ${S(B, 4)}\\ \\mu$T.`,
        trap: 'Only the fraction $r^2/R^2$ of the displacement current is enclosed.' };
    },
    verify: (p) => 4e-7 * Math.PI * (p.I * p.r * p.r / (p.R * p.R)) / (2 * Math.PI * p.r) * 1e6 },
  { id: 'ew-g27', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'radiation pressure',
    make(rng) {
      const R1 = choose(rng, [0, 0.5, 1]), R2 = choose(rng, [0.2, 0.6, 0.8]);
      const val = (1 + R1) / (1 + R2);
      const { options, answer } = shuffleOpts(rng, fmt(val, 3), [fmt(1 / val, 3), fmt((1 - R1) / (1 - R2), 3), fmt(R1 / R2 + 1, 3), fmt((1 + R1) * (1 + R2), 3)]);
      return { R1, R2, options, answer, val,
        q: `Two identical light beams fall normally on two surfaces. Surface 1 reflects ${S(R1 * 100)}% of the light (and absorbs the rest) and surface 2 reflects ${S(R2 * 100)}%. The ratio (force on 1)/(force on 2) is`,
        sol: `Force $=(1+R)\\,I A/c$. So the ratio is $\\dfrac{1+${R1}}{1+${R2}} = ${fmt(val, 3)}$.`, trap: 'A perfect absorber has $R = 0$, giving a factor 1, and a perfect mirror has $R = 1$, giving 2.' };
    },
    verify: (p) => p.options.indexOf(fmt((1 + p.R1) / (1 + p.R2), 3)) },
];

// ---------- Level 5 round (v5): top-rank additions ----------
const v5 = (id, type, format, sub, o) => ({ id, type, level: 5, format, exams: ['jee-adv'], sub, ...o });
Object.assign(groups, {
  v5m1: { title: 'Force of light on a flat surface',
    list1: ['A. Perfect absorber, light falls normally', 'B. Perfect mirror, light falls normally', 'C. Perfect absorber, angle of incidence $60^\\circ$', 'D. Perfect mirror, angle of incidence $30^\\circ$'],
    list2: [r`p. $\dfrac{3IA}{2c}$`, r`q. $\dfrac{IA}{c}$`, r`r. $\dfrac{IA}{2c}$`, r`s. $\dfrac{2IA}{c}$`] },
  v5m2: { title: 'Direction of energy flow',
    list1: ['A. At the rim of a circular-plate capacitor that is being charged', 'B. At the rim of the same capacitor while it discharges', r`C. A wave with $\vec E = E_0\hat y\sin(kx-\omega t)$`, r`D. A wave with $\vec E = E_0\hat z\sin(kx+\omega t)$`],
    list2: ['p. radially outward from the axis', 'q. along $-x$', 'r. radially inward towards the axis', 's. along $+x$'] },
  v5p1: { title: 'Sea water between plates',
    passage: r`<p>A slab of sea water fills the gap between two large parallel plates, and the electric field in it is $E = E_0\sin\omega t$. Treat the water as having a constant relative permittivity $\epsilon_r = 80$ and conductivity $\sigma = 4.0\ \mathrm{S\,m^{-1}}$ at all the frequencies in this problem. Take $\epsilon_0 = 8.85\times10^{-12}$ SI. The conduction current density is $J_c = \sigma E$ and the displacement current density is $J_d = \epsilon_r\epsilon_0\,\partial E/\partial t$.</p>` },
});
items.push(
  v5('ew-v501', 'msq', 'multi', 'plane wave', {
    q: r`A plane electromagnetic wave in vacuum has $\vec E = E_0(\hat x + \hat y)\sin(kz - \omega t)$. Which statements are correct?`,
    options: ['It travels along $+z$', r`$\vec B$ points along the direction of $(\hat y - \hat x)$`, r`The amplitude of the electric field vector is $E_0$`, r`Its intensity is $\epsilon_0cE_0^2$`], answer: [0, 1, 3],
    sol: r`The phase $kz - \omega t$ means motion along $+z$ (A true). $\vec B$ is along $\hat k\times\hat E$: $\hat z\times(\hat x + \hat y) = \hat y - \hat x$ (B true). The vector $E_0(\hat x + \hat y)$ has magnitude $\sqrt2E_0$, so the amplitude is $\sqrt2E_0$, not $E_0$ (C false). The intensity is $\tfrac12\epsilon_0c(\sqrt2E_0)^2 = \epsilon_0cE_0^2$ (D true).`,
    trap: 'The amplitude of a vector wave is the length of its vector, not the coefficient of one component.' }),
  v5('ew-v502', 'msq', 'multi', 'Poynting vector', {
    q: r`A long cylindrical resistor of radius $a$ and length $\ell$ carries a steady current $I$, with total resistance $R$. Which statements are correct?`,
    options: ['At its curved surface the Poynting vector points radially inward', r`Its magnitude there is $\dfrac{I^2R}{2\pi a\ell}$`, 'The Poynting vector is zero at the surface because $\\vec E$ lies along the wire', 'The total power flowing in through the curved surface is $I^2R$'], answer: [0, 1, 3],
    sol: r`Inside the wire $\vec E$ is along the current (say $+z$) and, just outside, the same tangential $\vec E$ exists. $\vec B$ circles the wire (direction $\hat\phi$ for current along $+z$). $\vec S = \vec E\times\vec B/\mu_0 \propto \hat z\times\hat\phi = -\hat r$: inward (A true). Magnitude: $E = V/\ell = IR/\ell$ and $B = \mu_0I/(2\pi a)$, so $S = EB/\mu_0 = \dfrac{IR}{\ell}\cdot\dfrac{I}{2\pi a} = \dfrac{I^2R}{2\pi a\ell}$ (B true). $\vec E$ and $\vec B$ are perpendicular, so the cross product is not zero (C false). Multiply by the surface area $2\pi a\ell$: the inflow is $I^2R$, exactly the heating (D true).`,
    trap: 'The energy of a resistor does not travel down the wire; it flows in from the surrounding field.' }),
  v5('ew-v503', 'msq', 'multi', 'displacement current', {
    q: r`A parallel-plate capacitor with circular plates is completely filled with a dielectric of constant $K>1$ and is charged by a conduction current $I$ in the wires. Which statements are correct?`,
    options: [r`The total current density between the plates (displacement plus polarisation) is $I/(\pi R^2)$`, r`The term $\epsilon_0\,d\Phi_E/dt$ taken with the vacuum $\epsilon_0$ equals $I/K$`, r`At $r<R$ from the axis, $B = \dfrac{\mu_0Ir}{2\pi R^2}$ whatever the value of $K$`, 'The electric field between the plates is the same as it would be with no dielectric and the same charge'], answer: [0, 1, 2],
    sol: r`Charge on the plates changes at the rate $I$, and the Maxwell current in the gap must be continuous with the wire current: $I$ through the whole cross-section, i.e. $I/(\pi R^2)$ per unit area (A true). With the dielectric, $E = \sigma/(K\epsilon_0)$, so $\epsilon_0\,d\Phi_E/dt = \epsilon_0A\,\dot\sigma/(K\epsilon_0) = I/K$; the rest, $I(1 - 1/K)$, is polarisation current (B true). Using $\oint\vec H\cdot d\vec l = I_{\text{enclosed}}$ with $I_{\text{enc}} = Ir^2/R^2$ (the displacement flux $\dot\Phi_D$), $B = \mu_0H$ gives $\mu_0Ir/(2\pi R^2)$, independent of $K$ (C true). The dielectric reduces $E$ to $\sigma/(K\epsilon_0)$ (D false).`,
    trap: 'The vacuum term $\\epsilon_0\\dot\\Phi_E$ is only a fraction of the current that the dielectric carries.' }),
  v5('ew-v504', 'nat', 'integer', 'radiation pressure', {
    q: r`A thin, perfectly reflecting horizontal sheet has a mass of $0.2\ \mathrm{kg}$ per square metre. Light of uniform intensity $I$ travelling vertically upward falls normally on it from below, and the sheet just floats (weight balanced by the radiation force). Take $g = 10\ \mathrm{m\,s^{-2}}$ and $c = 3\times10^8\ \mathrm{m\,s^{-1}}$. Find $I$ in units of $10^{8}\ \mathrm{W\,m^{-2}}$.`,
    answer: 3, tol: 0, calc: () => 0.2 * 10 * 3e8 / 2 / 1e8,
    sol: r`For a perfect mirror at normal incidence the pressure is $2I/c$. The weight per unit area is $0.2\times10 = 2\ \mathrm{N\,m^{-2}}$. So $2I/c = 2$ and $I = c = 3\times10^{8}\ \mathrm{W\,m^{-2}}$, which is $3$ units.`,
    trap: 'Using $I/c$ (a perfect absorber) would give $6$.' }),
  v5('ew-v505', 'nat', 'integer', 'EM waves in a medium', {
    q: r`A plane wave of electric amplitude $300\ \mathrm{V\,m^{-1}}$ in vacuum enters a non-magnetic medium of refractive index $4$. Assume the whole intensity is transmitted (no reflection). Find the amplitude of the magnetic field in the medium, in nT. Take $c = 3\times10^{8}\ \mathrm{m\,s^{-1}}$.`,
    answer: 2000, tol: 0, unit: 'nT', calc: () => 4 * (300 / Math.sqrt(4)) / 3e8 * 1e9,
    sol: r`Intensity is $\tfrac12\epsilon_0cnE^2$ in a non-magnetic medium. Equal intensity gives $nE'^2 = E_0^2$, so $E' = E_0/\sqrt n = 150\ \mathrm{V\,m^{-1}}$. In the medium $E'/B' = c/n$, so $B' = nE'/c = 4\times150/(3\times10^8) = 2\times10^{-6}$ T $= 2000$ nT.`,
    trap: 'Keeping $E$ unchanged gives $4000$ nT, keeping $B$ unchanged gives $1000$ nT: neither is conserved.' }),
  v5('ew-v506', 'nat', 'integer', 'intensity and field', {
    q: r`A laser pulse of energy $3.0$ J lasts $1.0$ ns and is spread uniformly over a circular spot of radius $1.0$ mm. Treat it as a plane wave of constant intensity. Taking $\epsilon_0 = 8.85\times10^{-12}\ \mathrm{SI}$ and $c = 3\times10^{8}\ \mathrm{m\,s^{-1}}$, find the amplitude of its electric field in $\mathrm{MV\,m^{-1}}$ (nearest whole number).`,
    answer: 848, tol: 0, unit: 'MV/m', calc: () => Math.round(Math.sqrt(2 * (3 / (1e-9 * Math.PI * 1e-6)) / (8.85e-12 * 3e8)) / 1e6),
    sol: r`Intensity $I = \dfrac{\text{energy}}{\text{time}\times\text{area}} = \dfrac{3.0}{10^{-9}\times\pi\times10^{-6}} = 9.55\times10^{14}\ \mathrm{W\,m^{-2}}$. With $I = \tfrac12\epsilon_0cE_0^2$: $E_0 = \sqrt{\dfrac{2I}{\epsilon_0c}} = \sqrt{\dfrac{2\times9.55\times10^{14}}{8.85\times10^{-12}\times3\times10^{8}}} = 8.48\times10^{8}\ \mathrm{V\,m^{-1}}$, i.e. $848\ \mathrm{MV\,m^{-1}}$.`,
    trap: 'Dropping the factor $\\tfrac12$ gives $600$; using the full duration instead of 1 ns fails by a factor of $10^{9}$ in $I$.' }),
  v5('ew-v507', 'nat', 'numeric', 'Poynting vector', {
    q: r`A nichrome wire of radius $0.50$ mm and length $1.0$ m has a resistance of $1.4\ \Omega$ and carries a steady $2.0$ A. Find the magnitude of the Poynting vector at its surface in $\mathrm{kW\,m^{-2}}$ (2 decimals).`,
    answer: 1.78, tol: 0.01, unit: 'kW/m²', calc: () => 4 * 1.4 / (2 * Math.PI * 5e-4 * 1) / 1000,
    sol: r`The power dissipated is $I^2R = 4\times1.4 = 5.6$ W. It all enters through the curved surface of area $2\pi a\ell = 2\pi\times0.5\times10^{-3}\times1.0 = 3.14\times10^{-3}\ \mathrm{m^2}$. So $S = 5.6/(3.14\times10^{-3}) = 1.78\times10^{3}\ \mathrm{W\,m^{-2}} = 1.78\ \mathrm{kW\,m^{-2}}$. Check with fields: $E = IR/\ell = 2.8$ V/m, $B = \mu_0I/(2\pi a) = 8\times10^{-4}$ T, and $EB/\mu_0 = 1.78\times10^{3}$.`,
    trap: 'Using the area of the cross-section instead of the curved surface is a factor of $2\\ell/a$ off.' }),
  { id: 'ew-v508', type: 'mcq', level: 5, format: 'match', exams: ['jee-adv'], sub: 'radiation force', group: 'v5m1',
    q: r`A beam of intensity $I$ falls on a flat surface of area $A$. Match each case in List I with the magnitude of the total force on the surface in List II. (Angles of incidence are measured from the normal; the mirror reflects specularly.)`,
    options: ['A-q, B-s, C-r, D-p', 'A-q, B-s, C-p, D-r', 'A-s, B-q, C-r, D-p', 'A-q, B-r, C-s, D-p'], answer: 0,
    sol: r`A: $IA/c$ (q). B: $2IA/c$ (s). C: an absorber takes up the momentum arriving per second, $IA\cos\theta/c = IA/(2c)$ for $\theta=60^\circ$ (r). D: a mirror gives a force along the normal of magnitude $2IA\cos^2\theta/c = 2IA(3/4)/c = 3IA/(2c)$ for $\theta = 30^\circ$ (p). So A-q, B-s, C-r, D-p.`,
    trap: 'An oblique mirror gets $\\cos^2\\theta$ (one $\\cos$ from the area, one from the normal momentum change); an oblique absorber gets only one $\\cos\\theta$.' },
  { id: 'ew-v509', type: 'mcq', level: 5, format: 'match', exams: ['jee-adv'], sub: 'Poynting vector', group: 'v5m2',
    q: r`Match each situation in List I with the direction of the Poynting vector in List II.`,
    options: ['A-p, B-r, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-p, B-r, C-q, D-s', 'A-r, B-p, C-s, D-q'], answer: 3,
    sol: r`A charging capacitor: $E$ along the axis grows, so $\vec B$ circulates in the right-hand sense about the displacement current and $\vec E\times\vec B$ points inward: radially inward (r). While discharging, $dE/dt$ reverses, $\vec B$ reverses and the flow is outward (p). C: $kx - \omega t$ is a wave moving along $+x$ (s). D: $kx + \omega t$ moves along $-x$ (q). So A-r, B-p, C-s, D-q.`,
    trap: 'The direction of $\\vec B$ in the gap follows $dE/dt$, not $E$.' },
  { id: 'ew-v510', type: 'nat', level: 5, format: 'passage', exams: ['jee-adv'], sub: 'conduction and displacement current', group: 'v5p1',
    q: 'At what frequency (in MHz) are the peak conduction and displacement current densities equal?',
    answer: 899, tol: 1, unit: 'MHz', calc: () => 4 / (2 * Math.PI * 8.85e-12 * 80) / 1e6,
    sol: r`Peak $J_c = \sigma E_0$ and peak $J_d = \epsilon_r\epsilon_0\omega E_0$. Equal when $\omega = \sigma/(\epsilon_r\epsilon_0)$, so $f = \dfrac{\sigma}{2\pi\epsilon_r\epsilon_0} = \dfrac{4.0}{2\pi\times80\times8.85\times10^{-12}} = 8.99\times10^{8}$ Hz $\approx 899$ MHz.`,
    trap: 'Use $f = \\omega/2\\pi$; stopping at $\\omega$ gives $5650$ MHz.' },
  { id: 'ew-v511', type: 'nat', level: 5, format: 'passage', exams: ['jee-adv'], sub: 'conduction and displacement current', group: 'v5p1',
    q: 'At $1$ kHz, find the ratio (peak conduction current density)/(peak displacement current density) in units of $10^5$ (2 decimals).',
    answer: 8.99, tol: 0.02, calc: () => 4 / (80 * 8.85e-12 * 2 * Math.PI * 1e3) / 1e5,
    sol: r`The ratio is $\sigma/(\epsilon_r\epsilon_0\omega)$ with $\omega = 2\pi\times10^3 = 6.28\times10^3\ \mathrm{s^{-1}}$: $\dfrac{4.0}{80\times8.85\times10^{-12}\times6.28\times10^{3}} = 8.99\times10^{5}$. At $1$ kHz sea water behaves almost purely as a conductor.` },
  { id: 'ew-v512', type: 'mcq', level: 5, format: 'passage', exams: ['jee-adv'], sub: 'conduction and displacement current', group: 'v5p1',
    q: 'Compared with the conduction current density, the displacement current density in the water',
    options: ['is in phase with it', r`leads it by $90^\circ$`, r`lags it by $90^\circ$`, r`is $180^\circ$ out of phase with it`], answer: 1,
    sol: r`$J_c = \sigma E_0\sin\omega t$ is in phase with $E$. $J_d = \epsilon_r\epsilon_0\,\partial E/\partial t = \epsilon_r\epsilon_0\omega E_0\cos\omega t$, which is $\sin(\omega t + 90^\circ)$, so it leads by $90^\circ$. The other options mix up the sign of the derivative.`,
    trap: 'A derivative of a sine is a cosine: ahead of it by a quarter cycle, not behind.' },
  { id: 'ew-v513', type: 'mcq', level: 5, format: 'assertion', exams: ['jee-adv'], sub: 'EM wave and charges',
    q: `<b>Assertion (A):</b> Even for a charge moving at a speed close to $c$, the magnetic force of an EM wave on it is negligible compared with the electric force, because $B_0 = E_0/c$ is tiny.<br><b>Reason (R):</b> For a plane EM wave in vacuum, $B_0 = E_0/c$.`,
    options: AOPT, answer: 3,
    sol: r`R is true. A is false: the magnetic force is $qvB_0 = q(v/c)E_0$, which is comparable with the electric force $qE_0$ when $v$ is close to $c$. It is negligible only for $v\ll c$. The small size of $B_0$ in SI units reflects the units, not the strength of the effect.`,
    trap: 'Compare $vB$ with $E$, not $B$ with $E$: the ratio is $v/c$.' },
  { id: 'ew-v514', type: 'mcq', level: 5, format: 'statements', exams: ['jee-adv'], sub: 'EM waves in a medium',
    q: `<b>Statement I:</b> A plane wave of the same electric amplitude $E_0$ has an intensity $n$ times larger in a non-magnetic medium of refractive index $n$ than in vacuum.<br><b>Statement II:</b> For the same $E_0$, the total energy density of the wave is the same in the medium as in vacuum.`,
    options: SOPT, answer: 2,
    sol: r`In the medium $I = \tfrac12\epsilon_0cnE_0^2$, which is $n$ times the vacuum value (I true). The energy density is $u = \tfrac12\epsilon E_0^2$ (electric and magnetic halves equal, averaged), with $\epsilon = n^2\epsilon_0$, so it is $n^2$ times larger (II false). The intensity is $u\times(c/n)$, which gives the factor $n$.`,
    trap: 'Intensity $=$ energy density $\\times$ speed, and the speed drops by $n$ while the energy density rises by $n^2$.' },
  { id: 'ew-v515', type: 'mcq', level: 5, format: 'statements', exams: ['jee-adv'], sub: 'Maxwell\'s equations',
    q: `Consider the following.<br>(1) No displacement current flows between the plates of a capacitor that holds a steady charge.<br>(2) In a plane wave in vacuum, at every point and instant the electric and magnetic energy densities are equal.<br>(3) The Poynting vector of a plane wave averages to zero over one cycle.<br>(4) Radio waves travel faster than X-rays in vacuum.<br>How many of these statements are correct?`,
    options: ['Only one', 'Only two', 'Only three', 'All four'], answer: 1,
    sol: r`(1) True: the field is constant, so $\partial E/\partial t = 0$. (2) True: $\epsilon_0E^2/2 = B^2/(2\mu_0)$ because $E = cB$ at every instant. (3) False: $\vec E\times\vec B$ always points along the propagation direction, so its average is $I>0$. (4) False: all EM waves travel at $c$ in vacuum. Two are correct.`,
    trap: 'The wave oscillates in $E$ and $B$, but $\\vec S$ never changes sign.' },
);


// templates (level 5)
gens.push(
  { id: 'ew-v5g1', type: 'nat', level: 5, exams: ['jee-adv'], sub: 'radiation pressure',
    make(rng) {
      const sg = choose(rng, [0.05, 0.1, 0.2, 0.5]), mirror = choose(rng, [true, false]), k = mirror ? 2 : 1;
      const I = sg * 9.8 * 3e8 / k / 1e6;
      return { sg, k, answer: +I.toFixed(2), tol: Math.max(0.05, I * 0.005), unit: 'MW/m²',
        q: `A thin, perfectly ${mirror ? 'reflecting' : 'absorbing'} horizontal sheet has a mass of ${sg} kg per square metre. Light travelling vertically upward falls normally on it from below with uniform intensity $I$, and the sheet just floats. Take $g = 9.8\\ \\mathrm{m\\,s^{-2}}$ and $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$. Find $I$ in $\\mathrm{MW\\,m^{-2}}$.`,
        sol: `The radiation pressure on a perfectly ${mirror ? 'reflecting sheet is $2I/c$' : 'absorbing sheet is $I/c$'}. Weight per unit area $= ${sg}\\times9.8 = ${fmt(sg * 9.8, 4)}\\ \\mathrm{N\\,m^{-2}}$. So $I = ${fmt(sg * 9.8, 4)}\\times c/${k} = ${fmt(I, 4)}\\ \\mathrm{MW\\,m^{-2}}$.`,
        trap: 'A mirror reverses the momentum, so it needs only half the intensity that an absorber needs.' };
    },
    verify: (p) => { const A = 1, m = p.sg * A; const F = m * 9.8; return F * 3e8 / (p.k * A) / 1e6; } },
  { id: 'ew-v5g2', type: 'nat', level: 5, exams: ['jee-adv'], sub: 'Poynting vector in a wire',
    make(rng) {
      const I = pick(rng, 1, 5, 0.5), R = pick(rng, 0.5, 3, 0.5), a = pick(rng, 0.2, 1, 0.1), l = pick(rng, 0.5, 2, 0.5);
      const S = I * I * R / (2 * Math.PI * a * 1e-3 * l);
      return { I, R, a, l, answer: +(S / 1000).toFixed(3), tol: Math.max(0.01, S / 1000 * 0.01), unit: 'kW/m²',
        q: `A resistance wire of radius ${a} mm and length ${l} m has a resistance of ${R} Ω and carries a steady ${I} A. Find the magnitude of the Poynting vector at its surface in $\\mathrm{kW\\,m^{-2}}$ (2 decimals).`,
        sol: `Heat produced $= I^2R = ${fmt(I * I * R, 4)}$ W, entering through the curved surface of area $2\\pi a\\ell = ${fmt(2 * Math.PI * a * 1e-3 * l, 4)}\\ \\mathrm{m^2}$. So $S = ${fmt(I * I * R, 4)}/${fmt(2 * Math.PI * a * 1e-3 * l, 4)} = ${fmt(S / 1000, 4)}\\ \\mathrm{kW\\,m^{-2}}$ (the same as $EB/\\mu_0$ with $E = IR/\\ell$ and $B = \\mu_0I/2\\pi a$).`,
        trap: 'The energy enters through the side of the wire, not the cross-section.' };
    },
    verify: (p) => { const mu = 4e-7 * Math.PI; const E = p.I * p.R / p.l, B = mu * p.I / (2 * Math.PI * p.a * 1e-3); return E * B / mu / 1000; } },
  { id: 'ew-v5g3', type: 'mcq', level: 5, exams: ['jee-adv'], sub: 'displacement current in a dielectric',
    make(rng) {
      const K = choose(rng, [3, 4, 5, 6]), I = choose(rng, [2, 3, 4, 5]);
      const f = (x) => `${fmt(x, 3)} A`;
      const { options, answer } = shuffleOpts(rng, f(I / K), [f(I), f(I * K), f(I * (1 - 1 / K))]);
      return { K, I, options, answer,
        q: `A parallel-plate capacitor completely filled with a dielectric of constant ${K} is charged by a steady conduction current of ${I} A in the wires. The quantity $\\epsilon_0\\,d\\Phi_E/dt$ (with the vacuum $\\epsilon_0$) over the plate area equals`,
        sol: `With the dielectric, $E = \\sigma/(K\\epsilon_0)$, so $\\epsilon_0\\,d\\Phi_E/dt = (dQ/dt)/K = ${I}/${K} = ${fmt(I / K, 3)}$ A. The remaining ${f(I * (1 - 1 / K))} is the polarisation current of the bound charges. The sum is the full ${I} A.`,
        trap: 'Only $\\epsilon\\,d\\Phi_E/dt$ with $\\epsilon = K\\epsilon_0$ equals the whole charging current.' };
    },
    verify: (p) => p.options.indexOf(`${fmt(p.I / p.K, 3)} A`) },
);


export default { topic: 'em-waves', groups, items, gens };
