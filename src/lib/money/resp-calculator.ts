// #1738 RESP and CESG: plain maths, no DOM. Rules checked on canada.ca 2026-11-10.
export const CESG_RATE = 0.2, CESG_ROOM = 500, CESG_YEAR_MAX = 1000, CESG_LIFE = 7200, RESP_LIFE = 50000;
/** Additional CESG on the first $500 a year, by 2026 adjusted family net income (CRA's first and second federal brackets). */
export const ACESG_BANDS = [
  { id: 'low', label: '$58,523 or less', rate: 0.2 },
  { id: 'mid', label: '$58,524 to $117,045', rate: 0.1 },
  { id: 'high', label: 'more than $117,045', rate: 0 },
] as const;
export const CLB_FIRST = 500, CLB_YEAR = 100, CLB_MAX = 2000, CLB_LAST_AGE = 15;

export type RespIn = {
  age: number; until: number; perYear: number; lump: number; rate: number;
  band: 'low' | 'mid' | 'high'; clb: boolean; received: number; // CESG already received
};
export type RespRow = { age: number; put: number; cesg: number; acesg: number; clb: number; balance: number };
export type RespOut = { rows: RespRow[]; put: number; cesg: number; acesg: number; clb: number; balance: number; capYear: number | null; noGrant: boolean; capped: boolean };

/** One row per year the child is age a .. until-1. Money goes in at the start of the year with the grants. */
export function resp(a: RespIn): RespOut {
  const g = 1 + a.rate / 100;
  const extra = ACESG_BANDS.find((b) => b.id === a.band)?.rate ?? 0;
  const noGrant = a.age >= 16 && a.received <= 0; // 16 and 17 year olds need earlier savings to qualify
  let room = Math.max(0, CESG_ROOM * a.age - a.received), total = Math.min(CESG_LIFE, Math.max(0, a.received));
  let bal = 0, put = 0, cesg = 0, acesg = 0, clb = 0, life = 0, capYear: number | null = null, capped = false;
  const rows: RespRow[] = [];
  for (let k = 0; k < Math.round(a.until - a.age); k++) {
    const age = a.age + k;
    let c = a.perYear + (k === 0 ? a.lump : 0);
    if (life + c > RESP_LIFE) { c = Math.max(0, RESP_LIFE - life); capped = true; }
    life += c;
    room += CESG_ROOM;
    let basic = 0, add = 0;
    if (age <= 17 && !noGrant) {
      basic = Math.min(CESG_RATE * c, CESG_YEAR_MAX, room, CESG_LIFE - total);
      room -= basic; total += basic;
      add = Math.min(extra * Math.min(c, 500), CESG_LIFE - total);
      total += add;
      if (capYear === null && total >= CESG_LIFE - 0.005) capYear = age;
    }
    let bond = 0;
    if (a.clb && age <= CLB_LAST_AGE) bond = Math.min(k === 0 ? CLB_FIRST : CLB_YEAR, CLB_MAX - clb);
    put += c; cesg += basic; acesg += add; clb += bond;
    bal = (bal + c + basic + add + bond) * g;
    rows.push({ age, put: c, cesg: basic, acesg: add, clb: bond, balance: bal });
  }
  return { rows, put, cesg, acesg, clb, balance: bal, capYear, noGrant, capped };
}
