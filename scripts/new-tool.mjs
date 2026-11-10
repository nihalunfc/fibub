#!/usr/bin/env node
// Scaffold a new tool so builders only write what is specific to it.
//   npm run new-tool -- <id> --name "Lens lab" --shelf learn --section school-physics [--num 1234 | --from 1211 --to 1240] [--related a,b,c] [--engine learn|plain]
// --engine learn (the default on the learn shelf): a Class level switch, a canvas and a "Check yourself" quiz wired to
// src/lib/learn/quiz.ts and src/lib/learn/sim.ts, so a builder writes only the drawing, the maths and the questions.
// Writes src/tools/<id>/guide.md, src/tools/<id>/Tool.astro and tests/tools/<id>.mjs (tests are picked up automatically).
// Every TODO must be replaced before the tool's PR; `npm test` and the build catch most that are left.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith('--'));
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const die = (m) => { console.error('new-tool: ' + m); process.exit(1); };

if (!id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) die('give a tool id in kebab-case, e.g. lens-ray-diagram');
const dir = `src/tools/${id}`;
if (existsSync(dir)) die(`${dir} already exists`);

const nums = new Set();
for (const t of readdirSync('src/tools')) {
  const g = `src/tools/${t}/guide.md`;
  if (!existsSync(g)) continue;
  const m = readFileSync(g, 'utf8').match(/^num:\s*(\d+)/m);
  if (m) nums.add(+m[1]);
}
let num = opt('num') ? +opt('num') : 0;
if (num && nums.has(num)) die(`#${num} is already used`);
if (!num) {
  const from = +opt('from', 0), to = +opt('to', 0);
  if (!from) die('give --num, or --from/--to for your number block');
  for (let n = from; n <= (to || from + 999); n++) if (!nums.has(n)) { num = n; break; }
  if (!num) die(`no free number in ${from}-${to}`);
}

const shelf = opt('shelf', 'learn');
const section = opt('section', '');
const name = opt('name', 'TODO name');
const related = (opt('related', '') || '').split(',').filter(Boolean);
const cls = id.split('-').map((w) => w[0]).join('').slice(0, 4) || 't';
const today = new Date().toISOString().slice(0, 10);
const base = shelf === 'learn' ? 'learn' : shelf;

mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/guide.md`, `---
name: ${name}
num: ${num}
shelf: ${shelf}
${section ? `section: ${section}\n` : ''}title: "${name}: TODO what people search for"
summary: "TODO one or two plain sentences on what it does."
status: live
ads: false
order: ${num}
icon: ${opt('icon', 'sliders')}
works: offline
updated: ${today}
related: [${related.join(', ')}]
sources:
  - "TODO where the values and formulas come from. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Set" }
  - { icon: curve, label: "See" }
  - { icon: check, label: "Check" }
---

## What it does

TODO 2 short paragraphs. End this section with one sentence linking 2 or 3 tools for the step before or after, like ${related.slice(0, 2).map((r) => `[[${r}]]`).join(' and ') || '[[tool-id]]'}.

## How to use it

1. TODO

## What each setting does

- **TODO**: one line each.

## Worked example

TODO a short example with real numbers that the test also checks.

## FAQs

**TODO question?** Answer.
`);

const engine = opt('engine', shelf === 'learn' ? 'learn' : 'plain');
const learnUi = `---
// #${num} ${name}. Engine: src/lib/learn/ (quiz.ts, sim.ts). Maths in src/lib/sci/ with checks in tests/sci.mjs.
import '../../styles/astro.css';
import '../../styles/learnquiz-d.css';
---
<div class="tool-ui ax lrn ${cls}">
  <div class="ax-card">
    <div class="ax-seg" role="group" aria-label="Level"><button type="button" data-level="10" aria-pressed="true">Class 10</button><button type="button" data-level="11" aria-pressed="false">Class 11</button></div>
    <h2>TODO</h2>
    <canvas class="lrn-cv ${cls}-cv" aria-label="TODO describe the picture"></canvas>
    <div class="ax-grid" style="margin-top:10px">
      <label>TODO input <input class="${cls}-in" type="range" min="1" max="10" step="1" value="5" /></label>
    </div>
    <p class="ax-big ${cls}-out" aria-live="polite"></p>
    <p class="ax-help" data-only="11" hidden>TODO extra for Class 11, or delete.</p>
  </div>
  <div class="ax-card">
    <h2>Try this</h2>
    <ul><li>TODO two or three things to try.</li></ul>
  </div>
  <div class="ax-card ${cls}-quiz">
    <h2>Check yourself</h2>
  </div>
</div>

<style is:inline>
  .${cls} .${cls}-cv { width: 100%; }
</style>

<script>
  import { mountQuiz, pick, r } from '../../lib/learn/quiz';
  import { fitCanvas, wireLevel, pagePalette } from '../../lib/learn/sim';
  const root = document.querySelector('.${cls}') as HTMLElement;
  const input = root.querySelector('.${cls}-in') as HTMLInputElement;
  const out = root.querySelector('.${cls}-out') as HTMLElement;
  const cv = root.querySelector('.${cls}-cv') as HTMLCanvasElement;
  let level = '10';
  const draw = () => {
    const { ctx, W, H } = fitCanvas(cv, 220), pal = pagePalette();
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = pal.ink; ctx.fillText('TODO drawing', 10, 20);
    out.textContent = 'TODO result for ' + input.value;
  };
  input.addEventListener('input', draw);
  addEventListener('resize', draw);
  wireLevel(root, (l) => { level = l; draw(); });
  mountQuiz(root.querySelector('.${cls}-quiz') as HTMLElement, () => {
    const a = pick(2, 9);
    return [{ q: \`TODO question with \${a}\`, ans: a * 2, unit: '', work: \`TODO working: 2 × \${a} = \${r(a * 2)}\` }];
  });
</script>
`;
writeFileSync(`${dir}/Tool.astro`, engine === 'learn' ? learnUi : `---
// #${num} ${name}
---
<div class="tool-ui ${cls}">
  <label>TODO input <input class="${cls}-in" type="number" value="1" step="any" /></label>
  <p class="${cls}-out" aria-live="polite"></p>
</div>

<style is:inline>
  .${cls} { display: grid; gap: .75rem; }
</style>

<script>
  // Keep the maths in src/lib/ (or src/lib/sci/ for science) as plain TypeScript; import heavy libraries with import().
  const root = document.querySelector('.${cls}') as HTMLElement;
  const input = root.querySelector('.${cls}-in') as HTMLInputElement;
  const out = root.querySelector('.${cls}-out') as HTMLElement;
  const update = () => { out.textContent = 'TODO result for ' + input.value; };
  input.addEventListener('input', update);
  update();
</script>
`);

writeFileSync(`tests/tools/${id}.mjs`, `// #${num} ${name}
export const path = '/${base}/${id}/';
export default async ({ page, check, BASE }) => {
  await page.goto(\`\${BASE}/${base}/${id}/\`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.${cls} .${cls}-out')).length > 0, '${id}: shows a result');${engine === 'learn' ? `
  { const a = await page.getAttribute('.${cls} .lq-item', 'data-ans'); await page.fill('.${cls} .lq-in', a); await page.click('.${cls} .lq-check');
    check((await page.textContent('.${cls} .lq-fb')) === 'Right.', '${id}: quiz accepts the right answer'); }` : ''}
};
`);

console.log(`#${num} ${id}: wrote ${dir}/guide.md, ${dir}/Tool.astro, tests/tools/${id}.mjs
Next: fill the TODOs, run \`PORT=<port> node tests/one.mjs ${id}\`, then \`npm run images\` for public/og/${id}.png.`);
