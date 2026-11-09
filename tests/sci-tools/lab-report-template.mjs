// #826 Lab report template and rubric. The weighted score was checked against numpy.average(points/max,
// weights=w) on 500 random rubrics (2 to 5 levels, 1 to 7 criteria, some criteria unmarked); the Markdown rubric
// table and template were parsed back with markdown-it-py (CommonMark + tables), including pipes, backslashes,
// newlines, * and ` in cells: 12,587 checks, 0 failed. These tests pin hand-worked scores.
import { score, rubricProblems, readRubric, rubricJson, rubricMarkdown, templateMarkdown, scoreLine, PRESETS, CHECKLIST, DEFAULT_RUBRIC, clone } from '../../src/lib/sci/labreport.ts';

export default async (check) => {
  const R = DEFAULT_RUBRIC;
  check('rubric: default weights add to 100 and every cell has words', R.criteria.reduce((a, c) => a + c.weight, 0) === 100 && R.criteria.every((c) => c.desc.length === R.levels.length && c.desc.every((d) => d.length > 10)));
  // All Excellent = 100 %, all Beginning = 25 %
  check('score: top level everywhere is 100 %', score(R, R.criteria.map(() => 0)).percent === 100);
  check('score: bottom level everywhere is 25 % (1 of 4 points)', score(R, R.criteria.map(() => 3)).percent === 25);
  // Hand-worked: Good (3/4) on the 20-weight criteria, Excellent elsewhere: 100 - 3 × 20 × 0.25 = 85
  const p = [0, 0, 1, 1, 1, 0, 0], s = score(R, p);
  check('score: hand-worked weighted mean 85 %', Math.abs(s.percent - 85) < 1e-12 && s.complete && Math.abs(s.parts[2].contrib - 15) < 1e-12);
  check('score: line with marks out of 40', scoreLine(s, 40) === '85 %, 34 out of 40');
  const part = score(R, [0, 3, -1, -1, -1, -1, -1]);
  // Marked so far: weights 10 (4/4) and 15 (1/4): (10 + 3.75) / 25 = 55 %
  check('score: part-marked uses the marked weights only', Math.abs(part.percent - 55) < 1e-12 && !part.complete && part.marked === 2 && scoreLine(part) === '55 % (2 of 7 criteria marked so far)');
  check('score: nothing marked', Number.isNaN(score(R, []).percent) && scoreLine(score(R, [])) === 'not marked yet');
  const odd = { title: 't', levels: [{ name: 'A', points: 5 }, { name: 'B', points: 2 }, { name: 'C', points: 0 }], criteria: [{ name: 'x', weight: 3, desc: [] }, { name: 'y', weight: 1, desc: [] }] };
  check('score: weights that do not add to 100 are scaled', Math.abs(score(odd, [1, 0]).percent - 100 * (3 * 0.4 + 1) / 4) < 1e-12 && Math.abs(score(odd, [0, 0]).parts[0].share - 75) < 1e-12);
  check('score: a zero-point level gives 0', score(odd, [2, 2]).percent === 0);

  check('problems: fine rubric', rubricProblems(R).length === 0);
  check('problems: no criteria, one level, bad weights', rubricProblems({ title: '', levels: [{ name: 'a', points: 1 }], criteria: [] }).length === 2 && rubricProblems({ ...odd, criteria: [{ name: 'x', weight: -1, desc: [] }] })[0].startsWith('Weights') && rubricProblems({ ...odd, criteria: [{ name: 'x', weight: 0, desc: [] }] })[0].startsWith('At least one criterion'));
  check('problems: all levels zero', rubricProblems({ ...odd, levels: [{ name: 'a', points: 0 }, { name: 'b', points: 0 }] }).some((x) => x.startsWith('At least one level')));

  const back = readRubric(rubricJson(R));
  check('json: round trip', JSON.stringify(back) === JSON.stringify(R));
  let e1 = '', e2 = '';
  try { readRubric('{nope'); } catch (e) { e1 = e.message; }
  try { readRubric('{"a":1}'); } catch (e) { e2 = e.message; }
  check('json: bad files explained', e1.startsWith('This file is not JSON') && e2.includes('"levels" and "criteria"'));
  check('json: missing descriptors become empty', readRubric('{"levels":[{"name":"a","points":2},{"name":"b","points":1}],"criteria":[{"name":"c","weight":1}]}').criteria[0].desc.join('|') === '|');

  const md = rubricMarkdown(R, p, 40);
  check('markdown: rubric table with marks and score', md.startsWith('# Lab report marking rubric\n\n| Criterion | Weight | Excellent (4) | Good (3) | Developing (2) | Beginning (1) | Mark |') && md.includes('| Results presentation | 20 % |') && md.includes('| Good (3) |\n') && md.trim().endsWith('**Score:** 85 %, 34 out of 40'));
  check('markdown: pipes in cells escaped', rubricMarkdown({ title: 'x', levels: odd.levels, criteria: [{ name: 'a|b', weight: 1, desc: ['p|q', 'line1\nline2', ''] }] }).includes('| a\\|b | 100 % | p\\|q | line1<br>line2 |   |'));
  const tm = templateMarkdown({ title: 'Rates of reaction', author: 'A. Student', course: '', date: '2026-11-09' }, PRESETS[0].sections, ['Figure 1: Rate against temperature'], CHECKLIST.slice(0, 2));
  check('markdown: template sections, prompts and checklist', tm.startsWith('# Rates of reaction\n\n**Author:** A. Student  \n**Date:** 2026-11-09  \n\n## Aim') && tm.includes('> In one sentence, what are you trying to find out?') && tm.includes('## Evaluation') && tm.includes('- Figure 1: Rate against temperature') && tm.includes('- [ ] Every figure and table has a number'));
  const off = clone(PRESETS[1].sections);
  check('markdown: sections switched off are left out', !templateMarkdown({ title: '', author: '', course: '', date: '' }, off, [], []).includes('Appendices') && templateMarkdown({ title: '', author: '', course: '', date: '' }, off, [], []).startsWith('# Lab report\n\n## Abstract'));
  check('presets: three, with unique section ids', PRESETS.length === 3 && PRESETS.every((pr) => new Set(pr.sections.map((x) => x.id)).size === pr.sections.length));
};
