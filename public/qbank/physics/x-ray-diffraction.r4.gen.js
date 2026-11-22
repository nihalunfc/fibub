// Round 4 extras for x-ray-diffraction: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;
const J = ['jam'], JG = ['jam', 'gate'], JGN = ['jam', 'gate', 'net'];

// Distinct values of h^2 + k^2 + l^2 allowed for a cubic lattice ('sc', 'bcc', 'fcc') up to nmax.
function cubicN(lat, nmax) {
  const s = new Set();
  const hm = Math.floor(Math.sqrt(nmax));
  for (let h = 0; h <= hm; h++) for (let k = 0; k <= h; k++) for (let l = 0; l <= k; l++) {
    const N = h * h + k * k + l * l;
    if (N === 0 || N > nmax) continue;
    if (lat === 'bcc' && (h + k + l) % 2) continue;
    if (lat === 'fcc' && !((h % 2 === k % 2) && (k % 2 === l % 2))) continue;
    s.add(N);
  }
  return [...s].sort((a, b) => a - b);
}

export default {
  items: [
    { id: 'xrd-r4-01', type: 'mcq', level: 1, exams: J, sub: 'Bragg law',
      q: R`A first-order Bragg reflection is found at glancing angle $\theta$ for X-rays of wavelength $\lambda$. The wavelength is doubled and the same planes are used in first order. The new glancing angle $\theta'$ satisfies`,
      options: [R`$\theta' = 2\theta$`, R`$\sin\theta' = 2\sin\theta$`, R`$\theta' = \theta/2$`, R`$\sin\theta' = \tfrac12\sin\theta$`], answer: 1,
      sol: R`$2d\sin\theta = \lambda$ with $d$ fixed, so $\sin\theta\propto\lambda$: doubling $\lambda$ doubles $\sin\theta$. The angle itself doubles only approximately, at small angles. If $2\sin\theta > 1$ the reflection disappears.`,
      trap: R`Bragg's law is linear in $\sin\theta$, not in $\theta$.` },
    { id: 'xrd-r4-02', type: 'nat', level: 2, exams: JG, sub: 'Bragg law', unit: 'degrees',
      q: R`Tungsten is bcc with $a = 3.165$ Å. With Cu K$\alpha_1$ X-rays ($\lambda = 1.5406$ Å), the Bragg angle $\theta$ of its first powder line is ______ degrees (to two decimal places).`,
      answer: 20.13, tol: 0.03, calc: () => Math.asin(1.5406 / (2 * 3.165 / Math.SQRT2)) * 180 / Math.PI,
      sol: R`For bcc, $h + k + l$ must be even, so the first line is $(110)$: $d = a/\sqrt2 = 2.238$ Å. $\sin\theta = \lambda/2d = 1.5406/4.476 = 0.3442$, so $\theta = 20.13^\circ$ ($2\theta = 40.27^\circ$).`,
      trap: R`$(100)$ is missing for bcc; using $d = a$ gives $14.1^\circ$, where no line appears.` },
    { id: 'xrd-r4-03', type: 'mcq', level: 2, exams: J, sub: 'powder method',
      q: R`In a Debye-Scherrer camera of radius $57.3$ mm, the film wraps round the sample and each powder cone leaves two arcs on it. The two arcs of one cone are $100$ mm apart, measured along the film through the exit point of the direct beam. The Bragg angle $\theta$ is`,
      options: [R`$50^\circ$`, R`$100^\circ$`, R`$12.5^\circ$`, R`$25^\circ$`], answer: 3,
      sol: R`Each arc is $2\theta$ from the forward direction, on either side, so the arcs are $4\theta$ apart in angle. Along a circle of radius $R$: $S = R\cdot4\theta$ (radians). With $R = 57.3$ mm, $1$ mm of film is $1^\circ$, so $4\theta = 100^\circ$ and $\theta = 25^\circ$.`,
      trap: R`The arc separation is $4\theta$, not $2\theta$: the cone has half-angle $2\theta$ and both sides are measured.` },
    { id: 'xrd-r4-04', type: 'nat', level: 3, exams: JG, sub: 'neutron diffraction', unit: 'Å',
      q: R`In a time-of-flight neutron diffractometer, neutrons travel $10.0$ m in total from the source via the sample to a detector at scattering angle $2\theta = 90^\circ$. A Bragg peak arrives $5.00$ ms after the pulse. With $h/m_n = 3.956\times10^{-7}$ m$^2$/s, the spacing of the reflecting planes is ______ Å (to two decimal places).`,
      answer: 1.4, tol: 0.01, calc: () => 3.956e-7 / (10 / 5e-3) / (2 * Math.sin(Math.PI / 4)) * 1e10,
      sol: R`Speed $v = 10.0/5.00\times10^{-3} = 2000$ m/s. Wavelength $\lambda = h/m_nv = 3.956\times10^{-7}/2000 = 1.978\times10^{-10}$ m $= 1.978$ Å. Bragg: $d = \lambda/2\sin\theta = 1.978/(2\sin45^\circ) = 1.40$ Å. At a fixed angle, later arrivals are slower neutrons, longer wavelengths and larger $d$.`,
      trap: R`The Bragg angle is $45^\circ$, half the scattering angle.` },
    { id: 'xrd-r4-05', type: 'mcq', level: 3, exams: JG, sub: 'intensities',
      q: R`An unpolarised X-ray beam is scattered by an electron. Compared with forward scattering, the intensity scattered at $2\theta = 90^\circ$ (same distance) is reduced by the polarisation factor`,
      options: [R`$1/2$`, R`$0$`, R`$1/\sqrt2$`, R`$1$ (no reduction)`], answer: 0,
      sol: R`The factor is $(1 + \cos^22\theta)/2$. An unpolarised beam is two equal polarisations: the one perpendicular to the scattering plane scatters fully at any angle, while the one in the plane is weighted by $\cos^22\theta$, zero at $90^\circ$. So at $90^\circ$ only half survives, and the scattered beam is completely polarised.`,
      trap: R`$0$ applies to one polarisation only; the other is unaffected.` },
    { id: 'xrd-r4-06', type: 'msq', level: 3, exams: JG, sub: 'Ewald sphere', format: 'statements',
      q: R`Which changes increase the number of reflections $(hkl)$ that can possibly be observed from a crystal (by turning it to any orientation)?`,
      options: [R`Using X-rays of shorter wavelength.`, R`Studying a crystal of the same structure with a larger lattice constant.`, R`Using X-rays of longer wavelength.`, R`Replacing an fcc crystal of identical atoms by a simple cubic one of the same cube edge.`], answer: [0, 1, 3],
      sol: R`A reflection is possible only if $\lambda = 2d\sin\theta\le2d$, i.e. $|\vec G|\le4\pi/\lambda$ (the "limiting sphere"). Shorter $\lambda$ enlarges the limiting sphere; a larger lattice constant packs reciprocal-lattice points more densely. Both add reflections; longer $\lambda$ removes them. The fcc structure factor removes every mixed-parity $(hkl)$, which the simple cubic crystal keeps.`,
      trap: R`A larger cell means a denser reciprocal lattice, so more reflections fit, not fewer.` },
    { id: 'xrd-r4-07', type: 'nat', level: 4, exams: JG, sub: 'indexing',
      q: R`A simple cubic crystal has $a = 3.00$ Å and is examined with X-rays of $\lambda = 1.54$ Å. The number of distinct powder lines (distinct values of $h^2 + k^2 + l^2$) that can appear is ______.`,
      answer: 13, tol: 0, calc: () => cubicN('sc', Math.floor((2 * 3 / 1.54) ** 2)).length,
      sol: R`Lines need $\sin\theta = \lambda\sqrt N/2a\le1$, so $N = h^2 + k^2 + l^2\le(2a/\lambda)^2 = (3.896)^2 = 15.2$. Every $N$ from $1$ to $15$ is a sum of three squares except $7$ and $15$ (numbers of the form $4^m(8n + 7)$ never are). That leaves $1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14$: $13$ lines.`,
      trap: R`Counting all $15$ values forgets that $7$ and $15$ cannot be written as $h^2 + k^2 + l^2$.` },
    { id: 'xrd-r4-08', type: 'nat', level: 3, exams: JG, sub: 'intensities',
      q: R`In a cubic crystal, the multiplicity of the powder line $\{210\}$ (the number of distinct $(hkl)$, counting $(hkl)$ and $(\bar h\bar k\bar l)$ separately, that share the same $d$) is ______.`,
      answer: 24, tol: 0, calc: () => 6 * 4,
      sol: R`The three different numbers $2, 1, 0$ can be placed on the three axes in $3! = 6$ ways. The two nonzero ones can each be $+$ or $-$: $4$ choices. The zero has no sign. Total $6\times4 = 24$. For comparison $\{100\}$ has $6$, $\{110\}$ $12$, $\{111\}$ $8$ and $\{321\}$ $48$. Powder intensities are proportional to these numbers.`,
      trap: R`Treating $0$ as having a sign gives $48$; ignoring signs gives $6$.` },
    { id: 'xrd-r4-09', type: 'mcq', level: 5, exams: JGN, sub: 'monochromators',
      q: R`A silicon (diamond structure) crystal set to reflect $\lambda$ from its $(111)$ planes is used as a monochromator for a white X-ray beam. Which shorter wavelength also leaves in the same direction with appreciable intensity?`,
      options: [R`$\lambda/2$, reflected by $(222)$`, R`$\lambda/2$ only, since $(333)$ is forbidden`, R`None: a crystal reflects only one wavelength at a given angle`, R`$\lambda/3$, reflected by $(333)$`], answer: 3,
      sol: R`At the same angle, $(nnn)$ planes reflect $\lambda/n$. For the diamond structure the structure factor of an all-even $(hkl)$ vanishes when $h + k + l = 4m + 2$: $(222)$ has sum $6$ and is (nearly) forbidden, so $\lambda/2$ is suppressed. $(333)$ (all odd) is allowed, so $\lambda/3$ passes. (Further on, $(444)$, with sum $12 = 4\times3$, is allowed too, so $\lambda/4$ also passes, more weakly.) This is why Si(111) monochromators are prized: the second harmonic is missing.`,
      trap: R`Assuming every higher order is present ignores the diamond-structure absences.` },
    { id: 'xrd-r4-10', type: 'msq', level: 4, exams: JG, sub: 'Laue method', format: 'statements',
      q: R`In the Laue method a stationary single crystal is lit with a beam of continuous ("white") X-rays. Which statements are correct?`,
      options: [R`One Laue spot can contain several orders, with wavelengths $\lambda$, $\lambda/2$, $\lambda/3$, ... from the same planes.`, R`The symmetry of the spot pattern shows the crystal's symmetry about the beam direction.`, R`The spacing $d$ of a set of planes can be read from the position of its spot alone.`, R`The crystal must be rotated during the exposure for any spots to appear.`], answer: [0, 1],
      sol: R`A spot's position fixes only the angle $\theta$ of the planes; each order picks its own wavelength $n\lambda_n = 2d\sin\theta$ from the white beam, so all orders land on the same spot and only the ratio $d/n$, not $d$, follows (and only if $\lambda$ were known). Because spots appear wherever planes find a matching wavelength, no rotation is needed; and a crystal axis along the beam gives a pattern with that axis's symmetry, which is why Laue photographs are used to orient crystals.`,
      trap: R`Rotation is needed with monochromatic X-rays, not with white X-rays.` },
  ],
  gens: [
    { id: 'xrd-r4g1', type: 'nat', level: 4, exams: JG, sub: 'indexing',
      make(r) {
        const [lat, name] = choose(r, [['sc', 'simple cubic'], ['bcc', 'body-centred cubic'], ['fcc', 'face-centred cubic']]), a = pick(r, 2.8, 5.6, 0.05), [tube, lam] = choose(r, [['Cu', 1.5406], ['Co', 1.789], ['Cr', 2.2897]]);
        const lim = (2 * a / lam) ** 2, Ns = cubicN(lat, Math.floor(lim + 1e-9));
        return { q: `A ${name} crystal of identical atoms has cube edge $a = ${a}$ Å and is examined with ${tube} K$\\alpha$ X-rays ($\\lambda = ${lam}$ Å). The number of distinct powder lines (distinct values of $h^2 + k^2 + l^2$ allowed for this lattice) that can appear is ______.`,
          answer: Ns.length, tol: 0, a, lam, lat,
          sol: `A line needs $\\sin\\theta = \\lambda\\sqrt N/2a\\le1$, so $N\\le(2a/\\lambda)^2 = ${round(lim, 2)}$. ${lat === 'sc' ? 'For simple cubic every sum of three squares is allowed (never $7, 15, 23, 28, \\dots$).' : lat === 'bcc' ? 'For bcc, $h + k + l$ must be even, so $N$ is even.' : 'For fcc, $h, k, l$ must be all odd or all even.'} The allowed values are $${Ns.length > 18 ? Ns.slice(0, 18).join(', ') + ', \\dots' : Ns.join(', ')}$: ${Ns.length} lines.`,
          trap: 'Count distinct $N$, and drop the values the lattice forbids or that are not sums of three squares.' };
      },
      verify: (p) => cubicN(p.lat, Math.floor((2 * p.a / p.lam) ** 2 + 1e-9)).length },
    { id: 'xrd-r4g2', type: 'nat', level: 3, exams: JG, sub: 'neutron diffraction', unit: 'Å',
      make(r) {
        const L = pick(r, 5, 20, 0.5), t = pick(r, 2, 12, 0.1), tt = choose(r, [60, 90, 120, 150]);
        const lam = 3.956e-7 * t * 1e-3 / L * 1e10, d = lam / (2 * Math.sin(tt / 2 * Math.PI / 180));
        return { q: `In a time-of-flight neutron diffractometer, neutrons travel $${L}$ m from the source via the sample to a detector at scattering angle $2\\theta = ${tt}^\\circ$. A Bragg peak arrives $${t}$ ms after the pulse. With $h/m_n = 3.956\\times10^{-7}$ m$^2$/s, the plane spacing is ______ Å (to three decimal places).`,
          answer: round(d, 3), tol: Math.max(0.002, round(d * 0.003, 3)), L, t, tt,
          sol: `$v = L/t = ${round(L / (t * 1e-3), 1)}$ m/s, $\\lambda = (h/m_n)/v = ${round(lam, 4)}$ Å. $d = \\lambda/2\\sin${tt / 2}^\\circ = ${round(d, 3)}$ Å.`,
          trap: 'The Bragg angle is half the scattering angle.' };
      },
      verify: (p) => 3.956e-7 * p.t * 1e-3 / p.L * 1e10 / (2 * Math.sin(p.tt / 2 * Math.PI / 180)) },
    { id: 'xrd-r4g3', type: 'nat', level: 3, exams: J, sub: 'powder method', unit: 'Å',
      make(r) {
        const Rc = choose(r, [57.3, 114.6, 50, 100]), S = pick(r, 40, 300, 2), lam = choose(r, [1.5406, 1.789, 0.7107]);
        const th = S / (4 * Rc), d = lam / (2 * Math.sin(th));
        return { q: `In a Debye-Scherrer camera of radius $${Rc}$ mm, the two arcs made on the film by one powder cone are $${S}$ mm apart (measured along the film through the exit point of the direct beam). With X-rays of $\\lambda = ${lam}$ Å, the spacing of the reflecting planes is ______ Å (to three decimal places).`,
          answer: round(d, 3), tol: Math.max(0.002, round(d * 0.003, 3)), Rc, S, lam,
          sol: `The arcs are $4\\theta$ apart: $4\\theta = S/R = ${S}/${Rc} = ${round(4 * th, 4)}$ rad, so $\\theta = ${round(th, 4)}$ rad $= ${round(th * 180 / Math.PI, 2)}^\\circ$. $d = \\lambda/2\\sin\\theta = ${lam}/(2\\times${round(Math.sin(th), 4)}) = ${round(d, 3)}$ Å.`,
          trap: 'The separation of the two arcs is $4\\theta R$, not $2\\theta R$.' };
      },
      verify: (p) => p.lam / (2 * Math.sin(p.S / (4 * p.Rc))) },
  ],
};
