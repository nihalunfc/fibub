// Rewrites public/learn-kit/ncert/problems/index.js and figs list checks: one import per chapter problem file.
// Run after adding a file to public/learn-kit/ncert/problems/: node scripts/ncert-index.mjs
import { readdirSync, writeFileSync } from 'node:fs';
const dir = new URL('../public/learn-kit/ncert/problems/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'index.js' && !f.startsWith('_')).sort();
const v = (f) => 'p_' + f.replace(/\.js$/, '').replace(/[^a-z0-9]/gi, '_');
writeFileSync(new URL('index.js', dir), `// Chapter problems for the NCERT study courses, one file per chapter (made by scripts/ncert-index.mjs; do not edit).
${files.map((f) => `import ${v(f)} from './${f}';`).join('\n')}

export default { ${files.map(v).map((x) => `...${x}`).join(', ')} };
`);
console.log(`ncert problems index: ${files.length} files`);

// Question banks of the NCERT courses: public/qbank/ncert-<class>-<subject>/index.js lists every chapter file
// (each topic file carries `name` and `n`, its chapter number, so the list follows the book).
import { readdirSync as ls, existsSync } from 'node:fs';
const qroot = new URL('../public/qbank/', import.meta.url);
const NAMES = { science: 'Science', maths: 'Maths', physics: 'Physics', chemistry: 'Chemistry', biology: 'Biology' };
for (const bank of ls(qroot).filter((d) => d.startsWith('ncert-'))) {
  const dir = new URL(`${bank}/`, qroot);
  const topics = [];
  for (const f of ls(dir).filter((f) => f.endsWith('.js') && f !== 'index.js' && !f.startsWith('_') && !f.includes('.gen.'))) {
    const t = (await import(new URL(f, dir))).default;
    topics.push({ id: t.topic, name: `${t.n}. ${t.name}`, n: t.n });
  }
  topics.sort((a, b) => a.n - b.n);
  const [, k, sub] = bank.match(/^ncert-class-(\d+)-(\w+)$/);
  const out = {
    id: bank, name: `Class ${k} ${NAMES[sub] ?? sub} (NCERT)`,
    exams: { board: 'Board exam (CBSE and state boards)' },
    units: [{ id: `class-${k}`, name: `Class ${k} ${NAMES[sub] ?? sub}`, topics: topics.map(({ id, name }) => ({ id, name })) }],
  };
  writeFileSync(new URL('index.js', dir), `// Question bank for the NCERT ${out.name} study course (made by scripts/ncert-index.mjs; do not edit).
// Format: /mnt/project-files/qbank/spec.md. All questions are original fibub work, not taken from NCERT books or past papers.
export default ${JSON.stringify(out, null, 2)};
`);
  console.log(`qbank ${bank}: ${topics.length} chapters`);
}
