// #483 DICOM anonymiser: rules on the synthetic fixtures (made with pydicom; no real patient data). The same
// outputs, written to disk, were re-read in pydicom 3.0.2 in strict mode (1157 checks in three date modes: valid
// files, names, IDs, private tags and listed tags gone, dates shifted like Python's timedelta, UIDs new and
// consistent, pixel bytes and pixel arrays identical, RLE included).
import { readFileSync } from 'node:fs';
import * as D from '../../src/lib/sci/dicom.ts';
import * as A from '../../src/lib/sci/dicomanon.ts';

export default async (check) => {
  const fx = (f) => D.parse(new Uint8Array(readFileSync(new URL('../fixtures/dicom/' + f, import.meta.url))));
  let k = 0; const seq = () => `2.25.${++k}`;
  check('anon: date shifts = Python timedelta', A.shiftDate('20000101', -100) === '19990923' && A.shiftDate('20240301', -1) === '20240229' && A.shiftDate('20231231', 1) === '20240101' && A.shiftDate('20240315', -3650) === '20140318' && A.shiftDate('2024', 5) === '' && A.shiftDate('20241301', 1) === '');
  const u = A.randomUid();
  check('anon: random UID under 2.25, at most 64 characters', /^2\.25\.[1-9]\d{0,38}$/.test(u) && u.length <= 64 && u !== A.randomUid());

  const ct = fx('ct-explicit.dcm'), uids = new Map();
  const r = A.anonymise(ct, { ...A.DEFAULTS, shiftDays: -100 }, uids, seq);
  const back = D.parse(D.write(r.out)), g = D.getter(back), all = [];
  D.walk([...back.meta, ...back.elements], (e) => all.push(e));
  check('anon: name and ID replaced, flag added', g.s(0x00100010) === 'ANONYMOUS' && g.s(0x00100020) === 'ANON-0001' && g.s(0x00120062) === 'YES' && g.s(0x00120063) === 'fibub basic profile, dates shifted -100 days' && g.s(0x00280303) === 'MODIFIED');
  check('anon: birth date blank, sex blank, age removed', g.el(0x00100030).value.length === 0 && g.el(0x00100040).value.length === 0 && !g.el(0x00101010));
  check('anon: institution, operators, station, serial, other IDs, comments removed', [0x00080080, 0x00080081, 0x00081070, 0x00081010, 0x00181000, 0x00101000, 0x00204000, 0x00400275, 0x00081030, 0x0008103e].every((t) => !g.el(t)));
  check('anon: referring physician, accession, study ID blanked', [0x00080090, 0x00080050, 0x00200010].every((t) => g.el(t) && g.el(t).value.length === 0));
  check('anon: no private tags anywhere', !all.some((e) => D.isPrivate(e.tag)) && r.changes.filter((c) => c.action === 'removed (private)').length === 4);
  check('anon: dates shifted', g.s(0x00080020) === '20231206' && g.s(0x00080023) === '20231207' && g.s(0x0008002a) === '20231206101530.25' && g.s(0x00080030) === '101500');
  check('anon: UIDs replaced, also in sequences and file meta', g.s(0x0020000d) === uids.get('1.2.826.0.1.3680043.9.7482.2') && g.s(0x00080018) === g.s(0x00020003) && D.str(D.find(g.el(0x00081140).items[0], 0x00081155)) === uids.get('1.2.826.0.1.3680043.9.7482.1.99') && D.str(D.find(g.el(0x00081140).items[0], 0x00081150)) === '1.2.840.10008.5.1.4.1.1.2' && g.s(0x00020010) === D.TS.explicitLE && g.s(0x00020012) === D.IMPL_UID);
  check('anon: pixels byte for byte the same', (() => { const a = D.getter(ct).el(0x7fe00010).value, b = g.el(0x7fe00010).value; return a.length === b.length && a.every((x, i) => x === b[i]); })());
  const ch = r.changes.find((c) => c.tag === '(0010,0010)');
  check('anon: before and after list', ch.before === 'Test^Synthetic^Q' && ch.after === 'ANONYMOUS' && ch.action === 'replaced' && r.changes.some((c) => c.name === 'Institution Name' && c.action === 'removed'));
  // A second file of the same study gets the same new study UID; new instance UIDs differ.
  const s0 = A.anonymise(fx('stack-0.dcm'), A.DEFAULTS, uids, seq).out;
  check('anon: same old UID, same new UID across files', D.getter(s0).s(0x0020000d) === g.s(0x0020000d) && D.getter(s0).s(0x00080018) !== g.s(0x00080018));
  // Options: keep patient characteristics and descriptions; blank dates (and times).
  const kp = D.getter(A.anonymise(ct, { ...A.DEFAULTS, keepPatient: true, keepDescriptions: true, dates: 'keep' }, new Map(), seq).out);
  check('anon: keep sex, age and descriptions; keep dates', kp.s(0x00100040) === 'O' && kp.s(0x00101010) === '056Y' && kp.s(0x00081030) === 'Synthetic phantom study' && kp.s(0x00080020) === '20240315' && kp.s(0x00280303) === 'UNMODIFIED' && kp.el(0x00100030).value.length === 0);
  const bl = D.getter(A.anonymise(ct, { ...A.DEFAULTS, dates: 'blank' }, new Map(), seq).out);
  check('anon: blank dates and times', bl.s(0x00080020) === '' && bl.s(0x00080030) === '' && bl.s(0x0008002a) === '' && bl.s(0x00280303) === 'REMOVED' && bl.s(0x00120063) === 'fibub basic profile, dates removed');
  // Other encodings keep their transfer syntax and still read back.
  for (const f of ['ct-bigendian.dcm', 'mr-implicit.dcm', 'deflated.dcm', 'ct-rle.dcm', 'raw-nometa.dcm']) {
    const o = D.parse(D.write(A.anonymise(fx(f), A.DEFAULTS, new Map(), seq).out));
    check(`anon: ${f} written and read back`, o.ts === fx(f).ts && D.getter(o).s(0x00100010) === 'ANONYMOUS' && D.imageInfo(o).supported === D.imageInfo(fx(f)).supported);
  }
  check('anon: burned-in annotation flag read', A.anonymise(D.parse(D.write({ ...ct, elements: [...ct.elements, D.makeElement(0x00280301, 'CS', 'YES')] })), A.DEFAULTS, new Map(), seq).burned === 'YES');
};
