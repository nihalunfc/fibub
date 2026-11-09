// Renders Mandelbrot and Julia images in bands off the main thread, so the page stays responsive.
// A newer job cancels the one in progress.
import { renderRows, type Job } from './fractal.ts';

let current = 0;
self.onmessage = async (e: MessageEvent) => {
  const { id, job } = e.data as { id: number; job: Job };
  current = id;
  const t0 = performance.now();
  const band = Math.max(1, Math.floor(60000 / job.w));
  for (let y0 = 0; y0 < job.h; y0 += band) {
    if (current !== id) return;
    const y1 = Math.min(job.h, y0 + band), out = new Float32Array((y1 - y0) * job.w);
    renderRows(job, y0, y1, out);
    (self as unknown as Worker).postMessage({ id, y0, y1, data: out }, [out.buffer]);
    await new Promise((r) => setTimeout(r, 0));
  }
  if (current === id) (self as unknown as Worker).postMessage({ id, done: true, ms: performance.now() - t0 });
};
