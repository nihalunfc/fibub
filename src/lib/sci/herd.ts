// Herd immunity threshold and vaccine coverage, for a well-mixed population (no age or contact structure).
// Threshold 1 − 1/R0: Anderson and May (1985), Nature 318: 323-329; Fine (1993), Epidemiologic Reviews 15: 265-302.
// Coverage needed with an imperfect vaccine, Vc = (1 − 1/R0) / E, and effective R = R0 (1 − c·E), where E is the
// vaccine effectiveness against transmission (all-or-nothing protection in a share E of those vaccinated).

/** Share of the population that must be immune for each case to infect fewer than one other on average. */
export const threshold = (R0: number) => (R0 > 1 ? 1 - 1 / R0 : 0);
/** Vaccine coverage needed to reach the threshold with effectiveness E (0..1); above 1 means it cannot be reached. */
export const coverageNeeded = (R0: number, E: number) => threshold(R0) / E;
/** Effective reproduction number with coverage c and effectiveness E, everyone else susceptible. */
export const effectiveR = (R0: number, c: number, E: number) => R0 * (1 - c * E);
/** Highest R0 that coverage c with effectiveness E can hold below 1. */
export const maxR0 = (c: number, E: number) => (c * E >= 1 ? Infinity : 1 / (1 - c * E));

export type HerdRow = { name: string; R0: number; hit: number; need: number; reachable: boolean; Re: number; below: boolean };

export function table(rows: { name: string; R0: number }[], E: number, c: number): HerdRow[] {
  return rows.map(({ name, R0 }) => {
    const need = coverageNeeded(R0, E), Re = effectiveR(R0, c, E);
    return { name, R0, hit: threshold(R0), need, reachable: need <= 1, Re, below: Re < 1 };
  });
}

/** Read "name, R0" lines (name optional). */
export function parseRows(text: string): { rows: { name: string; R0: number }[]; error: string | null } {
  const rows: { name: string; R0: number }[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const l = raw.trim(); if (!l || l.startsWith('#')) continue;
    const m = /^(.*?)[,;\t:]?\s*([-+]?\d*\.?\d+(?:e[-+]?\d+)?)\s*$/i.exec(l);
    if (!m) return { rows, error: `Could not read "${l}". Write a name, then the R0, for example "Example A, 3".` };
    const R0 = Number(m[2]);
    if (!(R0 > 0) || R0 > 100) return { rows, error: `"${l}": R0 must be above 0 and at most 100.` };
    rows.push({ name: m[1].replace(/[,;:\t]\s*$/, '').trim() || `Row ${rows.length + 1}`, R0 });
  }
  if (rows.length > 30) return { rows, error: 'Up to 30 rows.' };
  return { rows, error: null };
}
