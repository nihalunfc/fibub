// Kinship: kin type codes from Ego checked against a separate networkx implementation (Dijkstra over parent,
// child, sibling and spouse links; scratch script kin_check.py, 2026-11-09), on the made-up example family and
// on a random 43-person pedigree (path costs). Layout checked for its rules (spouses side by side, generations
// in rows, no overlaps).
import { relations, layout, validate, unions, fromJson, toJson } from '../../src/lib/sci/kinship.ts';

const EXAMPLE = {"ego":"p1","people":[{"id":"p1","name":"Ravi","sex":"m","parents":["p2","p3"]},{"id":"p2","name":"Arun","sex":"m","dead":true,"parents":["p10","p11"]},{"id":"p3","name":"Bina","sex":"f","parents":["p13"]},{"id":"p4","name":"Chetan","sex":"m","parents":["p10","p11"]},{"id":"p5","name":"Devi","sex":"f","parents":[]},{"id":"p6","name":"Esha","sex":"f","parents":["p4","p5"]},{"id":"p7","name":"Farah","sex":"f","parents":["p13"]},{"id":"p8","name":"Gopal","sex":"m","parents":[]},{"id":"p9","name":"Hari","sex":"m","parents":["p7","p8"]},{"id":"p10","name":"Lalit","sex":"m","dead":true,"parents":[]},{"id":"p11","name":"Meera","sex":"f","parents":[]},{"id":"p13","name":"Noor","sex":"u","parents":[]},{"id":"p14","name":"Isha","sex":"f","parents":["p2","p3"]},{"id":"p15","name":"Jaya","sex":"f","parents":[]},{"id":"p16","name":"Kiran","sex":"m","parents":["p1","p15"]}],"marriages":[{"a":"p10","b":"p11"},{"a":"p2","b":"p3"},{"a":"p4","b":"p5"},{"a":"p8","b":"p7","divorced":true},{"a":"p1","b":"p15"}]};
const RANDOM = {"ego":"r21","people":[{"id":"r0","sex":"m","parents":[]},{"id":"r1","sex":"m","parents":[]},{"id":"r2","sex":"f","parents":[]},{"id":"r3","sex":"f","parents":[]},{"id":"r4","sex":"m","parents":[]},{"id":"r5","sex":"m","parents":[]},{"id":"r6","sex":"u","parents":["r4","r5"]},{"id":"r7","sex":"u","parents":["r4"]},{"id":"r8","sex":"m","parents":["r4","r5"]},{"id":"r9","sex":"f","parents":["r0","r1"]},{"id":"r10","sex":"u","parents":["r0","r1"]},{"id":"r11","sex":"m","parents":["r0","r1"]},{"id":"r12","sex":"m","parents":["r2","r3"]},{"id":"r13","sex":"m","parents":["r2","r3"]},{"id":"r14","sex":"f","parents":["r2","r3"]},{"id":"r15","sex":"f","parents":[]},{"id":"r16","sex":"f","parents":[]},{"id":"r17","sex":"u","parents":["r16","r10"]},{"id":"r18","sex":"u","parents":["r16"]},{"id":"r19","sex":"u","parents":["r9","r7"]},{"id":"r20","sex":"u","parents":["r9","r7"]},{"id":"r21","sex":"f","parents":["r11","r6"]},{"id":"r22","sex":"f","parents":["r11","r6"]},{"id":"r23","sex":"m","parents":["r11"]},{"id":"r24","sex":"u","parents":["r14","r8"]},{"id":"r25","sex":"u","parents":["r14"]},{"id":"r26","sex":"u","parents":["r14"]},{"id":"r27","sex":"m","parents":["r13","r15"]},{"id":"r28","sex":"m","parents":["r13","r15"]},{"id":"r29","sex":"u","parents":["r13","r15"]},{"id":"r30","sex":"m","parents":[]},{"id":"r31","sex":"m","parents":[]},{"id":"r32","sex":"u","parents":["r21","r26"]},{"id":"r33","sex":"f","parents":["r28","r20"]},{"id":"r34","sex":"u","parents":["r19"]},{"id":"r35","sex":"f","parents":["r19","r17"]},{"id":"r36","sex":"f","parents":["r25","r23"]},{"id":"r37","sex":"u","parents":["r29","r22"]},{"id":"r38","sex":"f","parents":["r18","r31"]},{"id":"r39","sex":"m","parents":["r27","r30"]},{"id":"r40","sex":"f","parents":["r27","r30"]},{"id":"r41","sex":"m","parents":[]},{"id":"r42","sex":"f","parents":[]}],"marriages":[{"a":"r4","b":"r5"},{"a":"r0","b":"r1"},{"a":"r2","b":"r3"},{"a":"r16","b":"r10"},{"a":"r9","b":"r7"},{"a":"r11","b":"r6"},{"a":"r14","b":"r8"},{"a":"r13","b":"r15"},{"a":"r21","b":"r26"},{"a":"r28","b":"r20"},{"a":"r19","b":"r17"},{"a":"r25","b":"r23"},{"a":"r29","b":"r22"},{"a":"r18","b":"r31"},{"a":"r27","b":"r30"}],"dist":{"r21":0,"r11":1,"r6":1,"r22":1,"r32":1,"r26":1.001,"r0":2,"r1":2,"r9":2,"r10":2,"r23":2,"r4":2,"r5":2,"r8":2,"r37":2,"r29":2.001,"r14":2.001,"r25":2.001,"r19":3,"r20":3,"r17":3,"r36":3,"r7":3,"r24":3,"r16":3.001,"r13":3.001,"r15":3.001,"r27":3.001,"r28":3.001,"r2":3.001,"r3":3.001,"r12":3.001,"r34":4,"r35":4,"r33":4,"r18":4.0009999999999994,"r39":4.0009999999999994,"r40":4.0009999999999994,"r30":4.002,"r38":5.0009999999999994,"r31":5.001999999999999}};

export default async (check) => {
  const ex = { ...EXAMPLE, people: EXAMPLE.people.map((p) => ({ dead: false, ...p })) };
  const nx = { p2: 'F', p3: 'M', p14: 'Z', p16: 'S', p15: 'W', p10: 'FF', p11: 'FM', p4: 'FB', p13: 'MP', p7: 'MZ', p6: 'FBD', p9: 'MZS', p5: 'FBW', p8: 'MZH' };
  const R = relations(ex);
  check('kinship: example kin types match networkx', Object.entries(nx).every(([id, c]) => R.get(id).code === c) && R.get('p1').code === 'Ego');
  check("kinship: words and generations", R.get('p6').words === "father's brother's daughter" && R.get('p6').generation === 0 && R.get('p10').generation === 2 && R.get('p16').generation === -1);
  check('kinship: affinal relatives marked', R.get('p5').affinal && R.get('p15').affinal && !R.get('p6').affinal);
  check('kinship: example validates', validate(ex).length === 0);
  // Random pedigree: path costs (steps + 0.001 per spouse link) equal networkx's shortest distances.
  const rk = { ego: RANDOM.ego, people: RANDOM.people.map((p) => ({ name: p.id, ...p })), marriages: RANDOM.marriages };
  const RR = relations(rk);
  let ok = true, reached = 0;
  for (const p of rk.people) {
    const r = RR.get(p.id), want = RANDOM.dist[p.id];
    if (want === undefined) { ok &&= r.code === ''; continue; }
    reached++;
    const cost = p.id === rk.ego ? 0 : r.code.length + 0.001 * [...r.code].filter((c) => 'HWE'.includes(c)).length;
    ok &&= Math.abs(cost - want) < 1e-9;
  }
  check(`kinship: random pedigree shortest chains match networkx (${reached} reached)`, ok && reached === Object.keys(RANDOM.dist).length);
  // Layout rules.
  for (const [name, k] of [['example', ex], ['random', rk]]) {
    const L = layout(k, 100, 20);
    const byGen = new Map();
    for (const p of L.pos.values()) { if (!byGen.has(p.gen)) byGen.set(p.gen, []); byGen.get(p.gen).push(p.x); }
    const noOverlap = [...byGen.values()].every((xs) => xs.sort((a, b) => a - b).every((x, i) => !i || x - xs[i - 1] >= 100 - 1e-6));
    const parentsAbove = k.people.every((p) => p.parents.every((q) => L.pos.get(q).gen === L.pos.get(p.id).gen - 1));
    check(`kinship: ${name} layout has no overlaps and parents one row up`, noOverlap && parentsAbove && L.pos.size === k.people.length);
  }
  const L = layout(ex, 100, 20), P = (id) => L.pos.get(id);
  check('kinship: couples side by side', [['p10', 'p11'], ['p2', 'p3'], ['p1', 'p15']].every(([a, b]) => Math.abs(P(a).x - P(b).x) === 100 && P(a).gen === P(b).gen));
  check('kinship: an only child sits under its parents', Math.abs(P('p16').x - (P('p1').x + P('p15').x) / 2) < 1e-6);
  check('kinship: unions include a single-parent family', unions(ex).some((u) => u.a === 'p13' && u.b === null && u.children.length === 2));
  check('kinship: JSON round trip', JSON.stringify(fromJson(toJson(ex))) === JSON.stringify({ ego: ex.ego, people: ex.people.map((p) => ({ id: p.id, name: p.name, sex: p.sex, dead: !!p.dead, parents: p.parents })), marriages: ex.marriages.map((m) => ({ a: m.a, b: m.b, divorced: !!m.divorced })) }));
  let m = '';
  try { fromJson('{"people":[{"id":"a","parents":["b"]},{"id":"b","parents":["a"]}],"marriages":[]}'); } catch (e) { m = e.message; }
  check('kinship: a loop of ancestors is refused', /own ancestor/.test(m));
  m = ''; try { fromJson('[1,2]'); } catch (e) { m = e.message; }
  check('kinship: not a kinship file', /not a kinship diagram file/.test(m));
};
