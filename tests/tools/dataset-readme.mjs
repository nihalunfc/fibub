// #819 dataset README builder
export const path = '/science/dataset-readme/';
export default async ({ page, check, OUT, readFileSync, writeFileSync, BASE }) => {
  await page.goto(`${BASE}/science/dataset-readme/`); await page.waitForTimeout(500);
  const R = '.rdm ';
  check((await page.textContent(R + '.rd-big')) === '11 of 12 parts filled in' && (await page.textContent(R + '.rd-check')).includes('○ ORCID iDs for authors'), 'rd: example checklist');
  { const t = await page.textContent(R + '.rd-prev'); check(t.includes('Rivera, A. & Okafor, C. (2026). Stream temperature') && t.includes('41.3 kB') && t.includes('3 files, 122 kB in all.'), 'rd: preview with citation and file sizes'); }
  check((await page.$$eval(R + '.rd-prev table', (t) => t.length)) === 2, 'rd: file and variable tables');
  await page.fill(R + '.rd-in[data-k=authors]', 'Ana Rivera; 0000-0002-1825-0098'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-big')).endsWith(', 1 to fix') && (await page.textContent(R + '.rd-probs')).includes('not a valid ORCID iD'), 'rd: bad ORCID flagged');
  await page.fill(R + '.rd-in[data-k=authors]', 'Ana Rivera; 0000-0002-1825-0097'); await page.fill(R + '.rd-in[data-k=dateEnd]', '2026-02-01'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-probs')).includes('end date is before the start') && (await page.textContent(R + '.rd-big')).startsWith('12 of 12'), 'rd: all parts, date order problem');
  await page.selectOption(R + '.rd-lic', 'CC0-1.0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-lichelp')).includes('give up your rights') && (await page.textContent(R + '.rd-prev')).includes('SPDX: CC0-1.0'), 'rd: licence chooser with explanation');
  await page.selectOption(R + '.rd-lic', 'other'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.rd-other') && (await page.textContent(R + '.rd-probs')).includes('no licence is written'), 'rd: custom licence needs text');
  await page.fill(R + '.rd-in[data-k=licenceOther]', 'Ask the authors'); await page.waitForTimeout(100);
  // Pick files: names and sizes only, descriptions kept.
  writeFileSync(OUT + 'site-a.csv', 'x'.repeat(1500)); writeFileSync(OUT + 'notes.txt', 'hi');
  await page.setInputFiles(R + '.rd-files', [OUT + 'site-a.csv', OUT + 'notes.txt']); await page.waitForTimeout(200);
  { const v = await page.inputValue(R + '.rd-in[data-k=files]'); check(v.includes('site-a.csv | 1500 | Hourly temperature, site A') && v.includes('notes.txt | 2') && v.split('\n').length === 4, `rd: picked files add names and sizes (${v.split('\n').join(' / ')})`); }
  check((await page.textContent(R + '.rd-prev')).includes('1.50 kB'), 'rd: picked size shown');
  await page.click(R + '.rd-view button[data-v=md]'); await page.waitForTimeout(100);
  { const s = await page.textContent(R + '.rd-src'); check(s.startsWith('# Stream temperature') && s.includes('| File | Size | Description |') && s.includes('site-\\<letter\\>.csv') && await page.isHidden(R + '.rd-prev'), 'rd: Markdown view'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rd-dmd')]); const f = OUT + 'README.md'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(d.suggestedFilename() === 'README.md' && t.includes('- **Licence:** Ask the authors') && t.trimEnd().endsWith('fibub.com.'), 'rd: README.md download'); }
  await page.click(R + '.rd-view button[data-v=txt]'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-src')).includes('GENERAL INFORMATION\n-------------------'), 'rd: plain text view');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rd-dtxt')]); const f = OUT + 'README.txt'; await d.saveAs(f); check(readFileSync(f, 'utf8').includes('Variable  Description'), 'rd: README.txt download'); }
  await page.click(R + '.rd-clear'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-big')) === '0 of 12 parts filled in' && (await page.textContent(R + '.rd-src')).startsWith('Untitled dataset'), 'rd: clear');
  await page.fill(R + '.rd-in[data-k=title]', 'My data'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-big')) === '1 of 12 parts filled in', 'rd: live update');
};
