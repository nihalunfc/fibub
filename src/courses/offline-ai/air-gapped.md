---
title: Government and air-gapped sites
summary: Some networks are never connected to the internet at all. How models get in safely, how they run and are updated inside, and why local AI is often the only AI such sites can use.
minutes: 20
updated: 2026-11-19
sources:
  - 'NIST SP 800-53 Rev. 5, security and privacy controls (media protection and supply chain sections), https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final'
  - 'UK National Cyber Security Centre, guidelines for secure AI system development, 2023 (official page), https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development'
  - 'Canadian Centre for Cyber Security, guidance on generative AI (official page), https://www.cyber.gc.ca'
quiz:
  - q: What is an air-gapped network?
    choices: ['A network with no connection to the internet or other outside networks', 'A network with fast Wi-Fi', 'A cloud region']
    ans: 0
    why: Data and software cross the gap only by approved, checked media.
  - q: How does a model get into an air-gapped site?
    choices: ['Downloaded outside, checked against published checksums, scanned, and carried in on approved media', 'Emailed in', 'It cannot']
    ans: 0
    why: Verify integrity and origin before the files cross the gap.
  - q: Why prefer GGUF or safetensors files for such sites?
    choices: ['They hold numbers, not code that runs when loaded', 'They are smaller', 'They are encrypted']
    ans: 0
    why: Pickle files can run code (Lesson 17.6); a high-security site should not accept them.
---

**Module 18 · about 20 minutes · read first: 9.6 and 17.6.** You'll be able to describe how AI runs on a network that never touches the internet.

## 1. Why this sector

Defence, intelligence, some government departments, power grids, factories and research facilities keep their most sensitive systems physically cut off from the internet. Cloud AI is impossible there by design. Local models are the only way to bring AI help to these sites, and the course's "works with the cable pulled out" test (Lesson 9.6) is their everyday reality.

## 2. Top uses

- Searching large internal document stores and manuals.
- Drafting reports from structured notes.
- Translation of documents that may not leave.
- Code help for internal systems.
- Summarising logs and incident records.

## 3. Getting models in, safely

1. Choose the model and licence outside; record why.
2. Download from the original publisher; check the published checksum (SHA-256).
3. Accept only GGUF or safetensors, never pickle files.
4. Scan and approve per the site's media rules; carry in on approved media.
5. Re-check the checksum inside, and store an approved copy with its record.
6. Do the same for the engine software and its dependencies (Python packages, containers): these are the larger risk.

## 4. Running inside

All the usual pieces work offline: engine, front end, document search. Turn off every update check and telemetry option. Plan update cycles (quarterly, say) that repeat the import process. Keep model records as in Lesson 18.3.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** trust nothing that crossed the gap without a matching checksum.

**Equation:** accept file ⇔ SHA-256(file) = published SHA-256.

**Analogy:** a sealed evidence bag with a numbered tag, checked at every hand-over.

**Try it:** the checksum inside differs from the publisher's by one character. What do you do? (Reject the file; it is not the same file.)
</details>

## 5. Worked scenario

*Made-up site.* A national research facility's secure network runs a 27B model and a document search over 40,000 internal reports on two servers. Every quarter, an approved officer imports a new model and engine version after checksum checks and a two-week test on a separate offline test machine. Analysts get AI search; nothing has ever connected out.

## 6. Practice

1. Write the commands to check a file's SHA-256 on your system.
2. Why are the engine's dependencies a bigger import risk than the model file?
3. Which settings must be turned off before moving software inside?

<details>
<summary>Answers</summary>

1. Linux: `sha256sum file`; Mac: `shasum -a 256 file`; Windows: `certutil -hashfile file SHA256`.
2. Packages and containers contain code that runs; a GGUF or safetensors file holds only numbers.
3. Automatic updates, telemetry, and any cloud sync or online model download options.
</details>

**New words:** *air gap*, *checksum*, *media import*, *telemetry*, *supply chain*.
