// Sound, beats and the Doppler effect: speed of sound in gases and solids (Newton and Laplace), temperature
// dependence, pressure and displacement waves, intensity and decibels, open and closed pipes, end correction and the
// resonance tube, Kundt's tube, beats and tuning-fork problems, the Doppler effect for sound (moving source and
// observer, wind, echoes from moving reflectors), shock waves, and the relativistic Doppler effect for light.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

export default {
  topic: 'sound-doppler',
  items: [
    // ---------- level 1 ----------
    { id: 'sdp-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'speed of sound',
      q: 'The absolute temperature of the air is made four times larger. The speed of sound in it',
      options: ['doubles', 'becomes four times larger', 'stays the same', 'halves'], answer: 0,
      sol: 'For an ideal gas $v = \\sqrt{\\gamma RT/M}$, so $v \\propto \\sqrt T$. Four times $T$ gives twice the speed.',
      trap: 'Using degrees Celsius: the formula needs kelvin.' },
    { id: 'sdp-002', type: 'nat', level: 1, exams: ['jam'], sub: 'pipes', unit: 'Hz',
      q: 'A pipe $0.85$ m long is closed at one end and open at the other. With the speed of sound $340$ m/s, its fundamental frequency is ______ Hz (ignore end correction).',
      answer: 100, tol: 0, calc: () => 340 / (4 * 0.85),
      sol: 'The closed end is a displacement node and the open end an antinode, so the fundamental fits a quarter wavelength: $\\lambda = 4L = 3.4$ m, $f = v/\\lambda = 100$ Hz.',
      trap: 'Using $\\lambda = 2L$ (open-pipe formula) gives 200 Hz.' },
    { id: 'sdp-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'pipes',
      q: 'A pipe closed at one end can sound',
      options: ['all harmonics of its fundamental', 'only even harmonics', 'only odd harmonics', 'only its fundamental'], answer: 2,
      sol: 'It must hold an odd number of quarter wavelengths, $L = (2n - 1)\\lambda/4$, so $f = (2n - 1)v/4L$: frequencies $1, 3, 5, \\dots$ times the fundamental. That is why a closed pipe sounds hollower than an open one.' },
    { id: 'sdp-004', type: 'nat', level: 1, exams: ['jam'], sub: 'decibels', unit: 'dB',
      q: 'A sound has intensity $10^{-6}$ W/m². With the reference intensity $10^{-12}$ W/m², its intensity level is ______ dB.',
      answer: 60, tol: 0, calc: () => 10 * Math.log10(1e-6 / 1e-12),
      sol: '$\\beta = 10\\log_{10}(I/I_0) = 10\\log_{10}(10^6) = 60$ dB.' },
    { id: 'sdp-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'doppler',
      q: 'A sound source moves towards a listener who is at rest in still air. Compared with the source at rest, the listener receives',
      options: ['a higher frequency with the same wavelength in the air', 'a higher frequency and a shorter wavelength in the air', 'a lower frequency and a longer wavelength', 'the same frequency'], answer: 1,
      sol: 'The source moves after each crest, so the crests in front are bunched together: the wavelength in front is $(v - u_s)/f$, shorter. They still travel at $v$, so more arrive per second: higher frequency $fv/(v - u_s)$.',
      trap: 'A moving listener changes only the frequency; a moving source changes the wavelength in the air.' },
    { id: 'sdp-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'pipes',
      q: 'A pipe $0.5$ m long is open at both ends. With the speed of sound $340$ m/s, its fundamental frequency (ignoring end corrections) is',
      options: ['$170$ Hz', '$680$ Hz', '$85$ Hz', '$340$ Hz'], answer: 3,
      sol: 'Both ends are displacement antinodes, so the fundamental fits half a wavelength: $\\lambda = 2L = 1$ m and $f = 340/1 = 340$ Hz.',
      trap: '$170$ Hz is what a closed pipe of the same length gives.' },

    // ---------- level 2 ----------
    { id: 'sdp-007', type: 'nat', level: 2, exams: ['jam'], sub: 'beats', unit: 'Hz',
      q: 'A tuning fork of $512$ Hz and an unknown fork give $4$ beats per second. When a little wax is stuck on the unknown fork, the beats become $6$ per second. The unknown frequency (before the wax) is ______ Hz.',
      answer: 508, tol: 0, calc: () => 512 - 4,
      sol: 'Before: $f = 512 \\pm 4$, so 516 or 508 Hz. Wax adds mass and lowers the unknown frequency. If it were 516, lowering it would bring it closer to 512 and reduce the beats. The beats increased, so it was below 512 and moved further away: $f = 508$ Hz.',
      trap: 'Filing a fork (removing metal) raises its frequency; wax lowers it. Get the direction right before choosing.' },
    { id: 'sdp-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'speed of sound',
      q: 'Newton\'s formula for the speed of sound in air gave a value about 15% too low. Laplace\'s correction says that',
      options: ['the compressions are isothermal, so $v = \\sqrt{P/\\rho}$', 'the compressions are adiabatic, so $v = \\sqrt{\\gamma P/\\rho}$', 'the speed does not depend on temperature', 'the speed is proportional to pressure'], answer: 1,
      sol: 'Compressions and rarefactions happen too fast for heat to flow, so they are adiabatic, with bulk modulus $\\gamma P$ instead of $P$. With $\\gamma = 1.4$ this raises the speed by $\\sqrt{1.4} = 1.18$, matching experiment.' },
    { id: 'sdp-009', type: 'nat', level: 2, exams: ['jam'], sub: 'doppler', unit: 'Hz',
      q: 'A source of $500$ Hz moves at $34$ m/s straight towards a listener at rest. The speed of sound is $340$ m/s. The listener hears ______ Hz (to one decimal place).',
      answer: 555.6, tol: 0.3, calc: () => 500 * 340 / (340 - 34),
      sol: '$f\' = f\\dfrac{v}{v - u_s} = 500\\times\\dfrac{340}{306} = 555.6$ Hz.',
      trap: 'Using the moving-observer formula $f(v + u)/v$ gives 550 Hz: the two cases are not the same.' },
    { id: 'sdp-010', type: 'nat', level: 2, exams: ['jam'], sub: 'doppler', unit: 'Hz',
      q: 'A listener moves at $34$ m/s straight towards a source of $500$ Hz at rest in still air (speed of sound $340$ m/s). The listener hears ______ Hz.',
      answer: 550, tol: 0.1, calc: () => 500 * (340 + 34) / 340,
      sol: 'The wavelength in the air is unchanged, $\\lambda = 340/500 = 0.68$ m, but the listener meets crests at a relative speed $v + u_o = 374$ m/s: $f\' = 374/0.68 = 550$ Hz.' },
    { id: 'sdp-011', type: 'msq', level: 2, exams: ['jam'], sub: 'doppler', format: 'statements',
      q: 'Which statements about the Doppler effect for sound are correct?',
      options: ['A moving listener changes the frequency heard but not the wavelength in the air.', 'A moving source changes the wavelength in the air.', 'A steady wind blowing from a source to a listener, both at rest, changes the frequency heard.', 'The shift depends on the source and listener speeds separately, not only on their relative speed.'], answer: [0, 1, 3],
      sol: 'Sound travels in a medium, so motion relative to the air matters. A moving source squeezes the waves (wavelength changes); a moving listener just meets them faster. With both at rest and a wind, the crests arrive at the same rate they leave: the frequency is unchanged (only the speed and wavelength change). Source moving at $u$ and listener moving at $u$ the other way give different shifts, so only the separate speeds work, unlike light.',
      trap: 'Wind changes the wave speed and wavelength together, leaving the frequency unchanged.' },
    { id: 'sdp-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'decibels',
      q: 'The intensity of a sound is doubled. Its intensity level rises by about',
      options: ['$3$ dB', '$6$ dB', '$10$ dB', 'a factor of two in decibels'], answer: 0,
      sol: '$\\Delta\\beta = 10\\log_{10}2 = 3.01$ dB. Doubling the pressure amplitude (four times the intensity) adds 6 dB; ten times the intensity adds 10 dB.',
      trap: 'Decibels are logarithmic: doubling the intensity does not double the dB value.' },
    { id: 'sdp-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'speed of sound',
      q: 'The speed of sound in helium ($\\gamma = 5/3$, molar mass $4$ g/mol) at $300$ K is closest to',
      options: ['$340$ m/s', '$1020$ m/s', '$790$ m/s', '$3200$ m/s'], answer: 1,
      sol: '$v = \\sqrt{\\gamma RT/M} = \\sqrt{(5/3)(8.314)(300)/0.004} = \\sqrt{1.04\\times10^6} = 1019$ m/s, about three times faster than in air because helium atoms are so light.',
      trap: 'Using $M = 4$ kg/mol instead of $0.004$ kg/mol gives about 32 m/s; $790$ m/s comes from $\\gamma = 1$.' },
    { id: 'sdp-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'pipes',
      q: 'A pipe open at both ends has a fundamental of $300$ Hz. One end is now closed. The new fundamental is',
      options: ['$600$ Hz', '$300$ Hz', '$150$ Hz', '$75$ Hz'], answer: 2,
      sol: 'Open: $f = v/2L = 300$ Hz. Closed at one end: $f = v/4L$, half as much: $150$ Hz.' },
    { id: 'sdp-015', type: 'msq', level: 2, exams: ['jam'], sub: 'pipes', format: 'statements',
      q: 'For a pipe closed at one end, which statements are correct?',
      options: ['The closed end is a displacement node and a pressure antinode.', 'The open end is a displacement antinode.', 'The open end is a pressure antinode.', 'The second overtone is the fifth harmonic.'], answer: [0, 1, 3],
      sol: 'Air cannot move at the closed end (displacement node), so the pressure swings most there. At the open end the pressure stays at atmospheric (pressure node) and the air moves most. Only odd harmonics exist, so the overtones are the 3rd, 5th, ...: the second overtone is the 5th harmonic.',
      trap: 'Mixing up the pressure and displacement pictures: their nodes and antinodes are swapped.' },
    { id: 'sdp-016', type: 'nat', level: 2, exams: ['jam'], sub: 'resonance tube', unit: 'm/s',
      q: 'In a resonance-tube experiment with a $500$ Hz fork, the first two resonances occur at air-column lengths of $16.0$ cm and $50.0$ cm. The speed of sound is ______ m/s.',
      answer: 340, tol: 1, calc: () => 2 * 500 * (0.50 - 0.16),
      sol: 'Neighbouring resonances of a closed column are half a wavelength apart: $\\lambda/2 = 50.0 - 16.0 = 34.0$ cm, so $\\lambda = 0.68$ m and $v = f\\lambda = 340$ m/s. Using the difference cancels the end correction.',
      trap: 'Using $\\lambda = 4\\times16$ cm ignores the end correction and gives 320 m/s.' },

    // ---------- level 3 ----------
    { id: 'sdp-017', type: 'nat', level: 3, exams: ['jam'], sub: 'resonance tube', unit: 'cm',
      q: 'In a resonance tube the first two resonances occur at $16.0$ cm and $50.0$ cm. The end correction is ______ cm.',
      answer: 1, tol: 0.05, calc: () => (50 - 3 * 16) / 2,
      sol: '$l_1 + e = \\lambda/4$ and $l_2 + e = 3\\lambda/4$. So $l_2 + e = 3(l_1 + e)$, giving $e = (l_2 - 3l_1)/2 = (50 - 48)/2 = 1.0$ cm. (For a tube of radius $r$, $e \\approx 0.6r$.)' },
    { id: 'sdp-018', type: 'nat', level: 3, exams: ['jam'], sub: 'echo', unit: 'Hz',
      q: 'A car drives at $20$ m/s straight towards a large wall, sounding a $400$ Hz horn. The speed of sound is $340$ m/s. The frequency of the echo heard by the driver is ______ Hz.',
      answer: 450, tol: 0.1, calc: () => 400 * (340 + 20) / (340 - 20),
      sol: 'Step 1: the wall is a listener at rest and the car a moving source: the wall receives $f_1 = 400\\times340/320 = 425$ Hz. Step 2: the wall re-emits $425$ Hz as a source at rest; the driver is a listener moving towards it: $f_2 = 425\\times360/340 = 450$ Hz. Together $f(v + u)/(v - u)$.',
      trap: 'Doing only one Doppler step: the wall is first a listener, then a source.' },
    { id: 'sdp-019', type: 'mcq', level: 3, exams: ['jam'], sub: 'shock waves',
      q: 'A jet flies at Mach 2. The half-angle of its shock (Mach) cone is',
      options: ['$60^\\circ$', '$45^\\circ$', '$15^\\circ$', '$30^\\circ$'], answer: 3,
      sol: 'In time $t$ the jet goes $ut$ while the sound from its starting point spreads to radius $vt$. The cone touches all these spheres: $\\sin\\theta = vt/ut = 1/M = 1/2$, so $\\theta = 30^\\circ$.',
      trap: 'Using $\\cos\\theta = 1/M$ gives $60^\\circ$.' },
    { id: 'sdp-020', type: 'nat', level: 3, exams: ['jam'], sub: 'doppler', unit: 'm/s',
      q: 'A train whistle sounds at $440$ Hz to a listener on the platform as it approaches and $360$ Hz as it moves away, at constant speed. The speed of sound is $340$ m/s. The train\'s speed is ______ m/s.',
      answer: 34, tol: 0.1, calc: () => 340 * (440 - 360) / (440 + 360),
      sol: '$f_a = fv/(v - u)$ and $f_r = fv/(v + u)$, so $f_a/f_r = (v + u)/(v - u) = 440/360 = 11/9$. Then $9(v + u) = 11(v - u)$, so $u = v/10 = 34$ m/s. (The whistle itself is $f = f_a(v - u)/v = 396$ Hz.)',
      trap: 'Assuming the true frequency is the average, 400 Hz; it is not, because the source formula is not symmetric.' },
    { id: 'sdp-021', type: 'mcq', level: 3, exams: ['jam'], sub: 'doppler',
      q: 'A source of frequency $f$ moves at speed $u$ towards a listener at rest. A wind of speed $w$ blows from the listener towards the source. With $v$ the speed of sound in still air, the listener hears',
      options: ['$f\\dfrac{v}{v - u}$', '$f\\dfrac{v + w}{v + w - u}$', '$f\\dfrac{v - w}{v - u}$', '$f\\dfrac{v - w}{v - w - u}$'], answer: 3,
      sol: 'Relative to the ground, sound going from source to listener (against the wind) travels at $v - w$. Replace $v$ by $v - w$ in the moving-source formula: $f\' = f(v - w)/(v - w - u)$.',
      trap: 'Adding the wind speed: here the sound goes against the wind.' },
    { id: 'sdp-022', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'relativistic doppler', format: 'statements',
      q: 'Which statements about the Doppler effect for light in vacuum are correct?',
      options: ['Light from a source moving exactly at right angles to the line of sight shows no shift at all.', 'For a source receding at speed $\\beta c$, $f\' = f\\sqrt{(1 - \\beta)/(1 + \\beta)}$.', 'For $\\beta \\ll 1$ the fractional shift is about $-\\beta$ for recession.', 'The shift depends only on the relative velocity of source and observer.'], answer: [1, 2, 3],
      sol: 'Light needs no medium, so only the relative velocity matters. The longitudinal formula is $\\sqrt{(1 - \\beta)/(1 + \\beta)} \\approx 1 - \\beta$. Even at right angles there is a shift, $f\' = f\\sqrt{1 - \\beta^2}$ in the observer\'s frame, from time dilation (the transverse Doppler effect).',
      trap: 'Carrying over the classical result "no shift at right angles" ignores time dilation.' },
    { id: 'sdp-023', type: 'nat', level: 3, exams: ['jam'], sub: 'relativistic doppler', unit: 'km/s',
      q: 'The hydrogen line at $656.3$ nm is seen at $662.9$ nm in a galaxy\'s spectrum. Treating the shift as non-relativistic, the galaxy recedes at about ______ km/s ($c = 3\\times10^5$ km/s).',
      answer: 3017, tol: 15, calc: () => 3e5 * 6.6 / 656.3,
      sol: '$z = \\Delta\\lambda/\\lambda = 6.6/656.3 = 0.01006$. For $z \\ll 1$, $v \\approx cz = 3\\times10^5\\times0.01006 = 3017$ km/s.' },
    { id: 'sdp-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'beats',
      q: 'A listener walks at speed $u$ from one source towards another identical source; both emit frequency $f$ and are at rest. With the speed of sound $v$, the beat frequency heard is',
      options: ['$fu/v$', '$2fu/v$', '$2f$', 'zero, since the sources are identical'], answer: 1,
      sol: 'Towards the source ahead: $f(v + u)/v$. Away from the one behind: $f(v - u)/v$. Beats: the difference, $2fu/v$.' },
    { id: 'sdp-025', type: 'nat', level: 3, exams: ['jam'], sub: 'beats',
      q: 'Two identical speakers emit $340$ Hz. A person walks at $3$ m/s along the line from one speaker towards the other (speed of sound $340$ m/s). The number of beats per second heard is ______.',
      answer: 6, tol: 0, calc: () => 2 * 340 * 3 / 340,
      sol: 'Front speaker: $340\\times343/340 = 343$ Hz. Rear speaker: $340\\times337/340 = 337$ Hz. Beats: $6$ per second ($= 2fu/v$).' },
    { id: 'sdp-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'decibels',
      q: 'Two independent (incoherent) machines each produce $60$ dB at a point. Together they produce',
      options: ['about $63$ dB', '$120$ dB', 'about $66$ dB', '$60$ dB'], answer: 0,
      sol: 'Incoherent intensities add: $2\\times10^{-6}$ W/m². $\\beta = 10\\log_{10}(2\\times10^6) = 63.0$ dB.',
      trap: 'Adding decibel values (120 dB); or 66 dB, which would need the amplitudes to add coherently in phase.' },
    { id: 'sdp-027', type: 'mcq', level: 3, exams: ['jam'], sub: 'speed of sound',
      q: 'Longitudinal sound waves in a thin steel rod (Young\'s modulus $2\\times10^{11}$ Pa, density $8000$ kg/m³) travel at',
      options: ['$5000$ m/s', '$500$ m/s', '$1581$ m/s', '$50\\,000$ m/s'], answer: 0,
      sol: 'In a thin rod $v = \\sqrt{Y/\\rho} = \\sqrt{2\\times10^{11}/8000} = \\sqrt{2.5\\times10^7} = 5000$ m/s, about fifteen times faster than in air.' },
    { id: 'sdp-028', type: 'msq', level: 3, exams: ['jam'], sub: 'pressure waves', format: 'statements',
      q: 'A sound wave has displacement $s = s_0\\sin(kx - \\omega t)$ in a gas of density $\\rho$ where sound travels at $v$. Which statements are correct?',
      options: ['The pressure wave is $90^\\circ$ out of phase with the displacement wave.', 'The pressure amplitude is $\\rho v\\omega s_0$.', 'The intensity is $p_0^2/(2\\rho v)$.', 'At a displacement node of a standing wave the pressure does not vary.'], answer: [0, 1, 2],
      sol: '$p = -B\\,\\partial s/\\partial x = -Bks_0\\cos(kx - \\omega t)$: a quarter cycle shifted, with $p_0 = Bks_0 = \\rho v^2ks_0 = \\rho v\\omega s_0$. Intensity $\\tfrac12\\rho v\\omega^2s_0^2 = p_0^2/(2\\rho v)$. At a displacement node the air is squeezed from both sides: the pressure varies most (a pressure antinode).' },

    // ---------- level 4 ----------
    { id: 'sdp-029', type: 'nat', level: 4, exams: ['jam'], sub: 'decibels', unit: 'dB',
      q: 'A sound wave in air ($\\rho = 1.2$ kg/m³, $v = 340$ m/s) has a pressure amplitude of $0.02$ Pa. Its intensity level (reference $10^{-12}$ W/m²) is ______ dB (to one decimal place).',
      answer: 56.9, tol: 0.1, calc: () => 10 * Math.log10(0.02 ** 2 / (2 * 1.2 * 340) / 1e-12),
      sol: '$I = p_0^2/(2\\rho v) = 4\\times10^{-4}/(816) = 4.90\\times10^{-7}$ W/m². $\\beta = 10\\log_{10}(4.90\\times10^5) = 56.9$ dB.',
      trap: 'Using $p_0^2/(\\rho v)$ (the r.m.s. pressure counted twice) adds 3 dB.' },
    { id: 'sdp-030', type: 'mcq', level: 4, exams: ['jam'], sub: 'doppler',
      q: 'A whistle is whirled in a horizontal circle at constant speed. A listener stands at the centre of the circle. The listener hears',
      options: ['a frequency that rises and falls once per revolution', 'a steady frequency higher than the whistle\'s', 'a steady frequency lower than the whistle\'s', 'the whistle\'s own frequency, unchanged'], answer: 3,
      sol: 'The Doppler shift depends on the velocity component along the line joining source and listener. For a listener at the centre the velocity is always perpendicular to that line, so (for sound, with speeds well below light) there is no shift. A listener outside the circle would hear the frequency rise and fall.' },
    { id: 'sdp-031', type: 'nat', level: 4, exams: ['jam'], sub: 'echo', unit: 'kHz',
      q: 'A bat flies at $10$ m/s straight towards a wall, emitting $40.00$ kHz. The speed of sound is $340$ m/s. The bat hears the echo at ______ kHz (to two decimal places).',
      answer: 42.42, tol: 0.02, calc: () => 40 * 350 / 330,
      sol: 'Wall receives $40\\times340/330$ kHz (moving source). Bat, moving towards the wall, hears $40\\times\\dfrac{340}{330}\\times\\dfrac{350}{340} = 40\\times\\dfrac{350}{330} = 42.42$ kHz.' },
    { id: 'sdp-032', type: 'msq', level: 4, exams: ['jam'], sub: 'pipes', format: 'statements',
      q: 'Which statements about organ pipes are correct?',
      options: ['Warming the air raises all the resonant frequencies of a pipe.', 'The same pipe filled with helium sounds higher.', 'For a pipe closed at one end, the first overtone is three times the fundamental.', 'The end correction makes the effective length shorter than the pipe.'], answer: [0, 1, 2],
      sol: 'Every resonance is proportional to $v$, which grows with $\\sqrt T$ and is larger in helium. A closed pipe has only odd harmonics, so its first overtone is the 3rd harmonic. The antinode sits slightly outside the open end (about $0.6r$), so the effective length is longer than the pipe, and the frequencies are slightly lower than $v/4L$.' },
    { id: 'sdp-033', type: 'nat', level: 4, exams: ['jam'], sub: 'doppler', unit: 'Hz',
      q: 'A car with a $600$ Hz horn moves at $20$ m/s towards a cyclist riding at $10$ m/s towards the car, along the same road in still air ($v = 340$ m/s). The cyclist hears ______ Hz (to two decimal places).',
      answer: 656.25, tol: 0.3, calc: () => 600 * (340 + 10) / (340 - 20),
      sol: '$f\' = f\\dfrac{v + u_o}{v - u_s} = 600\\times\\dfrac{350}{320} = 656.25$ Hz.',
      trap: 'Using the relative speed 30 m/s in a single formula gives a different (wrong) answer.' },
    { id: 'sdp-034', type: 'mcq', level: 4, exams: ['jam'], sub: 'doppler',
      q: 'A train with a whistle of frequency $f$ passes a listener standing some distance from a straight track. At the instant the train is at the point of closest approach, the frequency the listener hears is',
      options: ['exactly $f$, because the train is moving at right angles to the line of sight', 'lower than $f$', 'zero', 'higher than $f$, because the sound arriving then left the train earlier, while it was still approaching'], answer: 3,
      sol: 'Sound takes time to reach the listener. What arrives when the train is closest was emitted a little earlier, when the train still had a velocity component towards the listener. So the heard frequency is still above $f$; it equals $f$ slightly after closest approach.',
      trap: 'Using where the train is now instead of where it was when the sound left it.' },
    { id: 'sdp-035', type: 'nat', level: 4, exams: ['jam'], sub: 'shock waves', unit: 's',
      q: 'A jet flies level at Mach 2 at a height of $3400$ m ($v = 340$ m/s). The time after it passes directly overhead until a person on the ground hears its sonic boom is ______ s (to two decimal places).',
      answer: 8.66, tol: 0.05, calc: () => 3400 * Math.sqrt(3) / 680,
      sol: 'Cone half-angle: $\\sin\\theta = 1/2$, $\\theta = 30^\\circ$. When the cone\'s edge reaches the person, the jet is a horizontal distance $x = h/\\tan\\theta = 3400\\sqrt3 = 5889$ m past them. At $680$ m/s that takes $5889/680 = 8.66$ s.',
      trap: 'Using $h/v = 10$ s, as if the boom came straight down from overhead.' },
    { id: 'sdp-036', type: 'mcq', level: 4, exams: ['jam'], sub: 'decibels',
      q: 'A small source radiates equally in all directions. At $20$ m its level is $80$ dB. Ignoring absorption, at $200$ m it is',
      options: ['$70$ dB', '$60$ dB', '$40$ dB', '$8$ dB'], answer: 1,
      sol: 'Intensity falls as $1/r^2$: ten times further means $1/100$ of the intensity, which is $-20$ dB. So $60$ dB.',
      trap: 'Taking $1/r$ for intensity gives $70$ dB; dividing the dB value by 10 gives 8 dB.' },

    // ---------- level 5 ----------
    { id: 'sdp-037', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'echo', unit: 'm/s',
      q: 'A stationary speaker emits $1000$ Hz towards a car driving straight at it. A microphone beside the speaker picks up the emitted sound and the sound reflected from the car together, and records $125$ beats per second. With $v = 340$ m/s, the car\'s speed is ______ m/s.',
      answer: 20, tol: 0.05, calc: () => 125 * 340 / (2000 + 125),
      sol: 'The reflected frequency is $f(v + u)/(v - u)$, so the beat frequency is $f(v + u)/(v - u) - f = 2fu/(v - u)$. Then $125(340 - u) = 2000u$, giving $u = 42500/2125 = 20$ m/s.',
      trap: 'Using the low-speed shortcut $2fu/v$ gives $21.25$ m/s; the exact form has $v - u$.' },
    { id: 'sdp-038', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'beats', unit: 'Hz',
      q: 'A $680$ Hz source moves at $2$ m/s away from a listener at rest and straight towards a large wall. The listener hears the direct sound and the echo from the wall ($v = 340$ m/s). The beat frequency is ______ Hz (to two decimal places).',
      answer: 8.00, tol: 0.02, calc: () => 680 * 340 / 338 - 680 * 340 / 342,
      sol: 'Direct (source receding): $680\\times340/342 = 676.02$ Hz. The wall receives the source approaching: $680\\times340/338 = 684.02$ Hz, and reflects it unchanged (wall and listener are at rest). Beats: $684.02 - 676.02 = 8.00$ Hz ($= 2fuv/(v^2 - u^2)$).',
      trap: 'Applying a second Doppler step on reflection: the wall and listener are both at rest, so there is none.' },
    { id: 'sdp-039', type: 'mcq', level: 5, exams: ['jam'], sub: 'speed of sound',
      q: 'Which statement about the speed of sound in an ideal gas is NOT correct?',
      options: ['It is larger in humid air than in dry air at the same temperature and pressure.', 'It is proportional to the square root of the absolute temperature.', 'Raising the pressure at constant temperature raises it.', 'At the same temperature it is larger in hydrogen than in oxygen.'], answer: 2,
      sol: '$v = \\sqrt{\\gamma P/\\rho} = \\sqrt{\\gamma RT/M}$. At fixed $T$, raising $P$ raises $\\rho$ in the same proportion, so $v$ is unchanged: the third statement is false. Water vapour (18 g/mol) is lighter than air (29 g/mol), so humid air carries sound slightly faster; hydrogen (2 g/mol) is far lighter than oxygen (32 g/mol).',
      trap: '$\\sqrt{\\gamma P/\\rho}$ looks as if pressure matters on its own; density rises with it.' },
    { id: 'sdp-040', type: 'msq', level: 5, exams: ['jam'], sub: 'kundt tube', format: 'statements',
      q: 'In a Kundt\'s tube a metal rod $1.0$ m long, clamped at its middle, is stroked so that it vibrates in its fundamental longitudinal mode. Powder heaps in the air column are $5.0$ cm apart and sound travels at $340$ m/s in air. Which statements are correct?',
      options: ['The frequency is $3400$ Hz.', 'Sound travels at $6800$ m/s in the rod.', 'The rod vibrates in its second harmonic.', 'The ratio of the speeds in rod and air equals the rod length divided by the heap spacing.'], answer: [0, 1, 3],
      sol: 'Heaps sit at displacement nodes, $\\lambda_{air}/2 = 5$ cm apart, so $\\lambda_{air} = 0.10$ m and $f = 340/0.10 = 3400$ Hz. Clamped at the middle (a node) with free ends (antinodes), the fundamental has $L = \\lambda_{rod}/2$, so $\\lambda_{rod} = 2$ m and $v_{rod} = 6800$ m/s. Same frequency in both: $v_{rod}/v_{air} = \\lambda_{rod}/\\lambda_{air} = 2L/(2d) = L/d = 20$.',
      trap: 'Using the heap spacing as a whole wavelength halves the frequency.' },
  ],
  gens: [
    { id: 'sdp-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'pipes',
      make(r) {
        const L = pick(r, 0.2, 2, 0.05), closed = r() < 0.5, v = choose(r, [330, 340, 343, 350]), n = closed ? choose(r, [1, 3, 5]) : int(r, 1, 4);
        const f = closed ? n * v / (4 * L) : n * v / (2 * L);
        const kind = closed ? 'closed at one end' : 'open at both ends';
        return { q: `A pipe $${L}$ m long is ${kind}. With the speed of sound $${v}$ m/s and no end correction, the frequency of its harmonic number $${n}$ is ______ Hz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.002, 1)), unit: 'Hz', L, v, n, closed,
          sol: closed ? `Closed pipe: $f_n = nv/(4L)$ with odd $n$: $${n}\\times${v}/(4\\times${L}) = ${round(f, 1)}$ Hz.` : `Open pipe: $f_n = nv/(2L) = ${n}\\times${v}/(2\\times${L}) = ${round(f, 1)}$ Hz.`,
          trap: 'Closed pipes use $4L$ and only odd harmonics; open pipes use $2L$.' };
      },
      verify: (p) => p.n * p.v / ((p.closed ? 4 : 2) * p.L) },
    { id: 'sdp-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'doppler',
      make(r) {
        const f = choose(r, [256, 300, 400, 440, 500, 512, 600, 800, 1000]), u = int(r, 5, 60), v = choose(r, [330, 340, 343]), toward = r() < 0.5;
        const fp = toward ? f * v / (v - u) : f * v / (v + u);
        return { q: `A source of $${f}$ Hz moves at $${u}$ m/s straight ${toward ? 'towards' : 'away from'} a listener at rest in still air (speed of sound $${v}$ m/s). The listener hears ______ Hz (to one decimal place).`,
          answer: round(fp, 1), tol: 0.2, unit: 'Hz', f, u, v, toward,
          sol: `$f' = f\\dfrac{v}{v ${toward ? '-' : '+'} u_s} = ${f}\\times\\dfrac{${v}}{${toward ? v - u : v + u}} = ${round(fp, 1)}$ Hz.`,
          trap: 'For a moving source the speed goes in the denominator.' };
      },
      verify: (p) => p.f * p.v / (p.v + (p.toward ? -p.u : p.u)) },
    { id: 'sdp-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'doppler',
      make(r) {
        const f = choose(r, [300, 400, 500, 600, 680, 800]), uo = int(r, 2, 40), us = int(r, 2, 40), v = 340;
        const fp = f * (v + uo) / (v - us);
        return { q: `A source of $${f}$ Hz moving at $${us}$ m/s and a listener moving at $${uo}$ m/s approach each other along a line in still air ($v = ${v}$ m/s). The listener hears ______ Hz (to one decimal place).`,
          answer: round(fp, 1), tol: 0.2, unit: 'Hz', f, uo, us, v,
          sol: `$f' = f\\dfrac{v + u_o}{v - u_s} = ${f}\\times\\dfrac{${v + uo}}{${v - us}} = ${round(fp, 1)}$ Hz.`,
          trap: 'Listener speed in the numerator, source speed in the denominator.' };
      },
      verify: (p) => p.f * (p.v + p.uo) / (p.v - p.us) },
    { id: 'sdp-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'decibels',
      make(r) {
        const b1 = int(r, 40, 100), N = choose(r, [2, 3, 4, 5, 10, 20, 100]);
        const b = b1 + 10 * Math.log10(N);
        return { q: `One machine produces $${b1}$ dB at a point. $${N}$ identical, independent machines together produce ______ dB there (to one decimal place).`,
          answer: round(b, 1), tol: 0.1, unit: 'dB', b1, N,
          sol: `Incoherent intensities add: $I = ${N}I_1$, so $\\beta = ${b1} + 10\\log_{10}${N} = ${round(b, 1)}$ dB.`,
          trap: 'Decibels do not add; intensities do.' };
      },
      verify: (p) => p.b1 + 10 * Math.log10(p.N) },
    { id: 'sdp-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'echo',
      make(r) {
        const f = choose(r, [400, 500, 600, 1000, 2000]), u = int(r, 5, 40), v = 340;
        const fe = f * (v + u) / (v - u);
        return { q: `A car moving at $${u}$ m/s straight towards a wall sounds a $${f}$ Hz horn ($v = ${v}$ m/s). The driver hears the echo at ______ Hz (to one decimal place).`,
          answer: round(fe, 1), tol: 0.2, unit: 'Hz', f, u, v,
          sol: `Two Doppler steps: $f'' = f\\dfrac{v + u}{v - u} = ${f}\\times\\dfrac{${v + u}}{${v - u}} = ${round(fe, 1)}$ Hz.`,
          trap: 'The wall first receives a shifted frequency, then the moving driver shifts it again.' };
      },
      verify: (p) => p.f * (p.v + p.u) / (p.v - p.u) },
    { id: 'sdp-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'resonance tube',
      make(r) {
        const f = choose(r, [256, 288, 320, 384, 480, 512]), v = int(r, 330, 350), e = pick(r, 0.5, 1.5, 0.1);
        const l1 = round(v / (4 * f) * 100 - e, 1), l2 = round(3 * v / (4 * f) * 100 - e, 1);
        const vv = 2 * f * (l2 - l1) / 100;
        return { q: `With a $${f}$ Hz fork, a resonance tube resonates first at $${l1}$ cm and next at $${l2}$ cm. The speed of sound is ______ m/s (to the nearest whole number).`,
          answer: Math.round(vv), tol: 1, unit: 'm/s', f, l1, l2,
          sol: `$\\lambda/2 = l_2 - l_1 = ${round(l2 - l1, 1)}$ cm, so $v = 2f(l_2 - l_1) = 2\\times${f}\\times${round((l2 - l1) / 100, 3)} = ${round(vv, 1)}$ m/s.`,
          trap: 'Using $4l_1$ ignores the end correction.' };
      },
      verify: (p) => 2 * p.f * (p.l2 - p.l1) / 100 },
    { id: 'sdp-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'shock waves',
      make(r) {
        const M = choose(r, [1.25, 1.5, 2, 2.5, 3]), h = int(r, 2, 12) * 500, v = 340;
        const t = h * Math.sqrt(M * M - 1) / (M * v);
        return { q: `A jet flies level at Mach $${M}$ at a height of $${h}$ m ($v = ${v}$ m/s). The time from when it is directly overhead until the boom is heard on the ground is ______ s (to two decimal places).`,
          answer: round(t, 2), tol: 0.02, unit: 's', M, h, v,
          sol: `$\\sin\\theta = 1/M$, so $\\tan\\theta = 1/\\sqrt{M^2 - 1}$. The jet is $x = h\\sqrt{M^2 - 1} = ${round(h * Math.sqrt(M * M - 1), 0)}$ m past when the cone arrives: $t = x/(Mv) = ${round(t, 2)}$ s.`,
          trap: 'The boom does not come straight down; it trails behind on the cone.' };
      },
      verify: (p) => p.h * Math.sqrt(p.M ** 2 - 1) / (p.M * p.v) },
    { id: 'sdp-g08', type: 'mcq', level: 2, exams: ['jam'], sub: 'beats',
      make(r) {
        const f0 = choose(r, [256, 320, 384, 440, 512]), b = int(r, 2, 6), wax = r() < 0.5, up = r() < 0.5;
        // wax lowers the unknown; filing raises it. Beats go up or down as stated.
        const lower = f0 - b, higher = f0 + b;
        // wax (lower f): beats up => unknown was below; beats down => above. filing (raise f): beats up => above; down => below.
        const right = wax ? (up ? lower : higher) : (up ? higher : lower);
        const o = mcqOptions(r, right, [right === lower ? higher : lower, f0, f0 + 2 * b], (v) => `$${v}$ Hz`);
        return { q: `A $${f0}$ Hz fork and an unknown fork give $${b}$ beats per second. After the unknown fork is ${wax ? 'loaded with a little wax' : 'filed slightly'}, the number of beats ${up ? 'increases' : 'decreases'}. The unknown frequency was`, ...o,
          sol: `It was $${f0} \\pm ${b}$. ${wax ? 'Wax lowers' : 'Filing raises'} the unknown frequency. Since the beats ${up ? 'increased, it moved away from' : 'decreased, it moved towards'} $${f0}$ Hz, so it started at $${right}$ Hz.`,
          trap: 'Wax lowers a fork\'s frequency; filing the prongs raises it.' };
      } },
  ],
};
