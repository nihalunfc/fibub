// Oscillations: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EX = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const PI = Math.PI; const g0 = 9.8;
let k = 0; let c = 0;
const nid = () => `os-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: EX[level], sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const nat = (level, sub, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
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
const f2 = (x) => fmt(x, 3);

const items = [
  // ---------- Level 1 ----------
  mcq(1, 'SHM basics', r`A particle moves as $y = 5\sin(4\pi t)$ (in cm, with $t$ in s). Its frequency is`, '2 Hz', ['4 Hz', '0.5 Hz', r`$4\pi$ Hz`],
    r`Compare with $y = A\sin\omega t$: $\omega = 4\pi\ \mathrm{rad\,s^{-1}}$. Frequency $f = \omega/2\pi = 2$ Hz. The $4\pi$ is the angular frequency in rad/s, not the frequency in Hz.`),
  mcq(1, 'SHM basics', r`For a particle in simple harmonic motion, at the mean position`, 'the speed is maximum and the acceleration is zero', ['the speed is zero and the acceleration is maximum', 'both speed and acceleration are maximum', 'both speed and acceleration are zero'],
    r`$a = -\omega^2x$ is zero at $x = 0$. Energy is all kinetic there, so $v = \omega A$ is the maximum.`),
  mcq(1, 'simple pendulum', r`The time period of a simple pendulum of length 1 m at a place where $g = 9.8\ \mathrm{m\,s^{-2}}$ is nearly`, '2 s', ['1 s', '4 s', '0.5 s'],
    r`$T = 2\pi\sqrt{L/g} = 2\pi\sqrt{1/9.8} = ${f2(2 * PI * Math.sqrt(1 / 9.8))}$ s, about 2 s. This is why a pendulum of length 1 m is called a seconds pendulum (each swing takes 1 s).`),
  mcq(1, 'energy in SHM', r`The total energy of a particle executing SHM is proportional to`, 'the square of its amplitude', ['its amplitude', 'the square root of its amplitude', 'the inverse of its amplitude'],
    r`$E = \tfrac12kA^2 = \tfrac12m\omega^2A^2\propto A^2$. Doubling the amplitude gives four times the energy.`),
  mcq(1, 'SHM basics', r`The acceleration of a particle in SHM is`, 'directed towards the mean position and proportional to the displacement from it', ['directed away from the mean position and proportional to the displacement', 'constant in magnitude and always towards the mean position', 'proportional to the velocity'],
    r`The defining relation is $a = -\omega^2x$. The minus sign means it points towards the mean position, and its size grows with the distance from it.`),
  nat(1, 'SHM basics', r`The time period of a body in SHM is 0.25 s. Find its frequency (in Hz).`, () => 1 / 0.25, 0,
    0, r`$f = 1/T = 1/0.25 = 4$ Hz.`, { unit: 'Hz' }),
  mcq(1, 'phase', r`In SHM, the phase difference between the displacement and the velocity is`, r`$\pi/2$`, [r`$0$`, r`$\pi$`, r`$2\pi$`],
    r`$x = A\sin\omega t$ gives $v = A\omega\cos\omega t = A\omega\sin(\omega t + \pi/2)$. The velocity leads the displacement by $\pi/2$ (a quarter of a cycle).`),
  nat(1, 'simple pendulum', r`Find the length of a seconds pendulum (period 2 s) at a place where $g = 9.8\ \mathrm{m\,s^{-2}}$ (in m, 3 decimals).`, () => 9.8 * 4 / (4 * PI * PI), 0.005, 3,
    r`$T = 2\pi\sqrt{L/g}\Rightarrow L = gT^2/4\pi^2 = 9.8\times4/39.478 = 0.993$ m.`, { unit: 'm' }),
  nat(1, 'spring-mass system', r`A body of mass 0.5 kg hangs from a spring of force constant 200 N/m and is set oscillating. Find its time period (in s, 3 decimals).`, () => 2 * PI * Math.sqrt(0.5 / 200), 0.003, 3,
    r`$T = 2\pi\sqrt{m/k} = 2\pi\sqrt{0.5/200} = 2\pi\times0.05 = 0.314$ s.`, { unit: 's' }),
  mcq(1, 'resonance', r`Resonance in a forced oscillation occurs when`, 'the frequency of the driving force equals the natural frequency of the oscillator', ['the driving force is the largest', 'the oscillator has no damping at all', 'the amplitude of the driving force is equal to that of the oscillator'],
    r`Near this match the system takes in energy from the driver most efficiently, and the amplitude is a maximum. The size of the driving force and the amount of damping decide how big the peak is, not whether it occurs.`),
  mcq(1, 'spring-mass system', r`A mass on a spring (horizontal, smooth table) is taken from the Earth to the Moon. Its time period`, 'remains the same', ['increases', 'decreases', 'becomes infinite'],
    r`$T = 2\pi\sqrt{m/k}$ has no $g$ in it. Mass and spring constant do not change, so the period does not change. (A pendulum, in contrast, does depend on $g$.)`),
  mcq(1, 'damped oscillations', r`The amplitude of a swing that is left to itself decreases slowly because`, 'energy is lost to air resistance and friction at the support', ['gravity weakens as the swing moves', 'the mass of the swing decreases', 'the time period changes'],
    r`Damping forces such as air drag do negative work on the swing, so its mechanical energy and amplitude fall. The motion is a damped oscillation.`),
  nat(1, 'velocity in SHM', r`A particle in SHM has amplitude 4 cm and angular frequency $10\ \mathrm{rad\,s^{-1}}$. Find its maximum speed (in cm/s).`, () => 4 * 10, 0,
    0, r`$v_{max} = A\omega = 4\times10 = 40$ cm/s.`, { unit: 'cm/s' }),
  mcq(1, 'periodic and SHM', r`Which of these motions is periodic but NOT simple harmonic?`, 'a ball bouncing elastically again and again on a hard floor', ['a mass hanging from a spring', 'a small-angle simple pendulum', 'the motion of a tuning-fork prong'],
    r`The bouncing ball repeats, but its acceleration is a constant $g$ downward (and a sudden impulse at the floor), not proportional to displacement. The other three have a linear restoring force for small displacements.`),
  mcq(1, 'energy in SHM', r`A particle in SHM has frequency $f$. The frequency with which its kinetic energy changes is`, r`$2f$`, [r`$f$`, r`$f/2$`, r`$4f$`],
    r`$K = \tfrac12kA^2\cos^2\omega t = \tfrac14kA^2(1 + \cos2\omega t)$. It changes at angular frequency $2\omega$, so at frequency $2f$ (it reaches its maximum twice in each cycle).`),
  nat(1, 'acceleration in SHM', r`A particle of amplitude 2 cm oscillates with angular frequency $25\ \mathrm{rad\,s^{-1}}$. Find its maximum acceleration (in $\mathrm{m\,s^{-2}}$, 1 decimal).`, () => 0.02 * 25 * 25, 0.05, 1,
    r`$a_{max} = A\omega^2 = 0.02\times25^2 = 12.5\ \mathrm{m\,s^{-2}}$. Convert the amplitude to metres first.`, { unit: 'm/s²' }),
  mcq(1, 'spring constant', r`The SI unit of the force constant (spring constant) $k$ is`, r`$\mathrm{N\,m^{-1}}$`, [r`$\mathrm{N\,m}$`, r`$\mathrm{N\,m^{-2}}$`, r`$\mathrm{N\,s\,m^{-1}}$`],
    r`$F = kx$, so $k = F/x$ has unit N per metre. N s/m is the unit of the damping constant $b$.`),
  mcq(1, 'simple pendulum', r`The mass of the bob of a simple pendulum is doubled. Its time period`, 'remains unchanged', ['becomes double', r`becomes $\sqrt2$ times`, 'becomes half'],
    r`$T = 2\pi\sqrt{L/g}$ does not contain $m$. The restoring force $mg\sin\theta$ and the inertia $m$ both double.`),

  // ---------- Level 2 ----------
  mcq(2, 'SHM equations', r`A particle moves as $x = 0.1\sin(20t + \pi/6)$ (SI units). Its displacement at $t = 0$ is`, '0.05 m', ['0.1 m', '0.087 m', 'zero'],
    r`Put $t = 0$: $x = 0.1\sin(\pi/6) = 0.1\times0.5 = 0.05$ m. The number inside the sine is the phase, and the phase constant $\pi/6$ is what remains at $t = 0$.`),
  nat(2, 'velocity in SHM', r`A particle of amplitude 5 cm oscillates with angular frequency $4\ \mathrm{rad\,s^{-1}}$. Find its speed when it is 3 cm from the mean position (in cm/s).`, () => 4 * Math.sqrt(25 - 9), 0,
    0, r`$v = \omega\sqrt{A^2 - x^2} = 4\sqrt{25 - 9} = 4\times4 = 16$ cm/s.`, { unit: 'cm/s' }),
  mcq(2, 'velocity in SHM', r`A particle in SHM has amplitude 10 cm. At what distance from the mean position is its speed half of the maximum speed?`, '8.66 cm', ['5 cm', '7.07 cm', '6.0 cm'],
    r`$v = \omega\sqrt{A^2 - x^2} = \tfrac12\omega A\Rightarrow A^2 - x^2 = A^2/4\Rightarrow x = A\sqrt3/2 = 8.66$ cm. Half the speed is not at half the displacement.`, { trap: 'Speed is not linear in displacement.' }),
  mcq(2, 'time in SHM', r`A particle in SHM starts from the mean position. The time it takes to reach a displacement $A/2$ is`, r`$T/12$`, [r`$T/8$`, r`$T/6$`, r`$T/4$`],
    r`$x = A\sin(2\pi t/T) = A/2\Rightarrow 2\pi t/T = \pi/6\Rightarrow t = T/12$. (From the extreme position, the same drop to $A/2$ would take $T/6$.)`),
  mcq(2, 'time in SHM', r`A particle starts from an extreme position. The time taken to reach the point halfway to the mean position is`, r`$T/6$`, [r`$T/12$`, r`$T/8$`, r`$T/4$`],
    r`$x = A\cos(2\pi t/T) = A/2\Rightarrow 2\pi t/T = \pi/3\Rightarrow t = T/6$. The particle is slowest near the extreme, so this half-distance takes longer than the half-distance from the mean position ($T/12$).`),
  nat(2, 'springs in series', r`Two springs of force constants 300 N/m and 600 N/m are joined end to end (series). A 2 kg mass is attached to the combination. Find the time period of oscillation (in s, 3 decimals).`, () => 2 * PI * Math.sqrt(2 / 200), 0.003, 3,
    r`Series: $\dfrac1{k_{eq}} = \dfrac1{300} + \dfrac1{600} = \dfrac{3}{600}\Rightarrow k_{eq} = 200$ N/m. $T = 2\pi\sqrt{m/k_{eq}} = 2\pi\sqrt{2/200} = 0.628$ s.`, { unit: 's', trap: 'Springs in series add reciprocals, not the constants.' }),
  nat(2, 'springs in parallel', r`A mass of 0.6 kg is attached to two identical springs of constant 150 N/m each, joined side by side (parallel). Find the angular frequency of oscillation (in $\mathrm{rad\,s^{-1}}$, 2 decimals).`, () => Math.sqrt(300 / 0.6), 0.02, 2,
    r`Parallel: $k_{eq} = 150 + 150 = 300$ N/m. $\omega = \sqrt{k_{eq}/m} = \sqrt{300/0.6} = \sqrt{500} = 22.36\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  mcq(2, 'spring cutting', r`A spring of force constant $k$ is cut into three equal parts. The force constant of each part is`, r`$3k$`, [r`$k/3$`, r`$k$`, r`$9k$`],
    r`A spring's extension for a given force is proportional to its length. One-third the length gives one-third the extension, so the force constant becomes three times: $3k$. A mass on one piece oscillates $\sqrt3$ times faster than on the full spring.`),
  mcq(2, 'energy in SHM', r`A particle in SHM is at a distance $A/2$ from the mean position. The fraction of its total energy that is kinetic is`, r`$3/4$`, [r`$1/4$`, r`$1/2$`, r`$1/\sqrt2$`],
    r`$U = \tfrac12kx^2 = \tfrac12k(A/2)^2 = \tfrac14E$. So $K = E - U = \tfrac34E$.`),
  nat(2, 'energy in SHM', r`A body attached to a spring of constant 360 N/m oscillates with amplitude 10 cm. Find the total energy of the oscillation (in J, 1 decimal).`, () => 0.5 * 360 * 0.1 * 0.1, 0.05, 1,
    r`$E = \tfrac12kA^2 = \tfrac12\times360\times(0.10)^2 = 1.8$ J.`, { unit: 'J' }),
  mcq(2, 'pendulum in a lift', r`A simple pendulum has period $T$ in a lift at rest. The lift now accelerates upward at $g/3$. The period becomes`, r`$\dfrac{\sqrt3}{2}\,T$`, [r`$\dfrac{2}{\sqrt3}\,T$`, r`$\sqrt{\dfrac32}\,T$`, r`$\dfrac{3}{4}\,T$`],
    r`In the lift the effective gravity is $g_{eff} = g + a = g + g/3 = 4g/3$. $T' = 2\pi\sqrt{L/g_{eff}} = T\sqrt{3/4} = \dfrac{\sqrt3}{2}T$.`),
  mcq(2, 'pendulum in a lift', r`A simple pendulum is hung from the ceiling of a lift that is falling freely. The pendulum`, 'does not oscillate; the bob stays where it is placed relative to the lift', ['oscillates with a very long period', 'oscillates with the same period as on the ground', 'oscillates with a smaller period'],
    r`In free fall $g_{eff} = 0$. There is no restoring force, so $T = 2\pi\sqrt{L/g_{eff}}\to\infty$. The bob stays wherever it is pushed (or moves in a circle if given a push).`),
  nat(2, 'simple pendulum', r`The length of a simple pendulum is increased by 21 %. Find the percentage increase in its period.`, () => (Math.sqrt(1.21) - 1) * 100, 0,
    0, r`$T\propto\sqrt L$. New $T/T_0 = \sqrt{1.21} = 1.1$, an increase of 10 %. (Half of 21 % would be 10.5 %, which is only an approximation that works for small changes.)`, { unit: '%', trap: 'The "half the percentage" shortcut is only good for small changes.' }),
  nat(2, 'pendulum clock', r`A pendulum clock is carried to a hilltop where $g$ is 0.02 % smaller. How many seconds does it lose in a day (24 h)? Use $\Delta T/T = -\tfrac12\Delta g/g$ for small changes.`, () => 86400 * 0.5 * 0.0002, 0.05, 2,
    r`$\Delta T/T = \tfrac12\times0.02\,\% = 0.01\,\% = 10^{-4}$. The clock runs slow by this fraction: $86\,400\times10^{-4} = 8.64$ s lost per day.`, { unit: 's' }),
  mcq(2, 'superposition of SHM', r`Two SHMs along the same line, $x_1 = 3\sin\omega t$ and $x_2 = 4\cos\omega t$ (cm), are superposed. The amplitude of the resultant motion is`, '5 cm', ['7 cm', '1 cm', '3.5 cm'],
    r`$\cos\omega t = \sin(\omega t + \pi/2)$, so the two motions are $90°$ out of phase. $A = \sqrt{3^2 + 4^2 + 2\cdot3\cdot4\cos90°} = 5$ cm.`),
  nat(2, 'floating body', r`A wooden block of mass 0.4 kg and cross-sectional area $20\ \mathrm{cm^2}$ floats upright in water (density $1000\ \mathrm{kg\,m^{-3}}$). It is pressed slightly and released. Find the period of its up-and-down oscillation (in s, 3 decimals; $g = 9.8$).`, () => 2 * PI * Math.sqrt(0.4 / (1000 * 0.002 * 9.8)), 0.005, 3,
    r`Extra upthrust for a push $y$ is $\rho gAy$, so $k = \rho gA = 1000\times9.8\times0.002 = 19.6$ N/m. $T = 2\pi\sqrt{m/k} = 2\pi\sqrt{0.4/19.6} = 0.898$ s.`, { unit: 's' }),
  nat(2, 'liquid in a U-tube', r`A column of liquid of total length 0.98 m in a uniform U-tube is disturbed slightly. Find the period of its oscillation (in s, 3 decimals; $g = 9.8$, no friction).`, () => 2 * PI * Math.sqrt(0.98 / (2 * 9.8)), 0.005, 3,
    r`If the level in one arm rises by $y$, the other falls by $y$, so the height difference is $2y$ and the restoring force is $2y\rho Ag$. With mass $\rho AL$: $a = -(2g/L)y$, so $T = 2\pi\sqrt{L/2g} = 2\pi\sqrt{0.98/19.6} = 1.405$ s.`, { unit: 's', trap: 'It is $L/2g$, not $L/g$.' }),
  nat(2, 'damped oscillations', r`The amplitude of a damped oscillator falls to half its value in 20 s. In how many seconds from the start will it have fallen to $\tfrac18$ of the original value?`, () => 60, 0,
    0, r`Amplitude decays exponentially, $A = A_0e^{-\gamma t}$, so it halves in every 20 s. $\tfrac18 = (\tfrac12)^3$ needs three half-lives: $3\times20 = 60$ s.`, { unit: 's' }),
  mcq(2, 'forced oscillations', r`A body is driven by a periodic force whose frequency is far below the natural frequency of the body. The body`, 'follows the force, in phase with it, with a small amplitude', ['oscillates with a very large amplitude', 'oscillates at its own natural frequency', 'stays at rest'],
    r`Well below resonance the system just follows the force slowly (like pushing a spring gently), with displacement $\approx F_0/k$ in phase with the force. In steady state it oscillates at the driving frequency, not its natural one.`),
  nat(2, 'torsional oscillations', r`A disc of moment of inertia $0.02\ \mathrm{kg\,m^2}$ hangs from a wire of torsion constant $0.5\ \mathrm{N\,m\,rad^{-1}}$. Find the time period of its twist oscillations (in s, 3 decimals).`, () => 2 * PI * Math.sqrt(0.02 / 0.5), 0.003, 3,
    r`Torque $\tau = -C\theta$ and $I\alpha = \tau$ give $T = 2\pi\sqrt{I/C} = 2\pi\sqrt{0.04} = 1.257$ s.`, { unit: 's' }),
  nat(2, 'spring-mass system', r`A mass hanging from a vertical spring stretches it by 4.9 cm in equilibrium. It is pulled down a little and released. Find the time period (in s, 3 decimals; $g = 9.8$).`, () => 2 * PI * Math.sqrt(0.049 / 9.8), 0.003, 3,
    r`At equilibrium $mg = ke$, so $m/k = e/g$. $T = 2\pi\sqrt{m/k} = 2\pi\sqrt{e/g} = 2\pi\sqrt{0.049/9.8} = 0.444$ s. No need to know $m$ or $k$ separately.`, { unit: 's' }),
  mcq(2, 'phase', r`A particle in SHM is at $x = A/2$ at $t = 0$ and is moving towards the positive direction. If $x = A\sin(\omega t + \phi)$, then $\phi$ equals`, r`$\pi/6$`, [r`$5\pi/6$`, r`$\pi/3$`, r`$\pi/2$`],
    r`At $t = 0$: $\sin\phi = 1/2$, so $\phi = \pi/6$ or $5\pi/6$. The velocity is $A\omega\cos\phi$, positive only for $\phi = \pi/6$. The sign of $\cos\phi$ picks between the two.`, { trap: 'Both $\pi/6$ and $5\pi/6$ give the same position; the direction decides.' }),
  nat(2, 'spring-mass system', r`A mass of 0.2 kg on a spring has period 0.5 s. After adding another 0.6 kg to it, what is the new period (in s, 2 decimals)?`, () => 0.5 * Math.sqrt(0.8 / 0.2), 0.01, 2,
    r`$T\propto\sqrt m$. The mass goes from 0.2 to 0.8 kg (four times), so the period doubles: $T' = 0.5\times2 = 1.00$ s.`, { unit: 's' }),
  nat(2, 'velocity in SHM', r`A particle of amplitude 2 cm completes one oscillation every 0.5 s. Find its maximum speed (in $\mathrm{m\,s^{-1}}$, 3 decimals).`, () => 0.02 * 2 * PI / 0.5, 0.003, 3,
    r`$\omega = 2\pi/T = 4\pi$ rad/s. $v_{max} = A\omega = 0.02\times4\pi = 0.251\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(2, 'resonance', r`Soldiers are told to break step while crossing a bridge. This is to avoid`, 'resonance between the marching rhythm and the natural frequency of the bridge', ['the bridge becoming too heavy', 'damping of the bridge', 'beats between footsteps'],
    r`Regular steps at the bridge's natural frequency would feed energy into it every cycle, building up a large amplitude that could damage it. Breaking step removes the regular driving.`),
  nat(2, 'SHM equations', r`The acceleration of a particle is $a = -25x$ (SI units). Find the frequency of its oscillation (in Hz, 3 decimals).`, () => Math.sqrt(25) / (2 * PI), 0.003, 3,
    r`Compare with $a = -\omega^2x$: $\omega^2 = 25$, $\omega = 5$ rad/s. $f = \omega/2\pi = 5/6.283 = 0.796$ Hz.`, { unit: 'Hz' }),
  mcq(2, 'energy in SHM', r`The average kinetic energy of a particle in SHM over one complete cycle, if its total energy is $E$, is`, r`$E/2$`, [r`$E$`, r`$E/4$`, r`$2E/3$`],
    r`$K = E\cos^2\omega t$ averages to $E/2$ over a cycle, and so does $U$. The averages over time are equal; the averages over displacement are not (average $K$ over distance is $2E/3$).`),
  mcq(2, 'graphs of SHM', r`The graph of velocity against displacement for a particle in SHM is`, 'an ellipse', ['a straight line through the origin', 'a parabola', 'a circle for every system'],
    r`$v^2 = \omega^2(A^2 - x^2)$ gives $\dfrac{x^2}{A^2} + \dfrac{v^2}{\omega^2A^2} = 1$, an ellipse with semi-axes $A$ and $\omega A$. It is a circle only if $v/\omega$ is plotted.`),

  // ---------- Level 3 ----------
  nat(3, 'physical pendulum', r`A uniform rod of length 1.2 m is hung from one end and swings in a vertical plane through small angles. Find its time period (in s, 3 decimals; $g = 9.8$).`, () => 2 * PI * Math.sqrt(2 * 1.2 / (3 * 9.8)), 0.005, 3,
    r`For a physical pendulum $T = 2\pi\sqrt{I/(mgd)}$. Here $I = \tfrac13mL^2$ about the end and $d = L/2$, so $T = 2\pi\sqrt{2L/3g} = 2\pi\sqrt{2.4/29.4} = 1.795$ s. It matches a simple pendulum of length $2L/3 = 0.8$ m.`, { unit: 's', trap: 'Use $I$ about the pivot, not about the centre.' }),
  mcq(3, 'physical pendulum', r`A uniform rod of length $L$ can be pivoted about a horizontal axis at distance $d$ from its centre. For which $d$ is the period of small oscillations a minimum?`, r`$L/\sqrt{12}$`, [r`$L/2$`, r`$L/4$`, r`$L/6$`],
    r`$I = \dfrac{mL^2}{12} + md^2$, so $T = 2\pi\sqrt{\dfrac{L^2/12 + d^2}{gd}}$. Minimise $f(d) = \dfrac{L^2}{12d} + d$: $f' = 0$ gives $d^2 = L^2/12$, $d = L/\sqrt{12} = 0.289L$. (This is the radius of gyration about the centre.)`),
  nat(3, 'physical pendulum', r`A thin ring of radius 0.49 m hangs from a nail through its rim, and swings in its own plane. Find the time period for small angles (in s, 3 decimals; $g = 9.8$).`, () => 2 * PI * Math.sqrt(2 * 0.49 / 9.8), 0.005, 3,
    r`About the rim $I = mR^2 + mR^2 = 2mR^2$ and $d = R$. $T = 2\pi\sqrt{2mR^2/(mgR)} = 2\pi\sqrt{2R/g} = 2\pi\sqrt{0.98/9.8} = 1.987$ s.`, { unit: 's' }),
  mcq(3, 'physical pendulum', r`A ring and a disc of the same radius $R$ are each hung from a point on the rim and oscillate in their own planes. The ratio $T_{ring}/T_{disc}$ is`, r`$\dfrac{2}{\sqrt3}$`, [r`$\sqrt{\dfrac32}$`, r`$1$`, r`$\dfrac{\sqrt3}{2}$`],
    r`Ring: $I = 2mR^2$, so $T = 2\pi\sqrt{2R/g}$. Disc: $I = \tfrac32mR^2$, so $T = 2\pi\sqrt{3R/2g}$. Ratio $=\sqrt{2/(3/2)} = \sqrt{4/3} = 2/\sqrt3$.`),
  nat(3, 'pendulum in a vehicle', r`A simple pendulum of length 1 m hangs in a car that accelerates horizontally at $7.35\ \mathrm{m\,s^{-2}}$ ($=0.75g$). Find the period of its small oscillations about the new equilibrium (in s, 3 decimals; $g = 9.8$).`, () => 2 * PI * Math.sqrt(1 / Math.hypot(9.8, 7.35)), 0.005, 3,
    r`In the car's frame the effective gravity is $g_{eff} = \sqrt{g^2 + a^2} = \sqrt{9.8^2 + 7.35^2} = 12.25\ \mathrm{m\,s^{-2}}$. $T = 2\pi\sqrt{L/g_{eff}} = 2\pi\sqrt{1/12.25} = 1.795$ s.`, { unit: 's', trap: '$g + a$ is only for vertical acceleration; for horizontal acceleration add as vectors.' }),
  mcq(3, 'pendulum in a vehicle', r`A pendulum hangs at rest relative to a train that accelerates horizontally at $a = g/\sqrt3$. The string makes an angle with the vertical of`, r`$30°$`, [r`$60°$`, r`$45°$`, r`$15°$`],
    r`In the train's frame the bob is acted on by $mg$ down and $ma$ backward. $\tan\theta = a/g = 1/\sqrt3\Rightarrow\theta = 30°$.`),
  nat(3, 'pendulum in a liquid', r`A simple pendulum has period 2.00 s in air. Its bob has density four times that of a liquid. The bob is made to oscillate fully inside the liquid. Ignoring viscous drag, find the period (in s, 3 decimals).`, () => 2 / Math.sqrt(1 - 1 / 4), 0.005, 3,
    r`Upthrust $= \tfrac14mg$ upward on the bob, so $g_{eff} = g(1 - \sigma/\rho) = \tfrac34g$. $T = 2/\sqrt{3/4} = 2\times1.1547 = 2.309$ s.`, { unit: 's', trap: 'The upthrust reduces the effective weight, so the period is longer.' }),
  nat(3, 'tunnel through the Earth', r`A smooth tunnel is bored through the centre of a uniform Earth ($R = 6400$ km, $g = 9.8\ \mathrm{m\,s^{-2}}$). A stone dropped in it oscillates. Find the period (in minutes, 1 decimal).`, () => 2 * PI * Math.sqrt(6.4e6 / 9.8) / 60, 0.1, 1,
    r`Inside a uniform Earth $g' = gr/R$, so $a = -(g/R)r$: SHM with $\omega^2 = g/R$. $T = 2\pi\sqrt{R/g} = 2\pi\sqrt{6.4\times10^6/9.8} = 5078$ s $= 84.6$ min.`, { unit: 'min' }),
  mcq(3, 'tunnel through the Earth', r`A smooth straight tunnel is dug along a chord of a uniform Earth, not through the centre. A ball released at one end oscillates to the other end. Compared with the period for a tunnel through the centre, its period is`, 'the same', ['longer', 'shorter', 'zero'],
    r`Along the chord the component of the force $m(g/R)r$ is $m(g/R)x$, where $x$ is the distance from the chord's midpoint. So $\omega^2 = g/R$ for every chord, and the period is always 84.6 min.`, { trap: 'A shorter tunnel is not faster: the force is also smaller.' }),
  nat(3, 'tunnel through the Earth', r`A stone falls from the surface through a smooth tunnel through the centre of a uniform Earth ($R = 6400$ km, $g = 9.8$). Find its speed at the centre (in km/s, 2 decimals).`, () => Math.sqrt(9.8 * 6.4e6) / 1000, 0.02, 2,
    r`$v_{max} = A\omega = R\sqrt{g/R} = \sqrt{gR} = \sqrt{9.8\times6.4\times10^6} = 7.92$ km/s, the same as the circular orbital speed near the surface.`, { unit: 'km/s' }),
  nat(3, 'floating body', r`A uniform cylinder of height 0.2 m and density $500\ \mathrm{kg\,m^{-3}}$ floats upright in water. Find the period of its small vertical oscillations (in s, 3 decimals; $g = 9.8$).`, () => 2 * PI * Math.sqrt(0.2 * 500 / (1000 * 9.8)), 0.005, 3,
    r`Mass $m = \rho hA$; restoring constant $k = \sigma gA$. $T = 2\pi\sqrt{\dfrac{\rho h}{\sigma g}} = 2\pi\sqrt{\dfrac{500\times0.2}{1000\times9.8}} = 0.635$ s. Cross-section cancels.`, { unit: 's' }),
  nat(3, 'two-body oscillation', r`Two blocks of masses 1 kg and 3 kg lie on a smooth table, joined by a spring of constant 300 N/m. They are pulled apart and released. Find the angular frequency of the oscillation (in $\mathrm{rad\,s^{-1}}$).`, () => Math.sqrt(300 / (1 * 3 / 4)), 0,
    0, r`For two bodies joined by a spring, $\omega = \sqrt{k/\mu}$ with reduced mass $\mu = \dfrac{m_1m_2}{m_1 + m_2} = \dfrac{3}{4} = 0.75$ kg. $\omega = \sqrt{300/0.75} = 20\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s', trap: 'Using $m = 1$ kg or $4$ kg alone is wrong.' }),
  nat(3, 'springs on both sides', r`A 1.5 kg block lies on a smooth table between two fixed walls, joined to the walls by springs of constant 120 N/m and 180 N/m. Find the angular frequency of its oscillation (in $\mathrm{rad\,s^{-1}}$, 2 decimals).`, () => Math.sqrt(300 / 1.5), 0.02, 2,
    r`When the block moves by $x$ one spring stretches and the other compresses, and both push it back: $F = -(k_1 + k_2)x$. $\omega = \sqrt{300/1.5} = \sqrt{200} = 14.14\ \mathrm{rad\,s^{-1}}$. They are in parallel, not series.`, { unit: 'rad/s' }),
  mcq(3, 'superposition of SHM', r`$x_1 = 5\sin\omega t$ and $x_2 = 5\sin(\omega t + 2\pi/3)$ (cm) act on the same particle. The amplitude of the resultant is`, '5 cm', ['10 cm', r`$5\sqrt3$ cm`, '0'],
    r`$A = \sqrt{A_1^2 + A_2^2 + 2A_1A_2\cos\phi} = \sqrt{25 + 25 + 50\cos120°} = \sqrt{50 - 25} = 5$ cm. (Or use phasors: two equal vectors $120°$ apart add to a vector of the same length.)`),
  mcq(3, 'Lissajous figures', r`$x = a\sin\omega t$ and $y = a\sin(\omega t + \pi/2)$ are the coordinates of a particle. The path is`, 'a circle', ['a straight line', 'an ellipse with unequal axes', 'a figure of eight'],
    r`$y = a\cos\omega t$, so $x^2 + y^2 = a^2$: a circle. With phase $0$ or $\pi$ the path would be a straight line; with equal amplitudes and $\pi/2$ the ellipse becomes a circle.`),
  mcq(3, 'Lissajous figures', r`$x = a\sin\omega t$ and $y = a\sin2\omega t$ are the coordinates of a particle. The path is`, 'a figure of eight', ['a circle', 'a parabola', 'a straight line'],
    r`With frequency ratio $1:2$ and zero phase, $y = 2a\sin\omega t\cos\omega t = 2x\sqrt{1 - x^2/a^2}$, so $y^2 = 4x^2(1 - x^2/a^2)$: two loops joined at the origin, a figure of eight (lying on its side).`),
  nat(3, 'superposition of SHM', r`A particle is acted on by two SHMs $x = \sin 6t + \sin 9t$ (SI units). Find the time period of the resulting periodic motion (in s, 3 decimals).`, () => 2 * PI / 3, 0.003, 3,
    r`The periods are $2\pi/6$ and $2\pi/9$. The motion repeats when both repeat: the common period is $2\pi/\gcd(6,9) = 2\pi/3 = 2.094$ s (the shorter period is $T_1/3$ and $T_2/2$ of this). The combined motion is not SHM.`, { unit: 's', trap: 'Period is $2\\pi/3$, not $2\\pi/15$.' }),
  nat(3, 'damped oscillations', r`A damped oscillator has mass 0.2 kg and damping constant $b = 0.05\ \mathrm{kg\,s^{-1}}$ (force $= -bv$). The amplitude decays as $A_0e^{-bt/2m}$. After how many seconds does the amplitude fall to $1/e$ of $A_0$?`, () => 2 * 0.2 / 0.05, 0,
    0, r`$e^{-bt/2m} = e^{-1}\Rightarrow t = 2m/b = 0.4/0.05 = 8$ s. (The energy, which goes as $A^2$, falls to $1/e$ in half this time, 4 s.)`, { unit: 's' }),
  nat(3, 'damped oscillations', r`A body of mass 1 kg on a spring of constant 100 N/m is damped with force $-bv$, $b = 12\ \mathrm{kg\,s^{-1}}$. Its angular frequency is $\omega' = \sqrt{k/m - b^2/4m^2}$. Find $\omega'$ (in $\mathrm{rad\,s^{-1}}$).`, () => Math.sqrt(100 - 144 / 4), 0,
    0, r`$\omega' = \sqrt{100/1 - 144/4} = \sqrt{100 - 36} = 8\ \mathrm{rad\,s^{-1}}$, a little below the undamped $10\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  mcq(3, 'phase in SHM', r`For a particle in SHM, the acceleration compared with the velocity`, r`leads in phase by $\pi/2$`, [r`lags in phase by $\pi/2$`, r`is in phase`, r`is opposite in phase`],
    r`$x = A\sin\omega t$, $v = A\omega\sin(\omega t + \pi/2)$, $a = A\omega^2\sin(\omega t + \pi)$. Each derivative leads the one before by $\pi/2$, so $a$ leads $v$ by $\pi/2$ and leads $x$ by $\pi$.`),
  nat(3, 'energy in SHM', r`A particle of amplitude 10 cm is in SHM. At what distance from the mean position are its kinetic and potential energies equal (in cm, 2 decimals)?`, () => 10 / Math.SQRT2, 0.02, 2,
    r`$\tfrac12kx^2 = \tfrac12\cdot\tfrac12kA^2\Rightarrow x = A/\sqrt2 = 10/1.414 = 7.07$ cm.`, { unit: 'cm' }),
  mcq(3, 'energy in SHM', r`A particle starts from the mean position in SHM of period $T$. After what time is its kinetic energy first equal to its potential energy?`, r`$T/8$`, [r`$T/4$`, r`$T/6$`, r`$T/12$`],
    r`$K = U$ at $x = A/\sqrt2$. With $x = A\sin(2\pi t/T)$: $2\pi t/T = \pi/4$, $t = T/8$.`),
  mcq(3, 'spring on an incline', r`A mass on a spring of constant $k$ rests on a smooth incline of angle $\theta$, the spring along the slope. The period of oscillation is`, r`$2\pi\sqrt{m/k}$, independent of $\theta$`, [r`$2\pi\sqrt{m/(k\sin\theta)}$`, r`$2\pi\sqrt{m/(k\cos\theta)}$`, r`$2\pi\sqrt{m\sin\theta/k}$`],
    r`Along the slope, $mg\sin\theta$ only shifts the equilibrium position by $mg\sin\theta/k$. About that new equilibrium the restoring force is still $-kx$, so $T = 2\pi\sqrt{m/k}$.`),
  nat(3, 'conditions for SHM', r`A small block of mass $m$ rests on a platform that oscillates vertically in SHM of angular frequency $14\ \mathrm{rad\,s^{-1}}$. Find the largest amplitude (in cm) for which the block stays in contact with the platform ($g = 9.8$).`, () => 9.8 / 196 * 100, 0,
    0, r`The block leaves the platform when the platform's downward acceleration $A\omega^2$ exceeds $g$. So $A_{max} = g/\omega^2 = 9.8/196 = 0.05$ m $= 5$ cm.`, { unit: 'cm', trap: 'Convert to cm at the end.' }),
  nat(3, 'finding g', r`In an experiment, a graph of $T^2$ (s$^2$) against $L$ (m) for a simple pendulum is a straight line of slope $4.00\ \mathrm{s^2\,m^{-1}}$. Find $g$ (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, () => 4 * PI * PI / 4, 0.02, 2,
    r`$T^2 = (4\pi^2/g)L$, so slope $= 4\pi^2/g$ and $g = 4\pi^2/4.00 = 9.87\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  nat(3, 'finding g', r`In measuring $g$ with a simple pendulum, the length has an error of 1 % and the period has an error of 0.5 %. Find the maximum percentage error in $g$.`, () => 1 + 2 * 0.5, 0,
    0, r`$g = 4\pi^2L/T^2$. Maximum fractional error: $\dfrac{\Delta g}{g} = \dfrac{\Delta L}{L} + 2\dfrac{\Delta T}{T} = 1 + 2\times0.5 = 2\ \%$.`, { unit: '%', trap: 'The period appears squared, so its error counts twice.' }),
  mcq(3, 'pendulum in a lift', r`A simple pendulum is in a lift that moves upward at a constant speed of $5\ \mathrm{m\,s^{-1}}$. Compared with its period when the lift is at rest, the period is`, 'the same', ['shorter', 'longer', 'dependent on the lift speed'],
    r`Constant velocity means zero acceleration, so the lift is an inertial frame and $g_{eff} = g$. Only acceleration, not velocity, changes the period.`),
  nat(3, 'time in SHM', r`A particle in SHM has amplitude 5 cm and period 2 s. Its average speed while it moves from the extreme position to the point $x = A/2$ is (in cm/s, 1 decimal).`, () => 3 * 5 / 2, 0.05, 1,
    r`From $x = A$ to $x = A/2$ takes $T/6 = 1/3$ s (phase change $\pi/3$). Distance $= A/2 = 2.5$ cm. Average speed $=2.5/(1/3) = 7.5$ cm/s. Do not use $\omega\sqrt{A^2 - x^2}$: that is the speed at one instant.`, { unit: 'cm/s', trap: 'Average speed over an interval is distance over time.' }),
  nat(3, 'long pendulum', r`A simple pendulum has length equal to the radius of the Earth (6400 km). Using $T = 2\pi\sqrt{\dfrac{1}{g}\left(\dfrac1L + \dfrac1R\right)^{-1}}$ with $g = 9.8$, find its period (in minutes, 1 decimal).`, () => 2 * PI * Math.sqrt(1 / (9.8 * (1 / 6.4e6 + 1 / 6.4e6))) / 60, 0.1, 1,
    r`For $L = R$: $\left(\dfrac1L + \dfrac1R\right)^{-1} = R/2$. $T = 2\pi\sqrt{R/2g} = 84.6/\sqrt2 = 59.8$ min. For $L\to\infty$ the period tends to $2\pi\sqrt{R/g} = 84.6$ min, not infinity.`, { unit: 'min', sub: 'long pendulum' }),
  mcq(3, 'time in SHM', r`A particle in SHM goes from $x = -A/2$ to $x = +A/2$ through the mean position. The time taken is`, r`$T/6$`, [r`$T/12$`, r`$T/4$`, r`$T/3$`],
    r`$-A/2\to0$ takes $T/12$ and $0\to A/2$ takes $T/12$ more: total $T/6$. (Moving quickly through the middle makes this short.)`),
  nat(3, 'spring-mass system', r`A mass hangs at rest from a spring, stretching it by 10 cm. It is now pulled a further 10 cm down and released. Find its maximum speed (in $\mathrm{m\,s^{-1}}$, 2 decimals; $g = 9.8$).`, () => 0.1 * Math.sqrt(9.8 / 0.1), 0.01, 2,
    r`$\omega^2 = k/m = g/e = 9.8/0.1 = 98$, $\omega = 9.90$ rad/s. The amplitude is the extra 10 cm: $v_{max} = A\omega = 0.1\times9.90 = 0.99\ \mathrm{m\,s^{-1}}$. The amplitude is measured from the equilibrium, not from the natural length.`, { unit: 'm/s', trap: 'The amplitude is 10 cm, not 20 cm.' }),
  mcq(3, 'pendulum at a height', r`A seconds pendulum is taken to a height equal to the Earth's radius above the surface. Its period becomes`, '4 s', ['2 s', '8 s', '1 s'],
    r`At $h = R$ the distance is $2R$, so $g' = g/4$. $T\propto1/\sqrt g$ doubles: $T' = 4$ s.`),
  mcq(3, 'spring in a lift', r`A mass hangs on a spring in a lift. The lift now accelerates upward. Compared with the lift at rest, the time period of the mass is`, 'the same, but the equilibrium extension is larger', ['smaller, and the extension is larger', 'larger, and the extension is the same', 'the same, and the extension is the same'],
    r`$T = 2\pi\sqrt{m/k}$ has no $g$. The effective gravity $g + a$ only increases the static extension $m(g + a)/k$. The oscillation is about this new equilibrium.`, { trap: 'Unlike the simple pendulum, a spring-mass period ignores $g$ and $a$.' }),

  // ---------- Level 4 ----------
  nat(4, 'collision and SHM', r`A 0.2 kg lump of putty moving at $10\ \mathrm{m\,s^{-1}}$ along the axis of a spring (constant 200 N/m) hits a 1.8 kg block at rest on a smooth table and sticks to it. The block is joined to the spring, which is at its natural length. Find the amplitude of the oscillation that follows (in cm).`, () => (0.2 * 10 / 2) / Math.sqrt(200 / 2) * 100, 0,
    0, r`Momentum is conserved in the sticking: $V = \dfrac{0.2\times10}{2.0} = 1\ \mathrm{m\,s^{-1}}$. The block is at the mean position, so this is $v_{max}$. $\omega = \sqrt{200/2} = 10\ \mathrm{rad\,s^{-1}}$ and $A = V/\omega = 0.1$ m $= 10$ cm.`, { unit: 'cm', sub: 'mixed', trap: 'Use the combined mass 2 kg in $\\omega$.' }),
  nat(4, 'change of mass', r`A 3 kg block oscillates on a smooth table with amplitude 8 cm on a spring. At the instant it passes the mean position, a 1 kg lump of putty drops on it and sticks. Find the new amplitude (in cm, 2 decimals).`, () => 8 * Math.sqrt(3 / 4), 0.02, 2,
    r`Putty falls vertically, so horizontal momentum is conserved: $3v = 4v'$, $v' = \tfrac34v$. At the mean position $v = A\omega$ and $v' = A'\omega'$ with $\omega' = \omega\sqrt{3/4}$. So $A' = \dfrac{\tfrac34A\omega}{\omega\sqrt{3/4}} = A\sqrt{3/4} = 8\times0.866 = 6.93$ cm.`, { unit: 'cm', trap: 'If the putty were added at the extreme position the amplitude would not change.' }),
  nat(4, 'vertical spring', r`A 0.5 kg block is attached to a vertical spring of constant 49 N/m, held at the spring's natural length, and released from rest. Find the greatest extension of the spring (in cm; $g = 9.8$).`, () => 2 * 0.5 * 9.8 / 49 * 100, 0,
    0, r`The equilibrium extension is $mg/k = 4.9/49 = 0.1$ m. The block starts at rest at the natural length, which is $0.1$ m from equilibrium, so the amplitude is $0.1$ m. The greatest extension is $0.1 + 0.1 = 0.2$ m $= 20$ cm, which is $2mg/k$.`, { unit: 'cm', trap: 'The extension at the lowest point is twice the equilibrium extension.' }),
  nat(4, 'rolling and SHM', r`A solid cylinder of mass 2 kg can roll without slipping on a horizontal floor. A spring of constant 300 N/m is joined to its axle, along the floor. Find the angular frequency of small oscillations (in $\mathrm{rad\,s^{-1}}$).`, () => Math.sqrt(2 * 300 / (3 * 2)), 0,
    0, r`Energy: $E = \tfrac12mv^2 + \tfrac12I\omega_c^2 + \tfrac12kx^2 = \tfrac34mv^2 + \tfrac12kx^2$ (for $I = \tfrac12mR^2$, rolling). So the effective mass is $\tfrac32m = 3$ kg. $\omega = \sqrt{300/3} = 10\ \mathrm{rad\,s^{-1}}$ (equivalently $\sqrt{2k/3m}$).`, { unit: 'rad/s', sub: 'mixed', trap: 'Rolling adds rotational energy; the mass in $\\omega$ is $3m/2$.' }),
  nat(4, 'spring with pulley', r`A 1 kg block hangs from a string that passes over a frictionless-axle disc pulley (mass 2 kg, radius 0.1 m). The other end of the string is tied to a spring of constant 200 N/m fixed to the ground; the string does not slip. Find the time period of small vertical oscillations of the block (in s, 3 decimals).`, () => 2 * PI * Math.sqrt((1 + 2 / 2) / 200), 0.005, 3,
    r`Kinetic energy: $\tfrac12mv^2 + \tfrac12I\omega^2 = \tfrac12(m + M/2)v^2$ for a disc ($I = \tfrac12MR^2$, $\omega = v/R$). Effective mass $= 1 + 1 = 2$ kg. $T = 2\pi\sqrt{2/200} = 0.628$ s.`, { unit: 's', sub: 'mixed' }),
  nat(4, 'physical pendulum', r`A solid sphere of radius 0.1 m hangs from a light string so that the distance from the point of suspension to the sphere's centre is 1.0 m. It swings through a small angle. Find its period (in s, 3 decimals; $g = 9.8$).`, () => 2 * PI * Math.sqrt((0.4 * 0.01 + 1) / (9.8 * 1)), 0.003, 3,
    r`Treat the sphere as a physical pendulum: $I = \tfrac25mr^2 + mL^2$ with $L = 1.0$ m. $T = 2\pi\sqrt{\dfrac{I}{mgL}} = 2\pi\sqrt{\dfrac{0.004 + 1}{9.8\times1}} = 2.011$ s. A point-bob of the same length would give 2.007 s: the size of the bob lengthens the period slightly.`, { unit: 's', trap: 'Use the distance to the centre, and add $\\tfrac25mr^2$.' }),
  nat(4, 'coincidence of pendulums', r`Two simple pendulums of lengths 1.00 m and 1.21 m are pulled aside by the same small angle and released together from the same side. After how many seconds will they first again be in step (at the same point, moving the same way)? Take $g = 9.8$ (answer to 1 decimal).`, () => 11 * 2 * PI * Math.sqrt(1 / 9.8), 0.1, 1,
    r`$T_1 = 2\pi\sqrt{1/9.8} = 2.007$ s and $T_2 = T_1\sqrt{1.21} = 1.1T_1$. They are together again when $n_1T_1 = n_2T_2$ with whole numbers, $n_1/n_2 = 1.1 = 11/10$. So $n_1 = 11$: $t = 11\times2.007 = 22.1$ s (the short one makes 11 swings, the long one 10).`, { unit: 's', trap: 'Find the smallest whole-number ratio of the periods.' }),
  nat(4, 'block on block', r`A block of mass 1 kg rests on a block of mass 1 kg that is attached to a spring of constant 200 N/m on a smooth table. The coefficient of friction between the blocks is 0.4. Find the largest amplitude (in cm, 2 decimals) for which the upper block does not slip ($g = 9.8$).`, () => 0.4 * 9.8 / (200 / 2) * 100, 0.02, 2,
    r`Both move together with $\omega^2 = k/(m + M) = 200/2 = 100$. The upper block's acceleration $A\omega^2$ must be supplied by friction, at most $\mu g$. $A_{max} = \mu g/\omega^2 = 0.4\times9.8/100 = 0.0392$ m $= 3.92$ cm.`, { unit: 'cm', trap: 'Use the total mass for $\\omega$ and the upper block for friction.' }),
  nat(4, 'superposition of SHM', r`Two SHMs along the same line, $x_1 = 3\sin\omega t$ and $x_2 = 4\sin(\omega t + \pi/3)$ (cm), are combined. Find the amplitude of the resultant (in cm, 2 decimals).`, () => Math.sqrt(9 + 16 + 2 * 3 * 4 * 0.5), 0.02, 2,
    r`$A^2 = A_1^2 + A_2^2 + 2A_1A_2\cos\phi = 9 + 16 + 24\times\tfrac12 = 37$. $A = \sqrt{37} = 6.08$ cm.`, { unit: 'cm' }),
  mcq(4, 'time in SHM', r`A particle in SHM of period $T$ spends, in each cycle, what fraction of its time at distances less than $A/2$ from the mean position?`, r`$1/3$`, [r`$1/2$`, r`$1/4$`, r`$1/6$`],
    r`Going from $-A/2$ to $+A/2$ takes $T/12 + T/12 = T/6$ (phase $\pi/6$ on each side of the mean position). This happens twice per cycle, once in each direction: $2\times T/6 = T/3$. The fraction is $1/3$.`, { trap: 'The particle moves fastest near the middle, so the fraction is less than $1/2$.' }),
  nat(4, 'finding amplitude', r`A particle in SHM (cm, s units) has speed 12 cm/s at $x = 3$ cm and speed 9 cm/s at $x = 4$ cm. Find its amplitude (in cm).`, () => Math.sqrt(9 + 144 / ((144 - 81) / (16 - 9))), 0,
    0, r`$v^2 = \omega^2(A^2 - x^2)$. Subtract the two cases: $144 - 81 = \omega^2(16 - 9)$, so $\omega^2 = 63/7 = 9$ and $\omega = 3$ s$^{-1}$. Then $A^2 = x^2 + v^2/\omega^2 = 9 + 144/9 = 25$, $A = 5$ cm. (Period $2\pi/3 = 2.09$ s.)`, { unit: 'cm' }),
  nat(4, 'mixed electric and pendulum', r`A small bob of mass 10 g and charge $q$ hangs on a string of length 1.4 m in a horizontal electric field. The force $qE$ equals the bob's weight. Find the period of small oscillations about the new equilibrium (in s, 3 decimals; $g = 9.8$).`, () => 2 * PI * Math.sqrt(1.4 / (9.8 * Math.SQRT2)), 0.005, 3,
    r`The effective gravity is the vector sum of $mg$ (down) and $qE = mg$ (sideways): $g_{eff} = \sqrt2g = 13.86\ \mathrm{m\,s^{-2}}$ at $45°$ to the vertical. $T = 2\pi\sqrt{L/g_{eff}} = 2\pi\sqrt{1.4/13.86} = 1.997$ s.`, { unit: 's', sub: 'mixed' }),
  nat(4, 'massive spring', r`A block of 1.0 kg is attached to a spring of constant 110 N/m and mass 0.3 kg, and oscillates on a smooth horizontal table. The spring's own motion adds one third of its mass to the moving mass. Find the angular frequency (in $\mathrm{rad\,s^{-1}}$).`, () => Math.sqrt(110 / (1 + 0.3 / 3)), 0,
    0, r`Effective mass $= m + m_s/3 = 1 + 0.1 = 1.1$ kg (the coils near the fixed end move less). $\omega = \sqrt{110/1.1} = 10\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  mcq(4, 'dimensional analysis', r`The frequency $f$ of small oscillations of a liquid drop depends on its density $\rho$, radius $r$ and surface tension $S$. Dimensional analysis gives $f\propto$`, r`$\sqrt{\dfrac{S}{\rho r^3}}$`, [r`$\sqrt{\dfrac{S}{\rho r}}$`, r`$\sqrt{\dfrac{\rho r^3}{S}}$`, r`$\dfrac{S}{\rho r^3}$`],
    r`Try $f = k\rho^ar^bS^c$. $[S] = \mathrm{M\,T^{-2}}$, $[\rho] = \mathrm{M\,L^{-3}}$. Mass: $a + c = 0$. Time: $-2c = -1\Rightarrow c = \tfrac12$, so $a = -\tfrac12$. Length: $-3a + b = 0\Rightarrow b = -\tfrac32$. So $f\propto\sqrt{S/\rho r^3}$.`, { sub: 'mixed' }),
  mcq(4, 'mean values', r`For $x = A\sin\omega t$, the time-average of $x^2$ over a full cycle is`, r`$A^2/2$`, [r`$A^2$`, r`$A^2/4$`, r`$2A^2/\pi$`],
    r`$\langle\sin^2\omega t\rangle = \tfrac12$, so $\langle x^2\rangle = A^2/2$. The root-mean-square displacement is $A/\sqrt2$, like the rms of an AC voltage. (The time-average of $|x|$ is $2A/\pi$.)`),
  mcq(4, 'energy graphs', r`For SHM of amplitude $A$, the graphs of kinetic energy $K$ and potential energy $U$ against displacement $x$ cross at $x = \pm$`, r`$A/\sqrt2$`, [r`$A/2$`, r`$A/\sqrt3$`, r`$A/4$`],
    r`$U = \tfrac12kx^2$ is an upward parabola and $K = \tfrac12k(A^2 - x^2)$ a downward one. They are equal where $x^2 = A^2/2$, at $x = \pm A/\sqrt2$, where each is $E/2$. Against time they cross at $T/8, 3T/8, \dots$.`),
  nat(4, 'damped oscillator', r`A damped oscillator has quality factor $Q = 100$ (defined as $Q = \omega_0m/b$). Roughly what percentage of its energy is lost in each cycle? ($\Delta E/E\approx2\pi/Q$, 1 decimal)`, () => 2 * PI / 100 * 100, 0.1, 1,
    r`Energy falls as $e^{-bt/m}$. Over one period $T\approx2\pi/\omega_0$ the fractional loss is $bT/m = 2\pi b/(m\omega_0) = 2\pi/Q = 0.0628$, or $6.3\ \%$. A high $Q$ means very little loss per cycle.`, { unit: '%' }),
  nat(4, 'bouncing block and spring', r`A 2 kg block slides at $3\ \mathrm{m\,s^{-1}}$ on a smooth floor towards a light spring of constant 200 N/m fixed to a wall. A second rigid wall is 0.9 m from the spring's free end on the other side, so the block bounces back and forth elastically. Find the time for one complete round trip (spring contact plus travel, in s, 3 decimals).`, () => 2 * 0.9 / 3 + PI * Math.sqrt(2 / 200), 0.005, 3,
    r`Free travel to the wall and back: $2d/v = 1.8/3 = 0.6$ s. In contact with the spring the block does half a cycle of SHM: $T/2 = \pi\sqrt{m/k} = \pi\sqrt{0.01} = 0.314$ s. Total $= 0.914$ s.`, { unit: 's', trap: 'Spring contact lasts half a period, independent of the speed.' }),
  nat(4, 'tunnel in another planet', r`A planet has radius 3200 km and surface gravity $3.7\ \mathrm{m\,s^{-2}}$. Take its density as uniform. A stone dropped into a smooth tunnel along a diameter oscillates. Find the period (in minutes, 1 decimal).`, () => 2 * PI * Math.sqrt(3.2e6 / 3.7) / 60, 0.1, 1,
    r`$T = 2\pi\sqrt{R/g} = 2\pi\sqrt{3.2\times10^6/3.7} = 5843$ s $= 97.4$ min.`, { unit: 'min', sub: 'mixed' }),
  mcq(4, 'SHM and circular motion', r`A particle moves in a circle of radius $R$ at a constant angular speed $\omega$. The projection of its motion on a diameter is`, r`SHM of amplitude $R$ and angular frequency $\omega$`, [r`SHM of amplitude $2R$ and angular frequency $\omega$`, r`SHM of amplitude $R$ and angular frequency $2\omega$`, r`uniform motion along the diameter`],
    r`The projection is $x = R\cos(\omega t + \phi)$: SHM with the same $\omega$ and amplitude equal to the radius. This is the reference circle used to define phase.`),
  mcq(4, 'conservation in SHM', r`A block oscillates on a smooth horizontal spring with amplitude $A$. At the extreme position a second, identical block is gently placed on top and sticks (no slipping at all). The new amplitude and period are`, r`amplitude $A$, period $\sqrt2$ times larger`, [r`amplitude $A/\sqrt2$, period unchanged`, r`amplitude $A/\sqrt2$, period $\sqrt2$ times larger`, r`amplitude $A$, period unchanged`],
    r`At the extreme the block is at rest, so adding mass there changes no energy or position: $A$ stays the same. The mass doubles, so $T\propto\sqrt m$ becomes $\sqrt2T$. At the mean position the amplitude would have shrunk.`),
  mcq(4, 'floating body', r`A cylinder floats upright in a liquid. If instead the liquid has twice the density and the same cylinder floats in it, the period of its up-and-down oscillation becomes`, r`$\dfrac{1}{\sqrt2}$ times`, [r`$\sqrt2$ times`, r`$\dfrac12$ times`, r`unchanged`],
    r`$k = \sigma gA$ doubles while the mass is the same, so $T = 2\pi\sqrt{m/\sigma gA}$ falls by $\sqrt2$.`),
  mcq(4, 'tunnel through the Earth', r`The period of oscillation in a smooth tunnel through a uniform Earth equals the time period of`, 'a satellite orbiting very close to the Earth\'s surface', ['a geostationary satellite', 'a satellite at height $R$', 'the Moon'],
    r`Near-surface orbit: $T = 2\pi R/\sqrt{gR} = 2\pi\sqrt{R/g}$. This equals the SHM period. The stone's tunnel motion is the projection of that orbit on a diameter.`),

  // ---------- Level 5 ----------
  nat(5, 'potential energy curve', r`A particle of mass 2 kg moves in the potential $U(r) = U_0\left[(r_0/r)^{12} - 2(r_0/r)^{6}\right]$ with $U_0 = 1$ J and $r_0 = 0.1$ m. For small oscillations about the minimum, find the angular frequency (in $\mathrm{rad\,s^{-1}}$).`, () => Math.sqrt(72 * 1 / (2 * 0.01)), 0,
    0, r`The minimum is at $r = r_0$. Let $u = r_0/r$. $U'' = \dfrac{U_0}{r_0^2}(144 - 72) = \dfrac{72U_0}{r_0^2}$ at $r_0$ (the first-derivative term vanishes there). So $k_{eff} = 72/0.01 = 7200$ N/m. $\omega = \sqrt{k_{eff}/m} = \sqrt{3600} = 60\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s', trap: 'Differentiate twice, then evaluate at the minimum.' }),
  nat(5, 'potential energy curve', r`A particle of mass 0.5 kg has potential energy $U = U_0(1 - \cos ax)$ with $U_0 = 2$ J and $a = 5\ \mathrm{m^{-1}}$. Find the angular frequency of small oscillations about $x = 0$ (in $\mathrm{rad\,s^{-1}}$).`, () => 5 * Math.sqrt(2 / 0.5), 0,
    0, r`$U\approx U_0a^2x^2/2$ for small $x$, so $k = U_0a^2 = 2\times25 = 50$ N/m. $\omega = \sqrt{k/m} = \sqrt{50/0.5} = 10\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  nat(5, 'coupled oscillators', r`Two identical blocks of mass 0.5 kg lie on a smooth table. Block 1 is joined to a wall by a spring of constant 50 N/m, block 2 is joined to the opposite wall by an identical spring, and the blocks are joined to each other by a third identical spring. The two blocks are pulled in opposite directions equally and released (the blocks always move opposite to each other). Find the angular frequency (in $\mathrm{rad\,s^{-1}}$, 2 decimals).`, () => Math.sqrt(3 * 50 / 0.5), 0.02, 2,
    r`With $x_2 = -x_1$ the middle spring is stretched by $2x_1$ in total, so it pulls each block back with $k\cdot2x_1$. Block 1: $m\ddot x_1 = -kx_1 - 2kx_1 = -3kx_1$. $\omega = \sqrt{3k/m} = \sqrt{300} = 17.32\ \mathrm{rad\,s^{-1}}$. (If they moved together, the middle spring would not change, and $\omega = \sqrt{k/m} = 10$.)`, { unit: 'rad/s', trap: 'The middle spring acts only in the opposite-motion mode.' }),
  nat(5, 'rod and spring', r`A uniform rod of mass 3 kg and length 0.98 m is hinged at its upper end and hangs vertically. A horizontal spring of constant 85 N/m joins its lower end to a wall, and is at its natural length when the rod is vertical. Find the angular frequency of small oscillations (in $\mathrm{rad\,s^{-1}}$; $g = 9.8$).`, () => Math.sqrt((3 * 9.8 / (2 * 0.98)) + 3 * 85 / 3), 0,
    0, r`For a small angle $\theta$: restoring torques are $mg(L/2)\theta$ from gravity and $kL^2\theta$ from the spring. $I = \tfrac13mL^2$. $\omega^2 = \dfrac{mgL/2 + kL^2}{mL^2/3} = \dfrac{3g}{2L} + \dfrac{3k}{m} = 15 + 85 = 100$. $\omega = 10\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s', sub: 'mixed' }),
  nat(5, 'pendulum with spring', r`A bob of mass 0.5 kg on a light rod of length 0.49 m can swing about a horizontal axis at the top. A horizontal spring of constant 20 N/m is attached to the bob and is relaxed when the rod is vertical. Find the period of small oscillations (in s, 3 decimals; $g = 9.8$).`, () => 2 * PI / Math.sqrt(9.8 / 0.49 + 20 / 0.5), 0.005, 3,
    r`Torque for small $\theta$: $-(mgL + kL^2)\theta$ with $I = mL^2$. $\omega^2 = g/L + k/m = 20 + 40 = 60$, so $\omega = 7.746$ and $T = 2\pi/\omega = 0.811$ s. Gravity and spring both act to restore, so their stiffnesses add.`, { unit: 's' }),
  nat(5, 'gas piston oscillations', r`A ball of mass 20 g fits tightly (frictionless) in the neck of a vessel of volume 2.0 L; the neck has cross-section $1.0\ \mathrm{cm^2}$. The gas inside (adiabatic, $\gamma = 1.4$) is at pressure $1.0\times10^5$ Pa. The ball is pushed slightly and released. Find the period of oscillation (in s, 2 decimals).`, () => 2 * PI * Math.sqrt(0.02 * 2e-3 / (1.4 * 1e5 * 1e-4 * 1e-4)), 0.01, 2,
    r`For an adiabatic change $PV^\gamma$ = constant, so $\Delta P = -\gamma P\Delta V/V$. A displacement $y$ gives $\Delta V = Ay$ and a force $A\Delta P = -(\gamma PA^2/V)y$. So $k = \gamma PA^2/V$ and $T = 2\pi\sqrt{mV/\gamma PA^2} = 2\pi\sqrt{\dfrac{0.02\times2\times10^{-3}}{1.4\times10^5\times10^{-8}}} = 1.06$ s.`, { unit: 's', sub: 'mixed', trap: 'Use $\\gamma P$ (adiabatic), not $P$ alone, and area in $\\mathrm{m^2}$.' }),
  nat(5, 'plank on rollers', r`A uniform plank rests on two identical horizontal cylinders with parallel axes 1.0 m apart. The cylinders spin in opposite senses, inwards at the top. The coefficient of kinetic friction is 0.2. When the plank is shifted slightly along its length and released, it oscillates. Find its period (in s, 2 decimals; $g = 9.8$).`, () => 2 * PI * Math.sqrt(0.5 / (0.2 * 9.8)), 0.01, 2,
    r`Let the plank's centre be displaced $x$ from the midpoint. The normal forces are $N_1 = mg(L - x)/2L$ and $N_2 = mg(L + x)/2L$ where $2L = 1.0$ m is the separation. The net friction is $\mu(N_2 - N_1) = \mu mgx/L$ towards the middle. So $\omega^2 = \mu g/L$ with $L = 0.5$ m: $T = 2\pi\sqrt{L/\mu g} = 2\pi\sqrt{0.5/1.96} = 3.17$ s. Note that $L$ is half the separation.`, { unit: 's', sub: 'mixed', trap: '$L$ here is half the distance between the axes.' }),
  nat(5, 'drop onto a spring', r`A 0.5 kg lump is dropped from 0.8 m above a light pan fixed on a spring of constant 98 N/m, and sticks to the pan on landing. Find the amplitude of the oscillation that follows (in cm, 1 decimal; $g = 9.8$).`, () => Math.sqrt((0.5 * 9.8 / 98) ** 2 + 2 * 9.8 * 0.8 / (98 / 0.5)) * 100, 0.1, 1,
    r`The pan is light, so the lump keeps its speed $v = \sqrt{2gh}$, $v^2 = 15.68$. The new equilibrium is $x_0 = mg/k = 0.05$ m below the pan's starting position. About it the lump starts at displacement $x_0$ with speed $v$: $A^2 = x_0^2 + v^2/\omega^2$, with $\omega^2 = k/m = 196$. $A^2 = 0.0025 + 15.68/196 = 0.0825$. $A = 0.287$ m $= 28.7$ cm.`, { unit: 'cm', trap: 'Measure from the new equilibrium, not from the pan\'s starting point.' }),
  mcq(5, 'time in SHM', r`A particle in SHM of period $T$ is at $x = A/2$ at $t = 0$ moving towards $x = A$. The first time it is at $x = -A/2$ is`, r`$T/2$`, [r`$T/3$`, r`$T/6$`, r`$2T/3$`],
    r`$x = A\sin(\omega t + \pi/6)$. $x = -A/2$ when $\omega t + \pi/6 = 7\pi/6$ (the first time after the particle goes up to $A$ and down through the mean position), so $\omega t = \pi$ and $t = T/2$. Any two points symmetric about the mean position are half a period apart when the particle moves the same sense through them.`, { trap: 'Work with the phase: the sign of the velocity decides which of two phases applies.' }),
  mcq(5, 'conditions for SHM', r`A small bead slides without friction on a circular wire of radius $R$ held in a vertical plane. The bead is displaced slightly from the bottom. A wrong statement about the motion is`, r`its period is $2\pi\sqrt{2R/g}$`, [r`it behaves as a simple pendulum of length $R$`, r`its period is $2\pi\sqrt{R/g}$`, r`the restoring force is nearly $mg\theta$`],
    r`The bead is at distance $R\theta$ along the arc; the tangential force is $mg\sin\theta\approx mg\theta$, so $\ddot s = -(g/R)s$: $T = 2\pi\sqrt{R/g}$. The statement with $2R$ is the ring pendulum hung from its rim, a different case. The question asks which is wrong.`),
  mcq(5, 'energy and SHM', r`A particle in SHM has potential energy $U = \tfrac12kx^2 + U_1$ with $U_1\ne0$ a constant. Which statement is correct?`, 'The period and amplitude are unchanged; only the numerical value of the total energy shifts', ['The period increases by a factor depending on $U_1$', 'The motion is no longer SHM', 'The force constant changes'],
    r`A constant added to the potential energy changes no force, since $F = -dU/dx$. The period, amplitude and motion are exactly the same. Only the numerical value of the total energy shifts (the zero of energy is arbitrary).`),
  mcq(5, 'damped and forced', r`A lightly damped oscillator is driven at its natural frequency $\omega_0$. At steady state, the driving force and the displacement have a phase difference of`, r`$\pi/2$ (displacement lags by $90°$)`, [r`$0$`, r`$\pi$`, r`$\pi/4$`],
    r`At resonance the velocity is in phase with the force (so power input is the greatest). Velocity leads displacement by $\pi/2$, so displacement lags the force by $\pi/2$. Far below resonance the lag is near 0; far above it is near $\pi$.`),
];

// ---------- Multiple-correct (JEE Advanced style) ----------
items.push(
  msq(4, 'SHM or not', r`Which of these displacement-time functions represent simple harmonic motion? ($\omega$ is a constant.)`,
    [r`$x = 3\sin^2\omega t$`, r`$x = \sin\omega t + \cos\omega t$`, r`$x = \sin\omega t + \sin2\omega t$`, r`$x = |\sin\omega t|$`], [0, 1],
    r`SHM needs $\ddot x = -\Omega^2(x - x_0)$ for some constant $\Omega$ and $x_0$. (A) $3\sin^2\omega t = 1.5(1 - \cos2\omega t)$: SHM of angular frequency $2\omega$ about $x_0 = 1.5$. (B) $=\sqrt2\sin(\omega t + \pi/4)$: SHM. (C) Two different frequencies: periodic but not SHM. (D) Periodic with a sharp turn at $x = 0$ (infinite acceleration there): not SHM.`, { trap: 'SHM may be about a point other than the origin.' }),
  msq(3, 'energy in SHM', r`A particle in SHM of amplitude $A$ is at $x = A/2$. Which statements are correct?`,
    [r`Its kinetic energy is $\tfrac34$ of the total energy`, r`Its acceleration is half of the maximum acceleration`, r`Its speed is half of the maximum speed`, r`Its potential energy is $\tfrac14$ of the total energy`], [0, 1, 3],
    r`$U = \tfrac12k(A/2)^2 = E/4$, so $K = 3E/4$ (A and D true). $a = \omega^2x = \omega^2A/2$ is half of the maximum (B true). $v = \omega\sqrt{A^2 - A^2/4} = \tfrac{\sqrt3}{2}\omega A$, not half (C false).`),
  msq(4, 'pendulum in an accelerated frame', r`A simple pendulum has period $T_0$ in a laboratory. In which of these situations is its period greater than $T_0$?`,
    [r`In a lift accelerating downward at $g/2$`, r`In a lift accelerating upward at $g/2$`, r`In a car accelerating horizontally at $g$`, r`With the bob fully immersed in a liquid, with the bob's density twice that of the liquid, drag ignored`], [0, 3],
    r`(A) $g_{eff} = g/2$: $T = \sqrt2T_0$, greater. (B) $g_{eff} = 3g/2$: smaller. (C) $g_{eff} = \sqrt2g$: smaller. (D) $g_{eff} = g(1 - \tfrac12) = g/2$: $T = \sqrt2T_0$, greater.`),
  msq(4, 'spring-mass system', r`The period of a mass-spring oscillator on a smooth surface changes if we`,
    [r`double the mass`, r`move the experiment to the Moon`, r`double the amplitude`, r`cut the spring into two equal halves and use one half`], [0, 3],
    r`$T = 2\pi\sqrt{m/k}$. Doubling $m$ changes it (A). $g$ is not in the formula (B no). The period does not depend on amplitude (C no). A half spring has $2k$ (D yes).`),
  msq(3, 'damped oscillations', r`For a lightly damped oscillator (damping force $-bv$) which statements are true?`,
    [r`The amplitude decreases exponentially with time`, r`Its frequency is slightly less than the natural frequency without damping`, r`The energy lost equals the work done by the damping force`, r`Its time period does not depend on $b$ at all`], [0, 1, 2],
    r`Amplitude $\propto e^{-bt/2m}$ (A). $\omega' = \sqrt{\omega_0^2 - b^2/4m^2} < \omega_0$ (B), so the period depends on $b$ (D false). The mechanical energy decrease is the work done by the drag (C).`),
  msq(5, 'forced oscillations', r`A damped oscillator with natural angular frequency $\omega_0$ is driven by a force of angular frequency $\omega$. In the steady state, which statements are correct?`,
    [r`It oscillates at angular frequency $\omega$`, r`At $\omega = \omega_0$ the displacement lags the force by $\pi/2$`, r`At resonance the amplitude is the same for any damping`, r`For $\omega\gg\omega_0$ the displacement is nearly opposite in phase to the force`], [0, 1, 3],
    r`After the transient dies out, the system follows the driver (A). At resonance the force is in phase with the velocity, so the displacement lags by $\pi/2$ (B). Peak amplitude is $F_0/b\omega_0$, which depends on $b$ (C false). Far above resonance the inertia dominates and the displacement is about $180°$ out of phase (D).`),
  msq(4, 'tunnel through the Earth', r`A smooth tunnel passes through the centre of a uniform Earth of radius $R$. A stone released at the surface end moves in it. Which statements are true?`,
    [r`The motion is SHM`, r`The period depends on the stone's mass`, r`The period equals that of a satellite orbiting near the surface`, r`The maximum speed equals the escape speed from the surface`], [0, 2],
    r`$a = -(g/R)r$: SHM (A). $T = 2\pi\sqrt{R/g}$, no mass (B false), same as a near-surface orbit (C). The maximum speed is $\sqrt{gR}$, while the escape speed is $\sqrt{2gR}$ (D false).`),
);

// ---------- Assertion and Reason ----------
items.push(
  asrt(2, 'simple pendulum', r`The time period of a simple pendulum does not depend on the mass of the bob.`, r`The restoring force on the bob and its inertia are both proportional to its mass.`, 0,
    r`The tangential force is $mg\sin\theta$ and the acceleration is that force divided by $m$, so $m$ cancels. R correctly explains A.`),
  asrt(2, 'spring-mass system', r`A block on a horizontal spring has the same time period on the Earth and on the Moon.`, r`The acceleration due to gravity on the Moon is less than that on the Earth.`, 1,
    r`A is true since $T = 2\pi\sqrt{m/k}$ has no $g$. R is also a true statement, but it is not why the period stays the same (it is irrelevant to the spring force).`, { trap: 'A true reason may still not explain the assertion.' }),
  asrt(2, 'periodic and SHM', r`Every periodic motion is simple harmonic motion.`, r`In a periodic motion the displacement repeats after a fixed interval of time.`, 3,
    r`A is false: a bouncing ball or a planet in orbit is periodic but not SHM (SHM needs $a\propto -x$). R is a true statement of what "periodic" means.`),
  asrt(3, 'pendulum in a lift', r`A simple pendulum in a freely falling lift does not oscillate.`, r`In free fall the effective acceleration due to gravity inside the lift is zero.`, 0,
    r`With $g_{eff} = 0$ there is no restoring force, so $T\to\infty$. R explains A.`),
  asrt(3, 'tunnel through the Earth', r`A ball dropped into a smooth tunnel along any chord of a uniform Earth has the same period, 84.6 min.`, r`The component of gravity along the chord is proportional to the distance of the ball from the midpoint of the chord.`, 0,
    r`Inside the Earth the force is $-m(g/R)\vec r$. Its component along the chord is $-m(g/R)x$, with $x$ the distance from the chord's midpoint. So $\omega^2 = g/R$ for all chords. R explains A.`),
  asrt(3, 'resonance', r`At resonance the amplitude of a forced oscillator is infinite, whatever the damping.`, r`At resonance the driving frequency is equal to the natural frequency of the oscillator.`, 3,
    r`A is false: the damping force $bv$ takes away energy, and the amplitude is limited to about $F_0/b\omega_0$. R is true. Only with $b = 0$ would the amplitude grow without limit.`),
  asrt(3, 'superposition of SHM', r`The sum of two SHMs of different frequencies along the same line is not an SHM.`, r`The acceleration of the resultant motion is not proportional to its displacement.`, 0,
    r`For $x = x_1 + x_2$ with $\omega_1\ne\omega_2$, $\ddot x = -\omega_1^2x_1 - \omega_2^2x_2$, which is not $-\omega^2x$ for any one $\omega$. R is the reason.`),
  asrt(2, 'spring-mass system', r`When the mass on a spring is doubled, the time period also doubles.`, r`For a spring-mass system $T\propto\sqrt m$.`, 3,
    r`R is true: $T = 2\pi\sqrt{m/k}$. Doubling $m$ multiplies $T$ by $\sqrt2$, not 2, so A is false.`),
  asrt(2, 'damped oscillations', r`The mechanical energy of a damped oscillator decreases with time.`, r`The damping force adds energy to the oscillator.`, 2,
    r`A is true: drag does negative work, converting energy to heat. R is false: damping removes energy.`),
);

// ---------- Statement I / Statement II ----------
items.push(
  stm(2, 'simple pendulum', r`A simple pendulum released from a large angle has a longer period than one released from a small angle.`, r`For large angles $\sin\theta<\theta$, so the restoring force is less than the linear value.`, 0,
    r`For large amplitude the restoring force $mg\sin\theta$ is less than $mg\theta$, so the swing is slower: $T\approx T_0(1 + \theta_0^2/16)$. Both are true and II explains I.`),
  stm(3, 'simple pendulum', r`$T = 2\pi\sqrt{L/g}$ holds for every amplitude.`, r`The formula is derived using $\sin\theta\approx\theta$, valid only for small angles.`, 3,
    r`I is false: the formula is only the small-angle result. II is true and says why.`),
  stm(3, 'energy in SHM', r`In SHM, kinetic and potential energies are equal at $x = A/2$.`, r`The total energy of a particle in SHM is $\tfrac12kA^2$.`, 3,
    r`I is false: $K = U$ at $x = A/\sqrt2$ (at $x = A/2$, $K = 3U$). II is true.`),
  stm(2, 'spring-mass system', r`A block on a smooth horizontal spring has the same time period on the Moon as on the Earth.`, r`The time period of a spring-mass system depends on the local value of $g$.`, 2,
    r`I is true because $T = 2\pi\sqrt{m/k}$. II is false: it is the pendulum's period that depends on $g$, not the spring's.`),
  stm(3, 'pendulum clock', r`A pendulum clock that keeps correct time on the Earth runs slow on the Moon.`, r`The period of a simple pendulum is longer where $g$ is smaller.`, 0,
    r`On the Moon $g$ is smaller, so the pendulum swings slower: both true and II is the reason. (A spring-driven watch would be unchanged.)`),
  stm(2, 'SHM basics', r`The acceleration of a particle in SHM is zero at the extreme positions.`, r`The velocity of a particle in SHM is zero at the mean position.`, 1,
    r`Both are false. The acceleration is maximum ($\omega^2A$) at the extremes and zero at the mean; the velocity is zero at the extremes and maximum at the mean.`),
  stm(3, 'springs', r`Two springs joined end to end have a force constant smaller than either spring alone.`, r`In series, the same force acts on each spring and the extensions add.`, 0,
    r`$1/k = 1/k_1 + 1/k_2$, so $k$ is smaller than either. II is the reason: same force, added extensions. Both true; II explains I.`),
  stm(4, 'floating body', r`A block floating in a liquid oscillates in SHM for a small push only if its sides are vertical at the waterline.`, r`The restoring upthrust is proportional to the displacement only if the cross-section at the waterline is constant.`, 0,
    r`With constant area $A$ at the surface, the extra upthrust is $\rho gAy$, linear in $y$. Both are true and II explains I.`),
);

// ---------- Match the following ----------
items.push(
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'SHM equations', group: 'm1',
    q: r`A particle of mass $m$ moves in SHM of amplitude $A$ and angular frequency $\omega$. Match each quantity in List I with its expression in List II.`,
    options: ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-r, B-p, C-s, D-q'], answer: 0,
    sol: r`Maximum velocity $= A\omega$ (r). Maximum acceleration $= \omega^2A$ (s). Total energy $= \tfrac12m\omega^2A^2$ (p). Time period $= 2\pi/\omega$ (q).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'time periods', group: 'm2',
    q: r`Match each oscillator in List I with its time period in List II.`,
    options: ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'], answer: 0,
    sol: r`Simple pendulum $2\pi\sqrt{L/g}$ (q). Mass on a spring $2\pi\sqrt{m/k}$ (p). Tunnel through a uniform Earth $2\pi\sqrt{R/g}$ (r). Torsion pendulum $2\pi\sqrt{I/C}$ (s).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'pendulum in accelerated frames', group: 'm3',
    q: r`A simple pendulum of length $L$ is used in different situations (with $a<g$). Match each situation with the time period for small oscillations.`,
    options: ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'], answer: 0,
    sol: r`Upward acceleration: $g_{eff} = g + a$ (p). Downward acceleration: $g - a$ (q). Horizontal acceleration: $\sqrt{g^2 + a^2}$ (r). Free fall: $g_{eff} = 0$, no oscillation (s).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'physical pendulum', group: 'm4',
    q: r`A body of mass $m$ swings through a small angle about a horizontal axis. Match each body with the length of the equivalent simple pendulum (same period).`,
    options: ['A-r, B-p, C-q, D-s', 'A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s', 'A-s, B-p, C-q, D-r'], answer: 0,
    sol: r`Rod about an end: $I/md = (L^2/3)/(L/2) = 2L/3$ (r). Ring about a point on the rim: $2R^2/R = 2R$ (p). Disc about a point on the rim: $\tfrac32R^2/R = 3R/2$ (q). A point bob on a string of length $l$: $l$ (s).` },
);
items.filter((x) => x.format === 'match').forEach((it, i) => {
  const pos = [2, 0, 3, 1][i]; const a = it.answer; [it.options[a], it.options[pos]] = [it.options[pos], it.options[a]]; it.answer = pos;
});

const groups = {
  m1: { title: 'Quantities of an SHM',
    list1: ['A. Maximum velocity', 'B. Maximum acceleration', 'C. Total energy', 'D. Time period'],
    list2: [r`p. $\tfrac12m\omega^2A^2$`, r`q. $2\pi/\omega$`, r`r. $\omega A$`, r`s. $\omega^2A$`] },
  m2: { title: 'Oscillators and their periods',
    list1: ['A. Simple pendulum of length $L$', 'B. Mass $m$ on a spring of constant $k$', 'C. Stone in a tunnel through a uniform Earth', 'D. Torsion pendulum (moment of inertia $I$, torsion constant $C$)'],
    list2: [r`p. $2\pi\sqrt{m/k}$`, r`q. $2\pi\sqrt{L/g}$`, r`r. $2\pi\sqrt{R/g}$`, r`s. $2\pi\sqrt{I/C}$`] },
  m3: { title: 'A pendulum in different situations',
    list1: ['A. Lift accelerating upward at $a$', 'B. Lift accelerating downward at $a$', 'C. Car accelerating horizontally at $a$', 'D. Lift in free fall'],
    list2: [r`p. $2\pi\sqrt{L/(g + a)}$`, r`q. $2\pi\sqrt{L/(g - a)}$`, r`r. $2\pi\sqrt{L/\sqrt{g^2 + a^2}}$`, 's. No oscillation (period infinite)'] },
  m4: { title: 'Equivalent simple pendulum lengths',
    list1: ['A. Uniform rod of length $L$ pivoted at one end', 'B. Ring of radius $R$ pivoted at a point on its rim', 'C. Disc of radius $R$ pivoted at a point on its rim', 'D. Point mass on a light string of length $l$'],
    list2: ['p. $2R$', 'q. $3R/2$', 'r. $2L/3$', 's. $l$'] },
  p1: { title: 'A block on a spring',
    passage: r`<p>A block of mass 2 kg lies on a smooth horizontal table and is joined to a fixed wall by a spring of constant 200 N/m. It is pulled 10 cm from the equilibrium position and released from rest.</p>` },
  p2: { title: 'A pendulum in a car',
    passage: r`<p>A simple pendulum of length 0.8 m hangs from the roof of a car. The car moves along a straight horizontal road with a constant acceleration equal to $g = 9.8\ \mathrm{m\,s^{-2}}$. After a while the bob is at rest relative to the car.</p>` },
  p3: { title: 'A damped oscillator',
    passage: r`<p>A block of mass 0.5 kg is attached to a spring of constant 200 N/m and moves in a viscous fluid, which exerts a force $-bv$ with $b = 2\ \mathrm{kg\,s^{-1}}$. The amplitude falls with time as $A_0e^{-bt/2m}$ and the angular frequency is $\omega' = \sqrt{k/m - b^2/4m^2}$.</p>` },
  p4: { title: 'A tunnel on a smaller planet',
    passage: r`<p>A planet of uniform density has radius 3200 km and surface gravity $3.7\ \mathrm{m\,s^{-2}}$. A smooth tunnel is bored along a diameter, and a stone is released at one end.</p>` },
};

const pas = (level, sub, group, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: EX[level], sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
items.push(
  pas(2, 'spring-mass system', 'p1', r`Find the angular frequency of the oscillation (in $\mathrm{rad\,s^{-1}}$).`, () => Math.sqrt(200 / 2), 0,
    0, r`$\omega = \sqrt{k/m} = \sqrt{200/2} = 10\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  pas(3, 'velocity in SHM', 'p1', r`Find the maximum speed of the block (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, () => 0.1 * 10, 0.05, 1,
    r`The amplitude is the starting displacement, $A = 0.10$ m. $v_{max} = A\omega = 0.10\times10 = 1.0\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  pas(3, 'velocity in SHM', 'p1', r`Find the speed of the block when it is 6 cm from the equilibrium position (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, () => 10 * Math.sqrt(0.1 ** 2 - 0.06 ** 2), 0.01, 2,
    r`$v = \omega\sqrt{A^2 - x^2} = 10\sqrt{0.01 - 0.0036} = 10\times0.08 = 0.80\ \mathrm{m\,s^{-1}}$. Check with energy: $\tfrac12\times200\times(0.01 - 0.0036) = 0.64$ J $= \tfrac12\times2\times v^2$, $v = 0.8$.`, { unit: 'm/s' }),
  pas(3, 'pendulum in a vehicle', 'p2', r`Find the angle the string makes with the vertical (in degrees).`, () => Math.atan(9.8 / 9.8) * 180 / PI, 0,
    0, r`In the car's frame, $\tan\theta = a/g = 1$, so $\theta = 45°$.`, { unit: '°' }),
  pas(3, 'pendulum in a vehicle', 'p2', r`Find the effective acceleration due to gravity in the car's frame (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, () => 9.8 * Math.SQRT2, 0.02, 2,
    r`$g_{eff} = \sqrt{g^2 + a^2} = \sqrt2g = 1.414\times9.8 = 13.86\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  pas(4, 'pendulum in a vehicle', 'p2', r`Find the time period of small oscillations of the pendulum about this equilibrium (in s, 3 decimals).`, () => 2 * PI * Math.sqrt(0.8 / (9.8 * Math.SQRT2)), 0.005, 3,
    r`$T = 2\pi\sqrt{L/g_{eff}} = 2\pi\sqrt{0.8/13.86} = 2\pi\times0.2402 = 1.509$ s.`, { unit: 's' }),
  pas(3, 'damped oscillations', 'p3', r`Find the angular frequency $\omega'$ of the damped oscillation (in $\mathrm{rad\,s^{-1}}$, 2 decimals).`, () => Math.sqrt(200 / 0.5 - 4 / (4 * 0.25)), 0.02, 2,
    r`$k/m = 400$ and $b^2/4m^2 = 4/(4\times0.25) = 4$. $\omega' = \sqrt{400 - 4} = 19.90\ \mathrm{rad\,s^{-1}}$, only slightly below $\omega_0 = 20$.`, { unit: 'rad/s' }),
  pas(4, 'damped oscillations', 'p3', r`After how many seconds does the amplitude fall to half its initial value? (2 decimals)`, () => Math.LN2 * 2 * 0.5 / 2, 0.01, 2,
    r`$e^{-bt/2m} = \tfrac12\Rightarrow bt/2m = \ln2\Rightarrow t = 2m\ln2/b = 2\times0.5\times0.693/2 = 0.35$ s.`, { unit: 's' }),
  pas(4, 'damped oscillations', 'p3', r`What fraction of the initial energy remains after 1 s? (3 decimals; energy $\propto A^2$)`, () => Math.exp(-2 * 2 * 1 / (2 * 0.5)), 0.001, 3,
    r`Energy $\propto A^2 = A_0^2e^{-bt/m}$. $bt/m = 2\times1/0.5 = 4$. Fraction $= e^{-4} = 0.018$.`, { unit: '' }),
  pas(3, 'tunnel through a planet', 'p4', r`Find the time period of the oscillation of the stone (in minutes, 1 decimal).`, () => 2 * PI * Math.sqrt(3.2e6 / 3.7) / 60, 0.1, 1,
    r`$T = 2\pi\sqrt{R/g} = 2\pi\sqrt{3.2\times10^6/3.7} = 5843$ s $= 97.4$ min.`, { unit: 'min' }),
  pas(4, 'tunnel through a planet', 'p4', r`Find the speed of the stone as it passes the centre (in $\mathrm{m\,s^{-1}}$, nearest 10).`, () => Math.round(Math.sqrt(3.7 * 3.2e6) / 10) * 10, 10,
    0, r`$v_{max} = R\omega = \sqrt{gR} = \sqrt{3.7\times3.2\times10^6} = 3441\ \mathrm{m\,s^{-1}}$, about 3440 m/s.`, { unit: 'm/s' }),
);

// ---------- Number templates ----------
const R = (x, dp) => +x.toFixed(dp);
const gens = [
  { id: 'os-g01', type: 'nat', level: 1, exams: EX[1], sub: 'SHM basics',
    make(rng) {
      const A = pick(rng, 2, 10); const w = pick(rng, 2, 20); const v = int(rng, 0, 3);
      const eq = r`$x = ${A}\sin(${w}t)$ cm`;
      if (v === 0) return { A, w, v, q: r`A particle moves as ${eq} ($t$ in s). Find its frequency (in Hz, 3 decimals).`, answer: R(w / (2 * PI), 3), tol: 0.004, unit: 'Hz',
        sol: r`$\omega = ${w}\ \mathrm{rad\,s^{-1}}$, so $f = \omega/2\pi = ${w}/6.283 = ${R(w / (2 * PI), 3)}$ Hz.`, trap: 'The number multiplying $t$ is $\\omega$, not $f$.' };
      if (v === 1) return { A, w, v, q: r`A particle moves as ${eq} ($t$ in s). Find its maximum speed (in cm/s).`, answer: A * w, tol: 0, unit: 'cm/s',
        sol: r`$v_{max} = A\omega = ${A}\times${w} = ${A * w}$ cm/s.` };
      if (v === 2) return { A, w, v, q: r`A particle moves as ${eq} ($t$ in s). Find its maximum acceleration (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, answer: R(A / 100 * w * w, 2), tol: 0.01, unit: 'm/s²',
        sol: r`$a_{max} = A\omega^2 = ${A / 100}\times${w}^2 = ${R(A / 100 * w * w, 2)}\ \mathrm{m\,s^{-2}}$ (amplitude in metres).`, trap: 'Change cm to m before using SI units.' };
      return { A, w, v, q: r`A particle moves as ${eq} ($t$ in s). Find its time period (in s, 3 decimals).`, answer: R(2 * PI / w, 3), tol: 0.004, unit: 's',
        sol: r`$T = 2\pi/\omega = 6.283/${w} = ${R(2 * PI / w, 3)}$ s.` };
    },
    verify: (p) => [1 / ((p.w / (2 * PI)) ), p.A * p.w, (p.A / 100) * (2 * PI * (p.w / (2 * PI))) ** 2, 1 / (p.w / (2 * PI))].map((x, i) => (i === 0 ? p.w / (2 * PI) : x))[p.v] },
  { id: 'os-g02', type: 'mcq', level: 2, exams: EX[2], sub: 'spring-mass system',
    make(rng) {
      const v = int(rng, 0, 3);
      let q; let a; let sol; let wr;
      if (v === 0) { const n = choose(rng, [4, 9, 16, 25]); a = Math.sqrt(n); q = r`A mass on a spring has period $T$. If the mass is made ${n} times as large, the new period is`; wr = [n, 1 / a, 1 / n]; sol = r`$T\propto\sqrt m$, so $T' = \sqrt{${n}}\,T = ${a}T$.`; }
      else if (v === 1) { const n = choose(rng, [2, 3, 4, 9]); a = 1 / Math.sqrt(n); q = r`A spring is cut into ${n} equal parts. A mass that gave period $T$ on the whole spring is now hung on one part. The new period is`; wr = [Math.sqrt(n), 1 / n, n]; sol = r`Each part has force constant ${n}$k$, so $T' = T/\sqrt{${n}} = ${fmt(a, 3)}T$.`; }
      else if (v === 2) { const par = rng() < 0.5; a = par ? 1 / Math.SQRT2 : Math.SQRT2; q = r`A mass hangs from two identical springs joined ${par ? 'side by side (parallel)' : 'end to end (series)'}. If it has period $T$ on one spring, its period on the combination is`; wr = [par ? Math.SQRT2 : 1 / Math.SQRT2, par ? 0.5 : 2, par ? 2 : 0.5]; sol = par ? r`Parallel: $k_{eq} = 2k$, so $T' = T/\sqrt2 = 0.707T$.` : r`Series: $k_{eq} = k/2$, so $T' = \sqrt2T = 1.414T$.`; }
      else { const m = choose(rng, [2, 3, 4]); const kk = choose(rng, [2, 3, 8]); a = Math.sqrt(m / kk); q = r`A mass on a spring has period $T$. The mass is made ${m} times as large and the spring is replaced by one of ${kk} times the force constant. The new period is`; wr = [Math.sqrt(m * kk), m / kk, Math.sqrt(kk / m)]; sol = r`$T\propto\sqrt{m/k}$, so $T' = \sqrt{${m}/${kk}}\,T = ${fmt(a, 3)}T$.`; }
      const o = numOpts(rng, a, wr, '× T', 3);
      return { v, a, q, options: o.options, answer: o.answer, sol, trap: 'Period goes as the square root of mass over force constant.' };
    },
    verify: null },
  { id: 'os-g03', type: 'nat', level: 2, exams: EX[2], sub: 'spring combinations',
    make(rng) {
      const k1 = pick(rng, 100, 600, 100); const k2 = pick(rng, 100, 600, 100); const m = pick(rng, 0.5, 4, 0.5); const v = int(rng, 0, 2);
      let keq; let how; let ex;
      if (v === 0) { keq = k1 * k2 / (k1 + k2); how = 'joined end to end (in series)'; ex = r`Series: $k_{eq} = \dfrac{k_1k_2}{k_1 + k_2} = \dfrac{${k1}\times${k2}}{${k1 + k2}} = ${R(keq, 2)}$ N/m.`; }
      else if (v === 1) { keq = k1 + k2; how = 'joined side by side (in parallel)'; ex = r`Parallel: $k_{eq} = k_1 + k_2 = ${keq}$ N/m.`; }
      else { keq = k1 + k2; how = 'fixed to two opposite walls, one on each side of the block (the block is between them on a smooth table)'; ex = r`Both springs push back together: $k_{eq} = k_1 + k_2 = ${keq}$ N/m.`; }
      const T = 2 * PI * Math.sqrt(m / keq);
      return { k1, k2, m, v, q: r`Springs of constant ${k1} N/m and ${k2} N/m are ${how}. A mass of ${m} kg is attached. Find the time period of oscillation (in s, 3 decimals).`, answer: R(T, 3), tol: 0.004, unit: 's',
        sol: r`${ex} $T = 2\pi\sqrt{m/k_{eq}} = 2\pi\sqrt{${m}/${R(keq, 2)}} = ${R(T, 3)}$ s.`, trap: 'Series adds reciprocals; parallel (or both sides) adds the constants.' };
    },
    verify: (p) => { const keq = p.v === 0 ? 1 / (1 / p.k1 + 1 / p.k2) : p.k1 + p.k2; return 2 * PI / Math.sqrt(keq / p.m); } },
  { id: 'os-g04', type: 'nat', level: 2, exams: EX[2], sub: 'velocity in SHM',
    make(rng) {
      const A = pick(rng, 5, 25, 5); const f = choose(rng, [0.6, 0.8]); const x = R(A * f, 2); const w = pick(rng, 2, 8); const v = int(rng, 0, 2);
      const vv = w * Math.sqrt(A * A - x * x); const root = Math.sqrt(A * A - x * x);
      if (v === 0) return { A, x, w, v, q: r`A particle of amplitude ${A} cm oscillates with angular frequency ${w} $\mathrm{rad\,s^{-1}}$. Find its speed when it is ${x} cm from the mean position (in cm/s, 1 decimal).`, answer: R(vv, 1), tol: 0.06, unit: 'cm/s',
        sol: r`$v = \omega\sqrt{A^2 - x^2} = ${w}\sqrt{${A}^2 - ${x}^2} = ${w}\times${R(root, 3)} = ${R(vv, 1)}$ cm/s.`, trap: 'Speed at a point is not $\\omega A$.' };
      if (v === 1) return { A, x, w, v, vv2: R(vv, 2), q: r`A particle in SHM has amplitude ${A} cm and its speed at ${x} cm from the mean position is ${R(vv, 2)} cm/s. Find its angular frequency (in $\mathrm{rad\,s^{-1}}$, 1 decimal).`, answer: w, tol: 0.06, unit: 'rad/s',
        sol: r`$\omega = \dfrac{v}{\sqrt{A^2 - x^2}} = \dfrac{${R(vv, 2)}}{${R(root, 3)}} = ${w}\ \mathrm{rad\,s^{-1}}$.` };
      const T = 2 * PI / w;
      return { A, x, w, v, q: r`A particle in SHM has amplitude ${A} cm and period ${R(T, 3)} s. Find its speed when ${x} cm from the mean position (in cm/s, 1 decimal).`, answer: R(vv, 1), tol: 0.1, unit: 'cm/s',
        sol: r`$\omega = 2\pi/T = ${w}$ rad/s. $v = \omega\sqrt{A^2 - x^2} = ${w}\times${R(root, 3)} = ${R(vv, 1)}$ cm/s.` };
    },
    verify: (p) => (p.v === 1 ? p.vv2 / Math.sqrt(p.A * p.A - p.x * p.x) : Math.sqrt(p.w * p.w * (p.A * p.A - p.x * p.x))) },
  { id: 'os-g05', type: 'nat', level: 3, exams: EX[3], sub: 'time in SHM',
    make(rng) {
      const T = pick(rng, 24, 120, 24); const v = int(rng, 0, 3);
      const cases = [
        { q: r`A particle in SHM of period ${T} s starts from the mean position. Find the time (in s) to reach a displacement $A/2$.`, frac: 1 / 12, why: r`$x = A\sin(2\pi t/T)$, $\sin\phi = \tfrac12$, $\phi = \pi/6$, $t = T/12$.` },
        { q: r`A particle in SHM of period ${T} s starts from the extreme position. Find the time (in s) to reach $A/2$.`, frac: 1 / 6, why: r`$x = A\cos(2\pi t/T)$, $\cos\phi = \tfrac12$, $\phi = \pi/3$, $t = T/6$.` },
        { q: r`A particle in SHM of period ${T} s starts from the mean position. Find the time (in s) at which its kinetic energy first equals its potential energy.`, frac: 1 / 8, why: r`$K = U$ at $x = A/\sqrt2$, $\phi = \pi/4$, $t = T/8$.` },
        { q: r`A particle in SHM of period ${T} s moves from $x = -A/2$ to $x = +A/2$ through the mean position. Find the time taken (in s).`, frac: 1 / 6, why: r`Each half takes $T/12$ ($\phi = \pi/6$). Total $T/6$.` },
      ];
      const cc = cases[v]; const t = T * cc.frac;
      return { T, v, frac: cc.frac, q: cc.q, answer: t, tol: 0.01, unit: 's', sol: r`${cc.why} With $T = ${T}$ s: $t = ${R(t, 2)}$ s.`, trap: 'Near the extreme the particle moves slowly, so equal distances take unequal times.' };
    },
    verify: (p) => p.T * [1 / 12, 1 / 6, 1 / 8, 1 / 6][p.v] },
  { id: 'os-g06', type: 'nat', level: 2, exams: EX[2], sub: 'simple pendulum',
    make(rng) {
      const v = int(rng, 0, 3);
      if (v === 0) { const L = pick(rng, 0.25, 4, 0.25); const T = 2 * PI * Math.sqrt(L / 9.8); return { v, L, q: r`Find the time period of a simple pendulum of length ${L} m (in s, 3 decimals; $g = 9.8$).`, answer: R(T, 3), tol: 0.004, unit: 's', sol: r`$T = 2\pi\sqrt{L/g} = 2\pi\sqrt{${L}/9.8} = ${R(T, 3)}$ s.` }; }
      if (v === 1) { const T = pick(rng, 1, 4, 0.5); const L = 9.8 * T * T / (4 * PI * PI); return { v, T, q: r`A simple pendulum has a time period of ${T} s. Find its length (in m, 3 decimals; $g = 9.8$).`, answer: R(L, 3), tol: 0.004, unit: 'm', sol: r`$L = gT^2/4\pi^2 = 9.8\times${T * T}/39.478 = ${R(L, 3)}$ m.` }; }
      if (v === 2) { const gp = choose(rng, [1.62, 3.7, 3.72, 24.8, 9.8 * 2, 9.8 / 4]); const L = pick(rng, 0.5, 2, 0.25); const T = 2 * PI * Math.sqrt(L / gp); return { v, L, gp, q: r`A simple pendulum of length ${L} m is used on a planet where $g = ${R(gp, 2)}\ \mathrm{m\,s^{-2}}$. Find its period (in s, 3 decimals).`, answer: R(T, 3), tol: 0.004, unit: 's', sol: r`$T = 2\pi\sqrt{L/g} = 2\pi\sqrt{${L}/${R(gp, 2)}} = ${R(T, 3)}$ s.` }; }
      const n = pick(rng, 20, 50, 10); const L = pick(rng, 0.5, 1.5, 0.25); const t = n * 2 * PI * Math.sqrt(L / 9.8);
      return { v, n, L, q: r`A simple pendulum of length ${L} m makes ${n} complete oscillations. How long does that take (in s, 1 decimal; $g = 9.8$)?`, answer: R(t, 1), tol: 0.1, unit: 's', sol: r`$T = 2\pi\sqrt{${L}/9.8} = ${R(2 * PI * Math.sqrt(L / 9.8), 4)}$ s. Time for ${n} oscillations $= ${n}T = ${R(t, 1)}$ s.` };
    },
    verify: (p) => (p.v === 0 ? 2 * PI * Math.sqrt(p.L / 9.8) : p.v === 1 ? 9.8 * p.T ** 2 / (4 * PI ** 2) : p.v === 2 ? 2 * PI / Math.sqrt(p.gp / p.L) : p.n * 2 * PI * Math.sqrt(p.L / 9.8)) },
  { id: 'os-g07', type: 'nat', level: 3, exams: EX[3], sub: 'pendulum in an accelerated frame',
    make(rng) {
      const L = pick(rng, 0.5, 2, 0.25); const a = choose(rng, [1.96, 2.45, 4.9, 7.35]); const v = int(rng, 0, 2);
      let ge; let situ; let ex;
      if (v === 0) { ge = 9.8 + a; situ = `a lift accelerating upward at ${a} $\\mathrm{m\\,s^{-2}}$`; ex = r`Upward acceleration: $g_{eff} = g + a = ${R(ge, 2)}\ \mathrm{m\,s^{-2}}$.`; }
      else if (v === 1) { ge = 9.8 - a; situ = `a lift accelerating downward at ${a} $\\mathrm{m\\,s^{-2}}$`; ex = r`Downward acceleration: $g_{eff} = g - a = ${R(ge, 2)}\ \mathrm{m\,s^{-2}}$.`; }
      else { ge = Math.hypot(9.8, a); situ = `a car accelerating horizontally at ${a} $\\mathrm{m\\,s^{-2}}$`; ex = r`Horizontal acceleration: $g_{eff} = \sqrt{g^2 + a^2} = \sqrt{9.8^2 + ${a}^2} = ${R(ge, 3)}\ \mathrm{m\,s^{-2}}$.`; }
      const T = 2 * PI * Math.sqrt(L / ge);
      return { L, a, v, q: r`A simple pendulum of length ${L} m is in ${situ}. Find the time period of small oscillations (in s, 3 decimals; $g = 9.8$).`, answer: R(T, 3), tol: 0.004, unit: 's',
        sol: r`${ex} $T = 2\pi\sqrt{L/g_{eff}} = 2\pi\sqrt{${L}/${R(ge, 3)}} = ${R(T, 3)}$ s.`, trap: 'Horizontal acceleration adds as a vector, not as $g \\pm a$.' };
    },
    verify: (p) => { const T0 = 2 * PI * Math.sqrt(p.L / 9.8); const f = p.v === 0 ? Math.sqrt(9.8 / (9.8 + p.a)) : p.v === 1 ? Math.sqrt(9.8 / (9.8 - p.a)) : Math.sqrt(9.8 / Math.sqrt(9.8 ** 2 + p.a ** 2)); return T0 * f; } },
  { id: 'os-g08', type: 'nat', level: 3, exams: EX[3], sub: 'change in period',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const f = choose(rng, [1.21, 1.44, 1.69, 0.81, 0.64, 0.49]); const pc = (Math.sqrt(f) - 1) * 100; return { v, f, q: r`The length of a simple pendulum is changed to ${R(f * 100, 0)} % of its original value. Find the percentage change in its period (negative for a decrease).`, answer: Math.round(pc), tol: 0, unit: '%', sol: r`$T\propto\sqrt L$. New $T/T_0 = \sqrt{${f}} = ${R(Math.sqrt(f), 2)}$, a change of ${Math.round(pc)} %.` }; }
      if (v === 1) { const dg = pick(rng, 0.01, 0.05, 0.01); const loss = 86400 * 0.5 * dg / 100; return { v, dg, q: r`A pendulum clock is moved to a place where $g$ is ${dg} % smaller. How many seconds does it lose per day? (Small changes: $\Delta T/T = \tfrac12\Delta g/g$; 2 decimals.)`, answer: R(loss, 2), tol: 0.05, unit: 's', sol: r`$\Delta T/T = \tfrac12\times${dg}\,\% = ${R(dg / 200, 5)}\,\%$. Loss per day $= 86\,400\times${R(dg / 200 / 100, 7)} = ${R(loss, 2)}$ s.` }; }
      const n = pick(rng, 1, 4, 1); const lossd = 86400 * 0.5 * n / 1000;
      return { v, n, q: r`The length of a pendulum in a clock increases by ${R(n / 10, 1)} % because of heat. How many seconds does the clock lose in a day? (Use $\Delta T/T = \tfrac12\Delta L/L$; 2 decimals.)`, answer: R(86400 * 0.5 * n / 1000, 2), tol: 0.05, unit: 's', sol: r`$\Delta T/T = \tfrac12\times${R(n / 10, 1)}\,\% = ${R(n / 2000, 5)}$. Loss per day $= 86\,400\times${R(n / 2000, 5)} = ${R(lossd, 2)}$ s.` };
    },
    verify: (p) => (p.v === 0 ? (Math.sqrt(p.f) - 1) * 100 : p.v === 1 ? 86400 * (p.dg / 100) / 2 : 86400 * (p.n / 1000) / 2) },
  { id: 'os-g09', type: 'nat', level: 3, exams: EX[3], sub: 'energy in SHM',
    make(rng) {
      const k = pick(rng, 100, 500, 50); const A = pick(rng, 0.04, 0.2, 0.02); const f = choose(rng, [0.5, 0.6, 0.8]); const x = R(A * f, 4); const v = int(rng, 0, 2);
      const E = 0.5 * k * A * A * 1000; const U = 0.5 * k * x * x * 1000; const K = E - U;
      if (v === 0) return { k, A, x, v, q: r`A body attached to a spring of constant ${k} N/m oscillates with amplitude ${A * 100} cm. Find its total energy (in mJ, 1 decimal).`, answer: R(E, 1), tol: 0.1, unit: 'mJ', sol: r`$E = \tfrac12kA^2 = \tfrac12\times${k}\times${R(A, 3)}^2 = ${R(E / 1000, 4)}$ J $= ${R(E, 1)}$ mJ.` };
      if (v === 1) return { k, A, x, v, q: r`A spring of constant ${k} N/m has a body oscillating with amplitude ${R(A * 100, 1)} cm. Find the kinetic energy when it is ${R(x * 100, 2)} cm from the mean position (in mJ, 1 decimal).`, answer: R(K, 1), tol: 0.2, unit: 'mJ', sol: r`$K = \tfrac12k(A^2 - x^2) = \tfrac12\times${k}\times(${R(A, 3)}^2 - ${x}^2) = ${R(K / 1000, 5)}$ J $= ${R(K, 1)}$ mJ.` };
      return { k, A, x, v, q: r`A spring of constant ${k} N/m has a body oscillating with amplitude ${R(A * 100, 1)} cm. Find the potential energy stored when it is ${R(x * 100, 2)} cm from the mean position (in mJ, 1 decimal).`, answer: R(U, 1), tol: 0.2, unit: 'mJ', sol: r`$U = \tfrac12kx^2 = \tfrac12\times${k}\times${x}^2 = ${R(U / 1000, 5)}$ J $= ${R(U, 1)}$ mJ.` };
    },
    verify: (p) => (p.v === 0 ? 500 * p.k * p.A * p.A : p.v === 1 ? 500 * p.k * (p.A * p.A - p.x * p.x) : 500 * p.k * p.x * p.x) },
  { id: 'os-g10', type: 'nat', level: 3, exams: EX[3], sub: 'floating bodies and liquids',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const L = pick(rng, 0.2, 1.2, 0.2); const T = 2 * PI * Math.sqrt(L / 19.6); return { v, L, q: r`A liquid column of total length ${L} m oscillates in a uniform U-tube (no friction). Find the period (in s, 3 decimals; $g = 9.8$).`, answer: R(T, 3), tol: 0.004, unit: 's', sol: r`$T = 2\pi\sqrt{L/2g} = 2\pi\sqrt{${L}/19.6} = ${R(T, 3)}$ s.`, trap: 'The factor is $2g$, because the level difference is twice the displacement.' }; }
      if (v === 1) { const m = pick(rng, 0.2, 1, 0.1); const Acm = pick(rng, 10, 50, 10); const T = 2 * PI * Math.sqrt(m / (1000 * 9.8 * Acm * 1e-4)); return { v, m, Acm, q: r`A block of mass ${m} kg and cross-sectional area ${Acm} $\mathrm{cm^2}$ floats upright, with vertical sides, in water ($1000\ \mathrm{kg\,m^{-3}}$). Find the period of its vertical oscillations (in s, 3 decimals).`, answer: R(T, 3), tol: 0.004, unit: 's', sol: r`$k = \rho gA = 1000\times9.8\times${Acm / 10000} = ${R(9.8 * Acm / 10, 2)}$ N/m. $T = 2\pi\sqrt{m/k} = 2\pi\sqrt{${m}/${R(9.8 * Acm / 10, 2)}} = ${R(T, 3)}$ s.` }; }
      const h = pick(rng, 0.1, 0.5, 0.1); const rho = pick(rng, 200, 800, 100); const T = 2 * PI * Math.sqrt(h * rho / (1000 * 9.8));
      return { v, h, rho, q: r`A uniform cylinder of height ${h} m and density ${rho} $\mathrm{kg\,m^{-3}}$ floats upright in water. Find the period of its small vertical oscillations (in s, 3 decimals; $g = 9.8$).`, answer: R(T, 3), tol: 0.004, unit: 's', sol: r`$T = 2\pi\sqrt{\rho h/(\sigma g)} = 2\pi\sqrt{${rho}\times${h}/(1000\times9.8)} = ${R(T, 3)}$ s (the area cancels).` };
    },
    verify: (p) => (p.v === 0 ? 2 * PI * Math.sqrt(p.L / (2 * 9.8)) : p.v === 1 ? 2 * PI / Math.sqrt(1000 * 9.8 * p.Acm * 1e-4 / p.m) : 2 * PI * Math.sqrt(p.h * (p.rho / 1000) / 9.8)) },
  { id: 'os-g11', type: 'nat', level: 3, exams: EX[3], sub: 'physical pendulum',
    make(rng) {
      const v = int(rng, 0, 2); const s = pick(rng, 0.2, 1.5, 0.1);
      const bodies = [
        { name: 'uniform rod', dim: 'length', eq: 2 * s / 3, ex: r`$T = 2\pi\sqrt{2L/3g}$ (equivalent length $2L/3$) with $L = ${s}$ m` },
        { name: 'thin ring', dim: 'radius', eq: 2 * s, ex: r`$T = 2\pi\sqrt{2R/g}$ (equivalent length $2R$) with $R = ${s}$ m` },
        { name: 'uniform disc', dim: 'radius', eq: 1.5 * s, ex: r`$T = 2\pi\sqrt{3R/2g}$ (equivalent length $3R/2$) with $R = ${s}$ m` },
      ];
      const b = bodies[v]; const T = 2 * PI * Math.sqrt(b.eq / 9.8);
      return { v, s, q: r`A ${b.name} of ${b.dim} ${s} m hangs from a horizontal axis ${v === 0 ? 'through one end' : 'through a point on its rim, perpendicular to its plane'} and swings through small angles. Find its period (in s, 3 decimals; $g = 9.8$).`, answer: R(T, 3), tol: 0.004, unit: 's', sol: r`${b.ex}: $T = 2\pi\sqrt{${R(b.eq, 3)}/9.8} = ${R(T, 3)}$ s.`, trap: 'Use the moment of inertia about the pivot (parallel-axis theorem).' };
    },
    verify: (p) => { const I = [1 / 3, 1 + 1, 0.5 + 1][p.v] * p.s * p.s; const d = [p.s / 2, p.s, p.s][p.v]; return 2 * PI * Math.sqrt(I / (9.8 * d)); } },
  { id: 'os-g12', type: 'nat', level: 3, exams: EX[3], sub: 'tunnel through a planet',
    make(rng) {
      const Rk = pick(rng, 1700, 7000, 100); const gp = pick(rng, 1.5, 12, 0.5); const v = int(rng, 0, 2);
      const Rm = Rk * 1000; const T = 2 * PI * Math.sqrt(Rm / gp);
      if (v === 0) return { v, Rk, gp, q: r`A planet of uniform density has radius ${Rk} km and surface gravity ${gp} $\mathrm{m\,s^{-2}}$. Find the period of a stone oscillating in a smooth tunnel through its centre (in minutes, 1 decimal).`, answer: R(T / 60, 1), tol: 0.2, unit: 'min', sol: r`$T = 2\pi\sqrt{R/g} = 2\pi\sqrt{${Rm}/${gp}} = ${R(T, 0)}$ s $= ${R(T / 60, 1)}$ min.` };
      if (v === 1) return { v, Rk, gp, q: r`A planet of uniform density has radius ${Rk} km and surface gravity ${gp} $\mathrm{m\,s^{-2}}$. A stone is dropped into a smooth tunnel through its centre. Find its speed at the centre (in km/s, 2 decimals).`, answer: R(Math.sqrt(gp * Rm) / 1000, 2), tol: 0.02, unit: 'km/s', sol: r`$v_{max} = \sqrt{gR} = \sqrt{${gp}\times${Rm}} = ${R(Math.sqrt(gp * Rm), 0)}\ \mathrm{m\,s^{-1}} = ${R(Math.sqrt(gp * Rm) / 1000, 2)}$ km/s.` };
      return { v, Rk, gp, q: r`A planet of uniform density has radius ${Rk} km and surface gravity ${gp} $\mathrm{m\,s^{-2}}$. How long does a stone dropped from the surface take to reach the centre through a smooth tunnel (in minutes, 1 decimal)?`, answer: R(T / 240, 1), tol: 0.1, unit: 'min', sol: r`The fall is a quarter of an oscillation: $T/4$ with $T = 2\pi\sqrt{R/g} = ${R(T / 60, 1)}$ min. Time $= ${R(T / 240, 1)}$ min.` };
    },
    verify: (p) => (p.v === 0 ? 2 * PI * Math.sqrt(p.Rk * 1000 / p.gp) / 60 : p.v === 1 ? Math.sqrt(p.gp * p.Rk * 1000) / 1000 : 2 * PI * Math.sqrt(p.Rk * 1000 / p.gp) / 240) },
  { id: 'os-g13', type: 'nat', level: 4, exams: EX[4], sub: 'collision and SHM',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const m = pick(rng, 0.1, 0.5, 0.1); const M = pick(rng, 1, 3, 0.5); const u = pick(rng, 5, 20, 5); const k = pick(rng, 100, 400, 50); const V = m * u / (m + M); const A = V / Math.sqrt(k / (m + M)) * 100; return { v, m, M, u, k, q: r`A ${m} kg lump of putty moving at ${u} $\mathrm{m\,s^{-1}}$ hits a ${M} kg block at rest on a smooth table and sticks. The block is joined to a spring of constant ${k} N/m (at natural length). Find the amplitude of the resulting oscillation (in cm, 2 decimals).`, answer: R(A, 2), tol: 0.03, unit: 'cm', sol: r`$V = \dfrac{mu}{m + M} = \dfrac{${m}\times${u}}{${R(m + M, 2)}} = ${R(V, 3)}\ \mathrm{m\,s^{-1}}$. $\omega = \sqrt{k/(m + M)} = \sqrt{${k}/${R(m + M, 2)}} = ${R(Math.sqrt(k / (m + M)), 3)}$. $A = V/\omega = ${R(A, 2)}$ cm.`, trap: 'Use the combined mass in $\\omega$.' }; }
      if (v === 1) { const M = pick(rng, 1, 4, 1); const m = pick(rng, 1, 4, 1); const A0 = pick(rng, 4, 12, 2); const A = A0 * Math.sqrt(M / (M + m)); return { v, M, m, A0, q: r`A ${M} kg block oscillates on a smooth horizontal spring with amplitude ${A0} cm. As it passes the mean position, a ${m} kg lump of putty falls vertically onto it and sticks. Find the new amplitude (in cm, 2 decimals).`, answer: R(A, 2), tol: 0.03, unit: 'cm', sol: r`Horizontal momentum: $Mv = (M + m)v'$. With $v = A\omega$ and $\omega'/\omega = \sqrt{M/(M + m)}$, $A' = A\sqrt{M/(M + m)} = ${A0}\sqrt{${M}/${M + m}} = ${R(A, 2)}$ cm.`, trap: 'At the extreme position the amplitude would be unchanged.' }; }
      const M = pick(rng, 1, 3, 1); const m = pick(rng, 1, 3, 1); const k = pick(rng, 100, 400, 100); const T = 2 * PI * Math.sqrt((M + m) / k); return { v, M, m, k, q: r`A ${M} kg block oscillates on a smooth horizontal spring of constant ${k} N/m. At its extreme position a ${m} kg lump of putty is stuck onto it. Find the new time period (in s, 3 decimals).`, answer: R(T, 3), tol: 0.004, unit: 's', sol: r`The amplitude does not change when mass is added at an extreme, but the period does: $T = 2\pi\sqrt{(M + m)/k} = 2\pi\sqrt{${M + m}/${k}} = ${R(T, 3)}$ s.` };
    },
    verify: (p) => (p.v === 0 ? (p.m * p.u / (p.m + p.M)) * 100 / Math.sqrt(p.k / (p.m + p.M)) : p.v === 1 ? p.A0 * Math.sqrt(p.M / (p.M + p.m)) : 2 * PI / Math.sqrt(p.k / (p.M + p.m))) },
  { id: 'os-g14', type: 'nat', level: 2, exams: EX[2], sub: 'vertical spring',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const e = pick(rng, 2, 20, 2); const T = 2 * PI * Math.sqrt(e / 100 / 9.8); return { v, e, q: r`A mass hung on a vertical spring stretches it by ${e} cm at equilibrium. Find the time period of its vertical oscillations (in s, 3 decimals; $g = 9.8$).`, answer: R(T, 3), tol: 0.004, unit: 's', sol: r`$T = 2\pi\sqrt{e/g} = 2\pi\sqrt{${e / 100}/9.8} = ${R(T, 3)}$ s.` }; }
      if (v === 1) { const T = pick(rng, 0.3, 1.2, 0.1); const e = 9.8 * T * T / (4 * PI * PI) * 100; return { v, T, q: r`A mass hung on a vertical spring oscillates with period ${T} s. By how much does it stretch the spring at equilibrium (in cm, 2 decimals; $g = 9.8$)?`, answer: R(e, 2), tol: 0.05, unit: 'cm', sol: r`$e = gT^2/4\pi^2 = 9.8\times${R(T * T, 2)}/39.478 = ${R(e / 100, 4)}$ m $= ${R(e, 2)}$ cm.` }; }
      const m = pick(rng, 0.2, 1, 0.1); const k = pick(rng, 20, 100, 10); const e = m * 9.8 / k * 100; return { v, m, k, q: r`A mass of ${m} kg is hung on a vertical spring of constant ${k} N/m. Find the extension at equilibrium (in cm, 1 decimal; $g = 9.8$).`, answer: R(e, 1), tol: 0.1, unit: 'cm', sol: r`$e = mg/k = ${m}\times9.8/${k} = ${R(e / 100, 4)}$ m $= ${R(e, 1)}$ cm.` };
    },
    verify: (p) => (p.v === 0 ? 2 * PI * Math.sqrt(p.e / 100 / 9.8) : p.v === 1 ? 100 * 9.8 / (2 * PI / p.T) ** 2 : p.m * 9.8 / p.k * 100) },
  { id: 'os-g15', type: 'nat', level: 4, exams: EX[4], sub: 'superposition of SHM',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const A1 = pick(rng, 2, 6); const A2 = pick(rng, 2, 6); const ph = choose(rng, [0, 60, 90, 120, 180]); const A = Math.sqrt(A1 * A1 + A2 * A2 + 2 * A1 * A2 * Math.cos(ph * PI / 180)); return { v, A1, A2, ph, q: r`Two SHMs along the same line, of amplitudes ${A1} cm and ${A2} cm and the same frequency, differ in phase by ${ph}°. Find the amplitude of the resultant (in cm, 2 decimals).`, answer: R(A, 2), tol: 0.02, unit: 'cm', sol: r`$A = \sqrt{A_1^2 + A_2^2 + 2A_1A_2\cos\phi} = \sqrt{${A1 * A1} + ${A2 * A2} + 2\times${A1}\times${A2}\times${R(Math.cos(ph * PI / 180), 3)}} = ${R(A, 2)}$ cm.` }; }
      if (v === 1) { const A1 = pick(rng, 2, 8); const ph = choose(rng, [60, 90, 120, 180]); const A = 2 * A1 * Math.abs(Math.cos(ph * PI / 360)); return { v, A1, ph, q: r`Two SHMs of the same frequency and equal amplitude ${A1} cm are added with a phase difference of ${ph}°. Find the amplitude of the resultant (in cm, 2 decimals).`, answer: R(A, 2), tol: 0.02, unit: 'cm', sol: r`For equal amplitudes, $A = 2A_1\cos(\phi/2) = 2\times${A1}\times\cos${ph / 2}° = ${R(A, 2)}$ cm.` }; }
      const a = pick(rng, 2, 9); const b = pick(rng, 2, 9); const A = Math.hypot(a, b); return { v, a, b, q: r`A particle is acted on by $x_1 = ${a}\sin\omega t$ and $x_2 = ${b}\cos\omega t$ (cm). Find the amplitude of the resultant motion (in cm, 2 decimals).`, answer: R(A, 2), tol: 0.02, unit: 'cm', sol: r`The two are $90°$ apart in phase: $A = \sqrt{${a}^2 + ${b}^2} = \sqrt{${a * a + b * b}} = ${R(A, 2)}$ cm.` };
    },
    verify: (p) => (p.v === 0 ? Math.sqrt((p.A1 + p.A2 * Math.cos(p.ph * PI / 180)) ** 2 + (p.A2 * Math.sin(p.ph * PI / 180)) ** 2) : p.v === 1 ? Math.sqrt((p.A1 + p.A1 * Math.cos(p.ph * PI / 180)) ** 2 + (p.A1 * Math.sin(p.ph * PI / 180)) ** 2) : Math.sqrt(p.a * p.a + p.b * p.b)) },
  { id: 'os-g16', type: 'nat', level: 3, exams: EX[3], sub: 'damped oscillations',
    make(rng) {
      const m = choose(rng, [0.1, 0.2, 0.5, 1]); const b = choose(rng, [0.02, 0.05, 0.1, 0.2]); const v = int(rng, 0, 2);
      if (v === 0) { const t = 2 * m / b; return { v, m, b, q: r`A damped oscillator of mass ${m} kg has damping force $-bv$ with $b = ${b}\ \mathrm{kg\,s^{-1}}$. Its amplitude decays as $A_0e^{-bt/2m}$. In what time does the amplitude fall to $1/e$ of its initial value (in s, 1 decimal)?`, answer: R(t, 1), tol: 0.1, unit: 's', sol: r`$bt/2m = 1\Rightarrow t = 2m/b = 2\times${m}/${b} = ${R(t, 1)}$ s.` }; }
      if (v === 1) { const t = 2 * m * Math.LN2 / b; return { v, m, b, q: r`A damped oscillator of mass ${m} kg has damping force $-bv$ with $b = ${b}\ \mathrm{kg\,s^{-1}}$ and amplitude $A_0e^{-bt/2m}$. In what time does the amplitude fall to half its initial value (in s, 2 decimals)?`, answer: R(t, 2), tol: 0.02, unit: 's', sol: r`$e^{-bt/2m} = \tfrac12\Rightarrow t = \dfrac{2m\ln2}{b} = \dfrac{2\times${m}\times0.693}{${b}} = ${R(t, 2)}$ s.` }; }
      const t = pick(rng, 1, 2, 0.5); const fr = Math.exp(-b * t / m); return { v, m, b, t, q: r`A damped oscillator of mass ${m} kg has damping force $-bv$ with $b = ${b}\ \mathrm{kg\,s^{-1}}$. What fraction of its initial energy remains after ${t} s (3 decimals)? Energy is proportional to the square of the amplitude, $A = A_0e^{-bt/2m}$.`, answer: R(fr, 3), tol: 0.002, unit: '', sol: r`Energy $\propto A^2 = A_0^2e^{-bt/m}$. $bt/m = ${b}\times${t}/${m} = ${R(b * t / m, 3)}$. Fraction $= e^{-${R(b * t / m, 3)}} = ${R(fr, 3)}$.` };
    },
    verify: (p) => (p.v === 0 ? 2 * p.m / p.b : p.v === 1 ? Math.log(2) / (p.b / (2 * p.m)) : (Math.exp(-p.b * p.t / (2 * p.m))) ** 2) },
  { id: 'os-g17', type: 'mcq', level: 3, exams: EX[3], sub: 'phase',
    make(rng) {
      const cases = [
        { s: r`$\dfrac A2$`, ang: 30, dir: 'positive', val: 0.5 }, { s: r`$\dfrac{A}{2}$`, ang: 150, dir: 'negative', val: 0.5 },
        { s: r`$\dfrac{A}{\sqrt2}$`, ang: 45, dir: 'positive', val: 1 }, { s: r`$\dfrac{A}{\sqrt2}$`, ang: 135, dir: 'negative', val: 1 },
        { s: r`$\dfrac{\sqrt3A}{2}$`, ang: 60, dir: 'positive', val: 2 }, { s: r`$\dfrac{\sqrt3A}{2}$`, ang: 120, dir: 'negative', val: 2 },
        { s: r`$-\dfrac A2$`, ang: 210, dir: 'negative', val: 3 }, { s: r`$-\dfrac A2$`, ang: 330, dir: 'positive', val: 3 },
      ];
      const cs = choose(rng, cases); const sup = 180 - cs.ang; const opts = [cs.ang, sup < 0 ? sup + 360 : sup, (cs.ang + 90) % 360, (360 - cs.ang) % 360, (cs.ang + 180) % 360].filter((x, i, a) => a.indexOf(x) === i);
      const wrongs = opts.filter((x) => x !== cs.ang).slice(0, 3).map((x) => `${x}°`);
      const o = shuffleOpts(rng, `${cs.ang}°`, wrongs);
      return { ang: cs.ang, q: r`A particle moves as $x = A\sin(\omega t + \phi)$ with $0\le\phi<360°$. At $t = 0$ its displacement is ${cs.s} and it is moving in the ${cs.dir} $x$ direction. Find $\phi$.`, options: o.options, answer: o.answer,
        sol: r`$\sin\phi$ equals the displacement ratio, which gives two angles; the velocity $A\omega\cos\phi$ is ${cs.dir} so $\cos\phi$ is ${cs.dir === 'positive' ? 'positive' : 'negative'}. That selects $\phi = ${cs.ang}°$.`, trap: 'The displacement alone gives two angles; the direction of motion picks one.' };
    },
    verify: null },
  { id: 'os-g18', type: 'nat', level: 3, exams: EX[3], sub: 'finding g',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const dL = choose(rng, [0.5, 1, 1.5, 2]); const dT = choose(rng, [0.2, 0.5, 1]); const e = dL + 2 * dT; return { v, dL, dT, q: r`In a pendulum experiment the length is measured with an error of ${dL} % and the time period with an error of ${dT} %. Find the maximum percentage error in the value of $g$ (1 decimal).`, answer: R(e, 1), tol: 0.05, unit: '%', sol: r`$g = 4\pi^2L/T^2$, so $\dfrac{\Delta g}{g} = \dfrac{\Delta L}{L} + 2\dfrac{\Delta T}{T} = ${dL} + 2\times${dT} = ${R(e, 1)}\ \%$.`, trap: '$T$ is squared, so its error counts twice.' }; }
      if (v === 1) { const s = pick(rng, 3.8, 4.2, 0.1); const gg = 4 * PI * PI / s; return { v, s, q: r`A graph of $T^2$ (s$^2$) against $L$ (m) for a simple pendulum is a straight line of slope ${R(s, 1)} $\mathrm{s^2\,m^{-1}}$. Find $g$ (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, answer: R(gg, 2), tol: 0.02, unit: 'm/s²', sol: r`$T^2 = (4\pi^2/g)L$, so $g = 4\pi^2/\text{slope} = 39.478/${R(s, 1)} = ${R(gg, 2)}\ \mathrm{m\,s^{-2}}$.` }; }
      const L = pick(rng, 0.5, 1.5, 0.25); const n = pick(rng, 20, 40, 10); const t = n * 2 * PI * Math.sqrt(L / 9.78); const tt = R(t, 1); const T = tt / n; const gg = 4 * PI * PI * L / (T * T);
      return { v, L, n, tt, q: r`A simple pendulum of length ${L} m completes ${n} oscillations in ${tt} s. Find $g$ from these readings (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, answer: R(gg, 2), tol: 0.05, unit: 'm/s²', sol: r`$T = ${tt}/${n} = ${R(T, 4)}$ s. $g = 4\pi^2L/T^2 = 39.478\times${L}/${R(T * T, 5)} = ${R(gg, 2)}\ \mathrm{m\,s^{-2}}$.` };
    },
    verify: (p) => (p.v === 0 ? p.dL + 2 * p.dT : p.v === 1 ? 4 * PI * PI / p.s : 4 * PI * PI * p.L * p.n * p.n / (p.tt * p.tt)) },
  { id: 'os-g19', type: 'nat', level: 4, exams: EX[4], sub: 'reduced mass',
    make(rng) {
      const m1 = pick(rng, 1, 5); const m2 = pick(rng, 1, 5); const k = pick(rng, 50, 400, 50); const v = int(rng, 0, 1);
      const mu = m1 * m2 / (m1 + m2); const w = Math.sqrt(k / mu);
      if (v === 0) return { v, m1, m2, k, q: r`Two blocks of masses ${m1} kg and ${m2} kg are joined by a light spring of constant ${k} N/m on a smooth table. They are pulled apart and released. Find the angular frequency of oscillation (in $\mathrm{rad\,s^{-1}}$, 2 decimals).`, answer: R(w, 2), tol: 0.02, unit: 'rad/s', sol: r`$\mu = \dfrac{m_1m_2}{m_1 + m_2} = \dfrac{${m1}\times${m2}}{${m1 + m2}} = ${R(mu, 3)}$ kg. $\omega = \sqrt{k/\mu} = \sqrt{${k}/${R(mu, 3)}} = ${R(w, 2)}\ \mathrm{rad\,s^{-1}}$.`, trap: 'Use the reduced mass, not either mass alone.' };
      return { v, m1, m2, k, q: r`Two blocks of masses ${m1} kg and ${m2} kg are joined by a light spring of constant ${k} N/m on a smooth table. Find the time period of their relative oscillation (in s, 3 decimals).`, answer: R(2 * PI / w, 3), tol: 0.004, unit: 's', sol: r`$\mu = ${R(mu, 3)}$ kg. $T = 2\pi\sqrt{\mu/k} = 2\pi\sqrt{${R(mu, 3)}/${k}} = ${R(2 * PI / w, 3)}$ s.` };
    },
    verify: (p) => { const w = Math.sqrt(p.k * (1 / p.m1 + 1 / p.m2)); return p.v === 0 ? w : 2 * PI / w; } },
  { id: 'os-g20', type: 'nat', level: 4, exams: EX[4], sub: 'rolling and rotation with springs',
    make(rng) {
      const m = pick(rng, 1, 5); const k = pick(rng, 50, 500, 50); const v = int(rng, 0, 3);
      const bodies = [['solid cylinder', 1.5], ['solid sphere', 1.4], ['hollow cylinder (thin ring)', 2], ['uniform disc', 1.5]];
      const [name, fac] = bodies[v]; const w = Math.sqrt(k / (fac * m));
      return { m, k, v, q: r`A ${name} of mass ${m} kg rolls without slipping on a horizontal floor. A spring of constant ${k} N/m is joined to its axle, along the floor. Find the angular frequency of small oscillations (in $\mathrm{rad\,s^{-1}}$, 2 decimals).`, answer: R(w, 2), tol: 0.02, unit: 'rad/s',
        sol: r`Kinetic energy $= \tfrac12mv^2(1 + I/mR^2) = \tfrac12(${fac}m)v^2$, so the effective mass is $${fac}m = ${R(fac * m, 2)}$ kg. $\omega = \sqrt{k/(${fac}m)} = \sqrt{${k}/${R(fac * m, 2)}} = ${R(w, 2)}\ \mathrm{rad\,s^{-1}}$.`, trap: 'Rolling adds rotational kinetic energy to the effective mass.' };
    },
    verify: (p) => { const I = [0.5, 0.4, 1, 0.5][p.v]; return Math.sqrt(p.k / (p.m * (1 + I))); } },
  { id: 'os-g21', type: 'nat', level: 5, exams: EX[5], sub: 'potential energy curve',
    make(rng) {
      const m = pick(rng, 0.5, 4, 0.5); const v = int(rng, 0, 2);
      if (v === 0) { const U0 = pick(rng, 1, 10); const a = pick(rng, 2, 10); const w = a * Math.sqrt(U0 / m); return { v, m, U0, a, q: r`A particle of mass ${m} kg moves in the potential $U = U_0(1 - \cos ax)$ with $U_0 = ${U0}$ J and $a = ${a}\ \mathrm{m^{-1}}$. Find the angular frequency of small oscillations about $x = 0$ (in $\mathrm{rad\,s^{-1}}$, 2 decimals).`, answer: R(w, 2), tol: 0.02 * 1, unit: 'rad/s', sol: r`For small $x$, $U\approx\tfrac12U_0a^2x^2$, so $k = U_0a^2 = ${U0 * a * a}$ N/m. $\omega = \sqrt{k/m} = \sqrt{${U0 * a * a}/${m}} = ${R(w, 2)}\ \mathrm{rad\,s^{-1}}$.` }; }
      if (v === 1) { const U0 = pick(rng, 1, 10); const r0 = choose(rng, [0.1, 0.2, 0.5]); const w = Math.sqrt(72 * U0 / (m * r0 * r0)); return { v, m, U0, r0, q: r`A particle of mass ${m} kg moves in the potential $U = U_0\left[(r_0/r)^{12} - 2(r_0/r)^6\right]$ with $U_0 = ${U0}$ J and $r_0 = ${r0}$ m. Find the angular frequency of small oscillations about the minimum (in $\mathrm{rad\,s^{-1}}$, 1 decimal).`, answer: R(w, 1), tol: Math.max(0.1, w * 0.002), unit: 'rad/s', sol: r`At $r = r_0$, $U'' = 72U_0/r_0^2 = ${R(72 * U0 / (r0 * r0), 1)}$ N/m. $\omega = \sqrt{U''/m} = ${R(w, 1)}\ \mathrm{rad\,s^{-1}}$.` }; }
      const U0 = pick(rng, 1, 10); const a = pick(rng, 1, 5, 0.5); const w = Math.sqrt(2 * U0 / (m * a * a)); return { v, m, U0, a, q: r`A particle of mass ${m} kg moves in the potential $U = U_0x^2/a^2$ with $U_0 = ${U0}$ J and $a = ${a}$ m, where $x$ is in metres. Find the time period of its oscillation (in s, 3 decimals).`, answer: R(2 * PI / w, 3), tol: Math.max(0.004, 2 * PI / w * 0.002), unit: 's', sol: r`Compare $U = \tfrac12kx^2$: $k = 2U_0/a^2 = ${R(2 * U0 / (a * a), 3)}$ N/m. $T = 2\pi\sqrt{m/k} = ${R(2 * PI / w, 3)}$ s.` };
    },
    verify: (p) => (p.v === 0 ? p.a * Math.sqrt(p.U0 / p.m) : p.v === 1 ? Math.sqrt(72 * p.U0 / (p.m * p.r0 ** 2)) : 2 * PI * Math.sqrt(p.m * p.a ** 2 / (2 * p.U0))) },
  { id: 'os-g22', type: 'nat', level: 2, exams: EX[2], sub: 'SHM equations',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const A = pick(rng, 2, 9); const b = pick(rng, 2, 12); return { v, A, b, q: r`A particle moves as $x = ${A}\cos(${b}\pi t)$ (cm, $t$ in s). Find its time period (in s, 3 decimals).`, answer: R(2 / b, 3), tol: 0.004, unit: 's', sol: r`$\omega = ${b}\pi$ rad/s, so $T = 2\pi/\omega = 2/${b} = ${R(2 / b, 3)}$ s.` }; }
      if (v === 1) { const kk = choose(rng, [4, 9, 16, 25, 36, 49, 64, 100]); return { v, kk, q: r`The acceleration of a particle is $a = -${kk}x$ (SI units). Find its time period (in s, 3 decimals).`, answer: R(2 * PI / Math.sqrt(kk), 3), tol: 0.004, unit: 's', sol: r`$a = -\omega^2x$, so $\omega^2 = ${kk}$ and $\omega = ${Math.sqrt(kk)}$ rad/s. $T = 2\pi/\omega = ${R(2 * PI / Math.sqrt(kk), 3)}$ s.` }; }
      const a = pick(rng, 3, 12); const b = pick(rng, 3, 12); const A = Math.hypot(a, b); return { v, a, b, q: r`A particle's displacement is $x = ${a}\sin\omega t + ${b}\cos\omega t$ (cm). Find the amplitude of its SHM (in cm, 2 decimals).`, answer: R(A, 2), tol: 0.02, unit: 'cm', sol: r`Write it as $A\sin(\omega t + \phi)$ with $A\cos\phi = ${a}$, $A\sin\phi = ${b}$. $A = \sqrt{${a}^2 + ${b}^2} = ${R(A, 2)}$ cm.` };
    },
    verify: (p) => (p.v === 0 ? 2 * PI / (p.b * PI) : p.v === 1 ? 2 * PI / Math.sqrt(p.kk) : Math.sqrt(p.a * p.a + p.b * p.b)) },
];

export default { topic: 'oscillations', groups, items, gens };
