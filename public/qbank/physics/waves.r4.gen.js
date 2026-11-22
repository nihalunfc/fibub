// Round 4 extras for waves: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'wav-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'wave speed',
      q: R`A wave passes from a light string onto a heavier string tied to it (both under the same tension). Which quantity is the same on both strings?`,
      options: ['the wave speed', 'the frequency', 'the wavelength', 'the amplitude'], answer: 1,
      sol: R`The junction moves as one point, so it oscillates at one frequency, and it drives the second string at that frequency. The speed $\sqrt{T/\mu}$ is lower on the heavier string, so the wavelength $v/f$ is shorter there. Part of the wave is reflected, so the amplitude changes as well.`,
      trap: R`Speed belongs to the medium; frequency belongs to the source.` },
    { id: 'wav-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'energy in waves',
      q: R`A long straight line source sends out cylindrical waves into a uniform medium with no absorption. At distance $r$ from the line, the wave amplitude falls as`,
      options: [R`$1/r^2$`, R`$1/r$`, R`$1/\sqrt r$`, 'it does not fall at all'], answer: 2,
      sol: R`The power per unit length of the source spreads over a cylinder of circumference $2\pi r$, so the intensity falls as $1/r$. Intensity goes as amplitude squared, so the amplitude goes as $1/\sqrt r$. (For a point source the intensity falls as $1/r^2$ and the amplitude as $1/r$.)`,
      trap: R`$1/r$ for the amplitude is the spherical-wave result.` },
    { id: 'wav-r4-03', type: 'msq', level: 2, exams: ['jam'], sub: 'travelling waves', format: 'statements',
      q: R`Which of these describe waves travelling in the $-x$ direction (with $A, k, \omega$ positive constants)?`,
      options: [R`$y = A\sin(\omega t + kx)$`, R`$y = A\cos(kx - \omega t)$`, R`$y = f(2x + 3t)$ for any smooth function $f$`, R`$y = A\sin(\omega t - kx)$`], answer: [0, 2],
      sol: R`A shape moves towards $-x$ when $x$ and $t$ appear in the combination $x + vt$ (the argument stays fixed if $x$ falls as $t$ grows). $\omega t + kx = k(x + \omega t/k)$: towards $-x$. $f(2x + 3t) = f(2(x + 1.5t))$: towards $-x$ at 1.5 units per unit time. $kx - \omega t$ and $\omega t - kx$ both contain $x - vt$: towards $+x$ (the order of the terms and the overall sign do not matter).`,
      trap: R`Look at the relative sign of the $x$ and $t$ terms, not which comes first.` },
    { id: 'wav-r4-04', type: 'nat', level: 2, exams: ['jam'], sub: 'particle motion',
      q: R`A sine wave of amplitude 2.0 mm and frequency 500 Hz travels along a string. The largest acceleration of any point of the string is ______ m/s² (to the nearest 100 m/s²).`,
      answer: 19739, tol: 200, calc: () => 0.002 * (2 * Math.PI * 500) ** 2, unit: 'm/s²',
      sol: R`Each point does SHM: $y = A\sin(kx - \omega t)$ gives $\ddot y = -\omega^2y$, largest $A\omega^2 = 0.002\times(2\pi\times500)^2 = 0.002\times9.87\times10^6 \approx 1.97\times10^4$ m/s², about 2000 $g$. It does not depend on the wave speed.`,
      trap: R`Using $f$ instead of $\omega = 2\pi f$ gives 500 m/s², too small by $4\pi^2$.` },
    { id: 'wav-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'standing waves',
      q: R`A string vibrates in a standing wave. At the instant when the whole string is momentarily straight (all points at zero displacement), its energy is`,
      options: ['entirely potential', 'zero', 'half kinetic and half potential', 'entirely kinetic'], answer: 3,
      sol: R`For $y = 2A\sin kx\cos\omega t$, the straight instant has $\cos\omega t = 0$. The slope $\partial y/\partial x$ is then zero everywhere, so no element is stretched and the potential energy is zero, while $|\sin\omega t| = 1$ makes every point move at its maximum speed. The total energy is unchanged; it is all kinetic at that instant. A quarter period later it is all potential.`,
      trap: R`Zero displacement does not mean zero energy; the string is moving fastest then.` },
    { id: 'wav-r4-06', type: 'mcq', level: 3, exams: ['jam'], sub: 'particle motion',
      q: R`A sine wave travels towards $+x$ on a string. At one instant a point P is at zero displacement, and there the string slopes upward with increasing $x$. At this instant P is`,
      options: ['moving up ($+y$) at its maximum speed', 'moving down ($-y$) at its maximum speed', 'at rest', 'moving up and slowing down'], answer: 1,
      sol: R`For any wave $y = f(x - vt)$, the particle velocity is $\partial y/\partial t = -v\,\partial y/\partial x$. Here $\partial y/\partial x > 0$, so $\partial y/\partial t < 0$: P moves down. At zero displacement a point in SHM has its largest speed. Picture it: the part of the wave just behind P (smaller $x$) is lower, and it is about to arrive at P.`,
      trap: R`A positive slope means the trough is coming, not the crest, for a wave moving towards $+x$.` },
    { id: 'wav-r4-07', type: 'mcq', level: 3, exams: ['jam'], sub: 'stretched strings',
      q: R`A sonometer wire, stretched by a hanging metal block of relative density 4, resonates with a tuning fork at a length of 50.0 cm (fundamental). The block is then fully immersed in water. For resonance with the same fork, the length must become about`,
      options: ['43.3 cm', '37.5 cm', '57.7 cm', '50.0 cm'], answer: 0,
      sol: R`Buoyancy reduces the tension by the weight of water displaced: $T' = T(1 - 1/4) = 0.75T$. The fundamental is $f = \dfrac{1}{2L}\sqrt{T/\mu}$, so for fixed $f$, $L \propto \sqrt T$: $L' = 50.0\times\sqrt{0.75} = 43.3$ cm.`,
      trap: R`Frequency goes as $\sqrt T$, not $T$; scaling the length by 0.75 gives 37.5 cm.` },
    { id: 'wav-r4-08', type: 'nat', level: 3, exams: ['jam'], sub: 'standing waves',
      q: R`A standing wave on a string is $y = 4\sin(\pi x/3)\cos(50\pi t)$, with $x$ and $y$ in cm and $t$ in s. The speed of the two travelling waves that make it up is ______ m/s.`,
      answer: 1.5, tol: 0, calc: () => (50 * Math.PI) / (Math.PI / 3) / 100, unit: 'm/s',
      sol: R`$2\sin kx\cos\omega t = \sin(kx - \omega t) + \sin(kx + \omega t)$, so the components have $k = \pi/3$ cm⁻¹ and $\omega = 50\pi$ s⁻¹. Speed $= \omega/k = 50\pi\times3/\pi = 150$ cm/s $= 1.5$ m/s. (Each has amplitude 2 cm.)`,
      trap: R`$k$ is in cm⁻¹ here, so $\omega/k$ comes out in cm/s; convert before answering.` },
    { id: 'wav-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'standing waves', format: 'statements',
      q: R`For a standing wave $y = 2A\sin kx\cos\omega t$ on a stretched string, which statements are correct?`,
      options: ['The energy flow along the string, averaged over a cycle, is zero', 'The kinetic energy per unit length is largest at the antinodes', 'When the string is at its maximum displacement, the potential energy per unit length is largest near the nodes', 'The kinetic energy per unit length is largest at the nodes'], answer: [0, 1, 2],
      sol: R`The two component waves carry equal energy in opposite directions, so the average flow is zero (energy sloshes back and forth within each half-wavelength). Kinetic energy density $\propto(\partial y/\partial t)^2 \propto \sin^2kx$: largest at antinodes, zero at nodes (which never move). Potential energy density $\propto(\partial y/\partial x)^2 \propto \cos^2kx$: largest where the slope is steepest, at the nodes.`,
      trap: R`Nodes do not move, but the string is most stretched there.` },
    { id: 'wav-r4-10', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'harmonics',
      q: R`A string fixed at both ends has fundamental frequency 100 Hz. It is touched lightly at a point one quarter of its length from one end, which forces a node there. The lowest frequency at which it can now vibrate is ______ Hz.`,
      answer: 400, tol: 0, calc: () => 4 * 100, unit: 'Hz',
      sol: R`The $n$th harmonic has nodes at $x = jL/n$ for $j = 0, 1, \dots, n$. A node at $L/4$ needs $jL/n = L/4$, i.e. $n = 4j$: $n$ must be a multiple of 4. So the lowest allowed mode is the 4th harmonic, at $4\times100 = 400$ Hz. (Touching at the middle would leave the even harmonics, starting at 200 Hz.)`,
      trap: R`Answering 200 Hz forgets that the 2nd harmonic's only inner node is at the middle, not at a quarter.` },
    { id: 'wav-r4-11', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'energy in waves', format: 'numeric',
      q: R`A string 1.0 m long with mass per unit length 0.01 kg/m, fixed at both ends, vibrates in a single standing-wave mode at 100 Hz with an antinode amplitude of 1.0 cm. Its total vibrational energy is ______ mJ (to one decimal place).`,
      answer: 98.7, tol: 0.5, calc: () => 1000 * 0.25 * 0.01 * 1e-4 * (2 * Math.PI * 100) ** 2 * 1, unit: 'mJ',
      sol: R`Take $y = a\sin kx\cos\omega t$ with $a = 0.01$ m. When the string is straight all the energy is kinetic: $E = \int_0^L\tfrac12\mu(a\omega\sin kx)^2dx = \tfrac12\mu a^2\omega^2\cdot\tfrac L2$ (a whole number of half-wavelengths fits, so $\sin^2$ averages to $\tfrac12$). $E = \tfrac14\times0.01\times10^{-4}\times(628.3)^2\times1.0 = 0.0987$ J $= 98.7$ mJ.`,
      trap: R`Forgetting the average of $\sin^2kx$ over the string doubles the answer.` },
    { id: 'wav-r4-12', type: 'mcq', level: 5, exams: ['jam', 'gate'], sub: 'wave speed',
      q: R`A closed loop of uniform string spins in free space as a circle, its rim moving at speed $V$. Transverse waves on it travel, relative to the string, at speed`,
      options: [R`$V/2$`, R`$2V$`, R`$\sqrt2V$`, R`$V$`], answer: 3,
      sol: R`A short arc $R\,d\theta$ of mass $\mu R\,d\theta$ needs the inward force $\mu R\,d\theta\,V^2/R$, which the tension supplies as $T\,d\theta$. So $T = \mu V^2$, and the wave speed is $\sqrt{T/\mu} = V$, whatever the radius. A kink travelling backwards relative to the string therefore stands still in space, which is why a spinning lasso can hold a fixed shape.`,
      trap: R`The tension depends on the spin, so the wave speed is tied to the rim speed, not independent of it.` },
  ],
  gens: [
    { id: 'wav-r4g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'harmonics',
      make(r) {
        const [p, q] = choose(r, [[1, 2], [1, 3], [1, 4], [1, 5], [2, 5], [1, 6], [3, 8], [2, 7], [3, 10]]), f1 = int(r, 5, 30) * 10;
        const answer = q * f1;
        return { q: R`A string fixed at both ends has fundamental frequency ${f1} Hz. A light touch forces a node at a point ${p}/${q} of its length from one end. Find the lowest frequency (Hz) at which it can now vibrate.`,
          answer, tol: 0, unit: 'Hz', f1, qq: q,
          sol: R`The $n$th harmonic has nodes at $jL/n$. A node at $\tfrac{${p}}{${q}}L$ needs $j/n = ${p}/${q}$ with the fraction in lowest terms, so $n$ must be a multiple of ${q}. The lowest is $n = ${q}$: $${q}\times${f1} = ${answer}$ Hz.`,
          trap: 'The touch removes every harmonic that has an antinode (or no node) at that point.' };
      },
      verify: (p) => p.qq * p.f1 },
    { id: 'wav-r4g2', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'energy in waves',
      make(r) {
        const L = pick(r, 0.5, 2, 0.5), mu = choose(r, [0.002, 0.005, 0.01, 0.02]), f = int(r, 5, 40) * 10, a = pick(r, 0.2, 2, 0.2);
        const w = 2 * Math.PI * f, answer = round(1000 * 0.25 * mu * (a / 100) ** 2 * w * w * L, 3);
        return { q: R`A string ${L} m long ($\mu = ${mu}$ kg/m), fixed at both ends, vibrates in a single standing-wave mode at ${f} Hz with antinode amplitude ${a} cm. Find its total vibrational energy in mJ.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'mJ', L, mu, f, a,
          sol: R`At the instant the string is straight, the energy is all kinetic: $E = \int_0^L\tfrac12\mu(a\omega\sin kx)^2dx = \tfrac14\mu a^2\omega^2L = \tfrac14\times${mu}\times(${round(a / 100, 4)})^2\times(${round(w, 2)})^2\times${L} = ${answer}$ mJ.`,
          trap: '$\\sin^2kx$ averages to one half over a whole number of half-wavelengths.' };
      },
      verify: (p) => 1000 * 0.25 * p.mu * (p.a / 100) ** 2 * (2 * Math.PI * p.f) ** 2 * p.L },
    { id: 'wav-r4g3', type: 'nat', level: 3, exams: ['jam'], sub: 'stretched strings',
      make(r) {
        const rho = choose(r, [2.5, 4, 5, 7.8, 8, 10, 11.3]), [liq, rl] = choose(r, [['water', 1], ['water', 1], ['a liquid of relative density 1.25', 1.25], ['a liquid of relative density 0.8', 0.8]]), L = pick(r, 40, 90, 5);
        const answer = round(L * Math.sqrt(1 - rl / rho), 2);
        return { q: R`A sonometer wire is stretched by a hanging block of relative density ${rho} and resonates with a tuning fork at a length of ${L} cm. The block is fully immersed in ${liq}. Find the new resonant length (cm) for the same fork and the same mode.`,
          answer, tol: Math.max(0.1, answer * 0.005), unit: 'cm', rho, rl, L,
          sol: R`Buoyancy lowers the tension to $T' = T(1 - ${rl}/${rho})$. For a fixed frequency $L \propto \sqrt T$, so $L' = ${L}\times\sqrt{1 - ${rl}/${rho}} = ${answer}$ cm.`,
          trap: 'Frequency goes as $\\sqrt T$; the length scales with the square root of the tension ratio.' };
      },
      verify: (p) => p.L * Math.sqrt(1 - p.rl / p.rho) },
  ],
};
