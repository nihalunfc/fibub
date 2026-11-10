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
  await page.check('.pp-white'); await page.selectOption('.pp-country', 'uk');
  const uk = await saved(page, () => page.click('.pp-one'));
  const [w, h] = jpegSize(uk.buf), px = await page.evaluate(() => { const c = document.querySelector('.pp-cv'); return [...c.getContext('2d').getImageData(3, 3, 1, 1).data]; });
  check(w === 413 && h === 531, 'passport-photo: UK photo is 413x531 (' + w + 'x' + h + ')');
  check(px[0] > 245 && px[1] > 245 && px[2] > 245, 'passport-photo: white background option whitens the wall ' + px);
};
