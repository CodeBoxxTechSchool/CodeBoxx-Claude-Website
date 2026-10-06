#!/usr/bin/env bash
# Issues the codeboxx.com certificate for the eight site names by DNS-01: someone with Wix DNS
# access adds the TXT records this prints. Run as root on the droplet, from a terminal:
#   issue-cert.sh [email] [certbot option...]      (ops/nginx/README.md)
# certbot calls it back as its auth hook (issue-cert.sh auth-hook), once per name.
# certbot renews by HTTP-01 instead, once switched with certbot reconfigure (README, step 2);
# running this again saves DNS-01 as the renewal method, so run that reconfigure again after.
set -euo pipefail

NAMES=(codeboxx.com www.codeboxx.com academy.codeboxx.com www.academy.codeboxx.com
  academie.codeboxx.com www.academie.codeboxx.com solutions.codeboxx.com www.solutions.codeboxx.com)
# Asked directly, so no resolver cache hides a record; Let's Encrypt asks them too.
NAMESERVERS=${NAMESERVERS:-ns0.wixdns.net ns1.wixdns.net}
TIMEOUT_MINUTES=${TIMEOUT_MINUTES:-60}
export ACME_TXT_FILE=${ACME_TXT_FILE:-/root/codeboxx-acme-txt}

die() {
  echo "issue-cert.sh: $*" >&2
  exit 1
}

auth_hook() {
  # certbot holds the hook's output until it returns, so the list goes to the terminal.
  (: >/dev/tty) 2>/dev/null || die "no terminal to show the TXT records on (renewal: README step 2)"
  exec 3>/dev/tty
  echo "_acme-challenge.${CERTBOT_DOMAIN:?} ${CERTBOT_VALIDATION:?}" >>"$ACME_TXT_FILE"
  [ "${CERTBOT_REMAINING_CHALLENGES:?}" = 0 ] || exit 0

  {
    echo
    echo "Add these TXT records in Wix DNS (codeboxx.com), replacing any older _acme-challenge value:"
    echo
    printf '  %-36s %s\n' 'Host name (.codeboxx.com)' 'Value'
    sort "$ACME_TXT_FILE" | while read -r name value; do
      printf '  %-36s %s\n' "${name%.codeboxx.com}" "$value"
    done
    echo
    echo "(also in $ACME_TXT_FILE) Waiting for them on $NAMESERVERS, up to $TIMEOUT_MINUTES min."
  } >&3

  local deadline=$((SECONDS + TIMEOUT_MINUTES * 60)) total found txt name value ns
  total=$(($(wc -l <"$ACME_TXT_FILE") * $(wc -w <<<"$NAMESERVERS")))
  while :; do
    found=0
    while read -r name value; do
      for ns in $NAMESERVERS; do
        txt=$(dig +short TXT "$name" "@$ns" </dev/null | tr -d '"') || true
        if grep -qxF -- "$value" <<<"$txt"; then found=$((found + 1)); fi
      done
    done <"$ACME_TXT_FILE"
    printf '\r%s  %d of %d records seen' "$(date +%T)" "$found" "$total" >&3
    [ "$found" -lt "$total" ] || break
    if ((SECONDS >= deadline)); then
      echo >&3
      die "timed out after $TIMEOUT_MINUTES min, $found of $total seen"
    fi
    sleep 30
  done
  echo "; Let's Encrypt checks them now. The records can be removed once it's issued." >&3
}

main() {
  command -v certbot >/dev/null || die "no certbot: apt install certbot"
  command -v dig >/dev/null || die "no dig: apt install bind9-dnsutils"
  local account=(--register-unsafely-without-email) domains=() name
  if [[ ${1:-} == *@* ]]; then
    account=(-m "$1")
    shift
  fi
  for name in "${NAMES[@]}"; do domains+=(-d "$name"); done
  rm -f "$ACME_TXT_FILE"
  certbot certonly --manual --preferred-challenges dns --cert-name codeboxx.com "${domains[@]}" \
    --manual-auth-hook "$(realpath "$0") auth-hook" --deploy-hook 'systemctl reload nginx' \
    --non-interactive --agree-tos --no-eff-email "${account[@]}" "$@"
  rm -f "$ACME_TXT_FILE"
}

if [ "${1:-}" = auth-hook ]; then auth_hook; else main "$@"; fi
