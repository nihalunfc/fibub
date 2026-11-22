// Round 5 extras for conductors-images: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'cim-r5-01', type: 'nat', level: 3, exams: ['jam'], sub: 'electrostatic pressure',
      q: R`A metal surface carries a surface charge density of $10\ \mu$C/m². The outward electrostatic pressure on it is ______ Pa (two decimal places; $\varepsilon_0 = 8.85\times10^{-12}$ F/m).`,
      answer: 5.65, tol: 0.03, unit: 'Pa', calc: () => (10e-6) ** 2 / (2 * 8.85e-12),
      sol: R`The charge sits in a field that is $\sigma/\varepsilon_0$ just outside and $0$ just inside; on average it feels half, $\sigma/2\varepsilon_0$. Force per area $= \sigma\cdot\frac{\sigma}{2\varepsilon_0} = \frac{(10^{-5})^2}{2\times8.85\times10^{-12}} = 5.65$ Pa, always outward whatever the sign of $\sigma$.`,
      trap: R`Using the full outside field $\sigma/\varepsilon_0$ and getting twice the answer.` },
    { id: 'cim-r5-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'field at surface',
      q: R`Just outside the surface of a charged conductor, where the surface charge density is $\sigma$, the electric field is`,
      options: [R`$\sigma/2\varepsilon_0$, perpendicular to the surface`, R`$\sigma/\varepsilon_0$, perpendicular to the surface`, R`$\sigma/\varepsilon_0$, along the surface`, R`zero, because the conductor is an equipotential`], answer: 1,
      sol: R`A small Gaussian pillbox through the surface has flux only through its outer face (the field is zero inside the metal), so $EA = \sigma A/\varepsilon_0$. Any component along the surface would push charges around, so in equilibrium the field is normal.`,
      trap: R`Using the infinite-sheet result $\sigma/2\varepsilon_0$; a conductor has no field on its inner side.` },
    { id: 'cim-r5-03', type: 'msq', level: 3, exams: ['jam'], sub: 'induced charge', format: 'statements',
      q: R`A point charge $q$ is held at distance $d$ from the centre of an isolated, uncharged metal sphere of radius $R < d$. Which statements are true?`,
      options: [R`The potential of the sphere is $\dfrac{q}{4\pi\varepsilon_0 d}$`, R`The field inside the metal is zero`, R`The induced charge is spread uniformly over the surface`, R`The total induced charge on the sphere is zero`],
      answer: [0, 1, 3],
      sol: R`The sphere is one equipotential, so find its potential at the centre. The point charge gives $\frac{q}{4\pi\varepsilon_0d}$. The induced charges all lie at distance $R$ from the centre and add up to zero, so their contribution $\frac{1}{4\pi\varepsilon_0R}\sum q_i = 0$. The induced charge is negative on the near side and positive on the far side, so it is not uniform.`,
      trap: R`Thinking the uneven induced charge changes the sphere's potential; at the centre every induced charge is the same distance away.` },
    { id: 'cim-r5-04', type: 'nat', level: 4, exams: ['jam'], sub: 'earthed shells',
      q: R`Two thin concentric metal shells have radii $10$ cm and $30$ cm. The outer shell carries $+6.0$ nC; the inner shell is connected to earth through a small hole in the outer one. The charge on the inner shell is ______ nC.`,
      answer: -2, tol: 0.01, unit: 'nC', calc: () => -6 * 10 / 30,
      sol: R`Let the inner shell take charge $q'$. Its potential is $\frac{1}{4\pi\varepsilon_0}\left(\frac{q'}{a} + \frac{Q}{b}\right)$, because inside the outer shell its charge $Q$ gives the constant $\frac{Q}{4\pi\varepsilon_0b}$. Earthing sets this to zero: $q' = -Q\frac{a}{b} = -6.0\times\frac{10}{30} = -2.0$ nC.`,
      trap: R`Expecting $q' = -Q$; the inner shell only needs to cancel the outer shell's potential, not its charge.` },
    { id: 'cim-r5-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'capacitors', format: 'which is NOT',
      q: R`A parallel-plate air capacitor is charged and then disconnected from the battery. Its plates are then pulled apart to twice their separation. Which statement is NOT true?`,
      options: [R`The potential difference doubles`, R`The stored energy doubles`, R`The field between the plates doubles`, R`The work done pulling the plates apart equals the increase in stored energy`], answer: 2,
      sol: R`Disconnected, the charge $Q$ is fixed, so $E = \frac{Q}{\varepsilon_0A}$ does not change. $C$ halves, so $V = Q/C$ doubles and $U = Q^2/2C$ doubles. With no battery, the external work is the only energy input, so it equals the gain in stored energy.`,
      trap: R`Mixing up this case with a capacitor still joined to the battery (fixed $V$, so $E$ halves).` },
    { id: 'cim-r5-06', type: 'nat', level: 3, exams: ['jam'], sub: 'breakdown',
      q: R`Air breaks down at about $3.0$ MV/m. The largest charge a smooth metal sphere of radius $50$ cm can hold in air is ______ $\mu$C (one decimal place; $\frac1{4\pi\varepsilon_0} = 9.0\times10^9$ N m² C⁻²).`,
      answer: 83.3, tol: 0.3, unit: 'μC', calc: () => 3e6 * 0.5 ** 2 / 9e9 * 1e6,
      sol: R`The field is largest at the surface: $E = \frac{Q}{4\pi\varepsilon_0R^2}$. Setting $E = 3.0\times10^6$ V/m: $Q = \frac{ER^2}{9.0\times10^9} = \frac{3.0\times10^6\times0.25}{9.0\times10^9} = 8.33\times10^{-5}$ C $= 83.3\ \mu$C. (Its potential would then be $ER = 1.5$ MV.)`,
      trap: R`Using $R$ instead of $R^2$, which mixes up the charge with the potential limit $V = ER$.` },
    { id: 'cim-r5-07', type: 'mcq', level: 4, exams: ['jam'], sub: 'cavities',
      q: R`A point charge $q$ sits off-centre inside a spherical cavity in an uncharged, isolated metal sphere. On the outer surface of the metal sphere, the induced charge density is`,
      options: [R`larger on the side nearest the charge`, R`zero everywhere`, R`set by the shape and position of the cavity`, R`uniform`], answer: 3,
      sol: R`The cavity wall carries $-q$, arranged so that the field of $q$ plus the wall charge is zero everywhere in the metal and beyond. The remaining $+q$ goes to the outer surface. It feels nothing from inside, so it spreads as on an isolated sphere: uniformly. The field outside is that of $q$ at the sphere's centre, wherever $q$ is in the cavity.`,
      trap: R`Expecting the outer charge to "know" where $q$ is; the metal screens that information.` },
    { id: 'cim-r5-08', type: 'nat', level: 3, exams: ['jam'], sub: 'parallel plates',
      q: R`Two large parallel metal plates face each other. One carries $+5.0\ \mu$C in total, the other $-1.0\ \mu$C. The charge on the outer face of the first plate (the face away from the gap) is ______ $\mu$C.`,
      answer: 2, tol: 0.01, unit: 'μC', calc: () => (5 + -1) / 2,
      sol: R`For two parallel plates, the two outer faces always carry equal charge, $\frac{Q_1 + Q_2}{2}$, and the inner faces carry $\pm\frac{Q_1 - Q_2}{2}$ (this makes the field zero inside each plate). Outer face: $\frac{5 + (-1)}{2} = 2.0\ \mu$C. Inner faces: $+3.0$ and $-3.0\ \mu$C.`,
      trap: R`Assuming all of each plate's charge sits on its inner face, as for a charged capacitor with equal and opposite charges.` },
    { id: 'cim-r5-09', type: 'mcq', level: 3, exams: ['jam'], sub: 'induced charge',
      q: R`A small charged bead is brought near a large uncharged metal plate on an insulating stand. The force between the bead and the plate is`,
      options: [R`attractive, whatever the sign of the bead's charge`, R`attractive only if the bead is negative`, R`repulsive, whatever the sign of the bead's charge`, R`zero, because the plate is uncharged`], answer: 0,
      sol: R`The bead pulls opposite charge to the near face of the plate and pushes like charge away. The opposite charge is closer, so its pull wins. Changing the bead's sign flips every induced charge too, so the force stays attractive.`,
      trap: R`Thinking an uncharged body feels no force; induced charge always attracts.` },
    { id: 'cim-r5-10', type: 'msq', level: 2, exams: ['jam'], sub: 'conductor properties', format: 'statements',
      q: R`An irregularly shaped metal object carries charge and is in equilibrium. Which statements are true?`,
      options: [R`Its whole surface is at one potential`, R`Just outside, the field is perpendicular to the surface`, R`The charge density is the same everywhere on its surface`, R`The potential inside the metal equals the potential at its surface`],
      answer: [0, 1, 3],
      sol: R`In equilibrium there is no field inside the metal, so the whole body (inside and surface) is at one potential, and the field outside meets the surface at right angles. The charge density is largest where the surface curves most sharply, so it is not uniform.`,
      trap: R`Equal potential does not mean equal charge density.` },
  ],
  gens: [
    { id: 'cim-r5g1', type: 'nat', level: 3, exams: ['jam'], sub: 'electrostatic pressure',
      make(r) {
        const byE = r() < 0.5, x = int(r, 2, 30);
        const P = byE ? 0.5 * C.eps0 * (x * 1e5) ** 2 : (x * 1e-6) ** 2 / (2 * C.eps0);
        return { q: byE ? `Just outside a charged metal surface the field is $${x}\\times10^5$ V/m. The outward force per unit area on the surface charge is ______ Pa (two decimal places).`
          : `A metal surface carries $${x}\\ \\mu$C/m². The outward force per unit area on its charge is ______ Pa (two decimal places).`,
          answer: round(P, 2), tol: Math.max(0.01, round(P * 0.005, 2)), unit: 'Pa', byE, x,
          sol: byE ? `$P = \\tfrac12\\varepsilon_0E^2 = 0.5\\times8.854\\times10^{-12}\\times(${x}\\times10^5)^2 = ${round(P, 2)}$ Pa.`
            : `$P = \\frac{\\sigma^2}{2\\varepsilon_0} = \\frac{(${x}\\times10^{-6})^2}{2\\times8.854\\times10^{-12}} = ${round(P, 2)}$ Pa.`,
          trap: 'The charge feels the average of the fields on both sides, half the outside field.' };
      },
      verify: (p) => (p.byE ? 0.5 * C.eps0 * (p.x * 1e5) ** 2 : (p.x * 1e-6) ** 2 / (2 * C.eps0)) },
    { id: 'cim-r5g2', type: 'nat', level: 4, exams: ['jam'], sub: 'earthed shells',
      make(r) {
        const a = int(r, 2, 10), b = a + int(r, 2, 20), Q = choose(r, [-9, -6, -4, 3, 5, 8, 12]), q = -Q * a / b;
        return { q: `Concentric thin metal shells have radii $${a}$ cm and $${b}$ cm. The outer shell carries $${Q}$ nC and the inner one is earthed. The charge on the inner shell is ______ nC (two decimal places).`,
          answer: round(q, 2), tol: 0.01, unit: 'nC', a, b, Q,
          sol: `Inner potential $= \\frac{1}{4\\pi\\varepsilon_0}\\left(\\frac{q'}{${a}} + \\frac{${Q}}{${b}}\\right) = 0$ (distances in cm cancel), so $q' = -Q\\frac{a}{b} = ${round(q, 2)}$ nC.`,
          trap: 'Earthing sets the potential to zero, not the charge to $-Q$.' };
      },
      verify: (p) => -p.Q * p.a / p.b },
    { id: 'cim-r5g3', type: 'nat', level: 3, exams: ['jam'], sub: 'parallel plates',
      make(r) {
        const Q1 = int(r, -8, 12), Q2 = int(r, -10, 8), outer = r() < 0.5, ans = outer ? (Q1 + Q2) / 2 : (Q1 - Q2) / 2;
        return { q: `Two large parallel metal plates carry total charges $${Q1}\\ \\mu$C and $${Q2}\\ \\mu$C. The charge on the ${outer ? 'outer face (away from the gap)' : 'inner face (facing the gap)'} of the first plate is ______ $\\mu$C (one decimal place).`,
          answer: round(ans, 1), tol: 0.05, unit: 'μC', Q1, Q2, outer,
          sol: `Zero field inside each plate forces the outer faces to carry $\\frac{Q_1 + Q_2}{2} = ${(Q1 + Q2) / 2}\\ \\mu$C each and the inner faces $\\pm\\frac{Q_1 - Q_2}{2}$; the first plate's inner face has $${(Q1 - Q2) / 2}\\ \\mu$C. Answer: $${round(ans, 1)}\\ \\mu$C.`,
          trap: 'The outer faces always share the total charge equally.' };
      },
      verify: (p) => (p.outer ? (p.Q1 + p.Q2) / 2 : (p.Q1 - p.Q2) / 2) },
  ],
};
