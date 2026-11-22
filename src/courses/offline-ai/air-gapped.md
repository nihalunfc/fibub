---
title: Government and air-gapped sites
summary: Some networks are never connected to the internet at all. How models get in safely, how they run and are updated inside, and why local AI is often the only AI such sites can use.
minutes: 20
updated: 2026-11-22
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

<div class="bigidea">On a network that never touches the internet, local models are the only AI possible, and every file that crosses the gap is checked against its published fingerprint before it is trusted.</div>

## 1. Why this sector

Defence, intelligence, some government departments, power grids, factories and research facilities keep their most sensitive systems physically cut off from the internet. This is called an **air gap**: a gap of air between the secure network and everything else. Cloud AI is impossible there by design. Local models are the only way to bring AI help to these sites, and the course's "works with the cable pulled out" test (Lesson 9.6) is their everyday reality.

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

<div class="steps">
<div class="step"><p><b>Outside: download and fingerprint.</b> An officer downloads a GGUF model from its publisher and runs <code>sha256sum</code>. The 64-character result matches the one on the publisher's page.</p></div>
<div class="step"><p><b>Scan and approve.</b> The file is scanned under the site's media rules and copied to an approved drive. It holds only numbers, no code that runs on load.</p></div>
<div class="step"><p><b>Inside: fingerprint again.</b> On the secure side the officer works out the checksum again. Same 64 characters: nothing changed on the way.</p></div>
<div class="step"><p><b>One character off?</b> If even one character differed, the file would be rejected. A checksum is not "nearly right": any change to any byte changes it completely.</p></div>
<div class="step"><p><b>Record and store.</b> The approved copy goes into storage with its record: name, source, checksum, licence, date and who approved it.</p></div>
</div>

## 4. Running inside

All the usual pieces work offline: engine, front end, document search. Turn off every update check and **telemetry** option (software quietly reporting back to its maker). Plan update cycles (quarterly, say) that repeat the import process. Keep model records as in Lesson 18.3.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** trust nothing that crossed the gap without a matching checksum.

**Equation:** accept file ⇔ SHA-256(file) = published SHA-256.

**Analogy:** a sealed evidence bag with a numbered tag, checked at every hand-over.

**Try it:** the checksum inside differs from the publisher's by one character. What do you do? (Reject the file; it is not the same file.)
</details>

<div class="meaning">

<dl>
<dt>SHA-256(file)</dt><dd>the file's fingerprint: 64 characters worked out from every byte of it</dd>
<dt>published SHA-256</dt><dd>the fingerprint the original publisher lists next to the download</dd>
<dt>⇔</dt><dd>"if and only if": accept when they match, reject when they do not</dd>
<dt>Physical meaning</dt><dd>The fingerprint is a seal on an evidence bag. Nobody can change what is inside without breaking the seal, so a match at both ends proves the file inside the gap is the very file the publisher released.</dd>
</dl>

</div>

Big files make each import slow, so plan time for it:

<div class="problem" data-problem="air-gapped-import"></div>

<div class="myth">

**"The model file is the dangerous part of an import."** A GGUF or safetensors file holds numbers, not programs. The engine, its Python packages and containers are code that runs, and they are the bigger risk. Check and approve them with the same care, or more.

</div>

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

<div class="keypoints">

- Air-gapped networks never touch the internet, so local models are the only AI they can use.
- Every model and every piece of software crosses the gap only after its SHA-256 matches the publisher's, outside and again inside.
- Accept only GGUF or safetensors model files; the engine and its dependencies are the larger risk.
- Turn off update checks and telemetry, and repeat the import process on a planned cycle.

</div>
