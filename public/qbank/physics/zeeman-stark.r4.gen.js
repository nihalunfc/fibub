// Round 4 extras for zeeman-stark: original questions, written 2026-11-22.
import { pick, int, choose, round, shuffle, fmt } from '../_util.js';
const R = String.raw;

const H = 6.62607015e-34, CL = 2.99792458e8, MUB = 9.2740100783e-24;
const LL = 'SPDFG';
const hf = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** A rational number (multiple of 1/60) as TeX. */
const fr = (x) => { let p = Math.round(x * 60), q = 60; const g = gcd(p, q) || 1; p /= g; q /= g; return q === 1 ? `${p}` : R`\tfrac{${p}}{${q}}`; };
const gJ = (S, L, J) => (J === 0 ? 0 : 1 + (J * (J + 1) + S * (S + 1) - L * (L + 1)) / (2 * J * (J + 1)));
/** Distinct |shift| values (units of mu_B B, rounded to 1/60) of the weak-field Zeeman components of an E1 line. */
const comps = (S, Lu, Ju, Ll, Jl) => {
  const gu = gJ(S, Lu, Ju), gl = gJ(S, Ll, Jl), out = new Set();
  for (let Mu = -Ju; Mu <= Ju; Mu++) for (let Ml = -Jl; Ml <= Jl; Ml++) {
    if (Math.abs(Mu - Ml) > 1) continue;
    if (Ju === Jl && Mu === 0 && Ml === 0) continue;
    out.add(Math.round(Math.abs(gu * Mu - gl * Ml) * 60));
  }
  return [...out].sort((a, b) => a - b).map((k) => k / 60);
};
/** Spinless hydrogen states of shell n with parabolic n1 - n2 = k. */
const starkCount = (n, k) => { let c = 0; for (let m = -(n - 1); m <= n - 1; m++) for (let n1 = 0; n1 < n; n1++) { const n2 = n - 1 - Math.abs(m) - n1; if (n2 >= 0 && n1 - n2 === k) c++; } return c; };

export default {
  items: [
    { id: 'zst-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'weak-field Zeeman',
      q: R`In a weak magnetic field $B$ along $z$, the sublevel $M_J$ of a level with Landé factor $g_J$ is shifted by`,
      options: [R`$g_J\mu_BM_JB$`, R`$g_J\mu_BJB$`, R`$\mu_BM_JB$`, R`$g_J\mu_B\sqrt{J(J+1)}\,B$`], answer: 0,
      sol: R`The atom's moment is $\vec\mu = -g_J\mu_B\vec J/\hbar$, so $\Delta E = -\vec\mu\cdot\vec B = g_J\mu_BB\,J_z/\hbar = g_J\mu_BM_JB$. There are $2J + 1$ equally spaced sublevels, $g_J\mu_BB$ apart.`,
      trap: R`$\mu_BM_JB$ is the normal-Zeeman result; it holds only when $g_J = 1$ (singlets).` },
    { id: 'zst-r4-02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landé g',
      q: R`The Landé factor $g_J$ of a $^3D_1$ level (take $g_s = 2$) is ______ (two decimal places).`,
      answer: 0.5, tol: 0.01, calc: () => 1 + (2 + 2 - 6) / 4,
      sol: R`$S = 1$, $L = 2$, $J = 1$. $g_J = 1 + \dfrac{J(J+1) + S(S+1) - L(L+1)}{2J(J+1)} = 1 + \dfrac{2 + 2 - 6}{4} = 0.50$. Here the spin points largely against $\vec L$ ($J = L - S$), so the spin's double moment partly cancels the orbital moment.`,
      trap: R`Swapping $S(S+1)$ and $L(L+1)$ gives $1.5$.` },
    { id: 'zst-r4-03', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Landé g',
      q: R`The ground level of the Cr$^{3+}$ ion is $^4F_{3/2}$. Its Landé factor $g_J$ is`,
      options: [R`$\tfrac23$`, R`$\tfrac45$`, R`$\tfrac25$`, R`$\tfrac65$`], answer: 2,
      sol: R`$S = \tfrac32$, $L = 3$, $J = \tfrac32$: $J(J+1) = S(S+1) = \tfrac{15}{4}$, $L(L+1) = 12$. $g_J = 1 + \dfrac{\tfrac{15}{4} + \tfrac{15}{4} - 12}{2\times\tfrac{15}{4}} = 1 - \dfrac{4.5}{7.5} = \tfrac25$. (In crystals the orbital moment of Cr$^{3+}$ is quenched and the measured $g$ is close to 2 instead.)`,
      trap: R`Using $J = L + S = \tfrac92$ (Hund's rule for a more-than-half-full shell) gives a different level; $3d^3$ is less than half full.` },
    { id: 'zst-r4-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'linear Stark effect',
      q: R`In a uniform electric field, the $n = 4$ level of hydrogen (spin and fine structure ignored) splits by the linear Stark effect into how many distinct energies?`,
      options: [R`$4$`, R`$7$`, R`$16$`, R`$9$`], answer: 1,
      sol: R`In parabolic quantum numbers $\Delta E = \tfrac32n(n_1 - n_2)ea_0E$ with $n_1 + n_2 + |m| + 1 = n$. For $n = 4$, $n_1 - n_2$ takes every whole value from $-3$ to $3$: seven values, equally spaced by $6ea_0E$. In general $2n - 1$ levels.`,
      trap: R`$16 = n^2$ is the number of states; many of them share an energy.` },
    { id: 'zst-r4-05', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'linear Stark effect', format: 'statements',
      q: R`For the $n = 3$ level of hydrogen in a field $E$ (linear Stark effect, $\Delta E = \tfrac32n(n_1 - n_2)ea_0E$, spin ignored), which statements are correct?`,
      options: [R`The level splits into five equally spaced levels`, R`The unshifted level contains three states`,
        R`Each of the two outermost levels is a single state`, R`The outermost levels are shifted by $\pm3ea_0E$`], answer: [0, 1, 2],
      sol: R`$n_1 + n_2 = 2 - |m|$. $m = 0$: $(n_1, n_2) = (2,0), (1,1), (0,2)$, so $n_1 - n_2 = 2, 0, -2$. $|m| = 1$ (two states each): $(1,0), (0,1)$, so $\pm1$. $|m| = 2$ (two states): $(0,0)$, so $0$. Values $-2$ to $2$: five levels, spacing $\tfrac92ea_0E$. $n_1 - n_2 = 0$ comes from $m = 0$ and $m = \pm2$: three states. $\pm2$ come only from $m = 0$: one state each. The outer shift is $\tfrac32\times3\times2\,ea_0E = 9ea_0E$. Total $1 + 2 + 3 + 2 + 1 = 9 = n^2$.`,
      trap: R`$\pm3ea_0E$ is the $n = 2$ result; the shift grows as $n(n_1 - n_2)$.` },
    { id: 'zst-r4-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'anomalous Zeeman',
      q: R`The line $^3P_2\to{}^3S_1$ is placed in a weak magnetic field. The number of distinct Zeeman components is ______.`,
      answer: 9, tol: 0, calc: () => comps(1, 1, 2, 0, 1).length * 2 - 1,
      sol: R`$g(^3P_2) = 1 + \dfrac{6 + 2 - 2}{12} = \tfrac32$, $g(^3S_1) = 2$. Shift $= (\tfrac32M_u - 2M_l)\mu_BB$. $\Delta M = 0$ ($M = -1, 0, 1$; $0\to0$ is allowed since $\Delta J \ne 0$): $+\tfrac12, 0, -\tfrac12$. $\Delta M = +1$: $(M_u, M_l) = (0,-1), (1,0), (2,1)$ give $2, \tfrac32, 1$. $\Delta M = -1$: $-2, -\tfrac32, -1$. All nine are different: three $\pi$ and six $\sigma$ components.`,
      trap: R`Forbidding $M = 0\to0$ here is wrong; that rule applies only when $\Delta J = 0$.` },
    { id: 'zst-r4-07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Zeeman in astronomy', unit: 'T',
      q: R`In a sunspot, the $\sigma$ components of the iron line at $525.02$ nm (which splits like a level pattern with an effective Landé factor of $3$, so the $\sigma$ components sit at $\pm3\mu_BB$) are shifted by $\pm0.0150$ nm from the line centre. The field is ______ T (three decimal places). Use $h = 6.626\times10^{-34}$ J s, $c = 2.998\times10^8$ m/s, $\mu_B = 9.274\times10^{-24}$ J/T.`,
      answer: 0.389, tol: 0.004, calc: () => 0.0150e-9 * H * CL / ((525.02e-9) ** 2 * 3 * MUB),
      sol: R`$\Delta E = hc\,\Delta\lambda/\lambda^2 = \dfrac{1.986\times10^{-25}\times1.50\times10^{-11}}{(5.2502\times10^{-7})^2} = 1.081\times10^{-23}$ J. Set $3\mu_BB = \Delta E$: $B = \dfrac{1.081\times10^{-23}}{3\times9.274\times10^{-24}} = 0.389$ T. Lines with large effective $g$ are chosen for solar magnetometry because they split the most.`,
      trap: R`$\Delta E = hc\Delta\lambda/\lambda^2$, not $hc/\Delta\lambda$.` },
    { id: 'zst-r4-08', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'intermediate coupling',
      q: R`In a heavy atom, the two $J = 1$ levels of an $ns\,n'p$ configuration are mixtures of $^3P_1$ and $^1P_1$. The measured Landé factor of one of them is $1.40$. The $g$ factor of the other $J = 1$ level is ______ (two decimal places).`,
      answer: 1.1, tol: 0.01, calc: () => 1.5 + 1 - 1.4,
      sol: R`In pure LS coupling $g(^3P_1) = \tfrac32$ and $g(^1P_1) = 1$. Within the two-dimensional $J = 1$, $M = 1$ space, $g$ is the diagonal of the matrix of $(L_z + 2S_z)/\hbar$. Mixing the two states is a change of basis, which leaves the trace unchanged: $g_1 + g_2 = \tfrac32 + 1 = 2.5$ for any coupling (the $g$-sum rule). So $g_2 = 2.5 - 1.40 = 1.10$.`,
      trap: R`Assuming the other level keeps its LS value of 1 ignores that the mixing changes both.` },
    { id: 'zst-r4-09', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'magnetic moments',
      q: R`When working out atomic Zeeman patterns (not hyperfine levels), the magnetic moment of the nucleus is usually ignored because`,
      options: [R`nuclei have no spin`, R`the nucleus is too far from the electrons`, R`the nuclear moment points along the field and cancels`, R`nuclear moments are of order the nuclear magneton, about $1/1836$ of $\mu_B$`], answer: 3,
      sol: R`$\mu_N = e\hbar/2m_p = \mu_B\,m_e/m_p\approx\mu_B/1836$. Nuclear Zeeman energies are about a thousand times smaller than electronic ones, so they only matter when the electronic shifts are being resolved at the hyperfine level (e.g. NMR, Breit-Rabi). Many nuclei do have spin.`,
      trap: R`Nuclear spin is not zero in general (the proton has $I = \tfrac12$); the moment is small because the mass is large.` },
    { id: 'zst-r4-10', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Stark and Zeeman compared',
      q: R`A level with $J = 2$ is placed first in a weak magnetic field, then in a weak uniform electric field (quadratic Stark effect). Which statement is correct?`,
      options: [R`Both fields give five equally spaced sublevels`, R`Both fields leave $M_J$ and $-M_J$ degenerate`,
        R`The magnetic field splits $M_J$ from $-M_J$; the electric field leaves them degenerate, giving three sublevels ($|M_J| = 0, 1, 2$)`, R`The electric field gives five sublevels and the magnetic field three`], answer: 2,
      sol: R`The Zeeman energy $g_J\mu_BM_JB$ is odd in $M_J$: five equally spaced sublevels. The quadratic Stark energy is a second-order effect of $\vec d\cdot\vec E$ and depends on $M_J^2$ (an electric field is unchanged by time reversal, which swaps $M_J\to-M_J$), so only $|M_J| = 0, 1, 2$ are distinct: three sublevels, not equally spaced.`,
      trap: R`Treating the Stark effect like the Zeeman effect: a polar vector cannot tell $+M_J$ from $-M_J$.` },
    { id: 'zst-r4-11', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Paschen-Back',
      q: R`A one-electron $p$ state is followed adiabatically from a weak field to a very strong field (spin-orbit coupling $A\,\vec L\cdot\vec S$ with $A > 0$). States with the same $M = m_l + m_s$ never cross. The weak-field state $^2P_{3/2}$, $M_J = +\tfrac12$ becomes which strong-field state $|m_l, m_s\rangle$?`,
      options: [R`$|0, +\tfrac12\rangle$`, R`$|1, -\tfrac12\rangle$`, R`$|1, +\tfrac12\rangle$`, R`$|-1, +\tfrac12\rangle$`], answer: 0,
      sol: R`Only $|1, -\tfrac12\rangle$ and $|0, +\tfrac12\rangle$ have $m_l + m_s = \tfrac12$. In a strong field their energies are $\mu_BB(m_l + 2m_s)$: $0$ and $+\mu_BB$, so $|0, +\tfrac12\rangle$ is the upper one. At zero field the $M = \tfrac12$ state of $^2P_{3/2}$ is the upper one (above $^2P_{1/2}$ for $A > 0$). Since the two never cross, upper connects to upper: $^2P_{3/2}, M_J = \tfrac12\to|0, +\tfrac12\rangle$.`,
      trap: R`$|1, +\tfrac12\rangle$ and $|-1, +\tfrac12\rangle$ have $M = \tfrac32$ and $-\tfrac12$; $M$ is conserved at every field strength.` },
    { id: 'zst-r4-12', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Landé g',
      q: R`Taking $g_s = 2$, which of these levels have $g_J = 2$ exactly?`,
      options: [R`$^2S_{1/2}$`, R`$^6S_{5/2}$`, R`$^4D_{1/2}$`, R`$^3P_2$`], answer: [0, 1],
      sol: R`With $L = 0$, $J = S$ and $g_J = 1 + \dfrac{2S(S+1)}{2S(S+1)} = 2$: the moment is pure spin. So both S terms have $g = 2$ (the Mn$^{2+}$ and Fe$^{3+}$ ions, $^6S_{5/2}$, are classic ESR $g\approx2$ ions). $^4D_{1/2}$: $1 + \dfrac{0.75 + 3.75 - 6}{1.5} = 0$. $^3P_2$: $1 + \dfrac{6 + 2 - 2}{12} = \tfrac32$.`,
      trap: R`A large spin does not change $g$; only an orbital part moves it away from 2.` },
  ],
  gens: [
    { id: 'zst-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'linear Stark',
      make(r) {
        const n = int(r, 2, 6), k = int(r, 0, n - 1) * (r() < 0.5 ? 1 : -1);
        const c = starkCount(n, k);
        const rows = [];
        for (let am = 0; am <= n - 1 - Math.abs(k); am++) if ((n - 1 - am - k) % 2 === 0) rows.push(am === 0 ? '$m = 0$ (1 state)' : `$m = \\pm${am}$ (2 states)`);
        return { q: R`For hydrogen in a uniform field $E$, the linear Stark shift is $\Delta E = \tfrac32n(n_1 - n_2)ea_0E$ with $n_1 + n_2 + |m| + 1 = n$. Ignoring spin, how many states of the $n = ${n}$ level have the shift $${round(1.5 * n * k, 1)}\,ea_0E$? ______`,
          answer: c, tol: 0, n, k,
          sol: R`The shift fixes $n_1 - n_2 = ${k}$. Then $n_1 + n_2 = ${n - 1} - |m|$ must be at least $${Math.abs(k)}$ and have the same parity as $${k}$. Allowed: ${rows.join(', ')}. Total ${c}.`,
          trap: 'Each m other than 0 counts twice (m and -m).' };
      },
      verify: (p) => starkCount(p.n, p.k) },
    { id: 'zst-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Zeeman in astronomy',
      make(r) {
        const lam = pick(r, 400, 1600, 0.01), g = choose(r, [1, 1.5, 2, 2.5, 3]), B = pick(r, 0.05, 0.4, 0.01);
        const dl = (lam * 1e-9) ** 2 * g * MUB * B / (H * CL) * 1e12; // pm
        const dls = +dl.toPrecision(3);
        const Bf = dls * 1e-12 * H * CL / ((lam * 1e-9) ** 2 * g * MUB);
        return { q: R`A stellar absorption line at $${lam}$ nm has an effective Landé factor $${g}$, so its $\sigma$ components sit at $\pm${g === 1 ? '' : g}\mu_BB$. They are observed shifted by $\pm${dls}$ pm from the centre. The magnetic field is ______ T (three significant figures). Use $h = 6.626\times10^{-34}$ J s, $c = 2.998\times10^8$ m/s, $\mu_B = 9.274\times10^{-24}$ J/T.`,
          answer: +Bf.toPrecision(3), tol: +(Bf * 0.01).toPrecision(2), unit: 'T', lam, g, dls,
          sol: R`$\Delta E = hc\,\Delta\lambda/\lambda^2 = ${fmt(H * CL * dls * 1e-12 / (lam * 1e-9) ** 2, 4)}$ J. $B = \Delta E/(${g === 1 ? '' : g}\mu_B) = ${+Bf.toPrecision(3)}$ T.`,
          trap: 'The wavelength shift grows as lambda squared: infrared lines are more sensitive to the field.' };
      },
      verify: (p) => p.dls * 1e-12 * H * CL / ((p.lam * 1e-9) ** 2 * p.g * MUB) },
    { id: 'zst-r4g3', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'anomalous Zeeman',
      make(r) {
        const [S, Lu, Ju, Ll, Jl] = choose(r, [[0.5, 1, 0.5, 0, 0.5], [0.5, 1, 1.5, 0, 0.5], [0.5, 2, 1.5, 1, 0.5], [0.5, 2, 2.5, 1, 1.5], [0.5, 2, 1.5, 1, 1.5],
          [1, 1, 1, 0, 1], [1, 1, 2, 0, 1], [1, 2, 1, 1, 0], [1, 2, 2, 1, 1], [1, 2, 3, 1, 2], [1, 2, 1, 1, 1]]);
        const cs = comps(S, Lu, Ju, Ll, Jl);
        const good = cs.filter((x) => x > 0);
        const badPool = [];
        for (const x of [...good, 0.5, 1]) for (const d of [1 / 3, 1 / 2, -1 / 3, 1 / 6]) { const y = Math.round((x + d) * 60) / 60; if (y > 0 && !cs.some((c) => Math.abs(c - y) < 1e-9) && !badPool.includes(y)) badPool.push(y); }
        const k = Math.min(good.length, int(r, 1, 3));
        const opts = [...shuffle(r, good).slice(0, k), ...shuffle(r, badPool).slice(0, 4 - k)].sort((a, b) => a - b);
        const lv = (L, J) => `^{${2 * S + 1}}${LL[L]}_{${hf(J)}}`;
        const gu = gJ(S, Lu, Ju), gl = gJ(S, Ll, Jl);
        return { q: R`The line $${lv(Lu, Ju)}\to{}${lv(Ll, Jl)}$ is placed in a weak magnetic field $B$. Which of these values of $|\Delta E|/\mu_BB$ (shift of a component from the zero-field line) occur?`,
          options: opts.map((x) => `$${fr(x)}$`), answer: opts.map((x, i) => (cs.some((c) => Math.abs(c - x) < 1e-9) ? i : -1)).filter((i) => i >= 0),
          sol: R`$g_u = ${fr(gu)}$; ${Jl === 0 ? R`the lower level has $J = 0$, so only $M_l = 0$ and its $g$ is not needed` : R`$g_l = ${fr(gl)}$`}. Components: $\Delta E = (g_uM_u - g_lM_l)\mu_BB$ with $\Delta M = 0, \pm1$${Ju === Jl && Number.isInteger(Ju) ? R` (and $M = 0\to0$ forbidden since $\Delta J = 0$)` : ''}. The distinct magnitudes are ${cs.map((x) => `$${fr(x)}$`).join(', ')}.`,
          trap: 'Work out both g factors; the pattern is symmetric about zero, so listing the positive shifts is enough.' };
      } },
  ],
};
