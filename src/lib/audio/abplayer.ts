// Browser player for comparing versions: several sounds play together in sync, only the chosen one is heard, so
// switching keeps the place. Each has its own level (for loudness matching). Loop a region; listen in stereo, mono
// (L+R)/2 or side only (L-R)/2. Used by Track mastering, Phase checker and A/B compare.
export type Mode = 'stereo' | 'mono' | 'side';
export type Track = { chans: Float32Array[]; rate: number; gainDb: number };

export function abPlayer() {
  let ac: AudioContext | null = null, bufs: AudioBuffer[] = [], gains: GainNode[] = [], srcs: AudioBufferSourceNode[] = [];
  let mat: GainNode[] = [], out: GainNode | null = null, levels: number[] = [];
  let active = 0, startAt = 0, offset = 0, playing = false, loop: [number, number] | null = null, mode: Mode = 'stereo';
  let onEnd: (() => void) | null = null, endTimer = 0;
  const duration = () => Math.max(0, ...bufs.map((b) => b.duration));
  const ctx = () => {
    if (!ac) {
      ac = new AudioContext();
      // Stereo matrix: splitter -> 4 gains -> merger, so mono and side-only listening are just gain changes.
      const sp = ac.createChannelSplitter(2), mg = ac.createChannelMerger(2);
      out = ac.createGain(); out.connect(sp);
      mat = [0, 1, 2, 3].map(() => ac!.createGain());
      sp.connect(mat[0], 0); sp.connect(mat[1], 1); sp.connect(mat[2], 0); sp.connect(mat[3], 1);
      mat[0].connect(mg, 0, 0); mat[1].connect(mg, 0, 0); mat[2].connect(mg, 0, 1); mat[3].connect(mg, 0, 1);
      mg.connect(ac.destination); setMode(mode);
    }
    return ac;
  };
  const setMode = (m: Mode) => {
    mode = m; if (!ac) return;
    const v = m === 'stereo' ? [1, 0, 0, 1] : m === 'mono' ? [0.5, 0.5, 0.5, 0.5] : [0.5, -0.5, 0.5, -0.5];
    mat.forEach((g, i) => g.gain.setTargetAtTime(v[i], ac!.currentTime, 0.005));
  };
  const position = () => {
    if (!playing || !ac) return offset;
    let t = ac.currentTime - startAt + offset;
    if (loop && t > loop[1]) t = loop[0] + ((t - loop[0]) % (loop[1] - loop[0]));
    return Math.min(t, duration());
  };
  const stopSrcs = () => { for (const s of srcs) { s.onended = null; try { s.stop(); } catch {} s.disconnect(); } srcs = []; clearTimeout(endTimer); };
  const play = async (from = position()) => {
    const c = ctx(); await c.resume(); stopSrcs();
    if (loop && (from < loop[0] || from >= loop[1])) from = loop[0];
    if (from >= duration()) from = 0;
    offset = from; startAt = c.currentTime + 0.02;
    srcs = bufs.map((b, i) => {
      const s = c.createBufferSource(); s.buffer = b; s.connect(gains[i]);
      if (loop) { s.loop = true; s.loopStart = loop[0]; s.loopEnd = Math.min(loop[1], b.duration); }
      if (from < b.duration) s.start(startAt, from);
      return s;
    });
    playing = true;
    if (!loop) endTimer = window.setTimeout(() => { playing = false; offset = 0; stopSrcs(); onEnd?.(); }, (duration() - from) * 1000 + 60);
  };
  const pause = () => { if (!playing) return; offset = position(); stopSrcs(); playing = false; };
  const applyGains = () => { if (!ac) return; gains.forEach((g, i) => g.gain.setTargetAtTime(i === active ? Math.pow(10, levels[i] / 20) : 0, ac!.currentTime, 0.004)); };
  return {
    get playing() { return playing; },
    get active() { return active; },
    get duration() { return duration(); },
    get mode() { return mode; },
    position,
    /** Replace the sounds. Keeps the place if playing. */
    load(list: Track[]) {
      const was = playing, at = position(); pause();
      const c = ctx(); gains.forEach((g) => g.disconnect());
      bufs = list.map((t) => { const b = c.createBuffer(t.chans.length, Math.max(1, t.chans[0].length), t.rate); t.chans.forEach((ch, i) => b.copyToChannel(ch, i)); return b; });
      levels = list.map((t) => t.gainDb);
      gains = list.map(() => { const g = c.createGain(); g.gain.value = 0; g.connect(out!); return g; });
      if (active >= list.length) active = 0;
      applyGains(); offset = Math.min(at, duration());
      if (was) play(offset);
    },
    setLevels(db: number[]) { levels = db; applyGains(); },
    select(i: number) { active = i; applyGains(); },
    play, pause,
    seek(t: number) { offset = Math.max(0, Math.min(duration(), t)); if (playing) play(offset); },
    setLoop(r: [number, number] | null) { loop = r && r[1] - r[0] > 0.05 ? r : null; if (playing) play(position()); },
    setMode,
    onEnded(f: () => void) { onEnd = f; },
    stop() { stopSrcs(); playing = false; offset = 0; },
  };
}
