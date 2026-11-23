// Class 11 Biology, Chemical coordination: the adrenal gland's emergency response. Under stress the adrenal medulla releases adrenaline within seconds (fight or flight): faster heartbeat,
// more glucose, wider pupils, more blood to muscles, less to digestion. The adrenal cortex releases cortisol over minutes to hours to keep sugar and energy up. Values are illustrative.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let s = 0.5;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Bars showing body changes as stress rises: heart rate, blood glucose, muscle blood flow, pupil size and digestion' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Stress (danger)', min: 0, max: 1, step: 0.01, value: s, fmt: (v) => (v < 0.2 ? 'calm' : v < 0.6 ? 'alert' : 'scared'), oninput: (v) => { s = v; go(); } });
  const go = () => { ro.textContent = s < 0.2 ? 'Calm: adrenaline is low and the body is in "rest and digest" mode.' : `Adrenaline is up within seconds: heart ${Math.round(70 + 90 * s)} beats per minute, blood sugar and muscle blood flow rise, digestion slows. Cortisol follows over the next hours.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Fight or flight', col), x0 = 14, bw = w - 28;
    [['Adrenaline', 0.05 + 0.95 * s, col.s[3], `${Math.round(s * 100)} %`], ['Heart rate', (70 + 90 * s) / 180, col.s[2], `${Math.round(70 + 90 * s)} /min`], ['Blood glucose', (80 + 60 * s) / 160, col.s[0], `${Math.round(80 + 60 * s)} mg/dL`], ['Blood flow to muscles', 0.3 + 0.7 * s, col.s[4], 'higher'], ['Pupil size', 0.3 + 0.6 * s, col.s[5], 'wider'], ['Digestion', 0.9 - 0.75 * s, col.muted, 'slower']].forEach(([n, v, c, lab], i) => {
      const y = t0 + 14 + i * 38; text(ctx, n, x0, y, { color: col.ink, size: 11, weight: 700 }); text(ctx, lab, x0 + bw, y, { color: col.muted, size: 10.5, align: 'right' }); ctx.fillStyle = col.line; ctx.fillRect(x0, y + 8, bw, 12); ctx.fillStyle = c; ctx.fillRect(x0, y + 8, bw * v, 12);
    });
  };
  go();
}
