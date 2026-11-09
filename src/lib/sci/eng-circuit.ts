// A small SPICE-like circuit simulator for linear circuits: resistors, capacitors, inductors and independent
// voltage and current sources, solved by modified nodal analysis (MNA). DC operating point, AC sweep (complex MNA)
// and transient analysis with fixed steps (trapezoidal rule or backward Euler companion models). No DOM.

export type Tran = { kind: 'pulse'; p: number[] } | { kind: 'sin'; p: number[] } | { kind: 'pwl'; p: number[] };
export type Source = { dc: number; acMag: number; acPhase: number; tran?: Tran };
export type Elem = { kind: 'R' | 'C' | 'L' | 'V' | 'I'; name: string; a: string; b: string; value: number; src?: Source; line: number };
export type Netlist = { title: string; elems: Elem[]; nodes: string[]; warnings: string[] };

const SUFFIX: [RegExp, number][] = [[/^meg/i, 1e6], [/^mil/i, 25.4e-6], [/^t/i, 1e12], [/^g/i, 1e9], [/^k/i, 1e3], [/^m/i, 1e-3], [/^(u|µ|μ)/i, 1e-6], [/^n/i, 1e-9], [/^p/i, 1e-12], [/^f/i, 1e-15]];

/** A SPICE value: 4.7k, 10u, 1meg, 2.2µF, 1e-3, 100 (letters after the scale suffix are ignored, as in SPICE). NaN if not a value. */
export function parseValue(s: string): number {
  const m = /^([-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(.*)$/i.exec(s.trim().replace(/[−–]/g, '-'));
  if (!m) return NaN;
  const x = Number(m[1]), rest = m[2];
  if (!rest) return x;
  // "1e3" was taken by the number; a lone "e" etc. after it is a unit letter.
  for (const [re, f] of SUFFIX) if (re.test(rest)) return x * f;
  return /^[a-zΩ°]*$/i.test(rest) ? x : NaN;
}

/** Engineering notation with an SI prefix: 1500 → "1.5 k", 1e-6 → "1 µ". */
export function eng(x: number, unit = '', digits = 4): string {
  if (!Number.isFinite(x)) return '–';
  if (x === 0) return `0 ${unit}`.trim();
  const P = ['f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T'];
  let e = Math.floor(Math.log10(Math.abs(x)) / 3);
  e = Math.max(-5, Math.min(4, e));
  let m = x / 10 ** (3 * e);
  let t = +m.toPrecision(digits);
  if (Math.abs(t) >= 1000 && e < 4) { e++; m = x / 10 ** (3 * e); t = +m.toPrecision(digits); }
  return `${String(t).replace('-', '−')} ${P[e + 5]}${unit}`.trim();
}

function tokens(line: string): string[] {
  // Split on spaces, tabs, commas and '=', but keep "PULSE(" groups as separate tokens.
  return line.replace(/[()]/g, ' $& ').split(/[\s,=]+/).filter(Boolean);
}

function parseSource(tok: string[], ln: number): Source {
  const s: Source = { dc: 0, acMag: 0, acPhase: 0 };
  let i = 0;
  const err = (m: string) => new Error(`Line ${ln}: ${m}`);
  const val = (t: string | undefined, what: string) => { const v = parseValue(t ?? ''); if (!Number.isFinite(v)) throw err(`expected a number for ${what}, found "${t ?? ''}".`); return v; };
  while (i < tok.length) {
    const t = tok[i].toUpperCase();
    if (t === 'DC') { s.dc = val(tok[i + 1], 'DC'); i += 2; }
    else if (t === 'AC') {
      s.acMag = val(tok[i + 1], 'AC magnitude'); i += 2;
      if (i < tok.length && Number.isFinite(parseValue(tok[i]))) { s.acPhase = parseValue(tok[i]); i++; }
    } else if (t === 'PULSE' || t === 'SIN' || t === 'PWL') {
      i++;
      if (tok[i] !== '(') throw err(`write ${t}( ... ) with the values in brackets.`);
      i++;
      const p: number[] = [];
      while (i < tok.length && tok[i] !== ')') { p.push(val(tok[i], t)); i++; }
      if (tok[i] !== ')') throw err(`${t}( is missing its closing bracket.`);
      i++;
      if (t === 'PULSE' && p.length < 2) throw err('PULSE needs at least the low and high values: PULSE(v1 v2 delay rise fall width period).');
      if (t === 'SIN' && p.length < 3) throw err('SIN needs offset, amplitude and frequency: SIN(vo va freq [delay [damping [phase]]]).');
      if (t === 'PWL' && (p.length < 2 || p.length % 2)) throw err('PWL needs time-value pairs: PWL(t1 v1 t2 v2 ...).');
      if (t === 'PWL') for (let k = 2; k < p.length; k += 2) if (!(p[k] >= p[k - 2])) throw err('PWL times must not go backwards.');
      s.tran = { kind: t.toLowerCase() as Tran['kind'], p };
      if (t === 'PULSE') s.dc = s.dc || 0;
    } else if (Number.isFinite(parseValue(tok[i])) && i === 0) { s.dc = parseValue(tok[i]); i++; }
    else throw err(`did not understand "${tok[i]}". Use DC v, AC mag [phase], PULSE(...), SIN(...) or PWL(...).`);
  }
  return s;
}

/** Read a SPICE-style netlist. Ground is node 0 (or gnd). Throws an Error with the line number on mistakes. */
export function parseNetlist(text: string): Netlist {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const elems: Elem[] = [], warnings: string[] = [], names = new Set<string>();
  let title = '';
  const dots: string[] = [];
  lines.forEach((raw, k) => {
    const ln = k + 1;
    let line = raw.replace(/;.*$/, '').replace(/\t/g, ' ').trim();
    if (!line) return;
    if (line.startsWith('*')) { if (!title && !elems.length) title = line.replace(/^\*+\s*/, ''); return; }
    if (line.startsWith('.')) { if (!/^\.end\b/i.test(line)) dots.push(line.split(/\s+/)[0]); return; }
    if (line.startsWith('+')) throw new Error(`Line ${ln}: continuation lines (+) are not supported; put the element on one line.`);
    line = line.replace(/\s+/g, ' ');
    const tok = tokens(line);
    const name = tok[0], kind = name[0].toUpperCase();
    if (!'RCLVI'.includes(kind)) throw new Error(`Line ${ln}: "${name}" is not a known element. Names start with R, C, L, V or I (other SPICE parts such as diodes and transistors are not supported).`);
    if (names.has(name.toUpperCase())) throw new Error(`Line ${ln}: the name ${name} is used twice.`);
    names.add(name.toUpperCase());
    if (tok.length < 4 && (kind === 'R' || kind === 'C' || kind === 'L')) throw new Error(`Line ${ln}: write ${name} node1 node2 value.`);
    if (tok.length < 3) throw new Error(`Line ${ln}: write ${name} node+ node− and the source value.`);
    const norm = (n: string) => (/^(0|gnd|ground)$/i.test(n) ? '0' : n);
    const a = norm(tok[1]), b = norm(tok[2]);
    if (a === b) warnings.push(`${name} has both ends on node ${a}, so it does nothing.`);
    if (kind === 'V' || kind === 'I') {
      const src = parseSource(tok.slice(3), ln);
      elems.push({ kind, name, a, b, value: src.dc, src, line: ln });
    } else {
      const v = parseValue(tok[3]);
      if (!Number.isFinite(v)) throw new Error(`Line ${ln}: "${tok[3]}" is not a value. Use numbers such as 4.7k, 100n or 2.2e-6.`);
      if (!(v > 0)) throw new Error(`Line ${ln}: ${name} must have a value above zero.`);
      if (tok.length > 4 && !/^ic$/i.test(tok[4])) warnings.push(`Line ${ln}: extra words after the value of ${name} were ignored.`);
      elems.push({ kind: kind as Elem['kind'], name, a, b, value: v, line: ln });
    }
  });
  if (!elems.length) throw new Error('The netlist has no elements. Each line is one part, for example: R1 in out 1k');
  const nodes = [...new Set(elems.flatMap((e) => [e.a, e.b]))].filter((n) => n !== '0');
  if (!elems.some((e) => e.a === '0' || e.b === '0')) throw new Error('Nothing connects to ground. Name the ground node 0 (or gnd).');
  if (dots.length) warnings.push(`Lines starting with a dot (${[...new Set(dots)].join(', ')}) are not read; choose the analysis below.`);
  // Nodes with only one connection.
  const count = new Map<string, number>();
  for (const e of elems) for (const n of [e.a, e.b]) count.set(n, (count.get(n) ?? 0) + 1);
  for (const n of nodes) if (count.get(n) === 1) warnings.push(`Node ${n} has only one part connected to it.`);
  return { title, elems, nodes, warnings };
}

type Topo = { idx: Map<string, number>; n: number; br: Map<string, number>; size: number };
function topo(nl: Netlist, inductorBranch: boolean): Topo {
  const idx = new Map<string, number>();
  nl.nodes.forEach((n, i) => idx.set(n, i));
  const br = new Map<string, number>();
  let k = nl.nodes.length;
  for (const e of nl.elems) if (e.kind === 'V' || (e.kind === 'L' && inductorBranch)) br.set(e.name, k++);
  return { idx, n: nl.nodes.length, br, size: k };
}

/** Problems that make the circuit unsolvable: loops of voltage sources (and inductors at DC), and nodes with no DC path to ground. */
export function checkTopology(nl: Netlist): { loops: string[]; floating: string[] } {
  const loops: string[] = [];
  const parent = new Map<string, string>();
  const find = (x: string): string => { while (parent.get(x) !== undefined && parent.get(x) !== x) x = parent.get(x)!; return x; };
  for (const n of ['0', ...nl.nodes]) parent.set(n, n);
  for (const e of nl.elems) if (e.kind === 'V' || e.kind === 'L') {
    const ra = find(e.a), rb = find(e.b);
    if (ra === rb) loops.push(e.name); else parent.set(ra, rb);
  }
  // DC path to ground through R, L and V.
  const adj = new Map<string, string[]>();
  for (const e of nl.elems) if (e.kind === 'R' || e.kind === 'L' || e.kind === 'V') { (adj.get(e.a) ?? adj.set(e.a, []).get(e.a)!).push(e.b); (adj.get(e.b) ?? adj.set(e.b, []).get(e.b)!).push(e.a); }
  const seen = new Set(['0']), stack = ['0'];
  while (stack.length) for (const m of adj.get(stack.pop()!) ?? []) if (!seen.has(m)) { seen.add(m); stack.push(m); }
  return { loops, floating: nl.nodes.filter((n) => !seen.has(n)) };
}

/** Value of a source at time t (SPICE PULSE, SIN and PWL conventions; DC before and without them). */
export function srcAt(s: Source, t: number, tstep = 0, tstop = 0): number {
  const tr = s.tran;
  if (!tr) return s.dc;
  const p = tr.p;
  if (tr.kind === 'pulse') {
    const [v1, v2] = p;
    const td = p[2] ?? 0, trise = p[3] || tstep || 1e-12, tfall = p[4] || tstep || 1e-12, pw = p[5] ?? (tstop || Infinity), per = p[6] || Infinity;
    if (t < td) return v1;
    let u = t - td;
    if (Number.isFinite(per)) u = u % per;
    if (u < trise) return v1 + ((v2 - v1) * u) / trise;
    if (u < trise + pw) return v2;
    if (u < trise + pw + tfall) return v2 + ((v1 - v2) * (u - trise - pw)) / tfall;
    return v1;
  }
  if (tr.kind === 'sin') {
    const [vo, va, f] = p;
    const td = p[3] ?? 0, theta = p[4] ?? 0, ph = p[5] ?? 0;
    if (t < td) return vo + va * Math.sin((Math.PI * ph) / 180);
    return vo + va * Math.exp(-(t - td) * theta) * Math.sin(2 * Math.PI * f * (t - td) + (Math.PI * ph) / 180);
  }
  // PWL
  if (t <= p[0]) return p[1];
  for (let k = 2; k < p.length; k += 2) if (t <= p[k]) { const t0 = p[k - 2], v0 = p[k - 1], t1 = p[k], v1 = p[k + 1]; return t1 === t0 ? v1 : v0 + ((v1 - v0) * (t - t0)) / (t1 - t0); }
  return p[p.length - 1];
}

// Dense LU with partial pivoting (real), factor once, solve many times.
type LU = { a: Float64Array; piv: Int32Array; n: number };
function luFactor(A: Float64Array, n: number): LU | null {
  const a = A.slice(), piv = new Int32Array(n);
  let big = 0;
  for (let i = 0; i < n * n; i++) big = Math.max(big, Math.abs(a[i]));
  const tol = big * 1e-13;
  for (let k = 0; k < n; k++) {
    let p = k, m = Math.abs(a[k * n + k]);
    for (let i = k + 1; i < n; i++) { const v = Math.abs(a[i * n + k]); if (v > m) { m = v; p = i; } }
    if (!(m > tol)) return null;
    piv[k] = p;
    if (p !== k) for (let j = 0; j < n; j++) { const t = a[k * n + j]; a[k * n + j] = a[p * n + j]; a[p * n + j] = t; }
    const d = a[k * n + k];
    for (let i = k + 1; i < n; i++) {
      const f = (a[i * n + k] /= d);
      if (f !== 0) for (let j = k + 1; j < n; j++) a[i * n + j] -= f * a[k * n + j];
    }
  }
  return { a, piv, n };
}
function luSolve(L: LU, b: Float64Array): Float64Array {
  const { a, piv, n } = L, x = b.slice();
  for (let k = 0; k < n; k++) { const p = piv[k]; if (p !== k) { const t = x[k]; x[k] = x[p]; x[p] = t; } }
  for (let i = 0; i < n; i++) { let s = x[i]; for (let j = 0; j < i; j++) s -= a[i * n + j] * x[j]; x[i] = s; }
  for (let i = n - 1; i >= 0; i--) { let s = x[i]; for (let j = i + 1; j < n; j++) s -= a[i * n + j] * x[j]; x[i] = s / a[i * n + i]; }
  return x;
}
// Complex Gaussian elimination with partial pivoting.
function csolve(re: Float64Array, im: Float64Array, br: Float64Array, bi: Float64Array, n: number): [Float64Array, Float64Array] | null {
  let big = 0;
  for (let i = 0; i < n * n; i++) big = Math.max(big, Math.hypot(re[i], im[i]));
  const tol = big * 1e-13;
  for (let k = 0; k < n; k++) {
    let p = k, m = Math.hypot(re[k * n + k], im[k * n + k]);
    for (let i = k + 1; i < n; i++) { const v = Math.hypot(re[i * n + k], im[i * n + k]); if (v > m) { m = v; p = i; } }
    if (!(m > tol)) return null;
    if (p !== k) {
      for (let j = 0; j < n; j++) { let t = re[k * n + j]; re[k * n + j] = re[p * n + j]; re[p * n + j] = t; t = im[k * n + j]; im[k * n + j] = im[p * n + j]; im[p * n + j] = t; }
      let t = br[k]; br[k] = br[p]; br[p] = t; t = bi[k]; bi[k] = bi[p]; bi[p] = t;
    }
    const dr = re[k * n + k], di = im[k * n + k], dd = dr * dr + di * di;
    for (let i = k + 1; i < n; i++) {
      const ar = re[i * n + k], ai = im[i * n + k];
      if (ar === 0 && ai === 0) continue;
      const fr = (ar * dr + ai * di) / dd, fi = (ai * dr - ar * di) / dd;
      for (let j = k; j < n; j++) { const xr = re[k * n + j], xi = im[k * n + j]; re[i * n + j] -= fr * xr - fi * xi; im[i * n + j] -= fr * xi + fi * xr; }
      br[i] -= fr * br[k] - fi * bi[k]; bi[i] -= fr * bi[k] + fi * br[k];
    }
  }
  const xr = new Float64Array(n), xi = new Float64Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let sr = br[i], si = bi[i];
    for (let j = i + 1; j < n; j++) { sr -= re[i * n + j] * xr[j] - im[i * n + j] * xi[j]; si -= re[i * n + j] * xi[j] + im[i * n + j] * xr[j]; }
    const dr = re[i * n + i], di = im[i * n + i], dd = dr * dr + di * di;
    xr[i] = (sr * dr + si * di) / dd; xi[i] = (si * dr - sr * di) / dd;
  }
  return [xr, xi];
}

function fail(nl: Netlist, dc: boolean): never {
  const t = checkTopology(nl);
  if (t.loops.length) throw new Error(`${t.loops.join(', ')} closes a loop of voltage sources${dc ? ' and inductors (an inductor is a short circuit at DC)' : ''}; the current in it cannot be worked out. Add a small resistor in the loop.`);
  throw new Error('The circuit cannot be solved: some part of it is not tied down. Check that every node connects to ground through some path.');
}

const GMIN_NOTE = (f: string[]) => `No DC path to ground at ${f.join(', ')} (only capacitors or current sources), so a tiny leak to ground sets its DC level, as SPICE does with GMIN.`;

export type OpResult = { v: Record<string, number>; elems: { name: string; kind: Elem['kind']; v: number; i: number; p: number }[]; notes: string[] };

/**
 * DC operating point. Capacitors are open, inductors short circuits. Element current i flows from the first node
 * to the second through the part (SPICE convention: a source delivering power has negative i). p = v × i is the power
 * absorbed (negative for a source delivering power).
 */
export function dcOp(nl: Netlist, t = 0, srcValue: (s: Source) => number = (s) => s.dc): OpResult {
  const T = topo(nl, true), N = T.size, A = new Float64Array(N * N), b = new Float64Array(N);
  const id = (n: string) => (n === '0' ? -1 : T.idx.get(n)!);
  const add = (i: number, j: number, v: number) => { if (i >= 0 && j >= 0) A[i * N + j] += v; };
  let big = 0;
  for (const e of nl.elems) if (e.kind === 'R') big = Math.max(big, 1 / e.value);
  const notes: string[] = [];
  const { floating } = checkTopology(nl);
  const gmin = Math.max(1e-12, big * 1e-9);
  for (const n of floating) add(id(n), id(n), gmin);
  if (floating.length) notes.push(GMIN_NOTE(floating));
  for (const e of nl.elems) {
    const a = id(e.a), c = id(e.b);
    if (e.kind === 'R') { const g = 1 / e.value; add(a, a, g); add(c, c, g); add(a, c, -g); add(c, a, -g); }
    else if (e.kind === 'V' || e.kind === 'L') {
      const k = T.br.get(e.name)!;
      add(a, k, 1); add(c, k, -1); add(k, a, 1); add(k, c, -1);
      if (e.kind === 'V') b[k] = srcValue(e.src!);
    } else if (e.kind === 'I') { const I = srcValue(e.src!); if (a >= 0) b[a] -= I; if (c >= 0) b[c] += I; }
  }
  void t;
  const L = luFactor(A, N);
  if (!L) fail(nl, true);
  const x = luSolve(L, b);
  const v: Record<string, number> = { '0': 0 };
  nl.nodes.forEach((n, i) => (v[n] = x[i]));
  const elems = nl.elems.map((e) => {
    const vd = v[e.a] - v[e.b];
    const i = e.kind === 'R' ? vd / e.value : e.kind === 'C' ? 0 : e.kind === 'I' ? srcValue(e.src!) : x[T.br.get(e.name)!];
    return { name: e.name, kind: e.kind, v: vd, i, p: vd * i };
  });
  return { v, elems, notes };
}

/** Log-spaced frequencies from f1 to f2 with n points per decade (both ends included). */
export function logFreqs(f1: number, f2: number, perDecade: number): number[] {
  const dec = Math.log10(f2 / f1), n = Math.max(1, Math.round(dec * perDecade)), out: number[] = [];
  for (let i = 0; i <= n; i++) out.push(f1 * 10 ** ((dec * i) / n));
  return out;
}

export type AcResult = { f: number[]; re: Record<string, Float64Array>; im: Record<string, Float64Array> };

/** AC small-signal sweep. Every source contributes its AC magnitude and phase (degrees); DC values are ignored. */
export function acSweep(nl: Netlist, freqs: number[]): AcResult {
  if (!nl.elems.some((e) => e.src && e.src.acMag !== 0)) throw new Error('No source has an AC value, so every AC voltage is zero. Add AC 1 to the input source, for example: V1 in 0 DC 0 AC 1');
  const T = topo(nl, true), N = T.size;
  const id = (n: string) => (n === '0' ? -1 : T.idx.get(n)!);
  const re: Record<string, Float64Array> = {}, im: Record<string, Float64Array> = {};
  for (const n of nl.nodes) { re[n] = new Float64Array(freqs.length); im[n] = new Float64Array(freqs.length); }
  freqs.forEach((f, fi) => {
    const w = 2 * Math.PI * f, Ar = new Float64Array(N * N), Ai = new Float64Array(N * N), br = new Float64Array(N), bi = new Float64Array(N);
    const add = (i: number, j: number, r: number, m: number) => { if (i >= 0 && j >= 0) { Ar[i * N + j] += r; Ai[i * N + j] += m; } };
    const y = (a: number, c: number, r: number, m: number) => { add(a, a, r, m); add(c, c, r, m); add(a, c, -r, -m); add(c, a, -r, -m); };
    for (const e of nl.elems) {
      const a = id(e.a), c = id(e.b);
      if (e.kind === 'R') y(a, c, 1 / e.value, 0);
      else if (e.kind === 'C') y(a, c, 0, w * e.value);
      else if (e.kind === 'L' || e.kind === 'V') {
        const k = T.br.get(e.name)!;
        add(a, k, 1, 0); add(c, k, -1, 0); add(k, a, 1, 0); add(k, c, -1, 0);
        if (e.kind === 'L') add(k, k, 0, -w * e.value);
        else { const ph = (e.src!.acPhase * Math.PI) / 180; br[k] = e.src!.acMag * Math.cos(ph); bi[k] = e.src!.acMag * Math.sin(ph); }
      } else if (e.kind === 'I') {
        const ph = (e.src!.acPhase * Math.PI) / 180, Ir = e.src!.acMag * Math.cos(ph), Ii = e.src!.acMag * Math.sin(ph);
        if (a >= 0) { br[a] -= Ir; bi[a] -= Ii; }
        if (c >= 0) { br[c] += Ir; bi[c] += Ii; }
      }
    }
    // Tiny leak on every node so a node tied only through an inductor-capacitor pair at exact resonance still solves.
    const sol = csolve(Ar, Ai, br, bi, N);
    if (!sol) fail(nl, false);
    nl.nodes.forEach((n, i) => { re[n][fi] = sol[0][i]; im[n][fi] = sol[1][i]; });
  });
  return { f: freqs, re, im };
}

/** Magnitude in dB and phase in degrees (unwrapped along the sweep) of a node's AC voltage, or of V(p) − V(m). */
export function bode(r: AcResult, p: string, m = '0'): { mag: number[]; db: number[]; phase: number[] } {
  const z = new Float64Array(r.f.length);
  const R = (n: string) => (n === '0' ? z : r.re[n]), I = (n: string) => (n === '0' ? z : r.im[n]);
  const mag: number[] = [], db: number[] = [], phase: number[] = [];
  let prev = NaN;
  r.f.forEach((_, i) => {
    const x = R(p)[i] - R(m)[i], y = I(p)[i] - I(m)[i], a = Math.hypot(x, y);
    mag.push(a); db.push(20 * Math.log10(a));
    let ph = (Math.atan2(y, x) * 180) / Math.PI;
    if (Number.isFinite(prev)) { while (ph - prev > 180) ph -= 360; while (ph - prev < -180) ph += 360; }
    phase.push(ph); prev = ph;
  });
  return { mag, db, phase };
}

/** Frequencies (interpolated in log f) where the dB curve crosses a level. */
export function crossings(f: number[], db: number[], level: number, nl?: Netlist, p?: string): number[] {
  const out: number[] = [];
  for (let i = 1; i < f.length; i++) {
    const a = db[i - 1] - level, b = db[i] - level;
    if (a === 0) out.push(f[i - 1]);
    else if (a * b < 0) {
      if (nl && p) out.push(refineCrossing(nl, p, f[i - 1], f[i], level));
      else { const u = a / (a - b); out.push(10 ** (Math.log10(f[i - 1]) + u * (Math.log10(f[i]) - Math.log10(f[i - 1])))); }
    }
  }
  return out;
}

/** Narrow a crossing of the dB level at node p between f1 and f2 (which bracket it) by bisection in log f. */
export function refineCrossing(nl: Netlist, p: string, f1: number, f2: number, level: number): number {
  const g = (f: number) => bode(acSweep(nl, [f]), p).db[0] - level;
  let a = Math.log10(f1), b = Math.log10(f2), ga = g(f1);
  for (let k = 0; k < 50; k++) { const m = (a + b) / 2, gm = g(10 ** m); if (gm === 0) return 10 ** m; if ((gm < 0) === (ga < 0)) { a = m; ga = gm; } else b = m; }
  return 10 ** ((a + b) / 2);
}

/** The highest gain at node p between f1 and f2 (around a peak found on the sweep grid), by golden-section search in log f. */
export function refinePeak(nl: Netlist, p: string, f1: number, f2: number): { f: number; db: number } {
  const g = (x: number) => bode(acSweep(nl, [10 ** x]), p).db[0], r = (Math.sqrt(5) - 1) / 2;
  let a = Math.log10(f1), b = Math.log10(f2), c = b - r * (b - a), d = a + r * (b - a), gc = g(c), gd = g(d);
  for (let k = 0; k < 60; k++) { if (gc > gd) { b = d; d = c; gd = gc; c = b - r * (b - a); gc = g(c); } else { a = c; c = d; gc = gd; d = a + r * (b - a); gd = g(d); } }
  const x = (a + b) / 2;
  return { f: 10 ** x, db: g(x) };
}

export type TranResult = { t: number[]; v: Record<string, Float64Array>; i: Record<string, Float64Array>; notes: string[] };

/**
 * Transient analysis with a fixed time step h from 0 to tstop. Starts from the DC operating point with every source
 * at its t = 0 value (capacitors charged, inductor currents flowing). method 'trap' (trapezoidal rule, second order)
 * or 'be' (backward Euler, first order, no ringing on sudden steps). i holds every element's current (first node to
 * second through the part).
 */
export function transient(nl: Netlist, h: number, tstop: number, method: 'trap' | 'be' = 'trap'): TranResult {
  if (!(h > 0 && tstop > 0)) throw new Error('Give a time step and stop time above zero.');
  const steps = Math.round(tstop / h);
  if (steps > 200000) throw new Error(`That is ${steps.toLocaleString('en')} time steps; the limit is 200,000. Use a larger step or a shorter stop time.`);
  if (steps < 2) throw new Error('The stop time must be at least two time steps.');
  const at = (s: Source, t: number) => srcAt(s, t, h, tstop);
  const op = dcOp(nl, 0, (s) => at(s, 0));
  const T = topo(nl, true), N = T.size, A = new Float64Array(N * N);
  const id = (n: string) => (n === '0' ? -1 : T.idx.get(n)!);
  const add = (i: number, j: number, v: number) => { if (i >= 0 && j >= 0) A[i * N + j] += v; };
  const k2 = method === 'trap' ? 2 : 1;
  for (const e of nl.elems) {
    const a = id(e.a), c = id(e.b);
    if (e.kind === 'R' || e.kind === 'C') { const g = e.kind === 'R' ? 1 / e.value : (k2 * e.value) / h; add(a, a, g); add(c, c, g); add(a, c, -g); add(c, a, -g); }
    else if (e.kind === 'V' || e.kind === 'L') {
      const k = T.br.get(e.name)!;
      add(a, k, 1); add(c, k, -1); add(k, a, 1); add(k, c, -1);
      if (e.kind === 'L') add(k, k, -(k2 * e.value) / h);
    }
  }
  // Nodes with no DC path still get the same tiny leak as the operating point, so the matrices match.
  const { floating } = checkTopology(nl);
  let big = 0;
  for (const e of nl.elems) if (e.kind === 'R') big = Math.max(big, 1 / e.value);
  for (const n of floating) add(id(n), id(n), Math.max(1e-12, big * 1e-9));
  const LUf = luFactor(A, N);
  if (!LUf) fail(nl, false);
  const t: number[] = [], v: Record<string, Float64Array> = {}, cur: Record<string, Float64Array> = {};
  for (const n of nl.nodes) v[n] = new Float64Array(steps + 1);
  for (const e of nl.elems) cur[e.name] = new Float64Array(steps + 1);
  t.push(0);
  nl.nodes.forEach((n) => (v[n][0] = op.v[n]));
  op.elems.forEach((e) => (cur[e.name][0] = e.i));
  const vd = (e: Elem, s: number) => (e.a === '0' ? 0 : v[e.a][s]) - (e.b === '0' ? 0 : v[e.b][s]);
  for (let s = 1; s <= steps; s++) {
    const tn = s * h, b = new Float64Array(N);
    for (const e of nl.elems) {
      const a = id(e.a), c = id(e.b);
      if (e.kind === 'C') {
        const g = (k2 * e.value) / h, Ieq = g * vd(e, s - 1) + (method === 'trap' ? cur[e.name][s - 1] : 0);
        if (a >= 0) b[a] += Ieq; if (c >= 0) b[c] -= Ieq;
      } else if (e.kind === 'L') {
        const r = (k2 * e.value) / h, k = T.br.get(e.name)!;
        b[k] = -r * cur[e.name][s - 1] - (method === 'trap' ? vd(e, s - 1) : 0);
      } else if (e.kind === 'V') b[T.br.get(e.name)!] = at(e.src!, tn);
      else if (e.kind === 'I') { const I = at(e.src!, tn); if (a >= 0) b[a] -= I; if (c >= 0) b[c] += I; }
    }
    const x = luSolve(LUf, b);
    t.push(tn);
    nl.nodes.forEach((n, i) => (v[n][s] = x[i]));
    for (const e of nl.elems) {
      const d = vd(e, s);
      cur[e.name][s] = e.kind === 'R' ? d / e.value
        : e.kind === 'C' ? (method === 'trap' ? ((2 * e.value) / h) * (d - vd(e, s - 1)) - cur[e.name][s - 1] : (e.value / h) * (d - vd(e, s - 1)))
        : e.kind === 'I' ? at(e.src!, tn) : x[T.br.get(e.name)!];
    }
  }
  return { t, v, i: cur, notes: op.notes };
}

/** The made-up example circuits offered on the page. */
export const EXAMPLES: Record<string, { name: string; text: string; analysis: 'op' | 'ac' | 'tran'; probe: string; ac: [number, number, number]; tran: [number, number] }> = {
  rc: {
    name: 'RC low-pass filter (1 kΩ, 1 µF)',
    text: '* RC low-pass filter: corner 1/(2πRC) = 159 Hz, time constant RC = 1 ms\nV1 in 0 DC 0 AC 1 PULSE(0 1 0 1u 1u 5m 10m)\nR1 in out 1k\nC1 out 0 1u\n',
    analysis: 'ac', probe: 'out', ac: [1, 100e3, 20], tran: [10e-6, 10e-3],
  },
  rlc: {
    name: 'Series RLC band-pass (resonance near 1.6 kHz)',
    text: '* Series RLC: resonance 1/(2π√(LC)) = 1.59 kHz, Q = √(L/C)/R = 10\nV1 in 0 AC 1 PULSE(0 1 0 1u 1u 1 2)\nL1 in a 10m\nC1 a out 1u\nR1 out 0 10\n',
    analysis: 'tran', probe: 'out', ac: [100, 100e3, 50], tran: [1e-6, 5e-3],
  },
  divider: {
    name: 'Divider and bridge at DC',
    text: '* A 12 V supply, a 2:1 divider and a Wheatstone bridge, plus a 1 mA current source\nV1 vcc 0 DC 12\nR1 vcc a 10k\nR2 a 0 4.7k\nR3 vcc b 6.8k\nR4 b 0 3.3k\nR5 a b 22k\nI1 0 b DC 1m\n',
    analysis: 'op', probe: 'a', ac: [1, 1e6, 10], tran: [1e-6, 1e-3],
  },
  rl: {
    name: 'RL high-pass driven by a 1 kHz sine',
    text: '* RL high-pass: corner R/(2πL) = 1.59 kHz\nV1 in 0 AC 1 SIN(0 1 1k)\nR1 in out 100\nL1 out 0 10m\n',
    analysis: 'tran', probe: 'out', ac: [10, 1e6, 20], tran: [2e-6, 5e-3],
  },
  lc: {
    name: 'Two-stage RC ladder, step response',
    text: '* Two RC stages in a row (made-up values)\nV1 in 0 PULSE(0 5 0.1m 1u 1u 10 20) AC 1\nR1 in a 2.2k\nC1 a 0 470n\nR2 a out 10k\nC2 out 0 100n\n',
    analysis: 'tran', probe: 'out', ac: [1, 100e3, 20], tran: [5e-6, 8e-3],
  },
};
