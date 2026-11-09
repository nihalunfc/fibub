// Image regions with transcriptions and notes, written and read as W3C Web Annotations (Web Annotation Data Model,
// W3C Recommendation 2017) and as CSV; plus a reader for local IIIF Presentation manifests (version 2 and 3).
// Coordinates are kept in image pixels; when a region belongs to a IIIF canvas of a different size they are scaled
// to the canvas on export and back on import. Plain TypeScript, no DOM.

export type Pt = [number, number];
export type Region = { id: string; image: string; shape: 'rect' | 'polygon'; points: Pt[]; transcription: string; note: string };
/** Where an image sits: its file name and pixel size, and the IIIF canvas it shows, if any. */
export type Target = { name: string; width: number; height: number; canvas?: { id: string; width: number; height: number } };

const r2 = (x: number) => Math.round(x * 100) / 100;
export function bbox(points: Pt[]): { x: number; y: number; w: number; h: number } {
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}
export const rectPoints = (x: number, y: number, w: number, h: number): Pt[] => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
/** Polygon area by the shoelace formula (pixels²). */
export const area = (p: Pt[]) => Math.abs(p.reduce((s, [x, y], i) => { const [u, v] = p[(i + 1) % p.length]; return s + x * v - u * y; }, 0)) / 2;

const scaleOf = (t?: Target) => (t?.canvas && t.width && t.height ? [t.canvas.width / t.width, t.canvas.height / t.height] : [1, 1]);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** One AnnotationPage holding a W3C Web Annotation per region. */
export function toWebAnnotation(regions: Region[], targets: Target[], pageId = 'urn:fibub:annotations'): object {
  const byName = new Map(targets.map((t) => [t.name, t]));
  return {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id: pageId, type: 'AnnotationPage',
    items: regions.map((r) => {
      const t = byName.get(r.image), [sx, sy] = scaleOf(t);
      const pts = r.points.map(([x, y]) => [r2(x * sx), r2(y * sy)] as Pt);
      const body: object[] = [];
      if (r.transcription) body.push({ type: 'TextualBody', purpose: 'transcribing', value: r.transcription, format: 'text/plain' });
      if (r.note) body.push({ type: 'TextualBody', purpose: 'commenting', value: r.note, format: 'text/plain' });
      let selector: object;
      if (r.shape === 'rect') { const b = bbox(pts); selector = { type: 'FragmentSelector', conformsTo: 'http://www.w3.org/TR/media-frags/', value: `xywh=${r2(b.x)},${r2(b.y)},${r2(b.w)},${r2(b.h)}` }; }
      else selector = { type: 'SvgSelector', value: `<svg xmlns="http://www.w3.org/2000/svg"><polygon points="${esc(pts.map((p) => p.join(',')).join(' '))}"/></svg>` };
      return {
        id: `${pageId}/${r.id}`, type: 'Annotation', motivation: r.transcription ? 'transcribing' : 'commenting',
        body: body.length === 1 ? body[0] : body,
        target: { source: t?.canvas ? t.canvas.id : r.image, ...(t?.canvas ? {} : { type: 'Image' }), selector },
      };
    }),
  };
}

function svgPoints(svg: string): { shape: Region['shape']; points: Pt[] } | null {
  const nums = (s: string) => (s.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number);
  const pair = (a: number[]) => { const o: Pt[] = []; for (let i = 0; i + 1 < a.length; i += 2) o.push([a[i], a[i + 1]]); return o; };
  let m = /<(?:\w+:)?(polygon|polyline)\b[^>]*\bpoints\s*=\s*["']([^"']*)["']/i.exec(svg);
  if (m) return { shape: 'polygon', points: pair(nums(m[2])) };
  m = /<(?:\w+:)?rect\b([^>]*)>/i.exec(svg);
  if (m) {
    const at = (k: string) => Number((new RegExp(`\\b${k}\\s*=\\s*["']([^"']*)["']`, 'i').exec(m![1]) ?? [])[1] ?? 0);
    return { shape: 'rect', points: rectPoints(at('x'), at('y'), at('width'), at('height')) };
  }
  m = /<(?:\w+:)?path\b[^>]*\bd\s*=\s*["']([^"']*)["']/i.exec(svg);
  if (m && /^[\sMLZ\d.,eE+-]*$/i.test(m[1]) && !/[a-z]/.test(m[1].replace(/[eE]/g, ''))) return { shape: 'polygon', points: pair(nums(m[1])) };
  return null;
}

/**
 * Regions from Web Annotation JSON: an AnnotationPage, an AnnotationCollection (with `first`), a single Annotation,
 * or a plain array. Rectangles come from FragmentSelector xywh= (pixels) or "#xywh=" on the target; polygons from
 * an SvgSelector with a polygon, polyline, rect or straight-line path. Unreadable items are counted, not fatal.
 */
export function fromWebAnnotation(json: unknown, targets: Target[]): { regions: Region[]; skipped: number } {
  const j = json as Record<string, any>;
  const items: any[] = Array.isArray(j) ? j : j?.type === 'Annotation' ? [j] : Array.isArray(j?.items) ? j.items : Array.isArray(j?.first?.items) ? j.first.items : Array.isArray(j?.resources) ? j.resources : [];
  const regions: Region[] = []; let skipped = 0;
  const byCanvas = new Map(targets.filter((t) => t.canvas).map((t) => [t.canvas!.id, t]));
  const byName = new Map(targets.map((t) => [t.name, t]));
  items.forEach((a, k) => {
    try {
      const tg = Array.isArray(a.target) ? a.target[0] : a.target ?? a.on;
      let source = '', sel: any = null;
      if (typeof tg === 'string') { const [s, frag] = tg.split('#'); source = s; if (frag) sel = { type: 'FragmentSelector', value: frag }; }
      else { source = String(tg?.source?.id ?? tg?.source ?? tg?.full ?? ''); sel = Array.isArray(tg?.selector) ? tg.selector[0] : tg?.selector; if (sel?.type === 'Choice' || sel?.default) sel = sel.default ?? sel.item?.[0]; }
      let geo: { shape: Region['shape']; points: Pt[] } | null = null;
      if (sel?.type === 'FragmentSelector' || /^xywh=/.test(sel?.value ?? '')) {
        const m = /xywh=(?:pixel:)?\s*(-?[\d.]+),(-?[\d.]+),(-?[\d.]+),(-?[\d.]+)/.exec(sel.value);
        if (m && !/percent:/.test(sel.value)) geo = { shape: 'rect', points: rectPoints(+m[1], +m[2], +m[3], +m[4]) };
      } else if (sel?.type === 'SvgSelector') geo = svgPoints(String(sel.value ?? ''));
      if (!geo || geo.points.length < 3 || geo.points.some((p) => !p.every(Number.isFinite))) { skipped++; return; }
      const t = byCanvas.get(source) ?? byName.get(source) ?? byName.get(source.split('/').pop() ?? '');
      const [sx, sy] = scaleOf(t?.canvas && t.canvas.id === source ? t : undefined);
      const bodies: any[] = Array.isArray(a.body) ? a.body : a.body ? [a.body] : Array.isArray(a.resource) ? a.resource : a.resource ? [a.resource] : [];
      const text = (b: any) => String(b?.value ?? b?.chars ?? '');
      const tr = bodies.find((b) => b?.purpose === 'transcribing') ?? (a.motivation === 'transcribing' || a.motivation === 'supplementing' ? bodies.find((b) => !b?.purpose) : undefined);
      const notes = bodies.filter((b) => b !== tr).map(text).filter(Boolean);
      const idTail = String(a.id ?? a['@id'] ?? '').split('/').pop() || `anno-${k + 1}`;
      regions.push({ id: idTail, image: t?.name ?? source, shape: geo.shape, points: geo.points.map(([x, y]) => [r2(x / sx), r2(y / sy)] as Pt), transcription: tr ? text(tr) : '', note: notes.join('\n') });
    } catch { skipped++; }
  });
  return { regions, skipped };
}

const cell = (s: string | number) => { const v = String(s); return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; };
export const CSV_HEAD = ['id', 'image', 'canvas', 'shape', 'x', 'y', 'width', 'height', 'points', 'transcription', 'note'];
/** One row per region; x, y, width and height are the bounding box in image pixels; points are "x,y x,y …". */
export function toCsv(regions: Region[], targets: Target[]): string {
  const byName = new Map(targets.map((t) => [t.name, t]));
  return [CSV_HEAD.join(','), ...regions.map((r) => { const b = bbox(r.points); return [r.id, r.image, byName.get(r.image)?.canvas?.id ?? '', r.shape, r2(b.x), r2(b.y), r2(b.w), r2(b.h), r.points.map((p) => p.map(r2).join(',')).join(' '), r.transcription, r.note].map(cell).join(','); })].join('\n') + '\n';
}

export type Canvas = { id: string; label: string; width: number; height: number; image: string };
const label = (l: any): string => (typeof l === 'string' ? l : Array.isArray(l) ? label(l[0]?.['@value'] ?? l[0]) : l && typeof l === 'object' ? label(Object.values(l)[0]) : l == null ? '' : String(l));
/** The canvases of a IIIF Presentation 2 or 3 manifest (read from a local file; nothing is fetched). */
export function parseManifest(json: unknown): { label: string; version: 2 | 3; canvases: Canvas[] } {
  const j = json as Record<string, any>;
  const ctx = JSON.stringify(j?.['@context'] ?? '');
  if (j?.type === 'Manifest' || /presentation\/3/.test(ctx)) {
    const canvases = (j.items ?? []).filter((c: any) => c?.type === 'Canvas').map((c: any, k: number) => {
      const body = c.items?.[0]?.items?.[0]?.body; const b = Array.isArray(body) ? body[0] : body;
      return { id: String(c.id), label: label(c.label) || `Canvas ${k + 1}`, width: Number(c.width) || 0, height: Number(c.height) || 0, image: String(b?.id ?? '') };
    });
    return { label: label(j.label), version: 3, canvases };
  }
  if (j?.['@type'] === 'sc:Manifest' || /presentation\/2/.test(ctx)) {
    const canvases = (j.sequences?.[0]?.canvases ?? []).map((c: any, k: number) => ({ id: String(c['@id']), label: label(c.label) || `Canvas ${k + 1}`, width: Number(c.width) || 0, height: Number(c.height) || 0, image: String(c.images?.[0]?.resource?.['@id'] ?? '') }));
    return { label: label(j.label), version: 2, canvases };
  }
  throw new Error('This is not a IIIF Presentation manifest (version 2 or 3).');
}

/**
 * Pair opened image files with canvases: first by file name (the last part of the canvas image's address, or its
 * IIIF identifier before /full/), then the rest in order.
 */
export function matchCanvases(files: string[], canvases: Canvas[]): (Canvas | undefined)[] {
  const base = (s: string) => s.toLowerCase().replace(/\.[a-z0-9]+$/, '');
  const keys = canvases.map((c) => { const p = c.image.split('/'); const i = p.indexOf('full'); return [p.pop() ?? '', i > 0 ? p[i - 1] : ''].map(decodeURIComponent).map(base); });
  const used = new Set<number>(), out: (Canvas | undefined)[] = files.map(() => undefined);
  files.forEach((f, i) => { const k = keys.findIndex((ks, c) => !used.has(c) && ks.includes(base(f))); if (k >= 0) { used.add(k); out[i] = canvases[k]; } });
  let next = 0;
  files.forEach((_, i) => { if (out[i]) return; while (used.has(next)) next++; if (next < canvases.length) { used.add(next); out[i] = canvases[next]; } });
  return out;
}

/** Made-up example regions for the generated example page (900 × 1200 px). */
export const EXAMPLE_REGIONS: Region[] = [
  { id: 'anno-1', image: 'example-page.png', shape: 'rect', points: rectPoints(120, 110, 660, 70), transcription: 'Accompt of the Mill at Ashford', note: 'Heading, larger hand.' },
  { id: 'anno-2', image: 'example-page.png', shape: 'rect', points: rectPoints(100, 230, 700, 48), transcription: 'Item rec. of Thomas Hale for grinding  ij s', note: '' },
  { id: 'anno-3', image: 'example-page.png', shape: 'polygon', points: [[640, 860], [800, 840], [830, 960], [700, 1010], [620, 950]], transcription: '', note: 'Stain over the margin; text below unreadable.' },
];
