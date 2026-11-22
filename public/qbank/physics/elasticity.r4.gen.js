// Round 4 extras for elasticity: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const g = 9.8;

export default {
  items: [
    { id: 'ela-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'hooke law',
      q: R`A wire of length $L$, cross-section $A$ and Young's modulus $Y$ is stretched within its elastic limit. Treated as a spring, its force constant (force per unit extension) is`,
      options: [R`$YL/A$`, R`$Y/(AL)$`, R`$YA/L$`, R`$YAL$`], answer: 2,
      sol: R`$Y = \dfrac{F/A}{\Delta L/L}$, so $F = \dfrac{YA}{L}\,\Delta L$. The force per unit extension is $k = YA/L$: a thicker wire is stiffer, a longer one is softer (like springs in series).`,
      trap: R`Check with units: $YA/L$ is Pa × m² / m = N/m.` },
    { id: 'ela-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'own weight',
      q: R`A uniform heavy wire hangs from the ceiling and carries a block at its lower end. The tensile stress in the wire is largest`,
      options: ['at the top', 'at the bottom', 'at the middle', 'nowhere: it is the same all along'], answer: 0,
      sol: R`The tension at a height in the wire must hold up the block plus all the wire below that point. The top holds the whole wire and the block, so the tension, and with a uniform cross-section the stress, is largest there. It falls linearly to the block's weight alone at the bottom.`,
      trap: R`"The same everywhere" is true only for a massless wire.` },
    { id: 'ela-r4-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'elastic energy',
      q: R`A steel wire ($Y = 200$ GPa) and a copper wire ($Y = 120$ GPa) have the same length and diameter and carry the same load, within their elastic limits. Comparing the elastic energy stored,`,
      options: ['steel stores more, because it is more elastic', 'both store the same, because the load is the same', 'steel stores 5/3 times as much', 'copper stores 5/3 times as much'], answer: 3,
      sol: R`$U = \tfrac12F\,\Delta L$ with $\Delta L = FL/(AY)$, so $U = \dfrac{F^2L}{2AY}$. For the same $F$, $L$ and $A$, $U \propto 1/Y$: copper stores $200/120 = 5/3$ times as much, because it stretches further under the same force.`,
      trap: R`For a fixed load the stiffer wire stretches less and stores less; for a fixed extension it would be the other way round.` },
    { id: 'ela-r4-04', type: 'nat', level: 3, exams: ['jam'], sub: 'own weight',
      q: R`A rock has density 2700 kg/m³ and crushes under a compressive stress of $1.6\times10^8$ Pa. A tall uniform vertical column of this rock, standing on its base, can be at most ______ km high before its base crushes ($g = 9.8$ m/s², two decimal places).`,
      answer: 6.05, tol: 0.03, unit: 'km', calc: () => 1.6e8 / (2700 * 9.8) / 1000,
      sol: R`The base carries the weight of the whole column: stress $= \dfrac{\rho Ahg}{A} = \rho gh$, independent of the cross-section. Setting $\rho gh = 1.6\times10^8$ Pa: $h = \dfrac{1.6\times10^8}{2700\times9.8} = 6047$ m $\approx 6.05$ km.`,
      trap: R`A thicker column does not help: its weight grows with its area exactly as its strength does.` },
    { id: 'ela-r4-05', type: 'msq', level: 2, exams: ['jam'], sub: 'thermal stress', format: 'statements',
      q: R`A uniform rod is clamped without stress between two rigid walls and then warmed by $\Delta T$. Which statements are correct?`,
      options: ["The stress in the rod does not depend on the rod's length", 'The force the rod exerts on each wall is proportional to its cross-sectional area', 'Doubling the temperature rise doubles the stress', 'A material with a larger Young\'s modulus but the same expansion coefficient develops a smaller stress'], answer: [0, 1, 2],
      sol: R`The rod would expand by $L\alpha\Delta T$; the walls squeeze it back, so the strain is $\alpha\Delta T$ and the stress is $Y\alpha\Delta T$. The length cancels; the stress is linear in $\Delta T$; the force is stress × area, so it scales with $A$; and a stiffer material (larger $Y$) gives a larger stress, not a smaller one.`,
      trap: R`A longer rod would expand more, but it also has more length to absorb the squeeze: the strain is the same.` },
    { id: 'ela-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'torsion',
      q: R`A torsion pendulum (a disc on a vertical wire) has period $T$. The wire is replaced by one of the same metal with half the radius and half the length. The new period is ______ times $T$ (two decimal places).`,
      answer: 2.83, tol: 0.01, calc: () => Math.sqrt(8),
      sol: R`The restoring torque per radian is $C = \dfrac{\pi Gr^4}{2L}$ and $T = 2\pi\sqrt{I/C}$. Halving $r$ divides $C$ by 16; halving $L$ doubles it. So $C' = C/8$, and $T' = \sqrt8\,T = 2.83\,T$.`,
      trap: R`The radius enters as $r^4$; treating it like the area ($r^2$) gives the wrong factor.` },
    { id: 'ela-r4-07', type: 'nat', level: 4, exams: ['jam'], sub: 'thermal stress',
      q: R`A steel tyre of inner diameter 0.998 m is heated, slipped over a rigid wheel of diameter 1.000 m and allowed to cool, so it grips the wheel. Its cross-section is 10 cm² and $Y = 2.0\times10^{11}$ Pa. The tension in the tyre is ______ kN (to the nearest kN).`,
      answer: 401, tol: 2, unit: 'kN', calc: () => 2e11 * 10e-4 * (0.002 / 0.998) / 1000,
      sol: R`When cool, the tyre is held at a circumference $\pi\times1.000$ m instead of its natural $\pi\times0.998$ m. Strain $= \dfrac{0.002}{0.998} = 2.004\times10^{-3}$ (the same for circumference and diameter). Tension $= YA\times$ strain $= 2\times10^{11}\times10^{-3}\times2.004\times10^{-3} = 4.01\times10^5$ N $\approx 401$ kN. (To fit it, it must be heated by about strain$/\alpha \approx 170$ K for $\alpha = 1.2\times10^{-5}$ K⁻¹.)`,
      trap: R`Use the change in length over the natural length: 0.002 over 0.998, not 0.002 over 1.000 (the difference is small here, but it is the right habit).` },
    { id: 'ela-r4-08', type: 'mcq', level: 4, exams: ['jam'], sub: 'bending',
      q: R`A beam of length $L$ is first clamped at one end as a cantilever with a load $W$ at the free end. Then the same beam rests on two supports at its ends with the same load $W$ at its middle. The ratio of the largest deflection in the first case to that in the second is`,
      options: ['4', '16', '8', '2'], answer: 1,
      sol: R`Cantilever: $\delta_1 = \dfrac{WL^3}{3YI}$. On two supports, by symmetry the middle stays level, so each half acts like a cantilever of length $L/2$ clamped at the centre and pushed by $W/2$ (the support reaction) at its end: $\delta_2 = \dfrac{(W/2)(L/2)^3}{3YI} = \dfrac{WL^3}{48YI}$. Ratio $= 48/3 = 16$.`,
      trap: R`Halving the length alone gives 8; the load on each half is also halved, giving another factor 2.` },
    { id: 'ela-r4-09', type: 'msq', level: 4, exams: ['jam'], sub: 'hooke law', format: 'statements',
      q: R`A light rigid bar hangs horizontally from two vertical wires of the same metal and the same length, with cross-sections $A$ (at one end) and $2A$ (at the other end). A load $W$ is hung from the bar at the point that keeps it horizontal. Which statements are correct?`,
      options: ['The thicker wire carries twice the load of the thinner one', 'The thinner wire has the larger strain', 'Both wires store the same elastic energy', "The load hangs one third of the bar's length from the thicker wire"], answer: [0, 3],
      sol: R`A level bar means equal extensions, so equal strains and (same metal) equal stresses. Load = stress × area, so the loads are $W/3$ (thin) and $2W/3$ (thick). Energies $\tfrac12F\Delta L$ with equal $\Delta L$: the thick wire stores twice as much. Moments about the load point: $\tfrac{W}{3}x_1 = \tfrac{2W}{3}x_2$ with $x_1 + x_2 = d$, so $x_2 = d/3$ from the thick wire.`,
      trap: R`Same metal and same extension means same stress; only the force differs.` },
    { id: 'ela-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'own weight',
      q: R`A steel cable 200 m long with cross-section 1.0 cm² hangs from its top end carrying nothing ($\rho = 7800$ kg/m³, $Y = 2.0\times10^{11}$ Pa, $g = 9.8$ m/s²). The elastic energy stored in it by its own weight is ______ J (two decimal places).`,
      answer: 3.9, tol: 0.04, unit: 'J', calc: () => (1e-4 * (7800 * 9.8) ** 2 * 200 ** 3) / (6 * 2e11),
      sol: R`At distance $x$ above the bottom, the stress is $\rho gx$. Energy per volume $= \sigma^2/(2Y)$, so $U = \int_0^L\dfrac{(\rho gx)^2}{2Y}A\,dx = \dfrac{A\rho^2g^2L^3}{6Y} = \dfrac{10^{-4}\times(76\,440)^2\times8\times10^6}{1.2\times10^{12}} = 3.90$ J. Check: the weight $W = 1529$ N and the stretch $\delta = \rho gL^2/(2Y) = 7.64$ mm give $U = W\delta/3$.`,
      trap: R`$\tfrac12W\delta = 5.84$ J assumes the whole weight acts at the bottom; the stress here grows from zero, which gives $W\delta/3$.` },
  ],
  gens: [
    { id: 'ela-r4g1', type: 'nat', level: 4, exams: ['jam'], sub: 'thermal stress',
      make(r) {
        const D = choose(r, [0.8, 1, 1.2, 1.5]), gap = choose(r, [1, 1.5, 2, 2.5, 3]), A = int(r, 4, 20), [mat, Y] = choose(r, [['steel', 200], ['iron', 190], ['bronze', 110]]);
        const d = D - gap / 1000, strain = (D - d) / d, answer = round((Y * 1e9 * A * 1e-4 * strain) / 1000, 1);
        return { q: R`A ${mat} ring ($Y = ${Y}$ GPa) of inner diameter ${round(d * 1000, 1)} mm and cross-section ${A} cm² is heated, fitted over a rigid wheel of diameter ${D * 1000} mm and allowed to cool. Find the tension in the ring in kN.`,
          answer, tol: Math.max(0.5, answer * 0.01), unit: 'kN', D, d, A, Y,
          sol: R`Strain $= \dfrac{${D * 1000} - ${round(d * 1000, 1)}}{${round(d * 1000, 1)}} = ${round(strain * 1000, 4)}\times10^{-3}$. Tension $= YA\times$ strain $= ${Y}\times10^9\times${A}\times10^{-4}\times${round(strain * 1000, 4)}\times10^{-3} = ${answer}$ kN.`,
          trap: 'The strain is the change in circumference over the natural circumference, the same as for the diameter.' };
      },
      verify: (p) => (p.Y * 1e9 * p.A * 1e-4 * ((p.D - p.d) / p.d)) / 1000 },
    { id: 'ela-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'torsion',
      make(r) {
        const T0 = pick(r, 1, 6, 0.5), [rw, rf] = choose(r, [['half the radius', 0.5], ['twice the radius', 2], ['1.5 times the radius', 1.5], ['0.8 times the radius', 0.8]]), [lw, lf] = choose(r, [['the same length', 1], ['twice the length', 2], ['half the length', 0.5], ['four times the length', 4]]);
        const answer = round(T0 * Math.sqrt(lf / rf ** 4), 2);
        return { q: R`A torsion pendulum has period ${T0} s. Its wire is replaced by one of the same metal with ${rw} and ${lw}. Find the new period in seconds.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 's', T0, rf, lf,
          sol: R`$C = \pi Gr^4/(2L)$ and $T \propto 1/\sqrt C \propto \sqrt{L/r^4}$. So $T' = ${T0}\times\sqrt{${lf}/${rf}^4} = ${answer}$ s.`,
          trap: 'The torsion constant goes as the fourth power of the radius.' };
      },
      verify: (p) => p.T0 * Math.sqrt(p.lf / p.rf ** 4) },
    { id: 'ela-r4g3', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'own weight',
      make(r) {
        const [mat, rho, Y] = choose(r, [['steel', 7800, 200], ['copper', 8900, 120], ['aluminium', 2700, 70]]), L = pick(r, 50, 400, 50), A = choose(r, [0.5, 1, 2, 4]);
        const answer = round((A * 1e-4 * (rho * g) ** 2 * L ** 3) / (6 * Y * 1e9), 3);
        return { q: R`${mat === 'aluminium' ? 'An' : 'A'} ${mat} cable ($\rho = ${rho}$ kg/m³, $Y = ${Y}$ GPa) ${L} m long with cross-section ${A} cm² hangs from its top end carrying nothing. Find the elastic energy (J) stored in it by its own weight ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.001, answer * 0.01), unit: 'J', rho, Y, L, A,
          sol: R`Stress at height $x$ above the bottom is $\rho gx$, so $U = \int_0^L\dfrac{(\rho gx)^2}{2Y}A\,dx = \dfrac{A\rho^2g^2L^3}{6Y} = ${answer}$ J.`,
          trap: 'The answer is one third (not one half) of weight × stretch.' };
      },
      verify: (p) => (p.A * 1e-4 * (p.rho * g) ** 2 * p.L ** 3) / (6 * p.Y * 1e9) },
  ],
};
