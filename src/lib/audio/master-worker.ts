// Web Worker for Track mastering: runs the chain (master.ts) and the before/after loudness (loudness.ts) off the page.
import { master, type MasterSettings } from './master.ts';
import { measure } from './loudness.ts';

type Job = { id: number; chans: Float32Array[]; rate: number; settings: MasterSettings; measureIn: boolean };
self.onmessage = (e: MessageEvent<Job>) => {
  const { id, chans, rate, settings, measureIn } = e.data;
  const post = (m: object, t: Transferable[] = []) => (self as unknown as Worker).postMessage({ id, ...m }, t);
  try {
    let before = null;
    if (measureIn) { post({ progress: 'Measuring the original' }); before = measure(chans, rate); }
    const r = master(chans, rate, settings, (s) => post({ progress: s === 'eq' ? 'Tone' : s === 'comp' ? 'Glue compression' : 'Limiting to the target' }));
    post({ progress: 'Measuring the master' });
    const after = measure(r.chans, rate);
    post({ done: true, before, after, chans: r.chans, gainDb: r.gainDb, reached: r.reached, maxGrDb: r.maxGrDb, compGrDb: r.compGrDb, gr: r.gr, iterations: r.iterations }, [...r.chans.map((c) => c.buffer), r.gr.buffer]);
  } catch (err) { post({ error: String(err) }); }
};
