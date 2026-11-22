// Round 4 extras for maxwell-em-waves: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'mxw-r4-01', type: 'nat', level: 2, exams: ['jam'], sub: 'energy',
      q: R`A plane light wave in vacuum has intensity $1000$ W/m². The average electromagnetic energy stored in each cubic metre of the beam is ______ $\mu$J (two decimal places).`,
      answer: 3.34, tol: 0.02, unit: 'μJ', calc: () => 1000 / C.c * 1e6,
      sol: R`Energy moves with the wave at speed $c$, so the intensity is energy density times speed: $I = \langle u\rangle c$. Hence $\langle u\rangle = \frac{I}{c} = \frac{1000}{3.00\times10^8} = 3.34\times10^{-6}$ J/m³.`,
      trap: R`Multiplying by $c$ instead of dividing.` },
    { id: 'mxw-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'wave equation',
      q: R`To derive the wave equation for $\vec E$ in empty space, one takes the curl of one Maxwell equation and substitutes another. The two equations combined are`,
      options: [R`Gauss's law for $\vec E$ and Gauss's law for $\vec B$`, R`Faraday's law and the Ampère-Maxwell law`, R`Gauss's law for $\vec E$ and Faraday's law`, R`Ampère's law without the displacement term and Gauss's law for $\vec B$`], answer: 1,
      sol: R`$\nabla\times(\nabla\times\vec E) = -\frac{\partial}{\partial t}\nabla\times\vec B$ (Faraday), and the Ampère-Maxwell law in vacuum gives $\nabla\times\vec B = \mu_0\varepsilon_0\frac{\partial\vec E}{\partial t}$. With $\nabla\times\nabla\times\vec E = \nabla(\nabla\cdot\vec E) - \nabla^2\vec E$ and $\nabla\cdot\vec E = 0$ (Gauss, used only to drop a term), this becomes $\nabla^2\vec E = \mu_0\varepsilon_0\frac{\partial^2\vec E}{\partial t^2}$. Without the displacement term there is no wave at all.`,
      trap: R`Leaving out the displacement current; it is the term that makes light possible.` },
    { id: 'mxw-r4-03', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'angular momentum',
      q: R`A $1.0$ mW beam of circularly polarised light of wavelength $600$ nm is completely absorbed by a tiny disc. The torque on the disc is ______ $\times10^{-19}$ N m (two decimal places).`,
      answer: 3.18, tol: 0.03, unit: '×10⁻¹⁹ N m', calc: () => 1e-3 / (2 * Math.PI * C.c / 600e-9) * 1e19,
      sol: R`Each photon carries energy $\hbar\omega$ and, for circular polarisation, angular momentum $\hbar$ along the beam. The beam therefore brings angular momentum at the rate $\frac{P}{\omega}$. With $\omega = \frac{2\pi c}{\lambda} = 3.14\times10^{15}$ rad/s, the torque is $\frac{10^{-3}}{3.14\times10^{15}} = 3.18\times10^{-19}$ N m.`,
      trap: R`Using $P/c$, which is the force (linear momentum rate), not the torque.` },
    { id: 'mxw-r4-04', type: 'nat', level: 3, exams: ['jam'], sub: 'radiation pressure',
      q: R`A $1.0$ kW laser beam falls normally on a perfectly reflecting sail of mass $1.0$ g in space. The sail's acceleration is ______ mm/s² (two decimal places).`,
      answer: 6.67, tol: 0.03, unit: 'mm/s²', calc: () => 2 * 1000 / C.c / 1e-3 * 1e3,
      sol: R`Light of power $P$ carries momentum at rate $P/c$; reflection reverses it, so the force is $\frac{2P}{c} = \frac{2000}{3.00\times10^8} = 6.67\times10^{-6}$ N. Then $a = F/m = \frac{6.67\times10^{-6}}{1.0\times10^{-3}} = 6.67\times10^{-3}$ m/s².`,
      trap: R`Forgetting the factor 2 for a mirror.` },
    { id: 'mxw-r4-05', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'conductors',
      q: R`In copper ($\sigma = 5.8\times10^7$ S/m, $\mu\approx\mu_0$) a $1.0$ MHz wave travels inside the metal with phase speed ______ m/s (to the nearest whole number).`,
      answer: 415, tol: 3, unit: 'm/s', calc: () => { const w = 2 * Math.PI * 1e6; const d = Math.sqrt(2 / (w * C.mu0 * 5.8e7)); return w * d; },
      sol: R`In a good conductor $k = (1 + i)/\delta$ with $\delta = \sqrt{\frac{2}{\omega\mu\sigma}}$, so the real part of $k$ is $1/\delta$ and the phase speed is $v = \frac{\omega}{\text{Re}\,k} = \omega\delta$. Here $\omega = 6.28\times10^6$ s⁻¹ and $\delta = \sqrt{\frac{2}{6.28\times10^6\times1.257\times10^{-6}\times5.8\times10^7}} = 66.1\ \mu$m. So $v = 6.28\times10^6\times6.61\times10^{-5} = 415$ m/s, only a little faster than sound in air, and the wavelength inside is only $2\pi\delta = 0.42$ mm.`,
      trap: R`Assuming the wave still moves at $c$ (or $c/n$) inside the metal.` },
    { id: 'mxw-r4-06', type: 'nat', level: 2, exams: ['jam'], sub: 'intensity',
      q: R`Sunlight at the Earth ($1.5\times10^{11}$ m from the Sun) has intensity $1360$ W/m². The total power radiated by the Sun is about ______ $\times10^{26}$ W (two decimal places).`,
      answer: 3.85, tol: 0.03, unit: '×10²⁶ W', calc: () => 4 * Math.PI * (1.5e11) ** 2 * 1360 / 1e26,
      sol: R`The Sun radiates equally in all directions, so its power crosses a sphere of radius $r$ with the same intensity everywhere: $P = 4\pi r^2I = 4\pi\times(1.5\times10^{11})^2\times1360 = 3.85\times10^{26}$ W.`,
      trap: R`Using the disc area $\pi r^2$ instead of the sphere area $4\pi r^2$.` },
    { id: 'mxw-r4-07', type: 'mcq', level: 1, exams: ['jam'], sub: 'spectrum',
      q: R`Which list puts these electromagnetic waves in order of increasing frequency?`,
      options: [R`radio, microwave, infrared, visible, ultraviolet, X-ray`, R`radio, infrared, microwave, visible, X-ray, ultraviolet`, R`X-ray, ultraviolet, visible, infrared, microwave, radio`, R`microwave, radio, infrared, visible, ultraviolet, X-ray`], answer: 0,
      sol: R`Frequency rises as wavelength falls: radio (metres and up), microwaves (mm to cm), infrared (μm), visible (400 to 700 nm), ultraviolet (10 to 400 nm), X-rays (below about 10 nm). The reversed list is in order of increasing wavelength.`,
      trap: R`Reading the list in order of wavelength instead of frequency.` },
    { id: 'mxw-r4-08', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'wave equation',
      q: R`Which of these is NOT a solution of the one-dimensional wave equation $\dfrac{\partial^2f}{\partial z^2} = \dfrac{1}{c^2}\dfrac{\partial^2f}{\partial t^2}$?`,
      options: [R`$(z - ct)^3$`, R`$\sin(kz)\cos(ckt)$`, R`$e^{-(z^2 - c^2t^2)}$`, R`$\ln(z + ct)$`], answer: 2,
      sol: R`Any $g(z - ct)$ or $h(z + ct)$ is a solution, which covers the first and last. $\sin kz\cos ckt = \frac12[\sin k(z - ct) + \sin k(z + ct)]$ is a sum of two such waves (a standing wave). But $e^{-(z^2 - c^2t^2)}$ is a product $e^{-(z - ct)(z + ct)}$, not a sum: direct check gives $f_{zz} - f_{tt}/c^2 = (4z^2 - 4 - 4c^2t^2)f\ne0$.`,
      trap: R`Thinking any function of $z$ and $ct$ that looks symmetric works; it must split into right- and left-moving parts.` },
    { id: 'mxw-r4-09', type: 'mcq', level: 3, exams: ['jam'], sub: 'intensity',
      q: R`A very long straight fluorescent tube radiates uniformly. Far from its ends, at perpendicular distance $r$, the electric field amplitude of its light varies as`,
      options: [R`$1/r$`, R`independent of $r$`, R`$1/r^2$`, R`$1/\sqrt r$`], answer: 3,
      sol: R`The power per unit length spreads over a cylinder of area $2\pi r$ per unit length, so $I\propto\frac1r$. Since $I\propto E_0^2$, $E_0\propto\frac{1}{\sqrt r}$. (A point source gives $I\propto1/r^2$ and $E_0\propto1/r$.)`,
      trap: R`Using the point-source rule, or forgetting that the amplitude goes as the square root of the intensity.` },
    { id: 'mxw-r4-10', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'reflection',
      q: R`Light inside glass is totally internally reflected at a flat glass-air boundary. Which statements are true?`,
      options: [R`There is an electric field in the air just beyond the boundary, decaying exponentially with distance`, R`The time-averaged Poynting vector across the boundary (normal component) is zero`, R`All of the incident power is reflected`, R`The decay length of the field in the air does not depend on the angle of incidence`],
      answer: [0, 1, 2],
      sol: R`The boundary conditions cannot be met with fields that vanish in the air, so an evanescent wave exists there, with $e^{-\kappa z}$ and $\kappa = k_0\sqrt{n^2\sin^2\theta - 1}$, which grows with the angle (so the decay length does depend on it). Its fields are $90^\circ$ out of phase in a way that gives no average energy flow across the boundary, so the reflectance is exactly 1. (Bringing a second glass block within a wavelength lets energy tunnel across: frustrated TIR.)`,
      trap: R`Thinking "total" reflection means no field at all on the far side.` },
    { id: 'mxw-r4-11', type: 'msq', level: 3, exams: ['jam'], sub: 'polarisation', format: 'statements',
      q: R`A wave in vacuum has $\vec E = E_0\cos(kz - \omega t)\,(\hat x + \hat y)$. Which statements are true?`,
      options: [R`It is circularly polarised`, R`It is linearly polarised along a line at $45^\circ$ to the $x$ axis`, R`Its magnetic field is along $\hat y - \hat x$`, R`Its average intensity is $c\varepsilon_0E_0^2$`],
      answer: [1, 2, 3],
      sol: R`Both components oscillate in phase, so $\vec E$ swings along the fixed direction $\hat x + \hat y$: linear at $45^\circ$. $\vec B = \frac1c\hat z\times\vec E\propto\hat z\times(\hat x + \hat y) = \hat y - \hat x$. The amplitude is $\sqrt2E_0$, so $I = \frac12c\varepsilon_0(\sqrt2E_0)^2 = c\varepsilon_0E_0^2$. Circular polarisation would need a $90^\circ$ phase difference.`,
      trap: R`Calling any two-component wave circular; the phase difference decides.` },
    { id: 'mxw-r4-12', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'structure of maxwell equations', format: 'statements',
      q: R`Which statements about the structure of Maxwell's equations are true?`,
      options: [R`Without the displacement term, the divergence of Ampère's law would force $\nabla\cdot\vec J = 0$, which fails for a charging capacitor`, R`If $\nabla\cdot\vec B = 0$ holds at one instant, Faraday's law keeps it true at all later times`, R`In empty space the equations are unchanged by $\vec E\to c\vec B$, $\vec B\to-\vec E/c$`, R`The displacement current is a flow of charge across the gap of a charging capacitor`],
      answer: [0, 1, 2],
      sol: R`The divergence of a curl is zero, so $\nabla\cdot(\nabla\times\vec B) = \mu_0\nabla\cdot\vec J$ would require $\nabla\cdot\vec J = 0$; adding $\mu_0\varepsilon_0\partial_t\vec E$ makes it consistent with the continuity equation. Taking the divergence of Faraday's law gives $\partial_t(\nabla\cdot\vec B) = 0$. In vacuum, substituting the duality map turns Faraday's law into the Ampère-Maxwell law and back, and swaps the two Gauss laws. The displacement current is a changing electric field, not moving charge.`,
      trap: R`Picturing the displacement current as charge leaking across the gap.` },
  ],
  gens: [
    { id: 'mxw-r4g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'angular momentum',
      make(r) {
        const P = choose(r, [0.5, 1, 2, 5, 10]), lam = choose(r, [400, 532, 633, 800, 1064]), mode = choose(r, ['abs', 'flip']);
        const w = 2 * Math.PI * C.c / (lam * 1e-9), tau = (mode === 'flip' ? 2 : 1) * P * 1e-3 / w * 1e19;
        return { q: `A $${P}$ mW circularly polarised beam of wavelength $${lam}$ nm ${mode === 'flip' ? 'passes through a small suspended half-wave plate, which reverses its handedness without absorbing any light' : 'is completely absorbed by a small suspended disc'}. The torque on the ${mode === 'flip' ? 'plate' : 'disc'} is ______ $\\times10^{-19}$ N m (three significant figures).`,
          answer: +tau.toPrecision(3), tol: +(tau * 0.006).toPrecision(2), unit: '×10⁻¹⁹ N m', P, lam, mode,
          sol: `Circular light carries angular momentum $\\hbar$ per photon of energy $\\hbar\\omega$, i.e. at the rate $P/\\omega$. $\\omega = 2\\pi c/\\lambda = ${+(w).toPrecision(4)}$ rad/s. ${mode === 'flip' ? 'Reversing the handedness changes each photon\'s angular momentum by $2\\hbar$, so the torque is $2P/\\omega$' : 'Absorbed, it hands over $P/\\omega$'} $= ${+tau.toPrecision(3)}\\times10^{-19}$ N m.`,
          trap: mode === 'flip' ? 'Flipping the handedness transfers twice the angular momentum.' : 'Torque is $P/\\omega$, not $P/c$.' };
      },
      verify: (p) => (p.mode === 'flip' ? 2 : 1) * p.P * 1e-3 / (2 * Math.PI * C.c / (p.lam * 1e-9)) * 1e19 },
    { id: 'mxw-r4g2', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'conductors',
      make(r) {
        const [metal, sigma, stex] = choose(r, [['copper', 5.8e7, '5.8\\times10^7'], ['aluminium', 3.5e7, '3.5\\times10^7'], ['silver', 6.3e7, '6.3\\times10^7'], ['brass', 1.6e7, '1.6\\times10^7']]);
        const fMHz = choose(r, [0.1, 0.5, 1, 10, 100]), ask = r() < 0.5 ? 'v' : 'lam';
        const w = 2 * Math.PI * fMHz * 1e6, d = Math.sqrt(2 / (w * C.mu0 * sigma));
        const val = ask === 'v' ? w * d : 2 * Math.PI * d * 1e3;
        return { q: `For a $${fMHz}$ MHz wave inside ${metal} ($\\sigma = ${stex}$ S/m, $\\mu = \\mu_0$), the ${ask === 'v' ? 'phase speed is ______ m/s' : 'wavelength inside the metal is ______ mm'} (three significant figures).`,
          answer: +val.toPrecision(3), tol: +(val * 0.006).toPrecision(2), unit: ask === 'v' ? 'm/s' : 'mm', sigma, fMHz, ask,
          sol: `Skin depth $\\delta = \\sqrt{2/(\\omega\\mu_0\\sigma)} = ${+(d * 1e6).toPrecision(4)}\\ \\mu$m. In a good conductor $\\text{Re}\\,k = 1/\\delta$, so ${ask === 'v' ? `$v = \\omega\\delta = ${+val.toPrecision(3)}$ m/s` : `$\\lambda = 2\\pi\\delta = ${+val.toPrecision(3)}$ mm`}.`,
          trap: 'Inside a good conductor the wave is slow and short: everything is set by the skin depth.' };
      },
      verify: (p) => { const w = 2 * Math.PI * p.fMHz * 1e6, d = Math.sqrt(2 / (w * C.mu0 * p.sigma)); return p.ask === 'v' ? w * d : 2 * Math.PI * d * 1e3; } },
    { id: 'mxw-r4g3', type: 'mcq', level: 3, exams: ['jam'], sub: 'intensity',
      make(r) {
        const n = choose(r, [2, 3, 4, 9, 16]), src = choose(r, ['point', 'line']), qty = choose(r, ['intensity', 'field']);
        const p = { point: { intensity: 2, field: 1 }, line: { intensity: 1, field: 0.5 } }[src][qty];
        const show = (e) => `$${round(n ** -e, 4)}$`;
        const o = mcqOptions(r, p, [2, 1, 0.5, 3, 1.5].filter((e) => e !== p), show);
        return { q: `A ${src === 'point' ? 'small lamp radiates equally in all directions' : 'very long straight tube lamp radiates uniformly'}. Moving from distance $r$ to $${n}r$ ${src === 'line' ? '(perpendicular to the tube, far from its ends)' : ''}, the ${qty === 'field' ? 'electric field amplitude of its light' : 'intensity'} is multiplied by`, ...o,
          sol: `${src === 'point' ? 'Power spreads over a sphere ($4\\pi r^2$), so $I\\propto r^{-2}$' : 'Power per unit length spreads over a cylinder ($2\\pi r$), so $I\\propto r^{-1}$'}, and $E_0\\propto\\sqrt I$. So the ${qty} goes as $r^{-${p}}$: the factor is $${n}^{-${p}} = ${round(n ** -p, 4)}$.`,
          trap: 'Intensity goes as the field squared; and a line source spreads its light over a cylinder, not a sphere.' };
      } },
  ],
};
