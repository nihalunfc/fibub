// #T907 Hospital CD viewer (two tiny synthetic DICOM files, made up here; no real patient)
import { readFileSync } from 'node:fs';
export const path = '/documents/hospital-cd-viewer/';
const el = (g, e, vr, val) => {
  const v = typeof val === 'string' ? Buffer.from(val + (val.length % 2 ? (vr === 'UI' ? '\0' : ' ') : '')) : Buffer.from(val);
  const h = Buffer.alloc(vr === 'OW' ? 12 : 8);
  h.writeUInt16LE(g, 0); h.writeUInt16LE(e, 2); h.write(vr, 4, 'latin1');
  if (vr === 'OW') h.writeUInt32LE(v.length, 8); else h.writeUInt16LE(v.length, 6);
  return Buffer.concat([h, v]);
};
const us = (n) => { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; };
function dcm(series, no, desc) {
  const body = Buffer.concat([
    el(0x0008, 0x0016, 'UI', '1.2.840.10008.5.1.4.1.1.2'), el(0x0008, 0x0020, 'DA', '20240315'), el(0x0008, 0x0060, 'CS', 'CT'),
    el(0x0008, 0x1030, 'LO', 'Made-up chest study'), el(0x0008, 0x103e, 'LO', desc), el(0x0010, 0x0010, 'PN', 'Test^Pretend'),
    el(0x0018, 0x0015, 'CS', 'CHEST'), el(0x0020, 0x000d, 'UI', '1.2.3.4.5'), el(0x0020, 0x000e, 'UI', series), el(0x0020, 0x0011, 'IS', String(no)), el(0x0020, 0x0013, 'IS', '1'),
    el(0x0028, 0x0002, 'US', us(1)), el(0x0028, 0x0004, 'CS', 'MONOCHROME2'), el(0x0028, 0x0010, 'US', us(8)), el(0x0028, 0x0011, 'US', us(8)),
    el(0x0028, 0x0100, 'US', us(16)), el(0x0028, 0x0101, 'US', us(16)), el(0x0028, 0x0102, 'US', us(15)), el(0x0028, 0x0103, 'US', us(0)),
    el(0x7fe0, 0x0010, 'OW', Buffer.concat(Array.from({ length: 64 }, (_, i) => us(i * 60)))),
  ]);
  const ts = el(0x0002, 0x0010, 'UI', '1.2.840.10008.1.2.1');
  const len = Buffer.alloc(4); len.writeUInt32LE(ts.length);
  const meta = Buffer.concat([Buffer.from([2, 0, 0, 0, 0x55, 0x4c, 4, 0]), len, ts]);
  return Buffer.concat([Buffer.alloc(128), Buffer.from('DICM'), meta, body]);
}
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/hospital-cd-viewer/`); await page.waitForTimeout(500);
  check((await page.textContent('.cd .cd-note')).includes('Not for diagnosis'), 'cd viewer: not-for-diagnosis note');
  check(await page.isHidden('.cd .cd-list'), 'cd viewer: nothing listed before opening');
  await page.setInputFiles('.cd .cd-files', [
    { name: 'IM0001', mimeType: 'application/dicom', buffer: dcm('1.2.3.4.5.1', 1, 'Lungs') },
    { name: 'IM0002', mimeType: 'application/dicom', buffer: dcm('1.2.3.4.5.2', 2, 'Soft tissue') },
    { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello, this is not a scan '.repeat(10)) },
    { name: 'DICOMDIR', mimeType: 'application/octet-stream', buffer: Buffer.alloc(300) },
  ]);
  await page.waitForTimeout(600);
  check((await page.$$('.cd .cd-study')).length === 1 && (await page.$$('.cd .cd-series')).length === 2, 'cd viewer: 1 study, 2 series');
  const sum = await page.textContent('.cd .cd-sum');
  check(sum.includes('2 other files skipped') && sum.includes('2 DICOM image files'), `cd viewer: .txt and DICOMDIR counted as skipped (${sum.slice(0, 90)})`);
  const st = await page.textContent('.cd .cd-studies');
  check(st.includes('15 March 2024') && st.includes('CHEST') && st.includes('Lungs') && !st.includes('Pretend') && st.includes('hidden'), 'cd viewer: study details shown, patient name hidden');
  await page.click('.cd .cd-names');
  check((await page.textContent('.cd .cd-studies')).includes('Test Pretend'), 'cd viewer: names shown on request');
  await page.click('.cd .cd-open >> nth=0'); await page.waitForTimeout(500);
  check(await page.isVisible('.cd .cd-view') && await page.isHidden('.cd .cd-err'), 'cd viewer: series opens in the viewer');
  check(await page.evaluate(() => { const c = document.querySelector('.cd .cd-cv'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; for (let i = 0; i < d.length; i += 4) if (d[i] > 30) return true; return false; }), 'cd viewer: image drawn');
  let dl = page.waitForEvent('download'); await page.click('.cd .cd-png');
  { const d = await dl, b = readFileSync(await d.path()); check(d.suggestedFilename().endsWith('.png') && b.readUInt32BE(16) === 8 && b.readUInt32BE(20) === 8, 'cd viewer: PNG export (8x8)'); }
  await page.click('.cd .cd-mark'); await page.waitForTimeout(200);
  check((await page.textContent('.cd .cd-marked')).startsWith('1 image'), 'cd viewer: image chosen for PDF');
  dl = page.waitForEvent('download'); await page.click('.cd .cd-pdf');
  check((await dl).suggestedFilename() === 'scan-images.pdf', 'cd viewer: PDF of chosen images');
  check((await page.textContent('.cd .cd-list')).includes('Remove names before sharing'), 'cd viewer: anonymiser link');
};
