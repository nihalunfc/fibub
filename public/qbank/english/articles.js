// English bank: articles (a, an, the, no article). Original items written for fibub; US spelling.
// mcq options are written correct-first and placed by ROT so the answer letters spread over A-D.
// Append new items at the end; ids are numbered in order (ga-001 ...), never reuse or reorder.
const EX = ['ielts', 'celpip', 'toefl'];
const F = { skill: 'grammar' };
const ROT = [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 2, 0];
let n = 0, c = 0;
const id = () => 'ga-' + String(++c).padStart(3, '0');
const m = (level, q, opts, sol, sub, trap) => { const k = ROT[n++ % ROT.length]; const o = opts.slice(1); o.splice(k, 0, opts[0]); const it = { id: id(), type: 'mcq', level, exams: EX, facets: F, sub, q, options: o, answer: k, sol }; if (trap) it.trap = trap; return it; };
const t = (level, q, answer, sol, sub, trap) => { const it = { id: id(), type: 'text', level, exams: EX, facets: F, sub, q, answer: [].concat(answer), maxWords: 1, sol }; if (trap) it.trap = trap; return it; };
const NO = 'no article';
const art = (level, q, ans, sol, sub, trap) => m(level, q, [ans, ...['a', 'an', 'the', NO].filter(x => x !== ans)], sol, sub, trap);

export default {
  topic: 'articles',
  items: [
    art(1, "She studies at ______ university in the city centre.", 'a', "<i>University</i> starts with the sound /j/, like <i>you</i>, so we use <b>a</b>.", 'a / an', "Learners look at the letter (u) and choose <i>an</i>. Listen to the first sound, not the letter."),
    art(1, "I waited for ______ hour outside the office.", 'an', "<i>Hour</i> starts with a vowel sound because the h is silent: <b>an hour</b>.", 'a / an', "The letter h is a consonant, but the sound here is a vowel."),
    art(1, "He is ______ honest man and everyone trusts him.", 'an', "The h in <i>honest</i> is silent, so the first sound is a vowel: <b>an honest</b>.", 'a / an'),
    art(1, "It was ______ unusual question for an interview.", 'an', "<i>Unusual</i> begins with the vowel sound /ʌ/: <b>an unusual</b>.", 'a / an'),
    art(1, "This is ______ one-way street, so you cannot turn left.", 'a', "<i>One</i> starts with the sound /w/, a consonant sound: <b>a one-way street</b>.", 'a / an', "<i>One</i> begins with the letter o, but sounds like <i>won</i>."),
    art(3, "My sister works as ______ MBA adviser at a business school.", 'an', "<i>MBA</i> is said \"em-bee-ay\", so it starts with a vowel sound: <b>an MBA</b>.", 'a / an', "With abbreviations, use the sound of the first letter name."),
    art(3, "She bought ______ European rail pass for the summer.", 'a', "<i>European</i> starts with /j/ (like <i>you</i>): <b>a European</b>.", 'a / an'),
    art(3, "The doctor ordered ______ X-ray of my left arm.", 'an', "<i>X</i> is said \"ex\", a vowel sound: <b>an X-ray</b>.", 'a / an'),
    art(1, "We rented a flat near the station. ______ flat has two bedrooms.", 'the', "The flat was mentioned already, so both of us know which one: <b>the</b>.", 'first and second mention'),
    art(1, "I saw a dog and a cat in the garden. ______ cat was asleep.", 'the', "A cat was introduced in the first sentence; the second time we say <b>the cat</b>.", 'first and second mention'),
    art(1, "I need ______ pen. Do you have one I can borrow?", 'a', "This is the first mention and it is not a particular pen: <b>a pen</b>.", 'first and second mention'),
    art(3, "There was an accident on the highway this morning. ______ accident closed two lanes.", 'the', "The accident is now known to both speakers, so we use <b>the</b>.", 'first and second mention'),
    art(2, "A man walked into the room carrying a box. ______ man put the box on the table.", 'the', "Second mention of a man we already described: <b>the man</b>.", 'first and second mention'),
    art(2, "She applied for a job at a bank. She did not get ______ job, but she found another.", 'the', "<i>The job</i> is the one already mentioned.", 'first and second mention'),
    art(1, "______ sun rises in the east.", 'the', "There is only one sun, so we use <b>the</b>.", 'the with unique things'),
    art(1, "The astronauts could see ______ Earth from the window.", 'the', "<i>The Earth</i>, <i>the moon</i>, <i>the sun</i>: unique things take <b>the</b>.", 'the with unique things'),
    art(3, "The prime minister will speak to ______ nation tonight.", 'the', "<i>The nation</i> and <i>the government</i> are treated as unique in context: <b>the</b>.", 'the with unique things'),
    art(1, "She is ______ tallest student in the class.", 'the', "Superlatives (tallest, best, most) normally take <b>the</b>.", 'superlatives and ordinals'),
    art(2, "This is ______ most important decision of my career.", 'the', "<i>Most important</i> is a superlative, so use <b>the</b>.", 'superlatives and ordinals'),
    art(3, "He lives on ______ third floor of the building.", 'the', "Ordinal numbers (first, second, third) take <b>the</b> when they point to one particular item.", 'superlatives and ordinals'),
    art(2, "She was ______ first woman to lead the company.", 'the', "<i>First</i> points to one particular person: <b>the first</b>.", 'superlatives and ordinals', "<i>A first woman</i> sounds odd because a first is always one specific person."),
    art(4, "He is ______ only person who knows the password.", 'the', "<i>Only</i>, <i>same</i> and <i>next</i> normally take <b>the</b>.", 'superlatives and ordinals'),
    art(3, "They sailed down ______ Nile for three days.", 'the', "River names take <b>the</b>: the Nile, the Thames, the Ganges.", 'geographical names'),
    art(3, "______ Pacific is the largest ocean on Earth.", 'the', "Oceans and seas take <b>the</b>: the Pacific, the Arabian Sea.", 'geographical names'),
    art(3, "They spent a week visiting ______ Netherlands.", 'the', "Plural country names (the Netherlands, the Philippines) and names with <i>Republic, Kingdom, States, Emirates</i> take <b>the</b>.", 'geographical names'),
    art(3, "My cousin has lived in ______ United Arab Emirates for ten years.", 'the', "Names containing a union or a plural (United Arab Emirates, United Kingdom) take <b>the</b>.", 'geographical names'),
    art(1, "She grew up in ______ Canada and moved to India at 20.", NO, "Most single-country names take no article: Canada, India, Egypt.", 'geographical names'),
    art(3, "Climbers reached the top of ______ Mount Everest in May.", NO, "Single mountains take no article (Mount Everest, Kilimanjaro). Ranges take <i>the</i>: the Alps.", 'geographical names'),
    art(4, "We hiked in ______ Rockies and then flew to the coast.", 'the', "Mountain ranges are plural and take <b>the</b>: the Rockies, the Himalayas.", 'geographical names'),
    art(5, "They swam in ______ Lake Victoria, the largest lake in Africa.", NO, "Single lakes with <i>Lake</i> in front take no article: Lake Victoria.", 'geographical names', "Learners add <i>the</i> by analogy with oceans and rivers."),
    art(1, "______ children need love and a safe home.", NO, "Plural nouns used in a general sense take no article.", 'general statements'),
    art(2, "______ nature is full of surprises.", NO, "<i>Nature</i> in the general sense is uncountable and takes no article.", 'general statements', "Common essay error: <i>the nature is...</i>."),
    art(2, "______ honesty is the best policy in business.", NO, "Abstract uncountable nouns used generally take no article.", 'general statements'),
    art(1, "I like listening to ______ music while I study.", NO, "General music, not one particular piece: no article.", 'general statements'),
    art(2, "______ water boils at 100 degrees Celsius at sea level.", NO, "A general fact about a substance takes no article.", 'general statements'),
    art(2, "In many countries, ______ women live longer than men.", NO, "General plurals (women, men) take no article.", 'general statements'),
    art(5, "She plays ______ violin in the city orchestra.", 'the', "Musical instruments take <b>the</b> after <i>play</i>: the violin, the piano.", 'general statements'),
    art(2, "He plays ______ football on Saturdays with his friends.", NO, "Sports take no article: play football, play tennis.", 'general statements'),
    art(2, "The government should help ______ elderly who live alone.", 'the', "<b>The</b> + adjective names a whole group: the elderly, the poor, the unemployed.", 'the + adjective'),
    art(4, "______ rich are often asked to pay higher taxes.", 'the', "<b>The rich</b> means rich people as a group and takes a plural verb.", 'the + adjective'),
    art(4, "New schemes are needed to support ______ unemployed.", 'the', "<b>The unemployed</b> means all unemployed people.", 'the + adjective'),
    art(2, "In many countries, children start ______ school at the age of six.", NO, "<i>School</i> used for its purpose (learning) takes no article: go to school, start school.", 'institutions'),
    art(2, "I went to ______ school to talk to my son's teacher.", 'the', "Here the visitor goes to the building, not to study, so we use <b>the school</b>.", 'institutions', "Compare: <i>He goes to school</i> (as a student)."),
    art(2, "She wants to go to ______ university after her exams.", NO, "<i>Go to university</i> (as a student) takes no article.", 'institutions'),
    art(4, "He is in ______ prison for fraud.", NO, "A prisoner is <i>in prison</i>; a visitor goes to <i>the prison</i>.", 'institutions'),
    art(2, "After a long day, I usually go to ______ bed at eleven.", NO, "<i>Go to bed</i>, <i>go to work</i>, <i>at home</i>: fixed phrases with no article.", 'institutions'),
    m(2, "Which sentence is correct?", ["Society needs to protect nature.", "The society needs to protect the nature.", "The society needs to protect nature.", "Society needs to protect the nature."], "When we talk about society and nature in general, we use no article.", 'essay errors', "Overusing <i>the</i> is the most frequent article error in essays."),
    m(3, "Which sentence is correct?", ["Technology has changed how we communicate.", "The technology has changed how we communicate.", "A technology has changed how we communicate.", "The technology have changed how we communicate."], "<i>Technology</i> in general is uncountable: no article.", 'essay errors', "<i>The technology</i> is fine only for a specific one: the technology used in this phone."),
    m(3, "Which sentence is correct?", ["Many people prefer life in a big city.", "Many people prefer the life in big city.", "Many people prefer a life in the big city.", "Many people prefer the life in a big city."], "<i>Life</i> in the general sense takes no article, and <i>city</i> is singular countable so it needs <i>a</i>.", 'essay errors'),
    m(4, "Which sentence is correct?", ["Education is the key to a better future.", "The education is a key to better future.", "Education is key to the better future.", "An education is the key to better future."], "General <i>education</i> takes no article; <i>the key</i> and <i>a better future</i> both need their articles.", 'essay errors'),
    m(4, "Which sentence is correct?", ["The pollution caused by cars is a serious problem in cities.", "Pollution caused by cars is serious problem in cities.", "The pollution caused by cars is the serious problem in cities.", "A pollution caused by cars is a serious problem in cities."], "<i>The pollution caused by cars</i> is specific, because it is defined by the phrase after it. <i>A serious problem</i> needs <i>a</i>.", 'essay errors', "Specific nouns defined by <i>of</i> or a clause usually take <i>the</i>."),
    m(4, "Which sentence is correct?", ["The government should spend more on public transport.", "Government should spend more on the public transport.", "The government should spend more on the public transport.", "A government should spend more on public transport."], "<i>The government</i> of a country is treated as unique; <i>public transport</i> in general takes no article.", 'essay errors'),
    m(5, "Which sentence is correct?", ["The internet has made it easier to learn a language.", "An internet has made it easier to learn the language.", "Internet has made easier to learn a language.", "The internet has made it easier to learn language."], "<i>The internet</i> is unique and takes <i>the</i>; <i>a language</i> is any language, singular and countable.", 'essay errors'),
    m(5, "Which sentence is correct?", ["Pollution is a problem that affects the health of children.", "The pollution is problem that affects health of the children.", "Pollution is the problem that affects the health of the children.", "A pollution is a problem that affects health of children."], "<i>Pollution</i> (general) needs no article; <i>a problem</i> is new information; <i>the health of children</i> is defined by <i>of</i>.", 'essay errors'),
    t(1, "Type a, an or the. She works as ______ engineer in a large company.", 'an', "<i>Engineer</i> begins with a vowel sound: <b>an engineer</b>.", 'a / an'),
    t(1, "Type a, an or the. My brother is ______ architect.", 'an', "A job after <i>is</i> takes <i>a/an</i>; <i>architect</i> starts with a vowel sound.", 'a / an'),
    t(2, "Type a, an or the. We stayed in a hotel by the sea. ______ hotel was spotless.", ['the', 'The'], "Second mention of a known hotel: <b>the</b>.", 'first and second mention'),
    t(2, "Type the article, or write x if none is needed. She is ______ best player on our team. (type a, an, the or x)", 'the', "Superlative: <b>the best</b>.", 'superlatives and ordinals'),
    t(3, "Type the article, or write x if none is needed. ______ life has become more stressful in recent years. (type a, an, the or x)", ['x', 'X'], "Life in the general sense takes no article.", 'general statements'),
  ],
};
