// English bank: subject-verb agreement, uncountable nouns, quantity words and plural forms.
// Original items written for fibub; US spelling. mcq options are written correct-first and placed by ROT.
// Append new items at the end; ids are numbered in order (gs-001 ...), never reuse or reorder.
const EX = ['ielts', 'celpip', 'toefl'];
const F = { skill: 'grammar' };
const ROT = [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 2, 0];
let n = 0, c = 0;
const id = () => 'gs-' + String(++c).padStart(3, '0');
const m = (level, q, opts, sol, sub, trap) => { const k = ROT[n++ % ROT.length]; const o = opts.slice(1); o.splice(k, 0, opts[0]); const it = { id: id(), type: 'mcq', level, exams: EX, facets: F, sub, q, options: o, answer: k, sol }; if (trap) it.trap = trap; return it; };
const t = (level, q, answer, sol, sub, trap) => { const it = { id: id(), type: 'text', level, exams: EX, facets: F, sub, q, answer: [].concat(answer), maxWords: 2, sol }; if (trap) it.trap = trap; return it; };
const V = 'Choose the correct verb: ';
const S = 'Which sentence is correct?';

export default {
  topic: 'agreement',
  items: [
    m(1, V + "The cost of new medical treatments ______ rising every year.", ['is', 'are', 'were', 'have'], "The subject is <i>cost</i> (singular), not <i>treatments</i>: <b>is</b>.", 'long subjects', "The noun right before the verb (treatments) is not the subject."),
    m(2, V + "A group of researchers from three universities ______ studying the effect of sleep on memory.", ['is', 'are', 'were', 'have been'], "The head noun is <i>group</i> (singular): <b>is</b>.", 'long subjects'),
    m(2, V + "The results of the survey, which was carried out in 12 countries, ______ surprising.", ['were', 'was', 'is', 'has been'], "The subject is <i>results</i> (plural); the clause with <i>was</i> describes the survey.", 'long subjects'),
    m(3, V + "The man who lives next door and his two dogs ______ in the park every morning.", ['walk', 'walks', 'is walking', 'has walked'], "Two subjects joined by <i>and</i> take a plural verb: <b>walk</b>.", 'long subjects'),
    m(3, V + "The importance of regular exercise and a balanced diet ______ often underestimated.", ['is', 'are', 'were', 'have been'], "Here the single idea is <i>importance</i>; the phrase after <i>of</i> only describes it.", 'long subjects', "The nearest noun (diet) is singular too, but the logic is the head noun."),
    m(4, V + "Neither the manager nor the employees ______ aware of the problem.", ['were', 'was', 'is', 'has been'], "With <i>neither... nor</i>, the verb agrees with the nearest subject: <i>employees</i> (plural).", 'either and neither'),
    m(4, V + "Neither the employees nor the manager ______ aware of the problem.", ['was', 'were', 'are', 'have been'], "The nearest subject now is <i>manager</i> (singular).", 'either and neither'),
    m(2, V + "The number of cars in the city ______ increasing.", ['is', 'are', 'were', 'have been'], "<i>The number of</i> is singular: <b>is</b>.", 'the number of / a number of', "Confused with <i>a number of</i>, which is plural."),
    m(2, V + "A number of cars ______ parked illegally outside the station.", ['were', 'was', 'is', 'has been'], "<i>A number of</i> means <i>several</i> and takes a plural verb.", 'the number of / a number of'),
    m(3, V + "The number of students who study abroad ______ grown steadily over the past decade.", ['has', 'have', 'are', 'were'], "<i>The number of</i> + plural noun still has a singular verb: <b>has grown</b>.", 'the number of / a number of'),
    m(3, V + "A large number of applicants ______ rejected because of missing documents.", ['were', 'was', 'is', 'has been'], "<i>A large number of</i> + plural noun takes a plural verb.", 'the number of / a number of'),
    m(1, V + "One of the students ______ absent today.", ['is', 'are', 'were', 'be'], "<i>One of</i> + plural noun: the subject is <i>one</i>, so <b>is</b>.", 'each, every, everyone'),
    m(1, V + "Each of the rooms ______ a view of the sea.", ['has', 'have', 'having', 'are'], "<i>Each (of)</i> takes a singular verb: <b>has</b>.", 'each, every, everyone', "The plural <i>rooms</i> after <i>of</i> misleads."),
    m(1, V + "Every student ______ a library card.", ['has', 'have', 'having', 'are having'], "<i>Every</i> + singular noun takes a singular verb.", 'each, every, everyone'),
    m(2, V + "Everyone in the building ______ safe after the fire.", ['was', 'were', 'are', 'have been'], "<i>Everyone</i> is singular: <b>was</b>.", 'each, every, everyone', "Everyone feels plural, but the grammar is singular."),
    m(3, S, ["Everybody has finished their task.", "Everybody have finished their task.", "Everybody are finished their task.", "Everybody finish their tasks."], "<i>Everybody</i> takes a singular verb (<i>has</i>); <i>their</i> is accepted as a singular pronoun in modern usage.", 'each, every, everyone'),
    m(3, V + "Neither of the answers ______ correct.", ['is', 'are', 'were', 'have been'], "In formal English <i>neither of</i> takes a singular verb.", 'either and neither'),
    m(3, V + "Either the teacher or the students ______ responsible for tidying the room.", ['are', 'is', 'was', 'has been'], "With <i>either... or</i>, the verb agrees with the nearest subject: <i>students</i>.", 'either and neither'),
    m(3, V + "Neither Sara nor her brothers ______ at home when the package arrived.", ['were', 'was', 'is', 'has been'], "The nearest subject is <i>brothers</i> (plural).", 'either and neither'),
    m(1, V + "There ______ several reasons for the delay.", ['are', 'is', 'was', 'has'], "The real subject follows the verb: <i>several reasons</i> (plural), so <b>are</b>.", 'there is / there are'),
    m(1, V + "There ______ no evidence that the method works.", ['is', 'are', 'were', 'have'], "<i>Evidence</i> is uncountable and singular.", 'there is / there are'),
    m(2, V + "There ______ many people waiting outside the hall.", ['were', 'was', 'is', 'has been'], "The real subject is <i>many people</i> (plural).", 'there is / there are'),
    m(3, V + "There ______ a book and two pens on the desk.", ['is', 'are', 'were', 'have'], "In formal English the verb agrees with the first item after <i>there</i>: <i>a book</i>.", 'there is / there are'),
    m(2, V + "The committee ______ made its decision.", ['has', 'have', 'are', 'were'], "A committee acting as one body takes a singular verb; <i>its</i> shows we treat it as one unit.", 'collective nouns'),
    m(2, V + "The police ______ investigating the case.", ['are', 'is', 'was', 'has been'], "<i>Police</i> is always plural: <b>are</b>.", 'collective nouns', "The word has no -s, so it looks singular."),
    m(3, V + "A flock of birds ______ flying over the lake.", ['was', 'were', 'are', 'have been'], "The head noun is <i>flock</i> (singular).", 'collective nouns'),
    m(3, V + "The company ______ announced that it will open two new offices.", ['has', 'have', 'are', 'were'], "<i>Company</i> acts as one body, and the pronoun <i>it</i> confirms a singular verb.", 'collective nouns'),
    m(1, S, ["She gave me some useful advice.", "She gave me some useful advices.", "She gave me a useful advice.", "She gave me many useful advice."], "<i>Advice</i> is uncountable: no plural, no <i>a</i>. Say <i>a piece of advice</i> for one.", 'uncountable nouns', "Learners add -s to advice, information and equipment."),
    m(1, V + "The news from the hospital ______ good.", ['is', 'are', 'were', 'have been'], "<i>News</i> looks plural but is uncountable and takes a singular verb.", 'uncountable nouns'),
    m(2, S, ["The information on the website is out of date.", "The informations on the website are out of date.", "The information on the website are out of date.", "The informations on the website is out of date."], "<i>Information</i> is uncountable: no -s and a singular verb.", 'uncountable nouns'),
    m(2, S, ["We bought a lot of new furniture.", "We bought a lot of new furnitures.", "We bought many new furnitures.", "We bought a new furnitures."], "<i>Furniture</i> is uncountable. For one item say <i>a piece of furniture</i>.", 'uncountable nouns'),
    m(2, V + "Recent research ______ that sleep helps memory.", ['shows', 'show', 'have shown', 'are showing'], "<i>Research</i> is uncountable and singular: <b>shows</b>.", 'uncountable nouns'),
    m(2, S, ["The equipment in the lab is very expensive.", "The equipments in the lab are very expensive.", "The equipment in the lab are very expensive.", "The equipments in the lab is very expensive."], "<i>Equipment</i> has no plural form: use a piece of equipment.", 'uncountable nouns'),
    m(3, S, ["All the luggage was checked at the gate.", "All the luggages were checked at the gate.", "All the luggage were checked at the gate.", "All the luggages was checked at the gate."], "<i>Luggage</i> (like <i>baggage</i>) is uncountable.", 'uncountable nouns'),
    m(3, S, ["Heavy traffic is the main cause of air pollution in the city.", "Heavy traffics are the main cause of air pollution in the city.", "Heavy traffic are the main cause of air pollution in the city.", "A heavy traffic is the main cause of air pollution in the city."], "<i>Traffic</i> is uncountable: no <i>a</i>, no plural, singular verb.", 'uncountable nouns'),
    m(4, S, ["She has made great progress in her studies.", "She has made a great progress in her studies.", "She has made great progresses in her studies.", "She has make great progress in her studies."], "<i>Progress</i> is uncountable: no <i>a</i>, no plural.", 'uncountable nouns', "Also uncountable: knowledge, work, evidence, homework, weather."),
    m(1, "Choose the correct word: There isn't ______ time left before the exam.", ['much', 'many', 'few', 'a few'], "<i>Time</i> is uncountable, so <i>much</i>.", 'much, many, few, little'),
    m(1, "Choose the correct word: How ______ people attended the meeting?", ['many', 'much', 'little', 'less'], "<i>People</i> is countable (plural), so <i>many</i>.", 'much, many, few, little'),
    m(2, "Choose the correct word: He has ______ friends in the city, so he often feels lonely.", ['few', 'a few', 'little', 'a little'], "<i>Few</i> (without <i>a</i>) means almost none: a negative idea.", 'much, many, few, little', "<i>A few</i> = some, positive."),
    m(2, "Choose the correct word: She has ______ friends in the city, so she is never bored.", ['a few', 'few', 'little', 'a little'], "<i>A few</i> means some: positive. Friends are countable, so not <i>little</i>.", 'much, many, few, little'),
    m(2, "Choose the correct word: There is ______ hope that the project will be finished on time.", ['little', 'few', 'a few', 'many'], "<i>Hope</i> is uncountable: <i>little</i> = almost none.", 'much, many, few, little'),
    m(2, "Choose the correct word: Add ______ sugar, then taste the sauce.", ['a little', 'a few', 'few', 'many'], "<i>Sugar</i> is uncountable; <i>a little</i> means a small amount.", 'much, many, few, little'),
    m(2, "Choose the correct word: There were ______ accidents on the new road than on the old one.", ['fewer', 'less', 'little', 'lesser'], "<i>Accidents</i> is countable, so <b>fewer</b>.", 'less and fewer', "<i>Less</i> is for uncountable nouns."),
    m(2, "Choose the correct word: We need ______ sugar in our diet.", ['less', 'fewer', 'a few', 'many'], "<i>Sugar</i> is uncountable: <b>less</b>.", 'less and fewer'),
    m(3, "Choose the correct word: ______ people use landline phones now than ten years ago.", ['Fewer', 'Less', 'Little', 'A little'], "<i>People</i> is countable: <b>fewer</b>.", 'less and fewer'),
    m(3, "Choose the correct word: The city has ______ rainfall than the coast.", ['less', 'fewer', 'many', 'few'], "<i>Rainfall</i> is uncountable: <b>less</b>.", 'less and fewer'),
    m(3, S, ["A large amount of water is wasted every day.", "A large number of water is wasted every day.", "A large amount of waters are wasted every day.", "A large number of water are wasted every day."], "<i>Amount of</i> goes with uncountable nouns; <i>number of</i> with plural countable nouns.", 'much, many, few, little'),
    m(3, "Choose the correct word: The main ______ for selecting candidates are experience and communication skills.", ['criteria', 'criterion', 'criterias', 'criterions'], "<i>Criterion</i> is singular and <i>criteria</i> is plural; the verb <i>are</i> shows a plural subject.", 'plural forms'),
    m(3, "Choose the correct word: Aurora lights are a natural ______ seen near the poles.", ['phenomenon', 'phenomena', 'phenomenas', 'phenomenons'], "<i>A</i> + singular: <b>phenomenon</b>. The plural is <i>phenomena</i>.", 'plural forms'),
    m(4, "Choose the correct word: These strange ______ have never been explained.", ['phenomena', 'phenomenon', 'phenomenas', 'phenomenons'], "<i>Have been</i> and <i>these</i> require the plural: <b>phenomena</b>.", 'plural forms'),
    m(4, "Choose the correct word: The scientists tested two ______ in the experiment.", ['hypotheses', 'hypothesis', 'hypothesises', 'hypothesys'], "Singular <i>hypothesis</i> becomes <i>hypotheses</i> in the plural (pronounced -eez).", 'plural forms'),
    m(4, "Choose the correct word: Several economic ______ occurred in the last century.", ['crises', 'crisis', 'crisises', 'crisess'], "Singular <i>crisis</i>, plural <i>crises</i>.", 'plural forms'),
    m(4, "Choose the correct word: Some ______ are harmful, but many help digestion.", ['bacteria', 'bacterium', 'bacterias', 'bacteriums'], "<i>Bacteria</i> is the plural (one <i>bacterium</i>); <i>are</i> signals plural.", 'plural forms'),
    m(5, S, ["The analyses of the two samples were completed on Friday.", "The analysis of the two samples were completed on Friday.", "The analyses of the two samples was completed on Friday.", "The analysis of the two samples was completed on Fridays."], "Two samples give two <i>analyses</i> (plural), with <i>were</i>.", 'plural forms'),
    m(5, S, ["The number of people who live alone is rising, and a number of them are over 65.", "The number of people who live alone are rising, and a number of them is over 65.", "The number of people who live alone is rising, and a number of them is over 65.", "The number of people who live alone are rising, and a number of them are over 65."], "<i>The number of</i> takes <i>is</i>; <i>a number of them</i> takes <i>are</i>.", 'the number of / a number of'),
    m(5, S, ["Neither the evidence nor the witnesses were convincing.", "Neither the evidence nor the witnesses was convincing.", "Neither the evidence nor the witnesses are convincing, and was rejected.", "Neither the evidence or the witnesses were convincing."], "<i>Neither... nor</i> (not <i>or</i>); the verb agrees with the nearer subject, <i>witnesses</i>.", 'either and neither'),
    m(5, S, ["Each of the committee members has expressed their views.", "Each of the committee members have expressed their views.", "Each of the committee members have expressed his views.", "Each of the committee members are expressing their views."], "<i>Each</i> takes a singular verb (<i>has</i>).", 'each, every, everyone'),
    t(1, "Type the correct form of the verb <b>be</b>: The number of students ______ rising.", ['is', 'has been'], "<i>The number of</i> takes a singular verb.", 'the number of / a number of'),
    t(2, "Type the correct form of the verb <b>be</b>: There ______ two new students in my class.", ['are', 'were'], "The real subject (<i>students</i>) is plural.", 'there is / there are'),
    t(2, "Type the correct form of <b>have</b>: Every student ______ a laptop.", ['has'], "<i>Every</i> takes a singular verb.", 'each, every, everyone'),
    t(2, "Type the correct word: I need some ______ about hotels. (advice / advices)", ['advice'], "<i>Advice</i> is uncountable, with no plural.", 'uncountable nouns'),
    t(3, "Type the plural of <b>criterion</b>: The ______ for the prize are clear.", ['criteria'], "Criterion becomes <b>criteria</b>.", 'plural forms'),
    t(3, "Type the correct word (fewer or less): We have ______ customers than last year.", ['fewer'], "<i>Customers</i> is countable.", 'less and fewer'),
    t(3, "Type the correct form of <b>be</b>: The news ______ better than expected.", ['is', 'was'], "<i>News</i> is uncountable and takes a singular verb.", 'uncountable nouns'),
  ],
};
