// Score calculator figure. data-mode="celpip": four CELPIP levels → CLB, Express Entry language points and which
// goals they meet. data-mode="toefl": four TOEFL bands → overall band and rough CEFR level.
import { canvas, row, slider, choice, readout, text, line } from '../kit.js';
import { celpipToClb, crsFirstLanguage, CELPIP_GOALS, toeflOverall, toeflCefr } from './scores.js';

const SKILLS = ['listening', 'reading', 'writing', 'speaking'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);

export default function (host, { data }) {
  const toefl = data.mode === 'toefl';
  const max = toefl ? 6 : 12, min = toefl ? 1 : 1;
  const vals = toefl ? { listening: 4, reading: 4.5, writing: 4, speaking: 3.5 } : { listening: 8, reading: 7, writing: 7, speaking: 6 };
  let goal = toefl ? 4.5 : 'fsw', spouse = false;
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 210, label: 'Bar chart of your four section scores against a target line' });
  const ctl = row(host);
  for (const s of SKILLS) slider(ctl, { label: cap(s), min, max, step: toefl ? 0.5 : 1, value: vals[s], fmt: (v) => (toefl ? v.toFixed(1) : (v < 4 ? `${v}` : `${v}`)), oninput: (v) => { vals[s] = v; update(); } });
  const ctl2 = row(host);
  if (toefl) choice(ctl2, 'Target overall', [[4, '4'], [4.5, '4.5'], [5, '5'], [5.5, '5.5']], goal, (v) => { goal = v; update(); });
  else {
    choice(ctl2, 'Goal', CELPIP_GOALS.map((g) => [g.id, g.id === 'citizenship' ? 'Citizenship' : g.id === 'cec-b' ? 'CLB 5' : g.id === 'fsw' ? 'CLB 7' : 'CLB 9']), goal, (v) => { goal = v; update(); });
    choice(ctl2, 'Spouse coming?', [[false, 'No'], [true, 'Yes']], spouse, (v) => { spouse = v; update(); });
  }
  const out = readout(host);
  const need = () => (toefl ? Object.fromEntries(SKILLS.map((s) => [s, goal])) : CELPIP_GOALS.find((g) => g.id === goal).need);
  cv.draw = (ctx, w, h, col) => {
    const L = 34, R = 14, T = 30, B = 30, bw = (w - L - R) / 4;
    const y = (v) => h - B - (v / max) * (h - T - B);
    for (let v = 0; v <= max; v += toefl ? 1 : 2) { line(ctx, [[L, y(v)], [w - R, y(v)]], col.line, 1); text(ctx, String(v), L - 6, y(v), { color: col.muted, size: 11, align: 'right' }); }
    const nd = need();
    SKILLS.forEach((s, i) => {
      const x = L + i * bw + bw * 0.18, bwid = bw * 0.64, v = vals[s];
      const ok = nd[s] === undefined || v >= nd[s];
      ctx.fillStyle = ok ? col.s[0] : col.s[3];
      ctx.fillRect(x, y(v), bwid, y(0) - y(v));
      text(ctx, toefl ? v.toFixed(1) : `${v}`, x + bwid / 2, y(v) - 9, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, cap(s), x + bwid / 2, h - B + 14, { color: col.ink, size: 12, align: 'center' });
      if (nd[s] !== undefined) { line(ctx, [[x - 6, y(nd[s])], [x + bwid + 6, y(nd[s])]], col.ink, 2, [5, 3]); }
    });
    text(ctx, toefl ? 'Dashed line: your target band' : 'Dashed line: level your goal needs', L, 14, { color: col.muted, size: 11 });
  };
  const update = () => {
    cv.redraw();
    const nd = need();
    const short = SKILLS.filter((s) => nd[s] !== undefined && vals[s] < nd[s]);
    if (toefl) {
      const o = toeflOverall(SKILLS.map((s) => vals[s]));
      const avg = SKILLS.reduce((a, s) => a + vals[s], 0) / 4;
      out.innerHTML = `Average ${avg.toFixed(3)} → overall band <b>${o.toFixed(1)}</b> (about CEFR <b>${toeflCefr(o)}</b>). ${o >= goal ? '✓ Meets your target.' : `Below your target of ${goal}.`} ${short.length ? `Sections under ${goal}: ${short.map(cap).join(', ')}. Some universities also set a minimum per section, so check theirs.` : ''}`;
    } else {
      const clbs = SKILLS.map((s) => celpipToClb(vals[s]));
      const pts = clbs.reduce((a, c) => a + crsFirstLanguage(c, spouse), 0);
      const g = CELPIP_GOALS.find((x) => x.id === goal);
      out.innerHTML = `CLB: ${SKILLS.map((s, i) => `${cap(s)} ${clbs[i] ? (clbs[i] >= 10 ? '10+' : clbs[i]) : 'below 4'}`).join(' · ')}. Express Entry first-language points: <b>${pts}</b> of ${spouse ? 128 : 136}. ${short.length ? `For ${g.name} you still need: ${short.map((s) => `${cap(s)} ${nd[s]}`).join(', ')}.` : `✓ Meets ${g.name}.`}`;
    }
  };
  update();
}
