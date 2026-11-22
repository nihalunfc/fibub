// Experimental skills in physics (JEE unit): Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EX = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
// Sub-topics taught in Class 12 (CUET rule: level 1-3 mcq also list 'cuet')
const C12 = new Set(['metre bridge', 'resistivity', 'ohms law', 'galvanometer', 'mirror', 'lens', 'optics', 'prism', 'microscope', 'diode', 'zener', 'semiconductor']);
let k = 0; let c = 0;
const nid = () => `xp-${String(++k).padStart(3, '0')}`;
const exFor = (level, sub, type) => (level <= 3 && type === 'mcq' && C12.has(sub) ? [...EX[level], 'cuet'] : EX[level]);
const base = (level, sub, o) => ({ id: nid(), level, exams: exFor(level, sub, o.type), sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const nat = (level, sub, q, answer, tol, sol, o = {}) =>
  base(level, sub, { type: 'nat', format: tol === 0 && Number.isInteger(answer) ? 'integer' : 'numeric', q, answer, tol, sol, ...o });
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

const items = [
  // ---------- Level 1 ----------
  nat(1, 'vernier', r`In a vernier calliper, 1 main scale division (MSD) is 1 mm and 50 vernier divisions equal 49 MSD. Find the least count in mm.`, 0.02, 0.0005,
    r`Least count = 1 MSD ÷ (number of vernier divisions) $= 1/50 = 0.02$ mm.`, { unit: 'mm', calc: () => 1 / 50 }),
  nat(1, 'screw gauge', r`A screw gauge has pitch $0.5$ mm and $50$ divisions on its circular scale. Find the least count in mm.`, 0.01, 0.0005,
    r`Least count = pitch ÷ number of circular divisions $= 0.5/50 = 0.01$ mm.`, { unit: 'mm', calc: () => 0.5 / 50 }),
  mcq(1, 'screw gauge', r`Which instrument is the best choice to measure the diameter of a thin wire to $0.01$ mm?`, 'Screw gauge', ['Metre scale', 'Vernier calliper with least count 0.1 mm', 'Measuring tape'],
    r`The screw gauge usually reads to $0.01$ mm. The metre scale reads only to 1 mm. A vernier calliper of least count $0.1$ mm is too coarse, and a tape is coarser still.`),
  mcq(1, 'vernier', r`A vernier calliper has a <b>positive</b> zero error. To get the true reading we should`, 'subtract the zero error from the observed reading', ['add the zero error to the observed reading', 'ignore the zero error', 'multiply the reading by the zero error'],
    r`True reading = observed reading − zero error. For a positive zero error the instrument reads too much when closed, so its readings are too large and we subtract. (For a negative zero error the subtraction of a negative number adds.)`),
  mcq(1, 'pendulum', r`The time period of a simple pendulum (small oscillations) does <b>not</b> depend on`, 'the mass of the bob', ['its length', 'the value of g', 'the place where it is used'],
    r`$T = 2\pi\sqrt{L/g}$ has no mass in it. It depends on the length and on $g$, and $g$ changes with place.`),
  mcq(1, 'pendulum', r`In a simple pendulum experiment the length $L$ is measured from the point of suspension to`, 'the centre of the bob', ['the top of the bob', 'the bottom of the bob', 'the middle of the thread'],
    r`The formula $T=2\pi\sqrt{L/g}$ uses the distance to the centre of mass of the bob: string length plus the radius of the bob.`),
  mcq(1, 'metre bridge', r`In a metre bridge the balance point is found at $50$ cm from the left end. The known resistance in the left gap is $12\ \Omega$. The unknown resistance in the right gap is`, r`$12\ \Omega$`, [r`$6\ \Omega$`, r`$24\ \Omega$`, r`$50\ \Omega$`],
    r`At the null point $R/S = l/(100-l) = 50/50 = 1$, so the two resistances are equal.`),
  mcq(1, 'ohms law', r`In an experiment to verify Ohm's law, the ammeter and voltmeter are connected as`, 'ammeter in series, voltmeter in parallel with the resistor', ['ammeter in parallel, voltmeter in series', 'both in series', 'both in parallel'],
    r`The ammeter must carry the same current as the resistor, so it is in series. The voltmeter reads the potential difference across the resistor, so it is in parallel.`),
  mcq(1, 'zener', r`A Zener diode is used as a voltage regulator when it is`, 'reverse biased and operating in breakdown', ['forward biased', 'unbiased', 'reverse biased below breakdown'],
    r`A Zener holds its voltage nearly constant in the reverse breakdown region, so it is operated reverse biased, beyond the breakdown voltage.`),
  mcq(1, 'diode', r`The forward knee (cut-in) voltage of a silicon junction diode is about`, '0.7 V', ['0.3 V', '2.0 V', '5.0 V'],
    r`Silicon starts to conduct noticeably near $0.7$ V; germanium near $0.3$ V.`),
  mcq(1, 'ohms law', r`A graph of potential difference $V$ (y-axis) against current $I$ (x-axis) for a metal wire at constant temperature is a straight line through the origin. Its slope gives`, 'the resistance', ['the power', 'the resistivity', 'the conductance'],
    r`$V = IR$, so the slope $V/I$ is the resistance $R$. The conductance would be the slope of the $I$–$V$ graph.`),
  mcq(1, 'mirror', r`With a concave mirror, the object pin is moved until its image is at the same place as the object. The pin is then at`, 'the centre of curvature', ['the focus', 'the pole', 'infinity'],
    r`An object at the centre of curvature has its real, inverted image of equal size at the same place. So $u = v = R = 2f$.`),
  mcq(1, 'vernier', r`The pitch of a screw gauge is the`, 'distance the screw moves along its axis in one full turn', ['distance between two circular divisions', 'diameter of the screw', 'smallest length the gauge can read'],
    r`Pitch is the linear distance moved per rotation. The least count is pitch divided by the number of circular divisions.`),
  nat(1, 'errors', r`A length is read as $5.0$ cm with an absolute error of $0.1$ cm. Find the percentage error.`, 2, 0,
    r`Percentage error $= (0.1/5.0)\times100 = 2\%$.`, { unit: '%', calc: () => 0.1 / 5 * 100 }),
  mcq(1, 'errors', r`The least count of an ordinary metre scale marked in millimetres is`, '0.1 cm', ['1 cm', '0.01 cm', '0.5 cm'],
    r`The smallest division is 1 mm $=0.1$ cm.`),
  mcq(1, 'sound', r`In a resonance tube experiment (ignoring end correction), the first resonance occurs when the air column length is`, r`$\lambda/4$`, [r`$\lambda/2$`, r`$3\lambda/4$`, r`$\lambda$`],
    r`The closed end is a node and the open end is nearly an antinode. The shortest such column is a quarter wavelength.`),
  mcq(1, 'prism', r`At the position of minimum deviation of a prism, the ray inside the prism is`, 'parallel to the base', ['perpendicular to the base', 'along the normal to the first face', 'along the second face'],
    r`At minimum deviation $i = e$ and $r_1=r_2=A/2$. The path is symmetrical, so the ray inside travels parallel to the base of the prism.`),
  mcq(1, 'capillary', r`Water rises higher in a capillary tube of`, 'smaller radius', ['larger radius', 'greater length of tube above the water', 'greater mass'],
    r`$h = 2T\cos\theta/(r\rho g)$. So $h \propto 1/r$ and a thinner tube gives a higher rise.`),
  mcq(1, 'metre bridge', r`The wire of a metre bridge is made of an alloy such as manganin or constantan because the alloy`, 'has a very small temperature coefficient of resistance', ['has very high resistivity so it never heats', 'has zero resistance', 'is magnetic'],
    r`A small temperature coefficient keeps the resistance per unit length steady, even if the wire heats slightly. A uniform wire is needed so that resistance is proportional to length.`),
  mcq(1, 'viscosity', r`A steel ball falls at terminal velocity in a viscous liquid. At that stage the net force on it is`, 'zero', ['equal to its weight', 'equal to the viscous force', 'upward and increasing'],
    r`At terminal velocity, weight is balanced by the upthrust plus the viscous drag, so the net force is zero and the acceleration is zero.`),
  mcq(1, 'young', r`In Searle's method for Young's modulus, a second (reference) wire carrying a constant load is used mainly to`, 'cancel the effect of temperature change and sagging of the support', ['double the extension', 'apply the test load', 'measure the diameter'],
    r`Both wires hang from the same rigid support. Changes in temperature or small movements of the support affect both wires alike, so the vernier measures only the extra extension of the test wire.`),
  mcq(1, 'specific heat', r`The SI unit of specific heat capacity is`, r`$\mathrm{J\,kg^{-1}\,K^{-1}}$`, [r`$\mathrm{J\,K^{-1}}$`, r`$\mathrm{J\,kg}$`, r`$\mathrm{kg\,K\,J^{-1}}$`],
    r`$c = Q/(m\Delta T)$, which has unit J per kg per K. $\mathrm{J\,K^{-1}}$ is heat capacity.`),

  // ---------- Level 2 ----------
  nat(2, 'vernier', r`A vernier calliper has least count $0.01$ cm. For a cylinder the main scale reads $2.4$ cm and the $6$th vernier division coincides with a main scale division. The zero error is $+0.02$ cm. Find the correct diameter in cm.`, 2.44, 0.001,
    r`Observed reading = MSR + VSR × LC $= 2.4 + 6\times0.01 = 2.46$ cm. Correct reading = observed − zero error $= 2.46 - 0.02 = 2.44$ cm.`, { unit: 'cm', calc: () => 2.4 + 6 * 0.01 - 0.02 }),
  nat(2, 'vernier', r`A vernier calliper has 10 vernier divisions and LC $0.01$ cm. With the jaws closed, the $8$th vernier division coincides with a main scale division, so the zero error is negative. For a block, the main scale reads $3.1$ cm and the $5$th vernier division coincides. Find the correct length in cm.`, 3.17, 0.001,
    r`Closed jaws: the vernier zero is behind the main zero by $(10-8)$ divisions, so zero error $= -(10-8)\times0.01 = -0.02$ cm. Observed $= 3.1+5\times0.01 = 3.15$ cm. Correct $= 3.15-(-0.02) = 3.17$ cm.`,
    { unit: 'cm', trap: 'With a negative zero error you count from the other end of the vernier: 8 coinciding means −2, not −8.', calc: () => 3.15 + 0.02 }),
  nat(2, 'screw gauge', r`A screw gauge has pitch $1$ mm and $100$ circular divisions. For a wire the main scale shows $3$ mm and the circular scale reads $36$. With the jaws closed the circular reading is $97$ (the zero is below the reference line by 3 divisions, a negative zero error). Find the correct diameter in mm.`, 3.39, 0.001,
    r`LC $=1/100=0.01$ mm. Observed $= 3+36\times0.01 = 3.36$ mm. Closed reading $97 = 100-3$, so zero error $=-3\times0.01 = -0.03$ mm. Correct $= 3.36-(-0.03)=3.39$ mm.`, { unit: 'mm', calc: () => 3.36 + 0.03 }),
  nat(2, 'screw gauge', r`A screw gauge has pitch $0.5$ mm and $50$ circular divisions. With the jaws closed the circular scale reads $+4$. For a sphere the main scale reads $2.5$ mm and the circular scale reads $27$. Find the correct diameter in mm.`, 2.73, 0.001,
    r`LC $=0.5/50=0.01$ mm. Observed $=2.5+27\times0.01 = 2.77$ mm. Zero error $=+4\times0.01=+0.04$ mm. Correct $=2.77-0.04 = 2.73$ mm.`, { unit: 'mm', calc: () => 2.5 + 0.27 - 0.04 }),
  mcq(2, 'screw gauge', r`When the jaws of a screw gauge are closed, the zero of the circular scale is $4$ divisions <b>above</b> the reference line (LC $=0.01$ mm). The zero error is`, r`$-0.04$ mm`, [r`$+0.04$ mm`, r`$-0.96$ mm`, r`$+0.96$ mm`],
    r`If the circular zero has not yet reached the reference line (it is above it), the screw has to be turned further to close fully, so the gauge reads less than it should: the zero error is negative, $-4\times0.01 = -0.04$ mm. If the zero were below the line, the error would be positive.`,
    { trap: 'Above the line means negative; below means positive. Do not confuse this with the reading of the circular scale.' }),
  nat(2, 'pendulum', r`In a simple pendulum experiment a graph of $T^2$ (y-axis, in $\mathrm{s^2}$) against $L$ (x-axis, in m) is a straight line passing through $(0.20,\,0.80)$ and $(1.00,\,4.00)$. Find $g$ in $\mathrm{m\,s^{-2}}$ from the slope.`, 9.87, 0.05,
    r`$T^2 = \dfrac{4\pi^2}{g}L$, so slope $=4\pi^2/g$. Slope $=(4.00-0.80)/(1.00-0.20) = 4.0\ \mathrm{s^2/m}$. Then $g = 4\pi^2/4.0 = 9.87\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', calc: () => 4 * Math.PI ** 2 / 4 }),
  nat(2, 'pendulum', r`The length of the thread of a pendulum is $90.0$ cm and the bob has diameter $2.0$ cm. The time for 20 oscillations is $38.2$ s. Find $g$ in $\mathrm{m\,s^{-2}}$ (give 2 decimals; $\pi^2=9.8696$).`, 9.84, 0.03,
    r`$L = 90.0+1.0 = 91.0$ cm $=0.910$ m. $T = 38.2/20 = 1.91$ s. $g = 4\pi^2L/T^2 = 39.478\times0.910/3.6481 = 9.847$. So $g\approx 9.85$ (tolerance covers rounding).`, { unit: 'm/s²', calc: () => 4 * Math.PI ** 2 * 0.91 / 1.91 ** 2, trap: 'Forgetting to add the bob radius to the thread length.' }),
  mcq(2, 'pendulum', r`Why is the time of <b>20 or more</b> oscillations measured instead of one?`, 'The error in T falls because the stopwatch error is shared among many oscillations', ['The period increases with the number of oscillations', 'A single oscillation never has a fixed period', 'The thread length changes after one swing'],
    r`The stopwatch has a fixed error (reaction time plus least count) in $t$. With $n$ oscillations $T=t/n$, so $\Delta T = \Delta t/n$ is smaller. The relative error $\Delta T/T = \Delta t/t$ also becomes smaller as $t$ gets larger.`),
  mcq(2, 'pendulum', r`In a pendulum experiment the amplitude should be kept small (less than about $5^\circ$) because`, r`$T=2\pi\sqrt{L/g}$ is derived assuming $\sin\theta\approx\theta$`, ['the thread would break at large angles', 'g changes with the angle', 'the mass starts to matter at large angles'],
    r`For larger angles the motion is no longer simple harmonic and the period becomes a little longer than $2\pi\sqrt{L/g}$.`),
  nat(2, 'pendulum', r`Find the length of a "seconds pendulum" (period $2.0$ s) at a place where $g=9.8\ \mathrm{m\,s^{-2}}$. Give the answer in cm (take $\pi^2=9.87$).`, 99.3, 0.3,
    r`$L = gT^2/(4\pi^2) = 9.8\times4/39.48 = 0.993$ m $=99.3$ cm.`, { unit: 'cm', calc: () => 9.8 * 4 / (4 * Math.PI ** 2) * 100 }),
  nat(2, 'metre scale', r`A uniform metre scale of mass $100$ g balances on a knife edge at the $50$ cm mark. A body of mass $60$ g is hung at the $20$ cm mark. Where must a $40$ g body be hung (cm mark) to restore balance on the same knife edge?`, 95, 0.1,
    r`The scale's own weight acts at 50 cm, which is on the knife edge, so it gives no torque. Take torques about 50 cm: $60\times(50-20) = 40\times(x-50)$. So $1800 = 40(x-50)$, $x-50=45$, $x=95$ cm.`, { unit: 'cm', calc: () => 50 + 60 * 30 / 40 }),
  nat(2, 'metre scale', r`A metre scale is balanced on a knife edge at $40.0$ cm when a $50$ g mass hangs at the $10.0$ cm mark and nothing else is used. Find the mass of the scale in g.`, 150, 0.5,
    r`The scale's weight acts at its centre, the 50 cm mark. About the knife edge at 40 cm: $50\times(40-10) = M\times(50-40)$. So $1500 = 10M$ and $M=150$ g.`, { unit: 'g', calc: () => 50 * 30 / 10 }),
  nat(2, 'young', r`In Searle's experiment a steel wire of length $2.00$ m and diameter $0.50$ mm is stretched by a load of $3.0$ kg, giving an extension of $1.0$ mm. Find $Y$ in $10^{11}\ \mathrm{N\,m^{-2}}$ (take $g=9.8$, $\pi=3.14$).`, 3.0, 0.1,
    r`$Y = \dfrac{FL}{A\,\Delta L} = \dfrac{4MgL}{\pi d^2\Delta L} = \dfrac{4\times3.0\times9.8\times2.00}{3.14\times(0.5\times10^{-3})^2\times10^{-3}}$. Numerator $=235.2$; denominator $=3.14\times2.5\times10^{-7}\times10^{-3}=7.85\times10^{-10}$. So $Y = 3.0\times10^{11}\ \mathrm{N\,m^{-2}}$.`, { unit: '10¹¹ N/m²', calc: () => 4 * 3 * 9.8 * 2 / (3.14 * (0.5e-3) ** 2 * 1e-3) / 1e11 }),
  nat(2, 'young', r`A graph of load $M$ (kg, y-axis) against extension $\Delta L$ (mm, x-axis) for a wire is a straight line with slope $2.0\ \mathrm{kg\,mm^{-1}}$. The wire has length $1.5$ m and diameter $0.60$ mm. Find $Y$ in $10^{11}\ \mathrm{N\,m^{-2}}$ ($g=9.8$, $\pi=3.14$).`, 1.04, 0.03,
    r`$Y = \dfrac{4gL}{\pi d^2}\cdot\dfrac{M}{\Delta L}$. Slope $M/\Delta L = 2.0\ \mathrm{kg/mm} = 2000\ \mathrm{kg/m}$ (1 mm $=10^{-3}$ m). So $Y = \dfrac{4\times9.8\times1.5\times2000}{3.14\times(0.6\times10^{-3})^2} = \dfrac{1.176\times10^{5}}{1.1304\times10^{-6}} = 1.04\times10^{11}\ \mathrm{N\,m^{-2}}$.`,
    { unit: '10¹¹ N/m²', trap: 'Convert kg per mm to kg per m (multiply by 1000).', calc: () => 4 * 9.8 * 1.5 * 2000 / (3.14 * (0.6e-3) ** 2) / 1e11 }),
  nat(2, 'capillary', r`Water rises $4.5$ cm in a capillary of radius $0.30$ mm. Take the contact angle as zero, $\rho=1000\ \mathrm{kg\,m^{-3}}$, $g=9.8$. Find the surface tension in $\mathrm{N\,m^{-1}}$ (ignore the meniscus correction).`, 0.0662, 0.001,
    r`$T = \dfrac{r h\rho g}{2\cos\theta} = \dfrac{0.30\times10^{-3}\times0.045\times1000\times9.8}{2} = 0.0662\ \mathrm{N\,m^{-1}}$.`, { unit: 'N/m', calc: () => 0.3e-3 * 0.045 * 1000 * 9.8 / 2 }),
  mcq(2, 'capillary', r`In the capillary rise experiment the height $h$ is measured from the free surface of water in the beaker to`, 'the lowest point of the meniscus in the tube', ['the top of the tube', 'the top edge of the meniscus on the wall', 'the bottom of the beaker'],
    r`The formula assumes the height of the liquid column up to the bottom of the meniscus. The small volume of liquid above that level is handled by the correction $h \to h + r/3$.`),
  nat(2, 'viscosity', r`A steel ball of radius $1.0$ mm ($\rho_s=7800\ \mathrm{kg\,m^{-3}}$) falls at a steady speed of $0.20\ \mathrm{m\,s^{-1}}$ in glycerine ($\sigma=1260\ \mathrm{kg\,m^{-3}}$). Find the viscosity $\eta$ in $\mathrm{Pa\,s}$ using $\eta=\dfrac{2r^2(\rho_s-\sigma)g}{9v}$ ($g=9.8$).`, 0.0712, 0.002,
    r`$\rho_s-\sigma = 6540\ \mathrm{kg\,m^{-3}}$. Numerator: $2\times(10^{-3})^2\times6540\times9.8 = 0.1282$. Denominator: $9\times0.20=1.8$. So $\eta = 0.1282/1.8 = 0.0712\ \mathrm{Pa\,s}$.`, { unit: 'Pa s', calc: () => 2 * 1e-6 * 6540 * 9.8 / 1.8 }),
  nat(2, 'sound', r`A tuning fork of frequency $512$ Hz gives the first resonance in a resonance tube at an air column of $15.0$ cm and the second resonance at $49.5$ cm. Find the speed of sound in $\mathrm{m\,s^{-1}}$.`, 353.3, 0.5,
    r`The two resonances are half a wavelength apart: $\lambda/2 = L_2-L_1 = 34.5$ cm, so $\lambda=69.0$ cm $=0.690$ m. $v=f\lambda=512\times0.690=353.3\ \mathrm{m\,s^{-1}}$. Using the difference removes the unknown end correction.`, { unit: 'm/s', calc: () => 512 * 2 * 0.345 }),
  nat(2, 'sound', r`In the same experiment ($L_1=15.0$ cm, $L_2=49.5$ cm) find the end correction in cm.`, 2.25, 0.02,
    r`$L_1+e=\lambda/4$ and $L_2+e=3\lambda/4$. Subtract: $\lambda/2=L_2-L_1$. Then $e=\lambda/4-L_1=(L_2-L_1)/2-L_1=(L_2-3L_1)/2 = (49.5-45.0)/2=2.25$ cm.`, { unit: 'cm', calc: () => (49.5 - 45) / 2 }),
  mcq(2, 'sound', r`Why is an end correction needed in a resonance tube?`, 'the antinode forms slightly outside the open end of the tube', ['the closed end is not a node', 'the speed of sound is different in the tube', 'the tuning fork vibrates at a different frequency inside the tube'],
    r`The air just outside the open end also moves, so the antinode is a distance $e\approx0.6r$ beyond the end. The effective length is $L+e$.`),
  nat(2, 'specific heat', r`A $150$ g metal ball at $100\ ^\circ\mathrm{C}$ is dropped into $200$ g of water at $25\ ^\circ\mathrm{C}$ in a calorimeter of water equivalent $20$ g. The final temperature is $32\ ^\circ\mathrm{C}$. Find the specific heat of the metal in $\mathrm{cal\,g^{-1}\,{}^\circ C^{-1}}$.`, 0.151, 0.002,
    r`Heat lost by the ball = heat gained by water and calorimeter. $150\,c\,(100-32) = (200+20)\times1\times(32-25)$. So $10200\,c = 1540$ and $c=0.151$.`, { unit: 'cal/g°C', calc: () => 220 * 7 / (150 * 68) }),
  mcq(2, 'specific heat', r`In the method of mixtures, the calorimeter is placed inside a larger wooden box with cotton in the gap mainly to`, 'reduce heat loss to the surroundings', ['increase the specific heat of water', 'make the temperature rise faster', 'stop the water from evaporating completely'],
    r`The principle $\text{heat lost}=\text{heat gained}$ holds only if no heat escapes. Insulation reduces the loss by conduction and convection.`),
  nat(2, 'metre bridge', r`In a metre bridge the known resistance $R=5.0\ \Omega$ is in the left gap and the unknown $X$ in the right gap. The null point is at $40.0$ cm from the left end. Find $X$ in ohm.`, 7.5, 0.05,
    r`$R/X = l/(100-l) = 40/60$. So $X=R\times60/40 = 5.0\times1.5 = 7.5\ \Omega$.`, { unit: 'Ω', calc: () => 5 * 60 / 40 }),
  nat(2, 'resistivity', r`The wire in the right gap of a metre bridge has resistance $7.5\ \Omega$, length $60.0$ cm and diameter $0.40$ mm. Find its resistivity in $10^{-6}\ \Omega\,\mathrm m$ ($\pi=3.14$).`, 1.57, 0.02,
    r`$\rho = \dfrac{XA}{L}=\dfrac{X\pi d^2}{4L} = \dfrac{7.5\times3.14\times(0.4\times10^{-3})^2}{4\times0.600} = \dfrac{3.768\times10^{-6}}{2.4}=1.57\times10^{-6}\ \Omega\,\mathrm m$.`, { unit: '10⁻⁶ Ω m', calc: () => 7.5 * 3.14 * (0.4e-3) ** 2 / (4 * 0.6) * 1e6 }),
  nat(2, 'ohms law', r`In a V–I experiment on a resistor the readings are $(0.10\ \mathrm A,\ 0.45\ \mathrm V)$ and $(0.50\ \mathrm A,\ 2.25\ \mathrm V)$ and the graph is a straight line through the origin. Find the resistance in ohm.`, 4.5, 0.05,
    r`Resistance = slope $\Delta V/\Delta I=(2.25-0.45)/(0.50-0.10)=1.80/0.40=4.5\ \Omega$. Using the slope is better than one reading because it averages the errors.`, { unit: 'Ω', calc: () => 1.8 / 0.4 }),
  nat(2, 'galvanometer', r`A galvanometer shows full deflection when a resistance $R=2000\ \Omega$ is in series with a cell. A shunt $S=100\ \Omega$ across the galvanometer reduces the deflection to half. Find the galvanometer resistance $G$ in ohm (half-deflection method; cell resistance negligible).`, 105.3, 0.5,
    r`With $R$ in series the current is $E/(R+G)$. With the shunt $S$ added and $R$ unchanged, the galvanometer gets half of that current. Working this out gives $G=\dfrac{RS}{R-S}=\dfrac{2000\times100}{1900}=105.3\ \Omega$.`, { unit: 'Ω', calc: () => 2000 * 100 / 1900 }),
  nat(2, 'galvanometer', r`A galvanometer of resistance $50\ \Omega$ gives full-scale deflection for $2.0$ mA. What shunt resistance (in ohm) converts it into an ammeter of range $0$–$1.0$ A?`, 0.1002, 0.001,
    r`The shunt carries $I-I_g=0.998$ A and has the same voltage as the galvanometer: $S(I-I_g)=I_gG$. So $S=\dfrac{0.002\times50}{0.998}=0.1002\ \Omega$. A tiny shunt is needed, which is why an ammeter has very low resistance.`, { unit: 'Ω', calc: () => 0.002 * 50 / 0.998 }),
  nat(2, 'galvanometer', r`A galvanometer of resistance $100\ \Omega$ gives full-scale deflection for $1.0$ mA. What series resistance (in ohm) makes it a voltmeter of range $0$–$3$ V?`, 2900, 1,
    r`Total resistance needed $=V/I_g = 3/0.001=3000\ \Omega$. Series resistance $=3000-100=2900\ \Omega$.`, { unit: 'Ω', calc: () => 3 / 0.001 - 100 }),
  nat(2, 'galvanometer', r`A galvanometer ($G=100\ \Omega$) is joined to a $2$ V cell through $R=9900\ \Omega$ and gives a deflection of $20$ divisions. Find the figure of merit in $\mu\mathrm A$ per division.`, 10, 0.1,
    r`Current $I=E/(R+G)=2/10000=200\ \mu\mathrm A$. Figure of merit $k=I/\theta=200/20=10\ \mu\mathrm A$ per division.`, { unit: 'µA/div', calc: () => 2 / 10000 * 1e6 / 20 }),
  nat(2, 'lens', r`In the $u$–$v$ method with a convex lens, an object at $30.0$ cm gives a real image at $60.0$ cm. Find the focal length in cm.`, 20, 0.1,
    r`Using magnitudes with the lens formula: $\dfrac1f=\dfrac1v+\dfrac1u=\dfrac1{60}+\dfrac1{30}=\dfrac{3}{60}=\dfrac1{20}$. So $f=20$ cm.`, { unit: 'cm', calc: () => 1 / (1 / 60 + 1 / 30) }),
  nat(2, 'lens', r`On a $u$–$v$ graph for a convex lens the point where $u=v$ is $(40\ \mathrm{cm},\ 40\ \mathrm{cm})$. Find $f$ in cm.`, 20, 0.1,
    r`When $u=v$, $1/f=2/u$, so $u=v=2f$. Hence $f=40/2=20$ cm.`, { unit: 'cm', calc: () => 40 / 2 }),
  nat(2, 'lens', r`The displacement method uses a fixed object–screen distance $D=90$ cm. The two lens positions giving a sharp image are $d=30$ cm apart. Find $f$ in cm.`, 20, 0.1,
    r`$f=\dfrac{D^2-d^2}{4D}=\dfrac{8100-900}{360}=20$ cm.`, { unit: 'cm', calc: () => (8100 - 900) / 360 }),
  nat(2, 'microscope', r`A travelling microscope reads $3.120$ cm when focused on a mark on paper, $3.480$ cm when focused on the same mark seen through a glass slab placed on it, and $4.320$ cm when focused on lycopodium powder on top of the slab. Find the refractive index of the glass.`, 1.43, 0.01,
    r`Real thickness $=4.320-3.120=1.200$ cm. Apparent thickness $=4.320-3.480=0.840$ cm. $\mu=\text{real}/\text{apparent}=1.200/0.840=1.43$.`, { calc: () => 1.2 / 0.84 }),
  nat(2, 'prism', r`A prism of angle $A=60^\circ$ has minimum deviation $\delta_m=37^\circ$ for a ray. Find the refractive index of its material ($\sin48.5^\circ=0.749$).`, 1.5, 0.01,
    r`$\mu=\dfrac{\sin\frac{A+\delta_m}2}{\sin\frac A2}=\dfrac{\sin48.5^\circ}{\sin30^\circ}=\dfrac{0.749}{0.5}=1.50$.`, { calc: () => 0.749 / 0.5 }),
  nat(2, 'diode', r`For a forward-biased junction diode the current rises from $2.0$ mA to $12.0$ mA when the voltage rises from $0.70$ V to $0.75$ V. Find the dynamic resistance in ohm.`, 5, 0.05,
    r`Dynamic resistance $r=\Delta V/\Delta I=0.05/(10\times10^{-3})=5\ \Omega$. It is the local slope, not $V/I$.`, { unit: 'Ω', calc: () => 0.05 / 0.01 }),
  nat(2, 'zener', r`A Zener regulator has input $12$ V, Zener voltage $5.6$ V and series resistor $220\ \Omega$. A load of $1.0\ \mathrm{k\Omega}$ is connected across the Zener. Find the current through the Zener in mA.`, 23.5, 0.3,
    r`Current through the series resistor $=(12-5.6)/220=29.09$ mA. Load current $=5.6/1000=5.6$ mA. Zener current $=29.09-5.6=23.5$ mA.`, { unit: 'mA', calc: () => 6.4 / 220 * 1000 - 5.6 }),
  mcq(2, 'sigfig', r`A length measured as $0.0450$ m has how many significant figures?`, '3', ['2', '4', '5'],
    r`Leading zeros do not count. The digits $4,5,0$ count, and the trailing zero after the decimal point shows the measurement is precise to the fourth decimal, so there are 3 significant figures.`),
  mcq(2, 'sigfig', r`$m=24.5$ g and $V=3.2$ cm$^3$ are measured. The density, correctly rounded, is`, r`$7.7\ \mathrm{g\,cm^{-3}}$`, [r`$7.66\ \mathrm{g\,cm^{-3}}$`, r`$7.656\ \mathrm{g\,cm^{-3}}$`, r`$8\ \mathrm{g\,cm^{-3}}$`],
    r`$24.5/3.2=7.656$. For a quotient the answer keeps as many significant figures as the least precise value, $3.2$, which has 2. So $7.7$.`),
  nat(2, 'errors', r`The density $\rho=m/V$ is found with $m$ known to $1\%$ and $V$ known to $2\%$. Find the maximum percentage error in $\rho$.`, 3, 0,
    r`For a quotient the relative errors add: $1\%+2\%=3\%$.`, { unit: '%', calc: () => 3 }),
  nat(2, 'errors', r`The period of a pendulum is $T=2\pi\sqrt{L/g}$, so $g=4\pi^2L/T^2$. If $L$ has $0.5\%$ error and $T$ has $1\%$ error, find the maximum percentage error in $g$.`, 2.5, 0.01,
    r`$\dfrac{\Delta g}{g}=\dfrac{\Delta L}{L}+2\dfrac{\Delta T}{T}=0.5+2\times1=2.5\%$.`, { unit: '%', calc: () => 0.5 + 2 }),
  mcq(2, 'errors', r`A student measures the same length of a wire five times and gets almost the same value each time, but all are $0.3$ cm too large because the metre scale's end is worn. This error is`, 'systematic', ['random', 'a gross blunder', 'a least count error'],
    r`An error that is always in the same direction and size, caused by the instrument, is systematic. Repeating the reading does not remove it; correcting the instrument (or noting a zero error) does.`),
  mcq(2, 'errors', r`Taking the mean of many readings mainly reduces`, 'random error', ['systematic error', 'zero error', 'error from a wrongly calibrated scale'],
    r`Random errors are positive or negative equally often and partly cancel in the mean. Systematic errors stay.`),
  mcq(2, 'ohms law', r`In a V–I graph for a resistor, the points lie scattered a little about the straight line. The best way to find $R$ is to`, 'draw the best-fit line and use its slope', ['join the first and last points only', 'average the largest and smallest values of V', 'use only the middle reading'],
    r`The best-fit line uses all the readings and averages out random scatter. Using one or two points gives a poorer estimate.`),
  mcq(2, 'mirror', r`A convex mirror cannot form a real image of a real object. To find its focal length in the lab we therefore`, 'use a convex lens to make the rays converge towards the mirror', ['place the object inside the focus', 'use a larger object', 'use a plane mirror behind it'],
    r`A convex lens produces a converging beam. The mirror is moved until the light retraces its path and forms an image beside the lens object pin. That happens when the rays hit the mirror along its radii, so the point where they would have met is the centre of curvature behind the mirror, and the mirror-to-point distance is $R=2f$.`),
  mcq(2, 'lens', r`In the parallax method, "no parallax" between the image pin and the object pin means`, 'the tips of the image and the pin are at the same place', ['the image is virtual', 'the lens is perfect', 'the image is magnified'],
    r`If two things are at the same distance, they stay together when the eye moves sideways. If they are at different distances, they appear to move relative to each other, which is parallax.`),
  mcq(2, 'diode', r`A semiconductor diode in the reverse bias region (below breakdown) carries`, 'a very small current in the microampere range', ['a large current', 'exactly zero current', 'a current that grows exponentially with voltage'],
    r`The reverse (leakage) current is due to minority carriers; it is tiny and almost independent of voltage until breakdown.`),
  mcq(2, 'zener', r`The reverse characteristic of a Zener diode in the breakdown region is nearly`, 'a vertical line', ['a horizontal line', 'a line through the origin of slope 1', 'a parabola'],
    r`In breakdown the current changes a lot while the voltage hardly changes, so the $I$–$V$ curve is almost vertical. That is why it holds a steady voltage.`),
  mcq(2, 'young', r`In Searle's method, loads are first added step by step and then removed step by step mainly to`, 'check for elastic behaviour and average out the observations', ['increase the Young modulus', 'make the wire thinner', 'reduce the diameter error'],
    r`Readings during loading and unloading should match if the wire stays within its elastic limit. Averaging them reduces random error.`),
  mcq(2, 'viscosity', r`In the falling ball experiment, the ball must be dropped from slightly below the liquid surface, and timing starts only after it has fallen some distance, so that`, 'the ball has reached terminal velocity', ['the ball is not wet', 'the liquid does not move', 'the density of the liquid becomes uniform'],
    r`The formula $\eta=2r^2(\rho-\sigma)g/9v$ applies only when $v$ is the constant terminal velocity.`),
  mcq(2, 'capillary', r`For a capillary tube the contact angle of water with clean glass is about`, r`$0^\circ$`, [r`$90^\circ$`, r`$135^\circ$`, r`$180^\circ$`],
    r`Water wets clean glass well, so the angle is nearly zero and $\cos\theta\approx1$. Mercury has an angle near $135^\circ$.`),
  mcq(2, 'metre scale', r`A metre scale is balanced on a knife edge. For the best accuracy in locating the centre of gravity of the scale, the knife edge is moved until the scale`, 'stays horizontal without any weights', ['touches the table', 'swings freely', 'is vertical'],
    r`The balance point with no weights is the centre of gravity, which is the 50 cm mark for a uniform scale. It is found and used for the moment calculation.`),
  mcq(2, 'sigfig', r`The sum $12.11+18.0+1.012$ in correct significant figures is`, '31.1', ['31.122', '31.12', '31'],
    r`For a sum we keep the decimal places of the least precise number ($18.0$ has one). So $31.122\to31.1$.`),

  // ---------- Level 3 ----------
  nat(3, 'vernier', r`A vernier calliper has 10 vernier divisions and LC $0.01$ cm. With the jaws closed the $5$th vernier division coincides with a main scale division. For a rod the main scale reads $4.7$ cm and the $3$rd vernier division coincides. Find the correct length in cm.`, 4.68, 0.001,
    r`Closed jaws: the 5th division coincides, so zero error $=+5\times0.01=+0.05$ cm (the zero of the vernier is ahead of the main zero). Observed $=4.7+3\times0.01=4.73$ cm. Correct $=4.73-0.05=4.68$ cm.`, { unit: 'cm', calc: () => 4.73 - 0.05, trap: 'A coincidence at 5 does not mean a negative error; negative errors show as coincidence near the end of the vernier (more than half its divisions).' }),
  nat(3, 'errors', r`A cylinder has diameter $d=1.20\pm0.01$ cm and height $h=3.50\pm0.01$ cm. Its volume is $V=\tfrac{\pi}{4}d^2h$. Find the maximum percentage error in $V$ (2 decimals).`, 1.95, 0.02,
    r`$\dfrac{\Delta V}{V}=2\dfrac{\Delta d}{d}+\dfrac{\Delta h}{h}=2\times\dfrac{0.01}{1.20}+\dfrac{0.01}{3.50}=1.667\%+0.286\%=1.95\%$. The diameter dominates because it is squared and is the smaller number.`, { unit: '%', calc: () => 2 * 0.01 / 1.2 * 100 + 0.01 / 3.5 * 100 }),
  nat(3, 'pendulum', r`A pendulum of length $L=100.0\pm0.1$ cm is timed for 20 oscillations: $t=40.0\pm0.1$ s. Find the maximum percentage error in $g=4\pi^2L/T^2$.`, 0.6, 0.01,
    r`$T=t/20$ so $\Delta T/T=\Delta t/t=0.1/40=0.25\%$. $\dfrac{\Delta g}{g}=\dfrac{\Delta L}{L}+2\dfrac{\Delta T}{T}=0.1\%+2\times0.25\%=0.6\%$.`, { unit: '%', calc: () => 0.1 / 100 * 100 + 2 * 0.1 / 40 * 100 }),
  mcq(3, 'pendulum', r`A pendulum has $L=100.0\pm0.1$ cm and 20 oscillations take $t=40.0\pm0.1$ s. Which measurement contributes more to the percentage error in $g=4\pi^2L/T^2$?`, 'the time (0.5 % of the 0.6 % total)', ['the length (0.5 % of the 0.6 % total)', 'both equally', 'neither, since $\\pi$ also has an error'],
    r`Length gives $0.1\%$. Time gives $2\times0.25=0.5\%$ because $T$ is squared. So time dominates; timing more oscillations would reduce its share.`),
  nat(3, 'pendulum', r`A graph of $T^2$ against the string length $l$ (thread only, bob radius not added) is a straight line $T^2=4.0\,l+0.08$ in SI units. Find the radius of the bob in cm.`, 2, 0.05,
    r`The true length is $l+r$, so $T^2=\dfrac{4\pi^2}{g}(l+r)=4.0\,l+4.0\,r$. Comparing, $4.0\,r=0.08$, so $r=0.02$ m $=2$ cm. The graph cuts the $l$-axis at $-r$.`, { unit: 'cm', calc: () => 0.08 / 4.0 * 100 }),
  nat(3, 'young', r`In Searle's experiment, $L=2.000\pm0.005$ m, $d=0.500\pm0.005$ mm and the extension $\Delta L=1.00\pm0.01$ mm for a given load. Find the maximum percentage error in $Y$.`, 3.25, 0.02,
    r`$Y=\dfrac{4MgL}{\pi d^2\Delta L}$, so $\dfrac{\Delta Y}{Y}=\dfrac{\Delta L_0}{L}+2\dfrac{\Delta d}{d}+\dfrac{\Delta(\Delta L)}{\Delta L}$ (taking the load as exact) $=0.25\%+2\%+1\%=3.25\%$. The diameter dominates.`, { unit: '%', calc: () => 0.005 / 2 * 100 + 2 * 0.005 / 0.5 * 100 + 0.01 / 1 * 100 }),
  nat(3, 'capillary', r`Water rises to $h=1.40$ cm in a tube of radius $1.0$ mm. Using the meniscus correction $h\to h+r/3$, find the surface tension in $\mathrm{N\,m^{-1}}$ ($\rho=1000$, $g=9.8$, $\theta=0$).`, 0.0702, 0.0007,
    r`Corrected height $=1.40+0.10/3=1.433$ cm $=0.01433$ m. $T=\dfrac{r h\rho g}{2}=\dfrac{10^{-3}\times0.01433\times1000\times9.8}{2}=0.0702\ \mathrm{N\,m^{-1}}$. Without the correction we would get $0.0686$, about 2 % lower.`, { unit: 'N/m', calc: () => 1e-3 * (0.014 + 1e-3 / 3) * 1000 * 9.8 / 2 }),
  nat(3, 'viscosity', r`A steel ball of radius $1.5$ mm ($\rho_s=7800$) falls $40.0$ cm in $2.5$ s at constant speed in an oil of density $1260\ \mathrm{kg\,m^{-3}}$. Find $\eta$ in $\mathrm{Pa\,s}$ ($g=9.8$).`, 0.200, 0.004,
    r`$v=0.400/2.5=0.16\ \mathrm{m\,s^{-1}}$. $\eta=\dfrac{2r^2(\rho_s-\sigma)g}{9v}=\dfrac{2\times(1.5\times10^{-3})^2\times6540\times9.8}{9\times0.16}=\dfrac{0.2884}{1.44}=0.200\ \mathrm{Pa\,s}$.`, { unit: 'Pa s', calc: () => 2 * (1.5e-3) ** 2 * 6540 * 9.8 / (9 * 0.16) }),
  nat(3, 'viscosity', r`In a falling-ball experiment the radius is $r=1.5\pm0.01$ mm, the fall distance is $40.0\pm0.1$ cm and the time is $2.5\pm0.1$ s. Using $\eta\propto r^2/v$ with $v=s/t$, find the maximum percentage error in $\eta$ (densities exact).`, 5.58, 0.03,
    r`$\eta\propto r^2/v$ and $v=s/t$, so $\eta\propto r^2t/s$. $\dfrac{\Delta\eta}{\eta}=2\dfrac{\Delta r}{r}+\dfrac{\Delta t}{t}+\dfrac{\Delta s}{s}=1.33\%+4\%+0.25\%=5.58\%$. The stopwatch reading dominates.`, { unit: '%', calc: () => 2 * 0.01 / 1.5 * 100 + 0.1 / 2.5 * 100 + 0.1 / 40 * 100 }),
  nat(3, 'sound', r`The speed of sound measured at $27\ ^\circ\mathrm C$ is $347\ \mathrm{m\,s^{-1}}$. Use $v\propto\sqrt T$ to find the speed at $0\ ^\circ\mathrm C$ in $\mathrm{m\,s^{-1}}$.`, 331, 0.5,
    r`$v_0/v_{27}=\sqrt{273/300}$. So $v_0=347\times0.9539=331\ \mathrm{m\,s^{-1}}$. Temperatures must be in kelvin.`, { unit: 'm/s', calc: () => 347 * Math.sqrt(273 / 300), trap: 'Using 27 and 0 (Celsius) in the square root.' }),
  nat(3, 'sound', r`A resonance tube of inner radius $1.9$ cm is used with sound of speed $340\ \mathrm{m\,s^{-1}}$. The first resonance occurs at $24.0$ cm. Taking the end correction as $0.6r$, find the frequency of the fork in Hz.`, 338, 1,
    r`$e=0.6\times1.9=1.14$ cm. $\lambda/4=L_1+e=25.14$ cm, so $\lambda=1.0056$ m. $f=v/\lambda=340/1.0056=338$ Hz.`, { unit: 'Hz', calc: () => 340 / (4 * (0.24 + 0.6 * 0.019)) }),
  nat(3, 'metre bridge', r`In a metre bridge $R=10.0\ \Omega$ is in the left gap and the unknown $X$ in the right. The null point is at $45.0$ cm. Each end of the wire has a small extra length equivalent to $1.0$ cm (end corrections). Find $X$ in ohm.`, 12.17, 0.03,
    r`Include the end corrections in each segment: $\dfrac{R}{X}=\dfrac{45+1}{55+1}=\dfrac{46}{56}$. So $X=10.0\times56/46=12.17\ \Omega$. Without the correction we would get $12.22\ \Omega$.`, { unit: 'Ω', calc: () => 10 * 56 / 46 }),
  nat(3, 'metre bridge', r`A metre bridge null point is at $l=40.0$ cm and the position can be read to $\Delta l=0.1$ cm. Find the percentage error in $X=R\dfrac{100-l}{l}$ due to $\Delta l$ (3 decimals).`, 0.417, 0.003,
    r`$\dfrac{\Delta X}{X}=\left(\dfrac1l+\dfrac1{100-l}\right)\Delta l=\dfrac{100\,\Delta l}{l(100-l)}=\dfrac{100\times0.1}{40\times60}=0.00417=0.417\%$. At $l=50$ cm it would be only $0.4\%$, the smallest possible.`, { unit: '%', calc: () => 100 * 0.1 / (40 * 60) * 100 }),
  nat(3, 'lens', r`A convex lens of focal length $10$ cm is in contact with a concave lens, and the combination behaves as a convex lens of focal length $30$ cm. Find the focal length of the concave lens in cm (with sign).`, -15, 0.1,
    r`$\dfrac1f=\dfrac1{f_1}+\dfrac1{f_2}$, so $\dfrac1{f_2}=\dfrac1{30}-\dfrac1{10}=-\dfrac1{15}$. Hence $f_2=-15$ cm.`, { unit: 'cm', calc: () => 1 / (1 / 30 - 1 / 10) }),
  nat(3, 'prism', r`In a prism experiment $A=60^\circ$. A ray has angle of incidence $45^\circ$ and the angle of emergence $55^\circ$. Find the angle of deviation in degrees.`, 40, 0.1,
    r`$\delta=i+e-A=45+55-60=40^\circ$.`, { unit: 'deg', calc: () => 45 + 55 - 60 }),
  nat(3, 'prism', r`A prism of angle $60^\circ$ and refractive index $1.5$ is used. Find the minimum deviation in degrees ($\sin^{-1}0.75=48.59^\circ$).`, 37.2, 0.2,
    r`At minimum deviation $\mu=\sin\frac{A+\delta_m}2/\sin\frac A2$, so $\sin\frac{A+\delta_m}2=1.5\times0.5=0.75$. Then $\frac{A+\delta_m}2=48.59^\circ$, $A+\delta_m=97.18^\circ$ and $\delta_m=37.2^\circ$.`, { unit: 'deg', calc: () => 2 * 48.59 - 60 }),
  nat(3, 'diode', r`A silicon diode (forward drop $0.7$ V) is in series with a $1.0\ \mathrm{k\Omega}$ resistor and a $5.0$ V battery, forward biased. Find the current in mA.`, 4.3, 0.05,
    r`The diode keeps about $0.7$ V across it, so the resistor has $5.0-0.7=4.3$ V. $I=4.3/1000=4.3$ mA.`, { unit: 'mA', calc: () => (5 - 0.7) / 1000 * 1000 }),
  nat(3, 'ohms law', r`A $100\ \Omega$ resistor is measured by the V–I method with a voltmeter of resistance $1.0\ \mathrm{k\Omega}$ connected directly across it, and the ammeter measures the <b>total</b> current. Find the value of $R$ that the readings give, in ohm.`, 90.9, 0.2,
    r`The voltmeter and the resistor are in parallel, so the ratio $V/I$ is their parallel resistance: $\dfrac{100\times1000}{1100}=90.9\ \Omega$. The measured value is lower than the true one. The error is small only if the voltmeter resistance is far higher than $R$.`, { unit: 'Ω', calc: () => 100 * 1000 / 1100 }),
  mcq(3, 'zener', r`In the Zener regulator of a $12$ V supply, $5.6$ V Zener and $220\ \Omega$ series resistor with no load, the power dissipated in the Zener is about`, '0.16 W', ['0.033 W', '1.6 W', '0.35 W'],
    r`Current $=(12-5.6)/220=29.1$ mA. Power $=V_zI_z=5.6\times0.0291=0.163$ W. So the Zener must be rated above that.`),
  mcq(3, 'galvanometer', r`A galvanometer of resistance $G$ is converted into a voltmeter by a series resistance $R$. Compared with the galvanometer alone, the voltmeter has`, 'a larger range and a larger resistance', ['a larger range and a smaller resistance', 'the same range and a larger resistance', 'a smaller range and a larger resistance'],
    r`The series resistance reduces the current per volt, so the full-scale voltage rises ($V=I_g(R+G)$), and the total resistance $R+G$ is larger. A shunt would do the opposite to the resistance.`),
  mcq(3, 'galvanometer', r`The figure of merit of a galvanometer is $10\ \mu\mathrm A$ per division. A current that gives 35 divisions is`, r`$350\ \mu\mathrm A$`, [r`$3.5\ \mu\mathrm A$`, r`$35\ \mu\mathrm A$`, r`$0.35\ \mu\mathrm A$`],
    r`$I=k\theta=10\times35=350\ \mu\mathrm A$.`),
  mcq(3, 'lens', r`In the $u$–$v$ method, the graph of $1/v$ against $1/u$ (using magnitudes for a real image from a convex lens) is a straight line. Its intercepts on both axes are`, r`$1/f$ each`, [r`$f$ each`, r`$2/f$ each`, r`$1/(2f)$ each`],
    r`$\dfrac1v+\dfrac1u=\dfrac1f$ in magnitudes. Putting $1/u=0$ gives $1/v=1/f$, and $1/v=0$ gives $1/u=1/f$. A line cutting both axes at $1/f$ has slope $-1$.`),
  mcq(3, 'lens', r`For a convex lens, an object is moved from $u=-3f$ to $u=-1.5f$. The image distance $v$`, 'increases from 1.5f to 3f', ['decreases from 3f to 1.5f', 'stays at 2f', 'becomes negative'],
    r`$1/v=1/f-1/(3f)=2/(3f)$ gives $v=1.5f$. For $u=-1.5f$: $1/v=1/f-1/(1.5f)=1/(3f)$ gives $v=3f$. The image moves away from the lens as the object comes closer to $f$.`),
  mcq(3, 'mirror', r`In the concave mirror experiment, the object needle is displaced from $u=-30$ cm and the image needle is found at $v=-30$ cm. The focal length is`, '15 cm', ['30 cm', '60 cm', '7.5 cm'],
    r`$u=v=R$ for an image at the centre of curvature, so $R=30$ cm and $f=R/2=15$ cm.`, { trap: 'The needle at the centre of curvature gives R, not f.' }),
  mcq(3, 'microscope', r`A travelling microscope is used to measure the refractive index of a glass slab. The quantity that is directly proportional to the apparent depth is`, 'the distance the microscope is raised between focusing the mark seen through the slab and the top surface', ['the thickness of the slab', 'the refractive index', 'the distance from the lens to the eye'],
    r`The microscope reading to the powder on top and to the mark seen through the slab differ by the apparent depth. The real depth is the slab thickness.`),
  mcq(3, 'specific heat', r`A student finds the specific heat of a metal ball by the method of mixtures but forgets to include the water equivalent of the calorimeter. The calculated specific heat is`, 'too low', ['too high', 'unchanged', 'zero'],
    r`The heat gained is taken as less than it truly was, since the calorimeter also took heat. Then $c=\text{heat gained}/(m\Delta T)$ is underestimated.`, { trap: 'Missing a heat gain on the receiving side lowers c, not raises it.' }),
  mcq(3, 'young', r`In Searle's method the extension of the test wire is measured with a spirit level and micrometer screw. The wire and the reference wire are of the same material mainly so that`, 'both undergo the same thermal expansion', ['both stretch by the same load', 'both have the same Young modulus as the support', 'the wire diameter need not be measured'],
    r`If the two wires expand equally with temperature, the relative reading of the level is unaffected. The extension caused by the load alone is then isolated.`),
  mcq(3, 'errors', r`The least count of a stopwatch is $0.1$ s. In timing $20$ oscillations, the measured time is $36.0$ s. The percentage error due to the least count is`, '0.28 %', ['0.1 %', '2.8 %', '5.6 %'],
    r`$\Delta t/t=0.1/36.0=0.00278=0.28\%$. This is also the relative error in $T$, since $T=t/20$.`),
  mcq(3, 'sigfig', r`A student measures a length $L=0.0630$ m. Written in cm and with the same number of significant figures it is`, '6.30 cm', ['6.3 cm', '6.300 cm', '0.630 cm'],
    r`The measurement $0.0630$ m has 3 significant figures. Convert: $0.0630$ m $=6.30$ cm, keeping the trailing zero so that three figures are kept.`),
  mcq(3, 'resistivity', r`In finding the resistivity of a wire by a metre bridge, which error contributes most for a thin wire measured with a screw gauge of LC $0.01$ mm and diameter about $0.40$ mm?`, 'the diameter, because it is squared and small', ['the length of the wire', 'the resistance X from the null point', 'the temperature'],
    r`$\rho=X\pi d^2/(4L)$. The diameter error is $2\times0.01/0.40=5\%$. The length is read to $1$ mm in about $60$ cm (0.2 %). So the diameter dominates unless it is measured at several places.`),
  mcq(3, 'diode', r`A forward $I$–$V$ graph of a diode is plotted. The dynamic resistance at a point is`, 'the reciprocal of the slope of the I–V curve at that point', ['the ratio V/I at that point', 'the slope of the V–I curve through the origin', 'always 1 ohm'],
    r`Dynamic resistance $r=\mathrm dV/\mathrm dI$, the reciprocal of the slope of the $I$–$V$ curve. The ratio $V/I$ is the static resistance.`),
  mcq(3, 'metre scale', r`A uniform metre scale is balanced at the $30$ cm mark when a body of mass $m$ hangs at $5$ cm. The scale's mass is $M$. Then $m/M$ is`, '0.8', ['1.25', '0.4', '0.6'],
    r`Torque about the knife edge at 30 cm: $m(30-5)=M(50-30)$. So $25m=20M$ and $m/M=0.8$.`),

  // ---------- Assertion-Reason ----------
  asrt(2, 'metre bridge', r`In a metre bridge, the unknown resistance is measured most accurately when the null point is near the middle of the wire.`, r`The percentage error in $X=R(100-l)/l$ caused by an error $\Delta l$ in reading is smallest when $l=50$ cm.`, 0,
    r`$\dfrac{\Delta X}{X}=\dfrac{100\,\Delta l}{l(100-l)}$. The product $l(100-l)$ is largest at $l=50$, so the error is smallest there. R is true and explains A. The experimenter therefore chooses $R$ close to $X$.`),
  asrt(3, 'screw gauge', r`A screw gauge usually gives a more precise reading than a vernier calliper.`, r`The least count of a typical screw gauge is $0.01$ mm, while a typical vernier calliper has $0.1$ mm.`, 0,
    r`Both are true. A smaller least count means finer readings, and R states exactly why. Some vernier callipers read to $0.02$ mm, but the usual comparison still holds.`),
  asrt(3, 'pendulum', r`In the simple pendulum experiment, a graph of $T$ (y-axis) against $L$ (x-axis) is a straight line.`, r`The square of the time period $T^2$ is directly proportional to the length $L$.`, 3,
    r`A is false: $T=2\pi\sqrt{L/g}$ gives a curve (a parabola on its side). R is true: $T^2=(4\pi^2/g)L$, so the graph of $T^2$ against $L$ is straight. That is why $T^2$–$L$ is plotted.`, { trap: 'A true statement about T² cannot rescue a claim about T.' }),
  asrt(3, 'zener', r`A Zener diode is operated in reverse bias when it is used as a voltage regulator.`, r`In reverse breakdown, the voltage across a Zener diode stays nearly constant while the current through it changes widely.`, 0,
    r`Both are true. The steady voltage in breakdown is the very property used for regulation, so R explains A.`),
  asrt(4, 'young', r`In Searle's experiment, the load on the wire may be increased well beyond the elastic limit to measure $Y$ more accurately.`, r`A larger extension reduces the percentage error in the measurement of the extension.`, 3,
    r`A is false: beyond the elastic limit the wire does not obey Hooke's law and Young's modulus no longer applies (and the wire would not return). R is true in itself, since $\Delta(\Delta L)/\Delta L$ becomes smaller. So we use as large a load as possible <i>within</i> the elastic limit.`, { trap: 'A true reason attached to a false assertion.' }),
  asrt(3, 'galvanometer', r`A galvanometer can be converted into an ammeter by joining a high resistance in series with it.`, r`A high resistance in series with a galvanometer converts it into a voltmeter.`, 3,
    r`A is false: an ammeter needs a small <i>shunt</i> in parallel, so that most of the current bypasses the coil. R is true: a series resistance converts it into a voltmeter. R is a correct fact but it does not rescue A.`, { trap: 'Shunt (parallel, small) gives an ammeter; series (large) gives a voltmeter.' }),
  asrt(4, 'viscosity', r`In the falling-ball experiment the terminal velocity of a ball is the same whether the liquid column is 50 cm or 100 cm deep (once it is reached).`, r`At terminal velocity the weight is balanced by the upthrust plus the viscous force, so there is no net force.`, 0,
    r`Both true and R explains A. Once the forces balance the speed stays constant whatever the depth. We must time the ball only after it reaches that speed.`),
  asrt(3, 'errors', r`Taking the mean of many readings does not remove a zero error of an instrument.`, r`A zero error is a systematic error and shifts all readings in the same direction.`, 0,
    r`Averaging reduces random errors only. A zero error shifts every reading by the same amount, so the mean carries it too, which is why R explains A. We must correct for the zero error.`),
  asrt(4, 'sound', r`In the resonance tube experiment, the second resonance length is slightly more than three times the first.`, r`The antinode forms a little beyond the open end of the tube, at a distance equal to the end correction.`, 0,
    r`$L_1+e=\lambda/4$ and $L_2+e=3\lambda/4$ give $L_2=3L_1+2e$, which is more than $3L_1$. Both true, and R explains A.`),
  asrt(3, 'diode', r`The forward characteristic of a junction diode is a straight line through the origin.`, r`A forward-biased diode conducts only after the applied voltage exceeds the knee voltage.`, 3,
    r`A is false: the forward current is almost zero until about $0.7$ V (Si) and then rises sharply, so the curve is non-linear and not through the origin in the usual sense. R is true.`),
  asrt(4, 'specific heat', r`In the method of mixtures, the final temperature should be taken as soon as the temperatures of the water and metal become equal, not after a long wait.`, r`A longer wait always makes the specific heat measured smaller.`, 2,
    r`A is true: after a long time the whole system loses heat to the surroundings. R is false in its words "always... smaller": the effect of heat loss depends on whether the system is hotter or colder than the surroundings and on the sign of the error, so the claim is not general.`, { trap: '"Always" in a reason is a signal to check it carefully.' }),
  asrt(3, 'lens', r`In the $u$–$v$ method for a convex lens, the point $u=v$ on the graph gives $2f$.`, r`The lens formula in magnitudes, $\dfrac1u+\dfrac1v=\dfrac1f$, gives $u=v=2f$ when $u=v$.`, 0,
    r`Putting $u=v$ gives $2/u=1/f$, so $u=v=2f$. Both true, R explains A.`),

  // ---------- Statements ----------
  stm(2, 'vernier', r`In a vernier calliper, one vernier scale division is smaller than one main scale division.`, r`The least count of a vernier calliper equals one main scale division minus one vernier scale division.`, 0,
    r`For example 10 VSD = 9 MSD, so 1 VSD = 0.9 MSD (smaller). The least count is $1-0.9=0.1$ MSD. Both true.`),
  stm(3, 'vernier', r`If a vernier calliper has a negative zero error, the correction is added to the observed reading.`, r`A positive zero error makes an instrument read less than the true value.`, 2,
    r`I is true: true = observed − (negative error) = observed + magnitude. II is false: a positive zero error means the instrument already shows a positive reading when closed, so it reads more than the true value.`),
  stm(3, 'metre bridge', r`The null point of a metre bridge does not change if the emf of the cell is increased.`, r`At the null point no current flows through the galvanometer, so the balance depends only on the ratio of the resistances.`, 0,
    r`Both true. The balance condition $R/X=l/(100-l)$ has no emf in it, though a larger emf makes the detection more sensitive.`),
  stm(4, 'errors', r`In the pendulum experiment with a stopwatch of LC $0.1$ s timing 20 oscillations of about $2$ s, the error in $T$ has more effect on $g$ than a $1$ mm error in a $1$ m length.`, r`In $g=4\pi^2L/T^2$ the time period appears squared.`, 0,
    r`Time: $\Delta t/t=0.1/40=0.25\%$, so $2\times0.25=0.5\%$ in $g$. Length: $0.1\%$. So time matters more, and squaring is part of the reason. Both true.`),
  stm(4, 'galvanometer', r`In the half-deflection method, $G=\dfrac{RS}{R-S}$ is exact only if the cell resistance is negligible.`, r`For the formula to hold, the shunt $S$ must be much larger than $G$.`, 2,
    r`I is true (the cell resistance adds to $R$ otherwise). II is false: the formula comes from an exact derivation and $S$ is generally comparable to $G$ ($S$ is slightly less than $G$ because $R\gg G$). No extra condition of "much larger" is required.`),
  stm(4, 'lens', r`For a convex lens and a real object, the graph of $|v|$ against $|u|$ is a rectangular hyperbola with asymptotes $u=f$ and $v=f$.`, r`Using magnitudes, $(u-f)(v-f)=f^2$.`, 0,
    r`From $\frac1u+\frac1v=\frac1f$ we get $uv=f(u+v)$, which gives $(u-f)(v-f)=f^2$. That is a rectangular hyperbola about $(f,f)$. Both true.`),
  stm(3, 'prism', r`In the $i$–$\delta$ graph of a prism there is a single value of $\delta$ for each angle of incidence.`, r`There is a single value of $i$ for each angle of deviation.`, 2,
    r`I is true: given $i$, the ray path is fixed, so $\delta$ is fixed. II is false: except at the minimum, two angles of incidence ($i$ and $e$) give the same $\delta$ by reversibility.`),
  stm(3, 'capillary', r`The rise of water in a capillary tube becomes smaller if the water is heated.`, r`The surface tension of water decreases as the temperature rises.`, 0,
    r`$h=2T\cos\theta/(r\rho g)$. The surface tension drops with temperature, so $h$ drops. Both true, and II is the reason.`),
  stm(4, 'zener', r`A Zener regulator keeps the output nearly steady when the load current changes.`, r`The load current drawn from the supply must not exceed the current in the series resistor, or the Zener goes out of breakdown.`, 0,
    r`More load current means less Zener current; the Zener voltage stays nearly constant as long as some Zener current remains, which needs $I_L<I_{\text{total}}$. Both true.`),
  stm(3, 'sigfig', r`The number $2.40$ has three significant figures.`, r`The result of $2.40\times1.2$ should be written with three significant figures.`, 2,
    r`I true. II false: in a product we keep as many significant figures as the least precise factor, $1.2$, so 2 significant figures: $2.9$.`),
  stm(4, 'ohms law', r`In the V–I method for a low resistance, the voltmeter should be connected directly across the resistor only.`, r`The error from the ammeter drop becomes small if the voltmeter is across the resistor alone.`, 0,
    r`For a low resistance, the voltmeter (high resistance) in parallel with the resistor changes it a little; the ammeter drop would be a big share if the voltmeter were across both. So connect the voltmeter directly across the resistor. Both true.`),

  // ---------- Multi-correct ----------
  msq(3, 'vernier', r`Which of the following about the zero error of a vernier calliper or screw gauge are correct?`,
    ['A positive zero error is subtracted from the observed reading', 'A negative zero error is added (in magnitude) to the observed reading', 'The zero error changes with the size of the object measured', 'A zero error is a systematic error'], [0, 1, 3],
    r`Zero error is a fixed offset of the instrument. It does not depend on the object (so the third is wrong). It shifts all readings in the same direction, so it is systematic. A positive error is subtracted and a negative error is added in magnitude.`),
  msq(3, 'pendulum', r`Which of these are correct precautions in the simple pendulum experiment?`,
    ['Keep the amplitude small', 'Use a thick elastic string for more stability', 'Fix the upper end of the thread firmly between two wooden pieces', 'Time a large number of oscillations'], [0, 2, 3],
    r`A small amplitude keeps motion simple harmonic. A firm clamp stops the effective length from changing. Timing many oscillations reduces the relative error. An elastic string stretches and changes $L$, so it is wrong.`),
  msq(4, 'young', r`Which statements are correct for a wire stretched by a load within its elastic limit?`,
    ['The extension for a given load increases with the length of the wire', 'Young\'s modulus of the wire depends on its length', 'The load–extension graph is a straight line', 'A thinner wire of the same material has a larger extension for the same load'], [0, 2, 3],
    r`$\Delta L=FL/(AY)$: it rises with $L$ and falls with $A$, so the first and last are true. A straight line follows from Hooke's law. $Y$ is a material property, so it does not depend on length.`),
  msq(4, 'metre bridge', r`In a metre bridge with $R$ in the left gap and $X$ in the right gap, the null point is at $l$. Which changes leave the null point <i>unchanged</i> or move it to $100-l$ as stated?`,
    ['Both $R$ and $X$ are doubled: null point unchanged', 'The emf of the cell is doubled: null point unchanged', '$R$ and $X$ are interchanged: null point at $100-l$', 'The galvanometer is replaced by one of larger resistance: null point shifts'], [0, 1, 2],
    r`Only the ratio $R/X$ matters, so the first two are correct. Interchanging gives $X/R=l'/(100-l')$, so $l'=100-l$. The galvanometer resistance does not matter at the null point, so the fourth is wrong.`),
  msq(4, 'zener', r`In a Zener regulator with a fixed load, the input voltage rises a little. Which statements are correct?`,
    ['The current through the Zener increases', 'The current through the load stays nearly constant', 'The voltage across the series resistor increases', 'The output voltage rises by the same amount as the input'], [0, 1, 2],
    r`The extra input voltage appears across the series resistor, so its current rises. The load current stays nearly constant because the output is nearly fixed, so the extra current goes through the Zener. The output rises only slightly.`),
  msq(3, 'prism', r`At the position of minimum deviation of a prism, which statements are correct?`,
    ['The angle of incidence equals the angle of emergence', 'The angle of refraction at each face is $A/2$', 'The ray inside the prism is parallel to the base', 'The deviation is the largest possible'], [0, 1, 2],
    r`The symmetric path gives $i=e$ and $r_1=r_2=A/2$, with the ray inside parallel to the base. The deviation is the smallest, not the largest.`),
  msq(4, 'lens', r`For a convex lens producing real images, which statements are correct?`,
    ['For $u=-2f$ the image is at $v=2f$', 'The smallest possible distance between object and real image is $4f$', 'Real images form for every $|u|$ smaller than $f$', 'As the object goes far away, $v\\to f$'], [0, 1, 3],
    r`At $u=-2f$ the image is at $2f$ (equal size). $|u|+|v|$ has the minimum $4f$ there. For $|u|<f$ the image is virtual. As $|u|\to\infty$, $v\to f$.`),
  msq(5, 'errors', r`Which statements about error analysis are correct?`,
    ['If $z=a-b$ then $\\Delta z=\\Delta a+\\Delta b$', 'If $z=a/b$ then $\\Delta z/z=\\Delta a/a-\\Delta b/b$', 'If $z=a^3$ then $\\Delta z/z=3\\Delta a/a$', 'Using the mean of more readings reduces the random error in the result'], [0, 2, 3],
    r`Absolute errors add for sums and differences. For powers, the relative error is multiplied by the power. A quotient also <i>adds</i> relative errors, so the second statement is false. Averaging helps random error.`, { trap: 'In a quotient the errors add; they never subtract.' }),
  msq(4, 'viscosity', r`For a small sphere falling in a viscous liquid, the terminal velocity`,
    ['is proportional to the square of the radius', 'is proportional to the difference of the densities $\\rho-\\sigma$', 'does not depend on the viscosity of the liquid', 'is negative (upward) if the sphere is less dense than the liquid'], [0, 1, 3],
    r`$v=2r^2(\rho-\sigma)g/(9\eta)$. It depends on $\eta$ (inversely), so the third is false. If $\rho<\sigma$ the sign is negative and the sphere rises.`),
  msq(5, 'capillary', r`Which statements about capillary rise are correct?`,
    ['The height is proportional to $1/r$', 'If the tube is tilted, the vertical height stays the same while the length along the tube increases', 'Heating the water decreases the rise', 'Mercury in a clean glass tube rises above the outside level'], [0, 1, 2],
    r`$h=2T\cos\theta/(r\rho g)$. A tilted tube has the same vertical height $h$ but a column length $h/\cos\alpha$. The heated water has lower $T$. For mercury $\theta>90^\circ$ and $h$ is negative: it is depressed.`),
  msq(4, 'galvanometer', r`A galvanometer is converted into an ammeter and into a voltmeter. Which statements are correct?`,
    ['The ammeter has a resistance less than $G$', 'The voltmeter has a resistance more than $G$', 'The ammeter uses a shunt in parallel', 'An ideal voltmeter has zero resistance'], [0, 1, 2],
    r`A shunt in parallel reduces resistance, a series resistor raises it. An ideal voltmeter has infinite resistance, not zero.`),
  msq(5, 'sound', r`In a resonance tube experiment with a fixed tuning fork, which statements are correct?`,
    ['$L_2-L_1=\\lambda/2$', 'If the temperature of the air rises, both resonance lengths increase', 'A wider tube has a larger end correction', '$L_1$ is exactly $\\lambda/4$'], [0, 1, 2],
    r`The difference of two successive resonance lengths is $\lambda/2$. A rise of temperature raises $v$ and $\lambda=v/f$. $e\approx0.6r$ grows with the radius. $L_1=\lambda/4-e$, so it is less than $\lambda/4$.`),

  // ---------- Level 4 ----------
  nat(4, 'metre scale', r`A non-uniform metre scale balances on a knife edge at $49.0$ cm with no load. When a $100$ g body hangs at the $10.0$ cm mark, the scale balances at $40.0$ cm. Find the mass of the scale in g.`, 333.3, 1,
    r`The scale's weight acts at its balance point, 49.0 cm. About the new knife edge at 40.0 cm: $100\times(40-10)=M\times(49-40)$. So $3000=9M$ and $M=333.3$ g.`, { unit: 'g', calc: () => 100 * 30 / 9, trap: 'The centre of gravity is 49.0 cm, not 50 cm, because the scale is not uniform.' }),
  nat(4, 'pendulum', r`A $T^2$–$L$ graph gives a slope of $4.0\pm0.1\ \mathrm{s^2\,m^{-1}}$. Find the absolute error in $g=4\pi^2/\text{slope}$, in $\mathrm{m\,s^{-2}}$ (2 decimals).`, 0.25, 0.01,
    r`$g=4\pi^2/4.0=9.87$. The relative error in $g$ equals the relative error in the slope: $0.1/4.0=2.5\%$. So $\Delta g=0.025\times9.87=0.25\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', calc: () => 4 * Math.PI ** 2 / 4 * 0.1 / 4 }),
  nat(4, 'prism', r`For a prism of angle $60^\circ$, a ray with angle of incidence $40^\circ$ is deviated by $50^\circ$. Another angle of incidence gives the same deviation. Find it, in degrees.`, 70, 0.1,
    r`$\delta=i+e-A$, so $e=50+60-40=70^\circ$. By reversibility of light, a ray incident at $70^\circ$ emerges at $40^\circ$ with the same deviation. So the other angle is $70^\circ$.`, { unit: 'deg', calc: () => 50 + 60 - 40 }),
  nat(4, 'specific heat', r`A $0.20$ kg copper block (specific heat $390\ \mathrm{J\,kg^{-1}K^{-1}}$) at $100\ ^\circ$C is dropped into $0.30$ kg of an oil at $20\ ^\circ$C. The final temperature is $30\ ^\circ$C. Neglecting the calorimeter, find the specific heat of the oil in $\mathrm{J\,kg^{-1}K^{-1}}$.`, 1820, 5,
    r`Heat lost by copper $=0.20\times390\times(100-30)=5460$ J. Heat gained by oil $=0.30\times c\times(30-20)=3c$. So $c=5460/3=1820\ \mathrm{J\,kg^{-1}K^{-1}}$.`, { unit: 'J/kg K', calc: () => 0.2 * 390 * 70 / (0.3 * 10) }),
  nat(4, 'sound', r`In a resonance tube experiment the first two resonances are at $L_1=17.0$ cm and $L_2=54.0$ cm. Using $e=0.6r$, find the inner radius of the tube in cm.`, 2.5, 0.05,
    r`$e=(L_2-3L_1)/2=(54.0-51.0)/2=1.5$ cm. Then $r=e/0.6=2.5$ cm.`, { unit: 'cm', calc: () => (54 - 51) / 2 / 0.6 }),
  nat(4, 'zener', r`A Zener regulator uses a $6.0$ V Zener from an input that can fall to $10$ V. The load draws up to $20$ mA and the Zener needs at least $5$ mA to stay in breakdown. Find the largest series resistance that works, in ohm.`, 160, 1,
    r`The series resistor must carry the load current plus the minimum Zener current at the lowest input: $I=20+5=25$ mA. $R_{\max}=(10-6.0)/0.025=160\ \Omega$. A larger $R$ would let the Zener drop out of breakdown at low input.`, { unit: 'Ω', calc: () => 4 / 0.025 }),
  nat(4, 'errors', r`The power in a resistor is $P=V^2/R$. $V=10.0\ \mathrm V$ with $2\%$ error and $R=5.0\ \Omega$ with $2\%$ error. Find the maximum percentage error in $P$.`, 6, 0,
    r`$\dfrac{\Delta P}{P}=2\dfrac{\Delta V}{V}+\dfrac{\Delta R}{R}=2\times2+2=6\%$.`, { unit: '%', calc: () => 6 }),
  nat(4, 'lens', r`A convex lens forms a real image three times as large as the object on a screen. The object–screen distance is $100$ cm. Find the focal length in cm.`, 18.75, 0.05,
    r`$|v|=3|u|$ and $|u|+|v|=100$, so $|u|=25$ cm and $|v|=75$ cm. $\dfrac1f=\dfrac1{75}+\dfrac1{25}=\dfrac{4}{75}$, so $f=18.75$ cm.`, { unit: 'cm', calc: () => 1 / (1 / 75 + 1 / 25) }),
  nat(4, 'lens', r`A biconvex glass lens ($\mu=1.5$, $R_1=R_2=30$ cm, so $f=30$ cm) lies on a plane mirror with a thin plano-concave liquid lens ($\mu=1.33$, $R=30$ cm) between them. The two lenses in contact act as one lens. Find the focal length of the combination in cm.`, 44.8, 0.3,
    r`A plano-concave lens has a negative focal length of magnitude $R/(\mu_l-1)=30/0.33=90.9$ cm, so $f_l=-90.9$ cm. Combination: $\dfrac1f=\dfrac1{30}-\dfrac1{90.9}=0.02233$, so $f=44.8$ cm.`, { unit: 'cm', calc: () => 1 / (1 / 30 - 0.33 / 30) }),
  nat(4, 'microscope', r`In the travelling microscope method each of the three readings has an error of $\pm0.001$ cm. The readings are $a=3.120$, $b=3.480$, $c=4.320$ cm, with $\mu=(c-a)/(c-b)$. Find the maximum percentage error in $\mu$ (3 decimals).`, 0.405, 0.01,
    r`$c-a=1.200$ cm with error $0.002$ cm; $c-b=0.840$ cm with error $0.002$ cm. $\dfrac{\Delta\mu}{\mu}=\dfrac{0.002}{1.200}+\dfrac{0.002}{0.840}=0.167\%+0.238\%=0.405\%$.`, { unit: '%', calc: () => 0.002 / 1.2 * 100 + 0.002 / 0.84 * 100, trap: 'The error of a difference is the sum of the two absolute errors.' }),
  nat(4, 'ohms law', r`A $2.0\ \Omega$ resistor is measured by the V–I method with an ammeter of $0.5\ \Omega$ in series, and the voltmeter is connected across the resistor <b>and</b> the ammeter together. Find the percentage error in the measured $R$.`, 25, 0.5,
    r`The voltmeter reads the drop across both, so $R_{\text{measured}}=2.0+0.5=2.5\ \Omega$. Error $=0.5/2.0=25\%$. This is why, for a low resistance, the voltmeter is connected across the resistor alone.`, { unit: '%', calc: () => 0.5 / 2 * 100 }),
  nat(4, 'galvanometer', r`A galvanometer ($G=100\ \Omega$, figure of merit $10\ \mu\mathrm A$ per division) is made into a voltmeter by a series resistance of $2900\ \Omega$. Find the voltage per division in mV.`, 30, 0.2,
    r`The current per division is $10\ \mu\mathrm A$. The total resistance is $3000\ \Omega$. Voltage per division $=10\times10^{-6}\times3000=0.03$ V $=30$ mV.`, { unit: 'mV', calc: () => 10e-6 * 3000 * 1000 }),
  nat(4, 'capillary', r`Water rises to a vertical height of $4.5$ cm in a capillary tube. The tube is tilted so that it makes $60^\circ$ with the vertical. Find the length of the water column along the tube, in cm.`, 9, 0.05,
    r`The vertical height stays $h$. The length along the tube is $l=h/\cos60^\circ=4.5/0.5=9.0$ cm.`, { unit: 'cm', calc: () => 4.5 / Math.cos(Math.PI / 3), trap: 'The tube angle is measured from the vertical; use cos, not sin.' }),
  nat(4, 'viscosity', r`A steel ball of radius $1$ mm falls at a terminal speed of $0.020\ \mathrm{m\,s^{-1}}$ in a certain liquid. What is the terminal speed of a steel ball of radius $3$ mm in the same liquid, in $\mathrm{m\,s^{-1}}$? (Stokes law applies.)`, 0.18, 0.001,
    r`$v\propto r^2$. The radius is three times larger, so $v$ is $9$ times larger: $0.020\times9=0.18\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', calc: () => 0.02 * 9 }),
  nat(4, 'zener', r`For a Zener diode in breakdown the voltage changes from $6.10$ V to $6.14$ V when the current changes from $5$ mA to $25$ mA. Find its dynamic resistance in ohm.`, 2, 0.05,
    r`$r_z=\Delta V/\Delta I=0.04/0.020=2\ \Omega$. A small $r_z$ means a very steady voltage.`, { unit: 'Ω', calc: () => 0.04 / 0.02 }),
  nat(4, 'mixed', r`A pendulum is used inside a lift that accelerates upwards at $a$. The student computes $g_{\text{eff}}=4\pi^2L/T^2=11.8\ \mathrm{m\,s^{-2}}$. Taking the true $g=9.8$, find $a$ in $\mathrm{m\,s^{-2}}$.`, 2, 0.05,
    r`In the lift the effective gravity is $g+a$, so the experiment measures $g_{\text{eff}}=g+a$. Then $a=11.8-9.8=2.0\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', calc: () => 11.8 - 9.8 }),
  nat(4, 'mixed', r`A steel wire ($Y=2.0\times10^{11}\ \mathrm{N\,m^{-2}}$), length $2.0$ m and diameter $0.50$ mm, carries a load of $3.0$ kg. Find the elastic energy stored in mJ ($g=9.8$, $\pi=3.14159$).`, 22, 0.3,
    r`$F=29.4$ N. $A=\pi d^2/4=1.9635\times10^{-7}\ \mathrm{m^2}$. $\Delta L=\dfrac{FL}{AY}=\dfrac{29.4\times2.0}{1.9635\times10^{-7}\times2.0\times10^{11}}=1.497\times10^{-3}$ m. Energy $=\tfrac12F\Delta L=\tfrac12\times29.4\times1.497\times10^{-3}=0.0220$ J $=22$ mJ.`, { unit: 'mJ', calc: () => 0.5 * 29.4 * (29.4 * 2 / (Math.PI * (0.5e-3) ** 2 / 4 * 2e11)) * 1000 }),
  nat(4, 'mixed', r`Mercury (surface tension $0.465\ \mathrm{N\,m^{-1}}$, density $13600\ \mathrm{kg\,m^{-3}}$, contact angle $135^\circ$) is placed with a clean glass capillary of radius $1.0$ mm in a trough. Find the depression of the mercury in the tube in mm ($g=9.8$, $\cos135^\circ=-0.7071$).`, 4.93, 0.05,
    r`$h=\dfrac{2T\cos\theta}{r\rho g}=\dfrac{2\times0.465\times(-0.7071)}{10^{-3}\times13600\times9.8}=-4.93\times10^{-3}$ m. The negative sign means a depression of $4.93$ mm.`, { unit: 'mm', calc: () => 2 * 0.465 * 0.7071 / (1e-3 * 13600 * 9.8) * 1000, trap: 'Obtuse contact angle: the liquid goes down, not up.' }),
  mcq(4, 'pendulum', r`A student measures the length of a pendulum only up to the top of the bob (string length $l$), while the bob has a large radius $r$. The value of $g$ calculated from one reading ($g=4\pi^2l/T^2$) is`, 'smaller than the true g', ['larger than the true g', 'equal to the true g', 'larger only if T is wrong'],
    r`The true length is $l+r>l$. Using the smaller $l$ underestimates $g$. If the student plots $T^2$ against $l$, the <i>slope</i> still gives the right $g$, and the line has an intercept.`, { trap: 'Single-reading g is wrong but the graph slope is right.' }),
  mcq(4, 'young', r`In Searle's method the temperature of the room rises during the experiment. The effect on the reading of the extension is`, 'almost none, as both wires expand alike', ['large, since the test wire only expands', 'large, since the reference wire only expands', 'the Young modulus changes sign'],
    r`The reference wire has the same length and material as the test wire. Both expand by the same amount, so the level (resting on both) is not disturbed. This is the whole purpose of the arrangement.`),
  mcq(4, 'metre bridge', r`A metre bridge is balanced at $l=50$ cm with $R=10\ \Omega$. A student sets $R=100\ \Omega$ for the same $X$. The null point shifts and the percentage error in $X$ for the same $\Delta l$ becomes`, 'larger, because the null point is near one end', ['smaller, because R is larger', 'the same', 'zero'],
    r`With $X=10\ \Omega$ and $R=100\ \Omega$, $R/X=l/(100-l)=10$, so $l=90.9$ cm. The error $100\Delta l/[l(100-l)]$ is then about $1.2\%$ per $\Delta l=0.1$ cm, compared with $0.4\%$ at the middle. So it is larger.`),
  mcq(4, 'diode', r`A diode is connected in series with a lamp and an ac source. The current in the circuit is`, 'in one direction only (half-wave)', ['in both directions equally', 'zero always', 'dc with no ripple'],
    r`A diode conducts only in forward bias. The current flows during half of the cycle only, giving a half-wave rectified current with ripple.`),
  mcq(4, 'viscosity', r`In a falling ball experiment with glycerine, the temperature of the glycerine increases during the experiment. The measured terminal velocity then`, 'increases, since viscosity falls on heating', ['decreases, since viscosity falls on heating', 'stays the same', 'increases, since density rises'],
    r`$v\propto1/\eta$. The viscosity of liquids falls as they heat, so $v$ increases. (Gases behave the other way.)`),

  // ---------- Level 5 ----------
  nat(5, 'prism', r`In an $i$–$\delta$ graph for a prism of angle $60^\circ$ the minimum deviation occurs at $i=50^\circ$. Find the refractive index (3 sig. figures; $\sin50^\circ=0.766$).`, 1.53, 0.01,
    r`At minimum deviation $i=e=50^\circ$, so $\delta_m=2i-A=40^\circ$. $\mu=\sin50^\circ/\sin30^\circ=0.766/0.5=1.53$ (equal to $\sin\frac{A+\delta_m}2/\sin\frac A2$ with $\frac{A+\delta_m}{2}=50^\circ$).`, { calc: () => 0.766 / 0.5 }),
  nat(5, 'prism', r`For a prism with $A=60^\circ$, $\delta_m=40.0^\circ$, the minimum deviation is measured to $\pm0.5^\circ$. Estimate the absolute error in $\mu$ (use $\mu=\dfrac{\sin\frac{A+\delta_m}2}{\sin\frac A2}$; the error in $A$ is negligible). Give your answer to 4 decimals.`, 0.0056, 0.0004,
    r`$\mathrm d\mu/\mathrm d\delta_m=\dfrac{\tfrac12\cos\frac{A+\delta_m}{2}}{\sin\frac A2}=\dfrac{0.5\times0.6428}{0.5}=0.6428\ \mathrm{rad^{-1}}$. $\Delta\delta_m=0.5^\circ=0.008727$ rad. So $\Delta\mu=0.6428\times0.008727=0.0056$.`, { calc: () => 0.6428 * 0.5 * Math.PI / 180, trap: 'The error must be put in radians before using the derivative.' }),
  nat(5, 'errors', r`A pendulum of length about $100$ cm has $L$ measured to $\pm0.1$ cm. Its period is about $2$ s and the stopwatch error is $0.2$ s. What is the least number $n$ of oscillations to time so that the maximum error in $g$ is at most $1\%$?`, 23, 0,
    r`$\Delta g/g=\Delta L/L+2\,\Delta t/t=0.1\%+2\times0.2/(2n)=0.1\%+0.2/n$ (in fraction: $0.001+0.2/n$). Require $\le0.01$: $0.2/n\le0.009$, so $n\ge22.2$. The least whole number is $23$.`, { calc: () => Math.ceil(0.2 / 0.009), trap: 'Round up: 22 oscillations is not enough.' }),
  nat(5, 'zener', r`A Zener regulator has a $10$ V input, $100\ \Omega$ series resistor and a $6.2$ V Zener that needs at least $2$ mA. Find the smallest load resistance (in ohm) for which the output stays regulated.`, 172, 1,
    r`Total current $=(10-6.2)/100=38$ mA. The largest load current leaves $2$ mA in the Zener: $I_L=36$ mA. $R_{L,\min}=6.2/0.036=172\ \Omega$.`, { unit: 'Ω', calc: () => 6.2 / 0.036 }),
  nat(5, 'sound', r`The fork has $480$ Hz and the speed of sound is $340\ \mathrm{m\,s^{-1}}$. The tube radius is $2.0$ cm with $e=0.6r$. At what air column length (in cm) will the <b>second</b> resonance occur?`, 51.9, 0.3,
    r`$\lambda=340/480=0.7083$ m $=70.83$ cm. The second resonance is at $L_2+e=3\lambda/4=53.125$ cm, with $e=1.2$ cm. So $L_2=53.125-1.2=51.9$ cm.`, { unit: 'cm', calc: () => (3 * 340 / 480 / 4 - 0.012) * 100, trap: 'Subtract the end correction once; the 3λ/4 is for L+e.' }),
  mcq(5, 'metre bridge', r`A metre bridge is used to find an unknown $X\approx24\ \Omega$ with a resistance box. For the best accuracy of the null point, the box resistance $R$ should be set near`, r`$24\ \Omega$`, [r`$2.4\ \Omega$`, r`$240\ \Omega$`, r`$12\ \Omega$`],
    r`The error is smallest for $l=50$ cm, where $R=X$. A very different $R$ puts the null near an end, where $l(100-l)$ is small and the percentage error is large.`),
  mcq(5, 'young', r`A wire of diameter $d$ is used in Searle's experiment. If $d$ is measured with an error $\Delta d$ and $\Delta L$ is measured with the same relative error, which error is more serious for $Y$?`, 'the diameter error, since $Y\\propto1/d^2$', ['the extension error, since it is smaller', 'both are equal', 'neither affects Y'],
    r`$\Delta Y/Y=2\Delta d/d+\Delta(\Delta L)/\Delta L+\ldots$. With the same relative error, $d$ contributes twice as much.`),
  mcq(5, 'capillary', r`Water rises in a capillary tube. The meniscus correction replaces $h$ by $h+r/3$. This is because`, 'the liquid in the meniscus above the lowest point has a volume of about a hemisphere less a cylinder, equal to a column of height r/3', ['the tube is slightly curved', 'water has a contact angle of exactly 60°', 'surface tension acts at the tube base'],
    r`The volume of the meniscus above its lowest point is $\pi r^3-\tfrac23\pi r^3=\tfrac13\pi r^3$, equal to a cylinder of height $r/3$ and area $\pi r^2$. It must be added to the measured column.`),
  mcq(5, 'diode', r`The reverse current of a silicon diode is about $1\ \mu$A at $25\ ^\circ$C. It roughly doubles for every $8\ ^\circ$C rise. At $57\ ^\circ$C the reverse current is about`, r`$16\ \mu$A`, [r`$4\ \mu$A`, r`$8\ \mu$A`, r`$32\ \mu$A`],
    r`The rise is $32\ ^\circ$C, which is four doublings: $2^4=16$. So $1\times16=16\ \mu$A.`),
  msq(5, 'vernier', r`Which statements about screw gauge errors are correct?`,
    ['Backlash error arises if the screw is turned back and forth before taking a reading', 'The ratchet reduces error due to uneven pressure on the object', 'Zero error changes with the diameter of the object measured', 'For a fixed number of circular divisions, a larger pitch gives a larger least count'], [0, 1, 3],
    r`Backlash is looseness in the thread; turn the screw one way only. The ratchet slips at a set pressure. Zero error belongs to the instrument, not the object. LC = pitch/N, so a larger pitch gives a larger LC.`),
  mcq(5, 'mixed', r`A metre bridge uses a wire of resistance $10\ \Omega$ for $100$ cm. A student connects $R=10\ \Omega$ and $X=20\ \Omega$. The null point is at`, '33.3 cm', ['66.7 cm', '50 cm', '25 cm'],
    r`$R/X=l/(100-l)=10/20=0.5$. So $l=0.5(100-l)$, giving $1.5l=50$ and $l=33.3$ cm. The wire's own resistance does not change this because it is a uniform wire with the cell across it.`, { trap: 'The smaller resistance sits in the shorter segment.' }),


  // ---------- More Level 5 ----------
  nat(5, 'young', r`In Searle's experiment the extension is read on a vernier with least count $0.01$ mm. The wire has $L=2.0$ m, $d=0.50$ mm and $Y=2.0\times10^{11}\ \mathrm{N\,m^{-2}}$ ($g=9.8$, $\pi=3.14$). What is the least load in kg that keeps the error in the extension at or below $1\%$?`, 2.0, 0.05,
    r`Extension per kg: $\dfrac{4gL}{\pi d^2Y}=\dfrac{4\times9.8\times2.0}{3.14\times(0.5\times10^{-3})^2\times2\times10^{11}}=0.499\times10^{-3}$ m per kg $=0.499$ mm/kg. For $\Delta(\Delta L)/\Delta L\le1\%$ with $\Delta(\Delta L)=0.01$ mm we need $\Delta L\ge1.0$ mm. So $M\ge1.0/0.499=2.0$ kg.`, { unit: 'kg', calc: () => 1 / (4 * 9.8 * 2 / (3.14 * (0.5e-3) ** 2 * 2e11) * 1000) }),
  nat(5, 'sound', r`In a resonance tube experiment the first resonance with a fork occurs at $L_1=18.0$ cm and the end correction is $e=2.0$ cm. The fork is replaced by one of <b>double</b> the frequency. Find the new first-resonance length in cm.`, 8, 0.1,
    r`$\lambda/4=L_1+e=20.0$ cm. Doubling the frequency halves $\lambda$ (same $v$), so the new $\lambda'/4=10.0$ cm. The new length is $10.0-e=8.0$ cm. (The end correction stays the same.)`, { unit: 'cm', calc: () => (18 + 2) / 2 - 2, trap: 'Halve λ/4 = L + e, not L itself.' }),
  nat(5, 'mirror', r`A convex lens makes a real image at $30$ cm from itself. A convex mirror is placed $20$ cm from the lens, between the lens and the image position, and moved until the light retraces its path. Find the focal length of the mirror in cm.`, 5, 0.1,
    r`The light retraces its path when it strikes the mirror along its radii, so the point where the rays would have met, $30$ cm from the lens, is the centre of curvature. It is $30-20=10$ cm behind the mirror, so $R=10$ cm and $f=R/2=5$ cm.`, { unit: 'cm', calc: () => (30 - 20) / 2 }),
  nat(5, 'errors', r`In the $u$–$v$ method $f=\dfrac{uv}{u+v}$. For $u=v=40.0$ cm, each measured to $\pm0.1$ cm, find the maximum percentage error in $f$ (2 decimals).`, 0.75, 0.01,
    r`$\dfrac{\Delta f}{f}=\dfrac{\Delta u}{u}+\dfrac{\Delta v}{v}+\dfrac{\Delta(u+v)}{u+v}=0.25\%+0.25\%+\dfrac{0.2}{80}\times100\%=0.25+0.25+0.25=0.75\%$. The sum in the denominator has its own error $\Delta u+\Delta v$.`, { unit: '%', calc: () => 0.25 + 0.25 + 0.2 / 80 * 100 }),
  msq(5, 'lens', r`In the parallax method with a convex lens and a pin, which statements are correct?`,
    ['No parallax means the tip of the image and the tip of the pin are at the same position', 'The image pin must be placed so that the eye moves sideways while watching both tips', 'For $u=-2f$, the real image forms at $v=+2f$', 'If the object is placed at $u=-f/2$ the image is real'], [0, 1, 2],
    r`No parallax is the test for coincidence of the image and the pin, and it needs the eye to move sideways. At $u=-2f$ the image is at $+2f$. An object inside the focus gives a virtual image, so the last statement is false.`),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'vernier', group: 'm1',
    q: 'Match each instrument in List I with its least count in List II.',
    options: ['A-q, B-r, C-s, D-p', 'A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-q, C-p, D-s'], answer: 0,
    sol: r`A: $1/20=0.05$ mm (q). B: $1/50=0.02$ mm (r). C: $0.5/100=0.005$ mm (s). D: $1/10=0.1$ mm (p). So A-q, B-r, C-s, D-p.` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'mixed', group: 'm2',
    q: 'Match each graph in List I with what its slope or intercept gives in List II.',
    options: ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-r, D-s', 'A-p, B-r, C-q, D-s', 'A-p, B-q, C-s, D-r'], answer: 1,
    sol: r`A: $T^2=(4\pi^2/g)L$, so the slope is $4\pi^2/g$ (p). B: $V=IR$, so the slope is $R$ (q). C: $M=\dfrac{\pi d^2Y}{4gL}\Delta L$, so the slope is $\pi d^2Y/(4gL)$ (r). D: $T^2=(4\pi^2/g)(l+r)$ cuts the $l$-axis at $-r$ (s). So A-p, B-q, C-r, D-s.` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'mixed', group: 'm3',
    q: 'Match each experiment condition in List I with what it means in List II.',
    options: ['A-p, B-r, C-q, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-s'], answer: 2,
    sol: r`A: a metre bridge null point means no galvanometer current (p). B: minimum deviation of a prism means $i=e$ (q). C: Zener breakdown means a steady voltage over a wide current range (r). D: the first resonance in a closed tube means $L+e=\lambda/4$ (s). So A-p, B-q, C-r, D-s.` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'errors', group: 'm4',
    q: 'Each measured quantity has a $1\\%$ error. Match each experimental formula in List I with the maximum percentage error in the result in List II.',
    options: ['A-p, B-s, C-q, D-r', 'A-q, B-s, C-p, D-r', 'A-q, B-r, C-p, D-s', 'A-s, B-q, C-p, D-r'], answer: 1,
    sol: r`A: $g=4\pi^2L/T^2$: $1+2\times1=3\%$ (q). B: $Y=4MgL/(\pi d^2\Delta L)$ with $M,L,d,\Delta L$: $1+1+2+1=5\%$ (s). C: $T=rh\rho g/2$ with $r,h$: $2\%$ (p). D: $\rho=X\pi d^2/(4L)$ with $X,d,L$: $1+2+1=4\%$ (r). So A-q, B-s, C-p, D-r.` },

  // ---------- Passages ----------
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'pendulum', group: 'p1',
    q: 'Using the first and last points, find the slope of the $T^2$–$L$ graph in $\\mathrm{s^2\\,m^{-1}}$.', answer: 4.025, tol: 0.02, unit: 's²/m',
    sol: r`Slope $=(4.84-1.62)/(1.20-0.40)=3.22/0.80=4.025\ \mathrm{s^2\,m^{-1}}$ (convert cm to m).`, calc: () => (4.84 - 1.62) / (1.2 - 0.4) },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'pendulum', group: 'p1',
    q: 'Find $g$ from the graph in $\\mathrm{m\\,s^{-2}}$ (2 decimals).', answer: 9.81, tol: 0.04, unit: 'm/s²',
    sol: r`$g=4\pi^2/\text{slope}=39.478/4.025=9.81\ \mathrm{m\,s^{-2}}$.`, calc: () => 4 * Math.PI ** 2 / 4.025 },
  { id: nid(), type: 'mcq', level: 4, format: 'passage', exams: EX[4], sub: 'pendulum', group: 'p1', answer: 2,
    q: 'Suppose the student had used only the thread length (without the bob radius) and plotted $T^2$ against that length. The line would',
    options: ['pass through the origin with the same slope', 'pass through the origin with a smaller slope', 'have the same slope but cut the $T^2$-axis above zero', 'have a different slope and cut the $L$-axis above zero'],
    sol: r`$T^2=\dfrac{4\pi^2}{g}(l+r)$. The slope is unchanged, and at $l=0$ the value is $4\pi^2r/g>0$. So the line has the same slope and a positive intercept on the $T^2$-axis. It cuts the $l$-axis at $-r$, a negative value.`, trap: 'The intercept is on the T² axis (positive) and negative on the length axis.' },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'metre bridge', group: 'p2',
    q: 'Find the resistance $X$ of the wire in ohm.', answer: 13.81, tol: 0.03, unit: 'Ω',
    sol: r`$R/X=l/(100-l)=42/58$. $X=10.0\times58/42=13.81\ \Omega$.`, calc: () => 10 * 58 / 42 },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'resistivity', group: 'p2',
    q: 'Find the resistivity of the wire in $10^{-6}\\ \\Omega\\,\\mathrm m$ (use $\\pi=3.1416$).', answer: 3.62, tol: 0.03, unit: '10⁻⁶ Ω m',
    sol: r`$\rho=\dfrac{X\pi d^2}{4L}=\dfrac{13.81\times3.1416\times(0.5\times10^{-3})^2}{4\times0.750}=\dfrac{1.0847\times10^{-5}}{3.0}=3.62\times10^{-6}\ \Omega\,\mathrm m$.`, calc: () => 13.81 * Math.PI * (0.5e-3) ** 2 / 3 * 1e6 },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'errors', group: 'p2',
    q: 'The null point is read to $\\pm0.1$ cm, the length of the wire to $\\pm0.1$ cm and the diameter to $\\pm0.01$ mm. Find the maximum percentage error in $\\rho$ (2 decimals).', answer: 4.54, tol: 0.05, unit: '%',
    sol: r`$\dfrac{\Delta\rho}{\rho}=\dfrac{\Delta X}{X}+2\dfrac{\Delta d}{d}+\dfrac{\Delta L}{L}$. Here $\dfrac{\Delta X}{X}=\dfrac{100\times0.1}{42\times58}=0.41\%$, $2\dfrac{\Delta d}{d}=2\times\dfrac{0.01}{0.50}=4\%$ and $\dfrac{\Delta L}{L}=\dfrac{0.1}{75.0}=0.13\%$. The total is $4.54\%$, dominated by the diameter.`, calc: () => 10 / (42 * 58) * 100 + 4 + 0.1 / 75 * 100 },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'zener', group: 'p3',
    q: 'Find the current through the Zener diode in mA when the load is removed.', answer: 19.67, tol: 0.05, unit: 'mA',
    sol: r`With no load, all the current of the series resistor flows through the Zener: $(15-9.1)/300=19.67$ mA.`, calc: () => 5.9 / 300 * 1000 },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'zener', group: 'p3',
    q: 'Find the smallest load resistance (in ohm) that keeps the output regulated.', answer: 546, tol: 1, unit: 'Ω',
    sol: r`The most load current is $19.67-3.0=16.67$ mA, leaving $3$ mA in the Zener. $R_{L,\min}=9.1/0.01667=546\ \Omega$.`, calc: () => 9.1 / (5.9 / 300 - 0.003) },
  { id: nid(), type: 'mcq', level: 3, format: 'passage', exams: EX[3], sub: 'zener', group: 'p3', answer: 1,
    q: 'The power dissipated in the Zener with no load is about',
    options: ['0.060 W', '0.18 W', '1.8 W', '0.54 W'],
    sol: r`$P=V_zI_z=9.1\times0.01967=0.179\approx0.18$ W. A Zener must be rated for at least this power.` },
];

const groups = {
  m1: { title: 'Least counts',
    list1: ['A. Vernier: 1 MSD = 1 mm, 20 VSD = 19 MSD', 'B. Screw gauge: pitch 1 mm, 50 divisions', 'C. Screw gauge: pitch 0.5 mm, 100 divisions', 'D. Vernier: 1 MSD = 1 mm, 10 VSD = 9 MSD'],
    list2: ['p. 0.1 mm', 'q. 0.05 mm', 'r. 0.02 mm', 's. 0.005 mm'] },
  m2: { title: 'Graphs',
    list1: ['A. Slope of $T^2$ against $L$ (simple pendulum)', 'B. Slope of $V$ against $I$ (resistor)', 'C. Slope of load $M$ against extension $\\Delta L$ (Searle)', 'D. Intercept of the $T^2$–$l$ line on the $l$-axis ($l$ = thread length)'],
    list2: [r`p. $4\pi^2/g$`, 'q. Resistance', r`r. $\pi d^2Y/(4gL)$`, 's. Minus the radius of the bob'] },
  m3: { title: 'Conditions',
    list1: ['A. Null point of a metre bridge', 'B. Minimum deviation of a prism', 'C. Breakdown of a Zener diode', 'D. First resonance in a closed tube'],
    list2: ['p. No current through the galvanometer', 'q. Angle of incidence equals angle of emergence', 'r. Steady voltage over a wide current range', r`s. $L+e=\lambda/4$`] },
  m4: { title: 'Error propagation',
    list1: [r`A. $g=4\pi^2L/T^2$ ($L$, $T$)`, r`B. $Y=4MgL/(\pi d^2\Delta L)$ ($M$, $L$, $d$, $\Delta L$)`, r`C. $T=rh\rho g/2$ ($r$, $h$)`, r`D. $\rho=X\pi d^2/(4L)$ ($X$, $d$, $L$)`],
    list2: ['p. 2 %', 'q. 3 %', 'r. 4 %', 's. 5 %'] },
  p1: { title: 'Pendulum graph',
    passage: r`<p>A student measures the time period $T$ of a simple pendulum for five lengths $L$ (from the point of suspension to the centre of the bob) and plots $T^2$ against $L$. The data are:</p><table><tr><td>$L$ (cm)</td><td>40</td><td>60</td><td>80</td><td>100</td><td>120</td></tr><tr><td>$T^2$ (s²)</td><td>1.62</td><td>2.41</td><td>3.23</td><td>4.02</td><td>4.84</td></tr></table>` },
  p2: { title: 'Metre bridge',
    passage: r`<p>A resistance box $R=10.0\ \Omega$ is in the left gap of a metre bridge. A wire of length $75.0$ cm and diameter $0.50$ mm is in the right gap. The null point is at $42.0$ cm from the left end.</p>` },
  p3: { title: 'Zener regulator',
    passage: r`<p>A $15$ V supply feeds a $9.1$ V Zener diode through a $300\ \Omega$ series resistor. A load is connected across the Zener. The Zener needs at least $3.0$ mA to stay in breakdown.</p>` },
};

// ---------- Number templates ----------
const rd = (x, d) => +x.toFixed(d);
const PI = Math.PI;
const idx = (options, text) => options.findIndex((o) => o === text);
const gens = [
  // g01: vernier readings
  { id: 'xp-g01', type: 'nat', level: 2, exams: EX[2], sub: 'vernier',
    make(rng) {
      const N = choose(rng, [10, 20]); const lc = N === 10 ? 0.01 : 0.005; // cm
      const msr = pick(rng, 1.0, 8.0, 0.1); const n = int(rng, 1, N - 1); const kk = int(rng, 1, 4);
      const v = int(rng, 0, 2);
      const obs = rd(msr + n * lc, 4);
      if (v === 0) {
        const answer = rd(obs - kk * lc, 4);
        return { v, N, lc, msr, n, kk, answer, tol: lc / 2, unit: 'cm',
          q: `A vernier calliper has ${N} vernier divisions and least count ${lc} cm. With the jaws closed, the zero of the vernier is ${kk} vernier divisions to the right of the main zero (the ${kk}th division coincides), a positive zero error. For a rod the main scale reads ${msr} cm and the ${n}th vernier division coincides. Find the correct length in cm.`,
          sol: `Observed = ${msr} + ${n}×${lc} = ${obs} cm. Zero error = +${kk}×${lc} = +${rd(kk * lc, 4)} cm. Correct = ${obs} − ${rd(kk * lc, 4)} = ${answer} cm.` };
      }
      if (v === 1) {
        const closed = N - kk; const answer = rd(obs + kk * lc, 4);
        return { v, N, lc, msr, n, kk, answer, tol: lc / 2, unit: 'cm',
          q: `A vernier calliper has ${N} vernier divisions and least count ${lc} cm. With the jaws closed the ${closed}th vernier division coincides with a main scale division. For a rod the main scale reads ${msr} cm and the ${n}th vernier division coincides. Find the correct length in cm.`,
          sol: `Closed jaws: coincidence at ${closed} means the vernier zero is ${N} − ${closed} = ${kk} divisions short of the main zero, so zero error = −${kk}×${lc} = −${rd(kk * lc, 4)} cm. Observed = ${msr} + ${n}×${lc} = ${obs} cm. Correct = ${obs} + ${rd(kk * lc, 4)} = ${answer} cm.` };
      }
      const closed = rng() < 0.5 ? kk : N - kk; const answer = closed <= N / 2 ? rd(closed * lc, 4) : rd(-(N - closed) * lc, 4);
      return { v, N, lc, msr, n, kk, closed, answer, tol: lc / 2, unit: 'cm',
        q: `A vernier calliper has ${N} vernier divisions and least count ${lc} cm. With the jaws closed the ${closed}th vernier division coincides with a main scale division. Find the zero error in cm, with its sign.`,
        sol: closed <= N / 2 ? `The vernier zero is ahead of the main zero by ${closed} divisions: zero error = +${closed}×${lc} = ${answer} cm.` : `Coincidence at ${closed} (more than half of ${N}) means the vernier zero lies behind the main zero by ${N} − ${closed} = ${N - closed} divisions: zero error = −${N - closed}×${lc} = ${answer} cm.` };
    },
    verify: (p) => { if (p.v === 2) return p.closed * p.lc > p.N * p.lc / 2 ? -(p.N - p.closed) * p.lc : p.closed * p.lc; const z = p.v === 0 ? p.kk * p.lc : -p.kk * p.lc; return p.msr + p.n * p.lc - z; } },

  // g02: screw gauge
  { id: 'xp-g02', type: 'nat', level: 2, exams: EX[2], sub: 'screw gauge',
    make(rng) {
      const pitch = choose(rng, [0.5, 1]); const N = choose(rng, [50, 100]); const lc = pitch / N;
      const msr = pitch * int(rng, 2, 8); const cs = int(rng, 8, N - 8); const kk = int(rng, 1, 6); const v = int(rng, 0, 2);
      const obs = rd(msr + cs * lc, 4);
      if (v === 0) { const answer = rd(obs - kk * lc, 4);
        return { v, pitch, N, lc, msr, cs, kk, answer, tol: lc / 2, unit: 'mm',
          q: `A screw gauge has pitch ${pitch} mm and ${N} circular divisions. With the jaws closed, the circular scale reads +${kk} (the zero is ${kk} divisions below the reference line). A wire gives a main scale reading of ${msr} mm and a circular reading of ${cs}. Find the diameter in mm.`,
          sol: `LC = ${pitch}/${N} = ${lc} mm. Observed = ${msr} + ${cs}×${lc} = ${obs} mm. Zero error = +${kk}×${lc} = +${rd(kk * lc, 4)} mm. Diameter = ${obs} − ${rd(kk * lc, 4)} = ${answer} mm.` }; }
      if (v === 1) { const closed = N - kk; const answer = rd(obs + kk * lc, 4);
        return { v, pitch, N, lc, msr, cs, kk, answer, tol: lc / 2, unit: 'mm',
          q: `A screw gauge has pitch ${pitch} mm and ${N} circular divisions. With the jaws closed, the circular scale reads ${closed}. A wire gives a main scale reading of ${msr} mm and a circular reading of ${cs}. Find the diameter in mm.`,
          sol: `LC = ${pitch}/${N} = ${lc} mm. A closed reading of ${closed} = ${N} − ${kk} means the zero is ${kk} divisions short of the line: zero error = −${kk}×${lc} = −${rd(kk * lc, 4)} mm. Observed = ${msr} + ${cs}×${lc} = ${obs} mm. Diameter = ${obs} + ${rd(kk * lc, 4)} = ${answer} mm.` }; }
      const answer = rd(lc, 4);
      return { v, pitch, N, lc, msr, cs, kk, answer, tol: lc / 20, unit: 'mm',
        q: `A screw gauge moves ${pitch} mm in one full turn and its circular scale has ${N} divisions. Find its least count in mm.`,
        sol: `Least count = pitch / number of divisions = ${pitch}/${N} = ${answer} mm.` };
    },
    verify: (p) => { if (p.v === 2) return p.pitch / p.N; const z = p.v === 0 ? p.kk * p.lc : -p.kk * p.lc; return p.msr + p.cs * p.lc - z; } },

  // g03: pendulum
  { id: 'xp-g03', type: 'nat', level: 3, exams: EX[3], sub: 'pendulum',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const s = pick(rng, 3.8, 4.2, 0.05); const answer = rd(4 * PI * PI / s, 2);
        const L1 = pick(rng, 0.2, 0.4, 0.1); const L2 = pick(rng, 0.9, 1.2, 0.1);
        return { v, s, L1, L2, answer, tol: 0.03, unit: 'm/s²',
          q: `A graph of $T^2$ (s²) against $L$ (m) for a simple pendulum is a straight line. Its slope is ${s} s² per m. Find $g$ in m/s² (2 decimals).`,
          sol: `$T^2=\\dfrac{4\\pi^2}{g}L$, so slope $=4\\pi^2/g$. $g=4\\pi^2/${s}=39.478/${s}=${answer}$ m/s².` }; }
      if (v === 1) { const l = pick(rng, 60, 100, 5); const dia = pick(rng, 1.6, 3.0, 0.2); const n = choose(rng, [20, 30]);
        const Ltrue = (l + dia / 2) / 100; const t = rd(n * 2 * PI * Math.sqrt(Ltrue / 9.8), 1);
        const L = (l + dia / 2) / 100; const answer = rd(4 * PI * PI * L / (t / n) ** 2, 2);
        return { v, l, dia, n, t, answer, tol: 0.04, unit: 'm/s²',
          q: `The thread of a pendulum is ${l} cm long and the bob has diameter ${dia} cm. ${n} oscillations take ${t} s. Find $g$ in m/s² (2 decimals; $\\pi^2=9.8696$).`,
          sol: `$L=${l}+${dia}/2=${rd(l + dia / 2, 2)}$ cm $=${rd(L, 4)}$ m. $T=${t}/${n}=${rd(t / n, 4)}$ s. $g=4\\pi^2L/T^2=39.478\\times${rd(L, 4)}/${rd((t / n) ** 2, 4)}=${answer}$ m/s².` }; }
      const T0 = choose(rng, [1.0, 1.5, 2.0, 2.5, 3.0]); const answer = rd(9.8 * T0 * T0 / (4 * PI * PI) * 100, 1);
      return { v, T0, answer, tol: 0.4, unit: 'cm',
        q: `Find the length of a simple pendulum, in cm, whose period is ${T0} s where $g=9.8$ m/s² (1 decimal).`,
        sol: `$L=\\dfrac{gT^2}{4\\pi^2}=\\dfrac{9.8\\times${T0 * T0}}{39.478}=${rd(answer / 100, 4)}$ m $=${answer}$ cm.` };
    },
    verify: (p) => { if (p.v === 0) return 4 * PI * PI / p.s; if (p.v === 1) return 4 * PI * PI * (p.l + p.dia / 2) / 100 * (p.n / p.t) ** 2; return (p.T0 / (2 * PI)) ** 2 * 9.8 * 100; } },

  // g04: error propagation
  { id: 'xp-g04', type: 'nat', level: 3, exams: EX[3], sub: 'errors',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const L = pick(rng, 80, 120, 10); const t = pick(rng, 30, 50, 2); const answer = rd(0.1 / L * 100 + 2 * 0.1 / t * 100, 3);
        return { v, L, t, answer, tol: 0.01, unit: '%',
          q: `A pendulum of length $L=${L}.0\\pm0.1$ cm is timed for 20 oscillations: $t=${t}.0\\pm0.1$ s. Find the maximum percentage error in $g=4\\pi^2L/T^2$ (3 decimals).`,
          sol: `$\\Delta T/T=\\Delta t/t=0.1/${t}=${rd(0.1 / t * 100, 3)}\\%$. $\\Delta g/g=\\Delta L/L+2\\,\\Delta T/T=${rd(0.1 / L * 100, 3)}\\%+2\\times${rd(0.1 / t * 100, 3)}\\%=${answer}\\%$.` }; }
      if (v === 1) { const m = pick(rng, 40, 80, 5); const d = pick(rng, 1.0, 2.0, 0.1); const h = pick(rng, 3.0, 6.0, 0.5);
        const answer = rd(0.01 / m * 100 + 2 * 0.01 / d * 100 + 0.01 / h * 100, 3);
        return { v, m, d, h, answer, tol: 0.01, unit: '%',
          q: `The density of a solid cylinder is $\\rho=\\dfrac{4m}{\\pi d^2h}$. The measurements are $m=${m}.00\\pm0.01$ g, $d=${d}\\pm0.01$ cm and $h=${h}\\pm0.01$ cm. Find the maximum percentage error in $\\rho$ (3 decimals).`,
          sol: `$\\dfrac{\\Delta\\rho}{\\rho}=\\dfrac{\\Delta m}{m}+2\\dfrac{\\Delta d}{d}+\\dfrac{\\Delta h}{h}=${rd(0.01 / m * 100, 3)}\\%+2\\times${rd(0.01 / d * 100, 3)}\\%+${rd(0.01 / h * 100, 3)}\\%=${answer}\\%$.` }; }
      const X = pick(rng, 5, 15, 1); const d = pick(rng, 0.30, 0.60, 0.05); const L = pick(rng, 50, 90, 5);
      const answer = rd(0.1 / X * 100 + 2 * 0.01 / d * 100 + 0.1 / L * 100, 3);
      return { v, X, d, L, answer, tol: 0.01, unit: '%',
        q: `A wire's resistivity is $\\rho=\\dfrac{X\\pi d^2}{4L}$ with $X=${X}.0\\pm0.1\\ \\Omega$, $d=${d}\\pm0.01$ mm and $L=${L}.0\\pm0.1$ cm. Find the maximum percentage error in $\\rho$ (3 decimals).`,
        sol: `$\\dfrac{\\Delta\\rho}{\\rho}=\\dfrac{\\Delta X}{X}+2\\dfrac{\\Delta d}{d}+\\dfrac{\\Delta L}{L}=${rd(0.1 / X * 100, 3)}\\%+${rd(2 * 0.01 / d * 100, 3)}\\%+${rd(0.1 / L * 100, 3)}\\%=${answer}\\%$. The diameter dominates.` };
    },
    verify: (p) => { if (p.v === 0) return (0.1 / p.L + 2 * 0.1 / p.t) * 100; if (p.v === 1) return (0.01 / p.m + 2 * 0.01 / p.d + 0.01 / p.h) * 100; return (0.1 / p.X + 2 * 0.01 / p.d + 0.1 / p.L) * 100; } },

  // g05: metre bridge
  { id: 'xp-g05', type: 'nat', level: 3, exams: EX[3], sub: 'metre bridge',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const R = choose(rng, [2, 5, 10, 15, 20]); const l = pick(rng, 30, 70, 2.5); const answer = rd(R * (100 - l) / l, 3);
        return { v, R, l, answer, tol: 0.01 * answer, unit: 'Ω',
          q: `In a metre bridge $R=${R}\\ \\Omega$ is in the left gap and $X$ in the right gap. The null point is at ${l} cm from the left end. Find $X$ in ohm.`,
          sol: `$R/X=l/(100-l)=${l}/${100 - l}$. $X=R(100-l)/l=${R}\\times${100 - l}/${l}=${fmt(answer, 4)}\\ \\Omega$.` }; }
      if (v === 1) { const R = choose(rng, [4, 5, 10, 20]); const X = choose(rng, [2, 5, 8, 10, 15, 20, 30]); const answer = rd(100 * R / (R + X), 2);
        return { v, R, X, answer, tol: 0.1, unit: 'cm',
          q: `In a metre bridge $R=${R}\\ \\Omega$ is in the left gap and $X=${X}\\ \\Omega$ in the right gap. Find the position of the null point, in cm from the left end.`,
          sol: `$\\dfrac{R}{X}=\\dfrac{l}{100-l}$ gives $l=\\dfrac{100R}{R+X}=\\dfrac{100\\times${R}}{${R + X}}=${answer}$ cm.` }; }
      const X = pick(rng, 4, 12, 0.5); const L = pick(rng, 50, 90, 5); const d = pick(rng, 0.30, 0.60, 0.05);
      const answer = rd(X * 3.14 * (d * 1e-3) ** 2 / (4 * L / 100) * 1e6, 3);
      return { v, X, L, d, answer, tol: 0.01 * answer, unit: '10⁻⁶ Ω m',
        q: `A wire of resistance $${X}\\ \\Omega$ found with a metre bridge has length ${L} cm and diameter ${d} mm. Find its resistivity in $10^{-6}\\ \\Omega\\,\\mathrm m$ ($\\pi=3.14$).`,
        sol: `$\\rho=\\dfrac{X\\pi d^2}{4L}=\\dfrac{${X}\\times3.14\\times(${d}\\times10^{-3})^2}{4\\times${L / 100}}=${fmt(answer, 4)}\\times10^{-6}\\ \\Omega\\,\\mathrm m$.` };
    },
    verify: (p) => { if (p.v === 0) return p.R * (100 - p.l) / p.l; if (p.v === 1) return 100 / (1 + p.X / p.R); return p.X * (3.14 * (p.d * 1e-3) ** 2 / 4) / (p.L / 100) * 1e6; } },

  // g06: resonance tube
  { id: 'xp-g06', type: 'nat', level: 3, exams: EX[3], sub: 'sound',
    make(rng) {
      const f = choose(rng, [256, 320, 384, 426, 480, 512]); const vt = pick(rng, 335, 350, 1); const e = pick(rng, 0.8, 2.5, 0.1);
      const lam = vt / f * 100; const L1 = rd(lam / 4 - e, 1); const L2 = rd(3 * lam / 4 - e, 1); const v = int(rng, 0, 3);
      if (v === 0) { const answer = rd(2 * f * (L2 - L1) / 100, 1);
        return { v, f, L1, L2, answer, tol: 2, unit: 'm/s',
          q: `A tuning fork of ${f} Hz gives resonances in a closed tube at air column lengths ${L1} cm and ${L2} cm. Find the speed of sound in m/s (1 decimal).`,
          sol: `$\\lambda/2=L_2-L_1=${rd(L2 - L1, 1)}$ cm, so $\\lambda=${rd(2 * (L2 - L1), 1)}$ cm. $v=f\\lambda=${f}\\times${rd(2 * (L2 - L1) / 100, 4)}=${answer}$ m/s.` }; }
      if (v === 1) { const answer = rd((L2 - 3 * L1) / 2, 2);
        return { v, f, L1, L2, answer, tol: 0.2, unit: 'cm',
          q: `In a resonance tube experiment the first two resonances are at ${L1} cm and ${L2} cm. Find the end correction in cm (2 decimals).`,
          sol: `$L_1+e=\\lambda/4$ and $L_2+e=3\\lambda/4$. Subtracting gives $\\lambda/2=L_2-L_1$, so $e=\\dfrac{L_2-L_1}{2}-L_1=\\dfrac{L_2-3L_1}{2}=\\dfrac{${L2}-${rd(3 * L1, 1)}}{2}=${answer}$ cm.` }; }
      if (v === 2) { const answer = rd((L2 - 3 * L1) / 2 / 0.6, 2);
        return { v, f, L1, L2, answer, tol: 0.4, unit: 'cm',
          q: `In a resonance tube experiment the first two resonances are at ${L1} cm and ${L2} cm. Using $e=0.6r$, estimate the inner radius of the tube in cm (2 decimals).`,
          sol: `$e=(L_2-3L_1)/2=(${L2}-${rd(3 * L1, 1)})/2=${rd((L2 - 3 * L1) / 2, 2)}$ cm. $r=e/0.6=${answer}$ cm.` }; }
      const T = int(rng, 15, 35); const vT = pick(rng, 340, 355, 1); const answer = rd(vT * Math.sqrt(273 / (273 + T)), 1);
      return { v, T, vT, answer, tol: 0.5, unit: 'm/s',
        q: `The speed of sound measured at $${T}\\ ^\\circ\\mathrm C$ is ${vT} m/s. Using $v\\propto\\sqrt T$, find the speed at $0\\ ^\\circ\\mathrm C$ in m/s (1 decimal).`,
        sol: `$v_0=v_T\\sqrt{273/(273+${T})}=${vT}\\times\\sqrt{273/${273 + T}}=${answer}$ m/s. Temperatures are in kelvin.` };
    },
    verify: (p) => { if (p.v === 0) return p.f * 2 * (p.L2 - p.L1) / 100; if (p.v === 1) return (p.L2 - 3 * p.L1) / 2; if (p.v === 2) return (p.L2 - 3 * p.L1) / 1.2; return p.vT / Math.sqrt((273 + p.T) / 273); } },

  // g07: method of mixtures
  { id: 'xp-g07', type: 'nat', level: 3, exams: EX[3], sub: 'specific heat',
    make(rng) {
      const v = int(rng, 0, 2); const ms = choose(rng, [100, 150, 200]); const mw = choose(rng, [150, 200, 250]); const W = pick(rng, 10, 30, 5);
      const Tw = pick(rng, 20, 28, 1); const Tf = pick(rng, 30, 38, 1);
      if (v === 0) { const answer = rd((mw + W) * (Tf - Tw) / (ms * (100 - Tf)), 4);
        return { v, ms, mw, W, Tw, Tf, answer, tol: 0.003, unit: 'cal/g°C',
          q: `A ${ms} g metal ball at $100\\ ^\\circ\\mathrm C$ is dropped into ${mw} g of water at $${Tw}\\ ^\\circ\\mathrm C$ in a calorimeter of water equivalent ${W} g. The final temperature is $${Tf}\\ ^\\circ\\mathrm C$. Find the specific heat of the metal in cal g⁻¹ °C⁻¹ (3 decimals).`,
          sol: `Heat lost = heat gained: ${ms}·c·(100−${Tf}) = (${mw}+${W})×1×(${Tf}−${Tw}). So c = ${(mw + W) * (Tf - Tw)}/${ms * (100 - Tf)} = ${answer}.` }; }
      if (v === 1) { const c = 0.092; const num = ms * c * 100 + (mw + W) * Tw; const answer = rd(num / (ms * c + mw + W), 2);
        return { v, ms, mw, W, Tw, Tf, c, answer, tol: 0.15, unit: '°C',
          q: `A ${ms} g copper block ($c=0.092$ cal g⁻¹ °C⁻¹) at $100\\ ^\\circ\\mathrm C$ is dropped into ${mw} g of water at $${Tw}\\ ^\\circ\\mathrm C$ in a calorimeter of water equivalent ${W} g. Find the final temperature in °C (2 decimals).`,
          sol: `Heat lost = heat gained: ${ms}×0.092×(100−T) = (${mw}+${W})×(T−${Tw}). So T = (${ms}×0.092×100 + ${mw + W}×${Tw}) / (${rd(ms * c, 2)} + ${mw + W}) = ${answer} °C.` }; }
      const m = choose(rng, [0.1, 0.2, 0.25]); const mo = choose(rng, [0.2, 0.3, 0.4]); const To = pick(rng, 20, 28, 2); const Tfin = pick(rng, 30, 38, 2);
      const answer = rd(m * 390 * (100 - Tfin) / (mo * (Tfin - To)), 1);
      return { v, m, mo, To, Tfin, answer, tol: 0.01 * answer + 1, unit: 'J/kg K',
        q: `A ${m} kg copper block ($c=390$ J kg⁻¹ K⁻¹) at $100\\ ^\\circ\\mathrm C$ is dropped into ${mo} kg of oil at $${To}\\ ^\\circ\\mathrm C$ (calorimeter ignored). The final temperature is $${Tfin}\\ ^\\circ\\mathrm C$. Find the specific heat of the oil in J kg⁻¹ K⁻¹.`,
        sol: `${m}×390×(100−${Tfin}) = ${mo}×c×(${Tfin}−${To}). So c = ${rd(m * 390 * (100 - Tfin), 1)}/${rd(mo * (Tfin - To), 2)} = ${answer} J kg⁻¹ K⁻¹.` };
    },
    verify: (p) => { if (p.v === 0) return (p.mw + p.W) * (p.Tf - p.Tw) / (p.ms * (100 - p.Tf)); if (p.v === 1) return (p.ms * p.c * 100 + (p.mw + p.W) * p.Tw) / (p.ms * p.c + p.mw + p.W); return p.m * 390 * (100 - p.Tfin) / (p.mo * (p.Tfin - p.To)); } },

  // g08: lens focal length
  { id: 'xp-g08', type: 'nat', level: 3, exams: EX[3], sub: 'lens',
    make(rng) {
      const v = int(rng, 0, 3);
      if (v === 0) { const f = choose(rng, [10, 12, 15, 20, 24]); const k = choose(rng, [1.5, 2, 3, 4]); const u = f * k; const vv = rd(u * f / (u - f), 1);
        return { v, f, u, vv, answer: f, tol: 0.15, unit: 'cm',
          q: `A convex lens forms a real image at ${vv} cm from the lens for an object placed ${u} cm from it. Find the focal length in cm.`,
          sol: `$\\dfrac1f=\\dfrac1v+\\dfrac1u=\\dfrac1{${vv}}+\\dfrac1{${u}}$, using magnitudes for a real object and real image. $f=${f}$ cm.` }; }
      if (v === 1) { const [D, d] = choose(rng, [[90, 30], [100, 60], [80, 40], [100, 40], [120, 60], [60, 20]]); const answer = rd((D * D - d * d) / (4 * D), 2);
        return { v, D, d, answer, tol: 0.05, unit: 'cm',
          q: `In the displacement method the object–screen distance is ${D} cm and the two positions of a convex lens that give a sharp image are ${d} cm apart. Find the focal length in cm (2 decimals).`,
          sol: `$f=\\dfrac{D^2-d^2}{4D}=\\dfrac{${D * D}-${d * d}}{${4 * D}}=${answer}$ cm.` }; }
      if (v === 2) { const m = choose(rng, [2, 3, 4]); const D = pick(rng, 60, 120, 10); const answer = rd(m * D / ((m + 1) ** 2), 2);
        return { v, m, D, answer, tol: 0.05, unit: 'cm',
          q: `A convex lens forms a real image ${m} times as large as the object on a screen ${D} cm from the object. Find the focal length in cm (2 decimals).`,
          sol: `$v=${m}u$ and $u+v=${D}$ give $u=${rd(D / (m + 1), 3)}$ cm, $v=${rd(m * D / (m + 1), 3)}$ cm. $\\dfrac1f=\\dfrac1u+\\dfrac1v$ gives $f=\\dfrac{mD}{(m+1)^2}=${answer}$ cm.` }; }
      const f1 = choose(rng, [10, 12, 15, 20]); const F = f1 * choose(rng, [1.5, 2, 2.5, 3]); const answer = rd(F * f1 / (f1 - F), 2);
      return { v, f1, F, answer, tol: 0.05, unit: 'cm',
        q: `A convex lens of focal length ${f1} cm placed in contact with a concave lens makes a combination of focal length ${F} cm (convex). Find the focal length of the concave lens in cm, with sign.`,
        sol: `$\\dfrac1F=\\dfrac1{f_1}+\\dfrac1{f_2}$, so $\\dfrac1{f_2}=\\dfrac1{${F}}-\\dfrac1{${f1}}$. $f_2=\\dfrac{Ff_1}{f_1-F}=${answer}$ cm.` };
    },
    verify: (p) => { if (p.v === 0) return 1 / (1 / p.vv + 1 / p.u); if (p.v === 1) return (p.D ** 2 - p.d ** 2) / (4 * p.D); if (p.v === 2) { const u = p.D / (p.m + 1); return 1 / (1 / u + 1 / (p.m * u)); } return 1 / (1 / p.F - 1 / p.f1); } },

  // g09: galvanometer conversions
  { id: 'xp-g09', type: 'nat', level: 3, exams: EX[3], sub: 'galvanometer',
    make(rng) {
      const v = int(rng, 0, 3); const G = choose(rng, [40, 50, 60, 100]); const Ig = choose(rng, [1, 2, 5]) / 1000;
      if (v === 0) { const I = choose(rng, [0.5, 1, 2, 5]); const answer = rd(Ig * G / (I - Ig), 4);
        return { v, G, Ig, I, answer, tol: 0.005 * answer + 0.0002, unit: 'Ω',
          q: `A galvanometer of resistance ${G} Ω gives full-scale deflection for ${Ig * 1000} mA. Find the shunt resistance in ohm that makes it an ammeter of range 0 to ${I} A.`,
          sol: `The shunt carries $I-I_g=${rd(I - Ig, 4)}$ A at the same voltage as the coil: $S(I-I_g)=I_gG$. $S=\\dfrac{${Ig}\\times${G}}{${rd(I - Ig, 4)}}=${answer}\\ \\Omega$.` }; }
      if (v === 1) { const V = choose(rng, [1, 3, 5, 10]); const answer = rd(V / Ig - G, 1);
        return { v, G, Ig, V, answer, tol: 1, unit: 'Ω',
          q: `A galvanometer of resistance ${G} Ω gives full-scale deflection for ${Ig * 1000} mA. What series resistance in ohm converts it into a voltmeter of range 0 to ${V} V?`,
          sol: `$R+G=V/I_g=${V}/${Ig}=${rd(V / Ig, 1)}\\ \\Omega$. $R=${rd(V / Ig, 1)}-${G}=${answer}\\ \\Omega$.` }; }
      if (v === 2) { const E = choose(rng, [1.5, 2, 3]); const Rt = choose(rng, [5000, 10000, 15000]); const th = pick(rng, 10, 30, 5); const answer = rd(E / (Rt * th) * 1e6, 3);
        return { v, E, Rt, th, answer, tol: 0.01 * answer, unit: 'µA/div',
          q: `A galvanometer is connected to a ${E} V cell through a total resistance (resistance box plus galvanometer) of ${Rt} Ω. The deflection is ${th} divisions. Find the figure of merit in µA per division.`,
          sol: `$I=E/R_{\\text{total}}=${E}/${Rt}=${rd(E / Rt * 1e6, 1)}\\ \\mu\\mathrm A$. Figure of merit $=I/\\theta=${rd(E / Rt * 1e6, 1)}/${th}=${answer}$ µA per division.` }; }
      const R = choose(rng, [1000, 2000, 3000]); const S = choose(rng, [50, 100, 150]); const answer = rd(R * S / (R - S), 2);
      return { v, R, S, answer, tol: 0.5, unit: 'Ω',
        q: `In the half-deflection method the resistance in series is $R=${R}\\ \\Omega$ for full deflection. A shunt $S=${S}\\ \\Omega$ across the galvanometer reduces the deflection to half. Find the galvanometer resistance in ohm (cell resistance negligible).`,
        sol: `$G=\\dfrac{RS}{R-S}=\\dfrac{${R}\\times${S}}{${R - S}}=${answer}\\ \\Omega$.` };
    },
    verify: (p) => { if (p.v === 0) return p.Ig * p.G / (p.I - p.Ig); if (p.v === 1) return p.V / p.Ig - p.G; if (p.v === 2) return p.E / p.Rt / p.th * 1e6; return p.S / (1 - p.S / p.R); } },

  // g10: Young's modulus and elasticity
  { id: 'xp-g10', type: 'nat', level: 3, exams: EX[3], sub: 'young',
    make(rng) {
      const v = int(rng, 0, 2); const M = choose(rng, [2, 3, 4, 5]); const L = choose(rng, [1.5, 2.0, 2.5]); const d = choose(rng, [0.4, 0.5, 0.6]);
      const Yt = 2.0e11; const dL = rd(4 * M * 9.8 * L / (3.14 * (d * 1e-3) ** 2 * Yt) * 1000, 2);
      if (v === 0) { const answer = rd(4 * M * 9.8 * L / (3.14 * (d * 1e-3) ** 2 * dL * 1e-3) / 1e11, 3);
        return { v, M, L, d, dL, answer, tol: 0.03, unit: '10¹¹ N/m²',
          q: `A wire of length ${L} m and diameter ${d} mm stretches by ${dL} mm under a load of ${M} kg. Find Young's modulus in $10^{11}\\ \\mathrm{N\\,m^{-2}}$ ($g=9.8$, $\\pi=3.14$).`,
          sol: `$Y=\\dfrac{4MgL}{\\pi d^2\\Delta L}=\\dfrac{4\\times${M}\\times9.8\\times${L}}{3.14\\times(${d}\\times10^{-3})^2\\times${dL}\\times10^{-3}}=${answer}\\times10^{11}\\ \\mathrm{N\\,m^{-2}}$.` }; }
      if (v === 1) { const answer = rd(4 * M * 9.8 * L / (3.14 * (d * 1e-3) ** 2 * Yt) * 1000, 3);
        return { v, M, L, d, answer, tol: 0.01 + 0.01 * answer, unit: 'mm',
          q: `A steel wire ($Y=2.0\\times10^{11}\\ \\mathrm{N\\,m^{-2}}$) of length ${L} m and diameter ${d} mm carries a load of ${M} kg. Find the extension in mm ($g=9.8$, $\\pi=3.14$).`,
          sol: `$\\Delta L=\\dfrac{4MgL}{\\pi d^2Y}=\\dfrac{4\\times${M}\\times9.8\\times${L}}{3.14\\times(${d}\\times10^{-3})^2\\times2\\times10^{11}}=${fmt(answer / 1000, 4)}$ m $=${answer}$ mm.` }; }
      const slope = rd(M / dL, 3); const answer = rd(4 * 9.8 * L * slope * 1000 / (3.14 * (d * 1e-3) ** 2) / 1e11, 3);
      return { v, M, L, d, dL, slope, answer, tol: 0.03 * answer, unit: '10¹¹ N/m²',
        q: `A load–extension graph for a wire of length ${L} m and diameter ${d} mm is a straight line with slope ${slope} kg per mm. Find Young's modulus in $10^{11}\\ \\mathrm{N\\,m^{-2}}$ ($g=9.8$, $\\pi=3.14$).`,
        sol: `Slope $=M/\\Delta L=${slope}$ kg/mm $=${rd(slope * 1000, 1)}$ kg/m. $Y=\\dfrac{4gL}{\\pi d^2}\\times\\text{slope}=\\dfrac{4\\times9.8\\times${L}\\times${rd(slope * 1000, 1)}}{3.14\\times(${d}\\times10^{-3})^2}=${answer}\\times10^{11}\\ \\mathrm{N\\,m^{-2}}$.` };
    },
    verify: (p) => { if (p.v === 0) return 4 * p.M * 9.8 * p.L / (3.14 * (p.d * 1e-3) ** 2 * p.dL * 1e-3) / 1e11; if (p.v === 1) return 4 * p.M * 9.8 * p.L / (3.14 * (p.d * 1e-3) ** 2 * 2e11) * 1000; return (p.slope * 1000) * 4 * 9.8 * p.L / (3.14 * (p.d * 1e-3) ** 2) / 1e11; } },

  // g11: capillary rise and viscosity
  { id: 'xp-g11', type: 'nat', level: 3, exams: EX[3], sub: 'capillary',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const r = choose(rng, [0.2, 0.25, 0.3, 0.4, 0.5]); const h = rd(2 * 0.072 / (r * 1e-3 * 1000 * 9.8) * 100, 1); const corr = rng() < 0.5;
        const hc = corr ? h + r * 0.1 / 3 : h; const answer = rd(r * 1e-3 * hc / 100 * 1000 * 9.8 / 2, 4);
        return { v, r, h, corr, answer, tol: 0.0015, unit: 'N/m',
          q: `Water ($\\rho=1000$ kg/m³, $\\theta=0$, $g=9.8$) rises ${h} cm in a capillary of radius ${r} mm.${corr ? ' Apply the meniscus correction $h\\to h+r/3$.' : ''} Find the surface tension in N/m (4 decimals).`,
          sol: `$T=\\dfrac{r h\\rho g}{2}$ with ${corr ? `$h=${h}+${rd(r * 0.1 / 3, 4)}=${rd(hc, 4)}$ cm` : `$h=${h}$ cm`}. $T=\\dfrac{${r}\\times10^{-3}\\times${rd(hc / 100, 5)}\\times1000\\times9.8}{2}=${answer}$ N/m.` }; }
      if (v === 1) { const r = choose(rng, [1.0, 1.5, 2.0]); const sg = choose(rng, [1260, 900]); const eta = choose(rng, [0.2, 0.4, 0.8]); const d = 0.4;
        const vel = 2 * (r * 1e-3) ** 2 * (7800 - sg) * 9.8 / (9 * eta); const t = rd(d / vel, 1); const answer = rd(2 * (r * 1e-3) ** 2 * (7800 - sg) * 9.8 / (9 * (d / t)), 3);
        return { v, r, sg, d, t, answer, tol: 0.03 * answer + 0.002, unit: 'Pa s',
          q: `A steel ball ($\\rho=7800$ kg/m³) of radius ${r} mm falls ${d * 100} cm at constant speed in ${t} s through an oil of density ${sg} kg/m³. Find the viscosity of the oil in Pa s using $\\eta=\\dfrac{2r^2(\\rho-\\sigma)g}{9v}$ ($g=9.8$).`,
          sol: `$v=${d}/${t}=${rd(d / t, 4)}$ m/s. $\\eta=\\dfrac{2\\times(${r}\\times10^{-3})^2\\times${7800 - sg}\\times9.8}{9\\times${rd(d / t, 4)}}=${answer}$ Pa s.` }; }
      const r1 = choose(rng, [0.5, 1, 1.5]); const k = choose(rng, [2, 3, 4]); const v1 = choose(rng, [0.01, 0.02, 0.05]); const answer = rd(v1 * k * k, 4);
      return { v, r1, k, v1, answer, tol: 0.0005, unit: 'm/s',
        q: `A steel ball of radius ${r1} mm falls at a terminal speed of ${v1} m/s in a viscous liquid. What is the terminal speed of a ball of the same steel of radius ${r1 * k} mm in the same liquid, in m/s?`,
        sol: `Stokes: $v\\propto r^2$. The radius is ${k} times larger, so the speed is ${k * k} times larger: ${v1}×${k * k} = ${answer} m/s.` };
    },
    verify: (p) => { if (p.v === 0) return (p.corr ? p.h + p.r * 0.1 / 3 : p.h) / 100 * p.r * 1e-3 * 1000 * 9.8 / 2; if (p.v === 1) return 2 * (p.r * 1e-3) ** 2 * (7800 - p.sg) * 9.8 * p.t / (9 * p.d); return p.v1 * (p.r1 * p.k / p.r1) ** 2; } },

  // g12: prism
  { id: 'xp-g12', type: 'nat', level: 3, exams: EX[3], sub: 'prism',
    make(rng) {
      const v = int(rng, 0, 2); const A = choose(rng, [60, 45, 30]); const rad = PI / 180;
      if (v === 0) { const mu = choose(rng, [1.45, 1.5, 1.55, 1.6, 1.65]); const dm = rd(2 * Math.asin(mu * Math.sin(A / 2 * rad)) / rad - A, 1);
        const answer = rd(Math.sin((A + dm) / 2 * rad) / Math.sin(A / 2 * rad), 3);
        return { v, A, dm, answer, tol: 0.01,
          q: `A prism of angle $${A}^\\circ$ has minimum deviation $${dm}^\\circ$. Find the refractive index of its material (3 decimals).`,
          sol: `$\\mu=\\dfrac{\\sin\\frac{A+\\delta_m}{2}}{\\sin\\frac A2}=\\dfrac{\\sin${rd((A + dm) / 2, 2)}^\\circ}{\\sin${A / 2}^\\circ}=${answer}$.` }; }
      if (v === 1) { const i = pick(rng, 35, 60, 5); const e = pick(rng, 40, 70, 5); const answer = i + e - A;
        return { v, A, i, e, answer, tol: 0.1, unit: 'deg',
          q: `A ray enters a prism of angle $${A}^\\circ$ at an angle of incidence $${i}^\\circ$ and leaves at an angle of emergence $${e}^\\circ$. Find the angle of deviation in degrees.`,
          sol: `$\\delta=i+e-A=${i}+${e}-${A}=${answer}^\\circ$.` }; }
      const mu = choose(rng, [1.4, 1.5, 1.6, 1.7]); const answer = rd(2 * Math.asin(mu * Math.sin(A / 2 * rad)) / rad - A, 1);
      return { v, A, mu, answer, tol: 0.2, unit: 'deg',
        q: `Find the angle of minimum deviation, in degrees, for a prism of angle $${A}^\\circ$ and refractive index ${mu} (1 decimal).`,
        sol: `$\\sin\\frac{A+\\delta_m}{2}=\\mu\\sin\\frac A2=${mu}\\times${rd(Math.sin(A / 2 * rad), 4)}=${rd(mu * Math.sin(A / 2 * rad), 4)}$. So $\\frac{A+\\delta_m}2=${rd(Math.asin(mu * Math.sin(A / 2 * rad)) / rad, 2)}^\\circ$ and $\\delta_m=${answer}^\\circ$.` };
    },
    verify: (p) => { if (p.v === 0) return Math.sin((p.A + p.dm) * PI / 360) / Math.sin(p.A * PI / 360); if (p.v === 1) return p.i + p.e - p.A; return 2 * Math.asin(p.mu * Math.sin(p.A * PI / 360)) * 180 / PI - p.A; } },

  // g13: diode and Zener circuits
  { id: 'xp-g13', type: 'nat', level: 3, exams: EX[3], sub: 'zener',
    make(rng) {
      const v = int(rng, 0, 3);
      if (v === 0) { const Vs = choose(rng, [3, 4.5, 5, 6, 9, 12]); const R = choose(rng, [220, 470, 1000, 2200]); const si = rng() < 0.6; const Vd = si ? 0.7 : 0.3;
        const answer = rd((Vs - Vd) / R * 1000, 3);
        return { v, Vs, R, Vd, answer, tol: 0.01 * answer, unit: 'mA',
          q: `A ${si ? 'silicon' : 'germanium'} diode (forward drop ${Vd} V) is forward biased in series with a ${R} Ω resistor and a ${Vs} V battery. Find the current in mA.`,
          sol: `The diode drops ${Vd} V, so the resistor has ${rd(Vs - Vd, 2)} V. $I=${rd(Vs - Vd, 2)}/${R}=${answer}$ mA.` }; }
      if (v === 1) { const Vin = choose(rng, [12, 15, 18]); const Vz = choose(rng, [5.6, 6.2, 9.1]); const Rs = choose(rng, [220, 300, 470]);
        const answer = rd((Vin - Vz) / Rs * 1000, 2);
        return { v, Vin, Vz, Rs, answer, tol: 0.03, unit: 'mA',
          q: `A Zener regulator has input ${Vin} V, a ${Vz} V Zener and a ${Rs} Ω series resistor. There is no load. Find the Zener current in mA (2 decimals).`,
          sol: `All the current in the series resistor goes through the Zener: $(${Vin}-${Vz})/${Rs}=${answer}$ mA.` }; }
      if (v === 2) { const Vin = choose(rng, [10, 12, 15]); const Vz = choose(rng, [5.1, 6.0, 6.8]); const IL = choose(rng, [10, 15, 20]); const Iz = choose(rng, [5, 10]);
        const answer = rd((Vin - Vz) / ((IL + Iz) / 1000), 1);
        return { v, Vin, Vz, IL, Iz, answer, tol: 0.8, unit: 'Ω',
          q: `A Zener regulator ($V_z=${Vz}$ V) is fed from ${Vin} V. The load draws up to ${IL} mA and the Zener needs at least ${Iz} mA. Find the largest series resistance that works, in ohm (1 decimal).`,
          sol: `Current in the series resistor $=${IL}+${Iz}=${IL + Iz}$ mA. $R_{\\max}=(${Vin}-${Vz})/${(IL + Iz) / 1000}=${answer}\\ \\Omega$.` }; }
      const V1 = choose(rng, [0.70, 0.72, 0.74]); const dV = choose(rng, [0.02, 0.04, 0.05]); const I1 = choose(rng, [2, 4]); const dI = choose(rng, [4, 8, 10]); const answer = rd(dV / (dI / 1000), 2);
      return { v, V1, dV, I1, dI, answer, tol: 0.05 * answer, unit: 'Ω',
        q: `For a forward-biased diode the current changes from ${I1} mA to ${I1 + dI} mA as the voltage rises from ${V1} V to ${rd(V1 + dV, 2)} V. Find the dynamic resistance in ohm.`,
        sol: `$r=\\Delta V/\\Delta I=${dV}/${dI / 1000}=${answer}\\ \\Omega$.` };
    },
    verify: (p) => { if (p.v === 0) return (p.Vs - p.Vd) / p.R * 1000; if (p.v === 1) return (p.Vin - p.Vz) / p.Rs * 1000; if (p.v === 2) return (p.Vin - p.Vz) * 1000 / (p.IL + p.Iz); return p.dV * 1000 / p.dI; } },

  // g14: metre scale moments
  { id: 'xp-g14', type: 'nat', level: 3, exams: EX[3], sub: 'metre scale',
    make(rng) {
      const v = int(rng, 0, 1);
      if (v === 0) { const m1 = choose(rng, [20, 40, 60, 80]); const c = choose(rng, [30, 40]); const x1 = choose(rng, [0, 5, 10, 15, 20]); const answer = m1 * (c - x1) / (50 - c);
        return { v, m1, c, x1, answer, tol: 0.5, unit: 'g',
          q: `A uniform metre scale is balanced on a knife edge at the ${c} cm mark when a ${m1} g body hangs from the ${x1} cm mark. Find the mass of the scale in g.`,
          sol: `The scale's weight acts at 50 cm. Torques about ${c} cm: ${m1}×(${c}−${x1}) = M×(50−${c}). So M = ${m1 * (c - x1)}/${50 - c} = ${answer} g.` }; }
      for (let tries = 0; tries < 50; tries++) {
        const M = choose(rng, [80, 100, 150]); const c = choose(rng, [30, 40]); const m1 = choose(rng, [100, 150, 200]); const x1 = choose(rng, [0, 5, 10, 15, 20]); const m2 = choose(rng, [50, 100]);
        const x2 = c + (m1 * (c - x1) - M * (50 - c)) / m2;
        if (x2 > c + 4 && x2 < 100 && Number.isInteger(x2)) return { v, M, c, m1, x1, m2, answer: x2, tol: 0.5, unit: 'cm',
          q: `A uniform metre scale of mass ${M} g rests on a knife edge at the ${c} cm mark. A ${m1} g body hangs at the ${x1} cm mark. Where (in cm) must a ${m2} g body hang on the other side to balance the scale?`,
          sol: `Torques about ${c} cm: left side ${m1}×(${c}−${x1}) = ${m1 * (c - x1)}. Right side: the scale's weight ${M}×(50−${c}) = ${M * (50 - c)} plus ${m2}×(x−${c}). Balance: ${m2}(x−${c}) = ${m1 * (c - x1) - M * (50 - c)}, so x = ${x2} cm.` };
      }
      return { v: 0, m1: 40, c: 40, x1: 10, answer: 120, tol: 0.5, unit: 'g', q: 'A uniform metre scale balances at 40 cm with a 40 g body at 10 cm. Find the mass of the scale in g.', sol: 'About 40 cm: 40×30 = M×10, so M = 120 g.' };
    },
    verify: (p) => (p.v === 0 || p.M === undefined ? p.m1 * (p.c - p.x1) / (50 - p.c) : p.c + (p.m1 * (p.c - p.x1) - p.M * (50 - p.c)) / p.m2) },

  // g15: travelling microscope
  { id: 'xp-g15', type: 'nat', level: 3, exams: EX[3], sub: 'microscope',
    make(rng) {
      const v = int(rng, 0, 2); const mu0 = choose(rng, [1.33, 1.43, 1.5, 1.52, 1.6]); const t = pick(rng, 0.8, 1.6, 0.1); const a = pick(rng, 2.0, 4.0, 0.01);
      const c = rd(a + t, 3); const b = rd(c - t / mu0, 3);
      if (v === 0) { const answer = rd((c - a) / (c - b), 3);
        return { v, a, b, c, answer, tol: 0.015,
          q: `A travelling microscope reads ${a} cm on a mark on paper, ${b} cm on the same mark seen through a glass slab placed over it, and ${c} cm on powder dusted on the top of the slab. Find the refractive index of the glass (3 decimals).`,
          sol: `Real thickness $=${c}-${a}=${rd(c - a, 3)}$ cm. Apparent thickness $=${c}-${b}=${rd(c - b, 3)}$ cm. $\\mu=${rd(c - a, 3)}/${rd(c - b, 3)}=${answer}$.` }; }
      if (v === 1) { const answer = rd(t / mu0, 3);
        return { v, t, mu0, answer, tol: 0.005, unit: 'cm',
          q: `A glass slab of thickness ${t} cm and refractive index ${mu0} is viewed from above. By how much, in cm, does the apparent depth of a mark on its bottom surface fall short of the real depth? Give the apparent depth in cm (3 decimals).`,
          sol: `Apparent depth = real depth / μ = ${t}/${mu0} = ${answer} cm.` }; }
      const answer = rd(0.002 / (c - a) * 100 + 0.002 / (c - b) * 100, 3);
      return { v, a, b, c, answer, tol: 0.01, unit: '%',
        q: `In a travelling microscope experiment the readings are ${a}, ${b} and ${c} cm (mark on paper, mark through slab, powder on top). Each reading has an error of $\\pm0.001$ cm. Find the maximum percentage error in $\\mu=(c-a)/(c-b)$ (3 decimals).`,
        sol: `$c-a=${rd(c - a, 3)}$ and $c-b=${rd(c - b, 3)}$ cm, each with absolute error $0.002$ cm. $\\Delta\\mu/\\mu=0.002/${rd(c - a, 3)}+0.002/${rd(c - b, 3)}=${answer}\\%$.` };
    },
    verify: (p) => { if (p.v === 0) return (p.c - p.a) / (p.c - p.b); if (p.v === 1) return p.t / p.mu0; return (0.002 / (p.c - p.a) + 0.002 / (p.c - p.b)) * 100; } },

  // g16: which measurement dominates (mcq)
  { id: 'xp-g16', type: 'mcq', level: 3, exams: EX[3], sub: 'errors',
    make(rng) {
      for (let tries = 0; tries < 100; tries++) {
        const m = pick(rng, 20, 90, 5); const dm = choose(rng, [0.01, 0.1, 0.5]); const r = pick(rng, 0.5, 2.0, 0.1); const dr = choose(rng, [0.01, 0.02, 0.05]);
        const h = pick(rng, 4, 12, 1); const dh = choose(rng, [0.05, 0.1, 0.2]);
        const c = [dm / m, 2 * dr / r, dh / h]; const mx = Math.max(...c); const sorted = [...c].sort((x, y) => y - x);
        if (sorted[0] < 1.3 * sorted[1]) continue;
        const names = ['the mass', 'the radius', 'the height']; const k = c.indexOf(mx);
        const o = shuffleOpts(rng, names[k], [...names.filter((_, i) => i !== k), 'all contribute equally']);
        return { m, dm, r, dr, h, dh, k, options: o.options, answer: o.answer,
          q: `The density of a solid cylinder is $\\rho=\\dfrac{m}{\\pi r^2h}$. The measurements are $m=${m}\\pm${dm}$ g, $r=${r}\\pm${dr}$ cm and $h=${h}\\pm${dh}$ cm. Which measurement contributes most to the error in $\\rho$?`,
          sol: `Relative contributions: mass $${dm}/${m}=${rd(c[0] * 100, 2)}\\%$; radius $2\\times${dr}/${r}=${rd(c[1] * 100, 2)}\\%$ (squared); height $${dh}/${h}=${rd(c[2] * 100, 2)}\\%$. The largest is ${names[k]}.` };
      }
      return { options: ['the mass', 'the radius', 'the height', 'all contribute equally'], answer: 1, k: 1, m: 50, dm: 0.01, r: 1, dr: 0.05, h: 10, dh: 0.05, q: 'The density of a cylinder is $\\rho=m/(\\pi r^2h)$ with $m=50\\pm0.01$ g, $r=1.0\\pm0.05$ cm, $h=10\\pm0.05$ cm. Which measurement contributes most to the error?', sol: 'Radius: $2\\times0.05/1.0=10\\%$; mass $0.02\\%$; height $0.5\\%$. The radius dominates.' };
    },
    verify: (p) => { const c = [p.dm / p.m, 2 * p.dr / p.r, p.dh / p.h]; const k = c.indexOf(Math.max(...c)); return k === p.k ? p.answer : -1; } },

  // g17: significant figures (mcq)
  { id: 'xp-g17', type: 'mcq', level: 2, exams: EX[2], sub: 'sigfig',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const a = pick(rng, 10.01, 49.99, 0.01); const b = pick(rng, 1.1, 9.9, 0.1); const s = a + b; const c = rd(s, 1);
        const o = shuffleOpts(rng, String(c), [String(rd(s, 2)), String(Math.round(s)), String(rd(s, 3))]);
        return { v, a, b, c, options: o.options, answer: o.answer,
          q: `Add the measured values ${a.toFixed(2)} cm and ${b.toFixed(1)} cm and give the result with the correct number of significant figures (in cm).`,
          sol: `${a.toFixed(2)} + ${b.toFixed(1)} = ${s.toFixed(2)}. In addition, keep the decimal places of the least precise number: ${b.toFixed(1)} has one decimal place. So the answer is ${c}.` }; }
      if (v === 1) { const x = pick(rng, 2.1, 9.9, 0.1); const y = pick(rng, 1.01, 9.99, 0.01); const p = x * y; const c = +p.toPrecision(2);
        const o = shuffleOpts(rng, String(c), [String(+p.toPrecision(3)), String(+p.toPrecision(4)), String(+p.toPrecision(1))]);
        return { v, x, y, c, options: o.options, answer: o.answer,
          q: `Multiply the measured values ${x.toFixed(1)} and ${y.toFixed(2)} and give the result with the correct number of significant figures.`,
          sol: `${x.toFixed(1)} × ${y.toFixed(2)} = ${p.toFixed(4)}. In multiplication keep as many significant figures as the least precise factor: ${x.toFixed(1)} has 2. So ${c}.` }; }
      const forms = [['0.0450', 3], ['0.00340', 3], ['4.500', 4], ['0.0004', 1], ['1.20', 3], ['30.05', 4], ['0.5060', 4]]; const [txt, n] = choose(rng, forms);
      const o = shuffleOpts(rng, String(n), [String(n + 1), String(n - 1 || 5), String(n + 2)]);
      return { v, txt, n, options: o.options, answer: o.answer,
        q: `How many significant figures are there in the measurement ${txt}?`,
        sol: `Leading zeros do not count. All digits from the first non-zero digit onwards count (including zeros between digits and trailing zeros after a decimal point). So ${txt} has ${n}.` };
    },
    verify: (p) => { if (p.v === 0) return p.options.indexOf(String(rd(p.a + p.b, 1))); if (p.v === 1) return p.options.indexOf(String(+(p.x * p.y).toPrecision(2))); const t = p.txt.replace('.', '').replace(/^0+/, ''); return p.options.indexOf(String(t.length)); } },

  // g18: corrected reading with sign of zero error (mcq)
  { id: 'xp-g18', type: 'mcq', level: 2, exams: EX[2], sub: 'screw gauge',
    make(rng) {
      const N = 100; const lc = 0.01; const msr = int(rng, 2, 6); const cs = int(rng, 10, 90); const kk = int(rng, 2, 8); const neg = rng() < 0.5;
      const closed = neg ? N - kk : kk; const obs = rd(msr + cs * lc, 2); const corr = rd(neg ? obs + kk * lc : obs - kk * lc, 2);
      const o = numOpts(rng, corr, [obs, rd(neg ? obs - kk * lc : obs + kk * lc, 2), rd(obs + closed * lc, 2)], 'mm', 4);
      return { msr, cs, kk, neg, corr, options: o.options, answer: o.answer,
        q: `A screw gauge (pitch 1 mm, 100 divisions) reads ${closed} on the circular scale with the jaws closed. For a wire the main scale reads ${msr} mm and the circular scale reads ${cs}. The correct diameter is`,
        sol: `LC = 0.01 mm. Observed = ${msr} + ${cs}×0.01 = ${obs} mm. A closed reading of ${closed} ${neg ? `(= 100 − ${kk}) means a zero error of −${rd(kk * lc, 2)} mm, which we add` : `means a zero error of +${rd(kk * lc, 2)} mm, which we subtract`}: correct diameter = ${corr} mm.`,
        trap: 'A closed reading above 50 is a negative zero error of (100 − reading) divisions.' };
    },
    verify: (p) => p.options.indexOf(`${fmt(p.neg ? p.msr + p.cs * 0.01 + p.kk * 0.01 : p.msr + p.cs * 0.01 - p.kk * 0.01, 4)} mm`) },

  // g19: metre bridge reasoning (mcq, Class 12)
  { id: 'xp-g19', type: 'mcq', level: 2, exams: [...EX[2], 'cuet'], sub: 'metre bridge',
    make(rng) {
      const v = int(rng, 0, 1);
      if (v === 0) { const l = pick(rng, 20, 80, 5); const ans = l < 50 ? 'X is larger than R' : l > 50 ? 'X is smaller than R' : 'X equals R';
        const o = shuffleOpts(rng, ans, ['X is larger than R', 'X is smaller than R', 'X equals R', 'Cannot be decided'].filter((x) => x !== ans));
        return { v, l, options: o.options, answer: o.answer,
          q: `In a metre bridge, the known resistance $R$ is in the left gap and the unknown $X$ in the right gap. The null point is at ${l} cm from the left end. Compare $X$ with $R$.`,
          sol: `$R/X=l/(100-l)=${l}/${100 - l}$. ${l < 50 ? 'This is less than 1, so $R<X$.' : l > 50 ? 'This is greater than 1, so $R>X$.' : 'This equals 1, so $R=X$.'} The resistor in the shorter segment is the smaller one.` }; }
      const l = pick(rng, 20, 80, 5); const o = numOpts(rng, 100 - l, [l, 50 - l / 2, 100 + l], 'cm', 3);
      return { v, l, options: o.options, answer: o.answer,
        q: `A metre bridge has its null point at ${l} cm. If $R$ and $X$ are interchanged, the new null point is at`,
        sol: `Interchanging swaps the segments: $X/R=l'/(100-l')$. The old condition $R/X=l/(100-l)$ gives $l'=100-l=${100 - l}$ cm.` };
    },
    verify: (p) => { if (p.v === 0) return idx(p.options, p.l < 50 ? 'X is larger than R' : p.l > 50 ? 'X is smaller than R' : 'X equals R'); return p.options.indexOf(`${fmt(100 - p.l, 3)} cm`); } },

  // g20: Ohm's law and meter errors
  { id: 'xp-g20', type: 'nat', level: 3, exams: EX[3], sub: 'ohms law',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const R = choose(rng, [50, 100, 200]); const Rv = choose(rng, [500, 1000, 2000]); const answer = rd(R * Rv / (R + Rv), 2);
        return { v, R, Rv, answer, tol: 0.02 * answer, unit: 'Ω',
          q: `A ${R} Ω resistor is measured by the V–I method. The voltmeter has a resistance of ${Rv} Ω and is connected directly across the resistor, while the ammeter reads the total current. Find the value of $R$ obtained from the readings, in ohm.`,
          sol: `The voltmeter and resistor are in parallel, so $V/I=\\dfrac{R R_V}{R+R_V}=\\dfrac{${R}\\times${Rv}}{${R + Rv}}=${answer}\\ \\Omega$. It is lower than the true value.` }; }
      if (v === 1) { const R = choose(rng, [1, 2, 5, 10]); const Ra = choose(rng, [0.2, 0.5, 1]); const answer = rd(Ra / R * 100, 2);
        return { v, R, Ra, answer, tol: 0.02 * answer, unit: '%',
          q: `A ${R} Ω resistor is measured with an ammeter of resistance ${Ra} Ω in series, and the voltmeter is connected across the resistor and the ammeter together. Find the percentage error in the measured resistance.`,
          sol: `The voltmeter reads the drop across both, so $R_{\\text{measured}}=${R}+${Ra}=${rd(R + Ra, 2)}\\ \\Omega$. Error $=${Ra}/${R}\\times100=${answer}\\%$.` }; }
      const I1 = choose(rng, [0.10, 0.20]); const R = choose(rng, [2.5, 4.5, 6.0, 8.0]); const I2 = rd(I1 * choose(rng, [3, 4, 5]), 2);
      const answer = R;
      return { v, I1, I2, R, answer, tol: 0.02, unit: 'Ω',
        q: `In an experiment the readings for a resistor are $(${I1}\\ \\mathrm A,\\ ${rd(I1 * R, 3)}\\ \\mathrm V)$ and $(${I2}\\ \\mathrm A,\\ ${rd(I2 * R, 3)}\\ \\mathrm V)$ and the graph passes through the origin. Find the resistance from the slope, in ohm.`,
        sol: `Slope $=\\Delta V/\\Delta I=(${rd(I2 * R, 3)}-${rd(I1 * R, 3)})/(${I2}-${I1})=${R}\\ \\Omega$.` };
    },
    verify: (p) => { if (p.v === 0) return 1 / (1 / p.R + 1 / p.Rv); if (p.v === 1) return (p.R + p.Ra - p.R) / p.R * 100; return (p.I2 * p.R - p.I1 * p.R) / (p.I2 - p.I1); } },
];

// ---------- expansion block: more hard items, matches, multi-correct, passages and templates ----------
{
const XR = String.raw;
const XEXB = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv', 'neet'], 5: ['jee-adv'] };
let xk = 193; let xc = 0;
const xid = () => `xp-${String(++xk).padStart(3, '0')}`;
const XPOS = [2, 0, 3, 1, 1, 3, 0, 2];
const xex = (level, type, sub) => (type === 'mcq' && level <= 3 && ((s)=>['metre bridge','resistivity','ohms law','galvanometer','mirror','lens','optics','prism','microscope','diode','zener','semiconductor'].includes(s))(sub) ? [...XEXB[level], 'cuet'] : XEXB[level]);
const xb = (level, sub, o) => ({ id: xid(), level, exams: xex(level, o.type, sub), sub, ...o });
const xm = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = XPOS[xc++ % 8]; const options = [...wrongs]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const xi = (level, sub, q, value, sol, o = {}) => {
  const answer = Math.round(value); if (Math.abs(value - answer) > 1e-6) throw new Error('not an integer: ' + value + ' ' + q.slice(0, 60));
  return xb(level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, calc: () => answer, sol, ...o });
};
const xn = (level, sub, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return xb(level, sub, { type: 'nat', format: 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
};
const xs = (level, sub, q, options, answer, sol, o = {}) => xb(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const XA = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const xa = (level, sub, A, R, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: XA, answer, sol, ...o });
const XS = ['Both Statement I and Statement II are true', 'Both Statement I and Statement II are false', 'Statement I is true but Statement II is false', 'Statement I is false but Statement II is true'];
const xt = (level, sub, I, II, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: XS, answer, sol, ...o });
const xmatch = (level, sub, group, q, correct, sol, o = {}) => {
  const L = correct.split(', ').map((s) => s.split('-')); const rs = L.map((x) => x[1]);
  const mk = (p) => L.map((x, i) => `${x[0]}-${p[i]}`).join(', ');
  const swaps = [[0, 1], [2, 3], [1, 2], [0, 3], [0, 2], [1, 3]]; const wr = [];
  for (let t = 0; t < 6 && wr.length < 3; t++) { const [i, j] = swaps[(t + xc) % 6]; const p = [...rs]; [p[i], p[j]] = [p[j], p[i]]; const s = mk(p); if (s !== correct && !wr.includes(s)) wr.push(s); }
  if (wr.length < 3) throw new Error('match options');
  const pos = XPOS[xc++ % 8]; const options = [...wr]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'match', group, q, options, answer: pos, sol, ...o });
};
const xp = (extra) => (level, sub, group, q, ...rest) => extra(level, sub, q, ...rest);
const XG = (n, level, type, sub, make, verify) => ({ id: `xp-g${n}`, type, level, exams: xex(level, type, sub), sub, make, verify });
const f3 = (v) => fmt(v, 3);
const sg = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const XPY = (o) => ({ format: 'passage', ...o });
const XPI = Math.PI; const XG0 = 9.8;
Object.assign(groups, {
  xm1: { title: 'Apparatus and experiments',
    list1: ['A. Young\'s modulus of a wire', 'B. Surface tension by capillary rise', 'C. Specific heat of a solid by mixtures', 'D. Speed of sound in air'],
    list2: [r`p. Searle's apparatus`, r`q. capillary tube and travelling microscope`, r`r. calorimeter and thermometer`, r`s. resonance tube and tuning fork`] },
  xm2: { title: 'Formulae used in experiments',
    list1: ['A. Simple pendulum, period', 'B. Spring-mass system, period', 'C. Resonance tube: speed from two resonance lengths $L_1$, $L_2$', 'D. First resonance of a closed tube, with end correction $e$'],
    list2: [r`p. $T = 2\pi\sqrt{L/g}$`, r`q. $T = 2\pi\sqrt{m/k}$`, r`r. $v = 2f(L_2-L_1)$`, r`s. $f = \dfrac{v}{4(L_1+e)}$`] },
  xm3: { title: 'Type of error',
    list1: ['A. Zero error of a screw gauge', 'B. Variation in the reaction time when using a stopwatch', 'C. Using a stretched metre scale', 'D. Mistake in reading the circular scale'],
    list2: [r`p. systematic error`, r`q. random error`, r`r. instrumental error`, r`s. gross (personal) error`] },
  xm4: { title: 'Maximum percentage error in a derived quantity (each reading has the stated error)',
    list1: [r`A. $g = \dfrac{4\pi^2L}{T^2}$ with $L$ 1 %, $T$ 1 %`, r`B. $\rho = \dfrac{m}{\pi r^2h}$ with $m$ 2 %, $r$ 1 %, $h$ 2 %`, r`C. $R = \dfrac{V}{I}$ with $V$ 2 %, $I$ 3 %`, r`D. $T = 2\pi\sqrt{L/g}$ with $L$ 4 %, $g$ 4 %`],
    list2: ['p. 3 %', 'q. 6 %', 'r. 5 %', 's. 4 %'] },
  xm5: { title: 'Curves and graphs in experiments',
    list1: ['A. $1/v$ against $1/u$ for a convex lens', 'B. Deviation against angle of incidence for a prism', 'C. $T^2$ against $L$ for a pendulum', 'D. Current against voltage for a Zener diode in reverse bias'],
    list2: [r`p. straight line with intercept $1/f$`, r`q. curve with a minimum`, r`r. straight line through the origin`, r`s. nearly vertical line after breakdown`] },
  xm6: { title: 'Electrical experiments',
    list1: ['A. Metre bridge', 'B. Ohm\'s law verification', 'C. Galvanometer resistance (half deflection)', 'D. Zener regulator'],
    list2: [r`p. null point: $R/X = l/(100-l)$`, r`q. $V$-$I$ graph a straight line through the origin`, r`r. $G = \dfrac{RS}{R-S}$`, r`s. constant output voltage in breakdown`] },
  xm7: { title: 'Optics experiments',
    list1: ['A. Prism at minimum deviation', 'B. Displacement method for a lens', 'C. Convex mirror from a convex lens', 'D. $u$-$v$ method'],
    list2: [r`p. $\mu = \dfrac{\sin\frac{A+\delta_m}{2}}{\sin\frac A2}$`, r`q. $f = \dfrac{D^2-d^2}{4D}$`, r`r. the lens forms the image at the mirror's centre of curvature`, r`s. $\dfrac1f = \dfrac1v-\dfrac1u$`] },
  xm8: { title: 'Significant figures',
    list1: ['A. 0.0420', 'B. 5.000', 'C. 0.0050', 'D. 0.050400'],
    list2: ['p. 2', 'q. 3', 'r. 4', 's. 5'] },
  xp1: { title: 'Young\'s modulus by Searle\'s method',
    passage: r`<p>A steel wire 2.00 m long has diameter 0.80 mm (measured with a screw gauge). A load of 2.0 kg stretches it by 0.50 mm. Take $g = 9.8\ \mathrm{m\,s^{-2}}$.</p>` },
  xp2: { title: 'Focal length of a convex lens by displacement',
    passage: r`<p>An object and a screen are 90 cm apart. A convex lens gives a sharp image at two positions that are 30 cm apart.</p>` },
});

// ---------- L2 ----------
items.push(
  xm(2, 'screw gauge', XR`A screw gauge has a zero error of $-0.03$ mm (the zero of the circular scale is below the reference line). It reads 2.45 mm for a wire. The true diameter is`, '2.48 mm', ['2.42 mm', '2.45 mm', '2.51 mm'],
    XR`True reading $=$ observed $-$ zero error $= 2.45-(-0.03) = 2.48$ mm. (A negative zero error means the instrument reads too little, so we add.)`),
  xm(2, 'sigfig', XR`The number of significant figures in 0.0420 is`, '3', ['2', '4', '5'],
    XR`Leading zeros do not count. The digits 4, 2 and the trailing 0 (which is after the decimal point and shows precision) count: 3.`),
  xi(2, 'vernier', XR`A vernier calliper has 1 MSD = 1 mm and 20 vernier divisions equal 19 MSD. Its least count in micrometre is`, 1 / 20 * 1000,
    XR`$LC = 1\ \mathrm{MSD}-1\ \mathrm{VSD} = 1-\dfrac{19}{20} = 0.05$ mm $=50\ \mu$m.`, { unit: 'µm' }),
  xa(2, 'pendulum', XR`In a simple pendulum experiment the bob is displaced through only a small angle.`, XR`The formula $T = 2\pi\sqrt{L/g}$ is valid only for small oscillations.`, 0,
    XR`For larger amplitudes the restoring torque is $mgL\sin\theta$, not $mgL\theta$, and the period becomes longer than $2\pi\sqrt{L/g}$. R explains A.`),
  xt(2, 'metre bridge', XR`The unknown resistance in a metre bridge is measured most accurately when the null point is near the middle.`, XR`The percentage error in the unknown resistance is least when the null point is at 50 cm.`, 0,
    XR`$\dfrac{\Delta X}{X} = \dfrac{\Delta l}{l(100-l)}\times100$, whose denominator is greatest at $l=50$. Both true.`),
  xm(2, 'lens', XR`In a lens experiment an object is at $u=-30$ cm and a real image forms at $v=+60$ cm. The focal length is`, '20 cm', ['40 cm', '60 cm', '$-20$ cm'],
    XR`$\dfrac1f = \dfrac1v-\dfrac1u = \dfrac{1}{60}+\dfrac{1}{30} = \dfrac{3}{60}$, so $f = 20$ cm.`),
  xmatch(2, 'apparatus', 'xm1', XR`Match each experiment in List I with its apparatus in List II.`, 'A-p, B-q, C-r, D-s',
    XR`Young's modulus of a wire: Searle's apparatus (p). Surface tension by capillary rise: capillary tube with a travelling microscope (q). Specific heat by mixtures: a calorimeter (r). Speed of sound: resonance tube with a tuning fork (s).`),
);

// ---------- L3 ----------
items.push(
  xn(3, 'screw gauge', XR`A screw gauge has pitch 1 mm and 100 circular divisions. With the jaws closed, the zero of the circular scale is 4 divisions above the reference line. A wire reads 2 mm on the main scale and 36 on the circular scale. Find the true diameter, in mm.`, 2 + 0.36 - 0.04, 0.005, 2,
    XR`$LC = \dfrac{1}{100} = 0.01$ mm. The zero error is $+4$ divisions $=+0.04$ mm. Observed $= 2+36\times0.01 = 2.36$ mm. True $=2.36-0.04 = 2.32$ mm.`, { unit: 'mm', trap: 'Zero above the line is a positive error.' }),
  xn(3, 'pendulum', XR`A student times 20 oscillations of a pendulum as 40.2 s. The length (point of suspension to centre of bob) is 100.0 cm. Find $g$, in $\mathrm{m\,s^{-2}}$.`, 4 * XPI * XPI * 1.0 / (40.2 / 20) ** 2, 0.03, 2,
    XR`$T = \dfrac{40.2}{20} = 2.01$ s. $g = \dfrac{4\pi^2L}{T^2} = \dfrac{39.48\times1.000}{4.040} = 9.77\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  xi(3, 'errors', XR`In finding $g = 4\pi^2L/T^2$, $L$ has a 1% error and $T$ has a 1% error. The maximum percentage error in $g$ is`, 1 + 2 * 1,
    XR`$\dfrac{\Delta g}{g} = \dfrac{\Delta L}{L}+2\dfrac{\Delta T}{T} = 1+2 = 3\%$. The power 2 on $T$ doubles its contribution.`, { unit: '%' }),
  xm(3, 'metre bridge', XR`In a metre bridge a resistance of 6 $\Omega$ is in the left gap and the unknown $X$ is in the right gap. The null point is at 40 cm from the left end. $X$ is`, '9 $\\Omega$', ['4 $\\Omega$', '6 $\\Omega$', '2.4 $\\Omega$'],
    XR`$\dfrac{R}{X} = \dfrac{l}{100-l} = \dfrac{40}{60}$, so $X = 6\times\dfrac{60}{40} = 9\ \Omega$.`, { trap: 'The longer wire segment goes with the unknown on that side.' }),
  xn(3, 'young', XR`In Searle's experiment a wire of length 2.00 m and diameter 0.80 mm is extended by 0.50 mm under a load of 2.0 kg. Find Young's modulus, in units of $10^{11}$ Pa ($g=9.8$).`, 2 * 9.8 * 2 / (XPI * 0.4e-3 ** 2 * 0.5e-3) / 1e11, 0.03, 2,
    XR`$Y = \dfrac{MgL}{\pi r^2\Delta L} = \dfrac{2\times9.8\times2.00}{\pi\times(0.4\times10^{-3})^2\times0.5\times10^{-3}} = 1.56\times10^{11}$ Pa. The radius is half the diameter.`, { unit: '×10¹¹ Pa' }),
  xm(3, 'specific heat', XR`100 g of a metal at 100 °C is dropped into 200 g of water at 20 °C and the mixture reaches 25 °C (calorimeter's heat capacity ignored; $c_w = 4.2\ \mathrm{J\,g^{-1}K^{-1}}$). The specific heat of the metal is`, XR`$0.56\ \mathrm{J\,g^{-1}K^{-1}}$`, [XR`$0.045\ \mathrm{J\,g^{-1}K^{-1}}$`, XR`$1.12\ \mathrm{J\,g^{-1}K^{-1}}$`, XR`$4.2\ \mathrm{J\,g^{-1}K^{-1}}$`],
    XR`Heat lost $=$ heat gained: $100\times c\times(100-25) = 200\times4.2\times(25-20)$. $7500c = 4200$, $c = 0.56$.`),
  xa(3, 'Zener diode', XR`A Zener diode is used as a voltage regulator in reverse bias.`, XR`In breakdown the voltage across a Zener diode stays nearly constant while the current through it changes widely.`, 0,
    XR`In breakdown the reverse $V$-$I$ curve is almost vertical: the voltage is fixed at the Zener voltage, so the load sees a steady voltage. R explains A.`),
  xt(3, 'half deflection', XR`In the half-deflection method the galvanometer resistance is $G = \dfrac{RS}{R-S}$.`, XR`The half-deflection method uses a shunt $S$ that reduces the deflection to half, with a large series resistance $R$ keeping the current nearly constant.`, 0,
    XR`With the shunt on, half the current goes through $S$ and half through $G$ (so $G = S$ would hold if the total current were unchanged). Allowing for the change of the total current gives $G = \dfrac{RS}{R-S}$. Both statements are true.`),
  xt(3, 'least count', XR`The least count of an instrument is the smallest value it can measure directly.`, XR`The accuracy of an instrument is the same as its precision.`, 2,
    XR`Statement I is true. Statement II is false: precision is the closeness of repeated readings; accuracy is the closeness to the true value. An instrument with a zero error can be precise but not accurate.`),
  xmatch(3, 'formulae', 'xm2', XR`Match each system in List I with its formula in List II.`, 'A-p, B-q, C-r, D-s',
    XR`Pendulum: $T = 2\pi\sqrt{L/g}$ (p). Spring-mass: $T = 2\pi\sqrt{m/k}$ (q). $L_2-L_1 = \lambda/2$, so $v = f\lambda = 2f(L_2-L_1)$ (r). First resonance: $L_1+e = \lambda/4$, so $f = \dfrac{v}{4(L_1+e)}$ (s).`),
  xmatch(3, 'errors', 'xm3', XR`Match each cause in List I with the type of error in List II.`, 'A-p, B-q, C-r, D-s',
    XR`A zero error shifts every reading the same way: systematic (p). Reaction-time variation changes from one reading to the next: random (q). A stretched scale is an instrumental fault (r). A misread scale is a personal blunder (s).`, { trap: 'A zero error is also an instrumental error, but its defining character is that it is systematic.' }),
  xi(3, 'resonance tube', XR`In a resonance-tube experiment with a 500 Hz fork, the first and second resonance lengths are 17 cm and 51 cm. The speed of sound, in m/s, is`, 2 * 500 * 0.34,
    XR`$\dfrac\lambda2 = L_2-L_1 = 34$ cm, so $\lambda = 68$ cm $=0.68$ m. $v = f\lambda = 500\times0.68 = 340$ m/s.`, { unit: 'm/s' }),
  xn(3, 'capillary', XR`Water rises 3.6 cm in a capillary of radius 0.40 mm. Find the surface tension, in N/m (angle of contact 0°, $\rho=1000$, $g = 9.8$).`, 0.4e-3 * 0.036 * 1000 * 9.8 / 2, 0.001, 4,
    XR`$T = \dfrac{rh\rho g}{2} = \dfrac{0.4\times10^{-3}\times0.036\times1000\times9.8}{2} = 0.0706$ N/m.`, { unit: 'N/m' }),
  xm(3, 'screw gauge', XR`With the jaws of a screw gauge (pitch 1 mm, 100 divisions) closed, the 4th division of the circular scale is below the reference line. A reading of 3.58 mm is observed for an object. The true reading is`, '3.62 mm', ['3.54 mm', '3.58 mm', '3.66 mm'],
    XR`Zero below the line: negative error of $-4\times0.01 = -0.04$ mm. True $=3.58-(-0.04) = 3.62$ mm.`),
  xi(3, 'sigfig', XR`How many significant figures are there in 0.050400?`, 5,
    XR`Leading zeros do not count. The digits 5, 0, 4, 0, 0 are significant (the zero between 5 and 4 is trapped, and the trailing zeros are after the decimal point). So 5.`),
  xn(3, 'prism', XR`A prism of angle $60^\circ$ shows a minimum deviation of $40^\circ$. Find its refractive index.`, Math.sin(50 * XPI / 180) / Math.sin(30 * XPI / 180), 0.005, 3,
    XR`$\mu = \dfrac{\sin\frac{A+\delta_m}{2}}{\sin\frac A2} = \dfrac{\sin50^\circ}{\sin30^\circ} = \dfrac{0.766}{0.5} = 1.532$.`),
  xi(3, 'metre bridge', XR`The unknown resistance $X$ is in the left gap of a metre bridge and a 12 $\Omega$ resistance in the right gap. The null point is 25 cm from the left end. $X$ in ohm is`, 12 * 25 / 75,
    XR`$\dfrac{X}{12} = \dfrac{l}{100-l} = \dfrac{25}{75}$, so $X = 4\ \Omega$.`, { unit: 'Ω' }),
  xi(3, 'sigfig', XR`The product $2.50\times1.2$ is to be reported with the right number of significant figures. How many does the result have?`, 2,
    XR`The product has as many significant figures as the factor with the fewest: 1.2 has 2. $2.50\times1.2 = 3.0$ (2 s.f.).`),
  xmatch(3, 'significant figures', 'xm8', XR`Match each number in List I with its number of significant figures in List II.`, 'A-q, B-r, C-p, D-s',
    XR`Leading zeros never count; trailing zeros after a decimal point do. 0.0420: digits 4, 2, 0 give 3 (q). 5.000: 4 (r). 0.0050: digits 5, 0 give 2 (p). 0.050400: digits 5, 0, 4, 0, 0 give 5 (s).`),
);

// ---------- L4 ----------
items.push(
  xi(4, 'errors', XR`Young's modulus is found from $Y = \dfrac{4MgL}{\pi d^2\Delta L}$. The errors in $M$, $d$ and $\Delta L$ are 1%, 1% and 1%; the error in $L$ is negligible. The maximum percentage error in $Y$ is`, 1 + 2 * 1 + 1,
    XR`$\dfrac{\Delta Y}{Y} = \dfrac{\Delta M}{M}+2\dfrac{\Delta d}{d}+\dfrac{\Delta(\Delta L)}{\Delta L} = 1+2+1 = 4\%$. The diameter appears squared.`, { unit: '%', trap: 'The diameter\'s error counts twice.' }),
  xi(4, 'errors', XR`The density of a cylinder is $\rho = \dfrac{m}{\pi r^2h}$. The errors in $m$, $r$ and $h$ are 2%, 1% and 3%. The maximum percentage error in $\rho$ is`, 2 + 2 * 1 + 3,
    XR`$\dfrac{\Delta\rho}{\rho} = \dfrac{\Delta m}{m}+2\dfrac{\Delta r}{r}+\dfrac{\Delta h}{h} = 2+2+3 = 7\%$. Errors always add, even in a quotient.`, { unit: '%' }),
  xn(4, 'errors', XR`A stopwatch with a least count of 0.1 s times 100 oscillations of a pendulum as 200.0 s. The percentage error in the period is`, 0.1 / 200 * 100, 0.005, 3,
    XR`$\dfrac{\Delta t}{t} = \dfrac{0.1}{200} = 0.05\%$. The error in $T = t/100$ has the same relative size. Timing many oscillations cuts the relative error.`, { unit: '%' }),
  xi(4, 'resonance tube', XR`In a resonance-tube experiment the first and second resonances occur at 16 cm and 52 cm. The end correction, in cm, is`, (52 - 3 * 16) / 2,
    XR`$\lambda/2 = 52-16 = 36$ cm, so $\lambda = 72$ cm. First resonance: $L_1+e = \lambda/4 = 18$ cm, so $e = 18-16 = 2$ cm.`, { unit: 'cm', trap: 'The first resonance length is not $\\lambda/4$ exactly; the open end acts as if the tube were longer by $e$.' }),
  xi(4, 'lens', XR`An object and a screen are 100 cm apart. A convex lens gives sharp images at two positions 20 cm apart. The focal length, in cm, is`, (100 * 100 - 20 * 20) / (4 * 100),
    XR`$f = \dfrac{D^2-d^2}{4D} = \dfrac{10000-400}{400} = 24$ cm.`, { unit: 'cm' }),
  xn(4, 'pendulum graph', XR`A graph of $T^2$ against $L$ passes through (0.25 m, 1.00 s$^2$) and (1.00 m, 4.00 s$^2$). Find $g$ from its slope, in $\mathrm{m\,s^{-2}}$.`, 4 * XPI * XPI / ((4 - 1) / (1 - 0.25)), 0.03, 2,
    XR`Slope $=\dfrac{4.00-1.00}{1.00-0.25} = 4.0\ \mathrm{s^2\,m^{-1}}$. Since $T^2 = \dfrac{4\pi^2}{g}L$, $g = \dfrac{4\pi^2}{4.0} = 9.87\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  xn(4, 'prism', XR`A glass prism of angle $60^\circ$ and refractive index 1.5 is used at minimum deviation. Find the minimum deviation, in degrees.`, 2 * Math.asin(1.5 * Math.sin(XPI / 6)) * 180 / XPI - 60, 0.2, 1,
    XR`At minimum deviation $r = A/2 = 30^\circ$. $\sin i = 1.5\sin30^\circ = 0.75$, $i = 48.6^\circ$. $\delta_m = 2i-A = 97.2-60 = 37.2^\circ$.`, { unit: '°' }),
  xn(4, 'Zener diode', XR`A 12 V supply feeds a 5.1 V Zener diode through a series resistor of $200\ \Omega$. A load of $510\ \Omega$ is connected across the diode. Find the current through the Zener diode, in mA.`, ((12 - 5.1) / 200 - 5.1 / 510) * 1e3, 0.1, 1,
    XR`Total current $=\dfrac{12-5.1}{200} = 34.5$ mA. Load current $=\dfrac{5.1}{510} = 10$ mA. Zener current $=34.5-10 = 24.5$ mA.`, { unit: 'mA' }),
  xs(4, 'simple pendulum', XR`Choose the correct statements for the simple pendulum experiment.`,
    [XR`The amplitude should be small.`, XR`A small, heavy, dense bob is better than a large light one.`, XR`If the length is measured to the centre of the bob, the $T^2$-$L$ graph passes through the origin.`, XR`A larger amplitude gives a shorter period.`],
    [0, 1, 2],
    XR`The formula needs small angles; a small dense bob keeps the effective length well defined and air drag small. With $L$ to the centre of mass, $T^2 = \dfrac{4\pi^2}{g}L$ passes through the origin. For larger amplitudes the period becomes longer (D false).`),
  xs(4, 'metre bridge', XR`Choose the correct statements about the metre bridge.`,
    [XR`The percentage error in $X$ is least when the null point is near the middle.`, XR`Thick copper strips are used to keep the connection resistance small.`, XR`Interchanging the known and unknown resistances and averaging removes the effect of end corrections.`, XR`An AC source is used so that the wire does not heat.`],
    [0, 1, 2],
    XR`A DC source and a galvanometer are used (AC would not give a clean null with a galvanometer; heating is avoided by short key presses, D false).`),
  xs(4, 'errors', XR`Choose the correct statements.`,
    [XR`Random errors can be reduced by taking the mean of many readings.`, XR`A zero error is a systematic error.`, XR`The least count limits the precision of a single reading.`, XR`Taking more readings reduces systematic errors.`],
    [0, 1, 2],
    XR`Systematic errors push every reading the same way, so averaging does not remove them; they must be corrected by calibration or a zero correction (D false).`),
  xs(4, 'screw gauge', XR`Choose the correct statements about a screw gauge.`,
    [XR`A positive zero error is subtracted from the observed reading.`, XR`The screw should be turned only in one direction when measuring, to avoid backlash.`, XR`The ratchet prevents too much pressure on the object.`, XR`The pitch of the screw equals its least count.`],
    [0, 1, 2],
    XR`The least count is the pitch divided by the number of circular divisions (D false).`),
  xs(4, 'Zener diode', XR`Choose the correct statements about a Zener regulator circuit.`,
    [XR`The Zener diode is reverse biased.`, XR`A series resistor limits the current.`, XR`The voltage across the Zener is nearly constant in breakdown.`, XR`The Zener diode is forward biased for regulation.`],
    [0, 1, 2],
    XR`In forward bias the diode conducts at about 0.7 V, which gives no regulation at the Zener voltage (D false).`),
  xa(4, 'metre bridge', XR`The percentage error in measuring an unknown resistance with a metre bridge is least when the null point is at the middle of the wire.`, XR`The fractional error in $X$ is $\dfrac{\Delta l}{l(100-l)}\times100$ for a given $\Delta l$, and $l(100-l)$ is greatest at $l=50$.`, 0,
    XR`$X = R\dfrac{100-l}{l}$ (or its reciprocal), so $\dfrac{\Delta X}{X} = \dfrac{100\,\Delta l}{l(100-l)}$, smallest when $l(100-l)$ is greatest. R explains A.`),
  xa(4, 'parallax', XR`Parallax error is avoided by keeping the eye vertically above the mark being read.`, XR`Parallax arises from the apparent shift of an object's position when viewed from different directions.`, 0,
    XR`Reading from the side shifts the pointer against the scale. Viewing along the normal removes the shift. R explains A.`),
  xt(4, 'pendulum', XR`A longer simple pendulum gives a smaller relative error in $g$ for the same stopwatch error.`, XR`Timing 50 oscillations instead of 10 reduces the relative error in the period.`, 0,
    XR`For the same absolute error $\Delta t$, a longer pendulum has a longer period, so $\Delta T/T$ is smaller. Timing more oscillations does the same. Both are true.`),
  xt(4, 'diode', XR`The forward-bias characteristic of a $p$-$n$ junction diode is a straight line.`, XR`A $p$-$n$ junction diode obeys Ohm's law.`, 1,
    XR`The forward current rises exponentially with voltage after the knee, not linearly. The diode is non-ohmic. Both statements are false.`),
  xm(4, 'young', XR`In Searle's experiment a wire of diameter measured as $0.80\pm0.01$ mm is used with all other quantities exact. The percentage error in $Y$ due to the diameter alone is`, '2.5%', ['1.25%', '0.5%', '5%'],
    XR`$\dfrac{\Delta d}{d} = \dfrac{0.01}{0.80} = 1.25\%$. $Y\propto\dfrac{1}{d^2}$, so $\dfrac{\Delta Y}{Y} = 2\times1.25\% = 2.5\%$.`),
  xm(4, 'specific heat', XR`In a mixtures experiment a student forgets the heat taken by the calorimeter. The computed specific heat of the hot metal block is`, 'smaller than the true value', ['larger than the true value', 'the same', 'zero'],
    XR`The hot block gives heat $mc\Delta T$ to the water and the calorimeter. Counting only the water's share, the heat attributed to the block is too small, so $c$ comes out too small.`),
  xmatch(4, 'error propagation', 'xm4', XR`Match each expression in List I with the maximum percentage error in List II.`, 'A-p, B-q, C-r, D-s',
    XR`A: $1+2\times1 = 3\%$ (p). B: $2+2\times1+2 = 6\%$ (q). C: $2+3 = 5\%$ (r). D: $T\propto L^{1/2}g^{-1/2}$, so each error gets the power $\tfrac12$: $\tfrac12\times4+\tfrac12\times4 = 4\%$ (s).`),
);

// ---------- L5 ----------
items.push(
  xs(5, 'Young\'s modulus', XR`Choose the correct statements about Searle's method for Young's modulus.`,
    [XR`$Y = \dfrac{MgL}{\pi r^2\Delta L}$.`, XR`The error in the diameter contributes twice its percentage to the error in $Y$.`, XR`Loading and unloading readings can differ (elastic after-effect).`, XR`A thicker wire is better because it extends more under the same load.`],
    [0, 1, 2],
    XR`A thicker wire extends less (the extension $\propto1/r^2$), making $\Delta L$ harder to measure accurately (D false).`),
  xs(5, 'prism', XR`Choose the correct statements about the prism experiment.`,
    [XR`At minimum deviation the ray inside the prism is parallel to its base.`, XR`At minimum deviation the angle of incidence equals the angle of emergence.`, XR`The graph of deviation against angle of incidence is a curve with a single minimum.`, XR`The deviation is least when the angle of incidence is the smallest possible.`],
    [0, 1, 2],
    XR`The minimum occurs at $i=e$, with the internal ray symmetric (parallel to the base). The minimum is in the middle of the curve, not at the smallest incidence (D false).`),
  xs(5, 'lens', XR`Choose the correct statements for experiments on a convex lens.`,
    [XR`The graph of $1/v$ against $1/u$ is a straight line.`, XR`Its intercept on the $1/v$ axis gives $1/f$.`, XR`In the displacement method, $f = \dfrac{D^2-d^2}{4D}$.`, XR`The displacement method works for any separation $D$ between object and screen.`],
    [0, 1, 2],
    XR`From $\dfrac1v-\dfrac1u = \dfrac1f$, the plot is a straight line with intercept $\dfrac1f$. The displacement method needs $D>4f$ for two positions to exist (D false).`),
  xs(5, 'half deflection', XR`Choose the correct statements about the half-deflection method for galvanometer resistance.`,
    [XR`$G = \dfrac{RS}{R-S}$.`, XR`The series resistance $R$ should be large so the circuit current is nearly unchanged when the shunt is added.`, XR`The shunt $S$ is connected in parallel with the galvanometer.`, XR`The shunt is connected in series with the galvanometer.`],
    [0, 1, 2],
    XR`A shunt is parallel; with a large $R$, the total current is nearly the same with and without $S$. The series option is wrong (D false).`),
  xs(5, 'specific heat', XR`Choose the correct statements about finding a specific heat by mixtures.`,
    [XR`Heat lost by the hot body equals heat gained by the water and calorimeter.`, XR`The calorimeter's water equivalent must be included.`, XR`Stirring helps to give a uniform temperature.`, XR`The heat capacity of the calorimeter can always be ignored.`],
    [0, 1, 2],
    XR`For small water masses the calorimeter's heat capacity is not negligible (D false).`),
  xm(5, 'metre bridge', XR`In a metre bridge a student uses a resistance box in the left gap, but the resistance of the connecting strips on the right is not negligible and is $0.5\ \Omega$ in series with the unknown. The null point for the box at $10\ \Omega$ is 50 cm. The unknown resistance (without the strip) is`, '9.5 $\\Omega$', ['10 $\\Omega$', '10.5 $\\Omega$', '5 $\\Omega$'],
    XR`At the null point the left resistance equals the right resistance, so the total on the right $=10\ \Omega$. The strip takes $0.5\ \Omega$, so the unknown is $10-0.5 = 9.5\ \Omega$.`, { trap: 'An extra series resistance in the gap must be subtracted.' }),
  xm(5, 'significant figures', XR`The length and breadth of a plate are $12.5$ cm and $4.20$ cm. Its area, written with the correct number of significant figures, is`, XR`$52.5\ \mathrm{cm^2}$`, [XR`$52.50\ \mathrm{cm^2}$`, XR`$52\ \mathrm{cm^2}$`, XR`$52.5000\ \mathrm{cm^2}$`],
    XR`$12.5\times4.20 = 52.5$. Both factors have three significant figures, so the answer has three: 52.5.`),
  xm(5, 'errors', XR`Length is $L = 25.0\pm0.1$ cm and breadth $b = 12.0\pm0.1$ cm. The perimeter of the rectangle is`, XR`$74.0\pm0.4$ cm`, [XR`$74.0\pm0.2$ cm`, XR`$74.0\pm0.1$ cm`, XR`$74.0\pm0.8$ cm`],
    XR`Perimeter $=2(L+b) = 74.0$ cm. Absolute errors add: $2(0.1+0.1) = 0.4$ cm.`, { trap: 'The factor 2 multiplies the error too.' }),
  xa(5, 'backlash', XR`Backlash error in a screw gauge is avoided by turning the screw in one direction only.`, XR`Backlash arises from the play between the screw and the nut when the direction of rotation is reversed.`, 0,
    XR`When the rotation is reversed, the screw first turns through the slack before it moves, giving a false reading. R explains A.`),
  xa(5, 'zero error', XR`The zero error of a screw gauge is a random error.`, XR`The zero error changes randomly each time the jaws are closed.`, 1,
    XR`The zero error is the same every time the jaws are closed (for a given instrument), so it is a systematic error. Both A and R are false.`),
  xt(5, 'precision and accuracy', XR`A set of readings can be precise but not accurate.`, XR`A zero error makes an instrument inaccurate but not necessarily imprecise.`, 0,
    XR`Repeated readings can cluster tightly (precise) around a wrong value (inaccurate) if a zero error shifts them all. Both are true.`),
  xmatch(5, 'optics experiments', 'xm7', XR`Match each experiment in List I with the relation in List II.`, 'A-p, B-q, C-r, D-s',
    XR`Prism: $\mu = \dfrac{\sin(A+\delta_m)/2}{\sin A/2}$ (p). Displacement method: $f = \dfrac{D^2-d^2}{4D}$ (q). Convex mirror with an auxiliary lens: the image is at the mirror's centre of curvature (r). $u$-$v$ method: $\dfrac1f = \dfrac1v-\dfrac1u$ (s).`),
  xmatch(5, 'graphs', 'xm5', XR`Match each graph in List I with its shape in List II.`, 'A-p, B-q, C-r, D-s',
    XR`$\dfrac1v = \dfrac1u+\dfrac1f$ is a straight line with intercept $\dfrac1f$ (p). Deviation against $i$ has a minimum (q). $T^2 = \dfrac{4\pi^2}{g}L$ is a straight line through the origin (r). A Zener in reverse breakdown has an almost vertical $V$-$I$ line (s).`),
  xmatch(5, 'electrical experiments', 'xm6', XR`Match each experiment in List I with the relation in List II.`, 'A-p, B-q, C-r, D-s',
    XR`Metre bridge: $R/X = l/(100-l)$ (p). Ohm's law: straight line through the origin (q). Half deflection: $G = \dfrac{RS}{R-S}$ (r). Zener regulator: constant voltage in breakdown (s).`),
);

// ---------- passages ----------
items.push(
  xn(3, 'young', XR`Find Young's modulus of the steel, in units of $10^{11}$ Pa.`, 2 * 9.8 * 2 / (XPI * 0.4e-3 ** 2 * 0.5e-3) / 1e11, 0.03, 2,
    XR`$Y = \dfrac{MgL}{\pi r^2\Delta L} = \dfrac{2.0\times9.8\times2.00}{\pi\times(0.40\times10^{-3})^2\times0.50\times10^{-3}} = 1.56\times10^{11}$ Pa.`, XPY({ group: 'xp1', unit: '×10¹¹ Pa' })),
  xi(4, 'errors', XR`The diameter has an error of 0.01 mm, the extension an error of 0.01 mm and the length an error of 1 mm. The percentage error in $Y$, to the nearest whole number, is (use $\Delta M/M$ negligible)`, Math.round(1 / 2000 * 100 + 2 * 0.01 / 0.8 * 100 + 0.01 / 0.5 * 100),
    XR`$\dfrac{\Delta L}{L} = \dfrac{1\ \mathrm{mm}}{2000\ \mathrm{mm}} = 0.05\%$. $2\dfrac{\Delta d}{d} = 2\times\dfrac{0.01}{0.80} = 2.5\%$. $\dfrac{\Delta(\Delta L)}{\Delta L} = \dfrac{0.01}{0.50} = 2\%$. Total $= 0.05+2.5+2 = 4.55\%\approx5\%$.`, XPY({ group: 'xp1', unit: '%' })),
  xm(5, 'errors', XR`Which measurement contributes the largest share of the error in $Y$, so should be improved first?`, 'the diameter of the wire (the screw gauge reading)', ['the length of the wire', 'the load', 'the value of $g$'],
    XR`The three contributions are 0.05% (length), 2.5% (diameter, counted twice) and 2% (extension). The diameter contributes the most, so improving its measurement helps most. Improving the length gains almost nothing.`, XPY({ group: 'xp1' })),
  xi(3, 'lens', XR`The magnification in the first position (the lens nearer the object) is $m_1 = v/u$. It is`, 60 / 30,
    XR`$f = \dfrac{D^2-d^2}{4D} = \dfrac{8100-900}{360} = 20$ cm. The two object distances are $\dfrac{D\mp d}{2} = 30$ cm and 60 cm. In the first (nearer) position $u = 30$ cm, $v = 90-30 = 60$ cm, so $m_1 = \dfrac{60}{30} = 2$.`, XPY({ group: 'xp2' })),
  xn(3, 'lens', XR`Find the focal length of the lens, in cm.`, (90 * 90 - 30 * 30) / (4 * 90), 0.1, 1,
    XR`$f = \dfrac{D^2-d^2}{4D} = \dfrac{90^2-30^2}{4\times90} = \dfrac{7200}{360} = 20$ cm.`, XPY({ group: 'xp2', unit: 'cm' })),
  xi(5, 'lens', XR`The two images have heights 8 mm and 2 mm. The height of the object, in mm, is`, Math.sqrt(8 * 2),
    XR`The magnifications at the two positions are $m_1 = 2$ and $m_2 = \dfrac12$ (their product is 1, as $m_1m_2 = \dfrac vu\cdot\dfrac uv = 1$). Image heights are $h_1 = m_1h_0$ and $h_2 = m_2h_0$, so $h_1h_2 = h_0^2$: $h_0 = \sqrt{8\times2} = 4$ mm.`, XPY({ group: 'xp2', unit: 'mm' })),
);

// ---------- templates ----------
gens.push(
  XG(21, 3, 'mcq', 'vernier', (rng) => {
    const v = int(rng, 0, 1);
    if (v === 0) { const msd = choose(rng, [0.5, 1]); const N = choose(rng, [10, 20, 25, 50]); const lc = msd / N; const o = numOpts(rng, lc, [msd / (N - 1), msd * (N - 1) / N, msd * N], 'mm', 3);
      return { v, msd, N, q: XR`In a vernier calliper 1 main-scale division is ${msd} mm and ${N} vernier divisions coincide with ${N - 1} main-scale divisions. The least count is`, options: o.options, answer: o.answer, sol: XR`$LC = \dfrac{1\ \mathrm{MSD}}{N} = \dfrac{${msd}}{${N}} = ${f3(lc)}$ mm.`, trap: 'The least count is the difference between one MSD and one VSD.' }; }
    const pitch = choose(rng, [0.5, 1]); const N = choose(rng, [50, 100]); const lc = pitch / N; const o = numOpts(rng, lc, [pitch * N, pitch / (N / 2), pitch / N * 10], 'mm', 3);
    return { v, pitch, N, msd: pitch, q: XR`A screw gauge has a pitch of ${pitch} mm and ${N} divisions on its circular scale. Its least count is`, options: o.options, answer: o.answer, sol: XR`$LC = \dfrac{\text{pitch}}{N} = \dfrac{${pitch}}{${N}} = ${f3(lc)}$ mm.` };
  }, (p) => { const lc = p.v === 0 ? p.msd / p.N : p.pitch / p.N; return p.options.findIndex((o) => o === `${f3(lc)} mm`); }),
  XG(22, 4, 'nat', 'pendulum', (rng) => {
    const L = choose(rng, [50, 80, 100, 120]); const n = choose(rng, [20, 30, 50]); const g0 = pick(rng, 9.6, 10, 0.1); const T = 2 * XPI * Math.sqrt(L / 100 / g0); const t = +(n * T).toFixed(1);
    const g = 4 * XPI * XPI * (L / 100) / ((t / n) ** 2);
    return { L, n, t, q: XR`A student times ${n} oscillations of a simple pendulum as ${t} s. The distance from the point of suspension to the centre of the bob is ${L} cm. Find $g$ from these readings, in $\mathrm{m\,s^{-2}}$.`, answer: +g.toFixed(3), tol: Math.max(0.02, g * 0.003), unit: 'm/s²',
      sol: XR`$T = \dfrac{${t}}{${n}} = ${f3(t / n)}$ s. $g = \dfrac{4\pi^2L}{T^2} = \dfrac{39.48\times${L / 100}}{${f3((t / n) ** 2)}} = ${f3(g)}\ \mathrm{m\,s^{-2}}$.` };
  }, (p) => { let a = 5, b = 15; for (let i = 0; i < 100; i++) { const m = (a + b) / 2; const Tm = 2 * XPI * Math.sqrt(p.L / 100 / m); if (Tm > p.t / p.n) a = m; else b = m; } return a; }),
  XG(23, 4, 'nat', 'errors', (rng) => {
    const v = int(rng, 0, 3); const a = pick(rng, 1, 3); const b = pick(rng, 1, 4); const c = pick(rng, 1, 3);
    const F = [
      { f: XR`$g = \dfrac{4\pi^2L}{T^2}$`, d: `$L$ ${a} %, $T$ ${b} %`, e: a + 2 * b, w: XR`$\dfrac{\Delta L}{L}+2\dfrac{\Delta T}{T}$` },
      { f: XR`$\rho = \dfrac{m}{\pi r^2h}$`, d: `$m$ ${a} %, $r$ ${b} %, $h$ ${c} %`, e: a + 2 * b + c, w: XR`$\dfrac{\Delta m}{m}+2\dfrac{\Delta r}{r}+\dfrac{\Delta h}{h}$` },
      { f: XR`$T = 2\pi\sqrt{\dfrac Lg}$`, d: `$L$ ${2 * a} %, $g$ ${2 * b} %`, e: a + b, w: XR`$\tfrac12\dfrac{\Delta L}{L}+\tfrac12\dfrac{\Delta g}{g}$` },
      { f: XR`$Y = \dfrac{4MgL}{\pi d^2\Delta L}$`, d: `$M$ ${a} %, $L$ ${b} %, $d$ ${c} %, $\\Delta L$ ${a + c} %`, e: a + b + 2 * c + (a + c), w: XR`$\dfrac{\Delta M}{M}+\dfrac{\Delta L}{L}+2\dfrac{\Delta d}{d}+\dfrac{\Delta(\Delta L)}{\Delta L}$` },
    ][v];
    return { v, a, b, c, q: XR`For ${F.f} the errors in the readings are: ${F.d}. Find the maximum percentage error in the result.`, answer: F.e, tol: 0.01, unit: '%',
      sol: XR`Maximum error $=${F.w} = ${F.e}\%$. Errors add, and each is multiplied by its power.` };
  }, (p) => [p.a + 2 * p.b, p.a + 2 * p.b + p.c, p.a + p.b, p.a + p.b + 2 * p.c + (p.a + p.c)][p.v]),
  XG(24, 3, 'mcq', 'metre bridge', (rng) => {
    const R = choose(rng, [2, 3, 4, 5, 6, 10, 12]); const l = choose(rng, [20, 25, 40, 60, 75]); const left = int(rng, 0, 1);
    const X = left ? R * (100 - l) / l : R * l / (100 - l);
    const o = numOpts(rng, X, [R * l / (100 - l) * (left ? 1 : 0) + R * (100 - l) / l * (left ? 0 : 1), R * l / 100, R * (100 - l) / 100, R], 'Ω', 3);
    return { R, l, left, q: XR`In a metre bridge the known resistance of ${R} $\Omega$ is in the ${left ? 'left' : 'right'} gap and the unknown resistance is in the ${left ? 'right' : 'left'} gap. The null point is ${l} cm from the left end. The unknown resistance is`, options: o.options, answer: o.answer, sol: XR`The resistances are in the ratio of the wire lengths of their gaps: ${left ? '$\\dfrac{R}{X} = \\dfrac{l}{100-l}$, so $X = R\\dfrac{100-l}{l}$' : '$\\dfrac{X}{R} = \\dfrac{l}{100-l}$, so $X = R\\dfrac{l}{100-l}$'}. $X = ${f3(X)}\\ \\Omega$.`, trap: 'The unknown is in the gap whose wire length goes with it.' };
  }, (p) => { const X = p.left ? p.R * (100 - p.l) / p.l : p.R * p.l / (100 - p.l); return p.options.findIndex((o) => o === `${f3(X)} Ω`); }),
  XG(25, 4, 'nat', 'young', (rng) => {
    const M = choose(rng, [1, 2, 3, 4]); const L = choose(rng, [1.5, 2, 2.5]); const d = choose(rng, [0.5, 0.6, 0.8, 1.0]) * 1e-3; const e = choose(rng, [0.3, 0.4, 0.5, 0.8]) * 1e-3;
    const Y = M * XG0 * L / (XPI * (d / 2) ** 2 * e) / 1e11;
    return { M, L, d, e, q: XR`In Searle's experiment a wire ${L} m long and ${d * 1e3} mm in diameter is stretched by ${e * 1e3} mm by a load of ${M} kg. Find Young's modulus, in $10^{11}$ Pa ($g=9.8$).`, answer: +Y.toFixed(3), tol: Math.max(0.02, Y * 0.01), unit: '×10¹¹ Pa',
      sol: XR`$Y = \dfrac{MgL}{\pi r^2\Delta L}$ with $r = d/2 = ${d * 500}$ mm. $Y = \dfrac{${M}\times9.8\times${L}}{\pi\times(${f3(d / 2)})^2\times${f3(e)}} = ${f3(Y)}\times10^{11}$ Pa.`, trap: 'Use the radius, not the diameter.' };
  }, (p) => { const A = XPI * p.d * p.d / 4; return p.M * XG0 / A * p.L / p.e / 1e11; }),
  XG(26, 4, 'nat', 'sound', (rng) => {
    const f = choose(rng, [256, 288, 320, 384, 512]); const v0 = pick(rng, 330, 345, 5); const e0 = choose(rng, [0.5, 1, 1.5, 2]) / 100;
    const lam = v0 / f; const L1 = lam / 4 - e0; const L2 = 3 * lam / 4 - e0;
    return { f, v0, e0, q: XR`In a resonance-tube experiment with a ${f} Hz fork the first resonance is at ${f3(L1 * 100)} cm and the second at ${f3(L2 * 100)} cm. Find the end correction, in cm.`, answer: +(e0 * 100).toFixed(3), tol: 0.02, unit: 'cm',
      sol: XR`$\lambda/2 = L_2-L_1 = ${f3((L2 - L1) * 100)}$ cm, so $\lambda/4 = ${f3(lam / 4 * 100)}$ cm. $e = \dfrac\lambda4-L_1 = ${f3(lam / 4 * 100)}-${f3(L1 * 100)} = ${f3(e0 * 100)}$ cm. (The speed of sound is $2f(L_2-L_1) = ${f3(v0)}$ m/s.)` };
  }, (p) => { const lam = p.v0 / p.f; const L1 = lam / 4 - p.e0; const L2 = 3 * lam / 4 - p.e0; return ((L2 - 3 * L1) / 2) * 100; }),
  XG(27, 4, 'nat', 'prism', (rng) => {
    const A = choose(rng, [30, 45, 60]); const mu = pick(rng, 1.4, 1.7, 0.05);
    if (Math.abs(mu * Math.sin(A * XPI / 360)) >= 1) return XGsafe();
    const dm = 2 * Math.asin(mu * Math.sin(A * XPI / 360)) * 180 / XPI - A;
    return { A, mu, q: XR`A prism of angle ${A}° and refractive index ${mu} is used at minimum deviation. Find the minimum deviation, in degrees.`, answer: +dm.toFixed(2), tol: Math.max(0.1, dm * 0.01), unit: '°',
      sol: XR`At minimum deviation $r = A/2$. $\sin\dfrac{A+\delta_m}{2} = \mu\sin\dfrac A2 = ${f3(mu * Math.sin(A * XPI / 360))}$, so $\dfrac{A+\delta_m}{2} = ${f3(Math.asin(mu * Math.sin(A * XPI / 360)) * 180 / XPI)}^\circ$ and $\delta_m = ${f3(dm)}^\circ$.` };
    function XGsafe() { const A2 = 30; const dm2 = 2 * Math.asin(mu * Math.sin(A2 * XPI / 360)) * 180 / XPI - A2; return { A: A2, mu, q: XR`A prism of angle ${A2}° and refractive index ${mu} is used at minimum deviation. Find the minimum deviation, in degrees.`, answer: +dm2.toFixed(2), tol: Math.max(0.1, dm2 * 0.01), unit: '°', sol: XR`$\sin\dfrac{A+\delta_m}{2} = \mu\sin\dfrac A2$, giving $\delta_m = ${f3(dm2)}^\circ$.` }; }
  }, (p) => { const half = Math.asin(Math.sin((p.A) * XPI / 360) * p.mu); return (2 * half - p.A * XPI / 180) * 180 / XPI; }),
  XG(28, 4, 'nat', 'lens', (rng) => {
    const f = choose(rng, [10, 12, 15, 20, 25]); const k = choose(rng, [4.5, 5, 6, 8]); const D = f * k; const d = Math.sqrt(D * D - 4 * D * f);
    return { f, k, D, q: XR`An object and a screen are ${f3(D)} cm apart. A convex lens gives sharp images in two positions separated by ${f3(d)} cm. Find the focal length, in cm.`, answer: +f.toFixed(2), tol: Math.max(0.05, f * 0.005), unit: 'cm',
      sol: XR`$f = \dfrac{D^2-d^2}{4D} = \dfrac{${f3(D * D)}-${f3(d * d)}}{4\times${f3(D)}} = ${f3(f)}$ cm.` };
  }, (p) => { const d = Math.sqrt(p.D * p.D - 4 * p.D * p.f); return (p.D * p.D - d * d) / (4 * p.D); }),
  XG(29, 3, 'mcq', 'screw gauge', (rng) => {
    const N = choose(rng, [50, 100]); const pitch = N === 100 ? 1 : 0.5; const lc = pitch / N; const msr = pick(rng, 1, 6, 0.5); const cs = int(rng, 10, N - 5); const ze = choose(rng, [-4, -3, -2, 2, 3, 4]);
    const obs = msr + cs * lc; const tr = obs - ze * lc;
    const o = numOpts(rng, tr, [obs + ze * lc, obs, obs - 2 * ze * lc], 'mm', 4);
    return { N, pitch, msr, cs, ze, q: XR`A screw gauge has a pitch of ${pitch} mm and ${N} divisions. The zero error is ${ze > 0 ? '+' : '−'}${Math.abs(ze)} divisions (${ze > 0 ? 'the zero of the circular scale is above the reference line' : 'the zero of the circular scale is below the reference line'}). An object gives a main-scale reading of ${msr} mm and a circular-scale reading of ${cs}. The true reading is`, options: o.options, answer: o.answer,
      sol: XR`$LC = ${lc}$ mm. Observed $= ${msr}+${cs}\times${lc} = ${f3(obs)}$ mm. Zero error $= ${ze > 0 ? '+' : '-'}${Math.abs(ze) * lc}$ mm. True $=$ observed $-$ zero error $= ${f3(tr)}$ mm.`, trap: 'Subtract the zero error with its sign.' };
  }, (p) => { const lc = p.pitch / p.N; const tr = p.msr + p.cs * lc - p.ze * lc; return p.options.findIndex((o) => o === `${fmt(tr, 4)} mm`); }),
  XG(30, 5, 'nat', 'zener', (rng) => {
    const Vs = choose(rng, [9, 12, 15]); const Vz = choose(rng, [3.3, 5.1, 6.2]); const Rs = choose(rng, [100, 150, 200, 300]); const RL = choose(rng, [330, 510, 620, 1000]);
    const Iz = ((Vs - Vz) / Rs - Vz / RL) * 1e3;
    if (Iz <= 1) return { Vs, Vz, Rs, RL, q: XR`A ${Vs} V supply feeds a ${Vz} V Zener diode through ${Rs} $\Omega$, with a ${RL} $\Omega$ load across the Zener. Find the Zener current, in mA, if it is still in breakdown, or give 0 if it stops regulating.`, answer: 0, tol: 0.05, unit: 'mA', sol: XR`Supply current $=\dfrac{${Vs}-${Vz}}{${Rs}} = ${f3((Vs - Vz) / Rs * 1e3)}$ mA, load current $=\dfrac{${Vz}}{${RL}} = ${f3(Vz / RL * 1e3)}$ mA. Nothing is left for the Zener, so it does not regulate: 0.` };
    return { Vs, Vz, Rs, RL, q: XR`A ${Vs} V supply feeds a ${Vz} V Zener diode through ${Rs} $\Omega$, with a ${RL} $\Omega$ load across the Zener. Find the Zener current, in mA, if it is still in breakdown, or give 0 if it stops regulating.`, answer: +Iz.toFixed(2), tol: Math.max(0.05, Iz * 0.01), unit: 'mA',
      sol: XR`Supply current $=\dfrac{${Vs}-${Vz}}{${Rs}} = ${f3((Vs - Vz) / Rs * 1e3)}$ mA. Load current $=\dfrac{${Vz}}{${RL}} = ${f3(Vz / RL * 1e3)}$ mA. Zener current $=${f3(Iz)}$ mA.` };
  }, (p) => { const I = (p.Vs - p.Vz) / p.Rs; const IL = p.Vz / p.RL; return I - IL <= 1e-3 ? 0 : (I - IL) * 1e3; }),
  XG(31, 4, 'nat', 'specific heat', (rng) => {
    const mw = choose(rng, [100, 150, 200]); const mb = choose(rng, [50, 100, 150]); const Tb = choose(rng, [90, 100]); const Tw = choose(rng, [15, 20, 25]); const Tf = Tw + choose(rng, [3, 4, 5, 6]);
    const c = mw * 4.2 * (Tf - Tw) / (mb * (Tb - Tf));
    return { mw, mb, Tb, Tw, Tf, q: XR`${mb} g of a metal at ${Tb} °C is dropped into ${mw} g of water at ${Tw} °C (calorimeter ignored; $c_w = 4.2\ \mathrm{J\,g^{-1}K^{-1}}$). The final temperature is ${Tf} °C. Find the specific heat of the metal, in $\mathrm{J\,g^{-1}K^{-1}}$.`, answer: +c.toFixed(3), tol: Math.max(0.005, c * 0.01), unit: 'J/(g K)',
      sol: XR`${mb}$\times c\times(${Tb}-${Tf}) = ${mw}\times4.2\times(${Tf}-${Tw})$, so $c = ${f3(c)}$.` };
  }, (p) => p.mw * 4.2 * (p.Tf - p.Tw) / (p.mb * (p.Tb - p.Tf))),
  XG(32, 5, 'nat', 'galvanometer', (rng) => {
    const G = choose(rng, [20, 50, 100, 200]); const Rr = choose(rng, [2000, 5000, 10000]); const S = G * Rr / (Rr + G);
    return { G, Rr, q: XR`In the half-deflection method a galvanometer of resistance $G$ is in series with $R = ${Rr}\ \Omega$. A shunt $S = ${f3(S)}\ \Omega$ halves the deflection. Using the exact formula $G = \dfrac{RS}{R-S}$, find $G$, in ohm.`, answer: +G.toFixed(2), tol: Math.max(0.05, G * 0.005), unit: 'Ω',
      sol: XR`$G = \dfrac{RS}{R-S} = \dfrac{${Rr}\times${f3(S)}}{${Rr}-${f3(S)}} = ${f3(G)}\ \Omega$. (If $R\gg G$, $G\approx S$.)` };
  }, (p) => { const S = p.G * p.Rr / (p.Rr + p.G); return p.Rr * S / (p.Rr - S); }),
);

}

export default { topic: 'experimental-physics', groups, items, gens };
