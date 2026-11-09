// #879 seismogram viewer
import { writeSac } from '../../src/lib/sci/seisio.ts';
export const path = '/science/seismogram-viewer/';
// A Steim-2 miniSEED file written by ObsPy (made-up counts, XX.FIB.00.HHZ, 700 samples at 50 Hz, two records).
const MSEED = 'MDAwMDAxRCBGSUIgIDAwSEhaWFgH6gBJATsaABTuAXMAMgABAAAAAQAAAAAAQAAwA+gAAAsBCQAAAAAAAAAAAAP//98AAAAo///+FUA+4tc7CJPVFlUSgjrK+25nkBEHBPt76COKOjBv8yVIR+zWtzwQ5d8lJyUiHFDyiQk5Jl011dVVH32kyf7z6uPf3+HkKa66pN7WzcjExMjQ2uXw+oBWZlYLEhwpNUJMU1dVUktDPDYyMDExMjAtJRoL+ujWFVVqlce7sq2rqqqqp6Sfl5GMiYuQnKq7zuLzAg8aIioyPUhYxoHoi8mimK7LArSmycI8gnZqYFhORDcoFPzjxyqqWqr6rkN59l1fTPRdD0Hz/Ps986zjOPO9C071/duRr8/uDCg/VWjHoiyeywMU2s7j/Q3RdGUV0LPs580S5KEmqqmqyKHQXUgvF/n9rt+S9u0vKvDr5ujt+2ba7buC5e67xvnwTEsm8/17gajT/SbE0cCOyqME1s6j8RDSJNFCKpqqptTlVVTU5P0r0QPE0MriNGxNLxHz/U7Lj/adFyDv+4rL68rOsOtK7sftS4bw7/xDI/OdU3OYwOoWxBGkjSqqpqrK0xjcztPtB9E0dSjTBNk502S1HtCTtM6AVYCHQAMNpX/88wMkCO3V+76PiPbdQzTxrBLx7muG4e6b1wUwMDAwMDJEIEZJQiAgMDBISFpYWAfqAEkBOyEAJVYBSQAyAAEAAAABAAAAAABAADAD6AAACwEJAAAAAAAAAAAAAqaqpf///SoAAAFE8VyfOPSda2r3vkOnwuABI8RRlIHJkrC6zCMcy8zDONDNM1DVzSMwwssidIRpTDAW/+vazRqlVVXAtKia+L3ravW9P0j0TRtO9Z2neImYpbG6w8vX4/MGGjBFV2dyeHp4dHBraWdnaGloZF5TRTMhDf3u49sVX1V/2NXU09DMxb20qqWgoaWtucXR3uYswxyxM9/iEx8sNT1APzw1LiYiHh0gIycpKygiGjw97ieSWesx022xF/f//+zl3tjV1trgKc/Qx1Jh+zY24+GOFh0hIR5hEkN73okNE1lkzAXzS+srv07CTpUUGTK2mqwz7DKOEDyxPj////9vOU8fBjk1VREoTvZnKugoDkkjygPvTC5hTQkuEDyxfjbK6/I5/HOQEjygvGsYRv4FLRSRWn9icGFNBQ48AAAAEUjiQjrTC/EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/seismogram-viewer/`); await page.waitForTimeout(900);
  const R = '.sgv ', wait = (ms = 450) => page.waitForTimeout(ms);
  const setWin = async (a, b) => { await page.fill(R + '.sv-t0', String(a)); await page.press(R + '.sv-t0', 'Tab'); await page.fill(R + '.sv-t1', String(b)); await page.press(R + '.sv-t1', 'Tab'); await wait(); };
  check((await page.textContent(R + '.sv-status')).includes('made-up example') && (await page.$$(R + '.sv-list tr')).length === 4, 'seis-view: example loads three traces');
  check((await page.textContent(R + '.sv-list')).includes('XX.DEMO..HHZ') && (await page.textContent(R + '.sv-list')).includes('6,000'), 'seis-view: trace table');
  check((await page.textContent(R + '.sv-axis')).includes('2026-11-09 03:14:07.2500Z') && (await page.textContent(R + '.sv-sfacts')).includes('2.50 Hz'), 'seis-view: time axis and dominant frequency of the whole record');
  await setWin(19.5, 24); await page.selectOption(R + '.sv-str', '1'); await wait();
  { const f = await page.textContent(R + '.sv-sfacts'); check(f.includes('2.52 Hz') && f.includes('451'), `seis-view: spectrum of the S wave on HHN (${f.slice(0, 40)})`); }
  // Picks by tapping.
  await setWin(10, 25);
  const tap = async (row, t) => { const c = await page.$(R + '.sv-fig'); await c.scrollIntoViewIfNeeded(); const b = await c.boundingBox(); const W = b.width; await page.mouse.click(b.x + 8 + ((t - 10) / 15) * (W - 18), b.y + 104 * row + 52); await wait(300); };
  await tap(0, 12.4); await tap(1, 19.6);
  { const f = await page.textContent(R + '.sv-pfacts'); const sp = parseFloat(f.match(/S − P time([\d.]+)/)[1]), d = parseFloat(f.match(/S − P([\d.]+) km/)[1]);
    check(Math.abs(sp - 7.2) < 0.06 && Math.abs(d - 60.5) < 0.6 && (await page.$$(R + '.sv-picks tr')).length === 3, `seis-view: P and S picks give S − P ${sp} s, ${d} km`); }
  await page.fill(R + '.sv-vs', '7'); await wait(200);
  check((await page.textContent(R + '.sv-pfacts')).includes('Vp must be larger than Vs'), 'seis-view: bad speeds explained');
  await page.fill(R + '.sv-vs', '3.5');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sv-pcsv')]); const f = OUT + 'sv-picks.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 3 && rows[0] === 'trace,phase,time_s,time_utc' && rows[1].startsWith('XX.DEMO..HHZ,P,12.') && rows[2].startsWith('XX.DEMO..HHN,S,19.'), 'seis-view: picks CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sv-csv')]); const f = OUT + 'sv-win.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'time_s,time_utc,XX.DEMO..HHZ,XX.DEMO..HHN,XX.DEMO..HHE' && rows.length === 1502 && rows[1].startsWith('10,2026-11-09T03:14:17.2500Z,'), `seis-view: traces-in-view CSV (${rows.length} rows)`); }
  // Remove a pick, then clear.
  await page.click(R + '.sv-picks button'); await wait(200);
  check((await page.$$(R + '.sv-picks tr')).length === 2, 'seis-view: remove one pick');
  await page.click(R + '.sv-clear'); await wait(200);
  check((await page.textContent(R + '.sv-pfacts')).includes('none yet') && (await page.inputValue(R + '.sv-tap')) === 'P', 'seis-view: clear picks');
  // Zoom and pan buttons.
  await page.click(R + '.sv-zin'); await wait(200);
  check(parseFloat(await page.inputValue(R + '.sv-t0')) === 13.75 && parseFloat(await page.inputValue(R + '.sv-t1')) === 21.25, 'seis-view: zoom in halves the window');
  await page.click(R + '.sv-right'); await wait(200);
  check(parseFloat(await page.inputValue(R + '.sv-t0')) === 17.5, 'seis-view: move later');
  await page.click(R + '.sv-full'); await wait(200);
  check((await page.inputValue(R + '.sv-t0')) === '0.00' && (await page.inputValue(R + '.sv-t1')) === '59.99', 'seis-view: whole record');
  // Processing options.
  const label = () => page.evaluate(() => document.querySelector('.sgv .sv-fig').getAttribute('aria-label'));
  await page.selectOption(R + '.sv-ft', 'lowpass'); await wait();
  check(await page.isHidden(R + '.sv-flw') && await page.isVisible(R + '.sv-fhw'), 'seis-view: lowpass shows only the high corner');
  await page.selectOption(R + '.sv-ft', 'highpass'); await wait();
  check(await page.isVisible(R + '.sv-flw') && await page.isHidden(R + '.sv-fhw'), 'seis-view: highpass shows only the low corner');
  await page.selectOption(R + '.sv-ft', 'bandpass'); await page.fill(R + '.sv-fh', '80'); await wait(700);
  check((await page.textContent(R + '.sv-perr')).includes('Nyquist frequency (50 Hz)'), 'seis-view: corner above Nyquist refused');
  await page.fill(R + '.sv-fh', '15'); await page.selectOption(R + '.sv-ft', 'none'); await page.selectOption(R + '.sv-trend', 'none'); await page.selectOption(R + '.sv-taper', '0'); await wait();
  check(await page.isHidden(R + '.sv-perr') && await page.isHidden(R + '.sv-ordw'), 'seis-view: no filter hides the filter settings');
  await page.selectOption(R + '.sv-ft', 'bandpass'); await page.selectOption(R + '.sv-trend', 'linear'); await page.selectOption(R + '.sv-taper', '0.05'); await page.uncheck(R + '.sv-zp'); await page.selectOption(R + '.sv-ord', '4'); await page.selectOption(R + '.sv-scale', 'common'); await wait();
  check(await page.isVisible(R + '.sv-fig') && await page.isVisible(R + '.sv-sgram'), 'seis-view: one-pass order-4 filter and common scale draw');
  await page.check(R + '.sv-zp'); await page.selectOption(R + '.sv-ord', '2'); await page.selectOption(R + '.sv-scale', 'each');
  // Open a SAC file (written with the page's own writer) and a miniSEED file written by ObsPy.
  const sac = writeSac({ net: 'XX', sta: 'TOY', loc: '', cha: 'HNE', start: Date.UTC(2026, 0, 2, 3, 4, 5, 600), fs: 20, data: Float64Array.from({ length: 400 }, (_, i) => Math.sin(i / 3) * 50) }, [{ name: 'P', t: 2 }]);
  const fs = OUT + 'toy.sac', fm = OUT + 'fib.mseed'; writeFileSync(fs, sac); writeFileSync(fm, Buffer.from(MSEED, 'base64'));
  await page.setInputFiles(R + '.sv-file', [fs, fm]); await wait(900);
  { const s = await page.textContent(R + '.sv-status'), l = await page.textContent(R + '.sv-list'); check(s.includes('Opened 2 traces') && s.includes('SAC binary, little-endian') && s.includes('miniSEED, Steim-2') && l.includes('XX.TOY..HNE') && l.includes('XX.FIB.00.HHZ') && l.includes('700'), 'seis-view: opens SAC and Steim-2 miniSEED together'); }
  check((await page.textContent(R + '.sv-axis')).startsWith('0 s = 2026-01-02 03:04:05.6000Z'), 'seis-view: earliest start sets 0 s');
  await page.uncheck(R + '.sv-list input >> nth=0'); await wait();
  check(!(await label()).includes('TOY') && (await label()).includes('FIB'), 'seis-view: untick hides a trace');
  writeFileSync(OUT + 'bad.txt', 'not a seismogram');
  await page.setInputFiles(R + '.sv-file', OUT + 'bad.txt'); await wait(500);
  check((await page.textContent(R + '.sv-err')).includes('neither SAC binary nor miniSEED'), 'seis-view: other files refused');
  await page.click(R + '.sv-ex'); await wait();
  check((await page.$$(R + '.sv-list tr')).length === 4 && await page.isHidden(R + '.sv-err'), 'seis-view: back to the example');
};
