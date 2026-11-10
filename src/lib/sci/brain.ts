// Brain map (#1306): the parts of the human brain, which division each belongs to, what each does, and everyday
// actions to match to a part. Standard school biology in fibub's own words. No DOM.

export type Division = 'forebrain' | 'midbrain' | 'hindbrain' | 'spinal cord' | 'gland';
export type Region = { id: string; name: string; division: Division; t10: string; t11: string };

export const REGIONS: Region[] = [
  { id: 'frontal', name: 'Frontal lobe (cerebrum)', division: 'forebrain',
    t10: 'Thinking, planning, deciding and solving problems. Its back strip sends the orders for movements you choose to make (voluntary actions).',
    t11: 'The motor area lies at its back edge; Broca\'s area (usually on the left) helps you form speech. Personality and self-control depend on it too.' },
  { id: 'parietal', name: 'Parietal lobe (cerebrum)', division: 'forebrain',
    t10: 'Feels touch, pain, heat and cold from the skin, and knows where your body parts are.',
    t11: 'Its front strip is the main sensory area: each part of the body has its own patch, and sensitive parts like the lips and fingers get the biggest patches.' },
  { id: 'temporal', name: 'Temporal lobe (cerebrum)', division: 'forebrain',
    t10: 'Hearing, and understanding and remembering what you hear.',
    t11: 'Holds the hearing (auditory) area and Wernicke\'s area for understanding language; deep inside, the hippocampus helps store new memories.' },
  { id: 'occipital', name: 'Occipital lobe (cerebrum)', division: 'forebrain',
    t10: 'Seeing: it makes sense of the signals from your eyes.',
    t11: 'The visual area. Signals from the left half of what you see go to the right occipital lobe, and the other way round.' },
  { id: 'hypothalamus', name: 'Hypothalamus', division: 'forebrain',
    t10: 'Deep inside. Keeps body temperature steady and controls hunger, thirst and sleep. It tells the pituitary gland what to do.',
    t11: 'It makes releasing hormones that control the pituitary, and makes ADH and oxytocin, which the back of the pituitary releases.' },
  { id: 'pituitary', name: 'Pituitary gland', division: 'gland',
    t10: 'A pea-sized gland hanging below the brain. It makes hormones such as growth hormone, and controls other glands.',
    t11: 'Front lobe: growth hormone, TSH, ACTH, FSH, LH, prolactin. Back lobe: releases ADH and oxytocin made in the hypothalamus.' },
  { id: 'midbrain', name: 'Midbrain', division: 'midbrain',
    t10: 'Joins the forebrain to the hindbrain. Controls reflex movements of the head, neck and eyes when you suddenly see or hear something.',
    t11: 'Its four small bumps (corpora quadrigemina) handle visual and hearing reflexes.' },
  { id: 'pons', name: 'Pons', division: 'hindbrain',
    t10: 'A bridge of nerve fibres that passes messages between parts of the brain. It helps control breathing.',
    t11: 'Links the cerebrum to the cerebellum and holds a breathing centre that works with the medulla.' },
  { id: 'medulla', name: 'Medulla', division: 'hindbrain',
    t10: 'Controls actions you do not think about (involuntary actions): heartbeat, blood pressure, breathing, swallowing, coughing, sneezing and vomiting.',
    t11: 'Holds the centres for breathing, heart rate and blood vessel tone, and for reflexes like coughing and vomiting. It joins the spinal cord.' },
  { id: 'cerebellum', name: 'Cerebellum', division: 'hindbrain',
    t10: 'Keeps your balance and posture and makes voluntary movements smooth and precise, like riding a bicycle or picking up a pencil.',
    t11: 'Compares the movement you meant with the one happening and corrects it; it stores skills you learn by practice.' },
  { id: 'cord', name: 'Spinal cord', division: 'spinal cord',
    t10: 'Carries messages between the brain and the body, and handles quick reflexes such as pulling your hand off something hot.',
    t11: 'Grey matter inside (cell bodies), white matter outside (nerve fibres); 31 pairs of spinal nerves leave it.' },
];

export type Scenario = { text: string; answer: string[] };
export const SCENARIOS: Scenario[] = [
  { text: 'You work out 17 × 6 in your head.', answer: ['frontal'] },
  { text: 'You decide to raise your hand in class.', answer: ['frontal'] },
  { text: 'You feel how cold an ice cube is.', answer: ['parietal'] },
  { text: 'You recognise your favourite song.', answer: ['temporal'] },
  { text: 'You read the words on this screen.', answer: ['occipital'] },
  { text: 'You feel thirsty after playing in the sun.', answer: ['hypothalamus'] },
  { text: 'Your body starts to sweat to cool down.', answer: ['hypothalamus'] },
  { text: 'You grow taller during your teens.', answer: ['pituitary'] },
  { text: 'Your eyes jump towards a sudden flash of light.', answer: ['midbrain'] },
  { text: 'Your heart beats faster without you deciding it.', answer: ['medulla'] },
  { text: 'You sneeze when dust gets up your nose.', answer: ['medulla'] },
  { text: 'You keep breathing while you sleep.', answer: ['medulla', 'pons'] },
  { text: 'You ride a bicycle without falling over.', answer: ['cerebellum'] },
  { text: 'You walk along a narrow wall without wobbling.', answer: ['cerebellum'] },
  { text: 'You pull your hand off a hot pan before you feel pain.', answer: ['cord'] },
];

export const regionById = (id: string) => REGIONS.find((r) => r.id === id);
export const DIVISIONS: Record<Division, string> = {
  forebrain: 'Forebrain: the main thinking part.',
  midbrain: 'Midbrain: a small link between the forebrain and hindbrain.',
  hindbrain: 'Hindbrain: controls actions you do not think about, and balance.',
  'spinal cord': 'Not part of the brain, but joined to it: together they make the central nervous system.',
  gland: 'A gland joined to the brain, not part of it. It is part of the hormone (endocrine) system.',
};
