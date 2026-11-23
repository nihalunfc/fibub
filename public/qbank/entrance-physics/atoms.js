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
const MU = 4e-7 * Math.PI; const QE = 1.602e-19; const HC = 1240; const RY = 1.097e7; const E1 = 13.6; const A0 = 0.529;
const S = (x, sig = 3) => String(+Number(x).toPrecision(sig));
let k = 0; let c = 0;
const nid = () => `ab-${String(++k).padStart(3, '0')}`;
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
const items = [];
const En = (Z, n) => -E1 * Z * Z / n / n;
const lamNm = (Z, n1, n2) => 1e9 / (RY * Z * Z * (1 / (n1 * n1) - 1 / (n2 * n2)));
items.push(
  // ---------- Level 1 ----------
  mcq(1, 'alpha scattering', r`In Rutherford's gold-foil experiment most alpha particles went straight through. This showed that`, 'most of the atom is empty space', ['the atom is a uniform sphere of positive charge', 'alpha particles are heavier than electrons', 'electrons carry most of the atom\'s mass'],
    r`If the positive charge were spread over the whole atom (Thomson's model) every alpha would be deflected only slightly. Passing straight means most alphas never come near the tiny, dense nucleus. The other options do not follow from this observation.`),
  mcq(1, 'nuclear size', r`The size of the nucleus is of the order of`, r`$10^{-15}$ m`, [r`$10^{-10}$ m`, r`$10^{-12}$ m`, r`$10^{-20}$ m`],
    r`The nucleus is about $10^{-15}$ m (1 fm), about 100 000 times smaller than the atom ($10^{-10}$ m).`),
  nat(1, 'Bohr radius', r`The radius of the first Bohr orbit of hydrogen is 0.529 Å. Express it in picometres (pm).`, 0.529 * 100, 0.1, 1,
    r`1 Å $= 10^{-10}$ m $= 100$ pm, so $0.529$ Å $= 52.9$ pm.`, { unit: 'pm' }),
  mcq(1, 'energy levels', r`The energy of the electron in the ground state of hydrogen is`, '$-13.6$ eV', ['$+13.6$ eV', '$-3.4$ eV', '$0$'],
    r`$E_n = -13.6/n^2$ eV. For $n = 1$ it is $-13.6$ eV. The minus sign means the electron is bound; 13.6 eV must be supplied to free it.`),
  mcq(1, 'spectral series', r`Which series of the hydrogen spectrum has lines in the visible region?`, 'Balmer', ['Lyman', 'Paschen', 'Brackett'],
    r`Lyman ($n_1 = 1$) is ultraviolet; Balmer ($n_1 = 2$) is visible; Paschen, Brackett and Pfund are infrared.`),
  mcq(1, 'spectral series', r`The Lyman series of hydrogen lies in the`, 'ultraviolet region', ['visible region', 'near infrared region', 'microwave region'],
    r`The transitions end at $n = 1$, so photon energies are 10.2 eV and above, that is, wavelengths 121.6 nm and shorter: ultraviolet.`),
  nat(1, 'number of lines', r`A large number of hydrogen atoms are excited to $n = 4$. How many different spectral lines can be emitted?`, 4 * 3 / 2, 0, 0,
    r`Number of lines $= \dfrac{n(n-1)}{2} = \dfrac{4\times3}{2} = 6$ (4→3, 4→2, 4→1, 3→2, 3→1, 2→1).`),
  mcq(1, 'Bohr postulates', r`In Bohr's model the allowed orbits are those in which the angular momentum of the electron is`, r`an integral multiple of $h/2\pi$`, [r`any multiple of $h/2\pi$`, r`an integral multiple of $h$`, r`equal to $h/2\pi$ for all orbits`],
    r`Bohr's quantisation rule: $L = mvr = nh/2\pi$ with $n = 1, 2, 3, \dots$ Only whole-number multiples are allowed.`),
  nat(1, 'energy levels', r`Find the energy of the electron in the $n = 2$ level of hydrogen (in eV, 2 decimals).`, En(1, 2), 0.01, 2,
    r`$E_2 = -\dfrac{13.6}{2^2} = -3.40$ eV.`, { unit: 'eV' }),
  mcq(1, 'atomic models', r`Thomson's model of the atom is often called`, 'the plum pudding model', ['the planetary model', 'the quantum model', 'the shell model'],
    r`Thomson pictured a sphere of positive charge with electrons embedded in it like plums in a pudding. Rutherford's alpha scattering disproved it.`),
  mcq(1, 'emission', r`When an electron in a hydrogen atom jumps from a higher orbit to a lower orbit, the atom`, 'emits a photon whose energy equals the difference of the two energies', ['absorbs a photon of the same energy', 'emits an electron', 'emits a photon of energy equal to the higher level energy'],
    r`$h\nu = E_{\text{higher}} - E_{\text{lower}}$. The photon carries away exactly the energy lost. It is the energy difference, not the energy of one level.`),
  nat(1, 'ionisation energy', r`Find the energy needed to remove the electron of a ground-state $\mathrm{He^+}$ ion (in eV, 1 decimal).`, E1 * 4, 0.1, 1,
    r`$E_n = -13.6Z^2/n^2$. For $Z = 2$, $n = 1$: $E = -54.4$ eV. The ionisation energy is $+54.4$ eV.`, { unit: 'eV' }),
  mcq(1, 'limits of Rutherford model', r`According to classical electromagnetic theory the orbiting electron in Rutherford's model would`, 'radiate energy and spiral into the nucleus', ['stay in a stable circular orbit forever', 'emit only one fixed wavelength', 'gain energy from the nucleus'],
    r`An accelerating charge radiates. Losing energy, the electron would spiral inward in about $10^{-10}$ s, so atoms would collapse and emit a continuous spectrum. Neither is observed. Bohr's postulates solve this.`),
  mcq(1, 'X-rays', r`In an X-ray tube the minimum wavelength of the emitted X-rays depends on`, 'the accelerating voltage', ['the target material', 'the filament material', 'the tube current only'],
    r`The most energetic photon has all of an electron's energy $eV$, so $\lambda_{min} = hc/eV$. It depends on $V$ alone, not on the target.`),
  nat(1, 'number of lines', r`Electrons in a group of hydrogen atoms are in the $n = 3$ level. How many different lines can be emitted in total?`, 3, 0, 0,
    r`$\dfrac{3\times2}{2} = 3$ lines: 3→2, 3→1, 2→1.`),
  mcq(1, 'energy levels', r`In a hydrogen atom the total energy of the electron in a stationary orbit is negative. This means that`, 'the electron is bound to the nucleus', ['the electron is at rest', 'the nucleus repels the electron', 'the electron has negative mass'],
    r`The zero of energy is an electron at rest infinitely far away. Negative total energy means energy must be supplied to free the electron: it is bound.`),
  nat(1, 'Bohr radius', r`Find the radius of the third Bohr orbit of hydrogen (in Å, 2 decimals). Take $a_0 = 0.529$ Å.`, A0 * 9, 0.01, 2,
    r`$r_n = n^2a_0 = 9\times0.529 = 4.76$ Å.`, { unit: 'Å' }),
  nat(1, 'cut-off wavelength', r`X-rays are produced by electrons accelerated through 31 kV. Find the minimum wavelength emitted (in pm, 1 decimal; use $hc = 1240$ eV nm).`, HC / 31000 * 1000, 0.5, 1,
    r`$\lambda_{min} = \dfrac{hc}{eV} = \dfrac{1240\ \text{eV nm}}{31\,000\ \text{eV}} = 0.0400$ nm $= 40.0$ pm.`, { unit: 'pm' }),
  nat(1, 'distance of closest approach', r`A 5 MeV alpha particle moves directly towards a gold nucleus ($Z = 79$). Find the distance of closest approach (in fm, 1 decimal; use $\dfrac{e^2}{4\pi\varepsilon_0} = 1.44$ MeV fm).`, 2 * 79 * 1.44 / 5, 0.5, 1,
    r`At closest approach all kinetic energy is electrical potential energy: $K = \dfrac{(2e)(Ze)}{4\pi\varepsilon_0r_0}$. So $r_0 = \dfrac{2Z\times1.44}{K} = \dfrac{2\times79\times1.44}{5} = 45.5$ fm.`, { unit: 'fm' }),
  mcq(1, 'spectral series', r`Spectral lines of an element are formed when`, 'electrons jump between energy levels', ['nuclei decay', 'atoms collide with each other only', 'electrons are removed from the atom completely'],
    r`Each line corresponds to one energy difference between two allowed levels, so each element has its own set of lines (a fingerprint).`),
);
items.push(
  // ---------- Level 2 ----------
  mn(2, 'Bohr radius', r`Find the radius of the $n = 2$ orbit of the $\mathrm{Li^{2+}}$ ion (in Å). Take $a_0 = 0.529$ Å.`, A0 * 4 / 3, [A0 * 4, A0 * 4 * 3, A0 * 2 / 3], 'Å',
    r`$r_n = \dfrac{n^2}{Z}a_0$. Here $n = 2$, $Z = 3$: $r = \dfrac{4}{3}\times0.529 = 0.705$ Å. The orbit shrinks as $Z$ grows because the pull is stronger.`),
  nat(2, 'orbital speed', r`The speed of the electron in the first orbit of hydrogen is $2.19\times10^6\ \mathrm{m\,s^{-1}}$. Find its speed in the first orbit of $\mathrm{He^+}$ (in $10^6\ \mathrm{m\,s^{-1}}$, 2 decimals).`, 2.19 * 2, 0.02, 2,
    r`$v_n = \dfrac{Z}{n}\times2.19\times10^6$. For $Z = 2$, $n = 1$: $4.38\times10^6\ \mathrm{m\,s^{-1}}$.`, { unit: '×10⁶ m/s' }),
  mn(2, 'energy levels', r`Find the energy of the electron of $\mathrm{Li^{2+}}$ in its $n = 2$ level (in eV).`, En(3, 2), [En(3, 1), En(1, 2) * 3, En(2, 2)], 'eV',
    r`$E_n = -13.6\dfrac{Z^2}{n^2}$. $Z = 3$, $n = 2$: $E = -13.6\times\dfrac{9}{4} = -30.6$ eV.`),
  nat(2, 'spectral series', r`Find the energy of the photon emitted in the transition $n = 3\to2$ in hydrogen (in eV, 2 decimals).`, E1 * (1 / 4 - 1 / 9), 0.01, 2,
    r`$h\nu = 13.6\left(\dfrac{1}{2^2} - \dfrac{1}{3^2}\right) = 13.6\times\dfrac{5}{36} = 1.89$ eV. This is the red H-alpha line.`, { unit: 'eV' }),
  mcq(2, 'Bohr radius', r`The ratio of the radius of the third orbit of hydrogen to that of the first orbit is`, '9 : 1', ['3 : 1', '27 : 1', '1 : 3'],
    r`$r_n \propto n^2$, so $r_3 : r_1 = 9 : 1$. Choosing 3 : 1 uses $r\propto n$, which is wrong.`),
  mcq(2, 'orbital speed', r`The ratio of the speeds of the electron in the $n = 2$ and $n = 3$ orbits of hydrogen is`, '3 : 2', ['2 : 3', '9 : 4', '4 : 9'],
    r`$v_n \propto 1/n$, so $v_2 : v_3 = 3 : 2$. The inner orbit is the faster one.`),
  nat(2, 'kinetic energy', r`Find the kinetic energy of the electron in the $n = 2$ orbit of hydrogen (in eV, 2 decimals).`, E1 / 4, 0.01, 2,
    r`In a Bohr orbit $K = -E = \dfrac{13.6}{n^2}$. For $n = 2$: $K = 3.40$ eV.`, { unit: 'eV' }),
  mn(2, 'potential energy', r`Find the electric potential energy of the electron in the $n = 2$ orbit of hydrogen (in eV).`, -E1 / 2, [-E1 / 4, E1 / 2, -E1], 'eV',
    r`$U = 2E = -2K$. $E_2 = -3.4$ eV, so $U = -6.8$ eV. (Total $-3.4 = 3.4 - 6.8$.)`, { trap: 'U is twice the total energy, not equal to it.' }),
  nat(2, 'spectral series', r`Find the wavelength of the photon emitted when a hydrogen atom drops from $n = 3$ to $n = 1$ (in nm, 1 decimal; $hc = 1240$ eV nm).`, HC / (E1 * (1 - 1 / 9)), 0.5, 1,
    r`$\Delta E = 13.6\left(1 - \dfrac19\right) = 12.09$ eV. $\lambda = \dfrac{1240}{12.09} = 102.6$ nm (second line of the Lyman series).`, { unit: 'nm' }),
  nat(2, 'Rydberg formula', r`Using $R = 1.097\times10^7\ \mathrm{m^{-1}}$, find the wavelength of the first line of the Paschen series (in nm, nearest whole number).`, 1e9 / (RY * (1 / 9 - 1 / 16)), 3, 0,
    r`Paschen: $n_1 = 3$, first line $n_2 = 4$. $\dfrac1\lambda = R\left(\dfrac19 - \dfrac1{16}\right) = R\times\dfrac{7}{144}$. $\lambda = \dfrac{144}{7R} = 1.875\times10^{-6}$ m $= 1875$ nm (infrared).`, { unit: 'nm' }),
  mcq(2, 'time period', r`The ratio of the time periods of revolution of the electron in the $n = 2$ and $n = 1$ orbits of hydrogen is`, '8 : 1', ['2 : 1', '4 : 1', '16 : 1'],
    r`$T = \dfrac{2\pi r}{v}\propto\dfrac{n^2}{1/n} = n^3$. So $T_2 : T_1 = 8 : 1$. The frequency goes as $1/n^3$.`),
  nat(2, 'orbital frequency', r`The electron in the first orbit of hydrogen has $r = 0.529\times10^{-10}$ m and $v = 2.19\times10^6\ \mathrm{m\,s^{-1}}$. Find the number of revolutions per second (in $10^{15}$ Hz, 2 decimals).`, 2.19e6 / (2 * Math.PI * 0.529e-10) / 1e15, 0.03, 2,
    r`$f = \dfrac{v}{2\pi r} = \dfrac{2.19\times10^6}{2\pi\times0.529\times10^{-10}} = 6.59\times10^{15}$ Hz.`, { unit: '×10¹⁵ Hz' }),
  nat(2, 'current due to orbiting electron', r`An electron circles the nucleus 6.6 $\times10^{15}$ times per second in the ground state of hydrogen. Find the equivalent current (in mA, 2 decimals; $e = 1.6\times10^{-19}$ C).`, 1.6e-19 * 6.6e15 * 1e3, 0.02, 2,
    r`Charge $e$ passes a point $f$ times a second, so $I = ef = 1.6\times10^{-19}\times6.6\times10^{15} = 1.06\times10^{-3}$ A $= 1.06$ mA.`, { unit: 'mA' }),
  nat(2, 'spectral series', r`With $R = 1.097\times10^7\ \mathrm{m^{-1}}$ find the longest wavelength in the Balmer series (in nm, nearest whole number).`, 1e9 / (RY * (1 / 4 - 1 / 9)), 2, 0,
    r`The longest wavelength is the smallest energy gap, $3\to2$. $\dfrac1\lambda = R\times\dfrac{5}{36}$, so $\lambda = \dfrac{36}{5R} = 6.563\times10^{-7}$ m $= 656$ nm.`, { unit: 'nm' }),
  nat(2, 'series limit', r`Find the shortest wavelength of the Balmer series (series limit) (in nm, nearest whole number; $R = 1.097\times10^7\ \mathrm{m^{-1}}$).`, 1e9 / (RY / 4), 2, 0,
    r`The shortest wavelength is for $n_2 = \infty$. $\dfrac1\lambda = \dfrac{R}{2^2}$, so $\lambda = \dfrac{4}{R} = 3.646\times10^{-7}$ m $= 365$ nm.`, { unit: 'nm' }),
  mcq(2, 'spectral series', r`The ratio of the longest wavelength of the Lyman series to that of the Balmer series of hydrogen is`, '5 : 27', ['27 : 5', '3 : 4', '1 : 4'],
    r`Lyman longest: $\dfrac1{\lambda_L} = R\left(1 - \dfrac14\right) = \dfrac{3R}4$. Balmer longest: $\dfrac1{\lambda_B} = \dfrac{5R}{36}$. Ratio $\dfrac{\lambda_L}{\lambda_B} = \dfrac{5/36}{3/4} = \dfrac{5}{27}$.`),
  nat(2, 'recoil of the atom', r`A hydrogen atom (mass $1.67\times10^{-27}$ kg) at rest emits a 10.2 eV photon. Find the recoil speed of the atom (in $\mathrm{m\,s^{-1}}$, 2 decimals; $c = 3\times10^8\ \mathrm{m\,s^{-1}}$, 1 eV $= 1.6\times10^{-19}$ J).`, 10.2 * 1.6e-19 / 3e8 / 1.67e-27, 0.05, 2,
    r`Momentum is conserved: $p_{atom} = p_{photon} = E/c = \dfrac{10.2\times1.6\times10^{-19}}{3\times10^8} = 5.44\times10^{-27}$ kg m/s. $v = \dfrac{p}{m} = \dfrac{5.44\times10^{-27}}{1.67\times10^{-27}} = 3.26\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mn(2, 'reduced mass', r`Positronium is an electron and a positron orbiting their common centre. Treating it like hydrogen with the reduced mass, find its ground-state energy (in eV).`, -6.8, [-13.6, -27.2, -3.4], 'eV',
    r`The reduced mass is $\mu = \dfrac{m\cdot m}{2m} = \dfrac m2$. Energy scales with $\mu$, so $E_1 = -13.6\times\dfrac12 = -6.8$ eV.`),
  nat(2, 'distance of closest approach', r`A 5 MeV proton is fired straight at a gold nucleus ($Z = 79$). Find the distance of closest approach (in fm, 1 decimal; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm).`, 79 * 1.44 / 5, 0.3, 1,
    r`$K = \dfrac{(e)(Ze)}{4\pi\varepsilon_0r_0}$. $r_0 = \dfrac{79\times1.44}{5} = 22.8$ fm. It is half the alpha value because the proton has half the charge.`, { unit: 'fm' }),
  nat(2, 'distance of closest approach', r`A 6 MeV alpha particle approaches a copper nucleus ($Z = 29$) head on. Find the distance of closest approach (in fm, 1 decimal; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm).`, 2 * 29 * 1.44 / 6, 0.2, 1,
    r`$r_0 = \dfrac{2Ze^2/4\pi\varepsilon_0}{K} = \dfrac{2\times29\times1.44}{6} = 13.9$ fm.`, { unit: 'fm' }),
  mcq(2, 'impact parameter', r`In alpha scattering, an alpha particle with zero impact parameter is scattered through`, r`$180^\circ$`, [r`$0^\circ$`, r`$90^\circ$`, r`$45^\circ$`],
    r`Zero impact parameter means a head-on approach. The alpha stops, then retraces its path: scattering angle $180^\circ$. Large impact parameters give small angles.`),
  nat(2, 'Moseley law', r`The $K_\alpha$ line follows $\nu = \dfrac34Rc(Z-1)^2$. Find $\nu$ for copper ($Z = 29$) (in $10^{18}$ Hz, 2 decimals; $Rc = 3.29\times10^{15}$ Hz).`, 0.75 * 3.29e15 * 28 * 28 / 1e18, 0.02, 2,
    r`$\nu = 0.75\times3.29\times10^{15}\times28^2 = 1.93\times10^{18}$ Hz. (The screening makes the effective charge $Z - 1$, not $Z$.)`, { unit: '×10¹⁸ Hz' }),
  mcq(2, 'Moseley law', r`Moseley's law states that for the characteristic X-ray line of a given series,`, r`$\sqrt\nu$ is proportional to $(Z - b)$`, [r`$\nu$ is proportional to $Z$`, r`$\lambda$ is proportional to $Z^2$`, r`$\nu$ is independent of $Z$`],
    r`$\sqrt\nu = a(Z - b)$. A graph of $\sqrt\nu$ against $Z$ is a straight line. This fixed the order of elements in the periodic table by atomic number.`),
  nat(2, 'X-ray cut-off', r`An X-ray tube works at 40 kV. Find the maximum frequency of the X-rays (in $10^{18}$ Hz, 2 decimals; $e = 1.6\times10^{-19}$ C, $h = 6.63\times10^{-34}$ J s).`, 1.6e-19 * 4e4 / 6.63e-34 / 1e18, 0.02, 2,
    r`$h\nu_{max} = eV$. $\nu_{max} = \dfrac{1.6\times10^{-19}\times4\times10^4}{6.63\times10^{-34}} = 9.65\times10^{18}$ Hz.`, { unit: '×10¹⁸ Hz' }),
  mcq(2, 'characteristic X-rays', r`Characteristic X-rays are produced when`, 'an electron falls into a vacancy in an inner shell of the target atom', ['electrons are slowed down in the field of the nucleus', 'the nucleus emits a gamma ray', 'the outer electron is excited by visible light'],
    r`A fast electron knocks out an inner-shell (K) electron; an outer electron drops in and emits an X-ray photon of energy equal to the shell difference. The slowing-down process gives the continuous X-rays (bremsstrahlung).`),
  nat(2, 'spectral series', r`Hydrogen atoms are excited to $n = 5$. How many lines of the Balmer series can they emit?`, 3, 0, 0,
    r`Balmer lines end at $n = 2$: 5→2, 4→2 and 3→2. That is 3 lines.`),
  nat(2, 'spectral series', r`Find the wavelength of the photon emitted in the transition $n = 4\to2$ in hydrogen (in nm, nearest whole number; $hc = 1240$ eV nm).`, HC / (E1 * (1 / 4 - 1 / 16)), 2, 0,
    r`$\Delta E = 13.6\times\left(\dfrac14 - \dfrac1{16}\right) = 2.55$ eV. $\lambda = \dfrac{1240}{2.55} = 486$ nm (blue-green, H-beta).`, { unit: 'nm' }),
  mn(2, 'excitation energy', r`How much energy must a ground-state hydrogen atom absorb to reach the $n = 3$ level (in eV)?`, E1 * (1 - 1 / 9), [E1, E1 / 9, E1 * (1 / 4 - 1 / 9)], 'eV',
    r`$\Delta E = E_3 - E_1 = -1.51 - (-13.6) = 12.09$ eV.`),
  nat(2, 'de Broglie and Bohr', r`Find the de Broglie wavelength of the electron in the first Bohr orbit of hydrogen (in nm, 3 decimals; $r_1 = 0.0529$ nm).`, 2 * Math.PI * 0.0529, 0.003, 3,
    r`Bohr's rule says an orbit holds a whole number of wavelengths: $2\pi r = n\lambda$. For $n = 1$: $\lambda = 2\pi\times0.0529 = 0.332$ nm.`, { unit: 'nm' }),
  nat(2, 'Bohr radius', r`Find the radius of the $n = 2$ orbit of the $\mathrm{He^+}$ ion (in Å, 3 decimals; $a_0 = 0.529$ Å).`, A0 * 4 / 2, 0.003, 3,
    r`$r = \dfrac{n^2}{Z}a_0 = \dfrac{4}{2}\times0.529 = 1.058$ Å.`, { unit: 'Å' }),
  nat(2, 'energy levels', r`A $\mathrm{Li^{2+}}$ ion falls from $n = 3$ to $n = 1$. Find the photon energy (in eV, 1 decimal).`, E1 * 9 * (1 - 1 / 9), 0.2, 1,
    r`$\Delta E = 13.6Z^2\left(\dfrac{1}{1^2} - \dfrac1{3^2}\right) = 13.6\times9\times\dfrac89 = 108.8$ eV.`, { unit: 'eV' }),
  mcq(2, 'spectral series', r`Of the transitions $2\to1$, $3\to2$, $4\to3$ and $5\to4$ in hydrogen, the photon of the longest wavelength comes from`, r`$5\to4$`, [r`$2\to1$`, r`$3\to2$`, r`$4\to3$`],
    r`Longest wavelength means smallest energy gap. The gaps fall as $n$ rises: $\dfrac1{16} - \dfrac1{25}$ is smallest. So $5\to4$ (Brackett alpha, $4.05\ \mu$m).`),
);
items.push(
  // ---------- Level 3 (numbers and concepts) ----------
  nat(3, 'hydrogen-like ions', r`Find the wavelength of the photon emitted in the $n = 2\to1$ transition of $\mathrm{He^+}$ (in nm, 1 decimal; $R = 1.097\times10^7\ \mathrm{m^{-1}}$).`, lamNm(2, 1, 2), 0.3, 1,
    r`For hydrogen-like ions $\dfrac1\lambda = RZ^2\left(\dfrac1{n_1^2} - \dfrac1{n_2^2}\right) = 1.097\times10^7\times4\times\dfrac34 = 3.291\times10^7\ \mathrm{m^{-1}}$. $\lambda = 3.04\times10^{-8}$ m $= 30.4$ nm. It is the hydrogen Lyman-alpha line (121.6 nm) divided by $Z^2 = 4$.`, { unit: 'nm', trap: 'Forgetting the $Z^2$ factor in the Rydberg formula.' }),
  mcq(3, 'hydrogen-like ions', r`The transition of $\mathrm{He^+}$ that gives a photon of the same wavelength as the hydrogen transition $n = 2\to1$ is`, r`$4\to2$`, [r`$3\to1$`, r`$2\to1$`, r`$6\to3$`],
    r`For $\mathrm{He^+}$: $\dfrac1\lambda = 4R\left(\dfrac1{n_1^2} - \dfrac1{n_2^2}\right) = R\left(\dfrac1{(n_1/2)^2} - \dfrac1{(n_2/2)^2}\right)$. So $\mathrm{He^+}$ levels $n = 2, 4, 6,\dots$ act like hydrogen $n = 1, 2, 3,\dots$. Hydrogen $2\to1$ matches $\mathrm{He^+}$ $4\to2$.`),
  nat(3, 'electron bombardment', r`Hydrogen atoms in the ground state are bombarded by electrons of kinetic energy 12.5 eV. Find the largest number of different spectral lines that can be emitted.`, 3, 0, 0,
    r`An electron can give up any part of its energy. Needed: $n = 2$: 10.2 eV; $n = 3$: 12.09 eV; $n = 4$: 12.75 eV. Since $12.09 < 12.5 < 12.75$ the atom can reach $n = 3$ at most. Lines: $\dfrac{3\times2}{2} = 3$.`, { trap: 'A bombarding electron needs only enough energy; unlike a photon it need not match a gap exactly.' }),
  nat(3, 'photoelectric effect on hydrogen', r`Ultraviolet light of wavelength 80 nm falls on hydrogen atoms in the ground state. Find the kinetic energy of the ejected electrons (in eV, 1 decimal; $hc = 1240$ eV nm).`, HC / 80 - E1, 0.1, 1,
    r`Photon energy $= \dfrac{1240}{80} = 15.5$ eV. Ionisation takes 13.6 eV. The rest is kinetic energy: $15.5 - 13.6 = 1.9$ eV.`, { unit: 'eV' }),
  mn(3, 'magnetic field at the nucleus', r`An electron in the ground state of hydrogen ($r = 0.529\times10^{-10}$ m, $f = 6.58\times10^{15}$ Hz) acts as a current loop. Find the magnetic field it produces at the nucleus (in T).`, MU * QE * 6.58e15 / (2 * 0.529e-10), [MU * QE * 6.58e15 / (0.529e-10), MU * QE * 6.58e15 / (2 * 0.529e-10) / 2, MU * QE * 6.58e15 / (2 * Math.PI * 0.529e-10)], 'T',
    r`$I = ef = 1.6\times10^{-19}\times6.58\times10^{15} = 1.05\times10^{-3}$ A. Field at the centre of a circular loop: $B = \dfrac{\mu_0I}{2r} = \dfrac{4\pi\times10^{-7}\times1.05\times10^{-3}}{2\times0.529\times10^{-10}} = 12.5$ T.`),
  nat(3, 'orbital magnetic moment', r`Find the magnetic moment due to the orbital motion of the electron in the ground state of hydrogen (in $10^{-24}\ \mathrm{A\,m^2}$, 2 decimals; $e = 1.602\times10^{-19}$ C, $f = 6.58\times10^{15}$ Hz, $r = 0.529\times10^{-10}$ m).`, QE * 6.58e15 * Math.PI * 0.529e-10 ** 2 * 1e24 * 1e20 / 1e20, 0.1, 2,
    r`$\mu = IA = (ef)\pi r^2 = 1.054\times10^{-3}\times\pi\times(0.529\times10^{-10})^2 = 9.27\times10^{-24}\ \mathrm{A\,m^2}$. This is the Bohr magneton $\dfrac{eh}{4\pi m}$.`, { unit: '×10⁻²⁴ A m²' }),
  mcq(3, 'angular momentum', r`In the Bohr model the angular momentum of the electron in the $n = 3$ orbit of $\mathrm{Li^{2+}}$ is`, r`$\dfrac{3h}{2\pi}$`, [r`$\dfrac{9h}{2\pi}$`, r`$\dfrac{h}{2\pi}$`, r`$\dfrac{h}{6\pi}$`],
    r`$L = \dfrac{nh}{2\pi}$ for any hydrogen-like ion. It depends only on $n$, not on $Z$.`, { trap: 'Angular momentum, orbital magnetic moment and the number of de Broglie wavelengths on the orbit depend on $n$ alone.' }),
  nat(3, 'ionisation', r`Find the longest wavelength of light that can ionise a hydrogen atom in the ground state (in nm, 1 decimal; $hc = 1240$ eV nm).`, HC / E1, 0.3, 1,
    r`Threshold photon energy $= 13.6$ eV, so $\lambda_{max} = \dfrac{1240}{13.6} = 91.2$ nm.`, { unit: 'nm' }),
  nat(3, 'ionisation', r`A hydrogen atom in the $n = 2$ level is to be ionised by light. Find the longest wavelength that works (in nm, nearest whole number; $hc = 1240$ eV nm).`, HC / (E1 / 4), 1, 0,
    r`The binding energy of the $n = 2$ level is $13.6/4 = 3.4$ eV. $\lambda = \dfrac{1240}{3.4} = 365$ nm.`, { unit: 'nm' }),
  nat(3, 'number of lines', r`Electrons of $\mathrm{He^+}$ ions in a gas are excited to $n = 4$. Find the number of different lines that can be emitted.`, 6, 0, 0,
    r`The count depends only on the highest level: $\dfrac{4\times3}{2} = 6$. $Z$ changes the wavelengths, not the number of lines.`),
  nat(3, 'Bohr radius', r`In which orbit of hydrogen is the radius 13.2 Å? Give $n$. ($a_0 = 0.529$ Å)`, Math.round(Math.sqrt(13.2 / A0)), 0, 0,
    r`$r_n = n^2a_0$, so $n^2 = \dfrac{13.2}{0.529} = 25$, $n = 5$.`),
  nat(3, 'orbital speed', r`Find the ratio $v/c$ for the electron in the ground state of $\mathrm{He^+}$ (in units of $10^{-3}$, 1 decimal; $v_1(\mathrm H) = 2.19\times10^6\ \mathrm{m\,s^{-1}}$, $c = 3\times10^8\ \mathrm{m\,s^{-1}}$).`, 2 * 2.19e6 / 3e8 * 1e3, 0.1, 1,
    r`$v = Z\times2.19\times10^6 = 4.38\times10^6\ \mathrm{m\,s^{-1}}$. $v/c = \dfrac{4.38\times10^6}{3\times10^8} = 1.46\times10^{-2} = 14.6\times10^{-3}$. It is $Z/137$. The speed is far below $c$, so a non-relativistic treatment is fine.`),
  mcq(3, 'hydrogen-like ions', r`A transition of $\mathrm{Li^{2+}}$ gives a photon of the same wavelength as the Lyman-alpha line of hydrogen ($2\to1$). It is`, r`$6\to3$`, [r`$3\to2$`, r`$4\to2$`, r`$3\to1$`],
    r`Hydrogen $2\to1$: $\dfrac34R$. For $\mathrm{Li^{2+}}$: $9\left(\dfrac1{n_1^2} - \dfrac1{n_2^2}\right) = \dfrac34$. With $n_1 = 3$, $n_2 = 6$: $9\times\left(\dfrac19 - \dfrac1{36}\right) = 9\times\dfrac{3}{36} = \dfrac34$. ✓. (Levels $3, 6$ of $\mathrm{Li^{2+}}$ match $1, 2$ of H.)`),
  nat(3, 'photoelectric effect and Balmer lines', r`Light from the $n = 3\to2$ transition of hydrogen falls on a metal of work function 1.0 eV. Find the maximum kinetic energy of the photoelectrons (in eV, 2 decimals).`, E1 * (1 / 4 - 1 / 9) - 1.0, 0.02, 2,
    r`Photon energy $= 1.89$ eV. $K_{max} = h\nu - \phi = 1.89 - 1.0 = 0.89$ eV.`, { unit: 'eV', sub: 'mixed: photoelectric effect' }),
  mn(3, 'kinetic energy', r`Find the kinetic energy of the electron in the $n = 3$ orbit of $\mathrm{He^+}$ (in eV).`, E1 * 4 / 9, [E1 * 4 / 3, E1 / 9, -E1 * 4 / 9], 'eV',
    r`$K = -E = \dfrac{13.6Z^2}{n^2} = \dfrac{13.6\times4}{9} = 6.04$ eV. Kinetic energy is positive; total energy is negative.`),
  nat(3, 'Rutherford scattering law', r`The number of alpha particles scattered at an angle $\theta$ is proportional to $1/\sin^4(\theta/2)$. Find the ratio of the number scattered at $60^\circ$ to the number at $120^\circ$.`, Math.pow(Math.sin(Math.PI / 3) / Math.sin(Math.PI / 6), 4), 0, 0,
    r`$N\propto\dfrac1{\sin^4(\theta/2)}$. $\dfrac{N_{60}}{N_{120}} = \left(\dfrac{\sin60^\circ}{\sin30^\circ}\right)^4 = \left(\dfrac{0.866}{0.5}\right)^4 = (\sqrt3)^4 = 9$.`),
  nat(3, 'impact parameter', r`A 5.3 MeV alpha particle is scattered through $90^\circ$ by a gold nucleus ($Z = 79$). Find the impact parameter (in fm, 1 decimal; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm). Use $b = \dfrac{Ze^2}{4\pi\varepsilon_0K}\cot\dfrac\theta2$.`, 79 * 1.44 / 5.3, 0.3, 1,
    r`$b = \dfrac{79\times1.44}{5.3}\cot45^\circ = 21.5\times1 = 21.5$ fm. A closer pass (smaller $b$) bends the alpha more.`, { unit: 'fm' }),
  mcq(3, 'orbital magnetic moment', r`The orbital magnetic moment of the electron in the $n$th Bohr orbit of a hydrogen-like ion of atomic number $Z$ is proportional to`, '$n$', [r`$nZ$`, r`$n^2/Z$`, r`$Z/n$`],
    r`$\mu = \dfrac{eL}{2m} = \dfrac{e}{2m}\cdot\dfrac{nh}{2\pi}$. It is proportional to $n$ and does not depend on $Z$.`),
  nat(3, 'X-ray tube current', r`An X-ray tube carries a current of 20 mA. How many electrons strike the target each second (in $10^{17}$, 2 decimals; $e = 1.602\times10^{-19}$ C)?`, 20e-3 / QE / 1e17, 0.02, 2,
    r`$n = \dfrac Ie = \dfrac{20\times10^{-3}}{1.602\times10^{-19}} = 1.25\times10^{17}$ per second.`, { unit: '×10¹⁷' }),
  nat(3, 'X-ray efficiency', r`An X-ray tube works at 50 kV and 20 mA. Only 0.5% of the electron beam power becomes X-rays; the rest is heat. Find the power that must be removed as heat (in W).`, 50e3 * 20e-3 * 0.995, 0.5, 1,
    r`Beam power $= VI = 50\,000\times0.020 = 1000$ W. Heat $= 99.5\% = 995$ W. This is why targets are cooled (water or rotating anodes).`, { unit: 'W' }),
  nat(3, 'Moseley law', r`The $K_\alpha$ line follows $E = \dfrac34(13.6\ \text{eV})(Z - 1)^2$. Find the wavelength of $K_\alpha$ for molybdenum ($Z = 42$) (in pm, 1 decimal; $hc = 1240$ eV nm).`, HC / (0.75 * E1 * 41 * 41) * 1000, 0.5, 1,
    r`$E = 0.75\times13.6\times41^2 = 17\,146$ eV. $\lambda = \dfrac{1240}{17\,146} = 0.0723$ nm $= 72.3$ pm.`, { unit: 'pm' }),
  nat(3, 'Moseley law', r`The $K_\alpha$ frequency of element X ($Z = 51$) is how many times that of element Y ($Z = 26$)?`, (50 / 25) ** 2, 0, 0,
    r`$\nu\propto(Z-1)^2$. $\dfrac{\nu_X}{\nu_Y} = \left(\dfrac{50}{25}\right)^2 = 4$. Taking $\nu\propto Z^2$ gives $3.84$, which is wrong.`),
  nat(3, 'Moseley law', r`The $K_\alpha$ line of an element has frequency $1.305\times10^{18}$ Hz. Using $\nu = \dfrac34Rc(Z-1)^2$ with $Rc = 3.29\times10^{15}$ Hz, find its atomic number.`, Math.round(1 + Math.sqrt(1.305e18 / (0.75 * 3.29e15))), 0, 0,
    r`$(Z-1)^2 = \dfrac{1.305\times10^{18}}{0.75\times3.29\times10^{15}} = 529$. So $Z - 1 = 23$, $Z = 24$ (chromium).`),
  mcq(3, 'reduced mass', r`Deuterium has a heavier nucleus than hydrogen. Compared with the hydrogen line, the corresponding $H_\alpha$ line of deuterium has`, 'a slightly shorter wavelength', ['a slightly longer wavelength', 'exactly the same wavelength', 'a much longer wavelength (twice)'],
    r`The reduced mass $\mu = \dfrac{mM}{m+M}$ is slightly larger for deuterium. Energies scale with $\mu$, so photon energies are about 0.027% larger and wavelengths shorter by the same fraction (0.18 nm at 656 nm). This is how deuterium was discovered.`),
  nat(3, 'muonic atoms', r`A muon has mass 207 $m_e$. In muonic hydrogen the muon orbits a proton (mass 1836 $m_e$). Find the radius of the first orbit (in fm, nearest whole number; $a_0 = 0.529$ Å $= 52\,900$ fm).`, 52900 / (207 * 1836 / (207 + 1836)), 3, 0,
    r`$r_1\propto\dfrac1\mu$. $\mu = \dfrac{207\times1836}{207 + 1836}m_e = 186.0\,m_e$. $r_1 = \dfrac{52\,900}{186.0} = 284$ fm, about 186 times smaller than in ordinary hydrogen.`, { unit: 'fm' }),
  nat(3, 'muonic atoms', r`For muonic hydrogen ($\mu = 186\,m_e$) find the ionisation energy of the ground state (in keV, 2 decimals).`, 13.6 * 186 / 1000, 0.02, 2,
    r`$E\propto\mu$. $E_1 = 13.6\times186 = 2530$ eV $= 2.53$ keV.`, { unit: 'keV' }),
  mcq(3, 'excitation by photons and electrons', r`A hydrogen atom is in its ground state. Which can excite it to the $n = 2$ level?`, 'An electron of kinetic energy 11 eV', ['A photon of energy 11 eV', 'A photon of energy 10 eV', 'An electron of kinetic energy 10 eV'],
    r`A photon is absorbed whole, so its energy must equal a gap exactly: 10.2 eV (neither 10 nor 11). An electron can leave the atom with the extra energy, so any energy of 10.2 eV or more works. 11 eV works; 10 eV does not.`),
);
items.push(
  // ---------- assertion-reason ----------
  asrt(2, 'limits of Rutherford model', r`Rutherford's nuclear model cannot explain the line spectrum of hydrogen.`, r`In that model the orbiting electron radiates continuously as it spirals inward, which would give a continuous spectrum.`, 0,
    r`Both are true and R is the explanation. An accelerating charge radiates, loses energy and moves to smaller orbits, so the emitted frequency changes steadily: a continuous spread, not sharp lines. Bohr's stationary orbits remove this difficulty.`),
  asrt(3, 'series limit', r`The Lyman series limit has the shortest wavelength of all the lines in the hydrogen spectrum.`, r`The shortest wavelength comes from the electron falling from $n = \infty$ to $n = 1$.`, 0,
    r`$h\nu = 13.6\left(\dfrac1{n_1^2} - \dfrac1{n_2^2}\right)$ is largest when $n_1 = 1$ and $n_2 = \infty$: 13.6 eV, $\lambda = 91.2$ nm. This is the Lyman limit. R states exactly this, so it explains A.`),
  asrt(3, 'alpha scattering', r`In Rutherford's experiment most alpha particles passed through the gold foil undeviated.`, r`The distance of closest approach of a 5 MeV alpha particle to a gold nucleus in a head-on collision is about 45 fm.`, 1,
    r`Both statements are true, but R does not explain A. The straight passage is because the nucleus is tiny (about $10^{-15}$ m) compared with the atom, so most alphas never come near one. R is a separate fact giving an upper limit on the nuclear size.`, { trap: 'Both are true; R is a related fact, not the cause.' }),
  asrt(3, 'excitation by photon', r`A photon of energy 11 eV cannot excite a hydrogen atom in the ground state.`, r`An atom absorbs a photon only if the photon energy equals the gap between two energy levels.`, 0,
    r`Gaps from the ground state: 10.2 eV ($n = 2$), 12.09 eV ($n = 3$), 12.75 eV ($n = 4$)... None is 11 eV, and 11 eV is less than the 13.6 eV needed to ionise. So the photon passes. R gives the reason.`),
  asrt(4, 'hydrogen-like ions', r`The energy needed to ionise a ground-state $\mathrm{He^+}$ ion is four times that for a hydrogen atom.`, r`The ionisation energy of a hydrogen-like ion is proportional to its atomic number $Z$.`, 2,
    r`A is true: $54.4/13.6 = 4$. R is false: the ionisation energy is $13.6Z^2$ eV, proportional to $Z^2$, not $Z$. With $Z = 2$ the factor is 4, not 2.`, { trap: 'The power of Z in energy ($Z^2$) differs from the power in speed ($Z$) and radius ($1/Z$).' }),
  asrt(4, 'hydrogen-like ions', r`In the first orbit, the time period of revolution of the electron in $\mathrm{Li^{2+}}$ is greater than in hydrogen.`, r`In the first orbit the electron's speed is proportional to $Z$, and the orbit radius is inversely proportional to $Z$.`, 3,
    r`R is true: $v\propto Z$, $r\propto1/Z$. Then $T = \dfrac{2\pi r}{v}\propto\dfrac1{Z^2}$. For $Z = 3$ the period is $\dfrac19$ of hydrogen's, which is smaller. So A is false.`),
  asrt(4, 'X-rays', r`Different target materials give different characteristic X-ray lines but the same cut-off wavelength at the same tube voltage.`, r`The cut-off wavelength is set by the voltage across the tube, while characteristic lines come from inner-shell transitions of the target atoms.`, 0,
    r`$\lambda_{min} = hc/eV$ depends only on $V$. Characteristic lines depend on the target's energy levels (Moseley's law). R explains A.`),
  asrt(4, 'muonic atoms', r`The first Bohr orbit of muonic hydrogen is much smaller than that of ordinary hydrogen.`, r`The muon is about 207 times heavier than the electron, and the Bohr radius is inversely proportional to the orbiting mass.`, 0,
    r`$r_1 = \dfrac{4\pi\varepsilon_0\hbar^2}{\mu e^2}\propto\dfrac1\mu$. With $\mu\approx186m_e$ the radius is about $\dfrac1{186}$ of hydrogen's, near 284 fm. R explains A.`),
  asrt(3, 'energy in orbit', r`The kinetic energy of the electron in a Bohr orbit is equal to its total energy.`, r`The total energy of an electron in a stable orbit around the nucleus is negative.`, 3,
    r`A is false: $K = -E$, positive, while $E$ is negative. R is true: bound states have negative total energy. If $K$ were equal to $E$ the electron could not be bound.`, { trap: 'K equals the magnitude of E, not E itself.' }),
);
items.push(
  // ---------- statements ----------
  stm(2, 'energy in orbit', r`In a Bohr orbit the kinetic energy of the electron equals the magnitude of its total energy.`, r`In a Bohr orbit the potential energy is twice the total energy.`, 0,
    r`$K = \dfrac{ke^2}{2r}$, $U = -\dfrac{ke^2}{r}$, $E = K + U = -\dfrac{ke^2}{2r}$. So $K = -E$ and $U = 2E$. Both true.`),
  stm(3, 'spectral series', r`The Balmer series of hydrogen lies in the visible region.`, r`The Paschen series of hydrogen lies in the ultraviolet region.`, 2,
    r`I is true (656 nm to 365 nm; the first four lines are visible). II is false: Paschen lines (1875 nm and below to 820 nm) are infrared. Lyman is the ultraviolet series.`),
  stm(3, 'number of lines', r`Many hydrogen atoms excited to $n = 5$ can together emit 10 different lines.`, r`A single hydrogen atom starting at $n = 5$ can emit at most 4 photons as it falls.`, 0,
    r`I: $\dfrac{5\times4}{2} = 10$ different lines (different atoms follow different routes). II: one atom needs at most 4 steps, $5\to4\to3\to2\to1$, each emitting one photon. Both are true.`),
  stm(4, 'hydrogen-like ions', r`The wavelength of the $2\to1$ line of $\mathrm{He^+}$ is one quarter of that of hydrogen's $2\to1$ line.`, r`The ionisation energy of $\mathrm{He^+}$ in its ground state is 27.2 eV.`, 2,
    r`I: photon energy is $Z^2 = 4$ times larger, so $\lambda$ is one quarter. True. II: the ionisation energy is $4\times13.6 = 54.4$ eV, not 27.2 eV (27.2 eV is $2\times13.6$, the wrong $Z$ power). False.`),
  stm(3, 'excitation', r`A photon of energy 12 eV can excite a ground-state hydrogen atom to $n = 3$.`, r`An electron of kinetic energy 12 eV can excite a ground-state hydrogen atom to $n = 2$.`, 3,
    r`I is false: the gap to $n = 3$ is 12.09 eV, not 12 eV; a photon must match exactly. II is true: 12 eV is at least 10.2 eV, and the electron keeps the leftover energy.`),
  stm(4, 'X-rays', r`Doubling the accelerating voltage of an X-ray tube halves the cut-off wavelength.`, r`Doubling the tube current also halves the cut-off wavelength.`, 2,
    r`I: $\lambda_{min} = hc/eV\propto1/V$, true. II: current changes the number of electrons, so intensity doubles, but the maximum photon energy ($eV$) is unchanged. False.`),
  stm(4, 'Rutherford scattering', r`When the energy of the alpha particles is increased, the distance of closest approach in a head-on collision increases.`, r`At the distance of closest approach in a head-on collision, all the kinetic energy of the alpha particle has become electrical potential energy.`, 3,
    r`$r_0 = \dfrac{2Ze^2}{4\pi\varepsilon_0K}\propto\dfrac1K$, so more energy brings the alpha closer: I is false. II is true by energy conservation (the alpha is momentarily at rest).`),
  cnt(5, 'Bohr model validity', r`Which of the following does the Bohr model of hydrogen get right?`, [r`The energies of the levels of the hydrogen atom.`, r`The ground state having orbital angular momentum $\hbar$ (the true value is zero).`, r`The relative intensities of the spectral lines.`, r`The splitting of lines in a magnetic field and the fine structure.`], 1,
    r`The model predicts energies and the wavelengths of the spectral lines correctly (1), so that statement is right. In the true quantum picture the ground state has $L = 0$, so (2) is wrong; Bohr's rule gives $\hbar$. It says nothing about intensities (3) or fine structure and Zeeman splitting (4). Only one is correct.`, { trap: 'A good energy formula does not mean the whole picture is right.' }),
  cnt(5, 'X-rays and spectra', r`Which statements are correct?`, [r`The cut-off wavelength of an X-ray tube is independent of the target.`, r`The $K_\alpha$ wavelength of a target is independent of the tube voltage (once above the threshold for K-shell emission).`, r`Characteristic lines appear on top of the continuous spectrum.`, r`The intensity of the continuous spectrum depends on the tube current.`], 4,
    r`All four are true. (1) $\lambda_{min} = hc/eV$. (2) The line comes from the target's levels. (3) The sharp peaks sit on the continuum. (4) More electrons produce more photons.`),
);
items.push(
  // ---------- match ----------
  mat(2, 'n-dependence in Bohr model', 'm1', r`Match each quantity of the electron in the $n$th Bohr orbit of hydrogen with its dependence on $n$.`, 'A-q, B-r, C-s, D-p', ['A-p, B-r, C-s, D-q', 'A-q, B-s, C-r, D-p', 'A-r, B-q, C-s, D-p'],
    r`$r\propto n^2$ (A-q). $v\propto1/n$ (B-r). $|E|\propto1/n^2$ (C-s). $T = 2\pi r/v\propto n^3$ (D-p).`),
  mat(2, 'spectral series', 'm2', r`Match each series of hydrogen with the level on which all its lines end.`, 'A-q, B-s, C-p, D-r', ['A-s, B-q, C-p, D-r', 'A-q, B-p, C-s, D-r', 'A-p, B-s, C-q, D-r'],
    r`Lyman ends at $n = 1$ (q), Balmer at $n = 2$ (s), Paschen at $n = 3$ (p), Pfund at $n = 5$ (r).`),
  mat(3, 'ground state energies', 'm3', r`Match each species with the energy of its ground state.`, 'A-r, B-p, C-s, D-q', ['A-p, B-r, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-s, B-p, C-r, D-q'],
    r`$E_1 = -13.6Z^2$ eV: H ($Z=1$): $-13.6$ (r); $\mathrm{He^+}$: $-54.4$ (p); $\mathrm{Li^{2+}}$: $-122.4$ (s); $\mathrm{Be^{3+}}$: $-217.6$ (q).`),
  mat(3, 'X-ray terms', 'm4', r`Match each X-ray term with its description.`, 'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-p, C-s, D-q', 'A-q, B-p, C-r, D-s'],
    r`Continuous X-rays are bremsstrahlung from slowing electrons (A-r). Characteristic lines belong to the target (B-p). The cut-off wavelength depends on the voltage alone (C-q). Moseley's law links line frequency to atomic number (D-s).`),
  mat(4, 'Rutherford scattering', 'm5', r`Match each item in List I with List II for alpha scattering from a nucleus.`, 'A-s, B-r, C-q, D-p', ['A-r, B-s, C-q, D-p', 'A-s, B-r, C-p, D-q', 'A-q, B-r, C-s, D-p'],
    r`Zero impact parameter: head on, scattered by $180^\circ$ (A-s). Large impact parameter: small deflection (B-r). Closest approach in a head-on collision: $\dfrac{2Ze^2}{4\pi\varepsilon_0K}$ (C-q). Number scattered at angle $\theta$: $\propto1/\sin^4(\theta/2)$ (D-p).`),
);
items.push(
  // ---------- multi ----------
  msq(3, 'Bohr model', r`In the Bohr model of hydrogen, for the electron in the $n$th orbit, which are correct?`, [r`Its kinetic energy is proportional to $1/n^2$.`, r`Its frequency of revolution is proportional to $1/n^2$.`, r`Its angular momentum is proportional to $n$.`, r`Its orbital magnetic moment is proportional to $n$.`], [0, 2, 3],
    r`$K = 13.6/n^2$ eV (correct). Frequency $f = v/2\pi r\propto\dfrac{1/n}{n^2} = 1/n^3$, not $1/n^2$ (wrong). $L = nh/2\pi$ (correct). $\mu = eL/2m\propto n$ (correct).`, { trap: 'Frequency goes as $1/n^3$ because both $v$ and $r$ change.' }),
  msq(4, 'hydrogen-like ions', r`Which statements about the $\mathrm{He^+}$ ion in the Bohr model are correct?`, [r`Its ionisation energy from the ground state is 54.4 eV.`, r`The radius of its first orbit is 0.265 Å.`, r`The speed of its electron in the first orbit is twice that in hydrogen.`, r`Its $2\to1$ line lies in the visible region.`], [0, 1, 2],
    r`$13.6\times4 = 54.4$ eV (correct). $r_1 = 0.529/2 = 0.265$ Å (correct). $v\propto Z$ (correct). The $2\to1$ photon has $40.8$ eV, $\lambda = 30.4$ nm, ultraviolet (wrong).`),
  msq(4, 'X-ray tube', r`In an X-ray tube operated at voltage $V$ and current $I$, which are correct?`, [r`Doubling $V$ halves the cut-off wavelength.`, r`Doubling $I$ doubles the intensity but leaves the cut-off wavelength unchanged.`, r`Replacing the target changes the wavelengths of the characteristic lines.`, r`The cut-off wavelength is greater for a target of larger atomic number.`], [0, 1, 2],
    r`$\lambda_{min} = hc/eV$, so (1) is right, and (2) follows because current only changes the number of electrons. (3) Characteristic lines belong to the target atom. (4) is wrong because $\lambda_{min}$ does not depend on the target.`),
  msq(3, 'alpha scattering', r`Which are correct about the scattering of alpha particles by a thin gold foil?`, [r`Most alpha particles pass nearly undeviated.`, r`A very small fraction are scattered through angles greater than $90^\circ$.`, r`Alpha particles with a larger impact parameter are scattered through a larger angle.`, r`The number scattered at angle $\theta$ is proportional to $1/\sin^4(\theta/2)$.`], [0, 1, 3],
    r`Statements (1), (2) and (4) are the findings of Geiger and Marsden and Rutherford's theory. (3) is wrong: the closer the approach (small impact parameter) the larger the angle.`),
  msq(5, 'positronium', r`Positronium (an electron and a positron orbiting each other) is treated with the Bohr model using the reduced mass. Which are correct?`, [r`The ground-state energy is $-6.8$ eV.`, r`The radius of the first orbit is 1.058 Å.`, r`The $2\to1$ line has a wavelength of about 243 nm.`, r`The ionisation energy is 13.6 eV.`], [0, 1, 2],
    r`$\mu = m/2$, so energies are halved ($-6.8$ eV; $2\to1$ photon $= 5.1$ eV, $\lambda = 1240/5.1 = 243$ nm) and radii doubled ($2\times0.529 = 1.058$ Å). The ionisation energy is 6.8 eV, so (4) is wrong.`),
  msq(5, 'photon recoil', r`A hydrogen atom at rest emits a photon in an electronic transition. Which are correct?`, [r`The atom's recoil momentum equals the photon's momentum.`, r`The photon energy is slightly less than the energy gap between the levels.`, r`A heavier atom recoils with more kinetic energy.`, r`For a 10 eV photon from hydrogen the recoil energy is of the order of $10^{-8}$ eV.`], [0, 1, 3],
    r`Momentum conservation gives (1). The recoil energy $\dfrac{p^2}{2M}$ comes out of the gap, so the photon gets slightly less (2). For the same photon $K = \dfrac{p^2}{2M}$ falls as $M$ rises, so (3) is wrong. For $E_\gamma = 10$ eV: $\dfrac{E^2}{2Mc^2} = \dfrac{100}{2\times9.4\times10^8}\approx5\times10^{-8}$ eV (4).`),
  msq(3, 'spectral series', r`Which statements about the hydrogen spectrum are correct?`, [r`Lines of a series crowd together as the series limit is approached.`, r`The Lyman series contains the line of longest wavelength of the whole spectrum.`, r`The Paschen series is in the infrared.`, r`All Balmer lines end at $n = 2$.`], [0, 2, 3],
    r`(1), (3), (4) are true. (2) is false: the longest wavelengths come from transitions with the smallest gaps, such as $n+1\to n$ for large $n$ (Pfund, Humphreys...). Lyman's longest line is only 121.6 nm.`),
  msq(4, 'Balmer series', r`Which transitions of hydrogen produce visible light (the Balmer series)?`, [r`$3\to2$`, r`$4\to2$`, r`$4\to3$`, r`$2\to1$`], [0, 1],
    r`Visible lines end at $n = 2$: $3\to2$ (656 nm), $4\to2$ (486 nm). $4\to3$ is infrared (1875 nm Paschen is $4\to3$, as the first line) and $2\to1$ is ultraviolet.`),
);
items.push(
  // ---------- Level 4 ----------
  nat(4, 'recoil of the atom', r`A hydrogen atom of mass $1.67\times10^{-27}$ kg, at rest, emits the photon of the $n = 4\to2$ transition. Find its recoil speed (in $\mathrm{m\,s^{-1}}$, 2 decimals; $c = 3\times10^8\ \mathrm{m\,s^{-1}}$, 1 eV $= 1.602\times10^{-19}$ J).`, E1 * (1 / 4 - 1 / 16) * QE / 3e8 / 1.67e-27, 0.02, 2,
    r`Photon energy $= 13.6\left(\dfrac14 - \dfrac1{16}\right) = 2.55$ eV $= 4.085\times10^{-19}$ J. Momentum $p = \dfrac Ec = 1.362\times10^{-27}$ kg m/s. The atom recoils with the same momentum: $v = \dfrac{p}{m} = \dfrac{1.362\times10^{-27}}{1.67\times10^{-27}} = 0.82\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(4, 'time period', r`Find the time period of revolution of the electron in the $n = 2$ orbit of hydrogen (in $10^{-15}$ s, 2 decimals). For $n = 1$: $r_1 = 0.529\times10^{-10}$ m and $v_1 = 2.19\times10^6\ \mathrm{m\,s^{-1}}$.`, 8 * 2 * Math.PI * 0.529e-10 / 2.19e6 * 1e15, 0.02, 2,
    r`$T_1 = \dfrac{2\pi r_1}{v_1} = \dfrac{2\pi\times0.529\times10^{-10}}{2.19\times10^6} = 1.518\times10^{-16}$ s. $T\propto n^3$, so $T_2 = 8T_1 = 1.21\times10^{-15}$ s.`, { unit: '×10⁻¹⁵ s' }),
  nat(4, 'revolutions in a lifetime', r`An electron stays in the $n = 2$ level of hydrogen for about $10^{-8}$ s. How many revolutions does it make in this time (in millions, 1 decimal)? Take the ground-state frequency to be $6.58\times10^{15}$ Hz.`, 6.58e15 / 8 * 1e-8 / 1e6, 0.1, 1,
    r`$f\propto1/n^3$. $f_2 = \dfrac{6.58\times10^{15}}{8} = 8.2\times10^{14}$ Hz. Revolutions $= f_2t = 8.2\times10^{14}\times10^{-8} = 8.2\times10^{6}$, that is 8.2 million. The orbit is a very stable one, a point Bohr's picture treats well.`, { unit: 'million' }),
  nat(4, 'hydrogen-like ions', r`A hydrogen-like ion emits a 91.8 eV photon in the $n = 2\to1$ transition. Find its atomic number $Z$.`, Math.round(Math.sqrt(91.8 / (E1 * 0.75))), 0, 0,
    r`$h\nu = 13.6Z^2\left(1 - \dfrac14\right) = 10.2Z^2$. $Z^2 = \dfrac{91.8}{10.2} = 9$, $Z = 3$ ($\mathrm{Li^{2+}}$).`),
  nat(4, 'excitation and visible lines', r`A hydrogen atom in the ground state absorbs a photon of 12.75 eV. In the following de-excitations, how many different lines in the visible region (Balmer series) can be emitted?`, 2, 0, 0,
    r`$E = -13.6 + 12.75 = -0.85$ eV, which is $n = 4$. Possible lines: $4\to3$ (IR), $4\to2$ (visible), $4\to1$ (UV), $3\to2$ (visible), $3\to1$ (UV), $2\to1$ (UV). The visible ones are $4\to2$ and $3\to2$: 2 lines.`),
  nat(4, 'closest approach and atomic number', r`A 7.68 MeV alpha particle moving straight towards a nucleus comes to rest momentarily 30 fm from it. Find the atomic number of the nucleus (use $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm; ignore recoil).`, Math.round(7.68 * 30 / (2 * 1.44)), 0, 0,
    r`$K = \dfrac{2Z\times1.44}{r_0}$, so $Z = \dfrac{Kr_0}{2\times1.44} = \dfrac{7.68\times30}{2.88} = 80$.`),
  nat(4, 'current in an orbit', r`The current due to the electron in the ground state of hydrogen is 1.054 mA. Find the current due to the electron in the $n = 2$ orbit of $\mathrm{Li^{2+}}$ (in mA, 2 decimals).`, 1.054 * 9 / 8, 0.02, 2,
    r`$I = ef\propto\dfrac{Z^2}{n^3}$ (since $f = \dfrac{v}{2\pi r}\propto\dfrac{Z/n}{n^2/Z}$). Here $\dfrac{Z^2}{n^3} = \dfrac98$, so $I = 1.054\times\dfrac98 = 1.19$ mA.`, { unit: 'mA' }),
  nat(4, 'magnetic field at the nucleus', r`In the $n = 2$ orbit of hydrogen the electron's orbit has radius $2.116\times10^{-10}$ m and current $1.32\times10^{-4}$ A. Find the magnetic field at the nucleus (in T, 3 decimals).`, MU * 1.32e-4 / (2 * 2.116e-10), 0.004, 3,
    r`$B = \dfrac{\mu_0I}{2r} = \dfrac{4\pi\times10^{-7}\times1.32\times10^{-4}}{2\times2.116\times10^{-10}} = 0.392$ T. In general $B\propto\dfrac{Z^3}{n^5}$, so it is $\dfrac{12.5}{32} = 0.39$ T.`, { unit: 'T' }),
  nat(4, 'Moseley law', r`Moseley's law $\sqrt\nu = a(Z - 1)$ for $K_\alpha$ lines has $a^2 = \dfrac34Rc$, with $Rc = 3.29\times10^{15}$ Hz. Find the slope $a$ of a plot of $\sqrt\nu$ against $Z$ (in $10^7\ \mathrm{Hz^{1/2}}$, 2 decimals).`, Math.sqrt(0.75 * 3.29e15) / 1e7, 0.02, 2,
    r`$a = \sqrt{\dfrac34Rc} = \sqrt{0.75\times3.29\times10^{15}} = \sqrt{2.4675\times10^{15}} = 4.97\times10^7\ \mathrm{Hz^{1/2}}$.`, { unit: '×10⁷ Hz½' }),
  nat(4, 'mixed: X-rays and crystal diffraction', r`X-rays from a tube at 12.4 kV, at their cut-off wavelength, strike a crystal with plane spacing 0.20 nm. Find the glancing angle for first-order Bragg reflection (in degrees, 1 decimal; $hc = 1240$ eV nm).`, Math.asin(HC / 12400 / (2 * 0.2)) * 180 / Math.PI, 0.1, 1,
    r`$\lambda_{min} = \dfrac{1240}{12\,400} = 0.100$ nm. Bragg: $2d\sin\theta = \lambda$, so $\sin\theta = \dfrac{0.100}{0.40} = 0.25$, $\theta = 14.5^\circ$.`, { unit: '°', sub: 'mixed: wave optics' }),
  nat(4, 'mixed: photoelectric effect', r`The $n = 4\to2$ line of hydrogen falls on a metal of work function 1.9 eV. Find the stopping potential (in V, 2 decimals).`, E1 * (1 / 4 - 1 / 16) - 1.9, 0.02, 2,
    r`Photon energy $= 2.55$ eV. $eV_0 = h\nu - \phi = 2.55 - 1.9 = 0.65$ eV, so $V_0 = 0.65$ V.`, { unit: 'V', sub: 'mixed: photoelectric effect' }),
  nat(4, 'mixed: electric field in the atom', r`Find the electric field of the proton at the position of the electron in the first Bohr orbit (in $10^{11}\ \mathrm{V\,m^{-1}}$, 2 decimals; $k = 9\times10^9$ N m$^2$ C$^{-2}$, $e = 1.6\times10^{-19}$ C, $r = 0.529\times10^{-10}$ m).`, 9e9 * 1.6e-19 / (0.529e-10) ** 2 / 1e11, 0.02, 2,
    r`$E = \dfrac{ke}{r^2} = \dfrac{9\times10^9\times1.6\times10^{-19}}{(0.529\times10^{-10})^2} = 5.15\times10^{11}\ \mathrm{V\,m^{-1}}$. This enormous field is why atoms are so tightly bound.`, { unit: '×10¹¹ V/m', sub: 'mixed: electrostatics' }),
  mcq(4, 'Rutherford scattering', r`A proton and an alpha particle are fired head on at the same heavy nucleus with the same speed. The ratio of the distances of closest approach, $r_\alpha/r_p$, is`, '1 : 2', ['2 : 1', '1 : 1', '4 : 1'],
    r`$\dfrac12mv^2 = \dfrac{(zZe^2)}{4\pi\varepsilon_0r_0}$, so $r_0 = \dfrac{2zZke^2}{mv^2}$. For the alpha: $z = 2$, $m = 4m_p$: $r_\alpha = \dfrac{2\times2Zke^2}{4m_pv^2} = \dfrac{Zke^2}{m_pv^2}$. For the proton: $r_p = \dfrac{2Zke^2}{m_pv^2}$. Ratio $1 : 2$.`, { trap: 'Same speed is not same energy. Alpha has 4 times the kinetic energy but only 2 times the charge.' }),
  mcq(4, 'hydrogen-like ions', r`The ratio of the radii of the $n = 2$ orbit of $\mathrm{He^+}$ and the $n = 3$ orbit of $\mathrm{Li^{2+}}$ is`, '2 : 3', ['3 : 2', '4 : 9', '9 : 4'],
    r`$r\propto\dfrac{n^2}{Z}$. $\mathrm{He^+}$: $\dfrac42 = 2$. $\mathrm{Li^{2+}}$: $\dfrac93 = 3$. Ratio $2 : 3$.`),
  nat(4, 'Rydberg atoms', r`Find the radius of the $n = 100$ orbit of hydrogen (in $\mu$m, 3 decimals; $a_0 = 0.529$ Å).`, A0 * 1e4 * 1e-4, 0.002, 3,
    r`$r = n^2a_0 = 10\,000\times0.529$ Å $= 5290$ Å. Since 1 Å $= 10^{-4}\ \mu$m, $r = 0.529\ \mu$m. Such huge "Rydberg atoms" are as big as a bacterium.`, { unit: 'μm' }),
);
items.push(
  // ---------- Level 5 ----------
  nat(5, 'closest approach with recoil', r`A 5 MeV alpha particle (mass number 4) approaches an aluminium nucleus ($Z = 13$, mass number 27) head on, and the aluminium nucleus is free to recoil. Find the distance of closest approach (in fm, 2 decimals; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm). Take mass ratios equal to mass numbers.`, 2 * 13 * 1.44 / (5 * 27 / 31), 0.05, 2,
    r`At closest approach the two nuclei move with a common velocity, so the energy available for the electrical potential energy is only the kinetic energy in the centre-of-mass frame: $K_{cm} = K\dfrac{M}{m + M} = 5\times\dfrac{27}{31} = 4.355$ MeV. $r_0 = \dfrac{2Z\times1.44}{K_{cm}} = \dfrac{26\times1.44}{4.355} = 8.60$ fm. (A fixed nucleus would give 7.49 fm.)`, { unit: 'fm', trap: 'With a light target, part of the kinetic energy stays as the motion of the pair.' }),
  nat(5, 'distance of closest approach', r`A 5 MeV alpha particle approaches a gold nucleus ($Z = 79$) with an impact parameter $b = 30$ fm. Treat the nucleus as fixed. Find the distance of closest approach (in fm, 1 decimal; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm).`, (2 * 79 * 1.44 / 5 + Math.sqrt((2 * 79 * 1.44 / 5) ** 2 + 4 * 900)) / 2, 0.3, 1,
    r`Head-on closest approach: $r_0 = \dfrac{2Z\times1.44}{K} = 45.5$ fm. For $b\neq0$, angular momentum ($mvb = mv'r$) and energy ($K = \dfrac12mv'^2 + \dfrac{K r_0}{r}$) give $K = K\dfrac{b^2}{r^2} + \dfrac{Kr_0}{r}$, or $r^2 - r_0r - b^2 = 0$. So $r = \dfrac{r_0 + \sqrt{r_0^2 + 4b^2}}{2} = \dfrac{45.5 + \sqrt{2070 + 3600}}{2} = \dfrac{45.5 + 75.3}{2} = 60.4$ fm.`, { unit: 'fm', trap: 'At closest approach the alpha still has sideways speed, so it does not stop.' }),
  nat(5, 'scattering probability', r`A gold foil of thickness 1 $\mu$m has $5.9\times10^{28}$ atoms per $\mathrm{m^3}$. A 5.3 MeV alpha has impact parameter $b = 21.5$ fm for a $90^\circ$ deflection. The fraction of alphas scattered through $90^\circ$ or more is $n t\pi b^2$. Find it (in units of $10^{-5}$, 2 decimals).`, 5.9e28 * 1e-6 * Math.PI * (21.5e-15) ** 2 / 1e-5, 0.1, 2,
    r`Each nucleus presents a target disc of area $\pi b^2$; alphas hitting it are deflected by $90^\circ$ or more. Fraction $= (nt)\pi b^2 = 5.9\times10^{28}\times10^{-6}\times\pi\times(21.5\times10^{-15})^2 = 8.57\times10^{-5}$. About 1 in 11 700: close to the "1 in 8000" Geiger and Marsden saw.`),
  nat(5, 'reduced mass', r`Using reduced masses, find the difference between the $H_\alpha$ wavelengths of hydrogen (656.3 nm) and deuterium (in pm, nearest whole number). Take $m_e/m_p = 1/1836$ and $m_e/m_d = 1/3671$.`, 656.3 * ((1 + 1 / 1836) / (1 + 1 / 3671) - 1) * 1000, 5, 0,
    r`$E\propto\mu = \dfrac{m_e}{1 + m_e/M}$ and $\lambda\propto\dfrac1\mu\propto1 + \dfrac{m_e}M$. $\dfrac{\lambda_H}{\lambda_D} = \dfrac{1 + 1/1836}{1 + 1/3671} = \dfrac{1.000545}{1.000272} = 1.000272$. $\Delta\lambda = 656.3\times0.000272 = 0.179$ nm $= 179$ pm.`, { unit: 'pm' }),
  nat(5, 'muonic atoms', r`Muonic hydrogen has reduced mass $186\,m_e$. Find the wavelength of its Lyman-alpha line ($n = 2\to1$) (in pm, nearest whole number; $hc = 1240$ eV nm).`, HC / (13.6 * 186 * 0.75) * 1000, 4, 0,
    r`$E_1 = 13.6\times186 = 2530$ eV. $h\nu = 0.75\times2530 = 1897$ eV. $\lambda = \dfrac{1240}{1897} = 0.654$ nm $= 654$ pm: an X-ray, instead of ultraviolet.`, { unit: 'pm' }),
  nat(5, 'recoil energy', r`A hydrogen atom (rest energy 938.8 MeV) at rest emits a 10.2 eV photon. Find the recoil kinetic energy of the atom (in units of $10^{-8}$ eV, 2 decimals). Use $K = \dfrac{E_\gamma^2}{2Mc^2}$.`, 10.2 ** 2 / (2 * 938.8e6) / 1e-8, 0.1, 2,
    r`$p = E_\gamma/c$ and $K = \dfrac{p^2}{2M} = \dfrac{E_\gamma^2}{2Mc^2} = \dfrac{(10.2)^2}{2\times938.8\times10^6} = 5.54\times10^{-8}$ eV. Compare with the 10.2 eV photon: the recoil is negligible (5 parts in $10^9$).`, { unit: '×10⁻⁸ eV' }),
  nat(5, 'de Broglie wave on the orbit', r`In which Bohr orbit of hydrogen is the de Broglie wavelength of the electron equal to 1.66 nm? ($r_1 = 0.0529$ nm.) Give $n$.`, Math.round(1.66 / (2 * Math.PI * 0.0529)), 0, 0,
    r`$2\pi r_n = n\lambda_n$ with $r_n = n^2r_1$: $\lambda_n = 2\pi nr_1 = 0.3324n$ nm. So $n = \dfrac{1.66}{0.3324} = 5$.`),
  nat(5, 'highest-energy photon', r`$\mathrm{He^+}$ ions are in an excited level $n$. The highest-energy photon they can emit has energy 51.0 eV. Find $n$.`, Math.round(1 / Math.sqrt(1 - 51 / 54.4)), 0, 0,
    r`The most energetic photon is for the jump to $n = 1$: $54.4\left(1 - \dfrac1{n^2}\right) = 51.0$, so $\dfrac1{n^2} = 0.0625$, $n = 4$.`),
  nat(5, 'correspondence principle', r`For large $n$ the frequency of the photon in the $n\to n-1$ transition of hydrogen approaches the orbital frequency of the electron. For $n = 100$ find the ratio (photon frequency)/(orbital frequency) (3 decimals).`, 100 * 199 / (2 * 99 * 99), 0.001, 3,
    r`Photon: $\nu = Rc\left(\dfrac1{(n-1)^2} - \dfrac1{n^2}\right)$. Orbit: $f = \dfrac{2Rc}{n^3}$. Ratio $= \dfrac{n^3(2n-1)}{2(n-1)^2n^2} = \dfrac{n(2n-1)}{2(n-1)^2} = \dfrac{100\times199}{2\times9801} = 1.015$. The ratio tends to 1 as $n\to\infty$: Bohr's correspondence principle.`),
  nat(5, 'mixed: magnetic moment per angular momentum', r`For the electron in any Bohr orbit the ratio of orbital magnetic moment to orbital angular momentum is $e/2m$. Evaluate it (in $10^{10}\ \mathrm{C\,kg^{-1}}$, 2 decimals; $e = 1.602\times10^{-19}$ C, $m = 9.11\times10^{-31}$ kg).`, QE / (2 * 9.11e-31) / 1e10, 0.02, 2,
    r`$\mu = IA = \dfrac{ev}{2\pi r}\pi r^2 = \dfrac{evr}{2}$ and $L = mvr$, so $\dfrac\mu L = \dfrac{e}{2m} = \dfrac{1.602\times10^{-19}}{2\times9.11\times10^{-31}} = 8.79\times10^{10}\ \mathrm{C\,kg^{-1}}$. It is the same for every orbit and every ion.`, { unit: '×10¹⁰ C/kg', sub: 'mixed: magnetism' }),
  mcq(5, 'Bohr model', r`A hydrogen-like ion has an electron in the $n = 2$ state with the same orbit radius as the ground state of hydrogen. The ion is`, r`$\mathrm{Be^{3+}}$`, [r`$\mathrm{He^+}$`, r`$\mathrm{Li^{2+}}$`, r`$\mathrm{B^{4+}}$`],
    r`$r = \dfrac{n^2}{Z}a_0$. Equal to $a_0$ needs $\dfrac{4}{Z} = 1$, so $Z = 4$: $\mathrm{Be^{3+}}$. Then its speed is $\dfrac Zn = 2$ times hydrogen's ground-state speed, so it is not the same state in every way.`, { trap: 'Same radius does not mean same energy: $E = -13.6\\times16/4 = -54.4$ eV, four times hydrogen.' }),
);
items.push(
  // ---------- passages ----------
  pas(4, 'Pickering series', 'p1', r`Find the wavelength of the first line of the Pickering series, the $5\to4$ transition of $\mathrm{He^+}$ (in nm, nearest whole number; $R = 1.097\times10^7\ \mathrm{m^{-1}}$).`, 1e9 / (RY * 4 * (1 / 16 - 1 / 25)), 3, 0,
    r`$\dfrac1\lambda = RZ^2\left(\dfrac1{4^2} - \dfrac1{5^2}\right) = 1.097\times10^7\times4\times\dfrac{9}{400} = 9.873\times10^5\ \mathrm{m^{-1}}$. $\lambda = 1.013\times10^{-6}$ m $= 1013$ nm (infrared).`, { unit: 'nm' }),
  pas(4, 'Pickering series', 'p1', r`Find the wavelength of the second line of the series, the $6\to4$ transition (in nm, nearest whole number).`, 1e9 / (RY * 4 * (1 / 16 - 1 / 36)), 2, 0,
    r`$\dfrac1\lambda = 4R\left(\dfrac1{16} - \dfrac1{36}\right) = 4R\times\dfrac{5}{144} = \dfrac{5R}{36}$. This is exactly the hydrogen $H_\alpha$ ($3\to2$) value: $\lambda = \dfrac{36}{5R} = 656$ nm.`, { unit: 'nm' }),
  pasm(4, 'Pickering series', 'p1', r`Why were lines of the Pickering series first mistaken for a new series of hydrogen?`, r`Every second line ($6\to4$, $8\to4$, ...) falls at the same wavelengths as hydrogen's Balmer lines`, [r`$\mathrm{He^+}$ and H have equal Rydberg constants`, r`The Pickering lines all lie in the Balmer region`, r`The $\mathrm{He^+}$ ion has the same radius as hydrogen`],
    r`$\mathrm{He^+}$ levels with even $n$ match hydrogen levels $n/2$ (since $Z^2/n^2 = 1/(n/2)^2$). Transitions $6\to4$, $8\to4$ coincide with $3\to2$, $4\to2$... of hydrogen, while the in-between lines ($5\to4$, $7\to4$) fall at "half-integer" positions that hydrogen cannot produce. Evidence for another element: helium.`),
  pas(3, 'alpha scattering numbers', 'p2', r`Find the distance of closest approach for a head-on collision (in fm, 1 decimal; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm).`, 2 * 79 * 1.44 / 5, 0.3, 1,
    r`$r_0 = \dfrac{2Ze^2/4\pi\varepsilon_0}{K} = \dfrac{2\times79\times1.44}{5} = 45.5$ fm.`, { unit: 'fm' }),
  pas(3, 'alpha scattering numbers', 'p2', r`Find the impact parameter for scattering through $60^\circ$ using $b = \dfrac{Ze^2}{4\pi\varepsilon_0K}\cot\dfrac\theta2$ (in fm, 1 decimal).`, 79 * 1.44 / 5 / Math.tan(Math.PI / 6), 0.3, 1,
    r`$b = \dfrac{79\times1.44}{5}\cot30^\circ = 22.75\times1.732 = 39.4$ fm.`, { unit: 'fm' }),
  pasm(3, 'alpha scattering numbers', 'p2', r`If the alpha energy is doubled to 10 MeV (head-on, fixed nucleus), the distance of closest approach becomes`, '22.8 fm', ['91 fm', '45.5 fm', '64.3 fm'],
    r`$r_0\propto1/K$. Doubling $K$ halves $r_0$: $45.5/2 = 22.8$ fm. The distance does not scale as $1/\sqrt K$ (which gives 64.3 fm).`),
  pas(3, 'an X-ray tube', 'p3', r`Find the minimum wavelength of the X-rays (in pm, 1 decimal; $hc = 1240$ eV nm).`, HC / 60000 * 1000, 0.3, 1,
    r`$\lambda_{min} = \dfrac{hc}{eV} = \dfrac{1240\ \text{eV nm}}{60\,000\ \text{eV}} = 0.02067$ nm $= 20.7$ pm.`, { unit: 'pm' }),
  pas(3, 'an X-ray tube', 'p3', r`Find the number of electrons striking the target each second (in $10^{17}$, 2 decimals; $e = 1.602\times10^{-19}$ C).`, 25e-3 / QE / 1e17, 0.02, 2,
    r`$\dfrac Ie = \dfrac{25\times10^{-3}}{1.602\times10^{-19}} = 1.56\times10^{17}\ \mathrm{s^{-1}}$.`, { unit: '×10¹⁷' }),
  pas(4, 'an X-ray tube', 'p3', r`The copper $K_\alpha$ line follows $E = \dfrac34(13.6\ \text{eV})(Z-1)^2$ ($Z = 29$). Find its wavelength (in pm, 1 decimal).`, HC / (0.75 * E1 * 28 * 28) * 1000, 0.8, 1,
    r`$E = 0.75\times13.6\times784 = 7997$ eV. $\lambda = \dfrac{1240}{7997} = 0.1551$ nm $= 155.1$ pm. This is longer than $\lambda_{min}$ (20.7 pm), and the 60 keV electrons can knock out K-electrons of copper (about 9 keV), so the line appears on the continuum.`, { unit: 'pm' }),
  pas(4, 'Rydberg atoms', 'p4', r`Find the radius of the orbit of the electron in this atom (in $\mu$m, 3 decimals; $a_0 = 0.529$ Å).`, A0 * 50 * 50 * 1e-4, 0.003, 3,
    r`$r = n^2a_0 = 2500\times0.529$ Å $= 1322.5$ Å $= 0.132\ \mu$m.`, { unit: 'μm' }),
  pas(4, 'Rydberg atoms', 'p4', r`Find the binding energy (ionisation energy) of the electron in this state (in meV, 2 decimals).`, E1 / 2500 * 1000, 0.01, 2,
    r`$|E_n| = \dfrac{13.6}{n^2}$ eV $= \dfrac{13.6}{2500} = 5.44\times10^{-3}$ eV $= 5.44$ meV. Even room-temperature collisions ($k_BT\approx25$ meV) would ionise it.`, { unit: 'meV' }),
  pasm(4, 'Rydberg atoms', 'p4', r`Compared with the ground state, the speed of the electron in this state is smaller by a factor of`, '50', ['2500', '125 000', '7'],
    r`$v\propto1/n$. With $n = 50$, $v = \dfrac{2.19\times10^6}{50} = 4.4\times10^4\ \mathrm{m\,s^{-1}}$: 50 times smaller. (2500 would be the factor for the radius, and 125 000 for the period.)`),
);
// ---------- number templates ----------
const ionT = (Z) => ['\\mathrm{H}', '\\mathrm{He^+}', '\\mathrm{Li^{2+}}', '\\mathrm{Be^{3+}}'][Z - 1];
const NA = (x, sig = 3) => { const a = +Number(x).toPrecision(sig); return { answer: a, tol: +(Math.abs(a) * 0.01 + 1e-12).toPrecision(2) }; };
const ok = (v, a, tol) => Math.abs(v - a) <= tol + 1e-9;
const KEV = 13.6; const HEV = 4.1357e-15;
const lines = (n) => n * (n - 1) / 2;
const SERIES = { 1: ['Lyman', 'ultraviolet'], 2: ['Balmer', 'visible'], 3: ['Paschen', 'infrared'], 4: ['Brackett', 'infrared'], 5: ['Pfund', 'infrared'] };
const gens = [
  { id: 'ab-g01', type: 'nat', format: 'numeric', level: 2, exams: exFor(2, 'nat'), sub: 'Bohr radius',
    make(rng) {
      const Z = int(rng, 1, 4); const n = int(rng, 2, 6); const v = int(rng, 0, 2);
      if (v === 0) {
        const r = A0 * n * n / Z;
        return { Z, n, v, ...NA(r), unit: 'Å', q: `Find the radius of the $n = ${n}$ orbit of $${ionT(Z)}$ (in Å; $a_0 = 0.529$ Å).`,
          sol: `$r_n = \\dfrac{n^2}{Z}a_0 = \\dfrac{${n * n}}{${Z}}\\times0.529 = ${S(r, 4)}$ Å.`, trap: 'Radius goes as $n^2/Z$, not $n/Z$.' };
      }
      if (v === 1) {
        const r = +(A0 * n * n / Z).toFixed(3);
        return { Z, n, v, r, answer: n, tol: 0, q: `The radius of an orbit of $${ionT(Z)}$ is ${r} Å. Find the principal quantum number $n$ of that orbit ($a_0 = 0.529$ Å).`,
          sol: `$r = \\dfrac{n^2}{Z}a_0$, so $n^2 = \\dfrac{rZ}{a_0} = \\dfrac{${r}\\times${Z}}{0.529} = ${S(r * Z / A0, 4)}$, giving $n = ${n}$.` };
      }
      const Z2 = int(rng, 1, 4); const n2 = int(rng, 1, 5); const x = (n2 * n2 / Z2) / (n * n / Z);
      return { Z, n, Z2, n2, v, ...NA(x), q: `Find the ratio (radius of the $n = ${n2}$ orbit of $${ionT(Z2)}$) / (radius of the $n = ${n}$ orbit of $${ionT(Z)}$).`,
        sol: `$r\\propto n^2/Z$. Ratio $= \\dfrac{${n2}^2/${Z2}}{${n}^2/${Z}} = \\dfrac{${S(n2 * n2 / Z2, 4)}}{${S(n * n / Z, 4)}} = ${S(x, 4)}$.` };
    },
    verify: (p) => p.v === 0 ? A0 * (p.n / Math.sqrt(p.Z)) ** 2 : p.v === 1 ? Math.round(Math.sqrt(p.r * p.Z / A0)) : (p.n2 ** 2 * p.Z * 1) / (p.Z2 * p.n ** 2) },
  { id: 'ab-g02', type: 'nat', format: 'numeric', level: 2, exams: exFor(2, 'nat'), sub: 'orbital speed',
    make(rng) {
      const Z = int(rng, 1, 4); const n = int(rng, 1, 5); const v = int(rng, 0, 2);
      const sp = 2.188e6 * Z / n;
      if (v === 0) return { Z, n, v, ...NA(sp / 1e6), unit: '×10⁶ m/s', q: `Find the speed of the electron in the $n = ${n}$ orbit of $${ionT(Z)}$ (in $10^6\\ \\mathrm{m\\,s^{-1}}$; speed in the first orbit of hydrogen $= 2.188\\times10^6\\ \\mathrm{m\\,s^{-1}}$).`,
        sol: `$v_n = \\dfrac{Z}{n}v_1 = \\dfrac{${Z}}{${n}}\\times2.188\\times10^6 = ${S(sp, 4)}\\ \\mathrm{m\\,s^{-1}}$, that is $${S(sp / 1e6, 3)}\\times10^6$.` };
      if (v === 1) return { Z, n, v, ...NA(sp / 3e8 * 1e3), unit: '×10⁻³', q: `Find $v/c$ for the electron in the $n = ${n}$ orbit of $${ionT(Z)}$ (in units of $10^{-3}$; $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$; $v_1(\\mathrm H) = 2.188\\times10^6\\ \\mathrm{m\\,s^{-1}}$).`,
        sol: `$v = \\dfrac Zn\\times2.188\\times10^6 = ${S(sp, 4)}\\ \\mathrm{m\\,s^{-1}}$. $\\dfrac vc = ${S(sp / 3e8, 3)} = ${S(sp / 3e8 * 1e3, 3)}\\times10^{-3}$. (It is $\\dfrac{Z}{137n}$.)` };
      const n2 = int(rng, 1, 5); const Z2 = int(rng, 1, 4); const x = (Z2 / n2) / (Z / n);
      return { Z, n, Z2, n2, v, ...NA(x), q: `Find the ratio (speed in the $n = ${n2}$ orbit of $${ionT(Z2)}$) / (speed in the $n = ${n}$ orbit of $${ionT(Z)}$).`,
        sol: `$v\\propto Z/n$. Ratio $= \\dfrac{${Z2}/${n2}}{${Z}/${n}} = ${S(x, 4)}$.` };
    },
    verify: (p) => p.v === 0 ? 2.188 * p.Z / p.n : p.v === 1 ? 2.188e6 * p.Z / p.n / 3e8 * 1e3 : (p.Z2 * p.n) / (p.n2 * p.Z) },
  { id: 'ab-g03', type: 'mcq', format: 'single', level: 2, exams: exFor(2, 'mcq'), sub: 'energy levels',
    make(rng) {
      const Z = int(rng, 1, 4); const n = int(rng, 1, 5); const v = int(rng, 0, 2);
      const E = -KEV * Z * Z / (n * n);
      if (v === 0) { const o = numOpts(rng, E, [-KEV * Z / (n * n), -KEV * Z * Z / n, KEV * Z * Z / (n * n)], 'eV'); return { Z, n, v, val: E, ...o, q: `Find the energy of the electron in the $n = ${n}$ level of $${ionT(Z)}$.`, sol: `$E_n = -13.6\\dfrac{Z^2}{n^2} = -13.6\\times\\dfrac{${Z * Z}}{${n * n}} = ${S(E, 4)}$ eV.`, trap: 'Square both Z and n, and keep the minus sign.' }; }
      if (v === 1) { const I = -E; const o = numOpts(rng, I, [I / Z, I * Z, -I], 'eV'); return { Z, n, v, val: I, ...o, q: `How much energy is needed to remove the electron from the $n = ${n}$ level of $${ionT(Z)}$ (ionisation energy of that level)?`, sol: `Binding energy $= \\dfrac{13.6Z^2}{n^2} = \\dfrac{13.6\\times${Z * Z}}{${n * n}} = ${S(I, 4)}$ eV.` }; }
      const n2 = n + int(rng, 1, 3); const d = KEV * Z * Z * (1 / (n * n) - 1 / (n2 * n2));
      const o = numOpts(rng, d, [KEV * Z * (1 / n - 1 / n2), KEV * Z * Z * (1 / n - 1 / n2), KEV * (1 / (n * n) - 1 / (n2 * n2))], 'eV');
      return { Z, n, n2, v, val: d, ...o, q: `Find the energy needed to excite $${ionT(Z)}$ from $n = ${n}$ to $n = ${n2}$.`, sol: `$\\Delta E = 13.6Z^2\\left(\\dfrac1{${n}^2} - \\dfrac1{${n2}^2}\\right) = 13.6\\times${Z * Z}\\times${S(1 / (n * n) - 1 / (n2 * n2), 4)} = ${S(d, 4)}$ eV.`, trap: 'A common slip: using $1/n$ instead of $1/n^2$, or dropping $Z^2$.' };
    },
    verify: (p) => { const val = p.v === 0 ? -13.6 * p.Z ** 2 / p.n ** 2 : p.v === 1 ? 13.6 * p.Z ** 2 / p.n ** 2 : 13.6 * p.Z ** 2 * (p.n2 ** 2 - p.n ** 2) / (p.n ** 2 * p.n2 ** 2); return Math.abs(val - p.val) < 1e-9 && p.options[p.answer] === fmt(p.val, 3) + ' eV' ? p.answer : -1; } },
  { id: 'ab-g04', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'photon wavelength',
    make(rng) {
      const Z = int(rng, 1, 4); const n1 = int(rng, 1, 3); const n2 = n1 + int(rng, 1, 3); const v = int(rng, 0, 2);
      const dE = KEV * Z * Z * (1 / (n1 * n1) - 1 / (n2 * n2));
      const head = `an electron in $${ionT(Z)}$ falls from $n = ${n2}$ to $n = ${n1}$`;
      if (v === 0) return { Z, n1, n2, v, ...NA(dE), unit: 'eV', q: `Find the energy of the photon emitted when ${head} (in eV).`, sol: `$h\\nu = 13.6Z^2\\left(\\dfrac1{${n1}^2} - \\dfrac1{${n2}^2}\\right) = ${S(dE, 4)}$ eV.` };
      if (v === 1) return { Z, n1, n2, v, ...NA(HC / dE), unit: 'nm', q: `Find the wavelength of the photon emitted when ${head} (in nm; $hc = 1240$ eV nm).`, sol: `$\\Delta E = 13.6\\times${Z * Z}\\times\\left(\\dfrac1{${n1 * n1}} - \\dfrac1{${n2 * n2}}\\right) = ${S(dE, 4)}$ eV. $\\lambda = \\dfrac{1240}{${S(dE, 4)}} = ${S(HC / dE, 4)}$ nm.` };
      return { Z, n1, n2, v, ...NA(dE / HEV / 1e15), unit: '×10¹⁵ Hz', q: `Find the frequency of the photon emitted when ${head} (in $10^{15}$ Hz; $h = 4.136\\times10^{-15}$ eV s).`, sol: `$\\Delta E = ${S(dE, 4)}$ eV. $\\nu = \\dfrac{\\Delta E}{h} = \\dfrac{${S(dE, 4)}}{4.136\\times10^{-15}} = ${S(dE / HEV / 1e15, 4)}\\times10^{15}$ Hz.` };
    },
    verify: (p) => { const e = 13.6 * (p.Z * p.Z / p.n1 ** 2 - p.Z * p.Z / p.n2 ** 2); return p.v === 0 ? e : p.v === 1 ? 1240 / e : e * 1.602e-19 / 6.626e-34 / 1e15; } },
  { id: 'ab-g05', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'Rydberg formula',
    make(rng) {
      const Z = int(rng, 1, 3); const n1 = int(rng, 1, 4); const n2 = n1 + int(rng, 1, 4); const v = int(rng, 0, 1);
      if (v === 0) { const lam = lamNm(Z, n1, n2); const nm = SERIES[n1][0];
        return { Z, n1, n2, v, ...NA(lam), unit: 'nm', q: `Use $R = 1.097\\times10^7\\ \\mathrm{m^{-1}}$ to find the wavelength of the line $n = ${n2}\\to${n1}$ of $${ionT(Z)}$ (in nm).`,
          sol: `$\\dfrac1\\lambda = RZ^2\\left(\\dfrac1{${n1}^2} - \\dfrac1{${n2}^2}\\right) = 1.097\\times10^7\\times${Z * Z}\\times${S(1 / (n1 * n1) - 1 / (n2 * n2), 4)} = ${tx(RY * Z * Z * (1 / (n1 * n1) - 1 / (n2 * n2)), 4)}\\ \\mathrm{m^{-1}}$. $\\lambda = ${S(lam, 4)}$ nm.` }; }
      const m = int(rng, 1, 5); const lim = m * m / (RY * Z * Z) * 1e9;
      return { Z, m, v, ...NA(lim), unit: 'nm', q: `Find the series limit (shortest wavelength) of the series of $${ionT(Z)}$ whose lines all end on $n = ${m}$ (in nm; $R = 1.097\\times10^7\\ \\mathrm{m^{-1}}$).`,
        sol: `For $n_2\\to\\infty$: $\\dfrac1\\lambda = \\dfrac{RZ^2}{${m}^2}$, so $\\lambda = \\dfrac{${m * m}}{1.097\\times10^7\\times${Z * Z}} = ${S(lim, 4)}$ nm.` };
    },
    verify: (p) => p.v === 0 ? 1e9 / (1.097e7 * (p.Z * p.Z / p.n1 ** 2 - p.Z * p.Z / p.n2 ** 2)) : 1e9 / (1.097e7 * (p.Z / p.m) ** 2) },
  { id: 'ab-g06', type: 'nat', format: 'integer', level: 2, exams: exFor(2, 'nat'), sub: 'number of lines',
    make(rng) {
      const n = int(rng, 3, 8); const m = int(rng, 1, Math.min(3, n - 1)); const v = int(rng, 0, 2);
      if (v === 0) return { n, v, answer: lines(n), tol: 0, q: `A large number of hydrogen atoms are excited to the level $n = ${n}$. How many different spectral lines can they emit?`, sol: `$\\dfrac{n(n-1)}{2} = \\dfrac{${n}\\times${n - 1}}{2} = ${lines(n)}$.` };
      if (v === 1) return { n, m, v, answer: n - m, tol: 0, q: `Hydrogen atoms are excited to $n = ${n}$. How many of the emitted lines end on the level $n = ${m}$?`, sol: `A line ends on $n = ${m}$ if it starts at any level from ${m + 1} to ${n}: $${n} - ${m} = ${n - m}$ lines.` };
      return { n, v, answer: n - 1, tol: 0, q: `One hydrogen atom is excited to $n = ${n}$. What is the largest number of photons it can emit as it returns to the ground state (one atom, one route)?`, sol: `The longest route steps down one level at a time: $${n}\\to${n - 1}\\to\\dots\\to1$, that is $${n} - 1 = ${n - 1}$ photons. (The total lines of a large sample is ${lines(n)}, a different question.)`, trap: 'One atom follows one route; many atoms give all the lines.' };
    },
    verify: (p) => p.v === 0 ? p.n * (p.n - 1) / 2 : p.v === 1 ? [...Array(p.n + 1).keys()].filter((x) => x > p.m).length : p.n - 1 },
  { id: 'ab-g07', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'time period and frequency',
    make(rng) {
      const Z = int(rng, 1, 4); const n = int(rng, 1, 4); const v = int(rng, 0, 2);
      const T1 = 2 * Math.PI * 0.529e-10 / 2.188e6; const T = T1 * n ** 3 / Z ** 2;
      if (v === 0) return { Z, n, v, ...NA(T * 1e16), unit: '×10⁻¹⁶ s', q: `Find the time period of revolution of the electron in the $n = ${n}$ orbit of $${ionT(Z)}$ (in $10^{-16}$ s). For hydrogen's first orbit $r = 0.529\\times10^{-10}$ m, $v = 2.188\\times10^6\\ \\mathrm{m\\,s^{-1}}$.`, sol: `$T_1(\\mathrm H) = \\dfrac{2\\pi r_1}{v_1} = ${S(T1 * 1e16, 4)}\\times10^{-16}$ s. $T\\propto\\dfrac{n^3}{Z^2}$: $T = ${S(T1 * 1e16, 4)}\\times\\dfrac{${n ** 3}}{${Z * Z}} = ${S(T * 1e16, 4)}\\times10^{-16}$ s.` };
      if (v === 1) return { Z, n, v, ...NA(1 / T / 1e15), unit: '×10¹⁵ Hz', q: `Find the number of revolutions per second of the electron in the $n = ${n}$ orbit of $${ionT(Z)}$ (in $10^{15}$ Hz). For hydrogen's first orbit $T = 1.518\\times10^{-16}$ s.`, sol: `$f = \\dfrac1T$ and $T\\propto\\dfrac{n^3}{Z^2}$. $f = \\dfrac{1}{1.518\\times10^{-16}}\\times\\dfrac{${Z * Z}}{${n ** 3}} = ${S(1 / T / 1e15, 4)}\\times10^{15}$ Hz.` };
      const t = choose(rng, [1e-9, 1e-8]); const N = t / T;
      return { Z, n, t, v, ...NA(N / 1e6), unit: 'million', q: `An electron stays in the $n = ${n}$ level of $${ionT(Z)}$ for ${t === 1e-9 ? '$10^{-9}$' : '$10^{-8}$'} s. How many revolutions does it make (in millions)? Ground-state period of hydrogen: $1.518\\times10^{-16}$ s.`, sol: `$T = 1.518\\times10^{-16}\\times\\dfrac{${n ** 3}}{${Z * Z}} = ${S(T, 4)}$ s. Revolutions $= t/T = ${S(N / 1e6, 4)}$ million.` };
    },
    verify: (p) => { const T = 2 * Math.PI * (0.529e-10 * p.n ** 2 / p.Z) / (2.188e6 * p.Z / p.n); return p.v === 0 ? T * 1e16 : p.v === 1 ? 1 / T / 1e15 : p.t / T / 1e6; } },
  { id: 'ab-g08', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'current and field at the nucleus',
    make(rng) {
      const Z = int(rng, 1, 3); const n = int(rng, 1, 3); const v = int(rng, 0, 2);
      const f = 6.58e15 * Z * Z / n ** 3; const I = QE * f; const r = A0 * 1e-10 * n * n / Z; const B = MU * I / (2 * r);
      if (v === 0) return { Z, n, v, ...NA(I * 1e3), unit: 'mA', q: `Find the current due to the orbiting electron in the $n = ${n}$ orbit of $${ionT(Z)}$ (in mA). Take the ground-state frequency of hydrogen as $6.58\\times10^{15}$ Hz and $e = 1.602\\times10^{-19}$ C.`, sol: `$f\\propto\\dfrac{Z^2}{n^3}$, so $f = 6.58\\times10^{15}\\times\\dfrac{${Z * Z}}{${n ** 3}} = ${tx(f, 4)}$ Hz. $I = ef = ${S(I * 1e3, 4)}$ mA.` };
      if (v === 1) return { Z, n, v, ...NA(B), unit: 'T', q: `Find the magnetic field produced at the nucleus by the electron in the $n = ${n}$ orbit of $${ionT(Z)}$ (in T). Use $f_1(\\mathrm H) = 6.58\\times10^{15}$ Hz, $a_0 = 0.529\\times10^{-10}$ m, $e = 1.602\\times10^{-19}$ C.`, sol: `$I = ef = ${S(I * 1e3, 4)}$ mA, $r = \\dfrac{n^2}{Z}a_0 = ${tx(r, 4)}$ m. $B = \\dfrac{\\mu_0I}{2r} = \\dfrac{4\\pi\\times10^{-7}\\times${tx(I, 4)}}{2\\times${tx(r, 4)}} = ${S(B, 4)}$ T. (It scales as $Z^3/n^5$.)`, trap: 'The field goes as $Z^3/n^5$ because $I\\propto Z^2/n^3$ and $1/r\\propto Z/n^2$.' };
      const mu = I * Math.PI * r * r; return { Z, n, v, ...NA(mu * 1e24), unit: '×10⁻²⁴ A m²', q: `Find the magnetic moment of the orbit of the electron in the $n = ${n}$ orbit of $${ionT(Z)}$ (in $10^{-24}\\ \\mathrm{A\\,m^2}$). Use $f_1(\\mathrm H) = 6.58\\times10^{15}$ Hz, $a_0 = 0.529\\times10^{-10}$ m, $e = 1.602\\times10^{-19}$ C.`, sol: `$I = ${S(I * 1e3, 4)}$ mA, $r = ${tx(r, 4)}$ m. $\\mu = I\\pi r^2 = ${S(mu * 1e24, 4)}\\times10^{-24}\\ \\mathrm{A\\,m^2}$. It scales as $n$ and does not depend on $Z$.` };
    },
    verify: (p) => { const f = 6.58e15 * p.Z ** 2 / p.n ** 3; const r = 0.529e-10 * p.n ** 2 / p.Z; const I = 1.602e-19 * f; return p.v === 0 ? I * 1e3 : p.v === 1 ? 4e-7 * Math.PI * I / (2 * r) : 1.602e-19 * (f * Math.PI * r * r) * 1e24; } },
  { id: 'ab-g09', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'recoil of the atom',
    make(rng) {
      const n1 = int(rng, 1, 2); const n2 = n1 + int(rng, 1, 3); const v = int(rng, 0, 2);
      const dE = KEV * (1 / (n1 * n1) - 1 / (n2 * n2)); const p = dE * 1.602e-19 / 3e8; const M = 1.67e-27;
      const head = `A hydrogen atom of mass $1.67\\times10^{-27}$ kg at rest emits the photon of the transition $n = ${n2}\\to${n1}$`;
      if (v === 0) return { n1, n2, v, ...NA(p / M), unit: 'm/s', q: `${head}. Find its recoil speed (in $\\mathrm{m\\,s^{-1}}$; $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$, 1 eV $= 1.602\\times10^{-19}$ J).`, sol: `$\\Delta E = ${S(dE, 4)}$ eV. Photon momentum $= \\dfrac{\\Delta E}{c} = ${tx(p, 4)}$ kg m/s. The atom has the same momentum: $v = \\dfrac pM = ${S(p / M, 4)}\\ \\mathrm{m\\,s^{-1}}$.` };
      if (v === 1) return { n1, n2, v, ...NA(p * 1e27), unit: '×10⁻²⁷ kg m/s', q: `${head}. Find the momentum of the atom after emission (in $10^{-27}$ kg m/s; $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$, 1 eV $= 1.602\\times10^{-19}$ J).`, sol: `Momentum conservation: $p_{atom} = p_{photon} = \\dfrac{h\\nu}{c} = \\dfrac{${S(dE, 4)}\\times1.602\\times10^{-19}}{3\\times10^8} = ${S(p * 1e27, 4)}\\times10^{-27}$ kg m/s.` };
      const K = p * p / (2 * M) / 1.602e-19 / 1e-8; return { n1, n2, v, ...NA(K), unit: '×10⁻⁸ eV', q: `${head}. Find the recoil kinetic energy of the atom (in $10^{-8}$ eV; $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$, 1 eV $= 1.602\\times10^{-19}$ J).`, sol: `$p = ${tx(p, 4)}$ kg m/s. $K = \\dfrac{p^2}{2M} = \\dfrac{(${tx(p, 4)})^2}{2\\times1.67\\times10^{-27}} = ${S(K * 1e-8 * 1.602e-19, 4)}$ J $= ${S(K, 4)}\\times10^{-8}$ eV.` };
    },
    verify: (q) => { const E = 13.6 * (1 / q.n1 ** 2 - 1 / q.n2 ** 2) * 1.602e-19; const pp = E / 3e8; return q.v === 0 ? pp / 1.67e-27 : q.v === 1 ? pp * 1e27 : (E / 3e8) ** 2 / (2 * 1.67e-27) / 1.602e-19 / 1e-8; } },
  { id: 'ab-g10', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'distance of closest approach',
    make(rng) {
      const Z = choose(rng, [13, 29, 47, 79, 82]); const K = choose(rng, [4.5, 5, 5.5, 6, 7.7, 8]); const v = int(rng, 0, 3);
      const nm = { 13: 'aluminium', 29: 'copper', 47: 'silver', 79: 'gold', 82: 'lead' }[Z];
      if (v === 0) { const r0 = 2 * Z * 1.44 / K; return { Z, K, v, ...NA(r0), unit: 'fm', q: `A ${K} MeV alpha particle is fired directly at a ${nm} nucleus ($Z = ${Z}$), which is held fixed. Find the distance of closest approach (in fm; $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm).`, sol: `At closest approach $K = \\dfrac{(2e)(Ze)}{4\\pi\\varepsilon_0r_0}$, so $r_0 = \\dfrac{2Z\\times1.44}{K} = \\dfrac{2\\times${Z}\\times1.44}{${K}} = ${S(r0, 4)}$ fm.` }; }
      if (v === 1) { const r0 = Z * 1.44 / K; return { Z, K, v, ...NA(r0), unit: 'fm', q: `A ${K} MeV proton is fired directly at a ${nm} nucleus ($Z = ${Z}$), held fixed. Find the distance of closest approach (in fm; $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm).`, sol: `$r_0 = \\dfrac{(e)(Ze)}{4\\pi\\varepsilon_0K} = \\dfrac{${Z}\\times1.44}{${K}} = ${S(r0, 4)}$ fm. (A proton has half the charge of an alpha, so it gets twice as close.)` }; }
      if (v === 2) { const r0 = choose(rng, [20, 25, 30, 40, 50]); const E = 2 * Z * 1.44 / r0; return { Z, r0, v, ...NA(E), unit: 'MeV', q: `What kinetic energy must an alpha particle have to come within ${r0} fm of a ${nm} nucleus ($Z = ${Z}$) in a head-on collision (in MeV; $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm; nucleus fixed)?`, sol: `$K = \\dfrac{2Z\\times1.44}{r_0} = \\dfrac{2\\times${Z}\\times1.44}{${r0}} = ${S(E, 4)}$ MeV.` }; }
      const r0 = choose(rng, [20, 25, 30, 40]); const Zt = Math.round(K * r0 / (2 * 1.44)); const Kx = +(2 * Zt * 1.44 / r0).toFixed(2);
      return { Zt, Kx, r0, v, answer: Zt, tol: 0, q: `A ${Kx} MeV alpha particle moving directly at a nucleus stops momentarily ${r0} fm from it. Find the atomic number of the nucleus ($e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm; nucleus fixed).`, sol: `$Z = \\dfrac{Kr_0}{2\\times1.44} = \\dfrac{${Kx}\\times${r0}}{2.88} = ${S(Kx * r0 / 2.88, 4)}\\approx${Zt}$.` };
    },
    verify: (p) => p.v === 0 ? 2 * p.Z * 1.44 / p.K : p.v === 1 ? p.Z * 1.44 / p.K : p.v === 2 ? 2 * p.Z * 1.44 / p.r0 : Math.round(p.Kx * p.r0 / 2.88) },
  { id: 'ab-g11', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'impact parameter',
    make(rng) {
      const Z = choose(rng, [29, 47, 79]); const K = choose(rng, [4, 5, 6, 7]); const th = choose(rng, [30, 60, 90, 120, 150]); const v = int(rng, 0, 2);
      const A = Z * 1.44 / K; const b = A / Math.tan(th * Math.PI / 360);
      if (v === 0) return { Z, K, th, v, ...NA(b), unit: 'fm', q: `An alpha particle of ${K} MeV is scattered through $${th}^\\circ$ by a nucleus of $Z = ${Z}$. Find its impact parameter using $b = \\dfrac{Ze^2}{4\\pi\\varepsilon_0K}\\cot\\dfrac\\theta2$ (in fm; $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm).`, sol: `$b = \\dfrac{${Z}\\times1.44}{${K}}\\cot${th / 2}^\\circ = ${S(A, 4)}\\times${S(1 / Math.tan(th * Math.PI / 360), 4)} = ${S(b, 4)}$ fm.` };
      if (v === 1) { const bb = +b.toFixed(1); const ang = 2 * Math.atan(A / bb) * 180 / Math.PI; return { Z, K, bb, v, ...NA(ang), unit: '°', q: `An alpha particle of ${K} MeV passes a nucleus of $Z = ${Z}$ with impact parameter ${bb} fm. Find the scattering angle (in degrees; $b = \\dfrac{Ze^2}{4\\pi\\varepsilon_0K}\\cot\\dfrac\\theta2$, $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm).`, sol: `$\\cot\\dfrac\\theta2 = \\dfrac{b}{Ze^2/4\\pi\\varepsilon_0K} = \\dfrac{${bb}}{${S(A, 4)}}$, so $\\dfrac\\theta2 = \\tan^{-1}\\left(\\dfrac{${S(A, 4)}}{${bb}}\\right)$ and $\\theta = ${S(ang, 4)}^\\circ$.` }; }
      const th2 = choose(rng, [30, 60, 90, 120, 150].filter((x) => x !== th)); const ratio = (Math.sin(th * Math.PI / 360) / Math.sin(th2 * Math.PI / 360)) ** 4;
      return { th, th2, v, ...NA(ratio), q: `In an alpha-scattering experiment the number scattered at $${th2}^\\circ$ is $N_2$ and at $${th}^\\circ$ is $N_1$. Find $N_2/N_1$ (using $N\\propto1/\\sin^4(\\theta/2)$).`, sol: `$\\dfrac{N_2}{N_1} = \\left(\\dfrac{\\sin(${th}^\\circ/2)}{\\sin(${th2}^\\circ/2)}\\right)^4 = \\left(\\dfrac{${S(Math.sin(th * Math.PI / 360), 4)}}{${S(Math.sin(th2 * Math.PI / 360), 4)}}\\right)^4 = ${S(ratio, 4)}$.` };
    },
    verify: (p) => { const toRad = Math.PI / 180; if (p.v === 0) return p.Z * 1.44 / p.K * Math.cos(p.th * toRad / 2) / Math.sin(p.th * toRad / 2); if (p.v === 1) return 2 * Math.atan2(p.Z * 1.44 / p.K, p.bb) / toRad; return Math.pow(Math.sin(p.th * toRad / 2), 4) / Math.pow(Math.sin(p.th2 * toRad / 2), 4); } },
  { id: 'ab-g12', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'Moseley law',
    make(rng) {
      const Z = choose(rng, [20, 24, 26, 29, 42, 47, 74]); const v = int(rng, 0, 2);
      const E = 0.75 * KEV * (Z - 1) ** 2;
      if (v === 0) return { Z, v, ...NA(E / 1000), unit: 'keV', q: `Using $E_{K_\\alpha} = \\dfrac34(13.6\\ \\text{eV})(Z-1)^2$, find the $K_\\alpha$ photon energy for the element with $Z = ${Z}$ (in keV).`, sol: `$E = 0.75\\times13.6\\times${Z - 1}^2 = ${S(E, 5)}$ eV $= ${S(E / 1000, 4)}$ keV.`, trap: 'Use $(Z - 1)$, not $Z$.' };
      if (v === 1) return { Z, v, ...NA(HC / E * 1000), unit: 'pm', q: `Find the $K_\\alpha$ wavelength of the element with $Z = ${Z}$ (in pm; $E = \\dfrac34(13.6\\ \\text{eV})(Z-1)^2$, $hc = 1240$ eV nm).`, sol: `$E = 0.75\\times13.6\\times${(Z - 1) ** 2} = ${S(E, 5)}$ eV. $\\lambda = \\dfrac{1240}{${S(E, 5)}}$ nm $= ${S(HC / E * 1000, 4)}$ pm.` };
      const Z2 = choose(rng, [13, 22, 30, 50].filter((z) => z !== Z)); const x = ((Z - 1) / (Z2 - 1)) ** 2;
      return { Z, Z2, v, ...NA(x), q: `Find the ratio of the $K_\\alpha$ frequency of the element with $Z = ${Z}$ to that of the element with $Z = ${Z2}$ (Moseley's law, $\\nu\\propto(Z-1)^2$).`, sol: `$\\dfrac{\\nu_1}{\\nu_2} = \\left(\\dfrac{${Z} - 1}{${Z2} - 1}\\right)^2 = \\left(\\dfrac{${Z - 1}}{${Z2 - 1}}\\right)^2 = ${S(x, 4)}$.` };
    },
    verify: (p) => p.v === 0 ? 0.75 * 13.6 * (p.Z - 1) ** 2 / 1000 : p.v === 1 ? 1240 / (0.75 * 13.6 * (p.Z - 1) ** 2) * 1000 : (p.Z - 1) ** 2 / (p.Z2 - 1) ** 2 },
  { id: 'ab-g13', type: 'nat', format: 'numeric', level: 2, exams: exFor(2, 'nat'), sub: 'X-ray cut-off wavelength',
    make(rng) {
      const V = choose(rng, [10, 15, 20, 25, 30, 40, 50, 60, 80, 100]); const v = int(rng, 0, 3);
      const lam = HC / (V * 1000) * 1000;
      if (v === 0) return { V, v, ...NA(lam), unit: 'pm', q: `An X-ray tube works at ${V} kV. Find the cut-off wavelength (in pm; $hc = 1240$ eV nm).`, sol: `$\\lambda_{min} = \\dfrac{hc}{eV} = \\dfrac{1240}{${V * 1000}}$ nm $= ${S(lam / 1000, 4)}$ nm $= ${S(lam, 4)}$ pm.` };
      if (v === 1) return { V, v, ...NA(V * 1000 * QE / 6.626e-34 / 1e18), unit: '×10¹⁸ Hz', q: `X-rays are produced at ${V} kV. Find the highest frequency in the spectrum (in $10^{18}$ Hz; $e = 1.602\\times10^{-19}$ C, $h = 6.626\\times10^{-34}$ J s).`, sol: `$h\\nu_{max} = eV$. $\\nu_{max} = \\dfrac{1.602\\times10^{-19}\\times${V * 1000}}{6.626\\times10^{-34}} = ${S(V * 1000 * QE / 6.626e-34 / 1e18, 4)}\\times10^{18}$ Hz.` };
      if (v === 2) { const f = choose(rng, [2, 3, 4]); return { V, f, v, ...NA(lam / f), unit: 'pm', q: `The tube voltage is raised from ${V} kV to ${V * f} kV. Find the new cut-off wavelength (in pm; $hc = 1240$ eV nm).`, sol: `$\\lambda_{min}\\propto\\dfrac1V$. At ${V} kV it is ${S(lam, 4)} pm; at ${V * f} kV it is $\\dfrac{${S(lam, 4)}}{${f}} = ${S(lam / f, 4)}$ pm.` }; }
      const Vn = +(HC / lam / 1000).toFixed(2); const lam2 = +(lam).toFixed(1);
      return { V, v, lam2, ...{ answer: V, tol: 0.5 }, unit: 'kV', q: `The cut-off wavelength of an X-ray tube is ${lam2} pm. Find the tube voltage (in kV, nearest whole number; $hc = 1240$ eV nm).`, sol: `$V = \\dfrac{hc}{e\\lambda_{min}} = \\dfrac{1240\\ \\text{eV nm}}{${S(lam2 / 1000, 4)}\\ \\text{nm}\\times e} = ${S(HC / (lam2 / 1000), 5)}$ V $\\approx${V}$ kV.` };
    },
    verify: (p) => p.v === 0 ? 1240 / (p.V * 1000) * 1000 : p.v === 1 ? p.V * 1000 * 1.602e-19 / 6.626e-34 / 1e18 : p.v === 2 ? 1240 / (p.V * p.f * 1000) * 1000 : 1240 / (p.lam2 / 1000) / 1000 },
  { id: 'ab-g14', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'reduced mass',
    make(rng) {
      const v = int(rng, 0, 3);
      if (v === 0) { const n = int(rng, 1, 4); const E = -KEV / 2 / (n * n); return { n, v, ...NA(E), unit: 'eV', q: `Positronium (electron and positron) behaves like hydrogen with reduced mass $m/2$. Find its energy in the $n = ${n}$ level (in eV).`, sol: `$E_n = -\\dfrac{13.6}{n^2}\\times\\dfrac\\mu m = -\\dfrac{13.6}{${n * n}}\\times\\dfrac12 = ${S(E, 4)}$ eV.` }; }
      if (v === 1) { const n = int(rng, 1, 4); const r = 2 * A0 * n * n; return { n, v, ...NA(r), unit: 'Å', q: `Treating positronium with reduced mass $m/2$, find the radius of its $n = ${n}$ orbit (in Å; $a_0 = 0.529$ Å).`, sol: `$r_n\\propto\\dfrac{n^2}{\\mu}$: $r = \\dfrac{n^2a_0}{1/2} = 2\\times${n * n}\\times0.529 = ${S(r, 4)}$ Å.` }; }
      if (v === 2) { const mu = choose(rng, [207, 206.8, 200, 210]); const mp = 1836; const red = mu * mp / (mu + mp); const E = KEV * red / 1000; return { mu, v, ...NA(E), unit: 'keV', q: `A muon of mass ${mu} $m_e$ orbits a proton (1836 $m_e$). Find the ionisation energy of the ground state of this muonic hydrogen (in keV; use the reduced mass).`, sol: `$\\mu = \\dfrac{${mu}\\times1836}{${mu} + 1836}m_e = ${S(red, 4)}\\,m_e$. $E = 13.6\\times${S(red, 4)} = ${S(KEV * red, 4)}$ eV $= ${S(E, 4)}$ keV.` }; }
      const mu = choose(rng, [207, 200, 210]); const red = mu * 1836 / (mu + 1836); const r = A0 * 1e5 / red; return { mu, v, ...NA(r), unit: 'fm', q: `A muon of mass ${mu} $m_e$ orbits a proton (1836 $m_e$). Find the radius of the first orbit (in fm; $a_0 = 52\\,900$ fm; use the reduced mass).`, sol: `$\\mu = ${S(red, 4)}\\,m_e$. $r_1 = \\dfrac{a_0}{${S(red, 4)}} = ${S(r, 4)}$ fm.` };
    },
    verify: (p) => { if (p.v === 0) return -13.6 * 0.5 / p.n ** 2; if (p.v === 1) return 0.529 * p.n ** 2 / 0.5; const red = p.mu * 1836 / (p.mu + 1836); return p.v === 2 ? 13.6 * red / 1000 : 52900 / red; } },
  { id: 'ab-g15', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'ratios of orbit properties',
    make(rng) {
      const Z1 = int(rng, 1, 4); const Z2 = int(rng, 1, 4); const n1 = int(rng, 1, 4); const n2 = int(rng, 1, 4); const k = int(rng, 0, 3);
      const names = ['radius', 'speed', 'magnitude of the total energy', 'time period'];
      const f = [(Z, n) => n * n / Z, (Z, n) => Z / n, (Z, n) => Z * Z / (n * n), (Z, n) => n ** 3 / (Z * Z)];
      const x = f[k](Z2, n2) / f[k](Z1, n1);
      const dep = ['n^2/Z', 'Z/n', 'Z^2/n^2', 'n^3/Z^2'][k];
      return { Z1, Z2, n1, n2, k, ...NA(x), q: `Find the ratio of the ${names[k]} of the electron in the $n = ${n2}$ orbit of $${ionT(Z2)}$ to that in the $n = ${n1}$ orbit of $${ionT(Z1)}$.`, sol: `The ${names[k]} is proportional to $${dep}$. Ratio $= \\dfrac{${S(f[k](Z2, n2), 4)}}{${S(f[k](Z1, n1), 4)}} = ${S(x, 4)}$.`, trap: 'Keep Z and n in the right powers: radius $n^2/Z$, speed $Z/n$, energy $Z^2/n^2$, period $n^3/Z^2$.' };
    },
    verify: (p) => { const a = [p.n2 ** 2 / p.Z2, p.Z2 / p.n2, p.Z2 ** 2 / p.n2 ** 2, p.n2 ** 3 / p.Z2 ** 2][p.k]; const b = [p.n1 ** 2 / p.Z1, p.Z1 / p.n1, p.Z1 ** 2 / p.n1 ** 2, p.n1 ** 3 / p.Z1 ** 2][p.k]; return a / b; } },
  { id: 'ab-g16', type: 'mcq', format: 'single', level: 2, exams: exFor(2, 'mcq'), sub: 'kinetic and potential energy',
    make(rng) {
      const Z = int(rng, 1, 4); const n = int(rng, 1, 4); const v = int(rng, 0, 2);
      const K = KEV * Z * Z / (n * n);
      const nm = ['kinetic energy', 'electric potential energy', 'total energy'][v]; const val = [K, -2 * K, -K][v];
      const wrong = [[-K, 2 * K, K / 2], [-K, 2 * K, K], [K, -2 * K, -K / 2]][v];
      const o = numOpts(rng, val, wrong, 'eV');
      return { Z, n, v, val, ...o, q: `Find the ${nm} of the electron in the $n = ${n}$ orbit of $${ionT(Z)}$.`, sol: `$K = \\dfrac{13.6Z^2}{n^2} = ${S(K, 4)}$ eV. In a Bohr orbit $E = -K$ and $U = -2K$. So the ${nm} is ${S(val, 4)} eV.`, trap: 'K = −E and U = 2E.' };
    },
    verify: (p) => { const K = 13.6 * p.Z * p.Z / p.n / p.n; const val = [K, -2 * K, -K][p.v]; return Math.abs(val - p.val) < 1e-9 && p.options[p.answer] === fmt(p.val, 3) + ' eV' ? p.answer : -1; } },
  { id: 'ab-g17', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'de Broglie waves and angular momentum',
    make(rng) {
      const Z = int(rng, 1, 4); const n = int(rng, 1, 6); const v = int(rng, 0, 2);
      const lam = 2 * Math.PI * (0.0529 * n * n / Z) / n;
      if (v === 0) return { Z, n, v, ...NA(lam), unit: 'nm', q: `Find the de Broglie wavelength of the electron in the $n = ${n}$ orbit of $${ionT(Z)}$ (in nm; $a_0 = 0.0529$ nm).`, sol: `Bohr's rule: $2\\pi r_n = n\\lambda$. $r_n = \\dfrac{n^2}{Z}a_0 = ${S(0.0529 * n * n / Z, 4)}$ nm. $\\lambda = \\dfrac{2\\pi r_n}{n} = ${S(lam, 4)}$ nm.` };
      if (v === 1) return { Z, n, v, ...NA(n * 1.0546), unit: '×10⁻³⁴ J s', q: `Find the angular momentum of the electron in the $n = ${n}$ orbit of $${ionT(Z)}$ (in $10^{-34}$ J s; $h = 6.626\\times10^{-34}$ J s).`, sol: `$L = \\dfrac{nh}{2\\pi} = \\dfrac{${n}\\times6.626\\times10^{-34}}{2\\pi} = ${S(n * 1.0546, 4)}\\times10^{-34}$ J s. It does not depend on $Z$.` };
      const mu = n * 9.274; return { Z, n, v, ...NA(mu), unit: '×10⁻²⁴ A m²', q: `Find the orbital magnetic moment of the electron in the $n = ${n}$ orbit of $${ionT(Z)}$ (in $10^{-24}\\ \\mathrm{A\\,m^2}$; $\\dfrac{eh}{4\\pi m} = 9.274\\times10^{-24}\\ \\mathrm{A\\,m^2}$).`, sol: `$\\mu = \\dfrac{eL}{2m} = n\\dfrac{eh}{4\\pi m} = ${n}\\times9.274\\times10^{-24} = ${S(mu, 4)}\\times10^{-24}\\ \\mathrm{A\\,m^2}$.`, trap: 'Independent of Z.' };
    },
    verify: (p) => p.v === 0 ? 2 * Math.PI * 0.0529 * p.n / p.Z : p.v === 1 ? p.n * 6.626 / (2 * Math.PI) : p.n * 1.602e-19 * 6.626e-34 / (4 * Math.PI * 9.109e-31) * 1e24 },
  { id: 'ab-g18', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'photoelectric effect on an atom',
    make(rng) {
      const Z = int(rng, 1, 3); const n = int(rng, 1, 2); const B = KEV * Z * Z / (n * n); const extra = choose(rng, [1, 2, 3, 5, 8, 10]);
      const lam = HC / (B + extra); const L = +lam.toFixed(1); const KE = HC / L - B; const v = int(rng, 0, 1);
      if (v === 0) return { Z, n, L, v, ...NA(KE), unit: 'eV', q: `Light of wavelength ${L} nm falls on $${ionT(Z)}$ whose electron is in the $n = ${n}$ level. Find the kinetic energy of the ejected electrons (in eV; $hc = 1240$ eV nm).`, sol: `Photon energy $= \\dfrac{1240}{${L}} = ${S(HC / L, 4)}$ eV. Binding energy of the level $= \\dfrac{13.6\\times${Z * Z}}{${n * n}} = ${S(B, 4)}$ eV. $K = ${S(HC / L, 4)} - ${S(B, 4)} = ${S(KE, 3)}$ eV.` };
      const sp = Math.sqrt(2 * KE * QE / 9.109e-31) / 1e6;
      return { Z, n, L, v, ...NA(sp), unit: '×10⁶ m/s', q: `Light of wavelength ${L} nm ionises $${ionT(Z)}$ whose electron is in the $n = ${n}$ level. Find the speed of the ejected electrons (in $10^6\\ \\mathrm{m\\,s^{-1}}$; $hc = 1240$ eV nm, $m_e = 9.109\\times10^{-31}$ kg, $e = 1.602\\times10^{-19}$ C).`, sol: `Photon energy $${S(HC / L, 4)}$ eV minus binding energy $${S(B, 4)}$ eV leaves $K = ${S(KE, 4)}$ eV $= ${tx(KE * QE, 4)}$ J. $v = \\sqrt{\\dfrac{2K}{m}} = ${S(sp, 4)}\\times10^6\\ \\mathrm{m\\,s^{-1}}$.` };
    },
    verify: (p) => { const K = 1240 / p.L - 13.6 * p.Z * p.Z / (p.n * p.n); return p.v === 0 ? K : Math.sqrt(2 * K * 1.602e-19 / 9.109e-31) / 1e6; } },
  { id: 'ab-g19', type: 'nat', format: 'integer', level: 3, exams: exFor(3, 'nat'), sub: 'excitation by electron bombardment',
    make(rng) {
      const KE = choose(rng, [10.5, 11.5, 12.2, 12.5, 12.8, 13.0, 13.1, 13.3]); const v = int(rng, 0, 1);
      let nmax = 1; for (let n = 2; n < 50; n++) if (KEV * (1 - 1 / (n * n)) <= KE + 1e-9) nmax = n;
      if (v === 0) return { KE, v, answer: nmax, tol: 0, q: `Electrons of kinetic energy ${KE} eV bombard hydrogen atoms in the ground state. What is the highest level $n$ that can be excited?`, sol: `Energy needed for level $n$: $13.6\\left(1 - \\dfrac1{n^2}\\right)$. For $n = ${nmax}$: ${S(KEV * (1 - 1 / (nmax * nmax)), 5)} eV $\\le ${KE}$; for $n = ${nmax + 1}$: ${S(KEV * (1 - 1 / ((nmax + 1) ** 2)), 5)} eV $> ${KE}$. So $n = ${nmax}$.` };
      return { KE, v, answer: lines(nmax), tol: 0, q: `Electrons of kinetic energy ${KE} eV bombard hydrogen atoms in the ground state. Find the maximum number of different spectral lines that can then be emitted.`, sol: `The highest level reached: $n = ${nmax}$ (since $13.6(1 - 1/n^2)$ reaches ${S(KEV * (1 - 1 / (nmax * nmax)), 5)} eV, which is $\\le${KE}$, but the next level needs ${S(KEV * (1 - 1 / ((nmax + 1) ** 2)), 5)} eV). Lines: $\\dfrac{${nmax}\\times${nmax - 1}}{2} = ${lines(nmax)}$.`, trap: 'An electron needs only enough energy; it need not match a gap.' };
    },
    verify: (p) => { let m = 1; for (let n = 2; n < 100; n++) if (13.6 - 13.6 / (n * n) <= p.KE + 1e-9) m = n; return p.v === 0 ? m : m * (m - 1) / 2; } },
  { id: 'ab-g20', type: 'nat', format: 'integer', level: 3, exams: exFor(3, 'nat'), sub: 'matching spectral lines',
    make(rng) {
      const Z = int(rng, 2, 4); const a = int(rng, 1, 3); const b = a + int(rng, 1, 3); const v = int(rng, 0, 1);
      return { Z, a, b, v, answer: v === 0 ? Z * b : Z * a, tol: 0, q: `A transition of $${ionT(Z)}$ gives a photon of the same wavelength as the hydrogen transition $n = ${b}\\to${a}$. ${v === 0 ? 'Find the higher level' : 'Find the lower level'} of the ion transition.`,
        sol: `For the ion $\\dfrac1\\lambda = RZ^2\\left(\\dfrac1{n_1^2} - \\dfrac1{n_2^2}\\right)$. This equals hydrogen's $R\\left(\\dfrac1{${a}^2} - \\dfrac1{${b}^2}\\right)$ when $n_1 = ${Z}\\times${a} = ${Z * a}$ and $n_2 = ${Z}\\times${b} = ${Z * b}$ (check: $\\dfrac{${Z * Z}}{${(Z * a) ** 2}} = \\dfrac1{${a * a}}$). So the ${v === 0 ? 'higher' : 'lower'} level is ${v === 0 ? Z * b : Z * a}.`, trap: 'Multiply both levels by Z.' };
    },
    verify: (p) => { for (let n1 = 1; n1 < 30; n1++) for (let n2 = n1 + 1; n2 < 40; n2++) if (Math.abs(p.Z * p.Z * (1 / n1 ** 2 - 1 / n2 ** 2) - (1 / p.a ** 2 - 1 / p.b ** 2)) < 1e-12) return p.v === 0 ? n2 : n1; return -1; } },
  { id: 'ab-g21', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'ionisation wavelength',
    make(rng) {
      const Z = int(rng, 1, 4); const n = int(rng, 1, 4); const v = int(rng, 0, 1);
      const B = KEV * Z * Z / (n * n);
      if (v === 0) return { Z, n, v, ...NA(HC / B), unit: 'nm', q: `Find the longest wavelength of light that can ionise $${ionT(Z)}$ from the $n = ${n}$ level (in nm; $hc = 1240$ eV nm).`, sol: `Binding energy $= \\dfrac{13.6Z^2}{n^2} = ${S(B, 4)}$ eV. $\\lambda_{max} = \\dfrac{1240}{${S(B, 4)}} = ${S(HC / B, 4)}$ nm.` };
      const f = B * QE / 6.626e-34 / 1e15; return { Z, n, v, ...NA(f), unit: '×10¹⁵ Hz', q: `Find the threshold frequency for ionising $${ionT(Z)}$ from the $n = ${n}$ level (in $10^{15}$ Hz; $e = 1.602\\times10^{-19}$ C, $h = 6.626\\times10^{-34}$ J s).`, sol: `$h\\nu_0 = ${S(B, 4)}$ eV. $\\nu_0 = \\dfrac{${S(B, 4)}\\times1.602\\times10^{-19}}{6.626\\times10^{-34}} = ${S(f, 4)}\\times10^{15}$ Hz.` };
    },
    verify: (p) => { const B = 13.6 * p.Z ** 2 / p.n ** 2; return p.v === 0 ? 1240 / B : B * 1.602e-19 / 6.626e-34 / 1e15; } },
  { id: 'ab-g22', type: 'nat', format: 'integer', level: 3, exams: exFor(3, 'nat'), sub: 'scattering counts',
    make(rng) {
      const pairs = [[60, 120, 9], [90, 180, 4], [60, 180, 16], [120, 180, 1.78]]; const [a, b, r] = choose(rng, pairs.slice(0, 3)); const N = choose(rng, [2, 3, 5, 10]);
      const Nb = N; const Na = Nb * r;
      return { a, b, N, answer: Na, tol: 0, q: `Alpha particles scattered by a thin foil are counted at two angles. At $${b}^\\circ$ the count is ${Nb} per minute. How many per minute would be counted at $${a}^\\circ$ (assuming $N\\propto1/\\sin^4(\\theta/2)$ and equal solid angles)?`, sol: `$\\dfrac{N_{${a}}}{N_{${b}}} = \\left(\\dfrac{\\sin(${b}^\\circ/2)}{\\sin(${a}^\\circ/2)}\\right)^4 = \\left(\\dfrac{${S(Math.sin(b * Math.PI / 360), 4)}}{${S(Math.sin(a * Math.PI / 360), 4)}}\\right)^4 = ${r}$. So $N_{${a}} = ${r}\\times${Nb} = ${Na}$ per minute.` };
    },
    verify: (p) => p.N * (Math.sin(p.b * Math.PI / 360) / Math.sin(p.a * Math.PI / 360)) ** 4 },
  { id: 'ab-g23', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'X-ray tube power',
    make(rng) {
      const V = choose(rng, [20, 30, 40, 50, 60, 100]); const I = choose(rng, [10, 20, 25, 40, 50]); const eff = choose(rng, [0.5, 1, 2]); const v = int(rng, 0, 2);
      if (v === 0) return { V, I, v, ...NA(I * 1e-3 / QE / 1e17), unit: '×10¹⁷ /s', q: `An X-ray tube carries ${I} mA. How many electrons strike the target per second (in $10^{17}$; $e = 1.602\\times10^{-19}$ C)?`, sol: `$\\dfrac Ie = \\dfrac{${I}\\times10^{-3}}{1.602\\times10^{-19}} = ${S(I * 1e-3 / QE / 1e17, 4)}\\times10^{17}$ per second.` };
      if (v === 1) return { V, I, v, ...NA(V * I), unit: 'W', q: `An X-ray tube at ${V} kV carries ${I} mA. Find the power of the electron beam (in W).`, sol: `$P = VI = ${V * 1000}\\times${I}\\times10^{-3} = ${V * I}$ W.` };
      const heat = V * I * (1 - eff / 100); return { V, I, eff, v, ...NA(heat), unit: 'W', q: `An X-ray tube at ${V} kV and ${I} mA turns ${eff}% of the beam power into X-rays; the rest is heat. Find the heat produced per second at the target (in W).`, sol: `Beam power $= ${V * 1000}\\times${I}\\times10^{-3} = ${V * I}$ W. Heat $= ${100 - eff}\\%$ of it $= ${S(heat, 5)}$ W.` };
    },
    verify: (p) => p.v === 0 ? p.I * 1e-3 / 1.602e-19 / 1e17 : p.v === 1 ? p.V * 1e3 * p.I * 1e-3 : p.V * p.I - p.V * p.I * p.eff / 100 },
  { id: 'ab-g24', type: 'mcq', format: 'single', level: 2, exams: exFor(2, 'mcq'), sub: 'spectral series',
    make(rng) {
      const n1 = int(rng, 1, 5); const n2 = n1 + int(rng, 1, 3);
      const [sn, reg] = SERIES[n1]; const names = Object.values(SERIES).map((x) => x[0]); const v = int(rng, 0, 1);
      const o = v === 0 ? shuffleOpts(rng, sn, names.filter((x) => x !== sn).slice(0, 3)) : shuffleOpts(rng, reg, ['ultraviolet', 'visible', 'infrared', 'X-ray', 'microwave'].filter((x) => x !== reg).slice(0, 3));
      return { n1, n2, v, ...o, q: v === 0 ? `The hydrogen transition $n = ${n2}\\to${n1}$ belongs to which series?` : `In which region does the hydrogen transition $n = ${n2}\\to${n1}$ lie?`, sol: `Lines ending on $n = ${n1}$ form the ${sn} series, which lies in the ${reg} region (Lyman: UV; Balmer: visible; Paschen, Brackett, Pfund: infrared).` };
    },
    verify: (p) => { const [sn, reg] = SERIES[p.n1]; return p.options[p.answer] === (p.v === 0 ? sn : reg) ? p.answer : -1; } },
  { id: 'ab-g25', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'stopping potential and Balmer lines',
    make(rng) {
      const n2 = int(rng, 3, 6); const phi = choose(rng, [1.0, 1.5, 1.9, 2.1]); const Ph = KEV * (1 / 4 - 1 / (n2 * n2));
      return { n2, phi, ...NA(Ph - phi, 3), unit: 'V', q: `The Balmer line $n = ${n2}\\to2$ of hydrogen falls on a metal of work function ${phi} eV. Find the stopping potential (in V).`, sol: `Photon energy $= 13.6\\left(\\dfrac14 - \\dfrac1{${n2 * n2}}\\right) = ${S(Ph, 4)}$ eV. $eV_0 = h\\nu - \\phi = ${S(Ph, 4)} - ${phi} = ${S(Ph - phi, 3)}$ eV, so $V_0 = ${S(Ph - phi, 3)}$ V.` };
    },
    verify: (p) => 13.6 * (0.25 - 1 / p.n2 ** 2) - p.phi },
  { id: 'ab-g26', type: 'mcq', format: 'single', level: 4, exams: exFor(4, 'mcq'), sub: 'Rutherford scattering concept',
    make(rng) {
      const v = int(rng, 0, 2); const f = choose(rng, [2, 3, 4]);
      if (v === 0) { const o = shuffleOpts(rng, `1/${f}`, [`${f}`, `1/${f * f}`, `${f * f}`]); return { v, f, ...o, q: `A head-on alpha particle comes to rest at distance $r_0$ from a fixed nucleus. If its kinetic energy is multiplied by ${f}, the distance of closest approach is multiplied by`, sol: `$r_0 = \\dfrac{2Ze^2}{4\\pi\\varepsilon_0K}\\propto\\dfrac1K$, so it becomes $\\dfrac1{${f}}$ of its value.`, trap: 'It is $1/K$, not $1/\\sqrt K$.' }; }
      if (v === 1) { const o = shuffleOpts(rng, `${f}`, [`1/${f}`, `${f * f}`, `1/${f * f}`]); return { v, f, ...o, q: `The same alpha particle is fired head on at nuclei of atomic number $Z$ and $${f}Z$. The ratio of the distances of closest approach, $r_{${f}Z}/r_Z$, is`, sol: `$r_0\\propto Z$. Ratio $= ${f}$.` }; }
      const o = shuffleOpts(rng, `${f}`, [`1/${f}`, `${f * f}`, '1']);
      return { v, f, ...o, q: `A thin foil is replaced by one of the same material and ${f} times the thickness. The number of alpha particles scattered through a given angle (other things equal) is multiplied by`, sol: `The number scattered is proportional to the number of nuclei the beam meets, which is proportional to the thickness (for foils thin enough that an alpha is scattered at most once). It is multiplied by ${f}.`, trap: 'Not squared: each nucleus scatters independently.' };
    },
    verify: (p) => { const want = p.v === 0 ? `1/${p.f}` : `${p.f}`; return p.options[p.answer] === want ? p.answer : -1; } },
];
const groups = {
  m1: { title: 'Dependence on n', list1: ['A. Orbit radius', 'B. Orbital speed', 'C. Magnitude of total energy', 'D. Time period of revolution'], list2: [r`p. $\propto n^3$`, r`q. $\propto n^2$`, r`r. $\propto 1/n$`, r`s. $\propto 1/n^2$`] },
  m2: { title: 'Series of hydrogen', list1: ['A. Lyman', 'B. Balmer', 'C. Paschen', 'D. Pfund'], list2: ['p. ends at $n = 3$', 'q. ends at $n = 1$', 'r. ends at $n = 5$', 's. ends at $n = 2$'] },
  m3: { title: 'Ground-state energies', list1: ['A. $\\mathrm{H}$', 'B. $\\mathrm{He^+}$', 'C. $\\mathrm{Li^{2+}}$', 'D. $\\mathrm{Be^{3+}}$'], list2: ['p. $-54.4$ eV', 'q. $-217.6$ eV', 'r. $-13.6$ eV', 's. $-122.4$ eV'] },
  m4: { title: 'X-ray terms', list1: ['A. Continuous X-rays', 'B. Characteristic X-rays', 'C. Minimum wavelength', 'D. Moseley\'s law'], list2: ['p. Depend on the target material', 'q. Depends on tube voltage only', 'r. Bremsstrahlung', 's. Relates line frequency to atomic number'] },
  m5: { title: 'Alpha scattering', list1: ['A. Impact parameter zero', 'B. Large impact parameter', 'C. Head-on closest approach', 'D. Number scattered at angle $\\theta$'], list2: [r`p. $\propto1/\sin^4(\theta/2)$`, r`q. $\dfrac{2Ze^2}{4\pi\varepsilon_0K}$`, 'r. Small deflection', 's. Scattered through $180^\\circ$'] },
  p1: { title: 'The Pickering series', passage: r`<p>In 1896 Pickering found a series of lines in the spectrum of a star, apparently like the Balmer series but with extra lines between the Balmer lines. Bohr showed they belong to singly ionised helium, $\mathrm{He^+}$ ($Z = 2$), for transitions ending at $n = 4$. Use $R = 1.097\times10^7\ \mathrm{m^{-1}}$.</p>` },
  p2: { title: 'Alpha particles on gold', passage: r`<p>Alpha particles of kinetic energy 5.0 MeV strike a thin gold foil ($Z = 79$). Use $\dfrac{e^2}{4\pi\varepsilon_0} = 1.44$ MeV fm and treat the gold nucleus as fixed.</p>` },
  p3: { title: 'A copper-target X-ray tube', passage: r`<p>An X-ray tube has a copper target ($Z = 29$) and runs at 60 kV with a tube current of 25 mA. Use $hc = 1240$ eV nm and $e = 1.602\times10^{-19}$ C.</p>` },
  p4: { title: 'A Rydberg atom', passage: r`<p>In a "Rydberg atom" a hydrogen electron is excited to a very high level, here $n = 50$. Treat it with the Bohr model. Take $a_0 = 0.529$ Å, $E_1 = -13.6$ eV and $v_1 = 2.19\times10^6\ \mathrm{m\,s^{-1}}$.</p>` },
};

// ---------- Expansion (2026-11-22): more hard items, matches, passages and templates ----------
const xs = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const XCUET = true;
const xex = (l, t) => (l <= 2 ? ['keam', 'cusat', 'comedk', 'jee-main', 'neet'] : l === 3 ? ['jee-main', 'neet', 'keam', 'comedk'] : l === 4 ? ['jee-main', 'jee-adv'] : ['jee-adv']).concat(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : []);
let xk = 0; let xc = 0;
const xid = () => `ab-x${String(++xk).padStart(3, '0')}`;
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
const XHC = 1240; const XE1 = 13.6; const XA0 = 0.529; const XR = 1.097e7; const XPI = Math.PI;

const xgroups = {
  ma1: { title: 'Series limits of hydrogen ($1/\\lambda = R/n^2$ at the limit)',
    list1: ['A. Lyman series limit', 'B. Balmer series limit', 'C. Paschen series limit', 'D. Brackett series limit'],
    list2: ['p. 91 nm', 'q. 365 nm', 'r. 820 nm', 's. 1458 nm', 't. 656 nm'] },
  ma2: { title: 'Energy needed to take hydrogen from its ground state',
    list1: ['A. To the level $n = 2$', 'B. To the level $n = 3$', 'C. To the level $n = 4$', 'D. To remove the electron completely'],
    list2: ['p. 10.2 eV', 'q. 12.1 eV', 'r. 12.75 eV', 's. 13.6 eV', 't. 3.4 eV'] },
  ma3: { title: 'Rutherford scattering counts, $N(\\theta)\\propto1/\\sin^4(\\theta/2)$',
    list1: ['A. $N(60^\\circ)/N(180^\\circ)$', 'B. $N(90^\\circ)/N(180^\\circ)$', 'C. $N(120^\\circ)/N(180^\\circ)$', 'D. $N(180^\\circ)/N(180^\\circ)$'],
    list2: ['p. 16', 'q. 4', r`r. $\dfrac{16}{9}$`, 's. 1'] },
  ma4: { title: 'Photon energy for $n = 2\\to1$ in hydrogen-like ions',
    list1: ['A. $\\mathrm{H}$', 'B. $\\mathrm{He^+}$', 'C. $\\mathrm{Li^{2+}}$', 'D. $\\mathrm{Be^{3+}}$'],
    list2: ['p. 10.2 eV', 'q. 40.8 eV', 'r. 91.8 eV', 's. 163.2 eV', 't. 13.6 eV'] },
  ma5: { title: 'Dependence on $Z$ for the same level $n$ (Bohr model)',
    list1: ['A. Radius of the orbit', 'B. Speed of the electron', 'C. Magnitude of the total energy', 'D. Orbital magnetic moment'],
    list2: [r`p. $\propto1/Z$`, r`q. $\propto Z$`, r`r. $\propto Z^2$`, 's. independent of $Z$'] },
  ma6: { title: 'Wavelengths in the hydrogen spectrum ($R = 1.097\\times10^{7}\\ \\mathrm{m^{-1}}$)',
    list1: ['A. $n = 2\\to1$', 'B. $n = 3\\to2$', 'C. $n = 4\\to2$', 'D. $n = 5\\to3$'],
    list2: ['p. 121.6 nm', 'q. 656.3 nm', 'r. 486.1 nm', 's. 1282 nm', 't. 1875 nm'] },
  ma7: { title: 'Same wavelength as the hydrogen line $2\\to1$',
    list1: ['A. $\\mathrm{He^+}$ ($Z = 2$)', 'B. $\\mathrm{Li^{2+}}$ ($Z = 3$)', 'C. $\\mathrm{Be^{3+}}$ ($Z = 4$)', 'D. $\\mathrm{B^{4+}}$ ($Z = 5$)'],
    list2: ['p. $4\\to2$', 'q. $6\\to3$', 'r. $8\\to4$', 's. $10\\to5$'] },
  ma8: { title: 'Atomic models and their difficulties',
    list1: ['A. Thomson model', 'B. Rutherford model', 'C. Bohr model', 'D. de Broglie picture of the orbit'],
    list2: ['p. cannot explain large-angle scattering of alpha particles', 'q. cannot explain the stability of the atom or its line spectra', 'r. cannot explain the spectra of atoms with many electrons', 's. explains the quantisation by a standing wave round the orbit'] },
  pa1: { title: 'Electrons colliding with hydrogen',
    passage: r`<p>A beam of electrons, each of kinetic energy 12.2 eV, passes through hydrogen gas whose atoms are all in the ground state. Assume that the electron can give any energy that raises the atom to an allowed level, and ignore the recoil of the atoms. Take $E_n = -13.6/n^2$ eV and $hc = 1240\ \mathrm{eV\,nm}$.</p>` },
  pa2: { title: 'Alpha particles on a gold foil',
    passage: r`<p>Alpha particles of kinetic energy 6.0 MeV are fired at a thin gold foil ($Z = 79$). Treat the nuclei as fixed point charges. Use $\dfrac{e^2}{4\pi\varepsilon_0} = 1.44\ \mathrm{MeV\,fm}$.</p>` },
};

const xitems = [
  // ---------- Level 2 ----------
  xnat(2, 'spectral series', r`Find the energy of the photon emitted when a hydrogen electron falls from $n = 3$ to $n = 2$ (in eV, 2 decimals).`, XE1 * (1 / 4 - 1 / 9), 0.01, 2,
    r`$\Delta E = 13.6\left(\dfrac1{2^2} - \dfrac1{3^2}\right) = 13.6\times\dfrac{5}{36} = 1.89$ eV. This is the red $\mathrm{H}_\alpha$ line.`, { unit: 'eV' }),
  xmcq(2, 'spectral series', r`Which series of hydrogen has lines in the visible region?`, 'Balmer series', ['Lyman series', 'Paschen series', 'Brackett series'],
    r`Balmer lines end on $n = 2$ and have wavelengths from 656 nm to 365 nm (visible). Lyman is ultraviolet; Paschen and Brackett are infrared.`),
  xnat(2, 'Bohr radius', r`Find the radius of the third Bohr orbit of hydrogen (in Å, 2 decimals; $a_0 = 0.529$ Å).`, 9 * XA0, 0.01, 2,
    r`$r_n = n^2a_0 = 9\times0.529 = 4.76$ Å.`, { unit: 'Å' }),
  xmcq(2, 'alpha scattering', r`In the alpha-scattering experiment most of the alpha particles went almost straight through the gold foil. This showed that`, 'most of the atom is empty space', ['the nucleus is as big as the atom', 'electrons are heavier than alpha particles', 'the positive charge is spread uniformly through the atom'],
    r`Only a very small fraction were deflected through large angles, which means the positive charge and almost all the mass are packed into a tiny nucleus, with empty space around it.`),
  xnat(2, 'number of lines', r`Hydrogen atoms are excited to the level $n = 5$. How many different spectral lines can they emit while returning to the ground state?`, 5 * 4 / 2, 0, 0,
    r`$\dfrac{n(n - 1)}{2} = \dfrac{5\times4}{2} = 10$ lines.`),
  xmcq(2, 'Bohr postulates', r`In the Bohr model the angular momentum of the electron in the $n$-th orbit is`, r`$\dfrac{nh}{2\pi}$`, [r`$\dfrac{h}{2\pi n}$`, r`$nh$`, r`$\dfrac{n^2h}{2\pi}$`],
    r`Bohr's quantum condition: $mv_nr_n = \dfrac{nh}{2\pi}$.`),

  // ---------- Level 3 ----------
  xnat(3, 'series limit', r`Find the ratio (wavelength of the Balmer series limit)/(longest wavelength of the Lyman series).`, 3, 0, 0,
    r`Balmer limit: $\dfrac1\lambda = \dfrac R4$, $\lambda = \dfrac4R$. Lyman longest ($2\to1$): $\dfrac1\lambda = \dfrac{3R}{4}$, $\lambda = \dfrac{4}{3R}$. Ratio $= \dfrac{4/R}{4/3R} = 3$.`),
  xnat(3, 'spectral series', r`Find the wavelength of the photon emitted in the transition $n = 4\to2$ in hydrogen (in nm, nearest integer; $hc = 1240\ \mathrm{eV\,nm}$).`, XHC / (XE1 * (1 / 4 - 1 / 16)), 1, 0,
    r`$E = 13.6\times\dfrac{3}{16} = 2.55$ eV. $\lambda = \dfrac{1240}{2.55} = 486$ nm ($\mathrm{H}_\beta$, blue-green).`, { unit: 'nm' }),
  xnat(3, 'hydrogen-like ions', r`Find the energy of the photon emitted when a $\mathrm{He^+}$ ion falls from $n = 2$ to $n = 1$ (in eV, 1 decimal).`, 4 * XE1 * 0.75, 0.1, 1,
    r`$E = 13.6Z^2\left(1 - \dfrac14\right) = 13.6\times4\times0.75 = 40.8$ eV.`, { unit: 'eV' }),
  xnat(3, 'orbital speed', r`The speed of the electron in the first Bohr orbit of hydrogen is $2.19\times10^{6}\ \mathrm{m\,s^{-1}}$. Find its speed in the second orbit (in units of $10^{6}\ \mathrm{m\,s^{-1}}$, 2 decimals).`, 2.19 / 2, 0.01, 2,
    r`$v_n = \dfrac{v_1}{n}$. For $n = 2$: $2.19/2 = 1.10\times10^{6}\ \mathrm{m\,s^{-1}}$ (1.095 exactly).`, { unit: '×10⁶ m/s' }),
  xnat(3, 'ionisation', r`Find the energy needed to remove the electron from the $n = 3$ level of hydrogen (in eV, 2 decimals).`, XE1 / 9, 0.01, 2,
    r`$E_3 = -\dfrac{13.6}{9} = -1.51$ eV. The ionisation energy from this level is $+1.51$ eV.`, { unit: 'eV' }),
  xnat(3, 'excitation by electrons', r`Electrons of kinetic energy 12.5 eV are passed through hydrogen gas in its ground state. How many different spectral lines can be emitted?`, 3, 0, 0,
    r`The levels reachable by giving up at most 12.5 eV: $n = 2$ (10.2 eV) and $n = 3$ (12.09 eV); $n = 4$ needs 12.75 eV, too much. So atoms reach up to $n = 3$, which gives $3\to2$, $3\to1$ and $2\to1$: 3 lines.`, { trap: 'An electron can give part of its energy; a photon must give exactly the difference.' }),
  xnat(3, 'orbital magnetic moment', r`Find the magnetic moment of the electron in the $n = 2$ orbit of hydrogen (in units of $10^{-23}\ \mathrm{A\,m^2}$, 2 decimals). The Bohr magneton is $9.27\times10^{-24}\ \mathrm{A\,m^2}$.`, 2 * 9.27e-24 / 1e-23, 0.01, 2,
    r`$\mu = \dfrac{e}{2m}L = n\dfrac{e\hbar}{2m} = n\mu_B = 2\times9.27\times10^{-24} = 1.85\times10^{-23}\ \mathrm{A\,m^2}$.`, { unit: '×10⁻²³ A m²' }),
  xnat(3, 'time period', r`Find the period of revolution of the electron in the first Bohr orbit (in units of $10^{-16}$ s, 2 decimals). $r_1 = 0.529$ Å, $v_1 = 2.19\times10^{6}\ \mathrm{m\,s^{-1}}$.`, 2 * XPI * 0.529e-10 / 2.19e6 * 1e16, 0.01, 2,
    r`$T = \dfrac{2\pi r}{v} = \dfrac{2\pi\times0.529\times10^{-10}}{2.19\times10^{6}} = 1.52\times10^{-16}$ s.`, { unit: '×10⁻¹⁶ s' }),
  xnat(3, 'current due to orbiting electron', r`Find the equivalent current of the electron in the first Bohr orbit (in mA, 2 decimals; $T = 1.52\times10^{-16}$ s, $e = 1.6\times10^{-19}$ C).`, 1.6e-19 / 1.52e-16 * 1e3, 0.01, 2,
    r`$I = \dfrac eT = \dfrac{1.6\times10^{-19}}{1.52\times10^{-16}} = 1.05\times10^{-3}$ A $= 1.05$ mA.`, { unit: 'mA' }),
  xnat(3, 'de Broglie and Bohr', r`Find the de Broglie wavelength of the electron in the $n = 3$ orbit of hydrogen (in Å, 2 decimals; $a_0 = 0.529$ Å).`, 2 * XPI * 3 * XA0, 0.02, 2,
    r`$n\lambda = 2\pi r_n$, so $\lambda = \dfrac{2\pi n^2a_0}{n} = 2\pi na_0 = 2\pi\times3\times0.529 = 9.97$ Å, three times the circumference of the first orbit.`, { unit: 'Å' }),
  xnat(3, 'hydrogen-like ions', r`Find the ionisation energy of $\mathrm{Li^{2+}}$ in its ground state (in eV, 1 decimal).`, 9 * XE1, 0.1, 1,
    r`$E = 13.6Z^2 = 13.6\times9 = 122.4$ eV.`, { unit: 'eV' }),
  xnat(3, 'series limit', r`Find the wavelength of the Balmer series limit (in nm, 1 decimal; $R = 1.097\times10^{7}\ \mathrm{m^{-1}}$).`, 4 / XR * 1e9, 0.3, 1,
    r`$\dfrac1\lambda = R\left(\dfrac1{2^2} - \dfrac1{\infty}\right) = \dfrac R4$. $\lambda = \dfrac{4}{1.097\times10^{7}} = 3.646\times10^{-7}$ m $= 364.6$ nm.`, { unit: 'nm' }),
  xnat(3, 'potential energy', r`Find the potential energy of the electron in the second orbit of hydrogen (in eV, 1 decimal).`, -2 * XE1 / 4, 0.05, 1,
    r`$E_2 = -3.4$ eV, $K = +3.4$ eV, and $U = -2K = -6.8$ eV (the total is $U/2$).`, { unit: 'eV', trap: 'The potential energy is twice the total energy, and negative.' }),
  xnat(3, 'spectral series', r`Find the ratio (wavelength of the $\mathrm{H}_\alpha$ line, $3\to2$)/(wavelength of the $\mathrm{H}_\beta$ line, $4\to2$) (2 decimals).`, (1 / 4 - 1 / 16) / (1 / 4 - 1 / 9), 0.01, 2,
    r`$\lambda\propto\dfrac{1}{1/4 - 1/n^2}$. $\dfrac{\lambda_\alpha}{\lambda_\beta} = \dfrac{3/16}{5/36} = \dfrac{108}{80} = 1.35$.`),
  xnat(3, 'spectral series', r`Find the ratio (shortest wavelength of the Lyman series)/(longest wavelength of the Lyman series) (2 decimals).`, 0.75, 0.01, 2,
    r`Shortest ($\infty\to1$): $\dfrac1R$. Longest ($2\to1$): $\dfrac{4}{3R}$. Ratio $= \dfrac{3}{4} = 0.75$.`),
  xnat(3, 'ionisation', r`Hydrogen atoms in their ground state are hit by ultraviolet light of wavelength 90 nm. Find the kinetic energy of the freed electrons (in eV, 2 decimals; $hc = 1240\ \mathrm{eV\,nm}$).`, XHC / 90 - XE1, 0.01, 2,
    r`Photon energy $= \dfrac{1240}{90} = 13.78$ eV. $K = 13.78 - 13.6 = 0.18$ eV.`, { unit: 'eV' }),
  xnat(3, 'Rutherford scattering law', r`The number of alpha particles scattered per second at $60^\circ$ is $N_1$ and at $120^\circ$ is $N_2$. Find $N_1/N_2$.`, Math.sin(Math.PI / 3) ** 4 / Math.sin(Math.PI / 6) ** 4, 0, 0,
    r`$N\propto\dfrac{1}{\sin^4(\theta/2)}$. $\dfrac{N_1}{N_2} = \dfrac{\sin^4(60^\circ)}{\sin^4(30^\circ)} = \dfrac{(\sqrt3/2)^4}{(1/2)^4} = 9$.`, { trap: 'The half angle: θ/2 = 30° and 60°.' }),
  xnat(3, 'number of lines', r`Hydrogen atoms in the level $n = 6$ emit all possible lines. How many of these lines lie in the Balmer series (ending on $n = 2$)?`, 4, 0, 0,
    r`Balmer lines end on $n = 2$: $6\to2$, $5\to2$, $4\to2$, $3\to2$. That is 4 lines.`),
  xnat(3, 'energy levels', r`The smallest photon energy that hydrogen atoms in the level $n = 4$ can emit (in eV, 2 decimals).`, XE1 * (1 / 9 - 1 / 16), 0.01, 2,
    r`The smallest energy gap from $n = 4$ is to the next level, $n = 3$: $13.6\left(\dfrac19 - \dfrac1{16}\right) = 0.66$ eV (infrared).`, { unit: 'eV' }),
  xmt(3, 'series limits', 'ma1', r`Match each series limit of hydrogen with its wavelength.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-t, B-q, C-r, D-s'],
    r`$\lambda_{limit} = \dfrac{n^2}{R}$ with $n = 1, 2, 3, 4$: $91.2$ nm (p), $364.6$ nm (q), $820$ nm (r), $1458$ nm (s). 656 nm is the $\mathrm{H}_\alpha$ line, not a limit.`),
  xmt(3, 'excitation', 'ma2', r`Match each change of a hydrogen atom (from the ground state) with the energy needed.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$13.6\left(1 - \dfrac1{n^2}\right)$: $n = 2$: 10.2 eV (p). $n = 3$: 12.09 eV (q). $n = 4$: 12.75 eV (r). $n = \infty$: 13.6 eV (s).`),
  xmt(3, 'spectral lines', 'ma6', r`Match each transition of hydrogen with its wavelength.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$\dfrac1\lambda = R\left(\dfrac1{n_1^2} - \dfrac1{n_2^2}\right)$. $2\to1$: $\dfrac{4}{3R} = 121.6$ nm (p). $3\to2$: $\dfrac{36}{5R} = 656.3$ nm (q). $4\to2$: $\dfrac1\lambda = \dfrac{3R}{16}$, $\lambda = 486.1$ nm (r). $5\to3$: $\dfrac1\lambda = R\times0.0711$, 1282 nm (s). The 1875 nm (t) line is $4\to3$.`),
  xasrt(3, 'Bohr model', r`The speed of the electron in a Bohr orbit decreases as $n$ increases.`, r`The electron in a higher orbit is farther from the nucleus, where the electric force is weaker, and $v_n\propto1/n$.`, 0,
    r`$v_n = \dfrac{e^2}{2\varepsilon_0nh}\propto\dfrac1n$. R gives the physical reason and the formula. Both are true and R explains A.`),
  xstm(3, 'spectral series', r`The wavelengths of the Lyman series lie in the ultraviolet.`, r`The Lyman series ends on the level $n = 1$, so its lines carry at least 10.2 eV.`, 0,
    r`10.2 eV corresponds to $\dfrac{1240}{10.2} = 121.6$ nm: ultraviolet. Both are true and II explains I.`),
  xmcq(3, 'limits of Rutherford model', r`Which of these is a difficulty of Rutherford's nuclear model that Bohr's model removed?`, 'The orbiting electron should radiate energy and spiral into the nucleus', ['Alpha particles are scattered through large angles', 'The nucleus is much smaller than the atom', 'Most alpha particles pass straight through'],
    r`The other three are observations that the nuclear model explains. The spiralling electron is a prediction that fails: an accelerating charge radiates, so the atom could not be stable. Bohr's stationary orbits avoid it.`),

  // ---------- Level 4 ----------
  xnat(4, 'excitation by collision', r`A neutron (mass nearly equal to that of a hydrogen atom) strikes a hydrogen atom at rest in its ground state and excites it to $n = 2$ in an inelastic collision. Find the smallest kinetic energy of the neutron for this to be possible (in eV, 1 decimal).`, 2 * 10.2, 0.05, 1,
    r`In a head-on collision with equal masses, only the kinetic energy in the centre-of-mass frame can be used, which is half of the neutron's. So $\tfrac12K = 10.2$ eV and $K = 20.4$ eV. An electron, being much lighter, needs only about 10.2 eV.`, { unit: 'eV', trap: 'A heavy projectile wastes energy in the motion of the pair.' }),
  xnat(4, 'hydrogen-like ions', r`A $\mathrm{He^+}$ ion falls from $n = 4$ to $n = 2$. Find the wavelength of the photon (in nm, 1 decimal; $hc = 1240\ \mathrm{eV\,nm}$).`, XHC / (4 * XE1 * (1 / 4 - 1 / 16)), 0.3, 1,
    r`$E = 13.6\times4\times\dfrac{3}{16} = 10.2$ eV, the same as the $\mathrm{H}$ Lyman-alpha line. $\lambda = \dfrac{1240}{10.2} = 121.6$ nm.`, { unit: 'nm', trap: 'Every second line of He+ coincides with a hydrogen line.' }),
  xnat(4, 'hydrogen-like ions', r`A $\mathrm{Li^{2+}}$ ion emits a photon of the same wavelength as the $\mathrm{H}_\alpha$ line ($3\to2$) of hydrogen, in a transition from an upper level $n_2$ to a lower level $n_1 = 6$. Find $n_2$.`, 9, 0, 0,
    r`$\mathrm{H}_\alpha$: $R\left(\dfrac14 - \dfrac19\right) = \dfrac{5R}{36}$. For $Z = 3$: $9R\left(\dfrac1{36} - \dfrac1{n_2^2}\right) = \dfrac{5R}{36}$, so $\dfrac1{n_2^2} = \dfrac1{36} - \dfrac{5}{324} = \dfrac{4}{324}$ and $n_2 = 9$. (The transition is $9\to6$: every line of $\mathrm{Li^{2+}}$ from $3m\to3k$ matches a hydrogen line $m\to k$.)`),
  xnat(4, 'hydrogen-like ions', r`The first line of the Lyman series of a hydrogen-like ion has wavelength 13.5 nm. Find the atomic number $Z$ of the ion.`, Math.sqrt(121.57 / 13.5), 0, 0,
    r`$\lambda\propto\dfrac{1}{Z^2}$. For hydrogen $\lambda = 121.6$ nm. $Z^2 = \dfrac{121.6}{13.5} = 9$, so $Z = 3$ ($\mathrm{Li^{2+}}$).`),
  xnat(4, 'excitation', r`An electron of kinetic energy 12.9 eV collides inelastically with a hydrogen atom in its ground state. Find the smallest kinetic energy the electron can have afterwards (in eV, 2 decimals; ignore the recoil of the atom).`, 12.9 - 13.6 * (1 - 1 / 16), 0.01, 2,
    r`The atom may take 10.2, 12.09 or 12.75 eV (levels $n = 2, 3, 4$); $n = 5$ needs 13.06 eV, more than 12.9 eV. The largest transfer is 12.75 eV, leaving $12.9 - 12.75 = 0.15$ eV.`, { unit: 'eV' }),
  xnat(4, 'impact parameter', r`A 5.0 MeV alpha particle approaches a gold nucleus ($Z = 79$) and is scattered through $90^\circ$. Find its impact parameter (in fm, 1 decimal). $\dfrac{e^2}{4\pi\varepsilon_0} = 1.44\ \mathrm{MeV\,fm}$.`, 1.44 * 2 * 79 / 5 / 2 / Math.tan(Math.PI / 4), 0.3, 1,
    r`$b = \dfrac{kq_1q_2}{2K}\cot\dfrac\theta2$. Here $kq_1q_2 = 1.44\times2\times79 = 227.8$ MeV fm. $b = \dfrac{227.8}{2\times5}\cot45^\circ = 22.8$ fm, half of the head-on distance of closest approach (45.6 fm).`, { unit: 'fm' }),
  xnat(4, 'orbital frequency', r`Find the ratio (frequency of revolution in the $n = 2$ orbit)/(frequency of revolution in the $n = 3$ orbit) for hydrogen (3 decimals).`, 27 / 8, 0.002, 3,
    r`$f_n = \dfrac{v_n}{2\pi r_n}\propto\dfrac{1/n}{n^2} = \dfrac1{n^3}$. $\dfrac{f_2}{f_3} = \dfrac{27}{8} = 3.375$.`),
  xnat(4, 'number of lines', r`A hydrogen atom is in the level $n = 5$. In returning to the ground state it can emit several photons one after the other. What is the largest number of photons that a single atom can emit?`, 4, 0, 0,
    r`The most photons come from dropping one level at a time: $5\to4\to3\to2\to1$, four photons. (A whole sample can emit 10 different lines, but one atom emits only one sequence.)`, { trap: 'One atom does not make all 10 lines.' }),
  xnat(4, 'series limit', r`Find the ratio (highest frequency of the Paschen series)/(lowest frequency of the Lyman series) (3 decimals).`, (1 / 9) / (3 / 4), 0.001, 3,
    r`Paschen limit: $\dfrac R9$ (per unit $c$). Lyman lowest: $\dfrac{3R}{4}$. Ratio $= \dfrac{1/9}{3/4} = \dfrac{4}{27} = 0.148$.`),
  xnat(4, 'Moseley law', r`The $K_\alpha$ line of copper ($Z = 29$) has wavelength 0.154 nm. Using Moseley's law, find the $K_\alpha$ wavelength of iron ($Z = 26$) (in nm, 3 decimals).`, 0.154 * (28 / 25) ** 2, 0.002, 3,
    r`$\sqrt\nu\propto(Z - 1)$, so $\lambda\propto\dfrac1{(Z - 1)^2}$. $\lambda_{Fe} = 0.154\times\left(\dfrac{28}{25}\right)^2 = 0.154\times1.254 = 0.193$ nm.`, { unit: 'nm' }),
  xnat(4, 'excitation by photon', r`A hydrogen atom in its ground state absorbs a photon and then emits photons of three different wavelengths on returning to the ground state. Find the energy of the photon it absorbed (in eV, 2 decimals).`, XE1 * (1 - 1 / 9), 0.01, 2,
    r`Three lines means $\dfrac{n(n - 1)}{2} = 3$, so $n = 3$. Absorption must supply exactly $E_3 - E_1 = 13.6\left(1 - \dfrac19\right) = 12.09$ eV.`, { unit: 'eV' }),
  xnat(4, 'ionisation', r`Hydrogen atoms in the $n = 2$ level are ionised by light. Find the longest wavelength that will do it (in nm, 1 decimal; $hc = 1240\ \mathrm{eV\,nm}$).`, XHC / 3.4, 0.5, 1,
    r`Ionisation energy from $n = 2$ is 3.4 eV. $\lambda_{max} = \dfrac{1240}{3.4} = 364.7$ nm, the Balmer limit.`, { unit: 'nm' }),
  xnat(4, 'mixed: Doppler shift', r`The $\mathrm{H}_\alpha$ line (656.3 nm in the laboratory) is seen at a longer wavelength in the light of a galaxy moving away at 1.0 % of the speed of light. Find the shift in wavelength (in nm, 2 decimals; use $\Delta\lambda/\lambda = v/c$).`, 656.3 * 0.01, 0.05, 2,
    r`$\Delta\lambda = \lambda\dfrac vc = 656.3\times0.01 = 6.56$ nm, so the line appears at 662.9 nm.`, { unit: 'nm' }),
  xnat(4, 'hydrogen-like ions', r`Find the ratio (radius of the $n = 2$ orbit of $\mathrm{He^+}$)/(radius of the first orbit of hydrogen).`, 4 / 2, 0, 0,
    r`$r = \dfrac{n^2a_0}{Z}$. $\dfrac{r}{a_0} = \dfrac{4}{2} = 2$.`),
  xnat(4, 'photoelectric effect on hydrogen', r`An atom of hydrogen in the level $n = 2$ absorbs a photon of energy 5.0 eV and is ionised. Find the kinetic energy of the free electron (in eV, 1 decimal).`, 5.0 - 3.4, 0.05, 1,
    r`The electron needs 3.4 eV to leave. $K = 5.0 - 3.4 = 1.6$ eV.`, { unit: 'eV' }),
  xmsq(4, 'Bohr postulates', r`According to the Bohr model of the hydrogen atom, which are correct?`, [r`The electron does not radiate while it remains in a stationary orbit.`, r`The angular momentum of the electron is an integral multiple of $h/2\pi$.`, r`Radiation is emitted when the electron jumps between orbits.`, r`The electron may have any angular momentum, but only certain energies are allowed.`], [0, 1, 2],
    r`The three postulates: stationary orbits without radiation (A), quantised angular momentum (B), and photon $h\nu = E_i - E_f$ in a jump (C). Energies are quantised because the angular momentum is, so D is false.`),
  xmsq(4, 'Bohr model', r`For the $n$-th orbit of hydrogen in the Bohr model, which are correct?`, [r`The radius is proportional to $n^2$.`, r`The speed is proportional to $1/n$.`, r`The kinetic energy is proportional to $1/n^2$.`, r`The time period is proportional to $n^2$.`], [0, 1, 2],
    r`$r\propto n^2$, $v\propto1/n$, $K\propto1/n^2$. The period $T = \dfrac{2\pi r}{v}\propto\dfrac{n^2}{1/n} = n^3$, not $n^2$ (D false).`),
  xmsq(4, 'alpha scattering', r`In Rutherford's alpha-particle scattering, which are correct?`, [r`The number of alpha particles scattered at a given angle is proportional to $1/\sin^4(\theta/2)$.`, r`The distance of closest approach in a head-on collision increases if the energy of the alpha particle increases.`, r`A smaller impact parameter gives a larger deflection.`, r`The scattering is mostly due to the electrons of the atoms.`], [0, 2],
    r`Rutherford's law (A). Higher energy lets the alpha particle get closer, so $d$ decreases with energy (B false). Smaller $b$ means stronger repulsion, greater deflection (C). An alpha particle is about 7300 times heavier than an electron, so electrons deflect it very little (D false); the nucleus does it.`),
  xmsq(4, 'hydrogen-like ions', r`Compare the $\mathrm{He^+}$ ion with the hydrogen atom, each in the same level $n$. Which are correct?`, [r`The orbit radius of $\mathrm{He^+}$ is half.`, r`The speed of the electron in $\mathrm{He^+}$ is twice.`, r`The total energy of $\mathrm{He^+}$ is four times as negative.`, r`The magnetic moment of the orbit in $\mathrm{He^+}$ is twice.`], [0, 1, 2],
    r`$r\propto1/Z$ (A), $v\propto Z$ (B), $E\propto Z^2$ (C). $\mu = \tfrac12evr\propto Z\times\dfrac1Z$: unchanged (D false).`),
  xmsq(4, 'atomic models', r`Which of these are correct?`, [r`Thomson's model could not explain the large-angle scattering of alpha particles.`, r`Rutherford's model could not explain why atoms are stable.`, r`Bohr's model works well for hydrogen-like ions.`, r`Bohr's model gives the correct spectrum of helium atoms.`], [0, 1, 2],
    r`A, B and C are standard. With two electrons interacting, Bohr's model fails (D false).`),
  xasrt(4, 'hydrogen-like ions', r`Some lines of the $\mathrm{He^+}$ spectrum have the same wavelengths as lines of hydrogen.`, r`For $\mathrm{He^+}$, $\dfrac1\lambda = 4R\left(\dfrac1{n_1^2} - \dfrac1{n_2^2}\right)$, which equals $R\left(\dfrac1{(n_1/2)^2} - \dfrac1{(n_2/2)^2}\right)$.`, 0,
    r`When $n_1$ and $n_2$ are both even, $\dfrac{n}{2}$ are integers, and the $\mathrm{He^+}$ line equals a hydrogen line. R is the algebra behind it. Both true; R explains A.`),
  xasrt(4, 'excitation', r`An electron of kinetic energy 11 eV can excite a hydrogen atom from its ground state, but a photon of energy 11 eV cannot.`, r`An electron can give part of its energy to an atom, while a photon is absorbed only if its whole energy matches a transition.`, 0,
    r`The atom can take 10.2 eV from the electron (leaving it 0.8 eV). A photon of 11 eV matches no gap (10.2, 12.09, ...). R explains A.`),
  xstm(4, 'Bohr model', r`In the Bohr model the potential energy of the electron in an orbit is $-2$ times its kinetic energy.`, r`The total energy of the electron in a bound orbit is half of its potential energy.`, 0,
    r`$K = +\dfrac{ke^2}{2r}$, $U = -\dfrac{ke^2}{r} = -2K$ (I). $E = K + U = -K = \dfrac U2$ (II). Both true.`),
  xcnt(4, 'spectral series', r`How many of these statements about the hydrogen spectrum are correct?`, [r`The series limit of the Lyman series is at 91.2 nm.`, r`The Balmer lines have wavelengths between 365 nm and 656 nm.`, r`The Paschen series lies in the infrared.`, r`Each series has a longest and a shortest wavelength, with the lines crowding towards the shortest.`], 4,
    r`(1) $1/R = 91.2$ nm. (2) From $\mathrm{H}_\alpha$ to the limit. (3) Paschen: 820 to 1875 nm. (4) Lines bunch up towards the limit. All four.`),
  xmt(4, 'Rutherford scattering', 'ma3', r`Match each ratio of numbers of scattered alpha particles per unit solid angle, $N\propto1/\sin^4(\theta/2)$.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$\dfrac{N(\theta)}{N(180^\circ)} = \dfrac{1}{\sin^4(\theta/2)}$. $60^\circ$: $\dfrac{1}{(1/2)^4} = 16$ (p). $90^\circ$: $\dfrac{1}{(1/\sqrt2)^4} = 4$ (q). $120^\circ$: $\dfrac{1}{(\sqrt3/2)^4} = \dfrac{16}{9}$ (r). $180^\circ$: 1 (s).`),
  xmt(4, 'hydrogen-like ions', 'ma4', r`Match each ion (one electron) with the energy of its $n = 2\to1$ photon.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$E = 10.2\,Z^2$ eV: $Z = 1$: 10.2 (p). $Z = 2$: 40.8 (q). $Z = 3$: 91.8 (r). $Z = 4$: 163.2 (s). 13.6 is the ionisation energy of hydrogen, not used.`),
  xmt(4, 'scaling with Z', 'ma5', r`In the Bohr model, match each quantity (same $n$) with its dependence on $Z$.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$r_n = \dfrac{n^2a_0}{Z}$ (p). $v_n = \dfrac{Zv_1}{n}$ (q). $|E_n| = \dfrac{13.6Z^2}{n^2}$ (r). $\mu = \dfrac{e}{2}vr$ does not depend on $Z$ because $v$ rises by $Z$ and $r$ falls by $Z$ (s).`),
  xmt(4, 'atomic models', 'ma8', r`Match each model or idea with the point it explains or fails to explain.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`Thomson's plum pudding gave only small deflections, not large angles (p). Rutherford's orbiting electron should radiate and fall in, and cannot give line spectra (q). Bohr's model fails for many-electron atoms (r). The de Broglie picture gives $2\pi r = n\lambda$, a standing wave (s).`),
  xpas(3, 'highest level', 'pa1', r`What is the highest level $n$ an atom can reach in a collision with one of these electrons?`, 3, 0, 0,
    r`Energy needed: $n = 3$: 12.09 eV (allowed). $n = 4$: 12.75 eV (more than 12.2 eV). So the highest level is $n = 3$.`),
  xpas(4, 'wavelength', 'pa1', r`Find the longest wavelength in the light emitted by the excited gas (in nm, 1 decimal).`, XHC / (XE1 * (1 / 4 - 1 / 9)), 0.5, 1,
    r`The lines present are $2\to1$, $3\to1$, $3\to2$. The longest wavelength comes from the smallest energy gap, $3\to2$: $13.6\times\dfrac{5}{36} = 1.889$ eV. $\lambda = \dfrac{1240}{1.889} = 656.5$ nm.`, { unit: 'nm' }),
  xpas(4, 'energy of the electron', 'pa1', r`An electron excites an atom to the highest possible level. Find its kinetic energy afterwards (in eV, 2 decimals).`, 12.2 - XE1 * (1 - 1 / 9), 0.01, 2,
    r`It loses 12.09 eV, so $12.2 - 12.09 = 0.11$ eV remain.`, { unit: 'eV' }),
  xpas(3, 'closest approach', 'pa2', r`Find the distance of closest approach in a head-on collision (in fm, 1 decimal).`, 1.44 * 2 * 79 / 6, 0.2, 1,
    r`$d = \dfrac{k(2e)(79e)}{K} = \dfrac{1.44\times158}{6.0} = 37.9$ fm.`, { unit: 'fm' }),
  xpas(4, 'impact parameter', 'pa2', r`Find the impact parameter for scattering through $90^\circ$ (in fm, 1 decimal).`, 1.44 * 158 / 6 / 2, 0.2, 1,
    r`$b = \dfrac{d}{2}\cot\dfrac\theta2 = \dfrac{37.9}{2}\times1 = 19.0$ fm.`, { unit: 'fm' }),
  xpas(5, 'impact parameter', 'pa2', r`Find the impact parameter that gives a scattering angle of $60^\circ$ (in fm, 1 decimal).`, 1.44 * 158 / 6 / 2 / Math.tan(Math.PI / 6), 0.3, 1,
    r`$b = \dfrac d2\cot30^\circ = 18.95\times1.732 = 32.8$ fm. A larger impact parameter gives a smaller deflection.`, { unit: 'fm', trap: 'Large angle needs small b; 60° is milder than 90°, so b is larger.' }),
  xmt(5, 'coincident lines', 'ma7', r`Each ion has one electron. Match it with the transition that has the same wavelength as the $2\to1$ line of hydrogen.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$\dfrac{1}{\lambda} = RZ^2\left(\dfrac1{n_1^2} - \dfrac1{n_2^2}\right)$. For $n_1 = Zk$ and $n_2 = Zm$ the factor $Z^2$ cancels, giving the hydrogen line $m\to k$. Hydrogen's $2\to1$ means the ion line $2Z\to Z$: He+ $4\to2$ (p), Li2+ $6\to3$ (q), Be3+ $8\to4$ (r), B4+ $10\to5$ (s).`),
];

xitems.push(
  xnat(5, 'Thomson model', r`In Thomson's model an electron sits inside a uniformly charged positive sphere of radius $R = 0.50$ Å and total charge $+e$. Treat it as a particle that oscillates about the centre. Find the wavelength of the light it would radiate (in nm, 1 decimal). $\dfrac{e^2}{4\pi\varepsilon_0} = 2.31\times10^{-28}\ \mathrm{J\,m}$, $m = 9.11\times10^{-31}$ kg, $c = 3.00\times10^{8}\ \mathrm{m\,s^{-1}}$.`, 2 * XPI * 3e8 / Math.sqrt(2.31e-28 / (9.11e-31 * (0.5e-10) ** 3)) * 1e9, 0.5, 1,
    r`Inside the sphere the field is $E = \dfrac{er}{4\pi\varepsilon_0R^3}$, so the force on the electron is $-\dfrac{ke^2}{R^3}r$: simple harmonic with $\omega^2 = \dfrac{ke^2}{mR^3} = \dfrac{2.31\times10^{-28}}{9.11\times10^{-31}\times(0.5\times10^{-10})^3} = 2.03\times10^{33}$. $\omega = 4.5\times10^{16}\ \mathrm{s^{-1}}$ and $\lambda = \dfrac{2\pi c}{\omega} = 41.9$ nm, in the ultraviolet. The model predicts one line at a wrong place, not the observed visible series.`, { unit: 'nm', trap: 'The restoring force is linear only inside the sphere.' }),
  xnat(5, 'reduced mass', r`The $\mathrm{H}_\alpha$ line of hydrogen has wavelength 656.28 nm. In deuterium the nucleus is twice as heavy, so the line shifts slightly. Find the difference in wavelength between the two (in nm, 3 decimals). Take $m_e/m_p = 1/1836.15$ and $m_e/m_d = 1/3670.48$.`, 656.28 / (1 + 1 / 1836.15) * (1 / 1836.15 - 1 / 3670.48), 0.003, 3,
    r`The Rydberg constant is $R_M = \dfrac{R_\infty}{1 + m_e/M}$, so $\lambda\propto1 + \dfrac{m_e}{M}$. $\lambda_H - \lambda_D = \lambda_\infty\left(\dfrac{m_e}{m_p} - \dfrac{m_e}{m_d}\right)$ with $\lambda_\infty = \dfrac{656.28}{1.000545} = 655.92$ nm. $\Delta\lambda = 655.92\times(5.446 - 2.724)\times10^{-4} = 0.179$ nm. The deuterium line is the shorter one.`, { unit: 'nm', trap: 'A heavier nucleus means a larger reduced mass, so a shorter wavelength.' }),
  xnat(5, 'scattering probability', r`A gold foil of thickness $0.50\ \mu$m has $5.9\times10^{28}$ nuclei per $\mathrm{m^3}$. Alpha particles of 6.0 MeV strike it. A particle is scattered through more than $90^\circ$ if its impact parameter is less than $b_{90} = d/2$, where $d$ is the head-on distance of closest approach ($d = 37.9$ fm). Find the fraction scattered through more than $90^\circ$ (in units of $10^{-5}$, 2 decimals).`, XPI * (37.9e-15 / 2) ** 2 * 5.9e28 * 0.5e-6 * 1e5, 0.03, 2,
    r`Each nucleus presents a target area $\pi b_{90}^2 = \pi\times(18.95\times10^{-15})^2 = 1.128\times10^{-27}\ \mathrm{m^2}$. Nuclei per unit area of foil $= nt = 5.9\times10^{28}\times0.5\times10^{-6} = 2.95\times10^{22}\ \mathrm{m^{-2}}$. Fraction $= \pi b^2nt = 3.33\times10^{-5}$.`, { trap: 'Count nuclei per unit area, not per unit volume.' }),
  xnat(5, 'absorption spectrum', r`White light passes through hydrogen gas whose atoms are all in the $n = 2$ level. Find the third longest wavelength of the dark absorption lines (in nm, 1 decimal; $R = 1.097\times10^{7}\ \mathrm{m^{-1}}$).`, 1 / (XR * (1 / 4 - 1 / 25)) * 1e9, 0.5, 1,
    r`From $n = 2$ the atom can absorb $2\to3$ (656 nm), $2\to4$ (486 nm), $2\to5$ (434 nm), ... The third longest wavelength is $2\to5$: $\dfrac1\lambda = R\left(\dfrac14 - \dfrac1{25}\right) = 0.21R$. $\lambda = \dfrac{1}{0.21\times1.097\times10^{7}} = 434.1$ nm.`, { unit: 'nm' }),
  xnat(5, 'gravity and electricity', r`Find the ratio of the electric attraction to the gravitational attraction between the electron and the proton in a hydrogen atom, as $\log_{10}$ of the ratio (2 decimals). $k = 9.0\times10^{9}$, $e = 1.6\times10^{-19}$ C, $G = 6.67\times10^{-11}$ SI, $m_e = 9.11\times10^{-31}$ kg, $m_p = 1.67\times10^{-27}$ kg.`, Math.log10(9e9 * (1.6e-19) ** 2 / (6.67e-11 * 9.11e-31 * 1.67e-27)), 0.03, 2,
    r`Both forces go as $1/r^2$, so the distance cancels: $\dfrac{F_e}{F_g} = \dfrac{ke^2}{Gm_em_p} = \dfrac{9\times10^{9}\times2.56\times10^{-38}}{6.67\times10^{-11}\times9.11\times10^{-31}\times1.67\times10^{-27}} = 2.3\times10^{39}$. The log is $39.36$. Gravity plays no part in atoms.`),
  xnat(4, 'hydrogen-like ions', r`Find the ratio (wavelength of the first Lyman line of hydrogen)/(wavelength of the first Lyman line of $\mathrm{He^+}$).`, 4, 0, 0,
    r`First Lyman line is $2\to1$: $\dfrac1\lambda = \dfrac34RZ^2$, so $\lambda\propto\dfrac1{Z^2}$. $\dfrac{\lambda_H}{\lambda_{He^+}} = \dfrac{4}{1} = 4$ (121.6 nm against 30.4 nm).`),
  xnat(4, 'number of lines', r`Electrons of kinetic energy 12.8 eV are fired through hydrogen gas in its ground state. How many different spectral lines can the gas emit?`, 6, 0, 0,
    r`12.75 eV (for $n = 4$) is less than 12.8 eV, but $n = 5$ needs 13.06 eV. So atoms can reach up to $n = 4$, and the number of lines is $\dfrac{4\times3}{2} = 6$.`),
  xnat(4, 'excitation', r`In the Franck-Hertz experiment, electrons accelerated through 4.9 V excite mercury atoms. The excited atoms emit light on returning to the ground state. Find its wavelength (in nm, 1 decimal; $hc = 1240\ \mathrm{eV\,nm}$).`, 1240 / 4.9, 0.5, 1,
    r`The excitation energy is 4.9 eV. $\lambda = \dfrac{hc}{E} = \dfrac{1240}{4.9} = 253.1$ nm, an ultraviolet line.`, { unit: 'nm' }),
  xmsq(5, 'excitation', r`Hydrogen atoms in the ground state are bombarded in two ways: by electrons of kinetic energy 11 eV, and by photons of energy 11 eV. Which are correct?`, [r`The electrons can excite the atoms to $n = 2$.`, r`The photons can excite the atoms to $n = 2$.`, r`The photons can ionise the atoms.`, r`After exciting, an electron keeps 0.8 eV of kinetic energy (ignoring recoil).`], [0, 3],
    r`Electrons can give up the 10.2 eV needed for $n = 2$ and keep 0.8 eV (A, D). The 11 eV photon matches no gap: it is neither 10.2 nor 12.09 eV, and it is less than the 13.6 eV needed to ionise (B, C false).`),
  xmsq(5, 'spectral series', r`Which are correct for the spectrum of atomic hydrogen?`, [r`The Lyman series lies in the ultraviolet.`, r`The Paschen series lies in the infrared.`, r`The Balmer series has lines in the visible region.`, r`The longest-wavelength line of the Balmer series has wavelength 365 nm.`], [0, 1, 2],
    r`Lyman: 91 to 122 nm. Paschen: 820 to 1875 nm. Balmer: 365 to 656 nm. The longest Balmer line is 656 nm; 365 nm is the series limit (shortest), so D is false.`),
  xmsq(5, 'de Broglie and Bohr', r`The de Broglie wave of the electron fits round the $n$-th Bohr orbit as a standing wave. Which are correct?`, [r`$2\pi r_n = n\lambda_n$.`, r`The de Broglie wavelength in the $n$-th orbit is proportional to $n$.`, r`The wavelength in the ground state equals the circumference of the orbit.`, r`The wavelength in the ground state is larger than the circumference.`], [0, 1, 2],
    r`$\lambda_n = \dfrac{2\pi r_n}{n} = 2\pi na_0\propto n$ (A, B). For $n = 1$ the wavelength is exactly the circumference (C). It is not larger (D false).`),
  xmsq(5, 'X-rays and spectra', r`An atom emits $K_\alpha$ X-rays. Which are correct?`, [r`The wavelength is shorter for an element of higher $Z$.`, r`$\sqrt\nu$ is proportional to $(Z - 1)$.`, r`The line is produced when an electron falls from the $L$ shell to a vacancy in the $K$ shell.`, r`The wavelength depends on the voltage of the X-ray tube.`], [0, 1, 2],
    r`Moseley's law: $\sqrt\nu\propto(Z - 1)$, so $\lambda\propto(Z - 1)^{-2}$ decreases with $Z$ (A, B). $K_\alpha$ is $L\to K$ (C). Characteristic lines do not depend on the tube voltage (once it is high enough to create the vacancy); only the continuous cut-off does (D false).`),
  xmsq(5, 'hydrogen-like ions', r`An ion $X^{(Z-1)+}$ has a single electron. Which are correct in the Bohr model?`, [r`Its ionisation energy from the ground state is $13.6Z^2$ eV.`, r`The ground-state orbital speed is $Z$ times that in hydrogen.`, r`The ground-state orbit radius is $a_0/Z$.`, r`The orbital period in the ground state is $1/Z$ times that in hydrogen.`], [0, 1, 2],
    r`$E\propto Z^2$ (A), $v\propto Z$ (B), $r\propto1/Z$ (C). $T = 2\pi r/v\propto\dfrac1{Z^2}$, not $\dfrac1Z$ (D false).`),
  xasrt(5, 'Rutherford scattering', r`The distance of closest approach for a head-on collision is inversely proportional to the kinetic energy of the alpha particle.`, r`At closest approach the entire kinetic energy has been converted into electrostatic potential energy, which is inversely proportional to the separation.`, 0,
    r`$K = \dfrac{kq_1q_2}{d}$, so $d\propto\dfrac1K$. R states exactly this energy argument. Both true and R explains A.`),
  xasrt(5, 'Bohr model', r`The energy levels of hydrogen get closer together as $n$ increases.`, r`The energy of the $n$-th level is proportional to $-1/n^2$.`, 0,
    r`$E_{n+1} - E_n = 13.6\left(\dfrac1{n^2} - \dfrac1{(n+1)^2}\right)\approx\dfrac{27.2}{n^3}$ decreases with $n$. R is the formula that produces the crowding. Both true; R explains A.`),
  xstm(5, 'excitation by electrons', r`An electron of kinetic energy 10.5 eV colliding with a ground-state hydrogen atom can excite it to $n = 2$ and be left with 0.3 eV.`, r`A 10.5 eV photon would be absorbed by a ground-state hydrogen atom, taking it to $n = 2$ with 0.3 eV left over.`, 2,
    r`I is true: the atom takes 10.2 eV and the electron keeps 0.3 eV. II is false: a photon is absorbed only if its energy matches the gap exactly (10.2 eV); it cannot leave the surplus as kinetic energy of anything.`),
);

const xgens = [
  xg('ab-g27', 3, 'nat', 'spectral series', function make(rng) {
    const Z = choose(rng, [1, 1, 2, 3]); const n1 = int(rng, 1, 3); const n2 = n1 + int(rng, 1, 3);
    const E = 13.6 * Z * Z * (1 / (n1 * n1) - 1 / (n2 * n2)); const lam = 1240 / E;
    const nm = Z === 1 ? 'hydrogen' : Z === 2 ? '$\\mathrm{He^+}$' : '$\\mathrm{Li^{2+}}$';
    return { Z, n1, n2, q: `Find the wavelength of the photon emitted when an electron in ${nm} falls from $n = ${n2}$ to $n = ${n1}$ (in nm, 1 decimal; $hc = 1240\\ \\mathrm{eV\\,nm}$).`, answer: +lam.toFixed(1), tol: Math.max(0.3, lam * 0.003), unit: 'nm',
      sol: `$E = 13.6\\times${Z * Z}\\times\\left(\\dfrac1{${n1 * n1}} - \\dfrac1{${n2 * n2}}\\right) = ${xs(E, 4)}$ eV. $\\lambda = \\dfrac{1240}{${xs(E, 4)}} = ${xs(lam, 4)}$ nm.`, trap: 'For an ion, the energy carries Z².' };
  }, (p) => 1 / (1.097e7 * p.Z * p.Z * (1 / (p.n1 * p.n1) - 1 / (p.n2 * p.n2))) * 1e9),
  xg('ab-g28', 3, 'mcq', 'number of lines', function make(rng) {
    const n = int(rng, 3, 7); const m = int(rng, 1, 2); const lo = m + 1;
    const cnt = (n - m) * (n - m + 1) / 2 - 0; const tot = (n - m + 1) * (n - m) / 2;
    const o = shuffleOpts(rng, String(tot), [String(n - m), String(tot + (n - m)), String((n - m) * (n - m))]);
    return { n, m, lo, q: `Hydrogen atoms are excited to the level $n = ${n}$. They then emit only the lines that end on levels $n = ${m}$ or higher (the atoms stop falling at $n = ${m}$). How many different lines can they emit?`, options: o.options, answer: o.answer,
      sol: `The levels from ${m} to ${n} number ${n - m + 1}, and every pair of them can give a line: $\\dfrac{${n - m + 1}\\times${n - m}}{2} = ${tot}$. The count ${n - m} would be for one atom dropping level by level.` };
  }, (p) => p.options.findIndex((o) => o === String(((p.n - p.m + 1) * (p.n - p.m)) / 2))),
  xg('ab-g29', 4, 'nat', 'excitation by collision', function make(rng) {
    const a = choose(rng, [1, 2, 4]); const nn = choose(rng, [2, 3, 4]); const dE = 13.6 * (1 - 1 / (nn * nn));
    const K = dE * (1 + a / 1);
    return { a, nn, dE, q: `A particle of mass ${a} u strikes a hydrogen atom (mass 1 u) at rest in its ground state and excites it to $n = ${nn}$ in an inelastic collision. Find the smallest kinetic energy of the particle that makes this possible (in eV, 1 decimal; use mass ratios as the mass numbers).`, answer: +K.toFixed(1), tol: 0.1, unit: 'eV',
      sol: `Only the kinetic energy in the centre-of-mass frame can be used: $K\\dfrac{M}{m + M} = \\Delta E$. $\\Delta E = 13.6\\left(1 - \\dfrac1{${nn * nn}}\\right) = ${xs(dE, 4)}$ eV. $K = \\Delta E\\times\\dfrac{${a} + 1}{1} = ${xs(K)}$ eV.`, trap: 'A heavy particle needs more than the excitation energy.' };
  }, (p) => { const m = p.a; const M = 1; const v = 1; const Kc = 0.5 * m * v * v * M / (m + M); const Kt = 0.5 * m * v * v; return p.dE * Kt / Kc; }),
  xg('ab-g30', 4, 'nat', 'impact parameter', function make(rng) {
    const Z = choose(rng, [29, 47, 79]); const E = choose(rng, [4, 5, 6, 8]); const th = choose(rng, [60, 90, 120]);
    const b = 1.44 * 2 * Z / E / 2 / Math.tan(th / 2 * Math.PI / 180);
    return { Z, E, th, q: `An alpha particle of ${E} MeV is scattered through $${th}^\\circ$ by a nucleus of atomic number ${Z}. Find its impact parameter (in fm, 1 decimal; $\\dfrac{e^2}{4\\pi\\varepsilon_0} = 1.44\\ \\mathrm{MeV\\,fm}$).`, answer: +b.toFixed(1), tol: Math.max(0.2, b * 0.01), unit: 'fm',
      sol: `$b = \\dfrac{kq_1q_2}{2K}\\cot\\dfrac\\theta2 = \\dfrac{1.44\\times2\\times${Z}}{2\\times${E}}\\cot${th / 2}^\\circ = ${xs(b)}$ fm.`, trap: 'The half angle is used.' };
  }, (p) => { const d0 = 1.44 * 2 * p.Z / p.E; return (d0 / 2) / Math.tan(p.th * Math.PI / 360); }),
  xg('ab-g31', 4, 'nat', 'Rutherford scattering law', function make(rng) {
    const t1 = choose(rng, [30, 45, 60, 90]); const t2 = choose(rng, [120, 150, 180]);
    const r1 = Math.sin(t2 / 2 * Math.PI / 180) ** 4 / Math.sin(t1 / 2 * Math.PI / 180) ** 4;
    return { t1, t2, q: `In a Rutherford scattering experiment the number of alpha particles counted per unit solid angle is $N_1$ at $${t1}^\\circ$ and $N_2$ at $${t2}^\\circ$. Find $N_1/N_2$ (2 decimals).`, answer: +r1.toFixed(2), tol: Math.max(0.02, r1 * 0.005),
      sol: `$N\\propto\\dfrac{1}{\\sin^4(\\theta/2)}$. $\\dfrac{N_1}{N_2} = \\dfrac{\\sin^4(${t2 / 2}^\\circ)}{\\sin^4(${t1 / 2}^\\circ)} = ${xs(r1, 4)}$.`, trap: 'Use the half angle, and the larger angle goes in the numerator.' };
  }, (p) => 1 / (Math.sin(p.t1 * Math.PI / 360) ** 4 / Math.sin(p.t2 * Math.PI / 360) ** 4)),
  xg('ab-g32', 5, 'nat', 'hydrogen-like ions', function make(rng) {
    const Z = choose(rng, [2, 3, 4, 5]); const nl = int(rng, 1, 3); const nu = nl + int(rng, 1, 3);
    return { Z, nl, nu, q: `A hydrogen-like ion with $Z = ${Z}$ emits a photon of exactly the same wavelength as the hydrogen line $n = ${nu}\\to${nl}$, in a transition from level $n_2$ down to level $n_1 = ${Z * nl}$. Find $n_2$.`, answer: Z * nu, tol: 0,
      sol: `$Z^2\\left(\\dfrac1{${Z * nl}^2} - \\dfrac1{n_2^2}\\right) = \\dfrac1{${nl}^2} - \\dfrac1{${nu}^2}$. Since $Z^2/(${Z * nl})^2 = 1/${nl}^2$, we need $\\dfrac{Z^2}{n_2^2} = \\dfrac1{${nu}^2}$, so $n_2 = ${Z}\\times${nu} = ${Z * nu}$.` };
  }, (p) => { const t = 1 / (p.nl * p.nl) - 1 / (p.nu * p.nu); const inv = 1 / (p.Z * p.nl) ** 2 - t / (p.Z * p.Z); return Math.round(1 / Math.sqrt(inv)); }),
  xg('ab-g33', 3, 'nat', 'current due to orbiting electron', function make(rng) {
    const n = int(rng, 2, 4);
    const T1 = 1.52e-16; const I = 1.6e-19 / (T1 * n ** 3) * 1e6;
    return { n, q: `The electron in the first Bohr orbit of hydrogen has a period of $1.52\\times10^{-16}$ s. Find the equivalent current of the electron in the $n = ${n}$ orbit (in $\\mu$A, 2 decimals; $e = 1.6\\times10^{-19}$ C).`, answer: +I.toFixed(2), tol: Math.max(0.02, I * 0.01), unit: 'µA',
      sol: `$T\\propto n^3$, so $T_${n} = ${n ** 3}\\times1.52\\times10^{-16}$ s. $I = \\dfrac eT = \\dfrac{1.6\\times10^{-19}}{${n ** 3}\\times1.52\\times10^{-16}} = ${xs(I)}\\ \\mu$A.`, trap: 'T goes as n cubed.' };
  }, (p) => 1.6e-19 / (1.52e-16 * 8 * (p.n / 2) ** 3) * 1e6),
  xg('ab-g34', 4, 'nat', 'Moseley law', function make(rng) {
    const refs = [[29, 0.154], [42, 0.0711], [27, 0.179]]; const r0 = choose(rng, refs); const Z2 = choose(rng, [24, 26, 28, 30, 47]);
    const lam = r0[1] * ((r0[0] - 1) / (Z2 - 1)) ** 2;
    return { r0, Z2, q: `The $K_\\alpha$ line of the element with $Z = ${r0[0]}$ has wavelength ${r0[1]} nm. Find the $K_\\alpha$ wavelength of the element with $Z = ${Z2}$ (in nm, 4 decimals).`, answer: +lam.toFixed(4), tol: Math.max(0.0005, lam * 0.005), unit: 'nm',
      sol: `$\\sqrt\\nu\\propto(Z - 1)$, so $\\lambda\\propto(Z - 1)^{-2}$. $\\lambda = ${r0[1]}\\times\\left(\\dfrac{${r0[0] - 1}}{${Z2 - 1}}\\right)^2 = ${xs(lam)}$ nm.`, trap: 'Use Z − 1 for Kα.' };
  }, (p) => { const nu0 = 3e8 / (p.r0[1] * 1e-9); const k = nu0 / (p.r0[0] - 1) ** 2; return 3e8 / (k * (p.Z2 - 1) ** 2) * 1e9; }),
  xg('ab-g35', 3, 'mcq', 'hydrogen-like ions', function make(rng) {
    const Z = int(rng, 2, 4); const n = int(rng, 1, 3); const E = 13.6 * Z * Z / (n * n);
    const o = numOpts(rng, -E, [-E / Z, -13.6 * Z / n, -13.6 * Z * Z / n], 'eV', 3);
    return { Z, n, q: `The total energy of the electron in the $n = ${n}$ level of a hydrogen-like ion with $Z = ${Z}$ is`, options: o.options, answer: o.answer,
      sol: `$E_n = -\\dfrac{13.6Z^2}{n^2} = -\\dfrac{13.6\\times${Z * Z}}{${n * n}} = ${xs(-E)}$ eV. Using $Z$ in place of $Z^2$, or $n$ in place of $n^2$, gives the other options.` };
  }, (p) => p.options.findIndex((o) => o === `${fmt(-13.6 * p.Z * p.Z / (p.n * p.n), 3)} eV`)),
];

export default { topic: 'atoms', groups: { ...groups, ...xgroups }, items: [...items, ...xitems], gens: [...gens, ...xgens] };
