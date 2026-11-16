// Compare an amount held abroad placed in an NRE fixed deposit, an NRO fixed deposit or an FCNR(B) deposit.
export type DepositInput = {
  amount: number;   // in the foreign currency
  fx: number;       // rupees per unit of the foreign currency today
  years: number;
  perYear: number;  // compounding periods a year (4 = quarterly)
  drift: number;    // expected % a year the rupee falls against the currency (negative = rupee gains)
  nre: number; nro: number; fcnr: number; // yearly interest rates, %
  nroTax: number;   // final tax on NRO interest, % (TDS is 30% plus cess for a non-resident unless a treaty rate applies)
};

/** Yearly growth factor from a nominal rate compounded perYear times. */
export const yearFactor = (rate: number, perYear: number) => Math.pow(1 + rate / 100 / perYear, perYear);

export function compareDeposits(i: DepositInput) {
  const fxEnd = i.fx * Math.pow(1 + i.drift / 100, i.years);
  const inr0 = i.amount * i.fx;
  const nreInr = inr0 * Math.pow(yearFactor(i.nre, i.perYear), i.years);
  const nroYear = 1 + (yearFactor(i.nro, i.perYear) - 1) * (1 - i.nroTax / 100);
  const nroInr = inr0 * Math.pow(nroYear, i.years);
  const fcnrFx = i.amount * Math.pow(yearFactor(i.fcnr, i.perYear), i.years);
  const row = (name: string, fxv: number, inr: number) => ({ name, fx: fxv, inr, yearly: (Math.pow(fxv / i.amount, 1 / i.years) - 1) * 100 });
  const rows = [row('NRE fixed deposit', nreInr / fxEnd, nreInr), row('NRO fixed deposit', nroInr / fxEnd, nroInr), row('FCNR(B) deposit', fcnrFx, fcnrFx * fxEnd)];
  const best = rows.reduce((a, b) => (b.fx > a.fx ? b : a));
  return { fxEnd, inr0, rows, best, nroTaxPaid: inr0 * (Math.pow(yearFactor(i.nro, i.perYear), i.years) - 1) - (nroInr - inr0) };
}
