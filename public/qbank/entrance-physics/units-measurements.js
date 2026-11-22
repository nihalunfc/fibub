// Units, dimensions and errors: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EX = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
let k = 0; let c = 0;
const nid = () => `um-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: EX[level], sub, ...o });
/** single-answer MCQ: the correct option is put at a rotating position so answers spread over A-D */
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
  mcq(1, 'SI units', r`Which of the following is <b>not</b> an SI base unit?`, 'newton', ['kelvin', 'mole', 'candela'],
    r`The seven SI base units are metre, kilogram, second, ampere, kelvin, mole and candela. Kelvin, mole and candela are base units. The newton is a derived unit: $1\ \mathrm{N} = 1\ \mathrm{kg\,m\,s^{-2}}$.`),
  mcq(1, 'dimensions', r`The dimensional formula of force is`, r`$[MLT^{-2}]$`, [r`$[ML^{2}T^{-2}]$`, r`$[MLT^{-1}]$`, r`$[ML^{-1}T^{-2}]$`],
    r`Force = mass × acceleration. Mass is $[M]$ and acceleration is $[LT^{-2}]$, so force is $[MLT^{-2}]$. $[ML^2T^{-2}]$ is energy, $[MLT^{-1}]$ is momentum and $[ML^{-1}T^{-2}]$ is pressure.`),
  mcq(1, 'dimensions', r`Power has the dimensional formula`, r`$[ML^{2}T^{-3}]$`, [r`$[ML^{2}T^{-2}]$`, r`$[MLT^{-3}]$`, r`$[ML^{-1}T^{-3}]$`],
    r`Power = work / time = $[ML^2T^{-2}]/[T] = [ML^2T^{-3}]$.`),
  nat(1, 'unit conversion', r`Convert a speed of $36\ \mathrm{km\,h^{-1}}$ into $\mathrm{m\,s^{-1}}$.`, 10, 0,
    r`Multiply km/h by $\frac{1000}{3600} = \frac{5}{18}$. So $36 \times \frac{5}{18} = 10$ m/s.`, { unit: 'm/s' }),
  nat(1, 'significant figures', r`How many significant figures are there in the measurement $0.00450\ \mathrm{m}$?`, 3, 0,
    r`Leading zeros only show the decimal place, so they do not count. The digits 4, 5 and the trailing 0 after the decimal point all count. That gives 3 significant figures.`),
  mcq(1, 'SI units', r`One light year is about`, r`$9.46\times10^{15}$ m`, [r`$3\times10^{8}$ m`, r`$9.46\times10^{12}$ m`, r`$3.15\times10^{7}$ m`],
    r`A light year is the distance light travels in one year: $3\times10^{8}\ \mathrm{m/s} \times 3.15\times10^{7}\ \mathrm{s} \approx 9.46\times10^{15}$ m. $3\times10^{8}$ is the speed of light, and $3.15\times10^{7}$ is the number of seconds in a year.`),
  mcq(1, 'dimensions', r`Angular momentum has dimensions`, r`$[ML^{2}T^{-1}]$`, [r`$[MLT^{-1}]$`, r`$[ML^{2}T^{-2}]$`, r`$[ML^{2}T^{-3}]$`],
    r`Angular momentum $L = mvr$: $[M][LT^{-1}][L] = [ML^2T^{-1}]$.`),
  mcq(1, 'errors', r`A student measures a length as $10.2$ cm. The true value is $10.0$ cm. The absolute error is`, '0.2 cm', ['2 cm', '2 %', '0.02 cm'],
    r`Absolute error = |measured − true| = $|10.2-10.0| = 0.2$ cm. The relative error would be $0.2/10.0 = 0.02$, which is 2 %.`),
  mcq(1, 'least count', r`The least count of an ordinary metre scale marked in millimetres is`, '1 mm', ['1 cm', '0.1 mm', '1 m'],
    r`The least count is the smallest division the instrument can read. A scale marked in millimetres reads to 1 mm.`),
  mcq(1, 'dimensions', r`Which of these physical quantities is dimensionless?`, 'Refractive index', ['Surface tension', 'Frequency', 'Angular velocity'],
    r`Refractive index is a ratio of two speeds, so it has no dimensions. Surface tension is $[MT^{-2}]$, and frequency and angular velocity are both $[T^{-1}]$.`),

  // ---------- Level 2 ----------
  mcq(2, 'dimensions', r`The dimensional formula of Planck's constant $h$ (from $E = h\nu$) is`, r`$[ML^{2}T^{-1}]$`, [r`$[ML^{2}T^{-2}]$`, r`$[MLT^{-1}]$`, r`$[ML^{2}T]$`],
    r`$h = E/\nu = [ML^2T^{-2}]/[T^{-1}] = [ML^2T^{-1}]$. This is the same as angular momentum.`),
  mcq(2, 'dimensions', r`The gravitational constant $G$ in $F = Gm_1m_2/r^2$ has dimensions`, r`$[M^{-1}L^{3}T^{-2}]$`, [r`$[ML^{3}T^{-2}]$`, r`$[M^{-1}L^{2}T^{-2}]$`, r`$[M^{-2}L^{3}T^{-2}]$`],
    r`$G = Fr^2/(m_1m_2) = [MLT^{-2}][L^2]/[M^2] = [M^{-1}L^{3}T^{-2}]$.`),
  mcq(2, 'dimensional analysis', r`Which pair of quantities has the same dimensions?`, 'Work and torque', ['Force and impulse', 'Pressure and force', 'Momentum and energy'],
    r`Work and torque are both $[ML^2T^{-2}]$. Force is $[MLT^{-2}]$ but impulse is $[MLT^{-1}]$. Pressure is force per area. Momentum is $[MLT^{-1}]$ and energy is $[ML^2T^{-2}]$.`,
    { trap: 'Same dimensions do not mean the same physical quantity: work is a scalar and torque is a vector.' }),
  mcq(2, 'dimensions', r`The coefficient of viscosity $\eta$ has dimensions`, r`$[ML^{-1}T^{-1}]$`, [r`$[MLT^{-1}]$`, r`$[ML^{-1}T^{-2}]$`, r`$[ML^{2}T^{-1}]$`],
    r`From $F = 6\pi\eta r v$: $\eta = F/(rv) = [MLT^{-2}]/([L][LT^{-1}]) = [ML^{-1}T^{-1}]$.`),
  nat(2, 'unit conversion', r`$1\ \mathrm{N} = 10^{x}$ dyne. Find $x$.`, 5, 0,
    r`$1\ \mathrm{N} = 1\ \mathrm{kg\,m\,s^{-2}} = 1000\ \mathrm{g} \times 100\ \mathrm{cm}\ \mathrm{s^{-2}} = 10^{5}\ \mathrm{g\,cm\,s^{-2}}$. One dyne is $1\ \mathrm{g\,cm\,s^{-2}}$. So $x = 5$.`),
  nat(2, 'unit conversion', r`Express $g = 9.8\ \mathrm{m\,s^{-2}}$ in $\mathrm{km\,h^{-2}}$.`, 127008, 5,
    r`$1\ \mathrm{m} = 10^{-3}$ km and $1\ \mathrm{s} = 1/3600$ h, so $1\ \mathrm{s^{-2}} = 3600^2\ \mathrm{h^{-2}} = 1.296\times10^{7}\ \mathrm{h^{-2}}$. Then $9.8\times10^{-3}\times1.296\times10^{7} = 127008$.`, { unit: 'km/h²', trap: 'The time conversion factor is squared, since time appears squared.' }),
  mcq(2, 'dimensional analysis', r`The ratio of the electric field to the magnetic field, $E/B$, has the dimensions of`, 'velocity', ['acceleration', 'force', 'time'],
    r`The Lorentz force gives $qE$ and $qvB$ the same dimensions, so $E = vB$ in dimensions. Hence $E/B$ has dimensions of velocity.`),
  mcq(2, 'errors', r`$A = (5.0\pm0.1)$ and $B = (3.0\pm0.2)$. The sum $A + B$ is`, r`$8.0 \pm 0.3$`, [r`$8.0 \pm 0.1$`, r`$8.0 \pm 0.2$`, r`$8.0 \pm 0.05$`],
    r`In a sum, absolute errors add: $0.1 + 0.2 = 0.3$.`),
  nat(2, 'errors', r`$z = ab$. The percentage errors in $a$ and $b$ are $2\%$ and $3\%$. What is the maximum percentage error in $z$?`, 5, 0,
    r`For a product, relative errors add: $2\% + 3\% = 5\%$.`),
  nat(2, 'errors', r`$x = a^{3}/b^{2}$. The percentage error in $a$ is $1\%$ and in $b$ is $2\%$. Find the maximum percentage error in $x$.`, 7, 0,
    r`Powers multiply the relative error, and for a quotient the errors still add: $3\times1 + 2\times2 = 7\%$.`,
    { trap: 'The error in a quotient is not the difference of errors.' }),
  nat(2, 'least count', r`In a vernier caliper, 1 main scale division (MSD) is 1 mm and 10 vernier divisions equal 9 MSD. Find the least count in cm.`, 0.01, 0.0001,
    r`Least count = 1 MSD − 1 VSD. 10 VSD = 9 MSD gives 1 VSD = 0.9 mm. So LC = $1 - 0.9 = 0.1$ mm $= 0.01$ cm.`, { unit: 'cm' }),
  mcq(2, 'least count', r`A vernier scale has 10 divisions equal to 9 divisions of a main scale whose division is 0.5 mm. The least count is`, '0.05 mm', ['0.5 mm', '0.1 mm', '0.45 mm'],
    r`LC = (value of 1 MSD)/(number of vernier divisions) = $0.5/10 = 0.05$ mm. The 0.45 mm is the length of one vernier division, not the least count.`),
  mcq(2, 'least count', r`A screw gauge has pitch 1 mm and 100 divisions on the circular scale. Its least count is`, '0.01 mm', ['0.1 mm', '1 mm', '0.001 mm'],
    r`LC = pitch / number of circular divisions = $1/100 = 0.01$ mm.`),
  mcq(2, 'significant figures', r`Add $2.50$ cm and $3.4$ cm, and give the answer with the right number of significant figures.`, '5.9 cm', ['5.90 cm', '5.8 cm', '6 cm'],
    r`$2.50 + 3.4 = 5.90$. In addition, the answer keeps as many decimal places as the least precise number, which has one decimal place. So the answer is 5.9 cm.`,
    { trap: 'Addition follows decimal places; multiplication follows significant figures.' }),
  mcq(2, 'significant figures', r`The product $2.4 \times 3.42$ (both measured values) should be reported as`, '8.2', ['8.208', '8.21', '8'],
    r`$2.4\times3.42 = 8.208$. In multiplication, the answer has as many significant figures as the least precise factor. $2.4$ has 2, so the answer is 8.2.`),
  mcq(2, 'dimensions', r`The dimensions of surface tension are`, r`$[MT^{-2}]$`, [r`$[MLT^{-2}]$`, r`$[ML^{-1}T^{-2}]$`, r`$[ML^{2}T^{-2}]$`],
    r`Surface tension = force / length $= [MLT^{-2}]/[L] = [MT^{-2}]$. It is also energy / area.`),
  mcq(2, 'dimensional analysis', r`Which equation is dimensionally correct? ($s$: distance, $u,v$: speeds, $a$: acceleration, $t$: time)`, r`$s = ut + \tfrac12 at^2$`, [r`$v = u + at^2$`, r`$s = ut + at$`, r`$v^2 = u^2 + at$`],
    r`Check every term. $ut$ is $[L]$ and $at^2$ is $[L]$, so the first equation is consistent. In $v = u + at^2$, $at^2$ is a length but $v$ is a speed. In $s = ut + at$, $at$ is a speed but $s$ is a length. In $v^2 = u^2 + at$, $at$ is a speed but $v^2$ is speed squared. Only the first passes.`,
    { trap: 'A dimension check only rejects; it cannot confirm numerical factors such as the 2 in $v^2=u^2+2as$.' }),
  mcq(2, 'significant figures', r`Add $12.11$, $18.0$ and $1.012$ and report the result correctly.`, '31.1', ['31.122', '31.12', '31'],
    r`The sum is $31.122$. The least precise number is $18.0$ with one decimal place. So round to one decimal place: 31.1.`),
  mcq(2, 'unit conversion', r`$1$ kilowatt-hour equals`, r`$3.6\times10^{6}$ J`, [r`$3.6\times10^{3}$ J`, r`$3.6\times10^{9}$ J`, r`$6\times10^{4}$ J`],
    r`$1\ \mathrm{kWh} = 1000\ \mathrm{W}\times3600\ \mathrm{s} = 3.6\times10^{6}$ J.`),
  mcq(2, 'dimensions', r`Impulse has the same dimensions as`, 'momentum', ['force', 'energy', 'power'],
    r`Impulse = force × time $= [MLT^{-1}]$, which is also the dimension of momentum. (Impulse–momentum theorem.)`),
  mcq(2, 'unit conversion', r`Which is greater: a speed of $72\ \mathrm{km\,h^{-1}}$ or a speed of $20\ \mathrm{m\,s^{-1}}$?`, 'They are equal', ['72 km/h is greater', '20 m/s is greater', 'Cannot be compared'],
    r`$72\times\frac{5}{18} = 20$ m/s. They are exactly equal.`),
  mcq(2, 'unit conversion', r`$1\ \mathrm{MeV}$ in joules is about`, r`$1.6\times10^{-13}$ J`, [r`$1.6\times10^{-19}$ J`, r`$1.6\times10^{-16}$ J`, r`$1.6\times10^{-10}$ J`],
    r`$1\ \mathrm{eV} = 1.6\times10^{-19}$ J and $1\ \mathrm{MeV} = 10^{6}$ eV. So $1.6\times10^{-19}\times10^{6} = 1.6\times10^{-13}$ J.`),
  nat(2, 'unit conversion', r`Young's modulus of steel is $2\times10^{11}\ \mathrm{N\,m^{-2}}$. In CGS it is $n\times10^{12}\ \mathrm{dyne\,cm^{-2}}$. Find $n$.`, 2, 0,
    r`$1\ \mathrm{N\,m^{-2}} = 10^{5}\ \mathrm{dyne}/10^{4}\ \mathrm{cm^2} = 10\ \mathrm{dyne\,cm^{-2}}$. So $2\times10^{11}\times10 = 2\times10^{12}$, giving $n=2$.`),
  nat(2, 'errors', r`Five readings of a time are $2.63,\ 2.56,\ 2.42,\ 2.71,\ 2.80$ s. Find the mean absolute error (the mean of the absolute deviations from the mean), in seconds, to 3 decimal places.`, 0.107, 0.005,
    r`Mean $= 13.12/5 = 2.624$ s. Deviations: $0.006,\ 0.064,\ 0.204,\ 0.086,\ 0.176$. Their sum is $0.536$, so the mean absolute error is $0.536/5 = 0.1072 \approx 0.107$ s.`, { unit: 's' }),
  mcq(2, 'unit conversion', r`The unit "parsec" measures`, 'distance', ['time', 'speed', 'angle'],
    r`A parsec is a distance, about $3.08\times10^{16}$ m (3.26 light years). The name comes from "parallax second" but it is not a unit of time or angle.`,
    { trap: 'Names like "light year" and "parsec" sound like time or angle units but both measure distance.' }),

  // ---------- Level 3 ----------
  mcq(3, 'dimensional analysis', r`The time period $T$ of a simple pendulum depends on mass $m$, length $l$ and $g$. Writing $T\propto m^{a}l^{b}g^{c}$, the exponents $(a,b,c)$ are`, r`$(0,\ \tfrac12,\ -\tfrac12)$`, [r`$(1,\ \tfrac12,\ -\tfrac12)$`, r`$(0,\ -\tfrac12,\ \tfrac12)$`, r`$(0,\ 1,\ -1)$`],
    r`Match dimensions. $[T] = [M]^a[L]^b[LT^{-2}]^c$. Mass: $a = 0$. Time: $-2c = 1$, so $c = -\tfrac12$. Length: $b + c = 0$, so $b = \tfrac12$. Hence $T\propto\sqrt{l/g}$.`,
    { trap: 'Dimensions show the mass cannot appear, but they do not give the factor $2\\pi$.' }),
  mcq(3, 'dimensional analysis', r`The frequency of a stretched string depends on length $l$, tension $T$ and mass per unit length $\mu$: $f\propto l^{a}T^{b}\mu^{c}$. The exponents $(a,b,c)$ are`, r`$(-1,\ \tfrac12,\ -\tfrac12)$`, [r`$(1,\ \tfrac12,\ -\tfrac12)$`, r`$(-1,\ -\tfrac12,\ \tfrac12)$`, r`$(-\tfrac12,\ 1,\ -1)$`],
    r`$[f] = T^{-1}$; tension is a force $[MLT^{-2}]$ and $\mu$ is $[ML^{-1}]$. Mass: $b + c = 0$. Time: $-2b = -1$, so $b=\tfrac12$ and $c = -\tfrac12$. Length: $a + b - c = 0$, so $a = -1$. So $f\propto \frac1l\sqrt{T/\mu}$.`),
  mcq(3, 'dimensional analysis', r`In the van der Waals equation $\left(P + \dfrac{a}{V^2}\right)(V-b) = RT$, the dimensions of $a$ are`, r`$[ML^{5}T^{-2}]$`, [r`$[ML^{-1}T^{-2}]$`, r`$[L^{3}]$`, r`$[ML^{2}T^{-2}]$`],
    r`Only quantities with the same dimensions can be added, so $a/V^2$ has the dimensions of $P$. Then $a = P V^2 = [ML^{-1}T^{-2}][L^6] = [ML^5T^{-2}]$.`),
  mcq(3, 'dimensions', r`The dimensions of magnetic flux are`, r`$[ML^{2}T^{-2}A^{-1}]$`, [r`$[MLT^{-2}A^{-1}]$`, r`$[ML^{2}T^{-1}A^{-1}]$`, r`$[ML^{2}T^{-3}A^{-1}]$`],
    r`Flux $\Phi = B\times$ area. Also, emf $= \Phi/t$, so $\Phi$ = volt × second. Volt is $[ML^2T^{-3}A^{-1}]$, so weber is $[ML^2T^{-2}A^{-1}]$.`,
    { trap: 'The last option is the volt, not the weber.' }),
  mcq(3, 'dimensions', r`The dimensions of the permittivity of free space $\varepsilon_0$ are`, r`$[M^{-1}L^{-3}T^{4}A^{2}]$`, [r`$[M^{-1}L^{-3}T^{2}A^{2}]$`, r`$[ML^{3}T^{-4}A^{-2}]$`, r`$[M^{-1}L^{-2}T^{4}A^{2}]$`],
    r`From $F = \dfrac{q_1q_2}{4\pi\varepsilon_0 r^2}$: $\varepsilon_0 = \dfrac{q^2}{Fr^2} = \dfrac{[A^2T^2]}{[MLT^{-2}][L^2]} = [M^{-1}L^{-3}T^{4}A^{2}]$.`),
  mcq(3, 'dimensional analysis', r`Which of the following quantities does <b>not</b> have the dimensions of time? ($L$: inductance, $C$: capacitance, $R$: resistance)`, r`$\sqrt{L/C}$`, [r`$L/R$`, r`$RC$`, r`$\sqrt{LC}$`],
    r`$L/R$ and $RC$ are the time constants of LR and RC circuits. $\sqrt{LC}$ is $1/\omega_0$ of an LC circuit, so it is time. But $\sqrt{L/C}$ is the characteristic impedance, with dimensions of resistance.`,
    { trap: 'All four look alike; only the ratio $L/C$ gives resistance.' }),
  nat(3, 'unit conversion', r`In a new system the unit of length is 10 cm, the unit of mass is 100 g and the unit of time is 1 s. The numerical value of 1 joule in this system is`, 1000, 0,
    r`$1\ \mathrm{J} = 1\ \mathrm{kg\,m^{2}\,s^{-2}}$. Mass: $1\ \mathrm{kg}/100\ \mathrm{g} = 10$. Length: $(1\ \mathrm{m}/0.1\ \mathrm{m})^2 = 100$. Time: 1. So $10\times100\times1 = 1000$.`,
    { trap: 'A bigger unit gives a smaller number. Divide by each unit, do not multiply.' }),
  nat(3, 'unit conversion', r`In a system the units of force, velocity and time are $20$ N, $5\ \mathrm{m\,s^{-1}}$ and $2$ s. Find the unit of mass in kg.`, 8, 0,
    r`From $F = ma$ and $a = v/t$, mass $= Ft/v$. Unit of mass $= 20\times2/5 = 8$ kg.`, { unit: 'kg' }),
  mcq(3, 'errors', r`$V = (100\pm5)$ V and $I = (10\pm0.2)$ A. The resistance $R = V/I$ with its error is`, r`$10\ \Omega \pm 0.7\ \Omega$`, [r`$10\ \Omega \pm 0.3\ \Omega$`, r`$10\ \Omega \pm 0.07\ \Omega$`, r`$10\ \Omega \pm 7\ \Omega$`],
    r`$\Delta V/V = 5\%$ and $\Delta I/I = 0.2/10 = 2\%$. For a quotient the relative errors add: $7\%$. $R = 10\ \Omega$, and $7\%$ of $10$ is $0.7\ \Omega$.`,
    { trap: 'Subtracting the errors gives 3 % and the wrong option 0.3 Ω.' }),
  nat(3, 'errors', r`The side of a cube is $2.00\pm0.02$ cm and its mass is $25\ \mathrm{g}$ with a $2\%$ error. Find the percentage error in its density.`, 5, 0,
    r`$\rho = m/a^3$. Error in side: $0.02/2.00 = 1\%$, so $3\times1\% = 3\%$. Add the mass error: $2 + 3 = 5\%$.`),
  nat(3, 'errors', r`In finding $g = 4\pi^2 L/T^2$ with a pendulum, $L$ has a $0.1\%$ error and $T$ has a $0.4\%$ error. Find the percentage error in $g$.`, 0.9, 0.01,
    r`The relative error in $g$ is $\Delta L/L + 2\,\Delta T/T = 0.1 + 2\times0.4 = 0.9\%$.`, { trap: 'The factor $4\\pi^2$ is exact and adds no error; $T$ is squared so its error is doubled.' }),
  nat(3, 'errors', r`$a = 10.0\pm0.1$ and $b = 9.0\pm0.1$. Find the percentage error in $x = a - b$.`, 20, 0,
    r`$x = 1.0$ and $\Delta x = 0.1 + 0.1 = 0.2$ (errors add even in a difference). Percentage error $= 0.2/1.0\times100 = 20\%$.`,
    { trap: 'Subtracting nearly equal numbers makes the relative error large.' }),
  nat(3, 'vernier', r`A vernier caliper has 1 MSD = 1 mm and 10 VSD = 9 MSD. With the jaws closed, the 2nd vernier division coincides with a main scale division. Measuring a rod, the main scale reads 23 mm just before the vernier zero and the 7th vernier division coincides. Find the correct length in mm.`, 23.5, 0.005,
    r`LC = 0.1 mm. Zero error $= +2\times0.1 = +0.2$ mm. Observed reading $= 23 + 7\times0.1 = 23.7$ mm. Correct reading = observed − zero error $= 23.7 - 0.2 = 23.5$ mm.`, { unit: 'mm' }),
  nat(3, 'screw gauge', r`A screw gauge has pitch $0.5$ mm and 50 circular divisions. With the jaws closed the 47th division is against the reference line. For a wire, the main scale reads $3.0$ mm and the circular scale reads 27. Find the diameter in mm.`, 3.3, 0.005,
    r`LC $= 0.5/50 = 0.01$ mm. When closed, the reading 47 means the zero is 3 divisions short of the line, so the zero error is $-3\times0.01 = -0.03$ mm. Observed $= 3.0 + 27\times0.01 = 3.27$ mm. Correct $= 3.27-(-0.03) = 3.30$ mm.`, { unit: 'mm', trap: 'A negative zero error is added, not subtracted.' }),
  nat(3, 'significant figures', r`How many of these numbers have exactly 3 significant figures? $0.0230,\ 4.05,\ 120,\ 3.00\times10^{2},\ 0.00700,\ 1.0\times10^{3}$`, 4, 0,
    r`$0.0230$ has 3 (2, 3, 0). $4.05$ has 3. $120$ without a decimal point is taken as 2. $3.00\times10^2$ has 3. $0.00700$ has 3. $1.0\times10^3$ has 2. Exactly three: four numbers.`),
  nat(3, 'errors', r`A speed is found from $v = s/t$ with $s = 20.0\pm0.1$ m and $t = 4.00\pm0.05$ s. Find the absolute error in $v$ in m/s.`, 0.0875, 0.005,
    r`$v = 5.00$ m/s. Relative error $= 0.1/20.0 + 0.05/4.00 = 0.005 + 0.0125 = 0.0175$. So $\Delta v = 5.00\times0.0175 = 0.0875$ m/s.`, { sub: 'mixed', unit: 'm/s' }),
  nat(3, 'errors', r`The mass of a body is measured with a $2\%$ error and its speed with a $3\%$ error. Find the percentage error in its kinetic energy $\tfrac12mv^2$.`, 8, 0,
    r`$E\propto mv^2$, so the error is $2\% + 2\times3\% = 8\%$.`, { sub: 'mixed' }),
  mcq(3, 'dimensional analysis', r`A body's position is $x = A + Bt + Ct^2$. Which combination is dimensionless?`, r`$B^2/(AC)$`, [r`$B/(AC)$`, r`$BC/A$`, r`$A^2/(BC)$`],
    r`$[A] = L$, $[B] = LT^{-1}$, $[C] = LT^{-2}$. Then $B^2/(AC) = [L^2T^{-2}]/[L^2T^{-2}] = 1$. Others: $B/(AC) = [L^{-1}T]$, $BC/A = [LT^{-3}]$, $A^2/(BC) = [T^3]$.`, { sub: 'mixed' }),
  mcq(3, 'dimensional analysis', r`The expression $\varepsilon_0E^2$, where $E$ is the electric field, has the dimensions of`, 'pressure', ['force', 'energy', 'momentum'],
    r`$[\varepsilon_0] = [M^{-1}L^{-3}T^4A^2]$ and $[E] = [MLT^{-3}A^{-1}]$. So $\varepsilon_0E^2 = [M^{-1}L^{-3}T^4A^2][M^2L^2T^{-6}A^{-2}] = [ML^{-1}T^{-2}]$. This is pressure, or energy per unit volume. In fact the electric energy density is $\tfrac12\varepsilon_0E^2$.`),
  msq(3, 'dimensional analysis', r`Which of these equations are dimensionally consistent? ($v$ speed, $h$ height, $T$ period, $l$ length, $m$ mass, $r$ radius, $E$ energy)`,
    [r`$v = \sqrt{2gh}$`, r`$T = 2\pi\sqrt{g/l}$`, r`$F = mv^2/r$`, r`$E = \tfrac12mv$`], [0, 2],
    r`(A) $\sqrt{gh}$ is $\sqrt{L^2T^{-2}} = LT^{-1}$. Consistent. (B) $\sqrt{g/l}$ is $T^{-1}$, not $T$ (the correct form has $l/g$). (C) $mv^2/r = M L^2T^{-2}/L = MLT^{-2}$, a force. Consistent. (D) $mv$ is momentum, not energy. So A and C.`),

  // ---------- Level 4 ----------
  mcq(4, 'dimensional analysis', r`Which combination of $G$, $\hbar$ and $c$ has the dimensions of length?`, r`$\sqrt{G\hbar/c^{3}}$`, [r`$\sqrt{G\hbar/c^{5}}$`, r`$G\hbar/c^{3}$`, r`$\sqrt{c^{3}/(G\hbar)}$`],
    r`$G\hbar = [M^{-1}L^3T^{-2}][ML^2T^{-1}] = [L^5T^{-3}]$. Divide by $c^3 = [L^3T^{-3}]$ to get $[L^2]$. The square root is $[L]$. (This is the Planck length.) With $c^5$ you get $T^2$ inside, so $\sqrt{G\hbar/c^5}$ is a time.`),
  mcq(4, 'dimensional analysis', r`In $F = \dfrac{A}{B + x^2}$, $F$ is a force and $x$ is a length. The dimensions of $A/B$ are`, 'those of force', ['those of energy', 'those of pressure', 'dimensionless'],
    r`$B$ is added to $x^2$, so $[B] = [L^2]$. Then $[A] = [F][L^2]$. So $A/B = [F]$, the dimension of force.`, { trap: 'Spot that $B$ must have the dimensions of $x^2$, not of $x$.' }),
  mcq(4, 'dimensional analysis', r`In the van der Waals equation the ratio $a/b$ has dimensions of`, 'energy', ['pressure', 'force', 'momentum'],
    r`$[a] = [ML^5T^{-2}]$ (since $a/V^2$ is a pressure) and $[b] = [L^3]$ (since $b$ is subtracted from volume). So $a/b = [ML^2T^{-2}]$, which is energy.`),
  nat(4, 'errors', r`$z = \dfrac{a^{2}b^{3/2}}{c\,d^{4}}$. The percentage errors in $a, b, c, d$ are $1\%, 2\%, 3\%$ and $0.5\%$. Find the maximum percentage error in $z$.`, 10, 0,
    r`Add (power × percentage error) for every factor, whether in the numerator or denominator: $2\times1 + 1.5\times2 + 1\times3 + 4\times0.5 = 2+3+3+2 = 10\%$.`),
  msq(4, 'dimensional analysis', r`Which pairs of quantities have the <b>same</b> dimensions?`,
    [r`Torque and energy`, r`Planck's constant and angular momentum`, r`Force and impulse`, r`Pressure and energy per unit volume`], [0, 1, 3],
    r`Torque and energy are both $[ML^2T^{-2}]$. $h$ and $L$ are both $[ML^2T^{-1}]$. Force $[MLT^{-2}]$ and impulse $[MLT^{-1}]$ differ. Pressure and energy density are both $[ML^{-1}T^{-2}]$. Answer: A, B, D.`),
  msq(4, 'dimensions', r`Which of the following are dimensionless?`,
    [r`Strain`, r`Poisson's ratio`, r`Strain rate`, r`Reynolds number`], [0, 1, 3],
    r`Strain is change in length / length. Poisson's ratio is a ratio of two strains. Reynolds number is $\rho vd/\eta$ and has no dimension. Strain rate is strain per second, $[T^{-1}]$.`),
  msq(4, 'dimensional analysis', r`Which of these have the dimensions of frequency? ($L$ inductance, $C$ capacitance, $R$ resistance)`,
    [r`$R/L$`, r`$1/(RC)$`, r`$1/\sqrt{LC}$`, r`$\sqrt{L/C}$`], [0, 1, 2],
    r`$L/R$, $RC$ and $\sqrt{LC}$ are all times, so their inverses are frequencies. $\sqrt{L/C}$ is a resistance.`),
  msq(4, 'vernier', r`A vernier caliper has 1 MSD = 1 mm and 10 VSD = 9 mm. Which statements are correct?`,
    [r`The least count is 0.1 mm`, r`One vernier division is 0.9 mm`, r`If the 4th vernier division coincides, the vernier reading is 0.4 mm`, r`If the vernier zero lies to the left of the main zero with the jaws closed, the zero error is positive`], [0, 1, 2],
    r`LC $= 1 - 0.9 = 0.1$ mm. 1 VSD $= 0.9$ mm. The 4th coincidence adds $4\times0.1 = 0.4$ mm. D is wrong: a zero to the left of the main zero gives a negative zero error.`),
  mcq(4, 'unit conversion', r`The speed of light is $3\times10^{8}$ m/s. In a system whose unit of length is 1 light year and unit of time is 1 year, the speed of light is`, '1', [r`$3\times10^{8}$`, r`$9.46\times10^{15}$`, r`$3.15\times10^{7}$`],
    r`Light travels 1 light year in 1 year by definition, so $c = 1$ in these units. Check: $3\times10^8\times3.15\times10^7/(9.46\times10^{15}) \approx 1$.`, { trap: 'The unit is defined from c, so the number must be 1.' }),
  nat(4, 'errors', r`Two resistors $R_1 = 100\pm3\ \Omega$ and $R_2 = 200\pm4\ \Omega$ are joined in parallel. Find the absolute error in the equivalent resistance in ohm (2 decimals).`, 1.78, 0.02,
    r`$R = R_1R_2/(R_1+R_2) = 66.67\ \Omega$. From $1/R = 1/R_1 + 1/R_2$: $\Delta R/R^2 = \Delta R_1/R_1^2 + \Delta R_2/R_2^2 = 3/10^4 + 4/(4\times10^4) = 4\times10^{-4}$. So $\Delta R = 4444.4\times4\times10^{-4} = 1.78\ \Omega$.`, { unit: 'Ω', trap: 'Parallel resistors: errors add in $1/R$, not in $R$. Treating it as a quotient needs care.' }),
  nat(4, 'dimensional analysis', r`The time of oscillation of a liquid drop depends on density $\rho$, surface tension $\sigma$ and radius $r$: $T\propto\rho^{a}\sigma^{b}r^{c}$. Find $a+b+c$.`, 1.5, 0.01,
    r`$[\rho] = ML^{-3}$, $[\sigma] = MT^{-2}$, $[r] = L$. Mass: $a+b = 0$. Time: $-2b = 1$, so $b = -\tfrac12$ and $a = \tfrac12$. Length: $-3a + c = 0$, so $c = \tfrac32$. Then $a+b+c = \tfrac12-\tfrac12+\tfrac32 = 1.5$. (This is $T\propto\sqrt{\rho r^3/\sigma}$.)`),
  mcq(4, 'dimensional analysis', r`Gravity waves on deep water have speed $v = k\lambda^{a}g^{b}\rho^{c}$ ($\lambda$ wavelength, $\rho$ density of water). Dimensional analysis gives $c =$`, '0', ['1', '1/2', '−1/2'],
    r`Only $\rho$ carries mass, and neither $v$, $\lambda$ nor $g$ has mass in its dimensions. So $c = 0$. Then time gives $b = \tfrac12$ and length gives $a = \tfrac12$: $v\propto\sqrt{g\lambda}$.`),
  stm(4, 'mixed', r`The formula $S_n = u + \dfrac a2(2n-1)$ for the distance in the $n$th second is dimensionally incorrect.`, r`This formula is written for a time interval of exactly 1 s, which is hidden in it.`, 0,
    r`$u$ has dimensions of speed while $S_n$ is a distance, so it fails a dimension check. The full form is $S_n = u(1\ \mathrm{s}) + \frac a2(2n-1)(1\ \mathrm{s})^2$. The hidden 1 s makes it valid numerically in SI. Both statements are true.`,
    { trap: 'A formula can be numerically right in one unit system and dimensionally wrong.' }),
  nat(4, 'unit conversion', r`In a system with units of force $10$ N, energy $100$ J and time $5$ s, find the unit of mass in kg.`, 25, 0,
    r`Unit of length $= E/F = 100/10 = 10$ m. From $F = ma$ with $a = L/T^2$, mass $= FT^2/L = 10\times25/10 = 25$ kg.`, { unit: 'kg' }),
  nat(4, 'dimensional analysis', r`Using $t_P\propto G^{a}\hbar^{b}c^{d}$ for the Planck time (a time built from $G$, $\hbar$, $c$), find $a+b+d$.`, -1.5, 0.01,
    r`$G\hbar = [L^5T^{-3}]$. To get a time we need $L$ to cancel: use $c^{-5}$ to make $[T^2]$, so $t_P = \sqrt{G\hbar/c^5}$. Thus $a = \tfrac12$, $b = \tfrac12$, $d = -\tfrac52$. Sum $= -1.5$.`),
  mcq(4, 'errors', r`A student measures the same length 5 times with a vernier caliper of least count $0.01$ cm and gets $2.54, 2.54, 2.54, 2.54, 2.54$ cm. The mean absolute error of the five readings is $0$. What should the student say about the error in the length?`, 'It is about ±0.01 cm, since the instrument limits the precision', ['The error is exactly zero', 'The error is ±0.05 cm', 'The error is ±0.001 cm'],
    r`The identical readings show no random scatter, but the instrument can only read to its least count. The uncertainty is therefore at least ±LC $= 0.01$ cm. A mean absolute error of 0 only means no spread, not a perfect value.`, { trap: 'Zero scatter does not mean zero error: the least count still limits the result.' }),
  mcq(4, 'significant figures', r`The radius of a circle is $r = 3.2$ cm (measured). Its area $\pi r^2$ should be written as`, r`$32\ \mathrm{cm^2}$`, [r`$32.2\ \mathrm{cm^2}$`, r`$32.17\ \mathrm{cm^2}$`, r`$30\ \mathrm{cm^2}$`],
    r`$\pi r^2 = 3.1416\times10.24 = 32.17$. The radius has 2 significant figures, so the area has 2: $32\ \mathrm{cm^2}$.`, { trap: '$\\pi$ is exact and does not limit the significant figures.' }),

  // ---------- Level 5 ----------
  msq(5, 'errors', r`$p = 10.0\pm0.1$ and $q = 5.0\pm0.1$. Which results are correct?`,
    [r`$p+q = 15.0\pm0.2$`, r`$p-q = 5.0\pm0.2$`, r`$pq = 50\pm1.5$`, r`$p/q = 2.00\pm0.02$`], [0, 1, 2],
    r`A: absolute errors add: $0.2$. B: also $0.2$. C: relative errors $1\% + 2\% = 3\%$ of 50 is 1.5. D: the relative error is also $3\%$, so $\Delta(p/q) = 2.00\times0.03 = 0.06$, not 0.02. Answer A, B, C.`,
    { trap: 'In a quotient the relative errors still add. Option D subtracts them.' }),
  msq(5, 'significant figures', r`Which of the following are correct about significant figures?`,
    [r`$0.0500$ and $5.00\times10^{-2}$ have the same number of significant figures`, r`The result of $12.5\times0.80$ should have 2 significant figures`, r`$1.200\ \mathrm{m} = 120.0\ \mathrm{cm}$ shows a loss of one significant figure`, r`Changing units does not change the number of significant figures`], [0, 1, 3],
    r`A: both have 3. B: $12.5\times0.80 = 10.0$, and $0.80$ has 2 significant figures, the least, so the result is reported as 10. C is wrong: 120.0 cm has 4, the same as 1.200 m. D: converting units must not change the count. Answer A, B, D.`),
  mcq(5, 'dimensional analysis', r`A quantity $X$ is defined as $X = \dfrac{\varepsilon_0 L\,\Delta V}{\Delta t}$, where $L$ is a length, $\Delta V$ a potential difference and $\Delta t$ a time. $X$ has the dimensions of`, 'current', ['charge', 'voltage', 'electric field'],
    r`$\varepsilon_0L$ has dimensions of capacitance ($C = \varepsilon_0A/d$ has $\varepsilon_0\times$ length). $C\,\Delta V$ is charge, and charge divided by time is current.`, { trap: 'Recognise $\\varepsilon_0\\times$length as a capacitance and the rest follows.' }),
  mcq(5, 'dimensional analysis', r`Which pair does <b>not</b> have equal dimensions?`, r`Electric flux $\oint\vec E\cdot d\vec A$ and $\varepsilon_0 \times$ charge`, [r`$\dfrac1{\sqrt{\mu_0\varepsilon_0}}$ and speed of light $c$`, r`$\dfrac{B^2}{\mu_0}$ and $\varepsilon_0E^2$`, r`$\dfrac{\mu_0 I}{r}$ and magnetic field`],
    r`Gauss's law: flux $= q/\varepsilon_0$. So flux has dimensions of charge$/\varepsilon_0$, not charge × $\varepsilon_0$. The other pairs match: $1/\sqrt{\mu_0\varepsilon_0} = c$; $B^2/\mu_0$ and $\varepsilon_0E^2$ are energy densities; $\mu_0I/r$ is a field.`, { trap: 'Inverting a ratio (q/ε₀ against qε₀) is a very common slip.' }),
  stm(5, 'errors', r`Zero error is a systematic error.`, r`Taking the average of many readings removes the zero error.`, 2,
    r`I is true: the same offset shifts every reading in the same direction. II is false: averaging reduces random scatter only. Zero error has to be found with the jaws closed and then subtracted.`, { trap: 'Averaging only cures random error.' }),

  // ---------- Assertion-Reason ----------
  asrt(2, 'dimensional analysis', r`A dimensionally correct equation is always physically correct.`, r`Dimensional analysis cannot check numerical constants such as $\tfrac12$ or $2\pi$.`, 3,
    r`A is false: $s = ut + at^2$ is dimensionally fine but wrong (the correct term is $\tfrac12at^2$). R is true, and it is the reason a dimension check is only a necessary test, not sufficient. So the answer is (D).`),
  asrt(2, 'SI units', r`A light year is a unit of distance.`, r`A light year is the distance travelled by light in vacuum in one year.`, 0,
    r`Both are true and R is the definition that explains A.`),
  asrt(2, 'significant figures', r`The measurements 2.50 cm and 2.5 cm are not equivalent.`, r`Trailing zeros after the decimal point are significant.`, 0,
    r`2.50 has 3 significant figures and shows precision to 0.01 cm. 2.5 has 2 and shows precision only to 0.1 cm. The reason is the rule that explains the difference.`),
  asrt(3, 'errors', r`The relative error in the difference of two nearly equal quantities can be very large.`, r`The absolute errors of the two quantities add, while the difference itself is small.`, 0,
    r`Example: $10.0\pm0.1$ minus $9.9\pm0.1$ gives $0.1\pm0.2$, a 200% error. R explains A.`),
  asrt(3, 'dimensions', r`Angle is dimensionless, although it has the unit radian.`, r`Angle is the ratio of arc length to radius.`, 1,
    r`Both are true. R explains why angle is dimensionless (a ratio of two lengths), but it does not explain why it still has a unit: the radian is a name given to that ratio. So R is not the full explanation of A.`, { trap: 'Dimensionless does not mean unitless.' }),
  asrt(3, 'SI units', r`$1\ \mathrm{N\,m^{-1}}$ and $1\ \mathrm{J\,m^{-2}}$ are the same unit of surface tension.`, r`Both reduce to $\mathrm{kg\,s^{-2}}$.`, 0,
    r`$\mathrm{N/m} = \mathrm{kg\,m\,s^{-2}/m} = \mathrm{kg\,s^{-2}}$ and $\mathrm{J/m^2} = \mathrm{kg\,m^2\,s^{-2}/m^2} = \mathrm{kg\,s^{-2}}$. Both are true and R explains A.`),
  asrt(4, 'dimensional analysis', r`Work and torque have the same dimensions but they are different physical quantities.`, r`Work is a scalar while torque is a vector.`, 1,
    r`Both statements are true. But R is not the reason for the equal dimensions. It is one of the differences between the two, not the explanation of A.`, { trap: 'Same dimensions never means same nature.' }),

  // ---------- Statements ----------
  stm(1, 'significant figures', r`The number 0.0050 has two significant figures.`, r`Leading zeros are not significant.`, 0,
    r`Leading zeros show only the place of the decimal. The digits 5 and 0 count, giving two. Both statements are true.`),
  stm(2, 'errors', r`The absolute error in a sum is the sum of the absolute errors.`, r`The relative error in a product is the sum of the relative errors.`, 0,
    r`Both are the standard rules for the maximum error.`),
  stm(3, 'dimensional analysis', r`An equation whose two sides have the same dimensions must be correct.`, r`An equation whose two sides have different dimensions must be wrong.`, 3,
    r`I is false because numerical factors are not tested. II is true. So the answer is (D).`),
  stm(3, 'vernier', r`The least count of a screw gauge is pitch divided by the number of circular divisions.`, r`The pitch is the distance moved by the screw in one full rotation.`, 0,
    r`Both are true. Pitch/N is the movement for one circular division.`),
  mcq(3, 'unit conversion', r`How many of the following are correct? (a) $1\ \mathrm{kWh} = 3.6\times10^{6}$ J (b) $1\ \mathrm{eV} = 1.6\times10^{-19}$ J (c) $1\ \mathrm{atm}\approx1.01\times10^{5}$ Pa (d) $1\ \text{\AA} = 10^{-9}$ m (e) $1\ \mathrm{bar} = 10^{5}$ Pa`, '4', ['2', '3', '5'],
    r`(a), (b), (c) and (e) are correct. (d) is wrong: $1\ \text{\AA} = 10^{-10}$ m (a nanometre is $10^{-9}$ m). So 4 are correct.`, { format: 'statements', trap: 'Ångström and nanometre are often swapped.' }),
  stm(3, 'errors', r`Parallax is a random error that cannot be removed.`, r`Repeating readings and taking the mean reduces random errors.`, 3,
    r`Parallax from a fixed wrong viewing position gives a consistent shift, so it is a systematic error and can be removed by viewing straight on. I is false; II is true.`, { trap: 'Do not call every human error random.' }),
  stm(5, 'errors', r`If $z = x^2y$, the relative error in $z$ is $2\dfrac{\Delta x}{x} + \dfrac{\Delta y}{y}$.`, r`If $z = x - y$, the relative error in $z$ is $\dfrac{\Delta x}{x} + \dfrac{\Delta y}{y}$.`, 2,
    r`I is true. II is false: the <i>absolute</i> errors add, so the relative error is $(\Delta x+\Delta y)/(x-y)$, which differs from the sum of relative errors.`, { trap: 'Mixing the sum rule for absolute error with the product rule for relative error.' }),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'dimensions', group: 'm1',
    q: 'Match the quantities in List I with their dimensions in List II.',
    options: ['A-q, B-p, C-s, D-r', 'A-p, B-q, C-r, D-s', 'A-q, B-s, C-p, D-r', 'A-r, B-p, C-s, D-q'], answer: 0,
    sol: r`Pressure is $[ML^{-1}T^{-2}]$ (q). Impulse is $[MLT^{-1}]$ (p). Power is $[ML^2T^{-3}]$ (s). Torque is $[ML^2T^{-2}]$ (r). So A-q, B-p, C-s, D-r.` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'least count', group: 'm2',
    q: 'Match each instrument in List I with its least count in List II.',
    options: ['A-r, B-q, C-s, D-p', 'A-p, B-q, C-r, D-s', 'A-p, B-r, C-q, D-s', 'A-q, B-p, C-s, D-r'], answer: 1,
    sol: r`A: LC $= 1/20 = 0.05$ mm (p). B: $1/100 = 0.01$ mm (q). C: $0.5/25 = 0.02$ mm (r). D: $0.5/100 = 0.005$ mm (s). So A-p, B-q, C-r, D-s.` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'errors', group: 'm3',
    q: 'Each of $a$ and $b$ has a $1\\%$ error. Match each expression in List I with the percentage error in List II.',
    options: ['A-p, B-q, C-r, D-s', 'A-s, B-r, C-q, D-p', 'A-r, B-s, C-p, D-q', 'A-r, B-p, C-s, D-q'], answer: 2,
    sol: r`A: $a^2b$: $2+1 = 3\%$ (r). B: $a/b^3$: $1+3 = 4\%$ (s). C: $\sqrt{ab}$: $\tfrac12+\tfrac12 = 1\%$ (p). D: $a^2/\sqrt b$: $2+\tfrac12 = 2.5\%$ (q). So A-r, B-s, C-p, D-q.` },

  // ---------- Passages ----------
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'errors', group: 'p1',
    q: 'Find the period $T$ of the pendulum, in seconds.', answer: 1.9, tol: 0.01, unit: 's',
    sol: r`$T = 38.0/20 = 1.90$ s.` },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'errors', group: 'p1',
    q: 'Find the percentage error in $T^2$ (two decimals).', answer: 0.53, tol: 0.01, unit: '%',
    sol: r`$\Delta t/t = 0.1/38.0 = 0.263\%$. The same relative error holds for $T$ (dividing by exactly 20 adds none). For $T^2$, double it: $0.526\%\approx0.53\%$.`, trap: 'The error is in $t$, not divided by 20 a second time.' },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'errors', group: 'p1',
    q: 'Find $g$ from the data and the percentage error in it. Give the percentage error to 2 decimals.', answer: 0.64, tol: 0.01, unit: '%',
    sol: r`$g = 4\pi^2L/T^2 = 4\pi^2(0.900)/1.90^2 = 9.84\ \mathrm{m\,s^{-2}}$. Percentage error $= \Delta L/L + 2\Delta T/T = 0.111\% + 2\times0.263\% = 0.637\%\approx0.64\%$.` },
  { id: nid(), type: 'nat', level: 3, format: 'passage', exams: EX[3], sub: 'screw gauge', group: 'p2',
    q: 'Find the corrected diameter of the wire in mm.', answer: 1.42, tol: 0.005, unit: 'mm',
    sol: r`LC $= 1/100 = 0.01$ mm. Observed $= 1 + 47\times0.01 = 1.47$ mm. Zero error is $+0.05$ mm, so the correct diameter is $1.47 - 0.05 = 1.42$ mm.` },
  { id: nid(), type: 'nat', level: 4, format: 'passage', exams: EX[4], sub: 'errors', group: 'p2',
    q: 'Find the percentage error in the volume of the wire, correct to 1 decimal place. Take the error in the diameter as one least count.', answer: 1.6, tol: 0.05, unit: '%',
    sol: r`$V = \tfrac{\pi}{4}d^2L$. $\Delta d/d = 0.01/1.42 = 0.704\%$ and $\Delta L/L = 0.1/50.0 = 0.2\%$. So $\Delta V/V = 2\times0.704 + 0.2 = 1.61\%\approx1.6\%$.` },
  { id: nid(), type: 'mcq', level: 4, format: 'passage', exams: EX[4], sub: 'errors', group: 'p2', answer: 1,
    q: 'Which measurement contributes the larger share to the error in the volume?',
    options: ['The length, because it is the longest quantity', 'The diameter, because it appears squared and is the smaller measurement', 'Both equally', 'Neither, since the least counts are small'],
    sol: r`The diameter contributes $2\times0.704 = 1.41\%$, while the length contributes only $0.2\%$. A small quantity measured with a fixed least count has a big relative error, and the square doubles it.`, trap: 'Small quantities carry larger relative errors even if the instrument is more precise.' },
];

const groups = {
  m1: { title: 'Dimensions',
    list1: ['A. Pressure', 'B. Impulse', 'C. Power', 'D. Torque'],
    list2: [r`p. $[MLT^{-1}]$`, r`q. $[ML^{-1}T^{-2}]$`, r`r. $[ML^{2}T^{-2}]$`, r`s. $[ML^{2}T^{-3}]$`] },
  m2: { title: 'Least counts',
    list1: ['A. Vernier: 1 MSD = 1 mm, 20 VSD = 19 MSD', 'B. Screw gauge: pitch 1 mm, 100 divisions', 'C. Vernier: 1 MSD = 0.5 mm, 25 VSD = 24 MSD', 'D. Screw gauge: pitch 0.5 mm, 100 divisions'],
    list2: ['p. 0.05 mm', 'q. 0.01 mm', 'r. 0.02 mm', 's. 0.005 mm'] },
  m3: { title: 'Errors',
    list1: [r`A. $a^2b$`, r`B. $a/b^3$`, r`C. $\sqrt{ab}$`, r`D. $a^2/\sqrt{b}$`],
    list2: ['p. 1 %', 'q. 2.5 %', 'r. 3 %', 's. 4 %'] },
  p1: { title: 'Measuring g with a pendulum',
    passage: r`<p>A student measures the length of a simple pendulum as $L = 90.0\pm0.1$ cm with a metre scale. With a stopwatch of least count $0.1$ s she times 20 oscillations as $t = 38.0\pm0.1$ s. She uses $g = 4\pi^2L/T^2$.</p>` },
  p2: { title: 'Measuring a wire',
    passage: r`<p>A screw gauge has pitch 1 mm and 100 circular divisions. With the jaws closed, the circular reading is $+5$ (a positive zero error). For a wire, the main scale shows 1 mm and the circular scale reads 47. The length of the wire is measured as $50.0\pm0.1$ cm with a metre scale. Its volume is $V = \frac{\pi}{4}d^2L$.</p>` },
};

// ---------- Number templates ----------
const term = (s, e) => (e === 1 ? s : `${s}^{${e}}`);
const gens = [
  { id: 'um-g01', type: 'nat', level: 2, exams: EX[2], sub: 'errors',
    make(rng) {
      const p = int(rng, 1, 4), qq = int(rng, 1, 4), s = int(rng, 1, 3);
      const ea = pick(rng, 1, 4, 0.5), eb = pick(rng, 1, 4, 0.5), ec = pick(rng, 1, 4, 0.5);
      const answer = p * ea + qq * eb + s * ec;
      return { p, qq, s, ea, eb, ec, answer, tol: 0.01, unit: '%',
        q: `$z = \\dfrac{${term('a', p)}\\,${term('b', qq)}}{${term('c', s)}}$. The percentage errors in $a$, $b$, $c$ are ${ea}%, ${eb}% and ${ec}%. Find the maximum percentage error in $z$.`,
        sol: `Each factor contributes (power × its percentage error), whether in the numerator or denominator: ${p}×${ea} + ${qq}×${eb} + ${s}×${ec} = ${fmt(answer, 4)}%.` };
    },
    verify: (p) => [[p.p, p.ea], [p.qq, p.eb], [p.s, p.ec]].reduce((t, [e, x]) => t + e * x, 0) },
  { id: 'um-g02', type: 'nat', level: 2, exams: EX[2], sub: 'vernier',
    make(rng) {
      const msd = choose(rng, [1, 0.5]), N = choose(rng, [10, 20, 25, 50]);
      const answer = +(msd / N).toFixed(5);
      return { msd, N, answer, tol: 0.0001, unit: 'mm',
        q: `In a vernier caliper 1 main scale division is ${msd} mm and ${N} vernier divisions coincide with ${N - 1} main scale divisions. Find the least count in mm.`,
        sol: `Least count = 1 MSD − 1 VSD. Since ${N} VSD = ${N - 1} MSD, 1 VSD = ${N - 1}/${N} MSD. So LC = (1/${N}) × ${msd} mm = ${fmt(answer, 3)} mm.` };
    },
    verify: (p) => p.msd - ((p.N - 1) / p.N) * p.msd },
  { id: 'um-g03', type: 'nat', level: 3, exams: EX[3], sub: 'screw gauge',
    make(rng) {
      const pitch = choose(rng, [0.5, 1]), N = choose(rng, [50, 100]), lc = pitch / N;
      const steps = int(rng, 2, 10), msr = +(pitch * steps).toFixed(3), cs = int(rng, 10, N - 10);
      const z = int(rng, 1, 5), neg = rng() < 0.5;
      const closed = neg ? N - z : z;
      const corr = neg ? msr + (cs + z) * lc : msr + (cs - z) * lc;
      const answer = +corr.toFixed(4);
      return { pitch, N, msr, cs, z, neg, answer, tol: 0.0006, unit: 'mm',
        q: `A screw gauge has pitch ${pitch} mm and ${N} circular divisions. With the jaws closed the circular scale reads ${closed}. For a wire the main scale reads ${msr} mm and the circular scale reads ${cs}. Find the diameter in mm.`,
        sol: `LC = ${pitch}/${N} = ${fmt(lc, 3)} mm. Observed = ${msr} + ${cs}×${fmt(lc, 3)} = ${fmt(msr + cs * lc, 5)} mm. ${neg ? `Closed reading ${closed} means the zero is ${z} divisions short of the line: zero error = −${z}×${fmt(lc, 3)} = −${fmt(z * lc, 3)} mm (a negative error is added).` : `Closed reading ${closed} means zero error = +${z}×${fmt(lc, 3)} = +${fmt(z * lc, 3)} mm, which is subtracted.`} Correct diameter = ${fmt(answer, 5)} mm.` };
    },
    verify: (p) => { const lc = p.pitch / p.N; const zero = p.neg ? -p.z * lc : p.z * lc; return p.msr + p.cs * lc - zero; } },
  { id: 'um-g04', type: 'mcq', level: 1, exams: EX[1], sub: 'unit conversion',
    make(rng) {
      const kind = int(rng, 0, 2);
      if (kind === 0) { const v = choose(rng, [18, 36, 54, 72, 90, 108, 126]); const a = v * 5 / 18;
        const o = numOpts(rng, a, [v * 3.6, v / 60, v * 1000 / 60], 'm/s');
        return { options: o.options, answer: o.answer, v, a, kind, q: `A train runs at ${v} km/h. Its speed in m/s is`, sol: `Multiply km/h by 5/18: ${v} × 5/18 = ${fmt(a, 4)} m/s.` }; }
      if (kind === 1) { const d = pick(rng, 0.5, 13.6, 0.1); const a = d * 1000;
        const o = numOpts(rng, a, [d, d * 100, d / 1000], 'kg/m³');
        return { options: o.options, answer: o.answer, v: d, a, kind, q: `The density of a liquid is ${d} g/cm³. In kg/m³ it is`, sol: `1 g/cm³ = 10⁻³ kg / 10⁻⁶ m³ = 1000 kg/m³. So ${d} × 1000 = ${fmt(a, 4)} kg/m³.` }; }
      const e = pick(rng, 2, 9, 1); const a = e * 3.6;
      const o = numOpts(rng, a, [e * 3600, e / 3.6, e * 36], 'MJ');
      return { options: o.options, answer: o.answer, v: e, a, kind, q: `An appliance uses ${e} kWh of energy. In megajoules this is`, sol: `1 kWh = 3.6 × 10⁶ J = 3.6 MJ. So ${e} × 3.6 = ${fmt(a, 4)} MJ.` };
    },
    verify: (p) => { const x = p.kind === 0 ? p.v / 3.6 : p.kind === 1 ? p.v * 1e-3 / 1e-6 : p.v * 1000 * 3600 / 1e6; return p.options.findIndex((o) => o.startsWith(fmt(x, 3) + ' ')); } },
  { id: 'um-g05', type: 'nat', level: 3, exams: EX[3], sub: 'dimensional analysis',
    make(rng) {
      const a = int(rng, 1, 3), b = choose(rng, [-2, -1, 1, 2]), t = choose(rng, [-2, -1, 1, 2]);
      const ask = choose(rng, ['L', 'T']);
      const answer = ask === 'L' ? a + b : -2 * a + t;
      return { a, b, t, ask, answer, tol: 0,
        q: `A quantity is defined as $Q = F^{${a}}\\,l^{${b}}\\,t^{${t}}$, where $F$ is force, $l$ is length and $t$ is time. The power of ${ask === 'L' ? '$L$' : '$T$'} in the dimensional formula of $Q$ is`,
        sol: `$[F] = MLT^{-2}$. So $[Q] = M^{${a}}L^{${a}}T^{${-2 * a}}\\cdot L^{${b}}\\cdot T^{${t}}$ = $M^{${a}}L^{${a + b}}T^{${-2 * a + t}}$. The power of ${ask} is ${answer}.` };
    },
    verify: (p) => { const v = [1, 1, -2].map((x) => x * p.a); v[1] += p.b; v[2] += p.t; return p.ask === 'L' ? v[1] : v[2]; } },
  { id: 'um-g06', type: 'mcq', level: 3, exams: EX[3], sub: 'unit conversion',
    make(rng) {
      const Q = choose(rng, [['force', 1, 1, -2, 'N'], ['energy', 1, 2, -2, 'J'], ['pressure', 1, -1, -2, 'Pa'], ['power', 1, 2, -3, 'W'], ['momentum', 1, 1, -1, 'kg m/s']]);
      const [name, a, b, c, un] = Q;
      const M2 = choose(rng, [2, 5, 10]), L2 = choose(rng, [2, 5, 10]), T2 = choose(rng, [2, 5, 10]);
      const unitSI = M2 ** a * L2 ** b * T2 ** c;
      const ans = 1 / unitSI;
      const cand = [unitSI, 1 / (M2 ** a * L2 ** b * T2 ** -c), ans * M2, ans * 2, ans / 2, ans * 10];
      const ws = []; for (const w of cand) if (w >= 0.001 && w < 1e5 && Math.abs(w - ans) > 0.02 * ans && ws.every((x) => Math.abs(x - w) > 0.02 * w)) ws.push(w);
      const o = numOpts(rng, ans, ws.slice(0, 3), '');
      return { options: o.options, answer: o.answer, a, b, c, M2, L2, T2, ans,
        q: `A system has unit of mass ${M2} kg, unit of length ${L2} m and unit of time ${T2} s. The numerical value of 1 ${un} (${name}) in this system is`,
        sol: `${name[0].toUpperCase() + name.slice(1)} has dimensions $M^{${a}}L^{${b}}T^{${c}}$. The new unit of ${name} equals ${M2}^${a} × ${L2}^${b} × ${T2}^${c} = ${fmt(unitSI, 4)} SI units. The number of new units in 1 SI unit is the reciprocal: ${fmt(ans, 4)}.` };
    },
    verify: (p) => { const x = (1 / p.M2) ** p.a * (1 / p.L2) ** p.b * (1 / p.T2) ** p.c; return p.options.findIndex((o) => Math.abs(parseFloat(o) - x) <= 0.005 * x); } },
  { id: 'um-g07', type: 'nat', level: 2, exams: EX[2], sub: 'significant figures',
    make(rng) {
      let xi, yi;
      do { xi = int(rng, 100, 999); yi = int(rng, 1000, 9999); } while (yi % 10 === 5 || ((xi * 10 + yi) % 100) === 50);
      const x = xi / 10, y = yi / 100;
      const sumH = xi * 10 + yi; // hundredths
      const answer = Math.round(sumH / 10) / 10;
      return { xi, yi, answer, tol: 0.001, unit: '',
        q: `Add the measured values ${x} cm (one decimal place) and ${y.toFixed(2)} cm (two decimal places) and give the result with the correct number of significant figures (decimal places).`,
        sol: `The sum is ${(sumH / 100).toFixed(2)}. The less precise value ${x} has one decimal place, so round to one decimal place: ${answer.toFixed(1)}.` };
    },
    verify: (p) => Math.round((p.xi / 10 + p.yi / 100) * 10) / 10 },
  { id: 'um-g08', type: 'nat', level: 3, exams: EX[3], sub: 'errors',
    make(rng) {
      const sphere = rng() < 0.5;
      const pm = pick(rng, 0.5, 3, 0.5), pr = pick(rng, 0.5, 2, 0.5), ph = pick(rng, 0.5, 2, 0.5);
      const answer = sphere ? pm + 3 * pr : pm + 2 * pr + ph;
      return { sphere, pm, pr, ph, answer, tol: 0.01, unit: '%',
        q: sphere ? `The density of a solid sphere is found from its mass and radius. The mass has a ${pm}% error and the radius has a ${pr}% error. Find the maximum percentage error in the density.`
          : `The density of a solid cylinder is found from its mass, diameter and height. The percentage errors are ${pm}% (mass), ${pr}% (diameter) and ${ph}% (height). Find the maximum percentage error in the density.`,
        sol: sphere ? `$\\rho = 3m/(4\\pi r^3)$, so error = ${pm} + 3×${pr} = ${fmt(answer, 4)}%.` : `$\\rho = 4m/(\\pi d^2h)$, so error = ${pm} + 2×${pr} + ${ph} = ${fmt(answer, 4)}%.` };
    },
    verify: (p) => p.pm + (p.sphere ? 3 * p.pr : 2 * p.pr + p.ph) },
  { id: 'um-g09', type: 'nat', level: 3, exams: EX[3], sub: 'errors',
    make(rng) {
      const L = int(rng, 50, 120), dL = 0.1, n = 20;
      const t = +(n * 2 * Math.PI * Math.sqrt(L / 100 / 9.8)).toFixed(1), dt = choose(rng, [0.1, 0.2]);
      const answer = (dL / L + 2 * dt / t) * 100;
      return { L, dL, t, dt, answer, tol: 0.02, unit: '%',
        q: `A simple pendulum of length ${L}.0 ± ${dL} cm takes ${t} ± ${dt} s for ${n} oscillations. Find the percentage error in the value of $g$ found from it.`,
        sol: `$g = 4\\pi^2 L/T^2$ and $T = t/${n}$, so the relative error is $\\Delta L/L + 2\\Delta t/t$ = ${dL}/${L} + 2×${dt}/${t} = ${fmt(answer / 100, 4)}, which is ${fmt(answer, 3)}%.` };
    },
    verify: (p) => 100 * p.dL / p.L + 200 * p.dt / p.t },
  { id: 'um-g10', type: 'nat', level: 3, exams: EX[3], sub: 'errors',
    make(rng) {
      const b = pick(rng, 10, 30, 0.5), d = pick(rng, 2, 8, 0.5), a = b + d;
      const da = choose(rng, [0.1, 0.2]), db = choose(rng, [0.1, 0.2]);
      const answer = (da + db) / d * 100;
      return { a, b, d, da, db, answer, tol: Math.max(0.02, answer * 0.01), unit: '%',
        q: `Two lengths are measured as $a = ${a}\\pm${da}$ cm and $b = ${b}\\pm${db}$ cm. Find the percentage error in the difference $a - b$.`,
        sol: `$a-b = ${d}$ cm. Absolute errors add: ${da} + ${db} = ${fmt(da + db, 3)} cm. Percentage error = ${fmt(da + db, 3)}/${d} × 100 = ${fmt(answer, 3)}%.` };
    },
    verify: (p) => ((p.da + p.db) / (p.a - p.b)) * 100 },
  { id: 'um-g11', type: 'nat', level: 1, exams: EX[1], sub: 'significant figures',
    make(rng) {
      const bank = [['0.00360', 3], ['4.050', 4], ['1.20 × 10<sup>3</sup>', 3], ['0.0500', 3], ['6.02 × 10<sup>23</sup>', 3], ['0.0007', 1], ['10.0', 3], ['5.000', 4], ['0.0102', 3], ['2.0 × 10<sup>-4</sup>', 2], ['0.20', 2], ['3008', 4]];
      const [txt, n] = choose(rng, bank);
      return { txt, n, answer: n, tol: 0,
        q: `How many significant figures does ${txt} have?`,
        sol: `Count every digit from the first non-zero digit on. Zeros between digits and trailing zeros after a decimal point count; leading zeros and powers of ten do not. So ${txt} has ${n}.` };
    },
    verify: (p) => { const m = p.txt.split(' ')[0].replace('.', '').replace(/^0+/, ''); return m.length; } },
  { id: 'um-g12', type: 'nat', level: 3, exams: EX[3], sub: 'errors',
    make(rng) {
      const V = pick(rng, 20, 120, 5), dV = pick(rng, 0.5, 3, 0.5), I = pick(rng, 2, 10, 1), dI = pick(rng, 0.1, 0.3, 0.1);
      const R = V / I, answer = R * (dV / V + dI / I);
      return { V, dV, I, dI, answer, tol: Math.max(0.01, answer * 0.02), unit: 'Ω',
        q: `A voltmeter reads $V = ${V}\\pm${dV}$ V and an ammeter reads $I = ${I}\\pm${dI}$ A. Find the absolute error in $R = V/I$, in ohm.`,
        sol: `$R = ${fmt(R, 4)}$ Ω. Relative error = ${dV}/${V} + ${dI}/${I} = ${fmt(dV / V + dI / I, 4)}. So $\\Delta R$ = ${fmt(R, 4)} × ${fmt(dV / V + dI / I, 4)} = ${fmt(answer, 3)} Ω.` };
    },
    verify: (p) => (p.V / p.I) * (p.dV / p.V) + (p.V / p.I) * (p.dI / p.I) },
  { id: 'um-g13', type: 'nat', level: 2, exams: EX[2], sub: 'errors',
    make(rng) {
      const b = pick(rng, 2, 9, 0.5);
      const xs = Array.from({ length: 5 }, () => +(b + int(rng, -30, 30) / 100).toFixed(2));
      const mean = xs.reduce((s, x) => s + x, 0) / 5;
      const answer = xs.reduce((s, x) => s + Math.abs(x - mean), 0) / 5;
      return { xs, answer, tol: 0.003, unit: '',
        q: `Five readings of a length are ${xs.join(', ')} cm. Find the mean absolute error (mean of |reading − mean|) in cm.`,
        sol: `Mean = ${fmt(mean, 5)} cm. The absolute deviations are ${xs.map((x) => fmt(Math.abs(x - mean), 3)).join(', ')}. Their mean is ${fmt(answer, 3)} cm.` };
    },
    verify: (p) => { const m = p.xs.reduce((s, x) => s + x, 0) / p.xs.length; let t = 0; for (const x of p.xs) t += x > m ? x - m : m - x; return t / p.xs.length; } },
  { id: 'um-g14', type: 'nat', level: 3, exams: EX[3], sub: 'vernier',
    make(rng) {
      const N = choose(rng, [10, 20]), lc = 1 / N;
      const main = int(rng, 10, 60), kk = int(rng, 2, N - 1), z = int(rng, 1, 4);
      const answer = +(main + (kk - z) * lc).toFixed(4);
      return { N, main, kk, z, lc, answer, tol: 0.001, unit: 'mm',
        q: `A vernier caliper has 1 MSD = 1 mm and ${N} VSD = ${N - 1} MSD. With the jaws closed the ${z === 1 ? '1st' : z === 2 ? '2nd' : z === 3 ? '3rd' : '4th'} vernier division coincides with a main scale line, and the vernier zero is to the right of the main zero. A rod is measured: main scale reading ${main} mm and the ${kk}th vernier division coincides. Find the length in mm.`,
        sol: `LC = 1/${N} = ${fmt(lc, 3)} mm. Zero error = +${z}×${fmt(lc, 3)} = +${fmt(z * lc, 3)} mm. Observed = ${main} + ${kk}×${fmt(lc, 3)} = ${fmt(main + kk * lc, 5)} mm. Correct = observed − zero error = ${fmt(answer, 5)} mm.` };
    },
    verify: (p) => p.main + p.kk * p.lc - p.z * p.lc },
  { id: 'um-g15', type: 'nat', level: 3, exams: EX[3], sub: 'mixed',
    make(rng) {
      const m = pick(rng, 1, 5, 0.5), dm = pick(rng, 0.02, 0.1, 0.02), v = pick(rng, 5, 25, 1), dv = pick(rng, 0.1, 0.5, 0.1);
      const answer = (dm / m + 2 * dv / v) * 100;
      return { m, dm, v, dv, answer, tol: Math.max(0.02, answer * 0.01), unit: '%',
        q: `A body has mass ${m} ± ${fmt(dm, 2)} kg and moves at ${v} ± ${dv} m/s. Find the maximum percentage error in its kinetic energy $\\tfrac12mv^2$.`,
        sol: `Relative error = Δm/m + 2Δv/v = ${fmt(dm, 2)}/${m} + 2×${dv}/${v} = ${fmt(dm / m + 2 * dv / v, 4)}, which is ${fmt(answer, 3)}%.` };
    },
    verify: (p) => 100 * p.dm / p.m + 200 * p.dv / p.v },
];

export default { topic: 'units-measurements', groups, items, gens };
