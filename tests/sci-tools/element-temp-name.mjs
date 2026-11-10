// #1357 temporary element names: checked against the names IUPAC used before the official ones (ununennium,
// unbinilium, ununoctium, unbiunium, unbibium, unnilquadium, unbitrium), the spelling rules (bium/trium, ennil),
// symbols (Uuo, Uue), and the reverse readers on every number 100 to 999.
import { tempName, fromName, fromSymbol, placeOf, questions } from '../../src/lib/sci/iupacname.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const names = { 104: 'Unnilquadium', 110: 'Ununnilium', 118: 'Ununoctium', 119: 'Ununennium', 120: 'Unbinilium', 121: 'Unbiunium', 122: 'Unbibium', 123: 'Unbitrium', 190: 'Unennilium', 200: 'Binilnilium', 999: 'Ennennennium' };
  check('element-temp-name: known temporary names', Object.entries(names).every(([z, nm]) => tempName(Number(z)).name === nm));
  check('element-temp-name: symbols Uuo, Uue, Ubn, Unq', tempName(118).symbol === 'Uuo' && tempName(119).symbol === 'Uue' && tempName(120).symbol === 'Ubn' && tempName(104).symbol === 'Unq');
  let ok = true; for (let z = 100; z <= 999; z++) { const t = tempName(z); if (fromName(t.name) !== z || fromSymbol(t.symbol) !== z) ok = false; }
  check('element-temp-name: name and symbol read back for every Z from 100 to 999', ok);
  check('element-temp-name: official names and places', placeOf(118).official.name === 'Oganesson' && placeOf(118).where === 'period 7, group 18' && placeOf(119).where.startsWith('period 8, group 1') && placeOf(130).official === null && placeOf(101).where.includes('f-block'));
  let q = true; const r = seeded(41); for (let i = 0; i < 200; i++) { const qs = questions(r); if (qs.length !== 4 || qs.some((x) => !(x.ans > 0))) q = false; }
  check('element-temp-name: questions', q);
};
