// Class 11 Physics, Chapter 12 Kinetic Theory: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('kt');
const r3 = (x) => +x.toPrecision(3);

export default {
  topic: 'kinetic-theory', name: 'Kinetic Theory', n: 12,
  items: [
    m.mcq(1, 'laws', '<p>A gas is compressed at constant temperature to one third of its volume. Its pressure becomes:</p>', '3 times', ['1/3 times', '9 times', 'the same'], '<p>Boyle’s law: PV is constant, so P → 3P.</p>'),
    m.mcq(2, 'laws', '<p>A gas at constant pressure is heated from 27 °C to 327 °C. Its volume becomes:</p>', '2 times', ['12 times', '1.1 times', '4 times'], '<p>V ∝ T in kelvin: 600 K / 300 K = 2.</p>', { trap: 'Using Celsius temperatures in Charles’ law.' }),
    m.mcq(2, 'laws', '<p>The Boltzmann constant k<sub>B</sub> is related to the gas constant R by:</p>', 'k<sub>B</sub> = R/N<sub>A</sub>', ['k<sub>B</sub> = R N<sub>A</sub>', 'k<sub>B</sub> = R/2', 'k<sub>B</sub> = 2R'], '<p>PV = nRT = N k<sub>B</sub>T with N = nN<sub>A</sub>, so k<sub>B</sub> = R/N<sub>A</sub>.</p>'),
    m.mcq(2, 'laws', '<p>A container holds nitrogen at 2 atm and oxygen at 1 atm in separate states, each filling the same container at the same temperature when alone. Mixed together they give a total pressure of:</p>', '3 atm', ['2 atm', '1.5 atm', '1 atm'], '<p>Dalton’s law: the partial pressures add, 2 + 1 = 3 atm.</p>'),
    m.mcq(1, 'pressure', '<p>In kinetic theory the pressure of a gas arises from:</p>', 'the force of molecules hitting the walls', ['the weight of the gas', 'attraction between molecules', 'the gas’s temperature alone'], '<p>Each collision gives the wall a small impulse; the average force per unit area is the pressure.</p>'),
    m.mcq(2, 'pressure', '<p>The pressure of an ideal gas is equal to:</p>', 'one third of ρ times the mean square speed', ['one half of ρ times the mean speed', 'ρ times the mean square speed', 'two thirds of ρ times the mean speed'], '<p>P = ⅓ρ⟨v²⟩.</p>'),
    m.mcq(2, 'pressure', '<p>The molecules of an ideal gas in a vessel are made to move twice as fast (rms) with the same number in the same volume. The pressure becomes:</p>', '4 times', ['2 times', '8 times', 'the same'], '<p>P ∝ ⟨v²⟩, so doubling v gives 4 times the pressure.</p>'),
    m.mcq(2, 'temperature', '<p>The average translational kinetic energy of a molecule of an ideal gas depends on:</p>', 'the temperature only', ['the temperature and the kind of gas', 'the pressure only', 'the volume only'], '<p>It equals 3k<sub>B</sub>T/2 for every ideal gas.</p>'),
    m.mcq(2, 'temperature', '<p>The temperature of a gas is raised from 200 K to 800 K. The rms speed of its molecules:</p>', 'doubles', ['becomes 4 times', 'becomes √2 times', 'is halved'], '<p>v<sub>rms</sub> ∝ √T and √(800/200) = 2.</p>'),
    m.mcq(2, 'temperature', '<p>Which gas molecules have the greatest rms speed at 300 K?</p>', 'helium', ['argon', 'nitrogen', 'carbon dioxide'], '<p>At the same T, v<sub>rms</sub> ∝ 1/√M, and helium (M = 4) is the lightest of these.</p>'),
    m.mcq(2, 'temperature', '<p>For a gas, which ordering of the speeds is correct?</p>', 'v<sub>mp</sub> &lt; v<sub>avg</sub> &lt; v<sub>rms</sub>', ['v<sub>rms</sub> &lt; v<sub>avg</sub> &lt; v<sub>mp</sub>', 'v<sub>avg</sub> &lt; v<sub>mp</sub> &lt; v<sub>rms</sub>', 'v<sub>mp</sub> = v<sub>avg</sub> = v<sub>rms</sub>'], '<p>The ratios are √2 : √(8/π) : √3 = 1 : 1.13 : 1.22.</p>'),
    m.mcq(1, 'equipartition', '<p>The number of degrees of freedom of a rigid diatomic molecule (treated with point atoms) is:</p>', '5', ['3', '6', '7'], '<p>3 translational + 2 rotational.</p>'),
    m.mcq(2, 'equipartition', '<p>According to the law of equipartition, the energy per degree of freedom per molecule is:</p>', '½k<sub>B</sub>T', ['k<sub>B</sub>T', '3k<sub>B</sub>T/2', '2k<sub>B</sub>T'], '<p>Each degree of freedom holds ½k<sub>B</sub>T on average.</p>'),
    m.mcq(3, 'equipartition', '<p>A diatomic molecule that is vibrating (as well as moving and spinning) has how many degrees of freedom, counting vibration as two?</p>', '7', ['5', '6', '8'], '<p>3 + 2 + 2 = 7.</p>'),
    m.mcq(2, 'specific heat', '<p>For a monatomic ideal gas C<sub>p</sub> − C<sub>v</sub> equals:</p>', 'R', ['3R/2', '5R/2', 'R/2'], '<p>Mayer’s relation C<sub>p</sub> − C<sub>v</sub> = R holds for every ideal gas.</p>'),
    m.mcq(2, 'specific heat', '<p>The value of γ for a monatomic ideal gas is:</p>', '5/3', ['7/5', '4/3', '3/2'], '<p>γ = 1 + 2/3 = 5/3.</p>'),
    m.mcq(3, 'specific heat', '<p>One mole of a gas absorbs 50 J of heat at constant volume and its temperature rises by 4 K. The gas is most likely:</p>', 'monatomic', ['rigid diatomic', 'a non-linear triatomic gas', 'diatomic with vibration'], '<p>C<sub>v</sub> = 50/4 = 12.5 J/(mol K) = 3R/2 (R = 8.31), the monatomic value. Rigid diatomic would be 20.8, non-linear triatomic 24.9.</p>'),
    m.mcq(2, 'mean free path', '<p>The mean free path of the molecules of a gas is:</p>', 'the average distance between two successive collisions', ['the distance between the walls', 'the average distance between molecules', 'the distance moved in one second'], '<p>It is the average length of the straight stretches between collisions.</p>'),
    m.mcq(2, 'mean free path', '<p>The temperature of a gas is kept constant and its pressure is doubled. The mean free path becomes:</p>', 'half', ['double', 'one fourth', 'unchanged'], '<p>λ = k<sub>B</sub>T/(√2 π d² P) ∝ 1/P at constant T.</p>'),
    m.ar(2, 'pressure', 'A gas exerts the same pressure on every wall of its container.', 'The molecules move randomly in all directions with no preferred direction.', 0, '<p>Both true, R explains A: random motion gives ⟨vx²⟩ = ⟨vy²⟩ = ⟨vz²⟩.</p>'),
    m.ar(2, 'temperature', 'At the same temperature hydrogen molecules move faster than oxygen molecules on average.', 'Hydrogen molecules have a greater average kinetic energy than oxygen molecules at the same temperature.', 2, '<p>A is true. R is false: the mean kinetic energy is 3kT/2 for both. The lighter molecules move faster to carry the same energy.</p>'),
    m.ar(3, 'specific heat', 'The molar heat capacity at constant pressure is greater than at constant volume.', 'At constant pressure the gas does work in expanding, so extra heat is needed.', 0, '<p>Both true, R explains A: C<sub>p</sub> = C<sub>v</sub> + R.</p>'),
    m.ar(3, 'equipartition', 'At room temperature the specific heat of hydrogen is about 5R/2, not 7R/2.', 'The vibration of the H–H bond is not excited at room temperature.', 0, '<p>Both true, R explains A: the vibrational degrees of freedom are “frozen out” at room temperature, leaving f = 5.</p>'),
    m.nat(2, 'laws', '<p>2 mol of an ideal gas occupy 50 litres at 300 K. Find the pressure in kPa. (R = 8.31)</p>', () => 2 * 8.31 * 300 / 0.05 / 1000, 1, '<p>P = nRT/V = 2 × 8.31 × 300 / 0.05 = 99.7 kPa.</p>', { unit: 'kPa' }),
    m.nat(2, 'temperature', '<p>Find the rms speed in m/s of oxygen molecules (M = 32 g/mol) at 300 K. (R = 8.31)</p>', () => Math.sqrt(3 * 8.31 * 300 / 0.032), 5, '<p>v<sub>rms</sub> = √(3RT/M) = √(3 × 8.31 × 300/0.032) = 483 m/s.</p>', { unit: 'm/s' }),
    m.nat(3, 'equipartition', '<p>Find the internal energy in joules of 2 mol of a rigid diatomic gas at 300 K. (R = 8.31)</p>', () => 2.5 * 2 * 8.31 * 300, 10, '<p>U = (5/2) nRT = 2.5 × 2 × 8.31 × 300 = 12 465 J.</p>', { unit: 'J' }),
    m.nat(3, 'specific heat', '<p>How much heat, in joules, raises 1 mol of a monatomic gas by 20 K at constant pressure? (R = 8.31)</p>', () => 2.5 * 8.31 * 20, 1, '<p>C<sub>p</sub> = 5R/2 = 20.8 J/(mol K); Q = 20.8 × 20 = 415.5 J.</p>', { unit: 'J' }),
    m.nat(3, 'mean free path', '<p>Find the mean free path in nanometres for molecules of diameter 0.4 nm at 2.7 × 10<sup>25</sup> m<sup>−3</sup>.</p>', () => 1e9 / (Math.SQRT2 * Math.PI * (0.4e-9) ** 2 * 2.7e25), 0.5, '<p>λ = 1/(√2 π d² n) = 1/(1.414 × 3.142 × 1.6×10<sup>−19</sup> × 2.7×10<sup>25</sup>) = 52 nm.</p>', { unit: 'nm' }),
    m.msq(3, 'temperature', '<p>The temperature of an ideal gas is doubled (kelvin) at constant volume. Which are true? (Choose all that apply.)</p>', ['The pressure doubles.', 'The mean kinetic energy per molecule doubles.', 'The rms speed doubles.', 'The mean free path doubles.'], [0, 1], '<p>P ∝ T and the mean KE ∝ T. The rms speed rises by √2 only. At fixed volume n is fixed, so λ does not change.</p>'),
  ],
  gens: [
    { id: 'kt-g01', type: 'nat', level: 2, exams: ['board'], sub: 'laws',
      make(rng) { const n = choose(rng, [1, 2, 3]), V = choose(rng, [10, 20, 40]), T = pick(rng, 250, 400, 25); const P = n * 8.314 * T / (V / 1000) / 1000; return { n, V, T, q: `<p>${n} mol of an ideal gas is in a ${V} L vessel at ${T} K. Find the pressure in kPa.</p>`, answer: r3(P), tol: P * 0.01, unit: 'kPa', sol: `<p>P = nRT/V = ${n} × 8.314 × ${T}/${V / 1000} = ${r3(P)} kPa.</p>` }; },
      verify: (p) => (p.n * 6.022e23 * 1.380649e-23 * p.T) / (p.V * 1e-3) / 1000 },
    { id: 'kt-g02', type: 'nat', level: 2, exams: ['board'], sub: 'temperature',
      make(rng) { const M = choose(rng, [2, 4, 28, 32, 44]), T = pick(rng, 200, 800, 100); const v = Math.sqrt(3 * 8.314 * T / (M / 1000)); return { M, T, q: `<p>Find the rms speed in m/s of molecules of molar mass ${M} g/mol at ${T} K.</p>`, answer: r3(v), tol: v * 0.01, unit: 'm/s', sol: `<p>v = √(3RT/M) = √(3 × 8.314 × ${T}/${M / 1000}) = ${r3(v)} m/s.</p>` }; },
      verify: (p) => Math.sqrt((3 * 1.380649e-23 * p.T) / (p.M * 1e-3 / 6.022e23)) },
    { id: 'kt-g03', type: 'nat', level: 3, exams: ['board'], sub: 'equipartition',
      make(rng) { const f = choose(rng, [3, 5, 6]), n = choose(rng, [1, 2, 4]), T = pick(rng, 200, 500, 50); const U = f / 2 * n * 8.314 * T; return { f, n, T, q: `<p>The molecules of an ideal gas have ${f} active degrees of freedom. Find the internal energy of ${n} mol at ${T} K in joules.</p>`, answer: r3(U), tol: U * 0.01, unit: 'J', sol: `<p>U = (f/2) nRT = ${f / 2} × ${n} × 8.314 × ${T} = ${r3(U)} J.</p>` }; },
      verify: (p) => { const N = p.n * 6.022e23, kT = 1.380649e-23 * p.T; return N * kT * p.f / 2; } },
    { id: 'kt-g04', type: 'nat', level: 3, exams: ['board'], sub: 'mean free path',
      make(rng) { const d = choose(rng, [0.2, 0.3, 0.4]), nn = choose(rng, [1, 2.7, 5]); const l = 1e9 / (Math.SQRT2 * Math.PI * (d * 1e-9) ** 2 * nn * 1e25); return { d, nn, q: `<p>Molecules of diameter ${d} nm are at ${nn} × 10<sup>25</sup> per m³. Find the mean free path in nm.</p>`, answer: r3(l), tol: l * 0.01, unit: 'nm', sol: `<p>λ = 1/(√2 π d² n) = ${r3(l)} nm.</p>` }; },
      verify: (p) => 1e9 / (Math.sqrt(2) * Math.PI * (p.d * 1e-9) ** 2 * p.nn * 1e25) },
  ],
};
