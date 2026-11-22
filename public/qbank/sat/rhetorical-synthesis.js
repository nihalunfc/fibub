// SAT Reading and Writing · Expression of ideas · rhetorical synthesis (notes questions). Original notes (fibub).
import { place } from './_util.js';
const F = { section: 'rw', domain: 'expression' };
const it = (id, level, sub, notes, goal, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['sat'], sub, facets: F, q: `<p>While researching a topic, a student has taken the following notes:</p><ul>${notes.map((n) => `<li>${n}</li>`).join('')}</ul><p>The student wants to ${goal}. Which choice most effectively uses relevant information from the notes to accomplish this goal?</p>`, options, answer: 0, sol, trap });
export default {
  topic: 'rhetorical-synthesis',
  items: [
    it('sat-rs-001', 2, 'emphasise a difference', ['The Atacama Desert in Chile is one of the driest places on Earth.', 'Some weather stations there have recorded almost no rain in decades.', 'The Amazon rainforest, also in South America, receives about 2,300 mm of rain a year.'], 'emphasise how different the rainfall is in two places in South America',
      ['While some stations in Chile\'s Atacama Desert have recorded almost no rain in decades, the Amazon rainforest receives about 2,300 mm a year.', 'The Atacama Desert is in Chile.', 'The Amazon rainforest receives about 2,300 mm of rain a year.', 'Both the Atacama Desert and the Amazon rainforest are in South America.'],
      '<p>The goal is a difference between two places. Only the first choice names both and contrasts their rainfall. The others mention one place or only a similarity.</p>', 'Choosing a true sentence that does not meet the stated goal.'),
    it('sat-rs-002', 3, 'introduce to a new audience', ['Hedy Lamarr (1914–2000) was a film actress.', 'During the Second World War, she co-invented a radio method called frequency hopping.', 'Frequency hopping made signals harder to jam.', 'Ideas from it are used today in Wi-Fi and Bluetooth.'], 'introduce Hedy Lamarr to an audience unfamiliar with her',
      ['Hedy Lamarr, a film actress, also co-invented frequency hopping, a radio method whose ideas are used today in Wi-Fi and Bluetooth.', 'Frequency hopping made signals harder to jam.', 'Wi-Fi and Bluetooth use ideas from frequency hopping.', 'Lamarr lived from 1914 to 2000.'],
      '<p>An introduction for people who do not know her should say who she was and why she matters. The first choice does both; the others leave out who she was or why she is notable.</p>'),
    it('sat-rs-003', 4, 'state a finding', ['Researchers tracked 600 adults for ten years.', 'Those who walked at least 7,000 steps a day had a 50% lower risk of early death than those who walked fewer.', 'Walking more than 10,000 steps a day gave little extra benefit.'], 'present the study\'s main finding about step counts',
      ['In a ten-year study of 600 adults, walking at least 7,000 steps a day was linked to a much lower risk of early death, with little extra benefit above 10,000 steps.', 'Researchers tracked 600 adults for ten years.', 'Walking is a popular form of exercise among adults.', 'Some adults walk more than 10,000 steps a day.'],
      '<p>The finding is the link between steps and risk. Only the first choice states it, with the useful limit at 10,000 steps.</p>'),
  ],
};
