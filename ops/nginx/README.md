# nginx: HTTPS and old Wix URLs

On the droplet, nginx answers every old Wix URL of `codeboxx.com`, `www.codeboxx.com`,
`academy.codeboxx.com`, `academie.codeboxx.com`, `solutions.codeboxx.com` (and their `www.`) with a
single 301 to its page on `https://codeboxx.com` (CLP-1342). Node 24, no npm dependencies.

- `www.codeboxx.com`: blog posts to `/blog/<slug>/`, a few old pages to their new page, anything
  else to the same path on the apex.
- `codeboxx.com`: the same old paths, but only those the new site doesn't serve; everything else is
  the new site, as before.
- academy, academie (in French) and solutions: old pages to their page or homepage section, anything
  else to the Academy (`/#academy`, `/fr/#academie`) or Solutions (`/#solutions`) section.
- The query string (`gclid`, `utm_*`) is kept, before the fragment. `/.well-known/acme-challenge/`,
  the bare IP and unknown hosts are never redirected.

Port 80 answers every host: old URLs go straight to their `https://codeboxx.com` page, other
`http://codeboxx.com` URLs to the same URL over https (one 301 either way), certificate challenges
are served from `/var/www/letsencrypt`, and the IP and unknown hosts get the site as before (the
uptime checks use the IP). Port 443 answers the eight names with one Let's Encrypt certificate
(CLP-1343): the same redirects, then the site; the IP and unknown names fail the handshake. The
certificate is issued by hand by DNS-01; renewal by HTTP-01 and HSTS are CLP-1381.

| File                               | What                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `redirects.tsv`                    | The redirects: host groups, old path → target (format in its header)     |
| `redirects.js`                     | Parses it, resolves a URL, writes `conf.d/codeboxx-redirects.conf`       |
| `conf.d/codeboxx-redirects.conf`   | Generated http-level maps, for `/etc/nginx/conf.d/`                      |
| `snippets/codeboxx-redirects.conf` | The `if`/`return 301` both server blocks include                         |
| `snippets/codeboxx-site.conf`      | The site itself (root, relay, pages), included by both server blocks     |
| `snippets/codeboxx-tls.conf`       | TLS settings (Mozilla "intermediate") for the 443 server blocks          |
| `codeboxx.conf`                    | Port 80 (`/etc/nginx/sites-available/codeboxx`)                          |
| `codeboxx-https.conf`              | Port 443 (`/etc/nginx/sites-available/codeboxx-https`)                   |
| `issue-cert.sh`                    | Issues the certificate by DNS-01, with TXT records added in Wix          |
| `old-urls/`                        | The Wix sitemaps (2026-09-30) the tests and the check go through         |
| `new-pages.txt`                    | The new site's pages (its sitemap), since the tests run before the build |
| `check-redirects.js`               | Sends every old URL to a running nginx and checks the answer             |

## Edit the redirects

Edit `redirects.tsv`, then:

```sh
node ops/nginx/redirects.js   # regenerates conf.d/codeboxx-redirects.conf
npm run test:ops              # fails while the generated file is out of date
```

The tests check that every old URL has a target, every target is a page in `new-pages.txt` (or a
file in `public/`), academie's targets are the French of academy's (`src/lib/i18nRoutes.js`), and
the apex never redirects a page of the new site. When pages are added or removed, refresh
`new-pages.txt` from the built site: `(cd dist && find . -name index.html | sed 's#^\.##; s#index.html$##' | sort)`.

## Test with Docker

Serves the built site (`npm run build`, or any folder holding `index.html` for each page) with the
official nginx image (`nginx:1.24` is Ubuntu 24.04's version), with a test CA's certificate for
the eight names where certbot puts the real one:

```sh
T=$(mktemp -d)
echo 'limit_req_zone $binary_remote_addr zone=forms:1m rate=5r/m;' > $T/forms-ratelimit.conf
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -subj /CN=test-ca \
  -days 2 -keyout $T/ca.key -out $T/ca.pem
openssl req -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -subj /CN=codeboxx.com \
  -keyout $T/privkey.pem -out $T/req.csr
san=$(printf 'DNS:%s,' {,www.}{,academy.,academie.,solutions.}codeboxx.com)
openssl x509 -req -in $T/req.csr -CA $T/ca.pem -CAkey $T/ca.key -CAcreateserial -days 2 \
  -extfile <(echo "subjectAltName=${san%,}") -out $T/cert.pem
cat $T/cert.pem $T/ca.pem > $T/fullchain.pem
docker run -d --name nginx-test -p 127.0.0.1:8089:80 -p 127.0.0.1:8443:443 \
  -v $T/forms-ratelimit.conf:/etc/nginx/conf.d/forms-ratelimit.conf:ro \
  -v "$PWD/ops/nginx/conf.d/codeboxx-redirects.conf:/etc/nginx/conf.d/codeboxx-redirects.conf:ro" \
  -v "$PWD/ops/nginx/codeboxx.conf:/etc/nginx/conf.d/codeboxx.conf:ro" \
  -v "$PWD/ops/nginx/codeboxx-https.conf:/etc/nginx/conf.d/codeboxx-https.conf:ro" \
  -v "$PWD/ops/nginx/snippets:/etc/nginx/snippets:ro" \
  -v $T:/etc/letsencrypt/live/codeboxx.com:ro \
  -v /dev/null:/etc/nginx/conf.d/default.conf:ro \
  -v "$PWD/dist:/var/www/codeboxx:ro" nginx:1.24
docker exec nginx-test nginx -t
node ops/nginx/check-redirects.js --base http://127.0.0.1:8089
node ops/nginx/check-redirects.js --base https://127.0.0.1:8443 --ca $T/ca.pem
docker rm -f nginx-test; rm -r $T
```

Without the `codeboxx-https.conf` mount it's step 1 below alone: `nginx -t` and the http check pass.

`check-redirects.js` sends each old URL (with and without its trailing slash, plus samples with a
query string, in capitals and under each prefix) with its old `Host:` header, expects one 301 to the
`redirects.tsv` target, then expects 200 from each target. It also checks that certificate
challenges aren't redirected. Over http, the apex's own pages must be one 301 to the same URL on
https, the targets are fetched through the IP, and the IP and an unknown host must get the site.
On both, the homepage must come gzipped with `Cache-Control: no-cache`, and its `/_astro/`
stylesheet gzipped and cached for a year (`immutable`). Over https, every request checks the certificate against its host name (`--ca`: a test CA
instead of the system's), the apex's own pages must answer 200, and the IP and an unknown name
must fail the handshake. It prints the failures and a summary, and exits 1 on any failure.

## Install on the droplet

Nothing in `ops/` is deployed by the GitHub Action. As root, from a copy of this folder
(`sites-enabled/codeboxx` is expected to be a symlink to `sites-available/codeboxx`; check with
`ls -l /etc/nginx/sites-enabled/` and copy over the real file if it isn't). The redirects
(`conf.d/codeboxx-redirects.conf`, `snippets/codeboxx-redirects.conf`) are installed since
CLP-1342; to update them, copy `conf.d/codeboxx-redirects.conf` again, `nginx -t && systemctl
reload nginx`. Before the DNS swap, the checks reach the droplet by its IP (and the `Host:`
header or SNI), so the http→https redirect is harmless while DNS still points at Wix.

**1. Port 80** (any time before the certificate):

```sh
apt install certbot bind9-dnsutils   # also enables certbot.timer (renewal, see step 2)
install -d -m 0755 /var/www/letsencrypt
cp /etc/nginx/sites-available/codeboxx /root/codeboxx.nginx.bak-$(date +%Y%m%d-%H%M)
install -m 0644 snippets/*.conf /etc/nginx/snippets/
install -m 0644 codeboxx.conf /etc/nginx/sites-available/codeboxx
nginx -t && systemctl reload nginx
```

Then, from anywhere (`--relay`: `/api/health` answers):

```sh
node ops/nginx/check-redirects.js --base http://159.223.145.47 --relay
```

**2. The certificate**, run from a root terminal (in `tmux`, so a dropped ssh doesn't stop it),
with someone who has Wix DNS access at hand:

```sh
./issue-cert.sh you@codeboxx.com   # optional account contact (no expiry emails since 2025)
```

It asks Let's Encrypt for one certificate (`--cert-name codeboxx.com`) for the eight names and
prints eight TXT records: host name in the codeboxx.com zone, and value. certbot shows a hook's
output only once it ends, so the script writes them straight to the terminal (and to
`/root/codeboxx-acme-txt`). The other person adds them in Wix DNS; the script checks
`ns0.wixdns.net` and `ns1.wixdns.net` every 30 s, shows how many it sees, and once all are there
(60 min at most) Let's Encrypt validates them. The certificate lands in
`/etc/letsencrypt/live/codeboxx.com/`; the TXT records can then be removed.

It doesn't renew by itself: `certbot.timer` tries twice a day from about 30 days before expiry
(90 days), and fails at once (no terminal to show the records on) until CLP-1381 moves renewal to
HTTP-01. Until then, running `issue-cert.sh` again in those 30 days renews it (with the TXT
records again); nginx is reloaded after each issuance.

**3. Port 443**, once the certificate exists (nginx won't load it before):

```sh
install -m 0644 codeboxx-https.conf /etc/nginx/sites-available/codeboxx-https
ln -s /etc/nginx/sites-available/codeboxx-https /etc/nginx/sites-enabled/codeboxx-https
nginx -t && systemctl reload nginx
```

Then, from anywhere:

```sh
node ops/nginx/check-redirects.js --base https://159.223.145.47 --relay
node ops/nginx/check-redirects.js --base http://159.223.145.47 --relay
```

(`ufw` is inactive; if it's ever turned on, it must allow 443.)

The DNS swap itself, once step 3 passes: [../swap-runbook.md](../swap-runbook.md).

**Compression and caching** (`snippets/codeboxx-site.conf`: gzip for CSS, JS, SVG, JSON and text;
a year for `/_astro/`, whose file names carry a content hash; a day for images, video and fonts;
`no-cache` for pages), once step 1 is in place:

```sh
cp /etc/nginx/snippets/codeboxx-site.conf /root/codeboxx-site.conf.bak-$(date +%Y%m%d-%H%M)
install -m 0644 snippets/codeboxx-site.conf /etc/nginx/snippets/
nginx -t && systemctl reload nginx
```

Then `node ops/nginx/check-redirects.js --base http://159.223.145.47 --relay` must print
`compression and caching ok`.

**Roll back**, `nginx -t && systemctl reload nginx` after each:

- Step 3: `rm /etc/nginx/sites-enabled/codeboxx-https`.
- Step 2: nothing is served from it until step 3; `certbot delete --cert-name codeboxx.com` removes
  the certificate.
- Step 1: `cp /root/codeboxx.nginx.bak-YYYYMMDD-HHMM /etc/nginx/sites-available/codeboxx` (the
  new snippets can stay, nothing else includes them).
- Compression and caching: `cp /root/codeboxx-site.conf.bak-YYYYMMDD-HHMM
/etc/nginx/snippets/codeboxx-site.conf`.
- The redirects: put the pre-CLP-1342 backup (`/root/codeboxx.nginx.bak-YYYYMMDD`) back and
  `rm /etc/nginx/conf.d/codeboxx-redirects.conf /etc/nginx/snippets/codeboxx-redirects.conf`.
