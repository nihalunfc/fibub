// #T904 Health summary card
import { readFileSync } from 'node:fs';
export const path = '/documents/health-summary-card/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/health-summary-card/`); await page.waitForTimeout(500);
  check((await page.textContent('.hc .hc-note')).includes('not medical advice'), 'health card: banner at the top');
  check(await page.isHidden('.hc .hc-out'), 'health card: no preview before typing');
  await page.click('.hc .hc-ex'); await page.waitForTimeout(200);
  check(await page.isVisible('.hc .hc-out') && (await page.textContent('.hc .hc-prev')).includes('Penicillin') && (await page.textContent('.hc .hc-prev')).includes('Check it is up to date'), 'health card: example fills the preview with the date line');
  check((await page.textContent('.hc [data-side=back]')).includes('Ravi Example'), 'health card: contacts on the card back');
  check(!(await page.evaluate(() => Object.keys(localStorage).some((k) => k.startsWith('fibub-healthcard')))), 'health card: nothing saved until ticked');
  let dl = page.waitForEvent('download'); await page.click('.hc .dl button[data-f=pdf]');
  check((await dl).suggestedFilename() === 'health-summary.pdf', 'health card: summary PDF downloads');
  dl = page.waitForEvent('download'); await page.click('.hc .hc-card');
  { const d = await dl, buf = readFileSync(await d.path()); check(d.suggestedFilename() === 'emergency-medical-card.pdf' && buf.subarray(0, 5).toString() === '%PDF-', 'health card: wallet card PDF downloads'); }
  dl = page.waitForEvent('download'); await page.click('.hc .hc-lock');
  { const d = await dl, buf = readFileSync(await d.path()); check(d.suggestedFilename().endsWith('.png') && buf.readUInt32BE(16) === 1080 && buf.readUInt32BE(20) === 1920, `health card: lock-screen PNG is 1080x1920 (${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)})`); }
  await page.check('.hc .hc-remember'); await page.waitForTimeout(100);
  check(await page.evaluate(() => (localStorage.getItem('fibub-healthcard-v1') || '').includes('Asha')), 'health card: saved after ticking');
  await page.click('.hc .hc-clear'); await page.waitForTimeout(100);
  check(!(await page.evaluate(() => localStorage.getItem('fibub-healthcard-v1'))) && !(await page.isChecked('.hc .hc-remember')) && await page.isHidden('.hc .hc-out'), 'health card: Clear removes the saved copy');
  await page.click('.hc [data-list=allergies] .hc-add'); await page.waitForTimeout(100);
  check((await page.$$('.hc [data-list=allergies] .hc-row')).length === 2, 'health card: add a row');
};
