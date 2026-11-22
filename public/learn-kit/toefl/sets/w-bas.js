// Build a Sentence practice (lesson 4.1). Original exchanges by fibub; nothing copied from ETS material.
// Each row: [what the first person says, the reply in the right order, ...other correct orders].
// Chips are the reply's words in lower case (except I and names); the drill shuffles them.
const rows = [
  ['Where did you leave the lab report?', 'I put it on your desk this morning', 'this morning I put it on your desk'],
  ['Are you coming to the study group?', 'I will be there after my shift ends', 'after my shift ends I will be there'],
  ['How was the guest lecture?', 'it was more interesting than I expected'],
  ['Did the professor accept your topic?', 'she asked me to make it narrower'],
  ['Why is the library so quiet today?', 'most students have gone home for the break'],
  ['Can you send me the slides?', 'I have already emailed them to the whole class'],
  ['What did the advisor say about your schedule?', 'she said I was taking too many courses'],
  ['Is the cafeteria still open?', 'it closes at eight on Fridays', 'on Fridays it closes at eight'],
  ['When is the essay due?', 'we have to hand it in by Thursday', 'by Thursday we have to hand it in'],
  ['Have you found a roommate yet?', 'not yet but I am still looking'],
  ['Why did you change your major?', 'I realized that I enjoyed statistics more'],
  ['Is the bookstore far from here?', 'it is right next to the student center'],
  ['How long have you lived in this dorm?', 'I have lived here since last August', 'since last August I have lived here'],
  ['What happened to the printer?', 'someone must have jammed it with thick paper'],
  ['Do you want to grab lunch?', 'I would love to but I have a quiz'],
  ['Why was the field trip canceled?', 'the bus company did not have enough drivers'],
  ['How did you do on the midterm?', 'I did better than I thought I would'],
  ['Who is giving the talk tomorrow?', 'a visiting scientist from the ocean institute'],
  ['Where can I get a parking permit?', 'you can buy one at the campus security office'],
  ['Did you understand the last reading?', 'only the parts that were about climate'],
  ['What should I bring to the lab?', 'you need safety glasses and a notebook', 'you need a notebook and safety glasses'],
  ['Is the gym crowded in the morning?', 'it is usually empty before seven', 'before seven it is usually empty', 'usually it is empty before seven'],
  ['Why are you carrying so many books?', 'I am returning them before they become overdue', 'before they become overdue I am returning them'],
  ['Has the schedule for finals been posted?', 'it was posted on the website yesterday', 'it was posted yesterday on the website', 'yesterday it was posted on the website'],
  ['Could you help me move on Saturday?', 'I can help if you start after ten', 'if you start after ten I can help'],
  ['Why did Maya miss the seminar?', 'her flight was delayed because of the storm', 'because of the storm her flight was delayed'],
  ['What do you think of the new campus app?', 'it makes booking study rooms much easier'],
  ['Is your research going well?', 'the results are not what we predicted'],
  ['How often does the shuttle run?', 'it comes every fifteen minutes during the day', 'during the day it comes every fifteen minutes'],
  ['Did you finish the group project?', 'we finished it just before the deadline'],
  ['Where is the career fair this year?', 'it is being held in the main gym'],
  ['Why are you studying Spanish?', 'I hope to work in Mexico after graduating', 'after graduating I hope to work in Mexico'],
  ['Have you met the new teaching assistant?', 'yes he seems friendly and very organized', 'yes he seems very friendly and organized'],
  ['What did you learn in the workshop?', 'how to write a stronger research question'],
  ['Can I borrow your calculator?', 'sure as long as you return it today'],
  ['How did the experiment go?', 'it went well although it took longer than planned', 'although it took longer than planned it went well'],
  ['Why is the room so cold?', 'the heating has not been turned on yet', 'the heating has not yet been turned on'],
  ['Do you know when the pool reopens?', 'it should reopen at the end of the month', 'at the end of the month it should reopen'],
  ['What made you choose this university?', 'the engineering program has an excellent reputation'],
  ['Did you enjoy the concert last night?', 'it was so loud that I left early'],
  ['Are you going to apply for the internship?', 'I am thinking about it but the deadline is soon'],
  ['Why did you sit in the front row?', 'I wanted to see the board more clearly'],
  ['Has anyone seen my blue folder?', 'I think it was left in the lecture hall'],
  ['Should I take chemistry this term?', 'you had better finish the math course first'],
  ['How do you get to class so early?', 'I used to drive but now I cycle', 'I used to cycle but now I drive'],
  ['What is the professor like?', 'she is strict but her feedback is helpful', 'her feedback is helpful but she is strict'],
  ['Why did the coffee shop close?', 'it is being renovated over the summer', 'over the summer it is being renovated'],
  ['Is the history quiz difficult?', 'it is easy enough if you do the reading', 'if you do the reading it is easy enough'],
  ['Did you speak to the librarian?', 'yes she showed me where the maps are kept'],
  ['When will the grades be released?', 'they will be available online next week', 'next week they will be available online'],
  ['Why are you so tired today?', 'I stayed up late finishing my essay'],
  ['Who won the debate competition?', 'the team that argued against the proposal'],
  ['Can we change the meeting time?', 'that depends on what time works for everyone'],
  ['Have you ever been to the observatory?', 'I have never been there but I would like to go'],
  ['What will you do if it rains on Saturday?', 'we will move the picnic indoors'],
  ['How did you hear about the scholarship?', 'my roommate told me about it last week', 'last week my roommate told me about it'],
  ['Why is Daniel so happy?', 'his paper has been accepted by a journal'],
  ['Did you get the job at the museum?', 'they offered it to someone with more experience'],
  ['What is the best way to prepare for this course?', 'review the basic formulas before the first class'],
  ['Is it true the exam was moved?', 'yes it was moved to the following Monday'],
  ['How was your trip to the conference?', 'it was tiring but I met a lot of researchers'],
  ['Why do you study in the library every night?', 'it is much quieter than my apartment'],
  ['Did the store have the textbook?', 'they had sold out so I ordered one online'],
  ['What do you need from the bookstore?', 'nothing except a new set of pens'],
];
// One wrong but tempting order for a few rows (shown in the trap note).
const traps = {
  2: '"more interesting than I expected", not "interesting more": "more" comes before the adjective.',
  6: 'Reported speech keeps statement order: "she said I was taking", never "she said was I taking".',
  12: 'With "since", use the present perfect: "I have lived here since last August".',
  13: 'Modal + have + past participle: "must have jammed".',
  36: 'A passive with "yet": "has not been turned on yet" (or "has not yet been turned on").',
  43: '"had better" + base verb: "had better finish", not "had better to finish".',
  47: '"easy enough": "enough" goes after an adjective.',
};
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const items = rows.map(([prompt, answer, ...alts], i) => {
  const chips = answer.split(' ');
  const more = [...new Set(alts.filter((a) => a !== answer))];
  const it = {
    id: `w-bas-${String(i + 1).padStart(2, '0')}`,
    type: 'order',
    q: `Build a sentence. <i>"${prompt}"</i> → reply:`,
    options: chips,
    answer: [answer, ...more],
    sol: `"${cap(answer)}." ${more.length ? 'Also accepted: ' + more.map((a) => `"${cap(a)}"`).join(', ') + '. ' : ''}Find the subject and the main verb first, then add the rest in chunks.`,
  };
  if (traps[i]) it.trap = traps[i];
  return it;
});

// Short checks on the rules behind the task.
const mcq = [
  ['Which reply is in the right order?', ['I have never seen such a long line', 'I have seen never such a long line', 'never I have seen such a long line', 'I never have such seen a long line'], '"never" goes between the helper verb and the main verb: "have never seen".'],
  ['Which reply is in the right order?', ['she asked where the lab was', 'she asked where was the lab', 'she asked where the lab is was', 'where she asked the lab was'], 'Inside a reported question, use statement order: "where the lab was".'],
  ['Which reply is in the right order?', ['the book that you lent me was great', 'the book that lent you me was great', 'the book was that you lent me great', 'that the book you lent me was great'], 'A relative clause ("that you lent me") follows the noun it describes.'],
  ['Which reply is in the right order?', ['it was too late to call him', 'it was late too to call him', 'it was too to call him late', 'too it was late to call him'], '"too" + adjective + to-verb: "too late to call".'],
  ['Which reply is in the right order?', ['we usually meet on Tuesdays', 'we meet usually on Tuesdays', 'usually we on Tuesdays meet', 'we on Tuesdays usually meet'], 'Frequency adverbs ("usually") go before the main verb.'],
  ['Which reply is in the right order?', ['I am not sure what time it starts', 'I am not sure what time does it start', 'I am not sure what time starts it', 'I am not what time sure it starts'], 'After "I am not sure", use statement order and no "does".'],
  ['Which reply is in the right order?', ['the room was cleaned yesterday', 'the room yesterday was cleaned', 'was the room cleaned yesterday', 'the room was yesterday cleaned'], 'Passive: subject + was + past participle; time words usually go at the end.'],
  ['Which reply is in the right order?', ['if I had known I would have come', 'if I would have known I had come', 'if I known had I would have come', 'I would have if I had known come'], 'Third conditional: "if + had + past participle, would have + past participle".'],
  ['Which reply is in the right order?', ['a small wooden table', 'a wooden small table', 'a table small wooden', 'a small table wooden'], 'Size comes before material: "small wooden table".'],
  ['Which reply is in the right order?', ['he speaks English very well', 'he speaks very well English', 'he very well speaks English', 'he speaks English well very'], 'Do not put an adverb between a verb and its object: "speaks English very well".'],
  ['In Build a Sentence, what should you look for first among the word chips?', ['The subject and the main verb', 'The longest word', 'The word that starts with a capital letter', 'Any word that appears in the question'], 'Subject + verb is the backbone of every English sentence; everything else attaches to it.'],
  ['The first speaker asks "Did you call the office?" Which reply fits the situation best?', ['Yes and they said the form is ready', 'Yes and is ready the form they said', 'They said yes the form is ready and', 'Yes the form and they said is ready'], 'A natural reply answers the question first ("Yes"), then adds the news in statement order.'],
];
mcq.forEach(([q, options, sol], i) => items.push({ id: `w-bas-m${i + 1}`, type: 'mcq', q, options, answer: 0, sol }));

export default { title: 'Build a Sentence', accent: 'en-US', items };
