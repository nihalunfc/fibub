// Fails the build when a guide's [[tool-id]] link names a tool that is not live (missing, or status: soon).
// The link plugin (src/lib/autolink.mjs) throws on such a link, but Astro's content layer swallows that
// error and publishes the page with an empty guide, so this check runs before the build instead.
import { toolTerms, blogIds } from '../src/lib/autolink.mjs';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../src/tools/', import.meta.url).pathname;
const live = new Set(toolTerms().map((t) => t.id));
const bad = [];
for (const id of readdirSync(root)) {
  const f = join(root, id, 'guide.md');
  if (!existsSync(f)) continue;
  const body = readFileSync(f, 'utf8').split(/^---\s*$/m).slice(2).join('---');
  // Leave inline code alone: `[[1, 2], [3, 4]]` is a matrix, not a link.
  for (const m of body.replace(/`[^`\n]*`/g, '').matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)) {
    if (!live.has(m[1])) bad.push(`src/tools/${id}/guide.md: [[${m[1]}]] is not a live tool`);
  }
}
// Blog articles (src/blog/<kind>/<slug>.md): their [[tool-id]] and [[blog:<kind>/<slug>]] links, the
// `tools:` list, and the frontmatter every article needs. `node scripts/check-links.mjs <files>` checks
// just those articles (quick checks while writing).
const KINDS = ['guides', 'howto', 'together', 'kids', 'discoveries'];
const blogRoot = new URL('../src/blog/', import.meta.url).pathname;
const articles = blogIds();
const only = process.argv.slice(2).map((f) => f.replace(/^.*src\/blog\//, '').replace(/\.md$/, ''));
for (const id of only.length ? only : articles) {
  const f = join(blogRoot, `${id}.md`);
  if (!existsSync(f)) { bad.push(`src/blog/${id}.md: no such file`); continue; }
  const [, fm = '', ...rest] = readFileSync(f, 'utf8').split(/^---\s*$/m);
  const body = rest.join('---');
  const [kind, slug] = id.split('/');
  if (!KINDS.includes(kind)) bad.push(`src/blog/${id}.md: folder must be one of ${KINDS.join(', ')}`);
  if (KINDS.includes(slug)) bad.push(`src/blog/${id}.md: a slug may not be a kind name`);
  for (const k of ['title', 'summary', 'updated']) if (!new RegExp(`^${k}:\\s*\\S`, 'm').test(fm)) bad.push(`src/blog/${id}.md: frontmatter needs ${k}:`);
  const tools = (fm.match(/^tools:\s*\[([^\]]*)\]/m)?.[1] ?? '').match(/[a-z0-9-]+/g) ?? [];
  if (kind === 'guides' && !tools.length) bad.push(`src/blog/${id}.md: a guide needs tools: [<the tool it explains>, ...]`);
  if (kind === 'discoveries' && !/^paper:/m.test(fm)) bad.push(`src/blog/${id}.md: a discovery needs paper: (title, authors, journal, year, url, licence, reviewed)`);
  for (const t of tools) if (!live.has(t)) bad.push(`src/blog/${id}.md: tools lists "${t}", which is not a live tool`);
  for (const m of body.replace(/`[^`\n]*`/g, '').matchAll(/\[\[(blog:[a-z0-9-]+\/[a-z0-9-]+|[a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)) {
    if (m[1].startsWith('blog:') ? !articles.has(m[1].slice(5)) : !live.has(m[1])) bad.push(`src/blog/${id}.md: [[${m[1]}]] is not a ${m[1].startsWith('blog:') ? 'Blog article' : 'live tool'}`);
  }
}
if (bad.length) {
  console.error(`check-links: ${bad.length} link(s) to tools that are not live. Link a live tool instead, or remove the link.\n` + bad.join('\n'));
  process.exit(1);
}
console.log(`check-links: every [[...]] link points to one of ${live.size} live tools or ${articles.size} Blog articles`);
