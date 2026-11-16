// Save decoded sound as a file: WAV (16 or 24-bit), MP3 (LAME via lamejs, LGPL-3.0, loaded only when needed) or phone u-law.
import { writeWav, resample, toPhone, phoneFile, toMono, type Sound } from './pcm.ts';
import { toInt16 } from './g711.ts';

export type OutFormat = 'wav16' | 'wav24' | 'mp3-128' | 'mp3-192' | 'mp3-320' | 'mp3-64m' | 'ulaw';
export const OUT_FORMATS: Record<OutFormat, { label: string; ext: string; mime: string }> = {
  'mp3-192': { label: 'MP3, 192 kbps (good for music)', ext: 'mp3', mime: 'audio/mpeg' },
  'mp3-320': { label: 'MP3, 320 kbps (highest)', ext: 'mp3', mime: 'audio/mpeg' },
  'mp3-128': { label: 'MP3, 128 kbps (smaller)', ext: 'mp3', mime: 'audio/mpeg' },
  'mp3-64m': { label: 'MP3, 64 kbps mono (speech, smallest)', ext: 'mp3', mime: 'audio/mpeg' },
  wav16: { label: 'WAV, 16-bit (CD quality, opens anywhere)', ext: 'wav', mime: 'audio/wav' },
  wav24: { label: 'WAV, 24-bit (for more editing)', ext: 'wav', mime: 'audio/wav' },
  ulaw: { label: 'u-law 8 kHz (phone systems, Asterisk)', ext: 'ulaw', mime: 'audio/basic' },
};

const MP3_RATES = [8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000];

/** Rough size in bytes before saving. */
export function estimateBytes(seconds: number, rate: number, channels: number, f: OutFormat): number {
  if (f === 'ulaw') return Math.round(seconds * 8000);
  if (f.startsWith('mp3')) return Math.round((seconds * +f.slice(4).replace('m', '') * 1000) / 8);
  return 44 + Math.round(seconds * rate) * Math.min(2, channels) * (f === 'wav24' ? 3 : 2);
}

/** MP3 bytes. Stereo stays stereo (more than 2 channels are mixed to 2); odd rates are resampled to 48 kHz. */
export async function encodeMp3(s: Sound, kbps: number, mono = false): Promise<Uint8Array> {
  const { Mp3Encoder } = await import('@breezystack/lamejs');
  let chans = mono || s.chans.length === 1 ? [toMono(s.chans)] : s.chans.length === 2 ? s.chans : [toMono(s.chans.filter((_, i) => i % 2 === 0)), toMono(s.chans.filter((_, i) => i % 2 === 1))];
  let rate = s.rate;
  if (!MP3_RATES.includes(rate)) { const to = rate > 48000 ? 48000 : MP3_RATES.find((r) => r >= rate)!; chans = chans.map((c) => resample(c, rate, to)); rate = to; }
  const enc = new Mp3Encoder(chans.length, rate, kbps), n = chans[0].length, parts: Uint8Array[] = [];
  const ints = chans.map((c) => { const o = new Int16Array(n); for (let i = 0; i < n; i++) o[i] = toInt16(c[i]); return o; });
  for (let i = 0; i < n; i += 1152 * 20) {
    const out = enc.encodeBuffer(ints[0].subarray(i, i + 1152 * 20), ints[1]?.subarray(i, i + 1152 * 20));
    if (out.length) parts.push(new Uint8Array(out));
  }
  const end = enc.flush(); if (end.length) parts.push(new Uint8Array(end));
  const total = parts.reduce((a, p) => a + p.length, 0), all = new Uint8Array(total);
  let o = 0; for (const p of parts) { all.set(p, o); o += p.length; }
  return all;
}

/** The file for one format. */
export async function encodeAs(s: Sound, f: OutFormat): Promise<Uint8Array> {
  if (f === 'ulaw') return phoneFile(toPhone(s, { normaliseDb: null }), 'ulaw');
  if (f.startsWith('mp3')) return encodeMp3(s, +f.slice(4).replace('m', ''), f.endsWith('m'));
  const chans = s.chans.length > 2 ? [toMono(s.chans)] : s.chans;
  return writeWav(chans, s.rate, 1, f === 'wav24' ? 24 : 16);
}
