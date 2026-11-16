// Residential status of an individual in India for a tax year (1 April to 31 March), Income-tax Act, 2025, section 6.
export type ResidenceInput = {
  days: number;           // days in India this tax year
  prior4: number;         // days in India in the 4 preceding tax years
  citizen: boolean;       // Indian citizen
  pio: boolean;           // person of Indian origin (not a citizen)
  visiting: boolean;      // lives abroad and came to India on a visit
  leftForJob: boolean;    // citizen who left India this year for a job abroad, or as ship crew
  income15: boolean;      // total income other than foreign-source income over Rs 15 lakh
  taxedElsewhere: boolean;// liable to tax in another country by domicile or residence
  nr9of10: boolean;       // non-resident in 9 of the 10 preceding years
  le729: boolean;         // 729 days or less in India in the 7 preceding years
};
export type Status = 'resident' | 'rnor' | 'nonresident';

export function indianResidence(i: ResidenceInput): { status: Status; rule: string; threshold: number } {
  const visitor = (i.citizen || i.pio) && i.visiting;
  const leaver = i.citizen && i.leftForJob;
  const threshold = visitor ? (i.income15 ? 120 : 182) : leaver ? 182 : 60;
  let resident = false, rule = '';
  if (i.days >= 182) { resident = true; rule = '182 days or more in the year: section 6(2)(a)'; }
  else if (i.days >= threshold && i.prior4 >= 365) { resident = true; rule = `${threshold} days or more this year and 365 days or more in the 4 earlier years: section 6(2)(b)${threshold === 120 ? ' read with 6(5)' : ''}`; }
  if (resident) {
    if (i.nr9of10) return { status: 'rnor', rule: rule + '; non-resident in 9 of the 10 earlier years: section 6(13)(a)', threshold };
    if (i.le729) return { status: 'rnor', rule: rule + '; 729 days or less in the 7 earlier years: section 6(13)(a)', threshold };
    if (visitor && i.income15 && i.days < 182) return { status: 'rnor', rule: rule + '; Indian income over Rs 15 lakh and 120 to 181 days: section 6(13)(b)', threshold };
    return { status: 'resident', rule, threshold };
  }
  if (i.citizen && i.income15 && !i.taxedElsewhere) return { status: 'rnor', rule: 'Deemed resident: an Indian citizen with Indian income over Rs 15 lakh who is not liable to tax in any other country, section 6(7); treated as not ordinarily resident, section 6(13)(c)', threshold };
  return { status: 'nonresident', rule: `Under 182 days${threshold < 182 ? `, and not ${threshold} days plus 365 days in the 4 earlier years` : ''}: section 6(2)`, threshold };
}

export const STATUS_NAME: Record<Status, string> = { resident: 'Resident (ordinarily resident)', rnor: 'Resident but not ordinarily resident (RNOR)', nonresident: 'Non-resident' };
