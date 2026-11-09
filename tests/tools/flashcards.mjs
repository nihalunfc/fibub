// #824 flashcards with SM-2
export const path = '/science/flashcards/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const F = '.fcd ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  await page.evaluate(() => { try { localStorage.removeItem('fibub-flashcards-v1'); } catch {} }); await page.reload(); await page.waitForTimeout(400);
  const facts = async () => (await page.textContent(F + '.fc-facts')).replace(/\s+/g, '');
  check((await facts()) === 'Duetoday0Newtoday10Cards10Mature0' && (await page.textContent(F + '.fc-study')) === 'Study now (10 cards)' && (await page.textContent(F + '.fc-store')).includes('Nothing is sent to fibub'), 'flashcards: example deck, facts and storage statement');
  await page.fill(F + '.fc-newday', '4'); await page.dispatchEvent(F + '.fc-newday', 'change'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-study')) === 'Study now (4 cards)', 'flashcards: new cards per day');
  await page.click(F + '.fc-study'); await page.waitForTimeout(200);
  check((await page.textContent(F + '.fc-front')) === 'SI unit of force' && await page.isHidden(F + '.fc-back') && await page.isHidden(F + '.fc-grades') && (await page.textContent(F + '.fc-left')).startsWith('4 to go'), 'flashcards: session shows the first front');
  await page.keyboard.press('Space'); await page.waitForTimeout(100);
  check(await page.isVisible(F + '.fc-back') && (await page.textContent(F + '.fc-back')).startsWith('newton') && (await page.textContent(F + '.fc-g.g5 small')) === '1 day' && (await page.textContent(F + '.fc-g.g2 small')) === '1 day, again today', 'flashcards: Space shows the answer and each grade’s next interval');
  await page.click(F + '.fc-g.g5'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-front')) === 'SI unit of electric charge', 'flashcards: next card after a grade');
  await page.click(F + '.fc-show'); await page.keyboard.press('2'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-front')) === 'Avogadro constant' && (await page.textContent(F + '.fc-left')).includes('1 again'), 'flashcards: key 2 grades and the card will come back');
  await page.keyboard.press('Space'); await page.keyboard.press('4'); await page.waitForTimeout(100);
  // Queue now: Speed of light, then the charge card again.
  await page.keyboard.press('Space'); await page.keyboard.press('3'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-front')) === 'SI unit of electric charge' && (await page.textContent(F + '.fc-left')).includes('once more') && (await page.textContent(F + '.fc-g.g5 small')) === 'done for today', 'flashcards: a wrong card comes back the same day as drill');
  await page.keyboard.press('Space'); await page.keyboard.press('5'); await page.waitForTimeout(100);
  await page.keyboard.press('Space'); await page.keyboard.press('4'); await page.waitForTimeout(150);
  check(await page.isVisible(F + '.fc-donebox') && (await page.textContent(F + '.fc-donemsg')) === 'Well done: 4 cards learned today.' && (await page.textContent(F + '.fc-donesub')) === 'Next review tomorrow.', 'flashcards: session done when every card reached 4 or 5');
  check((await facts()) === 'Duetoday0Newtoday0Cards10Mature0' && await page.isDisabled(F + '.fc-study') && (await page.textContent(F + '.fc-nothing')).startsWith('All done for today. Next review tomorrow.'), 'flashcards: nothing more today');
  { const s = (await page.textContent(F + '.fc-sfacts')).replace(/\s+/g, ''); check(s === 'New6Learning4Young0Mature0Answers,30days4Right,30days75%Duetomorrow4Averageeasiness2.41', `flashcards: statistics (${s})`); }
  check(await page.isVisible(F + '.fc-hist') && (await page.getAttribute(F + '.fc-fore', 'aria-label')).includes('0, 4, 0'), 'flashcards: charts drawn');
  // Add, edit, forget, delete.
  await page.click(F + '.fc-fsave'); check((await page.textContent(F + '.fc-ferr')).includes('both the front and the back'), 'flashcards: card needs both sides');
  await page.fill(F + '.fc-ffront', 'Unit of power'); await page.fill(F + '.fc-fback', 'watt'); await page.fill(F + '.fc-ftags', 'physics'); await page.click(F + '.fc-fsave'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-fmsg')).includes('11 cards'), 'flashcards: card added');
  await page.fill(F + '.fc-q', 'watt'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-count')).startsWith('1 of 11'), 'flashcards: search the cards');
  await page.click(F + '.fc-tab .fc-edit'); await page.fill(F + '.fc-fback', 'watt (W)'); await page.click(F + '.fc-fsave'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-tab')).includes('watt (W)'), 'flashcards: card edited');
  await page.click(F + '.fc-tab .fc-edit'); page.once('dialog', (d) => d.accept()); await page.click(F + '.fc-fdel'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-count')).startsWith('0 of 10'), 'flashcards: card deleted');
  await page.fill(F + '.fc-q', 'force'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-tab')).includes('tomorrow') && (await page.textContent(F + '.fc-tab')).includes('2.60'), 'flashcards: list shows next review and easiness');
  await page.click(F + '.fc-tab .fc-edit'); page.once('dialog', (d) => d.accept()); await page.click(F + '.fc-freset'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-tab')).includes('new') && (await facts()) === 'Duetoday0Newtoday1Cards10Mature0', 'flashcards: forget progress makes it new again');
  await page.fill(F + '.fc-q', '');
  // Import an Anki export.
  await page.click(F + '.fc-import'); check((await page.textContent(F + '.fc-ierr')).includes('Paste a list'), 'flashcards: import with nothing pasted');
  await page.fill(F + '.fc-paste', '#separator:tab\n#html:true\nWhat is <b>ATP</b>?\tAdenosine<br>triphosphate\tbio\nNa\tsodium\t\nno back\t\t\n');
  await page.click(F + '.fc-import'); await page.waitForTimeout(100);
  { const m = await page.textContent(F + '.fc-imsg'); check(m.startsWith('Added 2 cards to "Science basics (example)"') && m.includes('Row 3') && (await facts()).includes('Cards12'), `flashcards: Anki import (${m})`); }
  await page.click(F + '.fc-import'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-imsg')).includes('2 already in the deck were skipped'), 'flashcards: duplicates skipped');
  // A CSV file into a new deck, swapped.
  writeFileSync(OUT + 'cards.csv', 'Front,Back\n"Gold, symbol",Au\nIron symbol,Fe\nNeon symbol,Ne\n');
  await page.setInputFiles(F + '.dfb-in', OUT + 'cards.csv'); await page.waitForTimeout(300);
  await page.check(F + '.fc-swap'); await page.selectOption(F + '.fc-into', 'new'); await page.click(F + '.fc-import'); await page.waitForTimeout(150);
  check((await page.$eval(F + '.fc-deck', (s) => s.options[s.selectedIndex].text)).match(/^Imported \d{4}-\d\d-\d\d \(3\)$/) && (await page.textContent(F + '.fc-tab')).includes('Gold, symbol'), 'flashcards: CSV file into a new deck');
  await page.click(F + '.fc-study'); await page.waitForTimeout(100);
  check((await page.textContent(F + '.fc-front')) === 'Au', 'flashcards: swapped sides');
  await page.click(F + '.fc-end'); await page.waitForTimeout(100);
  // Rename and new deck.
  page.once('dialog', (d) => d.accept('Elements')); await page.click(F + '.fc-rename'); await page.waitForTimeout(100);
  check((await page.$eval(F + '.fc-deck', (s) => s.options[s.selectedIndex].text)) === 'Elements (3)', 'flashcards: rename a deck');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(F + '.fc-anki')]); const f = OUT + 'deck.txt'; await d.saveAs(f); const t = readFileSync(f, 'utf8').split('\n');
    check(t[0] === '#separator:tab' && t.length === 7 && t[3] === 'Au\t"Gold, symbol"\t'.replace('"Gold, symbol"', 'Gold, symbol') && d.suggestedFilename() === 'Elements.txt', `flashcards: Anki text export (${t[3]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(F + '.fc-csv')]); const f = OUT + 'deck.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 4 && t[0].startsWith('Front,Back,Tags,Reviews') && t[1].endsWith(',new,'), 'flashcards: schedule CSV'); }
  const [dj] = await Promise.all([page.waitForEvent('download'), page.click(F + '.fc-json')]); const jf = OUT + 'cards.json'; await dj.saveAs(jf);
  check(JSON.parse(readFileSync(jf, 'utf8')).decks.length === 2, 'flashcards: JSON backup of all decks');
  // Kept after reload.
  await page.reload(); await page.waitForTimeout(400);
  check((await page.$eval(F + '.fc-deck', (s) => s.options[s.selectedIndex].text)) === 'Elements (3)' && (await page.$$eval(F + '.fc-deck option', (o) => o.length)) === 2, 'flashcards: decks kept after reload');
  page.once('dialog', (d) => d.accept()); await page.click(F + '.fc-deldeck'); await page.waitForTimeout(100);
  check((await page.$$eval(F + '.fc-deck option', (o) => o.length)) === 1 && (await facts()).includes('Duetoday0'), 'flashcards: delete a deck');
  page.once('dialog', (d) => d.accept()); await page.click(F + '.fc-clear'); await page.waitForTimeout(100);
  check((await page.evaluate(() => localStorage.getItem('fibub-flashcards-v1'))) === null && (await facts()).includes('Cards0') && (await page.textContent(F + '.fc-nothing')).includes('empty'), 'flashcards: clear all');
  page.once('dialog', (d) => d.accept()); await page.setInputFiles(F + '.fc-jfile', jf); await page.waitForTimeout(300);
  check((await page.textContent(F + '.fc-bmsg')).includes('2 decks, 15 cards'), 'flashcards: open a backup');
  writeFileSync(OUT + 'bad-cards.json', '[]'); await page.setInputFiles(F + '.fc-jfile', OUT + 'bad-cards.json'); await page.waitForTimeout(200);
  check((await page.textContent(F + '.fc-bmsg')).includes('no decks'), 'flashcards: wrong backup file');
  page.once('dialog', (d) => d.accept('Spare')); await page.click(F + '.fc-newdeck'); await page.waitForTimeout(100);
  check((await page.$eval(F + '.fc-deck', (s) => s.options[s.selectedIndex].text)) === 'Spare (0)', 'flashcards: new deck');
  await page.evaluate(() => { try { localStorage.removeItem('fibub-flashcards-v1'); } catch {} });
};
