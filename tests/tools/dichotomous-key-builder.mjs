// #321 dichotomous key builder
export const path = '/science/dichotomous-key-builder/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.dkb ';
  const big = () => page.textContent(R + '.dk-big'), issues = () => page.textContent(R + '.dk-issues');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await big()) === 'The key checks out: no loops, dead ends or unreached parts', `key: example checks out (${await big()})`);
  { const f = await page.textContent(R + '.dk-facts'); check(f.includes('Couplets6') && f.includes('Taxa reached7') && f.includes('4 steps') && f.includes('mean 3.0'), 'key: facts'); }
  check((await page.textContent(R + '.dk-paths')).includes('1b → 3b → 5b → 6a'), 'key: path table');
  // Play it.
  check((await page.textContent(R + '.dk-q')) === 'Couplet 1: which fits your specimen?', 'key: play starts at couplet 1');
  await page.click(R + '.dk-choices button[data-label="1b"]'); await page.click(R + '.dk-choices button[data-label="3b"]'); await page.click(R + '.dk-choices button[data-label="5a"]');
  check((await page.textContent(R + '.dk-res')) === 'Butterflies and moths (Lepidoptera)' && (await page.textContent(R + '.dk-trail')).includes('1b → 3b → 5a'), 'key: play reaches a taxon');
  await page.click(R + '.dk-back'); await page.click(R + '.dk-choices button[data-label="5b"]');
  check((await page.textContent(R + '.dk-q')) === 'Couplet 6: which fits your specimen?', 'key: back undoes a choice');
  await page.click(R + '.dk-again');
  check((await page.textContent(R + '.dk-trail')) === '' && (await page.textContent(R + '.dk-q')).startsWith('Couplet 1'), 'key: start again');
  // Expected taxa.
  await page.fill(R + '.dk-expect', 'Beetles (Coleoptera)\nMayflies (Ephemeroptera)'); await page.waitForTimeout(400);
  check((await issues()).includes('never reaches: Mayflies (Ephemeroptera)') && (await big()).startsWith('1 problem to fix'), 'key: missing expected taxon');
  await page.fill(R + '.dk-expect', ''); await page.waitForTimeout(300);
  // Downloads: JSON, printable text, report.
  let jsonFile = OUT + 'key.json';
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dk-json')]); await d.saveAs(jsonFile); const j = JSON.parse(readFileSync(jsonFile, 'utf8'));
    check(d.suggestedFilename().startsWith('Simplified-key') && j.format === 'fibub-dichotomous-key' && j.couplets.length === 6 && j.couplets[1].leads[0].to === 'Beetles (Coleoptera)', 'key: JSON download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dk-txt')]); const f = OUT + 'key.txt'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.startsWith('Simplified key') && t.includes('1a.  Front wings') && /\.{3,} 2\n/.test(t) && t.includes('Beetles (Coleoptera)'), 'key: printable text'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check(d.suggestedFilename().endsWith('.docx'), 'key: Word report'); }
  // Break it: a loop, a dead end, an unreached couplet, a line with no destination.
  const text = await page.inputValue(R + '.dk-text');
  await page.fill(R + '.dk-text', text.replace('... True bugs (Hemiptera)', '... 2').replace('6b. Long slender abdomen; very short antennae; both pairs of wings about the same size ... Dragonflies and damselflies (Odonata)', '6b. Long slender abdomen ... 9\n7a. Orphan ... Ghost\n7b. Orphan two\n')); await page.waitForTimeout(400);
  { const t = await issues(); check(t.includes('Loop: 2 → 4 → 2') && t.includes('lead 6b goes to couplet 9') && t.includes('Couplet 7 cannot be reached') && t.includes('Unreached taxa: Ghost') && t.includes('Line 15') && t.includes('only one lead'), `key: broken key found (${t})`); }
  check(await page.isVisible(R + '.dk-issues li.error') && (await big()).includes('problems to fix'), 'key: errors shown');
  await page.click(R + '.dk-again'); await page.click(R + '.dk-choices button[data-label="1a"]'); await page.click(R + '.dk-choices button[data-label="2b"]'); await page.click(R + '.dk-choices button[data-label="4b"]');
  check((await page.textContent(R + '.dk-q')).includes('the key loops'), 'key: playing into the loop says so');
  // Add a couplet; open the saved JSON back; a bad file.
  await page.fill(R + '.dk-text', '1a. Red ... A\n1b. Blue ... B'); await page.waitForTimeout(300); await page.click(R + '.dk-add'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.dk-text')).includes('2a. Describe the first choice') && (await issues()).includes('Couplet 2 cannot be reached'), 'key: add a couplet');
  await page.setInputFiles(R + '.dk-file', jsonFile); await page.waitForTimeout(400);
  check((await page.textContent(R + '.dk-note')).includes('6 couplets') && (await big()).startsWith('The key checks out'), 'key: open a saved JSON key');
  writeFileSync(OUT + 'bad.json', '{"hello": 1}');
  await page.setInputFiles(R + '.dk-file', OUT + 'bad.json'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.dk-perr')).includes('not a key file'), 'key: bad JSON file message');
  writeFileSync(OUT + 'bad2.json', 'not json');
  await page.setInputFiles(R + '.dk-file', OUT + 'bad2.json'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.dk-perr')).includes('not valid JSON'), 'key: not JSON message');
};
