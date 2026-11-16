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

export interface RigLimits { steer: number; drive: number; trailer: number; gross: number }

/** Heaviest load that keeps every group within its limit, with the load where it is (loadAt).
 * Each group's weight rises in a straight line with the load, so the answer is the smallest of the
 * four room-left / share figures. A limit of 0 is ignored. limiting names the group that runs out first. */
export const maxLoad = (r: Rig, lim: RigLimits): { max: number; limiting: string } | null => {
  const unit = axleLoads({ ...r, load: 1, emptySteer: 0, emptyDrive: 0, emptyTrailer: 0 });
  const empt = { steer: r.emptySteer, drive: r.emptyDrive, trailer: r.emptyTrailer, gross: r.emptySteer + r.emptyDrive + r.emptyTrailer };
  const share = { steer: unit.steer, drive: unit.drive, trailer: unit.trailer, gross: 1 };
  const names: Record<string, string> = { steer: 'the steer axle', drive: 'the drive group', trailer: 'the trailer group', gross: 'the gross weight' };
  let best: { max: number; limiting: string } | null = null;
  (['steer', 'drive', 'trailer', 'gross'] as const).forEach((k) => {
    if (!(lim[k] > 0) || !(share[k] > 1e-9)) return;
    const m = (lim[k] - empt[k]) / share[k];
    if (!best || m < best.max) best = { max: m, limiting: names[k] };
  });
  return best && (best as { max: number }).max >= 0 ? best : best ? { max: 0, limiting: (best as { limiting: string }).limiting } : null;
};

/** Range of load positions (kingpin to load centre) where the four simple limits all hold, scanned in
 * 'steps' even steps along the trailer. Returns null when no position works. */
export const legalRange = (r: Rig, lim: RigLimits, steps = 200): { from: number; to: number } | null => {
  let from = NaN, to = NaN;
  for (let i = 0; i <= steps; i++) {
    const at = (r.kpToTrailer * i) / steps, a = axleLoads({ ...r, loadAt: at });
    const ok = (!(lim.steer > 0) || a.steer <= lim.steer) && (!(lim.drive > 0) || a.drive <= lim.drive) && (!(lim.trailer > 0) || a.trailer <= lim.trailer) && (!(lim.gross > 0) || a.gross <= lim.gross);
    if (ok) { if (Number.isNaN(from)) from = at; to = at; }
  }
  return Number.isNaN(from) ? null : { from, to };
};

/** Read pasted lines like "TX, 1200, 150, 0.20" (comma, tab or semicolon). Numbers may have thousands commas
 * (commas inside numbers are fine) only when the separator is a tab or semicolon. Lines without a name and a distance are skipped. */
export const parseJuris = (text: string): Juris[] => {
  const out: Juris[] = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim(); if (!t) continue;
    const parts = t.split(/\t|;/.test(t) ? /\t|;/ : /,/).map((p) => p.trim());
    const num = (v: string | undefined) => { const x = parseFloat((v || '').replace(/[^0-9.\-]/g, '')); return Number.isFinite(x) ? x : 0; };
    if (parts.length < 2 || !parts[0] || !/\d/.test(parts[1])) continue;
    out.push({ name: parts[0], distance: num(parts[1]), fuel: num(parts[2]), rate: num(parts[3]) });
  }
  return out;
};

/** The return as CSV text (one row per jurisdiction plus the net). */
export const iftaCsv = (r: ReturnType<typeof ifta>): string => {
  const q = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  const rows = ['Jurisdiction,Distance,Fuel bought,Rate,Taxable fuel,Net fuel,Tax (negative is credit)'];
  r.lines.forEach((l) => rows.push([q(l.name), l.distance, l.fuel, l.rate, l.taxable, l.net, l.tax.toFixed(2)].join(',')));
  rows.push(`Net,,,,,,${r.net.toFixed(2)}`);
  return rows.join('\n');
};
