export const path = '/science/ipa-feature-matrix/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const dl = async (sel) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return p; };
  const big = () => page.textContent('.fm-big');
  await page.goto(BASE + path);
  await page.waitForSelector('.fm-tab tbody tr');
  check(/^36 segments\.$/.test(await page.textContent('.fm-info')) && (await page.$$('.fm-tab thead button')).length === 36, 'feature matrix: example inventory');
  check((await page.$$('.fm-tab tbody tr')).length === 27, 'feature matrix: 27 feature rows');
  check((await big()) === 'p t k = [−delayed release, −voice]', `feature matrix: p t k (${await big()})`);
  check((await page.$$('.fm-tab tr.fm-shared')).length === 14, 'feature matrix: 14 shared features in bold');
  const sRow = await page.$$eval('.fm-tab tbody tr', (rows) => rows.find((r) => r.cells[0].textContent === 'strident').textContent);
  check(sRow.startsWith('strident000000+−+++−++++') , `feature matrix: strident row (${sRow})`);
  // Choosing by tapping column heads.
  await page.click('.fm-none');
  check(/Choose two or more/.test(await big()), 'feature matrix: clear the choice');
  for (const ch of ['m', 'n', 'ŋ']) await page.click(`.fm-tab thead button:text-is("${ch}")`);
  check((await page.inputValue('.fm-pick')) === 'm n ŋ' && (await big()) === 'm n ŋ = [+nasal]', `feature matrix: tap m n ŋ (${await big()})`);
  await page.fill('.fm-pick', 's z ʃ ʒ ʧ d͡ʒ');
  check((await big()) === 's ʃ z ʒ t͡ʃ d͡ʒ = [−labial, +strident]' && /\[\+coronal, \+strident\]/.test(await page.textContent('.fm-facts')), `feature matrix: sibilants with a ligature (${await big()})`);
  await page.fill('.fm-pick', 'p z');
  check(/not a natural class/.test(await big()) && /plus t b d f θ s ʃ v ð ʒ t͡ʃ d͡ʒ/.test(await page.textContent('.fm-facts')), 'feature matrix: p z not a natural class');
  // Find by features.
  check((await page.textContent('.fm-found')) === '[+voice, −sonorant]: b d ɡ v ð z ʒ d͡ʒ', `feature matrix: find by features (${await page.textContent('.fm-found')})`);
  await page.fill('.fm-spec', '+syl +hi -bk');
  check((await page.textContent('.fm-found')) === '[+syllabic, +high, −back]: i ɪ', 'feature matrix: short feature names');
  await page.fill('.fm-spec', '+wobbly');
  check(/not a feature name/.test(await page.textContent('.fm-serr')), 'feature matrix: unknown feature explained');
  // Hide constant rows and diacritics.
  await page.fill('.fm-in', 'tʰ t d n ẽ e aː ☺'); await page.waitForFunction(() => /^7 segments/.test(document.querySelector('.fm-info')?.textContent || ''), null, { timeout: 5000 }).catch(() => {});
  check(/^7 segments\./.test(await page.textContent('.fm-info')) && /left out: ☺/.test(await page.textContent('.fm-err')), 'feature matrix: unknown symbol reported');
  await page.check('.fm-hide');
  const rows = await page.$$eval('.fm-tab tbody tr', (r) => r.map((x) => x.cells[0].textContent));
  check(!rows.includes('tap') && rows.includes('spread glottis') && rows.includes('long'), `feature matrix: constant rows hidden (${rows.length} left)`);
  await page.fill('.fm-pick', 'ẽ');
  check(/ẽ/.test(await big()), 'feature matrix: nasalised vowel chosen');
  await page.uncheck('.fm-hide');
  // Exports.
  const c = readFileSync(await dl('.fm-csv'), 'utf8').replace(/^﻿/, '').trim().split(/\r?\n/);
  check(c.length === 28 && c[0] === 'feature,tʰ,t,d,n,ẽ,e,aː' && c.find((l) => l.startsWith('spread glottis,')) === 'spread glottis,+,-,-,-,-,-,-' && c.find((l) => l.startsWith('long,')).endsWith(',+'), 'feature matrix: CSV');
  const tex = readFileSync(await dl('.fm-tex'), 'utf8');
  check(/\\begin\{tabular\}\{l\|ccccccc\}/.test(tex) && / & tʰ & t & d & n & ẽ & e & aː \\\\/.test(tex) && /nasal & \$-\$ & \$-\$ & \$-\$ & \$\+\$ & \$\+\$ & \$-\$ & \$-\$ \\\\/.test(tex), 'feature matrix: LaTeX tabular');
  await page.click('.fm-cons');
  check((await page.$$('.fm-tab thead button')).length === 59 && await page.isHidden('.fm-err'), 'feature matrix: all chart consonants');
  await page.click('.fm-vow');
  check((await page.$$('.fm-tab thead button')).length === 28, 'feature matrix: all chart vowels');
};
