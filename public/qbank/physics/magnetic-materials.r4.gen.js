// Round 4 extras for magnetic-materials: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'mgm-r4-01', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'diamagnetism',
      q: R`Water has $\chi_m = -9.0\times10^{-6}$ and density $1000$ kg/m³. To float a drop of water in the vertical field of a strong magnet (the trick used to levitate a frog), the product $B\,\dfrac{dB}{dz}$ at the drop must reach about ______ T²/m (take $g = 9.8$ m/s²).`,
      answer: 1368, tol: 10, unit: 'T²/m', calc: () => C.mu0 * 1000 * 9.8 / 9e-6,
      sol: R`A weakly magnetic material ($|\chi_m|\ll1$) has energy $-\frac{\chi_m}{2\mu_0}B^2$ per unit volume, so it feels a force per unit volume $\frac{\chi_m}{2\mu_0}\nabla(B^2) = \frac{\chi_m}{\mu_0}B\nabla B$. For a diamagnet ($\chi_m < 0$) this pushes towards weaker field. Balancing weight per unit volume: $\frac{|\chi_m|}{\mu_0}B\frac{dB}{dz} = \rho g$, so $B\frac{dB}{dz} = \frac{\mu_0\rho g}{|\chi_m|} = \frac{1.257\times10^{-6}\times1000\times9.8}{9.0\times10^{-6}} = 1.37\times10^3$ T²/m (e.g. about 16 T with a gradient of 85 T/m).`,
      trap: R`Dropping the factor $\frac{1}{\mu_0}$ or the square: the force depends on the gradient of $B^2$, not of $B$.` },
    { id: 'mgm-r4-02', type: 'mcq', level: 1, exams: ['jam'], sub: 'classification',
      q: R`Which of these materials has a relative permeability slightly less than 1?`,
      options: [R`aluminium`, R`bismuth`, R`nickel`, R`platinum`], answer: 1,
      sol: R`$\mu_r < 1$ means $\chi_m < 0$: a diamagnet. Bismuth is one of the most strongly diamagnetic elements ($\chi_m\approx-1.7\times10^{-4}$). Aluminium and platinum are paramagnetic ($\mu_r$ just above 1) and nickel is ferromagnetic ($\mu_r\gg1$).`,
      trap: R`Assuming every metal is attracted to a magnet.` },
    { id: 'mgm-r4-03', type: 'mcq', level: 3, exams: ['jam'], sub: 'hysteresis',
      q: R`The core of a power transformer is magnetised back and forth 50 times a second. The best core material has`,
      options: [R`a narrow hysteresis loop (low coercivity) and high permeability`, R`a wide hysteresis loop with high coercivity and high remanence`, R`a wide loop, so that it stores more energy each cycle`, R`a negative susceptibility, so that it pushes the flux out`], answer: 0,
      sol: R`Each cycle wastes energy equal to the loop area per unit volume, so a narrow loop (soft magnetic material, low coercivity) keeps losses low. High permeability lets a small magnetising current produce a large flux. A wide loop with high coercivity and remanence is what a permanent magnet needs, not a transformer.`,
      trap: R`Swapping the needs of permanent magnets and transformer cores.` },
    { id: 'mgm-r4-04', type: 'nat', level: 3, exams: ['jam'], sub: 'magnetic circuits',
      q: R`An electromagnet has an air gap $2.0$ mm long with pole faces of area $10$ cm², and the field across the gap is $1.2$ T. The magnetic energy stored in the gap is ______ J (two decimal places).`,
      answer: 1.15, tol: 0.01, unit: 'J', calc: () => 1.2 ** 2 / (2 * C.mu0) * 10e-4 * 2e-3,
      sol: R`In air the energy density is $u = \frac{B^2}{2\mu_0} = \frac{1.44}{2\times1.257\times10^{-6}} = 5.73\times10^5$ J/m³. The gap volume is $10\times10^{-4}\times2.0\times10^{-3} = 2.0\times10^{-6}$ m³, so the energy is $1.15$ J. The iron, with the same $B$ but $\mu_r$ in the thousands, stores far less per unit volume ($B^2/2\mu_r\mu_0$), which is why most of the energy sits in the gap.`,
      trap: R`Using $\frac12\mu_0B^2$ or $\frac{B^2}{\mu_0}$; the density is $\frac{B^2}{2\mu_0}$.` },
    { id: 'mgm-r4-05', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'shielding',
      q: R`A spherical shell of linear material with $\mu_r = 1000$, inner radius $9.0$ cm and outer radius $10$ cm, is placed in a uniform field $B_0$. Using the exact solution $\dfrac{B_{\rm in}}{B_0} = \dfrac{9\mu_r}{(2\mu_r + 1)(\mu_r + 2) - 2\left(\frac ab\right)^3(\mu_r - 1)^2}$, the field inside the cavity is ______ $B_0$ (four decimal places).`,
      answer: 0.0164, tol: 0.0003, calc: () => { const m = 1000, x = 0.729; return 9 * m / ((2 * m + 1) * (m + 2) - 2 * x * (m - 1) ** 2); },
      sol: R`With $(a/b)^3 = 0.729$: $(2\mu_r + 1)(\mu_r + 2) = 2001\times1002 = 2.005\times10^6$ and $2\times0.729\times999^2 = 1.455\times10^6$. The denominator is $5.50\times10^5$, so $\frac{B_{\rm in}}{B_0} = \frac{9000}{5.50\times10^5} = 0.0164$. For $\mu_r\gg1$ this is close to $\frac{9}{2\mu_r(1 - a^3/b^3)} = 0.0166$: a thin shell of high-permeability metal cuts the field about sixty-fold, because the field lines prefer to run through the metal around the cavity.`,
      trap: R`Expecting a magnetic shield to work like a conductor in electrostatics (zero field inside); it only reduces the field by a factor of order $\mu_r\,t/R$.` },
    { id: 'mgm-r4-06', type: 'nat', level: 2, exams: ['jam'], sub: 'magnetisation',
      q: R`A small cube of iron, $1.0$ cm on each side, is magnetised to saturation, $M = 1.7\times10^6$ A/m. Its magnetic dipole moment is ______ A m².`,
      answer: 1.7, tol: 0.01, unit: 'A m²', calc: () => 1.7e6 * 1e-6,
      sol: R`Magnetisation is dipole moment per unit volume, so $m = MV = 1.7\times10^6\times(1.0\times10^{-2})^3 = 1.7$ A m².`,
      trap: R`Cubing the side in centimetres: $V = 10^{-6}$ m³, not 1.` },
    { id: 'mgm-r4-07', type: 'mcq', level: 3, exams: ['jam'], sub: 'paramagnetism',
      q: R`For an ideal paramagnet at fixed temperature, the magnetisation $M$ is plotted against the applied field $B$ from zero up to very large fields. The graph`,
      options: [R`is a straight line through the origin at all fields`, R`shows a loop: it depends on whether $B$ is rising or falling`, R`rises linearly at first, then bends over and levels off at a saturation value`, R`starts flat and then rises steeply above a threshold field`], answer: 2,
      sol: R`While $\mu B\ll k_BT$, thermal agitation keeps the moments mostly random and $M$ grows in proportion to $B$ (Curie's law). When $\mu B\gg k_BT$ almost every moment is lined up and $M$ approaches $N\mu$ (the Brillouin or Langevin function levels off). Paramagnets show no hysteresis loop; that belongs to ferromagnets.`,
      trap: R`Extending the low-field straight line forever; it holds only while $\mu B\ll k_BT$.` },
    { id: 'mgm-r4-08', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'ferromagnetism', format: 'statements',
      q: R`Which statements about ferromagnets in the Weiss mean-field picture are true?`,
      options: [R`Below the Curie temperature a magnetisation exists inside each domain even with no applied field`, R`The spontaneous magnetisation falls continuously to zero as the temperature rises to the Curie point`, R`Above the Curie point the susceptibility follows $\chi = C/(T - \theta)$ with $\theta > 0$`, R`The Weiss "molecular field" comes from the magnetic dipole fields of neighbouring atoms`],
      answer: [0, 1, 2],
      sol: R`In the mean-field model each moment feels $\lambda M$ in addition to the applied field; below $T_C$ this self-consistent field keeps the moments aligned spontaneously, and $M_s$ falls smoothly to zero at $T_C$ (a continuous transition). Above $T_C$, the model gives the Curie-Weiss law with $\theta = T_C > 0$. The needed $\lambda M$ is of order 1000 T, far bigger than any dipole field (about 1 T); its true origin is the quantum exchange interaction.`,
      trap: R`Taking the molecular field literally as a magnetic field from neighbouring dipoles; it is far too large for that.` },
    { id: 'mgm-r4-09', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'hysteresis',
      q: R`A transformer designed for 50 Hz is run at 60 Hz with the same peak flux density. Compared with before, the hysteresis loss and the eddy-current loss (power) each change by a factor of`,
      options: [R`$1.44$ and $1.2$`, R`$1.2$ and $1.2$`, R`$1$ and $1.44$`, R`$1.2$ and $1.44$`], answer: 3,
      sol: R`With the same peak $B$ the loop is the same, so the hysteresis energy per cycle is unchanged; the power goes as the number of cycles per second, $\times\frac{60}{50} = 1.2$. Eddy currents are driven by the induced emf, which is proportional to $f B_{\rm peak}$; the power ($\propto$ emf²) goes as $f^2$, so $\times1.44$.`,
      trap: R`Treating both losses alike; hysteresis is per cycle, eddy loss grows with the square of the frequency.` },
    { id: 'mgm-r4-10', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'auxiliary field', format: 'statements',
      q: R`Which statements about the auxiliary field $\vec H = \vec B/\mu_0 - \vec M$ are true (static fields)?`,
      options: [R`$\oint\vec H\cdot d\vec l$ equals the free current through the loop`, R`$\nabla\cdot\vec H = -\nabla\cdot\vec M$`, R`$\vec H$ is zero wherever there is no free current`, R`In a linear material, $\vec B = \mu_0\mu_r\vec H$`],
      answer: [0, 1, 3],
      sol: R`Ampère's law with bound currents removed gives $\nabla\times\vec H = \vec J_f$, the integral form being the first statement. Since $\nabla\cdot\vec B = 0$, $\nabla\cdot\vec H = -\nabla\cdot\vec M$, which is non-zero at the ends of a bar magnet. So $\vec H$ need not vanish where $J_f = 0$: a bar magnet has an $\vec H$ field inside and outside with no free current at all. For a linear medium $\vec M = \chi_m\vec H$ and $\vec B = \mu_0(1 + \chi_m)\vec H$.`,
      trap: R`Concluding from $\nabla\times\vec H = \vec J_f$ that $\vec H$ is fixed by free currents alone; its divergence matters too.` },
    { id: 'mgm-r4-11', type: 'mcq', level: 2, exams: ['jam'], sub: 'atomic moments',
      q: R`The Bohr magneton $\mu_B = \dfrac{e\hbar}{2m_e}$, the natural unit of atomic magnetic moments, is about`,
      options: [R`$5.05\times10^{-27}$ J/T`, R`$9.27\times10^{-24}$ J/T`, R`$1.60\times10^{-19}$ J/T`, R`$9.27\times10^{-28}$ J/T`], answer: 1,
      sol: R`$\mu_B = \frac{1.602\times10^{-19}\times1.055\times10^{-34}}{2\times9.109\times10^{-31}} = 9.27\times10^{-24}$ J/T (the same as A m²). $5.05\times10^{-27}$ J/T is the nuclear magneton, smaller by the proton-to-electron mass ratio 1836.`,
      trap: R`Mixing up the Bohr magneton and the nuclear magneton.` },
    { id: 'mgm-r4-12', type: 'nat', level: 3, exams: ['jam'], sub: 'susceptibility',
      q: R`A long air-cored solenoid has inductance $2.000$ mH. When its core is completely filled with a paramagnetic powder, the inductance becomes $2.006$ mH. The susceptibility of the powder is ______ $\times10^{-3}$.`,
      answer: 3, tol: 0.05, calc: () => (2.006 / 2.000 - 1) * 1e3,
      sol: R`For a long solenoid filled with a linear material, $L = \mu_r L_0 = (1 + \chi_m)L_0$. So $\chi_m = \frac{L}{L_0} - 1 = \frac{2.006}{2.000} - 1 = 3.0\times10^{-3}$.`,
      trap: R`Reporting $\mu_r$ (1.003) instead of $\chi_m = \mu_r - 1$.` },
  ],
  gens: [
    { id: 'mgm-r4g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'diamagnetism',
      make(r) {
        const [name, chi, chitex, rho] = choose(r, [['water', 9.0e-6, '-9.0\\times10^{-6}', 1000], ['bismuth', 1.66e-4, '-1.66\\times10^{-4}', 9780], ['pyrolytic graphite', 4.5e-4, '-4.5\\times10^{-4}', 2200], ['ethanol', 7.2e-6, '-7.2\\times10^{-6}', 789]]);
        const v = C.mu0 * rho * 9.8 / chi;
        return { q: `A small piece of ${name} ($\\chi_m = ${chitex}$, density $${rho}$ kg/m³) is to be floated in the vertical field of a magnet. The product $B\\,dB/dz$ needed is ______ T²/m (three significant figures; $g = 9.8$ m/s²).`,
          answer: +v.toPrecision(3), tol: +(v * 0.006).toPrecision(2), unit: 'T²/m', rho, chi,
          sol: `The force per unit volume on a weak magnet is $\\frac{\\chi_m}{\\mu_0}B\\nabla B$; for a diamagnet it points towards weaker field. Balancing $\\rho g$: $B\\frac{dB}{dz} = \\frac{\\mu_0\\rho g}{|\\chi_m|} = \\frac{1.257\\times10^{-6}\\times${rho}\\times9.8}{${round(chi * 1e6, 2)}\\times10^{-6}} = ${+v.toPrecision(3)}$ T²/m.`,
          trap: 'The force depends on $B\\,dB/dz$, not on $B$ alone.' };
      },
      verify: (p) => C.mu0 * p.rho * 9.8 / p.chi },
    { id: 'mgm-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'magnetic circuits',
      make(r) {
        const B = choose(r, [0.5, 0.8, 1.0, 1.2, 1.5]), A = int(r, 4, 25), g = choose(r, [0.5, 1, 1.5, 2, 3]);
        const E = B * B / (2 * C.mu0) * A * 1e-4 * g * 1e-3;
        return { q: `The air gap of an electromagnet is $${g}$ mm long, the pole faces have area $${A}$ cm², and the field across the gap is $${B}$ T. The magnetic energy stored in the gap is ______ J (three significant figures).`,
          answer: +E.toPrecision(3), tol: +(E * 0.006).toPrecision(2), unit: 'J', B, A, g,
          sol: `$u = \\frac{B^2}{2\\mu_0} = \\frac{${B}^2}{2\\times1.257\\times10^{-6}} = ${+(B * B / (2 * C.mu0)).toPrecision(4)}$ J/m³; volume $= ${A}\\times10^{-4}\\times${g}\\times10^{-3}$ m³; energy $= ${+E.toPrecision(3)}$ J.`,
          trap: 'Convert cm² and mm to SI before multiplying.' };
      },
      verify: (p) => p.B * p.B / (2 * C.mu0) * p.A * 1e-4 * p.g * 1e-3 },
    { id: 'mgm-r4g3', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'hysteresis',
      make(r) {
        const [f1, f2] = choose(r, [[50, 60], [60, 50], [50, 100], [50, 400], [60, 400], [100, 50]]);
        const k = f2 / f1, s = (x) => String(round(x, 3));
        const show = ([h, e]) => `hysteresis $\\times${s(h)}$, eddy current $\\times${s(e)}$`;
        const right = [k, k * k];
        const o = mcqOptions(r, right, [[k * k, k], [k, k], [1, k * k], [k, 1], [k * k, k * k]], show);
        return { q: `A transformer core runs at $${f1}$ Hz and is then driven at $${f2}$ Hz with the same peak flux density. The hysteresis power loss and eddy-current power loss change by`, ...o,
          sol: `Same peak $B$ means the same loop, so the hysteresis energy per cycle is unchanged and the power scales with the frequency: $\\times${s(k)}$. The eddy emf is proportional to $fB$, and the eddy power to its square: $\\times${s(k * k)}$.`,
          trap: 'Hysteresis loss is per cycle; eddy loss goes as the frequency squared.' };
      } },
  ],
};
