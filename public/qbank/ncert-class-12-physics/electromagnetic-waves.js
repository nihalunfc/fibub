// Class 12 Physics, Chapter 8 Electromagnetic Waves: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('em8');
const r2 = (x) => Math.round(x * 100) / 100;
const C = 3e8, EPS0 = 8.854e-12;

export default {
  topic: 'electromagnetic-waves', name: 'Electromagnetic Waves', n: 8,
  items: [
    m.mcq(1, 'displacement', '<p>Displacement current is produced by:</p>', 'a changing electric flux', ['the flow of free charges', 'a steady magnetic field', 'a changing temperature'], '<p>I<sub>d</sub> = ε₀ dΦ<sub>E</sub>/dt.</p>'),
    m.mcq(2, 'displacement', '<p>While a parallel-plate capacitor is charging with a current I in the wires, the displacement current between the plates is:</p>', 'equal to I', ['zero', 'larger than I', 'smaller than I and in the opposite direction'], '<p>I<sub>d</sub> = ε₀ dΦ<sub>E</sub>/dt = dQ/dt = I.</p>'),
    m.mcq(2, 'displacement', '<p>The correct form of Ampère’s circuital law, as completed by Maxwell, is:</p>', '∮B·dl = μ₀(I + ε₀ dΦ<sub>E</sub>/dt)', ['∮B·dl = μ₀ε₀ dΦ<sub>E</sub>/dt only', '∮B·dl = ε₀I', '∮B·dl = μ₀I only'], '<p>Both conduction and displacement current act as sources of B.</p>'),
    m.mcq(2, 'displacement', '<p>Which of Maxwell’s equations says that magnetic monopoles do not exist?</p>', 'Gauss’s law for magnetism', ['Gauss’s law for electricity', 'Faraday’s law', 'The Ampère–Maxwell law'], '<p>∮B·dA = 0: the net magnetic flux through any closed surface is zero.</p>'),
    m.mcq(1, 'wave', '<p>Electromagnetic waves are:</p>', 'transverse', ['longitudinal', 'both longitudinal and transverse', 'neither of these'], '<p>E and B are both perpendicular to the direction of travel.</p>'),
    m.mcq(2, 'wave', '<p>In an EM wave travelling along +x with E along +y, the magnetic field B points along:</p>', '+z', ['−z', '+y', '+x'], '<p>The direction of travel is that of E × B: ŷ × ẑ = x̂, so B is along +z.</p>', { trap: 'Mixing up which way B points: use E × B for the direction of travel.' }),
    m.mcq(2, 'wave', '<p>The ratio E₀/B₀ for an EM wave in vacuum equals:</p>', 'the speed of light', ['the speed of sound', 'one', 'zero'], '<p>E₀/B₀ = c.</p>'),
    m.mcq(2, 'wave', '<p>The speed of an EM wave in vacuum is given by:</p>', '1/√(μ₀ε₀)', ['√(μ₀ε₀)', 'μ₀/ε₀', 'ε₀/μ₀'], '<p>Maxwell’s result: c = 1/√(μ₀ε₀).</p>'),
    m.mcq(3, 'wave', '<p>An EM wave moves from vacuum into glass. Its frequency:</p>', 'stays the same', ['increases', 'decreases', 'becomes zero'], '<p>The frequency is set by the source; the speed and wavelength change instead.</p>'),
    m.mcq(2, 'wave', '<p>Which of these can be deflected by an electric field?</p>', 'a beam of electrons, but not an EM wave', ['an EM wave, but not a beam of electrons', 'both', 'neither'], '<p>EM waves carry no charge, so a static field does not deflect them.</p>'),
    m.mcq(2, 'energy', '<p>The intensity of a point source falls with distance r from it as:</p>', '1/r²', ['1/r', 'r²', 'it does not change'], '<p>Power spreads over a sphere of area 4πr².</p>'),
    m.mcq(3, 'energy', '<p>A surface absorbs light of intensity I completely. The radiation pressure is:</p>', 'I/c', ['2I/c', 'Ic', 'I/c²'], '<p>Perfect absorption gives I/c; perfect reflection doubles it to 2I/c.</p>'),
    m.mcq(2, 'energy', '<p>In an EM wave, the energy is shared between the electric and magnetic fields in the ratio:</p>', 'equal shares', ['all in the electric field', 'all in the magnetic field', '1 : 2'], '<p>The energy densities are equal: ½ε₀E² = B²/2μ₀ for a vacuum wave.</p>'),
    m.mcq(1, 'spectrum', '<p>Which radiation has the longest wavelength?</p>', 'radio waves', ['X-rays', 'ultraviolet', 'gamma rays'], '<p>The spectrum runs from radio (longest) to gamma (shortest).</p>'),
    m.mcq(2, 'spectrum', '<p>A microwave oven works at 2.45 GHz because this frequency:</p>', 'makes water molecules rotate and heat the food', ['is the frequency of visible light', 'passes through water unchanged', 'is a gamma ray frequency'], '<p>Water molecules absorb strongly near this frequency.</p>'),
    m.mcq(1, 'spectrum', '<p>The radiation that helps in thermal imaging at night is:</p>', 'infrared', ['ultraviolet', 'X-rays', 'microwaves'], '<p>Warm bodies emit infrared.</p>'),
    m.mcq(2, 'spectrum', '<p>Ultraviolet rays from the Sun are mostly absorbed by:</p>', 'the ozone layer', ['the ionosphere', 'the clouds', 'the ocean'], '<p>The ozone layer at about 25 km protects life from harmful UV.</p>'),
    m.mcq(2, 'spectrum', '<p>X-rays are produced when:</p>', 'fast electrons strike a metal target', ['a nucleus decays', 'a current flows in a long wire', 'water boils'], '<p>The sudden stopping of fast electrons gives X-rays.</p>'),
    m.mcq(3, 'spectrum', '<p>Short-wave radio can reach distant countries because:</p>', 'the ionosphere reflects these waves back to the ground', ['they travel faster than light', 'they are absorbed by the ground', 'their wavelength is very short'], '<p>Below about 30 MHz the ionosphere reflects radio waves.</p>'),
    m.ar(2, 'displacement', 'There is a magnetic field between the plates of a charging capacitor.', 'A changing electric field is equivalent to a current as a source of magnetic field.', 0, '<p>Both true and R explains A: the displacement current produces B.</p>'),
    m.ar(2, 'wave', 'Light can travel through empty space.', 'Light is an electromagnetic wave in which E and B regenerate each other.', 0, '<p>Both true; R explains A.</p>'),
    m.ar(2, 'spectrum', 'Ultraviolet radiation is used in water purifiers.', 'Ultraviolet radiation has a longer wavelength than infrared.', 2, '<p>A is true (it kills germs). R is false: UV has a shorter wavelength than IR.</p>'),
    m.ar(3, 'energy', 'An EM wave has momentum.', 'An EM wave carries energy U and travels at speed c, with momentum p = U/c.', 0, '<p>Both true; the relation p = U/c explains the momentum and the radiation pressure.</p>'),
    m.nat(2, 'wave', '<p>Find the wavelength in metres of a radio wave of frequency 100 MHz.</p>', () => 3, 0.01, '<p>λ = c/f = 3 × 10⁸/10⁸ = 3 m.</p>', { unit: 'm' }),
    m.nat(2, 'wave', '<p>The electric field amplitude in a wave is 150 V/m. Find B₀ in nanotesla.</p>', () => 150 / 3e8 * 1e9, 0.01, '<p>B₀ = 150/(3 × 10⁸) = 5 × 10⁻⁷ T = 500 nT.</p>', { unit: 'nT' }),
    m.nat(3, 'energy', '<p>A 100 W point source radiates equally in all directions. Find the intensity at a distance of 2 m in W/m² (to 2 decimal places).</p>', () => 100 / (4 * Math.PI * 4), 0.01, '<p>I = P/(4πr²) = 100/(4π × 4) = 1.99 W/m².</p>', { unit: 'W/m²' }),
    m.nat(3, 'displacement', '<p>The charging current of a capacitor is 0.5 A. Find the displacement current between the plates in amperes.</p>', () => 0.5, 0.01, '<p>I<sub>d</sub> = I = 0.5 A: the same as the conduction current.</p>', { unit: 'A' }),
    m.nat(3, 'spectrum', '<p>Find the energy in eV of a photon of wavelength 620 nm (use E = 1240/λ with λ in nm).</p>', () => 2, 0.01, '<p>E = 1240/620 = 2.0 eV (orange-red light).</p>', { unit: 'eV' }),
    m.msq(3, 'spectrum', '<p>Which of these have a shorter wavelength than visible light? (Choose all that apply.)</p>', ['Ultraviolet', 'X-rays', 'Microwaves', 'Gamma rays'], [0, 1, 3], '<p>Microwaves are longer than visible light.</p>'),
    m.msq(3, 'wave', '<p>Which statements about a plane EM wave in vacuum are true? (Choose all that apply.)</p>', ['E and B are in phase', 'E and B are perpendicular to each other', 'The wave needs a medium', 'The wave is transverse'], [0, 1, 3], '<p>The wave needs no medium.</p>'),
  ],
  gens: [
    { id: 'em8-g01', type: 'nat', level: 2, exams: ['board'], sub: 'wave',
      make(rng) { const f = choose(rng, [88, 92, 98, 100, 106, 900, 1800, 2400]); return { f, q: `<p>A transmitter works at ${f} MHz. Find the wavelength in metres (c = 3 × 10⁸ m/s).</p>`, answer: 300 / f, tol: 0.01 * (300 / f), unit: 'm', sol: `<p>λ = c/f = 3 × 10⁸/(${f} × 10⁶) = ${r2(300 / f)} m.</p>` }; },
      verify: (p) => C / (p.f * 1e6) },
    { id: 'em8-g02', type: 'nat', level: 2, exams: ['board'], sub: 'wave',
      make(rng) { const E0 = choose(rng, [6, 15, 30, 60, 120, 240]); return { E0, q: `<p>A plane EM wave has an electric amplitude of ${E0} V/m. Find the magnetic amplitude in nanotesla.</p>`, answer: E0 / 0.3, tol: 0.01 * E0 / 0.3, unit: 'nT', sol: `<p>B₀ = E₀/c = ${E0}/(3 × 10⁸) = ${r2(E0 / 0.3)} nT.</p>` }; },
      verify: (p) => (p.E0 / C) * 1e9 },
    { id: 'em8-g03', type: 'nat', level: 3, exams: ['board'], sub: 'displacement',
      make(rng) { const A = choose(rng, [50, 100, 200, 500]), dE = choose(rng, [1e10, 2e10, 5e10, 1e11]); const Id = EPS0 * A * 1e-4 * dE; return { A, dE, q: `<p>The plates of a capacitor each have area ${A} cm². The electric field between them changes at ${dE.toExponential(0).replace('e+', ' × 10^')} V/m per second. Find the displacement current in milliamperes.</p>`, answer: Id * 1000, tol: 0.01 * Id * 1000, unit: 'mA', sol: `<p>I<sub>d</sub> = ε₀A dE/dt = 8.854 × 10⁻¹² × ${A * 1e-4} × ${dE.toExponential(0)} = ${r2(Id * 1000)} mA.</p>` }; },
      verify: (p) => ((p.A * 1e-4 * p.dE) / (1 / EPS0)) * 1000 },
    { id: 'em8-g04', type: 'nat', level: 3, exams: ['board'], sub: 'energy',
      make(rng) { const P = choose(rng, [20, 60, 100, 500]), r = choose(rng, [1, 2, 4, 10]); const I = P / (4 * Math.PI * r * r); return { P, r, q: `<p>A ${P} W source radiates equally in all directions. Find the intensity at ${r} m, in W/m² (to 3 significant figures).</p>`, answer: I, tol: 0.01 * I, unit: 'W/m²', sol: `<p>I = P/(4πr²) = ${P}/(4π × ${r}²) = ${I.toPrecision(3)} W/m².</p>` }; },
      verify: (p) => p.P / (12.566370614 * p.r * p.r) },
  ],
};
