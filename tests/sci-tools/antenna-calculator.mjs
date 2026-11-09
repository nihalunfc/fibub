// #632 Antenna calculator. Patch checked against an independent scipy implementation (scipy.integrate.quad and
// scipy.special.j0 for G1 and G12) for three boards, and against Balanis, Antenna Theory (3rd ed.), examples 14.1 to 14.3
// (10 GHz, εr 2.2, h 1.588 mm: W 1.186 cm, εeff 1.972, ΔL 0.081 cm, L 0.906 cm, Rin about 228.3 Ω, inset about 0.3126 cm).
import { patch, dipole, monopole, yagi, besselJ0, wavelength, C0 } from '../../src/lib/sci/eng-antenna.ts';

const REF = {"b": {"W": 0.01185033740775459, "ee": 1.97152910176456, "dL": 0.0008110462348916796, "L": 0.00905342931758273, "G1": 0.0015724309996055816, "G12": 0.0006167520011340352, "R": 228.39570736255249, "y0": 0.003123572529438895}, "fr4": {"W": 0.03723426118288438, "ee": 4.080857521554887, "dL": 0.0007385985573076747, "L": 0.028809290261854397, "G1": 0.0009692854963392674, "G12": 0.0005861986292418048, "R": 321.4433318714958, "y0": 0.01068691411734902}, "ro": {"W": 0.01746387669248776, "ee": 3.143178445120708, "dL": 0.00039012092271770187, "L": 0.013797095186990349, "G1": 0.0011789892355055778, "G12": 0.0005981384692769382, "R": 281.3528811994914, "y0": 0.004515895569817338}, "j0": [0.938469807240813, 0.22389077914123562, 0.2882169476350144, -0.014224472826780792]};
const close = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);

export default async (check) => {
  for (const [key, f, er, h, z0] of [['b', 10e9, 2.2, 0.1588e-2, 50], ['fr4', 2.45e9, 4.4, 1.6e-3, 50], ['ro', 5.8e9, 3.38, 0.813e-3, 75]]) {
    const p = patch(f, er, h, z0), R = REF[key];
    check(`antenna: patch ${key} width, εeff, ΔL, length = scipy`, close(p.W, R.W, 1e-12) && close(p.eeff, R.ee, 1e-12) && close(p.dL, R.dL, 1e-12) && close(p.L, R.L, 1e-12));
    check(`antenna: patch ${key} G1 and G12 = scipy quad (${p.G1.toExponential(4)}, ${p.G12.toExponential(4)})`, close(p.G1, R.G1, 1e-6) && close(p.G12, R.G12, 1e-4));
    check(`antenna: patch ${key} edge resistance and inset = scipy (${p.Rin.toFixed(2)} Ω)`, close(p.Rin, R.R, 1e-4) && close(p.inset, R.y0, 1e-4));
    check(`antenna: patch ${key} resonance check returns the design frequency`, close(p.fCheck, f, 1e-12));
  }
  { const p = patch(10e9, 2.2, 0.1588e-2); check('antenna: Balanis example 14.1 (W 1.186 cm, εeff 1.972, ΔL 0.081 cm, L 0.906 cm; Balanis rounds c to 3e8, so W and L to 2e-3 and 1e-3 cm)', Math.abs(p.W * 100 - 1.186) < 2e-3 && Math.abs(p.eeff - 1.972) < 5e-4 && Math.abs(p.dL * 100 - 0.081) < 5e-4 && Math.abs(p.L * 100 - 0.906) < 1e-3);
    check('antenna: Balanis examples 14.2 and 14.3 (Rin about 228 Ω, inset about 0.312 cm)', Math.abs(p.Rin - 228.3) < 0.5 && Math.abs(p.inset * 100 - 0.3126) < 0.001); }
  { const p = patch(2.45e9, 4.4, 1.6e-3, 400); check('antenna: no inset when Z0 is above the edge resistance', p.inset === null); }
  check('antenna: J0 by integral = scipy j0', [0.5, 2, 7.3, 15].every((x, i) => Math.abs(besselJ0(x) - REF.j0[i]) < 1e-10));
  { const d = dipole(14.2e6, 0.95); check('antenna: 14.2 MHz dipole λ 21.11 m, λ/2 10.556 m, cut 10.028 m', close(d.lambda, 21.1121, 1e-5) && close(d.half, 10.5561, 1e-5) && close(d.length, 0.95 * C0 / 14.2e6 / 2, 1e-12) && close(d.leg * 2, d.length, 1e-12)); }
  { const m = monopole(446e6, 1); check('antenna: 446 MHz quarter-wave 16.80 cm', close(m.length, 0.168044, 1e-5)); }
  { const y = yagi(144e6, 3); check('antenna: Yagi 144 MHz with 3 directors: 5 elements, boom 0.95 λ, lengths in rule-of-thumb order', y.elements.length === 5 && close(y.boom, 0.95 * wavelength(144e6), 1e-12) && y.elements[0].length > y.elements[1].length && y.elements[1].length > y.elements[2].length && y.elements[2].length > y.elements[4].length); }
};
