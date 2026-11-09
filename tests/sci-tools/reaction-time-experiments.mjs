// #722 Reaction time experiments: summary statistics checked against pandas (mean, median, SD with ddof=1,
// trimming) and the n-back d′ against scipy.stats.norm with the log-linear correction.
import { makeStroop, makeFlanker, makeNback, summarise, trialRows, median } from '../../src/lib/sci/rtexp.ts';
import { rng } from '../../src/lib/sci/sdt-optim.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const trials = Array.from({ length: 40 }, (_, i) => {
    const inc = i % 2 === 1;
    let rt = 420 + ((i * 37) % 200) + (inc ? 65 : 0);
    if (i === 7) rt = 120; if (i === 15) rt = 3400; if (i === 21) rt = 1900;
    const correct = i % 9 !== 4;
    return { task: 'stroop', trial: i + 1, condition: inc ? 'incongruent' : 'congruent', stimulus: 'RED', ink: 'red', answer: 'red', response: correct ? 'red' : 'blue', correct, rt };
  });
  let s = summarise(trials);
  const [c, i] = s.conds;
  check('rtexp: conditions in order, 20 trials each, 90 % correct', c.condition === 'congruent' && i.condition === 'incongruent' && c.n === 20 && near(c.accuracy, 0.9));
  check('rtexp: congruent mean 514.333, median 512, SD 60.7027 (pandas)', c.used === 18 && near(c.mean, 514.3333333) && c.median === 512 && near(c.sd, 60.70274730));
  check('rtexp: incongruent mean 659.75, median 584, SD 336.032', i.used === 16 && near(i.mean, 659.75) && i.median === 584 && near(i.sd, 336.0316453));
  check('rtexp: congruency effect 145.417 ms (median 72)', near(s.effect.rt, 145.4166667) && s.effect.median === 72);
  check('rtexp: too fast and too slow RTs dropped', s.fast === 1 && s.slow === 1);
  s = summarise(trials, { sdCut: 2 });
  check('rtexp: 2 SD trim drops 1900 ms, effect 62.733 ms', s.sdOut === 1 && near(s.conds[1].mean, 577.0666667) && near(s.conds[1].sd, 61.52289547) && near(s.effect.rt, 62.7333333));
  check('rtexp: median of even list', median([4, 1, 3, 2]) === 2.5 && Number.isNaN(median([])));

  const nb = [];
  for (let k = 0; k < 32; k++) {
    const cond = k < 2 ? 'filler' : k < 12 ? 'target' : 'non-target';
    const resp = cond === 'target' ? (k < 10 ? 'match' : 'none') : cond === 'non-target' ? (k < 15 ? 'match' : 'none') : 'none';
    nb.push({ task: 'nback', trial: k + 1, condition: cond, stimulus: 'B', answer: cond === 'target' ? 'match' : 'none', response: resp, correct: resp === (cond === 'target' ? 'match' : 'none'), rt: resp === 'match' ? 500 + k : null });
  }
  s = summarise(nb);
  check('rtexp: n-back 8 hits, 3 false alarms, fillers left out', s.nback.hits === 8 && s.nback.fas === 3 && s.n === 30);
  check('rtexp: n-back d′ 1.715280, c 0.109781 (log-linear, scipy)', near(s.nback.dprime, 1.71528016, 1e-7) && near(s.nback.c, 0.10978149, 1e-6));
  check('rtexp: n-back hit RT mean 505.5', near(s.conds[0].mean, 505.5) && s.conds[0].condition === 'target');

  const r = rng(7), st = makeStroop(40, 0.25, r);
  check('rtexp: Stroop list has exactly 10 congruent of 40', st.filter((t) => t.condition === 'congruent').length === 10);
  check('rtexp: Stroop congruent words match ink, incongruent do not', st.every((t) => (t.condition === 'congruent') === (t.stimulus.toLowerCase() === t.ink) && t.answer === t.ink));
  const fl = makeFlanker(30, 0.5, r);
  check('rtexp: flanker answers the middle arrow', fl.filter((t) => t.condition === 'congruent').length === 15 && fl.every((t) => (t.stimulus[2] === '←') === (t.answer === 'left')));
  const nbk = makeNback(42, 2, 0.3, r);
  const tgt = nbk.filter((t) => t.condition === 'target').length;
  check('rtexp: 2-back stream has 12 targets and no accidental matches', tgt === 12 && nbk.every((t, k) => k < 2 ? t.condition === 'filler' : (t.stimulus === nbk[k - 2].stimulus) === (t.condition === 'target')));
  const rows = trialRows(nb.slice(0, 3));
  check('rtexp: CSV rows with header and blank RT for no answer', rows.length === 4 && rows[0][8] === 'rt_ms' && rows[1][8] === '');
  let threw = false; try { summarise([]); } catch { threw = true; }
  check('rtexp: empty run is an error', threw);
};
