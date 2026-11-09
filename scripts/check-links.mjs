// Fails the build when a guide's [[tool-id]] link names a tool that is not live (missing, or status: soon).
// The link plugin (src/lib/autolink.mjs) throws on such a link, but Astro's content layer swallows that
// error and publishes the page with an empty guide, so this check runs before the build instead.
import { toolTerms } from '../src/lib/autolink.mjs';
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
if (bad.length) {
  console.error(`check-links: ${bad.length} link(s) to tools that are not live. Link a live tool instead, or remove the link.\n` + bad.join('\n'));
  process.exit(1);
}
console.log(`check-links: every [[...]] link points to one of ${live.size} live tools`);
