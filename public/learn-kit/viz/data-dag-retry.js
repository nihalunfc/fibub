// A pipeline run as a graph: extract, clean and load steps run in order; if a step fails, downstream steps are skipped.
// Set how often a step fails and how many retries are allowed, then run it. Try: failure 40% with 0 retries (the run
// usually dies), then 2 retries (most runs recover). Retries only help for short-lived faults, not bad logic.
import { canvas, text, row, slider, button, readout, title, loop, rng } from '../kit.js';

const NODES = [['extract A', 0, 0, []], ['extract B', 0, 1, []], ['clean', 1, 0.5, [0, 1]], ['load', 2, 0.5, [2]], ['report', 3, 0.5, [3]]];
export default function (host) {
  const R = rng(Date.now() % 9999 + 1); let pf = 0.3, rt = 1, st = NODES.map(() => ({ s: 'idle', tries: 0 })), cur = -1, t0 = 0, plan = [], log = '';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A pipeline graph of five tasks running with failures and retries' });
  const c1 = row(host);
  slider(c1, { label: 'failure chance per try', min: 0, max: 0.9, step: 0.05, value: pf, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { pf = v; } });
  slider(c1, { label: 'retries allowed', min: 0, max: 4, step: 1, value: rt, fmt: (v) => String(Math.round(v)), oninput: (v) => { rt = Math.round(v); } });
  const c2 = row(host); button(c2, 'Run the pipeline', () => start());
  const out = readout(host);
  const anim = loop(host, (dt, t) => { if (t - t0 < 0.7) return; t0 = t; step(); }, { autoplay: false });
  function start() { st = NODES.map(() => ({ s: 'idle', tries: 0 })); plan = [0, 1, 2, 3, 4]; cur = 0; log = 'Started.'; show(); anim.play(); }
  function step() {
    if (cur < 0) { anim.pause(); return; }
    if (cur >= NODES.length) { cur = -1; anim.pause(); const f = st.some((x) => x.s === 'failed'); log = f ? 'The run FAILED: later tasks were skipped, so no report today.' : `The run SUCCEEDED (${st.reduce((s, x) => s + Math.max(0, x.tries - 1), 0)} retries used).`; show(); return; }
    const n = NODES[cur], dep = n[3].some((d) => st[d].s !== 'ok');
    if (dep) { st[cur].s = 'skipped'; cur++; show(); return; }
    st[cur].tries++;
    if (R() < pf) { if (st[cur].tries > rt) { st[cur].s = 'failed'; log = `${n[0]} failed ${st[cur].tries} time(s): out of retries.`; cur++; } else { st[cur].s = 'retry'; log = `${n[0]} failed, retrying (try ${st[cur].tries + 1} of ${rt + 1}).`; } }
    else { st[cur].s = 'ok'; log = `${n[0]} succeeded${st[cur].tries > 1 ? ' on a retry' : ''}.`; cur++; }
    show();
  }
  function show() { out.textContent = log || 'Press Run. Each try fails at random with the chance you set.'; cv.redraw(); }
  const pos = (n, w, h) => [20 + ((w - 90) * n[1]) / 3 + 35, 50 + n[2] * (h - 110) + 12];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Tasks run left to right; a failure blocks what follows', col);
    NODES.forEach((n, i) => n[3].forEach((d) => { const [x0, y0] = pos(NODES[d], w, h), [x1, y1] = pos(n, w, h); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0 + 32, y0); ctx.lineTo(x1 - 32, y1); ctx.stroke(); }));
    NODES.forEach((n, i) => { const [x, y] = pos(n, w, h), s = st[i].s, c = s === 'ok' ? col.good : s === 'failed' ? col.bad : s === 'retry' ? col.warn : s === 'skipped' ? col.line : col.soft; ctx.fillStyle = c; ctx.fillRect(x - 32, y - 18, 64, 36); ctx.strokeStyle = i === cur ? col.ink : col.muted; ctx.lineWidth = i === cur ? 3 : 1; ctx.strokeRect(x - 32, y - 18, 64, 36); text(ctx, n[0], x, y - 4, { color: s === 'idle' || s === 'skipped' ? col.ink : '#fff', size: 10.5, weight: 700, align: 'center', fit: false }); text(ctx, s === 'idle' ? '' : s === 'retry' ? 'retrying' : s, x, y + 9, { color: s === 'idle' || s === 'skipped' ? col.muted : '#fff', size: 9.5, align: 'center', fit: false }); if (st[i].tries > 1) text(ctx, 'tries ' + st[i].tries, x, y + 29, { color: col.muted, size: 9.5, align: 'center', fit: false }); });
  };
  show();
}
