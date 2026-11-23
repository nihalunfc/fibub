// Class 11 Biology, Neural control: conduction of the nerve impulse. In an unmyelinated axon the action potential must be regenerated at every bit of membrane, so it creeps along.
// In a myelinated axon the sheath stops ions crossing, so the impulse jumps from one node of Ranvier to the next (saltatory conduction): faster and cheaper. Speeds here are schematic (about 1 : 10).
import { canvas, text, title, line, row, button, readout, loop } from '../../kit.js';

export default function (host) {
  let p = 0;
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 290, label: 'A race between an impulse creeping along an unmyelinated axon and one jumping between nodes along a myelinated axon' });
  const ctl = row(host), ro = readout(host);
  const anim = loop(host, (dt) => { p += dt * 0.25; if (p > 1.35) p = 0; go(); }); anim.button(ctl); button(ctl, 'Restart', () => { p = 0; go(); });
  const go = () => { ro.textContent = `Same length of axon. Myelinated: ${p * 10 >= 10 ? 'arrived' : 'running'} (jumps node to node, up to about 100 m/s). Unmyelinated: ${p >= 1 ? 'arrived' : 'still creeping'} (about 1 m/s). Myelin also saves energy, since the pump works only at the nodes.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Saltatory conduction', col), x0 = 24, x1 = w - 24, y1 = t0 + 40, y2 = t0 + 120;
    text(ctx, 'Myelinated axon (sheath with nodes)', x0, y1 - 22, { color: col.ink, size: 11, weight: 700 });
    line(ctx, [[x0, y1], [x1, y1]], col.muted, 3); const n = 6, seg = (x1 - x0) / n;
    for (let i = 0; i < n; i++) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.roundRect(x0 + i * seg + 6, y1 - 9, seg - 12, 18, 6); ctx.fill(); ctx.globalAlpha = 1; }
    const q = Math.min(1, p * 4), nodeI = Math.min(n, Math.floor(q * n + 0.5)), jx = x0 + Math.min(1, q) * (x1 - x0);   // quick jumps
    const jump = Math.min(n, Math.floor(Math.min(1, p * 5) * n)); const jx2 = x0 + jump * seg; if (p * 5 < 1.05) { ctx.beginPath(); ctx.arc(jx2, y1, 8, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); } void nodeI; void jx;
    text(ctx, 'Unmyelinated axon', x0, y2 - 22, { color: col.ink, size: 11, weight: 700 });
    line(ctx, [[x0, y2], [x1, y2]], col.muted, 3);
    const ux = x0 + Math.min(1, p) * (x1 - x0); ctx.beginPath(); ctx.arc(ux, y2, 8, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); line(ctx, [[x0, y2], [ux, y2]], col.s[3], 3);
    text(ctx, 'finish', x1, y2 + 22, { color: col.muted, size: 10, align: 'right' });
    for (let i = 1; i <= n; i++) text(ctx, '', x0 + i * seg, y1 + 20, { size: 9 });
  };
  go();
}
