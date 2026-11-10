// #1471 integration technique coach. REF: sympy 1.14 integrate() of 27 school integrands from x = 1.2 to 1.9
// (x positive). Each coached antiderivative must give the same definite integral, differentiate back to the
// integrand, and be sorted into the expected method.
import * as C from '../../src/lib/sci/integration-coach.ts';
import { parse } from '../../src/lib/sci/cas.ts';
import { Q } from '../../src/lib/sci/matrix.ts';
const REF = {"2x cos(x^2)": -1.4429241003531097, "x/(x^2 + 1)": 0.31811490885172333, "sin(x)^2 cos(x)": 0.01257900870527915, "ln(x)/x": 0.18936763056141714, "e^(sin(x)) cos(x)": 0.0364779044662387, "x e^x": 5.353281613504033, "x sin(x)": 1.0633404841328529, "x^2 e^x": 8.648547340879468, "x ln(x)": 0.4847747436495252, "ln(x)": 0.3007365155748045, "atan(x)": 0.6946203861704041, "e^x sin(x)": 3.2984668930441834, "1/(x^2 - 1)": 0.6139120100740579, "(3x + 5)/(x^2 + 3x + 2)": 0.7503324965862362, "x/(x - 1)^2": 5.392966285665163, "(x^2 + 1)/(x^2 - 1)": 1.9278240201481158, "1/(x^3 + x)": 0.14141742052671682, "sin(3x + 1)": -0.3421785583901247, "1/(x^2 + 4)": 0.10967162730259333, "3x^2 - 4x + 1/x": 1.25053232937844, "x^2 ln(x)": 0.7923636072610563, "x atan(x)": 1.0851730851021022, "1/(x^2 + 2x + 5)": 0.06703286336151427, "sin(x)^2": 0.6718302678734676, "1/(2x + 3)": 0.11526182930591616, "(x^3 + 1)/(x^2 - 4)": -3.247548417952271, "1/((x - 1)(x + 2)(x + 3))": 0.09793553857819745};
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
const METHOD = { '2x cos(x^2)': 'substitution', 'x/(x^2 + 1)': 'substitution', 'sin(x)^2 cos(x)': 'substitution', 'ln(x)/x': 'substitution', 'e^(sin(x)) cos(x)': 'substitution', 'x e^x': 'parts', 'x sin(x)': 'parts', 'x^2 e^x': 'parts', 'x ln(x)': 'parts', 'ln(x)': 'parts', 'atan(x)': 'parts', 'e^x sin(x)': 'loop', '1/(x^2 - 1)': 'partial', '(3x + 5)/(x^2 + 3x + 2)': 'partial', 'x/(x - 1)^2': 'partial', '(x^2 + 1)/(x^2 - 1)': 'partial', '1/(x^3 + x)': 'partial', 'sin(3x + 1)': 'standard', '1/(x^2 + 4)': 'standard', '3x^2 - 4x + 1/x': 'sum', 'x^2 ln(x)': 'parts', 'x atan(x)': 'parts', '1/(x^2 + 2x + 5)': 'standard', 'sin(x)^2': 'standard', '1/(2x + 3)': 'standard', '(x^3 + 1)/(x^2 - 4)': 'partial', '1/((x - 1)(x + 2)(x + 3))': 'partial' };
export default async (check) => {
  for (const [src, want] of Object.entries(REF)) {
    const r = C.coach(src);
    check(`integration coach: ∫ ${src} from 1.2 to 1.9 matches sympy`, !!r.F && near(C.value(r.F, 1.9) - C.value(r.F, 1.2), want));
    check(`integration coach: ${src} differentiates back`, r.checked);
    check(`integration coach: ${src} is coached as ${METHOD[src]} (${r.method})`, r.method === METHOD[src]);
  }
  const pf = C.partialFractions([Q.of(5), Q.of(3)], [Q.of(2), Q.of(3), Q.of(1)]);
  check('integration coach: (3x + 5)/(x² + 3x + 2) = 2/(x + 1) + 1/(x + 2)', pf && pf.terms.length === 2 && pf.terms.map((t) => t.num[0].toString() + '/' + t.den.map((q) => q.toString()).join(',')).sort().join(';') === '1/2,1;2/1,1');
  const pf2 = C.partialFractions([Q.of(1)], [Q.of(0), Q.of(1), Q.of(0), Q.of(1)]);
  check('integration coach: 1/(x³ + x) = 1/x − x/(x² + 1)', pf2 && pf2.terms.length === 2 && pf2.terms.some((t) => t.den.length === 3 && t.num.length === 2 && t.num[1].eq(Q.of(-1))));
  check('integration coach: e^(x²) has no school method', C.coach('e^(x^2)').method === 'none' && C.coach('e^(x^2)').F === null);
  check('integration coach: tan x is a standard form, −ln|cos x|', C.coach('tan(x)').method === 'standard' && near(C.value(C.coach('tan(x)').F, 1) - C.value(C.coach('tan(x)').F, 0.5), Math.log(Math.cos(0.5) / Math.cos(1))));
  check('integration coach: constants', C.coach('5').method === 'constant' && near(C.value(C.coach('5').F, 2), 10));
  check('integration coach: ILATE picks ln as u in x² ln x', C.coach('x^2 ln(x)').steps.some((s) => s.startsWith('u = ln(x)')));
  check('integration coach: ILATE picks x as u in x eˣ', C.coach('x e^x').steps.some((s) => s.startsWith('u = x,')));
  let m = ''; try { C.coach('x + y'); } catch (e) { m = e.message; }
  check('integration coach: stray letter message', m.includes('Use only x'));
  check('integration coach: ∫ and dx are ignored', C.coach('∫ x e^x dx').method === 'parts');
  check('integration coach: every example coaches and checks', C.EXAMPLES.every((e) => C.coach(e.src).checked));
};
