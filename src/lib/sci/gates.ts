// Logic gates (school level; Class 12 electronics extension): the seven basic gates, their truth tables and Boolean
// expressions, NOT/AND/OR built only from NAND or only from NOR, and two gates in a row. Pure functions, no DOM.

export type Gate = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
export const GATES: Gate[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];
export type Bit = 0 | 1;

export function gate(g: Gate, a: Bit, b: Bit = 0): Bit {
  switch (g) {
    case 'AND': return (a & b) as Bit;
    case 'OR': return (a | b) as Bit;
    case 'NOT': return (1 - a) as Bit;
    case 'NAND': return (1 - (a & b)) as Bit;
    case 'NOR': return (1 - (a | b)) as Bit;
    case 'XOR': return (a ^ b) as Bit;
    case 'XNOR': return (1 - (a ^ b)) as Bit;
  }
  throw new Error('Unknown gate.');
}

export const inputs = (g: Gate) => (g === 'NOT' ? 1 : 2);

/** Rows [A, B, Y] (or [A, Y] for NOT) in the usual order 00, 01, 10, 11. */
export function truthTable(g: Gate): Bit[][] {
  if (g === 'NOT') return [[0, 1], [1, 0]];
  const rows: Bit[][] = [];
  for (const a of [0, 1] as Bit[]) for (const b of [0, 1] as Bit[]) rows.push([a, b, gate(g, a, b)]);
  return rows;
}

/** Boolean expression with an overbar written as ‾ after the bracket, e.g. Y = (A·B)‾. */
export const EXPR: Record<Gate, string> = { AND: 'Y = A · B', OR: 'Y = A + B', NOT: 'Y = Ā', NAND: 'Y = (A · B)‾', NOR: 'Y = (A + B)‾', XOR: 'Y = A ⊕ B = A·B̄ + Ā·B', XNOR: 'Y = (A ⊕ B)‾' };
/** One plain-English rule for each gate. */
export const RULE: Record<Gate, string> = {
  AND: 'Output is 1 only when both inputs are 1.',
  OR: 'Output is 1 when at least one input is 1.',
  NOT: 'Output is the opposite of the input.',
  NAND: 'NOT AND: output is 0 only when both inputs are 1.',
  NOR: 'NOT OR: output is 1 only when both inputs are 0.',
  XOR: 'Exclusive OR: output is 1 when the inputs are different.',
  XNOR: 'Output is 1 when the inputs are the same.',
};

/** NOT, AND and OR made only from NAND gates (or only from NOR gates). */
export function fromUniversal(u: 'NAND' | 'NOR', target: 'NOT' | 'AND' | 'OR', a: Bit, b: Bit = 0): Bit {
  const G = (x: Bit, y: Bit) => gate(u, x, y), not = (x: Bit) => G(x, x);
  if (target === 'NOT') return not(a);
  if (u === 'NAND') return target === 'AND' ? not(G(a, b)) : G(not(a), not(b));
  return target === 'OR' ? not(G(a, b)) : G(not(a), not(b));
}
/** How many universal gates each construction needs. */
export const COUNT = { NOT: 1, AND: 2, OR: 3 } as const;

/** Two gates in a row: Y = G2(G1(A, B), C). */
export const chain = (g1: Gate, g2: Gate, a: Bit, b: Bit, c: Bit): Bit => gate(g2, gate(g1, a, b), c);

/** Number of rows in a truth table with n inputs. */
export const rows = (n: number) => 2 ** n;
