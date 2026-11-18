// Web Worker for the DJ tools: runs analyseTrack() off the page so the page stays responsive.
// In: { id, chans: Float32Array[], rate, a4? }. Out: { id, progress, stage } while working, then { id, result } or { id, error }.
import { analyseTrack } from './analyse.ts';

self.onmessage = (e: MessageEvent) => {
  const { id, chans, rate, a4 } = e.data as { id: number; chans: Float32Array[]; rate: number; a4?: number };
  try {
    let last = -1;
    const result = analyseTrack(chans, rate, (f, stage) => {
      const p = Math.round(f * 20);
      if (p !== last) { last = p; (self as unknown as Worker).postMessage({ id, progress: f, stage }); }
    }, a4 ?? 440);
    (self as unknown as Worker).postMessage({ id, result }, [result.env.buffer]);
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: String(err) });
  }
};
