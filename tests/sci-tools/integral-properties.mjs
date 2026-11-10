// #1470 definite integral properties. REF: sympy 1.14 integrate() of nine functions with a = −1/2, b = 2, c = 3/4,
// k = 3/2: [∫ₐᵇ, ∫ₐᶜ, ∫₋ₖᵏ, ∫₀ᵏ, ∫₀²ᵏ]; and ∫₀^(π/2) sin x/(sin x + cos x) dx = π/4.
import * as P from '../../src/lib/sci/integral-props.ts';
const REF = {"x2": [2.7083333333333335, 0.18229166666666666, 2.25, 1.125, 9.0], "x3x": [2.109375, -0.0927734375, 0.0, 0.140625, 15.75], "sin": [1.293729398437515, 0.14589369301655183, 0.0, 0.9292627983322971, 1.9899924966004454], "cos": [1.3887229654298847, 1.1610642986275372, 1.994989973208109, 0.9974949866040544, 0.1411200080598672], "abs": [2.125, 0.40625, 2.25, 1.125, 4.5], "exp": [6.782525439218017, 1.5104693569000411, 4.258558910189635, 3.481689070338065, 19.085536923187668], "xsin": [1.782225357578983, 0.17350636602698513, 1.7827783682050002, 0.8913891841025001, 3.111097497861204], "lin": [6.25, 1.5625, 3.0, 3.75, 12.0], "sinsq": [1.228832877625008, 0.16525850714701226, 1.4294399959700663, 0.7147199979850332, 1.5698538745497315]};
const near = (a, b, t = 1e-7) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const parities = { x2: 'even', x3x: 'odd', sin: 'odd', cos: 'even', abs: 'even', exp: 'neither', xsin: 'even', lin: 'neither', sinsq: 'even' };
  for (const p of P.PRESETS) {
    const r = P.properties(p.f, -0.5, 2, 0.75, 1.5), w = REF[p.id];
    check(`integral props: ${p.label} integrals match sympy`, near(r.swap.ab, w[0]) && near(r.split.ac, w[1]) && near(r.sym.whole, w[2]) && near(r.sym.right, w[3]) && near(r.double.whole, w[4]));
    check(`integral props: ${p.label} swap gives the negative`, near(r.swap.ba, -w[0]));
    check(`integral props: ${p.label} split adds up`, near(r.split.ac + r.split.cb, r.split.ab));
    check(`integral props: ${p.label} f(a + b − x) gives the same integral`, near(r.king.g, r.king.f));
    check(`integral props: ${p.label} ∫₀²ᵏ = ∫₀ᵏ f(x) + ∫₀ᵏ f(2k − x)`, near(r.double.first + r.double.second, r.double.whole));
    check(`integral props: ${p.label} is ${parities[p.id]}`, r.sym.parity === parities[p.id]);
    if (p.F) check(`integral props: ${p.label} antiderivative agrees`, near(p.F(2) - p.F(-0.5), w[0]));
  }
  check('integral props: ∫₀^(π/2) sin x/(sin x + cos x) dx = π/4 (sympy)', near(P.simpson((x) => Math.sin(x) / (Math.sin(x) + Math.cos(x)), 0, Math.PI / 2), 0.7853981633974483));
  check('integral props: area function slope equals f (x² at 1.3, cos at 0.4)', near(P.areaSlope((x) => x * x, 0, 1.3), 1.69, 1e-6) && near(P.areaSlope(Math.cos, -1, 0.4), Math.cos(0.4), 1e-6));
  check('integral props: area function of 2x + 1 from 1 to 3 = 10', near(P.areaFn((x) => 2 * x + 1, 1, 3), 10));
};
