// 8.6 Word stress: tap a word to see its stressed syllable in capitals and hear it read by your device's own
// voice (speechSynthesis; nothing is sent anywhere). Families show how stress moves: PHOtograph, phoTOgrapher.
import { row, choice, button, readout, put } from '../../kit.js';

const SETS = {
  families: [['PHO·to·graph', 'photograph'], ['pho·TO·gra·pher', 'photographer'], ['pho·to·GRA·phic', 'photographic'], ['e·CON·o·my', 'economy'], ['e·co·NO·mic', 'economic'], ['e·CON·o·mist', 'economist'], ['POL·i·tics', 'politics'], ['po·LI·ti·cal', 'political'], ['po·li·TI·cian', 'politician']],
  nounverb: [['a RE·cord', 'a record'], ['to re·CORD', 'to record'], ['a PRE·sent', 'a present'], ['to pre·SENT', 'to present'], ['an IN·crease', 'an increase'], ['to in·CREASE', 'to increase'], ['an OB·ject', 'an object'], ['to ob·JECT', 'to object']],
  tricky: [['com·FOR·ta·ble → COMF·ta·ble', 'comfortable'], ['VE·ge·ta·ble → VEJ·ta·ble', 'vegetable'], ['in·TE·rest·ing → IN·tres·ting', 'interesting'], ['de·VE·lop', 'develop'], ['ho·TEL', 'hotel'], ['ca·NAL', 'canal'], ['de·TER·mine', 'determine'], ['AD·ver·tise·ment / ad·VER·tise·ment', 'advertisement']],
};
export default function (host) {
  let k = 'families';
  const ctl = row(host);
  choice(ctl, 'Words', [['families', 'Word families'], ['nounverb', 'Noun or verb'], ['tricky', 'Often wrong']], k, (v) => { k = v; draw(); });
  const wrap = document.createElement('div'); wrap.className = 'lk-controls'; put(host, wrap);
  const out = readout(host);
  const say = (w) => {
    if (!('speechSynthesis' in window)) { out.textContent = 'This browser cannot read aloud. Say the CAPITAL syllable louder and longer.'; return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(w); u.lang = 'en-GB'; u.rate = 0.8;
    const v = speechSynthesis.getVoices().find((x) => /^en[-_]/i.test(x.lang)); if (v) u.voice = v;
    speechSynthesis.speak(u);
  };
  const draw = () => {
    wrap.innerHTML = '';
    for (const [shown, spoken] of SETS[k]) button(wrap, shown, () => { say(spoken); out.textContent = `${shown}: the CAPITAL syllable is louder, longer and higher. Other vowels often reduce to a short "uh" (schwa).`; });
    out.textContent = 'Tap a word to hear it. Capitals show the stressed syllable.';
  };
  draw();
}
