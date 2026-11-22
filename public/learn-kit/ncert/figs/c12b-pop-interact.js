// Class 12 Biology, Organisms and Populations: the six kinds of interaction between two species, written as the effect on each (+ benefits, - harmed, 0 no effect).
// Predation + -, competition - -, parasitism + -, commensalism + 0, amensalism - 0, mutualism + +. An animated pulse shows the direction of the effect.
import { canvas, text, title, line, dot, arrow, row, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let k = 'mut', t = 0;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 260, label: 'Two species with plus, minus or zero signs showing how each is affected by the other in the chosen interaction' });
  const ctl = row(host), ro = readout(host);
  const U = {
    pred: ['Predation', '+', '−', 'Predator', 'Prey', 'A tiger eats a deer. The predator gains food; the prey is killed. Predators also keep prey numbers in check and can control invasive species.'],
    comp: ['Competition', '−', '−', 'Species A', 'Species B', 'Flamingoes and resident fish in South American lakes compete for zooplankton. Both lose: each has less food. Gause showed that of two similar species in one flask, one is excluded.'],
    para: ['Parasitism', '+', '−', 'Parasite', 'Host', 'A tapeworm or a mosquito gains food at the cost of its host. Parasites are specialised: they live on or in the host and usually do not kill it quickly.'],
    comm: ['Commensalism', '+', '0', 'Commensal', 'Partner', 'An orchid growing on a mango branch gets support and light; the mango is not harmed or helped. Cattle egrets feed on insects that cattle stir up.'],
    amen: ['Amensalism', '−', '0', 'Harmed species', 'Producer', 'Penicillium makes an antibiotic that stops bacteria growing; the mould itself is unaffected. A large tree shades out small herbs beneath it with no gain to the tree.'],
    mut: ['Mutualism', '+', '+', 'Species A', 'Species B', 'Lichens (alga and fungus), mycorrhiza (fungus and plant roots) and figs with their wasps. Both partners gain, and some (fig and its wasp) cannot live without each other.'],
  };
  choice(ctl, 'Interaction', Object.entries(U).map(([id, v]) => [id, v[0]]), 'mut', (v) => { k = v; go(); });
  const go = () => { const u = U[k]; ro.textContent = `${u[0]} (${u[1]}, ${u[2]}): ${u[5]}`; cv.redraw(); };
  loop(host, (dt) => { t = (t + dt * 0.7) % 1; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const u = U[k], top = title(ctx, u[0] + ': ' + u[1] + ' ' + u[2], col) + 14, cy = top + (h - top) * 0.45, ax = w * 0.22, bx = w * 0.78, R = Math.min(w * 0.12, 38);
    const sc = (s) => (s === '+' ? col.good : s === '0' ? col.muted : col.bad);
    [[ax, u[1], u[3]], [bx, u[2], u[4]]].forEach(([x, s, n], i) => {
      dot(ctx, x, cy, R, col.soft, col.ink);
      text(ctx, s, x, cy + 1, { color: sc(s), size: R * 1.1, weight: 800, align: 'center' });
      text(ctx, n, x, cy + R + 16, { color: col.ink, size: 11, weight: 700, align: 'center' });
      text(ctx, i === 0 ? 'effect on A' : 'effect on B', x, cy - R - 12, { color: col.muted, size: 10, align: 'center' });
    });
    line(ctx, [[ax + R + 10, cy], [bx - R - 10, cy]], col.line, 2);
    const eff = (from, to, s) => { const d = (to - from) > 0 ? 1 : -1, px = from + (to - from) * t; if (s === '+') dot(ctx, px, cy + (d > 0 ? -10 : 10), 4.5, col.good); else if (s === '−') { dot(ctx, to + (-d) * (R + 14) + d * (R + 14) * 0, cy, 0.1, col.bad); } };
    // benefit flows A->B if B gains, B->A if A gains; harm drawn as a red bar sliding toward the harmed one
    const flow = (x0, x1, c, up) => { const px = x0 + (x1 - x0) * t, y = cy + (up ? -12 : 12); dot(ctx, px, y, 4.5, c); };
    if (u[1] === '+') flow(bx - R - 12, ax + R + 12, col.good, true);
    if (u[2] === '+') flow(ax + R + 12, bx - R - 12, col.good, false);
    if (u[1] === '−') flow(bx - R - 12, ax + R + 12, col.bad, true);
    if (u[2] === '−') flow(ax + R + 12, bx - R - 12, col.bad, false);
    void eff; void arrow;
    text(ctx, '+ gains   − harmed   0 no effect', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
