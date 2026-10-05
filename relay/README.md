# Website relay

A small Node server that takes the site's forms and forwards them to the school portal, so the
portal's API key never reaches the browser. nginx proxies `/api/` to it. Node 24, no npm
dependencies: the folder runs on its own (`node server.js`). Only a submission the portal could not
take is saved to disk, in the queue below, and for 72 hours at most (a careers application's CV
included: it is never written anywhere else); the logs hold status codes, timings and random
submission IDs only, never a file name or content.

## Run

```sh
PORTAL_URL=http://localhost:5003 WEBSITE_LEADS_API_KEY=... OUTBOX_DIR=/tmp/relay-outbox node relay/server.js
npm run test:relay
```

| Variable                | Meaning                                                  |
| ----------------------- | -------------------------------------------------------- |
| `PORTAL_URL`            | Portal base URL (required)                               |
| `WEBSITE_LEADS_API_KEY` | The portal's lead-only key, sent as `api-key` (required) |
| `PORT`                  | Listens on `127.0.0.1:PORT`, default 8787                |
| `STATE_DIRECTORY`       | Set by systemd; the queue is its `outbox/` folder        |
| `OUTBOX_DIR`            | The queue folder when `STATE_DIRECTORY` is not set       |

With neither `STATE_DIRECTORY` nor `OUTBOX_DIR`, nothing is queued (one warning at startup).

## Routes

`GET /api/health` → `200 {ok: true, queue: {size, oldestAgeSeconds}}` (`oldestAgeSeconds` null when
the queue is empty, `queue` null when it is disabled), without calling the portal. With
`?queue=<seconds>`, it answers `503 {ok: false, queue: …}` when the oldest queued submission is
older than that (and 400 when the value is not a whole number): the DigitalOcean uptime check on
`/api/health?queue=900` alerts when a submission has waited more than 15 minutes.

`POST /api/enroll` (JSON, 16 KB max) → the portal's `POST /api/v1/leads`. Fields, all strings:
`first`, `last`, `birth` (`YYYY-MM-DD`), `email`, `dial` (`+1`), `phone`, `mobile` (`yes`/`no`),
`lang` (`en`/`fr`), `contactBy` (`phone`/`sms`/`email`), `street`, `city`, `region`, `country`
(ISO 3166-1 alpha-2), `postal`, `program` (`fsd`/`ai`), and optional `heard` (a label from the
drawer, English or French), and optional `submissionId`: a UUID the drawer creates when it opens,
keeps across retries and renews after a success, passed to the portal, which answers a repeat of a
known ID as it did the first time without saving or emailing again. A non-empty `website`
(honeypot) answers 200 and sends nothing.

| Answer            | When                                                          |
| ----------------- | ------------------------------------------------------------- |
| `200 {ok: true}`  | Portal answered 201 or 409 (email already known), or honeypot |
| `400 {ok: false}` | Invalid field or JSON                                         |
| `502 {ok: false}` | Any other portal answer, network error, or 10 s timeout       |

Other errors: 404 unknown path, 405 wrong method, 413 body too large, 415 not JSON.

`POST /api/contact` (the home page's contact form) and `POST /api/pitch` (the Ventures pitch
drawer) → the portal's `POST /api/v1/form-submissions`, with the same honeypot and answers as
enroll, except that only a portal 201 answers 200 (a 409, an ID already used on another endpoint,
answers 502 and is not queued). Both require `first`, `last`, `email`, `phone` (as typed: digits,
spaces, `+ - ( ) .`, 7 to 15 digits), `lang` (`en`/`fr`), `consent` (`true`) and `submissionId`,
and take an optional `pageUrl` (http(s), 500 characters max). The relay adds `consentAt`, when it
received the submission, which a queued resend keeps.

- Contact also requires `division` (`codeboxx`/`solutions`/`academy`/`ventures`), `mobile`
  (`yes`/`no`) and `country` (ISO 3166-1 alpha-2), and takes an optional `message` (2000 max).
  The business form (/solutions, /case-studies) adds an optional `topic`
  (`issue`/`project`/`quote`/`factory`/`staffing`/`training`) and `company` (200 max), sent to
  the portal as `extra.topic` and `extra.company`.
- Pitch takes an optional `projectType` (`native-app`/`web-app`/`web-project`/`other`, sent to
  the portal as `extra.projectType`) and `description` (2000 max, sent as `message`); its
  division is always `ventures`.

`POST /api/careers` (the careers page's application form, **8 MB max**; every other route stays at
16 KB) → the same portal endpoint, with the same fields, rules and answers as contact and pitch,
and no division. It also requires `position` (100 max) and `startDate` (`YYYY-MM-DD`, a real date
no more than a year ago), both sent to the portal in `extra`, and `cv`: `{fileName, content}`, the
file name (255 max) and the file's content in plain base64 (no `data:` prefix), sent to the portal
as is. The relay decodes the content and refuses (400, `invalid=cv`) anything empty, over 5 MB, or
that is not a PDF (starts with `%PDF-`), a DOC (an OLE compound file) or a DOCX (a zip naming
`word/document.xml`), judged by the content alone. The portal checks it again, stores it in its
private bucket, and answers 503 when it could not, which is queued like any 5xx.

To add a form, add a route to `routes` in `server.js` and its portal path to `KINDS` in
`portal.js`, which the queue uses to resend it.

### Queue

On a portal 5xx, a 10 s timeout or a network error, a submission with a `submissionId` is written
to the queue folder as `<submissionId>.json` (mode `0600`; the kind, the exact body sent to the
portal, and when it was queued), and the visitor still gets the 502 and can retry. A portal 4xx is
not queued. The relay resends the queue at startup and every 5 minutes, one file at a time: a
received answer (201, or 409 for enroll) or a 4xx deletes the file, anything else keeps it, and
after 72 hours it is deleted with a `gave-up` log line. A live retry the portal receives also
deletes its queued copy. The files hold personal data for up to 72 hours.

## Deployment

The GitHub Action (`.github/workflows/deploy.yml`) runs `npm run test:relay` before building, then
rsyncs `relay/` (without `test/`) to `/opt/website-relay/` on the website droplet and restarts the
service only when a file changed, checking `/api/health` afterwards.

One-time droplet setup (Ubuntu 24.04, done 2026-09-28, as root):

1. Node 24 LTS from NodeSource (Ubuntu's own `nodejs` is Node 18, past end of life):
   `/etc/apt/keyrings/nodesource.gpg` (from `https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key`),
   `/etc/apt/sources.list.d/nodesource.list` (`deb [signed-by=…] https://deb.nodesource.com/node_24.x nodistro main`),
   `/etc/apt/preferences.d/nodejs` (pin `origin deb.nodesource.com` at 600), then `apt-get install nodejs`.
   `/etc/apt/apt.conf.d/51unattended-upgrades-nodesource` adds `"site=deb.nodesource.com"` to
   `Unattended-Upgrade::Origins-Pattern`, so Node updates install automatically.
2. `/opt/website-relay/` owned by `deploy`; `/etc/website-relay/env` (`PORTAL_URL`,
   `WEBSITE_LEADS_API_KEY`, `PORT=8787`), `root:deploy`, mode `0640`.
3. `/etc/systemd/system/website-relay.service`: `User=deploy`,
   `EnvironmentFile=/etc/website-relay/env`, `ExecStart=/usr/bin/node /opt/website-relay/server.js`,
   `Restart=always`, sandboxed (`ProtectSystem=strict`, `ProtectHome`, `NoNewPrivileges`, …);
   `systemctl enable --now website-relay`. Logs: `journalctl -u website-relay`.
   For the queue, the `[Service]` section also has `StateDirectory=website-relay`,
   `StateDirectoryMode=0700` and `UMask=0077`: systemd creates `/var/lib/website-relay` owned by
   `deploy`, writable despite `ProtectSystem=strict`, and passes it as `STATE_DIRECTORY`
   (`systemctl daemon-reload && systemctl restart website-relay` after adding them).
4. nginx: `/etc/nginx/conf.d/forms-ratelimit.conf` has
   `limit_req_zone $binary_remote_addr zone=forms:1m rate=5r/m;`, and the `codeboxx` site has
   `location /api/` (`limit_req zone=forms burst=3 nodelay`, `limit_req_status 429`,
   `client_max_body_size 16k`, `proxy_pass http://127.0.0.1:8787`, `proxy_set_header Host` and
   `X-Forwarded-For`, `proxy_read_timeout 15s`) plus `location = /api/health` without the limit,
   for uptime checks.

   The careers form has a block of its own for the larger body, next to `location /api/`.
   `client_body_buffer_size` keeps the body in memory: without it, nginx writes any body over
   16 KB to a temporary file under `/var/lib/nginx/body`, which would put a copy of the CV on disk.
   Then `nginx -t && systemctl reload nginx`.

   ```nginx
   location = /api/careers {
       limit_req zone=forms burst=3 nodelay;
       limit_req_status 429;
       client_max_body_size 8m;
       client_body_buffer_size 8m;
       proxy_pass http://127.0.0.1:8787;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_read_timeout 15s;
   }
   ```

5. `/etc/sudoers.d/website-relay`: `deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart website-relay`
   (mode `0440`, checked with `visudo -c`).

At launch behind Cloudflare, nginx must rate-limit on the visitor's IP (`real_ip`), not Cloudflare's.
