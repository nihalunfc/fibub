// Round 4 extras for method-of-images: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'gim-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'grounded plane',
      q: R`For a point charge $q$ above a large grounded metal plane, the image charge $-q$ placed at the mirror point is chosen so that`,
      options: [R`the electric field is zero on the plane`, R`the potential is zero everywhere on the plane`, R`the surface charge on the plane is zero`, R`the potential is zero at the position of $q$`], answer: 1,
      sol: R`Every point of the plane is equally far from $q$ and from its mirror image, so $\frac{kq}{r} - \frac{kq}{r} = 0$ there: the pair reproduces the boundary condition $V = 0$ of the grounded plane. The field on the plane is not zero (it is normal to it), which is what produces the induced surface charge.`,
      trap: R`Confusing "zero potential" with "zero field" on the conductor's surface.` },
    { id: 'gim-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'grounded plane',
      q: R`A charge of $1.0$ nC sits $3.0$ cm above a large grounded plane. With $1/(4\pi\varepsilon_0) = 9\times10^9$ SI units, the potential at a point $3.0$ cm above the plane and $4.0$ cm sideways from the charge is ______ V (one decimal place).`,
      answer: 100.2, tol: 0.3, unit: 'V', calc: () => 9 * (1 / 0.04 - 1 / Math.hypot(0.04, 0.06)),
      sol: R`The point is $4.0$ cm from the charge and $\sqrt{4^2 + 6^2} = 7.21$ cm from the image $-1.0$ nC (which sits $3.0$ cm below the plane). $V = 9\times10^9\times10^{-9}\left(\frac1{0.040} - \frac1{0.0721}\right) = 9\times(25 - 13.87) = 100.2$ V.`,
      trap: R`Measuring the image distance as $4$ cm too; the image is $6$ cm lower than the point.` },
    { id: 'gim-r4-03', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'grounded plane',
      q: R`Two equal charges $+q$ sit on the same normal to a large grounded plane, at heights $d$ and $2d$. The net force on the upper charge is ______ $\times\dfrac{q^2}{4\pi\varepsilon_0d^2}$, upward taken as positive (three decimal places).`,
      answer: 0.826, tol: 0.002, calc: () => 1 - 1 / 9 - 1 / 16,
      sol: R`Images: $-q$ at $-d$ and $-q$ at $-2d$. On the upper charge (at $2d$): the real charge at $d$ repels it, $+\frac{1}{d^2}$; the image at $-d$ (distance $3d$) attracts it, $-\frac1{9d^2}$; its own image at $-2d$ (distance $4d$) attracts it, $-\frac1{16d^2}$. Total: $1 - \frac19 - \frac1{16} = \frac{119}{144} = 0.826$ (in units of $\frac{q^2}{4\pi\varepsilon_0d^2}$).`,
      trap: R`Forgetting the image of the other charge; every real charge has its own image, and all act on each charge.` },
    { id: 'gim-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'magnetic images',
      q: R`A long straight wire carrying current $I$ runs parallel to the flat surface of a superconductor, at height $h$. The superconductor keeps $\vec B$ out, so the normal component of $\vec B$ is zero at its surface. The wire is`,
      options: [R`repelled, with force per unit length $\dfrac{\mu_0I^2}{4\pi h}$`, R`attracted, with force per unit length $\dfrac{\mu_0I^2}{4\pi h}$`, R`repelled, with force per unit length $\dfrac{\mu_0I^2}{2\pi h}$`, R`not pushed either way`], answer: 0,
      sol: R`An image current at depth $h$ below the surface, flowing the opposite way ($-I$), makes the two wires' fields cancel in the normal direction on the surface (their tangential components add). Opposite currents repel, and the separation is $2h$: $\frac FL = \frac{\mu_0I\cdot I}{2\pi(2h)} = \frac{\mu_0I^2}{4\pi h}$. This is the principle of superconducting levitation.`,
      trap: R`Using the separation $h$ instead of $2h$, or giving the image the same direction (which would attract).` },
    { id: 'gim-r4-05', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'magnetic images',
      q: R`A wire carrying $100$ A runs $1.0$ cm above a flat superconducting surface (no normal $\vec B$ at the surface). The force per metre on the wire is ______ N.`,
      answer: 0.1, tol: 0.002, unit: 'N', calc: () => C.mu0 * 100 ** 2 / (4 * Math.PI * 0.01),
      sol: R`The image current $-100$ A lies $1.0$ cm below the surface, $2.0$ cm from the wire. $\frac FL = \frac{\mu_0I^2}{2\pi(2h)} = \frac{2\times10^{-7}\times10^4}{0.020} = 0.10$ N/m, pushing the wire away from the surface.`,
      trap: R`Using $h = 1$ cm as the separation, which doubles the force.` },
    { id: 'gim-r4-06', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'magnetic images',
      q: R`A thin wire of mass $5.0$ g per metre carries $40$ A parallel to a horizontal superconducting floor and floats above it. It floats at a height of ______ mm (two decimal places; $g = 9.8$ m/s²).`,
      answer: 3.27, tol: 0.03, unit: 'mm', calc: () => C.mu0 * 40 ** 2 / (4 * Math.PI * 0.005 * 9.8) * 1e3,
      sol: R`The image current (opposite direction, at depth $h$) repels the wire with force per length $\frac{\mu_0I^2}{4\pi h}$. Balance with the weight per length $\lambda g$: $h = \frac{\mu_0I^2}{4\pi\lambda g} = \frac{10^{-7}\times1600}{0.0050\times9.8} = 3.27\times10^{-3}$ m. The balance is stable vertically: higher up the push weakens, lower down it grows.`,
      trap: R`Using $\frac{\mu_0I^2}{2\pi h}$ (separation $h$); the image is a distance $2h$ away.` },
    { id: 'gim-r4-07', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'magnetic images', format: 'statements',
      q: R`A long wire carrying current $I$ runs parallel to a flat magnetic surface at height $h$. Which statements are true?`,
      options: [R`Above a superconductor (normal $\vec B$ = 0 at the surface) the wire is repelled`, R`Above iron with $\mu_r\to\infty$ (tangential $\vec H$ = 0 at the surface) the wire is attracted`, R`Above a superconductor the image current flows in the same direction as $I$`, R`Above a linear material of finite $\mu_r$, the image current (seen from the air side) is $\dfrac{\mu_r - 1}{\mu_r + 1}I$`],
      answer: [0, 1, 3],
      sol: R`For the superconductor the image is $-I$ (opposite currents repel). For high-permeability iron the condition is no tangential $\vec H$, met by an image $+I$ (parallel currents attract): this is why a current-carrying wire clings to iron. For finite $\mu_r$ the image strength is $\frac{\mu_r - 1}{\mu_r + 1}I$, which tends to $+I$ as $\mu_r\to\infty$ and to 0 for $\mu_r = 1$; formally $\mu_r\to0$ gives $-I$, the superconductor.`,
      trap: R`Giving both surfaces the same image; superconductors expel flux, iron draws it in.` },
    { id: 'gim-r4-08', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'grounded plane',
      q: R`A small charged bead (mass $m$, charge $q$) is released from rest at height $d$ above a large grounded metal plane in space (no gravity). The time it takes to reach the plane scales with $d$ as`,
      options: [R`$d$`, R`$d^{1/2}$`, R`$d^{3/2}$`, R`$d^2$`], answer: 2,
      sol: R`The only force is the image attraction $\frac{kq^2}{4z^2}$, an inverse-square law like gravity. Dimensional analysis: the only time that can be built from $m$, $d$ and $kq^2$ is $\sqrt{md^3/(kq^2)}$, so $t\propto d^{3/2}$ (Kepler's third law for a straight-line orbit). Energy conservation gives exactly $t = \frac\pi2\sqrt{\frac{2md^3}{kq^2}}$.`,
      trap: R`Treating the force as constant (giving $d^{1/2}$); it grows rapidly as the bead approaches the plane.` },
    { id: 'gim-r4-09', type: 'mcq', level: 2, exams: ['jam'], sub: 'grounded plane',
      q: R`A charge $q$ is held at height $d$ above a large grounded plane. The work needed to move it slowly a distance $L$ parallel to the plane, keeping the height $d$, is`,
      options: [R`$\dfrac{kq^2L}{4d^2}$`, R`$\dfrac{kq^2}{4d}$`, R`$\dfrac{kq^2L}{2d^2}$`, R`zero`], answer: 3,
      sol: R`The image moves along with the charge, always straight below it, so the force on the charge is always perpendicular to the plane. Moving parallel to the plane, the displacement is perpendicular to the force: no work. (Equivalently, the energy $-\frac{kq^2}{4d}$ depends only on the height.)`,
      trap: R`Multiplying the attraction by the distance moved; the force and the motion are at right angles.` },
    { id: 'gim-r4-10', type: 'mcq', level: 3, exams: ['jam'], sub: 'grounded plane',
      q: R`A positive point charge sits above an infinite grounded metal plane. Of the electric field lines that leave the charge,`,
      options: [R`half end on the plane and half go to infinity`, R`all end on the plane`, R`none end on the plane, because it is grounded`, R`the fraction ending on the plane depends on the height of the charge`], answer: 1,
      sol: R`The total charge induced on the infinite plane is exactly $-q$, whatever the height (integrate $\sigma = -\frac{qd}{2\pi(x^2 + y^2 + d^2)^{3/2}}$ over the plane). Every field line ending on the plane ends on induced charge, and the flux of all the lines from $q$ is $q/\varepsilon_0$, so they all end there; above the plane the field falls off like a dipole's, and no net flux escapes to infinity.`,
      trap: R`Thinking lines going upward escape; they curve round and land on the plane far away.` },
    { id: 'gim-r4-11', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'spheres',
      q: R`A point charge $q$ is at distance $d$ from the centre of a metal sphere of radius $R$. For $d\gg R$, the force on the charge falls off with distance as ______ when the sphere is earthed, and as ______ when it is isolated and neutral.`,
      options: [R`$d^{-2}$; $d^{-3}$`, R`$d^{-3}$; $d^{-3}$`, R`$d^{-3}$; $d^{-5}$`, R`$d^{-5}$; $d^{-3}$`], answer: 2,
      sol: R`Earthed: the image $-qR/d$ sits near the centre, about $d$ away, so $F\approx\frac{kq^2R}{d^3}$. Isolated and neutral: a second image $+qR/d$ at the centre is added to keep the net charge zero, leaving an image dipole of moment $\frac{qR}{d}\cdot\frac{R^2}{d} = \frac{qR^3}{d^2}$; a dipole pulls a charge with force $\propto\frac{p}{d^3}$, so $F\approx\frac{2kq^2R^3}{d^5}$.`,
      trap: R`Treating the earthed sphere's image as a fixed charge ($d^{-2}$); its size shrinks as $1/d$.` },
    { id: 'gim-r4-12', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'principles', format: 'statements',
      q: R`Which statements about the method of images are true?`,
      options: [R`Image charges must lie outside the region where the solution is wanted`, R`The image solution is correct because it satisfies Poisson's equation in the region and the boundary conditions, and that solution is unique`, R`The energy of the real system equals the electrostatic energy of the real charges together with their images`, R`The force on a real charge equals the force that the image charges (and other real charges) would exert on it`],
      answer: [0, 1, 3],
      sol: R`Images are placed in the "forbidden" region (inside the conductor) so that Poisson's equation with the real charges is unchanged where we want the field; uniqueness then makes the solution right there. Forces follow from the field, so they are as if the images were real. Energy is different: the field exists only in the physical region, so for a charge and a grounded plane the energy is half that of the charge-image pair.`,
      trap: R`Computing energy from the full image picture; only the real half-space holds field.` },
  ],
  gens: [
    { id: 'gim-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'magnetic images',
      make(r) {
        const lam = choose(r, [1, 2, 5, 10, 20]), I = int(r, 2, 20) * 5;
        const h = C.mu0 * I * I / (4 * Math.PI * lam * 1e-3 * 9.8) * 1e3;
        return { q: `A wire of mass $${lam}$ g per metre carrying $${I}$ A floats parallel to, and above, a horizontal superconducting floor (no normal $\\vec B$ at the floor). Its height is ______ mm (three significant figures; $g = 9.8$ m/s²).`,
          answer: +h.toPrecision(3), tol: +(h * 0.006).toPrecision(2), unit: 'mm', lam, I,
          sol: `The image current $-${I}$ A lies at depth $h$, a distance $2h$ from the wire, so $\\frac FL = \\frac{\\mu_0I^2}{4\\pi h}$ (repulsive). Setting this equal to $\\lambda g$: $h = \\frac{\\mu_0I^2}{4\\pi\\lambda g} = \\frac{10^{-7}\\times${I * I}}{${lam / 1000}\\times9.8} = ${+h.toPrecision(3)}$ mm.`,
          trap: 'The wire-image separation is $2h$.' };
      },
      verify: (p) => C.mu0 * p.I * p.I / (4 * Math.PI * p.lam * 1e-3 * 9.8) * 1e3 },
    { id: 'gim-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'grounded plane',
      make(r) {
        const a = int(r, 1, 3), b = a + int(r, 1, 3);
        const F = 1 / (b - a) ** 2 - 1 / (a + b) ** 2 - 1 / (2 * b) ** 2;
        return { q: `Two charges $+q$ sit on one normal to a large grounded plane, at heights $${a}d$ and $${b}d$. The net force on the upper charge, in units of $\\dfrac{q^2}{4\\pi\\varepsilon_0d^2}$ and counted positive upward, is ______ (four decimal places).`,
          answer: round(F, 4), tol: 0.0005, a, b,
          sol: `Images $-q$ at $-${a}d$ and $-${b}d$. On the charge at $${b}d$: repulsion from the real charge, $+\\frac{1}{${(b - a) ** 2}}$; attraction to the image at $-${a}d$, $-\\frac1{${(a + b) ** 2}}$; attraction to its own image, $-\\frac1{${(2 * b) ** 2}}$. Total: $${round(F, 4)}$.`,
          trap: 'Include the images of both charges.' };
      },
      verify: (p) => 1 / (p.b - p.a) ** 2 - 1 / (p.a + p.b) ** 2 - 1 / (2 * p.b) ** 2 },
    { id: 'gim-r4g3', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'magnetic images',
      make(r) {
        const kind = choose(r, ['sc', 'iron', 'mu']), mu = choose(r, [3, 4, 9, 19]);
        const f = kind === 'mu' ? (mu - 1) / (mu + 1) : 1;
        const s = (x) => String(round(x, 3));
        const right = `${kind === 'sc' ? 'repelled' : 'attracted'}, with force per length $${s(f)}\\times\\dfrac{\\mu_0I^2}{4\\pi h}$`;
        const wrongs = [`${kind === 'sc' ? 'attracted' : 'repelled'}, with force per length $${s(f)}\\times\\dfrac{\\mu_0I^2}{4\\pi h}$`, `${kind === 'sc' ? 'repelled' : 'attracted'}, with force per length $${s(2 * f)}\\times\\dfrac{\\mu_0I^2}{4\\pi h}$`, 'not pushed either way', `${kind === 'sc' ? 'repelled' : 'attracted'}, with force per length $${s(kind === 'mu' ? 1 : 0.5)}\\times\\dfrac{\\mu_0I^2}{4\\pi h}$`];
        const o = mcqOptions(r, right, wrongs, (x) => x);
        const surf = { sc: 'a superconductor (no normal $\\vec B$ at its surface)', iron: 'soft iron with $\\mu_r\\to\\infty$ (no tangential $\\vec H$ at its surface)', mu: `a thick block of linear magnetic material with $\\mu_r = ${mu}$` }[kind];
        return { q: `A long wire carrying current $I$ runs parallel to the flat surface of ${surf}, at height $h$ above it. The wire is`, ...o,
          sol: `The surface is replaced by an image current at depth $h$ (distance $2h$ from the wire) of strength ${kind === 'sc' ? '$-I$' : kind === 'iron' ? '$+I$' : `$\\frac{\\mu_r - 1}{\\mu_r + 1}I = ${s(f)}I$`}. Two parallel currents $I$ and $I'$ a distance $2h$ apart exert $\\frac{\\mu_0II'}{2\\pi(2h)}$ per length, attracting if they flow the same way. So the wire is ${right.replace(/\$.*\$/, `$${s(f)}\\times\\frac{\\mu_0I^2}{4\\pi h}$`)}.`,
          trap: 'A superconductor pushes the wire away; magnetisable material pulls it in.' };
      } },
  ],
};
