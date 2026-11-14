// #T950 Speed Test
import { mockSpeed } from '../lib/speed-mock.mjs';
export const path = '/everyday/internet-speed-test/';
export default async ({ page, check, BASE }) => {
  await mockSpeed(page);
  await page.goto(`${BASE}/everyday/internet-speed-test/`); await page.waitForTimeout(400);
  check(await page.isHidden('.ist .ist-res'), 'internet-speed-test: no results before a test');
  check(/Canada, India, the UK and the USA/.test(await page.textContent('.ist')), 'internet-speed-test: names the supported countries');
  check(/Test ISP/.test(await page.textContent('.ist .ist-info')), 'internet-speed-test: shows the network name');
  await page.click('.ist [data-plan="full"]');
  check(/Full: about 30 seconds/.test(await page.textContent('.ist .ist-planhelp')), 'internet-speed-test: plan switch explains itself');
  await page.click('.ist [data-plan="light"]');
  await page.click('.ist .ist-go');
  await page.waitForSelector('.ist .ist-res:not([hidden])', { timeout: 60000 });
  check(/\d Mbps/.test(await page.textContent('.ist .ist-down')) && /\d Mbps/.test(await page.textContent('.ist .ist-up')), 'internet-speed-test: download and upload in Mbps');
  check(/\d ms/.test(await page.textContent('.ist .ist-lat')) && /\d ms/.test(await page.textContent('.ist .ist-jit')), 'internet-speed-test: ping and jitter in ms');
  check(await page.$$eval('.ist .ist-uses li', (l) => l.length) === 6, 'internet-speed-test: lists six uses');
  check(/MB/.test(await page.textContent('.ist .ist-bytes')), 'internet-speed-test: shows data used');
  check(await page.evaluate(() => localStorage.getItem('fibub-speedtests-v1') === null), 'internet-speed-test: nothing stored unless ticked');
  await page.check('.ist .ist-keep');
  check(await page.$$eval('.ist .ist-hist tbody tr', (r) => r.length) === 1, 'internet-speed-test: ticking keeps the result');
  await page.click('.ist .ist-clear');
  check(await page.evaluate(() => localStorage.getItem('fibub-speedtests-v1') === null), 'internet-speed-test: Clear removes saved results');
};
