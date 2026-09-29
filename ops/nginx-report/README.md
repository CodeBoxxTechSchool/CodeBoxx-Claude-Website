# nginx report

A daily email of what the website droplet's nginx answered with a server error (5xx) or a 404 the
day before, so a broken page or an old Wix URL without a redirect shows up without reading logs.
Node 24, no npm dependencies. It runs on the droplet from a systemd timer at 11:00 UTC (7:00
Eastern), reads `/var/log/nginx/access.log.1` (logrotate's copy of the previous UTC day) and, only
when there is something to report, sends a plain-text email through SendGrid.

- Every 5xx, grouped by status and path (without the query string).
- The 404s of GET and HEAD requests, by path, that look like they came from a real link or will
  keep costing us: a hit had a referrer (our own site, `OWN_HOSTS`: a broken internal link, listed
  first; or another site, such as Google or a site linking to an old Wix URL), or came from a
  search engine crawler (`CRAWLERS`), or the path got at least 3 hits that day. Scanner probes
  (`PROBES` in `report.js`, matched on the percent-decoded path: dotfiles, `.php` and similar
  extensions, `wp-`, `cgi-bin`, `vendor/`, …) never count, whatever their referrer or hits.
- How many 404 hits were ignored (probes, one-off requests with no referrer, and methods other
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
with a read-only file system; systemd reads the env file as root before dropping privileges.

Check it:

```sh
node /opt/nginx-report/report.js --dry-run                          # the email, not sent
systemctl start nginx-report.service && journalctl -u nginx-report   # a real run
systemctl list-timers nginx-report.timer                            # the next run
```

To update, copy `report.js` again (the timer picks it up on its next run).
