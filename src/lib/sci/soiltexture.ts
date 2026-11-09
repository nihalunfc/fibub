// USDA soil texture classes from sand, silt and clay percentages. Plain maths; no DOM.
// The class rules are the public USDA definitions (Soil Survey Manual, USDA Handbook 18; the same rules as the
// NRCS soil texture calculator): sand 0.05 to 2 mm, silt 0.002 to 0.05 mm, clay below 0.002 mm.

export const CLASSES = ['Sand', 'Loamy sand', 'Sandy loam', 'Loam', 'Silt loam', 'Silt', 'Sandy clay loam', 'Clay loam', 'Silty clay loam', 'Sandy clay', 'Silty clay', 'Clay'] as const;
export type TextureClass = (typeof CLASSES)[number];

/** USDA texture class of a soil from its sand, silt and clay percentages (which must add up to 100). */
export function usdaClass(sand: number, silt: number, clay: number): TextureClass {
  if (silt + 1.5 * clay < 15) return 'Sand';
  if (silt + 2 * clay < 30) return 'Loamy sand';
  if (clay >= 40) {
    if (sand > 45) return 'Sandy clay';
    return silt >= 40 ? 'Silty clay' : 'Clay';
  }
  if (clay >= 35 && sand > 45) return 'Sandy clay';
  if (clay >= 27) return sand > 45 ? 'Sandy clay loam' : sand > 20 ? 'Clay loam' : 'Silty clay loam';
  if (clay >= 20 && sand > 45 && silt < 28) return 'Sandy clay loam';
  if ((clay >= 7 && sand > 52) || (clay < 7 && silt < 50)) return 'Sandy loam';
  if (silt >= 80 && clay < 12) return 'Silt';
  if (silt >= 50) return 'Silt loam';
  return 'Loam';
}

/** The classes as polygons of (clay, silt, sand) corners, for drawing and as an independent check of the rules. */
export const POLYGONS: Record<TextureClass, [number, number, number][]> = {
  'Sand': [[0, 0, 100], [10, 0, 90], [0, 15, 85]],
  'Loamy sand': [[10, 0, 90], [15, 0, 85], [0, 30, 70], [0, 15, 85]],
  'Sandy loam': [[15, 0, 85], [20, 0, 80], [20, 28, 52], [7, 41, 52], [7, 50, 43], [0, 50, 50], [0, 30, 70]],
  'Loam': [[7, 41, 52], [20, 28, 52], [27, 28, 45], [27, 50, 23], [7, 50, 43]],
  'Silt loam': [[0, 50, 50], [7, 50, 43], [27, 50, 23], [27, 73, 0], [12, 88, 0], [12, 80, 8], [0, 80, 20]],
  'Silt': [[0, 80, 20], [12, 80, 8], [12, 88, 0], [0, 100, 0]],
  'Sandy clay loam': [[20, 0, 80], [35, 0, 65], [35, 20, 45], [27, 28, 45], [20, 28, 52]],
  'Clay loam': [[27, 28, 45], [35, 20, 45], [40, 15, 45], [40, 40, 20], [27, 53, 20]],
  'Silty clay loam': [[27, 53, 20], [40, 40, 20], [40, 60, 0], [27, 73, 0]],
  'Sandy clay': [[35, 0, 65], [55, 0, 45], [35, 20, 45]],
  'Silty clay': [[40, 40, 20], [60, 40, 0], [40, 60, 0]],
  'Clay': [[40, 15, 45], [55, 0, 45], [100, 0, 0], [60, 40, 0], [40, 40, 20]],
};

/** Where to print each class name on the triangle, as (clay, silt, sand). */
export const LABELS: Record<TextureClass, [number, number, number]> = {
  'Sand': [3, 5, 92], 'Loamy sand': [6, 12, 82], 'Sandy loam': [10, 25, 65], 'Loam': [18, 40, 42], 'Silt loam': [14, 65, 21], 'Silt': [5, 88, 7],
  'Sandy clay loam': [27, 13, 60], 'Clay loam': [34, 33, 33], 'Silty clay loam': [34, 56, 10], 'Sandy clay': [42, 7, 51], 'Silty clay': [47, 46, 7], 'Clay': [60, 20, 20],
};

/** Even-odd point-in-polygon test in (clay, silt) coordinates. */
export function inPolygon(clay: number, silt: number, poly: [number, number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > silt !== yj > silt && clay < ((xj - xi) * (silt - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export type Sample = { name: string; sand: number; silt: number; clay: number; total: number; scaled: boolean; cls: TextureClass };
export type ReadResult = { samples: Sample[]; problems: string[] };

/**
 * Read rows of [name?, sand, silt, clay]. A blank silt (or sand or clay) is filled in as 100 minus the other two.
 * Totals within `tol` of 100 are rescaled to 100; others are rejected with a message (or rescaled if `rescaleAll`).
 */
export function readSamples(rows: { name: string; sand: number; silt: number; clay: number }[], tol = 2, rescaleAll = false): ReadResult {
  const samples: Sample[] = [], problems: string[] = [];
  for (const r of rows) {
    let { sand, silt, clay } = r;
    const miss = [sand, silt, clay].filter((v) => !Number.isFinite(v)).length;
    if (miss > 1) { problems.push(`${r.name}: needs at least two of sand, silt and clay.`); continue; }
    if (miss === 1) {
      if (!Number.isFinite(sand)) sand = 100 - silt - clay; else if (!Number.isFinite(silt)) silt = 100 - sand - clay; else clay = 100 - sand - silt;
    }
    if (sand < 0 || silt < 0 || clay < 0) { problems.push(`${r.name}: percentages cannot be negative${miss ? ' (the two given add up to more than 100)' : ''}.`); continue; }
    const total = sand + silt + clay;
    if (!(total > 0)) { problems.push(`${r.name}: sand, silt and clay are all zero.`); continue; }
    const off = Math.abs(total - 100) > 1e-9;
    if (off && Math.abs(total - 100) > tol && !rescaleAll) { problems.push(`${r.name}: sand + silt + clay = ${+total.toFixed(2)} %, more than ${tol} from 100.`); continue; }
    const k = 100 / total;
    sand *= k; silt *= k; clay *= k;
    samples.push({ name: r.name, sand, silt, clay, total, scaled: off, cls: usdaClass(sand, silt, clay) });
  }
  return { samples, problems };
}

/** Position on the USDA triangle (side 1): clay at the top, sand bottom left, silt bottom right; y up. */
export const triXY = (clay: number, silt: number, sand: number): [number, number] => {
  const s = clay + silt + sand;
  return [(0.5 * clay + silt) / s, ((Math.sqrt(3) / 2) * clay) / s];
};
