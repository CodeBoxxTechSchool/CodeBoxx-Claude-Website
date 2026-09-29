# Website relay

A small Node server that takes the site's forms and forwards them to the school portal, so the
portal's API key never reaches the browser. nginx proxies `/api/` to it. Node 24, no npm
dependencies: the folder runs on its own (`node server.js`). Only a submission the portal could not
take is saved to disk, in the queue below, and for 72 hours at most; the logs hold status codes,
timings and random submission IDs only.

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
the queue is empty, `queue` null when it is disabled), without calling the portal.

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

To add a form, add a route to `routes` in `server.js` and, if it can be queued, its portal path to
`KINDS` in `portal.js`.

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
   `client_max_body_size 16k`, `proxy_pass http://127.0.0.1:8787`) plus `location = /api/health`
   without the limit, for uptime checks.
5. `/etc/sudoers.d/website-relay`: `deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart website-relay`
   (mode `0440`, checked with `visudo -c`).

At launch behind Cloudflare, nginx must rate-limit on the visitor's IP (`real_ip`), not Cloudflare's.
