# Website relay

A small Node server that takes the site's forms and forwards them to the school portal, so the
portal's API key never reaches the browser. nginx proxies `/api/` to it. Node 24, no npm
dependencies: the folder runs on its own (`node server.js`), nothing is saved to disk, and the logs
hold status codes and timings only.

## Run

```sh
PORTAL_URL=http://localhost:5003 WEBSITE_LEADS_API_KEY=... PORT=8787 node relay/server.js
npm run test:relay
```

| Variable                | Meaning                                                  |
| ----------------------- | -------------------------------------------------------- |
| `PORTAL_URL`            | Portal base URL (required)                               |
| `WEBSITE_LEADS_API_KEY` | The portal's lead-only key, sent as `api-key` (required) |
| `PORT`                  | Listens on `127.0.0.1:PORT`, default 8787                |

## Routes

`GET /api/health` → `200 {ok: true}`, without calling the portal.

`POST /api/enroll` (JSON, 16 KB max) → the portal's `POST /api/v1/leads`. Fields, all strings:
`first`, `last`, `birth` (`YYYY-MM-DD`), `email`, `dial` (`+1`), `phone`, `mobile` (`yes`/`no`),
`lang` (`en`/`fr`), `contactBy` (`phone`/`sms`/`email`), `street`, `city`, `region`, `country`
(ISO 3166-1 alpha-2), `postal`, `program` (`fsd`/`ai`), and optional `heard` (a label from the
drawer, English or French). A non-empty `website` (honeypot) answers 200 and sends nothing.

| Answer            | When                                                          |
| ----------------- | ------------------------------------------------------------- |
| `200 {ok: true}`  | Portal answered 201 or 409 (email already known), or honeypot |
| `400 {ok: false}` | Invalid field or JSON                                         |
| `502 {ok: false}` | Any other portal answer, network error, or 10 s timeout       |

Other errors: 404 unknown path, 405 wrong method, 413 body too large, 415 not JSON.

To add a form, add a route to `routes` in `server.js`.
