// Saving in one currency for a goal in another (used only by #T766 Savings goal).
// rate0: how many units of your currency buy 1 unit of the goal's currency today.
// driftPct: expected yearly change in that rate (+ means the goal's currency gets dearer for you).
// Each monthly deposit is changed at that month's rate and earns the account's interest in the goal's currency.
export type FxGoal = { perMonth: number; flat: number; diffMonth: number; diffTotal: number };
export function fxMonthly(target: number, start: number, annualRate: number, months: number, due: boolean, rate0: number, driftPct: number): FxGoal | null {
  if (!(rate0 > 0) || !(months >= 1) || !(driftPct > -100)) return null;
  const i = annualRate / 1200, g = 1 + driftPct / 100;
  const need = Math.max(0, target - start * Math.pow(1 + i, months));
  let denom = 0, flatDenom = 0;
  for (let k = due ? 0 : 1; k <= (due ? months - 1 : months); k++) {
    const grow = Math.pow(1 + i, months - k);
    denom += grow / (rate0 * Math.pow(g, k / 12));
    flatDenom += grow / rate0;
  }
  const perMonth = need / denom, flat = need / flatDenom;
  return { perMonth, flat, diffMonth: perMonth - flat, diffTotal: (perMonth - flat) * months };
}
