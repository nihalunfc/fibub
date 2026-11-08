// Hemocytometer counts (improved Neubauer chamber) and cell seeding.

/** A large square of an improved Neubauer chamber is 1 mm × 1 mm × 0.1 mm deep = 0.1 µL = 1e-4 mL. */
export const SQUARE_ML = 1e-4;

export function cellCount(live: number[], dead: number[], dilution: number) {
  const k = live.length;
  if (!k) throw new Error('Count at least one square');
  if (!(dilution >= 1)) throw new Error('The dilution factor must be 1 or more');
  const L = live.reduce((s, x) => s + x, 0), D = dead.reduce((s, x) => s + x, 0);
  const liveMl = (L / k / SQUARE_ML) * dilution, totalMl = ((L + D) / k / SQUARE_ML) * dilution;
  const perSq = live.map((x, i) => x + (dead[i] ?? 0)), m = perSq.reduce((s, x) => s + x, 0) / k;
  const cv = k > 1 && m > 0 ? Math.sqrt(perSq.reduce((s, x) => s + (x - m) ** 2, 0) / (k - 1)) / m : NaN;
  // Counting error: cells fall into the chamber at random (Poisson), so the relative SE is 1/√(cells counted).
  return { liveMl, totalMl, deadMl: totalMl - liveMl, viability: L + D ? L / (L + D) : NaN, counted: L + D, poissonRel: L > 0 ? 1 / Math.sqrt(L) : NaN, cv, perSquare: m };
}

/** Volume of cell suspension (mL) and medium for `wells` wells of `perWellMl`, each with `cellsPerWell` live cells, plus spare. */
export function seeding(liveMl: number, cellsPerWell: number, wells: number, perWellMl: number, sparePct = 10) {
  if (!(liveMl > 0)) throw new Error('Count the cells first');
  if (!(cellsPerWell > 0 && wells >= 1 && perWellMl > 0)) throw new Error('Type the cells per well, the number of wells and the volume per well');
  const f = 1 + Math.max(0, sparePct) / 100, totalCells = cellsPerWell * wells * f, totalMl = perWellMl * wells * f;
  const need = totalCells / liveMl, targetConc = cellsPerWell / perWellMl;
  if (targetConc > liveMl) throw new Error(`The wells need ${targetConc.toExponential(2)} cells/mL, more than the suspension has: spin the cells down and resuspend in less medium`);
  return { suspensionMl: need, mediumMl: totalMl - need, totalMl, totalCells, targetConc };
}
