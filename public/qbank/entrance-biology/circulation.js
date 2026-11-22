// NEET UG Biology: Body fluids and circulation (NCERT Class 11, Chapter 15). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const E = ['neet'];
const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [3, 0, 2, 1];
const nid = () => `bc-${String(++n).padStart(3, '0')}`;
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const ST = ['Both Statement I and Statement II are correct', 'Both Statement I and Statement II are incorrect', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct'];
function mc(level, sub, q, correct, wrongs, sol, trap, format = 'single') {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format, exams: E, sub, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function asr(level, sub, A, R, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'assertion', exams: E, sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function stm(level, sub, s1, s2, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'statements', exams: E, sub, q: `<b>Statement I:</b> ${s1}<br><b>Statement II:</b> ${s2}`, options: ST, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function match(level, sub, key, title, list1, list2, correct, wrongs, sol, trap) {
  groups[key] = { title, list1, list2 };
  const p = POS[pos++ % 4];
  const options = [...wrongs]; options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'match', exams: E, sub, group: key, q: 'Match List I with List II and choose the correct code.', options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function pass(key, title, passage) { groups[key] = { title, passage }; }
function pq(key, level, sub, q, correct, wrongs, sol, trap) {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'passage', exams: E, sub, group: key, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}

// ---------------------------------------------------------------- Level 1
mc(1, 'blood composition', 'Blood is a special connective tissue made of', 'plasma and formed elements', ['plasma and lymph', 'serum and platelets only', 'RBCs and WBCs only'], 'Blood has a fluid matrix, the plasma, and the formed elements (RBCs, WBCs and platelets).');
mc(1, 'blood composition', 'The most abundant formed elements in blood are the', 'erythrocytes', ['leucocytes', 'platelets', 'lymphocytes'], 'RBCs number about 5 to 5.5 million per cubic millimetre of blood. WBCs are 6000-8000 and platelets 1.5-3.5 lakh.');
mc(1, 'blood composition', 'The pigment that gives blood its red colour is', 'haemoglobin', ['chlorophyll', 'melanin', 'bilirubin'], 'RBCs contain haemoglobin, an iron-containing pigment.');
mc(1, 'blood composition', 'Platelets are also called', 'thrombocytes', ['erythrocytes', 'leucocytes', 'monocytes'], 'Platelets (thrombocytes) are fragments of megakaryocytes and help in clotting.');
mc(1, 'blood composition', 'Plasma is about what percentage water?', '90 to 92 per cent', ['10 to 12 per cent', '50 per cent', '99 per cent'], 'Plasma is a straw-coloured, viscous fluid with 90-92% water and 6-8% proteins.');
mc(1, 'blood groups', 'A person who has both A and B antigens on RBCs has blood group', 'AB', ['A', 'B', 'O'], 'Blood group AB has both antigens A and B and no antibodies in the plasma.');
mc(1, 'blood groups', 'The blood group called the universal donor is', 'O', ['A', 'AB', 'B'], 'Group O RBCs have no A or B antigen, so they can be given to others in the ABO system.');
mc(1, 'blood groups', 'The Rh factor was named after', 'the Rhesus monkey', ['Rhizobium', 'Rhesus fever', 'Rheumatism'], 'The Rh antigen was first found in the Rhesus monkey. About 80% of humans have it.');
mc(1, 'coagulation', 'The protein that forms the threads of a blood clot is', 'fibrin', ['fibrinogen', 'prothrombin', 'albumin'], 'Thrombin converts the soluble fibrinogen to fibrin threads, which form the network of the clot.');
mc(1, 'coagulation', 'The mineral ion needed for the clotting of blood is', 'calcium', ['sodium', 'potassium', 'iodine'], 'Calcium ions play a very important role in the clotting cascade.');
mc(1, 'lymph', 'The fluid that carries fats from the intestine is', 'lymph', ['bile', 'serum', 'saliva'], 'Fats are absorbed into lacteals in the intestinal villi and carried through lymph.');
mc(1, 'human heart', 'The human heart has', 'four chambers', ['two chambers', 'three chambers', 'five chambers'], 'Two upper atria and two lower ventricles.');
mc(1, 'human heart', 'The membranous bag that covers the heart is the', 'pericardium', ['pleura', 'peritoneum', 'meninges'], 'The heart is protected by a double-walled bag, the pericardium, with pericardial fluid inside.');
mc(1, 'human heart', 'The valve between the left atrium and left ventricle is the', 'bicuspid (mitral) valve', ['tricuspid valve', 'pulmonary valve', 'aortic valve'], 'The left side has a bicuspid valve and the right side a tricuspid valve.');
mc(1, 'cardiac cycle', 'The sound "lub" is produced by', 'the closure of the tricuspid and bicuspid valves', ['the closure of the semilunar valves', 'the opening of the aorta', 'the contraction of the atria'], 'The first sound is due to the closure of the AV valves at the start of ventricular systole. The second sound is due to the semilunar valves.');
mc(1, 'regulation of cardiac activity', 'The pacemaker of the heart is the', 'sino-atrial node', ['atrio-ventricular node', 'Purkinje fibres', 'bundle of His'], 'The SAN generates the highest number of action potentials, so it sets the heart rate.');
mc(1, 'ECG', 'The instrument used to record the electrical activity of the heart is the', 'electrocardiograph', ['sphygmomanometer', 'stethoscope', 'spirometer'], 'The graph that it draws is the ECG. A sphygmomanometer measures blood pressure.');
mc(1, 'disorders', 'Normal human blood pressure is about', '120/80 mm Hg', ['80/120 mm Hg', '140/90 mm Hg', '200/100 mm Hg'], '120 is the systolic and 80 is the diastolic pressure.');
mc(1, 'circulation types', 'Fishes have a heart with', 'two chambers', ['three chambers', 'four chambers', 'one chamber'], 'A fish heart has one atrium and one ventricle.');
mc(1, 'double circulation', 'Blood goes from the right ventricle to the lungs through the', 'pulmonary artery', ['pulmonary vein', 'aorta', 'vena cava'], 'The pulmonary artery carries deoxygenated blood from the right ventricle to the lungs.');
mc(1, 'blood composition', 'Plasma without the clotting factors is called', 'serum', ['lymph', 'tissue fluid', 'whole blood'], 'Serum is plasma from which fibrinogen and other clotting factors are removed.');

// ---------------------------------------------------------------- Level 2
mc(2, 'blood composition', 'The usual life span of a human red blood cell is about', '120 days', ['12 days', '10 years', '1 day'], 'RBCs live for about 120 days, after which they are destroyed in the spleen, the "graveyard" of RBCs.');
mc(2, 'blood composition', 'Mature mammalian RBCs are', 'biconcave and without a nucleus', ['spherical and nucleated', 'biconcave with a nucleus', 'irregular and nucleated'], 'Most mammalian RBCs lack a nucleus, which gives more space for haemoglobin.', 'Camel and llama RBCs are oval but still non-nucleated.');
mc(2, 'blood composition', 'The most numerous WBCs are the', 'neutrophils', ['lymphocytes', 'basophils', 'eosinophils'], 'Neutrophils make up about 60-65% of WBCs. Lymphocytes are 20-25%.');
mc(2, 'blood composition', 'The least numerous WBCs are the', 'basophils', ['eosinophils', 'monocytes', 'neutrophils'], 'Basophils are about 0.5-1% of WBCs.');
mc(2, 'blood composition', 'Which WBCs are phagocytic?', 'Neutrophils and monocytes', ['Lymphocytes and basophils', 'Eosinophils and basophils', 'Lymphocytes only'], 'Neutrophils and monocytes engulf foreign bodies. Lymphocytes (B and T) are for immune responses.');
mc(2, 'blood composition', 'Which blood cells release histamine, serotonin and heparin?', 'Basophils', ['Neutrophils', 'Monocytes', 'Lymphocytes'], 'Basophils secrete these substances and take part in inflammatory reactions.');
mc(2, 'blood composition', 'Platelets are produced from', 'megakaryocytes in the bone marrow', ['lymph nodes', 'the liver', 'the spleen'], 'Platelets are cell fragments of megakaryocytes. Their number is 1.5 to 3.5 lakh per mm<sup>3</sup>.');
mc(2, 'blood composition', 'Which plasma protein is mainly involved in blood coagulation?', 'Fibrinogen', ['Albumin', 'Globulin', 'Haemoglobin'], 'Fibrinogen is the clotting protein. Globulins are mainly for defence and albumins for osmotic balance.');
mc(2, 'blood groups', 'A person with blood group A has', 'antigen A on RBCs and anti-B antibodies in plasma', ['antigen B on RBCs and anti-A in plasma', 'both antigens and no antibodies', 'no antigens and anti-A only'], 'Group A: antigen A, antibody anti-B. Group B: antigen B, anti-A. AB: both antigens, no antibodies. O: no antigen, both antibodies.');
mc(2, 'blood groups', 'A person of blood group AB can receive blood of', 'A, B, AB and O', ['AB only', 'A and O only', 'O only'], 'AB has no antibodies against A or B, so it is the universal recipient (within the ABO system).');
mc(2, 'blood groups', 'A person with blood group O can receive blood only from', 'group O', ['group A', 'group B', 'group AB'], 'Group O plasma has both anti-A and anti-B, so only O RBCs are safe.');
mc(2, 'blood groups', 'Erythroblastosis foetalis can occur when the', 'mother is Rh-negative and the foetus is Rh-positive', ['mother is Rh-positive and the foetus is Rh-negative', 'both are Rh-negative', 'both are Rh-positive'], 'The mother makes anti-Rh antibodies after being exposed to Rh-positive foetal blood, and these cross the placenta in a later pregnancy.');
mc(2, 'blood groups', 'Erythroblastosis foetalis can be avoided by giving the mother', 'anti-Rh antibodies right after the first delivery', ['Rh antigen before the first delivery', 'vitamin K', 'iron tablets'], 'Anti-Rh antibodies destroy any foetal Rh-positive cells before the mother can form her own antibodies.');
mc(2, 'coagulation', 'The enzyme that changes prothrombin to thrombin is', 'thrombokinase (an enzyme complex)', ['fibrin', 'renin', 'pepsin'], 'A cascade of reactions with factors in the plasma makes the enzyme complex thrombokinase, which activates prothrombin.');
mc(2, 'coagulation', 'Thrombin converts', 'fibrinogen into fibrin', ['fibrin into fibrinogen', 'prothrombin into thrombokinase', 'albumin into globulin'], 'Thrombin is an active enzyme. It acts on the soluble fibrinogen to give insoluble fibrin threads.');
mc(2, 'coagulation', 'Injured tissues and platelets release factors that', 'start the clotting cascade', ['dissolve the clot', 'destroy fibrinogen', 'block thrombin'], 'These factors start the cascade that ends in a clot (coagulum).');
mc(2, 'lymph', 'Lymph differs from blood mainly because it', 'has no RBCs and has fewer proteins', ['has many RBCs', 'has no WBCs', 'is red in colour'], 'Lymph is a colourless fluid with specialised lymphocytes, but few proteins and no RBCs.');
mc(2, 'lymph', 'Which cells are found in good number in lymph?', 'Lymphocytes', ['Erythrocytes', 'Platelets', 'Neutrophils only'], 'Lymph contains lymphocytes, which are responsible for the immune responses of the body.');
mc(2, 'circulation types', 'Open circulation is found in', 'arthropods and molluscs', ['annelids', 'fishes', 'mammals'], 'In open circulation, blood is pumped into body cavities called sinuses. Annelids and chordates have closed circulation.');
mc(2, 'circulation types', 'In closed circulation the blood', 'flows only within blood vessels', ['flows through open spaces', 'flows through lymph vessels', 'is not pumped by a heart'], 'Closed circulation gives more precise control of the flow, and is found in annelids and chordates.');
mc(2, 'circulation types', 'Amphibians and most reptiles have a heart with', 'two atria and one ventricle', ['one atrium and one ventricle', 'two atria and two ventricles', 'one atrium and two ventricles'], 'Amphibians and reptiles (except crocodiles) have a 3-chambered heart, so oxygenated and deoxygenated blood mix in the ventricle.');
mc(2, 'circulation types', 'A fully four-chambered heart is found in', 'crocodiles, birds and mammals', ['amphibians and reptiles', 'fishes only', 'all vertebrates'], 'These three groups have two atria and two ventricles, with complete double circulation.');
mc(2, 'circulation types', 'In fishes, the blood passes through the heart', 'once in one complete circuit of the body (single circulation)', ['twice in one complete circuit', 'never', 'three times'], 'The heart pumps deoxygenated blood to the gills; oxygenated blood goes to the body and returns to the heart.');
mc(2, 'human heart', 'The heart is placed in the thoracic cavity', 'between the two lungs, slightly tilted to the left', ['behind the lungs', 'in the abdomen', 'on the right side'], 'It is protected by the pericardium and is about the size of a clenched fist.');
mc(2, 'human heart', 'Semilunar valves are present at the openings of', 'the aorta and the pulmonary artery', ['the vena cava', 'the pulmonary veins', 'the atrio-ventricular apertures'], 'They guard the exits of the ventricles and prevent backflow.');
mc(2, 'human heart', 'The sino-atrial node is located in the', 'upper right corner of the right atrium', ['lower left of the left ventricle', 'interventricular septum', 'left atrium'], 'The SAN is in the right upper corner of the right atrium. The AVN is in the lower left corner of the right atrium near the atrio-ventricular septum.');
mc(2, 'human heart', 'Purkinje fibres are found in the', 'walls of the ventricles', ['walls of the atria', 'aorta', 'vena cava'], 'The bundle of His divides into right and left bundles, which give off Purkinje fibres in the ventricular muscle.');
mc(2, 'cardiac cycle', 'The number of heartbeats per minute in a normal adult is about', '72', ['40', '120', '200'], 'The average heart rate is about 72 beats per minute and one cardiac cycle takes 0.8 s.');
mc(2, 'cardiac cycle', 'The stroke volume is', 'the volume of blood pumped out by each ventricle in one beat', ['the volume in the atrium', 'the blood pumped per minute', 'the total blood in the body'], 'Stroke volume is about 70 mL.');
mc(2, 'cardiac cycle', 'Cardiac output is the', 'stroke volume multiplied by the heart rate', ['stroke volume divided by the heart rate', 'heart rate alone', 'sum of the volumes of the four chambers'], 'CO = SV × HR. In an average person it is about 5 L per minute.');
mc(2, 'ECG', 'In an ECG, the P wave shows', 'depolarisation of the atria', ['depolarisation of the ventricles', 'repolarisation of the ventricles', 'closure of the valves'], 'The P wave leads to atrial contraction.');
mc(2, 'ECG', 'In an ECG, the T wave shows', 'repolarisation of the ventricles', ['depolarisation of the atria', 'depolarisation of the ventricles', 'repolarisation of the atria'], 'The T wave marks the return of the ventricles to the normal state and the end of systole.');
mc(2, 'double circulation', 'Blood from the intestine goes to the liver through the', 'hepatic portal vein', ['hepatic artery', 'renal vein', 'pulmonary vein'], 'The hepatic portal system carries the blood from the digestive tract to the liver before it returns to the heart.');
mc(2, 'regulation of cardiac activity', 'Sympathetic nerves to the heart', 'increase the heart rate and the strength of contraction', ['decrease the heart rate', 'stop the heart', 'have no effect on the heart'], 'The sympathetic nerves raise the rate of the heartbeat, the strength of ventricular contraction and so the cardiac output. The parasympathetic (vagus) nerves do the opposite.');
mc(2, 'regulation of cardiac activity', 'The hormone from the adrenal medulla that raises cardiac output is', 'adrenaline', ['insulin', 'thyroxine only', 'oxytocin'], 'Adrenal medullary hormones (adrenaline and noradrenaline) increase the cardiac output.');
mc(2, 'disorders', 'High blood pressure is also called', 'hypertension', ['hypotension', 'angina', 'arrhythmia'], 'A blood pressure of 140/90 mm Hg or more is high. It can harm the heart, brain and kidney.');
mc(2, 'disorders', 'Deposits of calcium, fat and cholesterol in the walls of the coronary arteries cause', 'coronary artery disease (atherosclerosis)', ['heart failure', 'angina only', 'hypotension'], 'The deposits narrow the lumen of the arteries, so the heart muscle gets less blood.');
mc(2, 'disorders', 'Pain in the chest because the heart muscle gets too little oxygen is called', 'angina pectoris', ['heart failure', 'cardiac arrest', 'hypertension'], 'Angina occurs when not enough oxygen reaches the heart muscle. It is common in middle-aged and elderly people.');
mc(2, 'disorders', 'Heart failure is the state in which', 'the heart cannot pump blood effectively enough to meet the needs of the body', ['the heart stops beating suddenly', 'the heart muscle dies suddenly', 'the blood pressure is only high'], 'Heart failure is sometimes called congestive heart failure because lung congestion is the main symptom.', 'It is not cardiac arrest or heart attack.');
mc(2, 'double circulation', 'The pulmonary veins carry', 'oxygenated blood from the lungs to the left atrium', ['deoxygenated blood from the lungs', 'oxygenated blood to the lungs', 'deoxygenated blood to the right atrium'], 'The pulmonary vein is the one vein in the body that carries oxygenated blood.');
mc(2, 'human heart', 'The thick wall between the right and left ventricles is the', 'interventricular septum', ['interatrial septum', 'atrio-ventricular septum', 'pericardium'], 'The ventricles are separated by a thick, muscular interventricular septum. The atria are separated by a thin interatrial septum.');

// ---------------------------------------------------------------- Level 3
mc(3, 'blood groups', 'A woman of group A marries a man of group B. Both are heterozygous. The possible blood groups of their children are', 'A, B, AB and O', ['A and B only', 'AB only', 'A and O only'], 'The woman is I<sup>A</sup>i and the man is I<sup>B</sup>i. The children can be I<sup>A</sup>I<sup>B</sup> (AB), I<sup>A</sup>i (A), I<sup>B</sup>i (B) or ii (O).', 'A mixed item with genetics: heterozygous parents give all four groups.');
mc(3, 'blood groups', 'A man with group O can donate blood without a reaction to', 'persons of all four groups (ABO system)', ['group O only', 'groups A and B only', 'group AB only'], 'O RBCs carry no A or B antigens, so recipient antibodies have nothing to attack. This is the universal donor.', 'Donor plasma is ignored in small transfusions.');
mc(3, 'blood groups', 'A patient of group B can safely receive red cells from', 'B and O', ['A and AB', 'A and O', 'AB and B'], 'The patient has anti-A in plasma. A and AB cells carry antigen A and would be attacked.');
mc(3, 'blood groups', 'Which statement is correct about Rh incompatibility?', 'It affects the second or later Rh-positive foetus of an Rh-negative mother', ['It affects the first child always', 'It affects an Rh-positive mother with an Rh-negative foetus', 'It occurs in Rh-negative mother and Rh-negative foetus'], 'At the first delivery, the mother is exposed to foetal blood and forms anti-Rh antibodies. In the next Rh-positive pregnancy these antibodies enter the foetal blood and destroy RBCs.', 'The first child is normally safe.');
mc(3, 'blood groups', 'The Rh antigen is present on the', 'surface of the RBCs', ['surface of WBCs', 'platelets', 'plasma proteins'], 'About 80 per cent of humans have the Rh antigen on their RBCs and are called Rh-positive.');
mc(3, 'blood groups', 'Which of the following correctly shows antibodies in the plasma of group B?', 'Anti-A', ['Anti-B', 'Anti-A and anti-B', 'None'], 'A person has the antibodies against the antigens that he lacks. Group B lacks A, so has anti-A.');
mc(3, 'coagulation', 'Which of these shows the correct order in blood clotting?', 'Thrombokinase, then prothrombin to thrombin, then fibrinogen to fibrin', ['Fibrinogen to fibrin, then prothrombin to thrombin', 'Thrombin, then thrombokinase, then fibrin', 'Fibrin, then fibrinogen, then prothrombin'], 'The enzyme complex thrombokinase activates prothrombin to thrombin; thrombin changes fibrinogen to fibrin, which forms the clot.', 'Order reversed in the usual wrong option.');
mc(3, 'coagulation', 'A clot (coagulum) contains', 'a network of fibrin threads with trapped dead and damaged formed elements', ['only fibrinogen', 'only platelets', 'plasma proteins without cells'], 'The clot is a fibrin network in which the dead and damaged formed elements are entangled.');
mc(3, 'coagulation', 'Why does blood not clot inside intact blood vessels?', 'The clotting factors stay in the inactive form unless injury or exposure to air occurs', ['Fibrinogen is absent in the vessels', 'Platelets are absent from vessels', 'Calcium is absent from plasma'], 'The factors in the plasma are in the inactive state and are activated only by injury.');
mc(3, 'blood composition', 'Which statement is NOT correct for RBCs?', 'They are formed in the spleen in an adult', ['They have haemoglobin', 'They are formed in red bone marrow in an adult', 'They are destroyed in the spleen'], 'In adults RBCs are formed in the red bone marrow. The spleen is where they are destroyed.');
mc(3, 'blood composition', 'The normal haemoglobin content of blood is about', '12 to 16 g per 100 mL', ['1 to 2 g per 100 mL', '40 to 50 g per 100 mL', '80 to 90 g per 100 mL'], 'In a healthy person there are 12-16 g of haemoglobin in every 100 mL of blood.');
mc(3, 'blood composition', 'Which one is an incorrect pair of WBC and function?', 'Eosinophil : makes antibodies', ['Neutrophil : phagocytosis', 'Basophil : releases histamine', 'Lymphocyte : immune response'], 'Eosinophils resist infections and are involved in allergic reactions. Antibodies come from B lymphocytes (plasma cells).');
mc(3, 'blood composition', 'The sequence of WBCs in the order of their decreasing number is', 'neutrophils, lymphocytes, monocytes, eosinophils, basophils', ['lymphocytes, neutrophils, monocytes, basophils, eosinophils', 'neutrophils, monocytes, lymphocytes, eosinophils, basophils', 'monocytes, neutrophils, lymphocytes, basophils, eosinophils'], 'Neutrophils 60-65%, lymphocytes 20-25%, monocytes 6-8%, eosinophils 2-3%, basophils 0.5-1%.', 'Never Let Monkeys Eat Bananas.');
mc(3, 'lymph', 'Which of these is a function of lymph?', 'It returns tissue fluid to the blood and carries absorbed fats', ['It carries oxygen as oxyhaemoglobin', 'It clots like blood', 'It carries RBCs to the tissues'], 'Lymph (a part of tissue fluid) drains into veins and carries fats from the intestine through lacteals.');
mc(3, 'circulation types', 'Which of these animals has a 3-chambered heart with mixed blood?', 'Frog', ['Crocodile', 'Pigeon', 'Rabbit'], 'Frogs have two atria and one ventricle, so blood mixes. Crocodiles are an exception among reptiles with four chambers.');
mc(3, 'circulation types', 'Which group has a single circulation?', 'Fishes', ['Amphibians', 'Birds', 'Mammals'], 'In fishes the blood passes once through the heart in a complete circuit. Others have double circulation.');
mc(3, 'human heart', 'The atrio-ventricular node is stimulated by', 'the impulse spreading from the SAN through the atria', ['the Purkinje fibres', 'the vagus nerve only', 'the pulmonary artery'], 'After the SAN fires, the atria contract, and the AVN picks up the impulse and sends it through the bundle of His.');
mc(3, 'human heart', 'The correct path of the conduction impulse in the heart is', 'SAN, AVN, AV bundle (His), bundle branches, Purkinje fibres', ['AVN, SAN, Purkinje fibres, bundle of His', 'SAN, Purkinje fibres, AVN, bundle of His', 'Purkinje fibres, bundle of His, AVN, SAN'], 'This is the order in which the action potential travels from the atria to the ventricles.');
mc(3, 'human heart', 'Which statement about the heart valves is correct?', 'The valves allow the flow of blood in only one direction', ['The tricuspid valve is on the left side', 'Semilunar valves are between atrium and ventricle', 'The bicuspid valve has three flaps'], 'The tricuspid is on the right, the bicuspid on the left, and semilunar valves guard the two great arteries.');
mc(3, 'cardiac cycle', 'In a person with a heart rate of 75 beats per minute, one cardiac cycle lasts', '0.8 s', ['0.75 s', '1.25 s', '0.075 s'], 'Time per beat = 60/75 = 0.8 s.');
mc(3, 'cardiac cycle', 'A person has a stroke volume of 70 mL and a heart rate of 72 beats per minute. The cardiac output is about', '5 L per minute', ['0.5 L per minute', '50 L per minute', '1 L per minute'], '70 × 72 = 5040 mL, about 5 L per minute.');
mc(3, 'cardiac cycle', 'The atrial systole increases the filling of the ventricles by about', '30 per cent', ['3 per cent', '70 per cent', '100 per cent'], 'Most ventricular filling happens in joint diastole; the atrial systole adds nearly 30%.');
mc(3, 'cardiac cycle', 'The semilunar valves open when', 'the ventricular pressure rises above the pressure in the aorta and pulmonary artery', ['the atria contract', 'the ventricular pressure falls', 'the AV valves open'], 'The rising pressure of ventricular systole first closes the AV valves and then forces the semilunar valves open.');
mc(3, 'cardiac cycle', 'The second heart sound (dup) is produced at', 'the closure of the semilunar valves at the end of ventricular systole', ['the opening of the AV valves', 'the start of atrial contraction', 'the flow of blood in the vena cava'], 'When the ventricles relax, the pressure falls, and blood tends to flow back and closes the semilunar valves.');
mc(3, 'ECG', 'The QRS complex of the ECG represents', 'depolarisation of the ventricles, which starts ventricular contraction', ['repolarisation of the atria', 'repolarisation of the ventricles', 'depolarisation of the atria'], 'The end of the QRS complex marks the beginning of the ventricular systole.');
mc(3, 'ECG', 'The end of the T wave marks', 'the end of ventricular systole', ['the start of atrial systole', 'the start of ventricular systole', 'the closure of the AV valves'], 'The T wave is the return of the ventricles to the normal state, so its end is the end of systole.');
mc(3, 'ECG', 'The heart rate can be found from an ECG by', 'counting the number of QRS complexes in a minute', ['counting the P waves in a minute only', 'measuring the height of the T wave', 'measuring the PR segment'], 'The number of QRS complexes, which is also the number of ventricular beats, gives the heart rate.');
mc(3, 'ECG', 'Where are the electrodes attached for the standard ECG as per NCERT?', 'One at each wrist and one at the left ankle', ['Both ankles and the forehead', 'Both wrists and the neck', 'Chest only'], 'The patient is connected to the machine with three electrical leads: one to each wrist and one to the left ankle.');
mc(3, 'double circulation', 'Which statement is correct for systemic circulation?', 'Oxygenated blood leaves the left ventricle by the aorta, and deoxygenated blood returns to the right atrium by the vena cava', ['Oxygenated blood leaves the right ventricle', 'It carries blood from the heart to the lungs', 'Blood returns to the left atrium by the vena cava'], 'Systemic: LV, aorta, body, vena cava, RA. Pulmonary: RV, pulmonary artery, lungs, pulmonary veins, LA.');
mc(3, 'double circulation', 'The coronary circulation supplies blood to the', 'heart muscle itself', ['lungs', 'brain', 'kidney'], 'A special system of coronary vessels supplies the cardiac muscles with blood and oxygen.');
mc(3, 'regulation of cardiac activity', 'Which centre of the brain regulates the cardiac function through the autonomic nervous system?', 'Medulla oblongata', ['Cerebrum', 'Cerebellum', 'Pons only'], 'The cardiac centre in the medulla oblongata acts through sympathetic and parasympathetic nerves.');
mc(3, 'regulation of cardiac activity', 'Parasympathetic (vagal) stimulation of the heart', 'decreases the heart rate and the speed of conduction', ['increases the cardiac output', 'increases the stroke volume only', 'has no effect'], 'The parasympathetic neural signals reduce the heart rate, the speed of conduction of the action potential and thus the cardiac output.');
mc(3, 'disorders', 'A blood pressure reading of 140/90 mm Hg means', 'systolic 140 and diastolic 90, which is high', ['diastolic 140 and systolic 90', 'normal blood pressure', 'low blood pressure'], 'The first number is systolic. 140/90 or above indicates hypertension.', 'The first number is the larger.');
mc(3, 'disorders', 'The pulse pressure of a person with a blood pressure of 120/80 mm Hg is', '40 mm Hg', ['200 mm Hg', '80 mm Hg', '100 mm Hg'], 'Pulse pressure is the difference between the systolic and diastolic pressures: 120 - 80 = 40.');
mc(3, 'disorders', 'Which of these is a correct statement about heart failure?', 'It is not the same as cardiac arrest', ['It is the sudden stop of the heartbeat', 'It is the same as a heart attack', 'It affects only the veins'], 'In heart failure the heart is not pumping effectively; in cardiac arrest the heart stops, and in heart attack the muscle is suddenly damaged.');
mc(3, 'disorders', 'Atherosclerosis mainly affects the', 'lumen of the arteries supplying the heart, narrowing it', ['pulmonary veins', 'valves of the veins', 'lymph vessels'], 'Coronary artery disease (CAD) is a narrowing from deposits of calcium, fat, cholesterol and fibrous tissue.');
mc(3, 'blood composition', 'A person is anaemic. This means the person has', 'a low amount of haemoglobin or fewer RBCs', ['too many platelets', 'too little plasma protein only', 'too many neutrophils'], 'Low haemoglobin means low oxygen-carrying capacity of the blood.');
mc(3, 'cardiac cycle', 'In a cardiac cycle of 0.8 s, the ventricular systole lasts about', '0.3 s', ['0.1 s', '0.4 s', '0.8 s'], 'In the usual division the atrial systole is 0.1 s, the ventricular systole 0.3 s and the joint diastole 0.4 s (total 0.8 s).', 'Joint diastole is the longest at 0.4 s.');
mc(3, 'cardiac cycle', 'Which valves are closed during the ventricular systole when the ventricles are building up pressure, just before the blood is ejected?', 'All valves are closed for a brief moment', ['Only the AV valves are open', 'Only the semilunar valves are open', 'All valves are open'], 'First the AV valves close due to pressure and the semilunar valves are still shut until the pressure exceeds that in the arteries. Then they open.');

// ---------------------------------------------------------------- Level 4
mc(4, 'blood groups', 'A baby of group O is born to a mother of group A. The father could be of group', 'A, B or O but not AB', ['A or B only', 'AB only', 'O only'], 'The baby is ii, so each parent gave i. The mother is I<sup>A</sup>i. The father must carry i, so he can be A (I<sup>A</sup>i), B (I<sup>B</sup>i) or O (ii) but not AB.', 'AB father cannot have a group O child.');
mc(4, 'blood groups', 'In a transfusion of group A blood to a group B patient, the reaction will be', 'agglutination of the donor RBCs by anti-A in the recipient plasma', ['agglutination of the recipient cells by donor anti-B', 'no reaction', 'haemolysis of platelets only'], 'The recipient (group B) has anti-A. Donor cells have antigen A, so they clump.');
mc(4, 'blood groups', 'An Rh-negative mother with an Rh-negative foetus', 'has no risk of erythroblastosis foetalis', ['has risk in the first child', 'will make anti-Rh antibodies', 'has risk in every pregnancy'], 'There is no Rh antigen on foetal cells, so there is no stimulus for the mother to make anti-Rh antibodies.');
mc(4, 'blood groups', 'Which blood group combination of mother (M) and foetus (F) can lead to erythroblastosis foetalis in the second pregnancy?', 'M: Rh-negative, F: Rh-positive', ['M: Rh-positive, F: Rh-positive', 'M: Rh-negative, F: Rh-negative', 'M: Rh-positive, F: Rh-negative'], 'The mother must be Rh-negative and have been sensitised by an earlier Rh-positive foetus.', 'Mother and foetus are mixed up.');
mc(4, 'coagulation', 'A person lacks calcium ions in the blood. Which step of clotting is likely to fail?', 'Formation of thrombin from prothrombin by the enzyme complex', ['Formation of RBCs', 'Production of fibrinogen from the lungs', 'Release of histamine'], 'Calcium ions are needed in the cascade, so thrombin is not made normally and the clot fails.');
mc(4, 'coagulation', 'A blood sample is collected in a tube with a substance that removes calcium ions. The sample', 'will not clot', ['will clot faster', 'will turn into serum at once', 'will lose its RBCs'], 'Without calcium the cascade cannot go forward. (This is how anticoagulants like citrate work.)');
mc(4, 'blood composition', 'Which of these is the correct feature of serum?', 'It is plasma without fibrinogen and other clotting factors', ['It contains platelets', 'It contains RBCs', 'It is formed in the lymph nodes'], 'Serum forms when blood clots and the clot is removed.', 'Serum and plasma are not the same.');
mc(4, 'blood composition', 'Which pair has an equal approximate count per mm<sup>3</sup> of blood?', 'None; the counts are RBC > platelets > WBC', ['RBCs and WBCs', 'WBCs and platelets', 'RBCs and platelets'], 'RBC 5-5.5 million, platelets 1.5-3.5 lakh, WBCs 6000-8000 per mm<sup>3</sup>. All three are different.');
mc(4, 'circulation types', 'Which is the correct statement?', 'A 3-chambered heart of amphibians gives mixed blood to the body', ['Fishes have a 3-chambered heart', 'Birds have mixed blood in the ventricle', 'Crocodiles have a 2-chambered heart'], 'In the single ventricle of an amphibian, oxygenated and deoxygenated blood mix.');
mc(4, 'circulation types', 'In an open circulatory system the blood', 'is pumped by the heart into sinuses, where it directly bathes the tissues', ['is pumped into capillaries only', 'never leaves the heart', 'flows only through veins'], 'Arthropods and molluscs have open circulation. The blood flows into open spaces (haemocoel).');
mc(4, 'human heart', 'Atrial muscles contract and ventricles are in diastole just after', 'the P wave of the ECG', ['the T wave', 'the QRS complex', 'the second heart sound'], 'P wave: atrial depolarisation leading to atrial systole. After QRS the ventricles begin to contract.');
mc(4, 'human heart', 'Which of the following has the maximum rate of generating action potentials and so is the pacemaker?', 'SAN, about 70 to 75 per minute', ['AVN', 'Purkinje fibres', 'Bundle of His'], 'The SAN is the fastest nodal tissue; the other nodal parts would give lower rates if the SAN failed.');
mc(4, 'human heart', 'Why is the left ventricular wall much thicker than the right?', 'It pumps blood to the whole body at higher pressure, while the right pumps only to the lungs', ['It has more valves', 'It has a smaller volume', 'It holds the AVN'], 'The systemic circuit is longer and needs more force than the pulmonary circuit, so the left ventricle is more muscular.');
mc(4, 'cardiac cycle', 'A person has an end-diastolic volume of 120 mL and an end-systolic volume of 50 mL. The stroke volume is', '70 mL', ['50 mL', '120 mL', '170 mL'], 'Stroke volume = EDV - ESV = 120 - 50 = 70 mL.', 'Adding instead of subtracting.');
mc(4, 'cardiac cycle', 'In the cardiac cycle, the correct sequence of events is', 'atrial systole, ventricular systole, ventricular diastole', ['ventricular systole, atrial systole, ventricular diastole', 'atrial systole, ventricular diastole, ventricular systole', 'ventricular diastole, ventricular systole, atrial systole'], 'The atria contract first, and the impulse then spreads to the ventricles. The ventricles relax at the end.');
mc(4, 'cardiac cycle', 'Which is an effect of the closure of the AV valves at the start of ventricular systole?', 'It prevents the backflow of blood into the atria and produces the first sound', ['It opens the aorta', 'It produces the second sound', 'It begins the atrial diastole only'], 'The first sound (lub) is from the AV valve closure.');
mc(4, 'ECG', 'In a person with a regular heartbeat, the R-R interval on the ECG is 0.8 s. The heart rate is', '75 beats per minute', ['60 beats per minute', '80 beats per minute', '48 beats per minute'], 'Heart rate = 60 / R-R interval = 60/0.8 = 75 per minute.', 'Mistaking 0.8 for 80.');
mc(4, 'ECG', 'Which part of the ECG shows an event that leads directly to the atrial systole?', 'P wave', ['QRS complex', 'T wave', 'The flat line after T'], 'The P wave shows the atrial depolarisation, which leads to contraction.');
mc(4, 'ECG', 'In an ECG there is no P wave but QRS and T waves are present. This most likely shows', 'a problem in the atrial activity or the SAN', ['a problem in ventricular repolarisation only', 'a high blood pressure', 'a block of the aorta'], 'The P wave shows the atrial depolarisation that comes from the SAN. QRS and T waves show the ventricles are working.');
mc(4, 'double circulation', 'Which of the following correctly shows the pulmonary circulation?', 'Right ventricle, pulmonary artery, lungs, pulmonary veins, left atrium', ['Left ventricle, pulmonary artery, lungs, pulmonary veins, right atrium', 'Right atrium, aorta, lungs, vena cava, left ventricle', 'Right ventricle, aorta, lungs, pulmonary veins, left atrium'], 'Pulmonary circulation links the right ventricle to the left atrium through the lungs.');
mc(4, 'double circulation', 'Hepatic portal circulation is unusual because', 'a vein carries blood from one capillary network (intestine) to another (liver)', ['an artery joins two veins', 'it bypasses the liver', 'it carries oxygenated blood only'], 'A portal system is a vein that begins and ends in capillaries.');
mc(4, 'regulation of cardiac activity', 'Which factor raises the cardiac output in exercise?', 'Sympathetic stimulation and adrenal medullary hormones', ['Vagal stimulation', 'Decrease in SAN activity', 'Lowering of stroke volume'], 'Both increase the heart rate and the force of ventricular contraction.');
mc(4, 'disorders', 'Which one of these is TRUE of angina and heart attack?', 'Angina is chest pain from too little oxygen to the heart muscle, while a heart attack is sudden damage of heart muscle from inadequate blood supply', ['Both are the same condition', 'Angina is a stop of heartbeat', 'A heart attack is high blood pressure'], 'Angina is a warning; the muscle is not yet dead. Heart attack is sudden damage to the muscle.');
mc(4, 'disorders', 'Which of the following can be a cause of high blood pressure damaging vital organs?', 'Long-term hypertension harms the heart, brain and kidney', ['It only affects the lungs', 'It is always harmless', 'It affects only the skin'], 'High pressure strains the vessel walls and the heart, and affects organs like the brain and kidney.');
mc(4, 'disorders', 'Which of the following is NOT a feature of CAD?', 'Widening of the lumen of the coronary arteries', ['Deposition of cholesterol', 'Deposition of calcium', 'Narrowing of arteries'], 'In CAD (atherosclerosis) the lumen becomes narrow, not wide.');
mc(4, 'blood composition', 'The graveyard of RBCs is the', 'spleen', ['liver only', 'kidney', 'bone marrow'], 'Old RBCs are removed in the spleen. Red bone marrow makes them.');
mc(4, 'blood composition', 'Which of these statements about WBCs is correct?', 'They are colourless because they lack haemoglobin and they are nucleated', ['They are red and non-nucleated', 'They are the most abundant', 'They are fragments of megakaryocytes'], 'Leucocytes are colourless, nucleated and fewer than RBCs. Platelets come from megakaryocytes.');
mc(4, 'lymph', 'Which statement about lymph is correct?', 'It is a colourless fluid that carries nutrients and hormones and has specialised lymphocytes', ['It contains many RBCs', 'It flows from the heart to the tissues', 'It is rich in haemoglobin'], 'The lymph is an important carrier of nutrients, hormones and fats, and it is rich in lymphocytes.');

// ---------------------------------------------------------------- Level 5
mc(5, 'blood groups', 'A man of group AB marries a woman of group O. What groups can their children have?', 'A or B only', ['AB or O', 'A, B, AB or O', 'O only'], 'Father I<sup>A</sup>I<sup>B</sup>, mother ii. Children: I<sup>A</sup>i (A) or I<sup>B</sup>i (B). No AB and no O.', 'Many pick O or AB.');
mc(5, 'blood groups', 'A mother of group O, Rh-negative has a baby of group A, Rh-positive. The mother', 'can make anti-Rh antibodies, but the ABO difference between her and the baby is a separate matter', ['cannot make any antibodies', 'will make only anti-A', 'has no risk at all'], 'The mother is Rh-negative and the baby Rh-positive, so anti-Rh formation is possible and a later Rh-positive foetus is at risk. ABO and Rh are separate systems.', 'Two systems at once.');
mc(5, 'coagulation', 'Which of the following correctly arranges the clotting events: (1) fibrinogen to fibrin, (2) injury and release of factors, (3) prothrombin to thrombin, (4) formation of thrombokinase?', '2, 4, 3, 1', ['2, 3, 4, 1', '4, 2, 3, 1', '1, 3, 4, 2'], 'Injury leads to release of factors, thrombokinase forms, it changes prothrombin to thrombin, and thrombin changes fibrinogen to fibrin.', 'Thrombin and thrombokinase look alike.');
mc(5, 'blood composition', 'Which of the following WBC types have granules in the cytoplasm and are produced in bone marrow, as per NCERT?', 'Neutrophils, eosinophils and basophils', ['Lymphocytes and monocytes', 'Monocytes only', 'Lymphocytes only'], 'Granulocytes (neutrophils, eosinophils, basophils) have a granular cytoplasm. Lymphocytes and monocytes are agranulocytes.', 'This goes slightly beyond NCERT; the three names are in NCERT.');
mc(5, 'cardiac cycle', 'A student has a stroke volume of 60 mL and a heart rate of 80 beats per minute. In an hour, how many litres of blood does the left ventricle pump?', '288 L', ['4.8 L', '28.8 L', '2880 L'], 'CO = 60 × 80 = 4800 mL per minute. In 60 minutes: 4800 × 60 = 288000 mL = 288 L.', 'Unit slips between mL and L.');
mc(5, 'cardiac cycle', 'Which statement about the cardiac cycle is correct?', 'At the time of the first heart sound the AV valves close and the semilunar valves have not yet opened', ['The semilunar valves are open during joint diastole', 'The atria and ventricles contract together', 'The AV valves are closed during joint diastole'], 'In joint diastole the AV valves are open and the semilunar valves are closed. The atria and ventricles do not contract together.', 'Joint diastole has open AV valves.');
mc(5, 'cardiac cycle', 'At which point in the cycle are both the AV and the semilunar valves closed?', 'Just after the closure of the AV valves in early ventricular systole, and just after the aortic valve closes in early diastole', ['During atrial systole', 'During joint diastole', 'Never'], 'For a very short time the ventricle is a closed chamber at the start of systole and at the start of diastole (isovolumetric phases).', 'Slightly beyond NCERT text; consistent with the cycle description.');
mc(5, 'ECG', 'An ECG shows 12 QRS complexes in a recording of 10 seconds. The heart rate per minute is', '72', ['120', '12', '60'], 'Rate = 12 × (60/10) = 72 beats per minute.', 'Forgetting to scale to one minute.');
mc(5, 'ECG', 'If the QRS complexes of an ECG are 0.75 s apart, the person\'s cardiac output with stroke volume 70 mL is', '5.6 L per minute', ['4.2 L per minute', '5.0 L per minute', '7.0 L per minute'], 'Heart rate = 60/0.75 = 80 per minute. CO = 70 × 80 = 5600 mL = 5.6 L per minute.', 'Two-step: interval to rate, then CO.');
mc(5, 'double circulation', 'In which blood vessel does the blood have the least oxygen saturation among the following?', 'Pulmonary artery', ['Pulmonary vein', 'Aorta', 'Coronary artery'], 'The pulmonary artery carries deoxygenated blood to the lungs. The pulmonary vein carries oxygenated blood.', 'Arteries are not always oxygenated.');
mc(5, 'circulation types', 'Which of these correctly pairs the animal with its circulation?', 'Cockroach: open; earthworm: closed; fish: single closed', ['Cockroach: closed; earthworm: open', 'Fish: double; frog: single', 'Earthworm: open; frog: open'], 'Insects (arthropods) have open circulation; annelids and chordates have closed circulation; fishes have single circulation.');
mc(5, 'regulation of cardiac activity', 'Which of these actions would NOT raise the heart rate?', 'Increased vagal stimulation', ['Sympathetic stimulation', 'Adrenaline release', 'Noradrenaline release'], 'The vagus (parasympathetic) nerve slows the heart. The others speed it.');
mc(5, 'disorders', 'How many of these are true? (a) Heart failure is also called congestive heart failure. (b) Cardiac arrest means the heart stops beating. (c) A heart attack is damage of the heart muscle from low blood supply. (d) Angina is caused by too much oxygen to the heart.', 'Three', ['Two', 'Four', 'One'], '(a), (b) and (c) are correct. (d) is wrong: angina is caused by too little oxygen.', 'Statements are all nearly right.', 'statements');
mc(5, 'blood groups', 'Which of the following is correct?', 'Group AB has no plasma antibody against A or B, while group O has both', ['Group AB has both antibodies', 'Group O has no antibodies', 'Group A has anti-A'], 'AB has both antigens and no antibodies. O has no antigens and both antibodies. Nobody has an antibody against their own antigen.');

// ---------------------------------------------------------------- Assertion-Reason
asr(2, 'blood composition', 'Mammalian RBCs can carry a large amount of oxygen.', 'Mature mammalian RBCs have no nucleus and are filled with haemoglobin.', 0, 'Lack of a nucleus leaves more space for haemoglobin, which carries the oxygen. R explains A.');
asr(2, 'blood groups', 'Group O persons are called universal donors.', 'The RBCs of group O have both A and B antigens.', 2, 'A is true. R is false: the RBCs of group O have neither A nor B antigen, which is why they are safe to give.');
asr(3, 'coagulation', 'Blood does not clot inside the healthy blood vessels.', 'The clotting factors are present in the inactive form in the plasma.', 0, 'The factors become active only after injury or exposure to air. R explains A.');
asr(3, 'circulation types', 'In amphibians the oxygenated and deoxygenated blood mix in the heart.', 'The amphibian heart has only one ventricle.', 0, 'The 3-chambered heart has a single ventricle in which the blood from both atria mixes. R explains A.');
asr(3, 'cardiac cycle', 'The first heart sound is heard at the start of ventricular systole.', 'It is produced by the closure of the semilunar valves.', 2, 'A is true. The first sound is from the closure of the tricuspid and bicuspid valves. The semilunar valves give the second sound.', 'First and second sounds reversed.');
asr(3, 'human heart', 'The SAN is called the pacemaker of the heart.', 'The SAN can generate the maximum number of action potentials per minute.', 0, 'The nodal tissue with the highest rate sets the rhythm, so SAN is the pacemaker. R explains A.');
asr(4, 'ECG', 'The ventricular systole begins at the end of the QRS complex.', 'The QRS complex represents the depolarisation of the ventricles.', 0, 'Depolarisation of the ventricles starts their contraction, so R is the reason. R explains A.');
asr(4, 'blood groups', 'Erythroblastosis foetalis is rare in the first pregnancy of an Rh-negative woman.', 'Anti-Rh antibodies are formed in the mother only after exposure to Rh-positive foetal blood, mostly at delivery.', 0, 'The foetal RBCs mix with the mother\'s blood at delivery, so antibodies appear late. R explains A.');
asr(4, 'double circulation', 'The pulmonary vein carries oxygenated blood.', 'All veins carry deoxygenated blood.', 2, 'A is true. R is false: veins carry deoxygenated blood only in the systemic system; the pulmonary veins carry oxygenated blood.', 'Vein and deoxygenated are not synonyms.');
asr(5, 'disorders', 'Coronary artery disease can lead to angina.', 'In CAD the lumen of the coronary arteries is narrowed, so the heart muscle gets less oxygen.', 0, 'Reduced oxygen supply to the heart muscle causes angina. R explains A.');
asr(5, 'regulation of cardiac activity', 'The heart can beat even when it is removed from the body for a short time in suitable conditions.', 'The heart is myogenic, since its nodal tissue is autoexcitable.', 0, 'The nodal tissue can produce action potentials without any external stimulus, so the heart has its own rhythm. R explains A.');
asr(5, 'lymph', 'Lymph carries absorbed fats from the intestine.', 'The lymph vessels in the villi are called lacteals.', 0, 'The fats are absorbed into the lacteals and carried by the lymph. R explains A.');

// ---------------------------------------------------------------- Statements
stm(2, 'blood composition', 'RBCs are the most abundant formed elements of blood.', 'Platelets are formed from megakaryocytes.', 0, 'Both are correct.');
stm(2, 'circulation types', 'Fishes have a two-chambered heart.', 'Birds have a three-chambered heart.', 2, 'I is correct. II is wrong: birds have a 4-chambered heart.');
stm(3, 'blood groups', 'Group A has antigen A and anti-B antibody.', 'Group AB has both antigens and both antibodies.', 2, 'I is correct. II is wrong: AB has no antibodies.', 'AB: antigens yes, antibodies no.');
stm(3, 'cardiac cycle', 'The heart rate is about 72 beats per minute.', 'The cardiac cycle lasts about 0.8 s.', 0, 'Both are correct and consistent: 60/72 is about 0.83 s, which NCERT gives as 0.8 s.');
stm(3, 'ECG', 'The P wave represents atrial depolarisation.', 'The T wave represents depolarisation of the ventricles.', 2, 'I is correct. II is wrong: T is repolarisation of the ventricles.');
stm(3, 'disorders', 'High blood pressure is 140/90 mm Hg or more.', 'Normal blood pressure is 120/80 mm Hg, where 80 is the systolic value.', 2, 'I is correct. II is wrong: 120 is systolic and 80 is diastolic.');
stm(4, 'coagulation', 'Thrombin converts fibrinogen into fibrin.', 'Prothrombin is converted into thrombin by the enzyme complex thrombokinase.', 0, 'Both are correct steps of the cascade.');
stm(4, 'human heart', 'The AVN lies in the lower left corner of the right atrium.', 'The SAN lies in the upper right corner of the left atrium.', 2, 'I is correct. II is wrong: the SAN is in the upper right corner of the right atrium.');
stm(4, 'regulation of cardiac activity', 'Parasympathetic nerves decrease the heart rate.', 'Hormones of the adrenal medulla decrease the cardiac output.', 2, 'I is correct. II is wrong: they raise the cardiac output.');
stm(4, 'lymph', 'Lymph is a colourless fluid containing lymphocytes.', 'Lymph carries oxygen mainly as oxyhaemoglobin.', 2, 'I is correct. II is wrong: lymph has no RBCs.');
stm(5, 'circulation types', 'Crocodiles have a four-chambered heart.', 'All reptiles have a three-chambered heart.', 2, 'I is correct. II is wrong: crocodiles are the exception among reptiles.', 'NCERT says reptiles except crocodiles.');
mc(4, 'mixed', 'Which of the following are correct? (a) Only mammals have a 4-chambered heart. (b) Arthropods have open circulation. (c) Annelids have closed circulation. (d) Frogs have double circulation. How many are correct?', 'Three', ['Two', 'One', 'Four'], '(a) is false: birds and crocodiles also have 4 chambers. (b), (c), (d) are true. Frogs have an incomplete double circulation.', 'Frogs still have double circulation, though incomplete.', 'statements');

// ---------------------------------------------------------------- Matching
match(2, 'blood composition', 'm1', 'WBCs and their roles',
  ['A. Neutrophils', 'B. Basophils', 'C. Eosinophils', 'D. Lymphocytes'],
  ['p. Resist infections and allergic reactions', 'q. Phagocytosis', 'r. Release histamine, serotonin and heparin', 's. Immune responses (B and T cells)'],
  'A-q, B-r, C-p, D-s', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-p, B-r, C-q, D-s'],
  'Neutrophils phagocytose (q), basophils release histamine and heparin (r), eosinophils resist infection and allergy (p), lymphocytes do the immune response (s).');
match(3, 'blood groups', 'm2', 'Blood groups and their features',
  ['A. Group A', 'B. Group B', 'C. Group AB', 'D. Group O'],
  ['p. Antigen A, anti-B', 'q. Antigen B, anti-A', 'r. Both antigens, no antibodies', 's. No antigen, both antibodies'],
  'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
  'A has antigen A and anti-B (p). B has antigen B and anti-A (q). AB has both antigens and no antibodies (r). O has none, with both antibodies (s).');
match(3, 'ECG', 'm3', 'ECG waves and the events',
  ['A. P wave', 'B. QRS complex', 'C. T wave', 'D. End of the T wave'],
  ['p. Repolarisation of the ventricles', 'q. Depolarisation of the atria', 'r. Depolarisation of the ventricles', 's. End of ventricular systole'],
  'A-q, B-r, C-p, D-s', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-p, B-r, C-q, D-s'],
  'P: atrial depolarisation (q). QRS: ventricular depolarisation (r). T: ventricular repolarisation (p). End of T: end of ventricular systole (s).');
match(4, 'circulation types', 'm4', 'Animals and their hearts',
  ['A. Fish', 'B. Frog', 'C. Crocodile', 'D. Cockroach'],
  ['p. Two chambers, single circulation', 'q. Three chambers, mixed blood', 'r. Four chambers', 's. Open circulation with sinuses'],
  'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
  'Fish: 2 chambers (p). Frog: 3 chambers, mixed blood (q). Crocodile: 4 chambers (r). Cockroach: open circulation (s).', 'Crocodile is the reptile with four chambers.');
match(4, 'regulation of cardiac activity', 'm5', 'Parts of the heart and their features',
  ['A. SAN', 'B. AVN', 'C. Bundle of His', 'D. Purkinje fibres'],
  ['p. Upper right corner of the right atrium', 'q. Lower left corner of the right atrium', 'r. Passes through the AV septum to the interventricular septum', 's. Fibres spread through the ventricular muscle'],
  'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
  'SAN: upper right of the right atrium (p). AVN: lower left of the right atrium (q). Bundle of His: through the septum (r). Purkinje fibres: ventricular muscle (s).');

// ---------------------------------------------------------------- Passages
pass('p1', 'A routine check-up', 'A doctor records for a young adult a heart rate of 75 beats per minute, a stroke volume of 70 mL, an end-diastolic volume of 120 mL and a blood pressure of 120/80 mm Hg.');
pq('p1', 3, 'cardiac cycle', 'The duration of one cardiac cycle for this person is', '0.8 s', ['0.75 s', '1.25 s', '0.08 s'], '60 s / 75 beats = 0.8 s per cycle.');
pq('p1', 3, 'cardiac cycle', 'The cardiac output of this person is', '5250 mL per minute', ['525 mL per minute', '4500 mL per minute', '8400 mL per minute'], 'CO = SV × HR = 70 × 75 = 5250 mL per minute.');
pq('p1', 4, 'cardiac cycle', 'The end-systolic volume of the left ventricle is', '50 mL', ['70 mL', '120 mL', '190 mL'], 'SV = EDV - ESV, so ESV = 120 - 70 = 50 mL.');
pass('p2', 'A transfusion', 'A patient of blood group B, Rh-positive needs blood. Three donors are available: Donor 1 (A, Rh-positive), Donor 2 (O, Rh-negative), and Donor 3 (B, Rh-negative).');
pq('p2', 3, 'blood groups', 'The patient has which antibody in the plasma?', 'Anti-A only', ['Anti-B only', 'Both anti-A and anti-B', 'None'], 'Group B has antigen B and the antibody anti-A.');
pq('p2', 3, 'blood groups', 'Which donor(s) can safely give red cells?', 'Donors 2 and 3', ['Donor 1 only', 'Donor 1 and 2', 'All three'], 'Donor 1 has antigen A, which the patient\'s anti-A attacks. Donors 2 (O) and 3 (B) are safe. The patient is Rh-positive so Rh-negative blood is acceptable.', 'Rh-positive patients can take Rh-negative blood.');
pq('p2', 4, 'blood groups', 'If the patient were a woman of the same group but Rh-negative, and she carried an Rh-positive foetus, the first child would be', 'usually unaffected, but later Rh-positive children are at risk', ['always affected', 'never at any risk later', 'affected only by ABO factors'], 'She develops anti-Rh antibodies at the first delivery. These harm the foetus of a later pregnancy. Anti-Rh antibodies given right after the first delivery avoid this.');
pass('p3', 'Reading an ECG strip', 'On an ECG strip, the distance between two successive R peaks is 0.6 s. A P wave comes before each QRS complex, and a T wave follows it.');
pq('p3', 3, 'ECG', 'The heart rate shown by the strip is', '100 beats per minute', ['60 beats per minute', '72 beats per minute', '120 beats per minute'], '60 / 0.6 = 100 per minute.');
pq('p3', 4, 'ECG', 'A P wave before each QRS complex shows that', 'the atria depolarise before each ventricular beat', ['the ventricles depolarise before the atria', 'the atria never contract', 'the T wave is missing'], 'The atrial depolarisation (P) comes first and then ventricular depolarisation (QRS).');
pq('p3', 4, 'ECG', 'The end of the ventricular systole on this strip is marked by', 'the end of the T wave', ['the beginning of the P wave', 'the peak of the R wave', 'the beginning of the QRS complex'], 'The QRS complex marks the beginning of the ventricular systole and the T wave the repolarisation; the end of the T wave marks the end of the systole.');

// ---------------------------------------------------------------- Number templates
const gens = [];
const gm = (id, level, sub, make, verify) => gens.push({ id, type: 'nat', level, exams: E, sub, make, verify });
gm('bc-g01', 3, 'cardiac cycle', (rng) => {
  const sv = pick(rng, 60, 80, 5), hr = pick(rng, 60, 90, 2);
  const a = sv * hr;
  return { q: `The stroke volume of a person is ${sv} mL and the heart rate is ${hr} beats per minute. Find the cardiac output in mL per minute.`, answer: a, tol: 0, unit: 'mL/min', sv, hr, sol: `Cardiac output = stroke volume × heart rate = ${sv} × ${hr} = ${a} mL per minute.` };
}, (p) => p.hr * p.sv);
gm('bc-g02', 3, 'cardiac cycle', (rng) => {
  const t = choose(rng, [0.5, 0.6, 0.75, 0.8, 1.0, 1.2]);
  const a = 60 / t;
  return { q: `On an ECG the time between two successive R waves is ${t} s. What is the heart rate in beats per minute?`, answer: a, tol: 0.01, unit: 'beats/min', t, sol: `One beat takes ${t} s. Beats per minute = 60 / ${t} = ${+a.toFixed(2)}.` };
}, (p) => 60 / p.t);
gm('bc-g03', 3, 'cardiac cycle', (rng) => {
  const hr = choose(rng, [60, 75, 80, 100, 120]);
  const a = 60 / hr;
  return { q: `A person has a heart rate of ${hr} beats per minute. How long is one cardiac cycle in seconds?`, answer: a, tol: 0.005, unit: 's', hr, sol: `Time of one cycle = 60 s / ${hr} = ${+a.toFixed(3)} s.` };
}, (p) => 1 / (p.hr / 60));
gm('bc-g04', 3, 'cardiac cycle', (rng) => {
  const edv = pick(rng, 110, 140, 5), esv = pick(rng, 40, 65, 5);
  const a = edv - esv;
  return { q: `The left ventricle holds ${edv} mL at the end of diastole and ${esv} mL at the end of systole. What is the stroke volume in mL?`, answer: a, tol: 0, unit: 'mL', edv, esv, sol: `Stroke volume = end-diastolic volume - end-systolic volume = ${edv} - ${esv} = ${a} mL.` };
}, (p) => p.edv - p.esv);
gm('bc-g05', 3, 'ECG', (rng) => {
  const k = pick(rng, 10, 18, 1), s = choose(rng, [6, 10, 15, 30]);
  const a = k * 60 / s;
  return { q: `An ECG record of ${s} seconds shows ${k} QRS complexes. What is the heart rate in beats per minute?`, answer: a, tol: 0.01, unit: 'beats/min', k, s, sol: `Rate = ${k} complexes in ${s} s. In 60 s: ${k} × 60/${s} = ${+a.toFixed(2)} beats per minute.` };
}, (p) => p.k / (p.s / 60));
gm('bc-g06', 3, 'disorders', (rng) => {
  const sys = pick(rng, 110, 160, 5), dia = pick(rng, 70, 100, 5);
  const a = sys - dia;
  return { q: `A person has a blood pressure of ${sys}/${dia} mm Hg. What is the pulse pressure in mm Hg?`, answer: a, tol: 0, unit: 'mm Hg', sys, dia, sol: `Pulse pressure = systolic - diastolic = ${sys} - ${dia} = ${a} mm Hg.` };
}, (p) => p.sys - p.dia);
gm('bc-g07', 4, 'cardiac cycle', (rng) => {
  const sv = pick(rng, 60, 80, 5), hr = pick(rng, 60, 90, 5), m = choose(rng, [10, 20, 30, 60]);
  const a = sv * hr * m / 1000;
  return { q: `A heart pumps ${sv} mL of blood in each beat at ${hr} beats per minute. How many litres of blood does it pump in ${m} minutes?`, answer: a, tol: 0.01, unit: 'L', sv, hr, m, sol: `Per minute: ${sv} × ${hr} = ${sv * hr} mL. In ${m} minutes: ${sv * hr * m} mL = ${+a.toFixed(2)} L.` };
}, (p) => (p.sv * p.m * p.hr) / 1000);
gm('bc-g08', 3, 'cardiac cycle', (rng) => {
  const hr = pick(rng, 60, 100, 4), m = choose(rng, [5, 10, 15, 30]);
  const a = hr * m;
  return { q: `A resting person has a heart rate of ${hr} beats per minute. How many times does the heart beat in ${m} minutes?`, answer: a, tol: 0, unit: 'beats', hr, m, sol: `Beats = rate × time = ${hr} × ${m} = ${a}.` };
}, (p) => p.m * p.hr);
gens.push({ id: 'bc-g09', type: 'mcq', level: 3, exams: E, sub: 'ECG',
  make(rng) {
    const t = choose(rng, [0.5, 0.6, 0.75, 0.8, 1.0]);
    const hr = 60 / t;
    const r = numOpts(rng, hr, [t * 100, 60 * t, hr / 2], 'per min', 4);
    return { q: `The R-R interval on a regular ECG trace is ${t} s. The heart rate is`, options: r.options, answer: r.answer, t, exp: `${fmt(hr, 4)} per min`, sol: `Heart rate = 60 / R-R interval = 60 / ${t} = ${fmt(hr, 4)} per minute. Multiplying ${t} by 100 or 60 is a common slip.` };
  },
  verify: (p) => p.options.indexOf(p.exp) });
gens.push({ id: 'bc-g10', type: 'mcq', level: 4, exams: E, sub: 'cardiac cycle',
  make(rng) {
    const sv = pick(rng, 60, 80, 5), hr = pick(rng, 65, 85, 5);
    const co = sv * hr / 1000;
    const r = numOpts(rng, co, [co * 10, co / 10, (sv + hr) / 1000 * 10], 'L/min', 3);
    return { q: `A person has a stroke volume of ${sv} mL and a heart rate of ${hr} per minute. The cardiac output, in litres per minute, is`, options: r.options, answer: r.answer, exp: `${fmt(co, 3)} L/min`, sol: `CO = ${sv} × ${hr} = ${sv * hr} mL per minute = ${fmt(co, 3)} L per minute. Watch the mL to L change.` };
  },
  verify: (p) => p.options.indexOf(p.exp) });

export default { topic: 'circulation', groups, items, gens };
