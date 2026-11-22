// 1.4 IELTS General Training to Canadian Language Benchmark (IRCC chart, checked 2026-11-22).
import { row, slider, readout } from '../../kit.js';
import { clbFor, fmtBand } from '../bands.js';

export default function (host) {
  const v = { listening: 7, reading: 6.5, writing: 6.5, speaking: 6.5 };
  const ctl = row(host);
  for (const k of Object.keys(v)) slider(ctl, { label: k[0].toUpperCase() + k.slice(1), min: 3.5, max: 9, step: 0.5, value: v[k], fmt: fmtBand, oninput: (x) => { v[k] = x; show(); } });
  const out = readout(host);
  const show = () => {
    const each = Object.keys(v).map((k) => [k, clbFor(k, v[k])]);
    const low = Math.min(...each.map((e) => e[1]));
    out.innerHTML = each.map(([k, c]) => `${k[0].toUpperCase() + k.slice(1)}: <b>${c ? 'CLB ' + c : 'below CLB 4'}</b>`).join(' · ') +
      `<br>Lowest skill: <b>${low ? 'CLB ' + low : 'below CLB 4'}</b>. Many programmes (for example Express Entry Federal Skilled Worker) need at least CLB 7 in every skill. Check the IRCC page for your programme.`;
  };
  show();
}
