// Extra question shapes for phase-transitions (templates phtr-m31..m35). Imported by phase-transitions.js.
import { choose } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

export default [
  { id: 'phtr-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'order of transitions',
    make(r) {
      const first = [['boiling of water at 1 atm', 'latent heat and a jump in density'], ['melting of ice at 1 atm', 'latent heat'], ['a type-I superconductor driven normal by a field below $T_c$', 'latent heat in a field; the magnetisation jumps'], ['reversal of the magnetisation of a ferromagnet below $T_C$ as the field passes through zero', 'the magnetisation jumps from $+M_0$ to $-M_0$'], ['the liquid-gas transition of CO$_2$ well below its critical point', 'latent heat']];
      const cont = [['the liquid-gas transition exactly at the critical point', 'the density difference vanishes continuously'], ['a ferromagnet at its Curie point in zero field', 'the magnetisation grows continuously from zero'], ['the superconducting transition of tin in zero field', 'no latent heat, only a jump in heat capacity'], ['the lambda transition of liquid helium-4', 'no latent heat; the heat capacity has a lambda-shaped peak'], ['order-disorder ordering in beta-brass (CuZn)', 'the order parameter rises continuously']];
      const askFirst = r() < 0.5;
      const c = choose(r, askFirst ? first : cont);
      const o = pickMcq(r, c[0], (askFirst ? cont : first).map((x) => x[0]));
      return { q: `Which ONE of these is a ${askFirst ? '<b>first-order</b> (discontinuous)' : '<b>continuous</b> (second-order)'} phase transition?`, ...o,
        sol: `${c[0]}: ${c[1]}. First-order transitions have a jump in the order parameter (and usually latent heat); continuous ones have the order parameter going smoothly to zero, with no latent heat. The other options are ${askFirst ? 'continuous' : 'first-order'}.`,
        trap: 'The same system can show both: liquid-gas is first order below the critical point and continuous exactly at it.' };
    } },
  { id: 'phtr-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'critical exponents', format: 'statements',
    make(r) {
      const S = choose(r, [
        { name: 'mean-field theory', d: 3, a: '0', b: '\\tfrac12', g: '1', de: '3', nu: '\\tfrac12', eta: '0', A: 0, B: 0.5, G: 1, D: 3, N: 0.5, E: 0 },
        { name: 'the exact 2D Ising model', d: 2, a: '0\\ (\\text{log})', b: '\\tfrac18', g: '\\tfrac74', de: '15', nu: '1', eta: '\\tfrac14', A: 0, B: 0.125, G: 1.75, D: 15, N: 1, E: 0.25 },
      ]);
      const eq = (x, y) => Math.abs(x - y) < 1e-9;
      const hyp = eq(S.d * S.N, 2 - S.A);
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['Rushbrooke: $\\alpha + 2\\beta + \\gamma = 2$', eq(S.A + 2 * S.B + S.G, 2), `$${S.A} + ${2 * S.B} + ${S.G} = ${S.A + 2 * S.B + S.G}$.`],
        ['Widom: $\\gamma = \\beta(\\delta - 1)$', eq(S.G, S.B * (S.D - 1)), `$${S.B}\\times${S.D - 1} = ${S.B * (S.D - 1)}$.`],
        ['Fisher: $\\gamma = \\nu(2 - \\eta)$', eq(S.G, S.N * (2 - S.E)), `$${S.N}\\times${2 - S.E} = ${S.N * (2 - S.E)}$.`],
        [`Hyperscaling with $d = ${S.d}$: $d\\nu = 2 - \\alpha$`, hyp, `$${S.d}\\times${S.N} = ${S.d * S.N}$ versus $2 - ${S.A} = ${2 - S.A}$.${hyp ? '' : ' Mean-field exponents satisfy hyperscaling only at $d = 4$.'}`],
        ['$\\beta = \\tfrac12$', eq(S.B, 0.5), `Here $\\beta = ${S.b}$.`],
        ['$\\delta = 3$', eq(S.D, 3), `Here $\\delta = ${S.de}$.`],
      ], { not });
      return { q: `The critical exponents of ${S.name} are $\\alpha = ${S.a}$, $\\beta = ${S.b}$, $\\gamma = ${S.g}$, $\\delta = ${S.de}$, $\\nu = ${S.nu}$, $\\eta = ${S.eta}$. Which statements hold for these values? Mark those that are ${not ? '<b>NOT</b> satisfied' : 'satisfied'}.`, ...m,
        trap: 'Scaling laws not involving $d$ hold for mean-field exponents too; hyperscaling fails for them below four dimensions.' };
    } },
  { id: 'phtr-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Landau theory', format: 'graph in words',
    make(r) {
      const O = {
        sqrt: 'zero above $T_c$, and growing as $(T_c - T)^{1/2}$ below',
        jump: 'zero above $T_1$, then jumping discontinuously to a finite value at $T_1$',
        div: 'diverging as $|T - T_c|^{-1}$ on both sides of $T_c$',
        cjump: 'finite on both sides, with a step (jump) at $T_c$',
        log: 'diverging logarithmically at $T_c$',
        lin: 'zero above $T_c$, and growing linearly in $(T_c - T)$ below',
      };
      const C = choose(r, [
        ['the order parameter $m$ in Landau theory of a continuous transition', 'sqrt', 'Minimising $a(T - T_c)m^2 + bm^4$ gives $m^2 = a(T_c - T)/2b$.'],
        ['the susceptibility $\\chi$ in Landau theory of a continuous transition', 'div', '$\\chi^{-1} = 2a(T - T_c)$ above and $4a(T_c - T)$ below: $\\gamma = 1$.'],
        ['the heat capacity in Landau theory of a continuous transition', 'cjump', 'Below $T_c$ the free energy gains $-a^2(T_c - T)^2/4b$, giving a jump $\\Delta C = a^2T_c/2b$ but no divergence ($\\alpha = 0$).'],
        ['the order parameter in Landau theory with a negative quartic term and a positive $m^6$ term', 'jump', 'With $b < 0$ the transition becomes first order: $m$ jumps at $T_1 > T_c$.'],
        ['the specific heat of the 2D Ising model', 'log', "Onsager's solution: $C \\sim -\\ln|T - T_c|$."],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `As a function of temperature near the transition, how does ${C[0]} behave?`, ...o, sol: C[2],
        trap: 'Mean-field theory gives a jump, not a divergence, in the heat capacity.' };
    } },
  { id: 'phtr-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Landau theory', format: 'which is NOT',
    make(r) {
      const T = [
        ['Below $T_c$ the equilibrium order parameter satisfies $m_0^2 = a(T_c - T)/2b$', 'From $\\partial f/\\partial m = 0$.'],
        ['The free energy below $T_c$ is lowered by $a^2(T_c - T)^2/4b$', 'Substituting $m_0^2$ back.'],
        ['The heat capacity jumps by $a^2T_c/2b$ at $T_c$', '$\\Delta C = -T\\,\\partial^2\\Delta f/\\partial T^2$ at $T_c$.'],
        ['There is no latent heat', 'The entropy is continuous because $m_0 \\to 0$ continuously.'],
        ['At equal $|T - T_c|$, the susceptibility below $T_c$ is half that above', '$\\chi = 1/[2a(T - T_c)]$ above, $1/[4a(T_c - T)]$ below.'],
      ];
      const F = [
        ['Below $T_c$, $m_0$ grows linearly in $(T_c - T)$', 'It grows as $(T_c - T)^{1/2}$.'],
        ['The heat capacity is continuous at $T_c$', 'It jumps by $a^2T_c/2b$.'],
        ['There is a latent heat $T_c\\Delta S$ with $\\Delta S > 0$', 'The transition is continuous: no latent heat.'],
        ['If $b$ were negative (with a stabilising $m^6$ term), the transition would still be continuous', 'It becomes first order.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `A Landau free energy density is $f = f_0 + a(T - T_c)m^2 + bm^4$ with $a, b > 0$. Which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Landau theory is mean-field: square-root order parameter, jump in $C$, Curie-Weiss $\\chi$ with a factor 2 between the sides.' };
    } },
  { id: 'phtr-m35', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Clausius-Clapeyron', format: 'sign reasoning',
    make(r) {
      const C = choose(r, [
        ['ice-water coexistence', 'melting raises the entropy and lowers the volume', 'neg'],
        ['the melting curve of a typical substance such as lead', 'melting raises both the entropy and the volume', 'pos'],
        ['liquid-vapour coexistence', 'boiling raises both the entropy and the volume', 'pos'],
        ['the melting curve of helium-3 below about 0.3 K', 'the solid has the higher entropy (disordered nuclear spins) and the liquid the larger volume', 'neg'],
        ['the minimum of the helium-3 melting curve (near 0.32 K)', 'solid and liquid have equal entropy there, while the volumes differ', 'zero'],
        ['a hypothetical transition in which the two phases have equal molar volume but different entropy', 'the volume does not change but the entropy does', 'inf'],
      ]);
      const O = { pos: 'positive', neg: 'negative', zero: 'zero (the curve is horizontal)', inf: 'infinite (the curve is vertical in the $P$-$T$ plane)' };
      const o = pickMcq(r, O[C[2]], Object.keys(O).filter((k) => k !== C[2]).map((k) => O[k]));
      return { q: `For ${C[0]}, ${C[1]}. The slope $dP/dT$ of the coexistence curve is`, ...o,
        sol: `Clausius-Clapeyron: $\\dfrac{dP}{dT} = \\dfrac{\\Delta S}{\\Delta V} = \\dfrac{L}{T\\Delta V}$, with both changes taken in the same direction. ${{ pos: 'Both positive: positive slope.', neg: 'Opposite signs: negative slope.', zero: '$\\Delta S = 0$ makes the slope zero.', inf: '$\\Delta V = 0$ makes the slope infinite.' }[C[2]]}`,
        trap: 'Keep the signs of $\\Delta S$ and $\\Delta V$ for the same direction of the transition.' };
    } },
];
