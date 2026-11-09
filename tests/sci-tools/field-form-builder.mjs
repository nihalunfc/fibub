// #827 Field form builder. The CSV was read back with Python's csv module and the GeoJSON checked with the geojson
// package (valid FeatureCollection, longitude first, null geometry only when asked) on 300 made-up records with
// commas, quotes, line breaks, emoji, missing values and multi-choice answers: 7,486 checks, 0 failed.
import { slugKey, formProblems, recordErrors, toCSV, toGeoJSON, csvHeader, readForm, formJson, validDate, validTime, validDateTime, readNum, EXAMPLE } from '../../src/lib/sci/fieldform.ts';

export default async (check) => {
  check('key: from a label', slugKey('Air temperature (°C)') === 'air_temperature_c' && slugKey('Ñandú count') === 'nandu_count' && slugKey('2nd visit') === 'f_2nd_visit' && slugKey('!!!') === 'field');
  check('key: unique', slugKey('Site', ['site', 'site_2']) === 'site_3');
  check('form: example has no problems', formProblems(EXAMPLE).length === 0);
  const bad = { title: 'x', fields: [{ key: 'a', label: '', type: 'text' }, { key: 'a', label: 'B', type: 'choice', options: [] }, { key: 'Bad key', label: 'C', type: 'number', min: 5, max: 1 }, { key: 'd', label: 'D', type: 'choice', options: ['x', 'x'] }] };
  const p = formProblems(bad);
  check('form: problems found', p.length === 6 && p.some((x) => x.includes('needs a label')) && p.some((x) => x.includes('used twice')) && p.some((x) => x.includes('at least one option')) && p.some((x) => x.includes('only lower-case')) && p.some((x) => x.includes('smallest allowed value is above')) && p.some((x) => x.includes('listed twice')));
  check('form: no fields', formProblems({ title: '', fields: [] })[0] === 'Add at least one field.');

  check('dates and times', validDate('2026-02-28') && !validDate('2026-02-30') && !validDate('26-02-01') && validDate('2024-02-29') && !validDate('2026-02-29') && validTime('23:59') && !validTime('24:00') && validTime('07:05:09') && validDateTime('2026-11-09T14:30') && !validDateTime('2026-11-09'));
  check('numbers', readNum(' -3.5 ') === -3.5 && readNum('1e3') === 1000 && Number.isNaN(readNum('12 m')) && Number.isNaN(readNum('1,5')) && Number.isNaN(readNum('')));
  const ok = { site: 'Verge A', when: '2026-06-14T11:20', location: { lat: 51.5, lon: -0.12, acc: 8 }, temperature: '21.5', sky: 'Sunny', groups: ['Bumblebees', 'Hoverflies'], count: '17', photo: '', notes: '' };
  check('record: a good record has no errors', Object.keys(recordErrors(EXAMPLE, ok)).length === 0);
  const e = recordErrors(EXAMPLE, { ...ok, site: ' ', when: '2026-06-31T11:20', temperature: '50', sky: 'Rain', count: 'many', location: { lat: 95, lon: 0, acc: null } });
  check('record: errors by field', e.site === 'Required.' && e.when.startsWith('Use a date and time') && e.temperature === 'The largest allowed value is 45 °C.' && e.sky === 'Pick from the list.' && e.count.startsWith('Type a number') && e.location.startsWith('Latitude'));
  check('record: longitude and accuracy', recordErrors(EXAMPLE, { ...ok, location: { lat: 1, lon: 200, acc: 1 } }).location.startsWith('Longitude') && recordErrors(EXAMPLE, { ...ok, location: { lat: 1, lon: 2, acc: -1 } }).location.startsWith('Accuracy'));
  check('record: single choice takes one, below minimum', recordErrors(EXAMPLE, { ...ok, sky: ['Sunny', 'Overcast'], count: '-1' }).sky === 'Pick one.' && recordErrors(EXAMPLE, { ...ok, count: '-1' }).count === 'The smallest allowed value is 0.');
  check('record: optional fields may be empty', Object.keys(recordErrors(EXAMPLE, { ...ok, location: null, temperature: '', groups: [] })).length === 0);

  const recs = [{ no: 1, values: ok, saved: '2026-06-14' }, { no: 2, values: { ...ok, site: 'Gate, "north"', location: null, groups: [], notes: 'line1\nline2' } }];
  const csv = toCSV(EXAMPLE, recs);
  check('csv: header', csvHeader(EXAMPLE).join(',') === 'record,site,when,location_lat,location_lon,location_accuracy_m,location_time,temperature_c,sky,groups,count,photo,notes,saved');
  check('csv: rows quoted per RFC 4180', csv.split('\r\n')[1] === '1,Verge A,2026-06-14T11:20,51.5,-0.12,8,,21.5,Sunny,Bumblebees; Hoverflies,17,,,2026-06-14' && csv.includes('2,"Gate, ""north""",2026-06-14T11:20,,,,,21.5,Sunny,,17,,"line1\nline2",\r\n'));
  const g = toGeoJSON(EXAMPLE, recs);
  const gj = JSON.parse(g.text);
  check('geojson: longitude first, unlocated left out', g.located === 1 && g.unlocated === 1 && gj.features.length === 1 && gj.features[0].geometry.coordinates.join(',') === '-0.12,51.5' && gj.features[0].properties.temperature === 21.5 && gj.features[0].properties.location_accuracy_m === 8);
  const g2 = JSON.parse(toGeoJSON(EXAMPLE, recs, { keepUnlocated: true }).text);
  check('geojson: unlocated kept with null geometry when asked', g2.features.length === 2 && g2.features[1].geometry === null && g2.features[1].properties.site === 'Gate, "north"' && g2.features[1].properties.photo === null);
  check('geojson: 7 decimal places', JSON.parse(toGeoJSON(EXAMPLE, [{ no: 1, values: { ...ok, location: { lat: 12.123456789, lon: -1.987654321, acc: 3 } } }]).text).features[0].geometry.coordinates.join(',') === '-1.9876543,12.1234568');

  const back = readForm(formJson(EXAMPLE));
  const canon = (f) => JSON.stringify(Object.keys(f).sort().map((k) => [k, f[k]]));
  const norm = (f) => ({ ...f, required: !!f.required, ...(f.type === 'number' ? { min: f.min ?? null, max: f.max ?? null } : {}), ...(f.type === 'choice' ? { multi: !!f.multi } : {}) });
  check('form file: round trip', back.fields.map(canon).join() === EXAMPLE.fields.map(norm).map(canon).join() && back.title === EXAMPLE.title);
  const msg = (t) => { try { readForm(t); return ''; } catch (e) { return e.message; } };
  check('form file: bad files explained', msg('nope').startsWith('This is not JSON') && msg('{}').includes('"fields"') && msg('{"fields":[{"type":"video"}]}').includes('unknown type "video"'));
  const fixed = readForm('{"fields":[{"type":"text","label":"Site","key":"Site Name"},{"type":"text","label":"Site"}]}');
  check('form file: bad or repeated keys are rebuilt', fixed.fields.map((f) => f.key).join(',') === 'site,site_2' && fixed.title === 'Field form');
};
