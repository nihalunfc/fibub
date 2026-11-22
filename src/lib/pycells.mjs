// Runnable Python cells in course lessons (pandas course), turned into editor boxes at build time.
// Only for the courses listed in COURSES. The browser side is src/scripts/pycells.ts, which runs the code
// with Pyodide (self-hosted in public/py/, nothing leaves the device).
//
// In a lesson's Markdown:
//   ```python                      an example the reader can edit and run
//   ```python data=sales.csv       ... with files from public/data/courses/pandas/ ready to read
//   ```python exercise data=x.csv  an exercise: starter code, then optional blocks right after it:
//   ```python solution             shown by "Show answer"
//   ```python check                run after the reader's code in the same namespace (the last line's value
//                                  is in _); assert with a message the reader will see
//   ```hint                        plain text shown by "Hint"
//   ```python error                an example that is meant to fail (tests/pandas-cells.mjs expects an error)
//   ```python setup                hidden code run before the cell (for example, to build a DataFrame)
//   Add viz=<name> to an example or exercise to show a table animation for it (registered in pycells.ts).
const COURSES = ['/src/courses/pandas/'];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const meta = (m) => {
  const out = { flags: new Set(), kv: {} };
  for (const part of (m || '').split(/\s+/).filter(Boolean)) {
    const i = part.indexOf('=');
    if (i > 0) out.kv[part.slice(0, i)] = part.slice(i + 1).replace(/^["']|["']$/g, '');
    else out.flags.add(part);
  }
  return out;
};
const role = (c) => {
  if (c.type !== 'code') return null;
  if (c.lang === 'hint') return 'hint';
  if (c.lang !== 'python') return null;
  const m = meta(c.meta);
  for (const r of ['solution', 'check', 'setup']) if (m.flags.has(r)) return r;
  return m.flags.has('exercise') ? 'exercise' : 'example';
};
const tpl = (name, text) => (text ? `<template data-${name}>${esc(text)}</template>` : '');

function cell(main, parts, file) {
  const m = meta(main.meta), kind = role(main);
  if (kind === 'exercise' && !parts.solution) throw new Error(`${file}: an exercise needs a \`\`\`python solution block right after it`);
  const lines = main.value.split('\n').length;
  const attrs = [`data-kind="${kind}"`];
  if (m.kv.data) attrs.push(`data-files="${esc(m.kv.data)}"`);
  if (m.kv.viz) attrs.push(`data-viz="${esc(m.kv.viz)}"`);
  return `<div class="py" ${attrs.join(' ')}>` +
    `<div class="py-head"><span class="py-tag">${kind === 'exercise' ? 'Your turn' : 'Python'}</span>${m.kv.data ? `<span class="py-files">${esc(m.kv.data.split(',').map((f) => f.split('/').pop()).join(', '))}</span>` : ''}</div>` +
    `<textarea class="py-code" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off" rows="${Math.min(24, Math.max(2, lines))}" aria-label="Python code you can edit">${esc(main.value)}</textarea>` +
    tpl('start', main.value) + tpl('setup', parts.setup) + tpl('sol', parts.solution) + tpl('check', parts.check) + tpl('hint', parts.hint) +
    `<div class="py-btns"><button type="button" class="btn" data-run>Run</button>` +
    (kind === 'exercise' ? `${parts.check ? '<button type="button" class="btn secondary" data-check>Check</button>' : ''}${parts.hint ? '<button type="button" class="btn secondary" data-hint>Hint</button>' : ''}<button type="button" class="btn secondary" data-sol>Show answer</button>` : '') +
    `<button type="button" class="btn secondary" data-reset>Reset</button></div>` +
    `<div class="py-out" aria-live="polite"></div></div>`;
}

function walk(node, file) {
  if (!node.children) return;
  const kids = node.children, out = [];
  for (let i = 0; i < kids.length; i++) {
    const c = kids[i], r = role(c);
    if (r === 'example' || r === 'exercise') {
      const parts = {};
      // A setup block may come just before its cell.
      if (out.length && out[out.length - 1].__setup) parts.setup = out.pop().__setup;
      while (i + 1 < kids.length && ['solution', 'check', 'hint', 'setup'].includes(role(kids[i + 1]))) { const n = kids[++i]; parts[role(n)] = n.value; }
      out.push({ type: 'html', value: cell(c, parts, file) });
    } else if (r === 'setup') out.push({ type: 'html', value: '', __setup: c.value });
    else if (r) throw new Error(`${file}: a \`\`\`${c.lang} ${c.meta || ''} block must follow a python exercise`);
    else { walk(c, file); out.push(c); }
  }
  node.children = out.map((n) => (n.__setup !== undefined ? { type: 'html', value: '' } : n));
}

export default function remarkPycells() {
  return (tree, vfile) => {
    const path = (vfile.path || vfile.history?.[0] || '').replace(/\\/g, '/');
    if (!COURSES.some((c) => path.includes(c))) return;
    walk(tree, path);
  };
}
