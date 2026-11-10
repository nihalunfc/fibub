---
title: "How to make your resume ATS-friendly (and check its score)"
summary: "Use one column, plain headings, dates for every job and the job ad's own words. Check it with a free ATS score out of 100, worked through on an example resume."
tools: [ats-resume-checker, resume-builder, cover-letter]
updated: 2026-11-10
sources:
  - "Check names, points and the score rule from fibub's own src/lib/ats/score.ts. The example scores were worked with that code."
  - "The example person, resume and job ad are invented. Every employer's system differs; a score is a guide, not a promise."
---

An ATS-friendly resume is one that hiring software can turn into clean text: one column, standard section headings, a date range for each job, no icons, and the key words from the job ad that you genuinely have. The [[ats-resume-checker]] reads your PDF or Word file the way that software does, scores it out of 100 and lists what to fix, without uploading anything.

## What you need

- **Your resume as a PDF or .docx file.** A PDF must be made with "Save as PDF" or "Export", not scanned, or there is no text to read.
- **The job ad.** Copy the whole description, duties and requirements included.
- **Ten minutes to edit** in Word, Google Docs or the [[resume-builder]].

An ATS (applicant tracking system) is the software many employers use to collect applications. It pulls the words out of your file, sorts them into fields such as experience and education, and lets recruiters search them. If the words come out jumbled, a person may never see the right parts.

## Step by step

The checker runs a set of checks, each worth a fixed number of points. A pass earns all of them; some partial results earn half. Then:

**score = points earned ÷ points available × 100**, rounded.

Two rules sit on top. A file with almost no readable text is capped at 20. A layout that can scramble everything (two columns in a PDF, or tables or text boxes in Word) caps the score at 74, so it can never show as ready until it is fixed.

The job ad match is its own share:

**match % = job terms found in your resume ÷ job terms picked from the ad × 100**

1. Press **Choose your resume** and pick the file.
2. Open **Add the job ad** and paste the description. The checker picks out its key terms and updates the score.
3. Read the score, its label and the **To fix** list. The biggest problems come first, each with its points (such as 0/10) and a one-line fix.
4. Look at **Job ad keywords**: green terms are in your resume, red ones are missing. Add a missing term only if it is true for you.
5. Open **What the ATS sees** and read the plain text. If job titles land in the middle of your skills, the layout is the problem.
6. Edit your file and check it again, or press **Fix it for me** to move your own words into a clean one-column layout in the resume builder, then download PDF or Word.

## A worked example

Sam is applying for an administrative assistant job. The resume is a one-page PDF from a two-column template, with three small icons next to the email, phone and LinkedIn link. The job ad is pasted in.

**First check.** The checker picks 9 key terms from the ad, such as "data entry", "microsoft excel", "record keeping", "reports" and "operations". Sam's resume has 4 of them:

- Match: 4 ÷ 9 × 100 ≈ **44%**, a partial result worth 6 of its 12 points.

Across all checks, Sam earns 86 of the 111 points available for a PDF:

- 86 ÷ 111 × 100 ≈ 77.

But the two-column layout fails, so the score is capped at **74**.

**The fixes.** Sam:

- moves everything into one column (+10 points);
- writes "Email:" and "Phone:" in words instead of icons (+4);
- starts more bullets with action verbs such as "Reduced", "Maintained" and "Organised" (+2);
- uses the ad's own words for things Sam really did: "weekly reports in Microsoft Excel" instead of "weekly summaries", and "record keeping" for the filing work.

The match is now 7 of 9 terms, 7 ÷ 9 × 100 ≈ **78%**, which passes (+6). That makes 86 + 10 + 4 + 2 + 6 = 108 points:

- 108 ÷ 111 × 100 ≈ **97**.

The two terms still missing, "operations" and "Salesforce", stay out, because Sam has no experience with them. The length check still asks for more: 232 words is short, so Sam could add a little detail to each role.

## Check your answer

- **Read "What the ATS sees" from top to bottom.** Name and contact details first, then each job with its dates and bullets in order. If you can read it, the software can too.
- **Look for the cap.** A score stuck at 74 or just below usually means columns, tables or text boxes. Fix those before anything else.
- **Keywords should sound like you.** A term counts if its letters appear anywhere, so "Supported" matches "support". Never paste a list of words you cannot back up in an interview.
- **A cover letter should agree.** If you write one with the [[cover-letter]] builder, use the same job titles and dates as your resume.

## Questions people ask

**Is PDF or Word better for an ATS?** Both work in most modern systems when the PDF is text-based. If the portal asks for Word, send .docx. Old .doc files are not accepted by the checker; save them as .docx first.

**Does a score of 100 mean I will get an interview?** No. It means the software can read your resume cleanly and find the right words. People still make the decision.

**Should I tailor my resume for every job?** Yes, lightly. Keep the layout the same and change the words in your summary, skills and top bullets to match each ad, then check the new match percentage.
