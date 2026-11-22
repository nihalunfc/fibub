// Round 4 extras for esr-nmr: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

const GH = 42.577; // proton gamma/2pi, MHz/T
/** Heteronuclei: label, gamma/2pi (MHz/T). */
const HET = [['$^{13}$C', 10.708], ['$^{15}$N', -4.316], ['$^{31}$P', 17.235], ['$^{29}$Si', -8.465], ['$^{2}$H', 6.536]];

export default {
  items: [
    { id: 'nmr-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'ESR basics',
      q: R`An unpaired electron with spectroscopic factor $g$ in a field $B$ absorbs microwaves of frequency $\nu$ when`,
      options: [R`$h\nu = g\mu_NB$`, R`$h\nu = \mu_BB/g$`, R`$\nu = gB$`, R`$h\nu = g\mu_BB$`], answer: 3,
      sol: R`The two spin states $m_s = \pm\tfrac12$ have energies $\pm\tfrac12g\mu_BB$, so the gap is $g\mu_BB$ and resonance needs $h\nu = g\mu_BB$. For $g\approx2$ this is about 28 GHz per tesla. The nuclear magneton $\mu_N$ belongs in the NMR condition.`,
      trap: R`$\mu_N$ is 1836 times smaller than $\mu_B$; using it puts ESR in the NMR range.` },
    { id: 'nmr-r4-02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Larmor frequency', unit: 'MHz',
      q: R`On a spectrometer where protons resonate at $400.0$ MHz, the $^{19}$F nuclei resonate at ______ MHz (one decimal place). Use $\gamma/2\pi = 42.577$ MHz/T for $^1$H and $40.078$ MHz/T for $^{19}$F.`,
      answer: 376.5, tol: 0.15, calc: () => 400 * 40.078 / 42.577,
      sol: R`Same field for both: $B = 400.0/42.577 = 9.395$ T. $\nu_F = 40.078\times9.395 = 376.5$ MHz, or directly $400.0\times40.078/42.577$. Fluorine-19 is almost as sensitive as the proton: spin $\tfrac12$, 100% abundant and a large $\gamma$.`,
      trap: R`Dividing the other way ($400\times42.577/40.078$) gives 424.9 MHz, above the proton frequency.` },
    { id: 'nmr-r4-03', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ESR basics',
      q: R`A Q-band ESR spectrometer works at $35.0$ GHz. A radical with $g = 2.0023$ comes into resonance at a field of about`,
      options: [R`$1.25$ T`, R`$0.34$ T`, R`$2.50$ T`, R`$0.62$ T`], answer: 0,
      sol: R`$B = h\nu/(g\mu_B) = \dfrac{6.626\times10^{-34}\times3.50\times10^{10}}{2.0023\times9.274\times10^{-24}} = \dfrac{2.319\times10^{-23}}{1.857\times10^{-23}} = 1.25$ T. (At X-band, 9.5 GHz, the same radical needs 0.34 T.) Higher frequency spreads out lines with different $g$ in field, which is why high-field ESR resolves small $g$ differences.`,
      trap: R`0.34 T is the familiar X-band field; the field scales with frequency.` },
    { id: 'nmr-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'relaxation', unit: 's',
      q: R`After a $90^\circ$ pulse, $M_z$ recovers as $M_0(1 - e^{-t/T_1})$. For a sample with $T_1 = 1.20$ s, the time needed for $M_z$ to reach $99\%$ of $M_0$ is ______ s (two decimal places).`,
      answer: 5.53, tol: 0.02, calc: () => 1.2 * Math.log(100),
      sol: R`$1 - e^{-t/T_1} = 0.99\Rightarrow e^{-t/T_1} = 0.01\Rightarrow t = T_1\ln100 = 4.605\times1.20 = 5.53$ s. This "five $T_1$" rule is why quantitative NMR spectra need long gaps between scans.`,
      trap: R`Using $t = 0.99\,T_1$ treats the recovery as linear.` },
    { id: 'nmr-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quadrupolar nuclei',
      q: R`NMR lines of $^{14}$N ($I = 1$) in liquids are usually much broader than those of $^{15}$N ($I = \tfrac12$). The main reason is that`,
      options: [R`$^{14}$N has the larger gyromagnetic ratio, which spreads its lines`, R`$^{14}$N is rare in nature`,
        R`a nucleus with $I\ge1$ has an electric quadrupole moment, which couples to fluctuating electric field gradients and relaxes it very fast`, R`$^{14}$N has no magnetic moment`], answer: 2,
      sol: R`Nuclei with $I\ge1$ are not spherical: they carry an electric quadrupole moment. In a molecule the electric field gradient at the nucleus changes as the molecule tumbles, giving very efficient relaxation, short $T_2$ and broad lines ($\Delta\nu = 1/\pi T_2$). Spin-$\tfrac12$ nuclei have no quadrupole moment. $^{14}$N is in fact 99.6% abundant, and its $|\gamma|$ (3.08 MHz/T) is smaller than that of $^{15}$N (4.32 MHz/T); a small $\gamma$ lowers sensitivity but does not broaden lines.`,
      trap: R`Abundance affects signal strength, not line width.` },
    { id: 'nmr-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'MRI', format: 'statements',
      q: R`Which statements about magnetic resonance imaging (MRI) are correct?`,
      options: [R`A linear field gradient makes the proton resonance frequency depend on position`,
        R`T$_1$-weighted images use a short repetition time between excitations`,
        R`Most of the signal comes from protons in water and fat`,
        R`A stronger main field raises the proton's gyromagnetic ratio`], answer: [0, 1, 2],
      sol: R`With $B = B_0 + Gx$, $\nu = \tfrac{\gamma}{2\pi}(B_0 + Gx)$, so frequency encodes $x$. With a short repetition time, tissues with long $T_1$ have not recovered and look dark, giving $T_1$ contrast. Mobile water and fat protons give sharp, strong signals. $\gamma$ is a fixed property of the nucleus; a higher field raises the frequency and the polarisation, not $\gamma$.`,
      trap: R`$\gamma$ is a constant of the nucleus; only $\nu = \gamma B/2\pi$ grows with field.` },
    { id: 'nmr-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'g anisotropy', unit: 'mT',
      q: R`A frozen solution of a Cu$^{2+}$ complex has $g_\parallel = 2.30$ and $g_\perp = 2.06$. At an X-band frequency of $9.50$ GHz, ignoring hyperfine structure, its powder spectrum spreads over a field range of ______ mT (one decimal place). Use $h = 6.626\times10^{-34}$ J s, $\mu_B = 9.274\times10^{-24}$ J/T.`,
      answer: 34.4, tol: 0.2, calc: () => (6.62607015e-34 * 9.5e9 / 9.2740100783e-24) * (1 / 2.06 - 1 / 2.30) * 1e3,
      sol: R`$h\nu/\mu_B = 6.626\times10^{-34}\times9.50\times10^9/9.274\times10^{-24} = 0.6788$ T. Molecules with the field along their axis resonate at $0.6788/2.30 = 0.2951$ T; those with the field perpendicular at $0.6788/2.06 = 0.3295$ T. All other orientations lie in between, so the spectrum covers $329.5 - 295.1 = 34.4$ mT.`,
      trap: R`The larger $g$ resonates at the lower field: $B\propto1/g$.` },
    { id: 'nmr-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'polarisation transfer',
      q: R`In dynamic nuclear polarisation (DNP), microwaves transfer the large electron spin polarisation to nearby protons. In the best case the proton polarisation can be raised above its thermal value by a factor of about`,
      options: [R`$1836$`, R`$658$`, R`$42.6$`, R`$4$`], answer: 1,
      sol: R`At the same field and temperature, thermal polarisation is proportional to $\gamma$ (high-temperature limit). The electron's $|\gamma_e|$ is about 658 times the proton's, so if the electron polarisation could be handed over completely the proton polarisation would rise by $\gamma_e/\gamma_p\approx658$. ($1836$ is $m_p/m_e$; the magnetic moments differ by the smaller factor because the proton's $g$ factor is 5.59.)`,
      trap: R`The ratio of magnetic moments is not the mass ratio 1836: the proton's $g_p = 5.59$ cuts it to about 658.` },
    { id: 'nmr-r4-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'MRI', unit: 'mm',
      q: R`An MRI scanner selects a slice with a radio-frequency pulse of bandwidth $1.00$ kHz while a gradient of $10.0$ mT/m is applied across the slice. The slice thickness is ______ mm (two decimal places). Use $\gamma/2\pi = 42.58$ MHz/T for protons.`,
      answer: 2.35, tol: 0.02, calc: () => 1000 / (42.58e6 * 0.010) * 1e3,
      sol: R`With the gradient on, the resonance frequency changes by $\tfrac{\gamma}{2\pi}G = 42.58\times10^6\times0.0100 = 4.258\times10^5$ Hz per metre. Only protons whose frequency falls inside the pulse's 1.00 kHz band are excited: $\Delta z = 1000/4.258\times10^5 = 2.35\times10^{-3}$ m $= 2.35$ mm. A steeper gradient or a narrower band gives a thinner slice.`,
      trap: R`Using $\gamma$ in rad s$^{-1}$ T$^{-1}$ with a bandwidth in Hz gives a slice $2\pi$ times too thin.` },
    { id: 'nmr-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'triplet states',
      q: R`The ESR spectrum of randomly oriented triplet molecules ($S = 1$) with zero-field splitting shows, besides the main lines near $g\approx2$, a weak line at about half the resonance field ($g_\text{eff}\approx4$). This line is`,
      options: [R`a nuclear hyperfine line`, R`a second harmonic of the microwave source`, R`the $\Delta M_S = \pm2$ transition, made weakly allowed because the zero-field splitting mixes the $M_S$ states`, R`a doublet-state impurity`], answer: 2,
      sol: R`For $S = 1$ the $M_S = -1$ and $+1$ levels are $2g\mu_BB$ apart, so a single photon can bridge them at half the field of the $\Delta M_S = \pm1$ lines. Strictly it is forbidden, but the zero-field interaction mixes $M_S$ states when the field is not along a principal axis, so it appears weakly. Because it is nearly isotropic, this "half-field" line is a standard fingerprint of triplets and biradicals.`,
      trap: R`$g_\text{eff}\approx4$ does not mean a different electron $g$ factor; it is a two-quantum-of-$M_S$ jump.` },
    { id: 'nmr-r4-11', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'nuclear Overhauser effect', format: 'statements',
      q: R`When the protons of a molecule are saturated, the signal of a nearby heteronucleus X changes (the nuclear Overhauser effect). With dipolar relaxation and fast tumbling, the largest change multiplies the X signal by $1 + \gamma_H/(2\gamma_X)$. Which statements are correct?`,
      options: [R`The effect needs a scalar ($J$) coupling between the two nuclei`, R`For $^{13}$C the signal can grow by a factor of nearly 3`,
        R`The effect comes from cross-relaxation through the dipole-dipole coupling`, R`For $^{15}$N, whose $\gamma$ is negative, the signal can turn negative`], answer: [1, 2, 3],
      sol: R`$1 + 42.58/(2\times10.71) = 2.99$ for $^{13}$C. For $^{15}$N, $1 + 42.58/(2\times(-4.32)) = -3.93$: the signal is inverted. The transfer is through cross-relaxation driven by the through-space dipolar interaction (which falls as $r^{-6}$), not through $J$ coupling; that is why NOE measurements give distances.`,
      trap: R`NOE works through space; $J$ coupling works through bonds.` },
    { id: 'nmr-r4-12', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'chemical shift',
      q: R`In proton NMR, tetramethylsilane (TMS) is added to samples because`,
      options: [R`its single sharp line defines $\delta = 0$, from which chemical shifts are measured`, R`it removes water from the sample`,
        R`it raises the magnetic field`, R`it shortens the relaxation times`], answer: 0,
      sol: R`TMS has twelve equivalent, well shielded protons that give one strong line at the high-field (low-frequency) end of most spectra. Defining $\delta = (\nu - \nu_\text{TMS})/\nu_\text{TMS}\times10^6$ ppm makes shifts independent of the spectrometer's field. It is chemically inert and volatile, so it is easy to remove.`,
      trap: R`Chemical shifts are relative to a reference; TMS does not change the field.` },
  ],
  gens: [
    { id: 'nmr-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'MRI',
      make(r) {
        const bw = pick(r, 0.5, 4, 0.1), G = pick(r, 5, 40, 1);
        const dz = bw * 1e3 / (GH * 1e6 * G * 1e-3) * 1e3;
        return { q: R`An MRI slice is selected with an RF pulse of bandwidth $${bw}$ kHz in a gradient of $${G}$ mT/m. With $\gamma/2\pi = 42.58$ MHz/T for protons, the slice thickness is ______ mm (two decimal places).`,
          answer: round(dz, 2), tol: Math.max(0.01, round(dz * 0.005, 2)), unit: 'mm', bw, G,
          sol: R`Frequency gradient $= 42.58\ \text{MHz/T}\times${G}\ \text{mT/m} = ${round(GH * G * 1e-3, 4)}$ MHz/m. $\Delta z = ${bw}\ \text{kHz}/${round(GH * G * 1e-3, 4)}\ \text{MHz/m} = ${round(dz, 2)}$ mm.`,
          trap: 'Mixing kHz with MHz, or mT with T, shifts the answer by a factor of 1000.' };
      },
      verify: (p) => p.bw * 1e3 / (42.577e6 * p.G * 1e-3) * 1e3 },
    { id: 'nmr-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'relaxation',
      make(r) {
        const T1 = pick(r, 0.2, 3, 0.05), f = choose(r, [0.5, 0.9, 0.95, 0.99, 0.999]), inv = r() < 0.5;
        const t = inv ? -T1 * Math.log((1 - f) / 2) : -T1 * Math.log(1 - f);
        return { q: inv
          ? R`After a $180^\circ$ pulse, $M_z = M_0(1 - 2e^{-t/T_1})$. With $T_1 = ${T1}$ s, $M_z$ reaches $${f * 100}\%$ of $M_0$ after ______ s (two decimal places).`
          : R`After a $90^\circ$ pulse, $M_z = M_0(1 - e^{-t/T_1})$. With $T_1 = ${T1}$ s, $M_z$ reaches $${f * 100}\%$ of $M_0$ after ______ s (two decimal places).`,
          answer: round(t, 2), tol: Math.max(0.01, round(t * 0.005, 2)), unit: 's', T1, f, inv,
          sol: inv
            ? R`$1 - 2e^{-t/T_1} = ${f}\Rightarrow e^{-t/T_1} = ${round((1 - f) / 2, 5)}\Rightarrow t = T_1\ln${round(2 / (1 - f), 1)} = ${round(t, 2)}$ s. Starting from $-M_0$ takes $T_1\ln2$ longer than starting from zero.`
            : R`$e^{-t/T_1} = ${round(1 - f, 4)}\Rightarrow t = T_1\ln${round(1 / (1 - f), 1)} = ${round(t, 2)}$ s.`,
          trap: inv ? 'After inversion M_z starts at -M_0, hence the factor 2.' : 'Recovery is exponential, not linear.' };
      },
      verify: (p) => (p.inv ? -p.T1 * Math.log((1 - p.f) / 2) : -p.T1 * Math.log(1 - p.f)) },
    { id: 'nmr-r4g3', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'nuclear Overhauser effect',
      make(r) {
        const [X, g] = choose(r, HET);
        const ok = 1 + GH / (2 * g);
        const f = (v) => `$${round(v, 2)}$`;
        const o = mcqOptions(r, round(ok, 2), [round(1 + g / (2 * GH), 2), round(1 + GH / g, 2), round(Math.abs(ok), 2) === round(ok, 2) ? round(GH / (2 * g), 2) : round(Math.abs(ok), 2), round(GH / g, 2)], (v) => f(v));
        return { q: R`For ${X} ($\gamma/2\pi = ${g}$ MHz/T) observed while the protons ($42.577$ MHz/T) are saturated, in the extreme-narrowing, purely dipolar limit, the full NOE factor (${X} signal with the protons saturated divided by the signal without) is`, ...o,
          sol: R`Maximum NOE factor $= 1 + \dfrac{\gamma_H}{2\gamma_X} = 1 + \dfrac{42.577}{2\times(${g})} = ${round(ok, 2)}$.${g < 0 ? ' The negative gamma makes the factor negative: the signal is inverted (and can even vanish for some mixtures of relaxation paths).' : ''}`,
          trap: 'The ratio is gamma of the saturated spin over twice gamma of the observed spin, with sign.' };
      } },
  ],
};
