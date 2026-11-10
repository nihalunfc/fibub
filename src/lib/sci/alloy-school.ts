// #1296 Alloy mixer: mix metals by percentage and see whether the mix is a known alloy (typical school composition
// ranges, rounded), the mass of each metal in a piece, gold purity in carats, and pure-metal melting points.
// Teaching values only. Pure maths, no DOM.

export const METALS: { sym: string; name: string; mp: number }[] = [
  // Melting points of the pure elements, °C, rounded general reference values.
  { sym: 'Cu', name: 'copper', mp: 1085 }, { sym: 'Zn', name: 'zinc', mp: 420 }, { sym: 'Sn', name: 'tin', mp: 232 }, { sym: 'Pb', name: 'lead', mp: 327 },
  { sym: 'Fe', name: 'iron', mp: 1538 }, { sym: 'C', name: 'carbon', mp: NaN }, { sym: 'Cr', name: 'chromium', mp: 1907 }, { sym: 'Ni', name: 'nickel', mp: 1455 },
  { sym: 'Al', name: 'aluminium', mp: 660 }, { sym: 'Mg', name: 'magnesium', mp: 650 }, { sym: 'Mn', name: 'manganese', mp: 1246 }, { sym: 'Au', name: 'gold', mp: 1064 }, { sym: 'Ag', name: 'silver', mp: 962 },
];

export type Alloy = { id: string; name: string; ranges: Record<string, [number, number]>; mix: Record<string, number>; uses: string; why: string };
/** Typical school compositions (percent by mass, rounded ranges); `mix` is the example recipe. */
export const ALLOYS: Alloy[] = [
  { id: 'brass', name: 'Brass', ranges: { Cu: [55, 90], Zn: [10, 45] }, mix: { Cu: 70, Zn: 30 }, uses: 'taps, door handles, musical instruments, electrical plugs', why: 'harder than copper, does not rust, easy to shape and has a gold-like shine' },
  { id: 'bronze', name: 'Bronze', ranges: { Cu: [80, 95], Sn: [5, 20] }, mix: { Cu: 88, Sn: 12 }, uses: 'statues, medals, bells, ship parts', why: 'harder than copper and resists corrosion, even in sea water' },
  { id: 'solder', name: 'Solder (tin–lead)', ranges: { Sn: [50, 70], Pb: [30, 50] }, mix: { Sn: 63, Pb: 37 }, uses: 'joining electrical wires (older electronics)', why: 'melts at a low temperature (about 183 °C for 63% tin), lower than tin or lead alone' },
  { id: 'leadfree', name: 'Lead-free solder', ranges: { Sn: [95, 99.5], Cu: [0, 5], Ag: [0, 5] }, mix: { Sn: 99.3, Cu: 0.7 }, uses: 'joining wires in electronics today', why: 'melts low and contains no poisonous lead' },
  { id: 'steel', name: 'Carbon steel', ranges: { Fe: [98, 99.95], C: [0.05, 2] }, mix: { Fe: 99.7, C: 0.3 }, uses: 'buildings, bridges, cars, tools', why: 'much stronger and harder than pure iron, which is soft' },
  { id: 'castiron', name: 'Cast iron', ranges: { Fe: [95, 98], C: [2, 4.5], Mn: [0, 1] }, mix: { Fe: 96.5, C: 3.5 }, uses: 'pans, engine blocks, drain covers', why: 'flows well into moulds and is hard, but brittle' },
  { id: 'stainless', name: 'Stainless steel', ranges: { Fe: [60, 89], Cr: [10.5, 26], Ni: [0, 14], C: [0, 1.2], Mn: [0, 2] }, mix: { Fe: 74, Cr: 18, Ni: 8 }, uses: 'cutlery, kitchen sinks, surgical tools', why: 'chromium forms a thin oxide layer that stops rusting' },
  { id: 'nichrome', name: 'Nichrome', ranges: { Ni: [60, 85], Cr: [15, 30], Fe: [0, 25] }, mix: { Ni: 80, Cr: 20 }, uses: 'heating coils in toasters, irons and heaters', why: 'high resistance and does not oxidise when red-hot' },
  { id: 'duralumin', name: 'Duralumin', ranges: { Al: [90, 96], Cu: [3, 5], Mg: [0.3, 2], Mn: [0, 1.2] }, mix: { Al: 94.5, Cu: 4, Mg: 1, Mn: 0.5 }, uses: 'aircraft bodies, bicycle frames', why: 'light like aluminium but much stronger' },
  { id: 'magnalium', name: 'Magnalium', ranges: { Al: [50, 95], Mg: [5, 50] }, mix: { Al: 90, Mg: 10 }, uses: 'light machine parts, some fireworks', why: 'lighter and stronger than aluminium' },
  { id: 'gold22', name: '22-carat gold', ranges: { Au: [91, 92.5], Cu: [0, 9], Ag: [0, 9] }, mix: { Au: 91.7, Cu: 5.3, Ag: 3 }, uses: 'jewellery', why: 'pure 24-carat gold is too soft; a little copper or silver makes it harder' },
  { id: 'gold18', name: '18-carat gold', ranges: { Au: [74.5, 76], Cu: [0, 25.5], Ag: [0, 25.5] }, mix: { Au: 75, Cu: 15, Ag: 10 }, uses: 'jewellery, watches', why: 'harder wearing than 22-carat gold' },
];

/** Sum of a recipe's percentages. */
export const total = (mix: Record<string, number>) => Object.values(mix).reduce((s, v) => s + v, 0);
/** Alloys whose ranges contain the mix (anything not in an alloy's list must be under 0.5%). Mix must add to 100 ± 0.5. */
export function match(mix: Record<string, number>): Alloy[] {
  if (Math.abs(total(mix) - 100) > 0.5) return [];
  return ALLOYS.filter((a) => {
    for (const [el, v] of Object.entries(mix)) { if (v <= 0) continue; const r = a.ranges[el]; if (!r) { if (v >= 0.5) return false; continue; } if (v < r[0] - 1e-9 || v > r[1] + 1e-9) return false; }
    for (const [el, r] of Object.entries(a.ranges)) if (r[0] > 0 && !((mix[el] ?? 0) >= r[0] - 1e-9)) return false;
    return true;
  });
}
/** Grams of each metal in a piece of `grams` with this recipe. */
export const masses = (mix: Record<string, number>, grams: number) => Object.fromEntries(Object.entries(mix).filter(([, v]) => v > 0).map(([el, v]) => [el, (grams * v) / total(mix)]));
/** Carats from percent gold (24 carat = pure). */
export const carats = (goldPercent: number) => (24 * goldPercent) / 100;
export const goldPercent = (carat: number) => (100 * carat) / 24;
