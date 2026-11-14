// Shared engine for the internet tools (#T950 Speed Test, #T951 Wi-Fi Finder, #T952 Cell Signal).
// It times downloads and uploads of random bytes against Cloudflare's public speed test server
// (speed.cloudflare.com, the same server Cloudflare's own open-source @cloudflare/speedtest library uses).
// Only random test bytes go up; nothing about the visitor is sent, and unlike Cloudflare's library we never
// post the results anywhere. Results stay on the page.
// The pure maths (median, jitter, grades) has no DOM so it can be checked on its own.

export const SPEED_HOST = 'https://speed.cloudflare.com';

export type Phase = 'latency' | 'download' | 'upload' | 'done';
export type Result = {
  latency: number | null;   // ms, median idle round trip
  jitter: number | null;    // ms, mean change between back-to-back round trips
  loaded: number | null;    // ms, median round trip while downloading (shows bufferbloat)
  down: number | null;      // Mbps
  up: number | null;        // Mbps
  bytes: number;            // test data used, both ways
  pings: number[];
  downSamples: number[];
  upSamples: number[];
};

// ---------- pure maths ----------
export const median = (a: number[]) => {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
export const percentile = (a: number[], p: number) => {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const i = (s.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
  return s[lo] + (s[hi] - s[lo]) * (i - lo);
};
// Jitter as most speed tests report it: the average size of the change between one round trip and the next.
export const jitter = (a: number[]) => {
  if (a.length < 2) return NaN;
  let t = 0;
  for (let i = 1; i < a.length; i++) t += Math.abs(a[i] - a[i - 1]);
  return t / (a.length - 1);
};
export const mbps = (bytes: number, ms: number) => (ms > 0 ? (bytes * 8) / (ms * 1000) : NaN);

// What the connection is good enough for. Thresholds are common guidance from streaming and video-call
// services (rounded): Netflix HD 5 Mbps, 4K 15 Mbps; Zoom HD group calls about 3.8 down / 3.0 up;
// online games want a steady round trip under about 60 ms.
export type Use = { id: string; label: string; ok: 'good' | 'warn' | 'bad'; why: string };
export const uses = (r: Pick<Result, 'down' | 'up' | 'latency' | 'jitter' | 'loaded'>): Use[] => {
  const d = r.down ?? 0, u = r.up ?? 0, l = r.latency ?? 999, j = r.jitter ?? 999, L = r.loaded ?? l;
  const lvl = (good: boolean, ok: boolean) => (good ? 'good' : ok ? 'warn' : 'bad') as Use['ok'];
  return [
    { id: 'web', label: 'Web pages and email', ok: lvl(d >= 5 && l < 150, d >= 1), why: 'Needs about 1 Mbps; 5+ feels quick.' },
    { id: 'hd', label: 'HD video (1080p)', ok: lvl(d >= 8, d >= 5), why: 'About 5 Mbps per stream.' },
    { id: 'uhd', label: '4K video', ok: lvl(d >= 25, d >= 15), why: 'About 15 to 25 Mbps per stream.' },
    { id: 'call', label: 'Video calls', ok: lvl(d >= 4 && u >= 3 && l < 100 && j < 30, d >= 1.5 && u >= 1 && l < 250), why: 'About 3 Mbps each way and a steady line.' },
    { id: 'game', label: 'Online games', ok: lvl(l < 60 && j < 15 && L < 150, l < 120 && j < 40), why: 'Round trip under 60 ms, little jitter.' },
    { id: 'upload', label: 'Uploading big files', ok: lvl(u >= 20, u >= 5), why: 'A 1 GB file takes about 7 minutes at 20 Mbps.' },
  ];
};
// One plain word for a measured value.
export const rateLatency = (ms: number | null) => (ms == null ? '' : ms < 30 ? 'Excellent' : ms < 60 ? 'Good' : ms < 120 ? 'Fair' : 'Slow');
export const rateDown = (m: number | null) => (m == null ? '' : m >= 100 ? 'Very fast' : m >= 25 ? 'Fast' : m >= 8 ? 'OK' : m >= 2 ? 'Slow' : 'Very slow');
// Bufferbloat: how much the round trip grows when the line is busy.
export const bloat = (idle: number | null, loaded: number | null) => {
  if (idle == null || loaded == null) return '';
  const g = loaded - idle;
  return g < 30 ? 'Low' : g < 100 ? 'Some' : 'High';
};
// A single 0-100 score for comparing spots: download, upload, round trip and jitter, weighted.
export const spotScore = (r: Pick<Result, 'down' | 'up' | 'latency' | 'jitter'>) => {
  const lg = (x: number, lo: number, hi: number) => Math.max(0, Math.min(1, (Math.log10(Math.max(x, 1e-3)) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))));
  const d = lg(r.down ?? 0, 0.5, 300), u = lg(r.up ?? 0, 0.2, 100);
  const l = 1 - Math.max(0, Math.min(1, ((r.latency ?? 500) - 10) / 290));
  const j = 1 - Math.max(0, Math.min(1, (r.jitter ?? 100) / 60));
  return Math.round(100 * (0.45 * d + 0.2 * u + 0.25 * l + 0.1 * j));
};
export const fmtMbps = (m: number | null) => (m == null || !isFinite(m) ? '–' : m >= 100 ? m.toFixed(0) : m >= 10 ? m.toFixed(1) : m.toFixed(2));
export const fmtMs = (m: number | null) => (m == null || !isFinite(m) ? '–' : m.toFixed(m < 10 ? 1 : 0));
export const fmtBytes = (b: number) => (b >= 1e9 ? (b / 1e9).toFixed(2) + ' GB' : b >= 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.round(b / 1e3) + ' kB');

// ---------- browser side ----------
const rnd = () => Math.random().toString(36).slice(2);
const now = () => performance.now();

// Time of one round trip: a request for zero bytes. Uses Resource Timing when the server allows it,
// minus the server's own processing time (Server-Timing), so it is close to the network round trip.
async function oneRtt(signal?: AbortSignal): Promise<number> {
  const url = `${SPEED_HOST}/__down?bytes=0&r=${rnd()}`;
  const t0 = now();
  const res = await fetch(url, { cache: 'no-store', signal });
  await res.arrayBuffer();
  const wall = now() - t0;
  const e = performance.getEntriesByName(url).pop() as PerformanceResourceTiming | undefined;
  if (e && e.responseStart > 0 && e.requestStart > 0) {
    let srv = 0;
    const st = (e as any).serverTiming as { name: string; duration: number }[] | undefined;
    if (st) for (const s of st) if (/request|duration/i.test(s.name)) srv = s.duration;
    const v = e.responseStart - e.requestStart - srv;
    if (v > 0) return v;
  }
  return wall;
}

export async function measureLatency(n: number, onPing?: (ms: number, i: number) => void, signal?: AbortSignal) {
  const out: number[] = [];
  // The first request opens the connection (DNS, TLS); leave it out.
  await oneRtt(signal).catch(() => 0);
  for (let i = 0; i < n; i++) {
    const v = await oneRtt(signal);
    out.push(v); onPing?.(v, i);
  }
  return out;
}

async function oneDown(bytes: number, onBytes?: (b: number, ms: number) => void, signal?: AbortSignal) {
  const res = await fetch(`${SPEED_HOST}/__down?bytes=${bytes}&r=${rnd()}`, { cache: 'no-store', signal });
  if (!res.ok || !res.body) throw new Error('The test server did not answer.');
  const t0 = now();   // headers in: time from here on is the transfer itself
  const rd = res.body.getReader();
  let got = 0;
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    got += value.byteLength; onBytes?.(got, now() - t0);
  }
  return { bytes: got, ms: now() - t0 };
}

async function oneUp(bytes: number, rtt: number, signal?: AbortSignal) {
  const body = new Uint8Array(bytes);
  // Random-ish filler so nothing on the way can compress it. crypto.getRandomValues takes at most 64 kB at a time.
  for (let i = 0; i < bytes; i += 65536) crypto.getRandomValues(body.subarray(i, Math.min(bytes, i + 65536)));
  const t0 = now();
  const res = await fetch(`${SPEED_HOST}/__up?r=${rnd()}`, { method: 'POST', body, cache: 'no-store', signal, headers: { 'content-type': 'application/octet-stream' } });
  await res.arrayBuffer();
  if (!res.ok) throw new Error('The test server did not take the upload.');
  // The wall time includes one round trip for the answer; take it off.
  return { bytes, ms: Math.max(1, now() - t0 - rtt) };
}

export type Plan = { pings: number; down: number[]; up: number[]; budgetMs: number };
// Light: about 10 MB down and 3 MB up on a fast line. Full: up to about 150 MB down, 50 MB up on a very fast line.
// Each list grows in size; a size is skipped once the time budget for that direction is used up,
// and bigger sizes are only tried while each transfer is still shorter than about a second.
export const PLANS: Record<'light' | 'full' | 'spot', Plan> = {
  spot: { pings: 10, down: [100e3, 1e6, 1e6, 5e6], up: [100e3, 500e3, 1e6], budgetMs: 4000 },
  light: { pings: 20, down: [100e3, 100e3, 1e6, 1e6, 5e6, 5e6], up: [100e3, 500e3, 1e6, 1e6], budgetMs: 6000 },
  full: { pings: 20, down: [100e3, 1e6, 1e6, 10e6, 10e6, 25e6, 25e6, 25e6, 50e6], up: [100e3, 1e6, 1e6, 5e6, 10e6, 10e6, 25e6], budgetMs: 12000 },
};

export type Progress = { phase: Phase; mbps?: number; ms?: number; frac?: number };

export async function runTest(plan: Plan, onProgress: (p: Progress) => void, signal?: AbortSignal): Promise<Result> {
  const r: Result = { latency: null, jitter: null, loaded: null, down: null, up: null, bytes: 0, pings: [], downSamples: [], upSamples: [] };
  onProgress({ phase: 'latency', frac: 0 });
  r.pings = await measureLatency(plan.pings, (ms, i) => onProgress({ phase: 'latency', ms, frac: (i + 1) / plan.pings }), signal);
  r.latency = median(r.pings); r.jitter = jitter(r.pings);

  // Download, with round trips measured alongside to see how much a busy line slows them (bufferbloat).
  const loaded: number[] = [];
  let busy = true;
  const loadedLoop = (async () => {
    while (busy && !signal?.aborted) {
      await new Promise((ok) => setTimeout(ok, 350));
      if (!busy) break;
      try { const v = await oneRtt(signal); if (busy) loaded.push(v); } catch { break; }
    }
  })();
  let spent = 0;
  try {
    for (let i = 0; i < plan.down.length; i++) {
      const size = plan.down[i];
      if (spent > plan.budgetMs) break;
      const { bytes, ms } = await oneDown(size, (b, t) => { if (t > 50) onProgress({ phase: 'download', mbps: mbps(b, t), frac: Math.min(1, (spent + t) / plan.budgetMs) }); }, signal);
      spent += ms; r.bytes += bytes;
      if (size >= 1e6 || plan.down.length <= 2) r.downSamples.push(mbps(bytes, ms));
      onProgress({ phase: 'download', mbps: mbps(bytes, ms), frac: Math.min(1, spent / plan.budgetMs) });
      // Fast line: jump to the bigger sizes; slow line: stop before a big file eats the budget.
      const next = plan.down[i + 1];
      if (next && (ms / size) * next > plan.budgetMs * 0.6) break;
    }
  } finally { busy = false; }
  await loadedLoop;
  r.down = r.downSamples.length ? percentile(r.downSamples, 0.9) : null;
  r.loaded = loaded.length ? median(loaded) : null;

  spent = 0;
  const rtt = r.latency ?? 0;
  for (let i = 0; i < plan.up.length; i++) {
    const size = plan.up[i];
    if (spent > plan.budgetMs) break;
    onProgress({ phase: 'upload', frac: Math.min(1, spent / plan.budgetMs) });
    const { bytes, ms } = await oneUp(size, rtt, signal);
    spent += ms; r.bytes += bytes;
    if (size >= 500e3 || plan.up.length <= 2) r.upSamples.push(mbps(bytes, ms));
    onProgress({ phase: 'upload', mbps: mbps(bytes, ms), frac: Math.min(1, spent / plan.budgetMs) });
    const next = plan.up[i + 1];
    if (next && (ms / size) * next > plan.budgetMs * 0.6) break;
  }
  r.up = r.upSamples.length ? percentile(r.upSamples, 0.9) : null;
  onProgress({ phase: 'done', frac: 1 });
  return r;
}

// What the browser itself says about the link (Chrome and Edge on Android and computers; not Safari or Firefox).
export const linkInfo = () => {
  const c = (navigator as any).connection;
  if (!c) return null;
  return { type: c.type as string | undefined, effectiveType: c.effectiveType as string | undefined, downlink: c.downlink as number | undefined, rtt: c.rtt as number | undefined, saveData: !!c.saveData };
};

// Where your connection meets Cloudflare: read from this site's own Cloudflare trace page (same site, nothing extra sent).
export async function traceInfo(): Promise<Record<string, string> | null> {
  try {
    const res = await fetch('/cdn-cgi/trace', { cache: 'no-store' });
    if (!res.ok) return null;
    const t = await res.text();
    const o: Record<string, string> = {};
    for (const line of t.split('\n')) { const i = line.indexOf('='); if (i > 0) o[line.slice(0, i)] = line.slice(i + 1).trim(); }
    return o.ip ? o : null;
  } catch { return null; }
}
// The network (ISP) name, from the speed server's own info page. Optional: if it is not available the page leaves it out.
export async function ispInfo(): Promise<{ isp?: string; city?: string; colo?: string } | null> {
  try {
    const res = await fetch(`${SPEED_HOST}/meta`, { cache: 'no-store' });
    if (!res.ok) return null;
    const j = await res.json();
    return { isp: j.asOrganization, city: j.city, colo: j.colo };
  } catch { return null; }
}
