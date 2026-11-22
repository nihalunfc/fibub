// Format check and taster (lesson 1.2). Original by fibub.
export default {
  title: 'the 2026 TOEFL tasks',
  groups: {
    n1: { title: 'Read the notice.', passage: '<p><b>Campus Recreation Center: Winter Hours</b></p><p>From January 6, the pool opens at 6:30 a.m. on weekdays (7:00 a.m. before). Weekend hours do not change: 9:00 a.m. to 6:00 p.m. The climbing wall is closed for repairs until February 1. Students need their ID card to enter; guests pay $8 per visit.</p>' },
  },
  items: [
    { id: 'tf-01', type: 'text', q: 'Complete the word: "Most students live in residence during their fir__ year."', answer: ['first', 'st'], sol: '"first year". The word keeps its first letters; you add the rest. Typing just the missing letters (st) is also accepted here, but in the test you complete the whole word box.' },
    { id: 'tf-02', type: 'text', q: 'Complete the word: "The experiment showed a clear incr____ in temperature."', answer: ['increase', 'ease'], sol: '"increase": a noun here, after "a clear".' },
    { id: 'tf-03', type: 'text', q: 'Complete the word: "Bees play an import___ role in farming."', answer: ['important', 'ant'], sol: '"important" is an adjective before the noun "role".' },
    { id: 'tf-04', type: 'order', q: 'Build a sentence. <i>"Where is the meeting?"</i> → reply:', options: ['I', 'think', 'it', 'is', 'in', 'room', '204'], answer: ['I think it is in room 204'], sol: 'Subject + verb ("I think"), then the statement "it is in room 204".' },
    { id: 'tf-05', type: 'order', q: 'Build a sentence. <i>"Did you finish the reading?"</i> → reply:', options: ['not', 'yet', 'but', 'I', 'will', 'tonight'], answer: ['not yet but I will tonight', 'not yet but tonight I will'], sol: '"Not yet, but I will tonight." Short answer first, then the plan.' },
    { id: 'tf-06', type: 'mcq', group: 'n1', q: 'What changes on January 6?', options: ['The pool opens earlier on weekdays', 'The pool closes on weekends', 'Guests get in free', 'The climbing wall reopens'], answer: 0, sol: 'Weekday opening moves from 7:00 to 6:30 a.m.', trap: 'The climbing wall reopens on February 1, not January 6.' },
    { id: 'tf-07', type: 'mcq', group: 'n1', q: 'What do guests need to do?', options: ['Pay $8 per visit', 'Show a student ID', 'Book a week ahead', 'Come only on weekends'], answer: 0, sol: '"Guests pay $8 per visit."' },
    { id: 'tf-08', type: 'mcq', q: 'Which task asks you to add your own post to a class discussion?', options: ['Write for an Academic Discussion', 'Write an Email', 'Build a Sentence', 'Take an Interview'], answer: 0, sol: 'You read a professor’s question and two students’ posts, then write your own.' },
    { id: 'tf-09', type: 'mcq', q: 'Which is the shortest section?', options: ['Speaking', 'Reading', 'Listening', 'Writing'], answer: 0, sol: 'Speaking is about 8 minutes.' },
    { id: 'tf-10', type: 'mcq', q: 'In Listen and Repeat you…', options: ['say back a sentence exactly as you heard it', 'summarise a lecture', 'answer an interviewer', 'read a passage aloud'], answer: 0, sol: 'You repeat each sentence clearly and accurately.' },
  ],
};
