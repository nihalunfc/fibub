// A nerve cell you can poke. Tap "Poke" to inject a brief current: small pokes fade, but past a threshold the
// cell fires an all-or-nothing spike as sodium channels open (Na⁺ rushes in) and then potassium channels
// open (K⁺ flows out). Maths: the Hodgkin–Huxley model (1952), the Action potential tool's engine.
import { stage, clear, text, dot, line, plot, type Stage } from '../kit';
import { neuron } from './_hh';

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: fire a neuron', title: 'Poke a nerve cell and watch it answer', h: 380, alt: 'Top: a patch of membrane with sodium and potassium channels opening; bottom: a voltage trace scrolling, showing spikes when the poke is strong enough.', caption: 'Hodgkin–Huxley squid-axon model at 6.3 °C, voltages shifted so rest is −65 mV. Time runs about 40 times slower than real life. The m, h and n gates set how open the channels are.' });
  let amp = 10, n = neuron(), pokeUntil = -1, trace: number[] = [], spikes = 0, lastV = -65;
  s.slider('Poke strength', 0, 30, 0.5, amp, (v) => `${v} µA/cm² for 1 ms`, (v) => { amp = v; });
  s.button('Poke', () => { pokeUntil = n.st.t + 1; });
  s.button('Hold on (steady current)', () => { pokeUntil = n.st.t + 60; });
  s.play((dt) => {
    const sim = dt * 40; // ms of model time per frame
    for (let k = 0, steps = Math.round(sim / 0.025); k < steps; k++) {
      const V = n.step(0.025, n.st.t < pokeUntil ? amp : 0, false, null, 0);
      if (lastV < 0 && V >= 0) spikes++;
      lastV = V; if (k % 8 === 0) trace.push(V);
    }
    if (trace.length > 480) trace = trace.slice(-480);
    clear(s); const c = s.col;
    const [V, m, h, nn] = n.st.s;
    const gNa = m ** 3 * h, gK = nn ** 4;
    // Membrane strip with channels.
    const my = 70;
    s.c.fillStyle = c.soft; s.c.fillRect(20, my - 12, s.W - 40, 24);
    text(s, 'outside', 24, my - 22, { size: 11, colour: c.muted }); text(s, 'inside', 24, my + 32, { size: 11, colour: c.muted });
    for (let i = 0; i < 8; i++) {
      const x = 70 + i * ((s.W - 120) / 7), na = i % 2 === 0, open = na ? gNa : gK;
      s.c.fillStyle = na ? c.amber : c.blue; s.c.fillRect(x - 9, my - 14, 6, 28); s.c.fillRect(x + 3, my - 14, 6, 28);
      if (open > 0.02) for (let j = 0; j < 3; j++) { const ph = ((performance.now() / 300 + j / 3 + i * 0.1) % 1); const yy = na ? my - 26 + 52 * ph : my + 26 - 52 * ph; dot(s, x, yy, 3, na ? c.amber : c.blue, Math.min(1, open * 4)); }
    }
    text(s, 'Na⁺ channels (amber) · K⁺ channels (blue)', s.W - 20, 24, { size: 12, align: 'right' });
    const box = { x: 60, y: 125, w: s.W - 80, h: 200 };
    const P = plot(s, box, [0, 480], [-90, 50], { yLabel: 'Membrane voltage (mV)', yTicks: [-80, -40, 0, 40] });
    line(s, trace.map((v, i) => [P.X(i), P.Y(v)] as [number, number]), c.ink, 2);
    line(s, [[box.x, P.Y(-65)], [box.x + box.w, P.Y(-65)]], c.muted, 1, [3, 5]);
    text(s, `V = ${V.toFixed(0)} mV · spikes so far ${spikes}`, box.x, box.y + box.h + 34, { bold: true, size: 13 });
    s.mark();
    s.out(V > -20 ? 'A spike! Sodium gates (m) snapped open and Na⁺ rushed in, flipping the inside positive. Now the h gates close and potassium gates (n) open to bring it back down.' : amp < 6.5 ? 'Small pokes just fade away: below threshold, potassium and leak currents win. Try a stronger poke.' : 'Press Poke. Above about 7 µA/cm² for 1 ms the cell answers with a full-size spike: all or nothing.');
  });
}
