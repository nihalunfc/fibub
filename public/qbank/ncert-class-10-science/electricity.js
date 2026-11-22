// Class 10 Science, Chapter 11 Electricity: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('el');
const r2 = (x) => Math.round(x * 100) / 100;

export default {
  topic: 'electricity', name: 'Electricity', n: 11,
  items: [
    m.mcq(1, 'current', '<p>The SI unit of electric current is the:</p>', 'ampere', ['volt', 'coulomb', 'ohm'], '<p>Current is measured in amperes (A). 1 A is a flow of 1 coulomb of charge per second.</p>'),
    m.mcq(1, 'current', '<p>An ammeter is joined to a circuit:</p>', 'in series, so all the current passes through it', ['in parallel with the part being measured', 'across the cell only', 'either way, it makes no difference'], '<p>An ammeter measures the current flowing through a part, so that current must pass through it: it goes in series. A voltmeter goes in parallel.</p>', { trap: 'Mixing up the two meters: ammeter in series, voltmeter in parallel.' }),
    m.mcq(1, 'potential', '<p>One volt is the potential difference between two points when:</p>', '1 joule of work is done to move 1 coulomb of charge between them', ['1 coulomb flows in 1 second', '1 ampere flows through 1 ohm for 1 second', '1 joule of heat is made each second'], '<p>V = W/Q, so 1 V = 1 J/C.</p>'),
    m.mcq(2, 'ohm', '<p>The V–I graph of a metal wire at constant temperature is:</p>', 'a straight line through the origin', ['a curve bending towards the I axis', 'a horizontal line', 'a straight line that does not pass through the origin'], '<p>Ohm’s law says V ∝ I at a fixed temperature, so the graph is a straight line through (0, 0) with slope R.</p>'),
    m.mcq(2, 'resistivity', '<p>A wire is stretched to twice its length (its volume stays the same). Its resistance becomes:</p>', 'four times as large', ['twice as large', 'half as large', 'the same'], '<p>Length doubles, and since the volume is fixed the area halves. R = ρL/A, so R is multiplied by 2 × 2 = 4.</p>', { trap: 'Forgetting that the wire also gets thinner when it is stretched.' }),
    m.mcq(2, 'resistivity', '<p>Which property of a wire does <i>not</i> change its resistivity?</p>', 'its length', ['its material', 'its temperature', 'none of these: resistivity depends on all three'], '<p>Resistivity is a property of the material (and its temperature). Changing the length or thickness changes the resistance R, not the resistivity ρ.</p>'),
    m.mcq(2, 'combination', '<p>Three equal resistors of R each are joined in parallel. Their total resistance is:</p>', 'R/3', ['3R', 'R', '2R/3'], '<p>1/R<sub>p</sub> = 1/R + 1/R + 1/R = 3/R, so R<sub>p</sub> = R/3.</p>'),
    m.mcq(2, 'combination', '<p>Why are household appliances connected in parallel rather than in series?</p>', 'each gets the full mains voltage and can be switched on or off on its own', ['it uses less wire', 'the total resistance becomes larger', 'the same current then flows through every appliance'], '<p>In parallel every branch has the full 220 V, and one appliance failing or being switched off does not stop the others. In series they would share the voltage and all go off together.</p>'),
    m.mcq(2, 'heating', '<p>The current through a heater is doubled (its resistance stays the same). The heat produced each second becomes:</p>', 'four times as much', ['twice as much', 'half as much', 'the same'], '<p>H = I²Rt. Doubling I multiplies I² by 4.</p>'),
    m.mcq(1, 'heating', '<p>A fuse wire is made of a material with:</p>', 'a low melting point', ['a very high melting point', 'very low resistivity, like copper', 'no resistance'], '<p>A fuse must melt quickly when the current goes above its rating, so it uses a material (a tin-lead alloy, for example) that melts at a low temperature.</p>'),
    m.mcq(1, 'power', '<p>1 kilowatt hour (kWh) is equal to:</p>', '3.6 × 10<sup>6</sup> J', ['1000 J', '3600 J', '3.6 × 10<sup>3</sup> W'], '<p>1 kWh = 1000 W × 3600 s = 3 600 000 J = 3.6 × 10<sup>6</sup> J.</p>'),
    m.mcq(3, 'power', '<p>Two bulbs are rated 100 W, 220 V and 60 W, 220 V. They are joined in series to the 220 V mains. Which glows brighter?</p>', 'the 60 W bulb', ['the 100 W bulb', 'both glow equally', 'neither glows'], '<p>R = V²/P, so the 60 W bulb has the larger resistance (807 Ω against 484 Ω). In series the same current flows through both, and P = I²R is larger for the larger R: the 60 W bulb is brighter.</p>', { trap: 'The rating tells you the power at full 220 V each, not in series.' }),
    m.ar(2, 'ohm', 'The resistance of a filament bulb is higher when it glows than when it is cold.', 'The resistance of a metal increases as its temperature rises.', 0, '<p>Both are true and R explains A: the glowing filament is at about 2500 °C, so its resistance is several times its cold value.</p>'),
    m.ar(2, 'combination', 'In a series circuit, the current is the same in every resistor.', 'In series, the potential difference across each resistor is the same.', 2, '<p>A is true: there is only one path. R is false: in series the voltages add up and are shared in proportion to the resistances.</p>'),
    m.ar(3, 'resistivity', 'Copper is used for connecting wires.', 'Copper has a high resistivity.', 2, '<p>Copper is used because its resistivity is very <i>low</i>, so little energy is lost as heat in the wires. A is true, R is false.</p>'),
    m.ar(2, 'heating', 'Nichrome is used for the coils of electric heaters.', 'Nichrome has a high resistivity and does not oxidise easily when red hot.', 0, '<p>Both true; R explains A. High resistivity means a lot of heat for a given current, and it survives being red hot in air.</p>'),
    m.nat(1, 'current', '<p>A charge of 90 C passes through a wire in 1 minute. Find the current in amperes.</p>', () => 90 / 60, 0.01, '<p>I = Q/t = 90/60 = 1.5 A.</p>', { unit: 'A' }),
    m.nat(2, 'ohm', '<p>A bulb draws 0.25 A from a 6 V battery. Find its resistance in ohms.</p>', () => 6 / 0.25, 0, '<p>R = V/I = 6/0.25 = 24 Ω.</p>', { unit: 'Ω' }),
    m.nat(2, 'combination', '<p>Resistors of 3 Ω and 6 Ω are in parallel, and this pair is in series with a 4 Ω resistor across a 12 V battery. Find the current drawn from the battery, in amperes.</p>', () => 12 / (4 + 2), 0.01, '<p>Parallel pair: (3 × 6)/(3 + 6) = 2 Ω. Total = 2 + 4 = 6 Ω. I = 12/6 = 2 A.</p>', { unit: 'A' }),
    m.nat(3, 'power', '<p>An electric iron of 1100 W is used for 2 hours every day. Find the energy it uses in 30 days, in kWh.</p>', () => 1.1 * 2 * 30, 0, '<p>E = 1.1 kW × 2 h × 30 = 66 kWh (66 units).</p>', { unit: 'kWh' }),
    m.nat(3, 'power', '<p>A 220 V electric kettle draws 5 A. What is its power in watts?</p>', () => 220 * 5, 0, '<p>P = VI = 220 × 5 = 1100 W.</p>', { unit: 'W' }),
    m.msq(3, 'combination', '<p>A 4 Ω and a 12 Ω resistor are joined in parallel across 6 V. Which statements are true? (Choose all that apply.)</p>', ['The voltage across each resistor is 6 V.', 'The current in the 4 Ω resistor is 1.5 A.', 'The total resistance is 16 Ω.', 'The total current is 2 A.'], [0, 1, 3], '<p>Parallel: 6 V across each. I₁ = 6/4 = 1.5 A, I₂ = 6/12 = 0.5 A, total 2 A, so R = 6/2 = 3 Ω (not 16 Ω).</p>'),
  ],
  gens: [
    { id: 'el-g01', type: 'nat', level: 2, exams: ['board'], sub: 'ohm',
      make(rng) { const R = pick(rng, 5, 50, 5), V = choose(rng, [3, 6, 9, 12, 24]); return { R, V, q: `<p>A ${V} V battery is connected across a ${R} Ω resistor. Find the current in amperes (to 2 decimal places).</p>`, answer: r2(V / R), tol: 0.01, unit: 'A', sol: `<p>I = V/R = ${V}/${R} = ${r2(V / R)} A.</p>` }; },
      verify: (p) => r2(p.V / p.R) },
    { id: 'el-g02', type: 'nat', level: 3, exams: ['board'], sub: 'combination',
      make(rng) { const a = pick(rng, 2, 12), b = pick(rng, 2, 12); const s = a + b, p = r2((a * b) / (a + b)); return { a, b, q: `<p>Two resistors, ${a} Ω and ${b} Ω, are first joined in series and then in parallel. Find the ratio (series resistance)/(parallel resistance), to 2 decimal places.</p>`, answer: r2(s / ((a * b) / (a + b))), tol: 0.02, sol: `<p>Series: ${s} Ω. Parallel: (${a} × ${b})/(${a} + ${b}) = ${p} Ω. Ratio = ${s}/${p} ≈ ${r2(s / ((a * b) / (a + b)))}.</p>` }; },
      verify: (p) => r2((p.a + p.b) ** 2 / (p.a * p.b)) },
    { id: 'el-g03', type: 'nat', level: 2, exams: ['board'], sub: 'heating',
      make(rng) { const I = pick(rng, 1, 5), R = pick(rng, 10, 60, 10), t = pick(rng, 1, 5); return { I, R, t, q: `<p>A current of ${I} A flows through a ${R} Ω heater for ${t} minutes. Find the heat produced, in kilojoules.</p>`, answer: (I * I * R * t * 60) / 1000, tol: 0.01, unit: 'kJ', sol: `<p>H = I²Rt = ${I}² × ${R} × ${t * 60} = ${I * I * R * t * 60} J = ${(I * I * R * t * 60) / 1000} kJ.</p>` }; },
      verify: (p) => (p.I ** 2 * p.R * p.t * 60) / 1000 },
  ],
};
