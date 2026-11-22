// Extra question shapes for combinational-logic (templates cl-m31..m35). Imported by combinational-logic.js.
import { choose, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { nt, sci } from './_vary.js';

export default [
  { id: 'cl-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Boolean algebra', format: 'statements',
    make(r) {
      const [A, B, C] = shuffle(r, ['A', 'B', 'C', 'X', 'Y', 'Z', 'P', 'Q']), n = (v) => `\\overline{${v}}`, not = r() < 0.5;
      const m = msqOf(r, [
        [`$${A} + ${A}${B} = ${A}$`, true, `Absorption: $${A}(1 + ${B}) = ${A}$.`],
        [`$${A}(${A} + ${B}) = ${A}$`, true, `$${A}${A} + ${A}${B} = ${A} + ${A}${B} = ${A}$.`],
        [`$${A} + ${n(A)}${B} = ${A} + ${B}$`, true, `$${A} + ${n(A)}${B} = (${A} + ${n(A)})(${A} + ${B}) = ${A} + ${B}$.`],
        [`$${A} + ${n(A)}${B} = ${A}$`, false, `Take $${A} = 0, ${B} = 1$: the left side is 1.`],
        [`$(${A} + ${B})(${A} + ${C}) = ${A} + ${B}${C}$`, true, 'Distribution of + over the product, true in Boolean algebra.'],
        [`$\\overline{${A} + ${B}} = ${n(A)} + ${n(B)}$`, false, `De Morgan gives $${n(A)}\\,${n(B)}$; with $${A} = 1, ${B} = 0$ the two sides differ.`],
        [`$\\overline{${A}${B}} = ${n(A)} + ${n(B)}$`, true, 'De Morgan.'],
        [`$${A}${B} + ${n(A)}${C} + ${B}${C} = ${A}${B} + ${n(A)}${C}$`, true, `Consensus: $${B}${C} = ${B}${C}(${A} + ${n(A)})$ is absorbed by the other two terms.`],
        [`$${A}\\oplus 1 = ${A}$`, false, `XOR with 1 inverts: $${A}\\oplus1 = ${n(A)}$.`],
        [`$${A}\\oplus ${A} = 0$`, true, 'Equal inputs give 0.'],
      ], { not });
      return { q: `Which of the following Boolean identities are ${nt(not, 'valid')}?`, ...m,
        trap: 'Test a doubtful identity with one row of the truth table: one counterexample is enough.' };
    } },
  { id: 'cl-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'universal gates', format: 'match',
    make(r) {
      const L = { not: 'a NOT gate', or: 'an OR gate', and: 'an AND gate', nor: 'a NOR gate', nand: 'a NAND gate', xnor: 'an XNOR gate', buf: 'a plain wire (buffer)' };
      const cas = choose(r, [
        ['a two-input NAND gate with both inputs tied together', 'not', '$\\overline{AA} = \\overline A$.'],
        ['a two-input XOR gate with one input tied to logic 1', 'not', '$A\\oplus1 = \\overline A$.'],
        ['a NAND gate whose two inputs are each first inverted', 'or', '$\\overline{\\overline A\\,\\overline B} = A + B$ by De Morgan.'],
        ['a NOR gate whose two inputs are each first inverted', 'and', '$\\overline{\\overline A + \\overline B} = AB$.'],
        ['an OR gate followed by an inverter', 'nor', 'By definition.'],
        ['an AND gate whose two inputs are each first inverted', 'nor', '$\\overline A\\,\\overline B = \\overline{A + B}$.'],
        ['an XOR gate followed by an inverter', 'xnor', 'By definition: output 1 when the inputs are equal.'],
        ['a two-input XOR gate with one input tied to logic 0', 'buf', '$A\\oplus0 = A$.'],
      ]);
      return { q: `The circuit made from ${cas[0]} is equivalent to`, ...matchOne(r, L, cas),
        trap: 'Inverting the inputs of a gate swaps AND-type and OR-type behaviour (De Morgan).' };
    } },
  { id: 'cl-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'logic families',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['static CMOS draws almost no power when its inputs are not changing', true, 'One of the two networks is always off, so no DC path exists.'],
        ['CMOS dynamic power grows as $fCV_{DD}^2$', true, 'Each transition charges or discharges the load capacitance.'],
        ['ECL is fast because its transistors never saturate', true, 'No stored charge to remove when switching.'],
        ['open-collector (open-drain) outputs can be tied together to give a wired-AND', true, 'Any low output pulls the shared line low.'],
        ['tri-state outputs let several drivers share one bus', true, 'Disabled drivers go to high impedance.'],
        ['CMOS power consumption is independent of switching frequency', false, 'Dynamic power is proportional to the frequency.'],
        ['ECL gets its speed by driving its transistors deep into saturation', false, 'It avoids saturation.'],
        ['two ordinary totem-pole TTL outputs can safely be wired together', false, 'One high and one low output would fight, drawing a large current.'],
      ], not);
      return { q: `Which statement about logic families and outputs is ${nt(not)}?`, ...m,
        trap: 'Only open-collector/open-drain or tri-state outputs may share a line.' };
    } },
  { id: 'cl-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'hazards', format: 'graph in words',
    make(r) {
      const t = choose(r, [2, 5, 10, 20]);
      const L = {
        both: `a high pulse of width ${t} ns at every edge of A`,
        rise: `a high pulse of width ${t} ns at each rising edge of A only`,
        fall: `a high pulse of width ${t} ns at each falling edge of A only`,
        dfall: `a steady 1 with a ${t} ns drop to 0 at each falling edge of A`,
        drise: `a steady 1 with a ${t} ns drop to 0 at each rising edge of A`,
      };
      const D = `A_d`;
      const cas = choose(r, [
        [`A \\oplus ${D}`, 'both', `Right after any edge, A has its new value but $${D}$ still has the old one, so they differ for ${t} ns.`],
        [`A\\cdot\\overline{${D}}`, 'rise', `At a rising edge A = 1 while $${D}$ is still 0, so $\\overline{${D}} = 1$ for ${t} ns. At a falling edge A = 0 at once, so nothing.`],
        [`\\overline A\\cdot ${D}`, 'fall', `At a falling edge A = 0 while $${D}$ is still 1.`],
        [`A + \\overline{${D}}`, 'dfall', `Normally one of A and $\\overline{${D}}$ is 1. After a falling edge A = 0 and $\\overline{${D}}$ is still 0 for ${t} ns.`],
        [`\\overline A + ${D}`, 'drise', `After a rising edge $\\overline A = 0$ and $${D}$ is still 0 for ${t} ns.`],
      ]);
      return { q: `A square wave A drives a gate directly and also through a delay of ${t} ns, giving $${D}$ (A delayed). Ignoring the gate's own delay, the output $Y = ${cas[0]}$ is`, ...matchOne(r, L, cas),
        trap: 'Work through one rising and one falling edge separately: during the delay the delayed copy still holds the old value.' };
    } },
  { id: 'cl-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'CMOS power', format: 'order of magnitude',
    make(r) {
      const N = choose(r, [1e6, 1e7, 1e8]), Cf = choose(r, [0.5, 1, 2]), V = choose(r, [0.8, 1, 1.2]), f = choose(r, [1e8, 1e9, 3e9]), a = choose(r, [0.05, 0.1, 0.2]);
      const x = a * N * Cf * 1e-15 * V * V * f, o = orderOpts(r, x, '\\text{W}');
      return { q: `A CMOS chip has $${sci(N)}$ gates, each switching a load of ${Cf} fF, at $V_{DD} = ${V}$ V and a clock of $${sci(f)}$ Hz. On average a fraction ${a} of the gates switch each cycle. The dynamic power is about`,
        options: o.options, answer: o.answer,
        sol: `$P = \\alpha NCV_{DD}^2f = ${a}\\times${sci(N)}\\times${Cf}\\times10^{-15}\\times${V}^2\\times${sci(f)} = ${sci(x)}$ W.`,
        trap: 'Femto is $10^{-15}$; the voltage enters squared.' };
    } },
];
