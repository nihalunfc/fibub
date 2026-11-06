// Prompt pruner entry point: any supported file (or pasted text) to lean Markdown.
import { tidy, tokens, type PruneOptions } from './clean';
import { docxToMarkdown, htmlToMarkdown, cleanCode, commentStyle } from './docs';
import { unzipAsync } from '../compress/zipper';
export { DEFAULTS, tokens, type PruneOptions } from './clean';

export interface PruneResult { markdown: string; before: number; after: number; kind: string; note: string }

const SKIP_DIR = /(^|\/)(node_modules|\.git|\.hg|\.svn|dist|build|out|target|vendor|coverage|__pycache__|\.venv|venv|\.next|\.nuxt|\.cache|\.idea|\.vscode|bin|obj|\.gradle|Pods)\//;
const SKIP_FILE = /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|poetry\.lock|Pipfile\.lock|Cargo\.lock|composer\.lock|Gemfile\.lock|go\.sum|\.DS_Store|Thumbs\.db)$|\.(min\.js|min\.css|map|lock)$/i;
const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|bmp|tiff?|psd|pdf|zip|gz|tgz|bz2|xz|7z|rar|jar|war|class|exe|dll|so|dylib|o|a|wasm|woff2?|ttf|otf|eot|mp[34]|mov|avi|webm|wav|ogg|flac|sqlite|db|pkl|npy|parquet|pt|onnx|bin|dat)$/i;
const LANG: Record<string, string> = { js: 'js', mjs: 'js', cjs: 'js', ts: 'ts', tsx: 'tsx', jsx: 'jsx', py: 'python', rb: 'ruby', go: 'go', rs: 'rust', java: 'java', kt: 'kotlin', cs: 'csharp', cpp: 'cpp', cc: 'cpp', c: 'c', h: 'c', php: 'php', swift: 'swift', sql: 'sql', sh: 'bash', yml: 'yaml', yaml: 'yaml', json: 'json', toml: 'toml', html: 'html', css: 'css', scss: 'scss', md: 'markdown', astro: 'astro', vue: 'vue', svelte: 'svelte', r: 'r', dart: 'dart', scala: 'scala', lua: 'lua', xml: 'xml' };
const ext = (name: string) => (name.match(/\.([^.\/]+)$/)?.[1] ?? name.split('/').pop() ?? '').toLowerCase();
const isText = (b: Uint8Array) => !b.subarray(0, 8000).includes(0);

function codeBlock(path: string, src: string, o: PruneOptions) {
  const e = ext(path);
  if (e === 'md' || e === 'txt' || e === 'rst') return `### ${path}\n\n${tidy(src, o).trim()}\n`;
  return `### ${path}\n\n\`\`\`${LANG[e] ?? ''}\n${cleanCode(src, e, o).trimEnd()}\n\`\`\`\n`;
}

async function repoToMarkdown(file: File, data: Uint8Array, o: PruneOptions) {
  const all = await unzipAsync(data);
  let raw = 0;
  const kept: string[] = [], skipped: string[] = [];
  const parts: string[] = [];
  // Drop a single top-level folder (GitHub's "repo-main/") from the paths.
  const names = Object.keys(all).filter((n) => !n.endsWith('/'));
  const top = names.length && names.every((n) => n.startsWith(names[0].split('/')[0] + '/')) ? names[0].split('/')[0] + '/' : '';
  for (const name of names.sort()) {
    const path = name.slice(top.length);
    const bytes = all[name];
    raw += bytes.length;
    if (SKIP_DIR.test(path) || SKIP_FILE.test(path) || BINARY.test(path) || bytes.length > 400_000 || !isText(bytes)) { skipped.push(path); continue; }
    const src = new TextDecoder().decode(bytes);
    if (o.boilerplate && /^(license|licence|copying|notice)(\.(md|txt))?$/i.test(path)) { skipped.push(path); continue; }
    kept.push(path);
    parts.push(codeBlock(path, src, o));
  }
  const md = `# ${file.name.replace(/\.zip$/i, '')}\n\n## Files\n\n${kept.map((p) => `- ${p}`).join('\n')}\n\n## Contents\n\n${parts.join('\n')}`;
  return { markdown: md, before: Math.ceil(raw / 4), note: `${kept.length} files kept, ${skipped.length} skipped (dependencies, builds, lock files, binaries${o.boilerplate ? ', licence files' : ''}).` };
}

export async function pruneFile(file: File, o: PruneOptions, onProgress: (label: string) => void): Promise<PruneResult> {
  const e = ext(file.name);
  const data = new Uint8Array(await file.arrayBuffer());
  let r: { markdown: string; before: number; note: string; kind: string };
  if (e === 'pdf') {
    const { pdfToMarkdown } = await import('./pdf');
    const p = await pdfToMarkdown(data, o, (d, t) => onProgress(`Reading page ${d} of ${t}…`));
    if (!p.markdown.trim()) throw new Error('NO_TEXT');
    r = { markdown: p.markdown, before: tokens(p.raw), kind: 'PDF', note: `${p.pages} pages${p.removedRepeats ? `, ${p.removedRepeats} repeated header or footer line${p.removedRepeats === 1 ? '' : 's'} removed` : ''}.` };
  } else if (e === 'docx') {
    const d = docxToMarkdown(data, o);
    r = { markdown: d.markdown, before: tokens(d.raw), kind: 'Word', note: 'Headings, lists and bold kept.' };
  } else if (e === 'html' || e === 'htm') {
    const html = new TextDecoder().decode(data);
    const h = htmlToMarkdown(html, o);
    r = { markdown: h.markdown, before: tokens(html), kind: 'Web page', note: 'Menus, scripts, styles and footers removed.' };
  } else if (e === 'zip') {
    onProgress('Reading the ZIP…');
    const z = await repoToMarkdown(file, data, o);
    r = { ...z, kind: 'Code folder' };
  } else if (isText(data)) {
    const src = new TextDecoder().decode(data);
    const code = !!commentStyle(e) && e !== 'md' && e !== 'html';
    r = { markdown: code ? codeBlock(file.name, src, o) : tidy(src, o), before: tokens(src), kind: code ? 'Code' : 'Text', note: '' };
  } else throw new Error('UNSUPPORTED');
  return { ...r, after: tokens(r.markdown) };
}

export function pruneText(text: string, o: PruneOptions): PruneResult {
  const looksHtml = /^\s*<(!doctype|html|body|div|p|article)\b/i.test(text);
  const markdown = looksHtml ? htmlToMarkdown(text, o).markdown : tidy(text, o);
  return { markdown, before: tokens(text), after: tokens(markdown), kind: looksHtml ? 'Web page' : 'Text', note: '' };
}

export async function warmUp() {
  const { loadPdfJs } = await import('../compress/pdf');
  await Promise.all([loadPdfJs(), import('./pdf')]);
}
