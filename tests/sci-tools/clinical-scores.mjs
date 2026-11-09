// #481 clinical scores: every APGAR and GCS combination. The count of combinations per total was computed
// independently in Python (itertools): APGAR (1+x+x²)⁵ and GCS 4×5×6.
import { APGAR, apgar, gcs, NT, GCS_EYE, GCS_VERBAL_ADULT, GCS_VERBAL_CHILD, GCS_MOTOR_ADULT, GCS_MOTOR_CHILD } from '../../src/lib/sci/clinscores.ts';
export default async (check) => {
  const aCount = Array(11).fill(0), aBand = { low: 0, moderate: 0, reassuring: 0 };
  let aOk = true;
  for (let i = 0; i < 243; i++) {
    const s = [0, 1, 2, 3, 4].map((k) => Math.floor(i / 3 ** k) % 3), r = apgar(s), sum = s.reduce((a, b) => a + b, 0);
    aCount[r.total]++; aBand[r.band]++;
    if (r.total !== sum || r.band !== (sum <= 3 ? 'low' : sum <= 6 ? 'moderate' : 'reassuring')) aOk = false;
  }
  check('APGAR: all 243 combinations sum and band right', aOk);
  check('APGAR: combinations per total match Python 1,5,15,30,45,51,45,30,15,5,1', aCount.join() === '1,5,15,30,45,51,45,30,15,5,1');
  check('APGAR: band sizes match Python 51 / 141 / 51', aBand.low === 51 && aBand.moderate === 141 && aBand.reassuring === 51);
  for (const [t, b] of [[3, 'low'], [4, 'moderate'], [6, 'moderate'], [7, 'reassuring'], [0, 'low'], [10, 'reassuring']]) { const s = [2, 2, 2, 2, 2].map((_, k) => Math.min(2, Math.max(0, t - 2 * k))); check(`APGAR: boundary total ${t} is ${b}`, apgar(s).total === t && apgar(s).band === b); }
  check('APGAR: five signs, 0 to 2 each, best first', APGAR.length === 5 && APGAR.every((it) => it.choices.map((c) => c.v).join() === '2,1,0'));
  let threw = 0; for (const bad of [[3, 0, 0, 0, 0], [0, 0, 0, 0], [1.5, 0, 0, 0, 0], [-1, 0, 0, 0, 0]]) { try { apgar(bad); } catch { threw++; } }
  check('APGAR: bad input refused', threw === 4);

  const gCount = Array(16).fill(0), gBand = { mild: 0, moderate: 0, severe: 0 };
  let gOk = true;
  for (let e = 1; e <= 4; e++) for (let v = 1; v <= 5; v++) for (let m = 1; m <= 6; m++) {
    const r = gcs(e, v, m), t = e + v + m;
    gCount[r.total]++; gBand[r.band]++;
    if (r.total !== t || r.notation !== `E${e}V${v}M${m}` || r.band !== (t <= 8 ? 'severe' : t <= 12 ? 'moderate' : 'mild')) gOk = false;
  }
  check('GCS: all 120 combinations total, notation and band right', gOk);
  check('GCS: combinations per total 3..15 match Python', gCount.slice(3).join() === '1,3,6,10,14,17,18,17,14,10,6,3,1');
  check('GCS: band sizes match Python 51 / 59 / 10', gBand.severe === 51 && gBand.moderate === 59 && gBand.mild === 10);
  check('GCS: E3V4M5 = 12 moderate', gcs(3, 4, 5).notation === 'E3V4M5' && gcs(3, 4, 5).total === 12 && gcs(3, 4, 5).band === 'moderate');
  for (const [s, b] of [[[1, 1, 1], 'severe'], [[2, 2, 4], 'severe'], [[2, 2, 5], 'moderate'], [[4, 4, 4], 'moderate'], [[4, 4, 5], 'mild'], [[4, 5, 6], 'mild']]) check(`GCS: boundary ${s.join('+')} = ${s[0] + s[1] + s[2]} is ${b}`, gcs(...s).band === b);
  check('GCS: not testable verbal gives E3VNTM5 and no total', gcs(3, NT, 5).notation === 'E3VNTM5' && gcs(3, NT, 5).total === null && gcs(3, NT, 5).band === '');
  check('GCS: not testable eyes and motor', gcs(NT, 4, NT).notation === 'ENTV4MNT' && gcs(NT, 4, NT).total === null);
  threw = 0; for (const bad of [[5, 5, 6], [4, 6, 6], [4, 5, 7], [0, 1, 1], [2.5, 1, 1]]) { try { gcs(...bad); } catch { threw++; } }
  check('GCS: out-of-range input refused', threw === 5);
  check('GCS: pickers cover each range plus not testable', [[GCS_EYE, 4], [GCS_VERBAL_ADULT, 5], [GCS_VERBAL_CHILD, 5], [GCS_MOTOR_ADULT, 6], [GCS_MOTOR_CHILD, 6]].every(([c, n]) => c.length === n + 1 && c.filter((x) => x.v !== NT).map((x) => x.v).join() === Array.from({ length: n }, (_, i) => n - i).join()));
};
