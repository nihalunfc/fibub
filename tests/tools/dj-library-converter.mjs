// #T1015 Library converter
export const path = '/everyday/dj-library-converter/';
const RB = `<?xml version="1.0" encoding="UTF-8"?>
<DJ_PLAYLISTS Version="1.0.0"><COLLECTION Entries="2">
<TRACK TrackID="1" Name="Night Drive" Artist="Kai" AverageBpm="124.00" TotalTime="372" Tonality="Am" Location="file://localhost/C:/Music/Deep%20House/Night%20Drive.mp3">
<TEMPO Inizio="0.112" Bpm="124.00" Metro="4/4" Battito="1"/>
<POSITION_MARK Name="Drop" Type="0" Start="61.937" Num="0"/>
<POSITION_MARK Name="" Type="4" Start="92.871" End="100.613" Num="-1"/>
</TRACK>
<TRACK TrackID="2" Name="Static" Artist="Ona" AverageBpm="128.00" Location="file://localhost/C:/Music/Static.mp3"/>
</COLLECTION><PLAYLISTS><NODE Type="0" Name="ROOT" Count="2">
<NODE Name="Warm up" Type="1" KeyType="0" Entries="1"><TRACK Key="2"/></NODE>
<NODE Name="Peak" Type="1" KeyType="0" Entries="2"><TRACK Key="1"/><TRACK Key="2"/></NODE>
</NODE></PLAYLISTS></DJ_PLAYLISTS>`;
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/dj-library-converter/`); await page.waitForTimeout(300);
  const R = '.dl ';
  await page.setInputFiles(R + '.dl-file', { name: 'rekordbox.xml', mimeType: 'text/xml', buffer: Buffer.from(RB) });
  await page.waitForSelector(R + '.dl-res:not([hidden])', { timeout: 10000 });
  const cnt = await page.evaluate(() => ['.dl-ct', '.dl-cp', '.dl-cc', '.dl-cl'].map((s) => document.querySelector(s).textContent).join(','));
  check(cnt === '2,2,1,1', `dj-library-converter: counts tracks, playlists, cues, loops (${cnt})`);
  check((await page.inputValue(R + '.dl-pfrom')) === 'C:\\Music\\' && (await page.inputValue(R + '.dl-to')) === 'traktor', 'dj-library-converter: suggests the common path and a different format');
  await page.fill(R + '.dl-pto', '/Volumes/USB/Music/');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl-save')]);
  const f = OUT + 'dlc.nml'; await d.saveAs(f); const nml = readFileSync(f, 'utf8');
  check(d.suggestedFilename() === 'collection.nml' && nml.includes('START="61937.000000"') && nml.includes('TYPE="5" START="92871.000000" LEN="7742.000000"') && nml.includes('<MUSICAL_KEY VALUE="21">'), 'dj-library-converter: Traktor NML has cues in ms and key 21');
  check(nml.includes('VOLUME="USB"') && nml.includes('KEY="USB/:Music/:Deep House/:Night Drive.mp3"'), 'dj-library-converter: path prefix swapped to a Mac volume');
  // Serato crates: one per playlist, so two files in a ZIP; untick one and it is a single crate.
  await page.selectOption(R + '.dl-to', 'serato');
  const plan = await page.textContent(R + '.dl-plan'), lostTxt = await page.textContent(R + '.dl-lost');
  check(plan.includes('2 files in a ZIP') && lostTxt.includes('inside the music files'), `dj-library-converter: crates plan and the Serato cue note (${plan})`);
  await page.uncheck(R + '.dl-list input[value="1"]');
  check((await page.textContent(R + '.dl-plan')).includes('Warm up.crate'), `dj-library-converter: one playlist gives one crate (${await page.textContent(R + '.dl-plan')})`);
};
