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
];
export default { topic: 'em-waves', groups, items, gens };
