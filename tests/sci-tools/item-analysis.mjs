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
};
