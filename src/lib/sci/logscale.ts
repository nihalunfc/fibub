// Log scaling: board-foot log rules written as formulas (no volume tables) and cubic volume by Smalian, Huber and
// Newton. Board-foot rules take the small-end diameter inside bark in inches and the length in feet.

/** Doyle rule: (D − 4)² × L / 16 board feet. Zero for logs of 4 inches or less. */
export const doyle = (D: number, L: number) => (D > 4 ? ((D - 4) ** 2 * L) / 16 : 0);

/** Scribner formula rule (not the Scribner Decimal C table): (0.79 D² − 2D − 4) × L / 16, never below zero. */
export const scribner = (D: number, L: number) => Math.max(0, ((0.79 * D * D - 2 * D - 4) * L) / 16);

/** International 1/8-inch rule for one 4-foot section of small-end diameter d: 0.22 d² − 0.71 d (Clark 1906). */
const section = (d: number) => Math.max(0, 0.22 * d * d - 0.71 * d);
/**
 * International 1/4-inch rule, formula version: the log is split into 4-foot sections from the small end, each
 * 1/2 inch wider than the one before (the rule's built-in taper); each section is 0.22 d² − 0.71 d board feet for a
 * 1/8-inch saw kerf, × 0.905 for a 1/4-inch kerf. A leftover piece shorter than 4 ft gets its share (length / 4) of
 * the next section's volume.
 */
export function international(D: number, L: number): number {
  const n = Math.floor(L / 4 + 1e-9), r = L - 4 * n;
  let v = 0;
  for (let i = 0; i < n; i++) v += section(D + 0.5 * i);
  if (r > 1e-9) v += (r / 4) * section(D + 0.5 * n);
  return 0.905 * v;
}

/** Cross-section area from a diameter: ft² from inches, or m² from cm. */
export const area = (d: number, imperial: boolean) => (imperial ? (Math.PI * d * d) / 576 : (Math.PI * d * d) / 40000);
/** Smalian: L × (A small + A large) / 2. */
export const smalian = (As: number, Al: number, L: number) => (L * (As + Al)) / 2;
/** Huber: L × A middle. */
export const huber = (Am: number, L: number) => L * Am;
/** Newton: L × (A small + 4 A middle + A large) / 6. */
export const newton = (As: number, Am: number, Al: number, L: number) => (L * (As + 4 * Am + Al)) / 6;

export type Log = { id: string; small: number; length: number; large?: number; mid?: number };
export type LogResult = Log & { doyle: number; intl: number; scrib: number; smalian: number; huber: number; newton: number };

/**
 * Every rule for one log. Imperial: diameters in inches, length in feet, cubic volume in ft³. Metric: diameters in
 * cm, length in m, cubic volume in m³; the board-foot rules then use the diameter and length converted to inches and
 * feet.
 */
export function scaleLog(g: Log, imperial: boolean): LogResult {
  const Din = imperial ? g.small : g.small / 2.54, Lft = imperial ? g.length : g.length / 0.3048;
  const As = area(g.small, imperial), Al = g.large !== undefined ? area(g.large, imperial) : NaN, Am = g.mid !== undefined ? area(g.mid, imperial) : NaN;
  return {
    ...g, doyle: doyle(Din, Lft), intl: international(Din, Lft), scrib: scribner(Din, Lft),
    smalian: Number.isFinite(Al) ? smalian(As, Al, g.length) : NaN,
    huber: Number.isFinite(Am) ? huber(Am, g.length) : NaN,
    newton: Number.isFinite(Al) && Number.isFinite(Am) ? newton(As, Am, Al, g.length) : NaN,
  };
}
