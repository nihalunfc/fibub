// Adaptive-test judgement (lesson 1.4). Original by fibub.
export default {
  title: 'adaptive-test strategy',
  items: [
    { id: 'ad-01', type: 'mcq', q: 'You are unsure between two options on a reading question.', options: ['Pick the one with better evidence in the text and move on', 'Leave it blank', 'Pick the longer option', 'Spend three minutes rereading the passage'], answer: 0, sol: 'Choose using evidence, then move on. A blank is always wrong, and time spent here is lost elsewhere.' },
    { id: 'ad-02', type: 'mcq', q: 'The first questions of Listening seem easy.', options: ['Still answer carefully: early accuracy shapes what comes next', 'Answer fast without thinking to save time', 'Skip them', 'Assume they are not scored'], answer: 0, sol: 'Easy-looking early items still count and still guide the test.' },
    { id: 'ad-03', type: 'mcq', q: 'Your second reading block is much harder than the first.', options: ['Good sign: stay calm and keep a steady pace', 'Bad sign: start guessing randomly', 'Ask the proctor to change it', 'Stop and restart the section'], answer: 0, sol: 'A harder block usually follows a strong first block.' },
    { id: 'ad-04', type: 'mcq', q: 'Two students both answer 40 reading items correctly. Can they get different bands?', options: ['Yes, if the difficulty of their items differed', 'No, the same count always gives the same band', 'Only if one of them used Home Edition', 'Only in Writing'], answer: 0, sol: 'In adaptive tests, harder items answered correctly carry more weight.' },
    { id: 'ad-05', type: 'mcq', q: 'Which practice habit fits an adaptive test best?', options: ['Timed sets where you answer every item in order', 'Doing only the easy items first', 'Untimed practice with a dictionary', 'Reading answer keys before trying'], answer: 0, sol: 'In order, no skipping, under time: just like the real thing.' },
    { id: 'ad-06', type: 'mcq', q: 'You spent too long on one item and the clock is low.', options: ['Make your best choice and keep moving', 'Finish that item perfectly whatever the time', 'Leave the rest blank', 'Restart the section'], answer: 0, sol: 'Every remaining item is a chance to score. Protect them.' },
    { id: 'ad-07', type: 'mcq', q: 'Why can an adaptive test be shorter and still accurate?', options: ['It spends most questions near your real level', 'It skips the hard skills', 'It only tests grammar', 'It uses fewer sections'], answer: 0, sol: 'Questions far too easy or too hard tell little; adaptive tests avoid wasting time on them.' },
  ],
};
