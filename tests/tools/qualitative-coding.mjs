// #750 Qualitative coding: browser checks.
export const path = '/science/qualitative-coding/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const accept = (d) => d.accept().catch(() => {});
  page.on('dialog', accept);
  const vp0 = page.viewportSize();
  page.setDefaultTimeout(120000); // slow shared test machines
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto(BASE + path); await page.waitForTimeout(700);
  await page.evaluate(() => localStorage.removeItem('fibub-qualcode-v1'));
  await page.reload(); await page.waitForTimeout(700);
  const cells = (sel) => page.$$eval(sel + ' tbody tr', (trs) => trs.map((tr) => [...tr.cells].map((c) => c.textContent)));
  const click = async (sel) => { const l = page.locator(sel).first(); await l.scrollIntoViewIfNeeded(); await l.click(); await page.waitForTimeout(200); };
  // Select characters a..b of the shown document by walking the spans.
  const selectRange = (a, b) => page.evaluate(([a, b]) => {
    const spans = [...document.querySelectorAll('.qc-text span[data-s]')];
    const at = (x) => { for (const s of spans) { const st = Number(s.dataset.s), n = s.textContent.length; if (x >= st && x <= st + n) return [s.firstChild, x - st]; } };
    const r = document.createRange(); r.setStart(...at(a)); r.setEnd(...at(b));
    const sel = document.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }, [a, b]);

  let c = await cells('.qc-counts');
  check(c.length === 4 && c[2].join('|') === 'Support|2|2|1|5|3' && c[0].join('|') === 'Work|1|1|0|2|2', 'qc: example counts');
  let m = await cells('.qc-mat');
  check(m[3].join('|') === 'Staying or leaving|0|1|1|3' && m[1].join('|') === 'Cost of living|0|3|0|1', 'qc: overlap matrix');
  await page.selectOption('.qc-show', 'c'); await page.waitForTimeout(150);
  m = await cells('.qc-mat'); check(m[1][4] === '0.20' && m[2][4] === '0.14', 'qc: c-coefficient');
  await page.selectOption('.qc-show', 'n'); await page.selectOption('.qc-mode', 'document'); await page.waitForTimeout(150);
  m = await cells('.qc-mat'); check(m[1].join('|') === 'Cost of living|2|3|3|2', 'qc: document matrix');
  await page.selectOption('.qc-mode', 'overlap');
  await page.selectOption('.qc-rcode', { label: 'Staying or leaving' }); await page.waitForTimeout(150);
  const ret = await page.$$eval('.qc-ret li', (l) => l.map((x) => x.textContent));
  check(ret.length === 3 && ret[0].startsWith('The rent is high, but my neighbours') && /also Cost of living, Support/.test(ret[0]), 'qc: retrieve passages');
  check((await page.$$('.qc-text span[data-c]')).length > 3, 'qc: highlights drawn');

  // Tag a new passage: "That is where I feel I belong." (136..166) with a new code
  await page.fill('.qc-cname', 'Belonging'); await click('.qc-cadd');
  check((await page.$$('.qc-code')).length === 5, 'qc: code added');
  await page.fill('.qc-cname', 'belonging'); await click('.qc-cadd');
  check(/already a code/.test(await page.textContent('.qc-cerr')), 'qc: duplicate code name refused');
  await selectRange(135, 166); await page.waitForTimeout(150);
  check(/Selected: “That is where I feel I belong\.” \(30 characters\)/.test(await page.textContent('.qc-sel')), 'qc: selection read and trimmed');
  await click('.qc-code .apply[data-code]:has-text("Belonging")');
  c = await cells('.qc-counts');
  check(c[4].join('|') === 'Belonging|1|0|0|1|1' && /Tagged with Belonging/.test(await page.textContent('.qc-sel')), 'qc: passage tagged');
  await click('.qc-code .apply:has-text("Belonging")');
  check(/Select a passage/.test(await page.textContent('.qc-sel')), 'qc: no selection message');
  // Remove it again by clicking the highlight
  await page.evaluate(() => { document.getSelection().removeAllRanges(); const s = [...document.querySelectorAll('.qc-text span[data-c]')].find((x) => x.textContent.includes('belong')); s.click(); });
  await page.waitForTimeout(150);
  check(/Belonging: “That is where I feel I belong\.”/.test(await page.textContent('.qc-here')), 'qc: passage codes shown on click');
  await click('.qc-here button');
  c = await cells('.qc-counts'); check(c[4][4] === '0', 'qc: passage removed');

  // Exports
  const dl = async (f) => { const [d] = await Promise.all([page.waitForEvent('download'), click(`.qc-x[data-f="${f}"]`)]); return { name: d.suggestedFilename(), text: readFileSync(await d.path(), 'utf8') }; };
  let f = await dl('seg'); check(f.name === 'coded-passages.csv' && f.text.startsWith('﻿document,code,start,end,text\r\nInterview 1,Work,0,22,I moved here for work.') && f.text.trim().split('\r\n').length === 14, 'qc: passages CSV');
  f = await dl('counts'); check(f.text.includes('Support,2,2,1,5,3'), 'qc: counts CSV');
  f = await dl('matrix'); check(f.text.includes('Staying or leaving,0,1,1,3'), 'qc: matrix CSV');
  f = await dl('json'); const jp = OUT + 'qc-project.json'; writeFileSync(jp, f.text);
  check(JSON.parse(f.text).segments.length === 13 && JSON.parse(f.text).codes.length === 5, 'qc: project JSON');

  // Documents
  await click('.qc-paste summary'); await page.fill('.qc-pname', 'Note A'); await page.fill('.qc-ptext', 'A short pasted note about rent.'); await click('.qc-padd');
  check((await page.textContent('.qc-dh')) === 'Note A' && (await cells('.qc-counts'))[0].length === 7, 'qc: pasted document added');
  await page.setInputFiles('.qc-file', { name: 'Interview 9.txt', mimeType: 'text/plain', buffer: Buffer.from('Opened from a file.\r\nSecond line.') });
  await page.waitForTimeout(300);
  check((await page.textContent('.qc-dh')) === 'Interview 9' && (await page.textContent('.qc-text')) === 'Opened from a file.\nSecond line.', 'qc: .txt file opened');
  await click('.qc-rmdoc'); check((await page.textContent('.qc-dh')) === 'Note A', 'qc: document removed');

  // Keep, clear, import
  await page.check('.qc-keep'); await page.waitForTimeout(150);
  check(JSON.parse(await page.evaluate(() => localStorage.getItem('fibub-qualcode-v1'))).docs.length === 4, 'qc: kept when ticked');
  await page.reload(); await page.waitForTimeout(700);
  check((await page.$$eval('.qc-doc option', (o) => o.length)) === 4 && (await page.isChecked('.qc-keep')), 'qc: project back after reload');
  await click('.qc-clear');
  check((await page.evaluate(() => localStorage.getItem('fibub-qualcode-v1'))) === null && (await page.$$('.qc-code')).length === 0 && !(await page.isChecked('.qc-keep')), 'qc: clear all');
  await page.setInputFiles('.qc-jfile', jp); await page.waitForTimeout(1000);
  check((await cells('.qc-counts')).length === 5 && (await page.$$eval('.qc-doc option', (o) => o.length)) === 3, 'qc: import JSON');
  await page.setInputFiles('.qc-jfile', { name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('[1]') }); await page.waitForTimeout(300);
  check(/not a coding project/.test(await page.textContent('.qc-ierr')), 'qc: wrong file message');
  await page.setViewportSize({ width: 375, height: 800 });
  await page.screenshot({ path: OUT + 'qualitative-coding-375.png', fullPage: false });
  page.setDefaultTimeout(30000);
  if (vp0) await page.setViewportSize(vp0);
  await page.evaluate(() => localStorage.removeItem('fibub-qualcode-v1'));
  page.off('dialog', accept);
};
