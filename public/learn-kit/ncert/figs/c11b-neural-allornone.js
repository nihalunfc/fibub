// Class 11 Biology, Neural control: the all-or-none law. A stimulus that lifts the membrane from -70 mV to below the threshold (-55 mV) only gives a small local change that fades;
// one that reaches the threshold sets off a full action potential. A stronger stimulus does not make a bigger spike: it makes more spikes per second.
import { canvas, text, title, axes, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  let s = 10;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Membrane voltage after a stimulus of chosen strength: a small fading change below threshold, a full spike at or above it' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Stimulus strength (rise from rest)', min: 0, max: 40, step: 1, value: s, fmt: (v) => '+' + v + ' mV', oninput: (v) => { s = v; go(); } });
  const AP = [[0, -70], [0.3, -55], [0.5, -10], [0.7, 30], [1.0, 10], [1.3, -20], [1.7, -60], [2.2, -78], [2.7, -80], [3.3, -75], [3.8, -70], [4, -70]];
  const go = () => { const hit = s >= 15, n = Math.max(0, Math.floor((s - 15) / 6)) + 1; ro.textContent = hit ? `Stimulus +${s} mV reaches the threshold (+15 mV above rest): a full spike to +30 mV, the same size every time. A stronger stimulus gives about ${n} spike${n > 1 ? 's' : ''} each second, never a taller one.` : `Stimulus +${s} mV only reaches ${-70 + s} mV, short of -55 mV. No action potential: the change fades away. Try 15 or more.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, s >= 15 ? 'Threshold reached: full spike' : 'Below threshold: nothing happens', col), A = axes(ctx, w, h, col, { x: [0, 4], y: [-90, 40], xlabel: 'time (ms)', ylabel: 'membrane potential (mV)', l: 52, t: t0 + 8, b: 40, xt: [0, 1, 2, 3, 4], yt: [-70, -55, 0, 30] });
    line(ctx, [[A.X(0), A.Y(-55)], [A.X(4), A.Y(-55)]], col.s[3], 1.5, [5, 3]); text(ctx, 'threshold', A.X(4), A.Y(-55) - 8, { color: col.s[3], size: 10, align: 'right' });
    if (s >= 15) line(ctx, AP.map(([a, b]) => [A.X(a), A.Y(b)]), col.s[0], 3);
    else { const pts = []; for (let k = 0; k <= 40; k++) { const t = k / 10, v = t < 0.3 ? -70 + s * (t / 0.3) : -70 + s * Math.exp(-(t - 0.3) * 2.2); pts.push([A.X(t), A.Y(v)]); } line(ctx, pts, col.s[2], 3); }
  };
  go();
}
