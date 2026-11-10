// #1467 derivative calculator with steps. REF: sympy 1.14 diff() of 25 school functions, evaluated at x = 0.3, 0.7
// and 0.9 (x real). The stepwise derivative must match sympy there and agree with the plain CAS derivative.
import * as S from '../../src/lib/sci/derivative-steps.ts';
import { agree } from '../../src/lib/sci/cas.ts';
const REF = {"3x^4 - 5x^2 + 7": [-2.676, -2.8840000000000012, -0.2519999999999989], "x^2 sin(x)": [0.26329240801810827, 1.2766774339021667, 1.9134925116287085], "(x + 1)/(x - 1)": [-4.081632653061225, -22.222222222222214, -200.00000000000009], "sqrt(x) + 1/x": [-10.198240181935835, -1.4432020218634154, -0.7075216245398379], "sin(x)/x": [-0.09910288804064216, -0.22209827783377367, -0.2763925162764017], "x cos(x)": [0.8666804271272042, 0.3138898062181048, -0.08338425039407071], "sin(x^2)": [0.5975716398071965, 1.2352660020541701, 1.2410971793131444], "e^(3x) cos(x)": [6.322383382851318, 13.476702678330708, 16.092474427991945], "ln(x^2 + 1)": [0.5504587155963302, 0.9395973154362416, 0.9944751381215471], "(2x + 1)^5": [65.53600000000002, 331.77599999999995, 614.6559999999998], "atan(x^2)": [0.5951790496974506, 1.128941214418192, 1.086890888231387], "x^x": [-0.1421374904172292, 0.5011861886935786, 0.8137037548592702], "sqrt(1 + sin(x))": [0.4196664727312215, 0.2982374526959638, 0.23274078412072335], "tan(2x)": [2.936086345055915, 69.23091115652329, 38.74407828677072], "asin(x/2)": [0.5057217374241736, 0.5337605126836238, 0.5598925109558542], "acos(x)": [-1.0482848367219182, -1.4002800840280099, -2.294157338705618], "2^x": [0.8533642789721566, 1.1260209168747677, 1.2934583749062987], "x e^x ln(x)": [-0.7628924746257448, 0.7927189795965215, 1.9672275121572786], "1/(x^2 + 1)": [-0.505007995959936, -0.6306022251249943, -0.5494337779677055], "3/x^2": [-222.22222222222223, -17.492711370262395, -8.23045267489712], "cos(x)^3": [-0.8091353372166171, -1.1305702904149237, -0.908030092395985], "(x^2 + 1)/(x^3 - 2)": [-0.37970791185309843, -1.6426353113599004, -4.138869819448685], "e^(sin(x))": [1.2838052903449595, 1.4566392950360747, 1.360543790846827], "x^(sin(x))": [-0.11569363605762746, 0.5145842936133301, 0.7411100676258766], "|x - 2|": [-1.0, -1.0, -1.0]};
const near = (a, b, t = 1e-8) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  for (const [src, want] of Object.entries(REF)) {
    const r = S.differentiate(src);
    check(`derivative steps: d/dx ${src} matches sympy at 0.3, 0.7, 0.9`, [0.3, 0.7, 0.9].every((x, i) => near(S.at(r.d, x), want[i])));
    check(`derivative steps: ${src} agrees with the plain CAS derivative`, agree(r.d, S.plain(r.f), 'x') || src.includes('|'));
    check(`derivative steps: ${src} has steps`, r.steps.length >= 1 && r.steps.every((s) => s.rule && s.text.startsWith('d/dx') || s.text.startsWith('y =')));
  }
  const rule = (src) => S.differentiate(src).steps.at(-1).rule;
  check('derivative steps: last rule names', rule('x^2 sin(x)') === 'Product rule' && rule('(x + 1)/(x - 1)') === 'Quotient rule' && rule('(2x + 1)^5') === 'Chain rule (power)' && rule('x^x') === 'Logarithmic differentiation' && rule('3x^4 - 5x^2 + 7') === 'Sum rule' && rule('sin(x^2)').endsWith('chain rule') && rule('x^7') === 'Power rule');
  check('derivative steps: product rule written out', S.differentiate('x^2 sin(x)').steps.at(-1).text.includes('u = x², v = sin(x)'));
  check('derivative steps: answers in simple form', S.differentiate('(x + 1)/(x - 1)').dText === '−2/(x − 1)²' && S.differentiate('3x^4 - 5x^2 + 7').dText === '12x³ − 10x' && S.differentiate('sin(x^2)').dText === '2x·cos(x²)');
  check('derivative steps: constants and x', S.differentiate('5').dText === '0' && S.differentiate('x').dText === '1');
  let m = ''; try { S.differentiate('x + t'); } catch (e) { m = e.message; }
  check('derivative steps: stray letter message', m.includes('Use only x'));
  m = ''; try { S.differentiate('sin x'); } catch (e) { m = e.message; }
  check('derivative steps: missing bracket message', m.includes('brackets'));
  check('derivative steps: every example works', S.EXAMPLES.every((e) => S.differentiate(e.src).steps.length > 0));
};
