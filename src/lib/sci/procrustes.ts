// Two-dimensional landmark morphometrics: reading landmark files (TPS or a plain table), centroid size,
// generalised Procrustes analysis (translate, scale to unit centroid size, rotate, iterate to the mean),
// Procrustes distances, projection to the tangent space and principal components of the aligned shapes.
// Plain TypeScript, no DOM. Reflections are never used: a mirror image counts as a different shape.

export type Pt = [number, number];
export type Specimen = { name: string; pts: Pt[] };

const isNum = (s: string) => /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s);

/** Read TPS (LM= blocks) or a table with one specimen per row: name, x1, y1, x2, y2, ... Throws Error with a plain message. */
export function parseLandmarks(text: string): { specimens: Specimen[]; format: 'TPS' | 'table'; notes: string[] } {
  const notes: string[] = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim());
  if (lines.some((l) => /^LM3\s*=/i.test(l))) throw new Error('This file has 3D landmarks (LM3=). This tool works with 2D landmarks only.');
  if (lines.some((l) => /^LM\s*=/i.test(l))) {
    const specimens: Specimen[] = [];
    let i = 0, scaled = 0;
    while (i < lines.length) {
      const m = /^LM\s*=\s*(\d+)/i.exec(lines[i]);
      if (!m) { i++; continue; }
      const n = Number(m[1]), pts: Pt[] = [];
      i++;
      for (let k = 0; k < n; k++, i++) {
        const c = (lines[i] ?? '').split(/[\s,;]+/).filter(Boolean);
        if (c.length < 2 || !isNum(c[0]) || !isNum(c[1])) throw new Error(`Specimen ${specimens.length + 1}: LM=${n} says ${n} landmarks, but line ${i + 1} is not a pair of numbers.`);
        pts.push([Number(c[0]), Number(c[1])]);
      }
      let name = '', image = '', scale = 1;
      while (i < lines.length && !/^LM3?\s*=/i.test(lines[i])) {
        const l = lines[i], kv = /^([A-Z]+)\s*=\s*(.*)$/i.exec(l);
        if (kv) {
          const key = kv[1].toUpperCase(), v = kv[2].trim();
          if (key === 'ID') name = v;
          else if (key === 'IMAGE') image = v.replace(/^.*[\\/]/, '').replace(/\.[a-z0-9]+$/i, '');
          else if (key === 'SCALE' && isNum(v) && Number(v) > 0) scale = Number(v);
          else if (key === 'POINTS') { i += Number(v) || 0; } // outline points of a curve: skipped
        }
        i++;
      }
      if (scale !== 1) scaled++;
      specimens.push({ name: image || name || `Specimen ${specimens.length + 1}`, pts: pts.map(([x, y]) => [x * scale, y * scale]) });
    }
    if (scaled) notes.push(`SCALE= applied to ${scaled} specimen${scaled === 1 ? '' : 's'}, so centroid sizes are in real units.`);
    if (lines.some((l) => /^CURVES\s*=/i.test(l))) notes.push('Curve (outline) points were left out; only the fixed landmarks are used.');
    return { specimens, format: 'TPS', notes };
  }
  const rows = lines.filter((l) => l && !l.startsWith('#')).map((l) => l.split(l.includes('\t') ? /\t/ : l.includes(';') ? /;/ : l.includes(',') ? /,/ : /\s+/).map((c) => c.trim()));
  if (!rows.length) return { specimens: [], format: 'table', notes };
  const head = rows[0].slice(1).some((c) => c !== '' && !isNum(c));
  const body = head ? rows.slice(1) : rows;
  const specimens: Specimen[] = [];
  body.forEach((r, j) => {
    const named = !isNum(r[0]);
    const name = named ? r[0] : `Specimen ${j + 1}`, vals = (named ? r.slice(1) : r).filter((c) => c !== '');
    if (vals.some((c) => !isNum(c))) throw new Error(`Row ${j + 1 + (head ? 1 : 0)} (${name}): every value after the name must be a number.`);
    if (vals.length % 2) throw new Error(`Row ${j + 1 + (head ? 1 : 0)} (${name}) has ${vals.length} numbers; it needs x and y for each landmark (an even number).`);
    const pts: Pt[] = [];
    for (let k = 0; k < vals.length; k += 2) pts.push([Number(vals[k]), Number(vals[k + 1])]);
    specimens.push({ name, pts });
  });
  return { specimens, format: 'table', notes };
}

/** Specimens as TPS text (LM=, the points, ID=). */
export function toTps(specs: Specimen[], dp = 4): string {
  return specs.map((s) => [`LM=${s.pts.length}`, ...s.pts.map(([x, y]) => `${+x.toFixed(dp)} ${+y.toFixed(dp)}`), `ID=${s.name}`].join('\n')).join('\n') + '\n';
}

export const centroid = (p: Pt[]): Pt => [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length];
/** Centroid size: the square root of the summed squared distances of the landmarks from their centroid. */
export function centroidSize(p: Pt[]): number {
  const [cx, cy] = centroid(p);
  return Math.sqrt(p.reduce((s, [x, y]) => s + (x - cx) ** 2 + (y - cy) ** 2, 0));
}
/** Centred and scaled to unit centroid size. */
export function standardise(p: Pt[]): Pt[] {
  const [cx, cy] = centroid(p), cs = centroidSize(p);
  return p.map(([x, y]) => [(x - cx) / cs, (y - cy) / cs]);
}
export const rotate = (p: Pt[], t: number): Pt[] => { const c = Math.cos(t), s = Math.sin(t); return p.map(([x, y]) => [x * c - y * s, x * s + y * c]); };
/** The rotation angle that brings centred shape p closest to centred shape ref (least squares), and the cross sums. */
export function bestAngle(ref: Pt[], p: Pt[]): { angle: number; a: number; b: number } {
  let a = 0, b = 0;
  for (let i = 0; i < p.length; i++) { a += p[i][0] * ref[i][0] + p[i][1] * ref[i][1]; b += p[i][0] * ref[i][1] - p[i][1] * ref[i][0]; }
  return { angle: Math.atan2(b, a), a, b };
}
const ss = (p: Pt[], q: Pt[]) => p.reduce((s, [x, y], i) => s + (x - q[i][0]) ** 2 + (y - q[i][1]) ** 2, 0);
const norm = (p: Pt[]) => Math.sqrt(p.reduce((s, [x, y]) => s + x * x + y * y, 0));

/**
 * Fit shape b onto shape a (ordinary Procrustes, as scipy.spatial.procrustes does but with no reflection):
 * both centred and scaled to unit size, b rotated and then scaled by cos ρ to fit a. Returns the Procrustes
 * angle ρ, the partial Procrustes distance (both unit size: 2 sin(ρ/2)), the full distance (sin ρ) and the
 * disparity (sum of squared differences after the fit, sin² ρ).
 */
export function fit2(a: Pt[], b: Pt[]) {
  const A = standardise(a), B = standardise(b), r = bestAngle(A, B);
  const cosRho = Math.min(1, Math.hypot(r.a, r.b));
  const Bf = rotate(B, r.angle).map(([x, y]) => [x * cosRho, y * cosRho] as Pt);
  return { a: A, b: Bf, angle: r.angle, rho: Math.acos(cosRho), partial: Math.sqrt(Math.max(0, 2 - 2 * cosRho)), full: Math.sqrt(Math.max(0, 1 - cosRho * cosRho)), disparity: ss(A, Bf) };
}

export type GpaResult = {
  aligned: Pt[][]; mean: Pt[]; sizes: number[]; dist: number[]; iterations: number; converged: boolean;
  /** Sum of squared partial Procrustes distances to the mean, divided by the number of specimens. */
  variance: number;
};

/** Generalised Procrustes analysis: every shape at unit centroid size, rotated to the iterated mean shape. */
export function gpa(specs: Pt[][], opts: { tol?: number; maxIter?: number } = {}): GpaResult {
  const tol = opts.tol ?? 1e-12, maxIter = opts.maxIter ?? 200;
  const n = specs.length, p = specs[0].length;
  const sizes = specs.map(centroidSize), u = specs.map(standardise);
  let ref = u[0], aligned = u, iterations = 0, converged = false;
  for (; iterations < maxIter; ) {
    iterations++;
    aligned = u.map((s) => rotate(s, bestAngle(ref, s).angle));
    const m: Pt[] = Array.from({ length: p }, (_, k) => [aligned.reduce((s, a) => s + a[k][0], 0) / n, aligned.reduce((s, a) => s + a[k][1], 0) / n]);
    const nm = norm(m), mean = m.map(([x, y]) => [x / nm, y / nm] as Pt);
    const change = ss(mean, ref);
    ref = mean;
    if (change < tol) { converged = true; break; }
  }
  aligned = u.map((s) => rotate(s, bestAngle(ref, s).angle));
  const dist = aligned.map((a) => Math.sqrt(ss(a, ref)));
  return { aligned, mean: ref, sizes, dist, iterations, converged, variance: dist.reduce((s, d) => s + d * d, 0) / n };
}

/** Orthogonal projection of aligned (unit-size) shapes onto the tangent space at the mean (as geomorph does). */
export function tangent(aligned: Pt[][], mean: Pt[]): Pt[][] {
  return aligned.map((a) => {
    const d = a.reduce((s, [x, y], k) => s + x * mean[k][0] + y * mean[k][1], 0);
    return a.map(([x, y], k) => [x - d * mean[k][0] + mean[k][0], y - d * mean[k][1] + mean[k][1]] as Pt);
  });
}

/** Partial Procrustes distances between every pair of specimens (each pair fitted to each other). */
export function distanceMatrix(specs: Pt[][]): number[][] {
  const u = specs.map(standardise), n = u.length;
  const D = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const r = bestAngle(u[i], u[j]); D[i][j] = D[j][i] = Math.sqrt(Math.max(0, 2 - 2 * Math.min(1, Math.hypot(r.a, r.b)))); }
  return D;
}

/** Eigenvalues and eigenvectors of a symmetric matrix by cyclic Jacobi rotations, largest first. Vectors are columns. */
export function jacobiEigen(Ain: number[][]): { values: number[]; vectors: number[][] } {
  const n = Ain.length, A = Ain.map((r) => r.slice()), V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0, diag = 0;
    for (let i = 0; i < n; i++) { diag += A[i][i] * A[i][i]; for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j]; }
    if (off <= 1e-30 * Math.max(diag, 1e-300) || off === 0) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      const apq = A[p][q];
      if (Math.abs(apq) < 1e-300) continue;
      const theta = (A[q][q] - A[p][p]) / (2 * apq);
      const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  const idx = Array.from({ length: n }, (_, i) => i).sort((i, j) => A[j][j] - A[i][i]);
  return { values: idx.map((i) => A[i][i]), vectors: Array.from({ length: n }, (_, r) => idx.map((i) => V[r][i])) };
}

export type Pca = {
  /** Variance of each component (covariance eigenvalue, divisor n − 1). */
  values: number[]; share: number[];
  /** Loadings: one array of length 2p per component, ordered x1, y1, x2, y2, ... */
  loadings: number[][];
  /** Scores: one row per specimen, one column per component. */
  scores: number[][];
  colMeans: number[];
};

/**
 * Principal components of shapes (rows of x1, y1, x2, y2, ...). Uses the n × n Gram matrix when there are fewer
 * specimens than coordinates. Components with no variance are dropped. Sign: the largest loading is positive.
 */
export function pca(shapes: Pt[][]): Pca {
  const X = shapes.map((s) => s.flat()), n = X.length, m = X[0].length;
  const colMeans = Array.from({ length: m }, (_, j) => X.reduce((s, r) => s + r[j], 0) / n);
  const Xc = X.map((r) => r.map((v, j) => v - colMeans[j]));
  let comps: { val: number; load: number[] }[] = [];
  if (n <= m) {
    const G = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => Xc[i].reduce((s, v, k) => s + v * Xc[j][k], 0)));
    const e = jacobiEigen(G);
    comps = e.values.map((lam, k) => {
      const u = e.vectors.map((r) => r[k]), sq = Math.sqrt(Math.max(lam, 0));
      return { val: lam / (n - 1), load: Array.from({ length: m }, (_, j) => (sq > 0 ? Xc.reduce((s, r, i) => s + r[j] * u[i], 0) / sq : 0)) };
    });
  } else {
    const C = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => Xc.reduce((s, r) => s + r[i] * r[j], 0)));
    const e = jacobiEigen(C);
    comps = e.values.map((lam, k) => ({ val: lam / (n - 1), load: e.vectors.map((r) => r[k]) }));
  }
  const total = comps.reduce((s, c) => s + Math.max(0, c.val), 0);
  comps = comps.filter((c) => c.val > total * 1e-10 && c.val > 0);
  for (const c of comps) { let big = 0; for (const v of c.load) if (Math.abs(v) > Math.abs(big)) big = v; if (big < 0) c.load = c.load.map((v) => -v); }
  return {
    values: comps.map((c) => c.val), share: comps.map((c) => (total > 0 ? c.val / total : 0)), loadings: comps.map((c) => c.load),
    scores: Xc.map((r) => comps.map((c) => r.reduce((s, v, j) => s + v * c.load[j], 0))), colMeans,
  };
}

/** The shape at `score` along component k (mean + score × loading), as points. */
export function pcShape(p: Pca, k: number, score: number): Pt[] {
  const v = p.colMeans.map((m, j) => m + score * p.loadings[k][j]), out: Pt[] = [];
  for (let j = 0; j < v.length; j += 2) out.push([v[j], v[j + 1]]);
  return out;
}

/** Group of a specimen name: the part before the first - or _ (or space). */
export const groupOf = (name: string) => (/^([^-_\s]+)[-_\s]/.exec(name.trim())?.[1] ?? name.trim());

/** Made-up landmark example: 12 specimens of an invented fossil, 7 landmarks each, from two quarries (A and B), digitised at different sizes and angles. */
export const EXAMPLE = `LM=7
223.5 426.2
294.7 428.1
378.3 365.1
350.5 278.6
301.2 233.2
247.8 230.9
178.3 293.0
ID=A-01
LM=7
253.6 415.9
315.9 338.3
339.1 225.3
256.4 152.3
168.7 142.4
95.0 184.1
92.7 312.1
ID=A-02
LM=7
270.9 277.6
334.6 250.3
376.6 179.4
337.6 111.8
286.0 90.0
233.8 107.9
195.3 172.3
ID=A-03
LM=7
198.8 314.1
266.8 273.0
291.1 202.7
250.5 131.7
192.9 116.7
143.1 140.0
112.3 211.8
ID=A-04
LM=7
261.3 348.9
321.2 329.2
349.7 260.9
316.3 203.9
279.0 176.2
231.2 202.3
194.6 258.8
ID=A-05
LM=7
282.2 260.2
321.3 213.1
311.1 140.0
255.3 118.2
202.6 122.4
167.5 164.1
179.0 231.1
ID=A-06
LM=7
316.6 447.3
397.0 422.2
457.6 309.6
428.7 199.6
368.5 151.8
301.8 171.3
243.2 283.9
ID=B-01
LM=7
328.7 451.0
415.1 393.0
440.7 249.0
401.5 155.5
319.3 109.9
246.9 156.1
221.2 272.7
ID=B-02
LM=7
193.1 287.4
252.0 276.6
312.2 208.7
304.2 134.6
276.2 89.3
234.1 94.8
172.1 162.7
ID=B-03
LM=7
121.2 463.3
190.5 460.9
263.3 397.7
275.8 313.9
253.4 247.9
187.7 252.7
115.6 308.9
ID=B-04
LM=7
359.8 453.3
409.7 382.9
401.8 277.2
351.6 199.6
285.8 181.5
241.1 232.2
231.7 344.7
ID=B-05
LM=7
303.6 347.7
391.4 285.4
430.9 183.1
391.5 70.0
328.3 15.5
262.6 54.0
207.4 165.7
ID=B-06
`;
