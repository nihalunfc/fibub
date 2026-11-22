// Bayes' rule with 1000 people. Set how common the condition is (prevalence), how often the test catches it
// (sensitivity) and how often it wrongly alarms (false-positive rate). The dots are people; those who test positive
// are circled. Count the circled dots that really have the condition: that fraction is P(condition | positive), and
// it is often far smaller than people expect when the condition is rare.
import { canvas, row, slider, readout, text, rng } from '../kit.js';
import { f2 } from './_math.js';

export default function (host) {
  let prev = 0.02, sens = 0.9, fp = 0.08;
  const cv = canvas(host, { aspect: 0.82, max: 380, min: 270, label: 'A thousand dots coloured by condition and test result' });
  const c = row(host);
  slider(c, { label: 'Prevalence', min: 0.005, max: 0.5, step: 0.005, value: prev, fmt: (v) => f2(v * 100, 1) + '%', oninput: (v) => { prev = v; re(); } });
  slider(c, { label: 'Sensitivity', min: 0.5, max: 1, step: 0.01, value: sens, fmt: (v) => f2(v * 100, 0) + '%', oninput: (v) => { sens = v; re(); } });
  slider(c, { label: 'False alarms', min: 0, max: 0.3, step: 0.01, value: fp, fmt: (v) => f2(v * 100, 0) + '%', oninput: (v) => { fp = v; re(); } });
  const out = readout(host);
  const N = 1000, R = rng(5), U = Array.from({ length: N }, () => R()), V = Array.from({ length: N }, () => R());
  function counts() { const sick = Math.round(prev * N), tp = Math.round(sick * sens), f = Math.round((N - sick) * fp); return { sick, tp, fn: sick - tp, fpc: f, tn: N - sick - f }; }
  function re() { cv.redraw(); const k = counts(), pos = k.tp + k.fpc; out.innerHTML = `Of 1000 people, ${k.sick} have the condition: <b>${k.tp}</b> test positive (true positives), ${k.fn} are missed. Of the ${N - k.sick} without it, <b>${k.fpc}</b> test positive anyway (false positives). Total positives = ${pos}. <b>P(condition | positive) = ${k.tp} / ${pos} = ${pos ? f2((k.tp / pos) * 100, 1) : 0}%</b>. By the formula: P(+|C)P(C) / [P(+|C)P(C) + P(+|no C)P(no C)] = ${f2(sens * prev, 4)} / ${f2(sens * prev + fp * (1 - prev), 4)}.`; }
  cv.draw = (ctx, w, h, col) => {
    const k = counts(), gx = 10, gy = 30, gw = w - 20, gh = h - 56, cols = 40, rows = 25, dx = gw / cols, dy = gh / rows;
    for (let i = 0; i < N; i++) {
      const cx = gx + (i % cols + 0.5) * dx, cy = gy + (Math.floor(i / cols) + 0.5) * dy, sick = i < k.sick, pos = sick ? i < k.tp : i - k.sick < k.fpc;
      ctx.beginPath(); ctx.arc(cx, cy, Math.min(dx, dy) * 0.33, 0, 7); ctx.fillStyle = sick ? col.s[3] : col.line; ctx.fill();
      if (pos) { ctx.beginPath(); ctx.arc(cx, cy, Math.min(dx, dy) * 0.5, 0, 7); ctx.strokeStyle = sick ? col.s[2] : col.s[1]; ctx.lineWidth = 1.6; ctx.stroke(); }
    }
    text(ctx, '1000 people', 10, 14, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'pink dot = has condition · grey = healthy · ring = tests positive (green true, orange false)', 10, h - 12, { color: col.muted, size: 9.5 });
  };
  re();
}
