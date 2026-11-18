// Music file tags and audio facts, read and written in plain TypeScript (no DOM, no packages): bytes in, bytes out.
// Reads ID3v2.2/2.3/2.4 and ID3v1 (MP3, and ID3 chunks in WAV), FLAC Vorbis comments and PICTURE blocks, MP4/M4A
// ilst atoms, WAV LIST/INFO, and Ogg Vorbis/Opus comments. Writes MP3 (ID3v2.3, UTF-16 text), FLAC (Vorbis comment
// block, padding kept so the audio usually stays where it was), WAV (id3 chunk + LIST/INFO) and MP4/M4A (ilst, with
// chunk offsets in stco/co64 moved when the moov box grows or shrinks; fragmented MP4 is refused). Ogg is read only.
// The audio bytes are never touched: writers copy them across unchanged. Checks: node tests/music-tags.mjs

export type TextField = 'title' | 'artist' | 'album' | 'albumArtist' | 'genre' | 'year' | 'track' | 'bpm' | 'key' | 'comment' | 'label' | 'isrc';
export type Picture = { mime: string; data: Uint8Array; type: number; desc: string };
/** Text fields as strings ('' or missing = none). cover: a picture, null = no cover (remove), undefined = leave pictures as they are. */
export type Tags = Partial<Record<TextField, string>> & { cover?: Picture | null };
export type Format = 'mp3' | 'flac' | 'mp4' | 'wav' | 'ogg' | 'unknown';
export type AudioInfo = {
  codec: string; // 'MP3', 'FLAC', 'AAC', 'ALAC', 'PCM', 'Vorbis', 'Opus'
  lossless: boolean;
  sampleRate: number;
  channels: number;
  bits?: number;
  bitrate: number; // average kbps (0 if unknown)
  vbr: boolean;
  duration: number; // seconds (0 if unknown)
  mpeg?: { version: '1' | '2' | '2.5'; layer: 1 | 2 | 3; frameBitrate: number; vbrHeader: 'Xing' | 'Info' | 'VBRI' | null; frames?: number; mode: string };
};
export type ReadResult = { format: Format; tags: Tags; info: AudioInfo | null; tagTypes: string[]; writable: boolean; note?: string };

export const FIELDS: { id: TextField; label: string }[] = [
  { id: 'title', label: 'Title' }, { id: 'artist', label: 'Artist' }, { id: 'album', label: 'Album' }, { id: 'albumArtist', label: 'Album artist' },
  { id: 'genre', label: 'Genre' }, { id: 'year', label: 'Year' }, { id: 'track', label: 'Track' }, { id: 'bpm', label: 'BPM' },
  { id: 'key', label: 'Key' }, { id: 'comment', label: 'Comment' }, { id: 'label', label: 'Label' }, { id: 'isrc', label: 'ISRC' },
];

// ID3v1 genre numbers (0-79 from the ID3v1 list, 80-147 the Winamp extension). 133 is given its modern name.
export const GENRES = ('Blues|Classic Rock|Country|Dance|Disco|Funk|Grunge|Hip-Hop|Jazz|Metal|New Age|Oldies|Other|Pop|R&B|Rap|Reggae|Rock|Techno|' +
  'Industrial|Alternative|Ska|Death Metal|Pranks|Soundtrack|Euro-Techno|Ambient|Trip-Hop|Vocal|Jazz+Funk|Fusion|Trance|Classical|Instrumental|' +
  'Acid|House|Game|Sound Clip|Gospel|Noise|AlternRock|Bass|Soul|Punk|Space|Meditative|Instrumental Pop|Instrumental Rock|Ethnic|Gothic|Darkwave|' +
  'Techno-Industrial|Electronic|Pop-Folk|Eurodance|Dream|Southern Rock|Comedy|Cult|Gangsta|Top 40|Christian Rap|Pop/Funk|Jungle|Native American|' +
  'Cabaret|New Wave|Psychedelic|Rave|Showtunes|Trailer|Lo-Fi|Tribal|Acid Punk|Acid Jazz|Polka|Retro|Musical|Rock & Roll|Hard Rock|Folk|Folk-Rock|' +
  'National Folk|Swing|Fast Fusion|Bebop|Latin|Revival|Celtic|Bluegrass|Avantgarde|Gothic Rock|Progressive Rock|Psychedelic Rock|Symphonic Rock|' +
  'Slow Rock|Big Band|Chorus|Easy Listening|Acoustic|Humour|Speech|Chanson|Opera|Chamber Music|Sonata|Symphony|Booty Bass|Primus|Porn Groove|' +
  'Satire|Slow Jam|Club|Tango|Samba|Folklore|Ballad|Power Ballad|Rhythmic Soul|Freestyle|Duet|Punk Rock|Drum Solo|A Cappella|Euro-House|' +
  'Dance Hall|Goa|Drum & Bass|Club-House|Hardcore|Terror|Indie|BritPop|Afro-Punk|Polsk Punk|Beat|Christian Gangsta Rap|Heavy Metal|Black Metal|' +
  'Crossover|Contemporary Christian|Christian Rock|Merengue|Salsa|Thrash Metal|Anime|JPop|Synthpop').split('|');

// ---------- bytes ----------
const u16 = (b: Uint8Array, o: number) => (b[o] << 8) | b[o + 1];
const u24 = (b: Uint8Array, o: number) => (b[o] << 16) | (b[o + 1] << 8) | b[o + 2];
const u32 = (b: Uint8Array, o: number) => b[o] * 0x1000000 + ((b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]);
const u32le = (b: Uint8Array, o: number) => b[o + 3] * 0x1000000 + ((b[o + 2] << 16) | (b[o + 1] << 8) | b[o]);
const u64 = (b: Uint8Array, o: number) => u32(b, o) * 0x100000000 + u32(b, o + 4);
const u64le = (b: Uint8Array, o: number) => u32le(b, o + 4) * 0x100000000 + u32le(b, o);
const syncsafe = (b: Uint8Array, o: number) => ((b[o] & 0x7f) << 21) | ((b[o + 1] & 0x7f) << 14) | ((b[o + 2] & 0x7f) << 7) | (b[o + 3] & 0x7f);
const ascii = (b: Uint8Array, o: number, n: number) => { let s = ''; for (let i = 0; i < n && o + i < b.length; i++) s += String.fromCharCode(b[o + i]); return s; };
const latin1 = (b: Uint8Array) => { let s = ''; for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return s; };
const utf8d = (b: Uint8Array) => new TextDecoder('utf-8').decode(b);
const utf8e = (s: string) => new TextEncoder().encode(s);
const latin1e = (s: string) => Uint8Array.from(s, (c) => { const x = c.charCodeAt(0); return x < 256 ? x : 63; });
export function concat(parts: Uint8Array[]): Uint8Array {
  let n = 0; for (const p of parts) n += p.length;
  const out = new Uint8Array(n); let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}
const be32 = (v: number) => Uint8Array.of((v / 0x1000000) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff);
const le32 = (v: number) => Uint8Array.of(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v / 0x1000000) & 0xff);
const ss32 = (v: number) => Uint8Array.of((v >> 21) & 0x7f, (v >> 14) & 0x7f, (v >> 7) & 0x7f, v & 0x7f);
const tag4 = (s: string) => Uint8Array.from(s.slice(0, 4).padEnd(4, ' '), (c) => c.charCodeAt(0) & 0xff);
const clean = (s: string) => s.replace(/﻿/g, '').replace(/\u0000+$/g, '').trim();

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
export function fromBase64(s: string): Uint8Array {
  const t = s.replace(/[^A-Za-z0-9+/]/g, ''), out = new Uint8Array(Math.floor((t.length * 3) / 4));
  let o = 0, acc = 0, bits = 0;
  for (const c of t) { acc = (acc << 6) | B64.indexOf(c); bits += 6; if (bits >= 8) { bits -= 8; out[o++] = (acc >> bits) & 0xff; } }
  return out.subarray(0, o);
}

/** Guess an image's type from its first bytes. */
export function imageMime(b: Uint8Array): string {
  if (b[0] === 0xff && b[1] === 0xd8) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (ascii(b, 0, 3) === 'GIF') return 'image/gif';
  if (ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 4) === 'WEBP') return 'image/webp';
  return 'image/jpeg';
}

/** A genre as people read it: ID3 numbers like "(17)" or "17" become names. */
export function genreName(g: string): string {
  const s = g.trim();
  const m = s.match(/^\((\d+)\)(.*)$/);
  if (m) return m[2].trim() || GENRES[+m[1]] || s;
  if (/^\d+$/.test(s)) return GENRES[+s] ?? s;
  if (s === '(RX)') return 'Remix';
  if (s === '(CR)') return 'Cover';
  return s;
}

// ---------- ID3v2 ----------
type Frame = { id: string; flags: number; body: Uint8Array; ver: number };
type Id3 = { ver: number; size: number; frames: Frame[] };

const unsync = (b: Uint8Array) => {
  const out: number[] = [];
  for (let i = 0; i < b.length; i++) { out.push(b[i]); if (b[i] === 0xff && b[i + 1] === 0) i++; }
  return Uint8Array.from(out);
};

/** The size of an ID3v2 tag at offset o (header + body + footer), or 0 if none. */
export function id3Size(b: Uint8Array, o = 0): number {
  if (b.length < o + 10 || ascii(b, o, 3) !== 'ID3' || b[o + 3] > 4 || b[o + 3] < 2) return 0;
  return 10 + syncsafe(b, o + 6) + (b[o + 3] === 4 && b[o + 5] & 0x10 ? 10 : 0);
}

const validId = (s: string) => /^[A-Z0-9]{3,4}$/.test(s);

function parseId3(b: Uint8Array, o = 0): Id3 | null {
  const total = id3Size(b, o);
  if (!total) return null;
  const ver = b[o + 3], flags = b[o + 5];
  let body = b.subarray(o + 10, Math.min(b.length, o + 10 + syncsafe(b, o + 6)));
  if (ver < 4 && flags & 0x80) body = unsync(body);
  let p = 0;
  if (flags & 0x40) p = ver === 3 ? 4 + u32(body, 0) : ver === 4 ? syncsafe(body, 0) : 0;
  const frames: Frame[] = [];
  const idLen = ver === 2 ? 3 : 4, hLen = ver === 2 ? 6 : 10;
  // Some writers put plain (not syncsafe) frame sizes in ID3v2.4; check which reading lands on a frame.
  let plain4 = false;
  if (ver === 4) {
    const fits = (sz: (q: number) => number) => {
      let q = p;
      for (let k = 0; k < 64 && q + 10 <= body.length; k++) {
        const id = ascii(body, q, 4); if (body[q] === 0) return true; if (!validId(id)) return false;
        q += 10 + sz(q + 4); if (q > body.length) return false;
      }
      return true;
    };
    plain4 = !fits((q) => syncsafe(body, q)) && fits((q) => u32(body, q));
  }
  while (p + hLen <= body.length) {
    if (body[p] === 0) break;
    const id = ascii(body, p, idLen);
    if (!validId(id)) break;
    const size = ver === 2 ? u24(body, p + 3) : ver === 3 || plain4 ? u32(body, p + 4) : syncsafe(body, p + 4);
    const fl = ver === 2 ? 0 : u16(body, p + 8);
    let fb = body.subarray(p + hLen, Math.min(body.length, p + hLen + size));
    p += hLen + size;
    if (ver === 3) {
      if (fl & 0xc0) continue; // compressed or encrypted: skip
      if (fl & 0x20) fb = fb.subarray(1); // grouping byte
    } else if (ver === 4) {
      if (fl & 0x0c) continue; // compressed or encrypted
      if (fl & 0x40) fb = fb.subarray(1);
      if (fl & 0x01) fb = fb.subarray(4);
      if (fl & 0x02 || flags & 0x80) fb = unsync(fb);
    }
    frames.push({ id, flags: fl, body: fb, ver });
  }
  return { ver, size: total, frames };
}

function decodeStr(enc: number, b: Uint8Array): string {
  if (enc === 0) return clean(latin1(b));
  if (enc === 3) return clean(utf8d(b));
  if (enc === 2) return clean(new TextDecoder('utf-16be').decode(b));
  // enc 1: UTF-16 with BOM (each value may carry its own); default little-endian.
  const be = b[0] === 0xfe && b[1] === 0xff;
  return clean(new TextDecoder(be ? 'utf-16be' : 'utf-16le').decode(b));
}
/** Split off one terminated string; returns [text, offset after the terminator]. */
function termStr(enc: number, b: Uint8Array, o: number): [string, number] {
  const wide = enc === 1 || enc === 2;
  let e = o;
  if (wide) { while (e + 1 < b.length && !(b[e] === 0 && b[e + 1] === 0)) e += 2; return [decodeStr(enc, b.subarray(o, e)), Math.min(b.length, e + 2)]; }
  while (e < b.length && b[e] !== 0) e++;
  return [decodeStr(enc, b.subarray(o, e)), Math.min(b.length, e + 1)];
}
function textValue(body: Uint8Array): string {
  if (!body.length) return '';
  const enc = body[0], raw = decodeStr(enc, body.subarray(1));
  return raw.split('\u0000').map((v) => v.trim()).filter(Boolean).join('; ');
}

const V2: Record<string, string> = { TT2: 'TIT2', TP1: 'TPE1', TAL: 'TALB', TP2: 'TPE2', TCO: 'TCON', TYE: 'TYER', TRK: 'TRCK', TBP: 'TBPM', TKE: 'TKEY', COM: 'COMM', TPB: 'TPUB', TRC: 'TSRC', PIC: 'APIC', TXX: 'TXXX' };
const ID_FIELD: Record<string, TextField> = { TIT2: 'title', TPE1: 'artist', TALB: 'album', TPE2: 'albumArtist', TCON: 'genre', TYER: 'year', TDRC: 'year', TRCK: 'track', TBPM: 'bpm', TKEY: 'key', TPUB: 'label', TSRC: 'isrc' };

function id3Tags(t: Id3): Tags {
  const tags: Tags = {};
  let covers: Picture[] = [], comment: string | undefined;
  for (const f of t.frames) {
    const id = t.ver === 2 ? V2[f.id] ?? f.id : f.id;
    const fld = ID_FIELD[id];
    if (fld) {
      let v = textValue(f.body);
      if (fld === 'genre') v = v.split('; ').map(genreName).join('; ');
      if (v && !(fld === 'year' && tags.year && id === 'TDRC')) tags[fld] = v;
    } else if (id === 'TXXX' && f.body.length) {
      const [desc, o] = termStr(f.body[0], f.body, 1), v = decodeStr(f.body[0], f.body.subarray(o)), d = desc.toLowerCase();
      if ((d === 'initialkey' || d === 'key') && !tags.key) tags.key = v;
      else if (d === 'bpm' && !tags.bpm) tags.bpm = v;
      else if ((d === 'label' || d === 'publisher') && !tags.label) tags.label = v;
      else if (d === 'isrc' && !tags.isrc) tags.isrc = v;
    } else if (id === 'COMM' && f.body.length > 4) {
      const enc = f.body[0], [desc, o] = termStr(enc, f.body, 4);
      if (/^itun/i.test(desc)) continue;
      const v = decodeStr(enc, f.body.subarray(o));
      if (comment === undefined || (!desc && v)) comment = v;
    } else if (id === 'APIC' && f.body.length > 4) {
      const enc = f.body[0];
      let mime: string, o: number;
      if (t.ver === 2) { const fmt = ascii(f.body, 1, 3).toUpperCase(); mime = fmt === 'PNG' ? 'image/png' : 'image/jpeg'; o = 4; }
      else { let e = 1; while (e < f.body.length && f.body[e] !== 0) e++; mime = latin1(f.body.subarray(1, e)).toLowerCase(); o = e + 1; }
      const type = f.body[o];
      const [desc, d] = termStr(enc, f.body, o + 1);
      const data = f.body.slice(d);
      if (!mime || mime === 'image/jpg' || !mime.includes('/')) mime = imageMime(data);
      covers.push({ mime, data, type, desc });
    }
  }
  if (comment) tags.comment = comment;
  if (covers.length) tags.cover = covers.find((c) => c.type === 3) ?? covers[0];
  return tags;
}

function readId3v1(b: Uint8Array): Tags | null {
  if (b.length < 128) return null;
  const o = b.length - 128;
  if (ascii(b, o, 3) !== 'TAG') return null;
  const s = (a: number, n: number) => clean(latin1(b.subarray(o + a, o + a + n)).replace(/\u0000.*$/, ''));
  const t: Tags = { title: s(3, 30), artist: s(33, 30), album: s(63, 30), year: s(93, 4) };
  if (b[o + 125] === 0 && b[o + 126]) { t.comment = s(97, 28); t.track = String(b[o + 126]); } else t.comment = s(97, 30);
  if (b[o + 127] < GENRES.length) t.genre = GENRES[b[o + 127]];
  for (const k of Object.keys(t) as TextField[]) if (!t[k]) delete t[k];
  return t;
}

// ---------- ID3v2.3 writer ----------
const utf16 = (s: string) => { const o = new Uint8Array(2 + s.length * 2); o[0] = 0xff; o[1] = 0xfe; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); o[2 + i * 2] = c & 0xff; o[3 + i * 2] = c >> 8; } return o; };
const frame23 = (id: string, body: Uint8Array, flags = 0) => concat([tag4(id), be32(body.length), Uint8Array.of(flags >> 8, flags & 0xff), body]);
const text23 = (id: string, v: string) => frame23(id, concat([Uint8Array.of(1), utf16(v)]));
const WRITE_ID: [TextField, string][] = [['title', 'TIT2'], ['artist', 'TPE1'], ['album', 'TALB'], ['albumArtist', 'TPE2'], ['genre', 'TCON'], ['year', 'TYER'], ['track', 'TRCK'], ['bpm', 'TBPM'], ['key', 'TKEY'], ['label', 'TPUB'], ['isrc', 'TSRC']];
// Frames that exist only in ID3v2.4 (dropped when an old v2.4 tag is turned into v2.3).
const ONLY24 = new Set('TDRC TDRL TDOR TDEN TDTG TIPL TMCL TMOO TPRO TSST ASPI EQU2 RVA2 SEEK SIGN'.split(' '));
const MANAGED = new Set(['TIT2', 'TPE1', 'TALB', 'TPE2', 'TCON', 'TYER', 'TDAT', 'TRCK', 'TBPM', 'TKEY', 'TPUB', 'TSRC']);

/** Build an ID3v2.3 tag. Frames from the old tag that this module does not edit (composer, lyrics, ReplayGain...) are kept. */
export function buildId3v23(tags: Tags, old: Uint8Array | null = null, padding = 1024): Uint8Array {
  const frames: Uint8Array[] = [];
  for (const [f, id] of WRITE_ID) {
    let v = (tags[f] ?? '').trim();
    if (!v) continue;
    if (f === 'year') { const m = v.match(/^\d{4}/); if (m) v = m[0]; }
    frames.push(text23(id, v));
  }
  if (tags.comment?.trim()) frames.push(frame23('COMM', concat([Uint8Array.of(1), latin1e('eng'), utf16(''), Uint8Array.of(0, 0), utf16(tags.comment.trim())])));
  if (tags.cover) frames.push(frame23('APIC', concat([Uint8Array.of(0), latin1e(tags.cover.mime || imageMime(tags.cover.data)), Uint8Array.of(0, tags.cover.type ?? 3, 0), tags.cover.data])));
  const t = old ? parseId3(old) : null;
  if (t && t.ver >= 3) {
    for (const f of t.frames) {
      if (MANAGED.has(f.id) || ONLY24.has(f.id)) continue;
      if (f.id === 'APIC' && tags.cover !== undefined) continue;
      if (f.id === 'TXXX' && f.body.length) { const d = termStr(f.body[0], f.body, 1)[0].toLowerCase(); if (['initialkey', 'key', 'bpm', 'label', 'publisher', 'isrc'].includes(d)) continue; }
      if (f.id === 'COMM' && f.body.length > 4) { const d = termStr(f.body[0], f.body, 4)[0]; if (!/^itun/i.test(d)) continue; }
      if (t.ver === 3) { frames.push(frame23(f.id, f.body, f.flags & 0xff1f)); continue; }
      // v2.4 → v2.3: UTF-8 (encoding 3) is not allowed in v2.3, so text frames are re-encoded as UTF-16.
      if (f.id[0] === 'T' && f.id !== 'TXXX' && f.body[0] === 3) frames.push(text23(f.id, decodeStr(3, f.body.subarray(1)).split('\u0000').filter(Boolean).join('/')));
      else if ((f.id === 'TXXX' || f.id === 'COMM' || f.id === 'USLT' || f.id === 'APIC') && f.body[0] === 3) {
        const head = f.id === 'COMM' || f.id === 'USLT' ? 4 : f.id === 'APIC' ? -1 : 1;
        if (head < 0) continue; // a v2.4 UTF-8 picture description is rare; leave it out
        const [d, o] = termStr(3, f.body, head);
        frames.push(frame23(f.id, concat([Uint8Array.of(1), f.body.subarray(1, head), utf16(d), Uint8Array.of(0, 0), utf16(utf8d(f.body.subarray(o)).replace(/\u0000+$/, ''))])));
      } else frames.push(frame23(f.id, f.body));
    }
  }
  const body = concat([...frames, new Uint8Array(padding)]);
  return concat([latin1e('ID3'), Uint8Array.of(3, 0, 0), ss32(body.length), body]);
}

function buildId3v1(tags: Tags): Uint8Array {
  const o = new Uint8Array(128);
  o.set(latin1e('TAG'));
  const put = (s: string | undefined, at: number, n: number) => o.set(latin1e((s ?? '').slice(0, n)), at);
  put(tags.title, 3, 30); put(tags.artist, 33, 30); put(tags.album, 63, 30); put((tags.year ?? '').slice(0, 4), 93, 4);
  const tr = parseInt(tags.track ?? '', 10);
  if (tr > 0 && tr < 256) { put(tags.comment, 97, 28); o[125] = 0; o[126] = tr; } else put(tags.comment, 97, 30);
  const g = GENRES.findIndex((x) => x.toLowerCase() === (tags.genre ?? '').trim().toLowerCase());
  o[127] = g >= 0 ? g : 255;
  return o;
}

// ---------- MP3 frames ----------
const BR: Record<string, number[]> = {
  '1-1': [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
  '1-2': [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
  '1-3': [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  '2-1': [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
  '2-2': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
};
const SR: Record<string, number[]> = { '1': [44100, 48000, 32000], '2': [22050, 24000, 16000], '2.5': [11025, 12000, 8000] };
const MODES = ['Stereo', 'Joint stereo', 'Dual channel', 'Mono'];
type MpegHead = { version: '1' | '2' | '2.5'; layer: 1 | 2 | 3; bitrate: number; rate: number; channels: number; mode: string; len: number; spf: number };

/** Parse a 4-byte MPEG audio frame header at offset o, or null. */
export function mpegHeader(b: Uint8Array, o: number): MpegHead | null {
  if (o + 4 > b.length || b[o] !== 0xff || (b[o + 1] & 0xe0) !== 0xe0) return null;
  const vb = (b[o + 1] >> 3) & 3, lb = (b[o + 1] >> 1) & 3, bi = b[o + 2] >> 4, si = (b[o + 2] >> 2) & 3, pad = (b[o + 2] >> 1) & 1;
  if (vb === 1 || lb === 0 || bi === 0 || bi === 15 || si === 3) return null;
  const version = vb === 3 ? '1' : vb === 2 ? '2' : '2.5', layer = (4 - lb) as 1 | 2 | 3;
  const bitrate = BR[version === '1' ? `1-${layer}` : layer === 1 ? '2-1' : '2-2'][bi], rate = SR[version][si];
  const spf = layer === 1 ? 384 : layer === 2 || version === '1' ? 1152 : 576;
  const len = layer === 1 ? (Math.floor((12000 * bitrate) / rate) + pad) * 4 : Math.floor(((spf / 8) * 1000 * bitrate) / rate) + pad;
  const m = b[o + 3] >> 6;
  return { version, layer, bitrate, rate, channels: m === 3 ? 1 : 2, mode: MODES[m], len, spf };
}

/** First real frame at or after `from`: the next frame must follow at the computed length (when it fits in the bytes). */
function findFrame(b: Uint8Array, from: number, limit = 1 << 20): number {
  const end = Math.min(b.length - 4, from + limit);
  for (let o = from; o <= end; o++) {
    if (b[o] !== 0xff) continue;
    const h = mpegHeader(b, o);
    if (!h || h.len < 21) continue;
    const n = o + h.len;
    if (n + 4 > b.length) return o;
    const h2 = mpegHeader(b, n);
    if (h2 && h2.version === h.version && h2.layer === h.layer && h2.rate === h.rate) return o;
  }
  return -1;
}

function mp3Info(b: Uint8Array, start: number, fileSize: number, endTags: number): AudioInfo | null {
  const o = findFrame(b, start);
  if (o < 0) return null;
  const h = mpegHeader(b, o)!;
  const side = h.version === '1' ? (h.channels === 1 ? 17 : 32) : h.channels === 1 ? 9 : 17;
  const audioBytes = Math.max(0, fileSize - o - endTags);
  let frames: number | undefined, bytes: number | undefined, vbrHeader: 'Xing' | 'Info' | 'VBRI' | null = null;
  const x = o + 4 + side, xs = ascii(b, x, 4);
  if (xs === 'Xing' || xs === 'Info') {
    vbrHeader = xs; const fl = u32(b, x + 4); let p = x + 8;
    if (fl & 1) { frames = u32(b, p); p += 4; }
    if (fl & 2) { bytes = u32(b, p); p += 4; }
  } else if (ascii(b, o + 36, 4) === 'VBRI') { vbrHeader = 'VBRI'; bytes = u32(b, o + 36 + 10); frames = u32(b, o + 36 + 14); }
  let duration: number, bitrate: number;
  if (frames) { duration = (frames * h.spf) / h.rate; bitrate = duration > 0 ? ((bytes ?? audioBytes) * 8) / duration / 1000 : h.bitrate; }
  else { bitrate = h.bitrate; duration = (audioBytes * 8) / (h.bitrate * 1000); }
  return {
    codec: h.layer === 3 ? 'MP3' : `MPEG layer ${h.layer}`, lossless: false, sampleRate: h.rate, channels: h.channels,
    bitrate: Math.round(bitrate), vbr: vbrHeader === 'Xing' || vbrHeader === 'VBRI', duration,
    mpeg: { version: h.version, layer: h.layer, frameBitrate: h.bitrate, vbrHeader, frames, mode: h.mode },
  };
}

// ---------- FLAC ----------
type Block = { type: number; start: number; len: number }; // start = offset of the 4-byte block header
function flacBlocks(b: Uint8Array, at: number): { blocks: Block[]; end: number; complete: boolean } {
  const blocks: Block[] = []; let p = at + 4;
  while (p + 4 <= b.length) {
    const last = b[p] & 0x80, type = b[p] & 0x7f, len = u24(b, p + 1);
    blocks.push({ type, start: p, len }); p += 4 + len;
    if (last) return { blocks, end: p, complete: p <= b.length };
  }
  return { blocks, end: p, complete: false };
}
type Comments = { vendor: string; list: [string, string][] };
function parseVorbis(b: Uint8Array, o: number, end: number): Comments {
  const vl = u32le(b, o), vendor = utf8d(b.subarray(o + 4, o + 4 + vl));
  let p = o + 4 + vl; const n = u32le(b, p); p += 4;
  const list: [string, string][] = [];
  for (let i = 0; i < n && p + 4 <= end; i++) {
    const l = u32le(b, p), s = utf8d(b.subarray(p + 4, Math.min(end, p + 4 + l))); p += 4 + l;
    const eq = s.indexOf('='); if (eq > 0) list.push([s.slice(0, eq).toUpperCase(), s.slice(eq + 1)]);
  }
  return { vendor, list };
}
function parsePictureBlock(b: Uint8Array, o: number): Picture | null {
  try {
    const type = u32(b, o), ml = u32(b, o + 4), mime = latin1(b.subarray(o + 8, o + 8 + ml)); let p = o + 8 + ml;
    const dl = u32(b, p), desc = utf8d(b.subarray(p + 4, p + 4 + dl)); p += 4 + dl + 16;
    const n = u32(b, p), data = b.slice(p + 4, p + 4 + n);
    return { type, mime: mime || imageMime(data), desc, data };
  } catch { return null; }
}
function pictureBlock(pc: Picture): Uint8Array {
  const m = latin1e(pc.mime || imageMime(pc.data)), d = utf8e(pc.desc ?? '');
  return concat([be32(pc.type ?? 3), be32(m.length), m, be32(d.length), d, be32(0), be32(0), be32(0), be32(0), be32(pc.data.length), pc.data]);
}
const VC_FIELD: Record<string, TextField> = {
  TITLE: 'title', ARTIST: 'artist', ALBUM: 'album', ALBUMARTIST: 'albumArtist', 'ALBUM ARTIST': 'albumArtist', GENRE: 'genre', DATE: 'year', YEAR: 'year',
  TRACKNUMBER: 'track', BPM: 'bpm', TEMPO: 'bpm', INITIALKEY: 'key', KEY: 'key', COMMENT: 'comment', DESCRIPTION: 'comment', LABEL: 'label',
  ORGANIZATION: 'label', PUBLISHER: 'label', ISRC: 'isrc',
};
function vorbisTags(c: Comments): Tags {
  const t: Tags = {}; let total = '';
  for (const [k, v] of c.list) {
    const f = VC_FIELD[k];
    if (f && !t[f] && v.trim()) t[f] = v.trim();
    if ((k === 'TRACKTOTAL' || k === 'TOTALTRACKS') && v.trim()) total = v.trim();
    if (k === 'METADATA_BLOCK_PICTURE' && !t.cover) { const pc = parsePictureBlock(fromBase64(v), 0); if (pc) t.cover = pc; }
  }
  if (t.track && total && !t.track.includes('/')) t.track += '/' + total;
  return t;
}
const VC_MANAGED = new Set([...Object.keys(VC_FIELD), 'TRACKTOTAL', 'TOTALTRACKS']);
function vorbisBlock(tags: Tags, old: Comments | null): Uint8Array {
  const out: string[] = [];
  const put = (k: string, v?: string) => { if (v?.trim()) out.push(`${k}=${v.trim()}`); };
  put('TITLE', tags.title); put('ARTIST', tags.artist); put('ALBUM', tags.album); put('ALBUMARTIST', tags.albumArtist); put('GENRE', tags.genre);
  put('DATE', tags.year);
  const [tn, tt] = (tags.track ?? '').split('/'); put('TRACKNUMBER', tn); put('TRACKTOTAL', tt);
  put('BPM', tags.bpm); put('INITIALKEY', tags.key); put('COMMENT', tags.comment); put('LABEL', tags.label); put('ISRC', tags.isrc);
  for (const [k, v] of old?.list ?? []) if (!VC_MANAGED.has(k)) out.push(`${k}=${v}`);
  const vendor = utf8e(old?.vendor ?? 'fibub.com');
  const parts = [le32(vendor.length), vendor, le32(out.length)];
  for (const s of out) { const e = utf8e(s); parts.push(le32(e.length), e); }
  return concat(parts);
}

// ---------- MP4 ----------
type Atom = { type: string; start: number; size: number; hdr: number };
function atoms(b: Uint8Array, from: number, to: number): Atom[] {
  const out: Atom[] = []; let p = from;
  while (p + 8 <= to) {
    let size = u32(b, p), hdr = 8;
    const type = ascii(b, p + 4, 4);
    if (size === 1) { size = u64(b, p + 8); hdr = 16; } else if (size === 0) size = to - p;
    if (size < hdr) break;
    out.push({ type, start: p, size, hdr }); p += size;
  }
  return out;
}
const child = (b: Uint8Array, a: Atom, type: string, skip = 0) => atoms(b, a.start + a.hdr + skip, a.start + a.size).find((x) => x.type === type);
/** iTunes-style meta is a full box (4 bytes of version and flags); QuickTime's is not. */
const metaSkip = (b: Uint8Array, m: Atom) => (ascii(b, m.start + m.hdr + 4, 4) === 'hdlr' ? 0 : 4);
function path(b: Uint8Array, a: Atom | undefined, names: string[]): Atom | undefined {
  for (const n of names) { if (!a) return; a = child(b, a, n, a.type === 'meta' ? metaSkip(b, a) : 0); }
  return a;
}
const ITEM_FIELD: Record<string, TextField> = { '©nam': 'title', '©ART': 'artist', '©alb': 'album', aART: 'albumArtist', '©gen': 'genre', '©day': 'year', '©cmt': 'comment', '©pub': 'label' };
const FREE_FIELD: Record<string, TextField> = { initialkey: 'key', key: 'key', label: 'label', publisher: 'label', isrc: 'isrc', bpm: 'bpm' };
function mp4Tags(b: Uint8Array, ilst: Atom): Tags {
  const t: Tags = {};
  for (const it of atoms(b, ilst.start + ilst.hdr, ilst.start + ilst.size)) {
    const kids = atoms(b, it.start + it.hdr, it.start + it.size), d = kids.find((k) => k.type === 'data');
    if (!d) continue;
    const kind = u32(b, d.start + d.hdr) & 0xffffff, val = b.subarray(d.start + d.hdr + 8, d.start + d.size);
    const f = ITEM_FIELD[it.type];
    if (f) { if (!t[f]) t[f] = clean(utf8d(val)); }
    else if (it.type === 'trkn' && val.length >= 6) { const n = u16(val, 2), tot = u16(val, 4); if (n) t.track = tot ? `${n}/${tot}` : String(n); }
    else if (it.type === 'tmpo' && val.length >= 2) { const v = val.length >= 2 ? u16(val, 0) : val[0]; if (v) t.bpm = String(v); }
    else if (it.type === 'gnre' && val.length >= 2 && !t.genre) { const g = GENRES[u16(val, 0) - 1]; if (g) t.genre = g; }
    else if (it.type === 'covr' && !t.cover) { const data = val.slice(); t.cover = { mime: kind === 14 ? 'image/png' : kind === 13 ? 'image/jpeg' : imageMime(data), data, type: 3, desc: '' }; }
    else if (it.type === '----') {
      const nm = kids.find((k) => k.type === 'name'); if (!nm) continue;
      const name = utf8d(b.subarray(nm.start + nm.hdr + 4, nm.start + nm.size)).toLowerCase(), ff = FREE_FIELD[name];
      if (ff && !t[ff]) t[ff] = clean(utf8d(val));
    }
  }
  return t;
}
function mp4Info(b: Uint8Array, moov: Atom, mdatBytes: number): AudioInfo | null {
  const mvhd = child(b, moov, 'mvhd');
  let duration = 0;
  if (mvhd) { const o = mvhd.start + mvhd.hdr, v1 = b[o] === 1; const ts = u32(b, o + (v1 ? 20 : 12)), d = v1 ? u64(b, o + 24) : u32(b, o + 16); duration = ts ? d / ts : 0; }
  for (const trak of atoms(b, moov.start + moov.hdr, moov.start + moov.size).filter((a) => a.type === 'trak')) {
    const hdlr = path(b, trak, ['mdia', 'hdlr']);
    if (!hdlr || ascii(b, hdlr.start + hdlr.hdr + 8, 4) !== 'soun') continue;
    const stsd = path(b, trak, ['mdia', 'minf', 'stbl', 'stsd']); if (!stsd) continue;
    const e = stsd.start + stsd.hdr + 8, fmt = ascii(b, e + 4, 4);
    const channels = u16(b, e + 8 + 16), bits = u16(b, e + 8 + 18), sampleRate = u16(b, e + 8 + 24);
    const mdhd = path(b, trak, ['mdia', 'mdhd']);
    if (mdhd) { const o = mdhd.start + mdhd.hdr, v1 = b[o] === 1, ts = u32(b, o + (v1 ? 20 : 12)), d = v1 ? u64(b, o + 24) : u32(b, o + 16); if (ts && d) duration = d / ts; }
    const lossless = fmt === 'alac';
    return { codec: fmt === 'mp4a' ? 'AAC' : lossless ? 'ALAC' : fmt.trim(), lossless, sampleRate, channels, bits: lossless ? bits : undefined, bitrate: duration ? Math.round((mdatBytes * 8) / duration / 1000) : 0, vbr: false, duration };
  }
  return null;
}
const box = (type: string, ...parts: Uint8Array[]) => { const body = concat(parts); return concat([be32(body.length + 8), tag4(type), body]); };
const dataBox = (kind: number, v: Uint8Array) => box('data', be32(kind), be32(0), v);
const textItem = (type: string, v: string) => box(type, dataBox(1, utf8e(v)));
const freeItem = (name: string, v: string) => box('----', box('mean', be32(0), utf8e('com.apple.iTunes')), box('name', be32(0), utf8e(name)), dataBox(1, utf8e(v)));
const MP4_MANAGED = new Set(['©nam', '©ART', '©alb', 'aART', '©gen', 'gnre', '©day', 'trkn', 'tmpo', '©cmt', '©pub']);
function ilstBox(b: Uint8Array, old: Atom | undefined, tags: Tags): Uint8Array {
  const items: Uint8Array[] = [];
  const add = (type: string, v?: string) => { if (v?.trim()) items.push(textItem(type, v.trim())); };
  add('©nam', tags.title); add('©ART', tags.artist); add('©alb', tags.album); add('aART', tags.albumArtist); add('©gen', tags.genre); add('©day', tags.year);
  const [tn, tt] = (tags.track ?? '').split('/').map((x) => parseInt(x, 10));
  if (tn > 0) items.push(box('trkn', dataBox(0, Uint8Array.of(0, 0, (tn >> 8) & 0xff, tn & 0xff, ((tt || 0) >> 8) & 0xff, (tt || 0) & 0xff, 0, 0))));
  const bpm = Math.round(parseFloat(tags.bpm ?? ''));
  if (bpm > 0 && bpm < 65536) items.push(box('tmpo', dataBox(21, Uint8Array.of(bpm >> 8, bpm & 0xff))));
  add('©cmt', tags.comment);
  if (tags.key?.trim()) items.push(freeItem('initialkey', tags.key.trim()));
  if (tags.label?.trim()) items.push(freeItem('LABEL', tags.label.trim()));
  if (tags.isrc?.trim()) items.push(freeItem('ISRC', tags.isrc.trim()));
  if (tags.cover) items.push(box('covr', dataBox(tags.cover.mime === 'image/png' ? 14 : 13, tags.cover.data)));
  if (old) for (const it of atoms(b, old.start + old.hdr, old.start + old.size)) {
    if (MP4_MANAGED.has(it.type) || (it.type === 'covr' && tags.cover !== undefined)) continue;
    if (it.type === '----') {
      const nm = atoms(b, it.start + it.hdr, it.start + it.size).find((k) => k.type === 'name');
      if (nm && FREE_FIELD[utf8d(b.subarray(nm.start + nm.hdr + 4, nm.start + nm.size)).toLowerCase()]) continue;
    }
    items.push(b.subarray(it.start, it.start + it.size));
  }
  return box('ilst', ...items);
}
const HDLR = () => box('hdlr', be32(0), be32(0), tag4('mdir'), tag4('appl'), be32(0), be32(0), Uint8Array.of(0));
/** Rebuild container `a` with the child at `names` replaced by make(old child). */
function rebuild(b: Uint8Array, a: Atom, names: string[], make: (old: Atom | undefined) => Uint8Array): Uint8Array {
  const skip = a.type === 'meta' ? metaSkip(b, a) : 0, kids = atoms(b, a.start + a.hdr + skip, a.start + a.size);
  const [n, ...rest] = names, found = kids.find((k) => k.type === n);
  const fresh = (): Uint8Array => {
    if (!rest.length) return make(undefined);
    if (n === 'meta') return box('meta', be32(0), HDLR(), fresh2(rest));
    return box(n, fresh2(rest));
  };
  const fresh2 = (r: string[]): Uint8Array => r.length === 1 ? make(undefined) : r[0] === 'meta' ? box('meta', be32(0), HDLR(), fresh2(r.slice(1))) : box(r[0], fresh2(r.slice(1)));
  const newKid = found ? (rest.length ? rebuild(b, found, rest, make) : make(found)) : fresh();
  const parts: Uint8Array[] = [b.subarray(a.start + a.hdr, a.start + a.hdr + skip)];
  for (const k of kids) parts.push(k === found ? newKid : b.subarray(k.start, k.start + k.size));
  if (!found) parts.push(newKid);
  return box(a.type, ...parts);
}
/** Add delta to every chunk offset in stco/co64 at or after `from`. */
function shiftChunks(m: Uint8Array, from: number, delta: number) {
  const walk = (s: number, e: number) => {
    for (const a of atoms(m, s, e)) {
      if (['trak', 'mdia', 'minf', 'stbl'].includes(a.type)) walk(a.start + a.hdr, a.start + a.size);
      else if (a.type === 'stco' || a.type === 'co64') {
        const big = a.type === 'co64', o = a.start + a.hdr + 4, n = u32(m, o), w = big ? 8 : 4;
        for (let i = 0; i < n; i++) {
          const q = o + 4 + i * w, v = big ? u64(m, q) : u32(m, q);
          if (v < from) continue;
          const nv = v + delta;
          if (!big && nv > 0xffffffff) throw new Error('This M4A is too big to change safely.');
          if (big) { m.set(be32(Math.floor(nv / 0x100000000)), q); m.set(be32(nv >>> 0), q + 4); } else m.set(be32(nv), q);
        }
      }
    }
  };
  walk(8, m.length);
}
function writeMp4(b: Uint8Array, tags: Tags): Uint8Array {
  const top = atoms(b, 0, b.length), mi = top.findIndex((a) => a.type === 'moov');
  if (mi < 0) throw new Error('No moov box: not an MP4 file this tool can change.');
  if (top.some((a) => a.type === 'moof')) throw new Error('Fragmented MP4 files are read only here.');
  const moov = top[mi];
  const newMoov = rebuild(b, moov, ['udta', 'meta', 'ilst'], (old) => ilstBox(b, old, tags));
  const next = top[mi + 1], end = moov.start + moov.size;
  let delta = newMoov.length - moov.size, tail: Uint8Array[] = [];
  let restFrom = end;
  if (next && (next.type === 'free' || next.type === 'skip') && next.hdr === 8) {
    const room = moov.size + next.size - newMoov.length;
    if (room >= 8) { tail = [box('free', new Uint8Array(room - 8))]; delta = 0; restFrom = next.start + next.size; }
  }
  if (delta < 0 && delta <= -8) { tail = [box('free', new Uint8Array(-delta - 8))]; delta = 0; }
  if (delta) shiftChunks(newMoov, end, delta);
  return concat([b.subarray(0, moov.start), newMoov, ...tail, b.subarray(restFrom)]);
}

// ---------- WAV ----------
type Chunk = { id: string; start: number; size: number }; // start = offset of the 8-byte chunk header
function wavChunks(b: Uint8Array): Chunk[] {
  const out: Chunk[] = []; let p = 12;
  while (p + 8 <= b.length) { const size = u32le(b, p + 4); out.push({ id: ascii(b, p, 4), start: p, size }); p += 8 + size + (size & 1); }
  return out;
}
const INFO_FIELD: Record<string, TextField> = { INAM: 'title', IART: 'artist', IPRD: 'album', IGNR: 'genre', ICRD: 'year', ITRK: 'track', IPRT: 'track', ICMT: 'comment', IPUB: 'label' };
const INFO_WRITE: [string, TextField][] = [['INAM', 'title'], ['IART', 'artist'], ['IPRD', 'album'], ['IGNR', 'genre'], ['ICRD', 'year'], ['ITRK', 'track'], ['ICMT', 'comment']];
function infoList(b: Uint8Array, c: Chunk): [string, Uint8Array][] {
  const out: [string, Uint8Array][] = []; let p = c.start + 12; const e = Math.min(b.length, c.start + 8 + c.size);
  while (p + 8 <= e) { const n = u32le(b, p + 4); out.push([ascii(b, p, 4), b.subarray(p + 8, Math.min(e, p + 8 + n))]); p += 8 + n + (n & 1); }
  return out;
}
const chunk = (id: string, data: Uint8Array) => concat([tag4(id), le32(data.length), data, data.length & 1 ? new Uint8Array(1) : new Uint8Array(0)]);
function writeWavTags(b: Uint8Array, tags: Tags): Uint8Array {
  if (ascii(b, 0, 4) !== 'RIFF') throw new Error('Only RIFF WAV files can be changed (not RF64).');
  const cs = wavChunks(b), parts: Uint8Array[] = [];
  let oldId3: Uint8Array | null = null, keepInfo: [string, Uint8Array][] = [];
  for (const c of cs) {
    const end = Math.min(b.length, c.start + 8 + c.size);
    if (c.id === 'id3 ' || c.id === 'ID3 ') { oldId3 = b.subarray(c.start + 8, end); continue; }
    if (c.id === 'LIST' && ascii(b, c.start + 8, 4) === 'INFO') { keepInfo = infoList(b, c).filter(([id]) => !INFO_FIELD[id]); continue; }
    let raw = b.subarray(c.start, Math.min(b.length, end + (c.size & 1)));
    if (c.size & 1 && raw.length === 8 + c.size) raw = concat([raw, new Uint8Array(1)]);
    parts.push(raw);
  }
  const info: Uint8Array[] = [];
  for (const [id, f] of INFO_WRITE) { const v = tags[f]?.trim(); if (v) info.push(chunk(id, concat([utf8e(v), Uint8Array.of(0)]))); }
  for (const [id, v] of keepInfo) info.push(chunk(id, v));
  if (info.length) parts.push(chunk('LIST', concat([latin1e('INFO'), ...info])));
  parts.push(chunk('id3 ', buildId3v23(tags, oldId3, 0)));
  const body = concat(parts);
  return concat([latin1e('RIFF'), le32(body.length + 4), latin1e('WAVE'), body]);
}

// ---------- Ogg ----------
function oggRead(b: Uint8Array): { tags: Tags; info: AudioInfo | null; codec: string } {
  const packets: Uint8Array[] = []; let cur: number[] = [], p = 0, serial = -1;
  while (p + 27 <= b.length && packets.length < 2 && ascii(b, p, 4) === 'OggS') {
    const n = b[p + 26], seg = b.subarray(p + 27, p + 27 + n); let q = p + 27 + n;
    const s = u32le(b, p + 14); if (serial < 0) serial = s;
    if (s === serial) for (const l of seg) { for (let i = 0; i < l; i++) cur.push(b[q + i]); q += l; if (l < 255) { packets.push(Uint8Array.from(cur)); cur = []; if (packets.length === 2) break; } }
    else for (const l of seg) q += l;
    p = 27 + n + p + seg.reduce((a, x) => a + x, 0);
  }
  let granule = 0;
  for (let e = b.length - 27; e >= 0 && e > b.length - 65536 - 27; e--) if (b[e] === 0x4f && ascii(b, e, 4) === 'OggS' && u32le(b, e + 14) === serial) { granule = u64le(b, e + 6); break; }
  const [id, com] = packets; let codec = 'Ogg', tags: Tags = {}, info: AudioInfo | null = null;
  if (id && ascii(id, 1, 6) === 'vorbis') {
    codec = 'Vorbis'; const ch = id[11], rate = u32le(id, 12), nom = u32le(id, 20), dur = rate ? granule / rate : 0;
    info = { codec, lossless: false, sampleRate: rate, channels: ch, bitrate: dur ? Math.round((b.length * 8) / dur / 1000) : Math.round(nom / 1000), vbr: true, duration: dur };
    if (com && ascii(com, 1, 6) === 'vorbis') tags = vorbisTags(parseVorbis(com, 7, com.length));
  } else if (id && ascii(id, 0, 8) === 'OpusHead') {
    codec = 'Opus'; const ch = id[9], pre = id[10] | (id[11] << 8), dur = Math.max(0, (granule - pre) / 48000);
    info = { codec, lossless: false, sampleRate: 48000, channels: ch, bitrate: dur ? Math.round((b.length * 8) / dur / 1000) : 0, vbr: true, duration: dur };
    if (com && ascii(com, 0, 8) === 'OpusTags') tags = vorbisTags(parseVorbis(com, 8, com.length));
  }
  return { tags, info, codec };
}

// ---------- public ----------
/** What kind of file the bytes start with. */
export function detectFormat(b: Uint8Array): Format {
  const s4 = ascii(b, 0, 4);
  if (s4 === 'fLaC') return 'flac';
  if (s4 === 'RIFF' && ascii(b, 8, 4) === 'WAVE') return 'wav';
  if (s4 === 'OggS') return 'ogg';
  if (ascii(b, 4, 4) === 'ftyp') return 'mp4';
  const t = id3Size(b);
  if (t && ascii(b, t, 4) === 'fLaC') return 'flac';
  if (findFrame(b, t, 1 << 16) >= 0) return 'mp3';
  return t ? 'mp3' : 'unknown';
}

/**
 * How many bytes from the start readTags needs, judging by the bytes so far (call again with more until it stops growing).
 * MP3 needs the tag plus 64 KB, FLAC its metadata blocks; MP4, WAV and Ogg need the whole file.
 */
export function bytesNeeded(head: Uint8Array, fileSize: number): number {
  const f = detectFormat(head), t = id3Size(head);
  if (f === 'mp3') return Math.min(fileSize, t + 65536);
  if (f === 'flac') { const at = t; const r = flacBlocks(head, at); return Math.min(fileSize, r.complete ? r.end : Math.max(r.end + 4, head.length * 2)); }
  return fileSize;
}

/**
 * Read tags and audio facts. `bytes` is the whole file, or (for MP3 and FLAC) its start as bytesNeeded says, with
 * fileSize and the last 128 bytes (tail) so ID3v1 and the length still come out right.
 */
export function readTags(bytes: Uint8Array, opts: { fileSize?: number; tail?: Uint8Array } = {}): ReadResult {
  const b = bytes, size = opts.fileSize ?? b.length, tail = opts.tail ?? b.subarray(Math.max(0, b.length - 128));
  const format = detectFormat(b), tagTypes: string[] = [];
  if (format === 'mp3') {
    const t = parseId3(b), v1 = readId3v1(tail);
    if (t) tagTypes.push(`ID3v2.${t.ver}`);
    if (v1) tagTypes.push('ID3v1');
    const tags: Tags = { ...(v1 ?? {}), ...(t ? id3Tags(t) : {}) };
    let ape = 0;
    if (ascii(tail, tail.length - 128 - 32, 8) === 'APETAGEX') ape = 1; // APE tags are left alone
    const info = mp3Info(b, t?.size ?? 0, size, v1 ? 128 : 0);
    return { format, tags, info, tagTypes, writable: true, note: ape ? 'Also has an APE tag, which is kept as it is.' : undefined };
  }
  if (format === 'flac') {
    const at = id3Size(b), { blocks } = flacBlocks(b, at);
    let tags: Tags = {}, info: AudioInfo | null = null, cover: Picture | undefined;
    for (const k of blocks) {
      const o = k.start + 4;
      if (k.type === 0 && o + 18 <= b.length) {
        const rate = (b[o + 10] << 12) | (b[o + 11] << 4) | (b[o + 12] >> 4), ch = ((b[o + 12] >> 1) & 7) + 1, bits = (((b[o + 12] & 1) << 4) | (b[o + 13] >> 4)) + 1;
        const total = (b[o + 13] & 0x0f) * 0x100000000 + u32(b, o + 14), duration = rate ? total / rate : 0;
        const meta = blocks.length ? blocks[blocks.length - 1].start + 4 + blocks[blocks.length - 1].len : 0;
        info = { codec: 'FLAC', lossless: true, sampleRate: rate, channels: ch, bits, duration, vbr: true, bitrate: duration ? Math.round(((size - meta) * 8) / duration / 1000) : 0 };
      } else if (k.type === 4 && o + k.len <= b.length) { tags = { ...vorbisTags(parseVorbis(b, o, o + k.len)), ...tags }; tagTypes.push('Vorbis comment'); }
      else if (k.type === 6 && o + k.len <= b.length) { const pc = parsePictureBlock(b, o); if (pc && (!cover || (pc.type === 3 && cover.type !== 3))) cover = pc; }
    }
    if (cover) tags.cover = cover;
    if (at) tagTypes.push('ID3v2 (ignored)');
    return { format, tags, info, tagTypes, writable: true };
  }
  if (format === 'mp4') {
    const top = atoms(b, 0, b.length), moov = top.find((a) => a.type === 'moov');
    if (!moov) return { format, tags: {}, info: null, tagTypes, writable: false, note: 'No moov box found.' };
    const ilst = path(b, moov, ['udta', 'meta', 'ilst']);
    const tags = ilst ? mp4Tags(b, ilst) : {};
    if (ilst) tagTypes.push('MP4 ilst');
    const mdat = top.filter((a) => a.type === 'mdat').reduce((s, a) => s + a.size - a.hdr, 0);
    const frag = top.some((a) => a.type === 'moof');
    return { format, tags, info: mp4Info(b, moov, mdat), tagTypes, writable: !frag, note: frag ? 'Fragmented MP4: read only.' : undefined };
  }
  if (format === 'wav') {
    let tags: Tags = {}, info: AudioInfo | null = null, fmt: Chunk | undefined, data: Chunk | undefined;
    for (const c of wavChunks(b)) {
      if (c.id === 'fmt ') fmt = c;
      else if (c.id === 'data') data = c;
      else if (c.id === 'LIST' && ascii(b, c.start + 8, 4) === 'INFO') {
        tagTypes.push('RIFF INFO');
        for (const [id, v] of infoList(b, c)) { const f = INFO_FIELD[id]; const s = clean(utf8d(v).replace(/\u0000.*$/s, '')); if (f && s && !tags[f]) tags[f] = f === 'genre' ? genreName(s) : s; }
      } else if (c.id === 'id3 ' || c.id === 'ID3 ') {
        const t = parseId3(b, c.start + 8); if (t) { tagTypes.push(`ID3v2.${t.ver}`); tags = { ...tags, ...id3Tags(t) }; }
      }
    }
    if (fmt) {
      const o = fmt.start + 8, code = b[o] | (b[o + 1] << 8), ch = b[o + 2] | (b[o + 3] << 8), rate = u32le(b, o + 4), byteRate = u32le(b, o + 8), bits = b[o + 14] | (b[o + 15] << 8);
      const dataBytes = data ? Math.min(data.size, size - data.start - 8) : 0;
      const pcm = code === 1 || code === 3 || code === 0xfffe;
      info = { codec: pcm ? 'PCM' : code === 0x55 ? 'MP3 in WAV' : `WAV format ${code}`, lossless: pcm, sampleRate: rate, channels: ch, bits, bitrate: Math.round((byteRate * 8) / 1000), vbr: false, duration: byteRate ? dataBytes / byteRate : 0 };
    }
    return { format, tags, info, tagTypes, writable: true };
  }
  if (format === 'ogg') {
    const r = oggRead(b);
    tagTypes.push('Vorbis comment');
    return { format, tags: r.tags, info: r.info, tagTypes, writable: false, note: 'Ogg files are read only here.' };
  }
  return { format, tags: {}, info: null, tagTypes, writable: false, note: 'Not a file type this tool knows.' };
}

/** Can writeTags change this kind of file? */
export const canWrite = (f: Format) => f === 'mp3' || f === 'flac' || f === 'wav' || f === 'mp4';

/**
 * A new copy of the file with these tags (the whole set: empty fields are removed). The audio bytes are copied across
 * unchanged. Throws for formats it cannot change.
 */
export function writeTags(bytes: Uint8Array, tags: Tags): Uint8Array {
  const b = bytes, f = detectFormat(b);
  if (f === 'mp3') {
    let start = 0, old: Uint8Array | null = null;
    for (let s; (s = id3Size(b, start)); start += s) if (!old) old = b.subarray(start, start + s);
    const hasV1 = ascii(b, b.length - 128, 3) === 'TAG';
    const audio = b.subarray(start, hasV1 ? b.length - 128 : b.length);
    return concat([buildId3v23(tags, old), audio, hasV1 ? buildId3v1(tags) : new Uint8Array(0)]);
  }
  if (f === 'flac') {
    const at = id3Size(b), r = flacBlocks(b, at);
    if (!r.complete || !r.blocks.length || r.blocks[0].type !== 0) throw new Error('This FLAC file looks damaged.');
    const oldLen = r.end - (at + 4);
    let oldVc: Comments | null = null;
    const keep: { type: number; data: Uint8Array }[] = [];
    for (const k of r.blocks) {
      const data = b.subarray(k.start + 4, k.start + 4 + k.len);
      if (k.type === 4) { if (!oldVc) oldVc = parseVorbis(b, k.start + 4, k.start + 4 + k.len); continue; }
      if (k.type === 1 || (k.type === 6 && tags.cover !== undefined)) continue;
      keep.push({ type: k.type, data });
    }
    const vc = vorbisBlock(tags, oldVc);
    keep.splice(1, 0, { type: 4, data: vc });
    if (tags.cover) keep.push({ type: 6, data: pictureBlock(tags.cover) });
    const core = keep.reduce((s, k) => s + 4 + k.data.length, 0);
    for (const k of keep) if (k.data.length > 0xffffff) throw new Error('A block is too big for FLAC (16 MB); use a smaller cover.');
    // Fill the old space with padding so the audio frames stay where they were; otherwise add 8 KB for next time.
    let pad = oldLen - core - 4;
    if (pad < 0) pad = 8192;
    keep.push({ type: 1, data: new Uint8Array(Math.min(pad, 0xffffff)) });
    const parts: Uint8Array[] = [b.subarray(0, at), latin1e('fLaC')];
    keep.forEach((k, i) => { const n = k.data.length; parts.push(Uint8Array.of((i === keep.length - 1 ? 0x80 : 0) | k.type, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff), k.data); });
    parts.push(b.subarray(r.end));
    return concat(parts);
  }
  if (f === 'wav') return writeWavTags(b, tags);
  if (f === 'mp4') return writeMp4(b, tags);
  throw new Error(f === 'ogg' ? 'Ogg files are read only here.' : 'This file type cannot be changed here.');
}

/** Where the audio starts and ends, so callers can check it is unchanged (MP3: after ID3v2, before ID3v1; FLAC: after the metadata). */
export function audioRange(b: Uint8Array): [number, number] {
  const f = detectFormat(b);
  if (f === 'mp3') { let s = 0; for (let n; (n = id3Size(b, s)); s += n); return [s, ascii(b, b.length - 128, 3) === 'TAG' ? b.length - 128 : b.length]; }
  if (f === 'flac') return [flacBlocks(b, id3Size(b)).end, b.length];
  if (f === 'wav') { const d = wavChunks(b).find((c) => c.id === 'data'); return d ? [d.start + 8, d.start + 8 + d.size] : [0, 0]; }
  return [0, b.length];
}

// ---------- file names ----------
/** Fill tags from a file name with a pattern like "%artist% - %title%" (fields as in FIELDS, by id). */
export function tagsFromName(name: string, pattern: string): Partial<Record<TextField, string>> | null {
  const base = name.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '');
  const keys: TextField[] = [];
  const ids = FIELDS.map((f) => f.id.toLowerCase());
  let re = '';
  for (const part of pattern.split(/(%[a-zA-Z]+%)/)) {
    const m = part.match(/^%([a-zA-Z]+)%$/);
    if (m) {
      const i = ids.indexOf(m[1].toLowerCase()); if (i < 0 && m[1].toLowerCase() !== 'skip') return null;
      if (i >= 0) keys.push(FIELDS[i].id); re += i >= 0 ? '(.+?)' : '.+?';
    } else re += part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
  }
  const m = base.match(new RegExp('^\\s*' + re + '\\s*$'));
  if (!m) return null;
  const out: Partial<Record<TextField, string>> = {};
  keys.forEach((k, i) => { out[k] = m[i + 1].trim(); });
  return out;
}

/** A file name from tags with a pattern like "%track% %artist% - %title%" (unsafe characters removed; extension kept). */
export function nameFromTags(tags: Tags, pattern: string, oldName: string): string {
  const ext = (oldName.match(/\.[^.]+$/) ?? [''])[0];
  const ids = Object.fromEntries(FIELDS.map((f) => [f.id.toLowerCase(), f.id]));
  let s = pattern.replace(/%([a-zA-Z]+)%/g, (_, k: string) => {
    const id = ids[k.toLowerCase()] as TextField | undefined; if (!id) return '';
    let v = (tags[id] ?? '').trim();
    if (id === 'track') { const n = parseInt(v, 10); v = n > 0 ? String(n).padStart(2, '0') : ''; }
    return v;
  });
  s = s.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '').replace(/\s+/g, ' ').replace(/^[\s.\-–]+|[\s.\-–]+$/g, '').replace(/\s+-\s+-\s+/g, ' - ').trim();
  return (s || oldName.replace(/\.[^.]+$/, '')).slice(0, 200) + ext;
}

const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'vs', 'feat', 'ft', 'with']);
/** Title Case: capitals on each word except small ones in the middle; words in capitals (DJ, UK) stay. */
export function titleCase(s: string): string {
  const words = s.split(/(\s+|(?<=[(\[\-/]))/), shouting = s === s.toUpperCase();
  let first = true;
  return words.map((w, i) => {
    if (!w.trim() || /^[(\[\-/]$/.test(w)) return w;
    const bare = w.replace(/^[^\p{L}\p{N}]+/u, '');
    const isLast = words.slice(i + 1).every((x) => !x.trim());
    let out = w;
    if (!shouting && /\p{Lu}.*\p{Lu}/u.test(bare) && bare === bare.toUpperCase() && bare.length <= 4) out = w;
    else if (!first && !isLast && SMALL.has(bare.toLowerCase().replace(/\.$/, ''))) out = w.toLowerCase();
    else out = w.toLowerCase().replace(/\p{L}/u, (c) => c.toUpperCase());
    first = false;
    return out;
  }).join('');
}

/** artist + title in a form where "(Original Mix)", feat. credits, case, accents and punctuation do not count. */
export function matchKey(artist: string, title: string): string {
  const norm = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[([]\s*(original( mix)?|extended mix|radio edit)\s*[)\]]/g, ' ')
    .replace(/[([]\s*(feat\.?|ft\.?|featuring)\s[^)\]]*[)\]]/g, ' ')
    .replace(/\s(feat\.?|ft\.?|featuring)\s.*$/g, ' ')
    .replace(/&|\band\b|\bx\b/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
  const a = norm(artist), t = norm(title);
  return a || t ? `${a}|${t}` : '';
}
