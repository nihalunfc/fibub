// Yearly employee deductions and employer costs for one hire, by country (2026 rates). Used by the Module 9
// payslip and true-cost calculators. Federal or central rules only, with state and provincial extras noted on the page.
import { inPersonal } from './biztax';
import { canadaTax, EI } from '../../../lib/money/canada-income-tax';
import { bracketTax, BRACKETS, STD, SS_BASE } from '../../../lib/money/us-paycheck';

const pos = (x: number) => (x > 0 ? x : 0);
export type Line = [string, number];
export interface Pay { gross: number; employee: Line[]; employer: Line[]; takeHome: number; cost: number }

/** India: monthly gross G, basic share b (labour codes: wages at least 50 % of pay), PF on wages capped at ₹15,000
 * when cap is on, ESI up to ₹21,000 a month, professional tax pt a month, gratuity provision 4.81 % of wages. */
export function india(G: number, b: number, cap: boolean, pt: number): Pay {
  const wages = Math.max(G * b, G * 0.5), pfw = cap ? Math.min(wages, 15000) : wages, Y = 12;
  const pfE = 0.12 * pfw, edli = Math.min(0.005 * pfw, 75), adm = Math.max(0.005 * pfw, 0);
  const esi = G <= 21000 ? [0.0075 * G, 0.0325 * G] : [0, 0];
  const tds = inPersonal(G * Y, 0);
  const grat = 0.0481 * wages;
  const employee: Line[] = [['Provident fund (12 %)', pfE * Y], ['ESI (0.75 %)', esi[0] * Y], ['Professional tax', pt * Y], ['Income tax (TDS, new regime)', tds]];
  const employer: Line[] = [['Provident fund and pension (12 %)', 0.12 * pfw * Y], ['EDLI insurance and PF admin', (edli + adm) * Y], ['ESI (3.25 %)', esi[1] * Y], ['Gratuity set aside (4.81 % of wages)', grat * Y]];
  const gross = G * Y, ded = employee.reduce((s, l) => s + l[1], 0), extra = employer.reduce((s, l) => s + l[1], 0);
  return { gross, employee, employer, takeHome: gross - ded, cost: gross + extra };
}

/** Canada: yearly salary S in a province; vacation pay share v (4 % in most provinces) on top of salary. */
export function canada(S: number, prov: string, v: number): Pay {
  const gross = S * (1 + v), t = canadaTax({ prov, employment: gross, other: 0, rrsp: 0 });
  const employee: Line[] = [['CPP (5.95 %) and CPP2', t.cpp + t.cpp2], [prov === 'QC' ? 'EI (1.30 %) and QPIP' : 'EI (1.63 %)', t.ei + t.qpip], ['Income tax (federal + provincial)', t.incomeTax]];
  const erEi = Math.min(gross, EI.max) * (prov === 'QC' ? 0.013 : EI.rate) * 1.4;
  const employer: Line[] = [['CPP match', t.cpp + t.cpp2], ['EI (1.4 × employee)', erEi], ...(prov === 'QC' ? [['QPIP employer', t.qpip * 1.4] as Line] : [])];
  const ded = employee.reduce((s, l) => s + l[1], 0), extra = employer.reduce((s, l) => s + l[1], 0);
  return { gross, employee, employer, takeHome: gross - ded, cost: gross + extra };
}

/** USA: yearly salary S, single filer, federal withholding estimate plus a flat state rate; employer FICA, FUTA
 * ($42 after the state credit) and state unemployment at rate r on wage base wb. */
export function usa(S: number, stateRate: number, r: number, wb: number): Pay {
  const ss = Math.min(S, SS_BASE) * 0.062, med = S * 0.0145, add = pos(S - 200000) * 0.009;
  const fed = bracketTax(pos(S - STD.single), BRACKETS.single);
  const employee: Line[] = [['Social Security (6.2 %)', ss], ['Medicare (1.45 %)', med + add], ['Federal income tax', fed], ['State income tax (estimate)', S * stateRate]];
  const employer: Line[] = [['Social Security match', ss], ['Medicare match', med], ['FUTA (0.6 % of first $7,000)', Math.min(S, 7000) * 0.006], ['State unemployment (SUTA)', Math.min(S, wb) * r]];
  const ded = employee.reduce((s, l) => s + l[1], 0), extra = employer.reduce((s, l) => s + l[1], 0);
  return { gross: S, employee, employer, takeHome: S - ded, cost: S + extra };
}
