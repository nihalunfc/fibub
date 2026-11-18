// Checks for src/lib/music/tags.ts (tag reading and writing, audio facts) and src/lib/audio/cutoff.ts.
// Run with `node tests/music-tags.mjs`. Test files are built here byte by byte; no audio files are committed.
import { readTags, writeTags, audioRange, detectFormat, tagsFromName, nameFromTags, titleCase, matchKey, mpegHeader, genreName, bytesNeeded } from '../src/lib/music/tags.ts';
import { estimateCutoff, fakeBitrateHint } from '../src/lib/audio/cutoff.ts';
import { writeWav } from '../src/lib/audio/pcm.ts';
import { fft } from '../src/lib/sci/dsp.ts';

let fails = 0, n = 0;
const check = (ok, msg) => { n++; if (!ok) { fails++; console.log('FAIL  ' + msg); } };
const cat = (...a) => { const o = new Uint8Array(a.reduce((s, x) => s + x.length, 0)); let p = 0; for (const x of a) { o.set(x, p); p += x.length; } return o; };
const str = (s) => Uint8Array.from(s, (c) => c.charCodeAt(0));
const be32 = (v) => Uint8Array.of(v >>> 24, (v >>> 16) & 255, (v >>> 8) & 255, v & 255);
const le32 = (v) => Uint8Array.of(v & 255, (v >>> 8) & 255, (v >>> 16) & 255, v >>> 24);
const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

// ---- MP3: MPEG-1 layer III, 128 kbps, 44.1 kHz, joint stereo: frame length 144*128000/44100 = 417 bytes.
const frame = (fill = true) => { const f = new Uint8Array(417); f.set([0xff, 0xfb, 0x90, 0x40]); if (fill) for (let i = 4; i < 417; i++) f[i] = (rnd() * 256) | 0; return f; };
const h = mpegHeader(frame(), 0);
check(h && h.version === '1' && h.layer === 3 && h.bitrate === 128 && h.rate === 44100 && h.len === 417 && h.mode === 'Joint stereo', `MPEG header parse ${JSON.stringify(h)}`);
const frames = cat(...Array.from({ length: 40 }, () => frame()));
// A hand-made ID3v2.3 tag: TIT2 (Latin-1) and TCON "(35)" = House.
const tf = (id, txt) => cat(str(id), be32(txt.length + 1), Uint8Array.of(0, 0, 0), str(txt));
const body = cat(tf('TIT2', 'Old Title'), tf('TCON', '(35)'), tf('TCOM', 'Some Composer'), new Uint8Array(20));
const id3 = cat(str('ID3'), Uint8Array.of(3, 0, 0, 0, 0, (body.length >> 7) & 127, body.length & 127), body);
const v1 = new Uint8Array(128); v1.set(str('TAG')); v1.set(str('V1 Artist'), 33); v1[127] = 17;
const mp3 = cat(id3, frames, v1);
let r = readTags(mp3);
check(r.format === 'mp3' && r.tags.title === 'Old Title' && r.tags.genre === 'House' && r.tags.artist === 'V1 Artist', `MP3 read ID3v2.3 + v1 ${JSON.stringify(r.tags)}`);
// 40 frames × 417 bytes = 16680 bytes at 128 kbps = 1.0425 s
check(r.info.bitrate === 128 && !r.info.vbr && Math.abs(r.info.duration - 16680 * 8 / 128000) < 1e-9, `MP3 CBR length ${r.info.duration}`);
const cover = { mime: 'image/png', data: Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4), type: 3, desc: '' };
const want = { title: 'Ünïcode — Tïtle', artist: 'DJ Test', album: 'Album', albumArtist: 'Various', genre: 'Deep House', year: '2024', track: '3/12', bpm: '124', key: '8A', comment: 'Nice', label: 'Label Ltd', isrc: 'GBABC2400001', cover };
let w = writeTags(mp3, want);
r = readTags(w);
const fields = ['title', 'artist', 'album', 'albumArtist', 'genre', 'year', 'track', 'bpm', 'key', 'comment', 'label', 'isrc'];
check(fields.every((f) => r.tags[f] === want[f]), `MP3 write/read all fields ${JSON.stringify({ ...r.tags, cover: undefined })}`);
check(r.tags.cover && r.tags.cover.mime === 'image/png' && same(r.tags.cover.data, cover.data), 'MP3 cover round trip');
check(r.tagTypes[0] === 'ID3v2.3' && w[3] === 3, 'MP3 writes ID3v2.3');
{ const [a, b] = audioRange(w); check(same(w.subarray(a, b), frames), 'MP3 audio bytes unchanged'); }
check(w.subarray(w.length - 128, w.length - 125).every((v, i) => v === 'TAG'.charCodeAt(i)) && w[w.length - 2] === 3, 'MP3 ID3v1 updated (track 3)');
// Unknown frames (TCOM) are kept. UTF-16 BOM on text frames.
check(new TextDecoder('latin1').decode(w).includes('Some Composer'), 'MP3 keeps frames it does not edit (TCOM)');
{ const i = new TextDecoder('latin1').decode(w).indexOf('TIT2'); check(w[i + 10] === 1 && w[i + 11] === 0xff && w[i + 12] === 0xfe, 'MP3 text frames are UTF-16 with BOM'); }
// Remove the cover and clear fields.
w = writeTags(w, { title: 'Only', cover: null });
r = readTags(w);
check(r.tags.title === 'Only' && !r.tags.cover && !r.tags.bpm, 'MP3 rewrite clears fields and removes cover');
// Xing VBR header: 100 frames, 1,000,000 bytes → 100*1152/44100 s and 1e6*8/that bits per second.
{ const x = frame(false); x.set(str('Xing'), 36); x.set(be32(3), 40); x.set(be32(100), 44); x.set(be32(1000000), 48);
  const ri = readTags(cat(x, frames)); const d = 100 * 1152 / 44100;
  check(ri.info.vbr && ri.info.mpeg.vbrHeader === 'Xing' && Math.abs(ri.info.duration - d) < 1e-9 && ri.info.bitrate === Math.round(8e6 / d / 1000), `Xing VBR ${ri.info.duration} ${ri.info.bitrate}`); }
// ID3v2.4 with UTF-8 and a syncsafe size, read and converted.
{ const t = (id, s) => { const b = cat(Uint8Array.of(3), new TextEncoder().encode(s)); return cat(str(id), Uint8Array.of(0, 0, b.length >> 7, b.length & 127, 0, 0), b); };
  const bd = cat(t('TIT2', 'Ça va'), t('TDRC', '2019-05-01'), t('TKEY', 'F#m'));
  const tag = cat(str('ID3'), Uint8Array.of(4, 0, 0, 0, 0, bd.length >> 7, bd.length & 127), bd);
  const ri = readTags(cat(tag, frames)); check(ri.tags.title === 'Ça va' && ri.tags.year === '2019-05-01' && ri.tags.key === 'F#m', `ID3v2.4 read ${JSON.stringify(ri.tags)}`);
  const rw = readTags(writeTags(cat(tag, frames), ri.tags)); check(rw.tags.title === 'Ça va' && rw.tags.year === '2019' && rw.tagTypes[0] === 'ID3v2.3', `ID3v2.4 to v2.3 ${JSON.stringify(rw.tags)}`); }
// Partial read (as the library cleaner does): head + tail + fileSize.
{ const need = bytesNeeded(mp3.subarray(0, 4096), mp3.length); const rp = readTags(mp3.subarray(0, need), { fileSize: mp3.length, tail: mp3.subarray(mp3.length - 128) });
  check(rp.tags.artist === 'V1 Artist' && Math.abs(rp.info.duration - 16680 * 8 / 128000) < 1e-9, `partial read ${need}`); }

// ---- FLAC: STREAMINFO 44.1 kHz, 2 ch, 16 bit, 441000 samples (10 s) + Vorbis comment + 100 bytes padding.
const si = new Uint8Array(34); si.set([0x10, 0, 0x10, 0], 0);
{ const rate = 44100, total = 441000; si[10] = rate >> 12; si[11] = (rate >> 4) & 255; si[12] = ((rate & 15) << 4) | (1 << 1) | 0; si[13] = (15 << 4) | 0; si.set(be32(total), 14); }
const vc = (() => { const v = str('test vendor'); const c = ['TITLE=Flac Song', 'ARTIST=Someone', 'REPLAYGAIN_TRACK_GAIN=-3 dB', 'TRACKNUMBER=5', 'TRACKTOTAL=9']; return cat(le32(v.length), v, le32(c.length), ...c.map((s) => { const e = new TextEncoder().encode(s); return cat(le32(e.length), e); })); })();
const blk = (type, data, last) => cat(Uint8Array.of((last ? 128 : 0) | type, data.length >> 16, (data.length >> 8) & 255, data.length & 255), data);
const faudio = Uint8Array.from({ length: 5000 }, () => (rnd() * 256) | 0);
const flac = cat(str('fLaC'), blk(0, si), blk(4, vc), blk(1, new Uint8Array(400), true), faudio);
r = readTags(flac);
check(r.format === 'flac' && r.tags.title === 'Flac Song' && r.tags.track === '5/9' && r.info.sampleRate === 44100 && r.info.channels === 2 && r.info.bits === 16 && r.info.duration === 10, `FLAC read ${JSON.stringify(r.tags)} ${JSON.stringify(r.info)}`);
w = writeTags(flac, { ...r.tags, bpm: '128', key: '11B', genre: 'Techno', cover });
const rf = readTags(w);
check(rf.tags.bpm === '128' && rf.tags.key === '11B' && rf.tags.track === '5/9' && rf.tags.artist === 'Someone' && same(rf.tags.cover.data, cover.data), `FLAC write/read ${JSON.stringify({ ...rf.tags, cover: 0 })}`);
check(w.length === flac.length && same(w.subarray(w.length - 5000), faudio), `FLAC: padding absorbs the change, audio stays at the same offset (${w.length} vs ${flac.length})`);
check(new TextDecoder().decode(w).includes('REPLAYGAIN_TRACK_GAIN=-3 dB') && new TextDecoder().decode(w).includes('test vendor'), 'FLAC keeps other comments and vendor');
{ const big = writeTags(flac, { title: 'x'.repeat(2000) }); const rb = readTags(big); check(rb.tags.title.length === 2000 && same(big.subarray(big.length - 5000), faudio), 'FLAC grows with fresh padding when the old padding is too small'); }

// ---- WAV: id3 chunk + LIST/INFO; data chunk unchanged.
const pcm = Float32Array.from({ length: 4410 }, (_, i) => Math.sin(i / 10) * 0.5);
const wav = writeWav([pcm], 44100);
w = writeTags(wav, { title: 'Wav Title', artist: 'Wav Artist', bpm: '90', cover });
r = readTags(w);
check(r.format === 'wav' && r.tags.title === 'Wav Title' && r.tags.bpm === '90' && r.tags.cover && r.tagTypes.includes('RIFF INFO') && r.tagTypes.includes('ID3v2.3'), `WAV write/read ${JSON.stringify({ ...r.tags, cover: 0 })} ${r.tagTypes}`);
check(Math.abs(r.info.duration - 0.1) < 1e-9 && r.info.bitrate === 706 && r.info.lossless, `WAV info ${JSON.stringify(r.info)}`);
{ const a = audioRange(wav), b = audioRange(w); check(same(wav.subarray(...a), w.subarray(...b)) && new DataView(w.buffer).getUint32(4, true) === w.length - 8, 'WAV audio unchanged, RIFF size right'); }

// ---- MP4: ftyp, moov (mvhd + one sound trak with stco), mdat after moov, so offsets must move.
const box = (t, ...p) => { const b = cat(...p); return cat(be32(b.length + 8), str(t), b); };
const mdatPayload = Uint8Array.from({ length: 300 }, () => (rnd() * 256) | 0);
const mk = (chunkOff) => {
  const mvhd = box('mvhd', new Uint8Array(4), new Uint8Array(8), be32(1000), be32(5000), new Uint8Array(80));
  const hdlr = box('hdlr', new Uint8Array(8), str('soun'), new Uint8Array(13));
  const entry = cat(be32(36), str('mp4a'), new Uint8Array(6), Uint8Array.of(0, 1), new Uint8Array(8), Uint8Array.of(0, 2, 0, 16, 0, 0, 0, 0), Uint8Array.of(0xac, 0x44, 0, 0));
  const stsd = box('stsd', new Uint8Array(4), be32(1), entry);
  const stco = box('stco', new Uint8Array(4), be32(1), be32(chunkOff));
  const trak = box('trak', box('mdia', hdlr, box('minf', box('stbl', stsd, stco))));
  return cat(box('ftyp', str('M4A '), be32(0), str('M4A isom')), box('moov', mvhd, trak));
};
const head0 = mk(0), mp4 = cat(mk(head0.length + 8), box('mdat', mdatPayload));
r = readTags(mp4);
check(r.format === 'mp4' && r.writable && r.info.duration === 5 && r.info.sampleRate === 44100 && r.info.channels === 2 && r.info.codec === 'AAC', `MP4 info ${JSON.stringify(r.info)}`);
w = writeTags(mp4, want);
r = readTags(w);
check(fields.every((f) => r.tags[f] === want[f]) && same(r.tags.cover.data, cover.data), `MP4 write/read ${JSON.stringify({ ...r.tags, cover: 0 })}`);
{ const s = new TextDecoder('latin1').decode(w), at = s.indexOf('stco') + 12, off = new DataView(w.buffer).getUint32(at);
  check(same(w.subarray(off, off + 300), mdatPayload), `MP4 chunk offset moved with the moov box (${off})`); }
{ const w2 = writeTags(w, { title: 'short', cover: null }); const s = new TextDecoder('latin1').decode(w2), at = s.indexOf('stco') + 12, off = new DataView(w2.buffer).getUint32(at);
  check(readTags(w2).tags.title === 'short' && !readTags(w2).tags.cover && same(w2.subarray(off, off + 300), mdatPayload), 'MP4 shrink keeps offsets right (free box)'); }

// ---- names and matching
check(JSON.stringify(tagsFromName('01 - Artist A - Song B (Extended).mp3', '%track% - %artist% - %title%')) === JSON.stringify({ track: '01', artist: 'Artist A', title: 'Song B (Extended)' }), 'fill from file name');
check(nameFromTags({ track: '3/12', artist: 'A/B', title: 'Song?' }, '%track% %artist% - %title%', 'x.flac') === '03 AB - Song.flac', `name from tags ${nameFromTags({ track: '3/12', artist: 'A/B', title: 'Song?' }, '%track% %artist% - %title%', 'x.flac')}`);
check(titleCase('the sound of the DJ in the UK') === 'The Sound of the DJ in the UK' && titleCase('HELLO WORLD') === 'Hello World', `title case ${titleCase('the sound of the DJ in the UK')}`);
check(matchKey('Artist feat. X', 'Song (Original Mix)') === matchKey('ARTIST', 'song!') && matchKey('A', 'Song') !== matchKey('A', 'Song 2'), 'duplicate key ignores feat., (Original Mix), case and punctuation');
check(genreName('(17)') === 'Rock' && genreName('52') === 'Electronic' && detectFormat(new Uint8Array(10)) === 'unknown', 'genre numbers');

// ---- cutoff: white noise, brick-wall low-passed at 16 kHz with an FFT, vs full band.
const rate = 44100, N = 1 << 17;
const noise = () => Float64Array.from({ length: N }, () => rnd() * 2 - 1);
const lowpass = (x, fc) => { const re = Float64Array.from(x), im = new Float64Array(N); fft(re, im); for (let k = 0; k < N; k++) { const f = Math.min(k, N - k) * rate / N; if (f > fc) { re[k] = 0; im[k] = 0; } } for (let k = 0; k < N; k++) im[k] = -im[k]; fft(re, im); return Float32Array.from(re, (v) => v / N); };
const lp = estimateCutoff(lowpass(noise(), 16000), rate), full = estimateCutoff(Float32Array.from(noise()), rate);
check(lp.cutoff !== null && Math.abs(lp.cutoff - 16000) < 250, `cutoff of 16 kHz low-passed noise: ${lp.cutoff}`);
check(full.cutoff === null, `full-band noise has no cutoff: ${full.cutoff}`);
check(fakeBitrateHint(320, lp.cutoff).suspect && !fakeBitrateHint(128, lp.cutoff).suspect && !fakeBitrateHint(320, null).suspect, 'fake 320 rule of thumb');
check(lowpass(noise(), 19500) && Math.abs(estimateCutoff(lowpass(noise(), 19500), rate).cutoff - 19500) < 250, 'cutoff at 19.5 kHz');

console.log(fails ? `${fails} of ${n} music-tags checks failed` : `music-tags: all ${n} checks pass`);
process.exit(fails ? 1 : 0);
