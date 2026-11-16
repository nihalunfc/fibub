// Customs duty on gold jewellery a passenger brings into India (Baggage Rules, 2026, Rule 6; rates editable).
export type GoldInput = {
  grams: number;          // jewellery weight
  karat: number;          // 24, 22 or 18
  price24: number;        // value abroad per gram of 24K, in rupees
  female: boolean;        // 40 g allowance for a female passenger, 20 g for any other
  monthsAbroad: number;   // time abroad before this trip
  indianOrigin: boolean;  // Indian passport or Indian origin (for the allowance and the eligible-passenger route)
  eligibleRate: number;   // % (BCD + AIDC) on the eligible-passenger route
  igst: number;           // % IGST on the eligible-passenger route, on value + duty
  baggageRate: number;    // % all-in baggage rate otherwise
  india24: number;        // shop price in India per gram of 24K (with GST), in rupees
};

export const purity = (karat: number) => karat / 24;
/** Duty-free grams under Rule 6: abroad more than one year, of Indian origin. */
export const allowanceGrams = (female: boolean, monthsAbroad: number, indianOrigin: boolean) => (indianOrigin && monthsAbroad > 12 ? (female ? 40 : 20) : 0);

export function goldDuty(i: GoldInput) {
  const perGram = i.price24 * purity(i.karat);
  const value = i.grams * perGram;
  const freeGrams = Math.min(i.grams, allowanceGrams(i.female, i.monthsAbroad, i.indianOrigin));
  const extraGrams = i.grams - freeGrams;
  const dutiable = extraGrams * perGram;
  const eligible = i.indianOrigin && i.monthsAbroad >= 6;
  let duty: number, igst = 0;
  if (eligible) { duty = dutiable * i.eligibleRate / 100; igst = (dutiable + duty) * i.igst / 100; }
  else duty = dutiable * i.baggageRate / 100;
  const total = duty + igst;
  const landed = value + total;
  const india = i.grams * i.india24 * purity(i.karat);
  return { perGram, value, freeGrams, extraGrams, dutiable, eligible, duty, igst, total, landed, landedPerGram: i.grams > 0 ? landed / i.grams : 0, india, gap: india - landed, overKg: eligible && extraGrams > 1000 };
}
