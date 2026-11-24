// #T86 Chromatography calculator: the worked pair from the blog article
// src/blog/discoveries/hplc-remdesivir-favipiravir-plate-count-resolution-method-transfer.md
// (favipiravir 11.5 min and remdesivir 20.95 min on a 250 x 4.6 mm, 5 um column at 1.0 mL/min, more than 4,000
// plates; Khan et al. 2025, PLOS ONE 20(4): e0321474, CC BY 4.0). Dead time from a porosity of 0.68.
import * as C from '../../src/lib/sci/chrom.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const t0 = 0.68 * Math.PI * (4.6 / 20) ** 2 * 25; // mL of mobile phase in the column = min at 1.0 mL/min
  check('chrom: dead time of a 250 x 4.6 mm column at porosity 0.68 and 1.0 mL/min = 2.8252 min', near(t0, 2.825234, 1e-6));
  const k1 = C.retentionFactor(11.5, t0), k2 = C.retentionFactor(20.95, t0), alpha = k2 / k1;
  check('chrom: antiviral pair k1 = 3.07046, k2 = 6.41531, alpha = 2.08937', near(k1, 3.070459, 1e-6) && near(k2, 6.415314, 1e-6) && near(alpha, 2.089367, 1e-6));
  const w = (t) => t * Math.sqrt(5.545 / 4000);
  check('chrom: 4,000 plates imply half-height widths of 0.42817 and 0.78002 min, and give those plates back', near(w(11.5), 0.428172, 1e-6) && near(w(20.95), 0.780018, 1e-6) && near(C.plates(11.5, w(11.5), 'half'), 4000, 1e-9));
  check('chrom: Rs from those widths = 9.2060 (Ph. Eur.), Purnell at 4,000 plates = 7.1321', near(C.resolution(11.5, 20.95, w(11.5), w(20.95), 'half'), 9.206039, 1e-6) && near(C.purnell(4000, alpha, k2), 7.132106, 1e-6));
  check('chrom: only 314.546 plates are needed for Rs = 2.0 at this selectivity, and Purnell gives 2.0 back', near(C.platesFor(2, alpha, k2), 314.546177, 1e-5) && near(C.purnell(C.platesFor(2, alpha, k2), alpha, k2), 2, 1e-12));
  const tr = C.transfer({ L: 250, d: 4.6, dp: 5 }, { L: 100, d: 2.1, dp: 1.8 }, 1, 10);
  check('chrom: transfer to 100 x 2.1 mm, 1.8 um gives 0.57892 mL/min, 0.83365 uL, times x 0.144, 8.336 % of the solvent, L/dp +11.1 % (inside USP <621>)', near(tr.flow, 0.578922, 1e-6) && near(tr.injection, 0.833648, 1e-6) && near(tr.timeScale, 0.144, 1e-12) && near(tr.solventRatio, 0.083365, 1e-6) && near(tr.lOverDpChange, 11.111111, 1e-6) && tr.uspOk);
};
