// Canada personal income tax for the 2026 tax year: federal + one province or territory, CPP/QPP, EI, QPIP.
// Pure maths, no DOM, so tests/tools/canada-income-tax.mjs can check it in node.
// Figures: CRA "Tax rates and brackets, current year" and T4127 Payroll Deductions Formulas (122nd and 123rd
// editions, 2026), Revenu Québec "Principal changes for 2026", ESDC CPP and EI 2026 figures. Checked 2026-11-10.

export type Band = [number, number]; // [upper limit of the band, rate]; the last limit is Infinity

export interface Prov {
  name: string;
  bands: Band[];
  bpa: number;
  estimate?: string; // a figure we could not fully confirm
}

const I = Infinity;
export const FED: Band[] = [[58523, 0.14], [117045, 0.205], [181440, 0.26], [258482, 0.29], [I, 0.33]];
export const FED_BPA = { max: 16452, min: 14829, from: 181440, to: 258482 };
export const CEA = 1501; // Canada employment amount
export const CPP = { ympe: 74600, yampe: 85000, exempt: 3500, base: 0.0495, first: 0.01, second: 0.04 };
export const QPP = { base: 0.053, first: 0.01, second: 0.04 };
export const EI = { max: 68900, rate: 0.0163, rateQC: 0.013 };
export const QPIP = { max: 103000, rate: 0.0043 };
export const QC_ABATEMENT = 0.165;
export const QC_WORKER = { rate: 0.06, max: 1450 };

export const PROVINCES: Record<string, Prov> = {
  AB: { name: 'Alberta', bpa: 22769, bands: [[61200, 0.08], [154259, 0.10], [185111, 0.12], [246813, 0.13], [370220, 0.14], [I, 0.15]] },
  BC: { name: 'British Columbia', bpa: 13216, bands: [[50363, 0.056], [100728, 0.077], [115648, 0.105], [140430, 0.1229], [190405, 0.147], [265545, 0.168], [I, 0.205]] },
  MB: { name: 'Manitoba', bpa: 15780, bands: [[47564, 0.108], [101200, 0.1275], [I, 0.174]] },
  NB: { name: 'New Brunswick', bpa: 13664, bands: [[52333, 0.094], [104666, 0.14], [193861, 0.16], [I, 0.195]] },
  NL: { name: 'Newfoundland and Labrador', bpa: 15000, estimate: 'The basic personal amount of $15,000 is from the 2026 provincial budget; whether it applies to the whole of 2026 was not confirmed.', bands: [[44678, 0.087], [89354, 0.145], [159528, 0.158], [223340, 0.178], [285319, 0.198], [570638, 0.208], [1141275, 0.213], [I, 0.218]] },
  NS: { name: 'Nova Scotia', bpa: 11932, bands: [[30995, 0.0879], [61991, 0.1495], [97417, 0.1667], [157124, 0.175], [I, 0.21]] },
  NT: { name: 'Northwest Territories', bpa: 18198, bands: [[53003, 0.059], [106009, 0.086], [172346, 0.122], [I, 0.1405]] },
  NU: { name: 'Nunavut', bpa: 19659, bands: [[55801, 0.04], [111602, 0.07], [181439, 0.09], [I, 0.115]] },
  ON: { name: 'Ontario', bpa: 12989, bands: [[53891, 0.0505], [107785, 0.0915], [150000, 0.1116], [220000, 0.1216], [I, 0.1316]] },
  PE: { name: 'Prince Edward Island', bpa: 15000, bands: [[33928, 0.095], [65820, 0.1347], [106890, 0.166], [142520, 0.1762], [200000, 0.19], [I, 0.20]] },
  QC: { name: 'Quebec', bpa: 18952, bands: [[54345, 0.14], [108680, 0.19], [132245, 0.24], [I, 0.2575]] },
  SK: { name: 'Saskatchewan', bpa: 20381, bands: [[54532, 0.105], [155805, 0.125], [I, 0.145]] },
  YT: { name: 'Yukon', bpa: 16452, bands: [[58523, 0.064], [117045, 0.09], [181440, 0.109], [500000, 0.128], [I, 0.15]] },
};

export const bandTax = (x: number, bands: Band[]) => {
  let tax = 0, lo = 0;
  for (const [hi, r] of bands) { if (x > lo) tax += (Math.min(x, hi) - lo) * r; lo = hi; }
  return tax;
};
export const bandRate = (x: number, bands: Band[]) => (bands.find(([hi]) => x <= hi) || bands[bands.length - 1])[1];
const pos = (x: number) => (x > 0 ? x : 0);
const r2 = (x: number) => Math.round(x * 100) / 100;

export const fedBpa = (net: number) =>
  net <= FED_BPA.from ? FED_BPA.max : net >= FED_BPA.to ? FED_BPA.min
    : FED_BPA.max - (net - FED_BPA.from) * ((FED_BPA.max - FED_BPA.min) / (FED_BPA.to - FED_BPA.from));

export interface Input { prov: string; employment: number; other: number; rrsp: number }
export interface Result {
  prov: string; gross: number; net: number; taxable: number;
  federal: number; provincial: number; surtax: number; healthPremium: number;
  cpp: number; cpp2: number; ei: number; qpip: number;
  incomeTax: number; deductions: number; takeHome: number;
  average: number; marginal: number; estimate?: string;
}

const core = ({ prov, employment, other, rrsp }: Input) => {
  const P = PROVINCES[prov] || PROVINCES.ON, qc = prov === 'QC';
  const E = pos(employment), O = pos(other), R = Math.min(pos(rrsp), E + O);
  // Pension plan (CPP or QPP): base + first additional up to the YMPE, second additional (CPP2/QPP2) up to the YAMPE.
  const pens = Math.min(E, CPP.ympe) - CPP.exempt > 0 ? Math.min(E, CPP.ympe) - CPP.exempt : 0;
  const plan = qc ? QPP : CPP;
  const pBase = pens * plan.base, pFirst = pens * plan.first;
  const cpp2 = pos(Math.min(E, CPP.yampe) - CPP.ympe) * plan.second;
  const ei = Math.min(E, EI.max) * (qc ? EI.rateQC : EI.rate);
  const qpip = qc ? Math.min(E, QPIP.max) * QPIP.rate : 0;
  // Enhanced (first and second additional) contributions are a deduction; the base part is a credit.
  const net = pos(E + O - R - pFirst - cpp2);
  const taxable = net;
  const fedCredits = fedBpa(net) + Math.min(CEA, E) + pBase + ei + qpip;
  let federal = pos(bandTax(taxable, FED) - FED[0][1] * fedCredits);
  if (qc) federal *= 1 - QC_ABATEMENT;

  let provincial = 0, surtax = 0, health = 0;
  if (qc) {
    const qTaxable = pos(E + O - R - pFirst - cpp2 - Math.min(QC_WORKER.max, QC_WORKER.rate * E));
    provincial = pos(bandTax(qTaxable, P.bands) - P.bands[0][1] * P.bpa);
  } else {
    const low = P.bands[0][1];
    let bpa = P.bpa;
    if (prov === 'MB') bpa = net <= 200000 ? 15780 : net >= 400000 ? 0 : 15780 - (net - 200000) * (15780 / 200000);
    if (prov === 'YT') bpa = fedBpa(net) + Math.min(CEA, E); // Yukon mirrors the federal amount and has its own employment amount
    let basic = pos(bandTax(taxable, P.bands) - low * (bpa + pBase + ei));
    if (prov === 'ON') {
      surtax = 0.2 * pos(basic - 5818) + 0.36 * pos(basic - 7446);
      // Ontario tax reduction: 2 x $300 minus the tax; surtax is nil wherever this applies.
      basic = pos(basic - pos(2 * 300 - (basic + surtax)));
      health = taxable <= 20000 ? 0
        : taxable <= 36000 ? Math.min(300, 0.06 * (taxable - 20000))
        : taxable <= 48000 ? Math.min(450, 300 + 0.06 * (taxable - 36000))
        : taxable <= 72000 ? Math.min(600, 450 + 0.25 * (taxable - 48000))
        : taxable <= 200000 ? Math.min(750, 600 + 0.25 * (taxable - 72000))
        : Math.min(900, 750 + 0.25 * (taxable - 200000));
    }
    if (prov === 'BC') {
      const red = net <= 25570 ? 690 : pos(690 - (net - 25570) * 0.0356);
      basic = pos(basic - red);
    }
    provincial = basic;
  }
  const cpp = pBase + pFirst;
  const incomeTax = federal + provincial + surtax + health;
  return { P, E, O, net, taxable, federal, provincial, surtax, health, cpp, cpp2, ei, qpip, incomeTax };
};

export function canadaTax(inp: Input): Result {
  const c = core(inp);
  const gross = c.E + c.O;
  const deductions = c.incomeTax + c.cpp + c.cpp2 + c.ei + c.qpip;
  const up = core({ ...inp, other: c.O + 100 });
  return {
    prov: inp.prov, gross, net: r2(c.net), taxable: r2(c.taxable),
    federal: r2(c.federal), provincial: r2(c.provincial), surtax: r2(c.surtax), healthPremium: r2(c.health),
    cpp: r2(c.cpp), cpp2: r2(c.cpp2), ei: r2(c.ei), qpip: r2(c.qpip),
    incomeTax: r2(c.incomeTax), deductions: r2(deductions), takeHome: r2(gross - deductions),
    average: gross > 0 ? c.incomeTax / gross : 0,
    marginal: (up.incomeTax - c.incomeTax) / 100,
    estimate: c.P.estimate,
  };
}
