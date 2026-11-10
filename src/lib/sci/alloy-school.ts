// School chemistry: alloys (Class 10 metals and non-metals; Class 8 materials). Mix metals by mass; the page
// gives each metal's mass for a batch, the mixture's density by the simple mixing rule (volumes add, an
// approximation: real alloys differ a little), and for gold the carat number (24 carat = pure). Element densities
// are rounded handbook values at room temperature; alloy recipes are typical, rounded ranges. No DOM.

export const DENSITY: Record<string, number> = { // g/cm³, rounded
  Cu: 8.96, Zn: 7.13, Sn: 7.29, Pb: 11.34, Fe: 7.87, C: 2.27, Cr: 7.19, Ni: 8.91, Al: 2.70, Mg: 1.74,
  Au: 19.3, Ag: 10.49, Mn: 7.21, Hg: 13.53, Bi: 9.78,
};
export const NAMES: Record<string, string> = {
  Cu: 'copper', Zn: 'zinc', Sn: 'tin', Pb: 'lead', Fe: 'iron', C: 'carbon', Cr: 'chromium', Ni: 'nickel', Al: 'aluminium',
  Mg: 'magnesium', Au: 'gold', Ag: 'silver', Mn: 'manganese', Hg: 'mercury', Bi: 'bismuth',
};

export type Alloy = { id: string; name: string; mix: Record<string, number>; range: string; uses: string; why: string; interstitial?: string };
export const ALLOYS: Alloy[] = [
  { id: 'brass', name: 'Brass', mix: { Cu: 65, Zn: 35 }, range: 'copper about 60–70 %, zinc the rest', uses: 'taps, door handles, musical instruments, screws', why: 'harder than copper, does not rust, shiny yellow, easy to shape' },
  { id: 'bronze', name: 'Bronze', mix: { Cu: 88, Sn: 12 }, range: 'copper about 85–90 %, tin the rest', uses: 'statues, medals, bells, ship parts', why: 'harder than copper and resists corrosion, even in sea water' },
  { id: 'solder', name: 'Solder (old type)', mix: { Sn: 63, Pb: 37 }, range: 'tin about 60 %, lead about 40 %', uses: 'joining wires in electronics (now mostly replaced by lead-free solder)', why: 'melts at a lower temperature than tin or lead alone' },
  { id: 'leadfree', name: 'Lead-free solder', mix: { Sn: 99.3, Cu: 0.7 }, range: 'tin over 95 %, a little copper and/or silver', uses: 'electronics today', why: 'low melting point without poisonous lead' },
  { id: 'steel', name: 'Steel', mix: { Fe: 99.5, C: 0.5 }, range: 'iron with about 0.05–2 % carbon', uses: 'buildings, bridges, cars, tools', why: 'much harder and stronger than pure iron', interstitial: 'C' },
  { id: 'stainless', name: 'Stainless steel', mix: { Fe: 74, Cr: 18, Ni: 8 }, range: 'iron with about 18 % chromium and 8 % nickel (and a little carbon)', uses: 'kitchen utensils, sinks, surgical tools', why: 'chromium makes a thin oxide layer that stops rusting' },
  { id: 'duralumin', name: 'Duralumin', mix: { Al: 94.5, Cu: 4, Mg: 1, Mn: 0.5 }, range: 'aluminium with about 4 % copper and a little magnesium and manganese', uses: 'aircraft parts, pressure cookers', why: 'light like aluminium but much stronger' },
  { id: 'magnalium', name: 'Magnalium', mix: { Al: 95, Mg: 5 }, range: 'aluminium with a few per cent magnesium', uses: 'light machine parts, balance beams, fireworks', why: 'lighter and stronger than aluminium' },
  { id: 'gold22', name: '22 carat gold', mix: { Au: 91.7, Cu: 5, Ag: 3.3 }, range: '22 parts gold in 24, the rest copper and silver', uses: 'jewellery', why: 'pure 24 carat gold is too soft to keep its shape' },
  { id: 'amalgam', name: 'Amalgam (dental, old type)', mix: { Hg: 50, Ag: 35, Sn: 15 }, range: 'mercury with silver, tin and copper', uses: 'old tooth fillings', why: 'soft when mixed, sets hard. Any alloy of mercury is called an amalgam' },
];

/** Normalise a mix to percentages that add to 100. */
export function percents(mix: Record<string, number>): Record<string, number> {
  const tot = Object.values(mix).reduce((t, x) => t + Math.max(0, x), 0);
  return Object.fromEntries(Object.entries(mix).map(([k, v]) => [k, tot > 0 ? (100 * Math.max(0, v)) / tot : 0]));
}
/** Grams of each metal in a batch of `grams`. */
export const masses = (mix: Record<string, number>, grams: number) => Object.fromEntries(Object.entries(percents(mix)).map(([k, p]) => [k, (p / 100) * grams]));
/** Density by the mixing rule: 1/ρ = Σ wᵢ/ρᵢ (mass fractions; volumes simply add). */
export function density(mix: Record<string, number>): number {
  const p = percents(mix);
  const inv = Object.entries(p).reduce((t, [k, w]) => t + w / 100 / DENSITY[k], 0);
  return inv > 0 ? 1 / inv : NaN;
}
/** Carat of a gold mix: 24 × gold mass fraction. */
export const carat = (mix: Record<string, number>) => (24 * (percents(mix).Au ?? 0)) / 100;
/** Gold percentage for a carat number. */
export const caratToPercent = (k: number) => (100 * k) / 24;
