// Asymmetric autocatalysis (the Soai reaction): the product is its own catalyst, and RR pairs make R, SS pairs
// make S, while mixed RS pairs do nothing. Start with an almost even mixture and run batch after batch,
// each seeded with the last batch's product (dimer model, src/lib/sci/chiralamp.ts).
import { stage, clear, text, dot, plot, line, rng, type Stage } from '../kit';
import { soaiBatch } from '../../../lib/sci/chiralamp';

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: a self-copying reaction', title: 'Turn a tiny excess into almost one hand', h: 380, alt: 'A flask fills with teal R and amber S molecules as the reaction runs; a plot beside it shows the enantiomeric excess climbing batch by batch.', caption: 'Model: product molecules pair up (mixed-pair constant K, inactive mixed pairs), and each batch is seeded with 5% product from the batch before. The real Soai reaction adds diisopropylzinc to a pyrimidine-5-carbaldehyde; the model is a simplification used to explain it.' });
  const r = rng(8);
  let lg = -6.3, K = 50, rounds: number[] = [], cur: { hist: { conv: number; ee: number }[] } | null = null, prog = 0, e = 0;
  s.slider('Starting excess', -7, -0.5, 0.1, lg, (v) => `${fmtPct(10 ** v)}`, (v) => { lg = v; restart(); });
  s.slider('Mixed-pair constant K', 4, 400, 1, K, (v) => `${v}`, (v) => { K = v; restart(); });
  s.button('Restart', restart);
  function restart() { e = 10 ** lg; rounds = [e]; cur = soaiBatch(e, 0.05, 1, K); prog = 0; }
  restart();
  const dots = Array.from({ length: 220 }, () => ({ x: r(), y: r(), u: r() }));
  s.play((dt) => {
    prog += dt * 0.35;
    if (prog >= 1 && rounds.length < 6) { e = cur!.ee; rounds.push(e); cur = soaiBatch(e, 0.05, 1, K); prog = 0; }
    if (prog >= 1.6) restart();
    const h = cur!.hist, k = Math.min(h.length - 1, Math.floor(Math.min(1, prog) * (h.length - 1))), now = h[k];
    clear(s); const c = s.col;
    const fx = 20, fy = 40, fw = 240, fh = 280, filled = 0.05 + 0.95 * now.conv;
    s.c.strokeStyle = c.line; s.c.lineWidth = 2; s.c.strokeRect(fx, fy, fw, fh);
    const pR = (1 + now.ee) / 2;
    for (const d of dots) if (d.y > 1 - filled) dot(s, fx + 10 + d.x * (fw - 20), fy + 10 + d.y * (fh - 20), 4, d.u < pR ? c.teal : c.amber);
    text(s, `Batch ${rounds.length}: ${Math.round(now.conv * 100)}% converted`, fx, fy - 12, { bold: true, size: 13 });
    const box = { x: 340, y: 30, w: s.W - 365, h: 290 };
    const all = [...rounds, now.ee];
    const P = plot(s, box, [0, 6], [-7, 0], { xLabel: 'Batch', yLabel: 'ee (log scale)', xTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [-6, -4, -2, 0], yf: (v) => fmtPct(10 ** v) });
    const Y = (v: number) => P.Y(Math.max(-7, Math.log10(Math.max(1e-7, Math.abs(v)))));
    line(s, all.map((v, i) => [P.X(i === all.length - 1 ? rounds.length - 1 + Math.min(1, prog) : i), Y(v)] as [number, number]), c.blue, 2.5);
    all.forEach((v, i) => i < rounds.length && dot(s, P.X(i), Y(v), 4.5, c.ink));
    s.mark();
    s.out(`ee now <b>${fmtPct(now.ee)}</b> (R ${(100 * pR).toFixed(1)}% : S ${(100 * (1 - pR)).toFixed(1)}%). ${rounds.length >= 4 ? 'In 1995 and the years after, Soai\'s group took an excess of 0.00005% to above 99.5% in three such batches.' : 'Each batch, the minor hand is tied up in idle mixed pairs while the major hand copies itself.'}`);
  });
}
function fmtPct(x: number) { const p = Math.abs(x) * 100; return `${p >= 10 ? p.toFixed(1) : p >= 0.01 ? +p.toPrecision(2) : p.toExponential(0)}%`; }
