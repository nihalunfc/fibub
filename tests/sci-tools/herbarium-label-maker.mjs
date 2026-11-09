// #326 Herbarium label maker. References from Python 3.12's standard library (scratch script): csv.DictWriter output
// read back here, our CSV read back by csv.DictReader (it matched, including quotes, commas and line breaks), datetime
// for which dates exist, and an independent degrees-minutes-seconds conversion.
import { readRecords, recordsCsv, dms, validDate, formatDate, nameRuns, fillTemplate, checkRecord, labelLines, wrapRuns, termFor } from '../../src/lib/sci/herbarium.ts';
export default async (check) => {
  const py = 'scientificName,recordedBy,locality,eventDate\r\nCarex nigra subsp. juncea,"A. Field, B. Brook","Lakeshore, ""north"" bay",2026-07-04\r\nSalix × rubens,C. Dale,"Line one\nline two",2025-11\r\n';
  const r = readRecords(py);
  check('herbarium: reads CSV written by Python csv (quotes, commas, line breaks)', r.records.length === 2 && r.records[0].recordedBy === 'A. Field, B. Brook' && r.records[0].locality === 'Lakeshore, "north" bay' && r.records[1].locality === 'Line one\nline two' && r.records[1].scientificName === 'Salix × rubens');
  const recs = [{ scientificName: 'Carex nigra subsp. juncea', recordedBy: 'A. Field, B. Brook', locality: 'Lakeshore, "north" bay', eventDate: '2026-07-04' }, { scientificName: 'Salix × rubens', recordedBy: 'C. Dale', locality: 'Line one\nline two', eventDate: '2025-11', habitat: ' leading space' }];
  check('herbarium: our CSV (read back by Python csv.DictReader in the check) round-trips here too', readRecords(recordsCsv(recs)).records.every((o, i) => Object.keys(recs[i]).length === Object.keys(o).length && Object.entries(recs[i]).every(([k, v]) => o[k] === v.trim())) && recordsCsv(recs).startsWith('scientificName,locality,habitat,recordedBy,eventDate'));
  const D = [[45.50417, true, '45°30\'15.0"N'], [-33.86882, true, '33°52\'07.8"S'], [-122.41942, false, '122°25\'09.9"W'], [151.20929, false, '151°12\'33.4"E'], [0, true, '0°00\'00.0"N'], [12.9999999, true, '13°00\'00.0"N'], [-0.00001, false, '0°00\'00.0"W']];
  check('herbarium: degrees-minutes-seconds match Python for 7 coordinates (no 60" rounding)', D.every(([v, lat, s]) => dms(v, lat) === s));
  const V = [['2026-02-29', false], ['2024-02-29', true], ['2026-13-01', false], ['2026-04-31', false], ['2026', true], ['2026-07', true], ['2026-07-04/2026-07-06', true], ['26-07-04', false], ['2026-7-4', false]];
  check('herbarium: date checks match Python datetime for 9 strings', V.every(([s, ok]) => validDate(s) === ok));
  check('herbarium: date styles match Python strftime and Roman months', formatDate('2026-03-09', 'roman') === '9.iii.2026' && formatDate('2026-03-09', 'long') === '9 March 2026' && formatDate('2026-03-09', 'short') === '9 Mar 2026' && formatDate('2026-07', 'roman') === 'vii.2026' && formatDate('spring 1900', 'long') === 'spring 1900');
  const n = nameRuns('Carex nigra subsp. juncea', '(Fr.) Soó');
  check('herbarium: name in italics, rank and author in roman', n.map((x) => x.style).join(',') === 'bi,bi,b,bi,r');
  check('herbarium: header aliases', termFor('dwc:recordedBy') === 'recordedBy' && termFor('Collector') === 'recordedBy' && termFor('Lat') === 'decimalLatitude' && termFor('colour') === null);
  check('herbarium: template tidies empty fields', fillTemplate('Plants of {county}, {stateProvince}, {country}', { country: 'Canada' }) === 'Plants of Canada');
  check('herbarium: record checks', checkRecord({ decimalLatitude: '95', decimalLongitude: '10', eventDate: '2026-02-30' }).length === 3 && checkRecord({ scientificName: 'A b' }).length === 0);
  const L = labelLines({ scientificName: 'Acer rubrum', family: 'Sapindaceae', decimalLatitude: '45.5', decimalLongitude: '-73.6', minimumElevationInMeters: '100', recordedBy: 'X', recordNumber: '12' }, { heading: 'Plants of {country}', dateStyle: 'roman', coords: 'both', feet: true });
  check('herbarium: label lines', L[0].runs[0].text === 'SAPINDACEAE' && L.some((l) => l.runs[0].text === '45°30\'00.0"N 73°36\'00.0"W (45.5, -73.6). Elev. 100 m (328 ft).'));
  const w = wrapRuns([{ text: 'aa bb cc dd', style: 'r' }], 5, (s) => s.length);
  check('herbarium: word wrap', w.length === 2 && w[0].map((x) => x.text).join('') === 'aa bb' && w[1].map((x) => x.text).join('') === 'cc dd');
};
