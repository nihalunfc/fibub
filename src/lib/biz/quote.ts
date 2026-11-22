// Is a group or bulk order worth it once you count the regular customers it pushes out?
export type Night = { date: string; demand: number; price: number; group: number };
export type Offer = { rate: number; pickup: number; resale: number; commission: number; hurdle: number };
export type Extras = { a: number; b: number; c: number; margin: number };
export type QuoteIn = { capacity: number; varCost: number; channel: number; nights: Night[]; offer: Offer; extras: Extras };
const NEG_BAND = 0.10; // within 10% below break-even is "Negotiate"

export function quote(x: QuoteIn) {
  const { capacity: C, varCost, channel, nights, offer: o, extras: e } = x;
  const extrasRev = e.a + e.b + e.c, extrasProfit = (extrasRev * e.margin) / 100;
  const gpp = o.rate * (1 - o.commission / 100) - varCost + extrasProfit; // group profit per unit
  const rows = nights.map((n) => {
    const req = Math.min(n.group, C);
    const g = (req * o.pickup) / 100;                                     // units the group is expected to use
    const held = Math.min(C, g + (req - g) * (1 - o.resale / 100));       // units kept back for the group
    const without = Math.min(n.demand, C), withG = Math.min(n.demand, Math.max(0, C - held));
    const displaced = without - withG;
    const tpp = n.price * (1 - channel / 100) - varCost;
    const lostRev = displaced * n.price, lostProfit = displaced * tpp;
    const groupRev = g * (o.rate + extrasRev), groupProfit = g * gpp;
    return { ...n, req, g, held, without, withG, displaced, tpp, lostRev, lostProfit, groupRev, groupProfit, net: groupProfit - lostProfit, netRev: groupRev - lostRev };
  });
  const keys = ['g', 'held', 'displaced', 'lostRev', 'lostProfit', 'groupRev', 'groupProfit', 'net', 'netRev', 'demand', 'req'] as const;
  const T = Object.fromEntries(keys.map((k) => [k, rows.reduce((a, r) => a + (r as any)[k], 0)])) as Record<(typeof keys)[number], number>;
  const keep = 1 - o.commission / 100;
  const be = T.g > 0 && keep > 0 ? (T.lostProfit + T.g * (varCost - extrasProfit)) / (T.g * keep) : null;
  const beRate = be == null ? null : Math.max(0, be);
  const target = beRate == null ? null : beRate * (1 + o.hurdle / 100);
  let verdict: 'Accept' | 'Negotiate' | 'Decline' = 'Accept';
  if (beRate != null && target != null) {
    if (o.rate >= target - 1e-9) verdict = 'Accept';
    else if (o.rate >= beRate * (1 - NEG_BAND)) verdict = 'Negotiate';
    else verdict = 'Decline';
  }
  const counter = target == null ? null : Math.max(o.rate, Math.ceil(target / 5) * 5);
  const gap = target == null ? 0 : Math.max(0, (target - o.rate) * keep * T.g);
  const extrasNeeded = T.g > 0 && e.margin > 0 ? gap / ((T.g * e.margin) / 100) : null; // extra spend per unit that closes the gap at their rate
  return { rows, T, beRate, target, verdict, counter, extrasNeeded, extrasRev, extrasProfit, gpp };
}

export function problems(x: QuoteIn): string[] {
  const w: string[] = [], o = x.offer, e = x.extras;
  const ok = (v: number) => Number.isFinite(v);
  if (!ok(x.capacity) || x.capacity < 1 || x.capacity % 1) w.push('Capacity must be a whole number of 1 or more.');
  if (!ok(x.varCost) || x.varCost < 0) w.push('Cost to serve one unit can not be blank or negative.');
  if (!ok(x.channel) || x.channel < 0 || x.channel >= 100) w.push('Selling cost on regular sales must be between 0 and 99%.');
  if (!ok(o.rate) || o.rate < 0) w.push('The group price can not be blank or negative.');
  if (!ok(o.pickup) || o.pickup <= 0 || o.pickup > 100) w.push('Expected take-up must be more than 0 and at most 100%.');
  if (!ok(o.resale) || o.resale < 0 || o.resale > 100) w.push('Resell share must be between 0 and 100%.');
  if (!ok(o.commission) || o.commission < 0 || o.commission >= 100) w.push('Commission must be between 0 and 99%.');
  if (!ok(o.hurdle) || o.hurdle < 0 || o.hurdle > 200) w.push('Safety margin must be between 0 and 200%.');
  if ([e.a, e.b, e.c].some((v) => !ok(v) || v < 0)) w.push('Extra spend can not be blank or negative.');
  if (!ok(e.margin) || e.margin < 0 || e.margin > 100) w.push('Profit margin on extras must be between 0 and 100%.');
  if (!x.nights.length) w.push('Add at least one day.');
  const bad: string[] = [];
  x.nights.forEach((n, i) => {
    const l = n.date || `day ${i + 1}`;
    if (!(ok(n.demand) && n.demand >= 0)) bad.push(`${l}: regular demand`);
    if (!(ok(n.price) && n.price >= 0)) bad.push(`${l}: regular price`);
    if (!(ok(n.group) && n.group >= 0 && n.group % 1 === 0)) bad.push(`${l}: group size (whole number)`);
  });
  if (bad.length) w.push('Check these values: ' + bad.join('; ') + '.');
  if (x.nights.length && x.nights.every((n) => !(n.group > 0))) w.push('The group has not asked for anything yet.');
  return [...new Set(w)];
}
