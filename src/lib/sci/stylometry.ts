// Stylometry with Burrows' Delta (Burrows 2002, "'Delta': a measure of stylistic difference and a guide to likely
// authorship", Literary and Linguistic Computing 17(3)). Each text becomes the relative frequencies of the corpus's
// most frequent words; each word's frequencies are turned into z-scores; Delta between two texts is the mean
// absolute difference of their z-scores. Plain TypeScript, no DOM.

export type Text = { name: string; text: string };

/** Lower-case word tokens: runs of letters (any script), with inner apostrophes kept (don't, o'clock). Numbers are dropped. */
export function tokenize(s: string): string[] {
  return s.toLowerCase().replace(/[’ʼ]/g, "'").match(/[\p{L}\p{M}]+(?:'[\p{L}\p{M}]+)*/gu) ?? [];
}

/** The author part of a text's name, as stylo names files: everything before the first "_" (or " - "). */
export function authorOf(name: string): string {
  const s = name.replace(/\.(txt|text|md)$/i, '');
  const i = s.search(/_| - /);
  return (i > 0 ? s.slice(0, i) : s).trim();
}

/** Split pasted text into texts at lines that start with "###" (the rest of the line is the name). */
export function splitTexts(raw: string): Text[] {
  const out: Text[] = [];
  let cur: Text | null = null;
  for (const line of raw.split(/\r?\n/)) {
    const m = /^\s*###\s*(.*)$/.exec(line);
    if (m) { cur = { name: m[1].trim() || `Text ${out.length + 1}`, text: '' }; out.push(cur); continue; }
    if (!cur) { if (!line.trim()) continue; cur = { name: 'Text 1', text: '' }; out.push(cur); }
    cur.text += line + '\n';
  }
  return out;
}

export type DeltaResult = {
  names: string[]; authors: string[]; tokens: number[];
  /** The most frequent words used, most frequent first, and their counts in the whole corpus. */
  words: string[]; counts: number[];
  /** freq[t][w]: relative frequency of word w in text t, in % of the text's words. */
  freq: number[][];
  mean: number[]; sd: number[];
  z: number[][];
  /** dist[a][b]: Burrows' Delta between texts a and b. */
  dist: number[][];
  /** Words left out because their spread was zero in the reference texts. */
  flat: string[];
  /** Texts whose frequencies set the means and spreads (all, or all but the disputed one). */
  ref: number[];
};

/**
 * Burrows' Delta for a set of texts. `mfw`: how many of the corpus's most frequent words to use (ties broken
 * alphabetically). If `disputed` is the index of a text, the means and standard deviations come from the other
 * texts only, as in Burrows (2002); otherwise from all texts. Standard deviations are sample ones (n − 1).
 */
export function burrowsDelta(texts: Text[], mfw: number, disputed = -1): DeltaResult {
  const toks = texts.map((t) => tokenize(t.text));
  const total = new Map<string, number>();
  const per = toks.map((ts) => { const m = new Map<string, number>(); for (const w of ts) { m.set(w, (m.get(w) ?? 0) + 1); total.set(w, (total.get(w) ?? 0) + 1); } return m; });
  const ranked = [...total.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).slice(0, Math.max(1, Math.floor(mfw)));
  const ref = texts.map((_, i) => i).filter((i) => i !== disputed);
  const freqAll = per.map((m, t) => ranked.map(([w]) => (toks[t].length ? (100 * (m.get(w) ?? 0)) / toks[t].length : 0)));
  const keep: number[] = [], flat: string[] = [], mean: number[] = [], sd: number[] = [];
  ranked.forEach(([w], k) => {
    const xs = ref.map((t) => freqAll[t][k]);
    const mu = xs.reduce((a, b) => a + b, 0) / xs.length;
    const s = xs.length > 1 ? Math.sqrt(xs.reduce((a, b) => a + (b - mu) ** 2, 0) / (xs.length - 1)) : 0;
    if (!(s > 1e-12)) { flat.push(w); return; }
    keep.push(k); mean.push(mu); sd.push(s);
  });
  const words = keep.map((k) => ranked[k][0]), counts = keep.map((k) => ranked[k][1]);
  const freq = freqAll.map((row) => keep.map((k) => row[k]));
  const z = freq.map((row) => row.map((f, j) => (f - mean[j]) / sd[j]));
  const n = texts.length, W = words.length;
  const dist = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
    let s = 0; for (let j = 0; j < W; j++) s += Math.abs(z[a][j] - z[b][j]);
    dist[a][b] = dist[b][a] = W ? s / W : 0;
  }
  return { names: texts.map((t) => t.name), authors: texts.map((t) => authorOf(t.name)), tokens: toks.map((t) => t.length), words, counts, freq, mean, sd, z, dist, flat, ref };
}

export type Merge = { a: number; b: number; height: number; size: number };

/**
 * Average-linkage (UPGMA) clustering of a distance matrix. Clusters are numbered as in scipy: leaves 0..n−1, the
 * k-th merge makes cluster n+k. Ties go to the pair found first. `order` is the leaf order for drawing.
 */
export function upgma(dist: number[][]): { merges: Merge[]; order: number[] } {
  const n = dist.length;
  if (n < 2) return { merges: [], order: n ? [0] : [] };
  let active = Array.from({ length: n }, (_, i) => i);
  const size = new Map<number, number>(active.map((i) => [i, 1]));
  const D = new Map<string, number>();
  const key = (i: number, j: number) => (i < j ? `${i},${j}` : `${j},${i}`);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) D.set(key(i, j), dist[i][j]);
  const merges: Merge[] = [];
  const kids = new Map<number, [number, number]>();
  for (let k = 0; k < n - 1; k++) {
    let best = Infinity, bi = -1, bj = -1;
    for (let x = 0; x < active.length; x++) for (let y = x + 1; y < active.length; y++) {
      const d = D.get(key(active[x], active[y]))!;
      if (d < best - 1e-12) { best = d; bi = active[x]; bj = active[y]; }
    }
    const c = n + k, si = size.get(bi)!, sj = size.get(bj)!;
    active = active.filter((v) => v !== bi && v !== bj);
    for (const o of active) D.set(key(c, o), (si * D.get(key(bi, o))! + sj * D.get(key(bj, o))!) / (si + sj));
    active.push(c); size.set(c, si + sj); kids.set(c, [Math.min(bi, bj), Math.max(bi, bj)]);
    merges.push({ a: Math.min(bi, bj), b: Math.max(bi, bj), height: best, size: si + sj });
  }
  const order: number[] = [];
  const walk = (c: number) => { const ch = kids.get(c); if (!ch) { order.push(c); return; } walk(ch[0]); walk(ch[1]); };
  walk(2 * n - 2);
  return { merges, order };
}

/** Rank the other texts, and the authors (mean Delta to their texts), by closeness to the disputed text. */
export function attribute(r: DeltaResult, disputed: number) {
  const texts = r.names.map((name, i) => ({ i, name, author: r.authors[i], delta: r.dist[disputed][i] })).filter((t) => t.i !== disputed).sort((a, b) => a.delta - b.delta);
  const by = new Map<string, number[]>();
  for (const t of texts) by.set(t.author, [...(by.get(t.author) ?? []), t.delta]);
  const authors = [...by.entries()].map(([author, ds]) => ({ author, texts: ds.length, delta: ds.reduce((a, b) => a + b, 0) / ds.length, min: Math.min(...ds) })).sort((a, b) => a.delta - b.delta);
  return { texts, authors };
}

/** Made-up example texts, written for fibub in three invented voices; "Unsigned_note" is the disputed one. */
export const EXAMPLE = `### Ashworth_letter-one
Upon my arrival at the harbour I found the town in a state of some agitation, for the mail packet, which had been expected upon the Tuesday, had not been seen, and the merchants, whose fortunes depended upon it, were gathered at the quay in considerable numbers. I shall not trouble you with the particulars of the rumours which passed amongst them, for they were many and for the most part absurd; it is sufficient to say that the general opinion, which I confess I shared, was that the vessel had been delayed by the weather, which had been unsettled for the whole of the week. Whilst we waited, the harbour master, a gentleman of great civility, invited me to his house, where I passed the evening in conversation upon the history of the port, of which he possesses a knowledge that is both extensive and exact.

### Ashworth_letter-two
It is with no small satisfaction that I write to inform you of the completion of the survey, which has occupied the greater part of the summer. The difficulties of the work were considerable, for the ground upon which the old abbey stood has been much disturbed, and the stones of which it was built have been carried away by the farmers of the district for the repair of their walls. I shall, however, be able to give you a plan of the whole, which I believe to be as complete as the state of the ruins permits. Whilst the measurements were being taken, I made enquiries amongst the older inhabitants of the parish, of whom several remembered the tower, which fell, as they inform me, in the great storm of their childhood, and of which nothing now remains but the foundation and a portion of the stair.

### Brennan_diary-one
So I got to the market really early today, before anyone else, and you know what, it was just lovely. The light was all soft and the stalls were only half set up, and I just walked around with my coffee and watched everyone. I bought some apples and a bit of cheese, and then I got talking to the man who sells the honey, and he told me all about his bees. I didn't know they can tell each other where the flowers are! He says they dance it. I'm not sure I believe him, but it's a nice idea, isn't it? Then it started to rain so I ran home, and now I'm sitting here with wet socks, and honestly I don't even mind. It's been a good day. I think I'll go back next week and ask him more about the dancing.

### Brennan_diary-two
Okay, so the bike is fixed, finally. I took it to the shop on the corner and the girl there just looked at it for about two seconds and said, it's the chain, you know, and I felt a bit silly. I'd been fiddling with it for days. Anyway, she fixed it really quickly and didn't even charge me, so I bought a new light from her instead, just to say thanks. Then I rode it all the way to the river and back, and it was so good to be out. I'd forgotten how much I like it. You just go, and the wind is in your face, and you don't think about anything. I'm going to ride to work tomorrow, I think, if it doesn't rain. Fingers crossed. I really need to get fitter anyway.

### Coyle_story-one
The house stood at the end of the lane, and she had walked past it every morning for a year before she noticed the light in the upper window. It was a small light, yellow and steady, and it was always there, even in the middle of the day. She asked the woman at the bakery about it, but the woman only shook her head and said that nobody had lived there for a long time. That evening she walked home the long way, past the house, and the light was there again, and in the window she saw the shape of a figure, very still, looking down at the lane. She did not stop. She told herself that it was a trick of the glass, and she went home and made her supper and did not think about it again until the morning.

### Coyle_story-two
The boat had been in the shed for as long as he could remember. His father had built it in the winter that he was born, and had taken it out on the lake only once, in the spring, and then had put it away and never spoken of it again. When the old man died, he went down to the shed and pulled back the canvas, and the wood was still smooth and pale under the dust. He ran his hand along the side of it. In the corner of the shed he found the oars, and a tin of varnish that had dried to a hard brown cake, and a notebook in which his father had written the names of the trees from which each plank had been cut. He sat down on the floor and read it until the light was gone.

### Unsigned_note
So the trip was really good, honestly. I got there just after lunch and the cottage was so much nicer than the pictures, you know, with a little garden and a bench at the back. I just sat out there with a cup of tea and didn't do anything for about an hour, and it was great. Then I walked down to the village and got some bread and a bit of fish for dinner. The woman in the shop was really chatty, she told me all about the festival next week, and I think I might go back for it. It's only an hour on the train. Anyway, I'm tired now, so I'm going to read for a bit and then sleep. I'll write more tomorrow, I promise.
`;
