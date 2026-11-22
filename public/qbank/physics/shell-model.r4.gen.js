// Round 4 extras for shell-model: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round, shuffle } from '../_util.js';
const R = String.raw;
const ORB = [['1s_{1/2}', 2], ['1p_{3/2}', 4], ['1p_{1/2}', 2], ['1d_{5/2}', 6], ['2s_{1/2}', 2], ['1d_{3/2}', 4], ['1f_{7/2}', 8], ['2p_{3/2}', 4], ['1f_{5/2}', 6], ['2p_{1/2}', 2], ['1g_{9/2}', 10]];
const LET = 'spdfgh';
const schmidt = (l, j, gl, gs) => (j === l + 0.5 ? (j - 0.5) * gl + gs / 2 : j / (j + 1) * ((j + 1.5) * gl - gs / 2));
const jt = (j) => `${2 * j}/2`;
const comb2 = (n) => n * (n - 1) / 2;

export default {
  items: [
    { id: 'nsm-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'shell filling',
      q: R`The $sd$ shell consists of the $1d_{5/2}$, $2s_{1/2}$ and $1d_{3/2}$ orbits. How many protons can it hold in total?`,
      options: [R`$12$`, R`$10$`, R`$8$`, R`$6$`], answer: 0,
      sol: R`An orbit with angular momentum $j$ holds $2j + 1$ protons: $6 + 2 + 4 = 12$. Filling it on top of the magic number 8 brings the count to $20$, the next magic number.`,
      trap: R`Counting $2(2l + 1)$ per orbit as if spin were not already included in $j$.` },
    { id: 'nsm-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'ground-state spin',
      q: R`The extreme single-particle shell model predicts the ground-state spin and parity of $^{33}$S ($Z = 16$, $N = 17$) to be`,
      options: [R`$\tfrac32^+$`, R`$\tfrac12^+$`, R`$\tfrac52^+$`, R`$\tfrac72^-$`], answer: 0,
      sol: R`The 16 protons pair off to zero. Neutrons: 8 fill up to $1p_{1/2}$, then $1d_{5/2}$ (6) brings 14 and $2s_{1/2}$ (2) brings 16. The 17th neutron goes into $1d_{3/2}$: $j = \tfrac32$, $l = 2$, parity $(-1)^2 = +$. So $\tfrac32^+$, as measured.`,
      trap: R`Stopping at $2s_{1/2}$, which is already full at $N = 16$.` },
    { id: 'nsm-r4-03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'magnetic moments',
      q: R`A single neutron in a $2s_{1/2}$ orbit has the Schmidt magnetic moment ______ $\mu_N$ (three decimal places; use $g_s = -3.826$, $g_l = 0$).`,
      answer: -1.913, tol: 0.002, unit: 'μ_N', calc: () => -3.826 / 2,
      sol: R`For $l = 0$ there is no orbital moment, and $j = s = \tfrac12$, so $\mu = g_s\,s = -3.826\times\tfrac12 = -1.913\,\mu_N$: just the free neutron's own moment.`,
      trap: R`Dropping the negative sign: the neutron moment points opposite to its spin.` },
    { id: 'nsm-r4-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'magic numbers',
      q: R`The first excited state of $^{208}$Pb lies at $2.61$ MeV, while in neighbouring even-even nuclei such as $^{204}$Hg or $^{210}$Po the first excited state is below $1.5$ MeV. The best explanation is`,
      options: [R`$^{208}$Pb is strongly deformed`, R`both its proton and neutron shells are closed, so any excitation must lift a nucleon across a large shell gap`, R`its pairing energy is especially small`, R`lead has the largest binding energy per nucleon of all nuclei`], answer: 1,
      sol: R`$^{208}$Pb has $Z = 82$ and $N = 126$, both magic. The lowest excitations need a particle-hole pair across the gaps above 82 and 126 (several MeV wide), so even the most collective state (the $3^-$ at $2.61$ MeV) is high. Near closed shells, extra nucleons or holes can recouple at low cost, giving low-lying states.`,
      trap: R`Linking high excitation energy to deformation; deformed nuclei have very LOW first excited states.` },
    { id: 'nsm-r4-05', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit', format: 'statements',
      q: R`About the spin-orbit term in the nuclear shell model, which statements are correct?`,
      options: [R`The splitting between $j = l \pm \tfrac12$ partners grows with $l$`, R`The $j = l + \tfrac12$ level lies lower than its $j = l - \tfrac12$ partner`, R`The ordering of the partners is the same as for the fine structure of a hydrogen atom`, R`It is needed to reproduce the magic numbers 28, 50, 82 and 126`], answer: [0, 1, 3],
      sol: R`With $\langle\vec l\cdot\vec s\rangle = \tfrac l2$ or $-\tfrac{l + 1}2$ (in $\hbar^2$), the splitting is proportional to $2l + 1$, so it grows with $l$. The nuclear term is strong and attractive for $j = l + \tfrac12$, pushing it down; in hydrogen the $j = l + \tfrac12$ level lies higher. Pulling $1f_{7/2}$, $1g_{9/2}$, $1h_{11/2}$ and $1i_{13/2}$ down into the shell below is exactly what turns the oscillator numbers 40, 70, 112, 168 into 28, 50, 82, 126.`,
      trap: R`Carrying the atomic order over to nuclei; the nuclear spin-orbit force has the opposite sign and is much larger.` },
    { id: 'nsm-r4-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit',
      q: R`$^{15}$N has a $\tfrac12^-$ ground state ($1p_{1/2}$ proton hole) and a $\tfrac32^-$ state at $6.32$ MeV ($1p_{3/2}$ proton hole). If the splitting comes from a term $-V_{ls}\,\vec l\cdot\vec s/\hbar^2$, then $V_{ls} = $ ______ MeV (two decimal places).`,
      answer: 4.21, tol: 0.02, unit: 'MeV', calc: () => 6.32 / 1.5,
      sol: R`For $l = 1$: $\langle\vec l\cdot\vec s\rangle/\hbar^2 = +\tfrac12$ for $j = \tfrac32$ and $-1$ for $j = \tfrac12$. The single-particle splitting is $V_{ls}(\tfrac12 + 1) = 1.5\,V_{ls}$. Removing a $p_{3/2}$ nucleon (more deeply bound) costs more than removing a $p_{1/2}$ one, so the $p_{3/2}$ hole lies higher by that amount: $V_{ls} = 6.32/1.5 = 4.21$ MeV.`,
      trap: R`Dividing by 1 or by $l$ instead of by $(2l + 1)/2$.` },
    { id: 'nsm-r4-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'excited states',
      q: R`$^{209}$Pb has a $\tfrac92^+$ ground state (one neutron in $2g_{9/2}$ beyond $N = 126$). Its first excited state is expected, and found, to be`,
      options: [R`$\tfrac{15}2^-$`, R`$\tfrac52^+$`, R`$\tfrac12^-$`, R`$\tfrac{11}2^+$`], answer: 3,
      sol: R`Above $N = 126$ the neutron orbits come in the order $2g_{9/2}$, $1i_{11/2}$, $1j_{15/2}$, $3d_{5/2}$, $4s_{1/2}$, ... The lowest excitation moves the odd neutron into the next orbit, $1i_{11/2}$ ($l = 6$, parity $+$): a $\tfrac{11}2^+$ state, seen at $0.78$ MeV. The $1j_{15/2}$ intruder ($\tfrac{15}2^-$) comes next, at $1.42$ MeV.`,
      trap: R`Choosing the $\tfrac12^-$ of $2p_{1/2}$: that is a hole state BELOW the gap and needs much more energy.` },
    { id: 'nsm-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Pauli principle',
      q: R`Two identical neutrons occupy the same $j = \tfrac72$ orbit. Counting every allowed combination of their $m$ values (each state of total $J$ contributes $2J + 1$), the total number of two-neutron states is ______.`,
      answer: 28, tol: 0, calc: () => 8 * 7 / 2,
      sol: R`The orbit has $2j + 1 = 8$ substates and two identical fermions must take different ones, with order not mattering: $\binom82 = 28$. Check with the allowed $J = 0, 2, 4, 6$ (only even $J$ survive antisymmetry): $1 + 5 + 9 + 13 = 28$. Without the Pauli principle, $J = 0$ to $7$ would give $8\times8 = 64$ states.`,
      trap: R`Counting $8\times8 = 64$, as for two different nucleons.` },
    { id: 'nsm-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'ground-state spin',
      q: R`For which of these nuclei does the single-particle shell model predict a $\tfrac12^-$ ground state?`,
      options: [R`$^{13}$C ($Z = 6$, $N = 7$)`, R`$^{15}$N ($Z = 7$, $N = 8$)`, R`$^{29}$Si ($Z = 14$, $N = 15$)`, R`$^{207}$Pb ($Z = 82$, $N = 125$)`], answer: [0, 1, 3],
      sol: R`$^{13}$C: the 7th neutron enters $1p_{1/2}$, so $\tfrac12^-$. $^{15}$N: one proton short of filling $1p_{1/2}$ (a hole), so $\tfrac12^-$. $^{29}$Si: the 15th neutron enters $2s_{1/2}$, giving $\tfrac12^+$. $^{207}$Pb: one neutron short of $N = 126$, whose last orbit is $3p_{1/2}$, so $\tfrac12^-$. All three predictions match experiment.`,
      trap: R`Assigning negative parity to every $j = \tfrac12$ orbit; the $s$ orbits have $l = 0$ and positive parity.` },
    { id: 'nsm-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'spin-orbit',
      q: R`The shell-model spin-orbit term is usually written $V_{ls}(r)\propto\dfrac1r\dfrac{dV}{dr}\,\vec l\cdot\vec s$ with $V(r)$ the central (Woods-Saxon) potential. A consequence of this radial form is that`,
      options: [R`the spin-orbit force is strongest at the centre of the nucleus`, R`the spin-orbit splitting is the same for all nuclei`, R`the term acts mainly in the nuclear surface, where the density changes, so it matters most for orbits with large amplitude there`, R`it acts only on protons, as in atoms`], answer: 2,
      sol: R`A Woods-Saxon potential is flat inside and changes only within the surface region (about $2$ fm thick), so $dV/dr$, and with it the spin-orbit term, is peaked at the surface. Both protons and neutrons feel it, because it comes from the strong interaction, not from a nucleon moving through an electric field. In very neutron-rich nuclei with diffuse surfaces the splitting is expected to weaken.`,
      trap: R`Borrowing the atomic picture (electric field of the nucleus) and concluding that only charged particles feel it.` },
  ],
  gens: [
    { id: 'nsm-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'magnetic moments',
      make(r) {
        const [l, j] = choose(r, [[1, 0.5], [1, 1.5], [2, 1.5], [2, 2.5], [3, 2.5], [3, 3.5], [4, 3.5], [4, 4.5], [5, 4.5], [5, 5.5]]);
        const neu = choose(r, [true, false]), gl = neu ? 0 : 1, gs = neu ? -3.826 : 5.586, ans = schmidt(l, j, gl, gs), n = choose(r, [1, 2]);
        const orb = `${n}${LET[l]}_{${jt(j)}}`, up = j === l + 0.5;
        return { q: R`Find the Schmidt magnetic moment of a single odd ${neu ? 'neutron' : 'proton'} in the $${orb}$ orbit ($g_l = ${gl}$, $g_s = ${gs}$). Answer in $\mu_N$ to three decimal places.`,
          answer: round(ans, 3), tol: 0.003, l, j, gl, gs,
          sol: up ? R`Here $j = l + \tfrac12$, so $\mu = (j - \tfrac12)g_l + \tfrac12g_s = ${j - 0.5}\times${gl} + \tfrac12(${gs}) = ${round(ans, 3)}\,\mu_N$.` : R`Here $j = l - \tfrac12$, so $\mu = \dfrac{j}{j + 1}\left[(j + \tfrac32)g_l - \tfrac12g_s\right] = \dfrac{${j}}{${j + 1}}\left[${j + 1.5}\times${gl} - \tfrac12(${gs})\right] = ${round(ans, 3)}\,\mu_N$.`,
          trap: R`Using the $j = l + \tfrac12$ formula for both partners, or giving the neutron $g_l = 1$.` };
      },
      verify: (p) => schmidt(p.l, p.j, p.gl, p.gs) },
    { id: 'nsm-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Pauli principle',
      make(r) {
        const j = choose(r, [1.5, 2.5, 3.5, 4.5, 5.5, 6.5]), ask = choose(r, ['nJ', 'states', 'Jmax']), d = 2 * j + 1;
        const ans = ask === 'nJ' ? d / 2 : ask === 'states' ? comb2(d) : 2 * j - 1;
        const what = { nJ: 'the number of different allowed values of their total angular momentum $J$ is', states: 'the total number of allowed two-nucleon $m$-states (summing $2J + 1$ over the allowed $J$) is', Jmax: 'the largest allowed total angular momentum $J$ is' }[ask];
        return { q: R`Two identical nucleons sit in the same $j = ${jt(j)}$ orbit. By the Pauli principle, ${what} ______.`,
          answer: ans, tol: 0, j, ask,
          sol: R`For two identical fermions in one $j$ shell only even $J = 0, 2, \dots, 2j - 1$ are allowed (the states with odd $J$ are symmetric). Here that is $J = 0$ to $${2 * j - 1}$ in steps of 2: ${d / 2} values, with $\sum(2J + 1) = \binom{${d}}{2} = ${comb2(d)}$ states and maximum $J = ${2 * j - 1}$. So the answer is $${ans}$.`,
          trap: R`Allowing $J = 2j$ (both nucleons with $m = j$) or odd $J$, as for non-identical nucleons.` };
      },
      verify: (p) => { const d = 2 * p.j + 1; return p.ask === 'nJ' ? d / 2 : p.ask === 'states' ? comb2(d) : 2 * p.j - 1; } },
    { id: 'nsm-r4g3', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'shell filling',
      make(r) {
        const n = 2 * int(r, 1, 24) + 1;   // odd nucleon number 3 .. 49
        let tot = 0, k = 0;
        for (; k < ORB.length; k++) { tot += ORB[k][1]; if (n <= tot) break; }
        const wr = shuffle(r, ORB.map((o) => o[0]).filter((_, i) => i !== k && Math.abs(i - k) <= 3)).slice(0, 3);
        const o = mcqOptions(r, ORB[k][0], wr, (v) => `$${v}$`);
        return { q: R`In the standard shell-model ordering (with spin-orbit splitting), the ${n}th neutron of a nucleus goes into which orbit?`, ...o, n,
          sol: R`Fill the orbits in order, $2j + 1$ neutrons each: $1s_{1/2}$ (2), $1p_{3/2}$ (6), $1p_{1/2}$ (8), $1d_{5/2}$ (14), $2s_{1/2}$ (16), $1d_{3/2}$ (20), $1f_{7/2}$ (28), $2p_{3/2}$ (32), $1f_{5/2}$ (38), $2p_{1/2}$ (40), $1g_{9/2}$ (50), with running totals in brackets. Neutron number ${n} falls in $${ORB[k][0]}$.`,
          trap: R`Using the oscillator ordering without spin-orbit, which places $1f_{7/2}$ and $1g_{9/2}$ in the wrong shells.` };
      } },
  ],
};
