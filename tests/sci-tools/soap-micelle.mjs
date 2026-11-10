// #1297 Soap and micelles (teaching model with made-up round numbers: 20 single molecules before micelles form,
// 24 per micelle). Checked by hand: 300 soap, 50 hardness ions → 100 used as scum, 200 free, 7 micelles.
import { wash, soapNeeded, CMC, AGG } from '../../src/lib/sci/micelle-school.ts';
export default async (check) => {
  const w = wash({ soap: 300, hard: 50, oil: 5, detergent: false });
  check('micelle: 50 ions take 100 soap; 200 free; (200 − 20)/24 → 7 micelles; 5 drops lifted', w.used === 100 && w.scumIons === 50 && w.free === 200 && w.micelles === 7 && w.lifted === 5 && w.clean);
  const d = wash({ soap: 300, hard: 50, oil: 5, detergent: true });
  check('micelle: detergent makes no scum, 11 micelles', d.used === 0 && d.free === 300 && d.micelles === 11);
  const h = wash({ soap: 80, hard: 40, oil: 2, detergent: false });
  check('micelle: very hard water uses all the soap: no micelles, oil stays', h.used === 80 && h.free === 0 && h.micelles === 0 && h.leftOil === 2 && !h.clean);
  check('micelle: below the threshold no micelles form', wash({ soap: CMC, hard: 0, oil: 1, detergent: false }).micelles === 0 && wash({ soap: CMC + AGG, hard: 0, oil: 1, detergent: false }).micelles === 1);
  let ok = true;
  for (let oil = 0; oil < 6; oil++) for (let hard = 0; hard < 60; hard += 7) { const n = soapNeeded(oil, hard); if (!wash({ soap: n, hard, oil, detergent: false }).clean || (oil > 0 && wash({ soap: n - 1, hard, oil, detergent: false }).clean)) ok = false; }
  check('micelle: soapNeeded is exactly the least soap that cleans', ok);
};
