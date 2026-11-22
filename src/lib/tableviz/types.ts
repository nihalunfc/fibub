// Shared table-animation engine (nihal, 2026-11-22): shows step by step what a query or expression does to
// tables (filter, join, group, aggregate, sort, split, window, reshape ...). Used by the SQL, data modelling,
// Power BI/DAX and pandas courses. Engine-neutral: plain tables in, no SQLite, DAX or Python inside.
// Draw a trace with mountTrace() from ./render.ts; build one from SQL with ./sqltrace.ts.
//
// Row indexes in a step always refer to that step's input table (for join: left and right).

export type Cell = string | number | null;
export type VTable = { name: string; cols: string[]; rows: Cell[][] };

/** note: one plain sentence for the step. label: a short chip name such as "WHERE", "GROUP BY" or "SUMX". */
type Base = { note: string; label?: string };
export type Step = Base & (
  | { kind: 'source'; table: VTable }
  | { kind: 'result'; table: VTable }
  /** Rows tested by a condition: keep[i] says whether input row i stays. why[i] is an optional per-row reason. */
  | { kind: 'filter'; input: VTable; keep: boolean[]; why?: string[]; cond?: string }
  /** pairs: one entry per output row, [left row, right row]; null for the side with no match (outer joins). */
  | { kind: 'join'; left: VTable; right: VTable; how: 'inner' | 'left' | 'right' | 'full' | 'cross'; on: [string, string][]; pairs: [number | null, number | null][]; output: VTable }
  /** A filter on one table flowing across a relationship to another (DAX filter context, semi-joins). */
  | { kind: 'propagate'; from: VTable; to: VTable; on: [string, string]; fromKeep: boolean[]; toKeep: boolean[] }
  /** groupOf[i]: the group number of input row i (0, 1, 2 ... in order of first appearance). */
  | { kind: 'group'; input: VTable; by: string[]; groupOf: number[] }
  /** One output row per group, in group order. */
  | { kind: 'aggregate'; input: VTable; groupOf: number[]; output: VTable; measures: { col: string; fn: string; arg?: string }[] }
  /** Row by row evaluation (SUMX, a running loop): values[i] is the value for input row i; result is the total. */
  | { kind: 'iterate'; input: VTable; expr: string; values: Cell[]; result: Cell; fn?: string }
  /** order: input row indexes in their new order. */
  | { kind: 'sort'; input: VTable; by: string[]; order: number[] }
  | { kind: 'limit'; input: VTable; n: number; offset?: number }
  /** Output columns: from[j] is the input column it copies, or null for a computed one (exprs[col] says how). */
  | { kind: 'project'; input: VTable; output: VTable; from: (string | null)[]; exprs?: Record<string, string> }
  | { kind: 'split'; input: VTable; parts: { label: string; rows: number[] }[] }
  /** order: rows in window order; frames[k] = [first, last] positions (in order) of the frame of order[k]; values[i] is the result for input row i. */
  | { kind: 'window'; input: VTable; col: string; expr?: string; partitionOf: number[]; order: number[]; frames: [number, number][]; values: Cell[] }
  /** from[k] = [input table, row] for output row k. */
  | { kind: 'union'; inputs: VTable[]; output: VTable; from: [number, number][]; op?: string }
  /** Wide to long (melt) or long to wide (pivot): map entries [inRow, inCol, outRow, outCol] move one cell each. */
  | { kind: 'reshape'; input: VTable; output: VTable; mode: 'melt' | 'pivot'; ids: string[]; map: [number, number, number, number][] }
);
export type StepKind = Step['kind'];
export type Trace = { title?: string; steps: Step[]; warn?: string };
