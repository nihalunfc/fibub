// Make new videos frame by frame on the device: join clips, change speed, turn a GIF into a video, put new sound on a
// video. Mediabunny (MPL-2.0, credited in NOTICE) reads and writes the files; the browser's WebCodecs encoder does the
// encoding. Loaded with import() so pages stay light. Nothing is uploaded.
import { resample, toMono } from '../audio/pcm.ts';
import { stretchChans } from '../audio/stretch.ts';
import { gifFrames, gifInfo } from './gif.ts';

export type Made = { bytes: Uint8Array; ext: 'mp4' | 'webm'; mime: string; note: string[]; width?: number; height?: number; duration?: number };
export type Progress = (p: number) => void;
export type Cancel = { cancel?: () => void; cancelled?: boolean };

const mb = () => import('mediabunny');
const RATE = 48000;
const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);
const stopIf = (sig?: Cancel) => { if (sig?.cancelled) throw new Error('cancelled'); };

/** An output file: MP4 with H.264 and AAC where the browser can encode them, else WebM with VP9/VP8 and Opus. */
async function writer(opts: { video: boolean; audio: boolean; quality?: number; prefer?: 'mp4' | 'webm' }) {
  const M = await mb();
  let ext: 'mp4' | 'webm' = 'mp4', vcodec: 'avc' | 'vp9' | 'vp8' = 'avc';
  if (opts.prefer === 'webm' || !(await M.canEncodeVideo('avc'))) { ext = 'webm'; vcodec = (await M.canEncodeVideo('vp9')) ? 'vp9' : 'vp8'; }
  let acodec: 'aac' | 'opus' = ext === 'mp4' && (await M.canEncodeAudio('aac')) ? 'aac' : 'opus';
  if (opts.audio && acodec === 'opus' && !(await M.canEncodeAudio('opus'))) throw new Error('no-audio-encoder');
  const output = new M.Output({ format: ext === 'mp4' ? new M.Mp4OutputFormat({ fastStart: 'in-memory' }) : new M.WebMOutputFormat(), target: new M.BufferTarget() });
  return { M, output, ext, vcodec, acodec, quality: new M.Quality(opts.quality ?? 0.75) };
}

const finish = async (w: Awaited<ReturnType<typeof writer>>, note: string[], extra: Partial<Made> = {}): Promise<Made> => {
  await w.output.finalize();
  const buf = (w.output.target as InstanceType<typeof w.M.BufferTarget>).buffer!;
  return { bytes: new Uint8Array(buf), ext: w.ext, mime: w.ext === 'mp4' ? 'video/mp4' : 'video/webm', note, ...extra };
};

/** Every sample of an audio track as 48 kHz stereo (or `secs` of silence when there is none). */
async function trackPcm(M: typeof import('mediabunny'), track: import('mediabunny').InputAudioTrack | null, start: number, end: number): Promise<Float32Array[]> {
  const n = Math.max(0, Math.round((end - start) * RATE));
  if (!track || !n) return [new Float32Array(n), new Float32Array(n)];
  const sink = new M.AudioBufferSink(track), parts: AudioBuffer[] = [], first: number[] = [];
  for await (const { buffer, timestamp } of sink.buffers(start, end)) { parts.push(buffer); first.push(timestamp); }
  if (!parts.length) return [new Float32Array(n), new Float32Array(n)];
  const rate = parts[0].sampleRate, total = Math.round((end - start) * rate);
  const chans = [new Float32Array(total), new Float32Array(total)];
  parts.forEach((b, i) => {
    const at = Math.round((first[i] - start) * rate), src = Array.from({ length: b.numberOfChannels }, (_, c) => b.getChannelData(c));
    const pair = src.length === 1 ? [src[0], src[0]] : src.length === 2 ? src : [toMono(src.filter((_, k) => k % 2 === 0)), toMono(src.filter((_, k) => k % 2 === 1))];
    for (let c = 0; c < 2; c++) for (let j = 0; j < b.length; j++) { const k = at + j; if (k >= 0 && k < total) chans[c][k] = pair[c][j]; }
  });
  return chans.map((c) => (rate === RATE ? c : resample(c, rate, RATE))).map((c) => fitLen(c, n));
}

const fitLen = (x: Float32Array, n: number) => { if (x.length === n) return x; const o = new Float32Array(n); o.set(x.subarray(0, n)); return o; };

/** Write planar stereo samples in one-second pieces starting at `t0` seconds. */
async function pushPcm(M: typeof import('mediabunny'), src: import('mediabunny').AudioSampleSource, chans: Float32Array[], t0: number) {
  const len = chans[0].length;
  for (let i = 0; i < len; i += RATE) {
    const n = Math.min(RATE, len - i), data = new Float32Array(n * chans.length);
    chans.forEach((c, k) => data.set(c.subarray(i, i + n), k * n));
    const s = new M.AudioSample({ data, format: 'f32-planar', numberOfChannels: chans.length, sampleRate: RATE, timestamp: t0 + i / RATE });
    await src.add(s); s.close();
  }
}

export type ClipInfo = { width: number; height: number; duration: number; fps: number; hasAudio: boolean; codec: string; rotation: number };

/** Size, length and frame rate of a video, as shown (turn applied). */
export async function clipInfo(file: Blob): Promise<ClipInfo> {
  const M = await mb();
  const input = new M.Input({ source: new M.BlobSource(file), formats: M.ALL_FORMATS });
  const v = await input.getPrimaryVideoTrack();
  if (!v) throw new Error('no-video');
  const [a, dur, st] = await Promise.all([input.getPrimaryAudioTrack(), input.computeDuration(), v.computePacketStats(120)]);
  return { width: v.displayWidth, height: v.displayHeight, duration: dur, fps: st.averagePacketRate || 30, hasAudio: !!a, codec: v.codec ?? '?', rotation: v.rotation };
}

export type JoinOptions = { height?: number; fit?: 'contain' | 'cover'; background?: string; quality?: number; mute?: boolean };

/** Join videos end to end into one file. Every clip is fitted into the first clip's frame (or `height`), sound kept in step. */
export async function joinVideos(files: Blob[], o: JoinOptions = {}, onProgress?: Progress, sig?: Cancel): Promise<Made> {
  const M = await mb();
  const inputs = files.map((f) => new M.Input({ source: new M.BlobSource(f), formats: M.ALL_FORMATS }));
  const clips: { v: import('mediabunny').InputVideoTrack; a: import('mediabunny').InputAudioTrack | null; start: number; end: number }[] = [];
  for (const [i, input] of inputs.entries()) {
    const v = await input.getPrimaryVideoTrack();
    if (!v) throw Object.assign(new Error('no-video'), { index: i });
    const a = o.mute ? null : await input.getPrimaryAudioTrack();
    const start = await v.getFirstTimestamp(), end = await input.computeDuration();
    clips.push({ v, a, start, end: Math.max(end, start + 0.04) });
  }
  const first = clips[0].v, H0 = o.height && o.height < first.displayHeight ? o.height : first.displayHeight;
  const height = even(H0), width = even((first.displayWidth * H0) / first.displayHeight);
  const anyAudio = clips.some((c) => c.a);
  const w = await writer({ video: true, audio: anyAudio, quality: o.quality });
  const canvas = new OffscreenCanvas(width, height), ctx = canvas.getContext('2d')!;
  const vs = new M.CanvasSource(canvas, { codec: w.vcodec, bitrate: w.quality, keyFrameInterval: 2 });
  w.output.addVideoTrack(vs);
  const as = anyAudio ? new M.AudioSampleSource({ codec: w.acodec, bitrate: new M.Quality(0.75) }) : null;
  if (as) w.output.addAudioTrack(as);
  await w.output.start();
  if (sig) sig.cancel = () => { sig.cancelled = true; };
  const total = clips.reduce((s, c) => s + c.end - c.start, 0);
  let offset = 0;
  try {
    for (const c of clips) {
      const len = c.end - c.start;
      const sink = new M.CanvasSink(c.v, { width, height, fit: o.fit ?? 'contain', poolSize: 2 });
      const video = (async () => {
        let last = -1;
        for await (const fr of sink.canvases(c.start, c.end)) {
          stopIf(sig);
          const t = Math.max(last + 0.001, offset + fr.timestamp - c.start);
          if (t >= offset + len) break;
          ctx.fillStyle = o.background ?? '#000'; ctx.fillRect(0, 0, width, height); ctx.drawImage(fr.canvas, 0, 0);
          await vs.add(t, Math.min(fr.duration, offset + len - t)); last = t;
          onProgress?.(Math.min(0.999, (t + fr.duration) / total));
        }
      })();
      const audio = as ? trackPcm(M, c.a, c.start, c.end).then((p) => pushPcm(M, as, p, offset)) : Promise.resolve();
      await Promise.all([video, audio]);
      offset += len;
    }
  } catch (e) { await w.output.cancel(); throw e; }
  vs.close(); as?.close();
  const note = o.mute ? [] : clips.filter((c) => !c.a).length && anyAudio ? ['Clips without sound are silent in the joined video.'] : [];
  return finish(w, note, { width, height, duration: offset });
}

export type SpeedOptions = { speed: number; keepPitch?: boolean; mute?: boolean; fps?: number; quality?: number };

/** Play a video faster or slower. Frames are dropped or repeated so the frame rate stays even; sound follows (0.25× to 4×). */
export async function speedVideo(file: Blob, o: SpeedOptions, onProgress?: Progress, sig?: Cancel): Promise<Made> {
  const M = await mb();
  const input = new M.Input({ source: new M.BlobSource(file), formats: M.ALL_FORMATS });
  const v = await input.getPrimaryVideoTrack();
  if (!v) throw new Error('no-video');
  const note: string[] = [];
  const s = o.speed, soundOk = s >= 0.25 && s <= 4;
  let a = o.mute ? null : await input.getPrimaryAudioTrack();
  if (a && !soundOk) { a = null; note.push(`The sound was left out: at ${s}× it would be just noise or a hum.`); }
  const start = await v.getFirstTimestamp(), end = await input.computeDuration(), len = end - start;
  const stats = await v.computePacketStats(120), srcFps = stats.averagePacketRate || 30;
  const fps = Math.min(60, o.fps || Math.round(srcFps) || 30), outLen = len / s, n = Math.max(1, Math.floor(outLen * fps + 1e-6));
  const width = even(v.displayWidth), height = even(v.displayHeight);
  const w = await writer({ video: true, audio: !!a, quality: o.quality });
  const canvas = new OffscreenCanvas(width, height), ctx = canvas.getContext('2d')!;
  const vs = new M.CanvasSource(canvas, { codec: w.vcodec, bitrate: w.quality, keyFrameInterval: 2 });
  w.output.addVideoTrack(vs, { frameRate: fps });
  const as = a ? new M.AudioSampleSource({ codec: w.acodec, bitrate: new M.Quality(0.75) }) : null;
  if (as) w.output.addAudioTrack(as);
  await w.output.start();
  if (sig) sig.cancel = () => { sig.cancelled = true; };
  const sink = new M.CanvasSink(v, { width, height, fit: 'fill', poolSize: 2 });
  const times = function* () { for (let k = 0; k < n; k++) yield start + Math.min(len - 1e-3, (k / fps) * s); };
  try {
    const video = (async () => {
      let k = 0;
      for await (const fr of sink.canvasesAtTimestamps(times())) {
        stopIf(sig);
        if (fr) { ctx.drawImage(fr.canvas, 0, 0, width, height); }
        await vs.add(k / fps, 1 / fps); k++;
        onProgress?.(Math.min(0.999, k / n));
      }
    })();
    const audio = as ? trackPcm(M, a, start, end).then((p) => {
      const out = o.keepPitch === false ? p.map((c) => resample(c, RATE * s, RATE)) : stretchChans(p, RATE, 1 / s);
      return pushPcm(M, as, out.map((c) => fitLen(c, Math.round((n / fps) * RATE))), 0);
    }) : Promise.resolve();
    await Promise.all([video, audio]);
  } catch (e) { await w.output.cancel(); throw e; }
  vs.close(); as?.close();
  return finish(w, note, { width, height, duration: n / fps });
}

export type GifOptions = { background?: string; repeat?: number; maxSide?: number; quality?: number };

/** A GIF as a video: every frame with its own timing, transparent parts filled with `background`, played `repeat` times. */
export async function gifToVideo(bytes: Uint8Array, o: GifOptions = {}, onProgress?: Progress, sig?: Cancel): Promise<Made> {
  const M = await mb();
  const info = gifInfo(bytes), repeat = Math.max(1, Math.min(100, Math.round(o.repeat ?? 1)));
  const scale = Math.min(1, (o.maxSide ?? 1920) / Math.max(info.width, info.height));
  const width = even(info.width * scale), height = even(info.height * scale);
  const w = await writer({ video: true, audio: false, quality: o.quality ?? 0.9 });
  const canvas = new OffscreenCanvas(width, height), ctx = canvas.getContext('2d')!;
  const frame = new OffscreenCanvas(info.width, info.height), fctx = frame.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  const vs = new M.CanvasSource(canvas, { codec: w.vcodec, bitrate: w.quality, keyFrameInterval: 2 });
  w.output.addVideoTrack(vs);
  await w.output.start();
  let t = 0, done = 0;
  const total = info.frames * repeat;
  try {
    for (let r = 0; r < repeat; r++) {
      for (const f of gifFrames(bytes)) {
        stopIf(sig);
        fctx.putImageData(new ImageData(f.rgba as Uint8ClampedArray<ArrayBuffer>, info.width, info.height), 0, 0);
        ctx.fillStyle = o.background ?? '#ffffff'; ctx.fillRect(0, 0, width, height);
        ctx.drawImage(frame, 0, 0, width, height);
        await vs.add(t, f.ms / 1000); t += f.ms / 1000;
        onProgress?.(++done / total);
      }
    }
  } catch (e) { await w.output.cancel(); throw e; }
  vs.close();
  return finish(w, [], { width, height, duration: t });
}

export type MixOptions = {
  /** 'replace' drops the video's own sound; 'mix' keeps it under the new sound. */
  mode: 'replace' | 'mix';
  /** Volumes from 0 to 2 (1 = as it is). */
  newVol?: number; oldVol?: number;
  /** Start the new sound this many seconds into the video, and skip this many seconds of it. */
  at?: number; skip?: number;
  loop?: boolean; fadeIn?: number; fadeOut?: number;
};

/** Put a sound (already decoded to stereo/mono samples) on a video. The picture is copied as it is: no quality lost. */
export async function addSound(file: Blob, sound: { rate: number; chans: Float32Array[] }, o: MixOptions, onProgress?: Progress, sig?: Cancel): Promise<Made> {
  const M = await mb();
  const input = new M.Input({ source: new M.BlobSource(file), formats: M.ALL_FORMATS });
  const v = await input.getPrimaryVideoTrack();
  if (!v) throw new Error('no-video');
  const old = o.mode === 'mix' ? await input.getPrimaryAudioTrack() : null;
  const start = await v.getFirstTimestamp(), end = await input.computeDuration(), len = Math.max(0.04, end - start);
  const n = Math.round(len * RATE);
  // The new sound at 48 kHz stereo, placed, looped, faded and mixed.
  const pair = sound.chans.length === 1 ? [sound.chans[0], sound.chans[0]] : sound.chans.slice(0, 2);
  const music = pair.map((c) => (sound.rate === RATE ? c : resample(c, sound.rate, RATE)));
  const skip = Math.min(music[0].length - 1, Math.max(0, Math.round((o.skip ?? 0) * RATE))), at = Math.max(0, Math.round((o.at ?? 0) * RATE));
  const mlen = music[0].length - skip, gainNew = o.newVol ?? 1, gainOld = o.oldVol ?? 1;
  const mix = [new Float32Array(n), new Float32Array(n)];
  const placed = Math.min(n - at, o.loop ? n - at : mlen);
  const fi = Math.round((o.fadeIn ?? 0) * RATE), fo = Math.round((o.fadeOut ?? 0) * RATE);
  for (let c = 0; c < 2; c++) for (let j = 0; j < placed; j++) {
    let g = gainNew;
    if (fi && j < fi) g *= j / fi;
    if (fo && j > placed - fo) g *= Math.max(0, (placed - j) / fo);
    mix[c][at + j] = music[c][skip + (j % mlen)] * g;
  }
  if (old) { const p = await trackPcm(M, old, start, end); for (let c = 0; c < 2; c++) for (let j = 0; j < n; j++) mix[c][j] += p[c][j] * gainOld; }
  let peak = 0; for (const c of mix) for (let j = 0; j < n; j++) peak = Math.max(peak, Math.abs(c[j]));
  const note: string[] = [];
  if (peak > 1) { for (const c of mix) for (let j = 0; j < n; j++) c[j] /= peak; note.push(`The mix was turned down ${(20 * Math.log10(peak)).toFixed(1)} dB so it does not clip.`); }
  // Copy the picture packets; MP4 when it can hold this video's codec, else WebM.
  const codec = v.codec;
  if (!codec) throw new Error('unknown-codec');
  const mp4ok = new M.Mp4OutputFormat().getSupportedVideoCodecs().includes(codec);
  const ext: 'mp4' | 'webm' = mp4ok ? 'mp4' : 'webm';
  const acodec = ext === 'mp4' && (await M.canEncodeAudio('aac')) ? 'aac' : 'opus';
  if (acodec === 'opus' && !(await M.canEncodeAudio('opus'))) throw new Error('no-audio-encoder');
  const output = new M.Output({ format: ext === 'mp4' ? new M.Mp4OutputFormat({ fastStart: 'in-memory' }) : new M.WebMOutputFormat(), target: new M.BufferTarget() });
  const vs = new M.EncodedVideoPacketSource(codec);
  output.addVideoTrack(vs, { rotation: v.rotation });
  const as = new M.AudioSampleSource({ codec: acodec, bitrate: new M.Quality(0.75) });
  output.addAudioTrack(as);
  await output.start();
  if (sig) sig.cancel = () => { sig.cancelled = true; };
  try {
    const cfg = await v.getDecoderConfig();
    const video = (async () => {
      let firstPacket = true;
      for await (const p of new M.EncodedPacketSink(v).packets()) {
        stopIf(sig);
        await vs.add(start ? p.clone({ timestamp: p.timestamp - start }) : p, firstPacket && cfg ? { decoderConfig: cfg } : undefined);
        firstPacket = false;
        onProgress?.(Math.min(0.999, (p.timestamp - start) / len));
      }
    })();
    await Promise.all([video, pushPcm(M, as, mix, 0)]);
  } catch (e) { await output.cancel(); throw e; }
  vs.close(); as.close();
  await output.finalize();
  const buf = (output.target as InstanceType<typeof M.BufferTarget>).buffer!;
  return { bytes: new Uint8Array(buf), ext, mime: ext === 'mp4' ? 'video/mp4' : 'video/webm', note, duration: len };
}
