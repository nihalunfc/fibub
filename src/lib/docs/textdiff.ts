// Word-level comparison of two texts. Plain TypeScript, no DOM.
export interface Word { w: string; nl: number } // nl = line breaks after the word (0, 1 or 2)
export type Op = { t: 'eq' | 'ins' | 'del'; words: Word[] };
export interface Diff { ops: Op[]; changes: number; added: number; removed: number; same: boolean }

export function tokenise(text: string): Word[] {
  const out: Word[] = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  let blank = 0;
  for (const line of lines) {
    const ws = line.split(/\s+/).filter(Boolean);
    if (!ws.length) { blank++; if (out.length) out[out.length - 1].nl = Math.min(2, Math.max(out[out.length - 1].nl, blank + 1)); continue; }
    blank = 0;
    ws.forEach((w) => out.push({ w, nl: 0 }));
    out[out.length - 1].nl = Math.max(out[out.length - 1].nl, 1);
  }
  return out;
}

const MAX_D = 2000;
/** Myers' shortest-edit-script on the middle part; returns edit ops over index ranges, or null if too different. */
function myers(a: string[], b: string[]): ('eq' | 'ins' | 'del')[] | null {
  const n = a.length, m = b.length, max = Math.min(n + m, MAX_D), off = max + 1;
  let v = new Int32Array(2 * max + 3); const trace: Int32Array[] = [];
  for (let d = 0; d <= max; d++) {
    trace.push(v.slice());
    for (let k = -d; k <= d; k += 2) {
      let x = k === -d || (k !== d && v[off + k - 1] < v[off + k + 1]) ? v[off + k + 1] : v[off + k - 1] + 1, y = x - k;
      while (x < n && y < m && a[x] === b[y]) { x++; y++; }
      v[off + k] = x;
      if (x >= n && y >= m) {
        const ops: ('eq' | 'ins' | 'del')[] = []; let cx = n, cy = m;
        for (let dd = d; dd > 0; dd--) {
          const pv = trace[dd], kk = cx - cy;
          const down = kk === -dd || (kk !== dd && pv[off + kk - 1] < pv[off + kk + 1]);
          const pk = down ? kk + 1 : kk - 1, px = pv[off + pk], py = px - pk;
          const mx = down ? px : px + 1, my = down ? py + 1 : py;
          while (cx > mx && cy > my) { ops.push('eq'); cx--; cy--; }
          if (down) { ops.push('ins'); cy--; } else { ops.push('del'); cx--; }
        }
        while (cx > 0 && cy > 0) { ops.push('eq'); cx--; cy--; }
        return ops.reverse();
      }
    }
  }
  return null;
}

export function diffWords(aText: string, bText: string, ignoreCase = false): Diff {
  const A = tokenise(aText), B = tokenise(bText), key = (w: Word) => (ignoreCase ? w.w.toLowerCase() : w.w);
  const ak = A.map(key), bk = B.map(key);
  let s = 0; while (s < ak.length && s < bk.length && ak[s] === bk[s]) s++;
  let e = 0; while (e < ak.length - s && e < bk.length - s && ak[ak.length - 1 - e] === bk[bk.length - 1 - e]) e++;
  const midA = ak.slice(s, ak.length - e), midB = bk.slice(s, bk.length - e);
  let script = midA.length || midB.length ? myers(midA, midB) : [];
  if (!script) script = [...midA.map(() => 'del' as const), ...midB.map(() => 'ins' as const)];
  const ops: Op[] = [], push = (t: Op['t'], w: Word) => { const l = ops[ops.length - 1]; if (l && l.t === t) l.words.push(w); else ops.push({ t, words: [w] }); };
  for (let i = 0; i < s; i++) push('eq', B[i]);
  let ia = s, ib = s;
  // Show deletions before insertions inside one change.
  const group: { del: Word[]; ins: Word[] } = { del: [], ins: [] };
  const flush = () => { group.del.forEach((w) => push('del', w)); group.ins.forEach((w) => push('ins', w)); group.del = []; group.ins = []; };
  for (const o of script) {
    if (o === 'eq') { flush(); push('eq', B[ib]); ia++; ib++; }
    else if (o === 'del') group.del.push(A[ia++]); else group.ins.push(B[ib++]);
  }
  flush();
  for (let i = B.length - e; i < B.length; i++) push('eq', B[i]);
  let changes = 0, added = 0, removed = 0, inChange = false;
  for (const o of ops) {
    if (o.t === 'eq') inChange = false; else { if (!inChange) changes++; inChange = true; if (o.t === 'ins') added += o.words.length; else removed += o.words.length; }
  }
  return { ops, changes, added, removed, same: changes === 0 };
}
