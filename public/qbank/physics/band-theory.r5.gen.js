// Round 5 extras for band-theory: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const JG = ['jam', 'gate', 'net'];
const H2M = 0.0380998; // hbar^2/(2 m_e) in eV nm^2
const nnnW = (t1, t2) => { const E = (k) => -2 * t1 * Math.cos(k) - 2 * t2 * Math.cos(2 * k); let lo = Infinity, hi = -Infinity; for (let i = 0; i <= 20000; i++) { const v = E(Math.PI * i / 20000); lo = Math.min(lo, v); hi = Math.max(hi, v); } return hi - lo; };

export default {
  items: [
    { id: 'bth-r5-01', type: 'mcq', level: 1, exams: JG, sub: 'kinds of solid',
      q: R`Which of these has the smallest band gap at room temperature?`,
      options: [R`diamond`, R`silicon`, R`germanium`, R`gallium arsenide`], answer: 2,
      sol: R`Approximate gaps: diamond $5.5$ eV, GaAs $1.42$ eV, Si $1.12$ eV, Ge $0.67$ eV. Germanium's small gap is why it has far more intrinsic carriers than silicon at room temperature and why germanium detectors are cooled.`,
      trap: R`GaAs is "fast" because of its electron mobility, not because its gap is small; its gap is larger than silicon's.` },
    { id: 'bth-r5-02', type: 'nat', level: 2, exams: JG, sub: 'optical gap',
      q: R`A direct-gap semiconductor with $E_g = 1.42$ eV starts to absorb light strongly below a wavelength of ______ nm (to the nearest nm). Take $hc = 1239.8$ eV nm.`,
      answer: 873, tol: 1, calc: () => 1239.8 / 1.42,
      sol: R`A photon can lift an electron across the gap only if $hc/\lambda\ge E_g$, i.e. $\lambda\le hc/E_g = 1239.8/1.42 = 873$ nm. Longer wavelengths (infrared) pass through; this edge is also where its LEDs and lasers emit.`,
      trap: R`Absorption happens for wavelengths shorter than the edge, not longer.` },
    { id: 'bth-r5-03', type: 'mcq', level: 2, exams: JG, sub: 'direct and indirect gaps',
      q: R`Silicon is a poor light emitter while gallium arsenide is used for LEDs and lasers. The main reason is that`,
      options: [R`silicon's band gap is too small to emit visible or infrared light`, R`silicon's gap is indirect: the conduction-band minimum and valence-band maximum are at different $\mathbf k$, so radiative recombination needs a phonon`, R`silicon has no holes at room temperature`, R`gallium arsenide is a metal`], answer: 1,
      sol: R`A photon carries almost no crystal momentum, so a direct optical transition keeps $\mathbf k$ fixed. In GaAs both band edges are at $\Gamma$ ($\mathbf k = 0$), so electrons and holes recombine by emitting a photon quickly. In silicon the conduction minimum is near the X point; a phonon must supply the momentum, making radiative recombination slow, so non-radiative processes win.`,
      trap: R`Silicon's $1.12$ eV gap corresponds to $1.1\ \mu$m, a perfectly usable infrared wavelength; the gap's size is not the problem.` },
    { id: 'bth-r5-04', type: 'nat', level: 3, exams: G, sub: 'effective mass',
      q: R`A 1D band has nearest- and next-nearest-neighbour hopping: $E(k) = -2t_1\cos ka - 2t_2\cos2ka$. With $t_2 = 0.10\,t_1$ (both positive), the effective mass at $k = 0$ is ______ times its value when $t_2 = 0$ (to three decimal places).`,
      answer: 0.714, tol: 0.002, calc: () => 1 / (1 + 4 * 0.1),
      sol: R`$d^2E/dk^2 = 2t_1a^2\cos ka + 8t_2a^2\cos2ka$, which at $k = 0$ is $2a^2(t_1 + 4t_2)$. Since $m^* = \hbar^2/(d^2E/dk^2)$, the ratio is $t_1/(t_1 + 4t_2) = 1/1.4 = 0.714$. Longer-range hopping makes the band bottom more curved, so electrons there are lighter.`,
      trap: R`The second term's curvature carries a factor $2^2 = 4$ from $\cos2ka$; using 2 gives $0.833$.` },
    { id: 'bth-r5-05', type: 'msq', level: 3, exams: G, sub: 'group velocity', format: 'statements',
      q: R`For electrons in a band $E_n(\mathbf k)$ of a perfect crystal, which statements are correct?`,
      options: [R`The velocity of a wave packet is $\mathbf v = \hbar^{-1}\nabla_{\mathbf k}E_n$.`, R`In a 1D band with a gap at $k = \pm\pi/a$, the velocity is zero at the zone boundary.`, R`A completely filled band carries no electric current.`, R`The velocity is always parallel to $\mathbf k$.`], answer: [0, 1, 2],
      sol: R`The group velocity is the gradient of $E$ in $k$-space. At a 1D zone boundary the band is flat (standing waves), so $v = 0$. In a full band, states at $\mathbf k$ and $-\mathbf k$ have opposite velocities (since $E(\mathbf k) = E(-\mathbf k)$), so the total current vanishes. The gradient of $E$ is normal to the constant-energy surface, which is a sphere only for an isotropic band; in general $\mathbf v$ and $\mathbf k$ point in different directions.`,
      trap: R`Parallel $\mathbf v$ and $\mathbf k$ is a free-electron result; in an anisotropic band they differ.` },
    { id: 'bth-r5-06', type: 'nat', level: 4, exams: G, sub: 'k.p theory',
      q: R`In a simple two-band ($\mathbf k\cdot\mathbf p$) model of a direct-gap semiconductor, the conduction-band effective mass obeys $m_e/m^* = 1 + E_P/E_g$, with $E_P = 20$ eV. For a gap of $0.40$ eV, $m^*/m_e$ is ______ (to four decimal places).`,
      answer: 0.0196, tol: 0.0002, calc: () => 1 / (1 + 20 / 0.4),
      sol: R`$m_e/m^* = 1 + 20/0.40 = 51$, so $m^*/m_e = 1/51 = 0.0196$. The smaller the gap, the more strongly the conduction and valence bands repel and the lighter the electrons: narrow-gap semiconductors such as InSb and InAs have very light, very mobile electrons.`,
      trap: R`$E_g/E_P = 0.020$ drops the 1; it is close here, but fails for wide gaps.` },
    { id: 'bth-r5-07', type: 'mcq', level: 4, exams: G, sub: 'optical gap',
      q: R`For a direct allowed transition between parabolic bands in 3D, the absorption coefficient just above the gap varies with photon energy as`,
      options: [R`$(\hbar\omega - E_g)$`, R`$(\hbar\omega - E_g)^2$`, R`a step at $E_g$, then constant`, R`$(\hbar\omega - E_g)^{1/2}$`], answer: 3,
      sol: R`Absorption is proportional to the joint density of states for pairs of states separated by $\hbar\omega$. With $E_c - E_v = E_g + \hbar^2k^2/2\mu$, the 3D joint density of states grows as $k^2\,dk/dE\propto\sqrt{\hbar\omega - E_g}$. Plotting $\alpha^2$ against $\hbar\omega$ gives a straight line whose intercept is $E_g$ (a Tauc-type plot).`,
      trap: R`$(\hbar\omega - E_g)^2$ is for indirect transitions (phonon assisted); a step is the 2D (quantum well) result.` },
    { id: 'bth-r5-08', type: 'msq', level: 4, exams: G, sub: 'Fermi surface', format: 'statements',
      q: R`A 2D square lattice has the band $E = -2t(\cos k_xa + \cos k_ya)$ with one electron per site (half filling). Which statements are correct?`,
      options: [R`The Fermi surface is the square with corners at $(\pm\pi/a, 0)$ and $(0, \pm\pi/a)$.`, R`The density of states diverges (logarithmically) at the Fermi energy $E = 0$.`, R`Opposite sides of the Fermi surface are connected by the single wave vector $(\pi/a, \pi/a)$ (perfect nesting).`, R`The Fermi surface is a circle, as for free electrons.`], answer: [0, 1, 2],
      sol: R`At half filling $E_F = 0$, i.e. $\cos k_xa = -\cos k_ya$, which gives the straight lines $|k_x| + |k_y| = \pi/a$: a square rotated by $45^\circ$. Its corners are saddle points of $E(\mathbf k)$, which give a logarithmic van Hove singularity in the 2D density of states. Parallel flat sides are joined by $(\pi/a, \pi/a)$, so the electron gas is very susceptible to density waves and antiferromagnetism. The band is circular only near its bottom.`,
      trap: R`Circular Fermi surfaces appear only at low filling, where $E\approx E_{min} + tk^2a^2$.` },
    { id: 'bth-r5-09', type: 'nat', level: 5, exams: G, sub: 'tight binding',
      q: R`A 1D band is $E(k) = -2t_1\cos ka - 2t_2\cos2ka$ with $t_1 = 1.0$ eV and $t_2 = 0.50$ eV. Its total bandwidth (highest minus lowest energy over the zone) is ______ eV (to two decimal places).`,
      answer: 4.5, tol: 0.01, calc: () => nnnW(1, 0.5),
      sol: R`$dE/dk = 2a\sin ka(t_1 + 4t_2\cos ka) = 0$ at $ka = 0$, $\pi$, and where $\cos ka = -t_1/4t_2 = -0.5$, i.e. $ka = 2\pi/3$. Values: $E(0) = -2 - 1 = -3.0$ eV; $E(\pi/a) = 2 - 1 = 1.0$ eV; $E(2\pi/3a) = -2(-0.5) - 1\times\cos(4\pi/3) = 1.0 + 0.5 = 1.5$ eV. So the band runs from $-3.0$ to $1.5$ eV: width $4.5$ eV. The top has moved inside the zone.`,
      trap: R`Taking only $k = 0$ and $k = \pi/a$ gives $4.0$ eV and misses the interior maximum.` },
    { id: 'bth-r5-10', type: 'mcq', level: 4, exams: G, sub: 'density of states',
      q: R`For the 1D tight-binding band $E = E_0 - 2t\cos ka$, the density of states per unit length (both $\pm k$ counted) inside the band is proportional to`,
      options: [R`$1/\sqrt{4t^2 - (E - E_0)^2}$`, R`$\sqrt{4t^2 - (E - E_0)^2}$`, R`a constant`, R`$1/\sqrt{E - E_0 + 2t}$ throughout the band`], answer: 0,
      sol: R`$g(E)\propto|dk/dE| = 1/|2ta\sin ka|$. Since $\cos ka = (E_0 - E)/2t$, $|\sin ka| = \sqrt{1 - (E - E_0)^2/4t^2}$, so $g\propto1/\sqrt{4t^2 - (E - E_0)^2}$. It diverges at both band edges (1D van Hove singularities) and near each edge behaves like the free-electron $1/\sqrt{E - E_{edge}}$.`,
      trap: R`The free-electron form holds only near the bottom; the tight-binding band has a matching divergence at the top.` },
  ],
  gens: [
    { id: 'bth-r5g1', type: 'nat', level: 2, exams: JG, sub: 'optical gap',
      make(r) {
        const ask = choose(r, ['lambda', 'gap']);
        const Eg = pick(r, 0.3, 3.5, 0.01), lam = pick(r, 350, 3000, 10);
        const val = ask === 'lambda' ? 1239.8 / Eg : 1239.8 / lam;
        return { q: ask === 'lambda'
            ? R`A semiconductor with band gap $${Eg}$ eV absorbs light only below a wavelength of ______ nm (to the nearest nm). Take $hc = 1239.8$ eV nm.`
            : R`A semiconductor's absorption edge is at $${lam}$ nm. Its band gap is ______ eV (to three decimal places). Take $hc = 1239.8$ eV nm.`,
          answer: ask === 'lambda' ? Math.round(val) : round(val, 3), tol: ask === 'lambda' ? 1 : 0.002, ask, Eg, lam,
          sol: ask === 'lambda' ? R`$\lambda_{edge} = hc/E_g = 1239.8/${Eg} = ${round(val, 1)}$ nm.` : R`$E_g = hc/\lambda = 1239.8/${lam} = ${round(val, 3)}$ eV.`,
          trap: 'Light with longer wavelength than the edge has too little energy to cross the gap.' };
      },
      verify: (p) => (p.ask === 'lambda' ? 1239.8 / p.Eg : 1239.8 / p.lam) },
    { id: 'bth-r5g2', type: 'nat', level: 3, exams: G, sub: 'effective mass',
      make(r) {
        const t1 = pick(r, 0.2, 2, 0.1), x = choose(r, [0.05, 0.1, 0.15, 0.2, -0.05, -0.1]), a = pick(r, 0.2, 0.6, 0.05);
        const t2 = round(x * t1, 4), m = H2M / (a * a * (t1 + 4 * t2));
        return { q: R`A 1D band $E(k) = -2t_1\cos ka - 2t_2\cos2ka$ has $t_1 = ${t1}$ eV, $t_2 = ${t2}$ eV and $a = ${a}$ nm. Its effective mass at $k = 0$, in units of $m_e$, is ______ (to three decimal places). Take $\hbar^2/2m_e = 0.0381$ eV nm$^2$.`,
          answer: round(m, 3), tol: Math.max(0.001, round(m * 0.005, 3)), t1, t2, a,
          sol: R`$d^2E/dk^2|_0 = 2a^2(t_1 + 4t_2)$, so $m^*/m_e = \dfrac{\hbar^2/2m_e}{a^2(t_1 + 4t_2)} = \dfrac{0.0381}{${a}^2\times${round(t1 + 4 * t2, 4)}} = ${round(m, 3)}$.`,
          trap: 'The $\\cos2ka$ term contributes four times its hopping to the curvature.' };
      },
      verify: (p) => H2M / (p.a * p.a * (p.t1 + 4 * p.t2)) },
    { id: 'bth-r5g3', type: 'mcq', level: 4, exams: G, sub: 'k.p theory',
      make(r) {
        const EP = choose(r, [18, 20, 22, 25]), Eg = choose(r, [0.17, 0.24, 0.35, 0.5, 0.75, 1.0, 1.42, 2.0]);
        const m = 1 / (1 + EP / Eg);
        const sh = (v) => `$${v.toFixed(4)}$`;
        const o = mcqOptions(r, m, [Eg / EP, 1 / (1 + Eg / EP), 1 / (1 + 2 * EP / Eg), Math.sqrt(m)], sh);
        return { q: R`In a two-band model, $m_e/m^* = 1 + E_P/E_g$ with $E_P = ${EP}$ eV. For a semiconductor with $E_g = ${Eg}$ eV, $m^*/m_e$ is`, ...o,
          sol: R`$m_e/m^* = 1 + ${EP}/${Eg} = ${round(1 + EP / Eg, 3)}$, so $m^*/m_e = ${m.toFixed(4)}$. Smaller gaps give lighter electrons.`,
          trap: 'Keep the 1 and put $E_P/E_g$, not its inverse.' };
      } },
  ],
};
