// Checks for the DJ library converter engine (src/lib/music/djlib.ts) and the mix recorder's tracklist formats
// (src/lib/music/tracklist.ts). Small hand-written library files of each format; run with `node tests/djlib.mjs`.
import * as D from '../src/lib/music/djlib.ts';
import * as T from '../src/lib/music/tracklist.ts';

let fails = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) fails++; };
const enc = (s) => new TextEncoder().encode(s);
const near = (a, b, tol = 0.0005) => Math.abs(a - b) <= tol;

// Rekordbox XML: two tracks (Windows path with a space and an ampersand), hot cue, memory cue, loop, grid, folder tree.
const RB = `<?xml version="1.0" encoding="UTF-8"?>
<DJ_PLAYLISTS Version="1.0.0">
  <PRODUCT Name="rekordbox" Version="6.8.0" Company="AlphaTheta"/>
  <COLLECTION Entries="2">
    <TRACK TrackID="11" Name="Night Drive" Artist="Kai &amp; Lu" Album="Roads" Genre="House" Kind="MP3 File" TotalTime="372" AverageBpm="124.00" DateAdded="2024-03-09" Comments="warm-up" Rating="204" Location="file://localhost/C:/Music/Deep%20House/Night%20Drive.mp3" Tonality="Am">
      <TEMPO Inizio="0.112" Bpm="124.00" Metro="4/4" Battito="1"/>
      <POSITION_MARK Name="Drop" Type="0" Start="61.937" Num="0" Red="40" Green="226" Blue="20"/>
      <POSITION_MARK Name="" Type="0" Start="15.596" Num="-1"/>
      <POSITION_MARK Name="Loop A" Type="4" Start="92.871" End="100.613" Num="1" Red="255" Green="140" Blue="0"/>
    </TRACK>
    <TRACK TrackID="12" Name="Static" Artist="Ona" TotalTime="301" AverageBpm="128.00" Location="file://localhost/C:/Music/Static.mp3" Tonality="10A"/>
  </COLLECTION>
  <PLAYLISTS>
    <NODE Type="0" Name="ROOT" Count="1">
      <NODE Name="Gigs" Type="0" Count="1">
        <NODE Name="Friday set" Type="1" KeyType="0" Entries="2">
          <TRACK Key="12"/>
          <TRACK Key="11"/>
        </NODE>
      </NODE>
    </NODE>
  </PLAYLISTS>
</DJ_PLAYLISTS>`;

const rb = D.readAny('rekordbox.xml', enc(RB));
const t1 = rb.lib.tracks[0];
check(rb.format === 'rekordbox' && t1.path === 'C:/Music/Deep House/Night Drive.mp3' && t1.artist === 'Kai & Lu', `rekordbox: path and entities (${t1.path}, ${t1.artist})`);
check(t1.rating === 4 && t1.key === 'Am' && rb.lib.tracks[1].key === 'Bm' && t1.bpm === 124, `rekordbox: rating 204 = 4 stars, Am, Camelot 10A = Bm (${t1.rating}, ${t1.key}, ${rb.lib.tracks[1].key})`);
check(t1.cues.length === 2 && t1.cues[0].num === 0 && t1.cues[0].color === '#28e214' && t1.cues[1].num === -1 && t1.loops.length === 1 && near(t1.loops[0].end, 100.613), 'rekordbox: hot cue, memory cue and loop read');
const c = D.counts(rb.lib);
check(c.tracks === 2 && c.playlists === 1 && c.folders === 1 && c.cues === 2 && c.loops === 1 && c.grids === 1, `rekordbox: counts ${JSON.stringify(c)}`);
check(rb.lib.playlists[0].children[0].tracks[0] === 'C:/Music/Static.mp3', 'rekordbox: playlist order kept (Static first)');

// Rekordbox -> Traktor -> VirtualDJ -> Rekordbox: cue times to the ms, playlists in order.
const nml = D.writeTraktor(rb.lib);
check(nml.includes('DIR="/:Music/:Deep House/:" FILE="Night Drive.mp3" VOLUME="C:"') && nml.includes('KEY="C:/:Music/:Static.mp3"'), 'traktor: LOCATION and PRIMARYKEY use /: separators');
check(nml.includes('TYPE="0" START="61937.000000"') && nml.includes('TYPE="5" START="92871.000000" LEN="7742.000000" REPEATS="-1" HOTCUE="1"') && nml.includes('TYPE="4" START="112.000000"'), 'traktor: cue, loop and grid in milliseconds');
check(nml.includes('<MUSICAL_KEY VALUE="21">') && nml.includes('KEY="1m"') && nml.includes('RANKING="204"') && nml.includes('IMPORT_DATE="2024/3/9"'), 'traktor: Am = MUSICAL_KEY 21 and Open Key 1m');
const tk = { lib: D.readTraktor(nml) };
const vdj = D.writeVirtualDJ(tk.lib);
check(vdj.includes('FilePath="C:\\Music\\Deep House\\Night Drive.mp3"') && vdj.includes('Bpm="0.483871"') && vdj.includes('Num="1" Type="cue"') && vdj.includes('Type="loop"'), 'virtualdj: Windows path, BPM as seconds per beat (60/124), hot cue Num 1');
const vd = { lib: D.readVirtualDJ(vdj) };
vd.lib.playlists = tk.lib.playlists; // VirtualDJ keeps playlists elsewhere
const back = { lib: D.readRekordbox(D.writeRekordbox(vd.lib)) };
const b1 = back.lib.tracks.find((t) => t.title === 'Night Drive');
const sameCues = t1.cues.every((q) => b1.cues.some((r) => near(r.time, q.time) && r.num === q.num));
check(sameCues && near(b1.loops[0].start, 92.871) && near(b1.loops[0].end, 100.613) && near(b1.grid.first, 0.112) && Math.abs(b1.bpm - 124) < 0.01, 'round trip RB > Traktor > VDJ > RB: cues and loop to the ms');
check(back.lib.playlists[0].name === 'Gigs' && back.lib.playlists[0].children[0].tracks.join('|') === 'C:/Music/Static.mp3|C:/Music/Deep House/Night Drive.mp3', 'round trip: folder and playlist order kept');
check(b1.added === '2024-03-09' && b1.rating === 4 && b1.comment === 'warm-up' && b1.key === 'Am', `round trip: date, rating, comment, key (${b1.added}, ${b1.rating}, ${b1.key})`);

// Traktor macOS paths and smart lists.
const NML = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<NML VERSION="19"><HEAD COMPANY="www.native-instruments.com" PROGRAM="Traktor"></HEAD>
<COLLECTION ENTRIES="2">
<ENTRY TITLE="Sun" ARTIST="Mo"><LOCATION DIR="/:Users/:dj/:Music/:" FILE="sun.flac" VOLUME="Macintosh HD" VOLUMEID="x"></LOCATION><INFO KEY="8m" PLAYTIME="200"></INFO><TEMPO BPM="122.000000"></TEMPO>
<CUE_V2 NAME="n.n." DISPL_ORDER="0" TYPE="0" START="1234.567" LEN="0" REPEATS="-1" HOTCUE="2"></CUE_V2>
<CUE_V2 NAME="Intro" DISPL_ORDER="0" TYPE="3" START="50" LEN="0" REPEATS="-1" HOTCUE="-1"></CUE_V2></ENTRY>
<ENTRY TITLE="Moon" ARTIST="Mo"><LOCATION DIR="/:Sets/:" FILE="moon.mp3" VOLUME="USB" VOLUMEID="y"></LOCATION></ENTRY>
</COLLECTION>
<PLAYLISTS><NODE TYPE="FOLDER" NAME="$ROOT"><SUBNODES COUNT="2">
<NODE TYPE="PLAYLIST" NAME="Late"><PLAYLIST ENTRIES="2" TYPE="LIST" UUID="a"><ENTRY><PRIMARYKEY TYPE="TRACK" KEY="USB/:Sets/:moon.mp3"></PRIMARYKEY></ENTRY><ENTRY><PRIMARYKEY TYPE="TRACK" KEY="Macintosh HD/:Users/:dj/:Music/:sun.flac"></PRIMARYKEY></ENTRY></PLAYLIST></NODE>
<NODE TYPE="SMARTLIST" NAME="Recent"><SMARTLIST UUID="b"></SMARTLIST></NODE>
</SUBNODES></NODE></PLAYLISTS></NML>`;
const tm = D.readAny('collection.nml', enc(NML)).lib;
check(tm.tracks[0].path === '/Users/dj/Music/sun.flac' && tm.tracks[1].path === '/Volumes/USB/Sets/moon.mp3', `traktor: Mac disk and other volume (${tm.tracks.map((t) => t.path)})`);
check(near(tm.tracks[0].cues[0].time, 1.234567, 1e-9) && tm.tracks[0].cues[0].num === 2 && tm.tracks[0].cues[0].name === '' && tm.tracks[0].key === 'Bbm', `traktor: ms to s, hot cue 2, Open Key 8m = Bbm (${tm.tracks[0].key})`);
check(tm.playlists.length === 1 && tm.playlists[0].tracks[0] === '/Volumes/USB/Sets/moon.mp3', 'traktor: smart list skipped, playlist order kept');
const rbMac = D.writeRekordbox(tm);
check(rbMac.includes('Location="file://localhost/Users/dj/Music/sun.flac"') && rbMac.includes('Location="file://localhost/Volumes/USB/Sets/moon.mp3"'), 'rekordbox: macOS file URLs');

// Path prefix swap (moving to another computer).
const moved = D.readRekordbox(RB);
const n = D.swapPrefix(moved, 'c:\\Music\\', '/Volumes/DJ USB/Music/');
check(n === 2 && moved.tracks[0].path === '/Volumes/DJ USB/Music/Deep House/Night Drive.mp3' && moved.playlists[0].children[0].tracks[1] === moved.tracks[0].id, 'swapPrefix: Windows to Mac volume, playlists follow');
check(D.fileUrl(moved.tracks[0].path) === 'file://localhost/Volumes/DJ%20USB/Music/Deep%20House/Night%20Drive.mp3', 'fileUrl: spaces encoded');

// M3U8 in and out.
const M3U = '#EXTM3U\r\n#EXTINF:372,Kai & Lu - Night Drive\r\nC:\\Music\\Deep House\\Night Drive.mp3\r\n#EXTINF:-1,Static\r\nC:\\Music\\Static.mp3\r\n';
const m = D.readAny('Friday.m3u8', enc(M3U)).lib;
check(m.playlists[0].name === 'Friday' && m.tracks[0].artist === 'Kai & Lu' && m.tracks[0].duration === 372 && m.tracks[1].path === 'C:/Music/Static.mp3', 'm3u: EXTINF artist, title, length, path');
check(D.writeM3u(m, m.playlists[0]) === M3U, 'm3u: writes back the same file');

// Serato crate: binary round trip, subcrate name, drive-relative paths.
const crate = D.writeCrate(rb.lib, rb.lib.playlists[0].children[0]);
const head = new TextDecoder().decode(crate.subarray(0, 4));
const cr = D.readCrate(crate, 'Gigs%%Friday set.crate', 'C:/');
check(head === 'vrsn' && cr.playlists[0].folder && cr.playlists[0].name === 'Gigs' && cr.playlists[0].children[0].name === 'Friday set', 'serato: vrsn header, %% subcrate becomes a folder');
check(cr.playlists[0].children[0].tracks.join('|') === 'C:/Music/Static.mp3|C:/Music/Deep House/Night Drive.mp3', 'serato: paths and order survive a round trip');
check(D.seratoPath('/Volumes/USB/Sets/a.mp3') === 'Sets/a.mp3' && D.seratoPath('/Users/dj/a.mp3') === 'Users/dj/a.mp3', 'serato: paths relative to the drive');
const files = D.writeAs(rb.lib, 'serato');
check(files.length === 1 && files[0].name === 'Gigs%%Friday set.crate', `writeAs serato: one crate per playlist (${files.map((f) => f.name)})`);
check(D.lost('rekordbox', 'serato', rb.lib).some((s) => s.includes('inside the music files')), 'lost: says Serato cue points are not converted');

// Keys.
check(D.camelot(D.keyIndex('C')) === '8B' && D.camelot(D.keyIndex('F#m')) === '11A' && D.openKey(D.keyIndex('G')) === '2d' && D.keyName(D.keyIndex('3A')) === 'Bbm' && D.keyIndex('Ebmin') === 15, 'keys: Camelot, Open Key and names');

// Tracklist formats for the mix recorder.
check(T.stamp(0) === '00:00' && T.stamp(205.9) === '03:25' && T.stamp(3725) === '01:02:05' && T.stamp(65, true) === '00:01:05', 'stamp: mm:ss and hh:mm:ss');
check(T.cueTime(0) === '00:00:00' && T.cueTime(61.5) === '01:01:38' && T.cueTime(7384.2) === '123:04:15', `cueTime: 75 frames per second (${T.cueTime(61.5)}, ${T.cueTime(7384.2)})`);
check(T.parseTime('1:15') === 75 && T.parseTime('1:02:03') === 3723 && T.parseTime('90.5') === 90.5 && Number.isNaN(T.parseTime('1:2:3:4')), 'parseTime');
const marks = [{ t: 212.4, artist: 'Ona', title: 'Static' }, { t: 0, artist: 'Kai & Lu', title: 'Night Drive' }];
check(T.tracklistText(marks) === '00:00 Kai & Lu – Night Drive\n03:32 Ona – Static\n', 'tracklistText: sorted, 00:00 Artist – Title');
const cue = T.cueSheet(marks, 'mix.wav', { performer: 'DJ Test', title: 'Friday' });
check(cue.includes('FILE "mix.wav" WAVE\r\n  TRACK 01 AUDIO\r\n    TITLE "Night Drive"\r\n    PERFORMER "Kai & Lu"\r\n    INDEX 01 00:00:00') && cue.includes('TRACK 02 AUDIO') && cue.includes('INDEX 01 03:32:30'), 'cueSheet: FILE, TRACK, INDEX 01 (212.4 s = 03:32:30)');
check(T.cueSheet([{ t: 30, artist: '', title: 'A' }], 'mix.mp3').includes('FILE "mix.mp3" MP3\r\n  TRACK 01 AUDIO\r\n    TITLE "Intro"'), 'cueSheet: adds a track at 00:00 when the first mark is later');
check(T.tracklistCsv(marks, 400).split('\r\n')[2] === '2,00:03:32,212.40,Ona,Static,187.60', 'tracklistCsv: length to the end of the mix');
const h = T.wavHeader(48000 * 2, 48000, 2), hv = new DataView(h.buffer);
check(hv.getUint32(40, true) === 384000 && hv.getUint32(4, true) === 384036 && hv.getUint32(28, true) === 192000 && hv.getUint16(32, true) === 4, 'wavHeader: 2 s stereo 48 kHz 16-bit');
check(T.splitLabel('Kai & Lu – Night Drive').artist === 'Kai & Lu' && T.splitLabel('Just a title').title === 'Just a title', 'splitLabel');

console.log(fails ? `${fails} failed` : 'All djlib checks passed');
process.exit(fails ? 1 : 0);
