#!/usr/bin/env node
// Build the tower tiles for #T952 Cell Signal ("Networks near you") from OpenCelliD's per-country downloads.
//   node scripts/cells/build-tiles.mjs --raw <dir with 302.csv.gz, 310.csv.gz, ...> --names <mcc-mnc.csv> [--out public/cells] [--years 3]
// Input: OpenCelliD cell exports (CC BY-SA 4.0): radio,mcc,net,area,cell,unit,lon,lat,range,samples,changeable,created,updated,averageSignal
// (with or without a header line; created/updated are Unix seconds). Cells not seen for --years years are left out.
// Output: public/cells/<lat>_<lon>.json, one per 1° x 1° tile that has cells, each a list of ~1 km squares per carrier
// with counts of 5G/4G/3G/2G cells; public/cells/index.json lists the tiles, carriers and dates. A country is only
// rebuilt when all its MCC files are present, so a partial download never wipes good tiles.
// The tiles are a derived database of OpenCelliD and so are shared under CC BY-SA 4.0 too.
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { BIN, MCC_COUNTRY, brandOf, radioIndex, tileKey } from '../../src/lib/net/cells.ts';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const RAW = opt('raw'), OUT = opt('out', 'public/cells'), NAMES = opt('names'), YEARS = +opt('years', 3);
if (!RAW) { console.error('build-tiles: give --raw <dir>'); process.exit(2); }
const cutoff = Date.now() / 1000 - YEARS * 365.25 * 86400;

// Operator names: a CSV with MCC, MNC and Network columns (header names matched loosely).
const names = new Map();
if (NAMES && existsSync(NAMES)) {
  const lines = readFileSync(NAMES, 'utf8').split(/\r?\n/).filter(Boolean);
  const head = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const iM = head.findIndex((h) => h === 'mcc'), iN = head.findIndex((h) => h === 'mnc'), iNet = head.findIndex((h) => h === 'network' || h === 'operator');
  for (const l of lines.slice(1)) {
    const c = l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((x) => x.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'));
    if (c[iM] && c[iN]) names.set(`${+c[iM]}-${+c[iN]}`, c[iNet] || '');
  }
}

const byCountry = {};
for (const [mcc, c] of Object.entries(MCC_COUNTRY)) (byCountry[c] ||= []).push(mcc);
const have = new Set(readdirSync(RAW).map((f) => f.replace(/\.csv(\.gz)?$/, '')));
const countries = Object.keys(byCountry).filter((c) => byCountry[c].every((m) => have.has(m)));
const skipped = Object.keys(byCountry).filter((c) => !countries.includes(c));
if (skipped.length) console.log(`build-tiles: missing files, keeping old tiles for ${skipped.join(', ')}`);

const idxPath = `${OUT}/index.json`;
const old = existsSync(idxPath) ? JSON.parse(readFileSync(idxPath, 'utf8')) : { tiles: {}, ops: [], countries: {} };
// Keep the operator list stable between builds so old tiles still point at the right names.
const ops = old.ops.slice();
const opIdx = new Map(ops.map((o, i) => [`${o.country}|${o.name}`, i]));
const opOf = (country, mcc, mnc) => {
  const name = brandOf(country, names.get(`${+mcc}-${+mnc}`) || `Network ${mcc}-${mnc}`);
  const k = `${country}|${name}`;
  if (!opIdx.has(k)) { opIdx.set(k, ops.length); ops.push({ name, country }); }
  return opIdx.get(k);
};

const tiles = new Map(); // tile -> Map("latStep,lonStep,op" -> [5G,4G,3G,2G])
const stats = {};
for (const country of countries) {
  stats[country] = { cells: 0, kept: 0 };
  for (const mcc of byCountry[country]) {
    const f = existsSync(`${RAW}/${mcc}.csv.gz`) ? `${RAW}/${mcc}.csv.gz` : `${RAW}/${mcc}.csv`;
    let input = createReadStream(f);
    if (f.endsWith('.gz')) input = input.pipe(createGunzip());
    for await (const line of createInterface({ input, crlfDelay: Infinity })) {
      const c = line.split(',');
      if (c.length < 13 || c[0] === 'radio') continue;
      stats[country].cells++;
      const t = radioIndex(c[0]), lon = +c[6], lat = +c[7], upd = +c[12];
      if (t < 0 || !isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 85 || (lat === 0 && lon === 0) || upd < cutoff) continue;
      if (MCC_COUNTRY[c[1]] !== country) continue;
      stats[country].kept++;
      const key = tileKey(lat, lon), [la, lo] = key.split('_').map(Number);
      const a = Math.min(99, Math.floor((lat - la) / BIN)), b = Math.min(99, Math.floor((lon - lo) / BIN));
      const op = opOf(country, c[1], c[2]);
      let m = tiles.get(key); if (!m) tiles.set(key, (m = new Map()));
      const k = `${a},${b},${op}`; let n = m.get(k); if (!n) m.set(k, (n = [0, 0, 0, 0])); n[t]++;
    }
  }
}

// Remove the old tiles of the rebuilt countries, then write the new ones.
mkdirSync(OUT, { recursive: true });
const index = { v: 1, source: 'OpenCelliD (opencellid.org), CC BY-SA 4.0; grouped into ~1 km squares per carrier by fibub, shared under CC BY-SA 4.0', bin: BIN, years: YEARS, ops, countries: { ...old.countries }, tiles: {} };
const rebuilt = (c) => countries.includes(c);
for (const [k, v] of Object.entries(old.tiles || {})) {
  const p = `${OUT}/${k}.json`;
  if (!v.c.some(rebuilt)) { index.tiles[k] = v; continue; }
  if (!existsSync(p)) continue;
  // Drop the rebuilt countries' rows; keep the rest (a tile on a border can hold two countries).
  const rest = JSON.parse(readFileSync(p, 'utf8')).rows.filter((r) => !rebuilt(ops[r[2]]?.country));
  if (!rest.length) { rmSync(p); continue; }
  writeFileSync(p, JSON.stringify({ v: 1, tile: k, rows: rest }));
  index.tiles[k] = { c: [...new Set(rest.map((r) => ops[r[2]].country))], n: rest.length };
}
for (const [key, m] of tiles) {
  const rows = [...m].map(([k, n]) => [...k.split(',').map(Number), ...n]).sort((x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2]);
  const p = `${OUT}/${key}.json`;
  // Rows of countries not rebuilt this time stay (already filtered above).
  const keep = index.tiles[key] && existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')).rows : [];
  const all = [...keep, ...rows];
  writeFileSync(p, JSON.stringify({ v: 1, tile: key, rows: all }));
  const cs = [...new Set(all.map((r) => ops[r[2]].country))];
  index.tiles[key] = { c: cs, n: all.length };
}
const today = new Date().toISOString().slice(0, 10);
for (const c of countries) index.countries[c] = { updated: today, cells: stats[c].kept };
writeFileSync(idxPath, JSON.stringify(index));
for (const c of countries) console.log(`build-tiles: ${c}: ${stats[c].kept} of ${stats[c].cells} cells kept (seen in the last ${YEARS} years)`);
console.log(`build-tiles: ${Object.keys(index.tiles).length} tiles, ${ops.length} carriers`);
