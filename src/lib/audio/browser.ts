// Browser side of the sound kit: open any sound (or video) file on the device, play samples, save files and ZIPs.
import { readWav, type Sound } from './pcm.ts';

export const ACCEPT_AUDIO = 'audio/*,.mp3,.wav,.ogg,.oga,.opus,.m4a,.aac,.flac,.webm,.mp4,.ulaw,.alaw,.sln';
export const MAX_BYTES = 500e6;

/** Decode a file on this device. WAV files (including u-law and A-law ones browsers cannot play) are read directly. */
export async function decodeFile(f: File | ArrayBuffer): Promise<Sound> {
  const buf = f instanceof ArrayBuffer ? f : await f.arrayBuffer();
  const w = readWav(buf);
  if (w) return w;
  const dec = await new OfflineAudioContext(1, 1, 48000).decodeAudioData(buf.slice(0));
  return { rate: dec.sampleRate, chans: Array.from({ length: dec.numberOfChannels }, (_, c) => dec.getChannelData(c)) };
}

export const baseName = (name: string, fallback = 'sound') => name.replace(/\.[^.]+$/, '') || fallback;
export const sizeText = (b: number) => (b >= 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB');
export const secs = (s: number) => (s >= 60 ? `${Math.floor(s / 60)} min ${Math.round(s % 60)} s` : `${(Math.round(s * 10) / 10).toFixed(1)} s`);

/** Save bytes as a file. */
export function saveBytes(bytes: Uint8Array | Blob, name: string, type = 'application/octet-stream') {
  const blob = bytes instanceof Blob ? bytes : new Blob([bytes], { type });
  const a = document.createElement('a'), u = URL.createObjectURL(blob);
  a.href = u; a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 30000);
}

/** Save several files in one ZIP (stored, not compressed: sound does not shrink much). */
export async function saveZip(files: { name: string; bytes: Uint8Array }[], zipName: string) {
  const { zipSync } = await import('fflate');
  const seen = new Map<string, number>(), entries: Record<string, [Uint8Array, { level: 0 }]> = {};
  for (const f of files) {
    let n = f.name; const k = seen.get(n) ?? 0; seen.set(n, k + 1);
    if (k) n = n.replace(/(\.[^.]+)?$/, `-${k + 1}$1`);
    entries[n] = [f.bytes, { level: 0 }];
  }
  saveBytes(zipSync(entries), zipName, 'application/zip');
}

/** Plays samples; call stop() to end early. One player per page is enough. */
export function player() {
  let ac: AudioContext | null = null, src: AudioBufferSourceNode | null = null;
  const stop = () => { if (src) { src.onended = null; try { src.stop(); } catch {} src = null; } };
  return {
    get playing() { return !!src; },
    stop,
    async play(chans: Float32Array[], rate: number, onEnd?: () => void) {
      stop(); ac ??= new AudioContext(); await ac.resume();
      const b = ac.createBuffer(chans.length, Math.max(1, chans[0].length), rate);
      chans.forEach((c, i) => b.copyToChannel(c, i));
      src = ac.createBufferSource(); src.buffer = b; src.connect(ac.destination);
      src.onended = () => { src = null; onEnd?.(); }; src.start();
    },
  };
}
