// The step format of the shared table player (src/lib/tableviz/ from the SQL course). Kept here as a copy
// until that engine is on main; then this file re-exports its types.
export type Cell = string | number | null;
export type VTable = { name: string; cols: string[]; rows: Cell[][] };
export type Step = { kind: string; note: string; [k: string]: unknown };
export type Trace = { title?: string; steps: Step[] };
