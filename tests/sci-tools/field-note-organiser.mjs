// #763 Field note organiser: lists, search, counts and the Markdown/CSV/JSON round trip.
// The CSV was read back with Python's csv module, and tag/person counts and three searches were redone with
// pandas in an independent script on the same made-up notes: all agree.
import * as F from '../../src/lib/sci/fieldnotes.ts';

const NOTES = [
  { id: 'a', date: '2026-10-02', place: 'Harbour market', people: ['Fisher A', 'Vendor B'], tags: ['trade', 'morning'], text: 'Prices were called out before the boats landed.\nMost buyers paid cash.' },
  { id: 'b', date: '2026-10-03', place: 'Tea stall', people: ['Vendor B'], tags: ['kinship', 'Trade'], text: 'Vendor B said her cousin runs the stall on "market days", not others.' },
  { id: 'c', date: '2026-10-03', place: 'Harbour market', people: [], tags: ['morning'], text: 'Quiet, rain. Counted 14 boats, 3 left early; one, two, three.' },
  { id: 'd', date: '2026-10-05', place: 'Ferry landing', people: ['Ferry worker C', 'Fisher A'], tags: ['transport', 'trade'], text: 'Ferry fees discussed; the elders disagree.' },
];

export default async (check) => {
  check('fieldnotes: list splits on , ; and drops repeats', F.list(' a, b;A ,, #c ').join('|') === 'a|b|c');
  check('fieldnotes: valid dates only', F.validDate('2026-02-28') && !F.validDate('2026-02-30') && !F.validDate('26-1-1'));
  check('fieldnotes: newest first, same day keeps order', F.sortNotes(NOTES).map((n) => n.id).join('') === 'dbca');
  check('fieldnotes: tag counts merge case (pandas)', JSON.stringify(F.counts(NOTES, 'tags')) === JSON.stringify([['trade', 3], ['morning', 2], ['kinship', 1], ['transport', 1]]));
  check('fieldnotes: people counts (pandas)', JSON.stringify(F.counts(NOTES, 'people')) === JSON.stringify([['Fisher A', 2], ['Vendor B', 2], ['Ferry worker C', 1]]));
  check('fieldnotes: place counts', JSON.stringify(F.counts(NOTES, 'place')) === JSON.stringify([['Harbour market', 2], ['Ferry landing', 1], ['Tea stall', 1]]));
  check('fieldnotes: search one word (pandas)', F.filterNotes(NOTES, { q: 'market' }).map((n) => n.id).join('') === 'abc');
  check('fieldnotes: search needs every word (pandas)', F.filterNotes(NOTES, { q: 'fisher trade' }).map((n) => n.id).join('') === 'ad');
  check('fieldnotes: date range (pandas)', F.filterNotes(NOTES, { from: '2026-10-03', to: '2026-10-04' }).map((n) => n.id).join('') === 'bc');
  check('fieldnotes: tag, person and place filters ignore case', F.filterNotes(NOTES, { tag: 'TRADE', person: 'fisher a' }).map((n) => n.id).join('') === 'ad' && F.filterNotes(NOTES, { place: 'harbour market' }).length === 2);
  const csv = F.toCsv(NOTES);
  check('fieldnotes: CSV quotes commas, quotes and line breaks', csv.startsWith('date,place,people,tags,text\r\n2026-10-02,Harbour market,Fisher A; Vendor B,trade; morning,"Prices were called out before the boats landed.\nMost buyers paid cash."\r\n') && csv.includes('"Vendor B said her cousin runs the stall on ""market days"", not others."'));
  const md = F.toMarkdown(NOTES.slice(0, 1));
  check('fieldnotes: Markdown', md === '# Field notes\n\n## 2026-10-02 · Harbour market\n\n**People:** Fisher A, Vendor B  \n**Tags:** #trade #morning  \n\nPrices were called out before the boats landed.\nMost buyers paid cash.\n');
  let k = 0; const id = () => 'new' + ++k;
  const back = F.fromJson(F.toJson(NOTES), id);
  check('fieldnotes: JSON round trip', JSON.stringify(back.notes) === JSON.stringify(NOTES) && back.skipped.length === 0);
  const messy = F.fromJson(JSON.stringify([{ date: '2026-10-09', text: 'x', tags: 'a; b', people: ['P', 7] }, { date: 'yesterday', text: 'y' }, 5]), id);
  check('fieldnotes: import fixes ids and lists, skips bad entries', messy.notes.length === 1 && messy.notes[0].id === 'new1' && messy.notes[0].tags.join() === 'a,b' && messy.notes[0].people.join() === 'P' && messy.skipped.length === 2 && /valid date/.test(messy.skipped[0]));
  let msg = ''; try { F.fromJson('{nope', id); } catch (e) { msg = e.message; }
  check('fieldnotes: bad JSON message', /not valid JSON/.test(msg));
  msg = ''; try { F.fromJson('{"x":1}', id); } catch (e) { msg = e.message; }
  check('fieldnotes: no notes list message', /No notes found/.test(msg));
  const m = F.merge(NOTES.slice(0, 2), [NOTES[1], { ...NOTES[2], id: 'zz' }, { ...NOTES[0], id: 'other' }]);
  check('fieldnotes: merge skips same id and same content', m.added === 1 && m.dupes === 2 && m.notes.length === 3);
};
