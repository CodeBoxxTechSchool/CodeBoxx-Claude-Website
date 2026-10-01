# Swap runbook: codeboxx.com, academy and solutions to the new site

How the eight site names move from Wix to the droplet (CLP-1347). There are two roles:

- **The DNS editor** edits records in the Wix DNS panel.
- **The droplet operator** runs the scripts (from any machine with Node 24 and a checkout of this
  repo) and uses ssh on the droplet.

Keep a log of each step with the time it was done (in the ticket, for example).

## 1. What changes and what doesn't

On swap day only the address records of the eight names change: they point at the droplet,
`159.223.145.47` (nginx: the static site, the relay, and the 301s from the old URLs, see
[nginx/README.md](nginx/README.md)). The nameservers stay `ns0.wixdns.net` and `ns1.wixdns.net`.
Never change them on swap day: `.com` caches the delegation for 48 h. MX, SPF, DKIM, DMARC and
every other record stay as they are. The Wix sites stay published and unchanged, so a rollback
only needs the old records back.

| Name (`.codeboxx.com`) | Today (TTL 3600)                                           | Swap day (TTL 300)     |
| ---------------------- | ---------------------------------------------------------- | ---------------------- |
| `codeboxx.com` (apex)  | A `185.230.63.107`, A `185.230.63.171`, A `185.230.63.186` | one A `159.223.145.47` |
| `www`                  | CNAME `cdn3.wixdns.net`                                    | CNAME `codeboxx.com`   |
| `academy`              | CNAME `cdn3.wixdns.net`                                    | CNAME `codeboxx.com`   |
| `www.academy`          | CNAME `cdn3.wixdns.net`                                    | CNAME `codeboxx.com`   |
| `academie`             | CNAME `cdn1.wixdns.net`                                    | CNAME `codeboxx.com`   |
| `www.academie`         | CNAME `cdn1.wixdns.net`                                    | CNAME `codeboxx.com`   |
| `solutions`            | CNAME `cdn3.wixdns.net`                                    | CNAME `codeboxx.com`   |
| `www.solutions`        | CNAME `cdn3.wixdns.net`                                    | CNAME `codeboxx.com`   |

The subdomains keep their record type, so the switch and the rollback are only a change of target,
and a new droplet IP would only need the apex edited. If the panel refuses `codeboxx.com` as a
CNAME target, use A `159.223.145.47` instead. The old hosts send HSTS (one year), so HTTPS must work
on all eight names as soon as they point at the droplet.

`ops/swap/check.js` (Node 24, no npm dependencies) does the DNS and HTTPS checks. It needs `dig`
(`apt install bind9-dnsutils`, or `dnsutils`; it says so when it's missing):

- `snapshot [--out file]`: the records above plus NS, MX, TXT, CAA, `_dmarc`, DKIM, as the Wix
  nameservers answer them, with TTLs. It prints a table and saves JSON, by default
  `~/swap-snapshot-<UTC time>.json`; it refuses to write inside the repo. These are public DNS
  records, but keep the files out of the repo.
- `ttl`: the TTL of the eight records on both Wix nameservers; passes when all are 300 or less.
- `check [--snapshot file] [--names a,b] [--expect-ip ip]`: for each name, the A answer (through
  the CNAME) on both Wix nameservers and on 1.1.1.1, 8.8.8.8 and 9.9.9.9 must be the droplet alone
  (it shows which ones still answer Wix). Then a valid certificate for the name, served by the
  droplet, with the days left, and `http://<name>/` answering one 301 to `https://codeboxx.com/…`.
  When `codeboxx.com` is among the names, it also checks `https://codeboxx.com/api/health`. With
  `--snapshot`, every record other than the eight names' A/AAAA/CNAME must still hold the
  snapshot's values. It prints one line per check and a summary, and exits 1 on any failure.

## 2. Before swap day

- [ ] Droplet operator: the certificate and port 443 are installed ([nginx/README.md](nginx/README.md),
      "Install on the droplet", steps 2 and 3), and both checks there pass with 0 failures:
      `node ops/nginx/check-redirects.js --base https://159.223.145.47 --relay` and the same with
      `http://`.
- [ ] Rehearsal passed (CLP-1345): with the eight names mapped to `159.223.145.47` in the hosts
      file, each name works over https in a browser, the redirects and the consent banner work,
      and one real submission of each form reaches the portal.
- [ ] The team knows the swap time, and the Wix content freeze has started (CLP-1346).
- [ ] Pick a low-traffic hour, with both roles free for the two hours after the switch.

A few hours before the switch (at least 1 h, 2 h gives some margin):

- [ ] Droplet operator: `node ops/swap/check.js snapshot`. Keep the file: it holds today's values.
- [ ] DNS editor: capture the full record list in the Wix DNS panel (screenshot or export), kept
      out of the repo. It covers records the snapshot can't guess the names of.
- [ ] DNS editor: set the TTL of the eight website records to 300 (all three apex A records).
      Change nothing else. Note the time.
- [ ] Droplet operator: `node ops/swap/check.js ttl` passes.

## 3. Go/no-go

Any "no" means the switch doesn't happen; everything stays as it is.

- [ ] `ttl` passes, and at least 1 h has passed since the TTL edit (resolvers may keep the old
      3600 s answers until then).
- [ ] The two `check-redirects.js` runs against the IP pass again today.
- [ ] Droplet operator: `certbot certificates` on the droplet shows the `codeboxx.com`
      certificate with more than 30 days left.
- [ ] `curl -s http://159.223.145.47/api/health` answers `{"ok":true,…}` with an empty queue.
- [ ] Rehearsal passed and no known blocker is open.
- [ ] The snapshot and the panel capture are saved.
- [ ] The DNS editor is signed in to the Wix DNS panel, and the panel lets the website records be
      edited.
- [ ] Ad conversions (CLP-1331): either done (then the two conversion steps of section 5 are
      part of the first hour), or the team knows Ads stops counting leads at the swap until it is.

## 4. The switch

1. [ ] Droplet operator: run the deploy workflow on `main` (Actions, "Run workflow", or
       `gh workflow run deploy.yml --ref main`), so the droplet has the latest Sanity content.
       Wait until it succeeds.
2. [ ] Droplet operator: `node ops/swap/check.js snapshot` again. This one is the rollback
       reference: the eight records show TTL 300, every other record matches the first snapshot.
3. [ ] DNS editor, the canary: the apex (one A `159.223.145.47`: edit one of the three A records,
       delete the other two), then `solutions` and `www.solutions` (CNAME target `codeboxx.com`).
       TTL 300. Note the time. The apex is part of the canary because the CNAMEs point at it, and
       it carries little traffic today (Wix sends it on to `www`). A warning that the domain gets
       disconnected from the Wix site is expected: the Wix site stays published. If the panel
       refuses to edit the records at all, stop: that's a no-go.
4. [ ] Droplet operator, about 5 min later:
       `node ops/swap/check.js check --names codeboxx.com,solutions.codeboxx.com,www.solutions.codeboxx.com`.
       Public resolvers can take up to 5 min more (TTL 300), so re-run until it passes. If it
       doesn't within 15 min, roll back (section 6).
5. [ ] DNS editor: the other five (`www`, `academy`, `www.academy`, `academie`, `www.academie`):
       CNAME target `codeboxx.com`, TTL 300. Note the time.
6. [ ] Droplet operator, about 5 min later: `node ops/swap/check.js check --snapshot <file from step 2>`
       passes, re-run as in step 4.
7. [ ] Droplet operator: `node ops/nginx/check-redirects.js --base https://codeboxx.com --relay`
       (every old URL over live DNS) and `node ops/nginx/check-redirects.js --base http://159.223.145.47 --relay`
       pass with 0 failures.

## 5. The first hour

- [ ] Droplet operator: re-run `check --snapshot <file>` at about 15, 30 and 60 min. It should stay
      green; a resolver still showing Wix after 15 min ignores the TTL and catches up by itself.
- [ ] Browse each of the eight names in a private window: `https://<name>/` lands on the right
      page of `https://codeboxx.com` with no certificate warning. Also once in a browser that
      visited the old sites (it holds their HSTS).
- [ ] The consent banner shows on a first visit to `https://codeboxx.com/` and `/fr/`, and the
      choice sticks.
- [ ] Only if CLP-1331 is done, before the test submissions: someone with GA4 access marks
      `generate_lead` as a key event in the GA4 property `G-7L7VBFGNTF` (Admin → Events, or Key
      events).
- [ ] One real submission per form, with a plus address of the person testing (their own mailbox
      with `+swap-<form>` added before the `@`): enroll (the enroll drawer), contact (home page),
      pitch (Ventures), careers (with a small PDF as the CV). Each shows its success message, then:
  - [ ] contact, pitch and careers appear in the portal's staff pages under "Form submissions":
        mark each as spam or handled;
  - [ ] enroll created a registration in the portal: mark it the same way;
  - [ ] `https://codeboxx.com/api/health` shows `"size":0` in its queue.
- [ ] Only if CLP-1331 is done, after the test submissions: the test leads show in GA4 DebugView
      (or Realtime) as `generate_lead`, and in Google Ads → Goals → Conversions, in the lead
      conversion's diagnostics (account `AW-16665523741`, conversion label
      `J94oCPfX3PYZEJ3s3oo-`).
- [ ] Mail: send a message from an outside mailbox to an @codeboxx.com mailbox and one back. Both
      arrive; the received message's headers (show original) show `spf=pass`, `dkim=pass` and
      `dmarc=pass`.
- [ ] Droplet operator, DigitalOcean → Monitoring → Uptime: point the three checks from
      `http://159.223.145.47/…` to `https://codeboxx.com/`, `https://codeboxx.com/api/health` and
      `https://codeboxx.com/api/health?queue=900`, and turn on the certificate expiry alert. Test
      an alert: point one check at `https://codeboxx.com/api/health?queue=x` (answers 400) until
      the alert arrives, then set it back and see it recover.
- [ ] Droplet operator, on the droplet for the first hour: `journalctl -u website-relay -f` and
      `tail -f /var/log/nginx/error.log`. Look for portal errors, 502s and queued submissions.

## 6. Rollback

Roll back when:

- HTTPS fails on any name and isn't fixed within 15 min;
- a form doesn't reach the portal and isn't fixed within 15 min;
- the site or `/api/health` is down and isn't fixed within 15 min;
- anything touches mail. First restore the mail record from the snapshot (below); roll back the
  website records too unless the cause is clearly understood.

Steps:

1. [ ] DNS editor: put the website records back to the step 2 snapshot values (the "Today" column
       of section 1): the three apex A records `185.230.63.107`, `185.230.63.171`,
       `185.230.63.186`; CNAME `cdn3.wixdns.net` for `www`, `academy`, `www.academy`, `solutions`,
       `www.solutions`; CNAME `cdn1.wixdns.net` for `academie` and `www.academie`. TTL 300. If Wix
       shows the domain as disconnected from its site, reconnect it in the Wix domain settings.
2. [ ] DNS editor: if any other record was changed by mistake, restore it from the snapshot and the
       panel capture.
3. [ ] Droplet operator: `node ops/swap/check.js check --snapshot <file from step 2>`: every
       "unchanged" line passes (the dns, https and http lines now fail: they reach Wix). Visitors are back on Wix
       within about 5 min, a little longer on resolvers that ignore the TTL. Wix still serves
       valid HTTPS, so HSTS is no problem.
4. [ ] Browse `https://www.codeboxx.com/` and `https://academy.codeboxx.com/`: the Wix sites, no
       certificate warning. Send the mail test again if mail was involved.
5. [ ] Droplet operator: point the uptime checks back to `http://159.223.145.47/…`.
6. [ ] Tell the team. Submissions made during the swap are in the portal already. The droplet stays
       as it is; after the fix, start again from section 3.

## 7. After the swap

- After a quiet day or two, the DNS editor raises the TTL of the eight records back to 3600.
- CLP-1381: certificate renewal by HTTP-01 and HSTS, before the certificate's last 30 days.
- CLP-1348: sitemap submission and the 404 watch.
- CLP-1318: the final Wix export, before Wix runs out (2026-10-24).
- CLP-1350: DNS moves out of Wix.
- CLP-1351: the Wix sites are unpublished and Wix cancelled.
- CLP-1320: the MX record (unchanged by the swap).
