// Runs every code cell in the pandas course with the same Python the browser uses (public/py/): each example
// must run without an error, and each exercise's solution must pass its check. Run: node tests/pandas-cells.mjs
// (optionally with lesson slugs to run only those).
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dir = `${root}src/courses/pandas/`, data = `${root}public/data/courses/pandas/`;
const only = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => f.endsWith('.md') && (!only.length || only.includes(f.replace(/\.md$/, ''))));

const { loadPyodide } = await import(`${root}public/py/pyodide.mjs`);
const py = await loadPyodide({ indexURL: `${root}public/py/` });
await py.loadPackage(['pandas'], { messageCallback: () => {} });
const runner = readFileSync(`${root}src/lib/py/worker.ts`, 'utf8').match(/String\.raw`([\s\S]*?)`;/)[1];
py.runPython(runner);
for (const f of readdirSync(data)) py.FS.writeFile(f, readFileSync(data + f));
const run = py.globals.get('_run');

let n = 0, bad = 0;
for (const f of files) {
  const md = readFileSync(dir + f, 'utf8');
  const blocks = [...md.matchAll(/^```(python|hint)([^\n]*)\n([\s\S]*?)^```$/gm)].map((m) => ({ lang: m[1], meta: m[2].trim().split(/\s+/), code: m[3].replace(/\n$/, '') }));
  const roleOf = (b) => (b.lang === 'hint' ? 'hint' : ['solution', 'check', 'setup'].find((r) => b.meta.includes(r)) ?? (b.meta.includes('exercise') ? 'exercise' : 'example'));
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i], r = roleOf(b);
    if (r !== 'example' && r !== 'exercise') continue;
    const parts = {};
    if (i > 0 && roleOf(blocks[i - 1]) === 'setup') parts.setup = blocks[i - 1].code;
    while (i + 1 < blocks.length && ['solution', 'check', 'hint', 'setup'].includes(roleOf(blocks[i + 1]))) { const nb = blocks[++i]; parts[roleOf(nb)] = nb.code; }
    const code = r === 'exercise' ? parts.solution : b.code;
    const out = JSON.parse(run(code, parts.setup ?? '', r === 'exercise' ? parts.check ?? '' : ''));
    n++;
    const wantErr = b.meta.includes('error');
    const fail = wantErr ? (out.error ? '' : 'expected an error (```python error) but it ran') : out.error ? `${out.error.type} on line ${out.error.line}: ${out.error.msg}` : out.ok === false ? `check failed: ${out.msg}` : '';
    if (fail) { bad++; console.log(`FAIL ${f} cell ${n} (${r}): ${fail}\n${code.split('\n').slice(0, 4).join('\n')}`); }
  }
}
console.log(`${n - bad}/${n} pandas cells ran cleanly in ${files.length} lessons`);
process.exit(bad ? 1 : 0);
