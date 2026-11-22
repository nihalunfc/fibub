// Agarose gel electrophoresis. DNA is negatively charged, so it runs from the negative electrode (wells, top) toward the
// positive one (bottom). Small fragments slip through the gel faster than big ones, so each lane ends up as a ladder of
// bands. Run the gel and compare the crime-scene DNA with three suspects: matching band patterns point to the same source.
import { canvas, loop, row, slider, choice, button, readout, text, title, clamp } from '../kit.js';

const LANES = [['Ladder', [3000, 2000, 1500, 1000, 700, 500, 300, 150]], ['Scene', [2000, 1000, 500]], ['Suspect A', [2500, 1000, 500, 200]], ['Suspect B', [2000, 1000, 500]], ['Suspect C', [3000, 1500, 700]]];

export default function (host) {
  let time = 0, gel = 1.0, volt = 100, running = false;
  const cv = canvas(host, { aspect: 1.0, max: 420, min: 340, label: 'An agarose gel with five lanes of DNA fragments migrating downward' });
  const c1 = row(host), c2 = row(host);
  const anim = loop(host, (dt) => { if (time < 60) time += dt * volt / 100 * 6; cv.redraw(); show(); }, { autoplay: false }); anim.button(c1);
  button(c1, 'Reset', () => { time = 0; show(); });
  slider(c2, { label: 'Voltage', min: 50, max: 150, step: 10, value: volt, fmt: (v) => `${v} V`, oninput: (v) => { volt = v; } });
  choice(c2, 'Agarose', [[0.7, '0.7% (big pieces)'], [1.0, '1%'], [2.0, '2% (small pieces)']], gel, (v) => { gel = v; show(); });
  const out = readout(host);
  const dist = (bp) => clamp(time * (0.045 / gel) * (4.2 - Math.log10(bp)) * (1.0 + 0.0), 0, 1) ;
  function show() { const m = LANES[1][1].join(',') === LANES[3][1].join(','); out.innerHTML = `Run time <b>${(time / 6).toFixed(1)}</b> units. The smaller the fragment, the farther it travels. A higher agarose % makes tighter pores: better for separating small pieces. The scene sample has bands at ${LANES[1][1].join(', ')} bp, and <b>Suspect B</b> has exactly the same pattern, so B's DNA matches. This is how DNA fingerprinting and cut-DNA analysis are read.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Gel (wells at the − end, run toward +)', col);
    const T = 66, B = h - 30, lw = (w - 24) / 5;
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.14; ctx.fillRect(10, T - 8, w - 20, B - T + 8); ctx.globalAlpha = 1;
    text(ctx, '−', 14, T - 18, { color: col.bad, size: 16, weight: 700, fit: false }); text(ctx, '+', 14, B + 14, { color: col.good, size: 16, weight: 700, fit: false });
    LANES.forEach(([nm, bands], i) => {
      const x = 12 + i * lw + lw / 2; ctx.fillStyle = col.panel; ctx.fillRect(x - lw * 0.35, T - 8, lw * 0.7, 12); ctx.strokeStyle = col.muted; ctx.strokeRect(x - lw * 0.35, T - 8, lw * 0.7, 12);
      text(ctx, nm, x, T - 22, { color: i === 1 ? col.bad : col.ink, size: 9.5, weight: 700, align: 'center', fit: false });
      bands.forEach((bp) => { const y = T + dist(bp) * (B - T - 6); ctx.fillStyle = i === 0 ? col.s[2] : (i === 1 ? col.bad : col.s[0]); ctx.fillRect(x - lw * 0.33, y, lw * 0.66, 4); if (i === 0 && time > 20) text(ctx, String(bp), x - lw * 0.38, y + 2, { color: col.muted, size: 8.5, align: 'right', fit: false }); });
    });
    text(ctx, 'band sizes in base pairs (ladder labelled)', w / 2, h - 8, { color: col.muted, size: 10, align: 'center' });
  };
  show();
}
