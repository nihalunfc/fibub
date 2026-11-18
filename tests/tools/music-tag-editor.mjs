// #T1018 Tag editor
import { unzipSync } from 'fflate';
import { readTags, audioRange } from '../../src/lib/music/tags.ts';
export const path = '/everyday/music-tag-editor/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/music-tag-editor/`); await page.waitForTimeout(300);
  const R = '.mte ';
  // Two tagless MP3s: 30 frames of MPEG-1 layer III, 128 kbps, 44.1 kHz (417 bytes each), filled with a known pattern.
  await page.evaluate(() => {
    const mk = (seed) => { const b = new Uint8Array(417 * 30); for (let f = 0; f < 30; f++) { b.set([0xff, 0xfb, 0x90, 0x40], f * 417); for (let i = 4; i < 417; i++) b[f * 417 + i] = (i * seed + f) & 255; } return b; };
    const dt = new DataTransfer();
    dt.items.add(new File([mk(7)], 'Artist A - Song B.mp3', { type: 'audio/mpeg' }));
    dt.items.add(new File([mk(11)], 'the other one - track two.mp3', { type: 'audio/mpeg' }));
    const inp = document.querySelector('.mte .mte-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForSelector(R + '.mte-work:not([hidden])', { timeout: 20000 });
  const facts = await page.textContent(R + 'tbody tr:first-child .mte-name small');
  check((await page.textContent(R + '.mte-count')).startsWith('2 files, 2 ticked, 0 changed') && facts === 'MP3, 128 kbps, 44.1 kHz', `music-tag-editor: opens 2 MP3s and reads the header (${facts})`);
  await page.click(R + '.mte-more summary');
  await page.click(R + '.mte-dofill');
  const t1 = await page.inputValue(R + 'tbody tr:first-child input[data-f=title]'), a1 = await page.inputValue(R + 'tbody tr:first-child input[data-f=artist]');
  check(t1 === 'Song B' && a1 === 'Artist A', `music-tag-editor: fill from file name (${a1} / ${t1})`);
  await page.click(R + '.mte-docase');
  const a2 = await page.inputValue(R + 'tbody tr:nth-child(2) input[data-f=artist]');
  check(a2 === 'The Other One', `music-tag-editor: Title Case (${a2})`);
  await page.selectOption(R + '.mte-bf', 'genre'); await page.fill(R + '.mte-bv', 'Deep House'); await page.click(R + '.mte-apply');
  await page.fill(R + 'tbody tr:first-child input[data-f=bpm]', '124');
  await page.click(R + '.mte-doname');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mte-zip')]);
  const f = OUT + 'mte.zip'; await d.saveAs(f);
  const z = unzipSync(new Uint8Array(readFileSync(f))), names = Object.keys(z).sort();
  check(d.suggestedFilename() === 'tagged-music.zip' && names.join('|') === 'Artist A - Song B.mp3|The Other One - Track Two.mp3', `music-tag-editor: ZIP with names from tags (${names.join(' | ')})`);
  const b = z['Artist A - Song B.mp3'], r = readTags(b), [s, e] = audioRange(b);
  let same = e - s === 417 * 30; for (let i = 4; same && i < 417; i++) if (b[s + i] !== ((i * 7) & 255)) same = false;
  check(r.tags.title === 'Song B' && r.tags.artist === 'Artist A' && r.tags.genre === 'Deep House' && r.tags.bpm === '124' && r.tagTypes[0] === 'ID3v2.3' && same, `music-tag-editor: saved tags read back, audio unchanged (${JSON.stringify(r.tags)})`);
};
