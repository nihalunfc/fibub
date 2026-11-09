export const path = '/science/kinship-diagram/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(BASE + path, { timeout: 120000 });
  await page.waitForSelector('.kd-svg svg', { timeout: 60000 });
  const svgText = await page.textContent('.kd-svg svg');
  check(['Ego', 'FBD', 'MZS', 'FBW', 'MZH', 'MP', 'FF', 'FM', 'S', 'W', 'Z'].every((c) => svgText.includes(c)), 'kinship tool: kin types drawn in the diagram');
  check((await page.locator('.kd-svg svg polygon').count()) === 8 && (await page.locator('.kd-svg svg circle').count()) === 7, 'kinship tool: triangles, squares and circles (7 females)');
  const rowOf = async (name) => (await page.locator('.kd-tab tbody tr', { hasText: name }).first().textContent());
  check(/EshaFBDfather's brother's daughter0Blood/.test(await rowOf('Esha')), `kinship tool: Esha is FBD (${await rowOf('Esha')})`);
  check(/HariMZSmother's sister's son0Blood/.test(await rowOf('Hari')) && /DeviFBW.*\+1By marriage/.test(await rowOf('Devi')) && /LalitFF.*\+2/.test(await rowOf('Lalit')) && /KiranS.*−1/.test(await rowOf('Kiran')), 'kinship tool: MZS, FBW, generations');

  // Change Ego
  await page.selectOption('.kd-ego', 'p6');
  check(/RaviFBS/.test(await rowOf('Ravi')) && /EshaEgo/.test(await rowOf('Esha')), 'kinship tool: Ravi is FBS from Esha');
  await page.selectOption('.kd-ego', 'p1');

  // Labels off
  await page.uncheck('.kd-codes');
  check(!(await page.textContent('.kd-svg svg')).includes('FBD') && (await page.textContent('.kd-svg svg')).includes('Esha'), 'kinship tool: kin type labels can be hidden');
  await page.check('.kd-codes');

  // Downloads
  const grab = async (sel, name) => { const b = page.locator(sel); await b.scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), b.click()]); const p = OUT + name; await d.saveAs(p); return { name: d.suggestedFilename(), path: p }; };
  const svg = await grab('.kd-dsvg', 'kd.svg');
  const st = readFileSync(svg.path, 'utf8');
  check(svg.name === 'kinship-ravi.svg' && st.startsWith('<?xml') && /<svg[^>]*viewBox/.test(st) && st.includes('MZS') && st.includes('#000000'), 'kinship tool: SVG download, black on white');
  const png = await grab('.kd-dpng', 'kd.png');
  check(png.name === 'kinship-ravi.png' && readFileSync(png.path).subarray(1, 4).toString() === 'PNG', 'kinship tool: PNG download');
  const js = await grab('.kd-save', 'kd.json');
  const saved = JSON.parse(readFileSync(js.path, 'utf8'));
  check(js.name === 'kinship-ravi.json' && saved.format === 'fibub-kinship' && saved.people.length === 15 && saved.marriages.some((m) => m.divorced), 'kinship tool: save to a JSON file');
  const rep = await grab('.dl button[data-f="pdf"]', 'kd.pdf');
  check(rep.name === 'kinship-ravi.pdf', 'kinship tool: PDF report');

  // Add relative: a brother for Isha (shares her parents) and a wife for Hari.
  const isha = page.locator('.kd-person[data-id="p14"]');
  await isha.locator('.kd-rel').selectOption('B');
  check(/Isha's brotherB/.test(await rowOf("Isha's brother")), 'kinship tool: added brother shows as B');
  await page.locator('.kd-person[data-id="p9"] .kd-rel').selectOption('W');
  check(/Hari's wifeMZSW.*By marriage/.test(await rowOf("Hari's wife")), 'kinship tool: added wife of Hari is MZSW');
  await page.locator('.kd-person[data-id="p16"] .kd-rel').selectOption('D');
  check(/Kiran's daughterSD/.test(await rowOf("Kiran's daughter")), 'kinship tool: added daughter is SD');
  await page.locator('.kd-person[data-id="p13"] .kd-rel').selectOption('Z');
  check(/Add a parent of Noor first/.test(await page.textContent('.kd-msg')), 'kinship tool: sibling needs a parent first');

  // Rename, sex unknown, deceased
  await page.fill('.kd-person[data-id="p6"] .kd-name', 'E.');
  check(/E\.FBD/.test((await page.textContent('.kd-tab')).replace(/\s/g, '')), 'kinship tool: renaming updates the table');
  await page.locator('.kd-person[data-id="p6"] .kd-sex').selectOption('u');
  check(/FBC/.test(await page.textContent('.kd-tab')), 'kinship tool: unknown sex gives C');

  // Remove a person
  const n0 = await page.locator('.kd-person').count();
  const rm = page.locator('.kd-person[data-id="p4"] .kd-x'); await rm.scrollIntoViewIfNeeded(); await rm.click();
  check((await page.locator('.kd-person').count()) === n0 - 1 && /E\.–notconnected/.test((await page.textContent('.kd-tab')).replace(/\s/g, '')), 'kinship tool: removing Chetan disconnects his daughter');

  // Self-loop error
  await page.locator('.kd-person[data-id="p2"] .kd-p1').selectOption('p1');
  check(/own ancestor/.test(await page.textContent('.kd-err')), 'kinship tool: ancestor loop reported');

  // Open the saved file again
  await page.setInputFiles('.kd-file', js.path);
  await page.waitForFunction(() => /Opened/.test(document.querySelector('.kd-msg').textContent));
  check(/Opened kd\.json: 15 people/.test(await page.textContent('.kd-msg')) && /EshaFBD/.test(await rowOf('Esha')) && await page.isHidden('.kd-err'), 'kinship tool: reopens the saved file');
  writeFileSync(OUT + 'kd-bad.json', '{"hello": 1}');
  await page.setInputFiles('.kd-file', OUT + 'kd-bad.json');
  await page.waitForFunction(() => !document.querySelector('.kd-err').hidden);
  check(/not a kinship diagram file/.test(await page.textContent('.kd-err')), 'kinship tool: wrong file explained');

  // Start again and build from Ego
  await page.click('.kd-clear');
  check((await page.locator('.kd-person').count()) === 1, 'kinship tool: start again');
  await page.locator('.kd-person[data-id="p1"] .kd-rel').selectOption('M');
  await page.locator('.kd-person[data-id="p1"] .kd-rel').selectOption('F');
  check(/Ego's motherM/.test(await rowOf("Ego's mother")) && (await page.locator('.kd-mar').count()) === 1, 'kinship tool: adding two parents marries them');
  await page.click('.kd-add');
  check((await page.locator('.kd-person').count()) === 4 && /Person4–/.test((await page.textContent('.kd-tab')).replace(/\s/g, '')), 'kinship tool: add a person (not yet linked)');
  await page.click('.kd-example');
  check((await page.locator('.kd-person').count()) === 15, 'kinship tool: example reloads');
  check(!(await page.evaluate(() => Object.keys(localStorage).some((k) => /kin/i.test(k)))), 'kinship tool: nothing kept in the browser');
};
