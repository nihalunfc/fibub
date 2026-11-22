// Round 5 extras for polarisation: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const deg = Math.PI / 180;

export default {
  items: [
    { id: 'pol-r5-01', type: 'mcq', level: 2, exams: ['jam'], sub: 'brewster angle',
      q: R`Light travelling in water ($n = 1.333$) strikes a flat glass plate ($n = 1.500$) immersed in it. The reflected light is completely polarised when the angle of incidence (in the water) is about`,
      options: [R`$41.6^\circ$`, R`$48.4^\circ$`, R`$56.3^\circ$`, R`$62.7^\circ$`], answer: 1,
      sol: R`Brewster's law uses the ratio of the two indices: $\tan\theta_B = \frac{n_2}{n_1} = \frac{1.500}{1.333} = 1.125$, so $\theta_B = 48.4^\circ$.`,
      trap: R`Using $\tan\theta_B = 1.5$ (glass in air, $56.3^\circ$) when the first medium is water.` },
    { id: 'pol-r5-02', type: 'nat', level: 3, exams: ['jam'], sub: 'malus law',
      q: R`Unpolarised light of intensity $I_0$ passes through three ideal polarisers. The second has its axis at $20^\circ$ to the first, and the third is at $90^\circ$ to the first. The emerging intensity is ______ % of $I_0$ (two decimal places).`,
      answer: 5.16, tol: 0.02, unit: '%', calc: () => 100 * 0.5 * Math.cos(20 * deg) ** 2 * Math.cos(70 * deg) ** 2,
      sol: R`First polariser: $I_0/2$. Second: $\times\cos^2 20^\circ = 0.8830$. Third, at $70^\circ$ to the second: $\times\cos^2 70^\circ = 0.1170$. Total $\frac{I_0}{2}(0.8830)(0.1170) = 0.0516I_0$, i.e. $5.16\%$ (equal to $\frac{I_0}{8}\sin^2 40^\circ$).`,
      trap: R`Using $90^\circ$ for the last step; the third polariser's angle is measured from the second one's axis, $70^\circ$.` },
    { id: 'pol-r5-03', type: 'msq', level: 3, exams: ['jam'], sub: 'wave plates', format: 'statements',
      q: R`Which statements are true?`,
      options: [R`A quarter-wave plate with its axes at $45^\circ$ to the plane of polarisation turns linearly polarised light into circularly polarised light`, R`Circularly polarised light seen through a slowly rotated analyser gives a constant intensity`, R`An analyser alone cannot tell circularly polarised light from unpolarised light`, R`Circularly polarised light passing through a quarter-wave plate stays circularly polarised`],
      answer: [0, 1, 2],
      sol: R`At $45^\circ$ the plate splits the light into equal fast and slow components and adds a $90^\circ$ phase difference: circular light. Circular light has equal average intensity along every direction, as does unpolarised light, so a rotating analyser shows a constant intensity for both; telling them apart needs a quarter-wave plate first. A quarter-wave plate adds $90^\circ$ to the existing $\pm90^\circ$, giving $0$ or $180^\circ$: linear light, so the last statement is false.`,
      trap: R`Assuming a rotating analyser alone can identify circular light.` },
    { id: 'pol-r5-04', type: 'nat', level: 4, exams: ['jam'], sub: 'partial polarisation',
      q: R`A beam is a mixture of unpolarised light and linearly polarised light. Seen through a rotating ideal analyser, the largest transmitted intensity is $4$ times the smallest. The fraction of the beam's intensity that is linearly polarised is ______ (two decimal places).`,
      answer: 0.6, tol: 0.01, calc: () => 3 / 5,
      sol: R`Let the unpolarised part be $I_u$ and the polarised part $I_p$. The analyser always passes $I_u/2$, plus $I_p\cos^2\theta$. So $I_{\max} = I_u/2 + I_p$ and $I_{\min} = I_u/2$. $I_{\max} = 4I_{\min}$ gives $I_p = \frac32I_u$. Fraction polarised $= \frac{I_p}{I_u + I_p} = \frac{1.5}{2.5} = 0.60$, the same as $\frac{I_{\max} - I_{\min}}{I_{\max} + I_{\min}}$.`,
      trap: R`Forgetting that the analyser passes only half of the unpolarised part.` },
    { id: 'pol-r5-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'brewster angle', format: 'which is NOT',
      q: R`Unpolarised light falls on glass at Brewster's angle. Which statement is NOT true?`,
      options: [R`The reflected and refracted rays are at $90^\circ$ to each other`, R`The reflected light is polarised perpendicular to the plane of incidence`, R`The refracted light is completely polarised in the plane of incidence`, R`$\tan\theta_B$ equals the ratio of the refractive indices`], answer: 2,
      sol: R`At Brewster's angle only the component in the plane of incidence fails to reflect, so the reflected light is purely the perpendicular (s) component. The refracted beam carries all of the in-plane light plus most of the s light (only a small fraction of it is reflected), so it is only partly polarised. The other three statements are the usual Brewster facts.`,
      trap: R`Thinking both beams are fully polarised; only the reflected one is.` },
    { id: 'pol-r5-06', type: 'nat', level: 3, exams: ['jam'], sub: 'wave plates',
      q: R`Calcite has $n_o - n_e = 0.172$ at $633$ nm. The thinnest calcite plate (optic axis in its face) that acts as a quarter-wave plate at this wavelength is ______ $\mu$m thick (two decimal places).`,
      answer: 0.92, tol: 0.01, unit: 'μm', calc: () => 0.633 / (4 * 0.172),
      sol: R`A quarter-wave plate needs a path difference $|n_o - n_e|d = \lambda/4$. So $d = \frac{0.633\ \mu{\rm m}}{4\times0.172} = 0.920\ \mu$m. Calcite's large birefringence makes zero-order plates very thin, which is why quartz or mica is usually preferred.`,
      trap: R`Forgetting the factor 4, or using $\lambda/2$ (that is a half-wave plate).` },
    { id: 'pol-r5-07', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'elliptical light',
      q: R`A beam has $E_x = E_0\cos\omega t$ and $E_y = E_0\cos(\omega t + 2\pi/3)$. It passes through an ideal polariser whose axis is at $45^\circ$ between $\hat x$ and $\hat y$. The fraction of the beam's intensity transmitted is`,
      options: [R`$1/2$`, R`$3/4$`, R`$0$`, R`$1/4$`], answer: 3,
      sol: R`The polariser passes $E_\parallel = (E_x + E_y)/\sqrt2$. Time-averaging, $\langle E_\parallel^2\rangle = \frac12\left(\frac{E_0^2}{2} + \frac{E_0^2}{2} + E_0^2\cos\varphi\right) = \frac{E_0^2}{2}(1 + \cos\varphi)$. The beam's total is $\langle E_x^2 + E_y^2\rangle = E_0^2$. Fraction $= \frac{1 + \cos\varphi}{2} = \frac{1 - 0.5}{2} = \frac14$.`,
      trap: R`Answering $1/2$ as for circular light; the phase $2\pi/3$ makes the ellipse lean away from $45^\circ$.` },
    { id: 'pol-r5-08', type: 'mcq', level: 2, exams: ['jam'], sub: 'applications',
      q: R`Polarising sunglasses cut the glare from a calm lake. To do this, their transmission axes are`,
      options: [R`vertical, because light reflected from the water is mostly polarised horizontally`, R`horizontal, because light reflected from the water is mostly polarised horizontally`, R`vertical, because light reflected from the water is mostly polarised vertically`, R`at $45^\circ$, to block both polarisations equally`], answer: 0,
      sol: R`Light reflected from a horizontal surface is mostly polarised parallel to the surface (the s component reflects more strongly, completely at Brewster's angle). A vertical transmission axis blocks that horizontal component.`,
      trap: R`Matching the axis to the glare's polarisation; the axis must be at right angles to it.` },
    { id: 'pol-r5-09', type: 'nat', level: 4, exams: ['jam'], sub: 'malus law',
      q: R`Unpolarised light of intensity $I_0$ passes through two crossed ideal polarisers. A third ideal polariser between them spins steadily about the beam. The time-averaged intensity that emerges is ______ $\times I_0$ (four decimal places).`,
      answer: 0.0625, tol: 0.0005, calc: () => 1 / 16,
      sol: R`With the middle axis at $\theta$: $I = \frac{I_0}{2}\cos^2\theta\sin^2\theta = \frac{I_0}{8}\sin^2 2\theta$. Averaging over a full turn, $\langle\sin^2 2\theta\rangle = \frac12$, so $\langle I\rangle = \frac{I_0}{16} = 0.0625I_0$. (The output flickers at four times the spin rate.)`,
      trap: R`Using the maximum value $I_0/8$ instead of the average.` },
    { id: 'pol-r5-10', type: 'msq', level: 3, exams: ['jam'], sub: 'double refraction', format: 'statements',
      q: R`Which statements about a uniaxial crystal such as calcite are true?`,
      options: [R`Light travelling along the optic axis is not split into two beams`, R`The ordinary ray obeys Snell's law with a single index for every direction`, R`The ordinary and extraordinary rays are polarised parallel to each other`, R`Calcite has $n_e < n_o$ and is called a negative crystal`],
      answer: [0, 1, 3],
      sol: R`Along the optic axis both polarisations see $n_o$, so there is no splitting. The o-ray's index does not depend on direction, so it follows Snell's law. The two rays are polarised at right angles to each other, so the third statement is false. Calcite has $n_o = 1.658$, $n_e = 1.486$: negative.`,
      trap: R`Thinking the e-ray and o-ray share a polarisation; they are orthogonal.` },
  ],
  gens: [
    { id: 'pol-r5g1', type: 'nat', level: 3, exams: ['jam'], sub: 'malus law',
      make(r) {
        const t = pick(r, 10, 80, 5), I = 50 * Math.cos(t * deg) ** 2 * Math.sin(t * deg) ** 2;
        return { q: `Unpolarised light passes through two crossed ideal polarisers with a third between them, its axis at $${t}^\\circ$ to the first. The emerging intensity is ______ % of the incident intensity (two decimal places).`,
          answer: round(I, 2), tol: 0.02, unit: '%', t,
          sol: `$I = \\frac{I_0}{2}\\cos^2 ${t}^\\circ\\cos^2 ${90 - t}^\\circ = \\frac{I_0}{8}\\sin^2 ${2 * t}^\\circ = ${round(I / 100, 5)}I_0$, i.e. $${round(I, 2)}\\%$.`,
          trap: 'Measure each angle from the previous polariser, and halve the unpolarised light first.' };
      },
      verify: (p) => 50 * Math.cos(p.t * deg) ** 2 * Math.sin(p.t * deg) ** 2 },
    { id: 'pol-r5g2', type: 'nat', level: 3, exams: ['jam'], sub: 'wave plates',
      make(r) {
        const [name, dn] = choose(r, [['quartz', 0.0091], ['mica', 0.0050], ['calcite', 0.172], ['rutile', 0.287]]);
        const lam = choose(r, [450, 532, 589, 633, 780]), half = r() < 0.5, d = lam / 1000 / ((half ? 2 : 4) * dn);
        return { q: `A ${name} plate has birefringence $|n_e - n_o| = ${dn}$ at $${lam}$ nm. The thinnest such plate that works as a ${half ? 'half' : 'quarter'}-wave plate is ______ $\\mu$m thick (two decimal places).`,
          answer: round(d, 2), tol: Math.max(0.01, round(d * 0.005, 2)), unit: 'μm', lam, dn, half,
          sol: `Need $|n_e - n_o|d = \\lambda/${half ? 2 : 4}$: $d = \\frac{${lam / 1000}\\ \\mu{\\rm m}}{${half ? 2 : 4}\\times${dn}} = ${round(d, 2)}\\ \\mu$m.`,
          trap: `A ${half ? 'half' : 'quarter'}-wave plate needs a path difference of $\\lambda/${half ? 2 : 4}$.` };
      },
      verify: (p) => p.lam / 1000 / ((p.half ? 2 : 4) * p.dn) },
    { id: 'pol-r5g3', type: 'mcq', level: 2, exams: ['jam'], sub: 'brewster angle',
      make(r) {
        const [m1, n1] = choose(r, [['air', 1], ['water', 1.333], ['oil', 1.47]]), [m2, n2] = choose(r, [['crown glass', 1.52], ['flint glass', 1.65], ['diamond', 2.42]]);
        const th = Math.atan(n2 / n1) / deg, show = (v) => `$${round(v, 1)}^\\circ$`;
        const o = mcqOptions(r, th, [Math.atan(n1 / n2) / deg, Math.atan(n2) / deg + (n1 === 1 ? 7 : 0), Math.asin(n1 / n2) / deg], show);
        return { q: `Light in ${m1} ($n = ${n1}$) reflects from ${m2} ($n = ${n2}$). The reflected light is completely polarised at an angle of incidence of`, ...o, n1, n2,
          sol: `$\\tan\\theta_B = n_2/n_1 = ${n2}/${n1} = ${round(n2 / n1, 4)}$, so $\\theta_B = ${round(th, 1)}^\\circ$.`,
          trap: 'Brewster uses $\\tan$ of the index ratio, not $\\sin$ (that is the critical angle).' };
      },
      verify: (p) => Math.atan(p.n2 / p.n1) / deg },
  ],
};
