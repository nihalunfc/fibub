// Optogenetics in one cell: the neuron now carries channelrhodopsin-2 (or the silencer halorhodopsin).
// Flash blue light at a chosen rate and see whether each flash makes one spike. Fast flashing overruns the
// channel (it takes ~10 ms to close) and the cell's own recovery. Yellow light on halorhodopsin silences
// a cell that is being driven to fire.
import { stage, clear, text, line, plot, type Stage } from '../kit';
import { neuron, CHR2, NPHR } from './_hh';

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: play the neuron with light', title: 'Flash light at a neuron that carries a light-gated channel', h: 380, alt: 'A voltage trace with coloured bars marking light flashes; spikes follow each flash at low rates but miss flashes at high rates. A tally gives spikes per flash.', caption: 'Hodgkin–Huxley neuron (the Action potential tool\'s engine) plus a light-gated conductance that opens in about 1.5 ms and closes in about 10 ms, reversing at 0 mV like ChR2. Halorhodopsin is drawn as an outward current while yellow light is on. Time slowed about 40 times.' });
  let hz = 10, mode = 'chr2', gmax = 1.2, n = neuron(), tr: number[] = [], lit: boolean[] = [], flashes = 0, spikes = 0, lastV = -65, lastOn = false;
  s.choice([['chr2', 'Blue light + ChR2 (switch on)'], ['nphr', 'Yellow light + halorhodopsin (switch off)']], mode, (v) => { mode = v; flashes = spikes = 0; });
  s.slider('Flash rate', 2, 100, 1, hz, (v) => `${v} per second`, (v) => { hz = v; flashes = spikes = 0; });
  s.slider('Channel amount', 0.2, 3, 0.1, gmax, (v) => `${v.toFixed(1)} mS/cm²`, (v) => { gmax = v; });
  s.play((dt) => {
    const ms = dt * 40;
    for (let k = 0, steps = Math.round(ms / 0.025); k < steps; k++) {
      const t = n.st.t;
      let on: boolean, I = 0;
      if (mode === 'chr2') { const per = 1000 / hz; on = t % per < 5; }
      else { on = t % 600 > 250 && t % 600 < 450; I = 10; } // steady drive makes it fire; yellow light for 200 ms of every 600 ms
      if (on && !lastOn) flashes++;
      lastOn = on;
      const V = n.step(0.025, I, on, mode === 'chr2' ? CHR2 : NPHR, gmax);
      if (lastV < 0 && V >= 0) spikes++;
      lastV = V; if (k % 8 === 0) { tr.push(V); lit.push(on); }
    }
    while (tr.length > 600) { tr.shift(); lit.shift(); }
    clear(s); const c = s.col;
    const box = { x: 60, y: 30, w: s.W - 80, h: 270 };
    const P = plot(s, box, [0, 600], [-100, 50], { yLabel: 'Membrane voltage (mV)', yTicks: [-80, -40, 0, 40] });
    s.c.fillStyle = mode === 'chr2' ? c.blue : c.amber;
    lit.forEach((on, i) => { if (on) { s.c.globalAlpha = 0.25; s.c.fillRect(P.X(i), box.y, P.X(i + 1) - P.X(i) + 0.5, 12); s.c.globalAlpha = 1; } });
    line(s, tr.map((v, i) => [P.X(i), P.Y(v)] as [number, number]), c.ink, 1.8);
    const fid = flashes ? spikes / flashes : 0;
    text(s, mode === 'chr2' ? `Flashes ${flashes} · spikes ${spikes} · ${(100 * Math.min(fid, 9.99)).toFixed(0)}% spikes per flash` : `Spikes ${spikes} (bars: yellow light on)`, box.x, box.y + box.h + 34, { bold: true, size: 13 });
    s.mark();
    s.out(mode === 'chr2' ? (hz <= 30 ? 'Each 5 ms flash opens enough channels to cross threshold: <b>one flash, one spike</b>. That timing precision (milliseconds) is what Boyden, Zhang, Bamberg, Nagel and Deisseroth showed in 2005.' : 'At high rates spikes start to drop out or merge: ChR2 closes slowly and the neuron needs time to recover. Faster variants (like ChETA) were engineered to follow 200 flashes a second.') : 'The cell is driven to fire all the time; while the yellow light is on, halorhodopsin pumps chloride in and the cell goes <b>silent</b>, then fires again when the light goes off (Zhang and colleagues, 2007).');
  });
}
