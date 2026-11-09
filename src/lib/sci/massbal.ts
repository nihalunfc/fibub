// Steady-state material and energy balances on a small flowsheet of mixers, splitters, separators (split
// fractions) and reactors (one reaction, given conversion of a key component), with recycles. All balances are
// linear in the component molar flows, so the whole flowsheet is solved at once as one matrix (simultaneous or
// "equation-oriented" solution). The optional energy balance uses constant heat capacities, which keeps it linear
// in the stream enthalpies too.

export type Comp = { name: string; M?: number; cp?: number };
export type UnitKind = 'mixer' | 'splitter' | 'separator' | 'reactor';
export type Unit = {
  kind: UnitKind; name: string; ins: string[]; outs: string[];
  fractions?: number[]; // splitter: fraction to each outlet but the last
  split?: Record<string, number>; // separator: fraction of each component to the first outlet
  nu?: Record<string, number>; key?: string; conv?: number; dH?: number; // reactor
  T?: number; // outlet temperature, °C (reactor, separator)
};
export type Feed = { stream: string; flows: Record<string, number>; T?: number };
export type Spec = { stream: string; what: string; value: number }; // what = component name or 'total'
export type Sheet = { comps: Comp[]; units: Unit[]; feeds: Feed[]; specs: Spec[]; Tref?: number };

/** Parse "2 A + 3 B -> C" into stoichiometric coefficients (negative for reactants). */
export function parseReaction(s: string, comps: string[]): Record<string, number> {
  const [l, r] = s.split(/->|→|=>/);
  if (r === undefined) throw new Error(`The reaction "${s}" needs an arrow, like A + 3 B -> 2 C.`);
  const nu: Record<string, number> = {};
  const side = (t: string, sign: number) => {
    for (const term of t.split('+').map((x) => x.trim()).filter(Boolean)) {
      const m = term.match(/^(\d*\.?\d*)\s*(\S+)$/);
      if (!m) throw new Error(`Could not read "${term}" in the reaction.`);
      const c = m[1] ? Number(m[1]) : 1, name = m[2];
      if (!comps.includes(name)) throw new Error(`The reaction uses ${name}, which is not in the component list.`);
      nu[name] = (nu[name] ?? 0) + sign * c;
    }
  };
  side(l, -1); side(r, 1);
  return nu;
}

const NUM = /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i;
/** Read the text description of units, feeds and extra specifications. */
export function parseSheet(compText: string, unitText: string, feedText: string): Sheet {
  const lines = (t: string) => t.replace(/\r/g, '').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const comps: Comp[] = [];
  for (const l of lines(compText)) {
    const p = l.split(/[,\t;]/).map((x) => x.trim());
    if (/^(component|name)$/i.test(p[0])) continue;
    if (!p[0] || /\s/.test(p[0])) throw new Error(`Component "${p[0]}": use a name without spaces.`);
    if (comps.some((c) => c.name === p[0])) throw new Error(`Component ${p[0]} is listed twice.`);
    const M = p[1] ? Number(p[1]) : undefined, cp = p[2] ? Number(p[2]) : undefined;
    if ((p[1] && !(M! > 0)) || (p[2] && !(cp! > 0))) throw new Error(`Component ${p[0]}: molar mass and cp must be numbers above 0.`);
    comps.push({ name: p[0], M, cp });
  }
  if (!comps.length) throw new Error('List at least one component.');
  const names = comps.map((c) => c.name);
  const units: Unit[] = [];
  for (const l of lines(unitText)) {
    const m = l.match(/^(mixer|splitter|separator|reactor)\s+([^:\s]+)\s*:\s*([^|]+?)\s*->\s*([^|]+?)\s*(\|.*)?$/i);
    if (!m) throw new Error(`Could not read the unit line "${l}". Write it like: mixer M1: S1 + S2 -> S3`);
    const kind = m[1].toLowerCase() as UnitKind, u: Unit = { kind, name: m[2], ins: m[3].split('+').map((x) => x.trim()).filter(Boolean), outs: m[4].split('+').map((x) => x.trim()).filter(Boolean) };
    const parts = (m[5] ?? '').split('|').map((x) => x.trim()).filter(Boolean);
    for (const part of parts) {
      let mm: RegExpMatchArray | null;
      if (/->|→|=>/.test(part)) { u.nu = parseReaction(part, names); continue; }
      if ((mm = part.match(/^T\s*=?\s*(\S+)$/i)) && NUM.test(mm[1])) { u.T = Number(mm[1]); continue; }
      if ((mm = part.match(/^dH\s*=?\s*(\S+)$/i)) && NUM.test(mm[1])) { u.dH = Number(mm[1]); continue; }
      const items = part.split(',').map((x) => x.trim()).filter(Boolean);
      if (kind === 'splitter' && items.every((x) => NUM.test(x))) { u.fractions = items.map(Number); continue; }
      const pairs = items.map((x) => x.split(/\s*[=\s]\s*/));
      if (pairs.every((p) => p.length === 2 && names.includes(p[0]) && NUM.test(p[1]))) {
        if (kind === 'separator') { u.split = Object.fromEntries(pairs.map(([a, b]) => [a, Number(b)])); continue; }
        if (kind === 'reactor' && pairs.length === 1) { u.key = pairs[0][0]; u.conv = Number(pairs[0][1]); continue; }
      }
      throw new Error(`${u.name}: could not read "${part}".`);
    }
    units.push(u);
  }
  const feeds: Feed[] = [], specs: Spec[] = [];
  for (const l of lines(feedText)) {
    let m = l.match(/^([^:\s]+)\s*:\s*([^|]*?)\s*(\|\s*T\s*=?\s*(\S+))?$/i);
    if (m) {
      const flows: Record<string, number> = {};
      for (const it of m[2].split(',').map((x) => x.trim()).filter(Boolean)) {
        const p = it.split(/\s*[=\s]\s*/);
        if (p.length !== 2 || !names.includes(p[0]) || !(p[1] === '?' || (NUM.test(p[1]) && Number(p[1]) >= 0))) throw new Error(`Feed ${m[1]}: could not read "${it}". Write component and flow, like N2 100 (or N2 ? if it is unknown).`);
        flows[p[0]] = p[1] === '?' ? NaN : Number(p[1]);
      }
      if (m[4] !== undefined && !NUM.test(m[4])) throw new Error(`Feed ${m[1]}: the temperature is not a number.`);
      feeds.push({ stream: m[1], flows, T: m[4] !== undefined ? Number(m[4]) : undefined });
      continue;
    }
    m = l.match(/^(\S+)\s+(\S+)\s*=?\s*(\S+)$/);
    if (m && (m[2].toLowerCase() === 'total' || names.includes(m[2])) && NUM.test(m[3])) { specs.push({ stream: m[1], what: m[2].toLowerCase() === 'total' ? 'total' : m[2], value: Number(m[3]) }); continue; }
    throw new Error(`Could not read "${l}". Feeds look like "S1: N2 100, H2 300 | T 25"; extra specifications like "S6 total 20".`);
  }
  return { comps, units, feeds, specs };
}

/** Rank-revealing Gaussian elimination: solution (when unique), rank, and whether the equations agree. */
export function solveSystem(A: number[][], b: number[], n: number) {
  const M = A.map((r, i) => [...r, b[i]]), m = M.length;
  const scale = Math.max(1e-300, ...A.flat().map(Math.abs));
  const tol = 1e-10 * scale;
  let row = 0; const pivCol: number[] = [];
  for (let c = 0; c < n && row < m; c++) {
    let p = row; for (let r = row + 1; r < m; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) <= tol) continue;
    [M[row], M[p]] = [M[p], M[row]];
    for (let r = 0; r < m; r++) if (r !== row && M[r][c] !== 0) { const k = M[r][c] / M[row][c]; for (let j = c; j <= n; j++) M[r][j] -= k * M[row][j]; }
    pivCol.push(c); row++;
  }
  const rank = row;
  const bscale = Math.max(1, ...b.map(Math.abs));
  let consistent = true; for (let r = rank; r < m; r++) if (Math.abs(M[r][n]) > 1e-8 * bscale) consistent = false;
  const x = new Array(n).fill(NaN);
  if (rank === n && consistent) pivCol.forEach((c, r) => { x[c] = M[r][n] / M[r][c]; });
  const free = new Set(Array.from({ length: n }, (_, i) => i)); pivCol.forEach((c) => free.delete(c));
  return { x, rank, consistent, free: [...free] };
}

export type Result = {
  streams: string[]; comps: string[]; flows: number[][]; // flows[stream][comp]
  unknowns: number; equations: number; rank: number; dof: number; consistent: boolean; freeVars: string[];
  extent: Record<string, number>; massCheck: Record<string, number>;
  T?: Record<string, number>; duty?: Record<string, number>; energyNote?: string;
};

export function solveSheet(sh: Sheet): Result {
  const comps = sh.comps.map((c) => c.name), C = comps.length;
  const streams: string[] = [];
  const add = (s: string) => { if (!streams.includes(s)) streams.push(s); };
  sh.feeds.forEach((f) => add(f.stream)); sh.units.forEach((u) => { u.ins.forEach(add); u.outs.forEach(add); });
  // Checks on the topology.
  const unitNames = new Set<string>();
  const produced = new Map<string, string>(), consumed = new Map<string, string>();
  for (const u of sh.units) {
    if (unitNames.has(u.name)) throw new Error(`Unit ${u.name} is listed twice.`); unitNames.add(u.name);
    if (!u.ins.length || !u.outs.length) throw new Error(`${u.name} needs at least one inlet and one outlet.`);
    for (const s of u.outs) { if (produced.has(s)) throw new Error(`Stream ${s} leaves both ${produced.get(s)} and ${u.name}.`); produced.set(s, u.name); }
    for (const s of u.ins) { if (consumed.has(s)) throw new Error(`Stream ${s} enters both ${consumed.get(s)} and ${u.name}.`); consumed.set(s, u.name); }
    if ((u.kind === 'mixer') && u.outs.length !== 1) throw new Error(`Mixer ${u.name} has one outlet.`);
    if ((u.kind === 'splitter' || u.kind === 'reactor') && u.ins.length !== 1) throw new Error(`${u.kind === 'splitter' ? 'Splitter' : 'Reactor'} ${u.name} has one inlet.`);
    if (u.kind === 'reactor' && u.outs.length !== 1) throw new Error(`Reactor ${u.name} has one outlet.`);
    if (u.kind === 'separator' && (u.ins.length !== 1 || u.outs.length !== 2)) throw new Error(`Separator ${u.name} has one inlet and two outlets.`);
    if (u.kind === 'splitter') {
      if (u.outs.length < 2) throw new Error(`Splitter ${u.name} needs two or more outlets.`);
      if (!u.fractions || u.fractions.length !== u.outs.length - 1) throw new Error(`Splitter ${u.name}: give ${u.outs.length - 1} fraction${u.outs.length > 2 ? 's' : ''} (to each outlet but the last).`);
      if (!u.fractions.every((f) => f >= 0 && f <= 1) || u.fractions.reduce((a, b) => a + b, 0) > 1 + 1e-12) throw new Error(`Splitter ${u.name}: fractions must be 0 to 1 and add up to 1 or less.`);
    }
    if (u.kind === 'separator') { if (!u.split) throw new Error(`Separator ${u.name}: give the fraction of each component going to ${u.outs[0]}, like "NH3 0.95, H2 0.01".`); if (!Object.values(u.split).every((f) => f >= 0 && f <= 1)) throw new Error(`Separator ${u.name}: split fractions must be between 0 and 1.`); }
    if (u.kind === 'reactor') {
      if (!u.nu) throw new Error(`Reactor ${u.name}: give the reaction, like "N2 + 3 H2 -> 2 NH3".`);
      if (!u.key || u.conv === undefined) throw new Error(`Reactor ${u.name}: give the key component and its conversion, like "N2 0.25".`);
      if (!((u.nu[u.key] ?? 0) < 0)) throw new Error(`Reactor ${u.name}: the key component ${u.key} must be a reactant.`);
      if (!(u.conv >= 0 && u.conv <= 1)) throw new Error(`Reactor ${u.name}: conversion is a fraction from 0 to 1.`);
    }
  }
  for (const f of sh.feeds) if (produced.has(f.stream)) throw new Error(`Feed ${f.stream} is also the outlet of ${produced.get(f.stream)}.`);
  for (const s of streams) if (!produced.has(s) && !consumed.has(s) && !sh.feeds.some((f) => f.stream === s)) throw new Error(`Stream ${s} is not connected.`);
  for (const sp of sh.specs) if (!streams.includes(sp.stream)) throw new Error(`The specification names stream ${sp.stream}, which is not in the flowsheet.`);
  if (streams.length * C > 2000) throw new Error('This tool handles up to 2,000 unknown flows.');
  // Unknowns: x[s*C + c]; plus nothing else (reactor extent follows from conversion).
  const n = streams.length * C, idx = (s: string, c: number) => streams.indexOf(s) * C + c;
  const A: number[][] = [], b: number[] = [];
  const eq = (terms: [number, number][], rhs = 0) => { const r = new Array(n).fill(0); for (const [i, v] of terms) r[i] += v; A.push(r); b.push(rhs); };
  for (const f of sh.feeds) for (let c = 0; c < C; c++) { const v = f.flows[comps[c]] ?? 0; if (!Number.isNaN(v)) eq([[idx(f.stream, c), 1]], v); }
  for (const u of sh.units) {
    for (let c = 0; c < C; c++) {
      const cn = comps[c];
      if (u.kind === 'mixer') eq([...u.ins.map((s) => [idx(s, c), 1] as [number, number]), [idx(u.outs[0], c), -1]]);
      else if (u.kind === 'splitter') {
        const fr = [...u.fractions!, 1 - u.fractions!.reduce((a, v) => a + v, 0)];
        u.outs.forEach((o, k) => eq([[idx(o, c), 1], [idx(u.ins[0], c), -fr[k]]]));
      } else if (u.kind === 'separator') {
        const f = u.split![cn] ?? 0;
        eq([[idx(u.outs[0], c), 1], [idx(u.ins[0], c), -f]]);
        eq([[idx(u.outs[1], c), 1], [idx(u.ins[0], c), -(1 - f)]]);
      } else {
        // out_c = in_c + nu_c / |nu_key| * X * in_key
        const k = comps.indexOf(u.key!), r = (u.nu![cn] ?? 0) / Math.abs(u.nu![u.key!]);
        eq([[idx(u.outs[0], c), 1], [idx(u.ins[0], c), -1], [idx(u.ins[0], k), -r * u.conv!]]);
      }
    }
  }
  for (const sp of sh.specs) {
    if (sp.what === 'total') eq(comps.map((_, c) => [idx(sp.stream, c), 1] as [number, number]), sp.value);
    else eq([[idx(sp.stream, comps.indexOf(sp.what)), 1]], sp.value);
  }
  const sol = solveSystem(A, b, n);
  const flows = streams.map((s) => comps.map((_, c) => sol.x[idx(s, c)]));
  const res: Result = {
    streams, comps, flows, unknowns: n, equations: A.length, rank: sol.rank, dof: n - sol.rank, consistent: sol.consistent,
    freeVars: sol.free.map((i) => `${comps[i % C]} in ${streams[Math.floor(i / C)]}`), extent: {}, massCheck: {},
  };
  if (res.dof !== 0 || !res.consistent) return res;
  const F = (s: string) => flows[streams.indexOf(s)];
  for (const u of sh.units) if (u.kind === 'reactor') res.extent[u.name] = (u.conv! * F(u.ins[0])[comps.indexOf(u.key!)]) / Math.abs(u.nu![u.key!]);
  // Mass closure per unit (when every molar mass is known).
  if (sh.comps.every((c) => c.M)) {
    const mass = (s: string) => F(s).reduce((a, v, c) => a + v * sh.comps[c].M!, 0);
    for (const u of sh.units) res.massCheck[u.name] = u.outs.reduce((a, s) => a + mass(s), 0) - u.ins.reduce((a, s) => a + mass(s), 0);
  }
  // Energy balance: unknown stream enthalpies H_s = Cp_s (T_s - Tref), Cp_s = sum n_c cp_c.
  if (sh.comps.every((c) => c.cp) && sh.feeds.every((f) => f.T !== undefined)) {
    const Tref = sh.Tref ?? 25, Cp = (s: string) => F(s).reduce((a, v, c) => a + v * sh.comps[c].cp!, 0);
    const N = streams.length, AE: number[][] = [], bE: number[] = [];
    const e = (terms: [number, number][], rhs = 0) => { const r = new Array(N).fill(0); for (const [i, v] of terms) r[i] += v; AE.push(r); bE.push(rhs); };
    const si = (s: string) => streams.indexOf(s);
    for (const f of sh.feeds) e([[si(f.stream), 1]], Cp(f.stream) * (f.T! - Tref));
    for (const u of sh.units) {
      if (u.kind === 'mixer') e([...u.ins.map((s) => [si(s), 1] as [number, number]), [si(u.outs[0]), -1]]);
      else if ((u.kind === 'splitter' || u.kind === 'separator') && u.T === undefined) {
        const cin = Cp(u.ins[0]);
        // same temperature as the inlet: H_out = (Cp_out / Cp_in) H_in
        u.outs.forEach((o) => e([[si(o), 1], [si(u.ins[0]), cin ? -Cp(o) / cin : 0]]));
      } else if (u.T !== undefined) u.outs.forEach((o) => e([[si(o), 1]], Cp(o) * (u.T! - Tref)));
      else if (u.kind === 'reactor') e([[si(u.outs[0]), 1], [si(u.ins[0]), -1]], -(res.extent[u.name] * (u.dH ?? 0)));
    }
    const es = solveSystem(AE, bE, N);
    if (es.rank === N && es.consistent) {
      res.T = {}; res.duty = {};
      streams.forEach((s, i) => { const cp = Cp(s); res.T![s] = cp > 0 ? Tref + es.x[i] / cp : NaN; });
      for (const u of sh.units) {
        const Hin = u.ins.reduce((a, s) => a + es.x[si(s)], 0), Hout = u.outs.reduce((a, s) => a + es.x[si(s)], 0);
        res.duty[u.name] = Hout - Hin + (u.kind === 'reactor' ? res.extent[u.name] * (u.dH ?? 0) : 0); // heat added, kJ per time unit
      }
    } else res.energyNote = 'The energy balance could not be closed with these settings.';
  } else res.energyNote = 'Give cp for every component and a temperature for every feed to add the energy balance.';
  return res;
}
