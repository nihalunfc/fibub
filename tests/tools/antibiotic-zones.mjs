// #1455 antibiotic zones (maths checked against scipy in tests/sci-tools/antibiotic-zones.mjs)
export const path = '/learn/antibiotic-zones/';
export default async ({ page, check, BASE }) => {
  const R = '.azn ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/antibiotic-zones/`); await page.waitForTimeout(500);
  { const tb = await t('.az-tab tbody'); check(tb.includes('18.7') && tb.includes('17.7') && tb.includes('11.7') && tb.includes('20.1') && tb.includes('no antibiotic'), `zones: strain 1 table (${tb})`); }
  check((await t('.az-say')).includes('18.7 mm across: sensitive'), `zones: disc P sentence (${await t('.az-say')})`);
  check((await t('.az-formula')).includes('39.8'), 'zones: formula numbers');
  await page.selectOption(R + '.az-germ', '1');
  check((await t('.az-say')).includes('resistant') && (await t('.az-tab tbody')).includes('6 (none)'), 'zones: strain 2 resistant to P');
  await page.selectOption(R + '.az-sel', '4'); check((await t('.az-say')).includes('control disc'), 'zones: control');
  await page.selectOption(R + '.az-germ', '0'); await page.selectOption(R + '.az-sel', '0');
  await slide('.az-h', 2); check((await t('.az-tab tbody')).includes('19.') || (await t('.az-tab tbody')).includes('20.'), 'zones: thinner agar, bigger zones');
  await slide('.az-m', 40); check((await t('.az-mv')) === '40 µg', 'zones: amount slider');
  const box = await page.$(R + '.az-fig'); await box.scrollIntoViewIfNeeded(); const b = await box.boundingBox();
  await page.mouse.click(b.x + b.width * (0.5 + 22 / 96), b.y + b.height * (0.5 + 22 / 96));
  check((await page.$eval(R + '.az-sel', (e) => e.value)) === '3', 'zones: tap disc S on the plate');
  const px = await page.evaluate(() => { const c = document.querySelector('.az-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 150 && d[i + 2] < 120) n++; return n; });
  check(px > 2000, `zones: lawn drawn (${px})`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'zones: five quiz questions');
  const q1 = (await t('.smq-q:nth-child(1) .smq-text')).match(/\d+/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(2 * q1[0])); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'zones: quiz diameter');
};
