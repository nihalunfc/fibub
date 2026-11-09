// The Learn area's class pages (/learn/class-8/ ... /learn/class-12/) and the "In the school syllabus" links.
// No `path` export: these are not tool pages, so the tool-page checks (step picture) don't apply.
export default async ({ page, check, BASE }) => {
  const want = { 'class-8': 27, 'class-9': 27, 'class-10': 27, 'class-11': 56, 'class-12': 50 };
  for (const [id, n] of Object.entries(want)) {
    await page.goto(`${BASE}/learn/${id}/`);
    const chapters = await page.locator('.lc-ch').count();
    check(chapters === n, `learn ${id}: lists every chapter (${chapters} of ${n})`);
    const links = await page.$$eval('.lc-tools a', (as) => as.map((a) => a.getAttribute('href')));
    check(links.length > 0 && links.every((h) => /^\/(learn|science|everyday|money|documents)\/[a-z0-9-]+\/$/.test(h)), `learn ${id}: chapter tools link to tool pages (${links.length})`);
  }
  await page.goto(`${BASE}/learn/class-10/`);
  const first = await page.getAttribute('.lc-tools a', 'href');
  const r = await page.request.get(BASE + first);
  check(r.ok(), `learn class-10: first chapter tool opens (${first})`);
  check(await page.locator('#science-11 .lc-tools a[href="/science/circuit-simulator/"]').count() === 1, 'learn class-10: electricity chapter links the circuit simulator');
  await page.goto(`${BASE}/learn/school/`);
  check(await page.locator('a.ar-card[href="/learn/class-12/"]').count() === 1, 'learn school: a card per class links to its page');
  await page.goto(`${BASE}/science/circuit-simulator/`);
  const syl = await page.locator('nav[aria-label="In the school syllabus"] a').allInnerTexts();
  check(syl.some((t) => t === 'Class 10 Science, chapter 11: Electricity'), `tool page: lists where it is in the school syllabus (${syl.length})`);
  await page.click('nav[aria-label="In the school syllabus"] a[href="/learn/class-10/#science-11"]');
  await page.waitForURL(/\/learn\/class-10\/#science-11$/);
  check(true, 'tool page: syllabus link opens the class page at the chapter');
};
