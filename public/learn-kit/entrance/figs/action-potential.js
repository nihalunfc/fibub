// Neural control: an action potential at one point of an axon. Set the stimulus strength: below threshold the
// membrane barely changes; at or above threshold it fires a full spike of the same size (all or none). Move the time
// marker to see the phase and which ions are moving. Values are typical textbook ones (rest about -70 mV).
import { canvas, axes, line, text, row, slider, readout, dot } from '../../kit.js';

const REST = -70, TH = -55, PEAK = 35, UNDER = -80;
const vm = (t, s) => { // t in ms after a stimulus at t = 1 ms; s = depolarisation the stimulus gives (mV)
  if (t < 1) return REST;
  const local = REST + s * Math.exp(-(t - 1) / 0.6);
  if (REST + s < TH) return local;
  const u = t - 1.2; // the spike
  if (u < 0) return REST + (TH - REST) * (t - 1) / 0.2;
  if (u < 0.5) return TH + (PEAK - TH) * Math.sin((u / 0.5) * Math.PI / 2);
  if (u < 1.6) return PEAK + (UNDER - PEAK) * (1 - Math.cos(((u - 0.5) / 1.1) * Math.PI)) / 2;
  return REST + (UNDER - REST) * Math.exp(-(u - 1.6) / 0.9);
};
export default function (host) {
  let s = 25, t = 1.6;
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'Membrane potential against time during an action potential' });
  const ctl = row(host);
  slider(ctl, { label: 'Stimulus', min: 0, max: 40, step: 1, value: s, fmt: (v) => `+${v} mV`, oninput: (v) => { s = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Time', min: 0, max: 6, step: 0.05, value: t, fmt: (v) => `${v.toFixed(2)} ms`, oninput: (v) => { t = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const fire = REST + s >= TH, v = vm(t, s), u = t - 1.2;
    let ph;
    if (t < 1) ph = 'Resting: inside negative (polarised). K⁺ leaks out through open channels; Na⁺ hardly gets in; the Na⁺/K⁺ pump sends 3 Na⁺ out for 2 K⁺ in.';
    else if (!fire) ph = 'Below threshold: a small local change that fades. No impulse is sent (all or none).';
    else if (u < 0) ph = 'Stimulus: the membrane reaches threshold (about −55 mV).';
    else if (u < 0.5) ph = '<b>Depolarisation</b>: the membrane becomes freely permeable to Na⁺, which rushes in; the inside turns positive (reversal of polarity). This is the action potential (nerve impulse).';
    else if (u < 1.6) ph = '<b>Repolarisation</b>: Na⁺ permeability shuts off and K⁺ permeability rises; K⁺ rushes out and the inside turns negative again.';
    else ph = 'Back to rest, with a brief overshoot below the resting value; the pump restores the ion balance and the fibre is ready for the next impulse.';
    out.innerHTML = `Membrane potential ≈ <b>${Math.round(v)} mV</b>. ${ph} ${fire ? 'A stronger stimulus would not make this spike bigger.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [0, 6], y: [-90, 50], xlabel: 'time (ms)', ylabel: 'membrane potential (mV)', yt: [-80, -55, 0, 40] });
    ctx.save(); clip();
    line(ctx, [[X(0), Y(TH)], [X(6), Y(TH)]], col.muted, 1, [4, 4]);
    line(ctx, [[X(0), Y(0)], [X(6), Y(0)]], col.line, 1);
    const p = []; for (let x = 0; x <= 6; x += 0.02) p.push([X(x), Y(vm(x, s))]);
    line(ctx, p, col.s[0], 3);
    ctx.restore();
    text(ctx, 'threshold', X(5.9), Y(TH) - 9, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'stimulus', X(1), Y(-88) , { color: col.muted, size: 10, align: 'center' });
    dot(ctx, X(t), Y(vm(t, s)), 5, col.s[1]);
  };
  cv.redraw(); show();
}
