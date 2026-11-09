// #978 Dimensional analysis. The dimensions of 46 units (SI base and derived, prefixed and compound) were compared
// with sympy.physics.units (no differences); textbook equations are checked here.
import * as D from '../../src/lib/sci/phdim.ts';
export default async (check) => {
  const eq = (a, b) => D.same(a, b), P = D.parseUnit;
  check('dim: derived units', eq(P('N'), [1, 1, -2, 0, 0, 0, 0]) && eq(P('Ω'), [1, 2, -3, -2, 0, 0, 0]) && eq(P('F'), [-1, -2, 4, 2, 0, 0, 0]) && eq(P('T'), [1, 0, -2, -1, 0, 0, 0]) && eq(P('kat'), [0, 0, -1, 0, 0, 1, 0]));
  check('dim: compound units and prefixes', eq(P('J/(mol K)'), P('J mol^-1 K^-1')) && eq(P('kg m/s²'), P('N')) && eq(P('N·m'), P('J')) && eq(P('kWh'), P('J')) && eq(P('MPa'), P('Pa')) && eq(P('µF'), P('F')) && eq(P('km/h'), P('m s^-1')) && eq(P('m^(1/2)'), [0, 0.5, 0, 0, 0, 0, 0]));
  check('dim: whole symbols before prefixes', eq(P('min'), P('s')) && eq(P('mmHg'), P('Pa')) && eq(P('cd'), [0, 0, 0, 0, 0, 0, 1]) && eq(P('ms'), P('s')) && eq(P('mm'), P('m')) && eq(P('Pa'), [1, -1, -2, 0, 0, 0, 0]));
  check('dim: dimensionless and bad units', D.isNone(P('1')) && D.isNone(P('rad')) && D.isNone(P('dimensionless')) && (() => { try { P('furlong'); return false; } catch (e) { return /not a unit/.test(e.message); } })());
  check('dim: formatting and names', D.format(P('N')) === 'kg m s⁻²' && D.format(P('m^(1/2)')) === 'm¹ᐟ²' && D.format(D.NONE) === 'dimensionless' && D.named(P('kg m^2 s^-3 A^-1')) === 'V' && D.named(P('kg m s^-2')) === 'N');
  const { dims } = D.declarations('m = kg\nv: m/s\nx = m\nt = s\nF = N\na = m s^-2\nE = J\nk = N/m\nT = K\np = Pa\nV = m^3\nn = mol');
  const ok = (e) => D.check(e, dims).balanced;
  check('dim: textbook equations balance', ok('E = 1/2*m*v^2') && ok('F = m*a') && ok('x = v*t + a*t^2/2') && ok('E = m*c^2') && ok('F = G*m*m/x^2') && ok('p*V = n*R*T') && ok('E = k_B*T') && ok('E = h*c/x') && ok('sqrt(k/m)*t = 2*pi'));
  check('dim: wrong equations caught', ok('E = m*v') === false && ok('x = v + t') === false && ok('F = m*a + v') === false && ok('E = 1/2*k*x^2 + exp(t)') === false);
  { const r = D.check('x = v + t', dims); check('dim: the bad sum is named', r.problems.length === 1 && r.problems[0].where === 'v + t' && /cannot add s to m s⁻¹/.test(r.problems[0].msg)); }
  { const r = D.check('x = A*sin(t)', dims); check('dim: undeclared names and function arguments', r.undeclared.join() === 'A' && r.balanced === null && r.problems.some((p) => /argument of sin/.test(p.msg))); }
  { const r = D.check('x = v*t^q', { ...dims, q: D.NONE }); check('dim: variable powers of dimensioned quantities flagged', r.problems.some((p) => /not a fixed number/.test(p.msg))); }
  { const r = D.check('E = m*c^2', { ...dims, c: P('m') }); check('dim: a declared name wins over a built-in constant', r.balanced === false && r.usedConstants.length === 0); }
  check('dim: single expression and chains', D.check('m*a', dims).balanced === null && D.format(D.check('m*a', dims).sides[0].dim) === 'kg m s⁻²' && D.check('E = F*x = m*v^2', dims).balanced === true);
};
