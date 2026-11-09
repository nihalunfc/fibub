// #821 readability checker
export const path = '/science/readability-checker/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/readability-checker/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.rdc .rd-big');
  check((await big()) === 'Reading Ease 44.6 (difficult), about grade 11.4', 'readability: example scores');
  const tab = await page.textContent('.rdc .rd-tab');
  check(['10.5', '13.5', '12.8', '11.4', '9.0'].every((v) => tab.includes(v)), 'readability: six scores in the table');
  const facts = await page.textContent('.rdc .rd-facts');
  check(facts.includes('Sentences8') && facts.includes('Words112') && facts.includes('Syllables196') && facts.includes('Long sentences1') && facts.includes('Passive hints4'), 'readability: counts');
  check((await page.textContent('.rdc .rd-pill')) === 'Above your target of grade 8 by 3.4' && await page.isVisible('.rdc .rd-smog'), 'readability: target grade and the SMOG sample warning');
  check((await page.locator('.rdc .rd-view .rx-long').count()) === 1 && (await page.locator('.rdc .rd-view span.rx-pv').count()) >= 8 && (await page.locator('.rdc .rd-view .rx-hard').count()) === 23 && (await page.locator('.rdc .rd-view .rx-pl').count()) === 5, 'readability: marks in the text');
  check((await page.textContent('.rdc .rd-view')) === (await page.inputValue('.rdc .rd-text')), 'readability: marked view keeps the text exactly');
  check((await page.textContent('.rdc .rd-pvlist')) === '"are invited", "be asked", "be stored", "be anonymised"' && (await page.textContent('.rdc .rd-longlist')).startsWith('29 words: If you agree'), 'readability: passive and long-sentence lists');
  check((await page.textContent('.rdc .rd-pltab')).includes('discontinuestop1') && (await page.textContent('.rdc .rd-hardlist')).startsWith('diary (3, ×2)'), 'readability: plainer words and common long words');
  await page.fill('.rdc .rd-jargon', 'diary, anonymised'); await page.waitForTimeout(400);
  check((await page.locator('.rdc .rd-view .rx-jar').count()) === 3, 'readability: own jargon words marked');
  await page.fill('.rdc .rd-long', '15'); await page.fill('.rdc .rd-hard', '4'); await page.waitForTimeout(400);
  check((await page.locator('.rdc .rd-longlist li').count()) === 3 && (await page.locator('.rdc .rd-view .rx-hard').count()) === 13, 'readability: long-sentence and long-word settings');
  await page.fill('.rdc .rd-target', '12'); await page.waitForTimeout(400);
  check((await page.textContent('.rdc .rd-pill')) === 'At or below your target of grade 12', 'readability: target met');
  await page.fill('.rdc .rd-target', ''); await page.waitForTimeout(400);
  check(await page.isHidden('.rdc .rd-pill'), 'readability: empty target hides the check');
  { const t = await page.inputValue('.rdc .rd-text'); await page.fill('.rdc .rd-text', t.replace(/^You are invited[^.]*\./, 'We are asking students to help with a study about sleep and exam marks.')); await page.waitForTimeout(400);
    check((await big()) === 'Reading Ease 59.8 (fairly difficult), about grade 9.1', `readability: guide's rewrite (${await big()})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rdc .rd-csv')]); const f = OUT + 'rd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').replace(/^﻿/, '').trim().split('\r\n');
    check(rows.length === 9 && rows[0] === 'sentence,words,syllables,words_3plus_syllables,long,passive_hints,text' && rows[1].startsWith('1,14,19,0,no,,We are asking'), 'readability: sentences CSV'); }
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.rdc .dl [data-f=${f}]`)]); const p = OUT + 'rd.' + f; await d.saveAs(p); check(readFileSync(p).length > 2000, `readability: ${f} download`); }
  // Lines: a list without full stops.
  await page.fill('.rdc .rd-text', 'What happens\nYou fill in a diary\nYou wear a monitor'); await page.waitForTimeout(400);
  check((await page.textContent('.rdc .rd-facts')).includes('Sentences3'), 'readability: each line a sentence');
  await page.uncheck('.rdc .rd-lines'); await page.waitForTimeout(200);
  check((await page.textContent('.rdc .rd-facts')).includes('Sentences1'), 'readability: lines joined for PDF text');
  writeFileSync(OUT + 'rd.txt', '﻿The cat sat. The dog ran.'); await page.setInputFiles('.rdc .rd-file', OUT + 'rd.txt'); await page.waitForTimeout(400);
  check((await page.textContent('.rdc .rd-note')).includes('Opened rd.txt: 25 characters') && (await page.textContent('.rdc .rd-facts')).includes('Words6'), 'readability: opens a text file');
  writeFileSync(OUT + 'rd.docx', 'PK'); await page.setInputFiles('.rdc .rd-file', OUT + 'rd.docx'); await page.waitForTimeout(200);
  check((await page.textContent('.rdc .rd-err')).includes('not plain text'), 'readability: Word file refused with a message');
  await page.fill('.rdc .rd-text', '— … !!'); await page.waitForTimeout(400);
  check((await page.textContent('.rdc .rd-err')) === 'No words found. Paste some English text.' && await page.isHidden('.rdc .rd-out'), 'readability: no words message');
  await page.click('.rdc .rd-clear'); await page.waitForTimeout(100);
  check(await page.isHidden('.rdc .rd-out') && await page.isHidden('.rdc .rd-err'), 'readability: clear');
  await page.fill('.rdc .rd-word', 'beautiful readability'); 
  check((await page.textContent('.rdc .rd-sylout')) === 'beautiful: 3, readability: 5 (total 8)', 'readability: syllable counter');
  await page.click('.rdc .rd-ex'); await page.waitForTimeout(300);
  check((await big()).startsWith('Reading Ease 44.6'), 'readability: example again');
};
