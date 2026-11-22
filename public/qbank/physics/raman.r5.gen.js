// Round 5 extras for raman: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;

const KT = 0.6950348; // k/hc in cm^-1 per K
const stokesNm = (L, s) => 1e7 / (1e7 / L - s);

export default {
  items: [
    { id: 'rmn-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'mutual exclusion',
      q: R`The rule of mutual exclusion (no vibration is both infrared and Raman active) applies to which molecule?`,
      options: [R`CO$_2$`, R`H$_2$O`, R`NH$_3$`, R`CH$_4$`], answer: 0,
      sol: R`The rule holds only for molecules with a centre of inversion: every mode is then either even (g, Raman) or odd (u, infrared). Linear O=C=O has one. Bent H$_2$O, pyramidal NH$_3$ and tetrahedral CH$_4$ have none (CH$_4$ is highly symmetric but has no inversion centre), and some of their modes are both IR and Raman active.`,
      trap: R`High symmetry is not enough: the rule needs an inversion centre specifically.` },
    { id: 'rmn-r5-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Stokes and anti-Stokes',
      q: R`The diamond Raman band is at $1332$ cm$^{-1}$. Ignoring the $\nu^4$ factor, the ratio of anti-Stokes to Stokes intensity at $300$ K ($kT/hc = 208.5$ cm$^{-1}$) is $k\times10^{-3}$ with $k = $ ______ (two decimal places).`,
      answer: 1.68, tol: 0.02, calc: () => Math.exp(-1332 / 208.5) * 1e3,
      sol: R`Anti-Stokes light comes from molecules (or phonons) already in the excited level, so the ratio follows the Boltzmann factor $e^{-1332/208.5} = e^{-6.388} = 1.68\times10^{-3}$. Diamond's anti-Stokes line is almost invisible at room temperature.`,
      trap: R`The anti-Stokes line is weaker, so the ratio is far below 1; $e^{+6.39}$ is upside down.` },
    { id: 'rmn-r5-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Raman thermometry', unit: 'K',
      q: R`A silicon wafer under a laser shows its $520$ cm$^{-1}$ phonon band with an anti-Stokes to Stokes intensity ratio of $0.25$ (after correcting for the $\nu^4$ factor and the detector). The local temperature is ______ K (to the nearest kelvin; $k/hc = 0.695$ cm$^{-1}$/K).`,
      answer: 540, tol: 3, calc: () => 520 / (0.695 * Math.log(4)),
      sol: R`$I_{aS}/I_S = e^{-hc\tilde\nu/kT} = 0.25$, so $kT/hc = 520/\ln4 = 520/1.386 = 375.1$ cm$^{-1}$ and $T = 375.1/0.695 = 540$ K. The laser itself is heating the wafer well above room temperature, which this ratio reveals.`,
      trap: R`Using $\log_{10}$ instead of $\ln$ gives about 1240 K.` },
    { id: 'rmn-r5-04', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'rotational Raman', unit: 'cm⁻¹',
      q: R`In the pure rotational Raman spectrum of a linear molecule, the first Stokes line is $11.50$ cm$^{-1}$ from the exciting line and the next lines follow every $7.67$ cm$^{-1}$. The rotational constant $B$ is ______ cm$^{-1}$ (two decimal places).`,
      answer: 1.92, tol: 0.01, calc: () => 11.5 / 6,
      sol: R`$\Delta J = +2$ lines sit at $4B(J + \tfrac32)$ from the laser: first ($J = 0$) at $6B$, then every $4B$. $6B = 11.50$ gives $B = 1.917$; $4B = 7.67$ agrees. So $B = 1.92$ cm$^{-1}$.`,
      trap: R`Microwave lines are $2B$ apart; Raman lines with $\Delta J = 2$ are $4B$ apart and start at $6B$.` },
    { id: 'rmn-r5-05', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'depolarisation ratio', format: 'statements',
      q: R`With linearly polarised excitation and $90^\circ$ collection, which statements about the depolarisation ratio $\rho$ of Raman bands of molecules in a liquid are correct?`,
      options: [R`A non-totally-symmetric vibration has $\rho = \tfrac34$`, R`A totally symmetric vibration has $0\le\rho<\tfrac34$`,
        R`The strong $459$ cm$^{-1}$ band of CCl$_4$ (its symmetric breathing mode) is polarised, with $\rho$ near 0`,
        R`A measured $\rho = 0.9$ identifies a totally symmetric mode`], answer: [0, 1, 2],
      sol: R`For randomly oriented molecules $\rho = \dfrac{3\gamma^2}{45a^2 + 4\gamma^2}$, with $a$ the mean polarisability change and $\gamma$ its anisotropy. Non-totally-symmetric modes have $a = 0$, so $\rho = \tfrac34$ exactly ("depolarised"). Totally symmetric modes have $a\ne0$, so $\rho<\tfrac34$; a breathing mode of a tetrahedral molecule has $\gamma = 0$, $\rho\approx0$. With linearly polarised light $\rho$ can never exceed $\tfrac34$.`,
      trap: R`For linear polarisation the ceiling is $\tfrac34$; $\tfrac67$ applies to unpolarised (natural) excitation.` },
    { id: 'rmn-r5-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Stokes and anti-Stokes',
      q: R`A band at $1000$ cm$^{-1}$ is excited at $532$ nm ($18\,797$ cm$^{-1}$) at $300$ K ($kT/hc = 208.5$ cm$^{-1}$). Including the $\nu^4$ scattering factor, $I_{aS}/I_S = \left(\dfrac{\tilde\nu_0 + \tilde\nu}{\tilde\nu_0 - \tilde\nu}\right)^4e^{-hc\tilde\nu/kT}$ equals $k\times10^{-3}$ with $k = $ ______ (one decimal place).`,
      answer: 12.6, tol: 0.15, calc: () => (19797 / 17797) ** 4 * Math.exp(-1000 / 208.5) * 1e3,
      sol: R`Step 1: $(19\,797/17\,797)^4 = 1.1124^4 = 1.531$. Step 2: $e^{-1000/208.5} = e^{-4.796} = 8.26\times10^{-3}$. Product: $1.531\times8.26\times10^{-3} = 1.26\times10^{-2}$, so $k = 12.6$. The $\nu^4$ factor favours the bluer anti-Stokes light by about 50% here.`,
      trap: R`Leaving out the $\nu^4$ factor gives $8.3$, a 35% error.` },
    { id: 'rmn-r5-07', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'experimental Raman',
      q: R`Raman spectra of coloured or biological samples are often taken with $785$ nm or $1064$ nm lasers instead of $532$ nm. The main reason is that`,
      options: [R`Raman shifts are larger with red light`, R`the red photons are less likely to cause fluorescence, which can swamp the weak Raman signal`,
        R`Raman scattering is stronger at longer wavelength`, R`infrared light is needed to see vibrational transitions`], answer: 1,
      sol: R`A green photon often has enough energy to reach an electronic absorption of the sample, and the fluorescence that follows is millions of times stronger than Raman scattering. Red or near-infrared photons excite far less fluorescence. The price: Raman intensity falls as $\nu^4$, so the signal is weaker. The shift itself does not depend on the laser.`,
      trap: R`Raman is a scattering process: the laser need not match any vibration, and the shift is the same for every laser.` },
    { id: 'rmn-r5-08', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Raman shift', unit: 'nm',
      q: R`Graphite-like carbon shows bands at $1580$ and $1600$ cm$^{-1}$. With a $632.8$ nm laser, the wavelength separation between the two Stokes lines is ______ nm (two decimal places).`,
      answer: 0.99, tol: 0.01, calc: () => 1e7 / (1e7 / 632.8 - 1600) - 1e7 / (1e7 / 632.8 - 1580),
      sol: R`$\tilde\nu_0 = 10^7/632.8 = 15\,802.8$ cm$^{-1}$. Stokes lines: $14\,222.8$ cm$^{-1}$ ($703.10$ nm) and $14\,202.8$ cm$^{-1}$ ($704.09$ nm). Separation $0.99$ nm. Quick check: $\Delta\lambda\approx\lambda^2\Delta\tilde\nu = (703.6\times10^{-7}\ \text{cm})^2\times20 = 0.99$ nm.`,
      trap: R`Using the laser wavelength ($\lambda_0^2\Delta\tilde\nu = 0.80$ nm) instead of the Stokes wavelength underestimates the gap.` },
    { id: 'rmn-r5-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'phonons',
      q: R`The optical phonon of crystalline silicon gives a Raman band at $520.7$ cm$^{-1}$. Which change moves this band to a HIGHER wavenumber?`,
      options: [R`Heating the sample`, R`Tensile (stretching) strain in the film`, R`Compressive strain in the film`, R`Using a longer laser wavelength`], answer: 2,
      sol: R`Squeezing the lattice shortens the bonds, stiffens them (anharmonic potential) and raises the phonon frequency; stretching does the opposite. Heating expands the lattice and adds anharmonic damping, lowering and broadening the band. The laser wavelength does not change a Raman shift. This is how Raman maps strain in transistors.`,
      trap: R`Raman shifts are properties of the material, not of the laser.` },
    { id: 'rmn-r5-10', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'phonons',
      q: R`Which of these crystals show a first-order Raman spectrum (one-phonon Raman bands)?`,
      options: [R`Silicon (diamond structure)`, R`Sodium chloride (rock salt)`, R`Caesium chloride`, R`Graphite`], answer: [0, 3],
      sol: R`In rock salt and CsCl every atom sits at a centre of inversion, so each zone-centre optical phonon is odd (u) and Raman inactive; their Raman spectra are only weak second-order (two-phonon) bands. Silicon has two atoms per cell related by inversion about the bond centre; its optical phonon is even ($T_{2g}$) and Raman active (the $520$ cm$^{-1}$ band). Graphite's $E_{2g}$ mode gives the G band near $1580$ cm$^{-1}$.`,
      trap: R`Ionic crystals with strong infrared absorption are not automatically Raman active; with inversion symmetry it is one or the other.` },
  ],
  gens: [
    { id: 'rmn-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Raman thermometry',
      make(r) {
        const s = choose(r, [218, 314, 459, 520, 802, 992, 1332]), ratio = pick(r, 0.02, 0.6, 0.01);
        const T = s / (KT * Math.log(1 / ratio)), v = Math.round(T);
        return { q: R`A Raman band at $${s}$ cm$^{-1}$ shows an anti-Stokes to Stokes intensity ratio of $${ratio}$ after the $\nu^4$ and detector corrections. The sample temperature is ______ K (to the nearest kelvin; $k/hc = 0.695$ cm$^{-1}$/K).`,
          answer: v, tol: Math.max(2, Math.round(T * 0.01)), unit: 'K', s, ratio,
          sol: R`$I_{aS}/I_S = e^{-hc\tilde\nu/kT}$, so $kT/hc = \dfrac{${s}}{\ln(1/${ratio})} = ${round(s / Math.log(1 / ratio), 1)}$ cm$^{-1}$ and $T = ${round(s / Math.log(1 / ratio), 1)}/0.695 = ${v}$ K.`,
          trap: 'Use the natural logarithm, and the ratio must be below 1.' };
      },
      verify: (p) => p.s / (KT * Math.log(1 / p.ratio)) },
    { id: 'rmn-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Stokes and anti-Stokes',
      make(r) {
        const L = choose(r, [325, 488, 514.5, 532, 632.8, 785, 1064]), s = choose(r, [218, 459, 520, 1000, 1332, 1580]), T = choose(r, [200, 300, 500, 800]);
        const n0 = 1e7 / L, f = ((n0 + s) / (n0 - s)) ** 4, b = Math.exp(-s / (KT * T)), x = f * b, v = +x.toPrecision(3);
        return { q: R`A Raman band at $${s}$ cm$^{-1}$ is excited at $${L}$ nm, with the sample at $${T}$ K. Including the $\nu^4$ factor, the anti-Stokes to Stokes intensity ratio $\left(\dfrac{\tilde\nu_0 + \tilde\nu}{\tilde\nu_0 - \tilde\nu}\right)^4e^{-hc\tilde\nu/kT}$ is ______ (three significant figures; $k/hc = 0.695$ cm$^{-1}$/K).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), L, s, T,
          sol: R`$\tilde\nu_0 = 10^7/${L} = ${round(n0, 1)}$ cm$^{-1}$. $\nu^4$ factor: $(${round(n0 + s, 1)}/${round(n0 - s, 1)})^4 = ${round(f, 4)}$. Boltzmann factor: $e^{-${s}/${round(KT * T, 1)}} = ${+b.toPrecision(4)}$. Ratio $= ${v}$.`,
          trap: 'The nu^4 factor matters more for large shifts and short laser wavelengths.' };
      },
      verify: (p) => { const n0 = 1e7 / p.L; return ((n0 + p.s) / (n0 - p.s)) ** 4 * Math.exp(-p.s / (KT * p.T)); } },
    { id: 'rmn-r5g3', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Raman shift',
      make(r) {
        const L = choose(r, [488, 514.5, 532, 632.8, 785]), s1 = pick(r, 200, 3000, 10), d = pick(r, 5, 60, 1), s2 = s1 + d;
        const x = stokesNm(L, s2) - stokesNm(L, s1), v = round(x, 2);
        return { q: R`Two Raman bands at $${s1}$ and $${s2}$ cm$^{-1}$ are excited with a $${L}$ nm laser. The wavelength separation of their Stokes lines is ______ nm (two decimal places).`,
          answer: v, tol: Math.max(0.01, round(x * 0.01, 3)), unit: 'nm', L, s1, s2,
          sol: R`$\tilde\nu_0 = ${round(1e7 / L, 1)}$ cm$^{-1}$. Stokes lines at $${round(1e7 / L - s1, 1)}$ and $${round(1e7 / L - s2, 1)}$ cm$^{-1}$, that is $${round(stokesNm(L, s1), 3)}$ and $${round(stokesNm(L, s2), 3)}$ nm. Separation $${v}$ nm.`,
          trap: 'Equal Raman shifts do not give equal wavelength gaps: convert each line separately.' };
      },
      verify: (p) => stokesNm(p.L, p.s2) - stokesNm(p.L, p.s1) },
  ],
};
