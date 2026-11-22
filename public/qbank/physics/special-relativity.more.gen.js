// Extra question shapes for special-relativity (templates srl-t21..t26). Imported by special-relativity.js.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import { msqOf, bisect } from './_more.js';

const c = 2.99792458e8, n4 = (x) => String(+x.toPrecision(4));

export default [
  { id: 'srl-t21', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'spacetime interval',
    make(r) {
      const dt = int(r, 1, 10), dx = r() < 0.15 ? dt : int(r, 0, 10);
      const s2 = dt * dt - dx * dx, kind = s2 > 0 ? 'timelike' : s2 < 0 ? 'spacelike' : 'lightlike';
      const base = `$c^2\\Delta t^2 - \\Delta x^2 = ${dt * dt} - ${dx * dx} = ${s2}$ ly², so the separation is ${kind}.`;
      const cands = [
        ['The separation is timelike', s2 > 0, base],
        ['The separation is spacelike', s2 < 0, base],
        ['One event could have caused the other', s2 >= 0, `${base} A signal at or below light speed can link them only if it is not spacelike.`],
        ['In some inertial frame the two events happen at the same time', s2 < 0, `${base} Only spacelike pairs can be made simultaneous.`],
        ['In some inertial frame the two events happen at the same place', s2 > 0, `${base} Only timelike pairs can be made to happen at one place (the frame of a clock travelling from one to the other).`],
      ];
      if (s2 > 0) cands.push([`A clock moving uniformly from one event to the other records $${round(Math.sqrt(s2), 3)}$ years`, true, `Proper time $= \\sqrt{\\Delta t^2 - \\Delta x^2/c^2} = \\sqrt{${s2}}$ years.`], [`A clock moving uniformly from one event to the other records $${dt}$ years`, false, `That is the coordinate time; the clock records the proper time $\\sqrt{${s2}} = ${round(Math.sqrt(s2), 3)}$ years.`]);
      if (s2 < 0) cands.push([`In the frame where they are simultaneous they are $${round(Math.sqrt(-s2), 3)}$ light-years apart`, true, `Proper distance $= \\sqrt{\\Delta x^2 - c^2\\Delta t^2} = \\sqrt{${-s2}}$ ly.`]);
      if (s2 === 0) cands.push(['A light pulse sent from the earlier event could reach the place of the later one exactly as it happens', true, base]);
      const res = msqOf(r, cands);
      return { q: `In a frame $S$, event B happens ${dt} years after event A and ${dx} light-years away from it (along $x$). Which statements are correct?`, ...res,
        trap: 'Spacelike pairs can have their time order reversed by a change of frame; timelike pairs cannot.' };
    } },
  { id: 'srl-t22', type: 'nat', level: 3, exams: ['jam'], sub: 'energy and momentum', unit: 'MeV/c',
    make(r) {
      const [name, m] = choose(r, [['electron', 0.511], ['muon', 105.7], ['proton', 938.3]]);
      const K = +(m * pick(r, 0.2, 5, 0.1)).toPrecision(3), pc = Math.sqrt(K * K + 2 * K * m);
      return { q: `A${name === 'electron' ? 'n' : ''} ${name} (rest energy ${m} MeV) has kinetic energy ${K} MeV. Its momentum is ______ MeV/$c$ (two decimal places).`,
        answer: round(pc, 2), tol: Math.max(0.01, round(pc * 0.001, 2)), unit: 'MeV/c', K, m,
        sol: `Total energy $E = K + mc^2 = ${round(K + m, 3)}$ MeV. From $E^2 = (pc)^2 + (mc^2)^2$: $pc = \\sqrt{E^2 - (mc^2)^2} = \\sqrt{K^2 + 2Kmc^2} = ${round(pc, 2)}$ MeV.`,
        trap: 'Using $p = \\sqrt{2mK}$ is the low-speed formula; it underestimates $p$ at relativistic energies.' };
    },
    verify: (p) => { const gm = 1 + p.K / p.m, b = Math.sqrt(1 - 1 / (gm * gm)); return gm * b * p.m; } },
  { id: 'srl-t23', type: 'mcq', level: 2, exams: ['jam'], sub: 'energy and momentum', format: 'limiting case',
    make(r) {
      const C = choose(r, [
        ['For $v\\ll c$, the relativistic kinetic energy $(\\gamma - 1)mc^2$ becomes approximately', '$\\tfrac12mv^2$', ['$mc^2$', '$mv^2$', '$0$'], '$\\gamma\\approx 1 + \\tfrac12v^2/c^2$, so $(\\gamma - 1)mc^2\\approx\\tfrac12mv^2$.'],
        ['As the speed of a massive particle approaches $c$, the ratio $pc/E$ approaches', '$1$', ['$0$', '$\\tfrac12$', 'a value that grows without limit'], '$pc/E = v/c\\to 1$ (both $p$ and $E$ grow without limit, but their ratio does not).'],
        ['For $u, v\\ll c$, the relativistic velocity addition $\\dfrac{u + v}{1 + uv/c^2}$ becomes', '$u + v$', ['$uv/c$', '$c$', '$u - v$'], 'The denominator tends to $1$, giving the Galilean $u + v$.'],
        ['For a particle of zero rest mass, $E$ equals', '$pc$', ['$\\tfrac12pc$', '$p^2/2m$', '$0$'], 'Put $m = 0$ in $E^2 = (pc)^2 + (mc^2)^2$.'],
        ['As a rod\'s speed relative to the lab approaches $c$, its length (along the motion) measured in the lab approaches', '$0$', ['its rest length', 'twice its rest length', 'a value that grows without limit'], '$L = L_0/\\gamma\\to 0$ as $\\gamma$ grows without limit.'],
        ['For $\\beta = v/c\\ll1$, the Doppler factor $\\sqrt{(1 + \\beta)/(1 - \\beta)}$ for an approaching source becomes approximately', '$1 + \\beta$', ['$1 + \\beta/2$', '$1 + 2\\beta$', '$1 - \\beta$'], '$\\sqrt{(1 + \\beta)(1 - \\beta)^{-1}}\\approx(1 + \\beta/2)(1 + \\beta/2) \\approx 1 + \\beta$: the classical Doppler shift.'],
      ]);
      const o = mcqOptions(r, C[1], shuffle(r, C[2]));
      return { q: C[0], ...o, sol: C[3], trap: 'Every relativistic formula must reduce to the Newtonian one at low speed; use that to check answers.' };
    } },
  { id: 'srl-t24', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'lorentz transformation',
    make(r) {
      const x = int(r, -8, 10), t = int(r, 1, 10), b = choose(r, [0.3, 0.5, 0.6, 0.8, 0.9]), askT = r() < 0.5;
      const gm = 1 / Math.sqrt(1 - b * b), tp = gm * (t - b * x), xp = gm * (x - b * t), v = askT ? tp : xp;
      return { q: `In frame $S$ an event happens at $x = ${x}$ light-years, $t = ${t}$ years. Frame $S'$ moves at $${b}c$ along $+x$ (origins coinciding at $t = t' = 0$). In $S'$ the event's ${askT ? 'time $t\'$ is ______ years' : 'position $x\'$ is ______ light-years'} (three decimal places).`,
        answer: round(v, 3) + 0, tol: Math.max(0.002, round(Math.abs(v) * 0.001, 3)), x, t, b, askT,
        sol: `$\\gamma = 1/\\sqrt{1 - ${b}^2} = ${round(gm, 4)}$. In units with $c = 1$ (years and light-years): ${askT ? `$t' = \\gamma(t - \\beta x) = ${round(gm, 4)}(${t} - ${b}\\times${x}) = ${round(tp, 3)}$ years.` : `$x' = \\gamma(x - \\beta t) = ${round(gm, 4)}(${x} - ${b}\\times${t}) = ${round(xp, 3)}$ light-years.`}`,
        trap: 'The time transformation mixes in position: $t\' = \\gamma(t - vx/c^2)$, not just $\\gamma t$.' };
    },
    verify: (p) => { const ph = Math.atanh(p.b); return p.askT ? p.t * Math.cosh(ph) - p.x * Math.sinh(ph) : p.x * Math.cosh(ph) - p.t * Math.sinh(ph); } },
  { id: 'srl-t25', type: 'msq', level: 2, exams: ['jam'], sub: 'postulates',
    make(r) {
      const not = r() < 0.5;
      const res = msqOf(r, [
        ['The proper length of a rod is the longest length any inertial observer measures for it', true, 'Every other observer sees it contracted along the motion.'],
        ['The proper time between two events is the shortest time any inertial observer measures between them', true, 'Other observers (in whose frames the events are at different places) measure dilated times.'],
        ['Two events simultaneous in one inertial frame are simultaneous in every inertial frame', false, 'Simultaneity is relative unless the events also happen at the same place.'],
        ['Light in vacuum has the same speed in every inertial frame', true, 'This is the second postulate.'],
        ['A rest mass of 1 kg corresponds to about $9\\times10^{16}$ J', true, '$mc^2 = 1\\times(3\\times10^8)^2$ J.'],
        ['A moving rod is also contracted in the directions perpendicular to its motion', false, 'Lengths perpendicular to the relative velocity are unchanged.'],
        ['A massive body can be accelerated to exactly the speed of light with enough energy', false, 'Its energy $\\gamma mc^2$ would have to be unlimited.'],
        ['The laws of physics take the same form in all inertial frames', true, 'This is the first postulate.'],
      ], { not });
      return { q: `About special relativity, which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'Proper length is the longest, proper time the shortest: students often mix them up.' };
    } },
  { id: 'srl-t26', type: 'nat', level: 3, exams: ['jam'], sub: 'time dilation', format: 'reverse',
    make(r) {
      const [name, tau, tt, tx] = choose(r, [['muon', 2.197e-6, '2.197 $\\mu$s', '2.197\\times10^{-6}'], ['charged pion', 2.6e-8, '26.0 ns', '2.60\\times10^{-8}']]);
      const D = name === 'muon' ? int(r, 1, 20) : int(r, 10, 100), Dm = name === 'muon' ? D * 1e3 : D, X = Dm / (c * tau), gm = Math.sqrt(1 + X * X);
      return { q: `A ${name} has mean proper lifetime ${tt}. For it to travel ${D} ${name === 'muon' ? 'km' : 'm'} in the lab, on average, before decaying, its Lorentz factor $\\gamma$ must be ______ (two decimal places).`,
        answer: round(gm, 2), tol: Math.max(0.01, round(gm * 0.002, 2)), D: Dm, tau,
        sol: `In the lab it lives $\\gamma\\tau$ and moves at $\\beta c$, covering $\\gamma\\beta c\\tau$. So $\\gamma\\beta = \\dfrac{D}{c\\tau} = \\dfrac{${Dm}}{(3.00\\times10^8)(${tx})} = ${round(X, 4)}$. Since $\\gamma^2 = 1 + (\\gamma\\beta)^2$, $\\gamma = \\sqrt{1 + ${round(X * X, 3)}} = ${round(gm, 2)}$.`,
        trap: 'Setting $\\gamma = D/(c\\tau)$ forgets that the speed is $\\beta c$, slightly less than $c$ (it matters when $\\gamma$ is small).' };
    },
    verify: (p) => { const b = bisect((x) => (x / Math.sqrt(1 - x * x)) * c * p.tau - p.D, 0, 1 - 1e-12); return 1 / Math.sqrt(1 - b * b); } },
];
