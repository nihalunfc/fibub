// Small inline-SVG charts for blog articles ("Checked with the tools" sections).
// Each chart is one line of SVG so it can sit inside a Markdown file as raw HTML. Colours come from the page's
// own CSS variables, so the figures follow light, dark and red-light modes without any script.
// Usage: see scripts/blog-figures/README.md.
import { niceTicks } from '../../src/lib/sci/plot.ts';

// Series colours: the Blog accent first, then the Tools blue, then plain ink. Text always uses ink/muted.
export const COLOURS = ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--muted)'];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r = (v) => Math.round(v * 10) / 10;
const fmt = (v) => { const a = Math.abs(v); if (a === 0) return '0'; if (a >= 1000 || a < 0.01) return v.toPrecision(3).replace(/\.?0+e/, 'e'); return String(+v.toPrecision(4)); };

/**
 * A line/scatter chart.
 * opts: { title, xLabel, yLabel, series: [{ name, x[], y[], kind: 'line'|'dots'|'step', colour?, dash?, label? }],
 *         xDomain?, yDomain?, yReverse?, hlines?: [{ y, text }], vlines?: [{ x, text }], bands?: [{ x0, x1, text }],
 *         width?, height?, desc }
 */
export function chart(o) {
  const named = o.series.filter((s) => s.name && !s.noLegend), hasLegend = named.length >= 2;
  const W = o.width ?? 560, H = (o.height ?? 300) + (hasLegend ? 18 : 0), L = 58, R = 14, T = hasLegend ? 50 : 32, B = 46;
  const xs = o.series.flatMap((s) => s.x), ys = o.series.flatMap((s) => s.y).filter(Number.isFinite);
  const [x0, x1] = o.xDomain ?? [Math.min(...xs), Math.max(...xs)];
  let [y0, y1] = o.yDomain ?? [Math.min(...ys), Math.max(...ys)];
  if (!o.yDomain) { const pad = (y1 - y0 || 1) * 0.06; y0 -= pad; y1 += pad; }
  const X = (v) => L + ((v - x0) / (x1 - x0)) * (W - L - R);
  const Y = (v) => (o.yReverse ? T + ((v - y0) / (y1 - y0)) * (H - T - B) : H - B - ((v - y0) / (y1 - y0)) * (H - T - B));
  const out = [];
  out.push(`<svg class="blog-fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.desc ?? o.title)}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif">`);
  out.push(`<title>${esc(o.title)}</title>`);
  if (o.title) out.push(`<text x="${L}" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">${esc(o.title)}</text>`);
  for (const b of o.bands ?? []) {
    out.push(`<rect x="${r(X(b.x0))}" y="${T}" width="${r(X(b.x1) - X(b.x0))}" height="${H - T - B}" style="fill:var(--accent-soft)"/>`);
    if (b.text) out.push(`<text x="${r((X(b.x0) + X(b.x1)) / 2)}" y="${T + 14}" text-anchor="middle" style="fill:var(--muted)">${esc(b.text)}</text>`);
  }
  // Grid and axes (recessive).
  for (const t of niceTicks(y0, y1, 5)) { if (t < Math.min(y0, y1) || t > Math.max(y0, y1)) continue; out.push(`<line x1="${L}" x2="${W - R}" y1="${r(Y(t))}" y2="${r(Y(t))}" style="stroke:var(--line)"/><text x="${L - 6}" y="${r(Y(t)) + 4}" text-anchor="end" style="fill:var(--muted)">${fmt(t)}</text>`); }
  for (const t of o.xTicks ?? niceTicks(x0, x1, 6)) { if (t < x0 || t > x1) continue; out.push(`<line x1="${r(X(t))}" x2="${r(X(t))}" y1="${H - B}" y2="${H - B + 4}" style="stroke:var(--muted)"/><text x="${r(X(t))}" y="${H - B + 17}" text-anchor="middle" style="fill:var(--muted)">${o.xFmt ? o.xFmt(t) : fmt(t)}</text>`); }
  out.push(`<line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" style="stroke:var(--muted)"/>`);
  out.push(`<text x="${(L + W - R) / 2}" y="${H - 8}" text-anchor="middle" style="fill:var(--ink)">${esc(o.xLabel)}</text>`);
  out.push(`<text transform="translate(14 ${(T + H - B) / 2}) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">${esc(o.yLabel)}</text>`);
  for (const h of o.hlines ?? []) out.push(`<line x1="${L}" x2="${W - R}" y1="${r(Y(h.y))}" y2="${r(Y(h.y))}" style="stroke:var(--muted);stroke-dasharray:4 4"/>${h.text ? `<text x="${W - R - 4}" y="${r(Y(h.y)) - 5}" text-anchor="end" style="fill:var(--muted)">${esc(h.text)}</text>` : ''}`);
  for (const v of o.vlines ?? []) out.push(`<line x1="${r(X(v.x))}" x2="${r(X(v.x))}" y1="${T}" y2="${H - B}" style="stroke:var(--muted);stroke-dasharray:4 4"/>${v.text ? `<text x="${r(X(v.x)) + (v.left ? -4 : 4)}" y="${T + 12 + (v.dy ?? 0)}" text-anchor="${v.left ? 'end' : 'start'}" style="fill:var(--muted)">${esc(v.text)}</text>` : ''}`);
  o.series.forEach((s, i) => {
    const c = s.colour ?? COLOURS[i % COLOURS.length];
    const pts = s.x.map((x, j) => [x, s.y[j]]).filter(([x, y]) => Number.isFinite(y) && x >= x0 && x <= x1);
    if (s.kind === 'dots') {
      for (const [x, y] of pts) out.push(`<circle cx="${r(X(x))}" cy="${r(Y(y))}" r="${s.size ?? 2.2}" style="fill:${c};opacity:${s.opacity ?? 1}"/>`);
      for (const [j, [x, y]] of pts.entries()) if (s.errors) { const e = s.errors[j]; out.push(`<line x1="${r(X(x))}" x2="${r(X(x))}" y1="${r(Y(y - e))}" y2="${r(Y(y + e))}" style="stroke:${c}"/>`); }
    } else if (pts.length) {
      const d = pts.map(([x, y], j) => `${j ? 'L' : 'M'}${r(X(x))} ${r(Y(y))}`).join('');
      out.push(`<path d="${d}" style="fill:none;stroke:${c};stroke-width:2;stroke-linejoin:round${s.dash ? ';stroke-dasharray:' + s.dash : ''}"/>`);
    }
    if (s.label) { const [lx, ly] = s.label.at ?? pts[pts.length - 1]; out.push(`<text x="${r(X(lx)) + (s.label.dx ?? 6)}" y="${r(Y(ly)) + (s.label.dy ?? 4)}" text-anchor="${s.label.anchor ?? 'start'}" style="fill:var(--ink)">${esc(s.label.text ?? s.name)}</text>`); }
  });
  // Legend for two or more named series.
  if (hasLegend) {
    let lx = L;
    for (const s of named) {
      const w = 26 + s.name.length * 7.2; const c = s.colour ?? COLOURS[o.series.indexOf(s) % COLOURS.length];
      out.push(s.kind === 'dots' ? `<circle cx="${r(lx + 5)}" cy="36" r="4" style="fill:${c}"/>` : `<line x1="${r(lx)}" x2="${r(lx + 12)}" y1="36" y2="36" style="stroke:${c};stroke-width:2${s.dash ? ';stroke-dasharray:' + s.dash : ''}"/>`);
      out.push(`<text x="${r(lx + 16)}" y="40" style="fill:var(--muted)">${esc(s.name)}</text>`);
      lx += w;
    }
  }
  out.push('</svg>');
  return out.join('');
}

/** Wrap a chart in a <figure> with a caption. One line, so Markdown keeps it as a raw HTML block. */
export const figure = (svg, caption) => `<figure class="blog-figure">${svg}<figcaption>${esc(caption)}</figcaption></figure>`;

/** Replace the block between <!-- fig:name --> and <!-- /fig:name --> in a Markdown string. */
export function inject(md, name, html) {
  const re = new RegExp(`<!-- fig:${name} -->[\\s\\S]*?<!-- /fig:${name} -->`);
  if (!re.test(md)) throw new Error(`No <!-- fig:${name} --> marker in the article.`);
  return md.replace(re, `<!-- fig:${name} -->\n${html}\n<!-- /fig:${name} -->`);
}
