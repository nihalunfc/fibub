// DJ library converter engine (#T1015): one neutral model of a DJ library with readers and writers for
// Rekordbox XML, Traktor NML, VirtualDJ database.xml, M3U/M3U8 and Serato .crate files (playlists only).
// Written from the public descriptions of these formats; they belong to their makers and fibub is not affiliated.
// Plain TypeScript, no DOM, so Node can check it (tests/djlib.mjs). All times in the model are seconds.

export interface Cue { name: string; time: number; num: number; color?: string } // num: hot cue slot 0-7, or -1 for a memory cue
export interface Loop { name: string; start: number; end: number; num: number; color?: string }
export interface Grid { first: number; bpm: number }
export interface Track {
  id: string; path: string; title: string; artist: string; album: string; genre: string;
  bpm?: number; key?: string; duration?: number; rating?: number; comment: string; added?: string; // added: YYYY-MM-DD
  cues: Cue[]; loops: Loop[]; grid?: Grid;
}
export interface PlNode { name: string; folder: boolean; children: PlNode[]; tracks: string[] } // tracks: track ids, in order
export interface Library { tracks: Track[]; playlists: PlNode[]; notes: string[] }
export type Format = 'rekordbox' | 'traktor' | 'virtualdj' | 'm3u' | 'serato';
export const FORMATS: Record<Format, { label: string; ext: string; full: boolean }> = {
  rekordbox: { label: 'Rekordbox XML', ext: 'xml', full: true },
  traktor: { label: 'Traktor NML', ext: 'nml', full: true },
  virtualdj: { label: 'VirtualDJ database.xml', ext: 'xml', full: true },
  m3u: { label: 'M3U8 playlists', ext: 'm3u8', full: false },
  serato: { label: 'Serato crates', ext: 'crate', full: false },
};

// ---------- keys ----------
const MAJ = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MIN = ['Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'];
const PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
/** Key index 0-23: 0-11 major from C, 12-23 minor from C (the order Traktor's MUSICAL_KEY uses). */
export function keyIndex(s: string | undefined): number {
  if (!s) return -1;
  const t = s.trim().replace(/♯/g, '#').replace(/♭/g, 'b');
  let m = t.match(/^(\d{1,2})\s*([ABab])$/); // Camelot
  if (m) { const n = +m[1]; if (n < 1 || n > 12) return -1; const minor = m[2].toUpperCase() === 'A'; const p = minor ? (((n - 5) * 7) % 12 + 12) % 12 : (((n - 8) * 7) % 12 + 12) % 12; return p + (minor ? 12 : 0); }
  m = t.match(/^(\d{1,2})\s*([dmDM])$/); // Open Key
  if (m) { const n = +m[1]; if (n < 1 || n > 12) return -1; const cam = ((n - 1 + 7) % 12) + 1; return keyIndex(`${cam}${m[2].toLowerCase() === 'm' ? 'A' : 'B'}`); }
  m = t.match(/^([A-Ga-g])\s*([#b]?)\s*(m|min|minor|maj|major|M)?$/);
  if (m) { let p = PC[m[1].toUpperCase()] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); p = (p + 12) % 12; const minor = !!m[3] && /^m(in(or)?)?$/.test(m[3]); return p + (minor ? 12 : 0); }
  return -1;
}
export const keyName = (i: number) => (i < 0 ? '' : i < 12 ? MAJ[i] : MIN[i - 12]);
export function camelot(i: number): string { if (i < 0) return ''; const p = i % 12, minor = i >= 12; const n = ((7 * p + (minor ? 5 : 8)) % 12) || 12; return `${n}${minor ? 'A' : 'B'}`; }
export function openKey(i: number): string { if (i < 0) return ''; const c = camelot(i), n = +c.slice(0, -1); return `${((n - 8 + 12) % 12) + 1}${c.endsWith('A') ? 'm' : 'd'}`; }
const normKey = (s: string | undefined) => keyName(keyIndex(s));

// ---------- small XML reader/writer ----------
export interface XNode { tag: string; attrs: Record<string, string>; kids: XNode[]; text: string }
const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const unent = (s: string) => s.replace(/&(#x[0-9a-fA-F]+|#\d+|\w+);/g, (a, e) => (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e] ?? a));
export const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
export function parseXml(src: string): XNode {
  const root: XNode = { tag: '#root', attrs: {}, kids: [], text: '' }, stack = [root];
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[([\s\S]*?)\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<\/\s*([^\s>]+)\s*>|<([^\s/>]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const top = stack[stack.length - 1];
    if (m[1] !== undefined) top.text += m[1];
    else if (m[2]) { if (stack.length > 1) stack.pop(); }
    else if (m[3]) {
      const n: XNode = { tag: m[3], attrs: {}, kids: [], text: '' };
      const ar = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g; let a: RegExpExecArray | null;
      while ((a = ar.exec(m[4]))) n.attrs[a[1]] = unent(a[2] ?? a[3]);
      top.kids.push(n); if (!m[5]) stack.push(n);
    } else if (m[6]) top.text += unent(m[6]);
  }
  return root;
}
const kid = (n: XNode | undefined, tag: string) => n?.kids.find((k) => k.tag === tag);
const kids = (n: XNode | undefined, tag: string) => n?.kids.filter((k) => k.tag === tag) ?? [];
function find(n: XNode, tag: string): XNode | undefined { for (const k of n.kids) { if (k.tag === tag) return k; const f = find(k, tag); if (f) return f; } }
const attrs = (o: Record<string, string | number | undefined>) => Object.entries(o).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => ` ${k}="${esc(String(v))}"`).join('');
const num = (s: string | undefined) => { const v = parseFloat(s ?? ''); return Number.isFinite(v) ? v : undefined; };
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const fx = (v: number, d: number) => (Math.round(v * 10 ** d) / 10 ** d).toFixed(d);

// ---------- paths ----------
/** Model paths use forward slashes: "C:/Music/a.mp3" (Windows) or "/Users/me/Music/a.mp3" (macOS). */
export const normPath = (p: string) => { let s = p.trim().replace(/\\/g, '/'); if (/^[a-z]:/.test(s)) s = s[0].toUpperCase() + s.slice(1); return s; };
export const isWin = (p: string) => /^[A-Za-z]:\//.test(p);
export const nativePath = (p: string) => (isWin(p) ? p.replace(/\//g, '\\') : p);
const fileName = (p: string) => p.slice(p.lastIndexOf('/') + 1);
const stem = (p: string) => fileName(p).replace(/\.[^.]+$/, '');
export function fileUrl(p: string): string { return 'file://localhost' + (isWin(p) ? '/' : '') + encodeURI(p).replace(/#/g, '%23').replace(/\?/g, '%3F'); }
export function fromFileUrl(u: string): string {
  let s = u.replace(/^file:\/\/(localhost)?/i, '');
  try { s = decodeURIComponent(s); } catch { /* keep as is */ }
  if (/^\/[A-Za-z]:\//.test(s)) s = s.slice(1);
  return normPath(s);
}
/** Replace the start of every track path, e.g. "C:/Music/" to "/Users/me/Music/". Returns how many changed. */
export function swapPrefix(lib: Library, from: string, to: string): number {
  const f = normPath(from), t = normPath(to); if (!f) return 0;
  const ci = isWin(f), idMap = new Map<string, string>(); let n = 0;
  for (const tr of lib.tracks) {
    const hit = ci ? tr.path.toLowerCase().startsWith(f.toLowerCase()) : tr.path.startsWith(f);
    if (hit) { const old = tr.id; tr.path = t + tr.path.slice(f.length); tr.id = tr.path; idMap.set(old, tr.id); n++; }
  }
  const walk = (ns: PlNode[]) => { for (const p of ns) { p.tracks = p.tracks.map((id) => idMap.get(id) ?? id); walk(p.children); } };
  walk(lib.playlists);
  return n;
}

// ---------- model helpers ----------
const blank = (path: string): Track => ({ id: path, path, title: '', artist: '', album: '', genre: '', comment: '', cues: [], loops: [] });
export const emptyLib = (): Library => ({ tracks: [], playlists: [], notes: [] });
export function counts(lib: Library) {
  let playlists = 0, folders = 0, entries = 0;
  const walk = (ns: PlNode[]) => { for (const p of ns) { if (p.folder) folders++; else { playlists++; entries += p.tracks.length; } walk(p.children); } };
  walk(lib.playlists);
  return { tracks: lib.tracks.length, playlists, folders, entries, cues: lib.tracks.reduce((a, t) => a + t.cues.length, 0), loops: lib.tracks.reduce((a, t) => a + t.loops.length, 0), grids: lib.tracks.filter((t) => t.grid).length };
}
/** Every playlist (not folder) with its path of folder names, for a "choose playlists" list. */
export function flatPlaylists(lib: Library): { path: string[]; node: PlNode }[] {
  const out: { path: string[]; node: PlNode }[] = [];
  const walk = (ns: PlNode[], at: string[]) => { for (const p of ns) { if (p.folder) walk(p.children, [...at, p.name]); else { out.push({ path: [...at, p.name], node: p }); walk(p.children, [...at, p.name]); } } };
  walk(lib.playlists, []);
  return out;
}
/** Merge several libraries (e.g. many M3U files); tracks with the same path become one. */
export function merge(libs: Library[]): Library {
  const out = emptyLib(), byId = new Map<string, Track>();
  for (const l of libs) {
    for (const t of l.tracks) { const have = byId.get(t.id); if (!have) { byId.set(t.id, t); out.tracks.push(t); } else { for (const k of ['title', 'artist', 'album', 'genre', 'comment'] as const) have[k] ||= t[k]; have.bpm ??= t.bpm; have.key ||= t.key; have.duration ??= t.duration; if (!have.cues.length) have.cues = t.cues; if (!have.loops.length) have.loops = t.loops; have.grid ??= t.grid; } }
    out.playlists.push(...l.playlists); out.notes.push(...l.notes);
  }
  return out;
}
/** Keep only the chosen playlists (and the tracks in them); folders that end up empty are dropped. */
export function pick(lib: Library, keep: Set<PlNode>, allTracks = false): Library {
  const prune = (ns: PlNode[]): PlNode[] => ns.flatMap((p) => { const ch = prune(p.children); if (p.folder) return ch.length ? [{ ...p, children: ch }] : []; return keep.has(p) || ch.length ? [{ ...p, children: ch, tracks: keep.has(p) ? p.tracks : [] }] : []; });
  const playlists = prune(lib.playlists), used = new Set<string>();
  const walk = (ns: PlNode[]) => { for (const p of ns) { p.tracks.forEach((t) => used.add(t)); walk(p.children); } };
  walk(playlists);
  return { tracks: allTracks ? lib.tracks : lib.tracks.filter((t) => used.has(t.id)), playlists, notes: lib.notes };
}
const hex2 = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
const rgbHex = (r?: string, g?: string, b?: string) => (r === undefined || g === undefined || b === undefined ? undefined : `#${hex2(+r)}${hex2(+g)}${hex2(+b)}`);

// ---------- Rekordbox XML ----------
const RB_STARS = [0, 51, 102, 153, 204, 255];
export function readRekordbox(src: string): Library {
  const doc = parseXml(src), dj = find(doc, 'DJ_PLAYLISTS');
  if (!dj) throw new Error('This is not a Rekordbox XML file (no DJ_PLAYLISTS).');
  const lib = emptyLib(), byTid = new Map<string, string>();
  for (const e of kids(kid(dj, 'COLLECTION'), 'TRACK')) {
    const a = e.attrs, t = blank(fromFileUrl(a.Location ?? ''));
    t.title = a.Name ?? ''; t.artist = a.Artist ?? ''; t.album = a.Album ?? ''; t.genre = a.Genre ?? ''; t.comment = a.Comments ?? '';
    t.bpm = num(a.AverageBpm) || undefined; t.key = normKey(a.Tonality) || undefined; t.duration = num(a.TotalTime);
    const rt = num(a.Rating); if (rt !== undefined) t.rating = RB_STARS.reduce((b, v, i) => (Math.abs(v - rt) < Math.abs(RB_STARS[b] - rt) ? i : b), 0);
    if (a.DateAdded) t.added = a.DateAdded;
    const tempos = kids(e, 'TEMPO');
    if (tempos.length) { t.grid = { first: num(tempos[0].attrs.Inizio) ?? 0, bpm: num(tempos[0].attrs.Bpm) ?? t.bpm ?? 0 }; if (tempos.length > 1 && !lib.notes.includes('rb-tempo')) lib.notes.push('rb-tempo'); }
    for (const p of kids(e, 'POSITION_MARK')) {
      const pa = p.attrs, type = +(pa.Type ?? 0), start = num(pa.Start) ?? 0, n = +(pa.Num ?? -1), color = rgbHex(pa.Red, pa.Green, pa.Blue);
      if (type === 4 && pa.End !== undefined) t.loops.push({ name: pa.Name ?? '', start, end: num(pa.End) ?? start, num: n, color });
      else t.cues.push({ name: pa.Name ?? '', time: start, num: n, color });
    }
    byTid.set(a.TrackID ?? '', t.id); lib.tracks.push(t);
  }
  const node = (n: XNode): PlNode => {
    const folder = n.attrs.Type === '0', kt = n.attrs.KeyType;
    return { name: n.attrs.Name ?? '', folder, children: folder ? kids(n, 'NODE').map(node) : [], tracks: folder ? [] : kids(n, 'TRACK').map((k) => (kt === '1' ? normPath(fromFileUrl(k.attrs.Key ?? '')) : byTid.get(k.attrs.Key ?? '') ?? '')).filter(Boolean) };
  };
  const root = kid(kid(dj, 'PLAYLISTS'), 'NODE');
  if (root) lib.playlists = kids(root, 'NODE').map(node);
  return lib;
}
export function writeRekordbox(lib: Library): string {
  const tid = new Map(lib.tracks.map((t, i) => [t.id, i + 1]));
  const L = ['<?xml version="1.0" encoding="UTF-8"?>', '<DJ_PLAYLISTS Version="1.0.0">', '  <PRODUCT Name="fibub library converter" Version="1" Company="fibub.com"/>', `  <COLLECTION Entries="${lib.tracks.length}">`];
  for (const t of lib.tracks) {
    const a = attrs({ TrackID: tid.get(t.id), Name: t.title || stem(t.path), Artist: t.artist, Album: t.album, Genre: t.genre, TotalTime: t.duration !== undefined ? Math.round(t.duration) : undefined, AverageBpm: t.bpm ? fx(t.bpm, 2) : undefined, DateAdded: t.added, Comments: t.comment, Rating: t.rating !== undefined ? RB_STARS[Math.max(0, Math.min(5, Math.round(t.rating)))] : undefined, Location: fileUrl(t.path), Tonality: t.key });
    const inner: string[] = [];
    if (t.grid) inner.push(`      <TEMPO Inizio="${fx(t.grid.first, 3)}" Bpm="${fx(t.grid.bpm, 2)}" Metro="4/4" Battito="1"/>`);
    const col = (c?: string) => (c && /^#[0-9a-f]{6}$/i.test(c) ? ` Red="${parseInt(c.slice(1, 3), 16)}" Green="${parseInt(c.slice(3, 5), 16)}" Blue="${parseInt(c.slice(5, 7), 16)}"` : '');
    for (const c of t.cues) inner.push(`      <POSITION_MARK Name="${esc(c.name)}" Type="0" Start="${fx(c.time, 3)}" Num="${c.num}"${c.num >= 0 ? col(c.color) : ''}/>`);
    for (const l of t.loops) inner.push(`      <POSITION_MARK Name="${esc(l.name)}" Type="4" Start="${fx(l.start, 3)}" End="${fx(l.end, 3)}" Num="${l.num}"${l.num >= 0 ? col(l.color) : ''}/>`);
    L.push(inner.length ? `    <TRACK${a}>\n${inner.join('\n')}\n    </TRACK>` : `    <TRACK${a}/>`);
  }
  L.push('  </COLLECTION>', '  <PLAYLISTS>', `    <NODE Type="0" Name="ROOT" Count="${lib.playlists.length}">`);
  const w = (n: PlNode, ind: string) => {
    if (n.folder) { L.push(`${ind}<NODE Name="${esc(n.name)}" Type="0" Count="${n.children.length}">`); n.children.forEach((c) => w(c, ind + '  ')); L.push(`${ind}</NODE>`); return; }
    const ts = n.tracks.filter((id) => tid.has(id));
    L.push(`${ind}<NODE Name="${esc(n.name)}" Type="1" KeyType="0" Entries="${ts.length}">`, ...ts.map((id) => `${ind}  <TRACK Key="${tid.get(id)}"/>`), `${ind}</NODE>`);
  };
  lib.playlists.forEach((n) => w(n, '      '));
  L.push('    </NODE>', '  </PLAYLISTS>', '</DJ_PLAYLISTS>', '');
  return L.join('\n');
}

// ---------- Traktor NML ----------
// CUE_V2 TYPE: 0 cue, 1 fade-in, 2 fade-out, 3 load, 4 grid marker, 5 loop. START and LEN in milliseconds.
export const MAC_DISK = 'Macintosh HD';
export function traktorLoc(path: string, macDisk = MAC_DISK): { volume: string; dir: string; file: string } {
  const p = normPath(path), file = fileName(p);
  let volume: string, rest: string;
  if (isWin(p)) { volume = p.slice(0, 2); rest = p.slice(2); }
  else { const m = p.match(/^\/Volumes\/([^/]+)(\/.*)$/); if (m) { volume = m[1]; rest = m[2]; } else { volume = macDisk; rest = p; } }
  const parts = rest.slice(0, rest.lastIndexOf('/')).split('/').filter(Boolean);
  return { volume, dir: '/:' + parts.map((d) => d + '/:').join(''), file };
}
export function fromTraktorLoc(volume: string, dir: string, file: string, macDisk = MAC_DISK): string {
  const d = dir.split('/:').filter(Boolean).join('/'), body = (d ? '/' + d : '') + '/' + file;
  if (/^[A-Za-z]:$/.test(volume)) return volume.toUpperCase() + body;
  if (!volume || volume === macDisk) return body;
  return `/Volumes/${volume}${body}`;
}
const tkKey = (path: string, macDisk = MAC_DISK) => { const l = traktorLoc(path, macDisk); return l.volume + l.dir + l.file; };
export function readTraktor(src: string, macDisk = MAC_DISK): Library {
  const doc = parseXml(src), nml = find(doc, 'NML');
  if (!nml) throw new Error('This is not a Traktor NML file (no NML).');
  const lib = emptyLib(), byKey = new Map<string, string>();
  for (const e of kids(kid(nml, 'COLLECTION'), 'ENTRY')) {
    const loc = kid(e, 'LOCATION'); if (!loc) continue;
    const vol = loc.attrs.VOLUME ?? '', dir = loc.attrs.DIR ?? '', file = loc.attrs.FILE ?? '';
    const t = blank(fromTraktorLoc(vol, dir, file, macDisk)), info = kid(e, 'INFO')?.attrs ?? {};
    t.title = e.attrs.TITLE ?? ''; t.artist = e.attrs.ARTIST ?? ''; t.album = kid(e, 'ALBUM')?.attrs.TITLE ?? '';
    t.genre = info.GENRE ?? ''; t.comment = info.COMMENT ?? '';
    t.duration = num(info.PLAYTIME_FLOAT) ?? num(info.PLAYTIME);
    const rk = num(info.RANKING); if (rk !== undefined) t.rating = Math.round(rk / 51);
    if (info.IMPORT_DATE) { const m = info.IMPORT_DATE.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/); if (m) t.added = `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
    t.bpm = num(kid(e, 'TEMPO')?.attrs.BPM) || undefined;
    const mk = num(kid(e, 'MUSICAL_KEY')?.attrs.VALUE);
    t.key = mk !== undefined && mk >= 0 && mk < 24 ? keyName(mk) : normKey(info.KEY) || undefined;
    for (const c of kids(e, 'CUE_V2')) {
      const a = c.attrs, type = +(a.TYPE ?? 0), start = (num(a.START) ?? 0) / 1000, len = (num(a.LEN) ?? 0) / 1000, hot = +(a.HOTCUE ?? -1);
      if (type === 4) { if (!t.grid) t.grid = { first: start, bpm: t.bpm ?? 0 }; }
      else if (type === 5) t.loops.push({ name: a.NAME === 'n.n.' ? '' : a.NAME ?? '', start, end: start + len, num: hot });
      else t.cues.push({ name: a.NAME === 'n.n.' ? '' : a.NAME ?? '', time: start, num: hot });
    }
    byKey.set(vol + dir + file, t.id); lib.tracks.push(t);
  }
  const node = (n: XNode): PlNode | null => {
    const type = n.attrs.TYPE;
    if (type === 'FOLDER') return { name: n.attrs.NAME ?? '', folder: true, children: kids(kid(n, 'SUBNODES'), 'NODE').map(node).filter((x): x is PlNode => !!x), tracks: [] };
    if (type === 'PLAYLIST') return { name: n.attrs.NAME ?? '', folder: false, children: [], tracks: kids(kid(n, 'PLAYLIST'), 'ENTRY').map((en) => kid(en, 'PRIMARYKEY')?.attrs.KEY ?? '').map((k) => byKey.get(k) ?? '').filter(Boolean) };
    return null; // smart lists are rules, not track lists
  };
  const root = kid(kid(nml, 'PLAYLISTS'), 'NODE');
  if (root) lib.playlists = kids(kid(root, 'SUBNODES'), 'NODE').map(node).filter((x): x is PlNode => !!x);
  return lib;
}
export function writeTraktor(lib: Library, macDisk = MAC_DISK): string {
  const ids = new Set(lib.tracks.map((t) => t.id)), byId = new Map(lib.tracks.map((t) => [t.id, t]));
  const L = ['<?xml version="1.0" encoding="UTF-8" standalone="no" ?>', '<NML VERSION="19"><HEAD COMPANY="www.native-instruments.com" PROGRAM="Traktor"></HEAD>', '<MUSICFOLDERS></MUSICFOLDERS>', `<COLLECTION ENTRIES="${lib.tracks.length}">`];
  for (const t of lib.tracks) {
    const loc = traktorLoc(t.path, macDisk), ki = keyIndex(t.key);
    L.push(`<ENTRY${attrs({ TITLE: t.title || stem(t.path), ARTIST: t.artist })}>`);
    L.push(`<LOCATION${attrs({ DIR: loc.dir, FILE: loc.file, VOLUME: loc.volume, VOLUMEID: loc.volume })}></LOCATION>`);
    if (t.album) L.push(`<ALBUM${attrs({ TITLE: t.album })}></ALBUM>`);
    const d = t.added?.match(/^(\d{4})-(\d{2})-(\d{2})/);
    L.push(`<INFO${attrs({ GENRE: t.genre, COMMENT: t.comment, KEY: ki >= 0 ? openKey(ki) : undefined, PLAYTIME: t.duration !== undefined ? Math.round(t.duration) : undefined, PLAYTIME_FLOAT: t.duration !== undefined ? fx(t.duration, 6) : undefined, IMPORT_DATE: d ? `${d[1]}/${+d[2]}/${+d[3]}` : undefined, RANKING: t.rating !== undefined ? Math.round(t.rating) * 51 : undefined })}></INFO>`);
    const bpm = t.grid?.bpm || t.bpm;
    if (bpm) L.push(`<TEMPO BPM="${fx(bpm, 6)}" BPM_QUALITY="100.000000"></TEMPO>`);
    if (ki >= 0) L.push(`<MUSICAL_KEY VALUE="${ki}"></MUSICAL_KEY>`);
    let order = 0;
    if (t.grid) L.push(`<CUE_V2 NAME="AutoGrid" DISPL_ORDER="${order++}" TYPE="4" START="${fx(t.grid.first * 1000, 6)}" LEN="0.000000" REPEATS="-1" HOTCUE="-1"></CUE_V2>`);
    for (const c of t.cues) L.push(`<CUE_V2 NAME="${esc(c.name || 'n.n.')}" DISPL_ORDER="${order++}" TYPE="0" START="${fx(c.time * 1000, 6)}" LEN="0.000000" REPEATS="-1" HOTCUE="${c.num >= 0 && c.num < 8 ? c.num : -1}"></CUE_V2>`);
    for (const l of t.loops) L.push(`<CUE_V2 NAME="${esc(l.name || 'n.n.')}" DISPL_ORDER="${order++}" TYPE="5" START="${fx(l.start * 1000, 6)}" LEN="${fx((l.end - l.start) * 1000, 6)}" REPEATS="-1" HOTCUE="${l.num >= 0 && l.num < 8 ? l.num : -1}"></CUE_V2>`);
    L.push('</ENTRY>');
  }
  L.push('</COLLECTION>', '<SETS ENTRIES="0"></SETS>', '<PLAYLISTS>');
  const w = (n: PlNode) => {
    if (n.folder) { L.push(`<NODE TYPE="FOLDER" NAME="${esc(n.name)}"><SUBNODES COUNT="${n.children.length}">`); n.children.forEach(w); L.push('</SUBNODES></NODE>'); return; }
    const ts = n.tracks.filter((id) => ids.has(id));
    L.push(`<NODE TYPE="PLAYLIST" NAME="${esc(n.name)}"><PLAYLIST ENTRIES="${ts.length}" TYPE="LIST" UUID="">`);
    for (const id of ts) L.push(`<ENTRY><PRIMARYKEY TYPE="TRACK" KEY="${esc(tkKey(byId.get(id)!.path, macDisk))}"></PRIMARYKEY></ENTRY>`);
    L.push('</PLAYLIST></NODE>');
  };
  L.push(`<NODE TYPE="FOLDER" NAME="$ROOT"><SUBNODES COUNT="${lib.playlists.length}">`); lib.playlists.forEach(w); L.push('</SUBNODES></NODE>');
  L.push('</PLAYLISTS>', '</NML>', '');
  return L.join('\n');
}

// ---------- VirtualDJ database.xml ----------
// Song FilePath (native path); Tags (Author, Title, Genre, Album, Key, Stars); Infos SongLength (s), FirstSeen (Unix s);
// Scan Bpm is seconds per beat (0.46875 = 128 BPM); Poi Pos in seconds: Type beatgrid, cue (Num 1-8 = hot cues), loop (Size in seconds).
export function readVirtualDJ(src: string): Library {
  const doc = parseXml(src), db = find(doc, 'VirtualDJ_Database');
  if (!db) throw new Error('This is not a VirtualDJ database.xml (no VirtualDJ_Database).');
  const lib = emptyLib();
  const bpmOf = (s?: string) => { const v = num(s); return !v ? undefined : v < 10 ? 60 / v : v; };
  for (const s of kids(db, 'Song')) {
    if (!s.attrs.FilePath) continue;
    const t = blank(normPath(s.attrs.FilePath)), tg = kid(s, 'Tags')?.attrs ?? {}, inf = kid(s, 'Infos')?.attrs ?? {}, sc = kid(s, 'Scan')?.attrs ?? {};
    t.title = tg.Title ?? ''; t.artist = tg.Author ?? ''; t.album = tg.Album ?? ''; t.genre = tg.Genre ?? ''; t.comment = kid(s, 'Comment')?.text.trim() ?? '';
    t.bpm = bpmOf(tg.Bpm) ?? bpmOf(sc.Bpm); if (t.bpm) t.bpm = Math.round(t.bpm * 1000) / 1000;
    t.key = normKey(tg.Key) || normKey(sc.Key) || undefined;
    t.duration = num(inf.SongLength); const st = num(tg.Stars); if (st !== undefined) t.rating = st;
    const fs = num(inf.FirstSeen); if (fs) t.added = new Date(fs * 1000).toISOString().slice(0, 10);
    let hotless = 0;
    for (const p of kids(s, 'Poi')) {
      const a = p.attrs, pos = num(a.Pos) ?? 0, type = a.Type ?? 'cue', n = num(a.Num);
      if (type === 'beatgrid') { if (!t.grid && t.bpm) t.grid = { first: pos, bpm: t.bpm }; }
      else if (type === 'loop') t.loops.push({ name: a.Name ?? '', start: pos, end: pos + (num(a.Size) ?? 0), num: n !== undefined && n >= 1 && n <= 8 ? n - 1 : -1 });
      else if (type === 'cue' || type === 'remix') t.cues.push({ name: a.Name ?? '', time: pos, num: n !== undefined && n >= 1 && n <= 8 ? n - 1 : -1 });
      else hotless++;
    }
    if (hotless && !lib.notes.includes('vdj-poi')) lib.notes.push('vdj-poi');
    lib.tracks.push(t);
  }
  return lib;
}
export function writeVirtualDJ(lib: Library): string {
  const L = ['<?xml version="1.0" encoding="UTF-8"?>', '<VirtualDJ_Database Version="8.2">'];
  for (const t of lib.tracks) {
    L.push(` <Song FilePath="${esc(nativePath(t.path))}">`);
    L.push(`  <Tags${attrs({ Author: t.artist, Title: t.title || stem(t.path), Genre: t.genre, Album: t.album, Key: t.key, Stars: t.rating !== undefined ? Math.round(t.rating) : undefined })} />`);
    L.push(`  <Infos${attrs({ SongLength: t.duration !== undefined ? fx(t.duration, 6) : undefined, FirstSeen: t.added ? Math.floor(Date.parse(t.added + 'T00:00:00Z') / 1000) : undefined })} />`);
    if (t.comment) L.push(`  <Comment>${esc(t.comment)}</Comment>`);
    const bpm = t.grid?.bpm || t.bpm;
    if (bpm || t.key) L.push(`  <Scan${attrs({ Version: 801, Bpm: bpm ? fx(60 / bpm, 6) : undefined, Key: t.key })} />`);
    if (t.grid) L.push(`  <Poi Pos="${fx(t.grid.first, 6)}" Type="beatgrid" />`);
    // Memory cues have no slot in VirtualDJ, so they take the numbers after the 8 hot cues.
    let extra = 9;
    for (const c of t.cues) L.push(`  <Poi${attrs({ Name: c.name, Pos: fx(c.time, 6), Num: c.num >= 0 && c.num < 8 ? c.num + 1 : extra++, Type: 'cue' })} />`);
    for (const l of t.loops) L.push(`  <Poi${attrs({ Name: l.name, Pos: fx(l.start, 6), Size: fx(l.end - l.start, 6), Type: 'loop' })} />`);
    L.push(' </Song>');
  }
  L.push('</VirtualDJ_Database>', '');
  return L.join('\n');
}

// ---------- M3U / M3U8 ----------
export function readM3u(src: string, name: string): Library {
  const lib = emptyLib(), pl: PlNode = { name, folder: false, children: [], tracks: [] };
  let info: { dur?: number; artist: string; title: string } | null = null;
  for (const raw of src.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const line = raw.trim(); if (!line) continue;
    if (line.startsWith('#')) {
      const m = line.match(/^#EXTINF:\s*(-?[\d.]+)[^,]*,(.*)$/);
      if (m) { const txt = m[2].trim(), i = txt.indexOf(' - '); info = { dur: +m[1] >= 0 ? +m[1] : undefined, artist: i > 0 ? txt.slice(0, i) : '', title: i > 0 ? txt.slice(i + 3) : txt }; }
      continue;
    }
    const path = /^file:/i.test(line) ? fromFileUrl(line) : normPath(line);
    let t = lib.tracks.find((x) => x.id === path);
    if (!t) { t = blank(path); if (info) { t.artist = info.artist; t.title = info.title; t.duration = info.dur; } lib.tracks.push(t); }
    pl.tracks.push(t.id); info = null;
  }
  lib.playlists.push(pl);
  return lib;
}
export function writeM3u(lib: Library, pl: PlNode): string {
  const byId = new Map(lib.tracks.map((t) => [t.id, t])), L = ['#EXTM3U'];
  for (const id of pl.tracks) {
    const t = byId.get(id); if (!t) continue;
    const label = t.artist && t.title ? `${t.artist} - ${t.title}` : t.title || stem(t.path);
    L.push(`#EXTINF:${t.duration !== undefined ? Math.round(t.duration) : -1},${label.replace(/[\r\n]+/g, ' ')}`, nativePath(t.path));
  }
  return L.join('\r\n') + '\r\n';
}

// ---------- Serato .crate (playlists only) ----------
// Records: 4-byte ASCII tag, 4-byte big-endian length, data. vrsn holds a UTF-16BE version string; each otrk holds a
// ptrk record whose data is the track path in UTF-16BE, relative to the drive (no leading slash or drive letter).
const u16be = (s: string) => { const b = new Uint8Array(s.length * 2); for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); b[i * 2] = c >> 8; b[i * 2 + 1] = c & 255; } return b; };
const fromU16be = (b: Uint8Array) => { let s = ''; for (let i = 0; i + 1 < b.length; i += 2) s += String.fromCharCode((b[i] << 8) | b[i + 1]); return s; };
function rec(tag: string, data: Uint8Array): Uint8Array { const o = new Uint8Array(8 + data.length); for (let i = 0; i < 4; i++) o[i] = tag.charCodeAt(i); new DataView(o.buffer).setUint32(4, data.length); o.set(data, 8); return o; }
function cat(parts: Uint8Array[]): Uint8Array { const o = new Uint8Array(parts.reduce((a, p) => a + p.length, 0)); let k = 0; for (const p of parts) { o.set(p, k); k += p.length; } return o; }
function records(b: Uint8Array): { tag: string; data: Uint8Array }[] {
  const out: { tag: string; data: Uint8Array }[] = [], dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  for (let i = 0; i + 8 <= b.length;) { const tag = String.fromCharCode(b[i], b[i + 1], b[i + 2], b[i + 3]), len = dv.getUint32(i + 4); out.push({ tag, data: b.subarray(i + 8, Math.min(b.length, i + 8 + len)) }); i += 8 + len; }
  return out;
}
/** The path Serato stores: relative to the drive. */
export function seratoPath(p: string): string { const s = normPath(p); if (isWin(s)) return s.slice(3); const m = s.match(/^\/Volumes\/[^/]+\/(.*)$/); return m ? m[1] : s.replace(/^\//, ''); }
/** Read a crate. `root` is put in front of the stored paths ("/" for the Mac system disk, "C:/" or "/Volumes/USB/" for others). */
export function readCrate(b: Uint8Array, fileNameOfCrate: string, root = '/'): Library {
  const rs = records(b);
  if (rs[0]?.tag !== 'vrsn') throw new Error('This is not a Serato crate (no vrsn header).');
  const lib = emptyLib(), parts = fileNameOfCrate.replace(/\.crate$/i, '').split('%%');
  const pl: PlNode = { name: parts[parts.length - 1], folder: false, children: [], tracks: [] };
  const base = normPath(root).replace(/\/?$/, '/');
  for (const r of rs) if (r.tag === 'otrk') for (const k of records(r.data)) if (k.tag === 'ptrk') {
    const path = normPath(base + fromU16be(k.data).replace(/^\//, ''));
    if (!lib.tracks.some((t) => t.id === path)) lib.tracks.push(blank(path));
    pl.tracks.push(path);
  }
  // A crate named "A%%B" is crate B inside crate A: rebuild that as folders.
  let top: PlNode = pl;
  for (let i = parts.length - 2; i >= 0; i--) top = { name: parts[i], folder: true, children: [top], tracks: [] };
  lib.playlists.push(top);
  return lib;
}
export function writeCrate(lib: Library, pl: PlNode): Uint8Array {
  const byId = new Map(lib.tracks.map((t) => [t.id, t]));
  const cols = ['song', 'artist', 'bpm', 'key', 'album', 'length', 'comment'];
  return cat([
    rec('vrsn', u16be('1.0/Serato ScratchLive Crate')),
    rec('osrt', cat([rec('tvcn', u16be('song')), rec('brev', new Uint8Array([0]))])),
    ...cols.map((c) => rec('ovct', cat([rec('tvcn', u16be(c)), rec('tvcw', u16be('0'))]))),
    ...pl.tracks.filter((id) => byId.has(id)).map((id) => rec('otrk', rec('ptrk', u16be(seratoPath(byId.get(id)!.path))))),
  ]);
}

// ---------- detect and convert ----------
export function detect(name: string, head: string): Format | null {
  if (/\.crate$/i.test(name)) return 'serato';
  if (/\.m3u8?$/i.test(name)) return 'm3u';
  if (/<DJ_PLAYLISTS/i.test(head)) return 'rekordbox';
  if (/<NML[\s>]/.test(head)) return 'traktor';
  if (/<VirtualDJ_Database/i.test(head)) return 'virtualdj';
  if (/^\s*#EXTM3U/.test(head)) return 'm3u';
  return null;
}
export function readAny(name: string, bytes: Uint8Array, opts: { macDisk?: string; crateRoot?: string } = {}): { format: Format; lib: Library } {
  const head = new TextDecoder().decode(bytes.subarray(0, 4096));
  const format = detect(name, head);
  if (!format) throw new Error(`${name}: not a library export this tool knows.`);
  const text = () => new TextDecoder(/\.m3u$/i.test(name) && !/^\uFEFF|#EXTM3U/.test(head) ? 'windows-1252' : 'utf-8').decode(bytes);
  const lib = format === 'serato' ? readCrate(bytes, name, opts.crateRoot) : format === 'm3u' ? readM3u(text(), name.replace(/\.m3u8?$/i, '')) : format === 'rekordbox' ? readRekordbox(text()) : format === 'traktor' ? readTraktor(text(), opts.macDisk) : readVirtualDJ(text());
  return { format, lib };
}
const safe = (s: string) => s.replace(/[\\/:*?"<>|\x00-\x1f]+/g, '_').trim() || 'playlist';
/** Files to save for one output format. Full formats give one file; M3U and crates give one file per playlist. */
export function writeAs(lib: Library, f: Format, opts: { macDisk?: string } = {}): { name: string; bytes: Uint8Array }[] {
  const enc = (s: string) => new TextEncoder().encode(s);
  if (f === 'rekordbox') return [{ name: 'rekordbox.xml', bytes: enc(writeRekordbox(lib)) }];
  if (f === 'traktor') return [{ name: 'collection.nml', bytes: enc(writeTraktor(lib, opts.macDisk)) }];
  if (f === 'virtualdj') return [{ name: 'database.xml', bytes: enc(writeVirtualDJ(lib)) }];
  const pls = flatPlaylists(lib);
  if (!pls.length && lib.tracks.length) pls.push({ path: ['All tracks'], node: { name: 'All tracks', folder: false, children: [], tracks: lib.tracks.map((t) => t.id) } });
  return pls.map((p) => f === 'm3u' ? { name: p.path.map(safe).join(' - ') + '.m3u8', bytes: enc(writeM3u(lib, p.node)) } : { name: p.path.map(safe).join('%%') + '.crate', bytes: writeCrate(lib, p.node) });
}
/** What will not carry over from one format to another, in plain words. */
export function lost(from: Format, to: Format, lib: Library): string[] {
  const c = counts(lib), out: string[] = [];
  if (!FORMATS[to].full && (c.cues || c.loops || c.grids)) out.push(`${FORMATS[to].label} hold only playlists, so cue points, loops, beat grids and tags are left out.`);
  if (to === 'serato') out.push('Serato keeps cue points inside the music files’ own tags, not in crates, so cue points cannot be carried into Serato from here.');
  if (to === 'traktor' && lib.tracks.some((t) => t.cues.some((q) => q.color) || t.loops.some((q) => q.color))) out.push('Traktor colours cues by their type, so your cue colours are not kept.');
  if (to === 'virtualdj' && lib.tracks.some((t) => t.cues.some((q) => q.color))) out.push('Cue colours are not written to VirtualDJ.');
  if (to === 'virtualdj' && c.playlists) out.push('VirtualDJ keeps playlists in separate files, so the playlists are also saved as M3U8 files you can open in VirtualDJ.');
  if (lib.notes.includes('rb-tempo')) out.push('Some tracks have a changing tempo in the beat grid; only the first tempo and first beat are kept.');
  if (lib.notes.includes('vdj-poi')) out.push('Some VirtualDJ points that are not cues, loops or beat grids (such as automix points) are left out.');
  if (from === 'serato' || from === 'm3u') out.push('Playlists from M3U or crate files carry only the file paths (and, in M3U, names and lengths), not cues or BPM.');
  return out;
}
