---
title: Running it on your office network
summary: Turn one machine into a private AI service for a home or office, with logins, encrypted connections, safe remote access and backups. Includes mini project 7.
minutes: 30
updated: 2026-11-22
sources:
  - 'Open WebUI documentation: users, roles and groups (official page), https://docs.openwebui.com'
  - 'Caddy web server: automatic HTTPS and reverse proxy (official page), https://caddyserver.com/docs/'
  - 'WireGuard VPN (official page), https://www.wireguard.com'
  - 'Ollama FAQ: exposing Ollama on the network (official page), https://docs.ollama.com/faq'
quiz:
  - q: Which part should face your colleagues' browsers?
    choices: ['The chat front end (for example Open WebUI) with logins', 'The raw Ollama port with no login', 'The model file share']
    ans: 0
    why: The engine's port has no logins. Put a front end with accounts in front of it, and let only that talk to the engine.
  - q: A colleague wants to use the office AI from home. What is the safe way?
    choices: ['Open the port on the router to the internet', 'Connect through the office VPN', 'Email them the model']
    ans: 1
    why: A VPN puts their laptop on the office network securely. An open port invites the whole internet.
  - q: What do you need to back up on the AI server?
    choices: ['The front end data (accounts, chats, uploaded documents) and your settings', 'Only the model files', 'Nothing, it is all temporary']
    ans: 0
    why: Models can be downloaded again. Accounts, chats, document indexes and settings cannot.
---

**Module 15 · about 30 minutes · read first: 5.5, 9.5 and 11.1.** You'll be able to share one local AI with a household or team, safely. This is mini project 7.

<div class="bigidea">Put a front end with logins in front of the engine, let only that front end reach the engine, and bring remote staff in through a VPN, never through an open port.</div>

## 1. Why this matters

A model on one desk helps one person. The same model, reachable from every laptop in the office with each person's own login and history, is a private ChatGPT for the whole team. Getting there is mostly ordinary network housekeeping, and skipping it is how private data leaks.

## 2. The shape of a small office AI server

```
laptops and phones ──(office Wi-Fi or VPN)──> front end (Open WebUI, port 443 via Caddy)
                                                   │
                                                   └──> engine (Ollama or llama-server, port 11434 or 8080,
                                                         reachable only from the front end)
```

Three layers: the **engine** runs the model; the **front end** gives people logins, chats and document upload; the **network** decides who can reach what.

Follow one question from a laptop to the model and back, in the firm from section 5:

<div class="steps">
<div class="step"><p><b>The laptop.</b> Priya, a junior, opens <code>https://ai.office.lan</code> on the office Wi-Fi. Her browser connects to port 443 on the server's fixed address, 192.168.1.50.</p></div>
<div class="step"><p><b>Encryption.</b> Caddy answers on port 443 with HTTPS, so her password and question cross the Wi-Fi scrambled. It passes the request to Open WebUI on the same machine.</p></div>
<div class="step"><p><b>Login and groups.</b> Open WebUI checks who she is. Her group may use the 12B model, not the 27B one, and she sees only her own chats.</p></div>
<div class="step"><p><b>The engine.</b> Open WebUI sends the question to Ollama on <code>127.0.0.1:11434</code>. That address answers only programs on the same machine, so no laptop can reach Ollama directly.</p></div>
<div class="step"><p><b>Back, and kept.</b> The answer returns the same way. The chat is saved in Open WebUI's data folder, which a nightly script copies to the office NAS. A colleague at home takes the same path, after first joining through the WireGuard VPN.</p></div>
</div>

## 3. Step by step

1. **Fixed address.** Give the server a fixed IP address in your router's settings (a "DHCP reservation"), for example 192.168.1.50, and a friendly name if your router allows it.
2. **Engine on the inside only.** If the front end runs on the same machine, leave the engine on `127.0.0.1` (its default): only programs on that machine can reach it. If it runs elsewhere, bind it to the network and use the firewall to allow only the front end's address.
3. **Front end with accounts.** Install Open WebUI (Lesson 9.5). The first account becomes the admin. Turn off open sign-up, create accounts for each person, and use groups to decide who can use which model.
4. **Encryption.** Put a small web server such as Caddy in front so people connect over HTTPS, even inside the office. Passwords and chats then travel encrypted over the Wi-Fi.
5. **Firewall.** Allow port 443 from the office network only. Block everything else from outside.
6. **Remote staff.** Use the office VPN (WireGuard, or a managed one your IT already has). Never forward the port on your router to the internet.
7. **Backups.** Back up the front end's data folder (users, chats, uploaded files, settings) every night to another disk, and test a restore once.
8. **Updates.** Pick a monthly slot to update the engine, the front end and the operating system, after reading their release notes.

## 4. Household version

At home you can skip HTTPS and the firewall if the AI machine and devices sit on your own Wi-Fi with a strong password. Still use separate accounts so children's and adults' chats stay apart, and keep the router's port forwarding off.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** least access. Each part can reach only what it needs.

**Equation:** exposure = (number of places that can reach a port) × (what an attacker gets there). An engine with no login reachable only from 127.0.0.1 has an exposure near zero; the same engine open to the internet has unlimited reach and full access.

**Analogy:** a shop. Customers use the front counter (the front end). The stockroom (the engine) has a staff-only door.

**Try it:** Which has the larger exposure: Open WebUI with logins on the office network, or Ollama with no login on the office network? (Ollama: same reach, but no login, so anyone on the Wi-Fi can use it and see what it is sent.)
</details>

<div class="meaning">

<dl>
<dt>reach</dt><dd>how many devices or places can connect to a port: one machine (127.0.0.1), the office network, or the whole internet</dd>
<dt>access</dt><dd>what someone gets once connected: nothing without a login, or everything if there is no login</dd>
<dt>exposure</dt><dd>reach × access: how much harm an open door could do</dd>
<dt>VPN</dt><dd>an encrypted tunnel that puts a remote laptop on the office network, so nothing has to face the internet</dd>
<dt>Physical meaning</dt><dd>A shop. Customers use the front counter, where staff check who they are. The stockroom has a staff-only door that opens only from inside. Leaving the stockroom door open to the street, even "just for a minute", is how things go missing.</dd>
</dl>

</div>

<div class="problem" data-problem="office-network-backup"></div>

<div class="myth">

**"It is only on the office Wi-Fi, so it does not need logins."** Anyone on that Wi-Fi can reach it: visitors on a shared password, a contractor's laptop, or one infected device. Without logins they can use the model and read whatever is sent to it. Logins also keep colleagues' chats apart, which matters for salaries, HR and client files.

</div>

## 5. Worked example

*Made-up numbers.* Patel and Co., a 9-person accounting firm, has a 64 GB Mac mini in the server cupboard. Ollama listens on 127.0.0.1 only. Open WebUI runs on the same Mac behind Caddy at `https://ai.office.lan`. Partners see a 27B model; juniors see a 12B one for speed. Two staff working from home connect through the office WireGuard VPN. A nightly script copies Open WebUI's data folder to the office NAS. Total extra cost: an afternoon of set-up.

## 6. Mini project 7: share your local AI

1. Pick the machine and give it a fixed address.
2. Run your engine bound to 127.0.0.1 and Open WebUI on the same machine.
3. Create two accounts and confirm each sees only its own chats.
4. Open the chat from a phone on the same Wi-Fi.
5. Write down how you would back up the front end's data and when you will update.

## 7. Practice

1. Why keep the engine on 127.0.0.1 when the front end is on the same machine?
2. What is the one router setting you should never use for the AI server?
3. Which data on the server can you not download again?

<details>
<summary>Answers</summary>

1. Then nothing else on the network can reach the engine's login-free port.
2. Port forwarding to the internet.
3. User accounts, chat history, uploaded documents, document indexes and settings.
</details>

**New words:** *DHCP reservation*, *reverse proxy*, *HTTPS*, *firewall*, *VPN*, *least access*.

<div class="keypoints">

- Three layers: the engine runs the model, the front end (Open WebUI) gives logins and chats, the network decides who reaches what.
- Keep the engine on 127.0.0.1 when the front end is on the same machine, so its login-free port is unreachable.
- Use HTTPS (Caddy), turn off open sign-up, give each person an account, and use groups for model access.
- Remote staff come in through a VPN; never forward the server's port on the router to the internet.
- Back up the front end's data folder nightly (accounts, chats, uploads, settings) and test a restore; models can be downloaded again.

</div>
