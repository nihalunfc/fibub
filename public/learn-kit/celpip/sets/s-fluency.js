// Fluency and pronunciation (lesson 5.10). Original items by fibub.
const items = [];
const add = (it) => items.push({ id: `sfl-${String(items.length + 1).padStart(2, '0')}`, ...it });

// Word stress: [word, syllables, index of stressed syllable, note]
const words = [
  ['apartment', ['A', 'PART', 'MENT'], 1, 'a-<b>PART</b>-ment'],
  ['community', ['COM', 'MU', 'NI', 'TY'], 1, 'com-<b>MU</b>-ni-ty: words ending in <b>-ity</b> stress two syllables before the end'],
  ['develop', ['DE', 'VEL', 'OP'], 1, 'de-<b>VEL</b>-op'],
  ['recommend', ['REC', 'OM', 'MEND'], 2, 'rec-om-<b>MEND</b>'],
  ['neighbourhood', ['NEIGH', 'BOUR', 'HOOD'], 0, '<b>NEIGH</b>-bour-hood'],
  ['information', ['IN', 'FOR', 'MA', 'TION'], 2, 'in-for-<b>MA</b>-tion: <b>-tion</b> words stress the syllable just before it'],
  ['photography', ['PHO', 'TOG', 'RA', 'PHY'], 1, 'pho-<b>TOG</b>-ra-phy (but <b>PHO</b>-to-graph)'],
  ['hotel', ['HO', 'TEL'], 1, 'ho-<b>TEL</b>: an exception to the two-syllable noun pattern'],
  ['decision', ['DE', 'CI', 'SION'], 1, 'de-<b>CI</b>-sion: <b>-sion</b> words stress the syllable just before it'],
  ['important', ['IM', 'POR', 'TANT'], 1, 'im-<b>POR</b>-tant'],
  ['vegetable', ['VEG', 'E', 'TA', 'BLE'], 0, '<b>VEG</b>-e-ta-ble (often said in three syllables: VEJ-ta-ble)'],
  ['economic', ['EC', 'O', 'NOM', 'IC'], 2, 'ec-o-<b>NOM</b>-ic: <b>-ic</b> words stress the syllable just before it'],
];
const ord = ['1st', '2nd', '3rd', '4th'];
words.forEach(([w, syl, k, note]) => {
  const opts = syl.map((s, i) => `${ord[i]}: ${s}`);
  const options = [opts[k], ...opts.filter((_, i) => i !== k)];
  add({ type: 'mcq', q: `Which syllable is stressed in <b>${w}</b>?`, options, answer: 0, sol: `${note}.` });
});

// Noun / verb pairs
const pairs = [
  ['I want to <b>record</b> my answer and listen to it.', 'Verb, so stress the 2nd syllable: re-CORD', ['Noun, so stress the 1st syllable: RE-cord', 'Both syllables are stressed equally', 'There is no stress in this word'], 'As a verb, <b>re-CORD</b>. As a noun (a record), <b>RE-cord</b>.'],
  ['She gave me a <b>present</b> for my birthday.', 'Noun, so stress the 1st syllable: PRE-sent', ['Verb, so stress the 2nd syllable: pre-SENT', 'Both syllables are stressed equally', 'There is no stress in this word'], 'A noun: <b>PRE-sent</b>. The verb (to present) is <b>pre-SENT</b>.'],
  ['Prices will <b>increase</b> next year.', 'Verb, so stress the 2nd syllable: in-CREASE', ['Noun, so stress the 1st syllable: IN-crease', 'Both syllables are stressed equally', 'There is no stress in this word'], 'A verb: <b>in-CREASE</b>. The noun (an increase) is <b>IN-crease</b>.'],
];
pairs.forEach(([q, a, wrong, sol]) => add({ type: 'mcq', q: `How should you say the word in bold? ${q}`, options: [a, ...wrong], answer: 0, sol }));

// Sentence stress
const sent = [
  ['I think we should take the bus to the game.', 'think, take, bus, game', ['I, we, the, to', 'should, the, to, the', 'every word equally'], 'Stress <b>content words</b> (main verbs and nouns); <b>to</b> and <b>the</b> stay weak.'],
  ['My sister bought a new car last week.', 'sister, bought, new, car, week', ['my, a, last', 'a, last', 'every word equally'], 'Nouns, the main verb and the adjective carry the meaning, so they are stressed.'],
  ['It’s not the red one, it’s the blue one. (Which word gets the strongest stress?)', 'red and blue', ['it’s and the', 'one and one', 'not and it’s'], 'This is <b>contrastive stress</b>: the two words being compared, <b>red</b> and <b>blue</b>, are strongest.'],
  ['I can’t come on Saturday. (Which word must be clearly stressed?)', 'can’t', ['I', 'on', 'come'], 'Negatives like <b>can’t</b> are stressed, so the listener does not hear "can".'],
];
sent.forEach(([s, a, wrong, sol]) => add({ type: 'mcq', q: `Which words are stressed? "${s}"`, options: [a, ...wrong], answer: 0, sol }));

// Linking
const link = [
  ['turn off', 'tur-noff: the n moves to the next vowel', ['turn / off with a full stop between', 'tur-off, dropping the n', 'turnoff with stress on off only']],
  ['bus stop', 'bu-stop: say the s once, a little longer', ['bus-uh-stop, adding a vowel', 'buh-stop, dropping the s completely', 'bus / stop with a long pause']],
  ['go out', 'go-wout: a small w sound joins the vowels', ['go-yout with a y sound', 'go / out with a stop', 'gout, dropping the o']],
];
link.forEach(([p, a, wrong]) => add({ type: 'mcq', q: `How do fluent speakers usually link <b>${p}</b>?`, options: [a, ...wrong], answer: 0, sol: `<b>${a}</b>.` }));

// Thought groups
const groups = [
  ['When I moved to Halifax ... I didn’t know anyone ... so I joined a soccer team.', ['When I moved ... to Halifax I didn’t ... know anyone so I ... joined a soccer team.', 'When ... I moved to ... Halifax I ... didn’t know anyone.', 'When I moved to Halifax I didn’t know anyone so ... I ... joined ... a ... soccer ... team.']],
  ['Last summer ... my family and I ... drove to the Rockies ... for a week.', ['Last ... summer my family ... and I drove to ... the Rockies for a week.', 'Last summer my ... family and I drove ... to the ... Rockies for a week.', 'Last summer my family and I drove to the Rockies for a ... week.']],
  ['The house I saw ... has a roof ... shaped like a boat.', ['The house ... I saw has a ... roof shaped like ... a boat.', 'The ... house I saw has a roof shaped ... like a boat.', 'The house I saw has ... a roof shaped like a ... boat.']],
];
groups.forEach(([a, wrong]) => add({ type: 'mcq', q: 'Which version pauses (shown as ...) in the most natural places?', options: [a, ...wrong], answer: 0, sol: `Pauses fall <b>between thought groups</b>: after time phrases, before <b>so</b>, and around complete chunks. <b>${a}</b>`, trap: 'Pausing inside a chunk such as "to the ... Rockies" breaks up the meaning.' }));

// Intonation
add({ type: 'mcq', q: 'Your voice usually ___ at the end of a yes/no question, such as "Do you want me to book it?"', options: ['rises', 'falls', 'stays flat', 'stops suddenly'], answer: 0, sol: 'Yes/no questions usually <b>rise</b> at the end.' });
add({ type: 'mcq', q: 'Your voice usually ___ at the end of a statement, such as "I think the cabin is better."', options: ['falls', 'rises', 'stays flat', 'gets louder'], answer: 0, sol: 'Statements usually <b>fall</b> at the end, which sounds confident and finished.' });
add({ type: 'mcq', q: 'In the list "bikes, canoes and a dock", where does the voice usually fall?', options: ['On the last item, dock', 'On every item', 'On the first item, bikes', 'Nowhere'], answer: 0, sol: 'Items before the last one usually <b>rise</b>; the last one <b>falls</b> to show the list is finished.' });

// Fillers and self-correction
add({ type: 'mcq', q: 'You need two seconds to think in the middle of Task 7. What is best?', options: ['Say "The way I see it..." and continue', 'Stay silent for five seconds', 'Say "um, uh, um, uh..."', 'Say "Sorry, I forgot."'], answer: 0, sol: 'A short <b>thinking phrase</b> fills the pause naturally and keeps your rhythm.' });
add({ type: 'mcq', q: 'You say "Yesterday she go to the clinic." What is the best repair?', options: ['"...she go... she went to the clinic."', 'Stop and say "Sorry, my grammar is bad."', 'Start your whole answer again', 'Ignore it and repeat the mistake'], answer: 0, sol: 'A <b>quick self-correction</b> shows control. Apologising or restarting breaks rhythm and wastes time.' });
add({ type: 'mcq', q: 'Which is the best amount of thinking phrases in a 60-second answer?', options: ['Two or three, when needed', 'One in every sentence', 'Never any; pause silently instead', 'As many as possible to sound fluent'], answer: 0, sol: 'Use them <b>occasionally</b>. Too many sound like empty words; none means silent gaps.' });
add({ type: 'mcq', q: 'Which sounds most fluent?', options: ['A steady pace with clear stress and pauses between thought groups', 'Speaking as fast as possible', 'Speaking very slowly, one word at a time', 'A flat voice with no pauses'], answer: 0, sol: 'Fluency is <b>smooth and easy to follow</b>, not fast.', trap: 'Speed squeezes out the stress and pauses that help the listener.' });

// Order (fillers and repairs as chips)
const order = [
  ['the way I see it it is a good idea'],
  ['let me give you an example'],
  ['what I mean is that it saves time'],
];
order.forEach(([s]) => add({ type: 'order', q: 'Put the words in order to make a natural phrase.', options: s.split(' ').sort(), answer: [s], sol: `<b>${s.charAt(0).toUpperCase() + s.slice(1)}.</b>` }));

// Text
add({ type: 'text', q: 'The noun is a <b>RE</b>-cord. Which syllable is stressed in the verb "to record"? Type 1st or 2nd.', answer: ['2nd', 'second', '2'], maxWords: 1, sol: 'The verb is re-<b>CORD</b>: <b>2nd</b> syllable.' });
add({ type: 'text', q: 'Complete the self-correction phrase with one word: "We left on Tuesday, or ___, Wednesday morning."', answer: ['rather'], maxWords: 1, sol: '<b>Or rather</b> corrects what you just said smoothly.' });
add({ type: 'text', q: 'Words like a, the, to and of are usually weak in a sentence. What do we call them? (two words: ___ words)', answer: ['function words', 'function', 'grammar words'], maxWords: 2, sol: '<b>Function words</b> are short and unstressed; <b>content words</b> carry the stress.' });

export default { title: 'Fluency and pronunciation', items };
