// Round 4 extras for sound-doppler: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'sdp-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'speed of sound',
      q: R`The pressure of the air in a sealed room is doubled while its temperature is kept fixed (treat air as an ideal gas). The speed of sound in it`,
      options: ['doubles', R`rises by a factor $\sqrt2$`, 'stays the same', 'halves'], answer: 2,
      sol: R`$v = \sqrt{\gamma p/\rho}$. At fixed temperature the density rises in proportion to the pressure ($p = \rho RT/M$), so $p/\rho = RT/M$ is unchanged and $v = \sqrt{\gamma RT/M}$ stays the same. The speed of sound in an ideal gas depends on temperature and molar mass, not on pressure.`,
      trap: R`Looking only at $p$ in $\sqrt{\gamma p/\rho}$ and forgetting that $\rho$ changes too.` },
    { id: 'sdp-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'Doppler effect',
      q: R`A car and a cyclist move in the same direction along a straight road at the same speed, through still air. The car is behind and sounds its horn of frequency $f$. The cyclist hears`,
      options: [R`$f$`, R`more than $f$`, R`less than $f$`, R`$f\,\dfrac{v + u}{v - u}$, where $u$ is their common speed`], answer: 0,
      sol: R`Measured in the air: the source moves towards the listener at $u$, giving a factor $\dfrac{v}{v - u}$; the listener moves away from the source at $u$, giving $\dfrac{v - u}{v}$. Together $f' = f\dfrac{v - u}{v - u} = f$. With no relative motion between source and listener, there is no Doppler shift (in still air the waves arrive at the same rate they are sent).`,
      trap: R`Applying only the moving-source factor gives "more than $f$"; both motions count.` },
    { id: 'sdp-r4-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'loudness',
      q: R`Two sounds differ in intensity level by 20 dB. The ratio of their pressure amplitudes is`,
      options: ['100', '10', '20', R`$\sqrt{20}$`], answer: 1,
      sol: R`20 dB means an intensity ratio of $10^{20/10} = 100$. Intensity goes as pressure amplitude squared, so the pressure amplitudes differ by $\sqrt{100} = 10$. (Equivalently, the level is $20\log_{10}(p_1/p_2)$ in terms of pressure.)`,
      trap: R`100 is the intensity ratio, not the amplitude ratio.` },
    { id: 'sdp-r4-04', type: 'msq', level: 2, exams: ['jam'], sub: 'speed of sound', format: 'statements',
      q: R`Which of these changes make sound travel faster in a gas?`,
      options: ['Raising the temperature of the air', 'Raising the pressure of the air at constant temperature', 'Making the air more humid at the same temperature and pressure', 'Replacing the air by carbon dioxide at the same temperature'], answer: [0, 2],
      sol: R`$v = \sqrt{\gamma RT/M}$. Higher $T$: faster. Pressure at fixed $T$: no effect. Water vapour ($M = 18$ g/mol) is lighter than the nitrogen and oxygen it replaces (average 29 g/mol), so humid air has a lower $M$ and carries sound slightly faster. Carbon dioxide ($M = 44$ g/mol, and a smaller $\gamma$) is slower.`,
      trap: R`Humid air feels "heavy", but water molecules are lighter than air molecules.` },
    { id: 'sdp-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'reflection and transmission',
      q: R`A swimmer under water hears very little of a conversation above the pool. The main reason is that`,
      options: ['water absorbs sound very strongly', 'sound travels more slowly in water than in air', 'the frequency of sound changes at the surface', 'air and water have very different acoustic impedances, so almost all the sound is reflected at the surface'], answer: 3,
      sol: R`The fraction of intensity transmitted across a boundary is $\dfrac{4Z_1Z_2}{(Z_1 + Z_2)^2}$, with $Z = \rho v$. For air $Z \approx 415$ kg m⁻² s⁻¹ and for water about $1.48\times10^6$, so only about 0.1% gets through (a loss of about 30 dB). Water absorbs audible sound weakly, sound is about 4 times faster in water, and frequency never changes at a boundary.`,
      trap: R`The loss is at the surface (reflection), not inside the water.` },
    { id: 'sdp-r4-06', type: 'mcq', level: 3, exams: ['jam'], sub: 'Doppler effect',
      q: R`A source of fixed frequency stands at the centre of a field. A listener runs round it on a circle at constant speed (still air). The frequency the listener hears`,
      options: ['equals the source frequency', 'is higher than the source frequency', 'is lower than the source frequency', 'rises and falls once per lap'], answer: 0,
      sol: R`The Doppler effect depends on the component of velocity along the line joining source and listener. On a circle about the source the listener's velocity is always perpendicular to that line, so the distance never changes and the waves arrive at exactly the rate they are sent. (For sound in still air there is no transverse Doppler effect at all.)`,
      trap: R`Speed alone does not shift the frequency; only motion towards or away from the source does.` },
    { id: 'sdp-r4-07', type: 'nat', level: 3, exams: ['jam'], sub: 'interference',
      q: R`In a Quincke tube, sound splits into two paths that rejoin at a detector. Sliding the adjustable U-section out by 5.0 cm takes the detected sound from one minimum to the next. With the speed of sound 340 m/s, the frequency is ______ Hz.`,
      answer: 3400, tol: 0, calc: () => 340 / (2 * 0.05), unit: 'Hz',
      sol: R`Pulling the U-section out by $d$ lengthens that path by $2d$ (both arms of the U). Successive minima are one wavelength of path difference apart, so $\lambda = 2\times5.0 = 10$ cm and $f = v/\lambda = 340/0.10 = 3400$ Hz.`,
      trap: R`Setting $\lambda = 5$ cm forgets that the sliding section adds length on both of its arms.` },
    { id: 'sdp-r4-08', type: 'nat', level: 3, exams: ['jam'], sub: 'Doppler effect', format: 'numeric',
      q: R`A 600 Hz siren moves in a straight line at 30 m/s. A listener at rest some way off the line hears sound that left the siren when the siren's velocity made an angle of $60^\circ$ with the line from the siren to the listener. With the speed of sound 340 m/s, the frequency heard is ______ Hz (to one decimal place).`,
      answer: 627.7, tol: 0.3, calc: () => 600 * 340 / (340 - 30 * 0.5), unit: 'Hz',
      sol: R`Only the velocity component towards the listener at the moment of emission matters: $u\cos60^\circ = 15$ m/s. So $f' = f\dfrac{v}{v - u\cos\theta} = 600\times\dfrac{340}{325} = 627.7$ Hz.`,
      trap: R`Using the full 30 m/s gives 657.7 Hz, the value only for a source heading straight at the listener.` },
    { id: 'sdp-r4-09', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Doppler effect', format: 'numeric',
      q: R`A medical ultrasound probe sends 5.0 MHz waves into tissue (speed 1540 m/s) and receives the echo from blood moving at 0.30 m/s, the beam making $30^\circ$ with the flow (blood moving towards the probe). The frequency shift of the echo is ______ Hz (to the nearest hertz).`,
      answer: 1687, tol: 5, calc: () => 2 * 5e6 * 0.3 * Math.cos(Math.PI / 6) / 1540, unit: 'Hz',
      sol: R`The blood is first a moving receiver, then a moving source, so the shift doubles: $\Delta f \approx \dfrac{2fu\cos\theta}{c} = \dfrac{2\times5\times10^6\times0.30\times0.866}{1540} = 1687$ Hz, an audible tone, which is how Doppler ultrasound lets you "hear" blood flow. (Since $u \ll c$, the exact expression differs only in the fourth significant figure.)`,
      trap: R`Forgetting the factor 2 for the reflection halves the shift.` },
    { id: 'sdp-r4-10', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'Doppler effect', format: 'statements',
      q: R`A Doppler ultrasound probe at rest measures echoes from blood moving at speed $u$ (much less than the sound speed $c$), the beam making angle $\theta$ with the flow. Which statements are correct?`,
      options: [R`The frequency shift is proportional to $\cos\theta$`, 'There are two Doppler steps (the blood receives, then re-sends), which double the shift', 'No shift is measured when the beam is perpendicular to the flow', 'At a fixed flow speed, a higher transmitted frequency gives a smaller shift'], answer: [0, 1, 2],
      sol: R`$\Delta f \approx 2fu\cos\theta/c$. Only the velocity component along the beam counts (hence $\cos\theta$, and zero at $90^\circ$). The moving blood first hears a shifted frequency, then re-emits it as a moving source, so the shift appears twice. The shift is proportional to $f$, so higher frequencies give larger shifts, not smaller.`,
      trap: R`The shift is a fraction $2u\cos\theta/c$ of the frequency; it grows with $f$.` },
    { id: 'sdp-r4-11', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'reflection and transmission', format: 'numeric',
      q: R`Sound meets a flat water surface at normal incidence from the air. Take acoustic impedances $Z_{\rm air} = 415$ kg m⁻² s⁻¹ and $Z_{\rm water} = 1.48\times10^6$ kg m⁻² s⁻¹. The percentage of the incident intensity transmitted into the water is ______ % (to three decimal places).`,
      answer: 0.112, tol: 0.002, calc: () => 100 * 4 * 415 * 1.48e6 / (415 + 1.48e6) ** 2, unit: '%',
      sol: R`The intensity transmission coefficient is $\dfrac{4Z_1Z_2}{(Z_1 + Z_2)^2} = \dfrac{4\times415\times1.48\times10^6}{(1.4804\times10^6)^2} = 1.12\times10^{-3}$, that is 0.112% (a drop of about 29.5 dB). Nearly all the sound is reflected.`,
      trap: R`$Z_1/Z_2 = 2.8\times10^{-4}$ is not the transmitted fraction; the formula has the factor 4 and the sum squared.` },
    { id: 'sdp-r4-12', type: 'mcq', level: 5, exams: ['jam', 'gate'], sub: 'Doppler effect',
      q: R`A jet flies at Mach 2 straight towards a distant listener, along the line joining them, while its engine noise varies continually. Which describes what the listener hears?`,
      options: ['The sounds in the order they were made, at a raised pitch', 'Nothing until the jet has passed, then the sounds in the order they were made, at a lowered pitch', 'The jet arrives before its sound; then the sounds made during the approach arrive in reverse order, the latest first', 'All the sounds at once, for ever'], answer: 2,
      sol: R`Sound emitted at time $t_e$, when the jet is $D - ut_e$ away, arrives at $t = t_e + \dfrac{D - ut_e}{v} = \dfrac Dv + t_e\left(1 - \dfrac uv\right)$. With $u = 2v$ the bracket is $-1$: later emissions arrive earlier. The jet itself reaches the listener at $D/u = D/2v$, the same moment as the sound emitted just as it arrives (the boom); the earlier noise follows, played backwards. The Doppler factor $v/(v - u) = -1$ says the same: reversed in time, unchanged in pitch at Mach 2.`,
      trap: R`A negative Doppler factor means time-reversed sound, not "no sound".` },
  ],
  gens: [
    { id: 'sdp-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'interference',
      make(r) {
        const d = pick(r, 1, 10, 0.5), v = choose(r, [330, 340, 343, 350]);
        const answer = round(v / (2 * d / 100), 1);
        return { q: R`In a Quincke tube the sliding U-section is moved out by ${d} cm to go from one minimum of detected sound to the next. With the speed of sound ${v} m/s, find the frequency (Hz).`,
          answer, tol: Math.max(1, answer * 0.005), unit: 'Hz', d, v,
          sol: R`Moving the U-section by $d$ changes the path by $2d$, and successive minima are one wavelength apart: $\lambda = 2\times${d} = ${round(2 * d, 2)}$ cm. So $f = v/\lambda = ${v}/${round(2 * d / 100, 4)} = ${answer}$ Hz.`,
          trap: 'The U-section has two arms, so the path changes by twice the slide.' };
      },
      verify: (p) => p.v / (2 * p.d / 100) },
    { id: 'sdp-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'Doppler effect',
      make(r) {
        const f = int(r, 3, 12) * 100, u = int(r, 2, 8) * 5, deg = choose(r, [0, 30, 45, 60, 90, 120, 135, 150, 180]), v = 340;
        const c = Math.cos(deg * Math.PI / 180), answer = round(f * v / (v - u * c), 2);
        return { q: R`A ${f} Hz source moves in a straight line at ${u} m/s through still air. A listener at rest hears sound that left the source when its velocity made ${deg}° with the line from the source to the listener. Find the frequency heard (Hz), taking $v = 340$ m/s.`,
          answer, tol: Math.max(0.5, answer * 0.001), unit: 'Hz', f, u, deg,
          sol: R`Only the component $u\cos\theta = ${round(u * c, 3)}$ m/s towards the listener at emission matters: $f' = \dfrac{fv}{v - u\cos\theta} = \dfrac{${f}\times340}{${round(v - u * c, 3)}} = ${answer}$ Hz.`,
          trap: 'Use the angle at the moment of emission, and only the component of velocity along the line to the listener.' };
      },
      verify: (p) => p.f * 340 / (340 - p.u * Math.cos(p.deg * Math.PI / 180)) },
    { id: 'sdp-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Doppler effect',
      make(r) {
        const f = choose(r, [2, 2.5, 3, 4, 5, 7.5, 10]), u = pick(r, 0.1, 1, 0.1), deg = choose(r, [0, 20, 30, 45, 60]);
        const answer = round(2 * f * 1e6 * u * Math.cos(deg * Math.PI / 180) / 1540, 1);
        return { q: R`A Doppler ultrasound probe sends ${f} MHz into tissue (sound speed 1540 m/s). Blood moves towards the probe at ${u} m/s, at ${deg}° to the beam. Find the frequency shift of the echo in Hz.`,
          answer, tol: Math.max(2, answer * 0.005), unit: 'Hz', f, u, deg,
          sol: R`Two Doppler steps (blood as moving receiver, then as moving source): $\Delta f \approx \dfrac{2fu\cos\theta}{c} = \dfrac{2\times${f}\times10^6\times${u}\times${round(Math.cos(deg * Math.PI / 180), 4)}}{1540} = ${answer}$ Hz.`,
          trap: 'The echo carries the shift twice; and only the component along the beam counts.' };
      },
      verify: (p) => 2 * p.f * 1e6 * p.u * Math.cos(p.deg * Math.PI / 180) / 1540 },
  ],
};
