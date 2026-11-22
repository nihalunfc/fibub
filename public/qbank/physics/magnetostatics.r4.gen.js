// Round 4 extras for magnetostatics: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round, shuffle, C } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const MU = C.mu0;

export default {
  items: [
    { id: 'mag-r4-01', type: 'mcq', level: 1, exams: A, sub: 'biot-savart: loops',
      q: R`A circular loop carries a steady current. Both the current and the radius of the loop are doubled. The magnetic field at the centre of the loop`,
      options: [R`doubles`, R`stays the same`, R`becomes four times as large`, R`halves`],
      answer: 1,
      sol: R`At the centre $B = \dfrac{\mu_0I}{2R}$. Doubling $I$ doubles $B$; doubling $R$ halves it. The two changes cancel, so $B$ is unchanged.`,
      trap: R`Thinking a bigger loop with more current must give a bigger field: each piece of wire is now twice as far away, and the field of each piece falls as $1/r^2$ while the length of wire only doubles.` },
    { id: 'mag-r4-02', type: 'nat', level: 2, exams: A, sub: 'biot-savart: loops', unit: R`$\mu$T`,
      q: R`Two concentric circular loops lie in the same plane. The inner loop (radius $5.0$ cm) carries $4.0$ A clockwise and the outer loop (radius $10$ cm) carries $6.0$ A anticlockwise. The magnitude of the magnetic field at their common centre is ______ $\mu$T (to one decimal place).`,
      answer: 12.6, tol: 0.1, calc: () => MU / 2 * (4 / 0.05 - 6 / 0.1) * 1e6,
      sol: R`Each loop gives $\mu_0I/2R$ along the axis, in opposite directions here. Inner: $\dfrac{\mu_0(4.0)}{2(0.050)} = \mu_0\times40$ A/m; outer: $\dfrac{\mu_0(6.0)}{2(0.10)} = \mu_0\times30$ A/m. Net $B = \mu_0(40 - 30) = (4\pi\times10^{-7})(10) = 1.26\times10^{-5}$ T $= 12.6\ \mu$T, along the inner loop's axis direction.`,
      trap: R`Adding the two fields ($88\ \mu$T) ignores that opposite circulations give opposite field directions at the centre.` },
    { id: 'mag-r4-03', type: 'mcq', level: 2, exams: A, sub: "ampère's law",
      q: R`Three long straight wires run parallel to the $z$ axis. A closed loop in the $xy$ plane, traversed anticlockwise as seen from $+z$, encircles wire 1 ($3.0$ A along $+z$) and wire 2 ($5.0$ A along $-z$); wire 3 ($2.0$ A along $+z$) lies outside the loop. The value of $\oint\vec B\cdot d\vec l$ around the loop is`,
      options: [R`$+2.5\ \mu$T m`, R`$0$`, R`$-2.5\ \mu$T m`, R`$+12.6\ \mu$T m`],
      answer: 2,
      sol: R`Ampère's law: $\oint\vec B\cdot d\vec l = \mu_0I_{\rm enc}$, where by the right-hand rule an anticlockwise loop (seen from $+z$) counts current along $+z$ as positive. $I_{\rm enc} = 3.0 - 5.0 = -2.0$ A; wire 3 is outside and does not count (its field still acts on the loop, but its line integral round the loop is zero). $\oint\vec B\cdot d\vec l = (4\pi\times10^{-7})(-2.0) = -2.5\times10^{-6}$ T m.`,
      trap: R`Including the outside wire gives $0$; ignoring directions gives $+12.6\ \mu$T m (all three) or $+10.1$ (the two inside).` },
    { id: 'mag-r4-04', type: 'nat', level: 3, exams: A, sub: 'solenoids', unit: 'mT',
      q: R`A solenoid $30$ cm long and $2.0$ cm in radius has $1000$ turns per metre and carries $2.0$ A. The magnetic field on its axis at the centre of one <b>end face</b> is ______ mT (to two decimal places).`,
      answer: 1.25, tol: 0.01, calc: () => MU * 1000 * 2 / 2 * 0.3 / Math.sqrt(0.09 + 0.0004) * 1e3,
      sol: R`On the axis of a finite solenoid $B = \dfrac{\mu_0nI}{2}(\cos\alpha_1 - \cos\alpha_2)$, where the angles are those subtended by the two ends. At one end, that end contributes $\cos90^\circ = 0$ and the far end gives $\cos\alpha = \dfrac{L}{\sqrt{L^2 + R^2}} = \dfrac{30}{\sqrt{904}} = 0.9978$. So $B = \dfrac{(4\pi\times10^{-7})(1000)(2.0)}{2}(0.9978) = 1.25$ mT, almost exactly half the field deep inside ($2.51$ mT).`,
      trap: R`Using $\mu_0nI$ at the end: the field there is only half as big, because one side of the point has no windings.` },
    { id: 'mag-r4-05', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'boundary conditions', format: 'statements',
      q: R`A thin sheet carries a surface current density $\vec K$ (A/m). Comparing the magnetostatic fields just above and just below it, which statements are correct?`,
      options: [R`The tangential component of $\vec B$ perpendicular to $\vec K$ jumps by $\mu_0K$.`, R`The tangential component of $\vec B$ parallel to $\vec K$ jumps by $\mu_0K$.`, R`The vector potential $\vec A$ is continuous across the sheet.`, R`The component of $\vec B$ normal to the sheet is continuous.`],
      answer: [0, 2, 3],
      sol: R`$\nabla\cdot\vec B = 0$ on a thin pillbox gives continuity of $B_\perp$. Ampère's law on a thin rectangle crossing the sheet gives $\vec B_{\rm above} - \vec B_{\rm below} = \mu_0\vec K\times\hat n$: the jump is tangential and at right angles to $\vec K$, so the tangential part parallel to $\vec K$ is continuous. $\vec A$ is continuous because its curl ($\vec B$) is finite; only its normal derivative jumps.`,
      trap: R`The jump in $\vec B$ is along $\vec K\times\hat n$, never along $\vec K$ itself: the field of a current curls round it.` },
    { id: 'mag-r4-06', type: 'mcq', level: 3, exams: A, sub: 'charged particle motion',
      q: R`A proton spirals along a helix in a uniform magnetic field, its velocity making a fixed angle (neither $0^\circ$ nor $90^\circ$) with the field. The field is doubled and the proton is launched with the same velocity. Compared with before,`,
      options: [R`the radius halves and the pitch is unchanged`, R`the radius is unchanged and the pitch halves`, R`the radius halves and the pitch doubles`, R`the radius and the pitch both halve`],
      answer: 3,
      sol: R`The radius is $r = \dfrac{mv_\perp}{qB}$, which halves. The period $T = \dfrac{2\pi m}{qB}$ also halves, and the pitch is the distance moved along the field in one period, $v_\parallel T$, so it halves too. The helix keeps its shape and shrinks by a factor of 2.`,
      trap: R`Thinking the pitch depends only on $v_\parallel$; it also depends on how long one turn takes, which is set by $B$.` },
    { id: 'mag-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'vector potential', unit: R`$\times10^{-4}$ T m`,
      q: R`A long solenoid of radius $1.0$ cm has a uniform field of $0.50$ T inside and (ideally) zero field outside. In the symmetric gauge ($\vec A$ circles the axis, $\nabla\cdot\vec A = 0$), the magnitude of the vector potential $5.0$ cm from the axis, outside the solenoid, is ______ $\times10^{-4}$ T m (to two decimal places).`,
      answer: 5.0, tol: 0.05, calc: () => 0.5 * Math.PI * 0.01 ** 2 / (2 * Math.PI * 0.05) * 1e4,
      sol: R`$\oint\vec A\cdot d\vec l = \Phi_B$ (Stokes' theorem on $\nabla\times\vec A = \vec B$). A circle of radius $s$ outside encloses the whole flux $\Phi = B\pi a^2$, so $A\cdot2\pi s = B\pi a^2$ and $A = \dfrac{Ba^2}{2s} = \dfrac{(0.50)(0.010)^2}{2(0.050)} = 5.0\times10^{-4}$ T m. $\vec A$ is non-zero where $\vec B$ is zero; this is the set-up of the Aharonov-Bohm effect.`,
      trap: R`Concluding $\vec A = 0$ outside because $\vec B = 0$ there: a curl-free $\vec A$ can still circulate round a region that holds flux.` },
    { id: 'mag-r4-08', type: 'mcq', level: 4, exams: A, sub: 'forces between charges',
      q: R`Two protons move side by side along parallel lines, both with the same non-relativistic velocity $\vec v$ perpendicular to the line joining them. The ratio of the magnetic force to the electric force between them is`,
      options: [R`$v^2/c^2$`, R`$v/c$`, R`$c^2/v^2$`, R`$1$`],
      answer: 0,
      sol: R`At separation $d$ the electric force is $\dfrac{q^2}{4\pi\varepsilon_0d^2}$ (repulsive). Each proton makes $B = \dfrac{\mu_0qv}{4\pi d^2}$ at the other, which feels $F_B = qvB = \dfrac{\mu_0q^2v^2}{4\pi d^2}$ (attractive, like parallel currents). Ratio $= \mu_0\varepsilon_0v^2 = v^2/c^2$, tiny for everyday speeds.`,
      trap: R`$\mu_0\varepsilon_0 = 1/c^2$, so the ratio is quadratic in $v/c$; one power of $v$ comes from each proton.` },
    { id: 'mag-r4-09', type: 'msq', level: 3, exams: A, sub: 'divergence of B',
      q: R`Which of these could be a static magnetic field ($k$ is a non-zero constant)?`,
      options: [R`$k(y\,\hat i - x\,\hat j)$`, R`$k(x\,\hat i + y\,\hat j)$`, R`$k(x\,\hat i + y\,\hat j - 2z\,\hat k)$`, R`$k\,x^2\,\hat i$`],
      answer: [0, 2],
      sol: R`Any magnetic field must have $\nabla\cdot\vec B = 0$. First: $\partial_x(ky) + \partial_y(-kx) = 0$, allowed (it is the field inside a uniform axial current, curling round $z$). Second: $k + k = 2k \ne 0$, not allowed. Third: $k + k - 2k = 0$, allowed (it is curl-free, like the field near the centre of a pair of opposing coils). Fourth: $2kx \ne 0$, not allowed.`,
      trap: R`Checking the curl instead of the divergence: a magnetic field may have a curl (where there is current) but never a divergence.` },
    { id: 'mag-r4-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'rotating charges',
      q: R`A uniformly charged solid ball and a uniformly charged thin spherical shell have the same total charge $Q$ and radius $R$ and spin at the same angular speed $\omega$ about a diameter. The field at the centre of the ball divided by the field at the centre of the shell is ______ (to two decimal places).`,
      answer: 1.5, tol: 0.01, calc: () => (1 / 4) / (1 / 6),
      sol: R`A spinning shell of radius $r$ and charge $dq$ has a uniform field inside, $\tfrac23\mu_0\sigma\omega r = \dfrac{\mu_0\omega\,dq}{6\pi r}$. For the thin shell: $B_{\rm shell} = \dfrac{\mu_0\omega Q}{6\pi R}$. For the ball, build it from shells with $dq = \dfrac{3Q}{R^3}r^2dr$: $B_{\rm ball} = \displaystyle\int_0^R\dfrac{\mu_0\omega}{6\pi r}\dfrac{3Q}{R^3}r^2dr = \dfrac{\mu_0\omega Q}{2\pi R^3}\cdot\dfrac{R^2}{2} = \dfrac{\mu_0\omega Q}{4\pi R}$. Ratio $= \dfrac{1/4}{1/6} = 1.5$: the inner charge, though slower, is closer to the centre.`,
      trap: R`Comparing magnetic moments instead (ball $QR^2\omega/5$, shell $QR^2\omega/3$, ratio $0.6$): the moment sets the far field, not the field at the centre.` },
  ],
  gens: [
    { id: 'mag-r4g1', type: 'nat', level: 2, exams: A, sub: 'biot-savart: loops',
      make(r) {
        const R1 = choose(r, [2, 3, 4, 5, 6]), R2 = R1 + choose(r, [2, 4, 5, 8]);
        const I1 = choose(r, [1, 2, 3, 4, 5, 6]), I2 = choose(r, [2, 3, 5, 7, 8, 10]), same = r() < 0.5;
        const B = MU / 2 * Math.abs(I1 / (R1 / 100) + (same ? 1 : -1) * I2 / (R2 / 100)) * 1e6;
        return { q: R`Two concentric circular loops lie in one plane. The inner one (radius $${R1}$ cm) carries $${I1}$ A and the outer one (radius $${R2}$ cm) carries $${I2}$ A, ${same ? 'both clockwise' : 'in opposite senses'}. The field at the common centre is ______ $\mu$T (to two decimal places).`,
          answer: round(B, 2), tol: Math.max(0.02, round(B * 0.01, 2)), unit: R`$\mu$T`, R1, R2, I1, I2, same,
          sol: R`Each loop gives $\mu_0I/2R$ at the centre, along the axis. Inner: $\mu_0(${I1})/(2\times${R1 / 100})$; outer: $\mu_0(${I2})/(2\times${R2 / 100})$. ${same ? 'Same sense, so they add' : 'Opposite senses, so they subtract'}: $B = \dfrac{\mu_0}{2}\left|${round(I1 / (R1 / 100), 2)} ${same ? '+' : '-'} ${round(I2 / (R2 / 100), 2)}\right| = ${round(B, 2)}\ \mu$T.`,
          trap: 'Opposite circulations give opposite field directions at the centre.' };
      },
      verify: (p) => MU / 2 * Math.abs(p.I1 / (p.R1 / 100) + (p.same ? 1 : -1) * p.I2 / (p.R2 / 100)) * 1e6 },
    { id: 'mag-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vector potential',
      make(r) {
        const B = choose(r, [0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1.2]), a = choose(r, [1, 1.5, 2, 2.5, 3]);
        const s = choose(r, [0.5, 0.8, 2, 3, 4, 5, 6]) * a, out = s > a;
        const Av = (out ? B * (a / 100) ** 2 / (2 * s / 100) : B * (s / 100) / 2) * 1e4;
        return { q: R`A long solenoid of radius $${a}$ cm has a uniform field of $${B}$ T inside and zero field outside. With $\vec A$ circling the axis ($\nabla\cdot\vec A = 0$), the magnitude of $\vec A$ at $${round(s, 2)}$ cm from the axis is ______ $\times10^{-4}$ T m (to two decimal places).`,
          answer: round(Av, 2), tol: Math.max(0.01, round(Av * 0.01, 2)), unit: R`$\times10^{-4}$ T m`, B, a, s,
          sol: R`Stokes: $A\cdot2\pi s = $ flux inside the circle of radius $s$. ${out ? R`The circle is outside, so it holds the whole flux $B\pi a^2$: $A = \dfrac{Ba^2}{2s} = \dfrac{${B}\times(${a / 100})^2}{2\times${round(s / 100, 4)}}$` : R`The circle is inside, so it holds $B\pi s^2$: $A = \dfrac{Bs}{2} = \dfrac{${B}\times${round(s / 100, 4)}}{2}$`} $= ${round(Av, 2)}\times10^{-4}$ T m.`,
          trap: 'Outside the solenoid B is zero but A is not; it falls as 1/s.' };
      },
      verify: (p) => (p.s > p.a ? p.B * (p.a / 100) ** 2 / (2 * p.s / 100) : p.B * (p.s / 100) / 2) * 1e4 },
    { id: 'mag-r4g3', type: 'mcq', level: 2, exams: A, sub: "ampère's law",
      make(r) {
        const ws = [1, 2, 3].map(() => ({ I: int(r, 1, 9), up: r() < 0.5 }));
        const inside = shuffle(r, [true, true, false]);
        const signed = (w) => (w.up ? w.I : -w.I);
        const enc = ws.reduce((s, w, i) => s + (inside[i] ? signed(w) : 0), 0);
        const all = ws.reduce((s, w) => s + signed(w), 0);
        const absEnc = ws.reduce((s, w, i) => s + (inside[i] ? w.I : 0), 0);
        const u = MU * 1e6;
        const show = (v) => `$${round(v * u, 2) === 0 ? 0 : round(v * u, 2)}\\ \\mu$T m`;
        const o = mcqOptions(r, enc, [-enc, all, absEnc, enc + 1, enc - 2, enc + 3], show);
        const desc = ws.map((w, i) => `wire ${i + 1} carries $${w.I}$ A along $${w.up ? '+' : '-'}z$ and is ${inside[i] ? 'inside' : 'outside'} the loop`).join('; ');
        return { q: `Three long straight wires run parallel to $z$: ${desc}. A closed loop in the $xy$ plane is traversed anticlockwise as seen from $+z$. Then $\\oint\\vec B\\cdot d\\vec l$ round it equals`, ...o,
          sol: R`Only enclosed current counts, with current along $+z$ positive for an anticlockwise loop (right-hand rule). $I_{\rm enc} = ${enc}$ A, so $\oint\vec B\cdot d\vec l = \mu_0I_{\rm enc} = (1.257\ \mu\text{T m/A})(${enc}\text{ A}) = ${round(enc * u, 2)}\ \mu$T m.`,
          trap: 'The outside wire changes B along the loop but adds nothing to the line integral.' };
      } },
  ],
};
