// #470 Randomisation list: the generator against the reference C code of xoshiro128** (Blackman and Vigna), whole
// lists against an independent Python reimplementation of the documented algorithm (randomisation-list.ref.json,
// made by /tmp/claude-0/a4/rl_ref.py), plus reproducibility, block balance, ratios and uniformity.
import { readFileSync } from 'node:fs';
import { Xoshiro128ss, fnv1a, rngFromText, makeList, stratumList, strata, parseRatio } from '../../src/lib/sci/randomise.ts';

export default async (check) => {
  const R = JSON.parse(readFileSync(new URL('./randomisation-list.ref.json', import.meta.url), 'utf8'));
  { const x = new Xoshiro128ss([1, 2, 3, 4]); const v = Array.from({ length: 10 }, () => x.next()); check('randomise: xoshiro128** from state 1,2,3,4 = reference C (11520, 0, 5927040, ...)', v.join() === R.vec.join() && v[0] === 11520 && v[9] === 4258142804); }
  { const x = new Xoshiro128ss([0xdeadbeef, 0x12345678, 0xcafebabe, 0x0badf00d]); for (let i = 0; i < 1000; i++) x.next(); check('randomise: xoshiro128** 1001st and 1002nd outputs = reference C', x.next() === 3651887776 && x.next() === 234329462); }
  check('randomise: FNV-1a 32 ("", "a", "trial-2026") = Python', fnv1a('') === 2166136261 && fnv1a('a') === 0xe40c292c && fnv1a('trial-2026') === R.fnv[2]);
  for (const c of R.cases) {
    const got = stratumList({ arms: c.ratio.map((_, i) => `Arm ${i + 1}`), ratio: c.ratio, method: c.method, blockSizes: c.sizes, perStratum: c.N, factors: [], seed: c.seed }, c.st).map((a) => a.arm);
    check(`randomise: ${c.method} ${c.ratio.join(':')} seed "${c.seed}" ${c.st || ''} = Python list`, got.join() === c.list.join());
  }
  { // The page's example: seed my-trial-2026, 1:1, random blocks of 4 or 6, 40 per stratum (Python lists).
    const o = { arms: ['T', 'C'], ratio: [1, 1], method: 'random-blocks', blockSizes: [4, 6], perStratum: 40, factors: [{ name: 'Site', levels: ['Clinic 1', 'Clinic 2'] }, { name: 'Age', levels: ['under 65', '65 or over'] }], seed: 'my-trial-2026' };
    const l = makeList(o).list, str = (s) => l.filter((x) => x.stratum === s).map((x) => x.arm).join('');
    check('randomise: page example strata = Python', str('Site: Clinic 1, Age: under 65') === 'TCTTCCCTCTCTCTTCTCCTCTTTTCCCTCTCCTCCTTTC' && str('Site: Clinic 2, Age: 65 or over') === 'TCCTTTCTCCCCCTTTCCTTCTTCCTTTCCTCCCTCTTCT'); }
  const base = { arms: ['Drug', 'Placebo'], ratio: [1, 1], method: 'blocks', blockSizes: [4], perStratum: 40, factors: [], seed: 'trial-2026' };
  { const a = makeList(base).list.map((x) => x.arm).join(), b = makeList({ ...base }).list.map((x) => x.arm).join(), c = makeList({ ...base, seed: 'trial-2027' }).list.map((x) => x.arm).join();
    check('randomise: same seed gives the same list, another seed a different one', a === b && a !== c); }
  // Every complete block holds the arms in the exact ratio.
  const blocksOk = (list, ratio) => { const by = new Map(); for (const x of list) { const k = `${x.stratum}#${x.block}`; if (!by.has(k)) by.set(k, []); by.get(k).push(x); }
    for (const b of by.values()) { if (b.length !== b[0].blockSize) continue; const m = b[0].blockSize / ratio.reduce((s, v) => s + v, 0); const cnt = ratio.map(() => 0); b.forEach((x) => cnt[x.armIndex]++); if (cnt.some((v, i) => v !== ratio[i] * m)) return false; } return true; };
  let allOk = true, sizesSeen = new Set(), maxImb = 0;
  for (let s = 0; s < 200; s++) {
    const o = { arms: ['A', 'B', 'C'], ratio: [2, 1, 1], method: 'random-blocks', blockSizes: [4, 8, 12], perStratum: 97, factors: [{ name: 'Site', levels: ['1', '2'] }], seed: `bal-${s}` };
    const { list, summary } = makeList(o);
    if (!blocksOk(list, o.ratio)) allOk = false;
    list.forEach((x) => sizesSeen.add(x.blockSize));
    maxImb = Math.max(maxImb, ...summary.map((t) => t.maxImbalance));
  }
  check('randomise: 200 random-block lists (2:1:1, sizes 4/8/12): every complete block in exact ratio', allOk);
  check('randomise: all three block sizes are used', sizesSeen.size === 3);
  check(`randomise: running imbalance never above half the largest block (${maxImb})`, maxImb <= 6);
  { const { summary } = makeList({ ...base, perStratum: 42 }); check('randomise: 42 in blocks of 4: 21/21, last block cut short and flagged', summary[0].counts.join() === '21,21' && summary[0].blocks === 11 && !summary[0].lastBlockComplete); }
  { const { summary } = makeList({ ...base, ratio: [2, 1], blockSizes: [6], perStratum: 60 }); check('randomise: 2:1 ratio in blocks of 6 gives 40/20 exactly', summary[0].counts.join() === '40,20' && summary[0].lastBlockComplete); }
  // Simple randomisation: about the ratio, chi-square goodness of fit over 30,000 draws.
  { const { summary } = makeList({ ...base, method: 'simple', ratio: [2, 1, 1], arms: ['A', 'B', 'C'], perStratum: 10000, factors: [{ name: 'S', levels: ['x', 'y'] }] });
    const c = [0, 1, 2].map((k) => summary.reduce((s, t) => s + t.counts[k], 0)), e = [10000, 5000, 5000];
    const chi = c.reduce((s, v, i) => s + (v - e[i]) ** 2 / e[i], 0);
    check(`randomise: simple 2:1:1 over 20,000: chi-square ${chi.toFixed(2)} < 13.8 (p > 0.001, 2 df)`, chi < 13.82); }
  { // below(n) is uniform: 60,000 draws of below(6), chi-square with 5 df.
    const r = rngFromText('uniform'), c = Array(6).fill(0); for (let i = 0; i < 60000; i++) c[r.below(6)]++;
    const chi = c.reduce((s, v) => s + (v - 10000) ** 2 / 10000, 0); check(`randomise: below(6) uniform, chi-square ${chi.toFixed(2)} < 20.5`, chi < 20.52); }
  { // Strata use their own streams: changing one stratum's length leaves the others unchanged.
    const f = [{ name: 'Site', levels: ['A', 'B'] }, { name: 'Age', levels: ['under 65', '65 or over'] }];
    check('randomise: strata are the product of the levels', strata(f).join('|') === 'Site: A, Age: under 65|Site: A, Age: 65 or over|Site: B, Age: under 65|Site: B, Age: 65 or over');
    const a = makeList({ ...base, factors: f, perStratum: 20 }).list.filter((x) => x.stratum === 'Site: B, Age: under 65').map((x) => x.arm).join();
    const o2 = { ...base, factors: f, perStratum: 20 };
    const b = stratumList(o2, 'Site: B, Age: under 65').map((x) => x.arm).join(), c = stratumList({ ...o2, perStratum: 20 }, 'Site: B, Age: under 65').map((x) => x.arm).join();
    check('randomise: a stratum list depends only on the seed and its own name', a.replace(/Drug/g, '0').replace(/Placebo/g, '1') === b && b === c); }
  check('randomise: ratio parsing', parseRatio('2:1', 2).join() === '2,1' && parseRatio('', 3).join() === '1,1,1');
  const msg = (o) => { try { makeList(o); return ''; } catch (e) { return e.message; } };
  check('randomise: block size not a multiple of the ratio is refused', msg({ ...base, ratio: [2, 1], blockSizes: [4] }).includes('multiple of 3'));
  check('randomise: one arm is refused', msg({ ...base, arms: ['A'], ratio: [1] }).includes('at least two arms'));
  check('randomise: too many allocations are refused', msg({ ...base, perStratum: 10000, factors: [{ name: 'S', levels: ['a', 'b', 'c'] }] }).includes('20,000'));
  let e = ''; try { parseRatio('2:1:1', 2); } catch (x) { e = x.message; } check('randomise: ratio with the wrong number of parts', e.includes('3 parts'));
};
