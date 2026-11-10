// fibub's own plain-English glossary of medical WORDS (not of anyone's results). Wording is ours.
// Line format: kind|term|aliases (;)|plain.  kind: p prescription, l lab, r report word, i imaging, b body word.
// A "!" after the kind marks a word that can sound frightening: the definition stays neutral and a standard sentence is added.
export type Kind = 'prescription' | 'lab' | 'report' | 'imaging' | 'body';
export interface Term { term: string; aliases: string[]; kind: Kind; plain: string }

const CARE = ' Your doctor can explain what it means in your report.';
const KINDS: Record<string, Kind> = { p: 'prescription', l: 'lab', r: 'report', i: 'imaging', b: 'body' };

const RAW = `
p|od|o.d.;once daily|Once a day. A short way of writing the timing on a prescription.
p|bd|bid;b.d.;b.i.d.;twice daily|Twice a day.
p|tds|tid;t.d.s.;t.i.d.;three times daily|Three times a day.
p|qid|qds;q.i.d.;q.d.s.;four times daily|Four times a day.
p|qd|q.d.;every day|Every day.
p|prn|p.r.n.;as needed|As needed, only when required rather than on a fixed schedule.
p|stat|immediately|Straight away, as a single immediate instruction.
p|po|p.o.;by mouth;per os|By mouth, swallowed.
p|sl|s.l.;sublingual|Under the tongue, where the medicine dissolves.
p|im|i.m.;intramuscular|Into a muscle, usually by injection.
p|iv|i.v.;intravenous|Into a vein, through a needle or a thin tube.
p|sc|s.c.;subcut;subcutaneous|Under the skin, usually by a small injection.
p|pr|per rectum|Through the back passage (rectum).
p|pv|per vaginam|Through the vagina.
p|mane|in the morning|In the morning.
p|nocte|at night|At night.
p|om|o.m.|Every morning.
p|ac|a.c.;before meals|Before meals.
p|pc|p.c.;after meals|After meals.
p|hs|h.s.;at bedtime|At bedtime.
p|qh|q.h.;every hour|Every hour.
p|q4h|every 4 hours|Every four hours.
p|q6h|every 6 hours|Every six hours.
p|q8h|every 8 hours|Every eight hours.
p|q12h|every 12 hours|Every twelve hours.
p|npo|nbm;nil by mouth|Nothing by mouth: no food or drink for now, as instructed by the care team.
p|rx|prescription|A prescription, the written instruction for a medicine.
p|tab|tabs;tablet|A tablet.
p|cap|caps;capsule|A capsule.
p|gtt|gtts;drops|Drops, such as eye, ear or nose drops.
p|inj|injection|An injection.
p|syp|syrup|A liquid medicine taken by mouth, sweetened to make it easier to swallow.
p|susp|suspension|A liquid with tiny solid particles in it that settle, so it is shaken before use.
p|oint|ointment|A greasy preparation spread on the skin.
p|topical||Put on the skin surface rather than swallowed.
p|inh|inhaled;inhalation|Breathed in, usually through an inhaler.
p|neb|nebuliser;nebulizer|A device that turns liquid medicine into a mist to breathe in.
p|ung|unguent|An old word for ointment.
p|ou|o.u.|Both eyes.
p|od eye|o.d. eye;right eye|The right eye (in eye prescriptions, OD means right eye).
p|os|o.s.;left eye|The left eye (in eye prescriptions, OS means left eye).
p|aa|affected area|The area affected, such as a patch of skin.
p|sig|directions|Short for the directions written on a prescription.
p|disp|dispense|The amount the pharmacy is asked to hand over.
p|refill|repeat|Permission to collect the same prescription again.
p|otc|over the counter|Sold without a prescription.
p|ud|ut dict|As directed.
p|c/o|complains of|Short for "complains of": what the person reported.
p|dx|diagnosis|Diagnosis, the name given to a condition.
p|hx|history|History, such as medical history.
p|sx|symptoms|Symptoms, what a person feels or notices.
p|tx|treatment|Treatment.
p|fx|fracture|A broken bone.
p|rr|resp rate;respiratory rate|Respiratory rate, the number of breaths per minute.
p|hr|heart rate|Heart rate, the number of heartbeats per minute.
p|bp|blood pressure|Blood pressure: the force of blood against the walls of the blood vessels, written as two numbers.
p|temp|temperature|Body temperature.
p|spo2|oxygen saturation;o2 sat|Oxygen saturation: the share of the blood's carriers that hold oxygen, measured by a clip on the finger.
p|bmi|body mass index|Body mass index: weight divided by height squared. A number, not a verdict.
p|nkda|no known drug allergies|No known drug allergies: none have been recorded.
p|ecg|ekg;electrocardiogram|A recording of the heart's electrical activity from stickers on the chest.
p|opd|outpatient|A visit where you go home the same day.
p|ipd|inpatient|Staying in hospital.
p|icu|intensive care|The hospital unit for people who need close monitoring.
p|er|emergency department|The emergency department.
p|gp|general practitioner|A general (family) doctor.
p|bmr|basal metabolic rate|The energy the body uses at rest.
l|cbc|fbc;full blood count;complete blood count;blood count|A common blood test that counts the different cells in the blood: red cells, white cells and platelets.
l|hemoglobin|haemoglobin;hb;hgb|The protein in red blood cells that carries oxygen. Reported in g/dL or g/L.
l|hematocrit|haematocrit;hct;pcv;packed cell volume|The share of the blood's volume taken up by red blood cells.
l|wbc|white blood cells;white cell count;tlc;leukocytes;leucocytes|White blood cells, the cells of the immune system. The test counts them.
l|rbc|red blood cells;red cell count;erythrocytes|Red blood cells, which carry oxygen. The test counts them.
l|plt|platelets;platelet count;thrombocytes|Platelets, tiny cell pieces that help blood clot. The test counts them.
l|mcv|mean corpuscular volume;mean cell volume|The average size of the red blood cells.
l|mch|mean corpuscular hemoglobin;mean cell haemoglobin|The average amount of haemoglobin in one red blood cell.
l|mchc|mean corpuscular hemoglobin concentration|The average concentration of haemoglobin inside red blood cells.
l|rdw|red cell distribution width|How much the sizes of the red blood cells vary.
l|mpv|mean platelet volume|The average size of the platelets.
l|neutrophils|neut;neutrophil|The most common type of white blood cell. The test counts them or gives their share.
l|lymphocytes|lymph;lymphocyte|A type of white blood cell. The test counts them or gives their share.
l|monocytes|mono;monocyte|A type of white blood cell. The test counts them or gives their share.
l|eosinophils|eos;eosinophil|A type of white blood cell. The test counts them or gives their share.
l|basophils|baso;basophil|A type of white blood cell. The test counts them or gives their share.
l|esr|erythrocyte sedimentation rate;sed rate|How fast red blood cells settle in a tube of blood over one hour.
l|crp|c-reactive protein|C-reactive protein, a protein in the blood that the test measures.
l|hba1c|a1c;glycated hemoglobin;glycosylated haemoglobin;glycated haemoglobin|A blood test showing the average level of glucose attached to haemoglobin over the past couple of months.
l|glucose|blood sugar;fbs;fbg;rbs;fasting glucose;random glucose|The amount of sugar (glucose) in the blood at the time of the test.
l|ppbs|pp glucose;postprandial glucose|Blood sugar measured after a meal.
l|tsh|thyroid stimulating hormone|Thyroid-stimulating hormone, a hormone made by the pituitary gland that signals the thyroid.
l|t3|triiodothyronine;free t3|Triiodothyronine, one of the two main thyroid hormones.
l|t4|thyroxine;free t4|Thyroxine, one of the two main thyroid hormones.
l|alt|sgpt;alanine aminotransferase;alanine transaminase|Alanine aminotransferase, an enzyme found mostly in the liver.
l|ast|sgot;aspartate aminotransferase;aspartate transaminase|Aspartate aminotransferase, an enzyme found in the liver and other tissues.
l|alp|alkaline phosphatase;alk phos|Alkaline phosphatase, an enzyme found in the liver, bones and other tissues.
l|ggt|gamma gt;gamma-glutamyl transferase;gamma glutamyl transferase|Gamma-glutamyl transferase, an enzyme found mostly in the liver.
l|bilirubin|total bilirubin;direct bilirubin;t bil|A yellow substance made when old red blood cells are broken down. The test measures how much is in the blood.
l|albumin|alb|The main protein in blood plasma.
l|total protein|tp|The total amount of protein in the blood.
l|globulin|globulins|A group of proteins in the blood.
l|egfr|estimated gfr;gfr|Estimated glomerular filtration rate: a number worked out from a creatinine result and other details, used to describe how well the kidneys filter blood.
l|creatinine|creat;serum creatinine|A waste product from muscles that the kidneys remove. The test measures how much is in the blood.
l|urea|blood urea|A waste product made when the body uses protein. The test measures it in the blood.
l|bun|blood urea nitrogen|Blood urea nitrogen, another way of reporting urea in the blood.
l|uric acid|urate|A waste product made when the body breaks down certain substances. The test measures it in the blood.
l|sodium||One of the body's salts (electrolytes). The test measures its level in the blood.
l|potassium|k|One of the body's salts (electrolytes). The test measures its level in the blood.
l|chloride|cl|One of the body's salts (electrolytes). The test measures its level in the blood.
l|bicarbonate|hco3;co2;total co2|A salt in the blood that helps keep its acidity steady.
l|calcium|serum calcium|A mineral in the blood that is also found in bones. The test measures its level in the blood.
l|magnesium|serum magnesium|A mineral in the body. The test measures its level in the blood.
l|phosphate|phosphorus|A mineral in the body. The test measures its level in the blood.
l|cholesterol|total cholesterol|A fatty substance in the blood. The test measures the total amount.
l|ldl|ldl cholesterol;ldl-c|Low-density lipoprotein cholesterol, one of the parts of blood cholesterol that is measured separately.
l|hdl|hdl cholesterol;hdl-c|High-density lipoprotein cholesterol, one of the parts of blood cholesterol that is measured separately.
l|triglycerides|tg;trigs;triglyceride|A type of fat in the blood. The test measures how much.
l|vldl|vldl cholesterol|Very-low-density lipoprotein, another part of the blood fats that is measured or worked out.
l|lipid profile|lipid panel;lipids|A group of blood tests for fats: cholesterol, its parts and triglycerides.
l|ferritin|serum ferritin|A protein that stores iron. The test measures it in the blood.
l|iron|serum iron|The amount of iron in the blood.
l|tibc|total iron binding capacity|Total iron-binding capacity: how much iron the blood proteins could carry.
l|transferrin saturation|tsat|The share of the iron-carrying protein (transferrin) that is holding iron.
l|b12|vitamin b12;cobalamin|Vitamin B12. The test measures its level in the blood.
l|folate|folic acid;vitamin b9|Folate, a B vitamin. The test measures its level in the blood.
l|vitamin d|25-oh vitamin d;25-hydroxy vitamin d;vit d|Vitamin D. The test usually measures the form called 25-hydroxyvitamin D in the blood.
l|inr|international normalized ratio;international normalised ratio|International normalised ratio: a standard way of reporting how long blood takes to clot.
l|pt|prothrombin time;pro time|Prothrombin time: how many seconds a blood sample takes to clot in the lab.
l|aptt|ptt;activated partial thromboplastin time|Activated partial thromboplastin time: how many seconds a sample takes to clot with a different trigger.
l|d-dimer|d dimer|A substance released when a blood clot breaks down. The test measures it in the blood.
l|psa|prostate specific antigen|Prostate-specific antigen, a protein made by the prostate that can be measured in the blood.
l|cea|carcinoembryonic antigen|Carcinoembryonic antigen, a protein that can be measured in the blood.
l|troponin|troponin i;troponin t;hs-tnt|A protein found in heart muscle. The test measures how much is in the blood.
l|bnp|nt-probnp|A substance released by the heart. The test measures how much is in the blood.
l|ck|cpk;creatine kinase;creatine phosphokinase|Creatine kinase, an enzyme found in muscle and other tissues.
l|ldh|lactate dehydrogenase|Lactate dehydrogenase, an enzyme found in many tissues.
l|amylase|serum amylase|An enzyme made mostly in the pancreas and salivary glands.
l|lipase|serum lipase|An enzyme made mostly in the pancreas.
l|lactate|lactic acid|A substance made when cells make energy. The test measures its level in the blood.
l|cortisol|serum cortisol|A hormone made by the adrenal glands. The test measures its level.
l|fsh|follicle stimulating hormone|Follicle-stimulating hormone, a hormone made by the pituitary gland.
l|lh|luteinizing hormone|Luteinising hormone, a hormone made by the pituitary gland.
l|estradiol|oestradiol;e2|Estradiol, a form of oestrogen, a sex hormone.
l|progesterone|prog|Progesterone, a sex hormone.
l|testosterone|total testosterone|Testosterone, a sex hormone.
l|prolactin|prl|Prolactin, a hormone made by the pituitary gland.
l|hcg|beta hcg;b-hcg;human chorionic gonadotropin|Human chorionic gonadotropin, a hormone that can be measured in blood or urine.
l|amh|anti-mullerian hormone|Anti-Müllerian hormone, a hormone that can be measured in the blood.
l|insulin|fasting insulin|A hormone that moves sugar from the blood into cells. The test measures its level.
l|pth|parathyroid hormone|Parathyroid hormone, made by small glands in the neck.
l|hiv|hiv test|A test for antibodies or parts of the human immunodeficiency virus.
l|hbsag|hepatitis b surface antigen|A part of the hepatitis B virus that the test looks for.
l|anti-hcv|hcv|A test for antibodies to the hepatitis C virus.
l|vdrl|rpr|A blood screening test for syphilis.
l|ana|antinuclear antibody;antinuclear antibodies|Antinuclear antibodies: proteins that react with parts of the cell nucleus. The test looks for them.
l|rf|rheumatoid factor|Rheumatoid factor, an antibody that can be measured in the blood.
l|anti-ccp|ccp|An antibody test, short for anti-cyclic citrullinated peptide.
l|asot|aso|Antistreptolysin O, an antibody test.
l|urinalysis|urine routine;urine r/m;urine analysis;urine test|A set of simple tests on a urine sample, such as colour, chemicals and cells under a microscope.
l|specific gravity|sg|How concentrated a urine sample is compared with water.
l|ph|urine ph|A measure of how acidic or alkaline something is.
l|ketones|ketone|Substances made when the body burns fat for energy. A urine or blood test can check for them.
l|protein|urine protein|The amount of protein found in a sample, such as urine.
l|acr|albumin creatinine ratio|Albumin-to-creatinine ratio: albumin in urine compared with creatinine, to account for how dilute the urine is.
l|culture|culture and sensitivity|A lab test that grows any germs from a sample, then checks which medicines they respond to.
l|gram stain|gram|A way of colouring a sample so that bacteria show up under a microscope.
l|hpf|hpf field|High-power field, one view through a microscope at high magnification.
l|reference range|ref range;normal range;reference interval;biological reference interval|The span of values that the lab prints beside a result for comparison. It can differ between labs.
l|fasting|fasting sample|Not eating for a set time before a test, as the lab instructs.
l|specimen|sample|The sample sent to the lab, such as blood or urine.
l|titre|titer|A way of reporting an antibody level as the highest dilution that still gives a reaction.
l|serum|serum sample|The clear liquid part of blood after it clots.
l|plasma|plasma sample|The clear liquid part of blood that carries the cells.
l|pap smear|pap test;cervical smear|A sample of cells from the cervix looked at under a microscope.
l|biopsy|tissue sample|A small sample of tissue taken so it can be looked at in a lab.
l|histopathology|histology|Looking at tissue under a microscope.
l|cytology|cytopathology|Looking at individual cells under a microscope.
r|unremarkable|nad;no abnormality detected|The reader found nothing worth special mention.
r|benign|non-cancerous|A word used for things that do not spread. Your doctor can explain what it means in your report.
r!|malignant|cancerous|A word used by doctors for growths that can spread.
r!|lesion|lesions|A general word for an area of tissue that looks different from the tissue around it.
r!|mass|masses|A general word for a lump or area of tissue that takes up space.
r!|tumour|tumor|A general word for a lump of tissue made of cells growing together.
r!|neoplasm|neoplasia|A general word for new tissue growth.
r!|carcinoma||A word for a type of growth that begins in the lining cells of an organ.
r!|metastasis|metastases;mets;metastatic|A word for growth that has moved from where it began to another place.
r!|cyst|cysts|A closed pouch, often filled with fluid.
r!|polyp|polyps|A small growth that sticks out from a surface, such as the inside of the bowel.
r!|nodule|nodules|A small, rounded lump of tissue.
r!|necrosis|necrotic|A word for tissue that is no longer alive.
r!|stenosis|stenotic|A narrowing of a passage or opening.
r!|ischemia|ischaemia|Not enough blood supply reaching a part of the body.
r!|infarct|infarction|An area of tissue that did not get enough blood and has been changed by that.
r!|sepsis|septic|The body's strong reaction to an infection.
r!|aneurysm|aneurysms|A bulge in the wall of a blood vessel.
r!|thrombosis|thrombus|A blood clot inside a blood vessel.
r!|embolism|embolus|Something, often a clot, that travels in the blood and blocks a vessel.
r!|fibrosis|fibrotic|Thickened, scar-like tissue.
r!|atrophy|atrophic|A shrinking or thinning of tissue.
r!|hyperplasia|hyperplastic|An increase in the number of cells in a tissue.
r!|dysplasia|dysplastic|Cells that look different from usual under a microscope.
r!|stricture|strictures|A narrowing of a tube in the body.
r!|abscess|abscesses|A pocket of pus in the body.
r!|hernia|herniation|When part of an organ pushes through the wall that normally holds it.
r!|calcification|calcifications;calcified|A deposit of calcium in tissue.
r!|opacity|opacities|On an image, an area that looks whiter or more solid than its surroundings.
r!|consolidation|consolidated|On a chest image, an area of lung that looks more solid than usual.
r!|effusion|effusions|Fluid collected in a space where there is normally very little.
r!|edema|oedema|Swelling caused by extra fluid in tissue.
r!|hemorrhage|haemorrhage;bleed;bleeding|Blood escaping from a blood vessel.
r!|hematoma|haematoma|A collection of blood outside the blood vessels.
r!|inflammation|inflamed;inflammatory|The body's response to irritation or injury, often with redness, heat or swelling.
r!|infection|infective|When germs have entered and multiplied in the body.
r!|ulcer|ulceration|A break or sore in the skin or lining of an organ.
r|lump|lumps|A general word for a swelling or bump that can be felt.
r|bilateral|both sides|On both sides of the body.
r|unilateral|one side|On one side of the body.
r|ipsilateral|same side|On the same side.
r|contralateral|opposite side|On the opposite side.
r|anterior|front|Towards the front of the body.
r|posterior|back|Towards the back of the body.
r|superior|upper|Higher, towards the head.
r|inferior|lower|Lower, towards the feet.
r|medial|towards the middle|Closer to the middle line of the body.
r|lateral|towards the side|Further from the middle line of the body, towards the side.
r|proximal|near the centre|Nearer to the centre of the body or to where a limb attaches.
r|distal|far from the centre|Further from the centre of the body or from where a limb attaches.
r|superficial|surface|Near the surface.
r|deep|deeper|Further beneath the surface.
r|dorsal|dorsum|Towards the back, or the back of the hand or foot.
r|ventral|belly side|Towards the front or belly side.
r|supine|lying on back|Lying face up.
r|prone|lying on front|Lying face down.
r|acute|sudden onset|Starting suddenly or lasting a short time. It does not describe how serious something is.
r|chronic|long-standing|Lasting a long time.
r|subacute|between acute and chronic|Between acute and chronic in timing.
r|idiopathic|cause unknown|Without a known cause.
r|congenital|present at birth|Present from birth.
r|hereditary|inherited|Passed down in families through genes.
r|prognosis|outlook|A doctor's expectation of how something will develop.
r|etiology|aetiology|The cause or causes of a condition.
r|pathology|pathological|The study of disease, or the department that examines samples.
r|differential|differential diagnosis|A list of possible explanations a doctor considers and narrows down.
r|follow-up|follow up;f/u;review|A later visit or test to check on something again.
r|referral|referred|A request for another doctor or service to see you.
r|asymptomatic|no symptoms|Without symptoms.
r|symptomatic|with symptoms|Having symptoms.
r|remission|in remission|A period when signs of a condition have lessened or gone.
r|recurrence|recurrent|When something comes back.
r|exacerbation|flare;flare-up|A temporary worsening of a condition.
r|comorbidity|comorbidities;co-morbid|Another condition a person has at the same time.
r|contraindication|contraindicated|A reason a particular treatment should not be used.
r|adverse|adverse effect;side effect|An unwanted effect of a treatment.
r|elective|planned|Planned in advance rather than urgent.
r|palliative|palliative care|Care focused on comfort and quality of life.
r|prophylaxis|prophylactic|Something done or taken to help prevent a problem.
r|screening|screen|Testing people who have no symptoms to look for a condition early.
r|baseline|baseline value|An earlier measurement that later ones are compared with.
r|titrate|titration|To adjust an amount step by step.
r|bilat|bilat.|Short for bilateral.
r|wnl|within normal limits|Within normal limits: inside the range the report uses for comparison.
r|nad|no acute distress|Sometimes means "no abnormality detected" and sometimes "no acute distress"; check the context.
r|nil|none|None, nothing.
r|n/a|not applicable|Not applicable.
r|tbc|to be confirmed|To be confirmed.
r|dnr|do not resuscitate|Do not resuscitate: a written instruction about not attempting to restart the heart or breathing.
r|nsaid|nsaids|A group of pain-relief medicines called non-steroidal anti-inflammatory drugs.
r|antibiotic|antibiotics|A medicine that works against bacteria.
r|analgesic|analgesia|A medicine for pain relief.
r|steroid|corticosteroid;steroids|A group of medicines related to natural hormones made by the adrenal glands.
r|diuretic|water tablet|A medicine that makes the body pass more urine.
r|anticoagulant|blood thinner|A medicine that slows blood clotting.
r|antihypertensive|bp tablet|A medicine used to lower blood pressure.
r|generic|generic name|The standard (non-brand) name of a medicine.
i|ct|ct scan;cat scan;computed tomography|Computed tomography: a scan that uses X-rays from many angles to build cross-section pictures.
i|mri|magnetic resonance imaging|Magnetic resonance imaging: a scan that uses a strong magnet and radio waves to make pictures, with no X-rays.
i|x-ray|xray;radiograph;cxr;plain film|A picture made with a small beam of X-rays. A chest X-ray is often written CXR.
i|ultrasound|usg;sonography;us scan;sonogram;usound|A picture made with high-frequency sound waves.
i|doppler|doppler ultrasound|An ultrasound method that shows movement, such as blood flow.
i|echo|echocardiogram;2d echo|An ultrasound picture of the heart.
i|mammogram|mammography|An X-ray picture of the breast.
i|pet scan|pet-ct;pet ct|Positron emission tomography: a scan that shows where a small amount of a tracer collects in the body.
i|dexa|dxa;bone density scan|A low-dose X-ray scan that measures bone density.
i|angiogram|angiography;cta|Pictures of blood vessels, usually using a contrast dye.
i|endoscopy|gastroscopy;colonoscopy;scope|Looking inside the body with a thin flexible tube with a camera.
i|contrast|contrast dye;contrast medium|A dye given to make some tissues show up more clearly on an image.
i|t1|t1-weighted|On an MRI, one of the settings used to make pictures; different tissues look brighter or darker on it.
i|t2|t2-weighted|On an MRI, another setting used to make pictures; different tissues look brighter or darker on it.
i|flair|flair sequence|A type of MRI setting that hides signal from plain fluid.
i|hyperintense|bright signal|On an MRI, brighter than the tissue around it.
i|hypointense|dark signal|On an MRI, darker than the tissue around it.
i|hyperechoic|echogenic|On an ultrasound, brighter than the tissue around it.
i|hypoechoic|low echo|On an ultrasound, darker than the tissue around it.
i|anechoic|echo-free|On an ultrasound, black because it returns no echo, as plain fluid does.
i|hypodense|low attenuation|On a CT, darker than the tissue around it.
i|hyperdense|high attenuation|On a CT, brighter than the tissue around it.
i|enhancement|enhancing|On a scan, an area that becomes brighter after contrast dye.
i|axial|transverse|A slice picture cut across the body, as if looking from the feet.
i|coronal|coronal view|A slice picture cut from front to back.
i|sagittal|sagittal view|A slice picture cut from one side to the other.
i|pa|posteroanterior|A view where the beam passes from back to front.
i|ap|anteroposterior|A view where the beam passes from front to back.
i|lateral view|lat view|A view taken from the side.
i|radiolucent|lucent|Looks dark on an X-ray because it lets X-rays through.
i|radiopaque|opaque|Looks white on an X-ray because it blocks X-rays.
i|impression|conclusion;findings|The sections of an imaging report: findings are what was seen, impression is the reader's summary.
i|technique|protocol|The part of a report describing how the scan was done.
i|comparison|compared with|The earlier scan, if any, that the reader looked at alongside this one.
b|abdomen|abdominal|The belly area between the chest and the pelvis.
b|thorax|thoracic|The chest.
b|pelvis|pelvic|The bony ring at the base of the trunk and the space inside it.
b|cervical|cervical spine|Of the neck, or of the cervix. The meaning depends on the context.
b|lumbar|lumbar spine|Of the lower back.
b|thoracic spine|dorsal spine|The middle part of the spine, behind the chest.
b|sacral|sacrum|Of the sacrum, the triangle-shaped bone at the base of the spine.
b|hepatic|liver|Of the liver.
b|renal|kidney|Of the kidneys.
b|pulmonary|lung|Of the lungs.
b|cardiac|heart|Of the heart.
b|gastric|stomach|Of the stomach.
b|cerebral|brain|Of the brain.
b|vascular|vessels|Of blood vessels.
b|myocardial|myocardium|Of the heart muscle.
b|ventricle|ventricular|One of the pumping chambers of the heart, or a fluid space in the brain.
b|atrium|atrial|One of the upper chambers of the heart.
b|aorta|aortic|The main large blood vessel leaving the heart.
b|thyroid|thyroid gland|A gland at the front of the neck that makes hormones.
b|prostate|prostatic|A small gland below the bladder in men.
b|uterus|uterine|The womb.
b|ovary|ovarian|One of the pair of organs that produce eggs.
b|endometrium|endometrial|The lining of the womb.
b|gallbladder|gall bladder|A small pouch under the liver that stores bile.
b|pancreas|pancreatic|A gland behind the stomach that makes digestive juices and insulin.
b|spleen|splenic|An organ on the left upper side of the belly that filters blood.
b|bowel|intestine;intestinal|The intestines, the long tube that digests food after the stomach.
b|colon|colonic|The large intestine.
b|lymph node|lymph nodes;lymphadenopathy;lymph glands|Small bean-shaped glands of the immune system found around the body.
b|hepatomegaly|enlarged liver|A liver that is larger than usual.
b|splenomegaly|enlarged spleen|A spleen that is larger than usual.
b|cardiomegaly|enlarged heart|A heart shadow that looks larger than usual.
b|tachycardia|fast heart rate|A heart rate that is faster than usual.
b|bradycardia|slow heart rate|A heart rate that is slower than usual.
b|dyspnea|dyspnoea|Breathlessness: the feeling of difficulty breathing.
b|hypertension|high blood pressure|The medical word for blood pressure that is higher than a set level.
b|hypotension|low blood pressure|The medical word for blood pressure that is lower than a set level.
b|anemia|anaemia|A word for having fewer red blood cells or less haemoglobin than a set level.
b|diabetes|diabetes mellitus|A condition in which the body has trouble controlling blood sugar.
b|osteoporosis|brittle bones|A condition of thinner, more fragile bones.
b|arthritis|joint inflammation|A general word for pain and swelling in the joints.
b|fracture|broken bone|A break in a bone.
`.trim();

export const TERMS: Term[] = RAW.split('\n').map((line) => {
  const [k, term, al, ...rest] = line.split('|');
  const care = k.endsWith('!');
  const plain = rest.join('|') + (care && !/doctor can explain/i.test(rest.join('|')) ? CARE : '');
  return { term, aliases: al ? al.split(';') : [], kind: KINDS[k.replace('!', '')], plain };
});

const norm = (s: string) => s.toLowerCase().replace(/[.\s]+/g, ' ').replace(/ ?- ?/g, '-').trim();
const index = new Map<string, Term>();
for (const t of TERMS) for (const n of [t.term, ...t.aliases]) if (!index.has(norm(n))) index.set(norm(n), t);

/** Look a test or word up by name, ignoring case, dots and spacing: "Hemoglobin", "haemoglobin (Hb)". */
export function lookup(name: string): Term | undefined {
  const n = norm(name);
  if (index.has(n)) return index.get(n);
  const stripped = norm(n.replace(/\([^)]*\)/g, ' ').replace(/\b(serum|blood|total|level|test)\b/g, ' '));
  if (stripped && index.has(stripped)) return index.get(stripped);
  const inside = n.match(/\(([^)]+)\)/);
  if (inside && index.has(norm(inside[1]))) return index.get(norm(inside[1]));
  return undefined;
}

export interface Hit { start: number; end: number; text: string; entry: Term }

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
let re: RegExp | null = null;
const regex = () => {
  if (re) return re;
  const names = [...index.keys()].filter((k) => k.length > 1).sort((a, b) => b.length - a.length);
  re = new RegExp(`(?<![\\p{L}\\p{N}'’])(${names.map((n) => esc(n).replace(/ /g, '[\\s.]*').replace(/-/g, '[-\\s]?')).join('|')})(?![\\p{L}\\p{N}'’])`, 'giu');
  return re;
};

/** Find known words in pasted text (longest match first). */
export function findTerms(text: string): Hit[] {
  const hits: Hit[] = [];
  for (const m of text.matchAll(regex())) {
    const entry = lookup(m[1].replace(/[\s.]+$/, '')) || lookup(m[1]);
    if (entry) hits.push({ start: m.index!, end: m.index! + m[1].length, text: m[1], entry });
  }
  return hits;
}
