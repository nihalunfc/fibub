// Checks for src/lib/learn/curr-maths.ts (bearings, cumulative frequency, iteration, surds) against hand-worked values.
// Run with `node tests/curr-maths.mjs` (Node 22+ strips the TypeScript types itself).
import * as M from '../src/lib/learn/curr-maths.ts';
// Same comparison as isRight() in src/lib/learn/quiz.ts for text answers (that file needs the browser build to import).
const norm = (s) => s.replace(/[−–]/g, '-').replace(/\s+/g, '').toLowerCase();
const isRight = (it, t) => it.text.some((w) => norm(w) === norm(String(t)));

let n = 0, bad = 0;
const ok = (c, msg) => { n++; if (!c) { bad++; console.log('FAIL  ' + msg); } };
const near = (a, b, tol, msg) => ok(Math.abs(a - b) <= tol, `${msg}: got ${a}, want ${b}`);

// Bearings
near(M.bearing(0, 0, 1, 1), 45, 1e-9, 'NE is 045');
near(M.bearing(0, 0, 0, 1), 0, 1e-9, 'north is 000');
near(M.bearing(0, 0, -1, 0), 270, 1e-9, 'west is 270');
near(M.bearing(0, 0, 0, -1), 180, 1e-9, 'south is 180');
near(M.bearing(0, 0, 3, -4), 143.1301, 1e-3, 'bearing 3 east 4 south');
ok(M.fmtBearing(45) === '045°' && M.fmtBearing(0) === '000°' && M.fmtBearing(359.6) === '000°' && M.fmtBearing(270) === '270°', 'three-figure format');
near(M.backBearing(72), 252, 1e-9, 'back of 072'); near(M.backBearing(245), 65, 1e-9, 'back of 245'); near(M.backBearing(180), 0, 1e-9, 'back of 180');
{ const j = M.journey([{ b: 90, d: 4 }, { b: 180, d: 3 }]);
  near(j.end.x, 4, 1e-9, 'journey end x'); near(j.end.y, -3, 1e-9, 'journey end y');
  near(j.backDist, 5, 1e-9, 'journey 3-4-5 distance'); near(j.backBearing, 306.8699, 1e-3, 'journey back bearing 307'); }
{ const c = M.cosineRuleBack(40, 6, 130, 8); near(c.C, 90, 1e-9, 'turn angle 90'); near(c.dist, 10, 1e-9, 'cosine rule 6,8 right angle'); }
{ const a = M.cosineRuleBack(50, 5, 140 + 30, 7), b = M.journey([{ b: 50, d: 5 }, { b: 170, d: 7 }]); near(a.dist, b.backDist, 1e-9, 'cosine rule matches components'); }

// Cumulative frequency: heights, 40 students
const C = { bounds: [140, 150, 160, 170, 180, 190], freq: [4, 9, 14, 9, 4] };
ok(JSON.stringify(M.cumulative(C.freq)) === '[4,13,27,36,40]', 'running totals');
{ const s = M.cfSummary(C, false);
  near(s.n, 40, 0, 'n'); near(s.median, 165, 1e-9, 'median straight'); near(s.q1, 156.6667, 1e-3, 'Q1 straight'); near(s.q3, 173.3333, 1e-3, 'Q3 straight'); near(s.iqr, 16.6667, 1e-3, 'IQR straight'); }
near(M.cfAt(C, 170, false), 27, 1e-9, 'CF at boundary'); near(M.cfAt(C, 170, true), 27, 1e-9, 'smooth CF passes boundary');
near(M.cfAbove(C, 170, false), 13, 1e-9, 'above 170');
near(M.cfPercentile(C, 50, false), 165, 1e-9, '50th percentile'); near(M.cfPercentile(C, 100, true), 190, 1e-6, '100th percentile');
{ const s = M.cfSummary(C, true); ok(s.median > 160 && s.median < 170 && s.q1 < s.median && s.median < s.q3, 'smooth summary in order');
  let mono = true, prev = -1; for (let x = 140; x <= 190; x += 0.5) { const v = M.cfAt(C, x, true); if (v < prev - 1e-9) mono = false; prev = v; } ok(mono, 'smooth curve never decreases'); }

// Iteration
{ const P = Object.fromEntries(M.PRESETS.map((p) => [p.id, p]));
  const xs = M.iterate(P['cubic-a'].gf, 0, 8); near(xs[1], 0.25, 1e-12, 'x1 = (1-0)/4'); near(xs[2], 0.2461, 1e-4, 'x2'); near(xs[8], 0.246266, 1e-5, 'x8 root of x^3+4x-1');
  ok(M.status(M.iterate(P['cubic-a'].gf, 0, 12)) === 'converging', 'cubic-a converges');
  ok(M.status(M.iterate(P['cubic-b'].gf, 0, 12)) !== 'converging', 'cubic-b does not converge');
  near(M.iterate(P['quad-a'].gf, 2, 40)[40], 4.302776, 1e-5, 'sqrt(5x-3) -> 4.3028');
  near(M.iterate(P['quad-b'].gf, 1, 40)[40], 0.697224, 1e-5, '(x^2+3)/5 -> 0.6972');
  ok(M.status(M.iterate(P['quad-b'].gf, 5, 12)) === 'diverging', '(x^2+3)/5 from 5 diverges');
  near(M.slopeAt(P['quad-a'].gf, 4.302776), 0.58104, 1e-3, "g'(4.3028) = 5/(2*4.3028)");
  near(M.slopeAt(P['quad-b'].gf, 0.697224), 0.27889, 1e-3, "g'(0.6972) = 2x/5");
  near(M.rootOf(P['quad-a'].f, 3), 4.302776, 1e-6, 'Newton root'); near(M.rootOf(P['cubic-c'].f, 1), 1.324718, 1e-6, 'plastic number');
  const nw = M.newton(P['cubic-c'].f, 1, 5); near(nw[1], 1.5, 1e-5, 'Newton first step x^3-x-1 from 1 is 1.5'); near(nw[5], 1.324718, 1e-6, 'Newton converges fast');
  ok(M.stepsTo(nw, 1.324718) <= 5, 'Newton in 5 steps'); }
{ const g = M.readG('sqrt(5x - 3)'); ok('g' in g && Math.abs(g.g(4) - Math.sqrt(17)) < 1e-12, 'typed g reads');
  ok('error' in M.readG('2y + 1') && 'error' in M.readG('sqrt('), 'typed g errors'); }

// Surds
ok(JSON.stringify(M.simplifySqrt(72)) === '{"k":6,"m":2}' && M.simplifySqrt(50).k === 5 && M.simplifySqrt(17).k === 1 && M.simplifySqrt(36).m === 1 && M.simplifySqrt(48).k === 4, 'largest square factor');
ok(M.fmtSurd(1, 72) === '6√2' && M.fmtSurd(2, 18) === '6√2' && M.fmtSurd(3, 16) === '12' && M.fmtSurd(1, 7) === '√7', 'format surds');
ok(M.wAdd(3, 2, 5, 2, 1).result === '8√2' && M.wAdd(1, 8, 1, 2, 1).result === '3√2' && M.wAdd(5, 3, 2, 3, -1).result === '3√3' && M.wAdd(1, 2, 1, 3, 1).result === '√2 + √3', 'add and subtract');
ok(M.wMul(2, 3, 4, 6).result === '24√2' && M.wMul(1, 5, 1, 5).result === '5' && M.wMul(3, 2, 2, 3).result === '6√6', 'multiply');
ok(M.wExpand(2, 3, 4, 3).result === '11 + 6√3', '(2+√3)(4+√3) = 8+2√3+4√3+3 = 11+6√3');
ok(M.wExpand(2, 3, 4, 3).value > 0, 'value positive');
near(M.wExpand(3, 5, 3, 5).value, (3 + Math.sqrt(5)) ** 2, 1e-9, 'expand value check');
ok(M.fmtSum(M.mul({ r: 3, s: { 5: -1 } }, { r: 3, s: { 5: 1 } })) === '4', '(3-√5)(3+√5) = 4');
ok(M.wRat1(1, 2).result === '√2/2' && M.wRat1(6, 3).result === '2√3' && M.wRat1(1, 8).result === '√2/4' && M.wRat1(10, 5).result === '2√5', 'rationalise k/√b');
ok(M.wRat2(1, 3, 2, 1).result === '(3 − √2)/7', '1/(3+√2) = (3-√2)/7');
ok(M.wRat2(6, 3, 3, 1).result === '3 − √3', '6/(3+√3) = 3 - √3');
ok(M.wRat2(2, 1, 1, 1) === null, 'zero denominator');
near(M.wRat2(1, 2, 3, -1).value, 1 / (2 - Math.sqrt(3)), 1e-12, '1/(2-√3) value'); ok(M.wRat2(1, 2, 3, -1).result === '2 + √3', '1/(2-√3) = 2+√3');
for (const [k, p, q, s] of [[3, 4, 7, 1], [5, 6, 2, -1], [2, 1, 5, -1], [7, 2, 8, 1]]) { const w = M.wRat2(k, p, q, s); near(M.sumValue(w.sum) / w.den, k / (p + s * Math.sqrt(q)), 1e-9, `rationalise ${k}/(${p}${s > 0 ? '+' : '-'}√${q}) value`); }
for (const [k, b] of [[1, 12], [3, 20], [7, 6]]) { const w = M.wRat1(k, b); near(M.sumValue(w.sum) / w.den, k / Math.sqrt(b), 1e-9, `rationalise ${k}/√${b} value`); }
{ const w = M.wExpand(2, 3, 4, 3); const it = { text: M.sumAnswers(w.sum) };
  ok(['11+6√3', '6√3+11', '11+6sqrt3', '11+6sqrt(3)', '11 + 6√3'].every((a) => isRight(it, a)), 'answer forms for 11 + 6√3');
  ok(isRight({ text: M.sumAnswers(M.term(6, 2)) }, '6 sqrt(2)') && isRight({ text: M.sumAnswers(M.term(6, 2)) }, '6√2'), 'quiz engine accepts 6√2 and sqrt form');
  ok(isRight({ text: M.sumAnswers(M.add({ r: 3, s: {} }, M.term(-2, 5))) }, '3−2√5') && isRight({ text: M.sumAnswers(M.add({ r: 3, s: {} }, M.term(-2, 5))) }, '3-2sqrt5') && isRight({ text: M.sumAnswers(M.add({ r: 3, s: {} }, M.term(-2, 5))) }, '-2√5+3'), 'answer forms for a − b√c'); }

if (bad) { console.log(`${bad} of ${n} checks failed`); process.exit(1); }
console.log(`${n} checks passed`);
