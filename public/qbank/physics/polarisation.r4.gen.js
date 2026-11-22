// Round 4 extras for polarisation: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const deg = Math.PI / 180;

export default {
  items: [
    { id: 'pol-r4-01', type: 'mcq', level: 3, exams: ['jam'], sub: 'polarisers',
      q: R`A wire-grid polariser for microwaves is a frame of thin parallel metal wires, spaced much closer than the wavelength. The wave that passes through it has its electric field`,
      options: [R`parallel to the wires`, R`at $45^\circ$ to the wires`, R`perpendicular to the wires`, R`rotating, because the grid makes circular light`], answer: 2,
      sol: R`The component of $\vec E$ along the wires drives currents in them; the wires absorb and re-radiate that component backwards, so it is reflected. Electrons cannot move far across a thin wire, so the component perpendicular to the wires passes almost untouched. The transmission axis is therefore perpendicular to the wires.`,
      trap: R`Picturing the wires as slots that let the field "slide through" along them; it is the other way round.` },
    { id: 'pol-r4-02', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'jones calculus',
      q: R`In Jones calculus (basis $\hat x$, $\hat y$), an ideal linear polariser with its transmission axis at $45^\circ$ to $\hat x$ is represented by`,
      options: [R`$\frac12\begin{pmatrix}1 & -1\\ -1 & 1\end{pmatrix}$`, R`$\begin{pmatrix}1 & 0\\ 0 & 0\end{pmatrix}$`, R`$\frac{1}{\sqrt2}\begin{pmatrix}1 & 1\\ 1 & 1\end{pmatrix}$`, R`$\frac12\begin{pmatrix}1 & 1\\ 1 & 1\end{pmatrix}$`], answer: 3,
      sol: R`A polariser along the unit vector $\hat u = (\cos\theta, \sin\theta)$ keeps only the component along $\hat u$: $P = \hat u\hat u^{T} = \begin{pmatrix}\cos^2\theta & \sin\theta\cos\theta\\ \sin\theta\cos\theta & \sin^2\theta\end{pmatrix}$. At $45^\circ$ every entry is $\frac12$. Check: $P^2 = P$ (a second identical polariser changes nothing). The $\frac1{\sqrt2}$ version fails that test, the minus-sign matrix is the polariser at $-45^\circ$, and the diagonal one is the horizontal polariser.`,
      trap: R`Normalising the matrix like a Jones vector; a projector must satisfy $P^2 = P$.` },
    { id: 'pol-r4-03', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'wave plates',
      q: R`A crystal plate has $n_e - n_o = 0.009$ and thickness $0.50$ mm, cut with the optic axis in its face. For light of wavelength $600$ nm at normal incidence it behaves as`,
      options: [R`a quarter-wave plate`, R`a half-wave plate`, R`a full-wave plate: it leaves every polarisation unchanged`, R`a polariser`], answer: 1,
      sol: R`The path difference is $\Delta n\,d = 0.009\times0.50\text{ mm} = 4.5\ \mu\text{m} = 4500$ nm $= 7.5\lambda$. The phase difference is $2\pi\times7.5 = 15\pi$, which is the same as $\pi$ (whole waves do not matter). So it is a (multi-order) half-wave plate at this wavelength.`,
      trap: R`Thinking only a plate with exactly $\lambda/2$ path difference is a half-wave plate; any odd number of half-waves works.` },
    { id: 'pol-r4-04', type: 'mcq', level: 2, exams: ['jam'], sub: 'brewster',
      q: R`Glass shows normal dispersion (its index is larger for blue light than for red). The Brewster angle for light in air reflecting from this glass is`,
      options: [R`slightly larger for blue light than for red light`, R`slightly larger for red light than for blue light`, R`the same for all colours`, R`not defined, because a dispersive medium has no Brewster angle`], answer: 0,
      sol: R`$\tan\theta_B = n$, and $\tan$ grows with its angle. Blue light sees the larger $n$, so its Brewster angle is a little larger. For crown glass ($n\approx1.51$ red, $1.53$ blue) the two angles differ by only about $0.3^\circ$.`,
      trap: R`Assuming the Brewster angle is a property of the surface alone; it depends on $n$, which depends on wavelength.` },
    { id: 'pol-r4-05', type: 'mcq', level: 2, exams: ['jam'], sub: 'malus law',
      q: R`Linearly polarised light falls on an analyser that is slowly turned through a full circle. The transmitted intensity, plotted against the analyser angle, is`,
      options: [R`a curve of period $360^\circ$ with one zero per turn`, R`constant`, R`a curve of period $180^\circ$ with two zeros per turn`, R`a curve of period $90^\circ$ with four zeros per turn`], answer: 2,
      sol: R`Malus's law: $I = I_0\cos^2\theta = \frac{I_0}{2}(1 + \cos2\theta)$. This repeats every $180^\circ$ and is zero at $\theta = 90^\circ$ and $270^\circ$: two dark positions and two bright ones in one turn.`,
      trap: R`Treating $\cos^2\theta$ like $\cos\theta$, which has period $360^\circ$.` },
    { id: 'pol-r4-06', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'faraday effect',
      q: R`A glass rod $5.0$ cm long, with Verdet constant $40$ rad T⁻¹ m⁻¹, sits in a uniform magnetic field of $0.25$ T along its length. Linearly polarised light travelling along the rod has its plane of polarisation turned by ______ degrees (one decimal place).`,
      answer: 28.6, tol: 0.2, unit: 'degrees', calc: () => 40 * 0.25 * 0.05 / deg,
      sol: R`Faraday rotation: $\beta = VBL = 40\times0.25\times0.050 = 0.50$ rad. In degrees, $0.50\times\frac{180}{\pi} = 28.6^\circ$.`,
      trap: R`Leaving the answer in radians, or using the length in centimetres.` },
    { id: 'pol-r4-07', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'faraday effect', format: 'statements',
      q: R`Compare Faraday rotation (in a magnetised glass rod) with natural optical activity (in a sugar solution). Which statements are true?`,
      options: [R`If light passes through the Faraday rod, reflects from a mirror and passes back, the two rotations add`, R`If light passes through the sugar solution, reflects and passes back, the two rotations cancel`, R`The Faraday rotation is proportional to the component of $\vec B$ along the light's path`, R`Optical activity needs a magnetic field to appear`],
      answer: [0, 1, 2],
      sol: R`Optical activity comes from the handed (chiral) molecules themselves: the sense of rotation is fixed relative to the direction of travel, so on the way back it undoes the first rotation. Faraday rotation has its sense fixed by $\vec B$, not by the direction of travel, so on the return pass it adds: this non-reciprocal behaviour is what makes optical isolators. $\beta = VBL$ uses the component of $\vec B$ along the beam. No field is needed for optical activity.`,
      trap: R`Assuming every rotation "unwinds" on the return trip; only reciprocal (natural) rotation does.` },
    { id: 'pol-r4-08', type: 'nat', level: 4, exams: ['jam'], sub: 'wave plates',
      q: R`Horizontally polarised light of intensity $I_0$ passes through an ideal half-wave plate whose fast axis is at $20^\circ$ to the horizontal, and then through a vertical analyser. The transmitted intensity is ______ $I_0$ (three decimal places).`,
      answer: 0.413, tol: 0.003, calc: () => Math.cos(50 * deg) ** 2,
      sol: R`A half-wave plate reflects the polarisation direction in its fast axis: light at $0^\circ$, which is $20^\circ$ below the axis, comes out $20^\circ$ above it, at $40^\circ$. The analyser is at $90^\circ$, so the angle between them is $50^\circ$ and Malus's law gives $\cos^250^\circ = 0.413$.`,
      trap: R`Rotating by the plate angle ($20^\circ$) instead of twice it.` },
    { id: 'pol-r4-09', type: 'msq', level: 3, exams: ['jam'], sub: 'scattering', format: 'statements',
      q: R`A beam of unpolarised light passes through a gas of small molecules. Which statements about the scattered light are true?`,
      options: [R`Light scattered straight forward is strongly polarised`, R`Light scattered at $90^\circ$ to the beam is (ideally) fully linearly polarised`, R`At $90^\circ$ its electric field is perpendicular to the plane containing the beam and the line of sight`, R`Its intensity varies roughly as $\lambda^{-4}$`],
      answer: [1, 2, 3],
      sol: R`Each molecule's electrons oscillate along the incoming field, which lies in the plane perpendicular to the beam. A dipole does not radiate along its own axis, so seen at $90^\circ$ only the oscillation perpendicular to the scattering plane is visible: full linear polarisation. Straight ahead both transverse components are seen equally, so that light is unpolarised. Dipole radiation power goes as $\omega^4$, i.e. $\lambda^{-4}$ (Rayleigh scattering).`,
      trap: R`Expecting the forward light to be polarised too; polarisation is strongest at right angles.` },
    { id: 'pol-r4-10', type: 'nat', level: 2, exams: ['jam'], sub: 'malus law',
      q: R`Unpolarised light passes through two ideal polarisers. If $\tfrac38$ of the incident intensity gets through, the angle between their transmission axes is ______ degrees.`,
      answer: 30, tol: 0.5, unit: 'degrees', calc: () => Math.acos(Math.sqrt(0.75)) / deg,
      sol: R`The first polariser passes half: $I_0/2$. The second passes $\cos^2\theta$ of that, so $\frac12\cos^2\theta = \frac38$, $\cos^2\theta = \frac34$, $\cos\theta = \frac{\sqrt3}{2}$ and $\theta = 30^\circ$.`,
      trap: R`Forgetting the first factor $\tfrac12$ gives $\cos^2\theta = \tfrac38$ and about $52^\circ$.` },
    { id: 'pol-r4-11', type: 'nat', level: 5, exams: ['gate'], sub: 'wave plates',
      q: R`An ideal quarter-wave plate sits between two crossed linear polarisers, with its fast axis at $22.5^\circ$ to the first polariser's axis. Of the light leaving the first polariser, the fraction that passes the second is ______ (two decimal places).`,
      answer: 0.25, tol: 0.005, calc: () => Math.sin(45 * deg) ** 2 * Math.sin(Math.PI / 4) ** 2,
      sol: R`Take the first polariser along $x$ and the plate's axes at angle $\theta$. Split the field: $\cos\theta$ along the fast axis, $-\sin\theta$ along the slow axis, which is delayed by phase $\Gamma$. The $y$ component after the plate is $\sin\theta\cos\theta\,(1 - e^{i\Gamma})$, with $|1 - e^{i\Gamma}|^2 = 4\sin^2\frac\Gamma2$. So the crossed analyser passes $T = \sin^22\theta\,\sin^2\frac\Gamma2$. Here $\sin^245^\circ\times\sin^245^\circ = \frac12\times\frac12 = 0.25$.`,
      trap: R`Assuming the plate makes circular light here (that needs $45^\circ$, which would give $0.5$).` },
    { id: 'pol-r4-12', type: 'msq', level: 2, exams: ['jam'], sub: 'polarisers', format: 'statements',
      q: R`Which statements about an ideal linear polariser are true?`,
      options: [R`It passes exactly half the intensity of unpolarised light`, R`Whatever light goes in, any light that comes out is linearly polarised along its axis`, R`It passes all the intensity of circularly polarised light`, R`Placed at $45^\circ$ between two crossed polarisers, it lets light through where none passed before`],
      answer: [0, 1, 3],
      sol: R`A polariser projects the field onto its axis, so the output is always linear along that axis. Unpolarised and circular light both give half (circular light has equal mean square components on every axis). Between crossed polarisers, a $45^\circ$ polariser passes $\frac12\times\frac12 = \frac14$ of the light leaving the first polariser instead of none.`,
      trap: R`Thinking an extra polariser can only remove light; it changes the direction the next one sees.` },
  ],
  gens: [
    { id: 'pol-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'faraday effect',
      make(r) {
        const V = choose(r, [20, 40, 60, 100, 130]), B = choose(r, [0.1, 0.2, 0.25, 0.4, 0.5]), Lcm = int(r, 2, 10), back = r() < 0.5;
        const beta = V * B * Lcm / 100 * (back ? 2 : 1) / deg;
        return { q: `A rod of length $${Lcm}$ cm with Verdet constant $${V}$ rad T⁻¹ m⁻¹ lies along a field of $${B}$ T. Linearly polarised light ${back ? 'passes along the rod, reflects from a mirror at its end and passes back' : 'passes once along the rod'}. The total turn of its plane of polarisation is ______ degrees (one decimal place).`,
          answer: round(beta, 1), tol: Math.max(0.1, round(beta * 0.005, 1)), unit: 'degrees', V, B, Lcm, back,
          sol: `One pass turns the plane by $\\beta = VBL = ${V}\\times${B}\\times${Lcm / 100} = ${round(V * B * Lcm / 100, 4)}$ rad$ = ${round(V * B * Lcm / 100 / deg, 2)}^\\circ$.${back ? ' Faraday rotation is non-reciprocal (its sense is set by $\\vec B$), so the return pass adds the same amount again.' : ''} Total: $${round(beta, 1)}^\\circ$.`,
          trap: back ? 'The return pass adds; it does not cancel as optical activity would.' : 'Convert the length to metres and the answer to degrees.' };
      },
      verify: (p) => p.V * p.B * p.Lcm / 100 * (p.back ? 2 : 1) / deg },
    { id: 'pol-r4g2', type: 'nat', level: 5, exams: ['gate'], sub: 'wave plates',
      make(r) {
        const th = choose(r, [10, 15, 20, 30, 35, 40, 45, 60]), [G, gname] = choose(r, [[Math.PI / 2, 'quarter-wave'], [Math.PI, 'half-wave'], [Math.PI / 3, 'sixth-wave ($\\Gamma = \\pi/3$)']]);
        const T = Math.sin(2 * th * deg) ** 2 * Math.sin(G / 2) ** 2;
        return { q: `An ideal ${gname} plate sits between two crossed linear polarisers with its fast axis at $${th}^\\circ$ to the first polariser. The fraction of the light leaving the first polariser that gets through the second is ______ (three decimal places).`,
          answer: round(T, 3), tol: 0.002, th, G,
          sol: `Between crossed polarisers a retarder of phase $\\Gamma$ at angle $\\theta$ passes $T = \\sin^2 2\\theta\\,\\sin^2\\frac{\\Gamma}{2}$ (the $y$ component after the plate is $\\sin\\theta\\cos\\theta(1 - e^{i\\Gamma})$). Here $\\sin^2${2 * th}^\\circ = ${round(Math.sin(2 * th * deg) ** 2, 4)}$ and $\\sin^2\\frac{\\Gamma}{2} = ${round(Math.sin(G / 2) ** 2, 4)}$, so $T = ${round(T, 3)}$.`,
          trap: 'The angle enters as $2\\theta$ and the retardance as $\\Gamma/2$.' };
      },
      verify: (p) => Math.sin(2 * p.th * deg) ** 2 * Math.sin(p.G / 2) ** 2 },
    { id: 'pol-r4g3', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'wave plates',
      make(r) {
        const dn = choose(r, [0.005, 0.01, 0.02]), lam = choose(r, [400, 500, 600, 800]), N = int(r, 3, 20), f = choose(r, [0, 0.25, 0.5, 0.75]);
        const d = round((N + f) * lam / dn / 1000, 2);
        const kinds = ['a full-wave plate: it leaves every polarisation unchanged', 'a quarter-wave plate', 'a half-wave plate', 'a quarter-wave plate'];
        const right = kinds[f * 4];
        const all = ['a quarter-wave plate', 'a half-wave plate', 'a full-wave plate: it leaves every polarisation unchanged', 'a linear polariser'];
        const o = mcqOptions(r, right, all.filter((s) => s !== right), (s) => s);
        return { q: `A crystal plate with birefringence $|n_e - n_o| = ${dn}$ is $${d}\\ \\mu$m thick, with its optic axis in its face. For light of wavelength $${lam}$ nm at normal incidence it behaves as`, ...o,
          sol: `Path difference $= ${dn}\\times${d}\\ \\mu\\text{m} = ${round(dn * d * 1000, 1)}$ nm $= ${N + f}\\lambda$. Whole waves do not matter, so only the extra $${f}\\lambda$ counts: ${f === 0 ? 'none, so it is a full-wave plate' : f === 0.5 ? 'half a wave, so it is a half-wave plate' : `${f === 0.25 ? 'a quarter' : 'three quarters'} of a wave, which acts as a quarter-wave plate${f === 0.75 ? ' (with fast and slow axes swapped)' : ''}`}.`,
          trap: 'Count only the fraction of a wavelength left after removing whole waves.' };
      } },
  ],
};
