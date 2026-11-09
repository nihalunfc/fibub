export const path = '/science/ipa-keyboard/';
export default async ({ page, check, BASE }) => {
  await page.goto(BASE + path);
  await page.waitForSelector('.ik-inv tbody tr');
  check((await page.$$('.ik-inv tbody tr')).length === 13 && /20 characters, 13 different\.$/.test(await page.textContent('.ik-invnote')), `ipa keyboard: example inventory (${await page.textContent('.ik-invnote')})`);
  check((await page.textContent('.ik-xsout')) === 'ˈfɑːðɚ', 'ipa keyboard: X-SAMPA example shown');
  check((await page.$$('.ik-cons .ik-k')).length === 59, 'ipa keyboard: 59 pulmonic consonant keys');
  // Clicking adds at the cursor.
  await page.click('.ik-clear');
  check((await page.inputValue('.ik-out')) === '' && /empty/.test(await page.textContent('.ik-invnote')), 'ipa keyboard: clear');
  await page.click('.ik-cons .ik-k[data-ch="ʃ"]');
  await page.click('.ik-tabs button[data-t=vow]');
  check(await page.isVisible('.ik-vow') && await page.isHidden('.ik-cons'), 'ipa keyboard: vowel tab');
  await page.click('.ik-vow .ik-k[data-ch="ɪ"]');
  await page.click('.ik-tabs button[data-t=pul]');
  await page.locator('.ik-cons .ik-k[data-ch="p"]').scrollIntoViewIfNeeded();
  await page.click('.ik-cons .ik-k[data-ch="p"]');
  check((await page.inputValue('.ik-out')) === 'ʃɪp', 'ipa keyboard: clicked symbols in order');
  check(/voiceless bilabial plosive, U\+0070, X-SAMPA p/.test(await page.textContent('.ik-last')), `ipa keyboard: name and code point shown (${await page.textContent('.ik-last')})`);
  // Insert in the middle: put the cursor after ʃ.
  await page.evaluate(() => { const t = document.querySelector('.ik-out'); t.focus(); t.setSelectionRange(1, 1); t.dispatchEvent(new Event('select')); });
  await page.click('.ik-tabs button[data-t=dia]');
  await page.click('.ik-dia .ik-k[data-ch="ʷ"]');
  check((await page.inputValue('.ik-out')) === 'ʃʷɪp', `ipa keyboard: diacritic inserted at the cursor (${await page.inputValue('.ik-out')})`);
  check((await page.textContent('.ik-dia .ik-k[data-ch="̃"]')) === '◌̃', 'ipa keyboard: combining marks shown on a dotted circle');
  await page.click('.ik-bs');
  check((await page.inputValue('.ik-out')) === 'ʃɪp', 'ipa keyboard: delete before the cursor');
  await page.click('.ik-tabs button[data-t=sup]'); await page.click('.ik-sup .ik-k[data-ch="ˈ"]');
  await page.click('.ik-tabs button[data-t=ton]');
  check((await page.$$('.ik-ton .ik-k')).length === 19, 'ipa keyboard: tone keys');
  await page.click('.ik-tabs button[data-t=oth]');
  check((await page.$$('.ik-other .ik-k')).length >= 35 && await page.isVisible('.ik-other .ik-k[data-ch="ǁ"]'), 'ipa keyboard: clicks and other symbols');
  // X-SAMPA.
  await page.fill('.ik-xs', 'D@ k{t_h');
  check((await page.textContent('.ik-xsout')) === 'ðə kætʰ', 'ipa keyboard: X-SAMPA converts as you type');
  await page.click('.ik-clear'); await page.click('.ik-xsadd');
  check((await page.inputValue('.ik-out')) === 'ðə kætʰ', 'ipa keyboard: X-SAMPA added to the transcription');
  await page.fill('.ik-out', 'tʃɛŋ, ɡ g'); await page.dispatchEvent('.ik-out', 'input');
  await page.click('.ik-toxs');
  check((await page.inputValue('.ik-xs')) === 'tSEN, g g', `ipa keyboard: transcription to X-SAMPA (${await page.inputValue('.ik-xs')})`);
  const inv = await page.textContent('.ik-inv');
  check(/U\+0261/.test(inv) && /typed from the keyboard/.test(inv) && /1 is not an IPA symbol on its own/.test(await page.textContent('.ik-invnote')), `ipa keyboard: inventory flags g and punctuation (${await page.textContent('.ik-invnote')})`);
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
  await page.click('.ik-copy');
  await page.waitForFunction(() => /Copied|Select/.test(document.querySelector('.ik-status')?.textContent || ''));
  const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => null));
  check(clip === 'tʃɛŋ, ɡ g', `ipa keyboard: copy (${clip})`);
};
