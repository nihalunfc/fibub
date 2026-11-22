// Extra question shapes for esr-nmr (templates nmr-m31..m35). Imported by esr-nmr.js.
import { int, choose } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'nmr-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Larmor frequency', format: 'statements',
    make(r) {
      const B = choose(r, [1.5, 3, 7.05, 9.4, 11.7, 14.1]), f = 42.577 * B, not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `protons in a ${B} T magnet resonate near ${f.toFixed(0)} MHz`, `protons in a ${B} T magnet resonate near ${(f * 6.2832).toFixed(0)} MHz`, `$f = (\\gamma/2\\pi)B = 42.58\\times${B} = ${f.toFixed(0)}$ MHz; multiplying by $2\\pi$ gives the angular frequency in Mrad/s, not a frequency in MHz.`),
        ['a nucleus needs nonzero spin to show an NMR signal', true, '${}^{12}$C and ${}^{16}$O (spin 0) are NMR-silent.'],
        ['chemical shifts quoted in ppm do not depend on the magnet strength', true, 'Both the shift and the reference frequency scale with $B$.'],
        ['J couplings quoted in Hz do not depend on the magnet strength', true, 'They come from electron-mediated spin-spin interaction, independent of $B_0$.'],
        ['chemical shifts quoted in Hz are the same on every spectrometer', false, 'In Hz the shift grows in proportion to $B_0$; that is why ppm are used.'],
        ['$T_2$ can never exceed $2T_1$', true, 'Energy relaxation also destroys transverse coherence.'],
        ['a spin echo refocuses dephasing caused by a static inhomogeneous field', true, 'The $180^\\circ$ pulse reverses the accumulated phases.'],
        ['${}^{12}$C gives a strong NMR signal in organic samples', false, 'Spin 0: only the 1.1% of ${}^{13}$C is observed.'],
      ], { not });
      return { q: `Which of the following statements about NMR are ${nt(not)}?`, ...m,
        trap: 'Give frequencies in hertz: $f = \\gamma B/2\\pi$, 42.58 MHz/T for protons.' };
    } },
  { id: 'nmr-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'hyperfine',
    make(r) {
      const n = int(r, 2, 4), not = r() < 0.5;
      const m = oneOf(r, [
        [`coupling to ${n} equivalent spin-1/2 nuclei splits an ESR line into ${n + 1} lines`, true, `Total $M_I$ runs from $-${n}/2$ to $${n}/2$: $n + 1 = ${n + 1}$ values.`],
        [`coupling to ${n} equivalent spin-1/2 nuclei gives intensities in the binomial ratio`, true, 'The number of ways to reach each total $M_I$ is a binomial coefficient.'],
        [`coupling to ${n} equivalent spin-1 nuclei gives ${2 * n + 1} lines`, true, `$2nI + 1 = ${2 * n + 1}$.`],
        ['an ESR signal requires unpaired electrons', true, 'Paired electrons have zero net spin.'],
        ['the free-electron $g$ value is about 2.0023', true, 'The anomalous moment makes it slightly above 2.'],
        [`coupling to ${n} equivalent spin-1/2 nuclei splits an ESR line into ${2 ** n} lines`, false, `Equivalent nuclei give coincident lines: only ${n + 1} distinct lines (${2 ** n} would need all couplings different).`],
        [`coupling to ${n} equivalent spin-1 nuclei gives ${n + 1} lines`, false, `$2nI + 1 = ${2 * n + 1}$ for $I = 1$.`],
        ['closed-shell diamagnetic molecules give strong ESR signals', false, 'They have no unpaired electrons.'],
      ], not);
      return { q: `Which statement about ESR spectra is ${nt(not)}?`, ...m,
        trap: 'Equivalent nuclei: $2nI + 1$ lines, not $(2I + 1)^n$.' };
    } },
  { id: 'nmr-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'pulses', format: 'match',
    make(r) {
      const L = { fid: 'a free-induction decay giving the spectrum', t1: 'the spin-lattice relaxation time $T_1$', t2: 'the true transverse relaxation time $T_2$', mas: 'narrow lines from solids (averaging dipolar and anisotropic shifts)', mri: 'spatial position of the spins (imaging)' };
      const cas = choose(r, [
        ['a single $90^\\circ$ pulse followed by acquisition', 'fid', 'Fourier transform of the FID gives the spectrum.'],
        ['$180^\\circ$, wait $\\tau$, $90^\\circ$ (inversion recovery), repeated for many $\\tau$', 't1', '$M_z$ recovers as $1 - 2e^{-\\tau/T_1}$.'],
        ['$90^\\circ$, wait $\\tau$, $180^\\circ$, echo at $2\\tau$, repeated for many $\\tau$ (or a CPMG train)', 't2', 'The echo removes static inhomogeneity, leaving the irreversible $T_2$ decay.'],
        ['spinning the sample fast about an axis at $54.7^\\circ$ to the field', 'mas', '$3\\cos^2\\theta - 1 = 0$ at the magic angle.'],
        ['field gradients switched on during and between pulses', 'mri', 'The Larmor frequency then encodes position.'],
      ]);
      return { q: `The NMR technique "${cas[0]}" is used mainly to obtain`, ...matchOne(r, L, cas),
        trap: 'An FID decays with $T_2^*$; only an echo gives the true $T_2$.' };
    } },
  { id: 'nmr-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Bloch equations', format: 'graph in words',
    make(r) {
      const df = choose(r, [50, 100, 200, 500]), T2 = choose(r, [10, 50, 100]);
      const L = {
        exp: `a smooth exponential decay with time constant $${T2}$ ms and no oscillation`,
        osc: `a decaying oscillation at ${df} Hz, decay time $${T2}$ ms`,
        beat: 'a decaying signal with a beat pattern',
        fast: 'a much faster decay (time $T_2^*$) than the line\'s natural $T_2$',
        flat: 'a constant signal that never decays',
      };
      const cas = choose(r, [
        [`a single Lorentzian line exactly on resonance, natural width set by $T_2 = ${T2}$ ms (homogeneous field)`, 'exp', 'In the rotating frame at resonance the magnetisation does not precess; it just decays with $T_2$. The Fourier transform of an exponential is a Lorentzian.'],
        [`a single line ${df} Hz off resonance with $T_2 = ${T2}$ ms (homogeneous field)`, 'osc', 'In the rotating frame the magnetisation precesses at the offset frequency while it decays.'],
        ['two lines of similar strength at different offsets', 'beat', 'Two frequencies interfere.'],
        ['a single line broadened mostly by an inhomogeneous magnet', 'fast', 'Spins in different parts of the sample dephase quickly: the FID decays with $T_2^* \\lt T_2$.'],
      ]);
      return { q: `In the rotating frame, the FID (detected after a $90^\\circ$ pulse) of ${cas[0]} looks like`, ...matchOne(r, L, cas),
        trap: 'The FID and the spectrum are a Fourier pair: an offset gives an oscillation, a width gives a decay.' };
    } },
  { id: 'nmr-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'populations', format: 'order of magnitude',
    make(r) {
      const [nm, g] = choose(r, [['protons', 42.577e6], ['electrons (ESR)', 28.025e9], ['${}^{13}$C nuclei', 10.708e6]]);
      const B = choose(r, [0.35, 1, 9.4, 14.1]), T = choose(r, [4.2, 77, 300]);
      const x = (6.626e-34 * g * B) / (1.381e-23 * T), o = orderOpts(r, x);
      return { q: `For ${nm} in a field of ${B} T at ${T} K, the ratio $h\\nu/kT$ (which sets the fractional population difference) is about`,
        options: o.options, answer: o.answer,
        sol: `$\\nu = (\\gamma/2\\pi)B = ${sci(g * B)}$ Hz. $h\\nu/kT = (6.63\\times10^{-34})(${sci(g * B)})/[(1.38\\times10^{-23})(${T})] = ${sci(x)}$. The population difference is about half of this, which is why magnetic resonance is a weak-signal technique (much more so for nuclei than electrons).`,
        trap: 'Electron resonance frequencies are about 660 times proton ones in the same field.' };
    } },
];
