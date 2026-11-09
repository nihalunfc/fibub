// #499 dental chart: numbering checked against a separate Python table built by walking the Universal order round the
// mouth (dental.py), textbook pairs, and round trips; findings, CSV and DMFT checked by hand.
import * as D from '../../src/lib/sci/dental.ts';
const PY = {"uni": {"18": "1", "17": "2", "16": "3", "15": "4", "14": "5", "13": "6", "12": "7", "11": "8", "21": "9", "22": "10", "23": "11", "24": "12", "25": "13", "26": "14", "27": "15", "28": "16", "38": "17", "37": "18", "36": "19", "35": "20", "34": "21", "33": "22", "32": "23", "31": "24", "41": "25", "42": "26", "43": "27", "44": "28", "45": "29", "46": "30", "47": "31", "48": "32", "55": "A", "54": "B", "53": "C", "52": "D", "51": "E", "61": "F", "62": "G", "63": "H", "64": "I", "65": "J", "75": "K", "74": "L", "73": "M", "72": "N", "71": "O", "81": "P", "82": "Q", "83": "R", "84": "S", "85": "T"}, "pal": {"18": "UR8", "17": "UR7", "16": "UR6", "15": "UR5", "14": "UR4", "13": "UR3", "12": "UR2", "11": "UR1", "21": "UL1", "22": "UL2", "23": "UL3", "24": "UL4", "25": "UL5", "26": "UL6", "27": "UL7", "28": "UL8", "38": "LL8", "37": "LL7", "36": "LL6", "35": "LL5", "34": "LL4", "33": "LL3", "32": "LL2", "31": "LL1", "41": "LR1", "42": "LR2", "43": "LR3", "44": "LR4", "45": "LR5", "46": "LR6", "47": "LR7", "48": "LR8", "55": "URE", "54": "URD", "53": "URC", "52": "URB", "51": "URA", "61": "ULA", "62": "ULB", "63": "ULC", "64": "ULD", "65": "ULE", "75": "LLE", "74": "LLD", "73": "LLC", "72": "LLB", "71": "LLA", "81": "LRA", "82": "LRB", "83": "LRC", "84": "LRD", "85": "LRE"}};
export default async (check) => {
  const all = [...D.allTeeth(false), ...D.allTeeth(true)];
  check('dental: 32 permanent and 20 primary teeth, all valid and distinct', D.allTeeth(false).length === 32 && D.allTeeth(true).length === 20 && new Set(all).size === 52 && all.every(D.valid));
  check('dental: Universal numbers match the Python walk round the mouth (52 teeth)', all.every((f) => D.universal(f) === PY.uni[f]));
  check('dental: Palmer quadrant and mark match Python (52 teeth)', all.every((f) => D.palmer(f).text === PY.pal[f]));
  check('dental: textbook pairs', D.universal(11) === '8' && D.universal(18) === '1' && D.universal(28) === '16' && D.universal(38) === '17' && D.universal(36) === '19' && D.universal(46) === '30' && D.universal(48) === '32' && D.universal(55) === 'A' && D.universal(65) === 'J' && D.universal(75) === 'K' && D.universal(85) === 'T' && D.universal(51) === 'E' && D.universal(81) === 'P');
  check('dental: Palmer symbols', D.palmer(16).symbol === '6┘' && D.palmer(26).symbol === '└6' && D.palmer(36).symbol === '┌6' && D.palmer(46).symbol === '6┐' && D.palmer(54).symbol === 'D┘');
  let rt = true;
  for (const f of all) for (const sys of ['fdi', 'universal', 'palmer']) { const s = sys === 'fdi' ? String(f) : sys === 'universal' ? D.universal(f) : D.palmer(f).text; rt &&= D.parseTooth(s, sys) === f; }
  for (const f of all) rt &&= D.parseTooth(D.palmer(f).symbol, 'palmer') === f;
  check('dental: every tooth round-trips in all three systems', rt);
  check('dental: typed variants', D.parseTooth('#3', 'universal') === 16 && D.parseTooth('k', 'universal') === 75 && D.parseTooth('1.6', 'fdi') === 16 && D.parseTooth('ul e', 'palmer') === 65 && D.parseTooth('tooth 36', 'fdi') === 36);
  const bad = (s, y) => { try { D.parseTooth(s, y); return ''; } catch (e) { return e.message; } };
  check('dental: bad numbers', bad('19', 'fdi').includes('not an FDI') && bad('56', 'fdi').includes('not an FDI') && bad('33', 'universal').includes('Universal') && bad('U', 'universal').length > 0 && bad('UR9', 'palmer').includes('Palmer') && bad('', 'fdi').includes('Type'));
  check('dental: names', D.toothName(36) === 'Lower left first molar' && D.toothName(11) === 'Upper right central incisor' && D.toothName(54) === 'Upper right first molar (primary)' && D.toothName(48) === 'Lower right third molar');
  check('dental: surface names and letters', D.surfaceName(11, 'O') === 'incisal' && D.surfaceName(16, 'O') === 'occlusal' && D.surfaceName(16, 'L') === 'palatal' && D.surfaceName(36, 'L') === 'lingual' && D.surfaceName(13, 'B') === 'labial' && D.surfaceLetter(11, 'O') === 'I' && D.surfaceLetter(21, 'B') === 'F' && D.surfaceLetter(26, 'L') === 'P' && D.surfaceLetter(46, 'L') === 'L');
  check('dental: mesial side on the chart', D.patientRight(16) && D.patientRight(46) && !D.patientRight(26) && !D.patientRight(36) && D.patientRight(55));
  const c = new Map();
  D.markSurface(c, 16, 'O', 'caries'); D.markSurface(c, 16, 'M', 'caries'); D.markSurface(c, 16, 'D', 'filled');
  D.markTooth(c, 36, 'missing'); D.markTooth(c, 11, 'crown'); D.markSurface(c, 26, 'O', 'filled'); D.markTooth(c, 46, 'implant');
  D.rec(c, 21).note = 'Sensitive, "cold"'; D.markSurface(c, 17, 'B', 'caries'); D.markSurface(c, 17, 'B', 'caries');
  const fs = D.findings(c);
  check('dental: findings in chart order, toggles undo', fs.map((x) => `${x.fdi} ${x.condition} ${x.surfaces}`).join('|') === '16 Caries MO|16 Filled D|11 Crown |21 Note |26 Filled O|46 Implant |36 Missing ');
  check('dental: DMFT counts teeth (D 1, M 2, F 2)', JSON.stringify(D.dmft(c, false)) === '{"d":1,"m":2,"f":2,"total":5}' && D.dmft(c, true).total === 0);
  const csv = D.toCsv(c), back = D.fromCsv(csv);
  check('dental: CSV has every finding and round-trips', csv.split('\n')[0] === 'fdi,universal,palmer,tooth,condition,surfaces,note' && csv.includes('16,3,UR6,Upper right first molar,Caries,MO,') && csv.includes('"Sensitive, ""cold"""') && D.toCsv(back) === csv);
  D.markSurface(c, 36, 'O', 'filled');
  check('dental: a surface finding on a missing tooth clears missing', c.get(36).tooth === undefined && c.get(36).surfaces.O === 'filled');
  D.markTooth(c, 16, 'missing');
  check('dental: missing clears surfaces', Object.keys(c.get(16).surfaces).length === 0);
  const ce = (t) => { try { D.fromCsv(t); return ''; } catch (e) { return e.message; } };
  check('dental: CSV errors', ce('a,b\n1,2').includes('fdi and condition') && ce('fdi,condition\n19,missing').includes('not an FDI') && ce('fdi,condition,surfaces\n16,caries,').includes('needs surfaces') && ce('fdi,condition\n16,broken').includes('not a condition') && ce('fdi,condition,surfaces\n16,caries,MX').includes('"X"') && ce('').includes('empty'));
  check('dental: CSV with I, F and P letters', (() => { const x = D.fromCsv('fdi,condition,surfaces\n11,filled,IF\n26,caries,P'); return x.get(11).surfaces.O === 'filled' && x.get(11).surfaces.B === 'filled' && x.get(26).surfaces.L === 'caries'; })());
};
