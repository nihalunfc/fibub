// Shared by sign-pdf, fill-pdf and redact-pdf: show a PDF's pages with pdf.js, a layer on each page for
// things the visitor places (boxes, signatures, text), and the maths that turns a spot on the picture into a
// spot on the real page. Nothing is uploaded; pdf.js and its worker come from this site.
import { loadPdfJs } from '../compress/pdf';

export interface PageView {
  index: number;          // 0-based
  el: HTMLElement;        // .pv-page
  canvas: HTMLCanvasElement;
  layer: HTMLElement;     // .pv-layer, same size as the picture; place things inside it
  wPt: number;            // page size in points as displayed (after rotation)
  hPt: number;
}

export async function openPdfJs(bytes: Uint8Array) {
  const pdfjs = await loadPdfJs();
  return pdfjs.getDocument({ data: bytes.slice() }).promise;
}

/** Make one box per page; each draws itself when it scrolls near the screen. */
export async function showPages(doc: any, host: HTMLElement, maxWidth = 820): Promise<PageView[]> {
  host.textContent = '';
  const views: PageView[] = [];
  const width = Math.max(240, Math.min(maxWidth, host.clientWidth || maxWidth));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const drawn = new Set<number>();
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) { io!.unobserve(e.target); void draw((e.target as any)._pv as PageView); }
  }, { rootMargin: '600px 0px' }) : null;
  async function draw(v: PageView) {
    if (drawn.has(v.index)) return; drawn.add(v.index);
    const page = await doc.getPage(v.index + 1);
    const vp = page.getViewport({ scale: (width / v.wPt) * dpr });
    v.canvas.width = Math.round(vp.width); v.canvas.height = Math.round(vp.height);
    await page.render({ canvasContext: v.canvas.getContext('2d')!, viewport: vp }).promise;
    v.el.dataset.drawn = '1';
  }
  for (let i = 0; i < doc.numPages; i++) {
    const page = await doc.getPage(i + 1);
    const vp = page.getViewport({ scale: 1 });
    const el = document.createElement('div'); el.className = 'pv-page';
    el.style.width = width + 'px'; el.style.height = Math.round((width * vp.height) / vp.width) + 'px';
    const canvas = document.createElement('canvas'); canvas.className = 'pv-canvas';
    const layer = document.createElement('div'); layer.className = 'pv-layer';
    const tag = document.createElement('span'); tag.className = 'pv-num'; tag.textContent = `Page ${i + 1} of ${doc.numPages}`;
    el.append(canvas, layer, tag); host.append(el);
    const v: PageView = { index: i, el, canvas, layer, wPt: vp.width, hPt: vp.height };
    (el as any)._pv = v; views.push(v);
    if (io) io.observe(el); else await draw(v);
  }
  return views;
}

/** Where a spot on the shown page (fractions from the top-left) lands on the real page, in PDF points. */
export function toPdfPoint(page: { x: number; y: number; width: number; height: number; rot: number }, fx: number, fy: number) {
  const { x: cx, y: cy, width: cw, height: ch } = page;
  switch (((page.rot % 360) + 360) % 360) {
    case 90: return { x: cx + fy * cw, y: cy + fx * ch };
    case 180: return { x: cx + (1 - fx) * cw, y: cy + fy * ch };
    case 270: return { x: cx + (1 - fy) * cw, y: cy + (1 - fx) * ch };
    default: return { x: cx + fx * cw, y: cy + (1 - fy) * ch };
  }
}

/** The part of a real page that is shown (crop box if there is one), and its rotation. */
export function pageGeometry(p: any) {
  const b = p.getCropBox ? p.getCropBox() : p.getMediaBox();
  return { x: b.x, y: b.y, width: b.width, height: b.height, rot: p.getRotation().angle as number };
}
/** Size of the page as it is shown (width and height swap when turned 90 or 270). */
export function shownSize(g: { width: number; height: number; rot: number }) {
  const turned = Math.abs(g.rot % 180) === 90;
  return { w: turned ? g.height : g.width, h: turned ? g.width : g.height };
}

export function downloadBytes(bytes: Uint8Array, name: string, type = 'application/pdf') {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function readFile(f: File): Promise<Uint8Array> {
  return f.arrayBuffer().then((b) => new Uint8Array(b));
}

export function outName(name: string, suffix: string) {
  return name.replace(/\.pdf$/i, '') + suffix + '.pdf';
}

/** A thing the visitor placed on a page. Position and size are fractions of the shown page. */
export interface Item { id: number; page: number; kind: string; fx: number; fy: number; fw: number; fh: number; text?: string; src?: string; }

/**
 * Put an item on its page layer so it can be dragged, resized (corner) and removed (x button).
 * `fixedRatio`: keep width/height when resizing (pictures). Text items resize by height only.
 */
export function mountItem(v: PageView, it: Item, body: HTMLElement, opts: { fixedRatio?: boolean; free?: boolean; onChange: () => void; onRemove: (it: Item) => void; label?: string }) {
  const el = document.createElement('div'); el.className = 'pv-item'; el.tabIndex = 0; el.dataset.kind = it.kind;
  el.setAttribute('role', 'group'); el.setAttribute('aria-label', opts.label || it.kind);
  const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'pv-x'; rm.textContent = '×'; rm.setAttribute('aria-label', 'Remove');
  const grip = document.createElement('span'); grip.className = 'pv-grip';
  el.append(body, rm, grip);
  const place = () => {
    el.style.left = it.fx * 100 + '%'; el.style.top = it.fy * 100 + '%';
    el.style.width = opts.fixedRatio || opts.free ? it.fw * 100 + '%' : 'auto'; el.style.height = it.fh * 100 + '%';
    const px = v.layer.clientHeight || 1; el.style.setProperty('--ph', px + 'px'); el.style.setProperty('--pw', (v.layer.clientWidth || 1) + 'px');
  };
  place();
  let mode: '' | 'move' | 'size' = '', sx = 0, sy = 0, o = { ...it };
  const down = (m: 'move' | 'size') => (e: PointerEvent) => {
    if ((e.target as HTMLElement) === rm) return;
    e.preventDefault(); e.stopPropagation(); mode = m; sx = e.clientX; sy = e.clientY; o = { ...it };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  el.addEventListener('pointerdown', down('move'));
  grip.addEventListener('pointerdown', down('size'));
  const move = (e: PointerEvent) => {
    if (!mode) return;
    const W = v.layer.clientWidth, H = v.layer.clientHeight, dx = (e.clientX - sx) / W, dy = (e.clientY - sy) / H;
    if (mode === 'move') { const fw = opts.fixedRatio || opts.free ? it.fw : el.offsetWidth / W; it.fx = Math.min(1 - fw, Math.max(0, o.fx + dx)); it.fy = Math.min(1 - it.fh, Math.max(0, o.fy + dy)); }
    else if (opts.free) {
      it.fw = Math.min(Math.max(0.01, o.fw + dx), 1 - it.fx); it.fh = Math.min(Math.max(0.006, o.fh + dy), 1 - it.fy);
    } else if (opts.fixedRatio) {
      const r = (o.fw * W) / (o.fh * H);
      let nw = Math.max(0.03, o.fw + dx);
      nw = Math.min(nw, 1 - it.fx, ((1 - it.fy) * H * r) / W);
      it.fw = nw; it.fh = (nw * W) / r / H;
    } else {
      // Text: the height sets the letter size; the width follows the words.
      it.fh = Math.min(Math.max(0.012, o.fh + dy), 1 - it.fy);
    }
    place(); opts.onChange();
  };
  el.addEventListener('pointermove', move); grip.addEventListener('pointermove', move);
  const up = () => { mode = ''; };
  el.addEventListener('pointerup', up); grip.addEventListener('pointerup', up);
  rm.addEventListener('click', (e) => { e.stopPropagation(); el.remove(); opts.onRemove(it); });
  el.addEventListener('keydown', (e) => {
    const s = e.shiftKey ? 0.02 : 0.005;
    if (e.key === 'Delete' || e.key === 'Backspace') { el.remove(); opts.onRemove(it); return; }
    const d: Record<string, [number, number]> = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] };
    if (d[e.key]) { e.preventDefault(); it.fx = Math.min(1 - it.fw, Math.max(0, it.fx + d[e.key][0])); it.fy = Math.min(1 - it.fh, Math.max(0, it.fy + d[e.key][1])); place(); opts.onChange(); }
  });
  v.layer.append(el);
  return el;
}
