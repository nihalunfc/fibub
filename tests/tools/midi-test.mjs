// #T1062 MIDI Test. Headless Chromium has no MIDI devices: requestMIDIAccess is removed, then replaced by one fake keyboard and one fake synth.
export const path = '/everyday/midi-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/midi-test/`); await page.waitForTimeout(300);
  const R = '.mi ', t = (s) => page.textContent(R + s);
  await page.evaluate(() => { Object.defineProperty(navigator, 'requestMIDIAccess', { value: undefined, configurable: true }); });
  await page.click(R + '.mi-start');
  check((await t('.mi-status')).includes('does not support Web MIDI') && (await t('.mi-status')).includes('Safari'), 'midi-test: a missing API is explained');
  await page.evaluate(() => {
    window.__sent = [];
    const inp = { id: 'i1', name: 'Test Keys', manufacturer: 'Acme', state: 'connected', connection: 'open', type: 'input', onmidimessage: null };
    const out = { id: 'o1', name: 'Test Synth', manufacturer: 'Acme', state: 'connected', connection: 'closed', type: 'output', send: (d) => window.__sent.push(Array.from(d)) };
    const acc = { inputs: new Map([['i1', inp]]), outputs: new Map([['o1', out]]), onstatechange: null }; window.__acc = acc; window.__inp = inp;
    Object.defineProperty(navigator, 'requestMIDIAccess', { value: async () => acc, configurable: true });
  });
  await page.click(R + '.mi-start'); await page.waitForTimeout(200);
  check((await t('.mi-devs')).includes('Test Keys') && (await t('.mi-devs')).includes('Test Synth'), 'midi-test: lists the input and output');
  await page.evaluate(() => {
    const f = (a) => window.__inp.onmidimessage({ data: new Uint8Array(a) });
    f([0xf8]); f([0x90, 60, 100]); f([0xb0, 1, 64]);
  });
  const log = await t('.mi-log');
  check(log.includes('Note on C4 (60), velocity 100') && !log.includes('Clock'), 'midi-test: note-on is logged and clock is hidden by default');
  check(await page.evaluate(() => document.querySelector('.mi [data-n="60"]').classList.contains('on')) && (await t('.mi-last')).includes('velocity 100'), 'midi-test: middle C lights on the piano with its velocity');
  check((await t('.mi-cc')).includes('CC 1') && (await t('.mi-cc')).includes('64'), 'midi-test: the controller monitor shows CC 1 = 64');
  await page.uncheck(R + '.mi-hide');
  await page.evaluate(() => window.__inp.onmidimessage({ data: new Uint8Array([0xf8]) }));
  check((await t('.mi-log')).includes('Clock'), 'midi-test: the clock toggle shows clock messages');
  await page.click(R + '.mi-note'); await page.click(R + '.mi-off');
  const sent = await page.evaluate(() => window.__sent);
  check(JSON.stringify(sent[0]) === '[144,60,100]' && JSON.stringify(sent[1]) === '[176,123,0]', `midi-test: sends note-on middle C and All notes off (${JSON.stringify(sent)})`);
  await page.evaluate(() => { window.__acc.outputs.set('o2', { id: 'o2', name: 'Second Synth', state: 'connected', type: 'output', send() {} }); window.__acc.onstatechange({}); });
  check((await t('.mi-devs')).includes('Second Synth'), 'midi-test: plugging in a device updates the list');
};
