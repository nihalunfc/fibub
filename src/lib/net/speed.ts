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

// ---------- extras: household need, plan check, transfer time ----------
// Per-stream figures reuse the guidance above: HD video 5 Mbps, 4K 15 Mbps, HD video call about 3.8 Mbps down and 3.0 up,
// everyday browsing about 1 Mbps per busy device. A household rarely peaks all at once, so this is a worst case.
export const STREAM_MBPS = { hd: 5, uhd: 15, callDown: 3.8, callUp: 3.0, browse: 1 } as const;
export type Household = { hd: number; uhd: number; calls: number; browsing: number };
const cnt = (n: number) => (isFinite(n) && n > 0 ? Math.min(99, Math.floor(n)) : 0);
export const householdNeed = (h: Household) => {
  const hd = cnt(h.hd), uhd = cnt(h.uhd), calls = cnt(h.calls), browsing = cnt(h.browsing);
  return {
    down: hd * STREAM_MBPS.hd + uhd * STREAM_MBPS.uhd + calls * STREAM_MBPS.callDown + browsing * STREAM_MBPS.browse,
    up: calls * STREAM_MBPS.callUp,
  };
};
// How the measured speed compares with what a household needs at once.
export const householdVerdict = (need: { down: number; up: number }, down: number | null, up: number | null) => {
  if (down == null) return { ok: 'warn' as const, text: 'Run the test above to compare.' };
  if (need.down === 0 && need.up === 0) return { ok: 'warn' as const, text: 'Add at least one activity.' };
  const dOk = down >= need.down, uOk = need.up === 0 || (up ?? 0) >= need.up;
  if (dOk && uOk) return { ok: 'good' as const, text: `Enough: you measured ${fmtMbps(down)} Mbps down and need about ${fmtMbps(need.down)} Mbps if all of this runs at once.` };
  if (!dOk) return { ok: 'bad' as const, text: `Not quite: about ${fmtMbps(need.down)} Mbps needed down, you measured ${fmtMbps(down)} Mbps. Fewer streams at once, or a faster plan.` };
  return { ok: 'bad' as const, text: `Upload is the limit: calls need about ${fmtMbps(need.up)} Mbps up, you measured ${fmtMbps(up)} Mbps.` };
};
// Measured speed as a share of the speed the plan promises (0 or blank gives null, never NaN).
export const planShare = (measured: number | null, promised: number) =>
  measured == null || !isFinite(promised) || promised <= 0 ? null : Math.round((100 * measured) / promised);
export const planVerdict = (pct: number | null) =>
  pct == null ? '' : pct >= 90 ? 'About what you pay for.' : pct >= 70 ? 'A bit under. Wi-Fi, busy hours and the test itself can cost this much; try again on a cable.' : pct >= 50 ? 'Well under. Test on a cable at a quiet hour before you call your provider.' : 'Far under. Test on a cable a few times, then ask your provider.';
export const mbpsToMBps = (m: number) => m / 8;
// Time to move a file of `size` bytes at `rateMbps`; null when the rate or size is not usable.
export const transferSeconds = (bytes: number, rateMbps: number | null) =>
  rateMbps == null || !isFinite(rateMbps) || rateMbps <= 0 || !isFinite(bytes) || bytes <= 0 ? null : (bytes * 8) / (rateMbps * 1e6);
export const fmtDuration = (s: number | null) => {
  if (s == null || !isFinite(s)) return '–';
  if (s < 1) return 'under a second';
  if (s < 90) return Math.round(s) + ' seconds';
  const m = s / 60;
  if (m < 90) return Math.round(m) + ' minutes';
  const h = m / 60;
  return h < 48 ? (Math.round(h * 10) / 10) + ' hours' : Math.round(h / 24) + ' days';
};
export const FILE_UNITS: Record<string, number> = { MB: 1e6, GB: 1e9 };

// ---------- Wi-Fi spot helpers ----------
export type SpotLike = { down: number | null; up: number | null; lat: number | null; jit: number | null };
/** How one measured spot fares for one use from `uses()` ('web', 'hd', 'uhd', 'call', 'game', 'upload'). */
export const spotFit = (s: SpotLike, useId: string): Use['ok'] | null => {
  const u = uses({ down: s.down, up: s.up, latency: s.lat, jitter: s.jit, loaded: null }).find((x) => x.id === useId);
  return u ? u.ok : null;
};
export const FIT_WORD: Record<Use['ok'], string> = { good: 'Yes', warn: 'Mostly', bad: 'No' };
/** Plain next steps from the spread of scores. Scores are 0 to 100 (spotScore). Nothing is promised. */
export const spotTips = (scores: number[], names: string[]): string[] => {
  const tips: string[] = [];
  if (!scores.length) return tips;
  const min = Math.min(...scores), max = Math.max(...scores), worst = names[scores.indexOf(min)], best = names[scores.indexOf(max)];
  if (scores.length > 1 && max - min >= 30) tips.push(`${worst} is far behind ${best}. Try moving the router toward the middle of the home, up off the floor and away from metal and microwaves, then test ${worst} again.`);
  if (scores.length > 1 && max - min >= 30 && min < 40) tips.push(`If moving the router is not possible, a mesh system or a wired access point near ${worst} helps more than a plug-in range extender.`);
  if (max < 50) tips.push('Even the best spot scores low. Test the same spot by cable next to the router: if it is also slow, the line from your provider is the limit, not the Wi-Fi.');
  if (scores.length > 1 && max - min < 15 && min >= 65) tips.push('All spots are close and good. Your Wi-Fi is fine at home; if something still lags, look at the device or the app.');
  return tips;
};
