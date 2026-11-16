// Extra maths for the meeting cost tool. Plain TypeScript, no DOM.

export interface Role { count: number; pay: number }

/** Several roles with different pay: total people and the average pay per person (same unit as `pay`). Null when no role has people. */
export function rolesAverage(roles: Role[]) {
  const ok = roles.filter((r) => r.count > 0 && Number.isFinite(r.count) && r.pay >= 0 && Number.isFinite(r.pay));
  const people = ok.reduce((a, r) => a + r.count, 0);
  if (!(people > 0)) return null;
  return { people, avgPay: ok.reduce((a, r) => a + r.count * r.pay, 0) / people };
}

/** What a shorter meeting saves: cost of `cutMin` minutes per meeting and over a year of `times` meetings. */
export function shorterSaves(perMinute: number, cutMin: number, minutes: number, times: number) {
  const cut = Math.min(Math.max(0, cutMin), Math.max(0, minutes));
  const perMeeting = perMinute * cut;
  return { perMeeting, perYear: perMeeting * Math.max(0, times) };
}
