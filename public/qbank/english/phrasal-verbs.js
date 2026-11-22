// English bank: phrasal verbs (verb + particle with its own meaning: give up, look into, put off).
// Common in listening and speaking, and useful to recognize in reading; in formal essays a one-word verb
// is often better (e.g. investigate for look into). Original items written for fibub.
// mcq options are written correct-first and placed by ROT so the answer letters spread over A-D.
// Append new items at the end with new ids; never reuse an id.
const EX = ['ielts', 'celpip', 'toefl'];
const F = { skill: 'vocabulary' };
const ROT = [1, 2, 0, 3, 3, 0, 2, 1, 0, 3, 1, 2];
let n = 0;
const m = (id, level, q, opts, sol, sub) => { const k = ROT[n++ % ROT.length]; const o = opts.slice(1); o.splice(k, 0, opts[0]); return { id, type: 'mcq', level, exams: EX, facets: F, sub, q, options: o, answer: k, sol }; };
const t = (id, level, q, answer, sol, sub, w = 1) => ({ id, type: 'text', level, exams: EX, facets: F, sub, q, answer: [].concat(answer), maxWords: w, sol });
const o = (id, level, q, s, sol, sub) => ({ id, type: 'order', level, exams: EX, facets: F, sub, q, options: s.split(' ').sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())), answer: [s], sol });
const mean = (pv, ctx) => `What does <b>${pv}</b> mean here?<br><i>${ctx}</i>`;

export default {
  topic: 'phrasal-verbs',
  items: [
    m('pv-001', 1, 'Please ______ your coat. It is warm in here.', ['take off', 'take up', 'take in', 'take over'], '<b>Take off</b> clothes = remove them.', 'everyday'),
    m('pv-002', 1, 'I ______ at 6:30 every morning.', ['get up', 'get on', 'get off', 'get over'], '<b>Get up</b> = get out of bed.', 'everyday'),
    m('pv-003', 1, 'Can you ______ the music? I am trying to sleep.', ['turn down', 'turn up', 'turn on', 'turn into'], '<b>Turn down</b> = make quieter. <i>Turn up</i> = make louder.', 'everyday'),
    m('pv-004', 1, 'Please ______ this form and give it to the front desk.', ['fill in', 'fill up', 'fill over', 'fill on'], '<b>Fill in</b> (or fill out) a form = write the information.', 'everyday'),
    m('pv-005', 1, 'I am ______ my keys. Have you seen them?', ['looking for', 'looking after', 'looking up', 'looking into'], '<b>Look for</b> = try to find.', 'everyday'),
    m('pv-006', 1, 'Who ______ your dog when you are away?', ['looks after', 'looks for', 'looks up', 'looks out'], '<b>Look after</b> = take care of.', 'everyday'),
    m('pv-007', 1, 'We ______ the bus at the main square.', ['got off', 'got up', 'got over', 'got by'], '<b>Get off</b> a bus or train = leave it. <i>Get on</i> = enter it.', 'everyday'),
    m('pv-008', 1, 'If you don\'t know the word, ______ in a dictionary.', ['look it up', 'look up it', 'look it for', 'look after it'], '<b>Look up</b> = find information. With a pronoun, it goes in the middle: <b>look it up</b>.', 'word order'),
    m('pv-009', 2, mean('give up', 'She gave up smoking last year.'), ['stopped', 'started', 'tried', 'sold'], '<b>Give up</b> = stop doing a habit.', 'meaning'),
    m('pv-010', 2, mean('put off', 'The meeting has been put off until Monday.'), ['delayed', 'canceled for good', 'moved earlier', 'finished'], '<b>Put off</b> = postpone, move to a later time.', 'meaning'),
    m('pv-011', 2, mean('find out', 'I need to find out when the shop opens.'), ['discover', 'forget', 'decide', 'guess'], '<b>Find out</b> = get information, discover.', 'meaning'),
    m('pv-012', 2, mean('run out of', 'We have run out of milk.'), ['have none left', 'have too much', 'have bought', 'have spilled'], '<b>Run out of</b> = have none left.', 'meaning'),
    m('pv-013', 2, mean('get on with', 'I get on well with my neighbors.'), ['have a friendly relationship', 'live next to', 'argue', 'work for'], '<b>Get on (well) with</b> someone = have a good relationship.', 'meaning'),
    m('pv-014', 2, mean('come across', 'I came across an old photo in a drawer.'), ['found by chance', 'looked for', 'threw away', 'took'], '<b>Come across</b> = find or meet by chance.', 'meaning'),
    m('pv-015', 2, mean('turn up', 'Only ten people turned up to the meeting.'), ['came', 'left', 'spoke', 'complained'], '<b>Turn up</b> = arrive, appear (often unexpectedly or late).', 'meaning'),
    m('pv-016', 2, mean('pick up', 'Can you pick me up from the station?'), ['collect me by car', 'lift me up', 'call me', 'leave me'], '<b>Pick someone up</b> = collect them, usually in a car.', 'meaning'),
    m('pv-017', 2, 'The fire alarm ______ while we were having lunch.', ['went off', 'went out', 'went on', 'went over'], 'An alarm <b>goes off</b> = starts ringing.', 'everyday'),
    m('pv-018', 2, 'Let\'s ______ next week to talk about the plan.', ['meet up', 'meet out', 'meet off', 'meet in'], '<b>Meet up</b> = meet socially or by arrangement.', 'everyday'),
    m('pv-019', 3, mean('look into', 'The council will look into the complaint.'), ['investigate', 'ignore', 'reject', 'publish'], '<b>Look into</b> = investigate. In formal writing, <i>investigate</i> is often better.', 'formal equivalent'),
    m('pv-020', 3, mean('set up', 'She set up her own business in 2019.'), ['established', 'closed', 'sold', 'joined'], '<b>Set up</b> a business = establish it.', 'formal equivalent'),
    m('pv-021', 3, mean('carry out', 'The researchers carried out a survey.'), ['conducted', 'cancelled', 'designed', 'avoided'], '<b>Carry out</b> = conduct, do.', 'formal equivalent'),
    m('pv-022', 3, mean('cut down on', 'Doctors advise cutting down on salt.'), ['reducing', 'stopping', 'adding', 'avoiding totally'], '<b>Cut down on</b> = reduce, use less.', 'formal equivalent'),
    m('pv-023', 3, mean('point out', 'She pointed out a mistake in the report.'), ['mentioned', 'made', 'hid', 'fixed'], '<b>Point out</b> = draw attention to, mention.', 'formal equivalent'),
    m('pv-024', 3, mean('bring up', 'He brought up the issue of cost at the meeting.'), ['raised', 'solved', 'dropped', 'paid'], '<b>Bring up</b> a topic = raise it. (It can also mean raise a child.)', 'meaning'),
    m('pv-025', 3, mean('turn down', 'She turned down the job offer.'), ['refused', 'accepted', 'asked about', 'changed'], '<b>Turn down</b> an offer = refuse it.', 'meaning'),
    m('pv-026', 3, mean('take up', 'He took up running after he retired.'), ['started as a hobby', 'stopped', 'watched', 'taught'], '<b>Take up</b> a hobby = start doing it.', 'meaning'),
    m('pv-027', 3, mean('break down', 'Our car broke down on the highway.'), ['stopped working', 'crashed into something', 'went faster', 'was stolen'], 'A machine <b>breaks down</b> = stops working.', 'meaning'),
    m('pv-028', 3, mean('deal with', 'The manager deals with customer complaints.'), ['handles', 'causes', 'ignores', 'sells'], '<b>Deal with</b> = handle, manage.', 'formal equivalent'),
    m('pv-029', 3, 'Prices are expected to ______ next year because of higher energy costs.', ['go up', 'go off', 'go over', 'go out'], 'Prices <b>go up</b> = rise.', 'numbers'),
    m('pv-030', 3, 'The number of visitors ______ sharply after the bridge closed.', ['dropped off', 'dropped in', 'dropped by', 'dropped out'], '<b>Drop off</b> = fall, become fewer. <i>Drop in/by</i> = visit; <i>drop out</i> = leave a course.', 'numbers'),
    m('pv-031', 4, mean('phase out', 'The city will phase out diesel buses by 2030.'), ['gradually stop using', 'quickly buy more', 'repair', 'test'], '<b>Phase out</b> = stop using something step by step.', 'formal equivalent'),
    m('pv-032', 4, mean('account for', 'Young people account for a third of all users.'), ['make up', 'explain away', 'pay for', 'count'], '<b>Account for</b> a share = make up that share. (It can also mean explain.)', 'numbers'),
    m('pv-033', 4, mean('come up with', 'The team came up with a new idea.'), ['thought of', 'argued against', 'copied', 'rejected'], '<b>Come up with</b> = think of, produce (an idea, a plan).', 'meaning'),
    m('pv-034', 4, mean('do away with', 'Some schools have done away with homework.'), ['got rid of', 'increased', 'checked', 'kept'], '<b>Do away with</b> = abolish, get rid of.', 'formal equivalent'),
    m('pv-035', 4, mean('put up with', 'I can\'t put up with the noise any longer.'), ['tolerate', 'enjoy', 'make', 'report'], '<b>Put up with</b> = tolerate, accept something unpleasant.', 'meaning'),
    m('pv-036', 4, mean('back up', 'Can you back up your claim with data?'), ['support', 'repeat', 'withdraw', 'save'], '<b>Back up</b> a claim = support it with evidence. (Back up files = save a copy.)', 'meaning'),
    m('pv-037', 4, mean('hold back', 'A lack of money is holding back the project.'), ['slowing down', 'paying for', 'speeding up', 'ending'], '<b>Hold back</b> = stop something from making progress.', 'meaning'),
    m('pv-038', 4, mean('stand out', 'Her essay stood out from the rest.'), ['was clearly better or different', 'was shorter', 'was copied', 'was late'], '<b>Stand out</b> = be easy to notice, often because it is better.', 'meaning'),
    m('pv-039', 5, mean('bear out', 'The latest figures bear out the earlier forecast.'), ['confirm', 'contradict', 'replace', 'delay'], '<b>Bear out</b> = show that something is true.', 'formal equivalent'),
    m('pv-040', 5, mean('gloss over', 'The report glosses over the cost of the scheme.'), ['treats too briefly to avoid it', 'explains in detail', 'adds up', 'praises'], 'To <b>gloss over</b> a problem is to mention it quickly so people will not notice it.', 'meaning'),
    m('pv-041', 5, mean('iron out', 'We need to iron out a few problems before launch.'), ['solve', 'create', 'hide', 'list'], '<b>Iron out</b> problems = solve the small remaining ones.', 'meaning'),
    m('pv-042', 5, mean('fall through', 'The deal fell through at the last minute.'), ['failed to happen', 'was signed', 'became cheaper', 'was announced'], 'A plan <b>falls through</b> = it does not happen.', 'meaning'),
    m('pv-043', 5, mean('play down', 'The company played down the risks.'), ['made seem less serious', 'made seem worse', 'tested', 'removed'], '<b>Play down</b> = make something seem less important. The opposite is <i>play up</i>.', 'meaning'),
    m('pv-044', 5, mean('brush up on', 'I need to brush up on my French before the trip.'), ['practice to improve', 'forget', 'translate', 'stop studying'], '<b>Brush up on</b> a skill = practice it again to improve it.', 'meaning'),
    m('pv-045', 2, 'Which sentence is correct?', ['Please turn it off.', 'Please turn off it.', 'Please it turn off.', 'Please turn of it.'], 'With a pronoun (it, them), separable phrasal verbs put it in the middle: <b>turn it off</b>.', 'word order'),
    m('pv-046', 3, 'Which sentence is correct?', ['I am looking after them.', 'I am looking them after.', 'I am after looking them.', 'I am looking them for after.'], '<b>Look after</b> cannot be separated: <i>look after them</i>.', 'word order'),
    t('pv-047', 1, 'Complete with one word: "Please sit ______. The film is starting."', ['down'], '<b>Sit down</b>.', 'everyday'),
    t('pv-048', 1, 'Complete with one word: "Hurry ______! We are late."', ['up'], '<b>Hurry up</b> = be quick.', 'everyday'),
    t('pv-049', 2, 'Complete with one word: "Please hold ______. I will put you through to the manager."', ['on'], '<b>Hold on</b> = wait (on the phone).', 'everyday'),
    t('pv-050', 2, 'Complete with one word: "I\'m not feeling well. I think I\'m coming ______ with a cold."', ['down'], '<b>Come down with</b> an illness = start to have it.', 'meaning'),
    t('pv-051', 2, 'Complete with one word: "Watch ______! There\'s a car coming."', ['out'], '<b>Watch out</b> = be careful.', 'everyday'),
    t('pv-052', 3, 'Complete with one word: "It took her months to get ______ the flu."', ['over'], '<b>Get over</b> an illness = recover from it.', 'meaning'),
    t('pv-053', 3, 'Complete with one word: "The school was set ______ in 1965."', ['up'], '<b>Set up</b> = established.', 'formal equivalent'),
    t('pv-054', 3, 'Complete with one word: "He dropped ______ of university after one year."', ['out'], '<b>Drop out of</b> a course = leave before finishing.', 'meaning'),
    t('pv-055', 4, 'Complete with one word: "Smartphones have taken ______ from cameras for most people."', ['over'], '<b>Take over from</b> = replace.', 'meaning'),
    t('pv-056', 4, 'Complete with one word: "The government plans to crack ______ on illegal parking."', ['down'], '<b>Crack down on</b> = deal with very strictly.', 'meaning'),
    t('pv-057', 5, 'Complete with one word: "Rising costs may eat ______ our savings."', ['into'], '<b>Eat into</b> savings or time = use up part of it.', 'meaning'),
    t('pv-058', 5, 'Write one formal verb for <b>find out</b> in an essay: "Researchers wanted to ______ why..." (begins with d)', ['determine', 'discover'], '<b>Determine</b> or <b>discover</b> = find out (formal).', 'formal equivalent'),
    t('pv-059', 4, 'Write one formal verb for <b>go up</b>: "Rents ______ by 8% last year." (past tense)', ['increased', 'rose'], '<b>Increased</b> or <b>rose</b> = went up.', 'formal equivalent'),
    o('pv-060', 2, 'Put the words in order to make a sentence.', 'Can you pick me up at six', 'With a pronoun, it goes inside the phrasal verb: <b>pick me up</b>.', 'word order'),
    o('pv-061', 3, 'Put the words in order to make a sentence.', 'We have run out of printer paper', '<b>Run out of</b> = have none left.', 'word order'),
    o('pv-062', 4, 'Put the words in order to make a sentence.', 'I can no longer put up with this noise', '<b>Put up with</b> = tolerate. Three-part phrasal verbs stay together.', 'word order'),
  ],
};
