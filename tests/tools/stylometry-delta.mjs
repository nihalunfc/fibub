// #413 Stylometry: Burrows' Delta
export const path = '/science/stylometry-delta/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/stylometry-delta/`); await page.waitForTimeout(500);
  await page.click('.sty .sy-ex'); await page.waitForTimeout(300);
  check((await page.textContent('.sty .sy-big')) === 'Unsigned_note is closest to Brennan (mean Delta 0.784)', 'stylometry: example attributes the note to Brennan');
  { const t = await page.textContent('.sty .sy-atab'); check(t.includes('Brennan') && t.includes('0.784') && t.includes('1.227') && t.includes('1.253'), 'stylometry: author ranking table'); }
  check((await page.textContent('.sty .sy-facts')).includes('98 of 100') && (await page.textContent('.sty .sy-facts')).includes('Brennan_diary-one (0.764)'), 'stylometry: facts (words used, nearest text)');
  check(await page.isVisible('.sty .sy-fig') && (await page.getAttribute('.sty .sy-fig', 'aria-label')).includes('7 texts'), 'stylometry: heat map drawn');
  check((await page.textContent('.sty .sy-mtab')).includes('0.548'), 'stylometry: Delta matrix table');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sty .sy-csv')]); const f = OUT + 'sty.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 8 && rows[0].startsWith('text,Ashworth_letter-one') && rows[7].startsWith('Unsigned_note,1.194151'), 'stylometry: Delta matrix CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sty .sy-zcsv')]); const f = OUT + 'styz.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 99 && rows[0].startsWith('word,corpus_count,mean_pct,sd_pct,Ashworth_letter-one pct') && rows[1].startsWith('the,'), 'stylometry: word frequency and z-score CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sty .dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'stylometry: report image download'); }
  await page.selectOption('.sty .sy-dis', '-1'); await page.waitForTimeout(200);
  check((await page.textContent('.sty .sy-big')) === '7 texts by 4 authors, compared on 100 words' && await page.isHidden('.sty .sy-att'), 'stylometry: no disputed text compares all');
  await page.fill('.sty .sy-mfw', '30'); await page.waitForTimeout(600);
  check((await page.textContent('.sty .sy-big')).endsWith('compared on 30 words'), 'stylometry: fewer most frequent words');
  await page.fill('.sty .sy-mfw', '2'); await page.waitForTimeout(600);
  check((await page.textContent('.sty .sy-err')).includes('between 5 and 5000') && await page.isHidden('.sty .sy-out'), 'stylometry: bad word count message');
  await page.fill('.sty .sy-mfw', '100');
  await page.click('.sty .sy-clear'); await page.waitForTimeout(100);
  // Open three text files.
  const words = (seed) => Array.from({ length: 120 }, (_, i) => ['the', 'and', 'of', 'a', 'to', 'in', 'it', 'was', 'he', 'she'][(i * seed + i * i) % 10]).join(' ');
  for (const [k, s] of [['Alpha_one', 3], ['Alpha_two', 3], ['Beta_one', 7]]) writeFileSync(OUT + k + '.txt', words(s) + (k === 'Beta_one' ? ' she she she' : ' and of'));
  await page.setInputFiles('.sty .sy-file', ['Alpha_one', 'Alpha_two', 'Beta_one'].map((k) => OUT + k + '.txt')); await page.waitForTimeout(500);
  check((await page.textContent('.sty .sy-big')).startsWith('3 texts by 2 authors') && (await page.inputValue('.sty .sy-in')).includes('### Alpha_two'), 'stylometry: opened .txt files become texts');
  await page.fill('.sty .sy-in', '### A_one\nsome words here and there\n### B_two\nmore words'); await page.waitForTimeout(600);
  check((await page.textContent('.sty .sy-err')).includes('at least 3 texts'), 'stylometry: too few texts message');
  await page.fill('.sty .sy-in', '### A_one\nsome words\n### B_two\nmore words\n### C_x\nfew'); await page.waitForTimeout(600);
  check((await page.textContent('.sty .sy-err')).includes('fewer than 20 words'), 'stylometry: too short texts message');
};
