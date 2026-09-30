# nginx: old Wix URLs

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

| File                               | What                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `redirects.tsv`                    | The redirects: host groups, old path → target (format in its header)     |
| `redirects.js`                     | Parses it, resolves a URL, writes `conf.d/codeboxx-redirects.conf`       |
| `conf.d/codeboxx-redirects.conf`   | Generated http-level maps, for `/etc/nginx/conf.d/`                      |
| `snippets/codeboxx-redirects.conf` | The `if`/`return 301` the site's server block includes                   |
| `codeboxx.conf`                    | The droplet's full site config (`/etc/nginx/sites-available/codeboxx`)   |
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
official nginx image (`nginx:1.24` is Ubuntu 24.04's version):

```sh
echo 'limit_req_zone $binary_remote_addr zone=forms:1m rate=5r/m;' > /tmp/forms-ratelimit.conf
docker run -d --name redirects-test -p 127.0.0.1:8089:80 \
  -v /tmp/forms-ratelimit.conf:/etc/nginx/conf.d/forms-ratelimit.conf:ro \
  -v "$PWD/ops/nginx/conf.d/codeboxx-redirects.conf:/etc/nginx/conf.d/codeboxx-redirects.conf:ro" \
  -v "$PWD/ops/nginx/codeboxx.conf:/etc/nginx/conf.d/codeboxx.conf:ro" \
  -v "$PWD/ops/nginx/snippets:/etc/nginx/snippets:ro" \
  -v /dev/null:/etc/nginx/conf.d/default.conf:ro \
  -v "$PWD/dist:/var/www/codeboxx:ro" nginx:1.24
docker exec redirects-test nginx -t
node ops/nginx/check-redirects.js --base http://127.0.0.1:8089
docker rm -f redirects-test
```

`check-redirects.js` sends each old URL (with and without its trailing slash, plus samples with a
query string, in capitals and under each prefix) with its old `Host:` header, expects one 301 to the
`redirects.tsv` target, then expects 200 from each target with `Host: codeboxx.com`. It also checks
that certificate challenges, the IP, an unknown host and the apex's own pages aren't redirected.
It prints the failures and a summary, and exits 1 on any failure.

## Install on the droplet

Nothing in `ops/` is deployed by the GitHub Action. As root, from a copy of this folder
(`sites-enabled/codeboxx` is expected to be a symlink to `sites-available/codeboxx`; check with
`ls -l /etc/nginx/sites-enabled/` and copy over the real file if it isn't):

```sh
cp /etc/nginx/sites-available/codeboxx /root/codeboxx.nginx.bak-$(date +%Y%m%d)
install -m 0644 conf.d/codeboxx-redirects.conf /etc/nginx/conf.d/
install -d -m 0755 /etc/nginx/snippets
install -m 0644 snippets/codeboxx-redirects.conf /etc/nginx/snippets/
diff /etc/nginx/sites-available/codeboxx codeboxx.conf   # only the include should differ
install -m 0644 codeboxx.conf /etc/nginx/sites-available/codeboxx
nginx -t && systemctl reload nginx
```

Then, from anywhere (it works before the DNS swap, through the `Host:` header):

```sh
node ops/nginx/check-redirects.js --base http://159.223.145.47 --relay   # --relay: /api/health answers
```

To update the redirects later, copy `conf.d/codeboxx-redirects.conf` again, `nginx -t && systemctl
reload nginx`.

Roll back: put the backup back, remove the two files, reload.

```sh
cp /root/codeboxx.nginx.bak-YYYYMMDD /etc/nginx/sites-available/codeboxx
rm /etc/nginx/conf.d/codeboxx-redirects.conf /etc/nginx/snippets/codeboxx-redirects.conf
nginx -t && systemctl reload nginx
```
