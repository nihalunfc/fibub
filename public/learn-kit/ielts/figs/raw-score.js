// 1.3 Raw score to band: one slider, three papers side by side (about; cut-offs move a little per test).
import { row, slider, readout, put } from '../../kit.js';
import { rawToBand, fmtBand } from '../bands.js';

export default function (host) {
  let raw = 30;
  const ctl = row(host);
  slider(ctl, { label: 'Correct answers out of 40', min: 0, max: 40, step: 1, value: raw, fmt: (x) => String(x), oninput: (x) => { raw = x; show(); } });
  const t = document.createElement('table');
  t.className = 'ie-raw';
  put(host, t);
  const out = readout(host);
  const show = () => {
    const c = [['Listening (both modules)', 'listening'], ['Academic Reading', 'academic'], ['General Training Reading', 'general']];
    t.innerHTML = '<thead><tr><th>Paper</th><th>About band</th></tr></thead><tbody>' + c.map(([n, k]) => `<tr><td>${n}</td><td><b>${fmtBand(rawToBand(raw, k))}</b></td></tr>`).join('') + '</tbody>';
    out.textContent = `With ${raw} of 40 correct. General Training Reading needs more correct answers for the same band because its texts are easier.`;
  };
  show();
}
