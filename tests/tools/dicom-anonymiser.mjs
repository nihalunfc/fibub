// #483 DICOM anonymiser: sample, options, before/after, downloads (file, ZIP, CSV, report), bad input.
export const path = '/science/dicom-anonymiser/';
const FX = new URL('../fixtures/dicom/', import.meta.url).pathname;
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const { unzipSync } = await import('fflate');
  const D = await import('../../src/lib/sci/dicom.ts');
  await page.goto(`${BASE}/science/dicom-anonymiser/`); await page.waitForTimeout(800);
  const R = '.da ', txt = (s) => page.textContent(R + s);
  check((await txt('.da-med')).includes('For study and teaching, not medical advice.'), 'anonymiser: medical note at the top');
  check((await txt('.da-burn')).includes('Text burned into the image is not removed.'), 'anonymiser: burned-in text warning');
  { const f = await txt('.da-facts'); check(f.includes('Files cleaned3') && f.includes('Tags removed30') && f.includes('Private tags removed6') && f.includes('Tags blanked15') && f.includes('UIDs replaced6 different') && f.includes('Datesshifted -100 days'), `anonymiser: sample summary (${f})`); }
  { const t = await txt('.da-files'); check(t.includes('Phantom_Sample_slice1.dcm') && t.includes('anon-0003.dcm') && (await page.$$eval(R + '.da-files tbody tr', (r) => r.map((x) => x.cells[2].textContent))).join() === '26,26,26', 'anonymiser: files table, 26 changes each'); }
  { const t = await txt('.da-tab'); check(t.includes('Sample^Phantom') && t.includes('ANONYMOUS') && t.includes('Made-up General Hospital') && t.includes('20230923') && t.includes('removed (private)'), 'anonymiser: before and after'); }
  check(await page.isVisible(R + '.da-cv') && (await txt('.da-cap')).includes('anon-0001.dcm'), 'anonymiser: picture shown to check for burned-in text');
  await page.fill(R + '.da-filter', 'date'); await page.waitForTimeout(100);
  check((await page.$$(R + '.da-tab tbody tr')).length === 3,'anonymiser: search the change list');
  await page.fill(R + '.da-filter', '');
  await page.selectOption(R + '.da-pick', '2'); await page.waitForTimeout(100);
  check((await txt('.da-tab')).includes('Slice 3: made-up note'), 'anonymiser: pick another file');
  // Options.
  await page.fill(R + '.da-name', 'STUDY^P7'); await page.fill(R + '.da-id', 'P7'); await page.fill(R + '.da-shift', '365'); await page.waitForTimeout(500);
  { const t = await txt('.da-tab'); check(t.includes('STUDY^P7') && t.includes('20241231') && (await txt('.da-facts')).includes('shifted 365 days'), 'anonymiser: own name, ID and shift'); }
  await page.check(R + '.da-keepp'); await page.check(R + '.da-keepd'); await page.waitForTimeout(200);
  { const t = await txt('.da-tab'); check(!t.includes('Patient Age') && !t.includes('Study Description') && !t.includes('Patient Sex'), 'anonymiser: keep patient details and descriptions'); }
  await page.uncheck(R + '.da-keepp'); await page.uncheck(R + '.da-keepd');
  await page.selectOption(R + '.da-dates', 'blank'); await page.waitForTimeout(200);
  { const t = await txt('.da-tab'); check(await page.isHidden(R + '.da-shiftbox') && /Study Date\s*blanked/.test(t) && /Study Time\s*blanked/.test(t), 'anonymiser: remove dates and times'); }
  await page.selectOption(R + '.da-dates', 'keep'); await page.waitForTimeout(200);
  check(!(await txt('.da-tab')).includes('Study Date') && (await txt('.da-facts')).includes('Dateskept'), 'anonymiser: keep dates');
  await page.selectOption(R + '.da-dates', 'shift'); await page.fill(R + '.da-shift', '1.5'); await page.waitForTimeout(500);
  check((await txt('.da-oerr')).includes('whole number of days') && await page.isHidden(R + '.da-out'), 'anonymiser: bad shift message');
  await page.fill(R + '.da-shift', '-100'); await page.fill(R + '.da-name', 'ANONYMOUS'); await page.fill(R + '.da-id', 'ANON-0001'); await page.waitForTimeout(500);
  // ZIP of three.
  check((await txt('.da-dl')) === 'Download all 3 (ZIP)', 'anonymiser: ZIP button for several files');
  { await page.locator(R + '.da-dl').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.da-dl')]); const f = OUT + 'anon.zip'; await d.saveAs(f);
    const z = unzipSync(new Uint8Array(readFileSync(f))); const names = Object.keys(z).sort();
    const ds = names.map((n) => D.parse(z[n])), g = ds.map(D.getter);
    check(names.join() === 'anon-0001.dcm,anon-0002.dcm,anon-0003.dcm' && g.every((x) => x.s(0x00100010) === 'ANONYMOUS' && x.s(0x00080020) === '20230923' && !x.el(0x00080080) && !x.el(0x00091001)) && new Set(g.map((x) => x.s(0x0020000d))).size === 1 && new Set(g.map((x) => x.s(0x00080018))).size === 3, 'anonymiser: ZIP holds 3 clean files with consistent UIDs'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.da-csv')]); const f = OUT + 'anon.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.includes('file,tag,name,change,new value') && s.includes('anon-0002.dcm,"(0010,0010)",Patient Name,replaced,ANONYMOUS') && !s.includes('Sample^Phantom') && !s.includes('Made-up General'), 'anonymiser: change list CSV without original values'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.da .dl [data-f=pdf]')]); check(/\.pdf$/.test(d.suggestedFilename()), 'anonymiser: PDF report'); }
  // One real fixture: single download, pixels identical.
  await page.setInputFiles(R + '.da-in', FX + 'ct-explicit.dcm'); await page.waitForTimeout(400);
  check((await txt('.da-dl')) === 'Download cleaned file' && (await txt('.da-src')) === '', 'anonymiser: one file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.da-dl')]); const f = OUT + 'anon1.dcm'; await d.saveAs(f);
    const a = D.parse(new Uint8Array(readFileSync(FX + 'ct-explicit.dcm'))), b = D.parse(new Uint8Array(readFileSync(f)));
    const pa = D.getter(a).el(0x7fe00010).value, pb = D.getter(b).el(0x7fe00010).value;
    check(d.suggestedFilename() === 'anon-0001.dcm' && D.getter(b).s(0x00100010) === 'ANONYMOUS' && pa.length === pb.length && pa.every((x, i) => x === pb[i]), 'anonymiser: downloaded file is clean, pixels identical'); }
  // Compressed and ultrasound-like warnings, bad files.
  await page.setInputFiles(R + '.da-in', [...['ct-rle.dcm', 'rgb-planar-2frames.dcm'].map((n) => ({ name: n, mimeType: 'application/dicom', buffer: readFileSync(FX + n) })), { name: 'list.txt', mimeType: 'text/plain', buffer: Buffer.from('not dicom at all, a shopping list') }]); await page.waitForTimeout(400);
  { const t = await txt('.da-files'); check(t.includes('Compressed: pixels kept as they were') && t.includes('Often has burned-in text') && t.includes('Not DICOM: skipped') && (await txt('.da-facts')).includes('2 (1 not DICOM, skipped)') && await page.$eval(R + '.da-burn', (e) => e.classList.contains('strong')), 'anonymiser: compressed, secondary capture and non-DICOM notes'); }
  await page.setInputFiles(R + '.da-in', { name: 'x.dcm', mimeType: 'application/octet-stream', buffer: Buffer.from('nothing to see here, not a DICOM file') }); await page.waitForTimeout(300);
  check((await txt('.da-err')).includes('x.dcm') && await page.isHidden(R + '.da-out'), 'anonymiser: not DICOM message');
  await page.click(R + '.da-sample'); await page.waitForTimeout(300);
  check((await txt('.da-facts')).includes('Files cleaned3') && await page.isHidden(R + '.da-err'), 'anonymiser: sample again');
};
