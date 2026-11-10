// Small Markdown to HTML converter for the Markdown to PDF tool. Plain TypeScript, no DOM.
// Everything is escaped. Links allow only http, https, mailto and #anchors. Images are only
// allowed when the name matches a local file the visitor chose (a data: URL passed in `images`).

export type MdOptions = { images?: Record<string, string>; toc?: boolean };
export type MdHead = { level: number; text: string; id: string };
export type MdResult = { html: string; headings: MdHead[]; missingImages: string[] };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function slug(s: string): string {
  return s.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
}

function safeUrl(u: string): string | null {
  const t = u.trim();
  return /^(https?:\/\/|mailto:|#)/i.test(t) ? t : null;
}

function inline(src: string, o: MdOptions, miss: string[]): string {
  const stash: string[] = [];
  const keep = (h: string) => '\u0000' + (stash.push(h) - 1) + '\u0000';
  let s = src;
  s = s.replace(/(`+)([\s\S]*?[^`])\1(?!`)/g, (_m, _t, c) => keep('<code>' + esc(c.trim()) + '</code>'));
  s = s.replace(/\\([\\`*_{}\[\]()#+\-.!|~<>])/g, (_m, c) => keep(esc(c)));
  s = s.replace(/!\[([^\]]*)\]\(((?:[^()\s]|\([^()\s]*\))+)(?:\s+"[^"]*")?\)/g, (_m, alt, url) => {
    const name = decodeURIComponent(url.split('/').pop() || url).toLowerCase();
    const data = o.images && o.images[name];
    if (data) return keep('<img src="' + data + '" alt="' + esc(alt) + '">');
    miss.push(url);
    return keep('<span class="md-missing">[image: ' + esc(alt || url) + ' (add the file to show it)]</span>');
  });
  s = s.replace(/\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)(?:\s+"[^"]*")?\)/g, (_m, text, url) => {
    const u = safeUrl(url);
    return u ? keep('<a href="' + esc(u) + '">') + text + keep('</a>') : text;
  });
  s = s.replace(/<(https?:\/\/[^>\s]+|[^>\s@]+@[^>\s]+\.[a-z]+)>/gi, (_m, u) => {
    const href = u.includes('@') && !/^https?:/i.test(u) ? 'mailto:' + u : u;
    return keep('<a href="' + esc(href) + '">' + esc(u) + '</a>');
  });
  s = esc(s);
  s = s.replace(/\*\*\*(?=\S)([\s\S]*?\S)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__(?=\S)([\s\S]*?\S)__/g, '<strong>$1</strong>');
  s = s.replace(/\*(?=\S)([\s\S]*?\S)\*/g, '<em>$1</em>');
  s = s.replace(/(^|[^\p{L}\p{N}])_(?=\S)([\s\S]*?\S)_(?![\p{L}\p{N}])/gu, '$1<em>$2</em>');
  s = s.replace(/~~(?=\S)([\s\S]*?\S)~~/g, '<del>$1</del>');
  s = s.replace(/( {2,}|\\)\n/g, '<br>\n');
  return s.replace(/\u0000(\d+)\u0000/g, (_m, i) => stash[+i]);
}

const isTableSep = (l: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l) && l.includes('-') && (l.includes('|') || /^\s*:?-+:?\s*$/.test(l));
const cells = (l: string) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
const listRe = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;

export function markdownToHtml(md: string, o: MdOptions = {}): MdResult {
  const lines = md.replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n');
  const headings: MdHead[] = [];
  const miss: string[] = [];
  const used = new Map<string, number>();
  const inl = (t: string) => inline(t, o, miss);
  const out: string[] = [];

  function block(ls: string[]): string {
    const res: string[] = [];
    let i = 0;
    while (i < ls.length) {
      const line = ls[i];
      if (!line.trim()) { i++; continue; }
      const fence = line.match(/^\s*(`{3,}|~{3,})\s*([\w+-]*)/);
      if (fence) {
        const body: string[] = []; i++;
        while (i < ls.length && !new RegExp('^\\s*' + fence[1][0] + '{' + fence[1].length + ',}\\s*$').test(ls[i])) body.push(ls[i++]);
        i++;
        res.push('<pre><code' + (fence[2] ? ' class="lang-' + esc(fence[2]) + '"' : '') + '>' + esc(body.join('\n')) + '</code></pre>');
        continue;
      }
      const h = line.match(/^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/);
      if (h) {
        const level = h[1].length, text = h[2];
        const plain = text.replace(/[*_`~]/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
        let id = slug(plain); const n = used.get(id) || 0; used.set(id, n + 1); if (n) id += '-' + n;
        headings.push({ level, text: plain, id });
        res.push('<h' + level + ' id="' + esc(id) + '">' + inl(text) + '</h' + level + '>');
        i++; continue;
      }
      if (/^ {0,3}([-*_])( *\1){2,} *$/.test(line)) { res.push('<hr>'); i++; continue; }
      if (/^ {0,3}>/.test(line)) {
        const q: string[] = [];
        while (i < ls.length && /^ {0,3}>/.test(ls[i])) q.push(ls[i++].replace(/^ {0,3}> ?/, ''));
        res.push('<blockquote>' + block(q) + '</blockquote>'); continue;
      }
      if (line.includes('|') && i + 1 < ls.length && isTableSep(ls[i + 1])) {
        const head = cells(line), al = cells(ls[i + 1]).map((c) => (c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : c.startsWith(':') ? 'left' : ''));
        i += 2; const rows: string[][] = [];
        while (i < ls.length && ls[i].trim() && ls[i].includes('|')) rows.push(cells(ls[i++]));
        const td = (t: string, c: string, k: number) => '<' + t + (al[k] ? ' style="text-align:' + al[k] + '"' : '') + '>' + inl(c ?? '') + '</' + t + '>';
        res.push('<table><thead><tr>' + head.map((c, k) => td('th', c, k)).join('') + '</tr></thead><tbody>' +
          rows.map((r) => '<tr>' + head.map((_c, k) => td('td', r[k] ?? '', k)).join('') + '</tr>').join('') + '</tbody></table>');
        continue;
      }
      const li = line.match(listRe);
      if (li) {
        const base = li[1].length, ordered = /\d/.test(li[2][0]);
        const items: string[][] = [];
        while (i < ls.length) {
          const m = ls[i].match(listRe);
          if (m && m[1].length <= base + 1 && /\d/.test(m[2][0]) === ordered) { items.push([m[3]]); i++; continue; }
          if (!ls[i].trim()) { if (i + 1 < ls.length && /^\s+\S/.test(ls[i + 1]) && items.length) { items[items.length - 1].push(''); i++; continue; } break; }
          if (/^\s+\S/.test(ls[i]) && items.length) { items[items.length - 1].push(ls[i].replace(/^ {1,4}/, '')); i++; continue; }
          break;
        }
        const start = ordered ? parseInt(li[2], 10) : 1;
        res.push((ordered ? '<ol' + (start !== 1 ? ' start="' + start + '"' : '') + '>' : '<ul>') + items.map((it) => {
          let first = it[0], task = '';
          const t = first.match(/^\[([ xX])\]\s+(.*)$/);
          if (t) { task = '<input type="checkbox" disabled' + (t[1] !== ' ' ? ' checked' : '') + '> '; first = t[2]; }
          const rest = it.slice(1);
          const hasNested = rest.some((r) => listRe.test(r.trim() ? r : 'x') || /^\s*(```|>)/.test(r));
          return '<li>' + task + (hasNested || rest.some((r) => !r.trim()) ? block([first, ...rest]).replace(/^<p>([\s\S]*?)<\/p>/, '$1') : inl([first, ...rest].join('\n'))) + '</li>';
        }).join('') + (ordered ? '</ol>' : '</ul>'));
        continue;
      }
      const para: string[] = [];
      while (i < ls.length && ls[i].trim() && !/^ {0,3}(#{1,6}\s|>|```|~~~)/.test(ls[i]) && !/^ {0,3}([-*_])( *\1){2,} *$/.test(ls[i]) && !(para.length && listRe.test(ls[i])) && !(para.length && ls[i].includes('|') && i + 1 < ls.length && isTableSep(ls[i + 1]))) para.push(ls[i++]);
      if (!para.length) { para.push(ls[i++]); }
      const setext = i < ls.length && /^ {0,3}(=+|-+)\s*$/.test(ls[i]) && para.length === 1;
      if (setext) {
        const level = ls[i].trim()[0] === '=' ? 1 : 2; i++;
        let id = slug(para[0]); const n = used.get(id) || 0; used.set(id, n + 1); if (n) id += '-' + n;
        headings.push({ level, text: para[0], id });
        res.push('<h' + level + ' id="' + esc(id) + '">' + inl(para[0]) + '</h' + level + '>');
      } else res.push('<p>' + inl(para.join('\n')) + '</p>');
    }
    return res.join('\n');
  }

  const body = block(lines);
  if (o.toc && headings.length) {
    const min = Math.min(...headings.map((h) => h.level));
    out.push('<nav class="md-toc"><p class="md-toc-title">Contents</p><ul>' + headings.filter((h) => h.level <= min + 2).map((h) => '<li class="md-l' + (h.level - min) + '"><a href="#' + esc(h.id) + '">' + esc(h.text) + '</a></li>').join('') + '</ul></nav>');
  }
  out.push(body);
  return { html: out.join('\n'), headings, missingImages: [...new Set(miss)] };
}

// Page sizes for the print rule.
export const PAGE_SIZES: Record<string, string> = { A4: 'A4', Letter: 'letter', Legal: 'legal', A5: 'A5' };
