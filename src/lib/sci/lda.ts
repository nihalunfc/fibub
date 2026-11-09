// Topic modelling with latent Dirichlet allocation (Blei, Ng and Jordan 2003), fitted by collapsed Gibbs sampling
// (Griffiths and Steyvers 2004, "Finding scientific topics", PNAS 101 suppl. 1). Seeded, so the same settings give
// the same topics. Plain TypeScript, no DOM; the page runs the sweeps in small chunks so it stays responsive.

/** mulberry32: a small, fast 32-bit seeded random number generator, uniform in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A generic list of common English function words, written for fibub. */
export const STOP_WORDS = `a about above after again against all almost also although always am among an and another any anyone anything
are around as at away back be because been before being below between both but by can cannot could did do does doing done
down during each either else enough even ever every few for from further get gets got had has have having he her here hers
herself him himself his how however i if in into is it its itself just least less let like made make many may me might mine
more most much must my myself near neither never no nobody none nor not nothing now of off often on once one only onto or
other others ought our ours ourselves out over own per perhaps quite rather really said same say says see seem seemed seems
shall she should since so some something sometimes still such than that the their theirs them themselves then there these
they thing things this those though through thus till to too toward towards two under unless until up upon us very was
we well were what whatever when where whether which while who whoever whole whom whose why will with within without would
yet you your yours yourself yourselves don't didn't doesn't isn't wasn't aren't weren't won't wouldn't can't couldn't
shouldn't i'm i've i'll i'd you're you've you'll he's she's it's we're we've they're they've that's there's what's let's`.split(/\s+/);

export type Doc = { name: string; text: string };

/** Documents from pasted text: split at lines starting with "###" (the rest of the line is the name) if there are any, otherwise at blank lines. */
export function splitDocs(raw: string): Doc[] {
  const lines = raw.split(/\r?\n/);
  if (lines.some((l) => /^\s*###/.test(l))) {
    const out: Doc[] = []; let cur: Doc | null = null;
    for (const line of lines) {
      const m = /^\s*###\s*(.*)$/.exec(line);
      if (m) { cur = { name: m[1].trim() || `Document ${out.length + 1}`, text: '' }; out.push(cur); continue; }
      if (!cur) { if (!line.trim()) continue; cur = { name: 'Document 1', text: '' }; out.push(cur); }
      cur.text += line + '\n';
    }
    return out.filter((d) => d.text.trim());
  }
  return raw.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean).map((text, i) => ({ name: `Document ${i + 1}`, text }));
}

export type Corpus = { names: string[]; vocab: string[]; docs: number[][]; tokens: number; removed: { stop: number; short: number; rare: number } };

/**
 * Turn documents into word ids. Words are lower-cased runs of letters (inner apostrophes kept). Dropped: stop words,
 * words shorter than `minLen` letters, and words used fewer than `minCount` times in the whole corpus. Word ids are in
 * order of first appearance.
 */
export function prepare(docs: Doc[], o: { stop?: Iterable<string>; minLen?: number; minCount?: number } = {}): Corpus {
  const stop = new Set([...(o.stop ?? STOP_WORDS)].map((w) => w.toLowerCase())), minLen = o.minLen ?? 3, minCount = o.minCount ?? 2;
  const removed = { stop: 0, short: 0, rare: 0 };
  const words = docs.map((d) => (d.text.toLowerCase().replace(/[’ʼ]/g, "'").match(/[\p{L}\p{M}]+(?:'[\p{L}\p{M}]+)*/gu) ?? []).filter((w) => {
    if (stop.has(w)) { removed.stop++; return false; }
    if ([...w.replace(/'/g, '')].length < minLen) { removed.short++; return false; }
    return true;
  }));
  const count = new Map<string, number>();
  for (const ws of words) for (const w of ws) count.set(w, (count.get(w) ?? 0) + 1);
  const id = new Map<string, number>(), vocab: string[] = [];
  const ids = words.map((ws) => ws.filter((w) => { if (count.get(w)! < minCount) { removed.rare++; return false; } return true; }).map((w) => {
    let k = id.get(w); if (k === undefined) { k = vocab.length; id.set(w, k); vocab.push(w); } return k;
  }));
  return { names: docs.map((d) => d.name), vocab, docs: ids, tokens: ids.reduce((a, d) => a + d.length, 0), removed };
}

export type Gibbs = {
  K: number; V: number; alpha: number; beta: number; rand: () => number;
  docs: number[][]; z: Int32Array[]; ndk: Int32Array[]; nkw: Int32Array[]; nk: Int32Array; sweeps: number;
};

/** Start a sampler: every word gets a random topic. */
export function initGibbs(c: { docs: number[][]; vocab: string[] }, K: number, alpha: number, beta: number, seed: number): Gibbs {
  const rand = mulberry32(seed), V = c.vocab.length;
  const ndk = c.docs.map(() => new Int32Array(K)), nkw = Array.from({ length: K }, () => new Int32Array(V)), nk = new Int32Array(K);
  const z = c.docs.map((d, di) => Int32Array.from(d, (w) => { const k = Math.floor(rand() * K); ndk[di][k]++; nkw[k][w]++; nk[k]++; return k; }));
  return { K, V, alpha, beta, rand, docs: c.docs, z, ndk, nkw, nk, sweeps: 0 };
}

/** Run `n` Gibbs sweeps over every word of every document. */
export function sweep(g: Gibbs, n = 1) {
  const { K, V, alpha, beta, rand, docs, z, ndk, nkw, nk } = g, Vb = V * beta, p = new Float64Array(K);
  for (let s = 0; s < n; s++) {
    for (let d = 0; d < docs.length; d++) {
      const doc = docs[d], zd = z[d], nd = ndk[d];
      for (let i = 0; i < doc.length; i++) {
        const w = doc[i]; let k = zd[i];
        nd[k]--; nkw[k][w]--; nk[k]--;
        let sum = 0;
        for (let t = 0; t < K; t++) { sum += (nd[t] + alpha) * (nkw[t][w] + beta) / (nk[t] + Vb); p[t] = sum; }
        const u = rand() * sum;
        k = 0; while (k < K - 1 && p[k] <= u) k++;
        zd[i] = k; nd[k]++; nkw[k][w]++; nk[k]++;
      }
    }
    g.sweeps++;
  }
}

/** Point estimates from the current sample: phi[k][w] = p(word | topic), theta[d][k] = p(topic | document). */
export function estimate(g: Gibbs): { phi: number[][]; theta: number[][] } {
  const { K, V, alpha, beta } = g;
  const phi = g.nkw.map((row, k) => Array.from(row, (n) => (n + beta) / (g.nk[k] + V * beta)));
  const theta = g.ndk.map((row, d) => Array.from(row, (n) => (n + alpha) / (g.docs[d].length + K * alpha)));
  return { phi, theta };
}

/** Perplexity of the documents under phi and theta: exp(−Σ log Σ_k θ_dk φ_kw / N). Lower is better. */
export function perplexity(docs: number[][], phi: number[][], theta: number[][]): number {
  let ll = 0, N = 0;
  docs.forEach((doc, d) => { for (const w of doc) { let p = 0; for (let k = 0; k < phi.length; k++) p += theta[d][k] * phi[k][w]; ll += Math.log(p); N++; } });
  return N ? Math.exp(-ll / N) : NaN;
}

/** The `n` most probable words of each topic, ties broken by word id. */
export function topWords(phi: number[][], vocab: string[], n = 10): { word: string; p: number }[][] {
  return phi.map((row) => row.map((p, w) => ({ w, p })).sort((a, b) => b.p - a.p || a.w - b.w).slice(0, n).map((x) => ({ word: vocab[x.w], p: x.p })));
}

/** Made-up example corpus: short notes from an imaginary parish archive, written for fibub. */
export const EXAMPLE = `### Note 1
The barley harvest was late this year. The farmers cut the fields in September, and the barn was full of sheaves and straw before the rain came. The wheat was thin, but the barley was good.

### Note 2
The ship left the harbour on the morning tide with a cargo of salt and timber. The captain expected a fair wind, and the sailors were paid at the quay before the voyage.

### Note 3
The choir sang at the evening service, and the new organ was played for the first time. The organist chose a hymn the congregation knew, and the singing filled the church.

### Note 4
Rain ruined the hay in the low meadow. The farmers turned the hay twice, but the fields stayed wet, and the cattle were brought into the barn early for the winter.

### Note 5
A storm drove two ships onto the rocks beyond the harbour. The sailors were saved by boats from the quay, but the cargo of wheat was lost and the captain was blamed for the voyage.

### Note 6
The bells were rung for the wedding, and the choir sang two anthems. The organ needed tuning after the winter, and the organist asked the church for money to mend the pipes.

### Note 7
The ploughing began in March. The farmers sowed barley in the upper fields and oats near the river, and the plough horses were fed on hay from the barn.

### Note 8
The harbour master recorded forty ships this summer. Most carried salt, coal and timber, and the sailors spent their wages in the town before the next voyage.

### Note 9
The hymn books were worn, so the church bought new ones. The choir practised every Thursday, and the organist taught the boys to sing the anthems for Easter.

### Note 10
The sheep were sheared in June and the wool was sold at the market. The farmers said the barley looked strong and the hay would be ready before the harvest.

### Note 11
The captain of the brig wrote from the harbour that the cargo was safe. The ship had waited three days for a wind, and the sailors were restless on the quay.

### Note 12
At the harvest festival the church was decorated with sheaves of wheat and barley. The choir sang a harvest hymn, and the farmers brought bread and apples to the service.

### Note 13
The fishing boats came back to the harbour with a good catch. The sailors mended their nets on the quay, and the captain sent the fish to market by cart.

### Note 14
The organ was rebuilt by a maker from the city. The organist played a long voluntary, and the choir and the congregation sang the hymn that closes the service.

### Note 15
The barn roof was mended before the winter. The farmers stored the oats and the barley, and the cattle were fed on hay and straw until the spring grass came.
`;
