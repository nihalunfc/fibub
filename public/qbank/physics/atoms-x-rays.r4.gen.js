// Round 4 extras for atoms-x-rays: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const J = ['jam'], JG = ['jam', 'gate'];

export default {
  items: [
    { id: 'atx-r4-01', type: 'mcq', level: 1, exams: J, sub: 'bohr energies',
      q: R`In the Bohr model of hydrogen, the total energy of the electron in the $n = 2$ orbit is $-3.4$ eV. Its kinetic energy in that orbit is`,
      options: [R`$-3.4$ eV`, R`$6.8$ eV`, R`$3.4$ eV`, R`$1.7$ eV`], answer: 2,
      sol: R`For an inverse-square force the virial theorem gives $K = -E$ and $U = 2E$. So $K = +3.4$ eV and $U = -6.8$ eV, adding to $E = -3.4$ eV.`,
      trap: R`Kinetic energy can never be negative; $6.8$ eV is the size of the potential energy.` },
    { id: 'atx-r4-02', type: 'mcq', level: 2, exams: J, sub: 'characteristic lines',
      q: R`For copper the K absorption edge is at $8.98$ keV and the K$\alpha$ line at $8.05$ keV. The smallest X-ray tube voltage at which the Cu K$\alpha$ line appears in the spectrum is about`,
      options: [R`$8.05$ kV`, R`$0.93$ kV`, R`$17.0$ kV`, R`$8.98$ kV`], answer: 3,
      sol: R`K$\alpha$ is emitted when an L electron fills a K-shell vacancy. First the tube's electrons must knock a K electron right out of the atom, which costs the K binding energy, $8.98$ keV (the absorption edge). So the tube needs at least $8.98$ kV; the photon that comes out afterwards carries only $8.05$ keV.`,
      trap: R`The line's own energy is not enough: the vacancy has to be made before the line can be emitted.` },
    { id: 'atx-r4-03', type: 'mcq', level: 2, exams: J, sub: 'spectral series',
      q: R`Using $R = 1.097\times10^7$ m$^{-1}$, the short-wavelength limit of the Balmer series of hydrogen (the series limit) is about`,
      options: [R`$656.3$ nm`, R`$364.6$ nm`, R`$121.6$ nm`, R`$91.2$ nm`], answer: 1,
      sol: R`The Balmer series ends on $n = 2$. Its limit is the transition from $n\to\infty$: $1/\lambda = R(1/4 - 0) = R/4$, so $\lambda = 4/R = 4/1.097\times10^7 = 3.646\times10^{-7}$ m $= 364.6$ nm, in the near ultraviolet.`,
      trap: R`$656.3$ nm (H$\alpha$) is the longest Balmer line, at the other end of the series; $91.2$ nm is the Lyman limit.` },
    { id: 'atx-r4-04', type: 'nat', level: 3, exams: J, sub: 'hydrogen-like ions', unit: 'eV',
      q: R`A He$^+$ ion drops from $n = 2$ to $n = 1$. The photon it emits is absorbed by a hydrogen atom in its ground state. Taking $13.6$ eV for hydrogen, the kinetic energy of the electron knocked out of the hydrogen atom is ______ eV (to one decimal place).`,
      answer: 27.2, tol: 0.1, calc: () => 13.6 * 4 * 0.75 - 13.6,
      sol: R`He$^+$ has $Z = 2$: $E_n = -13.6Z^2/n^2 = -54.4/n^2$ eV. The photon carries $54.4(1 - \tfrac14) = 40.8$ eV. Removing the hydrogen electron costs $13.6$ eV, so it leaves with $40.8 - 13.6 = 27.2$ eV.`,
      trap: R`Forgetting the $Z^2$ for He$^+$ gives a $10.2$ eV photon, too small to ionise hydrogen at all.` },
    { id: 'atx-r4-05', type: 'nat', level: 3, exams: JG, sub: 'x-ray absorption', unit: 'mm',
      q: R`For X-rays of a certain energy, aluminium has a mass attenuation coefficient $\mu/\rho = 5.0$ cm$^2$/g, and its density is $2.70$ g/cm$^3$. The thickness of aluminium that halves the beam intensity is ______ mm (to two decimal places).`,
      answer: 0.51, tol: 0.01, calc: () => Math.LN2 / (5.0 * 2.7) * 10,
      sol: R`The linear attenuation coefficient is $\mu = (\mu/\rho)\rho = 5.0\times2.70 = 13.5$ cm$^{-1}$. With $I = I_0e^{-\mu x}$, half the intensity remains when $\mu x = \ln2$: $x = 0.693/13.5 = 0.0513$ cm $= 0.51$ mm.`,
      trap: R`$1/\mu$ (0.74 mm) is the thickness that cuts the beam to $1/e$, not to one half.` },
    { id: 'atx-r4-06', type: 'msq', level: 3, exams: JG, sub: 'x-ray spectrum', format: 'statements',
      q: R`An X-ray tube with a tungsten target runs at voltage $V$ and current $I$. Which statements about its continuous (bremsstrahlung) spectrum are correct?`,
      options: [R`Its short-wavelength limit depends only on $V$, not on the target metal.`, R`Raising $V$ moves the peak of the continuous spectrum to shorter wavelengths.`, R`The total X-ray power rises roughly as $ZIV^2$, where $Z$ is the target's atomic number.`, R`Most of the electrical power ends up as X-rays, so the target stays cool.`], answer: [0, 1, 2],
      sol: R`The shortest wavelength comes from an electron giving all of $eV$ to one photon: $\lambda_{\min} = hc/eV$, whatever the target. The whole spectrum stretches to higher energy as $V$ rises, so its peak moves to shorter wavelength. The X-ray yield per electron grows with $Z$ and with the electron energy, giving power $\propto ZIV^2$. But that yield is tiny (about $10^{-9}ZV$ with $V$ in volts, under 1% at tens of kV): almost all the beam power heats the target, which must be cooled.`,
      trap: R`X-ray tubes are very inefficient; the target needs water cooling or a rotating anode.` },
    { id: 'atx-r4-07', type: 'mcq', level: 4, exams: J, sub: 'bohr orbits',
      q: R`In the Bohr model, the ratio of the time the electron takes to go once round the $n = 2$ orbit of He$^+$ to the time it takes in the $n = 1$ orbit of hydrogen is`,
      options: [R`$1/2$`, R`$4$`, R`$1$`, R`$2$`], answer: 3,
      sol: R`$r_n\propto n^2/Z$ and $v_n\propto Z/n$, so the period $T = 2\pi r/v\propto n^3/Z^2$. For He$^+$, $n = 2$: $8/4 = 2$; for H, $n = 1$: $1$. The ratio is $2$.`,
      trap: R`The He$^+$ electron in $n = 2$ moves at the same speed as hydrogen's in $n = 1$ ($Z/n = 1$), but on an orbit twice as large ($n^2/Z = 2$), so it takes twice as long, not the same time.` },
    { id: 'atx-r4-08', type: 'nat', level: 4, exams: JG, sub: 'exotic atoms', unit: 'fm',
      q: R`A negative muon (mass $207m_e$) is captured by a carbon-12 nucleus (charge $6e$, mass $21\,870\,m_e$). With $a_0 = 52.92$ pm and the reduced-mass correction, the Bohr radius of the muon's $n = 1$ orbit is ______ fm (to one decimal place).`,
      answer: 43, tol: 0.3, calc: () => 52920 / (6 * 207 * 21870 / (207 + 21870)),
      sol: R`Reduced mass $\mu = \dfrac{207\times21870}{207 + 21870}m_e = 205.1m_e$. The Bohr radius scales as $a = a_0\dfrac{m_e}{\mu Z} = \dfrac{52.92\text{ pm}}{205.1\times6} = 0.0430$ pm $= 43.0$ fm. This is only about 16 times the radius of the carbon nucleus (about $2.7$ fm), so muonic X-rays are sensitive to the nuclear size.`,
      trap: R`Using $a_0$ in pm and the answer in fm: $1$ pm $= 1000$ fm.` },
    { id: 'atx-r4-09', type: 'msq', level: 4, exams: JG, sub: 'x-ray fluorescence', format: 'statements',
      q: R`Copper K$\alpha$ X-rays ($8.05$ keV) fall on thin foils of several metals. The K absorption edges are: iron $7.11$ keV, cobalt $7.71$ keV, nickel $8.33$ keV, zinc $9.66$ keV. Which foils emit their own K-series X-rays (K fluorescence)?`,
      options: [R`Iron`, R`Cobalt`, R`Nickel`, R`Zinc`], answer: [0, 1],
      sol: R`K fluorescence needs a K-shell vacancy, so the photon must have more energy than the K edge. $8.05$ keV exceeds the iron ($7.11$) and cobalt ($7.71$) edges but not the nickel ($8.33$) or zinc ($9.66$) edges. Iron and cobalt absorb strongly and re-emit their own K lines; nickel and zinc absorb only weakly (L shell and outer electrons).`,
      trap: R`Elements with higher $Z$ have K edges above the copper line; more electrons does not mean easier K ionisation.` },
    { id: 'atx-r4-10', type: 'nat', level: 5, exams: JG, sub: 'collisional excitation', unit: 'eV',
      q: R`A beam of protons hits hydrogen atoms at rest in their ground state. Treat the proton and the hydrogen atom as having equal mass and take $13.6$ eV for hydrogen. The smallest proton kinetic energy that can excite a hydrogen atom to $n = 2$ is ______ eV (to one decimal place).`,
      answer: 20.4, tol: 0.1, calc: () => 2 * 13.6 * 0.75,
      sol: R`Momentum must be conserved, so the pair keeps moving after the collision; only the kinetic energy in the centre-of-mass frame can be turned into excitation. For equal masses that is half of the lab kinetic energy: $K_{\rm cm} = K\cdot\dfrac{M}{m + M} = K/2$. Excitation needs $10.2$ eV, so $K\ge2\times10.2 = 20.4$ eV. For an electron beam the factor is $1 + m_e/M_H\approx1$, which is why electrons excite at almost exactly $10.2$ eV.`,
      trap: R`$10.2$ eV ignores that a heavy projectile must leave much of its energy as motion of the centre of mass.` },
  ],
  gens: [
    { id: 'atx-r4g1', type: 'nat', level: 3, exams: J, sub: 'hydrogen-like ions', unit: 'eV',
      make(r) {
        const [ion, Z1] = choose(r, [['He$^+$', 2], ['Li$^{2+}$', 3]]), n2 = int(r, 2, Z1 === 2 ? 4 : 3);
        const [tgt, Z2, n] = choose(r, [['a hydrogen atom in its ground state', 1, 1], ['a hydrogen atom in its $n = 2$ state', 1, 2], ['a He$^+$ ion in its $n = 2$ state', 2, 2], ['a Li$^{2+}$ ion in its $n = 3$ state', 3, 3]]);
        const Eph = 13.6 * Z1 * Z1 * (1 - 1 / (n2 * n2)), B = 13.6 * Z2 * Z2 / (n * n), K = Eph - B;
        return { q: `A ${ion} ion drops from $n = ${n2}$ to $n = 1$. The photon it emits is absorbed by ${tgt}. Taking $13.6$ eV for hydrogen, the kinetic energy of the electron knocked out is ______ eV (to one decimal place).`,
          answer: round(K, 1), tol: 0.1, Z1, n2, Z2, n,
          sol: `Photon: $13.6\\times${Z1}^2(1 - 1/${n2}^2) = ${round(Eph, 2)}$ eV. Binding energy of the absorbing electron: $13.6\\times${Z2}^2/${n}^2 = ${round(B, 2)}$ eV. Kinetic energy $= ${round(Eph, 2)} - ${round(B, 2)} = ${round(K, 1)}$ eV.`,
          trap: 'Both energies scale as $Z^2/n^2$; use each ion\'s own $Z$.' };
      },
      verify: (p) => 13.6 * p.Z1 ** 2 * (1 - 1 / p.n2 ** 2) - 13.6 * p.Z2 ** 2 / p.n ** 2 },
    { id: 'atx-r4g2', type: 'nat', level: 3, exams: JG, sub: 'x-ray absorption',
      make(r) {
        const [mat, rho] = choose(r, [['aluminium', 2.70], ['copper', 8.96], ['lead', 11.35], ['water', 1.00], ['iron', 7.87]]), ask = choose(r, ['hvl', 'frac']), x = pick(r, 0.5, 5, 0.5);
        const mr = Number((pick(r, 0.2, 3, 0.05) / (rho * x / 10)).toPrecision(2)), mu = mr * rho;
        const val = ask === 'hvl' ? Math.LN2 / mu * 10 : 100 * Math.exp(-mu * x / 10);
        return { q: `For X-rays of a certain energy, ${mat} (density $${rho}$ g/cm$^3$) has mass attenuation coefficient $\\mu/\\rho = ${mr}$ cm$^2$/g. ${ask === 'hvl' ? 'The thickness that halves the intensity is ______ mm (to three decimal places).' : `The percentage of the intensity that gets through a sheet $${x}$ mm thick is ______ % (to two decimal places).`}`,
          answer: ask === 'hvl' ? round(val, 3) : round(val, 2), tol: ask === 'hvl' ? Math.max(0.001, round(val * 0.005, 3)) : Math.max(0.01, round(val * 0.005, 2)), mr, rho, x, ask, unit: ask === 'hvl' ? 'mm' : '%',
          sol: `$\\mu = (\\mu/\\rho)\\rho = ${mr}\\times${rho} = ${round(mu, 3)}$ cm$^{-1}$. ${ask === 'hvl' ? `Half-value thickness $= \\ln2/\\mu = 0.6931/${round(mu, 3)} = ${round(val / 10, 4)}$ cm $= ${round(val, 3)}$ mm.` : `$I/I_0 = e^{-\\mu x} = e^{-${round(mu, 3)}\\times${round(x / 10, 2)}} = ${round(val / 100, 5)}$, i.e. $${round(val, 2)}$%.`}`,
          trap: 'Multiply $\\mu/\\rho$ by the density to get $\\mu$, and keep the thickness in cm when $\\mu$ is in cm$^{-1}$.' };
      },
      verify: (p) => { const mu = p.mr * p.rho; return p.ask === 'hvl' ? Math.LN2 / mu * 10 : 100 * Math.exp(-mu * p.x / 10); } },
    { id: 'atx-r4g3', type: 'nat', level: 4, exams: JG, sub: 'collisional excitation', unit: 'eV',
      make(r) {
        const [proj, m] = choose(r, [['electrons (mass negligible next to the atom)', 0], ['protons (mass $1$ in units of the hydrogen atom)', 1], ['deuterons (mass $2$ in units of the hydrogen atom)', 2], ['alpha particles (mass $4$ in units of the hydrogen atom)', 4]]), n = int(r, 2, 4);
        const dE = 13.6 * (1 - 1 / (n * n)), K = dE * (1 + m);
        return { q: `A beam of ${proj} hits hydrogen atoms at rest in their ground state. Taking $13.6$ eV for hydrogen, the smallest beam kinetic energy that can excite an atom to $n = ${n}$ is ______ eV (to two decimal places).`,
          answer: round(K, 2), tol: 0.02, m, n,
          sol: `Excitation energy $13.6(1 - 1/${n}^2) = ${round(dE, 3)}$ eV. Only the centre-of-mass part of the kinetic energy, $K\\cdot M_H/(m + M_H)$, can be used, so $K_{\\min} = \\Delta E(1 + m/M_H) = ${round(dE, 3)}\\times${1 + m} = ${round(K, 2)}$ eV.`,
          trap: 'Momentum conservation keeps part of the kinetic energy locked in the motion of the centre of mass.' };
      },
      verify: (p) => 13.6 * (1 - 1 / p.n ** 2) * (1 + p.m) },
  ],
};
