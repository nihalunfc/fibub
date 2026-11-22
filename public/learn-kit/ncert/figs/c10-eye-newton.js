// Class 10 Colourful World: recombining the colours of the spectrum (Newton's experiments). (1) A second prism, placed
// upside down after the first, bends the colours back together into white light, so the prism does not "make" the colours:
// they were already in white light. (2) Newton's disc: a card painted with the seven colours looks white when it spins fast,
// because the eye cannot separate the colours that arrive faster than it can follow (persistence of vision, about 1/16 s).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

const C = [['#8a2be2', 'V'], ['#4b3fd6', 'I'], ['#2a6df4', 'B'], ['#2bb24c', 'G'], ['#e9c70a', 'Y'], ['#ff8c00', 'O'], ['#e5241d', 'R']];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export default function (host) {
  let mode = 'prisms', rps = 0, spin = 0, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'Two prisms recombining the spectrum into white light, and Newton’s colour disc' });
  const ctl = row(host);
  choice(ctl, 'Experiment', [['prisms', 'Two prisms'], ['disc', 'Newton’s disc']], mode, (v) => { mode = v; sw.style.display = v === 'disc' ? '' : 'none'; update(); });
  slider(ctl, { label: 'Spin speed', min: 0, max: 30, step: 1, value: rps, fmt: (v) => (v === 0 ? 'stopped' : `${v} turns/s`), oninput: (v) => { rps = v; update(); } });
  const sw = ctl.lastElementChild; sw.style.display = 'none';
  const out = readout(host);
  loop(host, (dt) => { t += dt; spin += dt * Math.min(rps, 3) * 2 * Math.PI * (rps > 0 ? 1 : 0); cv.redraw(); });
  function update() {
    out.innerHTML = mode === 'prisms' ? 'The first prism spreads white light into the spectrum. An identical prism, <b>upside down</b>, bends every colour back so they overlap again: white light comes out. So white light is a mixture of the seven colours.'
      : rps < 6 ? 'Slow: you can see the separate colours go round. Turn the speed up.' : `At ${rps} turns a second each colour flashes past too quickly for the eye to separate, so the sectors blend into <b>nearly white</b> (a slightly grey white in real life).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'disc') {
      title(ctx, 'Newton’s disc: spin it fast', col);
      const R = Math.min(w * 0.36, h * 0.36), cx = w / 2, cy = h * 0.55, blend = Math.max(0, Math.min(1, (rps - 3) / 12));
      const avg = [0, 1, 2].map((k) => C.reduce((a, c) => a + hex(c[0])[k], 0) / C.length), mix = (c) => `rgb(${hex(c).map((v, k) => Math.round(v + (avg[k] * 0.2 + 235 * 0.8 - v) * blend)).join(',')})`;
      C.forEach(([c], i) => { const a0 = spin + (i / 7) * 2 * Math.PI, a1 = spin + ((i + 1) / 7) * 2 * Math.PI; ctx.fillStyle = mix(c); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); ctx.fill(); });
      dot(ctx, cx, cy, 4, col.ink); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      text(ctx, rps === 0 ? 'stopped' : rps < 6 ? 'colours visible' : 'looks white', cx, cy + R + 18, { color: col.ink, size: 12, weight: 700, align: 'center' });
      return;
    }
    title(ctx, 'A second, inverted prism recombines the colours', col);
    const cy = h * 0.46, side = Math.min(w * 0.24, h * 0.38), hh = side * 0.866, c1 = w * 0.3, c2 = w * 0.64;
    const tri = (x, up) => { ctx.save(); ctx.fillStyle = col.soft; ctx.globalAlpha = 0.65; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.beginPath(); if (up) { ctx.moveTo(x, cy - hh * 0.55); ctx.lineTo(x - side / 2, cy + hh * 0.45); ctx.lineTo(x + side / 2, cy + hh * 0.45); } else { ctx.moveTo(x - side / 2, cy - hh * 0.45); ctx.lineTo(x + side / 2, cy - hh * 0.45); ctx.lineTo(x, cy + hh * 0.55); } ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore(); };
    tri(c1, true); tri(c2, false);
    const rightFace1 = (y) => c1 + (side / 2) * (1 - (y - (cy - hh * 0.55)) / hh), leftFace2 = (y) => c2 - side / 2 + (side / 2) * ((y - (cy - hh * 0.45)) / hh), rightFace2 = (y) => c2 + side / 2 - (side / 2) * ((y - (cy - hh * 0.45)) / hh);
    const yE = cy - hh * 0.05, E1 = [rightFace1(yE), yE], yO = cy + hh * 0.28, E2 = [rightFace2(yO), yO];
    const in1 = [c1 - side / 2 + 6, cy + hh * 0.08];
    line(ctx, [[8, cy + hh * 0.3], in1, E1], col.ink, 3); text(ctx, 'white', 8, cy + hh * 0.3 + 16, { color: col.ink, size: 11, weight: 700 });
    C.forEach(([c], i) => { const yq = cy - hh * 0.2 + hh * 0.62 * ((6 - i) / 6); line(ctx, [E1, [leftFace2(yq), yq], E2], c, 2.2); });
    line(ctx, [E2, [w - 22, E2[1] + 6]], col.ink, 3); text(ctx, 'white again', w - 8, E2[1] + 24, { color: col.ink, size: 11, weight: 700, align: 'right' });
    text(ctx, 'violet bends most, red least', (E1[0] + c2) / 2, cy - hh * 0.62, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'not to scale', 8, h - 10, { color: col.muted, size: 10 });
  };
  update();
}
