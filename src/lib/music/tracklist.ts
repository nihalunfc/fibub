// Tracklist formats for the mix recorder (#T1021): timestamps, CUE sheets (75 frames per second) and CSV,
// plus a streaming 16-bit WAV header so a long recording can be saved from chunks. Plain TypeScript, no DOM.

export interface Mark { t: number; artist: string; title: string } // t in seconds from the start of the mix

/** "03:25" under an hour, "01:03:25" when the mix runs an hour or more (pass long = true for every line). */
export function stamp(t: number, long = false): string {
  const s = Math.max(0, Math.floor(t + 1e-6)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return long || h ? `${p(h)}:${p(m)}:${p(x)}` : `${p(m)}:${p(x)}`;
}
/** CUE sheet time mm:ss:ff, 75 frames per second; minutes go past 99 for long mixes. */
export function cueTime(t: number): string {
  const f = Math.max(0, Math.round(t * 75)), m = Math.floor(f / 4500), s = Math.floor((f % 4500) / 75), fr = f % 75;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(fr).padStart(2, '0')}`;
}
/** Read a typed time: "75", "1:15", "1:02:03", "1:15.5". NaN if it does not read. */
export function parseTime(s: string): number {
  const t = s.trim(); if (!/^\d+(:\d{1,2}){0,2}(\.\d+)?$/.test(t)) return NaN;
  return t.split(':').reduce((a, p) => a * 60 + parseFloat(p), 0);
}
const sorted = (ms: Mark[]) => [...ms].sort((a, b) => a.t - b.t);
const label = (m: Mark, i: number) => (m.artist && m.title ? `${m.artist} – ${m.title}` : m.title || m.artist || `Track ${i + 1}`);

/** Plain text, one line per track: "00:00 Artist – Title". */
export function tracklistText(marks: Mark[], total = 0): string {
  const ms = sorted(marks), long = Math.max(total, ms.at(-1)?.t ?? 0) >= 3600;
  return ms.map((m, i) => `${stamp(m.t, long)} ${label(m, i)}`).join('\n') + (ms.length ? '\n' : '');
}
const q = (s: string) => `"${s.replace(/"/g, "'").replace(/[\r\n]+/g, ' ')}"`;
/** CUE sheet for the recording file. The first track starts at 00:00:00 even if the first mark is later. */
export function cueSheet(marks: Mark[], file: string, opts: { performer?: string; title?: string } = {}): string {
  const ms = sorted(marks), type = /\.mp3$/i.test(file) ? 'MP3' : /\.aiff?$/i.test(file) ? 'AIFF' : 'WAVE';
  if (ms.length && ms[0].t > 0) ms.unshift({ t: 0, artist: opts.performer ?? '', title: 'Intro' });
  const L: string[] = [];
  if (opts.performer) L.push(`PERFORMER ${q(opts.performer)}`);
  if (opts.title) L.push(`TITLE ${q(opts.title)}`);
  L.push(`FILE ${q(file)} ${type}`);
  ms.forEach((m, i) => {
    L.push(`  TRACK ${String(i + 1).padStart(2, '0')} AUDIO`, `    TITLE ${q(m.title || `Track ${i + 1}`)}`);
    if (m.artist) L.push(`    PERFORMER ${q(m.artist)}`);
    L.push(`    INDEX 01 ${cueTime(m.t)}`);
  });
  return L.join('\r\n') + '\r\n';
}
const c = (s: string) => (/[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
/** CSV: number, start (h:mm:ss), start in seconds, artist, title, length in seconds (to the next mark or the end). */
export function tracklistCsv(marks: Mark[], total = 0): string {
  const ms = sorted(marks), L = ['number,start,seconds,artist,title,length_seconds'];
  ms.forEach((m, i) => { const end = i + 1 < ms.length ? ms[i + 1].t : total; L.push([i + 1, stamp(m.t, true), m.t.toFixed(2), c(m.artist), c(m.title), end > m.t ? (end - m.t).toFixed(2) : ''].join(',')); });
  return L.join('\r\n') + '\r\n';
}
/** Split "Artist – Title" (en dash, em dash or " - ") into its parts. */
export function splitLabel(s: string): { artist: string; title: string } {
  const m = s.match(/^(.*?)\s+[–—-]\s+(.*)$/);
  return m ? { artist: m[1].trim(), title: m[2].trim() } : { artist: '', title: s.trim() };
}
/** 44-byte header for 16-bit PCM WAV of `frames` frames. WAV sizes are 32-bit, so about 6 h of 48 kHz stereo at most. */
export function wavHeader(frames: number, rate: number, channels: number): Uint8Array {
  const data = frames * channels * 2, b = new Uint8Array(44), v = new DataView(b.buffer);
  const s = (o: number, t: string) => { for (let i = 0; i < 4; i++) b[o + i] = t.charCodeAt(i); };
  s(0, 'RIFF'); v.setUint32(4, Math.min(0xffffffff, 36 + data), true); s(8, 'WAVE'); s(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, channels, true); v.setUint32(24, rate, true);
  v.setUint32(28, rate * channels * 2, true); v.setUint16(32, channels * 2, true); v.setUint16(34, 16, true);
  s(36, 'data'); v.setUint32(40, Math.min(0xffffffff, data), true);
  return b;
}
export const WAV_MAX_BYTES = 0xffffffff - 36;
/** Interleave float channels into 16-bit little-endian PCM. */
export function toPcm16(chans: Float32Array[]): Int16Array {
  const n = chans[0].length, k = chans.length, o = new Int16Array(n * k);
  for (let i = 0; i < n; i++) for (let c = 0; c < k; c++) { const x = Math.max(-1, Math.min(1, chans[c][i])); o[i * k + c] = x < 0 ? Math.round(x * 32768) : Math.round(x * 32767); }
  return o;
}
