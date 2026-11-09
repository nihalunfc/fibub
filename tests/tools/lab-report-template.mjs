// #826 lab report template and rubric
export const path = '/science/lab-report-template/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.lrt';
  await page.goto(`${BASE}/science/lab-report-template/`); await page.waitForTimeout(500);
  const secNames = () => page.$$eval(`${R} .lr-sec .lr-top input[type=text]`, (xs) => xs.map((x) => x.value));
  check((await secNames()).join(',') === 'Aim,Hypothesis,Variables,Equipment,Safety,Method,Results,Analysis,Conclusion,Evaluation', 'lab report: school sections');
  check((await page.textContent(`${R} .lr-big`)) === 'Choose a mark for each criterion.', 'lab report: nothing marked yet');
  const pick = async (i, v) => { await page.locator(`${R} .lr-pick`).nth(i).selectOption(v); };
  for (const [i, v] of [[0, '0'], [1, '0'], [2, '1'], [3, '1'], [4, '1'], [5, '0'], [6, '0']]) await pick(i, v);
  check((await page.textContent(`${R} .lr-big`)) === '85 %, 42.5 out of 50', `lab report: worked example score (${await page.textContent(`${R} .lr-big`)})`);
  { const rows = await page.$$eval(`${R} .lr-tab tbody tr`, (t) => t.map((r) => [...r.cells].map((c) => c.textContent))); check(rows.length === 7 && rows[2].join('|') === 'Results presentation|20 %|Good|3 / 4|15 %', 'lab report: score table'); }
  await page.fill(`${R} .lr-outof`, '40'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .lr-big`)) === '85 %, 34 out of 40', 'lab report: marks out of 40');
  // Markdown, Word and PDF of the marked rubric
  const dl = async (sel, name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + name; await d.saveAs(f); return [d.suggestedFilename(), readFileSync(f)]; };
  { const [n, b] = await dl(`${R} [data-doc=rubric] [data-f=md]`, 'lr-rubric.md'); const t = b.toString(); check(n === 'Lab-report-marking-rubric.md' && t.includes('| Criterion | Weight | Excellent (4) | Good (3) | Developing (2) | Beginning (1) | Mark |') && t.trim().endsWith('**Score:** 85 %, 34 out of 40'), 'lab report: rubric Markdown with marks'); }
  { const [n, b] = await dl(`${R} [data-doc=rubric] [data-f=docx]`, 'lr-rubric.docx'); check(n === 'Lab-report-marking-rubric.docx' && b[0] === 0x50 && b.length > 3000, 'lab report: rubric Word'); }
  { const [n, b] = await dl(`${R} [data-doc=rubric] [data-f=pdf]`, 'lr-rubric.pdf'); check(n === 'Lab-report-marking-rubric.pdf' && b.subarray(0, 5).toString() === '%PDF-', 'lab report: rubric PDF'); }
  // Part marking and clearing
  await page.click(`${R} .lr-clear`); await page.waitForTimeout(50);
  await pick(0, '0'); await pick(1, '3');
  check((await page.textContent(`${R} .lr-big`)) === '55 %, 22 out of 40 (2 of 7 criteria marked so far)', 'lab report: part-marked score');
  // Weights, levels and problems
  await page.fill(`${R} .lr-cr >> nth=1 >> input[type=number]`, '10'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .lr-big`)).startsWith('62.5 %'), 'lab report: weight change rescales');
  await page.fill(`${R} .lr-lv >> nth=0 >> input[type=number]`, '8'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .lr-big`)).startsWith('56.25 %') === false && (await page.textContent(`${R} .lr-big`)).startsWith('56.3 %') && (await page.locator(`${R} .lr-pick >> nth=0 >> option`).nth(1).textContent()) === 'Excellent (8)', 'lab report: level points change');
  await page.fill(`${R} .lr-lv >> nth=0 >> input[type=number]`, '4');
  await page.fill(`${R} .lr-cr >> nth=0 >> input[type=number]`, '-3'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .lr-rerr`)).startsWith('Weights must be') && (await page.textContent(`${R} .lr-big`)) === 'Fix the rubric to see a score.', 'lab report: bad weight message');
  await page.fill(`${R} .lr-cr >> nth=0 >> input[type=number]`, '10'); await page.waitForTimeout(50);
  check(await page.isHidden(`${R} .lr-rerr`), 'lab report: message clears');
  await page.click(`${R} .lr-add-lv`); await page.waitForTimeout(50);
  check((await page.locator(`${R} .lr-lv`).count()) === 5 && (await page.locator(`${R} .lr-cr >> nth=0 >> textarea`).count()) === 5, 'lab report: add a level');
  await page.click(`${R} .lr-lv >> nth=4 >> button`); await page.waitForTimeout(50);
  await page.fill(`${R} .lr-rtitle`, 'Chem 101 rubric');
  await page.click(`${R} .lr-add-cr`); await page.waitForTimeout(50);
  check((await page.locator(`${R} .lr-cr`).count()) === 8, 'lab report: add a criterion');
  await page.click(`${R} .lr-cr >> nth=7 >> button[aria-label^="Remove"]`); await page.waitForTimeout(50);
  // Save and reopen a rubric
  const [sn, sb] = await dl(`${R} .lr-save`, 'lr.json');
  const saved = JSON.parse(sb.toString());
  check(sn === 'Chem-101-rubric.json' && saved.criteria.length === 7 && saved.levels.length === 4 && saved.criteria[1].weight === 10, 'lab report: save rubric');
  await page.click(`${R} .lr-reset`); await page.waitForTimeout(50);
  check((await page.inputValue(`${R} .lr-rtitle`)) === 'Lab report marking rubric', 'lab report: start again');
  await page.setInputFiles(`${R} .lr-file`, { name: 'r.json', mimeType: 'application/json', buffer: sb }); await page.waitForTimeout(150);
  check((await page.inputValue(`${R} .lr-rtitle`)) === 'Chem 101 rubric' && (await page.inputValue(`${R} .lr-cr >> nth=1 >> input[type=number]`)) === '10', 'lab report: open a saved rubric');
  await page.setInputFiles(`${R} .lr-file`, { name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{"hello":1}') }); await page.waitForTimeout(150);
  check((await page.textContent(`${R} .lr-ferr`)).includes('"levels" and "criteria"'), 'lab report: wrong JSON refused');
  // Template: presets, editing, downloads
  await page.click(`${R} .lr-preset button[data-p=full]`); await page.waitForTimeout(50);
  check((await secNames())[0] === 'Abstract' && (await page.locator(`${R} .lr-sec.off`).count()) === 1, 'lab report: university preset (appendices off)');
  await page.click(`${R} .lr-sec >> nth=1 >> button[aria-label="Move Introduction up"]`); await page.waitForTimeout(50);
  check((await secNames()).slice(0, 2).join(',') === 'Introduction,Abstract', 'lab report: move a section');
  await page.uncheck(`${R} .lr-sec >> nth=1 >> input[type=checkbox]`);
  await page.click(`${R} .lr-add-sec`); await page.fill(`${R} .lr-sec >> nth=8 >> input[type=text]`, 'Data availability');
  await page.fill(`${R} .lr-sec >> nth=8 >> textarea`, 'Where the raw data are kept.');
  await page.fill(`${R} .lr-author`, 'A. Student'); await page.fill(`${R} .lr-date`, '2026-11-09');
  await page.uncheck(`${R} .lr-checks input >> nth=1`);
  { const [n, b] = await dl(`${R} [data-doc=template] [data-f=md]`, 'lr-template.md'); const t = b.toString();
    check(n === 'Rate-of-reaction-and-temperature-template.md' && t.startsWith('# Rate of reaction and temperature\n\n**Author:** A. Student  \n**Date:** 2026-11-09') && t.indexOf('## Introduction') < t.indexOf('## Materials') && !t.includes('## Abstract') && t.includes('## Data availability\n\n> Where the raw data are kept.') && t.includes('- Figure 1: Rate (1/time) against temperature') && !t.includes('Captions go below') && t.includes('- [ ] Every figure'), 'lab report: template Markdown'); }
  { const [n, b] = await dl(`${R} [data-doc=template] [data-f=docx]`, 'lr-template.docx'); check(n === 'Rate-of-reaction-and-temperature-template.docx' && b[0] === 0x50, 'lab report: template Word'); }
  { const [, b] = await dl(`${R} [data-doc=template] [data-f=pdf]`, 'lr-template.pdf'); check(b.subarray(0, 5).toString() === '%PDF-' && b.length > 2000, 'lab report: template PDF'); }
  await page.click(`${R} .lr-preset button[data-p=short]`); await page.waitForTimeout(50);
  check((await secNames()).join(',') === 'Aim,Method,Results,Conclusion', 'lab report: short preset');
};
