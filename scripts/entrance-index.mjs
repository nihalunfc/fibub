// Writes public/qbank/entrance-<subject>/index.js from the chapter maps in src/data/entrance.ts, listing only the
// chapters whose question file exists (the shared check, tests/qbank.mjs, fails on a listed topic with no file).
// Run after adding a chapter's questions: node scripts/entrance-index.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// SKIP=a,b leaves chapters out (e.g. question files still being written).
const SKIP = new Set((process.env.SKIP || '').split(',').filter(Boolean));
const src = readFileSync('src/data/entrance.ts', 'utf8');
const SUBJ = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Mathematics', biology: 'Biology' };
const ALL = { keam: 'KEAM', cusat: 'CUSAT CAT', comedk: 'COMEDK UGET', 'jee-main': 'JEE Main', 'jee-adv': 'JEE Advanced', neet: 'NEET UG', cuet: 'CUET (UG)' };
for (const s of Object.keys(SUBJ)) {
  const block = src.split(`\n  ${s}: [`)[1].split('\n  ],')[0];
  const chapters = [...block.matchAll(/id: '([a-z0-9-]+)', name: (['"])((?:\\.|(?!\2).)*)\2, cls: (\d+)/g)].map((m) => ({ id: m[1], name: m[3].replace(/\\'/g, "'"), cls: +m[4] }));
  const dir = `public/qbank/entrance-${s}`;
  const have = chapters.filter((c) => existsSync(`${dir}/${c.id}.js`) && !SKIP.has(c.id));
  const exams = Object.fromEntries(Object.entries(ALL).filter(([k]) => (s === 'biology' ? k === 'neet' || k === 'cuet' : s === 'maths' ? k !== 'neet' : true)));
  const units = [11, 12].map((c) => ({ id: `class-${c}`, name: `Class ${c}`, topics: have.filter((x) => x.cls === c).map(({ id, name }) => ({ id, name })) })).filter((u) => u.topics.length);
  const course = s === 'biology' ? 'medical' : 'engineering';
  writeFileSync(`${dir}/index.js`, `// Question bank: ${SUBJ[s]} for the Plus Two entrance courses (fibub /learn/courses/${course}-entrance/).
// Written by scripts/entrance-index.mjs from src/data/entrance.ts: only chapters with a question file are listed.
// Format: /mnt/project-files/qbank/spec.md. All questions are original fibub work.
// Levels: 1 warm-up (board), 2 standard (KEAM, CUSAT, COMEDK), 3 exam (JEE Main, NEET), 4 hard (top JEE Main and NEET), 5 top-rank (JEE Advanced).
export default ${JSON.stringify({ id: `entrance-${s}`, name: `${SUBJ[s]} (Plus Two entrance)`, exams, units }, null, 2)};
`);
  console.log(`${s}: ${have.length} of ${chapters.length} chapters have questions`);
}
