import React from 'react';
import { Form } from 'react-bootstrap';
import countries from '../data/countries';

// Case-, accent- and punctuation-insensitive: "cote d ivoire" finds "Côte d'Ivoire".
const fold = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const sorted = {};
function optionsFor(lang) {
  sorted[lang] ??= countries
    .map((c) => ({ code: c.code, name: c[lang], key: fold(c[lang]) }))
    .sort((a, b) => a.name.localeCompare(b.name, lang));
  return sorted[lang];
}

// The exact code first ("us" → United States), then names starting with the text, then names
// containing it; the sort is stable, so each group stays alphabetical.
function filterOptions(options, query) {
  const q = fold(query);
  if (!q) return options;
  const rank = (o) =>
    o.code.toLowerCase() === q ? 0 : o.key.startsWith(q) ? 1 : o.key.includes(q) ? 2 : 3;
  return options
    .map((o) => [rank(o), o])
    .filter(([r]) => r < 3)
    .sort((a, b) => a[0] - b[0])
    .map(([, o]) => o);
}

// ARIA combobox with a listbox popup (no dependency). `value` is the ISO code; the input shows
// its name in `lang`, so a language change keeps the choice.
export default function CountryCombobox({ id, label, lang, value, onChange, strings }) {
  const options = optionsFor(lang);
  // null while not typing: the input then shows the picked country's name.
  const [query, setQuery] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const matches = query === null ? options : filterOptions(options, query);
  const listId = id + '-list';
  const optionId = (o) => `${id}-${o.code}`;
  const invalid = !open && !value && Boolean(query);

  React.useEffect(() => {
    if (open && matches[active])
      document.getElementById(optionId(matches[active]))?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const show = () => {
    setOpen(true);
    setActive(
      Math.max(
        0,
        matches.findIndex((o) => o.code === value)
      )
    );
  };
  const pick = (o) => {
    onChange(o.code);
    setQuery(null);
    setOpen(false);
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) show();
      else setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp' && open) {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && open && matches[active]) {
      e.preventDefault();
      pick(matches[active]);
    } else if (e.key === 'Escape' && open) {
      // Keeps the Offcanvas open: it skips closing when the Escape was handled.
      e.preventDefault();
      setOpen(false);
    }
  };
  const onBlur = () => {
    setOpen(false);
    // A fully typed name counts as a pick; anything else leaves the country unset.
    const exact = query !== null && options.find((o) => o.key === fold(query));
    if (exact) pick(exact);
  };

  return (
    <Form.Group className="country-combobox">
      <Form.Label htmlFor={id}>{label}</Form.Label>
      <Form.Control
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[active] ? optionId(matches[active]) : undefined}
        autoComplete="off"
        placeholder={strings.selectPlaceholder}
        value={query ?? options.find((o) => o.code === value)?.name ?? ''}
        isInvalid={invalid}
        onChange={(e) => {
          setQuery(e.target.value);
          if (value) onChange('');
          setOpen(true);
          setActive(fold(e.target.value) ? 0 : -1);
        }}
        onClick={() => !open && show()}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
      <ul
        id={listId}
        role="listbox"
        aria-label={label}
        className="dropdown-menu show country-list"
        hidden={!open}
      >
        {open &&
          matches.map((o, i) => (
            <li
              key={o.code}
              id={optionId(o)}
              role="option"
              aria-selected={i === active}
              className={'dropdown-item' + (i === active ? ' active' : '')}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(o)}
            >
              {o.name}
            </li>
          ))}
        {open && matches.length === 0 && (
          <li className="dropdown-item-text">{strings.countryNoMatch}</li>
        )}
      </ul>
      <Form.Control.Feedback type="invalid">{strings.countryPick}</Form.Control.Feedback>
    </Form.Group>
  );
}
