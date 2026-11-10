// #1710 Mail merge
import { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';
export const path = '/documents/mail-merge/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/mail-merge/`); await page.waitForTimeout(500);
  const doc = '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Dear {{Na</w:t></w:r><w:r><w:t>me}} of {{</w:t></w:r><w:r><w:t>City</w:t></w:r><w:r><w:t>}},</w:t></w:r></w:p></w:body></w:document>';
  const tpl = Buffer.from(zipSync({ 'word/document.xml': strToU8(doc), '[Content_Types].xml': strToU8('<Types/>') }));
  await page.setInputFiles('.mm .mm-csv', { name: 'list.csv', mimeType: 'text/csv', buffer: Buffer.from('Name,City\nAsha,Pune\n"Ben, Jr",Leeds\n') }); await page.waitForTimeout(200);
  check((await page.textContent('.mm .mm-csv-s')).startsWith('2 rows, columns: Name, City'), 'mm: csv read');
  await page.setInputFiles('.mm .mm-tpl', { name: 't.docx', mimeType: 'application/octet-stream', buffer: tpl }); await page.waitForTimeout(300);
  check((await page.textContent('.mm .mm-chips')) === 'NameCity' && (await page.textContent('.mm .mm-prev-box')) === 'Dear Asha of Pune,', `mm: split placeholders merged (${await page.textContent('.mm .mm-prev-box')})`);
  await page.click('.mm .mm-next');
  check((await page.textContent('.mm .mm-prev-box')) === 'Dear Ben, Jr of Leeds,', 'mm: next row');
  await page.selectOption('.mm .mm-namecol', 'Name');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.mm .mm-zip')]);
  const z = unzipSync(new Uint8Array(await (await import('node:fs')).promises.readFile(await dl.path())));
  const names = Object.keys(z).sort();
  check(names.join('|') === 'Ashat.docx'.replace('Ashat', 'Asha') + '|Ben-Jr.docx', `mm: zip names (${names})`);
  const inner = unzipSync(z['Asha.docx']);
  check(strFromU8(inner['word/document.xml']).includes('Pune'), 'mm: docx inside zip is filled');
  await page.setInputFiles('.mm .mm-tpl', { name: 'x.docx', mimeType: 'application/octet-stream', buffer: Buffer.from('not a zip') }); await page.waitForTimeout(200);
  check((await page.textContent('.mm .mm-tpl-s')).includes('not a Word'), 'mm: bad file refused');
  await page.click('.mm .mm-seg [data-m=text]');
  await page.fill('.mm .mm-subj', 'Hi {{name}}'); await page.fill('.mm .mm-body', 'From {{City}} {{Oops}}'); await page.waitForTimeout(150);
  check((await page.textContent('.mm .mm-prev-box')) === 'Subject: Hi Ben, Jr\n\nFrom Leeds {{Oops}}' && (await page.textContent('.mm .mm-warn')).includes('"Oops"'), 'mm: text mode with unknown field warning');
};
