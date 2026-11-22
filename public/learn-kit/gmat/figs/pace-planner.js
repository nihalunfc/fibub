// 9.1 Pace planner: where you are in a section against where an even pace would put you.
import { canvas, row, slider, choice, readout, text, title } from '../../kit.js';
const SEC = { q: ['Quant', 21], v: ['Verbal', 23], d: ['Data Insights', 20] };
export default function (host) {
  let sec = 'q', at = 8, left = 28;
  const cv = canvas(host, { aspect: 0.4, max: 200, min: 160, label: 'Your position in the section against an even pace' });
  const ctl = row(host); choice(ctl, 'Section', Object.entries(SEC).map(([k, v]) => [k, v[0]]), sec, (v) => { sec = v; go(); });
  const ctl2 = row(host);
  const sq = slider(ctl2, { label: 'Question you are on', min: 1, max: 23, step: 1, value: at, fmt: (v) => String(Math.round(v)), oninput: (v) => { at = Math.round(v); go(); } });
  slider(ctl2, { label: 'Minutes left', min: 0, max: 45, step: 1, value: left, fmt: (v) => Math.round(v) + ' min', oninput: (v) => { left = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => {
    const n = SEC[sec][1]; if (at > n) { at = n; sq.set(n); }
    cv.redraw();
    const per = 45 / n, should = 45 - (at - 1) * per, diff = left - should, qs = diff / per;
    out.innerHTML = `At question ${at} of ${n}, an even pace leaves <b>${should.toFixed(0)} minutes</b>. You have ${left}. ` +
      (Math.abs(qs) < 0.5 ? 'You are on pace.' : qs > 0 ? `You are about ${qs.toFixed(1)} questions ahead: keep going, no rush.` : `You are about ${(-qs).toFixed(1)} questions behind: make one smart guess on the next long question${qs < -1.5 ? ', then another later' : ''}.`);
  };
  cv.draw = (ctx, w, h, col) => {
    const n = SEC[sec][1], l = 24, rr = w - 24, y1 = h * 0.45, y2 = h * 0.75, X = (f) => l + (rr - l) * f;
    const used = (45 - left) / 45, done = (at - 1) / n;
    [[y1, 'Time used', used, col.s[1]], [y2, 'Questions done', done, col.s[0]]].forEach(([y, lab, f, c]) => {
      ctx.fillStyle = col.line; ctx.fillRect(l, y - 7, rr - l, 14); ctx.fillStyle = c; ctx.fillRect(l, y - 7, (rr - l) * Math.max(0, Math.min(1, f)), 14);
      text(ctx, `${lab}: ${Math.round(f * 100)}%`, l, y - 16, { color: col.ink, size: 11.5 });
    });
    title(ctx, 'On pace when the two bars are the same length', col);
  };
  go();
}
