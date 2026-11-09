// #818 checksum checker
export const path = '/science/checksum-checker/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/checksum-checker/`); await page.waitForTimeout(500);
  const R = '.ckc ', SHA = '1e05c2ec8a20bf845af9d16e6020dfd0777e4592be30a204f03fd509dbd7033e';
  await page.click(R + '.ck-ex'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.ck-vbig')) === '✗ 1 match, 1 do not match, 1 missing, 1 not in the manifest', `ck: example verify (${await page.textContent(R + '.ck-vbig')})`);
  check((await page.textContent(R + '.ck-tab')).includes(SHA) && (await page.textContent(R + '.ck-prog')).includes('3 files'), 'ck: SHA-256 of readings.csv as sha256sum gives');
  check((await page.inputValue(R + '.ck-man')).includes(`${SHA}  readings.csv`), 'ck: manifest in sha256sum format');
  check((await page.$$eval(R + '.ck-vtab tbody tr', (t) => t.map((r) => r.cells[0].textContent))).join() === 'Does not match,Missing,Not in manifest,Match', 'ck: problems listed first');
  await page.check(R + '.ck-algs input[value=md5]'); await page.check(R + '.ck-algs input[value=crc32]'); await page.waitForTimeout(400);
  { const t = await page.textContent(R + '.ck-tab'); check(t.includes('3f24293b9689cd621e736fdaefc07e78') && t.includes('MD5') && t.includes('CRC32'), 'ck: MD5 and CRC32 columns'); }
  await page.selectOption(R + '.ck-malg', 'md5'); await page.selectOption(R + '.ck-style', 'bagit'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.ck-man')).includes('3f24293b9689cd621e736fdaefc07e78 data/readings.csv') && (await page.textContent(R + '.ck-mhelp')).includes('Payload-Oxum is'), 'ck: BagIt manifest');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ck-mdl')]); check(d.suggestedFilename() === 'manifest-md5.txt', 'ck: BagIt manifest file name'); }
  await page.selectOption(R + '.ck-style', 'bsd'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.ck-man')).includes('MD5 (readings.csv) = 3f24293b9689cd621e736fdaefc07e78'), 'ck: BSD tag manifest');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ck-vcsv')]); const f = OUT + 'ck.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 5 && t[0] === 'result,file,expected,found' && t.some((l) => l.startsWith('match,readings.csv,' + SHA)), 'ck: results CSV'); }
  // Real files and a manifest file named manifest-md5.txt (BagIt).
  writeFileSync(OUT + 'a.txt', 'hello\n'); writeFileSync(OUT + 'b.txt', 'world\n');
  await page.setInputFiles(R + '.ck-files', [OUT + 'a.txt', OUT + 'b.txt']); await page.waitForTimeout(500);
  writeFileSync(OUT + 'manifest-md5.txt', 'b1946ac92492d2347c6235b4d2611184 data/a.txt\n591785b794601e212b260e25925636fd data/b.txt\n');
  await page.setInputFiles(R + '.ck-mfile', OUT + 'manifest-md5.txt'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.ck-vbig')) === '✓ 2 match' && (await page.textContent(R + '.ck-vnote')).includes('BagIt'), `ck: chosen files against a BagIt manifest (${await page.textContent(R + '.ck-vbig')})`);
  // SHA-1 manifest pasted: the page makes SHA-1 itself.
  await page.uncheck(R + '.ck-algs input[value=md5]'); await page.uncheck(R + '.ck-algs input[value=crc32]');
  await page.fill(R + '.ck-paste', 'f572d396fae9206628714fb2ce00f72e94f2258f *a.txt\nnot a checksum line\n'); await page.waitForTimeout(900);
  check((await page.textContent(R + '.ck-vbig')) === '✓ 1 match, 1 not in the manifest' && (await page.textContent(R + '.ck-vnote')).includes('Line 2 could not be read'), `ck: SHA-1 from a pasted md5sum-style line (${await page.textContent(R + '.ck-vbig')})`);
  // A single checksum against one file.
  await page.setInputFiles(R + '.ck-files', [OUT + 'a.txt']); await page.waitForTimeout(400);
  await page.fill(R + '.ck-paste', '5891B5B522D5DF086D0FF0B110FBD9D21BB4FC7163AF34D08286A2E846F6BE03'); await page.waitForTimeout(700);
  check((await page.textContent(R + '.ck-vbig')) === '✓ 1 match', 'ck: single checksum from a download page');
  await page.fill(R + '.ck-paste', 'nothing useful here'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.ck-verr')).includes('No checksum lines') && await page.isHidden(R + '.ck-vout'), 'ck: bad manifest message');
  await page.click(R + '.ck-clear'); await page.waitForTimeout(200);
  check(await page.isHidden(R + '.ck-make') && (await page.inputValue(R + '.ck-paste')) === '', 'ck: clear');
  await page.fill(R + '.ck-paste', SHA + '  x.csv'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.ck-verr')).includes('choose the files'), 'ck: asks for files');
};
