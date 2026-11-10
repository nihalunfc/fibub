// #1433 Kohlrausch's law. Ostwald α checked against scipy brentq on cα²/(1−α) = K; the line fit against numpy polyfit
// and corrcoef; Λ° sums by hand.
import * as K from '../../src/lib/sci/kohlrausch.ts';
const rel = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.abs(b);
export default async (check) => {
  check('kohlrausch: Ostwald alpha equals scipy', rel(K.alphaOstwald(1.8e-5, 0.001), 0.12546560898608983, 1e-9) && rel(K.alphaOstwald(1.8e-5, 0.01), 0.04153595173906201, 1e-9) && rel(K.alphaOstwald(1.8e-5, 0.1), 0.013326709730779719, 1e-9));
  check('kohlrausch: limiting sums', K.limiting('K+', 'Cl-') === 150 && K.limiting('H+', 'Ac-') === 391 && K.limiting('Mg2+', 'Cl-') === 258 && K.limiting('Na+', 'SO42-') === 260 && K.limiting('Ba2+', 'SO42-') === 287);
  check('kohlrausch: indirect weak acid sum', K.limiting('H+', 'Cl-') + K.limiting('Na+', 'Ac-') - K.limiting('Na+', 'Cl-') === K.limiting('H+', 'Ac-'));
  check('kohlrausch: stoichiometry from charges', JSON.stringify(K.stoich('Mg2+', 'Cl-')) === '{"nPlus":1,"nMinus":2}' && JSON.stringify(K.stoich('Na+', 'SO42-')) === '{"nPlus":2,"nMinus":1}' && JSON.stringify(K.stoich('Ba2+', 'SO42-')) === '{"nPlus":1,"nMinus":1}');
  const kcl = K.ELECTROLYTES[0], hac = K.ELECTROLYTES.find((e) => e.id === 'hac');
  check('kohlrausch: strong Λm = Λ° − A√c', rel(K.molarConductivity(kcl, 0.01), 150 - 9.5));
  check('kohlrausch: weak Λm = αΛ°', rel(K.molarConductivity(hac, 0.01), 0.04153595173906201 * 391, 1e-9));
  check('kohlrausch: kappa', rel(K.kappa(140.5, 0.01), 0.001405));
  const xs = [0.001, 0.005, 0.01, 0.02, 0.05, 0.1].map(Math.sqrt), noise = [0.3, -0.2, 0.1, -0.4, 0.2, 0.1], ys = xs.map((x, i) => 150 - 95 * x + noise[i]);
  const f = K.fitLine(xs, ys);
  check('kohlrausch: line fit equals numpy polyfit', rel(f.a, 149.9892742440609, 1e-12) && rel(f.b, -94.81399217743449, 1e-12) && rel(f.r2, 0.9993108870118621, 1e-12));
  let bad = 0; for (const fn of [() => K.stoich('Cl-', 'K+'), () => K.alphaOstwald(0, 1), () => K.molarConductivity(kcl, 0), () => K.fitLine([1], [1])]) { try { fn(); } catch { bad++; } }
  check('kohlrausch: bad input refused', bad === 4);
};
