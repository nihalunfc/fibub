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
const MU = 4e-7 * Math.PI; const QE = 1.602e-19; const U = 931.5; const NA_ = 6.022e23; const YR = 3.156e7; const MEV = 1.602e-13;
const S = (x, sig = 3) => String(+Number(x).toPrecision(sig));
let k = 0; let c = 0;
const nid = () => `nu-${String(++k).padStart(3, '0')}`;
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
// atomic masses in u
const MS = { n: 1.008665, H: 1.007825, d: 2.014102, t: 3.016049, He3: 3.016029, He4: 4.002603, Li6: 6.015123, Li7: 7.016004, Be7: 7.016929, C12: 12.0, C14: 14.003242, N14: 14.003074, N15: 15.000109, O15: 15.003066, O16: 15.994915, Fe56: 55.934936, Na22: 21.994437, Ne22: 21.991385, Ra226: 226.02541, Rn222: 222.017578, Po210: 209.982874, Pb206: 205.974465, U235: 235.04393, U238: 238.050788, Th234: 234.043601, Ba141: 140.914411, Kr92: 91.926156 };
const ME = 0.00054858;
const BEtot = (Z, A, M) => (Z * MS.H + (A - Z) * MS.n - M) * U;
const R0 = 1.2;
items.push(
  // ---------- Level 1 ----------
  mcq(1, 'nucleus', r`The particles that make up a nucleus are called`, 'nucleons (protons and neutrons)', ['electrons and protons', 'electrons and neutrons', 'protons only'],
    r`The nucleus contains protons and neutrons, together called nucleons. Electrons are outside it.`),
  mcq(1, 'isotopes, isobars, isotones', r`Nuclides with the same atomic number but different mass numbers are called`, 'isotopes', ['isobars', 'isotones', 'isomers'],
    r`Isotopes: same $Z$ (same element), different $A$. Isobars: same $A$. Isotones: same number of neutrons.`),
  mcq(1, 'isotopes, isobars, isotones', r`$^{14}_{6}\mathrm{C}$ and $^{14}_{7}\mathrm{N}$ are`, 'isobars', ['isotopes', 'isotones', 'isomers'],
    r`Both have mass number 14, with different atomic numbers: isobars. (Neutrons: 8 and 7, so not isotones.)`),
  mcq(1, 'isotopes, isobars, isotones', r`$^{13}_{6}\mathrm{C}$ and $^{14}_{7}\mathrm{N}$ are`, 'isotones', ['isotopes', 'isobars', 'isomers'],
    r`Neutrons: $13 - 6 = 7$ and $14 - 7 = 7$. Equal neutron numbers: isotones.`),
  nat(1, 'nuclear size', r`The radius of a nucleus is $R = R_0A^{1/3}$ with $R_0 = 1.2$ fm. Find the radius of a nucleus of mass number 8 (in fm, 1 decimal).`, R0 * Math.cbrt(8), 0.05, 1,
    r`$A^{1/3} = 8^{1/3} = 2$, so $R = 1.2\times2 = 2.4$ fm.`, { unit: 'fm' }),
  mcq(1, 'nuclear density', r`The density of nuclear matter, as the mass number of the nucleus increases,`, 'stays about the same', ['increases in proportion to $A$', 'decreases as $A^{-1/3}$', 'increases as $A^{1/3}$'],
    r`Mass $\propto A$ and volume $\propto R^3\propto A$. So the density is nearly the same for all nuclei, about $2.3\times10^{17}\ \mathrm{kg\,m^{-3}}$.`),
  mcq(1, 'atomic mass unit', r`One atomic mass unit (1 u) is equivalent to about`, '931.5 MeV', ['9.315 MeV', '93.15 MeV', '1.6 MeV'],
    r`$1\ \mathrm u = 1.66\times10^{-27}$ kg. $E = mc^2 = 1.49\times10^{-10}$ J $= 931.5$ MeV.`),
  mcq(1, 'radiations', r`Which of the radiations from radioactive nuclei is the most penetrating?`, 'Gamma rays', ['Alpha particles', 'Beta particles', 'All have equal penetration'],
    r`Alphas are stopped by paper, betas by a few mm of aluminium, gamma rays need thick lead or concrete.`),
  mcq(1, 'alpha particle', r`An alpha particle is the same as`, 'a helium nucleus', ['a helium atom', 'a hydrogen nucleus', 'a fast electron'],
    r`An alpha particle is $^{4}_{2}\mathrm{He}$ without electrons: two protons and two neutrons.`),
  mcq(1, 'binding energy', r`The binding energy of a nucleus is`, 'the energy needed to separate it into its protons and neutrons', ['the energy of its electrons', 'the energy released in its beta decay', 'the mass of its nucleons'],
    r`It is the energy given out when the nucleons come together, equal to the energy needed to pull them apart. It equals $\Delta m\,c^2$.`),
  nat(1, 'binding energy', r`The mass of a nucleus is 0.03 u less than the total mass of its separate nucleons. Find its binding energy (in MeV, 1 decimal; 1 u = 931.5 MeV).`, 0.03 * 931.5, 0.1, 1,
    r`$E_b = \Delta m\times931.5 = 0.03\times931.5 = 27.9$ MeV.`, { unit: 'MeV' }),
  mcq(1, 'beta decay', r`In $\beta^-$ decay, inside the nucleus a`, 'neutron changes into a proton, an electron and an antineutrino', ['proton changes into a neutron, an electron and a neutrino', 'neutron changes into a proton and a positron', 'electron already in the nucleus is emitted'],
    r`$n\to p + e^- + \bar\nu$. The electron is created at the moment of decay; it is not stored in the nucleus.`),
  mcq(1, 'activity', r`The SI unit of radioactive activity is`, 'becquerel', ['curie', 'rutherford', 'roentgen'],
    r`1 becquerel = 1 decay per second. The curie ($3.7\times10^{10}$ Bq) and rutherford ($10^6$ Bq) are older units.`),
  nat(1, 'decay law', r`A radioactive sample has a half-life of 10 days. What percentage of the nuclei remains after 30 days?`, 12.5, 0.1, 1,
    r`$30$ days $= 3$ half-lives. $\left(\dfrac12\right)^3 = \dfrac18 = 12.5\%$.`, { unit: '%' }),
  mcq(1, 'binding energy per nucleon', r`Binding energy per nucleon is greatest for nuclei near mass number`, '56 (iron)', ['4 (helium)', '120 (tin)', '238 (uranium)'],
    r`The curve rises steeply to a peak of about 8.8 MeV per nucleon near $A = 56$ and falls slowly to about 7.6 MeV at $A = 238$.`),
  mcq(1, 'fission and fusion', r`Nuclear fission is`, 'the splitting of a heavy nucleus into two lighter nuclei', ['the joining of two light nuclei', 'the emission of a gamma ray', 'the decay of a neutron'],
    r`Fission splits a heavy nucleus such as $^{235}\mathrm U$. Joining light nuclei is fusion.`),
  mcq(1, 'reactor', r`In a nuclear reactor the moderator is used to`, 'slow down fast neutrons', ['absorb neutrons', 'carry heat away', 'start the chain reaction'],
    r`Fission neutrons are fast. Slow (thermal) neutrons are far more likely to cause fission of $^{235}\mathrm U$. Graphite or heavy water slows them without absorbing them much.`),
  mcq(1, 'fusion', r`Which pair is used as fuel in the fusion reactors being developed?`, 'deuterium and tritium', ['uranium-235 and plutonium', 'carbon and oxygen', 'helium and neon'],
    r`$^{2}_{1}\mathrm H + ^{3}_{1}\mathrm H\to^{4}_{2}\mathrm{He} + n + 17.6$ MeV is the easiest fusion reaction to start.`),
  nat(1, 'neutron number', r`How many neutrons are there in a nucleus of $^{238}_{92}\mathrm{U}$?`, 238 - 92, 0, 0,
    r`Neutrons $= A - Z = 238 - 92 = 146$.`),
  mcq(1, 'gamma decay', r`A gamma ray is emitted when`, 'a nucleus drops from an excited state to a lower energy state', ['an electron falls to a lower orbit', 'a neutron changes to a proton', 'a heavy nucleus splits'],
    r`Nuclei have energy levels like atoms, but with gaps of keV to MeV. A transition between them gives a gamma photon. $Z$ and $A$ do not change.`),
  nat(1, 'decay constant', r`A nuclide has a decay constant of $0.693\ \mathrm{s^{-1}}$. Find its half-life (in s, 2 decimals).`, Math.log(2) / 0.693, 0.01, 2,
    r`$T_{1/2} = \dfrac{\ln2}{\lambda} = \dfrac{0.693}{0.693} = 1.00$ s.`, { unit: 's' }),
);
items.push(
  // ---------- Level 2 ----------
  nat(2, 'nuclear size', r`Find the radius of a nucleus of mass number 64 (in fm, 1 decimal; $R_0 = 1.2$ fm).`, R0 * 4, 0.05, 1,
    r`$R = R_0A^{1/3} = 1.2\times64^{1/3} = 1.2\times4 = 4.8$ fm.`, { unit: 'fm' }),
  nat(2, 'nuclear size', r`Find the ratio of the radius of a nucleus of mass number 216 to that of mass number 27.`, Math.cbrt(216 / 27), 0, 0,
    r`$R\propto A^{1/3}$. $\dfrac{R_1}{R_2} = \left(\dfrac{216}{27}\right)^{1/3} = 8^{1/3} = 2$.`),
  nat(2, 'nuclear density', r`Find the density of nuclear matter (in $10^{17}\ \mathrm{kg\,m^{-3}}$, 2 decimals). Take mass of a nucleon $= 1.66\times10^{-27}$ kg and $R = 1.2A^{1/3}$ fm.`, 1.66e-27 / (4 / 3 * Math.PI * (1.2e-15) ** 3) / 1e17, 0.03, 2,
    r`Mass $= A\times1.66\times10^{-27}$ kg. Volume $= \dfrac43\pi(1.2\times10^{-15})^3A$. Density $= \dfrac{1.66\times10^{-27}}{\dfrac43\pi\times1.728\times10^{-45}} = 2.29\times10^{17}\ \mathrm{kg\,m^{-3}}$. The $A$ cancels.`, { unit: '×10¹⁷ kg/m³' }),
  mn(2, 'binding energy', r`The mass of a $^{4}_{2}\mathrm{He}$ atom is 4.002603 u. Find its binding energy (in MeV; $m_H = 1.007825$ u, $m_n = 1.008665$ u).`, BEtot(2, 4, MS.He4), [BEtot(2, 4, MS.He4) / 2, BEtot(2, 4, MS.He4) * 2, BEtot(2, 4, MS.He4) / 4], 'MeV',
    r`Using atomic masses (hydrogen atoms include the electrons): $\Delta m = 2(1.007825) + 2(1.008665) - 4.002603 = 0.030377$ u. $E_b = 0.030377\times931.5 = 28.3$ MeV.`),
  nat(2, 'binding energy per nucleon', r`Find the binding energy per nucleon of $^{4}_{2}\mathrm{He}$ (in MeV, 2 decimals), given the atomic mass 4.002603 u.`, BEtot(2, 4, MS.He4) / 4, 0.03, 2,
    r`$E_b = 28.3$ MeV (from $\Delta m = 0.030377$ u). Per nucleon: $\dfrac{28.3}{4} = 7.07$ MeV.`, { unit: 'MeV' }),
  nat(2, 'Q value of a reaction', r`In the fusion $^{2}_{1}\mathrm H + ^{3}_{1}\mathrm H\to^{4}_{2}\mathrm{He} + n$ the masses are 2.014102 u, 3.016049 u, 4.002603 u and 1.008665 u. Find the energy released (in MeV, 2 decimals).`, (MS.d + MS.t - MS.He4 - MS.n) * U, 0.05, 2,
    r`Mass before: $2.014102 + 3.016049 = 5.030151$ u. After: $4.002603 + 1.008665 = 5.011268$ u. $\Delta m = 0.018883$ u. $Q = 0.018883\times931.5 = 17.59$ MeV.`, { unit: 'MeV' }),
  nat(2, 'mass-energy', r`A mass of 1 mg is completely converted into energy. Find the energy (in $10^{10}$ J; $c = 3\times10^8\ \mathrm{m\,s^{-1}}$).`, 1e-6 * 9e16 / 1e10, 0.01, 2,
    r`$E = mc^2 = 10^{-6}\times(3\times10^8)^2 = 9\times10^{10}$ J. Note that 1 mg is $10^{-6}$ kg.`, { unit: '×10¹⁰ J', trap: 'Convert mg to kg first.' }),
  nat(2, 'decay law', r`A sample has $6.4\times10^{12}$ radioactive nuclei with half-life 2 hours. How many remain after 6 hours (in $10^{11}$)?`, 6.4e12 / 8 / 1e11, 0.01, 2,
    r`$6$ h $= 3$ half-lives. $N = \dfrac{6.4\times10^{12}}{2^3} = 8\times10^{11}$.`, { unit: '×10¹¹' }),
  nat(2, 'mean life', r`The half-life of a nuclide is 10 minutes. Find its mean life (in minutes, 1 decimal).`, 10 / Math.LN2, 0.1, 1,
    r`$\tau = \dfrac{T_{1/2}}{\ln2} = \dfrac{10}{0.693} = 14.4$ min. The mean life is 1.44 times the half-life.`, { unit: 'min' }),
  nat(2, 'decay constant', r`The half-life of carbon-14 is 5730 years. Find its decay constant (in $10^{-4}\ \mathrm{yr^{-1}}$, 2 decimals).`, Math.LN2 / 5730 * 1e4, 0.02, 2,
    r`$\lambda = \dfrac{\ln2}{T_{1/2}} = \dfrac{0.693}{5730} = 1.21\times10^{-4}\ \mathrm{yr^{-1}}$.`, { unit: '×10⁻⁴ /yr' }),
  nat(2, 'activity', r`A sample has $2\times10^{12}$ nuclei and decay constant $3\times10^{-3}\ \mathrm{s^{-1}}$. Find its activity (in $10^9$ Bq).`, 2e12 * 3e-3 / 1e9, 0.01, 2,
    r`$A = \lambda N = 3\times10^{-3}\times2\times10^{12} = 6\times10^9$ Bq.`, { unit: '×10⁹ Bq' }),
  nat(2, 'activity units', r`A source has activity $7.4\times10^9$ Bq. Express it in millicuries ($1\ \mathrm{Ci} = 3.7\times10^{10}$ Bq).`, 7.4e9 / 3.7e10 * 1e3, 0.5, 0,
    r`$\dfrac{7.4\times10^9}{3.7\times10^{10}} = 0.2$ Ci $= 200$ mCi.`, { unit: 'mCi' }),
  mcq(2, 'alpha decay', r`After the alpha decay of $^{238}_{92}\mathrm{U}$ the daughter nucleus has atomic number and mass number`, '90 and 234', ['92 and 234', '90 and 238', '94 and 242'],
    r`An alpha particle carries away 2 protons and 2 neutrons: $Z\to90$, $A\to234$ (thorium).`),
  mcq(2, 'beta decay', r`The daughter nucleus after $\beta^-$ decay of $^{14}_{6}\mathrm{C}$ is`, r`$^{14}_{7}\mathrm{N}$`, [r`$^{14}_{5}\mathrm{B}$`, r`$^{13}_{6}\mathrm{C}$`, r`$^{10}_{4}\mathrm{Be}$`],
    r`In $\beta^-$ decay $A$ is unchanged and $Z$ rises by 1: nitrogen-14.`),
  nat(2, 'decay series', r`A nucleus $^{238}_{92}\mathrm{U}$ decays to $^{206}_{82}\mathrm{Pb}$ by a series of alpha and beta ($\beta^-$) decays. How many alpha particles are emitted?`, (238 - 206) / 4, 0, 0,
    r`Only alpha decay changes $A$, by 4 each time. $\dfrac{238 - 206}{4} = 8$.`),
  mcq(2, 'beta decay', r`The energies of the electrons emitted in $\beta^-$ decay of a given nuclide form a continuous spectrum because`, 'an antineutrino also shares the energy', ['the nucleus has many energy levels', 'electrons lose different amounts of energy in the atom', 'beta particles are slowed in air'],
    r`Alpha particles come out in a few sharp energies; betas show a spread from zero to a maximum. Pauli proposed the (anti)neutrino to take the rest of the decay energy and momentum.`),
  nat(2, 'alpha decay energy', r`$^{226}\mathrm{Ra}$ decays to $^{222}\mathrm{Rn}$ by alpha emission with $Q = 4.87$ MeV. Find the kinetic energy of the alpha particle (in MeV, 2 decimals). Take mass ratios as mass-number ratios.`, 4.87 * 222 / 226, 0.02, 2,
    r`Momentum conservation: the alpha (mass 4) and radon (mass 222) have equal and opposite momenta, so kinetic energy is shared in inverse proportion to mass: $K_\alpha = Q\dfrac{A-4}{A} = 4.87\times\dfrac{222}{226} = 4.78$ MeV.`, { unit: 'MeV' }),
  mcq(2, 'fusion', r`The energy of the Sun comes mainly from`, 'fusion of hydrogen nuclei to make helium', ['fission of uranium', 'burning of carbon', 'radioactive decay of potassium'],
    r`In the Sun's core, four protons fuse (through the proton-proton chain) into one helium-4 nucleus, releasing about 26.7 MeV.`),
  nat(2, 'fission energy', r`About 200 MeV is released in each fission. Express this in joules (in $10^{-11}$ J, 2 decimals; 1 MeV $= 1.602\times10^{-13}$ J).`, 200 * 1.602e-13 / 1e-11, 0.02, 2,
    r`$200\times1.602\times10^{-13} = 3.20\times10^{-11}$ J per fission.`, { unit: '×10⁻¹¹ J' }),
  mcq(2, 'fusion', r`Fusion of light nuclei needs very high temperature because`, 'the nuclei must overcome their electrical repulsion', ['neutrons must be made fast', 'the nuclei must be ionised first', 'the nuclear force is repulsive at long range'],
    r`Nuclei are positive and repel each other. They must come within about $10^{-15}$ m, where the strong nuclear force acts. That needs kinetic energies of keV, that is, temperatures of about $10^7$ to $10^8$ K. (The nuclear force is attractive.)`),
  nat(2, 'binding energy of the deuteron', r`The binding energy of the deuteron is 2.22 MeV. Find the wavelength of a photon with this energy (in fm, nearest whole number; $hc = 1240$ MeV fm).`, 1240 / 2.22, 3, 0,
    r`$\lambda = \dfrac{hc}{E} = \dfrac{1240\ \text{MeV fm}}{2.22\ \text{MeV}} = 559$ fm. A gamma photon of at least this energy can break a deuteron (photodisintegration).`, { unit: 'fm' }),
  mcq(2, 'nuclear stability', r`For heavy stable nuclei, compared with light stable nuclei, the ratio of neutrons to protons is`, 'larger than 1', ['exactly 1', 'smaller than 1', 'zero'],
    r`Light stable nuclei have $N\approx Z$. As $Z$ rises the repulsion between protons grows, and extra neutrons are needed to hold the nucleus together. $^{208}\mathrm{Pb}$ has $N/Z = 126/82\approx1.54$.`),
  nat(2, 'binding energy per nucleon', r`Find the binding energy per nucleon of $^{56}_{26}\mathrm{Fe}$ (in MeV, 2 decimals), given its atomic mass 55.934936 u.`, BEtot(26, 56, MS.Fe56) / 56, 0.03, 2,
    r`$\Delta m = 26(1.007825) + 30(1.008665) - 55.934936 = 0.528464$ u. $E_b = 0.528464\times931.5 = 492.3$ MeV. Per nucleon: $\dfrac{492.3}{56} = 8.79$ MeV.`, { unit: 'MeV' }),
  mcq(2, 'nuclear force', r`Which is true of the nuclear force between nucleons?`, 'It is strong, short-ranged and almost independent of charge', ['It is long-ranged like gravity', 'It acts only between protons', 'It is weaker than the electric force at 1 fm'],
    r`At 1 fm the nuclear force is about 100 times the electrical repulsion of two protons. It acts between $p$-$p$, $n$-$n$ and $p$-$n$ with nearly equal strength and drops to almost nothing beyond a few fm.`),
  nat(2, 'Coulomb repulsion', r`Find the electrical potential energy of two protons 1.2 fm apart (in MeV, 2 decimals; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm).`, 1.44 / 1.2, 0.01, 2,
    r`$U = \dfrac{e^2}{4\pi\varepsilon_0r} = \dfrac{1.44}{1.2} = 1.20$ MeV.`, { unit: 'MeV' }),
  nat(2, 'half-life from data', r`The count rate of a sample falls from 800 to 100 counts per second in 15 minutes. Find its half-life (in minutes).`, 15 / 3, 0.05, 1,
    r`$\dfrac{800}{100} = 8 = 2^3$: three half-lives in 15 minutes. $T_{1/2} = \dfrac{15}{3} = 5$ min.`, { unit: 'min' }),
  mn(2, 'decay law', r`A radioactive sample has a half-life of 8 days. How long does it take for 87.5% of the nuclei to decay (in days)?`, 24, [16, 32, 12], 'days',
    r`$87.5\%$ decayed means $12.5\% = \dfrac18$ remains $= \left(\dfrac12\right)^3$. So 3 half-lives: $3\times8 = 24$ days.`),
  nat(2, 'fission energy', r`Find the energy released when 1 kg of $^{235}\mathrm{U}$ undergoes complete fission, at 200 MeV per fission (in $10^{13}$ J, 2 decimals; $N_A = 6.022\times10^{23}$).`, 1000 / 235 * NA_ * 200 * MEV / 1e13, 0.05, 2,
    r`Atoms in 1 kg: $\dfrac{1000\ \text{g}}{235\ \text{g/mol}}\times6.022\times10^{23} = 2.56\times10^{24}$. Energy $= 2.56\times10^{24}\times3.204\times10^{-11} = 8.2\times10^{13}$ J, the energy from about 2000 tonnes of coal.`, { unit: '×10¹³ J' }),
  nat(2, 'reactor power', r`A nuclear power station has an electrical output of 100 MW at 30% efficiency. Find the thermal power of the reactor (in MW, nearest whole number).`, 100 / 0.3, 0.6, 0,
    r`Thermal power $= \dfrac{\text{electrical}}{\text{efficiency}} = \dfrac{100}{0.30} = 333$ MW.`, { unit: 'MW' }),
  mcq(2, 'reactor', r`In a reactor the control rods are made of cadmium or boron because they`, 'absorb neutrons', ['slow neutrons down', 'carry away heat', 'produce neutrons'],
    r`Pushing the rods in absorbs more neutrons and lowers the multiplication factor $k$. Pulling them out raises $k$.`),
  nat(2, 'chain reaction', r`In a reactor each fission produces neutrons that cause on average $k = 1.1$ new fissions. By what factor does the number of fissions per generation grow after 20 generations (2 decimals)?`, 1.1 ** 20, 0.02, 2,
    r`Each generation multiplies the number by $k$: $1.1^{20} = 6.73$. For $k = 1$ it stays steady (critical); for $k > 1$ it grows exponentially (supercritical).`),
  mcq(2, 'positron decay', r`In the $\beta^+$ decay of $^{22}_{11}\mathrm{Na}$ the daughter nucleus is`, r`$^{22}_{10}\mathrm{Ne}$`, [r`$^{22}_{12}\mathrm{Mg}$`, r`$^{18}_{9}\mathrm{F}$`, r`$^{21}_{10}\mathrm{Ne}$`],
    r`$p\to n + e^+ + \nu$. $A$ stays 22, $Z$ falls by 1 to 10: neon-22.`),
  nat(2, 'decay law', r`A radioactive nuclide has $\lambda = 0.10\ \mathrm{s^{-1}}$. What fraction of the nuclei remains after 10 s (3 decimals)? ($e^{-1} = 0.3679$)`, Math.exp(-1), 0.001, 3,
    r`$\dfrac N{N_0} = e^{-\lambda t} = e^{-0.1\times10} = e^{-1} = 0.368$.`),
  nat(2, 'binding energy per nucleon', r`The atomic mass of $^{16}_{8}\mathrm{O}$ is 15.994915 u. Find its binding energy per nucleon (in MeV, 2 decimals; $m_H = 1.007825$ u, $m_n = 1.008665$ u).`, BEtot(8, 16, MS.O16) / 16, 0.03, 2,
    r`$\Delta m = 8(1.007825) + 8(1.008665) - 15.994915 = 0.137005$ u. $E_b = 0.137005\times931.5 = 127.6$ MeV. Per nucleon: $\dfrac{127.6}{16} = 7.98$ MeV.`, { unit: 'MeV' }),
);
items.push(
  // ---------- Level 3 ----------
  nat(3, 'Q value of a reaction', r`In $^{1}_{1}\mathrm H + ^{7}_{3}\mathrm{Li}\to2\,^{4}_{2}\mathrm{He}$ the atomic masses are 1.007825 u, 7.016004 u and 4.002603 u. Find the energy released (in MeV, 2 decimals).`, (MS.H + MS.Li7 - 2 * MS.He4) * U, 0.05, 2,
    r`Before: $1.007825 + 7.016004 = 8.023829$ u. After: $2\times4.002603 = 8.005206$ u. $\Delta m = 0.018623$ u. $Q = 0.018623\times931.5 = 17.35$ MeV. This was the first reaction caused by artificially accelerated particles (Cockcroft and Walton, 1932).`, { unit: 'MeV' }),
  nat(3, 'alpha decay', r`$^{238}\mathrm U\to^{234}\mathrm{Th} + \alpha$. Atomic masses: 238.050788 u, 234.043601 u, 4.002603 u. Find the kinetic energy of the alpha particle (in MeV, 2 decimals; ignore the tiny difference between mass number and mass).`, (MS.U238 - MS.Th234 - MS.He4) * U * 234 / 238, 0.03, 2,
    r`$\Delta m = 238.050788 - 234.043601 - 4.002603 = 0.004584$ u. $Q = 0.004584\times931.5 = 4.27$ MeV. $K_\alpha = Q\times\dfrac{234}{238} = 4.20$ MeV (the thorium takes 0.07 MeV).`, { unit: 'MeV' }),
  nat(3, 'beta decay Q-value', r`$^{14}\mathrm C\to^{14}\mathrm N + e^- + \bar\nu$. Atomic masses: $^{14}\mathrm C$ = 14.003242 u, $^{14}\mathrm N$ = 14.003074 u. Find the maximum kinetic energy of the beta particle (in keV, nearest whole number).`, (MS.C14 - MS.N14) * U * 1000, 3, 0,
    r`With atomic masses the electron mass cancels in $\beta^-$ decay: $Q = (M_{parent} - M_{daughter})c^2 = 0.000168\times931.5 = 0.156$ MeV $= 156$ keV. The maximum beta energy equals $Q$ (when the antineutrino carries almost nothing).`, { unit: 'keV', trap: 'For $\\beta^-$ use atomic masses directly; for $\\beta^+$ subtract $2m_e$.' }),
  nat(3, 'positron decay Q-value', r`$^{22}\mathrm{Na}\to^{22}\mathrm{Ne} + e^+ + \nu$. Atomic masses: 21.994437 u and 21.991385 u; $m_e = 0.000549$ u. Find the Q-value (in MeV, 2 decimals).`, (MS.Na22 - MS.Ne22 - 2 * 0.000549) * U, 0.02, 2,
    r`With atomic masses, $\beta^+$ decay needs the extra electron mass on each side: $Q = (M_{parent} - M_{daughter} - 2m_e)c^2 = (21.994437 - 21.991385 - 0.001098)\times931.5 = 0.001954\times931.5 = 1.82$ MeV.`, { unit: 'MeV', trap: 'Forgetting the $2m_e$ gives 2.84 MeV.' }),
  nat(3, 'electron capture', r`$^{7}\mathrm{Be}$ captures an orbital electron to become $^{7}\mathrm{Li}$. Atomic masses: 7.016929 u and 7.016004 u. Find the energy released (in MeV, 3 decimals).`, (MS.Be7 - MS.Li7) * U, 0.005, 3,
    r`In electron capture the atomic masses can be used directly: $Q = (7.016929 - 7.016004)\times931.5 = 0.000925\times931.5 = 0.862$ MeV, shared by the neutrino (and a small recoil).`, { unit: 'MeV' }),
  nat(3, 'separation energy', r`Find the energy needed to remove one neutron from $^{16}\mathrm{O}$ (15.994915 u), leaving $^{15}\mathrm{O}$ (15.003066 u). $m_n = 1.008665$ u. Answer in MeV, 2 decimals.`, (MS.O15 + MS.n - MS.O16) * U, 0.05, 2,
    r`$\Delta m = 15.003066 + 1.008665 - 15.994915 = 0.016816$ u. $S_n = 0.016816\times931.5 = 15.66$ MeV.`, { unit: 'MeV' }),
  nat(3, 'separation energy', r`Find the energy needed to remove one proton from $^{16}\mathrm{O}$ (15.994915 u), leaving $^{15}\mathrm{N}$ (15.000109 u). $m_H = 1.007825$ u. Answer in MeV, 2 decimals.`, (MS.N15 + MS.H - MS.O16) * U, 0.05, 2,
    r`$\Delta m = 15.000109 + 1.007825 - 15.994915 = 0.013019$ u. $S_p = 0.013019\times931.5 = 12.13$ MeV. This is less than $S_n$ for $^{16}\mathrm{O}$: removing the proton is easier because of its extra repulsion.`, { unit: 'MeV' }),
  nat(3, 'activity of a sample', r`The half-life of $^{226}\mathrm{Ra}$ is 1600 years. Find the activity of 1 g of it (in $10^{10}$ Bq, 2 decimals; $N_A = 6.022\times10^{23}$, 1 year $= 3.156\times10^7$ s).`, Math.LN2 / (1600 * YR) * NA_ / 226 / 1e10, 0.04, 2,
    r`$\lambda = \dfrac{0.693}{1600\times3.156\times10^7} = 1.373\times10^{-11}\ \mathrm{s^{-1}}$. $N = \dfrac{6.022\times10^{23}}{226} = 2.665\times10^{21}$. $A = \lambda N = 3.66\times10^{10}$ Bq, close to the original definition of one curie.`, { unit: '×10¹⁰ Bq' }),
  nat(3, 'mass of a source', r`$^{60}\mathrm{Co}$ has a half-life of 5.27 years. Find the mass of $^{60}\mathrm{Co}$ that has an activity of 1 Ci $= 3.7\times10^{10}$ Bq (in mg, 3 decimals; $N_A = 6.022\times10^{23}$, 1 y $= 3.156\times10^7$ s).`, 3.7e10 / (Math.LN2 / (5.27 * YR)) * 60 / NA_ * 1000, 0.01, 3,
    r`$\lambda = \dfrac{0.693}{5.27\times3.156\times10^7} = 4.167\times10^{-9}\ \mathrm{s^{-1}}$. $N = \dfrac A\lambda = 8.88\times10^{18}$. Mass $= \dfrac{N\times60}{6.022\times10^{23}} = 8.85\times10^{-4}$ g $= 0.885$ mg.`, { unit: 'mg' }),
  nat(3, 'radioactive dating', r`A wooden relic has a carbon-14 activity 40% of that of living wood. Find its age (in years, nearest 10; half-life 5730 y).`, 5730 * Math.log2(1 / 0.4), 60, 0,
    r`$\dfrac A{A_0} = 2^{-t/T}$, so $t = T\log_2\dfrac{A_0}{A} = 5730\times\log_2(2.5) = 5730\times1.3219 = 7575$ y.`, { unit: 'years' }),
  nat(3, 'half-life from data', r`The count rate of a sample falls from 1600 to 200 counts per minute in 90 minutes. Find its half-life (in minutes).`, 90 / 3, 0.1, 1,
    r`$\dfrac{1600}{200} = 8 = 2^3$, so three half-lives passed: $T_{1/2} = \dfrac{90}3 = 30$ min.`, { unit: 'min' }),
  nat(3, 'decay law', r`A sample starts with $8\times10^{20}$ nuclei. How many decay during the second half-life (in $10^{20}$)?`, 8 / 2 - 8 / 4, 0.01, 2,
    r`After one half-life: $4\times10^{20}$ remain; after two: $2\times10^{20}$. Decays in the second half-life: $4 - 2 = 2\times10^{20}$. (Half of the survivors decay in each half-life.)`, { unit: '×10²⁰', trap: 'The first half-life sees 4×10²⁰ decay, not the second.' }),
  nat(3, 'estimate from the binding energy curve', r`The binding energy per nucleon is about 7.6 MeV for $A = 235$ and about 8.5 MeV for the fission fragments. Estimate the energy released per fission (in MeV, nearest whole number).`, 235 * (8.5 - 7.6), 3, 0,
    r`Total binding energy rises from $235\times7.6$ to $235\times8.5$ MeV. Energy released $\approx235\times(8.5 - 7.6) = 211.5\approx212$ MeV, close to the true value of about 200 MeV.`, { unit: 'MeV' }),
  nat(3, 'energy of the Sun', r`The Sun radiates $3.8\times10^{26}$ W. Find the mass it converts to energy each second (in $10^9$ kg, 2 decimals; $c = 3\times10^8\ \mathrm{m\,s^{-1}}$).`, 3.8e26 / 9e16 / 1e9, 0.05, 2,
    r`$P = \dfrac{dm}{dt}c^2$. $\dfrac{dm}{dt} = \dfrac{3.8\times10^{26}}{9\times10^{16}} = 4.2\times10^9\ \mathrm{kg\,s^{-1}}$. This is tiny compared with the Sun's mass of $2\times10^{30}$ kg.`, { unit: '×10⁹ kg/s' }),
  nat(3, 'fusion temperature', r`Nuclei in a fusion plasma need an average kinetic energy of about 100 keV. Find the corresponding temperature (in $10^8$ K, 2 decimals; $k = 1.381\times10^{-23}\ \mathrm{J\,K^{-1}}$, $\bar K = \tfrac32kT$).`, 2 * 100e3 * QE / (3 * 1.381e-23) / 1e8, 0.1, 2,
    r`$T = \dfrac{2\bar K}{3k} = \dfrac{2\times10^5\times1.602\times10^{-19}}{3\times1.381\times10^{-23}} = 7.7\times10^8$ K.`, { unit: '×10⁸ K' }),
  nat(3, 'nuclear size', r`A nucleus has a radius of 3.6 fm. Find its mass number ($R_0 = 1.2$ fm).`, (3.6 / 1.2) ** 3, 0, 0,
    r`$A^{1/3} = \dfrac{3.6}{1.2} = 3$, so $A = 27$.`),
  nat(3, 'gamma photon', r`A gamma photon of energy 1.17 MeV is emitted by $^{60}\mathrm{Co}$. Find its wavelength (in fm, nearest 10; $hc = 1240$ MeV fm).`, 1240 / 1.17, 8, 0,
    r`$\lambda = \dfrac{1240}{1.17} = 1060$ fm $= 1.06$ pm.`, { unit: 'fm' }),
  nat(3, 'pair production', r`Find the minimum photon energy needed to create an electron-positron pair (in MeV, 2 decimals; $m_e = 9.109\times10^{-31}$ kg, $c = 3\times10^8\ \mathrm{m\,s^{-1}}$).`, 2 * 9.109e-31 * 9e16 / MEV, 0.02, 2,
    r`The photon must supply the rest energy of both particles: $E = 2m_ec^2 = 2\times9.109\times10^{-31}\times9\times10^{16} = 1.64\times10^{-13}$ J $= 1.02$ MeV.`, { unit: 'MeV' }),
  nat(3, 'binding energy of the deuteron', r`Atomic masses: $^{2}\mathrm H$ = 2.014102 u, $^{1}\mathrm H$ = 1.007825 u, neutron 1.008665 u. Find the binding energy of the deuteron (in MeV, 2 decimals).`, (MS.H + MS.n - MS.d) * U, 0.02, 2,
    r`$\Delta m = 1.007825 + 1.008665 - 2.014102 = 0.002388$ u. $E_b = 0.002388\times931.5 = 2.22$ MeV. Only 1.1 MeV per nucleon: why the deuteron is so weakly bound.`, { unit: 'MeV' }),
  nat(3, 'fusion energy', r`Two deuterons fuse to make $^{4}\mathrm{He}$ (atomic masses 2.014102 u and 4.002603 u). Find the energy released (in MeV, 1 decimal).`, (2 * MS.d - MS.He4) * U, 0.2, 1,
    r`$\Delta m = 2\times2.014102 - 4.002603 = 0.025601$ u. $Q = 0.025601\times931.5 = 23.8$ MeV. This is about 6 MeV per nucleon, the largest figure among common fusion reactions per nucleon after D-T.`, { unit: 'MeV' }),
  nat(3, 'the proton-proton cycle', r`Four hydrogen atoms (1.007825 u each) fuse into one helium-4 atom (4.002603 u), with the positrons annihilating with electrons. Find the energy released (in MeV, 1 decimal).`, (4 * MS.H - MS.He4) * U, 0.2, 1,
    r`Using atomic masses, the electrons balance (4 on the left; 2 in helium and 2 annihilated with the positrons). $\Delta m = 4.0313 - 4.002603 = 0.028697$ u. $Q = 0.028697\times931.5 = 26.7$ MeV.`, { unit: 'MeV' }),
  nat(3, 'reactor', r`How many fissions per second are needed to produce a thermal power of 1 MW at 200 MeV per fission (in $10^{16}$, 2 decimals; 1 MeV $= 1.602\times10^{-13}$ J)?`, 1e6 / (200 * MEV) / 1e16, 0.05, 2,
    r`Energy per fission $= 200\times1.602\times10^{-13} = 3.2\times10^{-11}$ J. Rate $= \dfrac{10^6}{3.2\times10^{-11}} = 3.1\times10^{16}$ fissions per second.`, { unit: '×10¹⁶' }),
  nat(3, 'decay law', r`The decay constant of a nuclide is $\lambda$. What fraction of the nuclei remains after one mean life (3 decimals)? ($e = 2.718$)`, Math.exp(-1), 0.001, 3,
    r`$t = \tau = 1/\lambda$, so $\dfrac{N}{N_0} = e^{-\lambda\tau} = e^{-1} = 0.368$. So 63.2% have decayed in one mean life.`),
  mcq(3, 'decay law', r`The decay constant of a radioactive nuclide depends on`, 'the nuclide only', ['its temperature', 'the pressure on it', 'how long it has been decaying'],
    r`$\lambda$ is a property of the nucleus. It does not change with temperature, pressure, chemical state or the age of the sample. (Only electron capture shows a tiny change with chemical state.)`),
  mcq(3, 'alpha decay', r`In the alpha decay of a nucleus at rest, the alpha particle and the daughter nucleus have`, 'equal and opposite momenta, and the alpha carries most of the energy', ['equal kinetic energies', 'equal speeds', 'the same momentum direction'],
    r`Momentum is conserved so $p_\alpha = p_D$ in magnitude. $K = \dfrac{p^2}{2m}$, so the lighter alpha has the larger kinetic energy (fraction $\dfrac{A-4}{A}$ of $Q$), and the larger speed.`),
  nat(3, 'decay law', r`About how many half-lives must pass for a radioactive source to fall to 1/1000 of its initial activity (nearest whole number)?`, Math.round(Math.log2(1000)), 0, 0,
    r`$2^n = 1000$. Since $2^{10} = 1024$, $n\approx10$ half-lives.`),
  mcq(3, 'fusion and fission', r`Energy can be released by fusion of light nuclei and by fission of heavy ones because`, 'the binding energy per nucleon is lower at both ends than near $A = 56$', ['the binding energy per nucleon is greatest for the lightest nuclei', 'mass is not conserved in nuclear reactions', 'neutrons carry large energies'],
    r`Both processes move the nuclei towards the peak of the binding energy curve (iron). The products are more tightly bound per nucleon, so the extra binding energy is released.`),
);
items.push(
  // ---------- assertion-reason ----------
  asrt(2, 'nuclear stability', r`Heavy stable nuclei have more neutrons than protons.`, r`Neutrons add to the attractive nuclear force without adding to the electrical repulsion between protons.`, 0,
    r`In light nuclei $N\approx Z$. In heavy ones the repulsion between many protons is large, and the extra neutrons help bind the nucleus without raising the repulsion. R explains A.`),
  asrt(3, 'mass defect', r`The mass of a stable nucleus is less than the sum of the masses of its separate nucleons.`, r`Energy is released when nucleons come together, and energy $E$ has an equivalent mass $E/c^2$.`, 0,
    r`The released energy (binding energy) leaves the system, taking mass $\Delta m = E_b/c^2$ with it. So the nucleus is lighter than its parts. R explains A.`),
  asrt(3, 'beta decay', r`In $\beta^-$ decay the electrons are emitted with a continuous range of energies.`, r`Beta decay is a three-body process: the daughter nucleus, the electron and an antineutrino share the energy.`, 0,
    r`If only two bodies came out, the electron would always have one fixed energy (as alphas do). With three bodies the energy can be shared in many ways, up to a maximum $Q$. R explains A.`),
  asrt(3, 'nuclear density', r`The density of nuclear matter is about $10^{14}$ times the density of ordinary matter.`, r`The nuclear force is of short range, about 1 to 3 fm.`, 1,
    r`A is true: atoms are 100 000 times wider than their nuclei, so a nucleus is about $10^{14}$ times denser than a solid or liquid. R is also true but is not the explanation: the density is high because nearly all the mass is in a volume $\sim10^{-45}\ \mathrm{m^3}$, which is the size of the nucleus, not because of how far the force acts.`, { trap: 'Both true. The short range of the force does not by itself explain the high density.' }),
  asrt(3, 'activity', r`The activity of a radioactive sample falls to half its value in every half-life.`, r`Every nucleus in the sample decays exactly one half-life after it was formed.`, 2,
    r`A is true: $A = A_0(1/2)^{t/T}$. R is false: decay is random. Each nucleus has a 50% chance of decaying in any half-life; nobody can say when a particular nucleus will go.`, { trap: 'Half-life is a statement about large numbers, not about individual nuclei.' }),
  asrt(3, 'reactor', r`Graphite control rods are used to switch off a reactor quickly.`, r`A moderator slows neutrons by elastic collisions with light nuclei.`, 3,
    r`A is false: control rods are made of strong neutron absorbers like cadmium or boron. Graphite is a moderator, it slows neutrons but absorbs few. R is a true statement of how a moderator works.`),
  asrt(4, 'fusion', r`Fusion needs temperatures of the order of $10^8$ K.`, r`The nuclei must have enough kinetic energy to overcome their electrical repulsion and come within the range of the nuclear force.`, 0,
    r`At 1 to 10 fm the Coulomb barrier between two nuclei is of the order of 0.1 to 1 MeV (about $10^9$ to $10^{10}$ K); quantum tunnelling and the energy tail make about $10^8$ K enough. R explains A.`),
  asrt(4, 'fission', r`$^{235}\mathrm U$ is a better fission fuel than $^{238}\mathrm U$ for slow neutrons.`, r`The binding energy per nucleon of $^{235}\mathrm U$ is about 7.6 MeV.`, 1,
    r`$^{235}\mathrm U$ has an odd number of neutrons, so when it absorbs a neutron the extra pairing energy makes the compound nucleus excited enough to fission, even with a thermal neutron. $^{238}\mathrm U$ needs fast neutrons (above about 1 MeV). R is true (and the same for $^{238}\mathrm U$, about 7.6 MeV), but it does not explain A.`),
  asrt(3, 'beta decay', r`When a nucleus undergoes $\beta^-$ decay, its atomic number decreases by 1.`, r`In $\beta^-$ decay a neutron in the nucleus changes into a proton.`, 3,
    r`A is false: a new proton is formed, so $Z$ increases by 1 and $A$ stays the same. R is true: $n\to p + e^- + \bar\nu$.`),
  asrt(4, 'reactor', r`A chain reaction in natural uranium needs a moderator.`, r`The neutrons from fission are slow and are readily absorbed by $^{235}\mathrm U$.`, 2,
    r`A is true: natural uranium is 99.3% $^{238}\mathrm U$, which absorbs fast neutrons without fission; the neutrons must be slowed to reach the rare $^{235}\mathrm U$ before they are lost. R is false: fission neutrons are fast (about 2 MeV), which is why a moderator is needed.`),
);
items.push(
  // ---------- statements ----------
  stm(3, 'isotopes', r`Isotopes of an element have different numbers of neutrons.`, r`Isotopes of an element have different chemical properties.`, 2,
    r`I is true: same $Z$, different $A$, so different $N$. II is false: chemistry depends on the electrons, and isotopes have the same number of them. (Tiny rate differences exist for light elements, but the chemistry is the same.)`),
  stm(3, 'nuclear force', r`The nuclear force between two nucleons depends on their electric charges.`, r`The nuclear force is attractive and short-ranged.`, 3,
    r`I is false: the force between $p$-$p$, $n$-$n$ and $p$-$n$ is nearly the same, so it is charge-independent. II is true.`),
  stm(3, 'radioactivity', r`Radioactivity is a nuclear phenomenon.`, r`The rate of radioactive decay is not changed by heating the sample.`, 0,
    r`Both true. Decay is a nuclear process, whose energies (MeV) are far larger than the thermal and chemical energies (eV), so temperature, pressure and chemical bonding hardly matter.`),
  stm(4, 'decay law', r`A radioactive sample of half-life 1 hour will have completely decayed after 2 hours.`, r`Every nucleus in the sample decays within two half-lives.`, 1,
    r`Both false. After 2 hours, one quarter of the nuclei remain. The decay is exponential, so it never reaches zero exactly, and a given nucleus can survive any time.`),
  stm(4, 'reactor', r`A reactor needs a multiplication factor $k\ge1$ to keep a chain reaction going.`, r`Delayed neutrons make a reactor harder to control.`, 2,
    r`I is true: $k = 1$ is steady, $k > 1$ grows. II is false: delayed neutrons (from the decay of fission fragments) slow the response from milliseconds to seconds, so the control rods have time to act. They make control easier.`),
  stm(3, 'binding energy', r`When two light nuclei fuse to form a nucleus with a higher binding energy per nucleon, energy is released.`, r`Fusion of nuclei heavier than iron releases energy.`, 2,
    r`I is true. II is false: beyond $A\approx56$ the binding energy per nucleon falls, so fusion would absorb energy; the heavy nuclei release energy by fission instead.`),
  stm(4, 'alpha decay', r`In the alpha decay of a nucleus at rest the alpha particle and the daughter nucleus have equal kinetic energies.`, r`In that decay they have equal and opposite momenta.`, 3,
    r`I is false: $K = \dfrac{p^2}{2m}$, so the lighter alpha has more kinetic energy (the fraction $\dfrac{A-4}{A}$ of the decay energy). II is true.`),
  stm(4, 'decay law', r`The mean life of a radioactive nuclide is longer than its half-life.`, r`The mean life is $\dfrac{T_{1/2}}{\ln2}$.`, 0,
    r`Both true. $\tau = 1/\lambda = T/\ln2 = 1.44T$.`),
  cnt(5, 'nuclear physics statements', r`Which of the following statements are correct?`, [r`The binding energy per nucleon is the same for all nuclei.`, r`A positive $Q$ value means a decay is energetically possible.`, r`The end-point energy of the $\beta^-$ spectrum equals the $Q$-value (neglecting recoil).`, r`Gamma emission changes the atomic number by 1.`], 2,
    r`(1) false: it varies from 1.1 MeV (deuteron) to 8.8 MeV (iron). (2) true. (3) true: when the antineutrino carries off no energy the electron has the maximum energy $Q$. (4) false: $\gamma$ emission changes neither $Z$ nor $A$. Two are correct.`),
  cnt(5, 'fission and fusion statements', r`Which of the following statements are correct?`, [r`The average number of neutrons per fission of $^{235}\mathrm U$ is about 2.5.`, r`Heavy water is a better moderator than ordinary water for a reactor that uses natural uranium.`, r`Per kilogram of fuel, D-T fusion releases more energy than fission of $^{235}\mathrm U$.`, r`Delayed neutrons come from the decay of certain fission fragments.`], 4,
    r`(1) true: 2 to 3 neutrons. (2) true: ordinary water absorbs too many neutrons for natural uranium; heavy water hardly absorbs any. (3) true: D-T gives about 3.5 MeV per u while fission gives about 0.85 MeV per u, about 4 times more. (4) true. All four are correct.`),
);
items.push(
  // ---------- match ----------
  mat(2, 'decay modes', 'm2', r`Match each decay mode with the change in the daughter nucleus.`, 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-p, D-s', 'A-r, B-p, C-q, D-s', 'A-s, B-q, C-p, D-r'],
    r`Alpha: $Z-2$, $A-4$ (r). $\beta^-$: $Z+1$, $A$ same (q). $\beta^+$: $Z-1$, $A$ same (p). Gamma: no change (s).`),
  mat(2, 'units of activity and mass', 'm3', r`Match each unit with its value.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'],
    r`1 Bq = 1 decay per second (q). 1 Ci $= 3.7\times10^{10}$ Bq (p). 1 u $= 931.5$ MeV$/c^2$ (r). 1 rutherford $= 10^6$ Bq (s).`),
  mat(3, 'radiations', 'm1', r`Match each radiation with a property.`, 'A-q, B-r, C-p, D-s', ['A-p, B-r, C-q, D-s', 'A-q, B-s, C-p, D-r', 'A-r, B-q, C-p, D-s'],
    r`Alpha: doubly charged and heavy (q). $\beta^-$: emitted together with an antineutrino (r). Gamma: not deflected by a magnetic field (p). $\beta^+$: emitted together with a neutrino (s).`),
  mat(3, 'parts of a reactor', 'm4', r`Match each part of a nuclear reactor with its material or job.`, 'A-q, B-p, C-s, D-r', ['A-p, B-q, C-s, D-r', 'A-q, B-s, C-p, D-r', 'A-q, B-p, C-r, D-s'],
    r`Moderator: heavy water or graphite (q). Control rods: cadmium or boron (p). Coolant: carries heat to the steam generator (s). Fuel: enriched uranium (r).`),
  mat(4, 'decay quantities', 'm5', r`Match each quantity of a radioactive sample with its description.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'],
    r`Mean life $= 1/\lambda$ (q). Half-life $= \ln2/\lambda$ (p). Activity $= \lambda N$ (r). The decay constant $\lambda$ is the probability of decay per unit time per nucleus (s).`),
);
items.push(
  // ---------- multi ----------
  msq(3, 'conservation laws', r`Which quantities are conserved in every nuclear reaction?`, [r`Electric charge`, r`Total number of nucleons`, r`Number of protons`, r`Linear momentum`], [0, 1, 3],
    r`Charge, nucleon number, energy (including mass) and momentum are conserved. The number of protons is not: in $\beta$ decay a neutron becomes a proton, and in $\beta^+$ decay the reverse happens.`),
  msq(3, 'beta decay', r`Which are correct about $\beta^-$ decay?`, [r`The mass number of the nucleus is unchanged.`, r`The atomic number of the nucleus rises by 1.`, r`The electron emitted was an orbital electron of the atom.`, r`An antineutrino is emitted.`], [0, 1, 3],
    r`$n\to p + e^- + \bar\nu$. $A$ unchanged, $Z+1$, an antineutrino accompanies it. The electron is created in the decay; it is not an orbital electron.`),
  msq(4, 'fission', r`Which are correct about the fission of $^{235}\mathrm U$ by thermal neutrons?`, [r`About 200 MeV is released per fission.`, r`The fission fragments are neutron-rich and undergo $\beta^-$ decay.`, r`Only fast neutrons can cause the fission.`, r`The total mass of the products is less than that of the nucleus plus neutron.`], [0, 1, 3],
    r`(1) yes. (2) the fragments have too many neutrons for their $Z$ (the ratio $N/Z$ is that of uranium), so they emit $\beta^-$ until stable. (3) wrong: thermal (slow) neutrons are the best for $^{235}\mathrm U$. (4) the missing mass is the energy released.`),
  msq(4, 'decay law', r`For a radioactive nuclide with half-life $T$ and mean life $\tau$ which are correct?`, [r`After a time $\tau$ about 36.8% of the nuclei remain.`, r`After a time $2T$ one quarter remain.`, r`The activity after a time $\tau$ is 63.2% of the initial activity.`, r`$\tau = T/0.693$.`], [0, 1, 3],
    r`$e^{-1} = 0.368$ remain after $\tau$ (1). $(1/2)^2 = 1/4$ (2). The activity is proportional to $N$ so it is also 36.8% of the original, not 63.2% (3 is wrong; 63.2% is the fraction that has decayed). $\tau = T/\ln2$ (4).`),
  msq(4, 'nuclear size and density', r`Which are correct for nuclei in the model $R = R_0A^{1/3}$?`, [r`The radius is proportional to $A^{1/3}$.`, r`The density is independent of $A$.`, r`The volume is proportional to $A$.`, r`The density is of the order of $10^{17}\ \mathrm{g\,cm^{-3}}$.`], [0, 1, 2],
    r`(1), (2), (3) are the direct consequences of $R\propto A^{1/3}$. The density is $2.3\times10^{17}\ \mathrm{kg\,m^{-3}} = 2.3\times10^{14}\ \mathrm{g\,cm^{-3}}$, so (4) is wrong by a factor of 1000.`, { trap: 'kg per m³ and g per cm³ differ by a factor of 1000.' }),
  msq(5, 'binding energy curve', r`Which statements about the curve of binding energy per nucleon against mass number are correct?`, [r`It rises steeply for the lightest nuclei and has a local peak at $^{4}\mathrm{He}$.`, r`Its maximum is near $A = 56$.`, r`It is nearly flat, at about 8 MeV, between $A\approx30$ and $A\approx170$.`, r`Uranium has a higher value than iron.`], [0, 1, 2],
    r`The first three are the standard features. $^{4}\mathrm{He}$ at 7.07 MeV stands above its neighbours. Uranium is at about 7.6 MeV, below iron's 8.8 MeV (4 is wrong).`),
  msq(5, 'secular equilibrium', r`A long-lived parent (half-life $T_1$) decays to a short-lived daughter (half-life $T_2\ll T_1$). After a long time, which are correct?`, [r`The activities of parent and daughter are nearly equal.`, r`$N_2/N_1 = T_2/T_1$.`, r`$N_2$ is much larger than $N_1$.`, r`The ratio $N_2/N_1$ stays nearly constant in time.`], [0, 1, 3],
    r`In equilibrium the daughter decays as fast as it is made: $\lambda_2N_2 = \lambda_1N_1$. So the activities are equal and $\dfrac{N_2}{N_1} = \dfrac{\lambda_1}{\lambda_2} = \dfrac{T_2}{T_1}\ll1$, so $N_2$ is far smaller (3 is wrong). The ratio holds as long as the parent hardly decays.`),
  msq(4, 'neutrons in a reactor', r`Which are correct for neutrons in a reactor with natural uranium and heavy water?`, [r`A thermal neutron can be absorbed by $^{235}\mathrm U$ and cause fission.`, r`A neutron absorbed by $^{238}\mathrm U$ can lead, after two $\beta^-$ decays, to $^{239}\mathrm{Pu}$.`, r`Neutrons are slowed down by the cadmium control rods.`, r`Heavy water slows neutrons with little absorption.`], [0, 1, 3],
    r`(3) is wrong: cadmium absorbs neutrons; it does not slow them. $^{238}\mathrm U + n\to^{239}\mathrm U\to^{239}\mathrm{Np}\to^{239}\mathrm{Pu}$ by two $\beta^-$ decays.`),
  msq(3, 'gamma decay', r`Which are correct about $\gamma$ decay?`, [r`The mass number does not change.`, r`The atomic number does not change.`, r`The photon energy is typically in the keV to MeV range.`, r`Gamma rays are deflected by a magnetic field.`], [0, 1, 2],
    r`Gamma emission is a drop between nuclear energy levels with no change in the nucleon content. Photons are not deflected by a magnetic field.`),
);
items.push(
  // ---------- Level 4 ----------
  nat(4, 'fission energy', r`In $^{235}\mathrm U + n\to^{141}\mathrm{Ba} + ^{92}\mathrm{Kr} + 3n$ the atomic masses are 235.043930 u, 140.914411 u and 91.926156 u; $m_n = 1.008665$ u. Find the energy released (in MeV, nearest whole number).`, (MS.U235 + MS.n - MS.Ba141 - MS.Kr92 - 3 * MS.n) * U, 1, 0,
    r`Before: $235.043930 + 1.008665 = 236.052595$ u. After: $140.914411 + 91.926156 + 3(1.008665) = 235.866562$ u. $\Delta m = 0.186033$ u. $Q = 0.186033\times931.5 = 173$ MeV.`, { unit: 'MeV' }),
  nat(4, 'radioactive dating', r`In a rock the atoms of $^{206}\mathrm{Pb}$ are half as many as the atoms of $^{238}\mathrm U$ (all the lead comes from the uranium). The half-life of $^{238}\mathrm U$ is $4.5\times10^9$ years. Find the age of the rock (in $10^9$ years, 2 decimals).`, 4.5 * Math.log2(1.5), 0.04, 2,
    r`Original uranium $N_0 = N_U + N_{Pb} = N_U(1 + 0.5) = 1.5N_U$. $\dfrac{N_U}{N_0} = \dfrac1{1.5} = 2^{-t/T}$. $t = T\log_2(1.5) = 4.5\times0.585 = 2.63\times10^9$ y.`, { unit: '×10⁹ y', trap: 'The starting uranium is the uranium left plus the lead formed, not just the uranium left.' }),
  nat(4, 'parallel decay', r`A nuclide decays by two independent routes: by alpha emission with a partial half-life of 40 years and by beta emission with a partial half-life of 60 years. Find its overall half-life (in years).`, 1 / (1 / 40 + 1 / 60), 0.1, 1,
    r`The decay constants add: $\lambda = \lambda_\alpha + \lambda_\beta$, so $\dfrac1T = \dfrac1{40} + \dfrac1{60} = \dfrac{5}{120}$, $T = 24$ years.`, { unit: 'years', trap: 'Add rates (1/T), not half-lives.' }),
  nat(4, 'secular equilibrium', r`$^{226}\mathrm{Ra}$ (half-life 1600 y) decays to $^{222}\mathrm{Rn}$ (half-life 3.8 days). In equilibrium, find $N_{Rn}/N_{Ra}$ (in $10^{-6}$, 2 decimals; 1 year = 365.25 days).`, 3.8 / (1600 * 365.25) / 1e-6, 0.05, 2,
    r`In equilibrium $\lambda_{Ra}N_{Ra} = \lambda_{Rn}N_{Rn}$, so $\dfrac{N_{Rn}}{N_{Ra}} = \dfrac{T_{Rn}}{T_{Ra}} = \dfrac{3.8}{1600\times365.25} = 6.50\times10^{-6}$.`, { unit: '×10⁻⁶' }),
  nat(4, 'mixed: charged particle in a magnetic field', r`An alpha particle of kinetic energy 5.3 MeV (mass $6.645\times10^{-27}$ kg, charge $3.204\times10^{-19}$ C) moves perpendicular to a magnetic field of 1.0 T. Find the radius of its circular path (in cm, 1 decimal).`, Math.sqrt(2 * 6.645e-27 * 5.3 * MEV) / (3.204e-19 * 1.0) * 100, 0.3, 1,
    r`$K = 5.3\times1.602\times10^{-13} = 8.49\times10^{-13}$ J. $p = \sqrt{2mK} = \sqrt{2\times6.645\times10^{-27}\times8.49\times10^{-13}} = 1.062\times10^{-19}$ kg m/s. $r = \dfrac{p}{qB} = \dfrac{1.062\times10^{-19}}{3.204\times10^{-19}\times1.0} = 0.332$ m $= 33.2$ cm.`, { unit: 'cm', sub: 'mixed: moving charges' }),
  nat(4, 'fusion energy', r`The reaction $^{2}\mathrm H + ^{3}\mathrm H\to^{4}\mathrm{He} + n$ releases 17.6 MeV. Find the energy released per gram of an equal-number mixture of deuterium and tritium (5 u per reaction) (in $10^{11}$ J, 2 decimals; $N_A = 6.022\times10^{23}$, 1 MeV $= 1.602\times10^{-13}$ J).`, NA_ / 5 * 17.6 * MEV / 1e11, 0.05, 2,
    r`Reactions per gram: $\dfrac{6.022\times10^{23}}{5} = 1.204\times10^{23}$ (one D plus one T has mass 5 g/mol). Energy $= 1.204\times10^{23}\times17.6\times1.602\times10^{-13} = 3.40\times10^{11}$ J, about 4 times more than fission per gram.`, { unit: '×10¹¹ J' }),
  nat(4, 'chain reaction growth', r`In a reactor $k = 1.05$ with a generation time of 1 ms. How long does it take for the power to rise by a factor of 10 (in ms, 1 decimal)?`, Math.log(10) / Math.log(1.05), 0.5, 1,
    r`After $n$ generations the power is $k^n$ times larger. $1.05^n = 10$ gives $n = \dfrac{\ln10}{\ln1.05} = \dfrac{2.3026}{0.04879} = 47.2$ generations, that is 47.2 ms. (Real reactors rely on delayed neutrons to make the effective generation time much longer.)`, { unit: 'ms' }),
  nat(4, 'gamma recoil', r`A $^{60}\mathrm{Ni}$ nucleus (mass 55 890 MeV$/c^2$) at rest emits a 1.33 MeV gamma ray. Find its recoil energy (in eV, 1 decimal). Use $K = \dfrac{E_\gamma^2}{2Mc^2}$.`, 1.33 ** 2 / (2 * 55890) * 1e6, 0.3, 1,
    r`$K = \dfrac{(1.33\ \text{MeV})^2}{2\times55\,890\ \text{MeV}} = 1.58\times10^{-5}$ MeV $= 15.8$ eV. That is small beside the 1.33 MeV, but larger than the width of the line, which is why resonant absorption of gamma rays needs special tricks (Mössbauer).`, { unit: 'eV' }),
  nat(4, 'Coulomb barrier', r`Estimate the Coulomb barrier for a proton reaching the surface of a $^{64}\mathrm{Cu}$ nucleus ($Z = 29$). Take the separation to be $R_0(A^{1/3} + 1)$ with $R_0 = 1.2$ fm, and $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm. Answer in MeV, 2 decimals.`, 1.44 * 29 / (1.2 * (4 + 1)), 0.05, 2,
    r`$A^{1/3} = 4$. Separation $= 1.2\times5 = 6.0$ fm. $U = \dfrac{1.44\times1\times29}{6.0} = 6.96$ MeV. In practice, quantum tunnelling lets protons of lower energy get in.`, { unit: 'MeV' }),
  nat(4, 'threshold energy', r`The reaction $^{14}\mathrm N(\alpha, p)^{17}\mathrm O$ has $Q = -1.19$ MeV. Find the minimum kinetic energy of the alpha particle (target at rest) for it to occur (in MeV, 2 decimals). Use mass ratios equal to mass numbers.`, 1.19 * (4 + 14) / 14, 0.02, 2,
    r`The alpha must bring more than $|Q|$ because some kinetic energy stays with the moving centre of mass. $K_{th} = |Q|\dfrac{m_\alpha + m_N}{m_N} = 1.19\times\dfrac{18}{14} = 1.53$ MeV.`, { unit: 'MeV', trap: 'The threshold is higher than |Q|.' }),
  nat(4, 'two sources', r`Source X (half-life 1 hour) has activity 2000 Bq and source Y (half-life 3 hours) has activity 500 Bq at $t = 0$. At what time are their activities equal (in hours, 1 decimal)?`, 3, 0.05, 1,
    r`$2000\times2^{-t} = 500\times2^{-t/3}$ gives $2^{-t + t/3} = \dfrac14$, so $\dfrac{2t}3 = 2$ and $t = 3$ h. (At that time both are 250 Bq.)`, { unit: 'h' }),
  nat(4, 'energy sharing in fission', r`A $^{235}\mathrm U$ nucleus at rest splits into two fragments of mass numbers 95 and 140 which share 170 MeV of kinetic energy (ignore the neutrons). Find the kinetic energy of the lighter fragment (in MeV, 1 decimal).`, 170 * 140 / 235, 0.3, 1,
    r`Equal and opposite momenta mean $K\propto1/m$. The lighter fragment gets the larger share: $K_{95} = 170\times\dfrac{140}{235} = 101.3$ MeV and $K_{140} = 68.7$ MeV.`, { unit: 'MeV' }),
  nat(4, 'neutron moderation', r`In a head-on elastic collision a neutron hits a stationary carbon nucleus ($A = 12$). The fraction of its kinetic energy it loses is $\dfrac{4A}{(1 + A)^2}$. Find it as a percentage (1 decimal).`, 4 * 12 / 13 ** 2 * 100, 0.2, 1,
    r`$\dfrac{4\times12}{13^2} = \dfrac{48}{169} = 0.284$, that is 28.4%. With hydrogen ($A = 1$) the loss is 100%, with deuterium ($A = 2$) it is 88.9%. That is why light nuclei are used as moderators.`, { unit: '%' }),
  nat(4, 'neutron decay', r`A free neutron decays: $n\to p + e^- + \bar\nu$. Using masses $m_n = 1.008665$ u and $m_p + m_e = 1.007825$ u (the hydrogen atom), find the maximum kinetic energy shared by the products (in MeV, 3 decimals).`, (MS.n - MS.H) * U, 0.005, 3,
    r`$\Delta m = 1.008665 - 1.007825 = 0.000840$ u. $Q = 0.000840\times931.5 = 0.782$ MeV.`, { unit: 'MeV' }),
  nat(4, 'mixed: heating water', r`The complete fission of 1 g of $^{235}\mathrm U$ releases $8.2\times10^{10}$ J. If it all heated water, by how many tonnes of water would the temperature rise by 50 K (answer in tonnes, nearest whole number; $c = 4200\ \mathrm{J\,kg^{-1}K^{-1}}$)?`, 8.2e10 / (4200 * 50) / 1000, 4, 0,
    r`$m = \dfrac{E}{c\Delta T} = \dfrac{8.2\times10^{10}}{4200\times50} = 3.9\times10^5$ kg $= 390$ tonnes.`, { unit: 'tonnes', sub: 'mixed: thermal physics' }),
  nat(4, 'sequential decay', r`A parent of very long half-life feeds a daughter of half-life $T_2$. Starting with no daughter, the daughter's number approaches its equilibrium value as $1 - 2^{-t/T_2}$. What percentage of the equilibrium value is reached after $t = 3T_2$?`, 87.5, 0.1, 1,
    r`$1 - 2^{-3} = 1 - \dfrac18 = 0.875$, that is 87.5%. After about 7 half-lives the daughter is within 1% of equilibrium.`, { unit: '%' }),
  mcq(4, 'binding energy curve', r`In the reaction $^{2}\mathrm H + ^{2}\mathrm H\to^{4}\mathrm{He}$ the energy released per nucleon of the product is about 6 MeV, but in $^{235}\mathrm U$ fission it is about 0.85 MeV per nucleon. This shows that`, 'a change in binding energy per nucleon is larger in light-nuclei fusion than in the fission of heavy nuclei', ['fusion produces more neutrons than fission', 'the binding energy per nucleon of helium is higher than of uranium by 6 MeV', 'fission is not a nuclear reaction'],
    r`Binding energy per nucleon rises from 1.1 MeV (deuteron) to 7.07 MeV (He-4): a gain of about 6 MeV per nucleon. In fission it rises from 7.6 to 8.5 MeV, a gain of 0.9. So fusion releases more energy per nucleon of fuel. The claim in the second option is wrong: He-4 (7.07) is below U (7.6).`),
  mcq(4, 'decay graphs', r`A graph of $\ln A$ (activity) against time $t$ for a radioactive sample is a straight line with slope $-0.231\ \mathrm{min^{-1}}$. Its half-life is`, '3.0 min', ['0.33 min', '4.3 min', '1.5 min'],
    r`$A = A_0e^{-\lambda t}$ gives $\ln A = \ln A_0 - \lambda t$, a straight line of slope $-\lambda$. $\lambda = 0.231\ \mathrm{min^{-1}}$ and $T = \dfrac{0.693}{0.231} = 3.0$ min. (4.3 min is the mean life.)`),
  nat(4, 'alpha decay', r`$^{210}\mathrm{Po}\to^{206}\mathrm{Pb} + \alpha$. Atomic masses: 209.982874 u, 205.974465 u, 4.002603 u. Find the kinetic energy of the alpha particle (in MeV, 2 decimals).`, (MS.Po210 - MS.Pb206 - MS.He4) * U * 206 / 210, 0.03, 2,
    r`$\Delta m = 0.005806$ u, $Q = 5.41$ MeV. $K_\alpha = Q\times\dfrac{206}{210} = 5.31$ MeV.`, { unit: 'MeV' }),
);
items.push(
  // ---------- Level 5 ----------
  nat(5, 'mixed: neutron star', r`A neutron star has a mass of $2.8\times10^{30}$ kg (1.4 solar masses) and a density equal to that of nuclear matter, $2.3\times10^{17}\ \mathrm{kg\,m^{-3}}$. Find its radius (in km, 1 decimal).`, Math.cbrt(3 * 2.8e30 / (4 * Math.PI * 2.3e17)) / 1000, 0.3, 1,
    r`$V = \dfrac{M}{\rho} = \dfrac{2.8\times10^{30}}{2.3\times10^{17}} = 1.217\times10^{13}\ \mathrm{m^3}$. $R = \left(\dfrac{3V}{4\pi}\right)^{1/3} = (2.906\times10^{12})^{1/3} = 1.43\times10^4$ m $= 14.3$ km. A star heavier than the Sun squeezed into a city.`, { unit: 'km', sub: 'mixed: gravitation' }),
  nat(5, 'Coulomb energy of mirror nuclei', r`The mirror nuclei $^{15}\mathrm O$ ($Z = 8$) and $^{15}\mathrm N$ ($Z = 7$) differ in binding energy by 3.5 MeV, all from the extra Coulomb energy of a uniform sphere, $U = \dfrac35\dfrac{Z(Z-1)e^2}{4\pi\varepsilon_0R}$. Find the nuclear radius $R$ (in fm, 2 decimals; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm).`, 0.6 * (8 * 7 - 7 * 6) * 1.44 / 3.5, 0.05, 2,
    r`$\Delta U = \dfrac35\dfrac{e^2}{4\pi\varepsilon_0R}\left[8\times7 - 7\times6\right] = \dfrac35\times\dfrac{1.44\times14}{R} = 3.5$ MeV. $R = \dfrac{0.6\times1.44\times14}{3.5} = 3.46$ fm. Compare $1.2\times15^{1/3} = 2.96$ fm: the Coulomb method gives a slightly larger radius (the charge extends a little beyond the mass radius).`, { unit: 'fm' }),
  nat(5, 'constant production', r`A radioactive isotope of half-life 10 s is made in a target at a constant rate of $10^6$ nuclei per second. Find the number of nuclei in the target after a very long time (in $10^7$, 2 decimals).`, 1e6 * 10 / Math.LN2 / 1e7, 0.02, 2,
    r`At equilibrium production equals decay: $R = \lambda N_\infty$. $N_\infty = \dfrac R\lambda = \dfrac{R\,T}{\ln2} = \dfrac{10^6\times10}{0.693} = 1.44\times10^7$. The same rule says the activity eventually equals the production rate.`, { unit: '×10⁷' }),
  nat(5, 'successive decay', r`A parent of half-life 6 h decays to a daughter of half-life 2 h, which is itself radioactive. Starting from pure parent, find the time at which the number of daughter nuclei is largest (in hours, 2 decimals). Use $t_{max} = \dfrac{\ln(\lambda_2/\lambda_1)}{\lambda_2 - \lambda_1}$.`, Math.log(3) / (Math.LN2 * (1 / 2 - 1 / 6)), 0.05, 2,
    r`$\lambda_1 = \dfrac{0.693}{6}$, $\lambda_2 = \dfrac{0.693}{2}$ per hour, so $\lambda_2/\lambda_1 = 3$ and $\lambda_2 - \lambda_1 = 0.693\left(\dfrac12 - \dfrac16\right) = 0.231\ \mathrm{h^{-1}}$. $t_{max} = \dfrac{\ln3}{0.231} = \dfrac{1.0986}{0.231} = 4.75$ h. (At that time $dN_2/dt = 0$: the daughter's activity equals the parent's.)`, { unit: 'h' }),
  nat(5, 'decays in an interval', r`A sample has $4\times10^{12}$ radioactive nuclei at $t = 0$ and half-life 2 hours. How many decay between $t = 2$ h and $t = 6$ h (in $10^{12}$, 2 decimals)?`, 4 * (1 / 2 - 1 / 8), 0.02, 2,
    r`Nuclei left at 2 h: $N_0/2$. At 6 h: $N_0/8$. Decays in between $= N_0\left(\dfrac12 - \dfrac18\right) = 0.375N_0 = 1.5\times10^{12}$.`, { unit: '×10¹²' }),
  nat(5, 'energy of a decay chain', r`$^{238}\mathrm U$ decays to $^{206}\mathrm{Pb}$ through 8 alpha and 6 $\beta^-$ decays. With atomic masses 238.050788 u, 205.974465 u and 4.002603 u (for $^{4}\mathrm{He}$) find the total energy released (in MeV, 1 decimal).`, (MS.U238 - MS.Pb206 - 8 * MS.He4) * U, 0.3, 1,
    r`Using atomic masses, the electron masses balance: $\beta^-$ electrons add to the 8 helium atoms' electrons, and the lead atom has the right number of electrons. $\Delta m = 238.050788 - 205.974465 - 8\times4.002603 = 0.055499$ u. $Q = 0.055499\times931.5 = 51.7$ MeV.`, { unit: 'MeV', trap: 'Use atomic masses throughout; no extra electron terms are needed for the whole chain.' }),
  nat(5, 'doubling time of a reactor', r`In a reactor the effective generation time is 0.1 s and $k = 1.0005$. Find the time for the power to double (in seconds, nearest whole number).`, 0.1 * Math.LN2 / Math.log(1.0005), 3, 0,
    r`Power after $n$ generations: $k^n$. For a doubling, $n = \dfrac{\ln2}{\ln1.0005} = \dfrac{0.6931}{4.9988\times10^{-4}} = 1386.6$ generations, which is $0.1\times1386.6 = 139$ s. That slow rise gives operators time to act.`, { unit: 's' }),
  nat(5, 'Coulomb energy of a nucleus', r`Treating $^{40}\mathrm{Ca}$ ($Z = 20$) as a uniformly charged sphere of radius $R = 1.2A^{1/3}$ fm, find its electrical self-energy $U = \dfrac35\dfrac{Z(Z-1)e^2}{4\pi\varepsilon_0R}$ (in MeV, 1 decimal; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm).`, 0.6 * 20 * 19 * 1.44 / (1.2 * Math.cbrt(40)), 0.5, 1,
    r`$R = 1.2\times40^{1/3} = 1.2\times3.42 = 4.10$ fm. $U = 0.6\times\dfrac{20\times19\times1.44}{4.10} = 80.0$ MeV. Compare the total binding energy of $^{40}\mathrm{Ca}$ of about 342 MeV: the electrical repulsion cuts it by about a quarter.`, { unit: 'MeV' }),
  nat(5, 'alpha particle speed and recoil', r`A $^{226}\mathrm{Ra}$ nucleus at rest emits an alpha particle with kinetic energy 4.78 MeV. Find the recoil speed of the $^{222}\mathrm{Rn}$ nucleus (in $10^5\ \mathrm{m\,s^{-1}}$, 2 decimals; $m_\alpha = 6.645\times10^{-27}$ kg, $m_{Rn} = 222\times1.66\times10^{-27}$ kg).`, Math.sqrt(2 * 6.645e-27 * 4.78 * MEV) / (222 * 1.66e-27) / 1e5, 0.02, 2,
    r`Momentum of the alpha: $p = \sqrt{2mK} = \sqrt{2\times6.645\times10^{-27}\times4.78\times1.602\times10^{-13}} = 1.009\times10^{-19}$ kg m/s. The radon has the same momentum: $v = \dfrac{p}{M} = \dfrac{1.009\times10^{-19}}{3.685\times10^{-25}} = 2.74\times10^5\ \mathrm{m\,s^{-1}}$.`, { unit: '×10⁵ m/s' }),
  mcq(5, 'beta decay and neutrino', r`A nucleus at rest undergoes $\beta^-$ decay and the electron comes off with the maximum energy $Q$. In this case`, 'the antineutrino has almost no energy, and the daughter recoils a little', ['the antineutrino carries the whole energy', 'the daughter nucleus does not recoil', 'the electron has zero momentum'],
    r`If the electron takes (almost) all the energy $Q$, the antineutrino has almost none, and momentum must still balance: the electron's momentum is balanced by the daughter's recoil momentum (and a small antineutrino momentum). So the daughter must recoil, with tiny kinetic energy. This is how the neutrino's role was first inferred from the missing momentum and energy.`),
  mcq(5, 'chain reactions', r`A reactor is exactly critical ($k = 1$) with 100 fissions per generation. Control rods are withdrawn slightly so that $k = 1.01$. After 100 generations the number of fissions per generation is about`, '270', ['101', '200', '1010'],
    r`$100\times1.01^{100}$. Since $1.01^{100} = e^{100\ln1.01} = e^{0.995}\approx2.70$, the result is about 270. A small change in $k$ compounds quickly.`),
);
items.push(
  // ---------- passages ----------
  pas(3, 'alpha decay of radium', 'p1', r`Find the energy released ($Q$-value) in the decay (in MeV, 2 decimals).`, (MS.Ra226 - MS.Rn222 - MS.He4) * U, 0.03, 2,
    r`$\Delta m = 226.025410 - 222.017578 - 4.002603 = 0.005229$ u. $Q = 0.005229\times931.5 = 4.87$ MeV.`, { unit: 'MeV' }),
  pas(3, 'alpha decay of radium', 'p1', r`Find the kinetic energy of the alpha particle (in MeV, 2 decimals).`, 4.871 * 222 / 226, 0.03, 2,
    r`Equal and opposite momenta give $K_\alpha = Q\dfrac{M_{Rn}}{M_{Rn} + M_\alpha}\approx4.87\times\dfrac{222}{226} = 4.78$ MeV; the radon takes 0.09 MeV.`, { unit: 'MeV' }),
  pasm(4, 'alpha decay of radium', 'p1', r`The ratio of the speed of the alpha particle to the recoil speed of the radon nucleus is`, '55.5 : 1', ['1 : 55.5', '3080 : 1', '7.45 : 1'],
    r`Momentum conservation: $m_\alpha v_\alpha = M_{Rn}v_{Rn}$, so $\dfrac{v_\alpha}{v_{Rn}} = \dfrac{222}{4} = 55.5$. (3080 is the ratio of kinetic energies mistakenly used; 7.45 is the square root of 55.5.)`),
  pas(3, 'a radioactive iodine sample', 'p2', r`Find the activity of the sample after 24 days (in MBq, 2 decimals).`, 8 / 2 ** 3, 0.01, 2,
    r`24 days is 3 half-lives: $A = \dfrac{8.0}{2^3} = 1.0$ MBq.`, { unit: 'MBq' }),
  pas(4, 'a radioactive iodine sample', 'p2', r`Find the number of $^{131}\mathrm I$ nuclei in the sample when it arrives (in $10^{12}$, 2 decimals).`, 8e6 * 8 * 86400 / Math.LN2 / 1e12, 0.04, 2,
    r`$\lambda = \dfrac{0.693}{8\times86\,400} = 1.003\times10^{-6}\ \mathrm{s^{-1}}$. $N = \dfrac A\lambda = \dfrac{8\times10^6}{1.003\times10^{-6}} = 7.98\times10^{12}$.`, { unit: '×10¹²' }),
  pasm(3, 'a radioactive iodine sample', 'p2', r`The activity is below 0.25 MBq after at least`, '40 days', ['32 days', '24 days', '48 days'],
    r`$0.25 = 8\times2^{-n}$, so $2^n = 32$, $n = 5$ half-lives $= 40$ days. At 32 days (4 half-lives) the activity is 0.5 MBq, still too high.`),
  pas(3, 'radiocarbon dating', 'p3', r`Find the ratio (activity per gram of the charcoal) / (activity per gram of living wood).`, 18.75 / 5 / 15, 0.005, 2,
    r`Charcoal: $\dfrac{18.75}{5} = 3.75$ decays per minute per gram. Ratio $= \dfrac{3.75}{15} = 0.25$.`),
  pas(3, 'radiocarbon dating', 'p3', r`Find the age of the charcoal (in years, nearest 10).`, 5730 * 2, 60, 0,
    r`A ratio of $\dfrac14 = 2^{-2}$ means two half-lives: $t = 2\times5730 = 11\,460$ years.`, { unit: 'years' }),
  pasm(4, 'radiocarbon dating', 'p3', r`Carbon-14 dating is unreliable for samples older than about 50 000 years because`, 'too little carbon-14 is left to measure against the background', ['carbon-14 stops decaying', 'the half-life of carbon-14 changes with age', 'the sample gains carbon-14 from the air'],
    r`After 50 000 years (about 9 half-lives) only $2^{-9}\approx0.2\%$ of the original carbon-14 remains, at the level of the background counts. The half-life of a nuclide is constant.`),
  pas(3, 'a power reactor', 'p4', r`Find the electrical output (in MW).`, 600 * 0.33, 0.5, 0,
    r`Electrical output $= 0.33\times600 = 198$ MW.`, { unit: 'MW' }),
  pas(3, 'a power reactor', 'p4', r`Find the number of fissions per second (in $10^{19}$, 2 decimals; 1 MeV $= 1.602\times10^{-13}$ J).`, 600e6 / (200 * MEV) / 1e19, 0.04, 2,
    r`Energy per fission $= 3.204\times10^{-11}$ J. Rate $= \dfrac{6\times10^8}{3.204\times10^{-11}} = 1.87\times10^{19}\ \mathrm{s^{-1}}$.`, { unit: '×10¹⁹' }),
  pas(4, 'a power reactor', 'p4', r`Find the mass of $^{235}\mathrm U$ fissioned in one day (in g, nearest whole number; $N_A = 6.022\times10^{23}$).`, 600e6 / (200 * MEV) * 86400 / NA_ * 235, 5, 0,
    r`Fissions in a day $= 1.873\times10^{19}\times86\,400 = 1.618\times10^{24}$. Moles $= \dfrac{1.618\times10^{24}}{6.022\times10^{23}} = 2.687$. Mass $= 2.687\times235 = 631$ g. Burning coal for the same power would need about 7000 tonnes a day.`, { unit: 'g' }),
);
// ---------- number templates ----------
const NA3 = (x, sig = 3) => { const a = +Number(x).toPrecision(sig); return { answer: a, tol: +(Math.abs(a) * 0.01 + 1e-12).toPrecision(2) }; };
const PN = { n: 'n', H: '^{1}_{1}\\mathrm H', d: '^{2}_{1}\\mathrm H', t: '^{3}_{1}\\mathrm H', He3: '^{3}_{2}\\mathrm{He}', He4: '^{4}_{2}\\mathrm{He}', Li6: '^{6}_{3}\\mathrm{Li}', Li7: '^{7}_{3}\\mathrm{Li}' };
const REACS = [
  { L: ['d', 't'], Rr: ['He4', 'n'], A: 5 }, { L: ['d', 'd'], Rr: ['He3', 'n'], A: 4 }, { L: ['d', 'd'], Rr: ['t', 'H'], A: 4 },
  { L: ['H', 'Li7'], Rr: ['He4', 'He4'], A: 8 }, { L: ['n', 'Li6'], Rr: ['t', 'He4'], A: 7 },
];
const rtex = (rc) => `${rc.L.map((k) => PN[k]).join(' + ')}\\to${rc.Rr.map((k) => PN[k]).join(' + ')}`;
const rmass = (rc) => [...new Set([...rc.L, ...rc.Rr])].map((k) => `$${PN[k]}$: ${MS[k].toFixed(6)} u`).join('; ');
const rQ = (rc) => (rc.L.reduce((s, k) => s + MS[k], 0) - rc.Rr.reduce((s, k) => s + MS[k], 0)) * U;
const NUCS = [[2, 4, 'He4', '^{4}_{2}\\mathrm{He}'], [3, 7, 'Li7', '^{7}_{3}\\mathrm{Li}'], [6, 12, 'C12', '^{12}_{6}\\mathrm C'], [8, 16, 'O16', '^{16}_{8}\\mathrm O'], [26, 56, 'Fe56', '^{56}_{26}\\mathrm{Fe}'], [92, 238, 'U238', '^{238}_{92}\\mathrm U']];
const ALPHA = [['U238', 'Th234', 238, '^{238}\\mathrm U', '^{234}\\mathrm{Th}'], ['Ra226', 'Rn222', 226, '^{226}\\mathrm{Ra}', '^{222}\\mathrm{Rn}'], ['Po210', 'Pb206', 210, '^{210}\\mathrm{Po}', '^{206}\\mathrm{Pb}']];
const gens = [
  { id: 'nu-g01', type: 'nat', format: 'numeric', level: 2, exams: exFor(2, 'nat'), sub: 'nuclear size',
    make(rng) {
      const A = choose(rng, [8, 27, 64, 125, 216]); const v = int(rng, 0, 2); const r = 1.2 * Math.cbrt(A);
      if (v === 0) return { A, v, ...NA3(r), unit: 'fm', q: `Find the radius of a nucleus of mass number ${A} (in fm; $R_0 = 1.2$ fm).`, sol: `$R = R_0A^{1/3} = 1.2\\times${A}^{1/3} = 1.2\\times${Math.round(Math.cbrt(A))} = ${S(r, 3)}$ fm.` };
      if (v === 1) return { A, v, answer: A, tol: 0, q: `A nucleus has a radius of ${S(r, 3)} fm. Find its mass number ($R_0 = 1.2$ fm).`, sol: `$A^{1/3} = \\dfrac{${S(r, 3)}}{1.2} = ${Math.round(Math.cbrt(A))}$, so $A = ${Math.round(Math.cbrt(A))}^3 = ${A}$.` };
      const B = choose(rng, [1, 8, 27, 64, 125, 216].filter((x) => x !== A)); const x = Math.cbrt(A / B);
      return { A, B, v, ...NA3(x), q: `Find the ratio of the radius of a nucleus of mass number ${A} to that of mass number ${B}.`, sol: `$R\\propto A^{1/3}$. $\\dfrac{R_1}{R_2} = \\left(\\dfrac{${A}}{${B}}\\right)^{1/3} = \\dfrac{${Math.round(Math.cbrt(A))}}{${Math.round(Math.cbrt(B))}} = ${S(x, 3)}$.` };
    },
    verify: (p) => p.v === 0 ? 1.2 * p.A ** (1 / 3) : p.v === 1 ? Math.round((1.2 * Math.cbrt(p.A) / 1.2) ** 3) : Math.cbrt(p.A) / Math.cbrt(p.B) },
  { id: 'nu-g02', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'nuclear density',
    make(rng) {
      const R0v = choose(rng, [1.1, 1.2, 1.3, 1.4]); const v = int(rng, 0, 2); const rho = 1.66e-27 / (4 / 3 * Math.PI * (R0v * 1e-15) ** 3);
      if (v === 0) return { R0v, v, ...NA3(rho / 1e17), unit: '×10¹⁷ kg/m³', q: `Taking $R = ${R0v}A^{1/3}$ fm and a nucleon mass of $1.66\\times10^{-27}$ kg, find the density of nuclear matter (in $10^{17}\\ \\mathrm{kg\\,m^{-3}}$).`, sol: `$\\rho = \\dfrac{A\\times1.66\\times10^{-27}}{\\dfrac43\\pi(${R0v}\\times10^{-15})^3A} = \\dfrac{1.66\\times10^{-27}}{${tx(4 / 3 * Math.PI * (R0v * 1e-15) ** 3, 4)}} = ${S(rho / 1e17, 4)}\\times10^{17}\\ \\mathrm{kg\\,m^{-3}}$. The $A$ cancels.` };
      if (v === 1) { const Vc = choose(rng, [1, 2, 5, 10]); return { R0v, Vc, v, ...NA3(rho * Vc * 1e-6 / 1e11), unit: '×10¹¹ kg', q: `Taking the density of nuclear matter as that of a nucleus with $R = ${R0v}A^{1/3}$ fm (nucleon mass $1.66\\times10^{-27}$ kg), find the mass of ${Vc} $\\mathrm{cm^3}$ of nuclear matter (in $10^{11}$ kg).`, sol: `$\\rho = ${S(rho / 1e17, 4)}\\times10^{17}\\ \\mathrm{kg\\,m^{-3}}$. ${Vc} $\\mathrm{cm^3} = ${Vc}\\times10^{-6}\\ \\mathrm{m^3}$. Mass $= \\rho V = ${S(rho * Vc * 1e-6 / 1e11, 4)}\\times10^{11}$ kg. A tonne is $10^3$ kg: this is millions of tonnes.` }; }
      const A = choose(rng, [8, 27, 64, 125]); const V = 4 / 3 * Math.PI * (R0v * 1e-15) ** 3 * A;
      return { R0v, A, v, ...NA3(V / 1e-44), unit: '×10⁻⁴⁴ m³', q: `Find the volume of a nucleus of mass number ${A} with $R = ${R0v}A^{1/3}$ fm (in $10^{-44}\\ \\mathrm{m^3}$).`, sol: `$V = \\dfrac43\\pi R^3 = \\dfrac43\\pi R_0^3A = \\dfrac43\\pi(${R0v}\\times10^{-15})^3\\times${A} = ${S(V / 1e-44, 4)}\\times10^{-44}\\ \\mathrm{m^3}$. Volume is proportional to $A$.` };
    },
    verify: (p) => { const rho = 1.66e-27 / (4 * Math.PI / 3 * (p.R0v * 1e-15) ** 3); return p.v === 0 ? rho / 1e17 : p.v === 1 ? rho * p.Vc * 1e-6 / 1e11 : (4 * Math.PI / 3) * (p.R0v ** 3) * p.A * 1e-45 / 1e-44; } },
  { id: 'nu-g03', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'binding energy',
    make(rng) {
      const [Z, A, key, tex] = choose(rng, NUCS); const M = MS[key]; const v = int(rng, 0, 2); const dm = Z * MS.H + (A - Z) * MS.n - M;
      const head = `The atomic mass of $${tex}$ is ${M.toFixed(6)} u ($m_H = 1.007825$ u, $m_n = 1.008665$ u, 1 u = 931.5 MeV$/c^2$).`;
      const w = `$\\Delta m = ${Z}(1.007825) + ${A - Z}(1.008665) - ${M.toFixed(6)} = ${dm.toFixed(6)}$ u.`;
      if (v === 0) return { Z, A, M, v, ...NA3(dm, 4), unit: 'u', q: `${head} Find its mass defect (in u).`, sol: `${w}` };
      if (v === 1) return { Z, A, M, v, ...NA3(dm * U), unit: 'MeV', q: `${head} Find its binding energy (in MeV).`, sol: `${w} $E_b = ${S(dm, 4)}\\times931.5 = ${S(dm * U, 4)}$ MeV.` };
      return { Z, A, M, v, ...NA3(dm * U / A), unit: 'MeV', q: `${head} Find its binding energy per nucleon (in MeV).`, sol: `${w} $E_b = ${S(dm * U, 4)}$ MeV. Per nucleon: $\\dfrac{${S(dm * U, 4)}}{${A}} = ${S(dm * U / A, 3)}$ MeV.` };
    },
    verify: (p) => { const dm = p.Z * 1.007825 + (p.A - p.Z) * 1.008665 - p.M; return p.v === 0 ? dm : p.v === 1 ? dm * 931.5 : dm * 931.5 / p.A; } },
  { id: 'nu-g04', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'Q value of a reaction',
    make(rng) {
      const ri = int(rng, 0, REACS.length - 1); const rc = REACS[ri]; const v = int(rng, 0, 1); const Q = rQ(rc);
      if (v === 0) return { ri, v, ...NA3(Q), unit: 'MeV', q: `In the reaction $${rtex(rc)}$ the atomic masses are: ${rmass(rc)}. Find the energy released (in MeV; 1 u = 931.5 MeV$/c^2$).`, sol: `Before: ${S(rc.L.reduce((s, k) => s + MS[k], 0), 7)} u. After: ${S(rc.Rr.reduce((s, k) => s + MS[k], 0), 7)} u. $\\Delta m = ${S(Q / U, 4)}$ u. $Q = ${S(Q / U, 4)}\\times931.5 = ${S(Q, 4)}$ MeV.` };
      return { ri, v, ...NA3(Q / rc.A, 3), unit: 'MeV', q: `In the reaction $${rtex(rc)}$ the atomic masses are: ${rmass(rc)}. Find the energy released per nucleon of the reactants (in MeV; 1 u = 931.5 MeV$/c^2$).`, sol: `$\\Delta m = ${S(Q / U, 4)}$ u, so $Q = ${S(Q, 4)}$ MeV. The reactants hold ${rc.A} nucleons in all: $\\dfrac{${S(Q, 4)}}{${rc.A}} = ${S(Q / rc.A, 3)}$ MeV per nucleon.` };
    },
    verify: (p) => { const rc = REACS[p.ri]; let m = 0; for (const k of rc.L) m += MS[k]; for (const k of rc.Rr) m -= MS[k]; return p.v === 0 ? m * 931.5 : m * 931.5 / rc.A; } },
  { id: 'nu-g05', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'alpha decay',
    make(rng) {
      const ai = int(rng, 0, 2); const [P, D, A, pt, dt] = ALPHA[ai]; const v = int(rng, 0, 2); const Q = (MS[P] - MS[D] - MS.He4) * U;
      const head = `$${pt}\\to${dt} + \\alpha$. Atomic masses: ${MS[P].toFixed(6)} u, ${MS[D].toFixed(6)} u, ${MS.He4.toFixed(6)} u.`;
      if (v === 0) return { ai, v, ...NA3(Q), unit: 'MeV', q: `${head} Find the energy released (in MeV; 1 u = 931.5 MeV$/c^2$).`, sol: `$\\Delta m = ${S(MS[P] - MS[D] - MS.He4, 4)}$ u, $Q = ${S(Q, 4)}$ MeV.` };
      if (v === 1) return { ai, v, ...NA3(Q * (A - 4) / A), unit: 'MeV', q: `${head} Find the kinetic energy of the alpha particle (in MeV; 1 u = 931.5 MeV$/c^2$; parent at rest).`, sol: `$Q = ${S(Q, 4)}$ MeV. Equal momenta: $K_\\alpha = Q\\dfrac{A-4}{A} = ${S(Q, 4)}\\times\\dfrac{${A - 4}}{${A}} = ${S(Q * (A - 4) / A, 4)}$ MeV.` };
      return { ai, v, ...NA3(Q * 4 / A, 3), unit: 'MeV', q: `${head} Find the recoil kinetic energy of the daughter nucleus (in MeV; 1 u = 931.5 MeV$/c^2$; parent at rest).`, sol: `$Q = ${S(Q, 4)}$ MeV. The daughter gets the fraction $\\dfrac{4}{A}$: $K_D = ${S(Q, 4)}\\times\\dfrac{4}{${A}} = ${S(Q * 4 / A, 3)}$ MeV.`, trap: 'The lighter alpha takes the larger share.' };
    },
    verify: (p) => { const [P, D, A] = ALPHA[p.ai]; const q = (MS[P] - MS[D] - MS.He4) * 931.5; return p.v === 0 ? q : p.v === 1 ? q - q * 4 / A : q * 4 / A; } },
  { id: 'nu-g06', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'beta decay Q-value',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const Q = (MS.C14 - MS.N14) * U * 1000; return { v, ...NA3(Q), unit: 'keV', q: `$^{14}\\mathrm C\\to^{14}\\mathrm N + e^- + \\bar\\nu$. Atomic masses: 14.003242 u and 14.003074 u. Find the maximum kinetic energy of the electron (in keV; 1 u = 931.5 MeV$/c^2$).`, sol: `$\\beta^-$: atomic masses can be used directly. $Q = (14.003242 - 14.003074)\\times931.5 = ${S(Q, 4)}$ keV.` }; }
      if (v === 1) { const Q = (MS.Na22 - MS.Ne22 - 2 * 0.000549) * U; return { v, ...NA3(Q), unit: 'MeV', q: `$^{22}\\mathrm{Na}\\to^{22}\\mathrm{Ne} + e^+ + \\nu$. Atomic masses: 21.994437 u and 21.991385 u; $m_e = 0.000549$ u. Find the Q-value (in MeV; 1 u = 931.5 MeV$/c^2$).`, sol: `$\\beta^+$: $Q = (M_P - M_D - 2m_e)c^2 = (21.994437 - 21.991385 - 0.001098)\\times931.5 = ${S(Q, 4)}$ MeV.`, trap: 'Subtract $2m_e$ for $\\beta^+$ decay.' }; }
      const Q = (MS.Be7 - MS.Li7) * U; return { v, ...NA3(Q), unit: 'MeV', q: `$^{7}\\mathrm{Be} + e^-\\to^{7}\\mathrm{Li} + \\nu$ (electron capture). Atomic masses: 7.016929 u and 7.016004 u. Find the energy released (in MeV; 1 u = 931.5 MeV$/c^2$).`, sol: `For electron capture the atomic masses are used directly: $Q = (7.016929 - 7.016004)\\times931.5 = ${S(Q, 4)}$ MeV.` };
    },
    verify: (p) => p.v === 0 ? (14.003242 - 14.003074) * 931.5 * 1000 : p.v === 1 ? (21.994437 - 21.991385 - 2 * 0.000549) * 931.5 : (7.016929 - 7.016004) * 931.5 },
  { id: 'nu-g07', type: 'nat', format: 'numeric', level: 2, exams: exFor(2, 'nat'), sub: 'decay law',
    make(rng) {
      const T = choose(rng, [2, 3, 5, 8, 10, 12, 20, 30]); const kk = int(rng, 2, 6); const N0 = choose(rng, [6.4e12, 3.2e12, 1.28e13, 4.8e11, 8e10, 2.56e12]); const v = int(rng, 0, 2); const unitT = choose(rng, ['hours', 'days', 'minutes', 'years']);
      if (v === 0) return { T, kk, N0, v, ...NA3(N0 / 2 ** kk / 1e10), unit: '×10¹⁰', q: `A sample starts with $${tx(N0, 3)}$ radioactive nuclei and has a half-life of ${T} ${unitT}. How many remain after ${T * kk} ${unitT} (in $10^{10}$)?`, sol: `${T * kk} ${unitT} is $\\dfrac{${T * kk}}{${T}} = ${kk}$ half-lives. $N = \\dfrac{N_0}{2^{${kk}}} = \\dfrac{${tx(N0, 3)}}{${2 ** kk}} = ${S(N0 / 2 ** kk / 1e10, 4)}\\times10^{10}$.` };
      if (v === 1) return { T, kk, v, ...NA3(100 / 2 ** kk, 3), unit: '%', q: `A radioactive nuclide has a half-life of ${T} ${unitT}. What percentage of the nuclei remains after ${T * kk} ${unitT}?`, sol: `$${T * kk}/${T} = ${kk}$ half-lives. Fraction $= \\left(\\dfrac12\\right)^{${kk}} = \\dfrac1{${2 ** kk}} = ${S(100 / 2 ** kk, 4)}\\%$.` };
      return { T, kk, v, answer: T * kk, tol: 0, unit: unitT, q: `A radioactive nuclide has a half-life of ${T} ${unitT}. How long does it take for the number of nuclei to fall to $\\dfrac1{${2 ** kk}}$ of its original value (in ${unitT})?`, sol: `$\\dfrac1{${2 ** kk}} = \\left(\\dfrac12\\right)^{${kk}}$, so ${kk} half-lives: $${kk}\\times${T} = ${T * kk}$ ${unitT}.` };
    },
    verify: (p) => p.v === 0 ? p.N0 * 0.5 ** p.kk / 1e10 : p.v === 1 ? 100 * 0.5 ** p.kk : p.T * Math.log2(2 ** p.kk) },
  { id: 'nu-g08', type: 'nat', format: 'numeric', level: 2, exams: exFor(2, 'nat'), sub: 'half-life, mean life and decay constant',
    make(rng) {
      const T = choose(rng, [2, 3, 5, 6, 8, 10, 12, 15, 20]); const v = int(rng, 0, 3);
      if (v === 0) return { T, v, ...NA3(T / Math.LN2), unit: 'min', q: `A nuclide has a half-life of ${T} minutes. Find its mean life (in minutes).`, sol: `$\\tau = \\dfrac{T_{1/2}}{\\ln2} = \\dfrac{${T}}{0.693} = ${S(T / Math.LN2, 4)}$ min.` };
      if (v === 1) return { T, v, ...NA3(Math.LN2 / T, 3), unit: '/min', q: `A nuclide has a half-life of ${T} minutes. Find its decay constant (in $\\mathrm{min^{-1}}$).`, sol: `$\\lambda = \\dfrac{\\ln2}{T_{1/2}} = \\dfrac{0.693}{${T}} = ${S(Math.LN2 / T, 4)}\\ \\mathrm{min^{-1}}$.` };
      if (v === 2) { const tau = +(T / Math.LN2).toFixed(2); return { T, tau, v, ...NA3(tau * Math.LN2, 3), unit: 'min', q: `The mean life of a nuclide is ${tau} minutes. Find its half-life (in minutes).`, sol: `$T_{1/2} = \\tau\\ln2 = ${tau}\\times0.693 = ${S(tau * Math.LN2, 4)}$ min.` }; }
      const lam = +(Math.LN2 / T).toFixed(4); return { T, lam, v, ...NA3(Math.LN2 / lam, 3), unit: 'min', q: `The decay constant of a nuclide is ${lam} $\\mathrm{min^{-1}}$. Find its half-life (in minutes).`, sol: `$T_{1/2} = \\dfrac{0.693}{\\lambda} = \\dfrac{0.693}{${lam}} = ${S(Math.LN2 / lam, 4)}$ min.` };
    },
    verify: (p) => p.v === 0 ? p.T / Math.log(Math.E ** Math.LN2) : p.v === 1 ? Math.log(2) / p.T : p.v === 2 ? p.tau * Math.log(2) : Math.log(2) / p.lam },
  { id: 'nu-g09', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'activity',
    make(rng) {
      const N = choose(rng, [2e12, 5e12, 8e12, 1e13, 4e13]); const T = choose(rng, [1, 2, 6, 12, 24]); const v = int(rng, 0, 2); const lam = Math.LN2 / (T * 3600);
      if (v === 0) return { N, T, v, ...NA3(lam * N / 1e7), unit: '×10⁷ Bq', q: `A sample has $${tx(N, 3)}$ nuclei of a nuclide of half-life ${T} hour${T > 1 ? 's' : ''}. Find its activity (in $10^7$ Bq).`, sol: `$\\lambda = \\dfrac{0.693}{${T}\\times3600} = ${tx(lam, 4)}\\ \\mathrm{s^{-1}}$. $A = \\lambda N = ${S(lam * N / 1e7, 4)}\\times10^7$ Bq.` };
      if (v === 1) { const A = lam * N; const Ar = +(A / 1e6).toPrecision(3); return { N, T, Ar, v, ...NA3(Ar * 1e6 / lam / 1e12, 3), unit: '×10¹²', q: `A source of half-life ${T} hour${T > 1 ? 's' : ''} has an activity of ${Ar} MBq. How many radioactive nuclei does it contain (in $10^{12}$)?`, sol: `$\\lambda = \\dfrac{0.693}{${T}\\times3600} = ${tx(lam, 4)}\\ \\mathrm{s^{-1}}$. $N = \\dfrac A\\lambda = \\dfrac{${Ar}\\times10^6}{${tx(lam, 4)}} = ${S(Ar * 1e6 / lam / 1e12, 4)}\\times10^{12}$.` }; }
      const A = lam * N; return { N, T, v, ...NA3(A / 3.7e10 * 1e3, 3), unit: 'mCi', q: `A sample of $${tx(N, 3)}$ nuclei has a half-life of ${T} hour${T > 1 ? 's' : ''}. Find its activity in millicuries (1 Ci $= 3.7\\times10^{10}$ Bq).`, sol: `$\\lambda = ${tx(lam, 4)}\\ \\mathrm{s^{-1}}$, $A = \\lambda N = ${tx(A, 4)}$ Bq $= \\dfrac{${tx(A, 4)}}{3.7\\times10^{10}}$ Ci $= ${S(A / 3.7e10 * 1e3, 4)}$ mCi.` };
    },
    verify: (p) => { const lam = Math.log(2) / (p.T * 3600); return p.v === 0 ? lam * p.N / 1e7 : p.v === 1 ? p.Ar * 1e6 / lam / 1e12 : lam * p.N / 3.7e10 * 1e3; } },
  { id: 'nu-g10', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'activity of a mass',
    make(rng) {
      const iso = choose(rng, [['^{226}\\mathrm{Ra}', 226, 1600], ['^{60}\\mathrm{Co}', 60, 5.27], ['^{90}\\mathrm{Sr}', 90, 28.8], ['^{137}\\mathrm{Cs}', 137, 30.1]]); const m = choose(rng, [0.5, 1, 2, 5, 10]);
      const [tex, Ma, Ty] = iso; const lam = Math.LN2 / (Ty * YR); const N = m / Ma * NA_; const A = lam * N;
      return { Ma, Ty, m, ...NA3(A / 3.7e10), unit: 'Ci', q: `The half-life of $${tex}$ is ${Ty} years. Find the activity of ${m} g of it (in curies; $N_A = 6.022\\times10^{23}$, 1 y $= 3.156\\times10^7$ s, 1 Ci $= 3.7\\times10^{10}$ Bq; molar mass ${Ma} g).`, sol: `$\\lambda = \\dfrac{0.693}{${Ty}\\times3.156\\times10^7} = ${tx(lam, 4)}\\ \\mathrm{s^{-1}}$. $N = \\dfrac{${m}}{${Ma}}\\times6.022\\times10^{23} = ${tx(N, 4)}$. $A = \\lambda N = ${tx(A, 4)}$ Bq $= ${S(A / 3.7e10, 4)}$ Ci.` };
    },
    verify: (p) => (Math.log(2) / (p.Ty * 3.156e7)) * (p.m * 6.022e23 / p.Ma) / 3.7e10 },
  { id: 'nu-g11', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'radioactive dating',
    make(rng) {
      const f = choose(rng, [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.1]); const v = int(rng, 0, 2); const t = 5730 * Math.log2(1 / f);
      if (v === 0) return { f, v, ...NA3(t), unit: 'years', q: `The carbon-14 activity of a bone is ${f * 100}% of that of living bone. Find its age (in years; half-life 5730 y).`, sol: `$\\dfrac A{A_0} = 2^{-t/T}$, so $t = T\\log_2\\dfrac{A_0}{A} = 5730\\times\\log_2\\dfrac{1}{${f}} = 5730\\times${S(Math.log2(1 / f), 4)} = ${S(t, 4)}$ y.` };
      if (v === 1) { const age = choose(rng, [2000, 3000, 5000, 8000, 10000, 15000]); const fr = 0.5 ** (age / 5730); return { age, v, ...NA3(fr * 100), unit: '%', q: `A wooden object is ${age} years old. What percentage of the original carbon-14 activity does it show (half-life 5730 y)?`, sol: `$\\dfrac A{A_0} = 2^{-${age}/5730} = 2^{-${S(age / 5730, 4)}} = ${S(fr, 4)}$, that is ${S(fr * 100, 4)}%.` }; }
      const mass = choose(rng, [5, 10, 20]); const rate0 = 15; const meas = +(rate0 * mass * f).toFixed(2);
      return { f, mass, rate0, meas, v, ...NA3(5730 * Math.log2(rate0 * mass / meas)), unit: 'years', q: `Living wood gives ${rate0} decays per minute per gram of carbon. A charcoal sample with ${mass} g of carbon gives ${meas} decays per minute. Find its age (in years; half-life of $^{14}\\mathrm C$ = 5730 y).`, sol: `Living wood would give $${rate0}\\times${mass} = ${rate0 * mass}$ decays per minute from this much carbon. $t = 5730\\log_2\\dfrac{${rate0 * mass}}{${meas}} = ${S(5730 * Math.log2(rate0 * mass / meas), 4)}$ y.` };
    },
    verify: (p) => p.v === 0 ? 5730 * Math.log(1 / p.f) / Math.log(2) : p.v === 1 ? 100 * Math.exp(-Math.log(2) * p.age / 5730) : 5730 * Math.log((p.rate0 * p.mass) / p.meas) / Math.log(2) },
  { id: 'nu-g12', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'half-life from data',
    make(rng) {
      const kk = int(rng, 2, 5); const t = choose(rng, [30, 45, 60, 90, 120, 150]); const A2 = choose(rng, [50, 100, 200, 250]); const A1 = A2 * 2 ** kk; const v = int(rng, 0, 1);
      if (v === 0) return { kk, t, A1, A2, v, ...NA3(t / kk), unit: 'min', q: `The count rate of a sample falls from ${A1} to ${A2} counts per second in ${t} minutes. Find its half-life (in minutes).`, sol: `$\\dfrac{${A1}}{${A2}} = ${2 ** kk} = 2^{${kk}}$: ${kk} half-lives in ${t} minutes. $T_{1/2} = \\dfrac{${t}}{${kk}} = ${S(t / kk, 4)}$ min.` };
      const T = t / kk; return { kk, t, A1, A2, v, ...NA3(T / Math.LN2), unit: 'min', q: `The count rate of a sample falls from ${A1} to ${A2} counts per second in ${t} minutes. Find its mean life (in minutes).`, sol: `$\\dfrac{${A1}}{${A2}} = 2^{${kk}}$, so the half-life is $\\dfrac{${t}}{${kk}} = ${S(T, 4)}$ min. $\\tau = \\dfrac{T_{1/2}}{0.693} = ${S(T / Math.LN2, 4)}$ min.`, trap: 'Mean life is 1.44 times the half-life.' };
    },
    verify: (p) => { const T = p.t * Math.log(2) / Math.log(p.A1 / p.A2); return p.v === 0 ? T : T / Math.log(2); } },
  { id: 'nu-g13', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'mean life and the exponential law',
    make(rng) {
      const j = choose(rng, [0.5, 1, 2, 3]); const v = int(rng, 0, 1);
      if (v === 0) return { j, v, ...NA3(Math.exp(-j) * 100), unit: '%', q: `What percentage of a radioactive sample remains after a time equal to ${j} mean lives ($e = 2.718$)?`, sol: `$\\dfrac N{N_0} = e^{-t/\\tau} = e^{-${j}} = ${S(Math.exp(-j), 4)}$, that is ${S(Math.exp(-j) * 100, 4)}%.` };
      const T = choose(rng, [4, 6, 10]);
      const tt = j * T; return { j, T, v, ...NA3(100 * 0.5 ** (tt / T)), unit: '%', q: `A nuclide has a half-life of ${T} days. What percentage remains after ${tt} days?`, sol: `$\\dfrac N{N_0} = 2^{-t/T} = 2^{-${j}} = ${S(0.5 ** j, 4)}$, that is ${S(100 * 0.5 ** j, 4)}%.` };
    },
    verify: (p) => p.v === 0 ? 100 * Math.exp(-p.j) : 100 * Math.pow(2, -p.j) },
  { id: 'nu-g14', type: 'nat', format: 'integer', level: 3, exams: exFor(3, 'nat'), sub: 'decay series',
    make(rng) {
      const a = int(rng, 3, 8); const b = int(rng, 2, 6); const Ad = int(rng, 200, 210); const Zd = int(rng, 78, 84);
      const A0 = Ad + 4 * a; const Z0 = Zd + 2 * a - b; const v = int(rng, 0, 1);
      return { a, b, A0, Z0, Ad, Zd, v, answer: v === 0 ? a : b, tol: 0, q: `A nucleus with mass number ${A0} and atomic number ${Z0} decays by emitting alpha and $\\beta^-$ particles to a stable nucleus of mass number ${Ad} and atomic number ${Zd}. How many ${v === 0 ? 'alpha' : '$\\beta^-$'} particles are emitted?`,
        sol: `Alpha particles: $\\dfrac{${A0} - ${Ad}}{4} = ${a}$. These lower $Z$ by $2\\times${a} = ${2 * a}$, giving $${Z0 - 2 * a}$. The daughter has $Z = ${Zd}$, so $\\beta^-$ particles must raise $Z$ by $${Zd} - ${Z0 - 2 * a} = ${b}$: ${b} $\\beta^-$ particles.` };
    },
    verify: (p) => { const al = (p.A0 - p.Ad) / 4; return p.v === 0 ? al : p.Zd - (p.Z0 - 2 * al); } },
  { id: 'nu-g15', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'secular equilibrium',
    make(rng) {
      const pr = choose(rng, [['^{226}\\mathrm{Ra}', '^{222}\\mathrm{Rn}', 1600 * 365.25, 3.8, 226, 222, 'days'], ['^{90}\\mathrm{Sr}', '^{90}\\mathrm{Y}', 28.8 * 365.25 * 24, 64, 90, 90, 'hours'], ['^{137}\\mathrm{Cs}', '^{137\\mathrm m}\\mathrm{Ba}', 30.1 * 365.25 * 24 * 60, 2.55, 137, 137, 'minutes']]);
      const [P, D, T1, T2, A1, A2, un] = pr; const v = int(rng, 0, 1); const rat = T2 / T1; const T1txt = un === 'days' ? '1600 years' : un === 'hours' ? '28.8 years' : '30.1 years';
      if (v === 0) return { T1, T2, v, ...NA3(rat / 1e-6), unit: '×10⁻⁶', q: `$${P}$ (half-life ${T1txt}) decays to $${D}$ (half-life ${T2} ${un}). In equilibrium, find $N_D/N_P$ (in $10^{-6}$; 1 year = 365.25 days).`, sol: `In equilibrium $\\lambda_PN_P = \\lambda_DN_D$, so $\\dfrac{N_D}{N_P} = \\dfrac{T_D}{T_P} = \\dfrac{${T2}\\ \\text{${un}}}{${T1txt}} = ${S(rat / 1e-6, 4)}\\times10^{-6}$.` };
      const m = choose(rng, [1, 2, 5, 10]); const mass = m * rat * A2 / A1 * 1e6; return { T1, T2, A1, A2, m, v, ...NA3(mass), unit: 'μg', q: `$${P}$ (half-life ${T1txt}) decays to $${D}$ (half-life ${T2} ${un}). Find the mass of $${D}$ in equilibrium with ${m} g of $${P}$ (in $\\mu$g; mass numbers ${A1} and ${A2}; 1 year = 365.25 days).`, sol: `$\\dfrac{N_D}{N_P} = \\dfrac{T_D}{T_P} = ${tx(rat, 4)}$. Mass ratio $= \\dfrac{N_D}{N_P}\\times\\dfrac{${A2}}{${A1}} = ${tx(rat * A2 / A1, 4)}$. Mass of daughter $= ${m}\\times${tx(rat * A2 / A1, 4)}$ g $= ${S(mass, 4)}\\ \\mu$g.` };
    },
    verify: (p) => p.v === 0 ? p.T2 / p.T1 / 1e-6 : p.m * (p.T2 / p.T1) * (p.A2 / p.A1) * 1e6 },
  { id: 'nu-g16', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'parallel decay',
    make(rng) {
      const T1 = choose(rng, [10, 20, 30, 40, 50]); const T2 = choose(rng, [15, 30, 60, 90]); const v = int(rng, 0, 1);
      const Te = 1 / (1 / T1 + 1 / T2);
      if (v === 0) return { T1, T2, v, ...NA3(Te), unit: 'years', q: `A nuclide decays by two independent routes with partial half-lives ${T1} years and ${T2} years. Find its overall half-life (in years).`, sol: `Decay constants add: $\\dfrac1T = \\dfrac1{${T1}} + \\dfrac1{${T2}} = ${S(1 / T1 + 1 / T2, 4)}$, so $T = ${S(Te, 4)}$ years.`, trap: 'Add the rates (1/T), not the half-lives.' };
      return { T1, T2, v, ...NA3(100 * T2 / (T1 + T2)), unit: '%', q: `A nuclide decays by route 1 (partial half-life ${T1} years) or route 2 (partial half-life ${T2} years). What percentage of the decays go by route 1?`, sol: `Fraction by route 1 $= \\dfrac{\\lambda_1}{\\lambda_1 + \\lambda_2} = \\dfrac{1/${T1}}{1/${T1} + 1/${T2}} = \\dfrac{${T2}}{${T1} + ${T2}} = ${S(T2 / (T1 + T2), 4)}$, that is ${S(100 * T2 / (T1 + T2), 4)}%.` };
    },
    verify: (p) => { const l1 = Math.log(2) / p.T1; const l2 = Math.log(2) / p.T2; return p.v === 0 ? Math.log(2) / (l1 + l2) : 100 * l1 / (l1 + l2); } },
  { id: 'nu-g17', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'fission energy',
    make(rng) {
      const E = choose(rng, [190, 195, 200, 205, 210]); const v = int(rng, 0, 2); const P = choose(rng, [100, 200, 300, 600, 1000]);
      const Ef = E * MEV;
      if (v === 0) return { E, v, ...NA3(1000 / 235 * NA_ * Ef / 1e13), unit: '×10¹³ J', q: `Each fission of $^{235}\\mathrm U$ releases ${E} MeV. Find the energy from the complete fission of 1 kg of $^{235}\\mathrm U$ (in $10^{13}$ J; $N_A = 6.022\\times10^{23}$, 1 MeV $= 1.602\\times10^{-13}$ J).`, sol: `Atoms in 1 kg $= \\dfrac{1000}{235}\\times6.022\\times10^{23} = 2.563\\times10^{24}$. Energy $= 2.563\\times10^{24}\\times${E}\\times1.602\\times10^{-13} = ${S(1000 / 235 * NA_ * Ef / 1e13, 4)}\\times10^{13}$ J.` };
      if (v === 1) return { E, P, v, ...NA3(P * 1e6 / Ef / 1e18), unit: '×10¹⁸ /s', q: `A reactor has a thermal power of ${P} MW and each fission releases ${E} MeV. How many fissions occur per second (in $10^{18}$; 1 MeV $= 1.602\\times10^{-13}$ J)?`, sol: `Energy per fission $= ${E}\\times1.602\\times10^{-13} = ${tx(Ef, 4)}$ J. Rate $= \\dfrac{${P}\\times10^6}{${tx(Ef, 4)}} = ${S(P * 1e6 / Ef / 1e18, 4)}\\times10^{18}\\ \\mathrm{s^{-1}}$.` };
      const g = P * 1e6 / Ef * 86400 / NA_ * 235; return { E, P, v, ...NA3(g), unit: 'g', q: `A reactor has a thermal power of ${P} MW and each fission releases ${E} MeV. Find the mass of $^{235}\\mathrm U$ fissioned per day (in g; $N_A = 6.022\\times10^{23}$, 1 MeV $= 1.602\\times10^{-13}$ J).`, sol: `Fissions per second $= \\dfrac{${P}\\times10^6}{${tx(Ef, 4)}} = ${tx(P * 1e6 / Ef, 4)}$. Per day: $\\times86\\,400 = ${tx(P * 1e6 / Ef * 86400, 4)}$. Moles $= \\dfrac{${tx(P * 1e6 / Ef * 86400, 4)}}{6.022\\times10^{23}}$, mass $= \\text{moles}\\times235 = ${S(g, 4)}$ g.` };
    },
    verify: (p) => { const Ef = p.E * 1.602e-13; return p.v === 0 ? 1000 / 235 * 6.022e23 * Ef / 1e13 : p.v === 1 ? p.P * 1e6 / Ef / 1e18 : (p.P * 1e6 * 86400 / Ef) / 6.022e23 * 235; } },
  { id: 'nu-g18', type: 'nat', format: 'numeric', level: 2, exams: exFor(2, 'nat'), sub: 'reactor power and efficiency',
    make(rng) {
      const Pe = choose(rng, [100, 200, 300, 500, 700, 1000]); const eta = choose(rng, [25, 30, 33, 35, 40]); const v = int(rng, 0, 2); const Pt = Pe * 100 / eta;
      if (v === 0) return { Pe, eta, v, ...NA3(Pt), unit: 'MW', q: `A nuclear power station delivers ${Pe} MW of electrical power at ${eta}% efficiency. Find the thermal power of the reactor (in MW).`, sol: `Thermal power $= \\dfrac{\\text{electrical}}{\\text{efficiency}} = \\dfrac{${Pe}}{${eta / 100}} = ${S(Pt, 4)}$ MW.` };
      if (v === 1) return { Pt, eta, v, ...NA3(Pt * eta / 100), unit: 'MW', q: `A reactor produces ${S(Pt, 4)} MW of heat and the plant is ${eta}% efficient. Find its electrical output (in MW).`, sol: `Electrical output $= ${eta / 100}\\times${S(Pt, 4)} = ${S(Pt * eta / 100, 4)}$ MW.` };
      const Pt2 = Pe * 3; return { Pe, Pt2, v, ...NA3(Pe / Pt2 * 100), unit: '%', q: `A power station produces ${Pe} MW of electrical power from a reactor with a thermal power of ${Pt2} MW. Find its efficiency (in %).`, sol: `Efficiency $= \\dfrac{${Pe}}{${Pt2}} = ${S(Pe / Pt2, 4)}$, that is ${S(Pe / Pt2 * 100, 4)}%.` };
    },
    verify: (p) => p.v === 0 ? p.Pe / (p.eta / 100) : p.v === 1 ? p.Pt * p.eta / 100 : p.Pe / p.Pt2 * 100 },
  { id: 'nu-g19', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'energy of the Sun',
    make(rng) {
      const P = choose(rng, [3.8, 3.85, 3.9]) * 1e26; const v = int(rng, 0, 1);
      if (v === 0) return { P, v, ...NA3(P / 9e16 / 1e9), unit: '×10⁹ kg/s', q: `The Sun radiates $${tx(P, 3)}$ W. Find the mass converted into energy each second (in $10^9$ kg; $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$).`, sol: `$\\dfrac{dm}{dt} = \\dfrac{P}{c^2} = \\dfrac{${tx(P, 3)}}{9\\times10^{16}} = ${S(P / 9e16 / 1e9, 4)}\\times10^9\\ \\mathrm{kg\\,s^{-1}}$.` };
      const Q = (4 * MS.H - MS.He4) * U; const rate = P / (Q * MEV); const mh = rate * 4 * 1.673e-27;
      return { P, v, ...NA3(mh / 1e11), unit: '×10¹¹ kg/s', q: `The Sun radiates $${tx(P, 3)}$ W by fusing four protons into one helium nucleus, releasing 26.7 MeV each time. Find the mass of hydrogen consumed per second (in $10^{11}$ kg; proton mass $1.673\\times10^{-27}$ kg, 1 MeV $= 1.602\\times10^{-13}$ J).`, sol: `Reactions per second $= \\dfrac{${tx(P, 3)}}{26.73\\times1.602\\times10^{-13}} = ${tx(P / (26.73 * MEV), 4)}$. Each uses 4 protons: $${tx(P / (26.73 * MEV), 4)}\\times4\\times1.673\\times10^{-27} = ${S(P / (26.73 * MEV) * 4 * 1.673e-27 / 1e11, 4)}\\times10^{11}$ kg per second.` };
    },
    verify: (p) => p.v === 0 ? p.P / (3e8 ** 2) / 1e9 : (p.P / ((4 * 1.007825 - 4.002603) * 931.5 * 1.602e-13)) * 4 * 1.673e-27 / 1e11 },
  { id: 'nu-g20', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'chain reaction growth',
    make(rng) {
      const k1 = choose(rng, [1.02, 1.05, 1.1, 1.2]); const n = choose(rng, [10, 20, 30, 50]); const v = int(rng, 0, 2);
      if (v === 0) return { k1, n, v, ...NA3(k1 ** n), q: `A reactor has a multiplication factor $k = ${k1}$. By what factor does the number of fissions per generation grow after ${n} generations?`, sol: `Factor $= k^n = ${k1}^{${n}} = ${S(k1 ** n, 4)}$.` };
      if (v === 1) { const F = choose(rng, [10, 100, 1000]); return { k1, F, v, ...NA3(Math.log(F) / Math.log(k1)), unit: 'generations', q: `A reactor has $k = ${k1}$. After how many generations has the number of fissions per generation grown by a factor ${F}?`, sol: `$${k1}^n = ${F}$, so $n = \\dfrac{\\ln${F}}{\\ln${k1}} = \\dfrac{${S(Math.log(F), 4)}}{${S(Math.log(k1), 4)}} = ${S(Math.log(F) / Math.log(k1), 4)}$.` }; }
      const g = choose(rng, [1, 2, 5, 10]); return { k1, g, v, ...NA3(g * Math.log(2) / Math.log(k1)), unit: 'ms', q: `A reactor has $k = ${k1}$ and a generation time of ${g} ms. Find the time for the power to double (in ms).`, sol: `Doubling needs $n = \\dfrac{\\ln2}{\\ln${k1}} = ${S(Math.log(2) / Math.log(k1), 4)}$ generations, so $t = ${g}\\times${S(Math.log(2) / Math.log(k1), 4)} = ${S(g * Math.log(2) / Math.log(k1), 4)}$ ms.` };
    },
    verify: (p) => p.v === 0 ? Math.exp(p.n * Math.log(p.k1)) : p.v === 1 ? Math.log10(p.F) / Math.log10(p.k1) : p.g * Math.log2(2) * Math.log(2) / Math.log(p.k1) },
  { id: 'nu-g21', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'gamma rays',
    make(rng) {
      const E = choose(rng, [0.511, 0.662, 1.17, 1.33, 2.0, 2.62]); const v = int(rng, 0, 2); const A = choose(rng, [24, 60, 137, 208]);
      if (v === 0) return { E, v, ...NA3(1240 / E), unit: 'fm', q: `Find the wavelength of a ${E} MeV gamma photon (in fm; $hc = 1240$ MeV fm).`, sol: `$\\lambda = \\dfrac{hc}{E} = \\dfrac{1240}{${E}} = ${S(1240 / E, 4)}$ fm.` };
      if (v === 1) return { E, A, v, ...NA3(E * E / (2 * A * 931.5) * 1e6), unit: 'eV', q: `A nucleus of mass number ${A} (take its rest energy as ${A}$\\times$931.5 MeV) at rest emits a ${E} MeV gamma ray. Find its recoil kinetic energy (in eV; $K = E_\\gamma^2/2Mc^2$).`, sol: `$K = \\dfrac{E_\\gamma^2}{2Mc^2} = \\dfrac{${E}^2}{2\\times${S(A * 931.5, 6)}}$ MeV $= ${S(E * E / (2 * A * 931.5) * 1e6, 4)}$ eV.` };
      const p = E * 1.602e-13 / 3e8; return { E, v, ...NA3(p * 1e22), unit: '×10⁻²² kg m/s', q: `Find the momentum of a ${E} MeV gamma photon (in $10^{-22}$ kg m/s; $c = 3\\times10^8\\ \\mathrm{m\\,s^{-1}}$, 1 MeV $= 1.602\\times10^{-13}$ J).`, sol: `$p = \\dfrac Ec = \\dfrac{${E}\\times1.602\\times10^{-13}}{3\\times10^8} = ${S(p * 1e22, 4)}\\times10^{-22}$ kg m/s.` };
    },
    verify: (p) => p.v === 0 ? 1240 / p.E : p.v === 1 ? p.E ** 2 / (2 * p.A * 931.5) * 1e6 : p.E * 1.602e-13 / 3e8 * 1e22 },
  { id: 'nu-g22', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'separation energy',
    make(rng) {
      const cases = [['^{4}\\mathrm{He}', '^{3}\\mathrm{He}', 'neutron', MS.He4, MS.He3, MS.n, 'He4', 'He3', 'n'], ['^{7}\\mathrm{Li}', '^{6}\\mathrm{Li}', 'neutron', MS.Li7, MS.Li6, MS.n, 'Li7', 'Li6', 'n'], ['^{16}\\mathrm{O}', '^{15}\\mathrm{O}', 'neutron', MS.O16, MS.O15, MS.n, 'O16', 'O15', 'n'], ['^{16}\\mathrm{O}', '^{15}\\mathrm{N}', 'proton', MS.O16, MS.N15, MS.H, 'O16', 'N15', 'H']];
      const ci = int(rng, 0, 3); const [P, D, part, mp, md, mx, kp, kd, kx] = cases[ci]; const S1 = (md + mx - mp) * U;
      return { ci, ...NA3(S1), unit: 'MeV', q: `Find the energy needed to remove one ${part} from $${P}$, leaving $${D}$. Atomic masses: $${P}$ = ${mp.toFixed(6)} u, $${D}$ = ${md.toFixed(6)} u, ${part === 'neutron' ? 'neutron' : '$^{1}_{1}\\mathrm H$ atom'} = ${mx.toFixed(6)} u (1 u = 931.5 MeV$/c^2$).`, sol: `$\\Delta m = ${md.toFixed(6)} + ${mx.toFixed(6)} - ${mp.toFixed(6)} = ${S(S1 / U, 4)}$ u. Separation energy $= ${S(S1 / U, 4)}\\times931.5 = ${S(S1, 4)}$ MeV.` };
    },
    verify: (p) => { const T = [[MS.He4, MS.He3, MS.n], [MS.Li7, MS.Li6, MS.n], [MS.O16, MS.O15, MS.n], [MS.O16, MS.N15, MS.H]][p.ci]; return (T[1] + T[2] - T[0]) * 931.5; } },
  { id: 'nu-g23', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'Coulomb barrier',
    make(rng) {
      const pj = choose(rng, [[1, 1, 'proton'], [2, 4, 'alpha particle']]); const tg = choose(rng, [[13, 27, 'aluminium'], [26, 56, 'iron'], [29, 64, 'copper'], [79, 197, 'gold']]);
      const [z, Ap, pn] = pj; const [Z, At, tn] = tg; const sep = 1.2 * (Math.cbrt(Ap) + Math.cbrt(At)); const Ub = 1.44 * z * Z / sep;
      return { z, Ap, Z, At, ...NA3(Ub), unit: 'MeV', q: `Estimate the Coulomb barrier for a ${pn} (mass number ${Ap}) approaching a ${tn} nucleus ($Z = ${Z}$, $A = ${At}$). Take the touching distance as $R_0(A_p^{1/3} + A_t^{1/3})$ with $R_0 = 1.2$ fm, and $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm (in MeV).`, sol: `Separation $= 1.2\\times(${Ap}^{1/3} + ${At}^{1/3}) = 1.2\\times(${S(Math.cbrt(Ap), 4)} + ${S(Math.cbrt(At), 4)}) = ${S(sep, 4)}$ fm. $U = \\dfrac{1.44\\times${z}\\times${Z}}{${S(sep, 4)}} = ${S(Ub, 4)}$ MeV.` };
    },
    verify: (p) => 1.44 * p.z * p.Z / (1.2 * (p.Ap ** (1 / 3) + p.At ** (1 / 3))) },
  { id: 'nu-g24', type: 'nat', format: 'numeric', level: 3, exams: exFor(3, 'nat'), sub: 'temperature for fusion',
    make(rng) {
      const K = choose(rng, [10, 20, 50, 100, 200]); const v = int(rng, 0, 1); const kB = 1.381e-23;
      if (v === 0) { const T = 2 * K * 1e3 * QE / (3 * kB); return { K, v, ...NA3(T / 1e8), unit: '×10⁸ K', q: `Nuclei in a plasma have an average kinetic energy of ${K} keV. Find the temperature (in $10^8$ K; $\\bar K = \\tfrac32kT$, $k = 1.381\\times10^{-23}\\ \\mathrm{J\\,K^{-1}}$, $e = 1.602\\times10^{-19}$ C).`, sol: `$T = \\dfrac{2\\bar K}{3k} = \\dfrac{2\\times${K}\\times10^3\\times1.602\\times10^{-19}}{3\\times1.381\\times10^{-23}} = ${S(T / 1e8, 4)}\\times10^8$ K.` }; }
      const T8 = choose(rng, [1, 2, 5, 10, 15]); const Kk = 1.5 * kB * T8 * 1e8 / QE / 1e3; return { T8, v, ...NA3(Kk), unit: 'keV', q: `A plasma is at $${T8}\\times10^8$ K. Find the average kinetic energy of its particles (in keV; $\\bar K = \\tfrac32kT$, $k = 1.381\\times10^{-23}\\ \\mathrm{J\\,K^{-1}}$, $e = 1.602\\times10^{-19}$ C).`, sol: `$\\bar K = \\tfrac32kT = 1.5\\times1.381\\times10^{-23}\\times${T8}\\times10^8 = ${tx(1.5 * kB * T8 * 1e8, 4)}$ J $= ${S(Kk, 4)}$ keV.` };
    },
    verify: (p) => p.v === 0 ? 2 * p.K * 1e3 * 1.602e-19 / (3 * 1.381e-23) / 1e8 : 1.5 * 1.381e-23 * p.T8 * 1e8 / 1.602e-19 / 1e3 },
  { id: 'nu-g25', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'threshold energy',
    make(rng) {
      const Qm = choose(rng, [-1.19, -1.65, -2.4, -0.78]); const pj = choose(rng, [[4, '\\alpha'], [1, 'p'], [2, 'd']]); const At = choose(rng, [7, 14, 27]);
      const th = -Qm * (pj[0] + At) / At;
      return { Qm, pj, At, ...NA3(th), unit: 'MeV', q: `A reaction between a projectile of mass number ${pj[0]} ($${pj[1]}$) and a stationary target of mass number ${At} has $Q = ${Qm}$ MeV. Find the minimum kinetic energy of the projectile for the reaction to occur (in MeV; use mass numbers as mass ratios).`, sol: `$K_{th} = |Q|\\dfrac{m_p + m_t}{m_t} = ${-Qm}\\times\\dfrac{${pj[0]} + ${At}}{${At}} = ${S(th, 4)}$ MeV.`, trap: 'The threshold is above |Q|: the moving centre of mass keeps some energy.' };
    },
    verify: (p) => Math.abs(p.Qm) * (1 + p.pj[0] / p.At) },
  { id: 'nu-g26', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'production and decay',
    make(rng) {
      const R = choose(rng, [1e5, 1e6, 5e6, 2e7]); const T = choose(rng, [5, 10, 20, 60]); const v = int(rng, 0, 2);
      const Ninf = R * T / Math.LN2;
      if (v === 0) return { R, T, v, ...NA3(Ninf / 1e6), unit: '×10⁶', q: `A radioactive isotope of half-life ${T} s is made at a constant rate of $${tx(R, 2)}$ nuclei per second. Find the number of nuclei present after a very long time (in millions).`, sol: `Production equals decay: $R = \\lambda N_\\infty$, so $N_\\infty = \\dfrac{R\\,T_{1/2}}{\\ln2} = \\dfrac{${tx(R, 2)}\\times${T}}{0.693} = ${S(Ninf / 1e6, 4)}\\times10^6$.` };
      if (v === 1) { const k2 = int(rng, 1, 5); return { R, T, k2, v, ...NA3(100 * (1 - 0.5 ** k2)), unit: '%', q: `A radioactive isotope of half-life ${T} s is made at a constant rate. What percentage of its final (equilibrium) number is present after ${T * k2} s, starting from none?`, sol: `$N = N_\\infty(1 - 2^{-t/T}) = N_\\infty(1 - 2^{-${k2}}) = ${S(1 - 0.5 ** k2, 4)}N_\\infty$, that is ${S(100 * (1 - 0.5 ** k2), 4)}%.` }; }
      return { R, T, v, ...NA3(R / 1e5), unit: '×10⁵ Bq', q: `A radioactive isotope of half-life ${T} s is made at a constant rate of $${tx(R, 2)}$ nuclei per second. Find its activity after a very long time (in $10^5$ Bq).`, sol: `At equilibrium the decay rate equals the production rate, so $A = R = ${tx(R, 2)}$ Bq $= ${S(R / 1e5, 4)}\\times10^5$ Bq.`, trap: 'The half-life does not matter for the final activity.' };
    },
    verify: (p) => p.v === 0 ? p.R * p.T / Math.log(2) / 1e6 : p.v === 1 ? 100 * (1 - Math.pow(2, -p.k2)) : p.R / 1e5 },
  { id: 'nu-g27', type: 'nat', format: 'numeric', level: 4, exams: exFor(4, 'nat'), sub: 'neutron moderation',
    make(rng) {
      const A = choose(rng, [2, 4, 9, 12, 56]); const v = int(rng, 0, 1);
      if (v === 0) return { A, v, ...NA3(4 * A / (1 + A) ** 2 * 100), unit: '%', q: `A neutron makes a head-on elastic collision with a stationary nucleus of mass number ${A}. What percentage of its kinetic energy does it lose? (Use $\\Delta K/K = 4A/(1+A)^2$.)`, sol: `$\\dfrac{\\Delta K}{K} = \\dfrac{4A}{(1 + A)^2} = \\dfrac{4\\times${A}}{${(1 + A) ** 2}} = ${S(4 * A / (1 + A) ** 2, 4)}$, that is ${S(4 * A / (1 + A) ** 2 * 100, 4)}%.` };
      const r = ((A - 1) / (A + 1)) ** 2; const nn = Math.ceil(Math.log(2e6 / 0.025) / -Math.log(r));
      return { A, v, answer: nn, tol: 0, q: `In each head-on elastic collision a neutron's energy is multiplied by $\\left(\\dfrac{A-1}{A+1}\\right)^2$. How many head-on collisions with nuclei of mass number ${A} are needed to slow a 2 MeV neutron to 0.025 eV (nearest whole number, rounding up)?`, sol: `Factor per collision $= \\left(\\dfrac{${A - 1}}{${A + 1}}\\right)^2 = ${S(r, 4)}$. Needed energy ratio $= \\dfrac{2\\times10^6}{0.025} = 8\\times10^7$. $n = \\dfrac{\\ln(8\\times10^7)}{-\\ln${S(r, 4)}} = \\dfrac{${S(Math.log(8e7), 4)}}{${S(-Math.log(r), 4)}} = ${S(Math.log(8e7) / -Math.log(r), 4)}$, so ${nn} collisions at least. (Real collisions are not head on, so more are needed.)` };
    },
    verify: (p) => p.v === 0 ? 400 * p.A / (1 + p.A) ** 2 : Math.ceil(Math.log10(8e7) / Math.log10(((p.A + 1) / (p.A - 1)) ** 2)) },
  { id: 'nu-g28', type: 'mcq', format: 'single', level: 2, exams: exFor(2, 'mcq'), sub: 'type of decay',
    make(rng) {
      const cases = [['^{238}_{92}\\mathrm U', '^{234}_{90}\\mathrm{Th}', 'alpha decay'], ['^{14}_{6}\\mathrm C', '^{14}_{7}\\mathrm N', 'beta-minus decay'], ['^{22}_{11}\\mathrm{Na}', '^{22}_{10}\\mathrm{Ne}', 'beta-plus decay'], ['^{226}_{88}\\mathrm{Ra}', '^{222}_{86}\\mathrm{Rn}', 'alpha decay'], ['^{40}_{19}\\mathrm K', '^{40}_{20}\\mathrm{Ca}', 'beta-minus decay'], ['^{11}_{6}\\mathrm C', '^{11}_{5}\\mathrm B', 'beta-plus decay'], ['^{210}_{84}\\mathrm{Po}', '^{206}_{82}\\mathrm{Pb}', 'alpha decay'], ['^{60}_{27}\\mathrm{Co}', '^{60}_{28}\\mathrm{Ni}', 'beta-minus decay']];
      const ci = int(rng, 0, cases.length - 1); const [P, D, kind] = cases[ci];
      const o = shuffleOpts(rng, kind, ['alpha decay', 'beta-minus decay', 'beta-plus decay', 'gamma decay'].filter((x) => x !== kind).slice(0, 3));
      return { ci, ...o, q: `The nucleus $${P}$ changes into $${D}$. This is`, sol: `Compare the daughter with the parent: ${kind === 'alpha decay' ? 'the mass number falls by 4 and the atomic number by 2, so an alpha particle was emitted' : kind === 'beta-minus decay' ? 'the mass number is the same and the atomic number rises by 1, so a $\\beta^-$ particle (electron) was emitted' : 'the mass number is the same and the atomic number falls by 1, so a $\\beta^+$ particle (positron) was emitted'}.` };
    },
    verify: (p) => { const k = ['alpha decay', 'beta-minus decay', 'beta-plus decay', 'alpha decay', 'beta-minus decay', 'beta-plus decay', 'alpha decay', 'beta-minus decay'][p.ci]; return p.options[p.answer] === k ? p.answer : -1; } },
];
const groups = {
  m1: { title: 'Radiations', list1: ['A. Alpha particles', 'B. Beta-minus particles', 'C. Gamma rays', 'D. Beta-plus particles'], list2: ['p. Not deflected by a magnetic field', 'q. Doubly charged and heavy', 'r. Emitted together with an antineutrino', 's. Emitted together with a neutrino'] },
  m2: { title: 'Decay modes', list1: ['A. Alpha decay', 'B. Beta-minus decay', 'C. Beta-plus decay', 'D. Gamma decay'], list2: ['p. $Z$ decreases by 1, $A$ unchanged', 'q. $Z$ increases by 1, $A$ unchanged', 'r. $Z$ decreases by 2, $A$ decreases by 4', 's. $Z$ and $A$ unchanged'] },
  m3: { title: 'Units', list1: ['A. 1 becquerel', 'B. 1 curie', 'C. 1 atomic mass unit', 'D. 1 rutherford'], list2: ['p. $3.7\\times10^{10}$ decays per second', 'q. 1 decay per second', 'r. 931.5 MeV$/c^2$', 's. $10^6$ decays per second'] },
  m4: { title: 'Parts of a reactor', list1: ['A. Moderator', 'B. Control rods', 'C. Coolant', 'D. Fuel'], list2: ['p. Cadmium or boron', 'q. Heavy water or graphite', 'r. Enriched uranium', 's. Carries heat to the steam generator'] },
  m5: { title: 'Decay quantities', list1: ['A. Mean life', 'B. Half-life', 'C. Activity', 'D. Decay constant'], list2: [r`p. $\dfrac{\ln2}{\lambda}$`, r`q. $\dfrac1\lambda$`, r`r. $\lambda N$`, 's. Probability of decay per unit time per nucleus'] },
  p1: { title: 'Alpha decay of radium', passage: r`<p>$^{226}\mathrm{Ra}$ at rest decays to $^{222}\mathrm{Rn}$ by emitting an alpha particle. Atomic masses: $^{226}\mathrm{Ra}$ = 226.025410 u, $^{222}\mathrm{Rn}$ = 222.017578 u, $^{4}\mathrm{He}$ = 4.002603 u. Take 1 u = 931.5 MeV$/c^2$.</p>` },
  p2: { title: 'A radioactive iodine sample', passage: r`<p>A hospital receives a sample of $^{131}\mathrm I$ with an activity of 8.0 MBq on the day of delivery. The half-life of $^{131}\mathrm I$ is 8.0 days.</p>` },
  p3: { title: 'Dating a piece of charcoal', passage: r`<p>Living wood gives 15 decays per minute per gram of carbon (from $^{14}\mathrm C$, half-life 5730 y). A piece of ancient charcoal with 5.0 g of carbon gives 18.75 decays per minute.</p>` },
  p4: { title: 'A power reactor', passage: r`<p>A nuclear power station has a thermal power of 600 MW and converts 33% of it into electrical power. Each fission of $^{235}\mathrm U$ releases 200 MeV. Take 1 MeV $= 1.602\times10^{-13}$ J.</p>` },
};

// ---------- Expansion (2026-11-22): more hard items, matches, passages and templates ----------
const xs = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const XCUET = true;
const xex = (l, t) => (l <= 2 ? ['keam', 'cusat', 'comedk', 'jee-main', 'neet'] : l === 3 ? ['jee-main', 'neet', 'keam', 'comedk'] : l === 4 ? ['jee-main', 'jee-adv'] : ['jee-adv']).concat(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : []);
let xk = 0; let xc = 0;
const xid = () => `nu-x${String(++xk).padStart(3, '0')}`;
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
const XU = 931.5; const XNA = 6.022e23; const XYR = 3.156e7; const XMEV = 1.602e-13; const XLN2 = Math.LN2;

let xrc = 0;
const xmsqr = (level, sub, q, options, answer, sol, o = {}) => {
  const k = [0, 2, 3, 1, 2, 0, 3, 1, 1][xrc++ % 9]; const n = options.length;
  const no = options.map((_, j) => options[(j - k + n) % n]); const L = 'ABCD';
  const na = answer.map((i) => (i + k) % n).sort();
  const ns = sol.replace(/\(([A-D](?:, ?[A-D])*)((?: [a-z ]+)?)\)/g, (m, ls, rest) => '(' + ls.split(/, ?/).map((c) => L[(L.indexOf(c) + k) % n]).join(', ') + rest + ')');
  return xmsq(level, sub, q, no, na, ns, o);
};
const xgroups = {
  mn1: { title: 'Changes of the nucleus (A, Z)',
    list1: [`A. Alpha decay`, `B. Beta-minus decay`, `C. Beta-plus decay`, `D. Gamma emission`],
    list2: [r`p. $(A - 4,\ Z - 2)$`, r`q. $(A,\ Z + 1)$`, r`r. $(A,\ Z - 1)$`, r`s. $(A,\ Z)$`] },
  mn2: { title: 'Fraction of nuclei left (mean life $\\tau$, half-life $T$)',
    list1: [`A. After a time $\\tau$`, `B. After a time $2\\tau$`, `C. After a time $T$`, `D. After a time $2T$`],
    list2: [`p. 0.37`, `q. 0.135`, `r. 0.50`, `s. 0.25`, `t. 0.63`] },
  mn3: { title: 'Nuclear radius ($R = 1.2A^{1/3}$ fm)',
    list1: [`A. $A = 8$`, `B. $A = 27$`, `C. $A = 64$`, `D. $A = 125$`],
    list2: [`p. 2.4 fm`, `q. 3.6 fm`, `r. 4.8 fm`, `s. 6.0 fm`, `t. 7.2 fm`] },
  mn4: { title: 'Energy released',
    list1: [r`A. $\mathrm{D} + \mathrm{D}\to{}^{3}\mathrm{He} + n$`, r`B. $\mathrm{D} + \mathrm{T}\to{}^{4}\mathrm{He} + n$`, r`C. Fission of one $^{235}\mathrm{U}$ nucleus (approximately)`, r`D. $3\,{}^{4}\mathrm{He}\to{}^{12}\mathrm{C}$`],
    list2: [`p. 3.3 MeV`, `q. 17.6 MeV`, `r. 200 MeV`, `s. 7.3 MeV`] },
  mn5: { title: 'Radioactive series',
    list1: [r`A. Number of $\alpha$ particles in $^{238}\mathrm{U}\to{}^{206}\mathrm{Pb}$`, r`B. Number of $\beta^-$ particles in $^{238}\mathrm{U}\to{}^{206}\mathrm{Pb}$`, r`C. Number of $\alpha$ particles in $^{235}\mathrm{U}\to{}^{207}\mathrm{Pb}$`, r`D. Number of $\beta^-$ particles in $^{232}\mathrm{Th}\to{}^{208}\mathrm{Pb}$`],
    list2: [`p. 8`, `q. 6`, `r. 7`, `s. 4`] },
  mn6: { title: 'Slowing down neutrons (elastic collision, head-on, nucleus at rest)',
    list1: [`A. Hydrogen ($A = 1$): the fraction of its energy that the neutron can lose, at most`, `B. Deuterium ($A = 2$)`, `C. Helium-4 ($A = 4$)`, `D. Carbon-12 ($A = 12$)`],
    list2: [`p. 1`, r`q. $\dfrac89$`, r`r. $\dfrac{16}{25}$`, r`s. $\dfrac{48}{169}$`] },
  mn7: { title: 'Two samples with equal initial numbers of nuclei (half-lives $T$ and $2T$), at $t = 2T$',
    list1: [`A. Fraction of sample 1 (half-life $T$) left`, `B. Fraction of sample 2 (half-life $2T$) left`, `C. Activity of sample 1 / activity of sample 2`, `D. Fraction of sample 1 that has decayed`],
    list2: [r`p. $\tfrac14$`, r`q. $\tfrac12$`, `r. 1`, r`s. $\tfrac34$`] },
  mn8: { title: 'Binding energy per nucleon',
    list1: [r`A. $^{56}\mathrm{Fe}$`, r`B. $^{4}\mathrm{He}$`, r`C. $^{235}\mathrm{U}$`, r`D. $^{2}\mathrm{H}$`],
    list2: [`p. 8.8 MeV`, `q. 7.1 MeV`, `r. 7.6 MeV`, `s. 1.1 MeV`] },
  pn1: { title: 'One gram of radium',
    passage: r`<p>Radium-226 has a half-life of 1600 years (take 1 year $= 3.156\times10^{7}$ s). A sample of 1.00 g is pure $^{226}$Ra. Take the molar mass as $226\ \mathrm{g\,mol^{-1}}$ and $N_A = 6.022\times10^{23}\ \mathrm{mol^{-1}}$. One curie is $3.7\times10^{10}$ decays per second.</p>` },
  pn2: { title: 'A deuterium-tritium fusion plant',
    passage: r`<p>In the reaction $\mathrm{D} + \mathrm{T}\to{}^{4}\mathrm{He} + n$ the atomic masses are D $= 2.014102$ u, T $= 3.016049$ u, $^{4}$He $= 4.002603$ u, $n = 1.008665$ u. Take $1\ \mathrm{u} = 931.5\ \mathrm{MeV}/c^2 = 1.6605\times10^{-27}$ kg and $1\ \mathrm{MeV} = 1.602\times10^{-13}$ J. A plant makes 1.0 GW of fusion power.</p>` },
};

const xitems = [
  // ---------- Level 2 ----------
  xnat(2, 'decay law', r`A radioactive substance has a half-life of 10 days. What fraction of it is left after 30 days (3 decimals)?`, 0.5 ** 3, 0.001, 3,
    r`30 days is three half-lives. $\left(\dfrac12\right)^3 = \dfrac18 = 0.125$.`),
  xmcq(2, 'nuclear force', r`Which is a property of the nuclear force between two nucleons?`, 'It is short-ranged and nearly the same between p-p, n-n and p-n', ['It is long-ranged, like gravity', 'It acts only between protons', 'It depends on the charge of the nucleons'],
    r`The nuclear force acts over about 1 to 2 fm and is strongly attractive, regardless of charge. Beyond a few fm it falls off to almost nothing.`),
  xnat(2, 'nucleus', r`How many neutrons does a nucleus of $^{235}_{92}\mathrm{U}$ contain?`, 235 - 92, 0, 0,
    r`Neutrons $= A - Z = 235 - 92 = 143$.`),
  xmcq(2, 'radiations', r`Which of these radiations is the most penetrating?`, 'Gamma rays', ['Alpha particles', 'Beta particles', 'All have the same penetration'],
    r`Alpha particles are stopped by a sheet of paper, beta particles by a few millimetres of aluminium, and gamma rays need centimetres of lead.`),
  xnat(2, 'nuclear size', r`Find the radius of a nucleus of mass number 64 (in fm, 1 decimal; $R_0 = 1.2$ fm).`, 1.2 * 64 ** (1 / 3), 0.05, 1,
    r`$R = R_0A^{1/3} = 1.2\times4 = 4.8$ fm.`, { unit: 'fm' }),
  xmcq(2, 'mass defect', r`The mass of a stable nucleus is`, 'less than the sum of the masses of its separate nucleons', ['greater than the sum of the masses of its nucleons', 'equal to the sum of the masses of its nucleons', 'equal to the number of its nucleons in kilograms'],
    r`Binding releases energy, and energy has mass ($\Delta m = E_b/c^2$), so the bound nucleus is lighter than its separated nucleons. The difference is the mass defect.`),

  // ---------- Level 3 ----------
  xnat(3, 'decay series', r`How many beta-minus particles are emitted in the decay chain from $^{238}_{92}\mathrm{U}$ to $^{206}_{82}\mathrm{Pb}$?`, 6, 0, 0,
    r`Mass number falls by 32, so $\dfrac{32}{4} = 8$ alpha particles are emitted. These lower $Z$ by 16, but $Z$ only falls by 10. So $16 - 10 = 6$ beta-minus particles are emitted.`),
  xnat(3, 'binding energy', r`Find the binding energy of $^{4}\mathrm{He}$ (in MeV, 2 decimals). Atomic masses: $^{1}$H $= 1.007825$ u, $n = 1.008665$ u, $^{4}$He $= 4.002603$ u. $1\ \mathrm{u} = 931.5$ MeV$/c^2$.`, (2 * 1.007825 + 2 * 1.008665 - 4.002603) * XU, 0.05, 2,
    r`Use atomic masses of hydrogen (they include the electron masses, which cancel with those in helium). $\Delta m = 2(1.007825) + 2(1.008665) - 4.002603 = 0.030377$ u. $E_b = 0.030377\times931.5 = 28.30$ MeV.`, { unit: 'MeV', trap: 'Use the hydrogen atom mass with atomic masses, not the proton mass.' }),
  xnat(3, 'decay constant', r`A radioactive nuclide has a half-life of 69.3 s. Find its mean life (in s).`, 69.3 / XLN2, 0.1, 0,
    r`$\tau = \dfrac{T_{1/2}}{\ln2} = \dfrac{69.3}{0.693} = 100$ s.`, { unit: 's' }),
  xnat(3, 'decay law', r`What percentage of the nuclei of a radioactive sample decay during one mean life (1 decimal)?`, (1 - Math.exp(-1)) * 100, 0.1, 1,
    r`After time $\tau$, $N = N_0e^{-1} = 0.368N_0$, so 63.2 % have decayed.`, { unit: '%' }),
  xnat(3, 'mass-energy', r`Find the energy equivalent of 1.0 mg of matter (in units of $10^{10}$ J; $c = 3.0\times10^{8}\ \mathrm{m\,s^{-1}}$).`, 1e-6 * 9e16 / 1e10, 0.05, 2,
    r`$E = mc^2 = 10^{-6}\times(3\times10^{8})^2 = 9\times10^{10}$ J.`, { unit: '×10¹⁰ J' }),
  xnat(3, 'gamma photon', r`Find the wavelength of a gamma photon of energy 1.0 MeV (in pm, 2 decimals; $hc = 1240\ \mathrm{eV\,nm}$).`, 1240 / 1e6 * 1e3, 0.01, 2,
    r`$\lambda = \dfrac{hc}{E} = \dfrac{1240\ \mathrm{eV\,nm}}{10^{6}\ \mathrm{eV}} = 1.24\times10^{-3}$ nm $= 1.24$ pm.`, { unit: 'pm' }),
  xnat(3, 'alpha decay energy', r`$^{226}\mathrm{Ra}$ decays to $^{222}\mathrm{Rn}$ by alpha emission with total energy release $Q = 4.87$ MeV. Find the kinetic energy of the alpha particle (in MeV, 2 decimals).`, 4.87 * 222 / 226, 0.01, 2,
    r`Momentum conservation makes the kinetic energies share in inverse ratio to the masses: $K_\alpha = Q\dfrac{A - 4}{A} = 4.87\times\dfrac{222}{226} = 4.78$ MeV.`, { unit: 'MeV' }),
  xnat(3, 'decay law', r`A radioactive sample has a half-life of 5 years. How long does it take for 87.5 % of the sample to decay (in years)?`, 5 * 3, 0, 0,
    r`87.5 % decayed means $12.5 = \tfrac18$ is left: three half-lives, $3\times5 = 15$ years.`, { unit: 'y' }),
  xnat(3, 'activity', r`The activity of a source is 8000 decays per second. Its half-life is 2 hours. Find its activity after 6 hours (in decays per second).`, 8000 / 8, 0, 0,
    r`6 h is three half-lives: $A = 8000\times\left(\tfrac12\right)^3 = 1000\ \mathrm{s^{-1}}$.`, { unit: 'Bq' }),
  xnat(3, 'nuclear stability', r`Find the ratio of neutrons to protons in $^{208}_{82}\mathrm{Pb}$ (2 decimals).`, 126 / 82, 0.01, 2,
    r`$N = 208 - 82 = 126$. $N/Z = \dfrac{126}{82} = 1.54$. Heavy stable nuclei have more neutrons than protons to offset the Coulomb repulsion.`),
  xnat(3, 'beta decay Q-value', r`Tritium ($^{3}$H, atomic mass 3.016049 u) decays by beta-minus emission to $^{3}$He (atomic mass 3.016029 u). Find the energy released (in keV, 1 decimal; $1\ \mathrm{u} = 931.5$ MeV$/c^2$).`, (3.016049 - 3.016029) * XU * 1e3, 0.5, 1,
    r`With atomic masses, the electron's mass is already included, so $Q = (m_{parent} - m_{daughter})c^2 = 0.000020\times931.5 = 0.0186$ MeV $= 18.6$ keV.`, { unit: 'keV' }),
  xnat(3, 'nuclear size', r`Find the ratio of the radius of an $^{27}$Al nucleus to that of an $^{4}$He nucleus (2 decimals).`, (27 / 4) ** (1 / 3), 0.01, 2,
    r`$R\propto A^{1/3}$. $\dfrac{R_{Al}}{R_{He}} = \left(\dfrac{27}{4}\right)^{1/3} = 1.89$.`),
  xnat(3, 'radioactivity', r`A Geiger counter records 3600 counts per minute from a source whose half-life is 1 hour. Find the counts per minute after 3 hours (ignore background).`, 3600 / 8, 0, 0,
    r`3 hours is three half-lives, so the rate falls to $\tfrac18$: $\dfrac{3600}{8} = 450$ counts per minute.`),
  xnat(3, 'half-life from data', r`The activity of a sample is 1000 counts per second at $t = 2$ min and 125 counts per second at $t = 6$ min. Find its half-life (in minutes, 2 decimals).`, 4 / 3, 0.01, 2,
    r`The activity falls by a factor of 8 $= 2^3$ in 4 minutes, which is 3 half-lives. $T = \dfrac43 = 1.33$ min.`, { unit: 'min' }),
  xnat(3, 'fusion energy', r`Two deuterons ($E_b = 2.22$ MeV each) fuse to form $^{4}$He ($E_b = 28.3$ MeV). Find the energy released (in MeV, 1 decimal).`, 28.3 - 2 * 2.22, 0.05, 1,
    r`Energy released $=$ increase in total binding energy $= 28.3 - 2\times2.22 = 23.9$ MeV.`, { unit: 'MeV' }),
  xmt(3, 'changes of the nucleus', 'mn1', r`Match each process with the change in (mass number, atomic number) of the parent nucleus.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`Alpha: loses 2 protons and 2 neutrons, $(A - 4, Z - 2)$. Beta-minus: a neutron becomes a proton, $(A, Z + 1)$. Beta-plus: a proton becomes a neutron, $(A, Z - 1)$. Gamma: no change in $A$ or $Z$.`),
  xmt(3, 'decay law', 'mn2', r`Match each time with the fraction of the original nuclei still present.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-t, B-q, C-r, D-s'],
    r`$N/N_0 = e^{-t/\tau}$ and $= 2^{-t/T}$. $t = \tau$: $e^{-1} = 0.37$ (p). $t = 2\tau$: $e^{-2} = 0.135$ (q). $t = T$: 0.50 (r). $t = 2T$: 0.25 (s). The 0.63 is the fraction that has decayed at $t = \tau$.`),
  xmt(3, 'nuclear size', 'mn3', r`Match each mass number with the nuclear radius from $R = 1.2A^{1/3}$ fm.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$A^{1/3} = 2, 3, 4, 5$ for $A = 8, 27, 64, 125$. $R = 2.4, 3.6, 4.8, 6.0$ fm.`),
  xmt(3, 'binding energy per nucleon', 'mn8', r`Match each nucleus with its binding energy per nucleon.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`The curve peaks near iron at about 8.8 MeV (p). $^{4}$He has 28.3 MeV for 4 nucleons, 7.1 MeV (q). $^{235}$U has about 7.6 MeV (r). The deuteron has 2.22 MeV for 2 nucleons: 1.1 MeV (s).`),
  xasrt(3, 'radioactivity', r`The decay of a radioactive nucleus cannot be predicted for an individual nucleus.`, r`Radioactive decay is a random process, with a fixed probability per unit time for each nucleus.`, 0,
    r`Each nucleus has the same probability $\lambda\,dt$ of decaying in a short time, and nothing tells which nucleus goes next. R explains A.`),
  xstm(3, 'nuclear density', r`The density of nuclear matter is nearly the same for all nuclei.`, r`The nuclear radius is proportional to $A^{1/3}$.`, 0,
    r`$M\propto A$ and $V\propto R^3\propto A$, so $\rho$ is constant, about $2.3\times10^{17}\ \mathrm{kg\,m^{-3}}$. Both true and II explains I.`),
  xmcq(3, 'conservation laws', r`In a nuclear reaction, which quantity is NOT necessarily conserved?`, 'The total number of protons', ['The total electric charge', 'The total number of nucleons', 'The total energy including rest mass energy'],
    r`Charge, nucleon number and energy-momentum are conserved. The number of protons alone is not: in beta decay a neutron becomes a proton.`, { trap: 'Read the NOT.' }),

  // ---------- Level 4 ----------
  xnat(4, 'neutron moderation', r`A neutron collides head-on and elastically with a stationary carbon-12 nucleus ($A = 12$). Find the greatest percentage of its kinetic energy that it can lose (1 decimal).`, 4 * 12 / 13 ** 2 * 100, 0.1, 1,
    r`In a head-on elastic collision the fraction lost is $\dfrac{4A}{(A + 1)^2} = \dfrac{48}{169} = 0.284$, i.e. 28.4 %. For hydrogen ($A = 1$) it can lose 100 %, which is why water makes a good moderator.`, { unit: '%' }),
  xnat(4, 'radioactive dating', r`A rock contains $^{238}$U (half-life $4.5\times10^{9}$ y) and its decay product lead in the ratio of numbers $N_{Pb}/N_U = 0.50$. Assume all the lead came from uranium. Find the age of the rock (in units of $10^{9}$ y, 2 decimals).`, 4.5 * Math.log2(1.5), 0.02, 2,
    r`Originally $N_U + N_{Pb} = 1.5N_U$. Now $N_U = \dfrac{N_0}{1.5}$ (taking $N_U$ today as the unit, $N_0 = 1.5$). $2^{t/T} = \dfrac{N_0}{N_U} = 1.5$, so $t = T\log_21.5 = 4.5\times0.585 = 2.63\times10^{9}$ y.`, { unit: '×10⁹ y' }),
  xnat(4, 'fusion and fission', r`Compare the energy per kilogram of fuel: $\mathrm{D} + \mathrm{T}\to{}^{4}\mathrm{He} + n$ releases 17.6 MeV per reaction (reacting mass 5 u). Fission of $^{235}$U releases 200 MeV per nucleus (mass 235 u). Find the ratio (D-T energy per kg)/(U energy per kg) (2 decimals).`, (17.6 / 5) / (200 / 235), 0.02, 2,
    r`Per atomic mass unit: D-T $\dfrac{17.6}{5} = 3.52$ MeV/u; U $\dfrac{200}{235} = 0.851$ MeV/u. Ratio $= 4.14$.`),
  xnat(4, 'neutron decay', r`A free neutron decays into a proton, an electron and an antineutrino. Find the energy released (in MeV, 2 decimals). $m_n = 1.008665$ u, $m_p = 1.007276$ u, $m_e = 0.000549$ u, $1\ \mathrm{u} = 931.5$ MeV$/c^2$ (take the antineutrino mass as zero).`, (1.008665 - 1.007276 - 0.000549) * XU, 0.01, 2,
    r`$\Delta m = 1.008665 - 1.007276 - 0.000549 = 0.000840$ u. $Q = 0.000840\times931.5 = 0.78$ MeV, shared by the electron and the antineutrino (the proton recoils very little).`, { unit: 'MeV' }),
  xnat(4, 'threshold energy', r`The reaction $^{14}\mathrm{N} + {}^{4}\mathrm{He}\to{}^{17}\mathrm{O} + p$ has $Q = -1.19$ MeV. Find the least kinetic energy of the incident alpha particle (in MeV, 2 decimals; use mass numbers for the masses).`, 1.19 * (1 + 4 / 14), 0.01, 2,
    r`Only the kinetic energy in the centre-of-mass frame is available: $K_{th} = |Q|\dfrac{m_\alpha + M_N}{M_N} = 1.19\times\dfrac{18}{14} = 1.53$ MeV.`, { unit: 'MeV', trap: 'The threshold is more than |Q|, because the products must also move.' }),
  xnat(4, 'alpha decay', r`$^{238}$U ($238.050788$ u) decays to $^{234}$Th ($234.043601$ u) by alpha emission ($^{4}$He $= 4.002603$ u). Find the energy released (in MeV, 2 decimals).`, (238.050788 - 234.043601 - 4.002603) * XU, 0.02, 2,
    r`$\Delta m = 238.050788 - 234.043601 - 4.002603 = 0.004584$ u. $Q = 0.004584\times931.5 = 4.27$ MeV.`, { unit: 'MeV' }),
  xnat(4, 'two sources', r`Two samples, X (half-life 1 hour) and Y (half-life 2 hours), start with equal numbers of nuclei. After how many hours are their activities equal?`, 2, 0, 0,
    r`$A = \lambda N_0e^{-\lambda t}$. With $\lambda_X = \ln2$ and $\lambda_Y = \dfrac{\ln2}{2}$ (per hour): $\ln2\,e^{-t\ln2} = \dfrac{\ln2}{2}e^{-t\ln2/2}$ gives $2 = e^{t\ln2/2}$, so $t\ln2/2 = \ln2$ and $t = 2$ h.`, { unit: 'h' }),
  xnat(4, 'radioactive dating', r`A sample of wood from an old site has a carbon-14 activity per gram that is one quarter of that of living wood. The half-life of $^{14}$C is 5730 y. Find the age (in years).`, 2 * 5730, 0, 0,
    r`One quarter means two half-lives: $2\times5730 = 11\,460$ y.`, { unit: 'y' }),
  xnat(4, 'decay law', r`What percentage of the nuclei of a sample decay in the first half of one half-life (1 decimal)?`, (1 - 2 ** -0.5) * 100, 0.1, 1,
    r`After a time $T/2$: $\dfrac{N}{N_0} = 2^{-1/2} = 0.707$. So $29.3$ % have decayed.`, { unit: '%', trap: 'Not 25 %: the decay is exponential, not linear.' }),
  xnat(4, 'two sources', r`Two samples start with equal activities. Their half-lives are 1 hour and 4 hours. Find the ratio (activity of the short-lived one)/(activity of the long-lived one) after 4 hours (3 decimals).`, 2 ** -4 / 2 ** -1, 0.001, 3,
    r`Equal initial activities. After 4 h: the first has had 4 half-lives, factor $2^{-4}$; the second one half-life, factor $2^{-1}$. Ratio $= \dfrac{1/16}{1/2} = 0.125$.`),
  xnat(4, 'energy sharing in fission', r`A nucleus of mass number 200, at rest, splits into two fragments of mass numbers 120 and 80, releasing 160 MeV as kinetic energy. Find the kinetic energy of the lighter fragment (in MeV).`, 160 * 120 / 200, 0, 0,
    r`Momenta are equal and opposite, so $K\propto\dfrac1m$. The lighter (80) gets the larger share: $K_{80} = 160\times\dfrac{120}{200} = 96$ MeV (and the 120 fragment 64 MeV).`, { unit: 'MeV', trap: 'The lighter fragment carries more energy.' }),
  xmsqr(4, 'radioactivity', r`Which are correct for radioactive decay?`, [r`The decay constant does not depend on temperature or pressure.`, r`The mean life is longer than the half-life.`, r`The activity is proportional to the number of undecayed nuclei.`, r`After one mean life, half of the nuclei have decayed.`], [0, 1, 2],
    r`$\lambda$ is a property of the nucleus (A). $\tau = T/\ln2 = 1.44T$ (B). $A = \lambda N$ (C). After $\tau$, $e^{-1} = 37$ % remain, so 63 % have decayed (D false).`),
  xmsqr(4, 'decay graphs', r`A graph of $\ln A$ (activity) against time $t$ for a pure radioactive sample is a straight line. Which are correct?`, [r`The slope is $-\lambda$.`, r`The intercept on the $\ln A$ axis is $\ln A_0$.`, r`The half-life is $\ln2$ divided by the magnitude of the slope.`, r`The line would curve upwards for a sample with two different nuclides.`], [0, 1, 2],
    r`$\ln A = \ln A_0 - \lambda t$ (A, B), and $T = \ln2/\lambda$ (C). The slope $-\lambda$ is fixed for a pure sample, so it does not steepen as the sample decays (D false).`),
  xmsqr(4, 'binding energy curve', r`Which are correct about the binding energy per nucleon curve?`, [r`It rises steeply for light nuclei and peaks near $A = 56$.`, r`For $A > 56$ it falls slowly, which is why fission of heavy nuclei releases energy.`, r`Fusion of light nuclei releases energy because the products have a higher binding energy per nucleon.`, r`Fission of $^{56}$Fe into two lighter nuclei releases energy.`], [0, 1, 2],
    r`The curve rises steeply then falls slowly after the peak at $A = 56$. Fusion of light nuclei and fission of heavy ones both end nearer the peak, so both raise the binding energy per nucleon and release energy. Iron-56 is at the peak, so splitting or fusing it would cost energy (the Fe-56 fission statement is false).`),
  xmsqr(4, 'fission', r`In a nuclear reactor, which are correct?`, [r`The moderator slows the fast neutrons.`, r`Control rods absorb neutrons.`, r`Slow neutrons are more likely than fast ones to cause fission in $^{235}$U.`, r`The multiplication factor must be less than 1 for steady power.`], [0, 1, 2],
    r`Moderator (A), control rods (B), thermal neutrons have the greatest fission cross-section for U-235 (C). Steady power needs $k = 1$ (D false); $k < 1$ would let the reaction die out.`),
  xmsqr(4, 'beta decay', r`In beta-minus decay of a nucleus, which are correct?`, [r`A neutron in the nucleus changes into a proton.`, r`An antineutrino is emitted.`, r`The mass number stays the same.`, r`The electron comes from the orbit round the nucleus.`], [0, 1, 2],
    r`$n\to p + e^- + \bar\nu$. $A$ is unchanged, $Z$ rises by 1. The electron is created in the decay; it did not exist in the nucleus and is not an orbital electron (D false).`),
  xasrt(4, 'fusion', r`Nuclear fusion needs very high temperatures.`, r`The nuclei must overcome their mutual Coulomb repulsion to come within the range of the nuclear force.`, 0,
    r`The Coulomb barrier between two light nuclei is about 0.1 to 1 MeV. Only at temperatures of $10^7$ K and above do enough of them have thermal energy (with tunnelling) to get close. R explains A.`),
  xasrt(4, 'binding energy', r`The mass of a helium-4 nucleus is less than the sum of the masses of two protons and two neutrons.`, r`The binding energy of the nucleus appears as a lower mass, by the relation $\Delta m = E_b/c^2$.`, 0,
    r`Energy released in forming the nucleus has left the system, and with it the mass $E_b/c^2$. Both true; R explains A.`),
  xstm(4, 'chain reaction', r`A reactor with multiplication factor $k = 1.001$ can be controlled even though $k > 1$.`, r`A small fraction of the neutrons from fission are delayed (emitted a little later), which slows the growth of the chain reaction.`, 0,
    r`Delayed neutrons stretch the effective generation time from about $10^{-4}$ s to about 0.1 s, so the power rises slowly enough for control rods to respond. Both true, and II explains I.`),
  xcnt(4, 'radioactivity', r`How many of the following are correct?`, [r`Gamma rays are not deflected by electric or magnetic fields.`, r`An alpha particle is a helium nucleus.`, r`The unit becquerel is one decay per second.`, r`The activity of a sample decreases exponentially with time.`], 4,
    r`Gamma rays are neutral (1). Alpha = $^{4}_{2}$He (2). 1 Bq = 1 decay/s (3). $A = A_0e^{-\lambda t}$ (4). All four.`),
  xmt(4, 'energy released', 'mn4', r`Match each reaction with the approximate energy released.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`D+D$\to{}^{3}$He+n: $\Delta m = 0.00351$ u, 3.27 MeV (p). D+T: 17.6 MeV (q). Fission of U-235: about 200 MeV (r). Triple alpha: $\Delta m = 0.00781$ u, 7.27 MeV (s).`),
  xmt(4, 'radioactive series', 'mn5', r`Match each count for the decay chains.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$^{238}$U to $^{206}$Pb: $\Delta A = 32$, 8 alphas (p); $Z$ drops 16 by alphas but only 10 overall, so 6 betas (q). $^{235}$U to $^{207}$Pb: $\Delta A = 28$, 7 alphas (r). $^{232}$Th to $^{208}$Pb: 6 alphas lower $Z$ by 12, overall drop 8, so 4 betas (s).`),
  xmt(4, 'neutron moderation', 'mn6', r`The greatest fraction of its energy that a neutron can lose in a head-on elastic collision with a stationary nucleus of mass number $A$ is $\dfrac{4A}{(A+1)^2}$. Match.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$A = 1$: $\dfrac44 = 1$ (p). $A = 2$: $\dfrac89$ (q). $A = 4$: $\dfrac{16}{25}$ (r). $A = 12$: $\dfrac{48}{169}$ (s).`),
  xpas(3, 'decay constant', 'pn1', r`Find the decay constant of radium-226 (in units of $10^{-11}\ \mathrm{s^{-1}}$, 2 decimals).`, XLN2 / (1600 * XYR) * 1e11, 0.02, 2,
    r`$T = 1600\times3.156\times10^{7} = 5.05\times10^{10}$ s. $\lambda = \dfrac{0.693}{5.05\times10^{10}} = 1.37\times10^{-11}\ \mathrm{s^{-1}}$.`, { unit: '×10⁻¹¹ s⁻¹' }),
  xpas(3, 'number of nuclei', 'pn1', r`Find the number of nuclei in the 1.00 g sample (in units of $10^{21}$, 2 decimals).`, XNA / 226 / 1e21, 0.02, 2,
    r`$N = \dfrac{1.00}{226}\times6.022\times10^{23} = 2.66\times10^{21}$.`, { unit: '×10²¹' }),
  xpas(4, 'activity', 'pn1', r`Find the activity of the sample in curies (2 decimals).`, XNA / 226 * XLN2 / (1600 * XYR) / 3.7e10, 0.01, 2,
    r`$A = \lambda N = 1.37\times10^{-11}\times2.66\times10^{21} = 3.66\times10^{10}$ Bq. In curies: $\dfrac{3.66\times10^{10}}{3.7\times10^{10}} = 0.99$ Ci, which is why the curie was defined as the activity of 1 g of radium.`, { unit: 'Ci' }),
  xpas(3, 'Q value of a reaction', 'pn2', r`Find the energy released per reaction (in MeV, 2 decimals).`, (2.014102 + 3.016049 - 4.002603 - 1.008665) * XU, 0.02, 2,
    r`$\Delta m = 2.014102 + 3.016049 - 4.002603 - 1.008665 = 0.018883$ u. $Q = 0.018883\times931.5 = 17.59$ MeV.`, { unit: 'MeV' }),
  xpas(4, 'reactor power', 'pn2', r`Find the number of reactions per second needed for 1.0 GW (in units of $10^{20}$, 2 decimals).`, 1e9 / (17.59 * XMEV) / 1e20, 0.03, 2,
    r`Energy per reaction $= 17.59\times1.602\times10^{-13} = 2.818\times10^{-12}$ J. Rate $= \dfrac{10^{9}}{2.818\times10^{-12}} = 3.55\times10^{20}\ \mathrm{s^{-1}}$.`, { unit: '×10²⁰ /s' }),
  xpas(5, 'fuel use', 'pn2', r`Find the mass of tritium the plant burns in one day (in kg, 3 decimals).`, 1e9 / (17.59 * XMEV) * 86400 * 3.016049 * 1.6605e-27, 0.003, 3,
    r`Reactions per day $= 3.55\times10^{20}\times86400 = 3.07\times10^{25}$. Each uses one tritium atom of $3.016\times1.6605\times10^{-27} = 5.008\times10^{-27}$ kg. Mass $= 3.07\times10^{25}\times5.008\times10^{-27} = 0.154$ kg.`, { unit: 'kg' }),

  // ---------- Level 5 ----------
  xnat(5, 'sequential decay', r`Nuclei A (half-life 1 h) decay to nuclei B (half-life 2 h), which are stable-ish products of no further interest. Starting with $N_0$ nuclei of A and none of B, find the largest number of B nuclei present at any time, as a fraction of $N_0$ (2 decimals).`, 0.5, 0.01, 2,
    r`$N_B(t) = N_0\dfrac{\lambda_A}{\lambda_B - \lambda_A}\left(e^{-\lambda_At} - e^{-\lambda_Bt}\right)$, with $\lambda_A = \ln2$ and $\lambda_B = \dfrac{\ln2}{2}$ per hour. The maximum is when the activities are equal, $\lambda_AN_A = \lambda_BN_B$, which gives $e^{(\lambda_A - \lambda_B)t} = \dfrac{\lambda_A}{\lambda_B} = 2$, so $t = 2$ h. At $t = 2$ h, $e^{-\lambda_At} = \tfrac14$ and $e^{-\lambda_Bt} = \tfrac12$: $N_B = N_0\times\dfrac{\ln2}{-\ln2/2}\times\left(\tfrac14 - \tfrac12\right) = N_0\times(-2)\times(-0.25) = 0.50N_0$.`, { trap: 'B is not produced all at once: it decays as it forms.' }),
  xnat(5, 'chain reactions', r`In a reactor the number of neutrons is multiplied by $k = 1.005$ in each generation of $1.0\times10^{-4}$ s (ignore delayed neutrons). How long does the neutron population take to double (in ms, 1 decimal)?`, Math.log(2) / Math.log(1.005) * 1e-4 * 1e3, 0.3, 1,
    r`$k^n = 2$ gives $n = \dfrac{\ln2}{\ln1.005} = 139$ generations. Time $= 139\times10^{-4}$ s $= 13.9$ ms. With the delayed neutrons, real reactors are much slower, which makes them controllable.`, { unit: 'ms' }),
  xnat(5, 'binding energy curve', r`A nucleus of mass number 236 with binding energy per nucleon 7.6 MeV splits into two equal nuclei, each with binding energy per nucleon 8.5 MeV. Find the energy released (in MeV, 1 decimal).`, 236 * (8.5 - 7.6), 0.2, 1,
    r`Energy released $= $ total final binding energy $-$ initial $= 236\times8.5 - 236\times7.6 = 236\times0.9 = 212.4$ MeV.`, { unit: 'MeV' }),
  xnat(5, 'half-life with growth', r`A radioactive nuclide is produced at a constant rate of $2.0\times10^{6}$ nuclei per second, and decays with a half-life of 10 minutes. Find the number of nuclei present when equilibrium is reached (in units of $10^{9}$, 2 decimals).`, 2e6 * (600 / XLN2) / 1e9, 0.01, 2,
    r`At equilibrium the decay rate $\lambda N$ equals the production rate $R$. $N = \dfrac R\lambda = R\dfrac{T}{\ln2} = \dfrac{2\times10^{6}\times600}{0.693} = 1.73\times10^{9}$.`),
  xnat(5, 'decay law', r`A sample contains a long-lived nuclide of half-life 100 years. In an experiment lasting 1 hour the number of nuclei decaying is counted and found to be 5000 decays. Estimate the number of nuclei in the sample (in units of $10^{9}$, 2 decimals). Take 1 year $= 8766$ h.`, 5000 / (XLN2 / (100 * 8766)) / 1e9, 0.01, 2,
    r`For a short time $\Delta t\ll T$, $\Delta N = \lambda N\Delta t$. $\lambda = \dfrac{0.693}{100\times8766\ \mathrm{h}} = 7.91\times10^{-7}\ \mathrm{h^{-1}}$. $N = \dfrac{5000}{7.91\times10^{-7}\times1} = 6.32\times10^{9}$. In units of $10^{9}$: $6.32$.`, { trap: 'The activity of a long-lived sample is tiny compared with the number of nuclei.' }),
  xmsqr(5, 'nuclear force', r`Which are correct about the nuclear force?`, [r`It is much stronger than the electrostatic force at distances of about 1 fm.`, r`It is saturated: a nucleon interacts mainly with its neighbours.`, r`It becomes repulsive at very short distances (below about 0.8 fm).`, r`It is a central force that depends on the charge of the nucleons.`], [0, 1, 2],
    r`At 1 fm the nuclear force is about 100 times the Coulomb force (A). Its short range means each nucleon feels only nearby ones, so the binding energy per nucleon is roughly constant (B). At very short range it turns repulsive (C). It is charge independent (D false).`),
  xmsqr(5, 'Q value of a reaction', r`For a nuclear reaction with $Q = (\text{total initial mass} - \text{total final mass})c^2$, which are correct?`, [r`If $Q > 0$ the reaction is exothermic.`, r`If $Q < 0$ the incoming particle needs at least $|Q|$ of kinetic energy, and in general more.`, r`Total energy is conserved, including rest mass energy.`, r`$Q$ depends on the kinetic energy of the incoming particle.`], [0, 1, 2],
    r`$Q < 0$ needs at least $|Q|$ of kinetic energy, total energy is conserved, and $Q > 0$ means exothermic. $Q$ is fixed by the masses alone and does not depend on the projectile's energy, so that statement is false.`),
  xmsqr(5, 'fusion', r`Which are correct for the fusion of hydrogen nuclei in the Sun?`, [r`The net result is four protons forming a helium-4 nucleus, two positrons and two neutrinos.`, r`The energy released is about 26 MeV per helium nucleus formed.`, r`The high temperature is needed so that nuclei can come close enough despite the Coulomb repulsion.`, r`The energy comes from the loss of mass, which is about 4 % of the mass of the protons that fuse.`], [0, 1, 2],
    r`The pp chain: $4p\to{}^{4}$He $+ 2e^+ + 2\nu$ with about 26.7 MeV (A, B), made possible by thermal energy plus tunnelling (C). The mass loss is $\dfrac{26.7}{4\times938} = 0.7$ %, not 4 % (D false).`),
  xmsqr(5, 'binding energy', r`Which are correct?`, [r`The binding energy of a nucleus is the energy needed to separate it into its nucleons.`, r`The binding energy per nucleon of $^{4}$He is greater than that of $^{3}$He.`, r`The binding energy per nucleon is roughly the same (7 to 9 MeV) for most nuclei with $A > 20$.`, r`The deuteron has a larger binding energy per nucleon than $^{4}$He.`], [0, 1, 2],
    r`The binding energy of a nucleus is the energy needed to separate it into free nucleons. $^{4}$He has 7.07 MeV per nucleon against 2.57 MeV for $^{3}$He, and the curve is flat (about 7 to 9 MeV) for medium and heavy nuclei. The deuteron has only 1.11 MeV per nucleon, less than $^{3}$He, so the deuteron statement is false.`),
  xasrt(5, 'activity', r`If the number of radioactive nuclei in a sample is halved, the activity is also halved.`, r`The activity is proportional to the number of nuclei present: $A = \lambda N$.`, 0,
    r`$\lambda$ is a constant for the nuclide, so $A\propto N$. R explains A.`),
  xasrt(5, 'alpha decay', r`In the alpha decay of a nucleus at rest, the alpha particle carries away most of the energy released.`, r`The nucleus and the alpha particle have equal and opposite momenta, so the lighter particle has the larger kinetic energy.`, 0,
    r`With $p_\alpha = p_D$: $K = \dfrac{p^2}{2m}\propto\dfrac1m$. The alpha particle ($A = 4$) gets the fraction $\dfrac{A - 4}{A}$, about 98 % for heavy nuclei. R explains A.`),
  xstm(5, 'radioactive series', r`A radioactive substance in a closed container reaches a state in which the activity of the parent equals the activity of the long-lived part of its daughter (secular equilibrium) when the daughter's half-life is much shorter than the parent's.`, r`In secular equilibrium the number of daughter nuclei is constant because they are formed as fast as they decay.`, 0,
    r`When $T_{parent}\gg T_{daughter}$, the parent hardly changes, and the daughter's number rises until its decay rate equals its production rate, $\lambda_DN_D = \lambda_PN_P$. Both true.`),
  xmt(5, 'two radioactive samples', 'mn7', r`Two samples start with equal numbers of nuclei. Sample 1 has half-life $T$ and sample 2 has half-life $2T$. Match each item at $t = 2T$.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`Sample 1: 2 half-lives, $\tfrac14$ left (p), $\tfrac34$ decayed (s). Sample 2: 1 half-life, $\tfrac12$ left (q). Activity $A = \lambda N$ with $\lambda_1 = 2\lambda_2$: $\dfrac{A_1}{A_2} = \dfrac{2\times\frac14}{\frac12} = 1$ (r).`),
  xmsqr(4, 'half-life', r`A sample of $N_0$ nuclei has half-life $T$. Which are correct?`, [r`After $3T$, 12.5 % of the nuclei remain.`, r`In any interval of length $T$, half of the nuclei present at the start of the interval decay.`, r`The activity at $t = T$ is half the activity at $t = 0$.`, r`After $2T$ all the nuclei have decayed.`], [0, 1, 2],
    r`Each half-life halves the number present: after $3T$ the fraction is $(1/2)^3 = 12.5$ %, and this holds for any starting moment, and the activity $\lambda N$ halves with $N$. After $2T$ a quarter ($25$ %) still remain, so the claim that all have decayed is false.`, { trap: 'Two half-lives do not remove everything; the decay is exponential.' }),
];

const xgens = [
  xg('nu-g29', 3, 'nat', 'decay law', function make(rng) {
    const T = pick(rng, 2, 30, 2); const n = pick(rng, 1.5, 5, 0.5); const t = T * n;
    const dec = (1 - 2 ** -n) * 100;
    return { T, t, n, q: `A radioactive sample has a half-life of ${T} days. What percentage of the nuclei have decayed after ${t} days (1 decimal)?`, answer: +dec.toFixed(1), tol: 0.1, unit: '%',
      sol: `$t/T = ${n}$. $N/N_0 = 2^{-${n}} = ${xs(2 ** -n, 4)}$, so the fraction decayed is $1 - ${xs(2 ** -n, 4)} = ${xs(dec / 100, 4)}$, i.e. ${xs(dec)} %.`, trap: 'The question asks for the decayed fraction, not the remaining one.' };
  }, (p) => (1 - Math.exp(-Math.LN2 / p.T * p.t)) * 100),
  xg('nu-g30', 3, 'mcq', 'decay series', function make(rng) {
    const na = int(rng, 2, 8); const nb = int(rng, 1, 5); const A1 = 230 + int(rng, 0, 10); const Z1 = 90 + int(rng, 0, 2);
    const A2 = A1 - 4 * na; const Z2 = Z1 - 2 * na + nb;
    const o = shuffleOpts(rng, `${na} alpha, ${nb} beta-minus`, [`${na} alpha, ${nb + 2} beta-minus`, `${na + 1} alpha, ${nb} beta-minus`, `${nb} alpha, ${na} beta-minus`]);
    return { na, nb, A1, Z1, A2, Z2, q: `A nucleus of mass number ${A1} and atomic number ${Z1} ends up, after a series of decays, as a nucleus of mass number ${A2} and atomic number ${Z2}. The particles emitted are`, options: o.options, answer: o.answer,
      sol: `$\\Delta A = ${A1 - A2}$ gives ${na} alpha particles. These lower $Z$ by ${2 * na}$, to ${Z1 - 2 * na}$; the actual $Z$ is ${Z2}, so ${nb} beta-minus particles raise it by ${nb}.` };
  }, (p) => { const na = (p.A1 - p.A2) / 4; const nb = p.Z2 - (p.Z1 - 2 * na); return p.options.findIndex((o) => o === `${na} alpha, ${nb} beta-minus`); }),
  xg('nu-g31', 4, 'nat', 'alpha decay energy', function make(rng) {
    const A = choose(rng, [210, 214, 218, 222, 226, 230, 238]); const Q = pick(rng, 4, 6.5, 0.05);
    const K = Q * (A - 4) / A;
    return { A, Q, q: `A nucleus of mass number ${A}, at rest, emits an alpha particle, with total energy release $Q = ${Q}$ MeV. Find the kinetic energy of the alpha particle (in MeV, 3 decimals).`, answer: +K.toFixed(3), tol: 0.005, unit: 'MeV',
      sol: `Equal momenta give $K\\propto1/m$. $K_\\alpha = Q\\dfrac{A - 4}{A} = ${Q}\\times\\dfrac{${A - 4}}{${A}} = ${xs(K, 4)}$ MeV.`, trap: 'The alpha particle gets the larger share, since it is lighter.' };
  }, (p) => { const m1 = 4; const m2 = p.A - 4; return p.Q * m2 / (m1 + m2); }),
  xg('nu-g32', 4, 'nat', 'binding energy per nucleon', function make(rng) {
    const sets = [['\\mathrm{^{4}He}', 2, 2, 4.002603], ['\\mathrm{^{12}C}', 6, 6, 12.0], ['\\mathrm{^{16}O}', 8, 8, 15.994915], ['\\mathrm{^{14}N}', 7, 7, 14.003074], ['\\mathrm{^{20}Ne}', 10, 10, 19.992440]];
    const s = choose(rng, sets); const Z = s[1]; const N = s[2]; const m = s[3];
    const BE = (Z * 1.007825 + N * 1.008665 - m) * 931.5; const per = BE / (Z + N);
    return { s, q: `The atomic mass of $${s[0]}$ is ${m} u ($^{1}$H $= 1.007825$ u, $n = 1.008665$ u, $1\\ \\mathrm{u} = 931.5$ MeV$/c^2$). Find its binding energy per nucleon (in MeV, 2 decimals).`, answer: +per.toFixed(2), tol: 0.02, unit: 'MeV',
      sol: `$\\Delta m = ${Z}(1.007825) + ${N}(1.008665) - ${m} = ${xs(Z * 1.007825 + N * 1.008665 - m, 5)}$ u. $E_b = ${xs(BE, 5)}$ MeV. Per nucleon: $\\dfrac{${xs(BE, 5)}}{${Z + N}} = ${xs(per)}$ MeV.`, trap: 'Divide by the number of nucleons, A.' };
  }, (p) => ((p.s[1] * 1.007825 + p.s[2] * 1.008665 - p.s[3]) * 931.5) / (p.s[1] + p.s[2])),
  xg('nu-g33', 4, 'mcq', 'neutron moderation', function make(rng) {
    const A = choose(rng, [2, 4, 9, 12, 16, 56]); const f = 4 * A / (A + 1) ** 2;
    const o = numOpts(rng, f * 100, [(1 - f) * 100, 100 / A, 200 / (A + 1)], '%', 3);
    return { A, q: `A neutron collides head-on and elastically with a stationary nucleus of mass number ${A}. The greatest fraction of its kinetic energy it can lose is`, options: o.options, answer: o.answer,
      sol: `Fraction lost $= \\dfrac{4A}{(A + 1)^2} = \\dfrac{${4 * A}}{${(A + 1) ** 2}} = ${xs(f, 4)}$, i.e. ${xs(f * 100)} %. The other options come from the fraction kept, $1/A$, or an average-mass slip.` };
  }, (p) => p.options.findIndex((o) => o === `${fmt(4 * p.A / (p.A + 1) ** 2 * 100, 3)} %`)),
  xg('nu-g34', 5, 'nat', 'radioactive dating', function make(rng) {
    const T = choose(rng, [1.25, 4.5, 0.704, 14.0]); const rr = choose(rng, [0.25, 0.5, 1, 2, 3]);
    const t = T * Math.log2(1 + rr);
    return { T, rr, q: `A rock contains a parent nuclide of half-life ${T}$\\times10^{9}$ y and its stable daughter in the ratio of numbers $N_d/N_p = ${rr}$. All the daughter came from the parent and none was there at the start. Find the age of the rock (in $10^{9}$ y, 3 decimals).`, answer: +t.toFixed(3), tol: Math.max(0.005, t * 0.003), unit: '×10⁹ y',
      sol: `Originally $N_p + N_d = N_p(1 + ${rr})$. $2^{t/T} = \\dfrac{N_0}{N_p} = ${1 + rr}$. $t = T\\log_2${1 + rr} = ${T}\\times${xs(Math.log2(1 + rr), 4)} = ${xs(t)}\\times10^{9}$ y.`, trap: 'The original number is parent plus daughter, not parent alone.' };
  }, (p) => { const lam = Math.LN2 / p.T; return Math.log(1 + p.rr) / lam; }),
  xg('nu-g35', 4, 'nat', 'reactor power', function make(rng) {
    const P = pick(rng, 100, 1000, 100); const eta = choose(rng, [0.3, 0.33, 0.4]); const d = pick(rng, 1, 30, 1);
    const m = P * 1e6 * d * 86400 / eta / (200 * 1.602e-13) * 235 * 1.6605e-27;
    return { P, eta, d, q: `A reactor delivers ${P} MW of electrical power with an efficiency of ${eta * 100} %. Each fission of $^{235}$U releases 200 MeV. Find the mass of $^{235}$U fissioned in ${d} day${d > 1 ? 's' : ''} (in kg, 3 decimals; $1\\ \\mathrm{MeV} = 1.602\\times10^{-13}$ J, $m = 235\\times1.6605\\times10^{-27}$ kg).`, answer: +m.toFixed(3), tol: Math.max(0.003, m * 0.005), unit: 'kg',
      sol: `Thermal power $= ${P}/${eta} = ${xs(P / eta, 4)}$ MW. Energy in ${d} d $= ${xs(P / eta * 1e6 * d * 86400, 4)}$ J. Fissions $= \\dfrac{E}{200\\times1.602\\times10^{-13}} = ${xs(P * 1e6 * d * 86400 / eta / (200 * 1.602e-13), 4)}$. Mass $= N\\times235\\times1.6605\\times10^{-27} = ${xs(m)}$ kg.`, trap: 'Divide by the efficiency: the thermal power is larger than the electrical power.' };
  }, (p) => { const n = p.P * 1e6 / p.eta * p.d * 86400 / (200 * 1.602e-13); return n * 235 * 1.6605e-27; }),
  xg('nu-g36', 3, 'nat', 'Q value of a reaction', function make(rng) {
    const rx = choose(rng, [['\\mathrm{D} + \\mathrm{D}\\to{}^{3}\\mathrm{He} + n', 2.014102 * 2, 3.016029 + 1.008665], ['\\mathrm{D} + \\mathrm{T}\\to{}^{4}\\mathrm{He} + n', 2.014102 + 3.016049, 4.002603 + 1.008665], ['3\\,{}^{4}\\mathrm{He}\\to{}^{12}\\mathrm{C}', 3 * 4.002603, 12.0], ['{}^{6}\\mathrm{Li} + n\\to{}^{4}\\mathrm{He} + \\mathrm{T}', 6.015123 + 1.008665, 4.002603 + 3.016049]]);
    const Q = (rx[1] - rx[2]) * 931.5;
    return { rx, q: `Using atomic masses, the reaction $${rx[0]}$ has total initial mass ${xs(rx[1], 7)} u and total final mass ${xs(rx[2], 7)} u. Find the energy released (in MeV, 2 decimals; $1\\ \\mathrm{u} = 931.5$ MeV$/c^2$).`, answer: +Q.toFixed(2), tol: 0.03, unit: 'MeV',
      sol: `$\\Delta m = ${xs(rx[1], 7)} - ${xs(rx[2], 7)} = ${xs(rx[1] - rx[2], 4)}$ u. $Q = ${xs(rx[1] - rx[2], 4)}\\times931.5 = ${xs(Q)}$ MeV.`, trap: 'Initial mass minus final mass, in that order.' };
  }, (p) => (p.rx[1] - p.rx[2]) * 931.5),
  xg('nu-g37', 3, 'mcq', 'decay law', function make(rng) {
    const n = int(rng, 2, 6); const N0 = choose(rng, [3.2e6, 6.4e7, 1.28e8, 5.12e8]);
    const left = N0 / 2 ** n;
    const o = shuffleOpts(rng, fmt(left, 3), [fmt(N0 / n, 3), fmt(N0 / 2 ** (n - 1), 3), fmt(N0 * (1 - 1 / 2 ** n), 3)]);
    return { n, N0, q: `A sample has $${fmt(N0, 3).replace('<sup>', '^{').replace('</sup>', '}').replace(' × ', '\\times')}$ radioactive nuclei at $t = 0$. How many remain after ${n} half-lives?`, options: o.options, answer: o.answer,
      sol: `Each half-life halves the number: $N = N_0/2^{${n}} = ${fmt(left, 3)}$. Dividing by ${n} (instead of $2^{${n}}$), or using ${n - 1} half-lives, are common slips; $N_0(1 - 2^{-${n}})$ is the number that has decayed.` };
  }, (p) => p.options.findIndex((o) => o === fmt(p.N0 / 2 ** p.n, 3))),
];

export default { topic: 'nuclei', groups: { ...groups, ...xgroups }, items: [...items, ...xitems], gens: [...gens, ...xgens] };
