// Feynman diagrams from a small text description: vertices at coordinates and lines between them (fermion,
// photon, gluon, scalar, ghost, W/Z boson ...), drawn as SVG and written as TikZ-Feynman code. No DOM.

export type LineType = 'fermion' | 'anti fermion' | 'photon' | 'boson' | 'charged boson' | 'gluon' | 'scalar' | 'charged scalar' | 'ghost' | 'plain' | 'double';
export const TYPES: Record<string, LineType> = {
  fermion: 'fermion', f: 'fermion', antifermion: 'anti fermion', 'anti-fermion': 'anti fermion', af: 'anti fermion',
  photon: 'photon', boson: 'boson', z: 'boson', wavy: 'boson', 'charged-boson': 'charged boson', w: 'charged boson', chargedboson: 'charged boson',
  gluon: 'gluon', g: 'gluon', scalar: 'scalar', higgs: 'scalar', dashed: 'scalar', 'charged-scalar': 'charged scalar', chargedscalar: 'charged scalar',
  ghost: 'ghost', dotted: 'ghost', plain: 'plain', line: 'plain', double: 'double',
};
export type Vertex = { id: string; x: number; y: number; style: 'auto' | 'dot' | 'blob' | 'none' | 'cross' };
export type Edge = { a: string; b: string; type: LineType; label: string; bend: number; right: boolean; momentum: string };
export type Diagram = { vertices: Vertex[]; edges: Edge[] };

/**
 * Parse the description. Vertex lines: `name x y [dot|blob|cross|none]`. Line lines:
 * `from to type [label] [bend=deg] [right] [p=label]` (label without spaces; see labelParts for notation).
 */
export function parse(text: string): { diagram: Diagram; errors: string[] } {
  const vertices: Vertex[] = [], edges: Edge[] = [], errors: string[] = [], pending: [string[], number][] = [];
  text.replace(/\r/g, '').split('\n').forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim(); if (!line) return;
    const t = line.split(/\s+/);
    const x = Number(t[1]), y = Number(t[2]);
    if (t.length >= 3 && Number.isFinite(x) && Number.isFinite(y) && /^[\w.-]+$/.test(t[0])) {
      if (vertices.some((v) => v.id === t[0])) { errors.push(`Line ${i + 1}: the vertex "${t[0]}" is defined twice.`); return; }
      const st = (t[3] ?? 'auto').toLowerCase();
      if (!['auto', 'dot', 'blob', 'none', 'cross'].includes(st)) { errors.push(`Line ${i + 1}: vertex style "${t[3]}" should be dot, blob, cross or none.`); return; }
      vertices.push({ id: t[0], x, y, style: st as Vertex['style'] });
    } else pending.push([t, i + 1]);
  });
  for (const [t, n] of pending) {
    if (t.length < 3) { errors.push(`Line ${n}: write "from to type" for a line, or "name x y" for a vertex.`); continue; }
    const type = TYPES[t[2].toLowerCase()];
    if (!type) { errors.push(`Line ${n}: unknown line type "${t[2]}" (fermion, antifermion, photon, gluon, W, Z, higgs, scalar, ghost, plain, double).`); continue; }
    if (!vertices.some((v) => v.id === t[0]) || !vertices.some((v) => v.id === t[1])) { errors.push(`Line ${n}: give the vertices "${t[0]}" and "${t[1]}" a position first (name x y).`); continue; }
    let label = '', bend = 0, right = false, momentum = '';
    for (const w of t.slice(3)) {
      const bm = w.match(/^bend=(-?\d+(\.\d+)?)$/i), pm = w.match(/^p=(.+)$/i);
      if (bm) bend = Number(bm[1]);
      else if (pm) momentum = pm[1];
      else if (w.toLowerCase() === 'right') right = true;
      else label = label ? `${label} ${w}` : w;
    }
    if (Math.abs(bend) >= 180) { errors.push(`Line ${n}: bend must be between −179 and 179 degrees.`); continue; }
    if (t[0] === t[1]) { errors.push(`Line ${n}: a line must join two different vertices (use two bent lines for a loop).`); continue; }
    edges.push({ a: t[0], b: t[1], type, label, bend, right, momentum });
  }
  if (!edges.length && !errors.length) errors.push('Add at least one line between two vertices.');
  return { diagram: { vertices, edges }, errors };
}

// ---------- labels ----------
const GREEK: Record<string, [string, string]> = {
  alpha: ['α', '\\alpha'], beta: ['β', '\\beta'], gamma: ['γ', '\\gamma'], delta: ['δ', '\\delta'], epsilon: ['ε', '\\epsilon'], eta: ['η', '\\eta'],
  theta: ['θ', '\\theta'], kappa: ['κ', '\\kappa'], lambda: ['λ', '\\lambda'], mu: ['μ', '\\mu'], nu: ['ν', '\\nu'], xi: ['ξ', '\\xi'], pi: ['π', '\\pi'],
  rho: ['ρ', '\\rho'], sigma: ['σ', '\\sigma'], tau: ['τ', '\\tau'], phi: ['φ', '\\phi'], chi: ['χ', '\\chi'], psi: ['ψ', '\\psi'], omega: ['ω', '\\omega'],
  Gamma: ['Γ', '\\Gamma'], Delta: ['Δ', '\\Delta'], Lambda: ['Λ', '\\Lambda'], Sigma: ['Σ', '\\Sigma'], Xi: ['Ξ', '\\Xi'], Omega: ['Ω', '\\Omega'], Upsilon: ['Υ', '\\Upsilon'], Phi: ['Φ', '\\Phi'], Psi: ['Ψ', '\\Psi'],
};
export type LabelPart = { text: string; tex: string; pos: 'base' | 'sup' | 'sub'; bar?: boolean };
/**
 * Label notation: Greek names (gamma, mu, nu, tau, pi, ...), ~ before a symbol for a bar (antiparticle), ^x or ^{..}
 * for a superscript, _x or _{..} for a subscript; a trailing +, − or 0 becomes a superscript (e-, pi0, W+).
 */
export function labelParts(s: string): LabelPart[] {
  const out: LabelPart[] = [];
  let i = 0;
  const word = (w: string, pos: LabelPart['pos'], bar = false) => {
    const g = GREEK[w];
    out.push(g ? { text: g[0], tex: g[1], pos, bar } : { text: w, tex: w.replace(/([#$%&{}])/g, '\\$1'), pos, bar });
  };
  while (i < s.length) {
    const c = s[i];
    if (c === '^' || c === '_') {
      const pos = c === '^' ? 'sup' : 'sub';
      let body = '';
      if (s[i + 1] === '{') { const j = s.indexOf('}', i + 2); body = s.slice(i + 2, j < 0 ? undefined : j); i = j < 0 ? s.length : j + 1; }
      else { const gw = s.slice(i + 1).match(/^[A-Za-z]+/)?.[0]; body = gw && GREEK[gw] ? gw : s[i + 1] ?? ''; i += 1 + body.length; }
      for (const m of body.matchAll(/[A-Za-z]+|[^A-Za-z]/g)) word(m[0], pos);
      continue;
    }
    let bar = false;
    if (c === '~') { bar = true; i++; }
    const m = s.slice(i).match(/^[A-Za-z]+/);
    if (m) {
      let w = m[0];
      // A Greek name followed by more letters (e.g. "nue") is split only when the rest is a known suffix.
      i += w.length;
      if (!GREEK[w]) { const g = Object.keys(GREEK).find((k) => w.startsWith(k) && w.length > k.length && w.length - k.length <= 1); if (g) { i -= w.length - g.length; w = g; } }
      word(w, 'base', bar);
      continue;
    }
    if (/[+\-−0*]/.test(s[i]) && i === s.length - 1 && out.length) { out.push({ text: s[i] === '-' ? '−' : s[i], tex: s[i] === '−' ? '-' : s[i], pos: 'sup' }); i++; continue; }
    out.push({ text: s[i], tex: s[i].replace(/([#$%&{}])/g, '\\$1'), pos: 'base', bar }); i++;
  }
  return out;
}
export function labelTex(s: string): string {
  if (!s) return '';
  let t = '';
  for (const p of labelParts(s)) {
    const b = p.bar ? `\\bar{${p.tex}}` : p.tex, sp = p.tex.startsWith('\\') ? ' ' : '';
    t += p.pos === 'sup' ? `^{${b}}` : p.pos === 'sub' ? `_{${b}}` : b + (p.tex.startsWith('\\') && !p.bar ? sp : '');
  }
  return `\\(${t.trim().replace(/ (?=[\^_}])/g, '')}\\)`;
}
export const labelPlain = (s: string) => labelParts(s).map((p) => p.text + (p.bar ? '̅' : '')).join('');

// ---------- geometry ----------
type Pt = [number, number];
/** Point and unit tangent at s in [0, 1] along a straight or bent (circular arc) line from A to B. */
export function along(A: Pt, B: Pt, bendDeg: number, s: number): { p: Pt; t: Pt } {
  const dx = B[0] - A[0], dy = B[1] - A[1], c = Math.hypot(dx, dy), u: Pt = [dx / c, dy / c], n: Pt = [-u[1], u[0]];
  const th = (bendDeg * Math.PI) / 180;
  if (Math.abs(th) < 1e-9) return { p: [A[0] + dx * s, A[1] + dy * s], t: u };
  const r = c / (2 * Math.sin(th)), d = r * Math.cos(th), ph = (2 * s - 1) * th;
  const a = (c / 2) * (Math.sin(ph) / Math.sin(th)), b = r * Math.cos(ph) - d;
  const M: Pt = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  const da = c * th * Math.cos(ph) / Math.sin(th), db = -2 * th * r * Math.sin(ph), L = Math.hypot(da, db);
  return { p: [M[0] + u[0] * a + n[0] * b, M[1] + u[1] * a + n[1] * b], t: [(u[0] * da + n[0] * db) / L, (u[1] * da + n[1] * db) / L] };
}
/** Length of a straight or bent line. */
export function lineLength(A: Pt, B: Pt, bendDeg: number) {
  const c = Math.hypot(B[0] - A[0], B[1] - A[1]), th = Math.abs((bendDeg * Math.PI) / 180);
  return th < 1e-9 ? c : (c * th) / Math.sin(th);
}

/** The drawn path of a line in page units: a polyline (wavy, curly or plain). */
export function linePath(A: Pt, B: Pt, type: LineType, bend: number, scale: number): Pt[] {
  const L = lineLength(A, B, bend), pts: Pt[] = [];
  if (type === 'photon' || type === 'boson' || type === 'charged boson') {
    const k = Math.max(2, Math.round(L / (14 / scale))), amp = 4.5 / scale, N = k * 16;
    for (let i = 0; i <= N; i++) { const s = i / N, g = along(A, B, bend, s), o = amp * Math.sin(2 * Math.PI * k * s); pts.push([g.p[0] - g.t[1] * o, g.p[1] + g.t[0] * o]); }
    return pts;
  }
  if (type === 'gluon') {
    const k = Math.max(3, Math.round(L / (9 / scale))), c = L / (2 * Math.PI * k), a = 4.2 / scale, N = k * 24;
    for (let i = 0; i <= N; i++) {
      const uu = (2 * Math.PI * k * i) / N, x = c * uu - a * Math.sin(uu), y = a * (1 - Math.cos(uu)) * 0.9;
      const s = Math.min(1, Math.max(0, x / L)), g = along(A, B, bend, s), over = x - s * L;
      pts.push([g.p[0] + g.t[0] * over - g.t[1] * y, g.p[1] + g.t[1] * over + g.t[0] * y]);
    }
    return pts;
  }
  const N = Math.abs(bend) > 0 ? 48 : 1;
  for (let i = 0; i <= N; i++) pts.push(along(A, B, bend, i / N).p);
  return pts;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f1 = (x: number) => (Math.round(x * 10) / 10).toString();

/** SVG text for a label centred at (x, y), with sub- and superscripts. */
function svgLabel(s: string, x: number, y: number, size: number, color: string) {
  const parts = labelParts(s);
  let inner = '', shift = 0;
  for (const p of parts) {
    const t = esc(p.text + (p.bar ? '̅' : ''));
    const want = p.pos === 'sup' ? -0.42 : p.pos === 'sub' ? 0.28 : 0, dy = (want - shift) * size;
    inner += `<tspan${dy ? ` dy="${f1(dy)}"` : ''}${p.pos === 'base' ? '' : ` font-size="${f1(size * 0.78)}"`}>${t}</tspan>`;
    shift = want;
  }
  return `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" fill="${color}" text-anchor="middle" dominant-baseline="central" font-style="italic">${inner}</text>`;
}

/** Degree (number of lines) of each vertex. */
const degrees = (d: Diagram) => { const m = new Map<string, number>(); for (const e of d.edges) { m.set(e.a, (m.get(e.a) ?? 0) + 1); m.set(e.b, (m.get(e.b) ?? 0) + 1); } return m; };

/** The diagram as an SVG document. Coordinates: 1 unit = `unit` px, y upwards. */
export function toSvg(d: Diagram, opts: { unit?: number; color?: string; bg?: string | null; stroke?: number; font?: number } = {}): { svg: string; w: number; h: number } {
  const unit = opts.unit ?? 60, col = opts.color ?? '#000', sw = opts.stroke ?? 1.6, fs = opts.font ?? 17, pad = 26;
  const V = new Map(d.vertices.map((v) => [v.id, v]));
  const P = (id: string): Pt => { const v = V.get(id)!; return [v.x, v.y]; };
  const parts: string[] = [], xs: number[] = [], ys: number[] = [];
  const toPx = (p: Pt): Pt => [p[0] * unit, -p[1] * unit];
  const push = (p: Pt, r = 0) => { xs.push(p[0] - r, p[0] + r); ys.push(p[1] - r, p[1] + r); };
  for (const e of d.edges) {
    const A = P(e.a), B = P(e.b), pts = linePath(A, B, e.type, e.bend, unit).map(toPx);
    pts.forEach((p) => push(p));
    const dash = e.type === 'scalar' || e.type === 'charged scalar' ? ` stroke-dasharray="${f1(sw * 4)} ${f1(sw * 3)}"` : e.type === 'ghost' ? ` stroke-dasharray="${f1(sw * 0.1)} ${f1(sw * 2.6)}" stroke-linecap="round"` : '';
    const dpath = 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L');
    if (e.type === 'double') {
      parts.push(`<path d="${dpath}" fill="none" stroke="${col}" stroke-width="${f1(sw * 3.2)}" stroke-linejoin="round"/><path d="${dpath}" fill="none" stroke="${opts.bg ?? '#fff'}" stroke-width="${f1(sw * 1.2)}" stroke-linejoin="round"/>`);
    } else parts.push(`<path d="${dpath}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linejoin="round"${dash}/>`);
    const mid = along(A, B, e.bend, 0.5), mp = toPx(mid.p), tx = mid.t[0], ty = -mid.t[1];
    // Screen-left of the direction of travel (TikZ puts edge labels on the left; "right" swaps sides).
    const side = e.right ? -1 : 1, nx = ty * side, ny = -tx * side;
    if (['fermion', 'anti fermion', 'charged boson', 'charged scalar'].includes(e.type)) {
      const dir = e.type === 'anti fermion' ? -1 : 1, ux = tx * dir, uy = ty * dir, s = 6.5, off = e.type === 'charged boson' ? -12 : 0;
      const ax = -uy, ay = ux, cx = mp[0] + nx * off, cy = mp[1] + ny * off;
      const tip: Pt = [cx + ux * s, cy + uy * s], l: Pt = [cx - ux * s + ax * s * 0.8, cy - uy * s + ay * s * 0.8], r: Pt = [cx - ux * s - ax * s * 0.8, cy - uy * s - ay * s * 0.8];
      parts.push(`<path d="M${f1(tip[0])} ${f1(tip[1])} L${f1(l[0])} ${f1(l[1])} L${f1(r[0])} ${f1(r[1])} Z" fill="${col}"/>`);
    }
    const wide = ['photon', 'boson', 'charged boson', 'gluon'].includes(e.type) ? 7 : 0, off = 15 + wide;
    if (e.label) { const lp: Pt = [mp[0] + nx * off, mp[1] + ny * off]; parts.push(svgLabel(e.label, lp[0], lp[1], fs, col)); push(lp, fs); }
    if (e.momentum) {
      const off2 = -(12 + wide), a0 = along(A, B, e.bend, 0.35), a1 = along(A, B, e.bend, 0.65), p0 = toPx(a0.p), p1 = toPx(a1.p);
      const q0: Pt = [p0[0] + nx * off2, p0[1] + ny * off2], q1: Pt = [p1[0] + nx * off2, p1[1] + ny * off2], ux = (q1[0] - q0[0]) / Math.hypot(q1[0] - q0[0], q1[1] - q0[1]), uy = (q1[1] - q0[1]) / Math.hypot(q1[0] - q0[0], q1[1] - q0[1]);
      parts.push(`<path d="M${f1(q0[0])} ${f1(q0[1])} L${f1(q1[0])} ${f1(q1[1])} M${f1(q1[0] - ux * 6 - uy * 4)} ${f1(q1[1] - uy * 6 + ux * 4)} L${f1(q1[0])} ${f1(q1[1])} L${f1(q1[0] - ux * 6 + uy * 4)} ${f1(q1[1] - uy * 6 - ux * 4)}" fill="none" stroke="${col}" stroke-width="1"/>`);
      const lp: Pt = [(q0[0] + q1[0]) / 2 + nx * -12, (q0[1] + q1[1]) / 2 + ny * -12];
      parts.push(svgLabel(e.momentum, lp[0], lp[1], fs * 0.8, col)); push(lp, fs);
    }
  }
  const deg = degrees(d);
  for (const v of d.vertices) {
    const p = toPx([v.x, v.y]); push(p, 4);
    const st = v.style === 'auto' ? ((deg.get(v.id) ?? 0) >= 3 ? 'dot' : 'none') : v.style;
    if (st === 'dot') parts.push(`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(sw * 1.9)}" fill="${col}"/>`);
    if (st === 'blob') { parts.push(`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="13" fill="${opts.bg ?? '#fff'}" stroke="${col}" stroke-width="${sw}"/><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="13" fill="url(#hatch)" stroke="none"/>`); push(p, 14); }
    if (st === 'cross') { const r = 6; parts.push(`<path d="M${f1(p[0] - r)} ${f1(p[1] - r)} L${f1(p[0] + r)} ${f1(p[1] + r)} M${f1(p[0] - r)} ${f1(p[1] + r)} L${f1(p[0] + r)} ${f1(p[1] - r)}" stroke="${col}" stroke-width="${sw}"/>`); }
  }
  const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad, w = Math.ceil(Math.max(...xs) + pad - x0), h = Math.ceil(Math.max(...ys) + pad - y0);
  const defs = `<defs><pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="${col}" stroke-width="1"/></pattern></defs>`;
  const bg = opts.bg ? `<rect x="${f1(x0)}" y="${f1(y0)}" width="${w}" height="${h}" fill="${opts.bg}"/>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${f1(x0)} ${f1(y0)} ${w} ${h}" font-family="'Times New Roman', Times, serif">${defs}${bg}${parts.join('')}</svg>`;
  return { svg, w, h };
}

/** TikZ-Feynman code (tikz-feynman package, LuaLaTeX not needed with explicit coordinates). */
export function toTikz(d: Diagram): string {
  const deg = degrees(d), lines: string[] = ['% Needs \\usepackage{tikz-feynman}', '\\begin{tikzpicture}', '\\begin{feynman}'];
  const name = (s: string) => s.replace(/[^A-Za-z0-9]/g, '');
  for (const v of d.vertices) {
    const st = v.style === 'auto' ? ((deg.get(v.id) ?? 0) >= 3 ? 'dot' : '') : v.style === 'none' ? '' : v.style === 'cross' ? 'crossed dot' : v.style;
    lines.push(`  \\vertex${st ? ` [${st}]` : ''} (${name(v.id)}) at (${v.x}, ${v.y});`);
  }
  lines.push('  \\diagram* {');
  d.edges.forEach((e, i) => {
    const opts: string[] = [e.type === 'double' ? 'double distance=1.5pt, plain' : e.type];
    if (e.bend) opts.push(e.bend > 0 ? `bend left=${e.bend}` : `bend right=${-e.bend}`);
    if (e.label) opts.push(`edge label${e.right ? "'" : ''}=${labelTex(e.label)}`);
    if (e.momentum) opts.push(`momentum${e.right ? '' : "'"}=${labelTex(e.momentum)}`);
    lines.push(`    (${name(e.a)}) -- [${opts.join(', ')}] (${name(e.b)})${i < d.edges.length - 1 ? ',' : ''}`);
  });
  lines.push('  };', '\\end{feynman}', '\\end{tikzpicture}');
  return lines.join('\n') + '\n';
}

/** Example diagrams. */
export const PRESETS: Record<string, { label: string; text: string }> = {
  ee: { label: 'e⁺e⁻ → μ⁺μ⁻ (photon exchange, s-channel)', text: `# vertices: name x y
i1 0 2
i2 0 0
v1 1.5 1
v2 3.5 1
f1 5 2
f2 5 0
# lines: from to type label
i1 v1 fermion e-
v1 i2 fermion e+ right
v1 v2 photon gamma p=q
v2 f1 fermion mu-
f2 v2 fermion mu+ right` },
  moller: { label: 'Electron-electron scattering (t-channel)', text: `a1 0 2.5
a2 3 2.5
b1 0 0
b2 3 0
va 1.5 2.5
vb 1.5 0
a1 va fermion e-
va a2 fermion e-
b1 vb fermion e- right
vb b2 fermion e- right
va vb photon gamma` },
  compton: { label: 'Compton scattering', text: `e1 0 0
g1 0 2
v1 1.5 1
v2 3.5 1
e2 5 0
g2 5 2
e1 v1 fermion e- right
g1 v1 photon gamma
v1 v2 fermion e-
v2 e2 fermion e- right
v2 g2 photon gamma` },
  beta: { label: 'Beta decay at quark level (d → u e⁻ ν̄ₑ)', text: `d 0 0
v1 2 0
u 4 0
v2 3 1.8
e 4.5 2.6
nu 4.5 1
d v1 fermion d right
v1 u fermion u right
v1 v2 W W^- bend=0
v2 e fermion e-
nu v2 fermion ~nu_e right` },
  qqg: { label: 'Quark pair with gluon emission', text: `i1 0 2
i2 0 0
v1 1.5 1
v2 3.2 1
q 5.2 2.4
qb 5.2 -0.4
g 5.6 1.1
v3 4.2 1.7
i1 v1 fermion e-
v1 i2 fermion e+ right
v1 v2 photon gamma
v2 v3 fermion q
v3 q fermion q
qb v2 fermion ~q right
v3 g gluon g` },
  ggh: { label: 'Higgs from gluon fusion (top loop)', text: `g1 0 2
g2 0 0
a 1.6 1.8
b 1.6 0.2
c 3 1
h 4.8 1
g1 a gluon g
g2 b gluon g right
a b fermion t right
b c fermion t right
c a fermion t right
c h higgs H` },
  loop: { label: 'Electron self-energy (bent photon)', text: `i 0 0
a 1.2 0
b 3.2 0
o 4.4 0
i a fermion e-
a b fermion e- right
b o fermion e-
a b photon gamma bend=70` },
  mudecay: { label: 'Muon decay', text: `mu 0 0
v1 2 0
num 4 0
v2 3 1.8
e 4.6 2.6
nue 4.6 1.1
mu v1 fermion mu- right
v1 num fermion nu_mu right
v1 v2 W W^-
v2 e fermion e-
nue v2 fermion ~nu_e right` },
};
