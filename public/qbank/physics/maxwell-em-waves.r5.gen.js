// Round 5 extras for maxwell-em-waves: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'mxw-r5-01', type: 'nat', level: 3, exams: ['jam'], sub: 'intensity',
      q: R`A $5.0$ mW laser beam has a uniform cross-section of $1.0$ mm². The amplitude of its electric field is ______ kV/m (two decimal places; $c = 3.0\times10^8$ m/s, $\varepsilon_0 = 8.85\times10^{-12}$ F/m).`,
      answer: 1.94, tol: 0.02, unit: 'kV/m', calc: () => Math.sqrt(2 * (5e-3 / 1e-6) / (3e8 * 8.85e-12)) / 1e3,
      sol: R`Intensity $I = P/A = \frac{5.0\times10^{-3}}{1.0\times10^{-6}} = 5000$ W/m². For a plane wave $I = \frac12c\varepsilon_0E_0^2$, so $E_0 = \sqrt{\frac{2I}{c\varepsilon_0}} = \sqrt{\frac{10^4}{2.655\times10^{-3}}} = 1.94\times10^3$ V/m.`,
      trap: R`Dropping the $\frac12$ from the time average, which gives the rms field ($1.37$ kV/m) instead of the amplitude.` },
    { id: 'mxw-r5-02', type: 'mcq', level: 1, exams: ['jam'], sub: 'plane waves',
      q: R`A radio wave in vacuum has an electric field amplitude of $300$ V/m. Its magnetic field amplitude is`,
      options: [R`$1.0\ \mu$T`, R`$1.0$ mT`, R`$9.0\times10^{10}$ T`, R`$0.80$ T`], answer: 0,
      sol: R`In a vacuum plane wave $B_0 = E_0/c = \frac{300}{3.0\times10^8} = 1.0\times10^{-6}$ T.`,
      trap: R`Multiplying by $c$, or using $B = \mu_0E$ (not a valid relation).` },
    { id: 'mxw-r5-03', type: 'msq', level: 3, exams: ['jam'], sub: 'displacement current', format: 'statements',
      q: R`A parallel-plate capacitor is being charged by a current $I$ in the wires. Which statements about the displacement current are true?`,
      options: [R`It exists only when a dielectric fills the gap`, R`In the gap it equals $I$ in total`, R`It is $\varepsilon_0\,d\Phi_E/dt$, with $\Phi_E$ the electric flux through the gap`, R`It produces a magnetic field around the gap just as a real current would`],
      answer: [1, 2, 3],
      sol: R`Between the plates $\Phi_E = Q/\varepsilon_0$, so $\varepsilon_0\,d\Phi_E/dt = dQ/dt = I$: the displacement current carries on where the conduction current stops, and Ampère-Maxwell treats it as a source of $\vec B$. It needs only a changing field, so it is present in vacuum too.`,
      trap: R`Picturing the displacement current as moving charge in a dielectric; in vacuum it is purely a changing field.` },
    { id: 'mxw-r5-04', type: 'nat', level: 4, exams: ['jam'], sub: 'displacement current',
      q: R`Circular capacitor plates of radius $5.0$ cm are charged by a steady $2.0$ A current. Between the plates, $3.0$ cm from the axis, the magnetic field is ______ $\mu$T (one decimal place; ignore edge effects).`,
      answer: 4.8, tol: 0.05, unit: 'μT', calc: () => 2e-7 * 2 * 0.03 / 0.05 ** 2 * 1e6,
      sol: R`Take a circle of radius $r$ between the plates. It encloses a fraction $r^2/R^2$ of the displacement current: $I_d = I\frac{r^2}{R^2}$. Ampère-Maxwell: $B(2\pi r) = \mu_0I\frac{r^2}{R^2}$, so $B = \frac{\mu_0Ir}{2\pi R^2} = \frac{2\times10^{-7}\times2.0\times0.03}{0.0025} = 4.8\times10^{-6}$ T.`,
      trap: R`Using the full current $I$ inside the circle, as for a wire ($13.3\ \mu$T).` },
    { id: 'mxw-r5-05', type: 'mcq', level: 2, exams: ['jam'], sub: 'plane waves',
      q: R`At one instant, at one point, a plane wave in vacuum has $\vec E$ along $+\hat y$ and $\vec B$ along $-\hat x$. The wave travels along`,
      options: [R`$+\hat x$`, R`$-\hat z$`, R`$+\hat z$`, R`$+\hat y$`], answer: 2,
      sol: R`Energy flows along $\vec S = \frac1{\mu_0}\vec E\times\vec B$. $\hat y\times(-\hat x) = -(\hat y\times\hat x) = -(-\hat z) = +\hat z$.`,
      trap: R`Taking $\vec B\times\vec E$ and getting the reverse direction.` },
    { id: 'mxw-r5-06', type: 'nat', level: 2, exams: ['jam'], sub: 'waves in media',
      q: R`A $100$ MHz wave travels through a non-magnetic insulator with relative permittivity $2.25$. Its wavelength inside is ______ m (two decimal places; $c = 3.0\times10^8$ m/s).`,
      answer: 2, tol: 0.01, unit: 'm', calc: () => 3e8 / Math.sqrt(2.25) / 1e8,
      sol: R`$v = \frac{c}{\sqrt{\varepsilon_r\mu_r}} = \frac{3.0\times10^8}{1.5} = 2.0\times10^8$ m/s. The frequency is set by the source, so $\lambda = v/f = \frac{2.0\times10^8}{10^8} = 2.0$ m (compared with $3.0$ m in vacuum).`,
      trap: R`Dividing by $\varepsilon_r$ instead of $\sqrt{\varepsilon_r}$.` },
    { id: 'mxw-r5-07', type: 'mcq', level: 3, exams: ['jam'], sub: 'energy and momentum', format: 'which is NOT',
      q: R`For a plane electromagnetic wave in vacuum, which statement is NOT true?`,
      options: [R`The electric and magnetic energy densities are equal at every point`, R`$\vec E$ and $\vec B$ are a quarter cycle out of phase`, R`The intensity equals the average energy density times $c$`, R`On a perfect absorber at normal incidence the radiation pressure is $I/c$`], answer: 1,
      sol: R`In a vacuum plane wave $B = E/c$ at every point and time, so $\vec E$ and $\vec B$ rise and fall together (in phase), and $\frac{B^2}{2\mu_0} = \frac{\varepsilon_0E^2}{2}$. Energy moves at $c$, so $I = \langle u\rangle c$. An absorber takes momentum flux $I/c$.`,
      trap: R`Borrowing the $90^\circ$ phase difference from a standing wave or an LC circuit.` },
    { id: 'mxw-r5-08', type: 'nat', level: 4, exams: ['jam'], sub: 'radiation pressure',
      q: R`Light of intensity $1.2$ kW/m² falls on a flat perfect mirror at $60^\circ$ to the normal. The radiation pressure on the mirror is ______ $\mu$Pa (two decimal places; $c = 3.0\times10^8$ m/s).`,
      answer: 2, tol: 0.01, unit: 'μPa', calc: () => 2 * 1200 * Math.cos(Math.PI / 3) ** 2 / 3e8 * 1e6,
      sol: R`Two factors of $\cos\theta$: the beam's power is spread over an area larger by $1/\cos\theta$, and only the normal part of the momentum, $\cos\theta$, is reversed. Reflection doubles the change. $p = \frac{2I\cos^2\theta}{c} = \frac{2\times1200\times0.25}{3.0\times10^8} = 2.0\times10^{-6}$ Pa.`,
      trap: R`Using a single $\cos\theta$ (giving $4.0\ \mu$Pa).` },
    { id: 'mxw-r5-09', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'waves in media',
      q: R`In a non-magnetic insulator with $\varepsilon_r = 4$, the ratio $E_0/H_0$ of a plane wave's field amplitudes is about`,
      options: [R`$754\ \Omega$`, R`$94\ \Omega$`, R`$377\ \Omega$`, R`$188\ \Omega$`], answer: 3,
      sol: R`The wave impedance is $\eta = \sqrt{\mu/\varepsilon} = \frac{\eta_0}{\sqrt{\varepsilon_r}}$ with $\eta_0 = \sqrt{\mu_0/\varepsilon_0}\approx377\ \Omega$. Here $\eta = 377/2 = 188\ \Omega$.`,
      trap: R`Dividing by $\varepsilon_r$ (giving $94\ \Omega$) instead of its square root.` },
    { id: 'mxw-r5-10', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'poynting theorem', format: 'statements',
      q: R`Which statements about Poynting's theorem and the Poynting vector $\vec S = \vec E\times\vec B/\mu_0$ are true?`,
      options: [R`$-\dfrac{\partial u}{\partial t} = \nabla\cdot\vec S + \vec J\cdot\vec E$, with $u$ the field energy density`, R`$\vec J\cdot\vec E$ is the rate per unit volume at which the fields do work on charges`, R`For a resistive wire carrying a steady current, $\vec S$ at its surface points into the wire`, R`In any static situation $\vec S$ is zero everywhere`],
      answer: [0, 1, 2],
      sol: R`The first is Poynting's theorem: field energy in a volume falls by what flows out through the surface plus the work done on charges, $\vec J\cdot\vec E$. In a wire, $\vec E$ runs along the wire and $\vec B$ circles it, so $\vec E\times\vec B$ points radially inwards, delivering exactly $I^2R$. Static fields can still give $\vec S\ne0$ (a charged capacitor near a bar magnet); its divergence is zero, so no energy builds up anywhere.`,
      trap: R`Assuming "no change" means "no Poynting vector"; static crossed fields carry a circulating $\vec S$.` },
  ],
  gens: [
    { id: 'mxw-r5g1', type: 'nat', level: 3, exams: ['jam'], sub: 'intensity',
      make(r) {
        const P = choose(r, [0.5, 1, 2, 5, 10, 50]), A = choose(r, [0.5, 1, 2, 4, 10]), I = P * 1e-3 / (A * 1e-6), E0 = Math.sqrt(2 * I / (C.c * C.eps0));
        return { q: `A $${P}$ mW laser beam has a uniform cross-section of $${A}$ mm². The amplitude of its electric field is ______ V/m (nearest whole number).`,
          answer: Math.round(E0), tol: Math.max(1, Math.round(E0 * 0.003)), unit: 'V/m', P, A,
          sol: `$I = P/A = ${round(I, 1)}$ W/m². $E_0 = \\sqrt{2I/(c\\varepsilon_0)} = \\sqrt{\\frac{2\\times${round(I, 1)}}{2.998\\times10^8\\times8.854\\times10^{-12}}} = ${Math.round(E0)}$ V/m.`,
          trap: 'The time-averaged intensity has a factor $\\frac12$: $I = \\frac12c\\varepsilon_0E_0^2$.' };
      },
      verify: (p) => Math.sqrt(2 * (p.P * 1e-3 / (p.A * 1e-6)) / (C.c * C.eps0)) },
    { id: 'mxw-r5g2', type: 'nat', level: 4, exams: ['jam'], sub: 'displacement current',
      make(r) {
        const Rc = int(r, 3, 12), rc = int(r, 1, 20), I = choose(r, [0.5, 1, 2, 3, 5]);
        const B = rc <= Rc ? 2e-7 * I * (rc / 100) / (Rc / 100) ** 2 : 2e-7 * I / (rc / 100), Bu = B * 1e6;
        return { q: `Circular capacitor plates of radius $${Rc}$ cm are being charged by a steady $${I}$ A current. In the plane midway between the plates, $${rc}$ cm from the axis, the magnetic field is ______ $\\mu$T (three decimal places; ignore edge effects).`,
          answer: round(Bu, 3), tol: Math.max(0.001, round(Bu * 0.003, 3)), unit: 'μT', Rc, rc, I,
          sol: rc <= Rc ? `Inside the plates' radius, the loop encloses displacement current $I r^2/R^2$: $B = \\frac{\\mu_0Ir}{2\\pi R^2} = \\frac{2\\times10^{-7}\\times${I}\\times${rc / 100}}{${(Rc / 100) ** 2}} = ${round(Bu, 3)}\\ \\mu$T.`
            : `Outside the plates' radius, the loop encloses all the displacement current $I$: $B = \\frac{\\mu_0I}{2\\pi r} = \\frac{2\\times10^{-7}\\times${I}}{${rc / 100}} = ${round(Bu, 3)}\\ \\mu$T, as for a wire.`,
          trap: 'Only the displacement current inside the loop counts: a fraction $r^2/R^2$ inside the plates.' };
      },
      verify: (p) => (p.rc <= p.Rc ? 2e-7 * p.I * (p.rc / 100) / (p.Rc / 100) ** 2 : 2e-7 * p.I / (p.rc / 100)) * 1e6 },
    { id: 'mxw-r5g3', type: 'nat', level: 4, exams: ['jam'], sub: 'radiation pressure',
      make(r) {
        const I = choose(r, [100, 500, 1000, 1360, 2000]), th = choose(r, [0, 30, 45, 60]), refl = r() < 0.5, cth = Math.cos(th * Math.PI / 180);
        const p = (refl ? 2 : 1) * I * cth * cth / C.c * 1e6;
        return { q: `Light of intensity $${I}$ W/m² falls at $${th}^\\circ$ to the normal on a flat ${refl ? 'perfect mirror' : 'perfectly absorbing sheet'}. The pressure (normal force per unit area of the surface) is ______ $\\mu$Pa (three decimal places).`,
          answer: round(p, 3), tol: Math.max(0.001, round(p * 0.003, 3)), unit: 'μPa', I, th, refl,
          sol: `The beam's power lands on an area larger by $1/\\cos\\theta$, and only the normal part ($\\cos\\theta$) of its momentum pushes on the surface${refl ? '; a mirror reverses that part, doubling it' : ''}. $p = \\frac{${refl ? 2 : ''}I\\cos^2\\theta}{c} = \\frac{${refl ? '2\\times' : ''}${I}\\times${round(cth * cth, 4)}}{2.998\\times10^8} = ${round(p, 3)}\\ \\mu$Pa.`,
          trap: 'There are two factors of $\\cos\\theta$: one for the area, one for the normal component.' };
      },
      verify: (p) => (p.refl ? 2 : 1) * p.I * Math.cos(p.th * Math.PI / 180) ** 2 / C.c * 1e6 },
  ],
};
