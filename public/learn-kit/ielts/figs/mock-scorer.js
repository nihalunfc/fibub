// 11.1 Mock test helper: a countdown timer for each paper, then enter your raw scores and self-marked bands
// to see the approximate band for each skill and the overall band. Nothing is saved or sent.
import { row, slider, choice, button, readout, put } from '../../kit.js';
import { rawToBand, overall, fmtBand } from '../bands.js';

const PAPERS = [['listening', 'Listening 30 min', 30], ['reading', 'Reading 60 min', 60], ['writing', 'Writing 60 min', 60], ['speaking', 'Speaking 14 min', 14]];

export default function (host) {
  // timer
  let paper = 'listening', left = 30 * 60, iv = 0;
  const t1 = row(host);
  choice(t1, 'Paper', PAPERS.map(([k, n]) => [k, n]), paper, (v) => { paper = v; reset(); });
  const clock = document.createElement('p'); clock.className = 'lk-readout'; clock.setAttribute('role', 'timer'); clock.style.fontSize = '1.6rem'; clock.style.fontWeight = '700'; put(host, clock);
  const t2 = row(host);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const tick = () => { left = Math.max(0, left - 1); clock.textContent = left ? fmt(left) : 'Time is up: pens down.'; if (!left) { clearInterval(iv); iv = 0; } };
  const reset = () => { clearInterval(iv); iv = 0; left = PAPERS.find((p) => p[0] === paper)[2] * 60; clock.textContent = fmt(left); };
  button(t2, 'Start / pause', () => { if (iv) { clearInterval(iv); iv = 0; } else if (left) iv = setInterval(tick, 1000); });
  button(t2, 'Reset', reset);
  reset();
  // scores
  let L = 30, R = 30, mod = 'academic', W = 6, S = 6;
  const s1 = row(host);
  slider(s1, { label: 'Listening: correct of 40', min: 0, max: 40, step: 1, value: L, fmt: String, oninput: (v) => { L = v; show(); } });
  slider(s1, { label: 'Reading: correct of 40', min: 0, max: 40, step: 1, value: R, fmt: String, oninput: (v) => { R = v; show(); } });
  const s2 = row(host);
  choice(s2, 'Reading module', [['academic', 'Academic'], ['general', 'General Training']], mod, (v) => { mod = v; show(); });
  const s3 = row(host);
  slider(s3, { label: 'Writing (your estimate with the checklists)', min: 4, max: 9, step: 0.5, value: W, fmt: fmtBand, oninput: (v) => { W = v; show(); } });
  slider(s3, { label: 'Speaking (your estimate from your recording)', min: 4, max: 9, step: 0.5, value: S, fmt: fmtBand, oninput: (v) => { S = v; show(); } });
  const tb = document.createElement('table'); tb.className = 'ie-raw'; put(host, tb);
  const out = readout(host);
  const show = () => {
    const lb = rawToBand(L, 'listening'), rb = rawToBand(R, mod), ov = overall(lb, rb, W, S);
    tb.innerHTML = '<thead><tr><th>Skill</th><th>About band</th></tr></thead><tbody>' +
      [['Listening', lb], [mod === 'academic' ? 'Academic Reading' : 'General Training Reading', rb], ['Writing (estimate)', W], ['Speaking (estimate)', S]].map(([n, b]) => `<tr><td>${n}</td><td>${fmtBand(b)}</td></tr>`).join('') +
      `<tr><td><b>Overall</b></td><td><b>${fmtBand(ov)}</b></td></tr></tbody>`;
    const low = [['Listening', lb], ['Reading', rb], ['Writing', W], ['Speaking', S]].sort((a, b) => a[1] - b[1])[0];
    out.textContent = `Your lowest skill is ${low[0]} (${fmtBand(low[1])}). Spend most of next week's study time there. Raw-score conversions are approximate and vary slightly between tests.`;
  };
  show();
}
