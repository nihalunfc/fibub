---
title: Extracting data from email
summary: 'Pull attachments out of email with Python, choose IMAP, Microsoft Graph or the Gmail API, and keep the feed honest with allow-lists, watermarks and dedup.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Your company uses Microsoft 365. What is the recommended way for a scheduled job to read an intake mailbox?
    choices: ['IMAP with a person''s password', 'Microsoft Graph with an app registration and Mail.Read, limited to that mailbox', 'Forward all mail to a personal Gmail']
    ans: 1
    why: Microsoft has switched off password (basic) sign-in for IMAP in Exchange Online. Graph with app permissions, limited by policy to one mailbox, is the supported way.
  - q: 'An email titled "Daily sales R104 14/09/2026" arrives on 16 Sept. What is its business date?'
    choices: ['16 Sept 2026, the day it arrived', '14 Sept 2026, from the subject (day first)', '9 Feb 2027']
    ans: 1
    why: The business date is the day the data is about, not the day it arrived. And 14/09 is written day first.
  - q: Why use a watermark with an overlap instead of marking emails as read?
    choices: ['Marking as read is impossible over IMAP', 'It does not change a mailbox other people use, and the overlap plus dedup catches late mail', 'Overlaps make the job faster']
    ans: 1
    why: You avoid side effects on a shared mailbox and stay correct when delivery times are messy.
sources:
  - 'Python documentation: email (an email and MIME handling package) https://docs.python.org/3/library/email.html'
  - 'Microsoft Learn: Microsoft Graph mail API overview https://learn.microsoft.com/en-us/graph/outlook-mail-concept-overview'
  - 'Freed, N. and Borenstein, N. (1996), RFC 2045: MIME Part One, Format of Internet Message Bodies https://www.rfc-editor.org/rfc/rfc2045'
---

**Module 1 · about 35 minutes · read first: 1.3.** You'll be able to pull attachments out of `.eml` files, pick the right way to reach a mailbox, read the business date from the subject, and design an email feed that never double-counts and never disturbs a shared inbox.

<div class="bigidea">An email is an envelope with letters and photos inside; your job is to open it without tearing it, take out only the attachments you expect from senders you know, and remember which envelopes you have already opened.</div>

## 1. Why this matters

In retail, restaurants and hotels, a surprising share of daily data still arrives as **email attachments**: store sales, supplier price lists, bank files, statements from booking sites. A reliable email extractor is one of the most practical skills you can show, and one of the easiest to get subtly wrong.

## 2. What an email really is

An email is a tree of **MIME parts** (MIME is the standard for putting files and formatted text inside email). At the top are headers: `From`, `Subject`, `Date`, `Message-ID`. Below them are children: a plain-text body, an HTML body, and attachments. Each attachment has a `Content-Type` and a `filename`, and its bytes are usually **base64-encoded** (turned into plain letters and digits so they survive the trip).

Python's standard library opens the envelope for you:

```python
from email import policy
from email.parser import BytesParser
from pathlib import Path

def attachments(eml_path: Path):
    msg = BytesParser(policy=policy.default).parse(eml_path.open("rb"))
    meta = {"message_id": msg["Message-ID"], "from": str(msg["From"]),
            "subject": str(msg["Subject"]), "date": str(msg["Date"])}
    for part in msg.iter_attachments():
        name = part.get_filename()
        if name and name.lower().endswith((".csv", ".xlsx", ".xls")):
            yield meta, name, part.get_content()   # bytes for binary files, text for CSV
```

The course's `.eml` files have no `Message-ID` (real ones usually do). When it is missing, use a hash of the raw email bytes as the email's key.

## 3. Three ways to reach a mailbox

| Method | Use when | How it signs in | Notes |
|---|---|---|---|
| **IMAP** (`imaplib`, `imap-tools`) | General mail servers, small setups | Password or app password, or OAuth2 | Microsoft has turned off password sign-in for IMAP on Exchange Online; there you need OAuth |
| **Microsoft Graph API** (`msal` and REST) | Outlook and Microsoft 365, which most companies use | An app registration in Entra ID with the `Mail.Read` permission | Can be limited to one mailbox with an application access policy. The best choice for a service |
| **Gmail API** | Google Workspace | OAuth client, or a service account with domain-wide delegation | Good label and search support |

**OAuth** means the job gets a short-lived token from an identity service instead of storing a person's password. A Graph call that lists messages with attachments looks like this:

```python
import msal, requests
app = msal.ConfidentialClientApplication(CLIENT_ID, authority=f"https://login.microsoftonline.com/{TENANT}",
                                         client_credential=CLIENT_SECRET)
token = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])["access_token"]
H = {"Authorization": f"Bearer {token}"}
url = (f"https://graph.microsoft.com/v1.0/users/{MAILBOX}/mailFolders/inbox/messages"
       "?$filter=hasAttachments eq true and receivedDateTime ge 2026-09-01T00:00:00Z&$top=50")
while url:
    page = requests.get(url, headers=H, timeout=30).json()
    for m in page["value"]:
        atts = requests.get(f"https://graph.microsoft.com/v1.0/users/{MAILBOX}/messages/{m['id']}/attachments",
                            headers=H, timeout=30).json()["value"]
        # each file attachment has name, contentType and base64 contentBytes
    url = page.get("@odata.nextLink")              # follow the pages until there are none
```

No company mailbox to practise on? Make a throwaway Gmail account, turn on IMAP with an app password, and send yourself three of the course `.eml` files. Never practise on a work mailbox.

## 4. Rules that keep an email feed honest

- **Allow-list senders.** Accept only known addresses, and read the store from both the sender and the subject. Put everything else in a review folder in raw with a reason, never silently in the bin.
- **Business date from the subject or the file**, not the email's `Date` header. A report sent at 00:30 is about yesterday; a resend can come days later.
- **Dedup twice:** by email key (the same email fetched again) and by attachment hash (a manager pressed send twice, making two emails with the same file).
- **Do not change the mailbox** unless its owner agrees. Marking mail as read or moving it to a "processed" folder seems tidy but breaks people who use the same box. Use a **watermark** instead.

Watch a watermark with an overlap at work:

<div class="steps">
<div class="step"><b>Last run.</b> Yesterday's job finished at 07:10 and saved its watermark: "landed everything received up to 14 Sept 07:10".</div>
<div class="step"><b>Today's window.</b> Today the job asks for mail received after watermark minus a 48-hour overlap: after 12 Sept 07:10. That re-reads two days on purpose.</div>
<div class="step"><b>Late mail is caught.</b> Store R109's report for the 13th sat on a mail server and was delivered with a time stamp of 13 Sept 23:50. Without the overlap you would have missed it; with it, it is in the window.</div>
<div class="step"><b>Dedup does the rest.</b> 26 attachments come back. 24 hashes are already in the manifest and are skipped; 2 are new and land.</div>
<div class="step"><b>Move the watermark.</b> The new watermark is the latest received time among landed mail: 15 Sept 06:58. Nothing in the mailbox was touched.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a **watermark** is the latest point you have safely processed. Next time you ask only for what came after it, minus a safety overlap.

**Equation:** fetch where

```math
t_{\text{received}} > w - \delta
```

then dedup by hash. The new watermark is `$w' = \max(t_{\text{received}})$` over the items landed.

**Analogy:** a bookmark in a novel, where you re-read the last page in case you dozed off. Where it breaks: clocks disagree between servers, and mail can arrive late with an old time stamp. The overlap `$\delta$` (say 2 days) plus hash dedup covers both.

**Try it:** the watermark is 14 Sept 07:10 and the overlap 48 hours. Which window do you fetch? *(Everything received after 12 Sept 07:10. Dedup removes what you already have.)*
</details>

<div class="problem" data-problem="email-extraction-skipped"></div>

<div class="meaning">

<dl>
<dt>MIME part</dt><dd>One piece of an email: a body, or one attachment, with its own type and name.</dd>
<dt>Allow-list</dt><dd>The list of senders you accept. Everyone else goes to review.</dd>
<dt>Watermark</dt><dd>The latest point you have safely processed, saved between runs.</dd>
<dt>Overlap</dt><dd>A deliberate re-read of the last stretch before the watermark, to catch late arrivals.</dd>
<dt>Physical meaning</dt><dd>Half of email-pipeline pain is people, not code. Ask the business for a dedicated intake mailbox and a simple rule ("one store per email, one file per email, subject format X"). Then keep a weekly table of each sender's typical arrival time: that table is the evidence that gets a late store fixed by the operations team, instead of by you staying up.</dd>
</dl>

</div>

<div class="myth">

**"The email's Date header tells me which day the sales are for."** It tells you when the email was sent, by the sender's clock. Reports are often sent after midnight, and resends come days later. Read the business date from the subject or from inside the file, and write down the rule (including whether dates are day first).

</div>

## 5. Try it: extract the grocery emails

1. Write `sources/email_files.py`: walk `landing/email_inbox/*.eml`, extract attachments, hash them, and land to `raw/retail_email/business_date=YYYY-MM-DD/<store>__<sha8>.<ext>`. Parse store and date from the subject `Daily sales R104 14/09/2026`; note the date is **day first**.
2. Add `message_key = sha256(raw email bytes)` and a second manifest table `email_manifest(message_key, sender, subject, received, n_attachments)`.
3. Put unknown senders into `raw/_rejected/` with a reason.
4. Write a test with the same attachment in two different emails: one raw file, two email manifest rows.
5. Stretch: write `sources/imap.py` with `imap-tools` that saves new messages since a watermark into `landing/email_inbox` as `.eml`, so live mail and files share one parser.
6. Query the manifest: which store is missing on which dates?

Commit: `feat(ingest): email attachment extractor with sender allow-list and double dedup`.

**What to check:** your missing-store query should find store R107 silent for four days in a row. That gap is planted in the data, and it will matter again in Lesson 1.7.

## 6. Practice

1. Two emails from the same store, a minute apart, carry byte-identical attachments. How many raw files and how many email manifest rows?
2. A subject reads `Daily sales R104 04/09/2026`. Why is this date dangerous, and how do you test your parser?
3. Why is `Mail.Read` limited to one mailbox better than reading all mail in the company?

<details>
<summary>Answers</summary>

1. One raw file (same hash) and two email manifest rows (two different emails).
2. 04/09 parses as 4 Sept or 9 April. Fix the format per source and test with a day above 12, such as 14/09, which only parses one way.
3. Least privilege: if the app's secret leaks, only one mailbox is exposed. Security teams also approve narrow requests much faster.
</details>

**New words:** *MIME*, *base64*, *IMAP*, *Microsoft Graph*, *OAuth*, *allow-list*, *watermark*, *overlap*.

<div class="keypoints">

- An email is a tree of MIME parts; Python's `email` package pulls out the attachments.
- For Microsoft 365 use Graph with an app registration limited to the intake mailbox; for Google, the Gmail API.
- Take the business date from the subject or file, never from the email's sent time.
- Use a watermark with an overlap, and dedup by both email key and attachment hash. Never change a shared mailbox.

</div>
