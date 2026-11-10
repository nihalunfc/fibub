// #1451 immune response timeline (maths checked against Python in tests/sci-tools/immune-response.mjs)
export const path = '/learn/immune-response/';
export default async ({ page, check, BASE }) => {
  const R = '.imr ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/immune-response/`); await page.waitForTimeout(500);
  { const tb = await t('.im-tab tbody'); check(tb.includes('primary') && tb.includes('secondary') && tb.includes('1.3') && tb.includes('6.47') && tb.includes('107'), `immune: two infections table (${tb})`); }
  check((await t('.im-facts')).includes('67 of 361') && (await t('.im-facts')).includes('× 5'), `immune: facts (${await t('.im-facts')})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.im-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200 && d[i + 2] > 120) n++; return n; });
  check(px > 300, `immune: curve drawn (${px})`);
  await page.selectOption(R + '.im-st', 'vacinf');
  check((await t('.im-say')).includes('Germ on day 150') && (await t('.im-say')).includes('below the protective level'), `immune: vaccine then germ unprotected at level 2 (${await t('.im-say')})`);
  await slide('.im-prot', 0.8);
  check((await t('.im-say')).includes('already above'), 'immune: protected at a lower line');
  await page.selectOption(R + '.im-st', 'boost');
  check((await t('.im-say')).includes('boosters work'), 'immune: booster story');
  await page.selectOption(R + '.im-k2', 'infection'); await slide('.im-d2', 300);
  check((await page.$eval(R + '.im-st', (e) => e.value)) === 'own' && (await t('.im-say')).includes('Germ on day 300'), 'immune: own timeline');
  await page.click(R + '.im-lv button[data-v=split]');
  check((await t('.im-leg')).includes('IgM'), 'immune: IgM and IgG view');
  await page.check(R + '.im-log'); await page.waitForTimeout(50);
  await page.selectOption(R + '.im-k0', 'none'); await page.selectOption(R + '.im-k1', 'none'); await page.selectOption(R + '.im-k2', 'none');
  check((await t('.im-say')).includes('No events'), 'immune: no events');
  await page.click(R + '.im-part[data-p=light] path');
  check((await t('.im-abinfo')).includes('short chains'), 'immune: antibody part tap');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'immune: five quiz questions');
  const q4 = (await t('.smq-q:nth-child(4) .smq-text')).match(/\d+/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(4) .smq-in', String(q4[0] / 2 ** (q4[2] / q4[1]))); await page.click(R + '.smq-q:nth-child(4) .smq-check');
  check((await t('.smq-q:nth-child(4) .smq-out')) === 'Right!', `immune: quiz half-life (${q4})`);
};
