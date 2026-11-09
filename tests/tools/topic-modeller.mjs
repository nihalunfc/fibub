// #414 Topic modelling (LDA)
export const path = '/science/topic-modeller/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const done = (s = 'Done') => page.waitForFunction((s) => document.querySelector('.tpm .tm-prog').textContent.startsWith(s), s, { timeout: 30000 });
  await page.goto(`${BASE}/science/topic-modeller/`); await page.waitForTimeout(500);
  await page.click('.tpm .tm-ex'); await done();
  check((await page.textContent('.tpm .tm-big')) === '3 topics in 15 documents' && (await page.textContent('.tpm .tm-prog')) === 'Done: 500 sweeps.', 'lda: example runs 500 sweeps');
  { const t = await page.textContent('.tpm .tm-ttab'); check(t.includes('barley, farmers') && t.includes('harbour, sailors') && t.includes('choir, sang'), 'lda: example finds the three planted themes'); }
  { const f = await page.textContent('.tpm .tm-facts'); check(f.includes('Perplexity15.69') && f.includes('Distinct words42') && f.includes('228 common or short, 106 rare'), `lda: facts (perplexity, words) ${f}`); }
  check((await page.textContent('.tpm .tm-dtab')).includes('Note 12') && await page.isVisible('.tpm .tm-fig') && await page.isVisible('.tpm .tm-cfig'), 'lda: document table and both figures');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tpm .tm-csv')]); const f = OUT + 'lda.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 31 && rows[0] === 'topic,rank,word,probability' && rows[1].startsWith('1,1,barley,'), 'lda: topic words CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tpm .tm-dcsv')]); const f = OUT + 'ldad.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 16 && rows[0] === 'document,words,topic_1,topic_2,topic_3' && rows.slice(1).every((r) => Math.abs(r.split(',').slice(2).reduce((a, b) => a + Number(b), 0) - 1) < 1e-4), 'lda: document topics CSV rows sum to 1'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tpm .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'lda: report PDF download'); }
  const first = await page.textContent('.tpm .tm-ttab');
  await page.click('.tpm .tm-run'); await done();
  check((await page.textContent('.tpm .tm-ttab')) === first, 'lda: same seed, same topics');
  await page.fill('.tpm .tm-k', '2'); await page.fill('.tpm .tm-it', '50'); await page.fill('.tpm .tm-seed', '9'); await page.fill('.tpm .tm-top', '5'); await page.fill('.tpm .tm-a', '0.5'); await page.fill('.tpm .tm-b', '0.1');
  await page.click('.tpm .tm-run'); await done('Done: 50 sweeps.');
  check((await page.textContent('.tpm .tm-big')) === '2 topics in 15 documents' && (await page.$$('.tpm .tm-ttab tr')).length === 3 && (await page.textContent('.tpm .tm-ttab tr:nth-child(2) td:nth-child(2)')).split(', ').length === 5, 'lda: 2 topics, 5 words each, other seed and priors');
  await page.fill('.tpm .tm-extra', 'barley, harbour'); await page.uncheck('.tpm .tm-stop'); await page.fill('.tpm .tm-min', '2'); await page.fill('.tpm .tm-rare', '1');
  await page.click('.tpm .tm-run'); await done();
  { const t = await page.textContent('.tpm .tm-ttab'); const f = await page.textContent('.tpm .tm-facts'); check(!t.includes('barley') && !t.includes('harbour') && f.includes(', 0 rare'), `lda: extra stop words, common and rare words kept ${f}`); }
  await page.fill('.tpm .tm-k', '40'); await page.click('.tpm .tm-run'); await page.waitForTimeout(100);
  check((await page.textContent('.tpm .tm-err')).includes('between 2 and 30') && await page.isHidden('.tpm .tm-out'), 'lda: bad topic count message');
  await page.fill('.tpm .tm-k', '3'); await page.fill('.tpm .tm-rare', '2'); await page.check('.tpm .tm-stop');
  await page.fill('.tpm .tm-in', 'the cat\n\nthe dog'); await page.click('.tpm .tm-run'); await page.waitForTimeout(100);
  check((await page.textContent('.tpm .tm-err')).includes('words are left'), 'lda: too little text message');
  await page.click('.tpm .tm-clear');
  for (const [k, w] of [['a', 'river boat river boat fish fish net net river boat'], ['b', 'wheat field wheat field plough plough wheat field barn barn'], ['c', 'river fish boat net wheat plough field barn river field']]) writeFileSync(OUT + `lda-${k}.txt`, w);
  await page.setInputFiles('.tpm .tm-file', ['a', 'b', 'c'].map((k) => OUT + `lda-${k}.txt`)); await page.waitForTimeout(300);
  check((await page.inputValue('.tpm .tm-in')).includes('### lda-b') && (await page.textContent('.tpm .tm-prog')).startsWith('Added 3 files'), 'lda: opened files become documents');
  await page.fill('.tpm .tm-k', '2'); await page.click('.tpm .tm-run'); await done();
  check((await page.textContent('.tpm .tm-big')) === '2 topics in 3 documents', 'lda: topics from opened files');
};
