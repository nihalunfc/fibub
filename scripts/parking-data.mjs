#!/usr/bin/env node
// Builds the open parking data for Parking Finder (#T954) into public/parking/v1/.
// Run by .github/workflows/parking-data.yml once a month (and by hand). It needs the internet, so it never runs in
// `npm run build`. Sources (both open, both credited on the tool page):
//   - OpenStreetMap (ODbL, © OpenStreetMap contributors) through the Overpass API: parking lots and garages,
//     street parking tagged on roads, and a list of Ontario places, stations, hospitals, campuses and malls so
//     visitors can search by name without the page calling any outside service.
//   - City of Ottawa open data (Open Government Licence - City of Ottawa): pay and display machines (hours and
//     rates), time-limited free blocks and city parking lots.
// Output: one small JSON file per 0.2 x 0.2 degree square (a visitor's phone downloads only the squares around
// them, from fibub itself), places.json for the search box and index.json with the list of squares and the date.
// Nothing about visitors is involved: this only reads public map data.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const OUT = 'public/parking/v1';
const TILE = 5; // squares per degree (0.2 degrees, about 22 km north-south)
const OVERPASS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];
const UA = { 'User-Agent': 'fibub-parking-data/1.0 (+https://fibub.com/vehicles/parking-finder/)' };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const r5 = (v) => Math.round(v * 1e5) / 1e5;

async function overpass(q, label) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const url = OVERPASS[attempt % OVERPASS.length];
    try {
      const res = await fetch(url, { method: 'POST', headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(q) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      if (j.remark && /runtime error|timed out|out of memory/i.test(j.remark)) throw new Error(j.remark);
      console.log(`${label}: ${j.elements.length} elements from ${url}`);
      return j.elements;
    } catch (e) {
      console.warn(`${label}: ${url} failed (${e.message}); retrying`);
      await sleep(20000 * (attempt + 1));
    }
  }
  throw new Error(`${label}: every Overpass server failed`);
}

const AREA = 'area["ISO3166-2"="CA-ON"][admin_level=4]->.on;';
const where = (e) => (e.center ? [e.center.lat, e.center.lon] : [e.lat, e.lon]);

// ---- OpenStreetMap: lots and garages ----
const TYPES = { surface: 'surface', 'multi-storey': 'garage', underground: 'underground', rooftop: 'garage', street_side: 'street', lane: 'street', layby: 'street', carports: 'surface', garage_boxes: 'private' };
function lot(e) {
  const t = e.tags || {};
  const access = (t.access || '').toLowerCase();
  if (['private', 'no', 'delivery', 'emergency', 'agricultural', 'forestry'].includes(access)) return null;
  const kind = TYPES[t.parking] || 'surface';
  if (kind === 'private') return null;
  const [y, x] = where(e);
  if (y == null) return null;
  const o = { k: kind === 'street' ? 's' : 'l', y: r5(y), x: r5(x), src: 'o', id: e.type[0] + e.id };
  if (kind !== 'street') o.p = kind; // surface | garage | underground
  const name = t.name || t['name:en'] || '';
  if (name) o.n = name;
  if (t.operator) o.op = t.operator;
  if (access === 'customers') o.a = 'c';
  else if (access === 'permit' || access === 'residents') o.a = 'p';
  else if (access === 'destination') o.a = 'd';
  if (t.fee) o.f = t.fee === 'no' ? 0 : t.fee === 'yes' ? 1 : t.fee; // 0, 1 or text such as "Mo-Fr 08:00-18:00"
  if (t['fee:conditional']) o.fc = t['fee:conditional'];
  if (t.charge) o.c = t.charge;
  if (t.opening_hours) o.h = t.opening_hours;
  if (t.maxstay) o.m = t.maxstay;
  if (t['maxstay:conditional']) o.mc = t['maxstay:conditional'];
  if (t.capacity && /^\d+$/.test(t.capacity)) o.cap = +t.capacity;
  if (t['capacity:disabled'] && /^\d+$/.test(t['capacity:disabled'])) o.dis = +t['capacity:disabled'];
  if (t['capacity:charging'] && /^\d+$/.test(t['capacity:charging'])) o.ev = +t['capacity:charging'];
  if (t.park_ride && t.park_ride !== 'no') o.pr = 1;
  if (t.maxheight) o.mh = t.maxheight;
  if (t.supervised === 'yes') o.sv = 1;
  if (t['payment:app'] === 'yes' || t['payment:app']) o.app = 1;
  return o;
}

// ---- OpenStreetMap: street parking tagged on roads (new and old schemes) ----
const NOPARK = new Set(['no', 'no_parking', 'no_stopping', 'no_standing', 'separate', 'fire_lane']);
function streetSides(e) {
  const t = e.tags || {};
  const [y, x] = where(e);
  if (y == null) return [];
  const out = [];
  for (const side of ['left', 'right']) {
    const get = (k) => t[`parking:${side}:${k}`] ?? t[`parking:both:${k}`];
    const getOld = (k) => t[`parking:lane:${side}:${k}`] ?? t[`parking:lane:both:${k}`] ?? t[`parking:condition:${side}:${k}`] ?? t[`parking:condition:both:${k}`];
    let type = t[`parking:${side}`] ?? t['parking:both'];
    let restr = get('restriction');
    if (type == null) {
      type = t[`parking:lane:${side}`] ?? t['parking:lane:both'];
      const cond = t[`parking:condition:${side}`] ?? t['parking:condition:both'];
      if (cond && NOPARK.has(cond)) restr = cond;
      else if (cond === 'ticket') { if (!get('fee')) t[`parking:${side}:fee`] = 'yes'; }
      else if (cond === 'free') t[`parking:${side}:fee`] = 'no';
      else if (cond === 'disc') restr = 'disc';
      else if (cond === 'residents') t[`parking:${side}:access`] = 'residents';
    }
    if (type == null || NOPARK.has(type) || type === 'no') continue;
    if (restr && NOPARK.has(restr)) continue;
    const o = { k: 's', y: r5(y), x: r5(x), src: 'o', id: 'w' + e.id, side: side[0] };
    if (t.name) o.n = t.name;
    const fee = get('fee') ?? getOld('fee');
    if (fee) o.f = fee === 'no' ? 0 : fee === 'yes' ? 1 : fee;
    const ms = get('maxstay') ?? getOld('maxstay') ?? t[`parking:condition:${side}:maxstay`] ?? t['parking:condition:both:maxstay'];
    if (ms) o.m = ms;
    const rc = get('restriction:conditional') ?? t[`parking:condition:${side}:conditional`] ?? t['parking:condition:both:conditional'];
    if (rc) o.rc = rc;
    const ac = get('access');
    if (ac === 'private' || ac === 'no') continue;
    if (ac === 'residents' || ac === 'permit') o.a = 'p';
    const ah = get('access:conditional');
    if (ah) o.ac = ah;
    const mc = get('maxstay:conditional');
    if (mc) o.mc = mc;
    const fc = get('fee:conditional');
    if (fc) o.fc = fc;
    if (restr === 'disc') o.disc = 1;
    out.push(o);
  }
  // Same rules on both sides: keep one point for the road.
  if (out.length === 2 && JSON.stringify({ ...out[0], side: 0 }) === JSON.stringify({ ...out[1], side: 0 })) { delete out[0].side; return [out[0]]; }
  return out;
}

// ---- City of Ottawa open data ----
const OTTAWA = 'https://maps.ottawa.ca/arcgis/rest/services/Parking/MapServer';
async function arcgis(layer) {
  const all = [];
  for (let offset = 0; ; offset += 1000) {
    const u = `${OTTAWA}/${layer}/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&resultOffset=${offset}&resultRecordCount=1000`;
    let j;
    for (let a = 0; a < 4; a++) {
      try { const r = await fetch(u, { headers: UA }); if (!r.ok) throw new Error('HTTP ' + r.status); j = await r.json(); break; } catch (e) { console.warn(`Ottawa layer ${layer}: ${e.message}`); await sleep(5000 * (a + 1)); }
    }
    if (!j || !j.features) throw new Error(`Ottawa layer ${layer} failed`);
    all.push(...j.features);
    if (j.features.length < 1000 && !j.exceededTransferLimit) break;
    if (j.features.length === 0) break;
  }
  console.log(`Ottawa layer ${layer}: ${all.length} features`);
  return all;
}
function mid(g) {
  if (!g) return null;
  if (g.type === 'Point') return [g.coordinates[1], g.coordinates[0]];
  const line = g.type === 'MultiLineString' ? g.coordinates.flat() : g.type === 'LineString' ? g.coordinates : g.type === 'Polygon' ? g.coordinates[0] : g.type === 'MultiPolygon' ? g.coordinates[0][0] : null;
  if (!line || !line.length) return null;
  const p = line[Math.floor(line.length / 2)];
  return [p[1], p[0]];
}
const clean = (v) => (v == null ? '' : String(v).trim());
const prop = (p, ...keys) => { for (const k of keys) { const hit = Object.keys(p).find((x) => x.toUpperCase() === k); if (hit && clean(p[hit])) return clean(p[hit]); } return ''; };

async function ottawa() {
  const out = [];
  const tries = async (layer, fn) => { try { for (const f of await arcgis(layer)) { const o = fn(f.properties || {}, mid(f.geometry)); if (o) out.push(o); } } catch (e) { console.warn(e.message); } };
  // 0: pay and display machines (points): hours and hourly rate for weekdays, Saturday and Sunday.
  await tries(0, (p, at) => {
    if (!at) return null;
    const st = prop(p, 'STATUS');
    if (st && /remov|inactive|out/i.test(st)) return null;
    const o = { k: 's', y: r5(at[0]), x: r5(at[1]), src: 'ott', f: 1, n: prop(p, 'BLOCKFACE', 'LOCATION', 'ADDRESS') || 'Pay and display street parking' };
    const wk = { mf: [prop(p, 'MON_FRI_HOURS'), prop(p, 'MON_FRI_HR')], sa: [prop(p, 'SAT_HOURS'), prop(p, 'SAT_HR')], su: [prop(p, 'SUN_HOURS'), prop(p, 'SUN_HR')] };
    o.pay = wk; // [hours text, hourly rate text] per day group
    const rd = prop(p, 'RATE_DESC'); if (rd) o.c = rd;
    const hol = prop(p, 'HOLIDAY'); if (hol) o.hol = hol;
    return o;
  });
  // 1: time-limited free street parking (lines): limit, hours and days.
  await tries(1, (p, at) => {
    if (!at) return null;
    if (/yes|y/i.test(prop(p, 'NO_STOP')) || /yes|y/i.test(prop(p, 'NO_PARK'))) return null;
    const o = { k: 's', y: r5(at[0]), x: r5(at[1]), src: 'ott', f: 0, n: prop(p, 'BLOCKFACE') || 'Time-limited street parking' };
    const reg = prop(p, 'REGULATION'); if (reg) o.m = reg;
    const dur = prop(p, 'DURATION'); if (dur) o.lim = dur;
    const day = prop(p, 'DAY'); if (day) o.days = day;
    const n = prop(p, 'SUMSTALLS'); if (/^\d+$/.test(n)) o.cap = +n;
    return o;
  });
  // 4: city parking lots (points).
  await tries(4, (p, at) => {
    if (!at) return null;
    const o = { k: 'l', y: r5(at[0]), x: r5(at[1]), src: 'ott', p: 'surface', n: prop(p, 'ADDRESS') ? `City lot, ${prop(p, 'ADDRESS')}` : 'City of Ottawa lot' };
    const ty = prop(p, 'TYPE'); if (/garage|structure|under/i.test(ty)) o.p = 'garage';
    const sp = prop(p, 'SPACES'); if (/^\d+$/.test(sp)) o.cap = +sp;
    const hr = prop(p, 'HEIGHTRESTRICTION'); if (hr) o.mh = hr;
    if (/yes|y/i.test(prop(p, 'PERMIT'))) o.pm = 1;
    o.op = 'City of Ottawa';
    return o;
  });
  return out;
}

// ---- Places for the search box ----
function place(e) {
  const t = e.tags || {};
  const name = t.name || t['name:en'];
  if (!name) return null;
  const [y, x] = where(e);
  if (y == null) return null;
  let k = t.place;
  if (!k) k = t.railway === 'station' || t.public_transport === 'station' ? 'station' : t.amenity === 'hospital' ? 'hospital' : ['university', 'college'].includes(t.amenity) ? 'campus' : t.shop === 'mall' ? 'mall' : t.aeroway === 'aerodrome' ? 'airport' : t.amenity === 'bus_station' ? 'bus' : t.tourism === 'attraction' ? 'sight' : t.leisure === 'stadium' ? 'stadium' : 'place';
  return [name, r5(y), r5(x), k];
}

async function main() {
  const lotsQ = `[out:json][timeout:900][maxsize:1073741824];${AREA}nwr["amenity"="parking"](area.on);out center tags qt;`;
  const streetQ = `[out:json][timeout:900][maxsize:1073741824];${AREA}(way["highway"]["parking:both"](area.on);way["highway"]["parking:left"](area.on);way["highway"]["parking:right"](area.on);way["highway"]["parking:lane:both"](area.on);way["highway"]["parking:lane:left"](area.on);way["highway"]["parking:lane:right"](area.on););out center tags qt;`;
  const placesQ = `[out:json][timeout:600][maxsize:536870912];${AREA}(node["place"~"^(city|town|village|suburb|neighbourhood|quarter|hamlet)$"]["name"](area.on);nwr["railway"="station"]["name"](area.on);nwr["public_transport"="station"]["name"](area.on);nwr["amenity"~"^(hospital|university|college|bus_station)$"]["name"](area.on);nwr["shop"="mall"]["name"](area.on);nwr["aeroway"="aerodrome"]["iata"](area.on);nwr["leisure"="stadium"]["name"](area.on);nwr["tourism"="attraction"]["name"]["wikidata"](area.on););out center tags qt;`;

  const items = [];
  for (const e of await overpass(lotsQ, 'parking lots')) { const o = lot(e); if (o) items.push(o); }
  await sleep(10000);
  let streets = 0;
  for (const e of await overpass(streetQ, 'street parking')) for (const o of streetSides(e)) { items.push(o); streets++; }
  console.log(`street parking points from OSM: ${streets}`);
  await sleep(10000);
  const places = [];
  const seen = new Set();
  for (const e of await overpass(placesQ, 'places')) {
    const p = place(e);
    if (!p) continue;
    const key = p[0] + '|' + Math.round(p[1] * 100) + '|' + Math.round(p[2] * 100);
    if (seen.has(key)) continue;
    seen.add(key);
    places.push(p);
  }
  const ott = await ottawa();
  items.push(...ott);

  if (items.length < 5000) throw new Error(`only ${items.length} parking items: something went wrong, keeping the old data`);

  // Split into squares.
  const tiles = new Map();
  for (const o of items) {
    const key = `${Math.floor(o.y * TILE)}_${Math.floor(o.x * TILE)}`;
    if (!tiles.has(key)) tiles.set(key, []);
    tiles.get(key).push(o);
  }
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT + '/t', { recursive: true });
  const index = {};
  for (const [key, list] of tiles) {
    list.sort((a, b) => a.y - b.y || a.x - b.x);
    writeFileSync(`${OUT}/t/${key}.json`, JSON.stringify(list));
    index[key] = list.length;
  }
  places.sort((a, b) => a[0].localeCompare(b[0]));
  writeFileSync(`${OUT}/places.json`, JSON.stringify(places));
  const counts = { lots: items.filter((o) => o.k === 'l').length, street: items.filter((o) => o.k === 's').length, ottawa: ott.length, places: places.length, squares: tiles.size };
  writeFileSync(`${OUT}/index.json`, JSON.stringify({ date: new Date().toISOString().slice(0, 10), tile: TILE, counts, tiles: index }));
  console.log(JSON.stringify(counts));
}

main().catch((e) => { console.error(e); process.exit(1); });
