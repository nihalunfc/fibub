// #1790 Markdown to PDF
export const path = '/documents/markdown-to-pdf/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/markdown-to-pdf/`); await page.waitForTimeout(300);
  await page.fill('.mtp-in', '# Report\n\n- one\n- two\n\n| Item | Qty |\n|---|---:|\n| Pens | 3 |\n\n**bold** <script>x</script> [bad](javascript:alert(1)) ![p](pic.png)\n\n## Second');
  await page.waitForTimeout(100);
  check(await page.textContent('.mtp-page h1') === 'Report', 'markdown-to-pdf: heading renders');
  check((await page.$$('.mtp-page li')).length === 2, 'markdown-to-pdf: two list items');
  check((await page.$$('.mtp-page table th')).length === 2 && (await page.$$('.mtp-page table td')).length === 2, 'markdown-to-pdf: table has 2 header and 2 body cells');
  check((await page.$$('.mtp-page script')).length === 0 && (await page.$$('.mtp-page a[href^=javascript]')).length === 0, 'markdown-to-pdf: script and javascript links are not rendered');
  check((await page.$$('.mtp-page img')).length === 0 && /pic\.png/.test(await page.textContent('.mtp-imgs')), 'markdown-to-pdf: missing local picture is flagged, not fetched');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  await page.setInputFiles('.mtp-img', [{ name: 'pic.png', mimeType: 'image/png', buffer: png }]);
  await page.waitForTimeout(150);
  check((await page.$$('.mtp-page img')).length === 1, 'markdown-to-pdf: local picture shows once added');
  await page.check('.mtp-toc'); await page.waitForTimeout(100);
  check((await page.$$('.mtp-page .md-toc a')).length === 2, 'markdown-to-pdf: table of contents lists 2 headings');
  await page.selectOption('.mtp-size', 'letter'); await page.waitForTimeout(100);
  check(/size: letter/.test(await page.$eval('.mtp-pagecss', (e) => e.textContent)), 'markdown-to-pdf: page size reaches the print rule');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.mtp-html')]);
  check(/\.html$/.test(dl.suggestedFilename()), 'markdown-to-pdf: HTML download');
};
