// Read an animated GIF (GIF87a/89a) into whole RGBA frames with their delays, following each frame's disposal rule,
// the way browsers show it. Plain TypeScript, no DOM, so it works in every browser (and in tests/audio.mjs via Node).

export type GifInfo = { width: number; height: number; frames: number; duration: number; loops: number | null; transparent: boolean };
type Part = {
  x: number; y: number; w: number; h: number; interlaced: boolean; palette: Uint8Array | null;
  minCode: number; data: Uint8Array; delay: number; disposal: number; transIndex: number;
};

/** A frame time as browsers play it: delays of 0 or 10 ms become 100 ms. In milliseconds. */
export const frameMs = (cs: number) => (cs <= 1 ? 100 : cs * 10);

function parse(bytes: Uint8Array) {
  const sig = String.fromCharCode(...bytes.subarray(0, 6));
  if (sig !== 'GIF87a' && sig !== 'GIF89a') throw new Error('not-gif');
  const u16 = (o: number) => bytes[o] | (bytes[o + 1] << 8);
  const width = u16(6), height = u16(8), flags = bytes[10], bgIndex = bytes[11];
  let p = 13, global: Uint8Array | null = null;
  if (flags & 0x80) { const n = 3 * (1 << ((flags & 7) + 1)); global = bytes.subarray(p, p + n); p += n; }
  const parts: Part[] = [];
  let gce = { delay: 0, disposal: 0, transIndex: -1 }, loops: number | null = null;
  const blocks = () => { // read sub-blocks, return joined data
    const chunks: Uint8Array[] = []; let total = 0;
    while (p < bytes.length) { const n = bytes[p++]; if (!n) break; chunks.push(bytes.subarray(p, p + n)); total += n; p += n; }
    const out = new Uint8Array(total); let o = 0; for (const c of chunks) { out.set(c, o); o += c.length; }
    return out;
  };
  while (p < bytes.length) {
    const b = bytes[p++];
    if (b === 0x3b) break; // trailer
    if (b === 0x21) {
      const label = bytes[p++];
      if (label === 0xf9) {
        const d = blocks();
        gce = { disposal: (d[0] >> 2) & 7, delay: d[1] | (d[2] << 8), transIndex: d[0] & 1 ? d[3] : -1 };
      } else if (label === 0xff) {
        const id = String.fromCharCode(...bytes.subarray(p + 1, p + 12)); const d = blocks();
        if ((id === 'NETSCAPE2.0' || id === 'ANIMEXTS1.0') && d.length >= 14 && d[11] === 1) loops = d[12] | (d[13] << 8);
      } else blocks();
    } else if (b === 0x2c) {
      const x = u16(p), y = u16(p + 2), w = u16(p + 4), h = u16(p + 6), f = bytes[p + 8]; p += 9;
      let palette: Uint8Array | null = null;
      if (f & 0x80) { const n = 3 * (1 << ((f & 7) + 1)); palette = bytes.subarray(p, p + n); p += n; }
      const minCode = bytes[p++];
      parts.push({ x, y, w, h, interlaced: !!(f & 0x40), palette, minCode, data: blocks(), ...gce });
      gce = { delay: 0, disposal: 0, transIndex: -1 };
    } else break; // damaged file: keep what we have
  }
  if (!parts.length) throw new Error('no-frames');
  return { width, height, global, bgIndex, parts, loops };
}

/** LZW-decode one image's pixel indexes. */
function lzw(minCode: number, data: Uint8Array, count: number): Uint8Array {
  const out = new Uint8Array(count), clear = 1 << minCode, eoi = clear + 1;
  const prefix = new Int16Array(4096), suffix = new Uint8Array(4096), stack = new Uint8Array(4097);
  for (let i = 0; i < clear; i++) suffix[i] = i;
  let size = minCode + 1, mask = (1 << size) - 1, next = eoi + 1, old = -1, first = 0;
  let bits = 0, acc = 0, o = 0, p = 0;
  while (o < count) {
    while (bits < size) { if (p >= data.length) return out; acc |= data[p++] << bits; bits += 8; }
    let code = acc & mask; acc >>>= size; bits -= size;
    if (code === clear) { size = minCode + 1; mask = (1 << size) - 1; next = eoi + 1; old = -1; continue; }
    if (code === eoi) break;
    if (old < 0) { out[o++] = suffix[code]; old = code; first = code; continue; }
    const inCode = code; let sp = 0;
    if (code >= next) { stack[sp++] = first; code = old; }
    while (code > clear) { stack[sp++] = suffix[code]; code = prefix[code]; }
    first = suffix[code]; stack[sp++] = first;
    while (sp && o < count) out[o++] = stack[--sp];
    if (next < 4096) { prefix[next] = old; suffix[next] = first; next++; if (!(next & mask) && next < 4096) { size++; mask = (1 << size) - 1; } }
    old = inCode;
  }
  return out;
}

export function gifInfo(bytes: Uint8Array): GifInfo {
  const g = parse(bytes);
  return {
    width: g.width, height: g.height, frames: g.parts.length, loops: g.loops,
    duration: g.parts.reduce((s, f) => s + frameMs(f.delay), 0) / 1000,
    transparent: g.parts.some((f) => f.transIndex >= 0),
  };
}

/** Each whole frame as RGBA (width × height × 4; transparent pixels have alpha 0) and how long it shows, in ms. */
export function* gifFrames(bytes: Uint8Array): Generator<{ rgba: Uint8ClampedArray; ms: number; index: number }> {
  const g = parse(bytes), W = g.width, H = g.height;
  let canvas = new Uint8ClampedArray(W * H * 4), saved: Uint8ClampedArray | null = null;
  for (let fi = 0; fi < g.parts.length; fi++) {
    const f = g.parts[fi], pal = f.palette ?? g.global;
    if (f.disposal === 3) saved = canvas.slice();
    const idx = lzw(f.minCode, f.data, f.w * f.h);
    // Interlaced images store rows in four passes.
    const rowOf = (r: number) => {
      if (!f.interlaced) return r;
      const p1 = Math.ceil(f.h / 8), p2 = Math.ceil((f.h - 4) / 8), p3 = Math.ceil((f.h - 2) / 4);
      if (r < p1) return r * 8;
      if (r < p1 + p2) return (r - p1) * 8 + 4;
      if (r < p1 + p2 + p3) return (r - p1 - p2) * 4 + 2;
      return (r - p1 - p2 - p3) * 2 + 1;
    };
    if (pal) for (let r = 0; r < f.h; r++) {
      const y = f.y + rowOf(r); if (y >= H) continue;
      for (let c = 0; c < f.w; c++) {
        const x = f.x + c; if (x >= W) continue;
        const k = idx[r * f.w + c]; if (k === f.transIndex || 3 * k + 2 >= pal.length) continue;
        const o = (y * W + x) * 4; canvas[o] = pal[3 * k]; canvas[o + 1] = pal[3 * k + 1]; canvas[o + 2] = pal[3 * k + 2]; canvas[o + 3] = 255;
      }
    }
    yield { rgba: canvas, ms: frameMs(f.delay), index: fi };
    if (f.disposal === 2) { // back to transparent (what browsers do) in the frame's rectangle
      for (let y = f.y; y < Math.min(H, f.y + f.h); y++) canvas.fill(0, (y * W + f.x) * 4, (y * W + Math.min(W, f.x + f.w)) * 4);
    } else if (f.disposal === 3 && saved) canvas = saved;
  }
}
