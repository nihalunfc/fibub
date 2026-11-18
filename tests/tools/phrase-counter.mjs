// #T1027 Phrase counter
export const path = '/everyday/phrase-counter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/phrase-counter/`); await page.waitForTimeout(300);
  const t = async (s) => (await page.textContent(`.pc .${s}`)).trim();
  check((await t('pc-bar')) === '1.875 s' && (await t('pc-p32')).startsWith('60 s'), 'phrase-counter: 128 BPM bar 1.875 s, 32 bars 60 s');
  check((await t('pc-count')).startsWith('160 bars: 5 x 32, 10 x 16, 20 x 8'), 'phrase-counter: 5:00 holds 5 x 32 bars');
  check((await t('pc-next')).startsWith('Next 32-bar phrase in 0:50.0'), 'phrase-counter: from 1:10 next 32-bar phrase in 50 s');
  check((await page.inputValue('.pc [data-k="cvb"]')) === '64', 'phrase-counter: 2:00 = 64 bars');
  await page.fill('.pc [data-k="cvb"]', '16'); await page.waitForTimeout(100);
  check((await page.inputValue('.pc [data-k="cvt"]')) === '0:30', 'phrase-counter: 16 bars = 0:30');
  await page.fill('.pc [data-k="bpm"]', '120'); await page.waitForTimeout(100);
  check((await t('pc-bar')) === '2 s', 'phrase-counter: 120 BPM bar 2 s');
  await page.click('.pc .pc-go'); await page.waitForTimeout(600);
  check((await t('pc-lb')).match(/^[1-4]$/) !== null && (await t('pc-ls')).startsWith('Bar 1'), 'phrase-counter: live counter runs');
  await page.click('.pc .pc-go');
};
