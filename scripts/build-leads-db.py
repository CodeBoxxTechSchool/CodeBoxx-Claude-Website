#!/usr/bin/env python3
"""Build a de-duplicated leads database from Wix CSV exports.

Input: Wix exports dropped in leads/raw/<site>/*.csv, where <site> is the
Wix site the file came from (e.g. main, academy, solutions). Both kinds of
Wix export are accepted:
  - Contacts (Contacts > More actions > Export)
  - Form submissions (Forms & Submissions > Export), one file per form; the
    file name becomes the form name.

Output, in leads/ (git-ignored, never deployed):
  - leads.sqlite  contacts + submissions tables, for the portal import
  - leads.csv     one row per contact
  - leads.json    contacts with their submissions nested

Contacts are de-duplicated by lower-cased email, falling back to phone digits
when a row has no email. Every original row is kept in `submissions` with its
site, source file, form and raw fields (JSON), so nothing from the exports is
lost.

This file handles personal data: it prints counts only, never names, emails or
phone numbers, and refuses to write anywhere git would track.

Site members: Wix lists them in Contacts, so the same script builds a separate
members database from Contacts > Site Members exports (their "Login Email" and
join date are recognized; member status and every other column are kept in
raw_json). Keep them inside the git-ignored leads/ folder:
  python3 scripts/build-leads-db.py --raw leads/members/raw --out leads/members

Usage:
  python3 scripts/build-leads-db.py
  python3 scripts/build-leads-db.py --raw DIR --out DIR   # e.g. for test data
"""

import argparse
import csv
import json
import os
import re
import sqlite3
import subprocess
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Normalized header (lower-case, non-alphanumerics collapsed to spaces) -> field.
# Wix contacts exports use "Email 1"/"Phone 1"; form exports use the form's own
# field labels, EN or FR.
FIELD_PATTERNS = [
    ('email', r'^((login |primary )?e ?mail|courriel|adresse (e ?mail|courriel))( \d+)?$|^email address$'),
    ('first_name', r'^(first ?name|pr[eé]nom|given name)$'),
    ('last_name', r'^(last ?name|nom( de famille)?|surname|family name)$'),
    ('full_name', r'^((full )?name|nom complet)$'),
    ('phone', r'^(phone|t[eé]l[eé]phone|phone number|mobile|cell)( \d+)?$'),
    ('company', r'^(company|entreprise|organi[sz]ation|soci[eé]t[eé])( name)?$'),
    ('message', r'^(message|comments?|write a message|leave us a message|details|project)'),
    ('submitted_at', r'^(submission (time|date)|submitted( at| on)?|created( at| date| on)?( utc.*)?|date'
                     r'|joined( at| on| date)?( utc.*)?|member since|sign ?up date|registration date)$'),
]

DATE_FORMATS = [
    '%Y-%m-%dT%H:%M:%S.%fZ', '%Y-%m-%dT%H:%M:%SZ', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%d %H:%M:%S',
    '%Y-%m-%d %H:%M', '%Y-%m-%d', '%m/%d/%Y %H:%M:%S', '%m/%d/%Y %H:%M', '%m/%d/%Y',
    '%b %d, %Y %I:%M %p', '%b %d, %Y', '%d/%m/%Y %H:%M', '%d/%m/%Y',
]


def norm_header(h):
    return re.sub(r'[^0-9a-zà-ÿ]+', ' ', h.strip().lower()).strip()


def map_headers(headers):
    mapping = {}
    for h in headers:
        n = norm_header(h)
        for field, pat in FIELD_PATTERNS:
            if field not in mapping.values() and re.search(pat, n):
                mapping[h] = field
                break
    return mapping


def parse_date(v):
    v = (v or '').strip()
    if not v:
        return None
    for fmt in DATE_FORMATS:
        try:
            d = datetime.strptime(v, fmt)
            if d.tzinfo is None:
                d = d.replace(tzinfo=timezone.utc)
            return d.astimezone(timezone.utc).isoformat().replace('+00:00', 'Z')
        except ValueError:
            continue
    return v  # keep unparsed text rather than dropping it


def clean_email(v):
    v = (v or '').strip().lower()
    return v if re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', v) else None


def phone_digits(v):
    d = re.sub(r'\D', '', v or '')
    return d if len(d) >= 7 else None


def ensure_ignored(path):
    """Refuse to write where git would track the file (i.e. inside the repo
    but not git-ignored)."""
    path = os.path.abspath(path)
    if not path.startswith(ROOT + os.sep):
        return  # outside the repo (e.g. a scratch dir for test data)
    # Check a file inside the folder: a "leads/" rule only matches a directory
    # git can see, and the folder may not exist yet.
    r = subprocess.run(['git', 'check-ignore', '-q', os.path.join(path, 'leads.sqlite')], cwd=ROOT)
    if r.returncode != 0:
        sys.exit(f'Refusing to write to {os.path.relpath(path, ROOT)}: it is not git-ignored.')


def read_rows(raw_dir):
    if not os.path.isdir(raw_dir):
        sys.exit(f'No input folder at {raw_dir}. Put Wix exports in <raw>/<site>/*.csv.')
    for site in sorted(os.listdir(raw_dir)):
        site_dir = os.path.join(raw_dir, site)
        if not os.path.isdir(site_dir):
            continue
        for name in sorted(os.listdir(site_dir)):
            if not name.lower().endswith('.csv'):
                continue
            path = os.path.join(site_dir, name)
            with open(path, newline='', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                mapping = map_headers(reader.fieldnames or [])
                form = os.path.splitext(name)[0]
                for raw in reader:
                    row = {field: (raw.get(h) or '').strip() for h, field in mapping.items()}
                    if row.get('full_name') and not (row.get('first_name') or row.get('last_name')):
                        first, _, last = row['full_name'].partition(' ')
                        row['first_name'], row['last_name'] = first, last
                    yield {
                        'site': site,
                        'source_file': name,
                        'form': form,
                        'email': clean_email(row.get('email')),
                        'first_name': row.get('first_name') or None,
                        'last_name': row.get('last_name') or None,
                        'phone': row.get('phone') or None,
                        'company': row.get('company') or None,
                        'message': row.get('message') or None,
                        'submitted_at': parse_date(row.get('submitted_at')),
                        'raw_json': json.dumps({k: v for k, v in raw.items() if k}, ensure_ascii=False),
                    }


SCHEMA = """
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY,
  dedupe_key TEXT NOT NULL UNIQUE,   -- lower-cased email, or 'phone:<digits>'
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  sites TEXT NOT NULL,               -- comma-separated Wix sites seen on
  first_seen TEXT,
  last_seen TEXT,
  submission_count INTEGER NOT NULL
);
CREATE TABLE submissions (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER REFERENCES contacts(id),  -- NULL when no email/phone
  site TEXT NOT NULL,
  source_file TEXT NOT NULL,
  form TEXT NOT NULL,
  submitted_at TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  message TEXT,
  raw_json TEXT NOT NULL             -- every original column, untouched
);
CREATE INDEX submissions_contact ON submissions(contact_id);
"""


def build(raw_dir, out_dir):
    ensure_ignored(out_dir)
    os.makedirs(out_dir, exist_ok=True)
    rows = list(read_rows(raw_dir))

    contacts = {}
    for r in rows:
        key = r['email'] or (f"phone:{phone_digits(r['phone'])}" if phone_digits(r['phone']) else None)
        r['dedupe_key'] = key
        if not key:
            continue
        c = contacts.setdefault(key, {'dedupe_key': key, 'sites': set(), 'dates': [], 'count': 0})
        c['count'] += 1
        c['sites'].add(r['site'])
        if r['submitted_at'] and re.match(r'\d{4}-', r['submitted_at']):
            c['dates'].append(r['submitted_at'])
        # Keep the first non-empty value seen for each field; rows are read in
        # site/file order, so fill gaps rather than overwrite.
        for f in ('email', 'first_name', 'last_name', 'phone', 'company'):
            if not c.get(f) and r.get(f):
                c[f] = r[f]

    db_path = os.path.join(out_dir, 'leads.sqlite')
    if os.path.exists(db_path):
        os.remove(db_path)
    db = sqlite3.connect(db_path)
    db.executescript(SCHEMA)
    ids = {}
    for key, c in contacts.items():
        cur = db.execute(
            'INSERT INTO contacts (dedupe_key, email, first_name, last_name, phone, company, sites,'
            ' first_seen, last_seen, submission_count) VALUES (?,?,?,?,?,?,?,?,?,?)',
            (key, c.get('email'), c.get('first_name'), c.get('last_name'), c.get('phone'),
             c.get('company'), ','.join(sorted(c['sites'])),
             min(c['dates']) if c['dates'] else None, max(c['dates']) if c['dates'] else None,
             c['count']),
        )
        ids[key] = cur.lastrowid
    for r in rows:
        db.execute(
            'INSERT INTO submissions (contact_id, site, source_file, form, submitted_at, email,'
            ' first_name, last_name, phone, company, message, raw_json)'
            ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
            (ids.get(r['dedupe_key']), r['site'], r['source_file'], r['form'], r['submitted_at'],
             r['email'], r['first_name'], r['last_name'], r['phone'], r['company'], r['message'],
             r['raw_json']),
        )
    db.commit()

    cols = ['id', 'email', 'first_name', 'last_name', 'phone', 'company', 'sites',
            'first_seen', 'last_seen', 'submission_count']
    contact_rows = db.execute(f'SELECT {", ".join(cols)} FROM contacts ORDER BY id').fetchall()
    with open(os.path.join(out_dir, 'leads.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(cols)
        w.writerows(contact_rows)

    sub_cols = ['site', 'form', 'submitted_at', 'message']
    nested = []
    for row in contact_rows:
        c = dict(zip(cols, row))
        c['submissions'] = [
            dict(zip(sub_cols, s)) for s in db.execute(
                f'SELECT {", ".join(sub_cols)} FROM submissions WHERE contact_id = ? ORDER BY submitted_at',
                (c['id'],))
        ]
        nested.append(c)
    with open(os.path.join(out_dir, 'leads.json'), 'w', encoding='utf-8') as f:
        json.dump(nested, f, ensure_ascii=False, indent=1)

    # Counts only: never print personal data.
    per_site = db.execute('SELECT site, COUNT(*) FROM submissions GROUP BY site ORDER BY site').fetchall()
    orphans = db.execute('SELECT COUNT(*) FROM submissions WHERE contact_id IS NULL').fetchone()[0]
    db.close()
    print(f'rows read: {len(rows)}')
    print('rows per site: ' + ', '.join(f'{s}={n}' for s, n in per_site))
    print(f'unique contacts: {len(contacts)}')
    print(f'rows without email or phone (kept, unlinked): {orphans}')
    print(f'wrote: {", ".join(os.path.join(os.path.relpath(out_dir, ROOT), n) for n in ("leads.sqlite", "leads.csv", "leads.json"))}')


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--raw', default=os.path.join(ROOT, 'leads', 'raw'))
    ap.add_argument('--out', default=os.path.join(ROOT, 'leads'))
    a = ap.parse_args()
    build(a.raw, a.out)
