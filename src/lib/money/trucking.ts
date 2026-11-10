// IFTA quarterly return and axle-load maths, as pure functions (no DOM).

export interface Juris { name: string; distance: number; fuel: number; rate: number }
export interface IftaLine extends Juris { taxable: number; net: number; tax: number }

/** IFTA: fleet average = total distance / total fuel (two decimals, as the IFTA Procedures Manual asks);
 * taxable fuel = jurisdiction distance / average (whole units); net = taxable - tax-paid fuel bought there;
 * tax = net x rate (negative is a credit). */
export const ifta = (totalDistance: number, totalFuel: number, rows: Juris[]) => {
  const avg = totalFuel > 0 ? Math.round((totalDistance / totalFuel) * 100) / 100 : 0;
  const lines: IftaLine[] = rows.map((r) => {
    const taxable = avg > 0 ? Math.round(r.distance / avg) : 0, net = taxable - Math.round(r.fuel);
    return { ...r, taxable, net, tax: Math.round(net * r.rate * 100) / 100 };
  });
  const sum = (k: 'distance' | 'fuel' | 'tax') => lines.reduce((a, l) => a + l[k], 0);
  return { avg, lines, net: Math.round(sum('tax') * 100) / 100, distanceListed: sum('distance'), fuelListed: sum('fuel') };
};

/** US federal bridge formula, W = 500 (LN/(N-1) + 12N + 36), L in feet between the outer axles of the
 * group, N axles, rounded to the nearest 500 lb (FHWA Bridge Formula Weights). */
export const bridge = (L: number, N: number): number => {
  if (N < 2 || !(L > 0)) return NaN;
  return Math.round((500 * ((L * N) / (N - 1) + 12 * N + 36)) / 500) * 500;
};

export interface Rig {
  wb: number; // steer axle to the centre of the drive group
  fifth: number; // steer axle to the fifth wheel (kingpin)
  kpToTrailer: number; // kingpin to the centre of the trailer group
  loadAt: number; // kingpin to the centre of the load
  load: number;
  emptySteer: number; emptyDrive: number; emptyTrailer: number; // empty weights on each group (the trailer's kingpin share is in the tractor's)
}

/** Lever rule: the load splits between the kingpin and the trailer group; the kingpin share splits
 * between the steer axle and the drive group. */
export const axleLoads = (r: Rig) => {
  const x = Math.min(Math.max(r.loadAt, 0), r.kpToTrailer);
  const toTrailer = r.kpToTrailer > 0 ? (r.load * x) / r.kpToTrailer : 0, toKing = r.load - toTrailer;
  const toDrive = r.wb > 0 ? (toKing * r.fifth) / r.wb : 0, toSteer = toKing - toDrive;
  const steer = r.emptySteer + toSteer, drive = r.emptyDrive + toDrive, trailer = r.emptyTrailer + toTrailer;
  return { steer, drive, trailer, gross: steer + drive + trailer, kingpin: toKing, outside: r.loadAt < 0 || r.loadAt > r.kpToTrailer };
};
