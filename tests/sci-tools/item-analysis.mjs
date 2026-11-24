// #764 Item analysis: checked against numpy and scipy (pointbiserialr, pearsonr; KR-20 as Cronbach's alpha) on the
// page's made-up example (tests/fixtures/item-analysis.tsv, b2/ia_check.py).
import { readFileSync } from 'node:fs';
import { scoreAnswers, analyse, distractors, kr20 } from '../../src/lib/sci/itemanalysis.ts';

const REF = {"p": [0.8333333333333334, 0.6333333333333333, 0.5666666666666667, 0.5, 0.36666666666666664, 0.36666666666666664, 0.13333333333333333, 0.23333333333333334, 0.26666666666666666, 0.4], "D": [0.5, 0.875, 0.5, 0.625, 0.75, 0.5, 0.5, 0.625, 0.625, 0.875], "rpb": [0.43707451473573994, 0.6300619537027167, 0.41812050382437105, 0.4560865522181956, 0.6949610390626532, 0.5597546112294521, 0.644010709748631, 0.5823034238771744, 0.5775641323332071, 0.6756275004663643], "rit": [0.3081960454509612, 0.4943949295148988, 0.23982109087699036, 0.2810497136596713, 0.5759321396281971, 0.40896367420740026, 0.555534123325331, 0.4563595660112048, 0.4441512242156877, 0.5488903824701932], "aid": [0.7552716565349543, 0.7310106382978726, 0.7684736229635377, 0.7628850710900474, 0.7185579455662863, 0.7436676276771005, 0.729839518555667, 0.7373372660699757, 0.7386479852730619, 0.7224950884086446], "kr20": 0.7611177147600988, "kr21": 0.6949114167657215, "mean": 4.3, "sd": 2.6017235666460374, "sem": 1.2716076248075545, "g": 8, "dis": {"": [1, 0.0, 0.0, -0.09437236330098212], "A": [12, 0.875, 0.0, 0.6756275004663643], "B": [6, 0.0, 0.375, -0.3518381974254651], "C": [8, 0.125, 0.375, -0.2475274852856602], "D": [3, 0.0, 0.25, -0.2128403910351579]}};

export default async (check) => {
  const L = readFileSync(new URL('../fixtures/item-analysis.tsv', import.meta.url), 'utf8').replace(/\n$/, '').split('\n').map((l) => l.split('\t'));
  const key = L[1].slice(1), A = L.slice(2).map((r) => r.slice(1));
  const X = scoreAnswers(A, key), r = analyse(X);
  const close = (a, b, t = 1e-12) => a.every((x, i) => Math.abs(x - b[i]) < t);
  check('items: difficulty p', close(r.items.map((x) => x.p), REF.p));
  check('items: upper-lower D with 27 % groups', r.groupSize === REF.g && close(r.items.map((x) => x.D), REF.D));
  check('items: point-biserial (scipy)', close(r.items.map((x) => x.rpb), REF.rpb, 1e-10));
  check('items: corrected item-total (scipy)', close(r.items.map((x) => x.rit), REF.rit, 1e-10));
  check('items: KR-20 equals alpha, and alpha if deleted', Math.abs(r.kr20 - REF.kr20) < 1e-12 && close(r.items.map((x) => x.alphaIfDeleted), REF.aid, 1e-12));
  check('items: KR-21, mean, SD, SEM', Math.abs(r.kr21 - REF.kr21) < 1e-12 && Math.abs(r.mean - REF.mean) < 1e-12 && Math.abs(r.sd - REF.sd) < 1e-12 && Math.abs(r.sem - REF.sem) < 1e-12);
  const d = distractors(A.map((x) => x[9]), key[9], r.total, r.upper, r.lower);
  check('items: distractors for Q10', d.length === 5 && d.every((o) => { const w = REF.dis[o.option]; return w && o.count === w[0] && Math.abs(o.pUpper - w[1]) < 1e-12 && Math.abs(o.pLower - w[2]) < 1e-12 && Math.abs(o.rpb - w[3]) < 1e-10; }) && d.find((o) => o.key).option === 'A');
  check('items: KR-20 by hand', Math.abs(kr20([[1, 1, 1], [1, 1, 0], [1, 0, 0], [0, 0, 0]]) - 0.75) < 1e-12);
  check('items: lowercase answers count', scoreAnswers([['a', ' B ', '']], ['A', 'b', 'C'])[0].join() === '1,1,0');
  check('items: non 0/1 refused', (() => { try { analyse([[1, 2], [0, 1], [1, 1], [0, 0]]); return false; } catch { return true; } })());
  // Pinned by src/blog/discoveries/geography-olympiad-mcq-kr20-item-difficulty-spread.md: 40 students by 20 items
  // from the simulated answer sheet in that article, one row per student as a string of 0s and 1s.
  const SHEET = '00000000001001101101 00010010101001010111 00000100000111101111 00011000101001111111 00000101001101111011 00000000100001110110 00100011001011000111 10010001101001101111 01011000001001000101 00000000001000111011 00011001111110111111 00001000011010000101 00000001011000101011 00000001000101101111 00000000001000001011 00100000000011000111 00000010010000010110 00001000010010011111 00100101001110110111 00000010100001001101 00000001000001101001 01000010100101011111 00000000001000011101 00000100001011001001 00000000000000001110 00000000000000010001 01000000000001010001 00000100010000000111 00100010011011000101 00001010000010011101 00111001001011101111 00000000000010110010 00100000000000000011 00000011001010100010 00110000000110100100 00010101010000111111 00100000000011011101 00000001010000011110 01000010011111011101 00001000110101101011'.split(' ').map((r) => [...r].map(Number));
  const B = analyse(SHEET);
  check(`items: 40 x 20 blog sheet: mean ${B.mean.toFixed(3)}, SD ${B.sd.toFixed(4)}, KR-20 ${B.kr20.toFixed(4)}`,
    B.n === 40 && B.k === 20 && B.groupSize === 11 && Math.abs(B.mean - 7.2) < 1e-12
    && Math.abs(B.sd - 2.7381446085690757) < 1e-12 && Math.abs(B.kr20 - 0.5201958384332925) < 1e-12
    && Math.abs(B.kr21 - 0.3890848873209013) < 1e-12 && Math.abs(B.sem - 1.896655199204475) < 1e-12);
  check('items: 40 x 20 blog sheet: Q1 p 0.025 D 1/11, Q4 and Q11 D 6/11, Q20 p 0.825 D 4/11',
    Math.abs(B.items[0].p - 0.025) < 1e-12 && Math.abs(B.items[0].D - 1 / 11) < 1e-12
    && Math.abs(B.items[3].D - 6 / 11) < 1e-12 && Math.abs(B.items[10].D - 6 / 11) < 1e-12
    && Math.abs(B.items[19].p - 0.825) < 1e-12 && Math.abs(B.items[19].D - 4 / 11) < 1e-12
    && Math.abs(B.items[3].rpb - 0.5178087050187161) < 1e-12);
  // The KR-20 identity the article works backwards: k = 100 items, mean difficulty 0.3385, score SD 9.85.
  const krOf = (sdP, k = 100, pbar = 0.3385, s = 9.85) => (k / (k - 1)) * (1 - (k * pbar - k * (pbar * pbar + sdP * sdP)) / (s * s));
  check(`items: KR-20 from the difficulty spread: 0.2033 gives ${krOf(0.2033).toFixed(4)}, equal difficulties give ${krOf(0).toFixed(4)}`,
    Math.abs(krOf(0.2033) - 0.8200099) < 1e-6 && Math.abs(krOf(0) - 0.7769803) < 1e-6 && Math.abs(krOf(0.25) - 0.8420490) < 1e-6);
};
