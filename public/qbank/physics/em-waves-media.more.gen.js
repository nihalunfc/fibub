// Extra question shapes for em-waves-media (templates emm-m31..m35). Imported by em-waves-media.js.
import { choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'emm-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'good conductors', format: 'statements',
    make(r) {
      const k = choose(r, [4, 9, 16, 25]), s = Math.sqrt(k), not = r() < 0.5;
      const m = msqOf(r, [
        [`raising the frequency ${k}-fold makes the skin depth $${s}$ times smaller`, true, `$\\delta = \\sqrt{2/\\mu\\sigma\\omega} \\propto \\omega^{-1/2}$, so it falls by $\\sqrt{${k}} = ${s}$.`],
        [`raising the frequency ${k}-fold makes the skin depth ${k} times smaller`, false, `$\\delta \\propto \\omega^{-1/2}$: the factor is $\\sqrt{${k}} = ${s}$, not ${k}.`],
        ['the magnetic field lags the electric field by $45^\\circ$', true, 'The wavenumber $k = (1 + i)/\\delta$ has phase $\\pi/4$.'],
        ['most of the wave\'s energy inside is magnetic', true, '$|B|/|E| = |k|/\\omega \\gg 1/c$, so $B^2/\\mu \\gg \\varepsilon E^2$.'],
        ['the wavelength inside equals $2\\pi\\delta$', true, '$\\mathrm{Re}\\,k = 1/\\delta$, so $\\lambda = 2\\pi\\delta$: the wave dies within about one wavelength.'],
        ['the phase velocity inside is larger than $c$', false, '$v_p = \\omega\\delta$, far below $c$ in a good conductor.'],
        ['a perfect conductor ($\\sigma \\to \\infty$) has an infinite skin depth', false, '$\\delta \\to 0$: fields cannot enter at all.'],
      ], { not });
      return { q: `An electromagnetic wave enters a good conductor ($\\sigma \\gg \\varepsilon\\omega$). Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Skin depth goes as $1/\\sqrt{\\sigma\\omega}$, and $E$ and $B$ are $45^\\circ$ out of phase inside.' };
    } },
  { id: 'emm-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dispersion', format: 'match',
    make(r) {
      const L = {
        same: '$v_p = v_g = c$ for every frequency',
        plasma: '$v_p \\gt c$ and $v_g \\lt c$ with $v_pv_g = c^2$; no propagation below a cutoff',
        normal: '$v_g \\lt v_p \\lt c$ (normal dispersion)',
        anom: '$v_g$ can exceed $c$ or turn negative while the signal speed stays at most $c$',
        cond: '$v_p = \\sqrt{2\\omega/\\mu\\sigma}$, far below $c$ and growing as $\\sqrt\\omega$',
      };
      const cas = choose(r, [
        ['vacuum', 'same', '$\\omega = ck$: no dispersion.'],
        ['a collisionless plasma, $\\omega^2 = \\omega_p^2 + c^2k^2$', 'plasma', '$v_p = \\omega/k \\gt c$, $v_g = d\\omega/dk = c^2k/\\omega \\lt c$; below $\\omega_p$, $k$ is imaginary.'],
        ['glass at visible frequencies, away from absorption lines', 'normal', '$n$ rises with $\\omega$, so $v_g = c/(n + \\omega\\,dn/d\\omega) \\lt v_p = c/n$.'],
        ['a medium near the centre of a strong absorption line', 'anom', 'There $dn/d\\omega \\lt 0$, so the formula for $v_g$ breaks down as a signal speed; absorption reshapes the pulse.'],
        ['a good conductor', 'cond', '$k = (1 + i)/\\delta$ with $\\delta = \\sqrt{2/\\mu\\sigma\\omega}$, so $v_p = \\omega\\delta$.'],
      ]);
      return { q: `For electromagnetic waves in ${cas[0]}, the phase and group velocities behave as follows:`, ...matchOne(r, L, cas),
        trap: 'Phase velocity may exceed $c$; information (the front of a signal) never does.' };
    } },
  { id: 'emm-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'plasmas', format: 'limiting case',
    make(r) {
      const n = choose(r, [1e10, 1e11, 1e12, 4e12]), fp = 8.98 * Math.sqrt(n), f = choose(r, [0.5, 2, 5, 20]) * fp;
      const fs = (x) => (x >= 1e9 ? `${round(x / 1e9, 2)} GHz` : `${round(x / 1e6, 2)} MHz`);
      const refl = f < fp, ans = refl ? 'it is reflected; the field decays into the layer' : 'it passes through, with phase velocity above $c$';
      const o = mcqOptions(r, ans, shuffle(r, [refl ? 'it passes through, with phase velocity above $c$' : 'it is reflected; the field decays into the layer', 'it passes through unchanged, as in vacuum', 'it is absorbed completely at the surface', 'it passes through, with phase velocity below $c$']));
      const ns = `${n / 10 ** Math.floor(Math.log10(n)) === 1 ? '' : `${n / 10 ** Math.floor(Math.log10(n))}\\times`}10^{${Math.floor(Math.log10(n))}}`;
      return { q: `A radio wave of frequency ${fs(f)} meets a thick ionospheric layer with electron density $${ns}$ m$^{-3}$. What happens?`, ...o,
        sol: `The plasma frequency is $f_p \\approx 9\\sqrt{n}$ Hz $= ${fs(fp)}$. Here $f ${refl ? '\\lt' : '\\gt'} f_p$, so $k^2 = (\\omega^2 - \\omega_p^2)/c^2$ is ${refl ? 'negative: the wave is evanescent and is reflected' : 'positive: the wave propagates with $v_p = c/\\sqrt{1 - f_p^2/f^2} \\gt c$'}.`,
        trap: 'Below the plasma frequency a plasma reflects; above it, it is transparent (this is why AM radio bounces and satellite links get through).' };
    } },
  { id: 'emm-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'skin depth', format: 'order of magnitude',
    make(r) {
      const C = choose(r, [
        ['copper', 5.96e7, 50, '50 Hz'], ['copper', 5.96e7, 1e6, '1 MHz'], ['copper', 5.96e7, 1e9, '1 GHz'],
        ['sea water', 4, 1e3, '1 kHz'], ['sea water', 4, 1e6, '1 MHz'], ['aluminium', 3.5e7, 1e4, '10 kHz'],
      ]);
      const [mat, sig, f, fsn] = C, d = Math.sqrt(2 / (4e-7 * Math.PI * sig * 2 * Math.PI * f)), o = orderOpts(r, d, '\\text{m}');
      return { q: `The skin depth for a ${fsn} wave in ${mat} ($\\sigma \\approx ${sig >= 100 ? `${round(sig / 1e7, 2)}\\times10^7` : sig}$ S/m, $\\mu \\approx \\mu_0$) is of order`, ...o,
        sol: `$\\delta = \\sqrt{\\dfrac{2}{\\mu_0\\sigma\\omega}} = \\sqrt{\\dfrac{2}{4\\pi\\times10^{-7}\\times${sig >= 100 ? `${round(sig / 1e7, 2)}\\times10^7` : sig}\\times2\\pi\\times${f >= 1e3 ? `10^{${Math.log10(f)}}` : f}}} \\approx ${(d / 10 ** o.n).toFixed(1)}\\times10^{${o.n}}$ m.`,
        trap: '$\\delta \\propto 1/\\sqrt{\\sigma f}$: copper at mains frequency is about a centimetre, at GHz about a micrometre.' };
    } },
  { id: 'emm-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'waves in media', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['in a linear lossless dielectric $E/B = c/n$', true, '$v = 1/\\sqrt{\\mu\\varepsilon} = c/n$.'],
        ['the intensity of a plane wave in a dielectric is $\\tfrac12 v\\varepsilon E_0^2$', true, 'Energy density times speed.'],
        ['a wave in a poor conductor is attenuated over many wavelengths', true, 'There $\\kappa \\ll k$.'],
        ['the refractive index of a dilute gas can be below 1 just above a resonance', true, 'Anomalous dispersion pushes $n - 1$ negative above $\\omega_0$.'],
        ['$\\vec E$ and $\\vec B$ are in phase inside a good conductor', false, '$\\vec B$ lags by $45^\\circ$.'],
        ['the group velocity in a dielectric with normal dispersion is larger than the phase velocity', false, 'With $dn/d\\omega \\gt 0$, $v_g \\lt v_p$.'],
        ['a plasma transmits all frequencies below its plasma frequency', false, 'It reflects them; only $\\omega \\gt \\omega_p$ propagates.'],
      ], not);
      return { q: `Which statement about electromagnetic waves in matter is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Conductors: fields decay and $B$ lags $E$. Plasmas: cutoff at $\\omega_p$.' };
    } },
];
