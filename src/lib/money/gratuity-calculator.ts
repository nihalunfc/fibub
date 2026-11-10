// Gratuity / end-of-service benefit: India, UAE (private sector) and Saudi Arabia. Pure maths, no DOM.
// India: Payment of Gratuity Act, 1972 and Income Tax Department "Taxability of retirement benefits" (15/26 x last
// salary x years, part year over 6 months counts as a year, tax-free up to Rs 20 lakh); fixed-term employees eligible
// after 1 year under the Labour Codes from 21 Nov 2025 (PIB via labour.gov.in).
// UAE: Federal Decree-Law 33 of 2021, Art. 51 (u.ae, end of service benefits in the private sector).
// Saudi Arabia: Labor Law (Royal Decree M/51), Art. 84 and 85 (hrsd.gov.sa). Checked 2026-11-10.

const clamp = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);

export const INDIA_TAX_FREE = 2000000;

export interface IndiaIn {
  salary: number; // last monthly basic + dearness allowance
  years: number;
  months: number;
  covered: boolean; // employer covered by the Payment of Gratuity Act
  fixedTerm: boolean; // fixed-term employee (1-year rule from 21 Nov 2025)
  received?: number; // gratuity actually paid, for the tax split (0 = use the worked-out amount)
}

export function indiaGratuity(i: IndiaIn) {
  const salary = clamp(i.salary), y = Math.floor(clamp(i.years)), m = Math.min(11, Math.floor(clamp(i.months)));
  const total = y + m / 12;
  // Covered: completed years, plus one if the part year is more than 6 months. Not covered: completed years only,
  // half a month's average salary per year.
  const countYears = i.covered ? y + (m > 6 ? 1 : 0) : y;
  const amount = i.covered ? (15 / 26) * salary * countYears : 0.5 * salary * countYears;
  const minYears = i.fixedTerm ? 1 : 5;
  const eligible = total >= minYears;
  const paid = eligible ? Math.min(amount, INDIA_TAX_FREE) : 0; // the Act caps gratuity at Rs 20 lakh
  const received = i.received && i.received > 0 ? i.received : paid;
  const exempt = Math.min(amount, INDIA_TAX_FREE, received);
  return { countYears, amount: Math.round(amount), payable: Math.round(paid), eligible, minYears, received: Math.round(received), exempt: Math.round(exempt), taxable: Math.round(Math.max(0, received - exempt)) };
}

export interface UaeIn { basic: number; years: number; months: number; days?: number }

// 21 days' basic wage for each of the first 5 years, 30 days' for each year after; pro rata for part years;
// nothing under 1 year; never more than 2 years' wage. Daily wage = monthly basic / 30 (Art. 67: a month is 30 days).
export function uaeGratuity(i: UaeIn) {
  const basic = clamp(i.basic);
  const service = Math.floor(clamp(i.years)) + Math.min(11, Math.floor(clamp(i.months))) / 12 + clamp(i.days || 0) / 365;
  const daily = basic / 30;
  if (service < 1) return { service, daily, first: 0, after: 0, amount: 0, capped: false, eligible: false };
  const first = Math.min(service, 5) * 21 * daily;
  const after = Math.max(service - 5, 0) * 30 * daily;
  const cap = 24 * basic;
  const amount = Math.min(first + after, cap);
  return { service, daily, first, after, amount, capped: first + after > cap, eligible: true };
}

export interface SaudiIn { wage: number; years: number; months: number; resigned: boolean }

// Half a month's wage for each of the first 5 years, a month's wage for each later year, part years pro rata (Art. 84).
// On resignation (Art. 85): nothing under 2 years, a third for 2 to 5 years, two thirds for over 5 and under 10, all at 10+.
export function saudiGratuity(i: SaudiIn) {
  const wage = clamp(i.wage);
  const service = Math.floor(clamp(i.years)) + Math.min(11, Math.floor(clamp(i.months))) / 12;
  const full = 0.5 * wage * Math.min(service, 5) + wage * Math.max(service - 5, 0);
  let share = 1;
  if (i.resigned) share = service < 2 ? 0 : service <= 5 ? 1 / 3 : service < 10 ? 2 / 3 : 1;
  return { service, full, share, amount: full * share };
}
