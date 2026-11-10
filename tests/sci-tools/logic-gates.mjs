// #1432 Logic gates. Truth tables checked against Python's operator module (and_, or_, xor) written out below,
// and every NAND/NOR construction checked against the gate it imitates for all inputs.
import * as G from '../../src/lib/sci/gates.ts';
const PY = { AND: [0, 0, 0, 1], OR: [0, 1, 1, 1], NAND: [1, 1, 1, 0], NOR: [1, 0, 0, 0], XOR: [0, 1, 1, 0], XNOR: [1, 0, 0, 1] };
export default async (check) => {
  for (const [g, ys] of Object.entries(PY)) check(`gates: ${g} truth table`, G.truthTable(g).map((r) => r[2]).join() === ys.join() && G.truthTable(g).map((r) => `${r[0]}${r[1]}`).join() === '00,01,10,11');
  check('gates: NOT', G.truthTable('NOT').join(';') === '0,1;1,0' && G.inputs('NOT') === 1 && G.inputs('XOR') === 2);
  let ok = true;
  for (const u of ['NAND', 'NOR']) for (const t of ['NOT', 'AND', 'OR']) for (const a of [0, 1]) for (const b of [0, 1]) if (G.fromUniversal(u, t, a, b) !== G.gate(t, a, b)) ok = false;
  check('gates: NAND and NOR build NOT, AND and OR', ok);
  check('gates: chain', G.chain('AND', 'OR', 1, 1, 0) === 1 && G.chain('NAND', 'AND', 1, 1, 1) === 0 && G.chain('XOR', 'NOT', 1, 0, 0) === 0);
  check('gates: rows', G.rows(1) === 2 && G.rows(3) === 8);
  check('gates: every gate has a rule and expression', G.GATES.every((g) => G.RULE[g] && G.EXPR[g]));
};
