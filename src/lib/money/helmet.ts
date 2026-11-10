// Common helmet size bands by head circumference (cm). Makers differ.
export const BANDS: { size: string; min: number; max: number }[] = [
  { size: 'XS', min: 52, max: 55 }, { size: 'S', min: 55, max: 57 }, { size: 'M', min: 57, max: 59 },
  { size: 'L', min: 59, max: 61 }, { size: 'XL', min: 61, max: 63 }, { size: 'XXL', min: 63, max: 65 },
];
export const toCm = (v: number, unit: 'cm' | 'in') => (unit === 'in' ? v * 2.54 : v);
export function helmetSize(cm: number) {
  if (!(cm > 0)) return { size: '', note: 'Type your head measurement.' };
  if (cm < 52) return { size: '', note: 'Under 52 cm is below this adult table. Look at youth or child sizes from the maker.' };
  if (cm >= 65) return { size: '', note: '65 cm or more is above this table. Ask the maker about XXXL or custom sizes.' };
  const b = BANDS.find((x) => cm >= x.min && cm < x.max)!;
  const edge = cm - b.min < 0.5 ? 'You are near the smaller end: also try the size below.' : b.max - cm <= 0.5 ? 'You are near the larger end: also try the size above.' : '';
  return { size: b.size, band: b, note: edge };
}
