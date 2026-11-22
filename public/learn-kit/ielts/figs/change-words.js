// 5.3 The language of change: drag a start and end value and see the size of the change, the percentage and
// phrases that fit it (verb + adverb, adjective + noun). The thresholds are a rough guide, not an IELTS rule.
import { canvas, axes, line, dot, text, row, slider, readout, put } from '../../kit.js';

/** Words for a change from a to b (a > 0). Exported so lessons and tests can share them. */
export function changeWords(a, b) {
  const pct = ((b - a) / a) * 100, up = pct > 0, m = Math.abs(pct), r = b / a;
  if (m < 3) return { pct, verb: 'remained stable', noun: 'no significant change', alt: 'stayed at around ' + Math.round(a) };
  const special = r >= 2.9 && r <= 3.1 ? 'tripled' : r >= 1.9 && r <= 2.1 ? 'doubled' : r >= 0.45 && r <= 0.55 ? 'halved' : '';
  const [adv, adj] = m < 10 ? ['slightly', 'slight'] : m < 25 ? ['moderately', 'moderate'] : m < 50 ? ['significantly', 'significant'] : ['sharply', 'sharp'];
  const verb = (up ? (m < 25 ? 'increased' : 'rose') : (m < 25 ? 'decreased' : 'fell')) + ' ' + adv;
  const noun = `a ${adj} ${up ? 'increase' : 'decrease'}`;
  return { pct, verb, noun, alt: special };
}

export default function (host) {
  let a = 40, b = 58;
  const ctl = row(host);
  slider(ctl, { label: 'Value in 2010', min: 10, max: 100, step: 1, value: a, fmt: (x) => String(x), oninput: (x) => { a = x; show(); } });
  slider(ctl, { label: 'Value in 2020', min: 5, max: 100, step: 1, value: b, fmt: (x) => String(x), oninput: (x) => { b = x; show(); } });
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 200, label: 'A line from the 2010 value to the 2020 value', mark: 'tr' });
  const t = document.createElement('table'); t.className = 'ie-raw'; put(host, t);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [2009, 2021], y: [0, 100], xt: [2010, 2015, 2020], fx: (v) => String(v), ylabel: 'Thousands of visitors', r: 60 });
    line(ctx, [[ax.X(2010), ax.Y(a)], [ax.X(2020), ax.Y(b)]], col.s[0], 3);
    dot(ctx, ax.X(2010), ax.Y(a), 5, col.s[0]); dot(ctx, ax.X(2020), ax.Y(b), 5, col.s[0]);
    text(ctx, String(a), ax.X(2010) + 8, ax.Y(a) - 12, { color: col.ink, size: 12, weight: 700 });
    text(ctx, String(b), ax.X(2020) + 8, ax.Y(b), { color: col.ink, size: 12, weight: 700 });
  };
  const show = () => {
    const c = changeWords(a, b), p = Math.round(c.pct);
    t.innerHTML = '<tbody>' +
      `<tr><td>Change</td><td><b>${b - a > 0 ? '+' : ''}${b - a}</b> thousand (${p > 0 ? '+' : ''}${p}%)</td></tr>` +
      `<tr><td>Verb + adverb</td><td>Visitor numbers <b>${c.verb}</b>${c.alt && c.verb !== 'remained stable' ? `, or <b>${c.alt}</b>` : ''}.</td></tr>` +
      `<tr><td>Adjective + noun</td><td>There was <b>${c.noun}</b> in visitor numbers.</td></tr></tbody>`;
    out.textContent = c.verb === 'remained stable' ? `Under about 3% either way, most writers call it stable: "${c.alt} thousand".` : `Give the figures too: "from ${a},000 in 2010 to ${b},000 in 2020".`;
    cv.redraw();
  };
  show();
}
