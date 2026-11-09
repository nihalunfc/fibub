// #389 breeder's equation: selection intensity against scipy (norm.pdf(norm.ppf(1 - p)) / p), parent-offspring
// regression against scipy.stats.linregress, and variance components against statsmodels anova_lm (unbalanced).
import { intensity, response, parentOffspring, components, EXAMPLE_PO, EXAMPLE_VC } from '../../src/lib/sci/breedeq.ts';

export default async (check) => {
  const near = (a, b, tol) => Number.isFinite(a) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const sp = { 0.5: 0.7978845608028654, 0.2: 1.3998096020390416, 0.1: 1.7549833193248683, 0.05: 2.0627128075074275, 0.01: 2.665214220345808, 0.001: 3.367090077063995, 0.9: 0.19499814659165204 };
  check('breeders: selection intensity = scipy for p from 0.1 % to 90 %', Object.entries(sp).every(([p, i]) => near(intensity(Number(p)).i, i, 2e-7)));
  check('breeders: i at 50 % is sqrt(2/pi)', near(intensity(0.5).i, Math.sqrt(2 / Math.PI), 1e-12) && near(intensity(0.5).z, 0, 1e-12));
  {
    const r = response({ h2: 0.4, p: 0.1, sigmaP: 8, c: 1, L: 2, mean: 100 });
    check('breeders: example response R = i h2 sigmaP', near(r.S, 1.7549833193248683 * 8, 1e-7) && near(r.R, 0.4 * 1.7549833193248683 * 8, 1e-7) && near(r.perYear, r.R / 2, 1e-12) && near(r.newMean, 100 + r.R, 1e-12) && near(r.pct, r.R, 1e-12));
    const h = response({ h2: 0.4, p: 0.1, sigmaP: 8, c: 0.5 });
    check('breeders: one parent selected halves the response', near(h.R, r.R / 2, 1e-12) && h.perYear === null && h.newMean === null);
    check('breeders: R = h2 S from S', response({ h2: 0.25, S: 12 }).R === 3);
    let e = ''; try { response({ h2: 1.2, S: 3 }); } catch (x) { e = x.message; } let e2 = ''; try { intensity(1); } catch (x) { e2 = x.message; }
    check('breeders: bad h2 and p refused', e.includes('between 0 and 1') && e2.includes('between 0 and 100'));
  }
  {
    const rows = EXAMPLE_PO.split('\n').slice(1).map((l) => l.split('\t').map(Number));
    const r = parentOffspring(rows.map((x) => x[0]), rows.map((x) => x[1]), true);
    check('breeders: mid-parent regression = scipy linregress', near(r.b, 0.4460917810621935, 1e-12) && near(r.seB, 0.1664662623932295, 1e-10) && near(r.a, 26.264022645236935, 1e-10) && near(r.r, 0.5340229599994266, 1e-12) && near(r.p, 0.015294129995768888, 1e-7));
    check('breeders: mid-parent h2 = b, CI with t(0.975, 18) = 2.10092', near(r.h2, r.b, 0) && near(r.ciH2[0], 0.4460917810621935 - 2.1009220402410382 * 0.1664662623932295, 1e-8));
    const one = parentOffspring(rows.map((x) => x[0]), rows.map((x) => x[1]), false);
    check('breeders: one parent h2 = 2b', near(one.h2, 2 * 0.4460917810621935, 1e-12) && near(one.seH2, 2 * 0.1664662623932295, 1e-10));
    let e = ''; try { parentOffspring([1, 1, 1], [2, 3, 4], true); } catch (x) { e = x.message; }
    check('breeders: equal parent values refused', e.includes('all the same'));
  }
  {
    const rows = EXAMPLE_VC.split('\n').slice(1).map((l) => { const [g, y] = l.split('\t'); return { group: g, y: Number(y) }; });
    const c = components(rows, 'clone');
    check('breeders: one-way ANOVA (unbalanced) = statsmodels', near(c.msb, 108.386623, 1e-7) && near(c.msw, 4.987157, 1e-6) && near(c.F, 21.733149, 1e-6) && near(c.p, 7.779907e-07, 1e-5) && c.dfb === 5 && c.dfw === 17);
    check('breeders: n0 and broad-sense H2 (plant and line-mean basis)', near(c.n0, 3.8260869565217392, 1e-12) && near(c.varB, 27.024860516934044, 1e-8) && near(c.h2, 0.8442098539559434, 1e-9) && near(c.h2Mean, 0.9539873398022924, 1e-9));
    const hs = components(rows, 'halfsib'), fs = components(rows, 'fullsib');
    check('breeders: half-sib 4x and full-sib 2x the between-group share', near(hs.h2, 4 * 27.024860516934044 / (27.024860516934044 + 4.987156862745093), 1e-9) && near(fs.h2, 2 * c.h2, 1e-12) && hs.h2Mean === null);
    const flat = components([{ group: 'a', y: 1 }, { group: 'a', y: 3 }, { group: 'b', y: 1.5 }, { group: 'b', y: 2.5 }], 'clone');
    check('breeders: negative variance component set to 0 and flagged', flat.truncated && flat.varB === 0 && flat.h2 === 0);
  }
};
