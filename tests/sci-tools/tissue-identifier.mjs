// #1255 Tissue identifier. Data checks: 15 tissues with unique ids, 2 to 4 features inside the drawing, drawings made
// only of known shapes with finite numbers, the same drawing for the same seed, and fair answer choices.
import { TISSUES, byId, choicesFor, rng, MUSCLES } from '../../src/lib/sci/tissues.ts';

export default async (check) => {
  check('15 tissues, ids unique, 7 plant and 8 animal', TISSUES.length === 15 && new Set(TISSUES.map((t) => t.id)).size === 15 && TISSUES.filter((t) => t.group === 'plant').length === 7);
  check('every tissue has 2 to 4 features inside the 300 × 200 drawing', TISSUES.every((t) => t.features.length >= 2 && t.features.length <= 4 && t.features.every((f) => f.x >= 8 && f.x <= 292 && f.y >= 8 && f.y <= 192)));
  check('every tissue says where and what', TISSUES.every((t) => t.where.length > 10 && t.job.length > 10 && t.type.length > 5));
  let ok = true;
  for (const t of TISSUES) {
    const a = t.draw(rng(5)), b = t.draw(rng(5));
    if (a.length < 5 || JSON.stringify(a) !== JSON.stringify(b)) ok = false;
    for (const s of a) {
      if (!['circle', 'ellipse', 'rect', 'path', 'line', 'polygon'].includes(s.t) || !s.c.startsWith('tz-')) ok = false;
      for (const v of Object.values(s.a)) if (typeof v === 'number' && !Number.isFinite(v)) ok = false;
      if (typeof s.a.d === 'string' && /NaN|undefined/.test(s.a.d)) ok = false;
      if (typeof s.a.points === 'string' && /NaN/.test(s.a.points)) ok = false;
    }
  }
  check('drawings: known shapes, finite numbers, same for the same seed', ok);
  let fair = true;
  const r = rng(11);
  for (let i = 0; i < 300; i++) {
    const t = TISSUES[i % 15], c = choicesFor(t.id, r);
    if (c.length !== 4 || new Set(c).size !== 4 || !c.includes(t.id) || !c.every((x) => byId(x))) fair = false;
  }
  check('identify: 4 different choices, the right one always there', fair);
  check('muscle table: 3 types, 6 rows of facts', MUSCLES.length === 7 && MUSCLES.every((r) => r.length === 4));
  const v = rng(3); const xs = Array.from({ length: 1000 }, v);
  check('rng in [0, 1)', xs.every((x) => x >= 0 && x < 1) && new Set(xs).size > 990);
};
