// #193 Cryovial inventory and freezing helper. The freezing sums (cells, total medium, DMSO / serum / medium
// volumes, suspension to spin down, vials possible) were checked against an independent Python script on the
// worked example and five random cases; the CSV export was read back with Python's csv module (counts per line,
// cells in stock), the free-place fill order was worked out independently in Python, and a CSV written by
// Python's csv.writer (commas, doubled quotes and a line break inside cells) is read by the page's parser.
import * as C from '../../src/lib/sci/cryovial.ts';

const CASES = [{"n": 10, "cpv": 1000000.0, "ml": 1.0, "d": 10, "s": 20, "x": 10, "cpm": 800000.0, "susp": 20, "out": {"cellsInVials": 10000000.0, "cellsNeeded": 11000000.0, "conc": 1000000.0, "totalMl": 11.0, "dmsoMl": 1.1, "serumMl": 2.2, "mediumMl": 7.7, "spinMl": 13.75, "haveCells": 16000000.0, "maxVials": 14, "coolMin": 100.0}}, {"n": 36, "cpv": 4726000.0, "ml": 1.69, "d": 5, "s": 20, "x": 10, "cpm": 2678000.0, "susp": 12.9, "out": {"cellsInVials": 170136000.0, "cellsNeeded": 187149600.00000003, "conc": 2796449.7041420117, "totalMl": 66.924, "dmsoMl": 3.3462, "serumMl": 13.3848, "mediumMl": 50.193000000000005, "spinMl": 69.88409260642271, "haveCells": 34546200.0, "maxVials": 6, "coolMin": 102.0}}, {"n": 20, "cpv": 1723000.0, "ml": 0.95, "d": 10, "s": 10, "x": 5, "cpm": 4057000.0, "susp": 25.4, "out": {"cellsInVials": 34460000.0, "cellsNeeded": 36183000.0, "conc": 1813684.210526316, "totalMl": 19.95, "dmsoMl": 1.995, "serumMl": 1.995, "mediumMl": 15.959999999999997, "spinMl": 8.91865910771506, "haveCells": 103047800.0, "maxVials": 56, "coolMin": 102.0}}, {"n": 36, "cpv": 2947000.0, "ml": 0.75, "d": 7.5, "s": 10, "x": 5, "cpm": 1372000.0, "susp": 10.7, "out": {"cellsInVials": 106092000.0, "cellsNeeded": 111396600.0, "conc": 3929333.3333333335, "totalMl": 28.35, "dmsoMl": 2.12625, "serumMl": 2.835, "mediumMl": 23.38875, "spinMl": 81.19285714285714, "haveCells": 14680399.999999998, "maxVials": 4, "coolMin": 42.0}}, {"n": 28, "cpv": 7866000.0, "ml": 1.56, "d": 7.5, "s": 0, "x": 10, "cpm": 2650000.0, "susp": 6.3, "out": {"cellsInVials": 220248000.0, "cellsNeeded": 242272800.00000003, "conc": 5042307.692307692, "totalMl": 48.048, "dmsoMl": 3.6036, "serumMl": 0.0, "mediumMl": 44.4444, "spinMl": 91.42369811320756, "haveCells": 16695000.0, "maxVials": 1, "coolMin": 168.0}}, {"n": 35, "cpv": 9567000.0, "ml": 0.84, "d": 7.5, "s": 10, "x": 5, "cpm": 856000.0, "susp": 42.6, "out": {"cellsInVials": 334845000.0, "cellsNeeded": 351587250.0, "conc": 11389285.714285715, "totalMl": 30.87, "dmsoMl": 2.3152500000000003, "serumMl": 3.0869999999999997, "mediumMl": 25.467750000000002, "spinMl": 410.7327686915888, "haveCells": 36465600.0, "maxVials": 3, "coolMin": 168.0}}];
const TRICKY = "Freezer,Rack,Box,Box size,Position,Cell line,Passage,Date frozen,Cells per vial,Medium,Frozen by,Notes\r\n\"Tank, north\",R1,\"Box \"\"A\"\"\",10x10,j10,\"Line, with comma\",P4,2026-01-05,2.5e6,\"90 % serum, 10 % DMSO\",A. B.,\"two\nlines \"\"quoted\"\"\"\r\n\"Tank, north\",R1,\"Box \"\"A\"\"\",10x10,B03,Plain,,2026-01-06,,,,\r\n";
const TRICKY_PARSED = [["Freezer", "Rack", "Box", "Box size", "Position", "Cell line", "Passage", "Date frozen", "Cells per vial", "Medium", "Frozen by", "Notes"], ["Tank, north", "R1", "Box \"A\"", "10x10", "j10", "Line, with comma", "P4", "2026-01-05", "2.5e6", "90 % serum, 10 % DMSO", "A. B.", "two\nlines \"quoted\""], ["Tank, north", "R1", "Box \"A\"", "10x10", "B03", "Plain", "", "2026-01-06", "", "", "", ""]];

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const thrown = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  // Positions.
  const b9 = { rows: 9, cols: 9 }, b10 = { rows: 10, cols: 10 };
  check('cryovial: positions A1, c7, J10 and out-of-box places', JSON.stringify(C.parsePos('c07', b9)) === '{"r":2,"c":6}' && C.parsePos('J10', b9) === null && JSON.stringify(C.parsePos('J10', b10)) === '{"r":9,"c":9}' && C.parsePos('A0', b9) === null && C.parsePos('AA1', b9) === null && C.posName(8, 8) === 'I9' && C.posIndex(b10, 'B1') === 10);
  check('cryovial: dates', C.isDate('2026-02-28') && !C.isDate('2026-02-30') && !C.isDate('9/11/2026') && C.addDays('2026-12-31', 1) === '2027-01-01');
  // The example against Python's reading of its CSV.
  const inv = C.example();
  const sum = Object.fromEntries(C.lineSummary(inv).map((s) => [s.line, s]));
  check('cryovial: example per line (Python csv): Fibro-A 10 in stock, Clone 3B 4 + 1 thawed, Line K-9 7 + 1 thawed', sum['Fibro-A'].inStock === 10 && sum['Fibro-A'].thawed === 0 && sum['Fibro-A'].cells === 14e6 && sum['Clone 3B'].inStock === 4 && sum['Clone 3B'].thawed === 1 && sum['Clone 3B'].cells === 20e6 && sum['Line K-9'].inStock === 7 && sum['Line K-9'].thawed === 1 && sum['Line K-9'].cells === 21e6);
  check('cryovial: example passages and dates of vials in stock', JSON.stringify(sum['Fibro-A'].passages) === '[5,8]' && sum['Fibro-A'].oldest === '2026-03-12' && sum['Fibro-A'].newest === '2026-06-02');
  const [box1, box7] = [C.findBox(inv, 'ln2 TANK 1', 'Rack 3', 'box 1'), C.findBox(inv, '−80 °C freezer B', 'Shelf 2', 'Box 7')];
  check('cryovial: boxes 14 of 81 and 7 of 100 places used', JSON.stringify(C.boxUse(inv, box1)) === '{"used":14,"places":81}' && JSON.stringify(C.boxUse(inv, box7)) === '{"used":7,"places":100}');
  const free = C.freePositions(inv, box1);
  check('cryovial: free places row by row (Python): 67, first B2 … C3, C6', free.length === 67 && free.slice(0, 12).join() === 'B2,B3,B4,B5,B6,B7,B8,B9,C3,C6,C7,C8' && C.freePositions(inv, box1, 'H5').join() === 'H5,H6,H7,H8,H9,I1,I2,I3,I4,I5,I6,I7,I8,I9');
  // Adding vials fills free places, skipping full ones.
  const inv2 = C.example(), b = C.findBox(inv2, 'LN2 tank 1', 'Rack 3', 'Box 1');
  const added = C.addVials(inv2, b.id, 'B8', 4, { line: 'New', passage: 2, frozen: '2026-11-09', cells: 1e6 });
  check('cryovial: 4 vials from B8 go to B8, B9, C3, C6 (C3 freed by the thaw)', added.map((v) => v.pos).join() === 'B8,B9,C3,C6');
  check('cryovial: add errors (no room, bad start, no line, bad date, bad passage, bad cells)',
    /Only 14 free places from H5/.test(thrown(() => C.addVials(inv2, b.id, 'H5', 15, { line: 'X', frozen: '2026-11-09' }))) &&
    /A1 to I9/.test(thrown(() => C.addVials(inv2, b.id, 'J1', 1, { line: 'X', frozen: '2026-11-09' }))) &&
    /cell line/.test(thrown(() => C.addVials(inv2, b.id, 'A1', 1, { line: ' ', frozen: '2026-11-09' }))) &&
    /YYYY-MM-DD/.test(thrown(() => C.addVials(inv2, b.id, 'A1', 1, { line: 'X', frozen: '2026-13-01' }))) &&
    /whole number/.test(thrown(() => C.addVials(inv2, b.id, 'A1', 1, { line: 'X', frozen: '2026-11-09', passage: 2.5 }))) &&
    /above 0/.test(thrown(() => C.addVials(inv2, b.id, 'A1', 1, { line: 'X', frozen: '2026-11-09', cells: -1 }))) &&
    /whole number/.test(thrown(() => C.addVials(inv2, b.id, 'A1', 0, { line: 'X', frozen: '2026-11-09' }))));
  // Boxes.
  check('cryovial: box names must be unique per rack; sizes 1 to 12', /already a box/.test(thrown(() => C.addBox(inv2, { freezer: 'LN2 tank 1', rack: 'rack 3', name: 'BOX 1' }))) && /1 to 12/.test(thrown(() => C.addBox(inv2, { freezer: 'F', rack: 'R', name: 'B', rows: 13 }))) && /name/.test(thrown(() => C.addBox(inv2, { freezer: '', rack: 'R', name: 'B' }))));
  // Thaw, the log and undo.
  const inv3 = C.example(), b3 = C.findBox(inv3, 'LN2 tank 1', 'Rack 3', 'Box 1');
  const a1 = C.occupancy(inv3, b3.id).get('A1');
  C.thaw(inv3, [a1.id], '2026-11-09', 'NS', 'For an experiment');
  const log = C.thawLog(inv3);
  check('cryovial: thaw frees the place and tops the log', !C.occupancy(inv3, b3.id).has('A1') && log.length === 3 && log[0].id === a1.id && log[0].place === 'LN2 tank 1 › Rack 3 › Box 1 › A1' && log.map((v) => v.thawed).join() === '2026-11-09,2026-11-02,2026-10-01');
  check('cryovial: thaw errors (date before freezing, bad date, already thawed)', /before Fibro-A \(A2\) was frozen/.test(thrown(() => C.thaw(inv3, [C.occupancy(inv3, b3.id).get('A2').id], '2026-01-01'))) && /YYYY-MM-DD/.test(thrown(() => C.thaw(inv3, [a1.id], 'today'))) && /still in the freezer/.test(thrown(() => C.thaw(inv3, [a1.id], '2026-11-10'))));
  C.unthaw(inv3, a1.id);
  check('cryovial: undo a thaw puts the vial back', C.occupancy(inv3, b3.id).get('A1') === a1 && C.thawLog(inv3).length === 2);
  C.thaw(inv3, [a1.id], '2026-11-09');
  C.addVials(inv3, b3.id, 'A1', 1, { line: 'Other', frozen: '2026-11-09' });
  check('cryovial: undo refused when the place is taken', /A1 in Box 1 now holds Other/.test(thrown(() => C.unthaw(inv3, a1.id))));
  // Edit and move.
  const c1 = C.occupancy(inv3, b3.id).get('C1');
  C.updateVial(inv3, c1.id, { ...c1, pos: 'i9', note: 'moved' });
  check('cryovial: move a vial to a free place', c1.pos === 'I9' && c1.note === 'moved' && !C.occupancy(inv3, b3.id).has('C1') && /A2 in Box 1 already holds Fibro-A/.test(thrown(() => C.updateVial(inv3, c1.id, { ...c1, pos: 'A2' }))));
  // Search and filters.
  check('cryovial: search words, passage, freezer, line, status', C.filterVials(inv, { text: 'p8' }).map((v) => v.pos).join() === 'A7,A8,A9,B1' && C.filterVials(inv, { text: 'clone selected' }).length === 4 && C.filterVials(inv, { freezer: 'LN2 tank 1' }).length === 14 && C.filterVials(inv, { line: 'Line K-9', status: 'all' }).length === 8 && C.filterVials(inv, { status: 'thawed' }).length === 2 && C.filterVials(inv, { text: 'recovered' , status: 'all' }).length === 1 && C.filterVials(inv).length === 21);
  check('cryovial: results in freezer, rack, box, place order', C.filterVials(inv).map((v) => v.pos).slice(0, 3).join() === 'A2,A3,A4' && C.filterVials(inv)[7].pos === 'A1' && C.filterVials(inv)[7].line === 'Fibro-A');
  // CSV and JSON round trips.
  const csv = C.toCsv(inv);
  const back = C.newInventory(), r1 = C.importCsv(back, csv);
  check('cryovial: CSV export reads back the same (23 rows, 2 boxes, 2 thawed)', r1.added === 23 && r1.boxes === 2 && r1.thawed === 2 && r1.errors.length === 0 && C.toCsv(back) === csv && csv.split('\n')[0] === C.CSV_HEAD.join(','));
  const back2 = C.newInventory(), r2 = C.importJson(back2, C.toJson(inv));
  check('cryovial: JSON export reads back the same', r2.added === 23 && r2.errors.length === 0 && C.toCsv(back2) === csv);
  const again = C.importCsv(back, csv);
  check('cryovial: importing the same file twice reports taken places', again.added === 2 && again.errors.length === 21 && /A2 in Box 7 already holds Line K-9/.test(again.errors[0]));
  check('cryovial: parser reads Python csv.writer output (quotes, commas, line break)', JSON.stringify(C.parseCsv(TRICKY)) === JSON.stringify(TRICKY_PARSED));
  const t = C.newInventory(), rt = C.importCsv(t, TRICKY), tv = t.vials[0];
  check('cryovial: other column names, P4 and j10 read', rt.added === 2 && rt.boxes === 1 && t.boxes[0].rows === 10 && t.boxes[0].freezer === 'Tank, north' && tv.pos === 'J10' && tv.passage === 4 && tv.cells === 2.5e6 && tv.line === 'Line, with comma' && tv.note === 'two lines "quoted"' && t.vials[1].pos === 'B3' && t.vials[1].passage === null && t.vials[1].cells === null);
  const bad = C.importCsv(C.newInventory(), 'line,position,date_frozen,box_size\nA,K1,2026-01-01,9x9\nB,A1,01/01/2026,9x9\nC,A1,2026-01-01,9 by 9\nD,A2,2026-01-01,9x9\nE,A2,2026-01-01,9x9');
  check('cryovial: CSV row errors name the line', bad.added === 1 && bad.errors.length === 4 && /Line 2: "K1" is not a place in a 9x9 box/.test(bad.errors[0]) && /Line 3: .*YYYY-MM-DD/.test(bad.errors[1]) && /Line 4: box size/.test(bad.errors[2]) && /Line 6: A2 in Box already holds D/.test(bad.errors[3]));
  check('cryovial: files that are not inventories', /header row/.test(C.importCsv(C.newInventory(), 'x').errors[0]) && /"line" and "position"/.test(C.importCsv(C.newInventory(), 'a,b\n1,2').errors[0]) && /not a JSON/.test(C.importJson(C.newInventory(), '{').errors[0]) && /not saved from/.test(C.importJson(C.newInventory(), '{"a":1}').errors[0]));
  // Empty boxes survive a round trip; removing a box keeps its thaw log.
  const e = C.newInventory(); C.addBox(e, { freezer: 'F', rack: 'R', name: 'Empty', rows: 10 });
  const e2 = C.newInventory(); C.importCsv(e2, C.toCsv(e));
  check('cryovial: an empty box round-trips through CSV and JSON', e2.boxes.length === 1 && e2.boxes[0].rows === 10 && (() => { const e3 = C.newInventory(); C.importJson(e3, C.toJson(e)); return e3.boxes.length === 1 && e3.boxes[0].cols === 10; })());
  const inv4 = C.example(), gone = C.removeBox(inv4, C.findBox(inv4, 'LN2 tank 1', 'Rack 3', 'Box 1').id);
  check('cryovial: removing a box removes its 14 vials, the thaw log keeps 2', gone === 14 && inv4.boxes.length === 1 && C.thawLog(inv4).length === 2 && C.thawLog(inv4)[1].place === 'LN2 tank 1 › Rack 3 › Box 1 › C3' && (() => { const x = C.newInventory(); const r = C.importCsv(x, C.toCsv(inv4)); return r.added === 9 && r.thawed === 2 && r.errors.length === 0; })());
  // Freezing helper against the Python script.
  CASES.forEach((c, i) => {
    const o = C.freezePlan({ vials: c.n, cellsPerVial: c.cpv, mlPerVial: c.ml, dmsoPct: c.d, serumPct: c.s, extraPct: c.x, countPerMl: c.cpm, suspMl: c.susp });
    const k = ['cellsInVials', 'cellsNeeded', 'conc', 'totalMl', 'dmsoMl', 'serumMl', 'mediumMl', 'spinMl', 'haveCells'];
    check(`freezing: case ${i + 1} (${c.n} vials) matches Python`, k.every((n) => near(o[n], c.out[n])) && o.maxVials === c.out.maxVials && o.enough === (c.out.haveCells >= c.out.cellsNeeded));
  });
  const ex = C.freezePlan({ vials: 10, cellsPerVial: 1e6, mlPerVial: 1, dmsoPct: 10, serumPct: 20, extraPct: 10, countPerMl: 8e5, suspMl: 20 });
  check('freezing: worked example by hand (11 mL: 1.1 DMSO + 2.2 serum + 7.7 medium; spin 13.75 mL; 14 vials; 100 min)', near(ex.totalMl, 11) && near(ex.dmsoMl, 1.1) && near(ex.serumMl, 2.2) && near(ex.mediumMl, 7.7) && near(ex.spinMl, 13.75) && ex.maxVials === 14 && ex.enough && ex.coolMin === 100 && ex.mix === '70 % medium, 20 % serum, 10 % DMSO' && ex.warn.length === 0);
  check('freezing: cooling time from 4 °C at 0.5 °C/min is 168 min', C.freezePlan({ vials: 1, cellsPerVial: 1, mlPerVial: 1, dmsoPct: 10, serumPct: 0, extraPct: 0, startC: 4, rateCPerMin: 0.5 }).coolMin === 168);
  const few = C.freezePlan({ vials: 20, cellsPerVial: 1e6, mlPerVial: 1, dmsoPct: 10, serumPct: 90, extraPct: 10, countPerMl: 8e5, suspMl: 20 });
  check('freezing: not enough cells warns; mix name without medium', few.enough === false && few.maxVials === 14 && few.warn.some((w) => /enough for 14 vials/.test(w)) && few.mix === '90 % serum, 10 % DMSO' && near(few.mediumMl, 0));
  check('freezing: unusual mixes warn', C.freezePlan({ vials: 1, cellsPerVial: 1, mlPerVial: 2, dmsoPct: 20, serumPct: 0, extraPct: 0 }).warn.length === 2 && C.freezePlan({ vials: 1, cellsPerVial: 1, mlPerVial: 1, dmsoPct: 0, serumPct: 0, extraPct: 0 }).warn.some((w) => /No DMSO/.test(w)));
  check('freezing: bad input errors', /whole number/.test(thrown(() => C.freezePlan({ vials: 2.5, cellsPerVial: 1, mlPerVial: 1, dmsoPct: 10, serumPct: 0, extraPct: 0 }))) && /more than 100/.test(thrown(() => C.freezePlan({ vials: 1, cellsPerVial: 1, mlPerVial: 1, dmsoPct: 10, serumPct: 95, extraPct: 0 }))) && /cells per vial/.test(thrown(() => C.freezePlan({ vials: 1, cellsPerVial: 0, mlPerVial: 1, dmsoPct: 10, serumPct: 0, extraPct: 0 }))) && /start temperature/.test(thrown(() => C.freezePlan({ vials: 1, cellsPerVial: 1, mlPerVial: 1, dmsoPct: 10, serumPct: 0, extraPct: 0, startC: -90 }))));
  const sch = C.freezeSchedule('2026-11-09', 24, 7);
  check('freezing: schedule dates (next day, a week later)', sch.map((s) => s.date).join() === '2026-11-09,2026-11-10,2026-11-16' && C.freezeSchedule('2026-12-31', 48, 0)[1].date === '2027-01-02' && /YYYY-MM-DD/.test(thrown(() => C.freezeSchedule('x', 24, 7))));
};
