// Video jobs on the device with Mediabunny (MPL-2.0, credited in NOTICE) and the browser's WebCodecs encoder:
// compress, resize, rotate, mute and read a video's details. Loaded with import() so pages stay light.

export type VideoJob = {
  /** Output height in pixels (width follows the shape), or 0 to keep. */
  height?: number;
  /** Video bits per second, or a level from 0 (smallest) to 1 (best). */
  bitrate?: number;
  level?: number;
  rotate?: 0 | 90 | 180 | 270;
  flip?: boolean;
  /** Remove the sound. */
  mute?: boolean;
  /** Re-encode even if the picture could be copied as it is. */
  reencode?: boolean;
  trim?: { start: number; end: number };
};
export type JobResult = { bytes: Uint8Array; ext: 'mp4' | 'webm'; mime: string; note: string[] };

const mb = () => import('mediabunny');

/** MP4 with H.264 where the browser can make it, else WebM with VP9 or VP8. */
async function pickOutput(needVideoEncode: boolean) {
  const M = await mb();
  if (!needVideoEncode) return { ext: 'mp4' as const, codec: undefined, audio: 'aac' as const, M };
  if (await M.canEncodeVideo('avc')) return { ext: 'mp4' as const, codec: 'avc' as const, audio: 'aac' as const, M };
  if (await M.canEncodeVideo('vp9')) return { ext: 'webm' as const, codec: 'vp9' as const, audio: 'opus' as const, M };
  return { ext: 'webm' as const, codec: 'vp8' as const, audio: 'opus' as const, M };
}

export async function runJob(file: Blob, job: VideoJob, onProgress?: (p: number) => void, signal?: { cancel?: () => void }): Promise<JobResult> {
  const needEncode = !!(job.reencode || job.height || job.bitrate || job.level != null);
  let { ext, codec, audio, M } = await pickOutput(needEncode);
  const input = new M.Input({ source: new M.BlobSource(file), formats: M.ALL_FORMATS });
  // Copy-only jobs keep the input's container when it is WebM, so VP8/VP9 video can be copied.
  if (!needEncode) { const f = await input.getFormat(); if (/webm|matroska/i.test(f.name)) ext = 'webm'; }
  const output = new M.Output({ format: ext === 'mp4' ? new M.Mp4OutputFormat({ fastStart: 'in-memory' }) : new M.WebMOutputFormat(), target: new M.BufferTarget() });
  const v = await input.getPrimaryVideoTrack();
  if (!v) throw new Error('no-video');
  const quality = job.bitrate ? new M.Quality({ bitrate: job.bitrate }) : job.level != null ? new M.Quality(job.level) : undefined;
  const conv = await M.Conversion.init({
    input, output, tracks: 'primary', showWarnings: false,
    video: {
      ...(job.height ? { height: Math.round(job.height / 2) * 2 } : {}),
      ...(job.rotate ? { rotate: job.rotate } : {}), ...(job.flip ? { flip: true } : {}),
      ...(needEncode ? { codec, forceTranscode: true, ...(quality ? { quality } : {}) } : {}),
    },
    audio: job.mute ? { discard: true } : needEncode ? { codec: audio, ...(job.bitrate ? { quality: new M.Quality({ bitrate: 128000 }) } : {}) } : {},
    ...(job.trim ? { trim: job.trim } : {}),
  });
  const note: string[] = [];
  for (const d of conv.discardedTracks) if (d.reason !== 'discarded_by_user') note.push(`${d.track.type === 'audio' ? 'The sound' : 'A video track'} was left out (${String(d.reason).replace(/_/g, ' ')}).`);
  if (!conv.isValid) throw new Error('invalid');
  if (onProgress) conv.onProgress = (p) => onProgress(p);
  if (signal) signal.cancel = () => { conv.cancel(); };
  await conv.execute();
  const buf = (output.target as InstanceType<typeof M.BufferTarget>).buffer!;
  return { bytes: new Uint8Array(buf), ext, mime: ext === 'mp4' ? 'video/mp4' : 'video/webm', note };
}

export type VideoInfo = {
  format: string; mime: string; duration: number; size: number;
  video?: { codec: string; width: number; height: number; rotation: number; fps: number; bitrate: number; frames: number };
  audio?: { codec: string; rate: number; channels: number; bitrate: number };
  tracks: number; tags: Record<string, string>;
};

/** What is inside a video file. */
export async function readInfo(file: File): Promise<VideoInfo> {
  const M = await mb();
  const input = new M.Input({ source: new M.BlobSource(file), formats: M.ALL_FORMATS });
  const [fmt, mime, duration, tracks, v, a, tags] = await Promise.all([
    input.getFormat(), input.getMimeType().catch(() => ''), input.computeDuration(), input.getTracks(),
    input.getPrimaryVideoTrack(), input.getPrimaryAudioTrack(), input.getMetadataTags().catch(() => ({})),
  ]);
  const info: VideoInfo = { format: fmt.name, mime, duration, size: file.size, tracks: tracks.length, tags: {} };
  for (const [k, val] of Object.entries(tags as Record<string, unknown>)) if (typeof val === 'string' || typeof val === 'number') info.tags[k] = String(val);
    else if (val instanceof Date) info.tags[k] = val.toISOString().slice(0, 19).replace('T', ' ');
  if (v) {
    const st = await v.computePacketStats(300);
    info.video = { codec: (await v.getCodecParameterString()) || v.codec || '?', width: v.displayWidth, height: v.displayHeight, rotation: v.rotation, fps: st.averagePacketRate, bitrate: st.averageBitrate, frames: st.packetCount };
  }
  if (a) {
    const st = await a.computePacketStats(300);
    info.audio = { codec: (await a.getCodecParameterString()) || a.codec || '?', rate: a.sampleRate, channels: a.numberOfChannels, bitrate: st.averageBitrate };
  }
  return info;
}

