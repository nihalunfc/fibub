---
title: Reading PDFs, scans, spreadsheets and email
seoTitle: Read PDFs, scans and email for offline RAG | Offline AI
summary: Turn the files people actually have into clean text for your index, offline. PDFs page by page, scanned pages with OCR, Word files, spreadsheets row by row, and saved emails.
minutes: 30
updated: 2026-11-19
sources:
  - 'pypdf (BSD licence), https://pypdf.readthedocs.io'
  - 'Tesseract OCR (Apache 2.0), https://github.com/tesseract-ocr/tesseract'
  - 'OCRmyPDF (MPL 2.0), https://ocrmypdf.readthedocs.io'
  - 'python-docx, https://python-docx.readthedocs.io'
  - 'Python email package, https://docs.python.org/3/library/email.html'
quiz:
  - q: A PDF gives back empty text for every page. What is the likely cause?
    choices: ['It is a scan: the pages are pictures of text, so it needs OCR', 'The PDF is encrypted with a password you know', 'pypdf is broken']
    ans: 0
    why: Scanned PDFs hold images, not text. OCR (optical character recognition) reads the letters from the images.
  - q: Someone asks "What was the total spend in March?" over a spreadsheet. Is RAG the best tool?
    choices: ['Yes, always', 'No, sums and filters are better done by code (pandas or SQL); RAG suits text questions', 'Only for small sheets']
    ans: 1
    why: Retrieval brings back a few rows. A total needs every row added up, which code does exactly.
  - q: Why read PDFs page by page instead of as one long text?
    choices: ['So each chunk keeps its page number for citations', 'pypdf cannot read whole files', 'It saves memory on the GPU']
    ans: 0
    why: Keeping page numbers lets answers cite "file.pdf, page 7" so a reader can check.
---

**Module 12 · about 30 minutes · read first: 12.4.** You'll be able to turn PDFs, scans, Word files, spreadsheets and emails into text for your index, without any upload.

## 1. Why this matters

Real folders are messy. A pipeline that reads only `.txt` files answers nothing useful at work. The good news: free, offline libraries read nearly everything.

## 2. One reader for many file types

Install once: `pip install pypdf python-docx pandas openpyxl`. Then save as `readers.py` in `askdocs`, replacing the stand-in from Lesson 12.4:

```python
import email
import pathlib
from email import policy


def read_any(path):
    """Return a list of (page, text) pairs. Files without pages count as page 1."""
    p = pathlib.Path(path)
    ext = p.suffix.lower()
    if ext in (".txt", ".md"):
        return [(1, p.read_text(encoding="utf-8", errors="ignore"))]
    if ext == ".pdf":
        from pypdf import PdfReader
        return [(n, page.extract_text() or "") for n, page in enumerate(PdfReader(p).pages, 1)]
    if ext == ".docx":
        import docx  # pip install python-docx
        return [(1, "\n".join(par.text for par in docx.Document(p).paragraphs))]
    if ext in (".csv", ".xlsx"):
        import pandas as pd  # pip install pandas openpyxl
        df = pd.read_csv(p) if ext == ".csv" else pd.read_excel(p)
        rows = [", ".join(f"{col}: {val}" for col, val in row.items()) for row in df.astype(str).to_dict("records")]
        return [(1, "\n".join(rows))]
    if ext == ".eml":
        msg = email.message_from_bytes(p.read_bytes(), policy=policy.default)
        body = msg.get_body(preferencelist=("plain",))
        text = body.get_content() if body else ""
        return [(1, f"From: {msg['from']}\nDate: {msg['date']}\nSubject: {msg['subject']}\n\n{text}")]
    return []  # anything else is skipped
```

Each spreadsheet row becomes a line like `item: printer, cost: 400`, so the column names travel with the values. Emails keep sender, date and subject at the top, which helps both search and citations. Save emails from your mail program as `.eml` files (most programs can export or drag them to a folder).

## 3. Scans need OCR

A scanned PDF contains pictures of pages, so `extract_text` returns nothing. **OCR** (optical character recognition) reads the letters. The dependable offline route is **OCRmyPDF**, which uses Tesseract and adds an invisible text layer to the PDF:

```
ocrmypdf --skip-text scanned.pdf scanned-ocr.pdf
```

`--skip-text` leaves pages that already have text alone. Install it from your system's package manager (Linux, or Homebrew on Mac) or follow the Windows steps in its documentation; add language packs such as `hin` or `mal` for Hindi or Malayalam pages, and pass `-l eng+hin`. Run it over the scans once, then index the new files.

For photos of receipts, handwritten notes or messy layouts, a vision model can do better than OCR (Lesson 13.5), at the cost of speed.

## 4. Tables, slides and the rest

- **Tables in PDFs** often come out jumbled. If tables matter, `pdfplumber` keeps rows together better.
- **PowerPoint**: `python-pptx` reads the text of each slide; use the slide number as the page.
- **Mailboxes**: Python's `mailbox` module reads `.mbox` exports one message at a time.
- **Numbers questions** ("total spend in March"): do not use RAG. Load the sheet with pandas and let code do the maths, or let the model write the pandas code for you (Lesson 13.2).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** retrieval can only find text that exists in the index. Every file type needs a reader that keeps the text and its location.

**Equation:** what the model can answer ⊆ what was retrieved ⊆ what was indexed ⊆ what the readers extracted.

**Analogy:** a chain of sieves, each finer than the last. Whatever falls out at the first sieve (a scan with no OCR, a table read as jumble) can never reach the answer, however good the model. Where it breaks: OCR is not perfect; a 1% character error rate means about one wrong letter in every hundred, which matters for names and numbers.

**Try it:** a folder of 500 PDFs, 60 of them scans with no OCR. What share of the folder can the pipeline answer from? (440 ÷ 500 = 88%. The other 12% is invisible.)
</details>

## 5. Worked example

*Made-up numbers.* A property manager's folder: 220 PDFs (35 scanned leases), 80 Word letters, 12 rent spreadsheets and 900 saved emails. OCRmyPDF processes the 35 scans in 25 minutes on a laptop. The index ends with 31,000 chunks. "When does the Elm Street lease allow a rent review?" finds clause 4.2 on page 6 of a scanned lease. "Total arrears last quarter?" is answered by a pandas script instead.

## 6. Practice

1. Put one PDF, one Word file, one spreadsheet and one `.eml` file in `docs`, run `index_docs.py`, and ask one question per file.
2. Find a scanned PDF (or scan a page with your phone and save as PDF). Check `extract_text` returns nothing, run OCRmyPDF and check again.
3. Add `.pptx` support to `read_any` using `python-pptx`.

<details>
<summary>Answers</summary>

1. If a file gives no chunks, print `read_any(path)` for it to see what came out.
2. After OCR the text appears, with a few errors on poor scans.
3. `from pptx import Presentation`, then `return [(n, "\n".join(sh.text_frame.text for sh in slide.shapes if sh.has_text_frame)) for n, slide in enumerate(Presentation(p).slides, 1)]`.
</details>

**New words:** *OCR* / *optical character recognition* (reading letters from images), *text layer* (hidden, selectable text inside a scanned PDF), *.eml* (one saved email as a file).
