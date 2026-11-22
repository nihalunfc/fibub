// Extra question shapes for heat-capacity (templates hc-m31..m35). Imported by heat-capacity.js.
import { choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

const einstein = (x) => (x * x * Math.exp(x)) / (Math.exp(x) - 1) ** 2; // C/3R at x = theta_E/T

export default [
  { id: 'hc-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'low-temperature laws', format: 'match the system',
    make(r) {
      const O = { t1: 'linear in $T$', t32: 'proportional to $T^{3/2}$', t2: 'proportional to $T^2$', t3: 'proportional to $T^3$', exp: 'exponentially small, like $e^{-\\Delta/k_BT}$' };
      const C = choose(r, [
        ['an insulating crystal (phonons only, $T \\ll \\theta_D$)', 't3', 'Debye: acoustic phonons with $\\omega = vk$ in 3D give $C \\propto T^3$.'],
        ['the conduction electrons of a metal', 't1', 'Only electrons within $k_BT$ of the Fermi level are excited: $C = \\gamma T$.'],
        ['the spin waves (magnons) of a ferromagnet', 't32', 'Magnons have $\\omega \\propto k^2$ in 3D, giving $C \\propto T^{3/2}$ (Bloch).'],
        ['the spin waves of an antiferromagnet', 't3', 'Antiferromagnetic magnons have $\\omega \\propto k$, like phonons: $C \\propto T^3$.'],
        ['the in-plane acoustic phonons of a single 2D sheet (linear dispersion)', 't2', 'Linear dispersion in $d$ dimensions gives $C \\propto T^d$.'],
        ['the electrons of a conventional (fully gapped) superconductor far below $T_c$', 'exp', 'The energy gap $\\Delta$ suppresses excitations.'],
        ['an Einstein solid (all atoms at one frequency) far below $\\theta_E$', 'exp', '$C \\propto (\\theta_E/T)^2e^{-\\theta_E/T}$.'],
        ['an ideal Bose gas below its condensation temperature', 't32', 'With $\\varepsilon \\propto k^2$ and $\\mu = 0$, $C \\propto T^{3/2}$.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `At low temperature, the heat capacity of ${C[0]} is`, ...o, sol: `${C[2]} In general, excitations with $\\omega \\propto k^s$ in $d$ dimensions give $C \\propto T^{d/s}$; a gap gives an exponential.`,
        trap: 'Ferromagnetic magnons ($\\omega \\propto k^2$) and antiferromagnetic ones ($\\omega \\propto k$) give different powers.' };
    } },
  { id: 'hc-m32', type: 'msq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'Einstein and Debye models', format: 'statements',
    make(r) {
      const t = choose(r, [0.5, 1, 2]), c = einstein(1 / t);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`In the Einstein model, at $T = ${t}\\,\\theta_E$ the heat capacity is $${round(c, 3)}\\times3R$`, true, `$C/3R = x^2e^x/(e^x - 1)^2$ with $x = \\theta_E/T = ${round(1 / t, 2)}$.`],
        [`In the Einstein model, at $T = ${t}\\,\\theta_E$ the heat capacity is $${round(c / 2, 3)}\\times3R$`, false, `It is $${round(c, 3)}\\times3R$.`],
        ['Both models tend to the Dulong-Petit value $3R$ per mole at high $T$', true, 'Every mode then holds $k_BT$.'],
        ['The Einstein model falls off too fast at low $T$ compared with experiment', true, 'It is exponential; real insulators show $T^3$.'],
        ['The Einstein model predicts $C \\propto T^3$ at low $T$', false, 'That is the Debye result; Einstein gives an exponential.'],
        ['The Debye cutoff frequency is chosen so that there are exactly $3N$ modes', true, '$\\int_0^{\\omega_D}g(\\omega)\\,d\\omega = 3N$.'],
        ['The Debye model treats all phonon branches as dispersionless', false, 'It takes $\\omega = vk$ up to $\\omega_D$; the Einstein model is the dispersionless one.'],
        ['Optical phonons are often described well by an Einstein term', true, 'Optical branches are nearly flat.'],
      ], { not });
      return { q: 'Which statements about the Einstein and Debye models of lattice heat capacity are ' + (not ? '<b>NOT</b> correct' : 'correct') + '?', ...m,
        trap: 'Einstein: one frequency, exponential at low $T$. Debye: sound-like modes up to a cutoff, $T^3$ at low $T$.' };
    } },
  { id: 'hc-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'C/T against T²', format: 'graph in words',
    make(r) {
      const C = choose(r, [
        ['for a normal metal at a few kelvin, the plotted points', 'lie on a straight line whose intercept is $\\gamma$ and whose slope is $\\beta$', ['lie on a straight line through the origin with slope $\\gamma$', 'lie on a horizontal line at height $\\beta$', 'lie on a parabola whose vertex gives $\\theta_D$'], 'With $C = \\gamma T + \\beta T^3$, $C/T = \\gamma + \\beta T^2$: a straight line in $T^2$.'],
        ['for an insulator at a few kelvin, the plotted points', 'lie on a straight line through the origin', ['lie on a straight line with a large positive intercept', 'lie on a horizontal line', 'fall exponentially to zero'], 'There is no electronic term, so $C/T = \\beta T^2$.'],
        ['for a metal, the slope of the straight line gives', '$\\beta$, and hence the Debye temperature through $\\beta = 12\\pi^4Nk_B/5\\theta_D^3$', ['$\\gamma$, and hence the density of states at the Fermi level', 'the Fermi temperature directly', 'the superconducting gap'], 'The $T^3$ term is the phonon (Debye) contribution.'],
        ['for a metal, the intercept at $T^2 = 0$ gives', '$\\gamma$, which measures the density of states at the Fermi level', ['$\\beta$, the Debye coefficient', 'the residual resistivity', 'the Debye temperature directly'], '$\\gamma = \\tfrac{\\pi^2}{3}k_B^2g(E_F)$.'],
        ['for a metal that becomes superconducting at $T_c$, below $T_c$ the points', 'drop below the normal-state line and head towards zero', ['continue along the same straight line', 'rise far above the normal-state line all the way to $T = 0$', 'stay at a constant height $\\gamma$'], 'After a jump at $T_c$ the electronic part falls exponentially, so $C/T$ goes towards the small phonon part.'],
      ]);
      const o = pickMcq(r, C[1], C[2]);
      return { q: `Low-temperature heat-capacity data are plotted as $C/T$ against $T^2$. ${C[0][0].toUpperCase() + C[0].slice(1)}`, ...o, sol: C[3],
        trap: 'Plotting $C/T$ against $T^2$ separates electrons (intercept) from phonons (slope).' };
    } },
  { id: 'hc-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Debye model numbers', format: 'which is NOT',
    make(r) {
      const T = [
        ['At low temperature $C \\approx 1944\\,(T/\\theta_D)^3$ J mol$^{-1}$ K$^{-1}$', '$\\tfrac{12\\pi^4}{5}R = 1944$ J mol$^{-1}$ K$^{-1}$.'],
        ['At $T = \\theta_D$ the Debye heat capacity is already about 95% of $3R$', 'The Debye function at $x = 1$ is 0.952.'],
        ['Diamond is well below the Dulong-Petit value at room temperature', 'Its Debye temperature is about 2200 K.'],
        ['The Dulong-Petit value is about 24.9 J mol$^{-1}$ K$^{-1}$', '$3R = 3\\times8.314$.'],
        ['Stiffer, lighter crystals have higher Debye temperatures', '$\\theta_D \\propto v_s n^{1/3}$, and sound is faster in stiff, light solids.'],
      ];
      const F = [
        ['At low temperature the Debye heat capacity is proportional to $T^2$', 'It is $T^3$ in three dimensions.'],
        ['Lead has a higher Debye temperature than diamond', 'Lead is soft and heavy (about 105 K), diamond about 2200 K.'],
        ['At $T = \\theta_D$ the Debye heat capacity is only about half of $3R$', 'It is about 95% of $3R$.'],
        ['The Dulong-Petit value is $\\tfrac32R$ per mole of atoms', 'Each atom has 3 kinetic and 3 potential quadratic terms: $3R$.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About the Debye model of lattice heat capacity, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'The $T^3$ law holds only well below $\\theta_D$ (roughly $T < \\theta_D/50$); at $\\theta_D$ the curve is nearly saturated.' };
    } },
  { id: 'hc-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'electronic against lattice heat capacity', format: 'order of magnitude',
    make(r) {
      const M = choose(r, [['copper', 1, 81600, 343], ['sodium', 1, 37500, 158], ['potassium', 1, 24600, 91], ['aluminium', 3, 134900, 428], ['silver', 1, 63800, 225], ['gold', 1, 63900, 165]]);
      const low = r() < 0.5, T = low ? choose(r, [0.5, 1, 2]) : 300;
      const ce = (Math.PI ** 2 / 2) * M[1] * T / M[2]; // in units of R
      const cl = low ? (1944 / 8.314) * (T / M[3]) ** 3 : 3;
      const x = ce / cl;
      const o = oomMcq(r, x);
      return { q: `For ${M[0]} (valence ${M[1]}, $T_F = ${M[2]}$ K, $\\theta_D = ${M[3]}$ K) at $T = ${T}$ K, the ratio of the electronic heat capacity to the lattice heat capacity is closest to`, ...o,
        sol: `Electrons: $C_{el} = \\tfrac{\\pi^2}{2}zR\\,T/T_F = ${fmt(ce, 3)}R$ per mole. Lattice: ${low ? `$C_{lat} = \\tfrac{12\\pi^4}{5}R(T/\\theta_D)^3 = ${fmt(cl, 3)}R$` : 'at 300 K close to the Dulong-Petit value $3R$'}. The ratio is $${fmt(x, 3)}$, nearest $10^{${o.k}}$. ${low ? 'At the lowest temperatures the linear electronic term wins over the $T^3$ phonon term.' : 'At room temperature the electrons add only about 1% to the heat capacity, the puzzle that Fermi-Dirac statistics solved.'}`,
        trap: 'Only a fraction $T/T_F$ of the electrons can be excited, so their heat capacity is tiny at room temperature but dominant near 1 K.' };
    } },
];
