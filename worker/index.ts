// fibub's only server code: public view and use counters. Everything else on the site is plain
// static files, served by Cloudflare straight from dist/ without running this script.
//
// What it stores: running totals and nothing else. One number for page views on the whole site, and
// for each tool one number for page views and one for uses. No IP address, cookie, visitor ID, time,
// browser or anything else about the visitor is read or kept, so a count can never be traced back to
// anyone, and nobody can be recognised when they come back.
//
// Routes (the only ones that reach this script, see run_worker_first in wrangler.jsonc):
//   POST /api/hit   {"t": "<tool id>"?}  one page view; returns the counts to show on that page
//   POST /api/use   {"t": "<tool id>"}   one use of a tool
//   GET  /api/counts                     every total, for the /stats/ page
//
// The totals live in one Durable Object with its own small SQLite database. Cloudflare creates it on
// the first deploy from the migration in wrangler.jsonc, so there is nothing to set up by hand.
import { DurableObject } from 'cloudflare:workers';

interface Env {
  ASSETS: Fetcher;
  COUNTER: DurableObjectNamespace<Counter>;
}

type Counts = { site: number; v?: number; u?: number };
type AllCounts = { site: number; tools: Record<string, { v: number; u: number }> };

export class Counter extends DurableObject<Env> {
  sql: SqlStorage;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec('CREATE TABLE IF NOT EXISTS counts (k TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)');
  }
  private bump(k: string): number {
    return this.sql.exec<{ n: number }>('INSERT INTO counts (k, n) VALUES (?, 1) ON CONFLICT(k) DO UPDATE SET n = n + 1 RETURNING n', k).one().n;
  }
  private get(k: string): number {
    return this.sql.exec<{ n: number }>('SELECT n FROM counts WHERE k = ?', k).toArray()[0]?.n ?? 0;
  }
  async hit(tool: string | null): Promise<Counts> {
    const site = this.bump('site');
    return tool ? { site, v: this.bump(`v:${tool}`), u: this.get(`u:${tool}`) } : { site };
  }
  async use(tool: string): Promise<number> {
    return this.bump(`u:${tool}`);
  }
  async all(): Promise<AllCounts> {
    const out: AllCounts = { site: 0, tools: {} };
    for (const { k, n } of this.sql.exec<{ k: string; n: number }>('SELECT k, n FROM counts')) {
      if (k === 'site') { out.site = n; continue; }
      const [kind, id] = [k.slice(0, 1), k.slice(2)];
      const row = (out.tools[id] ??= { v: 0, u: 0 });
      if (kind === 'v') row.v = n; else if (kind === 'u') row.u = n;
    }
    return out;
  }
}

// Only real tool ids are counted, so nobody can fill the database with made-up names. The list
// comes from the site's own /tools.json and is kept for a few minutes per Worker instance.
let known: { ids: Set<string>; at: number } | null = null;
async function toolIds(env: Env, url: URL): Promise<Set<string>> {
  if (known && Date.now() - known.at < 5 * 60_000) return known.ids;
  try {
    const res = await env.ASSETS.fetch(new URL('/tools.json', url));
    const rows = (await res.json()) as { id: string }[];
    known = { ids: new Set(rows.map((r) => r.id)), at: Date.now() };
  } catch {
    known = { ids: known?.ids ?? new Set(), at: Date.now() };
  }
  return known.ids;
}

const json = (body: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache } });

async function readTool(req: Request, env: Env, url: URL): Promise<string | null> {
  let t: unknown;
  try { t = ((await req.json()) as { t?: unknown })?.t; } catch { return null; }
  if (typeof t !== 'string' || t.length > 80) return null;
  return (await toolIds(env, url)).has(t) ? t : null;
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
      return json(await counter.hit(await readTool(req, env, url)));
    }
    if (url.pathname === '/api/use' && req.method === 'POST') {
      const t = await readTool(req, env, url);
      return t ? json({ u: await counter.use(t) }) : json({ error: 'unknown tool' }, 400);
    }
    if (url.pathname === '/api/counts' && req.method === 'GET') {
      return json(await counter.all(), 200, 'public, max-age=60');
    }
    return json({ error: 'not found' }, 404);
  },
} satisfies ExportedHandler<Env>;
