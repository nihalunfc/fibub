---
name: ATS resume checker
shelf: documents
title: "Free ATS resume checker: score your resume out of 100 (no upload)"
summary: "See your resume the way hiring software reads it, get a score out of 100 with plain fixes, and match it to a job ad. PDF or Word."
status: live
ads: false
order: 25
icon: resume
works: offline
updated: 2026-11-06
flow:
  - { icon: resume, label: "Add resume" }
  - { icon: search, label: "Read as ATS" }
  - { icon: check, label: "Score /100" }
  - { icon: sliders, label: "Fix list" }
---

## What an ATS is, and why it matters

Most medium and large employers put every application through an applicant tracking system (ATS) before a person looks at it. The ATS pulls the text out of your file, splits it into sections such as contact details, experience, education and skills, and lets recruiters search and filter by keywords. If the software cannot read your resume properly, your experience can end up jumbled, in the wrong field, or missing, and a recruiter searching for "SQL" may never see you even though it is on your page.

This checker reads your resume the same way: it pulls out the plain text, looks for the layout features that commonly trip ATS parsers up, and scores the result out of 100. Your file is read inside your browser and is never uploaded, stored or sent anywhere. Once the page has loaded, it works with no internet connection.

## How to use it

1. Choose your resume. PDF and Word (.docx) are what most job portals accept, and both are supported. Plain text and Markdown work too.
2. Optional: open "Add the job ad" and paste the full job description. The checker picks out the job's key terms and shows which ones your resume already uses and which are missing.
3. Read your score and the checks. Problems are listed first, biggest first, each with a one-line fix.
4. Open "What the ATS sees" to read the plain text that was pulled from your file. If the order looks wrong there, it will look wrong to an employer's system too.

Change your resume, save it, and check it again until you are happy.

## What each check means

- **Text can be read:** a scanned or image-only PDF has no text, so an ATS sees a blank page. This is the most serious problem and caps the score at 20.
- **Contact details:** email and phone in the main body, near the top. Many ATS skip Word headers and footers, so contact details placed only there are flagged.
- **Standard headings:** "Experience", "Education" and "Skills" on their own lines. Creative headings such as "Where I've been" are often missed.
- **Dates for each role:** consistent date ranges such as "Jan 2023 – Present" let the ATS work out how long you held each job.
- **Bullets, numbers and action verbs:** short bullets that start with a verb and include a result ("Reduced report time by 40%") read well to both software and people.
- **Single column, no tables or text boxes:** many ATS read straight across the page, mixing two columns together, and some skip text boxes completely.
- **No icons or photos:** icon fonts show up as boxes or question marks, and photos are ignored (and discouraged in Canada, the US and the UK).
- **Job ad match:** the share of the job's key terms found in your resume. Aim for 60% or more, using only skills you genuinely have.

## Worked example

Priya uploads a two-column PDF made from a design template and scores 58. The checker flags "Single-column layout" and "No icons or emoji" (the template uses a phone icon instead of the word "Phone"). In "What the ATS sees" her job titles appear in the middle of her skills list. She copies the content into a plain one-column Word document, writes "Phone:" and "Email:" in words, pastes the job ad, and adds two missing terms she really has ("stakeholder reporting" and "Power BI"). Her new score is 91.

## FAQs

**Is my resume uploaded?** No. Everything happens in your browser. Nothing is saved, and you can disconnect from the internet after the page loads.

**Does a high score guarantee an interview?** No. Every ATS is different and people make the final decision. A high score means the software can read your resume cleanly and find the right words in it.

**PDF or Word?** Both are fine for most modern systems if the PDF is text-based (made with "Save as PDF", not scanned). If a job portal asks for Word, send .docx.

**Why is my .doc file not accepted?** Old .doc files use a format that cannot be read reliably in the browser, and some ATS struggle with it too. Save it as .docx or PDF.

**How is the score worked out?** Each check is worth a fixed number of points, weighted by how much it affects ATS reading. The score is the points earned out of the points available for your file type.
