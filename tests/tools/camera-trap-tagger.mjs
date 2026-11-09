// #856 camera-trap tagger
import { mkdirSync } from 'node:fs';
export const path = '/science/camera-trap-tagger/';
// A tiny JPEG made by Pillow, with an EXIF block (little endian, IFD0 Make + Exif IFD DateTimeOriginal) put in after SOI.
const BASE = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAGAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCnRRRXGZH/2Q==', 'base64');
const withExif = (date) => {
  const d = Buffer.from(date + '\0'), make = Buffer.from('TestCam\0');
  const t = Buffer.alloc(8 + 2 + 2 * 12 + 4 + 2 + 12 + 4 + make.length + d.length);
  t.write('II', 0); t.writeUInt16LE(42, 2); t.writeUInt32LE(8, 4);
  const exifIfd = 8 + 2 + 24 + 4, makeOff = exifIfd + 2 + 12 + 4, dateOff = makeOff + make.length;
  t.writeUInt16LE(2, 8);
  t.writeUInt16LE(0x010f, 10); t.writeUInt16LE(2, 12); t.writeUInt32LE(make.length, 14); t.writeUInt32LE(makeOff, 18);
  t.writeUInt16LE(0x8769, 22); t.writeUInt16LE(4, 24); t.writeUInt32LE(1, 26); t.writeUInt32LE(exifIfd, 30);
  t.writeUInt32LE(0, 34);
  t.writeUInt16LE(1, exifIfd); t.writeUInt16LE(0x9003, exifIfd + 2); t.writeUInt16LE(2, exifIfd + 4); t.writeUInt32LE(d.length, exifIfd + 6); t.writeUInt32LE(dateOff, exifIfd + 10); t.writeUInt32LE(0, exifIfd + 14);
  make.copy(t, makeOff); d.copy(t, dateOff);
  const body = Buffer.concat([Buffer.from('Exif\0\0', 'binary'), t]), seg = Buffer.alloc(4); seg.writeUInt16BE(0xffe1, 0); seg.writeUInt16BE(body.length + 2, 2);
  return Buffer.concat([BASE.subarray(0, 2), seg, body, BASE.subarray(2)]);
};
export default async ({ page, check, BASE: URLBASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.ctx ', big = () => page.textContent(R + '.ct-big'), now = () => page.textContent(R + '.ct-now'), pos = () => page.textContent(R + '.ct-pos'), wait = (ms = 300) => page.waitForTimeout(ms);
  const row = (name) => page.$$eval(R + '.ct-sum tr', (r, n) => (r.map((x) => Array.from(x.children, (c) => c.textContent)).find((c) => c[0] === n) || []).join('|'), name);
  await page.goto(`${URLBASE}${path}`); await page.evaluate(() => { try { localStorage.removeItem('fibub-camtrap-v1'); localStorage.removeItem('fibub-camtrap-keep'); } catch {} }); await page.reload(); await wait(1000);
  check((await big()) === '70 detections of 5 species in 40 trap-nights', `camera trap: example summary (${await big()})`);
  check((await row('Deer')) === 'Deer|23|48|3 of 3|1.00|57.50' && (await row('Badger')) === 'Badger|6|9|2 of 3|0.67|15.00', 'camera trap: species table (detections, animals, stations, naive occupancy, RAI)');
  check((await pos()).startsWith('Event 1 of 77 · Camera A · 2026-05-02 05:43') && (await now()) === 'Hare × 1, resting', 'camera trap: first event and its tag');
  check(await page.getAttribute(R + '.ct-img', 'src').then((s) => s.startsWith('data:image/jpeg')), 'camera trap: example picture drawn');
  // Hotkeys.
  await page.click(R + '.ct-pos'); await page.keyboard.press('2'); await wait();
  check((await now()) === 'Fox × 1, resting' && (await row('Hare')).startsWith('Hare|15|') && (await row('Fox')).startsWith('Fox|18|'), 'camera trap: key 2 tags Fox, summary follows');
  await page.keyboard.press('w'); await page.keyboard.press('+'); await wait();
  check((await now()) === 'Fox × 2, feeding', 'camera trap: W behaviour, + count');
  await page.keyboard.press('-'); await page.keyboard.press('0'); await wait();
  check((await now()) === 'Empty (no animal)' && (await row('Fox')).startsWith('Fox|17|'), 'camera trap: 0 marks empty');
  await page.keyboard.press('Backspace'); await wait();
  check((await now()) === 'Not tagged', 'camera trap: Backspace clears');
  await page.keyboard.press('ArrowRight'); await wait();
  check((await pos()).startsWith('Event 2 of 77'), 'camera trap: arrow to the next event');
  await page.keyboard.press('n'); await wait();
  check((await pos()).startsWith('Event 1 of 77') && (await now()) === 'Not tagged', 'camera trap: N finds the untagged event');
  await page.keyboard.press('3'); await wait();
  check((await big()) === '70 detections of 5 species in 40 trap-nights', 'camera trap: tagged back as Hare');
  await page.click(R + '.ct-next'); await page.click(R + '.ct-prev'); await wait();
  check((await pos()).startsWith('Event 1 of 77'), 'camera trap: Next and Previous buttons');
  // Typing in a box does not tag.
  await page.fill(R + '.ct-notes', '5'); await page.press(R + '.ct-notes', '5'); await wait();
  check((await now()) === 'Hare × 1', `camera trap: keys typed in a box are not hotkeys (${await now()})`);
  await page.fill(R + '.ct-notes', 'ear tag'); await page.dispatchEvent(R + '.ct-notes', 'change'); await wait();
  // Photo-only tagging in a burst: find an event with several photos.
  await page.click(R + 'details summary'); await wait();
  const multi = await page.$$eval(R + '.ct-ev tr', (r) => r.findIndex((x) => +x.children[3]?.textContent > 1));
  await page.click(`${R}.ct-ev tr:nth-child(${multi + 1})`); await wait();
  await page.selectOption(R + '.ct-apply', 'photo'); await page.click(R + '.ct-pos'); await page.keyboard.press('8'); await wait();
  { const t = await page.$$eval(R + '.ct-thumbs button', (b) => b.map((x) => x.textContent)); check(t[0] === '1 ✓' && (await now()).startsWith('Human × '), `camera trap: tag one photo of a burst (${t})`); }
  check((await page.textContent(R + '.ct-ev tr.ct-cur')).includes('Human'), 'camera trap: events table shows the tag');
  await page.keyboard.press('Backspace'); await page.selectOption(R + '.ct-apply', 'event'); await wait();
  // Settings.
  await page.fill(R + '.ct-igap', '60'); await wait();
  { const n = +(await big()).split(' ')[0]; check(n < 70 && n > 40, `camera trap: 60 min interval merges visits (${n})`); }
  await page.selectOption(R + '.ct-from', 'first'); await wait();
  { const n = +(await big()).split(' ')[0]; check(n >= 56, `camera trap: counted from the first photo (${n})`); }
  await page.fill(R + '.ct-igap', '-1'); await wait();
  check((await page.textContent(R + '.ct-err')).includes('0 or more'), 'camera trap: bad interval message');
  await page.fill(R + '.ct-igap', '30'); await page.selectOption(R + '.ct-from', 'last'); await page.fill(R + '.ct-egap', '600'); await wait();
  check(/^Event \d+ of (\d+)/.test(await pos()) && +(await pos()).match(/of (\d+)/)[1] < 77, 'camera trap: a longer event gap gives fewer events');
  await page.fill(R + '.ct-egap', '5'); await wait();
  for (const s of ['Camera A', 'Camera B', 'Camera C']) await page.fill(`${R}.ct-nights input[data-st="${s}"]`, '10');
  await wait();
  check((await big()).endsWith('in 30 trap-nights') && (await row('Deer')).endsWith('|76.67'), 'camera trap: trap-nights change RAI (23 / 30 × 100)');
  await page.selectOption(R + '.ct-act', 'Fox'); await wait();
  check((await page.getAttribute(R + '.ct-hours', 'aria-label')) === 'Detections of Fox by hour of day', 'camera trap: activity for one species');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ct-csv')]); const f = OUT + 'ct.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t.length === 179 && t[0] === 'station,file,datetime,time_source,event,species,count,behaviour,notes,detection' && t[1].startsWith('Camera A,IMG_0001.JPG,2026-05-02 05:43') && t[1].includes('ear tag') && t.filter((l) => l.includes(',Empty,')).length === 6, 'camera trap: photos CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ct-dcsv')]); const f = OUT + 'ctd.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t.length === 71 && t[0] === 'detection,station,species,start,end,photos,count,hour', 'camera trap: detections CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); const f = OUT + 'ct.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'camera trap: PDF report'); }
  check(await page.evaluate(() => localStorage.getItem('fibub-camtrap-v1')) === null, 'camera trap: example tags are not saved');
  // Own photos: two in a burst, one later, one with no EXIF date.
  const files = [['IMG_0001.JPG', '2026:06:01 22:10:00'], ['IMG_0002.JPG', '2026:06:01 22:11:30'], ['IMG_0003.JPG', '2026:06:02 01:40:00']].map(([n, t]) => ({ name: n, mimeType: 'image/jpeg', buffer: withExif(t) }));
  files.push({ name: 'IMG_0004.JPG', mimeType: 'image/jpeg', buffer: BASE });
  await page.fill(R + '.ct-station', 'Gate'); await page.setInputFiles(R + '.ct-in', files); await wait(800);
  check((await page.textContent(R + '.ct-note')).startsWith('Read 4 photos from 1 station on this device. 1 had no EXIF date'), 'camera trap: photos read, missing EXIF noted');
  check((await pos()).startsWith('Event 1 of 3 · Gate · 2026-06-01 22:10 to 22:11 · 2 photos') && (await big()).startsWith('0 detections of 0 species in '), `camera trap: EXIF times group into events (${await pos()})`);
  check((await page.getAttribute(R + '.ct-img', 'src')).startsWith('blob:'), 'camera trap: own photo shown from this device');
  await page.click(R + '.ct-pos'); await page.keyboard.press('1'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('2'); await wait();
  check((await big()).startsWith('2 detections of 2 species in '), 'camera trap: tagged own photos');
  { const s = await page.evaluate(() => JSON.parse(localStorage.getItem('fibub-camtrap-v1'))); check(Object.keys(s.tags).length === 3 && s.tags['IMG_0001.JPG|' + 0 + '|x'] === undefined && Object.keys(s.tags).some((k) => k.startsWith('IMG_0001.JPG|') && k.endsWith('|2026:06:01 22:10:00')), 'camera trap: tags kept in this browser by name, size and time'); }
  await page.reload(); await wait(800);
  await page.setInputFiles(R + '.ct-in', files); await wait(800);
  check((await page.textContent(R + '.ct-note')).includes('3 saved tags found') && (await big()).startsWith('2 detections of 2 species'), 'camera trap: tags come back next time');
  await page.click(R + '.ct-keep'); await wait();
  check(await page.evaluate(() => localStorage.getItem('fibub-camtrap-v1')) === null && (await page.textContent(R + '.ct-note')).includes('deleted'), 'camera trap: unticking deletes saved tags');
  await page.click(R + '.ct-keep'); await wait();
  check(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('fibub-camtrap-v1')).tags).length) === 3, 'camera trap: ticking again saves the tags on the page');
  await page.click(R + '.ct-clear'); await wait();
  check(await page.evaluate(() => localStorage.getItem('fibub-camtrap-v1')) === null, 'camera trap: Clear saved tags');
  // A folder: each sub-folder is a station.
  mkdirSync(OUT + 'ctdir/North', { recursive: true }); mkdirSync(OUT + 'ctdir/South', { recursive: true });
  writeFileSync(OUT + 'ctdir/North/a.jpg', withExif('2026:07:01 10:00:00')); writeFileSync(OUT + 'ctdir/South/b.jpg', withExif('2026:07:03 10:00:00')); writeFileSync(OUT + 'ctdir/South/notes.txt', 'x');
  await page.setInputFiles(R + '.ct-indir', OUT + 'ctdir'); await wait(800);
  check((await page.textContent(R + '.ct-note')).startsWith('Read 2 photos from 2 stations') && (await page.$$eval(R + '.ct-nights label', (l) => l.map((x) => x.firstChild.textContent).join())) === 'North,South', 'camera trap: folder with two stations');
  await page.setInputFiles(R + '.ct-in', { name: 'a.txt', mimeType: 'text/plain', buffer: Buffer.from('x') }); await wait();
  check((await page.textContent(R + '.ct-err')).includes('No JPEG photos'), 'camera trap: no JPEG message');
  await page.evaluate(() => { try { localStorage.removeItem('fibub-camtrap-v1'); localStorage.removeItem('fibub-camtrap-keep'); } catch {} });
};
