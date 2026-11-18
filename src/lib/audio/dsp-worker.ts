// Web Worker for the heavy sound maths (Stem splitter #T1014, Audio repair #T1020), so the page stays responsive.
// Messages in: { job: 'separate', chans, rate, mode, opts } or { job: 'repair', chans, rate, opts }.
// Messages out: { progress: 0..1, label? } while working, then { done: true, chans, info } (or { error }).
import { separate, type StemMode, type SepOptions } from './separate.ts';
import { denoise, noiseProfile, removeHum, declick, declip, detectHum } from './repair.ts';

export type RepairOptions = {
  noise?: { start: number; end: number; reduceDb: number; smoothing: number } | null;
  hum?: { base: 50 | 60 | 'auto'; harmonics: number; widthHz: number } | null;
  clicks?: { sensitivity: number } | null;
  clip?: boolean;
};

const post = (m: unknown, t: Transferable[] = []) => (self as unknown as Worker).postMessage(m, t);

self.onmessage = (e: MessageEvent) => {
  const m = e.data;
  try {
    if (m.job === 'separate') {
      const out = separate(m.chans, m.rate, m.mode as StemMode, { ...(m.opts as SepOptions), onProgress: (f) => post({ progress: f }) });
      post({ done: true, chans: out, info: {} }, out.map((c) => c.buffer));
      return;
    }
    if (m.job === 'repair') {
      const o = m.opts as RepairOptions, rate = m.rate as number, info: Record<string, unknown> = {};
      let chans = m.chans as Float32Array[];
      const steps = [o.clip, o.clicks, o.hum, o.noise].filter(Boolean).length || 1;
      let done = 0;
      const step = (label: string) => post({ progress: done / steps, label });
      if (o.clip) { step('Redrawing clipped peaks'); const r = declip(chans); chans = r.chans; info.clipRuns = r.runs; info.clipGainDb = 20 * Math.log10(r.gain); done++; }
      if (o.clicks) {
        step('Finding clicks'); let n = 0;
        chans = chans.map((c) => { const r = declick(c, rate, { sensitivity: o.clicks!.sensitivity }); n += r.clicks; return r.out; });
        info.clicks = n; done++;
      }
      if (o.hum) {
        step('Removing hum');
        let base = o.hum.base;
        if (base === 'auto') { const d = detectHum(chans, rate); info.humDetected = d.hz; info.humDb = d.db; base = d.hz ?? 0 as 50; }
        if (base) chans = removeHum(chans, rate, base, o.hum.harmonics, o.hum.widthHz);
        info.humBase = base || null; done++;
      }
      if (o.noise) {
        step('Reducing noise');
        const prof = noiseProfile(chans, o.noise.start, o.noise.end), d0 = done;
        chans = denoise(chans, rate, prof, { reduceDb: o.noise.reduceDb, smoothing: o.noise.smoothing, onProgress: (f) => post({ progress: (d0 + f) / steps }) });
        done++;
      }
      post({ done: true, chans, info }, chans.map((c) => c.buffer));
      return;
    }
    post({ error: 'Unknown job' });
  } catch (err) {
    post({ error: String((err as Error)?.message || err) });
  }
};
