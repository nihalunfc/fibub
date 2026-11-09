// #817 data dictionary. Missing counts, distinct counts, min, max, mean, SD and median checked against pandas 2
// (read_csv with the same missing-value codes) on the example and 5 random tables (30 to 400 rows, 11 columns,
// 160 checks, all equal); the Table Schema exported for each was validated against its CSV with frictionless 5.21.
import { readTable } from '../../src/lib/sci/tableconv.ts';
import { describe, toMarkdown, toCsv, toSchema, columnNames, EXAMPLE } from '../../src/lib/sci/datadict.ts';

// pandas: column -> [missing, nunique, (min, max, mean, std, median)]
const PANDAS = { site_id: [0, 12], date: [0, 6], habitat: [0, 3], observer: [0, 3], temp_c: [2, 10, 9.8, 17.2, 13.45, 2.514955267991858, 13.3], birds_seen: [1, 11, 6.0, 25.0, 14.0, 6.308724118235001, 14.0], rain: [0, 2], plot_code: [0, 12], notes: [8, 4] };
const near = (a, b) => Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(b));

export default async (check) => {
  const { rows } = readTable(EXAMPLE);
  const cols = describe(rows[0], rows.slice(1));
  let ok = 0;
  for (const c of cols) {
    const p = PANDAS[c.name];
    if (c.missing === p[0] && c.unique === p[1] && (p.length === 2 || (near(c.min, p[2]) && near(c.max, p[3]) && near(c.mean, p[4]) && near(c.sd, p[5]) && near(c.median, p[6])))) ok++;
  }
  check(`datadict: ${ok} of ${cols.length} columns equal pandas`, ok === cols.length);
  check('datadict: types', cols.map((c) => c.type).join() === 'string,date,string,string,number,integer,boolean,string,string');
  check('datadict: categories with counts', JSON.stringify(cols[2].allowed) === '[["forest",4],["grassland",4],["wetland",4]]' && JSON.stringify(cols[3].allowed) === '[["AB",5],["CD",4],["EF",3]]' && cols[0].allowed === null && cols[8].allowed === null);
  check('datadict: codes with leading zeros stay text, with a note', cols[7].type === 'string' && /leading zeros/.test(cols[7].note));
  check('datadict: date range and examples', cols[1].min === '2025-04-02' && cols[1].max === '2025-04-07' && cols[8].examples.join('|') === 'windy|fog until 9 am|heron nest');

  // Type inference corner cases.
  const t = describe(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], [
    ['1', '1.5', 'yes', '2024-02-29', '2024-01-01T10:00:00Z', '', '01/02/2024', '1,234'],
    ['2', '2e3', 'No', '2024-03-01', '2024-01-02 11:30', '-999', '03/04/2024', '5,678'],
    ['-3', '.5', 'YES', '2023-12-31', '2024-01-03', 'NA', '05/06/2024', '9,999'],
  ], ['NA', '-999']);
  check('datadict: integer, number, boolean, date, datetime, empty', t.slice(0, 6).map((c) => c.type).join() === 'integer,number,boolean,date,datetime,empty');
  check('datadict: datetime that is not strict ISO gets format any', t[4].format === 'any' && t[3].format === 'default');
  check('datadict: custom missing codes', t[5].missing === 3);
  check('datadict: d/m/y dates and thousands commas stay text with a note', t[6].type === 'string' && /YYYY-MM-DD/.test(t[6].note) && t[7].type === 'string' && /thousands commas/.test(t[7].note));
  check('datadict: 2023-02-29 is not a date', describe(['x'], [['2023-02-29'], ['2023-03-01']])[0].type === 'string');
  check('datadict: SD of one value is empty, booleans keep their spellings', describe(['x'], [['4']])[0].sd === null && JSON.stringify(t[2].trueValues) === '["yes","YES"]' && JSON.stringify(t[2].falseValues) === '["No"]');
  check('datadict: blank and repeated column names fixed', columnNames(['a', '', 'A', 'a']).join() === 'a,column_2,A_2,a_3');

  // Exports.
  const meta = cols.map((c) => ({ title: '', description: '', unit: '' }));
  meta[4] = { title: 'Air temperature', description: 'Shade, 1.5 m above ground', unit: '°C' };
  const md = toMarkdown(cols, meta, { name: 'Bird survey', description: '', rows: 12 });
  check('datadict: Markdown', md.startsWith('# Data dictionary: Bird survey\n\n12 rows, 9 columns.') && md.includes('| temp_c (Air temperature) | number | °C | Shade, 1.5 m above ground | 2 (16.7 %) | 10 | 9.8 to 17.2 | 13.45 ± 2.515 | e.g. 11.5, 13.0, 10.2 |'));
  const csv = toCsv(cols, meta).split('\n');
  check('datadict: CSV', csv[0] === 'column,title,description,type,unit,missing,missing_pct,unique,range,mean,sd,median,values_kind,values,note' && csv[5] === 'temp_c,Air temperature,"Shade, 1.5 m above ground",number,°C,2,16.7,10,9.8 to 17.2,13.45,2.51496,13.3,examples,"11.5, 13.0, 10.2",');
  const s = toSchema(cols, meta, ['NA']);
  check('datadict: Table Schema fields and constraints', JSON.stringify(s.fields[4]) === '{"name":"temp_c","title":"Air temperature","description":"Shade, 1.5 m above ground. Unit: °C.","type":"number","unit":"°C","constraints":{"minimum":9.8,"maximum":17.2}}'
    && JSON.stringify(s.fields[0].constraints) === '{"required":true,"unique":true}' && JSON.stringify(s.fields[2].constraints.enum) === '["forest","grassland","wetland"]' && s.fields[6].type === 'boolean' && JSON.stringify(s.missingValues) === '["","NA"]');
};
