// Waves: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EX = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const PI = Math.PI; const V = 340;
let k = 0; let c = 0;
const nid = () => `wv-${String(++k).padStart(3, '0')}`;
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
  nat(1, 'wave speed', r`A sound source of frequency 500 Hz produces waves of wavelength 0.68 m in air. Find the speed of the waves (in $\mathrm{m\,s^{-1}}$).`, () => 500 * 0.68, 0,
    0, r`$v = f\lambda = 500\times0.68 = 340\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(1, 'types of waves', r`Sound waves in air are`, 'longitudinal', ['transverse', 'transverse and longitudinal both', 'electromagnetic'],
    r`Air cannot sustain a shear, so only compressions and rarefactions along the direction of travel exist: sound in air is longitudinal.`),
  mcq(1, 'speed of sound', r`Sound travels fastest in`, 'steel', ['air', 'water', 'vacuum'],
    r`Speed is $v = \sqrt{\text{elastic modulus}/\text{density}}$. Solids have a much larger modulus: about 5000 m/s in steel, 1500 m/s in water, 340 m/s in air. Sound cannot travel through a vacuum.`),
  nat(1, 'beats', r`Two tuning forks of frequencies 256 Hz and 260 Hz are sounded together. How many beats are heard per second?`, () => 260 - 256, 0,
    0, r`Beat frequency $= |f_1 - f_2| = 4$ beats per second.`, { unit: 'Hz' }),
  mcq(1, 'Doppler effect', r`A source of sound moves towards a stationary listener. The frequency heard is`, 'higher than the source frequency', ['lower than the source frequency', 'the same as the source frequency', 'zero'],
    r`The source follows its own waves, so the wavelength between source and listener is shortened. With the speed of sound unchanged, the frequency rises: $f' = fv/(v - v_s)$.`),
  mcq(1, 'pipes', r`A pipe closed at one end produces`, 'only odd harmonics of its fundamental', ['all harmonics', 'only even harmonics', 'only the fundamental'],
    r`The closed end is a node and the open end an antinode. This allows $L = \lambda/4, 3\lambda/4, 5\lambda/4\ldots$, so the frequencies are $f, 3f, 5f\ldots$.`),
  mcq(1, 'intensity', r`The SI unit of intensity of a wave is`, r`$\mathrm{W\,m^{-2}}$`, [r`$\mathrm{W\,m^{-1}}$`, r`$\mathrm{J\,m^{-1}}$`, r`$\mathrm{W\,m^{2}}$`],
    r`Intensity is power per unit area: watt per square metre.`),
  mcq(1, 'phase and path', r`A path difference of one wavelength between two waves corresponds to a phase difference of`, r`$2\pi$`, [r`$\pi$`, r`$\pi/2$`, r`$4\pi$`],
    r`Phase difference $=\dfrac{2\pi}{\lambda}\times\text{path difference} = \dfrac{2\pi}{\lambda}\times\lambda = 2\pi$.`),
  mcq(1, 'standing waves', r`In a standing wave on a string, a point of zero displacement at all times is called`, 'a node', ['an antinode', 'a crest', 'a compression'],
    r`Nodes are points where the two travelling waves always cancel. Antinodes are points of largest amplitude.`),
  nat(1, 'speed on a string', r`A stretched string has tension 100 N and mass per unit length $0.01\ \mathrm{kg\,m^{-1}}$. Find the speed of a transverse wave on it (in $\mathrm{m\,s^{-1}}$).`, () => Math.sqrt(100 / 0.01), 0,
    0, r`$v = \sqrt{T/\mu} = \sqrt{100/0.01} = \sqrt{10^4} = 100\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(1, 'speed of sound', r`When the temperature of air rises, the speed of sound in it`, 'increases', ['decreases', 'stays the same', 'first increases and then decreases'],
    r`$v = \sqrt{\gamma RT/M}$ rises with the absolute temperature. At room temperature it increases by about 0.6 m/s for each degree.`),
  nat(1, 'standing waves on a string', r`A string fixed at both ends has length 0.5 m, and waves travel on it at $200\ \mathrm{m\,s^{-1}}$. Find the frequency of its fundamental mode (in Hz).`, () => 200 / (2 * 0.5), 0,
    0, r`For the fundamental $\lambda = 2L = 1$ m. $f = v/\lambda = 200/1 = 200$ Hz.`, { unit: 'Hz' }),
  mcq(1, 'types of waves', r`Transverse mechanical waves cannot pass through the body of a gas or a liquid because`, 'gases and liquids cannot support a shear (they have no rigidity)', ['their density is too low', 'the temperature is too high', 'they absorb all waves'],
    r`A transverse wave needs a restoring force against sideways shear. Fluids do not have a shear modulus. Only longitudinal (pressure) waves travel through them.`),
  nat(1, 'loudness', r`A sound of intensity $10^{-6}\ \mathrm{W\,m^{-2}}$ falls on a surface. Find its intensity level in dB ($I_0 = 10^{-12}\ \mathrm{W\,m^{-2}}$).`, () => 10 * Math.log10(1e-6 / 1e-12), 0,
    0, r`$\beta = 10\log_{10}(I/I_0) = 10\log_{10}(10^{6}) = 60$ dB.`, { unit: 'dB' }),
  mcq(1, 'wave equation', r`A wave is described by $y = A\sin(\omega t - kx)$. It travels in`, 'the positive $x$ direction', ['the negative $x$ direction', 'the $y$ direction', 'no fixed direction'],
    r`Points of constant phase satisfy $\omega t - kx = $ constant, so $x = (\omega/k)t + $ constant. The pattern moves to larger $x$ with speed $\omega/k$.`),
  mcq(1, 'sound properties', r`The pitch of a musical note depends mainly on its`, 'frequency', ['amplitude', 'speed in air', 'waveform quality only'],
    r`Pitch is the frequency we perceive. Loudness depends on intensity (amplitude), and quality (timbre) on the mix of harmonics.`),
  mcq(1, 'wave number', r`The angular wave number $k$ of a wave of wavelength $\lambda$ is`, r`$2\pi/\lambda$`, [r`$\lambda/2\pi$`, r`$2\pi\lambda$`, r`$1/\lambda$`],
    r`$k = 2\pi/\lambda$ in rad m$^{-1}$. Do not confuse it with the (spectroscopic) wave number $1/\lambda$.`),
  mcq(1, 'reflection', r`A pulse on a string is reflected from a fixed end. The reflected pulse is`, 'inverted (a phase change of $\\pi$)', ['upright with no phase change', 'turned to half its size', 'absorbed completely'],
    r`The fixed end exerts a downward force on an upward pulse, producing an inverted reflection. At a free end the reflection is upright.`),

  // ---------- Level 2 ----------
  nat(2, 'wave equation', r`A wave on a string is $y = 5\sin(200t - 0.5x)$ (SI units, $y$ in mm). Find the speed of the wave (in $\mathrm{m\,s^{-1}}$).`, () => 200 / 0.5, 0,
    0, r`Compare with $y = A\sin(\omega t - kx)$: $\omega = 200\ \mathrm{rad\,s^{-1}}$, $k = 0.5\ \mathrm{rad\,m^{-1}}$. $v = \omega/k = 400\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(2, 'wave equation', r`A transverse wave has amplitude 2 mm and frequency 100 Hz. Find the maximum speed of a particle of the medium (in $\mathrm{m\,s^{-1}}$, 3 decimals).`, () => 0.002 * 2 * PI * 100, 0.003, 3,
    r`$v_{p,max} = A\omega = 0.002\times2\pi\times100 = 1.257\ \mathrm{m\,s^{-1}}$. This is the speed of particle vibration, not of the wave.`, { unit: 'm/s', trap: 'Particle speed and wave speed are different things.' }),
  nat(2, 'phase difference', r`A wave of wavelength 2 m travels along a string. Find the phase difference (in degrees) between two points 0.5 m apart along the string.`, () => 360 * 0.5 / 2, 0,
    0, r`$\Delta\phi = \dfrac{2\pi}{\lambda}\Delta x = \dfrac{2\pi}{2}\times0.5 = \dfrac\pi2$, which is $90°$.`, { unit: '°' }),
  nat(2, 'speed on a string', r`A string of mass 20 g and length 2 m is stretched with a tension of 40 N. Find the speed of a transverse wave on it (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, () => Math.sqrt(40 / (0.02 / 2)), 0.1, 1,
    r`$\mu = 0.02/2 = 0.01\ \mathrm{kg\,m^{-1}}$. $v = \sqrt{T/\mu} = \sqrt{40/0.01} = \sqrt{4000} = 63.2\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Use mass per unit length, not the total mass.' }),
  mcq(2, 'speed on a string', r`The tension in a stretched string is made four times. The fundamental frequency of the string becomes`, 'twice', ['four times', r`$\sqrt2$ times`, 'half'],
    r`$f = \dfrac1{2L}\sqrt{T/\mu}\propto\sqrt T$. Four times the tension gives $\sqrt4 = 2$ times the frequency.`),
  nat(2, 'speed of sound', r`The speed of sound in air at $0°\mathrm{C}$ is $332\ \mathrm{m\,s^{-1}}$. Find its value at $27°\mathrm{C}$ (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, () => 332 * Math.sqrt(300 / 273), 0.3, 1,
    r`$v\propto\sqrt T$ with $T$ in kelvin: $v_{27} = 332\sqrt{300/273} = 332\times1.0483 = 348.0\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Use kelvin, not °C.' }),
  nat(2, 'speed of sound', r`Air has pressure $1.013\times10^5$ Pa and density $1.29\ \mathrm{kg\,m^{-3}}$ at 0 °C, and $\gamma = 1.4$. Find the speed of sound using Laplace's correction (in $\mathrm{m\,s^{-1}}$, nearest whole number).`, () => Math.sqrt(1.4 * 1.013e5 / 1.29), 1, 0,
    r`Newton's formula gives $\sqrt{P/\rho} = \sqrt{1.013\times10^5/1.29} = 280$ m/s, too low. Laplace: the compressions are adiabatic, so $v = \sqrt{\gamma P/\rho} = \sqrt{1.4}\times280.2 = 331.5\approx332\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'The factor is $\\sqrt\\gamma$.' }),
  nat(2, 'loudness', r`The intensity level at 10 m from a small source is 80 dB. Find the level at 20 m (in dB, 1 decimal; ignore absorption).`, () => 80 - 20 * Math.log10(2), 0.1, 1,
    r`$I\propto1/r^2$: doubling the distance gives $I/4$. $\Delta\beta = 10\log_{10}(1/4) = -6.02$ dB. So $\beta = 80 - 6.0 = 74.0$ dB.`, { unit: 'dB', trap: 'The level does not fall to a quarter, it falls by 6 dB.' }),
  nat(2, 'loudness', r`Two identical sources each produce a level of 60 dB at a point. Find the level when both operate together at that point (in dB, 1 decimal; incoherent sources).`, () => 60 + 10 * Math.log10(2), 0.1, 1,
    r`Intensities add: $I = 2I_1$. $\beta = 60 + 10\log_{10}2 = 63.0$ dB. Levels in dB do not add directly.`, { unit: 'dB' }),
  mcq(2, 'loudness', r`Sound A is 20 dB higher in level than sound B. The ratio of their intensities $I_A/I_B$ is`, '100', ['20', '2', '10'],
    r`$\Delta\beta = 10\log_{10}(I_A/I_B) = 20\Rightarrow I_A/I_B = 10^2 = 100$. Every 10 dB is a factor of 10 in intensity.`),
  mcq(2, 'interference', r`Two coherent sources vibrate in phase. At a point where the path difference is $1.5\lambda$, the interference is`, 'destructive', ['constructive', 'neither, intensity is the sum', 'cannot be said'],
    r`Constructive needs $\Delta = n\lambda$; destructive needs $(n + \tfrac12)\lambda$. $1.5\lambda = (1 + \tfrac12)\lambda$ is destructive.`),
  nat(2, 'interference', r`Two coherent waves have amplitudes in the ratio 3 : 1. Find the ratio $I_{max}/I_{min}$.`, () => ((3 + 1) / (3 - 1)) ** 2, 0,
    0, r`$I\propto A^2$. $\dfrac{I_{max}}{I_{min}} = \dfrac{(A_1 + A_2)^2}{(A_1 - A_2)^2} = \dfrac{4^2}{2^2} = 4$.`, { unit: '', trap: 'Amplitudes add; intensities then follow by squaring.' }),
  nat(2, 'standing waves on a string', r`A string of length 1.2 m, fixed at both ends, vibrates in its third harmonic. Find the wavelength (in m, 1 decimal).`, () => 2 * 1.2 / 3, 0.05, 1,
    r`For the $n$th harmonic $\lambda_n = 2L/n$. With $n = 3$: $\lambda = 2.4/3 = 0.8$ m.`, { unit: 'm' }),
  nat(2, 'open pipe', r`An open organ pipe is 0.5 m long. Take the speed of sound as $340\ \mathrm{m\,s^{-1}}$ and neglect end corrections. Find the fundamental frequency (in Hz).`, () => 340 / (2 * 0.5), 0,
    0, r`Open pipe: $f_1 = v/2L = 340/1.0 = 340$ Hz.`, { unit: 'Hz' }),
  nat(2, 'closed pipe', r`A pipe closed at one end is 0.85 m long. Take the speed of sound as $340\ \mathrm{m\,s^{-1}}$ and neglect end corrections. Find its fundamental frequency (in Hz).`, () => 340 / (4 * 0.85), 0,
    0, r`Closed pipe: $f_1 = v/4L = 340/3.4 = 100$ Hz.`, { unit: 'Hz' }),
  mcq(2, 'closed pipe', r`A closed pipe has a fundamental frequency of 100 Hz. Its second overtone has frequency`, '500 Hz', ['200 Hz', '300 Hz', '400 Hz'],
    r`Only odd harmonics occur: 100 Hz (first harmonic, the fundamental), 300 Hz (first overtone), 500 Hz (second overtone).`, { trap: 'Overtone numbering is one less than harmonic numbering, and only odd harmonics exist.' }),
  nat(2, 'end correction', r`A pipe closed at one end has length 0.30 m and radius 2.5 cm. Using an end correction of $0.6r$ and $v = 340\ \mathrm{m\,s^{-1}}$, find the fundamental frequency (in Hz, 1 decimal).`, () => 340 / (4 * (0.30 + 0.6 * 0.025)), 0.5, 1,
    r`Effective length $= L + 0.6r = 0.30 + 0.015 = 0.315$ m. $f = v/4L_{eff} = 340/1.26 = 269.8$ Hz.`, { unit: 'Hz' }),
  nat(2, 'resonance tube', r`In a resonance-tube experiment, the first and second resonances with a fork are at 16.0 cm and 50.0 cm. Taking $v = 340\ \mathrm{m\,s^{-1}}$, find the frequency of the fork (in Hz).`, () => 340 / (2 * 0.34), 0,
    0, r`The distance between successive resonances is $\lambda/2$: $\lambda/2 = 50 - 16 = 34$ cm, so $\lambda = 0.68$ m. $f = v/\lambda = 340/0.68 = 500$ Hz.`, { unit: 'Hz' }),
  nat(2, 'resonance tube', r`In a resonance-tube experiment, the first and second resonances are at 15.0 cm and 48.0 cm. Find the end correction (in cm, 1 decimal).`, () => (48 - 3 * 15) / 2, 0.05, 1,
    r`$l_1 + e = \lambda/4$ and $l_2 + e = 3\lambda/4$. Subtracting, $\lambda/2 = l_2 - l_1$; then $l_2 + e = 3(l_1 + e)$, so $e = (l_2 - 3l_1)/2 = (48 - 45)/2 = 1.5$ cm.`, { unit: 'cm' }),
  nat(2, 'beats', r`A tuning fork of unknown frequency gives 4 beats per second with a 256 Hz fork. Loading the unknown fork with wax (which lowers its frequency) reduces the beats to 2 per second. Find its frequency (in Hz).`, () => 260, 0,
    0, r`Unknown frequency is $256\pm4$: 252 or 260 Hz. Wax lowers it. If it were 252 Hz, going lower would increase the beats. Beats fall, so it was 260 Hz (and became 258 Hz after loading).`, { unit: 'Hz', trap: 'Wax lowers the frequency; check which way the beats move.' }),
  nat(2, 'Doppler effect', r`A source of frequency 500 Hz moves at $20\ \mathrm{m\,s^{-1}}$ towards a stationary listener. Take $v = 340\ \mathrm{m\,s^{-1}}$. Find the frequency heard (in Hz, 2 decimals).`, () => 500 * 340 / (340 - 20), 0.02, 2,
    r`$f' = f\dfrac{v}{v - v_s} = 500\times\dfrac{340}{320} = 531.25$ Hz.`, { unit: 'Hz' }),
  nat(2, 'Doppler effect', r`A listener moves at $34\ \mathrm{m\,s^{-1}}$ towards a stationary source of frequency 500 Hz. Take $v = 340\ \mathrm{m\,s^{-1}}$. Find the frequency heard (in Hz).`, () => 500 * (340 + 34) / 340, 0,
    0, r`$f' = f\dfrac{v + v_o}{v} = 500\times\dfrac{374}{340} = 550$ Hz.`, { unit: 'Hz' }),
  nat(2, 'speed in solids', r`The speed of longitudinal waves in a steel rod is $v = \sqrt{Y/\rho}$. For $Y = 2.0\times10^{11}\ \mathrm{N\,m^{-2}}$ and $\rho = 8000\ \mathrm{kg\,m^{-3}}$, find $v$ (in $\mathrm{m\,s^{-1}}$).`, () => Math.sqrt(2e11 / 8000), 0,
    0, r`$v = \sqrt{2\times10^{11}/8000} = \sqrt{2.5\times10^{7}} = 5000\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  mcq(2, 'reflection', r`A pulse travelling on a string reaches a free end (a light ring that slides on a vertical rod). The reflected pulse`, 'returns without any inversion', ['returns inverted', 'is completely absorbed', 'is transmitted with the same sign beyond the end'],
    r`At a free end the string can move freely, so there is no force to invert the displacement: the reflected pulse has the same sign. At a fixed end the pulse is inverted (phase change $\pi$).`),
  mcq(2, 'wave equation', r`For the wave $y = A\sin(kx - \omega t)$, the maximum speed of a particle of the medium equals the wave speed if the amplitude is`, r`$1/k$`, [r`$\lambda$`, r`$1/\omega$`, r`$\lambda/2\pi\omega$`],
    r`Particle speed $A\omega$ and wave speed $\omega/k$ are equal when $A = 1/k = \lambda/2\pi$. This only happens for very large amplitudes, which are far from ordinary sound or string waves.`),
  mcq(2, 'sound properties', r`A note from a flute and the same note from a violin have the same pitch and loudness but sound different. The quality (timbre) differs because of`, 'the different mixture of harmonics present', ['different speeds in air', 'different fundamental frequencies', 'different intensities'],
    r`Same pitch means the same fundamental. Different instruments emphasise different overtones, giving different waveforms and so different timbre.`),
  nat(2, 'standing waves in air', r`Standing sound waves of frequency 850 Hz form in air ($v = 340\ \mathrm{m\,s^{-1}}$). Find the distance between two successive nodes (in cm).`, () => 340 / 850 / 2 * 100, 0,
    0, r`$\lambda = v/f = 0.4$ m. Adjacent nodes are $\lambda/2 = 0.2$ m $= 20$ cm apart.`, { unit: 'cm' }),
];

items.push(
  // ---------- Level 3 ----------
  nat(3, 'wave equation', r`A wave on a string is $y = 0.1\sin(20t - 2x)$ (SI units, angles in radians). Find the transverse speed of the particle at $x = 0.5$ m at $t = 0.1$ s (in $\mathrm{m\,s^{-1}}$, 3 decimals).`, () => 0.1 * 20 * Math.cos(20 * 0.1 - 2 * 0.5), 0.004, 3,
    r`Particle velocity $= \partial y/\partial t = 0.1\times20\cos(20t - 2x) = 2\cos(2 - 1) = 2\cos(1\ \mathrm{rad}) = 2\times0.5403 = 1.081\ \mathrm{m\,s^{-1}}$. Use radians. This is not the wave speed ($20/2 = 10\ \mathrm{m\,s^{-1}}$).`, { unit: 'm/s', trap: 'Differentiate with respect to time at fixed $x$; do not use $\\omega/k$.' }),
  nat(3, 'speed on a string', r`A string of mass per unit length $0.01\ \mathrm{kg\,m^{-1}}$ passes over a smooth pulley and supports a 5 kg block. Find the speed of transverse waves on the horizontal part of the string (in $\mathrm{m\,s^{-1}}$; $g = 9.8$).`, () => Math.sqrt(5 * 9.8 / 0.01), 0,
    0, r`$T = mg = 5\times9.8 = 49$ N. $v = \sqrt{T/\mu} = \sqrt{49/0.01} = \sqrt{4900} = 70\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'sonometer', r`A sonometer wire of length 50 cm is in unison with a 256 Hz fork. What length (in cm, 1 decimal) must vibrate to be in unison with a 288 Hz fork at the same tension?`, () => 50 * 256 / 288, 0.1, 1,
    r`$f\propto1/L$ for a fixed tension and wire. $L' = L\times\dfrac{f}{f'} = 50\times\dfrac{256}{288} = 44.4$ cm.`, { unit: 'cm' }),
  nat(3, 'standing waves on a string', r`A string fixed at both ends resonates at 150 Hz and at 200 Hz, with no resonance between them. Find the fundamental frequency (in Hz).`, () => 200 - 150, 0,
    0, r`Resonances are $nf_1$. Consecutive harmonics differ by $f_1$: $200 - 150 = 50$ Hz. They are the 3rd and 4th harmonics.`, { unit: 'Hz' }),
  nat(3, 'closed pipe', r`A pipe closed at one end resonates at 300 Hz and at 500 Hz, with no resonance between them. Take $v = 340\ \mathrm{m\,s^{-1}}$ and neglect end correction. Find the length of the pipe (in m, 2 decimals).`, () => 340 / (4 * 100), 0.01, 2,
    r`Resonances of a closed pipe are odd multiples of $f_1$; consecutive ones differ by $2f_1$: $2f_1 = 200$, $f_1 = 100$ Hz. $L = v/4f_1 = 340/400 = 0.85$ m.`, { unit: 'm', trap: 'The difference between consecutive resonances is $2f_1$, not $f_1$.' }),
  mcq(3, 'pipes', r`An open organ pipe of length $L$ is dipped vertically into water until exactly half of its length is below the surface. Its fundamental frequency is now`, 'the same as before', ['double', 'half', r`$\sqrt2$ times as large`],
    r`Originally open at both ends: $f = v/2L$. Now it is closed at the bottom with an air column of length $L/2$: $f' = v/(4\cdot L/2) = v/2L$, unchanged.`, { trap: 'Half the length, but a closed pipe has a wavelength of 4 times its length.' }),
  nat(3, 'pipes', r`An open pipe of length 1.0 m resonates at its harmonics $f_n = nv/2L$. Taking $v = 340\ \mathrm{m\,s^{-1}}$, how many harmonics lie in the audible range up to 20 kHz?`, () => Math.floor(20000 / 170), 0,
    0, r`$f_n = 170n$ Hz. $170n\le20\,000\Rightarrow n\le117.6$, so $n = 1$ to $117$: 117 harmonics.`, { unit: '' }),
  nat(3, 'speed of sound', r`An organ pipe sounds at 500 Hz when the air is at 20 °C (293 K). Find its frequency when the air warms to 40 °C (313 K), ignoring any expansion of the pipe (in Hz, 1 decimal).`, () => 500 * Math.sqrt(313 / 293), 0.5, 1,
    r`$f = v/2L\propto v\propto\sqrt T$. $f' = 500\sqrt{313/293} = 500\times1.0336 = 516.8$ Hz.`, { unit: 'Hz' }),
  nat(3, 'intensity and loudness', r`A small source radiates 1 W of sound power uniformly in all directions. Find the intensity level at 10 m (in dB, 1 decimal; $I_0 = 10^{-12}\ \mathrm{W\,m^{-2}}$).`, () => 10 * Math.log10(1 / (4 * PI * 100) / 1e-12), 0.1, 1,
    r`$I = \dfrac{P}{4\pi r^2} = \dfrac{1}{4\pi\times100} = 7.96\times10^{-4}\ \mathrm{W\,m^{-2}}$. $\beta = 10\log_{10}(7.96\times10^{-4}/10^{-12}) = 10\times8.90 = 89.0$ dB.`, { unit: 'dB' }),
  nat(3, 'intensity and loudness', r`A small source radiates 1 W of sound uniformly. At what distance would the sound just fall to the threshold of hearing, $I_0 = 10^{-12}\ \mathrm{W\,m^{-2}}$? (Ignore absorption; answer in km, nearest whole number.)`, () => Math.sqrt(1 / (4 * PI * 1e-12)) / 1000, 1, 0,
    r`$I = P/4\pi r^2 = I_0\Rightarrow r = \sqrt{P/4\pi I_0} = \sqrt{1/(1.2566\times10^{-11})} = 2.82\times10^5$ m $= 282$ km. (In real air, absorption makes it far shorter.)`, { unit: 'km' }),
  nat(3, 'interference', r`Two coherent sources give intensities in the ratio 16 : 1 at a point. Find the ratio $I_{max}/I_{min}$ for their interference pattern (2 decimals).`, () => ((4 + 1) / (4 - 1)) ** 2, 0.02, 2,
    r`$A_1/A_2 = \sqrt{16/1} = 4$. $\dfrac{I_{max}}{I_{min}} = \left(\dfrac{4 + 1}{4 - 1}\right)^2 = \dfrac{25}{9} = 2.78$.`, { unit: '', trap: 'Take the square root of the intensity ratio before adding.' }),
  nat(3, 'interference', r`Two coherent, in-phase point sources are $2.5\lambda$ apart. How many points of maximum intensity lie on the straight segment between them (excluding the sources themselves)?`, () => 5, 0,
    0, r`For a point at distance $x$ from the first source, the path difference is $|d - 2x|$, which goes from $-d$ to $+d$ across the segment. Maxima need $|\Delta| = n\lambda$ with $n = 0, \pm1, \pm2$ ($\pm3\lambda$ would exceed $d = 2.5\lambda$): 5 points.`, { unit: '', trap: 'The path difference changes by $2\\,dx$ as you move along the line.' }),
  nat(3, 'interference', r`Each of two coherent sources alone produces intensity $I_0$ at a point. At that point the waves differ in phase by $120°$. Find the resultant intensity in units of $I_0$.`, () => 4 * Math.cos(PI / 3) ** 2, 0.01, 2,
    r`$I = 4I_0\cos^2(\phi/2) = 4I_0\cos^2(60°) = 4I_0\times\tfrac14 = I_0$. Two equal vectors $120°$ apart add to a vector of the same length.`, { unit: '' }),
  nat(3, 'Doppler effect', r`A source of frequency 400 Hz moves towards a listener at $20\ \mathrm{m\,s^{-1}}$ while the listener moves towards the source at $10\ \mathrm{m\,s^{-1}}$. Take $v = 340\ \mathrm{m\,s^{-1}}$. Find the frequency heard (in Hz, 1 decimal).`, () => 400 * 350 / 320, 0.1, 1,
    r`$f' = f\dfrac{v + v_o}{v - v_s} = 400\times\dfrac{350}{320} = 437.5$ Hz.`, { unit: 'Hz' }),
  nat(3, 'Doppler effect', r`A listener moves away from a stationary source of frequency 500 Hz at $34\ \mathrm{m\,s^{-1}}$. Take $v = 340\ \mathrm{m\,s^{-1}}$. Find the frequency heard (in Hz).`, () => 500 * (340 - 34) / 340, 0,
    0, r`$f' = f\dfrac{v - v_o}{v} = 500\times\dfrac{306}{340} = 450$ Hz.`, { unit: 'Hz' }),
  nat(3, 'Doppler effect and wind', r`A source of 400 Hz moves at $20\ \mathrm{m\,s^{-1}}$ towards a stationary listener. A wind blows at $10\ \mathrm{m\,s^{-1}}$ from the source to the listener. Take $v = 340\ \mathrm{m\,s^{-1}}$ in still air. Find the frequency heard (in Hz, 1 decimal).`, () => 400 * 350 / (350 - 20), 0.1, 1,
    r`With the wind the speed of sound relative to the ground is $v + w = 350\ \mathrm{m\,s^{-1}}$ in the direction source to listener. $f' = f\dfrac{v + w}{v + w - v_s} = 400\times\dfrac{350}{330} = 424.2$ Hz. (If the listener moved too, the speed of the medium relative to the listener would also change.)`, { unit: 'Hz', trap: 'Add the wind speed to the speed of sound, not to the source speed.' }),
  mcq(3, 'Doppler effect and wind', r`A source and a listener are both at rest. A steady wind blows from the source towards the listener. The frequency heard is`, 'equal to the source frequency', ['greater than the source frequency', 'less than the source frequency', 'zero'],
    r`The wind carries the waves along. The speed relative to the listener changes, but so does the wavelength by the same factor. The number of waves passing the listener per second is unchanged: $f' = f$.`, { trap: 'Wind shifts both speed and wavelength; frequency is set by the source.' }),
  nat(3, 'Doppler effect', r`A source of frequency 500 Hz at rest sends sound towards a wall moving towards the source at $10\ \mathrm{m\,s^{-1}}$. Take $v = 340\ \mathrm{m\,s^{-1}}$. Find the frequency of the echo heard back at the source (in Hz, 1 decimal).`, () => 500 * 350 / 330, 0.1, 1,
    r`The wall (observer moving towards the source) receives $f_1 = f(v + u)/v$. It re-emits it as a moving source: $f_2 = f_1\dfrac{v}{v - u} = f\dfrac{v + u}{v - u} = 500\times\dfrac{350}{330} = 530.3$ Hz.`, { unit: 'Hz', trap: 'Two Doppler shifts: the wall is first an observer and then a source.' }),
  nat(3, 'Doppler effect', r`A train sounding a 400 Hz horn passes a platform at $34\ \mathrm{m\,s^{-1}}$ ($v = 340\ \mathrm{m\,s^{-1}}$). Find the drop in frequency heard by a person on the platform as the train goes from approaching to receding (in Hz, 1 decimal).`, () => 400 * 340 / 306 - 400 * 340 / 374, 0.1, 1,
    r`Approaching: $400\times340/306 = 444.4$ Hz. Receding: $400\times340/374 = 363.6$ Hz. Drop $= 80.8$ Hz.`, { unit: 'Hz' }),
  nat(3, 'shock waves', r`A jet flies at $1020\ \mathrm{m\,s^{-1}}$ where the speed of sound is $340\ \mathrm{m\,s^{-1}}$. Find the half-angle of the Mach cone (in degrees, 1 decimal).`, () => Math.asin(340 / 1020) * 180 / PI, 0.1, 1,
    r`Mach number $M = 1020/340 = 3$. $\sin\theta = v/v_s = 1/3$, so $\theta = 19.5°$.`, { unit: '°' }),
  nat(3, 'standing waves', r`A standing wave on a string is $y = 0.04\sin(5x)\cos(100t)$ (SI units). Find the speed of the travelling waves that form it (in $\mathrm{m\,s^{-1}}$).`, () => 100 / 5, 0,
    0, r`$y = 2A\sin kx\cos\omega t$ with $k = 5\ \mathrm{rad\,m^{-1}}$ and $\omega = 100\ \mathrm{rad\,s^{-1}}$. Each travelling wave has $v = \omega/k = 20\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'standing waves', r`Two travelling waves of amplitude 3 mm each form a standing wave on a string. Find the amplitude of the vibration at a point $\lambda/12$ from a node (in mm).`, () => 2 * 3 * Math.sin(2 * PI / 12), 0.01, 1,
    r`Amplitude at distance $x$ from a node $= 2A\sin(2\pi x/\lambda) = 6\sin(2\pi/12) = 6\sin30° = 3$ mm. (An antinode would be 6 mm.)`, { unit: 'mm' }),
  nat(3, 'speed of sound in gases', r`Find the speed of sound in oxygen (molar mass 0.032 kg/mol, $\gamma = 1.4$) at 300 K (in $\mathrm{m\,s^{-1}}$, nearest whole number; $R = 8.314$).`, () => Math.sqrt(1.4 * 8.314 * 300 / 0.032), 1, 0,
    r`$v = \sqrt{\gamma RT/M} = \sqrt{1.4\times8.314\times300/0.032} = \sqrt{1.0911\times10^5} = 330\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Molar mass must be in kg/mol.' }),
  nat(3, 'resonance tube', r`A tuning fork of frequency 1700 Hz is held over a tall tube with water that slowly drains from the top of a 1.0 m tube to the bottom. How many resonances are heard (take $v = 340\ \mathrm{m\,s^{-1}}$, neglect end correction)?`, () => 10, 0,
    0, r`$\lambda = 340/1700 = 0.2$ m. Resonances at air-column lengths $l = (2n - 1)\lambda/4 = 0.05(2n - 1)$ m. The condition $l\le1.0$ m gives $2n - 1\le20$, so $n = 1$ to $10$: 10 resonances.`, { unit: '' }),
  nat(3, 'pipes', r`An open pipe 50 cm long gives a certain fundamental. How long (in cm) should a closed pipe be to have the same fundamental frequency?`, () => 25, 0,
    0, r`Open: $f = v/2L_o$. Closed: $f = v/4L_c$. Equal when $L_c = L_o/2 = 25$ cm.`, { unit: 'cm' }),
  nat(3, 'strings', r`A violin string has a fundamental of 300 Hz when 0.60 m of it vibrates. A finger is pressed so that only 0.40 m vibrates (same tension). Find the new fundamental (in Hz).`, () => 300 * 0.6 / 0.4, 0,
    0, r`$f\propto1/L$ at fixed tension: $f' = 300\times0.60/0.40 = 450$ Hz.`, { unit: 'Hz' }),
  nat(3, 'strings', r`The tension in a stretched string is increased by 21 %. Find the percentage increase in its fundamental frequency.`, () => (Math.sqrt(1.21) - 1) * 100, 0,
    0, r`$f\propto\sqrt T$. $\sqrt{1.21} = 1.1$: an increase of 10 %.`, { unit: '%' }),
  nat(3, 'wave basics', r`A transverse wave on a rope has frequency 40 Hz. The distance between a crest and the next trough is 2.5 m. Find the speed of the wave (in $\mathrm{m\,s^{-1}}$).`, () => 40 * 2 * 2.5, 0,
    0, r`A crest and the next trough are half a wavelength apart: $\lambda/2 = 2.5$, so $\lambda = 5$ m. $v = f\lambda = 40\times5 = 200\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Crest to trough is $\\lambda/2$, not $\\lambda$.' }),
  nat(3, 'intensity and loudness', r`One machine in a workshop gives 60 dB at a listener. How loud (in dB) is it when 100 identical, independent machines run together?`, () => 60 + 10 * Math.log10(100), 0,
    0, r`Intensity is 100 times larger. $\Delta\beta = 10\log_{10}100 = 20$ dB. So $60 + 20 = 80$ dB.`, { unit: 'dB' }),
  mcq(3, 'refraction of waves', r`A wave of frequency 100 Hz travels along a light string and enters a heavier string joined to it (same tension). Which quantity is the same in both strings?`, 'frequency', ['wavelength', 'wave speed', 'amplitude'],
    r`The source drives the joint at 100 Hz, so the frequency does not change. The speed $\sqrt{T/\mu}$ is lower in the heavier string, so the wavelength $v/f$ is shorter. The amplitude splits between reflected and transmitted waves.`),
  mcq(3, 'beats', r`Two waves $y_1 = A\cos(2\pi\cdot100t)$ and $y_2 = A\cos(2\pi\cdot104t)$ are superposed at a point. The loudness rises and falls with a frequency of`, '4 Hz', ['2 Hz', '8 Hz', '102 Hz'],
    r`$y = 2A\cos(2\pi\cdot2t)\cos(2\pi\cdot102t)$. The amplitude $|2A\cos(4\pi t)|$ reaches a maximum twice in each cycle of the cosine, so the intensity peaks $2\times2 = 4$ times per second: beat frequency $= |f_1 - f_2| = 4$ Hz.`, { trap: 'The envelope frequency is $\\Delta f/2$, but loudness peaks twice per envelope cycle.' }),
  nat(3, 'intensity of sound', r`The pressure amplitude of a plane sound wave in air is 2 Pa. With $\rho = 1.29\ \mathrm{kg\,m^{-3}}$ and $v = 340\ \mathrm{m\,s^{-1}}$, find the intensity $I = p_0^2/2\rho v$ (in $\mathrm{mW\,m^{-2}}$, 2 decimals).`, () => 4 / (2 * 1.29 * 340) * 1000, 0.02, 2,
    r`$I = \dfrac{p_0^2}{2\rho v} = \dfrac{4}{2\times1.29\times340} = 4.56\times10^{-3}\ \mathrm{W\,m^{-2}} = 4.56\ \mathrm{mW\,m^{-2}}$.`, { unit: 'mW/m²' }),
);

items.push(
  nat(3, 'speed in liquids', r`The bulk modulus of water is $2.2\times10^9$ Pa and its density is $1000\ \mathrm{kg\,m^{-3}}$. Find the speed of sound in water (in $\mathrm{m\,s^{-1}}$, nearest whole number).`, () => Math.sqrt(2.2e9 / 1000), 1, 0,
    r`$v = \sqrt{B/\rho} = \sqrt{2.2\times10^9/1000} = \sqrt{2.2\times10^6} = 1483\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', sub: 'speed of sound' }),
  nat(3, 'speed on a string', r`A steel wire of density $8000\ \mathrm{kg\,m^{-3}}$ is stretched so that the tensile stress in it is $2.0\times10^8\ \mathrm{N\,m^{-2}}$. Find the speed of transverse waves on it (in $\mathrm{m\,s^{-1}}$, nearest whole number).`, () => Math.sqrt(2e8 / 8000), 1, 0,
    r`$T = \sigma A$ and $\mu = \rho A$, so $v = \sqrt{T/\mu} = \sqrt{\sigma/\rho} = \sqrt{2\times10^8/8000} = \sqrt{25\,000} = 158\ \mathrm{m\,s^{-1}}$. The area cancels.`, { unit: 'm/s', sub: 'speed on a string' }),
  mcq(3, 'speed on a string', r`Two wires of the same material and length are stretched by the same tension. The second wire has twice the radius of the first. The ratio of their fundamental frequencies $f_2/f_1$ is`, r`$1/2$`, [r`$1/4$`, r`$2$`, r`$1/\sqrt2$`],
    r`$\mu = \rho\pi r^2$, so doubling $r$ makes $\mu$ four times. $f\propto1/\sqrt\mu$, so $f_2/f_1 = 1/\sqrt4 = 1/2$.`),
  nat(3, 'Doppler effect', r`A car horn of frequency 1000 Hz is sounded by a car moving at $17\ \mathrm{m\,s^{-1}}$ towards a large wall. Find the frequency of the echo heard by the driver (in Hz, nearest whole number; $v = 340\ \mathrm{m\,s^{-1}}$).`, () => 1000 * (340 + 17) / (340 - 17), 1, 0,
    r`The wall receives $f_1 = f\dfrac{v}{v - v_s}$ and reflects it as a stationary source. The driver is an observer moving towards the wall: $f_2 = f_1\dfrac{v + v_s}{v} = f\dfrac{v + v_s}{v - v_s} = 1000\times\dfrac{357}{323} = 1105$ Hz.`, { unit: 'Hz', sub: 'Doppler effect' }),
  nat(3, 'end correction', r`An open organ pipe of length 0.40 m and radius 1.25 cm has an end correction of $0.6r$ at each end. Find its fundamental frequency (in Hz, nearest whole number; $v = 340\ \mathrm{m\,s^{-1}}$).`, () => 340 / (2 * (0.40 + 2 * 0.6 * 0.0125)), 1, 0,
    r`Effective length $L + 2\times0.6r = 0.40 + 0.015 = 0.415$ m. $f = v/2L_{eff} = 340/0.83 = 410$ Hz.`, { unit: 'Hz', trap: 'An open pipe has an end correction at both ends.' }),
  mcq(3, 'standing waves in pipes', r`An air column vibrates in the fundamental mode in a pipe open at both ends. At the middle of the pipe`, 'displacement is a node and pressure variation is an antinode', ['displacement is an antinode and pressure variation is a node', 'both displacement and pressure are nodes', 'both are antinodes'],
    r`At an open end the air is free to move (displacement antinode) and the pressure stays at atmospheric (pressure node). The middle of the fundamental is the opposite of the ends: displacement node, pressure antinode. Displacement and pressure standing waves are shifted by $\lambda/4$.`, { trap: 'Displacement and pressure nodes are in opposite places.' }),

  // ---------- Level 4 ----------
  nat(4, 'pipes', r`A pipe 1.0 m long is closed at one end. Taking $v = 340\ \mathrm{m\,s^{-1}}$, how many of its harmonics lie in the audible range up to 20 kHz (neglect end correction)?`, () => Math.floor((20000 / 85 + 1) / 2), 0,
    0, r`$f = 85(2n - 1)$ Hz. $85(2n - 1)\le20\,000\Rightarrow2n - 1\le235.3$, so the odd numbers $1, 3, \ldots, 235$: $n = 1$ to $118$. There are 118 harmonics.`, { unit: '' }),
  nat(4, 'strings', r`Two wire segments are joined and stretched with a tension of 100 N. The first is 1.0 m long with mass per unit length $0.01\ \mathrm{kg\,m^{-1}}$; the second is 1.0 m long with $0.04\ \mathrm{kg\,m^{-1}}$. A pulse is sent along from one end to the other. Find the time it takes (in ms).`, () => (1 / Math.sqrt(100 / 0.01) + 1 / Math.sqrt(100 / 0.04)) * 1000, 0,
    0, r`$v_1 = \sqrt{100/0.01} = 100\ \mathrm{m\,s^{-1}}$ and $v_2 = \sqrt{100/0.04} = 50\ \mathrm{m\,s^{-1}}$. $t = 1/100 + 1/50 = 0.03$ s $= 30$ ms.`, { unit: 'ms' }),
  nat(4, 'refraction of waves', r`A wave of wavelength 0.8 m on a string passes into a second string, joined to it, whose mass per unit length is four times as large (same tension). Find the wavelength in the second string (in m, 1 decimal).`, () => 0.8 * Math.sqrt(1 / 4), 0.05, 1,
    r`The frequency is unchanged and $v\propto1/\sqrt\mu$: $v_2 = v_1/2$. $\lambda_2 = v_2/f = \lambda_1/2 = 0.4$ m.`, { unit: 'm' }),
  nat(4, 'resonance tube', r`A fork of frequency 400 Hz gives its first resonance at 20.0 cm and its second at 63.0 cm in a resonance tube. Find the speed of sound from these readings (in $\mathrm{m\,s^{-1}}$).`, () => 2 * 400 * (0.63 - 0.20), 0,
    0, r`$\lambda/2 = l_2 - l_1 = 0.43$ m, so $\lambda = 0.86$ m. $v = f\lambda = 400\times0.86 = 344\ \mathrm{m\,s^{-1}}$. (The end correction, $e = (l_2 - 3l_1)/2 = 1.5$ cm, cancels in the difference.)`, { unit: 'm/s', trap: 'Using $4l_1 = \\lambda$ gives a wrong $v$ because of the end correction.' }),
  nat(4, 'Doppler effect and beats', r`A source of frequency 680 Hz moves at $10\ \mathrm{m\,s^{-1}}$ directly away from a stationary listener and towards a large flat wall. The listener hears the sound directly and as an echo from the wall. Find the beat frequency heard (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, () => 680 * 340 / (340 - 10) - 680 * 340 / (340 + 10), 0.1, 1,
    r`Direct (source receding): $f_1 = 680\times340/350 = 660.6$ Hz. Echo (source approaching the wall, which acts as a stationary reflector): $f_2 = 680\times340/330 = 700.6$ Hz. Beats $= 40.0$ per second.`, { unit: 'Hz' }),
  nat(4, 'Doppler effect and beats', r`A listener walks at $5\ \mathrm{m\,s^{-1}}$ towards a large wall. A stationary source of frequency 680 Hz is behind the listener, so the listener hears the sound directly and as an echo. Find the beat frequency (in Hz; $v = 340\ \mathrm{m\,s^{-1}}$).`, () => 680 * (340 + 5) / 340 - 680 * (340 - 5) / 340, 0,
    0, r`Direct sound from behind: the listener moves away from the source, $f_1 = 680\times\dfrac{335}{340} = 670$ Hz. Echo coming from the wall in front: $f_2 = 680\times\dfrac{345}{340} = 690$ Hz. Beats $= 20$ per second.`, { unit: 'Hz' }),
  nat(4, 'Doppler effect', r`A source of frequency 1000 Hz moves in a circle at $34\ \mathrm{m\,s^{-1}}$. A distant listener in the plane of the circle hears the highest and lowest frequencies. Find the ratio $f_{max}/f_{min}$ (2 decimals; $v = 340\ \mathrm{m\,s^{-1}}$).`, () => (340 + 34) / (340 - 34), 0.01, 2,
    r`$f_{max} = fv/(v - u)$ (source moving straight towards the listener) and $f_{min} = fv/(v + u)$. Ratio $=(v + u)/(v - u) = 374/306 = 1.22$.`, { unit: '', trap: 'The ratio does not depend on $f$.' }),
  nat(4, 'Doppler effect', r`A source of frequency 400 Hz moves at $34\ \mathrm{m\,s^{-1}}$ at an angle of $60°$ to the line joining it to a stationary listener, and is approaching. Find the frequency heard (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, () => 400 * 340 / (340 - 34 * Math.cos(PI / 3)), 0.1, 1,
    r`Only the component of velocity along the line of sight matters: $34\cos60° = 17\ \mathrm{m\,s^{-1}}$. $f' = 400\times\dfrac{340}{340 - 17} = 421.0$ Hz.`, { unit: 'Hz', trap: 'The component along the line of sight, not the full speed.' }),
  nat(4, 'standing waves on strings', r`A string is made of two parts joined together: 0.5 m of mass per unit length $0.01\ \mathrm{kg\,m^{-1}}$ and 0.5 m of $0.04\ \mathrm{kg\,m^{-1}}$. The whole 1.0 m is fixed at both ends under a tension of 100 N, and vibrates with a node at the joint. Find the lowest frequency (in Hz).`, () => 100, 0,
    0, r`$v_1 = 100\ \mathrm{m\,s^{-1}}$ and $v_2 = 50\ \mathrm{m\,s^{-1}}$. Each part is fixed at both ends (with a node at the joint), so $f = n_1v_1/2L_1 = 100n_1$ and $f = n_2v_2/2L_2 = 50n_2$. The lowest common value is 100 Hz (with $n_1 = 1$, $n_2 = 2$).`, { unit: 'Hz' }),
  nat(4, 'speed of sound in gases', r`Find the ratio of the speed of sound in helium ($\gamma = 5/3$, $M = 4$ g/mol) to that in air ($\gamma = 1.4$, $M = 29$ g/mol) at the same temperature (2 decimals).`, () => Math.sqrt((5 / 3) * 29 / (1.4 * 4)), 0.02, 2,
    r`$v = \sqrt{\gamma RT/M}$, so $\dfrac{v_{He}}{v_{air}} = \sqrt{\dfrac{\gamma_{He}M_{air}}{\gamma_{air}M_{He}}} = \sqrt{\dfrac{(5/3)\times29}{1.4\times4}} = \sqrt{8.63} = 2.94$.`, { unit: '', sub: 'mixed' }),
  nat(4, 'energy of waves', r`A string of mass per unit length 0.02 kg/m carries a sine wave of amplitude 2 mm and frequency 50 Hz at a speed of $25\ \mathrm{m\,s^{-1}}$. Find the average power transmitted, $P = \tfrac12\mu\omega^2A^2v$ (in mW, 1 decimal).`, () => 0.5 * 0.02 * (2 * PI * 50) ** 2 * 0.002 ** 2 * 25 * 1000, 0.2, 1,
    r`$\omega = 2\pi\times50 = 314.2$ rad/s. $P = \tfrac12\times0.02\times314.2^2\times(0.002)^2\times25 = 0.0987$ W $= 98.7$ mW.`, { unit: 'mW' }),
  nat(4, 'shock waves', r`A supersonic jet flies horizontally at 3000 m height at twice the speed of sound. A listener on the ground hears the sonic boom after the jet has passed directly overhead. How long after it passes overhead is the boom heard (in s, 1 decimal)?`, () => 3000 / Math.tan(Math.asin(0.5)) / 680, 0.1, 1,
    r`The Mach angle is $\sin\theta = v/v_s = 1/2$, $\theta = 30°$. The cone's edge reaches the ground when the jet has moved a horizontal distance $x = h/\tan\theta = 3000/0.577 = 5196$ m beyond the listener. Time $= x/v_s = 5196/680 = 7.6$ s (with $v = 340\ \mathrm{m\,s^{-1}}$).`, { unit: 's', trap: 'The boom is not heard when the plane is overhead.' }),
  mcq(4, 'shock waves', r`A shock wave (Mach cone) is produced when`, 'a source moves faster than the speed of sound in the medium', ['a source of high frequency is used', 'sound is reflected from a wall', 'two sources of nearly equal frequency are used'],
    r`When $v_s > v$ the source outruns its own wavefronts; they pile up along a cone of half-angle $\sin\theta = v/v_s$. Frequency, reflection and beats are not involved.`),
  nat(4, 'strings', r`A thin rod of length 1.0 m is clamped at its centre and set into longitudinal vibration, with the free ends as antinodes. The speed of sound in the rod is $5000\ \mathrm{m\,s^{-1}}$. Find the fundamental frequency (in Hz).`, () => 5000 / 1.0, 0,
    0, r`The clamped centre is a node and each free end an antinode: the rod's length contains half a wavelength, $L = \lambda/2$. $\lambda = 2$ m and $f = v/\lambda = 5000/2 = 2500$ Hz.`, { unit: 'Hz', trap: 'The rod is half a wavelength long, not a full wavelength.' }),
  mcq(4, 'dimensional analysis', r`The speed $v$ of deep-water waves depends only on gravity $g$ and the wavelength $\lambda$. Dimensional analysis gives $v\propto$`, r`$\sqrt{g\lambda}$`, [r`$\sqrt{g/\lambda}$`, r`$g\lambda$`, r`$\sqrt{\lambda/g}$`],
    r`$v = kg^a\lambda^b$: $\mathrm{L\,T^{-1}} = (\mathrm{L\,T^{-2}})^a\mathrm{L}^b$. Time: $-2a = -1$, $a = \tfrac12$. Length: $a + b = 1$, $b = \tfrac12$. So $v\propto\sqrt{g\lambda}$.`, { sub: 'mixed' }),
  mcq(4, 'standing waves on strings', r`A string of length $L$ fixed at both ends is plucked at a point $L/3$ from one end. Which harmonics are missing from the vibration?`, 'the 3rd, 6th, 9th, and so on', ['the 2nd, 4th, 6th, and so on', 'only the 3rd', 'none; all are present'],
    r`A harmonic cannot be excited if the plucked point is a node of it. The $n$th harmonic has nodes at $x = mL/n$. $x = L/3$ is a node when $n$ is a multiple of 3.`),
  nat(4, 'intensity of sound', r`A loudspeaker radiates 2 W of sound uniformly in all directions. At what distance is the intensity level 80 dB? (in m, 1 decimal; $I_0 = 10^{-12}\ \mathrm{W\,m^{-2}}$)`, () => Math.sqrt(2 / (4 * PI * 1e-4)), 0.2, 1,
    r`80 dB means $I = 10^{8}\times10^{-12} = 10^{-4}\ \mathrm{W\,m^{-2}}$. $r = \sqrt{P/4\pi I} = \sqrt{2/(4\pi\times10^{-4})} = \sqrt{1591.5} = 39.9$ m.`, { unit: 'm' }),
  nat(4, 'standing waves', r`A plane sound wave of frequency 850 Hz ($v = 340\ \mathrm{m\,s^{-1}}$) hits a rigid wall at normal incidence, forming a standing wave. A small pressure sensor is moved away from the wall. Find the distance to the first point of minimum pressure variation (in cm).`, () => 340 / 850 / 4 * 100, 0,
    0, r`At a rigid wall the air cannot move, so it is a displacement node, which is a pressure antinode. The pressure amplitude is a minimum (pressure node) a quarter wavelength away: $\lambda/4 = 0.4/4 = 0.1$ m $= 10$ cm.`, { unit: 'cm', trap: 'Displacement node and pressure node are not at the same place.' }),

  // ---------- Level 5 ----------
  nat(5, 'waves on a rope', r`A uniform heavy rope of length 4.9 m hangs vertically from a fixed support. A pulse is sent up from the lower end. The speed of a pulse at a point at distance $x$ from the lower end is $\sqrt{gx}$. How long does the pulse take to reach the top (in s, 3 decimals; $g = 9.8$)?`, () => 2 * Math.sqrt(4.9 / 9.8), 0.003, 3,
    r`$v = dx/dt = \sqrt{gx}$, so $t = \int_0^L\dfrac{dx}{\sqrt{gx}} = \dfrac{2\sqrt L}{\sqrt g} = 2\sqrt{4.9/9.8} = 1.414$ s. The tension at height $x$ is the weight of the rope below it, $\mu xg$, so $v = \sqrt{T/\mu} = \sqrt{gx}$.`, { unit: 's', trap: 'The speed is not constant, so $t\\ne L/v$.' }),
  nat(5, 'waves on a rope', r`A uniform rope of length 19.6 m hangs vertically. Find the speed of a transverse pulse at its midpoint (in $\mathrm{m\,s^{-1}}$, 1 decimal; $g = 9.8$).`, () => Math.sqrt(9.8 * 9.8), 0.05, 1,
    r`At the midpoint the tension is the weight of the lower half: $T = \mu(L/2)g$. $v = \sqrt{T/\mu} = \sqrt{gL/2} = \sqrt{9.8\times9.8} = 9.8\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(5, 'hanging string with a block', r`A uniform string of mass 2 kg and length 2 m hangs from a ceiling with a 3 kg block tied to its lower end. A pulse is sent from the block to the ceiling. Find the time it takes (in s, 3 decimals; $g = 9.8$). Use $v = \sqrt{T/\mu}$ with $T = (m + \mu x)g$ at distance $x$ above the block.`, () => 2 / Math.sqrt(1 * 9.8) * (Math.sqrt(5) - Math.sqrt(3)), 0.003, 3,
    r`$\mu = 1\ \mathrm{kg\,m^{-1}}$. $v = \sqrt{g(m + \mu x)/\mu}$. $t = \int_0^L\dfrac{dx}{v} = \sqrt{\dfrac{\mu}{g}}\int_0^L\dfrac{dx}{\sqrt{m + \mu x}} = \dfrac{2}{\sqrt{\mu g}}\left(\sqrt{m + M} - \sqrt m\right) = \dfrac{2}{\sqrt{9.8}}(\sqrt5 - \sqrt3) = 0.322$ s.`, { unit: 's' }),
  nat(5, 'Doppler effect', r`A source of frequency 500 Hz moves at $10\ \mathrm{m\,s^{-1}}$ towards a large wall, while the wall moves towards the source at $20\ \mathrm{m\,s^{-1}}$. Find the frequency of the echo heard by a person moving with the source (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, () => 500 * (340 + 20) * (340 + 10) / ((340 - 10) * (340 - 20)), 0.1, 1,
    r`Step 1: the wall is an observer moving towards the source at $u = 20$ and the source moves towards it at $v_s = 10$: $f_1 = f\dfrac{v + u}{v - v_s} = 500\times\dfrac{360}{330}$. Step 2: the wall re-emits as a source moving towards the person at $u$, and the person moves towards it at $v_s$: $f_2 = f_1\dfrac{v + v_s}{v - u} = 500\times\dfrac{360\times350}{330\times320} = 596.6$ Hz.`, { unit: 'Hz', trap: 'Do the two Doppler shifts one after the other.' }),
  nat(5, 'reflection and transmission', r`A wave on a light string (wave speed $100\ \mathrm{m\,s^{-1}}$) meets a junction with a heavier string of the same tension (wave speed $50\ \mathrm{m\,s^{-1}}$). For a wave going from medium 1 to 2, the transmitted amplitude is $A_t = \dfrac{2v_2}{v_1 + v_2}A_i$. For an incident amplitude of 6 mm, find the transmitted amplitude (in mm).`, () => 2 * 50 / 150 * 6, 0,
    0, r`$A_t = \dfrac{2\times50}{100 + 50}\times6 = \dfrac23\times6 = 4$ mm. The reflected amplitude is $\dfrac{v_2 - v_1}{v_1 + v_2}A_i = -2$ mm (inverted, since the heavier string behaves partly like a fixed end). Check at the junction: $6 + (-2) = 4$.`, { unit: 'mm', sub: 'reflection and transmission' }),
  nat(5, 'Doppler effect with SHM source', r`A small whistle of frequency 1000 Hz is fixed to the bob of a simple pendulum of length 1.0 m that swings with amplitude 0.1 rad. A listener is far away along the line of the swing. Find the difference between the highest and the lowest frequencies heard (in Hz, 2 decimals; $g = 9.8$, $v = 340\ \mathrm{m\,s^{-1}}$).`, () => { const u = 0.1 * Math.sqrt(9.8 * 1); return 1000 * 340 / (340 - u) - 1000 * 340 / (340 + u); }, 0.02, 2,
    r`The bob's maximum speed (at the lowest point) is $u = \theta_0\sqrt{gL} = 0.1\times\sqrt{9.8} = 0.313\ \mathrm{m\,s^{-1}}$. $f_{max} = 1000\times\dfrac{340}{340 - 0.313} = 1000.92$ Hz and $f_{min} = 1000\times\dfrac{340}{340 + 0.313} = 999.08$ Hz. Difference $= 1.84$ Hz.`, { unit: 'Hz', sub: 'mixed' }),
  mcq(5, 'Doppler effect', r`A source of frequency $f$ moves in a circle at constant speed. A listener stands at rest at the centre of the circle. The frequency the listener hears is`, r`exactly $f$ at all times`, [r`alternating between higher and lower than $f$`, r`always higher than $f$`, r`always lower than $f$`],
    r`The sound heard at the centre was emitted when the source velocity was perpendicular to the line from the source to the listener. The component of velocity along the line of sight is zero (always, for a circle about the listener), so there is no Doppler shift.`, { trap: 'Speed is not the thing; the radial component is.' }),
  nat(5, 'interference', r`Two loudspeakers 2.0 m apart emit the same 850 Hz note in phase ($v = 340\ \mathrm{m\,s^{-1}}$). Far from them, how many directions between $-90°$ and $+90°$ (inclusive) from the perpendicular bisector give maximum intensity?`, () => 11, 0,
    0, r`$\lambda = 0.4$ m. Maxima need $d\sin\theta = n\lambda$, $\sin\theta = n\lambda/d = 0.2n$. $|\sin\theta|\le1$ gives $n = 0, \pm1, \dots, \pm5$: 11 directions (the last two, $n = \pm5$, are along the line joining the speakers).`, { unit: '', trap: 'The end values $\\sin\\theta = \\pm1$ count.' }),
  mcq(5, 'standing waves', r`A rigid wall reflects a plane sound wave of wavelength $\lambda$ at normal incidence. Which statement about the standing wave in front of the wall is correct?`, r`The wall is a displacement node; the first displacement antinode is at $\lambda/4$ from the wall`, [r`The wall is a displacement antinode; the first node is at $\lambda/2$`, r`The wall is a pressure node; the first pressure antinode is at $\lambda/4$`, r`There is no fixed pattern, because both waves have the same frequency`],
    r`Air at a rigid wall cannot move: displacement node (and pressure antinode). Displacement antinodes occur at odd multiples of $\lambda/4$. The pressure pattern is the reverse. Waves of equal frequency in opposite directions give a fixed standing pattern, not a moving one.`),
  nat(5, 'beats', r`A closed pipe of length 0.50 m and an open pipe of length 1.02 m are sounded together, each in its fundamental ($v = 340\ \mathrm{m\,s^{-1}}$, no end correction). Find the number of beats per second (1 decimal).`, () => Math.abs(340 / (4 * 0.5) - 340 / (2 * 1.02)), 0.1, 1,
    r`Closed: $f_1 = v/4L = 340/2.0 = 170$ Hz. Open: $f_1 = v/2L = 340/2.04 = 166.7$ Hz. Beats $= 170 - 166.7 = 3.3$ per second.`, { unit: 'Hz' }),
  nat(5, 'string with a sliding ring', r`A string of length 1.0 m has one end fixed and the other attached to a light ring that slides freely on a smooth vertical rod. The wave speed on the string is $100\ \mathrm{m\,s^{-1}}$. Find the frequency of the lowest mode (in Hz).`, () => 100 / 4, 0,
    0, r`The fixed end is a node and the free (sliding) end an antinode: like a closed pipe. $L = \lambda/4$ for the lowest mode, so $\lambda = 4$ m and $f = v/\lambda = 25$ Hz. The modes are $25, 75, 125\ldots$ Hz.`, { unit: 'Hz', trap: 'A free end is an antinode, so the modes are odd multiples.' }),
);

// ---------- Multiple-correct ----------
items.push(
  msq(4, 'standing waves', r`A string is fixed at both ends and vibrates in a standing wave. Which statements are correct?`,
    [r`All points between two successive nodes vibrate in phase`, r`The distance between successive nodes is $\lambda/2$`, r`Energy flows steadily past the nodes along the string`, r`Every point of the string has the same amplitude`], [0, 1],
    r`Between two nodes all particles move up and down together (A true). Nodes are $\lambda/2$ apart (B true). The two travelling waves carry equal energy in opposite directions, so no net energy flows (C false). Amplitude varies as $|2A\sin kx|$ (D false).`),
  msq(3, 'closed pipe', r`A pipe is closed at one end and has fundamental frequency $f$. Which statements are correct?`,
    [r`Its fundamental is $v/4L$`, r`It also resonates at $2f$`, r`It also resonates at $3f$`, r`The open end is a pressure antinode`], [0, 2],
    r`$f = v/4L$ (A true). Only odd multiples occur: $f, 3f, 5f$ (B false, C true). At the open end the pressure stays equal to the outside pressure, so it is a pressure node (and a displacement antinode) (D false).`),
  msq(4, 'Doppler effect', r`Which of these statements about the Doppler effect for sound in still air are correct?`,
    [r`When both source and listener are at rest and wind blows from source to listener, the frequency heard is unchanged`, r`When the source moves towards the listener, the wavelength in front of the source is shortened`, r`A source moving at right angles to the line of sight gives, at that instant, no Doppler shift`, r`When only the listener moves towards the source, the wavelength in the air changes`], [0, 1, 2],
    r`(A) wind changes both speed and wavelength: $f' = f$. (B) The source follows its own waves, $\lambda' = (v - v_s)/f$. (C) Only the component of velocity along the line of sight counts. (D) The listener's motion does not change the wavelength in the air; it changes the rate at which wave crests are met.`),
  msq(4, 'beats', r`Two sound waves of nearly equal frequencies are heard together. Which statements are correct?`,
    [r`The beat frequency equals $|f_1 - f_2|$`, r`If the amplitudes are unequal, beats are still heard, but the minimum intensity is not zero`, r`Beats appear when the frequencies differ by a large amount, such as 200 Hz and 400 Hz`, r`Putting wax on a tuning fork lowers its frequency`], [0, 1, 3],
    r`(A) Beat frequency is the difference. (B) With amplitudes $A_1\ne A_2$, $I_{min}\propto(A_1 - A_2)^2>0$. (C) For widely different frequencies we hear two separate notes (or a chord), not beats. (D) Wax adds mass to the prong, so the frequency falls.`),
  msq(3, 'speed of sound', r`The speed of sound in an ideal gas is changed if we`,
    [r`raise the temperature`, r`raise the pressure at constant temperature`, r`change to a gas of larger molar mass at the same temperature (same $\gamma$)`, r`raise the frequency of the source`], [0, 2],
    r`$v = \sqrt{\gamma RT/M}$. It increases with $T$ (A), decreases with $M$ (C). At constant $T$, $P/\rho$ is constant, so pressure has no effect (B). The speed does not depend on frequency (D) (no dispersion in ordinary gases).`),
  msq(5, 'standing waves', r`A standing wave on a string is $y = 4\sin(3x)\cos(60t)$ (cm, with $x$ in m and $t$ in s). Which statements are correct?`,
    [r`There is a node at $x = \pi/3$ m`, r`The component travelling waves have speed $20\ \mathrm{m\,s^{-1}}$`, r`The amplitude of vibration at $x = \pi/6$ m is 4 cm`, r`The wavelength is 3 m`], [0, 1, 2],
    r`(A) $\sin(3\times\pi/3) = \sin\pi = 0$. (B) $v = \omega/k = 60/3 = 20\ \mathrm{m\,s^{-1}}$. (C) $|\sin(3\times\pi/6)| = |\sin(\pi/2)| = 1$, so the amplitude is 4 cm (an antinode). (D) $\lambda = 2\pi/k = 2\pi/3 = 2.09$ m, not 3 m.`),
  msq(4, 'intensity and loudness', r`Which statements about intensity and loudness are correct?`,
    [r`Doubling the amplitude of a wave multiplies its intensity by four`, r`An increase of 10 dB means ten times the intensity`, r`An increase of about 3 dB means roughly twice the intensity`, r`Doubling the distance from a small point source reduces the level by 3 dB`], [0, 1, 2],
    r`$I\propto A^2$ (A). $\Delta\beta = 10\log(I_2/I_1)$ (B, C: $10\log2 = 3.01$). Doubling the distance gives $I/4$, which is $-6$ dB, not $-3$ dB (D false).`),
);

// ---------- Assertion and Reason ----------
items.push(
  asrt(2, 'sound waves', r`Sound waves in air cannot be polarised.`, r`Sound waves in air are longitudinal.`, 0,
    r`Polarisation (restricting the direction of vibration) is possible only for transverse waves. In a longitudinal wave the vibration is always along the direction of travel. R explains A.`),
  asrt(3, 'speed of sound', r`The speed of sound in an ideal gas does not change when the pressure is changed at constant temperature.`, r`When the pressure changes at constant temperature, the density changes in the same proportion.`, 0,
    r`$v = \sqrt{\gamma P/\rho}$ and $P/\rho = RT/M$ is fixed by temperature. R is the reason.`),
  asrt(2, 'pipes', r`In a pipe open at both ends, all harmonics of the fundamental are present.`, r`The fundamental frequency of an open pipe of length $L$ is $v/2L$.`, 1,
    r`A is true, since $f_n = nv/2L$ for every whole number $n$. R is also true, but it is just the first of those frequencies; it does not say why all the others occur (which is because both ends are antinodes).`),
  asrt(2, 'pipes', r`In a pipe closed at one end, even harmonics are absent.`, r`A closed end of an air column is a displacement antinode.`, 2,
    r`A is true: only $f, 3f, 5f\ldots$ occur. R is false: the closed end is a displacement node (the air cannot move), and the open end is an antinode.`),
  asrt(3, 'reflection', r`A pulse reflected from the free end of a string comes back inverted.`, r`At a free end the string can move with a large displacement.`, 3,
    r`A is false: at a free end the reflected pulse is upright (no phase change). It is the fixed end that inverts the pulse. R is a true statement: the free end is an antinode.`),
  asrt(3, 'beats', r`Two sound waves of slightly different frequencies produce beats.`, r`The phase difference between the two waves at the listener changes steadily with time, so the resultant amplitude rises and falls.`, 0,
    r`The resultant amplitude is $|2A\cos(\pi\Delta f\,t)|$. R describes this mechanism.`),
  asrt(3, 'speed of sound', r`Sound travels faster in a steel rod than in air.`, r`Steel has a higher density than air.`, 1,
    r`A is true (5000 m/s against 340 m/s). R is true but it is not the explanation. A larger density would lower the speed, $v = \sqrt{E/\rho}$; steel is faster because its elastic modulus is vastly larger.`, { trap: 'A higher density by itself slows a wave.' }),
  asrt(4, 'standing waves', r`No net energy is transported along a string carrying a standing wave.`, r`The two travelling waves forming it carry equal energy in opposite directions.`, 0,
    r`The net energy flux is the difference of two equal opposite fluxes, which is zero. Energy only moves back and forth between kinetic and potential forms within each loop.`),
  asrt(4, 'Doppler effect', r`The echo from a wall moving towards a stationary source has a higher frequency than the source.`, r`The wall acts first as a moving observer and then as a moving source.`, 0,
    r`The wall receives $f(v + u)/v$ and re-emits it as a source approaching the listener: $f' = f(v + u)/(v - u) > f$. R is the step-by-step reason.`),
  asrt(3, 'intensity and loudness', r`Doubling the intensity of a sound doubles its loudness.`, r`The loudness level (in dB) is proportional to the logarithm of the intensity.`, 3,
    r`A is false: doubling the intensity adds only 3 dB; the perceived loudness changes little. R is a true statement of the decibel scale.`),
  asrt(2, 'sound waves', r`A tuning fork sounds louder when its stem is pressed on a table.`, r`The table increases the energy given out by the fork.`, 2,
    r`A is true. The table vibrates and radiates sound over a larger area, so the sound is louder and the fork dies out sooner. R is false: the total energy is the same (and runs out faster); the table only helps to transfer it to the air.`),
);

// ---------- Statement I / Statement II ----------
items.push(
  stm(2, 'standing waves', r`Standing waves carry no net energy along the string.`, r`The nodes and antinodes of a standing wave stay at fixed positions.`, 0,
    r`Both true: the two waves carry equal energy in opposite directions, and the pattern does not travel.`),
  stm(3, 'speed of sound', r`At constant temperature the speed of sound in air is the same on a mountaintop as at sea level.`, r`The speed of sound in a gas depends on $\gamma$, $T$ and $M$, not on the pressure itself.`, 0,
    r`$v = \sqrt{\gamma RT/M}$. Pressure changes cancel with the density change. Both true.`),
  stm(3, 'pipes', r`A pipe closed at one end resonates only at odd multiples of its fundamental.`, r`At the closed end there is a displacement node, and at the open end an antinode.`, 0,
    r`The conditions give $L = (2n - 1)\lambda/4$. Both true.`),
  stm(2, 'sound waves', r`Sound waves in air can be polarised.`, r`Sound waves in air are longitudinal.`, 3,
    r`I is false: polarisation is only for transverse waves. II is true.`),
  stm(3, 'Doppler effect', r`An echo from a stationary wall, heard by a stationary listener next to a stationary source, has the same frequency as the source.`, r`Reflection from a rigid wall changes the frequency of a wave.`, 2,
    r`I is true: no relative motion, no Doppler shift. II is false: the wall only reverses the direction (and may shift the phase).`),
  stm(2, 'beats', r`Beats can be heard between sounds of 200 Hz and 400 Hz.`, r`The beat frequency is the sum of the two frequencies.`, 1,
    r`Both false. Beats need frequencies that differ by only a few hertz, and the beat frequency is the difference, $|f_1 - f_2|$.`),
  stm(4, 'refraction of waves', r`A pulse going from a light string into a heavier string is partly reflected, with inversion.`, r`The wave speed on the heavier string is lower, so the heavier string acts partly like a fixed end.`, 0,
    r`The reflected amplitude is $(v_2 - v_1)/(v_1 + v_2)<0$ when $v_2<v_1$, an inversion. Both true, and II is the reason.`),
  stm(4, 'pipes', r`If an open pipe is dipped half its length into water, its fundamental frequency doubles.`, r`The fundamental of a closed pipe of length $L$ is $v/4L$.`, 3,
    r`I is false: the new closed pipe has length $L/2$, so $f' = v/(4L/2) = v/2L$, unchanged. II is true.`),
  stm(3, 'speed of sound', r`Sound travels faster in warm air than in cold air.`, r`At the same temperature, sound travels faster in a gas of larger molar mass.`, 2,
    r`I is true: $v\propto\sqrt T$. II is false: $v\propto1/\sqrt M$, so heavier molecules give a lower speed.`),
);

// ---------- Match the following ----------
items.push(
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'pipes', group: 'm1',
    q: r`A pipe of length $L$ vibrates in the mode named in List I. Match each with the relation between $L$ and the wavelength $\lambda$ in List II (neglect end correction).`,
    options: ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'], answer: 0,
    sol: r`Open pipe, fundamental: $L = \lambda/2$ (p). Closed pipe, fundamental: $L = \lambda/4$ (q). Open pipe, second harmonic: $L = \lambda$ (r). Closed pipe, third harmonic: $L = 3\lambda/4$ (s).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'Doppler effect', group: 'm2',
    q: r`Match each situation (sound in still air, speed $v$) with the frequency heard, as a function of the source frequency $f$.`,
    options: ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'], answer: 0,
    sol: r`Source approaching a stationary listener: $fv/(v - v_s)$ (p). Listener receding from a stationary source: $f(v - v_o)/v$ (q). Source and listener moving with the same velocity in the same direction: no relative motion, $f' = f$ (r). Both approaching: $f(v + v_o)/(v - v_s)$ (s).` },
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'speed of waves', group: 'm3',
    q: r`Match each medium in List I with the formula for the speed of waves in it in List II.`,
    options: ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'], answer: 0,
    sol: r`Transverse waves on a string: $\sqrt{T/\mu}$ (p). Sound in a gas (Laplace): $\sqrt{\gamma P/\rho}$ (q). Longitudinal waves in a solid rod: $\sqrt{Y/\rho}$ (r). Sound in a liquid: $\sqrt{B/\rho}$ (s).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'intensity and loudness', group: 'm4',
    q: r`Match each change in List I with the change of intensity level in List II (incoherent sources, free field).`,
    options: ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-s, C-r, D-q'], answer: 0,
    sol: r`Doubling the distance: $I\to I/4$, $\Delta\beta = -6$ dB (p). Doubling the intensity: $+3$ dB (q). Ten times the intensity: $+10$ dB (r). 100 identical sources: $10\log100 = +20$ dB (s).` },
);
items.filter((x) => x.format === 'match').forEach((it, i) => {
  const pos = [1, 3, 0, 2][i]; const a = it.answer; [it.options[a], it.options[pos]] = [it.options[pos], it.options[a]]; it.answer = pos;
});

const groups = {
  m1: { title: 'Pipes and wavelengths',
    list1: ['A. Open pipe, fundamental', 'B. Closed pipe, fundamental', 'C. Open pipe, second harmonic', 'D. Closed pipe, third harmonic'],
    list2: [r`p. $L = \lambda/2$`, r`q. $L = \lambda/4$`, r`r. $L = \lambda$`, r`s. $L = 3\lambda/4$`] },
  m2: { title: 'Doppler situations',
    list1: ['A. Source approaching a stationary listener', 'B. Listener receding from a stationary source', 'C. Source and listener moving with the same velocity along the same line', 'D. Source and listener approaching each other'],
    list2: [r`p. $fv/(v - v_s)$`, r`q. $f(v - v_o)/v$`, r`r. $f$ (no change)`, r`s. $f(v + v_o)/(v - v_s)$`] },
  m3: { title: 'Speed of waves in different media',
    list1: ['A. Transverse wave on a string', 'B. Sound in a gas', 'C. Longitudinal wave in a solid rod', 'D. Sound in a liquid'],
    list2: [r`p. $\sqrt{T/\mu}$`, r`q. $\sqrt{\gamma P/\rho}$`, r`r. $\sqrt{Y/\rho}$`, r`s. $\sqrt{B/\rho}$`] },
  m4: { title: 'Changes of sound level',
    list1: ['A. Distance from a point source doubled', 'B. Intensity doubled', 'C. Intensity made ten times', 'D. 100 identical independent sources instead of one'],
    list2: ['p. $-6$ dB', 'q. $+3$ dB', 'r. $+10$ dB', 's. $+20$ dB'] },
  p1: { title: 'A stretched string',
    passage: r`<p>A string of length 0.50 m is fixed at both ends. Its mass per unit length is $0.005\ \mathrm{kg\,m^{-1}}$ and it is stretched with a tension of 50 N.</p>` },
  p2: { title: 'An air column closed at one end',
    passage: r`<p>A tube closed at one end has an air column 0.425 m long. Take the speed of sound as $340\ \mathrm{m\,s^{-1}}$.</p>` },
  p3: { title: 'A siren on a car',
    passage: r`<p>A siren of frequency 600 Hz is fixed to a car that moves at $30\ \mathrm{m\,s^{-1}}$ along a straight road towards a large flat wall. A person standing on the road behind the car (the car moves away from her, towards the wall) hears the siren directly and also its echo from the wall. Take $v = 340\ \mathrm{m\,s^{-1}}$.</p>` },
  p4: { title: 'A loudspeaker',
    passage: r`<p>A small loudspeaker radiates 2 W of sound power uniformly in all directions in open air. Take $I_0 = 10^{-12}\ \mathrm{W\,m^{-2}}$ and ignore absorption.</p>` },
};

const pas = (level, sub, group, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: EX[level], sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
items.push(
  pas(2, 'speed on a string', 'p1', r`Find the speed of transverse waves on the string (in $\mathrm{m\,s^{-1}}$).`, () => Math.sqrt(50 / 0.005), 0,
    0, r`$v = \sqrt{T/\mu} = \sqrt{50/0.005} = \sqrt{10^4} = 100\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  pas(2, 'standing waves on a string', 'p1', r`Find the frequency of the fundamental mode (in Hz).`, () => 100 / (2 * 0.5), 0,
    0, r`$f_1 = v/2L = 100/1.0 = 100$ Hz.`, { unit: 'Hz' }),
  pas(3, 'standing waves on a string', 'p1', r`To what tension (in N, 1 decimal) must the string be adjusted so that its fundamental becomes 150 Hz?`, () => 50 * 1.5 ** 2, 0.1, 1,
    r`$f\propto\sqrt T$, so $T' = T(f'/f)^2 = 50\times(150/100)^2 = 112.5$ N.`, { unit: 'N' }),
  pas(2, 'closed pipe', 'p2', r`Find the fundamental frequency (in Hz).`, () => 340 / (4 * 0.425), 0,
    0, r`$f_1 = v/4L = 340/(4\times0.425) = 340/1.7 = 200$ Hz.`, { unit: 'Hz' }),
  pas(3, 'closed pipe', 'p2', r`How many resonant frequencies does the tube have below 2000 Hz?`, () => 5, 0,
    0, r`Resonances: $200(2n - 1)$ Hz $= 200, 600, 1000, 1400, 1800$ Hz. The next, 2200 Hz, is above 2000 Hz. So there are 5.`, { unit: '' }),
  pas(3, 'end correction', 'p2', r`The tube's radius is 2.0 cm. Using an end correction of $0.6r$ at the open end, find the corrected fundamental frequency (in Hz, 1 decimal).`, () => 340 / (4 * (0.425 + 0.6 * 0.02)), 0.3, 1,
    r`$L_{eff} = 0.425 + 0.012 = 0.437$ m. $f_1 = 340/(4\times0.437) = 194.5$ Hz.`, { unit: 'Hz' }),
  pas(3, 'Doppler effect', 'p3', r`Find the frequency of the direct sound heard by the person (in Hz, 1 decimal).`, () => 600 * 340 / (340 + 30), 0.1, 1,
    r`The car moves away from her, so $f_1 = f\dfrac{v}{v + v_s} = 600\times\dfrac{340}{370} = 551.4$ Hz.`, { unit: 'Hz' }),
  pas(3, 'Doppler effect', 'p3', r`Find the frequency of the echo heard by the person (in Hz, 1 decimal).`, () => 600 * 340 / (340 - 30), 0.1, 1,
    r`The siren moves towards the wall, which is a stationary reflector, so the echo has $f_2 = f\dfrac{v}{v - v_s} = 600\times\dfrac{340}{310} = 658.1$ Hz. The wall is at rest, so there is no further shift on the way back.`, { unit: 'Hz' }),
  pas(4, 'Doppler effect and beats', 'p3', r`Find the beat frequency she hears (in Hz, 1 decimal).`, () => 600 * 340 / 310 - 600 * 340 / 370, 0.1, 1,
    r`Beats $= f_2 - f_1 = 658.1 - 551.4 = 106.7$ Hz. (At such a rate the ear hears a rough tone, not separate beats.)`, { unit: 'Hz' }),
  pas(2, 'intensity and loudness', 'p4', r`Find the intensity at 5 m from the loudspeaker (in $\mathrm{mW\,m^{-2}}$, 2 decimals).`, () => 2 / (4 * PI * 25) * 1000, 0.02, 2,
    r`$I = \dfrac{P}{4\pi r^2} = \dfrac{2}{4\pi\times25} = 6.37\times10^{-3}\ \mathrm{W\,m^{-2}} = 6.37\ \mathrm{mW\,m^{-2}}$.`, { unit: 'mW/m²' }),
  pas(3, 'intensity and loudness', 'p4', r`Find the intensity level at 5 m (in dB, 1 decimal).`, () => 10 * Math.log10(2 / (4 * PI * 25) / 1e-12), 0.1, 1,
    r`$\beta = 10\log_{10}\dfrac{6.37\times10^{-3}}{10^{-12}} = 10\times9.80 = 98.0$ dB.`, { unit: 'dB' }),
  pas(4, 'intensity and loudness', 'p4', r`At what distance does the level fall to 60 dB? (in m, nearest whole number)`, () => Math.sqrt(2 / (4 * PI * 1e-6)), 1, 0,
    r`60 dB is $I = 10^{6}\times10^{-12} = 10^{-6}\ \mathrm{W\,m^{-2}}$. $r = \sqrt{P/4\pi I} = \sqrt{2/(4\pi\times10^{-6})} = \sqrt{1.59\times10^5} = 399$ m.`, { unit: 'm' }),
);

// ---------- Number templates ----------
const R = (x, dp) => +x.toFixed(dp);
const gens = [
  { id: 'wv-g01', type: 'nat', level: 2, exams: EX[2], sub: 'wave equation',
    make(rng) {
      const A = pick(rng, 1, 9); const w = pick(rng, 50, 500, 10); const kk = pick(rng, 0.5, 5, 0.5); const v = int(rng, 0, 3);
      const eq = r`$y = ${A}\sin(${w}t - ${kk}x)$ (SI units, $y$ in mm)`;
      if (v === 0) return { A, w, kk, v, q: r`A wave is described by ${eq}. Find its speed (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, answer: R(w / kk, 1), tol: 0.06, unit: 'm/s', sol: r`$v = \omega/k = ${w}/${kk} = ${R(w / kk, 1)}\ \mathrm{m\,s^{-1}}$.` };
      if (v === 1) return { A, w, kk, v, q: r`A wave is described by ${eq}. Find its wavelength (in m, 3 decimals).`, answer: R(2 * PI / kk, 3), tol: 0.004, unit: 'm', sol: r`$\lambda = 2\pi/k = 6.283/${kk} = ${R(2 * PI / kk, 3)}$ m.` };
      if (v === 2) return { A, w, kk, v, q: r`A wave is described by ${eq}. Find its frequency (in Hz, 2 decimals).`, answer: R(w / (2 * PI), 2), tol: 0.02, unit: 'Hz', sol: r`$f = \omega/2\pi = ${w}/6.283 = ${R(w / (2 * PI), 2)}$ Hz.`, trap: 'Do not read $\\omega$ as $f$.' };
      return { A, w, kk, v, q: r`A wave is described by ${eq}. Find the maximum speed of a particle of the medium (in $\mathrm{m\,s^{-1}}$, 3 decimals).`, answer: R(A * 1e-3 * w, 3), tol: 0.004, unit: 'm/s', sol: r`$v_{p,max} = A\omega = ${A}\times10^{-3}\times${w} = ${R(A * 1e-3 * w, 3)}\ \mathrm{m\,s^{-1}}$.`, trap: 'Particle speed is not the wave speed.' };
    },
    verify: (p) => (p.v === 0 ? p.w / p.kk : p.v === 1 ? 2 * PI / p.kk : p.v === 2 ? p.w / (2 * PI) : p.A * 1e-3 * p.w) },
  { id: 'wv-g02', type: 'nat', level: 2, exams: EX[2], sub: 'speed on a string',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const T = pick(rng, 20, 200, 10); const mu = pick(rng, 0.005, 0.05, 0.005); return { v, T, mu, q: r`A string of mass per unit length ${mu} $\mathrm{kg\,m^{-1}}$ is under a tension of ${T} N. Find the speed of transverse waves on it (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, answer: R(Math.sqrt(T / mu), 1), tol: 0.1, unit: 'm/s', sol: r`$v = \sqrt{T/\mu} = \sqrt{${T}/${mu}} = ${R(Math.sqrt(T / mu), 1)}\ \mathrm{m\,s^{-1}}$.` }; }
      if (v === 1) { const m = pick(rng, 5, 50, 5); const L = pick(rng, 1, 5); const T = pick(rng, 20, 200, 10); const mu = m / 1000 / L; return { v, m, L, T, q: r`A wire of mass ${m} g and length ${L} m is stretched with a tension of ${T} N. Find the speed of transverse waves on it (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, answer: R(Math.sqrt(T / mu), 1), tol: 0.1, unit: 'm/s', sol: r`$\mu = ${m / 1000}/${L} = ${R(mu, 5)}\ \mathrm{kg\,m^{-1}}$. $v = \sqrt{T/\mu} = \sqrt{${T}/${R(mu, 5)}} = ${R(Math.sqrt(T / mu), 1)}\ \mathrm{m\,s^{-1}}$.`, trap: 'Use mass per unit length.' }; }
      const mu = pick(rng, 0.005, 0.05, 0.005); const vv = pick(rng, 20, 100, 10); const T = mu * vv * vv; return { v, mu, vv, q: r`A string of mass per unit length ${mu} $\mathrm{kg\,m^{-1}}$ carries waves at ${vv} $\mathrm{m\,s^{-1}}$. Find the tension (in N, 2 decimals).`, answer: R(T, 2), tol: 0.02, unit: 'N', sol: r`$T = \mu v^2 = ${mu}\times${vv}^2 = ${R(T, 2)}$ N.` };
    },
    verify: (p) => (p.v === 0 ? Math.sqrt(p.T / p.mu) : p.v === 1 ? Math.sqrt(p.T * p.L / (p.m / 1000)) : p.mu * p.vv ** 2) },
  { id: 'wv-g03', type: 'nat', level: 2, exams: EX[2], sub: 'speed of sound',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const t = pick(rng, 5, 45, 5); const vt = 332 * Math.sqrt((273 + t) / 273); return { v, t, q: r`The speed of sound in air at 0 °C is $332\ \mathrm{m\,s^{-1}}$. Find its value at ${t} °C (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, answer: R(vt, 1), tol: 0.3, unit: 'm/s', sol: r`$v\propto\sqrt T$ (kelvin). $v = 332\sqrt{${273 + t}/273} = ${R(vt, 1)}\ \mathrm{m\,s^{-1}}$.`, trap: 'Use kelvin.' }; }
      if (v === 1) { const gas = choose(rng, [['hydrogen', 0.002, 1.4], ['helium', 0.004, 1.67], ['nitrogen', 0.028, 1.4], ['oxygen', 0.032, 1.4], ['argon', 0.040, 1.67]]); const T = pick(rng, 250, 350, 25); const vt = Math.sqrt(gas[2] * 8.314 * T / gas[1]); return { v, name: gas[0], M: gas[1], gm: gas[2], T, q: r`Find the speed of sound in ${gas[0]} (molar mass ${gas[1] * 1000} g/mol, $\gamma = ${gas[2]}$) at ${T} K (in $\mathrm{m\,s^{-1}}$, nearest whole number; $R = 8.314$).`, answer: R(vt, 0), tol: 1, unit: 'm/s', sol: r`$v = \sqrt{\gamma RT/M} = \sqrt{${gas[2]}\times8.314\times${T}/${gas[1]}} = ${R(vt, 0)}\ \mathrm{m\,s^{-1}}$.`, trap: 'Molar mass in kg/mol.' }; }
      const rho = pick(rng, 0.8, 1.4, 0.1); const P = 1.013e5; const vt = Math.sqrt(1.4 * P / rho); return { v, rho, q: r`A gas has density ${rho} $\mathrm{kg\,m^{-3}}$ at pressure $1.013\times10^5$ Pa and $\gamma = 1.4$. Find the speed of sound in it, with Laplace's correction (in $\mathrm{m\,s^{-1}}$, nearest whole number).`, answer: R(vt, 0), tol: 1, unit: 'm/s', sol: r`$v = \sqrt{\gamma P/\rho} = \sqrt{1.4\times1.013\times10^5/${rho}} = ${R(vt, 0)}\ \mathrm{m\,s^{-1}}$.` };
    },
    verify: (p) => (p.v === 0 ? 332 * Math.sqrt((273 + p.t) / 273) : p.v === 1 ? Math.sqrt(p.gm * 8.314 * p.T / p.M) : Math.sqrt(1.4 * 1.013e5 / p.rho)) },
  { id: 'wv-g04', type: 'nat', level: 3, exams: EX[3], sub: 'intensity and loudness',
    make(rng) {
      const v = int(rng, 0, 3);
      if (v === 0) { const e = int(rng, -11, -3); const I = 10 ** e; return { v, e, q: r`A sound has intensity $10^{${e}}\ \mathrm{W\,m^{-2}}$. Find its intensity level (in dB; $I_0 = 10^{-12}\ \mathrm{W\,m^{-2}}$).`, answer: 10 * (e + 12), tol: 0, unit: 'dB', sol: r`$\beta = 10\log_{10}(I/I_0) = 10\log_{10}(10^{${e + 12}}) = ${10 * (e + 12)}$ dB.` }; }
      if (v === 1) { const b = pick(rng, 50, 100, 10); const n = choose(rng, [2, 4, 5, 10, 100]); const nb = b + 10 * Math.log10(n); return { v, b, n, q: r`One machine produces ${b} dB at a listener. What level (in dB, 1 decimal) results when ${n} identical, independent machines run together?`, answer: R(nb, 1), tol: 0.1, unit: 'dB', sol: r`Intensities add: ${n} times. $\Delta\beta = 10\log_{10}${n} = ${R(10 * Math.log10(n), 2)}$ dB. $\beta = ${R(nb, 1)}$ dB.` }; }
      if (v === 2) { const b = pick(rng, 60, 100, 5); const r1 = pick(rng, 2, 10, 2); const f = choose(rng, [2, 3, 4, 5, 10]); const nb = b - 20 * Math.log10(f); return { v, b, r1, f, q: r`At ${r1} m from a small source the level is ${b} dB. Find the level at ${r1 * f} m (in dB, 1 decimal; no absorption).`, answer: R(nb, 1), tol: 0.1, unit: 'dB', sol: r`$I\propto1/r^2$. $\Delta\beta = -20\log_{10}${f} = -${R(20 * Math.log10(f), 2)}$ dB. $\beta = ${R(nb, 1)}$ dB.` }; }
      const P = pick(rng, 1, 20); const d = pick(rng, 2, 30); const I = P / (4 * PI * d * d); return { v, P, d, q: r`A small source radiates ${P} W of sound uniformly. Find the intensity level at ${d} m (in dB, 1 decimal; $I_0 = 10^{-12}\ \mathrm{W\,m^{-2}}$).`, answer: R(10 * Math.log10(I / 1e-12), 1), tol: 0.1, unit: 'dB', sol: r`$I = P/4\pi d^2 = ${P}/(4\pi\times${d * d}) = ${fmt(I, 3)}\ \mathrm{W\,m^{-2}}$. $\beta = 10\log_{10}(I/I_0) = ${R(10 * Math.log10(I / 1e-12), 1)}$ dB.` };
    },
    verify: (p) => (p.v === 0 ? 10 * (p.e + 12) : p.v === 1 ? p.b + 10 * Math.log10(p.n) : p.v === 2 ? p.b + 10 * Math.log10(1 / (p.f * p.f)) : 10 * Math.log10(p.P / (4 * PI * p.d ** 2) * 1e12)) },
  { id: 'wv-g05', type: 'nat', level: 3, exams: EX[3], sub: 'interference',
    make(rng) {
      const v = int(rng, 0, 3);
      if (v === 0) { const lam = pick(rng, 0.2, 2, 0.2); const dx = pick(rng, 0.1, 3, 0.1); const ph = 360 * dx / lam; return { v, lam, dx, q: r`Two points on a wave of wavelength ${lam} m are ${dx} m apart along the direction of travel. Find the phase difference between them (in degrees, 1 decimal, up to $360°$ or more).`, answer: R(ph, 1), tol: 0.1, unit: '°', sol: r`$\Delta\phi = 360°\times\dfrac{\Delta x}{\lambda} = 360°\times\dfrac{${dx}}{${lam}} = ${R(ph, 1)}°$.` }; }
      if (v === 1) { const r1 = pick(rng, 2, 6); const r2 = pick(rng, 1, 5); const e = ((r1 + r2) / Math.abs(r1 - r2 || 1)) ** 2; if (r1 === r2) return { v: 1, r1: r1 + 1, r2, q: r`Two coherent waves have amplitudes in the ratio ${r1 + 1} : ${r2}. Find $I_{max}/I_{min}$ (2 decimals).`, answer: R(((r1 + 1 + r2) / (r1 + 1 - r2)) ** 2, 2), tol: 0.02, unit: '', sol: r`$\dfrac{I_{max}}{I_{min}} = \left(\dfrac{${r1 + 1} + ${r2}}{${r1 + 1} - ${r2}}\right)^2 = ${R(((r1 + 1 + r2) / (r1 + 1 - r2)) ** 2, 2)}$.` }; return { v, r1, r2, q: r`Two coherent waves have amplitudes in the ratio ${r1} : ${r2}. Find $I_{max}/I_{min}$ (2 decimals).`, answer: R(e, 2), tol: 0.02, unit: '', sol: r`$\dfrac{I_{max}}{I_{min}} = \left(\dfrac{${r1} + ${r2}}{${r1} - ${r2}}\right)^2 = ${R(e, 2)}$ (the larger amplitude first; the sign makes no difference after squaring).` }; }
      if (v === 2) { const ph = choose(rng, [60, 90, 120, 150]); const I = 4 * Math.cos(ph * PI / 360) ** 2; return { v, ph, q: r`Two coherent waves each give intensity $I_0$ alone at a point, with a phase difference of ${ph}° there. Find the resultant intensity in units of $I_0$ (2 decimals).`, answer: R(I, 2), tol: 0.02, unit: '', sol: r`$I = 4I_0\cos^2(\phi/2) = 4I_0\cos^2(${ph / 2}°) = ${R(I, 2)}I_0$.` }; }
      const n = int(rng, 2, 5); const half = rng() < 0.5; const d = half ? n + 0.5 : n; const cnt = half ? 2 * n : 2 * n + 1; // maxima count
      const d2 = choose(rng, [1.5, 2.5, 3.5, 4.5]); const maxima = 2 * Math.floor(d2) + 1; return { v, d2, q: r`Two coherent in-phase sources are ${d2}$\lambda$ apart. How many points of maximum intensity lie on the segment between them (excluding the sources)?`, answer: maxima, tol: 0, unit: '', sol: r`The path difference runs from $-d$ to $+d$ along the segment. Maxima occur for $\Delta = n\lambda$ with $|n\lambda|<${d2}\lambda$, so $n = 0, \pm1, \ldots, \pm${Math.floor(d2)}$: ${maxima} points.` };
    },
    verify: (p) => (p.v === 0 ? p.dx / p.lam * 360 : p.v === 1 ? ((p.r1 + p.r2) / (p.r1 - p.r2)) ** 2 : p.v === 2 ? (2 * Math.cos(p.ph * PI / 360)) ** 2 : 2 * Math.floor(p.d2) + 1) },
  { id: 'wv-g06', type: 'nat', level: 2, exams: EX[2], sub: 'standing waves on a string',
    make(rng) {
      const v = int(rng, 0, 3);
      if (v === 0) { const L = pick(rng, 0.4, 1.6, 0.2); const vs = pick(rng, 60, 300, 20); const n = int(rng, 1, 5); const f = n * vs / (2 * L); return { v, L, vs, n, q: r`A string of length ${L} m is fixed at both ends, and waves travel on it at ${vs} $\mathrm{m\,s^{-1}}$. Find the frequency of its ${n === 1 ? 'fundamental' : 'harmonic number ' + n} (in Hz, 1 decimal).`, answer: R(f, 1), tol: 0.1, unit: 'Hz', sol: r`$f_n = nv/2L = ${n}\times${vs}/(2\times${L}) = ${R(f, 1)}$ Hz.` }; }
      if (v === 1) { const f1 = pick(rng, 40, 200, 10); const n = int(rng, 2, 6); return { v, f1, n, q: r`A string fixed at both ends has two successive resonances at ${n * f1} Hz and ${(n + 1) * f1} Hz, with none between. Find its fundamental frequency (in Hz).`, answer: f1, tol: 0, unit: 'Hz', sol: r`Consecutive harmonics differ by $f_1$: $${(n + 1) * f1} - ${n * f1} = ${f1}$ Hz.` }; }
      if (v === 2) { const L = pick(rng, 0.6, 2.4, 0.6); const n = int(rng, 2, 6); return { v, L, n, q: r`A string of length ${L} m, fixed at both ends, vibrates in harmonic number ${n}. Find the wavelength (in m, 3 decimals).`, answer: R(2 * L / n, 3), tol: 0.004, unit: 'm', sol: r`$\lambda_n = 2L/n = ${2 * L}/${n} = ${R(2 * L / n, 3)}$ m.` }; }
      const n = int(rng, 2, 6); return { v, n, q: r`A string fixed at both ends vibrates in harmonic number ${n}. How many nodes does the pattern have, counting the two ends?`, answer: n + 1, tol: 0, unit: '', sol: r`The $n$th harmonic has $n$ loops, separated by $n - 1$ inner nodes, plus the 2 ends: $n + 1 = ${n + 1}$ nodes.` };
    },
    verify: (p) => (p.v === 0 ? p.n * p.vs / (2 * p.L) : p.v === 1 ? ((p.n + 1) * p.f1) - p.n * p.f1 : p.v === 2 ? 2 * p.L / p.n : p.n - 1 + 2) },
  { id: 'wv-g07', type: 'nat', level: 2, exams: EX[2], sub: 'open pipe',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const L = pick(rng, 0.2, 1.7, 0.1); const f = 340 / (2 * L); return { v, L, q: r`An open pipe is ${L} m long. Taking $v = 340\ \mathrm{m\,s^{-1}}$ and no end correction, find its fundamental frequency (in Hz, 1 decimal).`, answer: R(f, 1), tol: 0.1, unit: 'Hz', sol: r`$f_1 = v/2L = 340/${R(2 * L, 2)} = ${R(f, 1)}$ Hz.` }; }
      if (v === 1) { const f = pick(rng, 170, 680, 85); const L = 340 / (2 * f); return { v, f, q: r`An open pipe has a fundamental frequency of ${f} Hz ($v = 340\ \mathrm{m\,s^{-1}}$, no end correction). Find its length (in m, 3 decimals).`, answer: R(L, 3), tol: 0.004, unit: 'm', sol: r`$L = v/2f = 340/${2 * f} = ${R(L, 3)}$ m.` }; }
      const L = pick(rng, 0.5, 2, 0.5); const lim = pick(rng, 2000, 10000, 2000); const n = Math.floor(lim / (340 / (2 * L))); return { v, L, lim, q: r`An open pipe is ${L} m long ($v = 340\ \mathrm{m\,s^{-1}}$, no end correction). How many of its harmonics have frequency up to ${lim} Hz?`, answer: n, tol: 0, unit: '', sol: r`$f_n = nv/2L = ${R(340 / (2 * L), 1)}n$ Hz. $n\le${lim}/${R(340 / (2 * L), 1)} = ${R(lim / (340 / (2 * L)), 2)}$, so ${n} harmonics.` };
    },
    verify: (p) => (p.v === 0 ? 340 / (2 * p.L) : p.v === 1 ? 340 / (2 * p.f) : Math.floor(p.lim * 2 * p.L / 340 + 1e-9)) },
  { id: 'wv-g08', type: 'nat', level: 3, exams: EX[3], sub: 'closed pipe',
    make(rng) {
      const v = int(rng, 0, 3);
      if (v === 0) { const L = pick(rng, 0.1, 1.2, 0.05); const e = pick(rng, 0, 3, 1) / 100; const f = 340 / (4 * (L + e)); return { v, L, e, q: r`A pipe closed at one end is ${L} m long${e ? ` and its end correction is ${e * 100} cm` : ' (no end correction)'}. Find its fundamental frequency (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, answer: R(f, 1), tol: 0.2, unit: 'Hz', sol: r`$f_1 = \dfrac{v}{4(L + e)} = \dfrac{340}{4\times${R(L + e, 3)}} = ${R(f, 1)}$ Hz.` }; }
      if (v === 1) { const f1 = pick(rng, 50, 200, 10); const n = int(rng, 1, 5); const k2 = 2 * n + 1; return { v, f1, n, q: r`A closed pipe has fundamental frequency ${f1} Hz. Find the frequency of its ${n === 1 ? 'first' : n === 2 ? 'second' : n === 3 ? 'third' : n === 4 ? 'fourth' : 'fifth'} overtone (in Hz).`, answer: k2 * f1, tol: 0, unit: 'Hz', sol: r`Only odd harmonics: $f, 3f, 5f\ldots$ The overtones are numbered from the first one above the fundamental, so overtone ${n} is harmonic ${k2}: $${k2}\times${f1} = ${k2 * f1}$ Hz.`, trap: 'Overtone $n$ is harmonic $2n + 1$ in a closed pipe.' }; }
      if (v === 2) { const f1 = pick(rng, 50, 200, 10); const n = int(rng, 1, 4); return { v, f1, n, q: r`A pipe closed at one end resonates at ${(2 * n + 1) * f1} Hz and at ${(2 * n + 3) * f1} Hz, with none between. Find its fundamental frequency (in Hz).`, answer: f1, tol: 0, unit: 'Hz', sol: r`Consecutive resonances of a closed pipe differ by $2f_1$: $${(2 * n + 3) * f1} - ${(2 * n + 1) * f1} = ${2 * f1}$, so $f_1 = ${f1}$ Hz.` }; }
      const L = pick(rng, 0.2, 1, 0.2); const lim = pick(rng, 1000, 5000, 1000); const f1 = 340 / (4 * L); const n = Math.floor((lim / f1 + 1) / 2); return { v, L, lim, q: r`A pipe closed at one end is ${L} m long ($v = 340\ \mathrm{m\,s^{-1}}$, no end correction). How many resonant frequencies does it have up to ${lim} Hz?`, answer: n, tol: 0, unit: '', sol: r`$f = ${R(f1, 1)}(2n - 1)$ Hz. $2n - 1\le${R(lim / f1, 2)}$ gives $n\le${R((lim / f1 + 1) / 2, 2)}$, so ${n} resonances.` };
    },
    verify: (p) => (p.v === 0 ? 340 / (4 * (p.L + p.e)) : p.v === 1 ? (2 * p.n + 1) * p.f1 : p.v === 2 ? ((2 * p.n + 3) - (2 * p.n + 1)) * p.f1 / 2 : Math.floor((p.lim * 4 * p.L / 340 + 1) / 2 + 1e-9)) },
  { id: 'wv-g09', type: 'nat', level: 3, exams: EX[3], sub: 'resonance tube',
    make(rng) {
      const f = choose(rng, [256, 320, 384, 400, 480, 512]); const vs = pick(rng, 330, 350, 2); const lam = vs / f; const e = pick(rng, 0.5, 2, 0.5) / 100; const l1 = lam / 4 - e; const l2 = 3 * lam / 4 - e; const v = int(rng, 0, 2);
      const L1 = R(l1 * 100, 1); const L2 = R(l2 * 100, 1);
      if (v === 0) return { f, L1, L2, v, q: r`A resonance tube with a ${f} Hz fork gives its first and second resonances at ${L1} cm and ${L2} cm. Find the speed of sound (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, answer: R(2 * f * (L2 - L1) / 100, 1), tol: 0.5, unit: 'm/s', sol: r`$\lambda/2 = ${L2} - ${L1} = ${R(L2 - L1, 1)}$ cm, so $\lambda = ${R(2 * (L2 - L1), 1)}$ cm. $v = f\lambda = ${f}\times${R(2 * (L2 - L1) / 100, 3)} = ${R(2 * f * (L2 - L1) / 100, 1)}\ \mathrm{m\,s^{-1}}$.` };
      if (v === 1) return { f, L1, L2, v, q: r`In a resonance tube, the first and second resonances are at ${L1} cm and ${L2} cm. Find the end correction (in cm, 1 decimal).`, answer: R((L2 - 3 * L1) / 2, 1), tol: 0.2, unit: 'cm', sol: r`$l_1 + e = \lambda/4$ and $l_2 + e = 3\lambda/4$, so $l_2 + e = 3(l_1 + e)$ and $e = (l_2 - 3l_1)/2 = (${L2} - ${R(3 * L1, 1)})/2 = ${R((L2 - 3 * L1) / 2, 1)}$ cm.` };
      return { f, L1, L2, v, q: r`In a resonance-tube experiment with a ${f} Hz fork, the first resonance is at ${L1} cm and the second at ${L2} cm. Find the wavelength (in cm, 1 decimal).`, answer: R(2 * (L2 - L1), 1), tol: 0.3, unit: 'cm', sol: r`Successive resonances are $\lambda/2$ apart: $\lambda = 2(${L2} - ${L1}) = ${R(2 * (L2 - L1), 1)}$ cm.` };
    },
    verify: (p) => (p.v === 0 ? 2 * p.f * (p.L2 - p.L1) / 100 : p.v === 1 ? (p.L2 - 3 * p.L1) / 2 : 2 * (p.L2 - p.L1)) },
  { id: 'wv-g10', type: 'nat', level: 2, exams: EX[2], sub: 'beats',
    make(rng) {
      const v = int(rng, 0, 2); const f = pick(rng, 240, 520, 8); const b = int(rng, 2, 8);
      if (v === 0) return { v, f, b, q: r`Two tuning forks of ${f} Hz and ${f + b} Hz sound together. How many beats per second are heard?`, answer: b, tol: 0, unit: 'Hz', sol: r`Beat frequency $= |${f + b} - ${f}| = ${b}$ Hz.` };
      if (v === 1) return { v, f, b, q: r`A fork of unknown frequency makes ${b} beats per second with a ${f} Hz fork. When the unknown fork is loaded with wax (which lowers its frequency), the beats become ${b - 1} per second. Find its frequency (in Hz).`, answer: f + b, tol: 0, unit: 'Hz', sol: r`The unknown frequency is $${f}\pm${b}$. If it were ${f - b}, lowering it would increase the beats. Beats decrease, so it must be ${f + b} Hz (wax lowers it towards ${f}).` };
      return { v, f, b, q: r`The third harmonic of a string vibrating at ${3 * f} Hz and a tuning fork of frequency ${3 * f + b} Hz sound together. How many beats per second are heard?`, answer: b, tol: 0, unit: 'Hz', sol: r`The third harmonic of a string with fundamental ${f} Hz is $3\times${f} = ${3 * f}$ Hz. Beats $= ${3 * f + b} - ${3 * f} = ${b}$ Hz.` };
    },
    verify: (p) => (p.v === 1 ? p.f + p.b : (p.f + p.b) - p.f) },
  { id: 'wv-g11', type: 'nat', level: 2, exams: EX[2], sub: 'Doppler effect (moving source)',
    make(rng) {
      const f = pick(rng, 300, 1000, 50); const vs = pick(rng, 10, 40, 5); const app = rng() < 0.5; const fp = app ? f * V / (V - vs) : f * V / (V + vs);
      return { f, vs, app, q: r`A source of ${f} Hz moves at ${vs} $\mathrm{m\,s^{-1}}$ ${app ? 'towards' : 'away from'} a stationary listener. Take $v = 340\ \mathrm{m\,s^{-1}}$. Find the frequency heard (in Hz, 1 decimal).`, answer: R(fp, 1), tol: 0.1, unit: 'Hz', sol: r`$f' = f\dfrac{v}{v ${app ? '-' : '+'} v_s} = ${f}\times\dfrac{340}{${app ? 340 - vs : 340 + vs}} = ${R(fp, 1)}$ Hz.`, trap: 'Approaching: subtract in the denominator.' };
    },
    verify: (p) => p.f / (1 - (p.app ? 1 : -1) * p.vs / V) },
  { id: 'wv-g12', type: 'nat', level: 2, exams: EX[2], sub: 'Doppler effect (moving listener)',
    make(rng) {
      const f = pick(rng, 300, 1000, 50); const vo = pick(rng, 10, 40, 5); const app = rng() < 0.5; const fp = app ? f * (V + vo) / V : f * (V - vo) / V;
      return { f, vo, app, q: r`A listener moves at ${vo} $\mathrm{m\,s^{-1}}$ ${app ? 'towards' : 'away from'} a stationary source of ${f} Hz. Take $v = 340\ \mathrm{m\,s^{-1}}$. Find the frequency heard (in Hz, 1 decimal).`, answer: R(fp, 1), tol: 0.1, unit: 'Hz', sol: r`$f' = f\dfrac{v ${app ? '+' : '-'} v_o}{v} = ${f}\times\dfrac{${app ? 340 + vo : 340 - vo}}{340} = ${R(fp, 1)}$ Hz.` };
    },
    verify: (p) => p.f * (1 + (p.app ? 1 : -1) * p.vo / V) },
  { id: 'wv-g13', type: 'nat', level: 3, exams: EX[3], sub: 'Doppler effect (both moving, wind)',
    make(rng) {
      const f = pick(rng, 300, 800, 50); const vs = pick(rng, 10, 30, 5); const vo = pick(rng, 5, 20, 5); const w = choose(rng, [0, 0, 5, 10]); const v = int(rng, 0, 1);
      const W = V + w;
      if (v === 0) { const fp = f * (W + vo) / (W - vs); return { f, vs, vo, w, v, q: r`A source of ${f} Hz moves towards a listener at ${vs} $\mathrm{m\,s^{-1}}$ while the listener moves towards the source at ${vo} $\mathrm{m\,s^{-1}}$.${w ? ` A wind of ${w} $\\mathrm{m\\,s^{-1}}$ blows along the line from source to listener.` : ''} Speed of sound in still air is $340\ \mathrm{m\,s^{-1}}$. Find the frequency heard (in Hz, 1 decimal).`, answer: R(fp, 1), tol: 0.2, unit: 'Hz', sol: r`${w ? `With the wind the sound moves at $V = 340 + ${w} = ${W}\\ \\mathrm{m\\,s^{-1}}$ relative to the ground in the direction of travel. The listener moves towards the source, against this flow, so the speed of the sound relative to the listener is $V + v_o$; the wavelength is $(V - v_s)/f$.` : ''} $f' = f\dfrac{${W} + ${vo}}{${W} - ${vs}} = ${f}\times\dfrac{${W + vo}}{${W - vs}} = ${R(fp, 1)}$ Hz.`, trap: 'Wind adds to the speed of sound, not to the speeds of source or listener.' }; }
      const fp = f * (W - vo) / (W + vs); return { f, vs, vo, w, v, q: r`A source of ${f} Hz moves away from a listener at ${vs} $\mathrm{m\,s^{-1}}$ while the listener moves away from the source at ${vo} $\mathrm{m\,s^{-1}}$.${w ? ` A wind of ${w} $\\mathrm{m\\,s^{-1}}$ blows along the line from the source to the listener.` : ''} Speed of sound in still air is $340\ \mathrm{m\,s^{-1}}$. Find the frequency heard (in Hz, 1 decimal).`, answer: R(fp, 1), tol: 0.2, unit: 'Hz', sol: r`Both recede. $f' = f\dfrac{${W} - ${vo}}{${W} + ${vs}} = ${f}\times\dfrac{${W - vo}}{${W + vs}} = ${R(fp, 1)}$ Hz.` };
    },
    verify: (p) => (p.v === 0 ? p.f * ((V + p.w) + p.vo) / ((V + p.w) - p.vs) : p.f * ((V + p.w) - p.vo) / ((V + p.w) + p.vs)) },
  { id: 'wv-g14', type: 'nat', level: 4, exams: EX[4], sub: 'Doppler effect and echoes',
    make(rng) {
      const f = pick(rng, 400, 1000, 100); const u = pick(rng, 5, 30, 5); const v = int(rng, 0, 2);
      if (v === 0) { const fp = f * (V + u) / (V - u); return { f, u, v, q: r`A car moving at ${u} $\mathrm{m\,s^{-1}}$ towards a large wall sounds a ${f} Hz horn. Find the frequency of the echo heard by the driver (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, answer: R(fp, 1), tol: 0.2, unit: 'Hz', sol: r`$f_{echo} = f\dfrac{v + u}{v - u} = ${f}\times\dfrac{${V + u}}{${V - u}} = ${R(fp, 1)}$ Hz.` }; }
      if (v === 1) { const b = f * V * 2 * u / (V * V - u * u); return { f, u, v, q: r`A source of ${f} Hz moves at ${u} $\mathrm{m\,s^{-1}}$ directly away from a stationary listener and towards a large wall; the listener hears both the direct sound and the echo. Find the beat frequency (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, answer: R(b, 1), tol: 0.2, unit: 'Hz', sol: r`Direct: $f_1 = fv/(v + u)$. Echo: $f_2 = fv/(v - u)$. Beats $= f_2 - f_1 = fv\cdot\dfrac{2u}{v^2 - u^2} = ${R(b, 1)}$ Hz.` }; }
      const b = 2 * f * u / V; return { f, u, v, q: r`A listener walks at ${u} $\mathrm{m\,s^{-1}}$ towards a large wall, with a stationary ${f} Hz source behind her. She hears the direct sound and the echo. Find the beat frequency (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, answer: R(b, 1), tol: 0.1, unit: 'Hz', sol: r`Direct (walking away from the source): $f(v - u)/v$. Echo (walking towards the wall's image): $f(v + u)/v$. Beats $= 2fu/v = 2\times${f}\times${u}/340 = ${R(b, 1)}$ Hz.` };
    },
    verify: (p) => (p.v === 0 ? p.f * (V + p.u) / (V - p.u) : p.v === 1 ? p.f * V / (V - p.u) - p.f * V / (V + p.u) : p.f * (V + p.u) / V - p.f * (V - p.u) / V) },
  { id: 'wv-g15', type: 'nat', level: 3, exams: EX[3], sub: 'shock waves',
    make(rng) {
      const v = int(rng, 0, 2); const M = choose(rng, [1.5, 2, 2.5, 3, 4]);
      if (v === 0) { const th = Math.asin(1 / M) * 180 / PI; return { M, v, q: r`A jet flies at Mach ${M} (that is, ${M} times the speed of sound). Find the half-angle of its Mach cone (in degrees, 1 decimal).`, answer: R(th, 1), tol: 0.1, unit: '°', sol: r`$\sin\theta = v/v_s = 1/${M}$, so $\theta = ${R(th, 1)}°$.` }; }
      if (v === 1) { const th = choose(rng, [30, 45, 60]); const vs = 340 / Math.sin(th * PI / 180); return { th, v, q: r`The Mach cone of a supersonic projectile has a half-angle of ${th}°. Taking the speed of sound as $340\ \mathrm{m\,s^{-1}}$, find the speed of the projectile (in $\mathrm{m\,s^{-1}}$, nearest whole number).`, answer: R(vs, 0), tol: 1, unit: 'm/s', sol: r`$\sin\theta = v/v_s\Rightarrow v_s = 340/\sin${th}° = ${R(vs, 0)}\ \mathrm{m\,s^{-1}}$.` }; }
      const h = pick(rng, 1000, 5000, 500); const x = h / Math.tan(Math.asin(1 / M)); const t = x / (M * 340); return { M, h, v, q: r`A jet flies horizontally at ${h} m height at Mach ${M} ($v = 340\ \mathrm{m\,s^{-1}}$). How long after it passes directly overhead does a listener on the ground hear the boom (in s, 1 decimal)?`, answer: R(t, 1), tol: 0.1, unit: 's', sol: r`$\sin\theta = 1/${M}$, so the cone reaches the ground when the jet is $x = h/\tan\theta = ${R(x, 0)}$ m past the listener. $t = x/v_s = ${R(x, 0)}/${M * 340} = ${R(t, 1)}$ s.` };
    },
    verify: (p) => (p.v === 0 ? Math.asin(1 / p.M) * 180 / PI : p.v === 1 ? 340 / Math.sin(p.th * PI / 180) : p.h / Math.tan(Math.asin(1 / p.M)) / (p.M * 340)) },
  { id: 'wv-g16', type: 'nat', level: 4, exams: EX[4], sub: 'energy of waves',
    make(rng) {
      const v = int(rng, 0, 1);
      if (v === 0) { const mu = pick(rng, 0.01, 0.05, 0.01); const f = pick(rng, 20, 100, 10); const A = pick(rng, 1, 5); const vs = pick(rng, 10, 50, 10); const P = 0.5 * mu * (2 * PI * f) ** 2 * (A / 1000) ** 2 * vs; return { v, mu, f, A, vs, q: r`A wave on a string of mass per unit length ${mu} $\mathrm{kg\,m^{-1}}$ has frequency ${f} Hz, amplitude ${A} mm and speed ${vs} $\mathrm{m\,s^{-1}}$. Find the average power it transmits, $P = \tfrac12\mu\omega^2A^2v$ (in mW, 1 decimal).`, answer: R(P * 1000, 1), tol: Math.max(0.1, P * 1000 * 0.003), unit: 'mW', sol: r`$\omega = 2\pi\times${f} = ${R(2 * PI * f, 1)}$ rad/s. $P = \tfrac12\times${mu}\times${R(2 * PI * f, 1)}^2\times(${A}\times10^{-3})^2\times${vs} = ${R(P * 1000, 1)}$ mW.` }; }
      const rho = 1.29; const vs = 340; const p0 = pick(rng, 1, 10, 1); const I = p0 * p0 / (2 * rho * vs); return { v, p0, q: r`A plane sound wave in air ($\rho = 1.29\ \mathrm{kg\,m^{-3}}$, $v = 340\ \mathrm{m\,s^{-1}}$) has a pressure amplitude of ${p0} Pa. Find its intensity $I = p_0^2/2\rho v$ (in mW/m², 2 decimals).`, answer: R(I * 1000, 2), tol: 0.02, unit: 'mW/m²', sol: r`$I = \dfrac{${p0}^2}{2\times1.29\times340} = ${fmt(I, 3)}\ \mathrm{W\,m^{-2}} = ${R(I * 1000, 2)}\ \mathrm{mW\,m^{-2}}$.` };
    },
    verify: (p) => (p.v === 0 ? 0.5 * p.mu * (2 * PI * p.f) ** 2 * (p.A / 1000) ** 2 * p.vs * 1000 : p.p0 ** 2 / (2 * 1.29 * 340) * 1000) },
  { id: 'wv-g17', type: 'nat', level: 3, exams: EX[3], sub: 'strings and sonometer',
    make(rng) {
      const v = int(rng, 0, 3);
      if (v === 0) { const f = pick(rng, 100, 400, 20); const n = choose(rng, [1.21, 1.44, 1.69, 2.25, 4]); return { v, f, n, q: r`A stretched string has fundamental ${f} Hz. Its tension is multiplied by ${n}. Find the new fundamental (in Hz, 1 decimal).`, answer: R(f * Math.sqrt(n), 1), tol: 0.1, unit: 'Hz', sol: r`$f\propto\sqrt T$: $f' = ${f}\sqrt{${n}} = ${R(f * Math.sqrt(n), 1)}$ Hz.` }; }
      if (v === 1) { const f = pick(rng, 200, 500, 20); const L = pick(rng, 40, 80, 10); const f2 = choose(rng, [1.25, 1.5, 2]); return { v, f, L, f2, q: r`A sonometer wire of length ${L} cm is in unison with a ${f} Hz fork. What length (in cm, 1 decimal) is needed to be in unison with a ${R(f * f2, 0)} Hz fork, at the same tension?`, answer: R(L / f2, 1), tol: 0.1, unit: 'cm', sol: r`$f\propto1/L$: $L' = ${L}\times${f}/${R(f * f2, 0)} = ${R(L / f2, 1)}$ cm.` }; }
      if (v === 2) { const r2 = choose(rng, [2, 3, 0.5]); return { v, r2, q: r`Two wires of the same material, length and tension have radii in the ratio $r_2/r_1 = ${r2}$. Find the ratio of fundamental frequencies $f_2/f_1$ (3 decimals).`, answer: R(1 / r2, 3), tol: 0.004, unit: '', sol: r`$\mu = \rho\pi r^2$, so $f\propto1/\sqrt\mu\propto1/r$. $f_2/f_1 = 1/${r2} = ${R(1 / r2, 3)}$.` }; }
      const L = pick(rng, 0.5, 1.5, 0.25); const f = pick(rng, 200, 400, 50); const x = choose(rng, [0.5, 0.4, 0.25, 0.2]); return { v, L, f, x, q: r`A violin string of length ${L} m has fundamental ${f} Hz. A finger is pressed so that only ${R(L * x, 3)} m vibrates (same tension). Find the new fundamental (in Hz, 1 decimal).`, answer: R(f / x, 1), tol: 0.1, unit: 'Hz', sol: r`$f\propto1/L$: $f' = ${f}\times${L}/${R(L * x, 3)} = ${R(f / x, 1)}$ Hz.` };
    },
    verify: (p) => (p.v === 0 ? p.f * Math.sqrt(p.n) : p.v === 1 ? p.L * p.f / (p.f * p.f2) : p.v === 2 ? 1 / p.r2 : p.f * p.L / (p.L * p.x)) },
  { id: 'wv-g18', type: 'nat', level: 4, exams: EX[4], sub: 'speed of sound in gases',
    make(rng) {
      const g1 = choose(rng, [['helium', 4, 5 / 3], ['hydrogen', 2, 1.4], ['neon', 20, 5 / 3], ['argon', 40, 5 / 3], ['carbon dioxide', 44, 1.3], ['oxygen', 32, 1.4]]);
      const g2 = choose(rng, [['nitrogen', 28, 1.4], ['air', 29, 1.4], ['oxygen', 32, 1.4]]);
      const ratio = Math.sqrt(g1[2] * g2[1] / (g2[2] * g1[1]));
      return { g1, g2, q: r`Find the ratio of the speed of sound in ${g1[0]} ($M = ${g1[1]}$ g/mol, $\gamma = ${R(g1[2], 3)}$) to that in ${g2[0]} ($M = ${g2[1]}$ g/mol, $\gamma = ${R(g2[2], 3)}$) at the same temperature (3 decimals).`, answer: R(ratio, 3), tol: Math.max(0.004, ratio * 0.002), unit: '', sol: r`$v\propto\sqrt{\gamma/M}$. Ratio $=\sqrt{\dfrac{${R(g1[2], 3)}/${g1[1]}}{${R(g2[2], 3)}/${g2[1]}}} = ${R(ratio, 3)}$.` };
    },
    verify: (p) => Math.sqrt((p.g1[2] / p.g1[1]) / (p.g2[2] / p.g2[1])) },
  { id: 'wv-g19', type: 'nat', level: 3, exams: EX[3], sub: 'pipes and temperature',
    make(rng) {
      const f = pick(rng, 300, 900, 50); const t1 = pick(rng, 0, 20, 5); const t2 = t1 + pick(rng, 10, 40, 10); const fp = f * Math.sqrt((273 + t2) / (273 + t1));
      return { f, t1, t2, q: r`An organ pipe sounds ${f} Hz when the air is at ${t1} °C. Find the frequency when the air is at ${t2} °C (ignore expansion of the pipe; in Hz, 1 decimal).`, answer: R(fp, 1), tol: 0.3, unit: 'Hz', sol: r`$f\propto v\propto\sqrt T$ (kelvin). $f' = ${f}\sqrt{${273 + t2}/${273 + t1}} = ${R(fp, 1)}$ Hz.`, trap: 'Kelvin, not °C.' };
    },
    verify: (p) => p.f * Math.sqrt((p.t2 + 273) / (p.t1 + 273)) },
  { id: 'wv-g20', type: 'nat', level: 4, exams: EX[4], sub: 'composite strings',
    make(rng) {
      const T = pick(rng, 50, 200, 50); const mu1 = pick(rng, 0.005, 0.02, 0.005); const n = choose(rng, [4, 9, 16]); const mu2 = mu1 * n; const L1 = pick(rng, 0.5, 2, 0.5); const L2 = pick(rng, 0.5, 2, 0.5); const v = int(rng, 0, 1);
      const v1 = Math.sqrt(T / mu1); const v2 = Math.sqrt(T / mu2);
      if (v === 0) { const t = (L1 / v1 + L2 / v2) * 1000; return { T, mu1, mu2, L1, L2, v, q: r`Two wire segments are joined and stretched with tension ${T} N. The first is ${L1} m long with $\mu = ${mu1}\ \mathrm{kg\,m^{-1}}$; the second is ${L2} m long with $\mu = ${R(mu2, 4)}\ \mathrm{kg\,m^{-1}}$. How long does a pulse take to travel the full length (in ms, 1 decimal)?`, answer: R(t, 1), tol: 0.2, unit: 'ms', sol: r`$v_1 = \sqrt{${T}/${mu1}} = ${R(v1, 1)}$ and $v_2 = \sqrt{${T}/${R(mu2, 4)}} = ${R(v2, 1)}\ \mathrm{m\,s^{-1}}$. $t = ${L1}/${R(v1, 1)} + ${L2}/${R(v2, 1)} = ${R(t, 1)}$ ms.` }; }
      const lam1 = pick(rng, 0.2, 1, 0.2); return { T, mu1, mu2, L1, L2, lam1, n, v, q: r`A wave of wavelength ${lam1} m on a string passes into a second string, joined to it, with ${n} times the mass per unit length (same tension). Find the wavelength in the second string (in m, 3 decimals).`, answer: R(lam1 / Math.sqrt(n), 3), tol: 0.004, unit: 'm', sol: r`The frequency is unchanged and $v\propto1/\sqrt\mu$, so $\lambda_2 = \lambda_1/\sqrt{${n}} = ${R(lam1 / Math.sqrt(n), 3)}$ m.` };
    },
    verify: (p) => (p.v === 0 ? (p.L1 / Math.sqrt(p.T / p.mu1) + p.L2 / Math.sqrt(p.T / p.mu2)) * 1000 : p.lam1 * Math.sqrt(p.mu1 / p.mu2)) },
  { id: 'wv-g21', type: 'nat', level: 4, exams: EX[4], sub: 'Doppler effect with circular and angled motion',
    make(rng) {
      const f = pick(rng, 400, 1000, 100); const u = pick(rng, 17, 51, 17); const v = int(rng, 0, 1);
      if (v === 0) { const ratio = (V + u) / (V - u); return { f, u, v, q: r`A source of ${f} Hz moves round a circle at ${u} $\mathrm{m\,s^{-1}}$. A distant listener in the plane of the circle hears a maximum and a minimum frequency. Find $f_{max}/f_{min}$ (3 decimals; $v = 340\ \mathrm{m\,s^{-1}}$).`, answer: R(ratio, 3), tol: 0.004, unit: '', sol: r`$f_{max} = fv/(v - u)$ and $f_{min} = fv/(v + u)$. Ratio $=(v + u)/(v - u) = ${V + u}/${V - u} = ${R(ratio, 3)}$.` }; }
      const th = choose(rng, [30, 45, 60]); const fp = f * V / (V - u * Math.cos(th * PI / 180)); return { f, u, th, v, q: r`A source of ${f} Hz moves at ${u} $\mathrm{m\,s^{-1}}$ at ${th}° to the line joining it to a stationary listener and is approaching her. Find the frequency heard (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, answer: R(fp, 1), tol: 0.2, unit: 'Hz', sol: r`Only the component along the line of sight counts: $u\cos${th}° = ${R(u * Math.cos(th * PI / 180), 2)}\ \mathrm{m\,s^{-1}}$. $f' = ${f}\times\dfrac{340}{340 - ${R(u * Math.cos(th * PI / 180), 2)}} = ${R(fp, 1)}$ Hz.` };
    },
    verify: (p) => (p.v === 0 ? (V + p.u) / (V - p.u) : p.f * V / (V - p.u * Math.cos(p.th * PI / 180))) },
  { id: 'wv-g22', type: 'mcq', level: 2, exams: EX[2], sub: 'pipes',
    make(rng) {
      const v = int(rng, 0, 3); let q; let ans; let wr; let sol;
      if (v === 0) { const n = int(rng, 2, 5); const f = pick(rng, 100, 300, 50); ans = `${(2 * n - 1) * f} Hz`; wr = [`${n * f} Hz`, `${(2 * n) * f} Hz`, `${(n + 1) * f} Hz`]; q = r`A pipe closed at one end has fundamental ${f} Hz. Which of these is the frequency of its harmonic number ${2 * n - 1}?`; sol = r`Closed-pipe harmonics are $(2n - 1)f_1$. Harmonic ${2 * n - 1} is $${2 * n - 1}\times${f} = ${(2 * n - 1) * f}$ Hz.`; }
      else if (v === 1) { const f = pick(rng, 100, 300, 50); ans = `${f} Hz`; wr = [`${2 * f} Hz`, `${f / 2} Hz`, `${4 * f} Hz`]; q = r`An open pipe has fundamental ${f} Hz. It is dipped vertically so that exactly half of it is in water (the pipe is now closed at the water end). Its fundamental now is`; sol = r`Open: $v/2L = ${f}$. Dipped: closed pipe of length $L/2$: $v/(4\cdot L/2) = v/2L = ${f}$ Hz. Unchanged.`; }
      else if (v === 2) { const f = pick(rng, 100, 300, 50); ans = `${f / 2} Hz`; wr = [`${f} Hz`, `${2 * f} Hz`, `${f / 4} Hz`]; q = r`An open pipe has fundamental ${f} Hz. One end is now closed with a cap (same length). The new fundamental is`; sol = r`Open: $v/2L = ${f}$. Closed: $v/4L = ${f}/2 = ${f / 2}$ Hz. Closing an end lowers the pitch by an octave.`; }
      else { const f = pick(rng, 100, 300, 50); const n = int(rng, 2, 4); ans = `${n * f} Hz`; wr = [`${(2 * n - 1) * f} Hz`, `${(n + 1) * f} Hz`, `${(n - 1) * f} Hz`]; q = r`An open pipe has fundamental ${f} Hz. The frequency of its harmonic number ${n} is`; sol = r`Open-pipe harmonics are $nf_1$: $${n}\times${f} = ${n * f}$ Hz.`; }
      const o = shuffleOpts(rng, ans, wr);
      return { v, q, options: o.options, answer: o.answer, sol, trap: 'Open pipe: all harmonics; closed pipe: odd harmonics only.' };
    },
    verify: null },
  { id: 'wv-g23', type: 'nat', level: 3, exams: EX[3], sub: 'standing waves',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const A = pick(rng, 1, 6); const frac = choose(rng, [[12, 30], [8, 45], [6, 60], [4, 90]]); const amp = 2 * A * Math.sin(2 * PI / frac[0]); return { v, A, frac, q: r`Two travelling waves of amplitude ${A} mm form a standing wave. Find the amplitude of vibration at a point $\lambda/${frac[0]}$ from a node (in mm, 2 decimals).`, answer: R(amp, 2), tol: 0.02, unit: 'mm', sol: r`Amplitude $= 2A\sin(2\pi x/\lambda) = ${2 * A}\sin(2\pi/${frac[0]}) = ${2 * A}\sin${frac[1]}° = ${R(amp, 2)}$ mm.` }; }
      if (v === 1) { const kk = pick(rng, 2, 10); const w = kk * pick(rng, 10, 50, 10); return { v, kk, w, q: r`A standing wave on a string is $y = 0.05\sin(${kk}x)\cos(${w}t)$ (SI units). Find the speed of the travelling waves that make it (in $\mathrm{m\,s^{-1}}$).`, answer: w / kk, tol: 0, unit: 'm/s', sol: r`The speed of each travelling wave is $v = \omega/k = ${w}/${kk} = ${w / kk}\ \mathrm{m\,s^{-1}}$.` }; }
      const f = pick(rng, 340, 1360, 170); const lam = 340 / f; return { v, f, q: r`A plane sound wave of frequency ${f} Hz ($v = 340\ \mathrm{m\,s^{-1}}$) reflects from a rigid wall at normal incidence. Find the distance (in cm, 1 decimal) from the wall to the first point of minimum pressure variation.`, answer: R(lam / 4 * 100, 1), tol: 0.1, unit: 'cm', sol: r`$\lambda = 340/${f} = ${R(lam, 3)}$ m. The wall is a displacement node and so a pressure antinode; the first pressure node is $\lambda/4 = ${R(lam / 4 * 100, 1)}$ cm from it.`, trap: 'At a rigid wall the pressure variation is largest.' };
    },
    verify: (p) => (p.v === 0 ? 2 * p.A * Math.sin(2 * PI / p.frac[0]) : p.v === 1 ? p.w / p.kk : 340 / p.f / 4 * 100) },
];


// ---------- Expansion (2026-11-22): more hard items, matches, passages and templates ----------
const xs = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const XCUET = false;
const xex = (l, t) => (l <= 2 ? ['keam', 'cusat', 'comedk', 'jee-main', 'neet'] : l === 3 ? ['jee-main', 'neet', 'keam', 'comedk'] : l === 4 ? ['jee-main', 'jee-adv'] : ['jee-adv']).concat(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : []);
let xk = 0; let xc = 0;
const xid = () => `wv-x${String(++xk).padStart(3, '0')}`;
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
const XV = 340; const XPI = Math.PI;

const xgroups = {
  mw1: { title: 'Frequencies in pipes of length $L$',
    list1: ['A. Fundamental of a pipe open at both ends', 'B. Fundamental of a pipe closed at one end', 'C. Second overtone of a pipe closed at one end', 'D. Third harmonic of a pipe open at both ends'],
    list2: [r`p. $\dfrac{v}{2L}$`, r`q. $\dfrac{v}{4L}$`, r`r. $\dfrac{5v}{4L}$`, r`s. $\dfrac{3v}{2L}$`, r`t. $\dfrac{v}{L}$`] },
  mw2: { title: 'Reading a wave equation',
    list1: [r`A. Frequency of $y = 0.05\sin(200\pi t - 4\pi x)$ (SI)`, r`B. Wavelength of the same wave`, r`C. Speed of the same wave`, r`D. Maximum speed of a particle of the medium`],
    list2: ['p. 100 Hz', 'q. 0.5 m', 'r. 50 m/s', r`s. $10\pi$ m/s`, 't. 0.01 s'] },
  mw3: { title: 'Doppler shifts (source 1000 Hz, speed of sound 340 m/s)',
    list1: ['A. Source approaches a stationary observer at 34 m/s', 'B. Source recedes from a stationary observer at 34 m/s', 'C. Observer approaches a stationary source at 34 m/s', 'D. Observer recedes from a stationary source at 34 m/s'],
    list2: ['p. 1111 Hz', 'q. 909 Hz', 'r. 1100 Hz', 's. 900 Hz', 't. 1000 Hz'] },
  mw4: { title: 'Sound level changes',
    list1: ['A. The intensity is doubled', 'B. The intensity is multiplied by 10', 'C. The distance from a point source is doubled', 'D. 100 identical sources sound together instead of one'],
    list2: ['p. increases by 3 dB', 'q. increases by 10 dB', 'r. decreases by 6 dB', 's. increases by 20 dB', 't. unchanged'] },
  mw5: { title: 'A string fixed at both ends (fundamental $f$, length $L$)',
    list1: ['A. Frequency of the second overtone', 'B. Number of nodes (ends included) in the second overtone', 'C. Wavelength of the second harmonic', 'D. Frequency of the second harmonic'],
    list2: [r`p. $3f$`, 'q. 4', 'r. $L$', r`s. $2f$`] },
  mw6: { title: 'Ratio of the speed of sound',
    list1: ['A. Hydrogen ($M = 2$, $\\gamma = 1.4$) to air ($M = 29$, $\\gamma = 1.4$), same temperature', 'B. Helium ($M = 4$, $\\gamma = 5/3$) to air, same temperature', 'C. Air at four times the absolute temperature to air', 'D. Air at double the pressure (same temperature) to air'],
    list2: ['p. 3.81', 'q. 2.94', 'r. 2', 's. 1', 't. 1.41'] },
  mw7: { title: 'A wave going from a string $\\mu$ into a string $4\\mu$ (same tension)',
    list1: ['A. Ratio of wave speeds, $v_2/v_1$', 'B. Reflected amplitude / incident amplitude', 'C. Transmitted amplitude / incident amplitude', 'D. Fraction of the incident power that is transmitted'],
    list2: [r`p. $\tfrac12$`, r`q. $-\tfrac13$`, r`r. $\tfrac23$`, r`s. $\tfrac89$`, r`t. $\tfrac19$`] },
  mw8: { title: 'Fundamental frequency of a stretched string',
    list1: ['A. The tension is multiplied by 4', 'B. The wire is replaced by one of double diameter (same material, same tension and length)', 'C. The length is halved and the tension doubled', 'D. The tension is multiplied by 9 and the length by 3'],
    list2: ['p. frequency × 2', r`q. frequency × $\tfrac12$`, r`r. frequency × $2\sqrt2$`, 's. frequency unchanged', 't. frequency × 4'] },
  pw1: { title: 'A plucked string in its third harmonic',
    passage: r`<p>A string of mass per unit length $0.04\ \mathrm{kg\,m^{-1}}$ is stretched with a tension of 64 N between two fixed points 1.2 m apart. It vibrates in its third harmonic, and the amplitude of each antinode is 3.0 mm.</p>` },
  pw2: { title: 'A passing ambulance',
    passage: r`<p>An ambulance siren emits a steady 700 Hz. It travels at $20\ \mathrm{m\,s^{-1}}$ along a straight road, past a stationary observer standing at the roadside. Take the speed of sound as $340\ \mathrm{m\,s^{-1}}$ in still air.</p>` },
};

const xitems = [
  // ---------- Level 2 ----------
  xnat(2, 'wave equation', r`A travelling wave is $y = 0.02\sin(10\pi t - 2\pi x)$ in SI units. Find its speed (in $\mathrm{m\,s^{-1}}$).`, 10 * XPI / (2 * XPI), 0, 0,
    r`Compare with $y = A\sin(\omega t - kx)$: $\omega = 10\pi$, $k = 2\pi$. $v = \dfrac\omega k = \dfrac{10\pi}{2\pi} = 5\ \mathrm{m\,s^{-1}}$, in the $+x$ direction.`, { unit: 'm/s' }),
  xmcq(2, 'types of waves', r`Which of these waves cannot be polarised?`, 'Sound waves in air', ['Light waves', 'Transverse waves on a string', 'Radio waves'],
    r`Polarisation needs a transverse vibration whose direction can be restricted. In air the particles move along the direction of travel, so sound is longitudinal and cannot be polarised.`),
  xnat(2, 'speed on a string', r`A string of mass per unit length $0.04\ \mathrm{kg\,m^{-1}}$ is under a tension of 100 N. Find the speed of a transverse wave on it (in $\mathrm{m\,s^{-1}}$).`, Math.sqrt(100 / 0.04), 0, 0,
    r`$v = \sqrt{\dfrac T\mu} = \sqrt{\dfrac{100}{0.04}} = \sqrt{2500} = 50\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  xmcq(2, 'closed pipe', r`A pipe closed at one end produces`, 'only odd harmonics of its fundamental', ['all harmonics', 'only even harmonics', 'only the fundamental'],
    r`A closed end is a node and an open end an antinode, so $L = \dfrac{(2n - 1)\lambda}{4}$ and the frequencies are $f, 3f, 5f, \ldots$ An open pipe gives all harmonics.`),
  xnat(2, 'intensity and loudness', r`A sound has intensity $10^{-6}\ \mathrm{W\,m^{-2}}$. Find its level in decibels (reference $10^{-12}\ \mathrm{W\,m^{-2}}$).`, 10 * Math.log10(1e-6 / 1e-12), 0, 0,
    r`$\beta = 10\log_{10}\dfrac{I}{I_0} = 10\log_{10}10^{6} = 60$ dB.`, { unit: 'dB' }),
  xmcq(2, 'speed of sound', r`The speed of sound in air increases when`, 'the temperature rises', ['the pressure rises at constant temperature', 'the frequency increases', 'the amplitude increases'],
    r`$v = \sqrt{\gamma P/\rho}$. At a fixed temperature, $P/\rho$ is constant (a change of pressure changes the density in the same ratio), so pressure does not matter. Frequency and amplitude do not affect the speed. A higher temperature lowers $\rho$ at the same $P$, and $v\propto\sqrt T$.`, { trap: 'Pressure alone does not change the speed.' }),

  // ---------- Level 3 ----------
  xnat(3, 'closed pipe', r`A pipe 0.5 m long is closed at one end. Find the frequency of its second overtone (in Hz; $v = 340\ \mathrm{m\,s^{-1}}$).`, 5 * XV / (4 * 0.5), 0, 0,
    r`Fundamental $f_1 = \dfrac{v}{4L} = \dfrac{340}{2} = 170$ Hz. Overtones: $3f_1$ (first), $5f_1$ (second). $5\times170 = 850$ Hz.`, { unit: 'Hz', trap: 'Second overtone of a closed pipe is the 5th harmonic, not the 3rd.' }),
  xnat(3, 'open pipe', r`An open pipe is 0.85 m long. Find the frequency of its first overtone (in Hz; $v = 340\ \mathrm{m\,s^{-1}}$).`, 2 * XV / (2 * 0.85), 0, 0,
    r`Open pipe: $f_n = \dfrac{nv}{2L}$. The first overtone is $n = 2$: $f = \dfrac{340}{0.85} = 400$ Hz.`, { unit: 'Hz' }),
  xnat(3, 'strings', r`The tension in a stretched wire is raised by 21 %. Its fundamental frequency was 100 Hz. Find the new fundamental frequency (in Hz).`, 100 * Math.sqrt(1.21), 0, 0,
    r`$f\propto\sqrt T$, so $f' = 100\sqrt{1.21} = 110$ Hz. A 21 % rise in tension gives a 10 % rise in frequency.`, { unit: 'Hz' }),
  xnat(3, 'Doppler effect', r`A source of frequency 500 Hz moves towards a stationary observer at $34\ \mathrm{m\,s^{-1}}$. Find the frequency heard (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, 500 * 340 / (340 - 34), 0.1, 1,
    r`$f' = f\dfrac{v}{v - v_s} = 500\times\dfrac{340}{306} = 555.6$ Hz.`, { unit: 'Hz' }),
  xnat(3, 'Doppler effect', r`An observer walks away from a stationary 400 Hz source at $17\ \mathrm{m\,s^{-1}}$ ($v = 340\ \mathrm{m\,s^{-1}}$). Find the frequency heard (in Hz).`, 400 * (340 - 17) / 340, 0, 0,
    r`$f' = f\dfrac{v - v_o}{v} = 400\times\dfrac{323}{340} = 380$ Hz.`, { unit: 'Hz' }),
  xnat(3, 'interference', r`Two waves of amplitudes in the ratio $3:1$ interfere. Find the ratio $I_{max}/I_{min}$.`, (3 + 1) ** 2 / (3 - 1) ** 2, 0, 0,
    r`$A_{max} = 3 + 1 = 4$, $A_{min} = 3 - 1 = 2$. Intensity goes as amplitude squared: $\dfrac{16}{4} = 4$.`, { trap: 'Intensity ratio is the square of the amplitude sums.' }),
  xnat(3, 'intensity and loudness', r`The sound level of a point source is 80 dB at 10 m. Find the level at 40 m (in dB, 1 decimal; no absorption).`, 80 - 20 * Math.log10(4), 0.1, 1,
    r`$I\propto1/r^2$. Moving 4 times farther cuts $I$ by 16: $\Delta\beta = 10\log_{10}16 = 12.04$ dB. New level $= 80 - 12.04 = 68.0$ dB.`, { unit: 'dB' }),
  xnat(3, 'intensity and loudness', r`One machine gives a sound level of 60 dB at a point. Two identical machines running together give what level there (in dB, 1 decimal)?`, 60 + 10 * Math.log10(2), 0.1, 1,
    r`Intensities add: $2I$. $\beta = 60 + 10\log_{10}2 = 63.0$ dB, not 120 dB.`, { unit: 'dB', trap: 'Levels do not add: intensities do.' }),
  xnat(3, 'speed of sound in gases', r`Find the ratio of the speed of sound in hydrogen ($M = 2$) to that in air ($M = 29$) at the same temperature, if both have $\gamma = 1.4$ (2 decimals).`, Math.sqrt(29 / 2), 0.01, 2,
    r`$v = \sqrt{\gamma RT/M}$. Same $\gamma$ and $T$: $\dfrac{v_H}{v_{air}} = \sqrt{\dfrac{29}{2}} = 3.81$.`),
  xnat(3, 'speed of sound', r`The speed of sound in air at 0 °C is $331\ \mathrm{m\,s^{-1}}$. Find the speed at 40 °C (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, 331 * Math.sqrt(313 / 273), 0.3, 1,
    r`$v\propto\sqrt T$ with $T$ in kelvin: $v = 331\sqrt{\dfrac{313}{273}} = 354.4\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Use kelvin, not celsius.' }),
  xnat(3, 'end correction', r`In a resonance tube experiment with a 500 Hz fork, the first resonance is at 16.0 cm and the second at 51.0 cm. Find the end correction (in cm, 1 decimal).`, (51 - 3 * 16) / 2, 0.05, 1,
    r`$L_1 + e = \dfrac\lambda4$ and $L_2 + e = \dfrac{3\lambda}4$. Subtract: $\dfrac\lambda2 = 35$ cm. So $L_1 + e = 17.5$ cm and $e = 1.5$ cm. (Also $e = \dfrac{L_2 - 3L_1}{2} = 1.5$ cm; the speed is $500\times0.70 = 350\ \mathrm{m\,s^{-1}}$.)`, { unit: 'cm' }),
  xnat(3, 'standing waves', r`Two successive harmonics of a string fixed at both ends are 120 Hz and 160 Hz, with none between them. Find its fundamental frequency (in Hz).`, 160 - 120, 0, 0,
    r`Harmonics are $nf_1$ and $(n+1)f_1$, so the difference is $f_1 = 40$ Hz (they are the 3rd and 4th harmonics).`, { unit: 'Hz' }),
  xnat(3, 'waves on a rope', r`A heavy uniform rope hangs from a ceiling. Find the speed of a transverse pulse at a point 2.5 m above its free lower end (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, Math.sqrt(9.8 * 2.5), 0.02, 2,
    r`The tension at a point is the weight of the rope below it, $T = \mu xg$, so $v = \sqrt{T/\mu} = \sqrt{gx} = \sqrt{9.8\times2.5} = 4.95\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  xnat(3, 'Doppler effect', r`A siren emitting 600 Hz moves towards a stationary observer at $20\ \mathrm{m\,s^{-1}}$ and then, after passing, moves away at the same speed. Find the ratio (frequency heard before passing)/(frequency heard after) (3 decimals). $v = 340\ \mathrm{m\,s^{-1}}$.`, 360 / 320, 0.002, 3,
    r`Before: $f\dfrac{v}{v - v_s} = f\dfrac{340}{320}$. After: $f\dfrac{340}{360}$. Ratio $= \dfrac{360}{320} = 1.125$.`),
  xnat(3, 'energy of waves', r`A 2 mm amplitude wave of frequency 50 Hz runs on a string of mass per unit length $0.02\ \mathrm{kg\,m^{-1}}$ at $40\ \mathrm{m\,s^{-1}}$. Find the average power it carries (in W, 3 decimals).`, 0.5 * 0.02 * (2 * XPI * 50) ** 2 * (2e-3) ** 2 * 40, 0.002, 3,
    r`$P = \tfrac12\mu\omega^2A^2v = \tfrac12\times0.02\times(314.2)^2\times(0.002)^2\times40 = 0.158$ W.`, { unit: 'W' }),
  xnat(3, 'sound level', r`The sound level for one person talking is 50 dB. Find the level when a crowd of 1000 such people talk together (in dB).`, 50 + 10 * Math.log10(1000), 0, 0,
    r`Intensity is multiplied by 1000: $\Delta\beta = 10\log_{10}1000 = 30$ dB. Level $= 80$ dB.`, { unit: 'dB' }),
  xnat(3, 'phase and path', r`Two points on a wave of wavelength 1.5 m are 0.25 m apart along the direction of travel. Find the phase difference between them (in degrees).`, 360 * 0.25 / 1.5, 0, 0,
    r`$\Delta\varphi = \dfrac{2\pi}{\lambda}\Delta x$, i.e. $360^\circ\times\dfrac{0.25}{1.5} = 60^\circ$.`, { unit: '°' }),
  xmt(3, 'pipes', 'mw1', r`Match each with its frequency, for a pipe of length $L$ and speed of sound $v$.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`Open: $f_n = \dfrac{nv}{2L}$, so fundamental $\dfrac{v}{2L}$ (p), third harmonic $\dfrac{3v}{2L}$ (s). Closed: $\dfrac{v}{4L}$ (q) and odd multiples: first overtone $3\times$, second overtone $5\times$: $\dfrac{5v}{4L}$ (r).`),
  xmt(3, 'wave equation', 'mw2', r`Match each quantity for $y = 0.05\sin(200\pi t - 4\pi x)$ (SI) with its value.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-t, B-q, C-r, D-s'],
    r`$\omega = 200\pi$ gives $f = 100$ Hz (p). $k = 4\pi$ gives $\lambda = \dfrac{2\pi}{k} = 0.5$ m (q). $v = f\lambda = 50$ m/s (r). Maximum particle speed $A\omega = 0.05\times200\pi = 10\pi$ m/s (s). The period 0.01 s (t) is not asked.`),
  xasrt(3, 'standing waves', r`In a stationary wave on a string, no energy is transported along the string.`, r`The two travelling waves forming it carry equal energy in opposite directions.`, 0,
    r`The average energy flows of the two opposite travelling waves cancel, so the net flow is zero. Energy only sloshes between kinetic and potential forms in each loop. R explains A.`),
  xstm(3, 'Doppler effect', r`The frequency heard by a stationary observer from a moving source depends on the speed of the source relative to the medium.`, r`When the observer, not the source, moves, the wavelength in the medium is unchanged.`, 0,
    r`I: the source's motion changes the wavelength in the medium, $\lambda' = (v - v_s)/f$. II: the observer's motion changes only the rate at which crests are met; the wavelength is unchanged. Both true.`),
  xmcq(3, 'sound properties', r`Which of these is NOT correct for a stationary wave on a string fixed at both ends?`, 'All points between two successive nodes vibrate in opposite phase', ['Nodes are separated by half a wavelength', 'All points between two successive nodes vibrate in phase', 'The amplitude differs from point to point'],
    r`Points in the same loop vibrate in phase (they all pass the mean position together); points in adjacent loops are in opposite phase. So the first option is wrong, the NOT-correct one.`, { trap: 'Read the NOT.' }),

  // ---------- Level 4 ----------
  xnat(4, 'Doppler effect and beats', r`A source of 680 Hz moves directly towards a large wall at $17\ \mathrm{m\,s^{-1}}$. An observer stands behind the source, on the line from the wall, and hears the sound directly and after reflection. Find the beat frequency (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, 680 * 340 / (340 - 17) - 680 * 340 / (340 + 17), 0.2, 1,
    r`Reflected sound: the wall sees the source approaching, $f_r = \dfrac{680\times340}{340 - 17} = 715.8$ Hz (a stationary wall reflects the same frequency). Direct sound: the source recedes from the observer, $f_d = \dfrac{680\times340}{340 + 17} = 647.6$ Hz. Beats $= 715.8 - 647.6 = 68.2$ Hz.`, { unit: 'Hz' }),
  xnat(4, 'beats', r`A tuning fork X and a 384 Hz fork give 6 beats per second. When X is filed a little, the beats become 8 per second. Find the original frequency of X (in Hz).`, 390, 0, 0,
    r`X is either 378 or 390 Hz. Filing raises the frequency of X. If X were 378 Hz, filing would bring it closer to 384 and the beats would fall. They rise, so X is above 384: 390 Hz.`, { unit: 'Hz', trap: 'Filing raises, waxing lowers the frequency.' }),
  xnat(4, 'sonometer', r`A sonometer wire carrying a metal block of density $8000\ \mathrm{kg\,m^{-3}}$ has a fundamental frequency of 300 Hz in air. The block is now immersed in water. Find the new frequency (in Hz, 1 decimal).`, 300 * Math.sqrt(1 - 1 / 8), 0.2, 1,
    r`In air the tension is $mg$. In water the buoyant force removes the fraction $\dfrac{\rho_w}{\rho} = \dfrac18$: $T' = \dfrac78T$. $f' = 300\sqrt{\dfrac78} = 280.6$ Hz.`, { unit: 'Hz' }),
  xnat(4, 'closed pipe', r`An organ pipe open at both ends has a fundamental of 300 Hz. One end is now closed. Find the frequency of the second overtone of the closed pipe (in Hz).`, 5 * 150, 0, 0,
    r`Closed pipe fundamental $= \dfrac{v}{4L} = \dfrac12\times\dfrac{v}{2L} = 150$ Hz. Second overtone $= 5\times150 = 750$ Hz.`, { unit: 'Hz' }),
  xnat(4, 'pipes', r`A pipe's fundamental is 500 Hz at 27 °C. Find the new fundamental when the air is at 47 °C (in Hz, 1 decimal; ignore the expansion of the pipe).`, 500 * Math.sqrt(320 / 300), 0.2, 1,
    r`$f = \dfrac{v}{4L}$ or $\dfrac{v}{2L}$, so $f\propto v\propto\sqrt T$. $f' = 500\sqrt{\dfrac{320}{300}} = 516.4$ Hz.`, { unit: 'Hz' }),
  xnat(4, 'intensity and loudness', r`An isotropic point source radiates 1.0 W of sound. Find the sound level at 5.0 m (in dB, nearest integer; $I_0 = 10^{-12}\ \mathrm{W\,m^{-2}}$).`, 10 * Math.log10(1 / (4 * XPI * 25) / 1e-12), 0.5, 0,
    r`$I = \dfrac{P}{4\pi r^2} = \dfrac{1}{4\pi\times25} = 3.18\times10^{-3}\ \mathrm{W\,m^{-2}}$. $\beta = 10\log_{10}\dfrac{3.18\times10^{-3}}{10^{-12}} = 10\times9.50 = 95$ dB.`, { unit: 'dB' }),
  xnat(4, 'Doppler effect', r`A source of 600 Hz moves at $20\ \mathrm{m\,s^{-1}}$ towards a point, while an observer moves away from that point in the same direction at $30\ \mathrm{m\,s^{-1}}$ (the source is chasing the observer along a line). Find the frequency heard (in Hz, 2 decimals; $v = 340$).`, 600 * (340 - 30) / (340 - 20), 0.02, 2,
    r`Both move in the same direction, source behind the observer. $f' = f\dfrac{v - v_o}{v - v_s} = 600\times\dfrac{310}{320} = 581.25$ Hz.`, { unit: 'Hz', trap: 'Observer moving away lowers the numerator; source moving towards lowers the denominator.' }),
  xnat(4, 'Doppler effect', r`A source of 1000 Hz moves at $40\ \mathrm{m\,s^{-1}}$ along a straight line. A stationary observer on a line making $60^\circ$ with the velocity (the direction from source to observer) hears it at a certain instant. Find the frequency heard (in Hz, 1 decimal; $v = 340$).`, 1000 * 340 / (340 - 40 * Math.cos(XPI / 3)), 0.2, 1,
    r`Only the component of the source velocity along the line to the observer matters: $40\cos60^\circ = 20\ \mathrm{m\,s^{-1}}$. $f' = \dfrac{1000\times340}{340 - 20} = 1062.5$ Hz.`, { unit: 'Hz' }),
  xnat(4, 'standing waves', r`A standing wave on a string is $y = 0.01\sin\left(\dfrac{\pi x}{2}\right)\cos(100\pi t)$ (SI). Find the speed of the travelling waves that form it (in $\mathrm{m\,s^{-1}}$).`, 100 * XPI / (XPI / 2), 0, 0,
    r`Compare with $y = 2A\sin kx\cos\omega t$: $k = \dfrac\pi2$ and $\omega = 100\pi$. $v = \dfrac\omega k = \dfrac{100\pi}{\pi/2} = 200\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  xnat(4, 'pipes', r`A pipe closed at one end has a fundamental frequency of 85 Hz ($v = 340\ \mathrm{m\,s^{-1}}$). How many of its harmonics lie in the audible range up to 20 000 Hz?`, ((Math.floor(20000 / 85) + 1) / 2) | 0, 0, 0,
    r`Only odd multiples occur: $85, 255, 425, \ldots, 85(2n - 1)$. The largest odd multiple not above 20 000: $20\,000/85 = 235.3$, so the largest odd number is 235. The odd numbers 1, 3, ..., 235 number $\dfrac{235 + 1}{2} = 118$.`, { trap: 'Count odd multiples only.' }),
  xnat(4, 'resonance tube', r`A pipe closed at one end resonates at 300 Hz and at the next higher frequency 500 Hz, with none between. Find the length of the pipe (in m, 2 decimals; $v = 340\ \mathrm{m\,s^{-1}}$).`, 340 / (4 * 100), 0.005, 2,
    r`The ratio $3:5$ shows odd harmonics, so the pipe is closed. The gap between neighbours is $2f_1 = 200$ Hz, so $f_1 = 100$ Hz. $L = \dfrac{v}{4f_1} = \dfrac{340}{400} = 0.85$ m. (An open pipe would give a gap of $f_1$ and ratio $n:(n+1)$.)`, { unit: 'm' }),
  xnat(4, 'intensity and loudness', r`A long straight line source (like a busy road) radiates sound uniformly so that intensity falls as $1/r$. The level is 90 dB at 10 m. Find the level at 100 m (in dB).`, 90 - 10 * Math.log10(10), 0, 0,
    r`For a line source $I\propto1/r$, so a tenfold distance cuts $I$ by 10: $\Delta\beta = -10$ dB. Level $= 80$ dB. (For a point source it would have fallen by 20 dB.)`, { unit: 'dB', trap: 'Line source: 1/r. Point source: 1/r².' }),
  xnat(4, 'beats and reflection', r`A car moves at $10\ \mathrm{m\,s^{-1}}$ towards a stationary source of 1700 Hz. It reflects the sound back to the source's side. A listener beside the source hears the source and the reflected sound together. Find the beat frequency (in Hz, 1 decimal; $v = 340\ \mathrm{m\,s^{-1}}$).`, 1700 * 350 / 330 - 1700, 0.2, 1,
    r`The car meets crests at $f_1 = f\dfrac{v + u}{v} = 1700\times\dfrac{350}{340}$. It re-emits this frequency as a moving source: $f_2 = f_1\dfrac{v}{v - u} = 1700\times\dfrac{350}{330} = 1803.0$ Hz. Beats $= 1803.0 - 1700 = 103.0$ Hz.`, { unit: 'Hz' }),
  xnat(4, 'intensity of sound', r`A 1000 Hz sound wave in air ($\rho = 1.2\ \mathrm{kg\,m^{-3}}$, $v = 340\ \mathrm{m\,s^{-1}}$) has intensity $10^{-6}\ \mathrm{W\,m^{-2}}$. Find the displacement amplitude of the air particles (in nm, 1 decimal).`, Math.sqrt(1e-6 / (2 * XPI ** 2 * 1e6 * 1.2 * 340)) * 1e9, 0.3, 1,
    r`$I = \tfrac12\rho v\omega^2A^2 = 2\pi^2\rho vf^2A^2$. $A^2 = \dfrac{10^{-6}}{2\pi^2\times1.2\times340\times10^{6}} = 1.24\times10^{-16}$, $A = 1.1\times10^{-8}$ m $= 11.1$ nm.`, { unit: 'nm' }),
  xnat(4, 'sound level', r`The intensity of one sound is four times that of another. Find the difference of their levels (in dB, 2 decimals).`, 10 * Math.log10(4), 0.01, 2,
    r`$\Delta\beta = 10\log_{10}\dfrac{I_1}{I_2} = 10\log_{10}4 = 6.02$ dB.`, { unit: 'dB' }),
  xmsq(4, 'wave equation', r`A wave is $y = A\sin(\omega t - kx)$. Which are correct?`, [r`It travels in the $+x$ direction with speed $\omega/k$.`, r`A particle's maximum speed is $A\omega$.`, r`A particle's maximum speed is $A\omega/k$.`, r`Two points $\lambda/2$ apart are in opposite phase.`], [0, 1, 3],
    r`The combination $\omega t - kx$ is a wave moving towards $+x$ at $\omega/k$ (A). Particle velocity $A\omega\cos(\cdot)$ has maximum $A\omega$ (B true, C false: the wave speed and the particle speed are different things). A phase difference of $k\Delta x = \pi$ is opposite phase (D).`),
  xmsq(4, 'standing waves', r`For a stationary wave on a string fixed at both ends, which are correct?`, [r`The distance between adjacent nodes is $\lambda/2$.`, r`The amplitude at an antinode is twice the amplitude of either travelling wave.`, r`All particles reach the mean position at the same instant.`, r`Particles on opposite sides of a node vibrate in phase.`], [0, 1, 2],
    r`Node spacing $\lambda/2$ (A). $y = 2A\sin kx\cos\omega t$ (B). The time factor $\cos\omega t$ is common, so all pass the mean together (C). Across a node $\sin kx$ changes sign, so the motion is in opposite phase (D false).`),
  xmsq(4, 'closed pipe', r`A pipe closed at one end has fundamental frequency $f$. Which are correct?`, [r`The first overtone is $3f$.`, r`The second overtone is $5f$.`, r`The pipe has an antinode at the closed end.`, r`The pipe has a node at the closed end.`], [0, 1, 3],
    r`Overtones are $3f, 5f, 7f\ldots$ (A, B). The air cannot move at the closed end: a displacement node (D); the open end is an antinode.`),
  xmsq(4, 'Doppler effect', r`Which of these change the frequency heard from a source of frequency $f$?`, [r`The source moves towards a stationary observer.`, r`The observer moves towards a stationary source.`, r`The source and the observer both move with the same velocity in still air.`, r`The source and the observer are at rest but a steady wind blows along the line joining them.`], [0, 1],
    r`A and B shift the frequency. If both move together (C), the relative motion is zero, so the frequency is unchanged. A wind moves the medium: the wavelength and wave speed both change in step, and with source and observer at rest the frequency is unchanged (D).`),
  xmsq(4, 'interference', r`Two coherent sources vibrate in phase. At a point where the path difference is $\Delta$, which are correct?`, [r`$\Delta = \lambda$ gives constructive interference.`, r`$\Delta = \dfrac{3\lambda}{2}$ gives destructive interference.`, r`$\Delta = \dfrac{\lambda}{4}$ gives amplitude $\sqrt2\times$ the single amplitude (for equal sources).`, r`$\Delta = 0.4\lambda$ gives no sound at all, for equal sources.`], [0, 1, 2],
    r`$\Delta = n\lambda$: constructive (A). $(n + \tfrac12)\lambda$: destructive (B). $\Delta = \lambda/4$: phase difference $\pi/2$, amplitude $2A\cos45^\circ = \sqrt2A$ (C). Silence needs exactly $(n+\tfrac12)\lambda$; $0.4\lambda$ gives a partial cancellation (D false).`),
  xasrt(4, 'speed of sound', r`The speed of sound in a gas is independent of the pressure of the gas at constant temperature.`, r`The pressure and the density of a gas change in the same proportion at constant temperature.`, 0,
    r`$v = \sqrt{\gamma P/\rho}$, and at constant $T$, $P/\rho$ is constant (Boyle's law), so $v$ is independent of $P$. R explains A.`),
  xasrt(4, 'Doppler effect', r`When the source and the observer are both at rest, a steady wind blowing from the source to the observer changes the frequency heard.`, r`A wind changes the speed of sound relative to the ground.`, 3,
    r`A is false: the wind changes the speed and the wavelength together, so crests still arrive at the same rate as they are emitted. R is true.`),
  xstm(4, 'beats', r`Two sound waves of frequencies 300 Hz and 304 Hz produce a sound whose loudness varies 4 times a second.`, r`The amplitude of the resultant varies at a frequency equal to the difference of the two frequencies.`, 0,
    r`The resultant is $2A\cos(\pi\Delta f\,t)\sin(\ldots)$ whose intensity swells $|f_1 - f_2| = 4$ times each second. Both are true.`),
  xcnt(4, 'standing waves in pipes', r`How many of these are correct for pipes of the same length $L$ (open pipe fundamental $f_0$)?`, [r`The closed pipe has fundamental $f_0/2$.`, r`The first overtone of the open pipe is $2f_0$.`, r`The first overtone of the closed pipe is $3f_0/2$.`, r`The open pipe has all harmonics, the closed pipe only odd ones.`], 4,
    r`(1) $\dfrac{v}{4L} = \dfrac{f_0}{2}$. (2) $\dfrac{2v}{2L} = 2f_0$. (3) $3\times\dfrac{f_0}{2}$. (4) True. All four are correct.`),
  xmt(4, 'Doppler shifts', 'mw3', r`A source emits 1000 Hz and the speed of sound is 340 m/s. Match each situation with the frequency heard.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    r`(A) $\dfrac{1000\times340}{340 - 34} = 1111$ Hz (p). (B) $\dfrac{1000\times340}{374} = 909$ Hz (q). (C) $1000\times\dfrac{374}{340} = 1100$ Hz (r). (D) $1000\times\dfrac{306}{340} = 900$ Hz (s). A moving source and a moving observer give different values, even at equal speeds.`),
  xmt(4, 'sound level changes', 'mw4', r`Match each change with the change in the sound level.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$\Delta\beta = 10\log_{10}(I_2/I_1)$. (A) $\times2$: $+3$ dB (p). (B) $\times10$: $+10$ dB (q). (C) distance $\times2$ gives $I\times\tfrac14$: $-6$ dB (r). (D) 100 sources: $I\times100$: $+20$ dB (s).`),
  xmt(4, 'string harmonics', 'mw5', r`Match each item about a string fixed at both ends (fundamental $f$, length $L$).`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-s, B-q, C-r, D-p'],
    r`Second overtone = third harmonic: frequency $3f$ (p), with 4 nodes (two ends and two inside) (q). Second harmonic: $\lambda = \dfrac{2L}{2} = L$ (r) and frequency $2f$ (s).`),
  xmt(4, 'stretched string', 'mw8', r`The fundamental of a string is $f = \dfrac{1}{2L}\sqrt{\dfrac{T}{\mu}}$. Match each change with its effect.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`(A) $\sqrt4 = 2$ (p). (B) $\mu\propto d^2$ becomes 4 times, so $f\to\tfrac12$ (q). (C) $\dfrac{\sqrt2}{1/2} = 2\sqrt2$ (r). (D) $\dfrac{\sqrt9}{3} = 1$ (s).`),
  xpas(3, 'speed on a string', 'pw1', r`Find the speed of waves on the string (in $\mathrm{m\,s^{-1}}$).`, Math.sqrt(64 / 0.04), 0, 0,
    r`$v = \sqrt{T/\mu} = \sqrt{64/0.04} = \sqrt{1600} = 40\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  xpas(3, 'harmonics', 'pw1', r`Find the frequency of the vibration (in Hz).`, 3 * 40 / (2 * 1.2), 0, 0,
    r`$f_3 = \dfrac{3v}{2L} = \dfrac{3\times40}{2.4} = 50$ Hz.`, { unit: 'Hz' }),
  xpas(4, 'particle speed', 'pw1', r`Find the maximum speed of a particle of the string at an antinode (in $\mathrm{m\,s^{-1}}$, 2 decimals).`, 0.003 * 2 * XPI * 50, 0.01, 2,
    r`$\omega = 2\pi\times50 = 314.2\ \mathrm{s^{-1}}$. $v_{max} = A\omega = 0.003\times314.2 = 0.94\ \mathrm{m\,s^{-1}}$. This is not the wave speed (40 m/s).`, { unit: 'm/s', trap: 'Particle speed and wave speed are different.' }),
  xpas(3, 'Doppler effect', 'pw2', r`Find the frequency heard as the ambulance approaches (in Hz, 1 decimal).`, 700 * 340 / 320, 0.1, 1,
    r`$f' = f\dfrac{v}{v - v_s} = 700\times\dfrac{340}{320} = 743.8$ Hz.`, { unit: 'Hz' }),
  xpas(4, 'Doppler effect', 'pw2', r`Find the drop in the frequency heard as it passes (approaching to receding) (in Hz, 1 decimal).`, 700 * 340 / 320 - 700 * 340 / 360, 0.2, 1,
    r`Receding: $700\times\dfrac{340}{360} = 661.1$ Hz. Drop $= 743.75 - 661.11 = 82.6$ Hz.`, { unit: 'Hz' }),
  xpas(5, 'Doppler effect and wind', 'pw2', r`A steady wind of $10\ \mathrm{m\,s^{-1}}$ blows from the ambulance's side towards the observer, along the road, when it approaches. Find the frequency heard (in Hz, 1 decimal).`, 700 * 350 / 330, 0.2, 1,
    r`The sound travels at $340 + 10 = 350\ \mathrm{m\,s^{-1}}$ over the ground towards the observer. For a moving source and a stationary observer: $f' = f\dfrac{v_{eff}}{v_{eff} - v_s} = 700\times\dfrac{350}{330} = 742.4$ Hz. (Source speed is measured over the ground; the wavelength in the moving air is $\lambda' = (v_{eff} - v_s)/f$.)`, { unit: 'Hz', trap: 'The wind changes the speed of sound over the ground, not the source speed.' }),

  // ---------- Level 5 ----------
  xnat(5, 'reflection and transmission', r`A wave travels along a string of linear density $\mu$ and meets a junction with a string of linear density $4\mu$ under the same tension. Find the fraction of the incident power that is transmitted (3 decimals).`, 8 / 9, 0.002, 3,
    r`$v\propto\mu^{-1/2}$, so $v_2 = v_1/2$. The amplitude reflection coefficient is $r = \dfrac{v_2 - v_1}{v_2 + v_1} = -\dfrac13$. The reflected power fraction is $r^2 = \dfrac19$, so $1 - \dfrac19 = \dfrac89 = 0.889$ is transmitted. (Check: $t = \dfrac23$, power $\propto Zt^2$ with $Z_2 = 2Z_1$: $2\times\dfrac49 = \dfrac89$.)`, { trap: 'Power depends on impedance as well as amplitude, so it is not t squared.' }),
  xnat(5, 'waves on a rope', r`A uniform rope of length 4.9 m hangs from a ceiling. A pulse is sent from the lower free end. Find the time it takes to reach the ceiling (in s, 3 decimals). Take $g = 9.8\ \mathrm{m\,s^{-2}}$.`, 2 * Math.sqrt(4.9 / 9.8), 0.003, 3,
    r`At height $x$ above the free end $v = \sqrt{gx}$. $t = \int_0^L\dfrac{dx}{\sqrt{gx}} = 2\sqrt{\dfrac Lg} = 2\sqrt{\dfrac{4.9}{9.8}} = 1.414$ s.`, { unit: 's', trap: 'The speed grows with height, so L/v at the top would be wrong.' }),
  xnat(5, 'Kundt\'s tube', r`A rod 1.0 m long is clamped at its middle in a Kundt's tube and vibrates in its fundamental mode. The speed of sound in the rod is $5000\ \mathrm{m\,s^{-1}}$. Find the distance between adjacent nodes of the powder in the air column (in cm, 1 decimal; $v_{air} = 340\ \mathrm{m\,s^{-1}}$).`, 340 / (2 * 2500) * 100, 0.1, 1,
    r`A rod clamped at the middle has a node there and antinodes at its ends: $L = \dfrac{\lambda_{rod}}{2}$, $f = \dfrac{5000}{2\times1.0} = 2500$ Hz. In air $\lambda = \dfrac{340}{2500} = 0.136$ m. Nodes are $\dfrac\lambda2 = 6.8$ cm apart.`, { unit: 'cm' }),
  xnat(5, 'speed of sound in solids', r`A steel rod has Young's modulus $2.0\times10^{11}\ \mathrm{N\,m^{-2}}$ and density $7800\ \mathrm{kg\,m^{-3}}$. Find the speed of longitudinal waves in it (in $\mathrm{m\,s^{-1}}$, nearest 10).`, Math.sqrt(2e11 / 7800), 10, 0,
    r`$v = \sqrt{Y/\rho} = \sqrt{\dfrac{2.0\times10^{11}}{7800}} = \sqrt{2.564\times10^{7}} = 5060\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  xnat(5, 'Doppler effect', r`A siren emitting 800 Hz is whirled in a horizontal circle of radius 1.0 m at 10 revolutions per second. A distant stationary observer in the plane hears frequencies between a minimum and a maximum. Find the ratio $f_{max}/f_{min}$ (3 decimals; $v = 340\ \mathrm{m\,s^{-1}}$).`, (340 + 2 * XPI * 1 * 10) / (340 - 2 * XPI * 1 * 10), 0.003, 3,
    r`Speed $u = 2\pi Rf = 62.8\ \mathrm{m\,s^{-1}}$. $f_{max} = f\dfrac{v}{v - u}$ (moving straight towards) and $f_{min} = f\dfrac{v}{v + u}$ (moving straight away). Ratio $= \dfrac{v + u}{v - u} = \dfrac{402.8}{277.2} = 1.453$.`, { trap: 'The ratio does not involve f.' }),
  xmsq(5, 'speed of sound', r`Which of these increase the speed of sound in a gas?`, [r`Raising the temperature at constant composition.`, r`Replacing a heavier gas by a lighter one of the same $\gamma$ at the same temperature.`, r`Raising the pressure at constant temperature.`, r`Raising the frequency of the wave.`], [0, 1],
    r`$v = \sqrt{\gamma RT/M}$: rises with $T$ (A) and falls with $M$ (B). At constant $T$ the pressure does not matter (C), and speed is independent of frequency (D).`),
  xmsq(5, 'reflection', r`A pulse travelling along a string reaches the end. Which are correct?`, [r`At a fixed end it is reflected with a phase change of $\pi$.`, r`At a free end it is reflected without a phase change.`, r`If the string joins a lighter string, the reflected pulse is inverted.`, r`If the string joins a heavier string, the reflected pulse is inverted.`], [0, 1, 3],
    r`Fixed end: inverted (A). Free end: same sign (B). Going to a heavier (slower) string the end behaves like a partly fixed one: $r = \dfrac{v_2 - v_1}{v_2 + v_1} < 0$, inverted (D). Going to a lighter string $r > 0$, not inverted (C false).`),
  xmsq(5, 'standing waves on a string', r`A string of length $L$ fixed at both ends vibrates in its fourth harmonic. Which are correct?`, [r`There are 3 nodes between the ends.`, r`There are 5 antinodes.`, r`The wavelength is $L/2$.`, r`The frequency is 4 times the fundamental.`], [0, 2, 3],
    r`$\lambda_n = \dfrac{2L}{n}$, so $\lambda_4 = \dfrac L2$ (C). Four loops: 4 antinodes, not 5 (B false), and $5$ nodes including the ends, i.e. 3 inside (A). $f_4 = 4f_1$ (D).`),
  xmsq(5, 'intensity and loudness', r`Which are correct about sound levels?`, [r`Doubling the intensity raises the level by about 3 dB.`, r`Two sources of 60 dB each, heard together, give 120 dB.`, r`A rise of 10 dB means the intensity is ten times greater.`, r`Moving to twice the distance from a point source lowers the level by about 6 dB.`], [0, 2, 3],
    r`$10\log_{10}2 = 3.01$ (A). Intensities add, so $2I$: 63 dB, not 120 dB (B false). $10\log_{10}10 = 10$ (C). Intensity falls to $\tfrac14$: $-6$ dB (D).`),
  xmsq(5, 'beats', r`Two tuning forks of nearly equal frequency are sounded together. Which are correct?`, [r`The number of beats per second equals the difference of their frequencies.`, r`Loading one fork with wax changes the beat frequency.`, r`The frequency of the resultant is the difference of the two frequencies.`, r`The beats are heard at a fixed place by any listener.`], [0, 1, 3],
    r`$f_b = |f_1 - f_2|$ (A). Wax lowers one frequency and so changes $f_b$ (B). The wave $2A\cos(\pi\Delta f\,t)\sin(2\pi\bar ft)$ oscillates at the mean frequency $\bar f$ (C false: the resultant oscillates at the mean frequency, and only the loudness swells at the difference). The loudness variation is heard by every listener in the region (D).`),
  xmt(5, 'speed of sound', 'mw6', r`Match each comparison with the ratio of the speeds of sound.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`(A) $\sqrt{29/2} = 3.81$ (p). (B) $\sqrt{\dfrac{(5/3)\times29}{1.4\times4}} = \sqrt{8.63} = 2.94$ (q). (C) $\sqrt4 = 2$ (r). (D) 1: pressure has no effect at constant $T$ (s).`),
  xmt(5, 'waves on strings', 'mw7', r`A wave moves from a string of density $\mu$ into a string of density $4\mu$ at the same tension. Match each quantity.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`$v_2/v_1 = \sqrt{\mu/4\mu} = \tfrac12$ (p). $r = \dfrac{v_2 - v_1}{v_2 + v_1} = -\tfrac13$ (q). $t = \dfrac{2v_2}{v_1 + v_2} = \tfrac23$ (r). Power fraction $1 - r^2 = \tfrac89$ (s).`),
  xasrt(5, 'Doppler effect', r`A stationary observer hears a shorter wavelength from a source that is approaching.`, r`After emitting each crest, the source moves a distance $v_sT$ towards the observer before emitting the next one, while the wave speed is fixed by the medium.`, 0,
    r`The crests are $\lambda' = vT - v_sT = (v - v_s)T$ apart. That is exactly what R describes, so A is true and R explains it.`),
  xstm(5, 'standing waves', r`In a stationary wave the energy density at a node is always zero.`, r`At a node the particle displacement is always zero.`, 3,
    r`Statement II is true. Statement I is false: the kinetic energy is zero at the node (no motion) but the strain is greatest there, so there is potential energy of deformation whenever the wave is stretched. Total energy density is not zero.`, { trap: 'No motion at a node does not mean no energy.' }),
  xmcq(4, 'refraction of waves', r`A sound wave goes from air into water. Which of these stays the same?`, 'The frequency', ['The wavelength', 'The speed', 'The amplitude of pressure'],
    r`The frequency is set by the source. The speed is much larger in water, so the wavelength changes in proportion. The pressure amplitude changes at the boundary (partial reflection).`),
];
xitems.push(
  xnat(4, 'pipes', r`A tube resonates at 105 Hz, 175 Hz and 245 Hz, and at no frequency in between. Find its fundamental frequency (in Hz).`, 35, 0, 0,
    r`The ratios $105:175:245 = 3:5:7$ are odd harmonics, so the tube is closed at one end and $f_1 = 105/3 = 35$ Hz. (The gaps of 70 Hz are $2f_1$.)`, { unit: 'Hz', trap: 'Dividing the gap (70 Hz) gives the wrong fundamental for a closed pipe.' }),
  xnat(3, 'strings', r`A violin string 32 cm long vibrates at 440 Hz in its fundamental. At what length (in cm, 1 decimal) must it be pressed to give 660 Hz, with the same tension?`, 32 * 440 / 660, 0.1, 1,
    r`$f\propto1/L$, so $L' = 32\times\dfrac{440}{660} = 21.3$ cm.`, { unit: 'cm' }),
  xnat(4, 'resonance tube', r`A 425 Hz tuning fork is held over a tall tube whose water level rises steadily at $0.5\ \mathrm{cm\,s^{-1}}$. Find the time between two successive resonances (in s; $v = 340\ \mathrm{m\,s^{-1}}$).`, (340 / 425 / 2) / 0.005, 0, 0,
    r`$\lambda = \dfrac{340}{425} = 0.8$ m. Successive resonances of the air column are $\lambda/2 = 0.4$ m apart in length, so the water must rise 40 cm: $t = \dfrac{0.40}{0.005} = 80$ s.`, { unit: 's' }),
  xnat(5, 'interference', r`Two identical loudspeakers 1.9 m apart in a line emit the same note in phase, of wavelength 0.40 m. Between them there are points where the sound is nearly silent. How many such nodes lie on the line between the speakers?`, 10, 0, 0,
    r`At position $x$ from one speaker the path difference is $|d - 2x|$, where $d = 1.9$ m. Cancellation needs $|d - 2x| = \left(n + \tfrac12\right)\lambda = 0.2, 0.6, 1.0, 1.4, 1.8$ m (all below 1.9 m). Each value gives two positions, one on each side of the centre: $5\times2 = 10$ nodes.`, { trap: 'Count each path difference twice, once for each side of the centre.' }),
  xnat(5, 'Doppler effect', r`A bat flies at $5\ \mathrm{m\,s^{-1}}$ straight towards a wall, emitting a 40 kHz sound. Find the frequency of the echo it hears (in kHz, 2 decimals; $v = 340\ \mathrm{m\,s^{-1}}$).`, 40 * 345 / 335, 0.02, 2,
    r`The wall receives $f_1 = 40\times\dfrac{340}{340 - 5}$ (source approaching) and reflects this frequency. The bat, moving towards the wall, hears $f_2 = f_1\dfrac{340 + 5}{340} = 40\times\dfrac{345}{335} = 41.19$ kHz.`, { unit: 'kHz' }),
);

const xgens = [
  xg('wv-g24', 3, 'nat', 'Doppler effect', function make(rng) {
    const f = pick(rng, 300, 900, 50); const vs = pick(rng, 10, 40, 10); const vo = pick(rng, 10, 30, 10); const sT = rng() < 0.5; const oT = rng() < 0.5;
    const fp = f * (340 + (oT ? vo : -vo)) / (340 - (sT ? vs : -vs));
    return { f, vs, vo, sT, oT, q: `A ${f} Hz source moves ${sT ? 'towards' : 'away from'} a moving observer at ${vs} m/s, and the observer moves ${oT ? 'towards' : 'away from'} the source at ${vo} m/s (along the same line, still air, $v = 340$ m/s). Find the frequency heard (in Hz, 1 decimal).`, answer: +fp.toFixed(1), tol: 0.2, unit: 'Hz',
      sol: `$f' = f\\dfrac{v \\pm v_o}{v \\mp v_s}$. Observer ${oT ? 'towards: $+v_o$' : 'away: $-v_o$'}, source ${sT ? 'towards: $-v_s$' : 'away: $+v_s$'}. $f' = ${f}\\times\\dfrac{${340 + (oT ? vo : -vo)}}{${340 - (sT ? vs : -vs)}} = ${xs(fp, 5)}$ Hz.`, trap: 'Numerator: the observer. Denominator: the source.' };
  }, (p) => p.f * (340 + (p.oT ? 1 : -1) * p.vo) / (340 + (p.sT ? -1 : 1) * p.vs)),
  xg('wv-g25', 3, 'nat', 'resonance tube', function make(rng) {
    const f = choose(rng, [256, 320, 384, 480, 512]); const v = pick(rng, 330, 350, 5); const e = choose(rng, [1.0, 1.5, 2.0]);
    const lam = v / f * 100; const L1 = lam / 4 - e; const L2 = 3 * lam / 4 - e;
    return { f, v, e, q: `In a resonance tube experiment with a ${f} Hz fork, the first resonance is at ${xs(L1, 4)} cm and the second at ${xs(L2, 4)} cm. Find the speed of sound (in $\\mathrm{m\\,s^{-1}}$, 1 decimal).`, answer: +v.toFixed(1), tol: 0.5, unit: 'm/s', L1, L2,
      sol: `$L_2 - L_1 = \\dfrac\\lambda2 = ${xs(L2 - L1, 4)}$ cm, so $\\lambda = ${xs(2 * (L2 - L1), 4)}$ cm and $v = f\\lambda = ${f}\\times${xs(2 * (L2 - L1) / 100, 4)} = ${xs(v)}\\ \\mathrm{m\\,s^{-1}}$. The end correction cancels in the difference.`, trap: 'Use the difference, so the end correction drops out.' };
  }, (p) => p.f * 2 * (p.L2 - p.L1) / 100),
  xg('wv-g26', 4, 'nat', 'resonance tube', function make(rng) {
    const L = pick(rng, 0.4, 1.2, 0.05); const n = int(rng, 1, 3); const f1 = 340 / (4 * L);
    const fa = (2 * n - 1) * f1; const fb = (2 * n + 1) * f1;
    return { L, n, q: `A pipe closed at one end resonates at ${xs(fa, 5)} Hz and the next higher frequency ${xs(fb, 5)} Hz. Find its length (in m, 2 decimals; $v = 340\\ \\mathrm{m\\,s^{-1}}$).`, answer: +L.toFixed(2), tol: 0.01, unit: 'm', fa, fb,
      sol: `Consecutive resonances of a closed pipe differ by $2f_1 = ${xs(fb - fa, 5)}$ Hz, so $f_1 = ${xs((fb - fa) / 2, 5)}$ Hz and $L = \\dfrac{v}{4f_1} = \\dfrac{340}{${xs(2 * (fb - fa), 5)}} = ${xs(L)}$ m.`, trap: 'The gap between neighbours is 2f1 for a closed pipe, f1 for an open one.' };
  }, (p) => 340 / (2 * (p.fb - p.fa))),
  xg('wv-g27', 3, 'mcq', 'intensity and loudness', function make(rng) {
    const n = choose(rng, [2, 4, 10, 100, 1000]); const b = pick(rng, 40, 80, 10); const lv = b + 10 * Math.log10(n);
    const o = numOpts(rng, lv, [b * n, b + n, b + 10 * Math.log10(n) * 2], 'dB', 3);
    return { n, b, q: `One machine produces ${b} dB at a point. ${n} identical machines run together there. The sound level is`, options: o.options, answer: o.answer,
      sol: `Intensities add: $I\\to${n}I$, so $\\beta = ${b} + 10\\log_{10}${n} = ${xs(lv)}$ dB. Multiplying the level by ${n} (or adding ${n}) mistakes decibels for a linear scale.` };
  }, (p) => p.options.findIndex((o) => o === `${fmt(p.b + 10 * Math.log10(p.n), 3)} dB`)),
  xg('wv-g28', 4, 'nat', 'sonometer', function make(rng) {
    const rho = choose(rng, [2700, 4000, 7800, 8900, 11300]); const f = pick(rng, 200, 400, 50);
    const fp = f * Math.sqrt(1 - 1000 / rho);
    return { rho, f, q: `A sonometer wire stretched by a block of density ${rho} $\\mathrm{kg\\,m^{-3}}$ has a fundamental of ${f} Hz. The block is lowered fully into water (1000 $\\mathrm{kg\\,m^{-3}}$). Find the new frequency (in Hz, 1 decimal).`, answer: +fp.toFixed(1), tol: 0.2, unit: 'Hz',
      sol: `The buoyant force is the fraction $\\dfrac{1000}{${rho}}$ of the weight, so $T' = T\\left(1 - \\dfrac{1000}{${rho}}\\right)$ and $f' = ${f}\\sqrt{${xs(1 - 1000 / rho, 4)}} = ${xs(fp)}$ Hz.`, trap: 'f goes as the square root of T.' };
  }, (p) => { const T = 1; const T2 = T * (p.rho - 1000) / p.rho; return p.f * Math.sqrt(T2 / T); }),
  xg('wv-g29', 4, 'nat', 'Doppler effect and beats', function make(rng) {
    const f = pick(rng, 500, 900, 50); const u = pick(rng, 5, 25, 5);
    const b = f * 340 * 2 * u / (340 ** 2 - u ** 2);
    return { f, u, q: `A ${f} Hz source moves straight towards a large wall at ${u} m/s. A listener behind it hears the sound directly and as reflected from the wall. Find the beat frequency (in Hz, 1 decimal; $v = 340\\ \\mathrm{m\\,s^{-1}}$).`, answer: +b.toFixed(1), tol: 0.2, unit: 'Hz',
      sol: `Reflected: $\\dfrac{${f}\\times340}{340 - ${u}} = ${xs(f * 340 / (340 - u), 5)}$ Hz. Direct (source receding from the listener): $\\dfrac{${f}\\times340}{340 + ${u}} = ${xs(f * 340 / (340 + u), 5)}$ Hz. Beats $= ${xs(b)}$ Hz.`, trap: 'The wall is at rest: it reflects the frequency it receives.' };
  }, (p) => p.f * 340 / (340 - p.u) - p.f * 340 / (340 + p.u)),
  xg('wv-g30', 5, 'nat', 'reflection and transmission', function make(rng) {
    const n = choose(rng, [4, 9, 16, 25]);
    const tr = 4 * Math.sqrt(n) / (1 + Math.sqrt(n)) ** 2;
    return { n, q: `A wave on a string of density $\\mu$ reaches a junction with a string of density $${n}\\mu$ (same tension). What fraction of the incident power is transmitted (3 decimals)?`, answer: +tr.toFixed(3), tol: 0.002,
      sol: `$v\\propto\\mu^{-1/2}$, so $v_2/v_1 = 1/${Math.sqrt(n)}$. $r = \\dfrac{v_2 - v_1}{v_2 + v_1} = \\dfrac{1 - ${Math.sqrt(n)}}{1 + ${Math.sqrt(n)}} = ${xs((1 - Math.sqrt(n)) / (1 + Math.sqrt(n)), 4)}$. Reflected power $r^2 = ${xs(((1 - Math.sqrt(n)) / (1 + Math.sqrt(n))) ** 2, 4)}$; transmitted $= 1 - r^2 = ${xs(tr, 4)}$.`, trap: 'Transmitted amplitude squared is not the transmitted power.' };
  }, (p) => { const z = Math.sqrt(p.n); const t = 2 / (1 + z); return t * t * z; }),
];

xgens.push(
  xg('wv-g31', 4, 'nat', 'pipes', function make(rng) {
    const L = choose(rng, [0.4, 0.5, 0.8, 1.0]); const closed = rng() < 0.5; const lim = choose(rng, [10000, 15000, 20000]);
    const f1 = closed ? 340 / (4 * L) : 340 / (2 * L);
    let cnt = 0; let n = 1;
    while ((closed ? (2 * n - 1) * f1 : n * f1) <= lim) { cnt++; n++; }
    return { L, closed, lim, q: `A pipe ${closed ? 'closed at one end' : 'open at both ends'} is ${L} m long ($v = 340\\ \\mathrm{m\\,s^{-1}}$). How many of its natural frequencies, counting the fundamental, are not above ${lim} Hz?`, answer: cnt, tol: 0,
      sol: `$f_1 = ${closed ? `\\dfrac{v}{4L}` : `\\dfrac{v}{2L}`} = ${xs(f1, 4)}$ Hz. ${closed ? `Only odd multiples occur: $(2n - 1)f_1\\le${lim}$ gives $2n - 1\\le${xs(lim / f1, 4)}$, so $n = ${cnt}$.` : `All multiples occur: $nf_1\\le${lim}$ gives $n\\le${xs(lim / f1, 4)}$, so $n = ${cnt}$.`}`, trap: 'A closed pipe has only odd harmonics.' };
  }, (p) => { const f1 = p.closed ? 340 / (4 * p.L) : 340 / (2 * p.L); const m = Math.floor(p.lim / f1 + 1e-9); return p.closed ? Math.floor((m + 1) / 2) : m; }),
  xg('wv-g32', 3, 'mcq', 'closed pipe', function make(rng) {
    const L = choose(rng, [0.25, 0.5, 0.85, 1.0]); const n = choose(rng, [1, 2, 3]); const f1 = 340 / (4 * L); const fn = (2 * n + 1) * f1;
    const o = numOpts(rng, fn, [(n + 1) * f1, 2 * (n + 1) * f1, (2 * n + 1) * 340 / (2 * L)], 'Hz', 4);
    const nm = n === 1 ? 'first' : n === 2 ? 'second' : 'third';
    return { L, n, q: `A pipe ${L} m long is closed at one end ($v = 340\\ \\mathrm{m\\,s^{-1}}$). The frequency of its ${nm} overtone is`, options: o.options, answer: o.answer,
      sol: `$f_1 = \\dfrac{v}{4L} = ${xs(f1, 4)}$ Hz. Overtones of a closed pipe are $3f_1, 5f_1, 7f_1$, so the ${nm} overtone is $${2 * n + 1}f_1 = ${xs(fn, 4)}$ Hz. Using $${n + 1}f_1$ (the overtone number plus one) or the open-pipe spacing gives the other options.` };
  }, (p) => p.options.findIndex((o) => o === `${fmt((2 * p.n + 1) * 340 / (4 * p.L), 4)} Hz`)),
);

export default { topic: 'waves', groups: { ...groups, ...xgroups }, items: [...items, ...xitems], gens: [...gens, ...xgens] };
