// #1709 Passport photo
import { saved } from '../lib/pdfkit.mjs';
export const path = '/documents/passport-photo/';
function jpegSize(b) { let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1]; if (m >= 0xc0 && m <= 0xc2) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + b.readUInt16BE(i + 2); } return [0, 0]; }
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const png = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = 900; c.height = 1200; const x = c.getContext('2d');
    x.fillStyle = '#9ab'; x.fillRect(0, 0, 900, 1200); x.fillStyle = '#d9a37e'; x.beginPath(); x.ellipse(450, 500, 170, 230, 0, 0, 7); x.fill();
    return c.toDataURL('image/png').split(',')[1];
  });
  await page.setInputFiles('.pp-file', [{ name: 'me.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') }]);
  await page.waitForSelector('.pp-work:not([hidden])');
  const one = await saved(page, () => page.click('.pp-one'));
  check(jpegSize(one.buf).join('x') === '591x827', 'passport-photo: Canada photo is 591x827 px (' + jpegSize(one.buf) + ')');
  const sheet = await saved(page, () => page.click('.pp-print'));
  check(jpegSize(sheet.buf).join('x') === '1200x1800', 'passport-photo: 4x6 sheet is 1200x1800');
  check((await page.textContent('.pp-count')).startsWith('4 photos'), 'passport-photo: 4 Canada photos fit on 4x6 (' + (await page.textContent('.pp-count')).slice(0, 12) + ')');
  await page.selectOption('.pp-country', 'us');
  check((await page.textContent('.pp-count')).startsWith('6 photos') && (await page.textContent('.pp-rule')).includes('25 to 35'), 'passport-photo: US gives 6 per sheet and shows the head rule');
  const us = await saved(page, () => page.click('.pp-one'));
  check(jpegSize(us.buf).join('x') === '600x600', 'passport-photo: US photo is 600x600');
  await page.selectOption('.pp-country', 'in-icao');
  const ind = await saved(page, () => page.click('.pp-one'));
  check(jpegSize(ind.buf).join('x') === '630x810' && (await page.textContent('.pp-rule')).includes('630 x 810'), 'passport-photo: India ICAO photo is 630x810 (' + jpegSize(ind.buf) + ')');
  await page.check('.pp-white'); await page.selectOption('.pp-country', 'uk');
  const uk = await saved(page, () => page.click('.pp-one'));
  const [w, h] = jpegSize(uk.buf), px = await page.evaluate(() => { const c = document.querySelector('.pp-cv'); return [...c.getContext('2d').getImageData(3, 3, 1, 1).data]; });
  check(w === 413 && h === 531, 'passport-photo: UK photo is 413x531 (' + w + 'x' + h + ')');
  check(px[0] > 245 && px[1] > 245 && px[2] > 245, 'passport-photo: white background option whitens the wall ' + px);
  // more options: size cap and turning
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.selectOption('.pp-country', 'ca');
  await page.check('.pp-cap-on'); await page.fill('.pp-cap', '20');
  const small = await saved(page, () => page.click('.pp-one'));
  check(small.buf.length <= 20 * 1024 && jpegSize(small.buf).join('x') === '591x827', 'passport-photo: size cap keeps the photo under 20 KB (' + small.buf.length + ')');
  check(/KB/.test(await page.textContent('.pp-msg')), 'passport-photo: says the saved size');
  await page.click('.pp-rotr'); await page.waitForTimeout(200);
  const rot = await saved(page, () => page.click('.pp-one'));
  check(jpegSize(rot.buf).join('x') === '591x827', 'passport-photo: still the right size after turning');
  const names = await page.$$eval('.pp-country option', (o) => o.map((x) => x.textContent));
  check(names.join('|') === [...names].sort((a, b) => a.localeCompare(b)).join('|') && names.some((n) => n.startsWith('United Arab Emirates')), 'passport-photo: countries are alphabetical and include the UAE');
  await page.selectOption('.pp-country', 'ae');
  const ae = await saved(page, () => page.click('.pp-one'));
  check(jpegSize(ae.buf).join('x') === '413x531', 'passport-photo: UAE photo is 413x531 px (' + jpegSize(ae.buf) + ')');
};
