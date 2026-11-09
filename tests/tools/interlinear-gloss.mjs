// #737 Interlinear gloss formatter: browser checks.
export const path = '/science/interlinear-gloss/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp0 = page.viewportSize();
  page.setDefaultTimeout(120000); // slow shared test machines
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto(BASE + path); await page.waitForTimeout(700);
  const code = () => page.inputValue('.ig-code');
  const fmt = async (f) => { const b = page.locator(`.ig-fmt button[data-f="${f}"]`); await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(100); };
  const setIn = async (v) => { await page.fill('.ig-in', v); await page.waitForTimeout(1200); };

  check(/All words and morphemes line up/.test(await page.textContent('.ig-ok')) && /2 examples, 4 words/.test(await page.textContent('.ig-ok')), 'ig: example passes');
  check((await page.$$('.ig-ex')).length === 2 && (await page.$$('.ig-w')).length === 4 && (await page.$$('.ig-w.bad')).length === 0, 'ig: aligned preview');
  check((await page.$$eval('.ig-view .sc', (s) => s.map((x) => x.textContent).join(' '))) === 'PL DAT PST IMP 1SG DAT 3SG M ACC', 'ig: small caps labels');
  check(await page.$eval('.ig-view .sc', (s) => getComputedStyle(s).fontVariantCaps === 'small-caps'), 'ig: small caps style');
  const ab = await page.$$eval('.ig-ab tbody tr', (t) => t.map((r) => r.cells[0].textContent + '=' + r.cells[1].textContent));
  check(ab.length === 9 && ab[0] === 'PL=plural' && ab.includes('1=first person'), `ig: abbreviation list (${ab.length})`);

  check((await code()).split('\n')[2] === '    Çocuk-lar  okul-a      git-ti.', 'ig: plain text export aligned');
  await fmt('html'); check((await code()).includes('font-variant:small-caps') && (await code()).startsWith('<div class="igt"'), 'ig: HTML export');
  await fmt('gb4e'); check((await code()).includes('child-\\textsc{pl} school-\\textsc{dat} go-\\textsc{pst}\\\\') && /gb4e/.test(await page.textContent('.ig-fnote')), 'ig: gb4e export');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ig-dl')]);
  check(d.suggestedFilename() === 'glosses-gb4e.tex' && readFileSync(await d.path(), 'utf8').includes('\\begin{exe}'), 'ig: .tex download');
  await fmt('expex'); check((await code()).includes('\\glpreamble Dámelo.//') && (await code()).includes('\\glft `Give it to me.\'//'), 'ig: expex export');
  await fmt('plain');
  const [p] = await Promise.all([page.waitForEvent('download'), page.click('.ig-dl')]);
  check(p.suggestedFilename() === 'glosses.txt', 'ig: plain text download');

  const orig = await page.inputValue('.ig-in');
  await setIn(orig.replace('go-PST', 'go'));
  check(/1 problem/.test(await page.textContent('.ig-ok')) && /Word 3: "git-ti\." has 2 morphemes but its gloss "go" has 1/.test(await page.textContent('.ig-probs')) && (await page.$$('.ig-w.bad')).length === 1, 'ig: morpheme count problem shown');
  await setIn(orig.replace('Da=me=lo.', 'Da-me=lo.'));
  check(/hyphen where its gloss .* has a clitic boundary/.test(await page.textContent('.ig-probs')), 'ig: boundary kind problem');
  await setIn(orig.replace('child-PL school-DAT go-PST', 'child-PL school-DAT'));
  check(/3 words but the gloss line has 2/.test(await page.textContent('.ig-probs')), 'ig: word count problem ' + await page.textContent('.ig-probs'));
  await setIn('a-b\nx-y');
  check(await page.locator('.ig-err').isVisible() && /has 2 lines; it needs 4/.test(await page.textContent('.ig-err')), 'ig: line count error');
  await page.locator('.ig-src').uncheck(); await page.waitForTimeout(200);
  check(await page.locator('.ig-err').isHidden() && /All words/.test(await page.textContent('.ig-ok')), 'ig: without original line');
  await setIn('b<um>ili\n<AV>buy\nbought');
  check(/not in the list/.test(await page.textContent('.ig-ab')), 'ig: unknown label flagged');
  await page.click('.ig details summary'); await page.fill('.ig-abbr', 'AV = actor voice'); await page.waitForTimeout(1200);
  check((await page.textContent('.ig-ab')).includes('actor voice'), 'ig: own abbreviation used');
  await page.locator('.ig-src').check();
  await page.reload(); await page.waitForTimeout(600);
  await page.setViewportSize({ width: 375, height: 800 });
  await page.screenshot({ path: OUT + 'interlinear-gloss-375.png', fullPage: false });
  page.setDefaultTimeout(30000);
  if (vp0) await page.setViewportSize(vp0);
};
