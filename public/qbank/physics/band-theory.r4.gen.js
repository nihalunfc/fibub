// Round 4 extras for band-theory: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round, C } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];

export default {
  items: [
    { id: 'bth-r4-01', type: 'mcq', level: 1, exams: G, sub: 'tight binding',
      q: R`In the tight-binding picture, the atoms of a crystal are pushed closer together (for example under pressure). The band formed from one atomic level`,
      options: [R`becomes narrower`, R`becomes wider`, R`keeps the same width`, R`splits into two bands`], answer: 1,
      sol: R`The bandwidth is proportional to the hopping integral $t$ (for example $4t$ in 1D, $12t$ in simple cubic), and $t$ measures the overlap of neighbouring atomic orbitals. Closer atoms overlap more, so $t$ and the bandwidth grow. Far apart, $t\to0$ and the band shrinks to the sharp atomic level.`,
      trap: R`More overlap means faster hopping and a wider band, not a narrower one.` },
    { id: 'bth-r4-02', type: 'mcq', level: 2, exams: G, sub: 'Bloch theorem',
      q: R`A 1D crystal has lattice constant $a$. A Bloch state with wave vector exactly $k = \pi/a$ satisfies`,
      options: [R`$\psi(x + a) = \psi(x)$`, R`$\psi(x + a) = i\psi(x)$`, R`$\psi(x) = 0$ at every ion`, R`$\psi(x + a) = -\psi(x)$`], answer: 3,
      sol: R`Bloch's theorem gives $\psi(x + a) = e^{ika}\psi(x)$, and $e^{i\pi} = -1$. So the wave function changes sign from cell to cell; it has period $2a$ while $|\psi|^2$ has period $a$. These are the standing waves at the zone boundary.`,
      trap: R`$e^{ika} = i$ would need $k = \pi/2a$.` },
    { id: 'bth-r4-03', type: 'nat', level: 3, exams: G, sub: 'two-site cells',
      q: R`A 1D chain has two identical atoms per cell with alternating hoppings $t_1 = 1.2$ eV (inside a cell) and $t_2 = 0.80$ eV (between cells), giving bands $E(k) = \pm|t_1 + t_2e^{ika}|$. The band gap is ______ eV (to two decimal places).`,
      answer: 0.8, tol: 0.01, calc: () => 2 * Math.abs(1.2 - 0.8),
      sol: R`$|t_1 + t_2e^{ika}|^2 = t_1^2 + t_2^2 + 2t_1t_2\cos ka$, smallest at $ka = \pi$, where it equals $(t_1 - t_2)^2$. The bands are then at $\pm|t_1 - t_2| = \pm0.40$ eV, so the gap is $2|t_1 - t_2| = 0.80$ eV. With equal hoppings the gap closes; dimerisation opens it.`,
      trap: R`Quoting $|t_1 - t_2| = 0.40$ eV gives the distance of each band edge from the centre, half the gap.` },
    { id: 'bth-r4-04', type: 'nat', level: 4, exams: G, sub: 'two-site cells',
      q: R`A 1D chain alternates two kinds of atom with on-site energies $+\Delta$ and $-\Delta$ ($\Delta = 0.50$ eV) and the same hopping $t = 1.0$ eV between all neighbours, so $E(k) = \pm\sqrt{\Delta^2 + 4t^2\cos^2(ka/2)}$ with $a$ the cell length. The energy from the bottom of the lower band to the top of the upper band is ______ eV (to two decimal places).`,
      answer: 4.12, tol: 0.02, calc: () => 2 * Math.sqrt(0.25 + 4),
      sol: R`The extremes are at $k = 0$, where $E = \pm\sqrt{\Delta^2 + 4t^2} = \pm\sqrt{0.25 + 4} = \pm2.06$ eV. The total span is $4.12$ eV. At the zone boundary $\cos(\pi/2) = 0$, so the bands sit at $\pm\Delta$: a gap $2\Delta = 1.0$ eV opened by the difference between the atoms. Each band is $2.06 - 0.50 = 1.56$ eV wide.`,
      trap: R`Taking the span as the monatomic $4t$ ignores the on-site energies, which push the extremes outwards.` },
    { id: 'bth-r4-05', type: 'mcq', level: 4, exams: G, sub: 'Peierls instability',
      q: R`A chain of monovalent atoms (one electron per atom, so a half-filled band) is unstable at low temperature against a small dimerisation, in which neighbouring atoms pair up. The basic reason is that dimerisation`,
      options: [R`opens a gap at the Fermi level, lowering the energy of the occupied states by more than the elastic cost`, R`widens the band so that it holds more electrons`, R`makes the effective mass zero at the Fermi wave vector`, R`opens a gap at $k = \pi/a$, far from the Fermi level`], answer: 0,
      sol: R`Doubling the period to $2a$ halves the Brillouin zone, whose new boundary $\pi/2a$ is exactly $k_F$ for a half-filled band. A gap opens there: states just below $E_F$ (all occupied) are pushed down, those above (all empty) pushed up. The electronic gain grows like $u^2\ln(1/u)$ for a displacement $u$, faster than the elastic cost $\propto u^2$, so a small distortion always wins in 1D. The chain becomes an insulator (Peierls transition).`,
      trap: R`The relevant gap is at the new zone boundary $\pi/2a = k_F$, not at the old one.` },
    { id: 'bth-r4-06', type: 'mcq', level: 3, exams: G, sub: 'density of states',
      q: R`For the 1D tight-binding band $E(k) = E_0 - 2t\cos ka$, the density of states $g(E)$`,
      options: [R`is constant across the band`, R`is largest at the band centre and zero at the edges`, R`diverges at both band edges, as an inverse square root`, R`has a logarithmic peak at the band centre`], answer: 2,
      sol: R`$g(E)\propto1/|dE/dk| = 1/(2ta|\sin ka|)$, and $\sin ka = \sqrt{1 - [(E - E_0)/2t]^2}$. So $g\propto1/\sqrt{(2t)^2 - (E - E_0)^2}$: smallest at the centre and divergent (integrably) at $E_0\pm2t$, where the band is flat. These are 1D van Hove singularities; the logarithmic peak at the centre belongs to the 2D square lattice.`,
      trap: R`Where the band is flat, many states crowd into a small energy range: the density of states is large there, not small.` },
    { id: 'bth-r4-07', type: 'msq', level: 4, exams: G, sub: 'symmetry of bands', format: 'statements',
      q: R`Which statements about the symmetry of band energies $E_n(\vec k)$ are correct?`,
      options: [R`With time-reversal symmetry (no magnetic field or magnetic order) and spin ignored, $E_n(\vec k) = E_n(-\vec k)$ even in a crystal without a centre of inversion.`, R`$E_n(\vec k + \vec G) = E_n(\vec k)$ for every reciprocal lattice vector $\vec G$.`, R`In a crystal without inversion symmetry, $E_n(\vec k)\ne E_n(-\vec k)$ even with time-reversal symmetry and spin ignored.`, R`With spin-orbit coupling and no inversion symmetry, the two spin states at the same $\vec k$ can have different energies, while $E_{n\uparrow}(\vec k) = E_{n\downarrow}(-\vec k)$.`], answer: [0, 1, 3],
      sol: R`Time reversal maps a Bloch state at $\vec k$ (spin up) to one at $-\vec k$ (spin down) with the same energy; without spin effects that alone gives $E(\vec k) = E(-\vec k)$, whatever the crystal symmetry. $\vec k$ and $\vec k + \vec G$ label the same Bloch state, so energies repeat over reciprocal space. Spin-orbit coupling in a non-centrosymmetric crystal splits the spins at a given $\vec k$ (Rashba or Dresselhaus splitting), but Kramers' relation still links $\vec k\uparrow$ with $-\vec k\downarrow$.`,
      trap: R`Inversion symmetry is not needed for $E(\vec k) = E(-\vec k)$; time reversal is enough when spin plays no role.` },
    { id: 'bth-r4-08', type: 'msq', level: 3, exams: G, sub: 'graphene', format: 'statements',
      q: R`For the tight-binding $\pi$ bands of graphene (a honeycomb lattice with two atoms per cell), which statements are correct?`,
      options: [R`The conduction and valence bands touch at the corners K of the hexagonal Brillouin zone.`, R`Near a K point the energy is linear in the distance $|\vec q|$ from K.`, R`In undoped graphene the Fermi level lies exactly at the touching (Dirac) point.`, R`Near K the carriers have a large effective mass, as in a flat band.`], answer: [0, 1, 2],
      sol: R`The two sublattices give $E = \pm t|f(\vec k)|$, and $f$ vanishes at the zone corners, so the bands meet there. Expanding about K gives $E = \pm\hbar v_F|\vec q|$, a cone. With one $\pi$ electron per carbon, the lower band is exactly full, so $E_F$ sits at the Dirac point. A linear dispersion has no curvature: the carriers behave as massless, not heavy.`,
      trap: R`Two bands that touch with a linear dispersion mean zero mass and a zero gap, not a heavy band.` },
    { id: 'bth-r4-09', type: 'nat', level: 3, exams: G, sub: 'graphene',
      q: R`Near a K point the graphene bands are $E = \pm\hbar v_F|\vec q|$ with $\hbar v_F = 3ta/2$, where $t = 2.8$ eV is the hopping and $a = 0.142$ nm the carbon-carbon distance. The Fermi velocity $v_F$ is ______ $\times10^5$ m/s (to two decimal places). Take $\hbar = 6.582\times10^{-16}$ eV s.`,
      answer: 9.06, tol: 0.03, calc: () => (3 * 2.8 * 0.142e-9 / 2) / 6.582e-16 / 1e5,
      sol: R`$\hbar v_F = 1.5\times2.8\times0.142 = 0.596$ eV nm. $v_F = 0.596\times10^{-9}\text{ eV m}/6.582\times10^{-16}\text{ eV s} = 9.06\times10^5$ m/s, about $c/330$ and independent of the carrier density.`,
      trap: R`Using $\hbar$ in J s with $t$ in eV mixes units by a factor $1.6\times10^{-19}$.` },
    { id: 'bth-r4-10', type: 'nat', level: 5, exams: G, sub: 'Fermi surface',
      q: R`A metal has a Fermi surface section that is a circle of radius $k_F = 1.0\times10^{10}$ m$^{-1}$ in planes perpendicular to the field. By Onsager's relation, its de Haas-van Alphen oscillations are periodic in $1/B$ with frequency $F = \hbar A/(2\pi e)$, where $A$ is the extremal area. $F$ is ______ kT (to two decimal places).`,
      answer: 32.91, tol: 0.05, calc: () => C.hbar * Math.PI * 1e20 / (2 * Math.PI * C.e) / 1000,
      sol: R`$A = \pi k_F^2 = 3.14\times10^{20}$ m$^{-2}$. $F = \hbar k_F^2/2e = 1.0546\times10^{-34}\times10^{20}/(2\times1.602\times10^{-19}) = 3.29\times10^4$ T $= 32.91$ kT. The oscillation period in $1/B$ is $1/F = 3.0\times10^{-5}$ T$^{-1}$; measuring $F$ for many field directions maps the Fermi surface.`,
      trap: R`Leaving out $\pi$ in the area, or using $h$ for $\hbar$, gives an answer off by $\pi$ or $2\pi$.` },
    { id: 'bth-r4-11', type: 'mcq', level: 5, exams: G, sub: 'Fermi surface',
      q: R`Free electrons fill a sphere in a simple cubic crystal (one atom per cube of side $a$). The number of electrons per atom for which the Fermi sphere just touches the faces of the first Brillouin zone is`,
      options: [R`$\pi/3\approx1.05$`, R`$1$`, R`$\pi/2\approx1.57$`, R`$4\pi/3\approx4.19$`], answer: 0,
      sol: R`The first zone is a cube of side $2\pi/a$; its faces are $\pi/a$ from the centre, so the sphere touches them when $k_F = \pi/a$. Electrons per atom $= 2\times\dfrac{\tfrac43\pi(\pi/a)^3}{(2\pi/a)^3} = 2\times\dfrac{4\pi^4/3}{8\pi^3} = \dfrac{\pi}{3} = 1.05$. A monovalent simple cubic metal (0.985 of that radius) almost touches; a divalent one crosses into the second zone.`,
      trap: R`$\pi/2$ is the 2D square-lattice answer; in 3D the volume ratio is different.` },
    { id: 'bth-r4-12', type: 'mcq', level: 2, exams: G, sub: 'holes',
      q: R`A band is full except for a few empty states near its top, and no other band contributes to conduction. Its Hall coefficient is`,
      options: [R`negative, as for free electrons`, R`positive, as if the carriers were positive holes`, R`zero, because a nearly full band carries no current`, R`impossible to define, because the effective mass is negative there`], answer: 1,
      sol: R`The current of a nearly full band equals that of the few empty states treated as particles of charge $+e$ and positive mass (the negative electron mass at the band top flips sign along with the charge). These holes deflect like positive charges, so $R_H = +1/pe > 0$. This explains the positive Hall coefficients of metals such as beryllium and zinc and of p-type semiconductors.`,
      trap: R`Only a completely full band carries no current; a few empty states make it conduct, as holes.` },
  ],
  gens: [
    { id: 'bth-r4g1', type: 'nat', level: 3, exams: G, sub: 'two-site cells',
      make(r) {
        const t1 = pick(r, 0.5, 2.0, 0.1), t2 = round(t1 + choose(r, [-1, 1]) * pick(r, 0.1, 0.4, 0.05), 2), ask = choose(r, ['gap', 'span', 'width']);
        const val = ask === 'gap' ? 2 * Math.abs(t1 - t2) : ask === 'span' ? 2 * (t1 + t2) : t1 + t2 - Math.abs(t1 - t2);
        const what = ask === 'gap' ? 'the band gap' : ask === 'span' ? 'the energy from the bottom of the lower band to the top of the upper band' : 'the width of each band';
        return { q: `A dimerised 1D chain has two identical atoms per cell with hoppings $t_1 = ${t1}$ eV and $t_2 = ${t2}$ eV alternating, so $E(k) = \\pm|t_1 + t_2e^{ika}|$. ${what[0].toUpperCase() + what.slice(1)} is ______ eV (to two decimal places).`,
          answer: round(val, 2), tol: 0.01, t1, t2, ask,
          sol: `$|t_1 + t_2e^{ika}|$ runs from $t_1 + t_2 = ${round(t1 + t2, 2)}$ eV (at $k = 0$) down to $|t_1 - t_2| = ${round(Math.abs(t1 - t2), 2)}$ eV (at $ka = \\pi$). So the upper band spans $${round(Math.abs(t1 - t2), 2)}$ to $${round(t1 + t2, 2)}$ eV and the lower band is its mirror image. ${ask === 'gap' ? `Gap $= 2|t_1 - t_2| = ${round(val, 2)}$ eV.` : ask === 'span' ? `Total span $= 2(t_1 + t_2) = ${round(val, 2)}$ eV.` : `Each band is $(t_1 + t_2) - |t_1 - t_2| = 2\\min(t_1, t_2) = ${round(val, 2)}$ eV wide.`}`,
          trap: 'The band edges sit at $\\pm|t_1 - t_2|$, so the gap is twice that.' };
      },
      verify: (p) => (p.ask === 'gap' ? 2 * Math.abs(p.t1 - p.t2) : p.ask === 'span' ? 2 * (p.t1 + p.t2) : p.t1 + p.t2 - Math.abs(p.t1 - p.t2)) },
    { id: 'bth-r4g2', type: 'nat', level: 4, exams: G, sub: 'two-site cells',
      make(r) {
        const D = pick(r, 0.1, 1.5, 0.05), t = pick(r, 0.3, 2.0, 0.1), ask = choose(r, ['width', 'span', 'quarter']);
        const top = Math.sqrt(D * D + 4 * t * t), val = ask === 'width' ? top - D : ask === 'span' ? 2 * top : Math.sqrt(D * D + 2 * t * t);
        const what = ask === 'width' ? 'The width of the upper band' : ask === 'span' ? 'The energy from the bottom of the lower band to the top of the upper band' : 'The upper-band energy at $k = \\pi/2a$';
        return { q: `A 1D chain alternates atoms with on-site energies $\\pm\\Delta$, $\\Delta = ${D}$ eV, with hopping $t = ${t}$ eV between all neighbours: $E(k) = \\pm\\sqrt{\\Delta^2 + 4t^2\\cos^2(ka/2)}$ ($a$ = cell length). ${what} is ______ eV (to two decimal places).`,
          answer: round(val, 2), tol: 0.01, D, t, ask,
          sol: `The upper band runs from $\\Delta = ${D}$ eV (zone boundary) to $\\sqrt{\\Delta^2 + 4t^2} = ${round(top, 3)}$ eV ($k = 0$). ${ask === 'width' ? `Width $= ${round(top, 3)} - ${D} = ${round(val, 2)}$ eV.` : ask === 'span' ? `Span $= 2\\times${round(top, 3)} = ${round(val, 2)}$ eV.` : `At $ka/2 = \\pi/4$, $\\cos^2 = \\tfrac12$: $E = \\sqrt{\\Delta^2 + 2t^2} = ${round(val, 2)}$ eV.`}`,
          trap: 'The gap at the zone boundary is $2\\Delta$; do not confuse it with the band widths.' };
      },
      verify: (p) => { const top = Math.sqrt(p.D ** 2 + 4 * p.t ** 2); return p.ask === 'width' ? top - p.D : p.ask === 'span' ? 2 * top : Math.sqrt(p.D ** 2 + 2 * p.t ** 2); } },
    { id: 'bth-r4g3', type: 'mcq', level: 4, exams: G, sub: 'Fermi surface',
      make(r) {
        const [lat, nAt, face, faceTex] = choose(r, [['simple cubic', 1, 1, '\\pi/a'], ['bcc', 2, Math.SQRT2, '\\sqrt2\\,\\pi/a'], ['fcc', 4, Math.sqrt(3), '\\sqrt3\\,\\pi/a']]), Z = choose(r, [1, 2, 3]);
        const kF = Math.cbrt(3 * Math.PI ** 2 * Z * nAt), ratio = kF / (face * Math.PI);
        const o = mcqOptions(r, round(ratio, 3), [round(kF / Math.PI, 3) === round(ratio, 3) ? round(ratio * 1.2, 3) : round(kF / Math.PI, 3), round(Math.cbrt(3 * Math.PI ** 2 * Z) / (face * Math.PI), 3) === round(ratio, 3) ? round(ratio * 0.8, 3) : round(Math.cbrt(3 * Math.PI ** 2 * Z) / (face * Math.PI), 3), round(kF / (2 * face * Math.PI), 3), round(ratio ** 2, 3)], (v) => `$${v.toFixed(3)}$`);
        return { q: `A ${Z === 1 ? 'monovalent' : Z === 2 ? 'divalent' : 'trivalent'} metal has the ${lat} structure (conventional cube side $a$, ${nAt} atom${nAt > 1 ? 's' : ''} per cube). Its nearest Brillouin-zone face is $${faceTex}$ from the zone centre. The ratio of the free-electron $k_F$ to that distance is`, ...o,
          sol: `$n = ${Z * nAt}/a^3$, so $k_F = (3\\pi^2n)^{1/3} = ${round(kF, 3)}/a$. The nearest face is at $${round(face * Math.PI, 3)}/a$, giving a ratio of $${round(ratio, 3)}$. ${ratio > 1 ? 'Above 1: the free-electron sphere crosses into the second zone, so the Fermi surface is cut up by the zone faces.' : 'Below 1: the sphere fits inside the first zone, though band effects distort it near the faces.'}`,
          trap: 'Using one atom per cube for bcc or fcc, or taking the zone face at $\\pi/a$ for every lattice.' };
      } },
  ],
};
