// #T1052 Speaker Test. Headless Chromium has an audio context (no sound device needed).
export const path = '/everyday/speaker-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/speaker-test/`); await page.waitForTimeout(300);
  const R = '.sp ', t = (s) => page.textContent(R + s);
  check(parseInt(await t('.sp-ch')) >= 1, `speaker-test: shows the output channel count (${await t('.sp-ch')})`);
  check((await t('.sp-voltxt')).includes('-18'), 'speaker-test: volume starts at -18 dB');
  await page.click(R + '[data-pan="-1"]');
  check((await t('.sp-status')).includes('LEFT'), 'speaker-test: Left says which side should sound');
  await page.click(R + '[data-pan="1"]');
  check((await t('.sp-status')).includes('RIGHT'), 'speaker-test: Right says which side should sound');
  await page.click(R + '.sp-sw'); await page.waitForTimeout(700);
  const hz = await t('.sp-hz');
  check(/Hz/.test(hz) && !(await page.isDisabled(R + '.sp-heard')), `speaker-test: sweep shows a live pitch (${hz})`);
  await page.click(R + '.sp-heard');
  const m = await t('.sp-marks');
  check(/\d/.test(m) && (await page.isDisabled(R + '.sp-heard')), `speaker-test: "I stopped hearing it" records a frequency (${m})`);
  await page.click(R + '[data-flip="1"]');
  check((await t('.sp-status')).includes('Out of phase'), 'speaker-test: phase test explains what to hear');
};
