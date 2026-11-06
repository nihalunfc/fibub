// Word (.docx), HTML and plain text / code to clean Markdown.
import { unzipSync, strFromU8 } from 'fflate';
import { tidy, type PruneOptions } from './clean';

export function docxToMarkdown(data: Uint8Array, o: PruneOptions) {
  const files = unzipSync(data, { filter: (f) => f.name === 'word/document.xml' });
  const xml = files['word/document.xml'];
  if (!xml) throw new Error('Not a Word file');
  const doc = new DOMParser().parseFromString(strFromU8(xml), 'application/xml');
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const out: string[] = [];
  let raw = '';
  for (const p of Array.from(doc.getElementsByTagNameNS(W, 'p'))) {
    let text = '';
    for (const r of Array.from(p.getElementsByTagNameNS(W, 'r'))) {
      const bold = r.getElementsByTagNameNS(W, 'b').length > 0;
      let t = '';
      for (const n of Array.from(r.childNodes) as Element[]) {
        if (n.localName === 't') t += n.textContent ?? '';
        else if (n.localName === 'tab') t += ' ';
        else if (n.localName === 'br') t += '\n';
      }
      text += bold && t.trim() ? `**${t.trim()}** ` : t;
    }
    text = text.replace(/\*\*\s*\*\*/g, '').trim();
    raw += text + '\n';
    if (!text) { out.push(''); continue; }
    const style = p.getElementsByTagNameNS(W, 'pStyle')[0]?.getAttributeNS(W, 'val') ?? '';
    const h = style.match(/heading\s*(\d)|^title$/i);
    const list = p.getElementsByTagNameNS(W, 'numPr').length > 0;
    if (h) out.push(`${'#'.repeat(Math.min(+(h[1] ?? 1), 4))} ${text.replace(/\*\*/g, '')}`);
    else if (list) out.push(`- ${text}`);
    else out.push(text);
  }
  return { raw, markdown: tidy(out.join('\n\n'), o) };
}

export function htmlToMarkdown(html: string, o: PruneOptions) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style,noscript,template,svg,iframe,nav,footer,header,aside,form,button,[aria-hidden="true"],[hidden]').forEach((e) => e.remove());
  const root = doc.querySelector('main,article') ?? doc.body;
  const out: string[] = [];
  const walk = (el: Element) => {
    for (const n of Array.from(el.children)) {
      const tag = n.tagName.toLowerCase();
      const text = (n.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (/^h[1-6]$/.test(tag)) { if (text) out.push(`${'#'.repeat(Math.min(+tag[1], 4))} ${text}`); }
      else if (tag === 'li') { if (text) out.push(`- ${text}`); }
      else if (tag === 'pre') out.push('```\n' + (n.textContent ?? '').trimEnd() + '\n```');
      else if (tag === 'tr') out.push('| ' + Array.from(n.children).map((c) => (c.textContent ?? '').replace(/\s+/g, ' ').trim()).join(' | ') + ' |');
      else if (['p', 'blockquote', 'dd', 'dt', 'figcaption', 'caption'].includes(tag)) { if (text) out.push(text); }
      else walk(n);
    }
  };
  walk(root);
  return { raw: (doc.body.textContent ?? '').trim(), markdown: tidy(out.join('\n\n'), o) };
}

const LICENCE = /\b(licen[cs]e[ds]?|copyright|permission is hereby granted|all rights reserved|spdx-license-identifier|warranty|apache|gnu general public|mit license|bsd)\b/i;
const COMMENT_STYLES: Record<string, { line?: string; block?: [string, string] }> = {
  c: { line: '//', block: ['/*', '*/'] }, hash: { line: '#' }, sql: { line: '--', block: ['/*', '*/'] }, html: { block: ['<!--', '-->'] },
};
export const commentStyle = (ext: string) =>
  /^(js|mjs|cjs|ts|tsx|jsx|java|c|h|cc|cpp|hpp|cs|go|rs|swift|kt|kts|scala|php|dart|css|scss|less|astro|vue|svelte)$/.test(ext) ? 'c'
  : /^(py|rb|sh|bash|zsh|r|pl|yaml|yml|toml|ps1|dockerfile|makefile|cfg|ini|conf)$/.test(ext) ? 'hash'
  : /^(sql|lua|hs)$/.test(ext) ? 'sql' : /^(html|htm|xml|svg|md)$/.test(ext) ? 'html' : '';

/** Code: licence header off the top, optional comment removal, whitespace tidied. */
export function cleanCode(src: string, ext: string, o: PruneOptions) {
  let s = src.replace(/\r\n?/g, '\n');
  const cs = COMMENT_STYLES[commentStyle(ext)];
  if (o.licences && cs) {
    // The first comment block (after a shebang) goes if it reads like a licence.
    const m = s.match(/^(#!.*\n)?(\s*)((?:\/\*[\s\S]*?\*\/|(?:[ \t]*(?:\/\/|#|--).*\n)+|<!--[\s\S]*?-->))/);
    if (m && LICENCE.test(m[3])) s = (m[1] ?? '') + s.slice(m[0].length).replace(/^\n+/, '');
  }
  if (o.comments && cs) {
    if (cs.block) {
      const [a, b] = cs.block.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      s = s.replace(new RegExp(`${a}[\\s\\S]*?${b}`, 'g'), '');
    }
    // Whole-line comments only, so strings containing // or # are never touched.
    if (cs.line) s = s.replace(new RegExp(`^[ \\t]*${cs.line.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}(?!!).*\\n`, 'gm'), '');
  }
  if (o.whitespace) s = s.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').trimEnd() + '\n';
  return s;
}
