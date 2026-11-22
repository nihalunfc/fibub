// Round 5 extras for transducers-detectors: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];
const CL = 2.99792458e8, ME = 0.51099895;
const tof = (m, p, L) => L * Math.sqrt(p * p + m * m) / (p * CL);
const cherT = (m, n) => m * (1 / Math.sqrt(1 - 1 / (n * n)) - 1);
const sauer = (df) => df / (2 * 5e6 ** 2 / Math.sqrt(2.648 * 2.947e11)) * 1e6;

export default {
  items: [
    { id: 'trd-r5-01', type: 'mcq', level: 1, exams: A, sub: 'capacitive sensors',
      q: R`A parallel-plate capacitive displacement sensor has plate area $A$ and gap $d$. If the gap is halved, its capacitance`,
      options: [R`halves`, R`doubles`, R`falls to a quarter`, R`is unchanged`], answer: 1,
      sol: R`$C = \varepsilon_0\varepsilon_rA/d$, so $C\propto1/d$: halving the gap doubles $C$. Because $C$ is inversely (not linearly) proportional to $d$, simple gap sensors are nonlinear for large movements.`,
      trap: R`Capacitance grows as the plates get closer, not smaller.` },
    { id: 'trd-r5-02', type: 'nat', level: 2, exams: A, sub: 'capacitive sensors',
      q: R`A capacitive sensor has two parallel plates of area $1.0$ cm$^2$ separated by an air gap of $0.10$ mm. Its capacitance is ______ pF (to two decimal places). Take $\varepsilon_0 = 8.854\times10^{-12}$ F/m.`,
      answer: 8.85, tol: 0.02, calc: () => 8.854e-12 * 1e-4 / 1e-4 * 1e12,
      sol: R`$A = 1.0\times10^{-4}$ m$^2$ and $d = 1.0\times10^{-4}$ m, so $C = \varepsilon_0A/d = 8.854\times10^{-12}\times10^{-4}/10^{-4} = 8.85\times10^{-12}$ F $= 8.85$ pF. Such small values are why capacitive sensors need short, screened leads: a metre of cable adds about $100$ pF.`,
      trap: R`1 cm$^2$ is $10^{-4}$ m$^2$, not $10^{-2}$ m$^2$.` },
    { id: 'trd-r5-03', type: 'mcq', level: 2, exams: A, sub: 'temperature sensors',
      q: R`An NTC thermistor follows $R = R_0e^{B(1/T - 1/T_0)}$ with $B = 3950$ K. Its temperature coefficient $\alpha = (1/R)\,dR/dT$ at $25\,^\circ$C ($298.15$ K) is about`,
      options: [R`$-0.385\%$ per K`, R`$-13.2\%$ per K`, R`$+4.44\%$ per K`, R`$-4.44\%$ per K`], answer: 3,
      sol: R`$\ln R = \ln R_0 + B/T - B/T_0$, so $\alpha = d\ln R/dT = -B/T^2 = -3950/298.15^2 = -0.0444$ K$^{-1}$, i.e. $-4.44\%$ per kelvin: more than ten times the $+0.385\%$ per kelvin of platinum, and negative.`,
      trap: R`$-B/T = -13.2$ is missing one factor of $T$; the sign is negative for an NTC.` },
    { id: 'trd-r5-04', type: 'nat', level: 3, exams: G, sub: 'image sensors',
      q: R`A CCD pixel holds at most $50\,000$ electrons (full well) and has a read noise of $10$ electrons rms. Its dynamic range (full well divided by read noise) is ______ dB (to one decimal place).`,
      answer: 74, tol: 0.1, calc: () => 20 * Math.log10(50000 / 10),
      sol: R`Ratio $= 50\,000/10 = 5000$. As a signal (amplitude) ratio, $20\log_{10}5000 = 20\times3.699 = 74.0$ dB, about $12.3$ bits, so a 14-bit ADC is enough to digitise it without losing information.`,
      trap: R`Using $10\log_{10}$ gives $37$ dB; electron counts are amplitudes, so the factor is 20.` },
    { id: 'trd-r5-05', type: 'msq', level: 3, exams: G, sub: 'Cherenkov detectors', format: 'statements',
      q: R`Which statements about Cherenkov radiation detectors are correct?`,
      options: [R`A charged particle radiates only if its speed exceeds $c/n$ in the medium.`, R`The light is emitted on a cone of half-angle $\theta$ with $\cos\theta = 1/(n\beta)$.`, R`At the same momentum, a kaon can be below threshold in a medium where a pion is above it, which allows particle identification.`, R`Cherenkov light is the main source of light in a NaI(Tl) scintillator.`], answer: [0, 1, 2],
      sol: R`Cherenkov light is a shock front of light, emitted when $\beta > 1/n$; the wavefronts add along a cone with $\cos\theta = 1/(n\beta)$. At a given momentum a heavier particle is slower, so a threshold counter fires for pions but not kaons over a range of momenta. In NaI(Tl) the light comes from de-excitation of activator centres (scintillation), which gives far more photons than Cherenkov emission.`,
      trap: R`Scintillation and Cherenkov light are different processes; NaI(Tl) relies on scintillation.` },
    { id: 'trd-r5-06', type: 'nat', level: 4, exams: G, sub: 'Cherenkov detectors',
      q: R`The minimum kinetic energy an electron needs to emit Cherenkov light in water ($n = 1.33$) is ______ MeV (to three decimal places). Take $m_ec^2 = 0.511$ MeV.`,
      answer: 0.264, tol: 0.002, calc: () => cherT(ME, 1.33),
      sol: R`Threshold $\beta = 1/n = 0.7519$. Then $\gamma = 1/\sqrt{1 - \beta^2} = 1/\sqrt{1 - 0.5653} = 1/0.6593 = 1.5167$. Kinetic energy $= (\gamma - 1)m_ec^2 = 0.5167\times0.511 = 0.264$ MeV. Many beta-decay electrons are above this, which is why spent fuel ponds glow blue.`,
      trap: R`Using the Newtonian $\tfrac12mv^2 = 0.144$ MeV ignores relativity, which is large at $\beta = 0.75$.` },
    { id: 'trd-r5-07', type: 'mcq', level: 4, exams: A, sub: 'capacitive sensors',
      q: R`A differential capacitive sensor has a centre plate between two fixed plates. When the centre plate moves by $x$, the gaps become $d - x$ and $d + x$, giving $C_1$ and $C_2$. The ratio $(C_1 - C_2)/(C_1 + C_2)$ equals`,
      options: [R`$x/2d$`, R`$x^2/d^2$`, R`$x/d$, exactly`, R`$2x/d$`], answer: 2,
      sol: R`$C_1 = k/(d - x)$ and $C_2 = k/(d + x)$. Then $C_1 - C_2 = k\cdot2x/(d^2 - x^2)$ and $C_1 + C_2 = k\cdot2d/(d^2 - x^2)$, so the ratio is $x/d$ with no approximation. The push-pull arrangement turns the $1/d$ nonlinearity of a single gap into an exactly linear output.`,
      trap: R`Each capacitance alone is nonlinear in $x$; the ratio of difference to sum is what becomes linear.` },
    { id: 'trd-r5-08', type: 'msq', level: 4, exams: G, sub: 'semiconductor detectors', format: 'statements',
      q: R`Comparing silicon and germanium radiation detectors, which statements are correct?`,
      options: [R`Silicon detectors can work at room temperature, while germanium detectors must be cooled (usually with liquid nitrogen).`, R`Germanium's higher atomic number makes it far more efficient at absorbing gamma rays.`, R`The energy needed per electron-hole pair is about $3.6$ eV in silicon.`, R`Germanium has the larger band gap, which is why it must be cooled.`], answer: [0, 1, 2],
      sol: R`Germanium's band gap ($0.67$ eV) is smaller than silicon's ($1.12$ eV), so at room temperature thermal generation gives too much leakage current; cooling to about $77$ K fixes this. Its $Z = 32$ (against 14) makes photoabsorption, which goes roughly as $Z^4$ to $Z^5$, much stronger, so Ge suits gamma spectroscopy and Si suits charged particles and X-rays. Silicon needs about $3.6$ eV per pair, germanium about $2.96$ eV.`,
      trap: R`Germanium is cooled because its gap is small, not large.` },
    { id: 'trd-r5-09', type: 'nat', level: 5, exams: G, sub: 'mass sensors',
      q: R`A $5.0$ MHz quartz crystal microbalance follows the Sauerbrey relation $\Delta f = -\dfrac{2f_0^2}{\sqrt{\rho_q\mu_q}}\dfrac{\Delta m}{A}$ with $\rho_q = 2.648$ g cm$^{-3}$ and $\mu_q = 2.947\times10^{11}$ g cm$^{-1}$ s$^{-2}$. A film deposited on its $1.0$ cm$^2$ electrode lowers the frequency by $50$ Hz. The deposited mass is ______ $\mu$g (to two decimal places).`,
      answer: 0.88, tol: 0.01, calc: () => sauer(50),
      sol: R`$\sqrt{\rho_q\mu_q} = \sqrt{2.648\times2.947\times10^{11}} = \sqrt{7.804\times10^{11}} = 8.834\times10^5$ g cm$^{-2}$ s$^{-1}$. Sensitivity $2f_0^2/\sqrt{\rho_q\mu_q} = 2\times(5\times10^6)^2/8.834\times10^5 = 5.66\times10^7$ Hz cm$^2$ g$^{-1}$ $= 56.6$ Hz cm$^2$ per $\mu$g. So $\Delta m = 50/56.6 = 0.883\ \mu$g on $1$ cm$^2$. A frequency counter resolving $0.1$ Hz sees about $2$ ng: a sub-monolayer.`,
      trap: R`Keep the CGS units consistent; mixing in SI densities gives errors of $10^3$.` },
    { id: 'trd-r5-10', type: 'mcq', level: 5, exams: G, sub: 'particle identification',
      q: R`Charged pions ($m = 139.6$ MeV/$c^2$) and kaons ($m = 493.7$ MeV/$c^2$), both with momentum $2.0$ GeV/$c$, travel $10.0$ m between two timing detectors. The difference in their flight times is about`,
      options: [R`$0.92$ ns`, R`$0.46$ ns`, R`$2.4$ ns`, R`$9.2$ ns`], answer: 0,
      sol: R`$t = L/(\beta c)$ with $1/\beta = \sqrt{p^2 + m^2}/p$. Pion: $\sqrt{4 + 0.0195}/2 = 1.00243$, so $t = 33.44$ ns. Kaon: $\sqrt{4 + 0.2437}/2 = 1.03002$, so $t = 34.36$ ns. Difference $0.92$ ns: a timing resolution of about $0.1$ ns separates them cleanly.`,
      trap: R`Both particles are close to $c$; the difference comes from small corrections $\approx L m^2/(2p^2c)$, so careless rounding of $\beta$ loses it.` },
  ],
  gens: [
    { id: 'trd-r5g1', type: 'nat', level: 2, exams: A, sub: 'capacitive sensors',
      make(r) {
        const Acm = pick(r, 0.2, 5, 0.1), dmm = pick(r, 0.02, 1, 0.01), er = choose(r, [1, 2.1, 3.0, 4.5]);
        const C = 8.854e-12 * er * Acm * 1e-4 / (dmm * 1e-3) * 1e12;
        return { q: R`A parallel-plate capacitive sensor has plate area $${Acm}$ cm$^2$, gap $${dmm}$ mm and a dielectric of $\varepsilon_r = ${er}$ filling the gap. Its capacitance is ______ pF (to two decimal places). Take $\varepsilon_0 = 8.854\times10^{-12}$ F/m.`,
          answer: round(C, 2), tol: Math.max(0.01, round(C * 0.003, 2)), Acm, dmm, er,
          sol: R`$C = \varepsilon_0\varepsilon_rA/d = 8.854\times10^{-12}\times${er}\times${Acm}\times10^{-4}/(${dmm}\times10^{-3}) = ${round(C, 2)}$ pF.`,
          trap: 'Convert cm$^2$ to m$^2$ ($\\times10^{-4}$) and mm to m ($\\times10^{-3}$).' };
      },
      verify: (p) => 8.854e-12 * p.er * p.Acm * 1e-4 / (p.dmm * 1e-3) * 1e12 },
    { id: 'trd-r5g2', type: 'nat', level: 4, exams: G, sub: 'Cherenkov detectors',
      make(r) {
        const [nm, m] = choose(r, [['electron', ME], ['muon', 105.658], ['pion', 139.570], ['proton', 938.272]]);
        const [med, n] = choose(r, [['water', 1.33], ['acrylic', 1.49], ['lead glass', 1.65], ['aerogel', 1.03], ['fused silica', 1.46]]);
        const T = cherT(m, n);
        return { q: R`The threshold kinetic energy for a ${nm} ($mc^2 = ${m}$ MeV) to emit Cherenkov light in ${med} ($n = ${n}$) is ______ MeV (to three significant figures).`,
          answer: +T.toPrecision(3), tol: Math.max(1e-3, +(T * 0.004).toPrecision(2)), m, n,
          sol: R`$\beta_{th} = 1/n$, so $\gamma_{th} = 1/\sqrt{1 - 1/n^2} = ${round(1 / Math.sqrt(1 - 1 / (n * n)), 4)}$ and $T = (\gamma - 1)mc^2 = ${+T.toPrecision(3)}$ MeV.`,
          trap: 'Use the relativistic kinetic energy $(\\gamma - 1)mc^2$.' };
      },
      verify: (p) => cherT(p.m, p.n) },
    { id: 'trd-r5g3', type: 'mcq', level: 5, exams: G, sub: 'particle identification',
      make(r) {
        const pair = choose(r, [['pions', 139.570, 'kaons', 493.677], ['kaons', 493.677, 'protons', 938.272], ['pions', 139.570, 'protons', 938.272]]);
        const p = pick(r, 0.5, 4, 0.5), L = choose(r, [2, 3, 5, 10, 20]);
        const dt = (tof(pair[3] / 1000, p, L) - tof(pair[1] / 1000, p, L)) * 1e9;
        const approx = L * ((pair[3] / 1000) ** 2 - (pair[1] / 1000) ** 2) / (2 * p * p * CL) * 1e9;
        const sh = (v) => `$${+v.toPrecision(3)}$ ns`;
        const o = mcqOptions(r, dt, [dt / 2, dt * 10, dt * 2, L / CL * 1e9], sh);
        return { q: R`${pair[0][0].toUpperCase() + pair[0].slice(1)} and ${pair[2]}, both with momentum $${p}$ GeV/$c$, fly $${L}$ m between timing detectors. The difference in their flight times is about`, ...o,
          sol: R`$t = L\sqrt{p^2 + m^2c^2}/(pc)$. Computing both and subtracting gives $${+dt.toPrecision(3)}$ ns (the light-particle approximation $\Delta t\approx L(m_2^2 - m_1^2)/(2p^2c)$, masses and momentum in GeV, gives $${+approx.toPrecision(3)}$ ns).`,
          trap: 'Both are nearly at $c$; only the mass-dependent correction separates them.' };
      } },
  ],
};
