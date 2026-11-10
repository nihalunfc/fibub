// A small animated GIF (GIF89a) writer: a 256-colour palette per frame (median cut, or a fixed 6x7x6 web palette)
// and LZW compression. Plain TypeScript, no DOM, so it can be checked on its own.

export type Palette = { rgb: Uint8Array; n: number };

/** Median cut on a sample of the frame's pixels: up to 256 colours that suit this frame. */
export function medianCut(px: Uint8ClampedArray, max = 256): Palette {
  const total = px.length >> 2, step = Math.max(1, Math.floor(total / 40000));
  const s: number[] = [];
  for (let i = 0; i < total; i += step) { const o = i << 2; s.push((px[o] << 16) | (px[o + 1] << 8) | px[o + 2]); }
  const all = Uint32Array.from(s);
  type Box = { a: number; b: number; ch: number; range: number };
  const measure = (a: number, b: number): Box => {
    const lo = [255, 255, 255], hi = [0, 0, 0];
    for (let i = a; i < b; i++) { const v = all[i]; for (let c = 0; c < 3; c++) { const x = (v >> (16 - 8 * c)) & 255; if (x < lo[c]) lo[c] = x; if (x > hi[c]) hi[c] = x; } }
    const r = [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]], ch = r[1] >= r[0] && r[1] >= r[2] ? 1 : r[0] >= r[2] ? 0 : 2;
    return { a, b, ch, range: r[ch] };
  };
  const boxes: Box[] = [measure(0, all.length)];
  while (boxes.length < max) {
    let best = -1, score = 0;
    for (let i = 0; i < boxes.length; i++) { const bx = boxes[i], sc = bx.range * (bx.b - bx.a); if (bx.b - bx.a > 1 && bx.range > 0 && sc > score) { score = sc; best = i; } }
    if (best < 0) break;
    const bx = boxes[best], sh = 16 - 8 * bx.ch;
    all.subarray(bx.a, bx.b).sort((p, q) => ((p >> sh) & 255) - ((q >> sh) & 255));
    const mid = (bx.a + bx.b) >> 1;
    boxes.splice(best, 1, measure(bx.a, mid), measure(mid, bx.b));
  }
  const rgb = new Uint8Array(256 * 3);
  boxes.forEach((bx, k) => {
    let r = 0, g = 0, b = 0;
    for (let i = bx.a; i < bx.b; i++) { const v = all[i]; r += (v >> 16) & 255; g += (v >> 8) & 255; b += v & 255; }
    const n = bx.b - bx.a || 1;
    rgb[k * 3] = Math.round(r / n); rgb[k * 3 + 1] = Math.round(g / n); rgb[k * 3 + 2] = Math.round(b / n);
  });
  return { rgb, n: boxes.length };
}

/** A fixed palette: 6 reds x 7 greens x 6 blues (252 colours), the same for every frame. */
export function fixedPalette(): Palette {
  const rgb = new Uint8Array(256 * 3); let k = 0;
  for (let r = 0; r < 6; r++) for (let g = 0; g < 7; g++) for (let b = 0; b < 6; b++, k++) {
    rgb[k * 3] = Math.round((r * 255) / 5); rgb[k * 3 + 1] = Math.round((g * 255) / 6); rgb[k * 3 + 2] = Math.round((b * 255) / 5);
  }
  return { rgb, n: 252 };
}

/** Each pixel's nearest palette colour (looked up once per 5-bit colour cell). */
export function mapPixels(px: Uint8ClampedArray, pal: Palette): Uint8Array {
  const n = px.length >> 2, out = new Uint8Array(n), cache = new Int16Array(32768).fill(-1), P = pal.rgb;
  for (let i = 0; i < n; i++) {
    const o = i << 2, r = px[o], g = px[o + 1], b = px[o + 2], key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    let c = cache[key];
    if (c < 0) {
      let best = 1e9; c = 0;
      for (let k = 0; k < pal.n; k++) { const dr = P[k * 3] - r, dg = P[k * 3 + 1] - g, db = P[k * 3 + 2] - b, d = 2 * dr * dr + 4 * dg * dg + 3 * db * db; if (d < best) { best = d; c = k; } }
      cache[key] = c;
    }
    out[i] = c;
  }
  return out;
}

class Bytes {
  buf = new Uint8Array(1 << 16); len = 0;
  grow(k: number) { if (this.len + k > this.buf.length) { const b = new Uint8Array(Math.max(this.buf.length * 2, this.len + k)); b.set(this.buf.subarray(0, this.len)); this.buf = b; } }
  byte(v: number) { this.grow(1); this.buf[this.len++] = v; }
  word(v: number) { this.byte(v & 255); this.byte((v >> 8) & 255); }
  bytes(a: ArrayLike<number>) { this.grow(a.length); this.buf.set(a as Uint8Array, this.len); this.len += a.length; }
  str(s: string) { for (let i = 0; i < s.length; i++) this.byte(s.charCodeAt(i)); }
  out() { return this.buf.slice(0, this.len); }
}

const table = new Int16Array(1 << 20);
const stamp = new Uint16Array(1 << 20);
let gen = 0;

/** LZW-compress palette indices into GIF data sub-blocks (minimum code size 8). */
export function lzw(idx: Uint8Array, w: Bytes) {
  const min = 8, clear = 1 << min, eoi = clear + 1;
  let size = min + 1, next = eoi + 1, cur = 0, bits = 0;
  const block: number[] = [];
  const flushByte = (b: number) => { block.push(b); if (block.length === 255) { w.byte(255); w.bytes(block); block.length = 0; } };
  const emit = (code: number) => { cur |= code << bits; bits += size; while (bits >= 8) { flushByte(cur & 255); cur >>>= 8; bits -= 8; } };
  const reset = () => { gen++; if (gen > 65535) { stamp.fill(0); gen = 1; } };
  reset(); emit(clear);
  let prefix = idx[0];
  for (let i = 1; i < idx.length; i++) {
    const k = idx[i], key = (prefix << 8) | k;
    if (stamp[key] === gen) { prefix = table[key]; continue; }
    emit(prefix);
    if (next === 4096) { emit(clear); next = eoi + 1; size = min + 1; reset(); }
    else { if (next >= 1 << size) size++; stamp[key] = gen; table[key] = next++; }
    prefix = k;
  }
  emit(prefix); emit(eoi);
  if (bits > 0) flushByte(cur & 255);
  if (block.length) { w.byte(block.length); w.bytes(block); }
  w.byte(0);
}

export class GifWriter {
  private w = new Bytes(); frames = 0;
  constructor(public width: number, public height: number, loop: boolean) {
    const w = this.w;
    w.str('GIF89a'); w.word(width); w.word(height); w.byte(0x70); w.byte(0); w.byte(0); // no global colour table
    if (loop) { w.byte(0x21); w.byte(0xff); w.byte(11); w.str('NETSCAPE2.0'); w.byte(3); w.byte(1); w.word(0); w.byte(0); }
  }
  /** Add one frame: indices into its own 256-colour table, shown for `delay` hundredths of a second. */
  frame(idx: Uint8Array, pal: Palette, delay: number) {
    const w = this.w;
    w.byte(0x21); w.byte(0xf9); w.byte(4); w.byte(0x04); w.word(delay); w.byte(0); w.byte(0); // graphic control: keep frame
    w.byte(0x2c); w.word(0); w.word(0); w.word(this.width); w.word(this.height); w.byte(0x87); // local table of 256
    w.bytes(pal.rgb); w.byte(8); lzw(idx, w); this.frames++;
  }
  finish(): Uint8Array { this.w.byte(0x3b); return this.w.out(); }
  get size() { return this.w.len; }
}

/** Frames and delay for a clip: GIF delays are whole hundredths of a second. */
export function plan(start: number, end: number, fps: number) {
  const len = Math.max(0, end - start), frames = Math.max(1, Math.round(len * fps));
  return { frames, delay: Math.max(2, Math.round(100 / fps)), times: Array.from({ length: frames }, (_, i) => start + (i + 0.5) / fps) };
}
