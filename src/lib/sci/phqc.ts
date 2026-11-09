// A state-vector quantum circuit simulator with an OpenQASM 2.0 reader and writer (the qelib1.inc gates,
// custom gate definitions, measure and barrier). Qubit 0 is the least significant bit of a basis-state index, as
// in Qiskit, so |q₂q₁q₀⟩ is printed with q₀ on the right.
import { parse, compile, variables } from './expr.ts';
import { rng } from './phq.ts';

export type Op = { name: string; params: number[]; qubits: number[] };
export type Measure = { q: number; c: number };
export type Circuit = { n: number; ops: Op[]; measures: Measure[]; nc: number; qregs: { name: string; size: number; at: number }[]; cregs: { name: string; size: number; at: number }[] };

type M2 = [number, number, number, number, number, number, number, number]; // a, b, c, d as re, im pairs: [[a, b], [c, d]]
const e = (t: number): [number, number] => [Math.cos(t), Math.sin(t)];
function u3(th: number, ph: number, la: number): M2 {
  const c = Math.cos(th / 2), s = Math.sin(th / 2), el = e(la), ep = e(ph), epl = e(ph + la);
  return [c, 0, -el[0] * s, -el[1] * s, ep[0] * s, ep[1] * s, epl[0] * c, epl[1] * c];
}
const R2 = Math.SQRT1_2;
/** One-qubit gate matrices (exactly as qelib1.inc defines them, including global phases). */
export function oneQubit(name: string, p: number[]): M2 | null {
  switch (name) {
    case 'id': return [1, 0, 0, 0, 0, 0, 1, 0];
    case 'x': return [0, 0, 1, 0, 1, 0, 0, 0];
    case 'y': return [0, 0, 0, -1, 0, 1, 0, 0];
    case 'z': return [1, 0, 0, 0, 0, 0, -1, 0];
    case 'h': return [R2, 0, R2, 0, R2, 0, -R2, 0];
    case 's': return [1, 0, 0, 0, 0, 0, 0, 1];
    case 'sdg': return [1, 0, 0, 0, 0, 0, 0, -1];
    case 't': return [1, 0, 0, 0, 0, 0, R2, R2];
    case 'tdg': return [1, 0, 0, 0, 0, 0, R2, -R2];
    case 'sx': return [0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5];
    case 'sxdg': return [0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5];
    case 'rx': { const c = Math.cos(p[0] / 2), s = Math.sin(p[0] / 2); return [c, 0, 0, -s, 0, -s, c, 0]; }
    case 'ry': { const c = Math.cos(p[0] / 2), s = Math.sin(p[0] / 2); return [c, 0, -s, 0, s, 0, c, 0]; }
    case 'rz': { const a = e(-p[0] / 2), b = e(p[0] / 2); return [a[0], a[1], 0, 0, 0, 0, b[0], b[1]]; }
    case 'u1': case 'p': { const a = e(p[0]); return [1, 0, 0, 0, 0, 0, a[0], a[1]]; }
    case 'u2': return u3(Math.PI / 2, p[0], p[1]);
    case 'u3': case 'u': case 'U': return u3(p[0], p[1], p[2]);
  }
  return null;
}
/** Gates the reader knows: number of parameters and qubits. */
export const GATES: Record<string, [number, number]> = {
  id: [0, 1], x: [0, 1], y: [0, 1], z: [0, 1], h: [0, 1], s: [0, 1], sdg: [0, 1], t: [0, 1], tdg: [0, 1], sx: [0, 1], sxdg: [0, 1],
  rx: [1, 1], ry: [1, 1], rz: [1, 1], u1: [1, 1], p: [1, 1], u2: [2, 1], u3: [3, 1], u: [3, 1], U: [3, 1],
  cx: [0, 2], CX: [0, 2], cy: [0, 2], cz: [0, 2], ch: [0, 2], swap: [0, 2], crx: [1, 2], cry: [1, 2], crz: [1, 2], cu1: [1, 2], cp: [1, 2], cu3: [3, 2], rzz: [1, 2], rxx: [1, 2],
  ccx: [0, 3], cswap: [0, 3],
};

// ---------- State vector ----------
export type State = { n: number; re: Float64Array; im: Float64Array };
export const zeroState = (n: number): State => { const re = new Float64Array(2 ** n); re[0] = 1; return { n, re, im: new Float64Array(2 ** n) }; };

/** Apply a 2×2 matrix to qubit t, only where all control qubits are 1. */
export function applyU(st: State, t: number, U: M2, controls: number[] = []) {
  const { re, im } = st, N = re.length, bt = 1 << t;
  let cm = 0; for (const c of controls) cm |= 1 << c;
  const [ar, ai, br, bi, cr, ci, dr, di] = U;
  for (let i = 0; i < N; i++) {
    if (i & bt || (i & cm) !== cm) continue;
    const j = i | bt, xr = re[i], xi = im[i], yr = re[j], yi = im[j];
    re[i] = ar * xr - ai * xi + br * yr - bi * yi; im[i] = ar * xi + ai * xr + br * yi + bi * yr;
    re[j] = cr * xr - ci * xi + dr * yr - di * yi; im[j] = cr * xi + ci * xr + dr * yi + di * yr;
  }
}
function swap(st: State, a: number, b: number, controls: number[] = []) {
  const { re, im } = st, N = re.length, ba = 1 << a, bb = 1 << b; let cm = 0; for (const c of controls) cm |= 1 << c;
  for (let i = 0; i < N; i++) {
    if ((i & cm) !== cm || !(i & ba) || i & bb) continue;
    const j = (i & ~ba) | bb; let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t;
  }
}
function phase2(st: State, a: number, b: number, th: number) { // rzz: exp(-i th/2 Z⊗Z)
  const { re, im } = st, ba = 1 << a, bb = 1 << b;
  for (let i = 0; i < re.length; i++) { const par = (+!!(i & ba)) ^ (+!!(i & bb)), [c, s] = e(par ? th / 2 : -th / 2), x = re[i], y = im[i]; re[i] = c * x - s * y; im[i] = c * y + s * x; }
}

/** Apply one operation. */
export function applyOp(st: State, op: Op) {
  const { name, params: p, qubits: q } = op;
  const U1 = oneQubit(name, p);
  if (U1) return applyU(st, q[0], U1);
  switch (name) {
    case 'cx': case 'CX': return applyU(st, q[1], oneQubit('x', [])!, [q[0]]);
    case 'cy': return applyU(st, q[1], oneQubit('y', [])!, [q[0]]);
    case 'cz': return applyU(st, q[1], oneQubit('z', [])!, [q[0]]);
    case 'ch': return applyU(st, q[1], oneQubit('h', [])!, [q[0]]);
    case 'crx': return applyU(st, q[1], oneQubit('rx', p)!, [q[0]]);
    case 'cry': return applyU(st, q[1], oneQubit('ry', p)!, [q[0]]);
    case 'crz': return applyU(st, q[1], oneQubit('rz', p)!, [q[0]]);
    case 'cu1': case 'cp': return applyU(st, q[1], oneQubit('u1', p)!, [q[0]]);
    case 'cu3': return applyU(st, q[1], oneQubit('u3', p)!, [q[0]]);
    case 'swap': return swap(st, q[0], q[1]);
    case 'ccx': return applyU(st, q[2], oneQubit('x', [])!, [q[0], q[1]]);
    case 'cswap': return swap(st, q[1], q[2], [q[0]]);
    case 'rzz': return phase2(st, q[0], q[1], p[0]);
    case 'rxx': { const H = oneQubit('h', [])!; applyU(st, q[0], H); applyU(st, q[1], H); phase2(st, q[0], q[1], p[0]); applyU(st, q[0], H); applyU(st, q[1], H); return; }
  }
  throw new Error(`Unknown gate ${name}`);
}

export function run(c: Circuit): State { const st = zeroState(c.n); for (const op of c.ops) applyOp(st, op); return st; }

export const probabilities = (st: State) => Float64Array.from(st.re, (r, i) => r * r + st.im[i] * st.im[i]);

/** Bloch vector of each qubit from its reduced density matrix. */
export function blochVectors(st: State): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let q = 0; q < st.n; q++) {
    const b = 1 << q; let x = 0, y = 0, z = 0;
    for (let i = 0; i < st.re.length; i++) {
      const p = st.re[i] ** 2 + st.im[i] ** 2; z += i & b ? -p : p;
      if (!(i & b)) { const j = i | b; // ⟨i|ρ|j⟩ contributions: conj(a_i) a_j
        const r = st.re[i] * st.re[j] + st.im[i] * st.im[j], m = st.re[i] * st.im[j] - st.im[i] * st.re[j]; x += 2 * r; y += 2 * m; }
    }
    out.push([x, y, z]);
  }
  return out;
}

export const bits = (i: number, n: number) => i.toString(2).padStart(n, '0');

/** Measurement outcomes as classical-register strings (c[n-1] ... c[0]) with exact probabilities, and seeded shots. */
export function outcomes(c: Circuit, st: State, shots = 1024, seed = 7): { probs: Map<string, number>; counts: Map<string, number>; label: string } {
  const P = probabilities(st), probs = new Map<string, number>();
  const ms = c.measures.length ? c.measures : Array.from({ length: c.n }, (_, q) => ({ q, c: q }));
  const nc = c.measures.length ? c.nc : c.n;
  for (let i = 0; i < P.length; i++) {
    if (P[i] < 1e-15) continue;
    const cb = new Array(nc).fill('0');
    for (const m of ms) cb[nc - 1 - m.c] = i & (1 << m.q) ? '1' : '0';
    const k = cb.join(''); probs.set(k, (probs.get(k) ?? 0) + P[i]);
  }
  const keys = [...probs.keys()].sort(), cum: number[] = []; let s = 0;
  for (const k of keys) { s += probs.get(k)!; cum.push(s); }
  const r = rng(seed), counts = new Map<string, number>(keys.map((k) => [k, 0]));
  for (let t = 0; t < shots; t++) { const u = r() * s; let lo = 0; while (lo < cum.length - 1 && cum[lo] < u) lo++; counts.set(keys[lo], counts.get(keys[lo])! + 1); }
  return { probs, counts, label: c.measures.length ? 'classical bits c' : 'qubits (no measure: all of them)' };
}

// ---------- OpenQASM 2 ----------
type Def = { params: string[]; args: string[]; body: { name: string; params: string[]; args: string[] }[] };
export class QasmError extends Error { line: number; constructor(m: string, line: number) { super(`Line ${line}: ${m}`); this.line = line; } }

const evalExpr = (src: string, env: Record<string, number>, line: number) => {
  let tree; try { tree = parse(src.replace(/\bpi\b/g, 'pi')); } catch (e) { throw new QasmError(`cannot read "${src}" (${(e as Error).message})`, line); }
  const names = variables(tree).filter((v) => v !== 'pi' && v !== 'π');
  for (const v of names) if (!(v in env)) throw new QasmError(`unknown parameter "${v}"`, line);
  return compile(tree, names)(names.map((v) => env[v]));
};
/** Split "a, b(c, d), e" at top-level commas. */
const splitTop = (s: string) => { const out: string[] = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; };

export function parseQasm(src: string, maxQubits = 20): Circuit {
  // Remove comments, keep line numbers by tracking statement start lines.
  const text = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const c: Circuit = { n: 0, ops: [], measures: [], nc: 0, qregs: [], cregs: [] };
  const defs = new Map<string, Def>();
  const measured = new Set<number>();
  let i = 0, line = 1, sawHeader = false;
  const lineAt = (k: number) => { let l = 1; for (let j = 0; j < k; j++) if (text[j] === '\n') l++; return l; };
  const qref = (a: string, ln: number): number[] => {
    const m = /^([A-Za-z_]\w*)\s*(?:\[\s*(\d+)\s*\])?$/.exec(a.trim());
    if (!m) throw new QasmError(`"${a}" is not a qubit`, ln);
    const r = c.qregs.find((x) => x.name === m[1]); if (!r) throw new QasmError(`no qreg called "${m[1]}"`, ln);
    if (m[2] === undefined) return Array.from({ length: r.size }, (_, k) => r.at + k);
    const k = +m[2]; if (k >= r.size) throw new QasmError(`${m[1]}[${k}] is outside ${m[1]}[${r.size}]`, ln);
    return [r.at + k];
  };
  const cref = (a: string, ln: number): number[] => {
    const m = /^([A-Za-z_]\w*)\s*(?:\[\s*(\d+)\s*\])?$/.exec(a.trim());
    if (!m) throw new QasmError(`"${a}" is not a classical bit`, ln);
    const r = c.cregs.find((x) => x.name === m[1]); if (!r) throw new QasmError(`no creg called "${m[1]}"`, ln);
    if (m[2] === undefined) return Array.from({ length: r.size }, (_, k) => r.at + k);
    const k = +m[2]; if (k >= r.size) throw new QasmError(`${m[1]}[${k}] is outside ${m[1]}[${r.size}]`, ln);
    return [r.at + k];
  };
  const emit = (name: string, params: number[], qs: number[], ln: number, depth = 0) => {
    if (depth > 20) throw new QasmError('gate definitions call each other too deeply', ln);
    if (new Set(qs).size !== qs.length) throw new QasmError(`${name} uses the same qubit twice`, ln);
    for (const q of qs) if (measured.has(q)) throw new QasmError(`a gate acts on q${q} after it was measured; this simulator measures only at the end`, ln);
    const d = defs.get(name);
    if (d) {
      if (params.length !== d.params.length || qs.length !== d.args.length) throw new QasmError(`${name} takes ${d.params.length} parameters and ${d.args.length} qubits`, ln);
      const env: Record<string, number> = {}; d.params.forEach((p, k) => { env[p] = params[k]; });
      for (const b of d.body) {
        const ps = b.params.map((x) => evalExpr(x, env, ln)), as = b.args.map((a) => { const k = d.args.indexOf(a); if (k < 0) throw new QasmError(`"${a}" is not an argument of ${name}`, ln); return qs[k]; });
        emit(b.name, ps, as, ln, depth + 1);
      }
      return;
    }
    const g = GATES[name];
    if (!g) throw new QasmError(`unknown gate "${name}"`, ln);
    if (params.length !== g[0] || qs.length !== g[1]) throw new QasmError(`${name} takes ${g[0]} parameter${g[0] === 1 ? '' : 's'} and ${g[1]} qubit${g[1] === 1 ? '' : 's'}`, ln);
    c.ops.push({ name: name === 'CX' ? 'cx' : name === 'U' ? 'u' : name, params, qubits: qs });
  };
  while (i < text.length) {
    // Next statement: up to ';' or a gate body '{ ... }'.
    while (i < text.length && /\s/.test(text[i])) i++;
    if (i >= text.length) break;
    line = lineAt(i);
    const rest = text.slice(i);
    const gdef = /^(gate)\s+([A-Za-z_]\w*)\s*(\(([^)]*)\))?\s*([^{]*)\{([^}]*)\}/.exec(rest);
    if (gdef) {
      const params = gdef[4] ? gdef[4].split(',').map((s) => s.trim()).filter(Boolean) : [], args = gdef[5].split(',').map((s) => s.trim()).filter(Boolean);
      const body = gdef[6].split(';').map((s) => s.trim()).filter(Boolean).map((s) => {
        const m = /^([A-Za-z_]\w*)\s*(?:\((.*)\))?\s*(.*)$/s.exec(s);
        if (!m) throw new QasmError(`cannot read "${s}" in gate ${gdef[2]}`, line);
        if (m[1] === 'barrier') return null;
        return { name: m[1], params: m[2] !== undefined ? splitTop(m[2]) : [], args: m[3].split(',').map((x) => x.trim()).filter(Boolean) };
      }).filter((x): x is Def['body'][number] => !!x);
      defs.set(gdef[2], { params, args, body });
      i += gdef[0].length; continue;
    }
    const semi = text.indexOf(';', i);
    if (semi < 0) throw new QasmError('missing ";" at the end of the statement', line);
    const stmt = text.slice(i, semi).trim().replace(/\s+/g, ' ');
    i = semi + 1;
    let m: RegExpExecArray | null;
    if ((m = /^OPENQASM (\d+(\.\d+)?)$/.exec(stmt))) { if (!m[1].startsWith('2')) throw new QasmError(`this reader takes OpenQASM 2, not ${m[1]}`, line); sawHeader = true; continue; }
    if (/^include "[^"]+"$/.test(stmt)) continue;
    if ((m = /^qreg ([A-Za-z_]\w*) ?\[ ?(\d+) ?\]$/.exec(stmt))) {
      const size = +m[2]; if (c.qregs.some((r) => r.name === m![1])) throw new QasmError(`qreg ${m[1]} is declared twice`, line);
      c.qregs.push({ name: m[1], size, at: c.n }); c.n += size;
      if (c.n > maxQubits) throw new QasmError(`${c.n} qubits is more than this simulator's ${maxQubits}`, line);
      continue;
    }
    if ((m = /^creg ([A-Za-z_]\w*) ?\[ ?(\d+) ?\]$/.exec(stmt))) { c.cregs.push({ name: m[1], size: +m[2], at: c.nc }); c.nc += +m[2]; continue; }
    if ((m = /^measure (.+?) ?-> ?(.+)$/.exec(stmt))) {
      const qs = qref(m[1], line), cs = cref(m[2], line);
      if (qs.length !== cs.length) throw new QasmError('measure needs as many classical bits as qubits', line);
      qs.forEach((q, k) => { c.measures = c.measures.filter((x) => x.c !== cs[k]); c.measures.push({ q, c: cs[k] }); measured.add(q); });
      continue;
    }
    if (/^barrier\b/.test(stmt)) continue;
    if (/^(reset|if|opaque)\b/.test(stmt)) throw new QasmError(`"${stmt.split(' ')[0]}" is not supported by this simulator (it keeps one pure state and measures at the end)`, line);
    if ((m = /^([A-Za-z_]\w*) ?(?:\((.*)\))? ?(.*)$/.exec(stmt))) {
      const name = m[1], params = m[2] !== undefined ? splitTop(m[2]).map((x) => evalExpr(x, {}, line)) : [], argsTxt = splitTop(m[3]);
      if (!c.qregs.length) throw new QasmError('declare a qreg before using gates', line);
      if (!argsTxt.length) throw new QasmError(`${name} needs qubits`, line);
      const lists = argsTxt.map((a) => qref(a, line)), len = Math.max(...lists.map((l) => l.length));
      if (lists.some((l) => l.length !== 1 && l.length !== len)) throw new QasmError('registers of different sizes in one gate', line);
      for (let k = 0; k < len; k++) emit(name, params, lists.map((l) => (l.length === 1 ? l[0] : l[k])), line);
      continue;
    }
    throw new QasmError(`cannot read "${stmt}"`, line);
  }
  if (!sawHeader) throw new QasmError('start with "OPENQASM 2.0;"', 1);
  if (!c.n) throw new QasmError('declare at least one qubit with qreg', 1);
  return c;
}

const num = (x: number) => { const k = x / Math.PI; for (const d of [1, 2, 3, 4, 6, 8, 16]) { const t = k * d; if (Math.abs(t - Math.round(t)) < 1e-12 && Math.round(t) !== 0) { const nn = Math.round(t); return `${nn === 1 ? '' : nn === -1 ? '-' : nn + '*'}pi${d === 1 ? '' : '/' + d}`; } } return String(+x.toPrecision(15)); };
/** Write a circuit back as OpenQASM 2.0 with one qreg q and one creg c (custom gates are written expanded). */
export function toQasm(c: Circuit): string {
  const L = ['OPENQASM 2.0;', 'include "qelib1.inc";', `qreg q[${c.n}];`];
  const nc = c.measures.length ? c.nc : 0;
  if (nc) L.push(`creg c[${nc}];`);
  for (const op of c.ops) L.push(`${op.name}${op.params.length ? `(${op.params.map(num).join(',')})` : ''} ${op.qubits.map((q) => `q[${q}]`).join(',')};`);
  for (const m of c.measures) L.push(`measure q[${m.q}] -> c[${m.c}];`);
  return L.join('\n') + '\n';
}

export const EXAMPLE = `OPENQASM 2.0;
include "qelib1.inc";
// A made-up example: a three-qubit GHZ state, then a phase on q[2].
qreg q[3];
creg c[3];
h q[0];
cx q[0],q[1];
cx q[1],q[2];
rz(pi/4) q[2];
measure q -> c;
`;
