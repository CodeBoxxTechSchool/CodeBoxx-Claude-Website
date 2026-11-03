# nginx report

A daily email of what the website droplet's nginx answered with a server error (5xx) or a 404 the
day before, so a broken page or an old Wix URL without a redirect shows up without reading logs.
Node 24, no npm dependencies. It runs on the droplet from a systemd timer at 11:00 UTC (7:00
Eastern), reads `/var/log/nginx/access.log.1` (logrotate's copy of the previous UTC day) and, only
when there is something to report, sends a plain-text email through SendGrid.

- Every 5xx, grouped by status and path (without the query string).
- The 404s of GET and HEAD requests, by path, that came from a real link or will keep costing us.
  Scanners fake referrers and crawler user agents, so each reason is checked:
  - Linked from our own site (listed first): the referrer is one of our hosts (`OWN_HOSTS`:
    codeboxx.ai, codeboxx.com, codeboxx.biz, with or without `www`, and the droplet's IP) and the
    built page it names, read from the site root, has an `href` or `src` to that path.
  - Linked from another site: the referrer is a full http(s) URL on another host.
  - Crawled by a search engine: the user agent is a crawler (`CRAWLERS`).

  The last two count only for a page-like path (no extension, or `.html`), not for `/config.js`
  or `/env.json`. A referrer that is the requested URL itself, on any host, is a redirect hop
  (codeboxx.com and codeboxx.biz 301 to codeboxx.ai), not a link. Scanner probes (`PROBES` in
  `report.js`, matched on the percent-decoded path: dotfiles, `.php` and similar extensions,
  `wp-`, `/wordpress`, `/admin`, `/graphql`, `/api/`, Wix's `/{...}` image JSON, …) never count.
  Old Wix pages (`/post/...`, `/fr/blogue/...`, `/en/testimonial/...`) are what the report is for.

- The 404s that `ops/nginx/check-redirects.js` asks for on purpose (user agent
  `codeboxx-check-redirects`) never count either, nor do sitemap name guesses such as
  `/sitemap_index.xml`.
- How many 404 hits were ignored (probes, hits with none of the reasons above, and methods other
  than GET and HEAD), and the day's request count.

At most 50 rows per table. The email never holds an IP address or a user agent (read only to spot crawlers). On a day with
nothing to report, it sends nothing and logs one line.

## Run

```sh
node ops/nginx-report/report.js --dry-run path/to/access.log   # prints the email instead
npm run test:ops
```

| Variable           | Meaning                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `SENDGRID_API_KEY` | SendGrid key with Mail Send access (not needed with `--dry-run`) |
| `REPORT_TO`        | Recipient address(es), separated by `;` or `,`                   |
| `REPORT_FROM`      | A verified SendGrid sender, default `portal@codeboxx.com`        |
| `SITE_ROOT`        | The built site nginx serves, default `/var/www/codeboxx`         |

It exits 1, which marks the systemd run failed, when the log cannot be read or SendGrid refuses
the email (its status and error messages are printed, never the key).

## Install on the droplet

Nothing in `ops/` is deployed by the GitHub Action (which only runs its tests). As root:

```sh
install -d -m 0755 /opt/nginx-report
install -m 0644 report.js package.json /opt/nginx-report/
install -m 0644 nginx-report.service nginx-report.timer /etc/systemd/system/
install -d -m 0700 /etc/nginx-report
# SENDGRID_API_KEY=..., REPORT_TO=..., REPORT_FROM=portal@codeboxx.com
install -m 0600 /dev/null /etc/nginx-report/env && nano /etc/nginx-report/env
systemctl daemon-reload && systemctl enable --now nginx-report.timer
```

The service runs as a dynamic user in the `adm` group (to read nginx's logs, `www-data:adm 0640`),
with a read-only file system; systemd reads the env file as root before dropping privileges. It
reads the site's pages under `/var/www/codeboxx`, which must stay world-readable.

Check it:

```sh
node /opt/nginx-report/report.js --dry-run                          # the email, not sent
systemctl start nginx-report.service && journalctl -u nginx-report   # a real run
systemctl list-timers nginx-report.timer                            # the next run
```

To update, copy `report.js` again (the timer picks it up on its next run).
