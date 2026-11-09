// DNA/RNA sequence basics: read FASTA or plain text, reverse complement (IUPAC codes kept), translate with the standard
// genetic code in any of six frames, find open reading frames on both strands, count codons (with RSCU) and GC. No DOM.

const BASES = 'TCAG';
const AA = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG'; // standard code, codons in TCAG order
export const CODE: Record<string, string> = {};
for (let i = 0; i < 64; i++) CODE[BASES[i >> 4] + BASES[(i >> 2) & 3] + BASES[i & 3]] = AA[i];
export const STARTS = ['ATG'];

const COMP: Record<string, string> = { A: 'T', T: 'A', U: 'A', G: 'C', C: 'G', R: 'Y', Y: 'R', S: 'S', W: 'W', K: 'M', M: 'K', B: 'V', V: 'B', D: 'H', H: 'D', N: 'N' };

export type Parsed = { name: string; seq: string; rna: boolean; dropped: number; records: number };

/** Read the first FASTA record (or plain sequence). Spaces, digits and line breaks are ignored; other non-IUPAC letters are dropped and counted. */
export function parse(text: string): Parsed {
  const lines = text.replace(/\r/g, '').split('\n');
  let name = '', records = 0, body: string[] = [];
  for (const l of lines) {
    if (l.startsWith('>')) { records++; if (records === 1) name = l.slice(1).trim(); else break; continue; }
    if (records <= 1) body.push(l);
  }
  const raw = body.join('').toUpperCase().replace(/[\s\d*\-.]/g, '');
  let seq = '', dropped = 0;
  for (const ch of raw) if (ch in COMP) seq += ch; else dropped++;
  const rna = seq.includes('U') && !seq.includes('T');
  return { name, seq: seq.replace(/U/g, 'T'), rna, dropped, records: Math.max(records, 1) };
}

export const reverseComplement = (s: string) => { let o = ''; for (let i = s.length - 1; i >= 0; i--) o += COMP[s[i]] ?? 'N'; return o; };
export const complement = (s: string) => [...s].map((c) => COMP[c] ?? 'N').join('');

/** Protein from a DNA sequence starting at offset (0, 1 or 2); codons with ambiguity codes give X. */
export function translate(s: string, offset = 0) {
  let p = '';
  for (let i = offset; i + 3 <= s.length; i += 3) p += CODE[s.slice(i, i + 3)] ?? 'X';
  return p;
}

export type Orf = { strand: '+' | '−'; frame: number; start: number; end: number; nt: number; aa: number; complete: boolean; protein: string };

/**
 * Open reading frames of at least minAA amino acids (stop not counted) on one or both strands. With startMode 'atg' an
 * ORF runs from the first ATG after a stop to the next stop; with 'stop' it runs from just after one stop (or the start
 * of the sequence) to the next stop. Frames that run off the end without a stop are not listed. Positions are 1-based
 * on the top strand, start ≤ end, the stop codon included. ORFs nested in the same frame are not listed separately.
 */
export function findOrfs(s: string, minAA = 30, startMode: 'atg' | 'stop' = 'atg', both = true): Orf[] {
  const out: Orf[] = [], L = s.length;
  const scan = (seq: string, strand: '+' | '−') => {
    for (let f = 0; f < 3; f++) {
      let begin = startMode === 'stop' ? f : -1;
      for (let i = f; i + 3 <= seq.length; i += 3) {
        const c = seq.slice(i, i + 3);
        if (begin < 0 && STARTS.includes(c)) begin = i;
        if (CODE[c] === '*') {
          if (begin >= 0) {
            const protein = translate(seq.slice(begin, i));
            if (protein.length >= minAA) {
              const [start, end] = strand === '+' ? [begin + 1, i + 3] : [L - i - 2, L - begin];
              out.push({ strand, frame: f + 1, start, end, nt: i + 3 - begin, aa: protein.length, complete: STARTS.includes(seq.slice(begin, begin + 3)), protein });
            }
          }
          begin = startMode === 'stop' ? i + 3 : -1;
        }
      }
    }
  };
  scan(s, '+');
  if (both) scan(reverseComplement(s), '−');
  return out.sort((x, y) => y.aa - x.aa || x.start - y.start);
}

/** Codon counts and relative synonymous codon usage over in-frame codons of the given coding sequences. */
export function codonUsage(cds: string[]) {
  const n: Record<string, number> = {};
  for (const c of Object.keys(CODE)) n[c] = 0;
  for (const s of cds) for (let i = 0; i + 3 <= s.length; i += 3) { const c = s.slice(i, i + 3); if (c in n) n[c]++; }
  const byAA: Record<string, string[]> = {};
  for (const [c, a] of Object.entries(CODE)) (byAA[a] ??= []).push(c);
  const rscu: Record<string, number> = {}, total = Object.values(n).reduce((a, b) => a + b, 0);
  for (const cs of Object.values(byAA)) { const t = cs.reduce((a, c) => a + n[c], 0); for (const c of cs) rscu[c] = t ? (n[c] * cs.length) / t : NaN; }
  return { n, rscu, total, byAA };
}

/** GC fraction over unambiguous bases (S counts as GC, W as AT; other ambiguity codes are left out). */
export function gc(s: string) {
  let g = 0, t = 0;
  for (const c of s) { if (c === 'G' || c === 'C' || c === 'S') { g++; t++; } else if (c === 'A' || c === 'T' || c === 'W') t++; }
  return t ? g / t : NaN;
}

/** Base counts. */
export function counts(s: string) { const o: Record<string, number> = {}; for (const c of s) o[c] = (o[c] ?? 0) + 1; return o; }
