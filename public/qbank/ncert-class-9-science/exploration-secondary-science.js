// Class 9 Science, Chapter 1 Exploration: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('es');
const r2 = (x) => Math.round(x * 100) / 100;

export default {
  topic: 'exploration-secondary-science', name: 'Exploration: Entering the World of Secondary Science', n: 1,
  items: [
    m.mcq(1, 'method', '<p>A hypothesis in science must be:</p>', 'a guess that can be tested and possibly shown wrong', ['a fact that is already proved', 'an opinion that cannot be checked', 'the final result of an experiment'], '<p>A hypothesis is a testable guess. If no test could ever show it wrong, it is not a scientific hypothesis.</p>'),
    m.mcq(2, 'method', '<p>In a fair test of whether fertiliser makes plants grow taller, which of these must be the <i>same</i> for all plants?</p>', 'the amount of water and sunlight', ['the type of fertiliser', 'the height after two weeks', 'the number of leaves at the end'], '<p>Only the independent variable (the fertiliser) may change. Water and sunlight are controlled variables. The height is what is measured (the dependent variable).</p>', { trap: 'Mixing up the variable you change with the variables you keep the same.' }),
    m.mcq(1, 'method', '<p>The variable that you measure as the result of an experiment is called the:</p>', 'dependent variable', ['independent variable', 'controlled variable', 'hypothesis'], '<p>It depends on the changes you make, so it is the dependent variable. It goes on the y-axis of a graph.</p>'),
    m.mcq(1, 'units', '<p>Which of these is an SI base unit?</p>', 'kilogram', ['newton', 'litre', 'joule'], '<p>The kilogram is a base unit of mass. The newton and joule are derived units, and the litre is not an SI unit.</p>'),
    m.mcq(2, 'units', '<p>The prefix micro (µ) stands for:</p>', '10<sup>−6</sup>', ['10<sup>−3</sup>', '10<sup>6</sup>', '10<sup>−9</sup>'], '<p>micro = 10⁻⁶ (one millionth). Milli is 10⁻³, mega 10⁶, nano 10⁻⁹.</p>'),
    m.mcq(2, 'units', '<p>A speed of 36 km/h is the same as:</p>', '10 m/s', ['36 m/s', '100 m/s', '3.6 m/s'], '<p>36 × 1000 m ÷ 3600 s = 10 m/s. Divide km/h by 3.6.</p>'),
    m.mcq(2, 'sigfig', '<p>The number of significant figures in 0.00340 is:</p>', '3', ['5', '6', '2'], '<p>The leading zeros do not count. The digits 3, 4 and the trailing 0 (after a decimal point) count: 3 significant figures.</p>'),
    m.mcq(2, 'sigfig', '<p>The number 2400 (written with no decimal point) is usually taken to have:</p>', '2 significant figures', ['4 significant figures', '3 significant figures', '1 significant figure'], '<p>Trailing zeros with no decimal point are place holders. Writing 2.4 × 10³ makes it clear that there are 2.</p>', { trap: 'Counting trailing zeros when there is no decimal point.' }),
    m.mcq(2, 'sigfig', '<p>The product 3.2 cm × 1.25 cm is best reported as:</p>', '4.0 cm²', ['4 cm²', '4.00 cm²', '4.000 cm²'], '<p>3.2 × 1.25 = 4.00. The least precise factor (3.2) has 2 significant figures, so the answer has 2: 4.0 cm².</p>'),
    m.mcq(2, 'sigfig', '<p>The sum 15.23 g + 2.1 g is best written as:</p>', '17.3 g', ['17.33 g', '17 g', '17.330 g'], '<p>15.23 + 2.1 = 17.33. For addition keep the decimal places of the least precise number (2.1: one decimal place), so 17.3 g.</p>'),
    m.mcq(2, 'errors', '<p>A balance shows 0.3 g when nothing is on it. This is a:</p>', 'zero error (a systematic error)', ['random error', 'parallax error', 'calculation error'], '<p>The balance adds 0.3 g to every reading. This is a zero error, a kind of systematic error, and it is removed by subtracting 0.3 g.</p>'),
    m.mcq(2, 'errors', '<p>Which error is reduced by taking many readings and finding their mean?</p>', 'random error', ['zero error', 'a stretched measuring tape', 'a clock that runs fast'], '<p>Random errors go up and down, so they average out. The other three push every reading the same way.</p>'),
    m.mcq(1, 'errors', '<p>To avoid parallax error while reading a scale, the eye should be:</p>', 'straight above the mark being read', ['to the left of the mark', 'as far as possible from the scale', 'closed one second before reading'], '<p>Looking straight down gives a line of sight at right angles to the scale, so the pointer and mark line up.</p>'),
    m.mcq(3, 'errors', '<p>Five arrows are all close together but far from the bullseye. The shooting is:</p>', 'precise but not accurate', ['accurate but not precise', 'both accurate and precise', 'neither accurate nor precise'], '<p>The arrows agree with each other (precise) but miss the target (not accurate): this points to a systematic error such as a bent sight.</p>'),
    m.mcq(3, 'instrument', '<p>A vernier caliper has 10 vernier divisions equal to 9 main-scale divisions (1 mm each). Its least count is:</p>', '0.1 mm', ['0.9 mm', '1 mm', '0.01 mm'], '<p>One vernier division is 0.9 mm, so the least count is 1 − 0.9 = 0.1 mm.</p>'),
    m.mcq(2, 'graph', '<p>On a graph of a quantity you change against a quantity you measure, the quantity you change goes on the:</p>', 'x-axis', ['y-axis', 'either axis, it makes no difference', 'title'], '<p>The independent variable goes on the x-axis; the measured, dependent variable goes on the y-axis.</p>'),
    m.mcq(2, 'graph', '<p>A straight line through the origin on a graph of y against x shows that:</p>', 'y is directly proportional to x', ['y is constant', 'y falls as x rises', 'y is proportional to x²'], '<p>y = kx: doubling x doubles y. The slope k is the constant of proportionality.</p>'),
    m.mcq(3, 'graph', '<p>For a graph of distance against time for a runner, the slope of the line is measured in:</p>', 'metres per second', ['seconds per metre', 'metres', 'seconds'], '<p>Slope = rise ÷ run = change in distance ÷ change in time, so its unit is m/s: a speed.</p>'),
    m.ar(2, 'method', 'In a fair test only one variable is changed at a time.', 'If several variables are changed together, we cannot tell which one caused the effect.', 0, '<p>Both true, and R is the reason for A.</p>'),
    m.ar(2, 'sigfig', 'The number 0.0050 has two significant figures.', 'Zeros before the first non-zero digit are significant.', 2, '<p>A is true (5 and the last 0). R is false: leading zeros are not significant.</p>'),
    m.ar(3, 'errors', 'Averaging many readings removes a zero error.', 'A zero error changes every reading by the same amount.', 3, '<p>A is false: because every reading is shifted by the same amount, the mean is shifted too. R is true. Averaging only helps with random errors.</p>'),
    m.nat(1, 'units', '<p>Convert 2.5 km to metres. Give the answer in metres.</p>', () => 2500, 0, '<p>2.5 × 1000 = 2500 m.</p>', { unit: 'm' }),
    m.nat(2, 'units', '<p>A chip of silicon is 400 µm thick. Express this in millimetres.</p>', () => 0.4, 0.01, '<p>1 µm = 10⁻³ mm, so 400 µm = 0.4 mm.</p>', { unit: 'mm' }),
    m.nat(2, 'errors', '<p>Readings of a length are 5.2, 5.0, 5.4, 5.1 and 5.3 cm. Find the mean in cm.</p>', () => 5.2, 0.01, '<p>Sum = 26.0, mean = 26.0 ÷ 5 = 5.2 cm.</p>', { unit: 'cm' }),
    m.nat(3, 'errors', '<p>The true length is 50.0 cm and you measure 50.5 cm. Find the percentage error.</p>', () => 1, 0.02, '<p>Error = 0.5 cm. Percentage error = 0.5 ÷ 50.0 × 100 = 1 %.</p>', { unit: '%' }),
    m.nat(3, 'graph', '<p>A straight-line graph passes through (2 s, 6 m) and (6 s, 22 m). Find its slope in m/s.</p>', () => (22 - 6) / (6 - 2), 0.01, '<p>Slope = (22 − 6) ÷ (6 − 2) = 16 ÷ 4 = 4 m/s.</p>', { unit: 'm/s' }),
    m.msq(2, 'sigfig', '<p>Which of these numbers have exactly 3 significant figures? (Choose all that apply.)</p>', ['0.00420', '4.20', '420', '4200.'], [0, 1], '<p>0.00420 has the digits 4, 2 and a trailing 0 after the point: three. 4.20 has three. 420 with no decimal point has two. 4200. (with a point) has four.</p>'),
  ],
  gens: [
    { id: 'es-g01', type: 'nat', level: 2, exams: ['board'], sub: 'units',
      make(rng) { const v = pick(rng, 18, 144, 18); return { v, q: `<p>Convert a speed of ${v} km/h to m/s.</p>`, answer: r2(v / 3.6), tol: 0.01, unit: 'm/s', sol: `<p>${v} × 1000 ÷ 3600 = ${v} ÷ 3.6 = ${r2(v / 3.6)} m/s.</p>` }; },
      verify: (p) => r2(p.v * 1000 / 3600) },
    { id: 'es-g02', type: 'nat', level: 2, exams: ['board'], sub: 'errors',
      make(rng) { const N = pick(rng, 10, 30, 10), t = pick(rng, 15, 60, 3) + choose(rng, [0.2, 0.4, 0.6, 0.8]); return { N, t, q: `<p>A pendulum makes ${N} oscillations in ${t} s. Find its time period in seconds (2 decimal places).</p>`, answer: r2(t / N), tol: 0.01, unit: 's', sol: `<p>T = total time ÷ number of oscillations = ${t} ÷ ${N} = ${r2(t / N)} s.</p>` }; },
      verify: (p) => r2(p.t / p.N) },
    { id: 'es-g03', type: 'nat', level: 3, exams: ['board'], sub: 'errors',
      make(rng) { const tr = pick(rng, 20, 100, 10), d = choose(rng, [0.5, 1, 1.5, 2, 2.5]); const me = r2(tr + d); return { tr, d, q: `<p>The true length of a rod is ${tr} cm. A student measures ${me} cm. Find the percentage error (2 decimal places).</p>`, answer: r2(d / tr * 100), tol: 0.02, unit: '%', sol: `<p>Error = ${d} cm. Percentage error = ${d} ÷ ${tr} × 100 = ${r2(d / tr * 100)} %.</p>` }; },
      verify: (p) => r2((p.tr + p.d - p.tr) / p.tr * 100) },
    { id: 'es-g04', type: 'nat', level: 3, exams: ['board'], sub: 'graph',
      make(rng) { const m0 = pick(rng, 2, 9) / 2, x1 = pick(rng, 1, 4), x2 = x1 + pick(rng, 2, 6), c = pick(rng, 0, 4); return { m0, x1, x2, c, q: `<p>A straight line passes through (${x1}, ${m0 * x1 + c}) and (${x2}, ${m0 * x2 + c}). Find its slope.</p>`, answer: m0, tol: 0.01, sol: `<p>Slope = (${m0 * x2 + c} − ${m0 * x1 + c}) ÷ (${x2} − ${x1}) = ${m0}.</p>` }; },
      verify: (p) => ((p.m0 * p.x2 + p.c) - (p.m0 * p.x1 + p.c)) / (p.x2 - p.x1) },
  ],
};
