// #1241 Ratio mixer
export const path = '/learn/ratio-mixer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ratio-mixer/`); await page.waitForSelector('.rx .rx-fig .rx-fill');
  const R = '.rx ', txt = (s) => page.textContent(R + s);
  const fill = (k) => page.getAttribute(R + '.rx-f' + k, 'fill');
  check((await txt('.rx-verdict')) === 'Same ratio: the same colour.' && (await fill('A')) === (await fill('B')), 'rx: 2:3 and 4:6 same colour');
  check((await txt('.rx-rb')).includes('= 2 : 3 (divide both by 2)') && (await txt('.rx-ra')).includes('40%'), 'rx: simplest form and share');
  check((await page.$$(R + '.rx-p1')).length === 6 && (await page.$$(R + '.rx-p2')).length === 9, 'rx: part squares');
  check((await txt('.rx-make')).includes('one part = 30 ÷ 5 = 6 cups') && (await txt('.rx-make')).includes('= 12 cups') && (await txt('.rx-make')).includes('= 18 cups'), 'rx: make 30 cups');
  check((await page.$$(R + '.rx-tab tr')).length === 6, 'rx: table of multiples');
  await page.click(R + '.rx-pre[data-p="2,3,3,4"]'); await page.waitForTimeout(80);
  check((await txt('.rx-verdict')) === 'Mix B is bluer.' && (await txt('.rx-cmp')).includes('2 × 4 = 8 and 3 × 3 = 9') && (await fill('A')) !== (await fill('B')), 'rx: 2:3 vs 3:4, B bluer');
  await page.click(R + '.rx-b[data-v="b1"][data-d="-1"]'); await page.click(R + '.rx-b[data-v="b1"][data-d="-1"]'); await page.waitForTimeout(80);
  check((await txt('.rx-b1')) === '1' && (await txt('.rx-verdict')) === 'Mix A is bluer.', 'rx: minus buttons, A bluer');
  for (let i = 0; i < 4; i++) await page.click(R + '.rx-b[data-v="b2"][data-d="-1"]');
  await page.click(R + '.rx-b[data-v="b1"][data-d="-1"]'); await page.waitForTimeout(80);
  check((await txt('.rx-b1')) === '1' && (await txt('.rx-b2')) === '0', 'rx: a mix keeps at least one part');
  await page.click(R + '.rx-mode button[data-m="juice"]'); await page.click(R + '.rx-pre[data-p="1,4,2,7"]'); await page.waitForTimeout(80);
  check((await txt('.rx-verdict')) === 'Mix B is stronger.' && (await txt('.rx-n1')) === 'Syrup' && (await txt('.rx-make')).includes('glasses'), 'rx: lemonade mode, 2:7 stronger than 1:4');
  await page.fill(R + '.rx-tot', '0'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.rx-err'), 'rx: bad total message');
  await page.fill(R + '.rx-tot', '45'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.rx-err') && (await txt('.rx-make')).includes('= 9 glasses') && (await txt('.rx-make')).includes('= 36 glasses'), 'rx: 45 glasses of 1:4');
  // Quiz: answers read from the worked text.
  check((await page.$$(R + '.sm-q')).length === 5, 'rx: five questions');
  const get = [
    (w) => { const m = /giving (\d+) : (\d+)/.exec(w); return m && `${m[1]}, ${m[2]}`; },
    (w) => { const m = /x = \d+ × \d+ = (\d+)/.exec(w); return m && m[1]; },
    (w) => { const m = /= ([\d.]+) L and \d+ × [\d.]+ = ([\d.]+) L\.$/.exec(w); return m && `${m[1]}, ${m[2]}`; },
    (w) => { const m = /= ([\d.]+)%\.$/.exec(w); return m && m[1]; },
    (w) => (/so A has/.test(w) ? '1' : '2'),
  ];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, get[i - 1](w) || 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `rx: quiz question ${i} (${w})`);
  }
};
