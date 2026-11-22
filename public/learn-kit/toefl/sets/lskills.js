// Core listening skills for the TOEFL (lesson 3.1): gist, signal words, changed plans, inference and attitude.
// Original short scripts and questions by fibub.
export default {
  title: 'TOEFL listening skills',
  accent: 'en-US',
  groups: {
    s1: { title: 'Listen for the main idea.', audio: [
      { who: 'A', name: 'Student', text: 'I signed up for the chess club in September, but honestly, I’ve only been twice. The meetings are on Tuesday nights, and that’s when I have my longest lab. I keep telling myself I’ll go next week, but it never happens. I think I’ll just ask if they have a weekend group instead.' },
    ] },
    s2: { title: 'Listen for a changed plan.', audio: [
      { who: 'A', name: 'Nina', text: 'Are we still meeting at the café at three to finish the poster?' },
      { who: 'B', name: 'Omar', text: 'That was the plan, but the café is closed for a private event today. Let’s use the study room in the engineering building instead. I booked it from three thirty.' },
      { who: 'A', name: 'Nina', text: 'Three thirty is fine. I’ll bring the printed photos.' },
    ] },
    s3: { title: 'Listen for signal words in a short talk.', audio: [
      { who: 'N', name: 'Professor', text: 'There are two main reasons why honeybees dance. First, the dance tells other bees which direction to fly to find food. Second, and this surprised scientists, the length of the dance tells them how far away the food is. However, bees do not dance for every flower. They only dance when the food is especially good.' },
    ] },
    s4: { title: 'Listen for the speaker’s attitude.', audio: [
      { who: 'A', name: 'Rosa', text: 'Did you read the new guidelines for the group project?' },
      { who: 'B', name: 'Ben', text: 'I did. Well, I guess a twenty-page report is one way to spend spring break.' },
      { who: 'A', name: 'Rosa', text: 'I know. And we only have three people in our group now that Kyle dropped the class.' },
      { who: 'B', name: 'Ben', text: 'Right. I’ll email the professor and ask if we can make it shorter, or at least get an extra week.' },
    ] },
    s5: { title: 'Listen and infer what the speaker means.', audio: [
      { who: 'A', name: 'Liam', text: 'Do you want to try the new pizza place on Elm Street tonight?' },
      { who: 'B', name: 'Grace', text: 'I went there on Saturday. Let’s just say the line was longer than the menu.' },
      { who: 'A', name: 'Liam', text: 'Ha. Okay, what about the noodle place by the library?' },
      { who: 'B', name: 'Grace', text: 'Now you’re talking.' },
    ] },
    s6: { title: 'Listen for purpose: why does the speaker say it?', audio: [
      { who: 'N', name: 'Professor', text: 'Before we talk about how glaciers move, think about a jar of honey. If you tip the jar, the honey does not pour out at once. It flows, slowly, under its own weight. Glacier ice does something similar. It is solid, but over many years, under enormous weight, it slowly flows downhill.' },
    ] },
    s7: { title: 'Listen for a detail among numbers.', audio: [
      { who: 'A', name: 'Student', text: 'Hi, I’d like to buy a bus pass. How much is the monthly one?' },
      { who: 'B', name: 'Clerk', text: 'It’s sixty dollars for the general public, but with a student card it’s forty-five.' },
      { who: 'A', name: 'Student', text: 'Great. And is there a semester pass?' },
      { who: 'B', name: 'Clerk', text: 'There is. It’s one hundred sixty for four months, so you save twenty dollars compared with buying four monthly passes.' },
      { who: 'A', name: 'Student', text: 'Then I’ll take the semester pass.' },
    ] },
  },
  items: [
    { id: 'lskills-01', type: 'mcq', group: 's1', q: 'What is the student mainly talking about?', options: ['Why he rarely goes to the chess club', 'How to play chess well', 'His long biology lab report', 'Starting a new club'], answer: 0, sol: 'Almost every sentence explains why he has "only been twice". That is the main idea.', trap: 'The lab is mentioned, but only as the reason. A reason is a detail, not the main idea.' },
    { id: 'lskills-02', type: 'mcq', group: 's1', q: 'Why does he miss the meetings?', options: ['They are at the same time as his lab', 'He does not enjoy chess', 'They are too far away', 'He works on Tuesdays'], answer: 0, sol: 'The meetings are on Tuesday nights, "and that’s when I have my longest lab".' },
    { id: 'lskills-03', type: 'mcq', group: 's1', q: 'What will he probably do?', options: ['Ask about a weekend group', 'Quit the club', 'Drop his lab', 'Go next Tuesday'], answer: 0, sol: '"I think I’ll just ask if they have a weekend group instead."', trap: '"I’ll go next week" is what he keeps telling himself but never does.' },
    { id: 'lskills-04', type: 'mcq', group: 's2', q: 'Where will Nina and Omar meet?', options: ['In a study room in the engineering building', 'At the café', 'In the library', 'At Nina’s apartment'], answer: 0, sol: '"Let’s use the study room in the engineering building instead."', trap: 'The café was the first plan. "That was the plan, but..." signals a change.' },
    { id: 'lskills-05', type: 'mcq', group: 's2', q: 'When will they meet?', options: ['At three thirty', 'At three', 'At four', 'At two thirty'], answer: 0, sol: 'Omar booked the room "from three thirty", and Nina agrees.' },
    { id: 'lskills-06', type: 'mcq', group: 's2', q: 'Why did the plan change?', options: ['The café is closed for a private event', 'Omar has a class at three', 'The poster is not ready', 'Nina forgot the photos'], answer: 0, sol: '"The café is closed for a private event today."' },
    { id: 'lskills-07', type: 'mcq', group: 's3', q: 'According to the professor, what does the length of the dance show?', options: ['How far away the food is', 'Which direction to fly', 'How good the food is', 'How many bees should go'], answer: 0, sol: '"Second... the length of the dance tells them how far away the food is."', trap: 'Direction was the first reason ("First..."), not length.' },
    { id: 'lskills-08', type: 'mcq', group: 's3', q: 'Which signal word introduces a limit to the idea?', options: ['However', 'First', 'Second', 'Two main reasons'], answer: 0, sol: '"However" introduces a contrast: bees "do not dance for every flower".' },
    { id: 'lskills-09', type: 'mcq', group: 's3', q: 'When do bees dance?', options: ['Only when the food is especially good', 'Every time they find a flower', 'Only in the morning', 'When they are in danger'], answer: 0, sol: '"They only dance when the food is especially good."' },
    { id: 'lskills-10', type: 'mcq', group: 's4', q: 'What does Ben mean when he says "a twenty-page report is one way to spend spring break"?', options: ['He is unhappy that the project will take his vacation time', 'He is excited to write over the break', 'He has already finished the report', 'He thinks twenty pages is short'], answer: 0, sol: 'His tone is ironic: nobody wants to spend a break writing. His next move, asking for a shorter report, confirms he is unhappy.' },
    { id: 'lskills-11', type: 'mcq', group: 's4', q: 'Why does Rosa mention Kyle?', options: ['To show the group now has fewer people to do the work', 'To suggest Kyle can help', 'To say Kyle wrote the guidelines', 'To complain about the professor'], answer: 0, sol: '"We only have three people in our group now that Kyle dropped the class": less help for a big project.' },
    { id: 'lskills-12', type: 'mcq', group: 's4', q: 'What will Ben do?', options: ['Ask the professor for a shorter report or more time', 'Find a new group member', 'Drop the class', 'Write the report alone'], answer: 0, sol: '"I’ll email the professor and ask if we can make it shorter, or at least get an extra week."' },
    { id: 'lskills-13', type: 'mcq', group: 's5', q: 'What does Grace imply about the pizza place?', options: ['She had to wait a long time there', 'It has a very long menu', 'The pizza was excellent', 'It was closed on Saturday'], answer: 0, sol: '"The line was longer than the menu" is a joke meaning the wait was very long.', trap: 'She does not literally talk about the menu’s length; read the meaning, not the words.' },
    { id: 'lskills-14', type: 'mcq', group: 's5', q: 'What does Grace mean by "Now you’re talking"?', options: ['She likes the new suggestion', 'She wants Liam to keep talking', 'She did not hear him', 'She disagrees'], answer: 0, sol: '"Now you’re talking" is an idiom for strong agreement with a suggestion.' },
    { id: 'lskills-15', type: 'mcq', group: 's5', q: 'Where will they probably eat?', options: ['At the noodle place by the library', 'At the pizza place on Elm Street', 'At home', 'They have not decided'], answer: 0, sol: 'Liam suggests the noodle place, and Grace agrees enthusiastically.' },
    { id: 'lskills-16', type: 'mcq', group: 's6', q: 'Why does the professor talk about honey?', options: ['To help explain how glacier ice moves', 'To describe what glaciers are made of', 'To change the topic', 'To give an example of a solid'], answer: 0, sol: 'He uses honey as a comparison: "Glacier ice does something similar." This is a purpose question.' },
    { id: 'lskills-17', type: 'mcq', group: 's6', q: 'What does the professor say about glacier ice?', options: ['It flows slowly under its own weight', 'It is a liquid', 'It moves quickly downhill', 'It never moves'], answer: 0, sol: '"Over many years, under enormous weight, it slowly flows downhill."' },
    { id: 'lskills-18', type: 'mcq', group: 's6', q: 'What will the professor probably talk about next?', options: ['How glaciers move', 'How honey is made', 'The history of glaciers', 'Bees'], answer: 0, sol: '"Before we talk about how glaciers move..." tells you the next topic.' },
    { id: 'lskills-19', type: 'mcq', group: 's7', q: 'How much is a monthly pass for students?', options: ['Forty-five dollars', 'Sixty dollars', 'Twenty dollars', 'One hundred sixty dollars'], answer: 0, sol: '"With a student card it’s forty-five."', trap: 'Sixty is the price for the general public.' },
    { id: 'lskills-20', type: 'mcq', group: 's7', q: 'How long does the semester pass last?', options: ['Four months', 'One month', 'Six months', 'One year'], answer: 0, sol: '"One hundred sixty for four months."' },
    { id: 'lskills-21', type: 'mcq', group: 's7', q: 'Why does the student choose the semester pass?', options: ['It costs less than buying monthly passes', 'The monthly pass is sold out', 'It works on trains too', 'It includes parking'], answer: 0, sol: '"You save twenty dollars compared with buying four monthly passes." Then: "Then I’ll take the semester pass."' },
    { id: 'lskills-22', type: 'text', group: 's7', q: 'How many dollars does the student save with the semester pass? Type the number.', answer: ['20', 'twenty', '$20'], maxWords: 1, sol: '4 x $45 = $180; the semester pass is $160, so the saving is $20, as the clerk says.' },
    { id: 'lskills-23', type: 'text', group: 's2', q: 'What will Nina bring? Type two words.', answer: ['printed photos', 'the photos', 'photos'], maxWords: 3, sol: '"I’ll bring the printed photos."' },
    { id: 'lskills-24', type: 'text', group: 's3', q: 'How many reasons for the dance does the professor give? Type the number.', answer: ['2', 'two'], maxWords: 1, sol: '"There are two main reasons", introduced with "First" and "Second".' },
  ],
};
