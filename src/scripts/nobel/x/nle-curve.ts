// Kagan's non-linear effect, live. A catalyst carrying two chiral ligands forms RR, SS and "meso" RS pairs.
// Slide the ligand's purity, how strongly mixed pairs form (K) and how well they react (g): the dumbbells show
// the pairs, the curve shows product ee against ligand ee (Kagan's ML2 model, src/lib/sci/chiralamp.ts).
import { stage, clear, text, dot, line, plot, rng, type Stage } from '../kit';
import { ml2 } from '../../../lib/sci/chiralamp';

const PRESETS: [string, string, number, number][] = [['lin', 'No effect (K = 4, g = 1)', 4, 1], ['pos', 'Positive, (+)-NLE', 100, 0], ['neg', 'Negative, (−)-NLE', 100, 3]];

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: Kagan\'s curve', title: 'When the catalyst\'s purity does not pass straight to the product', h: 380, alt: 'Left: a flask of dumbbell-shaped pairs in three colours (RR, SS, RS). Right: a plot of product ee against ligand ee with a straight diagonal and a curve that bows above or below it.', caption: 'ML2 model (Kagan and co-workers, 1994). ee_max is set to 100% so the straight line is the "no effect" expectation. Pairs are redrawn from the model\'s shares x (RR), y (SS) and z (RS).' });
  const r = rng(2);
  let e = 0.4, K = 100, g = 0;
  const eS = s.slider('Ligand ee', 0, 1, 0.01, e, (v) => `${Math.round(v * 100)}%`, (v) => { e = v; });
  const KS = s.slider('Mixed-pair constant K', 0.5, 3, 0.05, Math.log10(K), (v) => `${+(10 ** v).toPrecision(2)}`, (v) => { K = 10 ** v; });
  const gS = s.slider('Mixed-pair reactivity g', 0, 4, 0.05, g, (v) => v.toFixed(2), (v) => { g = v; });
  s.choice(PRESETS.map(([id, t]) => [id, t]), 'pos', (v) => { const p = PRESETS.find((x) => x[0] === v)!; K = p[2]; g = p[3]; KS.set(Math.log10(K)); gS.set(g); });
  const pairs = Array.from({ length: 36 }, () => ({ x: r(), y: r(), a: r() * 6, u: r() }));
  let sweep = 0;
  s.play((dt) => {
    sweep += dt;
    const m = ml2(e, K, g);
    clear(s); const c = s.col;
    // Flask of pairs.
    const fx = 20, fy = 40, fw = 250, fh = 260;
    s.c.strokeStyle = c.line; s.c.lineWidth = 2; s.c.strokeRect(fx, fy, fw, fh);
    for (const p of pairs) {
      p.a += dt * 0.8; const px = fx + 18 + p.x * (fw - 36) + Math.sin(sweep + p.a) * 3, py = fy + 18 + p.y * (fh - 36) + Math.cos(sweep * 1.3 + p.a) * 3;
      const kind = p.u < m.x ? 'RR' : p.u < m.x + m.y ? 'SS' : 'RS';
      const [a1, a2] = kind === 'RR' ? [c.teal, c.teal] : kind === 'SS' ? [c.amber, c.amber] : [c.teal, c.amber];
      const dx = Math.cos(p.a) * 8, dy = Math.sin(p.a) * 8;
      line(s, [[px - dx, py - dy], [px + dx, py + dy]], c.muted, 2);
      dot(s, px - dx, py - dy, 5, a1); dot(s, px + dx, py + dy, 5, a2);
      if (kind === 'RS' && g === 0) { s.c.strokeStyle = c.muted; s.c.lineWidth = 1; s.c.beginPath(); s.c.arc(px, py, 12, 0, Math.PI * 2); s.c.stroke(); }
    }
    text(s, `RR ${(100 * m.x).toFixed(0)}% · SS ${(100 * m.y).toFixed(0)}% · RS ${(100 * m.z).toFixed(0)}%`, fx, fy - 10, { size: 12, bold: true });
    // Curve.
    const box = { x: 345, y: 30, w: s.W - 370, h: 270 };
    const P = plot(s, box, [0, 1], [-0.2, 1], { xLabel: 'Ligand ee', yLabel: 'Product ee', xTicks: [0, 0.5, 1], yTicks: [0, 0.5, 1], xf: (v) => `${v * 100}%`, yf: (v) => `${v * 100}%` });
    line(s, [[P.X(0), P.Y(0)], [P.X(1), P.Y(1)]], c.muted, 1.5, [5, 4]);
    const pts: [number, number][] = []; for (let i = 0; i <= 80; i++) { const ee = i / 80; pts.push([P.X(ee), P.Y(Math.max(-0.2, ml2(ee, K, g).ee))]); }
    line(s, pts, c.blue, 3);
    dot(s, P.X(e), P.Y(Math.max(-0.2, m.ee)), 6, c.ink);
    s.mark();
    const kind = Math.abs(m.ee - e) < 0.01 ? 'no' : m.ee > e ? 'a positive' : 'a negative';
    s.out(`Ligand ${Math.round(e * 100)}% pure → product <b>${Math.round(m.ee * 100)}%</b> ee: ${kind} non-linear effect. The catalyst works at <b>${Math.round(m.rate * 100)}%</b> of the speed of a pure one. ${g < 1 && K > 4 ? 'The mixed pairs act as a <b>reservoir</b>: they lock away the minor hand, so the active catalyst left over is purer than the ligand you added.' : g > 1 ? 'Here the mixed pairs are the busiest catalysts and they make racemic product, dragging the ee down.' : ''}`);
  });
  void eS;
}
