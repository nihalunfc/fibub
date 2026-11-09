// #820 data management plan: word counts (checked against Python: len of str.split() tokens holding a letter or
// digit) and the Markdown round trip.
import { countWords, summarise, toMarkdown, fromMarkdown, examplePlan, emptyPlan, DMP_SECTIONS } from '../../src/lib/sci/dmp.ts';
export default async (check) => {
  const p = examplePlan();
  const want = { data: 81, docs: 45, storage: 39, ethics: 49, sharing: 40, preservation: 31, roles: 27, costs: 27 };
  check('dmp: word counts per section match Python', Object.entries(want).every(([k, v]) => countWords(p.texts[k]) === v));
  check('dmp: dashes, dots and underscores alone are not words; long-term is one', countWords('Ünïcode café — 3.5 GB; long-term —  -- x_y 42 ...') === 7 && countWords('') === 0 && countWords('  \n ') === 0);
  const s = summarise(p);
  check('dmp: summary totals, filled and over-limit sections', s.total === 339 && s.filled === 8 && s.over === 0 && s.rows[0].limit === 120 && s.rows[0].status === 'ok');
  p.limits.ethics = 40;
  check('dmp: a section over its word limit is flagged', summarise(p).over === 1 && summarise(p).rows.find((r) => r.id === 'ethics').status === 'over');
  check('dmp: eight generic sections with guiding questions', DMP_SECTIONS.length === 8 && DMP_SECTIONS.every((x) => x.prompts.length >= 4));
  const md = toMarkdown(p);
  check('dmp: Markdown has the title, details and a heading per section', md.startsWith('# Soil life in city allotment gardens') && md.includes('- **Prepared by:** A. Researcher') && DMP_SECTIONS.every((x) => md.includes(`\n## ${x.title}\n`)));
  const back = fromMarkdown(md);
  check('dmp: Markdown reads back to the same plan', back.matched === 8 && back.plan.title === p.title && back.plan.author === p.author && back.plan.funder === p.funder && back.plan.date === p.date && DMP_SECTIONS.every((x) => back.plan.texts[x.id] === p.texts[x.id].trim()));
  const e = emptyPlan(); e.texts.costs = 'Only this.';
  const md2 = toMarkdown(e), b2 = fromMarkdown(md2);
  check('dmp: empty sections are marked and read back as empty', md2.includes('_Not written yet._') && b2.plan.texts.data === '' && b2.plan.texts.costs === 'Only this.' && md2.startsWith('# Data management plan'));
  const b3 = fromMarkdown('# X\r\n\r\n## data description\r\nHello there\r\n## Budget notes\r\nnope\r\n');
  check('dmp: headings matched loosely, unknown headings reported, Windows line ends', b3.matched === 1 && b3.plan.texts.data === 'Hello there' && b3.unknown[0] === 'Budget notes' && b3.plan.title === 'X');
};
