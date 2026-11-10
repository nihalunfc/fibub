// fibub's only server code: public view and use counters. Everything else on the site is plain
// static files, served by Cloudflare straight from dist/ without running this script.
//
// What it stores: counts and nothing else. Page views for the whole site, page views for each page
// of the site (by its address, such as /money/budget-calculator/), and uses for each tool. Each is
// kept as a total per day (UTC) and as an all-time total. Weeks, months and years are added up from
// the days. No IP address, cookie, visitor ID, time of day, browser or anything else about the
// visitor is read or kept, so a count can never be traced back to anyone, and nobody can be
// recognised when they come back.
//
// Routes (the only ones that reach this script, see run_worker_first in wrangler.jsonc):
//   POST /api/hit   {"p": "<page address>", "t": "<tool id>"?}  one page view; returns the counts to show
//   POST /api/use   {"t": "<tool id>"}                          one use of a tool
//   GET  /api/top                                               the 10 most used tools with their views and uses
//   GET  /api/counts                                            all-time totals for every page and tool
//   GET  /api/days?from=YYYY-MM-DD&to=YYYY-MM-DD                daily totals (up to 62 days per call);
//        a GitHub Action copies these into the public repo every day (data/views/)
//
// The counts live in one Durable Object with its own small SQLite database. Cloudflare creates it on
// the first deploy from the migration in wrangler.jsonc, so there is nothing to set up by hand.
// New counts are held in memory for up to 10 seconds and then written in one go, which keeps the
// database writes (the part Cloudflare meters) low however busy the site gets.
import { DurableObject } from 'cloudflare:workers';

interface Env {
  ASSETS: Fetcher;
  COUNTER: DurableObjectNamespace<Counter>;
}

type Hit = { site: number; v?: number };
type Totals = { site: number; pages: Record<string, number>; uses: Record<string, number> };
type DayRows = Record<string, Totals>;

const FLUSH_MS = 10_000;
const today = () => new Date().toISOString().slice(0, 10);

export class Counter extends DurableObject<Env> {
  sql: SqlStorage;
  // Counts not yet written: "<day>\t<key>" -> n, and the same added up per key for the all-time total.
  pendingDays = new Map<string, number>();
  pendingAll = new Map<string, number>();
  flushSoon = false;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    // Keys: "site", "p:<page address>", "u:<tool id>" (and "v:<tool id>" from before pages were counted).
    this.sql.exec('CREATE TABLE IF NOT EXISTS counts (k TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)');
    this.sql.exec('CREATE TABLE IF NOT EXISTS days (d TEXT NOT NULL, k TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (d, k)) WITHOUT ROWID');
    this.sql.exec('CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)');
  }

  private add(k: string) {
    const dk = `${today()}\t${k}`;
    this.pendingDays.set(dk, (this.pendingDays.get(dk) ?? 0) + 1);
    this.pendingAll.set(k, (this.pendingAll.get(k) ?? 0) + 1);
    if (this.pendingDays.size > 2000) this.flush();
    else if (!this.flushSoon) { this.flushSoon = true; void this.ctx.storage.setAlarm(Date.now() + FLUSH_MS); }
  }
  private total(k: string): number {
    const stored = this.sql.exec<{ n: number }>('SELECT n FROM counts WHERE k = ?', k).toArray()[0]?.n ?? 0;
    return stored + (this.pendingAll.get(k) ?? 0);
  }
  private flush() {
    if (!this.pendingDays.size) return;
    const days = this.pendingDays, all = this.pendingAll;
    this.pendingDays = new Map(); this.pendingAll = new Map();
    this.ctx.storage.transactionSync(() => {
      for (const [dk, n] of days) {
        const [d, k] = dk.split('\t');
        this.sql.exec('INSERT INTO days (d, k, n) VALUES (?, ?, ?) ON CONFLICT(d, k) DO UPDATE SET n = n + excluded.n', d, k, n);
      }
      for (const [k, n] of all) this.sql.exec('INSERT INTO counts (k, n) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET n = n + excluded.n', k, n);
    });
  }
  async alarm() {
    this.flushSoon = false;
    this.flush();
  }

  // Before pages were counted, tool pages were counted by tool id ("v:<id>"). Copy those all-time
  // totals onto the tool page's address, once. The old rows stay, so a preview build that shares
  // this storage cannot blank the counts shown by the live site before the change is merged.
  async migrate(toolPaths: Record<string, string>) {
    if (this.sql.exec('SELECT 1 FROM meta WHERE k = ?', 'pages-v2').toArray().length) return;
    this.ctx.storage.transactionSync(() => {
      for (const { k, n } of this.sql.exec<{ k: string; n: number }>("SELECT k, n FROM counts WHERE k LIKE 'v:%'").toArray()) {
        const path = toolPaths[k.slice(2)];
        if (!path) continue;
        this.sql.exec('INSERT INTO counts (k, n) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET n = n + excluded.n', `p:${path}`, n);
      }
      this.sql.exec('INSERT INTO meta (k, v) VALUES (?, ?)', 'pages-v2', today());
    });
  }

  async hit(path: string | null): Promise<Hit> {
    this.add('site');
    if (path) this.add(`p:${path}`);
    return path ? { site: this.total('site'), v: this.total(`p:${path}`) } : { site: this.total('site') };
  }
  async use(tool: string): Promise<number> {
    this.add(`u:${tool}`);
    return this.total(`u:${tool}`);
  }

  private static put(t: Totals, k: string, n: number) {
    if (k === 'site') t.site = n;
    else if (k.startsWith('p:')) t.pages[k.slice(2)] = n;
    else if (k.startsWith('u:')) t.uses[k.slice(2)] = n;
  }
  async totals(): Promise<Totals> {
    this.flush();
    const out: Totals = { site: 0, pages: {}, uses: {} };
    for (const { k, n } of this.sql.exec<{ k: string; n: number }>('SELECT k, n FROM counts ORDER BY k')) Counter.put(out, k, n);
    return out;
  }
  // The most used tools: ranked by uses, then by page views. Counts only, from the running totals.
  async top(toolPaths: Map<string, string>, n: number): Promise<{ t: string; v: number; u: number }[]> {
    const { pages, uses } = await this.totals();
    const rows: { t: string; v: number; u: number }[] = [];
    for (const [t, path] of toolPaths) rows.push({ t, v: pages[path] ?? 0, u: uses[t] ?? 0 });
    return rows.filter((r) => r.u > 0 || r.v > 0).sort((a, b) => b.u - a.u || b.v - a.v || a.t.localeCompare(b.t)).slice(0, n);
  }
  async days(from: string, to: string): Promise<DayRows> {
    this.flush();
    const out: DayRows = {};
    for (const { d, k, n } of this.sql.exec<{ d: string; k: string; n: number }>('SELECT d, k, n FROM days WHERE d >= ? AND d <= ? ORDER BY d, k', from, to)) {
      Counter.put((out[d] ??= { site: 0, pages: {}, uses: {} }), k, n);
    }
    return out;
  }
}

// Only real pages and tools are counted, so nobody can fill the database with made-up names. The
// lists come from the site's own /pages.json (written by scripts/list-pages.mjs at build time) and
// are kept for a few minutes per Worker instance.
type Known = { pages: Set<string>; tools: Map<string, string>; at: number };
let known: Known | null = null;
let migrated = false;
async function site(env: Env, url: URL, counter: DurableObjectStub<Counter>): Promise<Known> {
  if (known && Date.now() - known.at < 5 * 60_000) return known;
  try {
    const res = await env.ASSETS.fetch(new URL('/pages.json', url));
    const data = (await res.json()) as { pages: string[]; tools: Record<string, string> };
    known = { pages: new Set(data.pages), tools: new Map(Object.entries(data.tools)), at: Date.now() };
    if (!migrated) { await counter.migrate(data.tools); migrated = true; }
  } catch {
    known = { pages: known?.pages ?? new Set(), tools: known?.tools ?? new Map(), at: Date.now() };
  }
  return known;
}

const json = (body: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache, 'Access-Control-Allow-Origin': '*' },
  });
const isDay = (s: string | null): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

async function readBody(req: Request): Promise<{ p?: unknown; t?: unknown }> {
  try { return ((await req.json()) as { p?: unknown; t?: unknown }) ?? {}; } catch { return {}; }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req);
    // Counts come only from fibub's own pages, never from other sites.
    const origin = req.headers.get('Origin');
    if (req.method === 'POST' && origin && origin !== url.origin) return json({ error: 'forbidden' }, 403);
    const counter = env.COUNTER.get(env.COUNTER.idFromName('fibub'));

    if (url.pathname === '/api/hit' && req.method === 'POST') {
      const { p, t } = await readBody(req);
      const k = await site(env, url, counter);
      // Pages loaded before page counting send only the tool id; their address comes from the tool list.
      let path = typeof p === 'string' && p.length <= 200 && k.pages.has(p) ? p : null;
      if (!path && typeof t === 'string') path = k.tools.get(t) ?? null;
      return json(await counter.hit(path));
    }
    if (url.pathname === '/api/use' && req.method === 'POST') {
      const { t } = await readBody(req);
      const k = await site(env, url, counter);
      return typeof t === 'string' && k.tools.has(t) ? json({ u: await counter.use(t) }) : json({ error: 'unknown tool' }, 400);
    }
    if (url.pathname === '/api/counts' && req.method === 'GET') {
      return json(await counter.totals(), 200, 'public, max-age=60');
    }
    if (url.pathname === '/api/top' && req.method === 'GET') {
      const k = await site(env, url, counter);
      return json({ top: await counter.top(k.tools, 10) }, 200, 'public, max-age=300');
    }
    if (url.pathname === '/api/days' && req.method === 'GET') {
      const from = url.searchParams.get('from'), to = url.searchParams.get('to');
      if (!isDay(from) || !isDay(to) || from > to || Date.parse(to) - Date.parse(from) > 61 * 86_400_000) {
        return json({ error: 'give from and to as YYYY-MM-DD, at most 62 days apart' }, 400);
      }
      return json(await counter.days(from, to), 200, 'public, max-age=300');
    }
    return json({ error: 'not found' }, 404);
  },
} satisfies ExportedHandler<Env>;
