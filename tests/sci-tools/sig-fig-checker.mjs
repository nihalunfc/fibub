// #975 Significant figures checker. Rounding compared with Python's decimal module (quantize with ROUND_HALF_UP and
// ROUND_HALF_EVEN) on 2,970 random numbers × 4 roundings with no mismatch; a sample is repeated here. Counting rules
// are the standard textbook ones.
import * as S from '../../src/lib/sci/phsigfig.ts';
export default async (check) => {
  const P = S.parse, cnt = (x) => { const p = P(x); return [p.min, p.max]; }, eq = (a, b) => a[0] === b[0] && a[1] === b[1];
  check('sigfig: counting rules', eq(cnt('0.00520'), [3, 3]) && eq(cnt('1200'), [2, 4]) && eq(cnt('1200.'), [4, 4]) && eq(cnt('1.200e3'), [4, 4]) && eq(cnt('100.0'), [4, 4]) && eq(cnt('40.07'), [4, 4]) && eq(cnt('7'), [1, 1]) && eq(cnt('−0.0300'), [3, 3]) && eq(cnt('6.02 × 10^23'), [3, 3]) && eq(cnt('1,234.50'), [6, 6]));
  check('sigfig: ambiguous flag and mask', P('1200').ambiguous && !P('1200.').ambiguous && P('0.0520').mask.map((m) => m.sig).join() === 'false,,false,true,true,true');
  check('sigfig: not numbers', P('abc') === null && P('') === null && P('1.2.3') === null && P('.') === null);
  const rs = (x, n, m) => S.toPlain(S.roundSig(P(x), n, m)), rp = (x, k, m) => S.toPlain(S.roundPlace(P(x), k, m));
  check('sigfig: 2.675 rounds to 2.68 exactly (no binary float error)', rs('2.675', 3, 'half-up') === '2.68' && rs('2.665', 3, 'half-even') === '2.66' && rs('2.675', 3, 'half-even') === '2.68' && rs('1.005', 3) === '1.01');
  check('sigfig: carrying into a new place', rs('9.96', 2) === '10' && S.toPlain(S.roundSig(P('9.96'), 3)) === '9.96' && rs('9.996', 3) === '10.0' && rs('0.09996', 2) === '0.10');
  const ref = [['-8193035', 1, '−8000000', '−8000000'], ['-0.6405', 3, '−0.641', '−0.640'], ['-145.421245', 4, '−145.4', '−145.4'], ['-32926.5', 4, '−32930', '−32930'], ['85545', 2, '86000', '86000'], ['32.021525', 3, '32.0', '32.0'], ['22003.325', 2, '22000', '22000']];
  check('sigfig: random cases match Python decimal', ref.every(([x, n, u, e]) => rs(x, n, 'half-up') === u && rs(x, n, 'half-even') === e));
  check('sigfig: decimal places', rp('3.14159', -2) === '3.14' && rp('-2.5', 0, 'half-even') === '−2' && rp('-2.5', 0, 'half-up') === '−3' && rp('1234', 2) === '1200');
  check('sigfig: scientific and nice forms', S.toSci(S.roundSig(P('1234'), 2)) === '1.2 × 10³' && S.nice(S.roundSig(P('1234'), 2)) === '1.2 × 10³' && S.nice(S.roundSig(P('0.0001234'), 2)) === '0.00012' && S.nice(S.roundSig(P('0.00001234'), 2)) === '1.2 × 10⁻⁵');
  const rpair = (v, u, rule, up) => { const r = S.reportPair(P(v), P(u), rule, 'half-up', up); return `${S.toPlain(r.v)} ± ${S.toPlain(r.u)}`; };
  check('sigfig: value ± uncertainty', rpair('9.81234', '0.0312', '1') === '9.81 ± 0.03' && rpair('9.81234', '0.0152', 'lead1') === '9.812 ± 0.015' && rpair('9.81234', '0.0252', 'lead12') === '9.812 ± 0.025' && rpair('9.81234', '0.0252', 'lead1') === '9.81 ± 0.03' && rpair('1234.5', '23', '1') === '1230 ± 20' && rpair('9.81234', '0.0312', '1', true) === '9.81 ± 0.04' && rpair('9.81234', '0.0300', '1', true) === '9.81 ± 0.03');
  const cb = (xs, op) => S.toPlain(S.combine(xs.map(P), op).rounded);
  check('sigfig: sum rule (decimal places)', cb(['12.11', '18.0', '1.013'], 'add') === '31.1' && cb(['1200', '34.5'], 'add') === '1200' && cb(['5.67', '1.2'], 'sub') === '4.5');
  check('sigfig: product rule (significant figures)', cb(['4.56', '1.4'], 'mul') === '6.4' && cb(['1200', '3.0'], 'div') === '400' && S.combine(['1200', '3.0'].map(P), 'div').figures === 2 && cb(['2.000', '3.00'], 'div') === '0.667');
};
