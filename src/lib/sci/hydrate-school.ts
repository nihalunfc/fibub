// School chemistry: water of crystallisation (Class 10 acids, bases and salts; Class 11 mole concept). Heat a
// hydrated salt until its mass stops changing; the mass lost is water. x in Salt·xH₂O = moles of water ÷ moles
// of anhydrous salt. Uses the rounded atomic masses of school books (H 1, O 16, S 32, Cu 63.5, ...). No DOM.

export const MASS: Record<string, number> = { H: 1, C: 12, O: 16, Na: 23, Mg: 24, S: 32, Ca: 40, Fe: 56, Cu: 63.5, Co: 59, Zn: 65, Cl: 35.5 };

export type Hydrate = { id: string; name: string; salt: string; parts: Record<string, number>; x: number; colours: [string, string]; note: string };
export const HYDRATES: Hydrate[] = [
  { id: 'cuso4', name: 'Copper sulfate (blue vitriol)', salt: 'CuSO₄', parts: { Cu: 1, S: 1, O: 4 }, x: 5, colours: ['#2f6fd0', '#f2f2f2'], note: 'Blue crystals turn white. Add a few drops of water and the blue comes back, and the powder warms up.' },
  { id: 'feso4', name: 'Iron(II) sulfate (green vitriol)', salt: 'FeSO₄', parts: { Fe: 1, S: 1, O: 4 }, x: 7, colours: ['#7fbf7f', '#e8e6dc'], note: 'Pale green crystals turn off-white. Strong heating goes further and breaks the salt itself (brown iron oxide and choking gases), which this page leaves out.' },
  { id: 'na2co3', name: 'Sodium carbonate (washing soda)', salt: 'Na₂CO₃', parts: { Na: 2, C: 1, O: 3 }, x: 10, colours: ['#f4f7fb', '#ffffff'], note: 'Washing soda crystals lose water even in dry air (they crumble to a powder).' },
  { id: 'mgso4', name: 'Magnesium sulfate (Epsom salt)', salt: 'MgSO₄', parts: { Mg: 1, S: 1, O: 4 }, x: 7, colours: ['#f4f7fb', '#ffffff'], note: 'Colourless crystals turn to a white powder.' },
  { id: 'caso4', name: 'Calcium sulfate (gypsum)', salt: 'CaSO₄', parts: { Ca: 1, S: 1, O: 4 }, x: 2, colours: ['#f0ece2', '#ffffff'], note: 'Gently heated gypsum becomes plaster of Paris, CaSO₄·½H₂O; the page heats it all the way to anhydrous CaSO₄.' },
  { id: 'cocl2', name: 'Cobalt chloride (damp test paper)', salt: 'CoCl₂', parts: { Co: 1, Cl: 2 }, x: 6, colours: ['#d0507a', '#3d5fc4'], note: 'Pink when wet, blue when dry: that is why it is used to test for water.' },
];

export const molarMass = (parts: Record<string, number>) => Object.entries(parts).reduce((t, [el, n]) => t + MASS[el] * n, 0);
export const WATER = 18;

/** Mass of anhydrous salt and water in `m` grams of the hydrate. */
export function split(h: Hydrate, m: number): { salt: number; water: number; Mh: number } {
  const Ms = molarMass(h.parts), Mh = Ms + h.x * WATER;
  return { salt: (m * Ms) / Mh, water: (m * h.x * WATER) / Mh, Mh };
}

/** x from weighings: crucible empty, with hydrate, after heating to constant mass. */
export function xFromMasses(h: Hydrate, empty: number, withHydrate: number, afterHeat: number) {
  const mh = withHydrate - empty, ms = afterHeat - empty, mw = withHydrate - afterHeat;
  const Ms = molarMass(h.parts), nSalt = ms / Ms, nWater = mw / WATER;
  return { mh, ms, mw, nSalt, nWater, x: nWater / nSalt, pct: (100 * mw) / mh };
}
