// Poster layout: paper sizes, a grid of columns with margins, gutters and title and footer bands, text sizes that
// stay readable at a viewing distance, and an SVG template with guides and dimensions. All lengths in mm. No DOM.

export type Paper = { id: string; name: string; w: number; h: number };
// ISO 216 A sizes (mm) and common North American poster sizes (inches × 25.4).
export const PAPERS: Paper[] = [
  { id: 'a0', name: 'A0 (841 × 1189 mm)', w: 841, h: 1189 },
  { id: 'a1', name: 'A1 (594 × 841 mm)', w: 594, h: 841 },
  { id: 'a2', name: 'A2 (420 × 594 mm)', w: 420, h: 594 },
  { id: 'a3', name: 'A3 (297 × 420 mm)', w: 297, h: 420 },
  { id: '36x48', name: '36 × 48 in', w: 36 * 25.4, h: 48 * 25.4 },
  { id: '42x56', name: '42 × 56 in', w: 42 * 25.4, h: 56 * 25.4 },
  { id: '24x36', name: '24 × 36 in', w: 24 * 25.4, h: 36 * 25.4 },
  { id: '48x96', name: '48 × 96 in (4 × 8 ft board)', w: 48 * 25.4, h: 96 * 25.4 },
];

export type LayoutIn = { w: number; h: number; landscape: boolean; cols: number; margin: number; gutter: number; title: number; footer: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Layout = { W: number; H: number; content: Rect; title: Rect | null; footer: Rect | null; columns: Rect[]; colW: number; area: number };

/** The grid: page, content area inside the margins, title band, footer band and equal columns between them. */
export function layout(o: LayoutIn): Layout | string {
  const [W, H] = o.landscape ? [Math.max(o.w, o.h), Math.min(o.w, o.h)] : [Math.min(o.w, o.h), Math.max(o.w, o.h)];
  if (!(W > 0 && H > 0 && W <= 5000 && H <= 5000)) return 'The poster must be between 1 and 5000 mm on each side.';
  if (!(Number.isInteger(o.cols) && o.cols >= 1 && o.cols <= 8)) return 'Choose 1 to 8 columns.';
  if (!(o.margin >= 0 && o.gutter >= 0 && o.title >= 0 && o.footer >= 0)) return 'Margins, gutters and bands cannot be negative.';
  const content = { x: o.margin, y: o.margin, w: W - 2 * o.margin, h: H - 2 * o.margin };
  const gaps = (o.title > 0 ? 1 : 0) + (o.footer > 0 ? 1 : 0);
  const colH = content.h - o.title - o.footer - gaps * o.gutter, colW = (content.w - (o.cols - 1) * o.gutter) / o.cols;
  if (!(content.w > 0 && colW >= 10)) return 'The margins and gutters leave columns under 10 mm wide. Use fewer columns or smaller gaps.';
  if (!(colH >= 10)) return 'The title and footer bands leave no room for the columns. Make them shorter.';
  const title = o.title > 0 ? { x: content.x, y: content.y, w: content.w, h: o.title } : null;
  const top = content.y + (title ? o.title + o.gutter : 0);
  const footer = o.footer > 0 ? { x: content.x, y: content.y + content.h - o.footer, w: content.w, h: o.footer } : null;
  const columns = Array.from({ length: o.cols }, (_, i) => ({ x: content.x + i * (colW + o.gutter), y: top, w: colW, h: colH }));
  return { W, H, content, title, footer, columns, colW, area: o.cols * colW * colH };
}

// ---------- Text size at a viewing distance ----------
// The smallest letters a person with normal (6/6, 20/20) sight can read span 5 minutes of arc. For comfortable
// reading we ask for `comfort` times that for the capital height, and take a sans-serif capital as 0.7 of the font
// size (Helvetica and Arial are near 0.72).
export const PT_MM = 25.4 / 72;
export const CAP_RATIO = 0.7;
/** Capital-letter height (mm) that spans `comfort` × 5 arcmin at `distM` metres. */
export const capHeight = (distM: number, comfort: number) => distM * 1000 * Math.tan(((comfort * 5) / 60) * (Math.PI / 180));
/** Font size in points whose capitals are that tall. */
export const fontPt = (distM: number, comfort: number) => capHeight(distM, comfort) / CAP_RATIO / PT_MM;
/** The distance (m) at which a font of `pt` points is still comfortable. */
export const readableAt = (pt: number, comfort: number) => (pt * PT_MM * CAP_RATIO) / 1000 / Math.tan(((comfort * 5) / 60) * (Math.PI / 180));
/** About how many characters fit on one line of a column at this font size (average sans character ≈ 0.5 em). */
export const charsPerLine = (colW: number, pt: number) => Math.floor(colW / (0.5 * pt * PT_MM));

export type Role = { name: string; dist: number };
export const ROLES: Role[] = [
  { name: 'Title', dist: 5 }, { name: 'Section headings', dist: 3 }, { name: 'Body text', dist: 1.5 }, { name: 'Captions and references', dist: 1 },
];
export function textGuide(roles: Role[], comfort: number, colW: number) {
  return roles.map((r) => { const pt = fontPt(r.dist, comfort); return { ...r, cap: capHeight(r.dist, comfort), pt, round: Math.ceil(pt / 2) * 2, chars: charsPerLine(colW, Math.ceil(pt / 2) * 2) }; });
}

// ---------- SVG template ----------
const f1 = (x: number) => (Math.round(x * 10) / 10).toString();
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** An SVG template at true size (mm): guide boxes, dimension notes and the text size guide, ready for Inkscape or Illustrator. */
export function posterSvg(L: Layout, guide: ReturnType<typeof textGuide>, label: string): string {
  const s = Math.max(L.W, L.H) / 841, fs = (pt: number) => f1(pt * PT_MM), o: string[] = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${f1(L.W)}mm" height="${f1(L.H)}mm" viewBox="0 0 ${f1(L.W)} ${f1(L.H)}" font-family="Helvetica, Arial, sans-serif">`);
  o.push(`<title>${esc(label)} poster template</title>`);
  o.push(`<rect x="0" y="0" width="${f1(L.W)}" height="${f1(L.H)}" fill="#ffffff" stroke="#999999" stroke-width="${f1(0.5 * s)}"/>`);
  o.push(`<g id="guides" fill="none" stroke="#1f77b4" stroke-width="${f1(0.6 * s)}" stroke-dasharray="${f1(4 * s)} ${f1(3 * s)}">`);
  o.push(`<rect id="content" x="${f1(L.content.x)}" y="${f1(L.content.y)}" width="${f1(L.content.w)}" height="${f1(L.content.h)}"/>`);
  if (L.title) o.push(`<rect id="title-band" x="${f1(L.title.x)}" y="${f1(L.title.y)}" width="${f1(L.title.w)}" height="${f1(L.title.h)}"/>`);
  if (L.footer) o.push(`<rect id="footer-band" x="${f1(L.footer.x)}" y="${f1(L.footer.y)}" width="${f1(L.footer.w)}" height="${f1(L.footer.h)}"/>`);
  L.columns.forEach((c, i) => o.push(`<rect id="column-${i + 1}" x="${f1(c.x)}" y="${f1(c.y)}" width="${f1(c.w)}" height="${f1(c.h)}"/>`));
  o.push('</g>');
  o.push(`<g id="notes" fill="#1f77b4" font-size="${fs(14 * s)}">`);
  if (L.title) {
    o.push(`<text x="${f1(L.title.x + 6 * s)}" y="${f1(L.title.y + L.title.h / 2)}" font-size="${fs(guide[0].round)}" dominant-baseline="middle" fill="#bbbbbb">Title, ${guide[0].round} pt</text>`);
    o.push(`<text x="${f1(L.title.x + L.title.w - 6 * s)}" y="${f1(L.title.y + 8 * s)}" text-anchor="end">Title band ${f1(L.title.w)} × ${f1(L.title.h)} mm</text>`);
  }
  L.columns.forEach((c, i) => o.push(`<text x="${f1(c.x + 6 * s)}" y="${f1(c.y + 12 * s)}">Column ${i + 1}: ${f1(c.w)} × ${f1(c.h)} mm</text>`));
  if (L.footer) o.push(`<text x="${f1(L.footer.x + 6 * s)}" y="${f1(L.footer.y + L.footer.h / 2)}" dominant-baseline="middle">Footer ${f1(L.footer.w)} × ${f1(L.footer.h)} mm (logos, references, contact)</text>`);
  const c0 = L.columns[0];
  guide.forEach((g, i) => o.push(`<text x="${f1(c0.x + 6 * s)}" y="${f1(c0.y + (30 + 8) * s + i * 22 * s)}">${esc(g.name)}: ${g.round} pt (readable at ${g.dist} m)</text>`));
  o.push(`<text x="${f1(L.W / 2)}" y="${f1(L.H - Math.max(2, L.content.y / 2 - 2 * s))}" text-anchor="middle">${esc(label)}: ${f1(L.W)} × ${f1(L.H)} mm, margins ${f1(L.content.x)} mm. Delete this layer before printing.</text>`);
  o.push('</g></svg>');
  return o.join('\n') + '\n';
}
