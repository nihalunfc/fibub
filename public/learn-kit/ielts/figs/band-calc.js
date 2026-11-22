// 1.3 Overall band calculator: move the four skill bands and watch the average and its rounding.
import { row, slider, readout } from '../../kit.js';
import { overall, fmtBand } from '../bands.js';

export default function (host) {
  const v = { l: 6.5, r: 6.5, w: 6, s: 6.5 };
  const names = { l: 'Listening', r: 'Reading', w: 'Writing', s: 'Speaking' };
  const ctl = row(host);
  for (const k of Object.keys(v)) slider(ctl, { label: names[k], min: 1, max: 9, step: 0.5, value: v[k], fmt: fmtBand, oninput: (x) => { v[k] = x; show(); } });
  const out = readout(host);
  const show = () => {
    const sum = v.l + v.r + v.w + v.s, mean = sum / 4, o = overall(v.l, v.r, v.w, v.s);
    const why = mean * 4 % 2 === 1 ? ' (exactly between two half bands, so it rounds up)' : '';
    out.innerHTML = `Total ${sum} ÷ 4 = <b>${mean.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}</b> → overall band <b style="font-size:1.25em">${fmtBand(o)}</b>${why}.`;
  };
  show();
}
