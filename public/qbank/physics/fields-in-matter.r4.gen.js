// Round 4 extras for fields-in-matter: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'fim-r4-01', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'bound currents',
      q: R`A sphere of radius $1.0$ cm is uniformly magnetised with $M = 1.0\times10^5$ A/m along $z$. The total bound current crossing a half-plane $\phi = $ constant (from the north pole to the south pole along the surface) is ______ A.`,
      answer: 2000, tol: 1, unit: 'A', calc: () => 2 * 1e5 * 0.01,
      sol: R`The bound surface current is $\vec K_b = \vec M\times\hat n = M\sin\theta\,\hat\phi$ (no volume current, since $\vec M$ is uniform). It flows round the sphere like the current on a spinning charged shell. Crossing a meridian: $I = \int_0^\pi K_b\,R\,d\theta = MR\int_0^\pi\sin\theta\,d\theta = 2MR = 2\times10^5\times0.010 = 2000$ A.`,
      trap: R`Taking $K = M$ everywhere (giving $\pi MR$); the current density falls to zero at the poles.` },
    { id: 'fim-r4-02', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'bound currents',
      q: R`A long solenoid with $1000$ turns per metre carries $2.0$ A and is filled with a linear core of $\chi_m = 499$. The bound surface current on the core's curved surface is ______ kA/m.`,
      answer: 998, tol: 1, unit: 'kA/m', calc: () => 499 * 1000 * 2 / 1e3,
      sol: R`Inside the long solenoid $H = nI = 2000$ A/m (set by free current). $M = \chi_mH = 9.98\times10^5$ A/m, and the bound surface current is $K_b = |\vec M\times\hat n| = M = 998$ kA/m, flowing the same way as the windings. So the core acts like 499 extra windings' worth of current for each real one.`,
      trap: R`Using $\mu_r = 500$ instead of $\chi_m = 499$; the bound current comes from $M$ only.` },
    { id: 'fim-r4-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cavities',
      q: R`In a large block of linear dielectric ($\varepsilon_r = 5$) the field is a uniform $200$ V/m. A thin, flat, disc-shaped cavity is cut with its faces perpendicular to the field. The field inside the cavity is ______ V/m.`,
      answer: 1000, tol: 1, unit: 'V/m', calc: () => 5 * 200,
      sol: R`Across the wide faces the normal component of $\vec D$ is continuous (no free charge), so inside the cavity $D = \varepsilon_r\varepsilon_0E = $ the same as in the dielectric. In the empty cavity $E = D/\varepsilon_0 = \varepsilon_rE = 5\times200 = 1000$ V/m. (A needle-shaped cavity along the field would instead keep the tangential $E$, 200 V/m.)`,
      trap: R`Assuming the cavity field equals the dielectric's field; for a flat cavity across the field it is $\varepsilon_r$ times larger.` },
    { id: 'fim-r4-04', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'energy',
      q: R`A sphere of radius $1.0$ cm made of linear dielectric ($\varepsilon_r = 4$) is placed in a uniform field of $1.0\times10^5$ V/m (the sources held fixed). The energy of interaction, $-\tfrac12\vec p\cdot\vec E_0$, has size ______ $\mu$J (three decimal places).`,
      answer: 0.278, tol: 0.003, unit: 'μJ', calc: () => 2 * Math.PI * C.eps0 * 1e-6 * 0.5 * 1e10 * 1e6,
      sol: R`The sphere gains $\vec p = 4\pi\varepsilon_0R^3\frac{\varepsilon_r - 1}{\varepsilon_r + 2}\vec E_0$, with $\frac{\varepsilon_r - 1}{\varepsilon_r + 2} = \frac12$. For an induced dipole the energy is $-\frac12pE_0$ (half of $-pE_0$, because the dipole is built up as the field is applied): $|U| = 2\pi\varepsilon_0R^3\times\frac12\times E_0^2 = 2\pi\times8.854\times10^{-12}\times10^{-6}\times0.5\times10^{10} = 2.78\times10^{-7}$ J. The negative sign is why dielectrics are drawn into strong fields.`,
      trap: R`Using $-pE_0$ as for a permanent dipole, which doubles the answer.` },
    { id: 'fim-r4-05', type: 'nat', level: 2, exams: ['jam'], sub: 'magnetisation',
      q: R`Inside a linear iron core with $\mu_r = 1500$ the magnetic field is $B = 1.2$ T. The magnetisation is ______ kA/m (one decimal place).`,
      answer: 954.3, tol: 1, unit: 'kA/m', calc: () => 1499 * 1.2 / (C.mu0 * 1500) / 1e3,
      sol: R`$H = \frac{B}{\mu_0\mu_r} = \frac{1.2}{1.2566\times10^{-6}\times1500} = 636.6$ A/m. Then $M = \chi_mH = (\mu_r - 1)H = 1499\times636.6 = 9.543\times10^5$ A/m. Almost all of $B$ comes from the magnetisation: $\mu_0M = 1.1992$ T, against $\mu_0H = 0.0008$ T.`,
      trap: R`Using $M = B/\mu_0$, which ignores the small $H$ (here it changes only the last digit, but not in general).` },
    { id: 'fim-r4-06', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'depolarisation',
      q: R`Three bodies of the same linear dielectric ($\varepsilon_r > 1$) are placed in the same uniform field $E_0$: a long thin needle along the field, a sphere, and a thin flat disc with its faces perpendicular to the field. Rank the fields inside them.`,
      options: [R`disc > sphere > needle`, R`needle > sphere > disc`, R`sphere > needle > disc`, R`all equal to $E_0$`], answer: 1,
      sol: R`Inside an ellipsoid $E = \frac{E_0}{1 + N(\varepsilon_r - 1)}$, with depolarising factor $N = 0$ for a needle along the field, $\frac13$ for a sphere and $1$ for a disc across the field. So the needle has $E_0$ (bound charges only at its far-off tips), the sphere $\frac{3E_0}{\varepsilon_r + 2}$, the disc $E_0/\varepsilon_r$ (normal $D$ continuous).`,
      trap: R`Ignoring shape: the bound surface charges, and so the internal field, depend strongly on it.` },
    { id: 'fim-r4-07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'energy',
      q: R`In a linear magnetic material with $\mu_r = 1000$, the magnetic energy stored per unit volume for a given $B$, compared with vacuum carrying the same $B$, is`,
      options: [R`1000 times larger`, R`the same`, R`1000 times smaller`, R`$10^6$ times smaller`], answer: 2,
      sol: R`For a linear medium $u = \frac12\vec B\cdot\vec H = \frac{B^2}{2\mu_r\mu_0}$. At fixed $B$ this is $1/\mu_r$ of the vacuum value $\frac{B^2}{2\mu_0}$. That is why in an iron-cored magnet with a small air gap most of the energy is in the gap.`,
      trap: R`Thinking "more permeable" means "stores more energy"; at fixed $H$ it would, at fixed $B$ it stores less.` },
    { id: 'fim-r4-08', type: 'mcq', level: 1, exams: ['jam'], sub: 'field lines',
      q: R`Which field's lines never begin or end anywhere, even inside and around magnetised or polarised matter?`,
      options: [R`$\vec E$`, R`$\vec D$`, R`$\vec H$`, R`$\vec B$`], answer: 3,
      sol: R`$\nabla\cdot\vec B = 0$ always: no magnetic charges, bound or free. $\vec E$ lines start and end on all charges, $\vec D$ lines on free charges, and $\vec H$ lines start and end where $\nabla\cdot\vec M\ne0$ (for example at the ends of a bar magnet).`,
      trap: R`Choosing $\vec H$ because it is "the magnetic field too"; its divergence is $-\nabla\cdot\vec M$.` },
    { id: 'fim-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'cavities',
      q: R`Inside a uniformly magnetised material (fields $\vec B$ and $\vec H$), small cavities are cut with different shapes. Which pairing is correct?`,
      options: [R`A needle-shaped cavity along $\vec M$ contains $\mu_0\vec H$; a flat disc-shaped cavity across $\vec M$ contains $\vec B$`, R`A needle-shaped cavity along $\vec M$ contains $\vec B$; a flat disc-shaped cavity across $\vec M$ contains $\mu_0\vec H$`, R`Both cavities contain $\vec B$`, R`Both cavities contain $\mu_0\vec H$`], answer: 0,
      sol: R`Along the long sides of a needle the tangential $\vec H$ is continuous (no free current), so the cavity field is $\mu_0\vec H$; the end faces are too small to matter. Across the broad faces of a disc the normal $\vec B$ is continuous, so the cavity field is $\vec B$. Kelvin used exactly these two cavities to define $\vec H$ and $\vec B$ in matter.`,
      trap: R`Swapping the boundary conditions: tangential goes with $\vec H$, normal with $\vec B$.` },
    { id: 'fim-r4-10', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'depolarisation',
      q: R`A body of linear isotropic dielectric is placed in a uniform external field. For which shape is the field inside it uniform?`,
      options: [R`a cube`, R`any ellipsoid`, R`a cylinder of finite length`, R`a hemisphere`], answer: 1,
      sol: R`A uniformly polarised ellipsoid (sphere, spheroid, needle and disc as limits) produces a uniform field inside, so a uniform $\vec P$ is self-consistent in a uniform applied field. For other shapes, such as a cube or a finite cylinder, the bound charges at edges and corners make the internal field non-uniform, so $\vec P$ is non-uniform too.`,
      trap: R`Assuming the field inside any linear body is uniform because the applied field is.` },
    { id: 'fim-r4-11', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'bar magnet', format: 'statements',
      q: R`A bar magnet is uniformly magnetised along its length, with no free current anywhere. Which statements are true?`,
      options: [R`$\vec B$ lines form closed loops, running from the N end to the S end outside and back from S to N inside`, R`Inside the magnet, $\vec H$ points from the N end towards the S end, opposite to $\vec M$`, R`The bound current flows around the curved side surface, like the winding of a solenoid`, R`The magnetic pole density $-\nabla\cdot\vec M$ is spread throughout the volume`],
      answer: [0, 1, 2],
      sol: R`$\nabla\cdot\vec B = 0$ makes $\vec B$ lines close on themselves. $\vec H$ behaves like an electrostatic field from "pole" charges $\vec M\cdot\hat n$ on the end faces (positive at the N end), so inside it points N to S, against $\vec M$. $\vec K_b = \vec M\times\hat n$ is non-zero only on the side surface. For uniform $\vec M$, $\nabla\cdot\vec M = 0$ inside: the poles live only on the end faces.`,
      trap: R`Expecting $\vec H$ and $\vec B$ to point the same way inside a permanent magnet.` },
    { id: 'fim-r4-12', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'constitutive relations', format: 'statements',
      q: R`Which statements about the response of matter are true?`,
      options: [R`In an anisotropic crystal, $\vec D$ need not be parallel to $\vec E$`, R`In a ferroelectric, $\vec P$ can be non-zero when $\vec E = 0$`, R`Inside a uniform linear isotropic dielectric with no free charge, the bound volume charge is zero`, R`In a linear isotropic dielectric, $\vec P$ points opposite to $\vec E$`],
      answer: [0, 1, 2],
      sol: R`In an anisotropic medium $D_i = \varepsilon_{ij}E_j$ with a tensor $\varepsilon_{ij}$, so the two vectors differ in direction unless $\vec E$ lies along a principal axis. A ferroelectric has spontaneous polarisation (with hysteresis), like a ferromagnet's $\vec M$. In a uniform linear medium $\rho_b = -\nabla\cdot\vec P = -\frac{\chi_e}{1 + \chi_e}\rho_f = 0$ when $\rho_f = 0$. And $\vec P = \varepsilon_0\chi_e\vec E$ with $\chi_e > 0$, so it is parallel to $\vec E$.`,
      trap: R`Mixing up the direction of $\vec P$ (along $\vec E$) with that of the field its bound charges produce (against $\vec E$).` },
  ],
  gens: [
    { id: 'fim-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'depolarisation',
      make(r) {
        const [shape, N, ntex] = choose(r, [['a sphere', 1 / 3, '1/3'], ['a thin flat disc with its faces perpendicular to the field', 1, '1'], ['a long thin needle lying across the field', 0.5, '1/2'], ['a long thin needle along the field', 0, '0']]);
        const er = choose(r, [2, 3, 4, 5, 6, 8, 10]), E0 = int(r, 1, 20) * 100;
        const E = E0 / (1 + N * (er - 1));
        return { q: `A body of linear dielectric ($\\varepsilon_r = ${er}$) shaped as ${shape} is placed in a uniform field of $${E0}$ V/m. The field inside it is ______ V/m (one decimal place).`,
          answer: round(E, 1), tol: Math.max(0.1, round(E * 0.002, 1)), unit: 'V/m', N, er, E0,
          sol: `Inside an ellipsoid $E = \\frac{E_0}{1 + N(\\varepsilon_r - 1)}$, with depolarising factor $N = ${ntex}$ here. So $E = \\frac{${E0}}{1 + ${ntex}\\times${er - 1}} = ${round(E, 1)}$ V/m.`,
          trap: 'The depolarising factor depends on the shape and on how the body sits in the field.' };
      },
      verify: (p) => p.E0 / (1 + p.N * (p.er - 1)) },
    { id: 'fim-r4g2', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'energy',
      make(r) {
        const Rcm = int(r, 1, 5), er = choose(r, [2, 3, 4, 5, 7, 10]), E0 = int(r, 1, 9) * 1e4;
        const K = (er - 1) / (er + 2), U = 2 * Math.PI * C.eps0 * (Rcm / 100) ** 3 * K * E0 * E0 * 1e6;
        return { q: `A sphere of radius $${Rcm}$ cm made of linear dielectric ($\\varepsilon_r = ${er}$) is placed in a uniform field of $${E0 / 1e4}\\times10^4$ V/m. The size of its interaction energy $-\\tfrac12\\vec p\\cdot\\vec E_0$ is ______ $\\mu$J (three significant figures).`,
          answer: +U.toPrecision(3), tol: +(U * 0.006).toPrecision(2), unit: 'μJ', Rcm, er, E0,
          sol: `$p = 4\\pi\\varepsilon_0R^3\\frac{\\varepsilon_r - 1}{\\varepsilon_r + 2}E_0$ with $\\frac{\\varepsilon_r - 1}{\\varepsilon_r + 2} = ${round(K, 4)}$. $|U| = \\frac12pE_0 = 2\\pi\\varepsilon_0R^3(${round(K, 4)})E_0^2 = ${+U.toPrecision(3)}\\ \\mu$J.`,
          trap: 'An induced dipole has energy $-\\frac12pE$, not $-pE$.' };
      },
      verify: (p) => 2 * Math.PI * C.eps0 * (p.Rcm / 100) ** 3 * (p.er - 1) / (p.er + 2) * p.E0 * p.E0 * 1e6 },
    { id: 'fim-r4g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bound currents',
      make(r) {
        const Rmm = int(r, 2, 30), M = int(r, 1, 15) * 1e5, ask = r() < 0.5 ? 'I' : 'm';
        const val = ask === 'I' ? 2 * M * Rmm / 1000 : 4 / 3 * Math.PI * (Rmm / 1000) ** 3 * M;
        return { q: `A sphere of radius $${Rmm}$ mm is uniformly magnetised with $M = ${M / 1e5}\\times10^5$ A/m. ${ask === 'I' ? 'The total bound surface current crossing a meridian (pole to pole) is ______ A' : 'Its magnetic dipole moment is ______ A m²'} (three significant figures).`,
          answer: +val.toPrecision(3), tol: +(val * 0.005).toPrecision(2), unit: ask === 'I' ? 'A' : 'A m²', Rmm, M, ask,
          sol: ask === 'I'
            ? `$K_b = M\\sin\\theta$ around the sphere; across a meridian $I = \\int_0^\\pi MR\\sin\\theta\\,d\\theta = 2MR = 2\\times${M}\\times${Rmm / 1000} = ${+val.toPrecision(3)}$ A.`
            : `$m = MV = \\frac43\\pi R^3M = \\frac43\\pi(${Rmm / 1000})^3\\times${M} = ${+val.toPrecision(3)}$ A m².`,
          trap: ask === 'I' ? 'The surface current density is $M\\sin\\theta$, not $M$.' : 'Magnetisation is moment per unit volume.' };
      },
      verify: (p) => (p.ask === 'I' ? 2 * p.M * p.Rmm / 1000 : 4 / 3 * Math.PI * (p.Rmm / 1000) ** 3 * p.M) },
  ],
};
