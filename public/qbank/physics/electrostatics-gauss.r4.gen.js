// Round 4 extras for electrostatics-gauss: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round, C } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const J = ['jam'];
const k = 1 / (4 * Math.PI * C.eps0);

export default {
  items: [
    { id: 'esg-r4-01', type: 'mcq', level: 1, exams: A, sub: 'gauss law',
      q: R`A point charge sits at the centre of a closed rubber balloon. It is then moved until it is close to the rubber, but still inside. The total electric flux out through the balloon`,
      options: [R`doubles, because the charge is now closer to part of the surface`, R`falls to zero, because the field lines now leave through one side only`, R`stays the same`, R`depends on the exact shape of the balloon`],
      answer: 2,
      sol: R`Gauss's law says the total flux through any closed surface is $q_{\rm enc}/\varepsilon_0$. The charge is still enclosed, so the flux is unchanged. What changes is how the flux is shared out: more passes through the nearby patch of rubber and less through the far side, but the total is fixed.`,
      trap: R`Confusing the field at one point (which does change) with the flux through the whole closed surface (which does not).` },
    { id: 'esg-r4-02', type: 'nat', level: 2, exams: A, sub: 'conductors', unit: R`$\times10^5$ C`,
      q: R`In fair weather the Earth's surface has an electric field of about $100$ V/m pointing straight down. Treating the Earth as a conducting sphere of radius $6.37\times10^6$ m, the magnitude of its net charge is ______ $\times10^5$ C (to two decimal places).`,
      answer: 4.51, tol: 0.05, calc: () => 4 * Math.PI * C.eps0 * 6.37e6 ** 2 * 100 / 1e5,
      sol: R`Just outside a conductor $E = \sigma/\varepsilon_0$, and for a sphere this is the same as Gauss's law with a sphere just above the ground: $Q = 4\pi\varepsilon_0R^2E = 4\pi(8.854\times10^{-12})(6.37\times10^6)^2(100) = 4.51\times10^5$ C. The field points down (into the ground), so the charge is negative: about $-4.5\times10^5$ C.`,
      trap: R`Using $\sigma/2\varepsilon_0$ (the field of a thin isolated sheet) instead of $\sigma/\varepsilon_0$ for a conductor doubles the answer.` },
    { id: 'esg-r4-03', type: 'mcq', level: 2, exams: A, sub: 'spherical symmetry',
      q: R`Two thin concentric spherical shells have radii $a < b$. The inner shell carries charge $+Q$ and the outer shell $-3Q$, each spread uniformly. At a distance $r > b$ from the centre, the electric field is`,
      options: [R`$\dfrac{2Q}{4\pi\varepsilon_0r^2}$, pointing towards the centre`, R`$\dfrac{2Q}{4\pi\varepsilon_0r^2}$, pointing away from the centre`, R`$\dfrac{4Q}{4\pi\varepsilon_0r^2}$, pointing towards the centre`, R`zero, because the outer shell screens the inner one`],
      answer: 0,
      sol: R`Take a Gaussian sphere of radius $r > b$. It encloses $Q - 3Q = -2Q$, so $E\cdot4\pi r^2 = -2Q/\varepsilon_0$ and $E = -\dfrac{2Q}{4\pi\varepsilon_0r^2}$: magnitude $2Q/4\pi\varepsilon_0r^2$, pointing inward because the net enclosed charge is negative. Between the shells only $+Q$ is enclosed and the field points outward.`,
      trap: R`A shell of charge does not screen what is inside it from the outside; only a grounded conductor can do that.` },
    { id: 'esg-r4-04', type: 'msq', level: 3, exams: A, sub: 'surface charge', format: 'statements',
      q: R`A thin spherical shell carries a uniform surface charge density $\sigma > 0$. Which statements are correct?`,
      options: [R`Just outside the shell the field is $\sigma/\varepsilon_0$, pointing outward.`, R`The electric force on each patch of the shell pushes it inward, towards the centre.`, R`Everywhere inside the shell the field is zero.`, R`The field that acts on a patch of the shell itself is $\sigma/2\varepsilon_0$, the average of the fields just inside and just outside.`],
      answer: [0, 2, 3],
      sol: R`Gauss's law with a sphere just outside gives $E = Q/4\pi\varepsilon_0R^2 = \sigma/\varepsilon_0$; a sphere inside encloses nothing, so $E = 0$ there. A patch does not push on itself, so the field acting on it is that of all the other charge, which is the average $\tfrac12(\sigma/\varepsilon_0 + 0) = \sigma/2\varepsilon_0$. The force per unit area is $\sigma\cdot\sigma/2\varepsilon_0 = \sigma^2/2\varepsilon_0$, pointing <b>outward</b>: like charges repel, so the shell wants to expand.`,
      trap: R`Using the full outside field $\sigma/\varepsilon_0$ for the force on the patch doubles the pressure; and the force on a charged shell is always outward, whatever the sign of $\sigma$.` },
    { id: 'esg-r4-05', type: 'nat', level: 3, exams: A, sub: 'non-uniform charge', unit: '%',
      q: R`A spherical charge cloud has density $\rho = \rho_0e^{-r/a}$ extending to infinity. The percentage of its total charge that lies within $r = a$ is ______ (to two decimal places).`,
      answer: 8.03, tol: 0.05, calc: () => 100 * (1 - 2.5 / Math.E),
      sol: R`$Q(r) = 4\pi\rho_0\displaystyle\int_0^r r'^2e^{-r'/a}dr'$. With $u = r'/a$: $Q(a) = 4\pi\rho_0a^3\displaystyle\int_0^1u^2e^{-u}du = 4\pi\rho_0a^3\left(2 - \dfrac5e\right)$, using $\int u^2e^{-u}du = -e^{-u}(u^2 + 2u + 2)$. The total is $4\pi\rho_0a^3\displaystyle\int_0^\infty u^2e^{-u}du = 8\pi\rho_0a^3$. Fraction $= \dfrac{2 - 5/e}{2} = 1 - \dfrac{2.5}{e} = 0.0803$, i.e. $8.03\%$. Most of the charge sits further out, because the volume of a shell grows as $r^2$.`,
      trap: R`Expecting most of the charge inside $r = a$ because the density is highest there; the $r^2$ in the volume element pushes the bulk of the charge outward (the shell holding most charge is at $r = 2a$).` },
    { id: 'esg-r4-06', type: 'mcq', level: 3, exams: A, sub: 'gauss law',
      q: R`A point charge $q$ sits exactly on a smooth, gently curved part of a closed surface (it is neither inside nor outside). Counting the field lines that leave it into the enclosed region, the electric flux out of the closed surface is`,
      options: [R`$0$`, R`$q/\varepsilon_0$`, R`$q/4\varepsilon_0$`, R`$q/2\varepsilon_0$`],
      answer: 3,
      sol: R`Very close to the charge the smooth surface looks like a flat plane, so it divides the charge's field lines into two equal halves: half enter the enclosed region and leave through the rest of the surface, half go straight out. The flux through the closed surface is therefore $\tfrac12\,q/\varepsilon_0$. (At a cube edge the surface subtends a quarter, giving $q/4\varepsilon_0$; at a corner an eighth.)`,
      trap: R`Treating the charge as either fully inside ($q/\varepsilon_0$) or fully outside ($0$).` },
    { id: 'esg-r4-07', type: 'mcq', level: 4, exams: A, sub: 'cylindrical symmetry',
      q: R`A thin wire along the axis carries charge $+\lambda$ per unit length. Around it, a solid cylinder of radius $R$ is filled with a uniform charge density chosen so that its charge per unit length is exactly $-\lambda$. At distance $s$ from the axis the field magnitude is`,
      options: [R`$\dfrac{\lambda}{2\pi\varepsilon_0s}$ everywhere`, R`$\dfrac{\lambda}{2\pi\varepsilon_0s}\left(1 - \dfrac{s^2}{R^2}\right)$ for $s < R$ and zero for $s > R$`, R`zero everywhere, because the total charge is zero`, R`$\dfrac{\lambda}{2\pi\varepsilon_0s}\left(1 - \dfrac{s}{R}\right)$ for $s < R$ and zero for $s > R$`],
      answer: 1,
      sol: R`A Gaussian cylinder of radius $s$ and length $l$ encloses $\lambda l$ from the wire and $-\lambda l\,(\pi s^2/\pi R^2) = -\lambda l\,s^2/R^2$ from the uniform cylinder. So $E\cdot2\pi sl = \dfrac{\lambda l}{\varepsilon_0}\left(1 - \dfrac{s^2}{R^2}\right)$, giving the second option. Outside the enclosed charge is zero, so $E = 0$. The field falls smoothly to zero at $s = R$.`,
      trap: R`The enclosed fraction of a uniform cylinder grows with the cross-section area, $s^2/R^2$, not with $s/R$.` },
    { id: 'esg-r4-08', type: 'nat', level: 4, exams: A, sub: 'field energy', unit: '%',
      q: R`A non-conducting sphere carries charge spread uniformly through its volume. The percentage of its total electrostatic field energy that is stored <b>inside</b> the sphere is ______ (to one decimal place).`,
      answer: 16.7, tol: 0.2, calc: () => 100 / 6,
      sol: R`Inside, Gauss's law gives $E = \dfrac{Qr}{4\pi\varepsilon_0R^3}$; outside $E = \dfrac{Q}{4\pi\varepsilon_0r^2}$. With $u = \tfrac12\varepsilon_0E^2$ and $dV = 4\pi r^2dr$: $U_{\rm in} = \dfrac{Q^2}{8\pi\varepsilon_0R^6}\displaystyle\int_0^Rr^4dr = \dfrac{Q^2}{40\pi\varepsilon_0R}$ and $U_{\rm out} = \dfrac{Q^2}{8\pi\varepsilon_0}\displaystyle\int_R^\infty\dfrac{dr}{r^2} = \dfrac{Q^2}{8\pi\varepsilon_0R}$. The total is $\dfrac{3Q^2}{20\pi\varepsilon_0R}$, and the inside share is $\dfrac{1/40}{3/20} = \dfrac16 = 16.7\%$.`,
      trap: R`Assuming the energy is mostly inside because the charge is; five sixths of it is in the field outside.` },
    { id: 'esg-r4-09', type: 'msq', level: 4, exams: A, sub: 'flux', format: 'statements',
      q: R`A small electric dipole (charges $\pm q$ a tiny distance apart along $z$, $+q$ on top) sits at the centre of an imaginary sphere of radius $R$. Which statements are correct?`,
      options: [R`The flux out through the upper hemisphere (the side of $+q$) is positive.`, R`The field is zero at every point of the sphere.`, R`The flux through the upper hemisphere does not depend on $R$.`, R`The total flux out through the whole sphere is zero.`],
      answer: [0, 3],
      sol: R`The sphere encloses net charge zero, so the total flux is zero, even though the field on the sphere is not zero. On the sphere the radial field is $E_r = \dfrac{2p\cos\theta}{4\pi\varepsilon_0R^3}$, positive on the upper half. Flux through the upper hemisphere: $\displaystyle\int_0^{\pi/2}\dfrac{2p\cos\theta}{4\pi\varepsilon_0R^3}\,2\pi R^2\sin\theta\,d\theta = \dfrac{p}{2\varepsilon_0R}$, positive and falling as $1/R$; an equal flux enters through the lower half.`,
      trap: R`Zero total flux does not mean zero field; and the hemisphere flux is not fixed by Gauss's law because a hemisphere is not a closed surface.` },
    { id: 'esg-r4-10', type: 'nat', level: 5, exams: A, sub: 'superposition',
      q: R`A uniformly charged solid ball (density $\rho$, radius $R$) is cut in half along a plane through its centre and one half is taken away. At the centre of the flat face of the remaining hemisphere, the field magnitude divided by the field at the surface of the original whole ball, $\rho R/3\varepsilon_0$, is ______ (to two decimal places).`,
      answer: 0.75, tol: 0.01, calc: () => (1 / 4) / (1 / 3),
      sol: R`Put the hemisphere in $z \ge 0$. By symmetry only $E_z$ survives at the centre. A volume element at distance $r$, direction $\theta$ gives $dE_z = -\dfrac{\rho\,r^2dr\,d\Omega}{4\pi\varepsilon_0r^2}\cos\theta$. The $r^2$ cancels: $|E| = \dfrac{\rho}{4\pi\varepsilon_0}\displaystyle\int_0^Rdr\int_{\rm upper}\cos\theta\,d\Omega = \dfrac{\rho}{4\pi\varepsilon_0}\,R\,\pi = \dfrac{\rho R}{4\varepsilon_0}$, pointing away from the hemisphere. Ratio $= \dfrac{1/4}{1/3} = 0.75$.`,
      trap: R`Assuming the field at the centre is zero as for the whole ball; removing half breaks the symmetry. Gauss's law alone cannot give this field, because the hemisphere has no Gaussian surface with constant $E$.` },
  ],
  gens: [
    { id: 'esg-r4g1', type: 'nat', level: 2, exams: A, sub: 'conductors',
      make(r) {
        const Rc = choose(r, [2, 5, 8, 10, 15, 20, 25]), E = choose(r, [5, 10, 20, 30, 50, 80, 120]);
        const Q = 4 * Math.PI * C.eps0 * (Rc / 100) ** 2 * E * 1e3 * 1e9;
        return { q: R`A charged conducting sphere of radius $${Rc}$ cm has an electric field of $${E}$ kV/m just outside its surface. Its charge is ______ nC (to two decimal places).`,
          answer: round(Q, 2), tol: Math.max(0.01, round(Q * 0.01, 2)), unit: 'nC', Rc, E,
          sol: R`Gauss's law with a sphere just outside the conductor: $E\cdot4\pi R^2 = Q/\varepsilon_0$, so $Q = 4\pi\varepsilon_0R^2E = 4\pi(8.854\times10^{-12})(${Rc / 100})^2(${E}\times10^3) = ${round(Q, 2)}$ nC.`,
          trap: 'Forgetting to turn cm into m before squaring gives an answer 10 000 times too big.' };
      },
      verify: (p) => 4 * Math.PI * C.eps0 * (p.Rc / 100) ** 2 * p.E * 1e12 },
    { id: 'esg-r4g2', type: 'nat', level: 2, exams: A, sub: 'spherical symmetry',
      make(r) {
        const a = choose(r, [2, 3, 4, 5]), b = a + choose(r, [2, 3, 5]);
        const q1 = choose(r, [2, 3, 4, 5, 6]), q2 = choose(r, [-9, -7, -4, -2, 3, 5, 8]);
        const zone = choose(r, ['mid', 'mid', 'out', 'out', 'in']);
        const rr = zone === 'in' ? a / 2 : zone === 'mid' ? round((a + b) / 2, 1) : b + choose(r, [1, 3, 5]);
        const enc = zone === 'in' ? 0 : zone === 'mid' ? q1 : q1 + q2;
        const E = Math.abs(k * enc * 1e-9 / (rr / 100) ** 2);
        return { q: R`Two thin concentric spherical shells have radii $${a}$ cm and $${b}$ cm. The inner one carries $${q1}$ nC and the outer one $${q2}$ nC, each spread uniformly. The field magnitude $${rr}$ cm from the centre is ______ N/C (to the nearest whole number).`,
          answer: Math.round(E), tol: Math.max(1, Math.round(E * 0.01)), unit: 'N/C', enc, rr,
          sol: R`A Gaussian sphere of radius $${rr}$ cm encloses ${zone === 'in' ? 'no charge (it is inside both shells)' : zone === 'mid' ? R`only the inner shell, $${q1}$ nC` : R`both shells, $${q1} ${q2 < 0 ? '-' : '+'} ${Math.abs(q2)} = ${q1 + q2}$ nC`}. So $E = \dfrac{|q_{\rm enc}|}{4\pi\varepsilon_0r^2} = \dfrac{(8.99\times10^9)(${Math.abs(enc)}\times10^{-9})}{(${rr / 100})^2} = ${Math.round(E)}$ N/C.`,
          trap: 'Charge on a shell outside the Gaussian surface adds nothing to the field inside it.' };
      },
      verify: (p) => Math.abs(k * p.enc * 1e-9 / (p.rr / 100) ** 2) },
    { id: 'esg-r4g3', type: 'mcq', level: 3, exams: A, sub: 'non-uniform charge',
      make(r) {
        const n = choose(r, [-1, 1, 2, 3]), [p, d] = choose(r, [[1, 2], [1, 3], [2, 3], [3, 4]]);
        const fr = (m) => (m === 0 ? '1' : m > 0 ? R`\tfrac{${p ** m}}{${d ** m}}` : R`\tfrac{${d ** -m}}{${p ** -m}}`);
        const show = (m) => `$${fr(m)}$`;
        const dens = n === 1 ? R`\rho_0\,r/R` : n === -1 ? R`\rho_0R/r` : R`\rho_0(r/R)^{${n}}`;
        const o = mcqOptions(r, n + 1, [n, n + 2, -(n + 1), n + 3], show);
        return { q: R`A ball of radius $R$ has charge density $\rho = ${dens}$ inside. The field magnitude at $r = \tfrac{${p}}{${d}}R$ divided by the field at the surface is`, ...o,
          sol: R`The charge inside radius $r$ is $\displaystyle\int_0^r\rho\,4\pi r'^2dr' \propto r^{${n + 3}}$, so $E = Q_{\rm enc}/(4\pi\varepsilon_0r^2) \propto r^{${n + 1}}$. Ratio $= (${p}/${d})^{${n + 1}} = ${fr(n + 1)}$.`,
          trap: 'The field goes as $r^{n+1}$, not $r^n$: one power of $r$ from the enclosed charge ($r^{n+3}$) survives the division by $r^2$.' };
      } },
  ],
};
