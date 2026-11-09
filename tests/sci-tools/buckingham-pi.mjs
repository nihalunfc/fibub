// #551 Dimensional analysis (Buckingham Pi) helper. References: sympy Matrix.rank() and Matrix.nullspace() (SymPy, run on
// 2026-11-09) for every preset, scaled to whole numbers; the classic groups (Reynolds, Euler, Froude, Nusselt, Prandtl,
// Taylor's blast-wave group R⁵ρ/(Et²), pump power and flow coefficients) from any fluid mechanics text.
import { parseDim, dimString, parseVariables, dimMatrix, rref, nullSpace, piGroups, productDim, autoRepeating, toIntegers, qq, PRESETS, QUANTITIES } from '../../src/lib/sci/dimensional.ts';

export default async (check) => {
  const s = (t) => dimString(parseDim(t));
  check('pi: reads dimensions in several spellings', s('M L^-1 T^-2') === 'M L^−1 T^−2' && s('L/T^2') === 'L T^−2' && s('M·L²·T⁻²') === 'M L^2 T^−2' && s('K') === 'Θ' && s('L T-1') === 'L T^−1' && s('1') === '1 (dimensionless)' && s('M L / T^2 / M') === 'L T^−2' && s('L/T^2/M') === 'M^−1 L T^−2');
  check('pi: fractional exponents', s('L^1/2') === 'L^(1/2)' && s('M^(1/2) L') === 'M^(1/2) L' && dimString(parseDim('L^1/2'), true) === 'm^(1/2)');
  const err = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  check('pi: bad dimension and bad lines are explained', err(() => parseDim('kg')).includes('not a base dimension') && err(() => parseVariables('V')).includes('Line 1') && err(() => parseVariables('V, L\nV, L')).includes('twice') && err(() => parseVariables('V, L')).includes('at least two'));
  check('pi: quantity list has valid dimensions', QUANTITIES.every(([, d]) => { try { parseDim(d); return true; } catch { return false; } }));
  // SymPy null spaces (integer-scaled), per preset, and the groups made with the default repeating variables.
  const ref = {
    'Pressure drop in a pipe': { rank: 3, ns: [[0, 1, -1, 0, 0, 0, 0], [1, 0, 0, -2, -1, 0, 0], [1, 1, 0, -1, 0, -1, 0], [0, 1, 0, 0, 0, 0, -1]], g: ['ΔP / (V^2 ρ)', 'l / D', 'μ / (D V ρ)', 'ε / D'] },
    'Drag on a sphere': { rank: 3, ns: [[1, -1, -2, -2, 0], [1, 1, 0, 0, -2]], g: ['F / (ρ V^2 D^2)', 'μ / (ρ V D)'] },
    'Simple pendulum': { rank: 3, ns: [[2, -1, 0, 1, 0], [0, 0, 0, 0, 1]], g: ['P^2 g / l', 'θ0'] },
    'Heat transfer from a pipe (convection)': { rank: 4, ns: [[1, -1, 1, 0, 0, 0, 0], [1, -1, 0, -1, -1, 1, 0], [1, 0, 0, -1, -1, 0, -1]], g: ['h D / k', 'μ / (D V ρ)', 'D V ρ cp / k'] },
    'Ship or open-channel wave drag': { rank: 3, ns: [[1, -1, -2, -2, 0, 0], [1, -1, -6, 0, 2, 0], [1, 1, 0, 0, 0, -2]], g: ['F / (ρ V^2 L^2)', 'L g / V^2', 'μ / (ρ V L)'] },
    'Blast wave radius (Taylor)': { rank: 3, ns: [[5, -2, -1, 1]], g: ['R^5 ρ / (t^2 E)'] },
    'Pump power': { rank: 3, ns: [[1, -1, -3, -5, 0], [3, -3, -4, 0, -5]], g: ['P / (ρ n^3 D^5)', 'Q / (n D^3)'] },
  };
  for (const p of PRESETS) {
    const vars = parseVariables(p.vars), m = dimMatrix(vars), ns = nullSpace(m.D, vars.length), r = ref[p.name];
    const res = piGroups(vars, autoRepeating(vars));
    check(`pi: ${p.name}: rank ${r.rank} and null space as SymPy`, res.rank === r.rank && JSON.stringify(ns) === JSON.stringify(r.ns) && ns.length === vars.length - r.rank);
    check(`pi: ${p.name}: groups ${res.groups.map((x) => x.text).join(', ')}`, JSON.stringify(res.groups.map((x) => x.text)) === JSON.stringify(r.g) && res.groups.every((x) => productDim(vars, x.exps).every((q) => q[0] === 0)));
  }
  // Other repeating variables give other, equivalent groups (pipe: with μ repeating instead of ρ, Re appears inverted).
  const pipe = parseVariables(PRESETS[0].vars);
  const alt = piGroups(pipe, [1, 3, 5]);
  check('pi: other repeating variables (D, V, μ)', alt.groups.map((x) => x.text).join(' | ') === 'ΔP D / (V μ) | l / D | D V ρ / μ | ε / D');
  check('pi: wrong number of repeating variables', err(() => piGroups(pipe, [1, 3])).includes('Choose 3 repeating variables'));
  check('pi: dependent repeating variables', err(() => piGroups(pipe, [1, 2, 6])).includes('not independent'));
  // rref and integer scaling.
  const R = rref([[qq(1), qq(2), qq(3)], [qq(2), qq(4), qq(7)]]);
  check('pi: exact row reduction', JSON.stringify(R.pivots) === '[0,2]' && R.R[0][1][0] === 2 && R.R[1][2][0] === 1);
  check('pi: whole-number exponents', JSON.stringify(toIntegers([qq(1, 2), qq(-1, 3), qq(0)])) === '[3,-2,0]' && JSON.stringify(toIntegers([qq(-2), qq(4)])) === '[1,-2]');
  check('pi: all dimensionless: every variable is its own group', nullSpace([], 2).length === 2 && piGroups(parseVariables('a, 1\nb, 1'), []).groups.length === 2);
};
