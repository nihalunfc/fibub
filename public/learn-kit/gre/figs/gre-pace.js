// 9.1 GRE pace: in each section, are you ahead of or behind an even pace?
import { canvas, row, slider, choice, readout, text, title } from '../../kit.js';
const SEC = { q1: ['Quant 1', 12, 21], q2: ['Quant 2', 15, 26], v1: ['Verbal 1', 12, 18], v2: ['Verbal 2', 15, 23] };
export default function (host) {
  let sec = 'q1', at = 6, left = 11;
  const cv = canvas(host, { aspect: 0.4, max: 200, min: 160, label: 'Your position in a GRE section against an even pace' });
  const ctl = row(host); choice(ctl, 'Section', Object.entries(SEC).map(([k, v]) => [k, v[0]]), sec, (v) => { sec = v; const [, n, m] = SEC[sec]; if (at > n) { at = n; sq.set(n); } if (left > m) { left = m; sl.set(m); } go(); });
  const ctl2 = row(host);
  const sq = slider(ctl2, { label: 'Question you are on', min: 1, max: 15, step: 1, value: at, fmt: (v) => String(Math.round(v)), oninput: (v) => { at = Math.round(v); go(); } });
  const sl = slider(ctl2, { label: 'Minutes left', min: 0, max: 26, step: 1, value: left, fmt: (v) => Math.round(v) + ' min', oninput: (v) => { left = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => {
    const [, n, m] = SEC[sec]; if (at > n) { at = n; sq.set(n); } if (left > m) { left = m; sl.set(m); }
    cv.redraw();
    const per = m / n, should = m - (at - 1) * per, qs = (left - should) / per;
    out.innerHTML = `${SEC[sec][0]}: ${n} questions in ${m} minutes, about <b>${Math.round(per * 60)} seconds</b> each. At question ${at}, an even pace leaves ${should.toFixed(0)} minutes; you have ${left}. ` +
      (Math.abs(qs) < 0.5 ? 'On pace.' : qs > 0 ? `About ${qs.toFixed(1)} questions ahead.` : `About ${(-qs).toFixed(1)} questions behind: answer, mark and move on. A blank costs the same as a wrong answer, so never leave one.`);
  };
  cv.draw = (ctx, w, h, col) => {
    const [, n, m] = SEC[sec], l = 24, rr = w - 24, y1 = h * 0.45, y2 = h * 0.75;
    [[y1, 'Time used', (m - left) / m, col.s[1]], [y2, 'Questions done', (at - 1) / n, col.s[0]]].forEach(([y, lab, f, c]) => {
      ctx.fillStyle = col.line; ctx.fillRect(l, y - 7, rr - l, 14); ctx.fillStyle = c; ctx.fillRect(l, y - 7, (rr - l) * Math.max(0, Math.min(1, f)), 14);
      text(ctx, `${lab}: ${Math.round(f * 100)}%`, l, y - 16, { color: col.ink, size: 11.5 });
    });
    title(ctx, 'On pace when the two bars match', col);
  };
  go();
}
