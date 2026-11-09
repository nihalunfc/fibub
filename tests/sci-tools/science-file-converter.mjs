// #815 science file converter: the NetCDF and FITS readers, checked against files written and read back by
// scipy.io.netcdf_file (CDF-1, CDF-2), netCDF4-python (CDF-5, NetCDF-4/HDF5) and astropy.io.fits (images, binary and
// ASCII tables). The test files are stored here zlib-compressed; EXP holds the values those libraries read from them.
import zlib from 'node:zlib';
import { openBinary, openTables, sniff, exampleNetcdf, writeNetcdf, readNetcdf, f32, MAX_VALUES } from '../../src/lib/sci/sciformat.ts';

const FIX = {
"nc1": "eNpzdnFjZGBgYAViLiBmBuGi1GQGKGCsgNAgcZbinNQ8qFoekBwQs2dkFpfkF1WC1DABMW9uYkqqQlKlQnFyZkElRC83SC8I5yXmpkLVMUJpGACxBYDCHSC5FKjdUMwD1c9dlpiTmRJflJiXDjKGgQ2k74AKRLGDCtwslsy8kmKoHmYku0BsprQcsBqQHxhtz5w5CxIrzoD7kfH/TwaY2RJA7gyQWBKqe+BhA7GDcQPIvOT80rwShDgDUhixluZlgh0EdQdrZklqbjEiXIFijFsScwoyEpNA/kpPzM1NZLDfORMEZjEuzZM/9ONz5AEWiIYGhvpGoCv/MTDXMjQzAAAt2zkw",
"nc2": "eNpzdnFjYmBgAGEuKM1YwgAHjJUQmhkhxMAN5cPkGKEYBliAmAcqBaIZEyEcJgaEehhgRVIrASKKMdXyQO3jinfLzMkJS8wpTYW7ifGPJJjNU5ycmJMan5aYXJJfBDWX0R5iBldiSkp8flpacWoJ3E5GRwW4GRxQq1SgYSACxHK2Z86ctfMB4pkzZzGk/JFk1PkjaX+AgeGj56dTDgFAFexAfZx/JAG9RCHx",
"nc5": "eNpzdnFjZYAAJiDmQmKDAGMRAwZgzEawQep40PSwlmSW5KSiinEmp6SZKpSkFpcg9LJlmpkklkAEYPYy/oeAv0A2N1SMBUozJ2WmM6DZBXcTGh9mngBUeg1MX2kShh50veyo9jLOgestJqiXA03vArjeTIJ6OVHNYFxyAhQQLxgY32VrgM0QQA2j3zD3HoAyAONnKCM=",
"h5head": "iUhERg0KGgoCCAgAAAAAAAAAAAD//////////wgYAAAAAAAAMAAAAAAAAADwgkgCT0hEUgIMtAIiAAAAAAADAg==",
"fits": "eNrtnM1u41QUgNOpYDqAhFig2cziblD4a8bXzk+7aGsncUcu+dPkBmVYIDmNmwlKnMp2EWUzfgTEbpB4gc5m3mAQ60FiwyvwBCyQWIR7fdM2aeK2cY+gI51PSuvYzqdzcm8a99yTNK1qo2ISskUWwMhDsj9yD0be0CfBiOxarEn8wHa7ttclCylarGG1F/tonvtsz7OPSdcObBIcHzrkCmpG22qSmPhU7nOPhh3HI6ODU3N/6Lh+f+T68T4a48uSpYl8aoxPW95ntplZK8eOx9IUmyUjdnxpAt9X5uP6ovHQ1EJ+Y3lfvbhnlpjwpZnjB+Sg7wy6aZIYs91gVtVckK+mZBQ+X3yHz+iuf22fGAwEQRAEQZApwlS48mz8QA/fCt8O74Zr4b3wnfDd8L0UgiAIgiAIgiBziHJn06rXtkjaqhqPTH5JPV39e0isod1ziPNdIKu6V9Yn4+vP65oKXH/WgOvPKnD9OalPg6tnN0r1Vo3F+JSZ5+/Q9uyhEzjeZcXZR5f56Iyv542ODq8q9JptVjOienG61CqK6Xdh/p3PPJdHh/ViBEEQBEH+d8Q19PbJyYudT/ktTKV2xPYfrZbO9+sf8t98v87v6C2+/c3JC/yPA0EQBEEQBMH6c1R/Llo1ZhQr5mz9r9N3be+YBHZncJ0y9GX9z2Tjdvc/F0Q9duC4veCp8J2ZLusTvqL/ebFPTVYvVpX5+u5VVWPoejHbtcxKubm4v312PUBOmaihOd7K2JOGGY1H+mBg9y7Wn5eG7dYfV6WvMtl1M5+ILxrfdJ/mCUx80meBxFdrVSox82+dJsxXk/lqKlC+0rcHkm+rZjHp2x8duQHI+GZlvvksUL7S9wXY/MtFvqF8eQDEJ30m2HhAxifyzUc+zyZA+UpfGSxf6es6UPkWIt+3zj5QvtKnmVDzbyPyDeyOMwCJT/qoYgDFtxn5vidQ80X6SmCvX6pE42t7QPFJX2PvY+0TmPio8HX6gQ8UX+TLtcGeP1X4jsDef6UP5v1XfB4s8l289kv2eTCZrybi8/ftgdMFyVcDy3e6X8Bgc76l+wWY+HxeFN8cSoYmHY+FvlxGSZAv9jMgCIIgCIKAwlIrz8bjsS6r0atG+fVv+kdf/3hf+2BbtHNEbRz8R1Wjk4L16V7OHfHjJb+f2h0L/hlP2HrNLeyvn++s/rmj/8DPf8lvv3NLViWu0+EPEA96dV4FX1t7oKfeZyufT1XG77365fyOMG5X+O3585/O9+r62eaqsPzNU/mVb6xMgrsrdgoVrjMgCIIgCIIg4P0bUfPGXD3WaJYs69rtG290/0a+cLv7N8gt798g2Rv1b/iBXOCC6t8w8hDrM8VSvULhvv9vqh/EBVtvnPSDUAqUb9x8LiTMVwPuP5C+sprL0AJEvjGf16VJ199k/0a37wcw+WaB880uzjeb7Ps2T9fz+DvFzdfzcL0MQZA3hS+dnn3hkkDNbM6ysVleV1RxIKdoM0do+TOFlh3X6Uxd1PIzaUbNKbPwMxWhyNPc3AHNGAR23zu77NT4H/JCpjB7Ht3gUVDhzhe0mSNZEQUOJYIgCIIgCPIf8C+KQdyM"
};
const EXP = {"nc1": {"count": [1, -2, 3, 32000, -32000], "name": ["alpha", "be", "gamma"], "d": [0.1, 1e-300, -2.5], "b": [-128, 0, 127], "valid_range": [-10.0, 10.0], "fl": 0.10000000149011612, "history": "made by scipy"}, "nc2": {"a": [[0.10000000149011612, 0.20000000298023224, 0.30000001192092896], [1.5, -1.0000000150474662e+30, 3.25]], "s_scaled": [[60.0, null, 160.0], [13.5, 14.0, 14.5]], "y": [10, 20, 30], "s_raw": [[100, -999, 300], [7, 8, 9]]}, "nc5": {"big": ["1152921504606846977", "-5", "7", "-4611686018427387904"], "ub": ["200", "255"], "us": ["65000", "1"], "ui": ["4000000000", "2"], "i64att": "-3"}, "prim": [[0, 1, 65535, 40000], [5, 6, 7, 8], [9, 10, 11, 12]], "cube": [[[0.0, 0.3333333432674408], [0.6666666865348816, 1.0]], [[1.3333333730697632, 1.6666666269302368], [2.0, 2.3333332538604736]], [[2.6666667461395264, 3.0], [3.3333332538604736, 3.6666667461395264]]], "bt": {"flag": [true, false, true], "i16": [1, null, 300], "i32": [2147483647, -5, 0], "i64": ["4611686018427387907", "-1", "9"], "mag": [12.300000190734863, 0.10000000149011612, -1.5], "ra": [10.684708333, 83.822083, 0.0], "vec": [[1.0, 2.0, 3.0], [4.5, 5.5, 6.5], [0.10000000149011612, 0.20000000298023224, 0.30000001192092896]], "label": ["M31", "M42 neb", ""], "z": [[1.0, 2.0], [-0.0, -0.5], [3.0, 0.0]], "var": [[1, 2], [], [7, 8, 9]], "bits": ["10110", "00001", "11111"], "u16": [0, 40000, 65535], "scaled": [5.0, 6.5, -1.2000000000000002]}, "asc": {"star": ["Vega", "Deneb", "Altair"], "n": [1, 22, 333], "mag": [0.03, 1.25, 0.77], "dist": [25.04, 2615.0, 16.73]}, "example": [20.0, 20.75, 21.5, 22.25, 23.0, 18.0, 18.75, null, 20.25, 21.0, 16.0, 16.75, 17.5, 18.25, 19.0, 14.0, 14.75, 15.5, 16.25, 17.0, 21.5, 22.25, 23.0, 23.75, 24.5, 19.5, 20.25, 21.0, 21.75, 22.5, 17.5, 18.25, 19.0, 19.75, 20.5, 15.5, 16.25, 17.0, 17.75, 18.5, 23.0, 23.75, 24.5, 25.25, 26.0, 21.0, 21.75, 22.5, 23.25, 24.0, 19.0, 19.75, 20.5, 21.25, 22.0, 17.0, 17.75, 18.5, 19.25, 20.0]};
const bytes = (k) => new Uint8Array(zlib.inflateSync(Buffer.from(FIX[k], 'base64')));
const same = (a, b, f = false) => (a === null || b === null ? a === b : f ? Math.fround(a) === Math.fround(b) : Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(b)));
const all = (a, b, f) => Array.isArray(a) && a.length === b.length && a.every((x, i) => (Array.isArray(x) ? all(x, b[i], f) : same(x, b[i], f)));
const item = (r, n) => r.ds.items.findIndex((x) => x.name === n || x.name.includes(n));

export default async (check) => {
  // NetCDF classic (CDF-1) from scipy: one record variable of shorts (records not padded), text, attributes.
  { const r = openBinary(bytes('nc1')), E = EXP.nc1, j = (n, o = {}) => r.json(item(r, n), o);
    check('sciformat: CDF-1 format and dims', r.ds.format === 'NetCDF classic (CDF-1)' && r.ds.dims.map((d) => `${d.name}=${d.size}${d.unlimited ? '*' : ''}`).join(' ') === 'rec=5* x=3 slen=5');
    check('sciformat: CDF-1 single record variable (unpadded records) matches scipy', all(j('count').data, E.count));
    check('sciformat: CDF-1 char variable as strings', JSON.stringify(j('name').data) === JSON.stringify(E.name) && j('name').shape.join() === '3');
    check('sciformat: CDF-1 double and byte', all(j('d').data, E.d) && all(j('b').data, E.b));
    check('sciformat: CDF-1 attributes', all(j('d').attributes.valid_range, E.valid_range) && same(j('d').attributes.fl, E.fl, true) && j('d').attributes.sh === -7 && r.ds.globals[0][1] === E.history);
    check('sciformat: CDF-1 long CSV', JSON.stringify(r.table(item(r, 'count'), {})) === '[["rec","count"],["0","1"],["1","-2"],["2","3"],["3","32000"],["4","-32000"]]'); }
  // 64-bit offset (CDF-2): two record variables (padded), fill value and packing.
  { const r = openBinary(bytes('nc2')), E = EXP.nc2;
    check('sciformat: CDF-2 float record variable matches scipy', r.ds.format.includes('CDF-2') && all(r.json(item(r, 'a'), {}).data, E.a, true));
    check('sciformat: CDF-2 raw shorts', all(r.json(item(r, 's'), { scale: false }).data, E.s_raw));
    check('sciformat: CDF-2 scale_factor, add_offset and _FillValue as scipy maskandscale', all(r.json(item(r, 's'), { scale: true }).data, E.s_scaled));
    const t = r.table(item(r, 's'), { scale: true });
    check('sciformat: coordinate variable used in CSV, fill left empty', t[0].join() === 't,y,s' && t[2].join() === '0,20,' && t[4].join() === '1,10,13.5');
    const g = r.table(item(r, 's'), { scale: true, layout: 'grid' });
    check('sciformat: grid layout', g.length === 3 && g[0].join() === 't \\ y,10,20,30' && g[2].join() === '1,13.5,14,14.5'); }
  // CDF-5 from netCDF4-python: 64-bit sizes, int64 and unsigned types.
  { const r = openBinary(bytes('nc5')), E = EXP.nc5;
    check('sciformat: CDF-5 recognised', r.ds.format.includes('CDF-5') && r.ds.globals.find((g) => g[0] === 'i64att')[1] === E.i64att);
    for (const k of ['big', 'ub', 'us', 'ui']) check(`sciformat: CDF-5 ${k} exact`, r.table(item(r, k), {}).slice(1).map((row) => row[row.length - 1]).join() === E[k].join());
    check('sciformat: int64 outside the safe range kept as exact text in JSON', r.json(item(r, 'big'), {}).data[0][0] === E.big[0]); }
  // FITS from astropy.
  { const r = openBinary(bytes('fits'));
    check('sciformat: FITS four HDUs', r.ds.format === 'FITS' && r.ds.items.length === 4 && r.ds.notes[0].startsWith('4 HDUs: 2 images and 2 tables'));
    check('sciformat: FITS uint16 image via BZERO matches astropy', all(r.json(0, { scale: true }).data, EXP.prim) && r.ds.items[0].type.includes('uint16'));
    check('sciformat: FITS raw image values without BZERO', r.json(0, { scale: false }).data[0][0] === -32768);
    check('sciformat: FITS 3-D float32 cube', all(r.json(1, {}).data, EXP.cube, true) && r.json(1, {}).shape.join() === '3,2,2');
    const g = r.table(0, { scale: true, layout: 'grid' });
    check('sciformat: FITS image grid CSV', g[0].join() === 'y \\ x,1,2,3,4' && g[1].join() === '1,0,1,65535,40000');
    const L = r.table(1, {});
    check('sciformat: FITS cube long CSV with 1-based pixels', L[0].join() === 'x,y,z,value' && L[2].join() === '2,1,1,0.33333334' && L.length === 13);
    const B = r.json(2, { scale: true }).rows, E = EXP.bt, col = (k) => B.map((x) => x[k]);
    check('sciformat: BINTABLE logical, int16 TNULL, int32', JSON.stringify(col('flag')) === JSON.stringify(E.flag) && JSON.stringify(col('i16')) === JSON.stringify(E.i16) && all(col('i32'), E.i32));
    check('sciformat: BINTABLE int64 exact', col('i64').map(String).join() === E.i64.join());
    check('sciformat: BINTABLE float32, float64, vector', all(col('mag'), E.mag, true) && all(col('ra'), E.ra) && all(col('vec'), E.vec, true));
    check('sciformat: BINTABLE text, bits, unsigned via TZERO, TSCAL/TZERO', col('label').join() === E.label.join() && col('bits').join() === E.bits.join() && all(col('u16'), E.u16) && all(col('scaled'), E.scaled));
    check('sciformat: BINTABLE complex as text', col('z').join() === '1+2j,0-0.5j,3+0j');
    check('sciformat: BINTABLE variable-length arrays from the heap', JSON.stringify(col('var')) === JSON.stringify(E.var));
    const T = r.table(2, { scale: true });
    check('sciformat: BINTABLE CSV splits vectors', T[0].slice(6, 9).join() === 'vec_1,vec_2,vec_3' && T[2][1] === '' && T.length === 4);
    const A = r.json(3, {}).rows;
    check('sciformat: ASCII table', A.map((x) => x.star).join() === EXP.asc.star.join() && all(A.map((x) => x.n), EXP.asc.n) && all(A.map((x) => x.mag), EXP.asc.mag) && all(A.map((x) => x.dist), EXP.asc.dist));
    check('sciformat: FITS header as JSON', r.json(0, {}).header.OBJECT === 'Test field' && r.json(0, {}).header.EXPTIME === 30); }
  // The page's example, written by writeNetcdf and read by scipy and netCDF4-python (EXP.example).
  { const ex = exampleNetcdf(), r = openBinary(ex), k = item(r, 'temperature');
    check('sciformat: example NetCDF read back as netCDF4-python reads it', all(r.json(k, { scale: true }).data.flat(2), EXP.example, true));
    check('sciformat: example coordinates and station text', r.table(k, { scale: true })[2].join() === '0,40,-77.5,20.75' && r.json(item(r, 'station'), {}).data === 'GRID-A');
    const f2 = readNetcdf(writeNetcdf({ version: 2, dims: [{ name: 'n', size: 3 }], vars: [{ name: 'v', dims: ['n'], type: 'double', data: [1, 2, 3] }] }));
    check('sciformat: writer makes 64-bit offset files', f2.version === 2 && f2.vars[0].begin > 0); }
  // Refusals and limits.
  check('sciformat: HDF5 (NetCDF-4) recognised and refused plainly', sniff(new Uint8Array(Buffer.from(FIX.h5head, 'base64'))) === 'hdf5' && (() => { try { openBinary(new Uint8Array(Buffer.from(FIX.h5head, 'base64'))); return false; } catch (e) { return e.message.includes('NetCDF-4') && e.message.includes('nccopy'); } })());
  check('sciformat: Parquet refused', (() => { try { openBinary(new TextEncoder().encode('PAR1xxxxxxxx')); return false; } catch (e) { return e.message.includes('Parquet'); } })());
  check('sciformat: cut-off NetCDF', (() => { try { openBinary(bytes('nc1').slice(0, 60)); return false; } catch (e) { return /cut off/.test(e.message); } })());
  check('sciformat: cut-off data', (() => { try { const r = openBinary(exampleNetcdf().slice(0, 900)); r.table(item(r, 'temperature'), {}); return false; } catch (e) { return /shorter than its header/.test(e.message); } })());
  check('sciformat: value limit', (() => { try { const r = openBinary(exampleNetcdf()); r.table(item(r, 'temperature'), { maxValues: 10 }); return false; } catch (e) { return /up to 10 at a time/.test(e.message); } })() && MAX_VALUES === 5e6);
  { const r = openTables([{ name: 'data', table: [['site', 'n', 'x', 'when'], ['A', '1', '2.5', '2026-01-02'], ['B', '2', '', '2026-01-03'], ['', '', '', '']] }], 'CSV');
    check('sciformat: CSV table types and JSON', r.ds.items[0].columns.map((c) => c.type).join() === 'text,integer,number,date' && JSON.stringify(r.json(0, {})) === '[{"site":"A","n":1,"x":2.5,"when":"2026-01-02"},{"site":"B","n":2,"x":null,"when":"2026-01-03"}]' && r.ds.items[0].shape[0] === 2); }
  check('sciformat: shortest float32 text', f32(Math.fround(0.1)) === '0.1' && f32(Math.fround(1 / 3)) === '0.33333334' && f32(Math.fround(16777217)) === '16777216');
};
