// #1446 Meselson-Stahl. Band predictions checked against the textbook fractions for each model (semi-conservative
// 2/2^g hybrid, conservative 1/2^g heavy, dispersive one band at 1/2^g ¹⁵N) for g = 0..6, and molecule counts 2^g.
import * as M from '../../src/lib/sci/meselson.ts';
const close = (a, b) => Math.abs(a - b) < 1e-12;
export default async (check) => {
  let ok = true;
  for (let g = 0; g <= 6; g++) {
    const s = M.bands('semi', g), c = M.bands('conservative', g), d = M.bands('dispersive', g);
    if (M.molecules('semi', g).length !== 2 ** g) ok = false;
    if (g === 0) { if (s.length !== 1 || s[0].heavy !== 1) ok = false; continue; }
    const hyb = s.find((b) => b.heavy === 0.5)?.share ?? 0, light = s.find((b) => b.heavy === 0)?.share ?? 0;
    if (!close(hyb, 2 / 2 ** g) || !close(light, 1 - 2 / 2 ** g) || !close(hyb, M.hybridShare(g))) ok = false;
    const heavy = c.find((b) => b.heavy === 1)?.share ?? 0;
    if (!close(heavy, 1 / 2 ** g) || c.some((b) => b.heavy === 0.5)) ok = false;
    if (d.length !== 1 || !close(d[0].heavy, 1 / 2 ** g) || d[0].share !== 1) ok = false;
  }
  check('meselson: band fractions for all three models, g = 0..6', ok);
  check('meselson: generation 1 tells conservative apart', M.bands('semi', 1).map((b) => b.name).join() === 'hybrid (¹⁵N/¹⁴N)' && M.bands('conservative', 1).map((b) => b.name).join() === 'heavy (¹⁵N/¹⁵N),light (¹⁴N/¹⁴N)');
  check('meselson: generation 2 tells dispersive apart', M.bands('semi', 2).length === 2 && M.bands('dispersive', 2).length === 1 && M.bands('dispersive', 2)[0].name === '25 % ¹⁵N');
  const st = M.strands('semi', 2);
  check('meselson: heated strands, semi g2: 1/4 heavy, 3/4 light', st.length === 2 && close(st[0].share, 0.25) && close(st[1].share, 0.75));
  check('meselson: total ¹⁵N is conserved', ['semi', 'conservative', 'dispersive'].every((m) => close(M.molecules(m, 5).reduce((a, [x, y]) => a + x + y, 0), 2)));
  let bad = 0; try { M.molecules('semi', -1); } catch { bad++; } try { M.molecules('semi', 1.5); } catch { bad++; }
  check('meselson: bad input refused', bad === 2);
};
