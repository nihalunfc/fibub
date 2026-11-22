// NEET UG Biology: Excretory products and their elimination (NCERT Class 11, Chapter 19). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const E = ['neet'];
const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [1, 3, 0, 2];
const nid = () => `ex-${String(++n).padStart(3, '0')}`;
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
mc(1, 'nitrogenous wastes', 'Animals that excrete most of their nitrogenous waste as ammonia are called', 'ammonotelic', ['ureotelic', 'uricotelic', 'aminotelic'], 'Ammonia-excreting animals are ammonotelic, for example bony fishes, aquatic amphibians and aquatic insects.');
mc(1, 'nitrogenous wastes', 'Humans are', 'ureotelic', ['ammonotelic', 'uricotelic', 'guanotelic'], 'Mammals including humans convert ammonia into urea in the liver and excrete urea.');
mc(1, 'nitrogenous wastes', 'Birds and reptiles mainly excrete nitrogenous waste as', 'uric acid', ['ammonia', 'urea', 'creatinine'], 'Uric acid is a pellet or paste with very little water loss, which suits animals that must save water.');
mc(1, 'excretory organs', 'The excretory organs of a cockroach are', 'Malpighian tubules', ['flame cells', 'nephridia', 'green glands'], 'Most insects, including the cockroach, have Malpighian tubules that remove nitrogenous wastes.');
mc(1, 'excretory organs', 'In earthworm the excretory structures are', 'nephridia', ['Malpighian tubules', 'flame cells', 'antennal glands'], 'Earthworms and other annelids excrete through nephridia, which also help in osmoregulation.');
mc(1, 'excretory organs', 'Flame cells (protonephridia) are the excretory structures of', 'flatworms', ['earthworms', 'prawns', 'cockroaches'], 'Protonephridia or flame cells occur in Platyhelminthes (for example Taenia), rotifers, some annelids and Amphioxus.');
mc(1, 'excretory organs', 'Antennal glands or green glands are the excretory organs of', 'prawns', ['cockroaches', 'earthworms', 'planaria'], 'Crustaceans such as prawns excrete through antennal glands.');
mc(1, 'human excretory system', 'The functional unit of the kidney is the', 'nephron', ['neuron', 'pyramid', 'calyx'], 'Each human kidney has nearly one million nephrons. A nephron is the structural and functional unit.');
mc(1, 'human excretory system', 'The glomerulus is a', 'tuft of capillaries', ['coiled tubule', 'bundle of nerves', 'cup-like capsule'], 'The glomerulus is a cluster of capillaries formed from the afferent arteriole. The cup that holds it is the Bowman\'s capsule.');
mc(1, 'urine formation', 'Ultrafiltration of blood takes place in the', 'glomerulus', ['loop of Henle', 'collecting duct', 'distal convoluted tubule'], 'Blood is filtered through the glomerular capillaries into the Bowman\'s capsule under pressure.');
mc(1, 'urine formation', 'The glomerular filtration rate of a healthy adult is about', '125 mL per minute', ['12.5 mL per minute', '1250 mL per minute', '1.25 mL per minute'], 'GFR is about 125 mL/min, or 180 litres a day.');
mc(1, 'regulation', 'The hormone that reduces water loss in urine (anti-diuretic hormone) is released from', 'the neurohypophysis', ['the adenohypophysis', 'the adrenal medulla', 'the thyroid'], 'ADH is made in the hypothalamus and released from the posterior pituitary (neurohypophysis).');
mc(1, 'micturition', 'Urine is temporarily stored in the', 'urinary bladder', ['ureter', 'urethra', 'renal pelvis'], 'Ureters carry urine from the kidneys to the bladder. Release is controlled by the micturition reflex.');
mc(1, 'disorders', 'The artificial kidney removes nitrogenous waste from blood in a process called', 'haemodialysis', ['ultrafiltration of plasma', 'micturition', 'osmoregulation'], 'In haemodialysis the patient\'s blood passes through cellophane tubes surrounded by dialysing fluid.');
mc(1, 'disorders', 'A stone formed from crystallised salts such as oxalates inside the kidney is called', 'a renal calculus', ['glycosuria', 'uremia', 'a podocyte'], 'Renal calculi are insoluble masses of crystallised salts formed within the kidney.');
mc(1, 'urine formation', 'Most of the reabsorption of essential nutrients takes place in the', 'proximal convoluted tubule', ['collecting duct', 'distal convoluted tubule', 'Bowman\'s capsule'], 'The PCT reabsorbs nearly all essential nutrients and 70-80 per cent of electrolytes and water.');
mc(1, 'human excretory system', 'The human kidney is', 'bean-shaped and reddish brown', ['spherical and pale', 'bean-shaped and green', 'flat and yellow'], 'Kidneys are reddish brown, bean-shaped organs near the dorsal inner wall of the abdominal cavity.');
mc(1, 'urine formation', 'The pH of normal human urine is about', '6.0 (slightly acidic)', ['8.0 (alkaline)', '7.4', '2.0 (strongly acidic)'], 'Human urine is a light yellow watery fluid, slightly acidic with pH about 6.0.');

// ---------------------------------------------------------------- Level 2
mc(2, 'nitrogenous wastes', 'Which of these nitrogenous wastes is the most toxic and needs the most water for its removal?', 'Ammonia', ['Urea', 'Uric acid', 'Creatinine'], 'Ammonia is highly toxic and must be diluted heavily, so only animals with plenty of water around them excrete it. Uric acid is the least toxic.');
mc(2, 'nitrogenous wastes', 'Which nitrogenous waste is removed with the least loss of water?', 'Uric acid', ['Ammonia', 'Urea', 'Ammonium ions'], 'Uric acid is the least toxic and sparingly soluble, so it leaves as a paste or pellet. That is why birds, reptiles and insects save water.');
mc(2, 'nitrogenous wastes', 'Ammonia is excreted in bony fishes mainly by', 'diffusion across the gill surface as ammonium ions', ['the liver as urea', 'Malpighian tubules', 'sweat glands'], 'Ammonia leaves by diffusion across body or gill surfaces. Kidneys play only a small role in ammonotelism.');
mc(2, 'nitrogenous wastes', 'Which pair is correctly matched?', 'Land snails - uricotelic', ['Aquatic amphibians - uricotelic', 'Bony fishes - ureotelic', 'Mammals - ammonotelic'], 'Land snails, insects, reptiles and birds are uricotelic. Aquatic amphibians and bony fishes are ammonotelic, and mammals are ureotelic.');
mc(2, 'nitrogenous wastes', 'Urea is synthesised in the liver by', 'the ornithine cycle', ['the Calvin cycle', 'the Krebs cycle only', 'the glycolytic pathway'], 'The liver combines ammonia with carbon dioxide in the ornithine (urea) cycle to make urea, which is released into blood and filtered by the kidneys.');
mc(2, 'nitrogenous wastes', 'Some urea is held back in the kidney matrix of certain ureotelic animals in order to', 'maintain a desired osmolarity', ['store energy', 'neutralise acids', 'make bile'], 'The retained urea helps keep the medullary interstitial fluid concentrated.');
mc(2, 'excretory organs', 'Which of these pairs is NOT correct?', 'Cockroach - antennal glands', ['Prawn - antennal glands', 'Planaria - flame cells', 'Earthworm - nephridia'], 'Cockroach uses Malpighian tubules. Antennal (green) glands are for crustaceans such as prawns.');
mc(2, 'human excretory system', 'The human kidneys lie between the levels of', 'the last thoracic and third lumbar vertebrae', ['the first and fifth thoracic vertebrae', 'the second and fifth sacral vertebrae', 'the seventh cervical and first thoracic vertebrae'], 'Kidneys lie against the dorsal body wall, roughly between the last thoracic and third lumbar vertebrae.');
mc(2, 'human excretory system', 'The notch on the inner concave surface of the kidney is the', 'hilum', ['calyx', 'pelvis', 'cortex'], 'The ureter, blood vessels and nerves enter or leave through the hilum.');
mc(2, 'human excretory system', 'The extensions of cortex between the medullary pyramids are called', 'renal columns (columns of Bertini)', ['calyces', 'vasa recta', 'pelvic folds'], 'The cortex dips in between the pyramids as renal columns.');
mc(2, 'human excretory system', 'The funnel-shaped space inside the hilum that receives the calyces is the', 'renal pelvis', ['renal capsule', 'renal cortex', 'Bowman\'s space'], 'Calyces collect urine from the pyramids and lead into the renal pelvis, which continues as the ureter.');
mc(2, 'nephron structure', 'The Malpighian body (renal corpuscle) is made of', 'the glomerulus and Bowman\'s capsule', ['PCT and loop of Henle', 'DCT and collecting duct', 'vasa recta and peritubular capillaries'], 'Glomerulus plus the double-walled Bowman\'s capsule form the renal corpuscle.');
mc(2, 'nephron structure', 'The blood vessel that carries blood away from the glomerulus is the', 'efferent arteriole', ['afferent arteriole', 'renal vein', 'vasa recta'], 'The afferent arteriole brings blood into the glomerulus and the efferent arteriole takes it out, then forms the peritubular network.');
mc(2, 'nephron structure', 'The epithelium of the proximal convoluted tubule is', 'simple cuboidal with a brush border', ['simple squamous without microvilli', 'stratified squamous', 'ciliated columnar'], 'The brush border of microvilli greatly increases surface area for reabsorption.');
mc(2, 'nephron structure', 'In cortical nephrons the loop of Henle is', 'very short and extends only a little into the medulla', ['very long and reaches the renal pelvis', 'absent', 'present only in the cortex of the other kidney'], 'Most nephrons are cortical. Juxtamedullary nephrons have long loops that run deep into the medulla.');
mc(2, 'nephron structure', 'Vasa recta is well developed in', 'juxtamedullary nephrons', ['cortical nephrons', 'all the nephrons equally', 'the ureter'], 'The vasa recta, a U-shaped capillary network running with the loop of Henle, is absent or reduced in cortical nephrons.');
mc(2, 'urine formation', 'The cells of the Bowman\'s capsule that form filtration slits are', 'podocytes', ['juxtaglomerular cells', 'macula densa cells', 'goblet cells'], 'Podocytes of the visceral layer have foot-like processes (pedicels) that leave slit pores.');
mc(2, 'urine formation', 'Which of these does NOT normally pass into the glomerular filtrate?', 'Plasma proteins', ['Glucose', 'Amino acids', 'Urea'], 'The three-layered filter holds back plasma proteins and blood cells. Glucose, amino acids, salts, urea and water pass through.');
mc(2, 'urine formation', 'The kidneys receive about what fraction of the cardiac output?', 'One fifth', ['One tenth', 'One half', 'One twentieth'], 'About 1100-1200 mL of blood flows through the kidneys per minute, nearly one fifth of the cardiac output.');
mc(2, 'urine formation', 'The descending limb of the loop of Henle is', 'permeable to water and almost impermeable to electrolytes', ['impermeable to water and permeable to electrolytes', 'permeable to both', 'impermeable to both'], 'Water leaves the descending limb, so the filtrate becomes more concentrated as it goes down.');
mc(2, 'urine formation', 'The ascending limb of the loop of Henle is', 'impermeable to water but lets electrolytes move out', ['permeable to water but not to electrolytes', 'permeable to both', 'the main site of glucose reabsorption'], 'Electrolytes leave the ascending limb, so the filtrate becomes dilute as it moves up.');
mc(2, 'urine formation', 'Tubular secretion mainly adds which of these to the filtrate?', 'H+, K+ and ammonia', ['Glucose and amino acids', 'Proteins and fats', 'Red blood cells'], 'Tubular cells secrete hydrogen ions, potassium ions and ammonia, helping to keep ionic and acid-base balance.');
mc(2, 'regulation', 'Juxtaglomerular cells release', 'renin', ['aldosterone', 'ADH', 'ANF'], 'JG cells in the afferent arteriole release renin when GFR falls.');
mc(2, 'regulation', 'Aldosterone is secreted by the', 'adrenal cortex', ['adrenal medulla', 'posterior pituitary', 'atria of the heart'], 'Angiotensin II stimulates the adrenal cortex to release aldosterone.');
mc(2, 'regulation', 'Atrial natriuretic factor (ANF) causes', 'vasodilation and a fall in blood pressure', ['vasoconstriction and a rise in blood pressure', 'release of renin', 'reabsorption of sodium in the DCT'], 'ANF acts as a check on the renin-angiotensin mechanism.');
mc(2, 'micturition', 'The urethral sphincter during micturition', 'relaxes while the bladder muscle contracts', ['contracts while the bladder relaxes', 'contracts with the bladder', 'is not involved'], 'Stretch receptors in the bladder wall send signals to the CNS, which sends back motor messages causing contraction of bladder smooth muscle and relaxation of the sphincter.');
mc(2, 'other organs', 'Which organ removes about 200 mL of carbon dioxide every minute?', 'The lungs', ['The liver', 'The skin', 'The kidneys'], 'Lungs remove large amounts of CO2 and some water daily.');
mc(2, 'other organs', 'Bilirubin and biliverdin are excreted through the', 'liver, into bile', ['lungs', 'sweat glands', 'sebaceous glands'], 'Liver secretes bilirubin, biliverdin, cholesterol, degraded steroids, vitamins and drugs. They leave with the digestive wastes.');
mc(2, 'other organs', 'Sebaceous glands eliminate', 'sterols, hydrocarbons and waxes', ['urea and lactic acid', 'bile pigments', 'carbon dioxide'], 'Sebum from sebaceous glands carries these; the watery sweat carries NaCl, a little urea and lactic acid.');
mc(2, 'disorders', 'High urea in the blood is called', 'uremia', ['glycosuria', 'ketonuria', 'diuresis'], 'Uremia may lead to kidney failure and is treated by dialysis or transplant.');
mc(2, 'disorders', 'Which anticoagulant is added to blood going into a dialysis unit?', 'Heparin', ['Warfarin in the dialysing fluid', 'Anti-heparin', 'Fibrin'], 'Heparin stops clotting in the machine. Anti-heparin is added before the cleaned blood returns to the body.');
mc(2, 'disorders', 'Inflammation of the glomeruli of the kidney is called', 'glomerulonephritis', ['cystitis', 'renal calculi', 'uremia'], 'In glomerulonephritis the glomeruli are inflamed and filtration is damaged.');
mc(2, 'disorders', 'Glucose and ketone bodies in the urine suggest', 'diabetes mellitus', ['diabetes insipidus', 'glomerulonephritis', 'renal calculi'], 'Glycosuria and ketonuria are signs of diabetes mellitus.');

// ---------------------------------------------------------------- Level 3
mc(3, 'urine formation', 'If the GFR is 125 mL/min, the volume of filtrate formed per day is', '180 litres', ['1.8 litres', '18 litres', '1800 litres'], 'Volume = 125 mL/min × 60 × 24 = 180,000 mL = 180 L.', 'Slip in the power of ten when converting mL to L.');
mc(3, 'urine formation', 'An adult passes about 1.5 L of urine a day. What percentage of the filtrate is reabsorbed?', 'about 99 per cent', ['about 90 per cent', 'about 50 per cent', 'about 75 per cent'], '(180 - 1.5)/180 × 100 is about 99.2 per cent.', 'Do not mix this with the 70-80 per cent reabsorbed in the PCT alone.');
mc(3, 'urine formation', 'The PCT reabsorbs about 70-80 per cent of electrolytes and water. Roughly how much of the filtrate (litres per day) reaches the loop of Henle if 75 per cent is reabsorbed?', '45 litres', ['135 litres', '1.5 litres', '180 litres'], '25 per cent of 180 L = 45 L is left after the PCT.');
mc(3, 'urine formation', 'Which statement about the filtration membrane is correct?', 'It has three layers: capillary endothelium, basement membrane and podocyte epithelium', ['It has two layers: basement membrane and cuboidal epithelium', 'It is made only of the basement membrane', 'It has four layers including the pericycle'], 'Filtration passes through the glomerular endothelium, the basement membrane and the slit pores between podocyte processes.');
mc(3, 'urine formation', 'Which of these is reabsorbed by an active process in the nephron?', 'Glucose and amino acids', ['Urea', 'Water', 'Nitrogenous wastes in general'], 'Glucose, amino acids and Na+ are actively reabsorbed. Water and nitrogenous wastes move passively.');
mc(3, 'urine formation', 'Reabsorption of water in the PCT mostly depends on', 'passive movement along osmotic gradient created by solute reabsorption', ['ATP-driven water pumps', 'ADH', 'aldosterone'], 'Water follows solutes passively. ADH acts later in the DCT and collecting duct.');
mc(3, 'urine formation', 'Which part of the nephron helps maintain the pH of blood by absorbing HCO3- and secreting H+?', 'PCT and DCT', ['Descending limb only', 'Bowman\'s capsule', 'Vasa recta'], 'PCT and DCT both reabsorb bicarbonate and secrete H+ and NH3; the collecting duct also secretes H+ and K+.');
mc(3, 'urine formation', 'Conditional reabsorption of Na+ and water takes place in the', 'distal convoluted tubule', ['proximal convoluted tubule', 'descending limb', 'Bowman\'s capsule'], 'The DCT reabsorbs sodium and water only when hormones such as aldosterone and ADH call for it.');
mc(3, 'urine formation', 'The collecting duct allows a small amount of urea to pass into the medullary interstitium to', 'help keep the osmotic gradient in the medulla', ['dilute the urine', 'activate renin', 'remove ketone bodies'], 'Urea together with NaCl builds the gradient that lets the kidney make concentrated urine.');
mc(3, 'countercurrent', 'The osmolarity of the medullary interstitial fluid in humans rises from about', '300 mOsmol/L in the cortex to about 1200 mOsmol/L in the inner medulla', ['100 to 300 mOsmol/L', '1200 mOsmol/L in the cortex to 300 in the medulla', 'it is the same everywhere at 300'], 'The gradient is built by the loop of Henle and vasa recta and is caused mainly by NaCl and urea.', 'Do not reverse the gradient.');
mc(3, 'countercurrent', 'Human kidneys can make urine about how many times more concentrated than the initial filtrate?', 'Four times', ['Ten times', 'Twice', 'Forty times'], 'Filtrate is about 300 mOsmol/L and the maximum urine is about 1200 mOsmol/L, which is 4 times.');
mc(3, 'countercurrent', 'The flow of filtrate in the two limbs of Henle\'s loop and the flow of blood in the two limbs of the vasa recta are', 'in opposite directions, forming a countercurrent', ['in the same direction in both', 'unrelated', 'only in the cortex'], 'In each U-shaped structure the two limbs carry fluid in opposite directions, which helps trap solutes in the medulla.');
mc(3, 'countercurrent', 'NaCl moved out by the ascending limb of the loop of Henle is picked up by', 'the descending limb of the vasa recta', ['the Bowman\'s capsule', 'the efferent arteriole only', 'the PCT'], 'NaCl is exchanged with the descending limb of the vasa recta and returned to the interstitium by the ascending limb.');
mc(3, 'regulation', 'A fall in GFR leads first to', 'release of renin from the JG cells', ['release of ANF', 'release of ADH only', 'release of aldosterone before renin'], 'Fall in GFR activates JG cells, which release renin, and the chain continues.');
mc(3, 'regulation', 'Renin converts', 'angiotensinogen to angiotensin I', ['angiotensin I to angiotensin II', 'aldosterone to renin', 'ADH to oxytocin'], 'Renin starts the chain. Angiotensin I is converted to angiotensin II (by an enzyme).', 'Renin is itself an enzyme, not a hormone that constricts vessels.');
mc(3, 'regulation', 'Angiotensin II does all of these EXCEPT', 'inhibiting aldosterone secretion', ['constricting blood vessels', 'raising glomerular blood pressure', 'stimulating the adrenal cortex'], 'Angiotensin II is a powerful vasoconstrictor that raises blood pressure and GFR. It stimulates aldosterone release.');
mc(3, 'regulation', 'Aldosterone acts on the', 'distal parts of the tubule, causing Na+ and water reabsorption', ['glomerulus, causing filtration', 'PCT, blocking glucose', 'bladder, causing contraction'], 'Aldosterone increases reabsorption of Na+ and water from distal parts of the tubule, which raises blood pressure and GFR.');
mc(3, 'regulation', 'ADH is released when', 'body fluid volume falls or osmolarity rises', ['body fluid volume rises', 'blood pressure is very high', 'the bladder is full'], 'Osmoreceptors sense the rise in osmolarity and make the neurohypophysis release ADH.');
mc(3, 'regulation', 'A person drinks a large volume of water. Which change is expected?', 'The osmoreceptors are switched off, ADH falls and urine becomes dilute', ['ADH rises and urine becomes concentrated', 'Renin rises sharply', 'Aldosterone rises'], 'More body fluid suppresses ADH, so less water is reabsorbed and more dilute urine is passed.');
mc(3, 'regulation', 'Which hormone is released by the atria of the heart when blood flow to them increases?', 'ANF', ['Renin', 'Aldosterone', 'ADH'], 'ANF causes vasodilation and so lowers blood pressure.');
mc(3, 'micturition', 'The neural mechanism that causes the release of urine is the', 'micturition reflex', ['knee-jerk reflex', 'peristalsis', 'ADH reflex'], 'It is triggered by stretch receptors of the bladder wall.');
mc(3, 'micturition', 'On average, the amount of urea excreted by an adult per day is', 'about 25-30 g', ['about 250-300 g', 'about 2.5-3 g', 'about 25-30 mg'], 'An adult excretes 1 to 1.5 litres of urine and 25-30 g of urea per day.');
mc(3, 'other organs', 'Which of the following is NOT an excretory function of the skin?', 'Removal of bile pigments', ['Removal of NaCl in sweat', 'Removal of a little urea in sweat', 'Removal of sterols through sebum'], 'Bile pigments are removed by the liver.');
mc(3, 'disorders', 'In haemodialysis the dialysing fluid has the same composition as plasma EXCEPT that it', 'has no nitrogenous wastes', ['has no glucose', 'has no sodium', 'has no water'], 'Because everything else is matched, only nitrogenous wastes move out down their gradient and useful substances are not lost.');
mc(3, 'disorders', 'The cellophane membrane of the dialysis unit works as', 'a semipermeable membrane allowing movement according to the concentration gradient', ['a pump that pushes urea out', 'a filter that removes only water', 'a place where blood cells are made'], 'Small molecules like urea pass through the pores, while cells and proteins stay in blood.');
mc(3, 'disorders', 'The ultimate method for correcting acute renal failure is', 'kidney transplantation', ['repeated catheterisation', 'a diuretic course only', 'a high-protein diet'], 'A matched donor, preferably a close relative, lowers the chance of immune rejection.');
mc(3, 'excretory organs', 'The excretory structure that also serves for osmoregulation in Taenia and rotifers is the', 'protonephridium', ['Malpighian tubule', 'nephron', 'antennal gland'], 'Flame cells in flatworms and rotifers regulate water and ion balance and excrete wastes.');
mc(3, 'human excretory system', 'Which sequence correctly traces urine out of the kidney?', 'Collecting duct, medullary pyramid, calyx, pelvis, ureter', ['Calyx, collecting duct, pelvis, ureter, pyramid', 'Pelvis, calyx, pyramid, ureter, collecting duct', 'Pyramid, collecting duct, pelvis, calyx, ureter'], 'Collecting ducts open through the pyramids into calyces, then the pelvis, then the ureter.');
mc(3, 'nephron structure', 'Which part of the nephron lies partly in the medulla?', 'Loop of Henle', ['Bowman\'s capsule', 'Proximal convoluted tubule', 'Distal convoluted tubule'], 'The Malpighian body, PCT and DCT lie in the cortex. The loop of Henle dips into the medulla.');
mc(3, 'nephron structure', 'The junction of the DCT and the afferent arteriole shows the', 'juxtaglomerular apparatus', ['Malpighian body', 'vasa recta', 'brush border'], 'The JGA is made of modified cells of the DCT and afferent arteriole at their contact.');

// ---------------------------------------------------------------- Level 4
mc(4, 'urine formation', 'In a person the GFR falls from 125 to 100 mL/min. By how many litres does the filtrate per day fall?', '36 litres', ['25 litres', '3.6 litres', '180 litres'], 'Filtrate at 125 = 180 L/day. At 100 mL/min it is 100 × 1.44 = 144 L/day. The fall is 36 L.', 'Calculating the percentage fall (20 per cent) and stopping there.');
mc(4, 'urine formation', 'Which of the following is correct for the glomerular filtrate?', 'It is protein-free plasma', ['It has the same protein content as blood', 'It has red cells but no glucose', 'It is more concentrated than urine'], 'Ultrafiltration passes everything small in plasma but not proteins or cells.');
mc(4, 'urine formation', 'A patient has proteins appearing in urine. The most likely site of fault is', 'the filtration membrane of the glomerulus', ['the collecting duct', 'the ureter', 'the loop of Henle'], 'Plasma proteins are too big for a healthy filter. Their presence means the glomerular membrane is damaged, as in glomerulonephritis.', 'Reabsorption does not restore proteins; the fault is in filtration.');
mc(4, 'urine formation', 'The efferent arteriole is narrower than the afferent arteriole. This helps by', 'keeping a high hydrostatic pressure in the glomerulus for filtration', ['lowering pressure to stop filtration', 'increasing absorption in the PCT', 'draining the filtrate'], 'Narrow outlet and wider inlet keep the capillary pressure high so fluid is pushed out.');
mc(4, 'urine formation', 'Which statement is NOT correct about the loop of Henle?', 'The descending limb actively pumps NaCl into the medulla', ['It builds the osmolarity gradient of the medulla', 'The ascending limb is impermeable to water', 'Little reabsorption occurs in it'], 'The descending limb is permeable to water and nearly impermeable to electrolytes. Electrolytes are moved out by the ascending limb.');
mc(4, 'urine formation', 'Which segment of the nephron makes the filtrate hypotonic to the interstitium at the top of the loop?', 'Ascending limb of the loop of Henle', ['Descending limb', 'Collecting duct in the inner medulla', 'Bowman\'s capsule'], 'Since salts are removed without water, the fluid becomes dilute as it moves up.');
mc(4, 'urine formation', 'The ADH-dependent segment where large amounts of water are reabsorbed to produce concentrated urine is the', 'collecting duct (and DCT)', ['Bowman\'s capsule', 'ascending limb', 'efferent arteriole'], 'ADH makes the DCT and collecting duct more permeable to water so that water follows the high medullary osmolarity.');
mc(4, 'urine formation', 'Which one of the following is a correct statement of tubular secretion?', 'It is an important step in maintaining ionic and acid-base balance', ['It moves glucose into the filtrate', 'It takes place only in the glomerulus', 'It removes plasma proteins'], 'Secretion of H+, K+ and ammonia helps regulate the blood\'s pH and ion levels.');
mc(4, 'countercurrent', 'The countercurrent mechanism works best in', 'juxtamedullary nephrons with long loops and vasa recta', ['cortical nephrons with short loops', 'nephrons without Bowman\'s capsule', 'the ureter'], 'The long loops of juxtamedullary nephrons together with the vasa recta build and keep the medullary gradient.');
mc(4, 'countercurrent', 'The vasa recta do NOT wash away the medullary gradient because', 'they run as a U-shape and return solutes in the ascending limb', ['they are impermeable to NaCl', 'they carry blood in one direction only', 'they have no capillaries'], 'NaCl entering the descending vasa recta is returned to the interstitium by the ascending vasa recta.');
mc(4, 'countercurrent', 'A desert mammal produces urine more concentrated than a human. A likely feature is', 'longer loops of Henle', ['no nephrons', 'no medulla', 'a very short loop of Henle'], 'A longer loop sets a steeper gradient and allows more water to be reabsorbed. This reasoning is a standard extension of the concentration mechanism.', 'The answer relies on the countercurrent idea, not on a number in the text.');
mc(4, 'regulation', 'A person with a deficiency of ADH will show', 'a large volume of dilute urine', ['a small volume of concentrated urine', 'glycosuria with sweet urine', 'proteinuria'], 'Without ADH the water is not reabsorbed in the collecting ducts. This is diabetes insipidus. In diabetes mellitus the urine is sweet.', 'Diabetes insipidus and mellitus are different.');
mc(4, 'regulation', 'Select the correct order of the renin-angiotensin mechanism.', 'Fall in GFR, JG cells, renin, angiotensin I, angiotensin II, aldosterone', ['Fall in GFR, aldosterone, renin, angiotensin II, angiotensin I', 'Fall in GFR, angiotensin II, renin, JG cells', 'ANF, renin, aldosterone, angiotensin II'], 'JG cells respond to a fall in GFR; renin produces angiotensin I, which is converted to angiotensin II; this stimulates aldosterone release.');
mc(4, 'regulation', 'ANF and angiotensin II are alike because both', 'act on blood vessels, but with opposite effects', ['are made by the adrenal cortex', 'are enzymes', 'are made by the posterior pituitary'], 'Angiotensin II is a vasoconstrictor and ANF a vasodilator. Neither is made in the adrenal cortex.');
mc(4, 'regulation', 'ADH has a second effect on blood pressure because it', 'constricts blood vessels', ['dilates blood vessels', 'stimulates renin', 'blocks aldosterone'], 'ADH constricts blood vessels, raising blood pressure and so GFR, in addition to acting on tubules.');
mc(4, 'other organs', 'A runner loses excess salt, a little urea and lactic acid in his sweat. This helps in', 'cooling the body and removing small amounts of wastes', ['storing wastes for the kidney', 'making bile', 'raising GFR'], 'Sweat evaporation cools the body; the dissolved wastes are a side benefit.');
mc(4, 'disorders', 'Which statement about haemodialysis is correct?', 'The cleared blood is returned to the body through a vein after adding anti-heparin', ['Blood is taken from a vein and returned to an artery', 'Heparin is added when blood returns to the body', 'The dialysing fluid is richer in urea than blood'], 'Blood is taken from an artery, heparin is added, and after dialysis anti-heparin is added before the blood is returned through a vein.', 'Heparin is added before, anti-heparin after.');
mc(4, 'disorders', 'Which of the following can cause renal calculi?', 'Crystallised oxalates or other salts in the kidney', ['Excess albumin', 'Excess ADH', 'Excess glucose in blood'], 'A stone forms from insoluble crystalline salts; oxalate stones are common.');
mc(4, 'nitrogenous wastes', 'In which pair do both animals excrete mainly uric acid?', 'Lizard and pigeon', ['Frog tadpole and carp', 'Rabbit and cow', 'Shark and snake'], 'Reptiles and birds are uricotelic. Tadpoles and carp are ammonotelic; rabbit and cow are ureotelic; sharks are ureotelic.', 'Tadpoles excrete ammonia, adult land frogs excrete urea.');
mc(4, 'human excretory system', 'Pick the correct dimension for an adult human kidney.', '10-12 cm long, 5-7 cm wide, 2-3 cm thick', ['1-2 cm long, 5-7 cm wide', '20-25 cm long, 10-12 cm wide', '10-12 mm long, 5-7 mm wide'], 'These are the standard NCERT dimensions. The weight is 120-170 g.');
mc(4, 'mixed', 'Which one of the following is both an excretory and a nutrient-conserving step?', 'Selective reabsorption of glucose and secretion of H+ in the PCT', ['Filtration of proteins', 'Micturition', 'Release of ANF'], 'The PCT takes back useful glucose and amino acids and removes extras like H+, so it does both jobs.');
mc(4, 'mixed', 'Which hormone from the neurohypophysis and which from the adrenal cortex both increase water retention?', 'ADH and aldosterone', ['Oxytocin and cortisol', 'ANF and renin', 'Adrenaline and ADH'], 'ADH makes the tubule permeable to water; aldosterone raises Na+ reabsorption so water follows.');
mc(4, 'urine formation', 'The proximal convoluted tubule is the main site for', 'reabsorption of glucose, amino acids and most of water', ['concentrating the urine', 'secretion of renin', 'formation of ADH'], 'It handles 70-80 per cent of the water and electrolytes. Concentration of urine is done in the loop and collecting duct.');

// ---------------------------------------------------------------- Level 5
mc(5, 'urine formation', 'Which of the following would reduce the glomerular filtration rate?', 'Constriction of the afferent arteriole', ['Constriction of the efferent arteriole to a small degree', 'Widening of the afferent arteriole', 'Raised blood pressure inside the glomerulus'], 'GFR depends on the pressure inside the glomerulus. Narrowing the afferent arteriole lets less blood in and lowers pressure. Mild narrowing of the efferent arteriole raises pressure.', 'Both arterioles constrict, but with opposite effects on pressure.');
mc(5, 'urine formation', 'A person has a GFR of 125 mL/min and passes 1.2 L of urine a day. Which statement about water is correct?', 'About 178.8 L of water is reabsorbed per day', ['About 1.2 L of water is reabsorbed', 'About 180 L of water is secreted', 'About 125 L of water is reabsorbed'], '180 - 1.2 = 178.8 L is reabsorbed. Nothing is secreted as water in any quantity.');
mc(5, 'countercurrent', 'In the kidney of a person who is dehydrated, the following occurs. Pick the correct combination.', 'High ADH, more water reabsorbed in the collecting duct, small volume of urine with high osmolarity', ['Low ADH, more water reabsorbed, dilute urine', 'High ADH, less water reabsorbed, dilute urine', 'Low ADH, less water reabsorbed, concentrated urine'], 'Dehydration raises osmolarity, ADH is released and the collecting duct becomes permeable to water so that urine is concentrated.');
mc(5, 'regulation', 'Which of these would NOT increase blood pressure through the kidney?', 'Release of ANF', ['Release of renin', 'Formation of angiotensin II', 'Release of aldosterone'], 'ANF lowers blood pressure through vasodilation. The other three raise it.');
mc(5, 'regulation', 'A drug blocks the conversion of angiotensin I to angiotensin II. Which result is expected?', 'Lower aldosterone, less Na+ reabsorption, lower blood pressure', ['More aldosterone', 'More renin has no effect', 'Higher blood pressure'], 'Angiotensin II is the signal for aldosterone release and for vasoconstriction. Blocking it lowers both.');
mc(5, 'countercurrent', 'In a diagram of the nephron, which sequence of osmolarity (increasing) is correct for the fluid inside a juxtamedullary nephron at the cortex-to-tip positions of the descending limb?', 'Equal to 300, then 600, then 900, then 1200 mOsmol/L', ['1200, 900, 600, 300', '300, 300, 300, 300', '100, 200, 300, 400'], 'In the descending limb water leaves into a more concentrated medulla, so the fluid concentration rises to equal that of the surroundings at the loop tip.');
mc(5, 'mixed', 'Select the incorrect statement about nephron function.', 'Ammonia is secreted mainly in the glomerulus', ['H+ is secreted in the PCT and DCT', 'Glucose is absorbed in the PCT', 'Urea passes into the thin ascending limb'], 'Tubular secretion, not filtration, adds ammonia. Ammonia, K+ and H+ are secreted by tubule cells.');
mc(5, 'mixed', 'Which of the following correctly shows an excretory organ and the waste it mainly removes?', 'Liver - bilirubin', ['Lungs - bilirubin', 'Skin - bile salts', 'Kidney - carbon dioxide'], 'The liver excretes bile pigments; the lungs excrete CO2; sweat carries NaCl and a little urea.');
mc(5, 'nitrogenous wastes', 'How many of these animals are uricotelic: pigeon, lizard, cockroach, land snail, frog tadpole, rabbit?', 'Four', ['Three', 'Five', 'Two'], 'Pigeon, lizard, cockroach and land snail are uricotelic. The tadpole is ammonotelic and the rabbit is ureotelic.', 'Count the insect and the snail, which are easily forgotten.');
mc(5, 'human excretory system', 'Which pair of structures is in the cortex of the kidney?', 'Malpighian body and PCT', ['Loop of Henle and vasa recta', 'Collecting duct only and calyx', 'Renal pelvis and ureter'], 'The renal corpuscle, PCT and DCT lie in the cortex. The loop and collecting duct extend into the medulla.');

// ---------------------------------------------------------------- Assertion-reason
asr(2, 'nitrogenous wastes', 'Birds can live without drinking much water and excrete uric acid.', 'Uric acid is a very toxic and highly soluble waste.', 2, 'A is true: uric acid is excreted as a semi-solid paste with little water. R is false: uric acid is the least toxic and sparingly soluble.');
asr(2, 'nitrogenous wastes', 'Aquatic animals like fishes excrete ammonia.', 'Ammonia is highly soluble and can be removed by diffusion into surrounding water.', 0, 'Both are true. Large amounts of water around the animal dilute the ammonia, so it can be excreted without a special system.');
asr(3, 'urine formation', 'Plasma proteins are absent from the glomerular filtrate.', 'The filtration membrane is too fine for large molecules.', 0, 'Podocyte slit pores and the basement membrane hold back large molecules, so the filtrate is protein-free.');
asr(3, 'urine formation', 'The PCT has a brush-border epithelium.', 'Microvilli increase the surface area for reabsorption.', 0, 'Both are true and R explains A.');
asr(3, 'countercurrent', 'The descending limb of the loop of Henle makes the filtrate more concentrated.', 'It is permeable to NaCl but impermeable to water.', 2, 'A is true. R is false: it is permeable to water and almost impermeable to salts, so water leaves.', 'The permeabilities of the two limbs are easily swapped.');
asr(3, 'regulation', 'ANF acts as a check on the renin-angiotensin mechanism.', 'ANF causes vasodilation and so reduces blood pressure.', 0, 'The mechanism raises blood pressure; ANF lowers it by dilating vessels, so ANF acts as a check.');
asr(3, 'regulation', 'ADH prevents diuresis.', 'ADH makes the DCT and collecting duct more permeable to water.', 0, 'Higher water permeability allows water to be reabsorbed, so less urine is formed.');
asr(4, 'disorders', 'In haemodialysis, glucose is not lost from the blood.', 'The dialysing fluid has the same glucose concentration as plasma.', 0, 'No concentration gradient for glucose exists, so it does not leave blood. The fluid is the same as plasma except for nitrogenous wastes.');
asr(4, 'regulation', 'A fall in GFR leads to release of renin by the macula densa of the distal convoluted tubule only.', 'JG cells of the afferent arteriole secrete renin.', 3, 'A is false: JG cells, not the DCT alone, release renin. R is true.', 'The JGA includes both DCT cells and afferent arteriole JG cells; renin is made by JG cells.');
asr(4, 'urine formation', 'Glucose appears in the urine of a patient with diabetes mellitus.', 'Tubular reabsorption of glucose is passive and has no upper limit.', 2, 'A is true: when blood glucose is high, the filtered glucose exceeds the ability of the tubules to take it back. R is false: glucose is actively reabsorbed with a maximum rate.');
asr(5, 'nephron structure', 'Cortical nephrons have little role in making concentrated urine.', 'The vasa recta is absent or reduced in cortical nephrons and their loops are very short.', 0, 'A and R are true, and R is the reason: the concentration gradient needs long loops with vasa recta, as in juxtamedullary nephrons.');
asr(2, 'micturition', 'The urethral sphincter relaxes during micturition.', 'Stretch receptors in the bladder wall are stimulated by filling.', 1, 'Both are true, but R does not explain relaxation of the sphincter; that is a motor command from the CNS in response to the signals.');

// ---------------------------------------------------------------- Statements
stm(2, 'human excretory system', 'The human kidney has about one million nephrons.', 'Kidneys lie on the ventral wall of the abdominal cavity.', 2, 'Statement I is correct. Statement II is wrong: kidneys lie against the dorsal inner wall of the abdominal cavity.');
stm(2, 'nitrogenous wastes', 'Ureotelic animals excrete urea made in the liver.', 'Some urea may be retained in the kidney matrix to keep osmolarity.', 0, 'Both are correct: the liver forms urea by the ornithine cycle, and retention in the matrix helps maintain the gradient.');
stm(3, 'urine formation', 'Glomerular filtration takes place at a rate of about 125 mL/min.', 'About 99 per cent of the filtrate is reabsorbed.', 0, 'Both are correct: 180 L filtrate per day and 1.5 L urine means about 99 per cent is reabsorbed.');
stm(3, 'urine formation', 'The loop of Henle reabsorbs most of the water and electrolytes.', 'The PCT reabsorbs nearly all essential nutrients.', 3, 'Statement I is incorrect: the PCT reabsorbs 70-80 per cent of water and electrolytes and the loop reabsorbs only a little. Statement II is correct.');
stm(3, 'regulation', 'Renin is a hormone that constricts blood vessels.', 'Angiotensin II is a powerful vasoconstrictor.', 3, 'Renin is an enzyme released by JG cells that acts on angiotensinogen. Statement I is incorrect. Statement II is correct.');
stm(3, 'regulation', 'Aldosterone increases reabsorption of Na+ and water.', 'It is secreted by the adrenal medulla.', 2, 'The first is correct. Aldosterone is secreted by the adrenal cortex, so Statement II is incorrect.');
stm(3, 'disorders', 'Uremia is the condition of accumulation of urea in blood.', 'Glycosuria and ketonuria are signs of renal calculi.', 2, 'Statement I is correct. Statement II is incorrect: they signal diabetes mellitus.');
stm(4, 'countercurrent', 'The descending limb of the vasa recta takes up NaCl from the interstitium.', 'The ascending limb of the vasa recta returns NaCl to the interstitium.', 0, 'Both are correct: the exchange of NaCl between loop and vasa recta keeps the gradient.');
stm(4, 'urine formation', 'Tubular secretion of H+, K+ and ammonia helps maintain acid-base balance.', 'Tubular secretion happens only in the proximal convoluted tubule.', 2, 'Statement I is correct. The PCT, DCT and collecting duct all secrete; Statement II is incorrect.');
stm(4, 'other organs', 'The liver eliminates bilirubin and cholesterol.', 'Sweat glands eliminate sterols and waxes.', 2, 'The first is correct. Sterols, hydrocarbons and waxes are eliminated by sebaceous glands, not sweat glands.');
stm(5, 'urine formation', 'Podocytes, basement membrane and endothelium of glomerular capillaries are the three layers of the filtration barrier.', 'The slits between pedicels of podocytes are called filtration slits.', 0, 'Both are correct. The slit pores are the final barrier for small molecules.');
mc(3, 'nitrogenous wastes', 'Consider: (i) ammonia is excreted by gills; (ii) urea is formed in the kidney; (iii) uric acid is excreted as a paste; (iv) aquatic insects are uricotelic. How many are correct?', 'Two', ['One', 'Three', 'Four'], '(i) and (iii) are correct. Urea is made in the liver, not the kidney (ii), and aquatic insects are ammonotelic (iv).', 'Do not confuse insects in general (uricotelic) with aquatic insects (ammonotelic).', 'statements');
mc(4, 'urine formation', 'How many of these are reabsorbed mainly by active transport: glucose, water, Na+, amino acids, urea?', 'Three', ['Two', 'Four', 'Five'], 'Glucose, Na+ and amino acids are actively reabsorbed. Water and urea are passive.', 'Na+ is both active and passive at different sites but is mainly active.', 'statements');
mc(4, 'regulation', 'Which statements are correct? (a) ADH is released by osmoreceptor stimulation; (b) ANF is released by the atria; (c) JG cells release aldosterone; (d) renin is secreted when GFR falls.', '(a), (b) and (d) only', ['(a), (b) and (c) only', '(b), (c) and (d) only', '(a) and (c) only'], 'Aldosterone comes from the adrenal cortex, so (c) is wrong. The others are correct.', null, 'statements');
mc(5, 'disorders', 'Which of the following is NOT correct about kidney failure management?', 'Dialysis replaces all functions of the kidney including hormone secretion', ['Haemodialysis uses a cellophane membrane', 'Transplantation is the ultimate method', 'Donor from a close relative reduces rejection'], 'Dialysis removes wastes but cannot replace every kidney function. The other three are correct.', null, 'statements');

// ---------------------------------------------------------------- Match
match(2, 'nitrogenous wastes', 'm1', 'Animals and the main nitrogenous waste', ['A. Bony fish', 'B. Mammals', 'C. Birds', 'D. Aquatic amphibians'], ['p. Uric acid', 'q. Ammonia', 'r. Urea'], 'A-q, B-r, C-p, D-q', ['A-r, B-q, C-p, D-q', 'A-q, B-p, C-r, D-q', 'A-p, B-r, C-q, D-q'], 'Bony fishes and aquatic amphibians excrete ammonia, mammals excrete urea and birds excrete uric acid.');
match(3, 'excretory organs', 'm2', 'Animal and excretory organ', ['A. Planaria', 'B. Earthworm', 'C. Cockroach', 'D. Prawn'], ['p. Antennal glands', 'q. Malpighian tubules', 'r. Nephridia', 's. Flame cells'], 'A-s, B-r, C-q, D-p', ['A-r, B-s, C-q, D-p', 'A-s, B-r, C-p, D-q', 'A-q, B-r, C-s, D-p'], 'Flatworms use flame cells; earthworms nephridia; cockroaches Malpighian tubules; prawns antennal glands.');
match(3, 'nephron structure', 'm3', 'Part of nephron and function', ['A. Glomerulus', 'B. PCT', 'C. Descending limb', 'D. Collecting duct'], ['p. Reabsorbs nutrients', 'q. Ultrafiltration', 'r. Water leaves, filtrate becomes concentrated', 's. Final concentration of urine'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'], 'Glomerulus filters, PCT reabsorbs nutrients, the descending limb loses water, the collecting duct makes the urine concentrated.');
match(3, 'regulation', 'm4', 'Substance and source', ['A. Renin', 'B. ADH', 'C. ANF', 'D. Aldosterone'], ['p. Atria of the heart', 'q. JG cells', 'r. Adrenal cortex', 's. Neurohypophysis'], 'A-q, B-s, C-p, D-r', ['A-q, B-p, C-s, D-r', 'A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p'], 'JG cells make renin; the neurohypophysis releases ADH; atria secrete ANF; the adrenal cortex secretes aldosterone.');
match(4, 'other organs', 'm5', 'Organ and the substance it removes', ['A. Lungs', 'B. Liver', 'C. Sweat glands', 'D. Sebaceous glands'], ['p. Bilirubin', 'q. Carbon dioxide', 'r. Sterols and waxes', 's. NaCl and a little urea'], 'A-q, B-p, C-s, D-r', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-s, B-p, C-q, D-r'], 'Lungs remove CO2, liver bilirubin, sweat glands NaCl and a little urea, and sebaceous glands sterols and waxes.');
match(4, 'disorders', 'm6', 'Disorder and feature', ['A. Uremia', 'B. Glomerulonephritis', 'C. Renal calculi', 'D. Glycosuria'], ['p. Inflamed glomeruli', 'q. Insoluble crystals in the kidney', 'r. Glucose in urine', 's. Excess urea in blood'], 'A-s, B-p, C-q, D-r', ['A-p, B-s, C-q, D-r', 'A-s, B-q, C-p, D-r', 'A-r, B-p, C-q, D-s'], 'Uremia is high blood urea; glomerulonephritis is inflammation of glomeruli; stones are crystals; glycosuria is glucose in urine.');

// ---------------------------------------------------------------- Passages
pass('p1', 'Passage: a day in the life of a kidney', 'A healthy adult has a glomerular filtration rate of 125 mL/min. Per day, about 180 litres of filtrate are formed, but only about 1.5 litres of urine leave the body. About 75 per cent of the filtrate is reabsorbed in the proximal convoluted tubule. The loop of Henle and vasa recta set up an osmolarity gradient in the medulla from 300 to 1200 mOsmol/L. ADH controls the permeability of the later part of the tubule.');
pq('p1', 3, 'urine formation', 'How much filtrate remains after the PCT has done its work?', '45 litres per day', ['135 litres per day', '1.5 litres per day', '180 litres per day'], '25 per cent of 180 L remains, which is 45 L.');
pq('p1', 3, 'countercurrent', 'The maximum concentration of urine relative to the filtrate is', 'four times', ['two times', 'eight times', 'twelve times'], '1200 divided by 300 gives 4.');
pq('p1', 4, 'regulation', 'If ADH release stops, the collecting duct becomes', 'less permeable to water and the urine more dilute', ['more permeable and the urine more concentrated', 'impermeable to salts only', 'unchanged'], 'ADH raises water permeability. Without it water stays in the tubule.');
pass('p2', 'Passage: a patient with kidney trouble', 'A patient complains of puffiness of the face and passes froth-like urine. A urine test shows plasma proteins, red cells and raised blood urea. A biopsy reveals inflamed glomeruli. The doctor starts haemodialysis; blood is drawn from an artery, passed through a dialysing unit with cellophane tubes and returned to the body through a vein.');
pq('p2', 3, 'disorders', 'The condition most likely to be diagnosed is', 'glomerulonephritis', ['diabetes insipidus', 'renal calculi', 'cystitis'], 'Inflamed glomeruli with proteins and cells leaking into urine and raised urea point to glomerulonephritis.');
pq('p2', 3, 'disorders', 'Why can proteins and cells appear in urine here?', 'The filtration membrane is damaged', ['The loop of Henle secretes them', 'ADH is excessive', 'The ureter is blocked'], 'The glomerular membrane normally holds back proteins and cells; damage lets them through.');
pq('p2', 4, 'disorders', 'What is added before the cleared blood is returned to the body?', 'Anti-heparin', ['Heparin', 'Urea', 'Plasma proteins'], 'Heparin is added at the start to prevent clotting; anti-heparin is added before the blood is returned.');
pass('p3', 'Passage: urine tests', 'A urine sample is slightly acidic, light yellow and contains glucose and ketone bodies. The person has increased thirst and passes a large volume of urine. A second person has low ADH and passes 15 litres of very dilute urine a day without glucose.');
pq('p3', 3, 'disorders', 'The first person shows signs of', 'diabetes mellitus', ['diabetes insipidus', 'uremia', 'renal calculi'], 'Glucose (glycosuria) and ketone bodies (ketonuria) indicate diabetes mellitus.');
pq('p3', 3, 'regulation', 'The second person is most likely to have', 'diabetes insipidus due to low ADH', ['diabetes mellitus', 'glomerulonephritis', 'excess aldosterone'], 'Low ADH leaves the collecting duct impermeable to water and the urine is dilute and abundant.');

// ---------------------------------------------------------------- Extra fillers: concept variety
mc(2, 'urine formation', 'A rise in the osmolarity of blood is detected by', 'osmoreceptors', ['stretch receptors of the bladder', 'baroreceptors of the JGA only', 'podocytes'], 'Osmoreceptors in the body, especially in the hypothalamus, trigger ADH release.');
mc(3, 'human excretory system', 'In the medulla of the human kidney, the pyramids', 'project into the calyces', ['lie in the cortex', 'form the Bowman\'s capsule', 'are the renal arteries'], 'The medulla is divided into pyramids that project into calyces. The cortex extends between them as columns.');
mc(3, 'nephron structure', 'The peritubular capillaries arise from', 'the efferent arteriole', ['the afferent arteriole', 'the renal vein', 'the ureter'], 'The efferent arteriole from the glomerulus forms the fine capillary network around the renal tubule.');
mc(3, 'nephron structure', 'The vasa recta is a', 'minute vessel network running parallel to the loop of Henle in a U-shape', ['vessel that carries blood to the glomerulus', 'tube that carries urine', 'valve of the bladder'], 'It comes from the efferent arteriole and takes part in the countercurrent exchange.');
mc(2, 'nitrogenous wastes', 'The process by which the nitrogenous wastes are removed from the body is called', 'excretion', ['egestion', 'secretion', 'ingestion'], 'Excretion removes metabolic waste. Egestion removes undigested matter.', 'Egestion and excretion are different.');
mc(4, 'nitrogenous wastes', 'Which of the following is the correct ranking of nitrogenous wastes from most toxic to least toxic?', 'Ammonia, urea, uric acid', ['Uric acid, urea, ammonia', 'Urea, ammonia, uric acid', 'Ammonia, uric acid, urea'], 'Ammonia is most toxic and uric acid least toxic, with urea in between.');
mc(3, 'micturition', 'In the micturition reflex, the motor message from the CNS causes', 'contraction of the smooth muscle of the bladder', ['relaxation of the bladder wall', 'contraction of the urethral sphincter', 'closing of the ureter'], 'The bladder contracts and the urethral sphincter relaxes at the same time.');
mc(3, 'urine formation', 'The first step of urine formation is', 'glomerular filtration', ['tubular reabsorption', 'tubular secretion', 'micturition'], 'The sequence is filtration, reabsorption, secretion, then excretion.');
mc(5, 'urine formation', 'Which of the following does NOT occur in the proximal convoluted tubule?', 'Release of renin', ['Reabsorption of HCO3-', 'Secretion of ammonia and H+', 'Reabsorption of amino acids'], 'Renin is released from JG cells of the afferent arteriole, not by the PCT.');
mc(4, 'disorders', 'Why is the donor for a kidney transplant preferably a close relative?', 'To reduce the chance of immune rejection', ['Because their kidneys are larger', 'Because their blood has more urea', 'Because they have more nephrons'], 'Similar tissue proteins on the cells reduce the immune response.');
mc(3, 'regulation', 'The fall in blood volume stimulates', 'release of ADH and activation of the renin-angiotensin system', ['release of ANF', 'secretion of more urine', 'relaxation of the sphincter'], 'ADH conserves water and the renin-angiotensin system conserves Na+ and water.');

export default { topic: 'excretion', groups, items, gens: makeGens() };

function makeGens() {
  const gens = [];
  gens.push({
    id: 'ex-g01', type: 'nat', level: 2, exams: E, sub: 'GFR',
    make(rng) {
      const gfr = pick(rng, 100, 140, 5);
      const a = +(gfr * 1440 / 1000).toFixed(2);
      return { q: `A person has a glomerular filtration rate of ${gfr} mL per minute. How many litres of filtrate are formed in a day?`, answer: a, tol: 0.5, unit: 'L', gfr, sol: `Idea: multiply the rate by the minutes in a day.<br>Minutes in a day = 24 × 60 = 1440.<br>Filtrate = ${gfr} × 1440 = ${gfr * 1440} mL = ${a} L.` };
    },
    verify(p) { return p.gfr * 60 * 24 / 1000; },
  });
  gens.push({
    id: 'ex-g02', type: 'nat', level: 3, exams: E, sub: 'reabsorption',
    make(rng) {
      const v = pick(rng, 1.0, 2.0, 0.1);
      const a = +((180 - v) / 180 * 100).toFixed(2);
      return { q: `The filtrate formed in a day is 180 litres and the person passes ${v} litres of urine. What percentage of the filtrate is reabsorbed? Give the answer to two decimals.`, answer: a, tol: 0.05, unit: '%', v, sol: `Idea: reabsorbed = filtrate minus urine.<br>Reabsorbed = 180 - ${v} = ${+(180 - v).toFixed(2)} L.<br>Percentage = ${+(180 - v).toFixed(2)} / 180 × 100 = ${a} per cent.` };
    },
    verify(p) { return (1 - p.v / 180) * 100; },
  });
  gens.push({
    id: 'ex-g03', type: 'nat', level: 3, exams: E, sub: 'PCT',
    make(rng) {
      const f = pick(rng, 70, 80, 5);
      const a = +(125 * (1 - f / 100)).toFixed(3);
      return { q: `The GFR is 125 mL/min and the proximal convoluted tubule reabsorbs ${f} per cent of the filtrate. How many mL per minute pass on to the loop of Henle?`, answer: a, tol: 0.05, unit: 'mL/min', f, sol: `Idea: the part not reabsorbed moves on.<br>Fraction left = 1 - ${f}/100 = ${+(1 - f / 100).toFixed(2)}.<br>Flow = 125 × ${+(1 - f / 100).toFixed(2)} = ${a} mL per minute.` };
    },
    verify(p) { return 125 - 125 * p.f / 100; },
  });
  gens.push({
    id: 'ex-g04', type: 'nat', level: 2, exams: E, sub: 'renal blood flow',
    make(rng) {
      const b = pick(rng, 1100, 1200, 50);
      const a = +(b * 1440 / 1000).toFixed(2);
      return { q: `The kidneys receive ${b} mL of blood per minute. How many litres of blood pass through them in 24 hours?`, answer: a, tol: 1, unit: 'L', b, sol: `Idea: flow per minute times 1440 minutes.<br>${b} × 1440 = ${b * 1440} mL = ${a} L.` };
    },
    verify(p) { return p.b * 24 * 60 / 1000; },
  });
  gens.push({
    id: 'ex-g05', type: 'nat', level: 3, exams: E, sub: 'renal blood flow',
    make(rng) {
      const c = choose(rng, [5.0, 5.5, 6.0]);
      const a = +(1.2 / c * 100).toFixed(1);
      return { q: `The kidneys receive 1200 mL of blood per minute and the cardiac output is ${c} L per minute. What percentage of the cardiac output goes to the kidneys? Give one decimal.`, answer: a, tol: 0.1, unit: '%', c, sol: `Idea: convert both to the same unit.<br>1200 mL = 1.2 L.<br>Percentage = 1.2 / ${c} × 100 = ${a} per cent, near one fifth.` };
    },
    verify(p) { return 1200 / (p.c * 1000) * 100; },
  });
  gens.push({
    id: 'ex-g06', type: 'nat', level: 3, exams: E, sub: 'concentration',
    make(rng) {
      const u = pick(rng, 600, 1200, 100);
      const a = +(u / 300).toFixed(2);
      return { q: `The glomerular filtrate has an osmolarity of 300 mOsmol/L and the urine of a person has ${u} mOsmol/L. By how many times is the urine more concentrated than the filtrate?`, answer: a, tol: 0.01, unit: 'times', u, sol: `Idea: divide urine osmolarity by filtrate osmolarity.<br>${u} / 300 = ${a} times. The most that human kidneys can reach is 1200 / 300 = 4 times.` };
    },
    verify(p) { return p.u / 300; },
  });
  gens.push({
    id: 'ex-g07', type: 'nat', level: 4, exams: E, sub: 'nephron number',
    make(rng) {
      const N = choose(rng, [0.8, 1.0, 1.2, 1.25]);
      const a = +(125 / (2 * N)).toFixed(2);
      return { q: `Each kidney has ${N} million nephrons and the GFR is 125 mL/min for both kidneys together. Find the filtrate formed per nephron per minute in nanolitres (1 mL = 10<sup>6</sup> nL).`, answer: a, tol: 0.05, unit: 'nL/min', N, sol: `Idea: GFR is for both kidneys, so divide by the total number of nephrons.<br>Total nephrons = 2 × ${N} million = ${+(2 * N).toFixed(2)} million.<br>GFR = 125 × 10<sup>6</sup> nL/min.<br>Per nephron = 125 × 10<sup>6</sup> / (${+(2 * N).toFixed(2)} × 10<sup>6</sup>) = ${a} nL/min.`, trap: 'Using one kidney instead of two doubles the answer.' };
    },
    verify(p) { return 125e6 / (2 * p.N * 1e6); },
  });
  gens.push({
    id: 'ex-g08', type: 'nat', level: 3, exams: E, sub: 'water balance',
    make(rng) {
      const r = pick(rng, 0.8, 1.5, 0.1);
      const a = +(125 - r).toFixed(2);
      return { q: `A person with a GFR of 125 mL/min passes urine at ${r} mL/min. How many mL of water are reabsorbed every minute?`, answer: a, tol: 0.02, unit: 'mL/min', r, sol: `Idea: what is filtered but not excreted is reabsorbed.<br>125 - ${r} = ${a} mL per minute.` };
    },
    verify(p) { return 125 - p.r; },
  });
  gens.push({
    id: 'ex-g09', type: 'mcq', level: 3, exams: E, sub: 'filtrate',
    make(rng) {
      const gfr = pick(rng, 90, 140, 10);
      const a = +(gfr * 1.44).toFixed(1);
      const o = numOpts(rng, a, [gfr * 0.144, gfr * 14.4, gfr * 0.72], 'L');
      return { q: `If the GFR is ${gfr} mL/min, what is the filtrate formed per day?`, options: o.options, answer: o.answer, gfr, opts: o.options, sol: `Idea: multiply by 1440 min and convert mL to L.<br>${gfr} × 1440 = ${gfr * 1440} mL = ${a} L.<br>Options with a different power of ten come from a slip in the mL to L conversion.` };
    },
    verify(p) { return p.opts.findIndex((t) => t.startsWith(fmt(p.gfr * 60 * 24 / 1000, 3) + ' ')); },
  });
  gens.push({
    id: 'ex-g10', type: 'nat', level: 3, exams: E, sub: 'urea excretion',
    make(rng) {
      const c = pick(rng, 15, 25, 1);
      const a = +(c * 1.5).toFixed(1);
      return { q: `The urine of an adult contains ${c} g of urea per litre and the person passes 1.5 litres per day. How many grams of urea are excreted per day?`, answer: a, tol: 0.1, unit: 'g', c, sol: `Idea: mass = concentration times volume.<br>${c} g/L × 1.5 L = ${a} g, close to the 25-30 g per day for an adult.` };
    },
    verify(p) { return p.c * 3 / 2; },
  });
  return gens;
}
