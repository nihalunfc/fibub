// Gantt chart and critical path: tasks with a start and a duration (in days, weeks or months), finish-to-start
// dependencies with lags, milestones and work packages. Forward and backward passes give early and late
// starts, float and the critical path. Also lays the chart out as shapes for SVG or a canvas. No DOM.

export type Unit = 'day' | 'week' | 'month';
export type Dep = { id: string; lag: number };
export type Task = { id: string; name: string; wp: string; start: number | null; dur: number; deps: Dep[] };
export type Row = Task & { es: number; ef: number; ls: number; lf: number; float: number; free: number; critical: boolean; milestone: boolean };
export type Schedule = { rows: Row[]; end: number; order: string[]; path: string[] };

const EPS = 1e-9;

// ---------- dates ----------
const parseISO = (s: string) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim()); if (!m) return null; const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); return d.getUTCMonth() === +m[2] - 1 ? d : null; };
export const isDate = (s: string) => parseISO(s) != null;
/** Period number (1 = the period holding the project start) of a date. */
export function periodOf(date: string, start: string, unit: Unit): number | null {
  const d = parseISO(date), s = parseISO(start);
  if (!d || !s) return null;
  if (unit === 'month') return (d.getUTCFullYear() - s.getUTCFullYear()) * 12 + d.getUTCMonth() - s.getUTCMonth() + 1;
  const days = Math.round((d.getTime() - s.getTime()) / 86400000);
  return unit === 'day' ? days + 1 : Math.floor(days / 7) + 1;
}
/** The date at the start of a period offset t (0 = project start). */
export function dateAt(t: number, start: string, unit: Unit): Date | null {
  const s = parseISO(start); if (!s) return null;
  if (unit === 'month') return new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth() + Math.floor(t), s.getUTCDate()));
  return new Date(s.getTime() + Math.round(t * (unit === 'week' ? 7 : 1)) * 86400000);
}
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export function periodLabel(i: number, unit: Unit, start = ''): string {
  const d = start ? dateAt(i, start, unit) : null;
  if (d) return unit === 'month' ? `${MON[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}` : `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
  return `${unit === 'month' ? 'M' : unit === 'week' ? 'W' : 'D'}${i + 1}`;
}

// ---------- parsing ----------
const cells = (l: string) => {
  if (l.includes('\t')) return l.split('\t').map((c) => c.trim());
  const out: string[] = []; let cur = '', qd = false;
  for (let i = 0; i < l.length; i++) { const ch = l[i]; if (qd) { if (ch === '"' && l[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') qd = false; else cur += ch; } else if (ch === '"') qd = true; else if (ch === ',') { out.push(cur.trim()); cur = ''; } else cur += ch; }
  out.push(cur.trim()); return out;
};
/** Lines of: ID, task, work package, start, duration, depends on [, end]. Start and end are period numbers or dates
 * (YYYY-MM-DD, when a project start date is set). A blank start means "as soon as the tasks before it allow". A
 * duration of 0 is a milestone. Depends on: IDs separated by spaces or semicolons, each with an optional lag
 * (B+2, C-1). */
export function parseTasks(text: string, unit: Unit, startDate = ''): { tasks: Task[]; errors: string[] } {
  const tasks: Task[] = [], errors: string[] = [], seen = new Set<string>();
  const pos = (s: string, what: string, line: number, name: string): number | null | undefined => {
    if (s === '') return null;
    if (isDate(s)) { if (!startDate) { errors.push(`Line ${line} (${name}): ${what} is a date; set the project start date first, or use period numbers.`); return undefined; } const p = periodOf(s, startDate, unit)!; if (p < 1) { errors.push(`Line ${line} (${name}): ${what} ${s} is before the project start.`); return undefined; } return p; }
    const v = Number(s);
    if (!(Number.isFinite(v) && v >= 1)) { errors.push(`Line ${line} (${name}): ${what} "${s}" should be a period number from 1, or a date like 2027-01-15.`); return undefined; }
    return v;
  };
  text.split(/\r?\n/).forEach((raw, k) => {
    if (!raw.trim() || raw.trim().startsWith('#')) return;
    const c = cells(raw), line = k + 1;
    if (k === 0 && /^(id|#|no\.?|task id)$/i.test(c[0]) ) return;
    const id = c[0], name = c[1] || c[0];
    if (!id) { errors.push(`Line ${line}: give the task an ID first (such as A, T1 or 1.2).`); return; }
    if (/[\s;+]/.test(id) || /-\d+$/.test(id)) { errors.push(`Line ${line}: the ID "${id}" can't hold spaces, semicolons, + or end in a minus and a number (those are used for lags).`); return; }
    if (seen.has(id)) { errors.push(`Line ${line}: the ID "${id}" is used twice.`); return; }
    seen.add(id);
    const start = pos(c[3] ?? '', 'the start', line, name);
    const end = pos(c[6] ?? '', 'the end', line, name);
    if (start === undefined || end === undefined) return;
    let dur: number;
    if ((c[4] ?? '') !== '') {
      dur = Number(c[4]);
      if (!(Number.isFinite(dur) && dur >= 0 && dur <= 10000)) { errors.push(`Line ${line} (${name}): the duration "${c[4]}" should be a number of periods, 0 for a milestone.`); return; }
    } else if (end != null && start != null) {
      dur = end - start + 1;
      if (dur < 1) { errors.push(`Line ${line} (${name}): the end is before the start.`); return; }
    } else { errors.push(`Line ${line} (${name}): give a duration (0 for a milestone), or a start and an end.`); return; }
    const deps: Dep[] = [];
    for (const d of (c[5] ?? '').split(/[\s;]+/).filter(Boolean)) {
      const m = /^(.+?)(?:([+-])(\d+(?:\.\d+)?))?$/.exec(d)!;
      deps.push({ id: m[1], lag: m[2] ? (m[2] === '-' ? -1 : 1) * Number(m[3]) : 0 });
    }
    tasks.push({ id, name, wp: c[2] ?? '', start, dur, deps });
  });
  for (const t of tasks) for (const d of t.deps) {
    if (d.id === t.id) errors.push(`${t.id} (${t.name}) depends on itself.`);
    else if (!seen.has(d.id)) errors.push(`${t.id} (${t.name}) depends on "${d.id}", which is not a task ID.`);
  }
  if (tasks.length > 500) errors.push('Up to 500 tasks, please.');
  return { tasks, errors };
}

// ---------- scheduling ----------
/** Forward and backward pass. Times are in periods from the project start (0); a task starting in period 3 has
 * es = 2. Returns the tasks in a loop if there is one. */
export function schedule(tasks: Task[]): Schedule | { cycle: string[] } {
  const by = new Map(tasks.map((t) => [t.id, t]));
  const succ = new Map<string, { id: string; lag: number }[]>(tasks.map((t) => [t.id, []]));
  const indeg = new Map(tasks.map((t) => [t.id, 0]));
  for (const t of tasks) for (const d of t.deps) if (by.has(d.id)) { succ.get(d.id)!.push({ id: t.id, lag: d.lag }); indeg.set(t.id, indeg.get(t.id)! + 1); }
  const order: string[] = [], queue = tasks.filter((t) => indeg.get(t.id) === 0).map((t) => t.id);
  while (queue.length) { const id = queue.shift()!; order.push(id); for (const s of succ.get(id)!) { indeg.set(s.id, indeg.get(s.id)! - 1); if (indeg.get(s.id) === 0) queue.push(s.id); } }
  if (order.length < tasks.length) return { cycle: tasks.filter((t) => indeg.get(t.id)! > 0).map((t) => t.id) };
  const es = new Map<string, number>(), ef = new Map<string, number>();
  for (const id of order) {
    const t = by.get(id)!;
    let s = t.start != null ? t.start - 1 : 0;
    for (const d of t.deps) if (by.has(d.id)) s = Math.max(s, ef.get(d.id)! + d.lag);
    es.set(id, s); ef.set(id, s + t.dur);
  }
  const end = Math.max(0, ...ef.values());
  const lf = new Map<string, number>(), ls = new Map<string, number>();
  for (const id of [...order].reverse()) {
    const t = by.get(id)!, ss = succ.get(id)!;
    const f = Math.min(end, ...ss.map((s) => ls.get(s.id)! - s.lag));
    lf.set(id, f); ls.set(id, f - t.dur);
  }
  const rows: Row[] = tasks.map((t) => {
    const ss = succ.get(t.id)!, e = ef.get(t.id)!;
    const free = Math.min(end, ...ss.map((s) => es.get(s.id)! - s.lag)) - e;
    const fl = ls.get(t.id)! - es.get(t.id)!;
    return { ...t, es: es.get(t.id)!, ef: e, ls: ls.get(t.id)!, lf: lf.get(t.id)!, float: Math.abs(fl) < EPS ? 0 : fl, free: Math.abs(free) < EPS ? 0 : free, critical: Math.abs(fl) < EPS, milestone: t.dur === 0 };
  });
  // One critical path: start from a critical task with nothing critical driving it, follow critical successors
  // whose start is set by this task's finish, prefer the longest.
  const R = new Map(rows.map((r) => [r.id, r]));
  const drives = (a: Row, s: { id: string; lag: number }) => { const b = R.get(s.id)!; return b.critical && Math.abs(b.es - (a.ef + s.lag)) < EPS; };
  const best = new Map<string, string[]>();
  for (const id of [...order].reverse()) {
    const r = R.get(id)!; if (!r.critical) continue;
    let tail: string[] = [];
    for (const s of succ.get(id)!) if (drives(r, s)) { const p = best.get(s.id) ?? []; if (p.length > tail.length) tail = p; }
    best.set(id, [id, ...tail]);
  }
  let path: string[] = [];
  for (const id of order) { const r = R.get(id)!; if (!r.critical) continue; const driven = r.deps.some((d) => R.get(d.id)?.critical && Math.abs(r.es - (R.get(d.id)!.ef + d.lag)) < EPS); if (!driven) { const p = best.get(id)!; const span = R.get(p[p.length - 1])!.ef - r.es; const cur = path.length ? R.get(path[path.length - 1])!.ef - R.get(path[0])!.es : -1; if (span > cur || (span === cur && p.length > path.length)) path = p; } }
  return { rows, end, order, path };
}

// ---------- CSV ----------
export function toCsv(s: Schedule, unit: Unit, startDate = ''): string[][] {
  const day = (d: Date) => iso(new Date(d.getTime() - 86400000));
  const head = ['ID', 'Task', 'Work package', 'Start', 'Duration', 'Depends on', 'End', 'First period', 'Last period', 'Early start', 'Early finish', 'Late start', 'Late finish', 'Total float', 'Free float', 'Critical'];
  if (startDate) head.push('Start date', 'Finish date');
  return [head, ...s.rows.map((r) => {
    const row = [r.id, r.name, r.wp, r.start != null ? String(r.start) : '', String(r.dur), r.deps.map((x) => x.id + (x.lag ? (x.lag > 0 ? '+' : '') + x.lag : '')).join(' '), '',
      String(r.milestone ? r.ef : r.es + 1), String(r.ef), String(r.es), String(r.ef), String(r.ls), String(r.lf), String(r.float), String(r.free), r.critical ? 'yes' : 'no'];
    if (startDate) row.push(r.milestone ? day(dateAt(r.ef, startDate, unit)!) : iso(dateAt(r.es, startDate, unit)!), day(dateAt(r.ef, startDate, unit)!));
    return row;
  })];
}

// ---------- chart layout ----------
export type Shape =
  | { k: 'rect'; x: number; y: number; w: number; h: number; fill: string; stroke?: string; rx?: number }
  | { k: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: string; width?: number; dash?: boolean }
  | { k: 'text'; x: number; y: number; text: string; fill: string; size: number; anchor?: 'start' | 'middle' | 'end'; bold?: boolean }
  | { k: 'diamond'; x: number; y: number; r: number; fill: string }
  | { k: 'path'; d: [number, number][]; stroke: string; width?: number; arrow?: boolean };
export type Colors = { bg: string; ink: string; muted: string; grid: string; bar: string; crit: string; wp: string; arrow: string };
export type LayoutOpts = { unit: Unit; startDate?: string; width: number; showDeps?: boolean; showFloat?: boolean; colors: Colors };

export function layout(s: Schedule, o: LayoutOpts): { w: number; h: number; shapes: Shape[] } {
  const C = o.colors, rowH = 26, top = 34, labelW = Math.min(240, Math.max(120, Math.round(o.width * 0.32)));
  // Rows: tasks grouped by work package (in order of first appearance), with a header row per named package.
  const wps: string[] = []; for (const r of s.rows) if (!wps.includes(r.wp)) wps.push(r.wp);
  const lines: ({ kind: 'wp'; wp: string } | { kind: 'task'; r: Row })[] = [];
  for (const wp of wps) { if (wp) lines.push({ kind: 'wp', wp }); for (const r of s.rows.filter((x) => x.wp === wp)) lines.push({ kind: 'task', r }); }
  const end = Math.max(1, Math.ceil(s.end));
  const pw = o.width - labelW - 12, px = pw / end, x0 = labelW;
  const h = top + lines.length * rowH + 12, shapes: Shape[] = [];
  shapes.push({ k: 'rect', x: 0, y: 0, w: o.width, h, fill: C.bg });
  // Time axis: a label every few periods so they don't overlap.
  const lab = periodLabel(0, o.unit, o.startDate), every = Math.max(1, Math.ceil(((lab.length * 7 + 8) / px)));
  for (let i = 0; i <= end; i++) {
    const x = x0 + i * px;
    if (i % every === 0 || i === end) shapes.push({ k: 'line', x1: x, y1: top - 6, x2: x, y2: h - 12, stroke: C.grid });
    if (i < end && i % every === 0) shapes.push({ k: 'text', x: x + 3, y: top - 12, text: periodLabel(i, o.unit, o.startDate), fill: C.muted, size: 11 });
  }
  const yOf = new Map<string, number>();
  const clip = (t: string, n: number) => (t.length > n ? t.slice(0, n - 1) + '…' : t);
  const chars = Math.floor((labelW - 10) / 6.6);
  lines.forEach((ln, i) => {
    const y = top + i * rowH;
    if (ln.kind === 'wp') {
      const rs = s.rows.filter((r) => r.wp === ln.wp), a = Math.min(...rs.map((r) => r.es)), b = Math.max(...rs.map((r) => r.ef));
      shapes.push({ k: 'text', x: 4, y: y + rowH / 2 + 4, text: clip(ln.wp, chars), fill: C.ink, size: 12, bold: true });
      if (b > a) {
        const xa = x0 + a * px, xb = x0 + b * px, yy = y + rowH / 2 - 3;
        shapes.push({ k: 'rect', x: xa, y: yy, w: xb - xa, h: 6, fill: C.wp });
        shapes.push({ k: 'path', d: [[xa, yy], [xa, yy + 11], [xa + 5, yy + 6]], stroke: C.wp }, { k: 'path', d: [[xb, yy], [xb, yy + 11], [xb - 5, yy + 6]], stroke: C.wp });
      }
      return;
    }
    const r = ln.r, cy = y + rowH / 2;
    yOf.set(r.id, cy);
    shapes.push({ k: 'text', x: ln.r.wp ? 12 : 4, y: cy + 4, text: clip(`${r.id}  ${r.name}`, chars - (r.wp ? 1 : 0)), fill: C.ink, size: 12 });
    const col = r.critical ? C.crit : C.bar;
    if (r.milestone) shapes.push({ k: 'diamond', x: x0 + r.es * px, y: cy, r: 7, fill: col });
    else {
      shapes.push({ k: 'rect', x: x0 + r.es * px, y: cy - 8, w: Math.max(2, r.dur * px), h: 16, fill: col, rx: 3 });
      if (o.showFloat && r.float > 0) shapes.push({ k: 'line', x1: x0 + r.ef * px, y1: cy, x2: x0 + (r.ef + r.float) * px, y2: cy, stroke: C.muted, dash: true, width: 1.5 });
    }
  });
  if (o.showDeps) {
    for (const r of s.rows) for (const d of r.deps) {
      const a = s.rows.find((x) => x.id === d.id); if (!a) continue;
      const xa = x0 + a.ef * px, ya = yOf.get(a.id)!, xb = x0 + r.es * px, yb = yOf.get(r.id)!;
      const xm = Math.max(xa + 6, Math.min(xb - 4, xa + 6));
      const pts: [number, number][] = xb - 4 >= xa + 6 ? [[xa, ya], [xm, ya], [xm, yb], [xb - (r.milestone ? 7 : 0), yb]] : [[xa, ya], [xa + 6, ya], [xa + 6, (ya + yb) / 2], [xb - 8, (ya + yb) / 2], [xb - 8, yb], [xb - (r.milestone ? 7 : 0), yb]];
      shapes.push({ k: 'path', d: pts, stroke: C.arrow, width: 1, arrow: true });
    }
  }
  return { w: o.width, h, shapes };
}

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function toSvg(l: { w: number; h: number; shapes: Shape[] }): string {
  const out = [`<svg xmlns="http://www.w3.org/2000/svg" width="${l.w}" height="${l.h}" viewBox="0 0 ${l.w} ${l.h}" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">`,
    '<defs><marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="context-stroke"/></marker></defs>'];
  const n = (x: number) => +x.toFixed(2);
  for (const s of l.shapes) {
    if (s.k === 'rect') out.push(`<rect x="${n(s.x)}" y="${n(s.y)}" width="${n(s.w)}" height="${n(s.h)}"${s.rx ? ` rx="${s.rx}"` : ''} fill="${s.fill}"${s.stroke ? ` stroke="${s.stroke}"` : ''}/>`);
    else if (s.k === 'line') out.push(`<line x1="${n(s.x1)}" y1="${n(s.y1)}" x2="${n(s.x2)}" y2="${n(s.y2)}" stroke="${s.stroke}" stroke-width="${s.width ?? 1}"${s.dash ? ' stroke-dasharray="4 3"' : ''}/>`);
    else if (s.k === 'text') out.push(`<text x="${n(s.x)}" y="${n(s.y)}" font-size="${s.size}" fill="${s.fill}"${s.anchor && s.anchor !== 'start' ? ` text-anchor="${s.anchor}"` : ''}${s.bold ? ' font-weight="700"' : ''}>${esc(s.text)}</text>`);
    else if (s.k === 'diamond') out.push(`<path d="M${n(s.x)},${n(s.y - s.r)} L${n(s.x + s.r)},${n(s.y)} L${n(s.x)},${n(s.y + s.r)} L${n(s.x - s.r)},${n(s.y)} z" fill="${s.fill}"/>`);
    else out.push(`<polyline points="${s.d.map(([x, y]) => `${n(x)},${n(y)}`).join(' ')}" fill="none" stroke="${s.stroke}" stroke-width="${s.width ?? 1.5}"${s.arrow ? ' marker-end="url(#ah)"' : ''}/>`);
  }
  out.push('</svg>');
  return out.join('\n');
}

type Ctx = { fillStyle: unknown; strokeStyle: unknown; lineWidth: number; font: string; textAlign: unknown; textBaseline: unknown; fillRect(x: number, y: number, w: number, h: number): void; beginPath(): void; moveTo(x: number, y: number): void; lineTo(x: number, y: number): void; closePath(): void; fill(): void; stroke(): void; fillText(t: string, x: number, y: number): void; setLineDash(d: number[]): void; roundRect?(x: number, y: number, w: number, h: number, r: number): void };
/** Draw the same shapes on a canvas. */
export function drawShapes(ctx: Ctx, l: { shapes: Shape[] }) {
  for (const s of l.shapes) {
    if (s.k === 'rect') { ctx.fillStyle = s.fill; if (s.rx && ctx.roundRect) { ctx.beginPath(); ctx.roundRect(s.x, s.y, s.w, s.h, s.rx); ctx.fill(); } else ctx.fillRect(s.x, s.y, s.w, s.h); }
    else if (s.k === 'line') { ctx.strokeStyle = s.stroke; ctx.lineWidth = s.width ?? 1; ctx.setLineDash(s.dash ? [4, 3] : []); ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke(); ctx.setLineDash([]); }
    else if (s.k === 'text') { ctx.fillStyle = s.fill; ctx.font = `${s.bold ? '700 ' : ''}${s.size}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`; ctx.textAlign = s.anchor ?? 'start'; ctx.textBaseline = 'alphabetic'; ctx.fillText(s.text, s.x, s.y); }
    else if (s.k === 'diamond') { ctx.fillStyle = s.fill; ctx.beginPath(); ctx.moveTo(s.x, s.y - s.r); ctx.lineTo(s.x + s.r, s.y); ctx.lineTo(s.x, s.y + s.r); ctx.lineTo(s.x - s.r, s.y); ctx.closePath(); ctx.fill(); }
    else {
      ctx.strokeStyle = s.stroke; ctx.lineWidth = s.width ?? 1.5; ctx.beginPath(); s.d.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      if (s.arrow && s.d.length > 1) { const [x2, y2] = s.d[s.d.length - 1], [x1, y1] = s.d[s.d.length - 2], a = Math.atan2(y2 - y1, x2 - x1); ctx.fillStyle = s.stroke; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 6 * Math.cos(a - 0.45), y2 - 6 * Math.sin(a - 0.45)); ctx.lineTo(x2 - 6 * Math.cos(a + 0.45), y2 - 6 * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill(); }
    }
  }
}

/** A made-up two-year project in months. */
export const EXAMPLE = `ID, Task, Work package, Start, Duration, Depends on
A, Ethics approval, WP1 Set-up, 1, 3,
B, Recruit and train staff, WP1 Set-up, 1, 4,
C, Build the survey tool, WP2 Data collection, , 3, B
D, Pilot study, WP2 Data collection, , 2, A C
M1, Pilot complete, WP2 Data collection, , 0, D
E, Main data collection, WP2 Data collection, , 8, M1
F, Clean and document data, WP3 Analysis, , 3, E-1
G, Analysis, WP3 Analysis, , 5, F
H, Write papers, WP4 Sharing, , 6, G-2
I, Share data in a repository, WP4 Sharing, , 2, F+2
M2, Final report, WP4 Sharing, , 0, H I`;
