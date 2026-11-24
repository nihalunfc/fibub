// #T178 protein parameter calculator: the five peptide sequences named by Shen et al. (2025), Foods 14(6): 1068
// (CC BY), used in the blog article tuna-immunomodulatory-peptide-mass-and-charge. Masses come from each residue's
// chemical formula, the pI from the tool's default pKa set and the extinction coefficients from Trp 5500 / Tyr 1490.
import * as PP from '../../src/lib/sci/protparam.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const want = [
    { seq: 'HDCDLLR', formula: 'C35H58N12O12S', avg: 870.981, mono: 870.40179, pI: 5.2724, q74: -1.0414, eps: 0, uM: 229.6 },
    { seq: 'YGSVELDELGK', formula: 'C53H84N12O20', avg: 1209.319, mono: 1208.59248, pI: 3.8693, q74: -2.0263, eps: 1490, uM: 165.4 },
    { seq: 'YGPNDNFFEGK', formula: 'C59H78N14O19', avg: 1287.352, mono: 1286.55677, pI: 4.1140, q74: -1.0263, eps: 1490, uM: 155.4 },
    { seq: 'FPPDYLDDALR', formula: 'C61H88N14O19', avg: 1321.454, mono: 1320.63502, pI: 3.7029, q74: -2.0263, eps: 1490, uM: 151.3 },
    { seq: 'QYGDLSTPEALK', formula: 'C58H92N14O21', avg: 1321.451, mono: 1320.65615, pI: 4.1140, q74: -1.0263, eps: 1490, uM: 151.3 },
  ];
  for (const w of want) {
    const a = PP.analyse(w.seq, { pH: 7.4 });
    check(`protein: ${w.seq} ${w.formula}, ${w.avg.toFixed(2)} Da, pI ${w.pI.toFixed(2)}`,
      a.formula === w.formula && near(a.avg, w.avg, 1e-3) && near(a.mono, w.mono, 1e-4) && near(a.pI, w.pI, 1e-3) && near(a.chargeAt, w.q74, 1e-3) && a.epsUsed === w.eps);
    check(`protein: ${w.seq} is ${w.uM} µM at 200 µg/mL`, near(PP.uMFromMgMl(0.2, a.avg), w.uM, 0.05));
  }
  // The de novo list's near-isobaric pair: different compositions, 16.0 ppm apart.
  const d1 = PP.analyse('FPPDYLDDALR').mono, d2 = PP.analyse('QYGDLSTPEALK').mono;
  check('protein: FPPDYLDDALR and QYGDLSTPEALK are 16.0 ppm apart', near(((d2 - d1) / d1) * 1e6, 16.0, 0.05) && near(d2 - d1, 0.0211, 1e-4));
  // No Trp or Tyr means A280 cannot see the peptide at all.
  check('protein: HDCDLLR has no 280 nm absorbance', PP.extinction('HDCDLLR').reduced === 0 && PP.analyse('HDCDLLR').abs01 === 0);
  check('protein: the four Tyr peptides read 1.13 to 1.24 at 1 mg/mL', want.slice(1).every((w) => { const A = PP.analyse(w.seq).abs01; return A > 1.12 && A < 1.24; }));
};
